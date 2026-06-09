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

  // ── Day / night opacity gates (W2) ────────────────────────
  // All three return values in [0, 1]. Decimal hour drives them
  // the same way it drives _pwsSkyColors, so the atmospheric
  // layers fade in / out in sync with the sky cycle. Edges
  // (5.5/7.5 dawn, 19.0/21.5 dusk) match the SKY_KEYFRAMES
  // transition windows.
  function _pwsNightOpacity(hour){
    if (hour < 5.5)  return 1;
    if (hour < 7.5)  return 1 - (hour - 5.5) / 2.0;     // dawn fade out
    if (hour < 19.0) return 0;                          // full day
    if (hour < 21.5) return (hour - 19.0) / 2.5;        // dusk fade in
    return 1;                                           // full night
  }
  function _pwsDayOpacity(hour){
    return 1 - _pwsNightOpacity(hour);
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
    intersectObs: null,
    // W2 — precomputed layer state. Coordinates stored as
    // fractions of canvas (xf/yf in [0,1]) so a resize doesn't
    // require re-randomization.
    stars: null,
    clouds: null,
    shootingStars: null,
    // W3 — foreground silhouette layer. Same xf/yf fraction
    // pattern; shapes scale uniformly mobile -> desktop.
    hills: null,
    tree: null,
    house: null
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

  // ── W2 — precompute static layer positions once at mount ──
  // Each entry stores position as a fraction of canvas dims so
  // the layout survives any resize without re-randomization
  // (we don't want stars to teleport when the user rotates a
  // phone). Each function is idempotent — skips when its state
  // slice is already populated. Called from renderParentWatchScene
  // after _pwsSizeCanvas. Teardown nulls all three so a fresh
  // mount gets a freshly randomized field.

  // 75 stars across the upper 70% of canvas. 5 randomly chosen
  // are "named" (slightly larger r=2.5, warm gold tint, plus a
  // subtle glow when bright).
  function _pwsPrecomputeStars(){
    if (_state.stars) return;
    const stars = [];
    const namedIdxs = {};
    let picked = 0;
    while (picked < 5) {
      const i = Math.floor(Math.random() * 75);
      if (!namedIdxs[i]) { namedIdxs[i] = true; picked++; }
    }
    for (let i = 0; i < 75; i++) {
      const named = !!namedIdxs[i];
      const tier = Math.random();
      const r = named ? 2.5 : (tier < 0.5 ? 1.0 : tier < 0.85 ? 1.5 : 2.0);
      stars.push({
        xf: Math.random(),
        yf: Math.random() * 0.70,        // upper 70% only
        r: r,
        baseOp: 0.35 + Math.random() * 0.45,
        tp: 1800 + Math.random() * 5400, // 1.8s - 7.2s
        to: Math.random() * Math.PI * 2,
        named: named
      });
    }
    _state.stars = stars;
  }

  // 4 clouds across 3 "depth layers" — far/mid/near. yf
  // positions them in the upper-mid sky. Period drives the
  // drift speed (longer = slower = farther). A small ±0.02 yf
  // jitter per cloud keeps them off the same horizontal line.
  function _pwsPrecomputeClouds(){
    if (_state.clouds) return;
    const clouds = [];
    const layers = [
      { y: 0.16, period: 130000 },   // far, slowest
      { y: 0.24, period:  90000 },   // mid
      { y: 0.24, period: 105000 },   // mid (slightly slower for variety)
      { y: 0.34, period:  60000 }    // near, fastest
    ];
    for (let i = 0; i < layers.length; i++) {
      const L = layers[i];
      clouds.push({
        baseXf: Math.random(),
        yf: L.y + (Math.random() - 0.5) * 0.04,
        period: L.period,
        rx: 60 + Math.random() * 40,
        ry: 14 + Math.random() * 8
      });
    }
    _state.clouds = clouds;
  }

  // 3 independent shooting-star slots, same stochastic pattern
  // as The Well (init.js:1160-1231). Each slot owns its own
  // launchTime, duration, and trajectory. duration:0 means
  // "idle, awaiting next launch at nextLaunchAt."
  function _pwsPrecomputeShootingStars(){
    if (_state.shootingStars) return;
    const slots = [];
    const now = Date.now();
    for (let i = 0; i < 3; i++) {
      slots.push({
        launchTime: 0,
        duration: 0,
        startX: 0, startY: 0,
        unitX: 0, unitY: 0,
        speed: 0,
        length: 0,
        nextLaunchAt: now + 5000 + Math.random() * 14000
      });
    }
    _state.shootingStars = slots;
  }

  // ── W3 — foreground silhouette precompute ────────────────
  // Two rolling hills layered for parallax. Far hill (yf top
  // at 0.80, ±0.025 sine amp) peeks ABOVE the near hill (yf
  // top at 0.84, ±0.020 sine amp) and reads as the distant
  // horizon. Near hill is the anchor for the tree + house.
  // waves = number of sine periods across canvas width — far
  // hill has fewer waves (smoother distant ridge), near hill
  // has more (closer detail).
  function _pwsPrecomputeHills(){
    if (_state.hills) return;
    _state.hills = {
      far: {
        baseYf: 0.80,
        ampYf: 0.025,
        waves: 2.3,
        phase: Math.random() * Math.PI * 2
      },
      near: {
        baseYf: 0.84,
        ampYf: 0.020,
        waves: 3.1,
        phase: Math.random() * Math.PI * 2
      }
    };
  }

  // Oak silhouette anchored on the near hill, left side. Trunk
  // sits at xf=0.18 and tapers (wider at base). Canopy is a
  // composite of ~30 overlapping circles drawn at offsets from
  // the canopy center, two tiers:
  //   • 18 larger circles ("body" of the canopy) — rf 0.018-0.042
  //   • 12 smaller circles ("leaves" at the edges) — rf 0.006-0.016
  // The two-tier approach gives the canopy a domed interior with
  // a ragged outer outline, reading as an organic tree silhouette
  // rather than a fluffy cloud.
  //
  // Branches are 5 lines emanating from the trunk top, angled
  // mostly upward (-pi/2 ± pi*0.4), of varying length. Drawn
  // INSIDE the post-translate frame so they sway with the canopy.
  //
  // swayPhase randomizes the start of the 12s sway cycle so a
  // resize-driven re-mount doesn't jolt the sway.
  function _pwsPrecomputeTree(){
    if (_state.tree) return;
    const trunkXf = 0.18;
    const trunkBaseYf = 0.865;     // sits slightly INTO the near hill
    const trunkTopYf  = 0.745;
    const trunkWf     = 0.014;

    // Canopy center (in canvas fractions) — above trunk top
    const canopyCxf = trunkXf + 0.004;
    const canopyCyf = 0.685;

    const canopy = [];
    // Tier 1 — larger body circles
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.058;
      canopy.push({
        dxf: Math.cos(angle) * dist,
        dyf: Math.sin(angle) * dist * 0.75,
        rf:  0.018 + Math.random() * 0.024
      });
    }
    // Tier 2 — smaller edge leaves for ragged outline
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.050 + Math.random() * 0.022;
      canopy.push({
        dxf: Math.cos(angle) * dist,
        dyf: Math.sin(angle) * dist * 0.7,
        rf:  0.006 + Math.random() * 0.010
      });
    }

    const branches = [];
    for (let i = 0; i < 5; i++) {
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 0.8;
      branches.push({
        angle: angle,
        lenf:  0.040 + Math.random() * 0.025
      });
    }

    _state.tree = {
      trunkXf:    trunkXf,
      trunkBaseYf: trunkBaseYf,
      trunkTopYf:  trunkTopYf,
      trunkWf:    trunkWf,
      canopyCxf:  canopyCxf,
      canopyCyf:  canopyCyf,
      canopy:     canopy,
      branches:   branches,
      swayPhase:  Math.random() * Math.PI * 2
    };
  }

  // Craftsman-style farmhouse, center-right of mid-foreground.
  // Body is rectangular (wider than tall) for an unambiguous
  // "house" read at glance. Peaked roof sits on top; single
  // chimney offset to the right; small porch projection on the
  // left tells the eye "this is a home, not a shed."
  //
  // 4 windows arranged in a 2x2 grid on the body. Each carries
  // a random phase offset on a 6s pulse cycle so they breathe
  // asynchronously — the home feels lived-in rather than wired.
  //
  // Stat numbers (W5) will paint into the dark bottom pane of
  // each window; for W3 the panes paint blank dark.
  function _pwsPrecomputeHouse(){
    if (_state.house) return;
    const xf     = 0.62;       // body horizontal center
    const baseYf = 0.855;      // body base sits AT near hill top
    const wf     = 0.20;
    const bodyHf = 0.115;
    const roofHf = 0.065;

    // 4 windows in 2x2 grid centered on the body. Window dims
    // chosen so the 2x2 + gaps fit within the body width with
    // ~12% margins on each side.
    const winWf = 0.030;
    const winHf = 0.026;
    const winGapXf = 0.018;
    const winGapYf = 0.014;
    const gridWf = 2 * winWf + winGapXf;
    const gridStartXf = xf - gridWf / 2;
    const gridStartYf = baseYf - bodyHf + 0.022;

    const windows = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        windows.push({
          xf: gridStartXf + col * (winWf + winGapXf),
          yf: gridStartYf + row * (winHf + winGapYf),
          wf: winWf,
          hf: winHf,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    _state.house = {
      xf:      xf,
      baseYf:  baseYf,
      wf:      wf,
      bodyHf:  bodyHf,
      roofHf:  roofHf,
      // Chimney: small rect emerging from the right side of the roof
      chimXf: xf + wf * 0.25,
      chimYf: baseYf - bodyHf - roofHf * 0.6,
      chimWf: 0.012,
      chimHf: 0.042,
      // Porch projection: short rect off the left side, bottom-aligned
      porchXf: xf - wf / 2 - 0.038,
      porchYf: baseYf - bodyHf * 0.42,
      porchWf: 0.048,
      porchHf: bodyHf * 0.42,
      windows: windows
    };
  }

  // ── W2 layer painters ─────────────────────────────────────
  // Each takes ctx + canvas dims + nowMs + the relevant opacity
  // gate so the caller's reduced-motion + day/night gating
  // stays in _pwsPaint where it can be reasoned about as a
  // single render pipeline.

  // Clouds — composite of 3 soft ellipses per cloud with a
  // radial gradient fill so the edges feather. Drift speed
  // comes from the precomputed period; under reduced-motion
  // we freeze drift at the base anchor so the scene stays.
  function _pwsPaintClouds(ctx, w, h, nowMs, hour, dayOp, frozen){
    // Color shifts with the sky:
    //   • sunset / sunrise: warm pink-gray
    //   • day:              cool gray-white
    let r, g, b;
    if ((hour > 5.5 && hour < 8.0) || (hour > 17.0 && hour < 19.5)) {
      r = 232; g = 200; b = 198;
    } else {
      r = 232; g = 234; b = 240;
    }

    const clouds = _state.clouds;
    for (let i = 0; i < clouds.length; i++) {
      const c = clouds[i];
      const xRange = w + 240;
      const driftFrac = frozen ? 0 : (nowMs / c.period);
      const xRaw = (c.baseXf * xRange + driftFrac * xRange) % xRange;
      const x = xRaw - 120;
      const y = c.yf * h;
      const baseOp = 0.40 * dayOp;

      const drawEllipse = function(dx, dy, rx, ry, op){
        const cx = x + dx, cy = y + dy;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        grad.addColorStop(0,   'rgba(' + r + ',' + g + ',' + b + ',' + op.toFixed(3) + ')');
        grad.addColorStop(0.6, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.4).toFixed(3) + ')');
        grad.addColorStop(1,   'rgba(' + r + ',' + g + ',' + b + ',0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      drawEllipse(0,             0,             c.rx,        c.ry,        baseOp);
      drawEllipse( c.rx * 0.55, -c.ry * 0.30,   c.rx * 0.70, c.ry * 0.80, baseOp * 0.85);
      drawEllipse(-c.rx * 0.45,  c.ry * 0.25,   c.rx * 0.65, c.ry * 0.70, baseOp * 0.90);
    }
  }

  // Stars — per-star twinkle keyed by precomputed period + phase.
  // Under reduced-motion we paint the static base opacity so
  // stars stay visible without animation.
  function _pwsPaintStars(ctx, w, h, nowMs, nightOp, frozen){
    const stars = _state.stars;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      let op;
      if (frozen) {
        op = s.baseOp * nightOp;
      } else {
        const twinkle = 0.5 + 0.5 * Math.sin(nowMs / s.tp * Math.PI * 2 + s.to);
        op = (s.baseOp + (1 - s.baseOp) * twinkle) * nightOp;
      }
      if (op < 0.02) continue;
      const cx = s.xf * w;
      const cy = s.yf * h;
      ctx.beginPath();
      ctx.fillStyle = s.named
        ? 'rgba(255, 232, 160, ' + op.toFixed(3) + ')'
        : 'rgba(241, 233, 213, ' + op.toFixed(3) + ')';
      ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.named && op > 0.55) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 232, 160, ' + (op * 0.16).toFixed(3) + ')';
        ctx.arc(cx, cy, s.r * 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Shooting stars — independent slot machines. duration:0 is
  // idle; nextLaunchAt gates the next launch. At launch we
  // randomize trajectory + speed + length and capture the
  // unit vector so paint can compute the tail without a sqrt
  // every frame. Self-resets after the streak completes or
  // leaves canvas bounds.
  function _pwsPaintShootingStars(ctx, w, h, nowMs){
    const slots = _state.shootingStars;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (s.duration > 0) {
        const elapsed = nowMs - s.launchTime;
        if (elapsed >= s.duration) {
          s.duration = 0;
          s.nextLaunchAt = nowMs + 8000 + Math.random() * 12000;
          continue;
        }
        const x = s.startX + s.unitX * s.speed * elapsed;
        const y = s.startY + s.unitY * s.speed * elapsed;
        if (x < -50 || x > w + 50 || y > h + 50) {
          s.duration = 0;
          s.nextLaunchAt = nowMs + 8000 + Math.random() * 12000;
          continue;
        }
        const frac = elapsed / s.duration;
        let alpha = 1;
        if (frac < 0.15) alpha = frac / 0.15;
        else if (frac > 0.7) alpha = (1 - frac) / 0.3;
        const tailX = x - s.length * s.unitX;
        const tailY = y - s.length * s.unitY;
        const grad = ctx.createLinearGradient(tailX, tailY, x, y);
        grad.addColorStop(0,   'rgba(241, 233, 213, 0)');
        grad.addColorStop(0.7, 'rgba(241, 233, 213, ' + (alpha * 0.55).toFixed(3) + ')');
        grad.addColorStop(1,   'rgba(255, 255, 255, ' + alpha.toFixed(3) + ')');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (nowMs >= s.nextLaunchAt) {
        s.launchTime = nowMs;
        s.duration = 700 + Math.random() * 500;       // 0.7s - 1.2s
        s.startX = w * 0.10 + Math.random() * w * 0.80;
        s.startY = 6 + Math.random() * h * 0.18;
        const angleDeg = 25 + Math.random() * 30;     // 25 - 55 deg
        const angle = angleDeg * Math.PI / 180;
        const goLeft = Math.random() < 0.45;
        const ux = Math.cos(angle) * (goLeft ? -1 : 1);
        const uy = Math.sin(angle);
        s.unitX = ux;
        s.unitY = uy;
        s.speed = (0.22 + Math.random() * 0.16);      // px per ms
        s.length = w * 0.12;
      }
    }
  }

  // ── W3 layer painters ─────────────────────────────────────
  // All foreground layers share a simple two-color lerp on the
  // day/night gate. Hills/tree/house never animate away — they
  // shift color with the time of day but always paint. Color
  // helper kept inline (cheap) rather than adding another
  // function to the surface.

  // Two rolling hills sampled at 48 x-points, filled as closed
  // polygons from their sine top edge to the canvas bottom.
  // Far hill paints first (deeper indigo, fewer waves), near
  // hill paints on top (slightly darker, more waves). The
  // near hill is what occludes most of the far hill; the
  // visible far-hill sliver between the two top edges reads
  // as the distant horizon ridge.
  function _pwsPaintHills(ctx, w, h, nowMs, hour, dayOp){
    const hills = _state.hills;

    // Spec colors:
    //   • Far hill night #1A2240 = rgb(26, 34, 64)
    //   • Near hill night #141B33 = rgb(20, 27, 51)
    // Day variants chosen to keep silhouette legibility while
    // shifting to a cooler blue-gray at midday. Sunrise/sunset
    // warmth comes from the sky behind, not from the hills.
    const lerp3 = function(n, d, t){
      return [
        n[0] + (d[0] - n[0]) * t,
        n[1] + (d[1] - n[1]) * t,
        n[2] + (d[2] - n[2]) * t
      ];
    };
    const FAR_NIGHT  = [26, 34, 64];
    const FAR_DAY    = [80, 100, 130];
    const NEAR_NIGHT = [20, 27, 51];
    const NEAR_DAY   = [62, 78, 105];
    const farC  = lerp3(FAR_NIGHT,  FAR_DAY,  dayOp);
    const nearC = lerp3(NEAR_NIGHT, NEAR_DAY, dayOp);

    const drawHill = function(cfg, color){
      const baseY = cfg.baseYf * h;
      const amp   = cfg.ampYf  * h;
      const periodX = w / cfg.waves;
      ctx.beginPath();
      ctx.moveTo(0, h);
      const samples = 48;
      for (let i = 0; i <= samples; i++) {
        const x = (i / samples) * w;
        const y = baseY + amp * Math.sin(x / periodX * Math.PI * 2 + cfg.phase);
        if (i === 0) ctx.lineTo(0, y);
        else         ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = 'rgb(' + (color[0]|0) + ',' + (color[1]|0) + ',' + (color[2]|0) + ')';
      ctx.fill();
    };

    drawHill(hills.far,  farC);
    drawHill(hills.near, nearC);
  }

  // Oak silhouette. Trunk is a tapered 4-point polygon (wider
  // at base, narrower at top) drawn STATIC. Canopy + branches
  // sway inside a save/translate/rotate frame anchored at the
  // trunk top, so the trunk stays planted while the foliage
  // breathes. Canopy clusters are composite filled circles —
  // 18 larger body circles + 12 smaller edge leaves drawn from
  // _state.tree.canopy, generated at precompute.
  //
  // Sway amplitude ±0.5° (0.0087 rad) on a 12s sine. Reduced
  // motion freezes the sway at 0° but the tree still paints.
  function _pwsPaintTree(ctx, w, h, nowMs, hour, dayOp, frozen){
    const tree = _state.tree;

    const NIGHT = [10, 15, 26];
    const DAY   = [42, 34, 26];   // muted wood-brown
    const r = NIGHT[0] + (DAY[0] - NIGHT[0]) * dayOp;
    const g = NIGHT[1] + (DAY[1] - NIGHT[1]) * dayOp;
    const b = NIGHT[2] + (DAY[2] - NIGHT[2]) * dayOp;
    const fill = 'rgb(' + (r|0) + ',' + (g|0) + ',' + (b|0) + ')';
    ctx.fillStyle = fill;
    ctx.strokeStyle = fill;

    const trunkX     = tree.trunkXf    * w;
    const trunkBaseY = tree.trunkBaseYf * h;
    const trunkTopY  = tree.trunkTopYf  * h;
    const trunkW     = tree.trunkWf    * w;
    const baseHalf = trunkW * 0.70;
    const topHalf  = trunkW * 0.35;

    // Tapered trunk (always static)
    ctx.beginPath();
    ctx.moveTo(trunkX - baseHalf, trunkBaseY);
    ctx.lineTo(trunkX - topHalf,  trunkTopY);
    ctx.lineTo(trunkX + topHalf,  trunkTopY);
    ctx.lineTo(trunkX + baseHalf, trunkBaseY);
    ctx.closePath();
    ctx.fill();

    // Sway computed once, applied to canopy + branches together
    const swayPeriod = 12000;
    const maxSwayRad = 0.0087;     // ~0.5°
    const swayAngle = frozen
      ? 0
      : maxSwayRad * Math.sin(nowMs / swayPeriod * Math.PI * 2 + tree.swayPhase);

    ctx.save();
    ctx.translate(trunkX, trunkTopY);
    ctx.rotate(swayAngle);

    // Branches — thin lines fanning upward from trunk top into
    // the canopy. Drawn FIRST so canopy circles paint on top.
    ctx.lineCap = 'round';
    ctx.lineWidth = trunkW * 0.5;
    for (let i = 0; i < tree.branches.length; i++) {
      const br = tree.branches[i];
      const ex = Math.cos(br.angle) * br.lenf * w;
      const ey = Math.sin(br.angle) * br.lenf * h;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // Canopy clusters — relative to (canopyCxf - trunkXf, canopyCyf - trunkTopYf)
    // after the translate above, since (0,0) is now at trunk top.
    const canopyOffX = (tree.canopyCxf - tree.trunkXf) * w;
    const canopyOffY = (tree.canopyCyf - tree.trunkTopYf) * h;
    for (let i = 0; i < tree.canopy.length; i++) {
      const c  = tree.canopy[i];
      const cx = canopyOffX + c.dxf * w;
      const cy = canopyOffY + c.dyf * h;
      const cr = c.rf * w;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // House silhouette + chimney + porch. Pure dark fill at night,
  // shifts to a subtle wood-brown by day so the house feels less
  // ominous in afternoon light. Roof is a triangle peaked at
  // body center; chimney emerges from the right slope; porch
  // is a short rectangle off the left side, bottom-aligned with
  // the house base so it sits on the same ground line.
  function _pwsPaintHouse(ctx, w, h, nowMs, hour, dayOp){
    const ho = _state.house;

    const NIGHT = [10, 15, 26];
    const DAY   = [44, 34, 24];
    const r = NIGHT[0] + (DAY[0] - NIGHT[0]) * dayOp;
    const g = NIGHT[1] + (DAY[1] - NIGHT[1]) * dayOp;
    const b = NIGHT[2] + (DAY[2] - NIGHT[2]) * dayOp;
    ctx.fillStyle = 'rgb(' + (r|0) + ',' + (g|0) + ',' + (b|0) + ')';

    const bodyX    = (ho.xf - ho.wf / 2) * w;
    const bodyW    = ho.wf * w;
    const bodyTopY = (ho.baseYf - ho.bodyHf) * h;
    const bodyH    = ho.bodyHf * h;

    // Body
    ctx.fillRect(bodyX, bodyTopY, bodyW, bodyH);

    // Roof — slight eaves overhang (0.005w) so the silhouette
    // doesn't read as a perfect triangle stacked on a box
    const eaves = 0.005 * w;
    const roofPeakY = (ho.baseYf - ho.bodyHf - ho.roofHf) * h;
    const roofPeakX = ho.xf * w;
    ctx.beginPath();
    ctx.moveTo(bodyX - eaves,           bodyTopY);
    ctx.lineTo(roofPeakX,               roofPeakY);
    ctx.lineTo(bodyX + bodyW + eaves,   bodyTopY);
    ctx.closePath();
    ctx.fill();

    // Chimney
    ctx.fillRect(ho.chimXf * w, ho.chimYf * h, ho.chimWf * w, ho.chimHf * h);

    // Porch projection — bottom-aligned with house base so it
    // shares the ground line with the body
    const porchTopY = (ho.baseYf - ho.porchHf) * h;
    ctx.fillRect(ho.porchXf * w, porchTopY, ho.porchWf * w, ho.porchHf * h);
  }

  // Windows — 2x2 grid drawn on top of the house body. Each
  // window has a two-pane treatment:
  //   • Top half: warm amber linear gradient #FFC069 -> #E89348
  //     with per-window pulse alpha (0.85-1.0 over 6s) — that's
  //     the "lived-in" cue.
  //   • Bottom half: solid dark #0D1422 — reserved as the data
  //     surface for W5's stat numbers; for W3 paints blank.
  // Thin amber border traces the full window outline; a thin
  // mullion line divides the panes horizontally. Frozen window
  // pulse under reduced-motion sits at 0.92 (midpoint).
  function _pwsPaintHouseWindows(ctx, w, h, nowMs, hour, dayOp, frozen){
    const windows = _state.house.windows;
    const pulsePeriod = 6000;

    for (let i = 0; i < windows.length; i++) {
      const win = windows[i];
      const x  = win.xf * w;
      const y  = win.yf * h;
      const ww = win.wf * w;
      const hh = win.hf * h;
      const halfH = hh * 0.5;

      let pulseAlpha;
      if (frozen) {
        pulseAlpha = 0.92;
      } else {
        pulseAlpha = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(nowMs / pulsePeriod * Math.PI * 2 + win.phase));
      }

      // Warm top pane
      const grad = ctx.createLinearGradient(x, y, x, y + halfH);
      grad.addColorStop(0, 'rgba(255, 192, 105, ' + pulseAlpha.toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(232, 147, 72, '  + pulseAlpha.toFixed(3) + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, ww, halfH);

      // Dark bottom pane (W5 stat number surface)
      ctx.fillStyle = 'rgb(13, 20, 34)';
      ctx.fillRect(x, y + halfH, ww, halfH);

      // Amber border + mullion
      ctx.strokeStyle = 'rgba(232, 147, 72, ' + (pulseAlpha * 0.6).toFixed(3) + ')';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(x + 0.3, y + 0.3, ww - 0.6, hh - 0.6);
      ctx.beginPath();
      ctx.moveTo(x, y + halfH);
      ctx.lineTo(x + ww, y + halfH);
      ctx.stroke();
    }
  }

  function _pwsPaint(){
    const ctx = _state.ctx;
    if (!ctx) return;
    const w = _state.w, h = _state.h;
    if (w === 0 || h === 0) return;
    const hour   = _pwsCurrentHour();
    const nowMs  = Date.now();
    const colors = _pwsSkyColors(hour);
    const breath = _pwsBreath(nowMs);
    const top = _pwsApplyBreath(colors.zenith,  breath);
    const bot = _pwsApplyBreath(colors.horizon, breath);

    // 1. Sky (W1 base layer)
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Aurora — REMOVED 2026-06-08 per user feedback (the wavy blue
    //    ribbon read as a distracting overlay, not atmospheric depth).
    //    The _pwsPaintAurora function and _pwsDeepNightOpacity gate are
    //    deleted below; if we want it back, restore the call here.

    // 3. Clouds — daytime gate; drift freezes under reduced-motion
    const dayOp = _pwsDayOpacity(hour);
    if (dayOp > 0 && _state.clouds) {
      _pwsPaintClouds(ctx, w, h, nowMs, hour, dayOp, _state.reducedMotion);
    }

    // 4. Stars — night gate; twinkle freezes under reduced-motion
    const nightOp = _pwsNightOpacity(hour);
    if (nightOp > 0 && _state.stars) {
      _pwsPaintStars(ctx, w, h, nowMs, nightOp, _state.reducedMotion);
    }

    // 5. Shooting stars — night only, skip under reduced-motion
    if (!_state.reducedMotion && nightOp > 0.5 && _state.shootingStars) {
      _pwsPaintShootingStars(ctx, w, h, nowMs);
    }

    // 6. Hills — always painted; day/night color via dayOp lerp
    if (_state.hills) {
      _pwsPaintHills(ctx, w, h, nowMs, hour, dayOp);
    }

    // 7. Tree — always painted; canopy sway frozen under reduced-motion
    if (_state.tree) {
      _pwsPaintTree(ctx, w, h, nowMs, hour, dayOp, _state.reducedMotion);
    }

    // 8. House silhouette — always painted
    if (_state.house) {
      _pwsPaintHouse(ctx, w, h, nowMs, hour, dayOp);
    }

    // 9. House windows — always painted; pulse frozen under reduced-motion
    if (_state.house && _state.house.windows) {
      _pwsPaintHouseWindows(ctx, w, h, nowMs, hour, dayOp, _state.reducedMotion);
    }
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
    // W2 — drop layer state so the next mount precomputes fresh
    // (different canvas instance == different randomized field).
    _state.stars = null;
    _state.clouds = null;
    _state.shootingStars = null;
    // W3 — drop foreground state too so a fresh mount randomizes
    // tree canopy / hill phase / window pulse offsets again.
    _state.hills = null;
    _state.tree = null;
    _state.house = null;
  }

  // ── Mount (idempotent — safe to call from every render) ───
  function renderParentWatchScene(){
    const host = document.getElementById('parentCelestialHome');
    if (!host) return;

    // Escape hatch — flag the host so the scoped CSS rules can
    // restore Phase 4's SVG star field to its original visibility.
    // Set BEFORE the early return so the class is present on the
    // very first render, not just after a toggle.
    if (_pwsClassicMode()) {
      host.classList.add('pch-classic-mode');
      return;
    }
    // Defensive: clear the class on the not-classic path in case
    // a prior session left it set (e.g. localStorage flag flipped
    // off mid-tab; class would otherwise persist until reload).
    host.classList.remove('pch-classic-mode');

    const canvas = document.getElementById('pchSceneCanvas');
    if (!canvas) return;

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
    // W2 — precompute static layer positions (stars, clouds,
    // shooting-star slots) once per mount. Subsequent renders +
    // resizes reuse them; coordinates are stored as fractions
    // so resize doesn't relocate any element.
    _pwsPrecomputeStars();
    _pwsPrecomputeClouds();
    _pwsPrecomputeShootingStars();
    // W3 — foreground silhouette layer (hills, tree, house).
    // Same fraction-based positioning so resize is free.
    _pwsPrecomputeHills();
    _pwsPrecomputeTree();
    _pwsPrecomputeHouse();
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
