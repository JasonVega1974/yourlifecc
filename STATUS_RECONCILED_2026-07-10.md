# STATUS_RECONCILED — 2026-07-10

**Read-only reconciliation.** No `/app/` edits, no SQL, no commits made to produce this. Every "shipped" claim below carries a commit hash. **No hash = not shipped.** "A file exists" is *not* "shipped" — each SHIPPED item was verified wired into the live app (referenced from `app/index.html` / a loaded module) and reachable, not merely present on disk or in a standalone preview.

**Why this doc exists:** the scattered status/plan docs drifted — several describe planned work as shipped, and at least one (`CLIMB_INTEGRATION.md`) describes shipped work as still-pending. Last session five premises were treated as settled that were not. This doc is the single source of truth as of 2026-07-10; where it and any older doc disagree, this doc wins.

**Ground-truth anchors verified this pass:**
- **service-worker.js `CACHE_NAME` = `yourlifecc-v521`** at reconciliation time; **bumped to `v522` with Dig Mode (Build 1)** below. Older docs cite v228 / v6 / v337 — all stale.
- **Phase 0 recon = DONE**, findings preserved verbatim in `docs/MAINAPP_PHASE0_AUDIT.md` (committed `a3c812d`, dated 2026-07-09).
- **Dig Mode = SHIPPED** `c57c45c` (Build 1, 2026-07-10) — spec `docs/DIG_MODE_PASSPORT_SPEC.md`. Was PLANNED at reconciliation; built same day.
- **Expedition Passport = SHIPPED** `22fdc29` (Build 2, 2026-07-10, SW v523). Was PLANNED at reconciliation; built same day. Both builds of the spec are complete.

---

## RECLASSIFICATION — the five premises from last session

| # | Premise (as treated last session) | Actual verdict | Evidence |
|---|---|---|---|
| 1 | "Phase 3 juice" (uncertain / to-rebuild) | **SHIPPED** — the layer is built, wired, and called. There is no "Phase 3" label; it's WC-2c + WC-D1/D2/D3. | `xp.js`/`xp-juice.js` `3ea5231`; `sfx.js` `fb08762`; `haptics.js` `230f2f9`; `exercise-engine.js` `8661820`. All in the `<script defer>` block + SW precache; `awardXP`/`sfx`/`haptics`/`exerciseEngine` invoked from other modules. **Caveat: distribution is PARTIAL — see PARTIAL §.** |
| 2 | "XP-ring regressions" (ring broken) | **SHIPPED** — ring is live and functional. The "regression" was a palette drift (off-list gold), already re-cut. | Ring UI `.cc-ring` (`index.html:1168`) + `.pch-xpring` (`index.html:18181`), added `3ea5231`. Gold→amber fix in `ec02b01` (phase 1d) / `8418401` (phase 1e). Fill now `#f59e0b`, turns green on goal met. |
| 3 | "Swipeable deck" (unbuilt / unverified) | **SHIPPED** — and there are two swipe decks. | `skeptic-debates.js` `597dabf`; `skepticOpen()` wired to a live button (`index.html:14096`) with real touch-swipe judging. Second "Convince Me" swipe deck also present (`ppOpenConvince()`, `index.html:14094`). |
| 4 | "Scholarship level gate" (a shipped gated feature) | **PLANNED / nonexistent** — no such gated feature. Static scholarship *content* ships; there is no XP/level gate. | `scholarship:{pct,avg,note}` objects in `sports.js` are static info for 14 sports. "Level" = grade level, not a gamification tier. No `unlock`/`locked`/`gate` keyed on XP. `sports-fx.js` only count-up-animates the figure on scroll-into-view. |
| 5 | "Dig Mode verified" | **Was PLANNED** at reconciliation (zero code, no spec) → **now SHIPPED** `c57c45c` (Build 1, 2026-07-10). Expedition Passport still PLANNED. | At reconciliation, `grep -riE "dig mode\|expedition passport"` → nothing. Since built to spec `docs/DIG_MODE_PASSPORT_SPEC.md` as real excavation gameplay (`bible-world-dig.js`). |

**Net:** three premises were shipped-and-doubted; two were planned-and-assumed-done. Both directions of drift.

---

## SHIPPED — code exists, wired into the live app, verified reachable (with commit hash)

