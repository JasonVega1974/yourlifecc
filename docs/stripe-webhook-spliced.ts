// ═══════════════════════════════════════════════════════════════
// F6 Stripe Webhook — SPLICED, DEPLOY-READY (2026-05-13)
// ───────────────────────────────────────────────────────────────
// This file is the full Supabase Edge Function source to deploy
// to `stripe-webhook` in project hrohgwcbfgywkpnvqxhk.
//
// Contains:
//   • Existing subscription/checkout/invoice handlers (unchanged)
//   • F6 SPLICE POINT 1 — donation router at top of try block
//   • F6 SPLICE POINT 2 — faith_only guard inside syncStatus()
//   • Bug fix #10 — invoice_payment.paid resolves InvoicePayment
//     to parent Invoice via stripeGet before processing
//   • Bug fix #11 — every invoice.* handler now reads subscription
//     via invoice.parent?.subscription_details?.subscription first
//     (Stripe API 2024-04-10+ relocation), falling back to legacy
//     invoice.subscription only for old API versions
//
// Env vars required (Supabase → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL,
//   SERVICE_ROLE_KEY (unprefixed), BREVO_API_KEY
//
// See docs/F6-stripe-webhook-deploy-runbook.md for deploy steps.
// ═══════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET   = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const WEBHOOK_SECRET  = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const SUPABASE_URL    = Deno.env.get('APP_SUPABASE_URL') ?? '';
const SUPABASE_KEY    = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
const BREVO_API_KEY   = Deno.env.get('BREVO_API_KEY') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
};

const PRICES: Record<string, string> = {
  'price_1T8TBg5KkDVrunQtqfmRyiSu': 'monthly',
  'price_1T8TCE5KkDVrunQteJAl9fgx': 'yearly',
  'price_1T8TCY5KkDVrunQtBejbeCT2': 'lifetime',
};

const SPONSOR_PRICES: Record<string, number> = {
  'price_1TC77m5KkDVrunQtm30EVxrP': 5,
  'price_1TC78c5KkDVrunQtFA7Sovtu': 5,
  'price_1TC79G5KkDVrunQthXYX9p4Z': 5,
};

// ── Contest entries awarded per plan on first purchase ─────────
// monthly/yearly/lifetime each earn +1 entry for account_created
// (account_created is already awarded on signup via auth.js,
//  so we only award plan-specific entries here as a bonus)
const PLAN_CONTEST_ENTRIES: Record<string, number> = {
  monthly:  1,
  yearly:   2,  // slight bonus for annual commitment
  lifetime: 5,  // biggest bonus for lifetime
};

// ── BREVO CONTACT TAGGING ──────────────────────────────────────
async function tagBrevoContact(opts: {
  email: string;
  activated?: boolean;
  planType?: 'paying' | 'free';
  churned?: boolean;
}) {
  const { email, activated, planType, churned } = opts;
  const attributes: Record<string, any> = {};
  if (activated !== undefined) attributes['ACTIVATED']  = activated;
  if (planType  !== undefined) attributes['PLAN_TYPE']  = planType;
  if (churned   !== undefined) attributes['CHURNED']    = churned;
  if (Object.keys(attributes).length === 0) return;
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': BREVO_API_KEY },
      body: JSON.stringify({ email, attributes, updateEnabled: true }),
    });
    if (res.ok || res.status === 204) {
      console.log(`✅ Brevo contact tagged: ${email} →`, attributes);
    } else {
      const errText = await res.text();
      console.error(`❌ Brevo contact tag failed for ${email}:`, errText);
    }
  } catch (e: any) {
    console.error(`❌ Brevo tag exception for ${email}:`, e.message);
  }
}

// ── STRIPE SIGNATURE VERIFICATION ─────────────────────────────
async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  try {
    const parts  = header.split(',');
    const tPart  = parts.find(p => p.startsWith('t='));
    const v1Part = parts.find(p => p.startsWith('v1='));
    if (!tPart || !v1Part) return false;
    const timestamp = tPart.split('=')[1];
    const signature = v1Part.split('=')[1];
    const signed    = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed));
    const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
    return hex === signature;
  } catch { return false; }
}

