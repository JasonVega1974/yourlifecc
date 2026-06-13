# YourLife CC — Claude Code Prompts (World-Class Track)
Copy one block at a time into Claude Code. Each is self-contained, embeds your standing rules, and ends with explicit acceptance + commit steps. Run them in order within a sprint. Prompts marked **[PERMISSION-GATED]** touch The Well or The Watch — only run them after you've decided to proceed.

> Paste this preamble once at the start of a Claude Code session so the rules are in context:
>
> "Read CLAUDE.md fully before doing anything. Standing rules for this entire session: run `node --check` on every JS file you touch; after any edit to app/index.html run the index-html-guardian agent and restore the tail if it FAILs before any further edits; ship the `:root.light` pass with every visual feature in the same commit; deploy only via targeted `git add` + commit + push from bash (no web UI, no --force); ASCII straight quotes only; domain https://yourlifecc.com; contact info@kingdom-creatives.com; never modify faith.js, the faith-only Well hero, or faith content without my explicit go-ahead. Confirm you've read CLAUDE.md and understood these before starting."

---

## SPRINT 0 — Safety net

### Prompt WC-0
```
Set up the world-class enhancement track safely.

1. Create and switch to a branch: world-class-track.
2. Create docs/perf-baseline.md and record, as a checklist for me to fill in,
   the current cold-load metrics to capture (total JS transferred on first
   load, Time-to-Interactive, Lighthouse mobile performance score). Add a
   second column "after WC-1" for later comparison.
3. Verify both rollback flags still work and note them in the file:
   - ?ylcc_classic_phc=1 and localStorage.ylcc_classic_phc='1' hide The Watch canvas
   - window._ccDisabled=true falls back to the legacy #appHome
   Do not change behavior — just confirm the code paths exist and document them.

Commit: "WC-0: branch + perf baseline scaffold + rollback-flag audit".
```

---

## SPRINT 1 — Faster & unmistakably premium

### Prompt WC-1a — defer all module scripts
```
Goal: add `defer` to the module <script> block in app/index.html so scripts
download in parallel and execute in original order, improving Time-to-Interactive.

Scope:
- The contiguous <script src="/app/js/..."> block (~lines 20194-20365) AND the
  CDN libs your modules depend on at load (supabase-js, chart.js, sortablejs,
  leaflet). Add `defer` to each, keeping their current relative order intact.
- Do NOT add defer to: the inline tail <script> that defines tick()/setInterval(tick),
  or the Google Translate <script>.

Critical safety step BEFORE editing:
- Grep app/index.html for inline <script> blocks (no src) that call module
  globals at parse time. Deferred modules run AFTER inline parse-time scripts,
  so any such call would now run before its module loads. For each one you find,
  wrap its body in a DOMContentLoaded listener. List what you found and what you
  wrapped before making changes.

After editing app/index.html: run index-html-guardian. If FAIL, restore the tail first.

Acceptance: app boots identically; no console errors; modules visibly download
in parallel. Commit: "WC-1a: defer module + dependency scripts for faster TTI".
```

### Prompt WC-1b — lazy-load heavy faith data files
```
Goal: stop shipping ~3.5 MB of faith DATA on cold loads for users who never open
faith. These four pure-data files are referenced ONLY inside faith.js render
functions, never at finishInit, so they can load on demand:
  - app/js/data/bible-stories.js   -> window.BIBLE_STORIES
  - app/js/data/plans.js           -> window.FAITH_PLANS (+ related)
  - app/js/data/proof-prophecy.js  -> window.PROOF_PROPHECY_DATA
  - app/js/data/academy-lessons.js -> window.ACADEMY_LESSONS

HARD CONSTRAINT: do NOT edit faith.js. Use the wrapper pattern that streaks.js
already uses to extend faith behavior without touching it.

Steps:
1. First, RE-VERIFY safety: grep the whole app to confirm none of these four
   globals are referenced during finishInit / DOMContentLoaded / module top-level.
   If any IS referenced eagerly, leave that file eager and report it; only lazy
   the ones that are truly referenced lazily. Show me the grep results.

2. Create app/js/lazy-data.js exporting ensureData(globalName, src):
   - returns a cached Promise; injects <script src> once; resolves when
     window[globalName] is defined; rejects after a timeout with a console.warn.

3. In lazy-data.js, wrap the navigation entry points that lead into the faith
   sub-sections that consume each data file (the showSection hook and/or the
   faith-tab routers — same wrap style as streaks.js _installStreakHooks).
   Before the original render runs: await ensureData(...) for that section's
   file and show a minimal skeleton/spinner until it resolves. Guard against
   double-wrapping with a window.__lazyDataWrapped flag.

4. Remove the four eager <script> tags for those data files from app/index.html.
   Add <script src="/app/js/lazy-data.js" defer> AFTER faith.js and init.js in
   the block so it can wrap their globals.

5. Service worker: confirm these data URLs are still matched by the cache-first
   static rule so repeat visits are instant. Bump CACHE_NAME in service-worker.js.

After editing app/index.html: run index-html-guardian (restore tail on FAIL).
node --check app/js/lazy-data.js.

Acceptance: with DevTools network throttled, a fresh load that never opens faith
does NOT request the four data files; opening each faith sub-section loads its
file once (skeleton briefly), then renders correctly; second visit serves them
from SW cache. Commit: "WC-1b: lazy-load heavy faith data via wrapper (no faith.js edits)".
```

