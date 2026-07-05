# FAITH SURFACES — WAVE 3 SPEC
## Faith Academy · Reading Plans · Devotionals · Memory Verses

**Date:** July 4, 2026
**Follows:** Wave 1 (Pulse ✅, Breath Prayer ✅) and Wave 2 (Bible Continue Reading ✅; Who Is Jesus ✅ shipped 2026-07-04 as the Meet Jesus experiential layer / Sleep Stories / Prayer-completion / Bible-immersive still queued).
**Same pipeline every increment:** Phase 0 fan-out → pre-build UX critique → build → smoke harness with regressions → post-build UX review → guardian → SW bump from actual → ship. Reward throttles persist in DEF (D.hcDaily pattern). Light mode same commit. Reduced-motion variants. Scene-layer exemptions per the design-system ruling.

---

# 1. MEMORY VERSES → "Hide It In Your Heart" (the mechanical transformation)

## Current state
50-verse library (9 categories) + custom verses, real SM-2-lite engine (`ease/intervalDays/nextDue/mastered` in `D.memoryVerses`), due-count logic. The engine is right; the *practice* is passive (read/reveal). Active recall is the entire science of memorization — this upgrade adds it.

## The Practice Ladder (core of the increment)
A due verse is practiced through four rungs, hardest rung the user can pass wins:

