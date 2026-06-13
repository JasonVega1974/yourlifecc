// api/admin/send-message.js
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// MANUAL-TRIGGER ADMIN ENDPOINT — proxies admin.html's outreach
// message send to Brevo server-side. Replaces the old client-side
// fetch + runtime-prompt path (admin.html:1453-1466 before SPEC 5b)
// which exposed the master Brevo API key in the operator's browser
// tab via window.BREVO_API_KEY for the session lifetime.
//
// Now: the browser sends a Bearer-authenticated POST here with the
// recipient list + message body; this function holds the Brevo key
// in Vercel env vars and forwards to Brevo server-side. The browser
// never sees the Brevo key at all.
//
// AUTH
//   Authorization: Bearer <secret>
//   Accepted: ADMIN_SECRET (preferred) or CRON_SECRET (fallback)
//
// REQUEST
//   POST /api/admin/send-message
//   JSON body:
//     {
//       recipients: ['a@b.com', ...],   // 1-100 emails
//       subject:    string,             // required, <= 200 chars
//       body:       string,             // text body, <= 100k chars
//                                       // (newlines converted to <br> for HTML)
//       fromName:   string              // optional, defaults to "YourLife CC"
//     }
//
// RESPONSE
//   200 { ok:true, sent:N, failed:N, results:[{email, ok, status}] }
//   400 invalid input
//   401 Unauthorized (bad/missing Bearer secret)
//   403 Origin not allowed
//   500 Server configuration error (env vars missing)
//
// CORS
//   Origin must be https://yourlifecc.com or https://www.yourlifecc.com.
//   admin.html is hosted on production; no public access expected.
//
// ENV VARS (already set in Vercel for the send-announcement.js path)
//   ADMIN_SECRET (preferred) OR CRON_SECRET
//   BREVO_API_KEY

const BREVO_HOST = 'api.brevo.com';
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

const ALLOWED_ORIGINS = new Set([
  'https://yourlifecc.com',
  'https://www.yourlifecc.com'
]);

const MAX_RECIPIENTS = 100;
const MAX_SUBJECT    = 200;
const MAX_BODY       = 100000;
const MAX_FROM_NAME  = 80;

// Per-recipient send. Mirrors the _brevoSend helper shape in
// api/admin/send-announcement.js:296-323 (minus List-Unsubscribe
// headers — admin manual sends are one-off, not part of a list-drip).
async function _brevoSend({ to, subject, html, text, fromName, brevoKey }){
  const payload = {
    sender:  { name: fromName || 'YourLife CC', email: 'info@kingdom-creatives.com' },
    to:      [{ email: to }],
    replyTo: { email: 'info@kingdom-creatives.com', name: 'YourLife CC' },
    subject,
    htmlContent: html,
    textContent: text
  };
  const r = await fetch(`https://${BREVO_HOST}/v3/smtp/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key':      brevoKey,
      'accept':       'application/json'
    },
    body: JSON.stringify(payload)
  });
  return { ok: r.ok, status: r.status };
}

module.exports = async function handler(req, res){
  // CORS
  const origin = req.headers.origin || '';
  const isAllowed = ALLOWED_ORIGINS.has(origin);
  if(isAllowed){
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if(req.method === 'OPTIONS') return res.status(isAllowed ? 200 : 403).end();
  if(req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });
  if(!isAllowed)               return res.status(403).json({ error: 'Origin not allowed' });

  // Auth — accept ADMIN_SECRET (preferred) OR CRON_SECRET (fallback).
  // Mirrors api/admin/send-announcement.js:338-350.
  const adminSecret = process.env.ADMIN_SECRET || '';
  const cronSecret  = process.env.CRON_SECRET  || '';
  if(!adminSecret && !cronSecret){
    console.error('send-message: no ADMIN_SECRET or CRON_SECRET set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const auth  = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const validAuth =
       (adminSecret && token === adminSecret)
    || (cronSecret  && token === cronSecret);
  if(!validAuth) return res.status(401).json({ error: 'Unauthorized' });

  // Brevo key
  const brevoKey = process.env.BREVO_API_KEY;
  if(!brevoKey){
    console.error('send-message: BREVO_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Body + input validation
  const body       = req.body || {};
  const recipients = Array.isArray(body.recipients) ? body.recipients : [];
  const subject    = String(body.subject  || '').trim();
  const message    = String(body.body     || '');
  const fromName   = String(body.fromName || 'YourLife CC').trim();

  if(!recipients.length)             return res.status(400).json({ error: 'recipients required' });
  if(recipients.length > MAX_RECIPIENTS) return res.status(400).json({ error: 'max ' + MAX_RECIPIENTS + ' recipients per call' });
  for(const e of recipients){
    if(typeof e !== 'string' || !EMAIL_RE.test(e)){
      return res.status(400).json({ error: 'invalid recipient: ' + String(e).slice(0, 80) });
    }
    if(/[\r\n]/.test(e)) return res.status(400).json({ error: 'invalid recipient (newline)' });
  }
  if(!subject)                        return res.status(400).json({ error: 'subject required' });
  if(subject.length > MAX_SUBJECT)    return res.status(400).json({ error: 'subject too long (max ' + MAX_SUBJECT + ')' });
  if(/[\r\n]/.test(subject))          return res.status(400).json({ error: 'subject contains newline' });
  if(message.length > MAX_BODY)       return res.status(400).json({ error: 'body too long (max ' + MAX_BODY + ' chars)' });
  if(fromName.length > MAX_FROM_NAME) return res.status(400).json({ error: 'fromName too long (max ' + MAX_FROM_NAME + ')' });

  // Per-recipient send — same loop shape as the old client path.
  const htmlBody = message.replace(/\n/g, '<br>');
  const results  = [];
  for(const email of recipients){
    try {
      const r = await _brevoSend({ to: email, subject, html: htmlBody, text: message, fromName, brevoKey });
      results.push({ email, ok: r.ok, status: r.status });
    } catch(e){
      results.push({ email, ok: false, status: (e && e.message) || 'error' });
    }
  }

  const sent   = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  return res.status(200).json({ ok: true, sent, failed, results });
};
