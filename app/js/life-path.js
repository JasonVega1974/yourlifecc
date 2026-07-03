/* =============================================================
   life-path.js — "My Climb" · Road to Adulthood engine (L1+L2)

   The main-app sibling of walk-path.js (deliberately a FORK, not
   a refactor — the faith engine is live and protected). Renders
   the Duolingo-style climb (winding node trail up a mountain,
   chapters, pulsing current-step beacon, the North Star horizon
   above a summit), full station pages, weekly quests, and
   completion celebrations wired into the existing juice layers:

     window.sfx / window.haptics / window.awardXP /
     window.megaConfetti / window.screenFlash   — all optional,
   every call typeof-guarded; degrades cleanly anywhere
   (including the standalone preview page).

   THEME: shared night sky with the app's LIFE accent — cyan
   (#22d3ee family). Gold stays exclusively the faith signature.

   State lives in D.lifePath (add `lifePath:{}` to DEF):
     D.lifePath = {
       completed:   { stationId:'YYYY-MM-DD' },
       reflections: { stationId:{ text, ts } },   // timestamped
       questWeek, questProg:{metric:n}, questDone:{questId:date},
       lastVisit, visitStreak
     }

   Public surface (window.*):
     renderLifePath(hostId)  lifeOpenStation(id)  lifeCloseStation()
     lifeMarkStep(id)        lifeQuestBump(metric,n)
     lifeSaveReflection(id)  lifeOpenTool(route)  lifeGetProgress()

   Tool routing: main-app pattern — showSection(route) with a
   stage-filter guard (a hidden section's tool button no-ops with
   a toast rather than opening a surface the sidebar hides).
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

/* ── juice (all optional) ────────────────────────────────── */
function _sfx(kind){
  try{
    if(window.sfx && typeof window.sfx[kind]==='function'){ window.sfx[kind](); return; }
    if(!(window.D && window.D.soundEnabled)) return;
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    window.__lifeAC = window.__lifeAC || new AC();
    var ctx=window.__lifeAC; if(ctx.state==='suspended') ctx.resume();
    var freqs = kind==='perfect' ? [587.33,739.99,880] : kind==='streak' ? [440,587.33,739.99,987.77] : [587.33,739.99];
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
function LP(){
  if(!window.D) window.D={};
  if(!window.D.lifePath || typeof window.D.lifePath!=='object') window.D.lifePath={};
  var w=window.D.lifePath;
  if(!w.completed)   w.completed={};
  if(!w.reflections) w.reflections={};
  if(!w.questProg)   w.questProg={};
  if(!w.questDone)   w.questDone={};
  return w;
}
function _stations(){ return window.LIFE_STATIONS||[]; }
function _currentStation(){
  var w=LP(), list=_stations();
  for(var i=0;i<list.length;i++){ if(!w.completed[list[i].id]) return list[i]; }
  return null;
}
function lifeGetProgress(){
  var w=LP(), list=_stations(), done=0;
  list.forEach(function(s){ if(w.completed[s.id]) done++; });
  return { done:done, total:list.length, pct: list.length? Math.round(done/list.length*100):0 };
}

/* ── daily visit streak (feeds 'visit' quest) ────────────── */
function _touchVisit(){
  var w=LP(), t=_todayKey();
  if(w.lastVisit===t) return;
  var y=new Date(); y.setDate(y.getDate()-1);
  var yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  w.visitStreak = (w.lastVisit===yk) ? (w.visitStreak||0)+1 : 1;
  w.lastVisit=t;
  lifeQuestBump('visit',1,true);
  _save();
}

/* ── weekly quests ───────────────────────────────────────── */
function _weekQuests(){
  var w=LP(), wk=_isoWeekKey(), pool=window.LIFE_QUESTS_POOL||[];
  if(w.questWeek!==wk){
    w.questWeek=wk; w.questProg={}; w.questDone={};
    _save();
  }
  if(!pool.length) return [];
  var seed=0, s=wk+':life'; for(var i=0;i<s.length;i++) seed=(seed*31+s.charCodeAt(i))>>>0;
  var idx=[], n=pool.length;
  while(idx.length<Math.min(3,n)){
    seed=(seed*1103515245+12345)>>>0;
    var k=seed%n;
    if(idx.indexOf(k)===-1) idx.push(k);
  }
  return idx.map(function(k){ return pool[k]; });
}
function lifeQuestBump(metric,n,silent){
  var w=LP(), quests=_weekQuests(), touched=false;
  w.questProg[metric]=(w.questProg[metric]||0)+(n||1);
  quests.forEach(function(q){
    if(q.metric!==metric || w.questDone[q.id]) return;
    if((w.questProg[metric]||0)>=q.target){
      w.questDone[q.id]=_todayKey(); touched=true;
      _xp(q.xp,'life_quest');
      if(!silent){
        _sfx('streak'); _buzz('streak'); _flash('rgba(34,211,238,.26)');
        _toast('🏆 Quest complete: '+q.title+'  +'+q.xp+' XP');
      }
    }
  });
  _save();
  var qb=document.getElementById('lifeQuestBoard');
  if(qb) qb.innerHTML=_questBoardInner();
  return touched;
}

/* ── styles (injected once) ──────────────────────────────── */
function _injectCss(){
  if(document.getElementById('lifePathCss')) return;
  var st=document.createElement('style'); st.id='lifePathCss';
  st.textContent=[
'#lifePathWrap{position:relative;font-family:inherit;color:#e9f4f6;}',
'.lp-scene{position:relative;overflow:hidden;border-radius:20px;background:radial-gradient(ellipse 90% 40% at 50% 5%,rgba(103,232,249,.14),transparent 60%),linear-gradient(180deg,#16233c 0%,#0d1730 36%,#0a1226 72%,#080e1e 100%);border:1px solid rgba(255,255,255,.07);}',
'.lp-star{position:absolute;border-radius:50%;background:#fff;pointer-events:none;animation:lpTwinkle 3.6s ease-in-out infinite;}',
'@keyframes lpTwinkle{0%,100%{opacity:.14}50%{opacity:.8}}',
/* horizon: summit + north star */
'.lp-horizon{position:relative;text-align:center;padding:2rem 1rem 0;cursor:pointer;}',
'.lp-summit{position:relative;width:150px;height:74px;margin:0 auto;}',
'.lp-peak{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:56px solid transparent;border-right:56px solid transparent;border-bottom:62px solid rgba(148,178,214,.30);}',
'.lp-peak2{position:absolute;bottom:0;left:14%;width:0;height:0;border-left:34px solid transparent;border-right:34px solid transparent;border-bottom:40px solid rgba(120,150,190,.18);}',
'.lp-peak3{position:absolute;bottom:0;right:12%;width:0;height:0;border-left:30px solid transparent;border-right:30px solid transparent;border-bottom:34px solid rgba(120,150,190,.15);}',
'.lp-snow{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:20px solid transparent;border-right:20px solid transparent;border-bottom:22px solid rgba(236,248,255,.55);}',
'.lp-northstar{position:absolute;left:50%;top:-26px;transform:translate(-50%,0);width:46px;height:46px;animation:lpStarGlow 4.2s ease-in-out infinite;}',
'.lp-northstar:before,.lp-northstar:after{content:"";position:absolute;left:50%;top:50%;background:linear-gradient(180deg,transparent,#e0fbff,transparent);}',
'.lp-northstar:before{width:3px;height:46px;transform:translate(-50%,-50%);}',
'.lp-northstar:after{width:46px;height:3px;transform:translate(-50%,-50%);background:linear-gradient(90deg,transparent,#e0fbff,transparent);}',
'.lp-northstar .lp-ns-d1,.lp-northstar .lp-ns-d2{position:absolute;left:50%;top:50%;width:2px;height:22px;background:linear-gradient(180deg,transparent,rgba(165,243,252,.7),transparent);}',
'.lp-northstar .lp-ns-d1{transform:translate(-50%,-50%) rotate(45deg);}',
'.lp-northstar .lp-ns-d2{transform:translate(-50%,-50%) rotate(-45deg);}',
'.lp-northstar .lp-ns-core{position:absolute;left:50%;top:50%;width:9px;height:9px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#ffffff,rgba(165,243,252,0) 72%);box-shadow:0 0 14px 3px rgba(165,243,252,.95);}',
'@keyframes lpStarGlow{0%,100%{filter:brightness(1) drop-shadow(0 0 8px rgba(165,243,252,.7))}50%{filter:brightness(1.35) drop-shadow(0 0 22px rgba(165,243,252,1))}}',
'.lp-horizon-name{font-size:1rem;font-weight:800;letter-spacing:.06em;color:#c8f6ff;margin-top:.5rem;text-transform:uppercase;}',
'.lp-horizon-sub{font-size:.68rem;color:rgba(233,244,246,.6);margin-top:.2rem;font-style:italic;padding-bottom:.4rem;}',
'.lp-path-col{position:relative;padding:1rem 0 2.2rem;}',
'.lp-chapter{position:relative;text-align:center;margin:1.35rem auto .95rem;z-index:2;}',
'.lp-chapter-pill{display:inline-block;padding:.34rem .95rem;border-radius:999px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.3);font-size:.62rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#67e8f9;}',
'.lp-chapter-sub{font-size:.6rem;color:rgba(233,244,246,.45);margin-top:.28rem;}',
'.lp-node{position:relative;z-index:2;width:86px;margin:0 auto 1.55rem;text-align:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .14s ease;}',
'.lp-node:active{transform:scale(.94);}',
'.lp-node-orb{position:relative;width:64px;height:64px;margin:0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.55rem;}',
'.lp-done .lp-node-orb{background:radial-gradient(circle at 34% 30%,#d7fbff,#22d3ee 68%);box-shadow:0 0 22px rgba(34,211,238,.55),inset 0 -3px 8px rgba(8,64,80,.4);}',
'.lp-done .lp-check{position:absolute;right:-3px;bottom:-3px;width:22px;height:22px;border-radius:50%;background:#22c55e;color:#04120a;font-size:.8rem;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.45);}',
'.lp-current .lp-node-orb{background:radial-gradient(circle at 34% 30%,#effdff,#67e8f9 62%,#0891b2);box-shadow:0 0 0 6px rgba(34,211,238,.18),0 0 34px 8px rgba(34,211,238,.6);animation:lpBreathe 2.8s ease-in-out infinite;}',
'@keyframes lpBreathe{0%,100%{box-shadow:0 0 0 6px rgba(34,211,238,.16),0 0 30px 6px rgba(34,211,238,.5)}50%{box-shadow:0 0 0 11px rgba(34,211,238,.26),0 0 52px 15px rgba(34,211,238,.8)}}',
'.lp-current .lp-beacon{position:absolute;left:50%;top:50%;width:64px;height:64px;border-radius:50%;border:2px solid rgba(103,232,249,.75);animation:lpBeacon 2.3s ease-out infinite;pointer-events:none;}',
'@keyframes lpBeacon{0%{transform:translate(-50%,-50%) scale(.6);opacity:.7}80%{opacity:0}100%{transform:translate(-50%,-50%) scale(2.35);opacity:0}}',
'.lp-current .lp-start-tag{position:absolute;left:50%;top:-26px;transform:translateX(-50%);background:#67e8f9;color:#032830;font-size:.56rem;font-weight:900;letter-spacing:.1em;padding:.22rem .6rem;border-radius:999px;white-space:nowrap;animation:lpFloat 2.6s ease-in-out infinite;box-shadow:0 4px 14px rgba(0,0,0,.4);}',
'@keyframes lpFloat{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-6px)}}',
'.lp-future .lp-node-orb{background:radial-gradient(circle at 34% 30%,rgba(180,210,230,.22),rgba(78,102,140,.22) 70%);border:1.5px dashed rgba(180,215,235,.35);filter:saturate(.55);opacity:.82;}',
'.lp-node-name{margin-top:.42rem;font-size:.66rem;font-weight:700;line-height:1.25;color:#e9f4f6;}',
'.lp-future .lp-node-name{color:rgba(233,244,246,.55);font-weight:600;}',
'.lp-node-date{font-size:.54rem;color:rgba(103,232,249,.85);margin-top:.12rem;}',
'.lp-l{transform:translateX(-62px);} .lp-r{transform:translateX(62px);}',
'.lp-l:active{transform:translateX(-62px) scale(.94);} .lp-r:active{transform:translateX(62px) scale(.94);}',
'@media (max-width:360px){.lp-l{transform:translateX(-46px);}.lp-r{transform:translateX(46px);}}',
'.lp-progress{display:flex;align-items:center;gap:.6rem;padding:.8rem 1rem .1rem;position:relative;z-index:2;}',
'.lp-progress-bar{flex:1;height:8px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden;}',
'.lp-progress-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,#0891b2,#67e8f9);box-shadow:0 0 10px rgba(34,211,238,.6);transition:width .6s cubic-bezier(.22,1,.36,1);}',
'.lp-progress-txt{font-size:.62rem;font-weight:800;color:#67e8f9;white-space:nowrap;}',
/* quest board */
'#lifeQuestBoard{margin:.9rem 0 0;}',
'.lp-quests{border-radius:16px;border:1px solid rgba(34,211,238,.22);background:linear-gradient(180deg,rgba(34,211,238,.07),rgba(255,255,255,.02));padding:.85rem .9rem;}',
'.lp-quests-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.6rem;}',
'.lp-quests-title{font-size:.72rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#67e8f9;}',
'.lp-quests-reset{font-size:.56rem;color:rgba(233,244,246,.45);}',
'.lp-quest{display:flex;align-items:center;gap:.6rem;padding:.5rem 0;border-top:1px solid rgba(255,255,255,.05);}',
'.lp-quest:first-of-type{border-top:0;}',
'.lp-quest-ico{font-size:1.15rem;width:30px;text-align:center;flex:0 0 auto;}',
'.lp-quest-mid{flex:1;min-width:0;}',
'.lp-quest-t{font-size:.72rem;font-weight:700;color:#e9f4f6;}',
'.lp-quest-d{font-size:.6rem;color:rgba(233,244,246,.55);}',
'.lp-quest-bar{height:6px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:.3rem;}',
'.lp-quest-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#0891b2,#67e8f9);transition:width .5s cubic-bezier(.22,1,.36,1);}',
'.lp-quest-xp{font-size:.6rem;font-weight:800;color:#67e8f9;flex:0 0 auto;}',
'.lp-quest-done .lp-quest-t{color:#22c55e;} .lp-quest-done .lp-quest-fill{background:#22c55e;}',
/* station overlay */
'#lifeStationOverlay{position:fixed;inset:0;z-index:9000;background:rgba(4,8,16,.72);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;animation:lpFadeIn .22s ease;}',
'@keyframes lpFadeIn{from{opacity:0}to{opacity:1}}',
'.lp-sheet{position:relative;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;border-radius:22px 22px 0 0;background:linear-gradient(180deg,#132038,#0b1428);border:1px solid rgba(34,211,238,.22);border-bottom:0;padding:1.2rem 1.15rem 2.4rem;animation:lpSheetUp .3s cubic-bezier(.22,1,.36,1);}',
'@keyframes lpSheetUp{from{transform:translateY(46px);opacity:0}to{transform:translateY(0);opacity:1}}',
'@media (prefers-reduced-motion:reduce){.lp-sheet,#lifeStationOverlay{animation:none;}}',
'.lp-sheet-x{position:sticky;top:0;float:right;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#e9f4f6;font-size:1rem;cursor:pointer;z-index:3;}',
'.lp-eyebrow{font-size:.58rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#67e8f9;}',
'.lp-st-name{font-size:1.35rem;font-weight:900;color:#fff;margin:.15rem 0 .1rem;}',
'.lp-st-tag{font-size:.76rem;color:rgba(233,244,246,.65);font-style:italic;margin-bottom:.9rem;}',
'.lp-welcome{border-left:3px solid #67e8f9;padding:.55rem .7rem;background:rgba(34,211,238,.07);border-radius:0 10px 10px 0;font-size:.78rem;line-height:1.55;color:#dff7fb;margin-bottom:1rem;}',
'.lp-sec{margin-bottom:1.05rem;}',
'.lp-sec-h{display:flex;align-items:center;gap:.45rem;font-size:.64rem;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:#67e8f9;margin-bottom:.42rem;}',
'.lp-sec-h:after{content:"";flex:1;height:1px;background:rgba(34,211,238,.18);}',
'.lp-p{font-size:.78rem;line-height:1.65;color:rgba(233,244,246,.88);margin:0 0 .55rem;}',
'.lp-quote{border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);padding:.6rem .7rem;margin-bottom:.45rem;}',
'.lp-quote-t{font-size:.76rem;line-height:1.55;font-style:italic;color:#d8f3f8;}',
'.lp-stepcard{border-radius:14px;border:1px solid rgba(34,211,238,.4);background:linear-gradient(135deg,rgba(34,211,238,.13),rgba(34,211,238,.05));padding:.8rem .85rem;}',
'.lp-stepcard-t{font-size:.84rem;font-weight:800;color:#c8f6ff;margin-bottom:.3rem;}',
'.lp-marker{display:flex;gap:.5rem;align-items:flex-start;font-size:.74rem;line-height:1.5;color:rgba(233,244,246,.85);margin-bottom:.4rem;}',
'.lp-marker:before{content:"◈";color:#67e8f9;flex:0 0 auto;margin-top:.05rem;}',
'.lp-tools{display:flex;flex-wrap:wrap;gap:.45rem;}',
'.lp-tool{display:inline-flex;align-items:center;gap:.35rem;padding:.42rem .7rem;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);font-size:.66rem;font-weight:700;color:#e9f4f6;cursor:pointer;}',
'.lp-tool:active{transform:scale(.96);}',
'.lp-reflect-in{width:100%;box-sizing:border-box;min-height:74px;border-radius:10px;border:1px solid rgba(34,211,238,.25);background:rgba(0,0,0,.25);color:#e9f4f6;font-size:.78rem;line-height:1.55;padding:.55rem .65rem;font-family:inherit;resize:vertical;}',
'.lp-human{border-radius:12px;border:1px dashed rgba(250,204,21,.45);background:rgba(250,204,21,.06);padding:.65rem .75rem;font-size:.74rem;line-height:1.6;color:#fef3c7;}',
'.lp-cta{display:block;width:100%;border:0;border-radius:14px;padding:.85rem;margin-top:1.1rem;font-size:.9rem;font-weight:900;letter-spacing:.03em;color:#032830;background:linear-gradient(135deg,#c8f6ff,#22d3ee);box-shadow:0 0 26px rgba(34,211,238,.45),0 8px 20px rgba(0,0,0,.4);cursor:pointer;animation:lpBtnGlow 3.2s ease-in-out infinite;}',
'@keyframes lpBtnGlow{0%,100%{box-shadow:0 0 22px rgba(34,211,238,.4),0 8px 20px rgba(0,0,0,.4)}50%{box-shadow:0 0 40px rgba(34,211,238,.65),0 8px 20px rgba(0,0,0,.4)}}',
'.lp-cta:active{transform:translateY(1px);}',
'.lp-cta-done{background:rgba(34,197,94,.14);color:#4ade80;border:1px solid rgba(34,197,94,.4);animation:none;box-shadow:none;}',
'.lp-charge{border-radius:12px;border:1px solid rgba(34,211,238,.3);background:rgba(34,211,238,.06);padding:.65rem .75rem;font-size:.78rem;line-height:1.6;font-weight:700;color:#c8f6ff;font-style:italic;}'
  ].join('\n');
  document.head.appendChild(st);
}

/* ── path rendering ──────────────────────────────────────── */
function _starsHtml(count,h){
  var out='';
  for(var i=0;i<count;i++){
    var sz=(Math.random()*1.8+0.8).toFixed(1);
    out+='<div class="lp-star" style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*h).toFixed(0)+'px;width:'+sz+'px;height:'+sz+'px;animation-delay:'+(Math.random()*3.5).toFixed(1)+'s;"></div>';
  }
  return out;
}
function renderLifePath(hostId){
  _injectCss();
  var host=document.getElementById(hostId||'lifePathWrap');
  if(!host) return;
  _touchVisit();
  var w=LP(), chapters=window.LIFE_CHAPTERS||[], list=_stations(), cur=_currentStation();
  var prog=lifeGetProgress();
  var allDone=!cur;

  var html='';
  html+='<div class="lp-scene">';
  html+='<div class="lp-progress"><div class="lp-progress-txt">'+prog.done+' / '+prog.total+' steps</div><div class="lp-progress-bar"><div class="lp-progress-fill" style="width:'+prog.pct+'%;"></div></div><div class="lp-progress-txt">'+prog.pct+'%</div></div>';

  // horizon: north star above summit
  var hz=window.LIFE_HORIZON||{};
  html+='<div class="lp-horizon" onclick="lifeOpenStation(\'north-star\')">'
      + '<div class="lp-summit">'
      +   '<div class="lp-northstar"><div class="lp-ns-d1"></div><div class="lp-ns-d2"></div><div class="lp-ns-core"></div></div>'
      +   '<div class="lp-peak2"></div><div class="lp-peak3"></div><div class="lp-peak"></div><div class="lp-snow"></div>'
      + '</div>'
      + '<div class="lp-horizon-name">'+_esc(hz.name||'The North Star')+'</div>'
      + '<div class="lp-horizon-sub">'+( allDone ? 'Every step climbed — keep steering by the Star ⭐' : _esc(hz.tagline||''))+'</div>'
      + '</div>';

  html+='<div class="lp-path-col" id="lpPathCol">';

  // stations grouped by chapter, rendered chapter 4 → 1 (climb goes up;
  // the next step sits nearest the bottom / thumb zone)
  var side=0;
  var revCh=chapters.slice().reverse();
  revCh.forEach(function(ch){
    html+='<div class="lp-chapter"><div class="lp-chapter-pill">Chapter '+ch.num+' · '+_esc(ch.name)+'</div><div class="lp-chapter-sub">'+_esc(ch.sub)+'</div></div>';
    var sts=list.filter(function(s){return s.chapter===ch.id;}).slice().reverse();
    sts.forEach(function(s){
      var done=!!w.completed[s.id];
      var isCur=cur && cur.id===s.id;
      var cls=done?'lp-done':(isCur?'lp-current':'lp-future');
      var lane=(side++%3===0)?'':(side%3===1?'lp-l':'lp-r');
      html+='<div class="lp-node '+cls+' '+lane+'" onclick="lifeOpenStation(\''+s.id+'\')">'
          + '<div class="lp-node-orb">'
          + (isCur?'<div class="lp-beacon"></div><div class="lp-start-tag">YOU ARE HERE</div>':'')
          + '<span>'+s.icon+'</span>'
          + (done?'<div class="lp-check">✓</div>':'')
          + '</div>'
          + '<div class="lp-node-name">'+_esc(s.name)+'</div>'
          + (done?'<div class="lp-node-date">'+_esc(w.completed[s.id])+'</div>':'')
          + '</div>';
    });
  });
  html+='</div>'; // path col
  html+='</div>'; // scene
  html+='<div id="lifeQuestBoard">'+_questBoardInner()+'</div>';

  host.innerHTML=html;

  var scene=host.querySelector('.lp-scene');
  if(scene && !_reduced()){
    var stars=document.createElement('div'); stars.style.cssText='position:absolute;inset:0;pointer-events:none;';
    stars.innerHTML=_starsHtml(46, scene.scrollHeight||1200);
    scene.insertBefore(stars, scene.firstChild);
  }
}

/* ── quest board ─────────────────────────────────────────── */
function _questBoardInner(){
  var w=LP(), quests=_weekQuests();
  if(!quests.length) return '';
  var daysLeft=(function(){ var d=new Date(); return 7-((d.getDay()+6)%7); })();
  var h='<div class="lp-quests"><div class="lp-quests-hd"><div class="lp-quests-title">🏆 Weekly Quests</div><div class="lp-quests-reset">fresh board in '+daysLeft+'d</div></div>';
  quests.forEach(function(q){
    var got=Math.min(w.questProg[q.metric]||0,q.target);
    var done=!!w.questDone[q.id];
    var pct=done?100:Math.round(got/q.target*100);
    h+='<div class="lp-quest'+(done?' lp-quest-done':'')+'">'
     + '<div class="lp-quest-ico">'+q.icon+'</div>'
     + '<div class="lp-quest-mid"><div class="lp-quest-t">'+_esc(q.title)+(done?' ✓':'')+'</div>'
     + '<div class="lp-quest-d">'+_esc(q.desc)+' · '+got+'/'+q.target+'</div>'
     + '<div class="lp-quest-bar"><div class="lp-quest-fill" style="width:'+pct+'%;"></div></div></div>'
     + '<div class="lp-quest-xp">+'+q.xp+' XP</div></div>';
  });
  h+='</div>';
  return h;
}

/* ── station page ────────────────────────────────────────── */
function lifeOpenStation(id){
  _injectCss();
  var w=LP();
  var s = id==='north-star' ? window.LIFE_HORIZON : _stations().find(function(x){return x.id===id;});
  if(!s) return;
  var horizon = id==='north-star';
  var done=!horizon && !!w.completed[id];
  var chapters=window.LIFE_CHAPTERS||[];
  var ch=chapters.find(function(c){return c.id===s.chapter;});

  var h='<div class="lp-sheet">';
  h+='<button class="lp-sheet-x" onclick="lifeCloseStation()" aria-label="Close">✕</button>';
  h+='<div class="lp-eyebrow">'+(horizon?'THE HORIZON':'Chapter '+(ch?ch.num:'')+' · '+_esc(ch?ch.name:''))+'</div>';
  h+='<div class="lp-st-name">'+s.icon+' '+_esc(s.name)+'</div>';
  h+='<div class="lp-st-tag">'+_esc(s.tagline||'')+'</div>';
  if(s.welcome) h+='<div class="lp-welcome">'+_esc(s.welcome)+'</div>';

  if(s.what){ h+='<div class="lp-sec"><div class="lp-sec-h">What this step is</div><p class="lp-p">'+_esc(s.what)+'</p></div>'; }
  if(s.understand && s.understand.length){
    h+='<div class="lp-sec"><div class="lp-sec-h">Understand this</div>';
    s.understand.forEach(function(p){ h+='<p class="lp-p">'+_esc(p)+'</p>'; });
    h+='</div>';
  }
  var wis=s.wisdom||[];
  if(wis.length){
    h+='<div class="lp-sec"><div class="lp-sec-h">Trail markers</div>';
    wis.forEach(function(v){
      var t=(typeof v==='string')?v:(v&&v.text)||'';
      if(t) h+='<div class="lp-quote"><div class="lp-quote-t">“'+_esc(t)+'”</div></div>';
    });
    h+='</div>';
  }
  if(s.step){
    h+='<div class="lp-sec"><div class="lp-sec-h">Take the step</div>'
     + '<div class="lp-stepcard"><div class="lp-stepcard-t">⛰️ '+_esc(s.step.title)+'</div>'
     + '<p class="lp-p" style="margin:0;">'+_esc(s.step.how)+'</p></div></div>';
  }
  if(s.markers && s.markers.length){
    h+='<div class="lp-sec"><div class="lp-sec-h">How you\'ll know</div>';
    s.markers.forEach(function(m){ h+='<div class="lp-marker">'+_esc(m)+'</div>'; });
    h+='<div style="font-size:.6rem;color:rgba(233,244,246,.4);font-style:italic;margin-top:.2rem;">Honest markers, not a test. You set the pace.</div></div>';
  }
  if(s.tools && s.tools.length){
    h+='<div class="lp-sec"><div class="lp-sec-h">Tools for this step</div><div class="lp-tools">';
    s.tools.forEach(function(t){
      h+='<span class="lp-tool" onclick="lifeOpenTool(\''+_esc(t.route)+'\')">'+t.icon+' '+_esc(t.label)+'</span>';
    });
    h+='</div></div>';
  }
  if(s.reflect){
    var saved=w.reflections[id];
    var savedText=saved ? (typeof saved==='string' ? saved : (saved.text||'')) : '';
    h+='<div class="lp-sec"><div class="lp-sec-h">Reflect</div>'
     + '<p class="lp-p" style="font-style:italic;">'+_esc(s.reflect)+'</p>'
     + '<textarea class="lp-reflect-in" id="lpReflectIn" placeholder="Write it here — private to you...">'+_esc(savedText)+'</textarea>'
     + '<button class="lp-tool" style="margin-top:.45rem;" onclick="lifeSaveReflection(\''+_esc(id)+'\')">💾 Save reflection</button></div>';
  }
  if(s.charge){
    h+='<div class="lp-sec"><div class="lp-sec-h">Say it like you mean it</div><div class="lp-charge">'+_esc(s.charge)+'</div></div>';
  }
  if(s.human){
    h+='<div class="lp-sec"><div class="lp-sec-h">Ask someone who\'s done it</div><div class="lp-human">🤝 '+_esc(s.human)+'</div></div>';
  }

  if(horizon){
    h+='<button class="lp-cta lp-cta-done" onclick="lifeCloseStation()">This one is never “done.” Keep climbing ⭐</button>';
  } else if(done){
    h+='<button class="lp-cta lp-cta-done" onclick="lifeCloseStation()">✓ Step taken on '+_esc(w.completed[id])+' — climb on</button>';
  } else {
    h+='<button class="lp-cta" onclick="lifeMarkStep(\''+_esc(id)+'\')">I\'ve taken this step ✓</button>';
    h+='<div style="font-size:.58rem;color:rgba(233,244,246,.4);text-align:center;margin-top:.5rem;">Self-paced. Mark it when it\'s true — no pressure, no clock.</div>';
  }
  h+='</div>';

  var ov=document.getElementById('lifeStationOverlay');
  if(!ov){
    ov=document.createElement('div'); ov.id='lifeStationOverlay';
    ov.addEventListener('click',function(e){ if(e.target===ov) lifeCloseStation(); });
    document.body.appendChild(ov);
  }
  ov.innerHTML=h; ov.style.display='flex';
  _buzz('correct');
}
function lifeCloseStation(){
  var ov=document.getElementById('lifeStationOverlay');
  if(ov) ov.style.display='none';
}
function lifeSaveReflection(id){
  var ta=document.getElementById('lpReflectIn'); if(!ta) return;
  var w=LP();
  var prev=w.reflections[id];
  var had=!!(prev && (typeof prev==='string' ? prev.trim() : (prev.text||'').trim()));
  // Timestamped from day one (the walk's reflections-lack-timestamps lesson).
  w.reflections[id]={ text:ta.value, ts:new Date().toISOString() };
  _save();
  if(!had && ta.value.trim()) lifeQuestBump('reflect',1);
  _sfx('correct'); _buzz('correct');
  _toast('Reflection saved 📔');
}
function lifeOpenTool(route){
  // Main-app pattern: showSection, respecting the stage filter.
  // If the section is hidden for this user's bracket/stage, don't
  // open a surface their sidebar hides — gentle toast instead.
  try{
    if(typeof window.showSection==='function'){
      var key=route.replace(/^s-/,'');
      var hidden = window.D && window.D.sections && window.D.sections[key]===0;
      if(hidden){ _toast('That tool unlocks at an older level — ask a parent to enable it'); return; }
      lifeCloseStation();
      window.showSection(route);
      return;
    }
  }catch(_e){}
  _toast('Opens in the full app');
}

/* ── the big moment ──────────────────────────────────────── */
function lifeMarkStep(id){
  var w=LP();
  if(w.completed[id]) return;
  w.completed[id]=_todayKey();
  _save();

  _confetti();
  _flash('rgba(34,211,238,.28)');
  _sfx('perfect');
  _buzz('perfect');
  _xp(50,'life_station');
  lifeQuestBump('station',1);

  var s=_stations().find(function(x){return x.id===id;});
  var prog=lifeGetProgress();
  _toast('⛰️ Step taken: '+(s?s.name:'')+'  +50 XP');

  // Chapter completions get an extra beat.
  if(s){
    var chDone = _stations().filter(function(x){return x.chapter===s.chapter;})
                            .every(function(x){return !!w.completed[x.id];});
    if(chDone && prog.done<prog.total){
      setTimeout(function(){ _sfx('streak'); _buzz('streak'); _toast('🏕️ Chapter complete — higher ground reached'); },800);
    }
  }
  // Launch (the final station) gets the full sky.
  if(id==='launch'){
    setTimeout(function(){ _confetti(); _sfx('streak'); _buzz('streak'); },650);
  }
  if(prog.done===prog.total){
    setTimeout(function(){ _confetti(); _toast('⭐ Every station climbed. The North Star still shines — keep becoming.'); },1100);
  }

  lifeCloseStation();
  var host=document.getElementById('lifePathWrap');
  if(host) renderLifePath('lifePathWrap');
}

/* ── expose ──────────────────────────────────────────────── */
window.renderLifePath     = renderLifePath;
window.lifeOpenStation    = lifeOpenStation;
window.lifeCloseStation   = lifeCloseStation;
window.lifeSaveReflection = lifeSaveReflection;
window.lifeOpenTool       = lifeOpenTool;
window.lifeMarkStep       = lifeMarkStep;
window.lifeQuestBump      = lifeQuestBump;
window.lifeGetProgress    = lifeGetProgress;

})();
