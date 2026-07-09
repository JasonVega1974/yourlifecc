/* =============================================================
   mans-questions-ui.js — "Man's Questions, God's Answers" (2026-07-08)

   A reading surface: honest questions people ask about God/faith,
   answered from Scripture. Opened via fzOpenDest('questions') (the
   generic faith-home takeover) which builds a <div id="mqHost"> in
   #fzDestBody and calls window.renderMansQuestions('mqHost').

   Data: window.MANS_QUESTIONS (35 Qs) + window.MQ_CATEGORIES (3 cats),
   from app/js/data/mans-questions.js (defer-loaded). Shape:
     MQ_CATEGORIES: { id, label, icon, sub }
     MANS_QUESTIONS: { id, category, question, hook, answer[], scriptures[{ref,text}], goDeeper? }
     goDeeper (optional): 'dest:<key>' | 'proof:<id>'

   Design: interface-layer, theme-adaptive (NOT a scene-layer surface —
   it's reading content). Faith gold register #fbbf24 dark / #92400e
   light. Oswald for eyebrows/labels (the faith-eyebrow font per the
   design skill), Georgia serif for the question/answer reading text and
   scripture quotes (The Story's actual serif — Newsreader is scoped to
   Journey Home only, so it's deliberately NOT used here).

   Registers: reading an answer is SETTLE at most — window.sfx.settle()
   (typeof-guarded, no XP/confetti), plus one 'reflect' weekly-quest bump
   per day (shared D.hcDaily['reflect'] key, so it doesn't double-count
   against Night Reflection / other reflect sources).

   Public API (window):
     renderMansQuestions(hostId)  — entry, renders the category list
     mqOpenAnswer(id)             — list -> answer takeover
     mqBackToList()               — answer -> list (restores scroll)
     mqGoDeeper(goDeeperString)   — route the "Go deeper" door
============================================================= */
(function(){
  'use strict';

  var _mqHostId = null;
  var _mqListScroll = 0;

  function _list(){ return (typeof window !== 'undefined' && Array.isArray(window.MANS_QUESTIONS)) ? window.MANS_QUESTIONS : []; }
  function _cats(){ return (typeof window !== 'undefined' && Array.isArray(window.MQ_CATEGORIES)) ? window.MQ_CATEGORIES : []; }
  function _byId(id){ var l=_list(); for(var i=0;i<l.length;i++){ if(l[i] && l[i].id===id) return l[i]; } return null; }
  function _catById(id){ var c=_cats(); for(var i=0;i<c.length;i++){ if(c[i] && c[i].id===id) return c[i]; } return null; }
  function _catLabel(id){ var c=_catById(id); return c ? c.label : ''; }
  function _idx(id){ var l=_list(); for(var i=0;i<l.length;i++){ if(l[i] && l[i].id===id) return i; } return -1; }

  function _esc(s){
    if(s==null) return '';
    if(typeof window.escapeHtml === 'function') return window.escapeHtml(String(s));
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function _host(){ return _mqHostId ? document.getElementById(_mqHostId) : null; }

  // Nearest scrollable ancestor (host included), else the page scroller —
  // covers #fzDestBody scrolling with the page.
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

  // ── read-state (D.mqRead) ────────────────────────────────
  function _isRead(id){ return (typeof D !== 'undefined' && D && Array.isArray(D.mqRead) && D.mqRead.indexOf(id) >= 0); }
  function _markRead(id){
    if(typeof D === 'undefined' || !D) return;
    if(!Array.isArray(D.mqRead)) D.mqRead = [];
    if(D.mqRead.indexOf(id) < 0){ D.mqRead.push(id); if(typeof save === 'function'){ try{ save(); }catch(_e){} } }
  }
  // Once-per-day reflect throttle — same D.hcDaily store + 'reflect' key
  // that _hcOnce('reflect') uses in faith-zones.js, so all reflect sources
  // share one daily bump and can't over-count the weekly quest.
  function _reflectOncePerDay(){
    if(typeof D === 'undefined' || !D) return false;
    if(!D.hcDaily || typeof D.hcDaily !== 'object' || Array.isArray(D.hcDaily)) D.hcDaily = {};
    var today = new Date().toISOString().slice(0,10);
    if(D.hcDaily.reflect === today) return false;
    D.hcDaily.reflect = today;
    if(typeof save === 'function'){ try{ save(); }catch(_e){} }
    return true;
  }

  // ── entry ────────────────────────────────────────────────
  function renderMansQuestions(hostId){
    _mqHostId = hostId;
    _mqListScroll = 0;
    _mqLastOpenedId = null;
    // Oswald (eyebrows/labels/refs) is lazy-loaded. Every path in passes
    // through Journey Home (which loads it), but call the ensure helper
    // directly too so a future direct entry point doesn't silently fall
    // back to Inter. Guarded — no-op if the helper isn't present.
    try{
      if(typeof _fjEnsureFonts === 'function') _fjEnsureFonts();
      else if(typeof _ccEnsureFonts === 'function') _ccEnsureFonts();
    }catch(_e){}
    _injectCss();
    mqRenderList();
  }
  var _mqLastOpenedId = null;

  // ── LIST ─────────────────────────────────────────────────
  function mqRenderList(){
    var host = _host();
    if(!host) return;
    var cats = _cats(), all = _list();
    // The takeover header (#fzDestTitle) already shows the title, so the
    // hero here is an epigraph, not a second copy of the title (UX review:
    // a restated title in two faces ~40px apart is a hierarchy failure).
    var h = '<div class="mq-wrap">'+
      '<div class="mq-hero">'+
        '<div class="mq-hero-sub">Every question here has been asked for thousands of years. None of them scare God.</div>'+
        '<div class="mq-rule" aria-hidden="true"></div>'+
      '</div>';
    if(!all.length){
      h += '<div class="mq-empty">Questions are loading…</div>';
    } else {
      cats.forEach(function(cat){
        var qs = all.filter(function(q){ return q && q.category === cat.id; });
        if(!qs.length) return;
        h += '<section class="mq-cat">'+
          '<div class="mq-cat-hd">'+
            '<span class="mq-cat-icon" aria-hidden="true">'+_esc(cat.icon||'')+'</span>'+
            '<span class="mq-cat-hd-txt">'+
              '<h2 class="mq-cat-label">'+_esc(cat.label||'')+'</h2>'+
              (cat.sub ? '<span class="mq-cat-sub">'+_esc(cat.sub)+'</span>' : '')+
            '</span>'+
          '</div>'+
          '<div class="mq-cat-rule" aria-hidden="true"></div>'+
          '<div class="mq-qlist">';
        qs.forEach(function(q){
          var read = _isRead(q.id);
          h += '<button type="button" class="mq-row'+(read?' mq-read':'')+'" data-mq-id="'+_esc(q.id)+'" onclick="mqOpenAnswer(\''+_esc(q.id)+'\')">'+
            '<span class="mq-dot" aria-hidden="true"></span>'+
            '<span class="mq-row-txt">'+
              (read ? '<span class="mq-vh">Read. </span>' : '')+
              '<span class="mq-q">'+_esc(q.question||'')+'</span>'+
              (q.hook ? '<span class="mq-hook">'+_esc(q.hook)+'</span>' : '')+
            '</span>'+
            '<span class="mq-arrow" aria-hidden="true">→</span>'+
          '</button>';
        });
        h += '</div></section>';
      });
    }
    h += '</div>';
    host.innerHTML = h;
    var sc = _scrollEl(host);
    var y = _mqListScroll || 0;
    var focusId = _mqLastOpenedId;
    requestAnimationFrame(function(){
      try{ if(sc) sc.scrollTop = y; }catch(_e){}
      // Returning from an answer — restore keyboard focus to the row that
      // was opened, not <body> (UX review: focus was lost on the back path).
      if(focusId){
        var row = host.querySelector('.mq-row[data-mq-id="'+focusId+'"]');
        if(row && row.focus){ try{ row.focus({ preventScroll:true }); }catch(_e){} }
        _mqLastOpenedId = null;
      }
    });
  }

  // ── ANSWER (takeover) ────────────────────────────────────
  function mqOpenAnswer(id){
    var host = _host();
    if(!host) return;
    var q = _byId(id);
    if(!q) return;
    // Stash list scroll + the id so the back pill restores both.
    var sc = _scrollEl(host);
    _mqListScroll = sc ? sc.scrollTop : 0;
    _mqLastOpenedId = id;
    _markRead(id);
    // Reading is SETTLE at most — one low bell, no XP/confetti.
    try{ if(window.sfx && typeof window.sfx.settle === 'function') window.sfx.settle(); }catch(_e){}
    if(_reflectOncePerDay() && typeof window.walkQuestBump === 'function'){ try{ window.walkQuestBump('reflect', 1); }catch(_e){} }
    mqRenderAnswer(q);
  }

  function mqRenderAnswer(q){
    var host = _host();
    if(!host) return;
    var paras = Array.isArray(q.answer) ? q.answer
              : (q.answer ? String(q.answer).split(/\n\n+/) : []);
    var scr = Array.isArray(q.scriptures) ? q.scriptures : [];
    var idx = _idx(q.id), l = _list();
    var prev = (idx > 0) ? l[idx-1] : null;
    var next = (idx >= 0 && idx < l.length-1) ? l[idx+1] : null;

    var h = '<div class="mq-answer">'+
      '<button type="button" class="mq-back" onclick="mqBackToList()">← All Questions</button>'+
      '<div class="mq-a-eyebrow">'+_esc(_catLabel(q.category))+'</div>'+
      '<h2 class="mq-a-question">'+_esc(q.question||'')+'</h2>'+
      '<div class="mq-rule" aria-hidden="true"></div>'+
      '<div class="mq-a-body">';
    paras.forEach(function(p){ h += '<p class="mq-a-p">'+_esc(p)+'</p>'; });
    h += '</div>';
    if(scr.length){
      h += '<div class="mq-scr-wrap">';
      scr.forEach(function(s){
        h += '<div class="mq-scr">'+
          '<div class="mq-scr-text">'+_esc(s.text||'')+'</div>'+
          (s.ref ? '<div class="mq-scr-ref">'+_esc(s.ref)+'</div>' : '')+
        '</div>';
      });
      h += '</div>';
    }
    // Go-deeper door slot — populated by _mqWireDoor (honest-null for proof:).
    h += '<div class="mq-door-slot" id="mqDoorSlot"></div>';
    // Prev / Next browse.
    h += '<div class="mq-nav">'+
      (prev ? '<button type="button" class="mq-nav-btn" onclick="mqOpenAnswer(\''+_esc(prev.id)+'\')">← Previous</button>' : '<span class="mq-nav-sp"></span>')+
      (next ? '<button type="button" class="mq-nav-btn" onclick="mqOpenAnswer(\''+_esc(next.id)+'\')">Next →</button>' : '<span class="mq-nav-sp"></span>')+
    '</div>';
    // Honest label — content is new/draft, matches the walk-stations pattern.
    h += '<div class="mq-review-note">Draft teaching — being reviewed with church leadership.</div>';
    h += '</div>';
    host.innerHTML = h;
    var sc = _scrollEl(host);
    if(sc){ requestAnimationFrame(function(){ try{ sc.scrollTop = 0; }catch(_e){} }); }
    try{ var b = host.querySelector('.mq-back'); if(b && b.focus) b.focus({ preventScroll:true }); }catch(_e){}
    _mqWireDoor(q);
  }

  function mqBackToList(){ mqRenderList(); }

  // Go-deeper door — 'dest:*' always shows (known safe dests); 'proof:*'
  // only shows if the id actually resolves (honest null; proof data is
  // lazy-loaded, so check now-or-after-load). Nothing appears otherwise.
  function _mqWireDoor(q){
    var slot = document.getElementById('mqDoorSlot');
    if(!slot || !q || !q.goDeeper) return;
    var gd = String(q.goDeeper);
    var ci = gd.indexOf(':');
    if(ci < 0) return;
    var kind = gd.slice(0, ci);
    var val  = gd.slice(ci + 1);
    var show = function(){ slot.innerHTML = '<button type="button" class="mq-door" onclick="mqGoDeeper(\''+_esc(gd)+'\')">Go deeper →</button>'; };
    if(kind === 'dest'){
      show();
    } else if(kind === 'proof'){
      if(typeof ppProofById === 'function' && ppProofById(val)){ show(); return; }
      if(typeof _proofProphecyEnsureLoaded === 'function'){
        _proofProphecyEnsureLoaded().then(function(){
          if(typeof ppProofById === 'function' && ppProofById(val)) show();
        }).catch(function(){});
      }
      // else: leave the slot empty — honest null, no dead door.
    }
  }

  function mqGoDeeper(gd){
    if(!gd) return;
    var ci = String(gd).indexOf(':');
    if(ci < 0) return;
    var kind = gd.slice(0, ci);
    var val  = gd.slice(ci + 1);
    if(kind === 'dest'){
      if(typeof fzOpenDest === 'function') fzOpenDest(val);
    } else if(kind === 'proof'){
      // Mirror skeptic-debates.js _skOpenProof: to the P&P tab, then open
      // the single proof modal after a short defer; lazy-load if needed.
      var go = function(){
        if(typeof toggleFaithExplore === 'function') toggleFaithExplore(true);
        if(typeof bfTab === 'function') bfTab('proofProphecy');
        setTimeout(function(){ if(typeof ppOpenModal === 'function') ppOpenModal(val); }, 140);
      };
      if(typeof PROOF_PROPHECY_DATA === 'undefined' && typeof ylccEnsureData === 'function'){
        ylccEnsureData('PROOF_PROPHECY_DATA', '/app/js/data/proof-prophecy.js').then(go).catch(go);
      } else { go(); }
    }
  }

  // ── CSS (inject once) ────────────────────────────────────
  var _cssDone = false;
  function _injectCss(){
    if(_cssDone || typeof document === 'undefined') return;
    _cssDone = true;
    var css =
    '#mqHost .mq-wrap{max-width:640px;margin:0 auto;padding:.2rem 0 2rem;}'+
    // hero (epigraph only — the takeover header carries the title)
    '#mqHost .mq-hero-sub{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:.95rem;line-height:1.6;color:var(--tx2);margin-top:.5rem;max-width:34rem;}'+
    '#mqHost .mq-rule{width:56px;height:1px;background:rgba(251,191,36,.55);margin:1rem 0;}'+
    // category section
    '#mqHost .mq-cat{margin-top:1.6rem;}'+
    '#mqHost .mq-cat-hd{display:flex;align-items:center;gap:.7rem;}'+
    '#mqHost .mq-cat-icon{font-size:1.5rem;line-height:1;flex-shrink:0;}'+
    '#mqHost .mq-cat-hd-txt{display:flex;flex-direction:column;min-width:0;}'+
    '#mqHost .mq-cat-label{font-family:\'Oswald\',var(--fm);font-size:1rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#fbbf24;margin:0;}'+
    '#mqHost .mq-cat-sub{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:.8rem;line-height:1.4;color:var(--tx2);margin-top:.1rem;}'+
    '#mqHost .mq-cat-rule{height:1px;background:rgba(251,191,36,.3);margin:.6rem 0 .3rem;}'+
    // question rows
    '#mqHost .mq-qlist{display:flex;flex-direction:column;}'+
    '#mqHost .mq-row{display:flex;align-items:flex-start;gap:.7rem;width:100%;min-height:56px;text-align:left;background:none;border:none;border-bottom:1px solid rgba(255,255,255,.06);padding:.85rem .2rem;cursor:pointer;font-family:inherit;color:var(--tx);transition:background .15s;}'+
    '#mqHost .mq-row:hover{background:rgba(251,191,36,.05);}'+
    '#mqHost .mq-row:focus-visible{outline:2px solid #fbbf24;outline-offset:-2px;}'+
    '#mqHost .mq-dot{flex-shrink:0;width:7px;height:7px;border-radius:50%;background:transparent;margin-top:.45rem;transition:background .2s;}'+
    '#mqHost .mq-row.mq-read .mq-dot{background:#fbbf24;box-shadow:0 0 6px rgba(251,191,36,.5);}'+
    '#mqHost .mq-row-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:.15rem;}'+
    // Visually-hidden read marker for screen readers (the gold dot is
    // aria-hidden and sight-only).
    '#mqHost .mq-vh{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}'+
    '#mqHost .mq-q{font-family:Georgia,\'Times New Roman\',serif;font-size:.98rem;line-height:1.35;color:var(--tx);}'+
    '#mqHost .mq-hook{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:.78rem;line-height:1.4;color:var(--tx2);}'+
    '#mqHost .mq-arrow{flex-shrink:0;color:rgba(251,191,36,.6);font-size:.9rem;margin-top:.2rem;}'+
    '#mqHost .mq-empty{text-align:center;padding:2rem 1rem;color:var(--tx2);font-style:italic;font-family:Georgia,serif;}'+
    // answer view
    '#mqHost .mq-answer{max-width:600px;margin:0 auto;padding:.2rem 0 2rem;}'+
    '#mqHost .mq-back{display:inline-flex;align-items:center;gap:.4rem;min-height:44px;padding:.5rem .9rem;margin-bottom:1rem;border:1px solid rgba(251,191,36,.4);border-radius:999px;background:rgba(251,191,36,.1);color:#fbbf24;font:600 .8rem/1 var(--fm);letter-spacing:.04em;cursor:pointer;}'+
    '#mqHost .mq-back:hover{background:rgba(251,191,36,.18);}'+
    '#mqHost .mq-back:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    '#mqHost .mq-a-eyebrow{font-family:\'Oswald\',var(--fm);font-size:.62rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#fbbf24;margin-bottom:.4rem;}'+
    '#mqHost .mq-a-question{font-family:Georgia,\'Times New Roman\',serif;font-weight:400;font-size:1.5rem;line-height:1.3;color:var(--tx);margin:0;}'+
    '#mqHost .mq-a-body{margin-top:.4rem;}'+
    '#mqHost .mq-a-p{font-family:Georgia,\'Times New Roman\',serif;font-size:1rem;line-height:1.75;color:var(--tx);margin:0 0 1rem;}'+
    // scripture blocks
    '#mqHost .mq-scr-wrap{display:flex;flex-direction:column;gap:.7rem;margin:1.2rem 0;}'+
    '#mqHost .mq-scr{border-left:2px solid rgba(251,191,36,.5);padding:.2rem 0 .2rem .9rem;}'+
    '#mqHost .mq-scr-text{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:.95rem;line-height:1.6;color:var(--tx2);}'+
    '#mqHost .mq-scr-ref{font-family:\'Oswald\',var(--fm);font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fbbf24;margin-top:.3rem;}'+
    // go-deeper door
    '#mqHost .mq-door-slot:empty{display:none;}'+
    '#mqHost .mq-door{display:inline-flex;align-items:center;min-height:44px;margin:.6rem 0 0;padding:.55rem 1.1rem;border:1px solid rgba(251,191,36,.5);border-radius:999px;background:rgba(251,191,36,.09);color:#fbbf24;font:700 .82rem/1 var(--fm);letter-spacing:.04em;cursor:pointer;}'+
    '#mqHost .mq-door:hover{background:rgba(251,191,36,.18);}'+
    '#mqHost .mq-door:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    // prev/next
    '#mqHost .mq-nav{display:flex;justify-content:space-between;gap:.5rem;margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.08);}'+
    '#mqHost .mq-nav-sp{flex:0 0 auto;}'+
    '#mqHost .mq-nav-btn{min-height:44px;padding:.5rem 1rem;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:none;color:var(--tx2);font:600 .78rem/1 var(--fm);letter-spacing:.03em;cursor:pointer;}'+
    '#mqHost .mq-nav-btn:hover{border-color:rgba(251,191,36,.5);color:#fbbf24;}'+
    '#mqHost .mq-nav-btn:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    '#mqHost .mq-review-note{margin-top:1.6rem;font-size:.66rem;font-style:italic;color:var(--tx3);text-align:center;}'+
    // ── light mode ──
    ':root.light #mqHost .mq-cat-label,:root.light #mqHost .mq-a-eyebrow,:root.light #mqHost .mq-scr-ref{color:#92400e;}'+
    ':root.light #mqHost .mq-rule{background:rgba(146,64,14,.5);}'+
    ':root.light #mqHost .mq-cat-rule{background:rgba(146,64,14,.28);}'+
    ':root.light #mqHost .mq-row.mq-read .mq-dot{background:#92400e;box-shadow:none;}'+
    ':root.light #mqHost .mq-arrow{color:rgba(146,64,14,.6);}'+
    ':root.light #mqHost .mq-scr{border-left-color:rgba(146,64,14,.5);}'+
    ':root.light #mqHost .mq-back{color:#92400e;border-color:rgba(180,83,9,.4);background:rgba(180,83,9,.08);}'+
    ':root.light #mqHost .mq-back:hover{background:rgba(180,83,9,.14);}'+
    ':root.light #mqHost .mq-door{color:#92400e;border-color:rgba(180,83,9,.4);background:rgba(180,83,9,.08);}'+
    ':root.light #mqHost .mq-door:hover{background:rgba(180,83,9,.14);}'+
    ':root.light #mqHost .mq-nav-btn:hover{border-color:rgba(180,83,9,.5);color:#92400e;}'+
    // Structural hairlines — dark uses white low-alpha; repaint them for
    // paper or the 35-row list has NO separators in light mode (no card
    // backgrounds anywhere, so the border is the only divider).
    ':root.light #mqHost .mq-row{border-bottom-color:rgba(146,64,14,.16);}'+
    ':root.light #mqHost .mq-row:hover{background:rgba(146,64,14,.06);}'+
    ':root.light #mqHost .mq-nav{border-top-color:rgba(146,64,14,.2);}'+
    ':root.light #mqHost .mq-nav-btn{border-color:rgba(146,64,14,.22);}'+
    // reduced motion
    '@media (prefers-reduced-motion: reduce){#mqHost .mq-row,#mqHost .mq-dot{transition:none;}}';
    var st = document.createElement('style');
    st.id = 'mq-css';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  // ── expose ───────────────────────────────────────────────
  window.renderMansQuestions = renderMansQuestions;
  window.mqOpenAnswer        = mqOpenAnswer;
  window.mqBackToList        = mqBackToList;
  window.mqGoDeeper          = mqGoDeeper;
})();
