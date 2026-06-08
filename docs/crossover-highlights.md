# Crossover Highlights

Editorial source for the Track 3 faith-only crossover emails. The
cron handler at `/api/cron/crossover-tick.js` reads this file at
runtime, parses the `## v{N}` headings, and includes the top 3
newest entries in the "Glimpse of what's new" section of every send.

## Tone guardrails

- Warm, faith-adjacent when appropriate, **never** salesy
- 1-2 short sentences per blurb
- Benefits language ("kids can see") not feature-spec ("we added X")
- Never mention pricing — private-beta stance per CLAUDE.md
- Never urgent. The whole premise is a quiet invitation.

## File format

Each entry is a `## v{N} — {headline}` heading (where N is a
monotonically increasing version integer), followed by an optional
`shipped: YYYY-MM-DD` line, then a single paragraph blurb. The
parser:

- Splits on `## v{N}` headings
- Reads the headline from the heading line
- Reads `shipped:` from the metadata line if present
- Takes the first non-blank paragraph after metadata as the blurb
- Sorts entries newest-first (by version)
- Caps at the 3 newest per email

To add an entry: copy the block of an existing entry, bump the
version, set the shipped date, write the blurb. Commit + push.

---

## v3 — Weekly AI coaches across Health, Goals, and Money
shipped: 2026-05-28

Three gentle coaches noticing patterns in your kid's data — observational, never prescriptive. They notice rhythms; they don't dictate.

## v2 — Skills Quiz Power Mode
shipped: 2026-06-01

For kids who love a challenge, Power Mode times the quiz and rewards their peak streak with a quiet burst of celebration.

## v1 — Family Activity Feed
shipped: 2026-06-08

Kids and parents can see how the week comes together in one warm view — every chore, prayer, and goal finding its place.
