// api/donate.js
// One-time donation Stripe Checkout Session.
//
// Returns the Stripe-hosted Checkout URL for the client to redirect to.
// metadata.purpose='donation' is attached to BOTH the Session and the
// underlying PaymentIntent — the F6 SPLICE POINT 1 webhook handler reads
// metadata.purpose off the event object (a PaymentIntent for the
// payment_intent.succeeded event) and routes the donation into the
// donations table without ever touching plan_status.
//
// Env vars (Vercel project settings):
//   STRIPE_SECRET_KEY — Stripe Live secret key (sk_live_...)
//
// Donation tier is Stripe-Product-free by design — no pre-existing
// `donation` Product needed. We use Checkout's inline price_data so
// the endpoint can issue any amount within the validated range.
//
// Debug: hitting GET /api/donate returns a small JSON payload with
// runtime version + env-var presence (NEVER the value). Use this from
// a browser to triage 500s without spending a Stripe call.

const https = require('https');

const MIN_CENTS = 100;     // $1.00
const MAX_CENTS = 100000;  // $1,000.00

// Manual form-encode — matches Stripe's expected wire shape exactly.
// Avoids relying on the URLSearchParams global, which is fine on Node
// 18+ but kept out of the hot path to remove a runtime variable.
function formEncode(pairs) {
  return pairs
    .map(p => encodeURIComponent(p[0]) + '=' + encodeURIComponent(p[1]))
    .join('&');
}

module.exports = async (req, res) => {
  try {
    // ── GET /api/donate — health/debug probe ──────────────────────
    // Reports runtime + whether the Stripe key is present (boolean
    // only — never the value). Helps triage 500s without burning a
    // Stripe call. Safe to leave on in production.
    if (req.method === 'GET') {
      return res.status(200).json({
        ok: true,
        runtime:        process.version,
        stripeKey:      Boolean(process.env.STRIPE_SECRET_KEY),
        stripeKeyKind:  (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_live_')
                          ? 'live'
                          : (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_')
                              ? 'test'
                              : 'unknown',
        method:         'donate.js v2 — defensive',
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vercel auto-parses application/json bodies into req.body. If a
    // caller sends raw text or no body, fall back to {} so the
    // validators below produce a clean 400 instead of a TypeError.
    const body = (req.body && typeof req.body === 'object') ? req.body : {};
    const amount    = parseInt(body.amount, 10);
    const currency  = (body.currency || 'usd').toString().toLowerCase();
    const returnUrl = (body.returnUrl || 'https://yourlifecc.com/faith.html').toString();

    if (!Number.isInteger(amount) || amount < MIN_CENTS || amount > MAX_CENTS) {
      return res.status(400).json({ error: 'Amount must be a whole number between ' + MIN_CENTS + ' and ' + MAX_CENTS + ' cents.' });
    }
    if (!/^[a-z]{3}$/.test(currency)) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }
    if (!/^https?:\/\//.test(returnUrl)) {
      return res.status(400).json({ error: 'Invalid returnUrl' });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.error('donate: STRIPE_SECRET_KEY missing from Vercel env');
      return res.status(500).json({
        error: 'STRIPE_SECRET_KEY not configured on the server. Set it in Vercel Project Settings → Environment Variables.',
      });
    }

    // Log key presence + kind (boolean / prefix only — never the value).
    // Shows up in Vercel logs to confirm env wiring on every call.
    console.log('donate: invoked — stripeKeyPresent=true, kind=' +
      (stripeKey.startsWith('sk_live_') ? 'live'
        : stripeKey.startsWith('sk_test_') ? 'test'
        : 'unknown') +
      ', amount=' + amount + ', currency=' + currency);

    // Mirror metadata on Session AND PaymentIntent. The webhook reads
    // metadata.purpose off the PaymentIntent for payment_intent.succeeded
    // events — payment_intent_data.metadata is the field that actually
    // drives the donation route in F6 SPLICE POINT 1.
    const payload = formEncode([
      ['mode',                                            'payment'],
      ['line_items[0][price_data][currency]',             currency],
      ['line_items[0][price_data][product_data][name]',   'Donation to YourLife CC / Kingdom Creatives LLC'],
      ['line_items[0][price_data][unit_amount]',          String(amount)],
      ['line_items[0][quantity]',                         '1'],
      ['metadata[purpose]',                               'donation'],
      ['payment_intent_data[metadata][purpose]',          'donation'],
      ['success_url',                                     returnUrl],
      ['cancel_url',                                      returnUrl],
    ]);

    return await new Promise(resolve => {
      const sReq = https.request({
        hostname: 'api.stripe.com',
        path:     '/v1/checkout/sessions',
        method:   'POST',
        headers: {
          'Content-Type':   'application/x-www-form-urlencoded',
          'Authorization':  'Bearer ' + stripeKey,
          'Content-Length': Buffer.byteLength(payload),
        },
      }, sRes => {
        let data = '';
        sRes.on('data', chunk => data += chunk);
        sRes.on('end', () => {
          let parsed = null;
          try { parsed = JSON.parse(data); } catch (e) { /* leave null */ }
          if (sRes.statusCode >= 200 && sRes.statusCode < 300 && parsed && parsed.url) {
            console.log('donate: Stripe session created — id=' + (parsed.id || '?'));
            res.status(200).json({ url: parsed.url });
          } else {
            const errMsg = (parsed && parsed.error && parsed.error.message)
              ? ('Stripe: ' + parsed.error.message)
              : ('Stripe HTTP ' + sRes.statusCode);
            console.error('donate: Stripe checkout failed — status=' + sRes.statusCode + ' body=' + data);
            res.status(502).json({ error: errMsg });
          }
          resolve();
        });
      });
      sReq.on('error', e => {
        console.error('donate: https request error:', e.message, e.stack);
        res.status(500).json({ error: 'Could not reach Stripe: ' + e.message });
        resolve();
      });
      sReq.write(payload);
      sReq.end();
    });

  } catch (e) {
    // Last-resort guard — any unhandled throw in the handler lands a
    // clear log line and a JSON 500 with the message. Without this,
    // Vercel renders a generic 500 with no diagnostic value.
    console.error('donate: unhandled exception:', e && e.message, e && e.stack);
    try {
      return res.status(500).json({
        error: 'Internal error in /api/donate: ' + (e && e.message ? e.message : 'unknown'),
      });
    } catch (e2) {
      // If even sending the response throws, log and bail.
      console.error('donate: response send failed:', e2 && e2.message);
    }
  }
};
