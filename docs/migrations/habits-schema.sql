-- ═══════════════════════════════════════════════════════════════
-- Habits Schema — first-class habits tab (Commit 3 of 3)
-- ═══════════════════════════════════════════════════════════════
--
-- Status: OPTIONAL for the initial Habits tab ship.
--
-- The Habits tab persists everything through D.habitsV2 inside the
-- existing profiles.data JSONB blob (cloud-synced via cloudSync()),
-- the same pattern every other tab uses today. That works for single-
-- user habits and arrives with zero migration risk.
--
-- Apply this migration when:
--   (a) family leaderboards / shared streak views are wanted
--   (b) admin queries against habit data are needed
--   (c) cross-device sync latency on the blob starts to matter
--
-- After applying, run window.migrateHabitsToSupabase() from the
-- browser console while signed in. The helper:
--   - inserts each D.habitsV2[] row into habits (idempotent upsert on id)
--   - inserts each completion into habit_completions (UNIQUE habit_id+date)
--   - leaves D.habitsV2 intact so the existing UI keeps working
--     during the transition
--
-- Schema follows the F2-F memory_verses canonical pattern:
--   - FK to auth.users(id) on delete cascade (NOT public.profiles)
--   - RLS enabled + per-operation policies keyed on auth.uid() = user_id
--   - Lower-case identifiers, snake_case columns
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

-- ── habits ─────────────────────────────────────────────────────
create table if not exists public.habits (
  id            text primary key,                       -- 'hbt_…' from habits.js
  user_id       uuid references auth.users(id) on delete cascade not null,
  name          text not null,
  emoji         text not null default '✅',
  category      text,
  time_of_day   text not null default 'anytime'
                check (time_of_day in ('morning','afternoon','evening','anytime')),
  cue           text,
  stack_after   text references public.habits(id) on delete set null,
  streak        int  not null default 0,
  longest_streak int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists habits_user_idx
  on public.habits (user_id, created_at desc);

-- ── habit_completions ──────────────────────────────────────────
create table if not exists public.habit_completions (
  id              uuid primary key default gen_random_uuid(),
  habit_id        text references public.habits(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  completed_date  date not null,
  note            text,
  created_at      timestamptz not null default now(),
  unique (habit_id, completed_date)
);

create index if not exists habit_completions_user_date_idx
  on public.habit_completions (user_id, completed_date desc);

create index if not exists habit_completions_habit_idx
  on public.habit_completions (habit_id, completed_date desc);

-- ── RLS ────────────────────────────────────────────────────────
-- Per-operation policies (matches F2-F memory_verses); `for all using`
-- would work but per-op is clearer for auditing and matches the rest
-- of the codebase.

alter table public.habits enable row level security;

drop policy if exists "habits_select_own" on public.habits;
create policy "habits_select_own"
  on public.habits for select
  using (auth.uid() = user_id);

drop policy if exists "habits_insert_own" on public.habits;
create policy "habits_insert_own"
  on public.habits for insert
  with check (auth.uid() = user_id);

drop policy if exists "habits_update_own" on public.habits;
create policy "habits_update_own"
  on public.habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "habits_delete_own" on public.habits;
create policy "habits_delete_own"
  on public.habits for delete
  using (auth.uid() = user_id);

alter table public.habit_completions enable row level security;

drop policy if exists "habit_completions_select_own" on public.habit_completions;
create policy "habit_completions_select_own"
  on public.habit_completions for select
  using (auth.uid() = user_id);

drop policy if exists "habit_completions_insert_own" on public.habit_completions;
create policy "habit_completions_insert_own"
  on public.habit_completions for insert
  with check (auth.uid() = user_id);

drop policy if exists "habit_completions_update_own" on public.habit_completions;
create policy "habit_completions_update_own"
  on public.habit_completions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "habit_completions_delete_own" on public.habit_completions;
create policy "habit_completions_delete_own"
  on public.habit_completions for delete
  using (auth.uid() = user_id);
