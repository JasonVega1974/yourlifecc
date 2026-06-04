# YourLife CC — Session Handoff / Resume Prompt

> Paste this at the start of a fresh Claude Code session in the yourlifecc repo.
> First action: orient yourself by reading the repo (git log + the planning docs below) to CONFIRM the state described here — the repo is the source of truth, this summary is just a map.

---

## WHAT THIS PROJECT IS

YourLife CC (`https://yourlifecc.com`) — a faith-driven family life-skills app for teens/young adults (12–22).

- **Structure:** modular. `app/index.html` (~16,400 lines) + JavaScript modules in `app/js/*.js`. It is NOT a single 28,800-line file (an old doc claims that — it's wrong).
- **Stack:** Vercel (hosting, auto-deploy on push to `main`) + Supabase (project `hrohgwcbfgywkpnvqxhk`) + Stripe + Brevo + OpenAI TTS + Anthropic API.
- **Deploy:** `git push` from Claude Code bash → Vercel.
- **GitHub:** `JasonVega1974/yourlifecc`, branch `main`.

**Two account tiers (important for the home screen):**
- `jason.vega07@yahoo.com` = the FULL app (`faith_only = false`).
- `jasonvega1974@gmail.com` = FAITH-ONLY (`faith_only = true`).

---

## HOME-SCREEN ARCHITECTURE (built/finalized this session — know this before touching `s-hero`)

The `#s-hero` section contains three home surfaces, chosen at runtime:
- `#faithHeroCinematic` — the cinematic "Enter the Well" faith hero. Shows ONLY for faith-only accounts (`window._faithFree === true`). **This is finished and must not be touched.**
- `#appCommandCenter` — the new "Command Center" home (animated Constellation) for FULL accounts. Built today in `app/js/command-center.js`.
- `#appHome` — the legacy 6-button home. Kept in the DOM as an instant rollback (`window._ccDisabled = true`).

**The chooser** lives in `app/js/app-home.js` → `maybeRenderAppHome()`:
- faith-free → Well; parent-with-children (`body.parent-view`) → bails (those accounts route to `s-parent` via `init.js`); everyone else → Command Center.
- It has a defensive fallback: if `renderCommandCenter()` throws, it falls back to `#appHome` rather than blanking.

---

## WHAT SHIPPED THIS SESSION (already on `main` — do NOT redo)

Verify via `git --no-pager log --oneline -12`. In order:
1. **Home blank-screen fix:** stopped applying `body.parent-view` to accounts with no children; routed genuine parent accounts to `s-parent`; guarded `renderMonthlyChallenge` against an empty `MONTHLY_CHALLENGES` (it was throwing and aborting the hero render chain).
2. **Command Center home (Constellation):** new `app/js/command-center.js`; `#appCommandCenter` mounted in `s-hero`; chooser routing in `app-home.js`; `#appHome` kept as rollback. SW bumped to v231.
3. **Command Center art pass:** nebula sky, twinkling starfield, luminous breathing orbs, focus pulse rings, flowing focus links, gentle float, polished reduced-motion still, and an inviting empty state ("Day 1 — starts now"). SW bumped to **v232** (current).

---

## STANDING GUARDRAILS (apply to EVERY edit)

- **Never touch the faith "Well" experience** — no edits to `auth.js` faith gates, the `init.js` faith range (~1356–1649), the `_faithFree` logic, or `#faithHeroCinematic`.
- **`index.html` integrity, after EVERY edit:** verify `function tick()` exists, `setInterval(tick` exists, the Google Translate `<script src="//translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit">` is present before `</body>`, and the file tail is not truncated. Run the index-html guardian.
- `node --check` on every JS file you touch before committing.
- Contact email anywhere = `info@kingdom-creatives.com`. Never a gmail or yahoo address, never an obfuscated Cloudflare email link.
- Canonical domain = `https://yourlifecc.com` (NOT `yourlife.cc`, no `www`).
- Bump the Service Worker version (currently v232) whenever cached assets change.
- Show before/after diffs for every changed file BEFORE committing. Commit per file with clear messages. Then push. Then give a verification snippet.

---

## PLANNING DOCS ALREADY IN THE REPO

- `STATUS_REPORT.md` — codebase audit baseline.
- `COMMAND_CENTER_PLAN.md` — the Command Center build plan (done).
- `YOURLIFECC_APP_UPGRADE_MASTERPLAN.md` — the big 8-tab upgrade plan. **~1 month stale — treat as a wish-list, not current truth.** It misdescribes the app as a single 28,800-line file, calls Habits a "basic checklist" (Habits is reportedly already fully built), and proposes `CREATE TABLE` for tables that may already exist (e.g. `habit_completions`).

---

## IMMEDIATE TASK (read-only — no edits, no SQL, no commits)

Do these two things and STOP:

**1. Diagnose the empty "Learn" tab.** It renders blank. Find what surface "Learn" maps to (section id + nav button), why it's empty (missing render call / empty content array / "coming soon" stub / JS throw), with the specific file + line. Report only — don't fix yet.

**2. Reconcile the masterplan against reality.** Compare `YOURLIFECC_APP_UPGRADE_MASTERPLAN.md` to the ACTUAL current codebase + Supabase. For each of the 8 tabs (Chores, Money, Goals, Habits, Schedule, CBT/Learn, Skills, Parent Hub) report **DONE / PARTIAL / NOT STARTED** with evidence, and specifically:
- Habits: confirm whether it's already built to the plan's spec.
- For every `CREATE TABLE` in the plan, does that table already exist? Flag every conflict (start with `habit_completions`).
- Confirm real structure: modular `app/js/*.js` + true `index.html` line count + module list.
- Does the app actually use Tailwind CDN (as the plan claims) or custom CSS?
- Which of the 5 Storage buckets (`chore-proofs`, `goal-images`, `legacy-vault`, `cbt-thumbnails`, `skill-evidence`) already exist vs need creating?

Write findings + a corrected, de-conflicted build order to `MASTERPLAN_RECONCILED.md`. Then STOP and report.

---

## AFTER RECONCILIATION (don't start until I approve)

1. Create the 5 Supabase Storage buckets (zero-risk; they unblock Chores proof, Goals vision board, and the Skills vault at once).
2. Begin the tab upgrades **one tab at a time**, shipped and verified before the next — starting with **Chores**. Never run multiple tab agents at once.
