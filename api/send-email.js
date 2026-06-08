// Vercel Serverless Function
// File location in repo: api/send-email.js
//
// ─── INTERNAL USE ONLY ────────────────────────────────────────
// This endpoint hardcodes the recipient to info@kingdom-creatives.com.
// It is for app-side feedback / internal notification ONLY. Any `to`
// or `htmlContent` field passed in the request body is SILENTLY
// IGNORED — the email always goes to Jason's inbox.
//
// 2026-06-08 (Email Bundle PR 0): the prior emailWeeklySummary() in
// parent.js called this endpoint with a parent's `to` field thinking
// it was honored. It was not. Every "weekly summary email" silently
// landed in info@kingdom-creatives.com instead of the parent's inbox.
// That call site is now retired.
//
// For EXTERNAL recipients (parent emails, kid-named-to-parent emails,
// crossover invitations), build a dedicated endpoint modeled on
// api/notify-parent-purchase.js — it validates `to` against
// EMAIL_RE, CORS-gates to yourlifecc.com origins, and supports both
// textContent + htmlContent. Tracks 1/2/3 of the email bundle add:
//   • /api/cron/weekly-digest    — Track 1 (Sunday digest)
//   • /api/cron/engagement-tick  — Track 2 (engagement triggers)
//   • /api/cron/crossover-tick   — Track 3 (faith-only crossover)
// Each builds and sends its own emails; none use this endpoint.
// ─────────────────────────────────────────────────────────────

const https = require('https');

const ALLOWED_ORIGINS = new Set([
  'https://yourlifecc.com',
  'https://www.yourlifecc.com'
]);

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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAllowed) return res.status(403).json({ error: 'Origin not allowed' });

  const { subject, textContent, senderName } = req.body || {};
  if (!subject || !textContent) return res.status(400).json({ error: 'Missing fields' });
  if (typeof subject !== 'string' || typeof textContent !== 'string') return res.status(400).json({ error: 'Invalid types' });
  if (subject.length > 200 || textContent.length > 10000) return res.status(413).json({ error: 'Payload too large' });
  if (/[\r\n]/.test(subject)) return res.status(400).json({ error: 'Invalid subject' });

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'BREVO_API_KEY not set' });

  const payload = JSON.stringify({
    sender: { name: senderName || 'YourLife CC App', email: 'info@kingdom-creatives.com' },
    to: [{ email: 'info@kingdom-creatives.com', name: 'Jason Vega' }],
    subject,
    textContent
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
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
