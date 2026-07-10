/* =============================================================
   family-feed.js — Family Activity Feed (FAF) Inc 3
   ─────────────────────────────────────────────────────────────
   Single render kernel for the Parent Hub Activity tab feed
   (#familyActivityFeed in #ph-activity) and the Inc 4 home strip
   (#fafHomeStrip in #ph-home).

   Reads D.activityLog (populated by activity-log.js + the Inc 2
   wirings across chores/finance/health/goals/skills/parent/faith),
   filters by profile + domain + date bucket, groups by local
   date, and renders into the requested container.

   API:
     renderFamilyActivityFeed({
       profileId        — string|'all'    (default: pill state)
       domain           — string|'all'    (default: pill state)
       dateBucket       — 'today'|null    (default: null)
       limit            — int             (default: 50 / pill state)
       hideParentDomain — bool            (default: false; true on kid-side surfaces)
       layout           — 'feed'|'strip'  (default: 'feed')
       containerId      — string          (default: 'familyActivityFeed')
     })

   Pill state lives in this module so re-renders persist user
   selections across phRoute() trips back to the activity tab.
   Inc 4 strip calls pass explicit filters and ignore pill state.

   Load order: BEFORE parent.js (so the two legacy wrappers
   renderParentActivityAudit / renderParentActivityFeed can
   delegate to renderFamilyActivityFeed without typeof checks).
   _profiles + _activeProfileId are read lazily at call time, so
   it's fine that they're defined later in parent.js.
============================================================= */

