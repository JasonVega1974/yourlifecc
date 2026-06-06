# Money Tab Build Plan

Tab 2 of YOURLIFECC_APP_UPGRADE_MASTERPLAN.md. Section id is `#s-finance`
(NOT `s-money` — keep that in mind when grepping). The masterplan is several
weeks stale; this plan treats the live codebase as ground truth.

Predecessor: `CHORES_BUILD_PLAN.md`. Same authoring conventions, same shape.

---

## §0 — Premise corrections vs the masterplan

- **The section id is `s-finance`**, not `s-money`. The user-facing label is
  "Money Manager." Function prefix is `mTab` / panel ids are `mt-<sub>`.
- **The Money tab is more built than the reconciled plan implies.** 8 sub-tabs
  already render (Overview / Bills / Transactions / Goal Savings / Sav. Goals
  / Budget / Paycheck / Tax Ed). Bills + Paycheck are bonus surfaces not in
  the masterplan and should NOT be dropped — they work and add value.
- **D.allowance exists as a number (data.js:119) but is never written or
  read.** Treat it as "declared but never wired" — the Allowance sub-tab is
  genuinely missing.
- **Tax data was refreshed to TY2025 / OBBBA actuals earlier this session.**
  The reconciled plan's "tax data still 2024 (P1 carry-over)" line is now
  outdated — that work shipped. Tax Ed sub-tab content is correct; the lesson
  body just needs to be lifted into the new Learn sub-tab.
- **A static spending donut exists** (`renderSpendingDonut`, inline SVG). The
  reconciled plan's "switch SVG donut → Chart.js" recommendation stands —
  Chart.js is already loaded globally for Habits.
- **The topic-card grid (#financeTopicGrid at index.html:2388) is a parallel
  navigation surface** that mirrors the tab bar. It's redundant with the new
  sub-tab IA but works; treat it as a separate decision (keep / drop / merge
  into Dashboard hero) rather than gating any increment on it.

---

## §1 — Current state inventory

### `app/index.html` (lines 2361-???):
- `#s-finance` section opens with a 3-stat hero (`#finSumBalance`,
  `#finSumMonthSpend`, `#finSumSavPct`) via `updateFinSum()` in finance.js.
- Topic-card grid (`#financeTopicGrid`, 7 cards, routes via `tgOpenTopic`).
- Tab bar (`.moneyTabs`) with 8 buttons routing via `mTab()`.
- 8 panel divs: `#mt-overview`, `#mt-paycheck`, `#mt-bills`, `#mt-tx`,
  `#mt-savings`, `#mt-savgoals`, `#mt-budget`, `#mt-taxed`.

### `app/js/finance.js` (478 lines):
- `mTab(tab, btn)` — sub-tab nav, delegates to per-tab renderers.
- Balances: `saveBal`, `renderBankHist`, `updateFinSum`.
- Bills: `addBill`, `renderBills`, `toggleBill`, `editBill`, `deleteBill`.
- Transactions: `addTx`, `filterTx`, `editTx`, `deleteTx`, `renderTx`.
- Savings: `renderSavingsTab`, `renderSavGoalCards` (split — Goal Savings
  is the quick-add UI, Sav. Goals is the CRUD UI).
- Budget: `calcBudget` (50/30/20 split).
- Paycheck: `calcPaycheckSim`.
- Tax Ed: `calcTax` (with the TY2025 / OBBBA-corrected figures shipped
  this session).
- Spending donut: `renderSpendingDonut` (inline SVG).
- Helpers: `ord`, `localDateString` (shared).

### `app/js/data.js` D fields (line 119+):
- `bank`, `bankLabel`, `bankSavAcct`, `bankSavAcctLabel`, `bankHistory[]`.
- `bills:[]`, `transactions:[]`, `earnings:0`, `allowance:0` (number-shaped,
  never written), `savingsGoals:[…seed entries…]`.
- No `budget:`, no `budgetCategories:`, no `financeLearnProgress:` yet.

### Existing dual-write & cloud:
- **Zero** money-related cloud tables. Everything lives in JSONB
  (`profiles.data` blob). The reconciled plan flags `money_transactions`,
  `money_goals`, `budget_categories` as all MISSING.

### Cross-tab couplings to preserve:
- `updateDashCards()` (init.js) reads finance totals for the home dashboard.
- `tutGoTo('s-finance')` (tutorial) — entry point.
- Parent Bucks ↔ Money: PB and money points are kept distinct on purpose
  (PB is parent-funded virtual currency; money is real-world dollars).
  Do NOT merge.

---

## §2 — Sub-tabs + feature list mapped to current code

Numbered against the masterplan's 6 sub-tabs (Dashboard / Budget /
Transactions / Goals / Learn / Allowance). Existing extras (Bills, Paycheck)
are preserved because they ship and work.

