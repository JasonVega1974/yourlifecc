/* =============================================================
   activity-log.js — Family Activity Feed (FAF) Inc 1
   ─────────────────────────────────────────────────────────────
   Unified, append-only event stream powering the Parent Hub
   "Today on YourLife" home strip (FAF Inc 4) and the full
   Activity tab feed (FAF Inc 3). ONE writer (logFamilyActivity);
   the legacy two-arg logActivity(type, detail) is preserved as
   a back-compat shim so the 63 existing call sites across
   faith.js / parent.js / habits.js / misc.js / skills.js keep
   working untouched until they migrate in Inc 2.

   Storage: D.activityLog[] in the cloud-synced profiles.data
   JSONB blob. NO separate Supabase table — multi-profile is a
   single Supabase account with many profileIds, so the existing
   blob already syncs cross-device. Capped 500 entries / 90 days
   by _pruneActivityLog() on every write.

   New shape:
     { id, ts (ms), date ('YYYY-MM-DD'), profileId,
       domain, event, title, meta? }

   Legacy shape (still in storage for existing users):
     { type, detail, time (ISO), ts (ms) }

   Renderers (parent.js audit, future home strip + feed) read
   entries through activityDomain/activityEvent/activityTitle/
   activityTs/activityDate so the storage migration is invisible
   — no on-load rewrite of old entries needed.

   Load order (app/index.html): after sync.js, before auth.js —
   it needs D from data.js + save() from sync.js, nothing else.
============================================================= */

