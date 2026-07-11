> **⚠️ STALE SNAPSHOT (2026-05-22).** Historical audit baseline. For current verified state see **`STATUS_RECONCILED_2026-07-10.md`**.

# YourLife CC — Full App Audit Report

**Date:** 2026-05-22
**Auditor:** Claude Code (Opus 4.7, 1M context) — multi-agent fan-out, one subagent per tab
**Scope:** Read-only inventory of 8 primary tabs: Chores & Rewards, Money/Finance, Goals, Habits, Schedule, CBT Training, Skills, Parent Hub
**Method:** Per-tab subagent ran focused grep + module reads against `app/index.html` + `app/js/*.js`. No code was modified.

---

## Pre-flight checks

| Check | Result |
|---|---|
| `wc -l app/index.html` | **13,145 lines** |
| `function tick()` | line 11900 — present |
| `setInterval(tick, 1000)` | line 11915 — present |
| Google Translate script tag | line 12163 — present |
| `</body>` | line 13144 — present |
| Tail integrity | **PASS** |

**Note:** `CLAUDE.md` baseline says `/app/index.html` is "~6,829 lines" with `function tick()` "currently ~line 6343". Actual file is **~93% larger** than that baseline. The tail-integrity heuristic still works (presence-based, not line-based) but the CLAUDE.md numbers are stale and should be refreshed.

**Supabase tables referenced (grep `from\('…'\)` across app/index.html):** zero direct calls — every feature persists via the single `profiles.data` JSONB blob (per-feature tables exist in `docs/migrations/` for memory verses / prayer requests / faith plans, but the surveyed 8 tabs all ride the blob).

**API endpoints called from index.html:** `/api/ai-summary` (weekly summary + ask-bible + goal-suggest + skills quiz analysis), `/api/send-email`, `/api/faith-report`. No Chart.js usage. No `storage.upload/getPublicUrl` calls from the eight surveyed tabs.

---

## 1. Chores & Rewards

**Location:** `app/index.html` 4343–4461 (`s-chores`) + 4509–4605 (`s-rewards`). `app/js/chores.js` (784 lines). Also touches `parent.js`, `email.js` (Parent Bucks + Spinner + Scratch), `data.js:112–113`.

**Sub-views:** Points bar · PB strip + Spinner/Scratch/Store · Level progress · Today's chores · "I Did Something Helpful" (self-initiated) · Kid Rewards Shop · Recent Activity · Screen Time manager · Earnings + Savings Jar · Parent Bucks Store · Reward Games.

**Working features:** Full chore CRUD with parent verify; self-chore submit + parent tier-approval (+10/+25/+50); 8-tier level system (Beginner→GOAT, 0→10,000+ pts); day streak from verified-log dates; screen-time timer with reward minutes; earnings + savings goal; Parent Bucks economy (1 PB per pt, +1 spin every 3rd verify); spinner + scratch ticket games; PIN-gated Rewards unlock; activity log; confetti + celebration toasts.

**State keys:** `D.chores[]`, `D.choreLog[]`, `D.chorePoints {total,spent}`, `D.chorePin` (legacy), `D.rewards[]`, `D.selfChores[]`, `D.helpfulDeeds[]`, `D.pb {balance,log,storeItems,spinnerSlices,scratchPrizes,spinTickets,scratchTickets}`, `D.screenTime{games,tv,phone,tablet}`, `D.earnings{balance,totalEarned,goalName,goalAmount,saved,log}`.

**Gaps / bugs:**
1. 🔴 **`D.chorePoints` schema collision** — `parent.js:3051-3052` does `if(!D.chorePoints) D.chorePoints = 0; D.chorePoints += points;` but `chores.js` stores it as `{total,spent}`. `approveSelfChore` will produce `"[object Object]<n>"` string concat, corrupting state.
2. 🟠 **Self-chore approval doesn't log** — points are awarded but no `D.choreLog` push, so approved self-chores are invisible in Recent Activity and don't feed streak math.
3. 🟠 **Duplicate "helpful" feature** — `D.selfChores` (chores tab) and `D.helpfulDeeds` (contests tab) are parallel state with separate approval UIs.
4. 🟡 **DEF schema drift** — `data.js:112` declares `chores:{}` (object) but every consumer assumes array; defensive `Array.isArray` is everywhere.
5. 🟡 No edit-reward UI (only add/delete).
6. 🟡 `D.chorePin` is legacy plaintext — superseded by `parentPinHash` but still initialized.
7. 🟡 No weekday/one-shot completion model for daily chores — they show every day regardless of yesterday's status.

