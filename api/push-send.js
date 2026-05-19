// api/push-send.js
// Sends a Web Push notification to all or faith-only subscribers.
//
// POST — requires x-admin-token: ylcc-admin-2729
// Body: { title, body, url?, target: 'all' | 'faith' }
// Returns: { sent: N }
//
// Env vars (Vercel project settings):
//   VAPID_PUBLIC_KEY  — base64url VAPID public key
//   VAPID_PRIVATE_KEY — base64url VAPID private key
//   VAPID_SUBJECT     — mailto:info@kingdom-creatives.com
//   SUPA_SERVICE_KEY  — Supabase service_role key

const https    = require('https');
const webpush  = require('web-push');

const SUPA_HOST   = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const ADMIN_TOKEN = 'ylcc-admin-2729';

function supaFetch(path, supaKey) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: SUPA_HOST,
      path:     '/rest/v1/' + path,
      method:   'GET',
      headers: {
        'apikey':        supaKey,
        'Authorization': 'Bearer ' + supaKey,
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, body, url, target } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required' });
  }
  if (target !== 'all' && target !== 'faith') {
    return res.status(400).json({ error: 'target must be all or faith' });
  }

  const supaKey      = process.env.SUPA_SERVICE_KEY;
  const vapidPublic  = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:info@kingdom-creatives.com';

  if (!supaKey || !vapidPublic || !vapidPrivate) {
    console.error('push-send: missing env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  // Fetch subscriptions — for faith target, join with profiles
  let rows;
  try {
    if (target === 'faith') {
      // Supabase REST join: push_subscriptions where the related profiles row
      // has faith_only = true
      rows = await supaFetch(
        'push_subscriptions?select=user_id,subscription,profiles!inner(faith_only)&profiles.faith_only=eq.true',
        supaKey
      );
    } else {
      rows = await supaFetch('push_subscriptions?select=user_id,subscription', supaKey);
    }
  } catch (e) {
    console.error('push-send: fetch subscriptions failed:', e.message);
    return res.status(500).json({ error: 'Failed to fetch subscribers' });
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(200).json({ sent: 0 });
  }

  const payload = JSON.stringify({
    title: title,
    body:  body,
    url:   url || 'https://yourlifecc.com',
  });

  let sent = 0;
  await Promise.all(rows.map(async row => {
    try {
      await webpush.sendNotification(row.subscription, payload);
      sent++;
    } catch (e) {
      // 410 Gone = subscription expired/unsubscribed — log but don't fail
      console.warn('push-send: delivery failed for user', row.user_id,
        e.statusCode || e.message);
    }
  }));

  return res.status(200).json({ sent });
};
