// supabase/functions/create-checkout-session/index.ts
// Supabase Edge Function: create-checkout-session
//
// Replaces the inline Stripe Elements flow (create-payment-intent +
// stripe.confirmCardPayment client-side) with a Stripe Checkout Session
// redirect. Returns the hosted checkout URL; register.html then does
// `window.location.href = url` to send the browser to Stripe.
//
// Why Checkout instead of Elements:
//   - 3-day free trial displays correctly with $0.00 due today
//   - Promotion codes apply with the real discount shown live
//   - Stripe handles card entry, 3DS, address collection, receipts
//   - One redirect instead of a multi-step inline form
//
// Required Edge Function secrets:
//   - STRIPE_SECRET_KEY       (sk_live_… or sk_test_…)
//   - APP_SUPABASE_URL        (for the optional auth.user existence check)
//   - APP_SERVICE_KEY         (same)
//
// Deploy:
//   supabase functions deploy create-checkout-session
// Set verify_jwt = true in the function config (anon JWT required as a
// baseline DDoS deterrent, same as register-family).
//
// Stripe webhook contract (verified against the deployed stripe-webhook
// function, May 2026): the checkout.session.completed branch reads
//   - session.customer_details.email / session.customer_email  (primary key)
//   - session.metadata.plan          (falls back to 'monthly')
//   - session.metadata.referred_by   (for the referrer-bonus contest entries)
// It calls provisionUser() which generates its own server-side family id
// via email lookup and ignores the metadata.familyId/userId/name fields
// we set below. Those three are forwarded for future-compat / audit only.
//
// Partner attribution (2026-07): the optional body.attribution object
// ({utmSource, utmMedium, utmCampaign, hearAbout, hearAboutDetail}) is
// sanitized and forwarded as session metadata (utm_source / utm_medium /
// utm_campaign / heard_about / heard_about_detail), mirrored onto
// subscription metadata (subscriptions) or PaymentIntent metadata
// (one-time payments) so the source is visible on the payment record in
// the Stripe dashboard. The webhook does not read these keys; they are
// dashboard/reporting data only, and absent entirely for unattributed
// buyers.
//
// Called from: register.html createAccount() — paid plans only.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=denonext';

const STRIPE_KEY    = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const SUPABASE_URL  = Deno.env.get('APP_SUPABASE_URL')  ?? '';
const SERVICE_KEY   = Deno.env.get('APP_SERVICE_KEY')   ?? '';

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Server-side price catalogue. Client never sees these IDs — kept here so a
// future price rotation only touches the Edge Function, not register.html.
const PRICE_IDS: Record<string, string> = {
  monthly:  'price_1T8TBg5KkDVrunQtqfmRyiSu',
  yearly:   'price_1T8TCE5KkDVrunQteJAl9fgx',
  lifetime: 'price_1T8TCY5KkDVrunQtBejbeCT2',
};

const SUBSCRIPTION_PLANS = new Set(['monthly', 'yearly']);
const VALID_PLANS = new Set(['monthly', 'yearly', 'lifetime']);
const FAMILY_ID_RE = /^[a-z0-9]{12}$/;