---

## 2. Money / Finance

**Location:** `app/index.html` 1393–1861 (`s-finance`). `app/js/finance.js` (479 lines). Tax calculator lives in **`app/js/skills.js:4971-5027`** (orphan placement). Defaults: `data.js:66–69`.

**Sub-views (two parallel UIs for the same content — Phase 5.8 Pass D pattern):** Topic-card grid (7 cards, lines 1420–1456) and classic tab bar (8 tabs: Overview · Bills · Transactions · Goal Savings · Sav. Goals · Budget · **Paycheck** · Tax Ed.). Paycheck tab has no corresponding topic card — discoverability gap.

**Working features:** Checking + savings balance with 12-entry history; bill CRUD with paid toggle; transaction CRUD with income/expense/savings filter; live 50/30/20 budget calculator; savings-goal CRUD with confetti on completion; SVG spending donut (5 buckets); paycheck simulator (gross→net + 50/30/20 split); 2024 federal tax calculator for Single/MFJ/HoH with optional 1099 SE-tax computation; static tax-education content (W-2 vs 1099, deductions, retirement accounts, free-filing links).

**State keys:** `D.bank`, `D.bankLabel`, `D.bankSavAcct`, `D.bankSavAcctLabel`, `D.bankHistory[]`, `D.bills[]`, `D.transactions[]`, `D.savingsGoals[]`. **Declared but unused:** `D.earnings`, `D.allowance`.

**Gaps / bugs:**
1. 🔴 **Tax data is 2024** (brackets, $14,600/$29,200/$21,900 standard deduction, EITC $7,830, AOC $2,500, HSA $4,150/$8,300, mileage 67¢, 401k $23,000/IRA $7,000). Today is **2026-05-22 — content is two tax years stale** with no update mechanism.
2. 🟠 **`calcTax()` lives in `skills.js`, not `finance.js`** — architectural drift, easy to miss when grepping by section.
3. 🟠 **`D.earnings` / `D.allowance` orphaned** — declared in DEF but never read/written.
4. 🟠 **Paycheck sim ignores FICA + filing status** — flat 15% federal + 5% state, may mislead about real take-home.
5. 🟡 **`_txFilter` global never initialized in `finance.js`** — relies on declaration elsewhere; load-order ReferenceError risk.
6. 🟡 **Donut category filter is a known stub** — comment at `finance.js:396` acknowledges only type-level filtering.
7. 🟡 **XSS surface**: `g.emoji` (`finance.js:247`) rendered raw — user-supplied savings-goal emoji bypasses `escapeHtml`.
8. 🟡 Dead code: legacy `stat*` IDs in `updateFinSum`/`updateSavStats` write to DOM nodes that no longer exist; `renderFinanceDash()` has no callsite.
9. 🟡 No PB strip in finance section — every other major tab has one.

---

## 3. Goals

**Location:** `app/index.html` 2676–2779 (`s-goals`) + modals at 11220–11258, 11351–11379. `app/js/goals.js` (1,158 lines).

**Sub-views:** PB mini-bar · Life Vision card · 1/3/5/10-year Life Timeline · Goal stats strip (Total / Long-Term / Short-Term / Achieved) · Filter tabs · "Need inspiration?" AI suggest · Goals list · Career Explorer (35 careers in `CAREERS` array + custom input).

**Working features:** Goal CRUD with type/category/motivation/milestones; auto-complete when all milestones done; 10/25 PB on completion + scratch ticket every 5; SVG progress ring (shared with finance); slide-in completion card respecting `prefers-reduced-motion`; AI goal suggestions (`/api/ai-summary` mode `goal-suggest`); Life Vision + Timeline editing; Career Explorer with 35 entries (overview/dayInLife/salaryRange/howToStart/skills/timeline/resources/faithAngle); 4 badges in `misc.js` (Goal Getter, Dream Crusher, Explorer, Milestone Maker).

**State keys:** `D.goals[]`, `D.vision`, `D.timeline`, `D.selectedCareers[]`, `D.milestones[]` (separate "life milestones" — distinct from per-goal milestones).