### Prompt WC-1c — constellation rework (kill 6-color violation)
```
Goal: bring the child constellation (#appCommandCenter, command-center.js) into
compliance with visual-design/SKILL.md, which names "six destination colors on
one surface" as the classic violation. Use ONE brass star language for all six
domains and spend color ONLY on today's focus node.

Reference implementation: the "Constellation" tab in ylcc-aplus-showcase.html
(I will provide the file) — its SVG builder, focus logic, link-brighten, reveal
choreography, and press-flare are liftable.

Steps:
- In command-center.js _CC_NODES / render: stop passing per-domain accent to the
  star builder. Pass brass (#FBBF24) for every node's bloom/halo.
- Compute today's focus from the existing focus logic; render that one node with
  a single accent (e.g. #7EC19A) and brighten only its two adjacent links.
- Keep constellation-kit.js primitives unchanged (magnitude tiers, diffraction
  spikes, breathing halos, count badges).
- Ship the :root.light pass in the same commit (dark-ink star language on paper).
- Run ux-visual-reviewer before and after; paste both critiques.

node --check command-center.js. If app/index.html changes, run index-html-guardian.

Acceptance: one base color + one accent on the surface; focus node + its links
read clearly; light mode correct; reduced-motion respected.
Commit: "WC-1c: constellation single-accent rework (design-system compliance)".
```

### Prompt WC-1d — The Well portal v2  [PERMISSION-GATED]
```
[Only run after I confirm — this changes The Well surface.]

Goal: upgrade the "Enter the Well" entry gate (app/index.html ~7595-7900) from a
flat title-card to a cinematic descent. Reference: the "The Well · v2" tab in
ylcc-aplus-showcase.html (I will provide it) — its canvas renderer (sky->water
gradient, rising embers, reflected shimmer pool, pointer parallax, breathing
cross) is liftable wholesale.

Preserve exactly:
- One-tap / Enter / Space / Escape dismiss and the Step Inside button.
- window._faithFree bail (faith-free users never see the gate).
- The page-load-only "seen" flag (refresh re-shows; no sessionStorage).
- The prefers-reduced-motion path: suppress particles, single still frame, short
  fade. Keep scene colors hardcoded hex (no dark-mode inversion); verify the gate
  styles cannot leak into light-mode UI.

If you extract the gate <style> block to app/css/ as part of this, do it as a
separate commit (this overlaps WC-1f).

After editing app/index.html: index-html-guardian (restore tail on FAIL).

Acceptance: depth/descent reads; embers + reflected pool present; parallax subtle;
reduced-motion still-frame intact; dismiss + faith-free bail unchanged.
Commit: "WC-1d: Well portal v2 (cinematic descent, reduced-motion safe)".
```

### Prompt WC-1e — real OG share card
```
Goal: replace the marketing OG image (currently the 512px app icon) with a real
1200x630 share card.

Steps:
- Create the card at app/img/og-card.png (1200x630). If you generate it from SVG,
  keep the brand: brass on deep indigo, the display title lockup, a one-line value
  prop ("28 sections. 175+ lessons. One platform." or similar), and a small mark.
- Update the root index.html meta: og:image -> https://yourlifecc.com/app/img/og-card.png,
  og:image:width 1200, og:image:height 630, and add twitter:image to match.
- Apply the same og:image to the other primary marketing pages (about, faq,
  sponsor) if they currently point at the icon.

Acceptance: validate unfurl in a link-preview tool; card renders, not the icon.
Commit: "WC-1e: real 1200x630 OG share card".
```

### Prompt WC-1f — begin index.html diet
```
Goal: start shrinking app/index.html (currently ~21,394 lines) by extracting the
largest self-contained inline <style> blocks into app/css/ partials, ONE block
per commit. This removes the truncation failure mode structurally.

Rules:
- Pick the single largest self-contained inline <style> block first (e.g. the
  Well-gate styles if not already moved in WC-1d). Move it verbatim to a new file
  under app/css/ and add a <link rel="stylesheet"> for it in <head>. Do not
  restyle anything — pure extraction.
- After EACH extraction: index-html-guardian (restore tail on FAIL), then a visual
  spot-check of the affected surface in dark AND light mode.
- Refresh the index.html line-count figure in CLAUDE.md in the SAME commit (the
  architecture section and the tail snapshot) — standing rule.
- Stop after the largest 2-3 blocks this pass; we continue in Sprint 3.

Acceptance: line count drops; no visual change; guardian PASS each step.
Commit per block: "WC-1f: extract <block name> styles to app/css/ (-N lines)".
```

