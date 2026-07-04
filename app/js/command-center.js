/* =============================================================
   command-center.js — Full-app home for non-faith-free accounts.
   Paints into #appCommandCenter (sibling of #appHome inside #s-hero).

   L2 photo-card home (2026-07-03): hero strip (greeting + XP ring +
   unified streak + chips) → "Continue where you left off" resume
   card (D.lifeLastDest) → featured MY CLIMB card → sectioned
   photo-card grid mirroring the faith journey home's anatomy
   (eyebrow + photo cards, admin card-photo system, gradient+icon
   placeholder until a photo is uploaded). Cyan is this surface's
   accent family — gold stays the Well's. The former constellation
   hero (starfield/orbs/links SVG) is REMOVED, replaced by the grid.

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

  // ── section visibility (bracket + stage) ─────────────────────
  // Mirrors ui.js: a card renders only if (a) the age-bracket toggle
  // hasn't explicitly hidden it (D.sections[key] === 0, written by
  // applyAgeBracketSections) AND (b) the stage filter allows it
  // (STAGE_CONFIG[D.mode].sections, same fallback as applyStageFilter).
  // s-cbt is exempt from the stage filter, matching applyStageFilter's
  // exemption. This closes the old allowlist-vs-tiles gap: the home
  // never shows a card whose section the sidebar hides.
  function _ccSectionVisible(sectionId){
    try {
      var key = sectionId.replace('s-','');
      if (typeof D !== 'undefined' && D && D.sections && D.sections[key] === 0) return false;
      if (sectionId === 's-cbt') return true;
      if (typeof STAGE_CONFIG !== 'undefined'){
        var mode = (typeof D !== 'undefined' && D && D.mode) ? D.mode : 'mid_hs';
        var cfg = STAGE_CONFIG[mode] || STAGE_CONFIG.mid_hs;
        if (cfg && Array.isArray(cfg.sections)) return cfg.sections.indexOf(sectionId) !== -1;
      }
    } catch(_){}
    return true;
  }

  // ── photo-card home catalog ──────────────────────────────────
  // Every main-app section as a photo card, grouped under faith-style
  // eyebrows. photoId is the admin card-photo key: legacy keys
  // (school-classes, finance-overview, health-habits, sk-car, sk-digital,
  // spt-explore, rsm-prep) reuse photos already managed under their own
  // admin sections; ah-* keys are new, registered under "Main App Home"
  // in admin.html's PM_INVENTORY with no default (styled gradient+icon
  // placeholder until uploaded — never a broken image). `photo` is the
  // ship-with default URL for legacy keys (same URL as PM_INVENTORY);
  // admin overrides arrive via window.CARD_PHOTO_OVERRIDES.
  // Grouping confirmed 2026-07-03 (Step 5 spec): MY DAY / LEARN /
  // BODY & MIND / MONEY / EXPLORE & CREATE / MORE (everything else).
  // Spec deltas resolved against real sections: "Meditation" and "Art"
  // have no main-app section (meditation audio lives in the Well) — no
  // card rather than a dead route. "CBT"/"Tech" are one section
  // (s-cbt) — rendered once, under EXPLORE & CREATE as TECH SKILLS.
  // "Goals (savings)" maps to s-goals (savings goals ride inside
  // Finance; s-goals is the only goals section).
  var _CC_HOME = [
    { eyebrow:'MY DAY', cards:[
      { dest:'habits',   section:'s-habits',    icon:'⚡', title:'HABITS',        sub:'Daily rhythms, kept.',          photoId:'ah-habits' },
      { dest:'schedule', section:'s-schedule',  icon:'📅', title:'SCHEDULE',      sub:'Plan your day.',                photoId:'ah-schedule' },
      { dest:'chores',   section:'s-chores',    icon:'📋', title:'CHORES',        sub:'Earn your keep.',               photoId:'ah-chores' },
      { dest:'mood',     section:'s-mood',      icon:'😊', title:'MOOD',          sub:'How are you, really?',          photoId:'ah-mood' }
    ]},
    { eyebrow:'LEARN', cards:[
      { dest:'school',   section:'s-school',    icon:'📚', title:'SCHOOL',        sub:'Classes, GPA, homework.',       photoId:'school-classes', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Elementary_classroom_in_Alaska.jpg/1280px-Elementary_classroom_in_Alaska.jpg' },
      { dest:'skills',   section:'s-skills',    icon:'🧠', title:'LIFE SKILLS',   sub:'Lessons for real life.',        photoId:'ah-skills' },
      { dest:'reading',  section:'s-reading',   icon:'📖', title:'READING LIST',  sub:'Books worth finishing.',        photoId:'ah-reading' }
    ]},
    { eyebrow:'BODY & MIND', cards:[
      { dest:'health',   section:'s-health',    icon:'💪', title:'HEALTH',        sub:'Body, food, energy.',           photoId:'health-habits', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Cycling_in_Amsterdam_%28893%29.jpg/1280px-Cycling_in_Amsterdam_%28893%29.jpg' },
      { dest:'sports',   section:'s-sports',    icon:'🏆', title:'SPORTS',        sub:'Train and compete.',            photoId:'spt-explore', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Narendra_Modi_Stadium_view_from_the_gallery.jpg/1280px-Narendra_Modi_Stadium_view_from_the_gallery.jpg' },
      { dest:'journal',  section:'s-journal',   icon:'✍️', title:'JOURNAL',       sub:'Write it down.',                photoId:'ah-journal' }
    ]},
    { eyebrow:'MONEY', cards:[
      { dest:'money',    section:'s-finance',   icon:'💰', title:'MONEY',         sub:'Save, spend, learn.',           photoId:'finance-overview', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/USDnotesNew.png/1280px-USDnotesNew.png' },
      { dest:'rewards',  section:'s-rewards',   icon:'🎁', title:'REWARDS',       sub:'Spend your points.',            photoId:'ah-rewards' },
      { dest:'goals',    section:'s-goals',     icon:'🎯', title:'GOALS',         sub:'Aim at something.',             photoId:'ah-goals' }
    ]},
    { eyebrow:'EXPLORE & CREATE', cards:[
      { dest:'craft',    section:'s-craft',     icon:'🎵', title:'MUSIC & PRACTICE', sub:'Your craft, honed.',         photoId:'ah-craft' },
      { dest:'tech',     section:'s-cbt',       icon:'💻', title:'TECH SKILLS',   sub:'Typing, computers, code.',      photoId:'sk-digital', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wikipedia_homepage_on_a_large_Android_phone%2C_2015-04-16.jpg/1280px-Wikipedia_homepage_on_a_large_Android_phone%2C_2015-04-16.jpg' }
    ]},
    { eyebrow:'MORE', cards:[
      { dest:'calendar',   section:'s-calendar',   icon:'🗓️', title:'CALENDAR',      sub:'The month ahead.',           photoId:'ah-calendar' },
      { dest:'resources',  section:'s-resources',  icon:'📐', title:'RESOURCES',     sub:'Tools for schoolwork.',      photoId:'ah-resources' },
      { dest:'growing',    section:'s-growing',    icon:'🌱', title:'GROWING UP',    sub:'The changes, explained.',    photoId:'ah-growing' },
      { dest:'milestones', section:'s-milestones', icon:'🏆', title:'MILESTONES',    sub:'Moments that matter.',       photoId:'ah-milestones' },
      { dest:'badges',     section:'s-badges',     icon:'🏅', title:'BADGES',        sub:'Your trophy shelf.',         photoId:'ah-badges' },
      { dest:'motivation', section:'s-motivation', icon:'🔥', title:'FUEL WALL',     sub:'Words that push you.',       photoId:'ah-motivation' },
      { dest:'contests',   section:'s-contests',   icon:'🏆', title:'CHALLENGES',    sub:'Family contests.',           photoId:'ah-contests' },
      { dest:'driving',    section:'s-driving',    icon:'🚗', title:'DRIVING',       sub:'Road ready.',                photoId:'sk-car', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Convertible_Mercedes_Car_Driving_On_A_Highway.jpg/1280px-Convertible_Mercedes_Car_Driving_On_A_Highway.jpg' },
      { dest:'resume',     section:'s-resume',     icon:'📄', title:'JOBS & RESUME', sub:'Get hired.',                 photoId:'rsm-prep', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Job_interview.jpg/1280px-Job_interview.jpg' },
      { dest:'bio',        section:'s-bio',        icon:'🪪', title:'BIO PAGE',      sub:'Your story, shareable.',     photoId:'ah-bio' },
      { dest:'mentors',    section:'s-mentors',    icon:'🤝', title:'MY PEOPLE',     sub:'Mentors and allies.',        photoId:'ah-mentors' }
    ]}
  ];
  var _CC_FAITH = { key:'faith', section:'s-scripture', icon:'✝️', label:'Faith' };

  function _ccCardBySection(sectionId){
    for (var g = 0; g < _CC_HOME.length; g++){
      var cards = _CC_HOME[g].cards;
      for (var i = 0; i < cards.length; i++){
        if (cards[i].section === sectionId) return cards[i];
      }
    }
    return null;
  }

  // One photo card — anatomy mirrors the faith home's fjp-card: hero
  // (gradient+icon placeholder behind a lazy img behind a dark shade)
  // + title + sub. The img renders only when a URL exists (override →
  // ship-with default → none), so there is never a broken image.
  function _ccPhotoCard(c){
    var url = '';
    try { url = (window.CARD_PHOTO_OVERRIDES || {})[c.photoId] || c.photo || ''; } catch(_){}
    var img = url
      ? '<img class="cc-pcard__img" data-card-id="'+_ccEsc(c.photoId)+'" src="'+_ccEsc(url)+'" loading="lazy" alt="" onerror="this.style.display=\'none\'">'
      : '<img class="cc-pcard__img" data-card-id="'+_ccEsc(c.photoId)+'" alt="" style="display:none;">';
    return ''
      + '<button class="cc-pcard" type="button" data-dest="'+_ccEsc(c.dest)+'" '
      +   'aria-label="'+_ccEsc(c.title)+' — '+_ccEsc(c.sub)+'">'
      +   '<span class="cc-pcard__hero" aria-hidden="true">'
      +     '<span class="cc-pcard__ph">'+c.icon+'</span>'
      +     img
      +     '<span class="cc-pcard__shade"></span>'
      +   '</span>'
      +   '<span class="cc-pcard__title">'+_ccEsc(c.title)+'</span>'
      +   '<span class="cc-pcard__sub">'+_ccEsc(c.sub)+'</span>'
      + '</button>';
  }

  function _ccHomeGrid(){
    return _CC_HOME.map(function(group){
      var cards = group.cards.filter(function(c){ return _ccSectionVisible(c.section); });
      if (!cards.length) return '';
      return ''
        + '<section class="cc-group" aria-label="'+_ccEsc(group.eyebrow)+'">'
        +   '<div class="cc-eyebrow">'+_ccEsc(group.eyebrow)+'</div>'
        +   '<div class="cc-cards">'+cards.map(_ccPhotoCard).join('')+'</div>'
        + '</section>';
    }).join('');
  }

  // "Continue where you left off" — reads D.lifeLastDest + its
  // timestamp (written by showSection in ui.js). Hidden for fresh
  // users, hidden when stale (>1h — a morning-after home should read
  // as a fresh start, not yesterday's tab), hidden if the remembered
  // section is no longer visible for this bracket/stage.
  function _ccContinueCard(){
    var last = (typeof D !== 'undefined' && D) ? D.lifeLastDest : null;
    if (!last || typeof last !== 'string') return '';
    var ts = (typeof D !== 'undefined' && D && +D.lifeLastDestTs) || 0;
    if (!ts || (Date.now() - ts) > 3600000) return '';
    var card = _ccCardBySection(last);
    if (!card || !_ccSectionVisible(card.section)) return '';
    return ''
      + '<button class="cc-continue" type="button" data-dest="'+_ccEsc(card.dest)+'" '
      +   'aria-label="Continue where you left off — back to '+_ccEsc(card.title)+'">'
      +   '<span class="cc-continue__icon" aria-hidden="true">'+card.icon+'</span>'
      +   '<span class="cc-continue__body">'
      +     '<span class="cc-continue__eyebrow">CONTINUE WHERE YOU LEFT OFF</span>'
      +     '<span class="cc-continue__title">← Back to '+_ccEsc(card.title)+'</span>'
      +   '</span>'
      +   '<span class="cc-continue__chev" aria-hidden="true">›</span>'
      + '</button>';
  }

  // Oswald for the gold section eyebrows — same lazy-load pattern as
  // faith-zones' _fjEnsureFonts (the head link only carries Bebas Neue
  // + Inter). Idempotent via the link id; CSS falls back to Inter
  // until the face arrives.
  function _ccEnsureFonts(){
    if (typeof document === 'undefined' || document.getElementById('ccFonts')) return;
    try {
      var l = document.createElement('link');
      l.id = 'ccFonts'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&display=swap';
      document.head.appendChild(l);
    } catch (e){}
  }

  // ── render ───────────────────────────────────────────────────
  function renderCommandCenter(){
    if (typeof document === 'undefined') return;
    var root = document.getElementById('appCommandCenter');
    if (!root) return;
    _ccEnsureFonts();

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

    // 2026-07-04 — Faith promoted on the child home. The old muted
    // "Faith — optional" row (dest 'faith' → classic Well) is superseded
    // by this gold MY FAITH doorway: dest 'faithhome' lands on the faith
    // journey home grid (all 21 photo cards). The classic Well stays
    // reachable inside the faith section itself.
    var faithHtml = ''
      + '<button class="cc-tile cc-tile--faith cc-tile--myfaith" type="button" data-dest="faithhome" '
      +   'aria-label="My Faith — your faith journey">'
      +   '<span class="cc-tile__icon" aria-hidden="true">✨</span>'
      +   '<span class="cc-tile__title">My Faith</span>'
      +   '<span class="cc-tile__meta">Your faith journey</span>'
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

      +   _ccContinueCard()

      +   _ccClimbCard()

      +   _ccWalkCard()

      +   (document.documentElement.classList.contains('flatnav')
            ? '<section class="cc-shortcuts-sec" aria-label="My Shortcuts">'
              + '<h2 class="cc-section-label">My Shortcuts</h2>'
              + '<div id="ccShortcuts"></div>'
              + '</section>'
            : '')

      +   _ccHomeGrid()

      +   '<section aria-label="More">'
      +     '<div class="cc-tiles" style="--cc-accent:#22d3ee;">'
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
    // Every card/tile/button carries data-dest; each click routes through
    // window.ckPressNode so the .star-node--flare class triggers a 220ms
    // scale flash before ccOpenDest fires — the same press feedback the
    // parent constellation uses.
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
    // L2 photo-card home — the full section catalog.
    schedule:   's-schedule',
    calendar:   's-calendar',
    school:     's-school',
    resources:  's-resources',
    tech:       's-cbt',
    reading:    's-reading',
    sports:     's-sports',
    mood:       's-mood',
    growing:    's-growing',
    journal:    's-journal',
    rewards:    's-rewards',
    contests:   's-contests',
    milestones: 's-milestones',
    badges:     's-badges',
    motivation: 's-motivation',
    driving:    's-driving',
    resume:     's-resume',
    bio:        's-bio',
    mentors:    's-mentors',
    craft:      's-craft',
    // Flat-nav only — the extra "Jump in" tiles (sidebar replacement). Flag-off
    // never emits these dests, so adding them here is byte-identical for flag-off.
    life:    's-life',
    learn:   's-learn',
    growth:  's-growth',
    me:      's-me'
  };

  // Flat-nav coverage — with the sidebar gone, the photo grid alone does not
  // reach the Life landing (Schedule/Calendar/Journal/Mood/Reading) or Learn /
  // Growth / Me, so extend the "More" tile row with them. Returns '' under
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
    if (dest === 'walk'){ ccOpenWalk(); return; }
    if (dest === 'faithhome'){ ccOpenFaithHome(); return; }
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

  // ── featured MY WALK WITH GOD card (L2 doorway) ──────────────
  // Gold twin of MY CLIMB (cyan stays the climb's; gold is the walk's
  // signature). Progress teaser from walkGetProgress (walk-path.js,
  // 14 stations) renders only once at least one step is done — a
  // fresh account sees the invitation, never a zero. Optional admin
  // cover photo shares the journey home's fj-my-walk key, so one
  // upload feeds both featured cards.
  function _ccWalkCard(){
    var teaser = '';
    try {
      if (typeof window.walkGetProgress === 'function'){
        var p = window.walkGetProgress();
        if (p && p.done > 0){
          teaser = '<span class="cc-walk__teaser">' + p.done + ' of ' + p.total + ' steps &middot; ' + p.pct + '%</span>';
        }
      }
    } catch(_){}
    var url = '';
    try { url = (window.CARD_PHOTO_OVERRIDES || {})['fj-my-walk'] || ''; } catch(_){}
    var photo = url
      ? '<img class="cc-walk__img" data-card-id="fj-my-walk" src="' + _ccEsc(url) + '" loading="lazy" alt="" onerror="this.style.display=\'none\'">'
        + '<span class="cc-walk__shade" aria-hidden="true"></span>'
      : '';
    return ''
      + '<section class="cc-walk-sec" aria-label="My Walk with God">'
      +   '<button class="cc-walk" type="button" data-dest="walk" aria-label="My Walk with God — your discipleship journey">'
      +     photo
      +     '<span class="cc-walk__icon" aria-hidden="true">🙏</span>'
      +     '<span class="cc-walk__body">'
      +       '<span class="cc-walk__title">MY WALK WITH GOD</span>'
      +       '<span class="cc-walk__sub">Your discipleship journey.</span>'
      +       teaser
      +     '</span>'
      +     '<span class="cc-walk__chev" aria-hidden="true">›</span>'
      +   '</button>'
      + '</section>';
  }

  // ── MY WALK overlay host — mirror of _ccClimbOverlay ─────────
  // z 8000 sits BELOW walk-path.js's own station sheet
  // (#walkStationOverlay, z 9000) so station pages open above the
  // path as designed. walk-path.js hard-codes 'walkPathWrap' in its
  // own step re-render, so this host must own that id exclusively
  // while open — ccOpenWalk strips the id from any stale faith-side
  // host (fzOpenDest('walk') rebuilds its panel innerHTML on every
  // open, so that node is disposable between visits).
  function _ccWalkOverlay(){
    var ov = document.getElementById('ccWalkOverlay');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = 'ccWalkOverlay';
    ov.innerHTML = ''
      + '<div class="cc-climb-ovbar cc-walk-ovbar">'
      +   '<button type="button" class="cc-climb-ovhome cc-walk-ovhome" id="ccWalkHomeBtn">← Home</button>'
      +   '<span class="cc-climb-ovtitle cc-walk-ovtitle">MY WALK WITH GOD</span>'
      + '</div>'
      + '<div style="max-width:560px;margin:0 auto;padding:1rem .9rem 2.5rem;"><div id="walkPathWrap"></div></div>';
    document.body.appendChild(ov);
    ov.querySelector('#ccWalkHomeBtn').addEventListener('click', ccCloseWalk);
    // Esc: close the station sheet first if it's up, else leave the walk.
    document.addEventListener('keydown', function(e){
      if (e.key !== 'Escape') return;
      if (ov.style.display !== 'block') return;
      var st = document.getElementById('walkStationOverlay');
      if (st && st.style.display !== 'none'){
        if (typeof window.walkCloseStation === 'function') window.walkCloseStation();
        return;
      }
      ccCloseWalk();
    });
    return ov;
  }

  function ccOpenWalk(){
    // Module-load failure degrades to a quiet notice, never a dead tap.
    if (typeof window.renderWalkPath !== 'function'){
      if (typeof window.showToast === 'function') window.showToast('My Walk is unavailable right now — try a refresh');
      return;
    }
    // Station "tool" chips route via showSection (walk-path.js
    // walkOpenTool) — wrap it ONCE so this overlay closes first when it
    // is the active host (no-op when the faith-side walk is the host).
    // Same wrapper etiquette as the climb's lifeOpenTool patch.
    if (!window._ccWalkToolWrapped && typeof window.walkOpenTool === 'function'){
      window._ccWalkToolWrapped = true;
      var _origTool = window.walkOpenTool;
      window.walkOpenTool = function(){
        try {
          var _ov = document.getElementById('ccWalkOverlay');
          if (_ov && _ov.style.display === 'block') ccCloseWalk();
        } catch(_){}
        return _origTool.apply(this, arguments);
      };
    }
    var ov = _ccWalkOverlay();
    // Exclusive id claim — see _ccWalkOverlay comment.
    try {
      document.querySelectorAll('[id="walkPathWrap"]').forEach(function(n){
        if (!ov.contains(n)) n.removeAttribute('id');
      });
    } catch(_){}
    ov.style.display = 'block';
    document.body.style.overflow = 'hidden';
    try {
      window.renderWalkPath('walkPathWrap');
    } catch(e){
      ccCloseWalk();
      if (typeof window.showToast === 'function') window.showToast('My Walk could not open');
      try { console.error('[ccOpenWalk]', e); } catch(_){}
      return;
    }
    // Land on the "YOU ARE HERE" beacon (current station) if present.
    try {
      var cur = ov.querySelector('.wk-current');
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block:'center' });
      else ov.scrollTop = 0;
    } catch(_){}
  }

  function ccCloseWalk(){
    var ov = document.getElementById('ccWalkOverlay');
    if (ov) ov.style.display = 'none';
    document.body.style.overflow = '';
    if (typeof window.walkCloseStation === 'function'){ try { window.walkCloseStation(); } catch(_){} }
    // Re-render home so the card teaser reflects any steps just taken.
    try { renderCommandCenter(); } catch(_){}
  }

  // ── MY FAITH doorway — land on the faith journey home grid ───
  // showSection('s-scripture') fires renderFaithZones on a 30ms
  // timeout (ui.js), so the journey render is scheduled after it and
  // wins the paint. Flag-off accounts keep their classic Well on every
  // OTHER faith entry — this doorway alone force-shows the journey
  // grid. If faith-zones failed to load, the user still lands in the
  // Well (graceful degrade — never a dead tap).
  function ccOpenFaithHome(){
    if (typeof showSection === 'function') showSection('s-scripture');
    setTimeout(function(){
      if (typeof window.renderFaithJourneyHome === 'function'){
        try { window.renderFaithJourneyHome(); } catch(_e){}
      }
    }, 120);
  }

  // ── exports ──────────────────────────────────────────────────
  if (typeof window !== 'undefined'){
    window.renderCommandCenter = renderCommandCenter;
    window.ccOpenDest          = ccOpenDest;
    window.ccOpenClimb         = ccOpenClimb;
    window.ccCloseClimb        = ccCloseClimb;
    window.ccOpenWalk          = ccOpenWalk;
    window.ccCloseWalk         = ccCloseWalk;
    window.ccOpenFaithHome     = ccOpenFaithHome;
  }
})();
