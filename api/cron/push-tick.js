// api/cron/push-tick.js — Push Retention Track (WC-3d)
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Hourly cron: streak-at-risk PUSH nudge. Subscriber-first — queries
// push_subscriptions, then fetches ONLY those accounts' profiles.data, so we
// scan opted-in devices, not the whole user table.
//
// Fires ONE push per ACCOUNT, naming the at-risk kid(s), when ALL gates pass:
//   • has a push subscription (by construction)
//   • data.pushPrefs.retentionOptOut !== true
//   • >=1 kid with xpStreak.count >= 3 AND xpStreak.lastDayKey !== UTC-today
//     AND not goal-met today (implied by the above; guarded explicitly)
//   • local hour in [18, 22) via data.emailPrefs.timezoneOffsetMin
//     — SKIP the account if the offset is unset (we won't guess the tz)
//   • shared cross-channel stamp data.lastStreakNudgeDate !== UTC-today
//     (coordinates with engagement-tick's EMAIL streak trigger — one streak
//      nudge per account per day across BOTH channels)
//   • push channel cooldown data.pushPrefs.lastStreakRiskPush !== UTC-today
//
// On send   → stamp data.pushPrefs.lastStreakRiskPush + data.lastStreakNudgeDate = UTC-today
// On 410/404 (gone) → DELETE the push_subscriptions row (cleanup)
//
// Deadline-AGNOSTIC copy: the XP streak's day boundary is UTC, so we don't
// promise a local "before midnight" deadline — just "hasn't earned today".
//
// Dispatch modes (mirror engagement-tick):
//   SCHEDULED — Vercel Cron hourly. Bearer ${CRON_SECRET}.
//   TEST      — ?testUser=<userId> + Authorization: Bearer <user JWT>.
//               Bypasses the evening-window + cooldown + shared-stamp gates so
//               the user can preview; does NOT stamp or delete.
//
// Env: CRON_SECRET, SUPA_SERVICE_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT

const webpush = require('web-push');

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';

const MIN_STREAK         = 3;
const EVENING_START_HOUR = 18;   // 6pm local — don't nudge before this
const EVENING_END_HOUR   = 22;   // before 10pm — never ping near midnight