| # | Sub-tab | Status | Existing surface | What to ADD |
|---|---|---|---|---|
| 1 | **Dashboard** (rename Overview) | EXTEND | `#mt-overview` + 3-stat hero. Inline-SVG donut. Bank balance card. Month snapshot card. | Chart.js donut (replaces SVG). Monthly bar chart (income vs expense vs savings). Net-worth card. Recent activity strip. Milestone badges row. |
| 2 | **Transactions** | EXTEND | `#mt-tx` + add-form + filter chips + list. | Category dropdown with emoji icons (MONEY_CAT_EMOJI map). Search input. CSV export. Optional receipt photo (Inc 6 — needs bucket). |
| 3 | **Budget** | EXTEND | `#mt-budget` — 50/30/20 calculator (one-shot math, no persistence). | Persistent category budgets (D.budget). Budget-vs-actual bar chart (Chart.js). Over-budget warning chips. |
| 4 | **Goals** (merge Goal Savings + Sav. Goals) | EXTEND + MERGE | `#mt-savings` (quick-add) + `#mt-savgoals` (CRUD). | Merge to one sub-tab with two clearly-labeled sections (shipped in Inc 1). Photo per goal (Inc 6). Countdown to target date. Milestone chips. |
| 5 | **Bills** | KEEP | `#mt-bills` works as-is. | Light polish only — categorize with same MONEY_CAT_EMOJI map. |
| 6 | **Paycheck** | KEEP | `#mt-paycheck` paycheck simulator. | Light polish. Link from Learn → "Taxes" lesson into this calculator. |
| 7 | **Allowance** | NEW | nothing. `D.allowance` (number) declared but unused. | Recurring allowance config + auto-credit on schedule + history list + parent toggle. |
| 8 | **Learn** | NEW (absorbs Tax Ed) | `#mt-taxed` (static tax-ed HTML + `calcTax`) becomes one of 8 lessons. | 8 financial-literacy mini-lessons + quiz + score. |

**Drop after Learn ships:** `#mt-taxed` standalone — its content moves
into the "Taxes" lesson inside Learn. The `calcTax` calculator stays as
an embeddable widget inside that lesson.

**Open decision (defer to Inc 1):** the redundant topic-card grid
(`#financeTopicGrid`). Three options:
- (a) Drop entirely — sub-tab bar is sufficient.
- (b) Keep as a "jump to" hero above the tabs.
- (c) Promote into the Dashboard sub-tab as a quick-action grid.
Recommendation: **(a)** — drop. Saves ~80 lines of HTML, removes the
"two navigations for one tab" confusion.

---

## §3 — Schema plan

New Supabase tables, all using `_pidOf(activeProfile)` for `profile_id`
per Phase 1 of the PIN → stable-id decouple (v249). **No PIN debt.**

### `public.money_transactions`

```sql
create table if not exists public.money_transactions (
  id           text primary key,                            -- 'tx_<profileId>_<n>'
  user_id      uuid references auth.users(id) on delete cascade not null,
  profile_id   text not null default '_solo',               -- _pidOf(active) stable id
  type         text not null check (type in ('income','expense','savings','transfer')),
  amount       numeric(10,2) not null,
  category     text,
  description  text not null,
  occurred_on  date not null,
  receipt_path text,                                        -- storage path in money-receipts bucket (Inc 6)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index money_transactions_user_profile_date_idx
  on public.money_transactions (user_id, profile_id, occurred_on desc);
-- RLS + GRANTs per the user-data pattern in docs/migrations/_TEMPLATE.sql
```

### `public.money_goals`

```sql
create table if not exists public.money_goals (
  id              text primary key,                         -- 'mg_<profileId>_<n>'
  user_id         uuid references auth.users(id) on delete cascade not null,
  profile_id      text not null default '_solo',            -- _pidOf(active) stable id
  name            text not null,
  target_amount   numeric(10,2) not null,
  current_amount  numeric(10,2) not null default 0,
  photo_path      text,                                     -- money-images bucket (Inc 6)
  target_date     date,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index money_goals_user_profile_idx
  on public.money_goals (user_id, profile_id);
-- RLS + GRANTs per user-data pattern
```

