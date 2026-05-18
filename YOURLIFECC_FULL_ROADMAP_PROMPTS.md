# YourLife CC — Full Feature Roadmap
## Claude Code Prompts — Run in Order

---

## PHASE 1A — Streaks Engine

> Use `superpowers` and `supabase` MCPs. Read `CLAUDE.md` before touching any file. Run `node --check` on every modified file. Verify index.html tail before and after.
>
> **Build: Daily streak tracking system**
>
> **Supabase — create this table first (run in SQL editor):**
> ```sql
> create table user_streaks (
>   id uuid primary key default gen_random_uuid(),
>   user_id uuid references auth.users(id) on delete cascade,
>   current_streak int default 0,
>   longest_streak int default 0,
>   last_active_date date,
>   total_days int default 0,
>   study_completions int default 0,
>   devotional_completions int default 0,
>   updated_at timestamptz default now(),
>   unique(user_id)
> );
> alter table user_streaks enable row level security;
> create policy "Users manage own streaks" on user_streaks
>   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
> ```
> Use `supabase` MCP to verify RLS is active before proceeding.
>
> **Vercel function — `api/streak.js`:**
> - POST endpoint, requires Supabase JWT auth header
> - Body: `{ action: 'checkin' | 'complete_study' | 'complete_devotional' }`
> - `checkin`: if `last_active_date` is yesterday → increment streak. If today → no change. If older → reset to 1. Update `total_days`, `last_active_date`, `updated_at`.
> - `complete_study`: increment `study_completions`
> - `complete_devotional`: increment `devotional_completions`
> - Always update `longest_streak` if `current_streak` exceeds it
> - Returns full streak object
> - CommonJS `module.exports` syntax
>
> **`app/js/faith.js` — streak UI:**
> - Call `/api/streak` checkin on every Well open (once per day max — check localStorage `ylcc_last_checkin_date` before calling)
> - Call complete_study when a Bible Study lesson is generated
> - Call complete_devotional when a devotional is opened
> - Render a streak badge in The Well home screen:
>   - Flame icon 🔥 with current streak number
>   - Gold color matching Well theme
>   - On tap: expand to show current streak, longest streak, total days, studies completed
>   - Milestone toasts at 3, 7, 14, 30, 60, 100 days: "🔥 7-day streak! Keep going."
>
> `node --check` all files, verify tail, commit `"feat: daily streak engine with Supabase tracking"` and push.

---

## PHASE 1B — Push Notifications

> Use `superpowers` MCP. Read `CLAUDE.md`. Run `node --check` on all modified files. Verify index.html tail.
>
> **Build: Web push notifications using the Web Push API + Brevo**
>
> **Step 1 — VAPID keys:**
> Generate VAPID keys using `npx web-push generate-vapid-keys` and add to Vercel env:
> - `VAPID_PUBLIC_KEY`
> - `VAPID_PRIVATE_KEY`
> - `VAPID_SUBJECT` = `mailto:info@kingdom-creatives.com`
>
> **Step 2 — Supabase table:**
> ```sql
> create table push_subscriptions (
>   id uuid primary key default gen_random_uuid(),
>   user_id uuid references auth.users(id) on delete cascade,
>   subscription jsonb not null,
>   created_at timestamptz default now(),
>   unique(user_id)
> );
> alter table push_subscriptions enable row level security;
> create policy "Users manage own subscriptions" on push_subscriptions
>   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
> ```
>
> **Step 3 — Service Worker `public/sw.js`:**
> ```js
> self.addEventListener('push', e => {
>   const data = e.data.json();
>   self.registration.showNotification(data.title, {
>     body: data.body,
>     icon: '/app/icons/icon-192.png',
>     badge: '/app/icons/badge-72.png',
>     data: { url: data.url || 'https://yourlifecc.com' }
>   });
> });
> self.addEventListener('notificationclick', e => {
>   e.notification.close();
>   clients.openWindow(e.notification.data.url);
> });
> ```
>
> **Step 4 — Vercel functions:**
> - `api/push-subscribe.js` — saves subscription to Supabase (POST, auth required)
> - `api/push-send.js` — admin-only endpoint (verify `x-admin-token: ylcc-admin-2729`), sends push to one or all users via `web-push` npm package
>
> **Step 5 — `app/js/init.js`:**
> After successful auth, prompt for notification permission (only once, check localStorage `ylcc_push_prompted`):
> - Show a soft in-app prompt first: "Get daily verses and reminders?" with Allow/Not now buttons
> - Only call `Notification.requestPermission()` after user taps Allow
> - On grant: register service worker, get subscription, POST to `/api/push-subscribe`
>
> **Step 6 — Admin panel `admin.html`:**
> Add a "Send Notification" section:
> - Title input, Body input, URL input (optional)
> - Target: All users / Faith users only
> - Send button → POST to `/api/push-send`
>
> **Automated triggers (add to relevant API endpoints):**
> - After 3 days no checkin → send "We miss you at The Well 💧" re-engagement push
> - Daily verse push: add a scheduled note in CLAUDE.md — this needs a cron job (Vercel cron or external) to be wired later
>
> `node --check` all files, verify tail, commit `"feat: web push notifications with VAPID and admin send panel"` and push.

