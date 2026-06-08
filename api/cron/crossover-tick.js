// api/cron/crossover-tick.js — Email Bundle Track 3
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Faith Hub crossover cron — soft invitation for plan_status='faith_free'
// users to peek at the full YourLife CC. Runs WEEKLY (Wed 10am UTC)
// per vercel.json; the 6-week cadence + 4-send lifetime cap are
// enforced per user.
//
// Audience filter:
//   plan_status = 'faith_free'
//   AND email IS NOT NULL
//   AND data.emailPrefs.crossoverOptOut !== true
//   AND data.emailPrefs.allOptOut !== true
//   AND COALESCE(data.emailPrefs.crossoverSendCount, 0) < 4
//   AND lastCrossoverSent IS NULL OR < 42 days ago
//
// Email shape (devotional, NEVER salesy):
//   • Scripture pool — curated 8-verse subset of MEMORY_VERSE_LIBRARY
//     in app/js/data/memory-verses.js, selected for warm-invitation
//     tone. Verse rotated per user via hash(userId + sendIndex) so
//     no user gets the same verse twice in a row.
//   • Highlights — top 3 entries from /docs/crossover-highlights.md
//   • CTA — "See the full app →" linking to /app?from=faith-hub
//     (referrer-only tracking; no in-app special welcome card)
//   • No pricing mentioned (private-beta stance per CLAUDE.md)
//   • Sign-off — "Jason & the Kingdom Creatives family"
//
// Dispatch modes (same pattern as Track 1+2):
//   • SCHEDULED — Bearer ${CRON_SECRET}
//   • TEST      — ?testUser=<userId> + user JWT; bypasses cooldown +
//                 cap gates; does NOT stamp lastCrossoverSent or
//                 increment crossoverSendCount.
//
// Env vars: CRON_SECRET, SUPA_SERVICE_KEY, EMAIL_UNSUB_SECRET, BREVO_API_KEY

const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');

const SUPA_HOST  = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const BREVO_HOST = 'api.brevo.com';

const COOLDOWN_MS    = 42 * 24 * 60 * 60 * 1000; // 6 weeks
const LIFETIME_CAP   = 4;
const HIGHLIGHTS_CAP = 3;

// ── Scripture pool ───────────────────────────────────────────
// Curated subset of MEMORY_VERSE_LIBRARY in app/js/data/memory-verses.js,
// selected for warm-invitation tone — never urgent, never preachy,
// never "the world is ending without YourLife". Each entry pairs the
// verse with a single reflection line that bridges into the highlights.
// TODO (next 6 months): revisit after first round of sends — drop
// verses that feel off, add new ones if pool size limits rotation.
const SCRIPTURE_POOL = [
  { ref: 'Psalm 46:10',     text: 'Be still, and know that I am God.',
    reflection: 'A quiet update from us — building has continued while you\'ve been resting in the Word.' },
  { ref: 'Matthew 11:28',   text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    reflection: 'A short note from us, and a small invitation if you\'re ready for it.' },
  { ref: 'Philippians 4:8', text: 'Whatever is true, whatever is honorable, whatever is just, whatever is pure — think about these things.',
    reflection: 'Here are a few things we\'ve been thinking about on our side.' },
  { ref: 'Proverbs 22:6',   text: 'Train up a child in the way he should go; even when he is old he will not depart from it.',
    reflection: 'We\'ve been building tools to come alongside parents in that training.' },
  { ref: 'Ecclesiastes 3:1',text: 'For everything there is a season, and a time for every matter under heaven.',
    reflection: 'This season we built a few things parents in our community have been asking for.' },
  { ref: 'Psalm 127:3',     text: 'Behold, children are a heritage from the LORD, the fruit of the womb a reward.',
    reflection: 'A short update from us about the heritage we\'re trying to support.' },
  { ref: 'James 1:17',      text: 'Every good gift and every perfect gift is from above.',
    reflection: 'A note about a few good additions to the family tools.' },
  { ref: 'Romans 12:2',     text: 'Be transformed by the renewal of your mind.',
    reflection: 'A small update on the tools we\'re building for that renewal.' }
];

function _pickScripture(userId, sendIndex){
  if(!userId) return SCRIPTURE_POOL[0];
  const h = crypto.createHash('sha256')
    .update(String(userId) + ':' + String(sendIndex || 0))
    .digest();
  return SCRIPTURE_POOL[h[0] % SCRIPTURE_POOL.length];
}

// ── Subject pool — rotating per send so 4 sends feel distinct ──
const SUBJECT_POOL = [
  'A quiet update from our family to yours',
  'From our side: a verse and a few new things',
  'A short note + a few things worth knowing',
  'What we\'ve been building — and a verse for the week'
];
function _pickSubject(sendIndex){
  return SUBJECT_POOL[(sendIndex || 0) % SUBJECT_POOL.length];
}

