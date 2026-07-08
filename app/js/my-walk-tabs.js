/* =============================================================
   my-walk-tabs.js — "My Walk" two-tab surface (2026-07-07)

   Consolidates the old "Faith Journey" 5-card hub (#bf-journey) and
   Growth Profile (formerly its own #fzDest destination) into a
   "✨ My Faith Life" companion tab alongside the existing 14-station
   Pathway. walk-path.js is NEVER modified — Tab 1 renders through its
   existing, unchanged renderWalkPath()/renderWalkStory()/etc API, into
   a host that MUST keep the literal id "walkPathWrap" (walkMarkStep()
   in walk-path.js hard-codes that id on its own re-render).

   Two independent callers build a host and hand it to
   renderMyWalkTabs(hostId, opts):
     - faith-zones.js  fzOpenDest('walk'|'walkfaith'|'growth'|'sermon')
                        -> a fresh <div id="mwHost"> inside #fzDestBody
                           (page scroll)
     - command-center.js ccOpenWalk()
                        -> a fresh <div id="mwHost"> inside the fixed,
                           self-scrolling #ccWalkOverlay
   Both entry points get an identical shell/behavior. The walkPathWrap
   "only one at a time" exclusivity dance (previously duplicated in
   command-center.js) now lives HERE, in one place.

   Public API (window):
     renderMyWalkTabs(hostId, opts)  — opts: {startTab, startSpoke}
                                        startTab: 'pathway' (default) | 'faith'
                                        startSpoke: 'profile'|'giving'|'verses'
                                          |'sermon'|'disciplines'|'growth'
     mwSwitchTab(tab)                — 'pathway' | 'faith'
     mwOpenSpoke(name)
     mwBackToHub()
============================================================= */
(function(){
  'use strict';

  var _scrollMem = { pathway: 0, faith: 0 };
  var _activeHostId = null;

  function _esc(s){
    if(s==null) return '';
    if(typeof window.escapeHtml==='function') return window.escapeHtml(String(s));
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // Nearest scrollable ancestor of the host (host itself included) — covers
  // both hosts: #ccWalkOverlay is its own fixed, self-scrolling container;
  // #fzDestBody scrolls with the page. Falls back to the page scroller.
  function _scrollEl(host){
    var n = host;
    while(n && n !== document.body && n !== document.documentElement){
      if(n.scrollHeight > n.clientHeight + 4){
        var cs = window.getComputedStyle(n);
        if(cs.overflowY === 'auto' || cs.overflowY === 'scroll') return n;
      }
      n = n.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function _host(){ return _activeHostId ? document.getElementById(_activeHostId) : null; }

  // The outer "go back" control for whichever shell My Walk is hosted in
  // right now — #fzDest's ".fz-back-btn" (fzOpenDest path) or
  // #ccWalkOverlay's "#ccWalkHomeBtn" (ccOpenWalk path). Scoped by walking
  // up from the live host each call — no persistent flag to leak if the
  // surface closes mid-spoke, unlike a body-level class would.
  function _outerBackBtn(host){
    if(!host || !host.closest) return null;
    var fzDest = host.closest('#fzDest');
    if(fzDest){ var b = fzDest.querySelector('.fz-back-btn'); if(b) return b; }
    var ccOv = host.closest('#ccWalkOverlay');
    if(ccOv){ var b2 = ccOv.querySelector('#ccWalkHomeBtn'); if(b2) return b2; }
    return null;
  }

  // Hide the outer back control ONLY while Tab 2 is active AND a spoke is
  // open — that's the one state with a real double-back-affordance (outer
  // "Home" pill + the spoke's own "← My Faith Life" pill). Recomputed from
  // live DOM state (not a transition flag) so it's correct no matter how
  // the user got here — tapped the spoke's own back pill, or switched tabs
  // directly while a spoke was open.
  function _syncOuterBack(host){
    var ob = _outerBackBtn(host);
    if(!ob) return;
    var pane = host.querySelector('.mw-pane[data-mw-pane="faith"]');
    var spokeOpen = false;
    if(pane && pane.style.display !== 'none'){
      var spokes = pane.querySelectorAll('.mw-spoke');
      for(var i=0;i<spokes.length;i++){
        if(spokes[i].style.display !== 'none'){ spokeOpen = true; break; }
      }
    }
    ob.style.display = spokeOpen ? 'none' : '';
  }

  // ── entry ────────────────────────────────────────────────
  function renderMyWalkTabs(hostId, opts){
    opts = opts || {};
    var host = document.getElementById(hostId);
    if(!host) return;
    _activeHostId = hostId;
    _injectCss();

    host.innerHTML =
      '<div class="mw-tabs" role="tablist" aria-label="My Walk">'+
        '<button type="button" class="mw-tab" data-mw-tab="pathway" role="tab" onclick="mwSwitchTab(\'pathway\')">⛰️ Pathway</button>'+
        '<button type="button" class="mw-tab" data-mw-tab="faith" role="tab" onclick="mwSwitchTab(\'faith\')">✨ My Faith Life</button>'+
      '</div>'+
      '<div class="mw-pane" data-mw-pane="pathway">'+
        '<div id="walkPathWrap"></div><div id="walkDailyStrip"></div><div id="walkStoryWrap"></div><div id="walkJournalWrap"></div>'+
      '</div>'+
      '<div class="mw-pane" data-mw-pane="faith" style="display:none;">'+
        _faithHubHtml()+
      '</div>';

    // Exclusive id claim — walk-path.js's walkMarkStep() hard-codes the
    // literal id "walkPathWrap" on its own re-render, so only one such
    // element may exist at a time. Strip it from any stale host (the other
    // entry point's disposable node from a prior visit) before rendering.
    try{
      document.querySelectorAll('[id="walkPathWrap"]').forEach(function(n){
        if(!host.contains(n)) n.removeAttribute('id');
      });
    }catch(_e){}

    try{
      if(typeof window.renderWalkPath === 'function') window.renderWalkPath('walkPathWrap');
    }catch(e){
      try{ console.error('[renderMyWalkTabs]', e); }catch(_e){}
    }
    if(typeof window.renderWalkStory === 'function'){
      window.renderWalkStory('walkStoryWrap');
      if(typeof window.renderWalkDailyStrip === 'function') window.renderWalkDailyStrip('walkDailyStrip');
    } else if(typeof window.renderWalkJournal === 'function'){
      window.renderWalkJournal('walkJournalWrap');
    }
    if(typeof window._fjInstallWalkJournalHooks === 'function') window._fjInstallWalkJournalHooks();

    var startTab = opts.startTab === 'faith' ? 'faith' : 'pathway';
    mwSwitchTab(startTab, { skipScrollSave:true });
    if(startTab === 'faith' && opts.startSpoke){
      mwOpenSpoke(opts.startSpoke);
    } else if(startTab === 'pathway'){
      // Land on the "YOU ARE HERE" beacon if present (mirrors the prior
      // ccOpenWalk behavior).
      try{
        var cur = host.querySelector('.wk-current');
        if(cur && cur.scrollIntoView) cur.scrollIntoView({ block:'center' });
      }catch(_e){}
    }
  }

  // ── tab switch (instant, remembers scroll per tab) ────────
  function mwSwitchTab(tab, opts){
    opts = opts || {};
    var host = _host();
    if(!host) return;
    if(!opts.skipScrollSave){
      var activeBtn = host.querySelector('.mw-tab.active');
      var fromTab = activeBtn ? activeBtn.getAttribute('data-mw-tab') : null;
      if(fromTab) _scrollMem[fromTab] = _scrollEl(host).scrollTop;
    }
    var panes = host.querySelectorAll('.mw-pane');
    for(var i=0;i<panes.length;i++){
      panes[i].style.display = (panes[i].getAttribute('data-mw-pane') === tab) ? '' : 'none';
    }
    var tabs = host.querySelectorAll('.mw-tab');
    for(var j=0;j<tabs.length;j++){
      var on = tabs[j].getAttribute('data-mw-tab') === tab;
      tabs[j].classList.toggle('active', on);
      tabs[j].setAttribute('aria-selected', on ? 'true' : 'false');
    }
    var se = _scrollEl(host);
    if(se) se.scrollTop = _scrollMem[tab] || 0;
    _syncOuterBack(host);
  }

  // ── Tab 2: My Faith Life hub-and-spoke ─────────────────────
  // Ported from the retired #bf-journey hub (same .fjh-* visual recipe,
  // renamed to .mw-* since this is now JS-built, not static markup) with
  // one new card: Growth Profile (renderGrowthFull, formerly its own
  // #fzDest destination). Inner container ids are UNCHANGED from the old
  // hub — faith.js's renderFJProfile/renderFJDonations/etc. and
  // faith-zones.js's renderGrowthFull hard-code these ids via
  // getElementById, so they must match exactly:
  //   fjProfileContainer, fjMilestonesContainer, faithMilestones,
  //   favVerseInput, favVersesList, sermonNotesList,
  //   fjDonationsContainer, fjDisciplinesContainer, fzGrowthFull
  function _faithHubHtml(){
    // Admin photo override — read window.CARD_PHOTO_OVERRIDES at render
    // time and bake the src into the initial markup, matching the
    // established pattern for other dynamically-rendered hubs (Parent
    // Hub's .phc-card, app/js/parent.js:3249-3257). This hub is built
    // fresh via innerHTML every time My Walk opens, well after app boot —
    // loadCardPhotoOverrides() (ui.js) has exactly one call site
    // (init.js:744, boot-time only) and its DOM-patch step
    // (querySelectorAll('img[data-card-id=...]')) only touches elements
    // that already exist in the DOM at that moment. These cards don't
    // exist yet at boot, so that patch never reaches them — the fix is
    // for THIS render to read the (already-fetched, cached-on-window)
    // override map itself, not to wait for or re-trigger the fetch.
    const photoMap = (typeof window !== 'undefined' && window.CARD_PHOTO_OVERRIDES) || {};
    const mflSrc = function(id){ var u = photoMap[id]; return u ? ' src="'+u+'"' : ''; };
    return ''+
      '<div id="mwHub">'+
        '<div class="bf-section-hdr">'+
          '<div class="bf-eyebrow">YOUR WALK WITH GOD</div>'+
          '<div class="bf-title">My Faith Life</div>'+
          '<div class="bf-sub">Pick a space to open it — your profile, giving, verses, sermon notes, disciplines, and growth. Each opens on its own.</div>'+
        '</div>'+
        '<div class="mw-grid">'+
          '<button type="button" class="mw-card" onclick="mwOpenSpoke(\'profile\')">'+
            '<div class="mw-hero"><div class="mw-ph" aria-hidden="true">👤</div><img class="mw-img" data-card-id="mfl-profile"'+mflSrc('mfl-profile')+' loading="lazy" alt="" onerror="this.style.display=\'none\'"><div class="mw-shade" aria-hidden="true"></div></div>'+
            '<div class="mw-title">MY FAITH PROFILE</div>'+
            '<div class="mw-sub">Your identity, spiritual milestones, and the moments that mattered.</div>'+
          '</button>'+
          '<button type="button" class="mw-card" onclick="mwOpenSpoke(\'giving\')">'+
            '<div class="mw-hero"><div class="mw-ph" aria-hidden="true">💝</div><img class="mw-img" data-card-id="mfl-giving"'+mflSrc('mfl-giving')+' loading="lazy" alt="" onerror="this.style.display=\'none\'"><div class="mw-shade" aria-hidden="true"></div></div>'+
            '<div class="mw-title">GIVING</div>'+
            '<div class="mw-sub">Track your generosity over time.</div>'+
          '</button>'+
          '<button type="button" class="mw-card" onclick="mwOpenSpoke(\'verses\')">'+
            '<div class="mw-hero"><div class="mw-ph" aria-hidden="true">💎</div><img class="mw-img" data-card-id="mfl-verses"'+mflSrc('mfl-verses')+' loading="lazy" alt="" onerror="this.style.display=\'none\'"><div class="mw-shade" aria-hidden="true"></div></div>'+
            '<div class="mw-title">MY VERSES</div>'+
            '<div class="mw-sub">Verses worth keeping close.</div>'+
          '</button>'+
          '<button type="button" class="mw-card" onclick="mwOpenSpoke(\'sermon\')">'+
            '<div class="mw-hero"><div class="mw-ph" aria-hidden="true">📝</div><img class="mw-img" data-card-id="mfl-sermon"'+mflSrc('mfl-sermon')+' loading="lazy" alt="" onerror="this.style.display=\'none\'"><div class="mw-shade" aria-hidden="true"></div></div>'+
            '<div class="mw-title">SERMON NOTES</div>'+
            '<div class="mw-sub">Capture what you heard on Sunday.</div>'+
          '</button>'+
          '<button type="button" class="mw-card" onclick="mwOpenSpoke(\'disciplines\')">'+
            '<div class="mw-hero"><div class="mw-ph" aria-hidden="true">🔥</div><img class="mw-img" data-card-id="mfl-disciplines"'+mflSrc('mfl-disciplines')+' loading="lazy" alt="" onerror="this.style.display=\'none\'"><div class="mw-shade" aria-hidden="true"></div></div>'+
            '<div class="mw-title">SPIRITUAL DISCIPLINES</div>'+
            '<div class="mw-sub">Build rhythms that grow your faith.</div>'+
          '</button>'+
          '<button type="button" class="mw-card" onclick="mwOpenSpoke(\'growth\')">'+
            '<div class="mw-hero"><div class="mw-ph" aria-hidden="true">📊</div><img class="mw-img" data-card-id="mfl-growth"'+mflSrc('mfl-growth')+' loading="lazy" alt="" onerror="this.style.display=\'none\'"><div class="mw-shade" aria-hidden="true"></div></div>'+
            '<div class="mw-title">GROWTH PROFILE</div>'+
            '<div class="mw-sub">See who you\'re becoming — all 7 traits.</div>'+
          '</button>'+
        '</div>'+
      '</div>'+

      '<div class="mw-spoke" data-mw-spoke="profile" style="display:none;">'+
        '<button type="button" class="mw-back" onclick="mwBackToHub()">← My Faith Life</button>'+
        '<div id="fjProfileContainer"></div>'+
        '<div id="fjMilestonesContainer"></div>'+
        '<div class="bf-sub-eye" style="font-family:var(--fm);font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:#fbbf24;opacity:.85;font-weight:700;margin:1rem 0 .55rem;">✨ Faith Milestones</div>'+
        '<div id="faithMilestones" style="margin-bottom:1rem;"></div>'+
      '</div>'+

      '<div class="mw-spoke" data-mw-spoke="giving" style="display:none;">'+
        '<button type="button" class="mw-back" onclick="mwBackToHub()">← My Faith Life</button>'+
        '<div id="fjDonationsContainer"></div>'+
      '</div>'+

      '<div class="mw-spoke" data-mw-spoke="verses" style="display:none;">'+
        '<button type="button" class="mw-back" onclick="mwBackToHub()">← My Faith Life</button>'+
        '<div class="bf-sub-eye" style="font-family:var(--fm);font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:#fbbf24;opacity:.85;font-weight:700;margin:0 0 .55rem;">💎 My Favorite Verses</div>'+
        '<div style="display:grid;grid-template-columns:1fr 80px;gap:.3rem;margin-bottom:.4rem;">'+
          '<input type="text" id="favVerseInput" placeholder="Type a verse (e.g. Philippians 4:13 - I can do all things...)">'+
          '<button class="btn bp bs" onclick="saveFavVerse()">+ Save</button>'+
        '</div>'+
        '<div id="favVersesList" style="max-height:60vh;overflow-y:auto;"></div>'+
      '</div>'+

      '<div class="mw-spoke" data-mw-spoke="sermon" style="display:none;">'+
        '<button type="button" class="mw-back" onclick="mwBackToHub()">← My Faith Life</button>'+
        '<div style="display:flex;align-items:center;gap:.5rem;margin:0 0 .55rem;">'+
          '<span class="bf-sub-eye" style="font-family:var(--fm);font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:#fbbf24;opacity:.85;font-weight:700;">📝 Sermon Notes</span>'+
          '<button onclick="openSermonNote()" style="margin-left:auto;min-height:44px;display:inline-flex;align-items:center;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0a0d1a;border:none;border-radius:99px;padding:.4rem .85rem;font-size:.72rem;font-weight:900;letter-spacing:.04em;cursor:pointer;font-family:var(--fm);box-shadow:0 4px 14px rgba(251,191,36,.32);">+ New Sermon</button>'+
        '</div>'+
        '<div id="sermonNotesList" style="margin-bottom:1rem;"></div>'+
      '</div>'+

      '<div class="mw-spoke" data-mw-spoke="disciplines" style="display:none;">'+
        '<button type="button" class="mw-back" onclick="mwBackToHub()">← My Faith Life</button>'+
        '<div id="fjDisciplinesContainer"></div>'+
      '</div>'+

      '<div class="mw-spoke" data-mw-spoke="growth" style="display:none;">'+
        '<button type="button" class="mw-back" onclick="mwBackToHub()">← My Faith Life</button>'+
        '<div class="fz-growth-explainer">'+
          '<div class="fzg-explain-emoji" aria-hidden="true">✦</div>'+
          '<h3 class="fzg-explain-title">Seven traits. One you.</h3>'+
          '<p class="fzg-explain-text">Every action in the app grows the traits that match it. Pray for someone → Compassion grows. Face a hard question → Courage grows. Show up daily → Discipline grows.</p>'+
          '<p class="fzg-explain-text-sub">Tap any trait to see what builds it.</p>'+
        '</div>'+
        '<div id="fzGrowthFull"></div>'+
      '</div>';
  }

  function mwBackToHub(){
    var host = _host();
    if(!host) return;
    var pane = host.querySelector('.mw-pane[data-mw-pane="faith"]');
    if(!pane) return;
    var spokes = pane.querySelectorAll('.mw-spoke');
    for(var i=0;i<spokes.length;i++) spokes[i].style.display = 'none';
    var hub = pane.querySelector('#mwHub');
    if(hub) hub.style.display = '';
    _syncOuterBack(host);
  }

  function mwOpenSpoke(name){
    var host = _host();
    if(!host) return;
    var pane = host.querySelector('.mw-pane[data-mw-pane="faith"]');
    if(!pane) return;
    var hub = pane.querySelector('#mwHub');
    if(hub) hub.style.display = 'none';
    var spokes = pane.querySelectorAll('.mw-spoke'), opened = null;
    for(var i=0;i<spokes.length;i++){
      var on = spokes[i].getAttribute('data-mw-spoke') === name;
      spokes[i].style.display = on ? '' : 'none';
      if(on) opened = spokes[i];
    }
    try{
      if(name === 'profile'){
        if(typeof renderFJProfile === 'function')      renderFJProfile();
        if(typeof renderFJMilestones === 'function')    renderFJMilestones();
        if(typeof renderFaithMilestones === 'function') renderFaithMilestones();
      } else if(name === 'giving'){
        if(typeof renderFJDonations === 'function')    renderFJDonations();
      } else if(name === 'verses'){
        if(typeof renderFavVerses === 'function')      renderFavVerses();
      } else if(name === 'sermon'){
        if(typeof renderSermonNotes === 'function')    renderSermonNotes();
      } else if(name === 'disciplines'){
        if(typeof renderFJDisciplines === 'function')  renderFJDisciplines();
      } else if(name === 'growth'){
        if(typeof renderGrowthFull === 'function')     renderGrowthFull();
      }
    }catch(_e){}
    try{ var b = opened && opened.querySelector('.mw-back'); if(b && b.focus) b.focus({ preventScroll:true }); }catch(_e){}
    var se = _scrollEl(host);
    if(se) se.scrollTop = 0;
    _syncOuterBack(host);
  }

  // ── CSS (inject once) — same visual recipe as the retired .fjh-* cards ──
  var _cssDone = false;
  function _injectCss(){
    if(_cssDone || typeof document === 'undefined') return;
    _cssDone = true;
    var css =
    /* Filled-vs-outlined pill pair — same pattern as .pr-subtabs (Prayer
       hub) and the Bible Hub sub-tabs: active = solid gold fill + dark
       text; inactive = transparent + gold hairline border. Gold matches
       this file's OWN established accent (#f5b431 / rgba(245,180,49,…)) —
       every other gold usage in this component (.mw-card border/hero
       glow, .mw-back) already uses this exact triplet, so the tabs use
       it too rather than introduce a second, unrelated gold into the
       same component. */
    '.mw-tabs{ display:flex; gap:8px; padding:4px; margin:0 0 1rem; background:rgba(255,255,255,.04); border-radius:12px; }'+
    '.mw-tab{ flex:1; display:flex; align-items:center; justify-content:center; min-height:44px; text-align:center; background:transparent; border:1px solid rgba(245,180,49,.3); border-radius:8px; padding:.5rem; font:600 .82rem/1 Oswald,sans-serif; letter-spacing:.03em; color:rgba(240,246,255,.45); cursor:pointer; transition:background .15s ease, border-color .15s ease, color .15s ease; }'+
    '.mw-tab:hover, .mw-tab:focus-visible{ border-color:rgba(245,180,49,.6); }'+
    '.mw-tab.active{ background:#f5b431; border-color:transparent; color:#0a0a0a; font-weight:700; }'+
    '.mw-tab.active:hover{ border-color:transparent; }'+
    '.mw-tab:focus-visible{ outline:2px solid #f5b431; outline-offset:2px; }'+
    /* Component owns its own width regardless of host — #fzDest has no
       max-width of its own (unlike #ccWalkOverlay's 560px content wrap),
       so without this the same card grid reads two different ways
       depending on which entry point opened My Walk. */
    '.mw-grid{ display:grid; grid-template-columns:1fr; gap:.85rem; margin-top:.4rem; max-width:560px; margin-left:auto; margin-right:auto; }'+
    '@media(min-width:480px){ .mw-grid{ grid-template-columns:1fr 1fr; gap:1.5rem; } }'+
    '.mw-card{ display:flex; flex-direction:column; width:100%; text-align:left; font-family:inherit; padding:0; overflow:hidden; cursor:pointer; border-radius:20px; background:linear-gradient(158deg,rgba(30,39,64,.92),rgba(15,21,40,.92)); border:1px solid rgba(245,180,49,.16); box-shadow:0 8px 22px rgba(0,0,0,.35); transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease; }'+
    '.mw-card:hover{ transform:translateY(-2px); border-color:rgba(245,180,49,.4); box-shadow:0 12px 26px rgba(0,0,0,.4); }'+
    '.mw-card:focus-visible{ outline:2px solid #f5b431; outline-offset:2px; }'+
    '.mw-hero{ position:relative; width:100%; height:118px; overflow:hidden; border-bottom:1px solid rgba(245,180,49,.10); }'+
    '.mw-ph{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:40px; background:radial-gradient(ellipse at 30% 30%, rgba(245,180,49,.20), transparent 60%), radial-gradient(ellipse at 75% 75%, rgba(108,150,230,.14), transparent 60%), linear-gradient(180deg,#1c2547 0%,#0d1226 100%); }'+
    'img.mw-img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(.92) saturate(1.05); }'+
    '.mw-shade{ position:absolute; left:0; right:0; bottom:0; height:58%; background:linear-gradient(180deg,rgba(10,15,31,0),rgba(10,15,31,.82)); pointer-events:none; }'+
    '.mw-title{ font:700 14.5px/1.15 Oswald,sans-serif; letter-spacing:.03em; color:#efe7d4; padding:12px 14px 4px; }'+
    '.mw-sub{ font:italic 400 12px/1.4 Newsreader,serif; color:#9aa2ba; padding:0 14px 13px; }'+
    '.mw-back{ display:inline-flex; align-items:center; justify-content:center; min-height:44px; gap:.4rem; margin:0 0 .9rem; padding:.5rem .9rem; border:1px solid rgba(245,180,49,.4); border-radius:99px; background:rgba(245,180,49,.1); color:#f5b431; font:600 .8rem/1 Oswald,sans-serif; letter-spacing:.04em; cursor:pointer; }'+
    '.mw-back:hover{ background:rgba(245,180,49,.18); }'+
    '.mw-back:focus-visible{ outline:2px solid #f5b431; outline-offset:2px; }'+
    '@media (prefers-reduced-motion: reduce){ .mw-card{ transition:none; } .mw-card:hover{ transform:none; } }'+
    /* light mode — paper */
    ':root.light .mw-tabs{ background:rgba(0,0,0,.03); }'+
    ':root.light .mw-tab{ color:rgba(58,40,24,.5); border-color:rgba(180,83,9,.3); }'+
    ':root.light .mw-tab:hover, :root.light .mw-tab:focus-visible{ border-color:rgba(180,83,9,.6); }'+
    // Guardrail: active tab STAYS gold-filled + dark text in light mode —
    // not inverted. No override needed here; .mw-tab.active's dark-mode
    // rule already reads correctly on a light page background.
    ':root.light .mw-tab.active:hover{ border-color:transparent; }'+
    ':root.light .mw-card{ background:linear-gradient(158deg,#ffffff,#fbf7ee); border-color:rgba(146,64,14,.22); box-shadow:0 1px 3px rgba(26,18,51,.08); }'+
    ':root.light .mw-card:hover{ border-color:rgba(146,64,14,.4); box-shadow:0 4px 12px rgba(26,18,51,.1); }'+
    ':root.light .mw-ph{ background:linear-gradient(158deg,#efe8da,#e2d9c6); }'+
    ':root.light .mw-shade{ background:linear-gradient(180deg,rgba(255,255,255,0),rgba(120,90,30,.10)); }'+
    ':root.light .mw-title{ color:#1a1233; }'+
    ':root.light .mw-sub{ color:#57534e; }'+
    ':root.light .mw-back{ color:#b45309; border-color:rgba(180,83,9,.4); background:rgba(180,83,9,.08); }'+
    ':root.light .mw-back:hover{ background:rgba(180,83,9,.14); }'+
    // Re-scoped from the retired app/css/app.css:7753 rule
    // (":root.light #bf-journey .bf-sub-eye"), which lost its target when
    // this markup moved out of #bf-journey — gold #fbbf24 on paper is a
    // real contrast failure, not just a style nit.
    ':root.light .mw-spoke .bf-sub-eye{ color:#92400e; }';
    var st = document.createElement('style');
    st.id = 'mw-tabs-css';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  // ── expose ───────────────────────────────────────────────
  window.renderMyWalkTabs = renderMyWalkTabs;
  window.mwSwitchTab      = mwSwitchTab;
  window.mwOpenSpoke      = mwOpenSpoke;
  window.mwBackToHub      = mwBackToHub;
})();
