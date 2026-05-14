# YourLife CC — Design System

## Context

This document defines the canonical design tokens and component patterns for YourLife CC across both the full paid app and the Phase 6 Faith-Only path. The goal is consistency without restyling working surfaces: existing pages (Faith hub, Christian Life Guide, Worship Playlist) stay visually intact; new surfaces (notification bell, donation flow, family faith modules) inherit the tokens defined here.

Tokens are defined in pure values (hex, px, ms) and mapped to semantic names. Implementation is deferred — this doc describes the system; CSS variables and component code follow in their own phase.

**Status:** Draft. Faith accent color is the primary open decision (three options proposed in §1). Component patterns are described, not coded.

---

## 1. Color palette

### Core (carry-forward — do not change)

The existing app palette stays the canonical brand:

| Token | Hex | Use |
|-------|-----|-----|
| `--brand-primary` | `#38bdf8` | Primary actions, links, focus rings, sky-blue brand half |
| `--brand-secondary` | `#a78bfa` | Secondary actions, accents on cards, violet brand half |

Marketing-page palette `#4f8fff / #06d6a0` is being unified to the app palette per the Phase 3 roadmap item. This doc treats `#38bdf8 / #a78bfa` as the only brand pair going forward.

### Faith accents — locked in (2026-05-06)

Two faith accents are confirmed:

| Token | Hex | Role |
|-------|-----|------|
| `--accent` (primary faith) | `#4338ca` (deep indigo) | Carries the main faith-side surfaces |
| `--accent-secondary` (faith) | `#14b8a6` (sanctuary teal) | Secondary moments on faith surfaces |

Indigo extends the existing violet brand half; teal is differentiated enough from the cyan brand half that the two read cleanly as separate roles, not "two blues." Both must clear the contrast checks in §8 against `--surface-1` and `--surface-2` in dark mode (verify in light mode during the Phase 3 contrast pass).

#### Where each accent is used

| Surface / element | Color |
|-------------------|-------|
| Faith-Only registration page (CTA, header band) | `--accent` (indigo) |
| Donation flow — sheet header, primary "Give" button, recurring toggle highlight | `--accent` (indigo) |
| Christian Life Guide modal headers — icon background + category badge | `--accent` (indigo) |
| Notification bell — Ministry-highlight dot (mode 3) | `--accent` (indigo) |
| Faith-side primary CTAs — daily devotional, story-mode start, plan start | `--accent` (indigo) |
| Faith-only hero card — accent stripe / left border | `--accent` (indigo) |
| Faith section badges — "Youth", "Family", "Group", "Leader" tier chips | `--accent-secondary` (teal) |
| Streak unlock / completion success states on faith surfaces | `--accent-secondary` (teal) |
| Accent borders on faith cards — left rule, hover outline | `--accent-secondary` (teal) |
| Progress markers on reading plans / Bible Lands map / Visual Bible Timeline | `--accent-secondary` (teal) |
| Group Bible Study / Youth curriculum — session-complete checkmarks | `--accent-secondary` (teal) |
| "Through a Faith Lens" companion chips on Life Skills surfaces | `--accent-secondary` (teal) |

Indigo and teal **never** appear in non-faith chrome. The cyan/violet core remains for everything outside the faith surface — primary CTAs in non-faith chrome, focus rings app-wide, the existing paid-app hero, sidebar nav highlights, Life Skills quiz UI, etc.

### Semantic tokens

These are role-based; the underlying hex maps to either core or accent.

| Semantic | Default value | Notes |
|----------|---------------|-------|
| `--primary` | `#38bdf8` | Primary CTA, link, focus |
| `--secondary` | `#a78bfa` | Secondary CTA, complementary accents |
| `--accent` | `#4338ca` (indigo) | Faith primary — registration, donate, CLG headers, notification mode-3 dot, faith CTAs |
| `--accent-secondary` | `#14b8a6` (teal) | Faith secondary — tier badges, faith success states, accent borders, progress markers |
| `--success` | `#10b981` | Confirmations, streak unlocks, completed states |
| `--warning` | `#f59e0b` | Attention without alarm |
| `--error` | `#ef4444` | Destructive, validation failure |
| `--info` | `#06b6d4` | Neutral notice (lighter than primary) |

### Surface levels (dark mode default)

