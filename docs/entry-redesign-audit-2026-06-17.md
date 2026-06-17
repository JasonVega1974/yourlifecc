# Entry Redesign — Phase 0 Audit & Plan (2026-06-17)

**Status:** AUDIT ONLY. No app code was touched producing this document. This is the map + plan for review *before* anything is built. No SW bump, no flag flips, no schema applied yet.

**Scope of the redesign (eventual):** replace the ~50-item grouped sidebar with a flat card launcher, add a profile/PIN gate on top of the existing login, and (later) retire the sidebar — while leaving the 34 current users' login, the age-gate/onboarding sequence, and The Well's internals untouched.

**Method:** five read-only sweeps over `app/js/{auth,init,sync,ui,parent,skills,faith}.js`, `app/index.html`, and `docs/migrations/*.sql`. Line numbers drift; treat them as orientation, not contracts.

---

## Part 1 — Current Entry / Auth / Nav Map

### 1.1 Login & session (untouchable for 34 users)

- **Mechanism:** Supabase **email/password** (`signInWithPassword`) plus an email-confirmation signup that defers password setup. The enrollment pipeline is a chain of static pages: `login.html` → app, or `register.html` → `activate.html` → `set-password.html` → app (paid plans detour through Stripe Checkout; the Stripe webhook provisions the family row).
- **Session persistence:** Supabase JS SDK keeps the session in `localStorage` (`persistSession:true`, SDK-managed). `_supaUser` is the in-memory signed-in user, set from `getSession()` / `onAuthStateChange()` in `init.js`.
- **Identity / data keys in localStorage:** `lifeos_owner_user_id` (owner stamp), `lifeos_v2` (the `D` blob), `ylcc_post_login` + `ylcc_post_login_uid` (sign-in timestamp + uid, drive the PIN grace window), `lifeos_remember_email`.
- **Owner-guard** (`_ylccEnforceOwner`, `sync.js`): on owner mismatch, wipes all `ylcc_*` / `lifeos_*` / `dominic_*` / `levelup_*` keys (+ bare `mySports`, + `sessionStorage`), resets `D` to `DEF`, zeros `_profiles[]`/`_activeProfileId`, re-stamps the new owner — runs inside `cloudLoad()` before any write. This is the "Good afternoon, Lilly" fix; **do not bypass**.
- **Restore order (boot):** `getSupabase()` → `onAuthStateChange` wired → `getSession()` → `_supaUser` set → `checkPlanStatus()` → `cloudLoad()` → gate sequence → `finishInit()`.

> **The additive-gate hook point:** after `cloudLoad()` resolves and after `_ylccMarkAuthResolved()` (per-user LS keys become authoritative), but **before** `finishInit()`. Both the `SIGNED_IN` path and the `getSession()` restore path call the same downstream sequence — a new gate must be inserted in **both** or in a single shared function they both call. The login pages, `signIn`/`signUp`, the SDK session, `_supaUser`, and the `cloudLoad` order must not be touched.

### 1.2 First-run gate sequence (must be preserved, routed *through*)

Boot order for a signed-in user (each gate dual-writes `D.*` **and** a per-user `ylcc_<flag>_<uid>` LS key so it survives `cloudLoad`):

