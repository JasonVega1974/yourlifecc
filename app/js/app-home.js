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
          '<div class="fz-greet-hi">Good ' + part + ', ' + _ahEsc(name) + ' 👋</div>' +
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

  // Hide the appHome when the parent surface is active OR the user
  // is on a faith-free plan (their cinematic Enter The Well hero
  // takes the whole screen). Otherwise show it.
  function maybeRenderAppHome(){
    if (typeof document === 'undefined') return;
    var home = document.getElementById('appHome');
    if (!home) return;
    var hideForParent = document.body && document.body.classList.contains('parent-view');
    var hideForFaithFree = !!window._faithFree;
    if (hideForParent || hideForFaithFree){
      home.style.display = 'none';
      return;
    }
    home.style.display = '';
    renderAppGreeting();
  }

  if (typeof document !== 'undefined'){
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', maybeRenderAppHome);
    } else {
      maybeRenderAppHome();
    }
    document.addEventListener('visibilitychange', function(){
      if (!document.hidden) maybeRenderAppHome();
    });
  }

  if (typeof window !== 'undefined'){
    window.appOpenDest        = appOpenDest;
    window.renderAppGreeting  = renderAppGreeting;
    window.maybeRenderAppHome = maybeRenderAppHome;
  }
})();
