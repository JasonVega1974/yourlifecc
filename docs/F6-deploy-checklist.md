# F6 Stripe Webhook — Live Deploy Checklist

**Status of source artifact (2026-05-13):** `docs/stripe-webhook-spliced.ts` is deploy-ready. Contains the existing live handler + F6 SPLICE POINT 1 (donation router) + F6 SPLICE POINT 2 (faith_only guard inside `syncStatus`) + bug fixes #10 (InvoicePayment shape) and #11 (parent-first `subscription` lookup).

This document is the **shortest path to live deploy**. The full reference is `docs/F6-stripe-webhook-deploy-runbook.md` — open it only if a step here fails.

Estimated time: **15–25 minutes** including smoke test.

---

## Phase A — Pre-flight (5 min, can do anytime today)

### A1. Backup the current live function

1. Open https://supabase.com/dashboard/project/hrohgwcbfgywkpnvqxhk/functions
2. Click on `stripe-webhook`.
3. Click the **Code** tab. You should see ~546 lines starting with `import { createClient }`.
4. **Select All → Copy.**
5. Open `docs/stripe-webhook-pre-F6.ts` in your editor and paste the content there. Save.
6. Commit + push that backup (`git add docs/stripe-webhook-pre-F6.ts && git commit -m "F6: snapshot pre-deploy webhook source" && git push`). This is your rollback file.

### A2. Verify Edge Function Secrets are set

