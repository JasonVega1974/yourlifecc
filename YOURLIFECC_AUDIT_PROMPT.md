# YourLife CC — Tab Audit Master Prompt
## Paste this entire prompt into Claude Code to kick off the full audit

---

## AUDIT MISSION

Read `app/index.html` and produce a tab-by-tab audit report saved to `AUDIT_REPORT.md` in the repo root. Do NOT modify any code. This is read-only analysis only.

The goal: for each tab, document exactly what exists today vs what the upgrade plan calls for, so we know the true scope of work before building anything.

---

## SETUP — run these first

```bash
# Confirm file exists and get line count
wc -l app/index.html

# Verify tail integrity (ALWAYS before touching this file)
grep -n "function tick\|setInterval(tick\|Google Translate\|</body>" app/index.html | tail -20

# Extract all tab IDs and section identifiers
grep -oP '(?<=id=")[^"]+(?=")' app/index.html | grep -iE "tab|section|panel|view|screen" | sort -u

# Extract all function names (for feature inventory)
grep -oP "function \K\w+" app/index.html | sort -u > /tmp/functions.txt
wc -l /tmp/functions.txt

# Extract all sub-tab / nav structures
grep -n "sub-tab\|subtab\|data-tab\|data-section\|showTab\|switchTab\|activeTab" app/index.html | head -60

# Find all Supabase table references
grep -oP "from\('\K[^']+|\.from\(\"\K[^\"]+|supabase\.from\('\K[^']+" app/index.html | sort -u

# Find all API calls / integrations
grep -n "fetch\|axios\|XMLHttpRequest\|brevo\|stripe\|anthropic\|ai-summary" app/index.html | grep -v "//.*fetch" | head -40

# Find Chart.js usage
grep -n "new Chart\|Chart.js\|chartjs" app/index.html

# Find Supabase Storage usage
grep -n "storage\|upload\|bucket\|getPublicUrl" app/index.html

# Find all badge/achievement references
grep -n "badge\|achievement\|streak\|xp\|points\|reward" app/index.html | head -40
```

---

## AGENT INSTRUCTIONS

