/* =============================================================
   health.js — Mood tracker, weight log, nutrition, fitness habits
============================================================= */

// ── HEALTH ────────────────────────────────────────────────────
function hTab(tab,btn){ document.querySelectorAll('[id^="ht-"]').forEach(t=>t.style.display='none'); document.querySelectorAll('.healthTabs .tab').forEach(b=>b.classList.remove('active')); const te=document.getElementById('ht-'+tab); if(te) te.style.display='block'; if(btn) btn.classList.add('active'); if(tab==='weight') setTimeout(renderWeightChart,80); if(tab==='habits') renderHealthHabits(); if(tab==='growth') renderGrowthTracker(); }

function logWeight(){ const w=parseFloat(document.getElementById('wInput').value); const goal=parseFloat(document.getElementById('wGoal').value); const date=document.getElementById('wDate').value||new Date().toISOString().split('T')[0]; if(isNaN(w)||w<=0){showToast('Enter a valid weight');return;} if(!isNaN(goal)&&goal>0) D.weightGoal=goal; if(!D.weightLog) D.weightLog=[]; D.weightLog.unshift({id:Date.now(),weight:w,date}); if(D.weightLog.length>90) D.weightLog=D.weightLog.slice(0,90); document.getElementById('wInput').value=''; save(); renderWeightList(); renderWeightChart(); updateWeightStats(); showToast('Logged! ⚖️'); }

function updateWeightStats(){ const log=D.weightLog||[]; const latest=[...log].sort((a,b)=>new Date(b.date)-new Date(a.date))[0]; const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;}; set('wCurDisp',latest?latest.weight+' lbs':'— lbs'); set('wGoalDisp',D.weightGoal?D.weightGoal+' lbs':'Not set'); if(latest&&D.weightGoal&&log.length>1){ const start=[...log].sort((a,b)=>new Date(a.date)-new Date(b.date))[0].weight; const lost=Math.max(0,start-latest.weight); const toGo=Math.max(0,latest.weight-D.weightGoal); const pct=D.weightGoal<start?Math.min(100,(lost/(start-D.weightGoal))*100):0; const b=document.getElementById('wProgFill'); if(b) b.style.width=pct.toFixed(0)+'%'; const l=document.getElementById('wProgLbl'); if(l) l.textContent=lost.toFixed(1)+' lbs lost · '+toGo.toFixed(1)+' to goal · '+pct.toFixed(0)+'%'; } }

function renderWeightList(){ const el=document.getElementById('wList'); if(!el) return; el.innerHTML=(D.weightLog||[]).slice(0,8).map(e=>`<div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.8rem;"><span style="color:#c8d4e8;">${e.date}</span><span style="font-weight:700;color:var(--c);">${e.weight} lbs</span><button class="db" onclick="D.weightLog=D.weightLog.filter(x=>x.id!=${e.id});save();renderWeightList();renderWeightChart();">✕</button></div>`).join(''); }

function renderWeightChart(){
  const canvas=document.getElementById('wCanvas'); if(!canvas) return;
  const log=[...(D.weightLog||[])].sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-30);
  const ctx=canvas.getContext('2d');
  const W=canvas.offsetWidth||400,H=260; canvas.width=W; canvas.height=H; ctx.clearRect(0,0,W,H);
  if(log.length<2){ctx.fillStyle='#6b7a99';ctx.font='13px Inter';ctx.textAlign='center';ctx.fillText('Log 2+ weights to see chart',W/2,H/2);return;}
  const weights=log.map(e=>e.weight),minW=Math.min(...weights)-3,maxW=Math.max(...weights)+3;
  // Extra top/bottom padding to fit labels
  const p={t:38,r:20,b:30,l:48},cW=W-p.l-p.r,cH=H-p.t-p.b;
  const tx=i=>p.l+(log.length===1?cW/2:i*(cW/(log.length-1)));
  const ty=w=>p.t+cH-(w-minW)*(cH/(maxW-minW));

  // Grid lines
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=p.t+(cH/4)*i;
    ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(W-p.r,y);ctx.stroke();
    ctx.fillStyle='#6b7a99';ctx.font='10px Inter';ctx.textAlign='right';
    ctx.fillText((maxW-(maxW-minW)*i/4).toFixed(0),p.l-4,y+4);
  }

  // Goal line
  if(D.weightGoal&&D.weightGoal>=minW&&D.weightGoal<=maxW){
    const gy=ty(D.weightGoal);
    ctx.strokeStyle='rgba(251,191,36,.5)';ctx.setLineDash([5,5]);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(p.l,gy);ctx.lineTo(W-p.r,gy);ctx.stroke();
    ctx.setLineDash([]);ctx.fillStyle='rgba(251,191,36,.85)';ctx.font='bold 10px Inter';
    ctx.textAlign='left';ctx.fillText('Goal: '+D.weightGoal,p.l+3,gy-4);
  }

  // Gradient fill under line
  const grad=ctx.createLinearGradient(0,p.t,0,H-p.b);
  grad.addColorStop(0,'rgba(56,189,248,.25)');grad.addColorStop(1,'rgba(56,189,248,0)');
  ctx.beginPath();ctx.moveTo(tx(0),ty(weights[0]));
  log.forEach((e,i)=>{if(i>0)ctx.lineTo(tx(i),ty(e.weight));});
  ctx.lineTo(tx(log.length-1),H-p.b);ctx.lineTo(tx(0),H-p.b);ctx.closePath();
  ctx.fillStyle=grad;ctx.fill();

  // Line
  ctx.strokeStyle='#38bdf8';ctx.lineWidth=2;ctx.setLineDash([]);
  ctx.beginPath();
  log.forEach((e,i)=>{i===0?ctx.moveTo(tx(i),ty(e.weight)):ctx.lineTo(tx(i),ty(e.weight));});
  ctx.stroke();

  // Dots + labels
  log.forEach((e,i)=>{
    const x=tx(i),y=ty(e.weight);

    // Outer dot
    ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='#38bdf8';ctx.fill();
    // Inner dot
    ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fillStyle='#0f1117';ctx.fill();

    // Label: alternate above/below based on index to reduce overlap
    // Also nudge closer to edges inward
    const labelAbove=i%2===0;
    const weight=e.weight+' lbs';
    // Shorten date: "2025-03-15" → "3/15"
    const parts=e.date.split('-');
    const shortDate=parts.length===3?parseInt(parts[1])+'/'+parseInt(parts[2]):e.date;

    const lx=Math.max(p.l+2,Math.min(W-p.r-2,x));

    if(labelAbove){
      // Label above dot
      ctx.fillStyle='#f0f4ff';ctx.font='bold 9px Inter';ctx.textAlign='center';
      ctx.fillText(weight,lx,y-10);
      ctx.fillStyle='#8090b0';ctx.font='8px Inter';
      ctx.fillText(shortDate,lx,y-2);
    } else {
      // Label below dot
      ctx.fillStyle='#f0f4ff';ctx.font='bold 9px Inter';ctx.textAlign='center';
      ctx.fillText(weight,lx,y+13);
      ctx.fillStyle='#8090b0';ctx.font='8px Inter';
      ctx.fillText(shortDate,lx,y+21);
    }
  });
}

