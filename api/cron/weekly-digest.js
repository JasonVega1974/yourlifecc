// api/cron/weekly-digest.js — Email Bundle Track 1
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Two dispatch modes on POST:
//
//   1) SCHEDULED RUN (default — Vercel Cron)
//      Authorization: Bearer ${CRON_SECRET}
//      No body / no query params.
//      Walks the full audience, computes per-user weekly slice from
//      D.activityLog, sends per-user. Updates lastDigestSent on
//      successful send.
//
//   2) TEST RUN (Parent Hub "Send test digest now" button)
//      POST /api/cron/weekly-digest?testUser=<userId>
//      Authorization: Bearer <user's Supabase JWT>
//      Server validates the JWT via Supabase auth.getUser, confirms
//      the returned user.id matches the testUser query param, then
//      processes ONLY that one user. Does NOT update lastDigestSent
//      so the next scheduled run still fires normally.
//
// Audience filter (scheduled mode):
//   plan_status IN ('active','trialing','free_contest')
//   AND data.emailPrefs.digestOptIn === true
//   AND data.emailPrefs.allOptOut !== true
//   AND local clock is Sunday 19:00 (anchored via timezoneOffsetMin)
//   AND lastDigestSent is null OR before local Sunday 7pm of this week
//
// faith_free is EXCLUDED — single-person tier with no kids, no
// family digest applies. Track 3 owns crossover invitations.
//
// Env vars:
//   CRON_SECRET         — Vercel-set; auths the scheduled hourly hit
//   SUPA_SERVICE_KEY    — service-role key (reads profiles, updates lastDigestSent)
//   EMAIL_UNSUB_SECRET  — HMAC secret for per-stream unsubscribe tokens
//   BREVO_API_KEY       — Brevo transactional sender key

const crypto = require('crypto');

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const BREVO_HOST = 'api.brevo.com';

const SCHEDULED_PLAN_STATUSES = new Set(['active', 'trialing', 'free_contest']);

// ── Token minting (matches /api/email-prefs verifier) ────────
function _mintUnsubToken(userId, list, secret){
  const payload = { u: String(userId), l: String(list), t: Date.now() };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return payloadB64 + '.' + sig;
}
function _unsubUrl(userId, list, secret){
  return 'https://yourlifecc.com/unsubscribe'
       + '?token='  + encodeURIComponent(_mintUnsubToken(userId, list, secret))
       + '&list='   + encodeURIComponent(list)
       + '&action=unsubscribe';
}

