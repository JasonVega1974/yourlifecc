/* =============================================================
   child-hero-scene.js — canvas star-field hero for the child's
   flat-nav home (#childHero / #childHeroCanvas, inside #appHome).

   Cooler + simpler than The Watch: open night sky, 60 stars in 3
   magnitude tiers with gentle twinkle, a soft cool-white scatter
   near the horizon, and a bottom band that darkens to #0d1b2e so
   the canvas bleeds into the #appGreeting card flush below it.

   Mirrors parent-watch-scene.js's RAF lifecycle: idempotent mount,
   visibilitychange + IntersectionObserver + ResizeObserver, RAF
   cancelled on hide, reduced-motion paints once (no loop). Star
   positions are stored as fractions so resize never reseeds.

   SCENE LAYER — hardcoded hex only (must NOT invert in dark mode).
   In light mode the canvas is hidden via CSS and #childHero shows a
   daytime gradient; this module tears down so no loop runs.

   Canvas palette (named one-off, co-owned with #appGreeting):
     zenith #05080f -> mid #0a1628 -> seam #0d1b2e (= #appGreeting bg)
   Horizon scatter: rgba(150,190,255,.10), faded out ~24px above the
   bottom so it never collides with the amber greeting below.
============================================================= */
(function(){
  'use strict';

  var _state = {
    canvas:null, ctx:null, host:null, raf:null,
    w:0, h:0, dpr:1, stars:null, reducedMotion:false,
    tabVisible:true, hostVisible:true,
    resizeObs:null, intersectObs:null, resizeTimer:null
  };

  function _chsReduced(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(_e){ return false; }
  }

  // 60 stars across 3 magnitude tiers. Positions are fractions (0..1)
  // so a resize never reseeds. A squared y-bias clusters stars toward
  // the top and the *0.82 clamp keeps them out of the bottom horizon
  // band so the scatter glow owns that zone (per the UX baseline).
  function _chsPrecompute(){
    if (_state.stars) return;
    var tiers = [
      { n:9,  rMin:2.0, rMax:2.5, opMin:0.65, opMax:0.95 },  // bright
      { n:20, rMin:1.3, rMax:1.8, opMin:0.45, opMax:0.80 },  // mid
      { n:31, rMin:0.7, rMax:1.1, opMin:0.30, opMax:0.60 }   // dim
    ];
    // Deterministic LCG so every mount paints the same field.
    var seed = 1;
    function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    var stars = [];
    for (var t=0; t<tiers.length; t++){
      var tier = tiers[t];
      for (var i=0; i<tier.n; i++){
        var fy = rnd(); fy = fy * fy;            // biased toward the top
        stars.push({
          fx: rnd(),
          fy: fy * 0.82,                          // stay out of the bottom ~18%
          r:  tier.rMin + rnd() * (tier.rMax - tier.rMin),
          baseOp: tier.opMin + rnd() * (tier.opMax - tier.opMin),
          tw: 3000 + rnd() * 5000,                // 3-8s twinkle period
          ph: rnd() * Math.PI * 2
        });
      }
    }
    _state.stars = stars;
  }

  function _chsSize(){
    var host = _state.host, canvas = _state.canvas;
    if (!host || !canvas) return;
    var w = host.clientWidth || 0;
    var h = host.clientHeight || 0;
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    _state.w = w; _state.h = h; _state.dpr = dpr;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    if (_state.ctx) _state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function _chsPaint(){
    var ctx = _state.ctx, w = _state.w, h = _state.h;
    if (!ctx || w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);

    // Sky gradient: zenith -> mid -> seam (#0d1b2e) in the bottom ~28px
    // so the canvas bleeds into the #appGreeting card flush below.
    var seamStart = h > 28 ? (h - 28) / h : 0.5;
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#05080f');
    g.addColorStop(Math.min(0.6, seamStart), '#0a1628');
    g.addColorStop(seamStart, '#0a1628');
    g.addColorStop(1, '#0d1b2e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Soft cool-white horizon scatter — low opacity, fully faded ~24px
    // before the bottom so it never collides with the amber greeting.
    var glowTop = h - 80, glowBot = h - 24;
    if (glowBot > glowTop && glowTop > 0){
      var gg = ctx.createLinearGradient(0, glowTop, 0, glowBot);
      gg.addColorStop(0, 'rgba(150,190,255,0)');
      gg.addColorStop(1, 'rgba(150,190,255,0.10)');
      ctx.fillStyle = gg;
      ctx.fillRect(0, glowTop, w, glowBot - glowTop);
    }

    // Stars. Reduced-motion: paint at base opacity, no twinkle.
    var now = _state.reducedMotion ? 0 : Date.now();
    var stars = _state.stars || [];
    for (var i=0; i<stars.length; i++){
      var s = stars[i];
      var op = s.baseOp;
      if (!_state.reducedMotion){
        op = s.baseOp + Math.sin((now / s.tw) * Math.PI * 2 + s.ph) * 0.18;
        if (op < 0.05) op = 0.05;
        if (op > 1) op = 1;
      }
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.arc(s.fx * w, s.fy * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#eaf2ff';
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function _chsShouldRun(){
    return _state.hostVisible && _state.tabVisible && !_state.reducedMotion;
  }
  function _chsTick(){
    _state.raf = null;
    if (!_state.canvas || !_state.canvas.isConnected){ _chsTeardown(); return; }
    _chsPaint();
    if (_chsShouldRun()) _state.raf = requestAnimationFrame(_chsTick);
  }
  function _chsWake(){
    if (_state.raf) return;
    if (_chsShouldRun()) _state.raf = requestAnimationFrame(_chsTick);
    else _chsPaint();
  }
  function _chsOnVis(){
    _state.tabVisible = (document.visibilityState === 'visible');
    if (_state.tabVisible) _chsWake();
    else if (_state.raf){ cancelAnimationFrame(_state.raf); _state.raf = null; }
  }
  function _chsOnIntersect(entries){
    if (!entries || !entries.length) return;
    _state.hostVisible = !!entries[0].isIntersecting;
    if (_state.hostVisible) _chsWake();
    else if (_state.raf){ cancelAnimationFrame(_state.raf); _state.raf = null; }
  }
  function _chsOnResize(){
    if (_state.resizeTimer) clearTimeout(_state.resizeTimer);
    _state.resizeTimer = setTimeout(function(){ _chsSize(); _chsPaint(); }, 120);
  }
  function _chsTeardown(){
    if (_state.raf){ cancelAnimationFrame(_state.raf); _state.raf = null; }
    if (_state.resizeObs){ try { _state.resizeObs.disconnect(); } catch(_e){} _state.resizeObs = null; }
    if (_state.intersectObs){ try { _state.intersectObs.disconnect(); } catch(_e){} _state.intersectObs = null; }
    document.removeEventListener('visibilitychange', _chsOnVis);
    _state.canvas = null; _state.ctx = null; _state.host = null; _state.stars = null;
  }

  // Idempotent mount — safe to call on every maybeRenderAppHome().
  function renderChildHeroScene(){
    if (typeof document === 'undefined') return;
    var host = document.getElementById('childHero');
    if (!host) return;
    var canvas = document.getElementById('childHeroCanvas');
    if (!canvas) return;

    // Light mode: CSS hides the canvas + paints a daytime gradient on the
    // host. Nothing to animate — tear down any prior dark-mode loop.
    var light = false;
    try { light = document.documentElement.classList.contains('light'); } catch(_e){}
    if (light){ _chsTeardown(); return; }

    // Fast path: already mounted on this canvas — re-fit + wake.
    if (_state.canvas === canvas){ _chsSize(); _chsPaint(); _chsWake(); return; }
    _chsTeardown();

    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;
    _state.canvas = canvas;
    _state.ctx = ctx;
    _state.host = host;
    _state.reducedMotion = _chsReduced();
    _state.tabVisible  = (document.visibilityState === 'visible');
    _state.hostVisible = (host.offsetParent !== null);
    _chsSize();
    _chsPrecompute();

    if (typeof ResizeObserver === 'function'){
      _state.resizeObs = new ResizeObserver(_chsOnResize);
      _state.resizeObs.observe(host);
    } else {
      window.addEventListener('resize', _chsOnResize);
    }
    if (typeof IntersectionObserver === 'function'){
      _state.intersectObs = new IntersectionObserver(_chsOnIntersect, { threshold: 0 });
      _state.intersectObs.observe(host);
    }
    document.addEventListener('visibilitychange', _chsOnVis);

    if (_state.reducedMotion){ _chsPaint(); return; }
    _chsWake();
  }

  if (typeof window !== 'undefined'){
    window.renderChildHeroScene = renderChildHeroScene;
  }
})();