**Gaps / bugs:**
1. 🔴 **`D.timeline` shape mismatch** — `DEF` declares `timeline:[]` (array) but `goals.js:441-449` reads/writes as `{1,3,5,10}` object. Writing keys onto the default array creates a sparse array; fragile JSON round-trip.
2. 🟠 **Field-name drift `doneDate` vs `achievedDate`** — `completeGoal` writes `doneDate`; orphaned `toggleGoal` writes `achievedDate`. Renderer only reads `doneDate`.
3. 🟠 **`addCustomCareer()` doesn't persist** — appends a DOM node but never writes to `D.*`; lost on next `buildCareers()` re-render. Also missing the `cv-card` wrapping class.
4. 🟠 **`editGoal()` has no UI affordance** — defined but no rendered button calls it.
5. 🟡 **`D.milestones` (life) vs per-goal `goal.milestones` name collision** — Parent dashboard math (`chores.js:454,480`) counts only the top-level array, ignoring per-goal.
6. 🟡 Categories are a flat 10-option dropdown with no icon/color/filter-by-cat.
7. 🟡 No deadlines / target dates / SMART scaffolding despite tooltip implying it.
8. 🟡 No linkage from Goals → Skills certs, Faith reading plans, or Health weight goal (obvious cross-feature wins).
9. 🟡 AI prompt sends `D.ageBracket` without client-side sanitization before POST.
10. 🟡 Goal-action toggles don't feed the hero "tasks today" counter — explicit comment at `goals.js:235-237` acknowledges.

---

## 4. Habits

**Status:** ❌ **Not a top-level tab.** Lives as (a) a homepage "Daily W's" widget in `#checkinGrid` (`app/index.html:1371-1378`) and (b) a thin mirror sub-tab inside Health (`#ht-habits`, line 2669). No sidebar entry, no `s-habits` section.

**Location:** Widget HTML 1371–1378; health mirror 2669–2673. Core logic in `app/js/ui.js:368–422` (`DEFAULT_HABITS`, `buildCheckins`, `toggleCheckin`, `addHabit`, `removeHabit`, `updateStreak`). Audit-log hook in `email.js:495–497`.

**Working features:** Default list of 10 habits (prayer, bible, workout, water, no-doom-scroll, journal, study, gratitude, sleep, tithe — 4 marked `faithOnly`); tap-to-check tiles; daily check persistence; custom habit add (prompt-based); audit log for parent; aggregate streak when ≥4 habits checked.

**State keys:** `D.streak` (aggregate), `D.lastCheckin` (toDateString), `D.checkin{"<dateString>":{key:true}}`, `D.customHabits[{key,label}]`, `D.faithMode`. **Declared but unused:** `D.dailyChecks` (`data.js:64`).

**De-facto streak/habit trackers scattered elsewhere (no unified surface):**
| Tracker | Field / ID | Location |
|---|---|---|
| Aggregate Daily W's | `D.streak` | `ui.js:417` |
| Scripture read days | `D.scrReadDays` | `faith.js`, 30+ writes |
| Faith streak with forgiveness | `D.faithStreakState` + `getScriptureStreak()` | `faith.js` + `streaks.js:25` (synced to `user_streaks` table) |
| Devotional completions | `user_streaks.devotional_completions` | `streaks.js:67-75` |
| Study completions | `user_streaks.study_completions` | `streaks.js` |
| Math practice streak | `#mathStreakDisp` | `index.html:3888` |
| Typing/skills practice | `#practiceStreakDisp` | `index.html:2915` |
| Chore streak | `D.choreStreak` | `chores.js` |
| Flashcard streak | `_fcStreak` (in-session only) | `index.html:9428` |
| Reading-plan streak | `rpStreakBanner` | `index.html:4791` |

**Gaps / concerns:**
1. 🟠 **Habits is the missing first-class concept the app actually needs.** At least 9 separate streak mechanisms in different modules, no shared engine, no consistent forgiveness rule, no unified calendar/heatmap.
2. 🟠 **Streak math is one-way** (`ui.js:417`) — `D.streak` only increments; never explicitly resets on missed days.
3. 🟠 **Timezone fragility** — `new Date().toDateString()` is locale-formatted; switching device locale fragments the `D.checkin` keyspace.
4. 🟡 **`D.streak` not synced to `user_streaks` table** — parent dashboards reading that table see only faith data.
5. 🟡 **`D.dailyChecks` is dead schema** in DEF — abandoned migration or planned-but-unbuilt feature.
6. 🟡 **Onboarding tutorial slide 2** (`index.html:11761`) promises a habits experience that never materializes — users get the dashboard widget instead.
7. 🟡 No habit-level streaks (only aggregate), no calendar/heatmap view despite per-day data being stored.
8. 🟡 Custom-habit add uses raw `prompt()` — no emoji picker, no validation.

