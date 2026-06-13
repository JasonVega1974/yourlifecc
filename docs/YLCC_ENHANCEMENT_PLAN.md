# YourLife CC — Full Enhancement Plan (World-Class Track)
**Companion to:** `YLCC_WORLD_CLASS_AUDIT.md` and `ylcc-aplus-showcase.html`
**Goal:** Close the gap from A− to "no one can compare" in three sprints, without violating any standing rule in `CLAUDE.md`.
**Phase IDs:** `WC-*` (World-Class track) — deliberately distinct from your internal Phase 0–6 so nothing collides.

> **Read this first — guardrails that apply to every task below.**
> - `node --check` every touched JS module before commit.
> - After **any** `app/index.html` edit, run the **index-html-guardian** agent. If FAIL, restore the tail before any further edits.
> - **Light mode ships with the feature** — every visual change includes its `:root.light` pass in the same commit.
> - Deploy = `git add <specific files>` + `git commit` + `git push` from Claude Code bash. No GitHub web UI. No `--force`.
> - Bump `CACHE_NAME` in `service-worker.js` only on deploys that ship new asset URLs.
> - ASCII straight quotes only. Domain `https://yourlifecc.com`. Contact `info@kingdom-creatives.com`.
> - **Never touch `faith.js`, The Well faith-only hero, or faith content without explicit permission.** The lazy-load work below is engineered specifically to avoid editing `faith.js` (wrapper pattern, like `streaks.js`).
> - For any significant visual phase: run **ux-visual-reviewer** before and after.

---

## SPRINT 0 — Safety net (½ day, do once)
Cheap insurance before touching a 21k-line shell.

- **WC-0.1** Branch: `git checkout -b world-class-track`. All WC work lands here, merged to default per phase.
- **WC-0.2** Baseline metrics. Record current cold-load numbers (Lighthouse mobile, or DevTools: total JS transferred, Time-to-Interactive) so you can prove the perf win. Save to `docs/perf-baseline.md`.
- **WC-0.3** Confirm the escape hatches still work: `?ylcc_classic_phc=1` (The Watch), `window._ccDisabled` (command center). These are your one-flag rollbacks.

**Acceptance:** branch exists, baseline saved, both rollback flags verified.

---

## SPRINT 1 — "Faster & unmistakably premium" (the credibility sprint)

### WC-1a · `defer` on all module scripts  *(perf, near-zero risk)*
The ~50 module `<script>` tags sit at `app/index.html` lines ~20194–20365, all classic, none deferred. Adding `defer` lets them download in parallel during parse and execute **in original order** after DOMContentLoaded — same order contract, faster TTI.

- Add `defer` to every `<script src="/app/js/...">` tag **and** the CDN libs that your modules depend on at load (supabase-js, chart.js, sortablejs, leaflet) — but keep their relative order so dependencies still resolve.
- Do **not** defer the inline tail `<script>` block that defines `tick()`/`setInterval(tick)` or the Google Translate tag.
- **Risk note:** `defer` preserves execution order for classic scripts, so the fragile load-order contract is honored. The one thing to watch: any inline `<script>` that calls a module global must run *after* the deferred modules — inline non-deferred scripts run during parse, before deferred ones. Audit for inline scripts that call module globals at parse time; if found, wrap them in `DOMContentLoaded`.

**Acceptance:** app boots identically; DevTools shows modules downloading in parallel; TTI improves vs. baseline; index-html-guardian PASS.

### WC-1b · Lazy-load the heavy faith **data** files  *(perf, the headline win)*
~3.5 MB of pure-data files (`bible-stories.js` 1.2 MB → `window.BIBLE_STORIES`; `plans.js` 1.1 MB → `FAITH_PLANS`; `proof-prophecy.js` 236 KB → `PROOF_PROPHECY_DATA`; `academy-lessons.js` 196 KB → `ACADEMY_LESSONS`) download on **every** cold visit even for users who never open faith. They're referenced **only inside `faith.js` render functions**, never at `finishInit` — so they can load on demand.

**Engineered to avoid editing `faith.js`:**
1. New module `app/js/lazy-data.js` exporting `ensureData(globalName, src)` → returns a cached Promise that injects the `<script>` once and resolves when the global is present.
2. In `lazy-data.js`, **wrap** the navigation entry points that lead into faith sub-sections (the `showSection` hook and/or the faith-tab routers — same wrap pattern `streaks.js` uses). Before the original render runs, `await ensureData(...)` for that section's data file and paint a lightweight skeleton in the meantime.
3. Remove the four eager `<script>` tags for those data files from `index.html`.
4. Add `lazy-data.js` to the script block **after** `faith.js`/`init.js` so it can wrap their globals.

