# YourLife CC — Phase 4: AI Content Generator + Curation Expansion
## Closing the Volume Gap with Hallow/Glorify
**Branch:** `feat/ai-content` (branch after current fix is merged)
**Goal:** Scale from 38 audio sessions to 200+ with two strategies — AI generation + YouTube curation

---

## STRATEGY OVERVIEW

**The Problem:**
- Hallow: 10,000+ sessions (~2,000 unique)
- Glorify: ~500 unique sessions
- YourLife CC: 38 sessions today

**The Solution — Two Paths Combined:**

**Path A — AI Meditation Generator** (infinite scale, zero production cost)
- User picks theme/scripture/mood + duration
- Claude generates full meditation script (segments, scripture, reflection, prayer)
- Web Speech API (or future ElevenLabs) reads it
- Generated meditations saved per-user, replayable, shareable

**Path B — Curated YouTube Library Expansion** (instant volume from free content)
- Pre-populate 60+ verified YouTube tracks across categories
- Include: BibleProject, Bible Recap, Hallow free content, Ascension, K-LOVE, Hillsong, Bethel, Elevation
- Searchable discovery feed
- "Trending in faith community" surfacing

Combined output: User has unlimited fresh content + 100+ verified curated tracks within a week.

---

## ⚠️ PRE-WORK CHECKLIST
1. Confirm current `feat/audio-layer` fix is merged to main
2. `git checkout -b feat/ai-content` from main
3. Pull latest main first
4. Check tail of `app/index.html` before any edit
5. `node --check` all JS before commit
6. Do NOT touch: Stripe price IDs, Brevo, sync.js console logs

---

## WORKER ASSIGNMENTS

### 🔵 WORKER 1 — AI Meditation Generator API + UI
**Files:** `api/ai-summary.js`, `app/js/faith.js`, `app/index.html`

### 🟢 WORKER 2 — Curated YouTube Library Expansion
**Files:** `app/js/data/audio-content.js`, `app/js/faith.js`

### 🟡 WORKER 3 — Saved/Custom Meditations + Discovery Feed
**Files:** `app/js/faith.js`, `app/index.html`, Supabase migration

### 🔴 WORKER 4 — Daily AI Devotional + Voice Picker Settings
**Files:** `app/js/faith.js`, `api/ai-summary.js`, `app/index.html`

---

## PHASE 1 — WORKER 1: AI Meditation Generator

### New API Mode in `api/ai-summary.js`

Add new mode `meditation-generator`:

```javascript
if (mode === 'meditation-generator') {
  const { theme, scripture, duration, mood, userAge, denomination } = body;
  
  const minutes = duration || 10;
  const targetSegments = Math.ceil(minutes * 60 / 60); // ~1 segment per minute
  
  const prompt = `You are a warm, theologically-sound faith companion creating a personalized guided meditation.

User context:
- Age: ${userAge || '13-22'}
- Denomination preference: ${denomination || 'evangelical'}
- Current mood: ${mood || 'open'}
- Theme requested: ${theme || 'God\'s love'}
- Scripture focus: ${scripture || 'choose an appropriate verse'}
- Target length: ${minutes} minutes (${targetSegments} segments)

Generate a guided meditation as a JSON object with this exact structure:

{
  "title": "Short evocative title (max 4 words)",
  "icon": "Single emoji that fits the theme",
  "theme": "One-sentence theme description",
  "duration": ${minutes},
  "scriptureFocus": "Book Chapter:Verse",
  "ambientSuggestion": "calm|worship|nature|prayer (pick one matching theme)",
  "segments": [
    { "duration": 30, "type": "opening", "text": "Brief welcoming intro that settles the user" },
    { "duration": 60, "type": "scripture", "text": "The scripture text", "verse": "Book Chapter:Verse" },
    { "duration": 90, "type": "reflection", "text": "Personal reflection that connects the verse to their age and mood" },
    { "duration": 60, "type": "silence", "text": "Brief instruction to sit in silence" },
    { "duration": 90, "type": "scripture", "text": "Second supporting scripture", "verse": "Book Chapter:Verse" },
    { "duration": 60, "type": "reflection", "text": "Deeper reflection or application" },
    { "duration": 90, "type": "prayer", "text": "Prayer the user can echo or pray themselves" },
    { "duration": 30, "type": "close", "text": "Brief closing that sends them into their day" }
  ]
}

