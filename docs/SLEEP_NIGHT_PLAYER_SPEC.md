# Sleep Stories — Night Player + Sleep Timer (Wave 2 §4a + §4b)

**Shipped 2026-07-05.** Durable record of the increment's contract (the
Wave 2 spec doc was never committed; this replaces chat-only history).

## §4a Night Player
- Full-screen scene-dark overlay `#sleepStoryOverlay.np-overlay` —
  hardcoded night hex (`#04040c → #010107`), the app's darkest surface,
  scene-layer theme exemption (documented in design-system.md).
- 36-star slow twinkle (bp-star idiom, dimmer ceiling `.4`); reduced
  motion = static `.18`.
- Story title, one large soft play/pause ring (84px), thin
  time-proportional progress line. **Segment dots were rejected in
  pre-build review**: the catalog's segment spread is 1–11 (two stories
  have exactly one segment) — dots would render a meaningless single
  dot and pull toward an achievement register.
- **Auto-dim**: 20s untouched → chrome fades to 12%, the play ring to
  35% (two tiers — documented §8 exception). First tap on a dimmed
  player ONLY restores brightness and swallows the event; a second,
  deliberate tap acts. No backdrop-tap-to-close (✕ / Stop / Esc only).
- **Media Session**: title + artist + icon-192 artwork + play/pause
  handlers, typeof-guarded.
- **Wake lock** while playing, re-acquired on `visibilitychange`
  (segment advance is a JS chain browsers throttle in background —
  screen-off playback needs single stitched story files, logged as the
  follow-up that would retire the wake lock).
- **Ambience is opt-in** (default OFF, design-system §6): the YouTube
  iframe bed exists only on explicit tap — it cannot be volume-ramped
  or Media-Session'd. Follow-up: local ambient loop mp3s retire it.

## §4b Sleep Timer + Fade
- Chips: **Full story (default — fewest decisions at 10pm)** · 10m ·
  20m · 30m · 45m. 44px tap targets.
- Countdown: "fades in ~N min", minutes only, low-opacity, in the dim
  bar, NOT aria-live.
- At expiry: one fade routine ramps EVERY active source (segment MP3 +
  TTS fallback volume) over 30s on 150ms ticks with an equal-power
  cos² curve; a pure-black cover layer (`.np-fadecover`) ramps IN on
  the same window so the screen resolves to BLACK, never to transparent
  (fading the overlay's own opacity would reveal the app behind it —
  bright in light mode; the post-build review BLOCKING fix).
- A timer-chip tap during the fade CANCELS it — volume and the cover
  restore, playback resumes ("wait, not yet").
- Legacy `fadeOutAt` auto-fade is superseded by the explicit timer;
  `repeatCount` now decrements (legacy looped Psalm 23 forever).

## Completion register
- Natural end → one `sfx.settle()` bell. Timer kill → **silent** (the
  listener may be asleep). Manual close → silent.
- **No XP, no streak, no confetti — rest is not a performance.**
- Log: `D.sleepStoryLog` (DEF) — `{storyId, ts, completed, end:
  'natural'|'timer'|'manual', duration}` capped 30. Named distinctly
  from Health's `D.sleepLog` (bed/wake hours — collision found in
  Phase 0; do not merge).

## Deferred (follow-up increments)
- §4c Tonight Ritual builder, §4d Morning After.
- Local ambient loop files (retires the YouTube iframe + enables
  ambience in the fade).
- Single stitched mp3 per story → true lock-screen/background playback
  → wake lock removable.
