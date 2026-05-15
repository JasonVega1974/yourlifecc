# Card Photos Storage — Supabase Setup

One-time manual setup steps required before `/api/upload-card-photo` will work in production. **Nothing in the repo creates this automatically.**

Project ref: **`hrohgwcbfgywkpnvqxhk`** (the YourLife CC project).

---

## Step 1 — Create the public bucket

1. Open https://supabase.com/dashboard/project/hrohgwcbfgywkpnvqxhk/storage/buckets
2. Click **New bucket** (top-right green button).
3. Configure exactly:
   - **Name:** `card-photos` (lowercase, with hyphen — must match exactly)
   - **Public bucket:** **ON** (toggle to enabled — this is critical, files will not serve otherwise)
   - **File size limit:** `5 MB` (optional safety net — the API also enforces this)
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/gif` (optional safety net; the API also enforces this)
4. Click **Save** / **Create bucket**.

Verify:
- The bucket appears in the bucket list with a small "Public" badge.
- Clicking into it shows an empty file list with a placeholder "Upload" button.

---

## Step 2 — (Optional) Confirm CORS

Supabase Storage allows uploads from any origin by default. **No action needed** for the admin uploader to work — it POSTs to our Vercel function, which then talks to Supabase server-to-server. The browser never hits Supabase directly.

If you ever change `/api/upload-card-photo.js` to do client-direct uploads via signed URLs, then you'd need to add CORS for `https://yourlifecc.com`. Not required today.

---

## Step 3 — Confirm RLS / policies

For a **public bucket**, the default policies are:

- **SELECT** (read) — public (anyone, including unauthenticated)
- **INSERT/UPDATE/DELETE** — service-role only (via `SUPA_SERVICE_KEY` server-side)

Both are correct for this use case. The Vercel function uses `SUPA_SERVICE_KEY` for writes; the resulting `https://hrohgwcbfgywkpnvqxhk.supabase.co/storage/v1/object/public/card-photos/...` URL is fetched directly by the user's browser, no auth.

**If the bucket was created as private instead of public** (you forgot to toggle the switch), the read URL above will 404 and your card images will appear broken. Fix: go to bucket settings → toggle Public ON.

---

## Step 4 — Verify Vercel env vars

Already configured for the existing `/api/admin-card-photo` endpoint. The new endpoint reuses the same one:

- `SUPA_SERVICE_KEY` — service-role JWT (NOT the anon key)

`ADMIN_PHOTO_SECRET` is no longer required — the HMAC check was removed 2026-05-14. The service key on the server side is the real security gate.

If `SUPA_SERVICE_KEY` already works for `admin-card-photo`, no change needed.

---

## Step 5 — Smoke test

1. Deploy this commit to Vercel.
2. Open https://yourlifecc.com/admin.html and unlock the Photo Manager.
3. Click **✏️ Edit** on any card.
4. In the new gold-bordered "Or upload from computer" row, click **📁 Choose Photo**, pick a small JPG, click **⬆️ Upload & Save**.
5. You should see a "Photo uploaded ✓" toast, the URL input fills with `https://hrohgwcbfgywkpnvqxhk.supabase.co/storage/v1/object/public/card-photos/cards/<card_id>-<ts>.jpg`, and the card thumbnail updates.
6. Refresh the app at https://yourlifecc.com/app/ and confirm the new photo shows on the corresponding card.

---

## Storage path conventions

Files are written to `card-photos/cards/<card_id>-<epoch_ms>.<ext>`. Examples:

- `cards/health-tile-1747276800123.webp`
- `cards/faith-academy-1747276900456.jpg`

The epoch suffix means re-uploading the same `card_id` creates a new file (the old one is orphaned, not deleted — see "Future work" below).

The public URL has the form:
```
https://hrohgwcbfgywkpnvqxhk.supabase.co/storage/v1/object/public/card-photos/cards/<card_id>-<ts>.<ext>
```

Both `/api/upload-card-photo` (writer) and `/api/admin-card-photo` (URL save flow) accept this URL shape. The regex in both files is:
```
/^https:\/\/(upload\.wikimedia\.org|hrohgwcbfgywkpnvqxhk\.supabase\.co\/storage)\//
```

---

## Future work (not blocking)

- **Orphan cleanup** — when a card_id is re-uploaded or removed, the old file in storage remains. Not critical (each photo is small, and you'll have at most a few hundred over the project lifetime), but worth scripting a cleanup job eventually that lists Storage objects, intersects with `admin_card_photos.photo_url`, and deletes the orphans.
- **Auto-resize / WebP convert** — Supabase Storage offers image transformations on the same URL (`?width=400&resize=cover&quality=80`). Worth wiring into the `loadCardPhotoOverrides()` reader in `app/js/ui.js` to serve right-sized images to the app's actual card slots without re-uploading.
- **Versioned URL invalidation** — appending `?v=<epoch>` to the public URL in the table row would defeat any CDN caching across re-uploads. Today the per-upload timestamp in the filename already does this.
