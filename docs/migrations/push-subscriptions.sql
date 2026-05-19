-- ═══════════════════════════════════════════════════════════════
-- Push Subscriptions (Phase 1B)
-- push_subscriptions — one row per user, updated on re-subscribe
-- ═══════════════════════════════════════════════════════════════
--
-- Run this in the Supabase SQL editor (project: hrohgwcbfgywkpnvqxhk)
-- before deploying api/push-subscribe.js and app/js/init.js changes.
--
-- Reversibility:
--   drop table public.push_subscriptions;
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  subscription jsonb not null,
  created_at   timestamptz default now(),
  unique(user_id)
);

create index if not exists push_subscriptions_user_idx
  on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users manage own subscriptions" on public.push_subscriptions;
create policy "Users manage own subscriptions"
  on public.push_subscriptions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
