-- ─────────────────────────────────────────────────────────────────────
-- TABLE MIGRATION TEMPLATE
-- Copy this for every new table. Pick the right grant pattern at the bottom.
-- ─────────────────────────────────────────────────────────────────────

-- 1. CREATE THE TABLE
CREATE TABLE IF NOT EXISTS public.your_table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- ... your columns ...
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.your_table_name ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES (user-scoped — adjust if needed)
CREATE POLICY "Users manage own rows" ON public.your_table_name
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON public.your_table_name
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 4. INDEXES (add as needed)
CREATE INDEX IF NOT EXISTS idx_your_table_user_id ON public.your_table_name(user_id);
CREATE INDEX IF NOT EXISTS idx_your_table_created_at ON public.your_table_name(created_at DESC);

-- 5. DATA API GRANTS (REQUIRED for Oct 30, 2026 Supabase changes)
-- Pick ONE pattern below based on table purpose:

-- ─── Pattern A: User data table (most common) ───
GRANT SELECT, INSERT, UPDATE, DELETE ON public.your_table_name TO authenticated;
GRANT ALL ON public.your_table_name TO service_role;

-- ─── Pattern B: Public submission form (waitlist, contact, application) ───
-- GRANT SELECT ON public.your_table_name TO authenticated;
-- GRANT INSERT ON public.your_table_name TO anon;
-- GRANT INSERT ON public.your_table_name TO authenticated;
-- GRANT ALL ON public.your_table_name TO service_role;

-- ─── Pattern C: Admin/CMS content (everyone reads, service manages) ───
-- GRANT SELECT ON public.your_table_name TO authenticated;
-- GRANT SELECT ON public.your_table_name TO anon;
-- GRANT ALL ON public.your_table_name TO service_role;

-- ─── Pattern D: Service-role only (admin logs, webhooks) ───
-- GRANT ALL ON public.your_table_name TO service_role;

-- 6. TRIGGER FOR updated_at (optional, only if table has updated_at column)
CREATE TRIGGER set_updated_at_your_table_name
  BEFORE UPDATE ON public.your_table_name
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