// ── Supabase REST helpers (mirror engagement-tick) ───────────
async function _supaGet(path, key){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  if(!r.ok){ const t = await r.text(); throw new Error(`Supabase GET ${r.status}: ${t.slice(0, 200)}`); }
  return r.json();
}
async function _supaPatch(path, body, key){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(body)
  });
  if(!r.ok){ const t = await r.text(); throw new Error(`Supabase PATCH ${r.status}: ${t.slice(0, 200)}`); }
}
async function _supaDelete(path, key){
  // Best-effort cleanup of a dead subscription — never throws into the loop.
  try {
    await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
      method: 'DELETE',
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Prefer': 'return=minimal' }
    });
  } catch(_e){ /* ignore */ }
}
async function _supaAuthGetUser(jwt, key){
  const r = await fetch(`https://${SUPA_HOST}/auth/v1/user`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${jwt}` }
  });
  if(!r.ok) return null;
  return r.json();
}

// ── helpers ──────────────────────────────────────────────────
function _chunk(arr, n){ const out = []; for(let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }

// Local hour from UTC ms + getTimezoneOffset()-style offset (positive = behind UTC).
function _localHour(nowMs, offsetMin){
  return new Date(nowMs - offsetMin * 60000).getUTCHours();
}

// Kid-data list for an account: multi-profile kids if present, else the
// top-level data (a kid's own single-profile account / device).
function _kidList(data){
  const profiles = Array.isArray(data._profiles) ? data._profiles : [];
  const kids = profiles.filter(p => p && p.isParent === false);
  if(kids.length) return kids.map(p => ({ name: (p.name || 'Your kid'), d: (p.data || {}) }));
  return [{ name: (data.name || 'Your kid'), d: data }];
}

// At-risk kids: streak >= MIN_STREAK, not earned today (lastDayKey !==
// UTC-today), not goal-met today (implied, guarded). Returns [{name, streak}].
function _atRiskKids(data, todayUTC){
  return _kidList(data).map(function(k){
    const s = k.d && k.d.xpStreak;
    if(!s || typeof s !== 'object') return null;
    const count = +s.count || 0;
    if(count < MIN_STREAK) return null;
    if(s.lastDayKey === todayUTC) return null;            // earned today -> safe
    const metToday = (k.d.xpDayKey === todayUTC) && ((+k.d.xpToday || 0) >= (+k.d.dailyGoal || 25));
    if(metToday) return null;                              // implied by above; explicit
    return { name: k.name, streak: count };
  }).filter(Boolean);
}

// Deadline-agnostic copy.
function _composePush(atRisk){
  if(atRisk.length === 1){
    const k = atRisk[0];
    return {
      title: 'Keep ' + k.name + "'s streak alive",
      body:  k.name + ' is on a ' + k.streak + "-day streak and hasn't earned XP yet today. A quick win keeps it going."
    };
  }
  const parts = atRisk.map(k => k.name + ' (' + k.streak + '-day)');
  const list = (parts.length === 2)
    ? parts.join(' and ')
    : parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
  return {
    title: atRisk.length + ' streaks could use a quick win',
    body:  list + " haven't earned XP yet today. A quick win keeps their streaks going."
  };
}

// ── main handler ─────────────────────────────────────────────
module.exports = async function handler(req, res){
  if(req.method !== 'POST' && req.method !== 'GET'){
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serviceKey   = process.env.SUPA_SERVICE_KEY;
  const vapidPublic  = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:info@kingdom-creatives.com';
  const cronSecret   = process.env.CRON_SECRET;
  if(!serviceKey || !vapidPublic || !vapidPrivate){
    console.error('push-tick: missing env');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  // ── auth / mode (mirror engagement-tick) ──
  const testUserId = (req.query && req.query.testUser) ? String(req.query.testUser) : '';
  const authHeader = req.headers.authorization || '';
  let mode = 'scheduled';
  if(testUserId){
    mode = 'test';
    const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
    if(!jwt) return res.status(401).json({ error: 'Missing user JWT' });
    const user = await _supaAuthGetUser(jwt, serviceKey);
    if(!user || user.id !== testUserId){
      return res.status(403).json({ error: 'Token / testUser mismatch' });
    }
  } else {
    if(cronSecret && authHeader !== `Bearer ${cronSecret}`){
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // TEST-ONLY plumbing bypass: ?force=1 (with testUser) sends a sample push to
  // your own device REGARDLESS of the opt-out / at-risk / cooldown / evening
  // gates — so delivery + copy + the /app deep-link can be verified separately
  // from the gates under review. Has no effect in scheduled mode.
  const forced = (mode === 'test') && req.query && (req.query.force === '1' || req.query.force === 'true');

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const todayUTC = nowIso.slice(0, 10);

  // ── subscriptions first (opted-in devices only) ──
  let subs;
  try {
    subs = (mode === 'test')
      ? await _supaGet('push_subscriptions?select=user_id,subscription&user_id=eq.' + encodeURIComponent(testUserId), serviceKey)
      : await _supaGet('push_subscriptions?select=user_id,subscription&limit=5000', serviceKey);
  } catch(e){
    console.error('push-tick: subscriptions query failed:', e && e.message);
    return res.status(500).json({ error: 'Subscriptions query failed' });
  }
  if(!Array.isArray(subs) || !subs.length){
    return res.status(200).json({ ok: true, at: nowIso, mode, considered: 0, sent: 0, skipped: 0, cleaned: 0, failed: 0 });
  }

  // ── fetch profiles.data for those user_ids (chunked IN) ──
  const ids = Array.from(new Set(subs.map(s => s && s.user_id).filter(Boolean).map(String)));
  const dataById = {};
  for(const chunk of _chunk(ids, 50)){
    try {
      const rows = await _supaGet(
        'profiles?select=user_id,data&user_id=in.(' + chunk.map(encodeURIComponent).join(',') + ')',
        serviceKey
      );
      if(Array.isArray(rows)) rows.forEach(r => { if(r && r.user_id) dataById[String(r.user_id)] = r.data || {}; });
    } catch(e){
      console.warn('push-tick: profiles chunk failed:', e && e.message);
    }
  }

  const results = { ok: true, at: nowIso, mode, considered: 0, sent: 0, skipped: 0, cleaned: 0, failed: 0, details: [] };

  for(const sub of subs){
    results.considered++;
    if(!sub || !sub.user_id || !sub.subscription){ results.skipped++; continue; }
    const uid = String(sub.user_id);
    const data = dataById[uid] || {};
    const pushPrefs = (data.pushPrefs && typeof data.pushPrefs === 'object') ? data.pushPrefs : {};

    // opt-out (always — except a forced plumbing test)
    if(!forced && pushPrefs.retentionOptOut === true){
      results.skipped++; results.details.push({ user_id: uid, reason: 'opted_out' }); continue;
    }

    // scheduled-only gates (test bypasses cooldown / shared-stamp / evening)
    if(mode === 'scheduled'){
      if(pushPrefs.lastStreakRiskPush === todayUTC){
        results.skipped++; results.details.push({ user_id: uid, reason: 'push_cooldown' }); continue;
      }
      if(data.lastStreakNudgeDate === todayUTC){
        results.skipped++; results.details.push({ user_id: uid, reason: 'streak_nudge_already_today' }); continue;
      }
      const offsetMin = (data.emailPrefs && typeof data.emailPrefs.timezoneOffsetMin === 'number')
        ? data.emailPrefs.timezoneOffsetMin : null;
      if(offsetMin === null){
        results.skipped++; results.details.push({ user_id: uid, reason: 'no_timezone' }); continue;
      }
      const h = _localHour(now, offsetMin);
      if(h < EVENING_START_HOUR || h >= EVENING_END_HOUR){
        results.skipped++; results.details.push({ user_id: uid, reason: 'not_evening', localHour: h }); continue;
      }
    }

    // at-risk kids (forced plumbing test: send a representative sample if the
    // account isn't genuinely at-risk, so copy still renders).
    let atRisk = _atRiskKids(data, todayUTC);
    if(!atRisk.length){
      if(forced){
        const sampleName = (_kidList(data)[0] && _kidList(data)[0].name) || 'your kid';
        atRisk = [{ name: sampleName, streak: 5 }];
      } else {
        results.skipped++; results.details.push({ user_id: uid, reason: 'no_at_risk_kid' }); continue;
      }
    }

    const copy = _composePush(atRisk);
    const payload = JSON.stringify({ title: copy.title, body: copy.body, url: 'https://yourlifecc.com/app' });

    try {
      await webpush.sendNotification(sub.subscription, payload);
      results.sent++;
      results.details.push({ user_id: uid, kids: atRisk.map(k => k.name + ':' + k.streak) });

      if(mode === 'scheduled'){
        const newData = Object.assign({}, data, {
          pushPrefs: Object.assign({}, pushPrefs, { lastStreakRiskPush: todayUTC }),
          lastStreakNudgeDate: todayUTC
        });
        try {
          await _supaPatch('profiles?user_id=eq.' + encodeURIComponent(uid), { data: newData }, serviceKey);
        } catch(e){ console.warn('push-tick: stamp failed for', uid, e && e.message); }
      }
    } catch(e){
      const code = e && (e.statusCode || e.status);
      if(code === 410 || code === 404){
        if(mode === 'scheduled') await _supaDelete('push_subscriptions?user_id=eq.' + encodeURIComponent(uid), serviceKey);
        results.cleaned++;
        results.details.push({ user_id: uid, reason: 'gone_deleted' });
      } else {
        results.failed++;
        results.details.push({ user_id: uid, error: (e && e.message) || 'send_failed' });
        console.warn('push-tick: send failed for', uid, code || (e && e.message));
      }
    }
  }

  return res.status(200).json(results);
};
