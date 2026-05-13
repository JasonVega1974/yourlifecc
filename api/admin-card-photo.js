// api/admin-card-photo.js
// Vercel function — read / write photo overrides for the YourLife CC
// topic cards. The admin_card_photos table is locked to service-role
// only at the RLS level (see docs/migrations/admin-card-photos.sql),
// so all access goes through this endpoint.
//
// Endpoints:
//   GET   /api/admin-card-photo
//     → public, no auth — returns all rows as { card_id: photo_url, ... }
//     Used by app/js/ui.js loadCardPhotoOverrides() on app boot.
//
//   POST  /api/admin-card-photo
//     → HMAC-authenticated — upserts a single { card_id, photo_url }
//     Body: { card_id, photo_url, ts, hmac }
//       ts:    integer epoch-ms timestamp (rejected if > 5min stale)
//       hmac:  hex HMAC-SHA256 of `${card_id}|${photo_url}|${ts}`
//              using process.env.ADMIN_PHOTO_SECRET as the key
//     The admin's browser holds ADMIN_PHOTO_SECRET in sessionStorage
//     (typed once per session). The secret never travels over the wire.
//
// Environment variables required:
//   SUPA_SERVICE_KEY      service-role key for the YourLife CC project
//   ADMIN_PHOTO_SECRET    long random string, same value in browser session

const crypto = require('crypto');
const https  = require('https');

const SUPA_HOST    = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const TABLE        = 'admin_card_photos';
const STALE_MS     = 5 * 60 * 1000;  // 5-minute replay window

function supaRequest(method, path, body){
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: SUPA_HOST,
      path: '/rest/v1/' + path,
      method: method,
      headers: {
        'apikey':        process.env.SUPA_SERVICE_KEY,
        'Authorization': 'Bearer ' + process.env.SUPA_SERVICE_KEY,
        'Content-Type':  'application/json',
        'Prefer':        method === 'POST' ? 'resolution=merge-duplicates,return=representation' : 'return=representation',
      },
    };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(opts, (res) => {
      let buf = '';
      res.on('data', (chunk) => { buf += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300){
          try { resolve(buf ? JSON.parse(buf) : null); }
          catch(e){ resolve(buf); }
        } else {
          reject(new Error('Supabase ' + res.statusCode + ': ' + buf));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function timingSafeHexEq(a, b){
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch(e){
    return false;
  }
}

module.exports = async (req, res) => {
  // CORS for browser usage from yourlifecc.com / localhost
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET'){
    if (!process.env.SUPA_SERVICE_KEY){
      return res.status(500).json({ error: 'Server not configured' });
    }
    try {
      const rows = await supaRequest('GET', TABLE + '?select=card_id,photo_url');
      const out = {};
      (rows || []).forEach((r) => { if (r && r.card_id && r.photo_url) out[r.card_id] = r.photo_url; });
      // Short cache — fast TTL keeps the override map close to live without
      // hammering the Supabase REST API on every page load.
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.status(200).json({ ok: true, overrides: out });
    } catch(e){
      console.error('[admin-card-photo GET]', e && e.message);
      return res.status(500).json({ error: 'Failed to load overrides' });
    }
  }

  if (req.method === 'POST'){
    if (!process.env.SUPA_SERVICE_KEY || !process.env.ADMIN_PHOTO_SECRET){
      return res.status(500).json({ error: 'Server not configured' });
    }

    const body = req.body || {};
    const card_id   = typeof body.card_id   === 'string' ? body.card_id.trim()   : '';
    const photo_url = typeof body.photo_url === 'string' ? body.photo_url.trim() : '';
    const ts        = typeof body.ts        === 'number' ? body.ts               : parseInt(body.ts, 10);
    const hmac      = typeof body.hmac      === 'string' ? body.hmac.trim()      : '';

    // Shape checks
    if (!card_id || !/^[a-z0-9_-]{2,64}$/i.test(card_id))           return res.status(400).json({ error: 'Bad card_id' });
    if (!photo_url || !/^https:\/\/upload\.wikimedia\.org\//.test(photo_url)){
      return res.status(400).json({ error: 'photo_url must be an https://upload.wikimedia.org/ URL' });
    }
    if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > STALE_MS){
      return res.status(401).json({ error: 'Stale or missing timestamp' });
    }
    if (!hmac || !/^[0-9a-f]{64}$/i.test(hmac))                     return res.status(400).json({ error: 'Bad hmac shape' });

    // HMAC validation
    const message  = card_id + '|' + photo_url + '|' + ts;
    const expected = crypto.createHmac('sha256', process.env.ADMIN_PHOTO_SECRET).update(message).digest('hex');
    if (!timingSafeHexEq(hmac.toLowerCase(), expected)){
      return res.status(401).json({ error: 'HMAC mismatch' });
    }

    try {
      // Upsert via PostgREST. The `on_conflict=card_id` query string + the
      // `Prefer: resolution=merge-duplicates` header in supaRequest() turn a
      // POST into an upsert.
      const row = await supaRequest(
        'POST',
        TABLE + '?on_conflict=card_id',
        { card_id: card_id, photo_url: photo_url, updated_at: new Date().toISOString() }
      );
      return res.status(200).json({ ok: true, row: Array.isArray(row) ? row[0] : row });
    } catch(e){
      console.error('[admin-card-photo POST]', e && e.message);
      return res.status(500).json({ error: 'Failed to save override' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
