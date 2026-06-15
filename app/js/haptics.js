/* =============================================================
   haptics.js — WC-D3. Gentle vibration feedback layer.

   window.haptics = { correct, wrong, perfect, streak } — mirrors the
   sfx.js sound layer, firing at the SAME correct / wrong / perfect /
   combo moments (exercise engine + Life-Skills quiz). Additive only:
   every buzz rides an existing visual cue (+ optional sound) and is
   never the sole signal.

   Support (re-verified June 2026): navigator.vibrate is implemented on
   Android-Chromium; iOS Safari and Firefox 129+ do NOT support it. We
   feature-detect 'vibrate' in navigator ONCE and no-op cleanly
   everywhere else — no errors, no try/catch spam. The Settings →
   Feedback → Vibration row is hidden where unsupported (openSettings()
   in ui.js), so this is never a dead toggle.

   A native-shell haptics path (e.g. Capacitor / iOS Taptic in a future
   wrapped app) is intentionally OUT OF SCOPE here — future-only.

   Gate: D.hapticsEnabled (default true; persisted). Double-guarded —
   the API must exist AND the pref must be on.
   ============================================================= */
(function(){
  'use strict';

  // Feature-detect once. On unsupported browsers every effect is a no-op.
  var _supported = (typeof navigator !== 'undefined') && ('vibrate' in navigator);

  function _enabled(){
    return _supported && !!(window.D && window.D.hapticsEnabled);
  }
  // Single entry point. `pattern` is a number (ms) or an array of
  // on/off/on… durations. Guarded by _supported, so navigator.vibrate is
  // only ever called where it exists — and per spec it doesn't throw there.
  function _buzz(pattern){
    if(!_enabled()) return;
    navigator.vibrate(pattern);
  }

  // ── Named effects (mirror the sfx names) ─────────────────────
  // correct — one tiny tick
  function correct(){ _buzz(12); }
  // wrong — a gentle, non-punitive soft double (never a long harsh buzz)
  function wrong(){ _buzz([18, 40, 18]); }
  // perfect — a short celebratory triple (perfect set complete)
  function perfect(){ _buzz([14, 30, 14, 30, 26]); }
  // streak — brief milestone triple (rides a genuine combo)
  function streak(){ _buzz([10, 26, 10, 26, 18]); }

  if(typeof window !== 'undefined'){
    window.haptics = {
      correct: correct,
      wrong: wrong,
      perfect: perfect,
      streak: streak,
      isSupported: function(){ return _supported; },
      isEnabled: _enabled
    };
  }
})();
