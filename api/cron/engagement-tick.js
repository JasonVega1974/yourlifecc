// api/cron/engagement-tick.js — Email Bundle Track 2
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Hourly cron handler that walks the engagement audience and fires
// the single highest-priority trigger per user that meets the gates.
// Five triggers in priority order:
//
//   1. INACTIVITY        — no D.activityLog entry in 5+ days
//   2. STREAK_AT_RISK    — kid streak >=3 days, no check-in today,
//                          local hour >= 18 (6pm onward)
//   3. RELEASE_NOTES     — release-notes.js entry with version >
//                          user.emailPrefs.lastReleaseNoteVersion
//                          AND user.plan_status ∈ entry.audience
//   4. REFER_A_FRIEND    — account >=30d, lastReferralNudge null
//                          or older than 90d
//   5. ONBOARDING        — account >=3d, onboardingDone !== true OR
//                          no kid profiles OR no chores/goals set up
//
// Audience filter:
//   plan_status IN ('active','trialing','free_contest')
//   AND data.emailPrefs.engagementOptIn === true
//   AND data.emailPrefs.allOptOut !== true
//   AND no email sent in last 7 days (lastEngagementSent)
//   AND no D.activityLog entry in the last 1 hour (don't email
//       someone who's actively using the app right now)
//
// faith_free is EXCLUDED — Track 3 owns that audience via crossover.
//
// Dispatch modes (same pattern as Track 1):
//   • SCHEDULED — Vercel Cron hits hourly. Bearer ${CRON_SECRET}.
//   • TEST      — Parent Hub or admin tool. ?testUser=<userId>,
//                 Authorization: Bearer <user's Supabase JWT>.
//                 Bypasses the recently-opened + recent-engagement
//                 gates so the user can preview what would fire.
//                 Does NOT stamp lastEngagementSent.
//
// Env vars:
//   CRON_SECRET, SUPA_SERVICE_KEY, EMAIL_UNSUB_SECRET, BREVO_API_KEY

const crypto       = require('crypto');
const releaseNotes = require('../../docs/release-notes');

const SUPA_HOST  = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const BREVO_HOST = 'api.brevo.com';

const SCHEDULED_PLAN_STATUSES = new Set(['active', 'trialing', 'free_contest']);

// Cooldowns (ms)
const ENGAGEMENT_COOLDOWN_MS = 7  * 24 * 60 * 60 * 1000; // 7 days
const REFERRAL_COOLDOWN_MS   = 90 * 24 * 60 * 60 * 1000; // 90 days
const INACTIVITY_THRESHOLD_MS= 5  * 24 * 60 * 60 * 1000; // 5 days
const RECENTLY_OPENED_MS     = 1  * 60 * 60 * 1000;       // 1 hour
const ONBOARDING_GRACE_MS    = 3  * 24 * 60 * 60 * 1000; // 3 days
const ACCOUNT_AGE_FOR_REFERRAL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const STREAK_RISK_LOCAL_HOUR = 18; // 6pm — don't nudge before this
const MIN_STREAK_FOR_RISK    = 3;

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

// Activity-log accessors (mirror activity-log.js dual-shape)
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
function _evTs(e){
  if(!e) return 0;
  if(typeof e.ts === 'number' && e.ts > 0) return e.ts;
  if(e.time){ const t = Date.parse(e.time); return isNaN(t) ? 0 : t; }
  return 0;
}

// Local-time helpers — matches Track 1
function _userLocalNow(nowMs, offsetMin){
  return new Date(nowMs - offsetMin * 60000);
}

// Parent first-name picker — matches Track 1 preference order
function _parentFirstName(data, profiles){
  const parentProfile = profiles.find(function(p){ return p && p.isParent === true; });
  let n = (parentProfile && parentProfile.name) || data.parentName || data.name || '';
  n = String(n).trim();
  if(!n) return 'there';
  return n.split(/\s+/)[0];
}

// Ref code derivation — matches the client formula in
// app/index.html line ~19392 so the same code resolves on both
// surfaces (client-side localStorage cache + server-side mint).
function _deriveRefCode(userId){
  if(!userId) return '';
  return String(userId).replace(/-/g, '').substring(0, 8).toUpperCase();
}
function _referralLink(userId){
  return 'https://yourlifecc.com/index.html?ref=' + _deriveRefCode(userId);
}

// ── Trigger evaluators ───────────────────────────────────────
// Each evaluator returns either null (no match) or a payload object
// that the email renderer uses. Priority is enforced in the main
// dispatch — first non-null wins.

