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

const https = require('https');

const MIN_CENTS = 100;     // $1.00
const MAX_CENTS = 100000;  // $1,000.00

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
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
    console.error('donate: STRIPE_SECRET_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Stripe expects application/x-www-form-urlencoded. URLSearchParams
  // is a Node global since v10 — no import needed.
  const params = new URLSearchParams();
  params.append('mode', 'payment');
  params.append('line_items[0][price_data][currency]',           currency);
  params.append('line_items[0][price_data][product_data][name]', 'Donation to YourLife CC / Kingdom Creatives LLC');
  params.append('line_items[0][price_data][unit_amount]',        String(amount));
  params.append('line_items[0][quantity]',                       '1');
  // Mirror metadata on both surfaces. The webhook fires
  // payment_intent.succeeded for one-time payments, and the F6 splice
  // reads metadata.purpose off the PaymentIntent event object —
  // payment_intent_data.metadata is the field that actually drives the
  // donation route. Session-level metadata is also included for
  // checkout.session.completed observability.
  params.append('metadata[purpose]',                          'donation');
  params.append('payment_intent_data[metadata][purpose]',     'donation');
  params.append('success_url', returnUrl);
  params.append('cancel_url',  returnUrl);

  const payload = params.toString();

  return new Promise(resolve => {
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
        try { parsed = JSON.parse(data); } catch (e) {}
        if (sRes.statusCode >= 200 && sRes.statusCode < 300 && parsed && parsed.url) {
          res.status(200).json({ url: parsed.url });
        } else {
          const errMsg = (parsed && parsed.error && parsed.error.message) || ('Stripe ' + sRes.statusCode);
          console.error('donate: Stripe checkout failed:', sRes.statusCode, data);
          res.status(502).json({ error: errMsg });
        }
        resolve();
      });
    });
    sReq.on('error', e => {
      console.error('donate: request error:', e.message);
      res.status(500).json({ error: 'Could not reach Stripe' });
      resolve();
    });
    sReq.write(payload);
    sReq.end();
  });
};
