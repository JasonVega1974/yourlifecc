# YourLife CC — Full Codebase Audit
**Date:** 2026-06-12 · **Auditor:** Claude (Fable 5), full-repo static analysis of uploaded snapshot (SW v337, post-constellation ship)
**Method:** Direct read of `app/index.html` (21,333 lines / 1.39MB), all 60+ JS modules (7.2MB), `app.css` (409KB), `service-worker.js`, `vercel.json`, all 27 `/api` endpoints, both Supabase edge functions, CLAUDE.md, and the 2026-05-22 audit for verification of prior findings.
**Limit:** Static analysis only — RLS policies, live Stripe/Brevo behavior, and runtime perf need live verification.

---

## Scorecard

| Area | Grade | One-liner |
|---|---|---|
| Security (client) | **B+** | PIN hashing real, owner-guard solid; legacy plaintext fallback + no CSP hold it back |
| Security (API) | **A-** | Origin allowlists, bearer-secret admin, HMAC unsub tokens — genuinely well done |
| Performance | **D** | 8.6MB synchronous critical path; the single biggest problem in the codebase |
| Architecture / data | **C+** | Single JSONB blob with last-write-wins sync = multi-device data-loss risk |
| Maintainability | **C** | 21k-line monolith, recurring CLAUDE.md drift, 3 naming schemes, dead code |
| PWA / caching | **A-** | v337 SW is now excellent: eager self-activation, allSettled precache, redirect-aware |
| Theming | **B-** | Dark mode world-class; light mode ships late and reactively (696 vs 201 rules) |
| Accessibility | **C+** | Constellation has proper roles/keyboard; app-wide aria density is thin (190 attrs / 21k lines) |

---

## What's genuinely strong (don't touch, protect)

1. **service-worker.js v337** — eager `skipWaiting()` + `clients.claim()`, `Promise.allSettled` per-URL precache, careful redirect-avoidance comments on `/app`. This week's pain produced a genuinely robust worker.
2. **API layer discipline** — `send-email.js` hardcodes the recipient and documents why; `admin/send-announcement.js` requires `ADMIN_SECRET`/`CRON_SECRET` bearer auth; unsubscribe links are HMAC-signed; origin allowlists on CORS endpoints. No service keys anywhere in client code (anon key only — correct).
3. **PIN security core** — SHA-256 via `crypto.subtle` (auth.js:699), `pinHash` verified first (auth.js:738), plaintext cleared when a new PIN is set (parent.js:162–170), 5-minute sliding idle auto-lock (parent.js:15 — tighter than the 30-min spec). No `_parentDashUnlocked` localStorage cache remains.
4. **Owner-guard** (`_ylccEnforceOwner`) — wipes cross-user localStorage on account mismatch. Protect this.
5. **vercel.json** — HSTS w/ preload, nosniff, XFO, Referrer-Policy, Permissions-Policy, sane `must-revalidate` cache headers, cron schedules, noindex on unsubscribe.
6. **Verified fixed from prior audits:** `chorePoints` schema collision (sanitizer at parent.js:3406 + `.total` accessors throughout) · `?ylcc_hour` debug override stripped from parent-watch-scene.js · sync.js console logs removed · orphaned `firstTimeGate` modal removed · escapeHtml helpers present in parent.js, faith.js, family-feed.js, prayer-focus.js, body-literacy.js.

---

## P0 — Critical (this week)

### P0-1 · Performance: 8.6MB synchronous critical path
**Finding:** 63 `<script src>` tags, only 2 with `defer` (Sortable, Leaflet). 7.2MB of JS — including faith.js (992KB), skills.js (759KB), parent.js (368KB), misc.js (270KB) and ~25 `data/*.js` content files — loads **synchronously, blocking parse**, on every cold start, for every user, before anything renders. Plus the 1.39MB HTML itself. A teen on school Wi-Fi checking chores downloads the entire Bible-study library first.
**Fix (no bundler required — respects the no-build constraint):**
1. Add `defer` to **all** module script tags. `defer` **preserves execution order**, so the config→data→sync→auth→…→init.js order CLAUDE.md mandates is kept intact, while HTML parsing/rendering no longer blocks. This is the single highest-value 30-minute change in the repo.
2. Convert the ~25 `data/*.js` static-content files (biblical-sites, bible-timeline, proof-prophecy, podcasts, etc.) from script tags to **lazy `fetch()` JSON on first section open** (the quick-prayers.json pattern already exists — extend it). Cuts ~2–3MB off the initial path.
3. Add `<link rel="preload">` for app.css, watch-day/night.webp, and the first-paint JS.
**Risk:** Low for (1) — defer keeps order. Medium for (2) — each lazy-loaded dataset needs its consumer to await it; do one file as a pilot (e.g. `biblical-sites.js`) before batching.

