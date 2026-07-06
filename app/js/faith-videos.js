/* =============================================================
   faith-videos.js — contextual video renderer
   Reads window.FAITH_VIDEOS (app/js/data/faith-videos.js).

   Contextual anchors, not a library. A "video card" is a tap-to-play
   poster: the YouTube thumbnail + a CSS play button show first, and the
   iframe is created ONLY on tap (lazy — never autoplays on page load).

   Public API (all on window):
     getVideosForPlacement(placementKey)  -> Array
     renderVideoCard(videoId, hostEl)     -> render one card into hostEl
     videoSectionHtml(placementKey)       -> eyebrow + cards HTML string
     fvInject(placementKey, panelId, pos) -> idempotent DOM injection
     fvPlay(videoId, posterEl)            -> swap poster -> iframe
     fvBookmark(videoId, btnEl)           -> toggle D.savedVideos

   Hosts:
     - walk-path.js builds one innerHTML string, so it concatenates
       videoSectionHtml('station:'+id) before the CTA.
     - faith.js bfTab injects into the stable bf-<tab> panel via fvInject.
============================================================= */
(function(){
  'use strict';

  function _list(){
    return (typeof window!=='undefined' && Array.isArray(window.FAITH_VIDEOS)) ? window.FAITH_VIDEOS : [];
  }
  function _byId(id){
    var l=_list();
    for(var i=0;i<l.length;i++){ if(l[i] && l[i].id===id) return l[i]; }
    return null;
  }
  function _esc(s){
    if(s==null) return '';
    if(typeof window.escapeHtml==='function') return window.escapeHtml(String(s));
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function _isSaved(id){
    return (typeof D!=='undefined' && D && Array.isArray(D.savedVideos) && D.savedVideos.indexOf(id)>=0);
  }
  function _toast(msg){
    try{
      if(typeof window.toast==='function') return window.toast(msg);
      if(typeof window._toast==='function') return window._toast(msg);
    }catch(_e){}
  }

  // ── placement query ──────────────────────────────────────
  function getVideosForPlacement(placementKey){
    if(!placementKey) return [];
    return _list().filter(function(v){
      return v && Array.isArray(v.placement) && v.placement.indexOf(placementKey)>=0;
    });
  }

  // ── one card (tap-to-play poster) ────────────────────────
  function _cardHtml(v){
    if(!v) return '';
    var saved=_isSaved(v.id);
    var thumb='https://img.youtube.com/vi/'+encodeURIComponent(v.youtubeId)+'/mqdefault.jpg';
    var sub=_esc(v.source||'')+(v.description?(' · '+_esc(v.description)):'');
    return ''+
      '<div class="fv-card" data-fv-id="'+_esc(v.id)+'">'+
        '<button type="button" class="fv-poster" onclick="fvPlay(\''+_esc(v.id)+'\', this)" aria-label="Play '+_esc(v.title||'video')+'">'+
          '<img class="fv-thumb" src="'+thumb+'" alt="" loading="lazy" decoding="async">'+
          '<span class="fv-play" aria-hidden="true"><span class="fv-play-tri"></span></span>'+
          (v.duration?('<span class="fv-dur">'+_esc(v.duration)+'</span>'):'')+
        '</button>'+
        '<div class="fv-meta">'+
          '<div class="fv-meta-txt">'+
            '<div class="fv-title">'+_esc(v.title||'')+'</div>'+
            '<div class="fv-sub">'+sub+'</div>'+
          '</div>'+
          '<button type="button" class="fv-bm" onclick="fvBookmark(\''+_esc(v.id)+'\', this)" '+
            'aria-pressed="'+(saved?'true':'false')+'" aria-label="'+(saved?'Saved to Watch later':'Watch later')+'">'+
            (saved?'★':'☆')+
          '</button>'+
        '</div>'+
      '</div>';
  }

  // ── section (eyebrow + all cards for a placement) ────────
  function _sectionHtml(placementKey){
    var vids=getVideosForPlacement(placementKey);
    if(!vids.length) return '';
    var h='<div class="fv-section" data-fv-key="'+_esc(placementKey)+'">'+
          '<div class="fv-eyebrow">📺 Watch</div><div class="fv-grid">';
    for(var i=0;i<vids.length;i++){ h+=_cardHtml(vids[i]); }
    h+='</div></div>';
    return h;
  }
  function videoSectionHtml(placementKey){
    _injectCss();
    return _sectionHtml(placementKey);
  }

  // ── render one card into a host element (spec API) ───────
  function renderVideoCard(videoId, hostEl){
    _injectCss();
    var host = (typeof hostEl==='string') ? document.getElementById(hostEl) : hostEl;
    var v=_byId(videoId);
    if(!host || !v) return;
    host.innerHTML=_cardHtml(v);
  }

  // ── idempotent injection into a faith panel container ────
  function fvInject(placementKey, panelId, pos){
    var panel=document.getElementById(panelId);
    if(!panel) return;
    // Remove any section this key injected before (re-render safe).
    var prior=panel.querySelector('.fv-section[data-fv-key="'+placementKey+'"]');
    if(prior && prior.parentNode) prior.parentNode.removeChild(prior);
    var vids=getVideosForPlacement(placementKey);
    if(!vids.length) return;
    _injectCss();
    var wrap=document.createElement('div');
    wrap.innerHTML=_sectionHtml(placementKey);
    var node=wrap.firstChild;
    if(!node) return;
    if(pos==='prepend' && panel.firstChild) panel.insertBefore(node, panel.firstChild);
    else panel.appendChild(node);
  }

  // ── tap → full-screen player (video-player.js) ───────────
  function fvPlay(videoId, posterEl){
    var v=_byId(videoId);
    if(!v) return;
    // Preferred: hand off to the full-screen player overlay.
    if(typeof window.openVideoPlayer==='function'){
      window.openVideoPlayer(v.youtubeId, v.title, v.source);
      return;
    }
    // Fallback (player module absent): the original inline embed.
    if(!posterEl || !posterEl.parentNode) return;
    var ifr=document.createElement('iframe');
    ifr.className='fv-iframe';
    // youtube-nocookie: privacy-first (no tracking cookie until play) —
    // CSP frame-src already allows it. autoplay is fine: this only runs
    // on a user tap, never on load. rel=0 keeps suggestions in-channel.
    ifr.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(v.youtubeId)+'?autoplay=1&rel=0&modestbranding=1';
    ifr.title=v.title||'Video';
    ifr.setAttribute('allow','autoplay; encrypted-media; picture-in-picture; fullscreen');
    ifr.setAttribute('allowfullscreen','');
    ifr.setAttribute('loading','lazy');
    posterEl.parentNode.replaceChild(ifr, posterEl);
  }

  // ── watch-later bookmark ─────────────────────────────────
  function fvBookmark(videoId, btnEl){
    if(typeof D==='undefined' || !D) return;
    if(!Array.isArray(D.savedVideos)) D.savedVideos=[];
    var i=D.savedVideos.indexOf(videoId), saved;
    if(i>=0){ D.savedVideos.splice(i,1); saved=false; }
    else { D.savedVideos.push(videoId); saved=true; }
    if(typeof save==='function'){ try{ save(); }catch(_e){} }
    if(btnEl){
      btnEl.textContent=saved?'★':'☆';
      btnEl.setAttribute('aria-pressed', saved?'true':'false');
      btnEl.setAttribute('aria-label', saved?'Saved to Watch later':'Watch later');
    }
    _toast(saved?'Saved to Watch later ★':'Removed from Watch later');
  }

  // ── CSS (inject once) ────────────────────────────────────
  var _cssDone=false;
  function _injectCss(){
    if(_cssDone || typeof document==='undefined') return;
    _cssDone=true;
    var css=
    '.fv-section{margin:1.15rem 0 .3rem;}'+
    /* Full width on mobile, 2-col grid on desktop — matches the app card standard. */
    '.fv-grid{display:grid;grid-template-columns:1fr;gap:.75rem;}'+
    '@media(min-width:720px){.fv-grid{grid-template-columns:repeat(2,1fr);}}'+
    '.fv-eyebrow{font-family:\'Oswald\',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.15em;font-size:.7rem;font-weight:600;color:#fbbf24;margin-bottom:.55rem;}'+
    '.fv-card{background:var(--card-bg,rgba(255,255,255,.03));border:1px solid rgba(251,191,36,.18);border-radius:16px;overflow:hidden;}'+
    '.fv-poster{position:relative;display:block;width:100%;padding:0;border:0;margin:0;aspect-ratio:16/9;min-height:160px;cursor:pointer;background:#0a0d1a;overflow:hidden;}'+
    '@media(min-width:720px){.fv-poster{min-height:200px;}}'+
    '.fv-thumb{width:100%;height:100%;object-fit:cover;display:block;}'+
    '.fv-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;}'+
    '.fv-play-tri{width:62px;height:62px;border-radius:50%;background:rgba(10,13,26,.6);border:2px solid rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;transition:transform .18s ease, background .18s ease;}'+
    '.fv-play-tri::after{content:\'\';display:block;width:0;height:0;border-style:solid;border-width:10px 0 10px 17px;border-color:transparent transparent transparent #fff;margin-left:4px;}'+
    '.fv-poster:hover .fv-play-tri,.fv-poster:focus-visible .fv-play-tri{transform:scale(1.08);background:rgba(159,18,57,.92);}'+
    '.fv-dur{position:absolute;bottom:.5rem;right:.5rem;background:rgba(10,13,26,.82);color:#fff;font-size:.66rem;font-weight:600;padding:.13rem .42rem;border-radius:6px;letter-spacing:.02em;}'+
    '.fv-meta{display:flex;align-items:flex-start;gap:.6rem;padding:.65rem .8rem .78rem;}'+
    '.fv-meta-txt{flex:1;min-width:0;}'+
    '.fv-title{font-weight:700;font-size:.92rem;color:#e9ecf6;line-height:1.25;}'+
    '.fv-sub{font-size:.72rem;color:rgba(233,236,246,.6);margin-top:.22rem;line-height:1.35;}'+
    '.fv-bm{flex-shrink:0;background:none;border:0;cursor:pointer;font-size:1.2rem;line-height:1;color:#fbbf24;padding:.1rem .15rem;border-radius:8px;}'+
    '.fv-bm:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    '.fv-iframe{display:block;width:100%;aspect-ratio:16/9;border:0;background:#000;}'+
    '@media (prefers-reduced-motion: reduce){.fv-play-tri{transition:none;}.fv-poster:hover .fv-play-tri,.fv-poster:focus-visible .fv-play-tri{transform:none;}}'+
    ':root.light .fv-card{background:#ffffff;border-color:rgba(146,64,14,.22);box-shadow:0 1px 3px rgba(26,18,51,.06);}'+
    ':root.light .fv-eyebrow{color:#92400e;}'+
    ':root.light .fv-title{color:#1a1233;}'+
    ':root.light .fv-sub{color:#57534e;}'+
    ':root.light .fv-bm{color:#b45309;}'+
    ':root.light .fv-poster{background:#e7e2d6;}';
    var st=document.createElement('style');
    st.id='fv-css';
    st.textContent=css;
    (document.head||document.documentElement).appendChild(st);
  }

  // ── expose ───────────────────────────────────────────────
  window.getVideosForPlacement = getVideosForPlacement;
  window.renderVideoCard       = renderVideoCard;
  window.videoSectionHtml      = videoSectionHtml;
  window.fvInject              = fvInject;
  window.fvPlay                = fvPlay;
  window.fvBookmark            = fvBookmark;
})();