---

## 5. Schedule

**Location:** Schedule UI `app/index.html` 2300–2340 + Calendar (separate section) 2343–2367. Event modal at 11197–11218. Parent-hub mirror `ph-schedule` at 10508–10534. **All logic lives in `app/js/school.js` (~lines 155–668)** — no dedicated `schedule.js`/`calendar.js`/`events.js` module.

**View modes:** Day (default) · Week · Month — **all three functional.** Each renders an 18-slot hourly table (6 AM–11 PM, `TIMESLOTS`). Switched by `schedSetView()`, branched in `buildSchedule()` at `school.js:314`.

**Working features:** View toggles + nav + jump-to-today + month/year picker; single-cell `setCell()`; bulk-fill `addScheduleBlock()` with day-mode resolution (today / specific date / every weekday / weekdays / weekend / allweek); undo via `scheduleBlocks` log; clear-month; custom activity palette (add/delete/hide/restore built-in); separate Calendar with `saveEvent/deleteEvent/prevMonth/nextMonth/renderCalendar/calClick/renderUpcoming`; parent-hub mirror lets parents view/edit any child's schedule.

**State keys:** `D.schedule{"YYYY-MM-DD_H":activityId}`, `D.events[{id,title,date,time,cat,notes}]`, `D.customActivities[{key,emoji,name,color}]`, `D.hiddenActivities[]`. **Lazily created (not in DEF):** `D.scheduleBlocks[]`.

**Gaps / bugs:**
1. 🔴 **Recurrence is fake.** "Every Monday/Tuesday/…" labels in `_sbGetDates()` (`school.js:567-581`) only materialize **the current week's** instance — no future-week propagation, no RRULE, no expansion on render. Silently teaches users the feature is broken next week.
2. 🔴 **UTC date bug in upcoming widget** — `renderUpcoming()` (`school.js:657`) and hero "Upcoming Events" (`ui.js:571`) use `new Date().toISOString().split('T')[0]`, yielding UTC date. Users west of UTC after ~16:00 local see "today's" events disappear early. Schedule core deliberately avoids this (`school.js:563` comment) but calendar/upcoming paths don't.
3. 🟠 **Schedule and Calendar are unrelated** — two parallel UIs, two state shapes, no integration. Users likely expect calendar events to appear on the day-view hour grid; they don't.
4. 🟠 **No external calendar integration** — no Google Calendar, no Apple, no `.ics` import/export.
5. 🟠 **No reminders/notifications** despite PWA push being available.
6. 🟡 **`D.scheduleBlocks` not in DEF** — lazily created; `cloudLoad` permissive merge handles it but defaults schema is misleading.
7. 🟡 **`clearSched()` is month-scoped** even in Day/Week views — confusing label when viewing a different month.
8. 🟡 **No event editing** — only add/delete.
9. 🟡 **No conflict detection** — block-fill overwrites silently.
10. 🟡 **TIMESLOTS hard-coded 6 AM–11 PM** — no early-morning (5 AM workouts) or post-midnight slots.
11. 🟡 **No gamification** — schedule slots are passive containers; no points/streaks/badges for completing scheduled activities.
12. 🟡 **No cross-feature feed** — school assignment due dates, chore due dates, faith reading plans, sports schedules don't surface as calendar events.

---

## 6. CBT Training

**🚨 CRITICAL NAMING FINDING:** **"CBT" in this app means "Computer Based Training", NOT "Cognitive Behavioral Therapy".** It teaches computer literacy (hardware, Windows, Linux, coding, cybersecurity) and a typing speed test. The UI label is "Tech Skills". There is **zero CBT-as-therapy content** in the app — no thought records, no cognitive distortions, no reframing prompts.

Evidence:
- `app/index.html:4220` — `<!-- ════ CBT — COMPUTER BASED TRAINING ════ -->`
- `app/index.html:4224` — `<div class="st">Tech Skills</div>`
- `app/js/ui.js:1019` — `{id:'s-cbt', icon:'💻', label:'Tech Skills', key:'cbt'}`
- Grep `thought record|cognitive distortion|reframe|automatic thought|catastrophiz|all-or-nothing` → **zero matches** in `app/index.html`.

