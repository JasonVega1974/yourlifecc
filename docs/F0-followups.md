# F0 Follow-ups

**Status:** F0 CLOSED 2026-05-04. Faith-free gating is live, tested on a Stripe-free test account, demoable to a youth pastor. Subsequent work tracked in [`F1-spec.md`](F1-spec.md) and the deferred items below.

Tracking items deliberately deferred during the Faith-Free Tier Foundation (F0) phase, plus tangential issues surfaced during F0 work.

## Punted from F0 to later phases

### F2: Settings page section toggle filter for faith_free
- **Where:** [`buildToggles()`](../app/js/ui.js) and `ALL_SECTIONS` in `app/js/ui.js`.
- **Issue:** A faith_free user who opens Settings sees toggle UI for sections they can't access. Toggling them is functionally inert (sidebar is plan-filtered, DOM is plan-hidden via `applySettings()`), but it's a UX wart.
- **Action when addressed:** filter `ALL_SECTIONS` (or `buildToggles`) by `isSectionAllowed(s.id)` for `_faithFree` users so the Settings panel only shows toggles for the allowed sections.
- **Why deferred:** Cosmetic only. F2 is the right moment because that's when the upsell flow lives — the Settings panel may need broader rework alongside that.

### F1: Hero variant for faith_free
- **Where:** `s-hero` in `app/index.html`. F0 hides individual widgets via `display:none` in `applySettings()` (`#heroHeadline`, `#heroMicroStats`, parents of `#dacGrid` / `#lifeMapBoard` / `#checkinGrid`, `#childAvatarWrap`).
- **Action when addressed:** F1 is supposed to ship a compact faith-themed Hero variant. When that lands, the F0 `if(window._faithFree){...}` block in `applySettings()` can be simplified — the new hero structure should render only faith content for faith_free in the first place, removing the need for the per-element hide loops.

## Production-blocking — must be resolved before F2 launches a real signup flow

### faith_free must never touch Stripe (architectural)
- ✅ **Resolved 2026-05-14 — F6 SPLICE POINT 2 faith_only guard now live.** The Stripe webhook handler now checks `profiles.plan_status='faith_free'` AND `profiles.faith_only=true` before any `syncStatus()` write and short-circuits with log line `🛡️ faith_only guard: skipped plan_status sync for cust ...`. Combined with the donation router (SPLICE POINT 1) that prevents donation-tagged events from reaching the subscription path, this closes the production-blocking gap. The architectural fix (faith_free signup never creating a Stripe customer) is still the canonical safety; SPLICE POINT 2 is the belt-and-suspenders defense documented below.
- **Principle:** faith_free is a free, payment-free, Stripe-free tier. The user flow is `link → register → in`. No checkout, no Stripe customer, no Stripe webhook ever fires for a faith_free account.
- **Why this matters (hit live during F0 testing on 2026-05-04):** The test account `jason.vega07@yahoo.com` was a real paid Stripe-linked account. We manually `UPDATE`'d `plan_status='faith_free'`, which worked. A subsequent Stripe webhook (subscription.updated or similar) overwrote the row back to `'active'` because the receiver blindly trusts Stripe as the source of truth for plan_status. Result: the gating silently stopped applying.
- **Real fix (F2):** The faith_free signup flow must:
  1. Create the `profiles` row with `plan_status='faith_free'` directly — no Stripe checkout step.
  2. Never call `stripe.customers.create()` for these accounts.
  3. Never write `stripe_customer_id` on these rows.
  - Result: no Stripe customer exists → Stripe never sends a webhook for this user → the row is never clobbered.
- **Belt-and-suspenders defense (recommended in the webhook receiver):** Even with the architectural fix, add a guard in the Stripe webhook handler: `IF existing plan_status = 'faith_free' THEN skip update`. Defends against future bugs where a paid user gets manually flipped to faith_free by support.
- **Where the webhook likely lives:** check `api/` directory for the Stripe webhook receiver (likely a file like `api/stripe-webhook.js` or similar).
- **Severity:** Production-blocking before F2's signup flow ships. If real faith_free users existed today, any Stripe webhook firing for an unrelated user could in theory have side effects depending on how the receiver is structured. Verify the receiver targets a specific user_id and not e.g. all rows.

