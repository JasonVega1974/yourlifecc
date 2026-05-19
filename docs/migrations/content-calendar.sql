-- ═══════════════════════════════════════════════════════════════
-- Phase 4A — Admin Content Calendar
-- Creates featured_content table for scheduled Well homepage cards.
--
-- Access pattern:
--   - Admin creates/updates via api/content-calendar.js (service key)
--   - Authenticated users read today's published entry via GET
--   - RLS: authenticated SELECT if is_published = true AND
--           scheduled_date <= today.  Writes: service role only.
--
-- Run in the Supabase SQL editor (project: hrohgwcbfgywkpnvqxhk).
--
-- To reverse:
--   drop table if exists public.featured_content;
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.featured_content (
  id             uuid        primary key default gen_random_uuid(),
  title          text        not null,
  content_type   text        not null,
  content_body   text        not null,
  scheduled_date date        not null,
  is_published   boolean     not null default false,
  author         text,
  cta_label      text,
  cta_action     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── Enum check ──────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'featured_content_type_chk'
  ) then
    alter table public.featured_content
      add constraint featured_content_type_chk
      check (content_type in ('verse','devotional','challenge','announcement','study_prompt'));
  end if;
end$$;

-- One published entry per date — enforces uniqueness at DB layer.
-- Wrap in DO block for idempotency.
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where tablename = 'featured_content'
      and indexname = 'featured_content_date_unique'
  ) then
    create unique index featured_content_date_unique
      on public.featured_content (scheduled_date)
      where is_published = true;
  end if;
end$$;

-- Index for "today's published content" read
create index if not exists featured_content_date_pub_idx
  on public.featured_content (scheduled_date, is_published);

-- ── RLS ─────────────────────────────────────────────────────────
alter table public.featured_content enable row level security;

-- Authenticated users can read published content scheduled for today or earlier
drop policy if exists "featured_content_select_published" on public.featured_content;
create policy "featured_content_select_published"
  on public.featured_content for select
  using (
    auth.role() = 'authenticated'
    and is_published = true
    and scheduled_date <= current_date
  );

-- No INSERT / UPDATE / DELETE policies.
-- All writes go through api/content-calendar.js using SUPA_SERVICE_KEY,
-- which bypasses RLS (service role).

-- ── Auto-update updated_at ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists featured_content_updated_at on public.featured_content;
create trigger featured_content_updated_at
  before update on public.featured_content
  for each row execute function public.set_updated_at();
