# Sports → world-class: phased roadmap

Status of the track so far:

- **Phase 1** — Explore grid wears the shared Power-Card (tlc-power) shell. _Shipped._
- **Phase 2A** — Sport detail sheet (Power-Card-styled `.sds-*`). _Shipped._
- **Phase 2B** — "Find your sport" finder (interest/preference matching only). _Shipped._
- **Phase 3** — **Deep sport detail sheet** (this commit). The thin tooltip becomes a real
  per-sport resource: overview, what a season/practice really looks like, skill progression
  (beginner → advanced), positions/roles, the mental game, how to start + find a team,
  the honest recruiting & scholarship path, health & injury prevention (health-first
  fueling, never weight/calorie/body-comp), and a secular character/role-model angle.
  Framework + 3 authored exemplars (Basketball = team, Track & Field = individual,
  Wrestling = contact). Remaining 13 sports keep the basic sheet until the template +
  content approach is greenlit.

Everything below Phase 3 is **proposed** — sequencing, what each touches, and migration flags.

---

## Wellbeing rails (apply to every phase, non-negotiable)

Teen surface. Any training / conditioning / nutrition content stays health-first and
age-appropriate: skill, healthy strength/agility, **rest, recovery, injury prevention,
fuel-your-body-well, hydration, sleep**. **Never** calorie targets, macros-as-goals,
weight or body-composition goals, restrictive eating, or weight-cutting. **Weight is a
static recruiting fact only** (e.g. a wrestling weight class) — never a goal, target, or
tracked metric. Health, growth, durability — never performance-at-all-costs. New
character content is **secular** unless Jason explicitly approves faith content, and it
never touches `faith.js` / the Well.

---

## Key findings that shape the plan (from a codebase scan)

1. **`mySports` is localStorage-only and NOT protected by the owner-guard.**
   `getMySports/saveMySports` (`sports.js`) read/write the bare key `mySports`. The
   owner-guard wipe (`_ylccEnforceOwner`, `sync.js`) only clears `ylcc_*` / `lifeos_*` /
   `dominic_*` / `levelup_*` — so on a shared device, **User A's sports data persists into
   User B's session** (the "Good afternoon, Lilly" class of bug). Any phase that builds on
   `mySports` inherits this leak. **Fix: migrate `mySports` → `D.mySports`** (cloud-synced
   AND reset to `DEF` by the owner-guard). Front-load this in Phase A.
2. **Goals already has a Sports domain.** `GOAL_DOMAINS` in `goals.js` includes
   `{key:'sports', name:'Sports', match:'Sports / Martial Arts'}`; the Add-Goal dropdown
   already emits `cat:'Sports / Martial Arts'`. Athletic goals are a **tag on `D.goals`,
   not a new system** — domain card, progress ring, AI coach, and badges already handle it.
3. **A calendar already exists** in `school.js` (`D.events` + `saveEvent` + `renderCalendar`
   + `renderUpcoming`), with a Sports event category (`bjj` = "🥋 Sports") already defined,
   and the home dashboard / command-center already surface `D.events`. Season schedules
   reuse this — no new calendar.
4. **None of the proposed phases requires a Supabase migration as scoped.** Everything fits
   the cloud-synced `D`/`DEF` JSONB blob. A migration is only forced if recruiting progress
   must be **server-queried or shared with a parent beyond the per-user blob** — and the
   parent hub already reads the kid's `D` via the multi-profile model, so even that is
   likely avoidable.

---

## Recommended order

### Phase A — Athletic goals → existing Goals feature  ·  _do first_
**Why first:** lowest effort, **zero new data**, ships value immediately by lighting up a
category that already works end-to-end (domain card + AI coach + badges).
- **Touches:** `goals.js` only, plus an optional "Add a goal for this sport" deep-link from a
  My Sports card / the deep sheet that pre-seeds `cat:'Sports / Martial Arts'`.
- **Data:** none new — `D.goals` entries with the existing category. **No migration.**
- **Build:** optional sport-specific goal templates (e.g. "make varsity", "PR my 400m",
  "email 5 college coaches") and the cross-link button. Keep the category string exactly
  `'Sports / Martial Arts'` — renaming it orphans existing goals + breaks `GOAL_DOMAINS.match`.
- **Risk:** lowest of all.

### Phase B — My Sports tracker + season schedule → Life calendar  ·  _do second_
**Why second:** reuses the existing calendar and feeds the home dashboard, and it's the
natural moment to do the **`mySports` → `D` migration that closes the owner-guard data leak**
— a correctness fix every later phase depends on.
- **Touches:** `sports.js` (`mySports` store, `renderMySports`, editors), the `school.js`
  calendar (`D.events`, `saveEvent`, `renderCalendar`, `renderUpcoming`), and the My Sports
  panel markup in `app/index.html`.
- **Data:** pure `D`/localStorage. (a) migrate `mySports` → `D.mySports` with a one-time
  localStorage→`D` migration + a `scrReadDays`-style array sanitizer in `loadData`/`cloudLoad`;
  (b) season games/practices write `D.events` with `cat:'bjj'` (already cloud-synced).
  **No migration.**
