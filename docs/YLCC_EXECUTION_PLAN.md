# YourLife CC — Execution Plan (companion to YLCC_FULL_AUDIT_2026-06-12)
**Purpose:** Delegation-ready specs. Each spec below is a complete Claude Code prompt — paste one, run it to completion, review, ship, then take the next. Written against the actual codebase snapshot (v337 / a8134a5).

---

## Delegation protocol (read once, applies to every spec)

1. **One spec = one CC session = one commit.** Never batch specs. Never let a session "also fix" something it noticed — it reports findings for a future spec instead.
2. **Writes are serialized; verification is parallel.** Only one agent ever writes to `app/index.html` at a time. After each ship, the `security-auditor` / `ux-visual-reviewer` subagents may fan out read-only to verify.
3. **Every spec follows the rhythm:** READ FIRST (no edits) → implement → `node --check` every touched JS → `index-html-guardian` if index.html touched → per-file diffs shown → **NO commit** until Jason previews on localhost → single commit → push. SW `CACHE_NAME` bumps only on specs marked **[SW bump]**, at ship time.
4. **Never touch:** phNav/routes, The Well (`#s-scripture`, faith.js, faith content), `_ylccEnforceOwner`. ASCII straight quotes only. `info@kingdom-creatives.com` only. `https://yourlifecc.com` only.
5. **Stop conditions:** guardian fail, node --check fail, or any change outside the spec's file list → halt and report, don't improvise.

---

## SPEC 1 — Email swap (P0-3) · 5 min · no SW bump
```
File: api/notify-signup.js only.
1. Line 17: replace the jasonvega1974@gmail.com recipient entry with
   { email: 'info@kingdom-creatives.com', name: 'Kingdom Creatives' } — unless an identical
   info@ entry already exists in the list, in which case DELETE line 17 (no duplicates).
2. Verify zero remaining occurrences repo-wide:
   rg -n "jasonvega1974" --glob '!node_modules' .
   Must return nothing. If it finds others, list them but fix ONLY notify-signup.js.
3. node --check api/notify-signup.js. Diff. Commit: fix(api): route signup notifications to
   info@kingdom-creatives.com per standing rule
```
**Accept:** grep clean in shipped file; endpoint still sends (verify next real signup).

## SPEC 2 — CLAUDE.md presence-based refresh (P0-5) · 30 min · no SW bump
```
File: CLAUDE.md only. Read it fully first.
1. Fix stale figures: index.html is currently ~21,333 lines (doc says ~9,160); script tags
   live at ~20158–20311 (doc says ~8804–8845). faith.js is ~25k lines not ~6,100.
2. Convert ALL line-number references to presence-based anchors, e.g. "the module <script>
   block sits immediately before the Google Translate tag near EOF", "function tick() and
   setInterval(tick are in the tail inline scripts". Line numbers may remain only as
   parenthetical hints marked (approx., drifts).
3. Add two standing rules to the workflow section:
   - "Any session that grows app/index.html by >5% must refresh the size figure here."
   - "Any new visual feature ships with its :root.light pass in the same commit."
4. Diff. Commit: docs(claude-md): presence-based anchors + refreshed figures + ship rules
```
**Accept:** no load-bearing line numbers remain; the two new rules present.

## SPEC 3 — Defer pass (P0-1.1) · the big perf win · **[SW bump]**
```
Files: app/index.html (+ service-worker.js at ship).
KNOWN TRAP (pre-verified): six tail inline <script> blocks (~lines 20314, 20454, 20523,
20681, 21006, 21316) currently execute AFTER the synchronous modules. Once modules are
deferred, these blocks run BEFORE module code exists. Most are function definitions /
event-wrapped IIFEs (safe), but any PARSE-TIME call into a module function breaks boot.

STEP 0 — READ FIRST: for each of the six tail blocks AND the three head blocks (~15, 55, 85),
inventory every statement that EXECUTES at parse time (not inside a function/listener).
For each, classify: self-contained / touches DOM only / calls a module global. Report the
table before editing.
1. Add defer to every local module <script src="/app/js/..."> tag (all ~60). Do NOT reorder
   tags — defer preserves execution order. Leave the two CDN tags that already have defer;
   leave supabase-js + chart.js CDN tags as-is for now (modules reference them at execute
   time, which is post-parse either way — but confirm in step 0 that no HEAD inline block
   calls them at parse).
2. For every parse-time module call found in step 0: wrap that call (only the call, not the
   definitions) in document.addEventListener('DOMContentLoaded', ...) or move it into the
   end of init.js with a comment pointing back.
3. Guardian. Localhost preview checklist for Jason: cold load in private window — auth screen
   renders, login works, child + parent surfaces load, chores complete/approve round-trips,
   constellation renders, no console reference errors on boot.
4. Ship [SW bump]: feat(perf): defer all module scripts — non-blocking boot
```
**Accept:** zero boot console errors; Lighthouse/DevTools shows HTML paints before JS finishes downloading.
**Rollback:** revert commit — single-file change.