### `public.budget_categories`

```sql
create table if not exists public.budget_categories (
  id             text primary key,                          -- 'bc_<profileId>_<slug>'
  user_id        uuid references auth.users(id) on delete cascade not null,
  profile_id     text not null default '_solo',             -- _pidOf(active) stable id
  name           text not null,
  emoji          text not null default '💵',
  monthly_limit  numeric(10,2) not null default 0,
  color          text,                                      -- hex / token name for chart slice
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create unique index budget_categories_unique
  on public.budget_categories (user_id, profile_id, name);
-- RLS + GRANTs per user-data pattern
```

### `public.allowance_credits` (Increment 4)

```sql
create table if not exists public.allowance_credits (
  id            text primary key,                           -- 'ac_<profileId>_<ts>'
  user_id       uuid references auth.users(id) on delete cascade not null,
  profile_id    text not null default '_solo',              -- _pidOf(active) stable id
  amount        numeric(10,2) not null,
  credited_on   date not null,
  source        text not null default 'auto',               -- 'auto' | 'manual' | 'parent-adjust'
  created_at    timestamptz not null default now()
);
create index allowance_credits_user_profile_date_idx
  on public.allowance_credits (user_id, profile_id, credited_on desc);
-- RLS + GRANTs per user-data pattern
```

### NOT in schema (stays JSONB):
- `D.financeLearnProgress` — lesson completion + quiz scores. Cloud
  surfacing via JSONB blob is plenty for v1; promote to a table when
  cross-device lesson sync becomes a real complaint.
- `D.budget` — top-level 50/30/20 settings. The category-level budget
  goes into `budget_categories`; the 50/30/20 split is a single config
  blob, JSONB-shaped.
- `D.bank`, `D.bankSavAcct`, `D.bankHistory[]` — current balance
  snapshots. Already JSONB; no need to lift unless multi-device sync
  conflicts surface.

---

## §4 — Storage buckets

| Bucket | Purpose | Increment |
|---|---|---|
| `money-receipts` | Optional receipt photos on transactions | Inc 6 |
| `money-images` | Photos on savings goals (the "saving for that bike" visual) | Inc 6 |

Both follow the `chore-proofs` pattern: PRIVATE, signed-URL reads,
5 MB cap, image MIMEs only, path scheme
`<user_id>/<profile_id>/<entity_id>/<timestamp>.<ext>` where
`<profile_id>` = `_pidOf(active)`.

---

## §5 — Build plan: increments in dependency order

Each increment is independently shippable. SW bump + guardian + per-file
commits at the end of each.

> **Plan amendment (2026-06-05, after Inc 1 lands):** Schema + dual-write
> originally lived at Increment 6 — moved up to **Increment 2**. Rationale:
> getting the cloud surface in place before more local features land prevents
> backfill burden later. Subsequent increments renumber by +1 (Inc 2 →
> Schema; Inc 3 → Transactions polish + CSV; Inc 4 → Allowance; Inc 5 →
> Learn; Inc 6 → Goals merge polish + What-If + photos; Inc 7 stays Parent
> approvals + AI Coach + virtual card).

### Increment 1 — Sub-tab IA rework + Money palette + Dashboard polish

**Goal:** the new sub-tab structure exists and the visual system is in
place so subsequent increments slot in cleanly.

**Touches:**
- `app/index.html` — restructure `.moneyTabs` to the new 8-button order
  (Dashboard / Transactions / Budget / Goals / Bills / Paycheck /
  Allowance / Learn). Add `--mn-*` token block + scoped CSS for new
  primitives (cards, hero, chips). Drop `#financeTopicGrid` per the §2
  decision. Rename `#mt-overview` → `#mt-dashboard`. Add empty stubs for
  `#mt-allowance` and `#mt-learn`.
- `app/js/finance.js` — rename internal references `overview` →
  `dashboard`. Add wiring stubs `renderAllowance()` and `renderLearn()`
  (returning placeholder card so the tab works the moment the panel
  exists, even before content lands in Inc 4 / 5).
- `app/js/data.js` — extend `DEF` with `financeLearnProgress`,
  `allowanceConfig`, `budget`, `budgetCategories`.

