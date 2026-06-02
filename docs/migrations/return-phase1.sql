-- return-phase1.sql
-- The Return · Phase 1a · 2026-06-02
--
-- Schema + RLS lockdown for the tote inventory app at /return:
--   1. Add events (season scoping), admins (PIN-gated users),
--      audits (append-only chain of custody), pin_attempts (rate limit).
--   2. Add item_number + category columns to return_supply_items.
--   3. Drop the open "anon all" policies from the original schema and
--      replace with SELECT-only for anon. All writes now flow through
--      /api/return-admin (service_role, gated by PIN).
--   4. Explicit GRANTs per Oct 30 2026 Supabase Data API change.
--   5. Seed the first event ("Return - Spring 2026") set active.
--
-- Run in Supabase SQL Editor against the YourLife CC project
-- (ref: hrohgwcbfgywkpnvqxhk). Safe to re-run — IF NOT EXISTS / IF EXISTS
-- guards make every statement idempotent.
--
-- After running, deploy Phase 1b (api/return-admin.js + return.html PIN
-- modal). Until then, all writes from /return will start failing because
-- the anon write policy is gone — that is intentional.

-- ============================================================
-- 1. Events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.return_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label        TEXT NOT NULL UNIQUE,
  is_active    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exactly one event row may have is_active = TRUE.
CREATE UNIQUE INDEX IF NOT EXISTS one_active_return_event
  ON public.return_events ((is_active)) WHERE is_active = TRUE;

ALTER TABLE public.return_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon read return_events"    ON public.return_events;
DROP POLICY IF EXISTS "auth read return_events"    ON public.return_events;
DROP POLICY IF EXISTS "service all return_events"  ON public.return_events;

CREATE POLICY "anon read return_events"   ON public.return_events
  FOR SELECT TO anon USING (TRUE);
CREATE POLICY "auth read return_events"   ON public.return_events
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "service all return_events" ON public.return_events
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

GRANT SELECT ON public.return_events TO anon;
GRANT SELECT ON public.return_events TO authenticated;
GRANT ALL    ON public.return_events TO service_role;

