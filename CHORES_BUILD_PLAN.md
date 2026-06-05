# Chores Tab Build Plan

**Date:** 2026-06-04
**Mode:** Read-only plan. No code edits, no SQL run, no commits.
**Inputs:**
- `MASTERPLAN_RECONCILED.md` §1 row 1 + §2.3 + §3
- `YOURLIFECC_APP_UPGRADE_MASTERPLAN.md` §"TAB 1: CHORES" (lines 62-125)
- Current implementation: `app/js/chores.js` (784), `app/js/email.js` (Parent Bucks ecosystem at L517-1556), `app/js/parent.js` (chore management at L3085-3413), `app/index.html` (`#s-chores` at L5441, `#s-rewards` at L5607, `#s-contests` at L5562), `app/js/data.js` (DEF L164-165)
- Existing migrations: 19 SQL files in `docs/migrations/` — **none reference chores**

---

## §0 — Premise corrections vs the masterplan

### Two of the masterplan's premises are wrong

| Premise (masterplan) | Reality | Impact |
|---|---|---|
| `ALTER TABLE chores ADD COLUMN difficulty TEXT…` | **There is no `chores` table.** All chores data lives in `profiles.data` JSONB. | Plan's ALTER block would fail with "relation does not exist" — replace with CREATE TABLE. |
| `CREATE TABLE chore_streaks ( … current_streak INT … last_completed DATE … )` | A streak engine table already exists: `public.user_streaks` (`docs/migrations/streaks-engine.sql`). It's faith-shaped today (`study_completions`, `devotional_completions` columns) but designed as the canonical per-user streak row. | Adding a parallel `chore_streaks` table = audit cross-cutting #1 deepening (9 disconnected streak trackers). See §3 Option A vs B. |

Also worth flagging:
- "Current State: Basic chore list, check-off, points assignment" — **understated**. Today the system has: 4 KPI cards, 8 chore levels (`CHORE_LEVELS` in `chores.js:8`), Parent Bucks earning per chore, spinTickets rewards every 3rd verified chore, side-confetti celebration, parent verification flow with pending/verified/rejected statuses, self-initiated "I Did Something Helpful" submissions, a kid-facing rewards shop, and a 20-row activity history.
- The user's instruction "do NOT recreate the existing chores table" is **vacuous** — there is no chores table to recreate. Interpreted here as "don't introduce duplicate tables for things that already work in JSONB."

---

## §1 — Current state inventory (be honest about what works)

### State (`D.*` in `profiles.data` JSONB)

| Key | Shape | Used by | Notes |
|---|---|---|---|
| `D.chores` | array of `{id, name, pts, freq, cat, emoji, active}` | `chores.js` | DEF declares `chores:{}` (object) — audit P1-9. `initChoreData()` and 22+ `Array.isArray(D.chores)?D.chores:[]` defensive guards reconcile at runtime. |
| `D.choreLog` | array of `{id, choreId, choreName, pts, date, time, status, emoji}` | `chores.js`, parent.js, email.js | `status` ∈ `pending` \| `verified` \| `rejected` \| `redeemed` |
| `D.chorePoints` | `{total, spent}` | `chores.js`, dashboards | `initChoreData()` migrates legacy-number shape. |
| `D.chorePin` | string | (unused after PIN moved to `D.parentPIN`) | Dead state, kept for legacy compatibility. |
| `D.choreList` | array (declared in DEF L164) | **never read** | Phantom field. Safe to drop in a Phase B cleanup but not required for Tab 1. |
| `D.selfChores` | array | `chores.js`, parent.js (`renderParentSelfChores`) | Kid-initiated chores awaiting parent approval (the "I Did Something Helpful" flow inside `s-chores`). |
| `D.helpfulDeeds` | array | `s-contests` (parallel "I Did Something Helpful" inside Challenges) | Duplicate concept under a different name + section. Cleanup candidate. |
| `D.rewards` | array of `{id, name, pts, active}` | `chores.js` — the in-`s-chores` "Rewards Shop" | Costs spend in `chorePoints` currency. |
| `D.pb` | `{balance, spinTickets, scratchTickets, storeItems[]}` | `email.js` — the `s-rewards` "Parent Bucks Store" | `storeItems` = `{id, emoji, name, cost, active}`. Costs spend in PB currency. **Two parallel reward stores exist.** |
| `D.behaviorLog`, `D.parentNotes`, `D.parentGrowth` | arrays | parent.js | Parent-side note-taking around chores. |
| `choreStreak` | **NOT persisted** | `chores.js` `getChoreStreak()` | Computed at render time from `D.choreLog`. Masterplan_reconciled §2.3 wording "lives in JSONB" is inaccurate. |

