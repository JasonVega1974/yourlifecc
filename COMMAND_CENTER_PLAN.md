> **⚠️ STALE (2026-06-04).** The "Phase 3 not started" status below is wrong as of 2026-07-10 — the Constellation Command Center **shipped** and is the live home hero by default (origin `d616d5e`, chooser `2fc6d65`). The whole-app flat-nav reorg remains behind `ylcc_entry_gate` (default OFF). See **`STATUS_RECONCILED_2026-07-10.md`**.

# YourLife Command Center — Plan

**Status:** Phases 1 & 2 complete. Phase 3 (build) not started. Waiting on concept pick.
**Last updated:** 2026-06-04
**Author:** Claude Code (Opus 4.7, 1M context) — read-only investigation, no code modified
**Scope:** Discovery + routing + data inventory for a new "Command Center" home for full-app accounts. The faith-only "Enter The Well" experience is out of scope and must not be regressed.

---

## Phase 1 — Discovery & Routing

### Q1. What actually renders as the home for a full-app account, and by what mechanism?

For `faith_only = false` (e.g. `jason.vega07@yahoo.com`), the surface that **actually paints** at `/app/` is `#appHome` — a greeting chip + a Daily Briefing card + 6 destination buttons. Not the cinematic Well. The Well code path is gated and never executes for full accounts. The trace:

| # | Stage | File:line | Behavior for `faith_only=false` |
|---|---|---|---|
| 1 | Early-paint plan hint (in `<head>`) | `app/index.html:51-56` | Reads `localStorage.ylcc_plan_hint`. The key is *removed* by `auth.js:373` for non-faith-free users, so no `data-faith-free` attribute is set on `<html>`. |
| 2 | Plan-status check after sign-in | `app/js/auth.js:327-396` | Queries `profiles.plan_status`. Sets `window._faithFree = (status === 'faith_free')` at `auth.js:368` → **`false`** for `active` / `trialing` / `free_contest`. Mirrors onto `D.faithOnly` at `auth.js:377`. |
| 3 | Boot landing | `app/js/init.js:345-360` | `_defaultLanding = 's-hero'` (unchanged for solo/fresh/child accounts). My Phase-0 fix re-routes only when `_hasChildren && !_activeIsChild && !_isSoloBoot && !_faithFree` → `s-parent`. |
| 4 | `showSection('s-hero')` | `app/js/init.js:361` → `app/js/ui.js:1711` | Activates `#s-hero` via `.sec.active{display:block}` (`app/css/app.css:185-186`). |
| 5a | Cinematic Well container | `app/index.html:1059` | `<div id="faithHeroCinematic" style="display:none;"></div>` — empty in HTML. |
| 5b | Cinematic Well populator | `app/js/init.js:1356-1640` | `renderFaithOnlyHero()` populates `#faithHeroCinematic`. **Only invoked when `window._faithFree === true`** (gate at `init.js:1649` inside `renderHeroHeadline()`). For a full account, this function never runs → `#faithHeroCinematic` stays empty and `display:none`. |
| 5c | Simplified home (`#appHome`) | `app/index.html:1075-1191` | Static HTML: `#appGreeting` (filled by `renderAppGreeting`), Daily Briefing wrap, `.today-growth-card`, and a 6-button `#appMenu` (Habits / Chores / Goals / Money / Skills / ✝️ The Well). |
| 5d | `#appHome` gating | `app/js/app-home.js:116-126` `maybeRenderAppHome()` | Hides `#appHome` if body has `parent-view` OR `window._faithFree`. For a full account with no child profiles (post-Phase-0 fix), neither is true → `#appHome` is visible and populated. |
| 5e | Legacy hero wrap | `app/index.html:1205` | `<div id="appLegacyHero" style="display:none;" aria-hidden="true">` — permanently hidden. Houses the older `#heroQuickActions` / `#heroQuickStats` / `#heroHeadline` / `#childDashContent` / `#heroMonthlyChallenge` / `#heroBadges` / `#devMap`. Render functions still write to those IDs (no-op against hidden DOM). |
| 6 | Deferred re-renders | `app/js/app-home.js:144-149` | `maybeRenderAppHome` re-fires at 600 / 1800 / 4000 ms to catch async-set `parent-view` / `_faithFree`. |