---

## SPRINT 2 — The game loop

### Prompt WC-2a — one XP currency
```
Goal: introduce ONE app-wide XP currency that every completion funnels into,
WITHOUT rewriting feature modules and WITHOUT touching faith.js. Keep all existing
per-domain badges exactly as they are — XP is additive.

Steps:
1. data.js DEF: add xpTotal:0, xpToday:0, xpDayKey:null, xpLog:[] (cap ~365),
   dailyGoal:30. Add a phase comment per the data.js convention describing intent.
2. New module app/js/xp.js with awardXP(n, source):
   - If today's date != xpDayKey, roll over (xpToday=0, xpDayKey=today).
   - xpToday += n; xpTotal += n; push {ts, n, source} to xpLog (capped).
   - call save(); then fire the juice hook (window.xpJuice?.(n, source) — defined
     in WC-2c) guarded by typeof check.
3. Funnel completions via the wrapper pattern (like streaks.js): wrap the same
   entry points streaks.js hooks (markDevotionalRead, academy lesson complete)
   PLUS chore-complete, goal-step-complete, lesson-finish in their modules'
   public functions. Guard each wrap with a window.__xpWrapped_<name> flag. Do
   NOT edit faith.js — wrap its globals from xp.js instead.
4. Add <script src="/app/js/xp.js" defer> after the feature modules and after
   faith.js in app/index.html. Run index-html-guardian.

node --check app/js/xp.js and any feature module you wrapped in place.

Acceptance: completing anything (faith/chore/goal/lesson) bumps one xpTotal and
xpToday; existing badges still award; values persist across reload and cloud sync.
Commit: "WC-2a: unified awardXP currency (additive, wrapper-based, no faith.js edits)".
```

### Prompt WC-2b — daily-goal ring + unified streak flame
```
Goal: put one daily-goal ring + one streak flame + the XP total on the child home
(command-center.js / app-home.js) and a compact version on the Parent Hub.

Reference: the "Engagement loop" tab in ylcc-aplus-showcase.html (ring math,
layout, and the flat interface-layer styling are liftable).

Steps:
- Ring fills xpToday / D.dailyGoal; turns from brass to green at 100%.
- Flame shows the UNIFIED streak. Consolidate to one streak: wire the existing
  streak-skip/freeze state in data.js to this single streak (not per-feature).
- Interface layer rules: flat (no glow/shadow on the tiles), 2-3 colors, tokens,
  weights 400/500, displayed numbers rounded.
- Ship :root.light pass in the same commit. Respect prefers-reduced-motion.

If app/index.html changes, run index-html-guardian.

Acceptance: ring + flame + total render and update live on completion; light mode
correct; reduced-motion = instant state change.
Commit: "WC-2b: daily-goal ring + unified streak flame on home + parent hub".
```

### Prompt WC-2c — the juice layer
```
Goal: make completions FEEL good (the Duolingo dopamine layer). Define
window.xpJuice(n, source) (called by awardXP from WC-2a).

Behaviors:
- A "+N" pop at the relevant element with overshoot-and-settle, fading up.
- Ring + total scale-bump (cubic-bezier overshoot).
- On daily-goal hit and on streak milestones, reuse celebrations.js confetti.
- prefers-reduced-motion: NO motion — instant number/ring update, no pops/confetti.

Keep this in a small module or inside xp.js; no faith.js edits.
node --check the touched module(s). index-html-guardian if index.html changes.

Acceptance: tapping a completion shows +N + bump; goal-hit fires confetti;
reduced-motion path is a clean instant update with zero animation.
Commit: "WC-2c: XP juice layer (+N pop, bump, milestone confetti, reduced-motion safe)".
```

### Prompt WC-2d — weekly family league
```
Goal: a weekly sibling league ranked by this week's XP, reset on ISO-week rollover.

Steps:
- Compute per-profile weekly XP from xpLog (filter to current ISO week key) across
  _profiles where isParent === false. Render a simple ranked list on the Parent Hub
  and a kid-facing "this week" rank on the child home.
- Reset is implicit via the ISO-week key (no destructive wipe — just filter).
- Interface layer styling, light-mode pass, reduced-motion safe.
- OPTIONAL cross-family league (phase 2): if you add a Supabase table, START from
  docs/migrations/_TEMPLATE.sql, include ENABLE ROW LEVEL SECURITY + at least one
  RLS policy + explicit GRANT statements, and run scripts/check-migrations.sh
  before committing. Do not create any table without grants.

Acceptance: weekly sibling ranking renders and rolls over on ISO-week change; any
new table passes check-migrations.sh. Commit: "WC-2d: weekly family XP league".
```

