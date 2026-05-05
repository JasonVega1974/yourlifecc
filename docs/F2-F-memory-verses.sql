-- ═══════════════════════════════════════════════════════════════
-- F2-F — Memory Verses (Spaced Repetition)
-- ═══════════════════════════════════════════════════════════════
--
-- Status: OPTIONAL for F2-F ship.
--
-- F2-F currently stores memory verses inside D.memoryVerses (cloud-synced
-- via the existing profiles.data blob). That works for single-user SR.
-- Run this migration when family leaderboards land (post-F2-H), or
-- earlier if you want SR analytics queryable independently.
--
-- Schema matches spec §4.5 with two extras: total_reviews and correct_reviews
-- for accuracy stats, plus a mastered flag for fast filtering.
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.memory_verses (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  reference        text not null,                -- "Phil 4:13"
  text             text not null,
  category         text not null default 'identity',
  ease             numeric not null default 2.5,
  interval_days    int     not null default 1,
  next_due         date    not null default current_date,
  last_reviewed    timestamptz,
  total_reviews    int     not null default 0,
  correct_reviews  int     not null default 0,
  mastered         boolean not null default false,
  mastered_at      timestamptz,
  created_at       timestamptz not null default now(),
  unique (user_id, reference)
);

-- Index for "what's due today" — primary panel read.
create index if not exists memory_verses_user_due_idx
  on public.memory_verses (user_id, mastered, next_due);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.memory_verses enable row level security;

drop policy if exists "memory_verses_select_own" on public.memory_verses;
create policy "memory_verses_select_own"
  on public.memory_verses for select
  using (auth.uid() = user_id);

drop policy if exists "memory_verses_insert_own" on public.memory_verses;
create policy "memory_verses_insert_own"
  on public.memory_verses for insert
  with check (auth.uid() = user_id);

drop policy if exists "memory_verses_update_own" on public.memory_verses;
create policy "memory_verses_update_own"
  on public.memory_verses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "memory_verses_delete_own" on public.memory_verses;
create policy "memory_verses_delete_own"
  on public.memory_verses for delete
  using (auth.uid() = user_id);

-- ── VERIFY ───────────────────────────────────────────────────
-- Cross-user RLS check (should return 0 rows when run as a user
-- whose auth.uid() does NOT match user_id):
--   select count(*) from memory_verses
--   where user_id != auth.uid();