function _evalInactivity(ctx){
  // Highest priority — Jason called this one out specifically.
  // No activityLog entry within the last 5 days.
  const lastTs = ctx.recentActivityTs || 0;
  if(!lastTs){
    // Brand new account, never any activity — let onboarding handle it.
    return null;
  }
  const ageMs = ctx.nowMs - lastTs;
  if(ageMs < INACTIVITY_THRESHOLD_MS) return null;

  // Build per-kid "last seen" snippets for the email body.
  const kidLastSeen = ctx.kids.map(function(k){
    const pid = String(k.id);
    const myEvents = (ctx.activityLog || []).filter(function(e){
      return e && e.profileId != null && String(e.profileId) === pid;
    });
    if(!myEvents.length){
      return { name: k.name || 'Kid', daysAgo: null, lastDomain: null };
    }
    let maxTs = 0, lastDom = null;
    myEvents.forEach(function(e){
      const t = _evTs(e);
      if(t > maxTs){ maxTs = t; lastDom = _evDomain(e); }
    });
    return {
      name:       k.name || 'Kid',
      daysAgo:    Math.max(0, Math.floor((ctx.nowMs - maxTs) / 86400000)),
      lastDomain: lastDom
    };
  });

  return {
    daysSinceActivity: Math.floor(ageMs / 86400000),
    kidLastSeen:       kidLastSeen
  };
}

function _evalStreakAtRisk(ctx){
  // Per-kid streak check. Kid's streak lives at
  // row.data._profiles[i].data.streak (multi-profile pattern).
  // Risk = streak >= 3, no check-in today (D.dailyChecks[today]
  // missing for that kid), local hour >= 18.
  if(!ctx.kids.length) return null;

  const localNow = _userLocalNow(ctx.nowMs, ctx.offsetMin);
  if(localNow.getUTCHours() < STREAK_RISK_LOCAL_HOUR) return null;

  // Local-date YYYY-MM-DD for today
  const todayLocal = localNow.getUTCFullYear()
    + '-' + String(localNow.getUTCMonth() + 1).padStart(2, '0')
    + '-' + String(localNow.getUTCDate()).padStart(2, '0');

  // Pick the kid with the longest at-risk streak.
  let risky = null;
  ctx.kids.forEach(function(k){
    const kd = (k && k.data) || {};
    const streak = Number(kd.streak) || 0;
    if(streak < MIN_STREAK_FOR_RISK) return;
    // Has a check-in today?
    const checks = (kd.dailyChecks && typeof kd.dailyChecks === 'object') ? kd.dailyChecks : {};
    if(checks[todayLocal]) return;  // already checked in
    // Fallback signal — any activityLog entry today for this kid?
    const pid = String(k.id);
    const todayEvents = (ctx.activityLog || []).filter(function(e){
      if(!e || e.profileId == null) return false;
      if(String(e.profileId) !== pid) return false;
      return (e.date === todayLocal) ||
             (_evTs(e) >= localNow.setUTCHours(0,0,0,0));
    });
    if(todayEvents.length) return;
    if(!risky || streak > risky.streak){
      risky = { kidName: k.name || 'Kid', streak: streak };
    }
  });

  if(!risky) return null;
  return risky;
}

function _evalReleaseNotes(ctx){
  // PAUSED 2026-06-08 — release_notes trigger temporarily disabled
  // while the user-facing copy in /docs/release-notes.js is rewritten
  // away from developer language (the first send used "shipped" and
  // similar dev terms in the body).
  // Re-enable once release-notes copy is reviewed: set
  // RELEASE_NOTES_ENABLED=1 in Vercel env vars. No code change
  // needed to lift the pause — toggle the env var and redeploy.
  if(process.env.RELEASE_NOTES_ENABLED !== '1') return null;

  // Pick entries with version > user's lastReleaseNoteVersion AND
  // user.plan_status in the entry's audience.
  const lastSeen = Number(ctx.prefs.lastReleaseNoteVersion) || 0;
  const planStatus = ctx.planStatus || '';
  const unseen = (releaseNotes || []).filter(function(n){
    if(!n || typeof n.version !== 'number') return false;
    if(n.version <= lastSeen) return false;
    const audience = Array.isArray(n.audience) ? n.audience : [];
    if(!audience.includes(planStatus)) return false;
    return true;
  }).sort(function(a, b){ return b.version - a.version; });   // newest first

  if(!unseen.length) return null;
  // Cap at 3 entries per email so the body doesn't bloat.
  return {
    entries:    unseen.slice(0, 3),
    maxVersion: unseen[0].version
  };
}