- **Do NOT lazy-load `faith.js` itself** (fragile load order, and it's off-limits without permission). Only the leaf data files move.
- **Verify per file** before removing its eager tag: grep that no code path references the global during `finishInit`. (Confirmed clean for all four as of this plan, but re-verify — the file grows.)
- Service worker: ensure the on-demand data URLs are still cache-first so they're instant on repeat visits. Bump `CACHE_NAME`.

**Acceptance:** cold JS transfer drops ~3.5 MB for a non-faith session; faith sections still render (now with a brief skeleton on first open); SW caches data files after first load; guardian PASS.

### WC-1c · Constellation rework — kill the 6-color violation  *(design)*
`command-center.js` paints six destination accent colors on one surface — the exact "classic violation" named in `visual-design/SKILL.md`. Replace with **one brass star language**; spend color only on today's focus node (one accent) and brighten its two adjacent links. Working reference: the **Constellation tab** in `ylcc-aplus-showcase.html` (liftable SVG-builder + focus/reveal/press logic).

- Keep `constellation-kit.js` primitives (magnitude tiers, spikes, breathing, count badge).
- Drop the per-domain `accent` on `_CC_NODES`; pass brass to `ckBuildStar`; compute focus from the existing "today's focus" logic.
- Light-mode pass: dark ink star language on paper for light theme.
- Run ux-visual-reviewer before/after.

**Acceptance:** one base + one accent on the surface; focus node + its links read clearly; light mode correct; guardian PASS.

### WC-1d · The Well portal v2  *(scene — REQUIRES EXPLICIT GO-AHEAD)*
The "Enter the Well" gate (`index.html` ~7595–7900) is tasteful but flat. v2 adds depth (sky→water gradient), rising embers, a reflected shimmer pool, pointer parallax, and a breathing cross. Working reference: **The Well · v2** tab in the showcase (canvas renderer is liftable wholesale).

- **This is "The Well" → confirm before building.** The gate markup lives in `index.html`, not `faith.js`, but it is still The Well surface; treat it as permission-gated.
- Keep one-tap dismiss, the `_faithFree` bail, the page-load-only seen flag, and the reduced-motion still-frame path.
- Scene layer = hardcoded hex (no dark-mode inversion); no light-mode invert needed for the scene itself, but verify the gate doesn't leak into light UI.

**Acceptance:** descent/depth reads; reduced-motion still-frame intact; dismiss + faith-free bail unchanged; guardian PASS.

### WC-1e · Real OG share card  *(marketing)*
Marketing OG image is the 512px app icon. Ship a 1200×630 card (`/app/img/og-card.png` or an SVG→PNG) and update `og:image`, `og:image:width/height`, `twitter:image` in the root `index.html` (and ideally the other marketing pages). Title lockup + one-line value prop + brand mark.

**Acceptance:** link unfurls with a real card in iMessage/Slack/X preview tools.

### WC-1f · Begin extracting `index.html`  *(architecture — removes truncation risk)*
Start shrinking the 21,394-line shell by moving the largest inline `<style>` blocks to `app/css/` partials and the biggest static `<section>` templates to JS-rendered fragments. Target trajectory: under ~12k lines over Sprint 1–2.

- Move the Well-gate `<style>` block (and similar self-contained blocks) into `app/css/`.
- After **each** extraction: guardian PASS + `node --check` + visual diff. One block per commit.
- Refresh the line-count figure in `CLAUDE.md` in the same commit (standing rule).

**Acceptance:** line count drops materially; guardian PASS each step; no visual regressions.

---

## SPRINT 2 — "The game loop" (the retention sprint)
The single highest-ROI "fun" work. Today progress is siloed: `streaks.js` (faith), `traits.js` (`TRAIT_THRESHOLDS`), and per-domain badge ratchets in `health/goals/chores`. Unify into one currency, one ring, one streak, one league — Duolingo's actual moat. Working reference: **Engagement loop** tab in the showcase.

### WC-2a · One XP currency
- Add to `DEF` in `data.js`: `xpTotal:0`, `xpToday:0`, `xpDayKey:null`, `xpLog:[]` (capped), `dailyGoal:30`. Phase-comment each per convention.
- New module `app/js/xp.js`: `awardXP(n, source)` — increments today/total, rolls `xpToday` on day change, appends to `xpLog`, calls `save()`, fires the juice (WC-2c).
- **Funnel existing completions** via the wrapper pattern (do not rewrite feature modules invasively): wrap the same completion entry points `streaks.js` already hooks (`markDevotionalRead`, academy lesson complete) plus chore-complete, goal-step, lesson-finish. Keep all existing per-domain badges untouched — XP is *additive*.

**Acceptance:** any completion anywhere bumps one `xpTotal`/`xpToday`; existing badges still award; survives reload + cloud sync.

### WC-2b · Daily-goal ring + unified streak flame (home)
- Add the ring + flame + total to the child home (`command-center.js` / `app-home.js`) and a compact version to the Parent Hub.
- Ring fills to `dailyGoal`; flame shows the unified streak. Wire the existing `streakSkip`/freeze state in `data.js` to the unified streak (one streak, not per-feature).
- Interface layer: flat, 2–3 colors, tokens, 400/500 weights, rounded displayed numbers. Light-mode pass.

**Acceptance:** ring + flame + total render and update live on completion; reduced-motion respected; light mode correct.

### WC-2c · The juice layer
- XP-burst "+N" with overshoot-and-settle at the tap point; ring/number scale-bump; reuse `celebrations.js` confetti on daily-goal hit and streak milestones.
- All animations honor `prefers-reduced-motion` (instant state change, no motion).

**Acceptance:** completions *feel* good; reduced-motion path is a clean instant update.

### WC-2d · Weekly family league
- You already have leaderboard refs across modules. Add a weekly league view: siblings (from `_profiles`) ranked by week XP, reset weekly (ISO week key).
- Phase 2 of league (cross-family) is optional and needs a Supabase table — if built, use `docs/migrations/_TEMPLATE.sql` with explicit GRANTs and run `scripts/check-migrations.sh`.

**Acceptance:** weekly sibling ranking renders and resets on ISO-week rollover; any new table has RLS + GRANTs.

---

## SPRINT 3 — "No one can compare" (the moat sprint)

### WC-3a · The Watch goes diegetic  *(scene — REQUIRES GO-AHEAD, touches Watch only)*
`parent-watch-scene.js` paints a beautiful but ambient sky. Make it *informative*: farmhouse windows light when a child has activity today; the "hot" item becomes the single brightest lantern. Turns ambient beauty into at-a-glance family status — the differentiator no competitor has. Keep the `?ylcc_classic_phc=1` escape hatch and reduced-motion path.

**Acceptance:** lit windows map to live kid activity; one hot lantern; escape hatch + reduced-motion intact; guardian PASS if index.html touched.

### WC-3b · Finish PIN security
`auth.js` (~703–805) still carries a legacy plaintext-PIN fallback (migrate-on-verify). Add a one-time **background** migration on sign-in that hashes any remaining plaintext PIN without waiting for a verify event, then remove the fallback branch in a follow-up release. Run security-auditor.

**Acceptance:** no plaintext PIN persists after first authenticated session; security-auditor clean.

### WC-3c · 90-second delight onboarding
First-run flow that demos the ring + streak + a single quick win **before** asking for anything heavy. Duolingo converts in session one. Keep it skippable; respect reduced-motion.

**Acceptance:** new account sees a guided first win; skippable; no regression to existing onboarding gates.

### WC-3d · Push-notification retention loop
You've already identified push as the retention gap. Wire streak-at-risk + daily-goal reminders to your existing email/cron infra and PWA push. Quiet hours + opt-in respected (you already model comms opt-in in `DEF`).

**Acceptance:** opt-in users get a streak-at-risk nudge; opt-out fully silent; quiet hours honored.

### WC-3e · Finish the `index.html` diet
Continue WC-1f until the shell is under ~12k lines and the truncation failure mode is structurally gone (not just guarded). Refresh `CLAUDE.md` figures.

**Acceptance:** shell < ~12k lines; guardian PASS throughout; CLAUDE.md current.

---

## Sequencing & dependencies
- WC-1a → WC-1b (defer first, then lazy-load; both are perf and 1b assumes ordered execution).
- WC-2a is a prerequisite for WC-2b/2c/2d.
- WC-1d and WC-3a are **permission-gated** (Well / Watch) — get the go-ahead, then build.
- Everything else is independent and parallelizable.

## Definition of done (every phase)
1. `node --check` clean on all touched modules.
2. index-html-guardian PASS if `index.html` touched.
3. Light-mode pass shipped in the same commit for any visual feature.
4. Reduced-motion path present for any animation.
5. Targeted `git add` → commit → push from CC bash; `CACHE_NAME` bumped if new asset URLs shipped.
6. For visual phases: ux-visual-reviewer captured before & after.