---

## PHASE 2A — The Well Onboarding

> Use `superpowers` MCP. Read `CLAUDE.md`. Run `node --check` on all modified files. Verify index.html tail.
>
> **Build: First-time onboarding for The Well — 3-screen intro**
>
> **Supabase — add column to profiles:**
> ```sql
> alter table profiles add column if not exists well_onboarded boolean default false;
> ```
>
> **Logic in `app/js/init.js` or `faith.js`:**
> - After faith-free user lands on The Well home, check `profiles.well_onboarded`
> - If false → show onboarding overlay before revealing the hero
> - After completion → set `well_onboarded = true` in Supabase
>
> **3-screen onboarding overlay (full-screen, above the hero):**
>
> Screen 1 — "Welcome to The Well"
> - Large well illustration (reuse the SVG well from hero or simplified version)
> - Headline: "A place to draw near"
> - Body: "The Well is your daily space for Scripture, prayer, and faith — built for you and your family."
> - Gold "Next →" button
>
> Screen 2 — "What's inside"
> - 4 icon cards in a 2×2 grid: 📖 Bible Study · 🙏 Prayer Wall · ⭐ Faith Proof · 🔥 Devotionals
> - Headline: "Everything you need to grow"
> - Body: "Explore guided studies, prayer tools, evidence for faith, and daily devotionals for every age."
> - Gold "Next →" button
>
> Screen 3 — "You're not alone"
> - Headline: "Built for families & groups"
> - Body: "Study together, pray together, grow together. Invite your family or small group to join you."
> - Gold "Enter The Well ✦" button → dismisses onboarding, marks well_onboarded = true
>
> **Design:**
> - Full-screen dark overlay matching Well color palette (deep navy/dark)
> - Gold accent colors matching existing Well theme
> - Animated dot progress indicator (3 dots)
> - Slide transition between screens
> - Skip button top-right on screens 1 and 2
> - No scroll — all content fits in viewport height
>
> `node --check` all files, verify tail, commit `"feat: The Well first-time onboarding 3-screen intro"` and push.

---

## PHASE 2B — Offline Mode

