// api/admin/send-announcement.js
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// MANUAL-TRIGGER ADMIN ENDPOINT — one-time announcement broadcaster.
// NOT scheduled. NOT a cron. Fires only when explicitly invoked via
// curl. Used to send a single "here's what's new" announcement to
// every current user, with two audience variants:
//
//   • audience=active     → plan_status IN ('active','trialing','free_contest')
//                           Light-theme HTML with feature highlights and a
//                           "starting this Sunday" digest preview block.
//   • audience=faith_free → plan_status = 'faith_free'
//                           Cream serif HTML with scripture box + soft
//                           invitation to peek at the full app.
//
// AUTH
//   Authorization: Bearer <secret>
//   Accepted secret values: ADMIN_SECRET (preferred) or CRON_SECRET
//   (fallback so an admin who already has CRON_SECRET handy can use it).
//
// QUERY PARAMS
//   audience=active|faith_free   REQUIRED — picks the variant + audience
//   dryRun=true                  Optional — lists recipients, sends nothing
//   testUser=<email>             Optional — sends ONE email to that
//                                address only (preview mode). Bypasses
//                                audience walk + suppression checks so
//                                the preview always renders.
//
// SUPPRESSION
//   Skips users where data.emailPrefs.allOptOut === true.
//   Skips users whose email has a row in public.email_suppressions
//   with list='all'.
//   Unsubscribe link in the email mints a token for list='all' so a
//   click is a master-kill (no future emails of any kind).
//
// RFC 8058 one-click List-Unsubscribe headers included on every send.
//
// ENV VARS
//   ADMIN_SECRET (preferred) OR CRON_SECRET
//   SUPA_SERVICE_KEY
//   EMAIL_UNSUB_SECRET
//   BREVO_API_KEY

const crypto = require('crypto');

const SUPA_HOST  = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const BREVO_HOST = 'api.brevo.com';

const ALLOWED_AUDIENCES = new Set(['active', 'faith_free']);
const ACTIVE_PLAN_STATUSES = new Set(['active', 'trialing', 'free_contest']);
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

