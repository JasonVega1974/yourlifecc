/* =============================================================
   bible-world-dig.js — Biblical Archaeology: DIG MODE (Build 1)
   Spec of record: docs/DIG_MODE_PASSPORT_SPEC.md

   Direction A: discoveries stay a grid (#bwDiscGrid) + modal
   (#bwDiscoveryModal). No carousel/deck/level-gate. Flow is
   buried -> excavated only.

   This module OVERRIDES faith.js globals by reassignment
   (window.bwRenderDiscoveries / window.openBwDiscovery) so faith.js
   is never edited. Loads AFTER faith.js (see index.html). All calls
   into faith.js are typeof-guarded.

   Store: reuses D.faithBibleWorld. Adds excavated{id:{ts}}. Sites-
   visited (D.faithBibleWorld.sites) is written by faith.js's
   _bwMarkVisited and read here read-only. No archPassport/
   archExcavated/archBadges keys (per spec).

   Build 2 (Expedition Passport) extends this module separately.
   ============================================================= */
(function(){
  'use strict';

  // ── helpers ──────────────────────────────────────────────────
  function _rm(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(_e){ return false; }
  }
  function _esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function _D(){ return window.D || {}; }
  function _save(){ if(typeof window.save === 'function') window.save(); }
  function _toast(m){ if(typeof window.showToast === 'function') window.showToast(m); }
  function _discoveries(){ return (typeof window !== 'undefined' && window.BIBLICAL_DISCOVERIES) ? window.BIBLICAL_DISCOVERIES : []; }
  function _discById(id){ return _discoveries().find(function(d){ return d && d.id === id; }) || null; }

  // Store accessor — additive. Never clobbers faith.js's shape.
  function _store(){
    var d = _D();
    if(!d.faithBibleWorld || typeof d.faithBibleWorld !== 'object') d.faithBibleWorld = {};
    var s = d.faithBibleWorld;
    if(!s.sites)        s.sites = {};
    if(!s.discoveries)  s.discoveries = {};
    if(!s.badges)       s.badges = {};
    if(!s.excavated)    s.excavated = {};
    if(!s.regionBadges) s.regionBadges = {};
    return s;
  }
  function _isExcavated(id){ return !!_store().excavated[id]; }

  // Dig-Mode certainty palette (spec): confirmed gold, consistent amber,
  // contested slate. Applied to grid cards too ("align list cards").
  function _certColor(c){ return c === 'confirmed' ? '#f5c842' : c === 'consistent' ? '#f59e0b' : '#94a3b8'; }
  function _certLabel(c){ return c === 'confirmed' ? 'Confirmed' : c === 'consistent' ? 'Consistent with Scripture' : 'Contested'; }
  function _certGlyph(c){ return c === 'confirmed' ? '✓' : c === 'consistent' ? '≈' : '?'; }

  // Generic artifact glyph for the 70% reveal layer (no per-discovery
  // icon exists in the data; deterministic pick by id so it's stable).
  var _ARTIFACTS = ['🏺','📜','🪙','🗿','🏛️','💎','⚱️','🔔'];
  function _artifactIcon(d){
    var id = (d && d.id) || '', h = 0;
    for(var i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) >>> 0;
    return _ARTIFACTS[h % _ARTIFACTS.length];
  }
  function _fmtDate(iso){
    try { var dt = new Date(iso); return dt.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); }
    catch(_e){ return ''; }
  }

  // ── styles (injected once; index.html stays lean) ────────────
  function _injectStyles(){
    if(document.getElementById('bwd-styles')) return;
    var css = [
      /* --- grid cards --- */
      '.bwd-card{position:relative;border-radius:16px;padding:0;overflow:hidden;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);min-height:104px;display:block;-webkit-tap-highlight-color:transparent;transition:transform .15s ease,box-shadow .15s ease;}',
      '.bwd-card:focus-visible{outline:2px solid #f5c842;outline-offset:2px;}',
      '.bwd-card:hover{transform:translateY(-2px);}',
      /* buried */
      '.bwd-card.bwd-buried{border-color:rgba(120,94,66,.45);}',
      '.bwd-buried .bwd-sed{position:absolute;inset:0;background:repeating-linear-gradient(115deg,#5a4636 0,#6b5744 7px,#514031 14px,#5f4a38 21px);opacity:.96;}',
      '.bwd-buried .bwd-sed:after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 30%,rgba(0,0,0,0),rgba(0,0,0,.45));}',
      '.bwd-buried .bwd-undisc{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;height:104px;gap:.25rem;color:#d9c7ad;text-shadow:0 1px 2px rgba(0,0,0,.5);}',
      '.bwd-buried .bwd-undisc .u-ico{font-size:1.5rem;filter:grayscale(.2) opacity(.85);}',
      '.bwd-buried .bwd-undisc .u-lbl{font-size:.6rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;opacity:.8;}',
      /* excavated / done */
      '.bwd-done .bwd-body{padding:.7rem .8rem .75rem;}',
      '.bwd-done .bwd-name{font-weight:800;font-size:.9rem;line-height:1.2;color:var(--tx);margin-bottom:.35rem;padding-right:4.6rem;}',
      '.bwd-done .bwd-meta{display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.3rem;}',
      '.bwd-done .bwd-cert{font-size:.58rem;font-weight:800;letter-spacing:.04em;padding:.12rem .45rem;border-radius:99px;border:1px solid;}',
      '.bwd-done .bwd-tag{font-size:.72rem;line-height:1.45;color:var(--tx2);}',
      '.bwd-done .bwd-when{font-size:.56rem;font-weight:700;letter-spacing:.03em;color:var(--tx2);margin-top:.4rem;opacity:.8;}',
      /* EXCAVATED stamp */
      '.bwd-stampmark{position:absolute;top:.5rem;right:.4rem;transform:rotate(8deg);font-family:"Oswald",var(--fh,var(--fm));font-weight:700;font-size:.62rem;letter-spacing:.12em;color:#f5c842;border:2px solid #f5c842;border-radius:5px;padding:.08rem .3rem;opacity:.9;pointer-events:none;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(245,200,66,.25);}',
      /* --- dig modal stage --- */
      '#bwDigWrap{color:var(--tx);}',
      '#bwDigHead{background:linear-gradient(135deg,#3a2c1e,#241a10);color:#f0e2c8;padding:.9rem 1.1rem .8rem;position:relative;}',
      '#bwDigHead .dh-eye{font-family:"Oswald",var(--fh,var(--fm));font-size:.62rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#f5c842;margin-bottom:.15rem;}',
      '#bwDigHead .dh-sub{font-size:.74rem;opacity:.85;line-height:1.4;}',
      '#bwDigHead .dh-x{position:absolute;top:.5rem;right:.5rem;width:44px;height:44px;min-width:44px;min-height:44px;border-radius:50%;background:rgba(0,0,0,.28);border:1px solid rgba(245,200,66,.25);color:#f0e2c8;font-size:1.05rem;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;}',
      '#bwDigStage{position:relative;height:232px;background:#241a10;overflow:hidden;touch-action:none;}',
      '#bwDigReveal{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:1rem;background:radial-gradient(130% 100% at 50% 40%,#2f2416,#1c140b);}',
      '#bwDigReveal .rl-loc{opacity:0;font-size:.72rem;font-weight:700;color:#e7d6b6;letter-spacing:.02em;margin-bottom:.5rem;}',
      '#bwDigReveal .rl-loc b{color:#f5c842;}',
      '#bwDigReveal .rl-icon{opacity:0;font-size:3.2rem;line-height:1;margin:.15rem 0 .55rem;filter:drop-shadow(0 3px 8px rgba(0,0,0,.5));}',
      '#bwDigReveal .rl-name{opacity:0;font-family:var(--fh,var(--fm));font-weight:800;font-size:1.15rem;color:#f7ecd2;letter-spacing:.01em;}',
      '#bwDigReveal.anim .rl-loc,#bwDigReveal.anim .rl-icon,#bwDigReveal.anim .rl-name{transition:opacity .45s ease;}',
      '#bwDigCanvas{position:absolute;inset:0;width:100%;height:100%;z-index:2;cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;}',
      '#bwDigCanvas:active{cursor:grabbing;}',
      '#bwDigCoach{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3rem;pointer-events:none;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7);}',
      '#bwDigCoach .c-ico{font-size:1.7rem;animation:bwdWiggle 1.4s ease-in-out infinite;}',
      '#bwDigCoach .c-lbl{font-size:.78rem;font-weight:800;letter-spacing:.03em;}',
      '@keyframes bwdWiggle{0%,100%{transform:translateX(-8px) rotate(-8deg);}50%{transform:translateX(8px) rotate(8deg);}}',
      /* reduced-motion tap target */
      '#bwDigTap{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.35rem;background:rgba(20,14,8,.35);border:none;color:#f7ecd2;cursor:pointer;font-family:var(--fm);}',
      '#bwDigTap .t-ico{font-size:2rem;}',
      '#bwDigTap .t-lbl{font-size:.82rem;font-weight:800;letter-spacing:.02em;}',
      '#bwDigFoot{display:flex;align-items:center;justify-content:space-between;gap:.6rem;padding:.7rem 1rem;background:#1c140b;border-top:1px solid rgba(245,200,66,.14);}',
      '#bwDigFoot .df-prog{font-size:.66rem;font-weight:700;letter-spacing:.02em;color:#c9b89a;}',
      '#bwDigFoot .df-reveal{background:rgba(245,200,66,.12);border:1px solid rgba(245,200,66,.35);color:#f5c842;border-radius:9px;padding:.5rem .9rem;font-size:.72rem;font-weight:800;cursor:pointer;font-family:var(--fm);min-height:40px;}',
      /* gold win pulse (faith register, NOT cyan) */
      '.bwd-goldpulse{position:fixed;inset:0;z-index:99999;pointer-events:none;background:radial-gradient(circle at 50% 45%,rgba(245,200,66,.42),rgba(245,200,66,.12) 45%,rgba(245,200,66,0) 70%);animation:bwdGold .7s ease-out forwards;}',
      '@keyframes bwdGold{0%{opacity:0;transform:scale(.6);}25%{opacity:1;}100%{opacity:0;transform:scale(1.35);}}',
      /* ---- Expedition Passport (scene-layer dark document — theme-independent
             by design, like Journey Home .fjp-card / the Well; no light pass) ---- */
      '.bwd-passport{background:#0a1628;border:1px solid rgba(245,200,66,.18);border-radius:16px;padding:1.1rem 1rem 1.3rem;color:#e7d6b6;}',
      '.bwp-head{text-align:center;margin-bottom:1rem;}',
      '.bwp-eye{font-family:"Oswald",var(--fh,var(--fm));font-weight:600;letter-spacing:.24em;font-size:.82rem;color:#f5c842;text-transform:uppercase;}',
      '.bwp-sub{font-family:"Newsreader",Georgia,serif;font-style:italic;font-size:.92rem;color:#aab2c9;margin-top:.25rem;}',
      '.bwp-prog{margin-top:.65rem;font-size:.74rem;font-weight:700;color:#cbb896;letter-spacing:.01em;}',
      '.bwp-prog .bwp-num{color:#f5c842;font-variant-numeric:tabular-nums;}',
      '.bwp-region{margin-top:1.05rem;}',
      '.bwp-rhead{display:flex;align-items:center;gap:.4rem;margin-bottom:.55rem;padding-bottom:.3rem;border-bottom:1px solid rgba(245,200,66,.14);}',
      '.bwp-rlabel{font-family:"Oswald",var(--fh,var(--fm));font-weight:600;letter-spacing:.14em;font-size:.68rem;color:#f5c842;text-transform:uppercase;flex:1;}',
      '.bwp-rcount{font-size:.62rem;font-weight:700;color:#8ea0bd;font-variant-numeric:tabular-nums;}',
      '.bwp-medal{font-size:1.05rem;line-height:1;}',
      '.bwp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem;}',
      '.bwp-slot{display:flex;flex-direction:column;align-items:center;gap:.32rem;text-align:center;}',
      '.bwp-ring{width:56px;height:56px;border-radius:50%;border:2px dashed rgba(245,200,66,.38);}',
      '.bwp-stamp{width:56px;height:56px;border-radius:50%;border:2.5px solid #f5c842;display:flex;align-items:center;justify-content:center;transform:rotate(var(--rot,0deg));box-shadow:0 2px 6px rgba(0,0,0,.55),inset 0 0 7px rgba(245,200,66,.3);}',
      '.bwp-init{font-family:"Oswald",var(--fh,var(--fm));font-weight:700;font-size:1.35rem;color:#f7ecd2;text-shadow:0 1px 2px rgba(0,0,0,.55);}',
      '.bwp-name{font-size:.56rem;font-weight:700;line-height:1.2;color:#7f8ba3;max-width:70px;}',
      '.bwp-name--on{color:#f5c842;}',
      '.bwp-pop{animation:bwpPop .3s ease-out;}',
      '@keyframes bwpPop{0%{transform:scale(0) rotate(var(--rot,0deg));}60%{transform:scale(1.2) rotate(var(--rot,0deg));}100%{transform:scale(1) rotate(var(--rot,0deg));}}',
      '.bwp-cert{text-align:center;margin:.2rem 0 1rem;}',
      '.bwp-cert canvas{width:100%;max-width:420px;height:auto;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.5);}',
      '.bwp-share{margin-top:.6rem;background:rgba(245,200,66,.14);border:1px solid rgba(245,200,66,.4);color:#f5c842;border-radius:10px;padding:.6rem 1.1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);min-height:44px;}',
      /* ---- light mode (interface layer) ---- */
      ':root.light .bwd-card{background:#fff;border-color:rgba(0,0,0,.09);}',
      ':root.light .bwd-buried{border-color:rgba(120,94,66,.5);}',   /* earth stays earthy in both themes by design */
      ':root.light .bwd-done .bwd-name{color:#0f172a;}',
      ':root.light .bwd-done .bwd-tag,:root.light .bwd-done .bwd-when{color:#475569;}',
      ':root.light .bwd-stampmark{color:#a16207;border-color:#a16207;box-shadow:inset 0 0 0 1px rgba(161,98,7,.2);}'
    ].join('\n');
    var st = document.createElement('style');
    st.id = 'bwd-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ── grid override ────────────────────────────────────────────
  function _activeFilter(){
    var el = document.querySelector('#bwDiscFilters .bw-chip.active');
    return (el && el.dataset && el.dataset.bwCert) ? el.dataset.bwCert : 'all';
  }

  function renderDiscoveries(){
    _injectStyles();
    var grid = document.getElementById('bwDiscGrid');
    var hdr  = document.getElementById('bwDiscHdr');
    if(!grid) return;
    var filter = _activeFilter();
    var list = _discoveries();
    if(filter !== 'all') list = list.filter(function(d){ return d && d.certainty === filter; });
    if(hdr){
      var label = (filter === 'all') ? 'All discoveries'
        : filter === 'confirmed' ? 'Confirmed'
        : filter === 'consistent' ? 'Consistent with Scripture' : 'Contested';
      hdr.textContent = label + ' (' + list.length + ')';
    }
    if(!list.length){
      grid.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--tx2);font-size:.78rem;font-style:italic;">No discoveries match this filter.</div>';
      return;
    }
    var store = _store();
    grid.innerHTML = list.map(function(d){
      var done = !!store.excavated[d.id];
      if(!done){
        return '<div class="bwd-card bwd-buried" role="button" tabindex="0" aria-label="Undiscovered — dig to excavate" '
          + 'onclick="openBwDiscovery(\''+d.id+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openBwDiscovery(\''+d.id+'\');}">'
          + '<div class="bwd-sed"></div>'
          + '<div class="bwd-undisc"><span class="u-ico">🔍</span><span class="u-lbl">Undiscovered</span></div>'
          + '</div>';
      }
      var c = _certColor(d.certainty);
      var when = store.excavated[d.id] && store.excavated[d.id].ts ? _fmtDate(store.excavated[d.id].ts) : '';
      return '<div class="bwd-card bwd-done" role="button" tabindex="0" aria-label="'+_esc(d.name)+'" '
        + 'onclick="openBwDiscovery(\''+d.id+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openBwDiscovery(\''+d.id+'\');}">'
        + '<div class="bwd-stampmark">Excavated</div>'
        + '<div class="bwd-body">'
        +   '<div class="bwd-name">'+_esc(d.name)+'</div>'
        +   '<div class="bwd-meta">'
        +     '<span class="bwd-cert" style="color:'+c+';border-color:'+c+';">'+_certGlyph(d.certainty)+' '+_esc(_certLabel(d.certainty))+'</span>'
        +     '<span class="bwd-cert" style="color:#f5c842;border-color:rgba(245,200,66,.4);">'+_esc(String(d.yearFound))+'</span>'
        +   '</div>'
        +   '<div class="bwd-tag">'+_esc(d.tagline||'')+'</div>'
        +   (when ? '<div class="bwd-when">⛏ Excavated '+_esc(when)+'</div>' : '')
        + '</div>'
        + '</div>';
    }).join('');
  }

  // ── dig scratch interaction ──────────────────────────────────
  var _canvas=null, _ctx=null, _cw=0, _ch=0, _drawing=false, _lastPt=null, _lastSample=0, _stageEl=null;

  function _paintSediment(){
    if(!_ctx) return;
    _ctx.globalCompositeOperation = 'source-over';
    var g = _ctx.createLinearGradient(0,0,_cw,_ch);
    g.addColorStop(0,'#6b5744'); g.addColorStop(.5,'#57432f'); g.addColorStop(1,'#463626');
    _ctx.fillStyle = g; _ctx.fillRect(0,0,_cw,_ch);
    var n = Math.min(1400, Math.round(_cw*_ch/700));
    for(var i=0;i<n;i++){
      _ctx.fillStyle = 'rgba(0,0,0,'+(Math.random()*0.13)+')';
      var x=Math.random()*_cw, y=Math.random()*_ch, r=Math.random()*2+0.4;
      _ctx.beginPath(); _ctx.arc(x,y,r,0,6.3); _ctx.fill();
    }
  }
  function _scratch(x,y){
    if(!_ctx) return;
    _ctx.globalCompositeOperation = 'destination-out';
    var brush = 24;
    if(_lastPt){
      _ctx.lineWidth = brush*2; _ctx.lineCap='round'; _ctx.strokeStyle='rgba(0,0,0,1)';
      _ctx.beginPath(); _ctx.moveTo(_lastPt.x,_lastPt.y); _ctx.lineTo(x,y); _ctx.stroke();
    }
    _ctx.beginPath(); _ctx.arc(x,y,brush,0,6.3); _ctx.fill();
    _lastPt = {x:x,y:y};
  }
  function _clearedPct(){
    if(!_ctx) return 0;
    var img; try { img = _ctx.getImageData(0,0,_cw,_ch); } catch(_e){ return 0; }
    var d = img.data, step = 6, tot=0, clr=0;
    for(var y=0;y<_ch;y+=step){
      for(var x=0;x<_cw;x+=step){
        tot++; if(d[(y*_cw+x)*4+3] < 40) clr++;
      }
    }
    return tot ? clr/tot : 0;
  }
  function _renderStage(n){
    var rl = document.getElementById('bwDigReveal'); if(!rl) return;
    var loc = rl.querySelector('.rl-loc'), ico = rl.querySelector('.rl-icon'), nm = rl.querySelector('.rl-name');
    if(loc) loc.style.opacity = n>=1 ? '1' : '0';
    if(ico) ico.style.opacity = n>=2 ? '1' : '0';
    if(nm)  nm.style.opacity  = n>=3 ? '1' : '0';
  }
  function _advanceTo(n){
    if(!_stageEl) return;
    var cur = +(_stageEl.dataset.stage||0);
    if(n <= cur) return;
    _stageEl.dataset.stage = n;
    _renderStage(n);
    if(n >= 3 && !_stageEl.dataset.done){
      _stageEl.dataset.done = '1';
      _excavate(_stageEl.dataset.disc);
    }
  }
  function _sample(){
    var pct = _clearedPct();
    var pctEl = document.getElementById('bwDigPct'); if(pctEl) pctEl.textContent = Math.round(pct*100) + '%';
    if(pct >= 0.95) _advanceTo(3);
    else if(pct >= 0.70) _advanceTo(2);
    else if(pct >= 0.40) _advanceTo(1);
  }
  function _hideCoach(){
    var c = document.getElementById('bwDigCoach'); if(c) c.style.display='none';
    var store = _store();
    if(!store.hintSeen){ store.hintSeen = true; _save(); }
  }
  function _evtPt(e){
    var r = _canvas.getBoundingClientRect();
    var cx = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    var cy = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    return { x:(cx - r.left) * (_cw / r.width), y:(cy - r.top) * (_ch / r.height) };
  }
  function _down(e){ e.preventDefault(); _drawing=true; _lastPt=null; _hideCoach(); var p=_evtPt(e); _scratch(p.x,p.y); }
  function _move(e){
    if(!_drawing) return;
    e.preventDefault();
    var p=_evtPt(e); _scratch(p.x,p.y);
    var now = Date.now();
    if(now - _lastSample > 150){ _lastSample = now; _sample(); }
  }
  function _up(){ if(!_drawing) return; _drawing=false; _lastPt=null; _sample(); }

  // ── open a buried discovery in Dig Mode ──────────────────────
  function _openDig(id){
    var d = _discById(id); if(!d){ _toast('Discovery not found'); return; }
    _injectStyles();
    var mount = document.getElementById('bwDigMount'); if(!mount) return;
    var store = _store();
    var reduced = _rm();
    var artifact = _artifactIcon(d);
    var loc = _esc(d.currentLocation || '');
    mount.innerHTML =
      '<div id="bwDigWrap">'
      + '<div id="bwDigHead">'
      +   '<button class="dh-x" aria-label="Close" onclick="bwDigClose()">✕</button>'
      +   '<div class="dh-eye">⛏ Excavation Site</div>'
      +   '<div class="dh-sub">'+(reduced ? 'Tap to uncover this discovery.' : 'Scratch away the sediment to uncover this discovery.')+'</div>'
      + '</div>'
      + '<div id="bwDigStage" data-disc="'+_esc(id)+'" data-stage="0">'
      +   '<div id="bwDigReveal"'+(reduced?'':' class="anim"')+'>'
      +     '<div class="rl-loc">Found <b>'+_esc(String(d.yearFound))+'</b>'+(loc?' · '+loc:'')+'</div>'
      +     '<div class="rl-icon">'+artifact+'</div>'
      +     '<div class="rl-name">'+_esc(d.name)+'</div>'
      +   '</div>'
      +   (reduced
          ? '<button id="bwDigTap" aria-label="Tap to uncover the next layer"><span class="t-ico">⛏️</span><span class="t-lbl">Tap to dig</span></button>'
          : '<canvas id="bwDigCanvas" aria-label="Scratch to dig" role="img"></canvas>'
            + '<div id="bwDigCoach"'+(store.hintSeen?' style="display:none;"':'')+'><span class="c-ico">👆</span><span class="c-lbl">Scratch to dig</span></div>')
      + '</div>'
      + '<div id="bwDigFoot">'
      +   '<span class="df-prog">Uncovered: <span id="bwDigPct">0%</span></span>'
      +   '<button class="df-reveal" onclick="bwDigRevealNow()">Reveal it</button>'
      + '</div>'
      + '</div>';

    if(typeof window.openModal === 'function') window.openModal('bwDigModal');
    _stageEl = document.getElementById('bwDigStage');

    if(reduced){
      _renderStage(0);
      var tap = document.getElementById('bwDigTap');
      if(tap) tap.addEventListener('click', function(){
        var cur = +(_stageEl.dataset.stage||0);
        _advanceTo(Math.min(3, cur+1));
      });
    } else {
      // Canvas sized after the modal is visible (needs layout).
      (window.requestAnimationFrame || function(f){ setTimeout(f,16); })(function(){
        _canvas = document.getElementById('bwDigCanvas'); if(!_canvas) return;
        var r = _canvas.getBoundingClientRect();
        _cw = Math.max(1, Math.round(r.width)); _ch = Math.max(1, Math.round(r.height));
        _canvas.width = _cw; _canvas.height = _ch;
        try { _ctx = _canvas.getContext('2d', {willReadFrequently:true}); } catch(_e){ _ctx = _canvas.getContext('2d'); }
        _paintSediment();
        _drawing=false; _lastPt=null; _lastSample=0;
        if(window.PointerEvent){
          // Pointer events cover mouse + touch in one path (no double-fire).
          _canvas.addEventListener('pointerdown', _down);
          _canvas.addEventListener('pointermove', _move);
          window.addEventListener('pointerup', _up); // same fn ref -> deduped, no leak across opens
        } else {
          // Fallback: mouse + touch. touch handlers passive:false + canvas-only
          // so a scratch never scrolls the page.
          _canvas.addEventListener('mousedown', _down);
          _canvas.addEventListener('mousemove', _move);
          window.addEventListener('mouseup', _up);
          _canvas.addEventListener('touchstart', _down, {passive:false});
          _canvas.addEventListener('touchmove', _move, {passive:false});
          _canvas.addEventListener('touchend', _up);
        }
      });
    }
  }

  // ── excavate ─────────────────────────────────────────────────
  var _origOpenBwDiscovery = null;

  function _goldPulse(){
    if(_rm()) return; // reduced motion: no full-screen flash (stamp sound + stamp visual remain)
    var el = document.createElement('div');
    el.className = 'bwd-goldpulse';
    document.body.appendChild(el);
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 720);
  }

  function _excavate(id){
    var s = _store();
    if(!s.excavated[id]) s.excavated[id] = { ts:new Date().toISOString() };
    _save();
    try { if(window.sfx && typeof window.sfx.stamp === 'function') window.sfx.stamp(); } catch(_e){}
    _goldPulse();
    if(typeof window.logActivity === 'function') window.logActivity('faith', 'Excavated: ' + ((_discById(id)||{}).name || id));
    // Build 2 — auto-stamp related sites onto the Expedition Passport.
    var _disc = _discById(id);
    ((_disc && _disc.relatedSiteIds) || []).forEach(function(sid){
      // CAESAREA GUARD — only stamp passport-valid site IDs. pilate-stone's
      // 'caesarea' is Caesarea MARITIMA, which is NOT one of the 32 passport
      // sites (the passport has 'caesarea-philippi', a different city). It is
      // intentionally left unmapped so it is not re-flagged as a bug later.
      // Adding Caesarea Maritima as a site is a future content decision, not
      // this build.
      if(PASSPORT_SITE_IDS.indexOf(sid) < 0) return;
      var st = _store();
      if(st.sites[sid]) return;                       // already visited
      st.sites[sid] = new Date().toISOString();
      _save();
      _afterSiteStamped(sid, 'discovery');
    });
    var reduced = _rm();
    // Let the 95% reveal (name) read for a beat, then hand off to the
    // full discovery modal (faith.js original) and restamp the grid.
    setTimeout(function(){
      bwDigClose();
      if(typeof _origOpenBwDiscovery === 'function') _origOpenBwDiscovery(id);
      renderDiscoveries();
    }, reduced ? 260 : 620);
  }

  // ── public globals ───────────────────────────────────────────
  function openBwDiscoveryPatched(id){
    if(_isExcavated(id)){
      if(typeof _origOpenBwDiscovery === 'function') _origOpenBwDiscovery(id);
      return;
    }
    _openDig(id);
  }
  function bwDigClose(){
    if(typeof window.closeModal === 'function') window.closeModal('bwDigModal');
    var mount = document.getElementById('bwDigMount'); if(mount) mount.innerHTML = ''; // drop canvas + listeners
    _canvas=null; _ctx=null; _stageEl=null; _drawing=false;
  }
  function bwDigRevealNow(){
    if(_stageEl && !_stageEl.dataset.done){ _renderStage(3); _advanceTo(3); }
  }

  // ═══════════════════════════════════════════════════════════
  // BUILD 2 — EXPEDITION PASSPORT
  // ═══════════════════════════════════════════════════════════
  var PASSPORT_REGIONS = [
    { id:'jerusalem',        label:'Jerusalem',                    sites:['jerusalem','temple-mount','garden-tomb','mount-of-olives','gethsemane','pool-of-bethesda','pool-of-siloam'] },
    { id:'judea-wilderness', label:'Judea & the Wilderness',       sites:['bethlehem','jericho','bethel','hebron','shechem','shiloh','qumran','masada','jordan-river'] },
    { id:'galilee-north',    label:'Galilee & the North',          sites:['nazareth','capernaum','sea-of-galilee','caesarea-philippi','mt-carmel','megiddo','tel-dan'] },
    { id:'sinai-exile',      label:'Sinai, Exile & the Near East', sites:['mt-sinai','babylon','damascus','antioch'] },
    { id:'apostolic',        label:'The Apostolic World',          sites:['ephesus','corinth','athens','patmos','rome'] }
  ];
  var PASSPORT_SITE_IDS = PASSPORT_REGIONS.reduce(function(a,r){ return a.concat(r.sites); }, []); // 32

  var _origBwSetView = null, _origMarkVisited = null, _lastStampedSite = null;

  function _sitesData(){ return (typeof window !== 'undefined' && window.BIBLICAL_SITES) ? window.BIBLICAL_SITES : []; }
  function _siteById(id){ return _sitesData().find(function(s){ return s && s.id === id; }) || null; }
  function _periods(){ return (typeof window !== 'undefined' && window.BIBLICAL_PERIODS) ? window.BIBLICAL_PERIODS : []; }
  function _periodColor(eraId){ var p = _periods().find(function(x){ return x && x.id === eraId; }); return (p && p.color) ? p.color : '#f5c842'; }
  function _siteEraColor(site){ var e = site && site.eras && site.eras[0]; return e ? _periodColor(e) : '#f5c842'; }
  function _hexA(hex, a){
    hex = String(hex||'#f5c842').replace('#',''); if(hex.length===3) hex = hex.replace(/./g,'$&$&');
    var n = parseInt(hex,16); if(isNaN(n)) return 'rgba(245,200,66,'+a+')';
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  }
  function _seededRot(id){ var h=0; for(var i=0;i<id.length;i++) h=(h*31+id.charCodeAt(i))>>>0; return (h % 11) - 5; } // -5..+5
  function _visitedCount(){ var s = _store().sites; return PASSPORT_SITE_IDS.filter(function(id){ return !!s[id]; }).length; }
  function _excavatedCount(){ return Object.keys(_store().excavated).length; }
  function _ensurePassportFonts(){
    if(document.getElementById('bwd-fonts')) return;
    var l = document.createElement('link'); l.id = 'bwd-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap';
    document.head.appendChild(l);
  }
  function _passportVisible(){ var pv = document.getElementById('bwPassportView'); return !!(pv && pv.style.display !== 'none'); }

  function _countUp(el, target, ms){
    if(!el) return;
    if(_rm() || ms <= 0){ el.textContent = String(target); return; }
    var start = null;
    (window.requestAnimationFrame || function(f){ setTimeout(function(){ f(Date.now()); }, 16); })(function loop(ts){
      if(start === null) start = ts;
      var t = Math.min(1, (ts - start) / ms);
      el.textContent = String(Math.round(t * target));
      if(t < 1) (window.requestAnimationFrame || function(f){ setTimeout(function(){ f(Date.now()); }, 16); })(loop);
    });
  }

  function renderBwPassport(){
    _injectStyles(); _ensurePassportFonts();
    var host = document.getElementById('bwPassportView'); if(!host) return;
    var s = _store();
    var visited = _visitedCount(), excav = _excavatedCount(), complete = visited >= 32, reduced = _rm();
    var html = '<div class="bwd-passport">'
      + '<div class="bwp-head">'
      +   '<div class="bwp-eye">Expedition Passport</div>'
      +   '<div class="bwp-sub">Every site you visit leaves its mark.</div>'
      +   '<div class="bwp-prog"><span class="bwp-num" data-count="'+visited+'">'+(reduced?visited:0)+'</span> of 32 sites visited · <span class="bwp-num" data-count="'+excav+'">'+(reduced?excav:0)+'</span> discoveries excavated</div>'
      + '</div>';
    if(complete) html += '<div class="bwp-cert"><canvas id="bwpCertCanvas" width="640" height="404" aria-label="Master Archaeologist certificate"></canvas><button class="bwp-share" onclick="bwPassportShareCert()">📤 Share certificate</button></div>';
    PASSPORT_REGIONS.forEach(function(r){
      var have = r.sites.filter(function(id){ return !!s.sites[id]; }).length;
      var regDone = have === r.sites.length;
      html += '<div class="bwp-region">'
        + '<div class="bwp-rhead">'
        +   (regDone ? '<span class="bwp-medal" title="Region complete">🥇</span>' : '')
        +   '<span class="bwp-rlabel">'+_esc(r.label)+'</span>'
        +   '<span class="bwp-rcount">'+have+'/'+r.sites.length+'</span>'
        + '</div><div class="bwp-grid">';
      r.sites.forEach(function(id){
        var site = _siteById(id), nm = site ? site.name : id, vis = !!s.sites[id];
        if(vis){
          var grad = 'radial-gradient(circle at 50% 40%,'+_hexA(_siteEraColor(site),0.34)+',rgba(10,22,40,.15))';
          var pop = (id === _lastStampedSite && !reduced) ? ' bwp-pop' : '';
          html += '<div class="bwp-slot" data-site="'+_esc(id)+'">'
            + '<div class="bwp-stamp'+pop+'" style="--rot:'+_seededRot(id)+'deg;background:'+grad+';"><span class="bwp-init">'+_esc((nm||'?').charAt(0).toUpperCase())+'</span></div>'
            + '<div class="bwp-name bwp-name--on">'+_esc(nm)+'</div>'
            + '</div>';
        } else {
          html += '<div class="bwp-slot" data-site="'+_esc(id)+'"><div class="bwp-ring"></div><div class="bwp-name">'+_esc(nm)+'</div></div>';
        }
      });
      html += '</div></div>';
    });
    html += '</div>';
    host.innerHTML = html;
    _lastStampedSite = null;
    Array.prototype.forEach.call(host.querySelectorAll('.bwp-num'), function(el){ _countUp(el, +el.dataset.count || 0, 650); });
    if(complete) _paintCert();
  }

  function _paintCert(){
    var cv = document.getElementById('bwpCertCanvas'); if(!cv) return;
    function draw(){
      var c = document.getElementById('bwpCertCanvas'); if(!c) return;
      var ctx = c.getContext('2d'), W = c.width, H = c.height;
      ctx.fillStyle = '#0a1628'; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle = '#f5c842'; ctx.lineWidth = 3; ctx.strokeRect(14,14,W-28,H-28);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(245,200,66,.4)'; ctx.strokeRect(22,22,W-44,H-44);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f5c842'; ctx.font = '600 15px Oswald, sans-serif';
      ctx.fillText('YOURLIFE CC · BIBLICAL ARCHAEOLOGY', W/2, 60);
      ctx.beginPath(); ctx.arc(W/2, 148, 42, 0, 6.3); ctx.fillStyle = 'rgba(245,200,66,.12)'; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#f5c842'; ctx.stroke();
      ctx.font = '34px serif'; ctx.fillText('🏆', W/2, 160);
      ctx.fillStyle = '#f7ecd2'; ctx.font = '700 40px Oswald, sans-serif';
      ctx.fillText('MASTER ARCHAEOLOGIST', W/2, 234);
      ctx.fillStyle = '#cbb896'; ctx.font = 'italic 16px Newsreader, Georgia, serif';
      ctx.fillText('All 32 biblical sites visited · all discoveries excavated', W/2, 266);
      var nm = (window.D && (window.D.name || window.D.childName)) ? String(window.D.name || window.D.childName) : '';
      if(nm){ ctx.fillStyle = '#f5c842'; ctx.font = '600 22px Oswald, sans-serif'; ctx.fillText(nm, W/2, 310); }
      var dt = ''; try { dt = new Date().toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}); } catch(_e){}
      ctx.fillStyle = '#8ea0bd'; ctx.font = '500 13px Oswald, sans-serif'; ctx.fillText('Awarded ' + dt, W/2, 352);
      c.dataset.rendered = '1';
    }
    draw();
    // Redraw once fonts are ready so Oswald/Newsreader replace the fallback.
    try { if(document.fonts && document.fonts.load){ document.fonts.load('700 40px Oswald').then(draw).catch(function(){}); } } catch(_e){}
  }
  function bwPassportShareCert(){
    var cv = document.getElementById('bwpCertCanvas'); if(!cv || !cv.toBlob){ _toast('Certificate ready'); return; }
    cv.toBlob(function(blob){
      if(!blob) return;
      var file = window.File ? new File([blob], 'master-archaeologist.png', {type:'image/png'}) : null;
      if(navigator.share && file && navigator.canShare && navigator.canShare({files:[file]})){
        navigator.share({ files:[file], title:'Master Archaeologist', text:'I visited all 32 biblical sites in YourLife CC!' }).catch(function(){});
      } else {
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = 'master-archaeologist.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
      }
    }, 'image/png');
  }

  // Fired after a passport site is newly stamped (from a visit or a dig).
  function _afterSiteStamped(id, source){
    _lastStampedSite = id;
    try { if(window.sfx && typeof window.sfx.stamp === 'function') window.sfx.stamp(); } catch(_e){}
    var site = _siteById(id), nm = site ? site.name : id;
    _toast(source === 'discovery' ? ('📔 ' + nm + ' stamped from your discovery!') : ('📔 Stamped! ' + _visitedCount() + ' of 32 sites'));
    if(_passportVisible()) renderBwPassport();
    _checkRegion(id);
    _maybeMaster();
  }
  function _checkRegion(siteId){
    var region = null;
    for(var i=0;i<PASSPORT_REGIONS.length;i++){ if(PASSPORT_REGIONS[i].sites.indexOf(siteId) >= 0){ region = PASSPORT_REGIONS[i]; break; } }
    if(!region) return;
    var s = _store();
    if(s.regionBadges[region.id]) return;
    if(region.sites.every(function(x){ return !!s.sites[x]; })){
      s.regionBadges[region.id] = { ts:new Date().toISOString() };
      _save();
      _goldPulse();                                              // win-lite: gold pulse …
      try { if(window.sfx && typeof window.sfx.settle === 'function') window.sfx.settle(); } catch(_e){} // … + chime
      _toast('🥇 ' + region.label + ' complete!');
      if(_passportVisible()) renderBwPassport();
    }
  }
  function _maybeMaster(){
    if(_visitedCount() < 32) return;
    var s = _store();
    if(!s.badges) s.badges = {};
    if(s.badges.__master) return;                                // once
    s.badges.__master = new Date().toISOString();
    _save();
    if(typeof window.megaConfetti === 'function'){ try { window.megaConfetti(); } catch(_e){} }
    _goldPulse();
    _toast('🏆 Master Archaeologist — all 32 sites!');
    if(_passportVisible()) renderBwPassport();
  }

  // bwSetView override — add the 'passport' view; delegate the rest.
  function bwSetViewPatched(view, btn){
    var pv = document.getElementById('bwPassportView');
    if(view === 'passport'){
      Array.prototype.forEach.call(document.querySelectorAll('#bf-bibleworld .bw-vtab'), function(b){
        var on = (b === btn);
        b.classList.toggle('active', on);
        b.style.background = on ? 'var(--cd-banner)' : 'rgba(255,255,255,.04)';
        b.style.color = on ? 'var(--cd-banner-text)' : 'var(--tx)';
        b.style.border = on ? 'none' : '1px solid rgba(255,255,255,.1)';
        b.style.fontWeight = on ? '800' : '700';
      });
      ['bwSitesView','bwDiscoveriesView','bwPilgrimageView'].forEach(function(idv){ var e = document.getElementById(idv); if(e) e.style.display = 'none'; });
      if(pv) pv.style.display = '';
      renderBwPassport();
    } else {
      if(pv) pv.style.display = 'none';
      if(typeof _origBwSetView === 'function') _origBwSetView(view, btn);
    }
  }
  // _bwMarkVisited wrap — catch direct site visits (map / openBwSite) to
  // stamp the passport + fire region/master checks. faith.js still owns the
  // actual sites{} write; we only detect newness and react.
  function markVisitedPatched(kind, id){
    var wasNew = (kind === 'site') && !_store().sites[id];
    if(typeof _origMarkVisited === 'function') _origMarkVisited(kind, id);
    if(wasNew && PASSPORT_SITE_IDS.indexOf(id) >= 0) _afterSiteStamped(id, 'visit');
  }

  // ── install (after faith.js is on window) ────────────────────
  function _install(){
    _injectStyles();
    _origOpenBwDiscovery = window.openBwDiscovery;   // capture faith.js original
    window.openBwDiscovery   = openBwDiscoveryPatched;
    window.bwRenderDiscoveries = renderDiscoveries;   // bwSetView('discoveries') & bwDiscFilter call the global
    window.bwDigClose        = bwDigClose;
    window.bwDigRevealNow    = bwDigRevealNow;
    // Build 2 wiring
    _origBwSetView   = window.bwSetView;
    window.bwSetView = bwSetViewPatched;
    _origMarkVisited     = window._bwMarkVisited;
    window._bwMarkVisited = markVisitedPatched;
    window.renderBwPassport    = renderBwPassport;
    window.bwPassportShareCert = bwPassportShareCert;
    // If the discoveries view is already open (unlikely at boot), refresh it.
    var dv = document.getElementById('bwDiscoveriesView');
    if(dv && dv.style.display !== 'none') renderDiscoveries();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', _install);
  } else {
    _install();
  }
})();
