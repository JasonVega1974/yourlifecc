-- YourLife CC — Phase 4: AI Meditation Generator
-- Table for user-generated (AI) meditations with cross-device sync and community sharing

CREATE TABLE IF NOT EXISTS custom_meditations (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id           TEXT        NOT NULL,        -- client-side 'gen-{timestamp}' ID
  title              TEXT        NOT NULL,
  theme              TEXT,
  icon               TEXT,
  duration           INTEGER,
  scripture_focus    TEXT,
  ambient_suggestion TEXT,
  segments           JSONB       NOT NULL DEFAULT '[]',
  is_public          BOOLEAN     NOT NULL DEFAULT false,
  play_count         INTEGER     NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, local_id)
);

ALTER TABLE custom_meditations ENABLE ROW LEVEL SECURITY;

-- Users can read their own meditations, plus any shared publicly
CREATE POLICY "custom_meditations_select" ON custom_meditations
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

-- Users can only insert their own rows
CREATE POLICY "custom_meditations_insert" ON custom_meditations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rows
CREATE POLICY "custom_meditations_update" ON custom_meditations
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own rows
CREATE POLICY "custom_meditations_delete" ON custom_meditations
  FOR DELETE USING (auth.uid() = user_id);

-- Fast per-user lookups ordered by newest first
CREATE INDEX IF NOT EXISTS custom_meditations_user_created_idx
  ON custom_meditations (user_id, created_at DESC);
