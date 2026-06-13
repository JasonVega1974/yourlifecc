/* =============================================================
   parent-celestial.js
   Part B Phase 3+4 — Parent Celestial Home renderer
   2026-06-08 (Phase 4 cinematic polish)

   Hydrates the static visual structure built in Phase 2 inside
   #parentCelestialHome (app/index.html ~line 15709):

     - Live date stamp in #pchDateLine ("MONDAY · JUNE 8")
     - 4 family stat tiles (chores pending, goals in progress,
       badges today, recent activities — all aggregated across
       _profiles where isParent === false)
     - Constellation SVG: 6 asymmetric nodes inside #pchNodes
       connected by quadratic-curve links inside #pchLinks.
       Each node carries a destination color identity (chores
       green, contests gold, activity cyan, reports violet,
       family rose, controls teal) painted as a colored halo
       around a cream inner star. Hovering a node brightens
       the two adjacent links. The "hot" node (highest pending
       count) carries an extra ripple ring + amplified pulse.
     - 6 Jump-In tiles wired to phNav()
     - Faith card with daily-hashed verse rotation
     - Shooting-star scheduler — random streaks every 8–20s,
       suspended when the parent home isn't visible and
       short-circuited entirely under prefers-reduced-motion.

   Mount strategy:
     - First render builds the full SVG content (nodes + links)
       with the `pch-node--reveal` + `pch-link--draw` classes so
       the constellation reveals itself once.
     - Subsequent renders only rebuild the SVG content when the
       "visual key" (hot slot + chores-pending + recent-activity
       counts) changes. Stat tiles, faith verse, and tile metas
       update on every call — cheap, no animation restart.

   Hook: renderParentHubHome() in parent.js calls
   renderParentCelestialHome() at the end of its body, so
   profile-switch and save-event re-renders already cover.

   Read-only of D + _profiles. Never writes state.
============================================================= */

