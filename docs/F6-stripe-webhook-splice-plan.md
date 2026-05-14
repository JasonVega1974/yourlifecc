# F6 Stripe Webhook — Splice Plan Review

Companion to:
- `docs/stripe-webhook-current.ts` — live deployed code (546 lines, source of truth for what's in production at `supabase/functions/stripe-webhook/index.ts`).
- `docs/F6-stripe-webhook-extension.ts` — F6 draft. Originally 336 lines; restored from conversation context after an accidental overwrite, then revised to **415 lines (rev 2)** with all six findings applied (see §7).
- `docs/F6-stripe-webhook-deploy-runbook.md` — deployment runbook (separate concern; not duplicated here).

This doc is **review-only**. Nothing in it is deployed. The verdict is at the bottom (§6).

---

## 1. Structural summary of `stripe-webhook-current.ts`

### 1.1 Imports & runtime

| Item | Live code |
|------|-----------|
| Stripe SDK | **NONE** — no `import Stripe from ...` |
| Supabase | `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'` |
| Stripe API access | Bespoke `stripeGet(path)` wrapper using `fetch` + Bearer auth |
| Signature verification | Bespoke `verifyStripeSignature` using Web Crypto (`crypto.subtle`, HMAC-SHA256) |
| Event parsing | `JSON.parse(payload)` after signature verify — plain object, not typed |
| Runtime | Deno (Supabase Edge Function): `Deno.serve`, `Deno.env.get` |

### 1.2 Module-level constants (lines 3–35)

```
Line 3:  STRIPE_SECRET   = Deno.env.get('STRIPE_SECRET_KEY')   ?? ''
Line 4:  WEBHOOK_SECRET  = Deno.env.get('STRIPE_WEBHOOK_SECRET')?? ''
Line 5:  SUPABASE_URL    = Deno.env.get('SUPABASE_URL')        ?? ''
Line 6:  SUPABASE_KEY    = Deno.env.get('SERVICE_ROLE_KEY')    ?? ''   ← unprefixed!
Line 7:  BREVO_API_KEY   = Deno.env.get('BREVO_API_KEY')       ?? ''
Line 9:  CORS = { ... }
Line 15: PRICES        — 3 Stripe Price IDs → 'monthly' | 'yearly' | 'lifetime'
Line 21: SPONSOR_PRICES — 3 Sponsor Price IDs → entries
Line 31: PLAN_CONTEST_ENTRIES = { monthly:1, yearly:2, lifetime:5 }
```

### 1.3 Helper functions

| Line | Helper | Purpose |
|------|--------|---------|
| 38 | `tagBrevoContact(opts)` | Brevo `/v3/contacts` POST — sets ACTIVATED / PLAN_TYPE / CHURNED |
| 68 | `verifyStripeSignature(payload, header, secret)` | Manual HMAC-SHA256 via Web Crypto |
| 87 | `stripeGet(path)` | `fetch` wrapper for Stripe API GETs with Bearer auth |
| 100 | `awardContestEntries(sb, opts)` | `INSERT contest_entries`; handles 23505 unique-violation gracefully |
| 135 | `awardReferrerEntries(sb, refCode, newUserEmail)` | Truncated-user-id refcode lookup; awards 5 entries |
| 159 | `handleSponsorPurchase(sb, session, priceId)` | Awards 'sponsored' contest entries |
| 180 | `handlePaidPlanEntries(sb, email, userId, plan, sessionId)` | Plan-specific entries once per user |
| **207** | **`syncStatus(sb, opts)`** | **Updates `families` AND `profiles` with plan_status. Resolves cust ID from familyId if needed.** |
| 251 | `sendWelcomeEmail(email, setupLink)` | Brevo `/v3/smtp/email`; inline-styled dark-mode HTML |
| 273 | `provisionUser(sb, opts)` | Creates auth user, magic link, welcome email; calls `upsertProfile` or `syncStatus` |
| 334 | `upsertProfile(sb, opts)` | UPSERT to profiles on email conflict |

### 1.4 Main handler `Deno.serve` (lines 355–547)

1. OPTIONS → CORS preflight (line 356)
2. Non-POST → 405 (line 357)
3. Read body (line 359), get `stripe-signature` header (line 360)
4. `verifyStripeSignature` (line 362) → 400 on fail
5. `JSON.parse(payload)` (line 368)
6. `console.log('✅ Webhook received: ${event.type}')` (line 369)
7. Per-invocation `sb = createClient(SUPABASE_URL, SUPABASE_KEY)` (line 371) — **NOT module-level**
8. `try { switch (event.type) { ... } }` (lines 373–533)
9. Outer catch returns 500 (line 540)

### 1.5 Event types branched on (5 distinct, 6 case statements, +1 default)

| Event type | Lines | What it does to plan_status |
|---|---|---|
| `checkout.session.completed` | 376–437 | Either sponsor entry (no plan_status touch) OR provisions user with `plan_status='active'` |
| `customer.subscription.deleted` | 439–462 | `plan_status='cancelled'` |
| `customer.subscription.updated` | 464–485 | Maps `sub.status` → `active` / `past_due` / `cancelled` / `incomplete` / `paused` |
| `invoice.payment_failed` | 487–498 | `plan_status='past_due'` |
| `invoice.payment_succeeded` (alias `invoice_payment.paid`) | 500–517 | `plan_status='active'` |
| `payment_intent.succeeded` | 519–529 | `plan_status='active'` (lifetime only — guarded by `metadata.plan==='lifetime'`) |
| `default` | 531 | Logs unhandled |

---

## 2. SPLICE POINT 1 — donation router

### 2.1 Pinned location

Between **line 373** (`try {`) and **line 374** (`switch (event.type) {`). Inside the existing try block so any unexpected exception in the donation handler is caught by the outer 500-handler at line 540.

### 2.2 Five lines of context BEFORE

```ts
368  const event = JSON.parse(payload);
369  console.log(`✅ Webhook received: ${event.type}`);
370
371  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
372
373  try {
```

### 2.3 Five lines of context AFTER

```ts
374    switch (event.type) {
375
376      case 'checkout.session.completed': {
377        const session     = event.data.object;
378        const email       = session.customer_details?.email ?? session.customer_email;
```

### 2.4 Proposed splice (illustrative — see §5 for required revisions to draft helpers)

```diff
@@ live code lines 371–374 @@
 const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

 try {
+  // ── F6 SPLICE POINT 1: donation branch ──
+  // Donation events route to donation handling and never touch plan_status.
+  const donationResp = await routeDonationOrFallthrough(event, sb);
+  if (donationResp) return donationResp;
+
   switch (event.type) {

     case 'checkout.session.completed': {
```

The draft's `routeDonationOrFallthrough(event)` signature lacks the `sb` arg. The live code's pattern is "every helper takes `sb: any` first." The draft must be revised before splicing — see §5.5.

---

## 3. SPLICE POINT 2 — N count and unified diffs

### 3.1 The N-count question — two options

**Option A — splice in 5 event-case sites.** Add the guard at each `case` that mutates plan_status:

| Site | Line | Event | Why guarded |
|------|------|-------|-------------|
| A1 | 444 | `customer.subscription.deleted` | sets cancelled |
| A2 | 478 | `customer.subscription.updated` | sets active/past_due/etc. |
| A3 | 495 | `invoice.payment_failed` | sets past_due |
| A4 | 510 | `invoice.payment_succeeded` / `invoice_payment.paid` | sets active |
| A5 | 524 | `payment_intent.succeeded` (lifetime branch) | sets active |

The `checkout.session.completed` path (line 415) and the `provisionUser → upsertProfile` path are intentionally **not** guarded — they represent a faith_only user upgrading to paid, which is a legitimate drift case per `faith-only-spec.md` §10.

**Option B — single splice inside `syncStatus()`.** All 5 event-case sites call into `syncStatus()` to actually mutate `profiles.plan_status` (line 242). Splicing the guard inside that function covers all five at once.

### 3.2 Recommendation: Option B

Reasons:
- All five event-case sites converge on `syncStatus()`. Single splice = covers all five automatically; no risk of missing one in a future event-type addition.
- The draft's `isFaithOnlyProtected(userId)` helper signature is wrong for the live code: the live code only has `stripe_customer_id` at this stage, not `user_id`. A single inline guard inside `syncStatus()` keyed on `stripe_customer_id` is cleaner than adapting the helper.
- The `checkout.session.completed → upsertProfile` path is intentionally NOT guarded (drift case 2 in §10) and stays unaffected.
- The `families` table updates (lines 226 & 229 of syncStatus) are no-ops for faith_only users (they don't have a `families` row), so an early return from syncStatus is safe even though it skips the families update.

### 3.3 Unified diff for Option B (recommended)

Single splice inside `syncStatus()`:

```diff
@@ live code lines 239–242 @@
   if (resolvedCustId) {
+    // ── F6 SPLICE POINT 2: faith_only guard ──
+    // Belt-and-suspenders defense (per faith-only-spec §1, §10):
+    // a misconfigured Customer Portal or manual Stripe action could
+    // fire a subscription event for a faith_only user. Skip the
+    // profile update if the canonical state is detected.
+    const { data: guardData } = await sb
+      .from('profiles')
+      .select('plan_status, faith_only')
+      .eq('stripe_customer_id', resolvedCustId)
+      .maybeSingle();
+    if (guardData?.plan_status === 'faith_free' && guardData?.faith_only === true) {
+      console.log(`🛡️ faith_only guard: skipped plan_status sync for cust ${resolvedCustId}`);
+      return;
+    }
+
     const profileUpdate: Record<string, any> = { plan_status, updated_at: now };
     if (current_period_end !== undefined) profileUpdate.current_period_end = current_period_end;
     const { error } = await sb.from('profiles').update(profileUpdate).eq('stripe_customer_id', resolvedCustId);
```

Notes:
- `maybeSingle()`, not `single()` — returns `null` gracefully if no profile matches the resolvedCustId (rather than throwing on no-row).
- Guard fires only when **both** flags are canonical — drift cases let through per §10.
- 🛡️ emoji matches the live code's logging style (✅ ❌ ⚠️ ℹ️).
- Returns early from `syncStatus`, so the family updates above (lines 226, 229) and the profile update below (line 242) are both skipped. Family updates are no-ops for faith_only users; this is correct.

### 3.4 Option A — five per-site diffs (only if you want event-level visibility)

Pattern is identical at each site. Insert immediately before the `await syncStatus(...)` call:

```diff
+  // ── F6 SPLICE POINT 2: faith_only guard ──
+  if (await isFaithOnlyProtected(sb, /* lookup-key */)) {
+    console.log(`🛡️ faith_only guard: skipped <event-type> for <key>`);
+    return new Response('ok (faith_only protected)', { status: 200 });
+  }
   await syncStatus(sb, { ... });
```

Per-site lookup key:

| Site | Line | Lookup key in scope | Adapted helper signature |
|------|------|---------------------|--------------------------|
| A1 | 444 | `familyId` (from `sub.metadata?.familyId`) | needs `isFaithOnlyProtectedByFamily(sb, familyId)` |
| A2 | 478 | `familyId` | same |
| A3 | 495 | `custId` (from `invoice.customer`) | needs `isFaithOnlyProtectedByCust(sb, custId)` |
| A4 | 510 | `custId` | same |
| A5 | 524 | `familyId` | same |

5 sites + 2 helper variants + risk of drift if a future case is added without the guard. **Don't do this.** Use Option B.

---

## 4. Env var reconciliation

| Var | Live code (line) | Draft (line) | Action |
|-----|------------------|--------------|--------|
| Stripe secret | `STRIPE_SECRET_KEY` (3) | `STRIPE_SECRET_KEY` (49) | ✅ match |
| Stripe webhook | `STRIPE_WEBHOOK_SECRET` (4) | `STRIPE_WEBHOOK_SECRET` (32) | ✅ match |
| Supabase URL | `SUPABASE_URL` (5) | `SUPABASE_URL` (55) | ✅ match |
| Supabase service key | **`SERVICE_ROLE_KEY`** (6) | `SUPABASE_SERVICE_ROLE_KEY` (56) | ❌ **rename** |
| Brevo | `BREVO_API_KEY` (7) | `BREVO_API_KEY` (304) | ✅ match |

**Required rename:** the draft reads `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`; the deployed function reads `Deno.env.get('SERVICE_ROLE_KEY')` (unprefixed). The mismatch would mean the integrated function gets `''` for the service key and silently fails to write donation rows.

In the integrated form, the draft should not re-read env vars at all — it should reuse the existing module constants `STRIPE_SECRET`, `WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_KEY`, `BREVO_API_KEY`. See §5.1.

---

## 5. Pattern reconciliation — places the draft would look grafted

### 5.1 Module-level vs per-invocation Supabase client

**Live (line 371):** per-invocation `const sb = createClient(SUPABASE_URL, SUPABASE_KEY)` inside `Deno.serve`. `sb` passed as first arg to every helper.

**Draft (lines 54–58):** module-level singleton `supabase = createClient(...)`. Helpers reference it directly.

**Recommended rewrite:** drop the module-level `supabase` constant in the draft. Refactor `routeDonationOrFallthrough`, `handleDonationEvent`, `isFaithOnlyProtected`, and any helper that touches the DB to take `sb: any` as first arg (matching the existing `awardContestEntries`, `syncStatus`, etc. pattern).

### 5.2 Stripe SDK vs no SDK

**Live:** no Stripe SDK. Stripe API via `stripeGet(path)`. Signature verification via `verifyStripeSignature` (Web Crypto). Events are plain JSON-parsed objects, not `Stripe.Event`.

**Draft (line 43):** `import Stripe from 'https://esm.sh/stripe@14?target=deno'`. Uses `Stripe.Event`, `Stripe.Invoice`, `Stripe.PaymentIntent`, `Stripe.Charge`, `Stripe.Subscription` types. Pseudocode shows `stripe.webhooks.constructEvent`.

**Recommended rewrite:**
- Drop the Stripe SDK import entirely.
- Type events as `any` (matching the live code's loose style at line 368).
- Drop all `as Stripe.PaymentIntent` / `as Stripe.Invoice` / etc. casts. Replace with direct property access on `event.data.object`.
- Signature verification is already handled by the existing `verifyStripeSignature` at line 362 of the live code. The pseudocode in the draft showing `stripe.webhooks.constructEvent` is moot — splice happens AFTER signature verification.

### 5.3 Logging style

**Live:** emoji prefixes (✅ ❌ ⚠️ ℹ️) followed by colon-separated messages:
- `console.log('✅ Webhook received: ${event.type}')`
- `console.error('❌ Brevo send failed: ${errText}')`
- `console.warn('⚠️ No email in checkout session')`
- `console.log('ℹ️ Profile already exists for ${custId}, skipping user creation')`

**Draft:** bare object-style logs:
- `console.error('faith_only guard lookup failed', { userId, error })`
- `console.warn('BREVO_API_KEY not set — skipping confirmation email')`

**Recommended rewrite:** add emoji prefixes to every log line. Suggested mapping:
- 🎁 — donation row inserted
- 💔 — donation row insert failed
- 🔄 — refund recorded
- 🛡️ — guard fire (already used in §3.3 diff above)
- ❌ — Brevo email error
- ✅ — donation Brevo email sent
- ⚠️ — config / env warning

### 5.4 Brevo email pattern

**Live (lines 252–263):**
- `'Content-Type': 'application/json'` (capitalized header)
- HTML uses inline styles: `background:#0a0e1a;color:#e2e8f0;border-radius:12px;` with brand cyan `#3b82f6` for links/buttons
- `trackClicks: false, trackOpens: false`
- Sender: `{ name: 'YourLife CC', email: 'info@kingdom-creatives.com' }`

**Draft (lines 308–322):**
- `'content-type': 'application/json'` (lowercase)
- Plain `<p>` HTML, no inline styling, no dark-mode wrapper
- No track flags
- Sender: `{ name: 'Kingdom Creatives', email: 'info@kingdom-creatives.com' }`

**Recommended rewrite:**
- Capitalize headers (`Content-Type`, not `content-type`).
- Apply the same dark-mode inline-styled HTML wrapper as `sendWelcomeEmail` (line 261). The non-deductibility line stays inside that wrapper.
- Add `trackClicks: false, trackOpens: false`.
- Sender name → `'YourLife CC'`.

### 5.5 Function signature pattern

**Live:** every helper that uses Supabase takes `sb: any` as first argument, options object as second.

**Draft:** `routeDonationOrFallthrough(event)`, `isFaithOnlyProtected(userId)`, `handleDonationEvent(event)`, `sendBrevoDonationConfirmation(row)` — none take `sb`.

**Recommended rewrite:** add `sb: any` as first arg to every donation helper that touches the DB. Naturally falls out of §5.1.

### 5.6 Type discipline

**Live:** loose. `any`, `Record<string, any>`. No interfaces.

**Draft:** strict `DonationRow` interface (lines 63–73), typed event arguments.

**Recommended:** keep `DonationRow` (it documents the donations row shape and is referenced internally); drop the Stripe SDK type casts (per §5.2). Mixed-discipline is acceptable here because `DonationRow` is internal to donation helpers, not public API.

### 5.7 Error handling

**Live:** outer `try/catch` wraps the switch; returns 500 on uncaught error. Inner helpers swallow expected errors (e.g., `awardContestEntries` swallows 23505).

**Draft:** `handleDonationEvent` returns `Response 500` directly on insert error, then would also be caught by outer try/catch if it threw.

**Recommended:** keep current behavior. Returning 500 explicitly tells Stripe to retry; throwing would also work but is less clear. No change needed beyond the `sb` refactor.

---

## 6. Final verdict

### Ready for splice — **NO**

The draft is functionally correct in the abstract but written against an idealized webhook structure (Stripe SDK, module-level Supabase client, strict types, emoji-free logs). The live code is more ad-hoc (no SDK, per-invocation Supabase client, loose typing, emoji logging). Splicing the draft as-written would:

1. **Functionally break:** `SUPABASE_SERVICE_ROLE_KEY` is unset in the deployed environment — donation inserts would silently fail because the service-role-key would be `''`.
2. **Look grafted:** mixing Stripe SDK calls with the existing Web-Crypto signature verification, mixing module-level Supabase client with per-invocation `sb`, mixing strict types with loose `any`, and mixing emoji logs with bare logs. Future maintainers would have to mentally context-switch between two styles.
3. **Use the wrong helper signature for the actual codebase:** `isFaithOnlyProtected(userId)` doesn't fit because the relevant identifier at the splice point in `syncStatus` is `stripe_customer_id`, not `user_id`.

### Required revisions before splice (six)

1. **Env var rename** — drop the env-var reads in helpers; reuse module constants (`SUPABASE_KEY`, `BREVO_API_KEY`, etc.). The deployed function reads `SERVICE_ROLE_KEY` (unprefixed), not `SUPABASE_SERVICE_ROLE_KEY`.
2. **Drop Stripe SDK** — remove the `stripe@14` import, drop all `Stripe.*` type casts, type events as `any`. Reuse the existing `verifyStripeSignature` already in place at live line 362.
3. **Per-invocation Supabase client** — drop module-level `supabase` constant. Add `sb: any` as first arg to every donation helper (matches `syncStatus`, `awardContestEntries`, etc.).
4. **Emoji logging** — prefix every log line with the existing convention (✅ ❌ ⚠️ ℹ️ + new 🎁 💔 🛡️).
5. **Brevo email visual match** — capitalize headers, apply the dark-mode inline-styled HTML wrapper from `sendWelcomeEmail`, add `trackClicks: false / trackOpens: false`, change sender name to "YourLife CC".
6. **SPLICE POINT 2 simplification** — drop the `isFaithOnlyProtected(userId)` helper. Replace with an inline 8-line guard inside `syncStatus()` keyed on `stripe_customer_id` (per §3.3 diff above). One splice site instead of N event-case sites.

### Blockers

None at the database / infrastructure level. F6-A and F6-B are live; the `donations`, `announcements`, `ministry_highlights` tables exist; the new `profiles.faith_only / age_tier / account_role` columns exist. All blockers are stylistic + the env var bug. All are fixable in a single revision pass.

### Recommended next step

I produce a **revised F6 draft** at `docs/F6-stripe-webhook-extension.ts` (overwriting the just-restored original) that applies all six revisions. After your review of the revised draft, the splice itself is mechanical — paste the helpers, add the SPLICE POINT 1 + 2 inserts, deploy.

Authorize the revision pass and I'll do it. No deploy until you give explicit go on the deploy step (separate from the revision step).

---

## 7. Post-revision verdict (rev 2 — 2026-05-07)

All six findings from §5 / §6 have been applied to `docs/F6-stripe-webhook-extension.ts`. The revised draft is 415 lines (was 383); `diff -q` against `docs/stripe-webhook-current.ts` reports them as differing (exit 1) — files remain distinct, as intended.

| # | Revision | Status | Where in revised draft |
|---|----------|--------|------------------------|
| 1 | Env var rename — drop `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`; helpers reference live module constants in scope (`SUPABASE_KEY`, `BREVO_API_KEY`, `CORS`) | ✅ Applied | No `Deno.env.get` calls in helpers; banner notes module-constant dependency |
| 2 | Drop Stripe SDK import; type events as `any`; drop all `Stripe.X` type casts | ✅ Applied | No `import Stripe from ...`; events typed as `any`; no Stripe.* casts anywhere |
| 3 | Per-invocation Supabase client — every helper that touches the DB takes `sb: any` as first arg | ✅ Applied | `routeDonationOrFallthrough(event, sb)`, `handleDonationEvent(event, sb)`; pure helpers (`extractDonationPurpose`, `buildDonationRow`, `sendBrevoDonationConfirmation`) don't need `sb` |
| 4 | Emoji logging — 🎁 💔 🛡️ ✅ ❌ ⚠️ ℹ️ throughout | ✅ Applied | Every `console.*` line carries the appropriate prefix |
| 5 | Brevo email — inline-styled dark-mode wrapper, capitalized `Content-Type`, `trackClicks`/`trackOpens` false, sender `'YourLife CC'` | ✅ Applied | `sendBrevoDonationConfirmation` HTML matches `sendWelcomeEmail` palette (`#0a0e1a` / `#e2e8f0` / `#3b82f6`); `<div>` accent block calls out non-deductibility |
| 6 | SPLICE POINT 2 simplified — `isFaithOnlyProtected` helper removed; replaced with inline 8-line guard inside `syncStatus()` between live lines 239 and 240 | ✅ Applied | Helper deleted; SPLICE POINT 2 banner contains the inline diff to apply by hand inside live `syncStatus` |

**Confirmation: `checkout.session.completed → upsertProfile` is explicitly NOT guarded.** Documented in the SPLICE POINT 2 banner of the revised draft. This path represents a faith_only user upgrading to a paid plan, which is a legitimate drift case per `faith-only-spec.md` §10 — `plan_status` flips to `'active'` while `faith_only` stays `true` (upsertProfile doesn't touch the faith_only column). After that flip, the canonical-state guard no longer fires.

### Ready for splice — **YES, with caveats**

The revised draft is drop-in compatible with `stripe-webhook-current.ts`. Splice steps are mechanical:

1. Paste the helpers (`DonationRow` interface, `routeDonationOrFallthrough`, `extractDonationPurpose`, `handleDonationEvent`, `buildDonationRow`, `sendBrevoDonationConfirmation`) as a new section in the live file — recommended location is between `upsertProfile` (live line 352) and `Deno.serve` (live line 355). About 200 lines pasted.
2. Add SPLICE POINT 1 between live lines 373 and 374 (3 lines added).
3. Apply SPLICE POINT 2 inline diff inside `syncStatus()` between live lines 239 and 240 (~14 lines added).
4. Save, deploy in Test mode per `docs/F6-stripe-webhook-deploy-runbook.md`.

### Remaining caveats (non-blocking)

1. **Idempotency hardening** — the `donations` table has no `UNIQUE` constraint on `stripe_payment_intent_id`. Stripe retry on 5xx could create duplicate rows. Recommended follow-up: F6-D migration adding `unique (stripe_payment_intent_id) where stripe_payment_intent_id is not null`. Not blocking launch but worth doing before donation volume grows.
2. **Recurring cancellation visibility** — `customer.subscription.deleted` on a donation Subscription is acknowledged silently (no row inserted into `donations`). Donor-facing cancellation visibility is currently a query-Stripe-live concern. Phase 6.x follow-up.
3. **Stripe API version dependency** — the donation handler reads `subscription_details.metadata` on invoice events to extract `purpose='donation'` from the parent Subscription. This field is populated on Stripe API version 2024-04-10 or newer. If the deployed Edge Function's webhook endpoint is configured with an older API version, the field will be undefined and recurring-donation invoices will incorrectly fall through to the existing subscription handler. **Verify the API version in Stripe Dashboard → Webhooks → endpoint settings before deploying.** If older, fall back to fetching the parent Subscription via `stripeGet` for the `metadata.purpose` lookup — small addition to `extractDonationPurpose`.
4. **Module constants in scope** — the helpers reference `BREVO_API_KEY`, `CORS`, and (for `syncStatus` SPLICE POINT 2) module-level `sb` parameter. `BREVO_API_KEY` and `CORS` exist as live module constants (lines 7 and 9). Confirm they remain in scope after pasting (they will, given helpers are pasted into the same file).
5. **Standalone lint will error** — the revised draft references `BREVO_API_KEY` and `CORS` without local declarations. Running `deno check` against the standalone file will report undeclared identifiers. That's expected and not a real issue — the file is a splice fragment, not a runnable module. To verify cleanly, paste the helpers into a copy of the live function and `deno check` the integrated file.
6. **No automatic test coverage** — the deploy runbook (`docs/F6-stripe-webhook-deploy-runbook.md`) covers Test-mode validation manually. There is no unit test scaffold in this repo. The runbook's Tests A through G in §2.2 cover the revised draft as-is — no runbook updates needed.

### Recommended next step

You review the revised draft `docs/F6-stripe-webhook-extension.ts` line-by-line. When ready to proceed, follow `docs/F6-stripe-webhook-deploy-runbook.md` for the Test-mode → Live-mode deploy sequence. Authorize the deploy explicitly when ready — no deploy will happen until you say so.

No live function modifications happened in this revision pass. `docs/stripe-webhook-current.ts` is unchanged. `git status` shows only the F6 draft file and this splice plan modified in this turn.
