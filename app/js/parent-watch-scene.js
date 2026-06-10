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

  // Portal restructure (2026-06-09) -- hero lockup kicker greeting.
  // Returns the time-of-day phrase keyed to the local clock. Step 3
  // (parent-celestial.js) concatenates the parent's first name to
  // produce the final lockup kicker text ("Good evening, Jason").
  // Four buckets match social greeting convention; the overnight
  // bucket (22-5) reads as "Good night" which is the standard form
  // when a parent checks in late.
  function _pwsTimeKicker(hour){
    if (hour >= 5  && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
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

  // ── Step 1 (2026-06-09) -- image-based hero variant ──────
  // Picks day vs night photograph based on the same nightOp
  // gate the (now-retired) atmospheric layers used, so the
  // image swap aligns with the sky transition the user
  // experienced before. Threshold is 0.5: day window runs
  // ~06:30 through ~20:15, night otherwise. This puts the
  // crossover inside the dawn (5.5-7.5) and dusk (19.0-21.5)
  // bands so the image flips midway through the kicker's
  // "Good morning" / "Good evening" buckets rather than at
  // their edges.
  //
  // Idempotent via _state.lastVariant -- repeated paints in
  // the same bucket touch the DOM zero times. Reset on
  // teardown so a fresh mount re-applies unconditionally.
  function _pwsApplyHeroVariant(hour){
    if (!_state.heroBox) return;
    const isNight = _pwsNightOpacity(hour) >= 0.5;
    const cls      = isNight ? 'pch-hero-night' : 'pch-hero-day';
    if (_state.lastVariant === cls) return;
    const otherCls = isNight ? 'pch-hero-day'   : 'pch-hero-night';
    _state.heroBox.classList.add(cls);
    _state.heroBox.classList.remove(otherCls);
    const img = document.getElementById('pchHeroImg');
    if (img) {
      // Absolute path (2026-06-10). The app is served at /app
      // (NO trailing slash), so a relative "img/..." resolves
      // against the page URL's parent -- /img/... -- which 404s.
      // Absolute /app/img/... is correct regardless of trailing-
      // slash behavior or rewrite quirks. Same fix in the inline
      // HTML src at index.html ~15722. watch-day.webp = golden
      // meadow; watch-night.webp = moonlit farmhouse.
      const src = isNight ? '/app/img/watch-night.webp' : '/app/img/watch-day.webp';
      if (img.getAttribute('src') !== src) {
        img.setAttribute('src', src);
      }
    }
    _state.lastVariant = cls;
    // Step 2 (2026-06-09) -- re-seed the day-leaf pool on every
    // variant switch. day->night clears so memory is freed for
    // the time the night image is up; night->day clears so the
    // next day frame's lazy init repopulates with fresh positions
    // matching whatever the canvas dims are now.
    _state.leaves = null;
    _state.leavesLastT = null;
  }
  // ── State (module-scoped singleton) ───────────────────────
  const _state = {
    canvas: null,
    ctx: null,
    host: null,
    // Portal restructure (2026-06-09) -- the .pch-hero wrapper
    // inside #parentCelestialHome. Canvas dims track THIS, not the
    // host (which now extends past the hero to include the .pch-shell
    // dashboard content below). Set in renderParentWatchScene mount.
    heroBox: null,
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
    house: null,
    // Polish D (2026-06-09) -- high-altitude cirrus wisps. 3 frozen
    // elliptical shapes precomputed once, painted as a second
    // daytime cloud register above the existing drifting cumulus
    // for two altitude bands instead of one.
    wisps: null,
    // Polish E (2026-06-09) -- Watch gate stop flag. Set true by
    // window.stopParentWatchScene when the user clicks "Step inside"
    // and the splash is replaced by the dashboard. _pwsShouldRun
    // returns false while this is true so IO/visibility wakeups
    // don't restart the RAF loop on a hidden canvas. Reset to false
    // on every not-entered renderParentWatchScene mount so a teardown
    // + fresh mount can resume.
    stopped: false,
    // Step 1 (2026-06-09) -- image-based hero. Tracks which variant
    // class is currently on the .pch-hero box so _pwsApplyHeroVariant
    // can skip DOM writes when the bucket has not changed since the
    // last paint. Reset to null on teardown so a fresh mount re-applies
    // the variant unconditionally.
    lastVariant: null,
    // Step 2 (2026-06-09) -- day-leaf particle pool. Lazily
    // initialized by the day-bucket branch in _pwsPaint (first day
    // frame of a mount) and re-seeded on variant switch + on the
    // return-to-splash re-measure so leaf positions always match
    // current canvas dims. leavesLastT holds the last paint time
    // in ms for dt-based motion integration.
    leaves: null,
    leavesLastT: null
  };

  function _pwsSizeCanvas(){
    if (!_state.canvas) return;
    // Portal restructure (2026-06-09) -- prefer the .pch-hero box
    // for sizing so the canvas fills exactly the hero viewport. The
    // host (#parentCelestialHome) is now MUCH taller than the hero
    // because the .pch-shell dashboard content sits below as a
    // sibling; sizing to host would paint the canvas through the
    // dashboard area too. Falls back to host when heroBox is null
    // (defensive: stale cached index.html without the .pch-hero
    // wrapper, or pre-portal classic mode).
    const box = _state.heroBox || _state.host;
    if (!box) return;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const w = box.clientWidth  || 0;
    const h = box.clientHeight || 0;
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

  // Portal restructure (2026-06-09) -- measure the distance from
  // the top of the document to the top of #parentCelestialHome and
  // write it to --pch-hero-offset on the host. The scoped CSS uses
  // this variable to size .pch-hero to exactly the visible viewport
  // minus the scrollable chrome above it (Parent Hub .sh header +
  // back/lock row + child selector + ph-home-crumb + greeting +
  // summary lines). When the variable is unset, the CSS falls back
  // to approximated constants (325px desktop / 300px mobile).
  //
  // We measure rect.top + scrollY so the value is correct regardless
  // of the user's current scroll position -- it's the offset from
  // document origin to the hero's top edge, which equals the chrome
  // height above the hero. Called at mount and on every resize.
  function _pwsMeasureHeroOffset(){
    if (!_state.host) return;
    try {
      const rect = _state.host.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const topAtDocOrigin = Math.max(0, Math.round(rect.top + scrollY));
      _state.host.style.setProperty('--pch-hero-offset', topAtDocOrigin + 'px');
    } catch(_e){}
  }

  // ── W2 — precompute static layer positions once at mount ──
  // Each entry stores position as a fraction of canvas dims so
  // the layout survives any resize without re-randomization
  // (we don't want stars to teleport when the user rotates a
  // phone). Each function is idempotent — skips when its state
  // slice is already populated. Called from renderParentWatchScene
  // after _pwsSizeCanvas. Teardown nulls all three so a fresh
  // mount gets a freshly randomized field.

  // Night star field tuning (Step 2, 2026-06-09) -- constants
  // promoted so density / placement region / twinkle band can
  // be retuned without hunting through paint code. The default
  // STAR_REGION_Y of 0.50 keeps stars in the UPPER half of the
  // canvas only (sky), so they don't paint over the dark hills
  // / house silhouette in the lower half of the night photo.
  // Twinkle band kept on the slower side of "gentle" -- 3-8s.
  const STAR_COUNT          = 75;
  const STAR_NAMED_COUNT    = 5;
  const STAR_REGION_Y       = 0.50;   // upper bound for star yf (0=top, 1=bottom)
  const STAR_BASE_OP_MIN    = 0.35;
  const STAR_BASE_OP_MAX    = 0.80;
  const STAR_TWINKLE_MIN_MS = 3000;
  const STAR_TWINKLE_MAX_MS = 8000;

  function _pwsPrecomputeStars(){
    if (_state.stars) return;
    const stars = [];
    const namedIdxs = {};
    let picked = 0;
    while (picked < STAR_NAMED_COUNT) {
      const i = Math.floor(Math.random() * STAR_COUNT);
      if (!namedIdxs[i]) { namedIdxs[i] = true; picked++; }
    }
    const tpSpan = STAR_TWINKLE_MAX_MS - STAR_TWINKLE_MIN_MS;
    const opSpan = STAR_BASE_OP_MAX - STAR_BASE_OP_MIN;
    for (let i = 0; i < STAR_COUNT; i++) {
      const named = !!namedIdxs[i];
      const tier = Math.random();
      const r = named ? 2.5 : (tier < 0.5 ? 1.0 : tier < 0.85 ? 1.5 : 2.0);
      stars.push({
        xf: Math.random(),
        yf: Math.random() * STAR_REGION_Y,
        r: r,
        baseOp: STAR_BASE_OP_MIN + Math.random() * opSpan,
        tp: STAR_TWINKLE_MIN_MS + Math.random() * tpSpan,
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
    // 2026-06-09 -- shifted xf from 0.62 toward the lower-right
    // corner so the house clears the centered hero lockup column
    // (kicker / title / italic line / "Step inside" CTA) on common
    // desktop widths. At xf 0.80 with wf 0.20 the house body spans
    // 70-90% of canvas width, leaving the middle third for the
    // lockup. Window warmth + house rim follow this xf automatically
    // because their positions cascade from _state.house at paint time.
    const xf     = 0.80;       // body horizontal center (lower-right)
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

  // -- Polish D precompute (2026-06-09) -- cirrus wisps -------
  // 3 high-altitude elliptical shapes for the day-sky depth pass.
  // Frozen (no drift) per the brief, so positions are stored as
  // canvas fractions just like every other precomputed layer.
  // yf range 0.10-0.16 (well above the cumulus cloud band at
  // yf 0.16-0.34). rxRel/ryRel ranges give 80-120px wide x 8-12px
  // tall wisps at a 1200x800 canvas; they scale with viewport.
  function _pwsPrecomputeWisps(){
    if (_state.wisps) return;
    const wisps = [];
    for (let i = 0; i < 3; i++) {
      wisps.push({
        baseXf: 0.15 + Math.random() * 0.7,
        yf:     0.10 + Math.random() * 0.06,
        rxRel:  0.075 + Math.random() * 0.040,  // ~90-135px on 1200w
        ryRel:  0.014 + Math.random() * 0.010,  // ~11-19px on 800h
        rot:    (Math.random() - 0.5) * 0.20    // +/-0.1 rad tilt
      });
    }
    _state.wisps = wisps;
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

  // -- Polish D layer painters (2026-06-09) -- scene-richness pass.
  // ALL additive: every function below paints AFTER an existing
  // layer and only deposits atmospheric warmth/depth on top -- the
  // existing painters are untouched. Each is independently gated
  // by dayOp or nightOp so the new passes appear only when their
  // time-of-day window applies.

  // Horizon haze -- a warm radial wash centered roughly where the
  // horizon meets the lower atmosphere (yf 0.72). Soft amber-cream
  // core that fades to transparent at canvas edge. Gives the day
  // sky atmospheric perspective without adding any new gradient
  // to the sky pass itself. Called BETWEEN sky and clouds.
  function _pwsPaintHorizonHaze(ctx, w, h, dayOp){
    if (dayOp <= 0) return;
    const cx = w * 0.5;
    const cy = h * 0.72;
    const r  = w * 0.9;
    const op = 0.12 * dayOp;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(220, 200, 160, ' + op.toFixed(3) + ')');
    grad.addColorStop(1, 'rgba(220, 200, 160, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Cirrus wisps -- 3 high-altitude elliptical shapes drawn as
  // soft radial gradients (transparent edges) at yf 0.10-0.16,
  // well above the existing cumulus band. Static (no drift) per
  // the brief, so they form a distinct altitude register that
  // doesn't compete with the cumulus motion. Called AFTER clouds.
  function _pwsPaintCirrusWisps(ctx, w, h, dayOp){
    if (dayOp <= 0 || !_state.wisps) return;
    const op = 0.18 * dayOp;
    const wisps = _state.wisps;
    for (let i = 0; i < wisps.length; i++) {
      const wi = wisps[i];
      const cx = wi.baseXf * w;
      const cy = wi.yf * h;
      const rx = wi.rxRel * w;
      const ry = wi.ryRel * h;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(wi.rot);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      grad.addColorStop(0, 'rgba(255, 255, 255, ' + op.toFixed(3) + ')');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, ' + (op * 0.5).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Tree rim REMOVED 2026-06-09 -- the offset-canopy-fill technique
  // rendered as a near-solid white blob over the round canopy on
  // verification. Tree stays as a clean dark silhouette; house rim
  // and window warmth handle the night dimensional cues alone.

  // Window warmth bleed -- a warm radial gradient around each lit
  // window so the windows read as light spilling out into the
  // surrounding dark facade, not flat amber rectangles. Painted
  // BEFORE _pwsPaintHouseWindows so the bleed sits underneath:
  // the window paints the bright amber center, the bleed shows
  // only in the area outside the window rectangle but inside the
  // bleed gradient radius. Gated by nightOp so windows look flat
  // in daylight when there's no contrast to bleed against.
  function _pwsPaintWindowWarmth(ctx, w, h, nightOp){
    if (nightOp <= 0 || !_state.house || !_state.house.windows) return;
    const windows = _state.house.windows;
    const baseAlpha = 0.12 * nightOp;
    for (let i = 0; i < windows.length; i++) {
      const win = windows[i];
      const x  = win.xf * w;
      const y  = win.yf * h;
      const ww = win.wf * w;
      const hh = win.hf * h;
      const cx = x + ww / 2;
      const cy = y + hh / 2;
      const r  = Math.max(ww, hh) * 2.4;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,   'rgba(255, 200, 120, ' + baseAlpha.toFixed(3) + ')');
      grad.addColorStop(0.5, 'rgba(255, 200, 120, ' + (baseAlpha * 0.4).toFixed(3) + ')');
      grad.addColorStop(1,   'rgba(255, 200, 120, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
  }

  // House rim light -- a second ctx.stroke() pass on the roof
  // and body top + left edges at very low white alpha, so the
  // house silhouette reads as a 3D form catching moonlight from
  // upper-left, not a flat dark cutout. Gated nightOp > 0.3.
  // Called AFTER _pwsPaintHouseWindows so the rim is the topmost
  // house-related layer.
  function _pwsPaintHouseRim(ctx, w, h, nightOp){
    if (nightOp <= 0.3 || !_state.house) return;
    const ho = _state.house;
    // Alpha ramps from 0.07 at the gate edge to 0.12 at full night
    const alpha = 0.07 + 0.05 * Math.min(1, (nightOp - 0.3) / 0.7);
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(3) + ')';
    ctx.lineWidth = 0.8;
    ctx.lineCap = 'round';

    const bodyX     = (ho.xf - ho.wf / 2) * w;
    const bodyW     = ho.wf * w;
    const bodyTopY  = (ho.baseYf - ho.bodyHf) * h;
    const bodyBaseY = ho.baseYf * h;
    const eaves     = 0.005 * w;
    const roofPeakY = (ho.baseYf - ho.bodyHf - ho.roofHf) * h;
    const roofPeakX = ho.xf * w;

    // Roof left slope: peak -> left eaves corner
    ctx.beginPath();
    ctx.moveTo(roofPeakX, roofPeakY);
    ctx.lineTo(bodyX - eaves, bodyTopY);
    ctx.stroke();

    // Body top edge
    ctx.beginPath();
    ctx.moveTo(bodyX, bodyTopY);
    ctx.lineTo(bodyX + bodyW, bodyTopY);
    ctx.stroke();

    // Body left edge
    ctx.beginPath();
    ctx.moveTo(bodyX, bodyTopY);
    ctx.lineTo(bodyX, bodyBaseY);
    ctx.stroke();
  }

  // ── Day leaves (Step 2, 2026-06-09) ──────────────────────
  // Drifting-leaf particles for the DAY variant of The Watch
  // splash. Painterly golden-morning-meadow mood: warm sunlit
  // leaves on a gentle breeze, NOT a blizzard. Lazily initialized
  // on the first day-bucket frame and re-seeded on variant switch
  // or return-to-splash re-measure so positions match current
  // canvas dims.
  //
  // Constants kept at the top of this block so density / motion
  // / alpha can be retuned without hunting through paint code.

  const LEAF_COUNT              = 16;    // 2026-06-09 tune -- bumped from 14
  const LEAF_SIZE_MIN           = 16;    // px -- 2026-06-09 tune from 6 (too tiny on the bright meadow)
  const LEAF_SIZE_MAX           = 34;    // px -- 2026-06-09 tune from 14
  const LEAF_DRIFT_MIN          = 8;     // px/s rightward breeze (base)
  const LEAF_DRIFT_MAX          = 22;    // px/s
  const LEAF_FALL_MIN           = -2;    // px/s vertical -- negative = drift up slightly
  const LEAF_FALL_MAX           = 6;     // px/s -- mostly slow float/settle
  const LEAF_ALPHA_MIN          = 0.50;  // 2026-06-09 tune from 0.28 (more solid against bright field)
  const LEAF_ALPHA_MAX          = 0.82;  // 2026-06-09 tune from 0.55
  const LEAF_SPIN_MAX           = 0.6;   // rad/s tumble (signed; per-leaf direction)
  const LEAF_SWAY_AMP_MIN       = 4;     // px horizontal wobble
  const LEAF_SWAY_AMP_MAX       = 14;    // px
  const LEAF_SWAY_PERIOD_MIN_MS = 3000;
  const LEAF_SWAY_PERIOD_MAX_MS = 7000;
  const GUST_PERIOD             = 10;    // s -- shared sine modulating all leaves' vx
  const LOCKUP_KEEPOUT          = true;  // bias spawn toward lower 60% + side edges

  // 2026-06-09 tune -- deeper, more saturated autumn tones that
  // CONTRAST against the bright golden meadow rather than blend
  // into it. The previous pale-gold / amber / sage palette read
  // as washed-out fog against the field; these read as fallen
  // autumn leaves catching the morning light.
  const LEAF_COLORS = [
    [176, 104, 48],    // deep amber / rust
    [108, 128, 58],    // olive green
    [150,  92, 52]     // warm sienna
  ];

  // Random spawn inside the canvas. When LOCKUP_KEEPOUT is true,
  // bias toward the lower 60% of the canvas OR the left/right
  // side gutters of the upper region so the centered "THE WATCH"
  // title stays uncluttered. Not a hard mask -- a few leaves
  // still pass through the upper-center band as they drift, which
  // reads as natural variation rather than a wall.
  function _pwsRandLeafSpawnXY(w, h){
    if (LOCKUP_KEEPOUT){
      if (Math.random() < 0.60){
        return { x: Math.random() * w, y: h * 0.40 + Math.random() * h * 0.60 };
      }
      const y = Math.random() * h * 0.40;
      const x = Math.random() < 0.5
        ? Math.random() * w * 0.20
        : w * 0.80 + Math.random() * w * 0.20;
      return { x: x, y: y };
    }
    return { x: Math.random() * w, y: Math.random() * h };
  }

  // Factory for a single leaf at a given canvas size. initial=true
  // scatters across the keepout-biased canvas (first-mount + reseed);
  // initial=false respawns at the left/top edge (recycled when off
  // the right/bottom edge).
  function _pwsCreateLeaf(w, h, initial){
    let x, y;
    if (initial){
      const xy = _pwsRandLeafSpawnXY(w, h);
      x = xy.x; y = xy.y;
    } else {
      // Most leaves drift rightward, so the common respawn is off
      // the left edge. The 15% top-edge variant covers the rare
      // upward-vy leaf that exits through the top.
      if (Math.random() < 0.85){
        x = -20 - Math.random() * 40;
        const xy = _pwsRandLeafSpawnXY(w, h);
        y = xy.y;
      } else {
        x = Math.random() * w;
        y = -20 - Math.random() * 40;
      }
    }
    const size = LEAF_SIZE_MIN + Math.random() * (LEAF_SIZE_MAX - LEAF_SIZE_MIN);
    const vx0  = LEAF_DRIFT_MIN + Math.random() * (LEAF_DRIFT_MAX - LEAF_DRIFT_MIN);
    const vy   = LEAF_FALL_MIN  + Math.random() * (LEAF_FALL_MAX  - LEAF_FALL_MIN);
    const swayAmp    = LEAF_SWAY_AMP_MIN + Math.random() * (LEAF_SWAY_AMP_MAX - LEAF_SWAY_AMP_MIN);
    const swayPeriod = LEAF_SWAY_PERIOD_MIN_MS + Math.random() * (LEAF_SWAY_PERIOD_MAX_MS - LEAF_SWAY_PERIOD_MIN_MS);
    const swayPhase  = Math.random() * Math.PI * 2;
    const angle = Math.random() * Math.PI * 2;
    const spin  = (Math.random() - 0.5) * 2 * LEAF_SPIN_MAX;
    const alpha = LEAF_ALPHA_MIN + Math.random() * (LEAF_ALPHA_MAX - LEAF_ALPHA_MIN);
    const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
    return {
      x: x, y: y, size: size,
      vx0: vx0, vy: vy,
      swayAmp: swayAmp, swayPeriod: swayPeriod, swayPhase: swayPhase,
      angle: angle, spin: spin,
      alpha: alpha, color: color
    };
  }

  // Lazily populate _state.leaves on the first day-bucket frame.
  // Idempotent: skips if already populated. Re-seed paths null
  // _state.leaves first, then this re-populates on the next paint.
  function _pwsPrecomputeLeaves(){
    if (_state.leaves) return;
    const w = _state.w, h = _state.h;
    if (w === 0 || h === 0) return;
    const leaves = [];
    for (let i = 0; i < LEAF_COUNT; i++){
      leaves.push(_pwsCreateLeaf(w, h, true));
    }
    _state.leaves = leaves;
    _state.leavesLastT = 0;
  }

  // Update + draw the leaf pool. dt comes from the previous paint
  // timestamp (clamped to 100ms so a tab-refocus after a long pause
  // doesn't teleport leaves halfway across the canvas). When frozen
  // (reduced motion), positions don't advance and angles don't
  // spin -- matches how _pwsPaintStars handles the same flag (still
  // painted, just static).
  function _pwsPaintLeaves(ctx, w, h, nowMs, dayOp, frozen){
    const leaves = _state.leaves;
    if (!leaves) return;

    const last = _state.leavesLastT || nowMs;
    const dtMs = Math.min(Math.max(0, nowMs - last), 100);
    _state.leavesLastT = nowMs;
    const dt = frozen ? 0 : dtMs / 1000;

    // Shared cohesive gust -- single sine across all leaves so a
    // gust reads as one breeze, not 14 independent twitches. Factor
    // stays in [0.5, 1.5] so leaves always drift rightward.
    const gust = 1 + 0.5 * Math.sin(nowMs / (GUST_PERIOD * 1000) * Math.PI * 2);

    for (let i = 0; i < leaves.length; i++){
      const L = leaves[i];

      if (dt > 0){
        L.x += L.vx0 * gust * dt;
        L.y += L.vy * dt;
        L.angle += L.spin * dt;
      }

      // Visual position adds a small sway on top of the linear x.
      const sway = L.swayAmp * Math.sin(nowMs / L.swayPeriod * Math.PI * 2 + L.swayPhase);
      const dx = L.x + sway;
      const dy = L.y;

      // Recycle off the right OR bottom edges -- respawn at left/
      // top with a fresh randomization (size, color, velocities).
      if (dx > w + 30 || dy > h + 30){
        const fresh = _pwsCreateLeaf(w, h, false);
        L.x = fresh.x; L.y = fresh.y;
        L.size = fresh.size;
        L.vx0 = fresh.vx0; L.vy = fresh.vy;
        L.swayAmp = fresh.swayAmp;
        L.swayPeriod = fresh.swayPeriod;
        L.swayPhase = fresh.swayPhase;
        L.angle = fresh.angle; L.spin = fresh.spin;
        L.alpha = fresh.alpha; L.color = fresh.color;
        continue;
      }

      const alpha = L.alpha * dayOp;
      if (alpha < 0.02) continue;
      const r = L.color[0], g = L.color[1], b = L.color[2];

      // Almond/lens silhouette via two quadratic curves to a point
      // at each end. width:length ~ 0.5 reads as a leaf rather than
      // a disc or seed.
      const halfL = L.size * 0.5;
      const halfW = L.size * 0.25;

      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(L.angle);
      ctx.beginPath();
      ctx.moveTo(-halfL, 0);
      ctx.quadraticCurveTo(0, -halfW, halfL, 0);
      ctx.quadraticCurveTo(0,  halfW, -halfL, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(3) + ')';
      ctx.fill();

      // Faint center vein -- darker tint of the same leaf color.
      const vr = (r * 0.6) | 0;
      const vg = (g * 0.6) | 0;
      const vb = (b * 0.6) | 0;
      ctx.beginPath();
      ctx.moveTo(-halfL * 0.85, 0);
      ctx.lineTo(halfL * 0.85, 0);
      ctx.strokeStyle = 'rgba(' + vr + ',' + vg + ',' + vb + ',' + (alpha * 0.65).toFixed(3) + ')';
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }
  }

  function _pwsPaint(){
    const ctx = _state.ctx;
    if (!ctx) return;
    const w = _state.w, h = _state.h;
    if (w === 0 || h === 0) return;
    const hour  = _pwsCurrentHour();
    const nowMs = Date.now();

    // Step 1 (2026-06-09) -- pick day/night image variant before any
    // canvas paint so the image layer beneath the canvas is in the
    // correct bucket. Idempotent via _state.lastVariant -- repeated
    // paints in the same bucket are no-ops.
    _pwsApplyHeroVariant(hour);

    // Step 1 (2026-06-09) -- canvas is a TRANSPARENT motion overlay
    // above the day/night photograph. The opaque procedural sky /
    // cloud / hill / tree / house / window / rim painters are
    // retired (the image carries those layers); their precompute
    // calls are gated off in renderParentWatchScene. clearRect with
    // no prior fill leaves an alpha:0 canvas.
    ctx.clearRect(0, 0, w, h);

    const nightOp = _pwsNightOpacity(hour);

    // Step 2 (2026-06-09) -- branch on the same 0.5 threshold the
    // image variant swap uses, so the motion overlay always matches
    // the photo showing through. Single clean crossover -- no
    // simultaneous stars + leaves (would read as noise).
    if (nightOp >= 0.5) {
      // NIGHT -- twinkling stars (gentle, biased to upper sky) +
      // occasional shooting stars. Stars are precomputed at mount;
      // leaves are not consumed on this branch.
      if (_state.stars) {
        _pwsPaintStars(ctx, w, h, nowMs, nightOp, _state.reducedMotion);
      }
      if (!_state.reducedMotion && _state.shootingStars) {
        _pwsPaintShootingStars(ctx, w, h, nowMs);
      }
    } else {
      // DAY -- drifting leaves on a gentle breeze. Lazy init the
      // pool here so it picks up the current canvas dims (the
      // mount path doesn't precompute leaves; variant switch and
      // return-to-splash both null _state.leaves so the next day
      // paint lazily repopulates against fresh dims).
      if (!_state.leaves) {
        _pwsPrecomputeLeaves();
      }
      if (_state.leaves) {
        const dayOp = 1 - nightOp;
        _pwsPaintLeaves(ctx, w, h, nowMs, dayOp, _state.reducedMotion);
      }
    }
  }

  function _pwsShouldRun(){
    // Polish E (2026-06-09) -- !_state.stopped check ensures the
    // loop stays dead after the user crosses the Watch gate, even
    // if IO/visibility wakeups try to schedule a frame on the
    // hidden canvas.
    return _state.hostVisible && _state.tabVisible && !_state.reducedMotion && !_state.stopped;
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
      // Portal restructure: measure offset BEFORE size so the CSS
      // calc has the fresh --pch-hero-offset before the canvas reads
      // .pch-hero clientHeight. Order matters: chrome above the hero
      // can shift on viewport resize (font reflow, mobile address bar
      // collapse, orientation change).
      _pwsMeasureHeroOffset();
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
    // Portal restructure -- drop the heroBox reference so a fresh
    // mount re-queries the .pch-hero element (in case the DOM was
    // replaced, e.g. SPA navigation that swaps the parent home tree).
    _state.heroBox = null;
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
    // Polish D -- drop the wisps precompute so the next mount
    // re-randomizes the cirrus positions.
    _state.wisps = null;
    // Step 1 (2026-06-09) -- clear the variant stamp so a fresh
    // mount re-applies the image + class regardless of which
    // bucket the prior mount left the .pch-hero in.
    _state.lastVariant = null;
    // Step 2 (2026-06-09) -- drop the day-leaf pool so a fresh
    // mount respawns leaves with current canvas dims and fresh
    // randomization. Stars/shooting-stars are nulled above in the
    // W2 block; same lifecycle here.
    _state.leaves = null;
    _state.leavesLastT = null;
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

    // Polish E (2026-06-09) -- Watch gate. If the user has already
    // stepped through this session, parent-celestial.js applies
    // .pch-entered to the host BEFORE this function runs. Bail
    // before any allocation -- canvas is hidden via CSS and there
    // is nothing to paint. The gate is one-way per session: once
    // entered, refresh restarts the session and shows the splash
    // again.
    if (host.classList.contains('pch-entered')) {
      return;
    }
    // Not entered -- reset the stop flag in case a prior mount on
    // this module instance set it (defensive against teardown +
    // fresh mount edge cases).
    _state.stopped = false;

    const canvas = document.getElementById('pchSceneCanvas');
    if (!canvas) return;

    // If we've already mounted on this canvas instance, just
    // make sure the loop is awake and dims are current. Fast path
    // for the common case where renderParentCelestialHome fires
    // on every save event.
    //
    // Splash takeover follow-up (2026-06-09) -- also re-measure
    // --pch-hero-offset here. _pchReturnToSplash hits this path
    // (canvas is still cached from the original splash mount),
    // and a prior resize that fired during entered mode could
    // have written an inflated offset (chrome was visible then).
    // The CSS :has() rule has already hidden the chrome by the
    // time we measure, so this call captures the correct splash
    // offset before _pwsSizeCanvas reads .pch-hero clientHeight.
    if (_state.canvas === canvas) {
      _pwsMeasureHeroOffset();
      _pwsSizeCanvas();
      // Step 2 (2026-06-09) -- re-seed the day-leaf pool. Canvas
      // dims may have changed while on the entered dashboard;
      // clearing here means the next day-paint's lazy init builds
      // a fresh pool sized to the new .pch-hero. Stars are stored
      // as fractions so they don't need reseeding.
      _state.leaves = null;
      _state.leavesLastT = null;
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
    // Portal restructure -- find the .pch-hero wrapper that contains
    // the canvas. _pwsSizeCanvas reads its clientWidth/Height so the
    // canvas fills exactly the hero viewport, not the full host (which
    // extends past the hero into the .pch-shell dashboard below).
    _state.heroBox = host.querySelector('.pch-hero');
    _state.reducedMotion = _pwsReducedMotion();
    _state.tabVisible    = (document.visibilityState === 'visible');
    _state.hostVisible   = (host.offsetParent !== null);

    // Measure --pch-hero-offset BEFORE _pwsSizeCanvas so the CSS calc
    // resolves to the correct .pch-hero height before we read its
    // clientHeight for the canvas backing store.
    _pwsMeasureHeroOffset();
    _pwsSizeCanvas();
    // Stars + shooting-star slots stay precomputed -- they paint
    // as twinkle + streaks over the night image (Step 1 keeps
    // these on the night path).
    _pwsPrecomputeStars();
    _pwsPrecomputeShootingStars();
    // Step 1 (2026-06-09) -- clouds, hills, tree, house, and wisps
    // precomputes are gated off. Their painters are retired (the
    // image layer carries the sky/landscape/farmhouse), so the
    // allocated arrays would never be consumed. Functions remain
    // defined below in case Step 2+ revives any pass.
    //   _pwsPrecomputeClouds();
    //   _pwsPrecomputeHills();
    //   _pwsPrecomputeTree();
    //   _pwsPrecomputeHouse();
    //   _pwsPrecomputeWisps();
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
    // Portal restructure (2026-06-09) -- expose the time-of-day
    // helpers so Step 3 (parent-celestial.js) can render the lockup
    // kicker without duplicating the SKY_KEYFRAMES vocabulary.
    window._pwsCurrentHour = _pwsCurrentHour;
    window._pwsTimeKicker  = _pwsTimeKicker;
    // Polish E (2026-06-09) -- Watch gate halt. Called by
    // parent-celestial.js when the user clicks "Step inside" so
    // the RAF loop stops painting to the hidden canvas. The
    // _state.stopped flag prevents _pwsShouldRun from rescheduling
    // on visibility / intersection wakeups for the rest of the
    // session. No teardown -- state stays intact in case the user
    // refreshes (page reload re-initializes the module).
    window.stopParentWatchScene = function(){
      _state.stopped = true;
      if (_state.raf) {
        cancelAnimationFrame(_state.raf);
        _state.raf = null;
      }
    };
  }
})();