### Surfaces

| ID | File:line | What | Status |
|---|---|---|---|
| `#s-chores` | `index.html:5441` | Today list + KPI cards + PB+Games bar + level bar + Self-Initiated + Rewards Shop preview + Recent Activity | **EXISTS, one long scroll** |
| `#s-rewards` | `index.html:5607` | Parent Bucks store + Spinner + Scratch UI | **EXISTS** — this is the real "Chore Store" the masterplan wants |
| `#s-contests` | `index.html:5562` | Challenges + Helpful Deeds + Leaderboard + Family Rewards | **EXISTS** — Leaderboard is here, not in `s-chores` |
| `#ph-chores` panel inside `#s-parent` | `parent.js:2713` | Pending verifications + chore list + self-chores + reward mgmt + parent-side leaderboard + contests + family rewards | **EXISTS, comprehensive** |

### Renderers

- `renderChores()` (`chores.js:151`) — populates `s-chores` (today list, history, level bar, rewards shop, parent-mode lists).
- `renderPhPendingChores()` (`email.js:1556`) — Parent Hub pending list.
- `renderParentChoreList()` (`parent.js:3167`), `renderParentSelfChores()` (`:3085`), `renderParentLeaderboard()` (`:3207`), `renderParentContests()` (`:3305`).
- `getChoreStreak()` (`chores.js:134`) — recomputes streak from `D.choreLog`.

### Migrations / Storage

- **Migrations referencing chores: 0.** Grep across `docs/migrations/*.sql` returns nothing.
- **`chore-proofs` storage bucket: missing** (per `MASTERPLAN_RECONCILED.md` §3).
- **`_TEMPLATE.sql`** is the canonical migration template — all new tables must follow it (RLS + explicit GRANTs per the Oct 30 2026 Supabase Data API change). Per `CLAUDE.md`:
  > Run `bash scripts/check-migrations.sh` before committing any migration change. It fails (exit 1) if any `docs/migrations/*.sql` contains `CREATE TABLE` without a corresponding `GRANT`.

---

## §2 — 5 sub-tabs + feature list mapped to current code

### Sub-tabs