| # | Gate | Where | Fires when | Effect |
|---|------|-------|-----------|--------|
| 1 | **Plan status** | `auth.js checkPlanStatus()` | every auth | allow-list `['active','trialing','free_contest','faith_free',null]`; sets `window._faithFree` / `_contestFreeUser`; else `#subBlockedScreen` (fails **closed**) |
| 2 | **Age picker** | `init.js showAgePickerModal()` | child profile active **and** no `ageBracket`, not demo/faith-free; **silently skipped if the account has a parent profile** unless `viaKidActivation` | sets `D.ageBracket` ∈ `12_14/15_17/18_22`; gates section visibility by bracket |
| 3 | **First-time PIN** | `auth.js showFirstTimeGate()` | no PIN set | **currently a no-op** → calls `finishInit()` (PIN setup was removed from first-run) |
| 4 | **Parent onboarding** | `skills.js showParentOnboard()` | `finishInit()`+700ms, `!parentWizardDone`, not demo/faith-free | 6 slides; auto-routes via `_supaUser.user_metadata.signup_source` (`register-faith`/`solo` → `soloMode`, skip) |
| 5 | **Kid onboarding** | `skills.js showKidOnboard()` | only via `switchToProfile(child)`, `!kidOnboardDone` | 6 slides, per-child |
| 6 | **Parent Hub PIN** | `parent.js unlockParentDash()` | every nav to `s-parent` | in-memory unlock (5-min sliding idle + 30-min hard cap) or PIN overlay; 5-min post-login grace |
| 7 | **Child switch PIN** | `parent.js` profile switcher | tapping a child | 4-digit PIN vs `profile.pinHash` (or legacy `profile.id`) |
| 8 | **General onboarding** | `init.js maybeShowOnboarding()` | awaited inside `finishInit()`; authoritative source is Supabase `onboarding_completed` | name / age / interests / faith |
| 9 | **Daily devotional** | `init.js showDailyDevModal()` | `finishInit()`+800–3500ms, faith on, unread today | engagement nudge |

> **Hard constraint for the new gate:** it must sit at **step ~1.5** (after plan-status + auth-resolved, before the age picker) and then **hand control back into this existing sequence** — i.e. route *through* the age picker / onboarding, never around them. Any gate reading per-user flags must run **after** `_ylccMarkAuthResolved()` or it re-shows every boot.

### 1.3 Navigation surfaces

- **Sidebar** (`#sidebar` / `#sideNav`, `index.html:726-752`; CSS `#sidebar` `app.css:90`, `width:var(--sidebar)=220px`, `z-index:900`). Built by **`buildSideNav()`** (`ui.js`) from the **`NAV_ITEMS`** config (flat items + 8 collapsible groups). Visibility is filtered by `isSectionAllowed()` (faith_free/solo), `applyStageFilter()` (`D.mode`/STAGE_CONFIG), and age-bracket. Routes fire `showSection(id)` or `wellGoto(wellTab)`.
- **Bottom tab bar** (`#bottomTabBar`, `index.html:20973`; built by `renderBottomTabBar()` from **`TAB_IA`**). **Mobile-only** (`@media max-width:860px`) and **teen accounts** (`body.teen-tabs`); hidden on desktop; **early-returns for faith_free**. 5–6 tabs: Home / Faith(+swap) / Life / Learn / Parent / Me. Tab landings (`renderTabLanding`) show card grids for Learn/Life/Me. **Faith slot is swappable** (`D.tabSwap` → habits/goals/money/rewards) while keeping the `'faith'` route id.
- **Faith-free bottom nav** (`#ffBottomNav`, `index.html:21139`; `ffNavGo()`). Shown **only** for `window._faithFree`. 5 buttons: Home / Skills / Settings / Profile / Search. Never sees the sidebar or The Well (faith_free is gated at auth).
- **Top bar** (`#topQuickBtns`, `index.html:775`, `z-index:99990`): Language / Child Login / Parent / Settings / Dark / Refer.
- **Routing core:** `showSection(id)` (`ui.js`) hides/shows `.sec` sections, sets the active nav highlight (`ni-<id>`), closes the mobile sidebar, sets/clears `body.teen-tabs`, and runs per-section side-effects (e.g. `s-sports`→`renderSports`, `s-scripture`→faith init, `s-parent`→`unlockParentDash`).

### 1.4 Parent Hub / "The Watch"

- **Section** `s-parent` (`index.html:15704`). Reached via `quickParentHub()` (top-bar/quick-bar "Parent" buttons), `showSection('s-parent')`, or the Life-Score card.
- **Gate:** `#parentGate` overlay (6-dot keypad, `index.html:15716+`). Verified by `verifyParentPin()` against `D.parentPinHash` (SHA-256 salted with user-id; legacy plaintext `parentPIN`/`chorePin` migrate on verify). Unlock state is **in-memory only** (`_parentUnlockExpiresAt` 5-min sliding, `_parentUnlockHardCap` 30-min); 5-min post-login grace via `ylcc_post_login`. Do not move unlock back to storage (prior security hole).

### 1.5 The Well (route-only black box)