// ── Token mint (matches /api/email-prefs verifier) ───────────
function _mintUnsubToken(userId, list, secret){
  const payload = { u: String(userId || 'preview-no-account'), l: String(list), t: Date.now() };
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

// ── HTML utility ─────────────────────────────────────────────
function _esc(s){
  if(s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Pick a first-name for the greeting from profile data → email local part.
function _firstName(row){
  const data = (row && row.data) || {};
  let n = (data.parentName || data.name || '').trim();
  if(n) return n.split(/\s+/)[0];
  const email = row && (row.email || (data.emailPrefs && data.emailPrefs.recipientEmail));
  if(email){
    const local = String(email).split('@')[0];
    if(local) return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return 'friend';
}

// ── Variant A — active / trialing / free_contest ─────────────
// Light theme, conversational tone, feature highlights + digest preview.
function _renderActiveVariant({ unsubUrl, manageUrl }){
  const subject = "YourLife CC just got a lot better — here's what's new";

  const html = ''
    + '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1a1a2e;max-width:580px;margin:0 auto;padding:28px 24px;background:#ffffff;line-height:1.6;">'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 14px;">Hey there,</p>'
    +   '<p style="font-size:15px;color:#475569;margin:0 0 16px;">It\'s Jason from Kingdom Creatives. I wanted to give you a quick update &mdash; we\'ve added a bunch of new features to YourLife CC over the past few weeks, and I think you\'re going to love them.</p>'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 12px;font-weight:700;">Here\'s what\'s new in the app:</p>'
    +   '<ul style="font-size:14px;color:#475569;margin:0 0 22px;padding-left:22px;">'
    +     '<li style="margin-bottom:10px;"><strong style="color:#0b1020;">A complete Money tab</strong> &mdash; your kids can now track allowance, set savings goals, request purchases (parent approves), and get an AI money coach that gives weekly feedback</li>'
    +     '<li style="margin-bottom:10px;"><strong style="color:#0b1020;">Life Skills Academy got a major upgrade</strong> &mdash; 42 skill categories, rapid-fire Power Mode quizzes, and shareable certificates when your kid passes</li>'
    +     '<li style="margin-bottom:10px;"><strong style="color:#0b1020;">Brand new Health tab</strong> &mdash; water tracker, workout log, sleep tracker, 8 health badges to earn, and an AI health coach</li>'
    +     '<li style="margin-bottom:10px;"><strong style="color:#0b1020;">Family Activity Feed</strong> &mdash; see everything your kids did across every tab in one place (Parent Hub)</li>'
    +     '<li style="margin-bottom:10px;"><strong style="color:#0b1020;">Power Card visual upgrade across the whole app</strong> &mdash; feels brand new</li>'
    +   '</ul>'
    +   '<div style="background:#fef3c7;border-left:4px solid #fbbf24;padding:14px 16px;border-radius:8px;margin:0 0 18px;">'
    +     '<div style="font-weight:800;letter-spacing:1px;color:#92400e;font-size:11px;text-transform:uppercase;margin-bottom:6px;">STARTING THIS SUNDAY</div>'
    +     '<p style="font-size:14px;color:#0b1020;margin:0;line-height:1.6;">You\'ll get a weekly family digest every Sunday at 7pm &mdash; a friendly summary of every chore done, goal reached, and badge earned that week. You can turn it off anytime in Settings or right from the email.</p>'
    +   '</div>'
    +   '<p style="font-size:14px;color:#475569;margin:0 0 22px;">Also new: optional friendly reminders (max 1 per week) if you opt in under <strong style="color:#0b1020;">Me &rarr; Settings &rarr; "Engagement emails."</strong></p>'
    +   '<div style="text-align:center;margin:28px 0;">'
    +     '<a href="https://yourlifecc.com/app" style="display:inline-block;background:#10b981;color:#ffffff;font-weight:800;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Open YourLife CC &rarr;</a>'
    +   '</div>'
    +   '<p style="font-size:14px;color:#475569;margin:0 0 22px;">Thanks for being part of this &mdash; building something my own family uses, that I hope helps yours too.</p>'
    +   '<p style="font-size:14px;color:#0b1020;margin:0 0 4px;">&mdash; Jason</p>'
    +   '<p style="font-size:13px;color:#64748b;margin:0 0 2px;">Kingdom Creatives</p>'
    +   '<p style="font-size:13px;color:#64748b;margin:0 0 24px;"><a href="mailto:info@kingdom-creatives.com" style="color:#10b981;text-decoration:none;">info@kingdom-creatives.com</a></p>'
    +   '<div style="border-top:1px solid #e2e8f0;padding-top:14px;font-size:11px;color:#94a3b8;text-align:center;line-height:1.7;">'
    +     '<a href="' + _esc(unsubUrl)  + '" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>'
    +     ' &middot; <a href="' + _esc(manageUrl) + '" style="color:#94a3b8;text-decoration:underline;">Manage email preferences</a><br>'
    +     'Kingdom Creatives LLC &middot; <a href="https://yourlifecc.com" style="color:#94a3b8;text-decoration:underline;">yourlifecc.com</a>'
    +   '</div>'
    + '</div>';

  const text = [
    'Hey there,',
    '',
    'It\'s Jason from Kingdom Creatives. I wanted to give you a quick update — we\'ve added a bunch of new features to YourLife CC over the past few weeks, and I think you\'re going to love them.',
    '',
    'Here\'s what\'s new in the app:',
    '',
    '  • A complete Money tab — your kids can now track allowance, set savings goals, request purchases (parent approves), and get an AI money coach that gives weekly feedback',
    '  • Life Skills Academy got a major upgrade — 42 skill categories, rapid-fire Power Mode quizzes, and shareable certificates when your kid passes',
    '  • Brand new Health tab — water tracker, workout log, sleep tracker, 8 health badges to earn, and an AI health coach',
    '  • Family Activity Feed — see everything your kids did across every tab in one place (Parent Hub)',
    '  • Power Card visual upgrade across the whole app — feels brand new',
    '',
    'STARTING THIS SUNDAY',
    'You\'ll get a weekly family digest every Sunday at 7pm — a friendly summary of every chore done, goal reached, and badge earned that week. You can turn it off anytime in Settings or right from the email.',
    '',
    'Also new: optional friendly reminders (max 1 per week) if you opt in under Me → Settings → "Engagement emails."',
    '',
    'Open YourLife CC: https://yourlifecc.com/app',
    '',
    'Thanks for being part of this — building something my own family uses, that I hope helps yours too.',
    '',
    '— Jason',
    'Kingdom Creatives',
    'info@kingdom-creatives.com',
    '',
    'Unsubscribe: ' + unsubUrl,
    'Manage email preferences: ' + manageUrl,
    'Kingdom Creatives LLC · yourlifecc.com'
  ].join('\n');

  return { subject, html, text };
}

// ── Variant B — faith_free ───────────────────────────────────
// Cream serif theme, scripture box, soft invitation. Inline scripture
// from MEMORY_VERSE_LIBRARY (app/js/data/memory-verses.js) — Psalm 46:10
// chosen for the warm-invitation tone matching this audience.
function _renderFaithVariant({ unsubUrl }){
  const subject = 'A quiet note from Kingdom Creatives';
  const scripture = {
    ref:  'Psalm 46:10',
    text: 'Be still, and know that I am God.'
  };

  const html = ''
    + '<div style="font-family:Georgia,Times New Roman,serif;color:#1a1a2e;max-width:560px;margin:0 auto;padding:28px 24px;background:#fbf8f1;line-height:1.7;">'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 14px;">Hey,</p>'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 14px;">Jason here from Kingdom Creatives.</p>'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 20px;">I wanted to send a quick note to let you know I\'ll occasionally send a faith-friendly update &mdash; a scripture, a glimpse of what\'s new in YourLife CC, and an open invitation to try the full app if it would bless your family.</p>'
    +   '<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin:0 0 22px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;color:#475569;line-height:1.85;">'
    +     '<div><strong style="color:#0b1020;">How often:</strong> about once every 6 weeks</div>'
    +     '<div><strong style="color:#0b1020;">How many total:</strong> no more than 4 emails ever</div>'
    +     '<div><strong style="color:#0b1020;">How to opt out:</strong> tap unsubscribe in any email &mdash; including this one</div>'
    +   '</div>'
    +   '<div style="border-left:3px solid #fbbf24;padding:14px 18px;margin:0 0 24px;background:rgba(251,191,36,.06);border-radius:0 8px 8px 0;">'
    +     '<div style="font-style:italic;font-size:17px;color:#0b1020;line-height:1.55;margin:0 0 8px;">' + _esc(scripture.text) + '</div>'
    +     '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:12px;color:#a16207;font-weight:700;letter-spacing:.06em;">&mdash; ' + _esc(scripture.ref) + '</div>'
    +   '</div>'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 18px;">Whenever you\'re ready, the full app is here for you:</p>'
    +   '<div style="text-align:center;margin:0 0 28px;">'
    +     '<a href="https://yourlifecc.com/?from=announcement" style="display:inline-block;background:#7c3aed;color:#ffffff;font-weight:800;padding:13px 26px;border-radius:10px;text-decoration:none;font-size:15px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">See what\'s in YourLife CC &rarr;</a>'
    +   '</div>'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 12px;">Grateful for you,</p>'
    +   '<p style="font-size:15px;color:#0b1020;margin:0 0 4px;font-style:italic;">&mdash; Jason &amp; the Kingdom Creatives family</p>'
    +   '<p style="font-size:13px;color:#64748b;margin:0 0 28px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;"><a href="mailto:info@kingdom-creatives.com" style="color:#7c3aed;text-decoration:none;">info@kingdom-creatives.com</a></p>'
    +   '<div style="border-top:1px solid #e2e8f0;padding-top:14px;font-size:11px;color:#94a3b8;text-align:center;line-height:1.7;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">'
    +     '<a href="' + _esc(unsubUrl) + '" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a><br>'
    +     'Kingdom Creatives LLC &middot; <a href="https://yourlifecc.com" style="color:#94a3b8;text-decoration:underline;">yourlifecc.com</a>'
    +   '</div>'
    + '</div>';

  const text = [
    'Hey,',
    '',
    'Jason here from Kingdom Creatives.',
    '',
    'I wanted to send a quick note to let you know I\'ll occasionally send a faith-friendly update — a scripture, a glimpse of what\'s new in YourLife CC, and an open invitation to try the full app if it would bless your family.',
    '',
    'How often:       about once every 6 weeks',
    'How many total:  no more than 4 emails ever',
    'How to opt out:  tap unsubscribe in any email — including this one',
    '',
    '"' + scripture.text + '"',
    '  — ' + scripture.ref,
    '',
    'Whenever you\'re ready, the full app is here for you:',
    'See what\'s in YourLife CC: https://yourlifecc.com/?from=announcement',
    '',
    'Grateful for you,',
    '',
    '— Jason & the Kingdom Creatives family',
    'info@kingdom-creatives.com',
    '',
    'Unsubscribe: ' + unsubUrl,
    'Kingdom Creatives LLC · yourlifecc.com'
  ].join('\n');

  return { subject, html, text };
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

// ── Per-recipient render + send wrapper ──────────────────────
function _renderForVariant(variant, ctx){
  if(variant === 'active')     return _renderActiveVariant(ctx);
  if(variant === 'faith_free') return _renderFaithVariant(ctx);
  throw new Error('Unknown variant: ' + variant);
}

// ── Main handler ─────────────────────────────────────────────
module.exports = async function handler(req, res){
  if(req.method !== 'POST' && req.method !== 'GET'){
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth — accept ADMIN_SECRET (preferred) OR CRON_SECRET (fallback).
  const adminSecret = process.env.ADMIN_SECRET || '';
  const cronSecret  = process.env.CRON_SECRET  || '';
  if(!adminSecret && !cronSecret){
    console.error('send-announcement: no ADMIN_SECRET or CRON_SECRET set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const validAuth =
       (adminSecret && token === adminSecret)
    || (cronSecret  && token === cronSecret);
  if(!validAuth){
    // Optional diagnostic — only enabled when AUTH_DEBUG === '1'.
    // Exposes first 8 chars of received + expected secrets so we can
    // visually compare without leaking the full values. Turn this
    // OFF in Vercel env vars once the mismatch is identified.
    if(process.env.AUTH_DEBUG === '1'){
      const head8 = function(s){ return s ? String(s).slice(0, 8) : ''; };
      let comparison = 'no_match';
      if(!adminSecret && !cronSecret) comparison = 'no_secrets_set';
      else if(!token) comparison = 'no_token_received';
      else if((adminSecret && token === adminSecret) || (cronSecret && token === cronSecret)) comparison = 'exact_match';
      return res.status(401).json({
        error: 'Unauthorized',
        diag: {
          received_header:     auth ? 'present' : 'missing',
          received_prefix:     head8(token),
          received_length:     token.length,
          admin_secret_set:    !!adminSecret,
          admin_secret_prefix: head8(adminSecret),
          admin_secret_length: adminSecret.length,
          cron_secret_set:     !!cronSecret,
          cron_secret_prefix:  head8(cronSecret),
          cron_secret_length:  cronSecret.length,
          comparison:          comparison
        }
      });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Query params
  const audience = String((req.query && req.query.audience) || '').trim();
  if(!ALLOWED_AUDIENCES.has(audience)){
    return res.status(400).json({
      error:    'audience query param required: active OR faith_free',
      received: audience || null
    });
  }
  const isDryRun   = (req.query && String(req.query.dryRun || '').toLowerCase()) === 'true';
  const testEmail  = (req.query && req.query.testUser) ? String(req.query.testUser).trim() : '';
  if(testEmail && !EMAIL_RE.test(testEmail)){
    return res.status(400).json({ error: 'testUser must be a valid email address' });
  }

  // Env vars for downstream
  const serviceKey  = process.env.SUPA_SERVICE_KEY;
  const unsubSecret = process.env.EMAIL_UNSUB_SECRET;
  const brevoKey    = process.env.BREVO_API_KEY;
  if(!serviceKey || !unsubSecret || !brevoKey){
    console.error('send-announcement: missing env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const variant = audience;   // audience name doubles as variant key
  const mode    = testEmail ? 'test' : (isDryRun ? 'dryRun' : 'live');
  const nowIso  = new Date().toISOString();

  // ── TEST MODE ────────────────────────────────────────────
  // Send ONE preview email to testEmail. Look up the profile by
  // email to pull a real user_id (for the unsubscribe token) if
  // available; fall back to a placeholder user_id otherwise so the
  // preview link still renders correctly.
  if(testEmail){
    let userId = '';
    try {
      const rows = await _supaGet(
        'profiles?select=user_id,email,plan_status,data&email=eq.' + encodeURIComponent(testEmail) + '&limit=1',
        serviceKey
      );
      if(Array.isArray(rows) && rows.length) userId = rows[0].user_id;
    } catch(_){}

    const unsub = _unsubUrl(userId || 'preview-no-account', 'all', unsubSecret);
    const manage = 'https://yourlifecc.com/app';
    const rendered = _renderForVariant(variant, { unsubUrl: unsub, manageUrl: manage });
    const unsubMailto = 'mailto:info@kingdom-creatives.com?subject=Unsubscribe';

    try {
      await _brevoSend({
        to:              testEmail,
        subject:         rendered.subject,
        html:            rendered.html,
        text:            rendered.text,
        listUnsubUrl:    unsub,
        listUnsubMailto: unsubMailto,
        brevoKey:        brevoKey
      });
      return res.status(200).json({
        ok: true, mode, audience, variant,
        sent: 1, skipped: 0, failed: 0,
        at: nowIso,
        details: [{ to: testEmail, userId: userId || null, subject: rendered.subject }]
      });
    } catch(e){
      return res.status(502).json({ ok:false, mode, audience, error: 'send_failed: ' + (e && e.message) });
    }
  }

  // ── AUDIENCE WALK (dryRun + live share this path) ────────
  let audienceQuery;
  if(audience === 'active'){
    audienceQuery = 'profiles?select=user_id,email,plan_status,data&plan_status=in.(active,trialing,free_contest)&limit=5000';
  } else { // faith_free
    audienceQuery = 'profiles?select=user_id,email,plan_status,data&plan_status=eq.faith_free&limit=5000';
  }

  let rows;
  try {
    rows = await _supaGet(audienceQuery, serviceKey);
  } catch(e){
    console.error('send-announcement: audience query failed:', e && e.message);
    return res.status(500).json({ error: 'Audience query failed' });
  }

  // Pull the master-kill suppression list once
  let suppressedEmails = new Set();
  try {
    const suppRows = await _supaGet(
      'email_suppressions?select=email&list=eq.all&limit=10000',
      serviceKey
    );
    suppressedEmails = new Set((suppRows || [])
      .map(function(r){ return (r && r.email) ? String(r.email).toLowerCase() : ''; })
      .filter(Boolean));
  } catch(e){
    console.warn('send-announcement: suppression-list query failed (continuing):', e && e.message);
  }

  const results = {
    ok:         true,
    mode:       mode,
    audience:   audience,
    variant:    variant,
    considered: rows.length,
    sent:       0,
    skipped:    0,
    failed:     0,
    at:         nowIso,
    details:    []
  };

  for(const row of rows){
    if(!row || !row.user_id){
      results.skipped++;
      results.details.push({ reason: 'no_user_id' });
      continue;
    }
    const data  = row.data || {};
    const prefs = data.emailPrefs || {};
    const recipient = (prefs.recipientEmail || row.email || '').trim();

    if(!recipient){
      results.skipped++;
      results.details.push({ user_id: row.user_id, reason: 'no_email' });
      continue;
    }
    // Plan safety belt — server-side filter should already match, but
    // double-check so a bad query never sends to the wrong audience.
    if(audience === 'active'     && !ACTIVE_PLAN_STATUSES.has(row.plan_status || '')){
      results.skipped++;
      results.details.push({ user_id: row.user_id, reason: 'wrong_plan_status', plan_status: row.plan_status });
      continue;
    }
    if(audience === 'faith_free' && row.plan_status !== 'faith_free'){
      results.skipped++;
      results.details.push({ user_id: row.user_id, reason: 'wrong_plan_status', plan_status: row.plan_status });
      continue;
    }
    // Per-user master kill
    if(prefs.allOptOut === true){
      results.skipped++;
      results.details.push({ user_id: row.user_id, reason: 'all_opted_out' });
      continue;
    }
    // Persistent suppression list (survives account deletion)
    if(suppressedEmails.has(recipient.toLowerCase())){
      results.skipped++;
      results.details.push({ user_id: row.user_id, reason: 'suppressed_all' });
      continue;
    }

    // Dry-run accumulates the recipient list and returns without sending.
    if(isDryRun){
      results.sent++;   // counted as "would-send" in dry mode
      results.details.push({ user_id: row.user_id, to: recipient, firstName: _firstName(row) });
      continue;
    }

    // Real send
    const unsub  = _unsubUrl(row.user_id, 'all', unsubSecret);
    const manage = 'https://yourlifecc.com/app';
    const rendered = _renderForVariant(variant, { unsubUrl: unsub, manageUrl: manage });
    const unsubMailto = 'mailto:info@kingdom-creatives.com?subject=Unsubscribe';

    try {
      await _brevoSend({
        to:              recipient,
        subject:         rendered.subject,
        html:            rendered.html,
        text:            rendered.text,
        listUnsubUrl:    unsub,
        listUnsubMailto: unsubMailto,
        brevoKey:        brevoKey
      });
      results.sent++;
      results.details.push({ user_id: row.user_id, to: recipient });
    } catch(e){
      results.failed++;
      results.details.push({ user_id: row.user_id, to: recipient, error: (e && e.message) || 'send_failed' });
      console.error('send-announcement: Brevo failed for', row.user_id, e && e.message);
    }
  }

  // Hint to differentiate dry-run from live in the response
  if(isDryRun){
    results.note = 'dryRun=true — sent count reflects WOULD-send recipients; no emails actually delivered';
  }

  return res.status(200).json(results);
};