// ── Supabase REST helpers ────────────────────────────────────
async function _supaGet(path, serviceKey){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
    headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
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
      'Prefer':        'return=minimal'
    },
    body: JSON.stringify(body)
  });
  if(!r.ok){
    const text = await r.text();
    throw new Error(`Supabase PATCH ${r.status}: ${text.slice(0, 200)}`);
  }
}
async function _supaAuthGetUser(jwt, serviceKey){
  const r = await fetch(`https://${SUPA_HOST}/auth/v1/user`, {
    headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${jwt}` }
  });
  if(!r.ok) return null;
  return r.json();
}

// ── HTML utilities ───────────────────────────────────────────
function _esc(s){
  if(s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── Activity-log accessors (must match activity-log.js shape) ─
// Reads new-shape entries via fields; falls back to legacy (type/
// detail/time) shape so pre-FAF entries don't get dropped.
const LEGACY_DOMAIN = {
  scripture:'faith', habit:'habit', deduction:'parent',
  faith:'faith', study:'faith', bible:'faith', character:'skill',
  helpful:'chore', contest:'parent', quiz:'skill', challenge:'chore',
  growth:'health', lesson:'skill', growingup:'skill'
};
function _evDomain(e){
  if(!e) return 'misc';
  if(e.domain) return e.domain;
  return LEGACY_DOMAIN[e.type] || e.type || 'misc';
}
function _evEvent(e){
  if(!e) return '';
  if(e.event) return e.event;
  return e.type || '';
}
function _evTitle(e){
  if(!e) return '';
  return e.title || e.detail || '';
}
function _evTs(e){
  if(!e) return 0;
  if(typeof e.ts === 'number' && e.ts > 0) return e.ts;
  if(e.time){ const t = Date.parse(e.time); return isNaN(t) ? 0 : t; }
  return 0;
}

// ── Time math ────────────────────────────────────────────────
// timezoneOffsetMin matches JS getTimezoneOffset() — minutes WEST
// of UTC (positive for the Americas, negative for EU/Asia/AU).
// userLocalNow = the UTC Date whose UTC components represent the
// user's local clock.
function _userLocalNow(nowMs, offsetMin){
  return new Date(nowMs - offsetMin * 60000);
}
// Convert "local 19:00 Sunday of THIS local week" → its UTC Date.
function _localSunday7pmUtc(userLocalNow, offsetMin){
  // Take a copy with UTC components representing local; clamp
  // back to the local Sunday at 19:00:00.
  const d = new Date(userLocalNow.getTime());
  const day = d.getUTCDay();          // 0 = local Sunday
  d.setUTCDate(d.getUTCDate() - day);  // back to local Sunday
  d.setUTCHours(19, 0, 0, 0);          // 19:00 local
  // Convert local-stamped UTC components back to real UTC.
  return new Date(d.getTime() + offsetMin * 60000);
}

// ── Per-user payload builder ─────────────────────────────────
function _buildPayload(row, nowMs){
  const data = (row && row.data) || {};
  const prefs = data.emailPrefs || {};

  const offsetMin = (typeof prefs.timezoneOffsetMin === 'number')
    ? prefs.timezoneOffsetMin
    : 0;
  const localNow = _userLocalNow(nowMs, offsetMin);
  const sunday7pmUtc = _localSunday7pmUtc(localNow, offsetMin);
  const weekStartUtc = new Date(sunday7pmUtc.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Skip if there are no kids — the digest is family-scoped.
  const profiles = Array.isArray(data._profiles) ? data._profiles : [];
  const kids = profiles.filter(function(p){ return p && p.isParent === false; });
  if(!kids.length) return null;

  // Filter activity log to the week.
  const log = Array.isArray(data.activityLog) ? data.activityLog : [];
  const weekEvents = log.filter(function(e){
    const t = _evTs(e);
    return t >= weekStartUtc.getTime() && t < sunday7pmUtc.getTime();
  });

  // Skip empty weeks (anti-spam rule).
  if(!weekEvents.length) return null;

  // Per-kid aggregation
  const kidsPayload = kids.map(function(k){
    const myEvents = weekEvents.filter(function(e){
      return e && e.profileId != null && String(e.profileId) === String(k.id);
    });
    if(!myEvents.length){
      return {
        id:    String(k.id),
        name:  k.name || 'Kid',
        avatar:k.avatar || '🧒',
        color: k.color || '#94a3b8',
        eventCount: 0,
        highlights: [],
        faith: null,
        empty: true
      };
    }
    // Counters
    let chores = 0, goals = 0, certs = 0, badges = 0, moneyMilestones = 0;
    const highlights = [];   // {priority, text}
    const faithCounts = { scripture: 0, prayer: 0, plan: 0 };

    myEvents.forEach(function(e){
      const dom = _evDomain(e);
      const ev  = _evEvent(e);
      const title = _evTitle(e);
      if(dom === 'chore' && ev === 'verified') chores++;
      if(dom === 'goal'  && ev === 'completed') goals++;
      if(dom === 'skill' && ev === 'cert_earned') certs++;
      if((dom === 'chore' && ev === 'badge_earned') ||
         (dom === 'health' && ev === 'badge_earned') ||
         (dom === 'goal'  && ev === 'milestone_earned')){
        badges++;
        highlights.push({ priority: 1, text: title || 'Badge earned' });
      }
      if(dom === 'money' && ev === 'milestone'){
        moneyMilestones++;
        highlights.push({ priority: 2, text: title || 'Money milestone' });
      }
      if(dom === 'goal' && ev === 'completed'){
        highlights.push({ priority: 3, text: title || 'Goal achieved' });
      }
      if(dom === 'skill' && ev === 'cert_earned'){
        highlights.push({ priority: 4, text: title || 'Certified' });
      }
      // Faith sub-counts (Inc 2 wirings emit these via shim)
      if(dom === 'faith'){
        if(ev === 'scripture_read' || ev === 'bible_read') faithCounts.scripture++;
        else if(ev === 'study' || /prayer/i.test(ev) || /prayer/i.test(title)) faithCounts.prayer++;
        else if(/plan|day/i.test(title)) faithCounts.plan++;
      }
    });

    // Top 3 highlights by priority (ascending).
    highlights.sort(function(a, b){ return a.priority - b.priority; });
    const topHighlights = highlights.slice(0, 3).map(function(h){ return h.text; });
    // Fallback: if no badge/milestone highlights, use chore count line.
    if(!topHighlights.length && chores > 0){
      topHighlights.push(chores + ' chore' + (chores > 1 ? 's' : '') + ' completed');
    }

    const showFaith = (data.faithMode !== false) && (data.faithOnly !== true) &&
                      (faithCounts.scripture || faithCounts.prayer || faithCounts.plan);

    return {
      id:     String(k.id),
      name:   k.name || 'Kid',
      avatar: k.avatar || '🧒',
      color:  k.color || '#94a3b8',
      eventCount: myEvents.length,
      counts: { chores, goals, certs, badges, moneyMilestones },
      highlights: topHighlights,
      faith: showFaith ? faithCounts : null,
      empty: false
    };
  });

  // Family roll-up
  let totalChores = 0, totalGoals = 0, totalBadges = 0;
  kidsPayload.forEach(function(k){
    if(!k.counts) return;
    totalChores += k.counts.chores;
    totalGoals  += k.counts.goals;
    totalBadges += k.counts.badges;
  });
  // Top kid by event count
  let topKidName = null, topKidEventCount = 0;
  kidsPayload.forEach(function(k){
    if(k.eventCount > topKidEventCount){
      topKidName = k.name;
      topKidEventCount = k.eventCount;
    }
  });

  // Parent first-name preference order
  const parentFirstName = (function(){
    const candidates = [
      profiles.find(function(p){ return p && p.isParent === true; }),
    ];
    const pp = candidates[0];
    let n = (pp && pp.name) || data.parentName || data.name || '';
    n = String(n).trim();
    if(!n) return 'there';
    return n.split(/\s+/)[0];   // first token only
  })();

  // Week range label, in user-local terms.
  function _fmtLocal(d){
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }
  const weekRangeLabel =
    _fmtLocal(new Date(weekStartUtc.getTime() + offsetMin * 60000))
    + ' – '
    + _fmtLocal(new Date(sunday7pmUtc.getTime() + offsetMin * 60000));

  return {
    userId:          row.user_id,
    recipientEmail:  prefs.recipientEmail || row.email || '',
    parentFirstName: parentFirstName,
    weekRangeLabel:  weekRangeLabel,
    totalEvents:     weekEvents.length,
    topKid:          topKidName,
    familyRoll:      { chores: totalChores, goals: totalGoals, badges: totalBadges },
    kids:            kidsPayload
  };
}

// ── HTML render ──────────────────────────────────────────────
function _renderDigestHtml(payload, unsubDigestUrl, unsubAllUrl){
  function kidBlock(k){
    if(k.empty){
      return ''
        + '<div style="margin-bottom:18px;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">'
        +   '<div style="display:flex;align-items:center;gap:8px;">'
        +     '<span style="width:24px;height:24px;border-radius:50%;background:' + _esc(k.color) + ';display:inline-flex;align-items:center;justify-content:center;font-size:14px;color:#fff;">' + _esc(k.avatar) + '</span>'
        +     '<strong style="font-size:15px;color:#0b1020;">' + _esc(k.name) + '</strong>'
        +     '<span style="font-size:11px;color:#94a3b8;margin-left:auto;">Quiet week — that\'s okay too</span>'
        +   '</div>'
        + '</div>';
    }
    const highlights = (k.highlights || []).map(function(h){
      return '<li style="margin-bottom:4px;">' + _esc(h) + '</li>';
    }).join('');
    const faith = k.faith
      ? '<div style="font-size:11px;color:#a78bfa;margin-top:8px;letter-spacing:.04em;">FAITH · '
        + k.faith.scripture + ' scripture · ' + k.faith.prayer + ' prayer · ' + k.faith.plan + ' plan</div>'
      : '';
    return ''
      + '<div style="margin-bottom:18px;padding:14px 16px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">'
      +   '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">'
      +     '<span style="width:24px;height:24px;border-radius:50%;background:' + _esc(k.color) + ';display:inline-flex;align-items:center;justify-content:center;font-size:14px;color:#fff;">' + _esc(k.avatar) + '</span>'
      +     '<strong style="font-size:15px;color:#0b1020;">' + _esc(k.name) + '</strong>'
      +     '<span style="font-size:11px;color:#94a3b8;margin-left:auto;">' + k.eventCount + ' event' + (k.eventCount === 1 ? '' : 's') + '</span>'
      +   '</div>'
      +   (highlights ? '<ul style="font-size:13px;color:#475569;line-height:1.6;margin:0;padding-left:18px;">' + highlights + '</ul>' : '')
      +   faith
      + '</div>';
  }

  const kidsHtml = payload.kids.map(kidBlock).join('');

  return ''
    + '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1a1a2e;max-width:560px;margin:0 auto;padding:24px;background:#f1f5f9;">'
    +   '<div style="font-size:11px;letter-spacing:1.6px;color:#a78bfa;font-weight:800;text-transform:uppercase;margin-bottom:8px;">FAMILY DIGEST &middot; WEEK OF ' + _esc(payload.weekRangeLabel.toUpperCase()) + '</div>'
    +   '<h1 style="font-size:22px;line-height:1.25;margin:0 0 12px;color:#0b1020;">Hi ' + _esc(payload.parentFirstName) + ',</h1>'
    +   '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 18px;">This week the family logged <strong>' + payload.totalEvents + '</strong> activities'
    +     (payload.topKid ? ' — ' + _esc(payload.topKid) + ' had the strongest week.' : '.')
    +   '</p>'
    +   '<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin:0 0 18px;">'
    +     '<div style="font-size:11px;letter-spacing:1.2px;color:#64748b;font-weight:700;margin-bottom:12px;">FAMILY ROLL-UP</div>'
    +     '<div style="display:flex;gap:18px;flex-wrap:wrap;">'
    +       '<div style="flex:1;min-width:90px;"><div style="font-size:24px;font-weight:800;color:#10b981;">' + payload.familyRoll.chores + '</div><div style="font-size:11px;color:#475569;letter-spacing:.05em;">CHORES DONE</div></div>'
    +       '<div style="flex:1;min-width:90px;"><div style="font-size:24px;font-weight:800;color:#a78bfa;">' + payload.familyRoll.goals  + '</div><div style="font-size:11px;color:#475569;letter-spacing:.05em;">GOALS ACHIEVED</div></div>'
    +       '<div style="flex:1;min-width:90px;"><div style="font-size:24px;font-weight:800;color:#fbbf24;">' + payload.familyRoll.badges + '</div><div style="font-size:11px;color:#475569;letter-spacing:.05em;">BADGES EARNED</div></div>'
    +     '</div>'
    +   '</div>'
    +   kidsHtml
    +   '<div style="text-align:center;margin:24px 0;">'
    +     '<a href="https://yourlifecc.com/app" style="display:inline-block;background:#10b981;color:#ffffff;font-weight:800;padding:13px 24px;border-radius:10px;text-decoration:none;">Open YourLife CC &rarr;</a>'
    +   '</div>'
    +   '<div style="font-size:11px;color:#94a3b8;text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;line-height:1.7;">'
    +     'You\'re receiving this because the weekly digest is on in Parent Hub.<br>'
    +     '<a href="' + _esc(unsubDigestUrl) + '" style="color:#94a3b8;text-decoration:underline;">Unsubscribe from digest emails</a>'
    +     ' &middot; <a href="' + _esc(unsubAllUrl) + '" style="color:#94a3b8;text-decoration:underline;">Unsubscribe from all emails</a><br>'
    +     'Kingdom Creatives LLC &middot; <a href="https://yourlifecc.com" style="color:#94a3b8;text-decoration:underline;">yourlifecc.com</a>'
    +   '</div>'
    + '</div>';
}

function _renderDigestText(payload, unsubDigestUrl, unsubAllUrl){
  const lines = [];
  lines.push('YourLife CC · Family digest · week of ' + payload.weekRangeLabel);
  lines.push('');
  lines.push('Hi ' + payload.parentFirstName + ',');
  lines.push('');
  lines.push('This week the family logged ' + payload.totalEvents + ' activities'
    + (payload.topKid ? ' — ' + payload.topKid + ' had the strongest week.' : '.'));
  lines.push('');
  lines.push('FAMILY ROLL-UP');
  lines.push('  Chores done:    ' + payload.familyRoll.chores);
  lines.push('  Goals achieved: ' + payload.familyRoll.goals);
  lines.push('  Badges earned:  ' + payload.familyRoll.badges);
  lines.push('');
  payload.kids.forEach(function(k){
    lines.push(k.name + (k.empty ? ' — Quiet week.' : ' (' + k.eventCount + ' events)'));
    if(!k.empty){
      (k.highlights || []).forEach(function(h){ lines.push('  • ' + h); });
      if(k.faith){
        lines.push('  Faith: ' + k.faith.scripture + ' scripture · ' + k.faith.prayer + ' prayer · ' + k.faith.plan + ' plan');
      }
    }
    lines.push('');
  });
  lines.push('Open YourLife CC: https://yourlifecc.com/app');
  lines.push('');
  lines.push('Manage emails:');
  lines.push('  Unsubscribe from digest: ' + unsubDigestUrl);
  lines.push('  Unsubscribe from all:    ' + unsubAllUrl);
  lines.push('Kingdom Creatives LLC · yourlifecc.com');
  return lines.join('\n');
}

// ── Brevo send ───────────────────────────────────────────────
async function _brevoSend({ to, subject, html, text, listUnsubUrl, listUnsubMailto, brevoKey }){
  const payload = {
    sender:  { name: 'YourLife CC', email: 'info@kingdom-creatives.com' },
    to:      [{ email: to }],
    replyTo: { email: 'info@kingdom-creatives.com', name: 'YourLife CC' },
    subject,
    htmlContent: html,
    textContent: text,
    // RFC 8058 one-click unsubscribe (Gmail/Yahoo bulk-sender rules)
    headers: {
      'List-Unsubscribe':       '<' + listUnsubMailto + '>, <' + listUnsubUrl + '>',
      'List-Unsubscribe-Post':  'List-Unsubscribe=One-Click'
    }
  };
  const r = await fetch(`https://${BREVO_HOST}/v3/smtp/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key':      brevoKey,
      'accept':       'application/json'
    },
    body: JSON.stringify(payload)
  });
  if(!r.ok){
    const text = await r.text();
    throw new Error('Brevo ' + r.status + ': ' + text.slice(0, 200));
  }
  return r.json();
}