1. **Read it** — verse full-text, read once, "I read it" (rung for brand-new verses only)
2. **Fill the gaps** — the verse renders with 20% → 40% → 60% of words blanked (progressive within the rung); each blank is answered by tapping the right word from 3 chips (2 distractors drawn from the same verse's other words). Wrong tap = gentle shake, chip stays, try again.
3. **First letters** — the verse renders as first-letters only ("F G s l t w…"); user recites, then taps to reveal and self-grades: "Nailed it / Close / Not yet"
4. **From the heart** — reference only; recite fully; reveal; self-grade

## Grading → engine mapping
- Rung passed cleanly → SM-2 grade high (interval grows); "Close" → medium; "Not yet" → reset short. Reuse the existing ease/interval math — Phase 0 must trace the exact current update function and map to it, not replace it.
- **Mastery** = "From the heart / Nailed it" on 3 separate days → `mastered:true`, gold moment (celebrations.js, win-register is correct here — this IS a win, unlike Breath Prayer's settle), verse moves to the Mastered shelf with count ("12 verses hidden in your heart").

## The Session
- Entry: "3 verses due today →" card (due logic exists). Session = swipe through due verses, each at its current rung; end screen: rungs climbed, next-due preview, streak tie-in via the EXISTING streak metric for verses if one exists — Phase 0 checks; if none exists, this feeds the faith/devotional metric rather than inventing a new streak (streak-unification rule).
- Daily quest metric: 'verse' already exists in the walk-quest pool — bump once/day via persisted throttle.

## Visual
- Verse cards get the category accent as a left border + soft wash; Georgia serif for verse text (the established devotional register). Interface layer, light pass same commit.

## Data
- `D.memoryVerses` entries gain `rung` (0–3) — backward compatible, absent = derive from interval.
- No new content files.

**Est: 6h**

---

# 2. DEVOTIONALS → "First Light" (a staged morning moment)

## Current state
Strong daily entries (title / verse / scripture / body / reflect / prayer) rendered as a flat card. The Pulse proved the staging pattern; this is its morning sibling.

## The staged flow (5 beats, ~2 minutes)
1. **Settle** — one line on a calm card: "Before the day gets loud." + Begin (skippable to classic card view via "just read it")
2. **The Word** — scripture staged in word-groups (reuse The Pulse's `.hc-vw` mechanic)
3. **The Thought** — the body text, comfortable measure, no rush
4. **Your Line** — the reflect prompt + a one-line input saving to the journal (same idiom as Bible chapter-end "Add a thought"); optional, "skip" honest
5. **Amen** — the prayer with a "Pray this" 15-second ring (reuse Pulse's pray ring), then a quiet completion: devotional streak (EXISTS — reuse) + 'devotional' quest metric once/day

## Details
- Deterministic daily pick (date-hash over the devotional array) so the whole family sees the same devotional on the same day — enables dinner-table conversation; Phase 0 verifies current selection logic and keeps it if it's already deterministic.
- The journey-home Devotionals card gains "Today: {title}" teaser line (same clamp rules as the Bible card teaser).
- Completion register: settle, not win (a chime at most). Morning quiet ≠ quiz victory.

**Est: 4h**

---

# 3. READING PLANS → "The Path" (visible journey + graceful grace)

## Current state
5 plans with excellent per-day devotionals (plans.js), active-plan card, streak banner, catalog — wired and working. Missing: the *journey feel*, the completion payoff, and grace for missed days.

## The upgrades (3)

### 3a. The day-path
- The active plan renders a horizontal dot-path (one dot per day: filled = done, ringed = today, dim = future) above the day content — a pocket version of the walk-path idiom. 365-day plan: dots collapse to a segmented month bar (12 segments, fill proportional).
- Day completion → the dot fills with a small pulse (win-lite; no confetti per day).

### 3b. Grace, not guilt (the retention saver)
- Missing days must never shame or reset. Opening a plan after a gap shows one line: "Life happened. You're on Day 4 — pick up right where you left off." No red, no streak-loss framing on the plan surface itself.
- **No auto-advance by calendar date** — the plan advances by completion, not by elapsed time. Phase 0 verifies current behavior; if it's calendar-driven, convert to completion-driven with a migration note.

### 3c. Plan completion + the ladder
- Finishing a plan = a real moment: full celebration (win register), a completion card ("You finished Anchored — 7 days in the Word"), and the graduation prompt: the next plan up the ladder pre-selected ("Ready for 30 days?") — 3d → 7d → 30d → 90d → 365d.
- `D.plansCompleted:[]` (id + date) so the catalog shows ✓ badges on finished plans.

**Est: 5h**

---

# 4. FAITH ACADEMY → "Tracks & Diplomas" (an arc, not a pile)

## Current state
15 featured lessons across 5 categories + legacy curriculum. Quizzes with explanations, 80% pass, progress in `D.academyProgress`. Solid LMS bones; no ordering, no arc, no payoff beyond a pass state.

## The upgrades (3)

### 4a. Three named tracks (ordering the existing 15)
Reorganize the featured grid into three tracks of 5 lessons each with a visual track rail (lesson dots, same pocket-path idiom as Reading Plans):
- **Foundations** — who God is, the gospel, the Bible (theology + bible-study picks)
- **Defender** — apologetics track (the 5 apologetics/church-history picks)
- **Walking It Out** — christian-living picks
Phase 0 maps the actual 15 lesson ids to tracks (content-driven; propose the mapping in the report). Lessons remain individually openable — tracks are ordering + narrative, not locks. (No gating: a teen who wants lesson 4 first may take it.)

### 4b. Diplomas (the payoff)
- Completing all 5 lessons in a track → a **diploma**: canvas-rendered certificate (night-navy, gold seal, track name, the user's first name from profile, date) rendered in a modal with Save-image + Share buttons — the parent-visible, fridge-worthy artifact.
- Full win register: celebration + XP. `D.academyDiplomas:[]`.
- All three diplomas → "Academy Graduate" moment + a Growth Profile trait beat.

### 4c. Sharper quizzes
- **Retry wrong-only**: failing a quiz offers "Retry the ones you missed" instead of the full 5 again.
- **Review queue**: questions answered wrong get one resurfacing — next time the academy opens, an optional "Quick review: 2 from last time" card (single-question cards, explanation shown after answer). Lightweight — a `D.academyReview:[]` capped at 10; no new SRS engine (memory verses owns spaced repetition; this is one-shot resurfacing).

**Est: 6h**

---

# BUILD ORDER (impact ÷ effort)

| # | Increment | Est | Why |
|---|---|---|---|
| W3-1 | Memory Verses practice ladder | 6h | The mechanical transformation; the SM-2 engine finally gets real practice |
| W3-2 | Devotionals: First Light | 4h | Cheap (reuses Pulse mechanics), daily-touch surface |
| W3-3 | Reading Plans: path + grace + completion | 5h | Retention saver (grace) + payoff (ladder) |
| W3-4 | Academy: tracks + diplomas + quiz polish | 6h | The showcase artifact (diploma) lands last, on ordered tracks |

~21h. Numbering continues global increment count.

# STANDING RULES
Unchanged from Waves 1–2. Additions ratified this wave:
- **Completion registers:** contemplative surfaces (devotional, breath, sleep) = settle; achievement surfaces (mastery, diploma, plan finish) = win. Choose deliberately per feature; the post-build UX review checks this.
- **One SRS engine:** memory verses owns spaced repetition. Other surfaces may do one-shot resurfacing only.
- **Grace over guilt:** no surface may shame a gap. Streak mechanics stay on their existing home surfaces; plans/devotionals reference them gently or not at all.

# CONTENT NOTES
No new content files required this wave — all four surfaces are content-rich already; this wave is pure experience engineering. (From Wave 2 drafting: red-letters.js ✅ and jesus-questions.js ✅ shipped with the Meet Jesus rebuild 2026-07-04; ACTS starters still queued for the Prayer-completion increment.)
