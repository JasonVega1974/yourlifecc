/* =============================================================
   xp-juice-hooks.js — WC-2c juice-parity rollout (HOME_UPGRADE_PLAN §5).

   Distributes the shipped juice layer (sfx.js / haptics.js / awardXP's
   xpJuice toast / confetti) onto every non-faith completion event that
   was silent or partial. ZERO feature-file edits: every hook wraps an
   existing GLOBAL completion function in the exact xp.js:_wrap idiom —
   snapshot done-state BEFORE the original runs, re-check AFTER, act only
   on a genuine false->true flip (re-clicks never double-fire); idempotent
   per-target window._jh* flags; self-installs on DOMContentLoaded with
   retries (no init.js edit). Composes with xp.js/streaks.js wrappers on
   the same targets — each layer snapshots independently.

   Faith surfaces are OUT OF SCOPE by design (plan §5/§6): faith
   completions keep their native FX; this module never touches them.

   sfx/haptics self-gate on D.soundEnabled/D.hapticsEnabled and every
   call here rides an existing or added VISUAL cue (xpJuice toast,
   confetti, in-file toast) — never sound-only. Kind-not-punishing:
   only correct/perfect/streak registers, never wrong/tryAgain.

   XP keys used here live in xp.js XP_VALUES (additive entries):
   school, sports, milestone, water, pr, finance_goal, finance_tx.
   ('water' is deliberately NOT 'health' — the 'health' source is capped
   once/day in xp.js and reusing it would silently eat the kid's later
   workout/sleep award.)

   Kill switch: set window._juiceHooksOff = true (console/hotfix) or
   localStorage ylcc_juice_hooks_off = '1' before DOMContentLoaded and
   nothing wraps. Removing the single <script> tag is the hard rollback.
============================================================= */
(function(){
  'use strict';

  function _killed(){
    try {
      if (typeof window !== 'undefined' && window._juiceHooksOff === true) return true;
      if (typeof localStorage !== 'undefined' && localStorage.getItem('ylcc_juice_hooks_off') === '1') return true;
    } catch(_){}
    return false;
  }

  function _D(){ return (typeof window !== 'undefined' && window.D) ? window.D : null; }

  // ── guarded effect helpers (every primitive is optional) ─────
  function _sfx(k){ try { if (window.sfx && typeof window.sfx[k] === 'function') window.sfx[k](); } catch(_){} }
  function _hap(k){ try { if (window.haptics && typeof window.haptics[k] === 'function') window.haptics[k](); } catch(_){} }
  function _confetti(){ try { if (typeof window.launchSideConfetti === 'function') window.launchSideConfetti(); } catch(_){} }
  function _toast(m){ try { if (typeof window.showToast === 'function') window.showToast(m); } catch(_){} }
  // Award via the xp.js table so tuning stays single-source; awardXP fires
  // the xpJuice toast itself (that toast is the visual cue for XP events).
  function _xp(key){
    try {
      if (typeof window.awardXP === 'function' && window.XP_VALUES && +window.XP_VALUES[key] > 0){
        window.awardXP(+window.XP_VALUES[key], key);
      }
    } catch(_){}
  }

  // ── done-state counters (key-agnostic: count deltas beat date math) ─
  function _asgDone(){
    var d = _D(); return (d && Array.isArray(d.assignments)) ? d.assignments.filter(function(a){ return a && a.done; }).length : 0;
  }
  function _goalsDone(){
    var d = _D(); return (d && Array.isArray(d.goals)) ? d.goals.filter(function(g){ return g && g.done; }).length : 0;
  }
  function _msDone(){
    var d = _D(); if (!d || !Array.isArray(d.goals)) return 0;
    return d.goals.reduce(function(n, g){
      return n + ((g && Array.isArray(g.milestones)) ? g.milestones.filter(function(m){ return m && m.done; }).length : 0);
    }, 0);
  }
  function _choreLen(){ var d = _D(); return (d && Array.isArray(d.choreLog)) ? d.choreLog.length : 0; }
  function _habitCompletions(id){
    var d = _D(); if (!d || !Array.isArray(d.habitsV2)) return 0;
    var h = d.habitsV2.find(function(x){ return x && x.id === id; });
    return (h && h.completions && typeof h.completions === 'object') ? Object.keys(h.completions).length : 0;
  }
  function _topId(arrName){
    var d = _D(); var a = (d && Array.isArray(d[arrName])) ? d[arrName] : null;
    return (a && a.length && a[0]) ? a[0].id : null;
  }
  function _today(){ return new Date().toISOString().slice(0, 10); }
  function _waterCupsToday(){
    var d = _D(); if (!d || !Array.isArray(d.waterLog)) return 0;
    var t = _today();
    var e = d.waterLog.find(function(x){ return x && x.date === t; });
    return e ? (+e.cups || 0) : 0;
  }
  function _waterGoal(){ var d = _D(); return (d && +d.waterGoal > 0) ? +d.waterGoal : 8; }
  // Once/day re-cross guard (cups can go down and re-cross): has a 'water'
  // XP award already landed today? Mirrors xp.js _healthAwardedToday.
  function _waterAwardedToday(){
    var d = _D(); if (!d || !Array.isArray(d.xpLog)) return false;
    var t = _today();
    for (var i = d.xpLog.length - 1; i >= 0; i--){
      var e = d.xpLog[i];
      if (e && e.source === 'water' && new Date(e.ts).toISOString().slice(0, 10) === t) return true;
    }
    return false;
  }
  function _prSnapshot(){
    var d = _D(); var out = {};
    if (d && d.prRecords && typeof d.prRecords === 'object'){
      Object.keys(d.prRecords).forEach(function(k){
        var r = d.prRecords[k];
        if (r) out[k] = +r.value || 0;
      });
    }
    return out;
  }
  // Strict beat: a key that existed before AND whose value strictly rose.
  function _prBeat(before){
    var d = _D(); if (!d || !d.prRecords || typeof d.prRecords !== 'object') return false;
    return Object.keys(d.prRecords).some(function(k){
      var r = d.prRecords[k];
      return r && Object.prototype.hasOwnProperty.call(before, k) && (+r.value || 0) > before[k];
    });
  }
  function _savingsCompleted(){
    var d = _D(); return (d && Array.isArray(d.savingsGoals)) ? d.savingsGoals.filter(function(g){ return g && g.completedAt; }).length : 0;
  }
  function _moneyMsCount(){
    var d = _D(); return (d && d.moneyMilestones && typeof d.moneyMilestones === 'object') ? Object.keys(d.moneyMilestones).length : 0;
  }
  function _txLen(){ var d = _D(); return (d && Array.isArray(d.transactions)) ? d.transactions.length : 0; }
  function _selfChoresApprovedCount(){
    var d = _D(); return (d && Array.isArray(d.selfChores)) ? d.selfChores.filter(function(c){ return c && c.status === 'approved'; }).length : 0;
  }
  function _sportMsTotal(){
    var d = _D(); if (!d || !Array.isArray(d.mySports)) return 0;
    return d.mySports.reduce(function(n, s){ return n + ((s && Array.isArray(s.milestones)) ? s.milestones.length : 0); }, 0);
  }
  function _seasonsTotal(){
    var d = _D(); if (!d || !Array.isArray(d.mySports)) return 0;
    return d.mySports.reduce(function(n, s){ return n + ((s && Array.isArray(s.seasons)) ? s.seasons.length : 0); }, 0);
  }

  // ── wrap primitive (idempotent via distinct window._jh* flags) ─
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
  // Common shape: numeric counter increased across the call -> fire fx.
  function _wrapDelta(name, flag, counter, fx){
    _wrap(name, flag, function(orig){
      return function(){
        var b = counter();
        var r = orig.apply(this, arguments);
        if (counter() > b) fx();
        return r;
      };
    });
  }

  // ── install hooks ────────────────────────────────────────────
  function _installJuiceHooks(){

    // SCHOOL — toggleAsg was FULLY silent (plan §5 highest-priority fix).
    // XP fires the xpJuice toast (the visual); sfx/haptic ride it.
    _wrapDelta('toggleAsg', '_jhSchool', _asgDone, function(){
      _xp('school'); _sfx('correct'); _hap('correct');
    });

    // GOALS — perfect register on every completion path. Confetti already
    // fires in-file on completeGoal/checkGoalAutoComplete; the toggle path
    // had none (plan: parity), so it gets confetti here.
    _wrapDelta('toggleGoal', '_jhGoalToggle', _goalsDone, function(){
      _sfx('perfect'); _hap('perfect'); _confetti();
    });
    _wrapDelta('completeGoal', '_jhGoalBtn', _goalsDone, function(){
      _sfx('perfect'); _hap('perfect');
    });
    _wrapDelta('checkGoalAutoComplete', '_jhGoalAuto', _goalsDone, function(){
      _sfx('perfect'); _hap('perfect');
    });
    // Milestone check-off (non-final): toggleMilestone CALLS
    // checkGoalAutoComplete internally (goals.js:985), so when the final
    // milestone completes the goal in the same call, the goal juice above
    // (+ xp.js goal XP) already fired — suppress the milestone layer.
    _wrap('toggleMilestone', '_jhMilestone', function(orig){
      return function(){
        var ms0 = _msDone(), g0 = _goalsDone();
        var r = orig.apply(this, arguments);
        if (_goalsDone() === g0 && _msDone() > ms0){
          _xp('milestone'); _sfx('correct'); _hap('correct');
        }
        return r;
      };
    });

    // CHORES — markChoreDone is ASYNC (possibly photo-uploading submit):
    // chain on the returned promise exactly like xp.js:_xpWrappedChore.
    // XP is already wrapped there; this adds the sound/haptic pair.
    _wrap('markChoreDone', '_jhChore', function(orig){
      return function(){
        var len0 = _choreLen();
        var ret = orig.apply(this, arguments);
        var check = function(){ if (_choreLen() > len0){ _sfx('correct'); _hap('correct'); } };
        if (ret && typeof ret.then === 'function'){
          return ret.then(function(v){ check(); return v; }, function(err){ throw err; });
        }
        check();
        return ret;
      };
    });

    // HABITS — sfx/haptic on a genuine check (not an un-check); XP already
    // handled by xp.js. Side confetti already fires in-file.
    _wrap('toggleHabitV2Today', '_jhHabit', function(orig){
      return function(id){
        var b = _habitCompletions(id);
        var r = orig.apply(this, arguments);
        if (_habitCompletions(id) > b){ _sfx('correct'); _hap('correct'); }
        return r;
      };
    });

    // HEALTH — workout/sleep logged (XP already in xp.js; add the pair).
    function _logWrap(name, flag, arrName){
      _wrap(name, flag, function(orig){
        return function(){
          var top0 = _topId(arrName);
          var r = orig.apply(this, arguments);
          var top1 = _topId(arrName);
          if (top1 != null && top1 !== top0){ _sfx('correct'); _hap('correct'); }
          return r;
        };
      });
    }
    _logWrap('logWorkout', '_jhWorkout', 'workoutLog');
    _logWrap('logSleep',   '_jhSleep',   'sleepLog');

    // HEALTH — water daily-goal cross (confetti + toast already in-file at
    // the cross). Small XP, once per day even if cups dip and re-cross.
    _wrap('logWater', '_jhWater', function(orig){
      return function(){
        var before = _waterCupsToday(), goal = _waterGoal();
        var r = orig.apply(this, arguments);
        if (before < goal && _waterCupsToday() >= goal && !_waterAwardedToday()){
          _xp('water'); _sfx('correct'); _hap('correct');
        }
        return r;
      };
    });

    // HEALTH — PR strictly beaten (in-file already: confetti + toast on
    // beat). First-time set / equal re-entry stay quiet by design.
    _wrap('addPR', '_jhPR', function(orig){
      return function(){
        var before = _prSnapshot();
        var r = orig.apply(this, arguments);
        if (_prBeat(before)){ _xp('pr'); _sfx('streak'); _hap('streak'); }
        return r;
      };
    });

    // FINANCE — transaction logged: tiny XP, NO sfx (logging ≠ achievement,
    // keep quiet — plan §5). Edit-mode and purchase-gate branches don't
    // push to D.transactions, so they correctly award nothing.
    _wrapDelta('addTx', '_jhFinTx', _txLen, function(){ _xp('finance_tx'); });

    // FINANCE — savings goal reached (the live add path is _quickAddSave;
    // addToGoal is now just the inline-input opener). completedAt flips
    // empty -> date exactly on the cross. Confetti + toast already in-file.
    _wrapDelta('_quickAddSave', '_jhFinGoal', _savingsCompleted, function(){
      _xp('finance_goal'); _sfx('perfect'); _hap('perfect');
    });

    // FINANCE — money milestone fired (one-shot keys in D.moneyMilestones;
    // flash + confetti + toast already in-file, staggered).
    _wrapDelta('_checkMoneyMilestones', '_jhFinMs', _moneyMsCount, function(){
      _sfx('streak'); _hap('streak');
    });

    // SPORTS — milestone added (was fully silent). Renamed global post
    // collision-fix 2a19f5e: addSportMilestone, NOT addMilestone.
    _wrapDelta('addSportMilestone', '_jhSportMs', _sportMsTotal, function(){
      _xp('sports'); _sfx('streak'); _hap('streak'); _confetti();
    });

    // SPORTS — season stat added (was fully silent). Keep light: quiet
    // tick + toast, no XP (stat entry is logging, not achievement).
    _wrapDelta('addSeasonStat', '_jhSportStat', _seasonsTotal, function(){
      _sfx('correct'); _toast('Season stats saved 📊');
    });

    // PARENT HUB — approveSelfChore is the parent's most-repeated approval
    // action (HOME_UPGRADE_PLAN §4 Session 3 task 4); it already awards
    // chorePoints + PB and shows its own toast, but had zero sfx/haptic.
    // Chore-family register (matches markChoreDone's 'correct'). No XP —
    // chorePoints/PB are separate currencies from unified XP by design.
    _wrapDelta('approveSelfChore', '_jhApproveChore', _selfChoresApprovedCount, function(){
      _sfx('correct'); _hap('correct');
    });
  }

  // ── self-install (DOMContentLoaded) + retries, mirrors xp.js ─
  var _JH_FLAGS = [
    '_jhSchool', '_jhGoalToggle', '_jhGoalBtn', '_jhGoalAuto', '_jhMilestone',
    '_jhChore', '_jhHabit', '_jhWorkout', '_jhSleep', '_jhWater', '_jhPR',
    '_jhFinTx', '_jhFinGoal', '_jhFinMs', '_jhSportMs', '_jhSportStat',
    '_jhApproveChore'
  ];
  function _allWrapped(){ return _JH_FLAGS.every(function(f){ return !!window[f]; }); }

  var _tries = 0;
  function _tryInstall(){
    if (_killed()) return;
    _installJuiceHooks();
    _tries++;
    if (!_allWrapped() && _tries < 6) setTimeout(_tryInstall, 400);
  }
  function _boot(){
    if (_killed()) return;
    if (typeof document !== 'undefined' && document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', _tryInstall, { once: true });
    } else {
      _tryInstall();
    }
  }
  _boot();
})();