**Location:** Section `app/index.html` 4220–4339 (~120 lines). JS: `app/js/misc.js:1146–1452` (~307 lines).

**Working features:** 6 tabs (typing + 5 lesson modules); typing speed test with easy/medium/hard passages, live WPM, error counter, S/A/B/C/D grade; per-difficulty personal-best dashboard; 40 lessons across 5 modules with quick-check Q&A reveal; lesson completion persistence.

**State keys:** `D.cbtProgress{moduleName:{idx:true}}`, `D.cbtTypingBests{easy|medium|hard:{wpm,acc,errors,secs,date}}`.

**Gaps / concerns:**
1. 🔴 **"CBT" namespace collision is a real wellness/App-Store risk.** In any consumer context — especially a teen-mom-targeted app — "CBT Training" reads as Cognitive Behavioral Therapy. The UI label is already "Tech Skills" but section id (`s-cbt`), function prefixes, state keys, and inline comments all still say `cbt`. Recommend full rename to `tech` / `tech-skills`.
2. 🟠 **The audit assumed CBT = Cognitive Behavioral Therapy. If that was the intended product spec, it is entirely missing.** No mood tracker, no thought records, no reframing tools, no AI-assisted reflection, no psychoeducation, no crisis resources surfaced from this tab. (988 / 741741 crisis resources exist in the Health Encyclopedia at `misc.js:1811-1863` but are not linked from CBT.)
3. 🟡 **`renderCbtProgress()` writes to DOM IDs that don't exist** — `cbtProgress_<module>` elements aren't in the HTML (`misc.js:1450`); progress percentage is computed but never visibly displayed.
4. 🟡 **Force-visible plumbing duplicated across 6 places** (`auth.js:451`, `sync.js:93-101`, `sync.js:185-192`, `init.js:311-319`, `ui.js:1278`, `ui.js:1357-1380`) — fragile, hard to maintain.
5. 🟡 No streak/badge integration despite heavy gamification elsewhere.
6. 🟡 Lesson content hardcoded — no versioning, no localization hooks.

---

## 7. Skills

**Location:** Section `app/index.html` 2828–2860 + modal at 11260–11311. **`app/js/skills.js` is 6,393 lines and is a grab-bag** — it also covers resume builder, bio builder, music practice, journal, palette themes, tutorial overlay. Skills-specific code is roughly lines 1–4159. Faith Academy is unrelated (`data/academy.js`, `data/academy-lessons.js`).

**Sub-panels:** Lessons (accordion of HTML lessons) · Quiz (5–7 MCQ per category) · Certificate (gated by ≥80% score).

**Working features:** 42-category grid with Wikimedia hero photos; live search filter; lesson accordion; MCQ quiz with shuffled options, side-confetti on correct, big-confetti on pass; persistent quiz scores; certificate generation with gold-corner card, user name, score box, credential ID `KEY-SCORE-YEAR`; `printCert()` opens a new window with landscape `@page` styling for PDF; `shareCert()` uses `navigator.share` with clipboard fallback; AI quiz analysis via `/api/ai-summary`; +10 PB and +1 scratch ticket per pass.

**Skill catalog:** 42 categories in `SK_CATS` (Taxes, Car, Health, Dental, Cooking, Home, Career, Credit, Relationships, Faith, Mental, Civic, Emergency, Digital, Family, College, Legal, Adulting, Communication, DIY, Shopping, Writing, Laundry, Cleaning, Time Mgmt, Organization, Safety, Investing, Insurance, Travel, Nutrition, Fitness, Sleep, Critical Thinking, Budgeting, Environment, First Aid, Public Speaking, Stress, Social Media, Online Safety, Entrepreneurship). **188 total lesson entries**, all inline in `skills.js` (not in `app/js/data/`).

**State keys:** `D.skillCerts{key:localeDateString}`, `D.skillQuizScores{key:percent}`. **Declared but unused:** `D.pendingQuizzes`, `D.quizResults`, `D.quizzes` (DEF `data.js:103`).

