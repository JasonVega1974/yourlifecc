-- ═══════════════════════════════════════════════════════════════
-- F2-B — Faith Plan Progress (Reading Plans)
-- ═══════════════════════════════════════════════════════════════
--
-- Status: OPTIONAL for F2-B ship.
--
-- F2-B currently stores plan progress inside D.faithPlans (cloud-synced
-- via the existing profiles.data blob). That works for single-user plans.
-- Run this migration when family-shared plan progress lands (F2-H), or
-- earlier if you want plan analytics queryable independently of the
-- giant data blob.
--
-- After running this in the Supabase SQL editor, faith.js will start
-- preferring the dedicated table when available and fall back to D.faithPlans
-- otherwise (zero downtime — both paths share the same shape).
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.faith_plan_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  plan_id         text not null,
  current_day     int  not null default 1,
  total_days      int  not null,
  completed_days  jsonb not null default '{}'::jsonb, -- { "1": "2026-05-05T18:21:09Z", ... }
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  family_shared   boolean not null default false,
  badge_earned    boolean not null default false,
  unique (user_id, plan_id)
);

-- Index for "list my active plans" — common Faith Home read.
create index if not exists faith_plan_progress_user_idx
  on public.faith_plan_progress (user_id, completed_at);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.faith_plan_progress enable row level security;

-- A user can only see, insert, update, or delete their own rows.
-- Family-shared rows (family_shared=true) become visible to other family
-- members in F2-H via a separate policy referencing a families table —
-- not yet defined. For now, every row is strictly per-user.

drop policy if exists "faith_plan_progress_select_own" on public.faith_plan_progress;
create policy "faith_plan_progress_select_own"
  on public.faith_plan_progress for select
  using (auth.uid() = user_id);

drop policy if exists "faith_plan_progress_insert_own" on public.faith_plan_progress;
create policy "faith_plan_progress_insert_own"
  on public.faith_plan_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "faith_plan_progress_update_own" on public.faith_plan_progress;
create policy "faith_plan_progress_update_own"
  on public.faith_plan_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "faith_plan_progress_delete_own" on public.faith_plan_progress;
create policy "faith_plan_progress_delete_own"
  on public.faith_plan_progress for delete
  using (auth.uid() = user_id);

-- ── VERIFY ───────────────────────────────────────────────────
-- Cross-user RLS check (should return 0 rows when run as a user
-- whose auth.uid() does NOT match user_id):
--   select count(*) from faith_plan_progress
--   where user_id != auth.uid();
