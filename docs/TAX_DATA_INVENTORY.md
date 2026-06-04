# Tax Data Inventory

**Date:** 2026-06-04
**Scope:** Every reference to tax data or a tax year across `app/`, `api/`, and `content/`.
**Read-only audit.** No code edits applied without explicit direction on each figure.

---

## TL;DR — coherence bug worth noting

The **runtime tax estimator** (`app/js/skills.js:4964` → `calcTax()`) was already updated to **TY2025** in a prior session, with an IRS source citation right in the code:

```
app/js/skills.js:4972  // 2025 Federal brackets (IRS Rev. Proc. 2024-40, TY2025).
```

…but every piece of **lesson copy** still teaches **TY2024 figures**. The user is told "Standard deduction (2024): $14,600 single" then enters their income and the calculator deducts **$15,000** silently. The teaching and the math disagree.

---

## §1 — Inventory

### A. Runtime tax estimator (already TY2025 — verified IRS Rev. Proc. 2024-40)

| File:line | Element | Current (TY2025) |
|---|---|---|
| `app/js/skills.js:4974` | Single brackets | $11,925 / $48,475 / $103,350 / $197,300 / $250,525 / $626,350 / 37% |
| `app/js/skills.js:4975` | MFJ brackets | $23,850 / $96,950 / $206,700 / $394,600 / $501,050 / $751,600 / 37% |
| `app/js/skills.js:4976` | HoH brackets | $17,000 / $64,850 / $103,350 / $197,300 / $250,500 / $626,350 / 37% |
| `app/js/skills.js:4978` | Standard deduction | single $15,000 · MFJ $30,000 · HoH $22,500 |
| `app/js/skills.js:4983` | Self-employment tax | 0.9235 × 0.153 (statutorily fixed — safe) |

### B. Lesson copy — currently teaches TY2024 figures

#### B.1 `app/js/skills.js` (Skills tab — taxes lesson series)

| File:line | Year label | Figure shown | What it represents |
|---|---|---|---|
| `skills.js:112` | 2024 | $11,600 / $47,150 / $100,525 / $191,950 (single) | Bracket worked-example |
| `skills.js:187` | 2024 | $14,600 / $29,200 / $21,900 | Standard deduction |
| `skills.js:201` | 2024 | $7,000 / $8,000 (50+) | Traditional IRA contribution limit |
| `skills.js:203` | — | $4,150 / $8,300 | HSA contribution limit (TY2024) |
| `skills.js:215` | 2024 | 67¢ / mile | Business mileage rate |
| `skills.js:238` | 2024 | $7,830 (3+ kids) · $632 (no kids) | EITC max credit |
| `skills.js:255` | "as of 2024" | $7,500 | EV credit (statutorily fixed by IRA 2022) |
| `skills.js:268` | 2024 | $23,000 | 401(k) contribution limit |
| `skills.js:611` | 2024 | $9,450 / $18,900 | ACA out-of-pocket maximum |
| `skills.js:613` | 2024 | $4,150 / $8,300 | HSA limit (duplicate of B.1 line 203) |
| `skills.js:1056` | 2024 | $160,200 | Social Security wage cap |
| `skills.js:1076` | 2024 | $23,000 | 401(k) limit (duplicate of line 268) |
| `skills.js:2411` | 2024 | $23,000 | 401(k) limit (third copy) |
| `skills.js:2416` | 2024 | $7,000 | Roth IRA limit |
| `skills.js:2432` | 2024 | $7,000 (and $23,000) | Quiz question + correct answer about Roth IRA limit |

#### B.2 `app/index.html` (Money tab → Tax Education panel)

| File:line | Year label | Figure shown | What it represents |
|---|---|---|---|
| `index.html:2674` | "Standard Deduction (2024)" | $14,600 / $29,200 / $21,900 | Section heading + 3 badge figures |
| `index.html:2695` | — | up to $7,830 | EITC max (TY2024) |
| `index.html:2741` | "67¢/mile in 2024" | 67¢ | Business mileage rate (in self-employed deductions block) |
| `index.html:2762` | "2024 limits" | 401k $23,000 · IRA $7,000 | Retirement-accounts callout |
| `index.html:2766` | "2024 limit" | $4,150 / $8,300 | HSA limit |
| `index.html:2822` | — | 67¢ / mile (×5,000 = $3,350) | Pro-tip card; rate is implicitly TY2024 |
| `index.html:2697` | — | $2,000 Lifetime Learning Credit | Statutorily fixed since 2018 — safe |
| `index.html:2696` | — | $2,500 American Opportunity Credit | Statutorily fixed — safe |
| `index.html:2698` | — | $3,000 / $6,000 Child & Dep. Care Credit | Statutorily fixed — safe |
| `index.html:2699` | — | $7,500 EV Tax Credit | Statutorily fixed (IRA 2022) — safe |
| `index.html:2803` | — | "Free if income under $79,000" | IRS Free File eligibility — was TY2024; check current |

### C. Conceptual / statutorily-fixed copy (no year-tied figure — already safe)

