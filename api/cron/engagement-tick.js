// api/cron/engagement-tick.js — PLACEHOLDER (Email Bundle PR 0)
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Vercel Cron entry (vercel.json): "0 * * * *" — top of every hour.
// Walks profiles, evaluates 5 trigger conditions in priority order,
// sends at most 1 email per user per run, enforces the 1-per-week
// cap via data.emailPrefs.lastEngagementSent.
//
// Track 2 of the email bundle fills this in. PR 0 ships the entry.
//
// Audience filter Track 2 will apply:
//   plan_status IN ('active','trialing','free_contest')
//   AND (data->'emailPrefs'->>'engagementOptIn')::boolean = true
//   AND (data->'emailPrefs'->>'allOptOut')::boolean IS NOT TRUE
//   AND lastEngagementSent < now() - interval '7 days'
//
// faith_free is EXCLUDED — those users go through Track 3 instead.
//
// Trigger priority (highest first):
//   1. Streak at risk    (kid streak >=7, no check-in today, 7pm local)
//   2. New features      (lastReleaseNoteVersion < RELEASE_NOTE_VERSION)
//   3. Inactivity        (no activityLog entry in 5d AND no last_sign_in 5d)
//   4. Refer-a-friend    (30d active + last referral nudge > 90d ago)
//   5. Onboarding incomplete (onboardingDone !== true + signup > 3d ago)
//
// Only the highest-priority trigger fires for any given user-tick.

module.exports = async function handler(req, res){
  const cronSecret = process.env.CRON_SECRET;
  if(cronSecret){
    const auth = req.headers.authorization || '';
    if(auth !== `Bearer ${cronSecret}`){
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
  }

  return res.status(200).json({
    ok:      true,
    handler: 'engagement-tick',
    status:  'placeholder — Track 2 not yet shipped',
    at:      new Date().toISOString()
  });
};
