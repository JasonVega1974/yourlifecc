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

  // ── install (after faith.js is on window) ────────────────────
  function _install(){
    _injectStyles();
    _origOpenBwDiscovery = window.openBwDiscovery;   // capture faith.js original
    window.openBwDiscovery   = openBwDiscoveryPatched;
    window.bwRenderDiscoveries = renderDiscoveries;   // bwSetView('discoveries') & bwDiscFilter call the global
    window.bwDigClose        = bwDigClose;
    window.bwDigRevealNow    = bwDigRevealNow;
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
