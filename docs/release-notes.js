// docs/release-notes.js
//
// EDITORIAL SOURCE for the "what's new" Track 2 engagement trigger.
// The cron handler at /api/cron/engagement-tick reads this array and
// selects entries where:
//
//   • version > user's data.emailPrefs.lastReleaseNoteVersion
//   • user's plan_status ∈ entry.audience array
//
// On send, lastReleaseNoteVersion is advanced to the highest version
// included in the email (so the same entry never re-emails the same
// user). Faith-only users (plan_status='faith_free') do NOT see
// these through Track 2 — Track 3's crossover cron handles their
// "what's new" highlights via /docs/crossover-highlights.md on the
// 6-week cadence.
//
// PAUSED 2026-06-08 — release_notes trigger is gated by
// RELEASE_NOTES_ENABLED=1 in Vercel env vars until the maintainer
// approves the user-facing copy below. See the matching note in
// /api/cron/engagement-tick.js → _evalReleaseNotes().
//
// TO ADD AN ENTRY:
//   1) Bump `version` (monotonically increasing integer)
//   2) Set `shipped` to the deploy date (YYYY-MM-DD)
//      — internal field name; only the date value appears in emails
//   3) Set `audience` to the plan_status values that should see it
//   4) Write a 1-2 sentence `blurb` in PLAIN LANGUAGE — no developer
//      terms like "shipped", "API", "increment", or internal feature
//      names. Write to the parent the way you'd talk to a neighbor.
//   5) Set a `ctaLabel` + `ctaPath` if the entry deep-links somewhere
//      specific (defaults to /app if omitted)
//
// TONE GUARDRAILS:
//   • Plain language. A non-developer should understand every word.
//   • Benefit-forward — what the parent or kid GETS, not what we BUILT.
//   • Use "added" or "now live" — never "shipped".
//   • Quiet, never breathless. No exclamation marks.
//   • Faith-adjacent only when the feature is faith-adjacent.
//
// File is required() at runtime by the cron handler — keep it pure
// data, no side effects, no imports.

module.exports = [
  {
    version:   1,
    headline:  "Everything your family did, in one place",
    shipped:   "2026-06-08",
    audience:  ["active", "trialing", "free_contest"],
    blurb:     "Every chore done, goal reached, badge earned, and prayer logged across the family — now all in one warm view. You can see today's events at a glance or filter by kid.",
    ctaLabel:  "Open the Activity tab",
    ctaPath:   "/app"
  },
  {
    version:   2,
    headline:  "Race-the-clock Skills quizzes",
    shipped:   "2026-06-01",
    audience:  ["active", "trialing", "free_contest"],
    blurb:     "For kids who love a challenge — Skills quizzes can now time them and celebrate their best streak when they finish.",
    ctaLabel:  "Try a timed quiz",
    ctaPath:   "/app"
  },
  {
    version:   3,
    headline:  "Weekly check-ins for Health, Goals, and Money",
    shipped:   "2026-05-28",
    audience:  ["active", "trialing"],
    blurb:     "Three new weekly notes appear in your kid's app — gentle observations about patterns in what they've been tracking, never advice or pressure. The Money note never gives financial advice.",
    ctaLabel:  "See the new check-ins",
    ctaPath:   "/app"
  }
];