function _evalReferAFriend(ctx){
  // Account >=30d old AND no referral nudge in last 90d. We don't
  // currently track "have they referred anyone" server-side, so the
  // 90d spacing + 7d global cap bounds the volume.
  if(!ctx.createdAtMs) return null;
  if((ctx.nowMs - ctx.createdAtMs) < ACCOUNT_AGE_FOR_REFERRAL_MS) return null;
  const lastNudge = ctx.prefs.lastReferralNudge ? Date.parse(ctx.prefs.lastReferralNudge) : 0;
  if(lastNudge && (ctx.nowMs - lastNudge) < REFERRAL_COOLDOWN_MS) return null;

  return {
    refCode: _deriveRefCode(ctx.userId),
    refLink: _referralLink(ctx.userId)
  };
}

function _evalOnboarding(ctx){
  // Account >=3d old AND any of:
  //   • onboardingDone !== true
  //   • _profiles has no kid
  //   • No chores in D.chores
  //   • No goals in D.goals
  if(!ctx.createdAtMs) return null;
  if((ctx.nowMs - ctx.createdAtMs) < ONBOARDING_GRACE_MS) return null;

  const d = ctx.data;
  const steps = {
    addKid:   ctx.kids.length === 0,
    addChore: !(Array.isArray(d.chores) && d.chores.some(function(c){ return c && c.active !== false; })),
    addGoal:  !(Array.isArray(d.goals)  && d.goals.length > 0),
    onboarding: d.onboardingDone !== true
  };
  // If ALL steps are done, nothing to nudge.
  if(!steps.addKid && !steps.addChore && !steps.addGoal && !steps.onboarding){
    return null;
  }
  return { steps };
}

// ── Email renderers ──────────────────────────────────────────
// Shared shell — all 5 trigger emails route through _wrap() so the
// header / footer / signature stay consistent. Light theme for
// predictable Gmail dark+light rendering.
function _wrap({ preHeader, headline, bodyHtml, ctaLabel, ctaUrl, unsubEngagementUrl, unsubAllUrl }){
  return ''
    + '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1a1a2e;max-width:560px;margin:0 auto;padding:24px;background:#f1f5f9;">'
    +   '<div style="font-size:11px;letter-spacing:1.6px;color:#a78bfa;font-weight:800;text-transform:uppercase;margin-bottom:8px;">' + _esc(preHeader) + '</div>'
    +   '<h1 style="font-size:22px;line-height:1.3;margin:0 0 16px;color:#0b1020;">' + _esc(headline) + '</h1>'
    +   bodyHtml
    +   '<div style="text-align:center;margin:24px 0;">'
    +     '<a href="' + _esc(ctaUrl) + '" style="display:inline-block;background:#10b981;color:#ffffff;font-weight:800;padding:13px 24px;border-radius:10px;text-decoration:none;">' + _esc(ctaLabel) + ' &rarr;</a>'
    +   '</div>'
    +   '<div style="font-size:11px;color:#94a3b8;text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;line-height:1.7;">'
    +     'You\'re receiving this because engagement emails are on in your YourLife CC account.<br>'
    +     '<a href="' + _esc(unsubEngagementUrl) + '" style="color:#94a3b8;text-decoration:underline;">Unsubscribe from engagement emails</a>'
    +     ' &middot; <a href="' + _esc(unsubAllUrl) + '" style="color:#94a3b8;text-decoration:underline;">Unsubscribe from all emails</a><br>'
    +     'Kingdom Creatives LLC &middot; <a href="https://yourlifecc.com" style="color:#94a3b8;text-decoration:underline;">yourlifecc.com</a>'
    +   '</div>'
    + '</div>';
}

