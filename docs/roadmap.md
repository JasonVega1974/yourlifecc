---
name: A+ roadmap — phased plan to ship YourLife CC at production grade
description: Multi-phase plan agreed 2026-04-27 to take the app from B/B+ to A+. Each phase is one deploy bundle. Reference this when Jason returns to work on a phase.
type: project
originSessionId: 371ae289-e197-4770-b833-616519e16446
---
On 2026-04-27 we audited YourLife CC end-to-end (security, bugs, UX, branding) and built a phased plan to take it from B/B+ to A+. Each phase bundles related work into one deploy to minimize iteration cost.

**Why:** Jason explicitly asked for a roadmap to A+ after the audit. He works alone, deploys cost real money, and prefers comprehensive bundled changes over iterative ones.

**How to apply:** When Jason starts a new conversation and says "let's do phase N" or "next phase", load this file, confirm the phase, and execute. Each phase is independent — do not cross phase boundaries without explicit approval.

---

## Audit baseline (2026-04-27)

| Category | Grade |
|----------|-------|
| Idea/vision | A |
| Visual design | B+ |
| UX/clarity | C+ |
| Onboarding | B+ |
| Feature depth | A− |
| Code health | B |
| Security | C |
| Workflow integrity | C+ |
| **Overall** | **B / B+** |

Key facts: 29 sections, ~95–110 features, 27 sidebar nav items in 8 groups, ~34,700 LOC, `app/js/skills.js` is 6,137 lines. Marketing palette `#4f8fff/#06d6a0` differs from app palette `#38bdf8/#a78bfa`. Three font families (Bebas Neue, Inter, Orbitron).

## Phases

### Phase 0 — Stop the bleeding (1 deploy, ~2 hrs) → B+
- Plan-gating fail-closed at `app/js/auth.js:281` (currently fails open — revenue leak)
- Strip emails/IDs from `app/js/sync.js` console logs (lines 85, 94, 101, 141)
- Delete orphaned `firstTimeGate` modal at `app/index.html:195-217` (dead — `showFirstTimeGate()` already short-circuits to `finishInit()`)
- Replace "Lessons coming soon" placeholder at `app/js/skills.js:3905`
- Reconcile pricing copy with private-beta CTAs

### Phase 1 — Security rework (2 deploys, ~weekend) → A−
**1.1 PIN model**
- Hash parent PIN client-side (SHA-256 + salt from `_supaUser.id`); store hash only
- Decouple child PIN from profile ID — add separate `pinHash` field; migrate by hashing current id once with a one-time "set new PIN" banner
- Kill `_parentDashUnlocked` localStorage cache; use 5-min in-memory unlock window only

**1.2 Hardening**
- Escape user text in parent-notes innerHTML paths (`parent.js:252-261, 269-274`)
- 30-min idle timeout for parent-only actions
- Action item (not code): verify Supabase RLS policies on `profiles` table

### Phase 2 — Progressive disclosure (2 deploys, ~weekend) → A−
**2.1 Age picker on first launch**
- 12–14: 7 sections (Home, Chores, Goals, Mood, Habits, Reading, Scripture, Rewards)
- 15–17: above + School, Health, Finance basics, Driving, Skills (12)
- 18–22: full surface
- Wire to existing `D.sections` toggle system

**2.2 Density**
- Collapse sidebar groups by default (except Daily Life)
- Hero "compact mode" — 8 priority cards + "Show all stats" expander
- Parent Hub: pivot to "Manage [Child]" with 4 tabs (Activity/Rewards/Controls/Reports)

### Phase 3 — Visual & brand polish (1 deploy, ~half day) → A
- Unify palette to app's `#38bdf8/#a78bfa` everywhere
- Light-mode contrast pass (~10 sections need fixing)
- Typography to two fonts: Bebas Neue (large headings) + Inter (rest); drop Orbitron
- Final "Life OS"/"LIFE OS" → "YourLife CC" find-replace

### Phase 4 — Re-enable public signup (1 deploy after Brevo fixed) → A
- Prerequisite: Brevo click tracking OFF on activation CTA button (see `REVERT_CHECKLIST.md` for full revert plan)
- Smoke-test resend flow in `activate.html` (rewritten, untested under load)
- Follow `REVERT_CHECKLIST.md` exactly

### Phase 5 — Differentiator ship (ongoing, weeks) → A+
- Ship 1–2 complete Life Skills lessons (video + quiz + badge) — proves the platform
- Family Activity Feed on parent home (one-glance reassurance = real JTBD for parents)
- Weekly progress email digest (uses existing infra)
- Public changelog at `/changelog`

## Current status

**Phase 1 (security) complete and live.** Phase 0 + Phase 1.1 add-on + Phase 1.1 main hardening + emergency hotfix all shipped and QA-passed as of 2026-04-28. Jason wants A++ across all three paths (Trusted Family Dashboard + Skills Library + Best UX). Next decision: Phase 2 (progressive disclosure — biggest visible UX delta) or pivot to Phase 5 differentiator items.