- **Section** `s-scripture`. Reached **by routing only** — `showSection('s-scripture')` (then `wellGoto(tab)` / `bfTab(tab)` switch the inner tab; `D.wellLastTab` restored each entry). `faith.js` / `worship.js` / faith data own all rendering; `ui.js` only calls `initScripture()`/`renderScripturePage()`/`renderFaithZones()` **inside** the route callback.
- **Entry points:** sidebar "The Well" group (≈20 `wellGoto` children + `s-worship`/`s-flashcards` siblings), the mobile Faith tab, and (faith_free only) the search overlay opening proof/academy/story modals. A first-visit cinematic `.well-gate` overlay shows once per session (skipped for faith_free).
- **Project invariant:** The Well is reached by routing only. `faith.js` and the Well's internals are **out of scope for the entire entry redesign** — we add/route entry points, never touch faith content or rendering.

---

## Part 2 — Reconciled Flat IA (the real card list)

### 2.1 What exists today (the true top-level destinations)

A **flat IA already half-exists** in `TAB_IA` (the mobile tab landings). The sidebar's `NAV_ITEMS` is the maximal grouped form. Reconciling them, the genuine top-level destinations are six:

| Card | Route | Backed by | Children (representative) |
|------|-------|-----------|---------------------------|
| **Home** | `s-hero` | hero dashboard | — |
| **The Well** (Faith) | `s-scripture` | faith.js black box | Bible, Plans, Devotionals, Prayer, Academy, Archaeology, Proof & Prophecy, Stories, Timeline, Memorize, Journey, Who Is Jesus, Traditions, Study Tools, Bible Study, Meditations, Sleep Stories, + `s-worship`, `s-flashcards` |
| **Life** | `s-life` | `renderLifeLanding` | Health, Habits, Journal, Mood, Fuel Wall, Money, Rewards, Challenges, Badges, Goals, Schedule, Calendar, Chores, Music, Reading, Milestones |
| **Learn** | `s-learn` | `renderLearnLanding` | Life Skills (`s-skills`), Growing Up, Driving, Sports, My People, School, Jobs/Resume, Bio, School Resources, Tech Skills (`s-cbt`) |
| **Me** | `s-me` | `renderMe...` | Badges, Milestones, Bio, My People, Refer, Settings, Profile, Sign-out |
| **Parent Hub** ("The Watch") | `s-parent` | parent.js | child management, behavior log, rewards admin, PIN reset |

Everything else in the sidebar is a **child** of one of these six. The flat launcher = these six as primary cards, each opening a sub-grid of its children (the `TAB_IA primary[]` lists are already exactly these sub-grids).

### 2.2 Duplication to resolve (confirmed)

1. **Double "Home".** `NAV_ITEMS` has `s-hero` "Home" (the app home) **and** the Well group's first child `wellGoto('home')` "Home" (the Well's own home grid). Two 🏠 entries when the Well group is expanded. → In the flat IA, the app Home is the top card; the Well's internal "home" is an *inner* tab of The Well, not a top-level row.
2. **"Learn" landing vs "Learning" group vs "Life Skills".** Three overlapping 📚 concepts: `s-learn` (the landing/launcher), `_group_learn` (a sidebar folder), and `s-skills` ("Life Skills", the actual module). They share the icon and read as the same thing. → The flat IA keeps **Learn** as the card/launcher and **Life Skills** (`s-skills`) as a child *inside* it; the `_group_learn` folder disappears with the sidebar.
3. **"Life" / "Learn" appear twice** (once as a sidebar flat item, once as a mobile tab) by design — they are stage-filter-exempt (`ui.js` `applyStageFilter` exempts `cbt`/`learn`/`life`/`me`). The flat launcher collapses these to one card each.
4. **Faith tab swap** means the second tab is *not always Faith* — the IA must treat "slot 2" as configurable, not hard-wired to The Well.

### 2.3 Reconciliation note

The "recommended card list" should be **the six above**, not a longer list — the long lists are the *children*. The launcher's job is: 6 primary cards → each expands to its child grid (reusing the existing `TAB_IA primary[]` data, which is already authored). No new routes are needed; every child already has a `showSection`/`wellGoto` target.

