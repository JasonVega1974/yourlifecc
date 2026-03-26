// api/approve-affiliate.js
// Called by a Supabase Database Webhook when affiliate_applications.status = 'approved'
// Sends the affiliate their unique referral link via Brevo
//
// Supabase webhook setup:
//   Table: affiliate_applications
//   Event: UPDATE
//   URL: https://yourlifecc.com/api/approve-affiliate
//   HTTP Method: POST
//
// Environment variables required:
//   BREVO_API_KEY
//   SUPA_WEBHOOK_SECRET  (set this to any random string, add same in Supabase webhook headers)

const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify webhook secret to prevent unauthorized calls
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.SUPA_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const record = req.body && req.body.record;
  if (!record) return res.status(400).json({ error: 'No record in payload' });

  // Only fire when status is being set to 'approved'
  if (record.status !== 'approved') {
    return res.status(200).json({ ok: true, skipped: 'status not approved' });
  }

  // Don't re-send if already notified
  if (record.approval_email_sent) {
    return res.status(200).json({ ok: true, skipped: 'already notified' });
  }

  const brevoKey  = process.env.BREVO_API_KEY;
  const supaKey   = process.env.SUPA_SERVICE_KEY;
  const supaUrl   = 'https://hrohgwcbfgywkpnvqxhk.supabase.co';

  const { first_name, last_name, email, ref_code, id } = record;
  const refLink = 'https://yourlifecc.com/index.html?ref=' + ref_code + '#pricing';

  // Commission table for email
  const commissionTable =
    '<table style="font-size:14px;border-collapse:collapse;width:100%;margin:16px 0;">' +
    '<tr style="background:#f5f5f5;"><th style="padding:8px 12px;text-align:left;font-weight:700;">Plan</th><th style="padding:8px 12px;text-align:right;font-weight:700;">Your Commission</th></tr>' +
    '<tr><td style="padding:7px 12px;border-bottom:1px solid #eee;">Monthly ($9.99/mo)</td><td style="padding:7px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:#22c55e;">$5</td></tr>' +
    '<tr><td style="padding:7px 12px;border-bottom:1px solid #eee;">Annual ($79.99/yr)</td><td style="padding:7px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:#22c55e;">$10</td></tr>' +
    '<tr><td style="padding:7px 12px;">Lifetime ($149 once)</td><td style="padding:7px 12px;text-align:right;font-weight:700;color:#22c55e;">$20</td></tr>' +
    '</table>';

  const htmlContent =
    '<div style="font-family:sans-serif;max-width:620px;">' +
    '<div style="background:linear-gradient(135deg,#f5c842,#e6a817);padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">' +
    '<h1 style="color:#0a0a0f;margin:0;font-size:24px;font-weight:900;">You\'re Approved! 🎉</h1>' +
    '<p style="color:#3a2800;margin:8px 0 0;font-size:14px;">Welcome to the YourLife CC Affiliate Program</p>' +
    '</div>' +
    '<div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">' +
    '<p style="font-size:15px;color:#111;">Hi ' + first_name + ',</p>' +
    '<p style="font-size:14px;color:#555;line-height:1.7;">Great news — your YourLife CC affiliate application has been approved! Here\'s everything you need to get started earning commissions.</p>' +

    '<div style="background:#fffbe6;border:2px solid #f5c842;border-radius:10px;padding:20px;margin:20px 0;text-align:center;">' +
    '<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#b45309;margin-bottom:6px;">YOUR REFERRAL CODE</div>' +
    '<div style="font-size:28px;font-weight:900;color:#0a0a0f;letter-spacing:4px;font-family:monospace;">' + ref_code + '</div>' +
    '</div>' +

    '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:20px 0;">' +
    '<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#166534;margin-bottom:8px;">YOUR REFERRAL LINK</div>' +
    '<div style="font-size:13px;color:#15803d;font-family:monospace;word-break:break-all;background:#dcfce7;padding:10px 14px;border-radius:6px;">' + refLink + '</div>' +
    '<p style="font-size:12px;color:#166534;margin:8px 0 0;">Share this link anywhere. When someone clicks it, picks a plan, and signs up — you earn a commission.</p>' +
    '</div>' +

    '<h3 style="color:#111;margin-bottom:4px;">Your Commission Rates</h3>' +
    commissionTable +

    '<h3 style="color:#111;margin-bottom:8px;">How It Works</h3>' +
    '<ol style="font-size:14px;color:#555;line-height:1.8;padding-left:20px;">' +
    '<li>Share your referral link with families, churches, schools, or your audience</li>' +
    '<li>They click your link → land on the YourLife CC pricing page</li>' +
    '<li>They pick a plan and complete checkout (your code is tracked automatically)</li>' +
    '<li>After the 30-day refund window, your commission is confirmed</li>' +
    '<li>Payouts are sent via your preferred method on the 1st of each month</li>' +
    '</ol>' +

    '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:20px;">' +
    '<p style="font-size:13px;color:#555;margin:0;">Questions? Reply to this email or contact us at <a href="mailto:info@kingdom-creatives.com" style="color:#f5c842;">info@kingdom-creatives.com</a></p>' +
    '</div>' +
    '</div>' +
    '</div>';

  const payload = JSON.stringify({
    sender:      { name: 'YourLife CC', email: 'info@kingdom-creatives.com' },
    to:          [{ email: email, name: first_name + ' ' + (last_name || '') }],
    replyTo:     { email: 'info@kingdom-creatives.com', name: 'Jason Vega' },
    subject:     '🎉 You\'re Approved — Your YourLife CC Affiliate Link is Ready',
    htmlContent
  });

  // Send approval email
  await new Promise((resolve) => {
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
        console.log('Brevo response:', response.statusCode, data);
        resolve();
      });
    });
    request.on('error', (e) => { console.error(e); resolve(); });
    request.write(payload);
    request.end();
  });

  // Mark approval_email_sent = true in Supabase to prevent duplicate sends
  const updateBody = JSON.stringify({ approval_email_sent: true });
  await new Promise((resolve) => {
    const options = {
      hostname: 'hrohgwcbfgywkpnvqxhk.supabase.co',
      path:     '/rest/v1/affiliate_applications?id=eq.' + id,
      method:   'PATCH',
      headers: {
        'Content-Type':   'application/json',
        'apikey':         supaKey,
        'Authorization':  'Bearer ' + supaKey,
        'Content-Length': Buffer.byteLength(updateBody)
      }
    };
    const request = https.request(options, (response) => {
      response.on('data', () => {});
      response.on('end', resolve);
    });
    request.on('error', resolve);
    request.write(updateBody);
    request.end();
  });

  return res.status(200).json({ ok: true, email_sent_to: email });
};
