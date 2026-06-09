/* =============================================================
   parent-watch-scene.js
   The Watch — W1 (canvas mount + clock-locked sky cycle)
   2026-06-08

   Paints the cinematic sky for the Parent Celestial Home
   ("The Watch"). W1 is intentionally scoped: only the sky cycle.
   W2-W6 layer stars, comets, clouds, foreground porch / house /
   tree, fireflies, and diegetic content on top of this canvas.

   COEXISTENCE
     Canvas mounts as the first paint layer inside
     #parentCelestialHome (z-index 0). Phase 4's existing SVG
     widget + content tiles stay at z-index 1 and paint on top
     unchanged. The Watch builds up from here without breaking
     the running Parent Hub home — W5 will swap the Phase 4
     content blocks for the diegetic windows + lanterns.

   ESCAPE HATCH
     Either signal forces the canvas to stay hidden + the RAF
     loop never to start:
       • URL: ?ylcc_classic_phc=1
       • localStorage.ylcc_classic_phc === '1'
     Cheap fallback for the entire W1-W6 build window in case a
     phase mid-deploy looks wrong.

   CLOCK-LOCKED SKY
     The sky color is computed from local time-of-day, not from
     elapsed seconds. Opening shot at 7:30pm is genuinely dusk;
     at 11pm it is night; at 6am it is dawn. Sky shifts in real
     time as local clock advances. A subtle 90s breath modulates
     brightness +/- 2.5% so a parent watching for 60 seconds
     perceives gentle motion in addition to the slow time-of-day
     drift.

   LIFECYCLE
     • Mount triggered by renderParentCelestialHome() — the hook
       lives in parent-celestial.js and fires whenever the
       parent enters Parent Hub home. Mount itself is idempotent
       (guarded by _state.canvas), so repeated calls are safe.
     • RAF loop runs only when BOTH:
         - host has offsetParent !== null (visible in layout)
         - document.visibilityState === 'visible' (tab focused)
     • IntersectionObserver wakes/sleeps on host visibility.
     • visibilitychange wakes/sleeps on tab focus.
     • ResizeObserver on the host keeps canvas dims in sync,
       debounced 120ms.
     • DPR-aware: backing-store width/height scale with
       devicePixelRatio (clamped to 2 for perf); CSS pixels
       drive the rendered size.
     • prefers-reduced-motion: paint once for current time of
       day, skip RAF entirely.
============================================================= */

