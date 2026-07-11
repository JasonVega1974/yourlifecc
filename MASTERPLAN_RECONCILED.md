> **⚠️ SUPERSEDED SNAPSHOT (2026-06-04).** The 8-tab matrix here is still a useful reference but predates the juice layer, Command Center, sports build, and My Climb. For the current verified state see **`STATUS_RECONCILED_2026-07-10.md`** (which carries this doc's tab matrix forward, unverified, and adds everything shipped since).

# MASTERPLAN_RECONCILED.md

**Generated:** 2026-06-04
**Read-only analysis** — no `/app/` edits, no SQL run, no commits.
**Input plan:** `YOURLIFECC_APP_UPGRADE_MASTERPLAN.md` (May 2026)
**Verdict:** Plan is partially obsolete. Several premises are wrong; one of its named DB tables (`habits` / `habit_completions`) already exists with a different schema than the plan specifies. Reconciled build order at the bottom.

---

## 0. Plan's stated premises vs reality

| Plan premise | Plan says | Reality | Status |
|---|---|---|---|
| App is single-file | "Single-file app at `app/index.html` (~28,800 lines)" | `app/index.html` is **16,533 lines** (43% smaller than claim) plus **27 modules in `app/js/*.js` totaling 64,664 lines** (plus 5,848 lines of `app/css/app.css`). Modular from before the plan. | **WRONG** |
| CSS uses Tailwind CDN | "TECH STACK: Tailwind CSS (CDN), Chart.js (CDN), Supabase JS v2" | **Zero Tailwind references** anywhere in `app/index.html`, `app/css/app.css`, or any JS module. Verified by `grep -nE "<script src.*[Tt]ailwind\|cdn\.tailwindcss\.com\|@tailwind"` — no matches. Chart.js IS present (`index.html:46`). Supabase JS v2 IS present. | **WRONG on Tailwind only** |
| Faith tab is the gold standard for the 8 tabs to copy | "Multiple sub-tabs, 100+ content items, dedicated animated hero, admin content management, deep Supabase integration" | True at time of writing. Since the plan: Faith Zones, Quick Prayer library, Pray-this focus mode, Heart Check, Night Reflection, Growth Profile, dynamic OG cards + `/prayer/:id` landing have all shipped. Faith stack is now ~16,000 module lines (`faith.js` 12,854 + `faith-zones.js` 1,896 + `quick-prayers.js` 441 + `prayer-focus.js` 326 + `streaks.js` 142). | **OK but understated** |

**Real module list (`app/js/*.js`):**
```
config.js (17)              data.js (197)                 sync.js (240)
auth.js                     ui.js (2,115)                 init.js (2,628)
finance.js (478)            school.js (1,019)             health.js (465)
goals.js (1,175)            skills.js (6,386)             chores.js (~784)
sports.js (641)             habits.js (1,410)             email.js (1,591)
parent.js (5,248)           resume.js (751)               misc.js (3,371)
faith.js (12,854)           faith-resources.js (141)      worship.js (384)
faith-zones.js (1,896)      prayer-focus.js (326)         quick-prayers.js (441)
streaks.js (142)            traits.js (350)               celebrations.js (626)
modal-actions.js (210)      daily-briefing.js (300)       app-home.js (171)
command-center.js (~480)    pwa.js (278)
```
Plus the data/ subfolder with the canonical Bible / prayer / academy / timeline / lesson datasets.

---

## 1. Tabs — DONE / PARTIAL / NOT STARTED

| # | Tab | Status | Detail |
|---|---|---|---|
| 1 | **Chores** | **NOT STARTED** | Flat chore list with check-off + `s-rewards` (Parent Bucks store, spinner, scratch). None of the 5 plan sub-tabs (My Chores kanban / Chore Store / Leaderboard / History / Streaks) exist. No difficulty tiers, due-date field, photo proof, recurring engine, drag-drop, AI Chore Coach. The Parent Bucks ecosystem is real and could be reused as the Chore Store, but lives in the wrong section. |
| 2 | **Money** | **PARTIAL** | Topic-card grid (`#financeTopicGrid` at `index.html:2391`) routes to 7 panels via `tgOpenTopic('s-finance', …)` — Overview / Bills / Transactions / Goal Savings / Sav. Goals / Budget / Tax Ed. Has Transactions + Goal Savings (plan's "Transactions" + "Goals"). Missing dedicated **Learn** sub-tab (only static tax-ed HTML), **Allowance** sub-tab (`D.allowance` declared but never read), What-if simulator, parent purchase approval, CSV export, virtual debit-card visual. Tax data still **2024** (P1 carry-over). |
| 3 | **Goals** | **PARTIAL** | Goal CRUD + per-goal milestones + AI suggest (`/api/ai-summary` mode `goal-suggest`) + SVG progress rings + Career Explorer (35 careers — bonus, not in plan). Missing **Vision Board**, **Completed trophy room** (only filter), **Inspire Me library** (60+ ideas × 6 categories), **AI Check-In** sub-tab, deadlines + countdowns, photo attachment, parent visibility toggle, AI goal decomposition. |
| 4 | **Habits** | **DONE** (with schema deviation — see §2) | New top-level section `s-habits` + `app/js/habits.js` (1,410 lines) — closes the "missing first-class concept" audit finding. All 6 plan sub-tabs shipped: 🌅 Today / 🔥 Streaks / 📊 Analytics / 🔗 Stack / 📚 Library / 🧪 Science. Chart.js analytics (weekly / best-day / time-of-day). 12-week heatmap (`buildHabitsHeatmap`). Habit stacks. Library 60+ entries. Science cards. Time-of-day grouping. **Notes:** s-habits not added to STAGE_CONFIG.sections (sidebar visibility filter — added after STAGE_CONFIG was authored). Per-habit 66-day formation tracker and parent-suggested-habits flow not surfaced yet. |
| 5 | **Schedule** | **PARTIAL** | Day / Week / Month all work (in `school.js`). Calendar is a separate parallel UI (audit cross-cutting #3 — not integrated with schedule). **No real recurrence** — "Every Monday" only fills the current week (audit P0). No Agenda sub-tab (only the legacy `#heroQuickStats` upcoming widget). No Family calendar. No iCal/Google import. No Brevo reminders (infra exists in `/api/send-email`). No weekly planning wizard. Parent-hub mirror works. |
| 6 | **CBT Training** | **NOT STARTED** (and namespace risk unresolved) | Section labeled "Tech Skills" in UI but section id `s-cbt`, function `cbtTab`, state `D.cbtProgress` still present (audit cross-cutting #2 unchanged). Current content: typing speed test + 5 lesson modules (Basics / Windows / Linux / Coding / Internet). NOT the masterplan's life-skills LMS (Landing First Job / Money Basics for Teens / Healthy Relationships 101 / Time Management Mastery / Digital Citizenship). No certificates, no AI Tutor, no video embed, no admin course builder. **Decision needed before any work:** rename to `s-tech` OR pivot to the LMS spec. |
| 7 | **Skills** | **PARTIAL** (Lifetime anchor still missing) | Flat 42-category grid + quiz + cert. AI quiz analysis (`/api/ai-summary` default mode). Cert generation + `printCert` + `navigator.share` fallback. **Legacy Vault — ANCHOR FEATURE for Lifetime plan — not built.** No 8-domain restructure (plan target: 80+ skills × 8 domains; actual 42 flat categories). No Assessments sub-tab. No Career Paths analyzer (Career Explorer for 35 careers lives in **Goals** tab, not Skills). No PDF Portfolio export. No skill badges. No skill challenge of the month. `skills.js` (6,386 lines) remains the grab-bag holding resume, bio, journal, themes, music, and tutorial — audit cross-cutting #9 unchanged. |
| 8 | **Parent Hub** | **PARTIAL** | `s-parent` (PIN-hash-gated) + 14 `phNav()` panels. Visible top-tab buttons: Activity / Rewards / Controls / Reports (4 of plan's 8). Has plan's: Reports (weekly Brevo AI report), Controls (feature toggles), Chore Manager (`ph-chores`). Missing dedicated: **Dashboard** family-snapshot, **Alerts** realtime activity feed (Supabase realtime not subscribed), **Approvals** queue (chore-photo proofs blocked by missing bucket; self-chore approvals live in Rewards section), **Messages** parent→child inbox, **Goals** family-goals/rewards (`MONTHLY_CHALLENGES = []` empty, renderer would throw — guarded in last deploy). PIN gate + multi-profile + behavior log + Parent Bucks management + Brevo Monday-send all solid. |

### Tabs summary

```
DONE        →  Habits (1 of 8)
PARTIAL     →  Money, Goals, Schedule, Skills, Parent Hub (5 of 8)
NOT STARTED →  Chores, CBT Training (2 of 8)
```

---

## 2. CREATE TABLE conflicts — what already exists vs what plan proposes

### 2.1 Tables that already exist in `docs/migrations/*.sql`

| Table | Source migration | Used by |
|---|---|---|
| `public.habits` | `habits-schema.sql:33` | Habits module |
| `public.habit_completions` | `habits-schema.sql:53` | Habits module |
| `public.faith_plan_progress` | `F2-B-faith-plans.sql:20` | Faith reading plans |
| `public.prayer_requests` | `F2-E-prayer-requests.sql:20` | Prayer module |
| `public.memory_verses` | `F2-F-memory-verses.sql:18` | Memory verses (SM-2-lite) |
| `public.faith_activity_log` | `faith-activity.sql:21` | Faith activity tracking |
| `public.faith_journey_entries` | `faith-journey.sql:12` | Faith journey |
| `public.faith_profile` | `faith-journey.sql:50` | Per-user faith profile |
| `public.donations` | `F6-B-faith-only-tables.sql:42` | Faith-free donation prompts |
| `public.announcements` | `F6-B-faith-only-tables.sql:99` | Faith-free announcements |
| `public.ministry_highlights` | `F6-B-faith-only-tables.sql:145` | Faith-free ministry surface |
| `public.user_streaks` | `streaks-engine.sql:13` | Forgiveness-aware streak engine |
| `public.push_subscriptions` | `push-subscriptions.sql:13` | Web Push backend (no client UX yet) |
| `public.featured_content` | `content-calendar.sql:17` | Content calendar |
| `admin_card_photos` | `admin-card-photos.sql:10` | Admin photo manager |
| `study_groups`, `study_group_members`, `shared_lessons` | `study-groups.sql:14, 41, 76` | Faith study groups |

Plus `engagement-loop.sql`, `engagement-tracking.sql`, `ai-content.sql`, `onboarding-flag.sql`, `well-onboarding.sql`, `return-phase1.sql` (separate `/return` event app).

### 2.2 ⚠️ habits / habit_completions — concrete conflict

**Plan (line 273-294 of masterplan):**
```sql
CREATE TABLE habits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id),
  name          TEXT NOT NULL,
  category      TEXT,
  time_of_day   TEXT CHECK (time_of_day IN ('morning','afternoon','evening','anytime')),
  frequency     TEXT DEFAULT 'daily',
  streak        INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE habit_completions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id        UUID REFERENCES habits(id),
  user_id         UUID REFERENCES profiles(id),
  completed_date  DATE NOT NULL,
  note            TEXT,
  UNIQUE(habit_id, completed_date)
);
```

**Actual (`docs/migrations/habits-schema.sql:33-67`):**
```sql
create table if not exists public.habits (
  id            text primary key,                       -- 'hbt_…' from habits.js
  user_id       uuid references auth.users(id) on delete cascade not null,
  name          text not null,
  emoji         text not null default '✅',
  category      text,
  time_of_day   text not null default 'anytime'
                check (time_of_day in ('morning','afternoon','evening','anytime')),
  cue           text,
  stack_after   text references public.habits(id) on delete set null,
  streak        int  not null default 0,
  longest_streak int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create table if not exists public.habit_completions (
  id              uuid primary key default gen_random_uuid(),
  habit_id        text references public.habits(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  completed_date  date not null,
  note            text,
  created_at      timestamptz not null default now(),
  unique (habit_id, completed_date)
);
```

**Conflict points (4):**

| # | What | Plan | Actual | Impact if plan's literal SQL runs |
|---|---|---|---|---|
| 1 | `habits.id` type | `UUID` (random) | `text` (`'hbt_…'` from `habits.js`) | `IF NOT EXISTS` makes the CREATE a no-op → plan's UUID schema is silently discarded. If someone deletes the existing table and runs the plan, every `habit_id` in `habit_completions` (text) becomes incompatible. |
| 2 | `habits.user_id` FK | `profiles(id)` | `auth.users(id) ON DELETE CASCADE` | Plan's FK target is wrong — `profiles.user_id` is the Supabase Auth user id, but `profiles.id` is the row's surrogate PK. The actual schema is correct (FK to `auth.users`). |
| 3 | `habit_completions.habit_id` FK type | `UUID` | `text` (matches `habits.id`) | Type mismatch — plan would fail FK creation. |
| 4 | Missing columns in plan | — | `emoji`, `cue`, `stack_after`, `updated_at` | Plan would not capture stack-after FK (used by Habits Stack sub-tab) or emoji (used in every render). |

**Verdict:** Delete the `## TAB 4: HABITS → Supabase schema additions` block from the masterplan entirely. Habits ships with `habits-schema.sql`; do not re-spec the schema.

### 2.3 Tables the plan proposes that do NOT exist

| Plan table | For tab | Status | Notes |
|---|---|---|---|
| `chore_streaks` | Chores | **MISSING** | Currently `D.choreStreak` lives in JSONB blob via `profiles.data`. Plan would split it out — fine, but requires migration helper. |
| `chore_store_items` | Chores | **MISSING** | Parent Bucks store already exists at `D.pb.storeItems` in JSONB. Plan would normalize — fine. |
| `money_transactions` | Money | **MISSING** | Currently `D.transactions[]` in JSONB. |
| `money_goals` | Money | **MISSING** | Currently `D.savingsGoals[]` in JSONB. |
| `budget_categories` | Money | **MISSING** | Currently no normalized categories — categories are inline strings on transactions. |
| `cbt_courses` | CBT | **MISSING** | Currently lesson data hard-coded in `misc.js`. |
| `cbt_lessons` | CBT | **MISSING** | Same. |
| `cbt_progress` | CBT | **MISSING** | Currently `D.cbtProgress{module:{idx:true}}` in JSONB. |
| `cbt_certificates` | CBT | **MISSING** | Skills certs use `D.skillCerts{}`; CBT has none. |
| Plan also proposes `ALTER TABLE chores ADD COLUMN difficulty TEXT…` etc. | Chores | **N/A** | There is no `chores` table at all. The "chores" entity lives entirely in the `profiles.data` JSONB blob. ALTER would fail. |

---

## 3. Storage buckets — 0 of 5 exist, 1 extra exists

Plan calls for: `chore-proofs`, `goal-images`, `legacy-vault`, `cbt-thumbnails`, `skill-evidence`.

Grep across `app/js/*.js`, `api/*.js`, `docs/migrations/*.sql`:

| Bucket | In plan? | In code? | Status |
|---|---|---|---|
| `chore-proofs` | ✓ | ✗ | **MISSING — needs creation + RLS** |
| `goal-images` | ✓ | ✗ | **MISSING — needs creation + RLS** |
| `legacy-vault` | ✓ | ✗ | **MISSING — needs creation + RLS** |
| `cbt-thumbnails` | ✓ | ✗ | **MISSING — needs creation + RLS** |
| `skill-evidence` | ✓ | ✗ | **MISSING — needs creation + RLS** |
| `card-photos` | ✗ | ✓ (`api/upload-card-photo.js:24`) | **EXISTS — not in plan**. Used by admin card-photo manager via `admin_card_photos` table. Add to plan as an existing capability. |

Storage is the single biggest infrastructure pre-req — at least Chores photo-proof, Goals Vision Board, Skills Legacy Vault, and Money savings-goal photos all unblock as soon as buckets exist.

---

## 4. Things shipped that the plan never anticipated

These are net-new since the plan was written. They don't replace plan items but they change the optimal build order (mostly: less work to do because foundations exist).

- **Habits tab** (`s-habits` + `habits.js`) — fully shipped as described above.
- **Command Center home** (`#appCommandCenter` + `command-center.js`) — Constellation hero with starfield, nebulas, breathing orbs, focus pulses, stage-aware tile order, animated dashed flow toward focus, empty-state "Day 1 starts now" framing. Replaces the simplified 6-button `#appHome` as the primary surface for non-faith-free non-parent-view accounts. Plan's "Home Screen" global upgrade is partially superseded.
- **Gamification foundation** — `celebrations.js` (10 animations including confetti / trait explosions / prayer dove / Real Life Wins / streak banners) + `traits.js` (7 identity traits × 5 levels × daily growth × growth streak + Growth Profile UI). Plan's "Gamification Layer" can build on these instead of starting from zero.
- **Faith stack expansion** — Faith Zones (4 → 7-destination home), Quick Prayer library (`quick-prayers.js` 441 lines + Cloudflare-immune `/api/og.js` + `/api/prayer-share.js` + `/prayer/:id` route), Pray-this focus mode, Heart Check (12 emotional states with verse + prayer + action), Night Reflection (3-step), Growth Profile (tappable trait cards). Faith stack now far past plan's reference quality bar.
- **Supabase migration template** (`docs/migrations/_TEMPLATE.sql`) — with explicit `GRANT` statements for the Oct 30 2026 Data API change. All 19 existing migrations updated. Plan didn't anticipate this Supabase change.
- **The Return** (`/return.html` + `api/return-admin.js` + `return-phase1.sql`) — separate event-companion app. Out of plan scope; flag as a separate product.

---

## 5. Phase 0 carry-overs from STATUS_REPORT and AUDIT_REPORT still open

These are P0/P1 items from prior audits that are not yet done:

| # | Item | File:line | Source |
|---|---|---|---|
| 1 | 2024 tax data still hardcoded in `skills.js` — two tax years stale | `skills.js:112, 187, 201, 215, 268, 502, 611, 613, 1056, 1076, 2411, 2416` | STATUS_REPORT §1 P1-4 |
| 2 | Duplicate `cooking:` key in `SK_QUIZ` (silent overwrite) | `skills.js:3411` + later | STATUS_REPORT §1 P1-8 |
| 3 | `parentDrillChild` clobber-risk path not re-verified | `parent.js:2443` | STATUS_REPORT §1 P0-3 |
| 4 | Schedule recurrence is fake (only fills current week) | `school.js:567-581` | AUDIT_REPORT §5 P0 |
| 5 | CBT namespace decision pending | `s-cbt` everywhere | AUDIT_REPORT cross-cutting #2 |
| 6 | `MONTHLY_CHALLENGES = []` empty (guarded now, but no challenges defined) | `parent.js:1370` | AUDIT_REPORT cross-cutting #11 |
| 7 | 9+ disconnected streak trackers (math / typing / chore / flashcard / faith / devotional / daily-W / reading-plan / habits) | scattered | AUDIT_REPORT cross-cutting #1 |

---

## 6. Reconciled build order

Order assumes the goal is to ship the masterplan's intent with minimum re-work, honoring what already exists.

### Phase A — Infrastructure prereqs (unblocks multiple tab upgrades)

1. **Create 5 Storage buckets** with RLS + size limits per plan §"Storage Buckets":
   - `chore-proofs` (5 MB, public, images only)
   - `goal-images` (10 MB, public, images only)
   - `legacy-vault` (50 MB, private, all file types)
   - `cbt-thumbnails` (5 MB, public, images only)
   - `skill-evidence` (20 MB, private, images + docs)
2. **Delete plan's Habits schema block** — already exists with different (better) schema. Don't re-spec.
3. **Decide CBT namespace** — rename `s-cbt` → `s-tech` (mechanical, ~50 callsites) OR pivot CBT to the LMS spec. Either path unlocks Tab 6 work.
4. **Stop claiming Tailwind in any new doc/agent prompt** — the app is vanilla CSS. The plan's "TECH STACK" line misled.

### Phase B — Carry-over fixes (cheap, unblock confidence)

5. Refresh 2024 → 2026 tax data in `skills.js` (P1 carry-over).
6. De-duplicate `cooking:` quiz in `skills.js:3411`.
7. Verify `parentDrillChild` exit paths restore `D` cleanly.

### Phase C — Highest-leverage features (in priority order)

8. **Skills → Legacy Vault** (Lifetime plan anchor). Requires `legacy-vault` bucket + new sub-tab + parent-verification flow + 1 new table for `legacy_vault_items`. Single biggest differentiator.
9. **Chores upgrade**: 5 sub-tabs (My Chores kanban / Chore Store / Leaderboard / History / Streaks) + photo proof (`chore-proofs` bucket) + difficulty tiers + recurring chore engine. Re-use existing Parent Bucks for Chore Store.
10. **Money upgrade**: Allowance sub-tab (`D.allowance` already in DEF), Learn sub-tab as 8 modular lessons, What-if savings simulator, switch SVG donut → Chart.js (already loaded globally for Habits).

### Phase D — Schedule + Parent Hub

11. **Real recurrence** in Schedule (audit P0). RRULE-style. Optionally merge Schedule + Calendar UIs.
12. **Cross-feature feed on calendar**: school assignments, chore due dates, goal milestones, reading-plan day.
13. **Parent Hub additions**: Approvals queue (unifies chore-photo + purchase requests + self-chore approvals — needs `chore-proofs` bucket), Messages sub-tab (parent → child), Family Snapshot Dashboard at `ph-home`.

### Phase E — Goals + Skills polish

14. Goals: Vision Board (requires `goal-images` bucket), Inspire Me library (60+ ideas × 6 categories), AI Check-In, deadlines + countdowns.
15. Skills: 8-domain restructure (40+ new skill entries to reach 80+), Assessments sub-tab, Badges sub-tab, Career Path analyzer (move from Goals tab or duplicate), PDF Portfolio export, Skill Challenge of the Month.

### Phase F — CBT (after decision in step 3)

16. If LMS path: build 5 courses × 10 lessons. Create `cbt_courses` / `cbt_lessons` / `cbt_progress` / `cbt_certificates` tables + admin builder + AI Tutor. Otherwise: rename and skip.

### Phase G — Global (per plan §"GLOBAL UPGRADES")

17. **Unified Notifications** — backend `push_subscriptions` table exists; add bell icon + in-app feed + Brevo digest preference.
18. **Onboarding Wizard upgrade** — current self-healing entry wizard works; plan's per-tab tooltip tour is additive.
19. **Gamification XP/level** — build on `traits.js` foundation. Plan's Seedling → Legacy ladder maps cleanly onto trait levels.
20. **Streak engine consolidation** — fold the 9 scattered trackers into one canonical engine on top of `D.streak` / `user_streaks` (separate from plan but blocks any honest "Day N streak" hero copy).

### What's already done (don't re-do)

- ✅ Habits tab (full spec).
- ✅ Home Screen redesign (Command Center).
- ✅ Gamification foundation (`celebrations.js`, `traits.js`).
- ✅ Faith stack (far past plan's reference bar).
- ✅ Supabase migration template + Oct 30 2026 compliance.

---

*End of reconciled plan. No edits made to any production code, no SQL run, no commits. Awaiting direction.*