> Use `superpowers` MCP. Read `CLAUDE.md`. Run `node --check` on all modified files. Verify index.html tail.
>
> **Build: Service worker offline caching for The Well**
>
> **`public/sw.js`** (extend the existing one from Phase 1B, or create if not yet built):
>
> ```js
> const CACHE = 'ylcc-well-v1';
> const STATIC = [
>   '/',
>   '/app/index.html',
>   '/app/css/app.css',
>   '/app/js/init.js',
>   '/app/js/faith.js',
>   '/app/js/bible-study-data.js',
>   '/app/js/ui.js',
>   '/app/js/sync.js'
> ];
>
> self.addEventListener('install', e => {
>   e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
> });
>
> self.addEventListener('fetch', e => {
>   // Cache-first for static assets, network-first for API calls
>   if (e.request.url.includes('/api/')) {
>     e.respondWith(
>       fetch(e.request).catch(() =>
>         caches.match(e.request) ||
>         new Response(JSON.stringify({ error: 'offline' }), { headers: { 'Content-Type': 'application/json' }})
>     ));
>   } else {
>     e.respondWith(
>       caches.match(e.request).then(r => r || fetch(e.request).then(res => {
>         const clone = res.clone();
>         caches.open(CACHE).then(c => c.put(e.request, clone));
>         return res;
>       }))
>     );
>   }
> });
> ```
>
> **Dynamic content caching:**
> - When a Bible Study lesson is generated, cache the response in localStorage under `ylcc_offline_lesson_{track}_{topic}` (JSON)
> - When offline and user hits Generate, check localStorage for cached lesson and serve it with an "Offline — showing saved study" banner
> - Cache the last 5 devotionals and last 3 Bible study lessons automatically
>
> **Offline indicator:**
> - Listen for `window.online/offline` events
> - Show a subtle gold banner at top of Well: "You're offline — showing saved content" when offline
> - Hide when connection restored
>
> **Register SW in `app/index.html`:**
> ```html
> <script>
>   if ('serviceWorker' in navigator) {
>     navigator.serviceWorker.register('/sw.js');
>   }
> </script>
> ```
> Add this just before `</body>` — after the Google Translate script tag.
>
> CRITICAL: Verify index.html tail after this edit — tick function, setInterval, and Google Translate tag must all still be present.
>
> `node --check` all files, verify tail, commit `"feat: offline mode with service worker caching"` and push.

---

## PHASE 3A — Bible Study Group Sharing

> Use `superpowers` and `supabase` MCPs. Read `CLAUDE.md`. Run `node --check` on all modified files. Verify index.html tail.
>
> **Build: Group sharing for Bible Study Hub**
>
> **Supabase tables:**
> ```sql
> create table study_groups (
>   id uuid primary key default gen_random_uuid(),
>   name text not null,
>   code text unique not null,
>   owner_id uuid references auth.users(id) on delete cascade,
>   church_name text,
>   created_at timestamptz default now()
> );
>
> create table study_group_members (
>   group_id uuid references study_groups(id) on delete cascade,
>   user_id uuid references auth.users(id) on delete cascade,
>   joined_at timestamptz default now(),
>   primary key (group_id, user_id)
> );
>
> create table shared_lessons (
>   id uuid primary key default gen_random_uuid(),
>   group_id uuid references study_groups(id) on delete cascade,
>   shared_by uuid references auth.users(id),
>   track text not null,
>   topic text not null,
>   lesson_json jsonb not null,
>   note text,
>   created_at timestamptz default now()
> );
>
> alter table study_groups enable row level security;
> alter table study_group_members enable row level security;
> alter table shared_lessons enable row level security;
>
> create policy "Members see their groups" on study_groups
>   for select using (
>     auth.uid() = owner_id or
>     exists (select 1 from study_group_members where group_id = id and user_id = auth.uid())
>   );
> create policy "Members see shared lessons" on shared_lessons
>   for select using (
>     exists (select 1 from study_group_members where group_id = shared_lessons.group_id and user_id = auth.uid())
>     or exists (select 1 from study_groups where id = shared_lessons.group_id and owner_id = auth.uid())
>   );
> ```
> Verify all RLS with `supabase` MCP before proceeding.
>
> **Group code generation (`api/study-group.js`):**
> - POST `{ action: 'create', name, church_name }` → generates 6-char uppercase code, creates group, returns code
> - POST `{ action: 'join', code }` → adds user to group
> - POST `{ action: 'share', group_id, track, topic, lesson_json, note }` → saves shared lesson
> - GET `?group_id=xxx` → returns last 10 shared lessons for group
>
> **Bible Study Hub UI additions in `faith.js`:**
>
> After a lesson is generated, show action row with:
> - "Share with Group" button → opens group picker modal
>   - If user has no group: show "Create a Group" and "Join a Group" options
>   - Create: enter group name → get shareable code to send to members
>   - Join: enter 6-char code
>   - If user has group(s): show list, tap to share lesson with optional note
>
> Add a "Group Feed" sub-tab in Bible Study Hub:
> - Shows last 10 lessons shared by group members
> - Each entry: track badge, topic name, shared by (first name), date, "Load This Study" button
> - Empty state: "No shared studies yet — generate one and share it with your group"
>
> `node --check` all files, verify tail, commit `"feat: Bible Study group sharing with join codes and group feed"` and push.

