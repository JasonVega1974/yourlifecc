-- ============================================================================
-- onboarding-flag.sql — Promote onboarding-completion state out of the
-- profiles.data JSONB blob into dedicated, queryable columns.
--
-- WHY: The 4-step setup wizard (init.js maybeShowOnboarding / onbComplete)
--      previously gated on D.onboardingDone, which lives inside the JSONB
--      blob and only reaches Supabase via the 2-second debounced cloudSync.
--      Two failure modes re-fired the wizard on every login:
--        1. Close-tab-fast race: blob never persisted before the tab closed.
--        2. Safari localStorage wipe: D defaulted to onboardingDone:false on
--           the next session, and a blob-restoration miss let the wizard fire
--           again.
--      Dedicated columns + a synchronous write at completion + a boot-time
--      read with D as fallback eliminates both.
--
-- HOW TO RUN: paste this whole file into
--   https://supabase.com/dashboard/project/hrohgwcbfgywkpnvqxhk/sql/new
-- and click RUN. Idempotent — safe to re-run.
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_bracket TEXT;            -- '12_14' | '15_17' | '18_22' | 'parent'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Optional but recommended: index the boolean so the boot-time SELECT is O(1).
CREATE INDEX IF NOT EXISTS profiles_onboarding_completed_idx
  ON profiles(onboarding_completed)
  WHERE onboarding_completed = true;

-- Optional backfill: if you have users who completed under the old code
-- (D.onboardingDone in the JSONB blob), promote them to the new column
-- so they don't re-hit the wizard on Safari/new-device sessions.
-- Safe to run multiple times — only updates rows where the column is
-- still false and the blob says true.
UPDATE profiles
SET onboarding_completed = true,
    onboarding_completed_at = COALESCE(
      (data->>'onboardingCompletedAt')::timestamptz,
      updated_at,
      NOW()
    )
WHERE onboarding_completed = false
  AND (data->>'onboardingDone')::boolean = true;

-- ── Oct 30 2026 compliance note (added 2026-05-27) ──
-- This migration only adds COLUMNS to the existing `profiles` table —
-- no new tables are created. Data API exposure grants on `profiles`
-- already exist from its original migration; ALTER TABLE inherits
-- them. No GRANT statements are required here. See
-- docs/migrations/template.sql for the canonical pattern when a new
-- CREATE TABLE migration is needed.
