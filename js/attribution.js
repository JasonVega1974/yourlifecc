// js/attribution.js — partner/UTM attribution capture.
//
// Included on every public landing page. If the URL carries any of
// utm_source / utm_medium / utm_campaign, the whole set is stored in
// sessionStorage (ylcc_utm_source / _medium / _campaign). sessionStorage
// survives same-tab navigation, so a visitor who lands on a partner page
// and then browses to register.html keeps their attribution; a later
// arrival WITH fresh UTMs overwrites the set (latest external click wins),
// while internal navigation without UTMs never clears it.
//
// Consumed by register.html's createAccount(), which forwards the values
// into the Stripe Checkout Session metadata via create-checkout-session.
//
// Purely additive: wrapped in try/catch so privacy modes that block
// storage can never break a page, and nothing downstream requires these
// values to exist.
(function () {
  try {
    var q = new URLSearchParams(window.location.search);
    var src = q.get('utm_source');
    var med = q.get('utm_medium');
    var cam = q.get('utm_campaign');
    if (src || med || cam) {
      var clean = function (v) { return (v || '').toString().trim().slice(0, 100); };
      sessionStorage.setItem('ylcc_utm_source',   clean(src));
      sessionStorage.setItem('ylcc_utm_medium',   clean(med));
      sessionStorage.setItem('ylcc_utm_campaign', clean(cam));
    }
  } catch (e) { /* storage unavailable — attribution silently skipped */ }
})();