| Token | Hex | Purpose |
|-------|-----|---------|
| `--bg` | `#0b1020` | App background, lowest level |
| `--surface-1` | `#0f1629` | Card / sidebar |
| `--surface-2` | `#172036` | Elevated card / hover state |
| `--surface-3` | `#1f2a44` | Modal / popover |
| `--surface-4` | `#2a3656` | Toast, notification bell drawer |
| `--border` | `rgba(148,163,184,0.15)` | Subtle dividers |
| `--border-strong` | `rgba(148,163,184,0.30)` | Card outlines, focus rings on dark |

### Surface levels (light mode)

Light mode is currently incomplete — the Phase 3 light-mode contrast pass addresses ~10 sections. Tokens here define the target.

| Token | Hex | Purpose |
|-------|-----|---------|
| `--bg` | `#f8fafc` | App background |
| `--surface-1` | `#ffffff` | Card |
| `--surface-2` | `#f1f5f9` | Hover / subtle inset |
| `--surface-3` | `#ffffff` | Modal (with shadow, not surface delta) |
| `--surface-4` | `#ffffff` | Toast / drawer (with shadow) |
| `--border` | `rgba(15,23,42,0.08)` | Dividers |
| `--border-strong` | `rgba(15,23,42,0.16)` | Card outlines |

### Text on surface

| Token | Dark mode | Light mode |
|-------|-----------|------------|
| `--tx` | `#e2e8f0` | `#0f172a` |
| `--tx-muted` | `#94a3b8` | `#475569` |
| `--tx-subtle` | `#64748b` | `#64748b` |
| `--tx-on-primary` | `#0b1020` | `#ffffff` (on cyan) — verify contrast |

---

## 2. Typography

### Family stack

| Family | Use | Status |
|--------|-----|--------|
| **Bebas Neue** | Display headings only (hero, section titles) | Carry forward |
| **Inter** | Everything else (body, UI, small caps, code) | Carry forward |
| **Orbitron** | (none) | **Dropped.** Phase 3 roadmap line item. Replace existing Orbitron usage with Bebas Neue or Inter Medium per context. |

CSS stack:

```
--font-display: 'Bebas Neue', 'Impact', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type scale

Mobile-first. Desktop scales up via fluid `clamp()` at the consumer site; in-app uses fixed sizes for predictability.

| Token | Size (mobile) | Size (desktop) | Weight | Line height | Family |
|-------|---------------|----------------|--------|-------------|--------|
| `--type-display` | 40px | 56px | 400 (Bebas) | 1.0 | Display |
| `--type-h1` | 28px | 36px | 700 | 1.15 | Body |
| `--type-h2` | 22px | 28px | 700 | 1.2 | Body |
| `--type-h3` | 18px | 22px | 600 | 1.3 | Body |
| `--type-body` | 15px | 16px | 400 | 1.55 | Body |
| `--type-body-sm` | 13px | 14px | 400 | 1.5 | Body |
| `--type-caption` | 11px | 12px | 500 | 1.4 | Body |
| `--type-mono` | 13px | 14px | 400 | 1.5 | Monospace fallback |

### Use guidance

- **Bebas Neue** is reserved for emotional / branded surfaces — hero headlines, section banners, marketing landings. Never for body or UI labels (Bebas at small sizes is illegible).
- **Inter Bold (700)** carries everything that would otherwise be Bebas at small sizes.
- **Inter Medium (500)** for inline emphasis, chip labels, button text.
- **All-caps**: use sparingly. If applied, increase letter-spacing to `0.04em`.
- **Tabular numerals** (`font-feature-settings: "tnum"`) on any column showing currency, points, streaks, dates — keeps columns aligned.

### Vertical rhythm

Default body line-height `1.55`. Paragraph spacing = `0.75 × line-height` (≈18px at 16px body). Section spacing = `2 × line-height` (≈40px). Don't introduce custom margins per component; use the spacing scale (§3).

---

## 3. Spacing

4px base unit. Most surfaces use 8 / 16 / 24 / 32. The 4px and 12px steps are for tight component internals.

| Token | Value | Common use |
|-------|-------|-----------|
| `--space-1` | 4px | Icon-to-label gap, badge padding |
| `--space-2` | 8px | Tight stack, form-field internal padding |
| `--space-3` | 12px | Comfortable stack, card padding (small) |
| `--space-4` | 16px | Default card padding, vertical rhythm |
| `--space-5` | 24px | Card padding (comfortable), modal body sides |
| `--space-6` | 32px | Section internal margin |
| `--space-7` | 48px | Section-to-section margin |
| `--space-8` | 64px | Hero / large layout breaks |

### Layout rules

- **Card-internal padding**: 16px or 24px. Avoid 20px or 28px.
- **Card stack gap**: 16px on mobile, 24px on desktop.
- **Section vertical padding**: 32px / 48px / 64px depending on density.
- **Touch target spacing**: a minimum 8px gap between any two tappable elements (44px target rule below).

---

## 4. Radius and shadow tokens

### Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 6px | Inputs, chips, badges |
| `--radius-md` | 10px | Buttons, small cards |
| `--radius-lg` | 16px | Standard card |
| `--radius-xl` | 24px | Hero card, modal, drawer |
| `--radius-full` | 9999px | Pills, avatar, FAB |

### Shadow / elevation

Six elevation levels. Dark mode shadows use a darker / more transparent base; light mode uses softer color.

| Token | Dark mode | Light mode | Use |
|-------|-----------|------------|-----|
| `--elev-0` | `none` | `none` | Flush with surface; no shadow |
| `--elev-1` | `0 1px 2px rgba(0,0,0,0.40)` | `0 1px 2px rgba(15,23,42,0.06)` | Resting card |
| `--elev-2` | `0 4px 12px rgba(0,0,0,0.50)` | `0 4px 12px rgba(15,23,42,0.08)` | Hover card, dropdown |
| `--elev-3` | `0 10px 30px rgba(0,0,0,0.60)` | `0 10px 30px rgba(15,23,42,0.12)` | Modal, popover |
| `--elev-4` | `0 20px 50px rgba(0,0,0,0.70)` | `0 20px 50px rgba(15,23,42,0.18)` | Dialog, drawer |
| `--elev-glow-primary` | `0 0 24px rgba(56,189,248,0.45)` | (skip in light mode) | Branded glow on primary CTAs at rest |
| `--elev-glow-accent` | `0 0 24px rgba(67,56,202,0.45)` | (skip in light mode) | Faith accent glow on faith CTAs (indigo) |

Glow shadows are dark-mode-only; the existing app already uses them on the hero. Do not add to light mode.

---

## 5. Motion tokens

### Durations

| Token | Value | Use |
|-------|-------|-----|
| `--motion-instant` | 100ms | Tooltip show/hide, focus-ring fade-in, dot indicators |
| `--motion-fast` | 200ms | Button press, hover transitions, toast slide-in |
| `--motion-base` | 300ms | Modal open/close, drawer slide, card flip |
| `--motion-slow` | 500ms | Hero entrance, route transition, celebration FX |

### Easings

YourLife CC standardizes on three easings:

| Token | Curve (cubic-bezier) | Use |
|-------|----------------------|-----|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances. Things appearing on screen. Fast start, settle gentle. |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes that go and return (toggles, hover→hover-out). |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits. Things leaving (rare; default to `--ease-out` for both directions if unsure). |

### When to use each

- **Entrance (toast, modal, drawer, card reveal)**: `--motion-base`, `--ease-out`.
- **Hover / focus highlight**: `--motion-fast`, `--ease-in-out`.
- **Tap feedback (button press)**: `--motion-fast`, `--ease-in-out`.
- **Hero / route transition**: `--motion-slow`, `--ease-out`.
- **Celebration FX (streak unlocks, badges)**: `--motion-slow` chained with a 200ms hold and a 200ms fade — total ~900ms. Existing F4-C celebration FX should be audited against this.
- **Loading skeleton shimmer**: 1.4s linear infinite — separate from the durations above.

### Reduced-motion

`@media (prefers-reduced-motion: reduce)` collapses all `--motion-*` to `0ms` except: cross-fades stay at 100ms, focus-ring fade-ins stay at 100ms. Long entrances become instant snaps. No celebration FX. This is non-negotiable for accessibility.

### Framer Motion mapping

If/when Framer Motion is introduced (currently vanilla JS only — but the design system speaks the language):

```
ease-out:    [0.16, 1, 0.3, 1]
ease-in-out: [0.4, 0, 0.2, 1]
ease-in:     [0.4, 0, 1, 1]
```

---

## 6. Sound principles

### Stance

Sound is **subtle, opt-in, never default-on**. The bar is Hallow's restraint: no surprise sounds, no celebratory chimes that interrupt prayer or scripture. A user who has not toggled sound on hears nothing.

### Categories

| Category | Trigger | Volume cap | Examples |
|----------|---------|-----------|----------|
| **Success chime** | User-confirmed milestone (streak, badge, plan completion) | -16 LUFS | One ~600ms tone, gentle bell or single piano note. Never percussion. |
| **Transition** | Route change, modal open/close (very rarely justified) | -22 LUFS | Soft swoosh ~150ms. Default off; opt-in only. |
| **Ambient** | Long-form content (reading plan reading mode, prayer timer) | -28 LUFS | Loopable nature / room tone, 30s+ loop, fade in/out. |

### Rules

- **Default state: all categories off.** First-run never plays a sound.
- **Single global mute** in the app shell (top bar, near the notification bell).
- **Per-category toggles** in Settings → Sound.
- **Streak / celebration sounds** must be skippable mid-play (any tap or Escape silences).
- **No nested sounds**: never play a chime over a Worship Playlist track or an ambient loop. The active sound takes precedence; the lower-priority sound is suppressed.
- **Sound files**: 96kbps mono OGG/Opus, all under 80KB. The app shell does not fetch sound files until the user has flipped the master toggle.
- **Reference bar**: Hallow's session start chime (a single low bell, 1.5s decay). Aim for that level of restraint. Do not emulate Duolingo's combo sounds — wrong register entirely for this product.

---

## 7. Notification bell — component spec

This is the canonical spec for the §9 component in `docs/faith-only-spec.md`. Same component, same placement, in faith-only and full app.

### Anatomy

```
┌────────────────────────────────────────────────┐
│  [logo]            … hub …       [🔔][user]    │  app shell top bar
└────────────────────────────────────────────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  Notifications  ×│
                              ├──────────────────┤
                              │ [Personal][Anns]│
                              │     [Ministry]  │
                              ├──────────────────┤
                              │ ● Day 7 streak  │
                              │   2 min ago     │
                              ├──────────────────┤
                              │ ● New devo: …   │
                              │   1 hour ago    │
                              ├──────────────────┤
                              │  [Settings]     │
                              └──────────────────┘