**Gaps / bugs:**
1. 🟠 **Duplicate `cooking:` quiz block** (`skills.js:3411` + `skills.js:3432`) — first is silently overwritten.
2. 🟠 **`SK_QUIZ` missing keys** vs `SK_CATS` (42) — categories like `organize` show "No quiz available yet"; cards look identical, no visual cue.
3. 🟠 **Lesson progress NOT tracked.** Only quiz outcomes persist. Stats "Lessons" pill is a static `SK_DATA` count, not "lessons completed".
4. 🟠 **Quiz pool fixed at 5–7 questions** — passing once = remembering 5 answers forever. No question bank, no rotation.
5. 🟠 **Dead schema slots** — `D.pendingQuizzes`, `D.quizResults`, `D.quizzes` declared but never read/written — bloat the cloud blob.
6. 🟡 **Cert print routine is fragile** — `document.querySelector('style').textContent.split('.sk-cert')…` (`skills.js:4155`) depends on first inline `<style>` containing all cert styles. CSS reorg breaks it.
7. 🟡 **AI Analysis sent without `mode` flag** — uses default Haiku weekly-summary path with ~350-token cap (not a coaching mode).
8. 🟡 **`D.skillCerts[key]` uses `toLocaleDateString()`** — locale-dependent string, not ISO; risky for sorting/parsing later.
9. 🟡 **`skills.js` (6,393 lines) is doing far too much** — file name no longer matches scope; code-review hazard.

---

## 8. Parent Hub

**Location:** Section `app/index.html` 10094–11058 (~960 lines). Parent onboarding modal at 11563. **`app/js/parent.js` is 5,180 lines** — largest module in the codebase. Auth in `auth.js:685–818`. Manage Users + PB in `email.js:260–420` and `email.js:1414–1591`. Screen-time helpers in `chores.js:708-737`.

**Sub-views (4 visible tab buttons + 14 routable panels):** Activity · Rewards · Controls · Reports (visible). Reachable via `phNav()`: ph-home, ph-users, ph-overview, ph-rewards, ph-chores, ph-schedule, ph-contests, ph-quizzes, ph-controls, ph-behavior, ph-activity, ph-learning, ph-growth, ph-progress.

**Working features:** Hashed PIN gate (SHA-256 + per-user salt) with legacy plaintext fallback; in-memory unlock (5-min sliding idle + 30-min hard cap); PIN migration banner with progressive rollout; Forgot-PIN flow with Supabase password re-confirmation; multi-profile (slim LS index + per-profile data blob — post-quota-fix layered storage); child login + per-child PIN; chore management + pending verification + self-chore tier-approval; helpful-deed approval; behavior log (8 categories, +/- scoring); grade monitor; parent notes; Parent Bucks management (quick award +10/+25/+50/+100, custom award, deduct, prize store builder, history); contests + leaderboard + MVP + bonus-all + family rewards; parent-sent quizzes with rewards/penalties; screen-time controls (honor-system, no OS enforcement); incentives engine; child section access toggles; weekly progress reports via `/api/send-email` (Brevo) with auto-Monday send; per-child parent dashboard mirrors.

**State keys:** `_profiles[]` + `_activeProfileId`, `D.parentPinHash`, `D.chorePin`/`D.parentPIN` (legacy), `D.behaviorLog[]`, `D.parentNotes[]`, `D.screenTime{games,tv,phone,tablet}`, `D.pinMigration`, `D.progressEmailPref`, `D.progressLastAutoSent`, `D._profiles` (cloud mirror), `D._activeProfileId`. LS keys: `lifeos_v2`, `ylcc_profiles`, `lifeos_profile_<id>`, `ylcc_active_profile`, `ylcc_post_login`, `lifeos_owner_user_id`.

