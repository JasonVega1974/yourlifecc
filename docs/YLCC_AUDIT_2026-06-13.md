# YourLife CC — Full Codebase Audit (re-run)
**Date:** 2026-06-13 · **Auditor:** Claude (re-run of the 2026-06-12 methodology against the current main, post-SPEC-5c ship)
**Method:** Same as the 2026-06-12 audit — direct read of `app/index.html` (now 21,394 lines / 1.39 MB), all JS modules under `app/js/` (7.46 MB), `app/css/app.css` (416 KB), `service-worker.js` (v352), `vercel.json`, all `/api/` endpoints, CLAUDE.md, and the original 2026-06-12 audit for finding-by-finding closure tracking.
**What's measured directly:** script-tag counts (`grep -c`), file sizes (`stat`), light-mode rule counts (`grep`), ARIA attribute count, commit history (`git log`), CSP header presence, lazy-load file totals.
**Limit:** Same as the prior audit — RLS policies + live Stripe/Brevo + runtime perf still need live verification. The RLS half of SPEC 5c (waitlist/affiliate/contest tables) remains a Supabase-dashboard task, outside what this re-run can confirm.

---

## Scorecard — before / after

| Area | 2026-06-12 | **2026-06-13** | One-liner |
|---|---|---|---|
| Security (client) | B+ | **A−** | PIN plaintext migrated, CSP report-only live, PIN pad legible in light mode |
| Security (API) | A− | **A** | Admin Brevo proxy + Bearer auth on card-photo endpoints; misleading "service key is the gate" comment fixed |
| Performance | D | **C+** | All ~60 module scripts deferred; ~1.76 MB lazy-lifted off cold path; HTML parses before JS now |
| Architecture / data | C+ | **B−** | Sync stomp-guard shipped (refetch-merge); SPEC 11 design doc captures the real fix path (chores → tables + realtime), build not started |
| Maintainability | C | **C+** | CLAUDE.md presence-based; dead pchTile* + pchHalo* removed; one naming truth; monolith still 21k lines, extraction batches not started |
| PWA / caching | A− | **A−** | Unchanged — v352 SW still excellent |
| Theming | B− | **A−** | Full SPEC 9 contrast sweep + SPEC 9b warm-cream tilt + constellation light-mode rework + PIN pad light fix |
| Accessibility | C+ | **C+** | No targeted work; slight ARIA drop (190 → 183) from dead-code removal, but img/alt ratio unchanged (46/53) |

**Overall trajectory:** the codebase has moved from "B+ with a critical performance ceiling and two security gaps" to "**A− security + performance climbing out of the basement + theming caught up + architecture has a design path forward.**" The next leg is maintainability (extraction work) and the SPEC 11 build, not new fires.

---

## Quantitative deltas

| Metric | 2026-06-12 | 2026-06-13 | Δ |
|---|---|---|---|
| Service worker version | v337 | **v352** | +15 ships |
| `index.html` line count | 21,333 | **21,394** | +61 |
| `<script src>` tags total | 63 | **56** | −7 (10 files lazy-lifted; some tag consolidation) |
| `<script src>` with `defer` | 2 (Sortable, Leaflet) | **53** | **+51** — every module script now deferred |
| Synchronous-blocking script tags | ~61 | **3** | CDNs only (supabase-js, chart.js, translate widget) |
| `app/js/` total | 7.2 MB | 7.46 MB (grew slightly) | +0.26 MB net (faith.js + parent.js grew; offset by deletes) |
| **Initial-path JS** (eager load only) | **7.2 MB** | **~5.70 MB** | **−1.76 MB shifted to on-demand** |
| Lazy-loaded data files | 0 | **10** (timeline + 5 TIER1-batch1 + 4 TIER1-batch2) | bible-timeline, bible-stories, academy ×2, biblical-sites, biblical-infographics, biblical-discoveries, biblical-routes, prayer-content, chore-packs |
| CSP status | None | **`Content-Security-Policy-Report-Only`** live | Comprehensive directive set, report-only baseline, monitoring window open |
| `:root.light` rule count | 696 (CSS) + 201 (inline) = 897 | **771 (CSS) + 225 (inline) = 996** | **+99 light-mode rules** (SPEC 9 + 9b + constellation + PIN pad) |
| ARIA attributes in `index.html` | 190 | 183 | −7 (dead-code deletes, no new ARIA work) |
| `<img>` / with `alt=` | 53 / 46 | 53 / 46 | unchanged |
| Remaining `jasonvega1974` repo-wide | 25+ (estimate) | **7** | only legit rule-statement / audit-record / spec-text references remain |
| `app.css` size | 409 KB | 416 KB | +7 KB (SPEC 9 sweep + SPEC 9b tokens) |