## SPEC 4 — PIN migrate-on-verify (P0-2) · half-day · **[SW bump]**
```
Files: app/js/auth.js, app/js/parent.js.
STEP 0 — READ FIRST: show verifyPin/hashPin in auth.js (~690–770), _getParentPinInfo
(parent.js ~2360–2400), the gate checks at parent.js 125 / 1699 / 5474, and every site that
compares a plaintext pin (search: chorePin, parentPIN, _pinExpected).
1. In the central verify path: when a candidate verifies against a PLAINTEXT field
   (D.chorePin / D.parentPIN, own profile or another profile's data), immediately:
   pinHash = await hashPin(candidate); write it to the same record the plaintext came from;
   clear that record's chorePin/parentPIN; save(). Transparent, one-time, self-healing.
2. _pinExpected flows (verify parent PIN while child active): pass/compare hashes where the
   caller has a hash; keep plaintext support ONLY as the migration on-ramp.
3. Keep hasAnyPin semantics identical (hash OR legacy plaintext counts).
4. Test matrix for Jason's preview: legacy-plaintext family verifies once → blob now has
   pinHash and empty plaintext (inspect via console); wrong PIN still rejects; hashed family
   unaffected; child-active parent-PIN check works; PIN change works.
5. Ship [SW bump]: fix(security): migrate legacy plaintext PINs to SHA-256 on first verify
```
**Accept:** after one verify, no plaintext PIN remains in the profile blob.

## SPEC 5 — CSP report-only (P0-4) · 1 hr · no SW bump
```
File: vercel.json only.
1. Add to the global headers block:
   Content-Security-Policy-Report-Only:
   default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net
   https://unpkg.com https://translate.googleapis.com https://translate.google.com;
   connect-src 'self' https://*.supabase.co https://translate.googleapis.com;
   img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
   font-src 'self' https://fonts.gstatic.com data:; frame-src https://www.youtube.com;
   media-src 'self' https://*.supabase.co
2. STEP 0 first: rg index.html + login/register pages for external src/href domains
   (youtube, fonts, clearbit, stripe, etc.) and extend the directive list to cover ALL of
   them — clearbit logo fetches were seen in console (logo.clearbit.com → img-src https:
   already covers).
3. Diff. Commit: feat(security): CSP report-only baseline
   Jason then watches DevTools console across normal use for a week; violations reported,
   none enforced. Promotion to enforcing CSP is a FUTURE spec after the report is clean.
```
**Accept:** header present on prod responses; app behavior unchanged.

## SPEC 6 — Dead code + naming unification (P1-3) · half-day · **[SW bump]**
```
Files: app/index.html, app/js/parent.js, git rm app/img/watch-day.jpg.
1. Delete the disabled pchTile* "Jump in" block (index.html ~16543–16568) AND its
   container/header if now empty. Confirm via rg that nothing references pchTile IDs.
2. Delete the unused pchHalo* radialGradient <defs> (flagged unused since 06-09). Confirm
   zero references first.
3. git rm app/img/watch-day.jpg (untracked stray in working dirs; remove from disk).
4. NAMING TRUTH = the constellation's: Chores / Contests / Activity / Reports / Family /
   Controls / Allowance / Rewards. Update renderPhCardGrid labels (parent.js ~2977–2986):
   "Chores & Approvals"→"Chores", "Rewards Store & Bucks"→"Rewards", "Contests & Family
   Goals"→"Contests", "Activity & Schedule"→"Activity", "Reports & Progress"→"Reports",
   "Family & Profiles"→"Family", "Controls & Limits"→"Controls". Keep slots/routes identical.
5. Guardian + node --check. Preview: hub grid labels match stars; nothing 404s/undefined.
6. Ship [SW bump]: chore(hub): remove dead tiles + unused defs; unify destination naming
```
**Accept:** one naming scheme everywhere a parent can see.

## SPEC 7 — Lazy data loading pilot (P0-1.2) · 2–3 days · **[SW bump]**
```
PILOT ONE FILE FIRST: app/js/data/biblical-sites.js (~pick by size in STEP 0).
STEP 0: ls -laS app/js/data/ and rg each candidate's consumer (which module reads its
global, triggered from which section). Pick the largest file whose consumer is a single
section-open path. Report before editing.
1. Convert the pilot: data file → JSON in app/js/data/ (or keep .js but fetch as text —
   prefer JSON). Consumer gets an async ensureXLoaded() that fetches once, caches on
   window, and gates the section's first render (loading state if needed).
2. Remove its <script> tag from index.html.
3. Preview: cold load (file absent from network until section opened), open the section
   (loads + renders), offline-after-first-load still works if it was SW-cached.
4. Ship [SW bump]: perf(data): lazy-load biblical-sites on first open (pilot)
BATCH (separate follow-up spec after pilot proves): repeat for the remaining data/*.js,
largest-first, 3–5 per commit.
```
**Accept:** initial JS payload drops by the pilot file's size; section works identically.

