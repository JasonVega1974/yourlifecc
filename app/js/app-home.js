/* =============================================================
   app-home.js — Main App Home simplification (2026-05-30)

   The new #appHome (inside <section id="s-hero">) shows:
     • Greeting + streak chip       (renderAppGreeting)
     • Daily Briefing card (existing — kept untouched)
     • 6 destination buttons routing to existing top-level sections

   Section map for the 6 buttons:
     habits → s-habits         chores → s-chores
     goals  → s-goals          money  → s-finance
     skills → s-skills         faith  → s-scripture

   Notes:
   - Each destination uses the existing showSection() router so the
     full section opens (sidebar/bottom-nav cohesive). No new
     destination shell — that pattern only made sense for the faith
     tab's sub-features.
   - Streak resolution chain mirrors the faith greeting:
     getScriptureStreak() → D.streak → 0. (No D.dailyStreak exists.)
   - First-name resolution chain mirrors daily-briefing._dbFirstName:
     D.name → _supaUser.user_metadata.first_name/full_name →
     email prefix → "friend".
   - Hidden on the faith-free flow + parent surface (both own
     their own greeting/branding).
============================================================= */

(function(){
  'use strict';

  function _ahFirstName(){
    // Delegate to the faith greeting's helper when it's loaded — keeps
    // every greeting in the app aligned on one chain. The local fallback
    // below covers the race where this module renders before
    // faith-zones.js attaches the global.
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

  function _ahStreak(){
    if (typeof getScriptureStreak === 'function'){
      var n = getScriptureStreak();
      if (typeof n === 'number' && n >= 0) return n;
    }
    if (typeof D !== 'undefined' && D && typeof D.streak === 'number') return D.streak;
    return 0;
  }

  function _ahEsc(s){
    if (s == null) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function renderAppGreeting(){
    if (typeof document === 'undefined') return;
    var el = document.getElementById('appGreeting');
    if (!el) return;
    var h = new Date().getHours();
    var part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
    var name = _ahFirstName();
    var streak = _ahStreak();
    var streakChip = streak > 0
      ? '<span class="fz-streak">🔥 ' + streak + ' day' + (streak === 1 ? '' : 's') + '</span>'
      : '';
    el.innerHTML =
      '<div class="fz-greet-row">' +
        '<div class="fz-greet-text">' +
          '<div class="fz-greet-hi">Good ' + part + ', <span class="ag-name">' + _ahEsc(name) + '</span> 👋</div>' +
          "<div class=\"fz-greet-sub\">Here's your day.</div>" +
        '</div>' +
        streakChip +
      '</div>';
  }

  // Tap → showSection(). Map is the SINGLE SOURCE OF TRUTH for what
  // each button does; any new destination is one line here plus a
  // matching button in index.html. Falls back to a console warn if
  // showSection isn't loaded yet (shouldn't happen — ui.js loads
  // before this module — but defensive).
  var _APP_SECTION_MAP = {
    habits:  's-habits',
    chores:  's-chores',
    goals:   's-goals',
    money:   's-finance',
    skills:  's-skills',
    faith:   's-scripture'
  };

  function appOpenDest(dest){
    var target = _APP_SECTION_MAP[dest];
    if (!target){
      try { console.warn('[appOpenDest] no section for', dest); } catch(_){}
      return;
    }
    if (typeof showSection === 'function'){
      showSection(target);
    }
  }

  // ── Entry-redesign Phase 2 — Home card launcher (flag-gated) ──────────
  // Six .fl-card destinations rendered into #homeLauncher (inside #appHome),
  // shown only under html.flatnav. Every card routes via the EXISTING
  // showSection()/wellGoto() router — no new routes. Slot 2 (The Well) is
  // swappable via D.tabSwap, mirroring renderBottomTabBar's faith slot.
  // Faith-free users keep ffBottomNav and never see this surface.
  var _FL_CARDS = [
    { label:'The Well',    icon:'✝️', desc:'Bible, prayer, plans, and growth',          accent:'#a78bfa', route:"showSection('s-scripture')" },
    { label:'Learn',       icon:'📚', desc:'Life skills, school, driving, and jobs',     accent:'#38bdf8', route:"showSection('s-learn')" },
    { label:'Life Skills', icon:'🧠', desc:'Learn one new thing today',                  accent:'#34d399', route:"showSection('s-skills')" },
    { label:'Life',        icon:'⚡',       desc:'Habits, goals, money, and schedule',         accent:'#fb923c', route:"showSection('s-life')" },
    { label:'My People',   icon:'🤝', desc:'Mentors, family, and your circle',           accent:'#f472b6', route:"showSection('s-mentors')" },
    { label:'Me',          icon:'🧑', desc:'Badges, milestones, profile, and settings',  accent:'#fbbf24', route:"showSection('s-me')" }
  ];

  function _flRgba(hex, a){
    var h = String(hex).replace('#','');
    var r = parseInt(h.substring(0,2),16);
    var g = parseInt(h.substring(2,4),16);
    var b = parseInt(h.substring(4,6),16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function renderHomeLauncher(){
    if (typeof document === 'undefined') return;
    var host = document.getElementById('homeLauncher');
    if (!host) return;
    if (window._faithFree){ host.innerHTML = ''; return; }
    var cards = _FL_CARDS.slice();
    // Slot 2 (index 0 = The Well) honors the faith-tab-swap pin if set.
    try {
      var sw  = (typeof D !== 'undefined' && D && D.tabSwap) ? D.tabSwap : '';
      var opt = (typeof TAB_SWAP_OPTIONS !== 'undefined') ? TAB_SWAP_OPTIONS[sw] : null;
      if (opt){
        cards[0] = { label:opt.label, icon:opt.icon, desc:'Your pinned space', accent:'#a78bfa', route:"showSection('" + opt.sectionId + "')" };
      }
    } catch(_){}
    host.innerHTML = '<div class="fl-grid">' + cards.map(function(c){
      var hero = 'background:radial-gradient(120% 100% at 50% 0%, ' + _flRgba(c.accent,.42) + ' 0%, transparent 70%), linear-gradient(135deg, ' + _flRgba(c.accent,.20) + ', var(--s1));';
      return '<button type="button" class="fl-card" style="border-color:' + _flRgba(c.accent,.30) + ';" onclick="' + c.route + '" aria-label="' + _ahEsc(c.label) + '">' +
        '<span class="fl-hero" style="' + hero + '"><span class="fl-hero-icon" aria-hidden="true">' + c.icon + '</span></span>' +
        '<span class="fl-card-title">' + _ahEsc(c.label) + '</span>' +
        '<span class="fl-card-desc">' + _ahEsc(c.desc) + '</span>' +
      '</button>';
    }).join('') + '</div>';
  }

  // Hide the appHome when the parent surface is active OR the user
  // is on a faith-free plan (their cinematic Enter The Well hero
  // takes the whole screen). Otherwise: prefer the Command Center
  // (constellation hero); fall back to the legacy #appHome shell.
  //
  // 2026-06-04 — Phase 3 chooser. command-center.js loads BEFORE this
  // module so window.renderCommandCenter is available by the time the
  // first DOMContentLoaded handler fires. Rollback path: set
  // window._ccDisabled = true in the console — the Command Center
  // bails (hides itself) and #appHome takes over.
  function maybeRenderAppHome(){
    if (typeof document === 'undefined') return;
    var home = document.getElementById('appHome');
    var cc   = document.getElementById('appCommandCenter');
    var hideForParent    = document.body && document.body.classList.contains('parent-view');
    var hideForFaithFree = !!window._faithFree;

    // Faith Well and Parent Hub own the screen on those flows — bail
    // both surfaces. The Well code path (init.js:1649) handles its own
    // paint into #faithHeroCinematic; we just stay out of its way.
    if (hideForParent || hideForFaithFree){
      if (home) home.style.display = 'none';
      if (cc)   cc.style.display   = 'none';
      return;
    }

    // Entry-redesign Phase 2 (flag-gated): flatnav forces the simplified
    // #appHome surface (greeting + Daily Briefing + the card launcher) and
    // suppresses the Constellation Command Center. Reversible: flag off ->
    // no .flatnav class -> the CC-preference path below runs unchanged.
    if (document.documentElement.classList.contains('flatnav')){
      if (cc) cc.style.display = 'none';
      if (home){
        home.style.display = '';
        renderAppGreeting();
        if (typeof renderHomeLauncher === 'function'){ try { renderHomeLauncher(); } catch (e) {} }
        if (typeof renderDailyGrowth === 'function'){ try { renderDailyGrowth(); } catch (e) {} }
      }
      return;
    }

    // Prefer Command Center when the module is loaded and the
    // container exists. Hide the legacy #appHome.
    if (cc && typeof window.renderCommandCenter === 'function' && !window._ccDisabled){
      if (home) home.style.display = 'none';
      try { window.renderCommandCenter(); } catch (e) {
        // Defensive: if Command Center throws, fall back to #appHome
        // rather than leaving the user on a blank surface. The console
        // error surfaces the bug without blanking the screen.
        try { console.warn('[appHome] Command Center render failed, falling back', e); } catch(_){}
        cc.style.display = 'none';
        if (home){
          home.style.display = '';
          renderAppGreeting();
          if (typeof renderDailyGrowth === 'function'){
            try { renderDailyGrowth(); } catch (e2) {}
          }
        }
      }
      return;
    }

    // Legacy fallback — original behaviour preserved. Also hide CC in
    // case the user just flipped window._ccDisabled = true mid-session,
    // so both surfaces don't stack.
    if (cc) cc.style.display = 'none';
    if (!home) return;
    home.style.display = '';
    renderAppGreeting();
    // 2026-05-26 — daily growth snapshot. Renders into any
    // .today-growth-card (this surface has one between the Daily
    // Briefing wrap and the destination menu).
    if (typeof renderDailyGrowth === 'function'){
      try { renderDailyGrowth(); } catch (e) {}
    }
  }

  // Closes a race: the initial DOMContentLoaded render fires BEFORE
  // cloudLoad() populates D.name (cloudLoad is async, runs during
  // auth init). Without these deferred re-renders the greeting can
  // stick on the _supaUser.user_metadata.full_name fallback (e.g.
  // "Good evening, Jason 👋" from the dev's "Jason Vega" metadata)
  // even after D.name eventually arrives. showSection('s-hero') in
  // ui.js also triggers maybeRenderAppHome, but only when the user
  // explicitly navigates — these timers cover the first-paint case.
  function _ahScheduleRerenders(){
    if (typeof setTimeout !== 'function') return;
    setTimeout(maybeRenderAppHome,  600);
    setTimeout(maybeRenderAppHome, 1800);
    setTimeout(maybeRenderAppHome, 4000);
  }

  if (typeof document !== 'undefined'){
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){
        maybeRenderAppHome();
        _ahScheduleRerenders();
      });
    } else {
      maybeRenderAppHome();
      _ahScheduleRerenders();
    }
    document.addEventListener('visibilitychange', function(){
      if (!document.hidden) maybeRenderAppHome();
    });
  }

  if (typeof window !== 'undefined'){
    window.appOpenDest        = appOpenDest;
    window.renderAppGreeting  = renderAppGreeting;
    window.maybeRenderAppHome = maybeRenderAppHome;
    window.renderHomeLauncher = renderHomeLauncher;
  }
})();
