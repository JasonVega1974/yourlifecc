-- ═══════════════════════════════════════════════════════════════
-- F2-E — Prayer Requests
-- ═══════════════════════════════════════════════════════════════
--
-- Status: OPTIONAL for F2-E ship.
--
-- F2-E currently stores prayers inside D.prayers (cloud-synced via the
-- existing profiles.data blob). That works for single-user prayer wall.
-- Run this migration when family-shared prayer wall lands (F2-H), or
-- earlier if you want prayer analytics / community wall queryable
-- independently of the data blob.
--
-- After running this in the Supabase SQL editor, faith.js will start
-- preferring the dedicated table when available and fall back to D.prayers
-- otherwise.
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.prayer_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  text          text not null,
  type          text not null default 'request',  -- 'request' | 'praise'
  category      text not null default 'self',     -- 'self' | 'family' | 'friend' | 'world'
  privacy       text not null default 'private',  -- 'private' | 'family' | 'community'
  answered      boolean not null default false,
  answered_at   timestamptz,
  answer_text   text,
  created_at    timestamptz not null default now()
);

-- Index for "list my active prayers" — common Prayer panel read.
create index if not exists prayer_requests_user_status_idx
  on public.prayer_requests (user_id, answered, created_at desc);

-- Family-wall index (visible-to-family rows). F2-H queries this when
-- rendering the family prayer wall on Parent Hub.
create index if not exists prayer_requests_family_idx
  on public.prayer_requests (privacy, created_at desc)
  where privacy in ('family','community');

-- ── RLS ──────────────────────────────────────────────────────
alter table public.prayer_requests enable row level security;

-- A user can always see their own rows.
drop policy if exists "prayer_requests_select_own" on public.prayer_requests;
create policy "prayer_requests_select_own"
  on public.prayer_requests for select
  using (auth.uid() = user_id);

drop policy if exists "prayer_requests_insert_own" on public.prayer_requests;
create policy "prayer_requests_insert_own"
  on public.prayer_requests for insert
  with check (auth.uid() = user_id);

drop policy if exists "prayer_requests_update_own" on public.prayer_requests;
create policy "prayer_requests_update_own"
  on public.prayer_requests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "prayer_requests_delete_own" on public.prayer_requests;
create policy "prayer_requests_delete_own"
  on public.prayer_requests for delete
  using (auth.uid() = user_id);

-- F2-H will add a cross-user policy that lets family members read
-- privacy='family' rows belonging to other accounts in the same family.
-- That requires a families/family_members table not yet defined.
-- For now: every row is strictly per-user even if marked privacy='family'.

-- ── VERIFY ───────────────────────────────────────────────────
-- Cross-user RLS check (should return 0 rows when run as a user
-- whose auth.uid() does NOT match user_id):
--   select count(*) from prayer_requests
--   where user_id != auth.uid();