async function stripeGet(path: string) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { 'Authorization': `Bearer ${STRIPE_SECRET}` },
  });
  return res.json();
}

// ── CONTEST ENTRY HELPER ───────────────────────────────────────
// entry_type values (aligned across frontend, admin, and edge fn):
//   'account_created' | 'setup_complete' | 'first_task'
//   'referral' | 'sponsored' | 'social_share'
//   'paid_monthly' | 'paid_yearly' | 'paid_lifetime'

async function awardContestEntries(
  sb: any,
  opts: {
    email: string;
    userId?: string | null;
    entryType: string;
    entriesAwarded: number;
    referenceId?: string | null;
  }
) {
  const { email, userId, entryType, entriesAwarded, referenceId } = opts;
  try {
    const row: Record<string, any> = {
      email,
      entry_type:      entryType,
      entries_awarded: entriesAwarded,
    };
    if (userId)      row.user_id      = userId;
    if (referenceId) row.reference_id = referenceId;

    const { error } = await sb.from('contest_entries').insert(row);
    if (error) {
      if (error.code === '23505') {
        console.log(`ℹ️ Contest entry already exists for ${entryType}/${email} — skipping`);
      } else {
        console.error(`❌ Contest entry insert failed:`, error.message);
      }
    } else {
      console.log(`✅ Contest: awarded ${entriesAwarded} entries (${entryType}) to ${email}`);
    }
  } catch (e: any) {
    console.error('❌ Contest entry error:', e.message);
  }
}

async function awardReferrerEntries(sb: any, refCode: string, newUserEmail: string) {
  try {
    const { data: profiles } = await sb.from('profiles').select('user_id, email');
    if (!profiles) return;
    const referrer = profiles.find((p: any) => {
      if (!p.user_id) return false;
      return p.user_id.replace(/-/g, '').substring(0, 8).toUpperCase() === refCode.toUpperCase();
    });
    if (referrer) {
      await awardContestEntries(sb, {
        email: referrer.email, userId: referrer.user_id,
        entryType: 'referral', entriesAwarded: 5, referenceId: newUserEmail,
      });
    } else {
      console.warn(`⚠️ Contest: no referrer found for refCode ${refCode}`);
    }
  } catch (e: any) {
    console.error('❌ Referrer lookup failed:', e.message);
  }
}

// ── SPONSOR PURCHASE ───────────────────────────────────────────
// FIX: entry_type changed from 'sponsor' → 'sponsored' to match
//      admin.html typeLabels and contest.html display
async function handleSponsorPurchase(sb: any, session: any, priceId: string) {
  const sponsorEmail = session.customer_details?.email ?? session.customer_email;
  const entriesAmt   = SPONSOR_PRICES[priceId] ?? 5;
  if (!sponsorEmail) { console.warn('⚠️ Sponsor purchase: no email found'); return; }

  const { data: profile } = await sb
    .from('profiles').select('user_id').eq('email', sponsorEmail).maybeSingle();

  await awardContestEntries(sb, {
    email:          sponsorEmail,
    userId:         profile?.user_id ?? null,
    entryType:      'sponsored',           // ← fixed: was 'sponsor'
    entriesAwarded: entriesAmt,
    referenceId:    session.id,
  });
  console.log(`✅ Sponsor purchase: ${entriesAmt} contest entries awarded to ${sponsorEmail}`);
}