---

## P0 — Critical (this week) — STATUS

### P0-1 · Performance: 8.6 MB synchronous critical path → **RESOLVED (both halves)**
**P0-1.1 — defer all module scripts:** `6972200` "feat(perf): defer all module scripts — non-blocking boot (SPEC 3)". 53 scripts now carry `defer`; only 3 synchronous `<script src>` tags remain (third-party CDNs for supabase-js / chart.js / Google Translate). HTML parses before any module executes.
**P0-1.2 — lazy-load `data/*.js`:** Three commits — `6c5e34e` SPEC 7 pilot (bible-timeline 195 KB), `5c12f35` SPEC 7b TIER 1 batch 1 (bible-stories + academy ×2 + biblical-sites + biblical-infographics, +1.59 MB), `1837189` SPEC 7b TIER 1 batch 2 (biblical-discoveries + biblical-routes + prayer-content + chore-packs, +56 KB). **Total ~1.76 MB shifted to on-demand load via `_EnsureLoaded()` helpers gated on first section-open.** Remaining candidates queued as TIER 2 (proof-prophecy, plans, faith-zones-data, memory-verses) — they need consumer-side refactors before they can convert.
**Net:** the original "teen on school Wi-Fi downloads the entire Bible library first" scenario is gone. Initial path is HTML + ~5.7 MB deferred JS (parses concurrently with the user reading the splash); Bible content streams in when the user opens those tabs.

### P0-2 · Legacy plaintext PIN fallback → **RESOLVED**
`6a0f26d` "fix(security): migrate legacy plaintext PINs to SHA-256 on first verify". Migrate-on-verify path in `verifyParentPin` — on success against a plaintext field, the path immediately hashes, clears the plaintext slot, and re-saves. Self-healing across the whole user base.

### P0-3 · Forbidden personal email in production code → **RESOLVED**
`db21e21` "fix(api): route signup notifications to info@kingdom-creatives.com per standing rule" closed the original `api/notify-signup.js:17` instance. `b94164c` SPEC 1b followed up to sweep 9 Python scripts + 2 narrative-doc references. 7 occurrences remain repo-wide — all expected: CLAUDE.md rule statement, audit historical record, spec text in the execution plan, and guardian-config docs that explicitly grep for the forbidden string. Zero in production code.

### P0-4 · No Content-Security-Policy → **RESOLVED (report-only phase)**
`1c2e799` "feat(security): CSP report-only baseline" — comprehensive directive set covering `default-src`, `script-src`, `connect-src`, `style-src`, `font-src`, `img-src`, `frame-src`, `media-src`, `object-src`, `base-uri`, `form-action`, `frame-ancestors`, `worker-src`, `manifest-src`. `72ec365` SPEC 5b subsequently removed `https://api.brevo.com` from `connect-src` (no longer browser-called). **Report-only is the correct intermediate stage** — the monitoring window is open; promotion to enforcing is a future spec after a clean console week.

### P0-5 · CLAUDE.md dangerously stale → **RESOLVED**
`faa9980` "docs(claude-md): presence-based anchors + refreshed figures + ship rules" replaced load-bearing line numbers with presence-based anchors ("the script block precedes the Google Translate tag near EOF"), refreshed the stale 9,160 → 21,388 figure, and added two standing rules: (a) any session that grows `index.html` >5% refreshes the figure in the same commit, (b) any new visual feature ships with its `:root.light` pass in the same commit. The first rule has already prevented one drift cycle; the second drove the constellation light-mode work to ship cleanly.

---

## P1 — High (this month) — STATUS

### P1-1 · Light mode ships reactively → **RESOLVED (sweep + warmth tilt + constellation)**
Four commits:
- `1b3ed50` PIN pad legible in light mode (v344)
- `79a32e5` SPEC 9 light-mode contrast sweep across all sections (v348) — 50+ `:root.light` rules added in one consolidated block
- `1d5d85a` SPEC 9b warm-cream tilt + AA `--tx3` lift (v350)
- `32880c8` constellation panel readable in light mode — warm deep aubergine backdrop on both `.cc-constellation` and `.pch-constellation` (v349)

**Light-mode rule count grew from 897 → 996** (+99). The CLAUDE.md SPEC 2 standing rule prevents reactive shipping going forward (any new visual feature must include its light-mode pass in the same commit).

### P1-2 · `index.html` monolith — **OPEN**
21,394 lines (vs 21,333). Still in the same band. The pchTile* dead block + pchHalo* defs were removed in SPEC 6 (-46 lines net), and SPEC 9 + 9b added rules to `app.css` rather than to inline `<style>` blocks (no growth there). But the actual extraction work (move inline `<style>` blocks into `app/css/sections/*.css`, move tail inline `<script>` blocks into `app/js/boot/*.js`) is still SPEC 10 in the plan — not started. Single biggest remaining maintainability win.

