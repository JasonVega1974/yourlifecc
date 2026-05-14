// ═══════════════════════════════════════════════════════════════
// F6 — Stripe Webhook Extension (Donation Branch + faith_free Guard)
// ═══════════════════════════════════════════════════════════════
//
// STATUS: REVISED DRAFT FOR REVIEW (rev 2 — 2026-05-06).
// All six findings from docs/F6-stripe-webhook-splice-plan.md
// have been applied. Do NOT deploy until the splice into the
// existing function is reviewed line-by-line.
//
// This file is the new code to splice into the existing live
// Edge Function:
//
//     supabase/functions/stripe-webhook/index.ts
//
// (mirrored at docs/stripe-webhook-current.ts for review)
//
// The helpers below assume they live alongside the existing
// module-level constants and helpers in that file:
//
//     STRIPE_SECRET, WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_KEY,
//     BREVO_API_KEY, CORS    (already in live code, lines 3–13)
//     stripeGet, verifyStripeSignature, syncStatus, etc.
//
// Helpers take `sb: any` as first arg, matching the live convention
// (`syncStatus(sb, opts)`, `awardContestEntries(sb, opts)`).
//
// ── Goal (per docs/faith-only-spec.md §1 and §10) ─────────────
//
// 1. Donation branch — when event metadata.purpose === 'donation',
//    handle as a donation: insert to public.donations, send Brevo
//    confirmation, return early. Never modify plan_status.
//
// 2. faith_free + faith_only=true guard — inline inside syncStatus
//    (see SPLICE POINT 2 diff at the bottom of this file). Single
//    site covers all 5 event handlers that mutate plan_status.
//
// ── Required env vars (already configured in live function) ────
//
//     STRIPE_SECRET_KEY
//     STRIPE_WEBHOOK_SECRET
//     SUPABASE_URL
//     SERVICE_ROLE_KEY            ← unprefixed name in this codebase
//     BREVO_API_KEY
//
// ═══════════════════════════════════════════════════════════════


// ── Types ───────────────────────────────────────────────────────

interface DonationRow {
  user_id:                   string | null;
  stripe_payment_intent_id:  string | null;
  stripe_subscription_id:    string | null;
  amount_cents:              number;
  currency:                  string;
  status:                    'succeeded' | 'failed' | 'refunded' | 'pending';
  is_recurring:              boolean;
  campaign_id:               string | null;
  donor_email:               string | null;
}


// ═══════════════════════════════════════════════════════════════
// SPLICE POINT 1 — donation router
// ═══════════════════════════════════════════════════════════════
//
// Insert immediately after `try {` on live line 373 and BEFORE
// `switch (event.type) {` on live line 374:
//
//   try {
//     // ── F6 SPLICE POINT 1: donation branch ──
//     const donationResp = await routeDonationOrFallthrough(event, sb);
//     if (donationResp) return donationResp;
//
//     switch (event.type) {
//       ...
//
// ═══════════════════════════════════════════════════════════════

async function routeDonationOrFallthrough(
  event: any,
  sb: any
): Promise<Response | null> {
  const purpose = extractDonationPurpose(event);
  if (purpose !== 'donation') {
    // Not a donation. Caller continues into the existing switch.
    return null;
  }
  return await handleDonationEvent(event, sb);
}

function extractDonationPurpose(event: any): string | null {
  const obj = event.data?.object ?? {};

  // 1. Direct metadata on the event object (PaymentIntent, Charge).
  const direct = obj.metadata?.purpose;
  if (direct) return direct;

  // 2. Subscription-driven invoices: metadata sits on the parent
  //    subscription. We attach metadata.purpose='donation' to the
  //    Subscription at creation time in api/donate-intent.js (Phase
  //    6.4). The Invoice carries it via subscription_details.
  if (typeof event.type === 'string' && event.type.startsWith('invoice.')) {
    const subMeta = obj.subscription_details?.metadata;
    if (subMeta?.purpose) return subMeta.purpose;
  }

  // 3. customer.subscription.* events: metadata directly on the sub.
  if (typeof event.type === 'string' && event.type.startsWith('customer.subscription.')) {
    if (obj.metadata?.purpose) return obj.metadata.purpose;
  }

  return null;
}


