# F11 — iPhone Mobile Audit (read-only)

**Target:** iPhone Safari, 375–430px viewport width (iPhone SE through Pro Max).
**Scope:** `app/index.html`, `app/css/app.css`, and all marketing HTML pages.
**Date:** 2026-05-13
**Status:** READ-ONLY. No code touched. Decide which findings to fix before any work begins.

---

## 1. Executive summary

The app is **broadly mobile-aware** — every HTML page has a correct `<meta name="viewport">`, the sidebar correctly collapses to a slide-in drawer below 860px, and grids correctly drop to single-column at 520px. But there are **systemic Apple HIG violations** (44pt tap targets), a couple of **horizontal-scroll tables** that hurt one-handed iPhone use, and **no `safe-area-inset` handling** for iPhone X+ home indicator. None are app-breaking; all are friction.

**Verdict:** Functional on iPhone, but feels rough. ~12 hours of fix work to bring it to "feels native."

---

## 2. Findings by priority

### P0 — Blocks usage or causes obvious failure

#### P0-01. No safe-area-inset for iPhone X+ home indicator
- **Where:** `app/css/app.css` — zero references to `safe-area-inset` or `env(safe-area-inset-bottom)` anywhere in the file.
- **Symptom on iPhone X/11/12/13/14/15/16:** The bottom-of-page content, the Worship mini-player (`#wpMini`), the duplicate Well bottom tab bar, and the auto-lock toast all sit *under* the iPhone home-indicator strip. Users see partial elements clipped by the system gesture area at the bottom.
- **Fix shape:** Add `padding-bottom: calc(<existing> + env(safe-area-inset-bottom))` to `#app` (line 169, 178), `#wpMini` (whatever its rule is), the Well bottom tab bar, and any `position:fixed; bottom:0` element. Also `<meta name="viewport" content="..., viewport-fit=cover">` is required on `app/index.html:5` (currently missing the `viewport-fit=cover` flag).
- **Severity:** Looks unprofessional. Every iPhone built since 2017 is affected.

#### P0-02. `.btn` min-height is 36px (Apple HIG requires 44pt)
- **Where:** `app/css/app.css:210` — `.btn{...; min-height:36px;}`
- **Impact:** Every primary action button across the entire app. Save, Cancel, Lock Hub, Sign Out, plan-picker buttons, etc.
- **Why it matters:** Apple HIG says 44×44pt minimum for tap targets. 36px is small enough that thumb-edge users (women, kids, anyone with longer nails, anyone in motion) will frequently miss.
- **Fix shape:** Bump `min-height: 44px;` and increase vertical `padding` from `.5rem` to `.7rem` to fill the new height visually.

---

### P1 — Significant degradation (Apple HIG fails or readability)

#### P1-01. Tap targets well under 44pt on interactive controls
- **`.hlp` help icons** — `width:16px;height:16px` at `app.css:444`. Clickable (`cursor:pointer`).
- **`.tip-btn` tip toggles** — `17×17px` at `app.css:455`. Clickable (`cursor:help` but reacts on tap).
- **`.ck` checkboxes** — `18×18px` at `app.css:392`. Tapping the 18px square is the only way to toggle (no label-click extension visible).
- **`.tg` toggle switches** — `42×23px` at `app.css:258`. Width OK, height fails 44pt.
- **`.eb` / `.db` icon buttons** — `padding:2px 5px` at app.css:219, 221. Total tap target ~22×22px after padding + line-height.
- **Fix shape:** Either bump physical sizes, OR add invisible padding via pseudo-element to enlarge the hit area without changing visual size (`button { position: relative; } button::before { content:''; position:absolute; inset:-12px; }`).

#### P1-02. Schedule table has fixed 900px min-width
- **Where:** `app.css:397` — `.sched-table{...; min-width:900px;}`. Container `.sched-wrap{overflow-x:auto}` (line 396).
- **Impact:** On a 375px iPhone the schedule table is 2.4× the viewport. Users have to swipe sideways to see all columns, while also trying to scroll vertically. Difficult one-handed.
- **Mitigation already in place:** `overflow-x:auto` means the page itself doesn't break — but the UX is poor.
- **Fix shape options:** (a) accept it (Schedule is desktop-first); (b) build a phone-specific layout that lists each day as a stacked card; (c) reduce minimum to ~550px so it fits on Pro Max + scrolls slightly on SE.

#### P1-03. Marketing compare-table forces horizontal scroll
- **Where:** `index.html` (root) line 442 — `.compare-table{...; min-width:700px;}`.
- **Impact:** First-time iPhone visitors to the marketing site land on the pricing/plan-comparison table that's 1.6–1.9× viewport wide. They have to pinch-zoom or swipe sideways to compare plans. High likelihood of abandoning.
- **Fix shape:** Build a stacked-card variant for mobile via `@media(max-width:640px)` — show each plan as a vertical card stack instead of a horizontal table. This is the highest-conversion-impact item in the audit.

