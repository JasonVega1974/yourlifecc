/* =============================================================
   sfx.js — WC-D2. Unified sound-effects layer.

   window.sfx = { correct, tryAgain, perfect, streak } — short, soft,
   distinct UI cues, OSCILLATOR-SYNTHESIZED (zero asset files, no fetch,
   no service-worker implications beyond shipping this module).

   ONE shared AudioContext for the whole app, unlocked once on the first
   user gesture (iOS/Safari start contexts 'suspended'). This is the single
   sound system: the WC-D1 exercise engine AND the Life-Skills quiz both
   route here, all gated by the one D.soundEnabled preference (which absorbs
   the retired D.skillsSound — see sync.js migration).

   Rules baked in:
     - Gated: every effect is a no-op unless D.soundEnabled is true.
     - Additive only: each effect rides on an existing VISUAL cue at its
       call site. Never the sole feedback; safe to drop on muted devices.
     - No preview: nothing here plays on load — first sound only follows a
       real user gesture (answer tap, settings toggle, or nudge "Turn on").
   ============================================================= */
(function(){
  'use strict';

  var _ctx = null;

  function _enabled(){
    try { return !!(window.D && window.D.soundEnabled); } catch(_e){ return false; }
  }
  function _ac(){
    if(_ctx) return _ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    try { _ctx = new AC(); } catch(_e){ _ctx = null; }
    return _ctx;
  }
  function _resume(ctx){
    if(ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function'){
      try { ctx.resume(); } catch(_e){}
    }
  }

  // First-gesture unlock. Resumes the (suspended) context inside a user
  // gesture so later effects can sound on iOS. Plays NOTHING. One-shot:
  // detaches itself after the first gesture.
  var _unlockEvents = ['pointerdown','touchstart','keydown','mousedown'];
  function _unlock(){
    _resume(_ac());
    _unlockEvents.forEach(function(ev){
      try { window.removeEventListener(ev, _unlock, true); } catch(_e){}
    });
  }
  function _installUnlock(){
    _unlockEvents.forEach(function(ev){
      try { window.addEventListener(ev, _unlock, true); } catch(_e){}
    });
  }

  // One oscillator tone, scheduled `when` seconds from now. Respects the
  // gate; defensively resumes the ctx (tones always fire during/after a
  // gesture, so this stays within the unlock policy).
  function _tone(freq, dur, type, peak, when){
    if(!_enabled()) return;
    var ctx = _ac(); if(!ctx) return;
    _resume(ctx);
    try {
      var t0  = ctx.currentTime + (when || 0);
      var osc = ctx.createOscillator();
      var g   = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      var p = (typeof peak === 'number') ? peak : 0.13;
      // Tiny attack ramp so notes don't click; exponential decay to ~silence.
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(p, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    } catch(_e){}
  }

  // ── Named effects ────────────────────────────────────────────
  // correct  — rising two-note "ding" (right answer / match)
  function correct(){
    _tone(880, 0.10, 'sine', 0.13, 0);
    _tone(1320, 0.12, 'sine', 0.13, 0.07);
  }
  // tryAgain — soft low "thud" (wrong answer; kind, not punishing)
  function tryAgain(){
    _tone(220, 0.18, 'triangle', 0.10, 0);
  }
  // perfect  — C-E-G arpeggio fanfare (perfect set complete)
  function perfect(){
    _tone(523, 0.16, 'triangle', 0.13, 0);
    _tone(659, 0.16, 'triangle', 0.13, 0.12);
    _tone(784, 0.26, 'triangle', 0.14, 0.24);
  }
  // streak   — bright blip on a genuine combo/milestone (rides the combo banner)
  function streak(){
    _tone(659, 0.09, 'square', 0.07, 0);
    _tone(988, 0.13, 'square', 0.08, 0.08);
  }

  if(typeof window !== 'undefined'){
    window.sfx = {
      correct: correct,
      tryAgain: tryAgain,
      perfect: perfect,
      streak: streak,
      unlock: _unlock,
      isEnabled: _enabled
    };
    if(typeof document !== 'undefined'){
      if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', _installUnlock);
      } else {
        _installUnlock();
      }
    }
  }
})();
