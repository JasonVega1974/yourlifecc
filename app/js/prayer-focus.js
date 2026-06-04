/* =============================================================
   prayer-focus.js — "Pray this" focus mode.

   Calm, full-screen, distraction-free overlay for praying a single
   prayer slowly. Built as a SHARED component so future features
   (Heart Check, Daily Devotional, etc.) can reuse it through the
   same openPrayerFocus({...}) call.

   Public surface (window):
     openPrayerFocus({ title, text, verse, trait, traitAmount,
                       onAmen, onClose })
     closePrayerFocus()

   Visual language: reuses the Well palette via --p / --bg / --tx
   tokens + color-mix tints, plus a faint diagonal light shaft and
   a subtle cross silhouette behind the text. NOT the heavy Well
   canvas animation — pure CSS so it stays cheap on phones.

   Dismiss paths:
     • Tap the X (top-right)
     • Tap the dim backdrop
     • Press Esc
     • Swipe down ≥ 80px

   "Amen" path:
     • Plays prayerDove from the button (gentle celebration)
     • Awards opts.trait (default 'faith') by opts.traitAmount
       (default 3) through the existing awardTrait API
     • Closes the overlay
     • Calls opts.onAmen() if supplied

   Accessibility:
     • prefers-reduced-motion → no entrance, no breathing glow
     • Focus trap between [X] and [Amen]
     • Esc closes; high-contrast text
============================================================= */