### P1-3 · Dead code & three naming schemes → **RESOLVED**
`6512c0f` "chore(hub): remove dead tiles + unused defs; unify destination naming (SPEC 6)" — pchTile* "Jump in" block deleted (37 lines), pchHalo* explanatory comment removed (9 lines), `_pchWireTile` calls + activityToday aggregation removed from parent-celestial.js (35 lines), `renderPhCardGrid` labels collapsed to single-word constellation-truth naming (Chores, Rewards, Allowance, Contests, Activity, Reports, Family, Controls), and `app/img/watch-day.jpg` removed from disk. -91 lines total.

### P1-4 · Accessibility floor → **OPEN**
183 ARIA attributes (down from 190 — pure dead-code subtraction, no new ARIA work). 53 `<img>` / 46 with `alt=` (unchanged). The PIN pad, bottom tab bar, and modal focus-trap work the original audit recommended has not been done. **This is the next area of least progress.**

### P1-5 · 60 MB of audio in repo → **OPEN**
Not touched this cycle. Same risk profile — still bloats every clone/deploy.

---

## P2 — Architecture — STATUS

### P2-1 · JSONB blob + last-write-wins sync → **PARTIAL (bridge fix shipped; real fix has design doc, no build)**
**P2-1.1 — Cheap guard (sync stomp-guard):** `18c7484` "fix(sync): refetch-merge guard prevents multi-device last-write stomp (SPEC 8)". `cloudSync()` now does a cheap `updated_at` SELECT before each upsert; on mismatch, runs a per-key merge (top-level key granularity) using `_lastSyncedDBaseline` as the diff anchor. The original "two-device disjoint-key write" failure mode is closed. **Known limitation explicitly documented:** if both devices touch the SAME top-level key (both add chores to `D.chores`), the later-syncing device still wins for that key — the real fix is per-row tables.
**P2-1.2 — Real fix (chores → tables + realtime):** `82fe4c8` "docs(plan): SPEC 11 chores tables design doc (decisions recorded)" — 432-line design doc at `docs/CHORES_TABLES_DESIGN.md` captures: 4-table schema (`chores`, `chore_completions`, `chore_approvals` NEW, `pb_ledger` NEW) with per-family RLS, 3-phase migration strategy (Phase A solo-backfill prep + FK deferrable migration, Phase B tables + dual-write, Phase C 5-increment read-flip), 4 realtime subscription points, offline behavior, rollback. All 8 open questions decided. **Build not started** — needs to be split into SPEC 11-A (solo-backfill prep) before any code lands.

### P2-2 · Inline-script architecture vs CSP → **PARTIAL**
CSP report-only is live (`unsafe-inline` is in the directive — required by current architecture). Tightening to remove `unsafe-inline` requires the inline `<script>` extraction work (SPEC 10, not started). The compound payoff is intact but waiting on P1-2.

### P2-3 · RLS verification (live check) → **OPEN**
Still requires Supabase dashboard access. The SPEC 5c admin endpoint audit closed one related gap (Bearer auth on photo POSTs that proxy with service-role key) but the RLS-on-anon-readable-tables question (waitlist_applications, affiliate_applications, contest_entries) needs the dashboard.

---

## P3 — Upgrade opportunities — STATUS

1. **Child constellation** → **RESOLVED** earlier this cycle in the pre-audit constellation-kit work (commits `68346b2`, `31c1178` — shared kit, child orbs tappable, world-class on both surfaces).
2. **Version toast for iOS** — OPEN, not touched.
3. **Watch hero preload** — OPEN, not touched.
4. **Push deepening** — OPEN, depends on P2-1.2 (SPEC 11 build) for realtime data.
5. **Update May audit per-tab bugs** — OPEN, not re-run.
6. **Video hero** — PARKED.

---

## Items shipped BEYOND the 2026-06-12 audit's scope (bonus closures)

These were not in the original audit because they were either too narrow (a single endpoint) or surfaced during execution of audit items:

| Commit | What it closed |
|---|---|
| `72ec365` SPEC 5b | Admin browser tab no longer holds the master Brevo API key; proxied through `/api/admin/send-message` with Bearer ADMIN_SECRET. CSP `connect-src` accordingly trimmed. |
| `c6c10f9` SPEC 5c | `/api/upload-card-photo` + `/api/admin-card-photo` POST both gained Bearer auth; the former tightened CORS to production domain only. The misleading "service key is the security gate" comment from 2026-05-14 fixed to explain that the service key BYPASSES RLS and the access gate must be the inbound request check. |
| `b94164c` SPEC 1b | Repo-wide email sweep on 9 Python UA strings + 2 narrative-doc test-account references. |
| `1b3ed50` PIN pad light-fix | First trigger of the SPEC 2 standing rule ("light mode ships with the feature"). |