function _renderInactivityEmail(ctx, payload, urls){
  const lines = payload.kidLastSeen.map(function(k){
    if(k.daysAgo === null){
      return '<li>' + _esc(k.name) + ' — no entries yet</li>';
    }
    const ago = k.daysAgo === 0 ? 'today' : (k.daysAgo === 1 ? 'yesterday' : k.daysAgo + ' days ago');
    return '<li>' + _esc(k.name) + ' — last logged ' + _esc(ago)
         + (k.lastDomain ? ' (' + _esc(k.lastDomain) + ')' : '') + '</li>';
  }).join('');

  const faithLine = (ctx.data.faithMode !== false && ctx.data.faithOnly !== true)
    ? '<p style="font-style:italic;font-size:13px;color:#94a3b8;margin:0 0 18px;border-left:3px solid #e2e8f0;padding-left:12px;">"Come to me, all you who are weary and burdened, and I will give you rest." — Matthew 11:28</p>'
    : '';

  const bodyHtml = ''
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;">Hi ' + _esc(ctx.parentFirstName) + ',</p>'
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;">YourLife has been quiet on your end for about ' + payload.daysSinceActivity + ' days — no judgment, life gets busy. When you\'re ready to dip back in, your data is safe and waiting.</p>'
    + faithLine
    + (lines ? '<p style="font-size:13px;font-weight:700;color:#0b1020;margin:0 0 6px;">Where things stand:</p><ul style="font-size:13px;line-height:1.7;color:#475569;margin:0 0 18px;padding-left:20px;">' + lines + '</ul>' : '')
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 18px;">If now isn\'t the right time, that\'s okay. We\'ll keep your data safe and check back on you next month.</p>';

  return {
    subject: 'A quiet week at YourLife — checking in',
    preHeader: 'NO JUDGMENT · JUST A NUDGE',
    html:    _wrap({ preHeader: 'A QUIET WEEK', headline: 'Checking in', bodyHtml, ctaLabel: 'Open YourLife CC', ctaUrl: 'https://yourlifecc.com/app', unsubEngagementUrl: urls.engagement, unsubAllUrl: urls.all }),
    text:    [
      'Hi ' + ctx.parentFirstName + ',',
      '',
      'YourLife has been quiet for about ' + payload.daysSinceActivity + ' days — no judgment, life gets busy. When you\'re ready to dip back in, your data is safe.',
      '',
      payload.kidLastSeen.map(function(k){
        const ago = k.daysAgo === null ? 'no entries yet' : (k.daysAgo === 0 ? 'today' : (k.daysAgo + ' days ago'));
        return '  • ' + k.name + ' — last logged ' + ago;
      }).join('\n'),
      '',
      'Open YourLife CC: https://yourlifecc.com/app',
      '',
      'Manage emails:',
      '  Unsubscribe from engagement: ' + urls.engagement,
      '  Unsubscribe from all:        ' + urls.all,
      'Kingdom Creatives LLC · yourlifecc.com'
    ].join('\n')
  };
}

function _renderStreakAtRiskEmail(ctx, payload, urls){
  const bodyHtml = ''
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;">Hi ' + _esc(ctx.parentFirstName) + ',</p>'
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;"><strong style="color:#0b1020;">' + _esc(payload.kidName) + '</strong> has been on a <strong style="color:#10b981;">' + payload.streak + '-day check-in streak</strong>. They haven\'t logged today yet.</p>'
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 18px;">Want to remind them before midnight? Just one tap and they\'re back in. The streak resets at midnight ' + _esc(payload.kidName) + '\'s local time.</p>';

  return {
    subject: `${payload.kidName}'s ${payload.streak}-day streak ends tonight`,
    preHeader: 'A friendly nudge — not pressure',
    html:    _wrap({ preHeader: 'STREAK AT RISK', headline: `Don't lose ${payload.kidName}'s ${payload.streak}-day streak`, bodyHtml, ctaLabel: `Send ${payload.kidName} to YourLife`, ctaUrl: 'https://yourlifecc.com/app', unsubEngagementUrl: urls.engagement, unsubAllUrl: urls.all }),
    text:    [
      'Hi ' + ctx.parentFirstName + ',',
      '',
      payload.kidName + ' has been on a ' + payload.streak + '-day check-in streak. They haven\'t logged today yet.',
      '',
      'Want to remind them before midnight? Just one tap and they\'re back in.',
      '',
      'Open YourLife CC: https://yourlifecc.com/app',
      '',
      'Manage emails:',
      '  Unsubscribe from engagement: ' + urls.engagement,
      '  Unsubscribe from all:        ' + urls.all,
      'Kingdom Creatives LLC · yourlifecc.com'
    ].join('\n')
  };
}

