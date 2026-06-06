-- ═══════════════════════════════════════════════════════════════
-- Chore Streaks Schema — Tab 1 Increment 4
-- ═══════════════════════════════════════════════════════════════
--
-- Status: OPTIONAL for the Streaks sub-tab UI ship.
--
-- The Streaks sub-tab renders entirely from D.choreLog (JSONB-first)
-- so the UI works with zero migration. This table backs the cloud
-- mirror that updateChoreStreak() writes on every verification — so
-- per-profile streak data survives cloudLoad and is queryable for
-- cross-profile leaderboard work down the line.
--
-- Per the locked plan decision (CHORES_BUILD_PLAN.md §8): Option B —
-- a dedicated chore_streaks table. The cross-cutting streak
-- consolidation (Option C — generic streak_type discriminator across
-- a single user_streaks table) is tracked separately under audit
-- cross-cutting #1 as a follow-up.
--
-- ── PIN → stable-id rework (Phase 1, v249) — IMPORTANT ────────
--
-- profile_id in THIS table is populated from `_pidOf(activeProfile)`
-- (parent.js, added in v249 of the PIN → stable-id decouple). Every
-- profile in the user's account already has a stableId backfilled by
-- initProfiles, so every row written from day 1 carries the stable
-- id — NOT the 4-digit PIN.
--
-- This is in contrast to public.chores / public.chore_completions
-- which still carry PIN-keyed profile_id values from earlier
-- increments — those will be remapped by the Phase 2 server-side
-- migration documented in chores-schema.sql.
--
-- ✓ chore_streaks has no PIN debt.
-- ✓ No remap needed when Phase 2 ships.
--
-- ── Schema shape ──────────────────────────────────────────────
--
-- Composite PK (user_id, profile_id) — one row per profile per
-- account. That index is sufficient for every read: the renderer
-- always filters by user_id (via RLS) and either the active profile
-- (single-row lookup) or scans all rows for that user (the future
-- leaderboard cross-profile read).
--
-- Columns map 1:1 to _choreStreakStats() in chores.js:
--   current_streak  — consecutive days up to today w/ ≥ 1 verified
--   longest_streak  — longest run anywhere in history
--   last_completed  — most recent date with a verified chore
--   total_verified  — distinct days with ≥ 1 verified chore (lifetime)
--
-- updated_at carries the upsert timestamp so admin queries can tell a
-- stale streak (kid stopped using the app) from a fresh one.
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.chore_streaks (
  user_id        uuid references auth.users(id) on delete cascade not null,
  profile_id     text not null default '_solo',
  current_streak int  not null default 0,
  longest_streak int  not null default 0,
  last_completed date,
  total_verified int  not null default 0,
  updated_at     timestamptz not null default now(),
  primary key (user_id, profile_id)
);

-- The composite PK already provides the index used by every read
-- path (user_id filter via RLS + profile_id). No secondary index
-- needed.

-- ── RLS ────────────────────────────────────────────────────────
-- Per-operation policies, matching the canonical pattern used by
-- chores-schema.sql, chore-proofs-bucket.sql, and faith-activity.sql.

alter table public.chore_streaks enable row level security;

drop policy if exists "chore_streaks_select_own" on public.chore_streaks;
create policy "chore_streaks_select_own"
  on public.chore_streaks for select
  using (auth.uid() = user_id);

drop policy if exists "chore_streaks_insert_own" on public.chore_streaks;
create policy "chore_streaks_insert_own"
  on public.chore_streaks for insert
  with check (auth.uid() = user_id);

drop policy if exists "chore_streaks_update_own" on public.chore_streaks;
create policy "chore_streaks_update_own"
  on public.chore_streaks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "chore_streaks_delete_own" on public.chore_streaks;
create policy "chore_streaks_delete_own"
  on public.chore_streaks for delete
  using (auth.uid() = user_id);

-- ── Data API exposure grants (Oct 30 2026 compliance) ──
-- Tables created after Oct 30, 2026 require explicit GRANTs for the
-- Data API to see them; RLS still gates per-row access. Idempotent.
grant select, insert, update, delete on public.chore_streaks to authenticated;
grant all on public.chore_streaks to service_role;
