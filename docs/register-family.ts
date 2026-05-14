// docs/register-family.ts
// Supabase Edge Function: register-family
//
// Replaces the client-side INSERTs into `families` and `family_data` that
// fail RLS when Supabase email confirmation is on (the user has no session
// at the moment of insert). Uses service-role to bypass RLS, plus admin
// lookup to verify the userId in the request body is a real, freshly-
// created, unconfirmed user.
//
// Hybrid familyId model (Path B):
//   - If the request includes a familyId (paid flow already passed it to
//     create-payment-intent and sealed it into Stripe metadata), use it.
//   - If the request omits familyId (free / sponsored flows), the function
//     generates one server-side.
//
// Required Edge Function secrets:
//   - APP_SUPABASE_URL
//   - APP_SERVICE_KEY
//
// Deploy: paste into Supabase Dashboard → Edge Functions → register-family
// (or `supabase functions deploy register-family` via CLI). Set
// `verify_jwt = true` in the function's config — anon JWT is required as a
// baseline DDoS deterrent.
//
// Called from: register.html createAccount() (Phase 4)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('APP_SUPABASE_URL') ?? '';
const SERVICE_KEY  = Deno.env.get('APP_SERVICE_KEY') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const VALID_PLANS = new Set(['free', 'monthly', 'yearly', 'lifetime', 'sponsored']);
const MAX_AGE_MS  = 60_000; // user record must be < 60s old
const FAMILY_ID_RE = /^[a-z0-9]{12}$/;

// ── HELPERS ─────────────────────────────────────────────────────

function generateFamilyId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let id = '';
  for (let i = 0; i < 12; i++) id += chars[bytes[i] % chars.length];
  return id;
}