function _renderReleaseNotesEmail(ctx, payload, urls){
  const entryHtml = payload.entries.map(function(n){
    return ''
      + '<div style="margin-bottom:16px;padding:14px 16px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">'
      +   '<div style="font-size:11px;letter-spacing:1px;font-weight:800;color:#a78bfa;text-transform:uppercase;margin-bottom:6px;">v' + n.version + ' &middot; ' + _esc(n.shipped || '') + '</div>'
      +   '<div style="font-size:15px;font-weight:800;color:#0b1020;margin-bottom:6px;">' + _esc(n.headline || '') + '</div>'
      +   '<div style="font-size:13px;line-height:1.6;color:#475569;">' + _esc(n.blurb || '') + '</div>'
      + '</div>';
  }).join('');

  const lead = payload.entries[0];
  const bodyHtml = ''
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;">Hi ' + _esc(ctx.parentFirstName) + ',</p>'
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 18px;">A few things shipped since you were last in. Quick notes — try whatever catches your eye:</p>'
    + entryHtml;

  const ctaPath = (lead && lead.ctaPath) || '/app';
  const ctaLabel = (lead && lead.ctaLabel) || 'See what\'s new';
  return {
    subject: 'New in YourLife: ' + (lead ? lead.headline : 'recent updates'),
    preHeader: 'A short list — pick what catches your eye',
    html:    _wrap({ preHeader: 'WHAT\'S NEW', headline: 'A few things shipped since last time', bodyHtml, ctaLabel: ctaLabel, ctaUrl: 'https://yourlifecc.com' + ctaPath, unsubEngagementUrl: urls.engagement, unsubAllUrl: urls.all }),
    text:    [
      'Hi ' + ctx.parentFirstName + ',',
      '',
      'A few things shipped since you were last in:',
      '',
      payload.entries.map(function(n){
        return '  v' + n.version + ' — ' + (n.headline || '') + '\n    ' + (n.blurb || '');
      }).join('\n\n'),
      '',
      'Open YourLife CC: https://yourlifecc.com' + ctaPath,
      '',
      'Manage emails:',
      '  Unsubscribe from engagement: ' + urls.engagement,
      '  Unsubscribe from all:        ' + urls.all,
      'Kingdom Creatives LLC · yourlifecc.com'
    ].join('\n')
  };
}

function _renderReferAFriendEmail(ctx, payload, urls){
  const bodyHtml = ''
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;">Hi ' + _esc(ctx.parentFirstName) + ',</p>'
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 16px;">If YourLife has helped your family, would you share it with a friend? <strong>You earn $10</strong> when their first paid month posts. <strong>They get $10 off</strong> their first payment too.</p>'
    + '<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin:0 0 18px;">'
    +   '<div style="font-size:11px;letter-spacing:1px;font-weight:800;color:#a78bfa;text-transform:uppercase;margin-bottom:8px;">YOUR REFERRAL LINK</div>'
    +   '<div style="font-family:monospace;font-size:13px;color:#10b981;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;word-break:break-all;">' + _esc(payload.refLink) + '</div>'
    +   '<div style="font-size:12px;color:#475569;margin-top:8px;">Or tell them to use code <strong>REFER10</strong> at checkout.</div>'
    + '</div>'
    + '<p style="font-size:11px;line-height:1.55;color:#94a3b8;margin:0 0 18px;border-left:3px solid #fbbf24;padding-left:10px;background:rgba(251,191,36,.04);padding:10px;">Referral payouts are available only to adults 18 or older. Parents/guardians may claim on a minor\'s behalf with proof. One reward per household. Payouts post on the 1st of the month following 30 days of an active paid subscription. Self-referrals are voided.</p>';

  return {
    subject: 'Share YourLife, earn $10',
    preHeader: 'Quiet ask — only if it\'s helped',
    html:    _wrap({ preHeader: 'REFER A FRIEND', headline: 'Share YourLife, earn $10', bodyHtml, ctaLabel: 'Share now', ctaUrl: 'https://yourlifecc.com/app', unsubEngagementUrl: urls.engagement, unsubAllUrl: urls.all }),
    text:    [
      'Hi ' + ctx.parentFirstName + ',',
      '',
      'If YourLife has helped your family, share it with a friend.',
      'You earn $10 when their first paid month posts; they get $10 off.',
      '',
      'Your link: ' + payload.refLink,
      'Or code:   REFER10  (entered at checkout)',
      '',
      'NOTE: Referral payouts are 18+ only. Parents/guardians may claim on',
      'a minor\'s behalf with proof. One reward per household. Self-referrals',
      'voided. Payouts post on the 1st of the month following 30 days of an',
      'active paid subscription.',
      '',
      'Open YourLife CC: https://yourlifecc.com/app',
      '',
      'Manage emails:',
      '  Unsubscribe from engagement: ' + urls.engagement,
      '  Unsubscribe from all:        ' + urls.all,
      'Kingdom Creatives LLC · yourlifecc.com'
    ].join('\n')
  };
}

