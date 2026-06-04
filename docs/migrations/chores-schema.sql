-- ═══════════════════════════════════════════════════════════════
-- Chores Schema — Tab 1 Increment 1
-- ═══════════════════════════════════════════════════════════════
--
-- Status: OPTIONAL for the initial Chores sub-tab shell ship.
--
-- The Chores tab persists everything through D.chores + D.choreLog
-- inside profiles.data JSONB (cloud-synced via cloudSync()). That
-- works for single-user chores and arrives with zero migration risk.
--
-- Apply this migration when:
--   (a) family leaderboards / shared streak views are wanted
--   (b) admin queries against chore data are needed
--   (c) cross-device sync latency on the blob starts to matter
--   (d) photo proof submissions ship (Increment 3) — chore_completions
--       gains a photo_url that points at the chore-proofs bucket
--
-- After applying, the dual-write paths added to sync.js mirror
-- D.chores rows into public.chores (idempotent upsert on id) and
-- D.choreLog rows into public.chore_completions (UNIQUE chore_id+date).
-- D.chores / D.choreLog stay intact so the existing UI keeps working
-- during the transition.
--
-- Schema follows the habits-schema canonical pattern:
--   - text PK to match the runtime-generated 'ch_…' ids (see sync.js
--     dual-write helper — numeric Date.now() ids are coerced to
--     'ch_<n>' on upsert so existing rows in D.chores keep working)
--   - FK to auth.users(id) on delete cascade (NOT public.profiles)
--   - RLS enabled + per-operation policies keyed on auth.uid() = user_id
--   - Lower-case identifiers, snake_case columns
--
-- Note vs YOURLIFECC_APP_UPGRADE_MASTERPLAN.md: the masterplan proposed
-- ALTER TABLE chores ADD COLUMN difficulty/due_date/recurring/photo_proof_url
-- — but there is no chores table to alter. This migration creates it
-- with those columns built in, sized for Increments 2-3 to use without
-- another schema change.
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

-- ── chores ─────────────────────────────────────────────────────
create table if not exists public.chores (
  id              text primary key,                       -- 'ch_…' from sync.js dual-write coercion
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  emoji           text not null default '📌',
  category        text,                                   -- matches CHORE_CAT_EMOJI keys in chores.js
  points          int  not null default 10,
  difficulty      text not null default 'medium'
                  check (difficulty in ('easy','medium','hard')),
  frequency       text not null default 'daily'
                  check (frequency in ('daily','weekly','monthly','once')),
  due_date        date,
  recurring_rule  text,                                   -- placeholder for future RRULE-style (Increment 2)
  active          boolean not null default true,
  sort_order      int  not null default 0,                -- drag-and-drop priority (Increment 5)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists chores_user_idx
  on public.chores (user_id, active, sort_order);

-- ── chore_completions ──────────────────────────────────────────
create table if not exists public.chore_completions (
  id              uuid primary key default gen_random_uuid(),
  chore_id        text references public.chores(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  completed_date  date not null,
  status          text not null default 'pending'
                  check (status in ('pending','verified','rejected','redeemed')),
  points_awarded  int  not null default 0,
  photo_url       text,                                   -- populated by Increment 3 (chore-proofs bucket)
  verified_by     uuid references auth.users(id),
  verified_at     timestamptz,
  created_at      timestamptz not null default now(),
  unique (chore_id, completed_date)                       -- matches chores.js:63 "already submitted today" guard
);

create index if not exists chore_completions_user_date_idx
  on public.chore_completions (user_id, completed_date desc);

create index if not exists chore_completions_chore_idx
  on public.chore_completions (chore_id, completed_date desc);

-- ── RLS ────────────────────────────────────────────────────────
-- Per-operation policies (matches habits-schema and F2-F memory_verses).

alter table public.chores enable row level security;

drop policy if exists "chores_select_own" on public.chores;
create policy "chores_select_own"
  on public.chores for select
  using (auth.uid() = user_id);

drop policy if exists "chores_insert_own" on public.chores;
create policy "chores_insert_own"
  on public.chores for insert
  with check (auth.uid() = user_id);

drop policy if exists "chores_update_own" on public.chores;
create policy "chores_update_own"
  on public.chores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "chores_delete_own" on public.chores;
create policy "chores_delete_own"
  on public.chores for delete
  using (auth.uid() = user_id);

alter table public.chore_completions enable row level security;

drop policy if exists "chore_completions_select_own" on public.chore_completions;
create policy "chore_completions_select_own"
  on public.chore_completions for select
  using (auth.uid() = user_id);

drop policy if exists "chore_completions_insert_own" on public.chore_completions;
create policy "chore_completions_insert_own"
  on public.chore_completions for insert
  with check (auth.uid() = user_id);

drop policy if exists "chore_completions_update_own" on public.chore_completions;
create policy "chore_completions_update_own"
  on public.chore_completions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "chore_completions_delete_own" on public.chore_completions;
create policy "chore_completions_delete_own"
  on public.chore_completions for delete
  using (auth.uid() = user_id);

-- ── Data API exposure grants (Oct 30 2026 compliance) ──
-- Tables created after Oct 30, 2026 require explicit GRANTs for the
-- Data API to see them; RLS still gates per-row access. Idempotent.
grant select, insert, update, delete on public.chores to authenticated;
grant all on public.chores to service_role;
grant select, insert, update, delete on public.chore_completions to authenticated;
grant all on public.chore_completions to service_role;
