-- ═══════════════════════════════════════════════════════════════
-- 2026-07-07 — Prayer Wall RLS fix
-- ═══════════════════════════════════════════════════════════════
--
-- BUG: the Prayer Wall (app/js/faith.js renderPrayerWallPane(),
-- app/js/acts-journey.js "share to prayer wall") writes rows to
-- public.prayer_requests with privacy='community', and the client query
-- already asks for ALL community rows (.eq('privacy','community'), no
-- user_id filter — see faith.js:5009-5014). But the table's only SELECT
-- policy, from docs/migrations/F2-E-prayer-requests.sql:47-50, is:
--
--   create policy "prayer_requests_select_own"
--     on public.prayer_requests for select
--     using (auth.uid() = user_id);
--
-- Postgres RLS silently filters every SELECT down to auth.uid() = user_id
-- regardless of what the client's WHERE clause asks for, so each user
-- only ever sees their own prayers — the wall was never actually a
-- community surface. This migration widens SELECT only.
--
-- SCOPE — read-only change:
--   - INSERT/UPDATE/DELETE policies (prayer_requests_insert_own,
--     _update_own, _delete_own) are UNTOUCHED — still strictly
--     auth.uid() = user_id. Users can still only write their own rows.
--   - privacy='family' rows are NOT opened up here — F2-E's own comment
--     (line 68-71) already notes family-scoped sharing needs a
--     families/family_members table that doesn't exist yet (F2-H). This
--     migration only widens privacy='community' visibility.
--   - No new columns, no CREATE TABLE — existing GRANTs on
--     prayer_requests (F2-E-prayer-requests.sql:82-83) are unaffected.
--
-- PII CHECK — safe to widen: prayer_requests has no email/full-name/
-- display-name column (only user_id, a bare auth.users FK), and the
-- client's .select('id, text, category, created_at') already omits
-- user_id and renders every wall card as "— Anonymous" (faith.js:5042)
-- regardless of author. No UI change is needed alongside this migration.
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

-- Replace the own-only SELECT policy with one that also allows reading
-- any row marked privacy='community', from any user. Renamed so the
-- policy name reflects what it actually does now.
drop policy if exists "prayer_requests_select_own" on public.prayer_requests;
drop policy if exists "prayer_requests_select_own_or_community" on public.prayer_requests;
create policy "prayer_requests_select_own_or_community"
  on public.prayer_requests for select
  using (
    auth.uid() = user_id
    or privacy = 'community'
  );

-- ── VERIFY ───────────────────────────────────────────────────
-- Run these in the Supabase SQL editor after applying, as a user whose
-- auth.uid() does NOT own the rows in question:
--
-- 1. Community rows from OTHER users are now visible:
--   select count(*) from prayer_requests
--   where privacy = 'community' and user_id != auth.uid();
--   -- expect: > 0 once at least one other user has posted to the wall
--
-- 2. Private/family rows from OTHER users are still hidden:
--   select count(*) from prayer_requests
--   where privacy in ('private','family') and user_id != auth.uid();
--   -- expect: 0
--
-- 3. Writes are still own-only (should error / affect 0 rows for a
--    row you don't own):
--   update prayer_requests set text = 'test' where user_id != auth.uid();
--   delete from prayer_requests where user_id != auth.uid();