#### P1-04. ~61 instances of font-size under 0.7rem (≈11px)
- **Where:** Grep `font-size:\s*\.[3-6]\d?rem` matched 61 hits across `app.css`.
- **Spot check:** `.cep .54rem` (4068, 4105), `.bf-eyebrow` and similar (calendar event pill text, schedule cell text, badge labels). At 0.54rem the rendered size on iPhone is ~8.6px — below the legibility threshold for most readers.
- **Impact:** Older users (parents on the Parent Hub), and anyone in bright sunlight or reading without glasses, struggles. Some are decorative (small badges) and OK; many are not.
- **Fix shape:** Audit each usage. For decorative chips/badges, keep small. For anything users must read (text in calendar cells, schedule cells, hint text below inputs), bump to 0.75rem minimum.

#### P1-05. Modal `.md` uses 1.8rem padding — too much on 375px width
- **Where:** `app.css:266` — `.md{...; padding:1.8rem; max-width:500px;}`.
- **Math on iPhone SE (375px):** `#app` padding `.7rem` × 2 = 22.4px each side → modal width ≈ 352px. `.md` padding `1.8rem` × 2 = 57.6px each side → inner content width ≈ 294px. That's 78% of viewport for content, 22% lost to padding.
- **Fix shape:** Add `@media(max-width:520px){.md{padding:1.1rem;}}`.

---

### P2 — Likely issues / spot-check needed

#### P2-01. `100vh` used in 7 places — buggy on iOS Safari
- **Where:** `app.css:46` (body `min-height:100vh`), 147 (`#mainWrap`), 253 (`#sp` slide-in panel), 1779 (max-height calc), 3506/3508/3513/3514 (fullscreen modal).
- **Impact:** iOS Safari's `100vh` includes the area occupied by the address bar — when the bar collapses on scroll, content that was sized to `100vh` becomes too tall and the bottom 60px disappears off-screen. Worst case is fullscreen modal: opening it briefly shows correct height, scrolling triggers a layout shift.
- **Fix shape:** Replace `100vh` with `100dvh` (dynamic viewport height, supported in iOS Safari 15.4+, with `100vh` fallback). For the fullscreen modal, `100dvh` is essential.

#### P2-02. `#mainWrap` width calc uses `100vw - 220px`
- **Where:** `app.css:147` — `width:calc(100vw - 220px);`.
- **Impact:** On mobile (<860px) the `@media(max-width:860px){#mainWrap{margin-left:0!important;width:100%!important;}}` rule overrides — so this is OK in practice. Listed for awareness only.

#### P2-03. Body font-size is 15px (below browser default 16px)
- **Where:** `app.css:46` — `body{...; font-size:15px;}`.
- **Impact:** iOS Safari auto-zooms when input field font-size is < 16px on focus. Forms in registration, settings, password fields may trigger annoying zoom. Confirm by checking inputs: `input,textarea,select{...font-size:.92rem;}` at app.css:196 → .92 × 15 = 13.8px, well under 16. **iOS Safari WILL auto-zoom on focus.**
- **Fix shape:** Set `input,textarea,select{font-size:16px;}` on mobile breakpoints, or bump globally to `font-size:1rem` which respects user accessibility settings.

#### P2-04. Marketing hero CTA buttons — no min-height defined
- **Where:** `index.html` root file has inline-styled CTA buttons. Spot check at line 557 (CTA strip) — no `min-height` rule.
- **Fix shape:** Audit the marketing CTAs and add `min-height: 44px` to the primary CTA (`Start Free Trial` / `Sign In`) selectors. Same on `register.html`, `login.html`, `sponsor.html`.

#### P2-05. `.feat16-grid` shrinks to 2 columns at 640px but never to 1
- **Where:** `index.html:860` — `@media(max-width:640px){.feat16-grid{grid-template-columns:repeat(2,1fr)!important;}}`. No further breakdown below 480px.
- **Impact:** At 375px, two columns of 16 features = each cell ~155px wide minus gap. Likely cramped for icon + 2-line label.
- **Fix shape:** Add `@media(max-width:430px){.feat16-grid{grid-template-columns:1fr!important;}}` or accept it (the grid may genuinely look fine — verify in DevTools).

---

### P3 — Cosmetic / low priority

#### P3-01. Marketing `.demo-strip-line` shrinks but content may not
- **Where:** `index.html:228` — `.demo-strip-line{max-width:30px;}` at <600px. Verify the surrounding strip layout still makes sense.

#### P3-02. Small `.toast` width on small screens
- **Where:** `app.css:272` — `.toast{...; white-space:nowrap;}`. Long toast text on a narrow iPhone won't wrap; it may overflow the viewport horizontally. (Toast is positioned `left:50%; transform:translateX(-50%)` so center-anchored, but `nowrap` + long string = both edges clipped.)
- **Fix shape:** `@media(max-width:520px){.toast{white-space:normal; max-width:calc(100vw - 2rem);}}`.