-- ============================================================
-- 2. Admins (PIN-gated users — never store raw PINs)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.return_admins (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,
  pin_hash             TEXT NOT NULL,
  role                 TEXT NOT NULL CHECK (role IN ('owner','operator')),
  active               BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_admin_id  UUID REFERENCES public.return_admins(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at           TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_return_admins_active
  ON public.return_admins(active) WHERE active = TRUE;

ALTER TABLE public.return_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service all return_admins" ON public.return_admins;
CREATE POLICY "service all return_admins" ON public.return_admins
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- No anon / authenticated grants — admins are only accessible via the
-- service_role through /api/return-admin.
GRANT ALL ON public.return_admins TO service_role;

-- ============================================================
-- 3. Audits — append-only chain of custody
-- ============================================================
CREATE TABLE IF NOT EXISTS public.return_audits (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id               UUID NOT NULL REFERENCES public.return_supply_items(id) ON DELETE CASCADE,
  event_id              UUID NOT NULL REFERENCES public.return_events(id),
  on_hand_count         INTEGER NOT NULL,
  prev_count            INTEGER,
  counted_by_admin_id   UUID NOT NULL REFERENCES public.return_admins(id),
  counted_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes                 TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_return_audits_item
  ON public.return_audits(item_id, counted_at DESC);
CREATE INDEX IF NOT EXISTS idx_return_audits_event
  ON public.return_audits(event_id);
CREATE INDEX IF NOT EXISTS idx_return_audits_admin
  ON public.return_audits(counted_by_admin_id);

ALTER TABLE public.return_audits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service all return_audits" ON public.return_audits;
CREATE POLICY "service all return_audits" ON public.return_audits
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

GRANT ALL ON public.return_audits TO service_role;

-- ============================================================
-- 4. PIN attempt tracking (brute-force defence for 6-digit PINs)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.return_pin_attempts (
  ip               TEXT PRIMARY KEY,
  failed_count     INTEGER NOT NULL DEFAULT 0,
  locked_until     TIMESTAMPTZ,
  last_attempt_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.return_pin_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service all return_pin_attempts" ON public.return_pin_attempts;
CREATE POLICY "service all return_pin_attempts" ON public.return_pin_attempts
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

GRANT ALL ON public.return_pin_attempts TO service_role;

-- ============================================================
-- 5. Extend return_supply_items with item_number + category
-- ============================================================
ALTER TABLE public.return_supply_items
  ADD COLUMN IF NOT EXISTS item_number TEXT NOT NULL DEFAULT '';
ALTER TABLE public.return_supply_items
  ADD COLUMN IF NOT EXISTS category    TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_return_items_category
  ON public.return_supply_items(category) WHERE category <> '';

-- ============================================================
-- 6. Lockdown — drop open policies, replace with SELECT-only anon
-- ============================================================
-- Original Phase-0 schema had wide-open "anon all" policies on totes +
-- items. Phase 1 replaces them with read-only anon + service-only writes.
DROP POLICY IF EXISTS "anon all return_totes"     ON public.return_totes;
DROP POLICY IF EXISTS "anon all return_supplies"  ON public.return_supply_items;
DROP POLICY IF EXISTS "anon read return_totes"    ON public.return_totes;
DROP POLICY IF EXISTS "auth read return_totes"    ON public.return_totes;
DROP POLICY IF EXISTS "service all return_totes"  ON public.return_totes;
DROP POLICY IF EXISTS "anon read return_items"    ON public.return_supply_items;
DROP POLICY IF EXISTS "auth read return_items"    ON public.return_supply_items;
DROP POLICY IF EXISTS "service all return_items"  ON public.return_supply_items;

CREATE POLICY "anon read return_totes"   ON public.return_totes
  FOR SELECT TO anon USING (TRUE);
CREATE POLICY "auth read return_totes"   ON public.return_totes
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "service all return_totes" ON public.return_totes
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "anon read return_items"   ON public.return_supply_items
  FOR SELECT TO anon USING (TRUE);
CREATE POLICY "auth read return_items"   ON public.return_supply_items
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "service all return_items" ON public.return_supply_items
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- Explicit GRANTs (Oct 30 2026 Supabase Data API requirement)
GRANT SELECT ON public.return_totes        TO anon;
GRANT SELECT ON public.return_totes        TO authenticated;
GRANT ALL    ON public.return_totes        TO service_role;

GRANT SELECT ON public.return_supply_items TO anon;
GRANT SELECT ON public.return_supply_items TO authenticated;
GRANT ALL    ON public.return_supply_items TO service_role;

-- ============================================================
-- 7. Seed the first event
-- ============================================================
INSERT INTO public.return_events (label, is_active)
VALUES ('Return - Spring 2026', TRUE)
ON CONFLICT (label) DO NOTHING;

-- ============================================================
-- Verify after running:
--
--   SELECT count(*) FROM return_events WHERE is_active;
--     -- expect 1
--
--   SELECT polname FROM pg_policy WHERE polrelid = 'return_totes'::regclass;
--     -- expect: anon read return_totes, auth read return_totes,
--     --         service all return_totes  (NO "anon all return_totes")
--
--   SELECT polname FROM pg_policy WHERE polrelid = 'return_supply_items'::regclass;
--     -- expect: anon read return_items, auth read return_items,
--     --         service all return_items
--
--   SELECT column_name FROM information_schema.columns
--    WHERE table_name = 'return_supply_items'
--      AND column_name IN ('item_number','category');
--     -- expect both rows
--
--   SELECT to_regclass('public.return_admins'),
--          to_regclass('public.return_audits'),
--          to_regclass('public.return_pin_attempts');
--     -- expect all three to be non-null
-- ============================================================