- **Risk:** medium. Riskiest parts are the `mySports`→`D` migration (sync + owner-guard
  semantics; don't lose existing users' data) and new markup in the fragile `app/index.html`
  shell → run `index-html-guardian`, honor the >5% size-figure refresh rule, ship light mode.

### Phase C — Train area (drills + the mental game)  ·  _do third_
**Why third:** additive content tab; cleanly reuses the sub-tab switcher
(`sportMainTab`), the Power-Card shell, and the established AI-mode + coach-cache patterns.
- **Touches:** `sports.js` (new sub-tab beside Explore / My Sports). A drills catalog is a
  static const like `SPORT_DATA`. A mental-game coach reuses the **single AI ingress**
  (`/api/ai-summary`) as a **new `mode`** — not a parallel endpoint (keep CommonJS).
- **Data:** static catalog = no persistence. Optional drill-completion/streak = a new `D`
  key (e.g. `D.trainLog`) in `DEF`. **No migration.**
- **Risk:** medium effort (content + a tab), low integration risk. Guardian after any
  `index.html` markup; keep `ai-summary.js` CommonJS (ESM has caused 502s).

### Phase D — Leadership & character (secular)  ·  _do fourth_
**Why fourth:** content-heavy but low-integration; lighter and lower-risk than Recruiting
while that data model gets decided. Parallels the existing secular `traits.js` / `skills.js`.
- **Touches:** `sports.js` (new content area); optional reflection/journaling can reuse the
  existing `D.journal` rather than a new store.
- **Data:** content-only → none; or reuse `D.journal` / a new `D` key. **No migration.**
- **Wellbeing:** secular only (work ethic, resilience, humility, leadership, sportsmanship).
  Faith/character content only with explicit OK; never touches `faith.js` / the Well.
- **Risk:** low. Standard guardian + light-mode-ships-with-feature.

### Phase E — Recruiting / college path (guided multi-step tracker)  ·  _do last_
**Why last:** highest effort, most new state, most new `app/index.html` markup, and the only
phase with a `D`-blob-vs-table decision. Build it **on top of the now-cloud-synced
`mySports.profile`** (Phase B) so it doesn't duplicate GPA / grad-year / coach fields.
- **Touches:** `sports.js` (new area). Overlaps `mySports[].profile` (already has
  `gpa, gradYear, coach, coachEmail`) and the resume feature's multi-field-profile pattern;
  a step checklist mirrors the existing `D.driverChecklist` keyed-boolean map.
- **Data:** new `D` keys (e.g. `D.recruiting:{ checklist:{}, schools:[], coachContacts:[] }`).
  **Recommended: stay in the `D` blob — no migration.** A Supabase table is needed **only**
  if recruiting data must be server-queried or shared with a parent/admin beyond the
  per-user blob; if so it must follow the strict rules (`docs/migrations/_TEMPLATE.sql`,
  RLS + explicit GRANTs, `scripts/check-migrations.sh`). `escapeHtml()` all coach/school input.
- **Risk:** highest. Largest `index.html` additions (size-refresh rule + guardian mandatory).

---

## Migration flags summary

| Phase | Supabase migration? | Persistence |
|---|---|---|
| A — Athletic goals | **No** | `cat` tag on existing `D.goals`. |
| B — My Sports + season schedule | **No** | Pure `D`; migrate `mySports`→`D.mySports` (fixes owner-guard leak); events reuse `D.events`. |
| C — Train area | **No** | Static const + optional `D` key; AI via a new `ai-summary` mode. |
| D — Leadership & character | **No** | Content-only or reuse `D.journal`. |
| E — Recruiting path | **No** (recommended) | New `D` keys. Table only if parent/admin server-side visibility is required. |

**Cross-cutting for every phase:** new markup lands in the fragile `app/index.html` shell —
run `index-html-guardian` after each edit, honor the >5% size-figure refresh rule, ship the
`:root.light` pass in the same commit, and `escapeHtml()` all user-supplied strings before
`innerHTML`.

---

## Phase 3 content approach (for greenlight before scaling to all 16)

- Content lives in a dedicated `SPORT_DETAIL` map in `sports.js` (keeps `SPORT_DATA`
  byte-identical). A sport with a `SPORT_DETAIL` entry renders the deep sheet; every other
  sport renders the original basic sheet unchanged.
- Each sport was **authored, then adversarially audited** for child-wellbeing + factual
  accuracy, then revised. The audit caught and fixed real issues (e.g. a Basketball
  scholarship-value contradiction; a now-outdated Track scholarship-cap number post-House
  settlement). Wrestling — deliberately chosen as the contact exemplar because it's where
  weight-cutting culture lives — passed the audit clean: weight appears only as a static
  class, fueling is "eat enough", and the sheet explicitly rejects cutting.
- **To finish the section:** on greenlight of this template + the exemplar copy, author the
  remaining 13 sports into `SPORT_DETAIL` with the same schema + the same audit pass, in
  batches for reviewability.