(function (root) {
  'use strict';

  var OVERLAY_ID = 'prayerFocusOverlay';
  var STYLE_ID   = 'prayerFocusStyles';
  var _state = {
    open: false,
    opts: null,
    prevActive: null,
    keyHandler: null,
    touchStartY: null,
    touchStartT: 0
  };

  function _reducedMotion() {
    if (typeof root.matchMedia !== 'function') return false;
    try { return root.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (_) { return false; }
  }

  function _esc(s) {
    if (typeof escapeHtml === 'function') return escapeHtml(String(s || ''));
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function _ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = ''
      // Overlay shell — soft Well-aligned gradient + faint light shaft +
      // a low-opacity cross silhouette. All decorative layers are
      // pointer-events:none so the backdrop click still dismisses.
      + '#prayerFocusOverlay{'
      +   'position:fixed;inset:0;z-index:100070;display:none;'
      +   'background:radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--p) 22%, transparent) 0%, transparent 55%),'
      +   ' linear-gradient(180deg, #0b0a1f 0%, #0a0d1a 60%, #07070f 100%);'
      +   'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);'
      +   'align-items:center;justify-content:center;padding:1.2rem;'
      +   'opacity:0;transition:opacity .35s ease;'
      + '}'
      + '#prayerFocusOverlay.open{display:flex;opacity:1;}'
      + '#prayerFocusOverlay::before{'
      +   'content:"";position:absolute;inset:0;pointer-events:none;'
      +   'background:linear-gradient(135deg, transparent 30%, color-mix(in srgb, var(--p) 14%, transparent) 50%, transparent 70%);'
      +   'mix-blend-mode:screen;opacity:.55;'
      + '}'
      + '#prayerFocusOverlay::after{'
      +   'content:"";position:absolute;left:50%;top:50%;'
      +   'width:min(60vmin,520px);height:min(60vmin,520px);'
      +   'transform:translate(-50%,-50%);pointer-events:none;'
      +   'background:radial-gradient(closest-side, color-mix(in srgb, var(--p) 18%, transparent) 0%, transparent 70%);'
      +   'animation:pfBreathe 4.8s ease-in-out infinite;'
      + '}'
      + '@keyframes pfBreathe{'
      +   '0%,100%{transform:translate(-50%,-50%) scale(.92);opacity:.55;}'
      +   '50%   {transform:translate(-50%,-50%) scale(1.08);opacity:.85;}'
      + '}'
      // Card — semantic content wrapper. Sits above the decorative ::before
      // and ::after via z-index: 2.
      + '.pf-card{'
      +   'position:relative;z-index:2;'
      +   'width:100%;max-width:32rem;'
      +   'display:flex;flex-direction:column;align-items:center;text-align:center;'
      +   'color:#f5f3ff;'
      +   'animation:pfTextIn .9s cubic-bezier(.2,.7,.2,1) both;'
      // Longer prayers must scroll inside the overlay on small phones
      // rather than spill behind the close button or the swipe hint.
      // The 3.2rem top / 2.6rem bottom padding reserves visual room
      // for the close X (top-right) and the dismiss hint (bottom).
      +   'max-height:calc(100vh - 2.4rem);overflow-y:auto;'
      +   'padding:3.2rem 1rem 2.6rem;'
      +   '-webkit-overflow-scrolling:touch;'
      +   'scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent;'
      + '}'
      + '.pf-card::-webkit-scrollbar{width:6px;}'
      + '.pf-card::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:3px;}'
      + '@keyframes pfTextIn{'
      +   'from{opacity:0;transform:translateY(14px) scale(.985);}'
      +   'to  {opacity:1;transform:none;}'
      + '}'
      + '.pf-title{'
      +   'font-family:var(--fm);'
      +   'font-size:.66rem;font-weight:800;letter-spacing:.32em;text-transform:uppercase;'
      +   'color:color-mix(in srgb, var(--p) 60%, #f5f3ff);'
      +   'opacity:.85;margin:0 0 1.6rem;'
      + '}'
      + '.pf-text{'
      +   'font-family:Georgia,"Times New Roman",serif;font-style:italic;'
      +   'font-size:clamp(1.05rem, 2.6vw, 1.45rem);line-height:1.85;font-weight:400;'
      +   'color:#fdfcff;margin:0;'
      +   'text-shadow:0 0 24px color-mix(in srgb, var(--p) 22%, transparent);'
      + '}'
      + '.pf-verse{'
      +   'font-family:"Bebas Neue",var(--fm);'
      +   'font-size:.95rem;letter-spacing:.18em;font-weight:700;'
      +   'color:color-mix(in srgb, var(--p) 75%, #fbbf24);'
      +   'opacity:.85;margin:2.2rem 0 0;'
      + '}'
      // Close X — top-right, big enough for touch (44×44 target).
      + '.pf-close{'
      +   'position:absolute;top:1rem;right:1rem;z-index:3;'
      +   'width:44px;height:44px;border-radius:50%;'
      +   'background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);'
      +   'color:#f5f3ff;font-size:1rem;font-weight:800;cursor:pointer;'
      +   'display:flex;align-items:center;justify-content:center;font-family:var(--fm);'
      +   'transition:background .15s,border-color .15s;'
      + '}'
      + '.pf-close:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.32);}'
      // Amen — primary action at bottom of card.
      + '.pf-amen{'
      +   'margin-top:2.2rem;'
      +   'background:linear-gradient(135deg, color-mix(in srgb, var(--p) 80%, #7c3aed), color-mix(in srgb, var(--p) 50%, #a78bfa));'
      +   'color:#0b0a1f;border:none;border-radius:99px;'
      +   'padding:.95rem 2.4rem;font-family:var(--fh,var(--fm));'
      +   'font-size:1rem;font-weight:900;letter-spacing:.18em;cursor:pointer;'
      +   'box-shadow:0 14px 38px color-mix(in srgb, var(--p) 40%, transparent), 0 0 0 1px rgba(255,255,255,.18) inset;'
      +   'transition:transform .15s, box-shadow .2s;'
      + '}'
      + '.pf-amen:hover{transform:translateY(-2px);box-shadow:0 18px 46px color-mix(in srgb, var(--p) 50%, transparent), 0 0 0 1px rgba(255,255,255,.22) inset;}'
      + '.pf-amen:focus-visible,.pf-close:focus-visible{outline:2px solid #fbbf24;outline-offset:3px;}'
      // Dismiss hint — small bottom-of-screen note teaching the swipe.
      + '.pf-hint{'
      +   'position:absolute;bottom:1rem;left:0;right:0;text-align:center;'
      +   'font-family:var(--fm);font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;'
      +   'color:rgba(245,243,255,.42);pointer-events:none;'
      + '}'
      // prefers-reduced-motion — kill the breathing glow and entrance.
      + '@media (prefers-reduced-motion: reduce){'
      +   '#prayerFocusOverlay{transition:none;}'
      +   '#prayerFocusOverlay::after{animation:none;}'
      +   '.pf-card{animation:none;}'
      +   '.pf-text{text-shadow:none;}'
      + '}';
    var tag = document.createElement('style');
    tag.id = STYLE_ID;
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function _ensureOverlay() {
    var ov = document.getElementById(OVERLAY_ID);
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = OVERLAY_ID;
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-labelledby', 'pfTitle');
    ov.innerHTML = ''
      + '<button type="button" class="pf-close" aria-label="Close prayer">✕</button>'
      + '<div class="pf-card">'
      +   '<div class="pf-title" id="pfTitle"></div>'
      +   '<p class="pf-text" id="pfText"></p>'
      +   '<div class="pf-verse" id="pfVerse"></div>'
      +   '<button type="button" class="pf-amen" id="pfAmen">AMEN</button>'
      + '</div>'
      + '<div class="pf-hint">Swipe down or tap outside to close</div>';
    document.body.appendChild(ov);
    // Backdrop click — only when the actual overlay (not the card or
    // its children) receives the click.
    ov.addEventListener('click', function (e) { if (e.target === ov) closePrayerFocus(); });
    ov.querySelector('.pf-close').addEventListener('click', closePrayerFocus);
    ov.querySelector('#pfAmen').addEventListener('click', _onAmen);
    // Swipe-down to dismiss.
    ov.addEventListener('touchstart', _onTouchStart, { passive: true });
    ov.addEventListener('touchend', _onTouchEnd, { passive: true });
    return ov;
  }

  function _onTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    _state.touchStartY = e.touches[0].clientY;
    _state.touchStartT = Date.now();
  }

  function _onTouchEnd(e) {
    if (_state.touchStartY == null) return;
    var endY = (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY) || _state.touchStartY;
    var dy = endY - _state.touchStartY;
    var dt = Date.now() - _state.touchStartT;
    _state.touchStartY = null;
    if (dy >= 80 && dt < 800) closePrayerFocus();
  }

  // Focus-trap loop limited to the two interactive controls.
  function _focusTrap(e) {
    if (!_state.open) return;
    if (e.key === 'Escape') { e.preventDefault(); closePrayerFocus(); return; }
    if (e.key !== 'Tab') return;
    var ov = document.getElementById(OVERLAY_ID);
    if (!ov) return;
    var x = ov.querySelector('.pf-close');
    var a = ov.querySelector('#pfAmen');
    if (!x || !a) return;
    var active = document.activeElement;
    if (e.shiftKey) {
      if (active === x || !ov.contains(active)) { e.preventDefault(); a.focus(); }
    } else {
      if (active === a || !ov.contains(active)) { e.preventDefault(); x.focus(); }
    }
  }

  function _onAmen() {
    var opts = _state.opts || {};
    var trait = opts.trait || 'faith';
    var amount = (typeof opts.traitAmount === 'number' && opts.traitAmount > 0) ? opts.traitAmount : 3;
    var ov = document.getElementById(OVERLAY_ID);
    var amen = ov && ov.querySelector('#pfAmen');
    // Gentle celebration — the prayer dove floats up from the button.
    if (typeof root.prayerDove === 'function') {
      try { root.prayerDove(amen); } catch (_) {}
    }
    // Trait progress — defensive: only attempt if the API is loaded.
    if (typeof root.awardTrait === 'function') {
      try { root.awardTrait(trait, amount); } catch (_) {}
    }
    // Light delay so the dove takes off before the overlay dissolves.
    setTimeout(function () {
      closePrayerFocus();
      if (typeof opts.onAmen === 'function') {
        try { opts.onAmen(); } catch (_) {}
      }
    }, 220);
  }

  function openPrayerFocus(opts) {
    if (typeof document === 'undefined') return;
    opts = opts || {};
    _ensureStyles();
    var ov = _ensureOverlay();
    _state.opts = opts;
    _state.prevActive = document.activeElement;

    var titleEl = ov.querySelector('#pfTitle');
    var textEl  = ov.querySelector('#pfText');
    var verseEl = ov.querySelector('#pfVerse');
    if (titleEl) titleEl.textContent = String(opts.title || 'Pray this');
    if (textEl)  textEl.textContent  = String(opts.text  || '');
    if (verseEl) {
      var v = String(opts.verse || '').trim();
      verseEl.textContent = v;
      verseEl.style.display = v ? '' : 'none';
    }

    ov.classList.add('open');
    document.body.classList.add('modal-open');
    _state.open = true;

    // Keyboard handling — Esc + Tab trap.
    _state.keyHandler = _focusTrap;
    document.addEventListener('keydown', _state.keyHandler);

    // Focus the primary action so screen readers + keyboard users land
    // on Amen by default — the calmest path for someone who just wants
    // to pray and close.
    setTimeout(function () {
      var a = ov.querySelector('#pfAmen');
      if (a && typeof a.focus === 'function') a.focus({ preventScroll: true });
    }, 60);
  }

  function closePrayerFocus() {
    var ov = document.getElementById(OVERLAY_ID);
    if (!ov) return;
    ov.classList.remove('open');
    // Don't strip modal-open if another modal is still open (Proof,
    // Night Reflection, Quick Prayer overlay, etc. all share the class).
    if (!document.querySelector('.mo.open, #ppModal.open, #ppConvinceModal.open, #quickPrayerOverlay.open, #nightReflectOverlay.open')) {
      document.body.classList.remove('modal-open');
    }
    if (_state.keyHandler) {
      document.removeEventListener('keydown', _state.keyHandler);
      _state.keyHandler = null;
    }
    var opts = _state.opts;
    _state.open = false;
    _state.opts = null;
    if (_state.prevActive && typeof _state.prevActive.focus === 'function') {
      try { _state.prevActive.focus({ preventScroll: true }); } catch (_) {}
    }
    _state.prevActive = null;
    if (opts && typeof opts.onClose === 'function') {
      try { opts.onClose(); } catch (_) {}
    }
  }

  root.openPrayerFocus  = openPrayerFocus;
  root.closePrayerFocus = closePrayerFocus;
})(typeof window !== 'undefined' ? window : globalThis);
