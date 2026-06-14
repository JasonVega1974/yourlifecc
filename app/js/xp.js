/* =============================================================
   xp.js — Unified app-wide XP currency (WC-2a)

   ONE player-facing progress score every completion funnels into.
   xpTotal is the number the kid thinks of as "how I'm doing" — it
   drives the WC-2b ring / streak / league. It is purely ADDITIVE
   and stays SEPARATE from the three feature-internal mechanics:
     - chorePoints  (spendable bucks wallet — decreases on spend)
     - scrPoints    (faith XP)
     - traits       (per-trait XP)
   Those are never merged or touched here.

   Wrapper-based, exactly like streaks.js: every awarding hook wraps
   an existing GLOBAL completion function without editing faith.js or
   any feature module. Guards mirror streaks.js — snapshot done-state
   BEFORE the original runs, re-check AFTER, award only on a genuine
   false->true flip, so re-clicking an already-done item never
   re-awards. Self-installs on DOMContentLoaded (no init.js edit).

   awardXP is NOT tier-gated (faith-free included) — display gating
   is WC-2b. window.xpJuice (WC-2c) is fired if present.

   Public surface (window.*):
     awardXP(n, source)   getXpToday()   getXpTotal()   getDailyGoal()
     XP_VALUES            (tunable table, inspectable)
============================================================= */

