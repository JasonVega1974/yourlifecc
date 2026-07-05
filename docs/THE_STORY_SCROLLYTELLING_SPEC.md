# THE STORY — Who Is Jesus, Scrollytelling Rebuild
## Wave 2 §1a, elaborated (supersedes the two-line spec entry)

**Date:** July 5, 2026
**Target:** the JESUS_DATA study content (the "just text" layer below the Meet Jesus experiential layer)
**House rules honored:** no imagery (text + scene treatments are the vocabulary — codified in design-system.md), wine register structural-only, settle-first completion.

---

## The Big Idea: the page moves from night to dawn

The life of Jesus has a built-in emotional and theological arc — and the page should *be* that arc. As the reader scrolls through seven chapters, the ambient scene behind the content shifts:

| Chapter | Scene (CSS gradient ambience, no imagery) |
|---|---|
| 1 · **Born** | Deep night blues, a thin star field — the shepherds' sky |
| 2 · **Hidden Years** | Night easing to pre-dawn indigo — quiet, waiting |
| 3 · **The River** | Cool water blues-greens, light entering from above — baptism |
| 4 · **The Wilderness** | Dry ochre/umber dusk, sparse — forty days |
| 5 · **The Ministry** | Warm daylight golds — the three years of light |
| 6 · **The Cross** | Progressive darkening as the reader scrolls the section, reaching near-black at the death — *"from the sixth hour there was darkness over all the land" (Mt 27:45)*. The one scripturally-mandated piece of ambience in the app. |
| 7 · **Risen** | Dawn breaks — the darkest point cuts to first light, warm gold flooding up from the bottom edge. The only place in the app light floods in. |

Mechanically: one fixed scene layer behind the content; chapter boundaries observed via IntersectionObserver; background transitions over ~1.2s as chapters enter. Scene colors are hardcoded (scene-lite precedent from the Meet Jesus hero — same treatment in both themes; content cards remain interface-layer and theme-adapt). Reduced motion: scenes still colored per chapter, but switch instantly; beat reveals render immediately.

## Structure

### The rail
A slim chapter rail (top on mobile, left on ≥720px): seven dots with labels, current chapter glowing, tap to jump. Progress persists (`D.jesusStory = {read:{}, lastCh:n}`) — returning readers resume at their chapter, same idiom as the Red Letters reader's D.jwIdx.

### The beats
Each chapter's existing JESUS_DATA prose is broken into short beats — 2–3 sentence cards that fade up on scroll (IntersectionObserver, stagger 80ms, the established `.hc-vw`-family reveal register). No walls of text; the reader is always one beat from done.

### The prophecy seals
Where the data has `propheciesFulfilled`, render gold wax-seal chips inline at the relevant beat: "📜 Micah 5:2 → fulfilled." Tap → the seal expands in place to show prophecy line + fulfillment ref + one sentence; a "See the evidence →" door routes to the matching Proof & Prophecy entry where one exists (typeof-guarded, Phase 0 maps the refs to proof ids).

### The Titles Constellation (the beautiful part)
The 10 `keyTitles` (Messiah, Son of God, Son of Man, Kyrios, Savior, Logos, Lamb of God, High Priest, King of Kings, Alpha & Omega) stop being a list. They become a small interactive night-sky constellation at the chapter-7 close ("Risen — so who is he?"): ten stars positioned in a loose crown arrangement, each labeled. Tap a star → it brightens and a card slides up with the title, meaning, and the Greek/Hebrew with Strong's key from the existing data. Visited stars stay lit. All ten lit = the constellation draws its connecting lines (the star-kit line idiom from the parent celestial home) and a single settle line appears: *"Every title, one person."*
- Reuses `ckBuildStar` / the shared star kit if available (typeof-guarded; plain SVG circles as fallback).
- This is the app's night-sky visual language doing theological work.

### Chapter completion + the whole story
- A chapter is read when its last beat has been seen (observer) — dot fills on the rail.
- All 7 read → a quiet full-story moment: the rail's dots connect into a single line, one card: "You know His story now." + doors to In His Own Words, the Walk (accepted station), and Proof & Prophecy. Settle register — a story received is not a quiz won. (The 'reflect' quest metric may bump once via the persisted throttle; no XP fanfare.)

### What stays
- The Meet Jesus layer above (hero, Red Letters, Honest Questions) — untouched.
- "Read as one page" escape link for study use (the current article view, restyled header only — this also discharges the filed FOLLOW-UP about the purple-gradient study-card header clashing: restyle it into the wine/gold register as part of this increment).
- JESUS_DATA untouched as the content source; the scrollytelling reads it. Any beat-splitting is a render-time transform, not a data rewrite (Phase 0 decides: if render-time splitting produces awkward beats, a thin `jesus-story-beats.js` index mapping section → beat boundaries is acceptable — index only, no content duplication).

## Ambience details (taste rules)
- Scene transitions are slow and subtle (1.2s ease); the reader should feel the light change before noticing it.
- The Cross darkening is scroll-linked within the section (background-color interpolation on scroll position), floor at #050508 — content cards keep a solid plate so text contrast never drops below AA.
- The Risen dawn-break is the single most animated moment: a 2s bottom-up warm gradient sweep the first time the chapter enters (once per session; reduced-motion = instant dawn state).
- No parallax, no scroll-jacking — native scroll only, ever.

## Pipeline
Standard: Phase 0 fan-out (JESUS_DATA section→beat mapping, prophecy→proof id mapping, star-kit availability, current #bf-jesus render path) → pre-build UX critique (beat lengths, the Cross darkening taste check, constellation tap targets) → build → smoke (rail resume regression, seal mapping assertion, all-seven completion, constellation visited-state persistence, reduced-motion) → post-build review → guardian (CSS in index.html) → SW bump from actual.

Est: 7h — the largest single increment yet, and the showpiece.
