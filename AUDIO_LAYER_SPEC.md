# YourLife CC — Phase 3: Audio Layer Spec
## Closing the Hallow Gap — 6 Audio Features, Free Tier with Premium Upgrade Path
**Branch:** `feat/audio-layer` (branch before starting)
**Supabase project:** `hrohgwcbfgywkpnvqxhk`

---

## ⚠️ PRE-WORK CHECKLIST
1. `git checkout -b feat/audio-layer` from main
2. Copy `app/js/data/audio-content.js` from Desktop into `app/js/data/`
3. Add `<script src="/app/js/data/audio-content.js"></script>` to index.html BEFORE faith.js
4. Check tail of `app/index.html` — confirm tick(), setInterval(tick, Google Translate
5. `node --check` all JS before committing
6. Do NOT touch: Stripe price IDs, Brevo click tracking, sync.js console logs

---

## STRATEGY: FREE TIER + PREMIUM UPGRADE PATH

**Free tier** (ship now — all features functional with zero cost):
- Web Speech API for all TTS (built into every modern browser, no API key)
- YouTube no-cookie embeds for ambient backgrounds (same pattern as worship/prayer)
- Bible.is web links for full chapter audio (free, just link out to live.bible.is)
- Existing podcast page for sermon audio
- All content stored in audio-content.js (no external dependency)

**Premium tier** (scaffold now, monetize later):
- ElevenLabs API for natural human voice TTS (~$5/month base)
- Bible.is API direct integration for in-app audio (vs. linking out)
- Original recorded meditations (future production)
- Spotify Connect for premium worship playlists

The code should have feature flags so premium can be enabled per-user later via Stripe subscription tier.

---

## WORKER ASSIGNMENTS

### 🔵 WORKER 1 — Audio Bible (TTS on every verse + Bible.is link-out)
**Files:** `app/js/faith.js`, `app/js/data/audio-content.js`, `app/index.html`
**What it does:** Every verse displayed anywhere in the app gets a 🔊 tap-to-listen button using Web Speech API. Plus a full-chapter audio Bible card that links out to Bible.is.

### 🟢 WORKER 2 — Audio Meditations + Sleep Stories
**Files:** `app/js/faith.js`, `app/index.html`
**What it does:** New Audio Meditations card with 7 sessions. Sleep Stories tab with 7 bedtime scripture audio experiences.

### 🟡 WORKER 3 — Ambient Audio Library + Audio Sermons
**Files:** `app/js/faith.js`, `app/index.html`, `app/podcasts.html`
**What it does:** Standalone Ambient Library with 6 categories. Sermon Notes → linked podcast audio.

### 🔴 WORKER 4 — Mood Audio Integration + Premium Scaffolding
**Files:** `app/js/faith.js`, `app/js/data/audio-content.js`, `api/audio-tts.js` (new)
**What it does:** Wire mood check-in to audio meditations + ambient. Build premium TTS endpoint scaffolding (returns Web Speech config now; ElevenLabs later).

---

## PHASE 1 — WORKER 1: Audio Bible (TTS Everywhere)

### Web Speech API Helper (faith.js)
Add a universal helper that any verse-render code can call:

```javascript
var _ylccTtsCurrent = null; // track current utterance

function speakVerse(text, ref) {
  if (!window.speechSynthesis) {
    showToast('Audio not supported on this browser');
    return;
  }
  
  // Stop any current playback
  if (_ylccTtsCurrent) {
    window.speechSynthesis.cancel();
    _ylccTtsCurrent = null;
    updateAllSpeakButtons('stopped');
    return; // toggle off if same button pressed
  }
  
  var utterance = new SpeechSynthesisUtterance();
  utterance.text = (ref ? ref + '. ' : '') + text;
  utterance.rate = TTS_CONFIG.freeTier.rate;
  utterance.pitch = TTS_CONFIG.freeTier.pitch;
  utterance.volume = TTS_CONFIG.freeTier.volume;
  
  // Pick best available voice
  var voices = window.speechSynthesis.getVoices();
  var preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                  voices.find(v => v.lang.startsWith('en'));
  if (preferred) utterance.voice = preferred;
  
  utterance.onstart = function() { updateAllSpeakButtons('playing'); };
  utterance.onend = function() {
    _ylccTtsCurrent = null;
    updateAllSpeakButtons('stopped');
  };
  utterance.onerror = function() {
    _ylccTtsCurrent = null;
    updateAllSpeakButtons('stopped');
  };
  
  _ylccTtsCurrent = utterance;
  window.speechSynthesis.speak(utterance);
}

function updateAllSpeakButtons(state) {
  document.querySelectorAll('.speak-verse-btn').forEach(function(btn) {
    btn.textContent = state === 'playing' ? '⏸️' : '🔊';
  });
}
```

### Add Speak Button to All Verse Displays
Audit faith.js and find every place verses are rendered:
- `renderJesusCard()` — red letter words tab
- `renderBibleStudyCard()` — Passage Viewer tab
- `renderRedLetterWords()` — all verse cards
- `MOOD_SCRIPTURE` rendered verses
- VOTD card
- Reading Plans daily view
- Any other `<blockquote>` or styled scripture block

Add `🔊` button next to each:
```html
<button class="speak-verse-btn" 
        onclick="event.stopPropagation(); speakVerse('${escapedText}', '${escapedRef}')"
        title="Listen">🔊</button>
```

### Audio Bible Card (Bible.is link-out)
New card in faith home: `bfTab('audioBible')`

**UI:**
```
┌─────────────────────────────────────────┐
│  🎧 Audio Bible                          │
│  Listen to any chapter, free            │
│                                         │
│  Quick Access:                          │
│  • New Testament    [Browse →]          │
│  • Old Testament    [Browse →]          │
│  • Psalms           [Browse →]          │
│  • Gospels          [Browse →]          │
│                                         │
│  Or jump to:                            │
│  [Book ▼] [Chapter ▼]  [▶ Listen]      │
│                                         │
│  ℹ️ Audio provided by Faith Comes        │
│     By Hearing (Bible.is) — free        │
└─────────────────────────────────────────┘
```

**Behavior:**
- Book dropdown lists all 66 books
- Chapter dropdown adjusts based on book selected
- "Listen" button opens `https://live.bible.is/bible/ENGNIV/{book}/{chapter}` in new tab
- No in-app player needed for v1 (premium upgrade later)

---

## PHASE 2 — WORKER 2: Audio Meditations + Sleep Stories

### Audio Meditations Card
New card in faith home: `bfTab('audioMeditations')`

**Selection View:**
```
┌─────────────────────────────────────────┐
│  🧘 Audio Meditations                    │
│  Scripture-led guided audio             │
│                                         │
│  🌅 Morning Light          8 min  [▶]  │
│  🕊️  Peace in the Storm   10 min  [▶]  │
│  ✨ Gratitude Practice     7 min  [▶]  │
│  👤 Who You Are            9 min  [▶]  │
│  🛐 Sabbath Rest          12 min  [▶]  │
│  🌱 Hope When It's Heavy   9 min  [▶]  │
│  ⛰️  Faith That Moves      8 min  [▶]  │
│                                         │
│  Last session: Morning Light — 2d ago  │
└─────────────────────────────────────────┘
```

**Meditation Player (full screen):**
```
┌─────────────────────────────────────────┐
│  ✕                  🌅 Morning Light     │
│                                         │
│  ████████░░░░░░░░░░░░░  3:24 / 8:00    │
│                                         │
│  [Scripture image / verse art]          │
│                                         │
│  "The steadfast love of the Lord       │
│   never ceases."                        │
│  — Lamentations 3:22                    │
│                                         │
│  [Current spoken segment shows here]    │
│                                         │
│  [⏸ Pause]   [⏭ Skip]   [🎵 Ambient ▼] │
│                                         │
│  ━━━━━━━━━━━━ YouTube ambient ━━━━━━━━ │
└─────────────────────────────────────────┘
```

**Player Logic:**
- Each segment in `AUDIO_MEDITATIONS[].segments` has duration + text
- Web Speech API speaks segment text
- After segment duration elapses (or speech ends), advance to next
- YouTube ambient plays in background at low volume
- User can pause, skip, or close
- Progress saved per session to localStorage

**Key JS Functions:**
```javascript
function renderAudioMeditationsCard() { /* selection grid */ }
function startMeditation(medId) { /* full-screen player */ }
function playMeditationSegment(med, segmentIndex) { /* TTS + auto-advance */ }
function pauseMeditation() { /* speechSynthesis.pause() + pause YouTube */ }
function closeMeditation() { /* cleanup, save progress */ }
function setAmbientForMeditation(youtubeId) { /* swap ambient track */ }
```

### Sleep Stories Tab
Add as second tab within Audio Meditations card, OR separate card. Recommend **separate card** since it's distinct intent (nighttime use).

New card: `bfTab('sleepStories')`

**Selection View:**
```
┌─────────────────────────────────────────┐
│  🌙 Sleep Stories                        │
│  Drift to sleep with Scripture          │
│                                         │
│  🌙 The Lord is My Shepherd  15min [▶] │
│  🌊 Peace Like a River       20min [▶] │
│  💫 God's Promises           18min [▶] │
│  ⭐ Creation Story           20min [▶] │
│  💗 You Are Loved            15min [▶] │
│  🤲 In His Hands             12min [▶] │
│  🐑 The Good Shepherd        16min [▶] │
│                                         │
│  💡 Tip: Use headphones at bedtime      │
│     Audio fades out automatically       │
└─────────────────────────────────────────┘
```

**Sleep Player:**
- Dimmed UI (dark mode forced, low brightness)
- TTS reads verses slowly (rate 0.75)
- YouTube ambient lullaby plays at low volume
- Audio fades out at duration end (or user can extend by 10 min)
- Wake Lock API to prevent screen sleep if user wants
- Auto-stops at `fadeOutAt` time

**Key JS Functions:**
```javascript
function renderSleepStoriesCard() { /* selection */ }
function startSleepStory(storyId) { /* dimmed full-screen player */ }
function fadeOutSleepStory(seconds) { /* gradually reduce TTS volume */ }
```

---

## PHASE 3 — WORKER 3: Ambient Audio Library + Audio Sermons

### Ambient Audio Library Card
New card in faith home: `bfTab('ambientLibrary')`

**UI:**
```
┌─────────────────────────────────────────┐
│  🎵 Ambient Library                      │
│  Background audio for any moment        │
│                                         │
│  🎯 Focus & Study      3 tracks        │
│  🕊️  Calm & Peace      3 tracks        │
│  🙏 Prayer & Meditation 3 tracks       │
│  🌙 Sleep              3 tracks        │
│  🎵 Worship            3 tracks        │
│  🌿 Nature & Creation  3 tracks        │
│                                         │
│  Now Playing: Peaceful Worship          │
│  ━━━━━━━━━━━━ ◉ ━━━━━━━━━━━━━━━ 12:34 │
│  [⏸ Pause]              [✕ Stop]       │
└─────────────────────────────────────────┘
```

**Category Drill-Down:**
- Tap a category → expand to show 3 tracks
- Tap track → start YouTube no-cookie embed at top of page (sticky mini-player)
- Mini-player persists as user navigates the app
- Pause/stop from anywhere

**Key JS Functions:**
```javascript
function renderAmbientLibraryCard() { /* category grid */ }
function expandAmbientCategory(category) { /* show tracks */ }
function playAmbientTrack(trackId) { /* YouTube embed in sticky mini-player */ }
function stopAmbient() { /* close player */ }
function ensureAmbientMiniPlayer() { /* sticky player at top */ }
```

### Audio Sermons Integration
**No new card.** Integrate into existing Sermon Notes feature.

**Changes to faith.js — `renderSermonNotes()`:**
- When a sermon note has a `pastor_name` field, search PODCASTS data for matching pastor
- If match found, show "🎧 Listen to similar sermons" link → opens podcasts.html filtered to that pastor's show

**Example:**
- User adds sermon note for "Pastor Tim" at "Celebration Church"
- Note card shows: `🎧 Listen on the go → [opens Daily Hope or similar podcast]`

**Implementation:**
```javascript
function findPodcastForPastor(pastorName) {
  // CHRISTIAN_PODCASTS already in app
  for (var category of CHRISTIAN_PODCASTS) {
    for (var podcast of category.podcasts) {
      if (podcast.host.toLowerCase().includes(pastorName.toLowerCase()) ||
          pastorName.toLowerCase().includes(podcast.host.toLowerCase())) {
        return podcast;
      }
    }
  }
  return null;
}
```

---

## PHASE 4 — WORKER 4: Mood Audio Integration + Premium Scaffolding

### Wire Mood Check-in to Audio
Extend the existing mood check-in flow:

**After user selects mood and sees scripture:**
Add new section below verses:

```
┌─────────────────────────────────────────┐
│  Want to go deeper?                     │
│                                         │
│  🧘 Meditate on this                    │
│     [Peace in the Storm — 10 min]       │
│                                         │
│  🎵 Or just listen                      │
│     [Peaceful Worship background]       │
└─────────────────────────────────────────┘
```

Use `MOOD_AUDIO_MAP` to determine which meditation + ambient track to suggest.

### Premium TTS API Scaffolding
Create `api/audio-tts.js`:

```javascript
// Premium TTS endpoint — scaffolded for future ElevenLabs integration
// For now, returns Web Speech config so client uses free TTS
// Future: detect user.subscription_tier === 'premium', call ElevenLabs

module.exports = async (req, res) => {
  const { text, voiceId } = req.body;
  
  // Get user subscription tier (from Supabase auth)
  const userTier = req.body.userTier || 'free';
  
  if (userTier === 'free') {
    return res.json({
      provider: 'web-speech-api',
      message: 'Use browser-native TTS',
      config: { rate: 0.9, pitch: 1.0 }
    });
  }
  
  // Premium tier — placeholder for ElevenLabs
  // Future implementation:
  // const audioBuffer = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {...});
  // return res.send(audioBuffer);
  
  return res.json({
    provider: 'web-speech-api',
    message: 'Premium TTS coming soon — using Web Speech for now',
    config: { rate: 0.9, pitch: 1.0 }
  });
};
```

### Client-side detection wrapper:
```javascript
async function getOptimalTTS() {
  // Check user tier
  var userTier = (window.D && window.D.user && window.D.user.tier) || 'free';
  
  if (userTier === 'premium') {
    // Future: fetch audio buffer from /api/audio-tts
    // For now, fall through to free
  }
  
  // Free tier — return Web Speech API config
  return TTS_CONFIG.freeTier;
}
```

---

## SUPABASE — No New Tables Required

The audio layer uses:
- localStorage for play history (no PII)
- Existing `mood_log` for mood→audio correlation
- Existing `sermon_notes` for podcast linking

No new schema changes needed. ✅

---

## INTEGRATION POINTS

1. **Mood → Meditation:** Selecting "Anxious" mood now offers "Peace in the Storm" meditation
2. **Mood → Ambient:** Selecting any mood offers a matching ambient track
3. **VOTD → Listen:** 🔊 button on Verse of the Day card
4. **Reading Plans → Listen:** 🔊 button on every key verse in daily reading
5. **Sermon Notes → Podcast:** Auto-link to relevant podcast by pastor name
6. **Bible Study → Audio:** Passage Viewer tab gets 🔊 on every verse
7. **Faith Calendar → Sleep Story:** Calendar event tagged "bedtime" can launch sleep story
8. **Story Mode → Listen:** Optional narration of Story Mode chapters

---

## SUCCESS METRICS
- [ ] 🔊 button appears on every displayed verse (all sections)
- [ ] Tapping 🔊 speaks the verse using Web Speech API
- [ ] Audio Bible card opens Bible.is in new tab for any book/chapter
- [ ] All 7 Audio Meditations play with auto-advance and ambient
- [ ] All 7 Sleep Stories play with fade-out
- [ ] Ambient Library has 6 categories, 18 tracks, sticky mini-player
- [ ] Mood check-in offers meditation + ambient suggestion
- [ ] Sermon Notes link to matching podcast when pastor matches
- [ ] All JS passes `node --check`
- [ ] index.html tail intact after every edit
- [ ] No paywall yet — all features work free

---

## COMMIT STRATEGY
- Worker 1: `git commit -m "feat: audio bible — TTS on every verse + Bible.is link-out"`
- Worker 2: `git commit -m "feat: audio meditations and sleep stories"`
- Worker 3: `git commit -m "feat: ambient audio library and sermon podcast linking"`
- Worker 4: `git commit -m "feat: mood audio integration and premium TTS scaffolding"`
- Final: `git push origin feat/audio-layer`
- Merge PR → main → Vercel deploys

---

## FUTURE PREMIUM UPGRADES (Phase 4+)
- **ElevenLabs TTS** — Natural human voice (~$5/mo cost, $4.99/mo to user)
- **Bible.is API direct** — In-app audio Bible player (no link-out)
- **Original recordings** — Hire voice talent for premium meditations
- **Spotify Connect** — Worship integration for premium users
- **Offline audio download** — PWA service worker caches meditations
- **Daily Audio Devotional** — AI-generated daily 5-min audio (Claude + ElevenLabs)