| File:line | What it says | Notes |
|---|---|---|
| `index.html:2717` | "15.3% self-employment tax" (6.2% SS + 1.45% Medicare doubled) | Statutory — won't change without legislation |
| `index.html:2728` | "Q1 Apr 15, Q2 Jun 15, Q3 Sep 15, Q4 Jan 15" | Statutory quarterly dates |
| `index.html:2660-2664` | Gross → pre-tax → taxable → net flow | Pure concept |
| `skills.js:138-145` | SE tax math (15.3% on 92.35% of net) | Statutory |
| `skills.js:241` | Child Tax Credit $2,000 / $1,700 refundable | Stable: TY2024 = TY2025 per IRS Rev. Proc. 2024-40 |
| `skills.js:243-244` | AOC $2,500 / 40% refundable / $1,000 | Stable since TCJA 2018 |
| `skills.js:246-247` | Lifetime Learning Credit $2,000 | Stable since 2002 |
| `skills.js:249-250` | Saver's Credit $1,000 / $2,000 | Stable |
| `skills.js:252-253` | Child & Dependent Care Credit $3,000 / $6,000 | Stable |
| `skills.js:255-256` | EV credit $7,500 | Stable (IRA 2022 runs through 2032) |
| `skills.js:1054-1058` | "Federal/state withheld, SS 6.2%, Medicare 1.45%" | Statutory; the $160,200 SS cap is at `:1056` and IS year-tied → see §B.1 |
| `email.js:1313` | Quiz: "What is a 401k?" → "Retirement savings account" | No figure, no year — safe |
| `finance.js:474` | Paycheck-sim copy mentioning FICA + 401k generically | No year-tied figure |

### D. Non-tax matches (excluded from this audit)

- `api/ai-summary.js` and `api/faith-register.js` use "bracket" in the sense of *age bracket* — unrelated.
- `content/faith-drafts/**/*.md` matches are biblical references ("tax collector") — unrelated.
- `app/js/data/plans.js` matches are biblical content — unrelated.

---

## §2 — Categorization

### Safe to update NOW (no figure depends on year)

| File:line | Proposed change | Rationale |
|---|---|---|
| (none with strict "year-label-only" definition) | — | Every "2024" stamp in this codebase travels with a TY2024-specific dollar amount. Flipping the year label without also updating the figure would mis-teach. Flipping the figure requires a verified source. |

**One borderline case** I'm flagging instead of auto-applying:
- `app/js/skills.js:255` `"Electric Vehicle Credit — Partially refundable (as of 2024)"` — the $7,500 amount and partial refundability are stable through 2032 under IRA 2022. The "(as of 2024)" parenthetical refers to the point-of-sale transfer option that took effect January 1, 2024. Still factually accurate. Recommend leaving as-is.

### Needs verified figures before any edit

**Group 1 — TY2025 figures already verified inside this repo** (sourced from `calcTax()`'s IRS Rev. Proc. 2024-40 citation; safe to apply on your nod without external research):

| Lesson copy | TY2024 → TY2025 |
|---|---|
| Single bracket worked-example at `skills.js:112-118` | $11,600 → $11,925 · $47,150 → $48,475 · $100,525 → $103,350 · $191,950 → $197,300 |
| Standard deduction at `skills.js:187`, `index.html:2674-2678` | $14,600 → $15,000 · $29,200 → $30,000 · $21,900 → $22,500 |

**Group 2 — TY2024 figures NOT verified for TY2025 inside this repo** (need you to source the current values before any edit):

| Subject | Current copy | Where used |
|---|---|---|
| 401(k) employee contribution limit | $23,000 (2024) | `skills.js:268, 1076, 2411`; `index.html:2762` |
| Traditional IRA / Roth IRA contribution limit | $7,000 (2024) | `skills.js:201, 2416, 2432`; `index.html:2762` |
| HSA contribution limit | $4,150 / $8,300 (2024) | `skills.js:203, 613`; `index.html:2766` |
| EITC max credit | $7,830 / $632 (2024) | `skills.js:238`; `index.html:2695` |
| ACA out-of-pocket maximum | $9,450 / $18,900 (2024) | `skills.js:611` |
| Social Security wage cap | $160,200 (2024) | `skills.js:1056` |
| Business mileage rate | 67¢/mile (2024) | `skills.js:215`; `index.html:2741, 2822` |
| IRS Free File income ceiling | $79,000 | `index.html:2803`; `skills.js:164` |

**Group 3 — Year-stamped but unrelated to tax data** (separate cleanup, out of scope here):

| File:line | What | Note |
|---|---|---|
| `skills.js:502` | "Interest rates in 2024 range from 5% to 14%+" | Car loan rates — out of tax scope |

---

## §3 — Next-step proposals

1. **Do `Group 1` first** (brackets + standard deduction) — already verified inside the repo via `calcTax()`'s IRS citation. This is the highest-leverage edit: it eliminates the teaching-vs-math coherence bug. One file (`skills.js`) + one inline panel (`index.html`) — touches `index.html`, will need the tail-integrity guardian.
2. **Source `Group 2`** (401k / IRA / HSA / EITC / OOP max / SS wage cap / mileage / Free File ceiling) from IRS Rev. Proc. 2024-40 (TY2025) and/or Rev. Proc. 2025-xx if you want TY2026. Apply in a second pass.
3. **De-duplicate** the same figure repeated in 2–3 places (401k limit appears 3 times in `skills.js` alone; HSA limit appears twice). When sourcing TY2025+ values, update all copies in one pass to prevent drift.

---

*Inventory complete. Awaiting direction on which group to act on.*
