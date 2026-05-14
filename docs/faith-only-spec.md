# Phase 6 — Faith-Only Path Spec

## Context

Phase 6 introduces an **all-ages free path** (working name: `faith_only`) parallel to the existing paid full-app subscription. It is Stripe-free at the gate (no checkout to enter) but accepts optional donations via Stripe. It expands the faith surface beyond what `faith_free` already gates: a deeper Christian Life Guide, group Bible studies, youth-group curriculum, family faith modules, and a Life Skills × Faith crosswalk.

This spec is structured to mirror `docs/F1-spec.md`: a Context / Goals / Scope frame, with an Open Questions section at the end. Each implementation chunk is intended to ship independently with its own discovery → plan → approval → implement → test cycle.

> **Naming note (resolved 2026-05-06).** The database tier value stays `faith_free`. Phase 6 expands its allow-list rather than introducing a new value. User-facing labels in UI copy are "Faith path" or "Faith Community" — never "faith_free" directly. The internal `window._faithFree` flag and `plan_status='faith_free'` checks remain unchanged from F0.

## Goals

1. Make a free, donation-supported path the credible default for ministries, families, and youth groups.
2. Ship enough faith content depth at launch to be defensible against YouVersion / Hallow / RightNow Media (see `docs/competitor-faith-landscape.md` once research is unblocked).
3. Reuse the existing Faith hub, Christian Life Guide, Worship Playlist, and Bible & Faith infrastructure — do not fork the codebase.
4. Surface the Life Skills × Faith integration as the unique selling point: faith-formed practical living that no pure-faith app offers.

## Scope (in)

1. Registration flow with no Stripe subscription gate; optional donation accepted via Stripe.
2. Age-tier onboarding (Kids 6–11, Youth 12–17, Adult 18+, Family/Group).
3. Terms & Conditions delta — strip subscription clauses, add donation language.
4. Christian Life Guide expansion — 12 new entries (24 total).
5. Group Bible Studies module (4–6 session arcs).
6. Youth Group curriculum module (4-session themed units, ages 12–17).
7. Family Faith modules (mixed-age table activities).
8. Life Skills × Faith cross-reference ("Through a Faith Lens" companion entries).
9. Top-right notification component shared across faith-only and full app.
10. Database changes (column on `profiles`, donation tracking).

## Scope (out — deferred or already done)

- Faith-themed compact hero variant — defined in F1-spec.md, ships there.
- Worship Playlist port — already shipped (F1.0).
- Sidebar IA expansion — already shipped (F1.2).
- Group/leader admin tools (creating private group accounts, leader rosters, attendance tracking) — propose as Phase 6.x follow-up.
- Mobile push notifications — defer; on-page bell only at launch.
- Internationalization — English only at launch.

---

## 1. Registration flow

### Goal

A free, sub-60-second sign-up that produces a working account with no Stripe customer record and no plan_status that can be clobbered by webhooks.

### Flow

1. **Entry point** — landing page CTA "Free Faith Path — No subscription" → `/register-faith.html` (new) or a faith-aware variant of the existing `/register.html`.
2. **Form fields** — email, password, age tier (4-button picker), display name, role (self / parent / group leader). Single screen.
3. **Submit** — calls Supabase `signUp`, then a server-side endpoint (`api/faith-register.js`) that:
   - Inserts `profiles` row with `plan_status='faith_free'` and `faith_only=true` (new boolean — see §10).
   - Stores `age_tier` and `account_role`.
   - **Never** calls `stripe.customers.create()`. **Never** writes `stripe_customer_id`. (Architectural defense from `F0-followups.md`.)
4. **Verification** — Brevo transactional email, single-click verify (`activate.html` already supports this).
5. **First app load** — runs onboarding (§2).

### Donation flow (separate from registration)

Donation is **always optional, never gating, never on the registration screen**. Donation prompts appear in three pre-defined surfaces:

- A persistent "Support this ministry" link in the footer / settings.
- A soft post-onboarding card on Day 7 streak ("Enjoying YourLife CC? Help keep it free.").
- A donor-recognition card in the top-right notification bell (see §9, mode 3) when there's an active matching campaign.

### Donation disclaimer — UI requirement (locked in 2026-05-06)

**Every donation surface must display this exact line, visible without a click:**

> Donations to Kingdom Creatives LLC are not tax-deductible.

This is a **hard UI requirement, not a copywriting suggestion**. It applies to:

- The footer / settings "Support this ministry" link target.
- The Day 7 streak donation card.
- The notification-bell donor-recognition card (mode 3).
- The Stripe Embedded Payment Element wrapper — visible above or beside the amount tier selector, never behind a tooltip or "learn more" expander.
- Any future donation CTA — modal, email body, sponsor highlight, partner-page handoff.

The disclaimer text is a fixed string and not subject to runtime translation by the Google Translate widget; localized versions must use vetted translations.

**Source basis:** `docs/competitor-faith-landscape.md` (donation-pattern section) found that Bible Project and YouVersion lean explicitly on 501(c)(3) framing in donation copy ("tax-deductible gift", "to a 501(c)(3) ministry"). Kingdom Creatives LLC is **not** a registered 501(c)(3) (confirmed 2026-05-06; see §3 T&C delta). Affirmatively disclosing non-deductibility at the surface — not just in T&C — protects against donor expectation drift and matches state-by-state donation-solicitation expectations.

### Donation model — locked in (2026-05-06)

**Embedded Payment Element with one-time + recurring on the same screen.**

