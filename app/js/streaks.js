/* =============================================================
   streaks.js — Cloud-persisted streak engine (Phase 1A)

   Maintains one user_streaks row in Supabase per user.
   Wraps the devotional-mark and academy-lesson functions
   (without modifying faith.js) so every completion is counted.

   Public surface:
     initStreaks()             — call from finishInit() after auth
     recordDevotionalComplete()— increment devotional_completions
     recordStudyComplete()     — increment study_completions
     syncStreakNow()           — recompute + upsert without counter bump
     getStreakCache()          — returns current cached row (or null)
============================================================= */

var _streakCache = null;
var _streakInited = false;

// ── LOAD ──────────────────────────────────────────────────────

async function _streaksLoad() {
  var supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if (!supa || !_supaUser) return null;
  try {
    var res = await supa.from('user_streaks')
      .select('*')
      .eq('user_id', _supaUser.id)
      .maybeSingle();
    if (res.error) { console.warn('[streaks] load error', res.error.message); return null; }
    _streakCache = res.data || null;
    return _streakCache;
  } catch (e) { console.warn('[streaks] load exception', e); return null; }
}

// ── SAVE ──────────────────────────────────────────────────────

async function _streaksSave(patch) {
  var supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if (!supa || !_supaUser) return;

  var today = new Date().toISOString().slice(0, 10);
  var curStreak = (typeof getScriptureStreak === 'function') ? getScriptureStreak() : 0;
  var prevLongest = (_streakCache && _streakCache.longest_streak) || 0;
  var prevDev     = (_streakCache && _streakCache.devotional_completions) || 0;
  var prevStudy   = (_streakCache && _streakCache.study_completions) || 0;

  var row = {
    user_id:                _supaUser.id,
    current_streak:         curStreak,
    longest_streak:         Math.max(prevLongest, curStreak),
    last_active_date:       today,
    total_days:             Object.keys((typeof D !== 'undefined' && D.scrReadDays) || {}).length,
    devotional_completions: patch.devotional_completions !== undefined ? patch.devotional_completions : prevDev,
    study_completions:      patch.study_completions      !== undefined ? patch.study_completions      : prevStudy,
    updated_at:             new Date().toISOString()
  };

  try {
    var res = await supa.from('user_streaks').upsert(row, { onConflict: 'user_id' });
    if (res.error) { console.warn('[streaks] save error', res.error.message); return; }
    _streakCache = Object.assign(_streakCache || {}, row);
  } catch (e) { console.warn('[streaks] save exception', e); }
}

// ── PUBLIC RECORDERS ─────────────────────────────────────────

function recordDevotionalComplete() {
  var prev = (_streakCache && _streakCache.devotional_completions) || 0;
  _streaksSave({ devotional_completions: prev + 1 });
}

function recordStudyComplete() {
  var prev = (_streakCache && _streakCache.study_completions) || 0;
  _streaksSave({ study_completions: prev + 1 });
}

function syncStreakNow() {
  _streaksSave({});
}

function getStreakCache() {
  return _streakCache;
}

// ── FUNCTION WRAPPERS ────────────────────────────────────────
// Wrap existing faith.js globals so completions are counted
// without touching faith.js. Guards prevent double-wrapping
// (same pattern as init.js idempotency guards).

function _installStreakHooks() {
  // markDevotionalRead — main devotional tab "Mark as Read" button
  if (typeof window.markDevotionalRead === 'function' && !window.__streaksDevWrapped) {
    window.__streaksDevWrapped = true;
    var _origDev = window.markDevotionalRead;
    window.markDevotionalRead = function () {
      var today = new Date().toISOString().slice(0, 10);
      var wasRead = !!(typeof D !== 'undefined' && D.scrReadDays && D.scrReadDays[today]);
      _origDev.apply(this, arguments);
      if (!wasRead && typeof D !== 'undefined' && D.scrReadDays && D.scrReadDays[today]) {
        recordDevotionalComplete();
      }
    };
  }

  // markDevFromPopup — daily devotional popup "Mark as Read" button
  if (typeof window.markDevFromPopup === 'function' && !window.__streaksPopupWrapped) {
    window.__streaksPopupWrapped = true;
    var _origPopup = window.markDevFromPopup;
    window.markDevFromPopup = function () {
      var today = new Date().toISOString().slice(0, 10);
      var wasRead = !!(typeof D !== 'undefined' && D.scrReadDays && D.scrReadDays[today]);
      _origPopup.apply(this, arguments);
      if (!wasRead && typeof D !== 'undefined' && D.scrReadDays && D.scrReadDays[today]) {
        recordDevotionalComplete();
      }
    };
  }

  // academyMarkLessonNew — Faith Academy lesson completion
  if (typeof window.academyMarkLessonNew === 'function' && !window.__streaksAcademyWrapped) {
    window.__streaksAcademyWrapped = true;
    var _origAcademy = window.academyMarkLessonNew;
    window.academyMarkLessonNew = function (courseId, lessonId) {
      var store = (typeof D !== 'undefined' && D.faithAcademyProgress && D.faithAcademyProgress.lessons) || {};
      var alreadyDone = !!store[lessonId];
      _origAcademy.apply(this, arguments);
      if (!alreadyDone) recordStudyComplete();
    };
  }
}

// ── INIT (called from finishInit in init.js) ─────────────────

async function initStreaks() {
  if (_streakInited) return;
  _streakInited = true;
  if (typeof _supaUser === 'undefined' || !_supaUser) return;

  await _streaksLoad();
  _installStreakHooks();
  syncStreakNow();
}