---

## Part 3 — Proposed Profiles / PIN Data Model

### 3.1 Current model (confirmed)

- **One Supabase `profiles` row per account** (`user_id` PK-scope; RLS `auth.uid() = user_id`). The row carries typed columns **and** a `data` JSONB blob:
  - Typed (from migrations): `plan_status`, `stripe_customer_id`, `first_name`, `age_bracket` (`12_14|15_17|18_22|parent`), `onboarding_completed(_at)`, `faith_only` (bool, partial index `profiles_faith_only_idx`), `age_tier` (`kids|youth|adult|family`, CHECK), `account_role` (`self|parent|group_leader`, CHECK), engagement columns (`sections_visited`, `last_active`, …). **The base `CREATE TABLE` is Supabase-managed — not in `docs/migrations/` (confirmed: "CREATE TABLE migration is needed" comment).**
  - Blob (`data`): all app state including `_profiles[]`, `parentPinHash`, per-child `pinHash`.
- **Multi-child is entirely client-side.** `_profiles[]` (in-memory) + `_activeProfileId`; a slim index `{id,name,isParent,stableId}` persists to the `ylcc_profiles` LS key, full per-profile `.data` to `lifeos_profile_<id>` LS keys, and the whole thing rides the one row's `data` blob via `cloudSync`. **There is no per-child Supabase row or table.**
- **Role concept exists two ways:** server-side `account_role` (per *account*: self/parent/group_leader) and client-side `profile.isParent` (per *profile* in `_profiles[]`). The per-child granularity is client-only.
- **PINs are client-side & in-memory:** parent PIN = `D.parentPinHash` (SHA-256, user-id salt); child PIN = `profile.pinHash` (or legacy `profile.id` as the 4-digit PIN). Verified in the browser (`auth.js verifyParentPin`/`verifyChildPin`). **No server table, no server verification, no rate-limit/lockout, no cross-refresh persistence beyond the 5-min grace stamp.** A Phase-1 "PIN → stableId decouple" is mid-flight (`profile.stableId = p_<8hex>` backfilled; `_pidOf()` helper staged but not yet the read path).

### 3.2 The gap

Client-side PIN verification is trivially bypassable (patch the hash in localStorage / devtools), has no brute-force defense (4-digit child = 10k, 6-digit parent = 1M, both free to grind locally), and the unlock doesn't survive a refresh. For a *parent vs child* trust boundary this is the weak point.

### 3.3 Proposed model — 6-digit parent / 4-digit child / remember-device, server-verified

Two new tables + one Edge Function. (Follows the `docs/migrations/_TEMPLATE.sql` rule: RLS + explicit GRANTs, per the Oct-30-2026 change.)

```sql
-- profile_pins: one row per profile-credential (NOT in the JSONB blob)
create table if not exists public.profile_pins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  stable_id   text not null,                          -- profile.stableId (decoupled from PIN)
  pin_hash    text not null,                          -- argon2id/scrypt, per-row salt (server-side)
  pin_type    text not null check (pin_type in ('parent','child')),
  pin_len     smallint not null check (pin_len in (4,6)),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, stable_id)
);
alter table public.profile_pins enable row level security;
-- Client may MANAGE (set/replace) its own PINs, but verification is server-only.
create policy profile_pins_rw_own on public.profile_pins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.profile_pins to authenticated;
grant all on public.profile_pins to service_role;

-- pin_attempts: brute-force tracking — service-role only (touched solely by the Edge Function)
create table if not exists public.pin_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  stable_id     text not null,
  failed_count  int  not null default 0,
  locked_until  timestamptz,
  last_attempt  timestamptz not null default now()
);
alter table public.pin_attempts enable row level security;
create policy pin_attempts_service_only on public.pin_attempts
  for all using (false) with check (false);          -- no client access at all
grant all on public.pin_attempts to service_role;

-- remember-device: a hashed device token so a trusted device can skip the gate for N days
create table if not exists public.trusted_devices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  stable_id     text not null,                        -- which profile this device trusts
  token_hash    text not null,                        -- hash of an opaque token kept client-side
  expires_at    timestamptz not null,
  created_at    timestamptz not null default now()
);
alter table public.trusted_devices enable row level security;
create policy trusted_devices_rw_own on public.trusted_devices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.trusted_devices to authenticated;
grant all on public.trusted_devices to service_role;
```