---

## PHASE 3B — Parent Dashboard Faith Reporting

> Use `superpowers` MCP. Read `CLAUDE.md`. Run `node --check` on all modified files. Verify index.html tail.
>
> **Build: Faith activity reporting in Parent Hub**
>
> **Supabase — faith activity log table:**
> ```sql
> create table faith_activity (
>   id uuid primary key default gen_random_uuid(),
>   user_id uuid references auth.users(id) on delete cascade,
>   activity_type text not null,
>   detail text,
>   created_at timestamptz default now()
> );
> alter table faith_activity enable row level security;
> create policy "Users log own activity" on faith_activity
>   for insert with check (auth.uid() = user_id);
> create policy "Parents see child activity" on faith_activity
>   for select using (
>     auth.uid() = user_id or
>     exists (
>       select 1 from profiles
>       where id = faith_activity.user_id
>       and parent_id = auth.uid()
>     )
>   );
> ```
>
> **Activity logging — add these calls throughout `faith.js`:**
> - Bible study generated → `{ activity_type: 'bible_study', detail: topic }`
> - Devotional opened → `{ activity_type: 'devotional', detail: devotional_title }`
> - Prayer submitted → `{ activity_type: 'prayer' }`
> - Proof/evidence viewed → `{ activity_type: 'proof', detail: proof_title }`
> - Well opened (daily) → `{ activity_type: 'well_visit' }`
>
> **Parent Hub — new "Faith" tab (4th tab alongside existing tabs):**
>
> Shows for each child profile:
> - This week's faith activity summary: visits, studies, devotionals, prayers (metric cards)
> - Activity feed: last 14 days of logged activity with icons and timestamps
> - Current streak badge pulled from `user_streaks` table
> - "Most studied topic" derived from `faith_activity` logs
> - If no activity in 7+ days: gentle nudge card "No faith activity this week — invite [child name] to The Well"
>
> Use the existing Parent Hub tab pattern — add `faithReport` tab following same structure as other Parent Hub tabs.
>
> `node --check` all files, verify tail, commit `"feat: Parent Hub faith activity reporting tab"` and push.

---

## PHASE 4A — Admin Content Calendar

> Use `superpowers` and `supabase` MCPs. Read `CLAUDE.md`. Run `node --check` on all modified files. Verify index.html tail.
>
> **Build: Content calendar for scheduled featured content in The Well**
>
> **Supabase table:**
> ```sql
> create table well_featured (
>   id uuid primary key default gen_random_uuid(),
>   content_type text not null, -- 'verse' | 'study' | 'series' | 'announcement'
>   title text not null,
>   body text,
>   track text,
>   topic text,
>   start_date date not null,
>   end_date date not null,
>   active boolean default true,
>   created_at timestamptz default now()
> );
> alter table well_featured enable row level security;
> create policy "Anyone can read active featured" on well_featured
>   for select using (active = true and start_date <= current_date and end_date >= current_date);
> create policy "Service role manages featured" on well_featured
>   for all using (true);
> ```
>
> **`api/well-featured.js`:**
> - GET → returns current active featured item (no auth required)
> - POST/PUT/DELETE → requires `x-admin-token: ylcc-admin-2729` header
>
> **`admin.html` — Content Calendar section:**
> - Table of all scheduled items with start/end dates, type, title, active toggle
> - "Add Featured Item" form:
>   - Type selector: Verse of the Week / Featured Study / Series / Announcement
>   - Title, body text
>   - For Study type: track + topic dropdowns (populated from BIBLE_STUDY_TRACKS)
>   - Date range picker: start date → end date
>   - Active toggle
> - Calendar view showing which days have content scheduled
> - Pre-built series presets: Advent (Dec 1–25), Lent, Back to School, New Year
>
> **The Well home — featured content banner:**
> - On load, fetch `/api/well-featured`
> - If active item exists: show a gold banner card below the hero CTA
>   - Verse type: show verse text with reference
>   - Study type: show topic with "Start This Study →" button that pre-loads the Bible Study Hub with that track/topic
>   - Announcement: show title + body
>   - Series: show series name with week number
> - If no active item: banner hidden, no layout shift
>
> `node --check` all files, verify tail, commit `"feat: admin content calendar with featured Well banner"` and push.

