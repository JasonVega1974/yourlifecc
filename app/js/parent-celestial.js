/* =============================================================
   parent-celestial.js
   Part B Phase 3 — Parent Celestial Home renderer
   2026-06-08

   Hydrates the static visual structure built in Phase 2 inside
   #parentCelestialHome (app/index.html ~line 15709) with real
   family data:

     - Live date stamp in #pchDateLine ("MONDAY · JUNE 8")
     - 4 family stat tiles (chores pending, goals in progress,
       badges today, recent activities — all aggregated across
       _profiles where isParent === false)
     - Constellation SVG: 6 interactive star nodes inside
       #pchNodes connected by subtle links inside #pchLinks.
       Each node fires phNav() to the matching Parent Hub card.
       The node with the highest pending count renders enlarged
       + amber-tinted (the "subtle pulse" cue; Phase 4 adds the
       actual keyframe animation).
     - 6 Jump-In tiles: removes [disabled] + wires onclick to
       phNav(); replaces the "Wired in Phase 3" meta with a
       live count (or strips the meta entirely when zero).
     - Faith card: unhide when D.faithMode !== false; rotate
       verse from MEMORY_VERSE_LIBRARY by date hash so the
       same verse holds all day and rotates next day.

   Hook: renderParentHubHome() in parent.js calls
   renderParentCelestialHome() at the end of its body, so the
   existing call sites (phNav('home'), refreshDashForCurrentChild,
   etc.) already cover profile switch + save re-renders.

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
  // Returns the data blob for a given kid profile. For the
  // active kid, live D wins (active kid's snapshot may lag
  // mid-session). For non-active kids, p.data is the source.
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
  // All 4 stats walk kid profiles and aggregate. Solo mode
  // (no kid profiles) falls back to live D so the surface still
  // renders sensible numbers for a single-user setup.
  function _pchAggregateStats(){
    const kids = _pchKidProfiles();
    const sources = kids.length > 0
      ? kids.map(_pchKidData)
      : [(typeof D === 'object' && D) ? D : {}];

    const todayISO = new Date().toISOString().slice(0,10);
    const since24h = Date.now() - (24 * 60 * 60 * 1000);

    let choresPending = 0;
    let goalsInProgress = 0;
    let badgesToday = 0;
    let recentActivities = 0;

    sources.forEach(function(data){
      if (!data || typeof data !== 'object') return;

      // Chores pending — D.choreLog entries with status 'pending'
      // (the same shape _phPendingApprovalCount() walks) plus
      // pending purchase requests so the stat matches the strip.
      const cl = Array.isArray(data.choreLog) ? data.choreLog : [];
      choresPending += cl.filter(function(l){ return l && l.status === 'pending'; }).length;
      const pr = Array.isArray(data.purchaseRequests) ? data.purchaseRequests : [];
      choresPending += pr.filter(function(r){ return r && r.status === 'pending'; }).length;

      // Goals in progress — D.goals where !g.done
      const gl = Array.isArray(data.goals) ? data.goals : [];
      goalsInProgress += gl.filter(function(g){ return g && !g.done; }).length;

      // Badges today — D.activityLog entries dated today whose
      // event is badge_earned (chore + health writers) OR
      // milestone_earned (goals.js writes this for goal milestones)
      const al = Array.isArray(data.activityLog) ? data.activityLog : [];
      al.forEach(function(e){
        if (!e) return;
        const isToday = (e.date === todayISO)
          || (typeof e.ts === 'number' && e.ts > 0 && new Date(e.ts).toISOString().slice(0,10) === todayISO);
        if (!isToday) return;
        const ev = String(e.event || '');
        if (ev === 'badge_earned' || ev === 'milestone_earned') badgesToday++;
      });

      // Recent activities — D.activityLog entries within last 24h
      al.forEach(function(e){
        if (!e) return;
        const ts = (typeof e.ts === 'number') ? e.ts : (e.time ? Date.parse(e.time) : 0);
        if (ts && ts >= since24h) recentActivities++;
      });
    });

    return {
      choresPending: choresPending,
      goalsInProgress: goalsInProgress,
      badgesToday: badgesToday,
      recentActivities: recentActivities
    };
  }

  // ── Verse rotation ────────────────────────────────────────
  // Pick a verse from MEMORY_VERSE_LIBRARY by hashing today's
  // ISO date. Same verse all day; different verse next day.
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
    const idx = Math.abs(h) % lib.length;
    return lib[idx];
  }

  // ── Constellation node + link rendering ───────────────────
  // Six nodes positioned around a hexagonal "family ring" in
  // the 400x300 viewBox. The node with the highest pending
  // count enlarges + tints amber as Phase 3's visual cue;
  // Phase 4 wraps a keyframe pulse around it.
  //
  // Coordinates picked to avoid the 12 Phase 2 background
  // stars and to keep labels off the SVG edges.
  function _pchRenderConstellation(stats){
    const nodesG = document.getElementById('pchNodes');
    const linksG = document.getElementById('pchLinks');
    if (!nodesG || !linksG) return;

    // slot, label, (x,y), badge count for the "hottest" rule.
    // Second slot routes to 'contests' (not 'rewards') — the tile
    // labeled "Rewards & contests" leads with Rewards in the
    // copy but the parent intent is the Contests & Family Goals
    // surface, which holds the contest leaderboard alongside
    // family rewards. Constellation label matches the destination
    // ("Contests") for routing clarity.
    const NODES = [
      { slot:'chores',   label:'Chores',   x: 75, y: 95,  count: stats.choresPending      },
      { slot:'contests', label:'Contests', x:185, y: 55,  count: 0                         },
      { slot:'activity', label:'Activity', x:320, y: 90,  count: stats.recentActivities    },
      { slot:'reports',  label:'Reports',  x:310, y:205,  count: 0                         },
      { slot:'family',   label:'Family',   x:200, y:240,  count: 0                         },
      { slot:'controls', label:'Controls', x: 80, y:200,  count: 0                         }
    ];

    // Hottest node — only counted when > 0. Ties resolve to
    // first-in-order (chores wins over activity on equal count).
    let hotIdx = -1;
    let hotMax = 0;
    NODES.forEach(function(n, i){
      if (n.count > hotMax) { hotMax = n.count; hotIdx = i; }
    });

    // Links — hexagonal ring connecting node i to node i+1
    // (and the last back to the first). Subtle cream strokes.
    let linksMarkup = '';
    for (let i = 0; i < NODES.length; i++) {
      const a = NODES[i];
      const b = NODES[(i + 1) % NODES.length];
      linksMarkup += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y
                  + '" stroke="#F1E9D5" stroke-width="0.6" stroke-opacity="0.18"/>';
    }
    linksG.innerHTML = linksMarkup;

    // Nodes — outer halo + star circle + label. Wrapped in a
    // <g> with onclick → phNav(); tabindex on the group keeps
    // keyboard focus possible (Enter/Space handled by the
    // adjacent tile buttons, which cover the same routes).
    let nodesMarkup = '';
    NODES.forEach(function(n, i){
      const hot = (i === hotIdx);
      const r       = hot ? 9 : 6.5;
      const haloR   = hot ? 22 : 16;
      const fill    = hot ? '#FBBF24' : '#F1E9D5';
      const haloFill= hot ? '#FBBF24' : '#F1E9D5';
      const haloOp  = hot ? 0.22 : 0.10;
      const stroke  = hot ? '#FCD34D' : 'rgba(255,255,255,0.25)';
      const labelY  = n.y + 28;
      const onclick = 'phNav(\'' + n.slot + '\')';
      const aria    = n.label + ' destination'
                    + (n.count > 0 ? (' (' + n.count + ' pending)') : '');
      nodesMarkup += '<g class="pch-node" tabindex="0" role="button"'
                  +    ' aria-label="' + aria + '"'
                  +    ' onclick="' + onclick + '"'
                  +    ' style="cursor:pointer;">'
                  +    '<circle cx="' + n.x + '" cy="' + n.y + '" r="' + haloR + '" fill="' + haloFill + '" opacity="' + haloOp + '"/>'
                  +    '<circle cx="' + n.x + '" cy="' + n.y + '" r="' + r + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1"/>'
                  +    '<text x="' + n.x + '" y="' + labelY + '"'
                  +       ' fill="#F1E9D5" font-size="10" font-family="\'Bebas Neue\', sans-serif"'
                  +       ' letter-spacing="0.08em" text-anchor="middle">' + n.label.toUpperCase() + '</text>'
                  +  '</g>';
    });
    nodesG.innerHTML = nodesMarkup;
  }

  // ── Tile wiring ───────────────────────────────────────────
  // Removes [disabled] from each Jump-In tile, attaches the
  // phNav() route, and updates the meta line:
  //   • non-zero count → live count ("3 pending")
  //   • zero count     → meta line removed entirely
  // (matches existing card grid behavior — no shouty zeroes.)
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

  // ── Main entry ────────────────────────────────────────────
  function renderParentCelestialHome(){
    const host = document.getElementById('parentCelestialHome');
    if (!host) return;

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

    // Constellation
    _pchRenderConstellation(stats);

    // Tile counts — mirror what renderPhCardGrid surfaces so
    // numbers don't disagree between the celestial home and
    // the launcher grid below it.
    const kidCount = _pchKidProfiles().length;
    const todayISO = new Date().toISOString().slice(0,10);

    // Active contests count — matches renderPhCardGrid logic
    // (D.customContests is single-source on the parent profile,
    // not aggregated across kids).
    const contestsActive = (typeof D === 'object' && D && Array.isArray(D.customContests))
      ? D.customContests.filter(function(c){
          return c && !c.endedAt && (!c.deadline || c.deadline >= todayISO);
        }).length
      : 0;

    let activityToday = 0;
    const kidSources = kidCount > 0
      ? _pchKidProfiles().map(_pchKidData)
      : [(typeof D === 'object' && D) ? D : {}];
    kidSources.forEach(function(data){
      if (!data) return;
      const cl = Array.isArray(data.choreLog)    ? data.choreLog    : [];
      const bl = Array.isArray(data.behaviorLog) ? data.behaviorLog : [];
      activityToday += cl.filter(function(l){ return l && (l.date||'') === todayISO; }).length;
      activityToday += bl.filter(function(l){ return l && (l.date||'').slice(0,10) === todayISO; }).length;
    });

    _pchWireTile('pchTileChores',   'chores',
                 stats.choresPending > 0 ? (stats.choresPending + ' pending') : '');
    _pchWireTile('pchTileRewards',  'contests',
                 contestsActive > 0 ? (contestsActive + ' active') : '');
    _pchWireTile('pchTileActivity', 'activity',
                 activityToday > 0 ? (activityToday + ' today') : '');
    _pchWireTile('pchTileReports',  'reports', '');
    _pchWireTile('pchTileFamily',   'family',
                 kidCount > 0 ? (kidCount + ' kid' + (kidCount > 1 ? 's' : '')) : '');
    _pchWireTile('pchTileSettings', 'controls', '');

    // Faith card
    const fc = document.getElementById('pchFaithCard');
    const fv = document.getElementById('pchFaithVerse');
    const fr = document.getElementById('pchFaithRef');
    const faithOn = !(typeof D === 'object' && D && D.faithMode === false);
    if (fc) {
      if (faithOn) {
        const v = _pchPickVerse();
        if (fv) fv.textContent = v.text || '';
        if (fr) fr.textContent = (v.reference || '').toUpperCase();
        fc.style.display = '';
      } else {
        fc.style.display = 'none';
      }
    }
  }

  // Expose globals — same load pattern as the rest of the app.
  if (typeof window !== 'undefined') {
    window.renderParentCelestialHome = renderParentCelestialHome;
  }
})();
