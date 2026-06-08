// api/cron/weekly-digest.js — PLACEHOLDER (Email Bundle PR 0)
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Vercel Cron entry (vercel.json): "0 * * * 0,1" — top of every
// hour on Sunday + Monday UTC. The handler will fan out by user-local
// 7pm Sunday using profiles.data.emailPrefs.timezoneOffsetMin.
//
// Track 1 of the email bundle fills this in. PR 0 ships the entry
// so the Vercel Cron config is wired and the path doesn't 404 if
// the cron is enabled before Track 1 lands.
//
// What this handler WILL do (Track 1):
//   1. Verify Authorization: Bearer ${CRON_SECRET}
//   2. Query profiles for users with:
//        plan_status IN ('active','trialing','free_contest')
//        AND (data->'emailPrefs'->>'digestOptIn')::boolean = true
//        AND (data->'emailPrefs'->>'allOptOut')::boolean IS NOT TRUE
//        AND local hour == 19 (from timezoneOffsetMin)
//        AND local day-of-week == 0 (Sunday)
//        AND lastDigestSent < weekStart
//   3. For each matching user, walk their data.activityLog for the
//      week, build per-kid sections, render HTML, send via Brevo.
//   4. Set lastDigestSent to now() on success.
//
// Env vars Track 1 will require:
//   • CRON_SECRET         — Vercel-set, validates cron requests
//   • SUPA_SERVICE_KEY    — existing
//   • BREVO_API_KEY       — existing
//   • EMAIL_UNSUB_SECRET  — set in PR 0, used to mint per-email tokens

module.exports = async function handler(req, res){
  // Vercel Cron requests carry Authorization: Bearer ${CRON_SECRET}.
  // PR 0 placeholder accepts requests without it so the cron doesn't
  // log auth failures before Track 1's secret rotation lands. Track 1
  // tightens this to a hard 401.
  const cronSecret = process.env.CRON_SECRET;
  if(cronSecret){
    const auth = req.headers.authorization || '';
    if(auth !== `Bearer ${cronSecret}`){
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
  }

  return res.status(200).json({
    ok:      true,
    handler: 'weekly-digest',
    status:  'placeholder — Track 1 not yet shipped',
    at:      new Date().toISOString()
  });
};
