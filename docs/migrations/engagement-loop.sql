-- Engagement Loop migrations (feat/engagement-loop branch)
-- Workers 1-4: Reading Plans, AI VOTD + Mood, Guided Prayer, Sermon Notes
-- Run in Supabase SQL editor for project hrohgwcbfgywkpnvqxhk

-- ── WORKER 1: Reading Plan Progress ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reading_plan_progress (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id        TEXT NOT NULL,
  current_day    INTEGER DEFAULT 1,
  started_date   DATE NOT NULL,
  last_read_date DATE,
  completed_days INTEGER[] DEFAULT '{}',
  streak         INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  completed      BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, plan_id)
);

ALTER TABLE reading_plan_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own reading progress"
  ON reading_plan_progress FOR ALL
  USING (auth.uid() = user_id);

-- ── WORKER 4: Sermon Notes ────────────────────────────────────────────────────
-- Note: this table uses (user_id, note_date) as the conflict key for upsert.
-- If a user saves two different sermons on the same date, only the latest wins.
-- Future: add a serial per-user sequence or use the JS-generated id as PK.
CREATE TABLE IF NOT EXISTS sermon_notes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_date        DATE NOT NULL,
  church_name      TEXT,
  pastor_name      TEXT,
  sermon_title     TEXT,
  scripture_ref    TEXT,
  key_verse        TEXT,
  notes            TEXT,
  god_showed_me    TEXT,
  action_this_week TEXT,
  tags             TEXT[],
  shared_with_family BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, note_date)
);

ALTER TABLE sermon_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own sermon notes"
  ON sermon_notes FOR ALL
  USING (auth.uid() = user_id);

-- ── Data API exposure grants (added 2026-05-27, Oct 30 2026 compliance) ──
-- Tables created after Oct 30, 2026 require explicit GRANTs for the
-- Data API to see them; RLS still gates per-row access. Idempotent.
GRANT SELECT, INSERT, UPDATE, DELETE ON reading_plan_progress TO authenticated;
GRANT ALL ON reading_plan_progress TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON sermon_notes TO authenticated;
GRANT ALL ON sermon_notes TO service_role;