### URL routing — `/app/index.html` should be `/app/`
- **Issue:** Visiting `yourlifecc.com/app/` works, but the URL bar sometimes shows the explicit filename `yourlifecc.com/app/index.html` after navigation — looks unprofessional and is harder to share verbally.
- **Action:** Configure the host (Vercel: `cleanUrls: true` in `vercel.json`, or a redirect rule rewriting `/app/index.html` → `/app/`).
- **Severity:** Cosmetic, but visible to every user.
- **Where to fix:** repo-root `vercel.json` (or equivalent `_redirects` / `netlify.toml` / nginx config depending on host).

## Tangential — not strictly F0, worth tracking

### Brittle onclick-attribute selector for Refer & Earn button hide
- **Where:** [`applySettings()`](../app/js/ui.js) — `document.querySelectorAll('button[onclick*="showSection(\'s-referral\'"]')`.
- **Issue:** Selector matches based on the literal `onclick` attribute string. If the buttons in `app/index.html` ever get refactored (e.g., onclick → addEventListener, or string args change), the hide silently breaks.
- **Action:** When F2 touches the global top bar, give the Refer buttons a stable `data-` attribute or class (e.g., `data-faith-free-hide`) and switch the selector to that.

### Avatar tooltip copy is parent/child-framed
- **Where:** `app/index.html` line ~765 — `<div id="childAvatarWrap" ... title="Upload child photo or choose avatar">`. Same parent/child framing in the avatar picker modal at line ~6358 (`#childAvatarModal`).
- **Issue:** Even for paid users (where the avatar is visible), the tooltip says "child" — awkward when a parent is using the dashboard for themselves rather than a kid.
- **Action:** Reword tooltip + modal copy to be neutral (e.g., "Upload a photo or choose an avatar"). Investigate whether the modal flow has any other parent/child-specific text that needs neutralizing.
- **Note:** This applies to ALL users, not just faith_free. faith_free users don't see the avatar at all (F0 hides `#childAvatarWrap` via `applySettings()`), so this fix is for paid users.

## Items completed in F0 (for reference)

- ✅ Supabase: `plan_status` constraint extended to allow `'faith_free'`
- ✅ `auth.js`: `FAITH_FREE_ALLOWED` const (`['s-hero', 's-scripture']` — `s-parent` removed 2026-05-04 because faith_free is a single-person tier with no parent/child role), `isSectionAllowed()` helper, `window._faithFree` flag in `checkPlanStatus()`, onboard.html redirect skipped for faith_free in `authComplete()`.
- ✅ `ui.js`: section gating in `buildSideNav()`, fail-closed redirect in `showSection()`, DOM hide block in `applySettings()` covering sections, hero tile grid, Refer & Earn buttons, hero child-stats widgets, Child Login buttons, child avatar, parent welcome card (with `setProperty('display','none','important')` to beat stylesheet `!important`), Parent top-bar buttons.
- ✅ `init.js`: parent onboarding wizard suppressed for faith_free (`!window._faithFree` guard added to the `showParentOnboard` trigger).
- ✅ `service-worker.js`: `CACHE_NAME` bumped from `yourlifecc-v6` → `yourlifecc-v7`
- ✅ Sidebar IA flattened — `_group_faith` removed, `s-scripture` ("Bible & Faith") promoted to a top-level `NAV_ITEMS` entry. Removed the redundant nested "Faith → Bible & Faith" tab. F1 will re-introduce the Faith group with sub-items (Devotionals / Jesus & Purpose / Learn the Bible / Bible Study / Bible (ESV) / My Journey / Worship Playlist / Church Resources).
- ✅ `faith.js`: `+5 pts` caption suppressed for faith_free on the daily devotional CTA + completed state. Internal `D.scrPoints` accumulation still runs (not surfaced in faith_free UI; harmless).