function logFood(){ const item=(document.getElementById('foodName').value||'').trim(),cal=parseInt(document.getElementById('foodCal').value)||0,pro=parseInt(document.getElementById('foodPro').value)||0,carb=parseInt(document.getElementById('foodCarb').value)||0,fat=parseInt(document.getElementById('foodFat').value)||0; if(!item){showToast('Enter a food item');return;} if(!D.foodLog) D.foodLog=[]; D.foodLog.unshift({id:Date.now(),item,cal,pro,carb,fat,date:new Date().toDateString()}); ['foodName','foodCal','foodPro','foodCarb','foodFat'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';}); save(); renderFoodLog(); updateMacros(); showToast('Logged! 🥗'); }
function renderFoodLog(){ const el=document.getElementById('foodLog'); if(!el) return; const today=new Date().toDateString(); const tf=(D.foodLog||[]).filter(f=>f.date===today); if(!tf.length){el.innerHTML='<div style="font-size:.8rem;color:#c8d4e8;text-align:center;padding:.6rem;">No food logged today</div>';return;} el.innerHTML=tf.map(f=>`<div style="display:flex;align-items:center;gap:.55rem;padding:.48rem .7rem;background:rgba(255,255,255,.1);border-radius:8px;margin-bottom:.28rem;"><div style="flex:1;"><div style="font-weight:700;font-size:.85rem;">${f.item}</div><div style="font-size:.66rem;color:#c8d4e8;">${f.cal} cal · P:${f.pro}g · C:${f.carb}g · F:${f.fat}g</div></div><button class="db" onclick="D.foodLog=D.foodLog.filter(x=>x.id!=${f.id});save();renderFoodLog();updateMacros();">✕</button></div>`).join(''); }
function saveMacroGoals(){ D.macroGoals={cal:parseInt(document.getElementById('goalCal').value)||2000,pro:parseInt(document.getElementById('goalPro').value)||150,carb:parseInt(document.getElementById('goalCarb').value)||200,fat:parseInt(document.getElementById('goalFat').value)||65}; save(); updateMacros(); }
function updateMacros(){
  const today=new Date().toDateString(); const tf=(D.foodLog||[]).filter(f=>f.date===today);
  const tot=tf.reduce((a,f)=>({cal:a.cal+f.cal,pro:a.pro+f.pro,carb:a.carb+f.carb,fat:a.fat+f.fat}),{cal:0,pro:0,carb:0,fat:0});
  const g=D.macroGoals||{cal:2000,pro:150,carb:200,fat:65};
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set('totCal',tot.cal); set('totPro',tot.pro+'g');
  const sl=document.getElementById('macroSliders'); if(!sl) return;
  const bars=[{l:'Calories',v:tot.cal,m:g.cal,c:'var(--c)'},{l:'Protein',v:tot.pro,m:g.pro,c:'var(--gr)'},{l:'Carbs',v:tot.carb,m:g.carb,c:'var(--g)'},{l:'Fat',v:tot.fat,m:g.fat,c:'var(--or)'}];
  sl.innerHTML=bars.map(b=>`<div style="margin-bottom:.45rem;"><div style="display:flex;justify-content:space-between;font-size:.73rem;color:#c8d4e8;margin-bottom:.2rem;"><span>${b.l}</span><span style="color:${b.c};font-weight:700;">${b.v}/${b.m}${b.l==='Calories'?'':' g'}</span></div><div class="pt" style="height:6px;"><div class="pf" style="background:${b.c};width:${Math.min(100,(b.v/b.m)*100)}%;"></div></div></div>`).join('');
}
function renderHealthHabits(){ const el=document.getElementById('healthHabits'); if(!el) return; const today=new Date().toDateString(),td=(D.checkin||{})[today]||{},all=[...DEFAULT_HABITS,...(D.customHabits||[])]; el.innerHTML=all.map(h=>{const done=!!td[h.key];return `<div class="chi${done?' done':''}" data-key="${h.key}" onclick="toggleCheckin(this);renderHealthHabits();" style="position:relative;"><div style="width:20px;height:20px;border-radius:5px;border:2px solid ${done?'var(--gr)':'rgba(255,255,255,.25)'};background:${done?'var(--gr)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${done?'<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7L10 1" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</div><span style="flex:1;font-size:.82rem;">${h.label}</span></div>`}).join(''); }