// ── PAID PLAN PURCHASE ENTRIES ─────────────────────────────────
// Awards bonus contest entries when a user purchases a paid plan.
// Checks for existing entry first to avoid duplicates on renewals.
async function handlePaidPlanEntries(sb: any, email: string, userId: string | null, plan: string, sessionId: string) {
  const entriesAmt = PLAN_CONTEST_ENTRIES[plan];
  if (!entriesAmt) return;

  // Only award once per user (not on every renewal) — check for existing paid plan entry
  const { data: existing } = await sb
    .from('contest_entries')
    .select('id')
    .eq('email', email)
    .in('entry_type', ['paid_monthly', 'paid_yearly', 'paid_lifetime'])
    .maybeSingle();

  if (existing) {
    console.log(`ℹ️ Paid plan entry already exists for ${email} — skipping`);
    return;
  }

  await awardContestEntries(sb, {
    email,
    userId,
    entryType:      `paid_${plan}`,   // paid_monthly | paid_yearly | paid_lifetime
    entriesAwarded: entriesAmt,
    referenceId:    sessionId,
  });
}

// ── SYNC STATUS ────────────────────────────────────────────────
async function syncStatus(
  sb: any,
  opts: {
    familyId?: string;
    custId?: string;
    plan_status: string;
    plan?: string;
    stripe_subscription_id?: string | null;
    current_period_end?: number | null;
  }
) {
  const { familyId, custId, plan_status, plan, stripe_subscription_id, current_period_end } = opts;
  const now = new Date().toISOString();
  const familyUpdate: Record<string, any> = { plan_status, updated_at: now };
  if (plan)                                 familyUpdate.plan = plan;
  if (stripe_subscription_id !== undefined) familyUpdate.stripe_subscription_id = stripe_subscription_id;
  if (current_period_end !== undefined)     familyUpdate.current_period_end = current_period_end;

  if (familyId) {
    const { error } = await sb.from('families').update(familyUpdate).eq('id', familyId);
    if (error) console.error('families update error (familyId):', error.message);
  } else if (custId) {
    const { error } = await sb.from('families').update(familyUpdate).eq('stripe_customer_id', custId);
    if (error) console.error('families update error (custId):', error.message);
  }

  let resolvedCustId = custId;
  if (!resolvedCustId && familyId) {
    const { data } = await sb.from('families').select('stripe_customer_id').eq('id', familyId).single();
    resolvedCustId = data?.stripe_customer_id;
  }

  if (resolvedCustId) {
    // ── F6 SPLICE POINT 2: faith_only guard ──
    // Belt-and-suspenders defense per faith-only-spec §1, §10.
    // Donation events should never reach this function (they
    // return early at SPLICE POINT 1), but a misconfigured
    // Customer Portal or manual Stripe action could fire a
    // subscription event for a faith_only user. Skip the
    // profile/family update if the canonical state is detected.
    const { data: guardRow } = await sb
      .from('profiles')
      .select('plan_status, faith_only')
      .eq('stripe_customer_id', resolvedCustId)
      .maybeSingle();
    if (guardRow?.plan_status === 'faith_free' && guardRow?.faith_only === true) {
      console.log(`🛡️ faith_only guard: skipped plan_status sync for cust ${resolvedCustId}`);
      return;
    }

    const profileUpdate: Record<string, any> = { plan_status, updated_at: now };
    if (current_period_end !== undefined) profileUpdate.current_period_end = current_period_end;
    const { error } = await sb.from('profiles').update(profileUpdate).eq('stripe_customer_id', resolvedCustId);
    if (error) console.error('profiles update error:', error.message);
    else console.log(`✅ profiles synced → plan_status=${plan_status}`);
  } else {
    console.warn('⚠️ Could not resolve stripe_customer_id — profiles not updated');
  }
}

