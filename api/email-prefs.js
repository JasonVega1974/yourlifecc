// api/email-prefs.js — Email Engagement Bundle (PR 0)
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// POST /api/email-prefs
//
// Endpoint that the static /unsubscribe.html page POSTs to when a
// recipient clicks an unsubscribe link in any email. Validates the
// signed token (HMAC-SHA256 over the payload), mutates the user's
// profiles.data.emailPrefs.{listKey}, and writes a row to
// public.email_suppressions so the suppression survives account
// deletion (privacy.html promise).
//
// Request body:
//   {
//     token:  string,                                  // signed JWT-like (see _verifyToken)
//     list:   'digest'|'engagement'|'crossover'|'all',
//     action: 'unsubscribe'|'resubscribe'
//   }
//
// Response (200):
//   { ok: true, list, action, email, suppressedAt? }
// Response (4xx/5xx):
//   { error: '<reason>' }
//
// Token format (compact, no JWT lib dependency):
//   <payloadB64>.<signatureB64>
//   payload = base64url(JSON.stringify({ u:userId, l:list, t:issuedAt }))
//   signature = base64url(HMAC-SHA256(payload, EMAIL_UNSUB_SECRET))
//   TTL = 1 year (anything older is rejected — emails older than that
//   shouldn't be carrying live unsubscribe state anyway)
//
// Env vars:
//   SUPA_SERVICE_KEY     — Supabase service-role key (writes profiles + suppressions)
//   EMAIL_UNSUB_SECRET   — HMAC secret used to sign unsubscribe tokens at email build time
//
// The cron handlers (Tracks 1/2/3) mint tokens with this same shape
// + same secret. PR 0 ships the verification path only; mint helper
// will land in the Track 1 send endpoint and be exported for reuse.

const crypto = require('crypto');
const https  = require('https');

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';

const ALLOWED_ORIGINS = new Set([
  'https://yourlifecc.com',
  'https://www.yourlifecc.com'
]);

const ALLOWED_LISTS   = new Set(['digest', 'engagement', 'crossover', 'all']);
const ALLOWED_ACTIONS = new Set(['unsubscribe', 'resubscribe']);

const MAX_TOKEN_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

// ── Token verification ────────────────────────────────────────
// Constant-time signature check + payload age check. Returns the
// decoded payload object on success, null on any failure mode.
function _verifyToken(token, secret){
  if(!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if(parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  if(!payloadB64 || !sigB64) return null;

  // Recompute signature
  let expected;
  try {
    expected = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  } catch(e){
    return null;
  }

  // Constant-time comparison (length-tolerant)
  let sigBuf, expBuf;
  try {
    sigBuf = Buffer.from(sigB64,    'utf8');
    expBuf = Buffer.from(expected,  'utf8');
  } catch(e){
    return null;
  }
  if(sigBuf.length !== expBuf.length) return null;
  if(!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  // Decode payload
  let payload;
  try {
    const json = Buffer.from(payloadB64, 'base64url').toString('utf8');
    payload = JSON.parse(json);
  } catch(e){
    return null;
  }
  if(!payload || typeof payload !== 'object') return null;
  if(typeof payload.u !== 'string' || !payload.u) return null;
  if(typeof payload.l !== 'string' || !ALLOWED_LISTS.has(payload.l)) return null;
  if(typeof payload.t !== 'number' || !Number.isFinite(payload.t)) return null;

  // Age check
  const ageMs = Date.now() - payload.t;
  if(ageMs < 0 || ageMs > MAX_TOKEN_AGE_MS) return null;

  return payload;
}

// ── PostgREST helpers ────────────────────────────────────────
async function _supaGet(path, serviceKey){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
    headers: {
      'apikey':        serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  });
  if(!r.ok){
    const text = await r.text();
    throw new Error(`Supabase GET ${r.status}: ${text.slice(0, 200)}`);
  }
  return r.json();
}

async function _supaPatch(path, body, serviceKey){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: {
      'apikey':        serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=representation'
    },
    body: JSON.stringify(body)
  });
  if(!r.ok){
    const text = await r.text();
    throw new Error(`Supabase PATCH ${r.status}: ${text.slice(0, 200)}`);
  }
  return r.json();
}

