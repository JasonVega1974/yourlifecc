> **⚠️ STALE / UNDERSTATED (as of 2026-07-10).** The install steps below (add to DEF, add script tags, wire the child-home entry) are **already done** — `life-path.js` + `data/life-stations-data.js` are wired, `lifePath:{}` is in DEF (`data.js:175`), and a live Command Center doorway (`ccOpenClimb`, commit `39344d0`) exists. My Climb is **PARTIAL**, not a pending dark-launch: fully built but reachable only behind `ylcc_entry_gate` (default OFF), and 9/12 weekly quests can't progress. See **`STATUS_RECONCILED_2026-07-10.md`** for the verified state. This doc is kept for its design/content rationale only.

# My Climb — Road to Adulthood · Integration Guide (L1 + L2)

The main-app sibling of "My Walk with God": a 13-station journey to
adulthood in 4 chapters (Base Camp → The Ascent → High Country → The
Summit Push), climbing toward **the North Star** — the never-completable
horizon (adulthood is a way of walking, not a finish line). Cyan accent
throughout; gold remains exclusively the Well's.

**See it first:** open `climb-preview.html` in a browser. Fully
interactive, demo state (3 Base Camp steps done), nothing wired to real
data.

## Files

| File | Goes to | What it is |
|---|---|---|
| `life-stations-data.js` | `app/js/data/life-stations-data.js` | Pure data: 4 chapters, 13 stations (full written content), North Star horizon, 12-quest pool |
| `life-path.js` | `app/js/life-path.js` | Renderer + state engine — a deliberate FORK of walk-path.js (the faith engine stays untouched/protected). All juice calls typeof-guarded |
| `climb-preview.html` | anywhere (optional) | Standalone demo |

## Install (Claude Code) — same dark-launch sequence as the walk

1. **DEF**: in `app/js/data.js`, add
   ```js
   lifePath: {},  // L1 My Climb (road to adulthood) — completed stations, timestamped reflections, weekly quest state (life-path.js)
   ```
2. **Script tags** in `app/index.html` (defer, matching the block):
   `life-stations-data.js` in the data group; `life-path.js` in the app
   module group (it needs `showSection` — load after `ui.js`; before
   `init.js` is safest). Guardian after the edit.
3. **SW**: check the actual CACHE_NAME and bump; precache both files.
4. **Dark launch** — nothing renders until `renderLifePath('lifePathWrap')`
   is called. Wire the child-home entry (the featured card / section on the
   new card home) as a follow-up commit.

## Differences from the walk engine (intentional)

- **State**: `D.lifePath`. Reflections are `{text, ts}` — timestamped from
  day one (the walk's retrofit lesson).
- **Tools route via `showSection(route)`** (main-app pattern), with a
  stage-filter guard: if `D.sections[key] === 0` for the user's bracket,
  the tool button toasts gently instead of opening a hidden section —
  consistent with the allowlist-vs-tiles reconcile in HOME_UPGRADE_PLAN §S2.
- **Template swaps**: verses → "Trail markers" (original principle lines —
  scripture lives in the Well); prayer → "Say it like you mean it" charge;
  "You're not alone" → "Ask someone who's done it" (mentor/parent
  connection every station).
- **Celebrations**: +50 XP per station; chapter completion gets an extra
  beat ("🏕️ Chapter complete"); Launch (station 13) gets the double sky;
  all-13 fires the North Star finale.
- **Quest metrics** (`habit, chore, school, health, goal, skill, money,
  journal, station, reflect, visit, domains`) are named to match the
  existing xp.js completion events — the Session-1 juice-parity wrapper
  module should bump `lifeQuestBump(metric)` at the same wrap points where
  it awards XP, one wrapper layer serving both systems.

## Content note

Station content is written for 12–22, values-forward but not scriptural
(the Well owns scripture). A 12-year-old naturally lives in Base Camp —
the structure itself communicates "you're early on the climb, and that's
right." Driving/credit stations include the transit / parent-required
alternatives so younger brackets are never stuck.
