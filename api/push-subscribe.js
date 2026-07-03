// api/push-subscribe.js
// Saves (or updates) a Web Push subscription for the authenticated user.
//
// POST — requires Authorization: Bearer <supabase_access_token>
// Body: { subscription: <PushSubscriptionJSON> }
// Returns: { ok: true }
//
// Env vars (Vercel project settings):
//   SUPA_SERVICE_KEY — Supabase service_role key

const https = require('https');

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';

function supaRequest(path, method, body, authHeader, supaKey, extraHeaders) {
  const payload = body ? JSON.stringify(body) : '';
  return new Promise((resolve, reject) => {
    const headers = Object.assign({
      'Content-Type':   'application/json',
      'apikey':         supaKey,
      'Authorization':  authHeader,
      'Content-Length': Buffer.byteLength(payload),
    }, extraHeaders || {});
    const req = https.request({
      hostname: SUPA_HOST,
      path:     path,
      method:   method,
      headers:  headers,
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = data ? JSON.parse(data) : null; } catch (e) {}
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: parsed });
        } else {
          reject(new Error('Supabase ' + res.statusCode + ': ' + data));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  const userJwt = authHeader.slice(7);

  const { subscription } = req.body || {};
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Missing subscription' });
  }

  const supaKey = process.env.SUPA_SERVICE_KEY;
  if (!supaKey) {
    console.error('push-subscribe: SUPA_SERVICE_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Verify the user's JWT and get their user_id
  let userId;
  try {
    const userResp = await supaRequest(
      '/auth/v1/user', 'GET', null,
      'Bearer ' + userJwt, supaKey
    );
    userId = userResp.data && userResp.data.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (e) {
    console.error('push-subscribe: JWT verify failed:', e.message);
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Upsert the subscription (one row per user). PostgREST only merges on
  // conflict when `Prefer: resolution=merge-duplicates` is present —
  // `on_conflict=user_id` alone is a plain INSERT, which 409'd on every
  // silent re-subscribe (row already exists) and surfaced as a 500.
  try {
    await supaRequest(
      '/rest/v1/push_subscriptions?on_conflict=user_id',
      'POST',
      { user_id: userId, subscription: subscription },
      // ROTATION NOTE (see CLAUDE.md "Secrets rotation" — SUPA_SERVICE_KEY
      // rotation deferred): this Bearer works because SUPA_SERVICE_KEY is
      // still the legacy service_role JWT. When it rotates to an sb_secret_
      // key, DROP this Authorization header — new secret keys go in the
      // `apikey` header ONLY; a Bearer sb_secret_ value breaks auth.
      'Bearer ' + supaKey, supaKey,
      { 'Prefer': 'resolution=merge-duplicates' },
    );
  } catch (e) {
    console.error('push-subscribe: upsert failed:', e.message);
    return res.status(500).json({ error: 'Failed to save subscription' });
  }

  return res.status(200).json({ ok: true });
};
