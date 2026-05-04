# F0 Follow-ups

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
- ✅ `auth.js`: `FAITH_FREE_ALLOWED` const + `isSectionAllowed()` helper + `window._faithFree` flag in `checkPlanStatus()`
- ✅ `ui.js`: section gating in `buildSideNav()`, fail-closed redirect in `showSection()`, DOM hide block in `applySettings()` covering sections, hero tile grid, Refer & Earn buttons, hero child-stats widgets, Child Login buttons, child avatar
- ✅ `service-worker.js`: `CACHE_NAME` bumped from `yourlifecc-v6` → `yourlifecc-v7`