## Phase 1.1 add-on (2026-04-28) — SHIPPED AND LIVE

**What shipped (in this bundle):**
- Parent PIN hashed: `D.parentPinHash = SHA-256(PIN + ":" + _supaUser.id)`. Plaintext fields cleared on migrate. Hash mirrored onto parent profile data so verify works while a child is active.
- Child PIN decoupled from `profile.id`: new `profile.pinHash` field. Legacy id-as-PIN fallback preserved for unmigrated children. New children created post-migration get a stable random `id` (`c_<rand>`) plus separate `pinHash`.
- Migration state machine on `D.pinMigration` with status `pending → parent_done → in_progress → complete`. Idempotent + resumable across crashes. Banner at top of Parent Hub walks parent through new parent PIN then each child PIN. "Set up later" defer allowed; banner re-appears next Hub visit until complete.
- Forgot Parent PIN: link below the parent gate. Re-confirms Supabase password (`signInWithPassword`), then sets new hashed PIN. **No tokens, no email, no Edge Function** — collapsed the original spec's recovery flow because Supabase auth is the existing strong layer and Brevo click-tracking remains a known landmine.
- Child logout: caret/chevron next to `#heroName` opens a dropdown with **Switch profile** + **Sign out**. Sign out clears `_activeProfileId`, `_parentDashUnlocked`, `sessionStorage.parentUnlocked`, `localStorage.lifeos_parent_unlocked`. Routes to profile picker if `_supaUser` alive, else `login.html`. Outside-click + Escape close. ARIA-expanded toggled.
- `renderProfileSwitcher` no longer prints `profile.id` as the access code (was leaking PIN for unmigrated kids and showing wrong info post-migration).

**Files touched:** `app/js/auth.js`, `app/js/parent.js`, `app/js/email.js`, `app/js/init.js`, `app/index.html` (truncation guard verified — `function tick()` line 6343, `setInterval(tick` 6358, Google Translate script 6551, file 6829 lines), `app/css/app.css`.

**Known security caveat to flag if anyone audits later:** SHA-256 of a 4–6 digit PIN is brute-forceable in milliseconds if the hash leaks. Strict improvement over plaintext, but if defensive depth is ever needed, upgrade path is PBKDF2 with high iteration count (or move PIN check entirely server-side). Documented here so it's not a surprise.

## Phase 1.1 main hardening (2026-04-28) — SHIPPED AND LIVE

**What shipped:**
- `_parentDashUnlocked` storage cache killed — replaced with timed in-memory unlock: 5-min sliding idle window + 30-min hard cap. Activity (mousedown/keydown/touchstart/wheel) bumps idle to 5 min from now, capped at hard-cap. After 30s polling auto-locks and shows toast "Parent session timed out — please re-enter PIN". `D.parentPinDisabled` opt-out respected (no enforcement).
- XSS-defense: `n.text/n.date/n.time` escaped in `renderParentNotes` and `renderKidParentNotes` via new `escapeHtml()` helper at top of `parent.js`. Spec-named lines 252-274 turned out to be 264-273 + 281-286 due to add-on shifting.
- Stale storage cleanup retained in `lockParentDash` and `signOut` for one deploy to flush legacy `sessionStorage.parentUnlocked` and `localStorage.lifeos_parent_unlocked` flags.

**Files touched:** `app/js/parent.js`, `app/js/auth.js`, `app/js/ui.js`, `app/index.html` (one inline onclick at line 6088, truncation guards intact).

**Supabase RLS verified clean:** `rowsecurity=true` on `profiles`, two policies (one INSERT-only, one ALL) both require `user_id = auth.uid()`. Live cross-user check via browser console returned only Jason's own row (1 visible). No leak. Optional cleanup: drop the redundant INSERT-only policy (cosmetic only).

## 2026-04-28 hotfix — applyName recursion + idempotent wrappers — SHIPPED AND LIVE

**What broke:** After main 1.1 deploy, every JS file logged `Identifier 'X' has already been declared` errors — 15 files loaded twice on the live server. Root cause unconfirmed (Vercel/SW state, not local file). The double-load triggered an existing latent bug: the inline `applyName` and `refreshDashForCurrentChild` wrappers in `index.html` re-wrapped on second run, capturing themselves as `_origApplyName` → infinite recursion → `RangeError: Maximum call stack size exceeded` → page broken (Settings wouldn't open, parent onboarding wizard stuck).

**What shipped:** Idempotency guards (`window.__ylccApplyNameWrapped`, `__ylccHeroViewDomReadyAttached`, `__ylccRefreshDashWrapped`) in `app/index.html`. Also bumped `service-worker.js` cache `yourlifecc-v5 → v6` to force clients to flush stale cache and refetch.

**Files touched:** `app/index.html`, `service-worker.js`.

**Still TBD (not blocking):** Why scripts were double-loading in the first place. Defenses now make it cosmetic (console noise) instead of fatal. Investigate by viewing raw deployed `https://yourlifecc.com/app/index.html` and counting `<script src="/app/js/config.js">` occurrences — if 2+, server-side duplication is the cause.
