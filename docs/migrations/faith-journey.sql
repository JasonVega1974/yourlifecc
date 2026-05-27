-- ═══════════════════════════════════════════════════════════════
-- Faith Journey — Worker 2 (Faith Expansion)
-- Tables: faith_journey_entries · faith_profile
-- Project ref: hrohgwcbfgywkpnvqxhk
-- Run in Supabase SQL Editor (Settings → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ── faith_journey_entries ─────────────────────────────────────
-- Stores milestones, donations, events, and journal entries.
-- entry_type: 'milestone' | 'donation' | 'event' | 'journal'

create table if not exists public.faith_journey_entries (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users(id) on delete cascade not null,
  entry_type      text        not null,
  milestone_type  text,
  title           text        not null,
  description     text,
  date            date        not null,
  church_name     text,
  pastor_name     text,
  amount          decimal(10,2),
  is_recurring    boolean     not null default false,
  tags            text[],
  metadata        jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.faith_journey_entries enable row level security;

create policy "Users see own entries"
  on public.faith_journey_entries
  for all
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public._fje_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists fje_updated_at on public.faith_journey_entries;
create trigger fje_updated_at
  before update on public.faith_journey_entries
  for each row execute procedure public._fje_set_updated_at();

-- ── faith_profile ─────────────────────────────────────────────
-- One row per user. Upserted on save.

create table if not exists public.faith_profile (
  user_id                 uuid        primary key references auth.users(id) on delete cascade,
  church_name             text,
  pastor_name             text,
  denomination            text,
  saved_date              date,
  saved_description       text,
  baptism_date            date,
  baptism_description     text,
  spiritual_gifts         text[],
  accountability_partner  text,
  small_group             text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.faith_profile enable row level security;

create policy "Users see own profile"
  on public.faith_profile
  for all
  using (auth.uid() = user_id);

-- ── Data API exposure grants (added 2026-05-27, Oct 30 2026 compliance) ──
-- Tables created after Oct 30, 2026 require explicit GRANTs for the
-- Data API to see them; RLS still gates per-row access. Idempotent.
grant select, insert, update, delete on public.faith_journey_entries to authenticated;
grant all on public.faith_journey_entries to service_role;
grant select, insert, update, delete on public.faith_profile to authenticated;
grant all on public.faith_profile to service_role;