**Net visible surface for a full-app account today:** `#appHome` — *the simplified 6-button home*, not the cinematic Well.

---

### Q2. Why does this feel like "the Well" even though the cinematic Well is gated off?

**Cause:** **(c) something else.** Neither a `_faithFree` flag bug (the gate at `init.js:1649` works correctly), nor a hardcoded Well default (the cinematic Well only renders when explicitly gated true). Evidence:

- `auth.js:368` is the only writer of `window._faithFree`. Source is `plan_status === 'faith_free'`. For `jason.vega07@yahoo.com`, `plan_status` is one of `active|trialing|free_contest|null` — all yield `false`.
- `renderFaithOnlyHero()` is the only function that populates `#faithHeroCinematic`. Its only callsite at `init.js:1649` is inside `if(window._faithFree){ … return; }`. Untriggered for full accounts.

The real reason the **full home doesn't feel like its own identity** is that `#appHome` is **a visual clone of the faith Well's simplified home (`#fzHome`)**:

- `#appHome`'s 6 menu buttons use `.fz-menu-btn` — a class defined inside the `#s-scripture` style block at `app/index.html:6147` and used by the faith home.
- Greeting + streak chip use `.fz-greet-row` / `.fz-greet-hi` / `.fz-greet-sub` / `.fz-streak` — same block, `index.html:6094-6135`.
- The Well destination button has its own emphasis class `.fz-menu-btn-heart` (`index.html:6743`).
- This is **explicit** — the dev comment at `index.html:1004-1008` reads:
  > *"Reuses the faith home's `.fz-menu-btn` / `.fz-greet-*` / `.fz-streak` classes (those are document-scoped from the `#s-scripture` style block so they apply globally). Only adds the `#appHome` container, the menu label, and the desktop grid breakpoints."*
- One of the 6 destination buttons is literally labeled **"✝️ The Well"** (`index.html:1182-1189`).

Add to that: there is **no signature animated centerpiece** for the full-app home. The Daily Briefing card (`#dailyBriefingCard`, `index.html:1083`) is a static informational tile. The `.today-growth-card` (`index.html:1137`) is a small status block. There is no canvas / SVG / WebGL hero comparable to the Well's cinematic.

So the user's "full app currently lands on the Well" perception decomposes into two true statements:
1. The full home looks like a faith-Well-derivative because it visually inherits every class from the Well's simplified home.
2. The full home has no distinct hero identity at all — there's no Command Center, just a label.

**Important corollary for Phase 3:** the cinematic Well code is dead for full accounts. There is **no regression risk** to the faith Well from anything done inside `#appHome` / `app-home.js` / a new sibling container — provided the `_faithFree` gates at `init.js:1649` and `app-home.js:121` are left alone.

---

### Q3. Where is the home-surface decision made, and what's the minimal routing change?

Three decision points govern what fills `#s-hero`:

| # | File:line | Decision |
|---|---|---|
| A | `app/js/init.js:345-361` | What section to land on (`s-hero` vs `s-parent`). Routing — *not* about hero content. |
| B | `app/js/init.js:1648-1649` | `renderHeroHeadline()` short-circuits to `renderFaithOnlyHero()` if `_faithFree`. The Well-vs-not seam. |
| C | `app/js/app-home.js:116-126` `maybeRenderAppHome()` | What paints into `#appHome`. Currently hides for `parent-view` or `_faithFree`, otherwise renders greeting + delegates Daily Briefing + delegates `renderDailyGrowth()`. The only writer of the visible full-account home today. |

**Minimal routing change (proposed — not implemented in Phase 1):**

The cleanest seam is **C**. `maybeRenderAppHome()` is the single function that already gates "full-account home rendering" and runs at first paint + 600 ms + 1.8 s + 4 s + on `visibilitychange`. It is the only function whose body decides "what does a full-app user actually see at `/app/`."

Two viable shapes for the Phase 3 change:

| Option | Change | Pro | Con |
|---|---|---|---|
| **C1 (recommended)** | Add a new sibling container `<div id="appCommandCenter">` inside `#s-hero` next to `#appHome`. `maybeRenderAppHome` becomes a chooser: faith-free → bail (Well handles it); parent-view → bail (parent-routing handles it); else → render Command Center into `#appCommandCenter` and leave `#appHome` hidden as a fallback. | One-flag rollback (`window._cc_off = true` → hide `#appCommandCenter`, re-show `#appHome`). Zero changes to the Well path. Zero changes to routing. The old simplified home stays in the DOM as escape hatch during the build. | Adds one DOM container. |
| **C2** | Replace `#appHome`'s inner markup entirely with the Command Center. | Simpler DOM. | No rollback target. Mixes the simplified home and the Command Center in the same module — harder to debug visual regressions. |

**Recommendation: C1.** It honors the "additive, parallel surface, gated by account tier" hard rule in the spec, makes the Well untouchable by construction, and gives one-flag rollback during a real-account rollout.

**Routing gates that stay exactly as-is:**

- `auth.js:368` (the `_faithFree` writer).
- `init.js:1649` (the Well/non-Well seam in `renderHeroHeadline`).
- `init.js:1356-1640` (`renderFaithOnlyHero()` + the SVG/canvas Well scene).
- `init.js:1356-360` (parent-routing branch from Phase 0).
- `app-home.js:121` (the `_faithFree` early-bail check).

**No edits made in Phase 1.**

---

### Q4. Data inventory — what can a Command Center surface today?

#### Live state already available on `D.*` (cloud-synced via `profiles.data` JSONB)

| Domain | Field | Source | Suitable for |
|---|---|---|---|
| Streak (aggregate) | `D.streak`, `D.lastCheckin` | `ui.js:417` | Big number / flame chip |
| Streak (faith-aware, forgiveness logic) | `getScriptureStreak()` | `streaks.js`, syncs to `user_streaks` table | Big number with forgiveness rules |
| Streak (per-habit) | `D.habitsV2[].streak`, `.longest_streak` | `habits.js:204-238` | Per-habit ring / heatmap |
| Daily growth (traits) | `D.dailyTraits[today]`, `D.dailyTraitsHistory` | `traits.js` | "Today you grew in X" |
| Chore points | `D.chorePoints.total`, `.spent` | `chores.js` | Earnings / available balance |
| Parent Bucks | `D.pb.balance`, `.spinTickets`, `.scratchTickets` | `chores.js` / `parent.js` | Mini-economy chip |
| Savings | `D.bank`, `D.bankSavAcct`, `D.earnings.balance`, `D.savingsGoals[]` | `finance.js` / `chores.js` | Money summary tile |
| Goals (active) | `D.goals[]` filter `!g.done` | `goals.js` | "What you're building toward" tile |
| Goal milestones | per-goal `g.milestones[]` + top-level `D.milestones[]` | `goals.js` | Progress ring |
| Habit check-off (today) | `D.checkin[toDateString]` | `ui.js:368-422` | Daily-W's tiles (Daily Briefing already uses this) |
| Events / schedule (today, upcoming) | `D.events[]`, `D.schedule{}` | `school.js` | "Next up" rail |
| Skill certs | `D.skillCerts{}` | `skills.js` | Lifetime portfolio chip |
| Tech-skills lessons | `D.cbtProgress{}` | `misc.js` | Learning streak |
| Multi-child active context | `_activeProfileId`, `_profiles[]` | `parent.js` | Greeting + per-child data swap |

**Out of Command Center scope (faith — leave alone):** `D.scrReadDays`, `D.faithStreakState`, `D.scrPoints`, reading-plan progress, sermon notes, memory verses, prayer requests, Heart Check, Night Reflection, Faith Zones, Growth Profile faith trait visuals.

#### Reusable render helpers