Requirements:
- Total duration must sum to approximately ${minutes * 60} seconds
- Use real Bible verses (KJV, NIV, or ESV — your choice but accurate)
- Write in second person ("you", not "we")
- Warm, real tone — not preachy, not religious clichés
- Speak like a trusted older friend
- Each segment text under 60 words

Return ONLY the JSON object, no preamble.`;

  // Call Claude Haiku for speed
  // model: 'claude-haiku-4-5-20251001'
  // max_tokens: 2000
  // Parse and validate JSON response
}
```

### UI: AI Meditation Generator Card

Add new tab `bfTab('createMeditation')` — also accessible from existing Audio Meditations card via "+ Create Your Own" button.

**Generator UI:**
```
┌─────────────────────────────────────────┐
│  ✨ Create Your Meditation               │
│  AI generates a guided session for you  │
│                                         │
│  What's on your heart?                  │
│  [Theme/topic input ........]           │
│  e.g. "trusting God when I'm scared"    │
│                                         │
│  Or pick a feeling:                     │
│  😊 😟 😔 😤 😶                        │
│                                         │
│  Length:                                │
│  ( ) 5 min    (•) 10 min    ( ) 15 min  │
│                                         │
│  Optional scripture focus:              │
│  [Psalm 23:1 ...........]              │
│                                         │
│         [✨ Generate Meditation]        │
└─────────────────────────────────────────┘
```

**Generated Meditation Display:**
After API returns, save to localStorage and immediately launch in the meditation player. Show:
- Saved! It's in your "My Meditations" library
- [▶ Play Now] [💾 Save for Later] [🔄 Regenerate]

**Key JS Functions:**
```javascript
function renderCreateMeditationCard() { /* generator form */ }
async function generateMeditation(formData) {
  // Call /api/ai-summary with mode 'meditation-generator'
  // Parse JSON response
  // Save to localStorage (via _ylccUserKey('custom_meditations'))
  // Launch meditation player with the generated content
}
function saveMeditationToLibrary(meditation) { /* persist to user's library */ }
function regenerateMeditation() { /* call API again with same params */ }
```

### Generated Meditation Storage:
- localStorage key: `_ylccUserKey('custom_meditations')` — array of generated meditations
- Each entry: { id, title, theme, generatedAt, segments, scriptureFocus }
- Limit: keep last 20 generated (oldest auto-pruned)
- Supabase sync: fire-and-forget upsert for cross-device access

---

## PHASE 2 — WORKER 2: Curated YouTube Library Expansion

### Massive Library Expansion in `audio-content.js`

Replace AMBIENT_LIBRARY with comprehensive curated library.

**New structure — CURATED_AUDIO_LIBRARY:**

```javascript
const CURATED_AUDIO_LIBRARY = [
  {
    id: 'cat-worship-24-7',
    category: 'Worship 24/7',
    icon: '🎵',
    description: 'Always-on worship streams from established channels',
    tracks: [
      { id: 'integrity-247', title: 'Integrity Music 24/7 Worship', youtubeId: 'VYXDfhgwTyM', host: 'Integrity Music', verified: true },
      { id: 'mmh-247', title: 'Music Meets Heaven 24/7', youtubeId: 'IXsIRMmfudw', host: 'Music Meets Heaven', verified: true },
      { id: 'praise-247', title: 'Praise & Worship Live 24/7', youtubeId: '_QqFhkOcljI', host: 'Worship Live', verified: true },
      // 5-7 more verified streams
    ]
  },
  {
    id: 'cat-bible-project',
    category: 'BibleProject',
    icon: '📖',
    description: 'Animated explanations of Scripture',
    tracks: [
      { id: 'bp-overview-genesis', title: 'Overview: Genesis 1-11', youtubeId: 'GQI72THyO5I', host: 'BibleProject' },
      { id: 'bp-overview-exodus', title: 'Overview: Exodus 1-18', youtubeId: 'jH_aojNJM3E', host: 'BibleProject' },
      // 15-20 more BibleProject videos covering all of Scripture
    ]
  },
  {
    id: 'cat-lofi-christian',
    category: 'Christian Lofi',
    icon: '🎯',
    description: 'Lo-fi beats with worship themes — perfect for study',
    tracks: [
      { id: 'lofi-247', title: 'The Lofi Christian 24/7', youtubeId: 'qXPoj_VYb3U', host: 'The Lofi Christian' },
      // 4-5 more
    ]
  },
  {
    id: 'cat-piano-instrumental',
    category: 'Piano & Instrumental',
    icon: '🎹',
    description: 'Soft piano worship — focus, prayer, or relaxation',
    tracks: [
      // 8-10 piano-only worship tracks
    ]
  },
  {
    id: 'cat-sleep-bible',
    category: 'Bible at Bedtime',
    icon: '🌙',
    description: 'Scripture read softly with calm backgrounds',
    tracks: [
      // 8-10 sleep-friendly Bible audio
    ]
  },
  {
    id: 'cat-prayer-ambient',
    category: 'Prayer Ambient',
    icon: '🙏',
    description: 'Backgrounds designed for deep prayer time',
    tracks: [
      // 6-8 prayer ambient
    ]
  },
  {
    id: 'cat-nature',
    category: 'Nature & Creation',
    icon: '🌿',
    description: 'God\'s creation in sound',
    tracks: [
      // 6-8 nature sounds
    ]
  },
  {
    id: 'cat-hillsong',
    category: 'Hillsong Instrumental',
    icon: '⛪',
    description: 'Hillsong worship without vocals',
    tracks: [
      // 6-8 verified Hillsong instrumental
    ]
  },
  {
    id: 'cat-bethel',
    category: 'Bethel & Spontaneous',
    icon: '🔥',
    description: 'Bethel-style soaking and spontaneous worship',
    tracks: [
      // 6-8 verified
    ]
  },
  {
    id: 'cat-elevation',
    category: 'Elevation Worship',
    icon: '✨',
    description: 'Elevation Worship instrumental and live',
    tracks: [
      // 6-8 verified
    ]
  }
];
```

