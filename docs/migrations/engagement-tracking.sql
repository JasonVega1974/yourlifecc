-- engagement-tracking.sql
-- Adds per-user engagement aggregates to the profiles table so the admin
-- dashboard can classify users by tier without round-tripping a separate
-- user_activity table.
--
-- Run this in the Supabase SQL editor BEFORE deploying the client/admin
-- code that reads/writes these columns. Existing rows get safe defaults
-- (empty array, 0 counters, NULL timestamps).
--
-- After running, you ALSO need to update the `admin-data` Edge Function
-- to SELECT these new columns when returning the profiles list — see the
-- handoff note in the PR description.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sections_visited     JSONB       DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS section_visit_count  INTEGER     DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_section         TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active          TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_sessions       INTEGER     DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS engagement_score     INTEGER     DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_last_active  ON profiles (last_active DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_profiles_engagement   ON profiles (engagement_score DESC);

-- Existing RLS policies on `profiles` already gate read/update by user_id
-- ownership; no policy changes needed. The new columns inherit the same
-- row-level access (own row read/write only) automatically.