// ── WELCOME EMAIL ──────────────────────────────────────────────
async function sendWelcomeEmail(email: string, setupLink: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'YourLife CC', email: 'info@kingdom-creatives.com' },
      to: [{ email }],
      subject: 'Welcome to YourLife CC 🎉 — Activate Your Account',
      trackClicks: false,
      trackOpens: false,
      htmlContent: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0a0e1a;color:#e2e8f0;border-radius:12px;"><h2 style="color:#3b82f6;font-size:22px;margin-bottom:8px;">Welcome to YourLife CC 🎉</h2><p style="color:#94a3b8;margin-bottom:24px;">Your account has been created. Click the button below to set your password and access your Life OS dashboard.</p><a href="${setupLink}" style="display:inline-block;background:#3b82f6;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;margin-bottom:24px;">Activate My Account →</a><p style="color:#64748b;font-size:13px;margin-top:24px;">This link expires in 24 hours. If you did not make a purchase, you can ignore this email.</p><hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;" /><p style="color:#64748b;font-size:12px;">Questions? <a href="mailto:info@kingdom-creatives.com" style="color:#3b82f6;text-decoration:none;">info@kingdom-creatives.com</a></p><p style="color:#475569;font-size:12px;">© 2026 YourLife CC · Kingdom Creatives LLC</p></div>`,
    }),
  });
  if (res.ok) {
    console.log(`✅ Welcome email sent via Brevo to ${email}`);
  } else {
    const errText = await res.text();
    console.error(`❌ Brevo send failed: ${errText}`);
  }
}

// ── PROVISION USER ─────────────────────────────────────────────
async function provisionUser(
  sb: any,
  opts: {
    email: string;
    custId: string;
    plan: string;
    plan_status: string;
    current_period_end: number | null;
    referred_by?: string | null;
  }
) {
  const { email, custId, plan, plan_status, current_period_end, referred_by } = opts;
  const now = new Date().toISOString();

  const { data: existing } = await sb
    .from('profiles').select('id').eq('stripe_customer_id', custId).maybeSingle();

  if (existing) {
    console.log(`ℹ️ Profile already exists for ${custId}, skipping user creation`);
    await syncStatus(sb, { custId, plan_status, plan, current_period_end });
    return;
  }

  const { data: newUser, error: createError } = await sb.auth.admin.createUser({
    email,
    password: crypto.randomUUID() + crypto.randomUUID(),
    email_confirm: true,
    user_metadata: { plan, plan_status, stripe_customer_id: custId },
  });

  if (createError) {
    console.error('❌ createUser error:', createError.message);
    const { data: existingProfile } = await sb
      .from('profiles').select('id').eq('email', email).maybeSingle();
    if (existingProfile) {
      await upsertProfile(sb, { userId: existingProfile.id, email, custId, plan, plan_status, current_period_end, referred_by, now });
    }
    return;
  }

  const userId = newUser?.user?.id;
  if (!userId) { console.error('❌ No user ID returned from createUser'); return; }
  console.log(`✅ User created: ${email}, ID: ${userId}`);

  const { data: linkData, error: linkError } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: 'https://yourlifecc.com/activate.html' },
  });

  if (linkError) {
    console.error('❌ generateLink error:', linkError.message);
  } else {
    const setupLink = linkData?.properties?.action_link;
    if (setupLink) await sendWelcomeEmail(email, setupLink);
    else console.error('❌ No action_link returned from generateLink');
  }

  await upsertProfile(sb, { userId, email, custId, plan, plan_status, current_period_end, referred_by, now });
}

async function upsertProfile(
  sb: any,
  opts: {
    userId: string; email: string; custId: string; plan: string;
    plan_status: string; current_period_end: number | null;
    referred_by?: string | null; now: string;
  }
) {
  const { userId, email, custId, plan, plan_status, current_period_end, referred_by, now } = opts;
  const profileRow: Record<string, any> = {
    id: userId, user_id: userId, email,
    stripe_customer_id: custId, plan, plan_status,
    current_period_end, created_at: now, updated_at: now,
  };
  if (referred_by) profileRow.referred_by = referred_by;
  const { error: profileError } = await sb.from('profiles').upsert(profileRow, { onConflict: 'email' });
  if (profileError) console.error('❌ profiles upsert error:', profileError.message);
  else console.log(`✅ Profile created for user ${userId}`);
}

