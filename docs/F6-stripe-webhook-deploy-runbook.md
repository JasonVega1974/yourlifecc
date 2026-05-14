# F6 — Stripe Webhook Deployment Runbook

Companion to `docs/F6-stripe-webhook-extension.ts`. Walks through pre-deploy verification, Stripe Test-mode validation of the new donation branch + faith_only guard, post-deploy verification in Live mode, and rollback path.

**Status:** runbook only. Nothing in this doc deploys anything.

---

## 0. Prerequisites

Before opening this runbook, both of these must be true:

- [ ] `F6-A-faith-only-profile-columns.sql` has been run in Supabase (verify `faith_only`, `age_tier`, `account_role` columns exist on `public.profiles` with their CHECK constraints).
- [ ] `F6-B-faith-only-tables.sql` has been run in Supabase (verify `donations`, `announcements`, `ministry_highlights` tables exist with `rowsecurity = true`).

Both are confirmed live as of 2026-05-06.

---

## 1. Pre-deploy checklist

### 1.1 Pull and review the live function

The current deployed `stripe-webhook` Edge Function source is **not** in this repo. To review pre-splice:

1. Open Supabase Dashboard → project `hrohgwcbfgywkpnvqxhk` → **Edge Functions** → `stripe-webhook` → **Code**.
2. Copy `index.ts` (and any imports) into `docs/stripe-webhook-current.ts` for diffing.
3. Confirm the existing function:
   - Verifies the signature with `stripe.webhooks.constructEvent`.
   - Has at least one `case 'customer.subscription.*'` branch that updates `profiles.plan_status`.
   - Has access to `userId` (via `subscription.metadata.user_id` or a customer-table lookup) at every `plan_status` mutation site.

### 1.2 Confirm Edge Function secrets

In Supabase Dashboard → **Edge Functions** → **Secrets**, confirm all five are present (Edge Function secrets are independent of Vercel env vars):

- [ ] `STRIPE_SECRET_KEY` — Stripe Live secret key (sk_live_…) or Test key (sk_test_…) depending on mode.
- [ ] `STRIPE_WEBHOOK_SECRET` — webhook signing secret (whsec_…) for the Stripe webhook endpoint pointing at this function.
- [ ] `SUPABASE_URL` — typically auto-injected by Supabase runtime.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — service-role JWT (different from anon key).
- [ ] `BREVO_API_KEY` — transactional email key.

If `BREVO_API_KEY` is only in Vercel, donation confirmation emails will not send. Copy it into Edge Function secrets before deploying.

### 1.3 Confirm a Stripe Donation Product exists

In Stripe Dashboard (Test mode for the test pass; Live for the prod deploy):

- [ ] A Product named `Donation` exists.
- [ ] At least one Price exists (one-time payment of arbitrary amount via custom amount, OR fixed-amount Prices for $5 / $10 / $25 / $50 if desired).
- [ ] The Product has `metadata.purpose = 'donation'`.
- [ ] The Customer Portal is configured to NOT show donation Subscriptions to paid-app subscribers (separate Product avoids this automatically; verify in Customer Portal settings).
- [ ] **Stripe API version on the webhook endpoint is ≥ `2024-04-10`** — Stripe Dashboard → Developers → Webhooks → endpoint settings → API version. The donation handler reads `invoice.subscription_details.metadata` to extract `purpose='donation'` from the parent Subscription on recurring-donation invoices; this field is only populated on API version 2024-04-10 or newer. Older versions would let recurring donations fall through to the existing subscription handler. Verified 2026-05-07: endpoint is on `2026-02-25.clover` — gate passes. Re-verify on each future deploy.

### 1.4 Splice the new code into a non-prod copy

Do **not** edit the live function directly. Instead:

1. In the Supabase Dashboard, **duplicate the function** (copy the source to a new function called `stripe-webhook-staging`, or pull to local Supabase CLI).
2. Apply the splice points from `docs/F6-stripe-webhook-extension.ts`:
   - SPLICE POINT 1: add `routeDonationOrFallthrough` call at the top of `Deno.serve`, immediately after `constructEvent`.
   - SPLICE POINT 2: add `isFaithOnlyProtected` guard before every `update({ plan_status: ... })` call. If there are 3 sites, all 3 need the guard.
3. Add the four helper functions (`routeDonationOrFallthrough`, `extractDonationPurpose`, `isFaithOnlyProtected`, `handleDonationEvent`, `buildDonationRow`, `sendBrevoDonationConfirmation`) to the function source.
4. Run `deno check index.ts` locally if you have the Supabase CLI installed.

---

## 2. Test-mode validation

Switch to Stripe Test mode for this section. Use a separate Stripe webhook endpoint pointing at the staging function, with its own `STRIPE_WEBHOOK_SECRET` (Test mode whsec).