(function(){
  'use strict';

  // 500 entries OR 90 days — whichever is tighter
  const MAX_ENTRIES = 500;
  const MAX_AGE_MS  = 90 * 24 * 60 * 60 * 1000;

  // Legacy `type` → new (domain, event). Anything unknown falls
  // through to ('misc', type) so no event is dropped on the floor.
  // Mirrors the call-site inventory from the FAF plan (faith=40,
  // parent=12, email=6, skills=2, misc=2, habits=1).
  const LEGACY_TYPE_MAP = {
    scripture: ['faith',  'scripture_read'],
    habit:     ['habit',  'checked'],
    deduction: ['parent', 'deduction'],
    faith:     ['faith',  'action'],
    study:     ['faith',  'study'],
    bible:     ['faith',  'bible_read'],
    character: ['skill',  'character_lesson'],
    helpful:   ['chore',  'helpful_deed'],
    contest:   ['parent', 'contest'],
    quiz:      ['skill',  'quiz'],
    challenge: ['chore',  'challenge'],
    growth:    ['health', 'growth_logged'],
    lesson:    ['skill',  'lesson_opened'],
    growingup: ['skill',  'growing_up']
  };

  function _genId(){
    try {
      if (typeof crypto !== 'undefined' && crypto && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
    } catch(e){}
    return 'a_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  // Local-date bucket (YYYY-MM-DD) — used for "today" filters.
  // toISOString() would shift the day in non-UTC zones, so we
  // build the string from local Y/M/D directly.
  function _localDate(ts){
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  // _activeProfileId is defined in parent.js (loaded later). Read
  // at call-time, so this resolves correctly even though this
  // module loads before parent.js.
  function _activeProfile(){
    try {
      if (typeof _activeProfileId !== 'undefined' && _activeProfileId) {
        return String(_activeProfileId);
      }
    } catch(e){}
    return null;
  }

  // Drop entries older than 90d, then cap to 500 most-recent.
  // Defensive on both new (ts) and legacy (time) shapes.
  function _pruneActivityLog(arr){
    if (!Array.isArray(arr)) return [];
    const now = Date.now();
    const fresh = arr.filter(function(e){
      if (!e || typeof e !== 'object') return false;
      let t = (typeof e.ts === 'number' && e.ts > 0) ? e.ts : 0;
      if (!t && e.time) { const p = Date.parse(e.time); if (!isNaN(p)) t = p; }
      if (!t) return false;
      return (now - t) <= MAX_AGE_MS;
    });
    if (fresh.length > MAX_ENTRIES) {
      return fresh.slice(fresh.length - MAX_ENTRIES);
    }
    return fresh;
  }

  // Dedupe against the last 5 entries — defends against double-tap
  // and against the same logActivity() firing twice inside a single
  // user action (e.g. an XP grant that also triggers a badge check).
  function _isDuplicate(arr, candidate){
    if (!Array.isArray(arr) || !arr.length) return false;
    const start = Math.max(0, arr.length - 5);
    for (let i = start; i < arr.length; i++) {
      const e = arr[i];
      if (!e) continue;
      const m = e.type && LEGACY_TYPE_MAP[e.type];
      const eDomain = e.domain || (m ? m[0] : (e.type || 'misc'));
      const eEvent  = e.event  || (m ? m[1] : '');
      const eTitle  = e.title  || e.detail || '';
      const eProf   = (e.profileId == null) ? null : String(e.profileId);
      if (eDomain === candidate.domain
          && eEvent  === candidate.event
          && eTitle  === candidate.title
          && eProf   === candidate.profileId) {
        return true;
      }
    }
    return false;
  }

  // ── Primary writer ───────────────────────────────────────────
  // Every Inc 2 module call site will land here. Returns the
  // pushed entry (or null if deduped) so callers can chain a
  // meta update or log a dev hint without re-walking the array.
  function logFamilyActivity(domain, event, title, meta){
    try {
      if (typeof D === 'undefined' || !D) return null;
      if (!Array.isArray(D.activityLog)) D.activityLog = [];

      const ts = Date.now();
      const entry = {
        id:        _genId(),
        ts:        ts,
        date:      _localDate(ts),
        profileId: _activeProfile(),
        domain:    String(domain || 'misc'),
        event:     String(event  || 'action'),
        title:     String(title  || '')
      };
      if (meta != null) entry.meta = meta;

      if (_isDuplicate(D.activityLog, entry)) return null;

      D.activityLog.push(entry);
      D.activityLog = _pruneActivityLog(D.activityLog);

      if (typeof save === 'function') save();
      return entry;
    } catch(e) {
      try { console.warn('[activity-log] write failed:', e && e.message); } catch(_){}
      return null;
    }
  }

  // ── Back-compat shim ─────────────────────────────────────────
  // The legacy two-arg form (type, detail) used by 63 existing
  // call sites maps onto the new shape via LEGACY_TYPE_MAP. We do
  // NOT mutate the existing callers in Inc 1 — they migrate one
  // module at a time in Inc 2. Unknown types fall through to
  // domain='misc' so nothing is silently dropped.
  function logActivity(type, detail){
    const m = LEGACY_TYPE_MAP[type];
    const domain = m ? m[0] : 'misc';
    const event  = m ? m[1] : String(type || 'action');
    return logFamilyActivity(domain, event, detail || '');
  }

  // ── Dual-shape accessors ─────────────────────────────────────
  // Renderers read entries through these so a mix of new-shape
  // and legacy-shape entries in D.activityLog renders uniformly.
  function activityDomain(e){
    if (!e) return 'misc';
    if (e.domain) return e.domain;
    const m = e.type && LEGACY_TYPE_MAP[e.type];
    return m ? m[0] : (e.type || 'misc');
  }
  function activityEvent(e){
    if (!e) return '';
    if (e.event) return e.event;
    const m = e.type && LEGACY_TYPE_MAP[e.type];
    return m ? m[1] : '';
  }
  function activityTitle(e){
    if (!e) return '';
    return e.title || e.detail || '';
  }
  function activityTs(e){
    if (!e) return 0;
    if (typeof e.ts === 'number' && e.ts > 0) return e.ts;
    if (e.time) { const t = Date.parse(e.time); return isNaN(t) ? 0 : t; }
    return 0;
  }
  function activityDate(e){
    if (!e) return '';
    if (e.date) return e.date;
    const t = activityTs(e);
    return t ? _localDate(t) : '';
  }

  // ── Public ───────────────────────────────────────────────────
  window.logFamilyActivity = logFamilyActivity;
  window.logActivity       = logActivity;          // back-compat
  window._pruneActivityLog = _pruneActivityLog;    // for future loadData hook
  window.activityDomain    = activityDomain;
  window.activityEvent     = activityEvent;
  window.activityTitle     = activityTitle;
  window.activityTs        = activityTs;
  window.activityDate      = activityDate;
})();
