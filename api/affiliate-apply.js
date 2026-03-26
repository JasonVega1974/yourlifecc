// api/affiliate-apply.js
// Handles affiliate application submissions:
//   1. Generates a unique AFF- ref code
//   2. Inserts row into Supabase affiliate_applications
//   3. Sends notification email to info@kingdom-creatives.com via Brevo
//
// Environment variables required (already in Vercel):
//   BREVO_API_KEY
//   SUPA_SERVICE_KEY

const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { first_name, last_name, email, phone, method, reach, bio, payout } = req.body;

  if (!first_name || !email || !method) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supaUrl  = 'https://hrohgwcbfgywkpnvqxhk.supabase.co';
  const supaKey  = process.env.SUPA_SERVICE_KEY;
  const brevoKey = process.env.BREVO_API_KEY;

  // Generate unique AFF- ref code from first name + random suffix
  const suffix   = Math.random().toString(36).substring(2, 6).toUpperCase();
  const ref_code = 'AFF-' + first_name.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 6) + suffix;

  // ── 1. Insert into Supabase ──────────────────────────────────────
  const row = JSON.stringify({
    first_name,
    last_name:    last_name    || null,
    email,
    phone:        phone        || null,
    promo_method: method,
    reach:        reach        || null,
    bio:          bio          || null,
    payout_pref:  payout       || null,
    ref_code,
    status:       'pending',
    applied_at:   new Date().toISOString()
  });

  try {
    await new Promise((resolve, reject) => {
      const options = {
        hostname: 'hrohgwcbfgywkpnvqxhk.supabase.co',
        path:     '/rest/v1/affiliate_applications',
        method:   'POST',
        headers: {
          'Content-Type':   'application/json',
          'apikey':         supaKey,
          'Authorization':  'Bearer ' + supaKey,
          'Prefer':         'return=minimal',
          'Content-Length': Buffer.byteLength(row)
        }
      };
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) resolve();
          else reject(new Error('Supabase insert failed: ' + response.statusCode + ' ' + data));
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

  // ── 2. Send Brevo notification to Jason ─────────────────────────
  function tr(label, val, bg) {
    return '<tr><td style="padding:7px 12px;background:' + bg + ';font-weight:700;width:180px;vertical-align:top;">' + label +
           '</td><td style="padding:7px 12px;background:' + bg + ';">' + String(val || 'Not provided').replace(/</g, '&lt;') + '</td></tr>';
  }

  const htmlContent =
    '<div style="font-family:sans-serif;max-width:620px;">' +
    '<h2 style="color:#111;border-bottom:3px solid #f5c842;padding-bottom:10px;margin-bottom:16px;">New Affiliate Application</h2>' +
    '<table style="font-size:14px;border-collapse:collapse;width:100%;margin-bottom:20px;">' +
    tr('Name',           first_name + ' ' + (last_name || ''),  '#f5f5f5') +
    tr('Email',          email,                                  '#f0f0f0') +
    tr('Phone',          phone,                                  '#f5f5f5') +
    tr('Promo Method',   method,                                 '#f0f0f0') +
    tr('Monthly Reach',  reach,                                  '#f5f5f5') +
    tr('Payout Pref',    payout,                                 '#f0f0f0') +
    '<tr><td style="padding:7px 12px;background:#fffbe6;font-weight:700;color:#b45309;vertical-align:top;">Assigned Code</td>' +
    '<td style="padding:7px 12px;background:#fffbe6;font-weight:900;font-size:16px;color:#b45309;">' + ref_code + '</td></tr>' +
    '</table>' +
    (bio ? '<h3 style="color:#111;margin-bottom:8px;">About them:</h3><p style="font-size:14px;line-height:1.75;background:#f9f9f9;padding:12px 16px;border-left:4px solid #f5c842;border-radius:4px;">' + String(bio).replace(/</g, '&lt;').replace(/\n/g, '<br>') + '</p>' : '') +
    '<div style="margin-top:24px;padding:16px;background:#fff8e1;border:1px solid #f5c842;border-radius:8px;">' +
    '<strong>To approve:</strong> Go to Supabase → affiliate_applications → find this row → set <code>status = \'approved\'</code>.<br>' +
    'The webhook will automatically email ' + email + ' their referral link.' +
    '</div>' +
    '<p style="margin-top:16px;font-size:12px;color:#999;">Submitted: ' + new Date().toLocaleString() + '</p>' +
    '</div>';

  const payload = JSON.stringify({
    sender:      { name: 'YourLife CC Affiliates', email: 'info@kingdom-creatives.com' },
    to:          [{ email: 'info@kingdom-creatives.com', name: 'Jason Vega' }],
    replyTo:     { email: email, name: first_name + ' ' + (last_name || '') },
    subject:     'Affiliate Application — ' + first_name + ' ' + (last_name || ''),
    htmlContent
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      path:     '/v3/smtp/email',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'api-key':        brevoKey,
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ ok: true, ref_code });
        } else {
          console.error('Brevo error:', response.statusCode, data);
          // Still return ok — DB insert succeeded
          res.status(200).json({ ok: true, ref_code });
        }
        resolve();
      });
    });
    request.on('error', (e) => {
      console.error('Brevo request error:', e.message);
      res.status(200).json({ ok: true, ref_code });
      resolve();
    });
    request.write(payload);
    request.end();
  });
};