```

### Visual states

| State | Cue |
|-------|-----|
| **No unread** | Bell icon only, `--tx-muted` color, no badge |
| **Unread (1–9)** | Bell icon `--tx`, badge with count in `--primary` |
| **Unread (10+)** | Badge shows `9+` |
| **Active** (drawer open) | Bell icon `--primary`, no badge color change |
| **Disabled** (notifications muted) | Bell icon `--tx-subtle`, no badge ever |

### Color cues per mode

| Mode | Dot color |
|------|-----------|
| Personal (notifications) | `--primary` (cyan `#38bdf8`) |
| Announcements (system) | `--secondary` (violet `#a78bfa`) |
| Ministry / sponsor | `--accent` (indigo `#4338ca`) |

### Frequency limits

The bell enforces frequency caps in its badge logic — mirrored from the canonical rule in `docs/faith-only-spec.md` §9:

- **Personal mode:** max 1 emission per calendar day (00:00–23:59 user-local).
- **Announcements + Sponsor / Ministry combined:** max 1 per session, no two within any rolling 24 hours regardless of session count.
- **Session** = continuous app usage with idle ≤ 30 min (idle measured by absence of `mousedown / keydown / touchstart / wheel` events; reuses the Phase 1.1 parent-dash idle timer in `app/js/parent.js`).
- **Over-cap notifications are queued, not dropped** — emitted at the next eligible session or day. The badge increments only on actual emission, so the drawer never accumulates a backlog.

**Source basis:** `docs/competitor-faith-landscape.md` (notification-pattern section) — opt-out risk above 5–6 pushes/week is documented industry data, and Hallow's high-cadence notifications draw repeated App Store complaints.

### Interaction