const SUCCESS_URL = 'https://yourlifecc.com/activate.html?session_id={CHECKOUT_SESSION_ID}';
const CANCEL_URL  = 'https://yourlifecc.com/register.html';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST')    return json({ error: 'Method not allowed' }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const {
    userId,
    name,
    email,
    plan,
    familyId,
    couponCode = null,
    referredBy = null,
    attribution = null,
  } = body || {};

  // ── Validate inputs ────────────────────────────────────────
  if (!userId || typeof userId !== 'string')
    return json({ error: 'Missing userId' }, 400);
  if (!email || typeof email !== 'string' || !email.includes('@'))
    return json({ error: 'Invalid email' }, 400);
  if (!plan || !VALID_PLANS.has(plan))
    return json({ error: 'Invalid plan' }, 400);
  if (!familyId || !FAMILY_ID_RE.test(familyId))
    return json({ error: 'Invalid familyId — expected 12 lowercase alphanumeric chars' }, 400);

  const priceId = PRICE_IDS[plan];
  if (!priceId) return json({ error: 'Price ID not configured for plan ' + plan }, 500);

  // ── Optional: confirm the userId is a real, recently-created auth user.
  // Same anti-replay check pattern as register-family. Soft-fail to allow
  // local/dev environments without service-role secrets — production
  // deployments set both APP_SUPABASE_URL and APP_SERVICE_KEY.
  if (SUPABASE_URL && SERVICE_KEY) {
    try {
      const sb = createClient(SUPABASE_URL, SERVICE_KEY);
      const { data: userRec, error: userErr } = await sb.auth.admin.getUserById(userId);
      if (userErr || !userRec?.user) {
        return json({ error: 'User not found' }, 404);
      }
      if (userRec.user.email && userRec.user.email.toLowerCase() !== String(email).toLowerCase()) {
        return json({ error: 'Email does not match userId' }, 403);
      }
    } catch (e) {
      console.warn('[create-checkout-session] auth lookup failed (continuing):', e);
    }
  }

  const isSubscription = SUBSCRIPTION_PLANS.has(plan);

  // ── Optional partner attribution → Stripe metadata ─────────
  // Strictly additive: never validated as a blocker, and a missing or
  // malformed attribution object degrades to zero extra metadata keys —
  // an unattributed buyer's session config is identical to pre-feature
  // output. Values are trimmed and length-capped (Stripe allows 500
  // chars/value; 100 is plenty for UTM tags and the backstop field).
  const attr: Record<string, unknown> =
    (attribution && typeof attribution === 'object') ? attribution as Record<string, unknown> : {};
  const cleanAttr = (v: unknown): string =>
    (typeof v === 'string') ? v.trim().slice(0, 100) : '';
  const attributionMeta: Record<string, string> = {};
  {
    const utmSource       = cleanAttr(attr.utmSource);
    const utmMedium       = cleanAttr(attr.utmMedium);
    const utmCampaign     = cleanAttr(attr.utmCampaign);
    const hearAbout       = cleanAttr(attr.hearAbout);
    const hearAboutDetail = cleanAttr(attr.hearAboutDetail);
    if (utmSource)       attributionMeta.utm_source         = utmSource;
    if (utmMedium)       attributionMeta.utm_medium         = utmMedium;
    if (utmCampaign)     attributionMeta.utm_campaign       = utmCampaign;
    if (hearAbout)       attributionMeta.heard_about        = hearAbout;
    if (hearAboutDetail) attributionMeta.heard_about_detail = hearAboutDetail;
  }

  // ── Build the Checkout Session config ──────────────────────
  const sessionConfig: any = {
    mode:           isSubscription ? 'subscription' : 'payment',
    line_items:     [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url:    SUCCESS_URL,
    cancel_url:     CANCEL_URL,
    metadata: {
      // Read by the webhook today: plan, referred_by.
      // Forwarded for future-compat / audit only: familyId, userId, name.
      // attributionMeta: utm_source / utm_medium / utm_campaign /
      // heard_about / heard_about_detail — dashboard-visible source data;
      // present only when the buyer arrived with attribution.
      plan,
      referred_by: (typeof referredBy === 'string' && referredBy.trim()) ? referredBy.trim() : '',
      familyId,
      userId,
      name: name || '',
      ...attributionMeta,
    },
  };

  // Subscriptions get the 3-day free trial. The trial means $0.00 due
  // today; Stripe shows that on the checkout page so the user sees the
  // honest amount instead of $9.99 with confusion.
  if (isSubscription) {
    sessionConfig.subscription_data = {
      trial_period_days: 3,
      metadata: {
        familyId,
        plan,
        userId,
        referred_by: (typeof referredBy === 'string' && referredBy.trim()) ? referredBy.trim() : '',
        ...attributionMeta,
      },
    };
  } else {
    // One-time (lifetime) purchases: mirror attribution onto the
    // PaymentIntent so the source shows on the payment record itself in
    // the Stripe dashboard — same Session+PaymentIntent mirroring pattern
    // as api/donate.js. Metadata only; no payment behavior changes.
    if (Object.keys(attributionMeta).length > 0) {
      sessionConfig.payment_intent_data = {
        metadata: { plan, familyId, ...attributionMeta },
      };
    }
  }

  // ── Coupon / promotion code handling ──────────────────────
  // Three resolution paths in order of likelihood:
  //   1. Stripe Promotion Code (user-facing wrapper) — look up by code
  //   2. Stripe Coupon (legacy / direct ID) — look up by ID
  //   3. Unknown — fall back to `allow_promotion_codes:true` so the user
  //      can still type the code on Stripe's page (handles TEST99-style
  //      archived coupons gracefully without crashing the session).
  if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
    const code = couponCode.trim();
    let resolved = false;
    try {
      const promos = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
      if (promos.data.length > 0) {
        sessionConfig.discounts = [{ promotion_code: promos.data[0].id }];
        resolved = true;
      }
    } catch (e) {
      console.warn('[create-checkout-session] promotionCodes.list failed:', e);
    }
    if (!resolved) {
      try {
        const coupon = await stripe.coupons.retrieve(code);
        if (coupon && coupon.valid) {
          sessionConfig.discounts = [{ coupon: coupon.id }];
          resolved = true;
        }
      } catch (e) {
        // Coupon not found / archived / invalid — that's fine, fall through.
      }
    }
    if (!resolved) {
      // Don't error. Let the user type the code on Stripe's page so
      // archived codes (like TEST99) surface a clean error there.
      sessionConfig.allow_promotion_codes = true;
    }
    // Note: Stripe forbids combining `discounts` and `allow_promotion_codes`.
    // We set whichever is appropriate above; never both.
  } else {
    sessionConfig.allow_promotion_codes = true;
  }

  // ── Create the session ────────────────────────────────────
  try {
    const session = await stripe.checkout.sessions.create(sessionConfig);
    if (!session?.url) {
      return json({ error: 'Stripe did not return a checkout URL' }, 500);
    }
    return json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error('[create-checkout-session] Stripe error:', err?.message || err);
    // Surface a readable message — the client throws this into a toast.
    const msg = err?.raw?.message
      || err?.message
      || 'Stripe checkout setup failed. Please try again.';
    return json({ error: msg }, 502);
  }
});
