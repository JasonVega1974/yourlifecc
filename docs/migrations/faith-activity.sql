-- ═══════════════════════════════════════════════════════════════
-- Phase 3B — Parent Dashboard Faith Reporting
--
-- Architecture note (why no parent_id column):
--   Child profiles are NOT separate Supabase auth users.  The entire
--   family shares ONE Supabase account keyed by the parent's user_id.
--   _profiles[] (localStorage / profiles.data JSONB) holds child names
--   and local 4-digit IDs — none of these are auth.users UUIDs.
--   All family faith activity is therefore stored under the parent's
--   user_id, differentiated by profile_id.  The parent already "owns"
--   every row because user_id = their auth.uid().  No separate
--   parent-access policy is needed.
--
-- Run this in the Supabase SQL editor
-- (project: hrohgwcbfgywkpnvqxhk) before deploying any code.
--
-- To reverse:
--   drop table if exists public.faith_activity_log;
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.faith_activity_log (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  profile_id    text,
  activity_type text        not null,
  activity_date date        not null default current_date,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

-- ── Enum check ──────────────────────────────────────────────────
-- Postgres has no `add constraint if not exists` — DO block makes
-- this migration idempotent (safe to re-run).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'faith_activity_log_type_chk'
  ) then
    alter table public.faith_activity_log
      add constraint faith_activity_log_type_chk
      check (activity_type in (
        'devotional','prayer','memory_verse','study',
        'sermon_note','academy_lesson','reading_plan'
      ));
  end if;
end$$;

-- ── RLS ─────────────────────────────────────────────────────────
alter table public.faith_activity_log enable row level security;

drop policy if exists "faith_activity_log_insert_own" on public.faith_activity_log;
create policy "faith_activity_log_insert_own"
  on public.faith_activity_log for insert
  with check (auth.uid() = user_id);

drop policy if exists "faith_activity_log_select_own" on public.faith_activity_log;
create policy "faith_activity_log_select_own"
  on public.faith_activity_log for select
  using (auth.uid() = user_id);

-- ── Indexes ─────────────────────────────────────────────────────
-- Primary read: "all activity for this family in the last 7 days"
create index if not exists faith_activity_log_user_date_idx
  on public.faith_activity_log (user_id, activity_date desc);

-- Per-child summaries: "prayer activity for profile 1234 this week"
create index if not exists faith_activity_log_profile_type_idx
  on public.faith_activity_log (user_id, profile_id, activity_type, activity_date desc);