function getDefaultFamilyData(parentName: string, familyId: string) {
  return {
    name: parentName,
    familyId,
    streak: 0,
    mode: 'mid_hs',
    bank: 0,
    savings: 0,
    goals: [],
    bills: [],
    transactions: [],
    savingsGoals: [],
    assignments: [],
    classes: [],
    journal: [],
    habitLog: {},
    chorePin: '',
    onboardDone: false,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// ── MAIN HANDLER ────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const {
    userId,
    name,
    email,
    plan,
    familyId: clientFamilyId = null,
    stripeCustomerId = null,
    stripeSubscriptionId = null,
    sponsorCodeId = null,
    referredBy = null,
  } = body || {};

  // ── INPUT VALIDATION ──────────────────────────────────────────
  if (!userId || typeof userId !== 'string')             return jsonResponse({ error: 'userId required' }, 400);
  if (!name || typeof name !== 'string')                 return jsonResponse({ error: 'name required' }, 400);
  if (!email || typeof email !== 'string' || !email.includes('@')) return jsonResponse({ error: 'valid email required' }, 400);
  if (!plan || !VALID_PLANS.has(plan))                   return jsonResponse({ error: 'valid plan required' }, 400);
  if (name.length > 200)                                 return jsonResponse({ error: 'name too long' }, 400);
  if (email.length > 320)                                return jsonResponse({ error: 'email too long' }, 400);
  if (clientFamilyId !== null && !FAMILY_ID_RE.test(clientFamilyId)) {
    return jsonResponse({ error: 'familyId must be 12-char lowercase alphanumeric' }, 400);
  }

  const sb = createClient(SUPABASE_URL, SERVICE_KEY);

  // ── AUTH: user must be real, fresh, unconfirmed, email-matching ──
  const { data: userData, error: userErr } = await sb.auth.admin.getUserById(userId);
  if (userErr || !userData?.user) {
    console.error('❌ User lookup failed:', userErr?.message);
    return jsonResponse({ error: 'User not found' }, 401);
  }
  const user = userData.user;
  if (user.email_confirmed_at) {
    return jsonResponse({ error: 'Account already activated' }, 400);
  }
  const ageMs = Date.now() - new Date(user.created_at).getTime();
  if (ageMs > MAX_AGE_MS) {
    return jsonResponse({ error: 'Signup window expired; please sign up again' }, 400);
  }
  if ((user.email ?? '').toLowerCase() !== email.toLowerCase()) {
    return jsonResponse({ error: 'Email does not match user record' }, 401);
  }

  // ── IDEMPOTENCY: existing family for this user? ───────────────
  const { data: existing, error: existingErr } = await sb
    .from('families')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (existingErr) {
    console.error('❌ Existing-family lookup failed:', existingErr.message);
    return jsonResponse({ error: 'Database error during idempotency check' }, 500);
  }
  if (existing?.id) {
    console.log(`ℹ️ Family already exists for user ${userId}: ${existing.id}`);
    return jsonResponse({ ok: true, familyId: existing.id, alreadyExisted: true }, 200);
  }

  // ── FAMILY ID: client-provided (paid flow) or server-generated ──
  let familyId: string;
  if (clientFamilyId) {
    // Verify the client-supplied ID isn't already in use by some other user.
    const { data: collision, error: colErr } = await sb
      .from('families')
      .select('id')
      .eq('id', clientFamilyId)
      .maybeSingle();
    if (colErr) {
      console.error('❌ Family-id collision check failed:', colErr.message);
      return jsonResponse({ error: 'Database error during collision check' }, 500);
    }
    if (collision) {
      console.error(`❌ Family-id collision: ${clientFamilyId} already exists`);
      return jsonResponse({ error: 'Family ID already in use; please retry signup' }, 409);
    }
    familyId = clientFamilyId;
  } else {
    familyId = generateFamilyId();
  }

  // ── SPONSOR CODE: atomic CAS decrement ────────────────────────
  if (sponsorCodeId) {
    let reserved = false;
    for (let attempt = 0; attempt < 3 && !reserved; attempt++) {
      const { data: code, error: readErr } = await sb
        .from('sponsor_codes')
        .select('uses_remaining, active')
        .eq('id', sponsorCodeId)
        .maybeSingle();
      if (readErr || !code) {
        return jsonResponse({ error: 'Sponsor code not found' }, 400);
      }
      if (!code.active) {
        return jsonResponse({ error: 'Sponsor code is no longer active' }, 410);
      }
      if (code.uses_remaining <= 0) {
        return jsonResponse({ error: 'Sponsor code has reached its usage limit' }, 410);
      }
      const { data: updated, error: updateErr } = await sb
        .from('sponsor_codes')
        .update({ uses_remaining: code.uses_remaining - 1 })
        .eq('id', sponsorCodeId)
        .eq('uses_remaining', code.uses_remaining) // CAS guard
        .select('id')
        .maybeSingle();
      if (!updateErr && updated) {
        reserved = true;
        console.log(`✅ Sponsor code ${sponsorCodeId} reserved (${code.uses_remaining} → ${code.uses_remaining - 1})`);
      }
    }
    if (!reserved) {
      console.error('❌ Sponsor code reservation failed after 3 attempts (high contention)');
      return jsonResponse({ error: 'Sponsor code could not be reserved (please retry)' }, 503);
    }
  }

  // ── INSERTS ───────────────────────────────────────────────────
  const now = new Date().toISOString();

  const { error: familyErr } = await sb.from('families').insert({
    id: familyId,
    user_id: userId,
    parent_name: name,
    email,
    plan,
    plan_status: 'active',
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    sponsor_code_id: sponsorCodeId,
    referred_by: referredBy,
    created_at: now,
  });
  if (familyErr) {
    console.error('❌ families insert failed:', familyErr.message);
    return jsonResponse({ error: `Family creation failed: ${familyErr.message}` }, 500);
  }

  const { error: dataErr } = await sb.from('family_data').insert({
    family_id: familyId,
    data: JSON.stringify(getDefaultFamilyData(name, familyId)),
    updated_at: now,
  });
  if (dataErr) {
    console.error('❌ family_data insert failed:', dataErr.message);
    // Best-effort cleanup so the user can cleanly retry.
    await sb.from('families').delete().eq('id', familyId);
    return jsonResponse({ error: `Family data init failed: ${dataErr.message}` }, 500);
  }

  console.log(`✅ Family registered: user ${userId} → family ${familyId} (plan: ${plan})`);
  return jsonResponse({ ok: true, familyId }, 200);
});
