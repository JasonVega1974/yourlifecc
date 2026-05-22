# YourLife CC — App Feature Upgrade Master Plan
## Faith-Level Comprehensiveness Across Every Tab

**Benchmark:** The Faith tab is the gold standard. It shipped with:
- Multiple sub-tabs (Proof & Prophecy, Prayer, Faith Academy)
- 100+ content items across 6 categories
- Advanced interactive features (Convince Me deck, ACTS structure, bookmarks, search)
- Dedicated animated hero section
- Admin content management (photo manager)
- Deep Supabase integration (per-child state, per-user bookmarks)

**Goal:** Every tab reaches or exceeds this level of depth, interactivity, and content richness.

---

## HOW TO EXECUTE IN CLAUDE CODE

### Superpower Stack (enable all before starting)
```
/superpowers enable
/use frontend-design
/use context7
/use hookify
/use supabase
/use vercel
```

### Agent Strategy
Each tab gets its own dedicated agent session. Run them sequentially or in parallel depending on complexity. Use this pattern per tab:

```
/agent start [TAB_NAME]-upgrade
> Full context: This is YourLife CC (yourlifecc.com), a family life-skills app 
> for teens/young adults (12-22). Single-file app at app/index.html (~28,800 lines).
> Supabase project: hrohgwcbfgywkpnvqxhk
> GitHub: JasonVega1974/yourlifecc
> CRITICAL: Before ANY edit to index.html, run `grep -n "function tick\|setInterval(tick\|Google Translate" app/index.html`
> and verify tail integrity. Validate all JS with `node --check` before committing.
> Deployment: git push from Claude Code bash (main branch → Vercel auto-deploy).
```

### Pre-Flight Checks (run before every tab upgrade)
```bash
# 1. Verify index.html tail integrity
grep -n "function tick\|setInterval(tick\|google.*translate\|</body>" app/index.html | tail -20

# 2. Check current line count
wc -l app/index.html

# 3. Validate existing JS
node --check app/index.html 2>&1 | head -20

# 4. Check for duplicate function names
grep -oP "function \K\w+" app/index.html | sort | uniq -d

# 5. Check for duplicate element IDs
grep -oP 'id="\K[^"]+' app/index.html | sort | uniq -d
```

---

## TAB 1: CHORES
**Current State:** Basic chore list, check-off, points assignment
**Target State:** Full gamified chore management system

### Sub-tabs to build:
1. **My Chores** — personal chore board (kanban-style: Todo / In Progress / Done)
2. **Chore Store** — redeem points for rewards parents set
3. **Leaderboard** — family competition board (weekly/monthly)
4. **History** — completed chore log with points earned timeline
5. **Streaks** — streak tracker (7-day, 30-day achievements with badges)

### Features to add:
- Chore difficulty tiers (Easy/Medium/Hard with point multipliers)
- Due date + reminder system (badge on tab when overdue)
- Photo proof submission (child uploads completion photo, parent approves)
- Recurring chore templates (daily / weekly / monthly cadence)
- Parent chore assignment with drag-and-drop priority ordering
- AI Chore Coach — weekly summary: "You completed 8/10 chores this week! Top tip: ..."
- Seasonal chore packs (Spring Cleaning, Back to School, etc.)
- Bonus chore requests (child can request extra chores for bonus points)
- Achievement badges (First Chore, 7-Day Streak, 100 Points Club, etc.)

### Supabase schema additions:
```sql
-- chores table (extend existing)
ALTER TABLE chores ADD COLUMN difficulty TEXT DEFAULT 'medium';
ALTER TABLE chores ADD COLUMN due_date DATE;
ALTER TABLE chores ADD COLUMN recurring TEXT; -- 'daily','weekly','monthly',null
ALTER TABLE chores ADD COLUMN photo_proof_url TEXT;
ALTER TABLE chores ADD COLUMN approved_by UUID REFERENCES profiles(id);

-- chore_streaks table
CREATE TABLE chore_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- chore_store_items table
CREATE TABLE chore_store_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID,
  name TEXT NOT NULL,
  point_cost INT NOT NULL,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id)
);
```

