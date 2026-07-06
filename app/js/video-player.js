/* =============================================================
   video-player.js — full-screen YouTube player overlay

   Standalone. Both faith-videos.js (contextual station cards) and
   video-archive.js (archive surface) call window.openVideoPlayer()
   on a card tap instead of embedding an inline iframe.

   Scene layer — hardcoded night hex, NO theme inversion (documented
   scene-layer exemption in docs/design-system.md). Same register as
   the sleep-stories night player: wakeLock while playing, Esc/back to
   close, controls that auto-hide after 3s (tap to restore) — except
   under prefers-reduced-motion, where the controls never fade.

   Public API (window):
     openVideoPlayer(videoId, title, source)
     closeVideoPlayer()
============================================================= */
(function(){
  'use strict';

  var _cur = null;         // { id, title, source }
  var _wakeLock = null;
  var _escH = null, _fsH = null, _visH = null, _popH = null;
  var _hideTimer = null;
  var _pushed = false;

  function _esc(s){
    if(s==null) return '';
    if(typeof window.escapeHtml==='function') return window.escapeHtml(String(s));
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function _reduced(){
    try{ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(_e){ return false; }
  }
  function _saveKey(id){ return 'yt:'+id; }
  function _isSaved(id){
    return (typeof D!=='undefined' && D && Array.isArray(D.savedVideos) && D.savedVideos.indexOf(_saveKey(id))>=0);
  }
  function _toast(msg){
    try{
      if(typeof window.toast==='function') return window.toast(msg);
      if(typeof window._toast==='function') return window._toast(msg);
    }catch(_e){}
  }

  // ── open ─────────────────────────────────────────────────
  function openVideoPlayer(videoId, title, source){
    if(!videoId || typeof document==='undefined') return;
    closeVideoPlayer(true); // single instance; skip history pop
    _injectCss();
    _cur = { id:videoId, title:title||'', source:source||'' };

    var ov = document.createElement('div');
    ov.id = 'videoPlayerOverlay';
    ov.className = 'vp-ov';
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label', (title||'Video') + ' player');
    ov.innerHTML = _shellHtml(_cur);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';

    // Controls — wired, not inline (titles can carry quotes/apostrophes).
    var back = ov.querySelector('[data-vp="back"]');
    if(back) back.addEventListener('click', function(){ closeVideoPlayer(); });
    var fs = ov.querySelector('[data-vp="fs"]');
    if(fs) fs.addEventListener('click', _toggleFs);
    var bm = ov.querySelector('[data-vp="bm"]');
    if(bm) bm.addEventListener('click', function(){ _toggleBookmark(bm); });

    // Tap the stage (not a control) restores the auto-hidden top bar.
    var stage = ov.querySelector('.vp-stage');
    if(stage) stage.addEventListener('click', function(e){
      if(e.target.closest('[data-vp]')) return;
      _showTop(); _armAutoHide();
    });

    // Esc closes.
    _escH = function(e){ if(e.key==='Escape' || e.key==='Esc') closeVideoPlayer(); };
    document.addEventListener('keydown', _escH);

    // Keep our FS button glyph in sync with the browser (Esc-exit etc.).
    _fsH = _syncFsBtn;
    document.addEventListener('fullscreenchange', _fsH);
    document.addEventListener('webkitfullscreenchange', _fsH);

    // Wake locks drop when the tab hides — re-acquire on return.
    _visH = function(){ if(document.visibilityState==='visible') _requestWakeLock(); };
    document.addEventListener('visibilitychange', _visH);

    // Browser back closes the player instead of leaving the app.
    try{ history.pushState({ ylccVP:1 }, ''); _pushed = true; }catch(_e){}
    _popH = function(){ closeVideoPlayer(true); };
    window.addEventListener('popstate', _popH);

    _requestWakeLock();
    _armAutoHide();
  }

  function _shellHtml(v){
    var watch = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id);
    var src   = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    var saved = _isSaved(v.id);
    return ''+
      '<div class="vp-stage">'+
        '<div class="vp-frame-wrap">'+
          '<iframe class="vp-frame" src="'+src+'" title="'+_esc(v.title||'Video')+'" '+
            'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>'+
        '</div>'+
        '<div class="vp-top" data-vp-top>'+
          '<button type="button" class="vp-btn vp-back" data-vp="back" aria-label="Back">&larr;</button>'+
          '<div class="vp-titlewrap">'+
            '<div class="vp-title">'+_esc(v.title||'')+'</div>'+
            (v.source?('<div class="vp-source">'+_esc(v.source)+'</div>'):'')+
          '</div>'+
          '<button type="button" class="vp-btn vp-fs" data-vp="fs" aria-label="Fullscreen">&#9974;</button>'+
        '</div>'+
      '</div>'+
      '<div class="vp-below">'+
        '<a class="vp-yt" href="'+watch+'" target="_blank" rel="noopener noreferrer">Open in YouTube &rarr;</a>'+
        '<button type="button" class="vp-bm" data-vp="bm" aria-pressed="'+(saved?'true':'false')+'" '+
          'aria-label="'+(saved?'Saved to Watch later':'Watch later')+'">'+(saved?'★ Saved':'☆ Save')+'</button>'+
      '</div>';
  }

  // ── close ────────────────────────────────────────────────
  function closeVideoPlayer(fromPop){
    if(_hideTimer){ clearTimeout(_hideTimer); _hideTimer = null; }
    _releaseWakeLock();
    if(_escH){ document.removeEventListener('keydown', _escH); _escH = null; }
    if(_fsH){ document.removeEventListener('fullscreenchange', _fsH); document.removeEventListener('webkitfullscreenchange', _fsH); _fsH = null; }
    if(_visH){ document.removeEventListener('visibilitychange', _visH); _visH = null; }
    if(_popH){ window.removeEventListener('popstate', _popH); _popH = null; }
    // Exit native fullscreen if we're in it.
    try{
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if(fsEl){ var exit = document.exitFullscreen || document.webkitExitFullscreen; if(exit) exit.call(document); }
    }catch(_e){}
    var ov = document.getElementById('videoPlayerOverlay');
    if(ov && ov.parentNode) ov.parentNode.removeChild(ov); // iframe removed → playback stops
    document.body.style.overflow = '';
    _cur = null;
    // Pop our history entry unless this close WAS the pop.
    if(_pushed && !fromPop){
      _pushed = false;
      try{ if(history.state && history.state.ylccVP) history.back(); }catch(_e){}
    } else if(fromPop){
      _pushed = false;
    }
  }

  // ── controls ─────────────────────────────────────────────
  function _top(){ var ov=document.getElementById('videoPlayerOverlay'); return ov?ov.querySelector('[data-vp-top]'):null; }
  function _showTop(){ var t=_top(); if(t) t.classList.remove('vp-hidden'); }
  function _hideTop(){ var t=_top(); if(t) t.classList.add('vp-hidden'); }
  function _armAutoHide(){
    if(_reduced()) return;            // reduced motion: controls stay put
    if(_hideTimer) clearTimeout(_hideTimer);
    _hideTimer = setTimeout(_hideTop, 3000);
  }

  function _toggleFs(){
    var ov = document.getElementById('videoPlayerOverlay');
    if(!ov) return;
    var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if(fsEl){
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      if(exit){ try{ exit.call(document); }catch(_e){} }
    } else {
      var req = ov.requestFullscreen || ov.webkitRequestFullscreen;  // Safari-guarded
      if(req){ try{ Promise.resolve(req.call(ov)).catch(function(){}); }catch(_e){} }
    }
  }
  function _syncFsBtn(){
    var ov = document.getElementById('videoPlayerOverlay'); if(!ov) return;
    var btn = ov.querySelector('[data-vp="fs"]'); if(!btn) return;
    var inFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    btn.innerHTML = inFs ? '⤢' : '⛶'; // ⤢ / ⛶
    btn.setAttribute('aria-label', inFs ? 'Exit fullscreen' : 'Fullscreen');
  }

  function _toggleBookmark(btn){
    if(!_cur || typeof D==='undefined' || !D) return;
    if(!Array.isArray(D.savedVideos)) D.savedVideos = [];
    var k = _saveKey(_cur.id), i = D.savedVideos.indexOf(k), saved;
    if(i>=0){ D.savedVideos.splice(i,1); saved=false; }
    else { D.savedVideos.push(k); saved=true; }
    if(typeof save==='function'){ try{ save(); }catch(_e){} }
    if(btn){
      btn.innerHTML = saved ? '★ Saved' : '☆ Save';
      btn.setAttribute('aria-pressed', saved?'true':'false');
      btn.setAttribute('aria-label', saved?'Saved to Watch later':'Watch later');
    }
    _toast(saved?'Saved to Watch later ★':'Removed from Watch later');
  }

  // ── wake lock (same pattern as sleep stories) ────────────
  function _requestWakeLock(){
    try{ if('wakeLock' in navigator && navigator.wakeLock.request){
      navigator.wakeLock.request('screen').then(function(wl){ _wakeLock = wl; }).catch(function(){});
    }}catch(_e){}
  }
  function _releaseWakeLock(){
    try{ if(_wakeLock){ _wakeLock.release(); _wakeLock = null; } }catch(_e){}
  }

  // ── CSS (inject once) — scene layer, hardcoded night hex ─
  var _cssDone = false;
  function _injectCss(){
    if(_cssDone || typeof document==='undefined') return;
    _cssDone = true;
    var css=
    /* z-index must clear ALL app chrome — the top nav (#topQuickBtns 99990),
       modals (99998/99999), Google Translate (999999). 12000 buried the
       player under the nav bars, so it read as "not appearing". 9999998 sits
       above every chrome layer, just below the subscription-block gate. */
    '.vp-ov{position:fixed;inset:0;z-index:9999998;display:flex;flex-direction:column;background:#05060c;}'+
    '.vp-stage{position:relative;flex:1;display:flex;align-items:center;justify-content:center;min-height:0;background:#05060c;}'+
    '.vp-frame-wrap{width:min(100%,960px);aspect-ratio:16/9;max-height:100%;background:#000;}'+
    '.vp-frame{width:100%;height:100%;border:0;display:block;background:#000;}'+
    '.vp-top{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;gap:.7rem;padding:.7rem .9rem;'+
      'background:linear-gradient(180deg,rgba(5,6,12,.82) 0%,rgba(5,6,12,0) 100%);transition:opacity .3s ease;}'+
    '.vp-top.vp-hidden{opacity:0;pointer-events:none;}'+
    '.vp-btn{flex-shrink:0;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.18);'+
      'background:rgba(255,255,255,.08);color:#f4f6fb;font-size:1.25rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}'+
    '.vp-btn:hover{background:rgba(255,255,255,.16);}'+
    '.vp-btn:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    '.vp-titlewrap{flex:1;min-width:0;text-align:center;}'+
    '.vp-title{font-weight:700;font-size:.92rem;color:#f4f6fb;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'+
    '.vp-source{font-family:\'Oswald\',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.12em;font-size:.6rem;color:#fbbf24;margin-top:.12rem;}'+
    '.vp-below{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:.8rem;'+
      'padding:.75rem 1rem;background:#080a13;border-top:1px solid rgba(255,255,255,.08);}'+
    '.vp-yt{font-weight:600;font-size:.82rem;color:#8ab4f8;text-decoration:none;}'+
    '.vp-yt:hover{text-decoration:underline;}'+
    '.vp-bm{background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.4);color:#fbbf24;'+
      'font-weight:700;font-size:.8rem;border-radius:999px;padding:.4rem .8rem;cursor:pointer;}'+
    '.vp-bm:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    '@media (prefers-reduced-motion: reduce){.vp-top{transition:none;}.vp-top.vp-hidden{opacity:1;pointer-events:auto;}}';
    var st = document.createElement('style');
    st.id = 'vp-css';
    st.textContent = css;
    (document.head||document.documentElement).appendChild(st);
  }

  window.openVideoPlayer  = openVideoPlayer;
  window.closeVideoPlayer = closeVideoPlayer;
})();