## SPEC 8 — Sync stomp-guard (P2-1.1) · 1–2 days · **[SW bump]**
```
File: app/js/sync.js (+ a lastLoadedAt stamp wherever cloudLoad stores state).
STEP 0: show cloudSync() and cloudLoad() in full, incl. the upsert and the updated_at writes.
1. cloudLoad(): record the row's updated_at into a module-level _lastSeenUpdatedAt.
2. cloudSync(): before upserting, select updated_at for the user's row.
   - If it equals _lastSeenUpdatedAt → proceed (fast path, one extra cheap select).
   - If NEWER → another device wrote since we loaded: run cloudLoad() to pull the fresh
     blob, re-apply the standard merge, THEN upsert, and update _lastSeenUpdatedAt.
   - On select failure → proceed with the write (availability over consistency — same as
     today, never block a save on a flaky read).
3. Log one console.warn when a stomp is averted (visibility into how often this fires).
4. Preview test: two browser profiles signed into one account; change different fields in
   each within 10s; confirm both survive.
5. Ship [SW bump]: fix(sync): refetch-merge guard prevents multi-device last-write stomp
```
**Accept:** the two-device test no longer loses either write.
**Note:** this is the bridge fix. The real fix (chores→tables+realtime) is a design doc, not a spec — schedule separately.

## SPEC 9 — Light-mode sweep (P1-1) · 1 day · no SW bump unless fixes ship
```
PHASE A (read-only, parallelizable): ux-visual-reviewer subagent walks EVERY section in
:root.light (sidebar list + sub-tabs + modals), screenshotting/flagging any cream/amber-on-
light or low-contrast surface. Output: table of selector → current color → proposed token
(use the established palette: #0f172a/#1a1233 ink, #4a4b52 muted, #ffffff cards with
rgba(15,23,42,.08) borders, #92400e amber).
PHASE B (single write session): implement the table as :root.light rules in the owning
style location. Guardian. Preview both themes. Ship [SW bump]:
fix(theme): light-mode contrast sweep across all sections
```
**Accept:** no washed-out text anywhere in light mode; CLAUDE.md rule from SPEC 2 prevents recurrence.

## SPEC 10 — Inline style/script extraction (P1-2) · ongoing campaign · **[SW bump each batch]**
```
RULES OF THE CAMPAIGN (one batch = one spec run = one commit):
- Extract ONE inline <style> block per session into app/css/sections/<name>.css, add the
  <link> where app.css is linked, byte-identical CSS (pure cut-paste, zero edits).
- Order: largest blocks first (blocks at ~7790, ~14927, ~19951, then head blocks).
- After each: guardian + visual spot-check of the affected sections in BOTH themes.
- Inline <script> tail blocks come AFTER all styles are out, one per session, into
  app/js/boot/<name>.js with defer, placed AFTER init.js tag (they currently run last).
- STOP the campaign instantly on any guardian anomaly.
Target end-state: index.html under ~12k lines; every extraction shrinks truncation risk.
```
**Accept (per batch):** zero visual diff; line count down; guardian green.

## SPEC 11 — Chores → tables + realtime (P2-1.2) · design doc first, NOT a build spec
```
Deliverable: docs/CHORES_TABLES_DESIGN.md answering: table schema (chores, chore_log,
approvals, pb_ledger) with RLS per family; migration strategy from blob (dual-write window?
one-shot backfill?); realtime subscription points (parent approval badge, kid completion
toast); offline behavior; rollback. NO code. Review the doc together before any build spec
is written.
```

---

## Sequencing & parallelism map
- **Tonight-sized:** SPEC 1 → 2 → (CC kit ship lands as v338) → SPEC 3 as v339.
- **Serial chain (shared files):** 3 → 6 → 7 → 10 all touch index.html — never overlap.
- **Safe to interleave anytime:** 1, 2, 5 (api/docs/config files only), 11 (doc only).
- **Verifier fan-out after each ship:** security-auditor after 4, 5, 8; ux-visual-reviewer after 6, 9, 10 batches.
- **Live-environment item (not CC):** RLS verification (audit P2-3) — Supabase dashboard, Jason + one read-only CC assist to enumerate expected policies.

---

## SPEC 1b — scripts UA-string email sweep (follow-up from SPEC 1) · 5 min · no SW bump
Replace jasonvega1974@gmail.com with info@kingdom-creatives.com in the User-Agent strings of the 9 scripts/*.py files identified in SPEC 1's grep report (verify_failed_urls, pick_stragglers, pick_stragglers2, pass_e_replacements, pass_e_photos, fetch_card_photos_retry, fetch_card_photos, fetch_bible_lands_photos, curate_card_photos). No deploy path. Grep clean after.

## SPEC 5b — proxy admin Brevo send server-side · ~2 hrs · no SW bump
admin.html:1457/1541 sends directly to api.brevo.com with a runtime-prompted key (no key in
source — confirmed 2026-06-13). Replace with POST to a new /api/admin/send-message.js using
the BREVO_API_KEY env var + Bearer ADMIN_SECRET auth (mirror api/admin/send-announcement.js).
Delete the prompt + window.BREVO_API_KEY. Then remove api.brevo.com from the CSP connect-src
in vercel.json (same commit). Related read-only pre-check: inventory what an anonymous
visitor can see/do on admin.html (it is gated by route obscurity only).
