// api/waitlist-submit.js
// Handles family sponsorship waitlist submissions:
//   1. Inserts a row into Supabase waitlist_applications
//   2. Sends a Brevo notification email to info@kingdom-creatives.com
//
// Environment variables required (set in Vercel project settings):
//   BREVO_API_KEY   — your Brevo API key
//   SUPA_SERVICE_KEY — your Supabase service_role key (for server-side inserts)

const https = require('https');

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    first_name, last_name, email, children,
    ages, church, source, why,
    sponsored_by, sponsor_email
  } = req.body;

  // Basic server-side validation
  if (!first_name || !last_name || !email || !children || !why) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey     = process.env.BREVO_API_KEY;
  const supaUrl    = 'https://hrohgwcbfgywkpnvqxhk.supabase.co';
  const supaKey    = process.env.SUPA_SERVICE_KEY;

  // ── 1. Insert into Supabase ──────────────────────────────────────
  const row = JSON.stringify({
    first_name,
    last_name,
    email,
    children,
    ages:          ages          || null,
    church:        church        || null,
    source:        source        || null,
    why,
    sponsored_by:  sponsored_by  || null,
    sponsor_email: sponsor_email || null,
    status:        'pending',
    submitted_at:  new Date().toISOString()
  });

  try {
    await new Promise((resolve, reject) => {
      const options = {
        hostname: 'hrohgwcbfgywkpnvqxhk.supabase.co',
        path:     '/rest/v1/waitlist_applications',
        method:   'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        supaKey,
          'Authorization': 'Bearer ' + supaKey,
          'Prefer':        'return=minimal',
          'Content-Length': Buffer.byteLength(row)
        }
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve();
          } else {
            reject(new Error('Supabase insert failed: ' + response.statusCode + ' ' + data));
          }
        });
      });

      request.on('error', reject);
      request.write(row);
      request.end();
    });
  } catch (err) {
    console.error('Supabase error:', err.message);
    return res.status(500).json({ error: 'Database error', detail: err.message });
  }

  // ── 2. Send Brevo notification email ────────────────────────────
  function tr(label, val, bg) {
    return '<tr>' +
      '<td style="padding:7px 12px;background:' + bg + ';font-weight:700;width:190px;vertical-align:top;">' + label + '</td>' +
      '<td style="padding:7px 12px;background:' + bg + ';">' + String(val || '').replace(/</g, '&lt;') + '</td>' +
      '</tr>';
  }
  function trGold(label, val) {
    return '<tr>' +
      '<td style="padding:7px 12px;background:#fffbe6;font-weight:700;color:#b45309;width:190px;vertical-align:top;">' + label + '</td>' +
      '<td style="padding:7px 12px;background:#fffbe6;">' + String(val || '').replace(/</g, '&lt;') + '</td>' +
      '</tr>';
  }

  const htmlContent =
    '<div style="font-family:sans-serif;max-width:620px;">' +
    '<h2 style="color:#111;border-bottom:3px solid #22c55e;padding-bottom:10px;margin-bottom:16px;">Family Sponsorship Waitlist Application</h2>' +
    '<table style="font-size:14px;border-collapse:collapse;width:100%;margin-bottom:20px;">' +
    tr('Name',             first_name + ' ' + last_name,              '#f5f5f5') +
    tr('Email',            email,                                      '#f0f0f0') +
    tr('Children',         children,                                   '#f5f5f5') +
    tr('Ages',             ages    || 'Not provided',                  '#f0f0f0') +
    tr('Church/Community', church  || 'Not provided',                  '#f5f5f5') +
    tr('How they heard',   source  || 'Not provided',                  '#f0f0f0') +
    trGold('Sponsored by',  sponsored_by  || 'None — match with next available') +
    trGold('Sponsor email', sponsor_email || 'Not provided') +
    '</table>' +
    '<h3 style="color:#111;margin-bottom:8px;">Why this would help their family:</h3>' +
    '<div style="font-size:14px;line-height:1.75;background:#f0fdf4;padding:14px 18px;border-left:4px solid #22c55e;border-radius:4px;">' +
    String(why).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') +
    '</div>' +
    '<p style="margin-top:18px;font-size:12px;color:#999;">Submitted: ' + new Date().toLocaleString() + '</p>' +
    '</div>';

  const payload = JSON.stringify({
    sender:      { name: 'YourLife CC Waitlist', email: 'info@kingdom-creatives.com' },
    to:          [{ email: 'info@kingdom-creatives.com', name: 'Jason Vega' }],
    replyTo:     { email: email, name: first_name + ' ' + last_name },
    subject:     'Waitlist Application — ' + first_name + ' ' + last_name,
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
          res.status(500).json({ error: 'Brevo error', status: response.statusCode, detail: data });
        }
        resolve();
      });
    });

    request.on('error', (e) => {
      console.error('Request error:', e.message);
      res.status(500).json({ error: e.message });
      resolve();
    });

    request.write(payload);
    request.end();
  });
};