**Security observations:**
1. 🔴 **Unescaped `${p.name}` in `email.js:291,293`** — Manage Users renders profile names with raw template interpolation, bypassing `escapeHtml()` (compare to `parent.js:2391` where the equivalent is properly escaped). A child name containing `<script>` executes. Stored-XSS surface.
2. 🔴 **Inline `alert('${p.name}\n\n…')` in `parent.js:2186`** — quotes/backslashes in a name break the HTML attribute and the JS literal. Dual-escape required.
3. 🟠 **`parentDrillChild` mutates live `D`** (`parent.js:2409-2462`) by clearing then `Object.assign(D, profile.data)` — no visible auto-restore path. If navigation interrupts the drill, the next `save()` clobbers the active profile's cloud row.
4. 🟠 **Legacy plaintext PIN persists in cloud** until migration runs — users who never open Parent Hub after the migration deploy keep plaintext PIN in `profiles.data` in Supabase indefinitely.
5. 🟠 **`MONTHLY_CHALLENGES = []` empty array** (`parent.js:1354`) — `renderMonthlyChallenge()` would throw on `ch.tasks.map(…)` if invoked.
6. 🟡 **`parentPinDisabled` toggle sets unlock cap to `Number.MAX_SAFE_INTEGER`** (`parent.js:1599`) — permanent unlock across sessions, no confirmation prompt on the toggle (`index.html:10236`).
7. 🟡 **Screen-time is honor-system** — no OS-level enforcement; kids can navigate away, refresh, or ignore.
8. 🟡 **`alert()`/`prompt()` fallbacks in PIN migration** (`parent.js:1730,1760`, `parent.js:879`) — block JS thread, non-mobile-friendly.

**Positive security notes:** Hash salt is per-user (`_supaUser.id`) with `'local'` fallback for anonymous local installs (acceptable since LS is already host-scoped); in-memory unlock is correctly implemented and comment at `parent.js:9-14` documents the historical sessionStorage hole; no direct `from('…')` writes in `parent.js` (everything flows through `save()` → `cloudSync()` → owner-guard); profile-switch correctly calls `lockParentDash()` when switching to a child (`parent.js:2067`).

---

## Cross-cutting findings

| # | Theme | Detail |
|---|---|---|
| 1 | **Habits is the missing first-class concept** | 9+ disconnected streak trackers (scripture, math, typing, chore, flashcard, faith, devotional, daily-W, reading-plan) with no shared engine, no unified calendar, inconsistent forgiveness logic. Habits widget exists but the tutorial onboarding promises an experience that never materializes. |
| 2 | **"CBT" namespace collision** | "CBT Training" reads as Cognitive Behavioral Therapy in any teen-wellness context. The app uses it for Computer Based Training. UI label was renamed to "Tech Skills" but `s-cbt`/`cbtTab`/`D.cbtProgress` still pervade the codebase. App Store / parent / reviewer risk. |
| 3 | **Tax data is two years stale** | All 2024 brackets, deductions, EITC, AOC, HSA, mileage, retirement limits are hardcoded in `skills.js:4971-5027` — today is 2026-05-22. No update mechanism. |
| 4 | **State schema drift in DEF** | `data.js:112` declares `chores:{}` (object); consumers expect array. `data.js:95` declares `timeline:[]` (array); `goals.js` uses object. Dead slots: `D.dailyChecks`, `D.pendingQuizzes`, `D.quizResults`, `D.quizzes`, `D.earnings`, `D.allowance`, `D.scheduleBlocks` (not declared, lazily created). |
| 5 | **Field-name drift on completion stamps** | Goals: `doneDate` (used) vs `achievedDate` (orphan path). Chores: `D.chorePoints` is a number in DEF but `{total,spent}` after `chores.js` migration; `parent.js:3051` still treats it as number → state corruption bug. |
| 6 | **Timezone hazards** | Schedule upcoming-events widget uses UTC date (`school.js:657`, `ui.js:571`) — events disappear early west of UTC. Habits use locale `toDateString()` — switching device locale fragments check-in keyspace. Skill certs use `toLocaleDateString()` — locale-dependent string, not ISO. |
| 7 | **XSS surfaces in parent-rendered HTML** | `email.js:291,293` unescaped `${p.name}` in Manage Users. `parent.js:2186` inline `alert('${p.name}…')` quote-break risk. `finance.js:247` raw `g.emoji` in savings-goal cards. All other parent-rendered fields properly use `escapeHtml`. |
| 8 | **Persistence model is uniform — one JSONB blob** | No surveyed tab uses a dedicated Supabase table. Everything rides on `profiles.data` JSONB via `cloudSync()`. Per-feature tables in `docs/migrations/` exist for memory verses / prayer requests / faith plans but the eight surveyed tabs all share the blob. |
| 9 | **`skills.js` (6,393 lines) is a grab-bag** | Resume builder, bio builder, music practice, journal, palette themes, tutorial overlay, and the tax calculator (`calcTax`) all live alongside Skills. Code review hazard; file name no longer matches scope. |
| 10 | **CLAUDE.md tail-integrity baseline is stale** | Doc says `function tick()` at ~line 6343 and file is ~6,829 lines. Actual: 11,900 and 13,145 — file has nearly doubled. Tail tokens still present (presence-based check still works) but documented line numbers should be refreshed. |
| 11 | **`MONTHLY_CHALLENGES = []`** | Empty array in `parent.js:1354` with renderer that would throw on `ch.tasks.map(...)`. Disconnected feature surface. |
| 12 | **Recurrence + reminders gap** | Schedule "Every Monday" only fills current week; calendar has no `repeat` field; no PWA push reminders for schedule/calendar despite the service worker supporting push elsewhere. |