| Helper | File:line | What it does | Suitable as |
|---|---|---|---|
| `_ahFirstName()` | `app-home.js:31` | Greeting name (active child → auth metadata → email prefix → "friend") | Drop-in for Command Center greeting |
| `renderDailyBriefing()` | `daily-briefing.js` | Greeting / streak / 3 daily tiles / trait momentum / evening Reflect prompt. Bails on `parent-view` + `_faithFree`. | Can stay as the "today" sub-block under the Command Center hero; or be folded in. |
| `renderDailyGrowth()` | `traits.js:156` | Today's trait gains. Renders into any `.today-growth-card` (class-addressed, dual-sited on `#appHome` and `#fzHome`). | Reusable as-is if Command Center exposes a `.today-growth-card`. |
| `renderHeroQuickStats()` | `init.js:1728-1730+` | Streak / tasks-today / points. Targets `#heroQsStreak` / `#heroQsTasks` / `#heroQsPoints` inside the hidden `#appLegacyHero`. | Logic reusable — re-point at Command Center IDs. |
| `summarizeChildStatus()` | `init.js:560` | Produces `{question, answer, pills}` for headline ("How is X doing today?"). | Logic reusable for a parent-style snapshot, if ever needed. |
| `celebrations.js` | `celebrations.js:84-628` | `megaConfetti`, `screenFlash`, `traitExplosion`, `prayerDove`, `realLifeWinCelebration`, `streakMilestoneBanner`, `didYouKnow` | Animation toolbelt for Command Center entry / level-up moments. |
| `Chart.js` (loaded globally at `index.html:47`) | — | Bar / donut / line, used by Habits Analytics | Available for stats sparklines without adding a dep. |

#### Existing `#appHome` block — reuse or replace?

**Recommended: keep in DOM as fallback, replace as the primary surface.**

- The 6-destination map (`_APP_SECTION_MAP` at `app-home.js:93-100`) is good content — those are the right top-level destinations for a non-faith life-skills user. **Reuse the routing, replace the visual language.**
- The greeting / streak chip pattern is solid — **reuse the data, restyle.**
- The Daily Briefing card is a self-contained module already gated by `parent-view` / `_faithFree`. **Reuse as a sub-block under the Command Center hero.**
- `.fz-menu-btn` / `.fz-greet-*` / `.fz-menu-btn-heart` are faith-home styling — **do NOT reuse for Command Center.** New class namespace (e.g. `.cc-*`) so the Well palette never bleeds in and any future faith-home restyle is independent.

#### Open questions for Phase 2 (design)

These don't block Phase 1 — flagging for the design pass:

