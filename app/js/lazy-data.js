/* ═══════════════════════════════════════════════════════════════
   lazy-data.js — shared lazy data-module loader (WC-1b)
   ───────────────────────────────────────────────────────────────
   ylccEnsureData(globalName, src[, opts]) injects a heavy data
   <script> exactly once and returns a cached in-flight Promise that:
     • resolves when window[globalName] is defined (checked on load),
     • rejects (with console.warn) on network error,
     • rejects (with console.warn) on timeout (default 15s),
     • rejects (with console.warn) if the script loads but never
       defines the expected global.

   On any rejection the cache slot is cleared so a later call can
   retry. This mirrors the proven shape of the existing per-file
   _xxEnsureLoaded() loaders in faith.js / parent.js (single in-flight
   promise, createElement('script'), onload/onerror, append to head)
   and is the standard for NEW lazy work. The 9 shipped clones are
   intentionally left as-is — production-proven, not worth churning.

   Load order: this module loads in the deferred block BEFORE faith.js
   so window.ylccEnsureData exists by the time any faith.js consumer
   gate calls it.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // globalName -> in-flight/settled Promise. Cleared back to null on
  // failure so a retry can re-inject.
  var _cache = {};

  function ylccEnsureData(globalName, src, opts){
    opts = opts || {};
    var timeoutMs = (typeof opts.timeoutMs === 'number') ? opts.timeoutMs : 15000;

    // Already loaded (or eagerly present) — nothing to do.
    if(typeof window !== 'undefined' && typeof window[globalName] !== 'undefined'){
      return Promise.resolve();
    }
    // In-flight or previously resolved — share the same promise.
    if(_cache[globalName]) return _cache[globalName];

    _cache[globalName] = new Promise(function(resolve, reject){
      var settled = false;

      var timer = setTimeout(function(){
        if(settled) return;
        settled = true;
        _cache[globalName] = null;
        console.warn('[lazy-data] timed out loading ' + src + ' (' + globalName + ')');
        reject(new Error('lazy-data timeout: ' + globalName));
      }, timeoutMs);

      var s = document.createElement('script');
      s.src = src;
      s.onload = function(){
        if(settled) return;
        settled = true;
        clearTimeout(timer);
        if(typeof window[globalName] !== 'undefined'){
          resolve();
        } else {
          // Script executed but the expected global never appeared.
          _cache[globalName] = null;
          console.warn('[lazy-data] ' + src + ' loaded but ' + globalName + ' is undefined');
          reject(new Error('lazy-data missing global: ' + globalName));
        }
      };
      s.onerror = function(){
        if(settled) return;
        settled = true;
        clearTimeout(timer);
        _cache[globalName] = null;
        console.warn('[lazy-data] failed to load ' + src + ' (' + globalName + ')');
        reject(new Error('lazy-data load failed: ' + globalName));
      };
      document.head.appendChild(s);
    });

    return _cache[globalName];
  }

  if(typeof window !== 'undefined') window.ylccEnsureData = ylccEnsureData;
})();
