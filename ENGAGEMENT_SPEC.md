# YourLife CC — Phase 2 Engagement Features Spec
## Daily Retention Loop: Reading Plans + AI VOTD + Mood + Prayer + Sermon Notes
**Branch:** `feat/engagement-loop` (branch before starting)
**Supabase project:** `hrohgwcbfgywkpnvqxhk`

---

## ⚠️ PRE-WORK CHECKLIST
1. `git checkout -b feat/engagement-loop` from main
2. Copy `app/js/data/reading-plans.js` from Desktop (already built — drop into app/js/data/)
3. Check tail of `app/index.html` before ANY edit — confirm tick(), setInterval(tick, Google Translate
4. `node --check` all JS before committing
5. Do NOT touch: Stripe price IDs, Brevo click tracking, sync.js console logs

---

## WORKER ASSIGNMENTS

### 🔵 WORKER 1 — Reading Plans + Streak Tracking
**Files:** `app/js/faith.js`, `app/js/data/reading-plans.js` (new), `app/index.html`

### 🟢 WORKER 2 — AI Verse of the Day + Mood Check-in
**Files:** `app/js/faith.js`, `api/ai-summary.js`, `app/index.html`

### 🟡 WORKER 3 — Guided Prayer Sessions
**Files:** `app/js/faith.js`, `app/index.html`

### 🔴 WORKER 4 — Sermon Notes
**Files:** `app/js/faith.js`, `app/calendar.html`, `app/index.html`

---

## PHASE 1 — WORKER 1: Bible Reading Plans + Streak Tracking

### Data File
`app/js/data/reading-plans.js` — already built. Contains:
- 5 plans: start-fresh (3d), foundations (7d), deeper (30d), through-the-story (90d), whole-word (365d)
- MOOD_SCRIPTURE — 5 moods with 3 verses each (used by Worker 2)
- PRAYER_SESSIONS — 6 prayer sessions (used by Worker 3)
- SERMON_NOTE_PROMPTS — 5 prompts (used by Worker 4)

Add `<script src="/app/js/data/reading-plans.js"></script>` to index.html BEFORE faith.js

### Supabase Table
```sql
CREATE TABLE reading_plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  current_day INTEGER DEFAULT 1,
  started_date DATE NOT NULL,
  last_read_date DATE,
  completed_days INTEGER[] DEFAULT '{}',
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reading_plan_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own progress" ON reading_plan_progress
  FOR ALL USING (auth.uid() = user_id);
```

### UI: Reading Plans Card
New card in faith home grid: `bfTab('readingPlans')`

**Plan Selection View:**
```
┌─────────────────────────────────────────┐
│  📚 Bible Reading Plans                  │
│                                         │
│  🌱 Starting Fresh    3 days  [Start]   │
│  🏗️  Foundations     7 days  [Start]   │
│  🌊 Deeper           30 days [Start]   │
│  📜 Through the Story 90 days [Start]  │
│  📖 The Whole Word   365 days [Start]  │
│                                         │
│  Active: Foundations — Day 3 of 7       │
│  🔥 Streak: 3 days                      │
└─────────────────────────────────────────┘
```

**Daily Reading View (when plan active):**
```
┌─────────────────────────────────────────┐
│  ← Back    Day 3 of 7    🔥 3 days       │
│                                         │
│  "You Need Community"                   │
│  Theme: The church and belonging        │
│                                         │
│  📖 Today's Readings:                   │
│  • Acts 2:42-47                         │
│  • Hebrews 10:24-25                     │
│  • 1 Corinthians 12:12-27              │
│                                         │
│  ✨ Key Verse: Hebrews 10:24-25         │
│  [verse in styled quote block]          │
│                                         │
│  💭 Reflection:                         │
│  "Christianity was never meant to be    │
│   solo. Who is your 'one another'?"     │
│                                         │
│  🙏 Prayer:                             │
│  [prayer text]                          │
│                                         │
│  [✅ Mark Complete]                     │
└─────────────────────────────────────────┘
```

**Streak Banner (faith home, top of page):**
- Show only if streak >= 1
- `🔥 X day streak — keep it going!`
- Green background, tappable → opens active plan
- Disappears if no active plan

**Key JS Functions:**
```javascript
function renderReadingPlansCard() { /* plan selection grid */ }
function openReadingPlan(planId) { /* show daily reading view */ }
function markDayComplete(planId, day) {
  /* update completed_days[], recalculate streak, save to localStorage + Supabase */
}
function calculateStreak(completedDays, lastReadDate) {
  /* returns current streak integer — breaks if last_read_date > 1 day ago */
}
function renderStreakBanner() { /* top of faith home */ }
```

**Streak Logic:**
- Streak increments when a day is marked complete
- Streak resets if user misses more than 1 day (grace: same day + next day counts)
- Longest streak is never reset — it's a personal record
- Multiple plans can be active simultaneously but streak is per-plan

**localStorage keys (via _ylccUserKey):**
- `rp_active` — array of active plan IDs
- `rp_progress_{planId}` — progress object per plan
- Supabase sync: fire-and-forget on markDayComplete()

---

## PHASE 2 — WORKER 2: AI Verse of the Day + Mood Check-in

### Verse of the Day — AI Personalized Reflection

**How it works:**
1. App selects a VOTD from a curated list of 365 verses (one per day of year, cycling annually)
2. On first open each day, calls `/api/ai-summary.js` with mode `votd-reflection`
3. Claude (Haiku, ~150 tokens) generates a 2-sentence personalized reflection
4. Reflection is cached in localStorage for the day (don't re-call the API)

**VOTD Verse List — 52 key verses (cycling weekly):**
```javascript
const VOTD_VERSES = [
  { ref: 'John 3:16', text: 'For God so loved the world...' },
  { ref: 'Romans 8:28', text: 'And we know that in all things...' },
  { ref: 'Philippians 4:13', text: 'I can do all this through him...' },
  { ref: 'Jeremiah 29:11', text: 'For I know the plans I have for you...' },
  { ref: 'Psalm 23:1', text: 'The Lord is my shepherd...' },
  { ref: 'Isaiah 40:31', text: 'But those who hope in the Lord...' },
  { ref: 'Matthew 6:33', text: 'But seek first his kingdom...' },
  { ref: 'Romans 12:2', text: 'Do not conform to the pattern...' },
  { ref: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart...' },
  { ref: 'Joshua 1:9', text: 'Be strong and courageous...' },
  { ref: 'Psalm 46:10', text: 'Be still and know that I am God...' },
  { ref: '2 Corinthians 5:17', text: 'Therefore if anyone is in Christ...' },
  { ref: 'Ephesians 2:10', text: 'For we are God\'s handiwork...' },
  { ref: '1 John 4:8', text: 'Whoever does not love does not know God...' },
  { ref: 'Matthew 5:16', text: 'Let your light shine before others...' },
  { ref: 'Galatians 5:22-23', text: 'But the fruit of the Spirit is love...' },
  { ref: 'Romans 5:8', text: 'But God demonstrates his own love...' },
  { ref: 'John 14:6', text: 'I am the way and the truth and the life...' },
  { ref: 'Psalm 119:105', text: 'Your word is a lamp for my feet...' },
  { ref: 'Hebrews 11:1', text: 'Now faith is confidence in what we hope for...' },
  { ref: 'James 1:2-3', text: 'Consider it pure joy, my brothers and sisters...' },
  { ref: '1 Corinthians 13:4-5', text: 'Love is patient, love is kind...' },
  { ref: 'Matthew 22:37-38', text: 'Love the Lord your God with all your heart...' },
  { ref: 'Romans 8:1', text: 'Therefore, there is now no condemnation...' },
  { ref: 'John 10:10', text: 'The thief comes only to steal and kill...' },
  { ref: 'Matthew 28:19-20', text: 'Therefore go and make disciples...' },
  { ref: 'Philippians 4:6-7', text: 'Do not be anxious about anything...' },
  { ref: 'Psalm 139:14', text: 'I praise you because I am fearfully and wonderfully made...' },
  { ref: 'Isaiah 41:10', text: 'So do not fear, for I am with you...' },
  { ref: 'Lamentations 3:22-23', text: 'Because of the Lord\'s great love we are not consumed...' },
  { ref: 'John 15:5', text: 'I am the vine; you are the branches...' },
  { ref: 'Romans 15:13', text: 'May the God of hope fill you with all joy and peace...' },
  { ref: '2 Timothy 1:7', text: 'For God has not given us a spirit of fear...' },
  { ref: 'Ephesians 3:20', text: 'Now to him who is able to do immeasurably more...' },
  { ref: '1 Peter 5:7', text: 'Cast all your anxiety on him because he cares for you...' },
  { ref: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened...' },
  { ref: 'Colossians 3:23', text: 'Whatever you do, work at it with all your heart...' },
  { ref: 'Hebrews 12:1-2', text: 'Let us run with perseverance the race marked out for us...' },
  { ref: 'John 8:32', text: 'Then you will know the truth, and the truth will set you free...' },
  { ref: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted...' },
  { ref: 'Revelation 21:4', text: 'He will wipe every tear from their eyes...' },
  { ref: 'Romans 8:38-39', text: 'For I am convinced that neither death nor life...' },
  { ref: 'Zephaniah 3:17', text: 'The Lord your God is with you, the Mighty Warrior who saves...' },
  { ref: 'Acts 1:8', text: 'But you will receive power when the Holy Spirit comes on you...' },
  { ref: 'John 16:33', text: 'I have told you these things, so that in me you may have peace...' },
  { ref: 'Psalm 37:4', text: 'Take delight in the Lord, and he will give you the desires of your heart...' },
  { ref: 'Genesis 50:20', text: 'You intended to harm me, but God intended it for good...' },
  { ref: 'Psalm 27:1', text: 'The Lord is my light and my salvation—whom shall I fear?...' },
  { ref: 'Isaiah 43:2', text: 'When you pass through the waters, I will be with you...' },
  { ref: 'Nehemiah 8:10', text: 'Do not grieve, for the joy of the Lord is your strength...' },
  { ref: '3 John 1:4', text: 'I have no greater joy than to hear that my children are walking in the truth...' },
  { ref: 'Revelation 3:20', text: 'Here I am! I stand at the door and knock...' },
  { ref: 'Romans 10:9', text: 'If you declare with your mouth "Jesus is Lord"...' }
];
```

**API update — `api/ai-summary.js`:**
Add new mode `votd-reflection`:
```javascript
if (mode === 'votd-reflection') {
  const { verse, verseRef, userAge, denomination, lastSection, streakDays } = body;
  const prompt = `You are a warm, encouraging faith companion for a young person aged ${userAge || '13-22'}.
  
Today's verse is ${verseRef}: "${verse}"

The user's denomination preference is: ${denomination || 'not specified'}
They last visited the "${lastSection || 'faith'}" section.
Their current reading streak is ${streakDays || 0} days.

Write exactly 2 sentences:
1. A personal reflection on this verse that connects to where they might be at their age
2. One practical, specific way to apply this truth today

Keep it warm, real, and under 60 words total. No religious clichés. Speak like a trusted older friend, not a preacher.`;

  // Use claude-haiku-4-5-20251001, max_tokens: 150
}
```

**VOTD Card (top of faith home, above streak banner):**
```
┌─────────────────────────────────────────┐
│  ✨ Today's Verse — May 20              │
│                                         │
│  "For I know the plans I have for       │
│   you..." — Jeremiah 29:11              │
│                                         │
│  ✦ AI Reflection:                       │
│  [2-sentence Claude reflection]         │
│                                         │
│  [📋 Copy] [🔖 Save to Journey]         │
└─────────────────────────────────────────┘
```

**Caching:**
```javascript
var _votdCacheKey = _ylccUserKey('votd_' + new Date().toDateString());
// Check localStorage first — only call API if not cached today
```

### Mood Check-in

**Trigger:** Shows as a gentle popup once per day when user opens faith tab
- Small modal slides up from bottom
- After 3 skips in a row, stops showing for 7 days
- User can turn off in settings

**Mood Picker:**
```
┌─────────────────────────────────────────┐
│  How are you feeling today?             │
│                                         │
│  😊  😟  😔  😤  😶                    │
│ Grateful Anxious Sad Frustrated Lost   │
│                                         │
│                        [Skip for today] │
└─────────────────────────────────────────┘
```

**After selection → Scripture Card:**
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│  You're feeling anxious today           │
│                                         │
│  Here's what God says:                  │
│                                         │
│  [Verse 1 — styled quote]               │
│  [Verse 2 — styled quote]               │
│  [Verse 3 — styled quote]               │
│                                         │
│  [🙏 Pray about this] → opens anxiety  │
│                          prayer session │
└─────────────────────────────────────────┘
```

**Key JS Functions:**
```javascript
function checkShowMoodPrompt() { /* once per day, respect skip count */ }
function renderMoodPicker() { /* 5-emoji bottom sheet modal */ }
function renderMoodScripture(moodId) { /* pull from MOOD_SCRIPTURE data */ }
function saveMoodLog(moodId) { /* localStorage: _ylccUserKey('mood_log') */ }
```

**localStorage keys:**
- `mood_last_shown` — date string
- `mood_skip_count` — integer (reset when mood is selected)
- `mood_log` — array of {date, mood} for personal tracking

---

## PHASE 3 — WORKER 3: Guided Prayer Sessions

### Prayer Sessions Card
New card in faith home: `bfTab('prayerSessions')` — OR — add as new tab in existing Prayer section (recommended — keeps prayer together).

**Session Selection View:**
```
┌─────────────────────────────────────────┐
│  🙏 Guided Prayer                        │
│                                         │
│  🌅 Morning Prayer       10 min  [Go]  │
│  🌙 Evening Prayer        8 min  [Go]  │
│  🤲 Fasting Prayer       15 min  [Go]  │
│  🕊️  Peace in the Storm   8 min  [Go]  │
│  ✨ Gratitude Prayer      7 min  [Go]  │
│  🛡️  Intercessory Prayer 12 min  [Go]  │
│                                         │
│  Last session: Morning Prayer — 2d ago  │
└─────────────────────────────────────────┘
```

**Prayer Session View (timer + steps):**
```
┌─────────────────────────────────────────┐
│  ✕                    🌅 Morning Prayer  │
│                                         │
│  ░░░░░░░░░░░░░░░░  Step 2 of 7         │
│                                         │
│  Adoration                              │
│  ─────────                              │
│  Worship God for who He is — not what  │
│  He does. Say aloud three things you   │
│  love about His character.             │
│                                         │
│  ⏱  1:30 remaining                     │
│  ████████████░░░░░░░░ 60%              │
│                                         │
│  [▶ Start Timer]  [Next Step →]        │
│                                         │
│  🎵 Ambient: [Piano Worship ▼]         │
│  ━━━━━━━━━━━━━━━━ YouTube (no-cookie) │
└─────────────────────────────────────────┘
```

**Timer Logic:**
```javascript
function startPrayerStep(stepIndex, duration) {
  var remaining = duration;
  var interval = setInterval(function() {
    remaining--;
    updateTimerDisplay(remaining);
    if (remaining <= 0) {
      clearInterval(interval);
      autoAdvanceOrPrompt(stepIndex + 1);
    }
  }, 1000);
}
```

**Ambient Audio:**
- YouTube no-cookie embed (same pattern as worship playlist)
- 4 options: Piano Worship, Nature Sounds, Silence (no embed), Soft Drone
- Selection stored in localStorage
- Plays automatically when session starts, pauses on close

**Progress Tracking:**
- `_ylccUserKey('prayer_history')` — array of {sessionId, date, completed}
- Show "Last session: X days ago" on selection screen
- No Supabase needed — localStorage only for prayer history

**Key JS Functions:**
```javascript
function renderPrayerSessionsCard() { /* session list */ }
function startPrayerSession(sessionId) { /* full-screen session view */ }
function startPrayerStep(stepIndex, duration) { /* countdown timer */ }
function nextPrayerStep(sessionId, stepIndex) { /* advance + save progress */ }
function completePrayerSession(sessionId) { /* log completion */ }
```

---

## PHASE 4 — WORKER 4: Sermon Notes

### Sermon Notes Section
**Location:** Standalone section in faith nav — `bfTab('sermonNotes')` — PLUS deep-link from calendar Sunday events.

**Notes List View:**
```
┌─────────────────────────────────────────┐
│  📝 Sermon Notes          [+ New Note]  │
│                                         │
│  May 19, 2026 · Celebration Church     │
│  "The Return" — Pastor Tim             │
│  John 15:1-5 · "abide in the vine..."  │
│  ▶ Expand                              │
│                                         │
│  May 12, 2026 · Celebration Church     │
│  "Fear Not" — Pastor Tim               │
│  Isaiah 41:10 · "do not fear..."       │
│  ▶ Expand                              │
└─────────────────────────────────────────┘
```

**Add/Edit Note Modal (full screen):**
```
Fields:
- Date (date picker — defaults to today)
- Church Name (pre-filled from Faith Profile)
- Pastor/Speaker Name (pre-filled from Faith Profile)
- Sermon Title
- Main Scripture (verse reference input)
- Key Verse (text)
- Notes (large textarea — main writing area)
- What God showed me (textarea)
- One thing I will do this week (textarea)
- Tags: multi-select chips [Salvation] [Prayer] [Family] [Purpose] [Healing] [Faith] [Other]
- Share with family toggle (links to Parent Hub)
```

**Structured Note Template (5 prompts from SERMON_NOTE_PROMPTS):**
When "+ New Note" is tapped, offer two modes:
1. **Free notes** — blank textarea
2. **Guided notes** — 5 guided prompts shown as labeled sections

**Calendar Integration:**
- In `calendar.html`, when a "Church Service" event is tapped:
  - Show "📝 Add Sermon Notes" button in the day popup
  - Opens sermon notes modal pre-populated with: date, church name (from Faith Profile), service name
- When a note exists for a date that has a Church Service event:
  - Show "📝 Note saved" indicator on that day in the calendar

**Supabase Table:**
```sql
CREATE TABLE sermon_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  church_name TEXT,
  pastor_name TEXT,
  sermon_title TEXT,
  scripture_ref TEXT,
  key_verse TEXT,
  notes TEXT,
  god_showed_me TEXT,
  action_this_week TEXT,
  tags TEXT[],
  shared_with_family BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sermon_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notes" ON sermon_notes
  FOR ALL USING (auth.uid() = user_id);
```

**Key JS Functions:**
```javascript
function renderSermonNotesCard() { /* notes list, sorted by date desc */ }
function openSermonNoteModal(noteId, prefill) { /* add/edit modal */ }
function saveSermonNote(noteData) { /* localStorage + Supabase */ }
function deleteSermonNote(noteId) { /* with confirm */ }
function exportSermonNote(noteId) { /* copy formatted text to clipboard */ }
```

---

## INTEGRATION POINTS

### Cross-feature connections:
1. **Mood check-in → Prayer session:** "Pray about this" button on mood scripture view links to matching prayer session (anxious → Peace in the Storm, etc.)
2. **VOTD → Study Notes:** "Save to Journey" on VOTD saves verse to Faith Journey notes
3. **Sermon Notes → Calendar:** Sunday church service events show "Add Notes" button; saved notes show indicator on calendar
4. **Reading Plan → Streak Banner:** Active plan + streak shows on faith home top
5. **Reading Plan complete day → Faith Journey:** Optional: "Log as milestone" when 365-day plan is completed

### Mood → Prayer Session mapping:
```javascript
const MOOD_TO_PRAYER = {
  grateful: 'gratitude',
  anxious: 'anxiety',
  sad: 'anxiety',
  angry: 'morning',
  lost: 'fasting'
};
```

---

## SUPABASE MIGRATIONS
New file: `docs/migrations/engagement-loop.sql`
Contains all 3 CREATE TABLE statements:
- `reading_plan_progress`
- `sermon_notes`
(faith_journey_entries already handles mood logs via localStorage)

---

## DATA FILES READY
`app/js/data/reading-plans.js` — COMPLETE ✅
Contains: READING_PLANS (5 plans), MOOD_SCRIPTURE (5 moods), PRAYER_SESSIONS (6 sessions), SERMON_NOTE_PROMPTS

Add to index.html BEFORE faith.js:
```html
<script src="/app/js/data/reading-plans.js"></script>
```

---

## COMMIT STRATEGY
- Worker 1: `git commit -m "feat: bible reading plans with streak tracking"`
- Worker 2: `git commit -m "feat: AI verse of the day and mood check-in with scripture"`
- Worker 3: `git commit -m "feat: guided prayer sessions with timer and ambient audio"`
- Worker 4: `git commit -m "feat: sermon notes with calendar integration"`
- Final: `git commit -m "feat: engagement loop complete — reading plans, AI VOTD, mood, prayer, sermon notes"`
- `git push origin feat/engagement-loop`
- Merge PR → main → Vercel deploys

---

## SUCCESS METRICS
- [ ] All 5 reading plans selectable, daily reading view opens
- [ ] Streak banner shows on faith home when plan active
- [ ] VOTD shows daily verse + Claude-generated reflection (cached per day)
- [ ] Mood picker shows once per day, scripture appears after selection
- [ ] "Pray about this" links from mood to correct prayer session
- [ ] All 6 prayer sessions open with step-by-step timer
- [ ] Ambient audio plays in prayer session (YouTube no-cookie)
- [ ] Sermon Notes list, add, edit, delete all work
- [ ] Calendar Sunday events show "Add Notes" button
- [ ] All SQL migrations run in Supabase
- [ ] node --check passes on all JS files
- [ ] index.html tail intact after every edit