---

## PHASE 4B — Global Faith Search

> Use `superpowers` MCP. Read `CLAUDE.md`. Run `node --check` on all modified files. Verify index.html tail.
>
> **Build: Global search across all faith content in The Well**
>
> **What is searchable:**
> - Bible study topics (from `BIBLE_STUDY_TRACKS` — all 80 topics across 4 tracks)
> - Saved Bible study lessons (from `bible_study_saves` table if built)
> - Proof/evidence items (from existing Proof tab data)
> - Devotional titles
> - Prayer entries (user's own only)
> - Shared group lessons (user's groups only)
> - Faith Academy items
>
> **UI — Search tab in The Well:**
> - Add a search icon tab to The Well nav
> - Full-width search input with gold focus ring
> - Search triggers after 2+ characters with 300ms debounce
> - Results grouped by category with section headers:
>   - 📖 Bible Studies (matching topics)
>   - 📜 Proof & Evidence
>   - 🙏 Prayers
>   - ⭐ Devotionals
>   - 👥 Group Lessons
> - Each result is tappable — deep-links directly into that content
>   - Bible study result → opens Bible Study Hub with that track/topic pre-selected and auto-generates
>   - Proof result → opens Proof tab scrolled to that item
>   - Prayer → opens Prayer tab
> - Empty state: "No results for '[query]' — try a topic like 'forgiveness' or 'anxiety'"
> - Recent searches stored in localStorage under `ylcc_recent_searches` (last 5)
> - Recent searches shown when input is focused but empty
>
> **Server-side search for saved content (`api/faith-search.js`):**
> - POST `{ query, user_id }`
> - Searches `bible_study_saves`, `shared_lessons` (user's groups), `faith_activity` via Supabase `ilike`
> - Returns ranked results, max 20 total
> - Auth required
>
> `node --check` all files, verify tail, commit `"feat: global faith search across all Well content"` and push.

---

## DEPLOYMENT ORDER

Run these in sequence — each phase builds on the previous:

1. `PHASE 1A` — Streaks (Supabase table + API + UI)
2. `PHASE 1B` — Push notifications (VAPID keys first, then build)
3. `PHASE 2A` — Well onboarding (Supabase column + 3-screen UI)
4. `PHASE 2B` — Offline mode (service worker — do AFTER 1B so SW files don't conflict)
5. `PHASE 3A` — Group sharing (3 Supabase tables + share UI)
6. `PHASE 3B` — Parent faith reporting (Supabase table + Parent Hub tab)
7. `PHASE 4A` — Content calendar (Supabase table + admin UI + Well banner)
8. `PHASE 4B` — Global search (search UI + API)

## GLOBAL RULES FOR ALL SESSIONS

- Always read `CLAUDE.md` first
- Always verify index.html tail: `function tick()` + `setInterval(tick` + Google Translate script tag
- `node --check` every modified JS file before committing
- Use `supabase` MCP to verify RLS on every new table
- Never use `git push --force`
- Deploy via `git push` from Claude Code bash only
- All contact email: info@kingdom-creatives.com
- Canonical domain: https://yourlifecc.com