#### P3-03. Sidebar slide-in: no overlay tap-to-close on iOS?
- **Where:** `app.css:161` — `#sideOverlay{display:none !important;}` at min-width:861px. Implies the overlay only exists on mobile. Verify the overlay actually catches taps on iPhone Safari (some older iOS versions need explicit `cursor:pointer` to register click events on non-interactive elements).
- **Fix shape:** Spot-check in DevTools. Add `cursor:pointer` to `#sideOverlay` if not present.

---

## 3. Confirmed OK (no action needed)

- **Viewport meta tags** — present and correct on all 26 HTML files (`width=device-width, initial-scale=1`).
- **Sidebar collapse** — proper slide-in drawer at ≤860px (`app.css:165-176`).
- **Hamburger button** — `#mBar` correctly shows at ≤860px.
- **Grid breakdowns** — `.g2/.g3/.g4` properly collapse via media queries at 768/520/500/440.
- **App padding shrinks on small screens** — `#app{padding:.8rem .7rem 5rem}` at ≤520px (line 178).
- **Schedule table wrapped in `overflow-x:auto`** — prevents page-wide horizontal scroll.
- **Reduced motion respected** — `@media (prefers-reduced-motion: reduce)` at app.css:3411.
- **Plan-detail modal compresses on small screens** — `@media (max-width:640px)` rule at 2805 shrinks header padding and icon size.
- **Hero compact mode persistence** — Phase 2 work means hero is already 8-card compact by default (mobile-friendly).
- **Parent Hub 4-tab pivot at ≤700px** — `#phLayout` switches to column layout with wrapping nav (`app.css:1656`).

---

## 4. Recommended fix order (highest leverage first)

| # | Item | Effort | User-visible impact |
|---|---|---|---|
| 1 | P0-01 — Add `viewport-fit=cover` + `env(safe-area-inset-bottom)` padding | 30 min | Massive on every iPhone X+ |
| 2 | P0-02 — Bump `.btn` to `min-height:44px` | 15 min | Every action button feels more deliberate |
| 3 | P2-03 — Bump form input `font-size` to 16px so iOS doesn't auto-zoom | 15 min | Eliminates the worst form-UX bug on mobile Safari |
| 4 | P1-03 — Build mobile-stacked variant of marketing compare-table | 1–2 hr | Pricing comparison readable for first-time iPhone visitors |
| 5 | P1-01 — Enlarge `.hlp`, `.tip-btn`, `.ck`, `.tg` tap targets | 30–60 min | Fewer mis-taps, especially Parent Hub help icons |
| 6 | P1-05 — Reduce modal padding on ≤520px | 10 min | Slight readability win across all modals |
| 7 | P1-04 — Bump font-size on user-readable text below 0.7rem | 1–2 hr | Better readability for everyone, parent users especially |
| 8 | P1-02 — Schedule table mobile variant (or accept current state) | 0 or 2–3 hr | Only worth fixing if Schedule is used regularly on mobile |
| 9 | P2-01 — Replace `100vh` with `100dvh` (with fallback) | 30 min | Fixes the fullscreen modal layout shift on iOS scroll |
| 10 | P2-04 / P2-05 — Marketing CTA tap targets + feat16-grid stack | 30 min | Polish before public launch |
| 11 | P3-02 / P3-03 — Toast wrap + sidebar overlay tap | 15 min | Edge cases |

**Total estimated effort if you do everything: ~8–12 hours.**

If launching publicly soon, **the top 5 items (1–5) are the production-launch must-haves**. Items 6–11 can be a follow-up polish phase.

---

## 5. Not covered in this audit

- **In-app accessibility (aria-labels, focus states, keyboard nav)** — separate audit needed if you care about a11y compliance.
- **Real-device test** — I can only static-analyze. You should still load https://yourlifecc.com on an actual iPhone before claiming victory.
- **Network performance on mobile** — large JS / image weight is a separate concern.
- **iPad / tablet layout** — explicitly out of scope per your selection ("iPhone only").

---

## 6. How to proceed

Tell me which P0/P1/P2 items you want fixed and I'll bundle the work into one deploy (similar to F10's close-out pattern). Suggested groupings:

- **Quick win bundle (~1.5 hr):** P0-01 + P0-02 + P2-03 — invisible-feeling but everything snaps into place on iPhone.
- **Mid bundle (~4 hr):** Quick win + P1-01 + P1-05 + P2-01 — visible improvement, no new layouts.
- **Full bundle (~8–12 hr):** All P0/P1/P2 items including the mobile compare-table variant and the schedule mobile layout.

Awaiting your call on which to ship.
