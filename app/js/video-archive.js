/* =============================================================
   video-archive.js — Bible Project video archive surface

   Renders the browsable channel surface into #videoArchiveHost
   (the bf-videos faith panel). Two parts:
     A. Curated playlists from window.VIDEO_ARCHIVE — always works,
        fully offline. Empty youtubeId -> "Video coming soon".
     B. Live "New from Bible Project" row from /api/youtube-feed
        (self-enabling server endpoint). If it's disabled, offline,
        or errors, the row simply never appears — no error shown.

   Self-contained: does NOT touch the contextual cards in
   faith-videos.js. Same lazy tap-to-play pattern (poster + CSS play
   button first; the iframe is created only on tap, never on load).

   Public API (window):
     renderVideoArchive()      — entry, called by bfTab('videos')
     vaPlay(youtubeId, poster) — swap poster -> iframe
     vaBookmark(youtubeId, btn)— toggle 'yt:<id>' in D.savedVideos
============================================================= */
(function(){
  'use strict';

  function _esc(s){
    if(s==null) return '';
    if(typeof window.escapeHtml==='function') return window.escapeHtml(String(s));
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function _data(){ return (window.VIDEO_ARCHIVE && typeof window.VIDEO_ARCHIVE==='object') ? window.VIDEO_ARCHIVE : {channel:{},playlists:[]}; }
  function _saveKey(ytid){ return 'yt:'+ytid; }
  function _isSaved(ytid){
    return (typeof D!=='undefined' && D && Array.isArray(D.savedVideos) && D.savedVideos.indexOf(_saveKey(ytid))>=0);
  }
  function _toast(msg){
    try{
      if(typeof window.toast==='function') return window.toast(msg);
      if(typeof window._toast==='function') return window._toast(msg);
    }catch(_e){}
  }

  // ── one card ─────────────────────────────────────────────
  function _cardHtml(v){
    if(!v) return '';
    var title=_esc(v.title||'');
    // No verified id yet — placeholder, never a broken embed.
    if(!v.youtubeId){
      return '<div class="va-card va-card--soon">'+
        '<div class="va-poster va-poster--soon" aria-hidden="true"><span class="va-soon-ico">🎬</span></div>'+
        '<div class="va-meta"><div class="va-title">'+title+'</div>'+
        '<div class="va-soon-note">Video coming soon</div></div></div>';
    }
    var ytid=v.youtubeId;
    var saved=_isSaved(ytid);
    var thumb='https://img.youtube.com/vi/'+encodeURIComponent(ytid)+'/mqdefault.jpg';
    var watch='https://www.youtube.com/watch?v='+encodeURIComponent(ytid);
    return '<div class="va-card" data-va-id="'+_esc(ytid)+'">'+
      '<button type="button" class="va-poster" data-va-title="'+title+'" onclick="vaPlay(\''+_esc(ytid)+'\', this)" aria-label="Play '+title+'">'+
        '<img class="va-thumb" src="'+thumb+'" alt="" loading="lazy" decoding="async">'+
        '<span class="va-play" aria-hidden="true"><span class="va-play-tri"></span></span>'+
        (v.duration?('<span class="va-dur">'+_esc(v.duration)+'</span>'):'')+
      '</button>'+
      '<div class="va-meta">'+
        '<div class="va-title">'+title+'</div>'+
        '<div class="va-actions">'+
          '<a class="va-yt" href="'+watch+'" target="_blank" rel="noopener noreferrer">Open in YouTube &rarr;</a>'+
          '<button type="button" class="va-bm" onclick="vaBookmark(\''+_esc(ytid)+'\', this)" '+
            'aria-pressed="'+(saved?'true':'false')+'" aria-label="'+(saved?'Saved to Watch later':'Watch later')+'">'+
            (saved?'★':'☆')+'</button>'+
        '</div>'+
      '</div></div>';
  }

  function _playlistHtml(pl){
    if(!pl || !Array.isArray(pl.videos) || !pl.videos.length) return '';
    var h='<div class="va-plist"><div class="va-eyebrow">'+_esc(pl.eyebrow||'')+'</div><div class="va-grid">';
    for(var i=0;i<pl.videos.length;i++){ h+=_cardHtml(pl.videos[i]); }
    h+='</div></div>';
    return h;
  }

  // ── entry ────────────────────────────────────────────────
  function renderVideoArchive(){
    _injectCss();
    var host=document.getElementById('videoArchiveHost');
    if(!host) return;
    var d=_data();
    var ch=d.channel||{};
    var lists=Array.isArray(d.playlists)?d.playlists:[];
    var body=lists.map(_playlistHtml).join('');
    host.innerHTML=
      '<div class="va-top">'+
        '<div class="va-top-row">'+
          '<div class="va-top-txt">'+
            '<div class="va-kicker">Video Partner</div>'+
            '<div class="va-brand">'+_esc(ch.name||'BibleProject')+'</div>'+
          '</div>'+
          '<a class="va-visit" href="'+_esc(ch.url||'https://bibleproject.com')+'" target="_blank" rel="noopener noreferrer">Visit Bible Project &rarr;</a>'+
        '</div>'+
        '<p class="va-intro">Animated explainers of every book, theme, and idea in the Bible. Tap any card to watch in place, or open it on YouTube.</p>'+
      '</div>'+
      '<div id="vaLiveRow" class="va-live" style="display:none;"></div>'+
      body;
    _loadLive();
  }

  // ── Part B: live feed (graceful) ─────────────────────────
  function _loadLive(){
    if(typeof fetch!=='function') return; // very old engine — curated only
    fetch('/api/youtube-feed', { headers:{ 'Accept':'application/json' } })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(dat){
        if(!dat || !dat.enabled || !Array.isArray(dat.videos) || !dat.videos.length) return; // curated only
        _renderLive(dat.videos);
      })
      .catch(function(){ /* offline / blocked / error — silent */ });
  }
  function _renderLive(videos){
    var row=document.getElementById('vaLiveRow');
    if(!row) return;
    var cards=videos.map(function(v){
      return _cardHtml({ title:v.title, youtubeId:v.youtubeId, duration:'' });
    }).join('');
    if(!cards) return;
    row.innerHTML='<div class="va-eyebrow">NEW FROM BIBLE PROJECT</div><div class="va-live-row">'+cards+'</div>';
    row.style.display='';
  }

  // ── tap -> lazy iframe (only on tap) ─────────────────────
  function vaPlay(youtubeId, posterEl){
    if(!youtubeId) return;
    var title = (posterEl && posterEl.getAttribute) ? (posterEl.getAttribute('data-va-title')||'') : '';
    // Preferred: hand off to the full-screen player overlay.
    if(typeof window.openVideoPlayer==='function'){
      window.openVideoPlayer(youtubeId, title, 'The Bible Project');
      return;
    }
    // Fallback (player module absent): the original inline embed.
    if(!posterEl || !posterEl.parentNode) return;
    var ifr=document.createElement('iframe');
    ifr.className='va-iframe';
    ifr.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(youtubeId)+'?autoplay=1&rel=0&modestbranding=1';
    ifr.title='Bible Project video';
    ifr.setAttribute('allow','autoplay; encrypted-media; picture-in-picture; fullscreen');
    ifr.setAttribute('allowfullscreen','');
    ifr.setAttribute('loading','lazy');
    posterEl.parentNode.replaceChild(ifr, posterEl);
  }

  // ── bookmark -> D.savedVideos (keyed yt:<id>) ────────────
  function vaBookmark(youtubeId, btnEl){
    if(typeof D==='undefined' || !D) return;
    if(!Array.isArray(D.savedVideos)) D.savedVideos=[];
    var k=_saveKey(youtubeId), i=D.savedVideos.indexOf(k), saved;
    if(i>=0){ D.savedVideos.splice(i,1); saved=false; }
    else { D.savedVideos.push(k); saved=true; }
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
    '#videoArchiveHost{padding:.2rem 0 1rem;}'+
    '.va-top{background:linear-gradient(165deg,#1a1233 0%,#12102a 100%);border:1px solid rgba(251,191,36,.18);border-radius:16px;padding:1rem 1.05rem;margin-bottom:1rem;}'+
    '.va-top-row{display:flex;align-items:center;justify-content:space-between;gap:.7rem;}'+
    '.va-kicker{font-family:\'Oswald\',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.15em;font-size:.62rem;font-weight:600;color:#fbbf24;}'+
    '.va-brand{font-weight:800;font-size:1.15rem;color:#e9ecf6;line-height:1.1;margin-top:.1rem;}'+
    '.va-visit{flex-shrink:0;font-weight:700;font-size:.76rem;color:#fbbf24;text-decoration:none;border:1px solid rgba(251,191,36,.4);border-radius:999px;padding:.4rem .7rem;white-space:nowrap;}'+
    '.va-visit:hover{background:rgba(251,191,36,.12);}'+
    '.va-intro{font-size:.78rem;line-height:1.45;color:rgba(233,236,246,.62);margin:.6rem 0 0;}'+
    '.va-plist{margin-bottom:1.15rem;}'+
    '.va-eyebrow{font-family:\'Oswald\',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.15em;font-size:.7rem;font-weight:600;color:#fbbf24;margin-bottom:.55rem;}'+
    '.va-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:.7rem;}'+
    '.va-live-row{display:flex;gap:.7rem;overflow-x:auto;padding-bottom:.35rem;-webkit-overflow-scrolling:touch;}'+
    '.va-live-row .va-card{flex:0 0 208px;}'+
    '.va-card{background:var(--card-bg,rgba(255,255,255,.03));border:1px solid rgba(251,191,36,.18);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;}'+
    '.va-poster{position:relative;display:block;width:100%;padding:0;border:0;margin:0;aspect-ratio:16/9;cursor:pointer;background:#0a0d1a;overflow:hidden;}'+
    '.va-thumb{width:100%;height:100%;object-fit:cover;display:block;}'+
    '.va-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;}'+
    '.va-play-tri{width:52px;height:52px;border-radius:50%;background:rgba(10,13,26,.6);border:2px solid rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;transition:transform .18s ease, background .18s ease;}'+
    '.va-play-tri::after{content:\'\';display:block;width:0;height:0;border-style:solid;border-width:9px 0 9px 15px;border-color:transparent transparent transparent #fff;margin-left:3px;}'+
    '.va-poster:hover .va-play-tri,.va-poster:focus-visible .va-play-tri{transform:scale(1.08);background:rgba(159,18,57,.92);}'+
    '.va-dur{position:absolute;bottom:.4rem;right:.4rem;background:rgba(10,13,26,.82);color:#fff;font-size:.62rem;font-weight:600;padding:.11rem .38rem;border-radius:6px;}'+
    '.va-poster--soon{aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1233,#0a0d1a);}'+
    '.va-soon-ico{font-size:1.7rem;opacity:.5;}'+
    '.va-meta{padding:.55rem .65rem .6rem;display:flex;flex-direction:column;gap:.4rem;flex:1;}'+
    '.va-title{font-weight:700;font-size:.82rem;color:#e9ecf6;line-height:1.25;}'+
    '.va-soon-note{font-size:.68rem;color:rgba(233,236,246,.45);font-style:italic;}'+
    '.va-actions{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:auto;}'+
    '.va-yt{font-size:.68rem;font-weight:600;color:#8ab4f8;text-decoration:none;}'+
    '.va-yt:hover{text-decoration:underline;}'+
    '.va-bm{flex-shrink:0;background:none;border:0;cursor:pointer;font-size:1.05rem;line-height:1;color:#fbbf24;padding:.05rem .1rem;border-radius:8px;}'+
    '.va-bm:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'+
    '.va-iframe{display:block;width:100%;aspect-ratio:16/9;border:0;background:#000;}'+
    '@media (prefers-reduced-motion: reduce){.va-play-tri{transition:none;}.va-poster:hover .va-play-tri,.va-poster:focus-visible .va-play-tri{transform:none;}}'+
    /* ── light mode — paper ── */
    ':root.light .va-top{background:linear-gradient(165deg,#fbf7ee 0%,#f4ecdd 100%);border-color:rgba(146,64,14,.22);}'+
    ':root.light .va-kicker,:root.light .va-eyebrow{color:#92400e;}'+
    ':root.light .va-brand{color:#1a1233;}'+
    ':root.light .va-visit{color:#b45309;border-color:rgba(180,83,9,.4);}'+
    ':root.light .va-intro{color:#57534e;}'+
    ':root.light .va-card{background:#ffffff;border-color:rgba(146,64,14,.22);box-shadow:0 1px 3px rgba(26,18,51,.06);}'+
    ':root.light .va-title{color:#1a1233;}'+
    ':root.light .va-soon-note{color:#78716c;}'+
    ':root.light .va-yt{color:#1d4ed8;}'+
    ':root.light .va-bm{color:#b45309;}'+
    ':root.light .va-poster{background:#e7e2d6;}'+
    ':root.light .va-poster--soon{background:linear-gradient(135deg,#efe8da,#e2d9c6);}';
    var st=document.createElement('style');
    st.id='va-css';
    st.textContent=css;
    (document.head||document.documentElement).appendChild(st);
  }

  // ── expose ───────────────────────────────────────────────
  window.renderVideoArchive = renderVideoArchive;
  window.vaPlay             = vaPlay;
  window.vaBookmark         = vaBookmark;
})();
