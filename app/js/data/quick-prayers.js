// ═════════════════════════════════════════════════════════════
// QUICK_PRAYERS loader
//
// Canonical dataset lives in /app/js/data/quick-prayers.json so the
// SAME source-of-truth is read by:
//   • the browser library renderer (app/js/quick-prayers.js)
//   • the /api/og edge OG-image endpoint (api/og.js)
//   • the /prayer/:id serverless landing page (api/prayer-share.js)
//
// This file is loaded synchronously via <script src>, so it can't
// block the script tag on a fetch. Instead it:
//   1. exposes window.QUICK_PRAYERS = [] eagerly (empty array, so
//      any consumer that runs before the fetch resolves still sees a
//      valid Array reference instead of undefined)
//   2. kicks off a fetch immediately on parse
//   3. when the JSON arrives, replaces window.QUICK_PRAYERS and
//      dispatches `quick-prayers:loaded` on the document so the
//      library renderer can refresh if it's already mounted
//
// Because user interaction (the Quick Prayer destination) is what
// actually opens the library, the fetch almost always resolves long
// before the renderer is invoked. The loaded event is the
// belt-and-suspenders refresh path for the racing case where someone
// opens the destination immediately on cold boot.
// ═════════════════════════════════════════════════════════════

(function () {
  if (typeof window === 'undefined') return;
  // Eager empty array — _data() in the renderer reads
  // (window.QUICK_PRAYERS || []) and is safe before fetch resolves.
  if (!Array.isArray(window.QUICK_PRAYERS)) window.QUICK_PRAYERS = [];

  var URL = '/app/js/data/quick-prayers.json';

  function dispatchLoaded(detail) {
    try {
      document.dispatchEvent(new CustomEvent('quick-prayers:loaded', { detail: detail }));
    } catch (_) {}
  }

  var ready = (typeof fetch === 'function')
    ? fetch(URL, { credentials: 'same-origin', cache: 'no-cache' })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (arr) {
          if (!Array.isArray(arr)) throw new Error('JSON not an array');
          window.QUICK_PRAYERS = arr;
          dispatchLoaded(arr);
          return arr;
        })
        .catch(function (err) {
          try { console.warn('[quick-prayers] dataset load failed:', err && err.message || err); } catch (_) {}
          // Keep the eager empty array — the library renders an empty
          // state rather than throwing.
          return window.QUICK_PRAYERS;
        })
    : Promise.resolve(window.QUICK_PRAYERS);

  // Expose the promise so any future caller can await readiness
  // explicitly (e.g. a deep-link route that needs a specific prayer).
  window.QUICK_PRAYERS_READY = ready;
})();
