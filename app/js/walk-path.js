/* =============================================================
   walk-path.js — "My Walk with God" Pathway engine (W1+W2)

   Renders the Duolingo-style discipleship path (winding node trail,
   chapters, pulsing current-step beacon, radiant horizon), full
   station pages (11-part template from the pathway spec), weekly
   quests (grace-first contests), and completion celebrations wired
   into the app's existing juice layers:

     window.sfx        (sfx.js)          — sounds   [optional]
     window.haptics    (haptics.js)      — vibration [optional]
     window.awardXP    (xp.js)           — unified XP [optional]
     window.megaConfetti / screenFlash   (celebrations.js) [optional]

   Every external call is typeof-guarded — this module degrades
   gracefully anywhere (including the standalone preview page).

   State lives in D.walk (add `walk:{}` to DEF in data.js):
     D.walk = {
       completed:   { stationId: 'YYYY-MM-DD' },
       reflections: { stationId: 'text' },
       questWeek:   'YYYY-Www',
       questProg:   { metric: n },
       questDone:   { questId: 'YYYY-MM-DD' },
       lastVisit:   'YYYY-MM-DD',
       visitStreak: n
     }

   Public surface (window.*):
     renderWalkPath(hostId)   walkOpenStation(id)   walkCloseStation()
     walkMarkStep(id)         walkQuestBump(metric, n)
     walkGetProgress()

   Spec guardrails honored (my-walk-with-god-pathway-spec.md §5):
   - No fake data: everything renders from real D.walk state.
   - Future stations are inviting, never locked/accusing.
   - Freedom & Wholeness (gentle:true): private, no tracking of
     growth areas, strong "reach a real person" framing.
   - Self-paced: any station can be opened and read at any time.
============================================================= */
(function(){
'use strict';

/* ── helpers ─────────────────────────────────────────────── */
function _esc(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function _todayKey(){
  var d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function _isoWeekKey(){
  var d=new Date(); d.setHours(0,0,0,0);
  d.setDate(d.getDate()+3-((d.getDay()+6)%7));
  var w1=new Date(d.getFullYear(),0,4);
  var wk=1+Math.round(((d-w1)/864e5-3+((w1.getDay()+6)%7))/7);
  return d.getFullYear()+'-W'+String(wk).padStart(2,'0');
}
function _reduced(){
  try{ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch(_e){ return false; }
}
function _save(){ if(typeof window.save==='function') window.save(); }
function _toast(m){ if(typeof window.showToast==='function') window.showToast(m); }

/* ── juice: sound + haptics + xp (all optional) ──────────── */
function _sfx(kind){
  try{
    if(window.sfx && typeof window.sfx[kind]==='function'){ window.sfx[kind](); return; }
    // Fallback micro-synth (preview page): soft two-tone chime.
    if(!(window.D && window.D.soundEnabled)) return;
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    window.__walkAC = window.__walkAC || new AC();
    var ctx=window.__walkAC; if(ctx.state==='suspended') ctx.resume();
    var freqs = kind==='perfect' ? [523.25,659.25,783.99] : kind==='streak' ? [392,523.25,659.25,880] : [523.25,659.25];
    freqs.forEach(function(f,i){
      var o=ctx.createOscillator(), g=ctx.createGain();
      o.type='sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,ctx.currentTime+i*0.09);
      g.gain.exponentialRampToValueAtTime(0.12,ctx.currentTime+i*0.09+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+i*0.09+0.5);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime+i*0.09); o.stop(ctx.currentTime+i*0.09+0.55);
    });
  }catch(_e){}
}
function _buzz(kind){
  try{
    if(window.haptics && typeof window.haptics[kind]==='function'){ window.haptics[kind](); return; }
    if(!('vibrate' in navigator)) return;
    if(window.D && window.D.hapticsEnabled===false) return;
    navigator.vibrate(kind==='streak'?[30,40,30,40,60]:kind==='perfect'?[20,30,20,30,40]:[15,25,15]);
  }catch(_e){}
}
function _xp(n,src){ try{ if(typeof window.awardXP==='function') window.awardXP(n,src); }catch(_e){} }
function _confetti(){ try{ if(!_reduced() && typeof window.megaConfetti==='function') window.megaConfetti(); }catch(_e){} }
function _flash(c){ try{ if(!_reduced() && typeof window.screenFlash==='function') window.screenFlash(c,420); }catch(_e){} }

/* ── state ───────────────────────────────────────────────── */
function W(){
  if(!window.D) window.D={};
  if(!window.D.walk || typeof window.D.walk!=='object') window.D.walk={};
  var w=window.D.walk;
  if(!w.completed)   w.completed={};
  if(!w.reflections) w.reflections={};
  if(!w.questProg)   w.questProg={};
  if(!w.questDone)   w.questDone={};
  return w;
}
function _stations(){ return window.WALK_STATIONS||[]; }
function _currentStation(){
  var w=W(), list=_stations();
  for(var i=0;i<list.length;i++){ if(!w.completed[list[i].id]) return list[i]; }
  return null; // all complete — horizon shines
}
function walkGetProgress(){
  var w=W(), list=_stations(), done=0;
  list.forEach(function(s){ if(w.completed[s.id]) done++; });
  return { done:done, total:list.length, pct: list.length? Math.round(done/list.length*100):0 };
}

/* ── daily visit streak (feeds 'visit' quest) ────────────── */
function _touchVisit(){
  var w=W(), t=_todayKey();
  if(w.lastVisit===t) return;
  var y=new Date(); y.setDate(y.getDate()-1);
  var yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  w.visitStreak = (w.lastVisit===yk) ? (w.visitStreak||0)+1 : 1;
  w.lastVisit=t;
  walkQuestBump('visit',1,true);
  _save();
}

/* ── weekly quests ───────────────────────────────────────── */
function _weekQuests(){
  var w=W(), wk=_isoWeekKey(), pool=window.WALK_QUESTS_POOL||[];
  if(w.questWeek!==wk){
    // New week: fresh board, zero penalty (grace-first).
    w.questWeek=wk; w.questProg={}; w.questDone={};
    _save();
  }
  if(!pool.length) return [];
  // Deterministic weekly rotation: 3 quests picked by week hash.
  var seed=0, s=wk; for(var i=0;i<s.length;i++) seed=(seed*31+s.charCodeAt(i))>>>0;
  var idx=[], n=pool.length;
  while(idx.length<Math.min(3,n)){
    seed=(seed*1103515245+12345)>>>0;
    var k=seed%n;
    if(idx.indexOf(k)===-1) idx.push(k);
  }
  return idx.map(function(k){ return pool[k]; });
}
function walkQuestBump(metric,n,silent){
  var w=W(), quests=_weekQuests(), touched=false;
  w.questProg[metric]=(w.questProg[metric]||0)+(n||1);
  quests.forEach(function(q){
    if(q.metric!==metric || w.questDone[q.id]) return;
    if((w.questProg[metric]||0)>=q.target){
      w.questDone[q.id]=_todayKey(); touched=true;
      _xp(q.xp,'walk_quest');
      if(!silent){
        _sfx('streak'); _buzz('streak'); _flash('rgba(245,180,49,.28)');
        _toast('🏆 Quest complete: '+q.title+'  +'+q.xp+' XP');
      }
    }
  });
  _save();
  var qb=document.getElementById('walkQuestBoard');
  if(qb) qb.innerHTML=_questBoardInner();
  return touched;
}

/* ── styles (injected once) ──────────────────────────────── */
function _injectCss(){
  if(document.getElementById('walkPathCss')) return;
  var st=document.createElement('style'); st.id='walkPathCss';
  st.textContent=[
'#walkPathWrap{position:relative;font-family:inherit;color:#e9ecf6;}',
'.wk-scene{position:relative;overflow:hidden;border-radius:20px;background:radial-gradient(ellipse 90% 40% at 50% 6%,rgba(245,192,82,.16),transparent 60%),linear-gradient(180deg,#1a1f3c 0%,#0e1428 34%,#0b1122 70%,#0a0f1f 100%);border:1px solid rgba(255,255,255,.07);}',
'.wk-star{position:absolute;border-radius:50%;background:#fff;pointer-events:none;animation:wkTwinkle 3.6s ease-in-out infinite;}',
'@keyframes wkTwinkle{0%,100%{opacity:.15}50%{opacity:.85}}',
'.wk-horizon{position:relative;text-align:center;padding:2.1rem 1rem 1.15rem;}',
'.wk-cross{display:inline-block;position:relative;width:54px;height:54px;animation:wkCrossGlow 4.5s ease-in-out infinite;}',
'.wk-cross:before,.wk-cross:after{content:"";position:absolute;background:linear-gradient(180deg,#ffe9b0,#f5b431);border-radius:3px;box-shadow:0 0 18px rgba(245,180,49,.85);}',
'.wk-cross:before{left:50%;top:0;width:8px;height:54px;transform:translateX(-50%);}',
'.wk-cross:after{left:50%;top:14px;width:36px;height:8px;transform:translateX(-50%);}',
'@keyframes wkCrossGlow{0%,100%{filter:brightness(1) drop-shadow(0 0 10px rgba(245,205,110,.7))}50%{filter:brightness(1.28) drop-shadow(0 0 26px rgba(255,216,122,1))}}',
'.wk-horizon-name{font-size:1rem;font-weight:800;letter-spacing:.06em;color:#ffe9b0;margin-top:.55rem;text-transform:uppercase;}',
'.wk-horizon-sub{font-size:.68rem;color:rgba(233,236,246,.6);margin-top:.2rem;font-style:italic;}',
'.wk-path-col{position:relative;padding:1rem 0 2.2rem;}',
'.wk-path-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}',
'.wk-chapter{position:relative;text-align:center;margin:1.35rem auto .95rem;z-index:2;}',
'.wk-chapter-pill{display:inline-block;padding:.34rem .95rem;border-radius:999px;background:rgba(245,180,49,.1);border:1px solid rgba(245,180,49,.3);font-size:.62rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#f5cd6e;}',
'.wk-chapter-sub{font-size:.6rem;color:rgba(233,236,246,.45);margin-top:.28rem;}',
'.wk-node{position:relative;z-index:2;width:86px;margin:0 auto 1.55rem;text-align:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .14s ease;}',
'.wk-node:active{transform:scale(.94);}',
'.wk-node-orb{position:relative;width:64px;height:64px;margin:0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.55rem;}',
'.wk-done .wk-node-orb{background:radial-gradient(circle at 34% 30%,#ffe9b0,#f5b431 68%);box-shadow:0 0 22px rgba(245,180,49,.55),inset 0 -3px 8px rgba(120,70,0,.35);}',
'.wk-done .wk-check{position:absolute;right:-3px;bottom:-3px;width:22px;height:22px;border-radius:50%;background:#22c55e;color:#04120a;font-size:.8rem;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.45);}',
'.wk-current .wk-node-orb{background:radial-gradient(circle at 34% 30%,#fff7e0,#f5cd6e 62%,#e09b1a);box-shadow:0 0 0 6px rgba(245,180,49,.18),0 0 34px 8px rgba(245,180,49,.6);animation:wkBreathe 2.8s ease-in-out infinite;}',
'@keyframes wkBreathe{0%,100%{box-shadow:0 0 0 6px rgba(245,180,49,.16),0 0 30px 6px rgba(245,180,49,.5)}50%{box-shadow:0 0 0 11px rgba(245,180,49,.26),0 0 52px 15px rgba(245,180,49,.8)}}',
'.wk-current .wk-beacon{position:absolute;left:50%;top:50%;width:64px;height:64px;border-radius:50%;border:2px solid rgba(245,205,110,.75);animation:wkBeacon 2.3s ease-out infinite;pointer-events:none;}',
'@keyframes wkBeacon{0%{transform:translate(-50%,-50%) scale(.6);opacity:.7}80%{opacity:0}100%{transform:translate(-50%,-50%) scale(2.35);opacity:0}}',
'.wk-current .wk-start-tag{position:absolute;left:50%;top:-26px;transform:translateX(-50%);background:#f5cd6e;color:#241703;font-size:.56rem;font-weight:900;letter-spacing:.1em;padding:.22rem .6rem;border-radius:999px;white-space:nowrap;animation:wkFloat 2.6s ease-in-out infinite;box-shadow:0 4px 14px rgba(0,0,0,.4);}',
'@keyframes wkFloat{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-6px)}}',
'.wk-future .wk-node-orb{background:radial-gradient(circle at 34% 30%,rgba(180,192,230,.24),rgba(80,94,140,.22) 70%);border:1.5px dashed rgba(190,200,235,.35);filter:saturate(.55);opacity:.82;}',
'.wk-node-name{margin-top:.42rem;font-size:.66rem;font-weight:700;line-height:1.25;color:#e9ecf6;}',
'.wk-future .wk-node-name{color:rgba(233,236,246,.55);font-weight:600;}',
'.wk-node-date{font-size:.54rem;color:rgba(245,205,110,.85);margin-top:.12rem;}',
'.wk-l{transform:translateX(-62px);} .wk-r{transform:translateX(62px);}',
'.wk-l:active{transform:translateX(-62px) scale(.94);} .wk-r:active{transform:translateX(62px) scale(.94);}',
'@media (max-width:360px){.wk-l{transform:translateX(-46px);}.wk-r{transform:translateX(46px);}}',
'.wk-progress{display:flex;align-items:center;gap:.6rem;padding:.8rem 1rem .1rem;position:relative;z-index:2;}',
'.wk-progress-bar{flex:1;height:8px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden;}',
'.wk-progress-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,#f5b431,#ffe9b0);box-shadow:0 0 10px rgba(245,180,49,.6);transition:width .6s cubic-bezier(.22,1,.36,1);}',
'.wk-progress-txt{font-size:.62rem;font-weight:800;color:#f5cd6e;white-space:nowrap;}',
/* quest board */
'#walkQuestBoard{margin:.9rem 0 0;}',
'.wk-quests{border-radius:16px;border:1px solid rgba(245,180,49,.22);background:linear-gradient(180deg,rgba(245,180,49,.08),rgba(255,255,255,.02));padding:.85rem .9rem;}',
'.wk-quests-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.6rem;}',
'.wk-quests-title{font-size:.72rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#f5cd6e;}',
'.wk-quests-reset{font-size:.56rem;color:rgba(233,236,246,.45);}',
'.wk-quest{display:flex;align-items:center;gap:.6rem;padding:.5rem 0;border-top:1px solid rgba(255,255,255,.05);}',
'.wk-quest:first-of-type{border-top:0;}',
'.wk-quest-ico{font-size:1.15rem;width:30px;text-align:center;flex:0 0 auto;}',
'.wk-quest-mid{flex:1;min-width:0;}',
'.wk-quest-t{font-size:.72rem;font-weight:700;color:#e9ecf6;}',
'.wk-quest-d{font-size:.6rem;color:rgba(233,236,246,.55);}',
'.wk-quest-bar{height:6px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:.3rem;}',
'.wk-quest-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#f5b431,#ffe9b0);transition:width .5s cubic-bezier(.22,1,.36,1);}',
'.wk-quest-xp{font-size:.6rem;font-weight:800;color:#f5cd6e;flex:0 0 auto;}',
'.wk-quest-done .wk-quest-t{color:#22c55e;} .wk-quest-done .wk-quest-fill{background:#22c55e;}',
/* station overlay */
'#walkStationOverlay{position:fixed;inset:0;z-index:9000;background:rgba(4,6,14,.72);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;animation:wkFadeIn .22s ease;}',
'@keyframes wkFadeIn{from{opacity:0}to{opacity:1}}',
'.wk-sheet{position:relative;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;border-radius:22px 22px 0 0;background:linear-gradient(180deg,#141a33,#0c1224);border:1px solid rgba(245,180,49,.2);border-bottom:0;padding:1.2rem 1.15rem 2.4rem;animation:wkSheetUp .3s cubic-bezier(.22,1,.36,1);}',
'@keyframes wkSheetUp{from{transform:translateY(46px);opacity:0}to{transform:translateY(0);opacity:1}}',
'@media (prefers-reduced-motion:reduce){.wk-sheet,#walkStationOverlay{animation:none;}}',
'.wk-sheet-x{position:sticky;top:0;float:right;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#e9ecf6;font-size:1rem;cursor:pointer;z-index:3;}',
'.wk-eyebrow{font-size:.58rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#f5cd6e;}',
'.wk-st-name{font-size:1.35rem;font-weight:900;color:#fff;margin:.15rem 0 .1rem;}',
'.wk-st-tag{font-size:.76rem;color:rgba(233,236,246,.65);font-style:italic;margin-bottom:.9rem;}',
'.wk-welcome{border-left:3px solid #f5cd6e;padding:.55rem .7rem;background:rgba(245,180,49,.07);border-radius:0 10px 10px 0;font-size:.78rem;line-height:1.55;color:#f2e8cf;margin-bottom:1rem;}',
'.wk-sec{margin-bottom:1.05rem;}',
'.wk-sec-h{display:flex;align-items:center;gap:.45rem;font-size:.64rem;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:#f5cd6e;margin-bottom:.42rem;}',
'.wk-sec-h:after{content:"";flex:1;height:1px;background:rgba(245,180,49,.18);}',
'.wk-p{font-size:.78rem;line-height:1.65;color:rgba(233,236,246,.88);margin:0 0 .55rem;}',
'.wk-verse{border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);padding:.6rem .7rem;margin-bottom:.45rem;}',
'.wk-verse-t{font-size:.76rem;line-height:1.55;font-style:italic;color:#f2ead2;}',
'.wk-verse-r{font-size:.6rem;font-weight:800;color:#f5cd6e;margin-top:.25rem;}',
'.wk-stepcard{border-radius:14px;border:1px solid rgba(245,180,49,.4);background:linear-gradient(135deg,rgba(245,180,49,.14),rgba(245,180,49,.05));padding:.8rem .85rem;}',
'.wk-stepcard-t{font-size:.84rem;font-weight:800;color:#ffe9b0;margin-bottom:.3rem;}',
'.wk-marker{display:flex;gap:.5rem;align-items:flex-start;font-size:.74rem;line-height:1.5;color:rgba(233,236,246,.85);margin-bottom:.4rem;}',
'.wk-marker:before{content:"◈";color:#f5cd6e;flex:0 0 auto;margin-top:.05rem;}',
'.wk-tools{display:flex;flex-wrap:wrap;gap:.45rem;}',
'.wk-tool{display:inline-flex;align-items:center;gap:.35rem;padding:.42rem .7rem;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);font-size:.66rem;font-weight:700;color:#e9ecf6;cursor:pointer;}',
'.wk-tool:active{transform:scale(.96);}',
'.wk-reflect-in{width:100%;box-sizing:border-box;min-height:74px;border-radius:10px;border:1px solid rgba(245,180,49,.25);background:rgba(0,0,0,.25);color:#e9ecf6;font-size:.78rem;line-height:1.55;padding:.55rem .65rem;font-family:inherit;resize:vertical;}',
'.wk-human{border-radius:12px;border:1px dashed rgba(120,200,255,.4);background:rgba(96,165,250,.07);padding:.65rem .75rem;font-size:.74rem;line-height:1.6;color:#dbeafe;}',
'.wk-cta{display:block;width:100%;border:0;border-radius:14px;padding:.85rem;margin-top:1.1rem;font-size:.9rem;font-weight:900;letter-spacing:.03em;color:#241703;background:linear-gradient(135deg,#ffe9b0,#f5b431);box-shadow:0 0 26px rgba(245,180,49,.45),0 8px 20px rgba(0,0,0,.4);cursor:pointer;animation:wkBtnGlow 3.2s ease-in-out infinite;}',
'@keyframes wkBtnGlow{0%,100%{box-shadow:0 0 22px rgba(245,180,49,.4),0 8px 20px rgba(0,0,0,.4)}50%{box-shadow:0 0 40px rgba(245,180,49,.65),0 8px 20px rgba(0,0,0,.4)}}',
'.wk-cta:active{transform:translateY(1px);}',
'.wk-cta-done{background:rgba(34,197,94,.14);color:#4ade80;border:1px solid rgba(34,197,94,.4);animation:none;box-shadow:none;}',
'.wk-review-note{font-size:.56rem;color:rgba(233,236,246,.35);text-align:center;margin-top:.8rem;font-style:italic;}'
  ].join('\n');
  document.head.appendChild(st);
}

/* ── path rendering ──────────────────────────────────────── */
function _starsHtml(count,h){
  var out='';
  for(var i=0;i<count;i++){
    var sz=(Math.random()*1.8+0.8).toFixed(1);
    out+='<div class="wk-star" style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*h).toFixed(0)+'px;width:'+sz+'px;height:'+sz+'px;animation-delay:'+(Math.random()*3.5).toFixed(1)+'s;"></div>';
  }
  return out;
}
function renderWalkPath(hostId){
  _injectCss();
  var host=document.getElementById(hostId||'walkPathWrap');
  if(!host) return;
  _touchVisit();
  var w=W(), chapters=window.WALK_CHAPTERS||[], list=_stations(), cur=_currentStation();
  var prog=walkGetProgress();
  var allDone=!cur;

  // Build node column: horizon on top, then chapters DESCENDING order
  // (walk climbs upward toward the light), i.e. chapter 4 → 1 top→bottom
  // reversed so the user's next step is nearest the bottom (thumb zone).
  var html='';
  html+='<div class="wk-scene">';
  html+='<div class="wk-progress"><div class="wk-progress-txt">'+prog.done+' / '+prog.total+' steps</div><div class="wk-progress-bar"><div class="wk-progress-fill" style="width:'+prog.pct+'%;"></div></div><div class="wk-progress-txt">'+prog.pct+'%</div></div>';

  // horizon
  var hz=window.WALK_HORIZON||{};
  html+='<div class="wk-horizon" onclick="walkOpenStation(\'becoming\')" style="cursor:pointer;">'
      + '<div class="wk-cross"></div>'
      + '<div class="wk-horizon-name">'+_esc(hz.name||'Becoming Like Christ')+'</div>'
      + '<div class="wk-horizon-sub">'+( allDone ? 'Every step walked — keep walking toward the Light ✨' : _esc(hz.tagline||''))+'</div>'
      + '</div>';

  html+='<div class="wk-path-col" id="wkPathCol">';

  // stations grouped by chapter, rendered chapter 4 → 1
  var side=0;
  var revCh=chapters.slice().reverse();
  revCh.forEach(function(ch){
    html+='<div class="wk-chapter"><div class="wk-chapter-pill">Chapter '+ch.num+' · '+_esc(ch.name)+'</div><div class="wk-chapter-sub">'+_esc(ch.sub)+'</div></div>';
    var sts=list.filter(function(s){return s.chapter===ch.id;}).slice().reverse();
    sts.forEach(function(s){
      var done=!!w.completed[s.id];
      var isCur=cur && cur.id===s.id;
      var cls=done?'wk-done':(isCur?'wk-current':'wk-future');
      var lane=(side++%3===0)?'':(side%3===1?'wk-l':'wk-r');
      html+='<div class="wk-node '+cls+' '+lane+'" onclick="walkOpenStation(\''+s.id+'\')">'
          + '<div class="wk-node-orb">'
          + (isCur?'<div class="wk-beacon"></div><div class="wk-start-tag">YOU ARE HERE</div>':'')
          + '<span>'+s.icon+'</span>'
          + (done?'<div class="wk-check">✓</div>':'')
          + '</div>'
          + '<div class="wk-node-name">'+_esc(s.name)+'</div>'
          + (done?'<div class="wk-node-date">'+_esc(w.completed[s.id])+'</div>':'')
          + '</div>';
    });
  });
  html+='</div>'; // path col
  html+='</div>'; // scene
  html+='<div id="walkQuestBoard">'+_questBoardInner()+'</div>';

  host.innerHTML=html;

  // decorate: stars sized to actual scene height
  var scene=host.querySelector('.wk-scene');
  if(scene && !_reduced()){
    var stars=document.createElement('div'); stars.style.cssText='position:absolute;inset:0;pointer-events:none;';
    stars.innerHTML=_starsHtml(46, scene.scrollHeight||1200);
    scene.insertBefore(stars, scene.firstChild);
  }
}

/* ── quest board ─────────────────────────────────────────── */
function _questBoardInner(){
  var w=W(), quests=_weekQuests();
  if(!quests.length) return '';
  var daysLeft=(function(){ var d=new Date(); return 7-((d.getDay()+6)%7); })();
  var h='<div class="wk-quests"><div class="wk-quests-hd"><div class="wk-quests-title">🏆 Weekly Quests</div><div class="wk-quests-reset">fresh board in '+daysLeft+'d</div></div>';
  quests.forEach(function(q){
    var got=Math.min(w.questProg[q.metric]||0,q.target);
    var done=!!w.questDone[q.id];
    var pct=done?100:Math.round(got/q.target*100);
    h+='<div class="wk-quest'+(done?' wk-quest-done':'')+'">'
     + '<div class="wk-quest-ico">'+q.icon+'</div>'
     + '<div class="wk-quest-mid"><div class="wk-quest-t">'+_esc(q.title)+(done?' ✓':'')+'</div>'
     + '<div class="wk-quest-d">'+_esc(q.desc)+' · '+got+'/'+q.target+'</div>'
     + '<div class="wk-quest-bar"><div class="wk-quest-fill" style="width:'+pct+'%;"></div></div></div>'
     + '<div class="wk-quest-xp">+'+q.xp+' XP</div></div>';
  });
  h+='</div>';
  return h;
}

/* ── station page ────────────────────────────────────────── */
function walkOpenStation(id){
  _injectCss();
  var w=W();
  var s = id==='becoming' ? window.WALK_HORIZON : _stations().find(function(x){return x.id===id;});
  if(!s) return;
  var horizon = id==='becoming';
  var done=!horizon && !!w.completed[id];
  var chapters=window.WALK_CHAPTERS||[];
  var ch=chapters.find(function(c){return c.id===s.chapter;});

  var h='<div class="wk-sheet">';
  h+='<button class="wk-sheet-x" onclick="walkCloseStation()" aria-label="Close">✕</button>';
  h+='<div class="wk-eyebrow">'+(horizon?'THE HORIZON':'Chapter '+(ch?ch.num:'')+' · '+_esc(ch?ch.name:''))+'</div>';
  h+='<div class="wk-st-name">'+s.icon+' '+_esc(s.name)+'</div>';
  h+='<div class="wk-st-tag">'+_esc(s.tagline||'')+'</div>';
  if(s.welcome) h+='<div class="wk-welcome">'+_esc(s.welcome)+'</div>';

  if(s.what){ h+='<div class="wk-sec"><div class="wk-sec-h">What this step is</div><p class="wk-p">'+_esc(s.what)+'</p></div>'; }
  if(s.understand && s.understand.length){
    h+='<div class="wk-sec"><div class="wk-sec-h">Understand this</div>';
    s.understand.forEach(function(p){ h+='<p class="wk-p">'+_esc(p)+'</p>'; });
    h+='</div>';
  }
  if(s.verses && s.verses.length){
    h+='<div class="wk-sec"><div class="wk-sec-h">Scripture anchor</div>';
    s.verses.forEach(function(v){ h+='<div class="wk-verse"><div class="wk-verse-t">“'+_esc(v.text)+'”</div><div class="wk-verse-r">— '+_esc(v.ref)+'</div></div>'; });
    h+='</div>';
  }
  if(s.step){
    h+='<div class="wk-sec"><div class="wk-sec-h">Take the step</div>'
     + '<div class="wk-stepcard"><div class="wk-stepcard-t">👣 '+_esc(s.step.title)+'</div>'
     + '<p class="wk-p" style="margin:0;">'+_esc(s.step.how)+'</p></div></div>';
  }
  if(s.markers && s.markers.length){
    h+='<div class="wk-sec"><div class="wk-sec-h">How you\'ll know</div>';
    s.markers.forEach(function(m){ h+='<div class="wk-marker">'+_esc(m)+'</div>'; });
    h+='<div style="font-size:.6rem;color:rgba(233,236,246,.4);font-style:italic;margin-top:.2rem;">Gentle markers, not a test. You set the pace.</div></div>';
  }
  if(s.tools && s.tools.length){
    h+='<div class="wk-sec"><div class="wk-sec-h">Tools for this step</div><div class="wk-tools">';
    s.tools.forEach(function(t){
      h+='<span class="wk-tool" onclick="walkOpenTool(\''+_esc(t.route)+'\')">'+t.icon+' '+_esc(t.label)+'</span>';
    });
    h+='</div></div>';
  }
  if(s.reflect){
    var saved=w.reflections[id]||'';
    h+='<div class="wk-sec"><div class="wk-sec-h">Reflect</div>'
     + '<p class="wk-p" style="font-style:italic;">'+_esc(s.reflect)+'</p>'
     + '<textarea class="wk-reflect-in" id="wkReflectIn" placeholder="Write it here — private to you...">'+_esc(saved)+'</textarea>'
     + '<button class="wk-tool" style="margin-top:.45rem;" onclick="walkSaveReflection(\''+_esc(id)+'\')">💾 Save reflection</button></div>';
  }
  if(s.pray){
    h+='<div class="wk-sec"><div class="wk-sec-h">Pray</div><div class="wk-verse"><div class="wk-verse-t">'+_esc(s.pray)+'</div></div></div>';
  }
  if(s.human){
    h+='<div class="wk-sec"><div class="wk-sec-h">You\'re not alone</div><div class="wk-human">🫂 '+_esc(s.human)+'</div></div>';
  }

  if(horizon){
    h+='<button class="wk-cta wk-cta-done" onclick="walkCloseStation()">This one is never “done.” Keep walking ✨</button>';
  } else if(done){
    h+='<button class="wk-cta wk-cta-done" onclick="walkCloseStation()">✓ Step taken on '+_esc(w.completed[id])+' — walk on</button>';
  } else {
    h+='<button class="wk-cta" onclick="walkMarkStep(\''+_esc(id)+'\')">I\'ve taken this step ✓</button>';
    h+='<div style="font-size:.58rem;color:rgba(233,236,246,.4);text-align:center;margin-top:.5rem;">Self-paced. Mark it when it\'s true — no pressure, no clock.</div>';
  }
  if(s.pastorReview){
    h+='<div class="wk-review-note">Draft teaching — being reviewed with church leadership.</div>';
  }
  h+='</div>';

  var ov=document.getElementById('walkStationOverlay');
  if(!ov){
    ov=document.createElement('div'); ov.id='walkStationOverlay';
    ov.addEventListener('click',function(e){ if(e.target===ov) walkCloseStation(); });
    document.body.appendChild(ov);
  }
  ov.innerHTML=h; ov.style.display='flex';
  _buzz('correct');
}
function walkCloseStation(){
  var ov=document.getElementById('walkStationOverlay');
  if(ov) ov.style.display='none';
}
function walkSaveReflection(id){
  var ta=document.getElementById('wkReflectIn'); if(!ta) return;
  var w=W(), had=!!(w.reflections[id]&&w.reflections[id].trim());
  w.reflections[id]=ta.value;
  _save();
  if(!had && ta.value.trim()) walkQuestBump('reflect',1);
  _sfx('correct'); _buzz('correct');
  _toast('Reflection saved 📔');
}
function walkOpenTool(route){
  // In-app: hand off to the faith-zones router when present.
  if(typeof window.fzOpenDest==='function'){ walkCloseStation(); try{ window.fzOpenDest(route); return; }catch(_e){} }
  if(typeof window.bfTab==='function'){ walkCloseStation(); try{ window.bfTab(route); return; }catch(_e){} }
  _toast('Opens in the full app');
}

/* ── the big moment ──────────────────────────────────────── */
function walkMarkStep(id){
  var w=W();
  if(w.completed[id]) return;
  w.completed[id]=_todayKey();
  _save();

  // JUICE — the Duolingo moment, faith-flavored.
  _confetti();
  _flash('rgba(245,180,49,.3)');
  _sfx('perfect');
  _buzz('perfect');
  _xp(50,'walk_station');
  walkQuestBump('station',1);

  var s=_stations().find(function(x){return x.id===id;});
  var prog=walkGetProgress();
  _toast('👣 Step taken: '+(s?s.name:'')+'  +50 XP');

  // Special: saying yes to Jesus gets the full sky.
  if(id==='accepted'){
    setTimeout(function(){ _confetti(); _sfx('streak'); _buzz('streak'); },650);
    setTimeout(function(){ _toast('🎉 Heaven is celebrating you right now (Luke 15:10)'); },900);
    try{ if(typeof window.streakMilestoneBanner==='function' && !_reduced()) window.streakMilestoneBanner(1); }catch(_e){}
  }
  if(prog.done===prog.total){
    setTimeout(function(){ _confetti(); _toast('✨ Every station walked. The horizon still shines — keep becoming like Him.'); },1100);
  }

  walkCloseStation();
  // Re-render whichever host is on screen.
  var host=document.getElementById('walkPathWrap');
  if(host) renderWalkPath('walkPathWrap');
}

/* ── expose ──────────────────────────────────────────────── */
window.renderWalkPath     = renderWalkPath;
window.walkOpenStation    = walkOpenStation;
window.walkCloseStation   = walkCloseStation;
window.walkSaveReflection = walkSaveReflection;
window.walkOpenTool       = walkOpenTool;
window.walkMarkStep       = walkMarkStep;
window.walkQuestBump      = walkQuestBump;
window.walkGetProgress    = walkGetProgress;

})();