### Claude Code agent prompt for this tab:
```
/agent start chores-upgrade
Upgrade the Chores tab in app/index.html to Faith-tab level comprehensiveness.
Add sub-tabs: My Chores (kanban), Chore Store, Leaderboard, History, Streaks.
Use frontend-design for all UI. Use supabase for persistence.
Add photo proof upload via Supabase Storage bucket 'chore-proofs'.
Add AI Chore Coach using the /api/ai-summary.js pattern already in the codebase.
Add achievement badge system with 10 badges minimum.
Run all pre-flight checks. Validate with node --check. Deploy via git push.
```

---

## TAB 2: MONEY
**Current State:** Basic income/expense tracking, balance display
**Target State:** Full teen financial literacy platform

### Sub-tabs to build:
1. **Dashboard** — net worth snapshot, spending ring chart, savings progress bar
2. **Budget** — category budgets (set monthly limits, track vs actual)
3. **Transactions** — ledger with search, filter, categories, receipts
4. **Goals** — savings goals with progress bars (e.g. "New Shoes: $47/$120")
5. **Learn** — financial literacy mini-lessons (compound interest, credit, investing basics)
6. **Allowance** — parent-set recurring allowance with auto-credit on schedule

### Features to add:
- Visual spending breakdown (donut chart via Chart.js)
- Budget vs actual bar charts (monthly)
- Transaction categories with emoji icons (🍔 Food, 🎮 Entertainment, 📚 School, etc.)
- Savings goal photo (set a photo of what you're saving for)
- Parent approval for large purchases (request system)
- "What if" simulator — "If I save $10/week I'll have my goal in X weeks"
- Financial literacy score (improves as they complete Learn lessons)
- Milestone celebrations (first $50 saved, first budget kept, etc.)
- Export to CSV for taxes/parents
- Virtual debit card visualization (cosmetic, shows balance)

### Supabase schema additions:
```sql
-- transactions table (extend or create)
CREATE TABLE money_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('income','expense','transfer')),
  category TEXT,
  description TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- money_goals table
CREATE TABLE money_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  photo_url TEXT,
  target_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- budget_categories table
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  monthly_limit DECIMAL(10,2),
  emoji TEXT,
  color TEXT
);
```

### Claude Code agent prompt:
```
/agent start money-upgrade
Upgrade the Money tab to Faith-tab level. Add sub-tabs: Dashboard, Budget, 
Transactions, Goals, Learn, Allowance. 
Use Chart.js (already available) for donut chart + bar charts.
Add financial literacy mini-lessons (8 lessons minimum: budgeting, saving, 
compound interest, credit scores, investing basics, taxes, wants vs needs, emergency funds).
Build "What if" savings simulator with interactive sliders.
Implement full Supabase persistence for all money data.
Use frontend-design superpowers for all UI components.
Run pre-flight checks. node --check. git push to deploy.
```

---

## TAB 3: GOALS
**Current State:** Basic goal list with title and progress
**Target State:** Full goal achievement system with vision board

### Sub-tabs to build:
1. **Vision Board** — Pinterest-style photo grid of goals (drag to reorder)
2. **Active Goals** — goals with milestone breakdown + progress rings
3. **Milestones** — step-by-step milestone tracker per goal
4. **Completed** — trophy room of achieved goals with celebration artifacts
5. **Inspire Me** — curated goal ideas by category (School, Health, Career, Personal, Faith, Financial)
6. **AI Check-In** — weekly AI-generated progress nudge and next-step recommendation

### Features to add:
- Goal categories with icons (📚 Academic, 💪 Health, 💰 Financial, 🎨 Creative, ✝️ Faith, 🌟 Personal)
- Milestone sub-tasks under each goal (up to 10 steps)
- Deadline + countdown timer display
- Goal progress rings (SVG animated circles)
- Photo attachment per goal (vision board image)
- Parent visibility toggle (share with parent or keep private)
- AI goal decomposition — input a big goal, AI breaks it into milestones
- "Goal of the Week" spotlight
- Motivational quote rotation per category
- Goal completion celebration (confetti animation + badge)
- Long-term vs short-term goal sorting

### Claude Code agent prompt:
```
/agent start goals-upgrade
Upgrade the Goals tab to Faith-tab level comprehensiveness.
Add sub-tabs: Vision Board (photo grid), Active Goals, Milestones, Completed (trophy room),
Inspire Me (curated ideas library with 60+ ideas across 6 categories), AI Check-In.
Build AI goal decomposition using existing /api/ai-summary.js Vercel function pattern.
Add SVG progress rings for each goal (animated).
Build confetti celebration on goal completion.
Vision board: CSS grid, photo upload via Supabase Storage 'goal-images' bucket.
Use supabase + frontend-design superpowers.
node --check before commit. git push to deploy.
```

---

## TAB 4: HABITS
**Current State:** Basic habit checklist with daily check-off
**Target State:** Full habit science platform

### Sub-tabs to build:
1. **Today** — daily habit check-off with time-of-day grouping (Morning/Afternoon/Evening)
2. **Streaks** — visual streak calendar (GitHub contribution graph style)
3. **Analytics** — completion rate charts, best day of week, time of day patterns
4. **Habit Stack** — build habit stacks (link habits that trigger each other)
5. **Library** — curated habit ideas in categories (Health, Mind, Faith, Productivity, Social)
6. **Science** — habit science cards (the 3R loop, implementation intentions, etc.)

### Features to add:
- Habit difficulty rating (building vs maintaining)
- Time-of-day scheduling (Morning routine, Evening wind-down)
- Habit streaks with visual flame indicator (like Duolingo)
- 66-day formation tracker (science-based habit formation milestone)
- Habit stacking builder (After I [cue], I will [habit])
- Completion rate heatmap (12-week grid)
- Habit journal (daily micro-note on each habit)
- Parent-suggested habits (parent proposes, child accepts/declines)
- "Habit of the Month" challenge for the whole family
- Notification scheduling (via Supabase Edge Functions + web push or email reminders)

### Supabase schema additions:
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  category TEXT,
  time_of_day TEXT CHECK (time_of_day IN ('morning','afternoon','evening','anytime')),
  frequency TEXT DEFAULT 'daily',
  streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id),
  user_id UUID REFERENCES profiles(id),
  completed_date DATE NOT NULL,
  note TEXT,
  UNIQUE(habit_id, completed_date)
);
```

### Claude Code agent prompt:
```
/agent start habits-upgrade
Upgrade Habits tab to Faith-tab level. Add sub-tabs: Today (time-grouped),
Streaks (GitHub heatmap style 12-week grid), Analytics (Chart.js),
Habit Stack builder, Library (60+ habits across 6 categories), Science cards.
Implement full streak tracking with flame animations.
Build 12-week completion heatmap using SVG.
Add 66-day formation tracker milestone.
Full Supabase persistence for habits + completions.
frontend-design superpowers for all UI.
Pre-flight checks → node --check → git push.
```

---

## TAB 5: SCHEDULE
**Current State:** Basic Day/Week/Month calendar view
**Target State:** Full life planning calendar suite

### Sub-tabs to build:
1. **Day** — hourly timeline with drag-and-drop events
2. **Week** — 7-column week grid (current week highlighted)
3. **Month** — monthly calendar with event dots
4. **Agenda** — chronological list of upcoming events (next 30 days)
5. **Recurring** — manage recurring events and routines
6. **Family** — shared family calendar (parent + all children)

### Features to add:
- Event categories with colors (School, Sports, Work, Personal, Faith, Family)
- All-day events vs timed events
- Event reminders (email via Brevo — use existing email infrastructure)
- Google Calendar import/sync (read-only iCal link import)
- Homework/assignment tracker integration (due dates on calendar)
- Time-blocking for study sessions
- "Free time" visualization (gaps between events)
- Weekly planning mode (Sunday: plan your week in 5 minutes)
- Integration with Goals and Habits (surface goal milestones on calendar)
- Parent-created events visible on child's calendar
- Print/export week view as PDF

### Claude Code agent prompt:
```
/agent start schedule-upgrade
Upgrade Schedule tab to Faith-tab level. Enhance existing Day/Week/Month views.
Add Agenda (30-day upcoming list) and Family Calendar sub-tabs.
Add event categories, all-day events, drag-and-drop on day view.
Build Brevo email reminder integration using existing Brevo API key.
Add iCal URL import for Google Calendar read-only sync.
Integrate with Goals tab (show goal milestones on calendar).
Build weekly planning wizard (Sunday prompt: set 3 priorities for the week).
Full Supabase persistence. frontend-design. Pre-flight → node --check → git push.
```

---

## TAB 6: CBT TRAINING (Computer Based Training)
**Current State:** Basic course list with some content
**Target State:** Full learning management system (LMS)

### Sub-tabs to build:
1. **My Courses** — enrolled courses with progress bars
2. **Browse** — course catalog by category (Life Skills, Career, Health, Financial, Communication)
3. **Lessons** — lesson player with video embed + text + quiz
4. **Quizzes** — standalone quiz bank
5. **Certificates** — earned certificates with shareable links
6. **AI Tutor** — ask questions about any lesson topic

### Features to add:
- Course categories: Life Skills, Career Readiness, Financial Literacy, Health & Wellness, Communication, Digital Literacy, Faith & Values
- 5 full courses minimum at launch (10 lessons each)
  - "Landing Your First Job" 
  - "Money Basics for Teens"
  - "Healthy Relationships 101"
  - "Time Management Mastery"
  - "Digital Citizenship"
- Lesson completion tracking (per lesson, not just per course)
- In-lesson knowledge checks (quick 3-question quizzes)
- Final course assessment (pass at 80%+ to earn certificate)
- Certificate PDF generation (via existing PDF infrastructure)
- Admin course builder (add/edit courses, lessons, quizzes in admin.html)
- Progress sync to parent Hub (parent sees completed courses)
- AI Tutor: "Ask anything about this lesson" using Anthropic API
- Video embed support (YouTube/Vimeo URLs)
- Lesson bookmarks + notes

### Supabase schema additions:
```sql
CREATE TABLE cbt_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  total_lessons INT DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cbt_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES cbt_courses(id),
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  lesson_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cbt_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES cbt_courses(id),
  lesson_id UUID REFERENCES cbt_lessons(id),
  completed BOOLEAN DEFAULT false,
  quiz_score INT,
  completed_at TIMESTAMPTZ
);