// ═══════════════════════════════════════════════════════════════
// Donation event handler (called from SPLICE POINT 1)
// ═══════════════════════════════════════════════════════════════

async function handleDonationEvent(event: any, sb: any): Promise<Response> {
  const row = buildDonationRow(event);
  if (!row) {
    // Donation-tagged event we don't store as a row (e.g.
    // customer.subscription.created on a donation Subscription —
    // we wait for the first invoice.payment_succeeded before
    // recording). Acknowledge so Stripe doesn't retry.
    console.log(`ℹ️ Donation event acknowledged (no row): ${event.type}`);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const { error } = await sb.from('donations').insert(row);
  if (error) {
    console.error(`💔 Donation insert failed: ${error.message}`);
    return new Response(JSON.stringify({ error: 'donation insert failed' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
  console.log(
    `🎁 Donation recorded: ${row.status} ` +
    `$${(row.amount_cents / 100).toFixed(2)} ` +
    `(${row.is_recurring ? 'recurring' : 'one-time'})`
  );

  // Brevo confirmation — fire-and-forget. Email failures must NOT
  // fail the webhook (Stripe would retry and we'd double-insert).
  if (row.status === 'succeeded' && row.donor_email) {
    sendBrevoDonationConfirmation(row).catch((e: any) => {
      console.error(`❌ Donation confirmation email exception: ${e.message}`);
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function buildDonationRow(event: any): DonationRow | null {
  switch (event.type) {

    case 'payment_intent.succeeded': {
      const pi = event.data.object;
      return {
        user_id:                   pi.metadata?.user_id ?? null,
        stripe_payment_intent_id:  pi.id,
        stripe_subscription_id:    null,
        amount_cents:              pi.amount_received ?? pi.amount,
        currency:                  pi.currency,
        status:                    'succeeded',
        is_recurring:              false,
        campaign_id:               pi.metadata?.campaign_id ?? null,
        donor_email:               pi.receipt_email ?? null,
      };
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object;
      return {
        user_id:                   pi.metadata?.user_id ?? null,
        stripe_payment_intent_id:  pi.id,
        stripe_subscription_id:    null,
        amount_cents:              pi.amount,
        currency:                  pi.currency,
        status:                    'failed',
        is_recurring:              false,
        campaign_id:               pi.metadata?.campaign_id ?? null,
        donor_email:               pi.receipt_email ?? null,
      };
    }

    case 'invoice.payment_succeeded': {
      const inv = event.data.object;
      const subMeta = inv.subscription_details?.metadata ?? {};
      return {
        user_id:                   subMeta.user_id ?? inv.metadata?.user_id ?? null,
        stripe_payment_intent_id:  inv.payment_intent ?? null,
        stripe_subscription_id:    inv.subscription ?? null,
        amount_cents:              inv.amount_paid,
        currency:                  inv.currency,
        status:                    'succeeded',
        is_recurring:              true,
        campaign_id:               subMeta.campaign_id ?? null,
        donor_email:               inv.customer_email ?? null,
      };
    }

    case 'invoice.payment_failed': {
      const inv = event.data.object;
      const subMeta = inv.subscription_details?.metadata ?? {};
      return {
        user_id:                   subMeta.user_id ?? null,
        stripe_payment_intent_id:  null,
        stripe_subscription_id:    inv.subscription ?? null,
        amount_cents:              inv.amount_due,
        currency:                  inv.currency,
        status:                    'failed',
        is_recurring:              true,
        campaign_id:               subMeta.campaign_id ?? null,
        donor_email:               inv.customer_email ?? null,
      };
    }

    case 'charge.refunded': {
      const charge = event.data.object;
      const piId = typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id ?? null;
      return {
        user_id:                   charge.metadata?.user_id ?? null,
        stripe_payment_intent_id:  piId,
        stripe_subscription_id:    null,
        amount_cents:              charge.amount_refunded,
        currency:                  charge.currency,
        status:                    'refunded',
        is_recurring:              false,
        campaign_id:               charge.metadata?.campaign_id ?? null,
        donor_email:               charge.receipt_email ?? null,
      };
    }

    default:
      // Donation-tagged event we don't record (subscription
      // lifecycle: created, updated, deleted). Acknowledge silently.
      return null;
  }
}


// ═══════════════════════════════════════════════════════════════
// Brevo transactional email — donation confirmation
//
// Visual style mirrors `sendWelcomeEmail` in the live function
// (live lines 251–270): inline-styled dark-mode wrapper, brand
// cyan, capitalized headers, trackClicks/trackOpens disabled,
// sender "YourLife CC".
//
// Note the explicit non-deductibility line in the body — UI
// requirement from docs/faith-only-spec.md §1 carried into the
// email surface.
// ═══════════════════════════════════════════════════════════════

async function sendBrevoDonationConfirmation(row: DonationRow): Promise<void> {
  if (!BREVO_API_KEY) {
    console.warn(`⚠️ BREVO_API_KEY not set — skipping donation confirmation email`);
    return;
  }
  if (!row.donor_email) return;

  const amount        = (row.amount_cents / 100).toFixed(2);
  const recurringText = row.is_recurring ? 'monthly ' : '';
  const subject       = row.is_recurring
    ? `Thank you for your monthly gift to YourLife CC — $${amount}`
    : `Thank you for your gift to YourLife CC — $${amount}`;

  const html =
    `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0a0e1a;color:#e2e8f0;border-radius:12px;">` +
      `<h2 style="color:#3b82f6;font-size:22px;margin-bottom:8px;">Thank you for your gift 🎁</h2>` +
      `<p style="color:#94a3b8;margin-bottom:16px;">Thank you for your ${recurringText}gift of <strong style="color:#e2e8f0;">$${amount}</strong> to YourLife CC. Your donation supports general operations and keeps the Faith path free for individuals, families, and ministries.</p>` +
      `<div style="background:#1e293b;border-left:3px solid #3b82f6;padding:14px 18px;border-radius:6px;margin:20px 0;">` +
        `<p style="color:#e2e8f0;margin:0;font-size:14px;"><strong>Donations to Kingdom Creatives LLC are not tax-deductible.</strong> Kingdom Creatives LLC is not a registered 501(c)(3) charitable organization.</p>` +
      `</div>` +
      `<p style="color:#64748b;font-size:13px;margin-top:24px;">This email serves as your confirmation. Stripe also sends an automated receipt to the email on your card statement.</p>` +
      `<hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;" />` +
      `<p style="color:#64748b;font-size:12px;">Questions? <a href="mailto:info@kingdom-creatives.com" style="color:#3b82f6;text-decoration:none;">info@kingdom-creatives.com</a></p>` +
      `<p style="color:#475569;font-size:12px;">© 2026 YourLife CC · Kingdom Creatives LLC</p>` +
    `</div>`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'YourLife CC', email: 'info@kingdom-creatives.com' },
      to: [{ email: row.donor_email }],
      subject,
      trackClicks: false,
      trackOpens:  false,
      htmlContent: html,
    }),
  });

  if (res.ok) {
    console.log(`✅ Donation confirmation email sent via Brevo to ${row.donor_email}`);
  } else {
    const errText = await res.text();
    console.error(`❌ Donation Brevo send failed: ${errText}`);
  }
}


// ═══════════════════════════════════════════════════════════════
// SPLICE POINT 2 — faith_only guard inside syncStatus()
// ═══════════════════════════════════════════════════════════════
//
// Insert inside the existing live syncStatus function (live lines
// 207–248), specifically inside the `if (resolvedCustId) { ... }`
// block. Insert AFTER live line 239 and BEFORE live line 240.
//
// All five event handlers that mutate plan_status converge on
// syncStatus:
//   - customer.subscription.deleted (live line 444)
//   - customer.subscription.updated (live line 478)
//   - invoice.payment_failed         (live line 495)
//   - invoice.payment_succeeded      (live line 510)
//   - payment_intent.succeeded       (live line 524)
//
// The checkout.session.completed → upsertProfile path (live line
// 349) is intentionally NOT guarded. That path represents a
// faith_only user upgrading to a paid plan, which is a legitimate
// drift case per faith-only-spec.md §10 — plan_status flips to
// 'active' while faith_only stays true (upsertProfile doesn't
// touch faith_only). After that flip, the canonical-state guard
// no longer fires anyway.
//
// ── Diff to apply by hand inside live syncStatus ──────────────
//
//     239    if (resolvedCustId) {
//     240  +   // ── F6 SPLICE POINT 2: faith_only guard ──
//     240  +   // Belt-and-suspenders defense per faith-only-spec §1, §10.
//     240  +   // Donation events should never reach this function (they
//     240  +   // return early at SPLICE POINT 1), but a misconfigured
//     240  +   // Customer Portal or manual Stripe action could fire a
//     240  +   // subscription event for a faith_only user. Skip the
//     240  +   // profile/family update if the canonical state is detected.
//     240  +   const { data: guardRow } = await sb
//     240  +     .from('profiles')
//     240  +     .select('plan_status, faith_only')
//     240  +     .eq('stripe_customer_id', resolvedCustId)
//     240  +     .maybeSingle();
//     240  +   if (guardRow?.plan_status === 'faith_free' && guardRow?.faith_only === true) {
//     240  +     console.log(`🛡️ faith_only guard: skipped plan_status sync for cust ${resolvedCustId}`);
//     240  +     return;
//     240  +   }
//     240  +
//     240      const profileUpdate: Record<string, any> = { plan_status, updated_at: now };
//     241      if (current_period_end !== undefined) profileUpdate.current_period_end = current_period_end;
//     242      const { error } = await sb.from('profiles').update(profileUpdate).eq('stripe_customer_id', resolvedCustId);
//
// ── Notes ─────────────────────────────────────────────────────
//
// - `maybeSingle()` returns null gracefully if no profile matches
//   the resolvedCustId (rather than throwing on no-row).
// - Guard fires only when BOTH flags are canonical. Drift cases
//   (one flag matches but not the other) intentionally let
//   through so Stripe and admin actions can recover the row.
// - The guard short-circuits with `return;` (syncStatus returns
//   void), skipping both the families update above (live lines
//   226 & 229) and the profile update below (live line 242).
//   Family updates are no-ops for faith_only users (they have no
//   families row), so skipping them is safe.
// - The outer main handler proceeds to its standard 200 OK
//   response at live line 535. Stripe sees a normal 200, which
//   is what we want — no special "faith_only protected" message.
//
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// HOW TO INTEGRATE — pseudocode showing both splice points in
// context, with line numbers from stripe-webhook-current.ts
// ═══════════════════════════════════════════════════════════════
//
// Step 1. No new imports — the live `import createClient` line at
//         live line 1 stays as-is. Drop the helpers above into
//         the live file alongside existing helpers (e.g. after
//         `upsertProfile` at live line 352 and before `Deno.serve`
//         at live line 355).
//
// Step 2. Splice point 1 — main handler:
//
//   ...live lines 368–371 unchanged...
//   const event = JSON.parse(payload);
//   console.log(`✅ Webhook received: ${event.type}`);
//
//   const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
//
//   try {
//     // ── F6 SPLICE POINT 1: donation branch ──
//     const donationResp = await routeDonationOrFallthrough(event, sb);
//     if (donationResp) return donationResp;
//
//     switch (event.type) {
//       ...live cases unchanged...
//     }
//
// Step 3. Splice point 2 — inside syncStatus (see diff above).
//
// Step 4. No other changes to the live file. Save, deploy in
//         Test mode first per docs/F6-stripe-webhook-deploy-runbook.md.
//
// ═══════════════════════════════════════════════════════════════