// ── Main handler ─────────────────────────────────────────────
module.exports = async function handler(req, res){
  if(req.method !== 'POST' && req.method !== 'GET'){
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serviceKey = process.env.SUPA_SERVICE_KEY;
  const unsubSecret = process.env.EMAIL_UNSUB_SECRET;
  const brevoKey = process.env.BREVO_API_KEY;
  const cronSecret = process.env.CRON_SECRET;
  if(!serviceKey || !unsubSecret || !brevoKey){
    console.error('weekly-digest: missing env (SUPA_SERVICE_KEY / EMAIL_UNSUB_SECRET / BREVO_API_KEY)');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Dispatch: testUser query param flips to single-user test mode
  const testUserId = (req.query && req.query.testUser) ? String(req.query.testUser) : '';
  const authHeader = req.headers.authorization || '';

  let mode = 'scheduled';
  if(testUserId){
    mode = 'test';
    // Validate user JWT: it must resolve to the same user as testUser
    const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
    if(!jwt) return res.status(401).json({ error: 'Missing user JWT' });
    const user = await _supaAuthGetUser(jwt, serviceKey);
    if(!user || user.id !== testUserId){
      return res.status(403).json({ error: 'Token / testUser mismatch' });
    }
  } else {
    // Scheduled mode requires CRON_SECRET (when set).
    if(cronSecret){
      if(authHeader !== `Bearer ${cronSecret}`){
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
  }

  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  // Fetch audience
  let rows;
  try {
    if(mode === 'test'){
      rows = await _supaGet(
        'profiles?select=user_id,email,plan_status,data&user_id=eq.' + encodeURIComponent(testUserId) + '&limit=1',
        serviceKey
      );
    } else {
      // Pull every user with a viable plan; do remaining filtering in JS.
      // Audience is small in v1; revisit chunking when row count grows.
      rows = await _supaGet(
        'profiles?select=user_id,email,plan_status,data&plan_status=in.(active,trialing,free_contest)&limit=2000',
        serviceKey
      );
    }
  } catch(e){
    console.error('weekly-digest: audience query failed:', e && e.message);
    return res.status(500).json({ error: 'Audience query failed' });
  }

  const results = { mode, considered: 0, sent: 0, skipped: 0, failed: 0, details: [] };

  for(const row of rows){
    results.considered++;
    if(!row || !row.user_id){ results.skipped++; continue; }

    const data = row.data || {};
    const prefs = data.emailPrefs || {};

    // Test mode skips the opt-in / time-window gates entirely so the
    // user can preview their digest before opting in.
    if(mode === 'scheduled'){
      if(!SCHEDULED_PLAN_STATUSES.has(row.plan_status || '')){ results.skipped++; continue; }
      if(prefs.digestOptIn !== true){ results.skipped++; continue; }
      if(prefs.allOptOut === true){   results.skipped++; continue; }

      const offsetMin = (typeof prefs.timezoneOffsetMin === 'number') ? prefs.timezoneOffsetMin : null;
      if(offsetMin === null){ results.skipped++; continue; }

      const localNow = _userLocalNow(now, offsetMin);
      const localDay = localNow.getUTCDay();
      const localHour = localNow.getUTCHours();
      if(localDay !== 0 || localHour !== 19){ results.skipped++; continue; }

      // Once-per-week: lastDigestSent must be older than this week's Sunday-7pm.
      const sunday7pmUtc = _localSunday7pmUtc(localNow, offsetMin);
      const last = prefs.lastDigestSent ? Date.parse(prefs.lastDigestSent) : 0;
      if(last && last >= (sunday7pmUtc.getTime() - 3600000)){
        results.skipped++; continue;
      }
    }

    const payload = _buildPayload(row, now);
    if(!payload){
      results.skipped++;
      results.details.push({ user_id: row.user_id, reason: 'no_kids_or_empty_week' });
      continue;
    }
    if(!payload.recipientEmail){
      results.skipped++;
      results.details.push({ user_id: row.user_id, reason: 'no_email' });
      continue;
    }

    const subject = payload.parentFirstName + ', here\'s the family week — '
      + payload.totalEvents + ' wins'
      + (payload.topKid ? ', ' + payload.topKid + '\'s best week' : '');

    const unsubDigestUrl = _unsubUrl(row.user_id, 'digest', unsubSecret);
    const unsubAllUrl    = _unsubUrl(row.user_id, 'all',    unsubSecret);
    const unsubMailto    = 'mailto:info@kingdom-creatives.com?subject=Unsubscribe%20digest';

    const html = _renderDigestHtml(payload, unsubDigestUrl, unsubAllUrl);
    const text = _renderDigestText(payload, unsubDigestUrl, unsubAllUrl);

    try {
      await _brevoSend({
        to:              payload.recipientEmail,
        subject:         subject,
        html:            html,
        text:            text,
        listUnsubUrl:    unsubDigestUrl,
        listUnsubMailto: unsubMailto,
        brevoKey:        brevoKey
      });
      results.sent++;
      results.details.push({
        user_id: row.user_id, to: payload.recipientEmail,
        events:  payload.totalEvents,
        topKid:  payload.topKid
      });

      // Only stamp lastDigestSent in scheduled mode — test sends
      // must not block the real Sunday-7pm fire.
      if(mode === 'scheduled'){
        const newPrefs = Object.assign({}, prefs, { lastDigestSent: nowIso });
        const newData = Object.assign({}, data, { emailPrefs: newPrefs });
        try {
          await _supaPatch(
            'profiles?user_id=eq.' + encodeURIComponent(row.user_id),
            { data: newData },
            serviceKey
          );
        } catch(e){
          console.warn('weekly-digest: stamp failed for', row.user_id, e && e.message);
        }
      }
    } catch(e){
      results.failed++;
      results.details.push({ user_id: row.user_id, error: (e && e.message) || 'send_failed' });
      console.error('weekly-digest: Brevo send failed for', row.user_id, e && e.message);
    }
  }

  return res.status(200).json(Object.assign({ ok: true, at: nowIso }, results));
};
