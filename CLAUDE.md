# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**YourLife CC** — a family life-management PWA for Kingdom Creatives LLC. Marketing site at the repo root (`index.html`, `about.html`, etc.); the actual app lives under `/app/`. Hosted on Vercel, backed by Supabase (project ref `hrohgwcbfgywkpnvqxhk`), Stripe (Live), Brevo (transactional email), and Anthropic (a single AI ingress at `/api/ai-summary`).

## Build / run / test

There is **no build step, no bundler, no test runner, no `package.json`**. Everything is static HTML + vanilla JS served directly by Vercel.

- **Local dev:** open files directly, or serve the repo root with any static server (`python -m http.server`, `npx serve`, etc.). The PWA service worker only registers when served over `https:` or `localhost`.
- **Deploy:** push to the default branch — Vercel deploys from `vercel.json` (rewrites `/app/(.*)` → `/app/index.html`, sets cache headers, security headers).
- **Syntax-check JS modules:** `node --check app/js/<file>.js` (the only "test" wired into `.claude/settings.json`'s allowlist). Use this after editing any JS module.
- **Cache busting:** bump `CACHE_NAME` in `service-worker.js` on any deploy that ships new asset URLs, otherwise returning users hit the stale cached shell.

## Architecture

### The single-file shell + module pattern

`app/index.html` (~9,160 lines) is the entire app shell — every section, modal, screen, and inline `<style>` block lives in this one file. Behavior is split across vanilla JS modules in `app/js/` that all load globally onto `window`. There are no ES modules, no imports, no classes — files cooperate via global functions and the shared mutable `D` state object.

**Script load order matters and is fixed in `app/index.html` (~lines 8804–8845):**

1. `config.js` — Supabase URL/anon key, lazy `getSupabase()`
2. `data.js` — `DEF` (defaults schema) and `D` (live state)
3. `sync.js` — `save()` / `loadData()` / `cloudSync()` / `cloudLoad()`
4. `auth.js` — Supabase auth, plan picker, PIN gate
5. `ui.js` — `function tick()`, sidebar nav, section routing, `applyStageFilter()`
6. Feature modules: `finance`, `school`, `health`, `goals`, `skills`, `chores`, `sports`
7. `data/*.js` — large static datasets (memory verses, Bible timeline, biblical sites, plans, academy, etc.)
8. Faith stack: `faith.js` (~6,100 lines), `worship.js`, `faith-resources.js`
9. `parent.js` — parent hub, multi-profile, PIN gate, behavior log
10. `email.js`, `misc.js`, `resume.js`
11. `init.js` — bootstrap, `DOMContentLoaded`, demo data, first-load logic — **must load last**

Adding a new module: insert the `<script>` tag in the correct group in `app/index.html`, do not put it at the bottom blindly.

### Global state (`D`)

`data.js` exports `DEF` (the canonical defaults schema) and `D` (the live in-memory copy seeded from `DEF`). Every feature reads/writes `D.<key>` directly. `save()` in `sync.js` serializes `D` to `localStorage[LS]` (key `lifeos_v2`) and triggers a debounced (2s) `cloudSync()` to Supabase `profiles.data` (a JSONB blob keyed by `user_id`).

When adding a new persisted field:

1. Add it to `DEF` in `data.js` with a sensible default and a comment explaining intent.
2. Read/write through `D.<key>` — never duplicate it in localStorage under another key.
3. `cloudLoad()` automatically restores any key in the saved blob, even ones not in `DEF` (e.g. `pb`, `myInstruments`).

`scrReadDays` must be an object, never an array — `loadData()` and `cloudLoad()` both sanitize this. There are several similar legacy-shape sanitizers in those functions; respect them.

### Auth + sync model

- `getSupabase()` returns a lazily-created client from the anon key in `config.js`.
- `_supaUser` is the global signed-in user (set in `auth.js`).
- `cloudSync()` upserts `D` into `profiles` on `user_id`. `cloudLoad()` pulls and merges back into `D`, then re-saves cleaned data immediately so bad values don't persist.
- **Owner-guard (`_ylccEnforceOwner` in `sync.js`):** on sign-in, compares `localStorage.lifeos_owner_user_id` against the current auth user. On mismatch, it wipes all `ylcc_*` / `lifeos_*` / `dominic_*` / `levelup_*` keys and resets `D` to `DEF` before any save can promote stale data into the new user's cloud row. **Don't bypass this** — it's the fix for "Good afternoon, Lilly" on a fresh signup.
- Server-side env vars (set in Vercel): `BREVO_API_KEY`, `SUPA_SERVICE_KEY`, `SUPA_WEBHOOK_SECRET`, `ANTHROPIC_API_KEY`.

### Multi-profile (parent.js)

`_profiles[]` (array) + `_activeProfileId` represent multiple kids on one account. When in multi-profile mode, `save()` snapshots the current `D` into `_profiles.find(p=>p.id===_activeProfileId).data` before writing. Per-profile data is also written to its own LS key via `saveProfiles()` to keep the index slim — writing the cloud's bloated array directly into `ylcc_profiles` previously blew the localStorage quota.

Parent-dash unlock is **in-memory only** (`_parentUnlockExpiresAt` / `_parentUnlockHardCap` in `parent.js`) — 5 min sliding idle, 30 min hard cap. Do not move this back to `sessionStorage`/`localStorage` (prior security hole).

### API surface (`/api/`, Vercel Functions, CommonJS)

- `ai-summary.js` — **the only** Anthropic ingress. Two modes via `mode` field: default (Haiku, weekly summary, ~350 tokens) and `'ask-bible'` (Sonnet 4.6, JSON-shaped Q&A with safety rules for self-harm/medical/legal redirection). **Add new AI features as modes here, not as parallel endpoints.** Keep CommonJS — switching to ESM has caused 502s on this deploy before.
- `waitlist-submit.js` — sponsorship waitlist (Supabase insert + Brevo notify).
- `affiliate-apply.js`, `approve-affiliate.js`, `send-email.js` — partner/email plumbing.

### Faith stack (largest feature surface)

The faith feature area is delivered in phased specs (`docs/F0-followups.md`, `docs/F1-spec.md`). Phase tags appear throughout `data.js` and `faith.js` (F2-B reading plans, F2-D reader annotations, F2-F memory verses with SM-2-lite, F2-G Ask the Bible, F2-H sermon notes + streak, F2-I Faith Academy, F3-B Bible Lands, F4-C celebration FX, F4-G Story Mode). When extending, grep for the phase tag to find the existing data shape before adding new state.

`faith_free` is a **Stripe-free** plan tier — `link → register → in`, no checkout, no Stripe customer, no `stripe_customer_id`. Stripe webhooks must never overwrite `plan_status='faith_free'` (see `docs/F0-followups.md` "Production-blocking" section — this has bitten production once).

### Service worker

`/service-worker.js` (top-level) — cache-first for static, network-first for navigation, **network-only** for `supabase.co`, `stripe.com`, `api.brevo.com`, `googleapis.com`, `translate.googleapis.com`. The page-side registration in `app/index.html` (~line 8845) auto-applies new SW versions on `controllerchange` and reloads once.

### Demo mode

`?demo=true` triggers `loadDemoData()` in `init.js` — populates `D` with a fictional teen (Emma) for screenshots/marketing. The demo banner at the top of `app/index.html` is shown via the `demo-banner-on` body class.

## Critical: `/app/index.html` tail integrity

This file has a known truncation failure mode around line 1751 — edits occasionally clip the file tail and break the live app silently. **After any edit to `/app/index.html`**, invoke the `index-html-guardian` agent (defined in `.claude/agents/`). It verifies that these tail tokens are still present:

- `function tick()` (in the file via `ui.js`, but the inline script must close cleanly)
- `setInterval(tick`
- `<script src="//translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit">`
- `</body>` and `</html>`

If the guardian returns `FAIL`, restore the tail before any further edits — do not try to patch forward.

## Conventions

- **No emojis in commits or code unless asked.** The codebase already uses many emoji for UI labels — that's the design system, not a license to add more.
- **Vanilla JS only.** No frameworks, no transpilation, no `import`. Functions are global and call each other directly. Defensive `if(typeof fn === 'function')` checks are the norm because module load order is fragile.
- **HTML escaping:** `escapeHtml()` (parent.js) before any `innerHTML` interpolation of user-supplied strings.
- **Phase comments in `data.js`** describe the shape of new state additions — keep adding them when extending `DEF`.
- **Cache headers** in `vercel.json` aggressively no-cache `app/js/*`, `app/css/*`, `index.html`, and the service worker — don't add a `?v=` query string hack on top.

## Specialized agents (`.claude/agents/`)

- `index-html-guardian` — tail integrity check (use after every `app/index.html` edit).
- `security-auditor` — read-only audit (RLS, env vars, XSS in JS modules, PIN handling).
- `ux-visual-reviewer` — read-only UX critique against premium consumer + faith app benchmarks.
- `competitor-researcher` — web research only, writes to `docs/competitor-faith-landscape.md`.
- `content-author-faith` — drafts faith content into `/content/faith-drafts/` only.

## Reference docs

- `docs/F0-followups.md` — deferred items + the faith_free/Stripe production-block writeup.
- `docs/F1-spec.md` — phase-1 faith content build-out.
- `docs/migrations/*.sql` — Supabase schema for memory verses, prayer requests, faith plans (RLS policies included).
- `docs/superpowers/specs/` and `docs/superpowers/plans/` — UX redesign work for the mom-of-teen persona.

## Standing Rules — Non-Negotiable

- Domain: always https://yourlifecc.com — never yourlife.cc, never www.yourlifecc.com
- Contact email: always info@kingdom-creatives.com — never jasonvega1974@gmail.com
- Deployment: Use git commit and git push from Claude Code bash. Stage only the specific files changed in the current phase using targeted git add. Never use git push --force except as authorized one-time exception. GitHub web UI uploads are retired.
- JS validation: run `node --check` before any JS module is uploaded
- Single-file architecture: `/app/index.html` plus modules in `/app/js/` (init.js, ui.js, sync.js, faith.js, data.js, auth.js, parent.js, skills.js)

## index.html Tail Integrity (Non-Negotiable)

After any edit to `/app/index.html`, the index-html-guardian agent must verify the tail is intact:
- `function tick()` exists (currently ~line 6343)
- `setInterval(tick` exists (currently ~line 6358)
- Google Translate script tag present before `</body>` (currently ~line 6551)
- File should be ~6829 lines

These line numbers shift with edits — the agent verifies presence, not exact position.

## Roadmap & Current Phase

See `/docs/roadmap.md` for the full phased plan.

**Status as of 2026-04-28:** Phase 0 and Phase 1 (security rework, including 1.1 add-on, main hardening, and recursion hotfix) shipped and live.

**Pending decision:** Phase 2 (progressive disclosure) vs. Phase 5 (differentiator items).

**New parallel track — Phase 6 (Faith-Only path):** All-ages free path with optional donation, expanded Christian Life Guide, youth/family/group modules. Planning in progress.

## Subagents

Five custom agents in `.claude/agents/`:
- `index-html-guardian` — runs after every index.html edit
- `security-auditor` — read-only system-wide vulnerability audits
- `ux-visual-reviewer` — read-only visual critique vs. premium benchmarks
- `content-author-faith` — drafts faith content to /content/faith-drafts/ only
- `competitor-researcher` — web research, writes to /docs/ only
