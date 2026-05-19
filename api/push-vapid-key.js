// api/push-vapid-key.js
// Returns the VAPID public key for the browser to use when creating
// a push subscription. VAPID public keys are safe to expose.
//
// Env vars (Vercel project settings):
//   VAPID_PUBLIC_KEY — base64url-encoded VAPID public key

module.exports = (req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY || '';
  if (!key) {
    console.error('push-vapid-key: VAPID_PUBLIC_KEY not set');
    return res.status(500).json({ error: 'Push not configured' });
  }
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json({ publicKey: key });
};
