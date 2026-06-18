/* =============================================================
   child-hero-scene.js — canvas star-field hero for the child's
   flat-nav home (#childHero / #childHeroCanvas, inside #appHome).

   Time-of-day aware (checked at mount + on each ResizeObserver
   repaint; stored in _state.timeState so _chsPaint branches
   without re-reading the clock every frame):
     morning  (5-11)  dawn gradient, stars dimmed, warm horizon glow
     afternoon(12-17) NO canvas — JS adds .chs-day; CSS shows a
                      daytime sky gradient + hides the canvas
     night    (18-4)  deep-space scene + crescent moon + cool-white
                      horizon scatter + occasional shooting star

   Mirrors parent-watch-scene.js's RAF lifecycle: idempotent mount,
   visibilitychange + IntersectionObserver + ResizeObserver, RAF
   cancelled on hide, reduced-motion paints once (no loop, no
   shooting star). Star positions are fractions so resize never
   reseeds.

   SCENE LAYER — hardcoded hex only (must NOT invert in dark mode).
   In light theme OR afternoon the canvas is hidden via CSS and
   #childHero shows a daytime gradient; this module tears down.

   Canvas palette (named one-off, co-owned with #appGreeting):
     night: zenith #05080f -> mid #0a1628 -> seam #0d1b2e (= greeting bg)
     dawn:  #07071a -> #1a1040 -> #3d1c02 (warm horizon)
============================================================= */
(function(){
  'use strict';

  var _state = {
    canvas:null, ctx:null, host:null, raf:null,
    w:0, h:0, dpr:1, stars:null, reducedMotion:false,
    tabVisible:true, hostVisible:true, timeState:'night', shoot:null,
    resizeObs:null, intersectObs:null, resizeTimer:null
  };

  function _chsReduced(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(_e){ return false; }
  }
  function _chsRand(a, b){ return a + Math.random() * (b - a); }

  // Time-of-day bucket. TEST OVERRIDE: replace the next line with e.g.
  // `var h = 8;` (morning) / `14` (afternoon) / `20` (night) to verify states.
  function _chsTimeState(){
    var h = new Date().getHours();
    if (h >= 12 && h <= 17) return 'afternoon';
    if (h >= 5  && h <= 11) return 'morning';
    return 'night';
  }

  // 60 stars across 3 magnitude tiers. Positions are fractions (0..1) so a
  // resize never reseeds. Squared y-bias clusters them toward the top; the
  // *0.82 clamp keeps them out of the bottom horizon band (glow owns it).
  function _chsPrecompute(){
    if (_state.stars) return;
    var tiers = [
      { n:9,  rMin:2.0, rMax:2.5, opMin:0.65, opMax:0.95 },  // bright
      { n:20, rMin:1.3, rMax:1.8, opMin:0.45, opMax:0.80 },  // mid
      { n:31, rMin:0.7, rMax:1.1, opMin:0.30, opMax:0.60 }   // dim
    ];
    var seed = 1;
    function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    var stars = [];
    for (var t=0; t<tiers.length; t++){
      var tier = tiers[t];
      for (var i=0; i<tier.n; i++){
        var fy = rnd(); fy = fy * fy;
        stars.push({
          fx: rnd(),
          fy: fy * 0.82,
          r:  tier.rMin + rnd() * (tier.rMax - tier.rMin),
          baseOp: tier.opMin + rnd() * (tier.opMax - tier.opMin),
          tw: 3000 + rnd() * 5000,
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

  // Static crescent (night only): bright disc minus an offset darker (sky)
  // disc, with a soft radial glow behind it. Upper-right quadrant.
  function _chsDrawMoon(ctx, w, h){
    var R = Math.max(12, h * 0.075);
    var mx = w * 0.78, my = h * 0.18;
    var gl = ctx.createRadialGradient(mx, my, R * 0.6, mx, my, R * 3);
    gl.addColorStop(0, 'rgba(255,245,180,0.12)');
    gl.addColorStop(1, 'rgba(255,245,180,0)');
    ctx.fillStyle = gl;
    ctx.beginPath(); ctx.arc(mx, my, R * 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,245,200,0.85)';
    ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.fill();
    // Offset darker disc = the sky color near the moon, carving the crescent.
    ctx.fillStyle = '#070c16';
    ctx.beginPath(); ctx.arc(mx + R * 0.55, my - R * 0.15, R * 0.95, 0, Math.PI * 2); ctx.fill();
  }

  // One shooting star at a time (night, motion on, loop running). Random
  // 8-15s gaps; 350-500ms travel; upper-60% start; 30-40deg down-right;
  // 120-180px; head->tail fade; reschedules on completion.
  function _chsShootingStar(ctx, w, h, now){
    var sh = _state.shoot;
    if (!sh){ _state.shoot = { active:false, nextAt: now + _chsRand(8000, 15000) }; return; }
    if (!sh.active && now >= sh.nextAt){
      var ang = (30 + Math.random() * 10) * Math.PI / 180;
      var len = 120 + Math.random() * 60;
      sh.active = true; sh.startMs = now; sh.durMs = _chsRand(350, 500);
      sh.x0 = _chsRand(0, w * 0.6); sh.y0 = _chsRand(0, h * 0.6);
      sh.dx = Math.cos(ang) * len; sh.dy = Math.sin(ang) * len;
    }
    if (!sh.active) return;
    var p = (now - sh.startMs) / sh.durMs;
    if (p >= 1){ sh.active = false; sh.nextAt = now + _chsRand(8000, 15000); return; }
    var hx = sh.x0 + sh.dx * p, hy = sh.y0 + sh.dy * p;
    var tx = hx - sh.dx * 0.35, ty = hy - sh.dy * 0.35;
    var grad = ctx.createLinearGradient(hx, hy, tx, ty);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save();
    ctx.globalAlpha = Math.sin(p * Math.PI);    // fade in/out at the ends
    ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.restore();
  }

  function _chsPaint(){
    var ctx = _state.ctx, w = _state.w, h = _state.h;
    if (!ctx || w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);
    var morning = (_state.timeState === 'morning');

    // Sky gradient
    var g = ctx.createLinearGradient(0, 0, 0, h);
    if (morning){
      g.addColorStop(0, '#07071a');
      g.addColorStop(0.55, '#1a1040');
      g.addColorStop(1, '#3d1c02');
    } else {
      var seamStart = h > 28 ? (h - 28) / h : 0.5;
      g.addColorStop(0, '#05080f');
      g.addColorStop(Math.min(0.6, seamStart), '#0a1628');
      g.addColorStop(seamStart, '#0a1628');
      g.addColorStop(1, '#0d1b2e');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Horizon glow — warm at dawn, cool-white at night. Faded ~24px before
    // the bottom so it never collides with the greeting card below.
    var glowTop = h - 80, glowBot = h - 24;
    if (glowBot > glowTop && glowTop > 0){
      var gg = ctx.createLinearGradient(0, glowTop, 0, glowBot);
      if (morning){ gg.addColorStop(0, 'rgba(255,140,60,0)'); gg.addColorStop(1, 'rgba(255,140,60,0.15)'); }
      else        { gg.addColorStop(0, 'rgba(150,190,255,0)'); gg.addColorStop(1, 'rgba(150,190,255,0.10)'); }
      ctx.fillStyle = gg;
      ctx.fillRect(0, glowTop, w, glowBot - glowTop);
    }

    // Stars (dimmed at dawn). Reduced-motion: no twinkle.
    var dim = morning ? 0.4 : 1;
    var now = _state.reducedMotion ? 0 : Date.now();
    var stars = _state.stars || [];
    for (var i=0; i<stars.length; i++){
      var s = stars[i];
      var op = s.baseOp;
      if (!_state.reducedMotion) op = s.baseOp + Math.sin((now / s.tw) * Math.PI * 2 + s.ph) * 0.18;
      op *= dim;
      if (op < 0.04) op = 0.04;
      if (op > 1) op = 1;
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.arc(s.fx * w, s.fy * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#eaf2ff';
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Night-only foreground: moon (on top of stars) + shooting star (motion).
    if (!morning){
      _chsDrawMoon(ctx, w, h);
      if (!_state.reducedMotion) _chsShootingStar(ctx, w, h, now);
    }
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
    _state.resizeTimer = setTimeout(function(){
      // Re-evaluate time-of-day on a repaint so a long-open session crosses
      // dawn/afternoon/night boundaries (the mount also re-checks).
      if (typeof renderChildHeroScene === 'function') renderChildHeroScene();
      else { _chsSize(); _chsPaint(); }
    }, 120);
  }
  function _chsTeardown(){
    if (_state.raf){ cancelAnimationFrame(_state.raf); _state.raf = null; }
    if (_state.resizeObs){ try { _state.resizeObs.disconnect(); } catch(_e){} _state.resizeObs = null; }
    if (_state.intersectObs){ try { _state.intersectObs.disconnect(); } catch(_e){} _state.intersectObs = null; }
    document.removeEventListener('visibilitychange', _chsOnVis);
    _state.canvas = null; _state.ctx = null; _state.host = null; _state.stars = null; _state.shoot = null;
  }

  // Idempotent mount — safe to call on every maybeRenderAppHome().
  function renderChildHeroScene(){
    if (typeof document === 'undefined') return;
    var host = document.getElementById('childHero');
    if (!host) return;
    var canvas = document.getElementById('childHeroCanvas');
    if (!canvas) return;

    var light = false;
    try { light = document.documentElement.classList.contains('light'); } catch(_e){}
    var ts = _chsTimeState();
    _state.timeState = ts;
    // .chs-day drives the CSS daytime gradient on the host + lightens #appGreeting.
    try { host.classList.toggle('chs-day', ts === 'afternoon'); } catch(_e){}

    // Light theme OR afternoon: CSS shows a daytime gradient + hides the canvas.
    // Nothing to animate — tear down any prior loop.
    if (light || ts === 'afternoon'){ _chsTeardown(); return; }

    // Fast path: already mounted on this canvas — re-fit + re-paint (picks up a
    // changed time state) + wake.
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
