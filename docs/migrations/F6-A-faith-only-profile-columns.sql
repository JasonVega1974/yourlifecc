-- ═══════════════════════════════════════════════════════════════
-- F6-A — Faith-Only Profile Columns
-- ═══════════════════════════════════════════════════════════════
--
-- Status: REQUIRED before Phase 6.1 (registration flow), Phase 6.4
-- (donation flow), and the F6 stripe-webhook extension.
--
-- Adds three columns to the existing public.profiles table:
--   faith_only    — boolean flag set true at faith-only registration.
--                   Read by app/js/auth.js to set window._faithFree
--                   and by the Stripe webhook to skip plan_status
--                   updates (belt-and-suspenders defense).
--   age_tier      — 'kids' | 'youth' | 'adult' | 'family'. Drives
--                   onboarding and content filtering (spec §2).
--   account_role  — 'self' | 'parent' | 'group_leader'. Drives
--                   feature unlock for Family/Group leader paths.
--
-- Enum CHECK constraints are ENABLED. Multiple writers exist (app,
-- Stripe webhook, Brevo, admin), so silent bad-value writes must be
-- prevented at the DB layer. NULL is allowed because legacy rows
-- pre-Phase-6 have no value and we don't want a backfill blocker.
--
-- Reversibility: ADD COLUMN with a default is metadata-only in
-- Postgres 11+ — no rewrite of existing rows. Safe on a live DB.
-- To roll back:
--   alter table public.profiles drop constraint profiles_age_tier_chk;
--   alter table public.profiles drop constraint profiles_account_role_chk;
--   drop index if exists profiles_faith_only_idx;
--   alter table public.profiles drop column faith_only;
--   alter table public.profiles drop column age_tier;
--   alter table public.profiles drop column account_role;
-- (Column data is destroyed on drop — back up first if any rows
--  have been populated.)
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles
  add column if not exists faith_only    boolean not null default false,
  add column if not exists age_tier      text,
  add column if not exists account_role  text;

-- ── Enum CHECK constraints ──────────────────────────────────
-- Postgres has no `add constraint if not exists`. Using DO blocks
-- to make the migration idempotent (safe to re-run).

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_age_tier_chk'
  ) then
    alter table public.profiles
      add constraint profiles_age_tier_chk
      check (
        age_tier is null
        or age_tier in ('kids','youth','adult','family')
      );
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_account_role_chk'
  ) then
    alter table public.profiles
      add constraint profiles_account_role_chk
      check (
        account_role is null
        or account_role in ('self','parent','group_leader')
      );
  end if;
end$$;

-- ── Index ───────────────────────────────────────────────────
-- Partial index — only rows with faith_only=true are indexed.
-- Keeps the index tiny and the lookup O(log n) on the faith subset.
-- Used by the Stripe webhook guard and app/js/auth.js plan checks.

create index if not exists profiles_faith_only_idx
  on public.profiles (user_id) where faith_only = true;

-- ── RLS ─────────────────────────────────────────────────────
-- Existing profiles policies enforce user_id = auth.uid() on every
-- row operation (verified clean in Phase 1.1 hardening, see
-- /docs/F0-followups.md). New columns inherit those policies — no
-- policy changes needed in this migration.
