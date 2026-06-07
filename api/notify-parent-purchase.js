// Vercel Serverless Function — Tab 2 Inc 7 Step B
// File location: api/notify-parent-purchase.js
//
// CommonJS — per CLAUDE.md, ESM has historically caused 502s on this
// deploy. Keep this file CommonJS.
//
// Fires a Brevo transactional email to the signed-in parent when a kid
// submits a purchase request that crosses D.purchaseApprovalThreshold.
//
// The signed-in user (auth.users) IS the parent — kids use sub-profiles
// inside one Supabase account. The client passes the parent's email in
// the body; we validate the format and CORS-gate to yourlifecc.com.
//
// Best-effort delivery: failures don't block the request flow on the
// client side. The kid still sees the "sent to Mom for approval" toast
// + the parent still sees the request in the Parent Hub queue.

const https = require('https');

const ALLOWED_ORIGINS = new Set([
  'https://yourlifecc.com',
  'https://www.yourlifecc.com'
]);

// Conservative email regex. Permissive enough for real addresses,
// strict enough to refuse obvious garbage / injection attempts.
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

function esc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const isAllowed = ALLOWED_ORIGINS.has(origin);
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(isAllowed ? 200 : 403).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });
  if (!isAllowed)              return res.status(403).json({ error: 'Origin not allowed' });

  const { to, kidName, name, amount, cat, requestedAt } = req.body || {};

  if (typeof to !== 'string' || !EMAIL_RE.test(to)){
    return res.status(400).json({ error: 'Invalid recipient email' });
  }
  if (typeof name !== 'string' || !name.trim()){
    return res.status(400).json({ error: 'Missing item name' });
  }
  const amtNum = Number(amount);
  if (!Number.isFinite(amtNum) || amtNum <= 0 || amtNum > 100000){
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (/[\r\n]/.test(to) || /[\r\n]/.test(String(name).slice(0,80))){
    return res.status(400).json({ error: 'Invalid characters' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'BREVO_API_KEY not set' });

  const kid    = String(kidName || 'Your kid').slice(0, 60);
  const itm    = String(name).slice(0, 80);
  const catTxt = String(cat || 'Other').slice(0, 32);
  const when   = String(requestedAt || new Date().toISOString()).slice(0, 32);
  const amtStr = '$' + amtNum.toFixed(2);

  const subject = `${kid} is asking to spend ${amtStr} on ${itm}`;

  const textContent = [
    `${kid} just submitted a purchase request inside YourLife CC.`,
    '',
    `Item:        ${itm}`,
    `Amount:      ${amtStr}`,
    `Category:    ${catTxt}`,
    `Requested:   ${when}`,
    '',
    `Sign in to YourLife CC, open Parent Hub → Rewards Store & Bucks,`,
    `and approve or deny the request from the "Purchase approvals" card.`,
    '',
    `→ https://yourlifecc.com/app`,
    '',
    `— YourLife CC`,
  ].join('\n');

  const htmlContent = [
    `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1a1a2e;max-width:520px;margin:0 auto;padding:24px;">`,
    `  <div style="font-size:13px;letter-spacing:1.2px;color:#a78bfa;font-weight:800;text-transform:uppercase;margin-bottom:8px;">PURCHASE REQUEST</div>`,
    `  <h1 style="font-size:22px;line-height:1.25;margin:0 0 16px;color:#0b1020;">${esc(kid)} is asking to spend <span style="color:#10b981;">${esc(amtStr)}</span></h1>`,
    `  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin:0 0 18px;">`,
    `    <div style="display:flex;gap:12px;justify-content:space-between;margin-bottom:6px;"><strong style="color:#475569;">Item</strong><span style="text-align:right;color:#0b1020;font-weight:700;">${esc(itm)}</span></div>`,
    `    <div style="display:flex;gap:12px;justify-content:space-between;margin-bottom:6px;"><strong style="color:#475569;">Amount</strong><span style="text-align:right;color:#0b1020;font-weight:700;">${esc(amtStr)}</span></div>`,
    `    <div style="display:flex;gap:12px;justify-content:space-between;margin-bottom:6px;"><strong style="color:#475569;">Category</strong><span style="text-align:right;color:#0b1020;">${esc(catTxt)}</span></div>`,
    `    <div style="display:flex;gap:12px;justify-content:space-between;"><strong style="color:#475569;">Requested</strong><span style="text-align:right;color:#0b1020;">${esc(when.slice(0,16).replace('T',' '))}</span></div>`,
    `  </div>`,
    `  <p style="color:#475569;line-height:1.5;margin:0 0 14px;">Sign in and open <strong>Parent Hub → Rewards Store &amp; Bucks → Purchase approvals</strong> to approve or deny.</p>`,
    `  <a href="https://yourlifecc.com/app" style="display:inline-block;background:#10b981;color:#0b1020;font-weight:800;padding:12px 22px;border-radius:10px;text-decoration:none;">Open YourLife CC →</a>`,
    `</div>`,
  ].join('\n');

  const payload = JSON.stringify({
    sender:      { name: 'YourLife CC', email: 'info@kingdom-creatives.com' },
    to:          [{ email: to }],
    replyTo:     { email: 'info@kingdom-creatives.com', name: 'YourLife CC' },
    subject,
    textContent,
    htmlContent
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      path:     '/v3/smtp/email',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'api-key':        apiKey,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ ok: true });
        } else {
          console.error('Brevo error:', response.statusCode, data);
          res.status(502).json({ error: 'Email send failed' });
        }
        resolve();
      });
    });

    request.on('error', (err) => {
      console.error('Brevo request error:', err);
      res.status(502).json({ error: 'Email transport error' });
      resolve();
    });

    request.write(payload);
    request.end();
  });
};
