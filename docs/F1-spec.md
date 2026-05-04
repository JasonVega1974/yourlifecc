# Phase F1 — Faith Content Build-Out

## Context

F0 shipped the data foundation and gating for the `faith_free` tier. F1 is where the actual Bible-study product gets fleshed out. **Important:** the new faith content built in F1 is for **all YourLife CC members** (paid + faith_free). It just happens that faith_free's allow-list (`['s-hero', 's-scripture']`) means they get it for free as part of their tier. No special-casing in code — build the features once into the existing faith section, both tiers benefit.

## Goals

Make `s-scripture` (the Faith section) feel like a complete Bible-study + worship experience, not a single-purpose devotional reader. Add the Worship Playlist and Church Resources content the user has already drafted in standalone HTML files (Kingdom Creatives templates).

## Scope

### In scope

1. **Worship Playlist sub-section.** Port the KC Worship HTML template into a tab/section under Faith. 30-song hardcoded playlist, embedded YouTube player, prev/next/shuffle controls.

2. **Church Resources sub-section.** Port the KC Resources HTML template into a tab/section under Faith. 12 resource cards (Prayer Guide, Baptism, Giving, Marriage, Suicide Prevention, Mental Health, Children's Ministry, Parenting, Grief, Small Groups, Addiction, Bible Study) with modal detail pages. **Note:** the user's paste of this HTML was truncated at ~50k characters mid-prayer-modal. Need the complete HTML before porting.

3. **Sidebar IA — expanded Faith group.** Currently flattened in F0 close ("Bible & Faith" as a single top-level sidebar link). F1 should bring back a Faith group with sub-items as separate sidebar links, replacing the in-page tab system inside `s-scripture`. Proposed children:
   - Devotionals
   - Jesus & Purpose
   - Learn the Bible
   - Bible Study
   - Bible (ESV)
   - My Journey
   - Worship Playlist (new)
   - Church Resources (new)

   This requires either splitting `s-scripture` into multiple sections OR keeping it as one section but having sidebar items deep-link to specific tabs within it. The first approach is cleaner.

4. **Faith-themed compact hero variant for faith_free.** Replace the current minimal hero (greeting + name + date + scripture verse) with a purpose-designed faith dashboard. Suggested content:
   - Daily verse + reflection prompt
   - "Today's devotional" CTA card
   - Bible reading streak / progress
   - Featured worship song of the day (link to Worship Playlist)
   - Quick links to: Devotionals / Bible Study / Prayer Journal

   When this lands, the F0 hide block in `applySettings()` (the `if(window._faithFree){...}` chunk) can be simplified — the new hero structure should render only faith content for faith_free in the first place, removing the need for per-element `setProperty('display','none','important')` hides.

5. **Stage-filter suppression for faith_free.** `applyStageFilter()` in `app/js/ui.js` runs `D.mode`-driven sidebar filtering on top of F0 gating. For faith_free users this is dead logic that risks future regressions. Add a guard: `if(window._faithFree) return;` at the top of `applyStageFilter`.

### Out of scope (deferred to F2 / later)

- Faith-free signup flow (Stripe-free path) — F2.
- Landing-page faith-platform CTA — F2.
- Settings page section toggle filter for faith_free — F2 (G.3 from F0 plan).
- Stripe webhook safety against `faith_free` plan_status overwrites — F2 production-block.
- Avatar tooltip neutralization — tangential, anytime.
- URL routing `/app/index.html` → `/app/` — host config, anytime.
- Prayer journal feature — TBD, possibly F1 if the user requests it.

## Open questions for the user

Before code starts:

1. **Sidebar IA — split or deep-link?** Build separate sections per Faith sub-item (cleaner long-term, more refactor work) OR keep `s-scripture` as one section and have the sidebar items deep-link to its existing tabs (faster, slightly hacky).
2. **Worship Playlist content source.** Keep the 30-song hardcoded array from the KC HTML, or make it editable per-user / admin-managed? If editable, that's a bigger feature with its own data model.
3. **Church Resources HTML.** User needs to re-paste the full file (the prior message hit the 50k character limit and cut off mid-prayer-modal). All 12 modal payloads needed.
4. **Hero variant scope.** Just the faith-specific cards above, or also a Bible reading plan / streak tracker / verse-of-the-day rotation? More scope = more spec.
5. **Worship Playlist gating.** Visible to ALL members or only faith-tagged content shown for faith_free? (User said "for all members" — confirming.)
6. **Resources modal content.** The KC HTML has rich modal content. Port verbatim, or summarize / restructure for YourLife voice?

## Design constraints

- **Don't restyle existing `s-scripture` content.** Add to it; don't refactor what works today.
- **Don't break paid users.** Same regression-test rule as F0 — if a `plan_status='active'` user logs in after F1 ships, they see additive new content, not a different app.
- **No new HTML on the marketing landing page.** Same scope rule as F0.
- **Keep all changes uploadable via GitHub web UI.** No build steps.
- **`node --check` every JS file.**
- **Verify `app/index.html` tail integrity** at lines 6319 (`function tick(){`), 6334 (`setInterval(tick,`), 6527 (Google Translate script) before AND after every edit.

## Implementation phases (rough)

- **F1.0 — Worship Playlist port.** Add the new section, render the playlist grid, wire up the YouTube player. Smallest of the three.
- **F1.1 — Church Resources port.** Add the new section, render the 12 cards, build the modals. Largest.
- **F1.2 — Sidebar IA expansion.** Restructure Faith group with sub-items.
- **F1.3 — Faith-themed hero variant for faith_free.** Replaces F0's per-element hides.

Each phase ships independently with its own discovery → plan → approval → implement → test cycle, like F0. Don't bundle.