(function(){
  'use strict';

  // ── Date stamp ────────────────────────────────────────────
  const _PCH_DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const _PCH_MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
                       'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

  function _pchFormatDate(d){
    return _PCH_DAYS[d.getDay()] + ' · ' + _PCH_MONTHS[d.getMonth()] + ' ' + d.getDate();
  }

  // ── Cross-kid data resolver ───────────────────────────────
  function _pchKidData(p){
    if (!p) return null;
    const activeId = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
    if (p.id === activeId && typeof D === 'object' && D) return D;
    return p.data || {};
  }
  function _pchKidProfiles(){
    if (typeof _profiles === 'undefined' || !Array.isArray(_profiles)) return [];
    return _profiles.filter(function(p){ return p && p.isParent === false; });
  }

  // ── Family stat aggregation ───────────────────────────────
  function _pchAggregateStats(){
    const kids = _pchKidProfiles();
    const sources = kids.length > 0
      ? kids.map(_pchKidData)
      : [(typeof D === 'object' && D) ? D : {}];

    const todayISO = new Date().toISOString().slice(0,10);
    const since24h = Date.now() - (24 * 60 * 60 * 1000);

    let choresPending = 0, goalsInProgress = 0, badgesToday = 0, recentActivities = 0;

    sources.forEach(function(data){
      if (!data || typeof data !== 'object') return;

      const cl = Array.isArray(data.choreLog) ? data.choreLog : [];
      choresPending += cl.filter(function(l){ return l && l.status === 'pending'; }).length;
      const pr = Array.isArray(data.purchaseRequests) ? data.purchaseRequests : [];
      choresPending += pr.filter(function(r){ return r && r.status === 'pending'; }).length;

      const gl = Array.isArray(data.goals) ? data.goals : [];
      goalsInProgress += gl.filter(function(g){ return g && !g.done; }).length;

      const al = Array.isArray(data.activityLog) ? data.activityLog : [];
      al.forEach(function(e){
        if (!e) return;
        const isToday = (e.date === todayISO)
          || (typeof e.ts === 'number' && e.ts > 0 && new Date(e.ts).toISOString().slice(0,10) === todayISO);
        if (!isToday) return;
        const ev = String(e.event || '');
        if (ev === 'badge_earned' || ev === 'milestone_earned') badgesToday++;
      });
      al.forEach(function(e){
        if (!e) return;
        const ts = (typeof e.ts === 'number') ? e.ts : (e.time ? Date.parse(e.time) : 0);
        if (ts && ts >= since24h) recentActivities++;
      });
    });

    return { choresPending: choresPending, goalsInProgress: goalsInProgress,
             badgesToday: badgesToday, recentActivities: recentActivities };
  }

  // ── WC-2b-i — family XP today (household pulse for the ring) ─
  // Sum each kid's xpToday and dailyGoal across the same per-kid
  // sources _pchAggregateStats uses. Rollover-correct: a kid's
  // xpToday only counts if their xpDayKey is today, so an inactive
  // kid whose data was last saved yesterday contributes 0 (not a
  // stale figure). Degrades to a single-kid ring for one-child
  // families (sources === [D]).
  function _pchFamilyXp(){
    const todayISO = new Date().toISOString().slice(0,10);
    const kids = _pchKidProfiles();
    const sources = kids.length > 0
      ? kids.map(_pchKidData)
      : [(typeof D === 'object' && D) ? D : {}];
    let today = 0, goal = 0;
    sources.forEach(function(data){
      if (!data || typeof data !== 'object') return;
      if (data.xpDayKey === todayISO) today += (+data.xpToday || 0);
      goal += (+data.dailyGoal > 0) ? +data.dailyGoal : 25;
    });
    return { today: today, goal: goal };
  }

  // ── Verse rotation ────────────────────────────────────────
  function _pchPickVerse(){
    const lib = (typeof MEMORY_VERSE_LIBRARY !== 'undefined' && Array.isArray(MEMORY_VERSE_LIBRARY))
      ? MEMORY_VERSE_LIBRARY
      : (typeof window !== 'undefined' && Array.isArray(window.MEMORY_VERSE_LIBRARY))
        ? window.MEMORY_VERSE_LIBRARY
        : [];
    if (lib.length === 0) {
      return { text: 'Train up a child in the way he should go; even when he is old he will not depart from it.',
               reference: 'Proverbs 22:6' };
    }
    const todayISO = new Date().toISOString().slice(0,10);
    let h = 0;
    for (let i = 0; i < todayISO.length; i++) {
      h = ((h << 5) - h + todayISO.charCodeAt(i)) | 0;
    }
    return lib[Math.abs(h) % lib.length];
  }

  // ── Reduced-motion probe ──────────────────────────────────
  function _pchReducedMotion(){
    try {
      return !!(window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch(_e){ return false; }
  }

  // ── Portal hero lockup helpers (2026-06-09) ───────────────
  // The hero overlay above the canvas carries a kicker greeting
  // ("Good evening, Jason"), a display title, an italic line, and
  // a "Step inside" CTA that smooth-scrolls to the .pch-shell
  // dashboard sibling below. The three helpers below hydrate the
  // kicker text from the live clock + parent name, and wire the
  // CTA once per host.

  // Parent's first name -- fallback chain mirrors The Well's
  // renderer (active parent profile -> D.name -> Supabase auth
  // metadata -> email prefix -> "there"). Returns just the first
  // word so the kicker stays compact ("Jason" not "Jason Vega").
  function _pchParentFirstName(){
    let name = '';
    try {
      if (typeof _profiles !== 'undefined' && Array.isArray(_profiles)) {
        const p = _profiles.find(function(p){ return p && p.isParent === true; });
        if (p && p.name) name = p.name;
      }
      if (!name && typeof D === 'object' && D && D.name) name = D.name;
      if (!name && typeof _supaUser !== 'undefined' && _supaUser) {
        const m = _supaUser.user_metadata || {};
        name = m.first_name || m.firstName || m.full_name || m.name || '';
        if (!name && _supaUser.email) name = String(_supaUser.email).split('@')[0];
      }
    } catch(_e){}
    name = String(name || '').trim();
    if (!name) return 'there';
    const firstWord = name.split(/[\s.,]+/)[0];
    return firstWord || 'there';
  }

  // Writes the time-aware kicker into #pchHeroKicker. Sources the
  // phrase from window._pwsTimeKicker(window._pwsCurrentHour()) --
  // both exposed by parent-watch-scene.js. Cheap enough to call on
  // every render so the kicker stays accurate even if the user
  // keeps the dash open across a clock-bucket boundary.
  function _pchUpdateHeroKicker(){
    const el = document.getElementById('pchHeroKicker');
    if (!el) return;
    let phrase = 'Good evening';
    if (typeof window._pwsCurrentHour === 'function'
        && typeof window._pwsTimeKicker  === 'function') {
      try { phrase = window._pwsTimeKicker(window._pwsCurrentHour()); } catch(_e){}
    }
    el.textContent = phrase + ', ' + _pchParentFirstName();
  }

  // -- Watch gate (Polish E, 2026-06-09) ---------------------
  // The Watch behaves as a hard gate once per session, matching
  // The Well: splash by default, "Step inside" enters the
  // dashboard as a separate view. The gate is persisted in
  // sessionStorage scoped per Supabase user via _ylccUserKey()
  // (key: "watch_entered"). Refresh or new tab returns to the
  // splash; navigating within the session does not re-gate.
  //
  // The class .pch-entered on #parentCelestialHome is the single
  // source of truth for the rendered state: CSS in index.html
  // toggles .pch-hero and #pchContent visibility off that class.
  // renderParentCelestialHome reads the session flag at the very
  // top of every render and applies the class BEFORE the scene
  // module mounts, so the splash never flashes when the gate has
  // already been crossed.

  function _pchWatchEnteredKey(){
    const base = 'watch_entered';
    return (typeof _ylccUserKey === 'function') ? _ylccUserKey(base) : (base + '_local');
  }

  function _pchHasEnteredWatch(){
    try { return sessionStorage.getItem(_pchWatchEnteredKey()) === '1'; }
    catch(_e){ return false; }
  }

  function _pchSetEnteredWatch(){
    try { sessionStorage.setItem(_pchWatchEnteredKey(), '1'); } catch(_e){}
  }

  // Polish E follow-up (2026-06-09) -- Home control returns to The
  // Watch splash. Mirrors the "Step inside" reverse: clear the
  // session flag, remove .pch-entered, and re-render the parent
  // home so the splash paints. parent-watch-scene.js sees no
  // .pch-entered class on its next mount, resets _state.stopped to
  // false on the not-entered path, takes the canvas fast path,
  // and calls _pwsWake to reschedule the RAF loop -- scene resumes
  // from frozen state without a teardown.
  function _pchClearEnteredWatch(){
    try { sessionStorage.removeItem(_pchWatchEnteredKey()); } catch(_e){}
  }

  function _pchReturnToSplash(){
    _pchClearEnteredWatch();
    const host = document.getElementById('parentCelestialHome');
    if (host) host.classList.remove('pch-entered');
    // phNav('home') is the standard parent-hub home route and re-
    // fires renderParentHubHome which in turn calls
    // renderParentCelestialHome -- that path re-mounts the scene
    // (canvas fast path + _state.stopped reset + _pwsWake) so RAF
    // resumes and the splash renders. Fallback to a direct render
    // call if phNav is somehow unavailable.
    if (typeof phNav === 'function') {
      phNav('home');
    } else if (typeof renderParentCelestialHome === 'function') {
      renderParentCelestialHome();
    }
  }

  // Wires #pchHeroStep to the enter-Watch toggle. Click sets the
  // session flag, applies .pch-entered to the host (CSS handles
  // the visibility flip), and stops the scene's RAF loop since
  // the canvas is now display:none for the rest of the session.
  // Idempotent via host._pchStepWired so render-on-save events
  // do not stack duplicate handlers.
  function _pchWireHeroStepInside(host){
    if (!host || host._pchStepWired) return;
    const btn = document.getElementById('pchHeroStep');
    if (!btn) return;
    host._pchStepWired = true;
    btn.addEventListener('click', function(){
      _pchSetEnteredWatch();
      host.classList.add('pch-entered');
      // Halt the scene RAF loop -- canvas is hidden for the
      // remainder of the session, no point painting it.
      if (typeof window.stopParentWatchScene === 'function') {
        window.stopParentWatchScene();
      }
      // Move keyboard focus into the revealed dashboard so it
      // doesn't drop to <body> when the hero disappears. Target
      // #pchContent itself with tabindex=-1; setting the attribute
      // here (rather than in markup) keeps this file self-contained
      // and is idempotent on repeat clicks. focus() is instant in
      // every browser -- no reduced-motion branch needed.
      const dashTarget = document.getElementById('pchContent');
      if (dashTarget) {
        dashTarget.setAttribute('tabindex', '-1');
        try { dashTarget.focus(); } catch(_e){}
      }
    });
  }

  // ── Constellation node table ──────────────────────────────
  // 2026-06-11 world-class rebuild: 8 stars arranged as an open
  // chain along a low-profile horizon. Each star carries a
  // magnitude tier (bright / mid / dim) that drives its radii
  // table — bright stars get the largest bloom + diffraction
  // spikes, mid stars are the body of the chain, dim stars sit
  // between as connecting points of light. The cyan/violet
  // category cycle is retired here: every star paints in the
  // splash's brass-lantern palette (warm-white core + amber
  // halo/bloom) so the constellation reads as one continuous
  // language with the day/night hero photos overhead.
  function _pchBuildNodes(stats){
    return [
      { slot:'chores',    label:'Chores',    mag:'bright',
        x: 34, y:140, count: stats.choresPending,     phase:    0, labelAbove:true  },
      { slot:'contests',  label:'Contests',  mag:'dim',
        x: 94, y:212, count: 0,                       phase:  525, labelAbove:false },
      { slot:'activity',  label:'Activity',  mag:'mid',
        x:164, y:234, count: 0,                       phase: 1050, labelAbove:false },
      { slot:'reports',   label:'Reports',   mag:'mid',
        x:224, y:152, count: 0,                       phase: 1575, labelAbove:true  },
      { slot:'family',    label:'Family',    mag:'bright',
        x:284, y: 94, count: 0,                       phase: 2100, labelAbove:true  },
      { slot:'controls',  label:'Controls',  mag:'dim',
        x:344, y:164, count: 0,                       phase: 2625, labelAbove:false },
      { slot:'allowance', label:'Allowance', mag:'dim',
        x:404, y:120, count: 0,                       phase: 3150, labelAbove:true  },
      { slot:'rewards',   label:'Rewards',   mag:'mid',
        x:430, y:230, count: 0,                       phase: 3675, labelAbove:false }
    ];
  }

  // ── Magnitude radii table -- moved to constellation-kit.js
  //    (2026-06-12). Parent reads window.ckMagRadii for the
  //    one local need (hot ripple radius); star fragments
  //    come from window.ckBuildStar so the kit owns the tier
  //    values end-to-end.

  // ── Per-node breathe periods (2026-06-11) ─────────────────
  // Varied 4.5s-6.5s across the 8 nodes (derived from index so
  // the spread is stable on every render). Inline CSS variable
  // --starBreathePeriod on each node's <g> drives the .pch-node
  // animation-duration, and the .star-halo opacity pulse
  // inherits the same var so each star's halo breathes with its
  // own core. Combined with the existing per-node phase delay,
  // the eight stars stagger visibly out of unison.
  const PERIODS = [4500, 6250, 5750, 5250, 4750, 6500, 6000, 5500];

  // ── Micro-starfield (2026-06-11) ──────────────────────────
  // 22 hardcoded faint stars scattered in the negative space
  // around the chain. Six twinkle on individual slow periods so
  // the field shimmers. Positions are picked manually to clear
  // every node + label keepout box. Two color families (warm
  // white + warm amber) so the field feels like the photo's
  // brass-lantern atmosphere extends into the SVG widget.
  // x-coords scaled by 1.2 (Pass 2, 2026-06-11) for the wider
  // 480-unit viewBox. y-coords unchanged. Hand-verified to keep
  // clear of every node bloom + label keepout box at the new
  // node positions (chores 34,140 .. rewards 430,230).
  const MICROFIELD = [
    { x: 18, y: 12,  r:0.9, fill:'#FFF7E0', op:.50 },
    { x: 78, y: 30,  r:0.7, fill:'#FFF7E0', op:.45, twinkle:5200 },
    { x:130, y: 18,  r:1.0, fill:'#FBBF24', op:.60 },
    { x:210, y: 25,  r:0.6, fill:'#FFF7E0', op:.40, twinkle:3500 },
    { x:264, y: 45,  r:0.8, fill:'#FFF7E0', op:.55 },
    { x:348, y: 15,  r:0.7, fill:'#FBBF24', op:.50 },
    { x:408, y: 38,  r:0.9, fill:'#FFF7E0', op:.55, twinkle:6100 },
    { x:462, y: 22,  r:0.6, fill:'#FFF7E0', op:.40 },
    { x: 12, y: 70,  r:0.7, fill:'#FFF7E0', op:.40 },
    { x: 90, y:108,  r:0.6, fill:'#FBBF24', op:.45 },
    { x:156, y:170,  r:0.8, fill:'#FFF7E0', op:.50, twinkle:4400 },
    { x:216, y:108,  r:0.7, fill:'#FFF7E0', op:.45 },
    { x:466, y:170,  r:0.8, fill:'#FFF7E0', op:.55 },
    { x: 22, y:230,  r:0.6, fill:'#FFF7E0', op:.40 },
    { x:288, y:180,  r:0.7, fill:'#FFF7E0', op:.50 },
    { x:396, y:218,  r:0.9, fill:'#FBBF24', op:.60, twinkle:5800 },
    { x:468, y:195,  r:0.7, fill:'#FFF7E0', op:.45 },
    { x: 42, y:285,  r:0.8, fill:'#FFF7E0', op:.50 },
    { x:106, y:278,  r:0.6, fill:'#FFF7E0', op:.40, twinkle:4100 },
    { x:258, y:288,  r:0.7, fill:'#FBBF24', op:.55 },
    { x:378, y:285,  r:0.7, fill:'#FFF7E0', op:.45 },
    { x:462, y:288,  r:0.6, fill:'#FFF7E0', op:.40 }
  ];

  // ── Press flare bridge -- moved to constellation-kit.js
  //    (2026-06-12). Parent's onclick now calls
  //    window.ckPressNode(this, function(){phNav('slot')}); the
  //    kit adds .star-node--flare for ~200ms before firing the
  //    route callback. Shared CSS owns the flare keyframe so
  //    the parent and child surfaces flash identically.

  // ── Curve helper -- moved to constellation-kit.js
  //    (2026-06-12). Parent uses window.ckCurvePath(a, b, bow).

  // ── Constellation SVG content ─────────────────────────────
  // Rebuilds #pchLinks + #pchNodes from scratch. Called only on
  // first mount and when the visual key changes (hot slot or
  // count thresholds). Reveal/draw classes apply only on the
  // first mount; subsequent rebuilds skip the one-shot
  // animations so the surface doesn't pop on every save event.
  function _pchRenderConstellation(stats, firstMount){
    const nodesG = document.getElementById('pchNodes');
    const linksG = document.getElementById('pchLinks');
    if (!nodesG || !linksG) return;

    const NODES = _pchBuildNodes(stats);

    // Hottest node — only counts when > 0. Ties resolve to
    // first-in-order (chores wins over activity on equal count).
    let hotIdx = -1, hotMax = 0;
    NODES.forEach(function(n, i){
      if (n.count > hotMax) { hotMax = n.count; hotIdx = i; }
    });

    // ── Microfield prefix (2026-06-11) ──────────────────────
    // 22 tiny background stars rendered BEFORE the chain links
    // so they paint under everything. The static six paint as
    // solid faint dots; the twinkle six get .pch-microfield--
    // twinkle with their period as inline --starTwinklePeriod
    // CSS var. Prepended into linksG so they share the natural
    // SVG z-order with the chain (under .pch-nodes). Rendered
    // via shared kit (window.ckBuildMicrofield, 2026-06-12).
    const microMarkup = (typeof window !== 'undefined' && window.ckBuildMicrofield)
      ? window.ckBuildMicrofield(MICROFIELD)
      : '';

    // ── Links: faint warm base + flowing comet overlay ──────
    // 2026-06-11 rebuild: OPEN chain (no wrap-around). With 8
    // nodes the loop produces 7 segments; bow alternates sign so
    // adjacent curves bend opposite directions along the horizon.
    // Draw-in classes apply only on first mount.
    const bows = [-22, 18, -16, 24, -20, 18, -14];
    let linksMarkup = '';
    for (let i = 0; i < NODES.length - 1; i++) {
      const a = NODES[i];
      const b = NODES[i + 1];
      const d = (window.ckCurvePath || function(){return '';})(a, b, bows[i]);
      const dataAttr = ' data-from="' + a.slot + '" data-to="' + b.slot + '"';
      const drawDelay = firstMount ? (1300 + i * 90) : 0;
      const drawClass = firstMount ? ' pch-link--draw' : '';
      const drawStyle = firstMount ? (' style="animation-delay:' + drawDelay + 'ms;"') : '';
      linksMarkup += '<path pathLength="1" class="pch-link' + drawClass + '"'
                  +    dataAttr + drawStyle + ' d="' + d + '"/>';
      const flowDelay = (i * 1300) % 8000;
      linksMarkup += '<path pathLength="1" class="pch-link--flow"'
                  +    dataAttr
                  +    ' style="animation-delay:-' + flowDelay + 'ms;"'
                  +    ' d="' + d + '"/>';
    }
    linksG.innerHTML = microMarkup + linksMarkup;

    // ── Nodes (world-class rebuild, 2026-06-11) ─────────────
    // Each star is built from 3 stacked circles (bloom, halo,
    // core), per-tier radii from MAG_RADII, plus a diffraction
    // spike pair for bright stars and a companion count badge
    // when the slot has work pending. Labels are uppercase via
    // CSS text-transform + paint-order stroke for legibility
    // over the busy microfield.
    let nodesMarkup = '';
    const kitMag = (typeof window !== 'undefined' && window.ckMagRadii) || null;
    NODES.forEach(function(n, i){
      const hot   = (i === hotIdx);
      const radii = (kitMag && kitMag[n.mag]) || (kitMag && kitMag.mid) || { halo: 5.5 };
      const labelY = n.labelAbove ? (n.y - 16) : (n.y + 26);
      const ariaCt = (n.count > 0) ? (' (' + n.count + ' pending)') : '';
      const aria   = n.label + ' destination' + ariaCt;
      // Wrapper carries .pch-node (parent-specific state hooks)
      // AND .star-node (shared breathe + hover + flare). Mag
      // variant and reveal/hot states stay parent-scoped.
      const cls    = 'pch-node star-node pch-node--mag-' + n.mag
                   + (hot ? ' pch-node--hot' : '')
                   + (firstMount ? ' pch-node--reveal' : '');

      // Per-node breathe period from PERIODS table + phase delay
      // for stagger. CSS reads --starBreathePeriod for both the
      // node breathe and the halo opacity pulse.
      const breathePeriod = PERIODS[i % PERIODS.length];
      const breatheDelay  = '-' + n.phase + 'ms';
      const styleParts = [
        'transform-origin:' + n.x + 'px ' + n.y + 'px',
        '--starBreathePeriod:' + breathePeriod + 'ms'
      ];
      if (firstMount) {
        const revealDelay = (i * 100);
        styleParts.push('animation-delay:' + revealDelay + 'ms,' + (revealDelay + 600) + 'ms'
          + (hot ? ',0ms' : ''));
      } else {
        styleParts.push('animation-delay:' + breatheDelay + (hot ? ',0ms' : ''));
      }
      const style = ' style="' + styleParts.join(';') + ';"';

      let nodeInner = '';

      // Hot ripple (kept) -- parent-only flourish marking the
      // attention-needed slot beyond the count badge. Uses kit
      // halo radius + 6 so the ring sits just outside the halo.
      if (hot) {
        nodeInner += '<circle class="pch-node__ripple" cx="' + n.x + '" cy="' + n.y
                  +     '" r="' + (radii.halo + 6) + '" fill="none"'
                  +     ' stroke="#FBBF24" stroke-width="1.2" stroke-opacity=".55"/>';
      }

      // Star primitive (bloom + halo + core + spikes if bright +
      // badge if count > 0) via shared kit (2026-06-12). Parent
      // omits accent so the brass default (#FBBF24) applies.
      if (typeof window !== 'undefined' && window.ckBuildStar) {
        nodeInner += window.ckBuildStar({
          x: n.x, y: n.y, mag: n.mag, count: n.count
        });
      }

      // Label -- uppercase + star-chart letter-spacing via CSS;
      // the rendered baseline sits at labelY (above or below).
      nodeInner += '<text class="pch-node__label" x="' + n.x + '" y="' + labelY
                +     '">' + n.label + '</text>';

      // Invisible hit area -- generous enough that the label
      // and badge both register as the same tap target.
      nodeInner += '<rect class="pch-node__hit" x="' + (n.x - 24) + '" y="' + (n.y - 24)
                +     '" width="48" height="64" fill="transparent"/>';

      // Onclick goes through window.ckPressNode so the press
      // flare class lands ~120ms BEFORE phNav fires (2026-06-12).
      const onclick = 'window.ckPressNode(this,function(){phNav(\'' + n.slot + '\')})';

      nodesMarkup += '<g class="' + cls + '" tabindex="0" role="button"'
                  +    ' aria-label="' + aria + '"'
                  +    ' data-slot="' + n.slot + '"'
                  +    ' onclick="' + onclick + '"'
                  +    style
                  +    '>' + nodeInner + '</g>';
    });
    nodesG.innerHTML = nodesMarkup;
  }

  // ── Hover bridge ──────────────────────────────────────────
  // Delegated mouseover/mouseout on the host. When the cursor
  // enters a node group, find both links touching that slot
  // and add .pch-link--bright; remove on leave. Bound once per
  // host to avoid stacking listeners on re-render.
  function _pchAttachHoverBridge(host){
    if (!host || host._pchHoverBridgeBound) return;
    host._pchHoverBridgeBound = true;
    host.addEventListener('mouseover', function(e){
      const node = e.target && e.target.closest && e.target.closest('.pch-node');
      if (!node) return;
      const slot = node.getAttribute('data-slot');
      if (!slot) return;
      const links = document.querySelectorAll(
        '#pchLinks [data-from="' + slot + '"], #pchLinks [data-to="' + slot + '"]'
      );
      for (let i = 0; i < links.length; i++) links[i].classList.add('pch-link--bright');
    });
    host.addEventListener('mouseout', function(e){
      const node = e.target && e.target.closest && e.target.closest('.pch-node');
      if (!node) return;
      const links = document.querySelectorAll('#pchLinks .pch-link--bright');
      for (let i = 0; i < links.length; i++) links[i].classList.remove('pch-link--bright');
    });
  }

  // -- Keyboard bridge (Polish C, 2026-06-09) ----------------
  // The constellation nodes are rendered as <g tabindex="0"
  // role="button" onclick="phNav('slot')"> with an inline onclick.
  // Inline onclick on a non-button SVG element does NOT fire on
  // Enter or Space when the node is keyboard-focused, so keyboard
  // and screen reader users could focus the nodes but could not
  // activate them (WCAG 2.1 Level A failure on 2.1.1 Keyboard).
  //
  // This delegated keydown listener fills the gap: when focus is
  // on a node and the user presses Enter or Space, it fires
  // phNav(slot) using the same data-slot attribute the hover
  // bridge reads. Space gets preventDefault() so the page does
  // not scroll on activation.
  //
  // Idempotent via host._pchKeyboardBridgeBound so re-renders do
  // not stack handlers, matching the _pchAttachHoverBridge pattern.
  function _pchAttachKeyboardBridge(host){
    if (!host || host._pchKeyboardBridgeBound) return;
    host._pchKeyboardBridgeBound = true;
    host.addEventListener('keydown', function(e){
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const node = e.target && e.target.closest && e.target.closest('.pch-node');
      if (!node) return;
      const slot = node.getAttribute('data-slot');
      if (!slot) return;
      // Space would scroll the page by default; suppress before
      // routing. Enter has no default scroll behavior but we
      // preventDefault for symmetry and to avoid any other
      // browser-specific activation (e.g. form submission).
      e.preventDefault();
      if (typeof phNav === 'function') phNav(slot);
    });
  }

  // ── Shooting-star scheduler ───────────────────────────────
  // Spawns short streaks across the SVG every 8–20s. Skipped
  // entirely under reduced-motion. Suspends silently when the
  // parent home isn't visible (offsetParent === null) so we
  // don't burn cycles on kid-side sessions.
  function _pchScheduleShootingStars(host){
    if (!host || host._pchShootingScheduled) return;
    if (_pchReducedMotion()) return;
    host._pchShootingScheduled = true;

    const NS = 'http://www.w3.org/2000/svg';

    function spawn(){
      const layer = document.getElementById('pchShootingStars');
      if (!layer) return;
      // Trajectory: start in the upper band, streak diagonally
      // down-right or down-left. Distance scaled for viewBox.
      const fromLeft = Math.random() < 0.55;
      const startX = fromLeft ? (10 + Math.random() * 160) : (240 + Math.random() * 140);
      const startY = -5 + Math.random() * 40;
      const dxMag = 120 + Math.random() * 140;
      const dyMag = 60  + Math.random() * 90;
      const dx = fromLeft ? dxMag : -dxMag;
      const dy = dyMag;
      // Streak length oriented along trajectory
      const len = 16;
      const ang = Math.atan2(dy, dx);
      const x2 = startX + len * Math.cos(ang);
      const y2 = startY + len * Math.sin(ang);

      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', startX.toFixed(1));
      line.setAttribute('y1', startY.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('class', 'pch-shoot');
      line.setAttribute('stroke', 'url(#pchShootGrad)');
      // Trajectory delivered via custom properties consumed by the
      // pch-shoot keyframes; px units relative to the SVG viewBox.
      line.style.setProperty('--dx', dx.toFixed(0) + 'px');
      line.style.setProperty('--dy', dy.toFixed(0) + 'px');
      layer.appendChild(line);
      setTimeout(function(){
        if (line && line.parentNode) line.parentNode.removeChild(line);
      }, 1500);
    }

    function tick(){
      const delay = 8000 + Math.random() * 12000;
      setTimeout(function(){
        const home = document.getElementById('parentCelestialHome');
        if (home && home.offsetParent !== null && !_pchReducedMotion()) {
          spawn();
        }
        tick();
      }, delay);
    }
    // Kick off after the mount reveal settles.
    setTimeout(tick, 3500);
  }

  // ── Tile wiring ───────────────────────────────────────────
  function _pchWireTile(id, slot, meta){
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = false;
    btn.removeAttribute('disabled');
    btn.onclick = function(){ if (typeof phNav === 'function') phNav(slot); };
    const metaEl = btn.querySelector('.pch-tile__meta');
    if (metaEl) {
      if (meta && String(meta).trim()) {
        metaEl.textContent = String(meta);
        metaEl.style.display = '';
      } else {
        metaEl.style.display = 'none';
      }
    }
  }

  // ── Render state (mount once, rebuild only on visual change) ─
  const _state = { mounted: false, lastKey: '' };

  // ── Main entry ────────────────────────────────────────────
  function renderParentCelestialHome(){
    const host = document.getElementById('parentCelestialHome');
    if (!host) return;

    // Polish E (2026-06-09) -- Watch gate. Apply .pch-entered to
    // the host BEFORE any paint when the user has already stepped
    // through during this session, so the splash never flashes.
    // CSS rules in index.html flip .pch-hero and #pchContent
    // visibility off this class. renderParentWatchScene checks
    // for it inside its mount and bails out, skipping the scene
    // setup entirely.
    if (_pchHasEnteredWatch()) {
      host.classList.add('pch-entered');
    }

    // The Watch — W1 hook. parent-watch-scene.js mounts the canvas
    // sky on first call and no-ops on subsequent calls (idempotent
    // via its own _state.canvas guard). Wrapped in typeof check so
    // a missing module fails soft — the Phase 4 widget still
    // renders fine without the cinematic backdrop.
    if (typeof renderParentWatchScene === 'function') renderParentWatchScene();

    // Portal restructure (2026-06-09) -- hydrate the hero lockup
    // kicker with the time-aware greeting + parent's first name,
    // and wire the "Step inside" CTA to smooth-scroll the dashboard
    // (.pch-shell at #pchContent) into view. Both calls are safe
    // when the hero markup is absent (early returns inside).
    _pchUpdateHeroKicker();
    _pchWireHeroStepInside(host);

    // Date stamp
    const dateEl = document.getElementById('pchDateLine');
    if (dateEl) dateEl.textContent = _pchFormatDate(new Date());

    // Family stats
    const stats = _pchAggregateStats();
    const set = function(id, v){
      const el = document.getElementById(id);
      if (el) el.textContent = String(v);
    };
    set('pchStatChores',   stats.choresPending);
    set('pchStatGoals',    stats.goalsInProgress);
    set('pchStatBadges',   stats.badgesToday);
    set('pchStatActivity', stats.recentActivities);

    // WC-2b-i — family XP ring. Same geometry as the child ring
    // (r=26 → circumference ~163.4; arc from 12 o'clock via the
    // markup's -90deg rotation). Hydrate number, arc, met-state.
    const fam = _pchFamilyXp();
    const ringMet = fam.goal > 0 && fam.today >= fam.goal;
    const ringPct = fam.goal > 0 ? Math.min(100, (fam.today / fam.goal) * 100) : 0;
    set('pchXpRingNum', fam.today);
    const ringFill = document.getElementById('pchXpRingFill');
    if (ringFill) {
      const C = 2 * Math.PI * 26;
      ringFill.setAttribute('stroke-dashoffset', (C * (1 - ringPct / 100)).toFixed(1));
    }
    const ringWrap = document.getElementById('pchXpRing');
    if (ringWrap) {
      ringWrap.classList.toggle('pch-xpring--met', ringMet);
      ringWrap.setAttribute('aria-label', fam.today + ' of ' + fam.goal + ' family XP today' + (ringMet ? ', goal met' : ''));
    }
    set('pchXpRingTitle', ringMet ? 'Family goal met' : 'Family XP today');
    set('pchXpRingMeta',  ringMet ? ('+' + fam.today + ' XP today') : (fam.today + ' / ' + fam.goal + ' XP'));

    // Decide whether to rebuild the constellation. The visual
    // key folds in the hot slot + the two counts that actually
    // drive node visuals — so saves that don't change either
    // skip the rebuild and the flow/breathe animations stay in
    // mid-cycle instead of jumping back to t=0.
    let hotSlot = '';
    let hotMax = 0;
    if (stats.choresPending    > hotMax) { hotMax = stats.choresPending;    hotSlot = 'chores';   }
    if (stats.recentActivities > hotMax) { hotMax = stats.recentActivities; hotSlot = 'activity'; }
    const visualKey = hotSlot + '|' + stats.choresPending + '|' + stats.recentActivities;
    const firstMount = !_state.mounted;
    if (firstMount || _state.lastKey !== visualKey) {
      _pchRenderConstellation(stats, firstMount);
      _state.lastKey = visualKey;
      _state.mounted = true;
    }

    // Hover bridge + shooting-star scheduler (idempotent —
    // both guard against double-binding via host flags).
    _pchAttachHoverBridge(host);
    _pchAttachKeyboardBridge(host);
    _pchScheduleShootingStars(host);

    // Faith card
    const fc = document.getElementById('pchFaithCard');
    const fv = document.getElementById('pchFaithVerse');
    const fr = document.getElementById('pchFaithRef');
    const faithOn = !(typeof D === 'object' && D && D.faithMode === false);
    if (fc) {
      if (faithOn) {
        const v = _pchPickVerse();
        if (fv) fv.textContent = v.text || '';
        // Step 5 (portal skill-compliance pass) -- removed
        // .toUpperCase() so the reference renders as "Proverbs 22:6"
        // (matching The Well's verse-attribution style). The
        // .pch-faith__ref CSS rule lost its text-transform:uppercase
        // in Step 4, so this aligns the JS with the CSS intent.
        if (fr) fr.textContent = (v.reference || '');
        fc.style.display = '';
      } else {
        fc.style.display = 'none';
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.renderParentCelestialHome = renderParentCelestialHome;
    // Polish E follow-up (2026-06-09) -- expose the Watch gate
    // clear + return-to-splash helpers so the inline onclick on
    // the parent-hub Home controls in index.html can drive them.
    window._pchClearEnteredWatch = _pchClearEnteredWatch;
    window._pchReturnToSplash    = _pchReturnToSplash;
  }
})();
