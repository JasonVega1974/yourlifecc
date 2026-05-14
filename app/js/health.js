/* =============================================================
   health.js — Mood tracker, weight log, nutrition, fitness habits
============================================================= */

// ── HEALTH ────────────────────────────────────────────────────
function hTab(tab,btn){
  document.querySelectorAll('[id^="ht-"]').forEach(t=>t.style.display='none');
  document.querySelectorAll('.healthTabs .tab').forEach(b=>b.classList.remove('active'));
  const te=document.getElementById('ht-'+tab); if(te) te.style.display='block';
  if(btn) btn.classList.add('active');
  if(tab==='weight') setTimeout(renderWeightChart,80);
  if(tab==='habits') renderHealthHabits();
  if(tab==='growth') renderGrowthTracker();
  // Phase C-Health additions
  if(tab==='sleep'){ renderSleepBars(); renderSleepList(); }
  if(tab==='mind') renderPhq2();
  if(tab==='meals') renderMealLog();
}

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
function renderFoodLog(){ const el=document.getElementById('foodLog'); if(!el) return; const today=new Date().toDateString(); const tf=(D.foodLog||[]).filter(f=>f.date===today); if(!tf.length){el.innerHTML='<div style="font-size:.8rem;color:#c8d4e8;text-align:center;padding:.6rem;">No food logged today</div>';return;} el.innerHTML=tf.map(f=>`<div style="display:flex;align-items:center;gap:.55rem;padding:.48rem .7rem;background:rgba(255,255,255,.1);border-radius:8px;margin-bottom:.28rem;"><div style="flex:1;"><div style="font-weight:700;font-size:.85rem;">${escapeHtml(f.item)}</div><div style="font-size:.66rem;color:#c8d4e8;">${f.cal} cal · P:${f.pro}g · C:${f.carb}g · F:${f.fat}g</div></div><button class="db" onclick="D.foodLog=D.foodLog.filter(x=>x.id!=${f.id});save();renderFoodLog();updateMacros();">✕</button></div>`).join(''); }
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

// ═══════════════════════════════════════════════════════════════════
// Phase C-Health additions — 2026-05-15
// Mood check-in opener · Sleep tracker · Weekly PHQ-2 · Meal log
// Section accent: var(--section-health) #34d399
// ═══════════════════════════════════════════════════════════════════

// ── 1. MOOD CHECK-IN (section opener) ──────────────────────────────
const HEALTH_MOOD_OPTIONS = [
  {level:5, emoji:'🤩', label:'Great'},
  {level:4, emoji:'🙂', label:'Good'},
  {level:3, emoji:'😐', label:'Okay'},
  {level:2, emoji:'🙁', label:'Low'},
  {level:1, emoji:'😣', label:'Rough'}
];
const HEALTH_MOOD_RESPONSES = {
  5: "Love that. Carry it forward today.",
  4: "Solid day starting. Keep building.",
  3: "Okay is real — and okay. You're here.",
  2: "Tough start. Be kind to yourself today.",
  1: "Rough is real. You showed up. That counts."
};