(function(){
  'use strict';

  // ── tunable XP values (single source of truth) ───────────────
  var XP_VALUES = {
    devotional:     10,   // markDevotionalRead / markDevFromPopup (once/day via guard)
    academy_lesson: 15,   // academyMarkLessonNew
    habit:           5,   // toggleHabitV2Today (small; several/day)
    chore:           8,   // markChoreDone (kid's submit action)
    goal:           20,   // toggleGoal / completeGoal / checkGoalAutoComplete
    skill_cert:     25,   // finishSkillQuiz, first cert only (rare, biggest)
    health:          8    // first workout/sleep log of the day (wellbeing: never weight/food)
  };
  var DEFAULT_DAILY_GOAL = 25;
  var XP_LOG_CAP = 365;

  function _today(){ return new Date().toISOString().slice(0, 10); }
  function _val(key){ return (XP_VALUES[key] != null) ? XP_VALUES[key] : 0; }

  // ── day rollover ─────────────────────────────────────────────
  // xpToday resets when the day key changes. Called by awardXP (write
  // path) and getXpToday (read path) so a new day always shows 0.
  function _rollover(){
    if (typeof D === 'undefined' || !D) return;
    var t = _today();
    if (D.xpDayKey !== t){ D.xpDayKey = t; D.xpToday = 0; }
  }

  // ── core writer ──────────────────────────────────────────────
  function awardXP(n, source){
    if (typeof D === 'undefined' || !D) return;
    n = +n || 0;
    if (n <= 0) return;
    _rollover();
    _streakBumpForToday();   // WC-2b-ii — count an any-XP day on the first XP of a new day
    D.xpToday = (+D.xpToday || 0) + n;
    D.xpTotal = (+D.xpTotal || 0) + n;
    if (!Array.isArray(D.xpLog)) D.xpLog = [];
    D.xpLog.push({ ts: Date.now(), n: n, source: source || 'unknown' });
    if (D.xpLog.length > XP_LOG_CAP) D.xpLog = D.xpLog.slice(D.xpLog.length - XP_LOG_CAP);
    if (typeof save === 'function') save();
    // WC-2c plugs the juice/animation in here. Guarded — never required.
    try { if (typeof window !== 'undefined' && typeof window.xpJuice === 'function') window.xpJuice(n, source); } catch(_){}
  }

  // ── readers ──────────────────────────────────────────────────
  function getXpToday(){ _rollover(); return (typeof D !== 'undefined' && D) ? (+D.xpToday || 0) : 0; }
  function getXpTotal(){ return (typeof D !== 'undefined' && D) ? (+D.xpTotal || 0) : 0; }
  function getDailyGoal(){
    if (typeof D !== 'undefined' && D && +D.dailyGoal > 0) return +D.dailyGoal;
    return DEFAULT_DAILY_GOAL;
  }

  // ── unified streak (the flame) — WC-2b-ii ────────────────────
  // A day counts if the kid earned ANY XP that day (gentler than "hit the
  // daily goal" — the ring is the separate goal-met signal). All day keys are
  // UTC, matching the rest of the app's toISOString().slice(0,10).
  function _dayKeyOffset(delta){
    var d = new Date();
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10);
  }
  // Sabbath bridge: an idle Sunday between two active days must not break the
  // streak (active Sat -> idle Sun -> active Mon continues), matching the faith
  // app's Sunday auto-protect. The ONLY all-Sunday gap is exactly a one-day gap
  // whose bridged day is Sunday — any longer gap necessarily includes a
  // non-Sunday — so this stays simple, not gnarly on multi-day/week gaps.
  function _isSabbathBridge(lastKey, todayKey){
    if (!lastKey) return false;
    var last  = Date.parse(lastKey  + 'T00:00:00Z');
    var today = Date.parse(todayKey + 'T00:00:00Z');
    if (isNaN(last) || isNaN(today)) return false;
    if (Math.round((today - last) / 86400000) !== 2) return false;
    var mid = new Date(last); mid.setUTCDate(mid.getUTCDate() + 1);
    return mid.getUTCDay() === 0;
  }
  // One-time migration seed (lastDayKey === null) so the flame doesn't reset to
  // 1 when the headline repoints from D.streak to this. Seed from
  // getScriptureStreak() — read-only into faith.js; it has Sunday/skip
  // forgiveness and returns 0 when truly broken, so it never over-credits.
  // D.streak is NOT folded in: ui.js increments it but never resets it on a
  // missed day (verified), so it is stale-high. getScriptureStreak() already
  // counts today (read/Sunday/skip), so anchoring lastDayKey=today makes
  // today's XP a no-op and tomorrow increments to seed+1 — no double-count.
  function _ensureXpStreak(){
    if (typeof D === 'undefined' || !D) return;
    if (!D.xpStreak || typeof D.xpStreak !== 'object'){
      D.xpStreak = { count: 0, lastDayKey: null, longest: 0 };
    }
    if (D.xpStreak.lastDayKey === null){
      var seed = 0;
      try { if (typeof getScriptureStreak === 'function') seed = +getScriptureStreak() || 0; } catch(_){}
      if (seed < 0) seed = 0;
      D.xpStreak.count = seed;
      D.xpStreak.longest = seed;
      // Anchor depends on whether the seed already includes today.
      // getScriptureStreak() always counts today (read/Sunday/skip on its first
      // step), so a POSITIVE seed includes today -> anchor today: today's XP
      // no-ops and tomorrow increments to seed+1 (no double-count). A ZERO seed
      // (brand-new kid with no prior streak, or getScriptureStreak unavailable)
      // does NOT include today -> anchor YESTERDAY so today's first XP bumps
      // 0 -> 1. Without this, a new kid's first active day would read 0/hide.
      D.xpStreak.lastDayKey = (seed > 0) ? _today() : _dayKeyOffset(-1);
    }
  }
  // Called from awardXP on every award; only acts on the first XP of a new day.
  function _streakBumpForToday(){
    _ensureXpStreak();
    var s = (typeof D !== 'undefined' && D) ? D.xpStreak : null;
    if (!s) return;
    var today = _today();
    if (s.lastDayKey === today) return;                  // already counted today (incl. the seed)
    if (s.lastDayKey === _dayKeyOffset(-1) || _isSabbathBridge(s.lastDayKey, today)){
      s.count = (+s.count || 0) + 1;                      // consecutive (or Sabbath-bridged)
    } else {
      s.count = 1;                                         // a gap -> fresh streak
    }
    s.lastDayKey = today;
    if (s.count > (+s.longest || 0)) s.longest = s.count;
  }
  // Reader: live truth without a cron. Returns count while the streak is
  // current (today / yesterday / Sabbath-bridged); 0 once broken (the reset to
  // 1 happens on the next awardXP, not on read).
  // Freshness-aware reader usable on ANY profile's data — the live active D or
  // an inactive kid's p.data (parent-hub kid cards). Single source for the
  // today/yesterday/Sabbath check, so a stale lastDayKey reads 0 rather than a
  // falsely-live streak. PURE READ — does NOT seed; seeding belongs to the
  // owning profile's own session (a kid unmigrated since WC-2b reads 0 here
  // until their next login, by design — we don't fake it).
  function getXpStreakFromData(data){
    if (!data || typeof data !== 'object') return 0;
    var s = data.xpStreak;
    if (!s || typeof s !== 'object') return 0;
    var today = _today();
    if (s.lastDayKey === today) return (+s.count || 0);
    if (s.lastDayKey === _dayKeyOffset(-1)) return (+s.count || 0);
    if (_isSabbathBridge(s.lastDayKey, today)) return (+s.count || 0);
    return 0;
  }
  function getXpStreak(){
    _ensureXpStreak();
    return getXpStreakFromData(typeof D !== 'undefined' ? D : null);
  }

  // ── guard helpers (key-agnostic: count deltas beat date-key math) ─
  function _objCount(o){ return (o && typeof o === 'object') ? Object.keys(o).length : 0; }
  function _scrDays(){ return (typeof D !== 'undefined' && D) ? D.scrReadDays : null; }
  function _acLessons(){ return (typeof D !== 'undefined' && D && D.faithAcademyProgress) ? D.faithAcademyProgress.lessons : null; }
  function _habitById(id){ return (typeof D !== 'undefined' && Array.isArray(D.habitsV2)) ? D.habitsV2.find(function(x){ return x && x.id === id; }) : null; }
  function _goalsDone(){ return (typeof D !== 'undefined' && Array.isArray(D.goals)) ? D.goals.filter(function(g){ return g && g.done; }).length : 0; }
  function _certCount(){ return (typeof D !== 'undefined' && D && D.skillCerts) ? Object.values(D.skillCerts).filter(Boolean).length : 0; }
  function _topId(arrName){
    var a = (typeof D !== 'undefined' && Array.isArray(D[arrName])) ? D[arrName] : null;
    return (a && a.length && a[0]) ? a[0].id : null;
  }
  // Health daily cap: has a 'health' XP award already landed today?
  function _healthAwardedToday(){
    if (typeof D === 'undefined' || !D || !Array.isArray(D.xpLog)) return false;
    var t = _today();
    for (var i = D.xpLog.length - 1; i >= 0; i--){
      var e = D.xpLog[i];
      if (e && e.source === 'health' && new Date(e.ts).toISOString().slice(0, 10) === t) return true;
    }
    return false;
  }

  // ── wrap primitive (idempotent via distinct window._xpWrapped* flags) ─
  function _wrap(name, flag, makeWrapper){
    if (typeof window === 'undefined') return false;
    if (typeof window[name] === 'function' && !window[flag]){
      window[flag] = true;
      var orig = window[name];
      window[name] = makeWrapper(orig);
      return true;
    }
    return false;
  }

  // ── install hooks ────────────────────────────────────────────
  function _installXpHooks(){
    // FAITH — devotional (two entry points, both write D.scrReadDays).
    // Composes with streaks.js: xp wraps on DOMContentLoaded (inner),
    // streaks wraps in finishInit (outer); both snapshot/award once.
    _wrap('markDevotionalRead', '_xpWrappedDev', function(orig){
      return function(){
        var b = _objCount(_scrDays());
        var r = orig.apply(this, arguments);
        if (_objCount(_scrDays()) > b) awardXP(_val('devotional'), 'devotional');
        return r;
      };
    });
    _wrap('markDevFromPopup', '_xpWrappedPopup', function(orig){
      return function(){
        var b = _objCount(_scrDays());
        var r = orig.apply(this, arguments);
        if (_objCount(_scrDays()) > b) awardXP(_val('devotional'), 'devotional');
        return r;
      };
    });
    // FAITH — academy lesson completion.
    _wrap('academyMarkLessonNew', '_xpWrappedAcademy', function(orig){
      return function(){
        var b = _objCount(_acLessons());
        var r = orig.apply(this, arguments);
        if (_objCount(_acLessons()) > b) awardXP(_val('academy_lesson'), 'academy_lesson');
        return r;
      };
    });
    // HABITS — toggleHabitV2Today (award on add, not on un-check).
    _wrap('toggleHabitV2Today', '_xpWrappedHabit', function(orig){
      return function(id){
        var h0 = _habitById(id); var b = h0 ? _objCount(h0.completions) : 0;
        var r = orig.apply(this, arguments);
        var h1 = _habitById(id); var a = h1 ? _objCount(h1.completions) : 0;
        if (a > b) awardXP(_val('habit'), 'habit');
        return r;
      };
    });
    // CHORES — markChoreDone is ASYNC: chain on the returned promise so the
    // award only fires after the (possibly photo-uploading) submit resolves
    // and only if a new choreLog entry was actually pushed.
    _wrap('markChoreDone', '_xpWrappedChore', function(orig){
      return function(){
        var len0 = (typeof D !== 'undefined' && Array.isArray(D.choreLog)) ? D.choreLog.length : 0;
        var ret = orig.apply(this, arguments);
        var check = function(){
          var len1 = (typeof D !== 'undefined' && Array.isArray(D.choreLog)) ? D.choreLog.length : 0;
          if (len1 > len0) awardXP(_val('chore'), 'chore');
        };
        if (ret && typeof ret.then === 'function'){
          return ret.then(function(v){ check(); return v; }, function(err){ throw err; });
        }
        check();
        return ret;
      };
    });
    // GOALS — three completion paths; award once on a done-count increase.
    ['toggleGoal', 'completeGoal', 'checkGoalAutoComplete'].forEach(function(fn, i){
      _wrap(fn, '_xpWrappedGoal' + i, function(orig){
        return function(){
          var b = _goalsDone();
          var r = orig.apply(this, arguments);
          if (_goalsDone() > b) awardXP(_val('goal'), 'goal');
          return r;
        };
      });
    });
    // SKILLS — finishSkillQuiz; award on earned-cert count increase (a retake
    // doesn't increase it, so no re-award).
    _wrap('finishSkillQuiz', '_xpWrappedSkill', function(orig){
      return function(){
        var b = _certCount();
        var r = orig.apply(this, arguments);
        if (_certCount() > b) awardXP(_val('skill_cert'), 'skill_cert');
        return r;
      };
    });
    // HEALTH — workout/sleep ONLY (wellbeing: never weight/food, so the app
    // never nudges more frequent weight/calorie tracking). Once per day,
    // capped. Guard = a new entry landed at the top of the log (cap-safe) AND
    // no health XP has been awarded yet today.
    function _healthWrap(name, flag, arrName){
      _wrap(name, flag, function(orig){
        return function(){
          var top0 = _topId(arrName);
          var r = orig.apply(this, arguments);
          var top1 = _topId(arrName);
          if (top1 != null && top1 !== top0 && !_healthAwardedToday()) awardXP(_val('health'), 'health');
          return r;
        };
      });
    }
    _healthWrap('logWorkout', '_xpWrappedWorkout', 'workoutLog');
    _healthWrap('logSleep',   '_xpWrappedSleep',   'sleepLog');
  }

  // ── self-install (DOMContentLoaded) + a few retries ──────────
  // All targets are deferred globals defined by DOMContentLoaded, so the
  // first pass usually wraps everything. The retries cover any target
  // defined slightly later; per-target flags keep repeat calls idempotent.
  var _XP_FLAGS = [
    '_xpWrappedDev', '_xpWrappedPopup', '_xpWrappedAcademy', '_xpWrappedHabit',
    '_xpWrappedChore', '_xpWrappedGoal0', '_xpWrappedGoal1', '_xpWrappedGoal2',
    '_xpWrappedSkill', '_xpWrappedWorkout', '_xpWrappedSleep'
  ];
  function _allWrapped(){ return _XP_FLAGS.every(function(f){ return !!window[f]; }); }

  var _tries = 0;
  function _tryInstall(){
    _installXpHooks();
    _tries++;
    if (!_allWrapped() && _tries < 6) setTimeout(_tryInstall, 400);
  }
  function _boot(){
    if (typeof document !== 'undefined' && document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', _tryInstall, { once: true });
    } else {
      _tryInstall();
    }
  }
  _boot();

  // ── exports ──────────────────────────────────────────────────
  if (typeof window !== 'undefined'){
    window.awardXP      = awardXP;
    window.getXpToday   = getXpToday;
    window.getXpTotal   = getXpTotal;
    window.getDailyGoal = getDailyGoal;
    window.getXpStreak  = getXpStreak;
    window.getXpStreakFromData = getXpStreakFromData;
    window.XP_VALUES    = XP_VALUES;
  }
})();
