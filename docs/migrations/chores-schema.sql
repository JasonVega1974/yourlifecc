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
--     'ch_<profileId>_<n>' on upsert so sibling profiles never collide)
--   - FK to auth.users(id) on delete cascade (NOT public.profiles)
--   - RLS enabled + per-operation policies keyed on auth.uid() = user_id
--   - Lower-case identifiers, snake_case columns
--
-- ── Multi-profile separation (added in this revision) ─────────
-- YourLife CC is multi-profile under one auth account: parent.js
-- maintains _profiles[] (4-digit PIN strings as ids) and _activeProfileId.
-- When Mom switches between Kid A and Kid B in Parent Hub, D.chores
-- flips to that kid's chore set and the next cloudSync writes those
-- rows under Mom's user_id. Without profile_id every kid's chores
-- would intermingle in the same user_id partition, indistinguishable
-- on read.
--
-- profile_id is added to BOTH tables as a non-PK column. The value is
-- supplied by sync.js from _activeProfileId, defaulting to the sentinel
-- '_solo' for accounts that have never entered multi-profile mode.
-- RLS still gates cross-account on auth.uid() = user_id; per-profile
-- separation is filter-side and enforced by app reads.
--
-- Note vs YOURLIFECC_APP_UPGRADE_MASTERPLAN.md: the masterplan proposed
-- ALTER TABLE chores ADD COLUMN difficulty/due_date/recurring/photo_proof_url
-- — but there is no chores table to alter. This migration creates it
-- with those columns built in, sized for Increments 2-3 to use without
-- another schema change.
--
-- ── REQUIRED BEFORE ANY CLOUD-PREFER-READ PATH SHIPS ──────────
-- Solo→multi-profile transition: when a solo account creates its
-- first real _profiles[] entry, the parent's pre-transition chores
-- were mirrored with profile_id='_solo' but the new parent profile
-- gets a 4-digit PIN. Any cloud read that filters by the new
-- profile_id will under-fetch those rows (they orphan as '_solo').
--
-- While Increment 1 reads stay on the JSONB blob this is silent,
-- harmless backlog. But the moment any future increment switches a
-- read from D.* to a Supabase query, we MUST first ship a one-time
-- per-user migration that rewrites:
--    update public.chores            set profile_id = :newId where user_id = :u and profile_id = '_solo';
--    update public.chore_completions set profile_id = :newId where user_id = :u and profile_id = '_solo';
--    update public.chores            set id = replace(id, 'ch__solo_', 'ch_' || :newId || '_') where user_id = :u and id like 'ch__solo_%';
--    update public.chore_completions set chore_id = replace(chore_id, 'ch__solo_', 'ch_' || :newId || '_') where user_id = :u and chore_id like 'ch__solo_%';
-- gated on a per-user "solo_migrated_at" flag (storage TBD —
-- profiles.data flag or a new admin_migrations row). Until that
-- helper exists, do not enable cloud-prefer reads. Tracked here so
-- the next code reviewer sees it before flipping the read path.
--
-- ── Phase 2 PIN → stable-id rework — FK timing (NOT YET LIVE) ─
-- Phase 2 will swap the PIN segment of public.chores.id for the new
-- stable profile id (parent.js _pidOf — see Phase 1 commit), then
-- mirror the rewrite into public.chore_completions.chore_id. The FK
-- created below (chore_id REFERENCES public.chores(id) ON DELETE
-- CASCADE) is declared WITHOUT a DEFERRABLE clause, so Postgres
-- defaults to NOT DEFERRABLE + INITIALLY IMMEDIATE — meaning
-- `SET CONSTRAINTS ALL DEFERRED` inside the migration transaction is
-- a no-op against it and either UPDATE order will violate the FK
-- mid-transaction (rewriting chores.id first orphans completions;
-- rewriting completions.chore_id first points at non-existent
-- chores).
--
-- Two viable approaches before Phase 2 ships:
--
--   (A) PREP MIGRATION (recommended) — one-shot ALTER to make the FK
--       deferrable, then per-user Phase 2 transactions can defer it:
--         ALTER TABLE public.chore_completions
--           DROP CONSTRAINT chore_completions_chore_id_fkey,
--           ADD  CONSTRAINT chore_completions_chore_id_fkey
--             FOREIGN KEY (chore_id) REFERENCES public.chores(id)
--             ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;
--       Then each user-scoped migration runs:
--         BEGIN;
--           SET CONSTRAINTS chore_completions_chore_id_fkey DEFERRED;
--           UPDATE public.chores            SET id      = … WHERE …;
--           UPDATE public.chore_completions SET chore_id = … WHERE …;
--         COMMIT;
--
--   (B) IN-TXN DROP / ADD — heavier lock, no schema prep:
--         BEGIN;
--           ALTER TABLE public.chore_completions
--             DROP CONSTRAINT chore_completions_chore_id_fkey;
--           UPDATE public.chores            SET id      = … WHERE …;
--           UPDATE public.chore_completions SET chore_id = … WHERE …;
--           ALTER TABLE public.chore_completions
--             ADD CONSTRAINT chore_completions_chore_id_fkey
--               FOREIGN KEY (chore_id) REFERENCES public.chores(id)
--               ON DELETE CASCADE;
--         COMMIT;
--       Takes ACCESS EXCLUSIVE on chore_completions for the ADD — fine
--       for a per-user scoped run, painful if ever batched.
--
-- Recommendation: ship (A) as a small prep migration before the Phase
-- 2 cutover. Must be addressed BEFORE Phase 2 — without it the cutover
-- transaction will fail on the first user with both chores and
-- chore_completions rows.
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

-- ── chores ─────────────────────────────────────────────────────
create table if not exists public.chores (
  id              text primary key,                       -- 'ch_<profileId>_<n>' from sync.js dual-write coercion
  user_id         uuid references auth.users(id) on delete cascade not null,
  profile_id      text not null default '_solo',          -- 4-digit PIN from parent.js _profiles, or '_solo'
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

-- Composite index: every app read filters by user_id + profile_id.
-- active + sort_order trail so the "show me this kid's active chores
-- in display order" query is index-only.
create index if not exists chores_user_profile_idx
  on public.chores (user_id, profile_id, active, sort_order);

-- ── chore_completions ──────────────────────────────────────────
create table if not exists public.chore_completions (
  id              uuid primary key default gen_random_uuid(),
  chore_id        text references public.chores(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  profile_id      text not null default '_solo',          -- denormalized for filter-side scoping; matches chores.profile_id
  completed_date  date not null,
  status          text not null default 'pending'
                  check (status in ('pending','verified','rejected','redeemed')),
  points_awarded  int  not null default 0,
  photo_url       text,                                   -- populated by Increment 3 (chore-proofs bucket)
  verified_by     uuid references auth.users(id),
  verified_at     timestamptz,
  created_at      timestamptz not null default now(),
  unique (chore_id, completed_date)                       -- chore_id already namespaces by profile_id, so this remains sufficient
);

-- Composite index: history sub-tab + leaderboard both filter by
-- (user_id, profile_id) and sort by completed_date desc.
create index if not exists chore_completions_user_profile_date_idx
  on public.chore_completions (user_id, profile_id, completed_date desc);

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