### 2.1 Stripe test cards

| Scenario | Card number | Notes |
|---|---|---|
| Successful charge | `4242 4242 4242 4242` | Primary happy-path card |
| Successful 3DS | `4000 0027 6000 3184` | Tests SCA flow |
| Declined (generic) | `4000 0000 0000 0002` | Generic decline |
| Insufficient funds | `4000 0000 0000 9995` | For `payment_intent.payment_failed` testing |
| Successful then disputed | `4000 0000 0000 0259` | For chargeback testing (out of scope for launch but useful) |
| Successful then refunded | Use any successful card, then refund from Dashboard | For `charge.refunded` event testing |

Any future expiry date and any 3-digit CVC. ZIP `12345` works.

### 2.2 Test scenarios — run all six

For each test, log:
- The Stripe event(s) received in the staging function logs.
- The row inserted into `public.donations` (Supabase → Table Editor → donations).
- Whether a Brevo email was sent (check Brevo logs at app.brevo.com → Logs).
- Whether `profiles.plan_status` was modified (it should NOT be, in any donation test).

#### Test A: One-time donation, authenticated user

1. As a logged-in test user (with `plan_status='active'` or `'faith_free'`), trigger a donation PaymentIntent via the future `api/donate-intent.js` flow OR manually create one via the Stripe Dashboard with `metadata.purpose=donation` and `metadata.user_id=<test-user-uuid>`.
2. Pay with `4242 4242 4242 4242`.
3. Stripe fires `payment_intent.succeeded`.

Verify in Supabase:
- [ ] `select * from donations where stripe_payment_intent_id = '<pi_id>'` returns one row.
- [ ] Row has `status='succeeded'`, `is_recurring=false`, `amount_cents` matches, `user_id` matches the test user.
- [ ] `select plan_status from profiles where user_id = '<test-user-uuid>'` is unchanged.

Verify in Brevo:
- [ ] One transactional email sent to the test user with subject "Thank you for your gift to YourLife CC ($X.XX)".
- [ ] Body contains the line "Donations to Kingdom Creatives LLC are not tax-deductible."

#### Test B: One-time donation, anonymous (no user_id)

1. Create a PaymentIntent with `metadata.purpose=donation` and **no** `metadata.user_id`. Use `receipt_email=anon@example.com`.
2. Pay with `4242 4242 4242 4242`.

Verify:
- [ ] Donations row exists with `user_id IS NULL`.
- [ ] `donor_email = 'anon@example.com'`.
- [ ] No `profiles` row was created or modified.
- [ ] Brevo email sent to `anon@example.com`.

#### Test C: One-time donation, faith-only user

1. As a logged-in test user with `plan_status='faith_free'` AND `faith_only=true`, trigger a donation.
2. Pay with `4242 4242 4242 4242`.

Verify:
- [ ] Donations row inserted as in Test A.
- [ ] `select plan_status, faith_only from profiles where user_id = '<test-faith-user-uuid>'` shows BOTH still set (`faith_free`, `true`). The donation event must not have triggered the subscription handler.

#### Test D: Recurring donation, first invoice

1. Create a Subscription (donation tier) with `metadata.purpose=donation` and `metadata.user_id=<test-user-uuid>`.
2. Stripe fires `customer.subscription.created` (returns "ok, no row" — silent), then `invoice.payment_succeeded`.

Verify:
- [ ] `donations` row inserted with `is_recurring=true`, `stripe_subscription_id` set.
- [ ] Brevo email subject says "Thank you for your *monthly* gift…".

#### Test E: Recurring donation, second invoice (next month or simulated)

In Stripe Test mode, advance the clock or trigger a manual invoice:

- Stripe Dashboard → Subscriptions → the donation Subscription → "Trigger test event" → `invoice.payment_succeeded`.

Verify:
- [ ] A second `donations` row is inserted with the new invoice's intent ID.
- [ ] Brevo email sent again.

#### Test F: Refund

1. From Stripe Dashboard → Payments, refund the Test A charge.
2. Stripe fires `charge.refunded`.