// ═══════════════════════════════════════════════════════════════
// F6 — Donation Handling (Phase 6.0c — added 2026-05-07)
// ═══════════════════════════════════════════════════════════════
// See docs/F6-stripe-webhook-extension.ts for the standalone
// draft and docs/F6-stripe-webhook-splice-plan.md for splice
// rationale. Helpers reference module-level constants
// BREVO_API_KEY (line 7) and CORS (line 9), and take sb: any
// as per the existing convention (syncStatus, awardContestEntries).
// ═══════════════════════════════════════════════════════════════

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

async function routeDonationOrFallthrough(
  event: any,
  sb: any
): Promise<Response | null> {
  const purpose = extractDonationPurpose(event);
  if (purpose !== 'donation') return null;
  return await handleDonationEvent(event, sb);
}

function extractDonationPurpose(event: any): string | null {
  const obj = event.data?.object ?? {};

  // 1. Direct metadata on the event object (PaymentIntent, Charge).
  const direct = obj.metadata?.purpose;
  if (direct) return direct;

  // 2. Subscription-driven invoices. Stripe API 2026-02-25.clover
  //    relocated subscription_details from invoice.subscription_details
  //    to invoice.parent.subscription_details as part of the Invoice
  //    Payments model restructure. Read parent path first, fall back
  //    to legacy field for older API versions.
  if (typeof event.type === 'string' && event.type.startsWith('invoice.')) {
    const parentMeta = obj.parent?.subscription_details?.metadata;
    if (parentMeta?.purpose) return parentMeta.purpose;
    const legacyMeta = obj.subscription_details?.metadata;
    if (legacyMeta?.purpose) return legacyMeta.purpose;
  }

  // 3. customer.subscription.* events: metadata directly on the sub.
  if (typeof event.type === 'string' && event.type.startsWith('customer.subscription.')) {
    if (obj.metadata?.purpose) return obj.metadata.purpose;
  }

  return null;
}