**Total target: 80-100 verified YouTube embeds across 10 categories**

### Verification System

Add a metadata field per track:
- `verified: true|false` — manually confirmed working
- `lastChecked: 'YYYY-MM-DD'` — when last verified
- `reportCount: 0` — increments if users report broken

### Discovery Feed UI

Replace current Ambient Library card with enhanced view:

```
┌─────────────────────────────────────────┐
│  🎵 Audio Library          [🔍 Search]   │
│                                         │
│  ━━━ 24/7 Worship Streams ━━━           │
│  🎵 Integrity Music 24/7  ✓ Verified   │
│  🎵 Music Meets Heaven    ✓ Verified   │
│  🎵 Praise & Worship Live ✓ Verified   │
│                                         │
│  ━━━ BibleProject ━━━                   │
│  📖 Overview: Genesis 1-11             │
│  📖 Overview: Exodus 1-18              │
│  [+5 more] →                            │
│                                         │
│  ━━━ Christian Lofi ━━━                 │
│  🎯 The Lofi Christian 24/7  ✓         │
│                                         │
│  [⚠️ Report broken track]                │
└─────────────────────────────────────────┘
```

### Search Function

```javascript
function searchAudioLibrary(query) {
  // Search across track.title, track.host, category.description
  // Return matching tracks across all categories
}
```

---

## PHASE 3 — WORKER 3: Saved/Custom Meditations + Discovery Feed

### Supabase Table for Custom Meditations

```sql
CREATE TABLE custom_meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  theme TEXT,
  icon TEXT,
  duration INTEGER,
  scripture_focus TEXT,
  ambient_suggestion TEXT,
  segments JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE custom_meditations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own meditations" ON custom_meditations
  FOR ALL USING (auth.uid() = user_id OR is_public = true);
```

### My Meditations Library UI

New section within Audio Meditations card — "My Meditations" tab:

```
┌─────────────────────────────────────────┐
│  My Meditations                          │
│                                         │
│  ✨ Trusting God When Scared    10 min  │
│     Created today                       │
│     [▶ Play] [✏ Edit] [🗑]              │
│                                         │
│  ✨ Peace Before Bed            8 min   │
│     Created 2 days ago                  │
│     [▶ Play] [✏ Edit] [🗑]              │
│                                         │
│  [+ Create New Meditation]              │
└─────────────────────────────────────────┘
```

### Community Discovery Feed (Optional, future-ready scaffold)

When user creates a meditation, optional "Share with community" toggle:
- Saves to custom_meditations with `is_public = true`
- Other users can browse community meditations
- Phase 4 / future: rating, sorting by popularity

For now, just scaffold the toggle — don't build the full discovery UI yet.

---

## PHASE 4 — WORKER 4: Daily AI Devotional + Voice Picker

