-- ═══════════════════════════════════════════════════════════════
-- Streaks Engine (Phase 1A)
-- user_streaks — one row per user, updated on every faith activity
-- ═══════════════════════════════════════════════════════════════
--
-- Run this in the Supabase SQL editor (project: hrohgwcbfgywkpnvqxhk)
-- before deploying streaks.js.
--
-- Reversibility:
--   drop table public.user_streaks;
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.user_streaks (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references auth.users(id) on delete cascade,
  current_streak          int not null default 0,
  longest_streak          int not null default 0,
  last_active_date        date,
  total_days              int not null default 0,
  study_completions       int not null default 0,
  devotional_completions  int not null default 0,
  updated_at              timestamptz not null default now(),
  unique(user_id)
);

-- Index for fast single-user lookup (only access pattern needed)
create index if not exists user_streaks_user_idx
  on public.user_streaks (user_id);

alter table public.user_streaks enable row level security;

drop policy if exists "Users manage own streaks" on public.user_streaks;
create policy "Users manage own streaks"
  on public.user_streaks for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