### P0-2 · Legacy plaintext PIN fallback still live
**Finding:** `chorePin` / `parentPIN` plaintext fields are still read and honored as fallbacks (parent.js:2371–2396, 1699, 5474; gate check at 125). New PINs hash correctly and setting a PIN clears plaintext — but a family that set a PIN before the hashing pass **still has a plaintext PIN in their Supabase JSONB blob today** and verifies against it forever.
**Fix:** Migrate-on-verify. In the PIN verify path: if verification succeeds against a plaintext field, immediately `pinHash = await hashPin(pin)`, clear `chorePin`/`parentPIN`, `save()`. One-time, transparent, self-healing across the whole user base. Also hash `_pinExpected` comparisons (parent.js:5300+) the same way.

### P0-3 · Forbidden personal email in production code
**Finding:** `api/notify-signup.js:17` — `jasonvega1974@gmail.com` in the notify recipient list. Direct violation of the standing rule (info@kingdom-creatives.com only).
**Fix:** One-line swap. Grep-verify zero remaining occurrences repo-wide after.

### P0-4 · No Content-Security-Policy
**Finding:** vercel.json sets every security header **except** CSP. With 25+ inline `<script>` blocks and a teen audience, XSS blast radius is the whole app (Supabase session included).
**Fix (staged):** Ship `Content-Security-Policy-Report-Only` first: `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://translate.googleapis.com; connect-src 'self' https://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'` — watch the console for violations for a week, then enforce. (`'unsafe-inline'` is required by the current inline-script architecture; tightening it is the P2-2 payoff.)

### P0-5 · CLAUDE.md is dangerously stale (recurring)
**Finding:** CLAUDE.md says index.html is "~9,160 lines" with script tags at "~8804–8845." Actual: **21,333 lines**, scripts at 20158–20311. The May audit flagged the same drift at 13,145 lines. This misleads every future Claude Code session and the guardian agent's expectations.
**Fix:** Update the numbers once, then **change CLAUDE.md to presence-based anchors** ("the script block precedes the Google Translate tag near EOF") so it can't rot again. Add a standing rule: any session that grows index.html >5% refreshes the figure.

---

## P1 — High (this month)

### P1-1 · Light mode ships reactively
696 `:root.light` rules in app.css vs 201 in index.html's inline styles — and this week proved the pattern: The Watch, the entered hub, and the constellation all shipped dark-only and got light-mode rescues after the fact. **Fix the process, not just the CSS:** add "light-mode pass included" to the CLAUDE.md ship checklist for any visual feature. Then do one sweep: load every section in light mode and screenshot-audit (the `ux-visual-reviewer` subagent was built for this).

### P1-2 · index.html monolith risk reduction
21,333 lines / 1.39MB, with thousands of lines of inline `<style>` (blocks at 15, 55, 85, 7790, 14927, 19951…) and six large inline `<script>` blocks at the tail. The file's fragility is your own standing fear (guardian exists because of it). **Without changing architecture:** extract the inline style blocks into `app/css/sections/*.css` files (pure cut-paste, zero behavior change, shrinks the file ~30–40%), and the tail inline scripts into `app/js/boot/*.js`. Every extraction reduces truncation blast radius and merge pain.

