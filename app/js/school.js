/* =============================================================
   school.js — GPA tracker, assignments, study timer,
               4-week schedule, monthly schedule, calendar
============================================================= */

// ── SCHOOL ────────────────────────────────────────────────────
function sTab(tab,btn){
  // School tabs
  document.querySelectorAll('[id^="st-"]').forEach(t=>t.style.display='none');
  document.querySelectorAll('.schoolTabs .tab').forEach(b=>b.classList.remove('active'));
  const te=document.getElementById('st-'+tab);
  if(te) te.style.display='block';
  if(btn) btn.classList.add('active');
  if(tab==='gpa') renderGPA();
  // Phase F: AI Study Partner — initialize default mode visual state on first open.
  if(tab==='aiTutor'){
    const def = document.getElementById('apModeExplain');
    if(def && typeof aiPartnerSetMode === 'function') aiPartnerSetMode('explain', def);
  }
}
function prepTab(tab,btn){
  document.querySelectorAll('[id^="pp-"]').forEach(t=>t.style.display='none');
  document.querySelectorAll('#prepTabs .tab').forEach(b=>b.classList.remove('active'));
  const te=document.getElementById('pp-'+tab);
  if(te) te.style.display='block';
  if(btn) btn.classList.add('active');
}
function rTab(tab,btn){
  // Resources tabs — uses rs- prefix to avoid sTab collision
  document.querySelectorAll('[id^="rs-"]').forEach(t=>t.style.display='none');
  document.querySelectorAll('.resTabs .tab').forEach(b=>b.classList.remove('active'));
  const te=document.getElementById('rs-'+tab);
  if(te) te.style.display='block';
  if(btn) btn.classList.add('active');
}

