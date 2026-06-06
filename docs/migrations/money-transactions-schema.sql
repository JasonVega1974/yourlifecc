-- ═══════════════════════════════════════════════════════════════
-- Money Transactions Schema — Tab 2 Increment 2
-- ═══════════════════════════════════════════════════════════════
--
-- Status: OPTIONAL for the Transactions sub-tab UI ship.
--
-- The Transactions sub-tab renders entirely from D.transactions
-- (JSONB-first) so the UI works with zero migration. This table
-- backs the dual-write mirror that _mirrorMoneyToCloud() writes on
-- every successful cloudSync — so per-profile transaction history
-- survives cloudLoad, is queryable across devices, and unlocks
-- future cross-profile reports (Parent Hub weekly digest, etc.).
--
-- Per TAB2_MONEY_BUILD_PLAN.md §5 (post-amendment): Inc 2 lifts the
-- four Money tables to cloud one at a time. money_transactions
-- ships first because it's the highest-write surface and unblocks
-- the CSV export expectation for cross-device receipt-keeping.
-- money_goals / budget_categories / allowance_credits follow.
--
-- ── PIN → stable-id rework (Phase 1, v249) — IMPORTANT ────────
--
-- profile_id in THIS table is populated from `_pidOf(activeProfile)`
-- (parent.js, added in v249 of the PIN → stable-id decouple). Every
-- profile in the user's account already has a stableId backfilled by
-- initProfiles, so every row written from day 1 carries the stable
-- id — NOT the 4-digit PIN.
--
-- This is in contrast to public.chores / public.chore_completions
-- which still carry PIN-keyed profile_id values from earlier
-- increments — those will be remapped by the Phase 2 server-side
-- migration documented in chores-schema.sql.
--
-- ✓ money_transactions has no PIN debt.
-- ✓ No remap needed when Phase 2 ships.
--
-- ── Schema shape ──────────────────────────────────────────────
--
-- The text PK matches the chores pattern: 'tx_<profile_id>_<n>'.
-- The trailing <n> is the original Date.now() id from D.transactions
-- (numeric) coerced to text by _mirrorMoneyToCloud(). This namespaces
-- sibling profiles so two kids logging a transaction at the same
-- millisecond can never collide.
--
-- type carries 'savings' and 'transfer' in addition to the spec's
-- income/expense pair — back-compat with existing D.transactions
-- entries created before Inc 1 (Savings Transfer was a third type
-- option in the legacy form). The constraint stays permissive on
-- purpose; dropping the legacy types would orphan rows on upsert.
--
-- "date" is quoted because date is also a Postgres TYPE name. Reads
-- ergonomically as `select "date" from money_transactions`; ordering
-- works the same.
--
-- receipt_path is reserved for Increment 6 (savings-goal + receipt
-- photos via the money-receipts storage bucket). Accepting it now
-- avoids an ALTER TABLE later — the column is nullable and Inc 2 /
-- 3 ignore it.
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.money_transactions (
  id           text primary key,                            -- 'tx_<profile>_<n>'
  user_id      uuid references auth.users(id) on delete cascade not null,
  profile_id   text not null default '_solo',               -- _pidOf(active) stable id
  amount       numeric(10,2) not null,
  type         text not null
               check (type in ('income','expense','savings','transfer')),
  category     text,
  description  text not null default '',
  "date"       date not null default current_date,
  receipt_path text,                                        -- reserved for Inc 6 (money-receipts bucket)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Index for the renderer's "newest first" sort + Parent Hub
-- per-profile rollups. The PK already indexes by id; this composite
-- supports the actual read path: filter user_id (via RLS), narrow
-- by profile_id, sort by date desc.
create index if not exists money_transactions_user_profile_date_idx
  on public.money_transactions (user_id, profile_id, "date" desc);

-- ── RLS ────────────────────────────────────────────────────────
-- Per-operation policies matching the canonical pattern used by
-- chores-schema.sql, chore_streaks-schema.sql, faith-activity.sql.

alter table public.money_transactions enable row level security;

drop policy if exists "money_transactions_select_own" on public.money_transactions;
create policy "money_transactions_select_own"
  on public.money_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "money_transactions_insert_own" on public.money_transactions;
create policy "money_transactions_insert_own"
  on public.money_transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "money_transactions_update_own" on public.money_transactions;
create policy "money_transactions_update_own"
  on public.money_transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "money_transactions_delete_own" on public.money_transactions;
create policy "money_transactions_delete_own"
  on public.money_transactions for delete
  using (auth.uid() = user_id);

-- ── Data API exposure grants (Oct 30 2026 compliance) ──
-- Tables created after Oct 30, 2026 require explicit GRANTs for the
-- Data API to see them; RLS still gates per-row access. Idempotent.
grant select, insert, update, delete on public.money_transactions to authenticated;
grant all on public.money_transactions to service_role;