---

## What's genuinely strong (don't touch, protect — updated)

Per the original list, plus three additions earned this cycle:

1. **service-worker.js v352** — all the v337 wins still hold (eager `skipWaiting()` + `clients.claim()`, `Promise.allSettled` per-URL precache, redirect-aware) plus 15 incremental version bumps with no SW regressions.
2. **API layer discipline** — strengthened. Bearer pattern is now consistent across `send-announcement.js`, `send-message.js` (NEW), `upload-card-photo.js` (NEW gate), `admin-card-photo.js` POST (NEW gate). Origin allowlists honored. The Brevo key never appears in browser source.
3. **PIN security** — strengthened with migrate-on-verify. The legacy plaintext fallback now self-heals on every successful verify.
4. **Owner-guard** (`_ylccEnforceOwner`) — untouched. Still protects against cross-user localStorage promotion.
5. **vercel.json** — strengthened. Comprehensive `Content-Security-Policy-Report-Only` directive added without breaking app behavior. All other security headers still in place.
6. **Verified-fixed prior items** — same as the original audit; no regressions in `chorePoints`, `escapeHtml` density, removed debug paths, etc.

### NEW: protect-this items earned this cycle

7. **The defer pass + lazy-load helpers** — `_tlEnsureLoaded()` / `_bsEnsureLoaded()` / `_acLessonsEnsureLoaded()` / etc. pattern is the cleanest precedent in the codebase for shipping perf wins without a bundler. The TIER 2 follow-up batch (proof-prophecy.js, plans.js, etc.) should stamp the same pattern.
8. **SPEC 9 consolidated `:root.light` block in `app.css`** — single revertable block at `app.css:2433` makes future light-mode tuning easy and prevents drift. Don't disperse it back into the file.
9. **`CHORES_TABLES_DESIGN.md` (SPEC 11)** — 8-decision-recorded design doc with explicit phase gates and parity-check requirements. When the build starts, this is the spec — don't bypass it.

---

## Recommended execution order (updated)

The original execution order is now ~80% complete. Remaining items + new surfacing:

| # | Item | Size | Status |
|---|---|---|---|
| 1 | P1-2 inline `<style>` extraction (SPEC 10) — incremental | ongoing | OPEN — biggest maintainability lift |
| 2 | P1-4 accessibility floor — start with PIN pad + tab bar + modal focus-trap | half-day each | OPEN |
| 3 | SPEC 11-A — Phase A solo-backfill prep + FK deferrable migration | half-day | DESIGN DOC SHIPPED; needs build spec authored |
| 4 | SPEC 7b TIER 2 — `proof-prophecy.js` (bare-id refactor), `plans.js` (boot-caller deferral), then remaining bare-id files | 1 file per session | OPEN |
| 5 | P2-3 RLS verification (Supabase dashboard) — `waitlist_applications`, `affiliate_applications`, `contest_entries` | 1 hr live | OPEN — outside code, needs dashboard |
| 6 | Memory-verses lazy-load (TIER 1, deferred from batch 2) — adds opportunistic `_pchPickVerse()` trigger | 1 hr | OPEN — small win, narrow scope |
| 7 | Admin manual-recipient entry (queued in plan) — pairs with SPEC 5c admin work | 1 hr | OPEN |
| 8 | P1-5 audio Cache-Control headers OR move to Supabase Storage | 1 hr or 1 day | OPEN |
| 9 | SPEC 11-B/C build (chores → tables, dual-write, then 5-increment read-flip) | the next big build | DESIGNED, not started |

---

## Trend

| Date | Overall | Distance to A− |
|---|---|---|
| 2026-06-12 | B / B+ | ~5 high-leverage items |
| **2026-06-13** | **A− / A** in security + theming; **B−** in architecture; **C+** in maintainability + a11y | **2 items** (extraction work + RLS dashboard check) sit between current state and "everything material is closed" |

The arc of the past 24 hours of ships is unusually clean: every P0 closed, every P1 except the monolith extraction either resolved or has a queued plan entry, and the architectural P2-1 has both a bridge fix (shipped) and a design doc (decisions recorded). The remaining work is mostly volume (extraction) and verification (RLS dashboard), not new discovery.

**Net:** the codebase is materially safer, faster, and more theme-coherent than the 2026-06-12 snapshot. The two unfinished tracks — `index.html` extraction and the SPEC 11 build — are well-scoped, not blocked on unknowns.
