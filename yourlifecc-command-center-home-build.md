# YourLife Command Center — Full-App Home Build

> Multi-agent Claude Code prompt. Run at the repo root.
> **Three phases with STOP gates. Do not build until I approve a concept. Never modify the working faith "Well" experience.**

---

## CONTEXT

The full YourLife app (`yourlifecc.com`, account `jason.vega07@yahoo.com`, tier `faith_only = false`) currently lands on the **Well** hero ("Enter the Well") when the app opens. That is the **faith-only** experience and is correct for faith-only accounts (`faith_only = true`) — but it is **wrong as the home for the full app**.

The full app needs its **own animated home: "YourLife Command Center"** — the same production quality and polish as the Well's animated hero, but a completely distinct, non-faith identity.

**Hard rule: the faith-only Well experience is finished and shipping. Do not change, regress, or restyle it. The Command Center home is an additive, parallel surface, gated by account tier.**

---

## STANDING GUARDRAILS (apply to every phase)

- Stack: Vercel + Supabase (project `hrohgwcbfgywkpnvqxhk`) + modular JS in `app/js/*.js`. Deploy via `git push`.
- Tier flags live on the account/profile schema: `faith_only` (boolean), `age_tier`, `account_role`. Use these to distinguish full vs faith-only — do NOT invent new flags without telling me.
- Contact email anywhere must be `info@kingdom-creatives.com`. Never `jason.vega07@yahoo.com`, never `jasonvega1974@gmail.com`, never an obfuscated Cloudflare email-protection link.
- Canonical domain is `https://yourlifecc.com` (NOT `yourlife.cc`) for all URLs, canonical/OG tags.
- `index.html` integrity, verify after EVERY edit: `function tick()` exists, `setInterval(tick` exists, the Google Translate `<script src="//translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit">` is present before `</body>`, and the file tail is not truncated. Run the index-html guardian.
- `node --check` every JS file you touch before committing.
- Bump the Service Worker version if you add/rename any cached asset.
- No `localStorage`/`sessionStorage` for sensitive state; follow existing app patterns.
- Use sub-agents / parallel workers where it speeds things up (e.g. one worker per concept prototype in Phase 2).

---

## PHASE 1 — DISCOVERY & ROUTING (investigation agent) — STOP & REPORT, NO EDITS

Answer precisely, with file + line evidence:

1. For a **full-app account** (`faith_only = false`), what actually renders as the home surface on app open, and **by what mechanism**? Trace the full decision path across `init.js` (boot landing), `app-home.js` (`maybeRenderAppHome`, the `_faithFree` / `parent-view` gating), and the Well render path (`#faithHeroCinematic` / `renderFaithOnlyHero`).
2. Why is the **full** account getting the Well? Pick the true cause with evidence:
   - (a) `window._faithFree` is being set `true` for full accounts (a flag bug), or
   - (b) the Well hero is the hardcoded default landing for everyone, or
   - (c) something else — name it.
3. Where exactly is the home-surface decision made, and what is the **minimal routing change** so that: full accounts (`faith_only=false`) land on the new Command Center home, and faith-only accounts (`faith_only=true`) keep the Well — with no regression to the Well?
4. Inventory what the full app already has to surface on a home: available live data (streaks, today's items, points/tickets, goals, habits, schedule) and the existing `#appHome` block (greeting + Daily Briefing + 6 buttons) — is it reusable as the dashboard layer under the new hero, or replaced?

**Output:** a short `COMMAND_CENTER_PLAN.md` (Phase 1 section) with the cause, the routing fix, and the data inventory. Then STOP for my go-ahead.

---

## PHASE 2 — DESIGN CONCEPTS (design agent + parallel workers) — STOP FOR MY PICK

First, **study the Well hero implementation** (the animated "Enter the Well" canvas scene) to understand the quality bar, animation technique, and structural pattern — then design something at that level but with a **distinct, non-faith identity**.

Produce **2–3 concepts** for the Command Center home. For each, render an actual standalone HTML/CSS/JS preview (in a scratch dir, not wired into the app yet) so I can see it, plus a one-paragraph rationale. Spin up a worker per concept to prototype in parallel.

Each concept must specify:
- **Signature animated centerpiece** (the "Enter the Well" equivalent) — the thing that makes it feel alive.
- **Layout**: hero-first, dashboard-first, or hero-that-morphs-into-dashboard.
- **Motion + color language** (distinct from the Well's palette).
- **Personalized greeting** by name + time of day.
- **Live data surfaced** and **quick-launch** into the major life-skills sections.
- Mobile-first behavior and a performance budget (animation must not jank on a mid-range phone).

**Default direction to include as one option** (my steer): "mission-control-for-your-life" — capable but warm, not cold sci-fi, not childish; living animated hub centerpiece; greeting + a few live stats; hero that resolves into a usable dashboard with quick-launch tiles.

**Output:** the previews + `COMMAND_CENTER_PLAN.md` (Phase 2 section). STOP. I will pick one (and may ask for tweaks) before any build.

---

## PHASE 3 — BUILD (build agent) — DIFFS BEFORE COMMIT

Once I approve a concept:

1. Build it as a new home surface for **full accounts only**, wired into the real app (`index.html` + a new/extended `app/js/*.js` module). Animated, mobile-first, accessible, within the performance budget.
2. Personalize: greeting by name, live data from the existing app state.
3. Apply the Phase 1 routing fix so full accounts land here and faith-only accounts keep the Well. Verify both paths.
4. Run all standing guardrails: index.html integrity + guardian, `node --check`, contact email, canonical URLs, SW bump if needed.
5. Show me the **before/after diff for every changed file** and a short test matrix (full account → Command Center home; faith-only account → Well unchanged; child/solo accounts → correct surface) **before** you commit.
6. On my go: commit each file with a clear message, `git push`, and give me a browser-console verification snippet that confirms (a) a full account renders the Command Center home, (b) a faith-only account still renders the Well, (c) no console errors on home entry.

---

## OUTPUT EXPECTATIONS

- Honor the three STOP gates. Do not skip ahead to building.
- One planning doc: `COMMAND_CENTER_PLAN.md`, appended per phase.
- Be specific with file paths and line numbers; verify them against the current (~16k-line) `index.html` before editing, since line numbers drift.
- Never touch the faith Well experience.