function renderHealthMoodCheckin(){
  const el = document.getElementById('healthMoodCheckin');
  if(!el) return;
  const today = new Date().toISOString().slice(0,10);
  const moodArr = D.moods || [];
  const todayMood = moodArr.find(m => m.date === today);
  const opt = todayMood ? HEALTH_MOOD_OPTIONS.find(o => o.level === todayMood.level) : null;
  const head = '<div style="font-family:var(--fh);font-size:1.3rem;letter-spacing:.05em;color:var(--tx);margin-bottom:.4rem;">How are you feeling today?</div>';
  const ack = todayMood && opt
    ? '<div style="font-size:.85rem;color:var(--tx);margin-bottom:.5rem;line-height:1.5;"><span style="font-size:1.15rem;">'+opt.emoji+'</span> <b>'+opt.label+'</b> — '+(HEALTH_MOOD_RESPONSES[todayMood.level]||'')+'</div><div style="font-size:.73rem;color:var(--tx2);margin-bottom:.7rem;">Tap a face to change your check-in.</div>'
    : '<div style="font-size:.8rem;color:var(--tx2);margin-bottom:.7rem;">Pick what matches your day. There are no wrong answers.</div>';
  const grid = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">'
    + HEALTH_MOOD_OPTIONS.map(o => {
        const active = todayMood && todayMood.level === o.level;
        const bg = active ? 'rgba(52,211,153,.22)' : 'rgba(52,211,153,.06)';
        const bd = active ? 'var(--section-health)' : 'rgba(52,211,153,.18)';
        return '<button type="button" onclick="logHealthMood('+o.level+')" style="background:'+bg+';border:1px solid '+bd+';border-radius:14px;padding:14px 4px;cursor:pointer;font-family:var(--fm);color:var(--tx);transition:transform .12s ease;"><div style="font-size:1.7rem;line-height:1;margin-bottom:4px;">'+o.emoji+'</div><div style="font-size:.7rem;font-weight:600;">'+o.label+'</div></button>';
      }).join('')
    + '</div>';
  el.innerHTML = head + ack + grid;
}

function logHealthMood(level){
  if(!D.moods) D.moods = [];
  const today = new Date().toISOString().slice(0,10);
  const existing = D.moods.find(m => m.date === today);
  if(existing) existing.level = level;
  else D.moods.push({date:today, level, ts:Date.now()});
  if(D.moods.length > 365) D.moods = D.moods.slice(-365);
  save();
  renderHealthMoodCheckin();
  if(typeof showToast === 'function') showToast('Logged ✓');
}

// ── 2. SLEEP TRACKER ───────────────────────────────────────────────
function logSleep(){
  const bed  = (document.getElementById('sleepBedtime')||{}).value || '';
  const wake = (document.getElementById('sleepWaketime')||{}).value || '';
  if(!bed || !wake){ showToast('Enter both bedtime and wake time'); return; }
  const [bH,bM] = bed.split(':').map(Number);
  const [wH,wM] = wake.split(':').map(Number);
  let hours = (wH + wM/60) - (bH + bM/60);
  if(hours < 0) hours += 24;
  hours = Math.round(hours * 10) / 10;
  const date = new Date().toISOString().slice(0,10);
  if(!D.sleepLog) D.sleepLog = [];
  D.sleepLog = D.sleepLog.filter(s => s.date !== date);
  D.sleepLog.unshift({id:Date.now(), date, bed, wake, hours});
  if(D.sleepLog.length > 90) D.sleepLog = D.sleepLog.slice(0, 90);
  save();
  const bI = document.getElementById('sleepBedtime'); if(bI) bI.value = '';
  const wI = document.getElementById('sleepWaketime'); if(wI) wI.value = '';
  renderSleepBars();
  renderSleepList();
  showToast('Sleep logged 💤');
}