**Verification path (new Edge Function, CommonJS, `/api/verify-pin.js`):**
1. Authenticate the Supabase session (Authorization header / cookie) → `user_id`.
2. Check `pin_attempts.locked_until` for `(user_id, stable_id)`; if locked → `429`.
3. Look up `profile_pins`; hash the attempt with the stored salt (argon2id/scrypt); timing-safe compare.
4. **Match** → reset `failed_count`; if "remember this device" was chosen, mint an opaque device token, store its hash in `trusted_devices` (e.g. 30-day expiry), return the token + a short-lived unlock token. **Mismatch** → increment `failed_count`, set `locked_until` past a threshold, return `401`.
5. Client stores the device token (localStorage) and, on next unlock, presents it; the function validates against `trusted_devices` and can skip the keypad until expiry.

**Notes / decisions to confirm before building:**
- Keep `parentPinHash` / `profile.pinHash` in the blob as an **offline/fallback** verifier (the app must still work offline), with the server as the authority when online — mirror the `maybeShowOnboarding` "server is source of truth, trust local only if the server read failed" pattern.
- `stable_id` (not the PIN) is the key — this is exactly what the in-flight Phase-1 decouple is preparing. Server PINs should land **after** `_pidOf()` flips to `stableId`, or they'll key on a value that's about to change.
- `account_role` already exists server-side; a parent-vs-child decision at the row level can lean on it, but per-child identity still needs `stable_id` (client-managed today).
- This is a **security hardening** track that can run independently of the nav redesign; the nav redesign does **not** require it. Sequence it on its own risk budget.

---

## Part 4 — Phased Execution Plan

> Guardrails for **every** phase: login pages + `signIn`/`signUp` + SDK session untouched; the gate sequence (Part 1.2) routed *through*, not around; The Well/`faith.js` untouched (routing only); `_ylccEnforceOwner` untouched; per-user flags read only after `_ylccMarkAuthResolved()`; each shipped phase gets light/dark + reduced-motion, `node --check`, guardian+tail if `index.html` is touched, an SW bump, and a harness. Behind a flag until proven.

### Phase 1 — Profile/PIN gate **on top of** the existing login (additive, flagged)

- **What:** after a successful login (the existing flow), insert a new "who's using this — parent or child?" + PIN gate at the **single hook** (after `cloudLoad` + `_ylccMarkAuthResolved`, before the age picker / `finishInit`). On pass, it **calls the existing sequence** (age picker → onboarding → `finishInit`) unchanged.
- **Additive & safe:** gated behind a feature flag (e.g. a `data`/LS flag, default **off**). With the flag off, the hook is a pass-through → the **34 existing users see zero change**. New behavior only for opted-in accounts.
- **Reuses what exists:** `_profiles[]`/`isParent`, `verifyParentPin`/`verifyChildPin`, the `#parentGate` keypad pattern, the post-login grace window.
- **Risky bits:**
  - The hook must be inserted in **both** the `SIGNED_IN` and `getSession()` paths (or a shared callback) — miss one and a reload skips the gate. *(This is the exact class of bug that bit the My Sports picker — verify via the real boot path, both entry points.)*
  - Must run **after** `_ylccMarkAuthResolved()` or the gate re-shows every boot (wrong LS scope).
  - Must **not** double-gate with the existing Parent Hub PIN, and must preserve the age-picker's "skip if a parent profile exists" logic.
  - Server-verified PIN (Part 3) is **optional** for Phase 1 — can ship with the current client verify and harden later.

### Phase 2 — Card launcher **alongside** the sidebar (both live)