(function(){
  'use strict';

  // ── Escape hatch ──────────────────────────────────────────
  function _pwsClassicMode(){
    try {
      if (typeof location !== 'undefined'
          && location.search
          && location.search.indexOf('ylcc_classic_phc=1') !== -1) return true;
      if (typeof localStorage !== 'undefined'
          && localStorage.getItem('ylcc_classic_phc') === '1') return true;
    } catch(_e){}
    return false;
  }

  function _pwsReducedMotion(){
    try {
      return !!(window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch(_e){ return false; }
  }

  // ── Sky palette ───────────────────────────────────────────
  // 9 keyframes across the 24-hour cycle. Each carries a zenith
  // color (canvas top) and a horizon color (canvas bottom).
  // Interpolation finds the two bracketing keyframes for the
  // current decimal hour and lerps RGB channels with smoothstep
  // easing so transitions don't have hard inflection points at
  // the keyframe times. The cycle wraps cleanly: the last
  // keyframe (twilight purple, hour 21.5) lerps into the first
  // (midnight indigo, hour 0/24).
  const SKY_KEYFRAMES = [
    { h:  0.0, zenith:[  5,   8,  30], horizon:[ 14,  18,  40] }, // midnight indigo
    { h:  3.5, zenith:[  4,   6,  26], horizon:[ 10,  15,  34] }, // deepest night
    { h:  5.5, zenith:[ 15,  18,  64], horizon:[ 75,  29,  58] }, // pre-dawn rose
    { h:  7.5, zenith:[ 65, 120, 196], horizon:[232, 147,  72] }, // dawn / sunrise
    { h: 10.0, zenith:[ 91, 162, 232], horizon:[176, 204, 232] }, // morning blue
    { h: 13.0, zenith:[ 74, 143, 216], horizon:[171, 197, 222] }, // noon bright
    { h: 17.0, zenith:[ 80, 133, 200], horizon:[181, 160, 145] }, // afternoon warm
    { h: 19.0, zenith:[ 37,  49, 107], horizon:[212,  99,  61] }, // sunset coral
    { h: 21.5, zenith:[ 26,  31,  68], horizon:[111,  43,  69] }  // twilight purple
  ];

  function _pwsCurrentHour(){
    const d = new Date();
    return d.getHours() + d.getMinutes()/60 + d.getSeconds()/3600;
  }

  // Find bracketing keyframes for an hour value in [0, 24).
  // Wraps midnight: between hour 21.5 and 24.0 we lerp from the
  // last keyframe (21.5) toward the first keyframe (0.0) treated
  // as hour 24.0. Before hour 0.0 (impossible with a clock but
  // guarded for safety) we lerp from 21.5 - 24 = -2.5 forward.
  function _pwsSkyColors(hour){
    const kf = SKY_KEYFRAMES;
    let prev = kf[kf.length - 1];
    let next = kf[0];
    let prevH = prev.h - 24;
    let nextH = next.h;
    for (let i = 0; i < kf.length; i++) {
      if (kf[i].h <= hour) {
        prev  = kf[i];
        prevH = kf[i].h;
        const ni = (i + 1) % kf.length;
        next  = kf[ni];
        nextH = (i + 1 < kf.length) ? kf[i + 1].h : kf[0].h + 24;
      }
    }
    const span = nextH - prevH;
    let a = span > 0 ? (hour - prevH) / span : 0;
    if (a < 0) a = 0; else if (a > 1) a = 1;
    a = a * a * (3 - 2 * a); // smoothstep
    const lerp = function(c1, c2){
      return [
        c1[0] + (c2[0] - c1[0]) * a,
        c1[1] + (c2[1] - c1[1]) * a,
        c1[2] + (c2[2] - c1[2]) * a
      ];
    };
    return {
      zenith:  lerp(prev.zenith,  next.zenith),
      horizon: lerp(prev.horizon, next.horizon)
    };
  }

  // Subtle 90s sinusoidal breath applied as a brightness multi-
  // plier on top of the clock-locked colors. +/- 2.5% so it
  // never overwhelms the time-of-day signal but a parent
  // watching for 60s can still perceive motion.
  function _pwsBreath(nowMs){
    return 1 + 0.025 * Math.sin((nowMs / 90000) * Math.PI * 2);
  }

  function _pwsApplyBreath(rgb, mult){
    const clamp = function(v){ return v < 0 ? 0 : v > 255 ? 255 : v; };
    return 'rgb(' + clamp(rgb[0] * mult).toFixed(0) + ','
                  + clamp(rgb[1] * mult).toFixed(0) + ','
                  + clamp(rgb[2] * mult).toFixed(0) + ')';
  }

  // ── State (module-scoped singleton) ───────────────────────
  const _state = {
    canvas: null,
    ctx: null,
    host: null,
    dpr: 1,
    w: 0, h: 0,
    raf: null,
    hostVisible: false,
    tabVisible: true,
    reducedMotion: false,
    resizeTimer: null,
    resizeObs: null,
    intersectObs: null
  };

  function _pwsSizeCanvas(){
    if (!_state.canvas || !_state.host) return;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const w = _state.host.clientWidth  || 0;
    const h = _state.host.clientHeight || 0;
    if (w === 0 || h === 0) return;
    _state.dpr = dpr;
    _state.w = w;
    _state.h = h;
    _state.canvas.width  = Math.round(w * dpr);
    _state.canvas.height = Math.round(h * dpr);
    _state.canvas.style.width  = w + 'px';
    _state.canvas.style.height = h + 'px';
    _state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function _pwsPaint(){
    const ctx = _state.ctx;
    if (!ctx) return;
    const w = _state.w, h = _state.h;
    if (w === 0 || h === 0) return;
    const hour   = _pwsCurrentHour();
    const colors = _pwsSkyColors(hour);
    const breath = _pwsBreath(Date.now());
    const top = _pwsApplyBreath(colors.zenith,  breath);
    const bot = _pwsApplyBreath(colors.horizon, breath);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function _pwsShouldRun(){
    return _state.hostVisible && _state.tabVisible && !_state.reducedMotion;
  }

  function _pwsTick(){
    _state.raf = null;
    if (!_state.canvas || !_state.canvas.isConnected) {
      _pwsTeardown();
      return;
    }
    _pwsPaint();
    if (_pwsShouldRun()) {
      _state.raf = requestAnimationFrame(_pwsTick);
    }
  }

  function _pwsWake(){
    if (_state.raf) return;
    if (_pwsShouldRun()) {
      _state.raf = requestAnimationFrame(_pwsTick);
    } else {
      // Even when we won't loop, repaint once so a wake from
      // tab-focus or scroll-into-view shows the current time of
      // day immediately (no lingering frame from minutes ago).
      _pwsPaint();
    }
  }

  function _pwsOnVisChange(){
    _state.tabVisible = (document.visibilityState === 'visible');
    if (_state.tabVisible) _pwsWake();
    else if (_state.raf) { cancelAnimationFrame(_state.raf); _state.raf = null; }
  }

  function _pwsOnHostIntersect(entries){
    if (!entries || !entries.length) return;
    const visible = entries[0].isIntersecting;
    _state.hostVisible = !!visible;
    if (visible) _pwsWake();
    else if (_state.raf) { cancelAnimationFrame(_state.raf); _state.raf = null; }
  }

  function _pwsOnResize(){
    if (_state.resizeTimer) clearTimeout(_state.resizeTimer);
    _state.resizeTimer = setTimeout(function(){
      _pwsSizeCanvas();
      _pwsPaint();
    }, 120);
  }

  function _pwsTeardown(){
    if (_state.raf) { cancelAnimationFrame(_state.raf); _state.raf = null; }
    if (_state.resizeObs) {
      try { _state.resizeObs.disconnect(); } catch(_){}
      _state.resizeObs = null;
    }
    if (_state.intersectObs) {
      try { _state.intersectObs.disconnect(); } catch(_){}
      _state.intersectObs = null;
    }
    document.removeEventListener('visibilitychange', _pwsOnVisChange);
    _state.canvas = null;
    _state.ctx = null;
    _state.host = null;
  }

  // ── Mount (idempotent — safe to call from every render) ───
  function renderParentWatchScene(){
    if (_pwsClassicMode()) return;
    const canvas = document.getElementById('pchSceneCanvas');
    if (!canvas) return;
    const host = document.getElementById('parentCelestialHome');
    if (!host) return;

    // If we've already mounted on this canvas instance, just
    // make sure the loop is awake and dims are current. Fast path
    // for the common case where renderParentCelestialHome fires
    // on every save event.
    if (_state.canvas === canvas) {
      _pwsSizeCanvas();
      _pwsWake();
      return;
    }
    // Different canvas (or first mount) — re-init.
    _pwsTeardown();

    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    _state.canvas = canvas;
    _state.ctx    = ctx;
    _state.host   = host;
    _state.reducedMotion = _pwsReducedMotion();
    _state.tabVisible    = (document.visibilityState === 'visible');
    _state.hostVisible   = (host.offsetParent !== null);

    _pwsSizeCanvas();
    host.classList.add('pch-canvas-on');

    // ResizeObserver on the host so the canvas re-fits whenever
    // the container changes shape (window resize, font reflow,
    // sibling content growth). Debounced 120ms inside _pwsOnResize.
    if (typeof ResizeObserver === 'function') {
      _state.resizeObs = new ResizeObserver(_pwsOnResize);
      _state.resizeObs.observe(host);
    } else {
      // Older browsers — fall back to window resize.
      window.addEventListener('resize', _pwsOnResize);
    }

    // IntersectionObserver wakes/sleeps on host visibility. The
    // host is hidden whenever the user is on a non-parent section
    // (CSS display:none on inactive #s-* sections), so we don't
    // burn cycles painting an offscreen canvas.
    if (typeof IntersectionObserver === 'function') {
      _state.intersectObs = new IntersectionObserver(_pwsOnHostIntersect, { threshold: 0 });
      _state.intersectObs.observe(host);
    }

    // visibilitychange handles tab focus.
    document.addEventListener('visibilitychange', _pwsOnVisChange);

    if (_state.reducedMotion) {
      _pwsPaint();
      return;
    }
    _pwsWake();
  }

  if (typeof window !== 'undefined') {
    window.renderParentWatchScene = renderParentWatchScene;
  }
})();
