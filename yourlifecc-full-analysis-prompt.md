# YourLife CC — Full Analysis & Roadmap Reconciliation Prompt

> Paste this into Claude Code at the root of the yourlifecc.com repo.
> **Do not let it edit anything until Phase A (the written report) is delivered and approved.**

---

## ROLE & GOAL

You are doing a **full diagnostic audit** of the YourLife CC app (the general life-skills app at `https://yourlifecc.com`). The **faith section** (`/faith`, "The Well") is finished and comprehensive. The rest of the app is **not** — there are known bugs (the **Home view renders as a blank screen**, several tabs don't work) and an unfinished roadmap.

My goal: get the rest of the app to the same level of polish and completeness as the faith side. But first I need to know **exactly where we are** — I'm not sure what phase we left off on.

**This is an analysis task first. Do NOT fix, refactor, or commit anything in this pass.** Your deliverable is a written report and a prioritized plan. I will review it and tell you what to start on.

---

## HARD GUARDRAILS (read before doing anything)

1. **No edits, no commits, no `git push` in this pass.** Read-only investigation only.
2. **File integrity rules for `index.html`** (these have bitten us before — verify they're currently intact and FLAG if not):
   - `function tick()` must exist
   - `setInterval(tick` must exist
   - `<script src="//translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit">` must be present before `</body>`
   - Check the **tail** of the file for truncation.
3. **Contact email** anywhere in the code must be `info@kingdom-creatives.com`. Flag any occurrence of a personal gmail or obfuscated Cloudflare email-protection links.
4. **Canonical domain** is `https://yourlifecc.com` (NOT `yourlife.cc`). Flag any wrong URLs in canonical tags, OG tags, or references.
5. Treat any specific line numbers I give below as **last-known hints, not facts** — the code has changed. Verify against the current file before reporting.

---

## TECH STACK (for your context)

- Frontend: single-page app, `index.html` + modular JS in `app/js/*.js`
- Hosting/deploy: Vercel, deployed via `git push` from Claude Code bash
- Backend: Supabase (project `hrohgwcbfgywkpnvqxhk`) — auth, RLS, tables, Edge Functions
- Payments: Stripe
- Email: Brevo / Resend
- AI: Anthropic API; OpenAI TTS (Nova voice, pre-rendered MP3s)
- JS is validated with `node --check` before any commit (not this pass).

---

## PHASE A — DELIVER A WRITTEN REPORT (`STATUS_REPORT.md`)

Investigate the repo and produce a single markdown report. Cover all of the following.

### A1. Repo & architecture inventory
- Map the file tree. List every JS module in `app/js/` with a one-line description of what it owns.
- Identify the **render/boot sequence**: how `index.html` loads modules, what initializes the Home view, the order of script tags, and any `defer`/`async`/module-type loading.
- Note the routing/tab-switching mechanism (how a tab click changes the visible section — e.g. a `D.sections` toggle map or similar).
- List Supabase tables referenced in code and which modules touch them.

### A2. ROOT-CAUSE the blank Home screen (highest priority)
- Trace exactly what's supposed to render the Home view on load and why it's coming up blank.
- Look for: uncaught JS exceptions during boot, a failed `await` that halts init, a missing/renamed DOM container, a section toggle that hides everything, a module that throws before render, or a 404 on a script.
- Report the **specific file + line + cause**, not a guess. If you can't be certain statically, say what runtime check (console error, network tab) would confirm it, and give your top-ranked hypotheses.

### A3. Tab-by-tab functional audit
- Enumerate every tab/section/nav item in the app.
- For each: does it render? Is it wired to a handler? Does that handler reference functions/elements/data that actually exist? Mark each **WORKING / BROKEN / PARTIAL / PLACEHOLDER** with the reason.
- Specifically check for placeholder/dead states like "coming soon" copy, empty handlers, and orphaned modals (e.g. a stray `firstTimeGate` modal, a "Lessons coming soon" string in the skills module — verify whether these still exist).

### A4. Locate our current roadmap phase
Compare the current code against this roadmap and tell me, with evidence, **which items are DONE, PARTIAL, or NOT STARTED**:

- **Phase 0 (stop-the-bleeding):** fail-closed plan check in `auth.js` (~line 281); strip leftover `console.log` in `sync.js`; delete orphaned `firstTimeGate` modal in `index.html` (~lines 195-217); fix "Lessons coming soon" placeholder in `skills.js` (~line 3905); reconcile pricing copy with private-beta CTAs.
- **Phase 1 (security):** parent PIN hashed client-side (SHA-256 + salt from `_supaUser.id`); child PIN decoupled from profile ID via separate `pinHash` field; remove `_parentDashUnlocked` localStorage cache (replace with 5-min in-memory); escape user text in `parent.js` (~lines 252-274 `innerHTML`); 30-min idle timeout; Supabase RLS verified on `profiles` table.
- **Phase 2 (progressive disclosure):** age picker on first launch wired to section toggles (12-14: 7 sections, 15-17: +5, 18-22: full); collapsed sidebar groups except Daily Life; hero compact mode (8 priority cards + expander); Parent Hub 4-tab pivot (Activity / Rewards / Controls / Reports).
- **Phases 3 & 4:** believed COMPLETE — verify and confirm.

Give me a clear verdict: *"We are effectively at Phase ___, with these specific items still open."*

### A5. Bug catalog (severity-ranked)
Table every defect found, with: severity (Critical / High / Med / Low), location, symptom, suspected cause. Critical = anything blocking core use (blank Home, dead primary tabs, auth/payment breakage, security holes).

### A6. Parity gap analysis — secular side vs. faith side
The faith tab is the quality bar. Inventory what the faith side has that the secular side lacks (engagement loops, onboarding, animated hero, progress/streaks, content depth, polish) and list concrete features/sections needed to reach parity. Frame as a gap list, not implementation yet.

---

## PHASE B — PRIORITIZED ACTION PLAN (in the same report, separate section)

After the findings, propose a sequenced plan:

1. **Triage first:** the minimum changes to get Home rendering and broken tabs working again.
2. **Then security** (any open Phase 1 items).
3. **Then completeness/parity** (Phase 2 + the gap list from A6), broken into shippable increments.

For each work item give: what changes, which files, rough risk/effort, and any dependency order. **Propose only — do not implement.**

---

## OUTPUT FORMAT

- Write everything to `STATUS_REPORT.md` at repo root (this is the one file you may create this pass).
- Lead with a 5-bullet executive summary: current phase, the blank-Home root cause, count of broken tabs, top 3 critical bugs, and the single most important next action.
- Be specific with file paths and line numbers. No vague advice.
- End by asking me which section of the action plan to start on. **Wait for my go-ahead before any code changes.**