CREATE TABLE cbt_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES cbt_courses(id),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_url TEXT,
  share_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT
);
```

### Claude Code agent prompt:
```
/agent start cbt-upgrade
Upgrade CBT Training tab to full LMS level. Add sub-tabs: My Courses, Browse,
Lessons player, Quizzes, Certificates, AI Tutor.
Build 5 full courses (10 lessons each) with lesson content seeded in Supabase.
Add lesson completion tracking per lesson. Build course assessment (80% pass).
Generate shareable certificate using existing PDF patterns.
AI Tutor sub-tab using Anthropic API (same pattern as ai-summary.js).
Add course builder to admin.html.
frontend-design + supabase + vercel superpowers.
Pre-flight checks → node --check → git push.
```

---

## TAB 7: SKILLS
**Current State:** Basic life skills list
**Target State:** Comprehensive life skills mastery system

### Sub-tabs to build:
1. **My Skills** — skill mastery dashboard with level indicators (Beginner/Developing/Proficient/Mastered)
2. **Explore** — full life skills library (80+ skills across 8 domains)
3. **Assessments** — self-assessment quizzes per skill
4. **Badges** — achievement badges tied to skill mastery
5. **Career Paths** — skill clusters mapped to career paths
6. **Legacy Vault** — proof of skill mastery (photos, documents, reflections)

### Skills domains and examples (80+ skills total):
- 🏠 **Home & Independence** — cooking, cleaning, laundry, basic repairs, grocery shopping
- 💼 **Career & Work** — resume writing, interviews, networking, email etiquette, punctuality
- 💰 **Financial** — budgeting, banking, taxes, insurance, credit
- 🗣️ **Communication** — public speaking, conflict resolution, active listening, writing
- 🧠 **Mental Health** — stress management, self-regulation, mindfulness, journaling
- 🤝 **Social** — empathy, teamwork, leadership, boundary setting
- 🌐 **Digital** — cybersecurity, digital footprint, productivity tools, online privacy
- ✝️ **Faith & Character** — integrity, service, gratitude, forgiveness, purpose

### Features to add:
- Skill mastery self-rating (1-4 scale with descriptors)
- Skill evidence upload (Legacy Vault integration — ANCHOR FEATURE)
- Parent skill verification (parent confirms mastery)
- Career path skill gap analyzer ("To be a nurse, you need these 12 skills. You have 7.")
- Printable Life Skills Portfolio (PDF export of all mastered skills)
- Monthly "Skill Challenge" — focus skill of the month for the whole family
- AI skill coach — personalized learning plan for chosen skill
- Skill badge sharing (social proof for college apps, resumes)

### Claude Code agent prompt:
```
/agent start skills-upgrade
Upgrade Skills tab to Faith-tab level — this is the ANCHOR FEATURE for Lifetime plan.
Add sub-tabs: My Skills dashboard, Explore library (80+ skills, 8 domains),
Assessments (self-rating with descriptors), Badges, Career Paths, Legacy Vault.
Legacy Vault: file upload to Supabase Storage 'legacy-vault' bucket, 
evidence type tagging, parent verification workflow.
Build Career Path analyzer: predefine 15 career paths, each with required skill list,
show % match to current skills.
Build PDF Life Skills Portfolio export.
AI Skill Coach sub-tab using Anthropic API.
Add 80+ skills seed data to Supabase.
frontend-design + supabase + vercel + context7 superpowers.
This tab gets extra attention — it's the Lifetime plan anchor. Make it stunning.
Pre-flight → node --check → git push.
```

---

## TAB 8: PARENT HUB (upgrade to match)
**Current State:** Good base — controls, AI weekly reports, onboarding
**Target State:** Full family command center

### Sub-tabs to add/enhance:
1. **Dashboard** — family snapshot card (all children's activity at a glance)
2. **Reports** — weekly AI report (already exists — enhance UI)
3. **Alerts** — activity alerts (missed chores, low balance, streak broken)
4. **Approvals** — pending items requiring parent action (chore photo proof, purchase requests)
5. **Controls** — existing feature controls (enhance UI)
6. **Goals** — parent-set family goals + rewards
7. **Chore Manager** — chore assignment and approval center
8. **Messages** — parent-to-child motivational messages / encouragements

### Claude Code agent prompt:
```
/agent start parent-hub-upgrade
Upgrade Parent Hub to full family command center.
Add Dashboard sub-tab: family snapshot showing all children's stats this week
(chores completed, habits hit, goals progressing, skills earned).
Add Alerts sub-tab: real-time activity feed of notable events.
Add Approvals sub-tab: chore photo proofs, purchase requests awaiting action.
Add Messages sub-tab: parent sends encouragement/recognition messages to child
(stored in Supabase, displayed as notification in child's app).
Enhance all existing sub-tab UIs to Faith-tab visual quality.
Full Supabase integration. frontend-design superpowers.
Pre-flight → node --check → git push.
```

---

## GLOBAL UPGRADES (run after all tabs)

### 1. Unified Notification System
```
/agent start notifications-system
Build a unified in-app notification system:
- Bell icon in header with unread count badge
- Notification types: chore approved, streak milestone, goal achieved, 
  skill mastered, parent message, course completed, budget alert
- Mark read/unread, dismiss all
- Supabase real-time subscription for live updates
- Brevo email digests (daily or weekly preference)
```

### 2. Onboarding Wizard Upgrade
```
/agent start onboarding-upgrade  
Upgrade the onboarding wizard to be feature-aware:
- After account creation, guided tour of each tab (tooltip overlays)
- "Set up your first chore", "Set your first goal", "Pick 3 habits" prompts
- Completion percentage tracker ("Profile 60% complete")
- Parent onboarding: walks through adding child, setting chores, enabling features
```

### 3. Home Screen (index.html landing)
```
/agent start home-screen-upgrade
Upgrade the main home screen / dashboard:
- Daily briefing card: "Good morning [name]! Here's your day:"
  → Chores due today, habit check-ins, goal milestones, schedule events
- Quick-action buttons (check off habit, log transaction, etc.)
- Motivational card of the day (rotating from a library of 365)
- Weekly progress ring (% of week's goals/habits/chores completed)
- Parent-set family challenge display
```

### 4. Gamification Layer
```
/agent start gamification-system
Build a unified XP + level system across all tabs:
- XP awarded for: completing chores, hitting habits, achieving goals, 
  completing lessons, mastering skills, logging transactions
- Level system: Seedling → Sprout → Growing → Thriving → Flourishing → Legacy
- Leaderboard across family members
- Monthly achievement report card
- Achievements library (50+ achievements across all activities)
```

---

## EXECUTION ORDER (recommended)

| Phase | Tabs | Rationale |
|-------|------|-----------|
| Phase 1 | Chores + Money | Highest daily engagement, most parent-visible |
| Phase 2 | Goals + Habits | Core behavior-change features |
| Phase 3 | Skills + CBT | Lifetime plan anchors, differentiation |
| Phase 4 | Schedule + Parent Hub | Infrastructure + parent retention |
| Phase 5 | Global: Notifications + Gamification | Ties everything together |

---

## STANDARD AGENT HEADER (copy-paste for every agent)

```
You are upgrading YourLife CC (yourlifecc.com) — a Supabase + Vercel + Stripe + Brevo 
family life-skills app for teens ages 12-22.

CRITICAL RULES:
1. Main app file: app/index.html (~28,800 lines, single file)
2. BEFORE ANY EDIT: grep -n "function tick\|setInterval(tick\|Google Translate" app/index.html
3. AFTER EVERY EDIT: node --check app/index.html && node --check app/js/*.js
4. Check for duplicate IDs: grep -oP 'id="\K[^"]+' app/index.html | sort | uniq -d
5. Check for duplicate functions: grep -oP "function \K\w+" app/index.html | sort | uniq -d
6. Deploy: git add -A && git commit -m "feat: [TAB] upgrade to faith-level" && git push origin main
7. Contact email: info@kingdom-creatives.com
8. Canonical URL: https://yourlifecc.com (no www)
9. Supabase project: hrohgwcbfgywkpnvqxhk
10. All new Supabase tables need RLS enabled + policies for authenticated role

DESIGN STANDARD: Match or exceed the Faith tab visual quality.
Faith tab set the bar: multiple sub-tabs, 100+ content items, advanced interactivity, 
search, bookmarks, animated heroes, admin management tools.

TECH STACK: Tailwind CSS (CDN), Chart.js (CDN), Supabase JS v2, vanilla JS modules.
```

---

## SUPABASE STORAGE BUCKETS TO CREATE

Before running agents, create these buckets in Supabase Storage:
- `chore-proofs` — public, 5MB limit per file, images only
- `goal-images` — public, 10MB limit, images only  
- `legacy-vault` — private (authenticated), 50MB limit, all file types
- `cbt-thumbnails` — public, 5MB, images only
- `skill-evidence` — private (authenticated), 20MB, images + docs

---

*Generated by Claude for Jason Vega / YourLife CC — May 2026*
*Faith tab benchmark: Proof & Prophecy + Prayer + Faith Academy = the gold standard*
