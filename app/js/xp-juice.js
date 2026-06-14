/* =============================================================
   xp-juice.js — WC-2c. The "juice" layer for the XP loop.

   Owns window.xpJuice(n, source, meta), called by awardXP (xp.js)
   AFTER the award commits. Shows ONE dedicated, enriched toast that
   reads the meta payload:
     - default            "+N XP"
     - meta.streakTicked  "+N XP" + "{newStreak}-day streak"
     - meta.goalMet       a bigger "Daily goal met!" flourish
   (goalMet takes precedence; a goalMet that also ticked still names
   the streak.)

   This is the screen-AGNOSTIC moment-of-earning signal: completions
   fire from feature tabs (chores/faith/goals/skills/health/habits)
   where the home ring/flame are not visible, so the toast is the only
   juice reliably seen at the instant XP is earned. The home-surface
   reinforcements (ring sweep, flame pulse, ring-green) live in
   command-center.js and fire on the next home render — NOT here.

   Reduced-motion: text/state preserved, motion removed. The toast
   appears/holds/clears without slide or flourish; goalMet becomes a
   static "Daily goal met" confirmation.

   Toast markup (#xpJuiceToast) + CSS live in app/index.html. This
   module only fills + shows it. Theme-independent overlay, like the
   app's existing #toast.
============================================================= */
(function(){
  'use strict';

  function _reducedMotion(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(_e){ return false; }
  }

  function _esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Brass flame — matches the app's streak language (cc-streak / kid cards)
  // without a raw emoji, in the brass-on-dark aesthetic.
  function _flameSvg(){
    return '<svg class="xpj-toast__flame" viewBox="0 0 24 24" aria-hidden="true">'
         + '<path d="M12 2c.6 3 3.4 4.3 3.4 7.9 0 1.5-.8 2.8-2 3.4.4-.9.2-2-.5-2.7.1 2-1.6 2.5-1.6 4.1 0 1.2.9 2.1 2 2.3C10.9 21.7 7.5 19.3 7.5 15c0-2.8 1.7-4.5 3.2-5.9C10.2 6.3 10.7 3.8 12 2z" fill="#FBBF24"/>'
         + '</svg>';
  }

  var _hideT = null;

  window.xpJuice = function(n, source, meta){
    if (typeof document === 'undefined') return;
    var el = document.getElementById('xpJuiceToast');
    if (!el) return;
    meta = meta || {};
    n = +n || 0;
    var reduced = _reducedMotion();
    var amt = '+' + n + ' XP';

    var variant, html;
    if (meta.goalMet){
      variant = 'goal';
      html = _flameSvg()
           + '<span class="xpj-toast__body">'
           +   '<span class="xpj-toast__title">Daily goal met!</span>'
           +   '<span class="xpj-toast__sub">' + _esc(amt)
           +     ((meta.streakTicked && meta.newStreak) ? ' &middot; ' + _esc(meta.newStreak) + '-day streak' : '')
           +   '</span>'
           + '</span>';
    } else if (meta.streakTicked && meta.newStreak){
      variant = 'streak';
      html = _flameSvg()
           + '<span class="xpj-toast__body">'
           +   '<span class="xpj-toast__title">' + _esc(amt) + '</span>'
           +   '<span class="xpj-toast__sub">' + _esc(meta.newStreak) + '-day streak</span>'
           + '</span>';
    } else {
      variant = 'xp';
      html = '<span class="xpj-toast__body">'
           +   '<span class="xpj-toast__title">' + _esc(amt) + '</span>'
           + '</span>';
    }

    el.innerHTML = html;
    el.className = 'xpj-toast xpj-toast--' + variant + (reduced ? ' xpj-toast--reduced' : '');
    el.setAttribute('aria-hidden', 'false');
    // Force reflow so a rapid second award re-triggers the entry transition.
    void el.offsetWidth;
    el.classList.add('show');

    if (_hideT) clearTimeout(_hideT);
    _hideT = setTimeout(function(){
      el.classList.remove('show');
      el.setAttribute('aria-hidden', 'true');
    }, meta.goalMet ? 3200 : 2200);
  };
})();