- One-time covers casual donors (the majority); recurring covers committed supporters and is sticky for ongoing sustainability.
- Embedded keeps the user inside YourLife CC's visual language — central to the design-system upgrade in `docs/design-system.md` (faith CTAs use the indigo `--accent`).
- **A dedicated Stripe Product** named `donation` is created with metadata `purpose='donation'`. The Stripe webhook handler checks `metadata.purpose==='donation'` and **never** mutates `plan_status` on donation events. Belt-and-suspenders defense from `F0-followups.md`.
- **Donation amounts: $5 / $10 / $25 / $50 / custom.** No anchored ask copy ("$10 keeps it free for one user this year" or similar) — pure tier selector.
- Both one-time and "every month" toggles on the same screen.
- Recurring donations route through Stripe Billing with Customer Portal enabled for self-service cancellation. The Customer Portal is configured to **only** show donation subscriptions, never the full-app plan. Two separate Stripe Products keep this clean.

### Stripe webhook safety

This is restated from `F0-followups.md` because Phase 6 makes it production-blocking:

> The webhook handler MUST guard:
> 1. `IF existing plan_status='faith_free' AND faith_only=true THEN do not update plan_status, regardless of incoming event.`
> 2. `IF event.metadata.purpose='donation' THEN do not update plan_status.`
> 3. Donation events update `donations` table only (see §10).

### Files affected

- `register.html` (or new `register-faith.html`) — UI change.
- `api/faith-register.js` — new endpoint, CommonJS like the rest of `/api/`.
- `api/donate-intent.js` — new endpoint to create Stripe PaymentIntent / Subscription.
- `api/stripe-webhook.js` — guard logic.
- `app/js/auth.js` — minor; `_faithFree` flag already exists.

---

## 2. Age tiers and onboarding

### The four tiers

Onboarding is a single screen with four large buttons. The choice writes `D.faithTier` and `profiles.age_tier`. It is changeable later in Settings.

| Tier | Range | Default surface |
|------|-------|-----------------|
| **Kids** | 6–11 | Bible App-for-Kids-style: illustrated stories, parent-required setup, large tap targets, no journaling, no chat features |
| **Youth** | 12–17 | Lighter copy, devotionals tagged "youth", challenges and streaks emphasized, peer-safe (no DM features), Mental Health & Faith front-and-center |
| **Adult** | 18+ | Full faith surface — Bible reader, Christian Life Guide, devotionals, plans, memory verses, sermon notes, Faith Academy, Bible Lands, Story Mode |
| **Family / Group** | mixed | Adult surface + Family Faith modules + Group Bible Study modules + leader-mode toggles for content sharing and progress visibility |

### What each tier sees