**Money palette (declared inside the scoped `<style>` for `#s-finance`):**
```css
:root, #s-finance{
  --mn-accent:        #10b981;   /* emerald — distinct from chores' #22c55e */
  --mn-accent-soft:   color-mix(in srgb, #10b981 12%, transparent);
  --mn-accent-bd:     color-mix(in srgb, #10b981 42%, transparent);
  --mn-indigo:        #6366f1;   /* lessons / Learn sub-tab */
  --mn-indigo-soft:   color-mix(in srgb, #6366f1 12%, transparent);
  --mn-indigo-bd:     color-mix(in srgb, #6366f1 38%, transparent);
  --mn-amber:         #f59e0b;   /* savings / allowance highlight */
  --mn-amber-soft:    color-mix(in srgb, #f59e0b 12%, transparent);
  --mn-amber-bd:      color-mix(in srgb, #f59e0b 38%, transparent);
  --mn-coral:         #fb7185;   /* expense / over-budget warning */
  --mn-coral-soft:    color-mix(in srgb, #fb7185 14%, transparent);
  --mn-surface-soft:  color-mix(in srgb, var(--tx) 6%, transparent);
  --mn-card-bg:       var(--card-bg);
  --mn-card-border:   var(--card-border);
}
```

Distinct from chores: emerald is bluer than chores' #22c55e; chores
doesn't use indigo or coral at all.

**Verifiable:** all 8 sub-tabs visible + click without error. Dashboard
hero still shows 3 stats. Allowance / Learn show "Coming soon" stubs.

### Increment 3 — Transactions polish + CSV export
(was Inc 2 — bumped after the schema/dual-write swap; see §5 amendment.)

**Goal:** transactions get categories with emoji, search, and one-click
export to CSV. Pure JSONB — no schema changes.

**Touches:**
- `app/js/finance.js` — `MONEY_CAT_EMOJI` map (Food 🍔, Entertainment
  🎮, School 📚, Clothes 👕, Transport 🚗, Health 🏥, Gifts 🎁, Other
  📌). Category dropdown in the add form. Search input above the list.
  `_finExportCsv()` — Blob + download, columns: date, type, category,
  description, amount.
- `app/index.html` — category `<select>` in `#mt-tx`, search input,
  Export button.

**Verifiable:** filtering by emoji-category works; CSV downloads with
the visible filtered set.

### Increment 4 — Allowance sub-tab (recurring + auto-credit)
(was Inc 3)

**Goal:** parent sets a weekly / bi-weekly / monthly allowance; the app
auto-inserts the income transaction on schedule.

**Touches:**
- `app/js/data.js` — `allowanceConfig: { amount, frequency, dayOfWeek,
  dayOfMonth, lastCreditedOn, enabled, history:[] }`. Replaces the
  legacy `allowance: 0` number; sanitize on load.
- `app/js/finance.js` — `renderAllowance()` (the sub-tab UI). Config
  form (amount, frequency picker, day picker). History list with
  amounts. Parent toggle for which child (uses `_profiles[].data` to
  surface per-child config in Parent Hub).
- `app/js/init.js` — `_maybeCreditAllowance()` on app load. Compares
  today's date vs `lastCreditedOn` + `frequency`; if due, inserts a
  `D.transactions.unshift({type:'income', cat:'allowance', …})` AND
  updates `lastCreditedOn`. Idempotent — re-running the same day
  no-ops.
- `app/index.html` — `#mt-allowance` panel markup.

**Schema (optional this increment):** ship JSONB-only first. The
`allowance_credits` table is documented but not required until the
parent-hub "review allowance history across kids" view ships.

**Verifiable:** open the app on a day after a credit is due, see the
new income row + balance bump, exactly once.

### Increment 5 — Learn sub-tab (8 financial-literacy lessons)
(was Inc 4)

**Goal:** 8 modular lessons + per-lesson quiz + a literacy score that
rolls up into the Dashboard.

**Touches:**
- `app/js/data/money-lessons.js` (NEW data file, ~600-900 lines) — 8
  lesson objects: { id, icon, title, summary, bodyHtml, quiz:[{q,
  options[], correctIdx, explanation}] }. Lessons:
  1. Budgeting (50/30/20 — links to Budget sub-tab)
  2. Saving (compound interest visualizer — links to Goals sub-tab)
  3. Credit Scores
  4. Investing Basics
  5. Taxes (absorbs current Tax Ed — embeds `calcTax` widget)
  6. Wants vs Needs
  7. Emergency Funds
  8. Compound Interest deep-dive (interactive)
