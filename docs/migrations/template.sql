-- ═══════════════════════════════════════════════════════════════
-- MIGRATION TEMPLATE — copy this file, fill in the placeholders.
-- ═══════════════════════════════════════════════════════════════
--
-- Why explicit GRANTs?
--   Supabase's Data API exposure model changes effective Oct 30, 2026.
--   Tables created AFTER that date do NOT automatically grant access
--   to the `authenticated` / `service_role` / `anon` roles — the
--   PostgREST API layer will return 401/403 even with permissive RLS
--   policies in place. Every new table needs explicit GRANTs at the
--   table level so PostgREST can see it; RLS still gates per-row
--   access on top of that.
--
--   Apply this template to every new CREATE TABLE migration. Existing
--   migrations have been retrofitted (see commit history) so they
--   re-run cleanly after the policy change.
--
-- File header convention:
--   - one-line title
--   - what this migration does (1-3 lines)
--   - when to run it / dependencies
--   - reversibility notes (drop statements that undo the migration)
--   - project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

-- ── TABLE DEFINITION ───────────────────────────────────────────
create table if not exists public.new_table_name (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  -- … your columns …
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes for the common reads.
create index if not exists new_table_name_user_idx
  on public.new_table_name (user_id, created_at desc);

-- ── ROW-LEVEL SECURITY ─────────────────────────────────────────
alter table public.new_table_name enable row level security;

-- Per-operation policies keyed on auth.uid() = user_id. This is the
-- canonical pattern (matches F2-F memory_verses and habits-schema).
-- `for all using` would also work but per-op is clearer for auditing.

drop policy if exists "new_table_name_select_own" on public.new_table_name;
create policy "new_table_name_select_own"
  on public.new_table_name for select
  using (auth.uid() = user_id);

drop policy if exists "new_table_name_insert_own" on public.new_table_name;
create policy "new_table_name_insert_own"
  on public.new_table_name for insert
  with check (auth.uid() = user_id);

drop policy if exists "new_table_name_update_own" on public.new_table_name;
create policy "new_table_name_update_own"
  on public.new_table_name for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "new_table_name_delete_own" on public.new_table_name;
create policy "new_table_name_delete_own"
  on public.new_table_name for delete
  using (auth.uid() = user_id);

-- ── DATA API EXPOSURE GRANTS ───────────────────────────────────
-- Required for tables created after Oct 30, 2026. Idempotent — safe
-- to re-run. RLS still gates per-row access; these grants only let
-- PostgREST/the API layer SEE the table.
grant select, insert, update, delete on public.new_table_name to authenticated;
grant all on public.new_table_name to service_role;

-- Only uncomment if your table needs anonymous (signed-out) read access.
-- Rare — most YourLife CC tables are user-scoped via auth.uid().
-- grant select on public.new_table_name to anon;
