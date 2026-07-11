# Dig Mode + Expedition Passport — Biblical Archaeology

**STATUS: PLANNED — spec of record, 2026-07-10.**

_Status transitions to SHIPPED (with commit hash) per build as each lands:_
- _Build 1 — Dig Mode: **SHIPPED** `c57c45c` (2026-07-10, SW v522). Smoke: 21/21 headless-Chrome assertions._
- _Build 2 — Expedition Passport: **SHIPPED** `22fdc29` (2026-07-10, SW v523). Smoke: 27/27 headless-Chrome assertions (incl. no-orphans, caesarea guard, region badges, all-32 master, certificate render)._

**Both builds SHIPPED. Feature complete.**

Ground truth at spec time: `STATUS_RECONCILED_2026-07-10.md` — both features PLANNED, zero code. Phase 0 recon (`docs/MAINAPP_PHASE0_AUDIT.md`) is the source of truth. All decisions below are final; do not re-litigate.

---

## ARCHITECTURE (settled)

- **Direction A:** discoveries stay a grid (`#bwDiscGrid`) + modal (`#bwDiscoveryModal`). No carousel, no deck, no level gate (none exists). Flow is buried → excavated only.
- **One data store:** `D.faithBibleWorld`. Add sub-keys:
  - `excavated:{}` (`{discoveryId:{ts}}`)
  - `regionBadges:{}` (`{regionId:{ts}}`)
  - Sites-visited reads the EXISTING `D.faithBibleWorld.sites` (written by `_bwMarkVisited`). Do NOT create `archPassport`/`archExcavated`/`archBadges` keys.
- **New module `app/js/bible-world-dig.js`** — do not grow `faith.js`. `index.html` gets only the modal/view markup + `<script>` tag.
- **sfx.stamp:** new synthesized short low-freq thud in `sfx.js` (oscillator, no asset). Used for excavation AND passport stamps.

## BUILD 1 — DIG MODE (commit 1)

- Buried grid cards: CSS sediment gradient overlay, title hidden, "🔍 UNDISCOVERED" muted text.
- Tap buried card → modal opens in Dig Mode: canvas scratch, 3-layer reveal at 40% (year/location), 70% (artifact icon), 95% (full unlock). Throttled `getImageData` alpha sampling (~150ms), touch handlers `{passive:false}` + `preventDefault` on canvas only.
- On excavate: `D.faithBibleWorld.excavated[id]={ts}`, `sfx.stamp`, gold "EXCAVATED" stamp (Oswald, rotated 8°) on grid card + "Excavated [date]".
- Certainty badge colors in Dig Mode: confirmed `#f5c842`, consistent `#f59e0b`, contested `#94a3b8`. Align list cards too.
- One-time coach mark in modal on first buried card: "Scratch to dig" → set a `hintSeen` flag in `D.faithBibleWorld` on first scratch.
- Reduced motion (`matchMedia prefers-reduced-motion`): tap-tap-tap instant layer reveals, same celebration/stamp.
- Excavated cards open modal directly, no re-scratch.
- Win register: gold pulse (faith register), NOT cyan.

## BUILD 2 — EXPEDITION PASSPORT (commit 2)

- "📔 My Passport" entry in archaeology header, opens as 4th bw view (`bwSetView('passport')`), scrollable.
- Navy `#0a1628`, gold Oswald eyebrow "EXPEDITION PASSPORT", Newsreader italic sub "Every site you visit leaves its mark."
- 32 stamp slots, 4-col grid, grouped under 5 approved regions:
  - **JERUSALEM (7):** jerusalem, temple-mount, garden-tomb, mount-of-olives, gethsemane, pool-of-bethesda, pool-of-siloam
  - **JUDEA & THE WILDERNESS (9):** bethlehem, jericho, bethel, hebron, shechem, shiloh, qumran, masada, jordan-river
  - **GALILEE & THE NORTH (7):** nazareth, capernaum, sea-of-galilee, caesarea-philippi, mt-carmel, megiddo, tel-dan
  - **SINAI, EXILE & THE NEAR EAST (4):** mt-sinai, babylon, damascus, antioch
  - **THE APOSTOLIC WORLD (5):** ephesus, corinth, athens, patmos, rome
- Visited = `D.faithBibleWorld.sites[siteId]` truthy. Unvisited: dashed gold circle, muted name. Visited: gold ring stamp, era fill, site initial, ±5° rotation seeded from siteId, ink-bleed shadow, gold name.
- Stamp animation: `scale(0)→1.2→1` over 300ms + `sfx.stamp`. Reduced motion: instant.
- Site-visit toast: "📔 Stamped! N of 32 sites" (2s).
- Auto-stamp: on excavation, for each `relatedSiteId` not yet in `sites{}`, write it + toast "📔 [Site] stamped from your discovery!"
- Region complete → `D.faithBibleWorld.regionBadges[regionId]={ts}`, gold medal badge above group, win-lite (GOLD pulse + chime).
- All 32 → Master Archaeologist page: gold seal, date, canvas-rendered shareable certificate (night-navy `#0a1628`, gold seal — build fresh, no Academy diploma renderer exists).
- Progress header: "N of 32 sites visited · N discoveries excavated", numbers animate up.

## PIPELINE (both builds)

- Pre-build UX critique (scratch touch handling, 32 slots at 375px, stamp timing) — brief, then build.
- PAUSE after Build 1 for review before starting Build 2.
- Smoke: all 20 discoveries start unexcavated; layer reveals at 40/70/95; excavated persists across reload; passport counts correct; region completion fires; all 32 sites mapped (no orphans); auto-stamp-from-excavation regression; reduced-motion instant reveals.
- Post-build UX review. `node --check` all touched JS. Guardian after index.html edits. SW bump FROM ACTUAL version (verify first — reconciliation confirmed v521). Push after each commit.
- After each build lands: update the spec doc's status line and `STATUS_RECONCILED_2026-07-10.md` (move the feature from PLANNED to SHIPPED with the commit hash).

## REPORT

Spec doc committed, UX critique findings, both builds complete, smoke results, which sound shipped for stamps.
