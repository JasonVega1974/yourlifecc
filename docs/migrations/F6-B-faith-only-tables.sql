-- ═══════════════════════════════════════════════════════════════
-- F6-B — Faith-Only Tables
--        (donations, announcements, ministry_highlights)
-- ═══════════════════════════════════════════════════════════════
--
-- Status: REQUIRED before Phase 6.3 (notification bell), Phase 6.4
-- (donation flow), and the F6 stripe-webhook extension.
--
-- Three new tables, all with RLS enabled. Pattern matches
-- F2-E-prayer-requests.sql / F2-F-memory-verses.sql.
--
-- 1. donations — Stripe payment_intent and subscription donation
--    events. user_id is NULLABLE (anonymous donations supported,
--    e.g. someone donates from a public link without an account).
--    SELECT-own policy only; writes are service-role from the
--    webhook (bypassing RLS).
-- 2. announcements — system push for the notification bell mode 2.
--    Any authenticated user can read currently-active items
--    matching their audience.
-- 3. ministry_highlights — sponsor / matching-campaign push for
--    bell mode 3. Same select policy as announcements.
--
-- Enum CHECK constraints are ENABLED on text columns that are
-- de facto enums (status, audience).
--
-- Reversibility:
--   drop table public.ministry_highlights;
--   drop table public.announcements;
--   drop table public.donations;
-- DROP TABLE is destructive and cannot be undone without a backup.
-- Run F6-A before F6-B (F6-A is technically independent but is
-- expected to land first as part of the same Phase 6.0 ship).
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════
-- 1. donations
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.donations (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid references auth.users(id) on delete set null,
  stripe_payment_intent_id    text,
  stripe_subscription_id      text,
  amount_cents                integer not null check (amount_cents >= 0),
  currency                    text not null default 'usd',
  status                      text not null,
  is_recurring                boolean not null default false,
  campaign_id                 text,
  donor_email                 text,
  created_at                  timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'donations_status_chk') then
    alter table public.donations
      add constraint donations_status_chk
      check (status in ('succeeded','failed','refunded','pending'));
  end if;
end$$;

-- Index for "list my donation history" — Phase 6 year-end statements
-- and the Settings → Donation history view.
create index if not exists donations_user_idx
  on public.donations (user_id, created_at desc);

-- Index for webhook idempotency: payment_intent.succeeded fires once
-- per intent, but Stripe retries on 5xx. Lookup by intent ID lets us
-- detect "already inserted" if we ever need defensive de-dup.
create index if not exists donations_intent_idx
  on public.donations (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

-- Index for recurring-donation lookups (used by the Customer Portal
-- callback to surface "your monthly donation" in Settings).
create index if not exists donations_subscription_idx
  on public.donations (stripe_subscription_id)
  where stripe_subscription_id is not null;

alter table public.donations enable row level security;

drop policy if exists "donations_select_own" on public.donations;
create policy "donations_select_own"
  on public.donations for select
  using (auth.uid() = user_id);

-- No INSERT / UPDATE / DELETE policies. Writes are service-role only,
-- bypassing RLS. The Stripe webhook (running with SUPABASE_SERVICE_
-- ROLE_KEY, a.k.a. SUPA_SERVICE_KEY) is the only authorized writer.


-- ═══════════════════════════════════════════════════════════════
-- 2. announcements (notification bell mode 2)
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  preview      text not null,
  body_html    text,
  cta_label    text,
  cta_href     text,
  audience     text not null default 'all',
  start_at     timestamptz not null default now(),
  end_at       timestamptz,
  created_at   timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'announcements_audience_chk') then
    alter table public.announcements
      add constraint announcements_audience_chk
      check (audience in ('all','faith_only','paid','kids','youth','adult','family'));
  end if;
end$$;

-- Index for "fetch active announcements" — primary bell read.
create index if not exists announcements_active_idx
  on public.announcements (start_at, end_at);

alter table public.announcements enable row level security;

drop policy if exists "announcements_select_active" on public.announcements;
create policy "announcements_select_active"
  on public.announcements for select
  using (
    auth.role() = 'authenticated'
    and start_at <= now()
    and (end_at is null or end_at >= now())
  );

-- No INSERT / UPDATE / DELETE policies. Admin pushes via service role
-- (admin.html or the Supabase SQL editor for now; Phase 6.x adds an
-- admin UI).


-- ═══════════════════════════════════════════════════════════════
-- 3. ministry_highlights (notification bell mode 3)
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.ministry_highlights (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  preview            text not null,
  body_html          text,
  cta_label          text,
  cta_href           text,
  audience           text not null default 'all',
  is_donation_match  boolean not null default false,
  match_multiplier   numeric(3,1),
  start_at           timestamptz not null default now(),
  end_at             timestamptz,
  created_at         timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ministry_highlights_audience_chk') then
    alter table public.ministry_highlights
      add constraint ministry_highlights_audience_chk
      check (audience in ('all','faith_only','paid','kids','youth','adult','family'));
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ministry_highlights_multiplier_chk') then
    alter table public.ministry_highlights
      add constraint ministry_highlights_multiplier_chk
      check (
        match_multiplier is null
        or (match_multiplier >= 1.0 and match_multiplier <= 10.0)
      );
  end if;
end$$;

-- Index for "fetch active ministry highlights" — bell mode 3 read.
create index if not exists ministry_highlights_active_idx
  on public.ministry_highlights (start_at, end_at);

alter table public.ministry_highlights enable row level security;

drop policy if exists "ministry_highlights_select_active" on public.ministry_highlights;
create policy "ministry_highlights_select_active"
  on public.ministry_highlights for select
  using (
    auth.role() = 'authenticated'
    and start_at <= now()
    and (end_at is null or end_at >= now())
  );

-- No INSERT / UPDATE / DELETE policies. Admin pushes via service role.