1. Supabase Dashboard → Edge Functions → **Secrets** (left nav).
2. Confirm all five names appear (values are masked — you don't need to see them, just that they exist):
   - [ ] `STRIPE_SECRET_KEY` — must start with `sk_live_` (NOT `sk_test_`)
   - [ ] `STRIPE_WEBHOOK_SECRET` — must start with `whsec_`
   - [ ] `SUPABASE_URL`
   - [ ] `SERVICE_ROLE_KEY` ← **note: unprefixed**, NOT `SUPABASE_SERVICE_ROLE_KEY`
   - [ ] `BREVO_API_KEY`

If any are missing, **STOP** and add them before continuing. The function will silently fail without them.

### A3. Verify Stripe webhook API version

1. Open https://dashboard.stripe.com/webhooks (Live mode — top-right toggle).
2. Click the endpoint that points at `https://hrohgwcbfgywkpnvqxhk.supabase.co/functions/v1/stripe-webhook` (or similar).
3. Look at **API version** field. Must be **`2024-04-10` or newer**. The runbook says it was `2026-02-25.clover` as of 2026-05-07 — should still be valid.

If the API version is older, click **Update API version** to the latest, then continue.

### A4. Verify the Donation Product exists in Stripe Live mode

1. https://dashboard.stripe.com/products (Live mode).
2. Confirm a Product named **Donation** exists, with `metadata.purpose = 'donation'`.

If it does not exist, **STOP**. Create it before deploying — otherwise the donation branch has nothing to receive.

---

## Phase B — Deploy (5 min)

### B1. Copy the spliced source

1. Open `docs/stripe-webhook-spliced.ts` in your editor.
2. **Select All → Copy** (~896 lines, starts with the F6 banner comment).

### B2. Paste into Supabase

1. Supabase Dashboard → Edge Functions → `stripe-webhook` → **Code** tab.
2. **Select All in the editor → Delete.**
3. **Paste** the contents of `stripe-webhook-spliced.ts`.
4. Verify the first line you pasted is the F6 banner comment (`// F6 Stripe Webhook — SPLICED, DEPLOY-READY...`).
5. Verify the last lines you pasted are:
   ```
       });
     }
   });
   ```

### B3. Deploy

1. Click **Deploy** (top right of the Code editor).
2. Wait for the green "Deployed" confirmation (~10–30 seconds).
3. Click the **Logs** tab. Leave this tab open in a browser window — you'll watch it during the smoke test.

If Deploy fails with a syntax error, check the error message, do NOT panic, and either:
- Fix in the editor and redeploy, or
- Paste `docs/stripe-webhook-pre-F6.ts` back in to restore prior state and tell me what the error said.

---

## Phase C — Live smoke test (10 min)

Use a real credit card. Total cost: **$5 + immediate refund = $0 net** (Stripe still charges processing fees of ~$0.45 on the original — non-recoverable, treat as the cost of validation).

### C1. Test 1 — Donation succeeds

1. Open https://yourlifecc.com in a logged-in browser (your own account is fine — `plan_status='active'`).
2. Trigger a $5 donation through whatever donation UI is live (if no donation UI is live yet, you can manually create the PaymentIntent from the Stripe Dashboard with `metadata.purpose=donation` and `metadata.user_id=<your-user-uuid>`).
3. Pay with a real card (your own).

Verify within 60 seconds:
- [ ] Supabase Dashboard → Database → Table Editor → `donations` table → new row exists with your `user_id`, `amount_cents=500`, `currency='usd'`, `status='succeeded'`, `is_recurring=false`.
- [ ] Function logs (open from B3) show `🎁 Donation recorded: succeeded $5.00 (one-time)` — emoji confirms the donation branch fired.
- [ ] Brevo confirmation email arrives at your inbox: subject `"Thank you for your gift to YourLife CC ($5.00)"`. Body contains `"Donations to Kingdom Creatives LLC are not tax-deductible."`
- [ ] **Critical**: Supabase Dashboard → Database → `profiles` → find your user row → `plan_status` is **unchanged**. (Should still be whatever it was before.)

### C2. Test 2 — Refund

1. Stripe Dashboard → Payments → find the $5 charge from C1.
2. Click **Refund**, then **Refund full amount**, then **Refund**.

Verify within 60 seconds:
- [ ] Supabase `donations` table → a SECOND row exists with `status='refunded'`, same `stripe_payment_intent_id` as the C1 row.
- [ ] The original `succeeded` row is **unchanged** (we append refund as a new row, not update).
- [ ] Function logs show `🎁 Donation recorded: refunded`.

### C3. Test 3 — faith_only guard fires (recommended, can defer)

This validates SPLICE POINT 2. Only run if you have a test user with `plan_status='faith_free'` and `faith_only=true` in Live mode.

1. In Stripe Dashboard, manually create a Subscription for that test user, mapping `customer` to their `stripe_customer_id`. **Do NOT** set `metadata.purpose=donation`.
2. Watch the function logs.

Verify:
- [ ] Logs show `🛡️ faith_only guard: skipped plan_status sync for cust ...`
- [ ] Supabase `profiles` for that test user → `plan_status` is still `'faith_free'`, `faith_only` is still `true`. Untouched.

If you skip C3, you accept the risk that the guard might not fire correctly under real conditions. Recommended but not strictly blocking.

---

## Phase D — 24-hour monitoring (passive)

Set a phone reminder for ~24 hours after deploy. Then:

1. https://dashboard.stripe.com/webhooks → endpoint → Last 24h. Confirm **0 errors / non-200 responses**.
2. Supabase Edge Functions → `stripe-webhook` → Logs → filter for `❌` or "error". Confirm **0 unhandled exceptions**.
3. Supabase SQL Editor → run `select count(*), status from donations where created_at > now() - interval '24 hours' group by status;` — confirm numbers match expectations.
4. Check your support inbox / email — confirm **0 tickets** about "my paid plan disappeared" or "I was charged but lost access."

If all four are clean, **F6 deploy is done**.

---

## Rollback (only if smoke test fails)

### Fast rollback (~30 seconds)

1. Supabase Dashboard → Edge Functions → `stripe-webhook` → **Deploy History** tab.
2. Find the deployment **immediately prior** to your F6 deploy (timestamp will be earlier today, before B3).
3. Click the three-dot menu → **Redeploy**.
4. Wait for the green "Deployed" confirmation.

The previous function source goes live in ~30 seconds. Stripe will retry any in-flight events; the pre-F6 logic handles them as before.

### Manual rollback (if Deploy History is unavailable)

1. Open `docs/stripe-webhook-pre-F6.ts` (your A1 backup).
2. Copy all.
3. Paste into Supabase Edge Function Code editor (replace everything).
4. Click **Deploy**.

### What rollback does NOT do

- Does NOT drop the `donations` table or any rows already inserted. They're harmless even with the old function.
- Does NOT refund any successful donations. If you need to refund, do it manually from Stripe Dashboard → Payments.
- Does NOT undo the migrations F6-A or F6-B. Schema stays — only function code reverts.

---

## After successful deploy

Mark these tasks complete in your task list:
- [ ] Task #12 — §3.1 Live pre-flight checks → DONE
- [ ] Task #13 — §3.2 Live deploy → DONE
- [ ] Task #14 — §3.3 Live smoke test → DONE
- [ ] Task #15 — §5 24h monitoring → schedule for tomorrow, mark DONE then

When all four are checked, the F6 production deploy work is officially finished and the `faith_only` plan-status overwrite vulnerability is closed.