function saveClass(){
  const id=document.getElementById('editClassId').value;
  const name=(document.getElementById('className').value||'').trim();
  const teacher=(document.getElementById('classTeacher').value||'').trim();
  const room=(document.getElementById('classRoom').value||'').trim();
  const grade=parseFloat(document.getElementById('classGrade').value)||0;
  const color=document.getElementById('classColor').value;
  const notes=(document.getElementById('classNotes').value||'').trim();
  if(!name){showToast('Enter class name');return;}
  if(!D.classes) D.classes=[];
  if(id){ const cls=D.classes.find(c=>c.id==id); if(cls) Object.assign(cls,{name,teacher,room,grade,color,notes}); }
  else { D.classes.push({id:Date.now(),name,teacher,room,grade,color,notes}); }
  ['className','classTeacher','classRoom','classGrade','classNotes'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  document.getElementById('editClassId').value=''; document.getElementById('classModalTitle').textContent='📖 ADD CLASS';
  save(); renderClasses(); renderGPA(); closeModal('classModal'); showToast('Class saved!'); refreshAsgClassSelect();
}

function editClass(id){ const cls=(D.classes||[]).find(c=>c.id===id); if(!cls) return; document.getElementById('editClassId').value=id; document.getElementById('className').value=cls.name; document.getElementById('classTeacher').value=cls.teacher||''; document.getElementById('classRoom').value=cls.room||''; document.getElementById('classGrade').value=cls.grade||''; document.getElementById('classColor').value=cls.color||'c'; document.getElementById('classNotes').value=cls.notes||''; document.getElementById('classModalTitle').textContent='✎ EDIT CLASS'; openModal('classModal'); }
function deleteClass(id){ if(!confirm('Delete this class?')) return; D.classes=(D.classes||[]).filter(c=>c.id!==id); save(); renderClasses(); renderGPA(); }

const CCOLS={c:'var(--c)',g:'var(--g)',gr:'var(--gr)',p:'var(--p)',pk:'var(--pk)',or:'var(--or)'};
function gradeToLetter(g){ if(g>=93)return'A';if(g>=90)return'A-';if(g>=87)return'B+';if(g>=83)return'B';if(g>=80)return'B-';if(g>=77)return'C+';if(g>=73)return'C';if(g>=70)return'C-';if(g>=67)return'D+';if(g>=60)return'D';return'F'; }
function gradeToGPA(g){ if(g>=93)return 4.0;if(g>=90)return 3.7;if(g>=87)return 3.3;if(g>=83)return 3.0;if(g>=80)return 2.7;if(g>=77)return 2.3;if(g>=73)return 2.0;if(g>=70)return 1.7;if(g>=67)return 1.3;if(g>=60)return 1.0;return 0.0; }
function calcGPA(){ const cls=D.classes||[]; if(!cls.length) return null; return cls.reduce((a,c)=>a+gradeToGPA(c.grade||0),0)/cls.length; }

function renderClasses(){
  const el=document.getElementById('classesList'); if(!el) return;
  if(!(D.classes||[]).length){el.innerHTML='<div style="color:#c8d4e8;text-align:center;padding:2.5rem;grid-column:1/-1;font-size:.88rem;">No classes yet — click "+ Add Class"!</div>';return;}
  el.innerHTML=D.classes.map(c=>{
    const letter=gradeToLetter(c.grade||0), col=CCOLS[c.color||'c'];
    return`<div class="cc" style="border-top:3px solid ${col};">
      <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.65rem;">
        <div class="gb g${letter.charAt(0)}">${letter}</div>
        <div style="flex:1;"><div style="font-weight:800;font-size:.97rem;">${escapeHtml(c.name)}</div>
        <div style="font-size:.72rem;color:#c8d4e8;">${c.teacher?escapeHtml(c.teacher)+' · ':''}${escapeHtml(c.room||'')}</div></div>
        <div style="font-family:var(--fn);font-size:.97rem;font-weight:700;color:${col};">${c.grade||0}%</div>
      </div>
      <div class="pt" style="height:5px;margin-bottom:.55rem;"><div class="pf" style="background:${col};width:${c.grade||0}%;"></div></div>
      ${c.notes?`<div style="font-size:.73rem;color:#c8d4e8;margin-bottom:.48rem;">${escapeHtml(c.notes)}</div>`:''}
      <div style="display:flex;gap:.32rem;">
        <button class="btn bo bs" style="color:${col};border-color:${col};flex:1;" onclick="editClass(${c.id})">✎ Edit</button>
        <button class="btn bda bs" onclick="deleteClass(${c.id})">✕</button>
      </div>
    </div>`;
  }).join('');
}

function renderGPA(){
  const gpa=calcGPA();
  const col=!gpa?'var(--tx2)':gpa>=3.5?'var(--gr)':gpa>=3.0?'var(--c)':gpa>=2.0?'var(--g)':'var(--pk)';
  const el=document.getElementById('gpaDisp'),be=document.getElementById('gpaBar'),se=document.getElementById('gpaNote');
  if(el){el.textContent=gpa?gpa.toFixed(2):'—';el.style.color=col;}
  if(be) be.style.width=gpa?(gpa/4*100)+'%':'0%';
  if(se) se.textContent=gpa?(gpa>=3.5?'🎓 Honor Roll!':gpa>=3.0?'✅ Good Standing':gpa>=2.0?'📊 Passing':'⚠ Needs Improvement')+' · '+D.classes.length+' classes':'Add classes with grades';
  const qe=document.getElementById('qsGPA'); if(qe) qe.textContent=gpa?gpa.toFixed(2):'—';
  const db=document.getElementById('gradeBreak'); if(!db) return;
  db.innerHTML=(D.classes||[]).map(c=>{
    const col2=CCOLS[c.color||'c'];
    return`<div style="margin-bottom:.55rem;"><div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.2rem;"><span>${c.name}</span><span style="color:${col2};font-weight:700;">${gradeToLetter(c.grade||0)} · ${c.grade||0}%</span></div><div class="pt" style="height:5px;"><div class="pf" style="background:${col2};width:${c.grade||0}%;"></div></div></div>`;
  }).join('');
}

function refreshAsgClassSelect(){ const sel=document.getElementById('asgClass'); if(!sel) return; sel.innerHTML='<option value="">— Select Class —</option>'+(D.classes||[]).map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join(''); }
function addAsg(){ const name=(document.getElementById('asgName').value||'').trim(),classId=document.getElementById('asgClass').value,due=document.getElementById('asgDue').value,pri=document.getElementById('asgPri').value,notes=(document.getElementById('asgNotes').value||'').trim(); if(!name){showToast('Enter assignment name');return;} if(!D.assignments) D.assignments=[]; D.assignments.push({id:Date.now(),name,classId,due,pri,notes,done:false}); D.assignments.sort((a,b)=>(a.due||'').localeCompare(b.due||'')); document.getElementById('asgName').value=''; document.getElementById('asgNotes').value=''; save(); renderAsg(); showToast('Added!'); }
function toggleAsg(id){ const a=(D.assignments||[]).find(a=>a.id===id); if(a){a.done=!a.done;save();renderAsg();} }
function editAsg(id){ const a=(D.assignments||[]).find(a=>a.id===id); if(!a) return; const n=prompt('Edit:',a.name); if(!n) return; a.name=n.trim(); save(); renderAsg(); }
function deleteAsg(id){ D.assignments=(D.assignments||[]).filter(a=>a.id!==id); save(); renderAsg(); }
function asgF(f,btn){ _asgFilter=f; document.querySelectorAll('#st-assignments .tab').forEach(b=>b.classList.remove('active')); if(btn) btn.classList.add('active'); renderAsg(); }

function renderAsg(){
  const el=document.getElementById('asgList'); if(!el) return;
  let list=D.assignments||[];
  if(_asgFilter==='pending') list=list.filter(a=>!a.done);
  else if(_asgFilter==='done') list=list.filter(a=>a.done);
  if(!list.length){el.innerHTML='<div style="font-size:.82rem;color:#c8d4e8;text-align:center;padding:.8rem;">Nothing here</div>';return;}
  const pc={high:'ph',med:'pm',low:'pl'}, cls=D.classes||[];
  el.innerHTML=list.slice(0,30).map(a=>{
    const cN=(cls.find(c=>c.id==a.classId)||{}).name||'';
    const ov=a.due&&!a.done&&new Date(a.due)<new Date();
    return`<div class="ai2 ${pc[a.pri]||'pl'}" style="${a.done?'opacity:.5;':''}">
      <div class="ck${a.done?' on':''}" onclick="toggleAsg(${a.id})">${a.done?'✓':''}</div>
      <div style="flex:1;"><div style="font-size:.85rem;font-weight:600;${a.done?'text-decoration:line-through;':''}">${escapeHtml(a.name)}</div>
      <div style="font-size:.68rem;color:#c8d4e8;">${cN?cN+' · ':''}${a.due?'Due: '+a.due:''}${ov?' <span style="color:var(--pk);">OVERDUE</span>':''}</div></div>
      <button class="eb" onclick="editAsg(${a.id})">✎</button>
      <button class="db" onclick="deleteAsg(${a.id})">✕</button>
    </div>`;
  }).join('');
}

// ── STUDY TIMER ───────────────────────────────────────────────
function setTimer(m){ if(_timerRunning) return; _timerSecs=m*60; renderTimer(); }
function renderTimer(){ const m=Math.floor(_timerSecs/60),s=_timerSecs%60; const el=document.getElementById('timerDisp'); if(el) el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
function startTimer(){ if(_timerRunning) return; _timerRunning=true; _timerStart=Date.now(); const btn=document.getElementById('timerBtn'); if(btn) btn.textContent='⏸ Running...'; _timerInterval=setInterval(()=>{ _timerSecs--; renderTimer(); if(_timerSecs<=0){stopTimer();showToast('⏱ Session done! Great work!');logStudy();} },1000); }
function stopTimer(){ clearInterval(_timerInterval); _timerRunning=false; const btn=document.getElementById('timerBtn'); if(btn) btn.textContent='▶ Start'; }
function resetTimer(){ stopTimer(); _timerSecs=25*60; renderTimer(); }
function logStudy(){ const sub=(document.getElementById('timerSubj').value||'Study session').trim(); const mins=Math.round((Date.now()-(_timerStart||Date.now()))/60000); if(!D.studyLog) D.studyLog=[]; D.studyLog.unshift({id:Date.now(),subject:sub,mins,date:new Date().toLocaleDateString()}); save(); renderStudyLog(); }
function renderStudyLog(){ const el=document.getElementById('studyLog'); if(!el) return; if(!(D.studyLog||[]).length){el.innerHTML='<div style="font-size:.8rem;color:#c8d4e8;text-align:center;padding:1rem;">No sessions yet</div>';return;} const total=D.studyLog.reduce((a,s)=>a+s.mins,0); el.innerHTML=`<div style="text-align:center;margin-bottom:.65rem;padding:.45rem;background:rgba(255,255,255,.1);border-radius:7px;font-size:.8rem;">Total: <strong style="color:var(--c);">${total} mins</strong></div>`+D.studyLog.slice(0,20).map(s=>`<div style="display:flex;justify-content:space-between;padding:.38rem .6rem;background:rgba(255,255,255,.1);border-radius:7px;margin-bottom:.28rem;font-size:.8rem;"><span>${s.subject}</span><span style="color:var(--c);">${s.mins}m · ${s.date}</span><button class="db" onclick="D.studyLog=D.studyLog.filter(x=>x.id!=${s.id});save();renderStudyLog();">✕</button></div>`).join(''); }

// ── 4-WEEK SCHEDULE ───────────────────────────────────────────
// Built-in activities
const ACTS_BASE=[
  {v:'',l:'— Free —',bg:'',tc:''},
  {v:'work',l:'💼 Work',bg:'rgba(56,189,248,.18)',tc:'#7dd3fc'},
  {v:'school',l:'📚 School',bg:'rgba(52,211,153,.16)',tc:'#6ee7b7'},
  {v:'jiujitsu',l:'🥋 Jiu Jitsu',bg:'rgba(244,114,182,.2)',tc:'#f9a8d4'},
  {v:'gym',l:'🏋️ Gym',bg:'rgba(52,211,153,.16)',tc:'#6ee7b7'},
  {v:'church',l:'⛪ Church',bg:'rgba(192,132,252,.2)',tc:'#d8b4fe'},
  {v:'family',l:'👨‍👩‍👧‍👦 Family',bg:'rgba(251,146,60,.16)',tc:'#fdba74'},
  {v:'music',l:'🎧 Music/DJ',bg:'rgba(56,189,248,.16)',tc:'#7dd3fc'},
  {v:'sleep',l:'😴 Sleep',bg:'rgba(129,140,248,.2)',tc:'#a5b4fc'},
  {v:'study',l:'📖 Study',bg:'rgba(251,191,36,.15)',tc:'#fcd34d'},
  {v:'free',l:'🎮 Free Time',bg:'rgba(100,200,100,.14)',tc:'#86efac'},
  {v:'meal',l:'🍽 Meal Prep',bg:'rgba(251,146,60,.14)',tc:'#fdba74'},
  {v:'sports',l:'⚽ Sports',bg:'rgba(52,211,153,.18)',tc:'#6ee7b7'},
  {v:'prayer',l:'🙏 Prayer/Dev',bg:'rgba(192,132,252,.16)',tc:'#d8b4fe'},
  {v:'drive',l:'🚗 Driving',bg:'rgba(148,163,184,.12)',tc:'#cbd5e1'},
  {v:'work2',l:'💻 Side Hustle',bg:'rgba(56,189,248,.14)',tc:'#7dd3fc'},
  {v:'rest',l:'🛋 Rest/Recovery',bg:'rgba(129,140,248,.15)',tc:'#a5b4fc'},
  {v:'errands',l:'🛒 Errands',bg:'rgba(148,163,184,.1)',tc:'#cbd5e1'},
];

function getAllActs(){
  const hidden=D.hiddenActivities||[];
  const base=ACTS_BASE.filter(a=>a.v===''||!hidden.includes(a.v));
  const custom=(D.customActivities||[]).map(a=>({
    v:'ca_'+a.key, l:(a.emoji||'📌')+' '+a.name, bg:a.color||'rgba(255,255,255,.08)', tc:'#fff', custom:true, key:a.key
  }));
  return [...base,...custom];
}

function hideBuiltinActivity(v){
  if(!D.hiddenActivities) D.hiddenActivities=[];
  if(!D.hiddenActivities.includes(v)) D.hiddenActivities.push(v);
  save(); renderActivityList(); buildSchedule();
}

function restoreAllActivities(){
  D.hiddenActivities=[];
  save(); renderActivityList(); buildSchedule(); showToast('All built-in activities restored!');
}

function restoreActivity(v){
  D.hiddenActivities=(D.hiddenActivities||[]).filter(h=>h!==v);
  save(); renderActivityList(); buildSchedule();
}

function getActStyle(v){
  const all=getAllActs(); const a=all.find(x=>x.v===v); return a||{bg:'',tc:''};
}

// Activity management in settings
function addCustomActivity(){
  const emoji=(document.getElementById('newActEmoji').value||'📌').trim()||'📌';
  const name=(document.getElementById('newActName').value||'').trim();
  const color=document.getElementById('newActColor').value;
  if(!name){showToast('Enter activity name');return;}
  if(!D.customActivities) D.customActivities=[];
  const key='ca'+Date.now();
  D.customActivities.push({key,emoji,name,color});
  document.getElementById('newActEmoji').value='';
  document.getElementById('newActName').value='';
  save(); renderActivityList(); buildSchedule(); showToast(emoji+' '+name+' added!');
}
function deleteCustomActivity(key){
  D.customActivities=(D.customActivities||[]).filter(a=>a.key!==key);
  save(); renderActivityList(); buildSchedule();
}
function renderActivityList(){
  const el=document.getElementById('activityList'); if(!el) return;
  const hidden=D.hiddenActivities||[];
  const custom=D.customActivities||[];
  // Show all built-ins (so user can see and restore hidden ones)
  const builtins=ACTS_BASE.filter(a=>a.v!=='');
  const allRows=[
    ...builtins.map(a=>({v:a.v,l:a.l,custom:false,hidden:hidden.includes(a.v)})),
    ...custom.map(a=>({v:'ca_'+a.key,l:(a.emoji||'📌')+' '+a.name,custom:true,key:a.key,hidden:false}))
  ];
  const hasHidden=hidden.length>0;
  el.innerHTML=(hasHidden?`<div style="margin-bottom:.4rem;"><button class="btn bgr bs" style="width:100%;font-size:.72rem;" onclick="restoreAllActivities()">↺ Restore All Hidden (${hidden.length})</button></div>`:'')+
  allRows.map(a=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .5rem;background:rgba(255,255,255,${a.hidden?.02:.04});border-radius:6px;margin-bottom:.22rem;${a.hidden?'opacity:.4;':''}" >
      <span style="flex:1;font-size:.78rem;${a.hidden?'text-decoration:line-through;':''}">${a.l}</span>
      ${a.hidden
        ? `<button class="eb" onclick="${a.custom?`deleteCustomActivity('${a.key}')`:`restoreActivity('${a.v}')`}" style="color:var(--gr);font-size:.7rem;">↺</button>`
        : `<button class="db" onclick="${a.custom?`deleteCustomActivity('${a.key}')`:`hideBuiltinActivity('${a.v}')`}" style="color:#f87171;font-size:.85rem;">✕</button>`
      }
    </div>`).join('');
}

// ── MONTHLY SCHEDULE ─────────────────────────────────────────

const TIMESLOTS=[
  {l:'6 AM',h:6},{l:'7 AM',h:7},{l:'8 AM',h:8},{l:'9 AM',h:9},{l:'10 AM',h:10},
  {l:'11 AM',h:11},{l:'12 PM',h:12},{l:'1 PM',h:13},{l:'2 PM',h:14},{l:'3 PM',h:15},
  {l:'4 PM',h:16},{l:'5 PM',h:17},{l:'6 PM',h:18},{l:'7 PM',h:19},{l:'8 PM',h:20},
  {l:'9 PM',h:21},{l:'10 PM',h:22},{l:'11 PM',h:23},
];

const MONTH_NAMES=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const MONTH_SHORT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let _schedY=new Date().getFullYear();
let _schedM=new Date().getMonth();
let _schedPickerY=_schedY;
let _schedView='day'; // 'day' | 'week' | 'month'
let _schedDayOffset=0;
let _schedWeekOffset=0;

function schedSetView(v){
  _schedView=v;
  _schedDayOffset=0; _schedWeekOffset=0;
  // 2026-06-07 — Phase 3 B3-A: active state is now driven by the
  // .is-active class on the .sv-card Power Cards in the view strip
  // + the .hb-tab fallback buttons. renderScheduleViewStrip handles
  // the visual sync; legacy inline hex (#38bdf8 / rgba(56,189,248,*))
  // was removed.
  if(typeof renderScheduleViewStrip === 'function') renderScheduleViewStrip();
  buildSchedule();
}

function schedNav(dir){
  if(_schedView==='day') _schedDayOffset+=dir;
  else if(_schedView==='week') _schedWeekOffset+=dir;
  else { if(dir<0){_schedM--;if(_schedM<0){_schedM=11;_schedY--;}}else{_schedM++;if(_schedM>11){_schedM=0;_schedY++;}} }
  buildSchedule();
}

function schedGoToday(){
  const t=new Date(); _schedY=t.getFullYear(); _schedM=t.getMonth();
  _schedDayOffset=0; _schedWeekOffset=0;
  closeSchedPicker(); buildSchedule();
}

function schedPrevMonth(){
  _schedM--; if(_schedM<0){_schedM=11;_schedY--;} buildSchedule();
}
function schedNextMonth(){
  _schedM++; if(_schedM>11){_schedM=0;_schedY++;} buildSchedule();
}
function jumpToToday(){
  schedGoToday();
}

function toggleSchedPicker(){
  const p=document.getElementById('schedPicker'); if(!p) return;
  const open=p.style.display==='block';
  p.style.display=open?'none':'block';
  if(!open){_schedPickerY=_schedY; renderSchedPicker();}
}
function closeSchedPicker(){
  const p=document.getElementById('schedPicker'); if(p) p.style.display='none';
}
function schedPickerYear(dir){
  _schedPickerY+=dir; renderSchedPicker();
}
function renderSchedPicker(){
  const yEl=document.getElementById('schedPickerYear');
  const mEl=document.getElementById('schedPickerMonths');
  if(yEl) yEl.textContent=_schedPickerY;
  if(!mEl) return;
  // 2026-06-07 — Phase 3 B3-A: inline hex (rgba(56,189,248,.2)) for
  // the active month cell removed; .sv-picker-cell handles styling
  // via the .is-active class in app.css (gates on var(--c)).
  mEl.innerHTML=MONTH_SHORT.map((m,i)=>{
    const active=(i===_schedM&&_schedPickerY===_schedY);
    return '<button class="sv-picker-cell' + (active?' is-active':'') + '"'
      + ' onclick="schedJumpTo(' + _schedPickerY + ',' + i + ')">' + m + '</button>';
  }).join('');
}

// 2026-06-07 — Phase 3 B3-A: Schedule Power Card view strip.
//
// Three cards (Day / Week / Month) replace the previous inline-styled
// .btn.bgh button row. Each card carries a circular SVG progress ring
// showing "scheduled slots / total slots" for that view's current
// window. Tapping switches view AND zeros the offset (matches the
// legacy button behavior). Mirrors the Skills/Health/Goals domain
// strips — same .sv-card + .sv-ring pattern, scoped to #s-schedule.
function _schedCountSlots(view){
  const sched = (D && D.schedule) ? D.schedule : {};
  function dKey(d, h){
    return d.getFullYear() + '-'
      + String(d.getMonth()+1).padStart(2,'0') + '-'
      + String(d.getDate()).padStart(2,'0') + '_' + h;
  }
  const hours = (typeof TIMESLOTS !== 'undefined' && Array.isArray(TIMESLOTS))
    ? TIMESLOTS.map(function(s){ return s.h; })
    : [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
  let filled = 0, total = 0;
  if(view === 'day'){
    const base = new Date(); base.setHours(0,0,0,0);
    base.setDate(base.getDate() + (typeof _schedDayOffset === 'number' ? _schedDayOffset : 0));
    hours.forEach(function(h){
      total++;
      if(sched[dKey(base, h)]) filled++;
    });
  } else if(view === 'week'){
    const base = new Date(); base.setHours(0,0,0,0);
    base.setDate(base.getDate() - base.getDay() + ((typeof _schedWeekOffset === 'number' ? _schedWeekOffset : 0) * 7));
    for(let i = 0; i < 7; i++){
      const d = new Date(base); d.setDate(base.getDate() + i);
      hours.forEach(function(h){
        total++;
        if(sched[dKey(d, h)]) filled++;
      });
    }
  } else { // month
    const y = (typeof _schedY === 'number') ? _schedY : new Date().getFullYear();
    const m = (typeof _schedM === 'number') ? _schedM : new Date().getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    for(let d = 1; d <= dim; d++){
      const dt = new Date(y, m, d);
      hours.forEach(function(h){
        total++;
        if(sched[dKey(dt, h)]) filled++;
      });
    }
  }
  return { filled: filled, total: total };
}

const SCHED_VIEWS = [
  { key:'day',   icon:'📅', name:'Day',   accent:'var(--c)' },
  { key:'week',  icon:'📆', name:'Week',  accent:'var(--p)' },
  { key:'month', icon:'🗓️', name:'Month', accent:'var(--section-daily-life, #f59e0b)' }
];

function renderScheduleViewStrip(){
  const host = document.getElementById('scheduleViewStrip');
  if(!host) return;
  const cur = (typeof _schedView === 'string') ? _schedView : 'day';
  host.innerHTML = SCHED_VIEWS.map(function(view){
    const s = _schedCountSlots(view.key);
    const total = s.total || 1;
    const pct = Math.min(1, s.filled / total);
    const offset = (125.66 * (1 - pct)).toFixed(2);
    const isActive = (cur === view.key);
    return '<button type="button" class="sv-card' + (isActive ? ' is-active' : '') + '"'
      + ' data-view="' + view.key + '"'
      + ' style="--sv-accent:' + view.accent + ';"'
      + ' onclick="schedSetView(\'' + view.key + '\')"'
      + ' aria-label="' + view.name + ' view, ' + s.filled + ' of ' + s.total + ' slots scheduled"'
      + ' aria-pressed="' + (isActive ? 'true' : 'false') + '">'
      + '<span class="sv-ring" aria-hidden="true">'
        + '<svg viewBox="0 0 48 48">'
          + '<circle class="sv-ring-track" cx="24" cy="24" r="20"></circle>'
          + '<circle class="sv-ring-fill"  cx="24" cy="24" r="20"'
            + ' stroke-dasharray="125.66"'
            + ' stroke-dashoffset="' + offset + '"></circle>'
        + '</svg>'
        + '<span class="sv-icon">' + view.icon + '</span>'
      + '</span>'
      + '<span class="sv-label">' + view.name + '</span>'
      + '<span class="sv-progress">' + s.filled + ' of ' + s.total + '</span>'
    + '</button>';
  }).join('');
}
function schedJumpTo(y,m){
  _schedY=y; _schedM=m; closeSchedPicker(); buildSchedule();
}

document.addEventListener('click',e=>{
  const p=document.getElementById('schedPicker');
  const btn=document.getElementById('schedMonthLbl');
  if(p&&p.style.display==='block'&&!p.contains(e.target)&&e.target!==btn) closeSchedPicker();
});

function buildSchedule(){
  initScheduleBlockPicker();
  const wrap=document.getElementById('schedWrap'); if(!wrap) return;
  const lbl=document.getElementById('schedMonthLbl');
  const acts=getAllActs();
  const actOpts=acts.map(a=>`<option value="${a.v}">${a.l}</option>`).join('');
  const sched=D.schedule||{};
  const shortDay=['Su','Mo','Tu','We','Th','Fr','Sa'];
  const isWeekend=d=>(d.getDay()===0||d.getDay()===6);
  const todayStr=new Date().toDateString();
  function dk(d,h){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'_'+h;}
  function isToday(d){return d.toDateString()===todayStr;}
  const MNS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  if(_schedView==='day'){
    const base=new Date(); base.setHours(0,0,0,0);
    base.setDate(base.getDate()+_schedDayOffset);
    if(lbl) lbl.textContent=shortDay[base.getDay()]+', '+MNS[base.getMonth()]+' '+base.getDate()+', '+base.getFullYear();
    const isTd=isToday(base);
    let html='<table style="width:100%;border-collapse:collapse;">';
    TIMESLOTS.forEach(slot=>{
      const k=dk(base,slot.h); const val=sched[k]||'';
      const act=acts.find(a=>a.v===val)||{bg:'',tc:''};
      const bg=act.bg||(isTd?'rgba(56,189,248,.04)':'');
      html+=`<tr>
        <td class="time-cell" style="width:56px;">${slot.l}</td>
        <td class="act-cell${isTd?' today-col':''}" style="${bg?'background:'+bg+';':''}${act.tc?'color:'+act.tc+';':''}">
          <select onchange="setCell('${k}',this.value,this.closest('td'))" style="width:100%;${act.tc?'color:'+act.tc+';':''}">
            ${actOpts.replace(`value="${val}"`,`value="${val}" selected`)}
          </select>
        </td>
      </tr>`;
    });
    html+='</table>';
    wrap.innerHTML=html;

  } else if(_schedView==='week'){
    const base=new Date(); base.setHours(0,0,0,0);
    base.setDate(base.getDate()-base.getDay()+(_schedWeekOffset*7));
    const days=[]; for(let i=0;i<7;i++){const d=new Date(base);d.setDate(base.getDate()+i);days.push(d);}
    const we=days[6];
    if(lbl) lbl.textContent=MNS[days[0].getMonth()]+' '+days[0].getDate()+' – '+MNS[we.getMonth()]+' '+we.getDate()+', '+we.getFullYear();
    let html='<table class="sched-table"><thead><tr>';
    html+='<th style="min-width:52px;text-align:right;padding-right:6px;font-size:.6rem;color:var(--tx2);position:sticky;left:0;z-index:10;background:var(--s1);">TIME</th>';
    days.forEach(d=>{
      const isTd=isToday(d); const wknd=isWeekend(d);
      html+=`<th class="${isTd?'today-col':''}" style="min-width:72px;${wknd&&!isTd?'background:rgba(255,255,255,.04);':''}">
        <div style="font-size:.58rem;font-weight:600;color:${isTd?'var(--c)':wknd?'var(--p)':'var(--tx2)'};">${shortDay[d.getDay()]}</div>
        <div style="font-size:.78rem;font-weight:800;color:${isTd?'var(--c)':'inherit'};">${d.getDate()}</div>
      </th>`;
    });
    html+='</tr></thead><tbody>';
    TIMESLOTS.forEach(slot=>{
      html+=`<tr><td class="time-cell" style="position:sticky;left:0;z-index:5;">${slot.l}</td>`;
      days.forEach(d=>{
        const isTd=isToday(d); const wknd=isWeekend(d);
        const k=dk(d,slot.h); const val=sched[k]||'';
        const act=acts.find(a=>a.v===val)||{bg:'',tc:''};
        const bg=act.bg||(isTd?'rgba(56,189,248,.04)':wknd?'rgba(34,211,238,.03)':'');
        html+=`<td class="act-cell${isTd?' today-col':''}" style="${bg?'background:'+bg+';':''}${act.tc?'color:'+act.tc+';':''}">
          <select onchange="setCell('${k}',this.value,this.closest('td'))" style="${act.tc?'color:'+act.tc+';':''}">
            ${actOpts.replace(`value="${val}"`,`value="${val}" selected`)}
          </select>
        </td>`;
      });
      html+='</tr>';
    });
    html+='</tbody></table>';
    wrap.innerHTML=html;

  } else {
    // Month view (original)
    if(lbl) lbl.textContent=MONTH_NAMES[_schedM]+' '+_schedY+' ▾';
    const daysInMonth=new Date(_schedY,_schedM+1,0).getDate();
    const days=[]; for(let d=1;d<=daysInMonth;d++) days.push(new Date(_schedY,_schedM,d));
    let html='<table class="sched-table"><thead><tr>';
    html+='<th style="min-width:56px;text-align:right;padding-right:6px;font-size:.6rem;color:var(--tx2);position:sticky;left:0;z-index:10;background:var(--s1);">TIME</th>';
    days.forEach(d=>{
      const isTd=isToday(d); const wknd=isWeekend(d);
      html+=`<th class="${isTd?'today-col':''}" style="min-width:56px;${wknd&&!isTd?'background:rgba(255,255,255,.04);':''}">
        <div style="font-size:.58rem;font-weight:600;color:${isTd?'var(--c)':wknd?'var(--p)':'var(--tx2)'};">${shortDay[d.getDay()]}</div>
        <div style="font-size:.78rem;font-weight:800;color:${isTd?'var(--c)':'inherit'};">${d.getDate()}</div>
      </th>`;
    });
    html+='</tr></thead><tbody>';
    TIMESLOTS.forEach(slot=>{
      html+=`<tr><td class="time-cell" style="position:sticky;left:0;z-index:5;">${slot.l}</td>`;
      days.forEach(d=>{
        const isTd=isToday(d); const wknd=isWeekend(d);
        const k=dk(d,slot.h); const val=sched[k]||'';
        const act=acts.find(a=>a.v===val)||{bg:'',tc:''};
        const bg=act.bg||(isTd?'rgba(56,189,248,.04)':wknd?'rgba(34,211,238,.03)':'');
        html+=`<td class="act-cell${isTd?' today-col':''}" style="${bg?'background:'+bg+';':''}${act.tc?'color:'+act.tc+';':''}">
          <select onchange="setCell('${k}',this.value,this.closest('td'))" style="${act.tc?'color:'+act.tc+';':''}">
            ${actOpts.replace(`value="${val}"`,`value="${val}" selected`)}
          </select>
        </td>`;
      });
      html+='</tr>';
    });
    html+='</tbody></table>';
    wrap.innerHTML=html;
  }
  // 2026-06-07 — Phase 3 B3-A: refresh the view-strip rings so they
  // track the current nav window (schedNav / schedGoToday / schedJumpTo
  // all funnel back through buildSchedule).
  if(typeof renderScheduleViewStrip === 'function') renderScheduleViewStrip();
}

function setCell(k,v,cell){
  if(!D.schedule) D.schedule={};
  D.schedule[k]=v;
  const act=getActStyle(v);
  cell.style.background=act.bg||'';
  cell.style.color=act.tc||'';
  const sel=cell.querySelector('select');
  if(sel) sel.style.color=act.tc||'';
  save();
}


// ── SCHEDULE BLOCK ADD FORM ───────────────────────────────────
// Lets the user fill a range of hours across one or more days
// in a single action instead of selecting each cell dropdown.

function initScheduleBlockPicker(){
  if(document.getElementById('schedBlockPicker')) return;
  const section = document.getElementById('s-schedule'); if(!section) return;
  // Insert before the first .card inside the schedule section
  const card = section.querySelector('.card'); if(!card) return;

  const acts = getAllActs().filter(a=>a.v!=='');
  const actOpts = acts.map(a=>`<option value="${a.v}">${a.l}</option>`).join('');

  const el = document.createElement('div');
  el.id = 'schedBlockPicker';
  el.style.cssText = 'background:rgba(255,255,255,.03);border:1px solid rgba(56,189,248,.18);border-radius:14px;padding:.85rem 1rem;margin-bottom:.8rem;';
  el.innerHTML = `
    <div style="font-size:.7rem;font-weight:800;color:var(--c);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:.65rem;">➕ Add Time Block</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.45rem;margin-bottom:.45rem;">
      <div>
        <label style="font-size:.63rem;color:var(--tx2);display:block;margin-bottom:.18rem;">Activity</label>
        <select id="sbAct" style="width:100%;padding:.35rem .5rem;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--tx);font-size:.76rem;">
          ${actOpts}
        </select>
      </div>
      <div>
        <label style="font-size:.63rem;color:var(--tx2);display:block;margin-bottom:.18rem;">Day(s)</label>
        <select id="sbDayMode" style="width:100%;padding:.35rem .5rem;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--tx);font-size:.76rem;" onchange="toggleSbDatePicker()">
          <option value="today">Today</option>
          <option value="date">Pick a date</option>
          <option value="weekday">Every Monday</option>
          <option value="weekday_tue">Every Tuesday</option>
          <option value="weekday_wed">Every Wednesday</option>
          <option value="weekday_thu">Every Thursday</option>
          <option value="weekday_fri">Every Friday</option>
          <option value="weekday_sat">Every Saturday</option>
          <option value="weekday_sun">Every Sunday</option>
          <option value="weekdays">All Weekdays (M–F)</option>
          <option value="weekend">Weekend (Sat–Sun)</option>
          <option value="allweek">Every Day This Week</option>
        </select>
      </div>
    </div>
    <div id="sbDateRow" style="display:none;margin-bottom:.45rem;">
      <label style="font-size:.63rem;color:var(--tx2);display:block;margin-bottom:.18rem;">Select Date</label>
      <input id="sbDate" type="date" style="width:100%;padding:.35rem .5rem;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--tx);font-size:.76rem;box-sizing:border-box;">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.45rem;margin-bottom:.6rem;">
      <div>
        <label style="font-size:.63rem;color:var(--tx2);display:block;margin-bottom:.18rem;">From</label>
        <input id="sbFrom" type="time" value="08:00" style="width:100%;padding:.35rem .5rem;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--tx);font-size:.76rem;box-sizing:border-box;">
      </div>
      <div>
        <label style="font-size:.63rem;color:var(--tx2);display:block;margin-bottom:.18rem;">To</label>
        <input id="sbTo" type="time" value="10:00" style="width:100%;padding:.35rem .5rem;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--tx);font-size:.76rem;box-sizing:border-box;">
      </div>
    </div>
    <button class="btn bp" style="width:100%;font-size:.8rem;font-weight:800;" onclick="addScheduleBlock()">+ Fill Time Block</button>
    <div id="schedBlockLog" style="margin-top:.5rem;max-height:140px;overflow-y:auto;"></div>
  `;
  card.parentNode.insertBefore(el, card);
  renderScheduleBlockLog();
}

function toggleSbDatePicker(){
  const mode = (document.getElementById('sbDayMode')||{}).value||'';
  const row = document.getElementById('sbDateRow');
  if(row) row.style.display = mode==='date' ? 'block' : 'none';
}

function addScheduleBlock(){
  const actEl   = document.getElementById('sbAct');
  const modeEl  = document.getElementById('sbDayMode');
  const fromEl  = document.getElementById('sbFrom');
  const toEl    = document.getElementById('sbTo');
  const dateEl  = document.getElementById('sbDate');

  const act   = actEl  ? actEl.value   : '';
  const mode  = modeEl ? modeEl.value  : 'today';
  const from  = fromEl ? fromEl.value  : '08:00';
  const to    = toEl   ? toEl.value    : '10:00';

  if(!act){ showToast('Select an activity'); return; }
  if(!from || !to){ showToast('Set a start and end time'); return; }

  const fromH = parseInt(from.split(':')[0]);
  const toH   = parseInt(to.split(':')[0]);
  if(fromH >= toH){ showToast('End time must be after start time'); return; }

  // Build list of date strings to fill
  const dates = _sbGetDates(mode, dateEl ? dateEl.value : '');
  if(!dates.length){ showToast('Select a valid day/date'); return; }

  if(!D.schedule) D.schedule = {};
  let filled = 0;
  dates.forEach(ds => {
    for(let h = fromH; h < toH; h++){
      const k = ds + '_' + h;
      D.schedule[k] = act;
      filled++;
    }
  });

  // Log the block so user can undo it
  if(!D.scheduleBlocks) D.scheduleBlocks = [];
  const actLabel = (getAllActs().find(a=>a.v===act)||{}).l || act;
  D.scheduleBlocks.push({
    id: Date.now(),
    act, actLabel,
    mode, dates,
    fromH, toH,
    from, to,
    added: new Date().toLocaleDateString()
  });

  save();
  buildSchedule();
  renderScheduleBlockLog();
  showToast(`✅ Block added — ${filled} slot${filled!==1?'s':''} filled`);
}

function _sbGetDates(mode, specificDate){
  const today = new Date();
  const todayStr = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');

  if(mode === 'today') return [todayStr];

  if(mode === 'date'){
    if(!specificDate) return [];
    return [specificDate];
  }

  // Build week dates using local date math (no toISOString to avoid UTC shift)
  function localDateStr(d){
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday index 0
  const weekDates = Array.from({length:7}, (_,i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate()+i);
    return localDateStr(d);
  });
  // weekDates[0]=Sun, [1]=Mon, [2]=Tue, [3]=Wed, [4]=Thu, [5]=Fri, [6]=Sat

  if(mode === 'weekdays') return weekDates.filter((_,i)=>i>=1&&i<=5);
  if(mode === 'weekend')  return [weekDates[6], weekDates[0]];
  if(mode === 'allweek')  return weekDates;

  const dayIdx = {weekday_sun:0, weekday:1, weekday_tue:2, weekday_wed:3, weekday_thu:4, weekday_fri:5, weekday_sat:6};
  if(mode in dayIdx) return [weekDates[dayIdx[mode]]];

  return [todayStr];
}

function deleteScheduleBlock(id){
  const block = (D.scheduleBlocks||[]).find(b=>b.id===id);
  if(!block) return;
  // Remove the slots this block created
  if(D.schedule){
    block.dates.forEach(ds => {
      for(let h = block.fromH; h < block.toH; h++){
        delete D.schedule[ds+'_'+h];
      }
    });
  }
  D.scheduleBlocks = (D.scheduleBlocks||[]).filter(b=>b.id!==id);
  save(); buildSchedule(); renderScheduleBlockLog();
  showToast('Block removed');
}

function renderScheduleBlockLog(){
  const el = document.getElementById('schedBlockLog'); if(!el) return;
  const blocks = (D.scheduleBlocks||[]).slice().reverse();
  if(!blocks.length){ el.innerHTML=''; return; }
  el.innerHTML = '<div style="font-size:.62rem;color:var(--tx2);margin-bottom:.25rem;font-weight:700;">RECENT BLOCKS</div>'
    + blocks.slice(0,5).map(b=>`
      <div style="display:flex;align-items:center;gap:.4rem;padding:.28rem .4rem;background:rgba(255,255,255,.03);border-radius:7px;margin-bottom:.22rem;">
        <div style="flex:1;font-size:.7rem;color:var(--tx);">${b.actLabel} · ${b.from}–${b.to} · ${b.mode==='date'?b.dates[0]:b.mode}</div>
        <button onclick="deleteScheduleBlock(${b.id})" style="background:none;border:none;color:var(--tx2);cursor:pointer;font-size:.8rem;padding:.1rem .25rem;" title="Remove this block">✕</button>
      </div>`
    ).join('');
}

function clearSched(){
  const monthLabel=MONTH_NAMES[_schedM]+' '+_schedY;
  if(!confirm('Clear schedule for '+monthLabel+'? This only clears the current month.')) return;
  const prefix=_schedY+'-'+String(_schedM+1).padStart(2,'0')+'-';
  Object.keys(D.schedule||{}).forEach(k=>{if(k.startsWith(prefix)) delete D.schedule[k];});
  save(); buildSchedule(); showToast('Schedule cleared! 🗑');
}

// ── CALENDAR ─────────────────────────────────────────────────
const ECLS={dj:'edj',bjj:'ebjj',wk:'ewk',ch:'ech',sc:'esc',ot:'eot'};
const ENAMES={dj:'🎧 DJ/Gig',bjj:'🥋 Sports',wk:'💼 Work',ch:'⛪ Church',sc:'📚 School',ot:'📌 Other'};

// Edit-mode tracker. null = creating a new event; otherwise the id of the
// event being edited. Set by editEvent(), cleared by saveEvent() on success
// and by closeEvModal() on cancel.
let _editingEventId = null;

function _evReadForm(){
  // Pull the four datetime fields with a graceful fallback to the legacy
  // single-field ids — keeps the form usable if a deploy mid-flights the
  // markup before this JS rolls out.
  const startDate = (document.getElementById('evStartDate')||document.getElementById('evDate')||{}).value || '';
  const endDate   = (document.getElementById('evEndDate')  ||{}).value || startDate;
  const startTime = (document.getElementById('evStartTime')||document.getElementById('evTime')||{}).value || '';
  const endTime   = (document.getElementById('evEndTime')  ||{}).value || startTime;
  return {
    title: ((document.getElementById('evTitle')||{}).value || '').trim(),
    startDate, endDate, startTime, endTime,
    cat:   (document.getElementById('evCat')||{}).value || 'ot',
    notes: ((document.getElementById('evNotes')||{}).value || '').trim(),
  };
}

function _evValidate(f){
  if(!f.title || !f.startDate){ return 'Enter a title and start date'; }
  if(f.endDate && f.endDate < f.startDate){ return 'End date must be on or after the start date'; }
  if(f.startDate === f.endDate && f.startTime && f.endTime && f.endTime < f.startTime){
    return 'End time must be after start time on the same day';
  }
  return '';
}

function saveEvent(){
  const f = _evReadForm();
  const err = _evValidate(f);
  if(err){ showToast(err); return; }
  if(!D.events) D.events = [];

  if(_editingEventId){
    // Update existing in place — preserve id + createdAt if present.
    const idx = D.events.findIndex(e => e && e.id === _editingEventId);
    if(idx >= 0){
      const cur = D.events[idx];
      D.events[idx] = Object.assign({}, cur, {
        title:     f.title,
        startDate: f.startDate,
        endDate:   f.endDate,
        startTime: f.startTime,
        endTime:   f.endTime,
        cat:       f.cat,
        notes:     f.notes,
        // Legacy mirrors so old code paths that still read e.date / e.time
        // keep showing the right value until they migrate.
        date:      f.startDate,
        time:      f.startTime,
        updatedAt: new Date().toISOString(),
      });
    }
  } else {
    D.events.push({
      id: Date.now(),
      title:     f.title,
      startDate: f.startDate,
      endDate:   f.endDate,
      startTime: f.startTime,
      endTime:   f.endTime,
      cat:       f.cat,
      notes:     f.notes,
      // Legacy mirrors for any reader that hasn't migrated yet.
      date:      f.startDate,
      time:      f.startTime,
      createdAt: new Date().toISOString(),
    });
  }
  D.events.sort((a,b)=> String(a.startDate||a.date||'').localeCompare(String(b.startDate||b.date||'')));
  save();
  renderCalendar(); renderUpcoming();
  if(typeof updateHeroDashboard === 'function') updateHeroDashboard();
  const wasEdit = !!_editingEventId;
  closeEvModal();
  showToast(wasEdit ? 'Event updated 📅' : 'Event added! 📅');
}

function deleteEvent(id){
  D.events = (D.events||[]).filter(e => e && e.id !== id);
  save(); renderCalendar(); renderUpcoming();
  if(typeof updateHeroDashboard === 'function') updateHeroDashboard();
}

// Open the modal in edit mode: pre-populate every field from the existing
// event and flip the modal title + primary-action label so users see they
// are editing, not adding.
function editEvent(id){
  const ev = (D.events||[]).find(e => e && e.id === id);
  if(!ev){ showToast('Event not found'); return; }
  _editingEventId = id;
  const set = (k,v) => { const el = document.getElementById(k); if(el) el.value = v == null ? '' : v; };
  set('evTitle', ev.title || '');
  set('evStartDate', ev.startDate || ev.date || '');
  set('evEndDate',   ev.endDate   || ev.date || '');
  set('evStartTime', ev.startTime || ev.time || '');
  set('evEndTime',   ev.endTime   || ev.time || '');
  set('evCat',   ev.cat   || 'ot');
  set('evNotes', ev.notes || '');
  const title = document.getElementById('evModalTitle');
  if(title) title.textContent = '📅 EDIT EVENT';
  const btn = document.getElementById('evSaveBtn');
  if(btn) btn.textContent = 'Save Changes';
  const delBtn = document.getElementById('evDeleteBtn');
  if(delBtn) delBtn.style.display = '';
  if(typeof openModal === 'function') openModal('evModal');
}

// Close + reset modal state so the next "Add" doesn't carry edit-mode UI.
function closeEvModal(){
  _editingEventId = null;
  ['evTitle','evStartDate','evEndDate','evStartTime','evEndTime','evNotes'].forEach(id => {
    const e = document.getElementById(id); if(e) e.value = '';
  });
  const cat = document.getElementById('evCat'); if(cat) cat.value = 'dj';
  const title = document.getElementById('evModalTitle');
  if(title) title.textContent = '📅 ADD EVENT';
  const btn = document.getElementById('evSaveBtn');
  if(btn) btn.textContent = 'Add Event';
  const delBtn = document.getElementById('evDeleteBtn');
  if(delBtn) delBtn.style.display = 'none';
  if(typeof closeModal === 'function') closeModal('evModal');
}

// Delete the currently-edited event from inside the modal.
function evDeleteCurrent(){
  if(!_editingEventId) return;
  const ev = (D.events||[]).find(e => e && e.id === _editingEventId);
  if(!ev) return;
  if(!confirm('Delete "' + ev.title + '"?')) return;
  const id = _editingEventId;
  closeEvModal();
  deleteEvent(id);
  showToast('Event deleted');
}

// One-shot migration: copy each event's legacy date/time into the new
// start/end fields. Idempotent — runs every boot, only writes when the
// new fields are missing. Saves once at the end if anything changed.
function migrateEventsToRange(){
  if(!Array.isArray(D.events) || !D.events.length) return;
  let touched = false;
  D.events.forEach(e => {
    if(!e) return;
    if(!e.startDate && e.date){ e.startDate = e.date; touched = true; }
    if(!e.endDate){ e.endDate = e.startDate || e.date || ''; touched = true; }
    if(!e.startTime && e.time){ e.startTime = e.time; touched = true; }
    if(!e.endTime){ e.endTime = e.startTime || e.time || ''; touched = true; }
  });
  if(touched && typeof save === 'function') save();
}

// Format a date+time range for the upcoming-events list. Handles same-day
// (one date with a time range) and multi-day (two dates).
function _evFormatRange(ev){
  const sd = ev.startDate || ev.date || '';
  const ed = ev.endDate   || sd;
  const st = ev.startTime || ev.time || '';
  const et = ev.endTime   || '';
  if(!sd) return '';
  const fmtD = (iso) => {
    if(!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  };
  const fmtT = (t) => {
    if(!t) return '';
    const [h,m] = t.split(':');
    const H = parseInt(h,10);
    const suffix = H >= 12 ? 'PM' : 'AM';
    const hr = ((H + 11) % 12) + 1;
    return hr + ':' + m + ' ' + suffix;
  };
  if(sd === ed){
    if(st && et && st !== et) return fmtD(sd) + ' · ' + fmtT(st) + ' – ' + fmtT(et);
    if(st)                    return fmtD(sd) + ' · ' + fmtT(st);
    return fmtD(sd);
  }
  // Multi-day
  return fmtD(sd) + (st ? ' ' + fmtT(st) : '') + ' → ' + fmtD(ed) + (et ? ' ' + fmtT(et) : '');
}
function prevMonth(){ _calM--; if(_calM<0){_calM=11;_calY--;} renderCalendar(); }
function nextMonth(){ _calM++; if(_calM>11){_calM=0;_calY++;} renderCalendar(); }

function renderCalendar(){
  const grid=document.getElementById('cg'),lbl=document.getElementById('calLbl'); if(!grid||!lbl) return;
  const MONTHS=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  lbl.textContent=MONTHS[_calM]+' '+_calY;
  const today=new Date(),first=new Date(_calY,_calM,1).getDay(),dim=new Date(_calY,_calM+1,0).getDate(),dPrev=new Date(_calY,_calM,0).getDate();
  // Multi-day index: an event with startDate=2026-05-26 and endDate=2026-05-28
  // appears in evMap['2026-05-26'], '...05-27', and '...05-28'. Falls back to
  // legacy single-date events (ev.date) so unmigrated rows still render.
  const evMap={};
  (D.events||[]).forEach(ev => {
    if(!ev) return;
    const start = ev.startDate || ev.date;
    if(!start) return;
    const end = ev.endDate || start;
    let cur = start;
    let safety = 366;
    while(cur && cur <= end && safety-- > 0){
      if(!evMap[cur]) evMap[cur] = [];
      evMap[cur].push(ev);
      // Advance one day in YYYY-MM-DD space without timezone surprises.
      const dt = new Date(cur + 'T00:00:00');
      dt.setDate(dt.getDate() + 1);
      cur = dt.toISOString().slice(0,10);
    }
  });
  let html='';
  for(let i=first-1;i>=0;i--) html+=`<div class="cd om"><span class="cdn">${dPrev-i}</span></div>`;
  for(let d=1;d<=dim;d++){
    const ds=_calY+'-'+String(_calM+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const isT=today.getDate()===d&&today.getMonth()===_calM&&today.getFullYear()===_calY;
    const evs=(evMap[ds]||[]).slice(0,3);
    html+=`<div class="cd${isT?' td':''}" onclick="calClick('${ds}')"><span class="cdn">${d}</span>${evs.map(ev=>`<span class="cep ${ECLS[ev.cat]||'eot'}" onclick="event.stopPropagation();editEvent(${ev.id})">${escapeHtml(ev.title)}</span>`).join('')}</div>`;
  }
  const total=Math.ceil((first+dim)/7)*7;
  for(let d=1;d<=total-first-dim;d++) html+=`<div class="cd om"><span class="cdn">${d}</span></div>`;
  grid.innerHTML=html;
}

function calClick(ds){
  // Open the modal in ADD mode pre-seeded with the day the user clicked.
  // Reset any lingering edit state first.
  closeEvModal();
  const sd = document.getElementById('evStartDate') || document.getElementById('evDate');
  if(sd) sd.value = ds;
  const ed = document.getElementById('evEndDate');
  if(ed) ed.value = ds;
  if(typeof openModal === 'function') openModal('evModal');
}
function delEvCf(id){
  // Legacy path — kept so old onclick handlers don't break. New chips call
  // editEvent() instead, and the modal exposes a Delete button.
  const ev=(D.events||[]).find(e=>e.id===id); if(!ev) return;
  const when = ev.startDate || ev.date || '';
  if(confirm(ev.title + (when ? '\n' + when : '') + '\n\nDelete?')) deleteEvent(id);
}

function renderUpcoming(){
  const el=document.getElementById('upcomingEvs'); if(!el) return;
  const today=localDateString();
  // An event is "upcoming" if it ends on or after today (so multi-day events
  // in progress still surface).
  const up=(D.events||[])
    .filter(ev => ev && ((ev.endDate || ev.startDate || ev.date || '') >= today))
    .slice(0,15);
  if(!up.length){el.innerHTML='<div style="color:#c8d4e8;text-align:center;padding:1.5rem;font-size:.84rem;">No upcoming events — click a day to add one!</div>';return;}
  el.innerHTML=up.map(ev=>{
    const sd = ev.startDate || ev.date || '';
    const d  = new Date(sd + 'T00:00:00');
    const rangeLabel = _evFormatRange(ev);
    return `<div style="display:flex;align-items:center;gap:.65rem;padding:.52rem .7rem;background:rgba(255,255,255,.1);border-radius:9px;margin-bottom:.32rem;">
      <div style="text-align:center;min-width:32px;"><div style="font-size:1rem;font-weight:900;color:var(--c);">${d.getDate()}</div><div style="font-size:.54rem;color:#c8d4e8;">${d.toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</div></div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:.86rem;">${escapeHtml(ev.title)}</div>
        <div style="font-size:.68rem;color:#c8d4e8;">${ENAMES[ev.cat]||''}${rangeLabel?' · '+escapeHtml(rangeLabel):''}</div>
      </div>
      <button class="db" onclick="editEvent(${ev.id})" title="Edit" style="background:rgba(56,189,248,.15);border:1px solid rgba(56,189,248,.35);color:#38bdf8;padding:.28rem .52rem;border-radius:7px;font-size:.72rem;font-weight:700;cursor:pointer;">✏️</button>
      <button class="db" onclick="deleteEvent(${ev.id})" title="Delete">✕</button>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════════
// Phase F — AI STUDY PARTNER (AI mode='study-partner') — 2026-05-15
// Three sub-modes: explain / quiz / write. Calls /api/ai-summary with
// the chosen submode in req.body.submode. Quiz mode renders interactive
// multiple-choice cards; explain/write render plain text feedback.
// ═══════════════════════════════════════════════════════════════════
let _aiPartnerMode = 'explain';

function aiPartnerSetMode(mode, btn){
  _aiPartnerMode = mode;
  document.querySelectorAll('.ap-mode-btn').forEach(b => {
    b.style.background = 'rgba(56,189,248,.06)';
    b.style.borderColor = 'rgba(56,189,248,.2)';
    b.style.color = 'var(--tx2)';
  });
  if(btn){
    btn.style.background = 'rgba(56,189,248,.18)';
    btn.style.borderColor = 'var(--section-school)';
    btn.style.color = 'var(--tx)';
  }
  const lbl = document.getElementById('apTopicLbl');
  const ta  = document.getElementById('apTopic');
  if(mode === 'explain'){
    if(lbl) lbl.textContent = 'What do you want explained?';
    if(ta)  ta.placeholder  = 'Photosynthesis · Quadratic formula · Causes of WWI';
  } else if(mode === 'quiz'){
    if(lbl) lbl.textContent = 'Topic to quiz on';
    if(ta)  ta.placeholder  = 'Cell biology · Algebra basics · Civil War causes';
  } else if(mode === 'write'){
    if(lbl) lbl.textContent = 'Paste your draft (or describe what you are writing)';
    if(ta)  ta.placeholder  = 'Paste your essay paragraph here for coaching feedback…';
  }
}

function aiPartnerSubmit(){
  const subject = (document.getElementById('apSubject').value || '').trim();
  const topic   = (document.getElementById('apTopic').value   || '').trim();
  if(!topic){ showToast('Type a topic or question first'); return; }
  const out = document.getElementById('apOutput');
  if(out) out.innerHTML = '<div style="text-align:center;padding:1.2rem;color:var(--tx2);font-size:.85rem;">✨ Thinking…</div>';

  const promptText = (subject ? 'Subject: ' + subject + '\n' : '') + topic;
  fetch('/api/ai-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'study-partner', submode: _aiPartnerMode, prompt: promptText })
  })
  .then(r => r.ok ? r.json() : Promise.reject(r.status))
  .then(data => {
    if(_aiPartnerMode === 'quiz'){
      if(data.ok === false || !data.questions || !Array.isArray(data.questions)){
        aiPartnerError(); return;
      }
      renderAiPartnerQuiz(data.questions);
    } else {
      if(!data || !data.text){ aiPartnerError(); return; }
      renderAiPartnerText(data.text);
    }
  })
  .catch(() => aiPartnerError());
}

function aiPartnerError(){
  const out = document.getElementById('apOutput');
  if(!out) return;
  out.innerHTML = '<div style="text-align:center;padding:1rem;color:#f87171;font-size:.85rem;">Couldn\'t connect — '
    + '<button type="button" onclick="aiPartnerSubmit()" style="background:none;border:none;color:var(--section-school);cursor:pointer;font-size:.85rem;font-weight:600;text-decoration:underline;font-family:var(--fm);">try again</button></div>';
}

function renderAiPartnerText(text){
  const out = document.getElementById('apOutput');
  if(!out) return;
  out.innerHTML = '<div style="background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.18);border-left:4px solid var(--section-school);border-radius:12px;padding:.95rem 1.1rem;color:var(--tx);font-size:.88rem;line-height:1.65;white-space:pre-wrap;">' + escapeHtml(text) + '</div>';
}

function renderAiPartnerQuiz(questions){
  const out = document.getElementById('apOutput');
  if(!out) return;
  window._apQuiz = questions;
  window._apQuizAnswers = {};
  out.innerHTML = questions.map((q, i) =>
    '<div id="apq-' + i + '" style="background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.18);border-left:4px solid var(--section-school);border-radius:12px;padding:.85rem 1rem;margin-bottom:.65rem;">'
    + '<div style="font-size:.85rem;font-weight:700;color:var(--tx);margin-bottom:.6rem;line-height:1.5;"><span style="color:var(--section-school);">Q' + (i+1) + '.</span> ' + escapeHtml(q.q || '') + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:.35rem;">'
    + (q.options || []).map((opt, j) => {
        const letter = String.fromCharCode(65 + j);
        return '<button type="button" onclick="apQuizPick(' + i + ',\'' + letter + '\')" data-qi="' + i + '" data-opt="' + letter + '" style="text-align:left;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:var(--tx);padding:.55rem .75rem;border-radius:8px;cursor:pointer;font-family:var(--fm);font-size:.82rem;line-height:1.45;"><b style="color:var(--section-school);margin-right:.4rem;">' + letter + '.</b>' + escapeHtml(opt) + '</button>';
      }).join('')
    + '</div>'
    + '<div id="apq-fb-' + i + '" style="display:none;margin-top:.5rem;font-size:.78rem;line-height:1.5;"></div>'
    + '</div>'
  ).join('');
}

function apQuizPick(qi, letter){
  const q = (window._apQuiz || [])[qi];
  if(!q) return;
  window._apQuizAnswers = window._apQuizAnswers || {};
  if(window._apQuizAnswers[qi]) return; // already answered — lock in.
  window._apQuizAnswers[qi] = letter;
  const correct = String(q.correct || '').toUpperCase();
  const isRight = letter === correct;
  document.querySelectorAll('#apq-' + qi + ' [data-qi]').forEach(b => {
    const lt = b.getAttribute('data-opt');
    if(lt === correct){
      b.style.background = 'rgba(52,211,153,.18)';
      b.style.borderColor = 'var(--gr)';
    } else if(lt === letter){
      b.style.background = 'rgba(239,68,68,.14)';
      b.style.borderColor = '#ef4444';
    } else {
      b.style.opacity = '.55';
    }
    b.disabled = true;
    b.style.cursor = 'default';
  });
  const fb = document.getElementById('apq-fb-' + qi);
  if(fb){
    fb.style.display = '';
    fb.style.color = isRight ? 'var(--gr)' : '#f87171';
    const lead = isRight ? '✓ Correct.' : '✗ Correct answer: ' + correct + '.';
    fb.innerHTML = '<b>' + lead + '</b> ' + (q.why ? escapeHtml(q.why) : '');
  }
}