// ── Highlights — parse the markdown editorial source ─────────
// Read once per cold start; cache for warm invocations. Vercel
// bundles /docs/crossover-highlights.md alongside this function
// via the "functions" block in vercel.json (includeFiles).
let _highlightsCache = null;
function _loadHighlights(){
  if(_highlightsCache !== null) return _highlightsCache;
  const candidates = [
    // Standard location (works locally + most Vercel layouts)
    path.join(__dirname, '..', '..', 'docs', 'crossover-highlights.md'),
    // Defensive fallback for any environment where __dirname resolves
    // to a deeper bundle path
    path.join(process.cwd(), 'docs', 'crossover-highlights.md')
  ];
  for(const p of candidates){
    try {
      const md = fs.readFileSync(p, 'utf8');
      _highlightsCache = _parseHighlights(md);
      return _highlightsCache;
    } catch(_){}
  }
  console.warn('crossover-tick: crossover-highlights.md not found in any expected location');
  _highlightsCache = [];
  return _highlightsCache;
}

function _parseHighlights(md){
  if(!md || typeof md !== 'string') return [];
  const entries = [];
  // Split on level-2 v-headings: "## v1 — Headline"
  const blocks = md.split(/(?=^## v\d+)/m);
  for(const block of blocks){
    const headingMatch = block.match(/^## v(\d+)\s*[—–\-]\s*(.+?)\s*$/m);
    if(!headingMatch) continue;
    const version = Number(headingMatch[1]);
    const headline = headingMatch[2].trim();
    const shippedMatch = block.match(/^\s*shipped\s*:?\s*(\S+)/im);
    const shipped = shippedMatch ? shippedMatch[1].trim() : '';
    // Body: drop the heading line + metadata, take first non-empty para
    const body = block
      .replace(/^## v\d+.+$/m, '')
      .replace(/^\s*shipped\s*:?.+$/im, '')
      .trim();
    const para = body.split(/\n\s*\n/).find(function(p){ return p.trim().length > 0; });
    if(!para) continue;
    // Collapse any internal newlines/extra whitespace inside the blurb
    const blurb = para.replace(/\s+/g, ' ').trim();
    entries.push({ version, headline, shipped, blurb });
  }
  // Newest first
  entries.sort(function(a, b){ return b.version - a.version; });
  return entries;
}

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
async function _supaPatch(url, body, serviceKey){
  const r = await fetch(`https://${SUPA_HOST}/rest/v1/${url}`, {
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

// ── HTML utility ─────────────────────────────────────────────
function _esc(s){
  if(s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Parent first-name picker — best-effort. faith_free users typically
// have no _profiles array (single-person tier), so prefer the auth
// email's local part as a fallback only if data.name / data.parentName
// are missing.
function _firstName(data, fallbackEmail){
  let n = (data && (data.parentName || data.name)) || '';
  n = String(n).trim();
  if(n) return n.split(/\s+/)[0];
  if(fallbackEmail){
    const local = String(fallbackEmail).split('@')[0];
    if(local){
      // Capitalize first letter of email local part as a reasonable greeting
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
  }
  return 'friend';
}

// ── Email rendering ──────────────────────────────────────────
function _renderHtml({ firstName, scripture, highlights, ctaUrl, unsubCrossoverUrl, unsubAllUrl }){
  const highlightsHtml = highlights.map(function(h){
    return ''
      + '<li style="margin-bottom:12px;">'
      +   '<strong style="color:#0b1020;">' + _esc(h.headline) + '</strong> &mdash; '
      +   '<span style="color:#475569;">' + _esc(h.blurb) + '</span>'
      + '</li>';
  }).join('');

  return ''
    + '<div style="font-family:Georgia,Times New Roman,serif;color:#1a1a2e;max-width:560px;margin:0 auto;padding:28px 24px;background:#fbf8f1;">'
    +   '<div style="font-size:11px;letter-spacing:2px;color:#a16207;font-weight:800;text-transform:uppercase;margin-bottom:14px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">A QUIET UPDATE</div>'
    +   '<div style="border-left:3px solid #fbbf24;padding:10px 16px;margin:0 0 22px;background:rgba(251,191,36,.05);">'
    +     '<div style="font-style:italic;font-size:16px;line-height:1.55;color:#0b1020;margin:0 0 6px;">' + _esc(scripture.text) + '</div>'
    +     '<div style="font-size:12px;color:#a16207;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-weight:700;letter-spacing:.04em;">&mdash; ' + _esc(scripture.ref) + '</div>'
    +   '</div>'
    +   '<p style="font-size:15px;line-height:1.7;color:#0b1020;margin:0 0 14px;">Hi ' + _esc(firstName) + ',</p>'
    +   '<p style="font-size:15px;line-height:1.7;color:#0b1020;margin:0 0 22px;">' + _esc(scripture.reflection) + '</p>'
    +   '<div style="font-size:11px;letter-spacing:2px;color:#7c3aed;font-weight:800;text-transform:uppercase;margin:24px 0 10px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">Glimpse of what\'s new</div>'
    +   '<ul style="font-size:14px;line-height:1.6;color:#0b1020;margin:0 0 22px;padding-left:20px;">' + highlightsHtml + '</ul>'
    +   '<p style="font-size:14px;line-height:1.7;color:#475569;margin:0 0 22px;">If you ever want to peek at the full YourLife CC, the door\'s open. It\'s the same account you already use &mdash; nothing to install.</p>'
    +   '<div style="text-align:center;margin:24px 0;">'
    +     '<a href="' + _esc(ctaUrl) + '" style="display:inline-block;background:#7c3aed;color:#ffffff;font-weight:800;padding:13px 26px;border-radius:10px;text-decoration:none;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">See the full app &rarr;</a>'
    +   '</div>'
    +   '<p style="font-size:14px;line-height:1.7;color:#475569;margin:32px 0 6px;font-style:italic;">&mdash; Jason &amp; the Kingdom Creatives family</p>'
    +   '<div style="font-size:11px;color:#94a3b8;text-align:center;padding-top:18px;margin-top:24px;border-top:1px solid #e2e8f0;line-height:1.7;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">'
    +     'You\'re getting this because your Faith Hub account is set up with us.<br>'
    +     '<a href="' + _esc(unsubCrossoverUrl) + '" style="color:#94a3b8;text-decoration:underline;">Stop the crossover emails</a>'
    +     ' &middot; <a href="' + _esc(unsubAllUrl) + '" style="color:#94a3b8;text-decoration:underline;">Stop all emails</a><br>'
    +     'Kingdom Creatives LLC &middot; <a href="https://yourlifecc.com" style="color:#94a3b8;text-decoration:underline;">yourlifecc.com</a>'
    +   '</div>'
    + '</div>';
}

function _renderText({ firstName, scripture, highlights, ctaUrl, unsubCrossoverUrl, unsubAllUrl }){
  const lines = [];
  lines.push('A QUIET UPDATE');
  lines.push('');
  lines.push('"' + scripture.text + '"  — ' + scripture.ref);
  lines.push('');
  lines.push('Hi ' + firstName + ',');
  lines.push('');
  lines.push(scripture.reflection);
  lines.push('');
  lines.push('Glimpse of what\'s new');
  highlights.forEach(function(h){
    lines.push('  • ' + h.headline + ' — ' + h.blurb);
  });
  lines.push('');
  lines.push('If you ever want to peek at the full YourLife CC, the door\'s open.');
  lines.push('It\'s the same account you already use — nothing to install.');
  lines.push('');
  lines.push('See the full app: ' + ctaUrl);
  lines.push('');
  lines.push('— Jason & the Kingdom Creatives family');
  lines.push('');
  lines.push('Manage emails:');
  lines.push('  Stop the crossover emails: ' + unsubCrossoverUrl);
  lines.push('  Stop all emails:           ' + unsubAllUrl);
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
    const errText = await r.text();
    throw new Error('Brevo ' + r.status + ': ' + errText.slice(0, 200));
  }
  return r.json();
}

// ── Per-user evaluation ──────────────────────────────────────
function _evaluateUser(row, nowMs, mode){
  const data  = (row && row.data) || {};
  const prefs = data.emailPrefs || {};
  const emailAddr = prefs.recipientEmail || row.email || '';

  const diag = {
    userId:             row.user_id,
    planStatus:         row.plan_status || '',
    emailAddrPresent:   !!emailAddr,
    crossoverOptOut:    prefs.crossoverOptOut === true,
    allOptOut:          prefs.allOptOut === true,
    crossoverSendCount: Number(prefs.crossoverSendCount) || 0,
    lastCrossoverSent:  prefs.lastCrossoverSent || null,
    mode:               mode
  };

  // Audience must be faith_free — Track 3 owns ONLY these users.
  if(row.plan_status !== 'faith_free'){
    return { skip: 'not_faith_free', diag };
  }
  if(prefs.allOptOut === true){
    return { skip: 'all_opted_out', diag };
  }
  if(prefs.crossoverOptOut === true){
    return { skip: 'crossover_opted_out', diag };
  }
  if(!emailAddr){
    return { skip: 'no_email', diag };
  }

  // Scheduled-only gates (test mode bypasses cap + cadence)
  if(mode === 'scheduled'){
    const sendCount = Number(prefs.crossoverSendCount) || 0;
    if(sendCount >= LIFETIME_CAP){
      return { skip: 'lifetime_cap_reached', diag };
    }
    const last = prefs.lastCrossoverSent ? Date.parse(prefs.lastCrossoverSent) : 0;
    if(last && (nowMs - last) < COOLDOWN_MS){
      return { skip: 'within_cooldown', diag };
    }
  }

  return { ok: true, data, prefs, emailAddr, diag };
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
    console.error('crossover-tick: missing env');
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

  // Audience query — ONLY plan_status='faith_free'. Atomic with the
  // engagement-tick neq.faith_free clause shipped in the same push.
  let rows;
  try {
    if(mode === 'test'){
      rows = await _supaGet(
        'profiles?select=user_id,email,plan_status,created_at,data&user_id=eq.' + encodeURIComponent(testUserId) + '&limit=1',
        serviceKey
      );
    } else {
      rows = await _supaGet(
        'profiles?select=user_id,email,plan_status,created_at,data&plan_status=eq.faith_free&limit=2000',
        serviceKey
      );
    }
  } catch(e){
    console.error('crossover-tick: audience query failed:', e && e.message);
    return res.status(500).json({ error: 'Audience query failed' });
  }

  // Load highlights once — cached across all users in this invocation.
  const allHighlights = _loadHighlights();
  const highlightsForEmail = allHighlights.slice(0, HIGHLIGHTS_CAP);

  if(!highlightsForEmail.length){
    return res.status(500).json({ error: 'No highlights configured — populate /docs/crossover-highlights.md' });
  }

  const results = { mode, considered: 0, sent: 0, skipped: 0, failed: 0, details: [] };

  for(const row of rows){
    results.considered++;
    if(!row || !row.user_id){ results.skipped++; continue; }

    const eval_ = _evaluateUser(row, now, mode);

    if(eval_.skip){
      results.skipped++;
      const entry = { user_id: row.user_id, reason: eval_.skip };
      if(mode === 'test') entry.diag = eval_.diag;
      results.details.push(entry);
      continue;
    }

    const sendIndex = Number(eval_.prefs.crossoverSendCount) || 0;
    const scripture = _pickScripture(row.user_id, sendIndex);
    const subject   = _pickSubject(sendIndex);
    const firstName = _firstName(eval_.data, eval_.emailAddr);
    const ctaUrl    = 'https://yourlifecc.com/?from=faith-hub';

    const urls = {
      crossover: _unsubUrl(row.user_id, 'crossover', unsubSecret),
      all:       _unsubUrl(row.user_id, 'all',       unsubSecret)
    };
    const unsubMailto = 'mailto:info@kingdom-creatives.com?subject=Unsubscribe%20crossover';

    let html, text;
    try {
      const ctx = {
        firstName, scripture, highlights: highlightsForEmail, ctaUrl,
        unsubCrossoverUrl: urls.crossover, unsubAllUrl: urls.all
      };
      html = _renderHtml(ctx);
      text = _renderText(ctx);
    } catch(e){
      results.failed++;
      results.details.push({ user_id: row.user_id, error: 'render: ' + (e && e.message) });
      continue;
    }

    try {
      await _brevoSend({
        to:              eval_.emailAddr,
        subject:         subject,
        html:            html,
        text:            text,
        listUnsubUrl:    urls.crossover,
        listUnsubMailto: unsubMailto,
        brevoKey:        brevoKey
      });
      results.sent++;
      const detail = {
        user_id: row.user_id,
        to:      eval_.emailAddr,
        subject: subject,
        scriptureRef: scripture.ref,
        sendIndex:    sendIndex
      };
      if(mode === 'test') detail.diag = eval_.diag;
      results.details.push(detail);

      // Stamp prefs in scheduled mode ONLY — test mode must not advance
      // the lifetime counter or block the next real send.
      if(mode === 'scheduled'){
        const newPrefs = Object.assign({}, eval_.prefs, {
          lastCrossoverSent:  nowIso,
          crossoverSendCount: sendIndex + 1
        });
        const newData = Object.assign({}, eval_.data, { emailPrefs: newPrefs });
        try {
          await _supaPatch(
            'profiles?user_id=eq.' + encodeURIComponent(row.user_id),
            { data: newData },
            serviceKey
          );
        } catch(e){
          console.warn('crossover-tick: stamp failed for', row.user_id, e && e.message);
        }
      }
    } catch(e){
      results.failed++;
      results.details.push({ user_id: row.user_id, error: (e && e.message) || 'send_failed' });
      console.error('crossover-tick: Brevo send failed for', row.user_id, e && e.message);
    }
  }

  return res.status(200).json(Object.assign({
    ok:                true,
    at:                nowIso,
    highlightsCount:   allHighlights.length,
    highlightsCapUsed: highlightsForEmail.length,
    scripturePoolSize: SCRIPTURE_POOL.length
  }, results));
};
