// api/admin/waitlist.js
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// MANUAL-TRIGGER ADMIN ENDPOINT — reads the ad-capture `waitlist` table
// (join.html email signups) for admin.html and returns it as JSON.
//
// WHY THIS EXISTS: the `waitlist` table is anon-INSERT-ONLY with NO public
// SELECT policy, so the public client (join.html, anon key) can write but can
// never read it. The ONLY safe read path is here — behind the service-role key
// and the ADMIN_SECRET Bearer gate. The service-role key never reaches the
// browser, and the email list is never exposed to the public anon client.
// (We deliberately do NOT add an anon SELECT policy: the anon key is public, so
// that would make the whole email list world-readable from view-source.)
//
// Mirrors api/admin/send-message.js (CORS + ADMIN_SECRET/CRON_SECRET Bearer
// check) and api/admin/send-announcement.js (_supaGet service-role read).
//
// AUTH
//   Authorization: Bearer <secret>   — ADMIN_SECRET (preferred) or CRON_SECRET
//
// REQUEST
//   GET /api/admin/waitlist
//
// RESPONSE
//   200 { rows: [{ id, email, name, source, created_at }, ...] }  newest first
//   401 Unauthorized (bad/missing Bearer secret)
//   403 Origin not allowed
//   405 Method not allowed
//   500 Server configuration error / read failed (never raw error text)
//
// ENV VARS (already set in Vercel — same as the send endpoints)
//   ADMIN_SECRET (preferred) OR CRON_SECRET
//   SUPA_SERVICE_KEY

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';

const ALLOWED_ORIGINS = new Set([
  'https://yourlifecc.com',
  'https://www.yourlifecc.com'
]);

const MAX_ROWS = 1000;

// Service-role read — mirrors api/admin/send-announcement.js:68-77.
async function _supaGet(url, serviceKey){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${url}`, {
    headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
  });
  if(!r.ok){
    const text = await r.text();
    throw new Error(`Supabase GET ${r.status}: ${text.slice(0, 200)}`);
  }
  return r.json();
}

module.exports = async function handler(req, res){
  // CORS — mirrors api/admin/send-message.js
  const origin = req.headers.origin || '';
  const isAllowed = ALLOWED_ORIGINS.has(origin);
  if(isAllowed){
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if(req.method === 'OPTIONS') return res.status(isAllowed ? 200 : 403).end();
  if(req.method !== 'GET')     return res.status(405).json({ error: 'Method not allowed' });
  if(!isAllowed)               return res.status(403).json({ error: 'Origin not allowed' });

  // Auth FIRST — before ANY DB access. Mirrors send-message.js:96-109.
  const adminSecret = process.env.ADMIN_SECRET || '';
  const cronSecret  = process.env.CRON_SECRET  || '';
  if(!adminSecret && !cronSecret){
    console.error('admin/waitlist: no ADMIN_SECRET or CRON_SECRET set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const auth  = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const validAuth =
       (adminSecret && token === adminSecret)
    || (cronSecret  && token === cronSecret);
  if(!validAuth) return res.status(401).json({ error: 'Unauthorized' });

  // Service-role key — held server-side ONLY, never returned to the client.
  const serviceKey = process.env.SUPA_SERVICE_KEY;
  if(!serviceKey){
    console.error('admin/waitlist: SUPA_SERVICE_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Read the ad-capture waitlist, newest first, capped at MAX_ROWS.
  try {
    const query = 'waitlist?select=id,email,name,source,created_at'
                + '&order=created_at.desc&limit=' + MAX_ROWS;
    const rows = await _supaGet(query, serviceKey);
    return res.status(200).json({ rows: Array.isArray(rows) ? rows : [] });
  } catch(e){
    console.error('admin/waitlist: read failed:', (e && e.message) || e);
    return res.status(500).json({ error: 'Could not load the waitlist. Try again, or contact info@kingdom-creatives.com.' });
  }
};