- `app/js/finance.js` — `renderLearn()` (lesson grid). Per-lesson
  open + quiz flow + score persistence into `D.financeLearnProgress`.
  Literacy score = (# lessons passed / 8) × 100, exposed via
  `getFinanceLiteracyScore()` for the Dashboard chip.
- `app/index.html` — `#mt-learn` panel markup + `#mt-taxed` panel
  REMOVED (content lives in Lesson 5).
- `app/index.html` `.moneyTabs` — drop the standalone Tax Ed button.

**Reuse:** the existing `calcTax` function + TY2025 brackets embed
into Lesson 5 as the interactive widget. The current `mt-taxed` HTML
is copy-paste source material.

**Verifiable:** 8 lessons render, opening one starts the quiz, passing
shows on the Dashboard literacy chip.

### Increment 6 — Goals polish + receipt photos + savings goal photos + What-If simulator
(was Inc 5 — Goals merge already shipped in Inc 1; this increment is the polish + photos + What-If layer)

**Goal:** Goals sub-tab is one cohesive surface. Photos add visual
specificity. The What-If slider is the masterplan's flagship Money
feature.

**Touches:**
- `app/js/finance.js` — `renderGoals()` merges `renderSavingsTab` +
  `renderSavGoalCards` into one renderer with quick-add at top + goal
  cards below. `renderWhatIfSimulator()` — two sliders (weekly save,
  goal $), live months-to-goal output + chart preview.
- Photo uploads on transactions and goals using the chore-proofs
  pattern. Two new buckets: `money-receipts`, `money-images`.
  SQL files: `docs/migrations/money-receipts-bucket.sql`,
  `docs/migrations/money-images-bucket.sql`.
- Milestone celebrations: first $50 saved, first month under-budget,
  5 lessons completed, first $100 saved, etc. Reuse
  `screenFlash` + `launchSideConfetti` from chores.
- `app/index.html` — merge `#mt-savings` + `#mt-savgoals` into
  `#mt-goals`. Drop the redundant tab. Add photo input + What-If
  card to the new merged panel.

**Verifiable:** What-If shows live months-to-goal as the slider
moves. Adding a photo to a goal shows the thumbnail on the card.

### Increment 2 — Schema + dual-write (lift to cloud)
(was Inc 6 — moved up to land the cloud surface before more local features
accumulate; subsequent increments renumber by +1.)

**Goal:** money data leaves the JSONB blob. Dual-write, reads stay
JSONB-first.

**Touches:**
- `docs/migrations/money-transactions-schema.sql` — `money_transactions`
  table per §3.
- `docs/migrations/money-goals-schema.sql` — `money_goals` table per §3.
- `docs/migrations/budget-categories-schema.sql` — `budget_categories`
  table per §3.
- `docs/migrations/allowance-credits-schema.sql` — `allowance_credits`
  table per §3 (catches up the Inc 4 JSONB history once Inc 4 ships).
- `app/js/sync.js` — `_mirrorMoneyToCloud(supa, userId)` mirrors all
  four shapes. Pattern follows `_mirrorChoresToCloud` exactly:
  `profile_id` = `_pidOf(active)` with `_solo` fallback; silent
  bail on `42P01`.
- `app/js/finance.js` — id coercion (numeric Date.now → text PK
  `'tx_<profileId>_<n>'`) on write so sibling profiles can't collide.

**Verifiable:** with all 4 SQL files applied, Supabase Studio shows
rows for every locally-stored transaction / goal / category /
allowance credit; deleting the LS blob and reloading shows the
records still alive on the cloud (cloudLoad pulls them back into
JSONB).

### Increment 7 — Parent purchase approvals + AI Money Coach

**Goal:** the premium-tier polish layer.

**Touches:**
- `app/js/data.js` — `D.purchaseRequests:[]` (kid-submitted,
  parent-approved).
- `app/js/finance.js` — `requestPurchase()` UI on transactions over
  a configurable threshold (`D.purchaseApprovalThreshold`, default
  $25). Parent Hub queue in `ph-approvals` (the unified queue from
  the reconciled plan Phase D #13). Brevo email notify on submit.
- `api/ai-summary.js` — new mode `'money-coach'` (Haiku, ~350
  tokens). Inputs: last 30 days of `money_transactions`. Output: 1
  paragraph + 1 next-month focus suggestion. **CommonJS** —
  switching this file to ESM has caused 502s historically per
  CLAUDE.md.
- `app/js/finance.js` — AI coach card on the Dashboard, calls the
  API monthly. Cache result on `D.financeCoachLastMonth`.
- Virtual debit card visualization (cosmetic, shows balance + child
  name + last-4 dummy + emoji).

**Verifiable:** transaction over threshold blocks until parent
approves; AI coach card returns a sensible monthly summary; virtual
card flips on Dashboard hover with reduced-motion respect.

---

## §6 — Design direction

Same faith-quality bar as Chores Increment 4. Bebas Neue cap-labels.
Glass-surface cards with `--mn-surface-soft` backgrounds and
`--mn-card-border` borders. Chart.js (already loaded for Habits) for
all numeric visuals — no more inline SVG donuts.

Palette purpose-coded:
- **Emerald** (`--mn-accent`) = primary brand, balances + income
- **Indigo** (`--mn-indigo`) = education / Learn lessons
- **Amber** (`--mn-amber`) = savings + allowance highlights
- **Coral** (`--mn-coral`) = expense + over-budget warning

Differentiated from Chores by hue family AND by the secondary palette:
Chores has NO indigo or coral; Money has NO bright green (#22c55e) or
purple (#a78bfa).

Empty states inherit the `.ch-empty` card shape from the Chores
design system but rebranded as `.mn-empty` with the Money palette.

---

## §7 — Reuse map

| Existing | Reused for |
|---|---|
| `D.transactions[]` | Stays canonical. Inc 2 mirrors to `money_transactions`. |
| `D.savingsGoals[]` | Merged into the unified Goals sub-tab in Inc 1. Inc 2 mirrors to `money_goals`. |
| `D.bills[]` | Bills sub-tab stays as-is. Light polish only. |
| `D.bank` + `D.bankHistory[]` | Dashboard hero. No cloud lift. |
| `calcTax()` + TY2025 brackets (finance.js) | Embedded in Lesson 5 (Taxes) inside Learn. |
| `calcPaycheckSim()` | Paycheck sub-tab stays. Linked from Lesson 5. |
| `calcBudget()` 50/30/20 | Linked from Lesson 1 (Budgeting). |
| `MONEY_CAT_EMOJI` (Inc 3) | Shared between Transactions + Bills + Budget categories. |
| `screenFlash` + `launchSideConfetti` (chores) | Milestone celebrations. |
| Chart.js (loaded globally for Habits) | Dashboard donut + monthly bar chart + Budget bar chart + What-If preview. |
| `escapeHtml` (parent.js) | Every renderer that interpolates user-supplied strings. |
| `_pidOf(active)` (parent.js, Phase 1 v249) | All 4 new tables' `profile_id` column. |
| `_mirrorChoresToCloud` pattern (sync.js) | Template for `_mirrorMoneyToCloud`. |
| `screenFlash` (celebrations) | Lesson-passed + milestone hits. |

Parent Bucks (`D.pb`) stays **separate** — PB is parent-funded virtual
currency for the Chore Store; money is real-world dollars. Merging
would corrupt both mental models.

The Skills tab's resume / Career Explorer is unrelated — no
cross-tab work needed.

---

## §8 — Risks / open questions

1. **Topic-card grid (`#financeTopicGrid`).** Drop / keep / merge?
   Recommended drop (see §2). Final decision deferred to Inc 1.
2. **Allowance × multi-profile.** Each child needs their own
   `allowanceConfig`. Currently `D.allowance` is single-valued.
   Inc 4 must scope to the active profile and the Parent Hub must
   expose per-child configuration. Adds complexity but is the
   correct shape.
3. **Auto-credit running on every load is wasteful.** Throttle via
   `lastCreditedOn` check — only mutate if today's date warrants a
   credit. Already in the Inc 4 plan but worth flagging.
4. **Lesson content authoring.** 8 lessons × ~150-200 words body +
   3-5 quiz questions each = a real writing pass. Recommend
   delegating Lesson 1-2 drafts to `content-author-faith` agent
   (rebrand prompt for finance), or writing in
   `/content/finance-drafts/` first.
5. **CSV export PII consideration.** Transaction descriptions may
   contain identifiable text. Export is user-initiated, downloaded
   to user's own device — low risk, but the export button should
   carry a small "this file contains your transaction history"
   helper text.
6. **Receipt + goal photos may contain minors / sensitive content.**
   Use the chore-proofs bucket pattern verbatim: PRIVATE, signed
   URLs, 5 MB cap, image MIMEs only. No content moderation in
   scope.
7. **AI Money Coach drift risk.** Mathematical claims ("you should
   save 20% of your income") could be wrong for a given kid's
   situation. Stay strictly observational (last month's pattern)
   and suggestive ("consider categorizing X"), not prescriptive.
8. **What-If simulator math correctness.** Compound interest is the
   pedagogical hook — get the formula right and verify against a
   second source before shipping. Lesson 8 deep-dives on this so
   the same engine powers both.

---

## §9 — What this plan does NOT do

- No SQL run. The §3 schemas are **sketches** — final SQL goes
  through `docs/migrations/_TEMPLATE.sql`, gets reviewed, and runs
  in Supabase Studio on user approval per increment.
- No code edits. Every bullet under "Touches" is a forward
  statement of work; nothing is staged.
- No commits, no pushes.
- No changes to the Well (faith experience).
- No changes to `app/index.html` tail. Every increment that does
  touch index.html ends with `index-html-guardian` PASS before
  commit.
- No CBT / Skills / Goals / Schedule / Parent-Hub work — those
  are separate plans.
- No Parent Bucks ↔ Money merge — they stay separate mental
  models.

---

## §10 — Locked-in decisions (pending user confirmation)

1. **Section id remains `#s-finance`.** Don't rename to `#s-money`
   even though the masterplan and tab label say "Money."
2. **Sub-tab IA: 8 tabs.** Dashboard / Transactions / Budget /
   Goals / Bills / Paycheck / Allowance / Learn. Keep Bills +
   Paycheck. Drop standalone Tax Ed (content absorbed into Learn
   lesson 5). Merge Goal Savings + Sav. Goals → Goals.
3. **Topic-card grid dropped** in Inc 1 (per §2 recommendation).
4. **Money palette: emerald + indigo + amber + coral.** Distinct
   from chores green/gold/purple by hue AND by secondary palette
   (chores has no indigo/coral).
5. **Chart.js for all numeric visuals.** Replace the inline SVG
   donut in Inc 1.
6. **New tables use `_pidOf(active)` for `profile_id`** — no PIN
   debt from day 1. Phase 1 of the decouple (v249) backfilled
   stableIds for every profile.
7. **`D.pb` (Parent Bucks) stays separate from money.** No merge.

---

## §11 — Tracked follow-ups (out of scope this plan)

### §11.1 — Cross-feature feed (audit P0 from reconciled plan §241-242)

Schedule, school assignments, chore due dates, goal milestones,
reading-plan day all need a unified calendar feed. Money goals'
`target_date` joins that feed when the cross-feature work happens.
Not blocking Money increments.

### §11.2 — Parent Hub Approvals queue

Inc 7's purchase-approval flow is one of three approval surfaces
(also chore-photo proofs, self-chore approvals). They should
eventually unify into one Parent Hub Approvals sub-tab. Reconciled
plan Phase D #13. Money Inc 7 ships purchase approvals in their
own flow; consolidation is a separate task.

### §11.3 — `D.allowance` legacy field cleanup

After Inc 4 ships `D.allowanceConfig`, the legacy `D.allowance`
number field is unused. Delete it from DEF + add a one-time
sanitize in `loadData` after a few deploys of soak.

### §11.4 — Storage cleanup for receipts + goal photos

Mirrors the §9.1 chore-photo cleanup follow-up from
CHORES_BUILD_PLAN.md. Three trigger points:
- On transaction delete — delete the receipt object.
- On goal delete — delete the goal photo.
- Auto-purge after a window — for verified-and-old transactions.

Storage DELETE policies need to exist on both new buckets before
this cleanup work can ship.

### §11.5 — Money Streak Engine

Days under-budget streak + weekly-budget-kept streak are obvious
gamification hooks. Not in any current increment to keep scope
honest. Files under the audit cross-cutting #1 streak
consolidation (Option C) when that lands.

---

*End of plan. Inc 1-7 sized roughly: Inc 1 (1-2 sessions — IA + design
system), Inc 2 (1-2 — schema + dual-write template lift from chores),
Inc 3 (1 — tx polish + CSV), Inc 4 (1-2 — allowance), Inc 5 (2-3 —
content writing dominates), Inc 6 (2-3 — Chart.js + buckets + What-If),
Inc 7 (2 — AI mode + parent flow). Total ~12-16 sessions of careful
work.*
