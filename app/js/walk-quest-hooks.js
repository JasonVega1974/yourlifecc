/* =============================================================
   walk-quest-hooks.js — wire "My Walk with God" weekly quests to
   REAL user activity.

   Wrapper-installer. Mirrors streaks.js exactly: on DOMContentLoaded it
   wraps existing global functions, snapshots the done-state BEFORE the
   original runs, re-checks AFTER, and fires window.walkQuestBump(metric)
   only on a genuine false->true flip. It never edits faith.js or any
   feature module.

   Every wrap is typeof-guarded — if a target function is missing the
   wrapper is a silent no-op, never a throw. Double-install guarded with
   window.__walkQ_* flags (safe if _install runs twice).

   Dark launch: quests silently accrue in D.walk.questProg. Nothing
   renders until the "My Walk" doorway is lit — so day-one users will
   already see a warm board instead of 0/target on every quest.

   Metrics wired (walkQuestBump metric names, validated against
   WALK_QUESTS_POOL in walk-stations-data.js):
     devotional · prayer · gratitude · academy · verse · reading · audio · share
============================================================= */
(function () {
  'use strict';

  // Local calendar day — module-internal throttle marker (matches the task
  // template's _todayKey). Not compared against any D key, so tz choice is safe.
  function _todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  // ISO (UTC) day — MUST match how the app keys D.scrReadDays (streaks.js uses
  // new Date().toISOString().slice(0,10)); used only for the devotional check.
  function _isoDay() { return new Date().toISOString().slice(0, 10); }

  function _bump(metric) {
    if (typeof window.walkQuestBump === 'function') window.walkQuestBump(metric, 1);
  }

  // Module-scoped per-day throttles (one bump per calendar day per metric/plan).
  var _lastPrayerDay = null;
  var _lastGratitudeDay = null;
  var _lastReadingDayByPlan = {};

  function _install() {
    var W = window;

    // 1 — devotional: markDevotionalRead + markDevFromPopup.
    //     Guard: D.scrReadDays[today] false->true (once/day is inherent — the
    //     app only sets today's key once).
    ['markDevotionalRead', 'markDevFromPopup'].forEach(function (fn) {
      if (typeof W[fn] === 'function' && !W['__walkQ_' + fn]) {
        W['__walkQ_' + fn] = true;
        var _o = W[fn];
        W[fn] = function () {
          var t = _isoDay();
          var was = !!(W.D && W.D.scrReadDays && W.D.scrReadDays[t]);
          var r = _o.apply(this, arguments);
          var is = !!(W.D && W.D.scrReadDays && W.D.scrReadDays[t]);
          if (!was && is) _bump('devotional');
          return r;
        };
      }
    });

    // 2/3 — prayer / gratitude: savePrayer(type). A genuine save grows
    //       D.prayers (savePrayer returns early on empty input). Route by type;
    //       throttle to one bump per calendar day per metric.
    if (typeof W.savePrayer === 'function' && !W.__walkQ_savePrayer) {
      W.__walkQ_savePrayer = true;
      var _oSave = W.savePrayer;
      W.savePrayer = function (type) {
        var before = (W.D && Array.isArray(W.D.prayers)) ? W.D.prayers.length : 0;
        var r = _oSave.apply(this, arguments);
        var after = (W.D && Array.isArray(W.D.prayers)) ? W.D.prayers.length : 0;
        if (after > before) {
          var t = _todayKey();
          if (type === 'praise') {
            if (_lastGratitudeDay !== t) { _lastGratitudeDay = t; _bump('gratitude'); }
          } else {
            if (_lastPrayerDay !== t) { _lastPrayerDay = t; _bump('prayer'); }
          }
        }
        return r;
      };
    }

    // 4 — academy: academyMarkLessonNew(courseId, lessonId). New completion only
    //     (skip re-clicks): check D.faithAcademyProgress.lessons[lessonId] first.
    if (typeof W.academyMarkLessonNew === 'function' && !W.__walkQ_academy) {
      W.__walkQ_academy = true;
      var _oAcad = W.academyMarkLessonNew;
      W.academyMarkLessonNew = function (courseId, lessonId) {
        var store = (W.D && W.D.faithAcademyProgress && W.D.faithAcademyProgress.lessons) || {};
        var already = !!store[lessonId];
        var r = _oAcad.apply(this, arguments);
        if (!already) _bump('academy');
        return r;
      };
    }

    // 5 — verse: _mvApplySrUpdate(v, correct) is the SM-2-lite update; it flips
    //     v.mastered to true once — via EITHER mastery path (intervalDays
    //     >= 90, or W3-1's three from-the-heart days). Fire on that flip;
    //     the before/after check is path-agnostic.
    if (typeof W._mvApplySrUpdate === 'function' && !W.__walkQ_verse) {
      W.__walkQ_verse = true;
      var _oMv = W._mvApplySrUpdate;
      W._mvApplySrUpdate = function (v, correct) {
        var was = !!(v && v.mastered);
        var r = _oMv.apply(this, arguments);
        var is = !!(v && v.mastered);
        if (!was && is) _bump('verse');
        return r;
      };
    }

    // 6 — reading: planMarkDayDone(planId, dayNum) toggles a plan day. Fire on a
    //     false->true completion only (not un-marks); throttle one/day/plan.
    if (typeof W.planMarkDayDone === 'function' && !W.__walkQ_reading) {
      W.__walkQ_reading = true;
      var _oPlan = W.planMarkDayDone;
      var _dayDone = function (planId, dayNum) {
        try { return !!(W.D.faithPlans.active[planId].completedDays[dayNum]); } catch (_e) { return false; }
      };
      W.planMarkDayDone = function (planId, dayNum) {
        var before = _dayDone(planId, dayNum);
        var r = _oPlan.apply(this, arguments);
        var after = _dayDone(planId, dayNum);
        if (!before && after) {
          var t = _todayKey();
          if (_lastReadingDayByPlan[planId] !== t) { _lastReadingDayByPlan[planId] = t; _bump('reading'); }
        }
        return r;
      };
    }

    // 7 — audio: _medComplete(med) is called once when a meditation's segments
    //     are exhausted (faith.js). One bump per session end.
    if (typeof W._medComplete === 'function' && !W.__walkQ_audio) {
      W.__walkQ_audio = true;
      var _oMed = W._medComplete;
      W._medComplete = function () {
        var r = _oMed.apply(this, arguments);
        _bump('audio');
        return r;
      };
    }

    // 8 — share: vcShare() shares the Verse-of-the-Day card via navigator.share.
    //     Fire on every invocation (grace-first; cancels are rare and harmless).
    //     NOTE: this covers VERSE-CARD shares only. The per-prayer share button
    //     in quick-prayers.js is an anonymous inline click listener (no global
    //     to wrap), so prayer-page shares are NOT counted by this pattern.
    if (typeof W.vcShare === 'function' && !W.__walkQ_share) {
      W.__walkQ_share = true;
      var _oShare = W.vcShare;
      W.vcShare = function () {
        var r = _oShare.apply(this, arguments);
        _bump('share');
        return r;
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _install);
  } else {
    _install();
  }
})();