Verify:
- [ ] A new `donations` row is inserted with `status='refunded'`, same `stripe_payment_intent_id` as the original.
- [ ] Original `succeeded` row is unchanged (we don't update; we append).
- [ ] No Brevo email sent (refund emails are out of scope at launch — Stripe sends its own).

#### Test G: faith_only guard with a forced subscription event

This validates SPLICE POINT 2.

1. Manually create a Stripe Subscription for a test user whose profile has `plan_status='faith_free'` AND `faith_only=true`. **Do NOT** set `metadata.purpose=donation` on this subscription — we want it to look like a regular paid-plan subscription to the existing handler.
2. Stripe fires `customer.subscription.created` (or `.updated`).

Verify:
- [ ] The existing subscription handler runs (donation branch returns null because purpose !== 'donation').
- [ ] **`isFaithOnlyProtected` returns true and the handler short-circuits.**
- [ ] `select plan_status, faith_only from profiles where user_id = '<test-uuid>'` is unchanged.
- [ ] Function logs show `faith_only guard: skipping plan_status update for <uuid>`.

This is the test that explicitly catches the F0-followups production-block scenario.

### 2.3 Negative tests

- [ ] Send a non-donation event (e.g. `customer.subscription.updated` for a regular paid user with `metadata.purpose` unset). Confirm the donation branch returns null and the existing handler runs as before. `plan_status` updates as it always has.
- [ ] Send a `payment_intent.succeeded` for a normal paid Stripe customer (not a donation). Confirm donation branch returns null. (Existing handler may or may not have logic for this — verify it behaves as before.)

---

## 3. Live deployment

Only after all 13 test cases above pass cleanly in Test mode.

### 3.1 Pre-flight

- [ ] Take a snapshot of the live `stripe-webhook` function source. Save it locally as `docs/stripe-webhook-pre-F6.ts` for rollback reference.
- [ ] Confirm Stripe Live webhook endpoint signing secret matches `STRIPE_WEBHOOK_SECRET` in Live secrets.
- [ ] Confirm `BREVO_API_KEY` is set in Edge Function Live secrets.
- [ ] Confirm Stripe Live mode has the Donation Product created.

### 3.2 Deploy

1. In Supabase Dashboard → Edge Functions → `stripe-webhook` → paste the spliced code.
2. Click Deploy.
3. Watch the function logs for the next 5–10 minutes.

### 3.3 Live smoke test

Use a real card with a small one-time donation ($5):

- [ ] Donate $5 from a logged-in account.
- [ ] Confirm `donations` row in Supabase Live DB.
- [ ] Confirm Brevo sends the email.
- [ ] Confirm `plan_status` of the donor is unchanged.
- [ ] Refund the $5 from Stripe Dashboard → Payments. Confirm refund row appears.

If any of those fail, see §4 Rollback.

---

## 4. Rollback

The deploy is reversible at any time.

### Fast rollback (function level, ~30 seconds)

1. Supabase Dashboard → Edge Functions → `stripe-webhook` → **Deploy History**.
2. Select the deployment immediately prior to the F6 deploy.
3. Click **Redeploy**.

The previous function source goes live in ~30 seconds. Stripe will retry any in-flight events; pre-F6 logic handles them as it did before. Donation rows already inserted into `public.donations` remain — they're harmless. Donation Brevo emails already sent are not retracted (also harmless).

### Manual fallback (if Deploy History is unavailable)

1. Open `docs/stripe-webhook-pre-F6.ts` (the pre-flight snapshot from §3.1).
2. Paste it into the Edge Function code editor.
3. Deploy.

### What rollback does NOT do

- Does not drop the `donations` table or any rows. Those are harmless even with the old function.
- Does not roll back F6-A or F6-B migrations. The new columns and tables stay; nothing reads or writes them with old function code.
- Does not refund donations. If a donation succeeded in the brief window, it's a real charge — refund manually from Stripe Dashboard if appropriate.

### When to roll back vs. fix forward

- **Roll back immediately** if `plan_status` is being clobbered for any user (the bug that motivated F6 in reverse).
- **Roll back immediately** if donation events are 500-ing repeatedly (Stripe will give up after several days of retries; rolling back stops the retry storm).
- **Fix forward** if Brevo confirmation emails are failing — the donation rows are inserting, the email is non-critical, deal with it post-mortem.

---

## 5. Post-deploy verification (24h checklist)

- [ ] Stripe Dashboard → Webhooks → `stripe-webhook` endpoint → Last 24h → 0 errors.
- [ ] Supabase Edge Function logs → 0 unhandled exceptions.
- [ ] `select count(*), status from donations where created_at > now() - interval '24 hours' group by status` → matches expectations.
- [ ] No support tickets reporting "my paid plan disappeared" or "I was charged but lost access" (the failure mode F6 is preventing).

If all four are clean at 24h, F6 webhook deploy is done.

---

## 6. Known follow-ups (not blocking)

- **Idempotency hardening** — add `unique (stripe_payment_intent_id) where stripe_payment_intent_id is not null` to the `donations` table in a follow-up migration. Prevents double-insert on Stripe retries. Not needed for launch but worth before donation volume grows.
- **Recurring cancellation visibility** — `customer.subscription.deleted` events for donation subs are currently silent. To surface "your monthly donation was cancelled", either add a row-on-cancel branch (with a new `status='cancelled'` enum value in the CHECK constraint) or query Stripe for live subscription state when rendering donation history.
- **Receipt PDF / year-end statement** — out of scope for F6 webhook; tracked separately.