### Engagement / game loop (the "juice" stack)
- **`awardXP` unified XP writer** — `xp.js` (`3ea5231`, WC-2a/2b). Rollover, daily goal, xpToday/xpTotal/xpLog. Fires juice meta at end.
- **XP juice toast** — `xp-juice.js` `window.xpJuice` (`3ea5231`, WC-2c).
- **XP ring + streak flame** — `.cc-ring` / `.pch-xpring` (`3ea5231`); palette re-cut off-child-gold (`ec02b01`/`8418401`).
- **Interactive exercise engine** — `exercise-engine.js` (`8661820`, WC-D1). Multiple question types, kind-fail feedback.
- **Sound-effects layer** — `sfx.js` `window.sfx`, Web-Audio (`fb08762`, WC-D2).
- **Haptics layer** — `haptics.js` `window.haptics` + `D.hapticsEnabled` Settings toggle (`230f2f9`, WC-D3).
- **Celebrations + traits** — `celebrations.js`, `traits.js` (gamification foundation, pre-existing; live).
- **Daily Spark** — once-per-day engagement card, both apps (`a3c812d`, hardening `bed64e3`/`2d4fd93`).

### Home surfaces
- **Command Center hero home** — `command-center.js` + `constellation-kit.js`. Constellation hero is the **live** home surface by default for full-app + child accounts (origin `d616d5e`; art `b09ffca`; photo-card chooser `2fc6d65`). Rollback is console-only `window._ccDisabled=true`. (ux-visual-reviewer graded it C+ — live but not yet at the faith-home quality bar.)

### Sports (content + visual build)
- **Explore Power-Card grid** `82f92be`; **detail sheet** `9f6d409`; **"Find your sport" finder** `2954bd8`; **Phase 3 deep sheets, all 16 sports** `a4af8a3`/`d4deb38`/`2267b69`; **My Sports athlete-page tracker + owner-guard leak fix** `f25e90a`/`7dc9b80`/`07bb722`/`f7ead25`; **Phase V shared visual layer across all 16 sports** `098af50`/`02e0a00`; **"Beyond the Game" honest-odds funnel** `f412873`. Section `s-sports` is reachable via normal nav (not flag-gated).

### Swipe decks (faith / proof surfaces)
- **Skeptic vs Evidence** swipe deck — `skeptic-debates.js` `597dabf`.
- **Convince Me** swipe deck — `ppOpenConvince()` (Proof & Prophecy area).

### Biblical Archaeology — Dig Mode + Expedition Passport
- **Dig Mode** (Build 1) — `bible-world-dig.js` `c57c45c` (2026-07-10, SW v522). Scratch-to-excavate over the discoveries grid: buried cards → canvas scratch (40/70/95% reveal) → gold EXCAVATED stamp; persists in `D.faithBibleWorld.excavated`; reduced-motion tap path; `sfx.stamp`. Smoke: 21/21 headless assertions.
- **Expedition Passport** (Build 2) — `22fdc29` (2026-07-10, SW v523). 4th Bible World view: 32 stamp slots × 5 regions, era-color stamps, seeded rotation; auto-stamp on excavation (caesarea guard); region badges + gold medals; all-32 Master Archaeologist canvas certificate (share/download). Smoke: 27/27 headless assertions.
- Both monkeypatch `faith.js` (untouched). Spec `docs/DIG_MODE_PASSPORT_SPEC.md`.

### Main-app world-class transformation (post-Phase-0 remediation)
- **Phase 0 recon audit** (4 parallel read-only audits, findings preserved) — `docs/MAINAPP_PHASE0_AUDIT.md`, committed `a3c812d`.
- **6 shipped-but-broken bugs fixed** (Phase 1a) — `a327726` (quiz modal, `academyMarkLesson`, FAQ toggler, sync-status honesty, bio exports, dead typing pane).
- **De-violet / color register pass** — `f2ba427` (1b), Oswald swap `367d32c` (1c), light-mode + gold-off-child + reduced-motion `ec02b01` (1d), UX-review fix pass `8418401` (1e).
- **Unified back model + flow fixes** (Phase 2) — `a03ebbc`; onboarding tab-bar fix `67ead9b`; milestone namespace fix `2a19f5e`.

### Faith stack (representative recent, all live)
- **Man's Questions, God's Answers** `a2b403c` + world-class pass `67c26e8`; **app-wide de-purple sweep** `993a753`/`385909d`; **archaeology gold-pin/era-rail pass** `8dfa70d`; **My Walk with God pathway** (per project memory `[[project_walk_with_god_pathway]]`, `walk-path.js`, live on main).

### Earlier shipped baselines (carried, previously verified)
- **Security rework** Phase 0/1/1.1 + hardening — live 2026-04-28 (`docs/roadmap.md`).
- **F6 Stripe-webhook splice** (faith_free guard + donation router) — live & verified 2026-05-14 (`docs/roadmap.md`).
- **Habits tab** (6 sub-tabs) — live (`MASTERPLAN_RECONCILED.md` 2026-06-04; carried, not re-verified this pass).

---

## PARTIAL — some code exists, not complete or not fully reachable