### P1-3 · Dead code & the three naming schemes
- The disabled `pchTile*` "Jump in" block (index.html:16543–16568) — six dead buttons carrying a **third** naming scheme ("Settings" vs "Controls", merged Rewards+Contests). Delete or wire them; today they're pure confusion.
- Unused `pchHalo*` radialGradient defs (flagged "pending cleanup" since 06-09).
- `app/img/watch-day.jpg` (395KB) — the export-roundtrip stray, still in the repo snapshot. `git rm` it.
- **Pick one naming truth** (recommend the constellation's: Chores · Contests · Activity · Reports · Family · Controls · Allowance · Rewards) and align the hub card grid labels to it.

### P1-4 · Accessibility floor
190 `aria-` attributes across 21k lines; 53 `<img>` vs 46 `alt=`. The constellation is the gold standard (role=button, tabindex, keyboard bridge, aria pending-counts) — bring the rest of the app toward it. Priority order: the PIN pad (it's a security control), the bottom tab bar, modals (focus trap + `aria-modal`), then images.

### P1-5 · 60MB of audio in the repo
Fine if served on-demand (it's not in PRECACHE_ASSETS — verified), but it bloats every clone/deploy and Vercel build. Move to Supabase Storage or keep but add explicit Cache-Control `immutable` headers for `/app/audio/*` (currently uncovered by vercel.json — falls to default).

---

## P2 — Architecture (the 100-family conversation)

### P2-1 · The JSONB blob + last-write-wins sync **(the most important item in this report)**
Every feature persists through one `profiles.data` blob, `save()` → debounced 2s `cloudSync()` upsert. There is **no conflict detection** — `updated_at` is written but never compared. **The failure mode is your core demographic:** parent approves a chore on their phone while the kid completes another on the tablet within the same window → whichever device syncs last **silently erases** the other's change. As families grow multi-device, this goes from theoretical to weekly.
**Staged fix:**
1. *Cheap guard (days):* before upsert, fetch `updated_at`; if it's newer than the value from your last load, `cloudLoad()` + re-merge + re-apply local delta before writing. Eliminates the blind stomp.
2. *Real fix (the next big build):* move high-contention, multi-writer data — `chores`, `choreLog`, `pb`, approvals — into proper Supabase tables with RLS, row-level writes, and realtime subscriptions. The blob stays for single-writer personal state. This is also the unlock for live "kid completed a chore" parent notifications.

### P2-2 · Inline-script architecture vs CSP
The 25+ inline script blocks are why CSP needs `'unsafe-inline'` (P0-4). The P1-2 extraction work directly enables tightening CSP to `'self'` + CDNs later — these two items compound.

### P2-3 · RLS verification (live check required)
Cannot be verified from a snapshot. Run in Supabase dashboard: confirm `profiles` RLS restricts row access to `auth.uid() = user_id` for select **and** upsert, and audit the `return_*` tables and donation/announcement tables the same way. (The April roadmap listed this; closing it needs eyes on the live policies.)

---

## P3 — Upgrade opportunities (the fun list)

1. **Child constellation** (already queued) — generalize `parent-celestial.js`: extract the renderer to take a `{nodes, scope, palette}` config so parent and kid skies share one engine. Kid sky = same brass-amber language, adventure framing, their real destinations.
2. **Version toast for iOS** — launch-time `version.json` check + "New version — tap to refresh" pill. v337's self-activation covers Android/desktop; iOS standalone remains the flaky one.
3. **Watch hero preload** — `<link rel="preload" as="image">` for the active time-of-day webp kills the splash pop-in.
4. **Push deepening** — the web-push plumbing exists (api/push-*); wire chore-approval and Watch-themed evening digest notifications once P2-1 lands realtime data.
5. **Update the May audit's open per-tab bugs** — re-run the 8-tab fan-out audit; several of its 🔴 items beyond chorePoints (per-tab list in AUDIT_REPORT.md) need re-verification post-rebuilds.
6. **Video hero** (parked decision) — muted autoplay `<video>` with webp poster, as the deliberate Watch upgrade.

---

## Recommended execution order

| # | Item | Size | Files |
|---|---|---|---|
| 1 | P0-3 email swap + repo-wide grep | 5 min | api/notify-signup.js |
| 2 | P0-1.1 `defer` all module scripts | 30 min | app/index.html |
| 3 | P0-5 CLAUDE.md refresh → presence-based | 30 min | CLAUDE.md |
| 4 | P0-2 PIN migrate-on-verify | half-day | auth.js, parent.js |
| 5 | P0-4 CSP report-only | 1 hr | vercel.json |
| 6 | P1-3 dead code + naming unification | half-day | index.html, parent.js |
| 7 | P0-1.2 lazy-load data/*.js (pilot, then batch) | 2–3 days | index.html + consumers |
| 8 | P2-1.1 sync stomp-guard | 1–2 days | sync.js |
| 9 | P1-2 style/script extraction (incremental) | ongoing | index.html → css/js |
| 10 | P1-1 light-mode sweep + checklist rule | 1 day | app.css, CLAUDE.md |
| 11 | P2-1.2 chores → real tables + realtime | the next big build | schema + chores/parent/sync |

Each row is sized to become one Claude Code spec in the established workflow: read-first → diff → guardian/node-check → localhost preview → single commit → SW bump at deploy.
