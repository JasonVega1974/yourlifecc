// api/faith-register.js
// Faith-only registration endpoint.
//
// Flow:
//   1. Creates a Supabase auth user via the admin REST API. email_confirm
//      is set to true because the user gave us a password directly — no
//      confirmation step needed.
//   2. Upserts the profiles row with plan_status='faith_free',
//      faith_only=true, and the mapped age_tier. onConflict=user_id
//      handles either case: (a) a Supabase trigger already created the
//      row on auth.users insert, or (b) it doesn't exist yet.
//   3. Sends a Brevo welcome email (fire-and-forget — never fail the
//      signup if email send fails).
//   4. Returns { ok: true } on success.
//
// Env vars (Vercel project settings):
//   BREVO_API_KEY     — Brevo transactional email API key.
//   SUPA_SERVICE_KEY  — Supabase service_role key (admin actions, RLS bypass).
//
// The F6 webhook guard ensures profiles rows created here cannot be
// clobbered by Stripe events later (faith_only=true + plan_status='faith_free').

const https = require('https');

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';

// User-facing bracket → DB age_tier enum value (per F6-A migration
// check constraint: 'kids' | 'youth' | 'adult' | 'family').
// The raw bracket string is also stored in user_metadata so analytics
// can split 12-14 from 15-17 inside the youth tier.
const BRACKET_TO_TIER = {
  '12_14':  'youth',
  '15_17':  'youth',
  '18_22':  'adult',
  'parent': 'family',
};

function supaRequest(path, method, body, supaKey, extraHeaders) {
  const payload = body ? JSON.stringify(body) : '';
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type':   'application/json',
      'apikey':         supaKey,
      'Authorization':  'Bearer ' + supaKey,
      'Content-Length': Buffer.byteLength(payload),
    };
    if (extraHeaders) {
      Object.keys(extraHeaders).forEach(k => { headers[k] = extraHeaders[k]; });
    }
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
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } else {
          reject(new Error('Supabase ' + path + ' ' + res.statusCode + ': ' + data));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function brevoSend(emailPayload, apiKey) {
  return new Promise(resolve => {
    const body = JSON.stringify(emailPayload);
    const req = https.request({
      hostname: 'api.brevo.com',
      path:     '/v3/smtp/email',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'api-key':        apiKey,
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true });
        } else {
          console.error('Brevo welcome email failed:', res.statusCode, data);
          resolve({ ok: false });
        }
      });
    });
    req.on('error', e => {
      console.error('Brevo welcome email error:', e.message);
      resolve({ ok: false });
    });
    req.write(body);
    req.end();
  });
}

function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const name        = (body.name        || '').trim();
  const email       = (body.email       || '').trim().toLowerCase();
  const password    = body.password     || '';
  const ageBracket  = (body.ageBracket  || '').trim();

  if (!name)       return res.status(400).json({ error: 'Missing name' });
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (!BRACKET_TO_TIER[ageBracket]) {
    return res.status(400).json({ error: 'Invalid age bracket' });
  }

  const supaKey  = process.env.SUPA_SERVICE_KEY;
  const brevoKey = process.env.BREVO_API_KEY;
  if (!supaKey) {
    console.error('faith-register: SUPA_SERVICE_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const ageTier = BRACKET_TO_TIER[ageBracket];

  // ── 1. Create the Supabase auth user (admin API) ───────────────
  let userId;
  try {
    const userResp = await supaRequest('/auth/v1/admin/users', 'POST', {
      email:         email,
      password:      password,
      email_confirm: true,
      user_metadata: {
        full_name:     name,
        signup_source: 'register-faith',
        age_bracket:   ageBracket,
        plan_intent:   'faith_free',
      },
    }, supaKey);
    userId = userResp.data && userResp.data.id;
    if (!userId) {
      console.error('faith-register: no user id from admin createUser', userResp.raw);
      return res.status(500).json({ error: 'Account creation failed' });
    }
  } catch (e) {
    const msg = e.message || '';
    // Common Supabase error shapes for an existing user.
    if (/already|exists|registered|duplicate/i.test(msg)) {
      return res.status(409).json({ error: 'An account with that email already exists. Try signing in.' });
    }
    console.error('faith-register: admin createUser failed:', msg);
    return res.status(500).json({ error: 'Account creation failed' });
  }

  // ── 2. Upsert the profiles row ─────────────────────────────────
  // onConflict=user_id covers both: (a) a Supabase trigger pre-created
  // the row, (b) the row doesn't exist yet. Either way we end up with
  // plan_status='faith_free' + faith_only=true on the row, which is the
  // state the F6 SPLICE POINT 2 webhook guard reads to short-circuit
  // any future Stripe events for this user.
  try {
    await supaRequest('/rest/v1/profiles?on_conflict=user_id', 'POST', {
      user_id:      userId,
      email:        email,
      plan_status:  'faith_free',
      faith_only:   true,
      age_tier:     ageTier,
      account_role: ageBracket === 'parent' ? 'parent' : 'self',
    }, supaKey, {
      'Prefer': 'resolution=merge-duplicates,return=minimal',
    });
  } catch (e) {
    console.error('faith-register: profiles upsert failed:', e.message);
    return res.status(500).json({ error: 'Profile setup failed. Support has been notified.' });
  }

  // ── 3. Brevo welcome email (fire-and-forget) ───────────────────
  if (brevoKey) {
    const html =
      '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0a0e1a;color:#e2e8f0;border-radius:12px;">' +
        '<h2 style="color:#f5a623;font-size:22px;margin-bottom:8px;">Welcome to the Faith Path ✝️</h2>' +
        '<p style="color:#94a3b8;margin-bottom:16px;line-height:1.7;">Hi ' + escHtml(name) + ', your free Faith Path account is ready. Open the app and start reading today.</p>' +
        '<a href="https://yourlifecc.com/app/" style="display:inline-block;background:linear-gradient(135deg,#f5a623,#f97316);color:#1a0e02;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;margin:12px 0 24px;">Open YourLife CC →</a>' +
        '<p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-bottom:6px;"><strong style="color:#e2e8f0;">What\'s inside:</strong></p>' +
        '<ul style="color:#94a3b8;font-size:14px;line-height:1.85;padding-left:20px;margin-bottom:18px;">' +
          '<li>Story Mode Bible, reading plans, Faith Academy</li>' +
          '<li>Memory verses with spaced repetition</li>' +
          '<li>Biblical Archaeology, Timeline, Worship Playlist</li>' +
          '<li>Private prayer journal</li>' +
        '</ul>' +
        '<hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;" />' +
        '<p style="color:#64748b;font-size:12px;line-height:1.65;">Donations to Kingdom Creatives LLC are not tax-deductible. Kingdom Creatives LLC is not a registered 501(c)(3) charitable organization.</p>' +
        '<p style="color:#64748b;font-size:12px;line-height:1.65;margin-top:8px;">Questions? <a href="mailto:info@kingdom-creatives.com" style="color:#f5a623;text-decoration:none;">info@kingdom-creatives.com</a></p>' +
        '<p style="color:#475569;font-size:12px;margin-top:16px;">© 2026 YourLife CC · Kingdom Creatives LLC</p>' +
      '</div>';

    await brevoSend({
      sender:      { name: 'YourLife CC', email: 'info@kingdom-creatives.com' },
      to:          [{ email: email, name: name }],
      subject:     'Welcome to the Faith Path — your account is ready',
      trackClicks: false,
      trackOpens:  false,
      htmlContent: html,
    }, brevoKey);
  }

  return res.status(200).json({ ok: true, userId: userId });
};