async function _supaUpsert(path, body, serviceKey, onConflict){
  const url = `https://${SUPA_HOST}/rest/v1/${path}${onConflict ? '?on_conflict=' + encodeURIComponent(onConflict) : ''}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey':        serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type':  'application/json',
      'Prefer':        'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(body)
  });
  if(!r.ok){
    const text = await r.text();
    throw new Error(`Supabase UPSERT ${r.status}: ${text.slice(0, 200)}`);
  }
  return r.json();
}

async function _supaDelete(path, serviceKey){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: {
      'apikey':        serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  });
  if(!r.ok && r.status !== 404){
    const text = await r.text();
    throw new Error(`Supabase DELETE ${r.status}: ${text.slice(0, 200)}`);
  }
}

// ── Field mapping ─────────────────────────────────────────────
// list → prefs field name + flag value for unsubscribe.
// digest/engagement are opt-IN (true=subscribed, false=unsubscribed),
// so unsubscribe means setting *OptIn=false.
// crossover/all are opt-OUT (true=unsubscribed), so unsubscribe means
// setting *OptOut=true. The action flips the value either way.
function _applyAction(prefs, list, action){
  prefs = prefs || {};
  const unsub = (action === 'unsubscribe');
  if(list === 'digest')     prefs.digestOptIn     = !unsub;
  if(list === 'engagement') prefs.engagementOptIn = !unsub;
  if(list === 'crossover')  prefs.crossoverOptOut = unsub;
  if(list === 'all')        prefs.allOptOut       = unsub;
  return prefs;
}

// ── Main handler ──────────────────────────────────────────────
module.exports = async function handler(req, res){
  const origin = req.headers.origin || '';
  const isAllowed = ALLOWED_ORIGINS.has(origin);
  if(isAllowed){
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if(req.method === 'OPTIONS') return res.status(isAllowed ? 200 : 403).end();
  if(req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });
  if(!isAllowed)              return res.status(403).json({ error: 'Origin not allowed' });

  const body = req.body || {};
  const { token, list, action } = body;

  if(typeof token !== 'string' || !token)             return res.status(400).json({ error: 'Missing token' });
  if(typeof list !== 'string' || !ALLOWED_LISTS.has(list))     return res.status(400).json({ error: 'Invalid list' });
  if(typeof action !== 'string' || !ALLOWED_ACTIONS.has(action)) return res.status(400).json({ error: 'Invalid action' });

  const secret = process.env.EMAIL_UNSUB_SECRET;
  if(!secret){
    console.error('email-prefs: EMAIL_UNSUB_SECRET not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const payload = _verifyToken(token, secret);
  if(!payload) return res.status(401).json({ error: 'Invalid or expired token' });

  // CSRF: the token's list must match the body's list. Without this
  // check an attacker who intercepts a digest unsubscribe URL could
  // POST it with list='all' and silently kill every stream.
  if(payload.l !== list) return res.status(400).json({ error: 'Token / list mismatch' });

  const serviceKey = process.env.SUPA_SERVICE_KEY;
  if(!serviceKey){
    console.error('email-prefs: SUPA_SERVICE_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const userId = payload.u;

  try {
    // 1. Fetch the profile to read current emailPrefs + email
    const rows = await _supaGet(
      `profiles?select=email,data&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
      serviceKey
    );
    if(!Array.isArray(rows) || !rows.length){
      return res.status(410).json({ error: 'Account not found' });
    }
    const row = rows[0];
    const email = row.email || '';
    const data  = (row.data && typeof row.data === 'object') ? row.data : {};
    const prefs = _applyAction(data.emailPrefs, list, action);
    const newData = Object.assign({}, data, { emailPrefs: prefs });

    // 2. Update profile.data with the mutated prefs
    await _supaPatch(
      `profiles?user_id=eq.${encodeURIComponent(userId)}`,
      { data: newData },
      serviceKey
    );

    // 3. Mirror into email_suppressions table (survives account deletion)
    if(action === 'unsubscribe' && email){
      await _supaUpsert(
        'email_suppressions',
        [{ email, list, source: 'unsubscribe_link', user_id: userId }],
        serviceKey,
        'email,list'
      );
    } else if(action === 'resubscribe' && email){
      await _supaDelete(
        `email_suppressions?email=eq.${encodeURIComponent(email)}&list=eq.${encodeURIComponent(list)}`,
        serviceKey
      );
    }

    return res.status(200).json({
      ok:     true,
      list,
      action,
      email,
      suppressedAt: action === 'unsubscribe' ? new Date().toISOString() : null
    });

  } catch(err){
    console.error('email-prefs: handler error:', err && err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};