(function(){
  'use strict';

  // ── Per-domain visual tokens ─────────────────────────────────
  // Icon + accent triple (color / soft / border) per domain.
  // Colors borrowed from the existing Parent Hub palette so the
  // feed reads as "part of" the surrounding card system, not a
  // stylistic island.
  const DOMAIN_META = {
    chore:   { icon:'✅', label:'Chores',  color:'#22c55e', soft:'rgba(34,197,94,.12)',  bd:'rgba(34,197,94,.28)' },
    money:   { icon:'💰', label:'Money',   color:'#10b981', soft:'rgba(16,185,129,.12)', bd:'rgba(16,185,129,.28)' },
    health:  { icon:'💪', label:'Health',  color:'#22d3ee', soft:'rgba(34,211,238,.12)', bd:'rgba(34,211,238,.28)' },
    goal:    { icon:'🎯', label:'Goals',   color:'#22d3ee', soft:'rgba(34,211,238,.12)',bd:'rgba(34,211,238,.28)' },
    skill:   { icon:'🧠', label:'Skills',  color:'#60a5fa', soft:'rgba(96,165,250,.12)', bd:'rgba(96,165,250,.28)' },
    habit:   { icon:'⚡', label:'Habits',  color:'#fbbf24', soft:'rgba(251,191,36,.12)', bd:'rgba(251,191,36,.28)' },
    mood:    { icon:'😊', label:'Mood',    color:'#f472b6', soft:'rgba(244,114,182,.12)',bd:'rgba(244,114,182,.28)' },
    journal: { icon:'✍️', label:'Journal', color:'#f472b6', soft:'rgba(244,114,182,.12)',bd:'rgba(244,114,182,.28)' },
    book:    { icon:'📖', label:'Books',   color:'#fb923c', soft:'rgba(251,146,60,.12)', bd:'rgba(251,146,60,.28)' },
    faith:   { icon:'✝️', label:'Faith',   color:'#fcd34d', soft:'rgba(252,211,77,.12)', bd:'rgba(252,211,77,.28)' },
    parent:  { icon:'👤', label:'Parent',  color:'#fb7185', soft:'rgba(251,113,133,.12)',bd:'rgba(251,113,133,.28)' },
    auth:    { icon:'🔐', label:'Auth',    color:'#94a3b8', soft:'rgba(148,163,184,.12)',bd:'rgba(148,163,184,.28)' },
    misc:    { icon:'📌', label:'Misc',    color:'#94a3b8', soft:'rgba(148,163,184,.12)',bd:'rgba(148,163,184,.28)' }
  };

  // Pill order matches the user spec — Chores · Money · Health ·
  // Goals · Skills · Habits · Mood · Faith · Parent.
  const DOMAIN_PILL_ORDER = ['chore','money','health','goal','skill','habit','mood','faith','parent'];

  // ── Pill state (module-scoped) ───────────────────────────────
  let _fafProfileFilter = 'all';
  let _fafDomainFilter  = 'all';
  let _fafLimit         = 50;

  // ── Tiny utilities ───────────────────────────────────────────
  function _esc(s){
    if(s == null) return '';
    s = String(s);
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function _localDate(d){
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function _todayISO(){ return _localDate(new Date()); }
  function _yesterdayISO(){
    const d = new Date(); d.setDate(d.getDate() - 1);
    return _localDate(d);
  }
  function _dayLabel(iso){
    if(!iso) return 'Earlier';
    const today = _todayISO();
    const yest  = _yesterdayISO();
    if(iso === today) return 'Today';
    if(iso === yest)  return 'Yesterday';
    try {
      const d = new Date(iso + 'T12:00:00');
      const diff = Math.round((Date.now() - d.getTime()) / 86400000);
      if(diff <= 6) return d.toLocaleDateString('en', { weekday:'long' });
      return d.toLocaleDateString('en', { month:'short', day:'numeric' });
    } catch(e){
      return iso;
    }
  }
  function _relTime(ts){
    if(!ts) return '';
    const diff = Math.max(0, Date.now() - ts);
    const min = Math.round(diff / 60000);
    if(min < 1) return 'just now';
    if(min < 60) return min + 'm ago';
    const hr = Math.round(min / 60);
    if(hr < 24) return hr + 'h ago';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour:'numeric', minute:'2-digit' });
    } catch(e){
      return '';
    }
  }

  // _profiles + _activeProfileId live in parent.js (loaded after
  // this file). Always read defensively at call time.
  function _profile(profileId){
    try {
      if(profileId == null) return null;
      if(typeof _profiles !== 'undefined' && Array.isArray(_profiles)){
        return _profiles.find(function(x){ return x && String(x.id) === String(profileId); }) || null;
      }
    } catch(e){}
    return null;
  }
  function _profileName(profileId){
    const p = _profile(profileId);
    return (p && p.name) ? p.name : null;
  }
  function _kidProfiles(){
    try {
      if(typeof _profiles !== 'undefined' && Array.isArray(_profiles)){
        return _profiles.filter(function(p){ return p && !p.isParent; });
      }
    } catch(e){}
    return [];
  }

  // Stable per-kid color (Inc 4 strip dot). Reads p.color when the
  // profile carries one; otherwise hashes the profile id into the
  // KID_COLORS palette so the same kid gets the same dot every
  // render without needing to backfill profile data.
  const KID_COLORS = [
    '#38bdf8', '#f472b6', '#fbbf24', '#22d3ee',
    '#22c55e', '#fb7185', '#fb923c', '#22d3ee'
  ];
  function _kidColor(profileId){
    const p = _profile(profileId);
    if(p && p.color) return p.color;
    if(profileId == null) return '#94a3b8'; // parent-action / unknown
    let h = 0;
    const s = String(profileId);
    for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return KID_COLORS[h % KID_COLORS.length];
  }

  // Dual-shape accessors live in activity-log.js (loaded earlier in
  // the boot order). Wrap defensively for the same reason as the
  // _profiles read above — never assume.
  function _accessors(){
    return {
      domain: (typeof activityDomain === 'function') ? activityDomain : function(e){ return (e && (e.domain || e.type)) || 'misc'; },
      title:  (typeof activityTitle  === 'function') ? activityTitle  : function(e){ return (e && (e.title  || e.detail)) || ''; },
      ts:     (typeof activityTs     === 'function') ? activityTs     : function(e){ return (e && (e.ts || (e.time && Date.parse(e.time)))) || 0; },
      date:   (typeof activityDate   === 'function') ? activityDate   : function(e){ return (e && e.date) || ''; }
    };
  }

  // ── Pill click handlers (exported) ───────────────────────────
  function fafSetProfile(profileId){
    _fafProfileFilter = (profileId == null) ? 'all' : String(profileId);
    _fafLimit = 50;
    renderFamilyActivityFeed();
  }
  function fafSetDomain(domain){
    _fafDomainFilter = domain || 'all';
    _fafLimit = 50;
    renderFamilyActivityFeed();
  }
  function fafLoadOlder(){
    _fafLimit += 50;
    renderFamilyActivityFeed();
  }

  // FAF Inc 4 — strip-card tap handler. Opens the Parent Hub
  // Activity tab and pre-filters by the tapped domain so the parent
  // lands in the full feed with the right events isolated. Home
  // strip stays a quick glance; Activity tab stays the deep dive.
  // domain='misc' (and falsy) clears the filter — generic "show me
  // the full feed" behavior.
  function fafNavigateTo(domain){
    if(typeof phNav === 'function') phNav('activity');
    if(domain && domain !== 'misc' && typeof fafSetDomain === 'function'){
      fafSetDomain(domain);
    }
  }

  // ── Pill row renderers ───────────────────────────────────────
  function _renderProfilePills(){
    const el = document.getElementById('fafProfilePills');
    if(!el) return;
    const kids = _kidProfiles();
    const pills = [
      '<button type="button" class="faf-pill' + (_fafProfileFilter === 'all' ? ' is-active' : '') + '" onclick="fafSetProfile(\'all\')">All kids</button>'
    ];
    kids.forEach(function(p){
      const active = (String(p.id) === _fafProfileFilter) ? ' is-active' : '';
      pills.push('<button type="button" class="faf-pill' + active + '" onclick="fafSetProfile(\'' + _esc(String(p.id)) + '\')">' + _esc(p.name || 'kid') + '</button>');
    });
    el.innerHTML = pills.join('');
  }
  function _renderDomainPills(){
    const el = document.getElementById('fafDomainPills');
    if(!el) return;
    const pills = [
      '<button type="button" class="faf-pill faf-pill-domain' + (_fafDomainFilter === 'all' ? ' is-active' : '') + '" onclick="fafSetDomain(\'all\')">All</button>'
    ];
    DOMAIN_PILL_ORDER.forEach(function(dom){
      const meta = DOMAIN_META[dom] || DOMAIN_META.misc;
      const active = (_fafDomainFilter === dom) ? ' is-active' : '';
      pills.push('<button type="button" class="faf-pill faf-pill-domain' + active + '" style="--faf-accent:' + meta.color + ';" onclick="fafSetDomain(\'' + dom + '\')">' + meta.icon + ' ' + _esc(meta.label) + '</button>');
    });
    el.innerHTML = pills.join('');
  }

  function _updateLoadOlderButton(visible){
    const btn = document.getElementById('fafLoadOlder');
    if(!btn) return;
    btn.style.display = visible ? '' : 'none';
  }

  // ── Main kernel ──────────────────────────────────────────────
  function renderFamilyActivityFeed(filters){
    filters = filters || {};
    // Explicit filter args override module-scoped pill state. The
    // Inc 4 home strip passes explicit filters so the pills on the
    // Activity tab don't leak into the home view.
    const profileId        = (filters.profileId        !== undefined) ? filters.profileId        : _fafProfileFilter;
    const domain           = (filters.domain           !== undefined) ? filters.domain           : _fafDomainFilter;
    const dateBucket       = (filters.dateBucket       !== undefined) ? filters.dateBucket       : null;
    const limit            = (filters.limit            !== undefined) ? filters.limit            : _fafLimit;
    const hideParentDomain = !!filters.hideParentDomain;
    const layout           = filters.layout      || 'feed';
    const containerId      = filters.containerId || 'familyActivityFeed';

    // Pills only relevant on the feed surface; the strip skips them.
    if(layout === 'feed'){
      _renderProfilePills();
      _renderDomainPills();
    }

    const el = document.getElementById(containerId);
    if(!el) return;

    const acc = _accessors();
    const log = (typeof D !== 'undefined' && Array.isArray(D.activityLog)) ? D.activityLog : [];

    // Filter pipeline
    let entries = log.filter(function(e){ return e && typeof e === 'object'; });
    if(hideParentDomain) entries = entries.filter(function(e){ return acc.domain(e) !== 'parent'; });
    if(domain && domain !== 'all') entries = entries.filter(function(e){ return acc.domain(e) === domain; });
    if(profileId && profileId !== 'all'){
      entries = entries.filter(function(e){
        const p = (e && e.profileId != null) ? String(e.profileId) : null;
        return p === String(profileId);
      });
    }
    if(dateBucket === 'today'){
      const today = _todayISO();
      entries = entries.filter(function(e){ return acc.date(e) === today; });
    }

    // Newest first
    entries.sort(function(a,b){ return acc.ts(b) - acc.ts(a); });

    const total = entries.length;
    const shown = entries.slice(0, limit);

    if(!shown.length){
      const emptyCopy = (layout === 'strip')
        ? 'Quiet day so far — no activity yet.'
        : 'No activity yet — actions across all tabs will appear here.';
      el.innerHTML = '<div class="faf-empty">' + emptyCopy + '</div>';
      if(layout === 'feed') _updateLoadOlderButton(false);
      return;
    }

    if(layout === 'strip'){
      el.innerHTML = _renderStrip(shown, acc);
      return;
    }

    // Group by date label
    const groups = [];
    let currentDate = null;
    let currentGroup = null;
    shown.forEach(function(e){
      const date = acc.date(e);
      if(date !== currentDate){
        currentDate = date;
        currentGroup = { label:_dayLabel(date), date:date, entries:[] };
        groups.push(currentGroup);
      }
      currentGroup.entries.push(e);
    });

    el.innerHTML = groups.map(function(g){
      return ''
        + '<div class="faf-day-group">'
        +   '<div class="faf-day-label">' + _esc(g.label) + '</div>'
        +   g.entries.map(function(e){ return _renderEntry(e, acc); }).join('')
        + '</div>';
    }).join('');

    _updateLoadOlderButton(total > shown.length);
  }

  function _renderEntry(e, acc){
    const dom = acc.domain(e);
    const meta = DOMAIN_META[dom] || DOMAIN_META.misc;
    const title = acc.title(e);
    const ts = acc.ts(e);
    const kidName = _profileName(e.profileId);
    const kidLabel = kidName
      ? '<span class="faf-entry-kid">' + _esc(kidName) + '</span>'
      : '';
    return ''
      + '<div class="faf-entry faf-domain-' + _esc(dom) + '"'
      +    ' style="--faf-accent:' + meta.color + ';--faf-accent-soft:' + meta.soft + ';--faf-accent-bd:' + meta.bd + ';">'
      +   '<div class="faf-entry-icon">' + meta.icon + '</div>'
      +   '<div class="faf-entry-body">'
      +     '<div class="faf-entry-title">' + _esc(title) + '</div>'
      +     '<div class="faf-entry-meta">'
      +       '<span class="faf-entry-domain">' + _esc(meta.label) + '</span>'
      +       kidLabel
      +     '</div>'
      +   '</div>'
      +   '<span class="faf-entry-time">' + _esc(_relTime(ts)) + '</span>'
      + '</div>';
  }

  // Inc 4 layout — compact horizontal tap-target. Adds:
  //   • profile-color dot (stable per-kid color, parent-action gets
  //     a neutral slate dot)
  //   • role=button + tabindex=0 + onclick + onkeydown so the card
  //     is reachable by keyboard and screen readers, not just touch
  //   • aria-label combining domain + kid + title
  function _renderStrip(entries, acc){
    return entries.map(function(e){
      const dom = acc.domain(e);
      const meta = DOMAIN_META[dom] || DOMAIN_META.misc;
      const title = acc.title(e);
      const ts = acc.ts(e);
      const kidName = _profileName(e.profileId);
      const kidColor = _kidColor(e.profileId);
      const aria = (kidName ? kidName + ' · ' : '') + meta.label + ' · ' + title;
      const domAttr = _esc(dom);
      return ''
        + '<div class="faf-strip-card faf-domain-' + domAttr + '"'
        +    ' role="button" tabindex="0"'
        +    ' aria-label="' + _esc(aria) + '"'
        +    ' onclick="fafNavigateTo(\'' + domAttr + '\')"'
        +    ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();fafNavigateTo(\'' + domAttr + '\');}"'
        +    ' style="--faf-accent:' + meta.color + ';--faf-accent-soft:' + meta.soft + ';--faf-accent-bd:' + meta.bd + ';--faf-kid:' + kidColor + ';">'
        +   '<span class="faf-strip-dot" aria-hidden="true"></span>'
        +   '<div class="faf-strip-icon" aria-hidden="true">' + meta.icon + '</div>'
        +   '<div class="faf-strip-body">'
        +     (kidName ? '<div class="faf-strip-kid">' + _esc(kidName) + '</div>' : '')
        +     '<div class="faf-strip-title">' + _esc(title) + '</div>'
        +     '<div class="faf-strip-time">' + _esc(_relTime(ts)) + '</div>'
        +   '</div>'
        + '</div>';
    }).join('');
  }

  // ── Public ───────────────────────────────────────────────────
  window.renderFamilyActivityFeed = renderFamilyActivityFeed;
  window.fafSetProfile             = fafSetProfile;
  window.fafSetDomain              = fafSetDomain;
  window.fafLoadOlder              = fafLoadOlder;
  window.fafNavigateTo             = fafNavigateTo;
  // Exposed for Inc 4 strip and any future surface that wants the
  // canonical icon/color for a domain without re-deriving.
  window.fafDomainMeta             = DOMAIN_META;
})();