1. **Streak unification.** App has 9+ disconnected trackers (faith, math, typing, chore, flashcard, reading-plan, daily-W, devotional, habits). Command Center should pick one canonical streak for the hero. Candidates: `D.habitsV2` longest-running streak, `getScriptureStreak()` (faith-aware but currently the only forgiveness-aware one), or `D.streak` (aggregate Daily W's). Decide in Phase 2.
2. **Animation budget.** Existing Well uses CSS-3D (cross), layered SVG (mountains, well), CSS keyframes (star twinkle, shooting star), canvas (legacy code, retained but unused). Establish a perf budget so Command Center animation matches the Well's quality without the canvas overhead.
3. **Multi-child surface.** Active child profile already affects greeting. Should the Command Center show "you" data only, or a multi-child overview when an adult is signed in? (This intersects with the parent-routing fix from Phase 0.)
4. **Tile scope.** Today the simplified home has 6 destinations. Command Center hero could surface 4 stat tiles + 6 destinations + "next up" + reflect prompt, or compress. Design call in Phase 2.

---

### Phase 1 verdict

- The full-app account is **not actually getting the cinematic Well** — the `_faithFree` gating works correctly. The perception that "we land on the Well" reflects the fact that the current full-app home shares **every visual class** with the faith Well's simplified home and lacks a hero identity of its own.
- **No flag bug**, **no hardcoded default**, **no Well-render path to break**. The minimal routing change (Phase 3) is one new sibling container plus a chooser inside `maybeRenderAppHome()`. The faith Well is untouchable by construction.
- The data layer is rich enough to build a serious Command Center without new schema work. Five Storage buckets (chore-proofs / goal-images / legacy-vault / cbt-thumbnails / skill-evidence) are still missing per `STATUS_REPORT.md §4.1`, but none are required for a v1 Command Center hero.

**STOP. No edits, no design work, no building. Awaiting go-ahead before Phase 2.**

---

## Phase 2 — Design Concepts

Three concepts shipped as standalone, self-contained HTML previews. No app code touched. All three respect `prefers-reduced-motion: reduce`, target 390×844 mobile-first, use only `transform`/`opacity` animations (no canvas), and namespace their CSS as `.cc-*` (no `.fz-*` borrows).

### Steers applied (from your direction this phase)

- **Audience:** individual signed-in user. No multi-child variant — parents-with-kids already route to `s-parent` (Phase 0 fix).
- **Faith:** present as **one** de-emphasized destination tile in every concept. Never the centerpiece, never the palette anchor, no `.fz-*` styles.
- **Streak:** **one** headline streak rendered as "Day 12." Proposal: keep `D.streak` (the aggregate Daily W's counter at `ui.js:417`) as the canonical source for v1, then in a Phase 3 follow-up broaden the definition to "consecutive days the user touched any meaningful activity" (habit completion / chore log / journal / scripture / events) and retire the remaining trackers (math `#mathStreakDisp`, typing `#practiceStreakDisp`, chore `D.choreStreak`, flashcard `_fcStreak`, reading-plan `rpStreakBanner`, `D.habitsV2[].streak`, `getScriptureStreak`, `user_streaks.devotional_completions`). Confirm before Phase 3 build.
- **Secondary stats:** "5 tasks today" + "240 points" (live sources: count of due chores + due habits + today's events; `D.chorePoints.total - D.chorePoints.spent`).
- **Animation budget:** match the Well's quality bar but stay smooth on a mid-range phone. All three concepts use SVG + CSS keyframes only, no canvas, no per-frame JS, and gate motion behind `prefers-reduced-motion`.

### How to view

Open `scratch/cc-previews/index.html` in a browser. It links out to the three concept previews and shows the palette swatches + animation budget for each side-by-side. Or open each directly:

- **A · Constellation:** `scratch/cc-previews/constellation/index.html`
- **B · Atlas:** `scratch/cc-previews/atlas/index.html`
- **C · Compass:** `scratch/cc-previews/compass/index.html`

### Concept A — Constellation

| | |
|---|---|
| **Signature centerpiece** | SVG node graph of 6 life domains (Habits / Chores / Goals / Money / Skills / Health) as glowing nodes connected by thin lines, ~300px tall. Lines draw in on first paint (~1.5s stagger). Nodes drift ±6px over 8–12s. Today's focus (Habits) has a soft halo pulse. |
| **Layout** | Hero-first. Greeting → headline streak + 2 stat chips → constellation → 2-column tile grid with the muted Faith tile alone at the bottom row. |
| **Palette** | Background `#0E1326 → #060912` slate gradient. Node accents `#F5A623`, `#F47B5A`, `#6AA7FF`, `#7EC19A`, `#D4A04C`, `#4A9082`. Streak number gradient amber → coral. Faith tile `#6B6B80` text on `#1a1f33`, no accent. |
| **Typography** | Inter (humanist sans) + JetBrains Mono (tabular numerals). Greeting 1.7rem mobile / 2.2rem desktop. Streak number 3rem / 4rem. |
| **Mood** | Warm dark slate. Capable, alert, mission-control without sterility. Feels like a quiet ops room. |
| **What's animated** | SVG line draw-in · node fade-in + scale-up · gentle node drift · halo pulse on focus node · line opacity breathing · tap scale flash on tiles. |
| **Tradeoffs** | Most "dashboard-y" of the three — best for the user who wants to see all their domains *at once* on the hero. Less visceral than Atlas, less editorial than Compass. The constellation metaphor reads instantly. Risk: if the user has only one or two active domains, the graph can feel sparse. |

### Concept B — Atlas

| | |
|---|---|
| **Signature centerpiece** | Layered dawn SVG landscape filling the top 55–60% of the viewport — peach-to-teal sky, 3 mountain layers, a winding sand path receding to a low sun, deep moss foliage, drifting clouds + pollen motes, light parallax on scroll. Hero content overlays a translucent cream panel. |
| **Layout** | Immersive hero (landscape behind, content over). Below: horizontally-scrollable tile rail (becomes 2-col grid at desktop), with the muted Faith tile pinned to the end. |
| **Palette** | Sky peach `#F4A261` → teal `#1C645D` → cream `#F5ECD9`. Path `#D9B58F`. Foliage `#2F5D45`. Sun `#F5C46C`. Overlay panel cream `#FDF9F0` @ 92%. Text ink `#2B1810` on light, cream `#F5ECD9` on dark. Faith tile muted moss-grey `#6F8175`. |
| **Typography** | Fraunces (editorial serif) for greeting + streak number, Inter for body. Italic-lean on the name. Greeting 1.9rem / 2.6rem. Streak 2.8rem. |
| **Mood** | Dawn light. Grounded, hopeful, expansive. Distinct opposite of the Well's night-sky-cross. |
| **What's animated** | Sun breathing rise (12s) · cloud horizontal drift (~30s) · foliage gentle sway · pollen mote drift · flame pulse on streak chip · slight parallax (max ±20px) on scroll. |
| **Tradeoffs** | Most cinematic and emotional of the three. Strongest "this is YOUR app, not the Well's app" signal because it owns a completely different time-of-day palette. Carries the most SVG mass — needs a careful watch on the lower-end-phone budget (sun glow + parallax + motes). Less immediate "data visible" feel than Constellation. |

### Concept C — Compass

| | |
|---|---|
| **Signature centerpiece** | Brass-and-parchment SVG compass dial, ~240px. 4 cardinals labeled with life domains (N=Build/Habits · E=Earn/Money · S=Care/Health · W=Grow/Skills). On load, the burgundy needle rotates from a tilted start angle and settles at ~30° (today's recommended focus). Then breathes with a ±2° sway. |
| **Layout** | Editorial hero card occupying upper ~55% of viewport — compass + greeting + headline streak + 2 stat chips stacked on mobile (compass left / text right on desktop). Below: 2-column grid of 6 editorial tiles, Faith pinned to the bottom with no brass. |
| **Palette** | Warm dark `#1A1208 → #2E1F11`. Compass face parchment `#F3E9D2` with brass ring `#C9A86A`. Needle burgundy `#7A2A1F` with brass tip. Text cream `#F1E9D5` / tan `#BDB69A`. Streak number in brass gradient. Faith tile muted oak `#7A6B4D`, drops both serif and brass. |
| **Typography** | Fraunces Display for greeting + streak. Small caps for stat labels (uppercase + 0.18em letter-spacing). Mono for the numeric readouts. |
| **Mood** | Editorial / literary / slightly Moleskine. A small daily ritual — open the app, the needle settles, you know what to do next. |
| **What's animated** | Needle rotation on load (~1.8s `ease-out`) → ±2° ambient sway · subtle dial face rotation hint · streak number tick-up 0 → 12 over 800ms · hover-on-tile pre-rotates the needle (desktop only). |
| **Tradeoffs** | Most distinctive identity of the three — nobody else's app looks like this. Strongest "considered / grown-up" tone. Constrains the four cardinals to four domains; the other two (Chores, Goals) live only in the tile grid and aren't on the compass face. If you want all 6 surfaced equally at hero level, this is the weakest fit. If you want focus + ritual, it's the strongest. |

### Routing seam (carried over from Phase 1, unchanged)

For every concept, the Phase 3 integration is the same:

1. Add `<div id="appCommandCenter"></div>` as a sibling of `#appHome` inside `#s-hero` (`app/index.html` around line 1075 or 1191).
2. In `app/js/app-home.js:116-126` `maybeRenderAppHome()`, after the `parent-view` / `_faithFree` early-bail block, route to a new `renderCommandCenter()` that paints into `#appCommandCenter` and keep `#appHome` hidden as one-flag rollback.
3. **Zero changes to the faith Well code path.** `auth.js:368`, `init.js:1649`, `init.js:1356-1640`, `app-home.js:121` all stay exactly as-is.
4. New module: `app/js/command-center.js` (loaded after `app-home.js` in the existing script chain so its globals win on conflict).

### Open questions for Phase 3 (after you pick)

1. **Streak source** — confirm `D.streak` as v1 canonical, with the broader rollup as a Phase 3 follow-up?
2. **Tile order** — keep Habits / Chores / Goals / Money / Skills / Health / Faith, or re-order by stage (e.g. younger users see Chores first, older users see Goals first)?
3. **"Today's focus" definition** — for Constellation's pulsing node and Compass's needle settle angle, what computes the focus? Recommendation: the domain with the most overdue items, falling back to the most-recently-touched. Confirm.
4. **Greeting fallback chain** — reuse `_ahFirstName` from `app-home.js:31` (active child → auth metadata → email prefix → "friend")? Recommendation: yes, unchanged.
5. **Animation kill switch** — should there be a per-user setting to disable hero motion beyond the `prefers-reduced-motion` system gate? Recommendation: defer to Phase 4 if asked.

**STOP. No build. No commits. No edits to `/app/`, `/api/`, or `/docs/`. Awaiting your concept pick (or tweak requests) before Phase 3.**