- **My Climb (Road to Adulthood)** — fully built AND wired: `life-path.js` + `data/life-stations-data.js` in the script block, `lifePath:{}` in DEF (`data.js:175`), live Command Center doorway `ccOpenClimb()` → `renderLifePath('lifePathWrap')`, featured MY CLIMB card. Commits `33c2ff0` (dark-launch files) + `39344d0` (CC doorway, 2026-07-03). **Why PARTIAL:** the only in-app entry point is inside the Command Center, which paints only when `ylcc_entry_gate === '1'` (**default OFF**, `index.html:729`). With the flag off, the engine is dormant — no production user reaches it. **Also a functional gap:** 9 of 12 `LIFE_QUESTS_POOL` weekly quests can never progress (metrics never bumped) — flagged in Phase 0 Audit C/D. *(Note: `CLIMB_INTEGRATION.md` still describes install + child-home entry as pending TODOs — it is stale/understated; that work is done, behind the flag.)*
- **Flat-nav home reorganization** — dark-launched behind `ylcc_entry_gate` (default OFF). The Command Center *hero* is live regardless; the flag additionally turns the CC into whole-app navigation (sidebar hidden, section grids). Restore commit `44d21cd`; Home Shortcuts `b2ebc7d`; Life jump-in `2b4c202`.
- **Juice distribution** — the primitives are shipped (see SHIPPED), but calls are faith/lesson-heavy. `awardXP` callers: `faith.js`, `faith-zones.js`, `life-path.js`, `walk-path.js` only. **Zero `awardXP`/`sfx`/`haptics` in sports, school, chores, goals, habits, skills.** (HOME_UPGRADE_PLAN.md §0 already caught this: "school and sports have zero juice and zero XP.")
- **Sports game-loop integration** — content/visual build shipped (see SHIPPED); the XP/juice wiring is **not** built. `sports.js` has zero `awardXP`/`sfx`/`haptics`/`xpJuice` calls.
- **8-tab masterplan status** *(carried from `MASTERPLAN_RECONCILED.md` 2026-06-04 — NOT re-verified this pass; treat as approximate)*: **DONE** Habits · **PARTIAL** Money, Goals, Schedule, Skills, Parent Hub · **NOT STARTED** Chores, CBT Training. Storage buckets 0 of 5. Re-verify before building on these.

---

## PLANNED — decided/mentioned, zero code exists

_(Both `docs/DIG_MODE_PASSPORT_SPEC.md` builds — Dig Mode `c57c45c` and Expedition Passport `22fdc29` — have shipped; see SHIPPED §.)_
- **Scholarship level gate** — no gated feature exists. Static scholarship content ships; an XP/level-gated reveal is unbuilt.
- **Mascot (WC-D4)** — `grep mascot` hits docs only. `YLCC_DELIGHT_PHASE.md` itself scopes it as a "decision spike, not a build." Zero code.
- **Juice rollout to non-faith surfaces** — the intended distribution of the shipped juice layer into sports/school/chores/goals/habits/skills.
- **5 Supabase Storage buckets** (`chore-proofs`, `goal-images`, `legacy-vault`, `cbt-thumbnails`, `skill-evidence`) — 0 of 5 exist (`MASTERPLAN_RECONCILED.md` §3; carried).
- **Remaining masterplan tab upgrades** — Chores 5 sub-tabs, Skills Legacy Vault (Lifetime anchor), Money Allowance/Learn, Schedule real recurrence, Parent Hub Approvals/Messages/Dashboard, etc. (`MASTERPLAN_RECONCILED.md` §6; carried, unbuilt.)

---

## Doc-hygiene follow-ups (not done here — flagged only)

Highest-drift docs to treat with suspicion until re-verified against this doc:
- `CLIMB_INTEGRATION.md` — **understates** (says My Climb install/entry is pending; it's done behind a flag).
- `COMMAND_CENTER_PLAN.md` (2026-06-04) — says "Phase 3 not started"; the Constellation CC has since shipped.
- `STATUS_REPORT.md` (2026-06-04), `AUDIT_REPORT.md` (2026-05-22), `MASTERPLAN_RECONCILED.md` (2026-06-04) — dated snapshots read as present tense but are weeks stale (e.g. STATUS_REPORT cites SW "v228"; actual v521).
- `sports-world-class-roadmap.md`, `FAITH_SURFACES_WAVE3_SPEC.md`, `F0-followups.md` — carry per-item "shipped" tags that need re-verification.

Pure forward specs/prompts (FAITH_EXPANSION_SPEC, AUDIO/AI/ENGAGEMENT specs, `*_PROMPT` files) don't claim shipped status — lower drift risk, though several describe features that have since shipped.

---

*End of reconciliation. No code, SQL, or commits produced by this pass.*
