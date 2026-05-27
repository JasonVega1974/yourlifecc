-- ═══════════════════════════════════════════════════════════════
-- Phase 3A — Bible Study Group Sharing
-- Three tables: study_groups, study_group_members, shared_lessons
-- Run this entire file in the Supabase SQL editor
-- (project: hrohgwcbfgywkpnvqxhk) before deploying any code.
--
-- Reversibility:
--   drop table if exists shared_lessons;
--   drop table if exists study_group_members;
--   drop table if exists study_groups;
-- ═══════════════════════════════════════════════════════════════

-- ── 1. study_groups ──────────────────────────────────────────
create table if not exists study_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  code        text not null unique,          -- 6-char invite code
  owner_id    uuid not null references auth.users(id) on delete cascade,
  church_name text,
  created_at  timestamptz not null default now()
);

alter table study_groups enable row level security;

-- Anyone can look up a group by invite code (needed for join flow)
create policy "read_by_code"
  on study_groups for select
  using (true);

-- Only the owner can update or delete
create policy "owner_manage"
  on study_groups for all
  using (owner_id = auth.uid());

-- Any authenticated user can create a group
create policy "auth_insert"
  on study_groups for insert
  with check (owner_id = auth.uid());

-- ── 2. study_group_members ────────────────────────────────────
create table if not exists study_group_members (
  group_id    uuid not null references study_groups(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table study_group_members enable row level security;

-- Members can see who else is in their groups
create policy "members_read"
  on study_group_members for select
  using (
    user_id = auth.uid()
    or group_id in (
      select group_id from study_group_members where user_id = auth.uid()
    )
  );

-- Users can join (insert their own row)
create policy "self_join"
  on study_group_members for insert
  with check (user_id = auth.uid());

-- Users can leave (delete their own row); owner can remove members
create policy "self_or_owner_leave"
  on study_group_members for delete
  using (
    user_id = auth.uid()
    or group_id in (
      select id from study_groups where owner_id = auth.uid()
    )
  );

-- ── 3. shared_lessons ─────────────────────────────────────────
create table if not exists shared_lessons (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references study_groups(id) on delete cascade,
  shared_by   uuid not null references auth.users(id) on delete cascade,
  track       text not null,
  topic       text not null,
  lesson_json jsonb not null,
  note        text,
  shared_at   timestamptz not null default now()
);

alter table shared_lessons enable row level security;

-- Only group members can read shared lessons
create policy "members_read_lessons"
  on shared_lessons for select
  using (
    group_id in (
      select group_id from study_group_members where user_id = auth.uid()
    )
  );

-- Any group member can share a lesson
create policy "members_share"
  on shared_lessons for insert
  with check (
    shared_by = auth.uid()
    and group_id in (
      select group_id from study_group_members where user_id = auth.uid()
    )
  );

-- Sharer or group owner can delete
create policy "sharer_or_owner_delete"
  on shared_lessons for delete
  using (
    shared_by = auth.uid()
    or group_id in (
      select id from study_groups where owner_id = auth.uid()
    )
  );

-- ── Data API exposure grants (added 2026-05-27, Oct 30 2026 compliance) ──
-- Tables created after Oct 30, 2026 require explicit GRANTs for the
-- Data API to see them; RLS still gates per-row access. Idempotent.
grant select, insert, update, delete on study_groups to authenticated;
grant all on study_groups to service_role;
grant select, insert, update, delete on study_group_members to authenticated;
grant all on study_group_members to service_role;
grant select, insert, update, delete on shared_lessons to authenticated;
grant all on shared_lessons to service_role;