- **What:** a new flat home launcher (the six Part-2 cards → child sub-grids), rendered as a surface that routes via the **existing** `showSection`/`wellGoto`. The sidebar **stays**; the launcher is additive.
- **Reuses what exists:** the `TAB_IA primary[]` data (already the child grids), `renderTabLanding`, the existing routes. No new destinations.
- **Risky bits:**
  - **Desktop has no persistent nav but the sidebar.** The bottom tab bar is **mobile-only + teen + non-faith_free** — it cannot be the desktop nav. The launcher (or a slim top nav) must become desktop's persistent nav before Phase 3, or desktop loses navigation when the sidebar goes.
  - Active-state parity: the launcher must drive/read the same active markers (`ni-<id>`, `_activeSection`) the sidebar uses, or highlights desync.
  - Duplication during co-existence (sidebar + launcher both visible) — acceptable transitional state; flag-gate the launcher.
  - faith_free already bypasses both sidebar and tab bar (uses `ffBottomNav`) — the launcher must respect `window._faithFree` and not show for them.

### Phase 3 — Retire the sidebar

- **What:** remove `#sidebar`/`#sideNav` + `buildSideNav` and make the launcher (desktop) + bottom tab bar (mobile) the only nav.
- **Bounded by the dependency map (Phase-3 removal checklist):**
  - **HTML:** `#sidebar`, `#sideNav`, `#sideOverlay`, `#sideCollapseBtn`, `#sideExpandTab` (`index.html:726-752`).
  - **CSS:** `#sidebar` (`app.css:90`), `--sidebar`, `.mob-open`, `body.sidebar-collapsed`, `#sideOverlay`, `#sideExpandTab`, `.nav-item`/`.nav-group*`, `:root.light #sidebar`.
  - **JS — `buildSideNav()` has 7 call sites** to repoint or drop: `init.js` (bootstrap), `auth.js` (plan/section gating), `ui.js` (`applyStageFilter`, settings), `parent.js` (×2, profile switch refresh), plus the internal rebuilders. Also `toggleNavGroup`, `toggleSidebarCollapse`/`initSidebarCollapse`, `toggleSidebar`/`closeSidebar`.
  - **Cross-module coupling:** `faith.js` highlights the active Well tab by querying **`#sideNav`** (`bfTab` active-state) — this breaks if `#sideNav` is gone; The Well's *content* is untouched, but its **nav highlight** must move to the launcher/tab. `showSection` calls `closeSidebar()` and toggles `ni-*` active classes — repoint to the launcher.
  - **State:** `D._navGroups`, `localStorage[_SIDEBAR_COL_KEY]`, the `ni-<id>` active-highlight contract.
- **Risky bits:**
  - **Route parity is the gate:** every one of the ~50 child destinations must remain reachable from the launcher/tab bar/URL **before** removal. Build a route-coverage check (every `showSection`/`wellGoto` target reachable) and run it against the real boot — do **not** trust an isolated list.
  - **The Well nav-highlight** (`faith.js` reading `#sideNav`) is the sharp edge: route stays, highlight source must change.
  - **Desktop nav** must already be carried by the launcher (Phase 2 precondition).
  - **faith_free** keeps `ffBottomNav` regardless — confirm it never depended on the sidebar (it already early-returns).
  - Age-gate + onboarding still route *through* (they're independent of the sidebar) — confirm with the gate sequence intact.

---

## Appendix — Confirmed invariants (carry into every phase)

- **Login untouched:** the 34 users' email/password + SDK session path is read-only for this project; the new gate is a *consumer* of `_supaUser`, never a writer.
- **Gate sequence routed through:** plan → (new gate) → age picker → onboarding → `finishInit` → parent/kid onboarding → devotional. Never bypass the age-gate/onboarding.
- **The Well is routing-only:** `faith.js` and the Well's internals are out of scope; we add entry points and move its *nav highlight*, never its content.
- **Owner-guard sacrosanct:** `_ylccEnforceOwner` and the `lifeos_owner_user_id` stamp are not touched.
- **Multi-child is client-side today:** one Supabase row per account; `_profiles[]` in the blob; server PIN tables are a *new, optional* hardening track keyed on `stable_id` (sequence after the in-flight PIN→stableId decouple).
- **Desktop vs mobile nav:** bottom tab bar = mobile persistent nav (teen, non-faith_free); the card launcher must become desktop's persistent nav before the sidebar can go.

*End of Phase 0 audit. No code changed. Awaiting review before Phase 1.*