function _renderOnboardingEmail(ctx, payload, urls){
  const steps = payload.steps;
  const stepHtml = ''
    + '<ul style="font-size:14px;line-height:1.85;color:#475569;list-style:none;padding-left:0;margin:0 0 18px;">'
    +   '<li>' + (steps.addKid   ? '○' : '✓') + '&nbsp; Add your first child profile</li>'
    +   '<li>' + (steps.addChore ? '○' : '✓') + '&nbsp; Set up your first chore</li>'
    +   '<li>' + (steps.addGoal  ? '○' : '✓') + '&nbsp; Save your family\'s first goal</li>'
    + '</ul>';

  const bodyHtml = ''
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;">Hi ' + _esc(ctx.parentFirstName) + ',</p>'
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px;">You signed up a few days ago — let me help you wrap the last bits. Each step takes about 30 seconds:</p>'
    + stepHtml
    + '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 18px;">Skip the ones already done. Yell at me if anything is confusing — <a href="mailto:info@kingdom-creatives.com" style="color:#10b981;">info@kingdom-creatives.com</a>.</p>';

  return {
    subject: 'Let\'s finish setting up YourLife — 3 quick steps',
    preHeader: 'Each step takes 30 seconds',
    html:    _wrap({ preHeader: 'FINISH SETUP', headline: '3 quick steps to go', bodyHtml, ctaLabel: 'Finish setup', ctaUrl: 'https://yourlifecc.com/app', unsubEngagementUrl: urls.engagement, unsubAllUrl: urls.all }),
    text:    [
      'Hi ' + ctx.parentFirstName + ',',
      '',
      'You signed up a few days ago — let me help you wrap the last bits.',
      '',
      (steps.addKid   ? '[ ] Add your first child profile' : '[x] First child profile added'),
      (steps.addChore ? '[ ] Set up your first chore'      : '[x] First chore set up'),
      (steps.addGoal  ? '[ ] Save your family\'s first goal' : '[x] First goal saved'),
      '',
      'Open YourLife CC: https://yourlifecc.com/app',
      'Stuck on anything? Email info@kingdom-creatives.com.',
      '',
      'Manage emails:',
      '  Unsubscribe from engagement: ' + urls.engagement,
      '  Unsubscribe from all:        ' + urls.all,
      'Kingdom Creatives LLC · yourlifecc.com'
    ].join('\n')
  };
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

// ── Per-user context builder ─────────────────────────────────
function _buildContext(row, nowMs){
  const data = (row && row.data) || {};
  const prefs = data.emailPrefs || {};
  const profiles = Array.isArray(data._profiles) ? data._profiles : [];
  const kids = profiles.filter(function(p){ return p && p.isParent === false; });
  const activityLog = Array.isArray(data.activityLog) ? data.activityLog : [];

  let recentActivityTs = 0;
  activityLog.forEach(function(e){
    const t = _evTs(e);
    if(t > recentActivityTs) recentActivityTs = t;
  });

  const createdAtMs = row.created_at ? Date.parse(row.created_at) : 0;

  return {
    userId:           row.user_id,
    planStatus:       row.plan_status || '',
    emailAddr:        prefs.recipientEmail || row.email || '',
    parentFirstName:  _parentFirstName(data, profiles),
    data:             data,
    prefs:            prefs,
    profiles:         profiles,
    kids:             kids,
    activityLog:      activityLog,
    recentActivityTs: recentActivityTs,
    createdAtMs:      createdAtMs,
    offsetMin:        (typeof prefs.timezoneOffsetMin === 'number') ? prefs.timezoneOffsetMin : 0,
    nowMs:            nowMs
  };
}

// ── Per-user dispatch ────────────────────────────────────────
// Returns { sent: bool, trigger?: string, payload?: obj, skip?: string, diag: obj }
function _evaluateUser(row, nowMs, mode, opts){
  opts = opts || {};
  const ctx = _buildContext(row, nowMs);
  // WC-3d — push owns streak nudges for subscribed accounts, and both channels
  // share one streak-nudge/day stamp. These two flags gate ONLY the email
  // streak trigger below; nothing else in this function changes.
  ctx.hasPushSub = !!(opts.pushSubs && opts.pushSubs.has(String(ctx.userId)));
  ctx.todayUTC   = opts.todayUTC || '';
  const diag = {
    userId:           ctx.userId,
    planStatus:       ctx.planStatus,
    kidCount:         ctx.kids.length,
    activityTotal:    ctx.activityLog.length,
    recentActivityTs: ctx.recentActivityTs,
    recentActivityAgo:ctx.recentActivityTs ? Math.floor((nowMs - ctx.recentActivityTs) / 86400000) + 'd' : null,
    createdAtMs:      ctx.createdAtMs,
    accountAgeDays:   ctx.createdAtMs ? Math.floor((nowMs - ctx.createdAtMs) / 86400000) : null,
    offsetMin:        ctx.offsetMin,
    prefs:            { ...ctx.prefs },
    triggerEvals:     {},
    mode:             mode
  };

  // Safety belt — Track 3 owns faith-only users.
  if(ctx.planStatus === 'faith_free'){
    return { skip: 'faith_only_user_track3_handles', diag };
  }
  if(!SCHEDULED_PLAN_STATUSES.has(ctx.planStatus)){
    return { skip: 'wrong_plan_status', diag };
  }
  if(ctx.prefs.engagementOptIn !== true){
    return { skip: 'not_opted_in', diag };
  }
  if(ctx.prefs.allOptOut === true){
    return { skip: 'all_opted_out', diag };
  }
  if(!ctx.emailAddr){
    return { skip: 'no_email', diag };
  }

  // Scheduled-only gates (test mode bypasses)
  if(mode === 'scheduled'){
    // 7-day global engagement cap
    const lastEng = ctx.prefs.lastEngagementSent ? Date.parse(ctx.prefs.lastEngagementSent) : 0;
    if(lastEng && (nowMs - lastEng) < ENGAGEMENT_COOLDOWN_MS){
      return { skip: 'recent_engagement', diag };
    }
    // Recently opened — don't email someone who's actively using the app
    if(ctx.recentActivityTs && (nowMs - ctx.recentActivityTs) < RECENTLY_OPENED_MS){
      return { skip: 'recently_opened', diag };
    }
  }

  // Trigger evaluation — first non-null in priority order wins.
  const triggers = [
    ['inactivity',     _evalInactivity(ctx),     _renderInactivityEmail],
    // WC-3d — skip the EMAIL streak nudge if push owns this account (has a
    // subscription) or a streak nudge already went out today (either channel).
    ['streak_at_risk', (ctx.hasPushSub || (ctx.todayUTC && ctx.data.lastStreakNudgeDate === ctx.todayUTC)) ? null : _evalStreakAtRisk(ctx), _renderStreakAtRiskEmail],
    ['release_notes',  _evalReleaseNotes(ctx),   _renderReleaseNotesEmail],
    ['refer_a_friend', _evalReferAFriend(ctx),   _renderReferAFriendEmail],
    ['onboarding',     _evalOnboarding(ctx),     _renderOnboardingEmail]
  ];

  let winner = null;
  for(const [name, payload, renderer] of triggers){
    diag.triggerEvals[name] = (payload === null) ? 'no_match' : 'matched';
    if(payload && !winner){
      winner = { name, payload, renderer };
    }
  }

  if(!winner){
    return { skip: 'no_trigger_match', diag };
  }

  return { ctx, winner, diag };
}

// ── Main handler ─────────────────────────────────────────────
module.exports = async function handler(req, res){
  if(req.method !== 'POST' && req.method !== 'GET'){
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serviceKey  = process.env.SUPA_SERVICE_KEY;
  const unsubSecret = process.env.EMAIL_UNSUB_SECRET;
  const brevoKey    = process.env.BREVO_API_KEY;
  const cronSecret  = process.env.CRON_SECRET;
  if(!serviceKey || !unsubSecret || !brevoKey){
    console.error('engagement-tick: missing env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

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

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const todayUTC = nowIso.slice(0, 10);

  // WC-3d — accounts with a push subscription are owned by the push streak
  // nudge (api/cron/push-tick); skip the EMAIL streak trigger for them so the
  // same family is never double-nudged. Defensive: on failure, the empty set
  // means the email streak trigger behaves EXACTLY as before this change.
  let pushSubs = new Set();
  try {
    const _ps = await _supaGet('push_subscriptions?select=user_id&limit=5000', serviceKey);
    if(Array.isArray(_ps)) _ps.forEach(function(s){ if(s && s.user_id) pushSubs.add(String(s.user_id)); });
  } catch(e){
    console.warn('engagement-tick: push_subscriptions fetch failed (email streak trigger stays active):', e && e.message);
  }

  // Fetch audience
  let rows;
  try {
    if(mode === 'test'){
      rows = await _supaGet(
        'profiles?select=user_id,email,plan_status,created_at,data&user_id=eq.' + encodeURIComponent(testUserId) + '&limit=1',
        serviceKey
      );
    } else {
      // Plan-status pre-filter at the DB level; remaining gates done in JS.
      //
      // Track 3 atomic audience routing — explicit double exclusion of
      // faith_free at the DB layer in the SAME commit Track 3's
      // crossover-tick activates. Belt + suspenders:
      //   1) plan_status=in.(active,trialing,free_contest) excludes
      //      faith_free by construction
      //   2) plan_status=neq.faith_free is the explicit safety net
      //      that fails the query if (1) ever regresses (e.g. someone
      //      adds 'faith_free' to the IN list by mistake)
      //   3) The per-user dispatch in _evaluateUser() also short-
      //      circuits on plan_status==='faith_free' with reason
      //      'faith_only_user_track3_handles'
      // Three layers, so a faith-only user can NEVER receive a
      // Track 2 engagement email — Track 3 owns that audience.
      rows = await _supaGet(
        'profiles?select=user_id,email,plan_status,created_at,data'
        + '&plan_status=in.(active,trialing,free_contest)'
        + '&plan_status=neq.faith_free'
        + '&limit=2000',
        serviceKey
      );
    }
  } catch(e){
    console.error('engagement-tick: audience query failed:', e && e.message);
    return res.status(500).json({ error: 'Audience query failed' });
  }

  const results = { mode, considered: 0, sent: 0, skipped: 0, failed: 0, details: [] };

  for(const row of rows){
    results.considered++;
    if(!row || !row.user_id){ results.skipped++; continue; }

    const eval_ = _evaluateUser(row, now, mode, { pushSubs: pushSubs, todayUTC: todayUTC });

    if(eval_.skip){
      results.skipped++;
      const entry = { user_id: row.user_id, reason: eval_.skip };
      if(mode === 'test') entry.diag = eval_.diag;
      results.details.push(entry);
      continue;
    }

    const { ctx, winner } = eval_;
    const trigger = winner.name;
    const payload = winner.payload;

    const urls = {
      engagement: _unsubUrl(row.user_id, 'engagement', unsubSecret),
      all:        _unsubUrl(row.user_id, 'all',        unsubSecret)
    };
    const unsubMailto = 'mailto:info@kingdom-creatives.com?subject=Unsubscribe%20engagement';

    let rendered;
    try {
      rendered = winner.renderer(ctx, payload, urls);
    } catch(e){
      results.failed++;
      results.details.push({ user_id: row.user_id, trigger, error: 'render: ' + (e && e.message) });
      continue;
    }

    try {
      await _brevoSend({
        to:              ctx.emailAddr,
        subject:         rendered.subject,
        html:            rendered.html,
        text:            rendered.text,
        listUnsubUrl:    urls.engagement,
        listUnsubMailto: unsubMailto,
        brevoKey:        brevoKey
      });
      results.sent++;
      const detail = { user_id: row.user_id, to: ctx.emailAddr, trigger };
      if(mode === 'test') detail.diag = eval_.diag;
      results.details.push(detail);

      // Stamp prefs in scheduled mode only — test must not block the
      // next scheduled fire.
      if(mode === 'scheduled'){
        const newPrefs = Object.assign({}, ctx.prefs, { lastEngagementSent: nowIso });
        // Per-trigger stamps
        if(trigger === 'release_notes'){
          newPrefs.lastReleaseNoteVersion = payload.maxVersion;
        }
        if(trigger === 'refer_a_friend'){
          newPrefs.lastReferralNudge = nowIso;
        }
        const newData = Object.assign({}, ctx.data, { emailPrefs: newPrefs });
        // WC-3d — shared cross-channel streak-nudge stamp so the push cron
        // skips this account today (one streak nudge/day across both channels).
        if(trigger === 'streak_at_risk'){
          newData.lastStreakNudgeDate = todayUTC;
        }
        try {
          await _supaPatch(
            'profiles?user_id=eq.' + encodeURIComponent(row.user_id),
            { data: newData },
            serviceKey
          );
        } catch(e){
          console.warn('engagement-tick: stamp failed for', row.user_id, e && e.message);
        }
      }
    } catch(e){
      results.failed++;
      results.details.push({ user_id: row.user_id, trigger, error: (e && e.message) || 'send_failed' });
      console.error('engagement-tick: Brevo send failed for', row.user_id, e && e.message);
    }
  }

  return res.status(200).json(Object.assign({ ok: true, at: nowIso }, results));
};
