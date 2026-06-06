-- ═══════════════════════════════════════════════════════════════
-- Money Photos Buckets — Tab 2 Increment 5
-- ═══════════════════════════════════════════════════════════════
--
-- TWO buckets, one migration file:
--
--   money-receipts  — optional photo attached to an income/expense
--                     row in D.transactions. Stored path lives on
--                     D.transactions[i].receiptPath.
--                     Path scheme:
--                       <user_id>/<profile_id>/<tx_id>/<timestamp>.<ext>
--
--   money-images    — hero photo for a savings goal in
--                     D.savingsGoals[i]. Stored path lives on
--                     D.savingsGoals[i].photoPath. The card uses the
--                     photo as its hero, replacing the emoji when set.
--                     Path scheme:
--                       <user_id>/<profile_id>/<goal_id>/<timestamp>.<ext>
--
-- Both share the chore-proofs design (see
-- chore-proofs-bucket.sql): PRIVATE, 5 MB cap, image MIME only,
-- RLS scoped to the first folder segment = auth.uid(). Reads happen
-- through createSignedUrl() with a short TTL — a leaked URL alone
-- does NOT grant access; the session's RLS still gates the underlying
-- SELECT.
--
-- Per Phase 1 of the PIN → stable-id decouple (v249), the
-- <profile_id> segment uses _pidOf(activeProfile) — the stable id.
-- NEW paths from day 1 carry no PIN debt.
--
-- ── Multi-profile note ────────────────────────────────────────
-- Like chore-proofs, the bucket is partitioned at the FIRST path
-- segment by auth.uid(). Multiple kids on the same parent account
-- share the bucket — kids cannot read each other's photos because
-- the upload path encodes the active profile_id as the second
-- segment, and the application reads filter on that.
--
-- ── Rollback ──────────────────────────────────────────────────
--   delete from storage.buckets where id in ('money-receipts','money-images');
--   drop policy if exists "money_receipts_select_own" on storage.objects;
--   drop policy if exists "money_receipts_insert_own" on storage.objects;
--   drop policy if exists "money_receipts_update_own" on storage.objects;
--   drop policy if exists "money_receipts_delete_own" on storage.objects;
--   drop policy if exists "money_images_select_own"   on storage.objects;
--   drop policy if exists "money_images_insert_own"   on storage.objects;
--   drop policy if exists "money_images_update_own"   on storage.objects;
--   drop policy if exists "money_images_delete_own"   on storage.objects;
--
-- Project ref: hrohgwcbfgywkpnvqxhk
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1A. CREATE money-receipts bucket
-- ═══════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'money-receipts',
  'money-receipts',
  false,
  5242880,                                                    -- 5 * 1024 * 1024
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ═══════════════════════════════════════════════════════════════
-- 1B. CREATE money-images bucket
-- ═══════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'money-images',
  'money-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ═══════════════════════════════════════════════════════════════
-- 2A. RLS policies for money-receipts
-- ═══════════════════════════════════════════════════════════════

drop policy if exists "money_receipts_select_own" on storage.objects;
create policy "money_receipts_select_own"
  on storage.objects for select
  using (
    bucket_id = 'money-receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "money_receipts_insert_own" on storage.objects;
create policy "money_receipts_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'money-receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "money_receipts_update_own" on storage.objects;
create policy "money_receipts_update_own"
  on storage.objects for update
  using (
    bucket_id = 'money-receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'money-receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "money_receipts_delete_own" on storage.objects;
create policy "money_receipts_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'money-receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ═══════════════════════════════════════════════════════════════
-- 2B. RLS policies for money-images
-- ═══════════════════════════════════════════════════════════════

drop policy if exists "money_images_select_own" on storage.objects;
create policy "money_images_select_own"
  on storage.objects for select
  using (
    bucket_id = 'money-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "money_images_insert_own" on storage.objects;
create policy "money_images_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'money-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "money_images_update_own" on storage.objects;
create policy "money_images_update_own"
  on storage.objects for update
  using (
    bucket_id = 'money-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'money-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "money_images_delete_own" on storage.objects;
create policy "money_images_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'money-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── Smoke test (run under a signed-in non-service-role session) ──
-- After this migration applies, paste under your own session:
--   select count(*) from storage.objects where bucket_id in ('money-receipts','money-images');
--   -- Should return only your own uploaded objects.
--
--   insert into storage.objects (bucket_id, name, owner)
--   values ('money-images', 'OTHER_UUID/test.jpg', auth.uid());
--   -- Should FAIL with: new row violates row-level security policy.
