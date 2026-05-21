# OpenAI TTS Audio Pre-Render

Generates MP3 files for all Audio Meditation segments and Sleep Story verses using OpenAI's TTS API. Pre-rendered audio plays via `new Audio()` instead of Web Speech API — consistent, high-quality voice across all browsers and devices.

## Prerequisites

- Node.js 18+
- OpenAI API key with TTS access

## Usage

```bash
# 1. Dry run — count characters and estimate cost, no API calls
DRY_RUN=1 node scripts/audio-rendering/render-audio.js

# 2. Full render (generates MP3s)
OPENAI_API_KEY=sk-... node scripts/audio-rendering/render-audio.js

# 3. Custom voice (nova/shimmer/echo/alloy/onyx/fable)
OPENAI_API_KEY=sk-... TTS_VOICE=shimmer node scripts/audio-rendering/render-audio.js
```

## Output

Files are saved to `scripts/audio-rendering/output/` with the naming convention:

- **Meditations:** `{meditation_id}_seg{N}.mp3` (e.g. `med-morning_seg0.mp3`)
- **Sleep Stories:** `{story_id}_verse{N}.mp3` (e.g. `sleep-psalm23_verse0.mp3`)

The script skips files that already exist, so it is safe to re-run after failures.

## Estimated Cost

- **Model:** `tts-1` at $15 / 1M characters
- **Expected total:** ~2,500 characters across 14 sessions (~80 segments)
- **Estimated cost:** ~$0.04 for the full library

Run with `DRY_RUN=1` first to see the exact character count before spending credits.

## Wiring into the app

After rendering, copy the MP3 files to `app/audio/` (create if needed) and add `audioUrl` fields to the segment data in `app/js/data/audio-content.js`:

```js
segments: [
  {
    duration: 30,
    type: 'opening',
    text: 'Take three slow breaths...',
    audioUrl: '/audio/med-morning_seg0.mp3'   // ← add this
  },
  ...
]
```

For Sleep Stories, add a `segmentAudioUrls` array parallel to the verses/content:

```js
{
  id: 'sleep-psalm23',
  verses: ['The Lord is my shepherd...', ...],
  segmentAudioUrls: [
    '/audio/sleep-psalm23_verse0.mp3',
    ...
  ]
}
```

The playback code in `faith.js` (`_medPlaySegment` and `_ssPlaySegment`) already checks for these fields and falls back to Web Speech if they are absent.

## Voice Recommendations

| Voice | Character | Best for |
|-------|-----------|----------|
| `nova` | Warm, clear female | Meditations, sleep stories |
| `shimmer` | Gentle, soft female | Bedtime/sleep content |
| `echo` | Natural male | Variety / alternate voice |
| `alloy` | Neutral, versatile | Study content |
