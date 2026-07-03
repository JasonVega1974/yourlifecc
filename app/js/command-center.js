/* =============================================================
   command-center.js — Full-app home for non-faith-free accounts.
   Paints into #appCommandCenter (sibling of #appHome inside #s-hero).
   Concept: Constellation — six domain nodes around a focus center,
   amber/coral streak hero, 7-tile destination grid with Faith
   de-emphasized.

   Pure module. No DOMContentLoaded handler. The chooser lives in
   app-home.js:maybeRenderAppHome() and calls renderCommandCenter()
   when the account qualifies. #appHome stays in the DOM as a
   one-flag rollback (window._ccDisabled = true).

   Faith Well experience is NOT touched here — that path runs through
   init.js:renderFaithOnlyHero() gated by window._faithFree.
============================================================= */

(function(){
  'use strict';

  // ── WC-2c home-return reinforcement state ────────────────────
  // Last-rendered ring pct + streak, so we can sweep the ring from its
  // previous value and pulse the flame only when the streak grew since
  // the last home render (XP is earned on feature tabs, so these fire on
  // the next home paint, not at earn time — the toast covers that).
  var _ccLastRingPct = null;
  var _ccLastStreak  = null;
  function _ccReducedMotion(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(_e){ return false; }
  }

  // ── helpers ──────────────────────────────────────────────────
  function _ccEsc(s){
    if (s == null) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function _ccFirstName(){
    // Single source of truth: same chain app-home.js / faith-zones.js use
    if (typeof window !== 'undefined' && typeof window._fzFirstName === 'function'){
      try { return window._fzFirstName(); } catch(_){}
    }
    if (typeof D !== 'undefined' && D && D.name){
      return String(D.name).split(' ')[0];
    }
    if (typeof _supaUser !== 'undefined' && _supaUser){
      var meta = _supaUser.user_metadata || {};
      if (meta.first_name) return meta.first_name;
      if (meta.full_name)  return String(meta.full_name).split(' ')[0];
      if (_supaUser.email) return _supaUser.email.split('@')[0];
    }
    return 'friend';
  }

  function _ccTimeOfDay(h){
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  }

  function _ccFmtTime(d){
    var h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
  }

  function _ccTodayISO(){
    var d = new Date();
    var y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
    return y + '-' + m + '-' + day;
  }

  // ── live data: streak / tasks / points ───────────────────────
  function _ccStreak(){
    // WC-2b-ii — the headline flame now shows the unified XP streak (any-XP
    // day, Sabbath-bridged) via getXpStreak(). D.streak (daily-checks) keeps
    // incrementing in ui.js but no longer drives this flame; it is only the
    // fallback if xp.js hasn't loaded yet.
    if (typeof getXpStreak === 'function'){
      var s = getXpStreak();
      if (typeof s === 'number' && s >= 0) return s;
    }
    if (typeof D !== 'undefined' && D && typeof D.streak === 'number' && D.streak >= 0) return D.streak;
    return 0;
  }

  function _ccTasksToday(){
    var n = 0;
    if (typeof D === 'undefined' || !D) return 0;
    // Chores: count entries that are not marked completed
    if (Array.isArray(D.chores)){
      n += D.chores.filter(function(c){ return c && !c.completed && !c.done; }).length;
    } else if (Array.isArray(D.choreList)){
      n += D.choreList.filter(function(c){ return c && !c.completed && !c.done; }).length;
    }
    // Habits: count habitsV2 not yet checked today
    if (Array.isArray(D.habitsV2)){
      var todayIso = _ccTodayISO();
      n += D.habitsV2.filter(function(h){
        if (!h) return false;
        var c = h.completions || {};
        return !c[todayIso];
      }).length;
    }
    // Events today
    if (Array.isArray(D.events)){
      var todayIso2 = _ccTodayISO();
      n += D.events.filter(function(e){
        if (!e) return false;
        var dt = e.startDate || e.date;
        return dt === todayIso2;
      }).length;
    }
    return n;
  }

  function _ccPoints(){
    if (typeof D === 'undefined' || !D || !D.chorePoints) return 0;
    var t = +(D.chorePoints.total || 0);
    var s = +(D.chorePoints.spent || 0);
    return Math.max(0, t - s);
  }

  // ── per-tile meta strings ────────────────────────────────────
  // Empty state defaults are deliberately inviting ("Add your first",
  // "Begin tracking") rather than blank ("$0 saved", "All clear") so
  // a fresh account reads as potential, not emptiness.
  function _ccTileMeta(){
    var meta = {
      habits: 'Build a habit',
      chores: 'Add your first',
      goals:  'Set a goal',
      money:  'Begin tracking',
      skills: 'Start learning',
      health: 'Check in today',
      faith:  'optional'
    };
    if (typeof D === 'undefined' || !D) return meta;
    try {
      // Habits — X/Y today
      var todayIso = _ccTodayISO();
      if (Array.isArray(D.habitsV2) && D.habitsV2.length){
        var hT = D.habitsV2.length;
        var hD = D.habitsV2.filter(function(h){ return h && h.completions && h.completions[todayIso]; }).length;
        meta.habits = hD + '/' + hT + ' today';
      }
      // Chores — # incomplete (separate "no chores configured" from "all done")
      var choresArr = Array.isArray(D.chores) ? D.chores
                    : (Array.isArray(D.choreList) ? D.choreList : []);
      if (choresArr.length){
        var choreCount = choresArr.filter(function(c){ return c && !c.completed && !c.done; }).length;
        meta.chores = choreCount > 0 ? (choreCount + ' to do') : 'All clear ✓';
      }
      // Goals — # active
      if (Array.isArray(D.goals) && D.goals.length){
        var active = D.goals.filter(function(g){
          return g && !g.done && !g.doneDate && !g.achievedDate && !g.completedDate;
        }).length;
        meta.goals = active > 0 ? (active + ' active') : 'All done ✓';
      }
      // Money — bank + savings + earnings jar
      var bal = 0;
      bal += +(D.bank || 0);
      bal += +(D.bankSavAcct || 0);
      if (D.earnings && typeof D.earnings.balance === 'number') bal += +D.earnings.balance;
      bal = Math.round(bal);
      if (bal > 0) meta.money = '$' + bal.toLocaleString() + ' saved';
      // Skills — certs earned
      if (D.skillCerts){
        var certs = Object.values(D.skillCerts).filter(Boolean).length;
        if (certs > 0) meta.skills = certs + ' cert' + (certs===1?'':'s');
      }
      // Health — last weight log entry count
      if (Array.isArray(D.weightLog) && D.weightLog.length) meta.health = 'Logged today';
    } catch(_){}
    return meta;
  }

  // ── per-node "has real data" — drives bright vs dim orb glow ─
  function _ccNodeBrightness(key){
    if (typeof D === 'undefined' || !D) return false;
    try {
      if (key === 'habits') return Array.isArray(D.habitsV2) && D.habitsV2.length > 0;
      if (key === 'chores'){
        var arr = Array.isArray(D.chores) ? D.chores
                : (Array.isArray(D.choreList) ? D.choreList : []);
        return arr.length > 0;
      }
      if (key === 'goals')  return Array.isArray(D.goals) && D.goals.length > 0;
      if (key === 'money')  return (+(D.bank||0) + +(D.bankSavAcct||0) + +((D.earnings||{}).balance||0)) > 0;
      if (key === 'skills') return !!(D.skillCerts && Object.values(D.skillCerts).filter(Boolean).length);
      if (key === 'health') return (Array.isArray(D.weightLog) && D.weightLog.length > 0)
                                || (Array.isArray(D.foodLog) && D.foodLog.length > 0);
    } catch(_){}
    return false;
  }

  // ── starfield (deterministic, capped for perf) ──────────────
  // Seeded pseudo-random via sin() so the same N stars render across
  // re-renders. Count caps at 36 — empirically smooth on mid-range
  // Android Chrome and Safari iOS 14+.
  function _ccStarfield(count){
    count = Math.min(count || 32, 36);
    var stars = [];
    for (var i = 0; i < count; i++){
      var r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453 % 1);
      var r2 = Math.abs(Math.sin(i * 78.233)  * 43758.5453 % 1);
      var r3 = Math.abs(Math.sin(i * 37.719)  * 43758.5453 % 1);
      stars.push({
        cx: (10 + r1 * 380).toFixed(1),
        cy: (8  + r2 * 284).toFixed(1),
        r:  (0.5 + r3 * 1.1).toFixed(2),
        dl: (r1 * 4).toFixed(2),
        td: (2.5 + r2 * 3.5).toFixed(2)
      });
    }
    return stars;
  }

  // ── today's focus computation ────────────────────────────────
  // Per user direction (Phase 3 confirmation):
  // - First try most-overdue domain
  // - If nothing overdue, render as POSITIVE (streak / win), NOT a "behind" fallback
  function _ccComputeFocus(){
    if (typeof D === 'undefined' || !D){
      return { kind:'momentum', domain:'habits', caption:'Open your day' };
    }
    var nowMs = Date.now();
    var todayIso = _ccTodayISO();

    // 1) Chores past due
    var overdueChores = [];
    if (Array.isArray(D.chores)){
      overdueChores = D.chores.filter(function(c){
        if (!c || c.completed || c.done) return false;
        if (!c.due_date && !c.due) return false;
        var dt = new Date(c.due_date || c.due).getTime();
        return !isNaN(dt) && dt < nowMs;
      });
    }
    if (overdueChores.length){
      return { kind:'overdue', domain:'chores',
               caption: overdueChores.length + ' chore' + (overdueChores.length>1?'s':'') + ' overdue' };
    }

    // 2) Goals past deadline
    var overdueGoals = [];
    if (Array.isArray(D.goals)){
      overdueGoals = D.goals.filter(function(g){
        if (!g || g.done || g.doneDate || g.achievedDate || g.completedDate) return false;
        if (!g.deadline && !g.dueDate) return false;
        var dt = new Date(g.deadline || g.dueDate).getTime();
        return !isNaN(dt) && dt < nowMs;
      });
    }
    if (overdueGoals.length){
      return { kind:'overdue', domain:'goals',
               caption: overdueGoals.length + ' goal' + (overdueGoals.length>1?'s':'') + ' past deadline' };
    }

    // 3) Habits not done today (only counts if any habit exists)
    var habitsTotal = Array.isArray(D.habitsV2) ? D.habitsV2.length : 0;
    var habitsLeft = 0;
    if (habitsTotal){
      habitsLeft = D.habitsV2.filter(function(h){
        return h && (!h.completions || !h.completions[todayIso]);
      }).length;
    }
    if (habitsLeft > 0){
      return { kind:'overdue', domain:'habits',
               caption: habitsLeft + ' habit' + (habitsLeft>1?'s':'') + ' to do' };
    }

    // POSITIVE FALLBACK — nothing overdue. Frame as a win or invitation.
    var streak = _ccStreak();
    if (streak >= 7){
      return { kind:'momentum', domain:'habits',
               caption: 'Day ' + streak + ' streak — keep going' };
    }
    if (streak >= 1){
      return { kind:'momentum', domain:'habits',
               caption: 'Day ' + streak + ' streak going' };
    }

    // streak === 0. Separate "I'm new" from "I missed a day".
    // If literally no data exists anywhere → INVITE (first move).
    // If data exists but no streak yet → momentum-positive ("fresh start").
    var anyData = false;
    try {
      anyData = !!(
        (Array.isArray(D.habitsV2) && D.habitsV2.length) ||
        (Array.isArray(D.chores)   && D.chores.length)   ||
        (Array.isArray(D.choreList)&& D.choreList.length)||
        (Array.isArray(D.goals)    && D.goals.length)    ||
        (+(D.bank||0) + +(D.bankSavAcct||0) > 0)         ||
        (D.skillCerts && Object.keys(D.skillCerts).length)
      );
    } catch(_){}
    if (anyData){
      return { kind:'momentum', domain:'habits', caption: 'A fresh start today' };
    }
    // Truly empty — focus node prompts the first action.
    return { kind:'invite', domain:'habits', caption: 'Begin with a small habit' };
  }

  // ── tile config (canonical dictionary; Faith always last + de-emphasized) ─
  // The constellation SVG below addresses these by key, so the index
  // here is just the canonical drift-animation ordering — not the
  // visible tile order, which is stage-aware (see _CC_STAGE_ORDER).
  var _CC_TILES = [
    { key:'habits', section:'s-habits',   icon:'⚡', label:'Habits', accent:'#F5A623' },
    { key:'chores', section:'s-chores',   icon:'📋', label:'Chores', accent:'#6AA7FF' },
    { key:'goals',  section:'s-goals',    icon:'🎯', label:'Goals',  accent:'#7EC19A' },
    { key:'money',  section:'s-finance',  icon:'💰', label:'Money',  accent:'#F47B5A' },
    { key:'skills', section:'s-skills',   icon:'🧠', label:'Skills', accent:'#D4A04C' },
    { key:'health', section:'s-health',   icon:'💪', label:'Health', accent:'#4A9082' }
  ];
  var _CC_FAITH = { key:'faith', section:'s-scripture', icon:'✝️', label:'Faith' };

  // ── stage-aware tile order ────────────────────────────────────
  // STAGE_CONFIG.sections in ui.js is a sidebar-visibility filter,
  // not a tile-order primitive (and s-habits isn't in any stage's
  // sections list — a naive filter would silently drop it). The
  // Command Center owns its own per-stage order here. Semantics:
  // younger → Chores first; older → Goals first. Faith always
  // renders last + de-emphasized regardless of stage.
  //
  // Stage keys mirror STAGE_CONFIG in ui.js:118.
  var _CC_STAGE_ORDER = {
    middle:  ['chores','habits','health','money','goals','skills'],
    fresh:   ['chores','habits','goals','money','skills','health'],
    mid_hs:  ['goals','habits','skills','money','chores','health'],
    senior:  ['goals','skills','money','habits','chores','health'],
    college: ['goals','skills','money','habits','health','chores'],
    adult:   ['goals','money','skills','habits','health','chores']
  };
  // mid_hs is ui.js applyStageFilter()'s fallback, so we match it.
  // 'high' (init.js DEF default) and any other unrecognised mode
  // fall through here.
  var _CC_DEFAULT_ORDER = _CC_STAGE_ORDER.mid_hs;

  function _ccOrderedTiles(){
    var mode = (typeof D !== 'undefined' && D && D.mode) ? D.mode : null;
    var order = (mode && _CC_STAGE_ORDER[mode]) ? _CC_STAGE_ORDER[mode] : _CC_DEFAULT_ORDER;
    // Map keys → tile objects; drop any unknown keys defensively.
    return order.map(function(k){
      return _CC_TILES.find(function(t){ return t.key === k; });
    }).filter(Boolean);
  }

  // ── constellation node positions (matches scratch/constellation preview) ─
  // Habits is the visual center because it's the daily-cadence anchor; the
  // focus halo can move to a different node when computeFocus says so.
  var _CC_NODES = {
    habits: { cx:200, cy:150, r:11, coreR:5.5, labelY:125, subY:180, isCenter:true },
    chores: { cx:90,  cy:80,  r:8,  coreR:3.5, labelY:62  },
    goals:  { cx:310, cy:80,  r:8,  coreR:3.5, labelY:62  },
    money:  { cx:60,  cy:200, r:8,  coreR:3.5, labelY:222 },
    skills: { cx:340, cy:200, r:8,  coreR:3.5, labelY:222 },
    health: { cx:140, cy:255, r:8,  coreR:3.5, labelY:278 }
  };

  // SVG link segments (center + a few ring connectors for shape)
  var _CC_LINKS = [
    ['habits','chores'], ['habits','goals'], ['habits','money'],
    ['habits','skills'], ['habits','health'],
    ['chores','money'], ['goals','skills'],
    ['money','health'], ['skills','health']
  ];

  // ── Per-orb breathe periods (2026-06-12) ────────────────────
  // Varied 4500-6500ms across the 6 orbs so each star pulses on
  // its own clock. Habits (center, index 0) gets the slowest so
  // the anchor feels steady; ring orbs spread across the rest of
  // the band. Used by ckBuildStar via inline --starBreathePeriod.
  var _CC_PERIODS = [6500, 4500, 5200, 5800, 4800, 6100];

  // ── Radial microfield (2026-06-12) ──────────────────────────
  // 12 hardcoded faint stars positioned for the 400x300 viewBox,
  // hand-picked to clear every orb's bloom (max bloom is the
  // habits center at 15 around 200,150; ring orbs at radii 11
  // around their bloom regions). Four twinkle on slow periods.
  var _CC_MICROFIELD = [
    { x: 22,  y: 22,  r:0.7, fill:'#FFF7E0', op:.50 },
    { x:140, y: 28,  r:0.8, fill:'#FBBF24', op:.55, twinkle:5600 },
    { x:240, y: 22,  r:0.6, fill:'#FFF7E0', op:.40 },
    { x:378, y: 25,  r:0.9, fill:'#FFF7E0', op:.55, twinkle:4400 },
    { x: 28, y:130,  r:0.7, fill:'#FBBF24', op:.50 },
    { x:200, y:104,  r:0.6, fill:'#FFF7E0', op:.45, twinkle:6100 },
    { x:370, y:130,  r:0.7, fill:'#FFF7E0', op:.45 },
    { x:200, y:200,  r:0.8, fill:'#FBBF24', op:.55 },
    { x: 20, y:275,  r:0.6, fill:'#FFF7E0', op:.40, twinkle:3900 },
    { x:240, y:285,  r:0.7, fill:'#FFF7E0', op:.50 },
    { x:380, y:280,  r:0.6, fill:'#FFF7E0', op:.40 },
    { x:110, y:288,  r:0.7, fill:'#FFF7E0', op:.45 }
  ];

  // ── render ───────────────────────────────────────────────────
  function renderCommandCenter(){
    if (typeof document === 'undefined') return;
    var root = document.getElementById('appCommandCenter');
    if (!root) return;

    // Guarded rollback flag — `window._ccDisabled = true;` in the console
    // hides Command Center and lets app-home.js fall back to #appHome.
    if (window._ccDisabled){
      root.style.display = 'none';
      return;
    }
    root.style.display = '';

    var now = new Date();
    var name   = _ccFirstName();
    var greet  = _ccTimeOfDay(now.getHours());
    var streak = _ccStreak();
    var tasks  = _ccTasksToday();
    var points = _ccPoints();
    var meta   = _ccTileMeta();
    var focus  = _ccComputeFocus();
    var focusTile = _CC_TILES.find(function(t){ return t.key === focus.domain; }) || _CC_TILES[0];
    var focusKey  = focusTile.key;

    // Per-domain brightness — drives bright vs dim orb glow in the SVG.
    var brightness = {};
    _CC_TILES.forEach(function(t){ brightness[t.key] = _ccNodeBrightness(t.key); });

    // Starfield — 32 deterministic stars across the constellation viewBox.
    var starsHtml = _ccStarfield(32).map(function(s){
      return '<circle class="cc-star" cx="'+s.cx+'" cy="'+s.cy+'" r="'+s.r
           + '" fill="#F1E9D5" style="--dl:'+s.dl+'s;--td:'+s.td+'s;"/>';
    }).join('');

    // Links — when one endpoint is the focus node, the line is "active"
    // (flowing dashed energy toward the focus). When neither end is focus,
    // it stays as a quiet draw-in line. Lines with focus at endpoint b
    // are swapped so the focus is at (x1,y1) — that way stroke-dashoffset
    // animation always flows TOWARD focus regardless of endpoint order.
    var svgLinks = _CC_LINKS.map(function(pair){
      var a = pair[0], b = pair[1];
      var na = _CC_NODES[a], nb = _CC_NODES[b];
      if (!na || !nb) return '';
      var isActive = (a === focusKey || b === focusKey);
      var x1, y1, x2, y2;
      if (b === focusKey){ x1 = nb.cx; y1 = nb.cy; x2 = na.cx; y2 = na.cy; }
      else                { x1 = na.cx; y1 = na.cy; x2 = nb.cx; y2 = nb.cy; }
      var cls = isActive ? 'cc-link cc-link--active' : 'cc-link';
      var strokeAttr = isActive ? ' stroke="'+focusTile.accent+'"' : '';
      return '<line class="'+cls+'"'+strokeAttr
           + ' x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';
    }).join('');

    // Nodes — kit-built stars (bloom + halo + core + spikes on
    // habits center). WC-1c single-accent rework: all six domain
    // nodes speak the kit's default brass language; color is spent
    // ONLY on today's focus node (single focus accent). Domain
    // identity is carried by the icon + label, not by per-node hue
    // -- color now encodes state (focus), not decoration. Focus
    // pulse rings remain on the recommended orb only -- the
    // exclusive "look here" signal. Drift wrapper unchanged.
    var ckStar = (typeof window !== 'undefined') ? window.ckBuildStar : null;
    var svgNodes = _CC_TILES.map(function(tile, i){
      var n = _CC_NODES[tile.key];
      if (!n) return '';
      var isFocus  = (tile.key === focusKey);
      var hasData  = !!brightness[tile.key];
      var isHabits = (tile.key === 'habits');
      var mag      = isHabits ? 'bright' : 'mid';

      // Wrapper carries both .cc-orb (child-specific brightness +
      // focus + label styling) AND .star-node (shared breathe +
      // hover + flare). Drift wrapper stays as the outer parent.
      var classes = 'cc-orb star-node cc-orb--' + (i+1);
      if (isFocus) classes += ' cc-orb--focus';
      classes += hasData ? ' cc-orb--bright' : ' cc-orb--dim';

      // Pulse rings — only on the focus orb. Two staggered rings
      // give the "energy radiating" feel without spamming the GPU.
      var pulses = isFocus ? (
          '<circle class="cc-pulse cc-pulse--1" cx="'+n.cx+'" cy="'+n.cy+'" r="'+(n.r+2)+'"/>'
        + '<circle class="cc-pulse cc-pulse--2" cx="'+n.cx+'" cy="'+n.cy+'" r="'+(n.r+2)+'"/>'
      ) : '';

      // Star fragment via the kit. WC-1c — only the focus node passes
      // an accent; the other five omit it so ckBuildStar falls through
      // to its brass default (#FBBF24). The kit handles the bloom +
      // halo + core + spike (habits only, bright tier) chain.
      // constellation-kit.js is intentionally untouched.
      var starAccent = isFocus ? focusTile.accent : null;
      var starSvg = ckStar
        ? ckStar({ x: n.cx, y: n.cy, mag: mag }, starAccent ? { accent: starAccent } : {})
        : '';

      var subLine = (n.isCenter && tile.key === 'habits' && meta.habits)
        ? '<text class="cc-node__label cc-node__label--sub" x="'+n.cx+'" y="'+n.subY+'" text-anchor="middle">'+_ccEsc(meta.habits)+'</text>'
        : '';

      // Per-orb inline style: currentColor hooks (core glow / hover)
      // follow the same single-accent rule -- brass for the six domain
      // nodes, the focus accent for the focus node only; transform-
      // origin centers the breathe scale on the orb's position;
      // --starBreathePeriod drives the shared breathe + halo
      // pulse animations.
      var period   = _CC_PERIODS[i % _CC_PERIODS.length];
      var orbColor = isFocus ? focusTile.accent : '#FBBF24';
      var orbStyle = 'color:'+orbColor+';transform-origin:'+n.cx+'px '+n.cy+'px;--starBreathePeriod:'+period+'ms;';

      // Invisible hit target -- 48x48 centered on the orb. Every
      // star sub-element (bloom/halo/core/spike/badge/label) is
      // pointer-events:none so without this rect the tap would
      // pass through. data-dest on the wrapper hooks the same
      // delegated [data-dest] listener that catches tiles, so
      // orbs and tiles route through one code path. tabindex="-1"
      // keeps the orb out of the Tab order (the tile button below
      // is the keyboard-accessible target for the same destination);
      // aria-hidden lets screen readers skip the duplicate.
      var hit = '<rect class="cc-orb__hit" x="'+(n.cx-24)+'" y="'+(n.cy-24)+'" width="48" height="48" fill="transparent"/>';

      return ''
        + '<g class="cc-drift cc-drift--'+(i+1)+'">'
        +   '<g class="'+classes+'" data-key="'+tile.key+'" data-dest="'+tile.key+'" tabindex="-1" aria-hidden="true" style="'+orbStyle+'">'
        +     pulses
        +     starSvg
        +     hit
        +     '<text class="cc-node__label" x="'+n.cx+'" y="'+n.labelY+'" text-anchor="middle">'+_ccEsc(tile.label)+'</text>'
        +     subLine
        +   '</g>'
        + '</g>';
    }).join('');

    // Microfield prefix -- 12 faint background stars rendered
    // beneath the orbs via the shared kit (2026-06-12). Hardcoded
    // positions tuned for the radial layout (centered habits +
    // 5-ring) at 400x300 viewBox.
    var svgMicro = (typeof window !== 'undefined' && window.ckBuildMicrofield)
      ? window.ckBuildMicrofield(_CC_MICROFIELD)
      : '';

    // Tile grid order is stage-aware (D.mode → _CC_STAGE_ORDER).
    // The SVG constellation above uses _CC_TILES canonical order so
    // drift animations stay tied to each domain regardless of stage.
    // WC-1c follow-up — tiles are neutral; domain identity rides the icon
    // glyph + label (same as the stars). The single surface accent lands on
    // exactly one tile: today's focus destination (cc-tile--focus). No
    // per-tile --accent injection, so no rainbow on the grid.
    var tilesHtml = _ccOrderedTiles().map(function(tile){
      var tileCls = 'cc-tile' + (tile.key === focusKey ? ' cc-tile--focus' : '');
      return ''
        + '<button class="'+tileCls+'" type="button" data-dest="'+tile.key+'" '
        +   'aria-label="'+_ccEsc(tile.label)+' — '+_ccEsc(meta[tile.key])+'">'
        +   '<span class="cc-tile__icon" aria-hidden="true">'+tile.icon+'</span>'
        +   '<span class="cc-tile__title">'+_ccEsc(tile.label)+'</span>'
        +   '<span class="cc-tile__meta">'+_ccEsc(meta[tile.key])+'</span>'
        + '</button>';
    }).join('');

    var faithHtml = ''
      + '<button class="cc-tile cc-tile--faith" type="button" data-dest="faith" '
      +   'aria-label="Faith — optional">'
      +   '<span class="cc-tile__icon" aria-hidden="true">'+_CC_FAITH.icon+'</span>'
      +   '<span class="cc-tile__title">'+_ccEsc(_CC_FAITH.label)+'</span>'
      +   '<span class="cc-tile__meta">'+_ccEsc(meta.faith)+'</span>'
      + '</button>';

    // Daily greeting — day-of-week + date in Bebas Neue, with an italic
    // sub-line that rotates by weekday (7 phrases, faith-adjacent +
    // welcome-back tones). Replaces the prior "Day 1 starts now"
    // streak-counter treatment which read as engagement-metric rather
    // than a warm greeting.
    var _CC_DAYS   = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    var _CC_MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    var _CC_SUBS   = [
      'Good to see you back.',         // Sun
      'A fresh start — make it count.',// Mon
      'Steady steps, real progress.',  // Tue
      'Halfway in. Keep going.',       // Wed
      'Small wins compound.',          // Thu
      'You showed up. That matters.',  // Fri
      'Rest well — you earned it.'     // Sat
    ];
    var dayIdx     = now.getDay();
    var dateLine   = _CC_DAYS[dayIdx] + ' · ' + _CC_MONTHS[now.getMonth()] + ' ' + now.getDate();
    var sublineText = _CC_SUBS[dayIdx] || 'Good to see you back.';
    var streakDisp  = streak === 0 ? 1     : streak;
    var streakLabel = streak === 0 ? 'starts now' : 'day streak';
    var streakAria  = streak === 0 ? 'Day 1 — starts now' : ('Day ' + streak + ' streak');

    // Streak chip is only meaningful at >=1 day; "Day 1 starts now" was
    // an engagement nudge that read like a fake metric. On a fresh day-0
    // we drop the streak tile entirely — the Bebas day-of-week stamp
    // above carries the "today" message instead.
    var streakHtml = streak >= 1
      ? ( '<div class="cc-streak" role="group" aria-label="'+_ccEsc(streakAria)+'">'
        +   '<div class="cc-streak__icon" aria-hidden="true">🔥</div>'
        +   '<div class="cc-streak__body">'
        +     '<div class="cc-streak__num"><span aria-hidden="true">Day&nbsp;</span>'+streakDisp+'</div>'
        +     '<div class="cc-streak__label">'+_ccEsc(streakLabel)+'</div>'
        +   '</div>'
        + '</div>' )
      : '';

    // WC-2b-i — daily-goal XP ring. xpToday / dailyGoal, brass fill turning
    // green at 100%. Readers come from xp.js (guarded). Geometry: r=26 →
    // circumference ~163.4; the fill arc starts at 12 o'clock via the -90deg
    // rotation + stroke-dashoffset. Theme-independent (dark scene, matches the
    // cc- chrome — no light pass) and reduced-motion safe (CSS gates the fill
    // transition). The flame repoint (streak) is WC-2b-ii.
    var _xpGoal  = (typeof getDailyGoal === 'function') ? getDailyGoal() : 25;
    var _xpToday = (typeof getXpToday === 'function') ? getXpToday() : 0;
    var _xpPct   = (_xpGoal > 0) ? Math.min(100, Math.round((_xpToday / _xpGoal) * 100)) : 0;
    var _xpMet   = _xpGoal > 0 && _xpToday >= _xpGoal;
    var _xpC     = 2 * Math.PI * 26;
    var _xpOff   = (_xpC * (1 - _xpPct / 100)).toFixed(1);
    var _xpAria  = _xpToday + ' of ' + _xpGoal + ' daily XP' + (_xpMet ? ', goal met' : '');
    var ringHtml = ''
      + '<div class="cc-ring' + (_xpMet ? ' cc-ring--met' : '') + '" role="group" aria-label="' + _xpAria + '">'
      +   '<div class="cc-ring__circle">'
      +     '<svg class="cc-ring__svg" viewBox="0 0 64 64" aria-hidden="true">'
      +       '<circle class="cc-ring__track" cx="32" cy="32" r="26"/>'
      +       '<circle class="cc-ring__fill" cx="32" cy="32" r="26" transform="rotate(-90 32 32)" '
      +         'stroke-dasharray="' + _xpC.toFixed(1) + '" stroke-dashoffset="' + _xpOff + '"/>'
      +     '</svg>'
      +     '<div class="cc-ring__num" aria-hidden="true">' + _xpToday + '</div>'
      +   '</div>'
      +   '<div class="cc-ring__body">'
      +     '<div class="cc-ring__title">' + (_xpMet ? 'Daily goal met' : 'XP today') + '</div>'
      +     '<div class="cc-ring__meta">' + (_xpMet ? ('+' + _xpToday + ' XP — nice work') : (_xpToday + ' / ' + _xpGoal + ' XP')) + '</div>'
      +   '</div>'
      + '</div>';

    root.innerHTML = ''
      + '<main class="cc-shell" role="main">'
      +   '<header class="cc-greeting" aria-label="Greeting">'
      +     '<h1 class="cc-greeting__hello" id="ccHello">Good '+_ccEsc(greet)+', '+_ccEsc(name)+' 👋</h1>'
      +     '<div class="cc-daystamp" aria-label="'+_ccEsc(dateLine)+'">'
      +       '<div class="cc-daystamp__date">'+_ccEsc(dateLine)+'</div>'
      +       '<div class="cc-daystamp__sub">'
      +         '<span class="cc-daystamp__quote">'+_ccEsc(sublineText)+'</span>'
      +         '<span class="cc-time" id="ccTime" aria-label="Current time">'+_ccFmtTime(now)+'</span>'
      +       '</div>'
      +     '</div>'
      +   '</header>'

      +   '<section class="cc-stats'+(streak>=1?'':' cc-stats--no-streak')+'" aria-label="Today\'s progress">'
      +     ringHtml
      +     streakHtml
      +     '<div class="cc-chip" role="group" aria-label="'+tasks+' tasks today">'
      +       '<div class="cc-chip__num">'+tasks+'</div>'
      +       '<div class="cc-chip__label">tasks today</div>'
      +     '</div>'
      +     '<div class="cc-chip" role="group" aria-label="'+points+' points">'
      +       '<div class="cc-chip__num">'+points+'</div>'
      +       '<div class="cc-chip__label">points</div>'
      +     '</div>'
      +   '</section>'

      +   _ccClimbCard()

      +   '<section class="cc-constellation" aria-label="Life constellation">'
      +     '<div class="cc-constellation__caption">Today\'s focus &middot; <span style="color:'+focusTile.accent+';">'+_ccEsc(focus.caption)+'</span></div>'
      +     '<svg class="cc-constellation__svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Animated graph of six life domains">'
      +       '<g class="cc-stars" aria-hidden="true">'+starsHtml+'</g>'
      +       '<g class="cc-microfield" aria-hidden="true">'+svgMicro+'</g>'
      +       '<g class="cc-links">'+svgLinks+'</g>'
      +       '<g class="cc-nodes">'+svgNodes+'</g>'
      +     '</svg>'
      +   '</section>'

      +   (document.documentElement.classList.contains('flatnav')
            ? '<section class="cc-shortcuts-sec" aria-label="My Shortcuts">'
              + '<h2 class="cc-section-label">My Shortcuts</h2>'
              + '<div id="ccShortcuts"></div>'
              + '</section>'
            : '')
      +   '<section aria-label="Destinations">'
      +     '<h2 class="cc-section-label">Jump in</h2>'
      +     '<div class="cc-tiles" style="--cc-accent:'+focusTile.accent+';">'
      +       tilesHtml
      +       _ccNavTiles()
      +       faithHtml
      +     '</div>'
      +   '</section>'
      + '</main>';

    // Phase D — fill the flat-nav "My Shortcuts" zone (renderHomeShortcuts lives
    // in app-home.js; no #ccShortcuts + no-op under flag-off).
    if (typeof window.renderHomeShortcuts === 'function'){ try { window.renderHomeShortcuts(); } catch(_s){} }

    // WC-2c — home-return reinforcements (compose with the existing render;
    // the ring otherwise snaps). Sweep the fill from its previous pct, and
    // pulse the flame if the streak ticked since the last render. Gated under
    // reduced-motion (snap/no pulse). Wrapped defensively — never block render.
    try {
      var _reduced = _ccReducedMotion();
      var _fill = root.querySelector('.cc-ring__fill');
      if (_fill && !_reduced && _ccLastRingPct !== null && _ccLastRingPct !== _xpPct){
        _fill.style.transition = 'none';
        _fill.style.strokeDashoffset = (_xpC * (1 - _ccLastRingPct / 100)).toFixed(1);
        void _fill.getBoundingClientRect();        // reflow so the old value paints first
        _fill.style.transition = '';
        requestAnimationFrame(function(){
          _fill.style.strokeDashoffset = (_xpC * (1 - _xpPct / 100)).toFixed(1);
        });
      }
      var _curStreak = (typeof getXpStreak === 'function') ? getXpStreak() : streak;
      if (!_reduced && _ccLastStreak !== null && _curStreak > _ccLastStreak){
        var _streakEl = root.querySelector('.cc-streak');
        if (_streakEl) _streakEl.classList.add('cc-streak--pulse');
      }
      _ccLastRingPct = _xpPct;
      _ccLastStreak  = _curStreak;
    } catch(_e){}

    // Wire destination clicks (event delegation — single listener).
    // Catches BOTH tile buttons in .cc-tiles AND orb wrappers in
    // .cc-nodes (both carry data-dest since 2026-06-12). Each click
    // routes through window.ckPressNode so the .star-node--flare
    // class triggers a 220ms scale(1.35) flash before ccOpenDest
    // fires -- the same press feedback the parent constellation
    // uses, applied uniformly to all 7 child destinations.
    if (!root.__ccWired){
      root.__ccWired = true;
      root.addEventListener('click', function(e){
        var btn = e.target.closest && e.target.closest('[data-dest]');
        if (!btn) return;
        var dest = btn.getAttribute('data-dest');
        if (typeof window.ckPressNode === 'function') {
          window.ckPressNode(btn, function(){
            if (typeof window.ccOpenDest === 'function') window.ccOpenDest(dest);
          });
        } else if (typeof window.ccOpenDest === 'function') {
          window.ccOpenDest(dest);
        }
      });
    }
  }

  // ── tile click router ────────────────────────────────────────
  var _CC_SECTION_MAP = {
    habits:  's-habits',
    chores:  's-chores',
    goals:   's-goals',
    money:   's-finance',
    skills:  's-skills',
    health:  's-health',
    faith:   's-scripture',
    // Flat-nav only — the extra "Jump in" tiles (sidebar replacement). Flag-off
    // never emits these dests, so adding them here is byte-identical for flag-off.
    life:    's-life',
    learn:   's-learn',
    growth:  's-growth',
    me:      's-me'
  };

  // Flat-nav coverage — with the sidebar gone, the constellation alone does not
  // reach the Life landing (Schedule/Calendar/Journal/Mood/Reading) or Learn /
  // Growth / Me, so extend the "Jump in" tile row with them. Returns '' under
  // flag-off, so the flag-off Command Center is byte-identical.
  function _ccNavTiles(){
    if (!document.documentElement.classList.contains('flatnav')) return '';
    var nav = [
      { dest:'life',   icon:'⚡', label:'Life',   meta:'Schedule, calendar, journal' },
      { dest:'learn',  icon:'📚', label:'Learn',  meta:'School, jobs, skills' },
      { dest:'growth', icon:'📈', label:'Growth', meta:'Badges and milestones' },
      { dest:'me',     icon:'🧑', label:'Me',     meta:'Profile and settings' }
    ];
    return nav.map(function(n){
      return '<button class="cc-tile" type="button" data-dest="'+n.dest+'" '
        + 'aria-label="'+_ccEsc(n.label)+' — '+_ccEsc(n.meta)+'">'
        + '<span class="cc-tile__icon" aria-hidden="true">'+n.icon+'</span>'
        + '<span class="cc-tile__title">'+_ccEsc(n.label)+'</span>'
        + '<span class="cc-tile__meta">'+_ccEsc(n.meta)+'</span>'
        + '</button>';
    }).join('');
  }

  function ccOpenDest(dest){
    if (dest === 'climb'){ ccOpenClimb(); return; }
    var target = _CC_SECTION_MAP[dest];
    if (!target){ try { console.warn('[ccOpenDest] no section for', dest); } catch(_){} return; }
    if (typeof showSection === 'function') showSection(target);
  }

  // ── featured MY CLIMB card (L2 doorway) ──────────────────────
  // Child-home equivalent of the faith journey home's featured MY WALK
  // card. Cyan is the climb's signature (gold stays the Well's). The
  // progress teaser renders only once at least one step is done — a
  // fresh account sees the invitation, never a zero.
  function _ccClimbCard(){
    var teaser = '';
    try {
      if (typeof window.lifeGetProgress === 'function'){
        var p = window.lifeGetProgress();
        if (p && p.done > 0){
          teaser = '<span class="cc-climb__teaser">' + p.done + ' of ' + p.total + ' steps &middot; ' + p.pct + '%</span>';
        }
      }
    } catch(_){}
    return ''
      + '<section class="cc-climb-sec" aria-label="My Climb">'
      +   '<button class="cc-climb" type="button" data-dest="climb" aria-label="My Climb — your road to adulthood">'
      +     '<span class="cc-climb__icon" aria-hidden="true">⛰️</span>'
      +     '<span class="cc-climb__body">'
      +       '<span class="cc-climb__title">MY CLIMB</span>'
      +       '<span class="cc-climb__sub">Your road to adulthood.</span>'
      +       teaser
      +     '</span>'
      +     '<span class="cc-climb__chev" aria-hidden="true">›</span>'
      +   '</button>'
      + '</section>';
  }

  // ── MY CLIMB overlay host (Option B) ─────────────────────────
  // The CC has no destination-takeover pattern (ccOpenDest only routes
  // to sections via showSection), so the climb gets a minimal
  // full-screen host: a fixed overlay that mounts #lifePathWrap and
  // calls renderLifePath(). z-index 8000 — BELOW life-path.js's own
  // station sheet (#lifeStationOverlay, z 9000) so station pages open
  // above the path as designed. Styles live in the #appCommandCenter
  // style block in index.html.
  function _ccClimbOverlay(){
    var ov = document.getElementById('lifeClimbOverlay');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = 'lifeClimbOverlay';
    ov.innerHTML = ''
      + '<div class="cc-climb-ovbar">'
      +   '<button type="button" class="cc-climb-ovhome" id="ccClimbHomeBtn">← Home</button>'
      +   '<span class="cc-climb-ovtitle">MY CLIMB</span>'
      + '</div>'
      + '<div id="lifePathWrap"></div>';
    document.body.appendChild(ov);
    ov.querySelector('#ccClimbHomeBtn').addEventListener('click', ccCloseClimb);
    // Esc: close the station sheet first if it's up, else leave the climb.
    document.addEventListener('keydown', function(e){
      if (e.key !== 'Escape') return;
      if (ov.style.display !== 'block') return;
      var st = document.getElementById('lifeStationOverlay');
      if (st && st.style.display === 'flex'){
        if (typeof window.lifeCloseStation === 'function') window.lifeCloseStation();
        return;
      }
      ccCloseClimb();
    });
    return ov;
  }

  function ccOpenClimb(){
    // Module-load failure degrades to a quiet notice, never a dead tap.
    if (typeof window.renderLifePath !== 'function'){
      if (typeof window.showToast === 'function') window.showToast('My Climb is unavailable right now — try a refresh');
      return;
    }
    // Station "Open tool" buttons route via showSection (life-path.js
    // lifeOpenTool) — wrap it ONCE so the host overlay closes first and
    // the destination is actually visible. Wrapper etiquette per
    // xp.js/streaks.js: patch the global from outside, no life-path.js
    // edits, idempotent via window flag.
    if (!window._ccClimbToolWrapped && typeof window.lifeOpenTool === 'function'){
      window._ccClimbToolWrapped = true;
      var _origTool = window.lifeOpenTool;
      window.lifeOpenTool = function(){
        try { ccCloseClimb(); } catch(_){}
        return _origTool.apply(this, arguments);
      };
    }
    var ov = _ccClimbOverlay();
    ov.style.display = 'block';
    document.body.style.overflow = 'hidden';
    try {
      window.renderLifePath('lifePathWrap');
    } catch(e){
      ccCloseClimb();
      if (typeof window.showToast === 'function') window.showToast('My Climb could not open');
      try { console.error('[ccOpenClimb]', e); } catch(_){}
      return;
    }
    // The climb reads bottom-up (chapter 1 nearest the thumb). Land on
    // the pulsing current-step beacon; a finished climb lands on the
    // summit at the top instead.
    try {
      var cur = ov.querySelector('.lp-current');
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block:'center' });
      else ov.scrollTop = 0;
    } catch(_){}
  }

  function ccCloseClimb(){
    var ov = document.getElementById('lifeClimbOverlay');
    if (ov) ov.style.display = 'none';
    document.body.style.overflow = '';
    if (typeof window.lifeCloseStation === 'function'){ try { window.lifeCloseStation(); } catch(_){} }
    // Re-render home so the card teaser reflects any steps just taken.
    try { renderCommandCenter(); } catch(_){}
  }

  // ── exports ──────────────────────────────────────────────────
  if (typeof window !== 'undefined'){
    window.renderCommandCenter = renderCommandCenter;
    window.ccOpenDest          = ccOpenDest;
    window.ccOpenClimb         = ccOpenClimb;
    window.ccCloseClimb        = ccCloseClimb;
  }
})();
