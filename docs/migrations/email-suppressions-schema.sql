-- ═══════════════════════════════════════════════════════════════
-- Email Engagement Bundle — Suppression list (PR 0, 2026-06-08)
--
-- Tracks every email-stream unsubscribe so we can persist the opt-out
-- across account deletions (privacy.html "Marketing suppression records
-- are retained indefinitely even after account deletion").
--
-- Service-role only — the unsubscribe endpoint (/api/email-prefs)
-- writes here using SUPA_SERVICE_KEY, the cron handlers read here
-- before sending. Users never query this table directly; they see
-- their per-list status mirrored in profiles.data.emailPrefs.
--
-- Architecture note (why no parent_id / no per-user RLS):
--   Same as faith_activity_log — child profiles aren't separate
--   Supabase auth users. The suppression is keyed by email (the
--   parent's auth.users.email) and by list (digest/engagement/
--   crossover/all). user_id is set ON DELETE SET NULL so the
--   suppression survives account deletion, preventing re-add to
--   marketing lists in the future (privacy.html promise).
--
-- Apply manually in Supabase Studio
-- (project: hrohgwcbfgywkpnvqxhk) before /api/email-prefs is called
-- for the first time.
--
-- To reverse:
--   drop table if exists public.email_suppressions;
-- ═══════════════════════════════════════════════════════════════

-- 1. CREATE THE TABLE
CREATE TABLE IF NOT EXISTS public.email_suppressions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL,
  list          TEXT        NOT NULL,
  suppressed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source        TEXT        NOT NULL,
  -- user_id kept for cross-reference but null-able and decouples on
  -- account deletion so the suppression itself survives (privacy.html).
  user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  notes         TEXT
);

-- 2. CHECK CONSTRAINTS — DO block makes this migration idempotent
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_suppressions_list_chk') THEN
    ALTER TABLE public.email_suppressions
      ADD CONSTRAINT email_suppressions_list_chk
      CHECK (list IN ('digest','engagement','crossover','all'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_suppressions_source_chk') THEN
    ALTER TABLE public.email_suppressions
      ADD CONSTRAINT email_suppressions_source_chk
      CHECK (source IN ('unsubscribe_link','one_click','reply_stop','manual'));
  END IF;
END$$;

-- 3. ENABLE RLS — service-only access, blanket-deny for everyone else
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "email_suppressions_service_only" ON public.email_suppressions;
CREATE POLICY "email_suppressions_service_only" ON public.email_suppressions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. INDEXES
-- Unique per (lowercased email, list) — prevents duplicate suppressions
-- for the same (email, list) pair across multiple unsubscribe clicks.
CREATE UNIQUE INDEX IF NOT EXISTS email_suppressions_email_list_uidx
  ON public.email_suppressions (lower(email), list);

-- Lookup by user (account-deletion cleanup + admin debugging)
CREATE INDEX IF NOT EXISTS email_suppressions_user_idx
  ON public.email_suppressions (user_id);

-- Suppression history ordering
CREATE INDEX IF NOT EXISTS email_suppressions_suppressed_at_idx
  ON public.email_suppressions (suppressed_at DESC);

-- 5. DATA API GRANTS (Oct 30, 2026 Supabase compliance)
-- Pattern D — service-only. The Data API never exposes this table
-- to authenticated or anon roles; only the cron handlers + the
-- /api/email-prefs endpoint touch it.
GRANT ALL ON public.email_suppressions TO service_role;
