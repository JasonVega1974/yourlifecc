# Performance Baseline (WC-0)

Captured before the world-class-track perf work begins. Fill in the
"Current (baseline)" column from a cold load of the live app, then revisit
after WC-1 ships and fill the "After WC-1" column so the perf win is provable.

## How to capture

Measure a **cold load** of the full-account home (not faith-only, not demo):

1. Open the live app at https://yourlifecc.com/app/ in Chrome.
2. DevTools (F12) -> Network tab -> check **Disable cache** -> hard reload.
3. Read **total JS transferred** from the Network filter (set filter to `JS`,
   read the transferred total in the summary bar at the bottom).
4. Lighthouse tab -> Mode: Navigation, Device: **Mobile**, Categories:
   Performance -> Analyze page load. Record the **Performance score** and the
   **Time to Interactive** (TTI) metric it reports.
5. Run it 3 times, record the median, to smooth out network jitter.

Use the same device profile, network throttling, and account for the
"After WC-1" pass so the two columns are comparable.

## Metrics

| Metric                              | Current (baseline) | After WC-1 | Delta |
|-------------------------------------|--------------------|------------|-------|
| Total JS transferred, first load    |                    |            |       |
| Time to Interactive (TTI), mobile   |                    |            |       |
| Lighthouse Performance score, mobile|                    |            |       |

Capture context (fill in once):

- Date captured:
- Chrome version:
- Network throttling profile (e.g. "Fast 4G" / "No throttling"):
- Account type used (full account / which profile):

## Rollback flags (verified 2026-06-13)

Two one-flag escape hatches let us fall back to the legacy surfaces instantly
if a world-class-track phase looks wrong in production. Both are confirmed
present in the current code. **Behavior unchanged in WC-0 — audit only.**

### 1. The Watch canvas -> `ylcc_classic_phc`

Either signal forces the parent-hub celestial canvas to stay hidden and the
animation loop never to start; the scoped `.pch-classic-mode` CSS restores the
original Phase 4 SVG star field.

- URL: `?ylcc_classic_phc=1`
- localStorage: `localStorage.ylcc_classic_phc = '1'`

Code paths:

- `app/js/parent-watch-scene.js:59` — `_pwsClassicMode()` returns `true` when
  either the URL contains `ylcc_classic_phc=1` (line 63) or
  `localStorage.getItem('ylcc_classic_phc') === '1'` (line 65).
- `app/js/parent-watch-scene.js:1502` — `renderParentWatchScene()` checks
  `_pwsClassicMode()` first: on match it adds `pch-classic-mode` to the host and
  returns early, before the canvas mounts or the RAF loop starts.
- `app/index.html:16317` — documents the `.pch-classic-mode` CSS bypass.

### 2. Command Center home -> `window._ccDisabled`

Setting `window._ccDisabled = true` (e.g. in the console) hides the animated
Command Center home and lets `app-home.js` fall back to the legacy 6-button
`#appHome`, which stays in the DOM for exactly this purpose.

- Console: `window._ccDisabled = true`

Code paths:

- `app/js/app-home.js:141` — `maybeRenderAppHome()` only renders Command Center
  when `... && !window._ccDisabled`; otherwise it hides `#appCommandCenter` and
  shows `#appHome` (the legacy fallback path at line 160+).
- `app/js/command-center.js:390` — `renderCommandCenter()` bails early
  (`root.style.display = 'none'; return;`) when `window._ccDisabled` is set.
- `app/index.html:20329` — notes `#appHome` stays as the `window._ccDisabled`
  rollback surface.