Use the `/agents` superpower to spin up one sub-agent per tab. Each agent:
1. Searches index.html for all code related to their assigned tab
2. Identifies existing features (what's actually built)
3. Identifies what's clearly missing vs the upgrade plan
4. Estimates complexity (Low/Medium/High) for each missing feature
5. Flags any existing bugs or debt they notice

**Spawn agents like this:**

```
/agent start audit-chores
/agent start audit-money  
/agent start audit-goals
/agent start audit-habits
/agent start audit-schedule
/agent start audit-cbt
/agent start audit-skills
/agent start audit-parent-hub
```

Each agent runs its section's audit script below, then reports findings.

---

## PER-TAB AUDIT SCRIPTS

### CHORES AGENT

```bash
echo "=== CHORES TAB AUDIT ==="

# Find chores section boundaries
grep -n "chore\|Chore" app/index.html | grep -iE "id=|section|tab|panel" | head -20

# Find chore-related functions
grep -n "function.*[Cc]hore\|[Cc]hore.*function" app/index.html

# Check for sub-tabs
grep -n "chore" app/index.html | grep -iE "sub.*tab|data-tab|nav" | head -20

# Check for specific features
echo "--- Feature Check ---"
grep -c "streak" app/index.html && echo "streaks: FOUND" || echo "streaks: MISSING"
grep -c "leaderboard\|Leaderboard" app/index.html && echo "leaderboard: FOUND" || echo "leaderboard: MISSING"
grep -c "chore.*store\|store.*chore\|redeem\|reward.*point" app/index.html && echo "chore store: FOUND" || echo "chore store: MISSING"
grep -c "photo.*proof\|proof.*photo\|upload.*chore" app/index.html && echo "photo proof: FOUND" || echo "photo proof: MISSING"
grep -c "recurring\|repeat.*chore\|chore.*repeat" app/index.html && echo "recurring chores: FOUND" || echo "recurring chores: MISSING"
grep -c "difficulty\|easy\|medium\|hard" app/index.html && echo "difficulty tiers: FOUND" || echo "difficulty tiers: MISSING"
grep -c "kanban\|todo.*progress.*done\|column.*chore" app/index.html && echo "kanban board: FOUND" || echo "kanban board: MISSING"
grep -c "chore.*coach\|ai.*chore\|chore.*ai" app/index.html && echo "AI coach: FOUND" || echo "AI coach: MISSING"
grep -c "chore.*history\|history.*chore" app/index.html && echo "history log: FOUND" || echo "history log: MISSING"
grep -c "bonus.*chore\|extra.*chore" app/index.html && echo "bonus chores: FOUND" || echo "bonus chores: MISSING"

# Check Supabase table usage for chores
grep -n "chores\|chore_" app/index.html | grep -i "from\|table\|insert\|update\|select" | head -15

# Estimate current line count for chores section
grep -n "chore" app/index.html | awk -F: '{print $1}' | sort -n | head -1 > /tmp/chore_start.txt
grep -n "chore" app/index.html | awk -F: '{print $1}' | sort -n | tail -1 > /tmp/chore_end.txt
echo "Approximate chore section span:"
cat /tmp/chore_start.txt && cat /tmp/chore_end.txt
```

### MONEY AGENT

```bash
echo "=== MONEY TAB AUDIT ==="

grep -n "money\|Money\|finance\|Finance\|wallet\|Wallet\|budget\|Budget" app/index.html | grep -iE "id=|section|tab|panel" | head -20

echo "--- Feature Check ---"
grep -c "budget\|Budget" app/index.html && echo "budgeting: FOUND" || echo "budgeting: MISSING"
grep -c "transaction\|Transaction\|ledger\|Ledger" app/index.html && echo "transactions: FOUND" || echo "transactions: MISSING"
grep -c "savings.*goal\|goal.*saving\|money.*goal" app/index.html && echo "savings goals: FOUND" || echo "savings goals: MISSING"
grep -c "donut\|pie.*chart\|spending.*chart\|chart.*spend" app/index.html && echo "spending chart: FOUND" || echo "spending chart: MISSING"
grep -c "category\|Category" app/index.html | head -5
grep -c "allowance\|Allowance" app/index.html && echo "allowance: FOUND" || echo "allowance: MISSING"
grep -c "financial.*litera\|money.*learn\|learn.*money\|money.*lesson" app/index.html && echo "financial literacy lessons: FOUND" || echo "financial literacy lessons: MISSING"
grep -c "what.*if.*simul\|simul.*saving\|savings.*simul" app/index.html && echo "what-if simulator: FOUND" || echo "what-if simulator: MISSING"
grep -c "export.*csv\|csv.*export\|download.*money" app/index.html && echo "CSV export: FOUND" || echo "CSV export: MISSING"
grep -c "receipt\|Receipt" app/index.html && echo "receipts: FOUND" || echo "receipts: MISSING"
grep -c "parent.*approv.*purchase\|purchase.*request" app/index.html && echo "parent purchase approval: FOUND" || echo "parent purchase approval: MISSING"

# Chart.js usage in money section
grep -n "new Chart" app/index.html | head -10
```

### GOALS AGENT

```bash
echo "=== GOALS TAB AUDIT ==="

grep -n "goal\|Goal" app/index.html | grep -iE "id=|section|tab|panel" | head -20

echo "--- Feature Check ---"
grep -c "vision.*board\|board.*vision" app/index.html && echo "vision board: FOUND" || echo "vision board: MISSING"
grep -c "milestone\|Milestone" app/index.html && echo "milestones: FOUND" || echo "milestones: MISSING"
grep -c "progress.*ring\|ring.*progress\|circular.*progress" app/index.html && echo "progress rings: FOUND" || echo "progress rings: MISSING"
grep -c "completed.*goal\|trophy\|goal.*complet" app/index.html && echo "completed goals/trophy room: FOUND" || echo "completed goals/trophy room: MISSING"
grep -c "inspire\|goal.*idea\|idea.*goal\|goal.*suggest" app/index.html && echo "goal inspiration library: FOUND" || echo "goal inspiration library: MISSING"
grep -c "ai.*goal\|goal.*ai\|goal.*decomp\|goal.*break" app/index.html && echo "AI goal decomposition: FOUND" || echo "AI goal decomposition: MISSING"
grep -c "confetti\|celebrate.*goal\|goal.*celebrat" app/index.html && echo "celebration animation: FOUND" || echo "celebration animation: MISSING"
grep -c "goal.*photo\|photo.*goal\|goal.*image" app/index.html && echo "goal photo attachment: FOUND" || echo "goal photo attachment: MISSING"
grep -c "goal.*deadline\|deadline.*goal\|due.*goal" app/index.html && echo "deadlines: FOUND" || echo "deadlines: MISSING"
grep -c "goal.*category\|categor.*goal" app/index.html && echo "goal categories: FOUND" || echo "goal categories: MISSING"
grep -c "goal.*private\|private.*goal\|goal.*visible" app/index.html && echo "visibility toggle: FOUND" || echo "visibility toggle: MISSING"

# Count existing goals in any library/seed data
grep -c "goalIdea\|goal_idea\|inspire.*goal" app/index.html
```

### HABITS AGENT

```bash
echo "=== HABITS TAB AUDIT ==="

grep -n "habit\|Habit" app/index.html | grep -iE "id=|section|tab|panel" | head -20

echo "--- Feature Check ---"
grep -c "streak\|Streak" app/index.html && echo "streaks: FOUND" || echo "streaks: MISSING"
grep -c "heatmap\|heat.*map\|contribution.*grid\|github.*style" app/index.html && echo "heatmap: FOUND" || echo "heatmap: MISSING"
grep -c "habit.*analytic\|analytic.*habit\|completion.*rate" app/index.html && echo "analytics: FOUND" || echo "analytics: MISSING"
grep -c "habit.*stack\|stack.*habit" app/index.html && echo "habit stacking: FOUND" || echo "habit stacking: MISSING"
grep -c "habit.*library\|library.*habit\|habit.*idea" app/index.html && echo "habit library: FOUND" || echo "habit library: MISSING"
grep -c "66.*day\|habit.*form\|formation" app/index.html && echo "66-day tracker: FOUND" || echo "66-day tracker: MISSING"
grep -c "morning.*routine\|evening.*routine\|time.*of.*day\|habit.*time" app/index.html && echo "time-of-day grouping: FOUND" || echo "time-of-day grouping: MISSING"
grep -c "flame\|fire.*streak\|streak.*fire" app/index.html && echo "flame indicator: FOUND" || echo "flame indicator: MISSING"
grep -c "habit.*journal\|journal.*habit" app/index.html && echo "habit journal: FOUND" || echo "habit journal: MISSING"
grep -c "habit.*science\|science.*habit\|habit.*loop\|3r.*loop" app/index.html && echo "habit science content: FOUND" || echo "habit science content: MISSING"

# Check habit_completions table usage
grep -n "habit_completion\|habitCompletion" app/index.html | head -10
```

### SCHEDULE AGENT

```bash
echo "=== SCHEDULE TAB AUDIT ==="

grep -n "schedule\|Schedule\|calendar\|Calendar" app/index.html | grep -iE "id=|section|tab|panel" | head -20

echo "--- Feature Check ---"
grep -c "day.*view\|view.*day\|hourly\|hour.*timeline" app/index.html && echo "day view: FOUND" || echo "day view: MISSING"
grep -c "week.*view\|view.*week\|weekly.*grid" app/index.html && echo "week view: FOUND" || echo "week view: MISSING"
grep -c "month.*view\|view.*month\|monthly.*cal" app/index.html && echo "month view: FOUND" || echo "month view: MISSING"
grep -c "agenda\|Agenda\|upcoming.*event\|event.*list" app/index.html && echo "agenda view: FOUND" || echo "agenda view: MISSING"
grep -c "family.*cal\|shared.*cal\|cal.*family" app/index.html && echo "family calendar: FOUND" || echo "family calendar: MISSING"
grep -c "drag.*drop\|draggable\|dragstart" app/index.html && echo "drag-and-drop: FOUND" || echo "drag-and-drop: MISSING"
grep -c "event.*categor\|categor.*event\|event.*color" app/index.html && echo "event categories: FOUND" || echo "event categories: MISSING"
grep -c "remind\|Remind\|notification.*event" app/index.html && echo "reminders: FOUND" || echo "reminders: MISSING"
grep -c "ical\|gcal\|google.*cal\|calendar.*import\|import.*calendar" app/index.html && echo "calendar import: FOUND" || echo "calendar import: MISSING"
grep -c "all.*day.*event\|allday\|all_day" app/index.html && echo "all-day events: FOUND" || echo "all-day events: MISSING"
grep -c "weekly.*plan\|plan.*week\|week.*wizard" app/index.html && echo "weekly planning wizard: FOUND" || echo "weekly planning wizard: MISSING"

# Existing schedule-related Supabase tables
grep -n "events\|schedule\|calendar" app/index.html | grep -i "from\|table\|supabase" | head -10
```

### CBT TRAINING AGENT

```bash
echo "=== CBT TRAINING TAB AUDIT ==="

grep -n "cbt\|CBT\|course\|Course\|lesson\|Lesson\|training\|Training" app/index.html | grep -iE "id=|section|tab|panel" | head -20

echo "--- Feature Check ---"
grep -c "course.*catalog\|catalog.*course\|browse.*course" app/index.html && echo "course catalog/browse: FOUND" || echo "course catalog/browse: MISSING"
grep -c "lesson.*player\|play.*lesson\|lesson.*view" app/index.html && echo "lesson player: FOUND" || echo "lesson player: MISSING"
grep -c "quiz\|Quiz" app/index.html && echo "quizzes: FOUND" || echo "quizzes: MISSING"
grep -c "certificate\|Certificate\|cert\b" app/index.html && echo "certificates: FOUND" || echo "certificates: MISSING"
grep -c "ai.*tutor\|tutor.*ai\|lesson.*ai\|ai.*lesson" app/index.html && echo "AI tutor: FOUND" || echo "AI tutor: MISSING"
grep -c "video.*embed\|embed.*video\|youtube\|vimeo" app/index.html && echo "video embeds: FOUND" || echo "video embeds: MISSING"
grep -c "lesson.*progress\|progress.*lesson\|lesson.*complet" app/index.html && echo "lesson progress tracking: FOUND" || echo "lesson progress tracking: MISSING"
grep -c "knowledge.*check\|check.*knowledge\|in.*lesson.*quiz" app/index.html && echo "in-lesson knowledge checks: FOUND" || echo "in-lesson knowledge checks: MISSING"
grep -c "course.*builder\|build.*course\|admin.*course" app/index.html && echo "admin course builder: FOUND" || echo "admin course builder: MISSING"
grep -c "lesson.*bookmark\|bookmark.*lesson\|lesson.*note" app/index.html && echo "lesson bookmarks/notes: FOUND" || echo "lesson bookmarks/notes: MISSING"

# Count existing courses/lessons
grep -c "courseData\|course_data\|cbt_course\|courseList" app/index.html
grep -c "lessonData\|lesson_data\|cbt_lesson\|lessonList" app/index.html

# Check for existing content volume
grep -n "title.*course\|course.*title" app/index.html | head -20
```

### SKILLS AGENT

```bash
echo "=== SKILLS TAB AUDIT ==="

grep -n "skill\|Skill" app/index.html | grep -iE "id=|section|tab|panel" | head -20

echo "--- Feature Check ---"
grep -c "skill.*level\|level.*skill\|beginner\|proficient\|mastered" app/index.html && echo "skill mastery levels: FOUND" || echo "skill mastery levels: MISSING"
grep -c "skill.*librar\|librar.*skill\|explore.*skill\|skill.*explore" app/index.html && echo "skills library/explore: FOUND" || echo "skills library/explore: MISSING"
grep -c "skill.*assess\|assess.*skill\|self.*rate\|self.*assess" app/index.html && echo "skill assessments: FOUND" || echo "skill assessments: MISSING"
grep -c "legacy.*vault\|vault.*legacy\|legacy\b" app/index.html && echo "legacy vault: FOUND" || echo "legacy vault: MISSING"
grep -c "career.*path\|path.*career\|skill.*career" app/index.html && echo "career paths: FOUND" || echo "career paths: MISSING"
grep -c "skill.*badge\|badge.*skill" app/index.html && echo "skill badges: FOUND" || echo "skill badges: MISSING"
grep -c "skill.*portfolio\|portfolio.*skill\|pdf.*skill\|skill.*pdf" app/index.html && echo "portfolio PDF export: FOUND" || echo "portfolio PDF export: MISSING"
grep -c "skill.*evidence\|evidence.*skill\|skill.*upload\|upload.*skill" app/index.html && echo "evidence upload: FOUND" || echo "evidence upload: MISSING"
grep -c "skill.*coach\|coach.*skill\|ai.*skill\|skill.*ai" app/index.html && echo "AI skill coach: FOUND" || echo "AI skill coach: MISSING"
grep -c "skill.*domain\|domain.*skill\|home.*skill\|career.*skill\|financial.*skill" app/index.html && echo "skill domains: FOUND" || echo "skill domains: MISSING"

# Count skills in any existing library
grep -c "skillName\|skill_name\|skillTitle\|skill_id" app/index.html
```

### PARENT HUB AGENT

```bash
echo "=== PARENT HUB TAB AUDIT ==="

grep -n "parent\|Parent" app/index.html | grep -iE "id=|section|tab|panel|hub" | head -20

echo "--- Feature Check ---"
grep -c "family.*dashboard\|dashboard.*family\|snapshot.*family\|family.*snapshot" app/index.html && echo "family snapshot dashboard: FOUND" || echo "family snapshot dashboard: MISSING"
grep -c "weekly.*report\|report.*weekly\|ai.*report\|ai.*summary" app/index.html && echo "weekly AI reports: FOUND" || echo "weekly AI reports: MISSING"
grep -c "alert.*parent\|parent.*alert\|activity.*alert" app/index.html && echo "alerts: FOUND" || echo "alerts: MISSING"
grep -c "approv\|Approv\|pending.*parent\|parent.*pending" app/index.html && echo "approvals queue: FOUND" || echo "approvals queue: MISSING"
grep -c "parent.*message\|message.*parent\|parent.*encourage\|encourage.*child" app/index.html && echo "parent messaging: FOUND" || echo "parent messaging: MISSING"
grep -c "chore.*manager\|assign.*chore\|chore.*assign" app/index.html && echo "chore manager: FOUND" || echo "chore manager: MISSING"
grep -c "family.*goal\|goal.*family\|family.*reward" app/index.html && echo "family goals/rewards: FOUND" || echo "family goals/rewards: MISSING"
grep -c "child.*toggle\|toggle.*child\|feature.*toggle\|enable.*feature" app/index.html && echo "feature toggles: FOUND" || echo "feature toggles: MISSING"
grep -c "onboard.*wizard\|wizard.*onboard\|parent.*wizard" app/index.html && echo "parent onboarding wizard: FOUND" || echo "parent onboarding wizard: MISSING"

# Check for weekly report Brevo integration
grep -n "brevo\|sendgrid\|email.*report\|report.*email" app/index.html | head -10
```

---

## COMPILE AUDIT REPORT

After all agents complete, compile results into AUDIT_REPORT.md:

```bash
cat > AUDIT_REPORT.md << 'REPORT'
# YourLife CC — Current State Audit Report
Generated: $(date)
File: app/index.html ($(wc -l < app/index.html) lines)

## Summary Table

| Tab | Sub-tabs Today | Features Found | Features Missing | Complexity to Upgrade |
|-----|---------------|----------------|------------------|-----------------------|
| Chores | [fill] | [count] | [count] | High/Med/Low |
| Money | [fill] | [count] | [count] | High/Med/Low |
| Goals | [fill] | [count] | [count] | High/Med/Low |
| Habits | [fill] | [count] | [count] | High/Med/Low |
| Schedule | [fill] | [count] | [count] | High/Med/Low |
| CBT Training | [fill] | [count] | [count] | High/Med/Low |
| Skills | [fill] | [count] | [count] | High/Med/Low |
| Parent Hub | [fill] | [count] | [count] | High/Med/Low |

## Supabase Tables Currently In Use
[list from audit]

## Existing Functions Inventory
Total functions found: [count]
[categorized list]

## Bugs / Tech Debt Found During Audit
[list any issues noticed while reading]

## Recommended Build Order (post-audit)
[adjust based on actual complexity findings]

---
[TAB BY TAB DETAIL — paste each agent's output here]
REPORT

echo "Audit report template created. Fill in with agent findings."
```

---

## FINAL NOTE TO CLAUDE CODE

When running this audit:
- Do NOT modify any code
- Read thoroughly — look at both the HTML structure AND the JavaScript functions
- For each "MISSING" feature, add a note: is there any partial/stub code, or is it completely absent?
- Pay special attention to Skills > Legacy Vault — it's the Lifetime plan anchor feature
- Note the current line counts per section — we need to estimate how much the file will grow
- Flag any section that already has significant code that just needs UI polish vs sections that need to be built from scratch

Save the completed AUDIT_REPORT.md to repo root.
```
git add AUDIT_REPORT.md
git commit -m "audit: tab-by-tab current state analysis"
git push origin main
```
