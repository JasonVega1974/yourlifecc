/* =============================================================
   mans-questions-ui.js — "Man's Questions, God's Answers" (2026-07-08)

   A reading surface: honest questions people ask about God/faith,
   answered from Scripture. Opened via fzOpenDest('questions') (the
   generic faith-home takeover) which builds a <div id="mqHost"> in
   #fzDestBody and calls window.renderMansQuestions('mqHost').

   Data: window.MANS_QUESTIONS + window.MQ_CATEGORIES, from
   app/js/data/mans-questions.js (defer-loaded). Shape:
     MQ_CATEGORIES: { id, label, icon, sub }
     MANS_QUESTIONS: { id, category, question, hook, answer[],
                       scriptures[{ref,text}], goDeeper?, top10?, charts? }
     goDeeper (optional): 'dest:<key>' | 'proof:<id>'
     top10 (optional): 1-10 — numbered "THE TOP 10" tier at the top.
     charts (optional): visual data blocks under the answer —
       { kind:'facts', title, cells:[{big,label}] }
       { kind:'bars',  title, note?, bars:[{label,display,value,max}] }
       { kind:'gauge', title, pct, note? }

   Experience (2026-07-08 world-class pass):
     - Warm-dark scene-lite hero (Meet Jesus mj-hero register —
       hardcoded warm-dark both themes, the "photo-hero reads on
       paper" precedent).
     - THE TOP 10 numbered tier first, then the three categories.
     - Question-FIRST answer view: an unread question opens on the
       question + a "Reveal God's answer" gate; revealing unfolds the
       answer in a staged fade (reduced-motion: instant). A question
       already read opens straight to the answer (no re-gate).
     - Reveal is the meaningful beat: mark-read + SETTLE bell + one
       'reflect' quest bump/day happen on REVEAL, not on open.

   Design: interface-layer reading content, theme-adaptive. Faith gold
   register #fbbf24 dark / #92400e light. Oswald for eyebrows/labels
   (faith-eyebrow font), Georgia serif for question/answer/scripture
   (The Story's serif — Newsreader is Journey-Home-only, so not used).

   Public API (window):
     renderMansQuestions(hostId)  — entry, renders the list
     mqOpenAnswer(id)             — list -> answer takeover
     mqReveal(id)                 — reveal-gate -> unfold the answer
     mqBackToList()               — answer -> list (restores scroll+focus)
     mqGoDeeper(goDeeperString)   — route the "Go deeper" door
============================================================= */
(function(){
  'use strict';

  var _mqHostId = null;
  var _mqListScroll = 0;
  var _mqLastOpenedId = null;

  function _list(){ return (typeof window !== 'undefined' && Array.isArray(window.MANS_QUESTIONS)) ? window.MANS_QUESTIONS : []; }
  function _cats(){ return (typeof window !== 'undefined' && Array.isArray(window.MQ_CATEGORIES)) ? window.MQ_CATEGORIES : []; }
  function _byId(id){ var l=_list(); for(var i=0;i<l.length;i++){ if(l[i] && l[i].id===id) return l[i]; } return null; }
  function _catById(id){ var c=_cats(); for(var i=0;i<c.length;i++){ if(c[i] && c[i].id===id) return c[i]; } return null; }
  function _catLabel(id){ var c=_catById(id); return c ? c.label : ''; }
  function _idx(id){ var l=_list(); for(var i=0;i<l.length;i++){ if(l[i] && l[i].id===id) return i; } return -1; }
  function _top10(){ return _list().filter(function(q){ return q && typeof q.top10 === 'number'; }).sort(function(a,b){ return a.top10 - b.top10; }); }

  function _esc(s){
    if(s==null) return '';
    if(typeof window.escapeHtml === 'function') return window.escapeHtml(String(s));
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function _host(){ return _mqHostId ? document.getElementById(_mqHostId) : null; }
  function _reduced(){ try{ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(_e){ return false; } }

  // Nearest scrollable ancestor (host included), else the page scroller.
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
  // Once-per-day reflect throttle — shares the D.hcDaily['reflect'] key that
  // _hcOnce('reflect') uses in faith-zones.js, so all reflect sources share
  // one daily bump and can't over-count the weekly quest.
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
    // through Journey Home (which loads it), but ensure directly too so a
    // future direct entry doesn't fall back to Inter. Guarded no-op.
    try{
      if(typeof _fjEnsureFonts === 'function') _fjEnsureFonts();
      else if(typeof _ccEnsureFonts === 'function') _ccEnsureFonts();
    }catch(_e){}
    _injectCss();
    mqRenderList();
  }

  // ── LIST ─────────────────────────────────────────────────
  function _rowHtml(q, opts){
    opts = opts || {};
    var read = _isRead(q.id);
    var num = opts.rank ? '<span class="mq-num" aria-hidden="true">'+(q.top10<10?'0':'')+_esc(q.top10)+'</span>' : '<span class="mq-dot" aria-hidden="true"></span>';
    return '<button type="button" class="mq-row'+(read?' mq-read':'')+(opts.rank?' mq-row-rank':'')+'" data-mq-id="'+_esc(q.id)+'" onclick="mqOpenAnswer(\''+_esc(q.id)+'\')">'+
      num+
      '<span class="mq-row-txt">'+
        (read ? '<span class="mq-vh">Read. </span>' : '')+
        '<span class="mq-q">'+_esc(q.question||'')+'</span>'+
        (q.hook ? '<span class="mq-hook">'+_esc(q.hook)+'</span>' : '')+
      '</span>'+
      '<span class="mq-arrow" aria-hidden="true">→</span>'+
    '</button>';
  }

  function mqRenderList(){
    var host = _host();
    if(!host) return;
    var cats = _cats(), all = _list();
    // Warm-dark scene-lite hero (Meet Jesus register). The takeover header
    // (#fzDestTitle) still carries the plain title above this; the hero is
    // the emotional frame, not a second title copy.
    var h = '<div class="mq-wrap">'+
      '<div class="mq-hero">'+
        '<div class="mq-hero-eyebrow">Honest questions, straight answers</div>'+
        '<blockquote class="mq-hero-line">Every question here has been asked for thousands of years. None of them scare God.</blockquote>'+
        '<div class="mq-hero-ref">Bring the hard ones.</div>'+
      '</div>';
    if(!all.length){
      h += '<div class="mq-empty">Questions are loading…</div>';
    } else {
      // THE TOP 10 — numbered tier first.
      var top = _top10();
      if(top.length){
        h += '<section class="mq-cat mq-top10">'+
          '<div class="mq-cat-hd">'+
            '<span class="mq-cat-icon" aria-hidden="true">⭐</span>'+
            '<span class="mq-cat-hd-txt">'+
              '<h2 class="mq-cat-label">The Top 10</h2>'+
              '<span class="mq-cat-sub">The questions asked most — start here.</span>'+
            '</span>'+
          '</div>'+
          '<div class="mq-cat-rule" aria-hidden="true"></div>'+
          '<div class="mq-qlist">';
        top.forEach(function(q){ h += _rowHtml(q, { rank:true }); });
        h += '</div></section>';
      }
      // The three categories (full set).
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
        qs.forEach(function(q){ h += _rowHtml(q, {}); });
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
      // Returning from an answer — restore focus to the row that was opened
      // (there can be two rows for a Top-10 question; prefer the one that
      // is actually onscreen at the restored scroll, else the first).
      if(focusId){
        var rows = host.querySelectorAll('.mq-row[data-mq-id="'+focusId+'"]');
        var row = rows.length ? rows[0] : null;
        if(row && row.focus){ try{ row.focus({ preventScroll:true }); }catch(_e){} }
        _mqLastOpenedId = null;
      }
    });
  }

  // ── ANSWER (takeover) ────────────────────────────────────
  // Opening stashes list scroll + id. An unread question opens on the
  // reveal gate (mark-read/settle deferred to mqReveal); a read question
  // opens straight to the revealed answer.
  function mqOpenAnswer(id){
    var host = _host();
    if(!host) return;
    var q = _byId(id);
    if(!q) return;
    var sc = _scrollEl(host);
    _mqListScroll = sc ? sc.scrollTop : 0;
    _mqLastOpenedId = id;
    mqRenderAnswer(q, _isRead(id));
  }

  // The reveal beat — mark read, settle bell, once/day reflect bump, then
  // unfold. Called from the gate button on an unread question.
  function mqReveal(id){
    var q = _byId(id);
    if(!q) return;
    _markRead(id);
    try{ if(window.sfx && typeof window.sfx.settle === 'function') window.sfx.settle(); }catch(_e){}
    if(_reflectOncePerDay() && typeof window.walkQuestBump === 'function'){ try{ window.walkQuestBump('reflect', 1); }catch(_e){} }
    mqRenderAnswer(q, true, /*animate*/true);
  }

  function _chartsHtml(charts){
    if(!Array.isArray(charts) || !charts.length) return '';
    var out = '';
    charts.forEach(function(c){
      if(!c || !c.kind) return;
      if(c.kind === 'facts'){
        out += '<div class="mq-chart mq-chart-facts">'+
          (c.title ? '<div class="mq-chart-title">'+_esc(c.title)+'</div>' : '')+
          '<div class="mq-facts-grid">';
        (c.cells||[]).forEach(function(cell){
          out += '<div class="mq-fact"><span class="mq-fact-big">'+_esc(cell.big||'')+'</span><span class="mq-fact-label">'+_esc(cell.label||'')+'</span></div>';
        });
        out += '</div></div>';
      } else if(c.kind === 'bars'){
        out += '<div class="mq-chart mq-chart-bars">'+
          (c.title ? '<div class="mq-chart-title">'+_esc(c.title)+'</div>' : '');
        (c.bars||[]).forEach(function(b){
          var max = (typeof b.max === 'number' && b.max>0) ? b.max : 100;
          var pct = Math.max(2, Math.min(100, Math.round(((b.value||0)/max)*100)));
          out += '<div class="mq-bar">'+
            '<div class="mq-bar-top"><span class="mq-bar-label">'+_esc(b.label||'')+'</span><span class="mq-bar-val">'+_esc(b.display!=null?b.display:b.value)+'</span></div>'+
            '<div class="mq-bar-track"><span class="mq-bar-fill" style="width:0%" data-pct="'+pct+'"></span></div>'+
          '</div>';
        });
        if(c.note) out += '<div class="mq-chart-note">'+_esc(c.note)+'</div>';
        out += '</div>';
      } else if(c.kind === 'gauge'){
        var pct = (typeof c.pct === 'number') ? c.pct : 0;
        var disp = (pct % 1 === 0) ? String(pct) : pct.toFixed(1);
        out += '<div class="mq-chart mq-chart-gauge">'+
          (c.title ? '<div class="mq-chart-title">'+_esc(c.title)+'</div>' : '')+
          '<div class="mq-gauge-num">'+_esc(disp)+'<span class="mq-gauge-pct">%</span></div>'+
          '<div class="mq-bar-track mq-gauge-track"><span class="mq-bar-fill" style="width:0%" data-pct="'+Math.max(2,Math.min(100,Math.round(pct)))+'"></span></div>'+
          (c.note ? '<div class="mq-chart-note">'+_esc(c.note)+'</div>' : '')+
        '</div>';
      }
    });
    return out;
  }

  // revealed=false → the question + reveal gate (unread first-encounter).
  // revealed=true  → the full answer (read revisit, or post-reveal).
  // animate=true   → stagger the revealed items in (ignored if reduced).
  function mqRenderAnswer(q, revealed, animate){
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
      '<div class="mq-a-eyebrow">'+_esc(_catLabel(q.category))+
        (typeof q.top10 === 'number' ? ' · Top 10 #'+_esc(q.top10) : '')+'</div>'+
      '<h2 class="mq-a-question">'+_esc(q.question||'')+'</h2>'+
      '<div class="mq-rule" aria-hidden="true"></div>';

    if(!revealed){
      // The reveal gate — the "flip the card" beat. Question stands alone
      // with its hook; the answer is one tap away.
      h += '<div class="mq-gate">'+
        (q.hook ? '<div class="mq-gate-hook">'+_esc(q.hook)+'</div>' : '')+
        '<button type="button" class="mq-reveal-btn" onclick="mqReveal(\''+_esc(q.id)+'\')">Reveal God’s answer<span class="mq-reveal-caret" aria-hidden="true">↓</span></button>'+
      '</div>';
      h += '</div>';
      host.innerHTML = h;
      var scg = _scrollEl(host);
      if(scg){ requestAnimationFrame(function(){ try{ scg.scrollTop = 0; }catch(_e){} }); }
      try{ var rb = host.querySelector('.mq-reveal-btn'); if(rb && rb.focus) rb.focus({ preventScroll:true }); }catch(_e){}
      return;
    }

    // Revealed answer. Each block is a .mq-reveal-item for staggered entry.
    var i = 0;
    var item = function(inner){ return '<div class="mq-reveal-item" style="--mq-i:'+(i++)+'">'+inner+'</div>'; };
    h += '<div class="mq-a-body">';
    paras.forEach(function(p){ h += item('<p class="mq-a-p">'+_esc(p)+'</p>'); });
    h += '</div>';
    var charts = _chartsHtml(q.charts);
    if(charts) h += item(charts);
    if(scr.length){
      var sh = '<div class="mq-scr-wrap">';
      scr.forEach(function(s){
        sh += '<div class="mq-scr">'+
          '<div class="mq-scr-text">'+_esc(s.text||'')+'</div>'+
          (s.ref ? '<div class="mq-scr-ref">'+_esc(s.ref)+'</div>' : '')+
        '</div>';
      });
      sh += '</div>';
      h += item(sh);
    }
    // Go-deeper door slot — populated by _mqWireDoor (honest-null for proof:).
    h += item('<div class="mq-door-slot" id="mqDoorSlot"></div>');
    // Prev / Next browse.
    h += '<div class="mq-nav">'+
      (prev ? '<button type="button" class="mq-nav-btn" onclick="mqOpenAnswer(\''+_esc(prev.id)+'\')">← Previous</button>' : '<span class="mq-nav-sp"></span>')+
      (next ? '<button type="button" class="mq-nav-btn" onclick="mqOpenAnswer(\''+_esc(next.id)+'\')">Next →</button>' : '<span class="mq-nav-sp"></span>')+
    '</div>';
    h += '<div class="mq-review-note">Draft teaching — being reviewed with church leadership.</div>';
    h += '</div>';
    host.innerHTML = h;

    var sc = _scrollEl(host);
    // On reveal (in-place unfold) keep the scroll where it is so the reader
    // stays anchored on the question; on a fresh open of a read Q, top it.
    if(sc && !animate){ requestAnimationFrame(function(){ try{ sc.scrollTop = 0; }catch(_e){} }); }
    try{ var b = host.querySelector('.mq-back'); if(b && b.focus) b.focus({ preventScroll:true }); }catch(_e){}
    _mqWireDoor(q);
    _mqAnimateIn(host, animate);
  }

  // Stagger the revealed items + fill any stat bars. Reduced motion: show
  // everything immediately (items already visible; bars set to final width
  // with no transition).
  function _mqAnimateIn(host, animate){
    var items = host.querySelectorAll('.mq-reveal-item');
    var bars = host.querySelectorAll('.mq-bar-fill');
    var reduced = _reduced();
    if(reduced || !animate){
      for(var a=0;a<items.length;a++){ items[a].classList.add('is-in','no-anim'); }
      // Fill bars at final width (transition suppressed by .no-anim on wrap).
      for(var b=0;b<bars.length;b++){ bars[b].style.width = (bars[b].getAttribute('data-pct')||0)+'%'; }
      return;
    }
    // Two rAFs so the initial (hidden) state paints before the class flip.
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      for(var a=0;a<items.length;a++){ items[a].classList.add('is-in'); }
      // Fill bars after the items begin arriving (kept simple — one pass).
      setTimeout(function(){
        for(var b=0;b<bars.length;b++){ bars[b].style.width = (bars[b].getAttribute('data-pct')||0)+'%'; }
      }, 220);
    }); });
  }

  function mqBackToList(){ mqRenderList(); }

  // Go-deeper door — 'dest:*' always shows (known safe dests); 'proof:*'
  // only shows if the id resolves (honest null; proof data is lazy-loaded).
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
    // Warm-dark scene-lite hero (Meet Jesus mj-hero register — hardcoded
    // warm-dark both themes; only a light tweak to the ref for contrast).
    '#mqHost .mq-hero{background:linear-gradient(165deg,#221a12 0%,#171310 55%,#100d0a 100%);border:1px solid rgba(251,191,36,.18);border-radius:16px;padding:1.5rem 1.3rem 1.25rem;margin-bottom:.4rem;text-align:center;}'+
    '#mqHost .mq-hero-eyebrow{font-family:\'Oswald\',var(--fm);font-size:.6rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#fbbf24;opacity:.9;margin-bottom:.7rem;}'+
    '#mqHost .mq-hero-line{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:1.12rem;line-height:1.6;color:#f1e9d5;margin:0 0 .55rem;}'+
    '#mqHost .mq-hero-ref{font-family:var(--fm);font-size:.72rem;font-weight:700;color:rgba(251,191,36,.75);}'+
    '#mqHost .mq-rule{width:56px;height:1px;background:rgba(251,191,36,.55);margin:1rem 0;}'+
    // category section
    '#mqHost .mq-cat{margin-top:1.6rem;}'+
    '#mqHost .mq-top10{margin-top:1.4rem;}'+
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
    // numbered Top-10 rows
    '#mqHost .mq-num{flex-shrink:0;width:1.8rem;text-align:center;font-family:\'Oswald\',var(--fm);font-size:1.2rem;font-weight:600;line-height:1.1;color:rgba(251,191,36,.55);margin-top:.05rem;font-feature-settings:"tnum";}'+
    '#mqHost .mq-row-rank.mq-read .mq-num{color:#fbbf24;}'+
    '#mqHost .mq-row-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:.15rem;}'+
    // visually-hidden read marker (the gold dot/number is sight-only)
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
    // reveal gate
    '#mqHost .mq-gate{padding:.4rem 0 1rem;}'+
    '#mqHost .mq-gate-hook{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:1.05rem;line-height:1.55;color:var(--tx2);margin-bottom:1.3rem;}'+
    '#mqHost .mq-reveal-btn{display:inline-flex;align-items:center;gap:.5rem;min-height:48px;padding:.7rem 1.5rem;border:1px solid rgba(251,191,36,.55);border-radius:999px;background:rgba(251,191,36,.12);color:#fbbf24;font:700 .92rem/1 var(--fm);letter-spacing:.03em;cursor:pointer;transition:background .15s,transform .15s;}'+
    '#mqHost .mq-reveal-btn:hover{background:rgba(251,191,36,.2);transform:translateY(-1px);}'+
    '#mqHost .mq-reveal-btn:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    '#mqHost .mq-reveal-caret{font-size:1rem;line-height:1;animation:mqCaret 1.6s ease-in-out infinite;}'+
    '@keyframes mqCaret{0%,100%{transform:translateY(0);}50%{transform:translateY(3px);}}'+
    // staged reveal items
    '#mqHost .mq-reveal-item{opacity:0;transform:translateY(10px);transition:opacity .5s ease,transform .5s ease;transition-delay:calc(var(--mq-i,0) * 90ms);}'+
    '#mqHost .mq-reveal-item.is-in{opacity:1;transform:none;}'+
    '#mqHost .mq-reveal-item.no-anim{transition:none;}'+
    '#mqHost .mq-a-body{margin-top:.4rem;}'+
    '#mqHost .mq-a-p{font-family:Georgia,\'Times New Roman\',serif;font-size:1rem;line-height:1.75;color:var(--tx);margin:0 0 1rem;}'+
    // scripture blocks
    '#mqHost .mq-scr-wrap{display:flex;flex-direction:column;gap:.7rem;margin:1.2rem 0;}'+
    '#mqHost .mq-scr{border-left:2px solid rgba(251,191,36,.5);padding:.2rem 0 .2rem .9rem;}'+
    '#mqHost .mq-scr-text{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:.95rem;line-height:1.6;color:var(--tx2);}'+
    '#mqHost .mq-scr-ref{font-family:\'Oswald\',var(--fm);font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fbbf24;margin-top:.3rem;}'+
    // ── stat charts (interface-layer: solid fills, thin borders) ──
    '#mqHost .mq-chart{margin:1.3rem 0;padding:1.05rem 1.1rem;border:1px solid var(--card-border);border-radius:14px;background:var(--card-bg);}'+
    '#mqHost .mq-chart-title{font-family:\'Oswald\',var(--fm);font-size:.66rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fbbf24;margin-bottom:.85rem;}'+
    '#mqHost .mq-chart-note{font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:.78rem;line-height:1.5;color:var(--tx2);margin-top:.8rem;}'+
    '#mqHost .mq-facts-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem;}'+
    '@media (min-width:480px){#mqHost .mq-facts-grid{grid-template-columns:repeat(4,1fr);}}'+
    '#mqHost .mq-fact{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.15rem;padding:.5rem .2rem;border-radius:10px;background:rgba(251,191,36,.06);}'+
    '#mqHost .mq-fact-big{font-family:\'Oswald\',var(--fm);font-size:1.35rem;font-weight:600;line-height:1.05;color:var(--tx);font-feature-settings:"tnum";}'+
    '#mqHost .mq-fact-label{font-family:var(--fm);font-size:.66rem;line-height:1.3;color:var(--tx2);}'+
    '#mqHost .mq-bar{margin-bottom:.8rem;}'+
    '#mqHost .mq-bar:last-child{margin-bottom:0;}'+
    '#mqHost .mq-bar-top{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;margin-bottom:.3rem;}'+
    '#mqHost .mq-bar-label{font-family:var(--fm);font-size:.78rem;color:var(--tx);}'+
    '#mqHost .mq-bar-val{font-family:\'Oswald\',var(--fm);font-size:.9rem;font-weight:600;color:#fbbf24;font-feature-settings:"tnum";}'+
    '#mqHost .mq-bar-track{height:8px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;}'+
    '#mqHost .mq-bar-fill{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,rgba(251,191,36,.65),#fbbf24);transition:width .9s cubic-bezier(.22,1,.36,1);}'+
    '#mqHost .mq-chart-gauge{text-align:center;}'+
    '#mqHost .mq-gauge-num{font-family:\'Oswald\',var(--fm);font-size:2.6rem;font-weight:600;line-height:1;color:#fbbf24;font-feature-settings:"tnum";}'+
    '#mqHost .mq-gauge-pct{font-size:1.3rem;margin-left:.1rem;}'+
    '#mqHost .mq-gauge-track{margin-top:.7rem;}'+
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
    ':root.light #mqHost .mq-cat-label,:root.light #mqHost .mq-a-eyebrow,:root.light #mqHost .mq-scr-ref,:root.light #mqHost .mq-chart-title{color:#92400e;}'+
    ':root.light #mqHost .mq-rule{background:rgba(146,64,14,.5);}'+
    ':root.light #mqHost .mq-cat-rule{background:rgba(146,64,14,.28);}'+
    ':root.light #mqHost .mq-row.mq-read .mq-dot{background:#92400e;box-shadow:none;}'+
    ':root.light #mqHost .mq-num{color:rgba(146,64,14,.5);}'+
    ':root.light #mqHost .mq-row-rank.mq-read .mq-num{color:#92400e;}'+
    ':root.light #mqHost .mq-arrow{color:rgba(146,64,14,.6);}'+
    ':root.light #mqHost .mq-scr{border-left-color:rgba(146,64,14,.5);}'+
    ':root.light #mqHost .mq-back{color:#92400e;border-color:rgba(180,83,9,.4);background:rgba(180,83,9,.08);}'+
    ':root.light #mqHost .mq-back:hover{background:rgba(180,83,9,.14);}'+
    ':root.light #mqHost .mq-reveal-btn{color:#92400e;border-color:rgba(180,83,9,.5);background:rgba(180,83,9,.1);}'+
    ':root.light #mqHost .mq-reveal-btn:hover{background:rgba(180,83,9,.16);}'+
    ':root.light #mqHost .mq-door{color:#92400e;border-color:rgba(180,83,9,.4);background:rgba(180,83,9,.08);}'+
    ':root.light #mqHost .mq-door:hover{background:rgba(180,83,9,.14);}'+
    ':root.light #mqHost .mq-nav-btn:hover{border-color:rgba(180,83,9,.5);color:#92400e;}'+
    // chart light tweaks
    ':root.light #mqHost .mq-fact{background:rgba(180,83,9,.06);}'+
    ':root.light #mqHost .mq-bar-val,:root.light #mqHost .mq-gauge-num{color:#92400e;}'+
    ':root.light #mqHost .mq-bar-track{background:rgba(15,23,42,.08);}'+
    ':root.light #mqHost .mq-bar-fill{background:linear-gradient(90deg,rgba(180,83,9,.6),#b45309);}'+
    // Structural hairlines — dark uses white low-alpha; repaint for paper
    // or the list has NO row separators in light mode (no card bg on rows).
    ':root.light #mqHost .mq-row{border-bottom-color:rgba(146,64,14,.16);}'+
    ':root.light #mqHost .mq-row:hover{background:rgba(146,64,14,.06);}'+
    ':root.light #mqHost .mq-nav{border-top-color:rgba(146,64,14,.2);}'+
    ':root.light #mqHost .mq-nav-btn{border-color:rgba(146,64,14,.22);}'+
    // reduced motion — no stagger, no caret bounce, no bar sweep
    '@media (prefers-reduced-motion: reduce){#mqHost .mq-row,#mqHost .mq-dot,#mqHost .mq-reveal-item,#mqHost .mq-bar-fill,#mqHost .mq-reveal-btn{transition:none;}#mqHost .mq-reveal-caret{animation:none;}#mqHost .mq-reveal-item{opacity:1;transform:none;}}';
    var st = document.createElement('style');
    st.id = 'mq-css';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  // ── expose ───────────────────────────────────────────────
  window.renderMansQuestions = renderMansQuestions;
  window.mqOpenAnswer        = mqOpenAnswer;
  window.mqReveal            = mqReveal;
  window.mqBackToList        = mqBackToList;
  window.mqGoDeeper          = mqGoDeeper;
})();