async function handleDonationEvent(event: any, sb: any): Promise<Response> {
  const row = buildDonationRow(event);
  if (!row) {
    // Donation-tagged event we don't store as a row (e.g.
    // customer.subscription.created on a donation Subscription).
    // Acknowledge so Stripe doesn't retry.
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

    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const inv = event.data.object;
      // clover API: subscription_details moved to invoice.parent.
      // Read parent first, fall back to legacy for older API versions.
      const parentSubDetails = inv.parent?.subscription_details;
      const legacySubDetails = inv.subscription_details;
      const subMeta = parentSubDetails?.metadata
                   ?? legacySubDetails?.metadata
                   ?? {};
      const subId = parentSubDetails?.subscription
                 ?? inv.subscription
                 ?? legacySubDetails?.subscription
                 ?? null;
      return {
        user_id:                   subMeta.user_id ?? inv.metadata?.user_id ?? null,
        stripe_payment_intent_id:  inv.payment_intent ?? null,
        stripe_subscription_id:    subId,
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
      const parentSubDetails = inv.parent?.subscription_details;
      const legacySubDetails = inv.subscription_details;
      const subMeta = parentSubDetails?.metadata
                   ?? legacySubDetails?.metadata
                   ?? {};
      const subId = parentSubDetails?.subscription
                 ?? inv.subscription
                 ?? legacySubDetails?.subscription
                 ?? null;
      return {
        user_id:                   subMeta.user_id ?? null,
        stripe_payment_intent_id:  null,
        stripe_subscription_id:    subId,
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

// ── MAIN HANDLER ───────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST')   return new Response('Method not allowed', { status: 405 });

  const payload   = await req.text();
  const sigHeader = req.headers.get('stripe-signature') ?? '';

  const valid = await verifyStripeSignature(payload, sigHeader, WEBHOOK_SECRET);
  if (!valid) {
    console.error('❌ Invalid Stripe signature');
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(payload);
  console.log(`✅ Webhook received: ${event.type}`);

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // ── F6 SPLICE POINT 1: donation branch ──
    const donationResp = await routeDonationOrFallthrough(event, sb);
    if (donationResp) return donationResp;

    switch (event.type) {

      case 'checkout.session.completed': {
        const session     = event.data.object;
        const email       = session.customer_details?.email ?? session.customer_email;
        const custId      = session.customer;
        const mode        = session.mode;
        const referred_by = session.metadata?.referred_by ?? null;

        if (!email) { console.warn('⚠️ No email in checkout session'); break; }

        // ── SPONSOR PURCHASE (one-time payment for Sponsor a Family) ──
        if (mode === 'payment') {
          const lineItems = await stripeGet(`checkout/sessions/${session.id}/line_items?limit=5`);
          const sponsorItem = lineItems?.data?.find((item: any) => {
            const priceId = item.price?.id;
            return priceId && SPONSOR_PRICES[priceId] !== undefined;
          });

          if (sponsorItem) {
            await handleSponsorPurchase(sb, session, sponsorItem.price.id);
            console.log(`✅ Sponsor checkout complete for ${email}`);
            break;
          }
        }

        // ── REGULAR SUBSCRIPTION OR LIFETIME ──────────────────────────
        let plan = session.metadata?.plan ?? 'monthly';
        let current_period_end: number | null = null;
        let userId: string | null = null;

        if (mode === 'subscription' && session.subscription) {
          const sub = await stripeGet(`subscriptions/${session.subscription}`);
          current_period_end = sub.current_period_end ?? null;
          const priceId = sub.items?.data?.[0]?.price?.id;
          if (priceId && PRICES[priceId]) plan = PRICES[priceId];
        } else if (mode === 'payment') {
          plan = 'lifetime';
          current_period_end = null;
        }

        await provisionUser(sb, {
          email, custId, plan, plan_status: 'active', current_period_end, referred_by,
        });

        // Look up userId for contest entry (profile may have just been created above)
        const { data: newProfile } = await sb
          .from('profiles').select('user_id').eq('email', email).maybeSingle();
        userId = newProfile?.user_id ?? null;

        // ── AWARD PAID PLAN CONTEST ENTRIES (once per user, not per renewal) ──
        await handlePaidPlanEntries(sb, email, userId, plan, session.id);

        // ── TAG BREVO ──────────────────────────────────────────────────
        await tagBrevoContact({ email, activated: true, planType: 'paying', churned: false });

        // ── REFERRER BONUS ENTRIES ─────────────────────────────────────
        if (referred_by) {
          await awardReferrerEntries(sb, referred_by, email);
        }

        console.log(`✅ Checkout complete → provisioned ${email} on ${plan}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub      = event.data.object;
        const familyId = sub.metadata?.familyId;
        if (!familyId) { console.warn('No familyId in subscription metadata'); break; }

        await syncStatus(sb, {
          familyId, plan_status: 'cancelled',
          stripe_subscription_id: sub.id,
          current_period_end: sub.current_period_end ?? null,
        });

        const { data: family } = await sb
          .from('families').select('stripe_customer_id').eq('id', familyId).single();
        if (family?.stripe_customer_id) {
          const { data: profile } = await sb
            .from('profiles').select('email').eq('stripe_customer_id', family.stripe_customer_id).single();
          if (profile?.email) {
            await tagBrevoContact({ email: profile.email, churned: true, planType: 'free' });
          }
        }

        console.log(`✅ Subscription cancelled for family: ${familyId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const sub      = event.data.object;
        const familyId = sub.metadata?.familyId;
        if (!familyId) { console.warn('No familyId in subscription metadata'); break; }

        const statusMap: Record<string, string> = {
          active: 'active', past_due: 'past_due', unpaid: 'past_due',
          canceled: 'cancelled', incomplete: 'incomplete',
          incomplete_expired: 'cancelled', trialing: 'active', paused: 'paused',
        };
        const newStatus = statusMap[sub.status] ?? sub.status;
        const priceId   = sub.items?.data?.[0]?.price?.id;
        const newPlan   = priceId ? (PRICES[priceId] ?? 'monthly') : undefined;

        await syncStatus(sb, {
          familyId, plan_status: newStatus, plan: newPlan,
          current_period_end: sub.current_period_end ?? null,
        });

        console.log(`✅ Subscription updated for family: ${familyId} → ${newStatus}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const custId  = invoice.customer;
        // Stripe API ≥ 2024-04-10 (deployed endpoint runs 2026-02-25.clover):
        // invoice.subscription was relocated to invoice.parent.subscription_details.subscription
        // as part of the Invoice Payments model restructure. Read parent-first
        // and fall back to the legacy fields so older API versions still work.
        const subId = invoice.parent?.subscription_details?.subscription
                   ?? invoice.subscription
                   ?? invoice.subscription_details?.subscription
                   ?? null;
        let current_period_end: number | null = null;
        if (subId) {
          const sub = await stripeGet(`subscriptions/${subId}`);
          current_period_end = sub.current_period_end ?? null;
        }
        await syncStatus(sb, { custId, plan_status: 'past_due', current_period_end });
        console.log(`⚠️ Payment failed for customer: ${custId}`);
        break;
      }

      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const custId  = invoice.customer;
        // Parent-first subscription lookup (same rationale as invoice.payment_failed).
        const subId = invoice.parent?.subscription_details?.subscription
                   ?? invoice.subscription
                   ?? invoice.subscription_details?.subscription
                   ?? null;
        let current_period_end: number | null = null;
        if (subId) {
          const sub = await stripeGet(`subscriptions/${subId}`);
          current_period_end = sub.current_period_end ?? null;
        }
        await syncStatus(sb, {
          custId, plan_status: 'active',
          stripe_subscription_id: subId ?? null,
          current_period_end,
        });
        console.log(`✅ Payment succeeded for customer: ${custId}`);
        break;
      }

      case 'invoice_payment.paid': {
        // invoice_payment.paid fires alongside invoice.paid on the new
        // Invoice Payments model (Stripe API ≥ 2024-04-10). The payload
        // here is an InvoicePayment object — NOT an Invoice — so
        // `event.data.object.subscription` and `.customer` are NOT in
        // scope on the same fields. Resolve to the parent invoice via
        // stripeGet and then run the standard invoice.paid logic.
        //
        // syncStatus is idempotent — if invoice.paid fired first and
        // already set plan_status='active', this is a safe no-op.
        const ip = event.data.object;
        const invoiceId = typeof ip.invoice === 'string'
          ? ip.invoice
          : (ip.invoice?.id ?? null);
        if (!invoiceId) {
          console.warn('⚠️ invoice_payment.paid missing invoice id; ignored');
          break;
        }
        const invoice = await stripeGet(`invoices/${invoiceId}`);
        const custId  = invoice.customer;
        const subId   = invoice.parent?.subscription_details?.subscription
                     ?? invoice.subscription
                     ?? invoice.subscription_details?.subscription
                     ?? null;
        let current_period_end: number | null = null;
        if (subId) {
          const sub = await stripeGet(`subscriptions/${subId}`);
          current_period_end = sub.current_period_end ?? null;
        }
        await syncStatus(sb, {
          custId, plan_status: 'active',
          stripe_subscription_id: subId ?? null,
          current_period_end,
        });
        console.log(`✅ InvoicePayment paid for customer: ${custId} (via invoice ${invoiceId})`);
        break;
      }

      case 'payment_intent.succeeded': {
        const pi       = event.data.object;
        const familyId = pi.metadata?.familyId;
        const plan     = pi.metadata?.plan;
        if (!familyId || plan !== 'lifetime') break;
        await syncStatus(sb, {
          familyId, plan: 'lifetime', plan_status: 'active', current_period_end: null,
        });
        console.log(`✅ Lifetime payment confirmed for family: ${familyId}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('❌ Webhook handler error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});