### Daily AI Devotional

A new card on faith home: "Today's Devotional" — auto-generated daily content using Claude.

**Auto-generation:**
- On first faith tab open each day, check if today's devotional exists in localStorage
- If not, call `/api/ai-summary` with mode `daily-devotional`
- Generate: title, opening prayer, scripture passage, 200-word devotional reflection, application question, closing prayer
- Cache for 24 hours, regenerate next day

**API mode `daily-devotional`:**
```javascript
if (mode === 'daily-devotional') {
  const { userAge, denomination, streakDays, lastTheme } = body;
  
  const prompt = `Generate today's devotional for a young person aged ${userAge || '13-22'}.

Style: Warm, real, not preachy. Like a trusted friend writing to them.
Denomination: ${denomination || 'evangelical'}
Their reading streak: ${streakDays || 0} days
Previous theme to avoid: ${lastTheme || 'none'}

Return JSON:
{
  "title": "Today's title (max 5 words)",
  "icon": "Emoji",
  "scripture": "Verse text",
  "scriptureRef": "Book Chapter:Verse",
  "devotional": "200 word devotional reflection in second person",
  "question": "One application question they can journal about",
  "prayer": "60 word prayer they can pray"
}

Return ONLY the JSON.`;
}
```

**Display:**
```
┌─────────────────────────────────────────┐
│  ✨ Today's Devotional — May 20         │
│                                         │
│  ☀️ Steady When the Wind Picks Up      │
│                                         │
│  📖 "Be still, and know that I am God." │
│      — Psalm 46:10                      │
│                                         │
│  [200-word devotional reflection]       │
│                                         │
│  💭 Today's question:                   │
│  [Application question]                 │
│                                         │
│  🙏 Prayer for today:                   │
│  [60-word prayer]                       │
│                                         │
│  [🔊 Listen]  [🔖 Save]  [📋 Share]    │
└─────────────────────────────────────────┘
```

### Voice Picker in Settings

Add to settings panel:

```
┌─────────────────────────────────────────┐
│  Voice for Audio                         │
│                                         │
│  Choose voice:                          │
│  [Samantha (iOS) ▼]                     │
│                                         │
│  Speaking speed:                        │
│  ( ) Slow  (•) Natural  ( ) Fast        │
│                                         │
│  [🔊 Test voice]                        │
│                                         │
│  Premium voices coming soon              │
└─────────────────────────────────────────┘
```

**Implementation:**
- Read window.speechSynthesis.getVoices() — list all available
- Filter to English voices only
- Sort by quality (Premium > Enhanced > Natural > standard)
- Store selection in `_ylccUserKey('tts_voice_uri')` — store the voice URI for stability
- Speed control: 0.8/0.9/1.0 mapped to slow/natural/fast
- Test button speaks: "The Lord is my shepherd. I shall not want."

---

## SUCCESS METRICS

- [ ] AI Meditation Generator creates valid meditation from theme/scripture/duration input
- [ ] Generated meditations save to localStorage and Supabase
- [ ] Curated library has 80+ verified YouTube tracks across 10 categories
- [ ] Search across audio library returns relevant results
- [ ] Daily AI Devotional generates fresh content per day, cached for 24h
- [ ] Voice picker shows all available device voices, persists selection
- [ ] My Meditations library shows user's generated content
- [ ] All JS passes `node --check`
- [ ] All YouTube embeds use youtube-nocookie.com
- [ ] index.html tail intact after every edit

---

## COMMIT STRATEGY

- Worker 1: `feat: AI meditation generator with personalized theme/scripture/mood`
- Worker 2: `feat: expanded curated audio library — 80+ verified tracks across 10 categories`
- Worker 3: `feat: saved custom meditations library with Supabase sync`
- Worker 4: `feat: daily AI devotional and voice picker in settings`

## DEPLOY
- `git push origin feat/ai-content`
- Open PR → merge to main → Vercel deploys
- Run `docs/migrations/ai-content.sql` in Supabase

---

## EXPECTED VOLUME AFTER PHASE 4

**Before:** 38 audio sessions
**After:** 80+ curated tracks + UNLIMITED AI-generated meditations + Daily AI devotional + 7 original meditations + 7 sleep stories = effectively **infinite content**

You'll be the only Christian app with AI-generated personalized meditations. That's a moat Hallow and Glorify can't easily copy because it requires AI infrastructure.