- Click bell → drawer opens (right-aligned, 360px wide on desktop, 100% width minus 16px on mobile).
- ESC, click-outside, or bell re-click → close.
- Tab order: bell → first item → next → ... → "Notification settings" link.
- Tabs at top of drawer cycle: Personal / Announcements / Ministry.
- Each item is a button (entire card clickable) with focus ring.
- Mark-read on item view (when drawer is open and item is in viewport for >300ms — debounce so a fast scroll doesn't mark all read).
- "Mark all read" button at top-right of drawer.

### Empty states

Each tab shows its own empty state if no items:

| Tab | Empty copy |
|-----|-----------|
| Personal | "Nothing new. We'll ping you when there's a streak unlock or a new devotional." |
| Announcements | "All caught up." |
| Ministry | "No active highlights right now." |

### Placement consistency

- Same coordinate (top-right of app shell), same icon, same drawer behavior across faith-only and full app.
- Visible at all viewport widths. On narrow mobile (<400px), the drawer becomes full-screen with a back button; the bell stays in the same place.

---

## 8. Accessibility

### Contrast minimums

- **Body text on surface**: WCAG AA — minimum 4.5:1.
- **Large text (>18px or >14px bold)**: minimum 3:1.
- **Non-text UI** (icons, focus rings, dividers signaling boundaries): minimum 3:1.
- **Faith accent (`#4338ca` indigo) and accent-secondary (`#14b8a6` teal)**: both must clear 3:1 for non-text use against `--surface-1` and `--surface-2`; if used as text color, must clear 4.5:1. Indigo against the dark-mode surface clears comfortably. Teal sitting near the cyan brand color is the contrast risk to verify during the Phase 3 light-mode contrast pass — both must be visually distinguishable from `--primary` (`#38bdf8`) and from each other.

### Tap targets

- **Minimum 44×44px hit area**, even if visual is smaller (use padding to expand the click region).
- **Spacing between targets**: 8px minimum.
- The notification bell, sidebar nav, and settings cogs all currently meet this; the inline filter tabs in the Christian Life Guide and the small action chips in cards need verification.

### Focus states

- Every interactive element has a visible focus indicator.
- Default focus ring: `2px solid var(--primary)` with `2px offset` (so it doesn't blur into the element edge).
- Focus visible should appear on `:focus-visible`, not on every `:focus` (don't draw rings on mouse clicks for non-keyboard users).
- High-contrast mode: focus ring uses `currentColor` so OS-level contrast wins.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` — see §5. All long animations collapse; cross-fades shorten to 100ms; celebration FX disabled.

### Keyboard navigation

- All custom components (notification bell drawer, modals, the Christian Life Guide filter tabs, the donation sheet) must be reachable, operable, and dismissible by keyboard.
- ESC closes overlays. The existing pattern in `faith-resources.js` already handles this for the Christian Life Guide modals; preserve it.
- Trap focus in modals; restore focus to the trigger on close.

### Screen reader

- All icons have either `aria-label` or `aria-hidden="true"` (never both, never neither).
- Notification badge announces as "X unread notifications" via `aria-live="polite"`.
- Modal headings use `aria-labelledby` pointing to the visible heading element.
- Form inputs have associated `<label>` elements (no placeholder-as-label).

### Translate compatibility

The Google Translate widget in the app shell wraps live text. Components using inline-edit DOM (notification drawer, faith-resources modals) must avoid breaking when Translate replaces text nodes — keep semantic structure (`<button>`, `<h3>`) and don't rely on text-node positioning.

---

## 9. Component patterns

Description-only. No CSS yet. These are the patterns Phase 3 polish will canonicalize and the Phase 6 work will inherit.

### Card

- Surface: `--surface-1` (resting), `--surface-2` (hover, on devices that support hover).
- Border: `1px solid --border`.
- Radius: `--radius-lg` (16px).
- Padding: `--space-4` to `--space-5` (16–24px).
- Elevation: `--elev-1` resting, `--elev-2` on hover.
- Title row: `--type-h3` heading + optional category chip (right-aligned).
- Body: `--type-body`.
- Action footer: optional, separated by 1px border.

Variant: **Faith card** uses `--accent` for the category chip and an `--elev-glow-accent` shadow on hover.

### Button

Four variants: primary, secondary, ghost, destructive.

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| Primary | `--primary` | `--tx-on-primary` | none | Single most-important action per surface |
| Secondary | transparent | `--primary` | `1px solid --primary` | Equally weighted alternatives |
| Ghost | transparent | `--tx` | none | Tertiary actions; cancellation; menu items |
| Destructive | `--error` | white | none | Delete, remove, sign-out from elevated surfaces |

Sizes: small (32px tall), default (40px tall), large (48px tall).
- Padding: `0 --space-3` (small), `0 --space-4` (default), `0 --space-5` (large).
- Radius: `--radius-md` (10px). Pill variant uses `--radius-full` for filter chips and tags.
- Hover: bg lightens by ~6%; subtle elevation bump.
- Active (pressed): bg darkens by ~6%; no elevation.
- Disabled: 50% opacity, `cursor: not-allowed`, no hover state.

Faith CTA variant: primary button background `--accent` instead of `--primary`. Used only on faith surfaces (donation, daily devotional, story-mode start).

### Input

- Background: `--surface-2` (dark) / `--bg` (light).
- Border: `1px solid --border-strong`.
- Radius: `--radius-sm` (6px).
- Padding: `0 --space-3`, height 44px.
- Focus: border `2px solid --primary`, no shadow (the focus ring substitutes).
- Error: border `2px solid --error`; helper text below in `--error`.
- Label: above the input, `--type-body-sm` weight 500.
- Placeholder: never replaces label; only example text.

### Modal

- Backdrop: `rgba(0,0,0,0.6)` (dark) / `rgba(15,23,42,0.4)` (light), backdrop-blur-sm.
- Container: `--surface-3`, `--radius-xl` (24px), `--elev-3`.
- Max width: 720px (default); 480px for confirmations; full-screen at <600px viewport.
- Padding: `--space-5` (24px) sides; `--space-5` top; `--space-5` bottom (action area extra `--space-4`).
- Header: title (`--type-h2`) + close button (top-right).
- Body: scrollable, `--space-4` internal stack.
- Footer: action area, right-aligned, primary action rightmost.
- Open/close: `--motion-base`, `--ease-out`. Backdrop fade matches.
- The existing F4-E "universal modal fullscreen toggle" stays — adds an icon in the header.

### Toast

- Position: bottom-right (desktop), top-center (mobile).
- Surface: `--surface-4`, `--elev-3`.
- Radius: `--radius-md`.
- Padding: `--space-3 --space-4`.
- Icon left, text right, optional dismiss button.
- Duration: 4s default; 6s for error toasts; sticky for confirmation prompts.
- Stack: max 3 visible; older ones fade out as new ones arrive.
- Color cues: success border-left `--success`; warning `--warning`; error `--error`; info `--info`.

### Tab

- Underline-style tabs (Christian Life Guide filter tabs are the existing pattern).
- Active: text `--tx`, underline `2px --primary` (or `--accent` on faith surfaces).
- Inactive: text `--tx-muted`, no underline.
- Hover: text `--tx`, underline opacity 0.4.
- Spacing: `--space-3` between tabs.
- Keyboard: Left/Right arrows cycle, Home/End jump to first/last, Enter activates.

### Drawer

- Position: right-aligned (notification bell), full-height.
- Width: 360px desktop, 100% mobile.
- Surface: `--surface-3`, `--elev-4`.
- Slide in: `--motion-base`, `--ease-out`. Slide out: same, reversed.
- Backdrop: `rgba(0,0,0,0.4)` with backdrop-blur-sm.
- ESC closes; click-outside closes; trap focus inside.

### Pill / chip

- Radius: `--radius-full`.
- Padding: `0 --space-3`, height 24px (small) or 28px (default).
- Background: `--surface-2`; hover `--surface-3`.
- Text: `--type-caption` weight 500.
- Selected variant: bg `--primary` (or `--accent`), text `--tx-on-primary`.
- Used for: filter tabs (resource cards), audience tags (`youth` / `adult` / `family`), tier indicators.

### Badge (number)

- Used on: notification bell, tab counts, inbox.
- Shape: pill.
- Min-width 20px, height 20px, padding `0 6px`, font 12px / weight 700.
- Color: `--primary` background, `--tx-on-primary` text. `--error` for critical-attention badges.

### Empty state

- Centered icon (40–56px) + heading (`--type-h3`) + body (`--type-body`, max-width 360px) + optional CTA button.
- Tone: warm, never reproachful ("Nothing here yet — let's start your first plan").

---

## 10. Open questions for design system

1. **Light mode — when does the Phase 3 contrast pass actually run?** Some tokens here are aspirational; current light-mode behavior on several sections is broken.
2. **Glow shadows** (`--elev-glow-primary`, `--elev-glow-accent`) — keep as a dark-mode-only branded touch, or remove for visual quietness?
3. **Sound files at launch** — record original short sounds, license stock from a library (Soundsnap / Splice), or ship with no sounds for the first Phase 6 release?
4. **Notification bell mobile behavior** — full-screen drawer vs. bottom-sheet vs. inline-page. Currently spec'd as full-screen below 400px.

### Resolved (2026-05-06)

- **Faith accent:** indigo `#4338ca` primary + teal `#14b8a6` secondary. Color-application map locked in §1.

---

## Out of scope

- Full CSS variable file with all tokens wired (deferred to the Phase 3 polish ship — design system tokens become the source of truth there).
- Component library (no React, no shadow DOM — vanilla per project convention; tokens implemented as CSS custom properties on `:root`).
- Marketing-site palette unification (already a Phase 3 line item).
