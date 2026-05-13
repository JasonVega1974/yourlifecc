-- admin_card_photos
-- Photo URL overrides for the 81 topic cards across YourLife CC. The
-- table is keyed by stable card_id strings shared between admin.html
-- (the Photo Manager) and the app's hero <img data-card-id="…">
-- attributes. The Vercel function /api/admin-card-photo is the only
-- writer (it uses SUPA_SERVICE_KEY which bypasses RLS). Reads also go
-- through the function — the table is locked down so the anon Supabase
-- client cannot enumerate or scrape it directly.

create table if not exists admin_card_photos (
  card_id    text primary key,
  photo_url  text not null,
  updated_at timestamptz default now()
);

alter table admin_card_photos enable row level security;

-- Service-role-only policy. The Supabase JS client using the anon key
-- (which is what runs in YourLife CC's browsers) will get zero rows.
-- All access goes through the /api/admin-card-photo Vercel function.
create policy "Service role only" on admin_card_photos
  using (auth.role() = 'service_role');
