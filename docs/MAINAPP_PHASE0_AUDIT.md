# Main App World-Class Transformation — Phase 0 Audit (2026-07-09)

Four parallel read-only audits of the main (life-skills) app + parent portal against the faith-app
reference standard. Raw agent reports preserved verbatim below, followed by a verification addendum.
No code was changed. Build plan awaits owner approval.

---

## AUDIT A — DESIGN DELTA (main app vs design system)

Reference docs read in full: `.claude/skills/visual-design/SKILL.md`, `.claude/skills/yourlifecc-design/SKILL.md`, `docs/design-system.md`. Faith surfaces not audited. Radius baseline used: as-built ruling 12/14/16/22 (+ doc §4 tokens 6px inputs, 10px buttons, pills 99/999) — values outside BOTH sets are flagged.

**Global note:** Orbitron = 0 hits (fully retired, confirmed `app/index.html:10507`).

### Child home / Command Center (`#appCommandCenter`, command-center.js, daily-briefing.js)

- MED | app/index.html:1151,1153,1155 | `.cc-streak` uses off-palette orange/coral pair `#F5A623`/`#F47B5A` (gradient fill, gradient-clipped 700-weight number, radial glow wash) — not `--warning #f59e0b`, not any token | Re-cut to `--warning` or a documented one-off ruling
- MED | app/index.html:1151,1163 | `.cc-streak` and `.cc-ring` are `border-radius:18px` — 18px is not on the 12/14/16/22 scale | Move to 16px (or 22 if they're "hero" tier)
- MED | app/index.html:1167,1190 | Gold `#FBBF24` XP ring fill + brass `.xpj-toast__title` on the non-faith child home ("brass" XP register). Gold is documented as the FAITH accent | Owner decision: bless a "brass = XP" register or re-cut to cyan
- MED | app/index.html:1216 | `.cc-eyebrow` gold is `#f5b431` — a third gold hex (≠ `#fbbf24`, ≠ `#f5c842`), and gold Oswald eyebrows sit above non-faith card groups ("shared section-voice chrome" per comment) | Normalize hex to `#fbbf24`; decide whether gold eyebrows belong on life groups
- MED | app/index.html:1139,1155,1257 etc. | `ui-monospace/'JetBrains Mono'` numeral face used across CC chips/ring/toast — a font family not in the system (Bebas/Inter/Oswald/Newsreader) | Document as the tabular-numeral face or replace with Inter + `tnum`
- LOW | app/index.html:1146 | `.cc-daystamp__quote` uses Georgia italic — faith-register serif on the life home | Swap to Inter italic or document
- MED | app/index.html:1240 + command-center.js:277 | `.cc-continue__eyebrow` is .6rem (9.6px) weight-600 hardcoded ALL-CAPS string — sub-11px violation | 11px minimum, `text-transform` instead of hardcoded caps
- MED | app/index.html:1136,1155,1158,1190,1256 | weights 600/700 throughout CC UI text (greeting 600, tile titles 600, nums 700) vs. 400/500 rule | 500 for titles; 700 numerals only if ruled a display lockup
- MED | app/index.html:1163 (comment 1160-1162) | `.cc-ring` claims "theme-independent, no :root.light pass" — but CC is NOT on the scene-layer exemption list, and every sibling (`.cc-tile`, `.cc-streak`, `.cc-chip`) has light overrides at 18357-18465 | Add `:root.light` pass for `.cc-ring`
- LOW | app/index.html:1220,1234,1279 | CC cards keyed to `#22d3ee` cyan family (borders, focus rings) while `--brand-primary` is `#38bdf8` — comments call `#22d3ee` "the climb's signature". Two cyans circulate app-wide (61 hits, 16 files) | Owner decision: canonize `#22d3ee` as the life accent or converge on `#38bdf8`
- OK: reduced-motion fully covered (index.html:1344-1350, 1175, 1199); `.cc-tile`/`.cc-pcard` 16px radius correct; light pass otherwise thorough.

### Daily Briefing (`#dailyBriefingCard`, app/index.html:903-1125)

- MED | app/index.html:918,928,1017 | Gold `#fbbf24` on name highlight, streak count, and gold→orange (`#f97316`, off-palette) trait fill — gold on a non-faith child surface | Same brass-register decision as CC
- LOW | app/index.html:931-949 | `.db-flame-large/epic` glow + ember particles + infinite pulse (decorative glow on interface layer) | Acceptable as celebration FX only if ruled so; reduced-motion IS covered (1040,1062)
- LOW | app/index.html:970,1008 | `.db-tile-label` 600, `.db-trait-name` 700 | 500
- OK: 22px hero radius + 14px `.db-tile` match the ruling exactly; `:root.light .db-tile` exists; `dbConfettiBurst` checks reduced-motion (daily-briefing.js:262).

### Home menu / legacy hero (`#appHome`, `#appMenu`)

- MED | app/index.html:1529 | `#parentWelcomeCard` CTA: decorative cyan→violet gradient fill (`#38bdf8→#a78bfa`) + `font-weight:800` + glow shadow on an interface button | Flat `--primary` fill, weight 500
- LOW | app/index.html:1454,1089 | `.app-menu-label` "WHAT DO YOU WANT TO DO?" — hardcoded caps, .75rem 700 | Sentence case, `text-transform`, weight 500
- LOW | app/index.html:2133,2143 | Legacy `#heroGreeting` 18px radius + cyan/violet gradient wash; `#heroTodaysVerse` gold wash (hidden legacy, but still shipped CSS) | Sweep with the legacy-hero removal

### Life-side systemic (all sections)

- **HIGH (systemic, ~90 instances in index.html + ~40 in modules)** | e.g. app/index.html:4238 (school), 4751 (health), 6295 (mood), 6030 (bio), 7589-7641 (rewards), 2495/2645/2975 (finance), 7123/7401 (chores), 5026 (habits) | Section eyebrows are **Bebas Neue (`var(--fh)`) at 9.9-12.5px** — Bebas in UI at sub-11px sizes, the exact pattern the faith side replaced with Oswald 600 11px `.cc-eyebrow` | Single highest-leverage fix: one shared eyebrow class (Oswald or Inter 600 11px caps) swapped in everywhere
- **HIGH (systemic)** | school.js/chores.js/habits.js/health.js/finance.js/goals.js/skills.js/parent.js/misc.js | **Zero light-mode awareness in any life module** (0 `:root.light`/light checks) while rendering ~300 hardcoded `rgba(255,255,255,.0x)` panel backgrounds and hex text colors inline — mixed tokens + hardcoded on the same elements (the documented half-inverts anti-pattern) | Move repeated inline styles into classed CSS with light overrides
- MED (systemic) | 360 `font-weight:600+` in modules + ~270 in index life ranges; 330 sub-11px font sizes in modules (parent.js alone: 144) + ~240 in index ranges | Weight/size normalization pass

### Finance (`#s-finance`, finance.js)

- MED | app/index.html:2478-2480 | `--mz-indigo: #6366f1` token family in life chrome — indigo is reserved for faith surfaces ("Indigo/teal never appear in non-faith chrome") | Re-cut to cyan/violet core
- LOW | app/index.html:2698 | Money hero gradient runs `#064e3b→#10b981→#6366f1` (green into indigo) | Drop the indigo stop
- MED | app/index.html:2513,2527,2550,2681,3747 | `border-radius:18px` cards/chips (6×); also 9px (3048,3926-4037), 5px (2998) | Snap to 16/12/pill
- LOW | app/index.html:3826,3837 | Faith-lens lesson label uses gold `#f5c842` — doc §1 says "Through a Faith Lens" companion chips = teal `#14b8a6`; the newer gold-register ruling points gold. Conflict needs a ruling | Owner decision; record only
- LOW | app/index.html:3064,2727 | Gold pending-pills + gold→`#d97706` gradient chip in non-faith money UI | Use `--warning`
- OK: has 3 `:root.light` rules in-section + `finance-summary-opener` light rules in app.css; slider transition reduced-motion covered (finance.js:2683).

### School (`#s-school`, school.js)

- HIGH | whole section | **No light-mode coverage at all** — 0 `:root.light #s-school` rules in index.html OR app.css, against 32 (index) + 21 (school.js) hardcoded white-alpha backgrounds and light-hex text | Add the section light pass
- MED | app/index.html:4163-4168 | Parent Bucks strip: gold `#fbbf24` text, `font-weight:900` balance, `#fde68a` button, .65rem text, 6px radius | Brass-register decision + weight/size fix
- LOW | school.js radii: 7px(×4), 9px, 6px | Snap to 8/12

### Habits (`#s-habits`, habits.js)

- MED | habits.js:497 | Streak bar gradient `#22d3ee→#a78bfa` (cyan-into-violet decorative gradient on a progress fill) | Single-hue fill
- LOW | habits.js:486,493,501 | `var(--fh)` Bebas at .72rem + weight 800 + `#22d3ee` | Eyebrow class fix
- LOW | habits.js radii: 10px(×8), 6px(×2), 0-8px-8px-0 single-sided rounding (anti-pattern: never round a single-sided accent) | 12px rows; unround the accent bar
- OK: section markup radii (14px) on-scale; 2 light rules in-section.

### Health (`#s-health`, health.js)

- MED | whole section | No `:root.light #s-health` in index.html (2 rules in app.css only); inline `rgba(255,255,255,.1)` stat tiles at index.html:4914,4918 go invisible on light | Light pass
- LOW | app/index.html:4770,4782 | Macro labels: gold `#fbbf24` "Carbohydrates", violet `#a78bfa` "Fats" at weight 700 — rainbow-keyed categories | Neutral labels + one accent
- LOW | health.js:709,739,1131,1191 | `#22d3ee` chart fills mixed with `#38bdf8` in the same gradients (both cyans on one surface) | Pick one cyan
- LOW | index radii 3px legend swatches (4722-4724), 9px tiles | 4px/8px

### Goals (`#s-goals`, goals.js)

- LOW | app/index.html:5135-5140 | Same gold Parent Bucks strip as school (weight 900, `#fde68a`, .65rem) | Shared component fix
- LOW | goals.js:874-876,1145 | Georgia serif for quote text on life surface | Inter italic or ruling
- LOW | goals.js:29,323,830 etc. | `#a78bfa` accents + tagColors cycling violet across career cards | Acceptable as `--secondary` if deliberate; currently rainbow-ish
- OK: no light gaps beyond global; radii mostly 8px, one 20px (goals.js:1143 area) → 22 or 16.

### Skills (`#s-skills`, `#s-craft`, skills.js)

- MED | skills.js:4172-4175 | AI Analysis button/label: `#8b5cf6`/`#a78bfa` purple fills + weight 700 + .65rem letter-spaced label | `--secondary` token, one accent, 11px+
- MED | skills.js:5789-5792,5887 | Accent-theme presets write `--p` as `#8b5cf6`/`#6366f1` — indigo entering life chrome via themes; app.css:864 even defines a neon theme (`#39ff14`/`#ff00ff`) | Curate theme palette
- LOW | skills.js:6596,6708 | Resume/portfolio "creative" templates: `#7c3aed→#ec4899` gradients (print-doc context — possibly exempt) | Ruling
- LOW | skills.js:5027 | Vinyl spin `animation:'spin 2s linear infinite'` set in JS with no reduced-motion guard | Guard with matchMedia
- LOW | skills.js radii: 100px(×6, pill-intent), 3px, 5px, 7px, single-sided `0 6px 6px 0` | 99px pills; unround accents

### Chores (`#s-chores`, chores.js)

- MED | app/index.html:6933-6938 | Section defines BOTH `--cz-purple:#a78bfa` and `--cz-gold:#fbbf24` token families — three accents (cyan base + purple + gold) on one life surface | Cut to base + one accent
- MED | app/index.html:7072 (`ch-hero` 18px), 7292 (18px), 7433-7440 (15px ×8), 7353 (5px); chores.js: 10px, 5px, 2px | Radius snap
- LOW | app/index.html:7433-7440 | Quick-select buttons .6rem (9.6px) text | 11px+
- LOW | chores.js:555,683,715 | .62rem photo button, .55rem (8.8px) stat label, gold `#fbbf24` as "pending" status (vs `--warning`) | Size + token fix
- LOW | app/index.html:7464-7465 | `.cb-badge` radial-gradient glow washes (decorative glow, interface layer) | Flatten
- OK: best-covered life section for light mode (11 `:root.light` rules) — the pattern to copy.

### Mood / Journal / Schedule / Sports

- LOW | app/index.html:6295,6300 | Mood: 2 Bebas mini-eyebrows; radii clean (12px), no other deltas | Eyebrow class
- OK | Journal (`#s-journal`) | Clean in-section; 4 light rules in app.css
- OK | Schedule/Calendar | Clean (no hardcoded colors, no radii)
- LOW | app/index.html:17781-17784 | Sports landing: `#f5a623` (same off-palette orange as CC streak) note-card + Bebas .68rem eyebrow; `sds` scene has light rules in app.css (32) and reduced-motion (sports.js:361) | Orange → `--warning`

### My Climb (life-path.js) — scene-layer

`#lifeClimbOverlay` IS on the documented scene exemption list (theme-independence + hardcoded hex are sanctioned; cyan `#22d3ee` night scene matches walk-path treatment). Remaining findings within the exemption:
- MED | life-path.js:174-263 | Reduced-motion covers only `.lp-sheet`/overlay entrance (line 241); ambient infinite animations `lpTwinkle`, `lpStarGlow`, `lpBreathe`, `lpBeacon`, `lpFloat`, `lpBtnGlow` keep running under prefers-reduced-motion (a `_prm` helper exists at line 57 but doesn't gate these) | Extend the media query to all lp keyframes
- MED | life-path.js:207,212,225,231,243 | Station-sheet text at .54-.62rem (8.6-9.9px) — contrast/legibility rules apply everywhere, even scenes | 11px floor
- LOW | life-path.js:192,244,262 | weights 800/900 throughout; `.lp-cta` glowing animated gradient button | Scene lockups tolerated; CTA glow is heavy
- LOW | life-path.js radii: 20px scene, 999/50% pills, one `22px 22px 0 0` sheet (fine), 10px/6px oddments | Minor

### Parent hub (`#s-parent`, `#parentCelestialHome`, parent.js)

- HIGH | parent.js (whole module) | Biggest single offender: 144 sub-11px font sizes (e.g. 444-457: .55-.58rem uppercase stat labels), 101 weights 600-900, 96 hardcoded white-alpha styles, 0 light-mode awareness, 24 purple hits, radii spread across 3/5/7/9/10/11/13/15/18/20px | Needs its own normalization pass
- MED | app/index.html:19085,19088 | `.ph-subtab.active` = green→violet gradient (`#22c55e→#a78bfa`) with navy text — decorative two-hue gradient on a tab control (light mode keeps it too) | Flat `--primary` active state
- MED | app/index.html:19206,19209 | `#ph-rewards`/`#ph-contests` titles are gradient-clipped text (cream→gold→`#d97706` / gold→violet) | Solid heading color
- MED | app/index.html:19078,18007 | `.ph-card-badge` .58rem weight-900 gold gradient badge; nav badge .55rem weight-900 gold | 11px, weight 500-700, token color
- MED | app/index.html:19120,19145,19252,19620,19731,20221,20377 | 18px radius tier repeated (7×) + 15px (20339-20364), 11px buttons (19157,19187,20328), 13px (19195,20413), 9px, 7px | This is a de-facto parallel radius scale; snap to 12/16/22
- LOW | app/index.html:19615-19662 | Reports header: violet-accented on purpose ("AI/summary" signal — arguably fine as `--secondary`) but gradient-clipped Bebas title + Georgia italic sub + .62rem eyebrow | Keep violet, drop gradient text
- LOW | app/index.html:19195,20413 | `.ph-addbtn` Bebas 1.25rem on a gradient button fill | Inter 500
- MED | parent.js:4856,5856-5871 | `quizPulse 2s infinite` gold-glow ring + celebration confetti + shake — all JS-driven, no reduced-motion guard anywhere in parent.js | Add matchMedia guards
- LOW | parent.js:2070,2097,2562,4834-4835 | Chart palettes cycle 7-16 colors incl. `#a78bfa`, `#8b5cf6`, `#22d3ee`, `#e879f9` (rainbow-sequenced categories) | Dataviz ramp cut
- OK: `#s-parent` + `#parentCelestialHome` have the deepest light coverage outside faith (30+27 rules); pch scene has 16 reduced-motion blocks; amber splash CTA (18833) is the documented carve-out — no finding; pch-faith gold verse card (18636) is faith content — gold correct.

### Settings / profile / account

- LOW | app/index.html:337,795 | Sidebar/topbar settings buttons: .7-.75rem weight-700, 9px radius | 8px, weight 500
- LOW | app/index.html:22022-22044 | Profile/logo modal: .68rem labels, 5px radius chip, `#7c3aed→#ec4899` gradient swatch (swatch = a color OPTION, likely fine), `#a78bfa` family-mode chevron (22101-22107) | Label size fix only
- OK: `openSettings` (ui.js:842+) is nearly clean — 1 heavy weight, 0 sub-11px, one violet SVG fill (ui.js:1204).

### TOP 10 highest-impact deltas

1. **Life-side eyebrow system: tiny Bebas everywhere** (~130 instances, 9.9-12.5px, every life section + parent) — one shared Oswald/Inter 600 11px eyebrow class replaces the whole pattern and instantly matches the faith register.
2. **School section has zero light-mode coverage** (0 rules anywhere; 53 hardcoded dark styles) — worst full-section light break.
3. **parent.js typography/scale sprawl** — 144 sub-11px, 101 heavy weights, 0 light-awareness, 15-value radius spread in one module.
4. **Life JS modules render theme-blind inline styles** (~300 hardcoded white-alpha panels across school/chores/habits/health/finance/goals/skills/misc; 0 light checks) — the structural cause of most light-mode bugs.
5. **Gold leakage decision needed**: brass XP register (CC ring, XP toast, DB streak/name/trait) + Parent Bucks strips (school/goals/skills/rewards) + gold `.cc-eyebrow` (`#f5b431`, a third gold hex) on non-faith child surfaces.
6. **Two-cyan split**: `#22d3ee` (61 hits/16 files — CC, My Climb, habits, health, misc) vs `--brand-primary #38bdf8` — needs a canonical ruling, then a mechanical sweep.
7. **Indigo in life chrome**: finance `--mz-indigo #6366f1` token family + money-hero gradient + skills theme presets — direct violation of "indigo never in non-faith chrome".
8. **18px shadow radius tier** (~20 instances: CC streak/ring, finance cards, chores hero, parent ph-hero/blocks/forms) — an undocumented 5th tier; snap to 16/22.
9. **Reduced-motion gaps in JS-driven animation**: parent.js confetti/quizPulse/shake, skills.js vinyl spin, life-path ambient keyframes (twinkle/breathe/beacon/glow).
10. **Decorative gradients on interface controls**: parent subtab green→violet, gradient-clipped section titles (ph-rewards/contests/reports), `#parentWelcomeCard` cyan→violet CTA, habits cyan→violet progress fill.

### Rough violation counts by category

| Category | Count (approx) |
|---|---|
| Bebas in UI/body (mostly sub-13px eyebrows) | ~130 |
| Fonts outside system (Georgia life-side 4, JetBrains Mono ~10 rules, Orbitron 0) | ~15 |
| Purple/violet in life+parent chrome (excl. faith/data files) | ~90 (182 raw hits incl. data/faith) |
| `#22d3ee` second-cyan usage | 61 hits / 16 files |
| Gold on non-faith child/parent surfaces | ~45 |
| Off-palette one-offs (#F5A623/#F47B5A, #f97316, #e879f9, neon theme) | ~12 |
| Border-radius off-scale (2/3/5/7/9/11/13/15/18/20/100px) | ~200 (index ~90 + modules ~110) |
| Light-mode gaps | 1 full section (school) + 3 partial (health/resume/referral) + 9 theme-blind modules + `.cc-ring` |
| Missing reduced-motion | 4 modules (parent.js, skills.js, life-path ambient, chores drag lib) |
| font-weight 600+ in UI text | ~630 (360 modules + ~270 index) |
| Sub-11px text | ~570 (330 modules + ~240 index) |
| ALL-CAPS misuse (hardcoded caps strings, no text-transform) | ~25 |

---

## AUDIT B — UX FLOW DELTA (main app + parent hub vs the faith v460 pattern)

**Reference pattern (verified):** `faith-zones.js` — journey home grid `#fzJourneyHome` / classic `#fzHome` → `fzOpenDest(dest)` hides home, renders ONE destination into `#fzDestBody` (`faith-zones.js:1729-1918`, `home.style.display='none'` at 1811) → back via `fzGoHome()` (`faith-zones.js:2786-2823`) which empties `#fzDestBody`, re-collapses Zone 3 so nothing bleeds, re-shows home, and scrolls to top; plus a swipe-right gesture (2884-2904). One router in, one back out, max 2 levels.

### Findings

**1. HIGH | app/js/ui.js:2297-2399, app/css/app.css:205 | Main-app "navigation" is a 40+-section display swap, not a takeover stack.**
`showSection(id)` removes `.active` from every `.sec` and adds it to the target (`.sec{display:none}` hides the rest). There is no home→destination model: any section can jump to any other section laterally (sidebar, tab bar, hero links, FAB `_chFabGoToAddChore` ui.js:1685). Faith has exactly one hub (`fzJourneyHome`) and one router (`fzOpenDest`), so "back" is always well-defined. **Change:** make the Command Center grid the single hub, route every card through one `ccOpenDest`-style router that records the origin, and give every section one standard back that returns to that recorded origin (not hard-coded `s-hero`).

**2. HIGH | Child home, flag-on vs flag-off (app/js/app-home.js:333-437, app/index.html:729, app/js/command-center.js:299-497).**
Flag-on (`localStorage.ylcc_entry_gate==='1'` → `html.flatnav`): home IS a faith-style photo-card grid — Command Center groups with eyebrows (`_CC_HOME`, command-center.js:173-212), event-delegated `data-dest` clicks → `ccOpenDest` (482-496). This already mirrors faith's anatomy. But the "takeover" is fake: `ccOpenDest` just calls `showSection(target)` (565) — the destination is a legacy section with the old header/chrome, not a clean full takeover, and the CC only handles Climb/Walk/FaithHome specially. Flag-off: home is CC too (app-home.js:396) but nav is the grouped **sidebar** (`buildSideNav` ui.js:1845-1955) + 6-slot bottom tab bar (`TAB_IA` ui.js:1128) — three parallel nav systems live at once (sidebar, tab bar, CC grid). Faith has one. **Change:** flag-on model should retire sidebar+tab landings entirely (Phase 3 "true deletion" per memory) and make `ccOpenDest` a real takeover with an owned back bar like `_ccClimbOverlay`.

**3. HIGH | Back-mechanism inventory — 13 distinct variants (goal is 1).**
1. Persistent desktop sidebar (no back at all; flag-off) — ui.js:1845.
2. Bottom tab bar lateral switch — ui.js:1783 `handleTabBarTap`.
3. Floating `#mobileHomeBack` "← Back" pill → **always** `showSection('s-hero')` — index.html:23339-23341, visibility logic ui.js:1617-1660 (mobile/PWA only; hidden for parents, hidden on faith journey, hidden entirely under flatnav via app/index.html:8724 `!important`).
4. Injected `flatnav-back` "← Home" per section → always `s-hero` — ui.js:2280-2295 (flag-on only; skips s-hero/s-parent/s-scripture).
5. `tg-back-btn` "← Back to topics" → in-section grid restore — ui.js:2090-2100.
6. `data-topic-grid`/`data-topic-panel` `showCardGrid()` helpers — ui.js:2252-2274 (separate system from #5).
7. `bf-back-btn` "← Back to Home" pill per Well panel → `bfTab('home')` or journey home — faith.js:767-796.
8. `fzGoHome` back pill + swipe-right — faith-zones.js:2786, 2884 (the reference).
9. Climb/Walk overlay top bar "← Home" + Esc — command-center.js:611-628, 732-749.
10. Station sheet ✕ + backdrop-click + Esc — life-path.js:376, 441-442.
11. Parent Hub crumb "🏡 ← Hub Home" — index.html:17997.
12. Modal `closeModal` + global Esc — ui.js:2606-2629.
13. Synthetic `history.pushState` backs, four independent implementations: worship `{ylccWorship}` (worship.js:326-379), video player `{ylccVP}` (video-player.js:92-146), meditation `{ylccMed}` (faith.js:14276), sleep stories `{ylccSS}` (faith.js:14522, popstate 13741).
**Change:** one shared `ylBack()` component (pill top-left, Esc, popstate entry) that every surface registers with; delete variants 3-6 and fold 13 into it.

**4. HIGH | Browser/system back is unhandled for ALL section navigation.**
`showSection` never touches `history` (no pushState anywhere in ui.js — grep confirms pushState exists only in faith.js/worship.js/video-player.js). On Android/PWA, hardware back from any main-app section exits the app; faith's media surfaces each patched this locally. Faith's own `fzOpenDest` doesn't push history either — but faith at least has swipe-right. **Change:** push one synthetic history entry per hub→destination transition in the unified router; popstate = the single back.

**5. MED | Section open/close bleed cases.**
- `tgOpenTopic` (ui.js:2073-2109) opens a topic panel with **no scroll reset** — if the user scrolled the grid, the panel opens mid-scroll. Faith's `fzOpenDest` scrolls the dest into view (1918); `showSection` does `window.scrollTo(0,0)` (2399) but tg/bf/phNav sub-navigation happens *inside* a section and skips it.
- `fzOpenDest` legacy tab-alias dests (`biblehub`, `timeline`, `academy`… faith-zones.js:1758-1785) explicitly do **no takeover** — "the home stays visible under the opened panel" (comment at 1743). Even the faith surface violates its own pattern for Zone-3 panels; `bfTab` compensates with injected back pills and Zone-3 collapse choreography (faith.js:784-816) — fragile, has already produced the 2026-07-04 "back-to-old-list" bug.
- Parent drill-down mutates the global `D` to a child's data (`parentDrillChild` parent.js:2808-2827); every `showSection` call must remember to `parentDrillExit()` (ui.js:2305-2307) or all sections render the wrong person's data. State bleed guarded by a hook, not by design.
- Climb/Walk overlays set `document.body.style.overflow='hidden'` and restore on close (command-center.js:653/675, 778/804) — correct, but if `lifeOpenTool` fires from a non-CC host the un-wrapped path can leave the overlay open under the section (wrapper only installed when opened via CC, command-center.js:643-649).
**Change:** every open = scroll-to-top + hide siblings by one mechanism; every close = symmetric restore, owned by the router, not by each feature.

**6. MED | Two backs with two different destinations on the same screen.**
Under flatnav, `_ensureFlatBack` (ui.js:2280) injects "← Home"→`s-hero` into `s-worship` and `s-flashcards` (only s-hero/s-parent/s-scripture are excluded), while worship's own close pill/Esc/back routes to the **Well** home (`worshipClose` worship.js:341: `wellGoto('home')`). A user who entered Worship from the faith journey home sees one back that dumps them to the child home and another that returns to faith. Faith suppressed the equivalent conflict for `s-scripture` itself (ui.js:1653-1659 `_fjFaith` guard) but not for the two faith sibling sections. **Change:** exclude `s-worship`/`s-flashcards` from `_ensureFlatBack` and make their back honor the origin (journey home vs Well vs main home) the way `_fjHomeOn()` routing does.

**7. MED | Back destination ≠ origin (hierarchy broken).**
`#mobileHomeBack` and `flatnav-back` are hard-coded to `s-hero`. Path Home→Learn landing (`s-learn`)→School (`s-school`)→Back lands on **Home**, not Learn; same for Life/Me/Growth landings and every CC group. Faith always returns exactly one level (dest→journey home). **Change:** router records `_navOrigin` per open; back pops one level.

**8. MED | Navigation depth >2 levels (faith max is 2).**
- Home → `s-school` → topic grid → `tgOpenTopic('gpa')` panel → sub-content = 3-4 (ui.js:1981-2052).
- Home CC → My Climb overlay (z-8000) → station sheet (z-9000, life-path.js:237) → "Open tool" → `showSection(route)` into a 4th surface = 4 (life-path.js:464-473, wrapped at command-center.js:643).
- Home → Well `s-scripture` → `bfTab('bible')` → `_bibleSubTab` reader → chapter = 4 (faith.js:818-833).
- Parent: `s-parent` → PIN gate → Watch splash → "Step inside" → `#pchContent` → `phNav('reports')` → `phSubNav('quizzes')` = 5 distinct levels (parent-celestial.js:207-297, parent.js:3073-3170).
- CC → My Faith journey home → `fzOpenDest('walk')` → My Walk tabs → station overlay → tool = 5.
**Change:** collapse topic-grids into the destination itself (one takeover per section, tabs lateral not stacked), and make the parent Watch splash a one-time hero *inside* the hub rather than a stacked gate level.

**9. MED | Parent Hub is ALMOST hub-and-spoke but deviates in three ways.**
It does have the shape: celestial home tiles/`#phCardGrid` (parent.js:3179) → `phNav(tab)` shows one `[data-ph-tab]` panel and hides the rest (parent.js:3103-3106) → "🏡 ← Hub Home" crumb. Deviations: (a) the crumb (index.html:17997) calls `_pchReturnToSplash()` (parent-celestial.js:249-264) which **clears the session gate and returns to the Watch splash**, forcing "Step inside" again — back from a spoke should land on the hub tiles, not re-gate; (b) sub-tab alias sprawl (`TAB_ALIASES`/`SUB_ALIASES` parent.js:3080-3097) means deep code lands users on spokes with sub-state the crumb doesn't unwind; (c) child drill-down's only exit is "navigate away" (toast at parent.js:2826) — no visible back affordance at all. **Change:** crumb → `phNav('home')` directly (splash return only via an explicit "View the Watch" control); add an exit pill to drill-down mode.

**10. LOW | Dead ends / weak affordances.**
- `parentDrillChild` (parent.js:2808): dead end by design — toast-only exit (see 9c).
- Desktop, flag-off, sidebar collapsed (`sidebar-collapsed`, ui.js:1826): non-home sections show no back affordance at all (mobileHomeBack requires ≤860px or standalone).
- `s-referral`, `s-christian-living`: reachable via Me-tab card / stale deep links, not in NAV_ITEMS; back only via floating pill on mobile, nothing on desktop.
- `renderTabLanding('me')` "Sign out" sits in a nav grid (ui.js:1305) — destructive action inside a navigation surface; faith keeps destinations pure.
- `tgShowGrid` removes its back pill on exit (ui.js:2069-2070) but if a section is re-entered via `showSection` while a topic panel is open, `tgInitAll` only runs at boot (ui.js:2111) — School re-entry can land on a stale open panel with its back pill, not the grid (School's own `renderSchool` may reset; Driving/Sports rely on last state).

**11. LOW | Two different "grid→panel" frameworks inside sections.**
`_TG_CONFIG`/`tgOpenTopic` (ui.js:1981) and `data-topic-grid`/`showTopicCard` (ui.js:2252) do the same job with different markup contracts and different back pills. Faith standardized on one (`fzOpenDest` + `fz-back-btn`). **Change:** keep one, port the other's four sections.

**12. LOW | Scroll/anchor behavior is per-feature.**
`showSection`→`scrollTo(0,0)`; `wellGoto`→delayed `bfTab`+`scrollIntoView` (faith.js:761); `fzOpenDest`→`scrollIntoView({block:'start'})` after 60ms; `openSettings` panel scroll after 200ms; climb scrolls to `.lp-current`. Timings 30/50/60/80/100/120ms setTimeouts everywhere. **Change:** router owns "open at top unless a beacon element is declared."

### Proposed unified nav model

- **One hub per audience:** child = Command Center photo-card grid (already faith-anatomy, command-center.js:173), parent = celestial hub tiles; sidebar + tab-landing sections (`s-learn/s-life/s-me/s-growth`) deleted, their cards absorbed into CC groups.
- **One router:** `openDest(dest)` (superset of `ccOpenDest`/`fzOpenDest`) — hides the hub, mounts exactly one destination as a full takeover with a standard top bar, `scrollTo(0,0)`, records origin, pushes one history entry.
- **One back:** a single `← Back` pill component (top-left, same class everywhere) + Esc + popstate + swipe-right, always returning exactly one recorded level; hard-coded `showSection('s-hero')` backs (`#mobileHomeBack`, `flatnav-back`) removed.
- **Max 2 levels:** destination-internal navigation is lateral tabs only (Well tabs, prayer-hub tabs, `phSubNav`); topic-grids (`_TG_CONFIG`, `data-topic-grid`) become the destination's own first screen, never a third stacked layer; overlays (station sheets, media players) count as the second level and close before any cross-navigation (generalize the `lifeOpenTool` wrapper into the router).
- **No state bleed:** the router owns body scroll-lock, Zone-3-style collapse, audio stop, and parent-drill restore on every transition — features never reach around it (today's `parentDrillExit`/`stopAllAudio` hooks inside `showSection` become router middleware).

---

## AUDIT C — CONTENT GAPS + ENGAGEMENT

### 1. Content depth ranking (richest → thinnest)

| # | Section | Authored content | Evidence | Verdict |
|---|---------|-----------------|----------|---------|
| 1 | **Skills / Life-Skills Academy** | SK_DATA: 42 categories, 58 long-form HTML lessons + 402 quiz questions (~3,200 lines authored); SK_SPECS: 9 hand-authored spec modules (taxes, investing, car, cooking, budgeting, credit, college, diy, career), 52 lessons w/ viz+widgets | `app/js/skills.js:144` (SK_DATA start), `app/js/data/lesson-specs.js:13-1768` | Deepest by an order of magnitude |
| 2 | **Sports** | SPORT_DATA: 16 sports, each with authored positions/drills/mental-game/fuel/recruiting/legend blocks (~2,300 lines) + per-sport SVG hero motifs | `app/js/sports.js:~500-2800` (16 `"mental"` blocks), `app/js/sports-fx.js:25-45` | Rich reference content; but see juice gap |
| 3 | **Finance/Money** | 8 teen money lessons (7 in file + 1 static taxes w/ calculator), 8 money milestones, allowance engine, purchase requests | `app/js/data/money-lessons.js:1-262`, `app/js/finance.js:2420-2430` | Solid |
| 4 | **My Climb** | 13 authored stations, 4 chapters, North Star horizon, 12-quest pool | `app/js/data/life-stations-data.js:22-495`, `app/js/life-path.js` | Good but one-shot (see quests bug) |
| 5 | **Health** | 6 body-literacy topics, 8 badges, water/sleep/workout tools | `app/js/body-literacy.js:55`, `app/js/health.js:157` | Moderate |
| 6 | **Habits** | HABIT_LIBRARY ~50 preset habits in 5 categories, 12 habit-science cards, stacks, badge tiers | `app/js/habits.js:1017,1159,69` | Moderate |
| 7 | **Goals** | CAREERS explorer 35 entries, 8 goal milestones, AI coach | `app/js/goals.js:1285-1287,319` | Engine-heavy, content-light |
| 8 | **Chores** | 5 chore packs (~40 chores); rest is PB/spin-ticket economy | `app/js/data/chore-packs.js:56-142` | Engine-rich, content-thin |
| 9 | **Journal** | 6 default quotes + category colors; pure CRUD otherwise | `app/js/skills.js:5153` (DEFAULT_QUOTES), `skills.js:5117` | Thin |
| 10 | **School** | ZERO authored datasets — classes/GPA/assignments/study-timer/schedule are pure CRUD (1,113 lines, all forms); one "study tip" string in index.html | `app/js/school.js:100-133` | Thin |
| 11 | **Mood** | Zero content — log + 30-day grid + 3-card strip | `app/js/misc.js:515-600` | Thinnest tier |
| 12 | **Schedule/Calendar** | Zero content — blocks/events CRUD inside school.js | `app/js/school.js:595,751`, `app/index.html:4602` | Thinnest tier |

**Thinnest 3 — what a content addition could look like (types, not drafts):**
- **School:** a "how to study" micro-lesson set (spaced repetition, note methods, test-anxiety) reusing lesson-renderer.js; grade-goal calculator content ("what do I need on the final"); authored study-technique cards shown after a timer session ends (`school.js:129` already fires a toast there).
- **Mood:** an emotion-vocabulary dataset (name-it-to-tame-it cards, the main-side analog of `heart-check-data.js`'s 12 states — that file is faith-gated); per-mood coping actions; weekly mood-pattern insight strings.
- **Schedule:** time-blocking templates ("school-night", "game-day", "exam-week" packs, same pattern as chore-packs.js); authored time-management tips (some exist in SK_DATA `timemanage` — could be surfaced in-section).

### 2. Completion juice table

| Section | Completion action | Current feedback | Gap |
|---|---|---|---|
| **My Climb** | `lifeMarkStep` `life-path.js:483-512` | FULL: megaConfetti + screenFlash + sfx.perfect + haptics + 50 XP + toast + chapter beat | None — main-side gold standard |
| **Skills** | `finishSkillQuiz` pass `skills.js:4083,4120-4122`; practice sets `exercise-engine.js:184-191` | Big confetti + sfx.perfect + haptics + cert + XP (wrap `xp.js:316-324`) | None |
| **Chores** | verify path `chores.js:355-397`; XP on submit via wrap `xp.js:289-303` | PB toast + screenFlash + side/big confetti + streak banner + XP | Kid's *submit* moment itself is quieter than the parent-verify moment |
| **Habits** | `toggleHabitV2Today` `habits.js:176-192` | launchSideConfetti + XP juice toast (wrap `xp.js:276-283`) | No sfx/haptics (skills/climb have them) |
| **Goals** | `completeGoal` `goals.js:1168-1200`; milestones `goals.js:425` | PB + toast + sideConfetti + completion card + XP (wrap `xp.js:305-314`) | No sfx/haptics; `toggleGoal` path `goals.js:795` is toast-only |
| **Health** | `logWorkout`/`logSleep` (XP wrap `xp.js:326-341`); badges `health.js:227-233`; water goal `health.js:1042` | XP toast; badge = big confetti + toast; water = side confetti | No sfx/haptics anywhere in health.js |
| **Finance** | `addTx` `finance.js:192-198`; savings-goal cross `finance.js:442-450`; money milestones `finance.js:2449-2455` | Toast; toast+sideConfetti; screenFlash+confetti+toast | **No XP** — money is not in xp.js watchers; no sfx/haptics |
| **Money lessons** | `_learnComplete` `finance.js:1829-1855` | Toast + milestone check | No confetti/sfx on the lesson itself; no next-lesson CTA |
| **School** | `toggleAsg` `school.js:101` | **COMPLETELY SILENT** — save+render, no toast/XP/sfx/confetti | Worst gap in the app. Not wrapped in xp.js either |
| **School** | `logStudy` timer end `school.js:129-132` | Toast only | No XP/sfx |
| **Sports** | `addSeasonStat` `sports.js:3316-3331`, `saveReflection` `sports.js:3236-3245`, `addMilestone` `sports.js:3132-3144` | **COMPLETELY SILENT** — not even a toast; modal closes/refreshes | Zero feedback, zero XP for the whole section |
| **Mood** | `logMood` `misc.js:515-528`; `logHealthMood` `health.js:1357-1375` | Toast only (+ milestone check on health path) | No XP/sfx |
| **Journal** | `saveJournal` `skills.js:5117` | +2 PB + toast | No XP/sfx/confetti |

sfx.js/haptics.js are consumed only by: skills quiz, exercise-engine, lesson-renderer checks, life-path, walk-path/faith. School, sports, mood, journal, finance, health never touch them.

### 3. Daily return reason

**Has a daily mechanic:** Daily Briefing (`D.dailyThree`, daily-briefing.js:18-20); Habits (per-day + streaks, habits.js:176,204-222); Chores (daily freq + streak banners 3/7/14/30/50/100, chores.js:385-397); XP layer (daily goal ring + flame streak + Sabbath bridge, xp.js:60-140); Mood (one/day + streak card, misc.js:519,543); Health (daily check-in, water, sleep; mood7 streak, health.js:187,1042); My Climb (visit streak + weekly quests, life-path.js:118-126,131); Practice sets (first-clear-per-day XP, xp.js:104-110).

**Zero reason to return daily:** School (due dates only), Sports (season-grain), Goals (no recurrence), Finance (ad hoc), Journal (no prompt/streak), Skills lessons (beyond 3 practice sets), Schedule (static CRUD). Note: streaks.js is faith-only — no main-side cloud streak.

### 4. Dead ends

1. **BROKEN: 9 of 12 My Climb weekly quests can never progress.** `LIFE_QUESTS_POOL` metrics habit/chore/school/health/goal/skill/money/journal/domains (`data/life-stations-data.js:477-489`) are never bumped — `lifeQuestBump` is only called with 'visit', 'reflect', 'station' (`life-path.js:126,460,493`). No bridge in `xp.js`; `walk-quest-hooks.js` wires only the FAITH walk. Weeks whose 3 rotated quests draw from the 9 unwired metrics show quests stuck at 0/target all week.
2. School: completing an assignment silently re-sorts the list; no all-done state, no next action (`school.js:101`).
3. Sports: reflection saved → modal closes to the same card, no confirmation or follow-up (`sports.js:3236-3245`); season stat saved → editor just re-renders (`sports.js:3316-3331`).
4. Money lesson marked complete → button flips to "✓ Marked complete", no "next lesson" route (`finance.js:1794,1829-1855`).
5. School study log / classes empty states — text-only, no tappable CTA (`school.js:64,133`).
6. Journal empty state — "No entries yet — start writing!" plain text, no button (`skills.js:5128`).
7. My Climb all-stations-done → toast only (`life-path.js:509-512`) — intentional (North Star), but no post-completion loop besides the (mostly broken) quests.

### 5. Built but content-starved

- **exercise-engine.js** — 405-line, 5-format interactive engine with full juice… seeded with exactly **3 sets**: d1-money, d1-cooking, d1-safety (`exercise-engine.js:44`). Highest-leverage content hole on the main side.
- **lesson-renderer.js** — 1,464-line block engine but only 9 of 42 skill categories have hand-authored SK_SPECS; the other 33 run through flat `fromLegacy()` auto-conversion.
- **Chore packs** — parent bulk-apply UI backed by only 5 packs; months/ageRange metadata fields exist but are unused (`chore-packs.js:26-30`).
- **LIFE_QUESTS_POOL** — 12 authored quests, 9 mechanically dead.
- **sports-fx.js** — per-sport hero art for 16 sports wrapping a section whose user actions give zero feedback and zero XP.

---

## AUDIT D — BUG HUNT (static, read-only)

### Category 1 — Load/Nav errors

1. **HIGH | app/js/faith.js:3860 | `academyMarkLesson()` called, never defined.** `openBFLesson()` emits `onclick="academyMarkLesson('${type}',${idx})"`; only `academyMarkLessonNew` (faith.js:7633) exists. Kid opens a Bible Survey lesson, taps "✅ Mark Lesson Complete +5 XP" → ReferenceError; no completion recorded, no XP. **[VERIFIED]**
2. **HIGH | app/js/parent.js:4653–4762 | Quiz-taking modal DOM doesn't exist.** `#quizModal`, `#qmTitle`, `#qmQuestionArea` appear nowhere in index.html or any JS template; `openPendingQuiz()` dereferences them unguarded (parent.js:4663-4760). Parent sends a quiz → child taps the `#quizNotification` banner → TypeError. Quiz can never be taken; the notification nags forever. **[VERIFIED — grep: only parent.js:4668/4758 reference quizModal]**
3. **HIGH | index.html:1764–1772 (marketing homepage) | FAQ accordion calls `tFaq(this)`, defined only in guarantee.html:216.** All 9 FAQ answers (including billing-trust ones) can never expand on the public conversion page. **[VERIFIED]**
4. **MED | app/js/body-literacy.js | Never loaded.** No `<script>` tag (index.html:22611–22909), no `#ht-body` pane, no Body tab (index.html:4692–4704). health.js:137 typeof-guards it → ~270 lines of shipped feature silently never run.
5. **MED | app/js/parent.js:715–740 | Behavior log has no add path.** `addBehaviorLog()` zero callers; inputs `#behType`/`#behCat`/`#behNote` exist in no DOM. Character component of Life Score (parent.js:300–301, 356–357) and incentive types `beh_positive`/`beh_no_neg` (parent.js:649–650) permanently unachievable.
6. **LOW | app/js/ui.js:251–254 | `saveName()` dead + would crash.** Also `addChore()` (chores.js:163–179), `addReward()` (chores.js:421–431) reference nonexistent ids, no callers. Legacy allowance writers (parent.js:975–1017) documented-dead.
7. **LOW | ~150 orphaned getElementById targets** (legacy `scr*`, `hero*`, `fh*`, `forgotPin*`, `profileMigrationModal` families) — null-guarded no-ops; cleanup fodder.
8. Load order: clean. Every `<script src>` file exists (only body-literacy.js unreferenced).

### Category 2 — Broken tap targets

9. **HIGH | app/index.html:6167–6169 | Bio export buttons call nonexistent functions.** `exportBioPDF()`, `previewBioFullscreen()`, `downloadBioPage()` — zero definitions repo-wide. **[VERIFIED for exportBioPDF]**
10. **HIGH | app/index.html:6689–6731 vs app/js/misc.js:1306+ | Typing Test `tt-*` block dead.** HTML at 6689/6731 calls `ttStart()` etc. which don't exist; implementation is `typingStart/typingOnInput`. **[VERIFIED — NUANCE: a second, correctly wired `typing*` block exists at index.html:6799 (`typingStartBtn` → `typingStart()`), so this is duplicate markup where one copy is dead, not a fully dead feature.]**
11. Nested `<button>`-in-`<button>`: none found. `href="#"` with no handler: none found.

### Category 3 — Light-mode breakage (main-app surfaces)

Root cause: the inline-style patch system (app/css/app.css:2199–2289, 9542–9551) covers inline `color:rgba(255,255,255,.3/.45/.5/.7/.8)` and `#fff`, but has **no patch** for `.25/.35/.4/.55/.6`, `#e2e8f0`, `#cbd5e1`, `#f1f5f9`, `#fde68a`. One scoped patch-block extension fixes all five findings.

12. **HIGH | app/js/misc.js:1344 | Typing Test passage invisible in light mode** (`rgba(255,255,255,.35)` untyped chars).
13. **HIGH | app/js/init.js:1925–1926 | Home hero status pills unreadable in light** (`#e2e8f0`/`#fde68a` pills into `#heroHeadlinePills`).
14. **MED-HIGH | app/js/skills.js:4699,4710,4716,4724 | Achievement certificate partially blank in light** — incl. Print/PDF/share-image output (skills.js:4685–4687).
15. **MED | app/js/goals.js:934 | Milestone delete ✕ invisible in light** (`rgba(255,255,255,.25)` on `.gv-goal-card`).
16. **MED | app/index.html:23415,23417 | Onboarding step 1 mostly blank in light** — inline `#f1f5f9` wordmark + `.55)` subtitle.

### Category 4 — Orphaned features

17. **LOW | app/js/traits.js:334 | `openGrowthProfile()` is a stub** — "See all 7 traits →" fires `showToast('Full growth profile arrives in Session 5')`.
18. **INFO | app/js/faith-videos.js:219 | `getVideosForPlacement` zero external callers.**
19. Otherwise clean: all 36 `s-*` sections routed; all 11 overlays wired.

### Category 5 — Age-bracket allowlist vs tiles

Allowlist: `_AGE_BRACKET_ALLOWLISTS` (init.js:445–449) — 12_14: {chores, goals, mood, reading, scripture, rewards, flashcards}; 15_17: + {school, health, finance, driving, skills}; 18_22: null (all). Enforced by `applyAgeBracketSections` (init.js:520–532) over `ALL_SECTIONS` (ui.js:634–641); tiles filter via `_ccSectionVisible` (command-center.js:141–153).

20. **MED | ui.js:634–641 | `habits` missing from `ALL_SECTIONS`** → allowlist can never hide it; HABITS tile shows for 12_14/15_17 despite being on neither allowlist.
21. **MED | data.js:11 + ui.js:118–214 | DEF `mode:'high'` is not a valid `STAGE_CONFIG` key** (keys: middle/fresh/mid_hs/senior/college/adult). Every lookup falls back to `mid_hs`; `setMode()` (ui.js:261) has zero callers → **stage frozen at mid_hs for all users**; per-stage differentiation is dead code.
22. **MED | ui.js:157 | Bio Page unreachable for everyone** — mid_hs stage list excludes `s-bio`; even 18_22 never sees the BIO PAGE tile (command-center.js:209). Compounds finding 9.
23. **LOW | ui.js:121 vs init.js:446 | Latent:** `STAGE_CONFIG.middle` excludes `s-rewards`/`s-scripture` which the 12_14 allowlist grants (latent while mode is frozen).
24. **LOW | init.js:541, command-center.js:145, sync.js:251 | `s-cbt` force-shown for every bracket** — contradicts the parent-facing allowlist contract.
25. **LOW | command-center.js:325–331 | My Faith tile ignores `D.sections.scripture===0`** — parent toggling The Well off still leaves the gold doorway on the child home.
26. **LOW | sync.js:247 / init.js:538 | FORCE key `'christianLiving'` never matches** (real key `christian-living`) — no-op entry.

### Category 6 — Persistence bugs

Semantics: `loadData()` (sync.js:229) restores **only DEF keys**; `cloudLoad()` (sync.js:632–633) restores non-DEF too. Amplifier: one offline boot strips non-DEF fields → next save + cloudSync upserts the stripped blob over the cloud row → permanent loss even for online users.

27. **HIGH | app/index.html:17378,17542–17549 | `D.flashcardProgress` / `D.flashcardHistory` not in DEF** — flashcard stats destroyed by one offline reload. **[VERIFIED — 0 hits in data.js]**
28. **MED-HIGH | init.js:2442–2443 / init.js:632 | `D.settings.faithMode` not in DEF** — faith-mode opt-out reverts after offline reload (DEF mirror `D.faithMode` exists but init.js:632 doesn't read it).
29. **MED | auth.js:831–835, email.js:139 / parent.js:1751–1841 | `D.pinMigration` not in DEF** — PIN-migration banner resurrects.
30. **MED | faith.js:541–542 | `D.donationPromptDismissed` not in DEF** — dismissed donation ask returns.
31. **MED-LOW | chores.js:45–65 | `D.rewardsLegacyMigrated` not in DEF** — migration re-runs; deleted store items resurrect (name-only dedup).
32. **LOW-MED | parent.js:6527–6528 | `D._weeklyReports` not in DEF.** Also LOW: `D.age` (init.js:2160), `D.onboardingCompletedAt` (init.js:2290), `D.dailyReminderOn` (init.js:2445 — zero readers), `D.wellLastTab` (faith.js:757), `D._navGroups` (ui.js:1856+), `D._shelfCelebrated` (faith.js:13347). INFO: `D.progressEmailPref` legacy mirror.
33. **MED | init.js:10–13 + faith.js:554/591/621/654 | `_ylccUserKey` adds no `ylcc_` prefix → `daily_ai_dev_<date>_<uid>` mints a new unprefixed localStorage key EVERY DAY,** never pruned, survives the owner-guard sweep (sync.js:41–44) — unbounded growth.
34. **LOW-MED | faith.js:12415,13263,13413 | more unprefixed `_ylccUserKey` keys** — note content survives account switch on shared devices (privacy residue).
35. **LOW-MED | faith.js:5042,5079 | `ylcc_prayed_<requestId>` keyed by request id only, no uid** — sibling profiles share "I prayed" state. Same class: `ylcc_med_last`/`ylcc_med_history`, `ylcc_hlp_hint_seen`.

### Category 7 — Swallowed errors

36. **HIGH | sync.js:274 + 397 + 416–418 | Cloud-sync failure invisible to signed-in users.** `setSyncSt('local')` coerced to `'cloud'` whenever `_supaUser` exists; a permanently failing upsert shows "☁ Cloud Saved" forever — silent total-data-loss exposure on device loss.
37. **MED | sync.js:111 | `save()`'s `localStorage.setItem` unguarded** — quota throw aborts before the cloudSync debounce is scheduled; neither local nor cloud persists; callers' empty catches hide it.
38. **MED | sync.js:706 + init.js:401–402 | cloudLoad failure → local-over-cloud stomp path** — any exception returns false; init runs `loadData(); setTimeout(cloudSync,1500)` → stale local blind-upserted with no stomp-guard baseline.
39. **MED | sync.js:225–259 | corrupt `lifeos_v2` silently falls through to ancient legacy keys** (`lifeos_p1`, `lifeos_v1`, `dominic_v1`, `levelup_v3`) — user boots into years-old data.
40. **LOW-MED | sync.js:640,682,687 | `saveProfiles()` / `_profileData` build swallowed inside cloudLoad** — multi-profile persistence failures invisible. (Repo-wide: ~400 empty catches; faith.js alone 125.)

### 5 most urgent (per Audit D)

1. #2 — Parent-quiz flow dead-ends on a nonexistent modal.
2. #36 — "Cloud Saved" shown even when cloud sync permanently fails.
3. #27/#28 — DEF-membership data loss (flashcards, faith-mode opt-out).
4. #3 — Marketing homepage FAQ completely dead.
5. #1 — Faith Academy "Mark Lesson Complete" ReferenceError.

---

## Verification addendum (main session, 2026-07-09)

Spot-verified by direct grep before reporting:
- `academyMarkLesson` — call at faith.js:3860, zero definitions. CONFIRMED.
- `#quizModal` — referenced only at parent.js:4668/4758; no DOM anywhere. CONFIRMED.
- `tFaq` — called 9× in marketing index.html:1764–1772; defined only in guarantee.html:216. CONFIRMED.
- `exportBioPDF` — called at app/index.html:6167; zero definitions. CONFIRMED.
- Typing test — `tt-*` block (app/index.html:6689,6731) dead; second wired `typing*` block at 6799 works. NUANCED (duplicate markup, one copy dead).
- `flashcardProgress`/`flashcardHistory` — zero hits in data.js DEF. CONFIRMED.

## Owner decision points (carried into the build-plan approval)

1. **Canonical life cyan:** `#22d3ee` (current CC/Climb signature, 61 hits) vs `--brand-primary #38bdf8` (skill token).
2. **Gold on non-faith child surfaces:** bless a narrow "brass = XP/rewards" register (normalized to `#fbbf24`) vs full re-cut to cyan. Affects XP ring, streak card, Daily Briefing accents, Parent Bucks strips, `.cc-eyebrow` (`#f5b431`).
3. **Indigo in life chrome** (finance `--mz-indigo`, skills theme presets): sweep out per skill rule (recommended) or grant exception.
4. **Stage system frozen at mid_hs** (DEF `mode:'high'` invalid): repair the stage axis or formally retire it in favor of age brackets.
5. **Faith-lens chip color in finance lessons:** teal `#14b8a6` per doc §1 vs gold per the newer faith-gold register.
6. **(Open from faith sweep)** P&P browse grid: all-gold per "no rainbow" ruling (as shipped) vs 7 distinct warm-family hues per UX reviewer.