| # | Sub-tab | Status | Where it already lives | Plan-of-record |
|---|---|---|---|---|
| 1 | **My Chores (kanban)** | **EXTEND** | `#s-chores` "TODAY'S CHORES" list (`#choreTodayList`) — flat list with check-off | Reorganize the current today-list into a 3-column kanban (Todo / Pending / Verified). Add difficulty pill, due-date pill, optional photo-proof button. |
| 2 | **Chore Store** | **CONSOLIDATE + EXTEND** | Two parallel stores: `D.rewards` (`#rewardShopList` inside `s-chores`) and `D.pb.storeItems` (`s-rewards`). | Pick PB as canonical (it has currency + spinner/scratch ecosystem already). Deprecate `D.rewards` (migrate items into `D.pb.storeItems`). Sub-tab pulls from PB. |
| 3 | **Leaderboard** | **EXTEND** | `#leaderboard` inside `#s-contests` (`index.html:5593`) + `renderParentLeaderboard()` (`parent.js:3207`) | Mirror the existing leaderboard widget into the sub-tab (don't duplicate the data — reuse the render function). |
| 4 | **History** | **EXTEND** | `#choreHistory` at bottom of `#s-chores` (last 20 entries of `D.choreLog`) | Expand to full timeline + filter (status, date range) + monthly summary cards. |
| 5 | **Streaks** | **EXTEND** | `#choreStreak` summary card + `getChoreStreak()` recompute | Sub-tab with: current streak, longest streak, 12-week heatmap (reuse Habits' `buildHabitsHeatmap` pattern from `habits.js`), badge tiers (7-day / 30-day / 100-day / 365-day). |

### Feature list (masterplan §"Features to add")

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Difficulty tiers (Easy/Medium/Hard with point multipliers) | **NET-NEW** | Add `difficulty` field to chore record. Multipliers e.g. 1.0× / 1.5× / 2.0×. Affects display + auto-pts calc. |
| 2 | Due date + reminder system (badge on tab when overdue) | **NET-NEW** | Add `dueDate` field (ISO date string). Show overdue chip on the My Chores sub-tab nav. No push notifications yet (push_subscriptions backend exists; UX hookup is separate). |
| 3 | Photo proof submission | **NET-NEW** | Requires `chore-proofs` storage bucket (see §4). Parent approval flow already exists for verification — wire photo into `markChoreDone` + show in `renderPhPendingChores`. |
| 4 | Recurring chore templates | **PARTIAL → EXTEND** | `c.freq` field already takes `daily` / `weekly` / `once` — but the recurrence engine doesn't actually generate due-dates; it just shows the chore each day. Real RRULE-style needed. **Cross-cutting concern:** Schedule's recurrence is also fake (audit P0). A shared `lib-recurrence.js` would address both, but is out of Tab 1 scope. |
| 5 | Drag-and-drop priority ordering | **NET-NEW** | Add `order` field (int) to chore record. HTML5 drag-drop within kanban columns. |
| 6 | AI Chore Coach | **NET-NEW** | Add new mode to `/api/ai-summary.js` (e.g. `mode:'chore-coach'`). Weekly summary: completion rate, top chore, suggested next focus. ~350 tokens via Haiku to match the existing default mode. |
| 7 | Seasonal chore packs | **NET-NEW** | Hard-coded data in a new `app/js/data/chore-packs.js` (e.g. Spring Cleaning, Back to School, Summer Outdoor, Holiday Prep). Parent taps "Add pack" → bulk inserts into `D.chores`. |
| 8 | Bonus chore requests (child requests extra chores) | **PARTIAL** | `D.selfChores` + helpfulDeeds already cover "I Did Something Helpful". A "I want to do X for Y points — approve?" flow is the missing version of this. |
| 9 | Achievement badges (First Chore, 7-Day Streak, 100 Points Club, …) | **NET-NEW** | Could be: (a) standalone `chore_badges` array in JSONB, OR (b) tie into existing `traits.js` system (7 identity traits × 5 levels). Recommend (b) — adds a "Steward" or "Doer" trait and grants level-ups on chore milestones. Smaller surface, ties into existing Growth Profile UI. |

---

## §3 — Schema plan (de-conflicted)

### Conflict map

| Masterplan SQL | Reality | Verdict |
|---|---|---|
| `ALTER TABLE chores ADD COLUMN difficulty TEXT` | No `chores` table exists | **DROP ALTER. Use CREATE TABLE.** |
| `ALTER TABLE chores ADD COLUMN due_date DATE` | (same) | Same. |
| `ALTER TABLE chores ADD COLUMN recurring TEXT` | (same) | Same. |
| `ALTER TABLE chores ADD COLUMN photo_proof_url TEXT` | (same) | Same. |
| `ALTER TABLE chores ADD COLUMN approved_by UUID REFERENCES profiles(id)` | (same); also note `profiles(id)` is the row PK, not the auth user — should reference `auth.users(id)` like all other migrations | Same; and fix FK target. |
| `CREATE TABLE chore_streaks (…)` | `user_streaks` table exists (faith-shaped). | **See decision below.** |
| `CREATE TABLE chore_store_items (… family_id UUID …)` | `D.pb.storeItems` works in JSONB. No `families` table exists yet. | **Defer.** Promote when families/multi-account is on the roadmap. |

### Proposed schema (4 net-new objects + 0 alters)

#### New table 1: `public.chores`

Schema sketch (final SQL to follow the `_TEMPLATE.sql` shape):

```sql
create table if not exists public.chores (
  id              text primary key,                       -- 'ch_…' from chores.js (matches habits-schema pattern)
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  emoji           text not null default '📌',
  category        text,                                   -- maps to existing CHORE_CAT_EMOJI keys
  points          int  not null default 10,
  difficulty      text not null default 'medium'
                  check (difficulty in ('easy','medium','hard')),
  frequency       text not null default 'daily'
                  check (frequency in ('daily','weekly','monthly','once')),
  due_date        date,
  recurring_rule  text,                                   -- placeholder for future RRULE; null today
  active          boolean not null default true,
  sort_order      int    not null default 0,              -- for drag-and-drop priority
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
```

RLS: enable + "Users manage own chores" policy. GRANT block per template's User-data pattern. Index on `(user_id, active, sort_order)`.

#### New table 2: `public.chore_completions`

```sql
create table if not exists public.chore_completions (
  id              uuid primary key default gen_random_uuid(),
  chore_id        text references public.chores(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  completed_date  date not null,
  status          text not null default 'pending'
                  check (status in ('pending','verified','rejected','redeemed')),
  points_awarded  int  not null default 0,
  photo_url       text,                                   -- storage URL when photo-proof submitted
  verified_by     uuid references auth.users(id),
  verified_at     timestamptz,
  created_at      timestamptz not null default now(),
  unique (chore_id, completed_date)                       -- matches the "Already submitted today" guard in chores.js:63
);
```

RLS: same per-user pattern. Index on `(user_id, completed_date desc)` for History.

#### New table 3 — DECISION POINT: chore streaks

**Option A** (recommended): **Extend `public.user_streaks`** with chore-specific columns:

```sql
alter table public.user_streaks
  add column if not exists chore_completions int not null default 0;
-- (longest_streak / current_streak / last_active_date already exist and can be
--  shared across streak types if we agree streaks are unified per user — but
--  the existing columns are tied to faith activity. See "Tension" below.)
```

**Tension with Option A:** `user_streaks.current_streak` and `last_active_date` today track faith activity specifically (the table was named "Streaks Engine Phase 1A" but only ever wired into faith). Reusing those columns for chores would either (a) merge faith+chore into one streak (likely wrong — a user might be on Day 30 faith but Day 0 chores), or (b) require new columns `chore_current_streak`, `chore_longest_streak`, `chore_last_active_date`.

**Option B**: New per-domain table `public.chore_streaks`:

```sql
create table if not exists public.chore_streaks (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete cascade not null,
  current_streak    int  not null default 0,
  longest_streak    int  not null default 0,
  last_active_date  date,
  updated_at        timestamptz not null default now(),
  unique(user_id)
);
```

**Option C** (cleanest, larger scope): Refactor `user_streaks` to a generic per-(user, streak_type) shape — `streak_type text` discriminator, 1 row per user per type. Addresses audit cross-cutting #1 (9 disconnected streak trackers). Out of Tab 1 scope on its own; if you green-light, it should be its own pre-req commit.

**Recommendation:** **Option B for Tab 1 + open a separate task to consolidate via Option C in a later cleanup pass.** This avoids deepening the multi-streak mess (8 → 9 if we add one more) but ships chores without blocking on a 9-system refactor.

#### What NOT to add (defer to a future families/multi-account phase)

- `chore_store_items` — `D.pb.storeItems` already works in JSONB and there is no `families` table to FK against. Promote to a real table only when families exist.
- `chore_badges` — recommend extending `traits.js` instead (see §2 row 9) so we don't introduce yet another badge surface.

---

## §4 — Storage bucket

| Bucket | Status | Needed by | Spec |
|---|---|---|---|
| `chore-proofs` | **MISSING** | Increment 3 (Photo proof) | Private, 5MB cap per object, image MIME types only (`image/png`, `image/jpeg`, `image/webp`), RLS scoped to `auth.uid()` — users can read/write only their own paths under `<user_id>/<chore_id>/<timestamp>.jpg`. |

No other buckets needed for Tab 1. (`goal-images`, `legacy-vault`, `cbt-thumbnails`, `skill-evidence` are needed for other tabs per `MASTERPLAN_RECONCILED.md` §3; not Chores.)

---

## §5 — Build plan: 5 shippable increments in dependency order

Each increment is independently mergeable, deployable, and reversible. Each ships with: per-file commits, `node --check`, index-html-guardian if `app/index.html` touched, SW bump, verification snippet.

### Increment 1 — Sub-tab shell + persistence migration

**Goal:** Reorganize `#s-chores` into 5 tabbed surfaces and dual-write chore data to Supabase. No behavior change to end-users.

**Touches:**
- `app/index.html` — wrap existing s-chores body in a sub-tab tab bar + 5 panel divs (`#chores-mychores`, `#chores-store`, `#chores-leaderboard`, `#chores-history`, `#chores-streaks`). Move existing widgets into their natural panel. Guardian required.
- `app/js/chores.js` — add `cTab(tabId, btn)` (sibling of habits.js `hTab`). Wire tab switching. No data changes yet.
- `app/js/sync.js` — extend `cloudSync()` / `cloudLoad()` with a chore-dual-write: on save, mirror `D.chores` and `D.choreLog` to the new tables in addition to writing the JSONB blob. On load, prefer cloud rows if they exist, fall back to JSONB.
- `docs/migrations/chores-schema.sql` — CREATE TABLE chores + chore_completions per §3. Run via Supabase SQL editor.
- `service-worker.js` — bump CACHE_NAME.

**Verifiable:** 5 sub-tab buttons render; each opens its panel; existing chore add/complete/verify flow still works end-to-end; `select * from public.chores where user_id = …` returns rows after creating a chore.

**Reversibility:** Sub-tab nav can be hidden behind a feature flag (`window._cChoresV2`). Tables drop cleanly if needed.

### Increment 2 — My Chores kanban + difficulty tiers + due dates

**Goal:** Replace the flat today-list with a 3-column kanban (Todo / Pending / Verified). Add difficulty + due-date to the schema and UI.

**Touches:**
- `docs/migrations/chores-schema-v2.sql` — confirm `chores.difficulty` and `chores.due_date` (they're in v1 already per §3 sketch); no schema change needed if v1 was created with them.
- `app/js/chores.js` — extend `addChore` to take difficulty + due-date; extend `renderChores` for kanban layout; recompute point multiplier on save (`easy ×1.0, medium ×1.5, hard ×2.0`).
- `app/index.html` — extend `#chores-mychores` panel with 3 kanban columns + chore-add form fields for difficulty/due. Guardian required.
- `app/css/app.css` — kanban grid responsive styles (mobile = stacked, desktop ≥860 = 3 columns).
- Overdue badge (red dot) on the My Chores sub-tab nav when `D.chores.some(c => c.dueDate < today && !verifiedToday(c))`.

**Verifiable:** Adding a Hard chore awards 2× points on verification; an unverified chore past its due_date shows an overdue badge on the sub-tab.

### Increment 3 — Photo proof + Chore Store consolidation

**Goal:** Photo proof end-to-end (kid takes → uploads → parent reviews) + collapse the two reward stores into one.

**Touches:**
- **Supabase Storage:** create `chore-proofs` bucket per §4. RLS policy. Tested via Supabase Studio.
- `app/js/chores.js` — `markChoreDone` accepts an optional File; calls Supabase Storage upload; writes `chore_completions.photo_url`.
- `app/js/email.js` — extend `renderPhPendingChores` to show the photo preview (`<img src={signedUrl}>`) in the parent verification card.
- `app/js/chores.js` + `app/js/email.js` — **store consolidation**: rename `#choreRewardsShop` to point at `D.pb.storeItems` instead of `D.rewards`. Add a one-time migration in `initChoreData()`: if `D.rewards.length && !D.pb.storeItems.find(matching)`, copy across, then mark `D.rewardsLegacyMigrated=true` to never run twice.
- `app/index.html` — `#chores-store` panel pulls in the PB store renderer (already lives in email.js for `s-rewards`). Guardian required.

**Verifiable:** Submitting a chore with a photo writes to `chore-proofs` bucket; parent sees the image in the pending list; after `D.rewards` migration runs once, the new sub-tab shows the unified store.

### Increment 4 — Streaks sub-tab + Leaderboard sub-tab + History sub-tab

**Goal:** Three "read-only" sub-tabs that surface existing data in dedicated screens.

**Touches:**
- `docs/migrations/chore-streaks.sql` — per §3 Option B (new `chore_streaks` table; flag the consolidation-debt to Option C).
- `app/js/chores.js` — new `updateChoreStreak()` writes to `chore_streaks` on each verification; renderer for the streaks sub-tab (current/longest + 12-week heatmap, reusing the SVG/grid pattern from `habits.js:buildHabitsHeatmap`).
- `app/js/chores.js` — `renderChoreLeaderboard()` — reuses `D._profiles` (multi-profile array) to rank by `chorePoints.total`. Identical logic to `renderParentLeaderboard()` in `parent.js:3207`.
- `app/js/chores.js` — `renderChoreHistory()` — full `D.choreLog` with filters (status, date range, chore name search) + monthly summary cards.
- `app/index.html` — populate `#chores-streaks`, `#chores-leaderboard`, `#chores-history` panels. Guardian required.

**Verifiable:** Streaks heatmap shows 12 weeks of data; leaderboard matches `s-contests` version; history supports filter-by-status.

### Increment 5 — AI Coach + achievement badges + seasonal packs + drag-drop

**Goal:** Premium-tier polish layer.

**Touches:**
- `api/ai-summary.js` — new mode `'chore-coach'` (Haiku, ~350 tokens). Inputs: last 7 days of `chore_completions`. Output: 1 paragraph summary + 1 next-week focus suggestion. **Keep CommonJS** per CLAUDE.md (switching to ESM has caused 502s).
- `app/js/chores.js` — AI coach card on the My Chores sub-tab, calls the API weekly (cache result in `D.choreCoachLastWeek`).
- `app/js/traits.js` — add a `Steward` trait (or extend an existing one with chore-tied level-ups: First Chore = +1 XP, 7-day streak = +5, 100 pts = +10, etc.). 10 trigger conditions = 10 effective badges.
- `app/js/data/chore-packs.js` — NEW data file with 4-6 seasonal packs (Spring Cleaning, Back to School, Summer Outdoor, Holiday Prep). Parent button "Add pack to chore list" inside the Parent Hub `ph-chores` panel.
- `app/js/chores.js` — HTML5 drag-and-drop in the My Chores kanban (`dragstart`/`dragover`/`drop`); persist via `chores.sort_order`.

**Verifiable:** AI coach card returns a sensible weekly summary; adding a pack inserts 6-8 chores at once; dragging a chore within a column persists across reload; the Steward trait levels up on the right milestones.

---

## §6 — Risks / open questions

1. **Recurring engine is fake everywhere.** Tab 1 needs at least minimally-real recurrence to honor due dates. Real RRULE-style is a shared concern with Schedule (audit P0). Recommend a minimal recurrence helper inside Tab 1 (daily/weekly/monthly auto-generate next due_date on verify) and tag the larger consolidation as a separate task.
2. **Streak engine consolidation (audit cross-cutting #1).** Tab 1 makes the count 9 → 10 if we add `chore_streaks`. Option C (generic `streak_type` discriminator) is the right long-term answer but bigger than this tab. Plan-of-record: ship Option B for Tab 1, file Option C as a follow-up.
3. **Two "I Did Something Helpful" surfaces.** `D.selfChores` (`s-chores`) and `D.helpfulDeeds` (`s-contests`) cover the same concept. Recommend collapsing in Increment 3, but flagging as a separate decision since the contests UI is parent-facing reward-tied and the chores UI is kid-facing point-tied.
4. **`D.rewards` → `D.pb.storeItems` migration.** One-time copy on first load post-Increment 3. Need to be careful: users with both populated could end up with duplicates. Plan: skip-copy if name already exists in pb.storeItems.
5. **Guardian frequency.** Increments 1, 2, 3, 4 all touch `app/index.html`. Each will run the guardian. The handoff's tail-integrity discipline is enforced.

---

## §7 — What this plan does NOT do

- No SQL run. Migrations described in §3 are *sketches* — final SQL goes through `_TEMPLATE.sql`, gets reviewed, and runs in Supabase Studio on user approval per increment.
- No code edits. Every "Touches" bullet above is a forward statement of work; nothing is staged.
- No commits, no pushes.
- No changes to the Well. The handoff's "Never touch the faith Well experience" guardrail applies.
- No changes to `app/index.html` tail. Every increment that does touch index.html ends with index-html-guardian PASS before commit.

---

## §8 — Locked-in decisions (2026-06-04)

The plan's open decisions were resolved as follows:

1. **Streak schema:** **Option B** — new `chore_streaks` table for Tab 1. File Option C (generic `streak_type` discriminator across `user_streaks`) as a separate cross-cutting follow-up task that consolidates all 9 disconnected streak trackers (audit cross-cutting #1).
2. **Start increment:** **Increment 1** — sub-tab shell + persistence migration. New `public.chores` and `public.chore_completions` tables; dual-write from JSONB; no UX behavior change.
3. **Kanban timing:** **Stage it.** Increment 1 keeps the flat today-list inside the new `#chores-mychores` panel. Increment 2 replaces it with the 3-column kanban + difficulty + due dates.

---

## §9 — Tracked follow-ups

Open work surfaced during the increments that is intentionally NOT in scope for the current step. Each item lives here so it isn't forgotten when the build pauses.

### §9.1 — Chore photo cleanup (filed 2026-06-05, after Increment 3)

**What:** Wire end-to-end cleanup for chore-proof photos. The DELETE storage policy already exists (see `docs/migrations/chore-proofs-bucket.sql` — `"chore_proofs_delete_own"`), so the path is unblocked at the policy layer. The remaining work is purely application-side.

**Three trigger points** that need to fire `supa.storage.from('chore-proofs').remove([path])`:

1. **On chore delete** (`removeChore` in `parent.js`): when a chore is removed entirely, gather every `D.choreLog` entry's `photoPath` for that `choreId` and delete them all in one call. `chore_completions` rows cascade automatically via the existing FK, but storage objects do not.
2. **On verify** (`verifyChore` in `chores.js`): once a chore is verified, the photo's evidentiary purpose is done. Delete it after a configurable grace window (default 30 days) so the parent can re-review if needed. Cleanest place: a sweep helper that runs on next save after the grace expiry.
3. **Auto-purge after a window** (`initChoreData` or a dedicated sweep): nightly-ish sweep that lists every `D.choreLog.photoPath` older than N days and removes the corresponding storage objects. N defaults to 90 days; configurable via `D.chorePhotoRetainDays`.

**Implementation hints:**
- The `_uploadChoreProof` path scheme already encodes the user, profile, chore, and timestamp, so cleanup queries are tractable: `delete from storage.objects where bucket_id='chore-proofs' and name like '<userId>/<profileId>/<choreId>/%'`.
- Path-prefix delete via the SDK: `supa.storage.from('chore-proofs').remove([path1, path2, ...])`. Batches of ≤100.
- For the dual-write side, also `update public.chore_completions set photo_url = null where photo_url = '<path>'` so the cloud rows don't point at deleted objects. The signed-URL renderer in `email.js` already degrades to "Photo unavailable" if the object 404s, so this update is for cleanliness, not correctness.
- Defensive: never delete photos for a log entry whose `status='pending'` — that's a parent who hasn't reviewed yet.

**Out of scope here:** photo compression, thumbnail generation, EXIF stripping. Separate hardening pass if/when needed.

---

*End of plan. Tab 1 Increments 1-3 shipped. Increment 4 (Streaks + Leaderboard + History sub-tabs) is the next live build target — not started yet.*