---

## SPRINT 3 — No one can compare

### Prompt WC-3a — The Watch goes diegetic  [PERMISSION-GATED]
```
[Only run after I confirm — this changes The Watch.]

Goal: make parent-watch-scene.js informative, not just ambient. Farmhouse windows
light when a child has activity today; the "hot" item becomes the single brightest
lantern. Reuse the family-stat aggregation already in parent-celestial.js
(_pchAggregateStats / per-kid resolvers) as the data source.

Preserve: the ?ylcc_classic_phc=1 / localStorage escape hatch; visibility +
IntersectionObserver gating; DPR clamp; prefers-reduced-motion still-frame.

If app/index.html changes, run index-html-guardian. node --check the scene module.
Run ux-visual-reviewer before and after.

Acceptance: lit windows correspond to kids with activity today; exactly one hot
lantern for the top item; escape hatch + reduced-motion intact.
Commit: "WC-3a: The Watch diegetic windows (live family status in-scene)".
```

### Prompt WC-3b — finish PIN security
```
Goal: remove the standing plaintext-PIN fallback risk in auth.js (~703-805).

Steps:
- Add a one-time BACKGROUND migration on authenticated sign-in: if any record
  still holds a plaintext PIN (parentPIN/chorePin), hash it with the existing
  hashing helper and clear the plaintext, then save — WITHOUT waiting for a verify
  event. Idempotent; guard so it runs once per session.
- Keep the verify-time fallback for THIS release only; open a follow-up note to
  delete the fallback branch next release once telemetry shows no plaintext remains.
- Run the security-auditor agent and paste its findings.

node --check auth.js. No index.html change expected.

Acceptance: after one authenticated session, no plaintext PIN remains on any
record; verify still works; security-auditor clean.
Commit: "WC-3b: background plaintext-PIN migration (hash-on-signin)".
```

### Prompt WC-3c — 90-second delight onboarding
```
Goal: a first-run flow that demos the daily-goal ring + streak + one quick win
BEFORE asking for anything heavy. Skippable; reduced-motion safe.

Steps:
- Detect first run (no existing onboarding-complete flag). Show a 3-4 step guided
  moment: name -> "here's your daily goal ring" -> award a first small XP win
  (calls awardXP) so they SEE the ring move and the +N pop -> done.
- Must not regress existing onboarding/auth gates; layer on top, fully skippable.
- Honor prefers-reduced-motion; light-mode pass.

If app/index.html changes, run index-html-guardian.

Acceptance: a brand-new account is guided to a first XP win in under ~90s and can
skip anytime; returning users never see it.
Commit: "WC-3c: 90-second first-run delight onboarding".
```

### Prompt WC-3d — push-notification retention loop
```
Goal: streak-at-risk + daily-goal reminders via your existing email/cron infra and
PWA push. Respect the comms opt-in already modeled in data.js DEF and add quiet hours.

Steps:
- Trigger conditions: streak at risk (no qualifying activity today by evening) and
  optional daily-goal-not-met nudge.
- Route through the existing cron tracks / email plumbing; add PWA push where a
  subscription exists. Strictly gate on the existing opt-in; opt-out = fully silent.
- Add a quiet-hours window (no sends overnight, user-local).
- If a new Supabase table is needed (push subscriptions), use _TEMPLATE.sql with
  RLS + GRANTs and run scripts/check-migrations.sh.

Acceptance: opt-in users get a streak-at-risk nudge outside quiet hours; opt-out
users get nothing; any new table passes check-migrations.sh.
Commit: "WC-3d: streak-at-risk + daily-goal retention notifications".
```

### Prompt WC-3e — finish the index.html diet
```
Goal: continue WC-1f until app/index.html is under ~12,000 lines and the truncation
failure mode is structurally gone.

Same rules as WC-1f: one self-contained block per commit (largest first); pure
extraction, no restyling; index-html-guardian after each; visual spot-check dark +
light; refresh the CLAUDE.md line-count figure in the same commit.

Acceptance: shell < ~12k lines; guardian PASS throughout; CLAUDE.md figures current.
Commit per block: "WC-3e: extract <block> (-N lines)".
```

---

## How to drive this
1. Start each session with the preamble at the top.
2. Run prompts in order within a sprint; let each finish + commit before the next.
3. For **[PERMISSION-GATED]** prompts (WC-1d Well, WC-3a Watch), tell Claude Code explicitly "proceed" first.
4. Provide `ylcc-aplus-showcase.html` to Claude Code when running WC-1c, WC-1d, WC-2b (it's the visual reference + liftable code).
5. After Sprint 1, re-run your baseline metrics into `docs/perf-baseline.md` to prove the win.
