// docs/release-notes.js
//
// EDITORIAL SOURCE for the "New features shipped" Track 2 engagement
// trigger. The cron handler at /api/cron/engagement-tick reads this
// array and selects entries where:
//
//   • version > user's data.emailPrefs.lastReleaseNoteVersion
//   • user's plan_status ∈ entry.audience array
//
// On send, lastReleaseNoteVersion is advanced to the highest version
// included in the email (so the same entry never re-emails the same
// user). Faith-only users (plan_status='faith_free') do NOT see
// release notes through Track 2 — Track 3's crossover cron handles
// their "what's new" highlights via /docs/crossover-highlights.md
// on the 6-week cadence.
//
// TO ADD AN ENTRY:
//   1) Bump `version` (monotonically increasing integer)
//   2) Set `shipped` to the deploy date (YYYY-MM-DD)
//   3) Set `audience` to the plan_status values that should see it
//   4) Write a 1-2 sentence `blurb` in benefits language (not feature-
//      spec). Avoid "we" — write to the parent.
//   5) Set a `ctaLabel` + `ctaPath` if the entry deep-links somewhere
//      specific (defaults to /app if omitted)
//
// TONE GUARDRAILS:
//   • Specific over general ("Power Mode times you" beats "improved quizzes")
//   • Benefit-forward ("your kids race the clock") beats feature-spec
//   • Quiet, never breathless. No exclamation marks.
//   • Faith-adjacent only when the feature is faith-adjacent.
//
// File is required() at runtime by the cron handler — keep it pure
// data, no side effects, no imports.

module.exports = [
  {
    version:   1,
    headline:  "Family Activity Feed",
    shipped:   "2026-06-08",
    audience:  ["active", "trialing", "free_contest"],
    blurb:     "Every chore, prayer, and goal across the family — now in one warm view. Tap Activity in Parent Hub to see today's events at a glance, filtered by kid or by domain.",
    ctaLabel:  "Open the new Activity tab",
    ctaPath:   "/app"
  },
  {
    version:   2,
    headline:  "Skills Quiz Power Mode",
    shipped:   "2026-06-01",
    audience:  ["active", "trialing", "free_contest"],
    blurb:     "Race the clock on any Skills quiz. Perfect for the kids who love a challenge — Power Mode times them and rewards their peak streak with confetti.",
    ctaLabel:  "Try Power Mode",
    ctaPath:   "/app"
  },
  {
    version:   3,
    headline:  "Health + Goals + Money coaches",
    shipped:   "2026-05-28",
    audience:  ["active", "trialing"],
    blurb:     "Three new weekly AI coaches noticing patterns in your kid's data — observational, never prescriptive. Money keeps a strict no-financial-advice line; Health and Goals nudge gently.",
    ctaLabel:  "See the coaches",
    ctaPath:   "/app"
  }
];