**Kids 6–11**
- Illustrated home: today's story, prayer prompt, parent button.
- Bible Stories (Story Mode F4-G already shipped — repurpose it).
- "Tell a parent you're done" button instead of points.
- No journaling free-text entry; pre-set prayer prompts only.
- Safety: no leaderboards, no public-facing fields, no email collection on the kid record (parent's email is the account).

**Youth 12–17**
- Home: today's verse, devotional CTA, streak, one Worship song of the day, journal prompt.
- Devotionals filtered to a "youth" tag.
- Christian Life Guide entries with `audience:'youth'` surfaced first.
- Mental Health & Faith pinned in resources.
- "Through a Faith Lens" Life Skills companions visible (this is the bridge to the paid app).
- No financial Stripe surface anywhere in the UI.

**Adult 18+**
- Full faith surface, no kid/youth simplifications.
- Group/Family modules visible but not pinned.

**Family / Group**
- Adult surface + a "Today's Family Activity" hero card.
- Group Bible Study list pinned in sidebar.
- Leader Mode toggle (in Settings) — when on, the user can mark progress on behalf of a group and see a roster (see §5 / §6 for what the leader-mode roster requires; some pieces deferred to Phase 6.x).

### Onboarding screens

Three screens total:

1. **Welcome** — "What's your role?" (4 tier buttons + 1-line description each).
2. **Personalize** — display name, optional church/group name, journey start date (defaults today).
3. **Permission** — notifications opt-in, **marketing-email opt-in (unchecked by default — transactional-only is the default)**, accessibility prefs (reduced motion, larger text), translate language fallback.

After this screen, the user lands on the Faith hero with their tier-specific home.

---

## 3. Terms & Conditions delta from full app

The existing T&C covers:
- Subscription billing, auto-renewal, cancellation
- Parent-of-teen consent for the child profile
- Refund and chargeback policy
- Limited-warranty / no-medical / no-legal-advice clauses
- Data retention, deletion, GDPR/CCPA rights
- Communication consent (Brevo transactional + marketing)

### Strip for faith-only

| Clause | Action |
|--------|--------|
| Subscription billing, auto-renewal, cancellation | Remove for faith-only — replace with one-line "This account has no subscription. You may delete it any time in Settings." |
| Parent-of-teen consent for child profile | **Keep but conditional** — only triggers if Family tier is chosen and a child sub-profile is created. Defaults off. |
| Refund and chargeback policy | Remove for faith-only — donations are non-refundable per donor agreement; replace with a one-paragraph donation refund clause (see below). |
| Communication consent (marketing) | Tighten — faith-only users default to **transactional only**. Marketing requires explicit opt-in toggle in Settings, opt-in unchecked. |

### Add for faith-only

| Clause | Self-edit or lawyer? |
|--------|----------------------|
| **Donation language** — "Donations to Kingdom Creatives LLC are not tax-deductible. Kingdom Creatives LLC is not a registered 501(c)(3) charitable organization. Donations are voluntary, non-refundable, and support general operations of YourLife CC." | **Lawyer review required.** 501(c)(3) status confirmed not-registered as of 2026-05-06; the explicit non-deductibility statement is mandatory. Lawyer should verify the exact wording against state-by-state donation-solicitation rules. Revisiting nonprofit registration is a future business question, not a launch blocker. |
| **Doctrinal statement** — "YourLife CC content is broadly Christian and non-denominational, centered on shared historic Christian foundations. The audience includes Catholic, Orthodox, and Protestant families. Linked third-party resources reflect their own publishers." | **Self-edit.** Content-positioning statement; the broadly-Christian framing is intentional to keep the audience inclusive across traditions. |
| **Group / leader use** — "Leaders using YourLife CC with minors are responsible for compliance with their local ministry's child-protection policies. We do not provide background-check infrastructure." | **Lawyer review required.** Liability disclaimer language for ministry use is jurisdiction-specific. |
| **Donation processor** — "All donations are processed by Stripe, Inc. Your card information is never stored on YourLife CC servers. See Stripe's privacy policy at stripe.com/privacy." | **Self-edit** — this is factual. |
| **Receipts** — "Stripe issues an automatic email receipt for each donation. Year-end giving statements are available on request to info@kingdom-creatives.com." | **Self-edit**, but the year-end statement promise must be deliverable — see §10 donations table. |

### Items requiring lawyer review

Summary list of T&C areas that should not ship without legal review:

1. **Donation non-deductibility wording** — entity status confirmed: NOT a 501(c)(3). The mandatory non-deductibility statement is drafted above; lawyer should verify the exact wording against state-by-state donation-solicitation rules.
2. **Group / leader liability disclaimer for ministry-with-minors use** — **HIGH PRIORITY launch blocker.** Youth and Group features (§6, §5 mixed/youth arcs) must not ship without lawyer-reviewed waivers and disclaimers in place. Treat as gating for Phase 6.6 and 6.7 specifically.
3. **Parent-of-teen consent language** — current language is fine; just verify the conditional logic for the Phase 6 family tier doesn't break the existing flow.
4. **Kids 6–11 COPPA compliance** — confirmed as parent-managed sub-profile only (kids never register directly, no PII entered by the child, mirrors the existing parent-of-teen strictness). Lawyer should confirm the implementation matches COPPA's verifiable-parental-consent requirements.

### Items safe to self-edit

1. Strip the subscription clauses.
2. Add the donation processor / Stripe paragraph.
3. Add the doctrinal-orientation paragraph.
4. Tighten marketing-consent default.

---

## 4. Christian Life Guide expansion

### Existing entries (12, in `app/js/faith-resources.js` + DOM in `app/index.html` ~line 5990–6510)

Categories: Spiritual Growth, Family & Relationships, Crisis Support, Life Challenges, Ministry Tools.

| # | Title | Category |
|---|-------|----------|
| 1 | Prayer Guide for Beginners | Spiritual Growth |
| 2 | Understanding Baptism | Spiritual Growth |
| 3 | Biblical Giving & Stewardship | Spiritual Growth |
| 4 | Marriage Enrichment Guide | Family & Relationships |
| 5 | Suicide Prevention & Hope | Crisis Support |
| 6 | Mental Health & Faith | Life Challenges |
| 7 | Children's Ministry Activities | Ministry Tools |
| 8 | Parenting with Faith | Family & Relationships |
| 9 | Grief & Loss Support | Crisis Support |
| 10 | Small Group Leader Guide | Ministry Tools |
| 11 | Addiction Recovery Resources | Life Challenges |
| 12 | How to Study the Bible | Spiritual Growth |

### Proposed 12 new entries

Same data shape (data-category + modal). Categories balanced: 3 Spiritual Growth, 2 Family & Relationships, 2 Crisis Support, 2 Life Challenges, 2 Ministry Tools, 1 new "Apologetics & Questions" tab.

| # | Title | Category | One-line outline |
|---|-------|----------|------------------|
| 13 | Hearing God's Voice | Spiritual Growth | How discernment works in everyday life — Scripture, conscience, counsel, and circumstance, with a 7-step decision framework |
| 14 | Fasting Without Legalism | Spiritual Growth | Biblical purpose of fasting, three formats (24-hour, partial, media), and how to fast as a beginner without injuring health |
| 15 | The Holy Spirit in Everyday Life | Spiritual Growth | Who the Holy Spirit is, evidence of His work, common cessationist/continuationist tensions explained without taking sides |
| 16 | Forgiveness When It's Hard | Family & Relationships | Difference between forgiveness, reconciliation, and trust; what to do when the other party isn't sorry; trauma-informed boundaries |
| 17 | Singleness, Dating & Boundaries | Family & Relationships | A healthy framework for single adults — purpose in singleness, biblical dating norms, sexual integrity, breakup recovery |
| 18 | Church Hurt & Reentry | Crisis Support | Acknowledging real harm done in the name of Christ, distinguishing church from Christ, slow paths back to community |
| 19 | Doubt & Deconstruction | Crisis Support | Honest engagement with doubt — common deconstruction triggers, when to walk through vs. walk away, recommended reading |
| 20 | Anxiety & the Bible | Life Challenges | What Scripture does (and does not) promise about anxiety; faith-and-therapy is not faith-or-therapy |
| 21 | Money Stress & Trust | Life Challenges | Practical theology of provision when bills outpace income; budgeting through a stewardship lens (links to Life Skills) |
| 22 | Leading a Bible Study Without Being a Pastor | Ministry Tools | Facilitation skills, how to handle tangents, when to defer to a pastor, the difference between teaching and facilitating |
| 23 | Discipling Your Kids Without Performing | Ministry Tools | Replaces the Christian-parent guilt cycle with consistent low-stakes habits — bedtime, table, drive, day off |
| 24 | "Why Do Bad Things Happen?" — A Field Guide | Apologetics & Questions | Six honest answers to the problem of evil for someone who's hurting (not for a debate stage); gentle pointers to deeper reading |

A 13th tile placeholder (`Apologetics & Questions`) is added to the filter row to host #24 and future apologetics entries.

### Implementation notes

- Entries follow the existing modal structure (icon, category badge, title, multi-section body, print/share actions). No new component required.
- Each modal body should be ~600–1,200 words. Avoid drafting these in the spec; that's the `content-author-faith` agent's job, output to `/content/faith-drafts/` first, integrated to `app/index.html` after review.
- Tag every entry with `audience: ['youth'|'adult'|'family'|'leader']` so age-tier filtering (§2) works without copy changes.

### Content velocity (post-launch cadence) — locked in 2026-05-06

**Minimum cadence: 1 new Christian Life Guide entry per month for the first 12 months post-launch.** Cadence is a launch discipline, not a stretch goal. The 24-entry library at the close of §4 is the launch volume; the 36-entry library twelve months later is the credibility threshold.

**Operationalization:** the `content-author-faith` agent runs in monthly batches against a backlog of candidate topics. Each batch produces one fully-drafted entry to `/content/faith-drafts/` for review. A miss in any month is a **Phase 6.5 success-criterion failure**, not a slip — investigate root cause before the next month's draft.

**Source basis:** `docs/competitor-faith-landscape.md` (synthesis: content-depth and update-cadence) shows that update cadence is the differentiator between an active library (YouVersion plans, Hallow daily/seasonal drops, Bible Project releases) and a dormant one. A library that ships 24 entries at launch and stays at 24 entries six months later reads as abandoned regardless of initial volume. The 1-per-month floor is the smallest signal that the library is alive.

---

## 5. Group Bible Studies module

### Goal

A 4–6 session arc that a small-group leader can run with a group, with a clean per-session format. This is the "small group in a box" that competes with Foundations / Gospel Project at the smallest viable scale.

### Module structure

Each Group Bible Study is one **arc** of 4, 5, or 6 sessions. Each arc has:

- `id` (string), `title`, `subtitle`, `audience` (`adult` | `youth` | `mixed`), `length` (sessions), `theme` (gospel / formation / topical / book-walk).
- `cover_image_url` (single hero image).
- `intro_text` (~150 words: what this arc is, who it's for, what they'll do).
- `recommended_pace` (e.g., "weekly", "twice weekly").
- `sessions[]` — 4 to 6 entries.

### Per-session format

Each session is a single screen with these blocks, in order:

1. **Session title + verse anchor** (e.g., "Session 2 — When God Is Silent — Habakkuk 1:1–11").
2. **Open** (5–7 min) — an icebreaker question grounded in real life, not "what's your favorite color".
3. **Read** (5–10 min) — Scripture passage, with a 1-sentence framing of context.
4. **Discuss** (20–30 min) — 4–6 facilitator questions, sequenced from observation → interpretation → application. Each question has an "if the room goes quiet" bridge prompt for the leader.
5. **Apply** (5–10 min) — one tangible practice or commitment for the week.
6. **Pray** (5 min) — guided prayer prompt or silent reflection structure.
7. **Leader notes** — collapsed by default; opens to show common pitfalls, doctrinally-sensitive points, and an "if someone asks…" FAQ.

### Launch arcs — 3 at launch (locked in 2026-05-06)

Ship 3 arcs at launch, watch engagement, expand based on actual usage data. Quality over volume.

| Arc title | Sessions | Audience |
|-----------|----------|----------|
| Philippians: Joy Under Pressure | 4 | Adult |
| Identity in Christ (topical) | 5 | Youth |
| The Story of the Bible in 6 Acts (topical, gospel-walk) | 6 | Mixed |

These three cover the highest-usage shapes: a short epistle walk (Philippians), a youth-focused topical (Identity in Christ), and a Bible-overview arc that works as a first study for any group. The other recommended arcs (The Sermon on the Mount, Habakkuk, Ruth) move to a Phase 6.x backlog and ship in waves driven by engagement signals.

### Files / data shape

- New `app/js/data/group-studies.js` — array of arc objects with embedded sessions. Same convention as `data/memory-verses.js`, `data/biblical-sites.js`, etc.
- New section `s-group-studies` in `app/index.html` — list view + arc detail + session detail. Reuses existing card / modal patterns.
- Progress tracking: `D.groupStudyProgress = { [arcId]: { sessionsCompleted: [...], lastTouched: 'YYYY-MM-DD' } }`. Per-user; group-shared progress is deferred to Phase 6.x leader tools.

---

## 6. Youth Group curriculum module

### Goal

A 4-session themed unit that a youth pastor or volunteer can run with grades 7–12, accounting for both the 12-year-old and the 17-year-old being in the same room.

### Why 4 sessions

A month's worth of weekly meetings is the most reusable unit. Keeps the perceived cost of starting low. Lets a leader sample the platform without a 13-week commitment.

### Per-session format (different from §5 — youth-specific)

1. **Hook** (3 min) — a 30-second video, a meme prompt, a polarizing question. Designed for distracted phones in a youth room.
2. **Get into it** (5 min) — leader-led intro that frames why this matters for *their* week.
3. **Scripture** (10 min) — passage + 2–3 simple observation questions ("what did you notice?" not "what does the Greek say?").
4. **Real talk** (15–20 min) — facilitated discussion with branching questions for younger (12–14) and older (15–17) cohorts. Each question is tagged so the leader can see at a glance which to use.
5. **Take it with you** (5 min) — one challenge for the week. Posted to the group's chat or printed on a card.
6. **Close** (5 min) — short prayer, optional song link to the Worship Playlist.
7. **Leader sidebar** — student safety notes, cultural context, when to escalate to a parent or pastor (especially for crisis topics like §4 #18 Church Hurt or §4 #20 Anxiety).

### Launch units — 3 at launch / 12 sessions (locked in 2026-05-06)

Same expand-on-usage approach as §5: ship 3 units (12 sessions), learn from real usage, then scale.

| Unit title | Sessions | Notes |
|------------|----------|-------|
| Who Am I? — Identity in Christ | 4 | Lead unit; sets the tone |
| Anxiety, Pressure, and Peace | 4 | Pairs with §4 #20 — highest-need topic for the audience |
| How to Read the Bible (For Real) | 4 | Pairs with Christian Life Guide #12 — gateway practice for everything else |

Three launch units = 12 sessions of youth content. The other recommended units (Why Believe? / Friendships, Crushes, and Phones / Money, Work, and What Matters) move to a Phase 6.x backlog.

### Success metric — second-unit adoption (locked in 2026-05-06)

**Track the second-unit adoption rate: the percentage of group leaders who start a second unit after completing the first.**

- **Target: ≥ 40% within 6 months of Phase 6.7 launch.**
- **First-unit completion is not the primary metric.** Many leaders will finish a unit and never return; many more will dabble and never finish. The signal that the format is working is when a leader voluntarily picks up a second unit.
- **Below 25% at the 6-month mark triggers a format revisit** before any additional units ship. The problem at that point is more likely the unit shape than the unit count.
- Measured via `D.youthCurriculumProgress` events, aggregated weekly server-side; no PII collected at the user level.

**Source basis:** `docs/competitor-faith-landscape.md` (youth curriculum / Gospel Project section) found that Gospel Project ships at quarterly cadence (13 sessions per quarter) — a high-commitment format. YourLife CC's deliberately smaller 4-session unit is a low-commitment entry point, the right calibration for a leader who is sampling the platform. But a low-commitment entry is only worth shipping if a meaningful fraction of leaders return for a second unit; otherwise the format is a single-use marketing artifact, not a curriculum platform.

### Data shape

- `app/js/data/youth-curriculum.js` — array of unit objects with embedded sessions.
- Same `s-youth-curriculum` section pattern as §5.
- `audience` tag forces this module to be visible only to Youth, Family, and Group tiers.

---

## 7. Family Faith modules

### Goal

A short, mixed-age table activity a parent can run in 10–15 minutes — at dinner, on a drive, at bedtime. Designed for the parent who doesn't think they're spiritually qualified to disciple their kids and who has 7 minutes before everyone scatters.

### Per-module format

Each Family Faith module is **one** sit-down, not a series. Format:

1. **Name + tagline** (e.g., "Whose Voice? — A 10-minute table activity on hearing God").
2. **What you'll need** — usually nothing; sometimes a Bible, a piece of paper, a candle.
3. **Together** (3 min) — a question the youngest can answer ("What's one thing that made you laugh this week?").
4. **Read** (2 min) — a short verse or a 3–4 sentence summary of a story (use Story Mode F4-G content where it fits).
5. **Talk** (5 min) — three layered questions: one for the 6-year-old, one for the 12-year-old, one for the parent. Same theme.
6. **Bless** (1 min) — a one-sentence blessing the parent reads over each kid by name.
7. **Optional extension** — a card-game version, a drawing prompt, a song to sing or play.

### Launch modules (recommended minimum)

12 modules, themed in three quartets so a family can do "one a week for a season":

| Quartet | Modules |
|---------|---------|
| **Who God Is** | Whose Voice / God Sees Me / God Is Not Mad / God Made All of It |
| **Who We Are** | Made on Purpose / Friends and Forgiveness / Brave When It's Hard / Words That Build |
| **What We Do** | Saying Sorry / Helping Without Being Asked / Sharing the Hard Stuff / Sabbath = Slow Day |

### Data shape

- `app/js/data/family-faith.js` — array of module objects.
- Section `s-family-faith` follows the §5/§6 pattern.

---

## 8. Life Skills × Faith cross-reference — "Through a Faith Lens"

### Goal

This is the differentiator nothing else does. The full app has 41 Life Skills categories (`SK_CATS` in `app/js/skills.js`). For a tightly-curated subset, ship a companion entry that frames the same topic through Scripture and historic Christian practice.

### How it surfaces

- In the Life Skills section, each cross-referenced category gets a small "Through a Faith Lens" badge linking to the companion modal.
- In the Faith hub Christian Life Guide, the companion modals appear under a new tag `life-lens` and are filterable.
- Faith-only (Phase 6) users see the companion modals **without** access to the underlying Life Skills lessons — the companion is its own readable thing. Paid users get both.

### Proposed 12 companions (mapping to existing `SK_CATS` keys)

| # | Life Skills category (key) | Companion entry title | One-line outline |
|---|---------------------------|----------------------|------------------|
| 1 | Communication (`communication`) | Speaking Truth in Love | The Ephesians 4 ethic — when truth and gentleness aren't in conflict, and how to handle the hard conversation you've been avoiding |
| 2 | Relationships (`relationships`) | Confession, Forgiveness, Reconciliation | Three different things, often confused — when each is appropriate and when reconciliation is unsafe |
| 3 | Career & Work (`career`) | Vocation as Calling | Reformation-era theology of "your job is worship," recovered for an age that hates Mondays |
| 4 | Budgeting & Saving (`budgeting`) | Stewardship Beyond the Tithe | What stewardship looks like when 10% is the floor, not the ceiling — including for people who can't tithe right now |
| 5 | Stress & Resilience (`stress`) | Sabbath as Resistance | Why a weekly slow day is countercultural, what counts (and doesn't), and how to start when your life can't take a full day off yet |
| 6 | Time Management (`timemanage`) | Numbering Your Days | Psalm 90 applied — a yearly review framework rooted in finitude rather than productivity |
| 7 | Critical Thinking (`critical`) | Wisdom & Discernment | The Proverbs framework for decisions when the data is incomplete — counsel, prayer, gut, time |
| 8 | Public Speaking (`speaking`) | Bold but Humble | The apostle Paul's posture — strength of conviction without hostility; useful for arguments at work too |
| 9 | Social Media (`socialmedia`) | Image vs. Imago Dei | What the doctrine of being made in God's image means for a culture obsessed with image-management |
| 10 | Online Safety (`onlinesafety`) | Guarding the Heart | Proverbs 4:23 in the context of an attention economy — practical attention hygiene as a spiritual practice |
| 11 | Adulting 101 (`adulting`) | Growing Up in Christ | Maturity as a Christian concept — what it means, how it differs from "being an adult", what Hebrews 5–6 looks like in your 20s |
| 12 | Mental Health (`mental`) | Faith and Therapy Are Not Opposites | Standalone from existing #6 ("Mental Health & Faith") — a more focused take on the false dichotomy and how to find a counselor who respects both |

These companions tag-link to the relevant Life Skills lessons for paid users; faith-only users see the companion content alone.

### Data shape

- Companions live in `app/js/data/faith-lens.js`.
- Each has `id`, `title`, `outline`, `scripture_anchor`, `body_html`, `links_to_skill: 'skill-key'`, `audience: [...]`.

---

## 9. Top-right notification component

### Goal

A single shared component used across both faith-only and full app, replacing ad-hoc toasts and banners. Three modes; user can mute by category. This becomes the canonical surface for things that currently live as inline banners.

### Three modes

| Mode | Trigger | Visual cue | Examples |
|------|---------|-----------|----------|
| **Notifications** (personal) | App-driven on user activity | Cyan dot | "Day 7 streak unlocked", "New devotional ready", "Group study session 3 of 6 complete" |
| **Announcements** (system) | Admin-pushed (Supabase row) | Violet dot | "New Christian Life Guide entry: Doubt & Deconstruction", "App is briefly offline for maintenance" |
| **Sponsor / Ministry highlights** | Admin-pushed, time-windowed | Indigo dot (faith accent — see design-system.md §1) | "Matching gift this month — donations doubled to ServeRefugees" |

### Frequency limits — UI requirement (locked in 2026-05-06)

**Hard caps enforced in the bell badge logic, not just as copywriting guidance.**

| Mode | Cap |
|------|-----|
| Personal (notifications) | Max 1 per calendar day (00:00–23:59 user-local) |
| Announcements (system) | Max 1 per session |
| Sponsor / Ministry highlights | Max 1 per session |
| **Cross-cap (system + sponsor combined)** | No two within any rolling 24 hours, regardless of session count |

**Session definition:** a continuous app usage window with no more than 30 minutes of idle time. Idle = no `mousedown / keydown / touchstart / wheel` activity. This matches the existing Phase 1.1 parent-dash idle detection in `app/js/parent.js`; reuse that timer rather than adding a second one.

**Enforcement behavior:** when a notification of any mode would exceed its cap, it is **queued, not dropped** — emitted at the start of the next eligible session (announcements/sponsor) or the next calendar day (personal). The bell badge does not increment until the notification is actually emitted, so users never open the drawer to a backlog of pings.

**Source basis:** `docs/competitor-faith-landscape.md` (notification-pattern section) cites push-notification industry data — opt-out risk rises sharply above 5–6 pushes per week — and Hallow's high-frequency notification cadence is a documented complaint in App Store reviews. YourLife CC's bell is on-page-only at launch (no mobile push), which already mitigates the worst of this; the badge logic still enforces the cap so an active drawer never feels like a feed.

### Visual

- Bell icon, top-right of the app shell. Number badge if unread > 0 (cap at 9+).
- Click opens a 360px-wide right-aligned drawer.
- Three tabs at the top of the drawer (one per mode). Counts per tab.
- Each item has icon, title, 1-line preview, timestamp, optional CTA button.
- Drawer closes on ESC, click-outside, or bell re-click.
- Items mark-read on view; badge clears.
- "Notification settings" link at bottom of drawer routes to Settings → Notifications, where the user can mute by mode.

### Rollout — faith-only first as a 2-week beta (locked in 2026-05-06)

Ship the bell to **faith-only first as a 2-week beta**, then port to the full app once validated. Use the beta to validate the three modes (notifications / announcements / sponsor-ministry highlights) under real usage before exposing the component to paid users.

Beta success criteria — defined upfront, all must be true before paid rollout:

- No drawer-open errors in console for 7 consecutive days.
- All three modes have at least one item that's been viewed and marked-read.
- Mute-by-mode preference persists across sessions (verified across sign-out / sign-in).
- Mobile drawer (full-screen below 400px viewport) has no scroll trap.
- Empty states render correctly for all three tabs.
- At least one ministry-highlight push has been validated end-to-end (admin-row insert → live render → mark-read).

### Placement consistency

- Same spot, same component, in faith-only and full app **after the 2-week beta concludes successfully**. The only difference: in the full app, mode 3 also surfaces partner / referral content; in faith-only, mode 3 is donation matching, ministry highlights, and Kingdom Creatives community announcements only — never paid promotions.

### Data shape

- `D.notifications: [{ id, mode, title, preview, ctaLabel, ctaHref, createdAt, readAt }]` in local state.
- New Supabase table `announcements` for mode 2 (system push).
- New Supabase table `ministry_highlights` for mode 3, with `start_at` / `end_at` windowing.
- See §10.

### Files affected

- New `app/js/notifications.js` — render + state management.
- HTML scaffold added to `app/index.html` (header / app shell).
- CSS in `app/css/app.css` or scoped inline in `app/index.html` per existing pattern.

---

## 10. Database changes

### `profiles` table — new columns

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `faith_only` | `boolean` | `false` | **Immutable origin marker** — set true ONCE at faith-only registration (`api/faith-register.js`), never modified by webhooks or app code. Distinct from `plan_status` (the mutable current tier state). Used by the Stripe webhook guard and as a clean analytics dimension. See "Two-flag model" below. |
| `age_tier` | `text` | `null` | Enum: `'kids' \| 'youth' \| 'adult' \| 'family'`. Drives onboarding and content filtering. |
| `account_role` | `text` | `null` | Enum: `'self' \| 'parent' \| 'group_leader'`. Drives features unlocked. |

RLS policies on `profiles` already enforce `user_id = auth.uid()`; no new policy needed for these columns.

### Two-flag model — `plan_status` × `faith_only` (clarified 2026-05-06)

`plan_status='faith_free'` and `faith_only=true` are **paired but distinct**, not redundant. This clarifies an ambiguity raised during Phase 6.0 review: the boolean is a *secondary*, *immutable* flag, not a tier-name replacement. Q5 (tier name) and the `faith_only` boolean answer different questions.

| Flag | Type | Mutability | Purpose |
|------|------|-----------|---------|
| `plan_status` | text (`active`, `free_contest`, `faith_free`, etc.) | **Mutable** — Stripe webhook, admin tool, support action can all change it | Current tier state. Drives feature gating in `app/js/auth.js`. |
| `faith_only` | boolean | **Immutable in normal operation** — set once at `/register-faith.html`, never touched by webhook or app code | Origin marker. "This user came in via the no-Stripe Faith path." Survives any clobbering of `plan_status`. |

**Canonical Phase 6 Faith-path state:** `plan_status='faith_free' AND faith_only=true`. Both true.

**Drift cases (intentional design — guard does NOT fire):**

| State | Meaning | Guard behavior |
|-------|---------|----------------|
| `plan_status='active' AND faith_only=true` | Faith-path user upgraded to a paid plan (legitimate; admin or future self-service upgrade). | Stripe events go through normally. |
| `plan_status='faith_free' AND faith_only=false` | Paid user manually downgraded by support (rare; admin tool action). | Stripe events go through normally. User gets faith-free gating until support resolves. |
| `plan_status='active' AND faith_only=false` | Vast majority of paid users. | Standard subscription path. |
| `plan_status='free_contest' AND faith_only=false` | Legacy contest signups, untouched. | Standard subscription path. |

The webhook guard (§1 "Stripe webhook safety") fires **only** on the canonical state — both flags true. Partial-drift cases are intentionally let through so Stripe and admin actions can recover the row, rather than locking it out of all subsequent webhook activity.

**Why not derive `faith_only` from `plan_status='faith_free'` alone?** Because the entire point of the F0-followups production-block was that `plan_status` got clobbered by a Stripe webhook. An immutable origin marker that survives clobbering is the only reliable way to identify origin after the fact. It also gives clean analytics ("how many users entered via the Faith path?") without parsing event history or string state.

**Mutation rules (enforced by convention; not DB triggers at launch):**

- `faith_only=true` is set exactly once, by `api/faith-register.js`, at the moment of faith-path account creation.
- No other code path sets `faith_only=true`. No webhook, no admin tool, no app-side flow.
- `faith_only=false → true` transitions only via support ticket (e.g., paid user wants to switch to the Faith path); these are manual SQL by support, logged.
- `faith_only=true → false` transitions are not expected. If a Faith-path user upgrades to paid, `plan_status` changes; `faith_only` stays true (preserving origin).

A future migration — **F6-C, logged in §11 remaining open items** — promotes these conventions to a DB-level trigger that rejects any UPDATE flipping `faith_only` from `true → false` unless an explicit `support_override` session variable is set. Set-once is enforced by the codebase today; F6-C is the durable fix.

### New table — `donations`

```sql
create table donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null,                 -- 'succeeded' | 'failed' | 'refunded'
  is_recurring boolean not null default false,
  campaign_id text,                     -- optional, for matching campaigns
  donor_email text,                     -- copy from Stripe at time of charge
  created_at timestamptz not null default now()
);

alter table donations enable row level security;

-- Users can read their own donation history (year-end statement support).
create policy "donations_select_own" on donations
  for select using (auth.uid() = user_id);

-- Server-only writes (via service role from the webhook handler).
-- No policy for INSERT / UPDATE — service-role bypasses RLS.
```

`user_id` is nullable to allow anonymous donations (the donor enters card info but never makes a YourLife CC account).

### New table — `announcements` (notification mode 2)

```sql
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  preview text not null,
  body_html text,
  cta_label text,
  cta_href text,
  audience text not null default 'all', -- 'all' | 'faith_only' | 'paid' | 'youth' | etc.
  start_at timestamptz not null default now(),
  end_at timestamptz,
  created_at timestamptz not null default now()
);

alter table announcements enable row level security;

-- All authenticated users can read currently-active announcements.
create policy "announcements_select_active" on announcements
  for select using (
    auth.role() = 'authenticated'
    and start_at <= now()
    and (end_at is null or end_at >= now())
  );
```

### New table — `ministry_highlights` (notification mode 3)

```sql
create table ministry_highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  preview text not null,
  body_html text,
  cta_label text,
  cta_href text,
  audience text not null default 'all',
  is_donation_match boolean not null default false,
  match_multiplier numeric(3,1),         -- e.g., 2.0 for double-match
  start_at timestamptz not null default now(),
  end_at timestamptz,
  created_at timestamptz not null default now()
);

alter table ministry_highlights enable row level security;

create policy "highlights_select_active" on ministry_highlights
  for select using (
    auth.role() = 'authenticated'
    and start_at <= now()
    and (end_at is null or end_at >= now())
  );
```

### Migration files

Add to `docs/migrations/` matching the existing convention. Two files:

1. `0XX-faith-only-profile-columns.sql` — adds the three new columns to `profiles`.
2. `0XX-faith-only-tables.sql` — creates `donations`, `announcements`, `ministry_highlights` with policies.

### Stripe webhook handler — required changes (from §1)

Listed here so it's not lost between sections:

1. Guard 1: `IF profile.plan_status='faith_free' AND profile.faith_only=true THEN return early.`
2. Guard 2: `IF event.metadata.purpose='donation' THEN insert into donations + return; do not touch profiles.`
3. Verify the handler uses `user_id` filtering, not row-wide scans.

---

## 11. Resolved decisions (2026-05-06) and remaining open items

### Resolved this session

| Topic | Decision |
|-------|----------|
| Tier name | Keep `faith_free` as DB value; expand allow-list. User-facing label is "Faith path" / "Faith Community". |
| Donation model | Embedded Payment Element, one-time + recurring on the same screen. Separate Stripe `donation` Product with `metadata.purpose='donation'`. |
| Donation amounts | $5 / $10 / $25 / $50 / custom. No anchored ask. |
| 501(c)(3) status | Kingdom Creatives LLC is NOT a registered 501(c)(3). Donations explicitly not tax-deductible. T&C states this clearly. Future business question, not a launch blocker. |
| Kids 6–11 tier | Parent-managed sub-profile only. Kids never register directly. No PII entered by child. Mirrors existing parent-of-teen strictness. |
| Group / leader tools at launch | Personal use only at launch. Leader admin tools deferred to Phase 6.x. |
| Christian Life Guide authorship | `content-author-faith` agent in batches. Drafts to `/content/faith-drafts/` for review and approval before integration. 12 new entries across multiple drafting sessions. |
| Group Bible Studies launch volume | 3 arcs at launch (was recommended 6). Expand based on usage data. |
| Youth Group curriculum launch volume | 3 units / 12 sessions at launch (was recommended 6 / 24). |
| Notification bell rollout | Faith-only first as a 2-week beta, then port to full app after success criteria met. Not simultaneous launch. |
| Doctrinal orientation | Broadly Christian / non-denominational, centered on shared historic Christian foundations. Audience includes Catholic, Orthodox, and Protestant families. |
| Marketing consent | Transactional-only by default. Marketing requires explicit opt-in (unchecked by default). |

### Remaining open items

1. **Competitor research re-run.** The `competitor-researcher` agent failed with a WebSearch permission-denied error in the prior session; `docs/competitor-faith-landscape.md` is not produced. Several content-depth recommendations in this spec are reasoned-from-first-principles, not benchmarked against the live market. Re-run is its own session — needs WebSearch enabled or manually-fed research.
2. **Lawyer review pending** before any user-facing launch:
   - Donation non-deductibility wording vs. state-by-state donation-solicitation rules.
   - **HIGH PRIORITY:** Group/leader liability disclaimer for ministry-with-minors use. Gating launch of Phase 6.6 (Group Bible Studies) and Phase 6.7 (Youth curriculum).
   - COPPA implementation review for the Kids 6–11 sub-profile flow against verifiable-parental-consent requirements.
3. **Light-mode contrast pass** (a Phase 3 roadmap item) — needed before the indigo `#4338ca` and teal `#14b8a6` accents can be confidently used in light mode.
4. **F6-C — DB trigger to enforce `faith_only` set-once rule.** Add a `BEFORE UPDATE` trigger on `public.profiles` that rejects any change to `faith_only` from `true → false` unless an explicit `support_override` session variable is set (e.g. `SET LOCAL app.support_override = 'true';` at the start of a support-action transaction). Convention-level enforcement ships with Phase 6.0 (`api/faith-register.js` is the only writer; no other code path sets the flag). DB-level enforcement is the durable fix and the answer to "what if multiple support staff start running ad-hoc SQL." Not blocking launch — set-once is honored by the codebase today, and the only non-codebase writer is a human in the Supabase Dashboard who can be trusted to set the override. Promote to a Phase 6.x ship if drift is observed in practice or before the support team grows beyond a single person.

---

## Implementation phases (rough)

Each ships independently, like F0 / F1.

- **6.0** — DB migrations (§10), Stripe webhook guards (§1, §10).
- **6.1** — Registration flow + age-tier onboarding (§1, §2).
- **6.2** — T&C delta (§3) — pending lawyer review.
- **6.3** — Top-right notification component (§9).
- **6.4** — Donation flow (Embedded Payment Element + dedicated Stripe Donation Product) (§1).
- **6.5** — Christian Life Guide expansion: 12 new entries (§4) — content drafted by `content-author-faith` agent first. **Post-launch success criterion (§4 Content velocity):** ≥ 1 new entry per month for the first 12 months. A miss in any month is a Phase 6.5 failure to investigate, not a slip.
- **6.6** — Group Bible Studies module (§5) — 3 launch arcs (additional arcs ship as Phase 6.x waves driven by engagement data). **Gated on lawyer-reviewed group/leader liability waivers.**
- **6.7** — Youth Group curriculum module (§6) — 3 launch units / 12 sessions (additional units ship as Phase 6.x waves). **Gated on lawyer-reviewed ministry-with-minors disclaimers.** **Post-launch success criterion (§6 Success metric):** second-unit adoption rate ≥ 40% within 6 months of launch. Below 25% triggers a format revisit before adding more units.
- **6.8** — Family Faith modules (§7) — 12 launch modules.
- **6.9** — Life Skills × Faith cross-reference companions (§8) — 12 companion entries.

## Design constraints (carried forward)

- **No restyle of existing Faith hub content.** Add to it; don't refactor what works.
- **Don't break paid users.** Same regression rule as F0/F1.
- **GitHub web UI uploads only.** No build step.
- **`node --check` every JS file.**
- **Verify `app/index.html` tail integrity** before AND after every edit (`function tick()`, `setInterval(tick`, Google Translate script, `</body>`, `</html>`).
- **No new HTML on the marketing landing page** — register-faith.html is the only marketing-adjacent addition.
- Standing rules: domain `https://yourlifecc.com`, contact `info@kingdom-creatives.com`.