function renderSleepBars(){
  const el = document.getElementById('sleepChart');
  if(!el) return;
  const log = D.sleepLog || [];
  const today = new Date();
  const days = [];
  for(let i = 6; i >= 0; i--){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const entry = log.find(s => s.date === ds);
    days.push({ds, hours: entry ? entry.hours : 0, hasData: !!entry, dl: d.toLocaleDateString('en-US',{weekday:'short'})});
  }
  const maxH = 12;
  el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;align-items:end;height:160px;">'
    + days.map(d => {
        const pct = Math.max(2, (d.hours / maxH) * 100);
        const color = !d.hasData ? 'rgba(255,255,255,.06)'
                    : d.hours >= 8 ? 'var(--section-health)'
                    : d.hours >= 6 ? '#fbbf24' : '#ef4444';
        return '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;">'
          + '<div style="flex:1;display:flex;align-items:flex-end;width:100%;">'
          + '<div style="width:100%;background:'+color+';height:'+pct+'%;border-radius:6px 6px 2px 2px;transition:height .3s ease;"></div>'
          + '</div>'
          + '<div style="font-size:.62rem;color:var(--tx2);font-weight:600;">'+d.dl+'</div>'
          + '<div style="font-size:.7rem;font-weight:700;color:'+(d.hasData?'var(--tx)':'var(--tx2)')+';">'+(d.hasData?d.hours+'h':'—')+'</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

function renderSleepList(){
  const el = document.getElementById('sleepList');
  if(!el) return;
  const log = D.sleepLog || [];
  if(!log.length){
    el.innerHTML = '<div style="text-align:center;font-size:.8rem;color:var(--tx2);padding:1rem;">No sleep logged yet — log last night to start your chart.</div>';
    return;
  }
  el.innerHTML = log.slice(0,14).map(s =>
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:.45rem .7rem;background:rgba(255,255,255,.04);border-radius:8px;margin-bottom:.3rem;font-size:.78rem;">'
    + '<span style="color:var(--tx2);">'+s.date+'</span>'
    + '<span style="color:var(--tx2);">'+(s.bed||'')+' → '+(s.wake||'')+'</span>'
    + '<span style="font-weight:800;color:var(--section-health);font-family:var(--fn);">'+s.hours+'h</span>'
    + '</div>'
  ).join('');
}

// ── 3. PHQ-2 WEEKLY MIND CHECK-IN ──────────────────────────────────
let _phq2Choices = {1:null, 2:null};

function renderPhq2(){
  const el = document.getElementById('ht-mind');
  if(!el) return;
  _phq2Choices = {1:null, 2:null};
  const log = D.phq2Log || [];
  const last = log[0];
  const today = new Date();
  let daysSince = 999;
  if(last && last.date){
    const d = new Date(last.date);
    daysSince = Math.floor((today - d) / 86400000);
  }
  const due = daysSince >= 7;

  let html = '';
  if(due){
    html += '<div class="card" style="border-left:4px solid var(--section-health);">'
      + '<div class="ct" style="margin-bottom:.4rem;">💚 Weekly Mind Check-In</div>'
      + '<div style="font-size:.85rem;color:var(--tx2);margin-bottom:1rem;line-height:1.6;">Two questions about the past week. There are no right answers — just honest ones. This stays private on your device.</div>'
      + '<div style="font-size:.88rem;font-weight:600;margin-bottom:.55rem;color:var(--tx);">1. Over the past week, how often have you felt down or hopeless?</div>'
      + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:1.1rem;">'
      + ['Never','Sometimes','Often','Almost always'].map((lbl,i) =>
          '<button type="button" class="phq2-opt" data-q="1" data-v="'+i+'" onclick="phq2Pick(this)" style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.18);border-radius:9px;padding:9px 4px;font-size:.74rem;color:var(--tx);cursor:pointer;font-family:var(--fm);">'+lbl+'</button>'
        ).join('')
      + '</div>'
      + '<div style="font-size:.88rem;font-weight:600;margin-bottom:.55rem;color:var(--tx);">2. Over the past week, how often have you had little interest in things you usually enjoy?</div>'
      + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:1.1rem;">'
      + ['Never','Sometimes','Often','Almost always'].map((lbl,i) =>
          '<button type="button" class="phq2-opt" data-q="2" data-v="'+i+'" onclick="phq2Pick(this)" style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.18);border-radius:9px;padding:9px 4px;font-size:.74rem;color:var(--tx);cursor:pointer;font-family:var(--fm);">'+lbl+'</button>'
        ).join('')
      + '</div>'
      + '<button class="btn bp" style="width:100%;background:var(--section-health);border-color:var(--section-health);color:#0b1020;" onclick="submitPhq2()">Submit check-in</button>'
      + '</div>';
  } else {
    const nextDue = 7 - daysSince;
    html += '<div class="card" style="border-left:4px solid var(--section-health);">'
      + '<div class="ct">💚 Weekly Mind Check-In</div>'
      + '<div style="font-size:.85rem;color:var(--tx2);line-height:1.55;margin-bottom:.5rem;">Next check-in in <b style="color:var(--tx);">'+nextDue+' day'+(nextDue===1?'':'s')+'</b>. Once a week is enough — more often turns into self-monitoring noise.</div>';
    if(last){
      const total = (last.q1||0)+(last.q2||0);
      html += '<div style="font-size:.75rem;color:var(--tx3);">Last check-in: '+last.date+' — score '+total+'/6</div>';
    }
    html += '</div>';
  }

  if(log.length){
    html += '<div class="card" style="margin-top:.8rem;">'
      + '<div class="ct">📈 Check-In History</div>'
      + '<div style="display:flex;flex-direction:column;gap:6px;">'
      + log.slice(0,12).map(e => {
          const tot = (e.q1||0)+(e.q2||0);
          const col = tot >= 4 ? '#fbbf24' : 'var(--section-health)';
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.45rem .75rem;background:rgba(255,255,255,.04);border-radius:8px;font-size:.78rem;">'
            + '<span style="color:var(--tx2);">'+e.date+'</span>'
            + '<span style="font-weight:700;font-family:var(--fn);color:'+col+';">'+tot+'/6</span>'
            + '</div>';
        }).join('')
      + '</div></div>';
  }

  el.innerHTML = html;
}

function phq2Pick(btn){
  const q = btn.getAttribute('data-q');
  const v = parseInt(btn.getAttribute('data-v'));
  _phq2Choices[q] = v;
  document.querySelectorAll('.phq2-opt[data-q="'+q+'"]').forEach(b => {
    b.style.background = 'rgba(52,211,153,.06)';
    b.style.borderColor = 'rgba(52,211,153,.18)';
  });
  btn.style.background = 'rgba(52,211,153,.22)';
  btn.style.borderColor = 'var(--section-health)';
}

function submitPhq2(){
  if(_phq2Choices[1] === null || _phq2Choices[2] === null){
    showToast('Pick an option for each question');
    return;
  }
  if(!D.phq2Log) D.phq2Log = [];
  D.phq2Log.unshift({
    id: Date.now(),
    date: new Date().toISOString().slice(0,10),
    q1: _phq2Choices[1],
    q2: _phq2Choices[2]
  });
  if(D.phq2Log.length > 52) D.phq2Log = D.phq2Log.slice(0, 52);
  const high = _phq2Choices[1] >= 2 && _phq2Choices[2] >= 2;
  _phq2Choices = {1:null, 2:null};
  save();
  if(high){
    setTimeout(() => {
      alert(
        "Thanks for being honest about how you're feeling.\n\n"
        + "What you're feeling is real, and it's a lot to carry alone. "
        + "Talking to someone — a parent, school counselor, or any trusted adult — "
        + "often helps more than it feels like it will.\n\n"
        + "If you're in crisis or having thoughts of harming yourself, "
        + "call or text 988 (the Suicide & Crisis Lifeline). They're available "
        + "24/7, in English and Spanish. You don't have to go through this alone."
      );
    }, 250);
    showToast('Check-in logged. Take care today. 💚');
  } else {
    showToast('Check-in logged. 💚');
  }
  renderPhq2();
}

// ── 4. NUTRITION MEAL LOG ──────────────────────────────────────────
const MEAL_TYPES = [
  {key:'breakfast', emoji:'🌅', label:'Breakfast'},
  {key:'lunch',     emoji:'☀️', label:'Lunch'},
  {key:'dinner',    emoji:'🌙', label:'Dinner'},
  {key:'snack',     emoji:'🍎', label:'Snack'}
];

function renderMealLog(){
  const el = document.getElementById('ht-meals');
  if(!el) return;
  const today = new Date().toISOString().slice(0,10);
  const meals = D.foodMeals || [];
  const todayMeals = meals.filter(m => m.date === today);
  const streak = calcMealStreak();

  let html = '<div class="card" style="border-left:4px solid var(--section-health);margin-bottom:.85rem;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;flex-wrap:wrap;gap:.5rem;">'
    + '<div class="ct" style="margin:0;">🍽️ Today\'s Meals</div>'
    + '<div style="display:flex;align-items:center;gap:.4rem;background:rgba(52,211,153,.1);padding:.3rem .7rem;border-radius:99px;">'
    +   '<span style="font-size:1.05rem;">🔥</span>'
    +   '<span style="font-size:.78rem;font-weight:700;color:var(--section-health);">'+streak+' day streak</span>'
    + '</div></div>'
    + '<div style="font-size:.78rem;color:var(--tx2);margin-bottom:.85rem;line-height:1.55;">Just log what you ate — no calorie counting. Awareness is the win.</div>';

  MEAL_TYPES.forEach(t => {
    const entry = todayMeals.find(m => m.type === t.key);
    html += '<div style="display:flex;align-items:center;gap:.65rem;padding:.55rem .7rem;background:rgba(255,255,255,.04);border-radius:10px;margin-bottom:.35rem;">'
      + '<span style="font-size:1.2rem;">'+t.emoji+'</span>'
      + '<div style="flex:1;min-width:0;">'
      +   '<div style="font-size:.65rem;color:var(--tx2);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">'+t.label+'</div>'
      +   (entry
            ? '<div style="font-size:.85rem;color:var(--tx);font-weight:500;">'+escapeHtml(entry.item)+'</div>'
            : '<div style="font-size:.78rem;color:var(--tx3);font-style:italic;">Not logged yet</div>')
      + '</div>'
      + (entry
          ? '<button class="db" onclick="deleteMeal('+entry.id+')">✕</button>'
          : '<button class="btn bp bs" onclick="promptMeal(\''+t.key+'\')">+ Add</button>')
      + '</div>';
  });
  html += '</div>'
    + '<div class="card">'
    + '<div class="ct">📅 Last 7 Days</div>'
    + '<div id="mealWeekSummary"></div>'
    + '<div style="font-size:.74rem;color:var(--tx3);margin-top:.5rem;line-height:1.55;">Green = 3+ meals logged · Yellow = 1-2 · Gray = no log. The point is the streak, not the score.</div>'
    + '</div>';

  el.innerHTML = html;
  renderMealWeekSummary();
}

function promptMeal(type){
  const item = prompt('What did you have for '+type+'?');
  if(!item || !item.trim()) return;
  if(!D.foodMeals) D.foodMeals = [];
  const today = new Date().toISOString().slice(0,10);
  D.foodMeals = D.foodMeals.filter(m => !(m.date === today && m.type === type));
  D.foodMeals.unshift({id:Date.now(), date:today, type, item:item.trim()});
  if(D.foodMeals.length > 500) D.foodMeals = D.foodMeals.slice(0, 500);
  save();
  renderMealLog();
  showToast('Logged 🍽️');
}

function deleteMeal(id){
  D.foodMeals = (D.foodMeals || []).filter(m => m.id !== id);
  save();
  renderMealLog();
}

function calcMealStreak(){
  const meals = D.foodMeals || [];
  if(!meals.length) return 0;
  let streak = 0;
  const today = new Date();
  for(let i = 0; i < 60; i++){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    if(meals.some(m => m.date === ds)) streak++;
    else break;
  }
  return streak;
}

function renderMealWeekSummary(){
  const el = document.getElementById('mealWeekSummary');
  if(!el) return;
  const today = new Date();
  const meals = D.foodMeals || [];
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">';
  for(let i = 6; i >= 0; i--){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const count = meals.filter(m => m.date === ds).length;
    const dl = d.toLocaleDateString('en-US',{weekday:'short'});
    const dark = count >= 1;
    const color = count >= 3 ? 'var(--section-health)' : count >= 1 ? '#fbbf24' : 'rgba(255,255,255,.06)';
    const textCol = dark ? 'rgba(0,0,0,.85)' : 'var(--tx3)';
    html += '<div style="text-align:center;padding:.55rem 0;background:'+color+';border-radius:8px;">'
      + '<div style="font-size:.62rem;color:'+textCol+';font-weight:700;">'+dl+'</div>'
      + '<div style="font-size:1.05rem;font-weight:800;color:'+textCol+';margin-top:2px;">'+count+'</div>'
      + '</div>';
  }
  html += '</div>';
  el.innerHTML = html;
}

