// Vercel Serverless Function
// File location in repo: api/send-email.js

const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subject, textContent, senderName } = req.body || {};
  if (!subject || !textContent) return res.status(400).json({ error: 'Missing fields' });

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'BREVO_API_KEY not set' });

  const payload = JSON.stringify({
    sender: { name: senderName || 'Life OS App', email: 'info@kingdom-creatives.com' },
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
