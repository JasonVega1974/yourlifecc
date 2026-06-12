// api/notify-signup.js
// Fires a Brevo email to Jason whenever a new account signs up.
// Called fire-and-forget from auth.js inside the !isReturningUser block.
//
// Environment variables required (already set in Vercel):
//   BREVO_API_KEY    — Brevo transactional email API key
//   SUPA_SERVICE_KEY — Supabase service_role key (used for the total-count query)

const https = require('https');

const ALLOWED_ORIGINS = new Set([
  'https://yourlifecc.com',
  'https://www.yourlifecc.com'
]);

const RECIPIENTS = [
  { email: 'info@kingdom-creatives.com',  name: 'Kingdom Creatives' }
];

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

// Best-effort count of total profiles via PostgREST HEAD + Content-Range.
// Returns null if the query fails — the email still sends without a count.
function fetchTotalCount() {
  return new Promise(function (resolve) {
    var supaKey = process.env.SUPA_SERVICE_KEY;
    if (!supaKey) return resolve(null);
    var opts = {
      hostname: 'hrohgwcbfgywkpnvqxhk.supabase.co',
      path:     '/rest/v1/profiles?select=user_id',
      method:   'HEAD',
      headers: {
        'apikey':        supaKey,
        'Authorization': 'Bearer ' + supaKey,
        'Prefer':        'count=exact',
        'Range-Unit':    'items',
        'Range':         '0-0'
      }
    };
    var req = https.request(opts, function (resp) {
      var n = null;
      var cr = resp.headers['content-range'];
      if (cr) {
        var m = /\/(\d+)\s*$/.exec(cr);
        if (m) n = parseInt(m[1], 10);
      }
      resp.on('data', function () {});
      resp.on('end', function () { resolve(n); });
    });
    req.on('error', function () { resolve(null); });
    req.end();
  });
}

module.exports = async function handler(req, res) {
  var origin    = req.headers.origin || '';
  var isAllowed = ALLOWED_ORIGINS.has(origin);
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(isAllowed ? 200 : 403).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });
  if (!isAllowed)               return res.status(403).json({ error: 'Origin not allowed' });

  var body = req.body || {};
  var user_id      = body.user_id;
  var email        = body.email;
  var source       = body.source;
  var signed_up_at = body.signed_up_at;

  if (!email || !user_id) return res.status(400).json({ error: 'Missing fields' });
  if (typeof email !== 'string' || typeof user_id !== 'string') return res.status(400).json({ error: 'Invalid types' });
  if (email.length > 320 || user_id.length > 64)                return res.status(413).json({ error: 'Payload too large' });
  if (/[\r\n]/.test(email))                                     return res.status(400).json({ error: 'Invalid email' });

  var apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'BREVO_API_KEY not set' });

  var safeEmail  = esc(email);
  var safeUserId = String(user_id).replace(/[^a-z0-9-]/gi, '').slice(0, 64);
  var safeSource = esc(String(source || 'unknown').slice(0, 64));

  var when;
  try {
    when = signed_up_at ? new Date(signed_up_at) : new Date();
    if (isNaN(when.getTime())) when = new Date();
  } catch (_) { when = new Date(); }
  var whenStr = when.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' }) + ' ET';

  var totalCount = await fetchTotalCount();

  var htmlContent =
    '<div style="font-family:sans-serif;max-width:540px;">' +
      '<h2 style="color:#111;border-bottom:3px solid #f59e0b;padding-bottom:10px;margin-bottom:16px;">🎉 New YourLife CC signup</h2>' +
      '<table style="font-size:14px;border-collapse:collapse;width:100%;margin-bottom:18px;">' +
        '<tr><td style="padding:9px 12px;background:#f5f5f5;font-weight:700;width:140px;">Email</td><td style="padding:9px 12px;background:#f5f5f5;">' + safeEmail + '</td></tr>' +
        '<tr><td style="padding:9px 12px;background:#f0f0f0;font-weight:700;">Signed up</td><td style="padding:9px 12px;background:#f0f0f0;">' + esc(whenStr) + '</td></tr>' +
        '<tr><td style="padding:9px 12px;background:#f5f5f5;font-weight:700;">Source</td><td style="padding:9px 12px;background:#f5f5f5;">' + safeSource + '</td></tr>' +
        '<tr><td style="padding:9px 12px;background:#f0f0f0;font-weight:700;">User ID</td><td style="padding:9px 12px;background:#f0f0f0;font-family:monospace;font-size:12px;color:#555;">' + esc(safeUserId) + '</td></tr>' +
        (totalCount !== null
          ? '<tr><td style="padding:9px 12px;background:#fffbe6;font-weight:700;color:#b45309;">Total signups</td><td style="padding:9px 12px;background:#fffbe6;font-weight:700;color:#b45309;">' + totalCount + '</td></tr>'
          : '') +
      '</table>' +
      '<p style="margin:0;font-size:12px;color:#999;">Sent by api/notify-signup.js · ' + esc(new Date().toISOString()) + '</p>' +
    '</div>';

  var payload = JSON.stringify({
    sender:      { name: 'YourLife CC', email: 'info@kingdom-creatives.com' },
    to:          RECIPIENTS,
    subject:     '🎉 New YourLife CC signup — ' + email,
    htmlContent: htmlContent
  });

  return new Promise(function (resolve) {
    var options = {
      hostname: 'api.brevo.com',
      path:     '/v3/smtp/email',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'api-key':        apiKey,
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    var request = https.request(options, function (response) {
      var data = '';
      response.on('data', function (chunk) { data += chunk; });
      response.on('end', function () {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ ok: true, total: totalCount });
        } else {
          console.error('Brevo error:', response.statusCode, data);
          res.status(500).json({ error: 'Brevo error', status: response.statusCode, detail: data });
        }
        resolve();
      });
    });
    request.on('error', function (e) {
      console.error('Request error:', e.message);
      res.status(500).json({ error: e.message });
      resolve();
    });
    request.write(payload);
    request.end();
  });
};
