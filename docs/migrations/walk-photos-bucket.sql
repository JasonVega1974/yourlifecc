-- ═══════════════════════════════════════════════════════════════
-- Storage Bucket: walk-photos (My Story milestone photos, 2026-07-03)
-- ═══════════════════════════════════════════════════════════════
--
-- RUNBOOK — this must be run MANUALLY in the Supabase SQL editor
-- (project hrohgwcbfgywkpnvqxhk) as service role. Client code cannot
-- create buckets. Until this runs, milestone photo uploads fail with a
-- friendly toast and the text entry still saves — nothing is lost.
--
-- Mirrors docs/migrations/chore-proofs-bucket.sql exactly:
--
--   • PRIVATE bucket (public = false). The browser never receives a
--     permanent public URL — all reads are short-lived signed URLs via
--     supabase.storage.from('walk-photos').createSignedUrl(...), which
--     only resolve when the requester's session passes the SELECT
--     policy below.
--
--   • 5 MB object cap at the bucket level; walk-story.js also
--     validates size client-side so rejection is a friendly toast.
--
--   • Allowed MIME: jpeg / png / webp / heic / heif (iOS camera
--     capture defaults to HEIC).
--
--   • Path scheme — first folder segment MUST be the auth uid (the
--     RLS policies key on it):
--
--       <user_id>/<entry_id>_<timestamp>.<ext>
--
--     user_id   auth.uid()
--     entry_id  'ws_<ms>' — the D.walkStory entry the photo belongs to
--     timestamp Date.now() — re-attaches stay distinguishable
--
-- ── No GRANTs required ────────────────────────────────────────
-- storage.objects already has Data API exposure via Supabase's
-- built-in setup. No public.* CREATE TABLE here, so
-- scripts/check-migrations.sh does not require GRANT statements.
--
-- Reversibility:
--   delete from storage.objects where bucket_id = 'walk-photos';
--   delete from storage.buckets where id        = 'walk-photos';
--   drop policy if exists "walk_photos_select_own" on storage.objects;
--   drop policy if exists "walk_photos_insert_own" on storage.objects;
--   drop policy if exists "walk_photos_update_own" on storage.objects;
--   drop policy if exists "walk_photos_delete_own" on storage.objects;
-- ═══════════════════════════════════════════════════════════════

-- 1. CREATE THE BUCKET (private, 5 MB cap, image MIME only). Idempotent.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'walk-photos',
  'walk-photos',
  false,
  5242880,                                                    -- 5 * 1024 * 1024
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. STORAGE RLS POLICIES — bucket check + first-folder-segment = auth.uid().

-- SELECT — own objects only (also gates createSignedUrl()).
drop policy if exists "walk_photos_select_own" on storage.objects;
create policy "walk_photos_select_own"
  on storage.objects for select
  using (
    bucket_id = 'walk-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- INSERT — uploads must land under the user's own first folder.
drop policy if exists "walk_photos_insert_own" on storage.objects;
create policy "walk_photos_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'walk-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE — same scoping (covers the SDK's upsert flows).
drop policy if exists "walk_photos_update_own" on storage.objects;
create policy "walk_photos_update_own"
  on storage.objects for update
  using (
    bucket_id = 'walk-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'walk-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE — own objects only.
drop policy if exists "walk_photos_delete_own" on storage.objects;
create policy "walk_photos_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'walk-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