---

## Priority ranking (recommended fix order)

### P0 — Production correctness or security
1. Fix `parent.js:3051-3052` `D.chorePoints` schema collision (state corruption on every self-chore approval).
2. Escape `${p.name}` in `email.js:291,293` and `parent.js:2186` (stored-XSS surfaces).
3. Verify `parentDrillChild` (`parent.js:2409-2462`) restores `D` cleanly on all exit paths — clobber risk.

### P1 — Data integrity / user-visible bugs
4. Refresh 2024 → 2026 tax data in `skills.js:4971-5027` (brackets, deductions, contribution limits).
5. Fix UTC date in `school.js:657` + `ui.js:571` upcoming-events widget.
6. Resolve `D.timeline` array/object shape mismatch (`data.js:95` vs `goals.js:441`).
7. Fix `doneDate`/`achievedDate` field drift in `goals.js`.
8. De-duplicate `cooking:` quiz in `skills.js:3411/3432`.
9. Reconcile `D.chores` DEF (`data.js:112` object vs array consumers).

### P2 — Strategic gaps (feature-level)
10. **Decide on "CBT" rename** — change `s-cbt`/`cbtTab`/state keys to `tech-skills` to eliminate Cognitive-Behavioral-Therapy confusion, OR build an actual CBT-as-therapy module if that was the spec.
11. **Build a unified Habits feature** — wrap the 9 scattered streak trackers in one engine + calendar/heatmap view. Tutorial slide 2 already promises this.
12. **Real recurrence in Schedule** — RRULE-style expansion so "Every Monday" works next week.
13. **Cross-feature linkage** — surface school assignments, chore due dates, and faith reading plans on the Calendar; auto-mark a Goal complete when its linked Skill cert is earned.

### P3 — Code hygiene
14. Move `calcTax()` from `skills.js` to `finance.js`.
15. Prune dead state slots in DEF (`dailyChecks`, `pendingQuizzes`, `quizResults`, `quizzes`, `earnings`, `allowance`).
16. Initialize `_txFilter` inside `finance.js`.
17. Refresh CLAUDE.md tail-integrity line numbers.
18. Split `skills.js` (resume/bio/journal/themes/music/tutorial should not share a file with Skills).
19. Remove legacy `D.chorePin` after migration is complete.
20. Consolidate Force-visible plumbing for `s-cbt` (currently in 6 places).

---

## What was not audited

This report covers the 8 tabs requested in the prompt. Other section IDs found in the pre-flight (each warrants its own pass):

- **Faith stack** (`bf-prayer`, `bibleSubTab_*`, `plansSubTab_*`, `bf-proofProphecy`, Story Mode, Faith Academy, Bible Lands) — largest feature surface, phased per `docs/F1-spec.md`.
- **Health & Mood** (`s-health`, `s-mood`) — partially intersects with Habits but has independent scope (encyclopedia, encyclopedia "suicide" topic with 988/741741 crisis resources).
- **School** (`s-school`) — assignments, GPA, study tools.
- **Sports**, **Music/DJ**, **Resume**, **Journal**, **Bio**, **Themes/Palettes**, **Contests** — separate sections living alongside Skills.
- **Onboarding tour**, **demo mode**, **PWA install**, **service-worker push notifications** — cross-cutting infrastructure.
- **API surface** (`/api/ai-summary`, `/api/send-email`, `/api/waitlist-submit`, `/api/affiliate-apply`, `/api/approve-affiliate`, `/api/faith-report`) — Vercel serverless functions not opened in this audit.
- **Supabase RLS** + service-key flows — read-only audit available via `security-auditor` subagent.

---

*End of report. Generated 2026-05-22 by 8 parallel general-purpose subagents reading `app/index.html` and `app/js/*.js` only. No code was modified during this audit.*
