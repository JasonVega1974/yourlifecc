-- ═══════════════════════════════════════════════════════════════
-- Storage Bucket: chore-proofs (Tab 1 Increment 3)
-- ═══════════════════════════════════════════════════════════════
--
-- Photo proof submissions for the Chores tab. These images may
-- depict minors, so the bucket and its access policies are scoped
-- as tightly as possible:
--
--   • PRIVATE bucket (public = false). Browser code never receives
--     a permanent public URL. All reads go through short-lived
--     signed URLs generated client-side via
--     supabase.storage.from('chore-proofs').createSignedUrl(...).
--     A signed URL only resolves if the requester's session passes
--     the SELECT policy below — so a leaked URL alone cannot grant
--     access; the URL plus the original signing token expire.
--
--   • 5 MB object size cap, enforced at the bucket level. Client
--     code in chores.js MUST also validate size before upload so
--     the rejection happens with a friendly toast rather than a
--     413 from PostgREST.
--
--   • Allowed MIME types: image/jpeg, image/png, image/webp,
--     image/heic, image/heif. iOS camera capture defaults to HEIC;
--     including it avoids forcing a re-encode on mobile.
--
--   • Path scheme — first folder segment MUST be the auth user's
--     uid, since that's what the RLS policies key on:
--
--       <user_id>/<profile_id>/<chore_id>/<timestamp>.<ext>
--
--     user_id    auth.uid() — the parent account (or solo user)
--     profile_id 4-digit PIN from parent.js _profiles[], or '_solo'
--                (matches chores.profile_id from chores-schema.sql)
--     chore_id   'ch_<profileId>_<n>' — the same namespaced id used
--                by the chores text PK and chore_completions.chore_id
--     timestamp  Date.now() — keeps repeat submissions of the same
--                chore on the same day distinguishable
--
-- ── Multi-profile note ────────────────────────────────────────
-- The bucket is partitioned at the first path segment by auth uid,
-- not by profile_id. That's intentional: one parent account hosts
-- multiple kids, and the parent legitimately needs to view all of
-- her kids' chore photos for verification. Per-kid scoping is
-- enforced at the application layer via the second path segment
-- (profile_id) — kids cannot read each other's photos because the
-- app never asks for a signed URL outside the active profile's
-- subfolder.
--
-- ── No GRANTs required ────────────────────────────────────────
-- storage.objects already has the right Data API exposure via
-- Supabase's built-in setup. This migration only touches storage.*
-- (no public.* CREATE TABLE), so scripts/check-migrations.sh does
-- not require GRANT statements here.
--
-- Reversibility (run in Supabase Studio SQL editor as service role):
--   delete from storage.objects where bucket_id = 'chore-proofs';
--   delete from storage.buckets where id        = 'chore-proofs';
--   drop policy if exists "chore_proofs_select_own" on storage.objects;
--   drop policy if exists "chore_proofs_insert_own" on storage.objects;
--   drop policy if exists "chore_proofs_update_own" on storage.objects;
--   drop policy if exists "chore_proofs_delete_own" on storage.objects;
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

-- 1. CREATE THE BUCKET (private, 5 MB cap, image MIME only).
--    on conflict do update keeps this idempotent if re-run.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chore-proofs',
  'chore-proofs',
  false,
  5242880,                                                    -- 5 * 1024 * 1024 bytes
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. STORAGE RLS POLICIES on storage.objects.
--    Pattern: bucket_id check + first-folder-segment matches auth.uid().
--    storage.foldername(name) returns text[]; [1] is the first segment
--    (Postgres arrays are 1-indexed).
--
--    Note: storage.objects has RLS enabled by default in Supabase.
--    Service-role connections (admin scripts, the dashboard) bypass
--    RLS automatically, so no separate service policy is needed.

-- SELECT — own objects only. This also gates createSignedUrl():
-- a signed URL only resolves if the signing session would have been
-- allowed to SELECT the row.
drop policy if exists "chore_proofs_select_own" on storage.objects;
create policy "chore_proofs_select_own"
  on storage.objects for select
  using (
    bucket_id = 'chore-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- INSERT — uploads must land under the user's own first folder.
drop policy if exists "chore_proofs_insert_own" on storage.objects;
create policy "chore_proofs_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'chore-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE — same scoping. Covers overwrite/upsert flows (the JS SDK's
-- upload helper sets x-upsert: 'true' which counts as UPDATE on
-- existing objects).
drop policy if exists "chore_proofs_update_own" on storage.objects;
create policy "chore_proofs_update_own"
  on storage.objects for update
  using (
    bucket_id = 'chore-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'chore-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE — for resubmit / cleanup flows.
drop policy if exists "chore_proofs_delete_own" on storage.objects;
create policy "chore_proofs_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'chore-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── Smoke test (run as a signed-in non-service-role session) ──
-- After this migration is applied, paste these into the SQL editor
-- under your own session to confirm cross-user blocking:
--   select count(*) from storage.objects where bucket_id = 'chore-proofs';
--   -- Should return only your own uploaded photos.
--
--   insert into storage.objects (bucket_id, name, owner)
--   values ('chore-proofs', 'OTHER_UUID/test.jpg', auth.uid());
--   -- Should FAIL with: new row violates row-level security policy.
