// Vercel Serverless Function: /api/send-email.js
// Place this file at: api/send-email.js in your GitHub repo root
// Add BREVO_API_KEY to Vercel Environment Variables (never commit the key)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, textContent, senderName } = req.body;

  if (!subject || !textContent) {
    return res.status(400).json({ error: 'Missing subject or textContent' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY   // ← lives in Vercel env vars, never in code
      },
      body: JSON.stringify({
        sender: {
          name: senderName || 'Life OS App',
          email: 'info@kingdom-creatives.com'
        },
        to: [{ email: 'info@kingdom-creatives.com', name: 'Jason Vega' }],
        subject,
        textContent
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Brevo error:', err);
      return res.status(500).json({ error: 'Brevo API error', detail: err });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Send email failed:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
