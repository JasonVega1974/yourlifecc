/* =============================================================
   parent.js — Parent hub, life score, weekly report card,
               child profiles, parent gate PIN, child login,
               behavior log, grade monitor, incentives, badges,
               phNav routing, growth tracker, weekly AI reports
============================================================= */

// ── PARENT DASHBOARD ─────────────────────────────────────────
let _parentDashUnlocked = sessionStorage.getItem('parentUnlocked')==='1' || localStorage.getItem('lifeos_parent_unlocked')==='1';

function unlockParentDash(){
  initChoreData();
  if(D.parentPinDisabled){ _doUnlockParent(); return; }
  // If no PIN set yet, let them straight in
  if(!D.chorePin && !D.parentPIN){ _doUnlockParent(); return; }
  // Submission handled by pgPinKey / _pgSubmit
}

function lockParentDash(){
  _parentDashUnlocked = false;
  _pgBuffer = ''; _pgUpdateDots();
  sessionStorage.removeItem('parentUnlocked');
  const gate=document.getElementById('parentGate');
  const content=document.getElementById('parentDashContent');
  const err=document.getElementById('parentGateError');
  if(gate) gate.style.display='';
  if(content) content.style.display='none';
  if(err) err.textContent='';
  updateParentPinToggleUI();
}

function resetParentPin(){
  if(!confirm('Clear parent PIN? You will need to set a new one on next unlock.')){ return; }
  D.chorePin = ''; D.parentPIN = ''; save();
  showToast('PIN cleared. Set a new one on next unlock.');
}

// ── CHILD SECTION ACCESS ────────────────────────────────────
function populateChildSectionSel(){
  var sel=document.getElementById('csaChildSel');if(!sel)return;
  var ch=_profiles.filter(function(p){return!p.isParent;});
  sel.innerHTML='<option value="">— Select a child —</option>'+ch.map(function(c){return'<option value="'+c.id+'">'+c.name+'</option>';}).join('');
  if(ch.length===1){sel.value=ch[0].id;renderChildSectionAccess();}
}
function renderChildSectionAccess(){
  var sel=document.getElementById('csaChildSel'),ct=document.getElementById('csaToggles');
  if(!sel||!ct)return;
  var cid=sel.value;
  if(!cid){ct.innerHTML='<div style="font-size:.72rem;color:var(--tx3);text-align:center;padding:.5rem;">Select a child above</div>';return;}
  var prof=_profiles.find(function(p){return p.id===cid;});
  if(!prof){ct.innerHTML='';return;}
  var secs=(prof.data&&prof.data.sections)?prof.data.sections:{};
  ct.innerHTML=ALL_SECTIONS.map(function(s){
    var key=s.id.replace('s-',''),on=secs[key]!==0;
    return'<div class="tr" style="border-bottom:1px solid rgba(255,255,255,.04);padding:.3rem 0;"><span style="font-size:.82rem;">'+s.label+'</span><button class="tg'+(on?' on':'')+'" onclick="toggleChildSection(\''+cid+'\',\''+s.id+'\',this)"></button></div>';
  }).join('');
}
function toggleChildSection(cid,sid,btn){
  var prof=_profiles.find(function(p){return p.id===cid;});if(!prof)return;
  if(!prof.data)prof.data={};
  if(!prof.data.sections)prof.data.sections={};
  var key=sid.replace('s-',''),on=!btn.classList.contains('on');
  btn.classList.toggle('on',on);
  prof.data.sections[key]=on?1:0;
  saveProfiles();
  if(_activeProfileId===cid){
    var el=document.getElementById(sid);
    if(el)el.style.display=on?'':'none';
    buildSideNav();
    if(!on&&_activeSection===sid)showSection('s-hero');
  }
  showToast((on?'Enabled: ':'Hidden: ')+sid.replace('s-',''));
}

function renderParentDash(){
  if(!_parentDashUnlocked) return;
  populateParentChildSelect();
  populateChildSectionSel();
  renderParentGettingStarted();
  renderParentMultiChild();
  renderParentScore();
  renderParentOverview();
  renderWeeklyReportCard();
  renderIncentives();
  renderBehaviorLog();
  renderParentNotes();
  renderParentScreenControls();
  renderParentEarningsControls();
  renderParentBucksControls();
  renderGradeMonitor();
  renderParentActivityAudit();
  renderSentQuizzes();
  renderCompletionSummary();
  renderParentDeeds();
  renderParentSelfChores();
  renderParentLeaderboard();
  renderParentContests();
  renderParentFamilyRewards();
  renderParentActivityFeed();
  if(typeof renderPhPendingChores==='function') renderPhPendingChores();
  // Render session log in parent hub
  if(typeof renderSessionLog === 'function') renderSessionLog();
  // Update live session time display
  const phST = document.getElementById('phSessionTime');
  if(phST && typeof getSessionSeconds === 'function'){
    const s = getSessionSeconds();
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    phST.textContent = h>0 ? h+'h '+m+'m' : m>0 ? m+'m '+String(sec).padStart(2,'0')+'s' : sec+'s';
  }
  phNav('users');
}

// ── PARENT SCORE — THE BIG NUMBER ────────────────────────────
function renderParentScore(){
  const gradeEl = document.getElementById('parentScoreGrade');
  const labelEl = document.getElementById('parentScoreLabel');
  const breakEl = document.getElementById('parentScoreBreakdown');
  if(!gradeEl) return;

  const scores = {};

  // Academics (0-100): based on GPA
  const classes = D.classes||[];
  const gradeMap = {'A+':4,A:4,'A-':3.7,'B+':3.3,B:3,'B-':2.7,'C+':2.3,C:2,'C-':1.7,'D+':1.3,D:1,'D-':0.7,F:0};
  const grades = classes.filter(c=>c.grade).map(c=>gradeMap[c.grade]||0);
  const gpa = grades.length ? grades.reduce((a,b)=>a+b,0)/grades.length : 0;
  scores.academics = classes.length ? Math.min(100, (gpa/4)*100) : 50;

  // Responsibility (0-100): chore completion rate this week
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate()-weekStart.getDay());
  const ws = weekStart.toISOString().slice(0,10);
  const weekChores = (D.choreLog||[]).filter(l=>l.date>=ws);
  const verified = weekChores.filter(l=>l.status==='verified').length;
  const activeChores = (Array.isArray(D.chores)?D.chores:[]).filter(c=>c.active).length;
  scores.responsibility = activeChores>0 ? Math.min(100, (verified/(activeChores*7))*100*7) : 50;
  if(scores.responsibility > 100) scores.responsibility = 100;

  // Growth (0-100): life skills + reading + goals
  const certs = Object.values(D.skillCerts||{}).filter(Boolean).length;
  const booksRead = (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length;
  const goalsDone = (Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length;
  scores.growth = Math.min(100, (certs*6) + (booksRead*4) + (goalsDone*5));

  // Wellbeing (0-100): mood logging + check-in streak
  const recentMoods = (D.moods||[]).filter(m=>{const diff=(new Date()-new Date(m.date+'T12:00:00'))/(86400000);return diff<=14;});
  const moodAvg = recentMoods.length ? recentMoods.reduce((s,m)=>s+m.level,0)/recentMoods.length : 3;
  const streak = D.streak||0;
  scores.wellbeing = Math.min(100, (moodAvg/5)*50 + Math.min(50, streak*3));

  // Character (0-100): behavior log ratio
  const behLogs = D.behaviorLog||[];
  const pos = behLogs.filter(b=>b.type==='positive').length;
  const neg = behLogs.filter(b=>b.type==='negative').length;
  scores.character = behLogs.length>0 ? Math.min(100, (pos/(pos+neg))*100) : 50;

  // Engagement (0-100): journal + milestones + app usage
  const journalCount = (Array.isArray(D.journal)?D.journal:[]).length;
  const msCount = (D.milestones||[]).length;
  scores.engagement = Math.min(100, journalCount*3 + msCount*5 + (D.studyLog||[]).length*2);

  // Overall: weighted average
  const weights = {academics:25, responsibility:20, growth:15, wellbeing:15, character:15, engagement:10};
  let total = 0, weightSum = 0;
  for(const [k,w] of Object.entries(weights)){ total += (scores[k]||50)*w; weightSum += w; }
  const overall = Math.round(total/weightSum);

  // Letter grade
  const hasAnyData = (D.classes||[]).length>0||(Array.isArray(D.goals)?D.goals:[]).length>0||(Array.isArray(D.journal)?D.journal:[]).length>0||(D.streak||0)>0||(D.moods||[]).length>0;
  const letter = !hasAnyData?'N/A':overall>=93?'A+':overall>=90?'A':overall>=87?'A-':overall>=83?'B+':overall>=80?'B':overall>=77?'B-':overall>=73?'C+':overall>=70?'C':overall>=67?'C-':overall>=60?'D':overall>=50?'D-':'F';
  const color = overall>=80?'#22c55e':overall>=70?'#fbbf24':overall>=60?'#fb923c':'#ef4444';

  gradeEl.style.color = color;
  gradeEl.textContent = letter;
  labelEl.textContent = overall + '/100 — ' + (overall>=90?'Outstanding':overall>=80?'Doing Great':overall>=70?'Good Progress':overall>=60?'Needs Attention':'Let\u2019s Talk');

  // Breakdown chips
  const catLabels = {academics:'🎓 Academics',responsibility:'💪 Responsibility',growth:'🌱 Growth',wellbeing:'😊 Wellbeing',character:'⭐ Character',engagement:'📊 Engagement'};
  breakEl.innerHTML = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;">' + Object.entries(scores).map(([k,v])=>{
    const c2 = v>=80?'#22c55e':v>=70?'#fbbf24':v>=60?'#fb923c':'#ef4444';
    return `<div style="background:rgba(255,255,255,.03);border:1px solid ${c2}20;border-left:3px solid ${c2};border-radius:8px;padding:.4rem .6rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:.6rem;color:var(--tx2);">${catLabels[k]}</span>
        <span style="font-size:.8rem;font-weight:900;color:${c2};">${Math.round(v)}</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:.2rem;overflow:hidden;">
        <div style="height:100%;width:${v}%;background:${c2};border-radius:2px;"></div>
      </div>
    </div>`;
  }).join('') + '</div>';
}

// ── WEEKLY REPORT CARD ───────────────────────────────────────
function renderWeeklyReportCard(){
  const el = document.getElementById('weeklyReportCard'); if(!el) return;
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(weekStart.getDate()-weekStart.getDay());
  const ws = weekStart.toISOString().slice(0,10);

  const choresDone = (D.choreLog||[]).filter(l=>l.date>=ws && l.status==='verified').length;
  const choresPending = (D.choreLog||[]).filter(l=>l.date>=ws && l.status==='pending').length;
  const moodsLogged = (D.moods||[]).filter(m=>m.date>=ws).length;
  const studySessions = (D.studyLog||[]).filter(s=>s.date && s.date>=ws.replace(/-/g,'/')).length;
  const journalEntries = (Array.isArray(D.journal)?D.journal:[]).filter(j=>j.date>=ws).length;
  const goalsCompleted = (Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done && g.doneDate && g.doneDate>=ws).length;
  const booksProgress = (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='reading').length;
  const positiveBeh = (Array.isArray(D.behaviorLog)?D.behaviorLog:[]).filter(b=>b.date>=ws && b.type==='positive').length;
  const negativeBeh = (Array.isArray(D.behaviorLog)?D.behaviorLog:[]).filter(b=>b.date>=ws && b.type==='negative').length;

  const items = [
    {label:'Chores Verified',value:choresDone,icon:'✅',color:choresDone>=5?'#22c55e':choresDone>=2?'#fbbf24':'#ef4444'},
    {label:'Moods Logged',value:moodsLogged+'/7',icon:'😊',color:moodsLogged>=5?'#22c55e':moodsLogged>=3?'#fbbf24':'#fb923c'},
    {label:'Study Sessions',value:studySessions,icon:'📖',color:studySessions>=3?'#22c55e':studySessions>=1?'#fbbf24':'#fb923c'},
    {label:'Journal Entries',value:journalEntries,icon:'✍️',color:journalEntries>=2?'#22c55e':journalEntries>=1?'#fbbf24':'var(--tx2)'},
    {label:'Positive Notes',value:positiveBeh,icon:'👍',color:positiveBeh>0?'#22c55e':'var(--tx2)'},
    {label:'Needs Work',value:negativeBeh,icon:'👎',color:negativeBeh===0?'#22c55e':negativeBeh<=2?'#fbbf24':'#ef4444'},
    {label:'Goals Done',value:goalsCompleted,icon:'🎯',color:goalsCompleted>0?'#22c55e':'var(--tx2)'},
    {label:'Books Reading',value:booksProgress,icon:'📚',color:booksProgress>0?'#22c55e':'var(--tx2)'},
  ];

  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:.4rem;">
    ${items.map(i=>`<div class="dcard" style="height:auto;min-height:90px;cursor:default;border-top:3px solid ${i.color}15;">
      <div class="dcard-status" style="background:${i.color};"></div>
      <div style="font-size:1rem;">${i.icon}</div>
      <div style="font-size:1.2rem;font-weight:900;color:${i.color};margin:.1rem 0;">${i.value}</div>
      <div style="font-size:.5rem;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px;">${i.label}</div>
    </div>`).join('')}
  </div>
  <div style="margin-top:.6rem;padding-top:.5rem;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:var(--tx2);text-align:center;">
    Week of ${weekStart.toLocaleDateString('en',{month:'short',day:'numeric'})} — ${new Date().toLocaleDateString('en',{month:'short',day:'numeric'})}
  </div>`;
}

// ── PARENT NOTES ─────────────────────────────────────────────
function addParentNote(){
  const text = (document.getElementById('parentNoteText')||{}).value.trim();
  if(!text){ showToast('Write a note'); return; }
  if(!D.parentNotes) D.parentNotes=[];
  D.parentNotes.push({id:Date.now(), text, date:new Date().toISOString().slice(0,10), time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})});
  document.getElementById('parentNoteText').value='';
  save(); renderParentNotes();
  showToast('Note posted ✓');
}

function removeParentNote(id){
  D.parentNotes = (Array.isArray(D.parentNotes)?D.parentNotes:[]).filter(n=>n.id!==id); save(); renderParentNotes();
}

function renderParentNotes(){
  const el = document.getElementById('parentNotesList'); if(!el) return;
  const notes = (Array.isArray(D.parentNotes)?D.parentNotes:[]).slice().sort((a,b)=>b.id-a.id);
  if(!notes.length){ el.innerHTML='<div style="font-size:.72rem;color:var(--tx2);padding:.3rem;">No notes yet.</div>'; return; }
  el.innerHTML = notes.map(n=>`
    <div style="display:flex;gap:.5rem;padding:.5rem .6rem;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08);border-radius:8px;margin-bottom:.3rem;">
      <span style="font-size:1rem;">💌</span>
      <div style="flex:1;">
        <div style="font-size:.75rem;color:var(--tx);line-height:1.5;">${n.text}</div>
        <div style="font-size:.55rem;color:var(--tx2);margin-top:.15rem;">From Mom/Dad · ${n.date} ${n.time}</div>
      </div>
      ${_parentDashUnlocked?`<button class="btn bda bs" onclick="removeParentNote(${n.id})" style="font-size:.45rem;">✕</button>`:''}
    </div>
  `).join('');
}

// Also render parent notes in a kid-visible area
function renderKidParentNotes(){
  const notes = (Array.isArray(D.parentNotes)?D.parentNotes:[]).slice().sort((a,b)=>b.id-a.id).slice(0,3);
  if(!notes.length) return;
  const el = document.getElementById('heroParentNotes'); if(!el) return;
  el.innerHTML = notes.map(n=>`
    <div style="padding:.35rem .5rem;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);border-radius:8px;margin-bottom:.2rem;">
      <div style="font-size:.65rem;color:var(--tx);">💌 ${n.text}</div>
      <div style="font-size:.48rem;color:var(--tx2);">${n.date}</div>
    </div>
  `).join('');
}

function renderParentOverview(){
  const el = document.getElementById('parentOverviewCards'); if(!el) return;
  const today = new Date().toISOString().slice(0,10);

  // GPA
  const classes = D.classes||[];
  let gpa = 0;
  if(classes.length){
    const gradeMap = {A:4,'A+':4,'A-':3.7,'B+':3.3,B:3,'B-':2.7,'C+':2.3,C:2,'C-':1.7,'D+':1.3,D:1,'D-':0.7,F:0};
    const grades = classes.filter(c=>c.grade).map(c=>gradeMap[c.grade]||0);
    if(grades.length) gpa = (grades.reduce((a,b)=>a+b,0)/grades.length).toFixed(2);
  }
  const gpaTarget = D.gpaTarget||3.5;
  const gpaColor = gpa >= gpaTarget ? '#22c55e' : gpa >= gpaTarget-0.5 ? '#fbbf24' : '#ef4444';

  // Chores this week
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate()-weekStart.getDay());
  const ws = weekStart.toISOString().slice(0,10);
  const weekChores = (D.choreLog||[]).filter(l=>l.date>=ws);
  const verified = weekChores.filter(l=>l.status==='verified').length;
  const totalWeek = weekChores.length;

  // Life skills
  const certs = Object.values(D.skillCerts||{}).filter(Boolean).length;

  // Goals
  const goals = D.goals||[];
  const goalsDone = goals.filter(g=>g.done).length;

  // Streak
  const streak = D.streak||0;

  // Mood avg last 7 days
  const recentMoods = (D.moods||[]).filter(m=>{ const d=new Date(m.date+'T12:00:00'); const diff=(new Date()-d)/(1000*60*60*24); return diff<=7; });
  const moodAvg = recentMoods.length ? (recentMoods.reduce((s,m)=>s+m.level,0)/recentMoods.length).toFixed(1) : '—';
  const moodEmoji = moodAvg >= 4 ? '😄' : moodAvg >= 3 ? '🙂' : moodAvg >= 2 ? '😐' : '😔';

  // Books
  const booksRead = (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length;

  // Journal
  const journalThisMonth = (Array.isArray(D.journal)?D.journal:[]).filter(j=>j.date&&j.date.slice(0,7)===today.slice(0,7)).length;

  // Chore points
  const choreTotal = (D.chorePoints||{}).total||0;

  // Behavior score
  const behLogs = D.behaviorLog||[];
  const posCount = behLogs.filter(b=>b.type==='positive').length;
  const negCount = behLogs.filter(b=>b.type==='negative').length;

  const cards = [
    {icon:'📚',label:'GPA',value:gpa||'—',color:gpaColor,sub:classes.length+' classes'},
    {icon:'✅',label:'Chores (Week)',value:verified,color:'#22c55e',sub:totalWeek+' submitted'},
    {label:'Life Skills',value:certs+'/16',color:'#a78bfa',sub:'certificates'},
    {label:'Goals',value:goalsDone+'/'+goals.length,color:'#60a5fa',sub:'completed'},
    {icon:'🔥',label:'Check-in Streak',value:streak,color:'#fbbf24',sub:'days'},
    {icon:'😊',label:'Mood (7d avg)',value:moodEmoji+' '+moodAvg,color:'#22d3ee',sub:recentMoods.length+' entries'},
    {icon:'📖',label:'Books Read',value:booksRead,color:'#fb923c',sub:(Array.isArray(D.books)?D.books:[]).length+' total'},
    {label:'Journal',value:journalThisMonth,color:'#f472b6',sub:'this month'},
    {icon:'⭐',label:'Chore Points',value:choreTotal,color:'#22c55e',sub:'lifetime'},
    {icon:'👍',label:'Behavior',value:'👍'+posCount+' 👎'+negCount,color:'#818cf8',sub:'logged'},
  ];

  el.innerHTML = cards.map(c=>`
    <div class="dcard" style="height:auto;min-height:110px;cursor:default;border-top:3px solid ${c.color}15;">
      <div class="dcard-status" style="background:${c.color};"></div>
      <div class="dcard-icon" style="font-size:1.2rem;">${c.icon||''}</div>
      <div class="dcard-label">${c.label}</div>
      <div class="dcard-value" style="color:${c.color};">${c.value}</div>
      <div class="dcard-sub" style="font-size:.55rem;color:var(--tx3);">${c.sub}</div>
    </div>
  `).join('');
}


// ── INCENTIVE SYSTEM ─────────────────────────────────────────
function updateIncConditions(){
  const cat = (document.getElementById('incCatSel')||{}).value;
  const sel = document.getElementById('incCondition'); if(!sel) return;
  const options = {
    grades:[['gpa_above','GPA stays above'],['gpa_reach','GPA reaches'],['no_missing','No missing assignments']],
    chores:[['chores_week','Complete all chores for X weeks'],['chores_pts','Earn X chore points'],['chore_streak','Chore streak reaches X days']],
    skills:[['certs_earn','Earn X life skill certificates'],['cert_specific','Complete specific category']],
    reading:[['books_read','Read X books'],['books_month','Read X books this month']],
    goals:[['goals_complete','Complete X goals'],['goal_specific','Complete a specific goal']],
    streak:[['checkin_streak','Check-in streak reaches X days'],['checkin_month','Check in X days this month']],
    mood:[['mood_streak','Log mood X days in a row'],['mood_avg','Avg mood above X for 2 weeks']],
    behavior:[['beh_positive','Earn X positive behavior notes'],['beh_no_neg','No negative notes for X days']],
    custom:[['custom','Custom condition (describe in target)']]
  };
  const opts = options[cat]||options.custom;
  sel.innerHTML = opts.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('');
}

function addIncentive(){
  if(!D.incentives) D.incentives=[];
  const name = (document.getElementById('incName')||{}).value.trim();
  if(!name){ showToast('Name the incentive'); return; }
  const cat = (document.getElementById('incCatSel')||{}).value;
  const condition = (document.getElementById('incCondition')||{}).value;
  const target = (document.getElementById('incTarget')||{}).value.trim();
  const deadline = (document.getElementById('incDeadline')||{}).value;
  const bonusPts = parseInt((document.getElementById('incBonusPts')||{}).value)||0;
  const catEmojis = {grades:'🎓',chores:'✅',skills:'🧠',reading:'📖',goals:'🎯',streak:'🔥',mood:'😊',behavior:'⭐',custom:'📌'};

  D.incentives.push({
    id:Date.now(), name, cat, condition, target, deadline,
    bonusPts, emoji:catEmojis[cat]||'📌', status:'active',
    created:new Date().toISOString().slice(0,10)
  });
  document.getElementById('incName').value='';
  document.getElementById('incTarget').value='';
  document.getElementById('incDeadline').value='';
  document.getElementById('incBonusPts').value='';
  save(); renderIncentives();
  showToast('Incentive created ✓');
}

function checkIncentiveProgress(inc){
  const target = parseFloat(inc.target)||0;
  const classes = D.classes||[];
  const gradeMap = {A:4,'A+':4,'A-':3.7,'B+':3.3,B:3,'B-':2.7,'C+':2.3,C:2,'C-':1.7,'D+':1.3,D:1,'D-':0.7,F:0};
  const grades = classes.filter(c=>c.grade).map(c=>gradeMap[c.grade]||0);
  const gpa = grades.length ? grades.reduce((a,b)=>a+b,0)/grades.length : 0;

  switch(inc.condition){
    case 'gpa_above': case 'gpa_reach': return {current:gpa.toFixed(2),target:target,pct:Math.min(100,(gpa/target)*100)};
    case 'no_missing': {
      const missing = (D.assignments||[]).filter(a=>!a.done).length;
      return {current:missing===0?'✓':''+missing+' missing',target:'0',pct:missing===0?100:0};
    }
    case 'chores_pts': { const pts=(D.chorePoints||{}).total||0; return {current:pts,target:target,pct:Math.min(100,(pts/target)*100)}; }
    case 'chore_streak': { const s=getChoreStreak(); return {current:s,target:target,pct:Math.min(100,(s/target)*100)}; }
    case 'chores_week': { const v=(D.choreLog||[]).filter(l=>l.status==='verified'); return {current:v.length,target:target,pct:Math.min(100,(v.length/(target*7))*100)}; }
    case 'certs_earn': { const c=Object.values(D.skillCerts||{}).filter(Boolean).length; return {current:c,target:target,pct:Math.min(100,(c/target)*100)}; }
    case 'books_read': { const b=(Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length; return {current:b,target:target,pct:Math.min(100,(b/target)*100)}; }
    case 'goals_complete': { const g=(Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length; return {current:g,target:target,pct:Math.min(100,(g/target)*100)}; }
    case 'checkin_streak': { const s=D.streak||0; return {current:s,target:target,pct:Math.min(100,(s/target)*100)}; }
    case 'mood_streak': { const m=D.moods||[];return {current:m.length,target:target,pct:Math.min(100,(m.length/target)*100)}; }
    case 'beh_positive': { const p=(Array.isArray(D.behaviorLog)?D.behaviorLog:[]).filter(b=>b.type==='positive').length; return {current:p,target:target,pct:Math.min(100,(p/target)*100)}; }
    case 'beh_no_neg': { const neg=(Array.isArray(D.behaviorLog)?D.behaviorLog:[]).filter(b=>b.type==='negative'); const recent=neg.filter(n=>{const d=(new Date()-new Date(n.date))/(1000*60*60*24);return d<=target;}); return {current:recent.length===0?target+'+ days':'recent',target:'0 negative',pct:recent.length===0?100:30}; }
    default: return {current:'—',target:inc.target,pct:50};
  }
}

function completeIncentive(id){
  const inc = (Array.isArray(D.incentives)?D.incentives:[]).find(i=>i.id===id);
  if(!inc) return;
  inc.status='completed'; inc.completedDate=new Date().toISOString().slice(0,10);
  if(inc.bonusPts){ initChoreData(); D.chorePoints.total += inc.bonusPts; }
  save(); renderIncentives(); renderParentOverview();
  showToast('Incentive completed! 🎉'+(inc.bonusPts?' +'+inc.bonusPts+' bonus points':''));
}

function removeIncentive(id){
  D.incentives = (Array.isArray(D.incentives)?D.incentives:[]).filter(i=>i.id!==id); save(); renderIncentives();
}

function renderIncentives(){
  const activeEl = document.getElementById('incActiveList');
  const compEl = document.getElementById('incCompletedList');
  if(!activeEl) return;

  const active = (Array.isArray(D.incentives)?D.incentives:[]).filter(i=>i.status==='active');
  const completed = (Array.isArray(D.incentives)?D.incentives:[]).filter(i=>i.status==='completed');

  if(!active.length){
    activeEl.innerHTML = '<div style="color:var(--tx2);font-size:.72rem;padding:.5rem;text-align:center;">No active incentives. Create one above!</div>';
  } else {
    activeEl.innerHTML = active.map(inc=>{
      const prog = checkIncentiveProgress(inc);
      const expired = inc.deadline && inc.deadline < new Date().toISOString().slice(0,10);
      return `<div style="background:rgba(255,255,255,.03);border:1px solid ${expired?'rgba(239,68,68,.2)':'rgba(34,197,94,.12)'};border-radius:12px;padding:.7rem .8rem;margin-bottom:.4rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.3rem;">
          <div><span style="font-size:.9rem;">${inc.emoji}</span> <span style="font-size:.82rem;font-weight:700;color:var(--tx);">${inc.name}</span>${inc.bonusPts?`<span style="font-size:.6rem;color:#22c55e;margin-left:.3rem;">+${inc.bonusPts}pts</span>`:''}</div>
          <div style="display:flex;gap:.25rem;">
            <button class="btn bp bs" onclick="completeIncentive(${inc.id})" style="font-size:.55rem;background:#22c55e;color:#000;">✓ Award</button>
            <button class="btn bda bs" onclick="removeIncentive(${inc.id})" style="font-size:.5rem;">✕</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem;">
          <div style="flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${prog.pct}%;background:${prog.pct>=100?'#22c55e':prog.pct>=50?'#fbbf24':'#60a5fa'};border-radius:3px;transition:width .3s;"></div>
          </div>
          <span style="font-size:.6rem;font-weight:700;color:${prog.pct>=100?'#22c55e':'var(--tx2)'};">${Math.round(prog.pct)}%</span>
        </div>
        <div style="font-size:.58rem;color:var(--tx2);">Current: ${prog.current} · Target: ${prog.target}${inc.deadline?` · Deadline: ${inc.deadline}`:''}${expired?' · <span style="color:#ef4444;">EXPIRED</span>':''}</div>
      </div>`;
    }).join('');
  }

  if(compEl){
    if(!completed.length){ compEl.innerHTML=''; return; }
    compEl.innerHTML = `<div style="font-size:.6rem;color:var(--tx2);margin-bottom:.3rem;text-transform:uppercase;letter-spacing:1px;">Completed</div>` +
      completed.slice(0,5).map(inc=>`
        <div style="display:flex;align-items:center;gap:.5rem;padding:.3rem .5rem;background:rgba(34,197,94,.05);border-radius:8px;margin-bottom:.2rem;opacity:.7;">
          <span>${inc.emoji}</span>
          <span style="flex:1;font-size:.68rem;color:var(--tx);text-decoration:line-through;">${inc.name}</span>
          <span style="font-size:.55rem;color:#22c55e;">✓ ${inc.completedDate||''}</span>
        </div>
      `).join('');
  }
}

// ── BEHAVIOR LOG ─────────────────────────────────────────────
function addBehaviorLog(){
  if(!D.behaviorLog) D.behaviorLog=[];
  const type = (document.getElementById('behType')||{}).value;
  const cat = (document.getElementById('behCat')||{}).value;
  const note = (document.getElementById('behNote')||{}).value.trim();
  if(!note){ showToast('Describe the behavior'); return; }
  const catEmojis = {attitude:'😊',responsibility:'💪',respect:'🤝',initiative:'🚀',kindness:'💗',honesty:'⭐',focus:'🎯',teamwork:'👪'};
  D.behaviorLog.push({
    id:Date.now(), type, cat, note, emoji:catEmojis[cat]||'📌',
    date:new Date().toISOString().slice(0,10),
    time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})
  });
  document.getElementById('behNote').value='';
  save(); renderBehaviorLog();
  showToast(type==='positive'?'Positive behavior logged 👍':'Behavior noted');
}

function removeBehLog(id){
  D.behaviorLog = (Array.isArray(D.behaviorLog)?D.behaviorLog:[]).filter(b=>b.id!==id); save(); renderBehaviorLog();
}

function renderBehaviorLog(){
  const scoreEl = document.getElementById('behScoreCards');
  const listEl = document.getElementById('behaviorLogList');
  if(!scoreEl||!listEl) return;
  const logs = D.behaviorLog||[];
  const cats = ['attitude','responsibility','respect','initiative','kindness','honesty','focus','teamwork'];
  const catEmojis = {attitude:'😊',responsibility:'💪',respect:'🤝',initiative:'🚀',kindness:'💗',honesty:'⭐',focus:'🎯',teamwork:'👪'};

  // Score cards per category
  scoreEl.innerHTML = cats.map(cat=>{
    const pos = logs.filter(l=>l.cat===cat && l.type==='positive').length;
    const neg = logs.filter(l=>l.cat===cat && l.type==='negative').length;
    const net = pos-neg;
    if(pos===0&&neg===0) return '';
    return `<div style="padding:.35rem .5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;text-align:center;min-width:70px;">
      <div style="font-size:.65rem;">${catEmojis[cat]}</div>
      <div style="font-size:.9rem;font-weight:800;color:${net>0?'#22c55e':net<0?'#ef4444':'#fbbf24'};">${net>0?'+':''}${net}</div>
      <div style="font-size:.48rem;color:var(--tx2);text-transform:capitalize;">${cat}</div>
    </div>`;
  }).filter(Boolean).join('');

  // Log list
  const recent = logs.slice().sort((a,b)=>b.id-a.id).slice(0,25);
  if(!recent.length){ listEl.innerHTML='<div style="color:var(--tx2);font-size:.72rem;padding:.5rem;text-align:center;">No behavior logged yet.</div>'; return; }
  listEl.innerHTML = recent.map(l=>`
    <div style="display:flex;align-items:flex-start;gap:.5rem;padding:.4rem .5rem;border-bottom:1px solid rgba(255,255,255,.04);">
      <span style="font-size:.85rem;">${l.type==='positive'?'👍':'👎'}</span>
      <div style="flex:1;">
        <div style="font-size:.7rem;color:var(--tx);">${l.note}</div>
        <div style="font-size:.55rem;color:var(--tx2);">${l.emoji} ${l.cat} · ${l.date} ${l.time}</div>
      </div>
      <button class="btn bda bs" onclick="removeBehLog(${l.id})" style="font-size:.45rem;padding:.1rem .2rem;">✕</button>
    </div>
  `).join('');
}

// ── GRADE MONITOR ────────────────────────────────────────────
function setGPATarget(){
  D.gpaTarget = parseFloat((document.getElementById('gpaTargetInput')||{}).value)||3.5;
  save(); renderGradeMonitor();
}

function renderGradeMonitor(){
  const el = document.getElementById('gradeMonitorList'); if(!el) return;
  const target = D.gpaTarget||3.5;
  const ti = document.getElementById('gpaTargetInput');
  if(ti && !ti.value) ti.value = target;

  const classes = D.classes||[];
  const gradeMap = {'A+':4,A:4,'A-':3.7,'B+':3.3,B:3,'B-':2.7,'C+':2.3,C:2,'C-':1.7,'D+':1.3,D:1,'D-':0.7,F:0};
  const grades = classes.filter(c=>c.grade).map(c=>({name:c.name,grade:c.grade,pts:gradeMap[c.grade]||0}));
  const gpa = grades.length ? (grades.reduce((s,g)=>s+g.pts,0)/grades.length) : 0;
  const pending = (D.assignments||[]).filter(a=>!a.done).length;

  const disp = document.getElementById('gpaCurrentDisplay');
  if(disp) disp.innerHTML = `Current: <span style="color:${gpa>=target?'#22c55e':gpa>=target-0.5?'#fbbf24':'#ef4444'}">${gpa?gpa.toFixed(2):'—'}</span> · Target: ${target} ${gpa>=target?'✅':'⚠️'} ${pending?`· <span style="color:#fb923c;">${pending} pending assignments</span>`:''}`;

  if(!classes.length){ el.innerHTML='<div style="color:var(--tx2);font-size:.72rem;padding:.5rem;">No classes entered in School section yet.</div>'; return; }
  el.innerHTML = classes.map(c=>{
    const pts = gradeMap[c.grade]||0;
    const assignCount = (D.assignments||[]).filter(a=>a.classId===c.id||a.className===c.name).length;
    return `<div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;margin-bottom:.25rem;">
      <div style="width:36px;height:36px;border-radius:8px;background:${pts>=3.5?'rgba(34,197,94,.12)':pts>=2.5?'rgba(251,191,36,.12)':'rgba(239,68,68,.12)'};display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900;color:${pts>=3.5?'#22c55e':pts>=2.5?'#fbbf24':'#ef4444'};flex-shrink:0;">${c.grade||'—'}</div>
      <div style="flex:1;"><div style="font-size:.75rem;font-weight:600;color:var(--tx);">${c.name||'Unnamed Class'}</div></div>
    </div>`;
  }).join('');
}

// ── PARENT ACTIVITY FEED ─────────────────────────────────────
function renderParentActivityFeed(){
  const el = document.getElementById('parentActivityFeed'); if(!el) return;
  const feed = [];
  const today = new Date();
  const format = d => { const dt=new Date(d+'T12:00:00'); return dt.toLocaleDateString('en',{month:'short',day:'numeric'}); };

  // Chore logs
  (D.choreLog||[]).slice(-10).forEach(l=>feed.push({date:l.date,time:l.time,icon:l.emoji,text:`${l.choreName} — ${l.status}`,color:l.status==='verified'?'#22c55e':l.status==='pending'?'#fbbf24':'#ef4444'}));

  // Mood entries
  const moodEmojis = {5:'😄',4:'🙂',3:'😐',2:'😔',1:'😢'};
  (D.moods||[]).slice(-5).forEach(m=>feed.push({date:m.date,time:m.time||'',icon:moodEmojis[m.level],text:`Mood: ${m.note||['','Rough','Not great','Okay','Good','Great'][m.level]}`,color:'#22d3ee'}));

  // Journal entries
  (Array.isArray(D.journal)?D.journal:[]).slice(-5).forEach(j=>feed.push({date:j.date,time:'',icon:'✍️',text:'Journal entry',color:'#f472b6'}));

  // Goals completed
  (Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).slice(-5).forEach(g=>feed.push({date:g.doneDate||'',time:'',icon:'🎯',text:`Goal completed: ${g.text}`,color:'#60a5fa'}));

  // Milestones
  (D.milestones||[]).slice(-5).forEach(m=>feed.push({date:m.date,time:'',icon:m.emoji,text:`Milestone: ${m.title}`,color:'#a78bfa'}));

  // Books finished
  (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').slice(-3).forEach(b=>feed.push({date:b.finished||b.added,time:'',icon:'📖',text:`Finished: ${b.title}`,color:'#fb923c'}));

  // Behavior logs
  (Array.isArray(D.behaviorLog)?D.behaviorLog:[]).slice(-5).forEach(b=>feed.push({date:b.date,time:b.time,icon:b.type==='positive'?'👍':'👎',text:b.note,color:b.type==='positive'?'#22c55e':'#ef4444'}));

  feed.sort((a,b)=>(b.date||'').localeCompare(a.date||''));

  if(!feed.length){ el.innerHTML='<div style="color:var(--tx2);font-size:.72rem;padding:1rem;text-align:center;">No activity recorded yet.</div>'; return; }

  el.innerHTML = feed.slice(0,30).map(f=>`
    <div style="display:flex;align-items:center;gap:.5rem;padding:.35rem .4rem;border-bottom:1px solid rgba(255,255,255,.04);">
      <span style="font-size:.85rem;">${f.icon}</span>
      <div style="flex:1;font-size:.68rem;color:var(--tx);">${f.text}</div>
      <span style="font-size:.5rem;color:var(--tx2);white-space:nowrap;">${f.date?format(f.date):''} ${f.time||''}</span>
    </div>
  `).join('');
}

// ── STUDY PLANNER ────────────────────────────────────────────
function populateStudySelects(){
  const classes = D.classes||[];
  // Populate datalist for spSubject text input
  const dl = document.getElementById('spSubjectList');
  if(dl) dl.innerHTML = classes.map(c=>`<option value="${c.name}">`).join('') + '<option value="Math"><option value="Science"><option value="English"><option value="History"><option value="PE"><option value="Art"><option value="Other">';
  // Populate examClass select (still a select)
  const ec = document.getElementById('examClass');
  if(ec) ec.innerHTML = '<option value="">— Select Class —</option>' + classes.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
}

function addStudyBlock(){
  const day = (document.getElementById('spDay')||{}).value;
  const time = (document.getElementById('spTime')||{}).value||'15:30';
  const duration = parseInt((document.getElementById('spDuration')||{}).value)||60;
  const subject = (document.getElementById('spSubject')||{}).value;
  const topic = (document.getElementById('spTopic')||{}).value.trim();
  if(!subject||!subject.trim()){ showToast('Enter a subject'); return; }
  if(!D.studyPlan) D.studyPlan=[];
  D.studyPlan.push({id:Date.now(), day, time, duration, subject, topic});
  document.getElementById('spTopic').value='';
  save(); renderStudyPlan();
  showToast('Study block added ✓');
}

function removeStudyBlock(id){
  D.studyPlan=(D.studyPlan||[]).filter(b=>b.id!==id); save(); renderStudyPlan();
}

function clearStudyPlan(){
  if(!confirm('Clear entire study plan?')) return;
  D.studyPlan=[]; save(); renderStudyPlan();
}

function renderStudyPlan(){
  populateStudySelects();
  const el = document.getElementById('studyPlanGrid'); if(!el) return;
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const plan = D.studyPlan||[];
  const today = days[new Date().getDay()===0?6:new Date().getDay()-1];

  el.innerHTML = days.map(day=>{
    const blocks = plan.filter(b=>b.day===day).sort((a,b)=>a.time.localeCompare(b.time));
    const isToday = day===today;
    return `<div style="background:${isToday?'rgba(96,165,250,.06)':'rgba(255,255,255,.02)'};border:1px solid ${isToday?'rgba(96,165,250,.2)':'rgba(255,255,255,.06)'};border-radius:8px;padding:.4rem;min-height:80px;">
      <div style="font-size:.55rem;font-weight:700;color:${isToday?'#60a5fa':'var(--tx2)'};text-align:center;margin-bottom:.3rem;text-transform:uppercase;">${day.slice(0,3)}${isToday?' ●':''}</div>
      ${blocks.length?blocks.map(b=>`<div style="background:rgba(255,255,255,.05);border-radius:5px;padding:.2rem .3rem;margin-bottom:.2rem;font-size:.5rem;position:relative;">
        <div style="font-weight:700;color:var(--tx);">${b.subject}</div>
        <div style="color:var(--tx2);">${b.time} · ${b.duration}m</div>
        ${b.topic?`<div style="color:var(--c);font-size:.45rem;">${b.topic}</div>`:''}
        <button onclick="removeStudyBlock(${b.id})" style="position:absolute;top:2px;right:3px;background:none;border:none;color:var(--tx2);font-size:.45rem;cursor:pointer;">✕</button>
      </div>`).join(''):`<div style="font-size:.45rem;color:var(--tx2);text-align:center;padding:.5rem 0;">Free</div>`}
    </div>`;
  }).join('');

  // Show/hide empty tip
  const spTip = document.getElementById('spEmptyTip');
  if(spTip) spTip.style.display = (D.studyPlan&&D.studyPlan.length) ? 'none' : 'block';

  // Upcoming deadlines
  const deadEl = document.getElementById('upcomingDeadlines'); if(!deadEl) return;
  const now = new Date(); const todayStr = now.toISOString().slice(0,10);
  const upcoming = (D.assignments||[]).filter(a=>!a.done && a.due && a.due>=todayStr)
    .sort((a,b)=>a.due.localeCompare(b.due)).slice(0,6);
  const exams = (D.exams||[]).filter(e=>e.date>=todayStr).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);

  const combined = [
    ...upcoming.map(a=>{const d=new Date(a.due+'T12:00:00');const diff=Math.ceil((d-now)/(1000*60*60*24));return {name:a.name,date:a.due,diff,type:'assignment',color:diff<=1?'#ef4444':diff<=3?'#fbbf24':'var(--tx2)'};}),
    ...exams.map(e=>{const d=new Date(e.date+'T12:00:00');const diff=Math.ceil((d-now)/(1000*60*60*24));return {name:'📝 EXAM: '+e.name,date:e.date,diff,type:'exam',color:diff<=2?'#ef4444':diff<=7?'#fb923c':'var(--tx2)'};})
  ].sort((a,b)=>a.date.localeCompare(b.date));

  if(!combined.length){ deadEl.innerHTML='<div style="font-size:.7rem;color:var(--tx2);padding:.3rem;">No upcoming deadlines 🎉</div>'; return; }
  deadEl.innerHTML = combined.map(c=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-left:3px solid ${c.color};margin-bottom:.2rem;">
      <span style="font-size:.68rem;font-weight:600;color:var(--tx);">${c.name}</span>
      <span style="margin-left:auto;font-size:.58rem;color:${c.color};font-weight:700;">${c.diff===0?'TODAY':c.diff===1?'Tomorrow':c.diff+'d'}</span>
    </div>
  `).join('');
}

// ── EXAM TRACKER ─────────────────────────────────────────────
function addExam(){
  const name = (document.getElementById('examName')||{}).value.trim();
  if(!name){ showToast('Name the exam'); return; }
  const cls = (document.getElementById('examClass')||{}).value;
  const date = (document.getElementById('examDate')||{}).value;
  if(!date){ showToast('Pick a date'); return; }
  if(!D.exams) D.exams=[];
  D.exams.push({id:Date.now(), name, class:cls, date, score:''});
  document.getElementById('examName').value='';
  save(); renderExams(); renderStudyPlan();
  showToast('Exam added ✓');
}

function removeExam(id){ D.exams=(D.exams||[]).filter(e=>e.id!==id); save(); renderExams(); renderStudyPlan(); }

function setExamScore(id){
  const score = prompt('Enter score (e.g. 92, A, 85%):');
  if(score===null) return;
  const exam = (D.exams||[]).find(e=>e.id===id);
  if(exam){ exam.score=score; save(); renderExams(); showToast('Score recorded ✓'); }
}

function renderExams(){
  const el = document.getElementById('examList'); if(!el) return;
  const exams = (D.exams||[]).sort((a,b)=>a.date.localeCompare(b.date));
  const today = new Date().toISOString().slice(0,10);
  if(!exams.length){ el.innerHTML='<div style="font-size:.7rem;color:var(--tx2);">No exams tracked yet.</div>'; return; }
  el.innerHTML = exams.map(e=>{
    const d = new Date(e.date+'T12:00:00');
    const diff = Math.ceil((d-new Date())/(1000*60*60*24));
    const past = e.date<today;
    return `<div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;margin-bottom:.25rem;${past&&e.score?'opacity:.7;':''}">
      <div style="width:36px;text-align:center;flex-shrink:0;">
        <div style="font-size:.85rem;font-weight:900;color:${!past?diff<=2?'#ef4444':diff<=7?'#fbbf24':'var(--tx)':'var(--tx2)'};">${past?'✓':diff+'d'}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:.72rem;font-weight:600;color:var(--tx);">${e.name}${e.class?' — '+e.class:''}</div>
        <div style="font-size:.55rem;color:var(--tx2);">${d.toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})}</div>
      </div>
      ${e.score?`<span style="font-size:.7rem;font-weight:700;color:#22c55e;">${e.score}</span>`:`<button class="btn bgh bs" onclick="setExamScore(${e.id})" style="font-size:.55rem;">${past?'+ Score':'Upcoming'}</button>`}
      <button class="btn bda bs" onclick="removeExam(${e.id})" style="font-size:.45rem;">✕</button>
    </div>`;
  }).join('');
}

// ── ALLOWANCE & EARNINGS ─────────────────────────────────────
function initAllowance(){ if(!D.allowance) D.allowance={wallet:0,savings:0,totalEarned:0,goalName:'',goalAmt:0,log:[]}; }

function addAllowanceIncome(){
  initAllowance();
  const amt = parseFloat((document.getElementById('allowAddAmt')||{}).value);
  if(!amt||amt<=0){ showToast('Enter an amount'); return; }
  const type = (document.getElementById('allowAddType')||{}).value;
  const note = (document.getElementById('allowAddNote')||{}).value.trim();
  const typeLabels = {allowance:'💵 Allowance',earned:'💪 Earned',gift:'🎁 Gift',other:'📌 Other'};
  D.allowance.wallet += amt;
  D.allowance.totalEarned += amt;
  D.allowance.log.push({id:Date.now(), type:'income', amt, cat:type, label:typeLabels[type]||type, note, date:new Date().toISOString().slice(0,10), time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})});
  document.getElementById('allowAddAmt').value='';
  document.getElementById('allowAddNote').value='';
  save();
  showToast(`+$${amt.toFixed(2)} added ✓`);
}

function addAllowanceSpend(){
  initAllowance();
  const amt = parseFloat((document.getElementById('allowSpendAmt')||{}).value);
  if(!amt||amt<=0){ showToast('Enter an amount'); return; }
  const cat = (document.getElementById('allowSpendCat')||{}).value;
  const note = (document.getElementById('allowSpendNote')||{}).value.trim();
  const catLabels = {food:'🍔 Food',clothes:'👕 Clothes',games:'🎮 Entertainment',school:'📚 School',gift:'🎁 Gift',saving:'💙 To Savings',other:'📌 Other'};

  if(cat==='saving'){
    D.allowance.wallet -= amt;
    D.allowance.savings += amt;
    D.allowance.log.push({id:Date.now(), type:'transfer', amt, cat, label:'💙 Moved to Savings', note, date:new Date().toISOString().slice(0,10), time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})});
  } else {
    if(amt > D.allowance.wallet){ showToast(`Only $${D.allowance.wallet.toFixed(2)} in wallet`); return; }
    D.allowance.wallet -= amt;
    D.allowance.log.push({id:Date.now(), type:'spend', amt, cat, label:catLabels[cat]||cat, note, date:new Date().toISOString().slice(0,10), time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})});
  }
  document.getElementById('allowSpendAmt').value='';
  document.getElementById('allowSpendNote').value='';
  save();
  showToast(cat==='saving'?`$${amt.toFixed(2)} moved to savings`:`-$${amt.toFixed(2)} spent`);
}

function updateAllowSavingsGoal(){
  initAllowance();
  D.allowance.goalName = (document.getElementById('allowGoalName')||{}).value;
  D.allowance.goalAmt = parseFloat((document.getElementById('allowGoalAmt')||{}).value)||0;
  save();
}

function renderAllowance(){
  initAllowance();
  const a = D.allowance;

  // Balances
  const we = document.getElementById('allowWallet'); if(we) we.textContent = '$'+a.wallet.toFixed(2);
  const se = document.getElementById('allowSavings'); if(se) se.textContent = '$'+a.savings.toFixed(2);
  const te = document.getElementById('allowTotalEarned'); if(te) te.textContent = '$'+a.totalEarned.toFixed(2);

  // Savings goal
  const goalEl = document.getElementById('allowSavingsGoalArea');
  if(goalEl && a.goalName && a.goalAmt > 0){
    const pct = Math.min(100, (a.savings/a.goalAmt)*100);
    goalEl.innerHTML = `<div style="background:rgba(96,165,250,.06);border:1px solid rgba(96,165,250,.15);border-radius:10px;padding:.6rem .8rem;">
      <div style="display:flex;justify-content:space-between;font-size:.7rem;margin-bottom:.25rem;"><span style="color:#60a5fa;font-weight:700;">🎯 ${a.goalName}</span><span style="color:var(--tx2);">$${a.savings.toFixed(2)} / $${a.goalAmt.toFixed(2)}</span></div>
      <div style="height:8px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#60a5fa,#22c55e);border-radius:4px;transition:width .4s;"></div></div>
      <div style="font-size:.55rem;color:var(--tx2);margin-top:.2rem;text-align:right;">${Math.round(pct)}% ${pct>=100?'— GOAL REACHED! 🎉':''}</div>
    </div>`;
  } else if(goalEl){ goalEl.innerHTML=''; }

  // Load goal inputs
  const gn = document.getElementById('allowGoalName'); if(gn && !gn.value && a.goalName) gn.value=a.goalName;
  const ga = document.getElementById('allowGoalAmt'); if(ga && !ga.value && a.goalAmt) ga.value=a.goalAmt;

  // History
  const hist = document.getElementById('allowHistory'); if(!hist) return;
  const log = (a.log||[]).slice().sort((a,b)=>b.id-a.id).slice(0,30);
  if(!log.length){ hist.innerHTML='<div style="color:var(--tx2);font-size:.72rem;padding:1rem;text-align:center;">No transactions yet. Add your first allowance above!</div>'; return; }
  hist.innerHTML = log.map(l=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.35rem .4rem;border-bottom:1px solid rgba(255,255,255,.04);">
      <span style="font-size:.7rem;">${l.type==='income'?'💰':l.type==='transfer'?'💙':'🛒'}</span>
      <div style="flex:1;">
        <div style="font-size:.68rem;color:var(--tx);">${l.label}${l.note?' — '+l.note:''}</div>
      </div>
      <span style="font-size:.72rem;font-weight:700;color:${l.type==='income'?'#22c55e':l.type==='transfer'?'#60a5fa':'#fb923c'};">${l.type==='income'?'+':l.type==='transfer'?'→':'-'}$${l.amt.toFixed(2)}</span>
      <span style="font-size:.48rem;color:var(--tx2);">${l.date.slice(5)}</span>
    </div>
  `).join('');
}


// ── HERO ALERTS STRIP ────────────────────────────────────────
function renderHeroAlerts(){
  const el = document.getElementById('heroAlertsStrip'); if(!el) return;
  const alerts = [];
  const today = new Date();
  const todayStr = today.toISOString().slice(0,10);

  // Upcoming assignments (due within 3 days)
  const urgentAsg = (D.assignments||[]).filter(a=>{
    if(a.done||!a.due) return false;
    const diff = Math.ceil((new Date(a.due+'T12:00:00')-today)/(1000*60*60*24));
    return diff >= 0 && diff <= 3;
  }).sort((a,b)=>a.due.localeCompare(b.due));
  if(urgentAsg.length){
    const first = urgentAsg[0];
    const diff = Math.ceil((new Date(first.due+'T12:00:00')-today)/(1000*60*60*24));
    alerts.push({icon:'📝',color:'#ef4444',border:'rgba(239,68,68,.2)',bg:'rgba(239,68,68,.05)',
      title:diff===0?'DUE TODAY':diff===1?'Due Tomorrow':diff+'d left',
      sub:urgentAsg.length+' assignment'+(urgentAsg.length>1?'s':'')+' due soon',
      click:"showSection('s-school')"});
  }

  // Upcoming exams (within 7 days)
  const urgentExams = (D.exams||[]).filter(e=>{
    const diff = Math.ceil((new Date(e.date+'T12:00:00')-today)/(1000*60*60*24));
    return diff >= 0 && diff <= 7;
  });
  if(urgentExams.length){
    const first = urgentExams[0];
    const diff = Math.ceil((new Date(first.date+'T12:00:00')-today)/(1000*60*60*24));
    alerts.push({icon:'📝',color:'#fb923c',border:'rgba(251,146,60,.2)',bg:'rgba(251,146,60,.05)',
      title:'Exam: '+first.name, sub:diff===0?'TODAY!':diff===1?'Tomorrow':diff+' days away',
      click:"showSection('s-school')"});
  }

  // Pending chores
  const pendingChores = (D.choreLog||[]).filter(l=>l.status==='pending').length;
  const todayChores = (Array.isArray(D.chores)?D.chores:[]).filter(c=>c.active).length;
  const todayDone = (D.choreLog||[]).filter(l=>l.date===todayStr && (l.status==='done'||l.status==='pending'||l.status==='verified')).length;
  if(todayChores > 0){
    const allDone = todayDone >= todayChores;
    alerts.push({icon:allDone?'✅':'🏠',color:allDone?'#22c55e':'#fbbf24',
      border:allDone?'rgba(34,197,94,.2)':'rgba(251,191,36,.2)',bg:allDone?'rgba(34,197,94,.05)':'rgba(251,191,36,.05)',
      title:allDone?'Chores Done!':todayDone+'/'+todayChores+' Chores',
      sub:pendingChores?pendingChores+' awaiting verification':'Complete your tasks',
      click:"showSection('s-chores')"});
  }

  // Allowance balance
  if(D.allowance && D.allowance.wallet > 0){
    alerts.push({icon:'💵',color:'#22c55e',border:'rgba(34,197,94,.15)',bg:'rgba(34,197,94,.04)',
      title:'$'+D.allowance.wallet.toFixed(2)+' available',
      sub:D.allowance.goalName?'Saving for: '+D.allowance.goalName:'In your wallet',
      click:"showSection('s-allowance')"});
  }

  // Active incentives
  const activeInc = (Array.isArray(D.incentives)?D.incentives:[]).filter(i=>i.status==='active');
  if(activeInc.length){
    const closest = activeInc[0];
    const prog = typeof checkIncentiveProgress==='function' ? checkIncentiveProgress(closest) : {pct:0};
    alerts.push({icon:'🎯',color:'#a78bfa',border:'rgba(167,139,250,.2)',bg:'rgba(167,139,250,.05)',
      title:closest.name, sub:Math.round(prog.pct)+'% progress · '+activeInc.length+' active',
      click:"showSection('s-parent')"});
  }

  // Mood check
  const todayMood = (D.moods||[]).find(m=>m.date===todayStr);
  if(!todayMood){
    alerts.push({icon:'😊',color:'#22d3ee',border:'rgba(34,211,238,.15)',bg:'rgba(34,211,238,.04)',
      title:'Log Your Mood', sub:'How are you feeling today?',
      click:"showSection('s-mood')"});
  }

  // Chore points / level
  const pts = (D.chorePoints||{}).total||0;
  if(pts > 0){
    const lvl = CHORE_LEVELS ? (CHORE_LEVELS.find(l=>pts>=l.min && pts<l.max)||{name:'GOAT',level:8}) : {name:'',level:0};
    alerts.push({icon:'⭐',color:'#fbbf24',border:'rgba(251,191,36,.15)',bg:'rgba(251,191,36,.04)',
      title:'Level '+lvl.level+' — '+lvl.name, sub:pts+' chore points earned',
      click:"showSection('s-chores')"});
  }

  if(!alerts.length){ el.style.display='none'; return; }
  el.style.display='grid';
  el.innerHTML = alerts.slice(0,4).map(a=>`
    <div onclick="${a.click}" style="background:${a.bg};border:1px solid ${a.border};border-radius:10px;padding:.55rem .7rem;cursor:pointer;transition:all .15s;" onmouseenter="this.style.transform='translateY(-1px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:center;gap:.4rem;">
        <span style="font-size:1rem;">${a.icon}</span>
        <div>
          <div style="font-size:.7rem;font-weight:700;color:${a.color};">${a.title}</div>
          <div style="font-size:.55rem;color:var(--tx2);">${a.sub}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── ELEVATOR PITCH BUILDER ───────────────────────────────────
function savePitch(){
  D.elevatorPitch = (document.getElementById('pitchText')||{}).value||'';
  save(); showToast('Pitch saved ✓');
}

function loadPitch(){
  const el = document.getElementById('pitchText');
  if(el && D.elevatorPitch) el.value = D.elevatorPitch;
}

// ── MOCK INTERVIEW LOG ───────────────────────────────────────
function addMockInterview(){
  const date = (document.getElementById('mockDate')||{}).value || new Date().toISOString().slice(0,10);
  const partner = (document.getElementById('mockPartner')||{}).value.trim();
  const notes = (document.getElementById('mockNotes')||{}).value.trim();
  const rating = parseInt((document.getElementById('mockRating')||{}).value)||3;
  if(!D.mockInterviews) D.mockInterviews=[];
  D.mockInterviews.push({id:Date.now(), date, partner, notes, rating});
  if(document.getElementById('mockPartner')) document.getElementById('mockPartner').value='';
  if(document.getElementById('mockNotes')) document.getElementById('mockNotes').value='';
  save(); renderMockInterviews();
  showToast('Practice logged ✓');
}

function renderMockInterviews(){
  const el = document.getElementById('mockIntList'); if(!el) return;
  const mocks = (D.mockInterviews||[]).slice().sort((a,b)=>b.id-a.id);
  if(!mocks.length){ el.innerHTML='<div style="color:var(--tx2);font-size:.72rem;padding:.5rem;">No practice sessions yet. Start practicing!</div>'; return; }
  const stars = n => '⭐'.repeat(n)+'☆'.repeat(5-n);
  el.innerHTML = mocks.slice(0,10).map(m=>`
    <div style="padding:.4rem .5rem;border-bottom:1px solid rgba(255,255,255,.04);">
      <div style="display:flex;justify-content:space-between;"><span style="font-size:.7rem;font-weight:600;color:var(--tx);">${m.partner||'Solo practice'}</span><span style="font-size:.55rem;color:var(--tx2);">${m.date}</span></div>
      <div style="font-size:.55rem;color:#fbbf24;">${stars(m.rating)}</div>
      ${m.notes?`<div style="font-size:.6rem;color:var(--tx2);margin-top:.15rem;">${m.notes}</div>`:''}
    </div>
  `).join('');
}

// ── GETTING STARTED ONBOARDING ────────────────────────────────
const GS_STEPS = [
  {id:'gs-name', icon:'👋', title:'Set Your Name',
   tip:'<b>Your identity starts here.</b> Tap the name on the dashboard or go to <b>Settings ⚙️</b>. Your name appears on your dashboard, bio page, and resume.',
   check:()=>!!(D.name && D.name.trim()),
   action:"openModal('settingsModal');"},
  {id:'gs-stage', icon:'🎯', title:'Choose Your Life Stage',
   tip:'<b>LifeOS adapts to where you are.</b> Go to <b>Settings ⚙️</b> and pick your level — Middle School through Young Adult. This controls which sections and learning pathways you see.',
   check:()=>!!(D.mode && D.mode!=='mid_hs'),
   action:"openModal('settingsModal');"},
  {id:'gs-daily', icon:'✅', title:'Complete a Daily Activity',
   tip:'<b>Build daily habits!</b> Check off activities in the <b>Daily Activity Check</b> on your dashboard — scripture, exercise, journaling, reading, kindness, and more. Complete all for bonus PB!',
   check:()=>{const today=new Date().toISOString().slice(0,10);return D.dailyChecks&&D.dailyChecks[today]&&Object.keys(D.dailyChecks[today]).length>0;},
   action:"document.getElementById('dacGrid')&&document.getElementById('dacGrid').scrollIntoView({behavior:'smooth'});"},
  {id:'gs-skill', icon:'🧠', title:'Read a Life Skill Lesson',
   tip:'<b>140+ lessons across 16 categories!</b> Go to <b>Life Skills Academy</b>, tap any category, and read a lesson. Then take the quiz to earn your certificate.',
   check:()=>Object.values(D.skillCerts||{}).filter(Boolean).length>0||(Array.isArray(D.activityLog)?D.activityLog:[]).some(a=>a.type==='lesson'),
   action:"showSection('s-skills');"},
  {id:'gs-character', icon:'💎', title:'Read a Character Lesson',
   tip:'<b>Build who you are.</b> Go to <b>Character & Life Lessons</b> — explore Kindness, Honesty, Responsibility, Friendship, Emotional Intelligence, and Leadership.',
   check:()=>(Array.isArray(D.activityLog)?D.activityLog:[]).some(a=>a.type==='character'),
   action:"showSection('s-character');"},
  {id:'gs-growing', icon:'🌱', title:'Read a Growing Up Topic',
   tip:'<b>43 topics</b> covering puberty, emotions, relationships, confidence, decision-making, world religions, and more. Check the box when you finish reading!',
   check:()=>D.growingUpRead&&Object.keys(D.growingUpRead).length>0,
   action:"showSection('s-growing');"},
  {id:'gs-goal', icon:'🎯', title:'Set Your First Goal',
   tip:'<b>Goals give direction.</b> Go to <b>Goals</b> and create something you want to achieve — academic, personal, fitness, anything.',
   check:()=>(Array.isArray(D.goals)?D.goals:[]).length>0,
   action:"showSection('s-goals');"},
  {id:'gs-journal', icon:'✍️', title:'Write a Journal Entry',
   tip:'<b>Reflection builds wisdom.</b> Go to <b>Journal</b> and write about your day, your thoughts, or respond to the daily prompt.',
   check:()=>(Array.isArray(D.journal)?D.journal:[]).length>0,
   action:"showSection('s-journal');"},
  {id:'gs-challenge', icon:'🏆', title:'Check the Challenges',
   tip:'<b>Compete and earn!</b> Go to <b>Contests & Challenges</b> to see active challenges, the leaderboard, and family rewards. Complete challenges for PB!',
   check:()=>D.challengeProgress&&Object.keys(D.challengeProgress).length>0,
   action:"showSection('s-contests');"},
  {id:'gs-lifemap', icon:'🗺️', title:'Unlock a Life Map Milestone',
   tip:'<b>Your journey visualized!</b> Check your <b>Life Map</b> on the dashboard — complete milestones from Getting Started to Life Master. Each one unlocks as you progress!',
   check:()=>DEV_MAP_STAGES.filter(s=>s.check()).length>=3,
   action:"document.getElementById('lifeMapBoard')&&document.getElementById('lifeMapBoard').scrollIntoView({behavior:'smooth'});"},
];

let _gsOpenTip = null;

function toggleGsTip(id){
  const el = document.getElementById('gstip-'+id);
  if(!el) return;
  if(_gsOpenTip && _gsOpenTip !== id){
    const prev = document.getElementById('gstip-'+_gsOpenTip);
    if(prev) prev.classList.remove('gs-show');
  }
  el.classList.toggle('gs-show');
  _gsOpenTip = el.classList.contains('gs-show') ? id : null;
}

function gsAction(id, action){
  try{ eval(action); }catch(e){}
}

function renderGettingStarted(){
  const el = document.getElementById('gettingStarted'); if(!el) return;
  if(D.gsDismissed){ el.innerHTML=''; el.style.display='none'; return; }

  const results = GS_STEPS.map(s=>({...s, done:s.check()}));
  const done = results.filter(r=>r.done).length;
  const total = results.length;

  if(done >= total){
    D.gsDismissed = true; save();
    el.innerHTML=''; el.style.display='none'; return;
  }

  const pct = Math.round((done/total)*100);
  _gsOpenTip = null;

  el.style.display='block';
  el.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(56,189,248,.05),rgba(139,92,246,.05));border:1px solid rgba(56,189,248,.15);border-radius:16px;padding:1rem 1.2rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem;">
        <div>
          <span style="font-family:var(--fh);font-size:.78rem;letter-spacing:1.5px;color:#38bdf8;font-weight:700;">🚀 LET'S GET STARTED</span>
          <span style="font-size:.6rem;color:var(--tx2);margin-left:.5rem;">${done}/${total}</span>
        </div>
        <button onclick="dismissGettingStarted()" style="background:none;border:none;color:var(--tx2);font-size:.6rem;cursor:pointer;padding:.2rem .4rem;" title="Dismiss">✕</button>
      </div>
      <div style="background:rgba(56,189,248,.1);border-radius:5px;height:6px;overflow:hidden;margin-bottom:.8rem;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#38bdf8,#22c55e);border-radius:5px;transition:width .5s;"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.3rem;">
        ${results.map(s=>`
          <div>
            <div class="gs-step ${s.done?'gs-done':''}" onclick="${s.done?'':`toggleGsTip('${s.id}')`}">
              <span style="font-size:1rem;flex-shrink:0;">${s.done?'✅':s.icon}</span>
              <span style="font-size:.68rem;font-weight:600;color:${s.done?'var(--tx2)':'var(--tx)'};flex:1;${s.done?'text-decoration:line-through;':''}">${s.title}</span>
              ${s.done?'':'<span style="font-size:.55rem;color:var(--tx2);">ⓘ</span>'}
            </div>
            <div class="gs-tip" id="gstip-${s.id}">
              ${s.tip}
              <div style="margin-top:.5rem;display:flex;gap:.4rem;">
                <button class="btn bp bs" onclick="gsAction('${s.id}',\`${s.action.replace(/'/g,"\\'")}\`)" style="font-size:.6rem;">→ Go There</button>
                <button class="btn bgh bs" onclick="toggleGsTip('${s.id}')" style="font-size:.6rem;">Close</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function dismissGettingStarted(){
  D.gsDismissed = true; save();
  const el = document.getElementById('gettingStarted');
  if(el){ el.style.display='none'; el.innerHTML=''; }
  showToast('Guide dismissed — restore anytime in Settings');
}

function resetGettingStarted(){
  D.gsDismissed = false; save();
  renderGettingStarted();
  showToast('Getting Started guide restored ✓');
}

// ── PARENT GETTING STARTED ───────────────────────────────────
const GS_PARENT_STEPS = [
  {id:'gsp-pin', icon:'🔐', title:'Set Your Parent PIN',
   tip:'Your PIN protects the Parent Hub and Chore verification. Only you should know it. Set it the first time you enter Parent Hub or Chore parent mode.',
   check:()=>!!D.chorePin},
  {id:'gsp-chore', icon:'✅', title:'Add Your First Chore',
   tip:'Go to <b>Chores → Parent Mode</b> and add tasks with point values. Daily chores reset each day. Weekly chores reset Monday. Kids submit, you verify.',
   check:()=>(Array.isArray(D.chores)?D.chores:[]).length>0},
  {id:'gsp-reward', icon:'🎁', title:'Set Up a Reward',
   tip:'In <b>Chores → Parent Mode → Manage Rewards</b>, create rewards your child can earn with points. Examples: "Extra screen time = 50 pts", "Movie pick = 100 pts".',
   check:()=>(Array.isArray(D.rewards)?D.rewards:[]).length>0},
  {id:'gsp-incentive', icon:'🎯', title:'Create an Incentive',
   tip:'In <b>Parent Hub → Incentives</b>, tie rewards to real achievements. "GPA above 3.5 = new shoes", "Read 3 books = $20". Progress tracks automatically from the app data.',
   check:()=>(Array.isArray(D.incentives)?D.incentives:[]).length>0},
  {id:'gsp-behavior', icon:'📝', title:'Log a Behavior Note',
   tip:'In <b>Parent Hub → Behavior Log</b>, record positive and needs-work moments across 8 categories. This builds a picture of growth over time, not just grades.',
   check:()=>(Array.isArray(D.behaviorLog)?D.behaviorLog:[]).length>0},
  {id:'gsp-gpa', icon:'📚', title:'Set a GPA Target',
   tip:'In <b>Parent Hub → Grade Monitor</b>, set a GPA target. The dashboard shows current vs. target with color coding so you can spot issues early.',
   check:()=>!!(D.gpaTarget && D.gpaTarget!==3.5)},
  {id:'gsp-note', icon:'💌', title:'Send Your Child a Note',
   tip:'In <b>Parent Hub → Parent Notes</b>, write a note of encouragement or a reminder. Your child sees it on their home dashboard — a digital "I\'m proud of you."',
   check:()=>(Array.isArray(D.parentNotes)?D.parentNotes:[]).length>0},
  {id:'gsp-score', icon:'🏆', title:'Check the Life Score',
   tip:'The <b>Overall Life Score</b> at the top of Parent Hub is a weighted grade across academics, responsibility, growth, wellbeing, character, and engagement. One number that tells you how your child is doing.',
   check:()=>true},
];

let _gspOpenTip = null;

function toggleGspTip(id){
  const el = document.getElementById('gsptip-'+id);
  if(!el) return;
  if(_gspOpenTip && _gspOpenTip !== id){
    const prev = document.getElementById('gsptip-'+_gspOpenTip);
    if(prev) prev.classList.remove('gs-show');
  }
  el.classList.toggle('gs-show');
  _gspOpenTip = el.classList.contains('gs-show') ? id : null;
}

function renderParentGettingStarted(){
  const el = document.getElementById('parentGettingStarted'); if(!el) return;
  if(D.gspDismissed){ el.innerHTML=''; return; }

  const results = GS_PARENT_STEPS.map(s=>({...s, done:s.check()}));
  const done = results.filter(r=>r.done).length;
  const total = results.length;

  if(done >= total){
    D.gspDismissed = true; save();
    el.innerHTML=''; return;
  }

  const pct = Math.round((done/total)*100);
  _gspOpenTip = null;

  el.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(139,92,246,.06),rgba(251,146,60,.04));border:1px solid rgba(139,92,246,.18);border-radius:14px;padding:.9rem 1.1rem;margin-bottom:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;">
        <div>
          <span style="font-family:var(--fh);font-size:.72rem;letter-spacing:1.5px;color:#a78bfa;font-weight:700;">👨‍👩‍👧 PARENT SETUP GUIDE</span>
          <span style="font-size:.58rem;color:var(--tx2);margin-left:.4rem;">${done}/${total}</span>
        </div>
        <button onclick="D.gspDismissed=true;save();renderParentGettingStarted();" style="background:none;border:none;color:var(--tx2);font-size:.55rem;cursor:pointer;">✕</button>
      </div>
      <div style="background:rgba(139,92,246,.1);border-radius:4px;height:5px;overflow:hidden;margin-bottom:.6rem;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#a78bfa,#22c55e);border-radius:4px;transition:width .5s;"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.25rem;">
        ${results.map(s=>`
          <div>
            <div class="gs-step ${s.done?'gs-done':''}" onclick="${s.done?'':`toggleGspTip('${s.id}')`}">
              <span style="font-size:.9rem;flex-shrink:0;">${s.done?'✅':s.icon}</span>
              <span style="font-size:.65rem;font-weight:600;color:${s.done?'var(--tx2)':'var(--tx)'};flex:1;${s.done?'text-decoration:line-through;':''}">${s.title}</span>
              ${s.done?'':'<span style="font-size:.5rem;color:var(--tx2);">ⓘ</span>'}
            </div>
            <div class="gs-tip" id="gsptip-${s.id}">
              ${s.tip}
              <div style="margin-top:.4rem;"><button class="btn bgh bs" onclick="toggleGspTip('${s.id}')" style="font-size:.55rem;">Got it</button></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── RECURRING CONTENT ENGINE — keeps the app fresh ──────────

// ── MONTHLY CHALLENGES ──────────────────────────────────────
const MONTHLY_CHALLENGES = [];

function getCurrentChallenge(){
  const m = new Date().getMonth();
  return MONTHLY_CHALLENGES[m] || MONTHLY_CHALLENGES[0];
}

function renderMonthlyChallenge(){
  const el = document.getElementById('heroMonthlyChallenge'); if(!el) return;
  const ch = getCurrentChallenge();
  const results = ch.tasks.map(t=>({...t, done:t.check()}));
  const done = results.filter(r=>r.done).length;
  const pct = Math.round((done/results.length)*100);

  el.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(245,166,35,.04),rgba(239,68,68,.03));border:1px solid rgba(245,166,35,.12);border-radius:14px;padding:.9rem 1.1rem;margin-bottom:.8rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.4rem;">
        <div><span style="font-size:.9rem;">${ch.icon}</span> <span style="font-family:var(--fh);font-size:.72rem;letter-spacing:1px;color:var(--g);font-weight:700;">${ch.name.toUpperCase()}</span></div>
        <span style="font-size:.65rem;font-weight:700;color:${pct>=100?'#22c55e':'var(--g)'};">${done}/${results.length}${pct>=100?' 🏆':''}</span>
      </div>
      <div style="font-size:.68rem;color:var(--tx2);margin-bottom:.5rem;">${ch.desc}</div>
      <div style="background:rgba(245,166,35,.1);border-radius:4px;height:5px;overflow:hidden;margin-bottom:.4rem;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#f5a623,${pct>=100?'#22c55e':'#fb923c'});border-radius:4px;transition:width .5s;"></div>
      </div>
      ${results.map(r=>`<div style="display:flex;align-items:center;gap:.3rem;padding:.15rem 0;font-size:.62rem;"><span>${r.done?'✅':'⬜'}</span><span style="color:${r.done?'var(--tx2)':'var(--tx)'};${r.done?'text-decoration:line-through;':''}">${r.title}</span></div>`).join('')}
    </div>`;
}

// ── WEEKLY WISDOM ─────────────────────────────────────────────


// ── MULTI-CHILD PROFILE SYSTEM ────────────────────────────────
// D._profiles = [{id:'K1234567', name:'Sarah', data:{...}}, ...]
// D._activeProfile = 'K1234567'  (the currently active child)
// When switching profiles, we swap D's data in/out

let _profiles = [];
let _activeProfileId = null;

function initProfiles(){
  try {
    _profiles = JSON.parse(localStorage.getItem('ylcc_profiles')||'[]');
    // If localStorage empty, try loading from D (synced from cloud on another device)
    if(_profiles.length === 0 && D._profiles && D._profiles.length > 0){
      _profiles = JSON.parse(JSON.stringify(D._profiles));
      localStorage.setItem('ylcc_profiles', JSON.stringify(_profiles));
    }
    // Migration: first profile is always parent if no isParent flag set
    if(_profiles.length > 0 && _profiles[0].isParent === undefined){
      _profiles[0].isParent = true;
      _profiles.slice(1).forEach(p => { if(p.isParent===undefined) p.isParent=false; });
    }
    // Belt-and-suspenders: ensure exactly one parent exists (the first profile)
    var hasExplicitParent = _profiles.some(function(p){ return p.isParent===true; });
    if(!hasExplicitParent && _profiles.length > 0){
      _profiles[0].isParent = true;
    }
    // Try user-specific key first (per-user persistence), then fall back to D, then global key
    _activeProfileId = localStorage.getItem(_ylccUserKey('ylcc_active_profile')) || (D._activeProfileId||null) || localStorage.getItem('ylcc_active_profile');
  } catch(e){ _profiles=[]; }
  // Auto-create parent profile from existing data if none exist
  if(_profiles.length === 0 && D.name){
    const id = generateParentId();
    _profiles.push({id, name:D.name, isParent:true, data:JSON.parse(JSON.stringify(D))});
    _activeProfileId = id;
    saveProfiles();
  }
  // Ensure active profile ID is valid
  if(_activeProfileId && !_profiles.find(p=>p.id===_activeProfileId)){
    _activeProfileId = _profiles.length ? _profiles[0].id : null;
    saveProfiles();
  }
  renderProfileSwitcher();
}

function saveProfiles(){
  localStorage.setItem('ylcc_profiles', JSON.stringify(_profiles));
  // Save to both user-specific key (survives cloudLoad) and global key (fallback)
  localStorage.setItem(_ylccUserKey('ylcc_active_profile'), _activeProfileId||'');
  localStorage.setItem('ylcc_active_profile', _activeProfileId||'');
  // Persist into D so cloudSync carries profiles to all devices
  D._profiles = JSON.parse(JSON.stringify(_profiles));
  D._activeProfileId = _activeProfileId||'';
  // Ensure D.name always reflects the PARENT name before saving to cloud,
  // so the parent welcome card never shows the last-active child's name.
  var _parentProf = _profiles.find(function(p){ return p.isParent !== false; });
  if(_parentProf && _parentProf.name) D.name = _parentProf.name;
  save();
  if(typeof _supaUser !== 'undefined' && _supaUser) setTimeout(cloudSync, 500);
}

// ── WELCOME MODAL ─────────────────────────────────────────────
function welcomeSubmit(){
  const n = (document.getElementById('welcomeNameInput')||{}).value||'';
  D.name = n.trim() || 'Champion';
  save(); applyName();
  document.getElementById('welcomeModal').style.display='none';
  if(_profiles.length===0){
    const id = generateParentId();
    _profiles.push({id, name:D.name, isParent:true, data:JSON.parse(JSON.stringify(D))});
    _activeProfileId = id;
    saveProfiles();
    renderProfileSwitcher();
  }
  showToast('Welcome! 🙌');
}

function generateParentId(){
  // Parent gets a 6-digit PIN
  let pin='';
  for(let i=0;i<6;i++) pin+=Math.floor(Math.random()*10);
  if(pin[0]==='0') pin=String(Math.floor(Math.random()*9)+1)+pin.slice(1);
  return pin;
}

function generateProfileId(){
  // Child gets a 4-digit PIN
  let pin='';
  do { pin=String(Math.floor(1000+Math.random()*9000)); }
  while(_profiles.find(p=>p.id===pin));
  return pin;
}

// ── PARENT GATE PIN PAD ───────────────────────────────────────
let _pgBuffer = '';
function pgPinKey(k){
  if(String(k)==='⌫'){ _pgBuffer=_pgBuffer.slice(0,-1); _pgUpdateDots(); return; }
  if(_pgBuffer.length>=6) return;
  _pgBuffer+=String(k); _pgUpdateDots();
  if(_pgBuffer.length===6) setTimeout(_pgSubmit,200);
}
function _pgUpdateDots(){
  for(let i=0;i<6;i++){
    const d=document.getElementById('pgd'+i);
    if(d) d.className='pin-dot'+(_pgBuffer.length>i?' filled':'');
  }
}
function _pgSubmit(){
  const off=!!D.parentPinDisabled;
  if(off){
    _pgBuffer=''; _pgUpdateDots();
    _doUnlockParent();
    return;
  }
  const correct=String(D.chorePin||D.parentPIN||'');
  if(!correct){
    // No PIN set — just let them in
    _pgBuffer=''; _pgUpdateDots();
    _doUnlockParent();
    return;
  }
  if(_pgBuffer===correct){
    _pgBuffer=''; _pgUpdateDots();
    _doUnlockParent();
  } else {
    const err=document.getElementById('parentGateError');
    if(err) err.textContent='Incorrect PIN — try again';
    for(let i=0;i<6;i++){const d=document.getElementById('pgd'+i);if(d) d.className='pin-dot error';}
    setTimeout(()=>{ _pgBuffer=''; _pgUpdateDots(); if(err) err.textContent=''; },800);
  }
}
function _doUnlockParent(){
  _parentDashUnlocked=true;
  sessionStorage.setItem('parentUnlocked','1');
  localStorage.setItem('lifeos_parent_unlocked','1');
  const gate=document.getElementById('parentGate');
  const content=document.getElementById('parentDashContent');
  if(gate) gate.style.display='none';
  if(content) content.style.display='block';
  updateIncConditions(); renderParentDash();
  if(!D.parentWizardDone && localStorage.getItem(_ylccUserKey('ylcc_parentWizardDone')) !== '1'){ setTimeout(showParentOnboard,700); }
}



function addChildProfile(){
  // Route to the Hub's add-child UI — it's the cleanest path
  showSection('s-parent');
  if(!_parentDashUnlocked){
    // Need parent auth first
    _requirePin('ADD CHILD','Enter parent PIN to add a child profile','👶',()=>{
      _doUnlockParent();
      setTimeout(()=>{ phNav('users'); },400);
    });
  } else {
    phNav('users');
  }
}

// ── CHILD LOGIN SYSTEM ──────────────────────────────────────
let _childPinBuffer = '';

function openChildLogin(){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO){ showSection('s-hero'); return; }
  const children = _profiles.filter(p => !p.isParent);
  if(children.length === 0){ showToast('No child profiles yet — add in Parent Hub'); return; }
  const colors = ['#4f8fff','#06d6a0','#f5a623','#f472b6','#a78bfa','#22d3ee','#ef4444'];
  const list = document.getElementById('clChildList');
  if(list){
    list.innerHTML = children.map((p,i)=>{
      const c = colors[i%colors.length];
      return `<button onclick="clSelectChild('${p.id}')" style="display:flex;align-items:center;gap:.8rem;padding:.75rem 1rem;border-radius:12px;border:1.5px solid ${c}44;background:${c}11;cursor:pointer;width:100%;font-family:var(--fn);" onmouseenter="this.style.background='${c}22'" onmouseleave="this.style.background='${c}11'">
        <div style="width:38px;height:38px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:900;color:#fff;flex-shrink:0;">${p.name.charAt(0).toUpperCase()}</div>
        <span style="font-size:.95rem;font-weight:700;color:#fff;">${p.name}</span>
        <span style="margin-left:auto;color:${c};">→</span>
      </button>`;
    }).join('');
  }
  document.getElementById('clStep1').style.display='block';
  document.getElementById('clStep2').style.display='none';
  _childPinBuffer=''; _clSelectedId=null;
  updateChildPinDots();
  const s=document.getElementById('childLoginScreen');
  s.style.visibility='visible'; s.style.opacity='1'; s.style.pointerEvents='all';
}

let _clSelectedId=null;

function clSelectChild(id){
  const p=_profiles.find(x=>x.id===id); if(!p) return;
  _clSelectedId=id; _childPinBuffer='';
  updateChildPinDots();
  const msgEl=document.getElementById('childLoginMsg'); if(msgEl) msgEl.textContent='';
  const colors=['#4f8fff','#06d6a0','#f5a623','#f472b6','#a78bfa','#22d3ee','#ef4444'];
  const idx=_profiles.filter(x=>!x.isParent).findIndex(x=>x.id===id);
  const c=colors[idx%colors.length];
  const nm=document.getElementById('clChildName');
  const av=document.getElementById('clChildAvatar');
  if(nm){nm.textContent=p.name; nm.style.color=c;}
  if(av){av.textContent=p.name.charAt(0).toUpperCase(); av.style.cssText='width:52px;height:52px;border-radius:50%;background:'+c+';display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:900;color:#fff;margin:0 auto .5rem;';}
  document.getElementById('clStep1').style.display='none';
  document.getElementById('clStep2').style.display='block';
}

function clGoBack(){
  document.getElementById('clStep1').style.display='block';
  document.getElementById('clStep2').style.display='none';
  _childPinBuffer=''; _clSelectedId=null; updateChildPinDots();
}

function closeChildLogin(){
  const s=document.getElementById('childLoginScreen');
  s.style.visibility='hidden'; s.style.opacity='0'; s.style.pointerEvents='none';
  _childPinBuffer=''; _clSelectedId=null;
}

function childPinInput(digit){
  if(_childPinBuffer.length>=4) return;
  _childPinBuffer+=digit; updateChildPinDots();
  if(_childPinBuffer.length===4) setTimeout(validateChildPin,200);
}
function childPinDelete(){ _childPinBuffer=_childPinBuffer.slice(0,-1); updateChildPinDots(); }
function childPinClear(){ _childPinBuffer=''; updateChildPinDots(); }

function updateChildPinDots(){
  for(let i=0;i<4;i++){
    const d=document.getElementById('cd'+i);
    if(d){ d.style.background=i<_childPinBuffer.length?'#38bdf8':'transparent'; d.style.borderColor=i<_childPinBuffer.length?'#38bdf8':'rgba(255,255,255,.25)'; d.style.transform=i<_childPinBuffer.length?'scale(1.2)':'scale(1)'; }
  }
}

function validateChildPin(){
  if(!_clSelectedId) return;
  const p=_profiles.find(x=>x.id===_clSelectedId); if(!p) return;
  if(p.id===_childPinBuffer){
    closeChildLogin();
    switchToProfile(p.id); // switchToProfile handles toast + showSection('s-hero')
  } else {
    const msgEl2=document.getElementById('childLoginMsg'); if(msgEl2) msgEl2.textContent='Wrong PIN — try again';
    _childPinBuffer=''; updateChildPinDots();
    const dots=document.getElementById('childPinDots');
    if(dots){dots.style.animation='none';dots.offsetHeight;dots.style.animation='shake .35s ease';}
  }
}

function removeChildProfile(){
  const children = _profiles.filter(p => !p.isParent);
  if(children.length === 0){ showToast('No child profiles to remove'); return; }
  // Build a simple confirm per child — use the removeChildById flow from Parent Hub
  if(children.length === 1){
    removeChildById(children[0].id);
  } else {
    showToast('Go to Parent Hub → Manage Users to remove a specific child');
  }
}

function unlockProfile(id){
  const profile = _profiles.find(p=>p.id===id);
  if(!profile) return;
  // Use child login screen if it's a child, otherwise switch directly
  if(!profile.isParent){
    openChildLogin();
  } else {
    switchToProfile(id);
  }
}

function switchToProfile(id){
  // Save current profile data
  if(_activeProfileId && _activeProfileId !== id){
    const cur = _profiles.find(p=>p.id===_activeProfileId);
    if(cur) cur.data = JSON.parse(JSON.stringify(D));
    saveProfiles();
  }

  // Load new profile
  const profile = _profiles.find(p=>p.id===id);
  if(!profile) return;

  _activeProfileId = id;
  saveProfiles();

  // Restore this child's data into D
  const saved = profile.data || {};
  // Clear D and reload
  for(const key in D){ if(D.hasOwnProperty(key)) delete D[key]; }
  Object.assign(D, saved);
  D.name = profile.name;
  save();

  // Re-render everything
  applyName();
  applyStageFilter();
  renderProfileSwitcher();

  // Trigger all renders
  try{
    updateHeroDashboard();
    renderGettingStarted(); renderPathway();
    renderMonthlyChallenge(); renderDailyPrompt(); renderBadges();
    renderChores(); initMusicAndSports(); initDriving();
    renderKidParentNotes();
  }catch(e){}

  if(!profile.isParent){
    var _cs=(D.sections||{});
    ALL_SECTIONS.forEach(function(s){
      var el=document.getElementById(s.id);
      if(el)el.style.display=_cs[s.id.replace('s-','')]===0?'none':'';
    });
    buildSideNav();
  }

  // ── FULL DASHBOARD REFRESH ──────────────────────────────────
  // Force all home dashboard widgets to re-render with the new
  // profile's data, then navigate to the home section so the
  // user sees their own dashboard immediately (no refresh needed).
  if(typeof applyTheme==='function') applyTheme();
  if(typeof applyHeroBg==='function') applyHeroBg();
  if(typeof buildCheckins==='function') buildCheckins();
  if(typeof updateStreak==='function') updateStreak();
  if(typeof updateQuickStats==='function') updateQuickStats();
  if(typeof updateHeroDashboard==='function') updateHeroDashboard();
  if(typeof renderVerse==='function') renderVerse();
  if(typeof renderFinanceDash==='function') renderFinanceDash();
  if(typeof renderGoals==='function') renderGoals();
  if(typeof renderChores==='function') renderChores();
  if(typeof renderMoodTracker==='function') renderMoodTracker();
  if(typeof renderBadges==='function') renderBadges();
  if(typeof renderGettingStarted==='function') renderGettingStarted();
  if(typeof renderPathway==='function') renderPathway();
  if(typeof renderMonthlyChallenge==='function') renderMonthlyChallenge();
  if(typeof renderDailyPrompt==='function') renderDailyPrompt();
  // Navigate home — this also triggers the showSection render chain
  showSection('s-hero');
  // ────────────────────────────────────────────────────────────

  showToast('Welcome, '+profile.name+'! 👋');
  updateStartHereBtn();
  // Show kid onboarding if this is a child profile who hasn't seen it yet
  if(!profile.isParent && !D.kidOnboardDone){
    setTimeout(showKidOnboard, 800);
  }
}

function removeProfile(id){
  if(!confirm('Remove this profile? This cannot be undone.')) return;
  _profiles = _profiles.filter(p=>p.id!==id);
  if(_activeProfileId === id){
    _activeProfileId = _profiles.length ? _profiles[0].id : null;
    if(_activeProfileId) switchToProfile(_activeProfileId);
  }
  saveProfiles();
  renderProfileSwitcher();
}

function renderProfileSwitcher(){
  const el = document.getElementById('profileSwitcher');
  const tabs = document.getElementById('profileTabs');
  if(!el || !tabs) return;

  el.style.display = 'none'; // Hidden from hero — use Child Login button instead
  const colors = ['#4f8fff','#06d6a0','#f5a623','#f472b6','#a78bfa','#22d3ee','#ef4444'];

  tabs.innerHTML = _profiles.map((p,i)=>{
    const active = p.id === _activeProfileId;
    const c = colors[i % colors.length];
    return `<button onclick="${active?`alert('${p.name}\\nAccess Code: ${p.id}\\n\\nThis code is needed to switch to this profile.')`:`unlockProfile('${p.id}')`}" style="display:flex;align-items:center;gap:.3rem;padding:.35rem .7rem;border-radius:8px;border:1.5px solid ${active?c:'rgba(255,255,255,.08)'};background:${active?c+'15':'rgba(255,255,255,.02)'};cursor:pointer;transition:all .15s;font-family:var(--fn);" title="${active?'Tap to view code':'Enter code to switch'}">
      <div style="width:24px;height:24px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-size:.55rem;font-weight:800;color:#fff;">${p.name.charAt(0).toUpperCase()}</div>
      <div style="text-align:left;"><div style="font-size:.65rem;font-weight:${active?'700':'500'};color:${active?c:'var(--tx2)'};">${p.name}</div><div style="font-size:.42rem;color:var(--tx3);font-family:monospace;">${p.id}</div></div>
      ${active?'<span style="font-size:.45rem;color:'+c+';">●</span>':'<span style="font-size:.45rem;color:var(--tx3);">🔒</span>'}
    </button>`;
  }).join('') + `<button onclick="addChildProfile()" style="padding:.35rem .7rem;border-radius:8px;border:1.5px dashed rgba(255,255,255,.12);background:none;cursor:pointer;font-size:.65rem;color:var(--tx3);font-family:var(--fn);display:flex;align-items:center;gap:.3rem;"><span style="font-size:.85rem;">+</span> Add Child</button>`;
}

// ── PARENT HUB MULTI-CHILD VIEW ──────────────────────────────
function renderParentMultiChild(){
  const el = document.getElementById('parentMultiChildView'); if(!el) return;
  if(_profiles.length <= 1){ el.innerHTML = ''; return; }

  const colors = ['#4f8fff','#06d6a0','#f5a623','#f472b6','#a78bfa','#22d3ee'];

  el.innerHTML = `
    <div style="font-family:var(--fh);font-size:.7rem;letter-spacing:1.5px;color:#fb923c;margin-bottom:.6rem;">👨‍👩‍👧‍👦 ALL CHILDREN OVERVIEW</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.6rem;margin-bottom:1.2rem;">
      ${_profiles.filter(p => !p.isParent).map((p,i)=>{
        const d = p.data||{};
        const c = colors[i%colors.length];
        // Calculate Life Score for this child
        const classes = d.classes||[];
        const gradeMap = {'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D+':1.3,'D':1,'D-':0.7,'F':0};
        const grades = classes.filter(cl=>cl.grade).map(cl=>gradeMap[cl.grade]||0);
        const gpa = grades.length ? (grades.reduce((a,b)=>a+b,0)/grades.length).toFixed(2) : '—';
        const streak = d.streak||0;
        const certs = Object.values(d.skillCerts||{}).filter(Boolean).length;
        const chorePts = (d.chorePoints||{}).total||0;
        const goalsD = (d.goals||[]).filter(g=>g.done).length;
        const moodCount = (d.moods||[]).length;

        return `<div style="background:rgba(255,255,255,.03);border:1px solid ${c}30;border-radius:12px;padding:.8rem;cursor:pointer;" onclick="parentDrillChild('${p.id}')">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
            <div style="width:32px;height:32px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:.75rem;">${p.name.charAt(0)}</div>
            <div><div style="font-weight:700;font-size:.82rem;">${p.name}</div><div style="font-size:.5rem;color:var(--tx3);">ID: ${p.id}</div></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;text-align:center;font-size:.55rem;">
            <div><div style="font-size:.85rem;font-weight:800;color:${c};">${gpa}</div>GPA</div>
            <div><div style="font-size:.85rem;font-weight:800;color:${c};">${streak}🔥</div>Streak</div>
            <div><div style="font-size:.85rem;font-weight:800;color:${c};">${certs}</div>Certs</div>
            <div><div style="font-size:.85rem;font-weight:800;color:${c};">${chorePts}</div>Chore Pts</div>
            <div><div style="font-size:.85rem;font-weight:800;color:${c};">${goalsD}</div>Goals</div>
            <div><div style="font-size:.85rem;font-weight:800;color:${c};">${moodCount}</div>Moods</div>
          </div>
          <div style="font-size:.5rem;color:var(--tx3);margin-top:.4rem;text-align:center;">Tap for full details →</div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function parentDrillChild(id){
  // Switch to that child's profile to show their data in the parent hub
  const profile = _profiles.find(p=>p.id===id);
  if(!profile) return;
  // Temporarily load their data into D for the parent view
  const saved = JSON.parse(JSON.stringify(D));
  for(const key in D){ if(D.hasOwnProperty(key)) delete D[key]; }
  Object.assign(D, profile.data||{});
  // Re-render parent sections with this child's data
  renderParentScore();
  renderParentOverview();
  renderWeeklyReportCard();
  renderBehaviorLog();
  renderGradeMonitor();
  renderParentActivityFeed();
  showToast('Viewing '+profile.name+'\'s data');
  // Restore original data after render
  // Actually keep it showing until they switch back
}

const DRIVER_CHECKLIST = [
  { id:'permit',      cat:'📋 Before You Drive',        label:'Got my learner\'s permit' },
  { id:'glasses',     cat:'📋 Before You Drive',        label:'Glasses/contacts if required on license' },
  { id:'seatbelt',    cat:'📋 Before You Drive',        label:'Always buckle up before starting the car' },
  { id:'mirrors',     cat:'📋 Before You Drive',        label:'Adjust mirrors and seat before every drive' },
  { id:'phone',       cat:'📋 Before You Drive',        label:'Phone in glove box or mounted for GPS only' },
  { id:'insurance',   cat:'📋 Before You Drive',        label:'Know where insurance card is kept' },
  { id:'parallel',    cat:'🎯 Skills to Practice',      label:'Parallel parking' },
  { id:'3point',      cat:'🎯 Skills to Practice',      label:'3-point turn' },
  { id:'highway',     cat:'🎯 Skills to Practice',      label:'Highway merging and lane changes' },
  { id:'parking',     cat:'🎯 Skills to Practice',      label:'Parking in a lot (angle and straight)' },
  { id:'night',       cat:'🎯 Skills to Practice',      label:'Night driving (with licensed adult)' },
  { id:'rain',        cat:'🎯 Skills to Practice',      label:'Driving in rain' },
  { id:'reverse',     cat:'🎯 Skills to Practice',      label:'Reversing in a straight line' },
  { id:'hours40',     cat:'🎯 Skills to Practice',      label:'Logged 40+ supervised driving hours' },
  { id:'oilcheck',    cat:'🔧 Car Knowledge',           label:'Know how to check the oil' },
  { id:'tires',       cat:'🔧 Car Knowledge',           label:'Know how to check tire pressure' },
  { id:'penny',       cat:'🔧 Car Knowledge',           label:'Know the penny tread depth test' },
  { id:'jumpstart',   cat:'🔧 Car Knowledge',           label:'Know how to jump-start a car' },
  { id:'flattire',    cat:'🔧 Car Knowledge',           label:'Know how to change a flat tire' },
  { id:'wipers',      cat:'🔧 Car Knowledge',           label:'Know how to replace windshield wipers' },
  { id:'fluids',      cat:'🔧 Car Knowledge',           label:'Know how to check washer fluid and coolant' },
  { id:'emergency',   cat:'🚨 Emergency Preparedness',  label:'Emergency kit in trunk (flashlight, jumper cables, water)' },
  { id:'breakdown',   cat:'🚨 Emergency Preparedness',  label:'Know what to do if the car breaks down' },
  { id:'accident',    cat:'🚨 Emergency Preparedness',  label:'Know what to do after an accident' },
  { id:'hydroplane',  cat:'🚨 Emergency Preparedness',  label:'Know how to handle hydroplaning' },
  { id:'skid',        cat:'🚨 Emergency Preparedness',  label:'Know how to handle a skid on ice' },
  { id:'roadtest',    cat:'🏆 Milestones',              label:'Passed the road test' },
  { id:'license',     cat:'🏆 Milestones',              label:'Got my full driver\'s license' },
  { id:'solo',        cat:'🏆 Milestones',              label:'First solo drive' },
  { id:'insurance2',  cat:'🏆 Milestones',              label:'Added to family insurance policy' },
];

function renderDriverChecklist(){
  const el = document.getElementById('driverChecklist'); if(!el) return;
  if(!D.driverChecklist) D.driverChecklist = {};
  const checks = D.driverChecklist;

  // Group by category
  const cats = {};
  DRIVER_CHECKLIST.forEach(item => {
    if(!cats[item.cat]) cats[item.cat] = [];
    cats[item.cat].push(item);
  });

  const total = DRIVER_CHECKLIST.length;
  const done = DRIVER_CHECKLIST.filter(i => checks[i.id]).length;
  const pct = Math.round((done/total)*100);

  let html = `<div style="margin-bottom:.8rem;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;">
      <span style="font-size:.72rem;font-weight:700;color:var(--c);">${done} of ${total} completed</span>
      <span style="font-size:.72rem;color:var(--tx2);">${pct}%</span>
    </div>
    <div style="height:6px;background:rgba(255,255,255,.08);border-radius:3px;">
      <div style="height:100%;width:${pct}%;background:var(--c);border-radius:3px;transition:width .4s;"></div>
    </div>
  </div>`;

  Object.entries(cats).forEach(([cat, items]) => {
    html += `<div style="margin-bottom:.7rem;">
      <div style="font-size:.65rem;font-weight:800;color:var(--c);text-transform:uppercase;letter-spacing:1px;margin-bottom:.35rem;">${cat}</div>`;
    items.forEach(item => {
      const checked = !!checks[item.id];
      html += `<label style="display:flex;align-items:center;gap:.5rem;padding:.3rem .2rem;cursor:pointer;border-radius:6px;transition:background .15s;" onmouseover="this.style.background='rgba(255,255,255,.03)'" onmouseout="this.style.background=''">
        <input type="checkbox" ${checked?'checked':''} onchange="toggleDriverCheck('${item.id}',this.checked)" style="width:15px;height:15px;accent-color:var(--c);cursor:pointer;flex-shrink:0;">
        <span style="font-size:.78rem;color:${checked?'var(--tx2)':'var(--tx)'};${checked?'text-decoration:line-through;opacity:.6;':''}">${item.label}</span>
      </label>`;
    });
    html += `</div>`;
  });

  el.innerHTML = html;
}

function toggleDriverCheck(id, val){
  if(!D.driverChecklist) D.driverChecklist = {};
  D.driverChecklist[id] = val;
  save();
  renderDriverChecklist();
}

function initDriving(){ if(typeof renderDriverChecklist==='function') renderDriverChecklist(); }


function phNav(tab){
  const panels = ['users','overview','rewards','chores','schedule','contests','quizzes','controls','behavior','activity','learning','growth','progress','referral'];
  panels.forEach(p=>{
    const el = document.getElementById('ph-'+p);
    if(el) el.style.display = p===tab ? 'block' : 'none';
    const nav = document.getElementById('phn-'+p);
    if(nav) nav.classList.toggle('active', p===tab);
  });
  // Trigger renders for the active panel
  if(tab==='users'){ renderManageUsers(); }
  if(tab==='overview'){ renderParentGettingStarted(); renderParentMultiChild(); renderParentScore(); renderParentOverview(); renderWeeklyReportCard(); }
  if(tab==='rewards'){ renderPhRewards(); }
  if(tab==='chores'){ renderParentChoreList(); renderParentSelfChores(); renderParentDeeds(); renderPhPendingChores(); }
  if(tab==='schedule'){ initPhSchedPanel(); }
  if(tab==='contests'){ renderParentLeaderboard(); renderParentContests(); renderParentFamilyRewards(); }
  if(tab==='quizzes'){ renderCompletionSummary(); renderSentQuizzes(); }
  if(tab==='controls'){ renderParentScreenControls(); renderParentEarningsControls(); renderParentBucksControls(); renderIncentives(); renderParentChoreList(); if(typeof updateIncConditions==='function') updateIncConditions(); }
  if(tab==='behavior'){ renderBehaviorLog(); renderGradeMonitor(); renderParentNotes(); }
  if(tab==='activity'){ renderParentActivityAudit(); renderParentActivityFeed(); }
  if(tab==='learning'){ renderParentLessons(); }
  if(tab==='growth'){ if(typeof renderParentGrowth==='function') renderParentGrowth(); if(typeof renderParentGrowthHistory==='function') renderParentGrowthHistory(); }
  if(tab==='referral'){ renderPhReferral(); }
  if(tab==='progress'){ renderProgressReportsTab(); }
}

// ── PARENT HUB TABS ──────────────────────────────────────────
// phTab removed - using phNav

// ── PARENT HUB REFER & EARN ───────────────────────────────────
function renderPhReferral(){
  const inner = document.getElementById('phReferralInner'); if(!inner) return;
  // Instead of cloning (which duplicates IDs), move the referral section's children
  // into the hub panel, and restore on close. Use a flag to avoid double-moves.
  const src = document.getElementById('s-referral'); if(!src) return;
  if(inner.dataset.populated !== '1'){
    // Move all children of s-referral into phReferralInner
    while(src.firstChild) inner.appendChild(src.firstChild);
    inner.dataset.populated = '1';
  }
  if(typeof initReferralTab==='function') setTimeout(initReferralTab, 50);
}
let _phSchedMode = 'day';
let _phSchedChildId = null;
let _phSchedOffset = 0; // days/weeks/months from today

function initPhSchedPanel(){
  // Populate child selector
  const sel = document.getElementById('phSchedChildSel'); if(!sel) return;
  const children = _profiles.filter(p=>!p.isParent);
  sel.innerHTML = children.length === 0
    ? '<option value="">No children added yet</option>'
    : children.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  if(!_phSchedChildId && children.length) _phSchedChildId = children[0].id;
  if(_phSchedChildId) sel.value = _phSchedChildId;
  _phSchedOffset = 0;
  phSchedRender();
}

function phSchedSetChild(id){
  _phSchedChildId = id;
  phSchedRender();
}

function phSchedView(mode){
  _phSchedMode = mode;
  _phSchedOffset = 0;
  ['day','week','month'].forEach(m=>{
    const btn = document.getElementById('phSchedBtn'+m.charAt(0).toUpperCase()+m.slice(1));
    if(btn){
      const active = m===mode;
      btn.style.background = active ? 'rgba(56,189,248,.12)' : 'rgba(255,255,255,.04)';
      btn.style.borderColor = active ? 'rgba(56,189,248,.35)' : 'rgba(255,255,255,.08)';
      btn.style.color = active ? '#38bdf8' : 'var(--tx2)';
    }
  });
  phSchedRender();
}

function phSchedNav(dir){ _phSchedOffset += dir; phSchedRender(); }
function phSchedGoToday(){ _phSchedOffset = 0; phSchedRender(); }

function phSchedRender(){
  const out = document.getElementById('phSchedOutput'); if(!out) return;
  const lbl = document.getElementById('phSchedLabel');
  if(!_phSchedChildId){ out.innerHTML='<div style="font-size:.75rem;color:var(--tx3);padding:.5rem;">No child selected.</div>'; return; }
  const prof = _profiles.find(p=>p.id===_phSchedChildId);
  if(!prof){ out.innerHTML='<div style="font-size:.75rem;color:var(--tx3);">Child not found.</div>'; return; }
  const childData = prof.data || {};
  const sched = childData.schedule || {};
  const acts = getAllActs();
  const actOpts = acts.map(a=>`<option value="${a.v}">${a.l}</option>`).join('');
  const today = new Date(); today.setHours(0,0,0,0);
  const MN = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const MNS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function dateKey(d,h){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'_'+h; }
  function isTodayFn(d){ const t=new Date(); return d.getFullYear()===t.getFullYear()&&d.getMonth()===t.getMonth()&&d.getDate()===t.getDate(); }

  if(_phSchedMode==='day'){
    const day = new Date(today); day.setDate(today.getDate()+_phSchedOffset);
    if(lbl) lbl.textContent = DOW[day.getDay()]+', '+MNS[day.getMonth()]+' '+day.getDate()+', '+day.getFullYear();
    const isToday = isTodayFn(day);
    let html='<table style="width:100%;border-collapse:collapse;">';
    TIMESLOTS.forEach(slot=>{
      const k = dateKey(day,slot.h);
      const val = sched[k]||'';
      const act = acts.find(a=>a.v===val)||{bg:'',tc:''};
      const bg = act.bg||(isToday?'rgba(56,189,248,.04)':'');
      html+=`<tr>
        <td style="font-size:.62rem;color:var(--tx2);padding:.3rem .5rem .3rem 0;white-space:nowrap;width:52px;">${slot.l}</td>
        <td style="padding:.2rem 0;${bg?'background:'+bg+';':''};${act.tc?'color:'+act.tc+';':''}border-radius:6px;">
          <select onchange="phSchedSetCell('${_phSchedChildId}','${k}',this.value,this)" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.07);border-radius:5px;font-size:.72rem;padding:.2rem .3rem;color:${act.tc||'var(--tx)'};cursor:pointer;">
            ${actOpts.replace(`value="${val}"`,`value="${val}" selected`)}
          </select>
        </td>
      </tr>`;
    });
    html+='</table>';
    out.innerHTML=html;

  } else if(_phSchedMode==='week'){
    const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate()-today.getDay()+(_phSchedOffset*7));
    const days=[]; for(let i=0;i<7;i++){const d=new Date(startOfWeek);d.setDate(startOfWeek.getDate()+i);days.push(d);}
    const we=days[6]; if(lbl) lbl.textContent=MNS[days[0].getMonth()]+' '+days[0].getDate()+' – '+MNS[we.getMonth()]+' '+we.getDate()+', '+we.getFullYear();
    let html='<div style="overflow-x:auto;"><table style="min-width:480px;width:100%;border-collapse:collapse;">';
    html+='<thead><tr><th style="width:52px;font-size:.58rem;color:var(--tx2);text-align:right;padding-right:6px;">TIME</th>';
    days.forEach(d=>{
      const isT=isTodayFn(d);
      html+=`<th style="font-size:.62rem;font-weight:700;color:${isT?'var(--c)':'var(--tx2)'};padding:.3rem .2rem;text-align:center;min-width:52px;">${DOW[d.getDay()]}<br><span style="font-size:.72rem;color:${isT?'var(--c)':'inherit'};">${d.getDate()}</span></th>`;
    });
    html+='</tr></thead><tbody>';
    TIMESLOTS.forEach(slot=>{
      html+=`<tr><td style="font-size:.58rem;color:var(--tx2);text-align:right;padding:.2rem .4rem .2rem 0;white-space:nowrap;">${slot.l}</td>`;
      days.forEach(d=>{
        const k=dateKey(d,slot.h); const val=sched[k]||'';
        const act=acts.find(a=>a.v===val)||{bg:'',tc:''};
        const bg=act.bg||(isTodayFn(d)?'rgba(56,189,248,.04)':'');
        html+=`<td style="padding:1px;${bg?'background:'+bg+';':''};${act.tc?'color:'+act.tc+';':''}">
          <select onchange="phSchedSetCell('${_phSchedChildId}','${k}',this.value,this)" style="width:100%;min-width:50px;background:transparent;border:1px solid rgba(255,255,255,.06);border-radius:4px;font-size:.6rem;padding:1px;color:${act.tc||'var(--tx)'};cursor:pointer;">
            ${actOpts.replace(`value="${val}"`,`value="${val}" selected`)}
          </select>
        </td>`;
      });
      html+='</tr>';
    });
    html+='</tbody></table></div>';
    out.innerHTML=html;

  } else { // month
    const base = new Date(today.getFullYear(), today.getMonth()+_phSchedOffset, 1);
    const y=base.getFullYear(), m=base.getMonth();
    if(lbl) lbl.textContent=MN[m]+' '+y;
    const daysInMonth=new Date(y,m+1,0).getDate();
    const days=[]; for(let d=1;d<=daysInMonth;d++) days.push(new Date(y,m,d));
    let html='<div style="overflow-x:auto;"><table class="sched-table" style="min-width:600px;width:100%;border-collapse:collapse;">';
    html+='<thead><tr><th style="min-width:52px;font-size:.6rem;color:var(--tx2);text-align:right;padding-right:6px;position:sticky;left:0;z-index:10;background:var(--s1);">TIME</th>';
    days.forEach(d=>{
      const isT=isTodayFn(d); const wknd=d.getDay()===0||d.getDay()===6;
      html+=`<th style="min-width:52px;font-size:.58rem;font-weight:700;color:${isT?'var(--c)':wknd?'var(--p)':'var(--tx2)'};${wknd&&!isT?'background:rgba(255,255,255,.03);':''}padding:.25rem .1rem;text-align:center;">
        <div>${['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()]}</div><div style="font-size:.72rem;font-weight:800;">${d.getDate()}</div></th>`;
    });
    html+='</tr></thead><tbody>';
    TIMESLOTS.forEach(slot=>{
      html+=`<tr><td style="font-size:.58rem;color:var(--tx2);text-align:right;padding:.2rem .4rem .2rem 0;white-space:nowrap;position:sticky;left:0;z-index:5;background:var(--s1);">${slot.l}</td>`;
      days.forEach(d=>{
        const k=dateKey(d,slot.h); const val=sched[k]||'';
        const act=acts.find(a=>a.v===val)||{bg:'',tc:''};
        const bg=act.bg||(isTodayFn(d)?'rgba(56,189,248,.04)':'');
        html+=`<td style="padding:1px;${bg?'background:'+bg+';':''}${act.tc?'color:'+act.tc+';':''}">
          <select onchange="phSchedSetCell('${_phSchedChildId}','${k}',this.value,this)" style="width:100%;min-width:50px;background:transparent;border:1px solid rgba(255,255,255,.06);border-radius:3px;font-size:.58rem;padding:1px;color:${act.tc||'var(--tx)'};cursor:pointer;">
            ${actOpts.replace(`value="${val}"`,`value="${val}" selected`)}
          </select>
        </td>`;
      });
      html+='</tr>';
    });
    html+='</tbody></table></div>';
    out.innerHTML=html;
  }
}

function phSchedSetCell(childId, k, val, sel){
  const prof = _profiles.find(p=>p.id===childId); if(!prof) return;
  if(!prof.data) prof.data={};
  if(!prof.data.schedule) prof.data.schedule={};
  prof.data.schedule[k]=val;
  const act = getAllActs().find(a=>a.v===val)||{bg:'',tc:''};
  const td = sel.closest ? sel.closest('td') : sel.parentNode;
  if(td){ td.style.background=act.bg||''; td.style.color=act.tc||''; sel.style.color=act.tc||''; }
  saveProfiles();
}

const PARENT_FUNDAMENTALS = [
  {icon:'😤',title:'Respond Instead of React',color:'#60a5fa',
    body:`<h4>The 4-Step Process</h4><p><b>Step 1: Pause.</b> When your child triggers you, do NOT respond immediately.</p><p><b>Step 2: Breathe.</b> Three deep breaths activate your prefrontal cortex.</p><p><b>Step 3: Understand.</b> Ask: "Why might they have done this?" Children rarely misbehave out of malice.</p><p><b>Step 4: Guide.</b> "I noticed you didn't do your homework. Help me understand what happened." Understanding gets behavior change forever.</p><h4>Practice This Week</h4><p>Next time your child does something frustrating, pause 5 full seconds before speaking. Notice the difference.</p>`},
  {icon:'💛',title:'Patience Is a Practice',color:'#fbbf24',
    body:`<h4>Why Patience Matters</h4><p>Your child watches how you handle frustration. Every time you stay calm, they learn emotions can be managed.</p><p><b>The 10-second rule:</b> Count to 10 before responding. <b>Reframe:</b> "They're struggling and need help" not "they're trying to annoy me." <b>Whisper:</b> When you want to yell, whisper instead.</p><h4>Practice This Week</h4><p>Track your patience 1-5 each evening. Note what triggered low-patience moments.</p>`},
  {icon:'🤝',title:'Building Trust With Your Child',color:'#22c55e',
    body:`<h4>Trust Is Built in Small Moments</h4><p>Do you listen without your phone? Follow through on promises? Keep their secrets?</p><h4>What Breaks Trust</h4><p>Dismissing feelings. Sharing their info with others. Breaking promises. Using confided info against them.</p><h4>What Builds It</h4><p>Active listening. Validating feelings before correcting. Following through. Apologizing when wrong.</p><h4>Practice This Week</h4><p>Make one promise and follow through perfectly.</p>`},
  {icon:'⚖️',title:'Positive Discipline vs Punishment',color:'#a78bfa',
    body:`<h4>The Difference</h4><p><b>Punishment</b> is backward-looking (suffering for wrong). <b>Discipline</b> is forward-looking (teaching better).</p><p><b>Natural consequences:</b> Don't study → face the grade. <b>Logical consequences:</b> Misuse screen time → screen time reduced.</p><h4>The Script</h4><p>"When you [behavior], the consequence is [logical result]. I know you can do better. How can we make this go differently next time?"</p>`},
  {icon:'🗣️',title:'Healthy Communication',color:'#f472b6',
    body:`<h4>Talking WITH Not AT</h4><p><b>Open questions:</b> "What was the best part of your day?" not "How was school?" <b>Share first:</b> Tell them about YOUR day. <b>Don't fix everything:</b> "Do you want advice or just need me to listen?" <b>Car conversations:</b> Side-by-side makes hard topics easier. <b>Bedtime:</b> Dark + quiet = sharing.</p><h4>Practice This Week</h4><p>Try "best/worst" at dinner. Everyone shares. You go first. No phones.</p>`},
  {icon:'❤️',title:'Unconditional Love in Action',color:'#ef4444',
    body:`<h4>Love Is Not a Reward</h4><p>"I love you. I don't love this choice. Let's talk about it."</p><h4>What They Need to Hear</h4><p>"I'm proud of who you are, not just what you accomplish." "You can always tell me the truth." "Making mistakes doesn't change how I feel about you." "There is nothing you could do that would make me stop loving you."</p><h4>Practice This Week</h4><p>Tell your child "I love you" when they haven't done anything to earn it.</p>`},
  {icon:'📱',title:'Managing Technology & Screen Time',color:'#38bdf8',
    body:`<h4>The Reality</h4><p>You cannot ban technology. The goal is intentional, managed, healthy screen use.</p><p><b>Under 10:</b> Supervised. No social media. Screens off 1hr before bed. <b>10-13:</b> Limited social media. Devices charge outside bedroom. <b>14+:</b> Gradual autonomy with accountability.</p><h4>Non-Negotiables</h4><p>No phones at dinner. No phones in bedrooms after bedtime. Model the behavior you expect.</p>`},
  {icon:'💰',title:'Teaching Financial Responsibility',color:'#22c55e',
    body:`<h4>Start Earlier Than You Think</h4><p><b>Ages 5-8:</b> Three jars: Save, Spend, Give. Let them make buying decisions. <b>Ages 9-12:</b> Open a savings account. Give them a budget. <b>Ages 13+:</b> Introduce compound interest. Let them earn real money.</p><h4>Biggest Mistake</h4><p>Giving everything without earning it teaches entitlement, not gratitude.</p>`},
  {icon:'🧘',title:'Taking Care of Yourself First',color:'#06b6d4',
    body:`<h4>You Cannot Pour from an Empty Cup</h4><p>A burnt-out parent cannot provide patience and emotional availability.</p><p><b>What self-care looks like:</b> Enough sleep. Exercise 3x/week. One honest friendship. 10 minutes of quiet before kids wake up. Saying no to draining commitments.</p><h4>The Permission You Need</h4><p>You are allowed to be a person, not just a parent. Your hobbies and interests make you a more balanced parent.</p>`},
  {icon:'🤝',title:'Co-Parenting & Family Unity',color:'#fb923c',
    body:`<h4>If Together</h4><p>Discuss discipline privately. Present a united front. Regular 15-min parent meetings weekly.</p><h4>If Separated</h4><p>Never speak negatively about the other parent. Don't use children as messengers. Keep rules consistent between households.</p><h4>Blended Families</h4><p>Build relationship before enforcing discipline. Biological parent handles discipline initially. Family meetings. Patience — blending takes 2-5 years.</p>`},
];

const PARENT_STAGES = [
  {icon:'🧒',title:'Early Childhood (3-7)',color:'#38bdf8',
    body:`<h4>What They Need</h4><p><b>Structure and consistency.</b> Same bedtime, same routines, same rules every day.</p><p><b>Simple rules:</b> "We use kind words." "We put toys away." <b>Emotional vocabulary:</b> Teach them to name feelings. <b>Play together:</b> 15 minutes of undivided attention. <b>Read every night.</b></p><h4>Common Mistakes</h4><p>Overexplaining. Negotiating rules. Inconsistency. Doing everything for them.</p>`},
  {icon:'📚',title:'Elementary Age (8-11)',color:'#22c55e',
    body:`<h4>What They Need</h4><p><b>Responsibility and curiosity.</b> Chores they own. Choices with consequences. Praise effort over results.</p><h4>Social Development</h4><p>Friendships become critical. Help them navigate conflict. Teach empathy.</p><h4>Common Mistakes</h4><p>Helicopter parenting. Over-scheduling. Focusing only on academics. Not letting them be bored.</p>`},
  {icon:'🔄',title:'Preteen Years (12-14)',color:'#a78bfa',
    body:`<h4>What They Need</h4><p><b>Identity support and emotional safety.</b> They need privacy. They value peers more than you (normal). They push boundaries — your job is to hold firm while keeping the relationship warm.</p><h4>Conversations to Have Now</h4><p>Online safety. Peer pressure scripts. Substance awareness. Healthy relationships. Mental health.</p><h4>Common Mistakes</h4><p>Taking independence as rejection. Spying instead of talking. Punishing emotional expression.</p>`},
  {icon:'🎓',title:'Teenage Years (15-18)',color:'#fbbf24',
    body:`<h4>What They Need</h4><p><b>Your job shifts from manager to consultant.</b> Gradually increase freedom with responsibility.</p><h4>Preparing to Launch</h4><p>By 17-18 they should: manage their schedule, do laundry, cook basic meals, handle a bank account, have a resume, resolve conflict.</p><h4>The Hardest Part</h4><p>Letting go. The parent who becomes their biggest advocate during the hardest years will be the parent they call first as adults.</p>`},
  {icon:'🏠',title:'When They Leave Home (18+)',color:'#fb923c',
    body:`<h4>The Relationship Resets</h4><p>You are now their consultant, not their manager. Let them struggle. Answer the phone when they call. Visit but don't overstay. Ask before giving advice.</p><h4>What NOT to Do</h4><p>Don't call daily. Don't show up unannounced. Don't rescue from every problem. Don't guilt-trip for not calling.</p><h4>The Beautiful Part</h4><p>Adult children who genuinely enjoy their parents' company — that's the ultimate measure of successful parenting.</p>`},
  {icon:'🌟',title:'Special Circumstances',color:'#ef4444',
    body:`<h4>Single Parenting</h4><p>You're doing the work of two people. That is heroism. Lower standards for the house, not the relationship. Accept help. You are enough.</p><h4>ADHD, Anxiety, or Learning Differences</h4><p>Your child is wired differently, not broken. Advocate at school (IEPs, 504 plans). Celebrate strengths. Find professionals who understand.</p><h4>Grief, Trauma, or Crisis</h4><p>Maintain routine. Name the situation honestly. Get professional help if behavior changes for 2+ weeks.</p>`},
];

function renderParentLessons(){
  const fund = document.getElementById('parentFundamentals');
  if(fund) fund.innerHTML = PARENT_FUNDAMENTALS.map((l,i)=>`
    <div onclick="openParentLesson('fund',${i})" style="background:rgba(255,255,255,.03);border:1px solid ${l.color}20;border-left:4px solid ${l.color};border-radius:12px;padding:.85rem 1rem;cursor:pointer;transition:all .15s;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span style="font-size:1.3rem;">${l.icon}</span>
        <div>
          <div style="font-size:.88rem;font-weight:800;color:var(--tx);">${l.title}</div>
          <div style="font-size:.68rem;color:var(--tx2);">Tap to read lesson</div>
        </div>
      </div>
    </div>
  `).join('');

  const stages = document.getElementById('parentStages');
  if(stages) stages.innerHTML = PARENT_STAGES.map((l,i)=>`
    <div onclick="openParentLesson('stage',${i})" style="background:rgba(255,255,255,.03);border:1px solid ${l.color}20;border-left:4px solid ${l.color};border-radius:12px;padding:.85rem 1rem;cursor:pointer;transition:all .15s;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span style="font-size:1.3rem;">${l.icon}</span>
        <div>
          <div style="font-size:.88rem;font-weight:800;color:var(--tx);">${l.title}</div>
          <div style="font-size:.68rem;color:var(--tx2);">Tap to read lesson</div>
        </div>
      </div>
    </div>
  `).join('');
}

function openParentLesson(type, idx){
  const banks = {fund:PARENT_FUNDAMENTALS, stage:PARENT_STAGES};
  const l = banks[type][idx]; if(!l) return;
  document.getElementById('charIcon').textContent = l.icon;
  document.getElementById('charTitle').textContent = l.title;
  document.getElementById('charSub').textContent = 'For Parents';
  document.getElementById('charModalHeader').style.background = 'linear-gradient(135deg,#43e97b,#38f9d7)';
  document.getElementById('charBody').innerHTML = l.body;
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');
}

// ── PARENT GROWTH TRACKER ────────────────────────────────────
const PARENT_GROWTH_AREAS = [
  {key:'patience',label:'😤 Patience with my child'},
  {key:'listening',label:'👂 Active listening'},
  {key:'consistency',label:'📏 Consistency with rules'},
  {key:'encouragement',label:'💬 Encouragement vs criticism'},
  {key:'selfcare',label:'🧘 My own self-care'},
  {key:'communication',label:'🗣️ Open communication'},
];

function renderParentGrowth(){
  // Self-check form
  const check = document.getElementById('parentSelfCheck'); if(!check) return;
  check.innerHTML = PARENT_GROWTH_AREAS.map(a=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.3rem 0;border-bottom:1px solid rgba(255,255,255,.03);">
      <span style="font-size:.75rem;">${a.label}</span>
      <div style="display:flex;gap:.2rem;">
        ${[1,2,3,4,5].map(n=>`<button onclick="this.parentElement.querySelectorAll('button').forEach(b=>b.style.background='rgba(255,255,255,.04)');this.style.background='#22c55e';this.dataset.val='${n}'" data-area="${a.key}" data-val="0" style="width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:var(--tx2);font-size:.7rem;font-weight:700;cursor:pointer;">${n}</button>`).join('')}
      </div>
    </div>
  `).join('') + `
    <textarea id="parentGrowthNote" rows="2" placeholder="Any reflections this week? What went well? What do I want to improve?" style="margin-top:.5rem;"></textarea>
  `;

  // History
  renderParentGrowthHistory();
}

function saveParentGrowth(){
  if(!D.parentGrowth) D.parentGrowth = [];
  const scores = {};
  PARENT_GROWTH_AREAS.forEach(a=>{
    const btns = document.querySelectorAll(`[data-area="${a.key}"]`);
    btns.forEach(b=>{ if(b.style.background==='rgb(34, 197, 94)') scores[a.key] = parseInt(b.dataset.val); });
  });
  if(Object.keys(scores).length < 3){ showToast('Rate at least 3 areas'); return; }
  const note = (document.getElementById('parentGrowthNote')||{}).value||'';
  D.parentGrowth.push({
    id:Date.now(), date:new Date().toISOString().slice(0,10),
    scores, note,
    avg: Math.round(Object.values(scores).reduce((s,v)=>s+v,0)/Object.values(scores).length*10)/10
  });
  save(); renderParentGrowthHistory();
  showToast('Reflection saved ✓');
}

function renderParentGrowthHistory(){
  const el = document.getElementById('parentGrowthHistory'); if(!el) return;
  const history = (D.parentGrowth||[]).slice().reverse();
  if(!history.length){ el.innerHTML='<div style="font-size:.72rem;color:var(--tx3);text-align:center;padding:1rem;">No reflections yet. Complete your first weekly self-check above!</div>'; return; }
  el.innerHTML = history.map(h=>`
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:10px;padding:.6rem .8rem;margin-bottom:.4rem;">
      <div style="display:flex;justify-content:space-between;margin-bottom:.3rem;">
        <span style="font-size:.7rem;font-weight:700;color:var(--c);">Week of ${h.date}</span>
        <span style="font-size:.75rem;font-weight:800;color:${h.avg>=4?'#22c55e':h.avg>=3?'#fbbf24':'#fb923c'};">Avg: ${h.avg}/5</span>
      </div>
      <div style="display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.2rem;">
        ${Object.entries(h.scores).map(([k,v])=>{
          const area = PARENT_GROWTH_AREAS.find(a=>a.key===k);
          return `<span style="font-size:.58rem;background:rgba(255,255,255,.04);border-radius:4px;padding:.15rem .3rem;">${area?area.label.split(' ')[0]:k} ${v}/5</span>`;
        }).join('')}
      </div>
      ${h.note?`<div style="font-size:.72rem;color:var(--tx2);line-height:1.5;margin-top:.2rem;">${h.note}</div>`:''}
    </div>
  `).join('');
}

// ── SELF-INITIATED CHORES ────────────────────────────────────
function selectHelpful(text){
  const input = document.getElementById('helpfulChoreInput');
  if(input) input.value = text;
  submitHelpfulChore();
}

function submitHelpfulChore(){
  const input = document.getElementById('helpfulChoreInput');
  if(!input || !input.value.trim()){ showToast('Tell us what you did!'); return; }
  if(!D.selfChores) D.selfChores = [];
  D.selfChores.push({
    id: Date.now(),
    text: input.value.trim(),
    date: new Date().toISOString().slice(0,10),
    time: new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}),
    status: 'pending', // pending → approved/rejected
    pointsAwarded: 0
  });
  input.value = '';
  save();
  renderHelpfulChores();
  logActivity('helpful', 'Self-initiated: ' + D.selfChores[D.selfChores.length-1].text);
  showToast('Submitted! Parent will review 🌟');
}

function renderHelpfulChores(){
  const el = document.getElementById('helpfulChoresList'); if(!el) return;
  const chores = (D.selfChores||[]).slice().reverse().slice(0, 15);
  if(!chores.length){ el.innerHTML = ''; return; }

  el.innerHTML = '<div style="font-size:.65rem;font-weight:700;color:var(--tx2);margin-bottom:.3rem;">Recent Submissions</div>' +
    chores.map(c=>{
      const statusIcon = c.status === 'approved' ? '✅' : c.status === 'rejected' ? '❌' : '⏳';
      const statusColor = c.status === 'approved' ? '#22c55e' : c.status === 'rejected' ? '#ef4444' : '#fbbf24';
      return `<div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.68rem;">
        <span style="color:${statusColor};">${statusIcon}</span>
        <span style="flex:1;color:var(--tx2);">${c.text}</span>
        ${c.pointsAwarded ? `<span style="font-size:.55rem;color:#22c55e;font-weight:700;">+${c.pointsAwarded} pts</span>` : ''}
        <span style="font-size:.5rem;color:var(--tx3);">${c.date.slice(5)} ${c.time}</span>
        ${c.status==='pending'?`<button onclick="deleteSelfChore(${c.id})" style="font-size:.5rem;color:var(--tx3);background:none;border:none;cursor:pointer;padding:.1rem .2rem;" title="Delete">✕</button>`:''}
      </div>`;
    }).join('');
}

function deleteSelfChore(id){
  D.selfChores = (D.selfChores||[]).filter(c=>c.id!==id);
  save(); renderHelpfulChores(); renderParentSelfChores();
}

// Parent approval functions for self-initiated chores
function renderParentSelfChores(){
  const el = document.getElementById('parentSelfChoresList'); if(!el) return;
  const pending = (D.selfChores||[]).filter(c=>c.status==='pending').reverse();
  if(!pending.length){
    el.innerHTML = '<div style="font-size:.68rem;color:var(--tx3);">No pending submissions. When your child does something helpful, it appears here.</div>';
    return;
  }
  el.innerHTML = pending.map(c=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.35rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.72rem;">
      <span>⏳</span>
      <span style="flex:1;color:var(--tx2);">${c.text}</span>
      <span style="font-size:.55rem;color:var(--tx3);">${c.date.slice(5)}</span>
      <div style="display:flex;gap:.2rem;">
        <button class="btn bp bs" onclick="approveSelfChore(${c.id}, 10)" style="font-size:.5rem;padding:.15rem .3rem;">+10</button>
        <button class="btn bp bs" onclick="approveSelfChore(${c.id}, 25)" style="font-size:.5rem;padding:.15rem .3rem;">+25</button>
        <button class="btn bp bs" onclick="approveSelfChore(${c.id}, 50)" style="font-size:.5rem;padding:.15rem .3rem;">+50</button>
        <button class="btn bs" onclick="rejectSelfChore(${c.id})" style="font-size:.5rem;padding:.15rem .3rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.15);">✕</button>
      </div>
    </div>
  `).join('');
}

function approveSelfChore(id, points){
  const chore = (D.selfChores||[]).find(c=>c.id===id);
  if(!chore) return;
  chore.status = 'approved';
  chore.pointsAwarded = points;
  // Add to chore points
  if(!D.chorePoints) D.chorePoints = 0;
  D.chorePoints += points;
  // Also add PB
  earnPB(Math.round(points/2), 'Self-initiated: ' + chore.text);
  save();
  renderParentSelfChores();
  renderHelpfulChores();
  logActivity('helpful', 'Parent approved: ' + chore.text + ' (+' + points + ' pts)');
  showToast('✅ Approved! +' + points + ' chore pts & +' + Math.round(points/2) + ' PB');
}

function rejectSelfChore(id){
  const chore = (D.selfChores||[]).find(c=>c.id===id);
  if(!chore) return;
  chore.status = 'rejected';
  save();
  renderParentSelfChores();
  renderHelpfulChores();
}

// ── PARENT CHORE MANAGER ─────────────────────────────────────
function addChoreFromParent(){
  const name = (document.getElementById('newChoreName')||{}).value.trim();
  const pts = parseInt((document.getElementById('newChorePoints')||{}).value)||10;
  const freq = (document.getElementById('newChoreFreq')||{}).value||'daily';
  const day = (document.getElementById('newChoreDay')||{}).value||'';
  if(!name){ showToast('Enter a chore name'); return; }
  if(!D.chores) D.chores = [];
  // Map freq+day to match D.chores structure
  const freqVal = freq==='weekly' && day ? 'weekly' : freq;
  D.chores.push({
    id: Date.now(),
    name,
    pts,
    freq: freqVal,
    day: day||'',
    cat: 'other',
    emoji: '📌',
    active: true
  });
  save();
  if(document.getElementById('newChoreName')) document.getElementById('newChoreName').value = '';
  renderParentChoreList();
  renderChores();
  updateHeroDashboard();
  showToast('✅ Chore added: '+name+' — child can see it now!');
}

function renderParentChoreList(){
  const el = document.getElementById('parentChoreList'); if(!el) return;
  // Use D.chores — the same source the child sees
  const chores = (Array.isArray(D.chores)?D.chores:[]).filter(c=>c.active!==false);
  if(!chores.length){
    el.innerHTML = '<div style="font-size:.68rem;color:var(--tx3);padding:.3rem;">No chores set up yet. Add one above!</div>';
    return;
  }
  el.innerHTML = chores.map(c=>{
    const freqLabel = c.freq==='daily'?'Daily':c.freq==='weekly'?'Weekly'+(c.day?' ('+c.day+')':''):'One-time';
    return `<div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.72rem;">
      <span style="font-size:.9rem;">${c.emoji||'📌'}</span>
      <span style="flex:1;">${c.name}</span>
      <span style="font-size:.55rem;color:var(--tx3);">${freqLabel}</span>
      <span style="font-size:.6rem;color:#22c55e;font-weight:700;">${c.pts||c.points||10} pts</span>
      <button onclick="editChorePoints(${c.id})" style="font-size:.45rem;background:rgba(56,189,248,.1);color:#38bdf8;border:1px solid rgba(56,189,248,.15);border-radius:4px;padding:.1rem .25rem;cursor:pointer;">Edit</button>
      <button onclick="removeChore(${c.id})" style="font-size:.45rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.15);border-radius:4px;padding:.1rem .25rem;cursor:pointer;">✕</button>
    </div>`;
  }).join('');
}

function editChorePoints(id){
  const c = (Array.isArray(D.chores)?D.chores:[]).find(x=>x.id===id); if(!c) return;
  const newPts = prompt('Edit points for "'+c.name+'":', c.pts||c.points||10);
  if(newPts===null) return;
  c.pts = parseInt(newPts)||(c.pts||10);
  c.points = c.pts; // keep both in sync
  const newName = prompt('Edit name:', c.name);
  if(newName && newName.trim()) c.name = newName.trim();
  save(); renderParentChoreList(); renderChores(); updateHeroDashboard();
}

function removeChore(id){
  if(!confirm('Remove this chore?')) return;
  D.chores = (Array.isArray(D.chores)?D.chores:[]).filter(c=>c.id!==id);
  save(); renderParentChoreList(); renderChores(); updateHeroDashboard();
  showToast('Chore removed');
}

// ── PARENT CONTEST CONTROLS ──────────────────────────────────
function renderParentLeaderboard(){
  const el = document.getElementById('parentLeaderboard'); if(!el) return;
  const entries = [];
  if(_profiles && _profiles.length > 1){
    _profiles.forEach(p=>{
      const pd = p.data || {};
      const pts = (pd.pb||{}).balance||0;
      const streak = pd.streak||0;
      const certs = Object.values(pd.skillCerts||{}).filter(Boolean).length;
      const chores = (pd.choreLog||[]).filter(l=>l.status==='verified').length;
      const score = pts + (streak*5) + (certs*20) + (chores*3);
      entries.push({name:p.name, id:p.id, score, pts, streak, certs, chores});
    });
    entries.sort((a,b)=>b.score-a.score);
    const medals = ['🥇','🥈','🥉'];
    el.innerHTML = entries.map((e,i)=>`
      <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;${i===0?'background:rgba(251,191,36,.06);border-radius:6px;':''}border-bottom:1px solid rgba(255,255,255,.03);font-size:.72rem;">
        <span style="font-size:.9rem;width:22px;">${medals[i]||'#'+(i+1)}</span>
        <span style="flex:1;font-weight:${i===0?'800':'500'};">${e.name}</span>
        <span style="font-size:.6rem;color:var(--tx3);">🪙${e.pts} 🔥${e.streak} 🧠${e.certs} ✅${e.chores}</span>
        <span style="font-weight:800;color:${i===0?'#fbbf24':'var(--tx2)'};">${e.score}</span>
      </div>
    `).join('');
  } else {
    el.innerHTML = '<div style="font-size:.68rem;color:var(--tx3);">Add more children to see rankings. Use + Add Child on the home dashboard.</div>';
  }
}

function awardMVP(){
  if(!_profiles || _profiles.length < 2){ showToast('Need multiple children for MVP'); return; }
  const names = _profiles.map((p,i)=>(i+1)+'. '+p.name).join('\n');
  const choice = prompt('Award Weekly MVP to which child?\n\n'+names+'\n\nEnter number:');
  if(!choice) return;
  const idx = parseInt(choice)-1;
  if(idx < 0 || idx >= _profiles.length){ showToast('Invalid selection'); return; }
  const profile = _profiles[idx];
  // Add PB to that profile's data
  if(!profile.data.pb) profile.data.pb = {balance:0,log:[],storeItems:[],spinTickets:0,scratchTickets:0};
  profile.data.pb.balance += 50;
  profile.data.pb.log.push({id:Date.now(),type:'earn',amount:50,reason:'🌟 Weekly MVP Award!',date:new Date().toISOString().slice(0,10)});
  saveProfiles();
  // If this is the active profile, update D
  if(profile.id === _activeProfileId){
    D.pb = profile.data.pb;
    save(); renderParentBucks();
  }
  logActivity('contest','MVP awarded to '+profile.name+' (+50 PB)');
  showToast('🌟 '+profile.name+' is this week\'s MVP! +50 PB');
  renderParentLeaderboard();
}

function awardBonusAll(){
  const amount = parseInt(prompt('Bonus PB for ALL children:'))||0;
  if(amount <= 0) return;
  const reason = prompt('Reason:')||'Family bonus';
  if(_profiles && _profiles.length > 0){
    _profiles.forEach(p=>{
      if(!p.data.pb) p.data.pb = {balance:0,log:[],storeItems:[],spinTickets:0,scratchTickets:0};
      p.data.pb.balance += amount;
      p.data.pb.log.push({id:Date.now(),type:'earn',amount,reason:'🎉 '+reason,date:new Date().toISOString().slice(0,10)});
    });
    saveProfiles();
    if(_activeProfileId){
      const cur = _profiles.find(p=>p.id===_activeProfileId);
      if(cur){ D.pb = cur.data.pb; save(); renderParentBucks(); }
    }
  } else {
    earnPB(amount, '🎉 '+reason);
  }
  logActivity('contest','Bonus all: +'+amount+' PB ('+reason+')');
  showToast('🎉 +'+amount+' PB for everyone!');
  renderParentLeaderboard();
}

function createCustomContest(){
  const title = (document.getElementById('ccTitle')||{}).value.trim();
  const desc = (document.getElementById('ccDesc')||{}).value.trim();
  const prize = parseInt((document.getElementById('ccPrize')||{}).value)||100;
  const duration = parseInt((document.getElementById('ccDuration')||{}).value)||7;
  const type = (document.getElementById('ccType')||{}).value||'individual';
  if(!title){ showToast('Enter a contest name'); return; }
  if(!D.customContests) D.customContests = [];
  const now = new Date();
  const endDate = new Date(now.getTime() + duration*24*60*60*1000);
  D.customContests.push({
    id:Date.now(), title, desc, prize, type, status:'active',
    startDate:now.toISOString().slice(0,10),
    endDate:endDate.toISOString().slice(0,10),
    participants:{}
  });
  save();
  if(document.getElementById('ccTitle')) document.getElementById('ccTitle').value = '';
  if(document.getElementById('ccDesc')) document.getElementById('ccDesc').value = '';
  renderParentContests();
  logActivity('contest','Created: '+title);
  showToast('🏆 Contest launched: '+title);
}

function renderParentContests(){
  const el = document.getElementById('parentContestList'); if(!el) return;
  const contests = (Array.isArray(D.customContests)?D.customContests:[]).slice().reverse();
  if(!contests.length){ el.innerHTML='<div style="font-size:.68rem;color:var(--tx3);">No contests yet. Create one above!</div>'; return; }
  const today = new Date().toISOString().slice(0,10);
  el.innerHTML = contests.map(c=>{
    const isActive = c.status==='active' && c.endDate >= today;
    const daysLeft = Math.max(0, Math.ceil((new Date(c.endDate)-new Date())/86400000));
    return `<div style="background:rgba(255,255,255,.02);border:1px solid ${isActive?'rgba(251,191,36,.12)':'rgba(255,255,255,.04)'};border-radius:8px;padding:.5rem .6rem;margin-bottom:.3rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.2rem;">
        <span style="font-size:.75rem;font-weight:700;">${isActive?'🟢':'⚫'} ${c.title}</span>
        <span style="font-size:.55rem;color:var(--tx3);">${isActive?daysLeft+' days left':'Ended'}</span>
      </div>
      ${c.desc?`<div style="font-size:.65rem;color:var(--tx2);margin-bottom:.2rem;">${c.desc}</div>`:''}
      <div style="display:flex;gap:.5rem;font-size:.6rem;color:var(--tx3);">
        <span>🏆 ${c.prize} PB</span>
        <span>${c.type==='group'?'👨‍👩‍👧‍👦 Family':'👤 Individual'}</span>
      </div>
      ${isActive?`<div style="display:flex;gap:.3rem;margin-top:.3rem;">
        <button class="btn bp bs" onclick="endContest(${c.id})" style="font-size:.5rem;">🏁 End & Award</button>
        <button class="btn bgh bs" onclick="cancelContest(${c.id})" style="font-size:.5rem;">✕ Cancel</button>
      </div>`:''}
    </div>`;
  }).join('');
}

function endContest(id){
  const c = (Array.isArray(D.customContests)?D.customContests:[]).find(x=>x.id===id); if(!c) return;
  c.status = 'ended';
  if(c.type === 'individual' && _profiles && _profiles.length > 1){
    const names = _profiles.map((p,i)=>(i+1)+'. '+p.name).join('\n');
    const winner = prompt('Who won "'+c.title+'"?\n\n'+names+'\n\nEnter number:');
    if(winner){
      const idx = parseInt(winner)-1;
      if(idx >= 0 && idx < _profiles.length){
        const p = _profiles[idx];
        if(!p.data.pb) p.data.pb = {balance:0,log:[],storeItems:[],spinTickets:0,scratchTickets:0};
        p.data.pb.balance += c.prize;
        p.data.pb.log.push({id:Date.now(),type:'earn',amount:c.prize,reason:'🏆 Won: '+c.title,date:new Date().toISOString().slice(0,10)});
        saveProfiles();
        if(p.id === _activeProfileId){ D.pb = p.data.pb; save(); renderParentBucks(); }
        showToast('🏆 '+p.name+' wins '+c.title+'! +'+c.prize+' PB');
      }
    }
  } else {
    earnPB(c.prize, '🏆 Won: '+c.title);
    showToast('🏆 Contest ended! +'+c.prize+' PB');
  }
  save(); renderParentContests();
}

function cancelContest(id){
  const c = (Array.isArray(D.customContests)?D.customContests:[]).find(x=>x.id===id); if(!c) return;
  c.status = 'cancelled';
  save(); renderParentContests();
  showToast('Contest cancelled');
}

function addFamilyRewardTarget(){
  const emoji = (document.getElementById('frEmoji')||{}).value||'🎁';
  const name = (document.getElementById('frName')||{}).value.trim();
  const target = parseInt((document.getElementById('frTarget')||{}).value)||0;
  if(!name || !target){ showToast('Enter reward name and PB target'); return; }
  if(!D.customFamilyRewards) D.customFamilyRewards = [];
  D.customFamilyRewards.push({id:Date.now(), emoji, name, target, unlocked:false});
  save();
  if(document.getElementById('frName')) document.getElementById('frName').value = '';
  renderParentFamilyRewards();
  showToast(emoji+' '+name+' added!');
}

function renderParentFamilyRewards(){
  const el = document.getElementById('parentFamilyRewards'); if(!el) return;
  const rewards = D.customFamilyRewards||[];
  const totalPB = _profiles&&_profiles.length>1 ? _profiles.reduce((s,p)=>s+((p.data||{}).pb||{}).balance||0,0) : (D.pb||{}).balance||0;
  if(!rewards.length){ el.innerHTML='<div style="font-size:.6rem;color:var(--tx3);">No custom family rewards yet</div>'; return; }
  el.innerHTML = rewards.map(r=>{
    const pct = Math.min(100,Math.round((totalPB/r.target)*100));
    const unlocked = totalPB >= r.target;
    return `<div style="display:flex;align-items:center;gap:.4rem;padding:.25rem .3rem;border-bottom:1px solid rgba(255,255,255,.02);font-size:.68rem;">
      <span>${r.emoji}</span>
      <span style="flex:1;font-weight:${unlocked?'700':'400'};color:${unlocked?'#22c55e':'var(--tx2)'};">${r.name}</span>
      <span style="font-size:.55rem;color:var(--tx3);">${totalPB}/${r.target} PB</span>
      <span style="font-size:.6rem;">${unlocked?'🎉':'🔒'}</span>
      <button onclick="D.customFamilyRewards=D.customFamilyRewards.filter(x=>x.id!==${r.id});save();renderParentFamilyRewards();" style="font-size:.4rem;color:var(--tx3);background:none;border:none;cursor:pointer;">✕</button>
    </div>`;
  }).join('');
}

function renderParentDeeds(){
  const el = document.getElementById('parentDeedsList'); if(!el) return;
  const deeds = (Array.isArray(D.helpfulDeeds)?D.helpfulDeeds:[]).slice().reverse();
  const pending = deeds.filter(d=>!d.approved);
  if(!pending.length){
    el.innerHTML = '<div style="font-size:.68rem;color:var(--tx3);">No pending deeds. When your child logs helpful actions, they appear here.</div>';
    return;
  }
  el.innerHTML = pending.map(d=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.35rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.72rem;">
      <span>⏳</span>
      <span style="flex:1;color:var(--tx2);">${d.text}</span>
      <span style="font-size:.55rem;color:var(--tx3);">${d.date}</span>
      <button class="btn bp bs" onclick="approveDeed(${d.id})" style="font-size:.5rem;padding:.15rem .4rem;">✅ +10 PB</button>
      <button class="btn bs" onclick="rejectDeed(${d.id})" style="font-size:.5rem;padding:.15rem .3rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.15);">✕</button>
    </div>
  `).join('');
}

function approveDeed(id){
  const deed = (Array.isArray(D.helpfulDeeds)?D.helpfulDeeds:[]).find(d=>d.id===id);
  if(!deed) return;
  deed.approved = true;
  earnPB(10, 'Helpful deed approved: '+deed.text);
  save(); renderParentDeeds(); renderHelpfulDeeds();
  logActivity('helpful', 'Parent approved: '+deed.text);
  showToast('Approved! +10 PB');
}

function rejectDeed(id){
  D.helpfulDeeds = (Array.isArray(D.helpfulDeeds)?D.helpfulDeeds:[]).filter(d=>d.id!==id);
  save(); renderParentDeeds(); renderHelpfulDeeds();
}

function renderCompletionSummary(){
  const el = document.getElementById('pqCompletionSummary'); if(!el) return;
  const sel = document.getElementById('pqCompletedTopic'); if(!sel) return;

  // Gather what child has completed
  const certs = D.skillCerts || {};
  const certKeys = Object.keys(certs).filter(k=>certs[k]);
  const scrDays = Object.keys(D.scrReadDays||{}).length;
  const readings = (D.bibleReadings||[]).length;
  const readBooks = [...new Set((D.bibleReadings||[]).map(r=>r.book))];
  const studyNotes = (D.scrNotes||[]).length;
  const goalsCompleted = (Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length;
  const booksFinished = (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length;
  const journalEntries = (Array.isArray(D.journal)?D.journal:[]).length;
  const moodLogs = (D.moods||[]).length;
  const choresDone = (D.choreLog||[]).filter(l=>l.status==='verified').length;

  // Build summary
  let summary = '';
  if(certKeys.length) summary += `🧠 <b>${certKeys.length} Life Skills</b> certified: ${certKeys.map(k=>{const c=typeof SK_CATS!=='undefined'?SK_CATS.find(x=>x.key===k):null;return c?c.name:k;}).join(', ')}<br>`;
  if(scrDays) summary += `✝️ <b>${scrDays}</b> daily scriptures read<br>`;
  if(readings) summary += `📕 <b>${readings}</b> Bible readings logged (${readBooks.length} books: ${readBooks.slice(0,5).join(', ')}${readBooks.length>5?'...':''})<br>`;
  if(studyNotes) summary += `✍️ <b>${studyNotes}</b> study notes written<br>`;
  if(goalsCompleted) summary += `🎯 <b>${goalsCompleted}</b> goals completed<br>`;
  if(booksFinished) summary += `📖 <b>${booksFinished}</b> books finished<br>`;
  if(choresDone) summary += `✅ <b>${choresDone}</b> chores verified<br>`;
  if(journalEntries) summary += `✍️ <b>${journalEntries}</b> journal entries<br>`;
  if(moodLogs) summary += `😊 <b>${moodLogs}</b> mood logs<br>`;
  if(!summary) summary = '<span style="color:var(--tx3);">No completed activities yet. As your child uses the app, their progress will appear here.</span>';
  el.innerHTML = summary;

  // Build the completion-based topic dropdown
  sel.innerHTML = '<option value="">Select from completed topics...</option>';

  // Add completed Life Skills categories
  if(certKeys.length){
    const group = document.createElement('optgroup');
    group.label = '🧠 Certified Life Skills';
    certKeys.forEach(k=>{
      const cat = typeof SK_CATS!=='undefined'?SK_CATS.find(x=>x.key===k):null;
      const bankKey = 'ls-'+k;
      const opt = document.createElement('option');
      opt.value = bankKey;
      opt.textContent = (cat?cat.name:k) + ' ✅';
      group.appendChild(opt);
    });
    sel.appendChild(group);
  }

  // Add Bible topics if they've done reading
  if(scrDays >= 7 || readings >= 3){
    const bGroup = document.createElement('optgroup');
    bGroup.label = '📖 Bible Study';
    ['bible-ot','bible-nt','bible-verses'].forEach(k=>{
      const labels = {'bible-ot':'Old Testament','bible-nt':'New Testament','bible-verses':'Key Verses'};
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = labels[k] + (scrDays>=30?' ✅':' ('+scrDays+' days read)');
      bGroup.appendChild(opt);
    });
    sel.appendChild(bGroup);
  }

  // Add Growing Up if they've viewed topics
  const guGroup = document.createElement('optgroup');
  guGroup.label = '🌱 Growing Up & Safety';
  ['gu-safety','gu-relationships','gu-emotions'].forEach(k=>{
    const labels = {'gu-safety':'Safety & Health','gu-relationships':'Relationships','gu-emotions':'Emotions & Mental Health'};
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = labels[k];
    guGroup.appendChild(opt);
  });
  sel.appendChild(guGroup);
}

function sendCompletionQuiz(){
  const topic = (document.getElementById('pqCompletedTopic')||{}).value;
  const count = parseInt((document.getElementById('pqCount')||{}).value)||5;
  const reward = parseInt((document.getElementById('pqReward')||{}).value)||25;
  const penalty = parseInt((document.getElementById('pqPenalty')||{}).value)||10;
  if(!topic){ showToast('Select a completed topic'); return; }

  // Map the topic to a quiz bank key
  let bankKey = topic;
  // For life skills, try the direct bank or fall back
  if(topic.startsWith('ls-')){
    const lsKey = topic.replace('ls-','');
    // Check if we have a specific bank for this
    if(!QUIZ_BANK[topic]){
      // Generate from the generic life skills banks
      const fallbacks = ['ls-money','ls-cooking','ls-home','ls-career','ls-emergency','ls-digital'];
      const available = fallbacks.filter(f=>QUIZ_BANK[f]);
      if(available.length) bankKey = available[Math.floor(Math.random()*available.length)];
    }
  }

  const bank = QUIZ_BANK[bankKey];
  if(!bank || !bank.length){ showToast('No quiz questions available for this topic yet'); return; }

  const shuffled = [...bank].sort(()=>Math.random()-.5).slice(0, Math.min(count, bank.length));
  const catLabel = document.getElementById('pqCompletedTopic').selectedOptions[0]?.textContent || topic;

  const quiz = {
    id: Date.now(),
    title: catLabel.replace(' ✅','').replace(/\s*\(.*\)/,''),
    questions: shuffled, reward, penalty, passScore: 70,
    status: 'pending',
    sentDate: new Date().toISOString().slice(0,10),
    basedOn: 'completed'
  };
  if(!D.quizzes) D.quizzes = [];
  D.quizzes.push(quiz);
  save(); renderQuizNotification(); renderSentQuizzes();
  showToast('Quiz sent based on completed work! ✓');
}

function saveGpaTarget(val){
  const v = parseFloat(val);
  if(isNaN(v) || v < 0 || v > 4){ showToast('GPA target must be 0.0 – 4.0'); return; }
  D.gpaTarget = v;
  save();
  showToast('GPA target saved');
}

function sendParentQuiz(){
  const title = (document.getElementById('pqTitle')||{}).value || 'Parent Quiz';
  const extraQs = (document.getElementById('pqQuestions')||{}).value || '';
  const rewardCustom = (document.getElementById('pqRewardCustom')||{}).value || '';
  const penaltyCustom = (document.getElementById('pqPenaltyCustom')||{}).value || '';
  const reward = parseInt((document.getElementById('pqReward')||{}).value) || 25;
  const penalty = parseInt((document.getElementById('pqPenalty')||{}).value) || 10;

  // Build questions array from extra text if provided
  let questions = [];
  if(extraQs.trim()){
    extraQs.split('\n').filter(q=>q.trim()).forEach(q=>{
      questions.push({ q: q.trim(), opts:['True','False'], ans:0, explain:'' });
    });
  }
  if(!questions.length){ showToast('Add at least one question'); return; }

  if(!D.pendingQuizzes) D.pendingQuizzes = [];
  D.pendingQuizzes.push({
    id: Date.now(),
    title: title,
    questions: questions,
    reward: rewardCustom || reward,
    penalty: penaltyCustom || penalty,
    passScore: 70,
    status: 'pending',
    sentAt: new Date().toISOString()
  });
  save();
  const el = document.getElementById('pqPendingCount');
  if(el) el.textContent = D.pendingQuizzes.filter(q=>q.status==='pending').length;
  if(document.getElementById('pqTitle')) document.getElementById('pqTitle').value='';
  if(document.getElementById('pqQuestions')) document.getElementById('pqQuestions').value='';
  if(document.getElementById('pqRewardCustom')) document.getElementById('pqRewardCustom').value='';
  if(document.getElementById('pqPenaltyCustom')) document.getElementById('pqPenaltyCustom').value='';
  showToast('Quiz sent to child ✅');
  if(typeof renderSentQuizzes==='function') renderSentQuizzes();
}

function sendCustomQuiz(){
  const title = (document.getElementById('pqTitle')||{}).value.trim()||'Custom Quiz';
  const reward = parseInt((document.getElementById('pqRewardCustom')||{}).value)||25;
  const penalty = parseInt((document.getElementById('pqPenaltyCustom')||{}).value)||10;
  const valid = _quizCustomQs.filter(q=>q.q && q.opts[0]);
  if(valid.length < 2){ showToast('Add at least 2 complete questions'); return; }
  valid.forEach(q=>{ q.a = q.opts[0]; }); // First option is always correct
  const quiz = {
    id: Date.now(), title, questions: valid, reward, penalty,
    passScore: 70, status: 'pending', sentDate: new Date().toISOString().slice(0,10)
  };
  if(!D.quizzes) D.quizzes = [];
  D.quizzes.push(quiz);
  _quizCustomQs = [];
  save(); renderCustomQuestions(); renderQuizNotification(); renderSentQuizzes();
  showToast('Custom quiz sent! ✓');
}

function renderSentQuizzes(){
  const el = document.getElementById('pqSentList'); if(!el) return;
  const quizzes = (Array.isArray(D.quizzes)?D.quizzes:[]).slice().reverse();
  const pending = quizzes.filter(q=>q.status==='pending').length;
  const pc = document.getElementById('pqPendingCount'); if(pc) pc.textContent = pending;
  if(!quizzes.length){ el.innerHTML='<div style="font-size:.65rem;color:var(--tx3);">No quizzes sent yet.</div>'; return; }
  el.innerHTML = quizzes.slice(0,10).map(q=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.65rem;">
      <span style="color:${q.status==='pending'?'#fbbf24':q.status==='passed'?'#22c55e':'#ef4444'};">${q.status==='pending'?'⏳':q.status==='passed'?'✅':'❌'}</span>
      <span style="flex:1;">${q.title} (${q.questions.length}q)</span>
      <span style="font-size:.55rem;color:var(--tx3);">${q.sentDate}</span>
      ${q.score!==undefined?`<span style="font-weight:700;color:${q.score>=70?'#22c55e':'#ef4444'};">${q.score}%</span>`:''}
      ${q.status==='pending'?`<button onclick="cancelQuiz(${q.id})" style="font-size:.4rem;color:var(--tx3);background:none;border:none;cursor:pointer;">✕</button>`:''}
    </div>
  `).join('');
}

function cancelQuiz(id){
  D.quizzes = (Array.isArray(D.quizzes)?D.quizzes:[]).filter(q=>q.id!==id);
  save(); renderSentQuizzes(); renderQuizNotification();
}

// ── CHILD-FACING QUIZ ────────────────────────────────────────
function renderQuizNotification(){
  const el = document.getElementById('quizNotification'); if(!el) return;
  const quizArr = Array.isArray(D.quizzes) ? D.quizzes : [];
  const pending = quizArr.filter(q=>q.status==='pending');
  if(!pending.length){ el.style.display='none'; return; }
  el.style.display='block';
  const q = pending[0];
  const detail = document.getElementById('quizNotifDetail');
  if(detail) detail.textContent = q.title+' · '+q.questions.length+' questions';
  const reward = document.getElementById('quizNotifReward');
  if(reward) reward.textContent = 'Pass: +'+q.reward+' PB';
}

function openPendingQuiz(){
  const pending = (Array.isArray(D.quizzes)?D.quizzes:[]).filter(q=>q.status==='pending');
  if(!pending.length){ showToast('No quizzes waiting'); return; }
  _activeQuiz = pending[0];
  _quizIdx = 0;
  _quizScore = 0;
  // Shuffle options for each question
  _activeQuiz.questions.forEach(q=>{
    q._shuffled = [...q.opts].filter(Boolean).sort(()=>Math.random()-.5);
  });
  document.getElementById('qmTitle').textContent = _activeQuiz.title;
  document.getElementById('qmSubtitle').textContent = _activeQuiz.questions.length+' questions · '+_activeQuiz.passScore+'% to pass';
  document.getElementById('qmReward').textContent = _activeQuiz.reward;
  document.getElementById('qmPenalty').textContent = _activeQuiz.penalty;
  document.getElementById('qmResultArea').style.display = 'none';
  document.getElementById('quizModal').style.display = 'block';
  showQuizQuestion();
}

function showQuizQuestion(){
  const q = _activeQuiz.questions[_quizIdx];
  const total = _activeQuiz.questions.length;
  document.getElementById('qmProgress').style.width = ((_quizIdx/total)*100)+'%';
  
  const area = document.getElementById('qmQuestionArea');
  area.innerHTML = `
    <div style="font-size:.6rem;color:var(--tx2);margin-bottom:.3rem;">Question ${_quizIdx+1} of ${total}</div>
    <div style="font-size:.95rem;font-weight:700;color:var(--tx);margin-bottom:.8rem;line-height:1.5;">${q.q}</div>
    <div style="display:flex;flex-direction:column;gap:.4rem;">
      ${(q._shuffled||q.opts).filter(Boolean).map(opt=>`
        <button onclick="answerQuiz('${opt.replace(/'/g,"\\'")}')" style="text-align:left;padding:.7rem 1rem;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:var(--tx);font-size:.82rem;cursor:pointer;transition:all .15s;font-family:var(--fm);" onmouseenter="this.style.background='rgba(56,189,248,.1)';this.style.borderColor='rgba(56,189,248,.3)'" onmouseleave="this.style.background='rgba(255,255,255,.03)';this.style.borderColor='rgba(255,255,255,.1)'">${opt}</button>
      `).join('')}
    </div>
  `;
}

function answerQuiz(answer){
  const q = _activeQuiz.questions[_quizIdx];
  const correct = answer === q.a;
  if(correct) _quizScore++;
  
  // Brief feedback
  const area = document.getElementById('qmQuestionArea');
  area.innerHTML = `
    <div style="text-align:center;padding:1rem;">
      <div style="font-size:2rem;margin-bottom:.3rem;">${correct?'✅':'❌'}</div>
      <div style="font-size:.9rem;font-weight:700;color:${correct?'#22c55e':'#ef4444'};">${correct?'Correct!':'Wrong'}</div>
      ${!correct?`<div style="font-size:.75rem;color:var(--tx2);margin-top:.2rem;">Answer: ${q.a}</div>`:''}
    </div>
  `;

  setTimeout(()=>{
    _quizIdx++;
    if(_quizIdx < _activeQuiz.questions.length){
      showQuizQuestion();
    } else {
      finishQuiz();
    }
  }, correct ? 1000 : 2000);
}

function finishQuiz(){
  const pct = Math.round((_quizScore/total)*100);
  const passed = pct >= _activeQuiz.passScore;
  
  document.getElementById('qmProgress').style.width = '100%';
  document.getElementById('qmQuestionArea').style.display = 'none';
  const result = document.getElementById('qmResultArea');
  result.style.display = 'block';

  if(passed){
    earnPB(_activeQuiz.reward, 'Quiz passed: '+_activeQuiz.title+' ('+pct+'%)');
    result.innerHTML = `
      <div style="font-size:3rem;margin-bottom:.5rem;">🎉</div>
      <div style="font-size:1.3rem;font-weight:900;color:#22c55e;">PASSED!</div>
      <div style="font-size:1rem;margin:.3rem 0;">${_quizScore}/${total} correct (${pct}%)</div>
      <div style="font-size:.85rem;color:#22c55e;font-weight:700;">+${_activeQuiz.reward} Parent Bucks earned!</div>
      <button class="btn bp" onclick="closeQuizModal()" style="margin-top:1rem;">🎉 Collect Reward</button>
    `;
    _activeQuiz.status = 'passed';
    logActivity('quiz', 'Passed quiz: '+_activeQuiz.title+' ('+pct+'%)');
  } else {
    if(_activeQuiz.penalty > 0){
      if(!D.pb) initParentBucks();
      D.pb.balance = Math.max(0, D.pb.balance - _activeQuiz.penalty);
      D.pb.log.push({id:Date.now(),type:'deduct',amount:_activeQuiz.penalty,reason:'Quiz failed: '+_activeQuiz.title,date:new Date().toISOString().slice(0,10)});
    }
    result.innerHTML = `
      <div style="font-size:3rem;margin-bottom:.5rem;">📖</div>
      <div style="font-size:1.3rem;font-weight:900;color:#ef4444;">Not Yet</div>
      <div style="font-size:1rem;margin:.3rem 0;">${_quizScore}/${total} correct (${pct}%)</div>
      <div style="font-size:.75rem;color:var(--tx2);">Need ${_activeQuiz.passScore}% to pass</div>
      ${_activeQuiz.penalty>0?`<div style="font-size:.85rem;color:#ef4444;font-weight:700;margin-top:.3rem;">-${_activeQuiz.penalty} PB deducted</div>`:''}
      <div style="font-size:.72rem;color:var(--tx2);margin-top:.5rem;">Study the material and try again when your parent sends a new quiz!</div>
      <button class="btn bgh" onclick="closeQuizModal()" style="margin-top:.8rem;">Close</button>
    `;
    _activeQuiz.status = 'failed';
    logActivity('quiz', 'Failed quiz: '+_activeQuiz.title+' ('+pct+'%)');
  }
  _activeQuiz.score = pct;
  save(); renderQuizNotification(); renderParentBucks();
  if(passed) setTimeout(()=>celebrateIfNeeded('cert'), 500);
}

function closeQuizModal(){
  document.getElementById('quizModal').style.display = 'none';
  document.getElementById('qmQuestionArea').style.display = 'block';
  document.getElementById('qmResultArea').style.display = 'none';
  _activeQuiz = null;
}

// ── DAILY ACTIVITY CHECK ─────────────────────────────────────
const DAC_ITEMS = [
  {key:'scripture',icon:'✝️',label:'Read Scripture',faithOnly:true},
  {key:'reflection',icon:'💡',label:'Daily Reflection',faithOnly:false,noFaith:true},
  {key:'journal',icon:'✍️',label:'Journal Entry',faithOnly:false},
  {key:'exercise',icon:'🏃',label:'Exercise',faithOnly:false},
  {key:'reading',icon:'📖',label:'Read 15+ min',faithOnly:false},
  {key:'chore',icon:'🧹',label:'Did a Chore',faithOnly:false},
  {key:'kindness',icon:'💛',label:'Act of Kindness',faithOnly:false},
  {key:'water',icon:'💧',label:'Drank Enough Water',faithOnly:false},
  {key:'sleep',icon:'😴',label:'8+ Hours Sleep',faithOnly:false},
  {key:'screen',icon:'📵',label:'Screen Break',faithOnly:false},
  {key:'skill',icon:'🧠',label:'Learned Something',faithOnly:false},
  {key:'family',icon:'👨‍👩‍👧',label:'Family Time',faithOnly:false},
];

function renderDailyActivityCheck(){
  const el = document.getElementById('dacGrid'); if(!el) return;
  if(!D.dailyChecks) D.dailyChecks = {};
  const today = new Date().toISOString().slice(0,10);
  if(!D.dailyChecks[today]) D.dailyChecks[today] = {};
  const checks = D.dailyChecks[today];
  const faithOn = D.faithMode !== false;

  const items = DAC_ITEMS.filter(i=>{
    if(i.faithOnly && !faithOn) return false;
    if(i.noFaith && faithOn) return false;
    return true;
  });

  const done = items.filter(i=>checks[i.key]).length;
  const prog = document.getElementById('dacProgress');
  if(prog) prog.textContent = done + '/' + items.length + ' today';

  el.innerHTML = items.map(i=>{
    const checked = !!checks[i.key];
    return `<label style="display:flex;align-items:center;gap:.25rem;padding:.3rem .5rem;border-radius:20px;cursor:pointer;background:${checked?'rgba(34,197,94,.12)':'rgba(255,255,255,.03)'};border:1px solid ${checked?'rgba(34,197,94,.2)':'rgba(255,255,255,.06)'};white-space:nowrap;flex-shrink:0;transition:all .15s;">
      <input type="checkbox" ${checked?'checked':''} onchange="toggleDailyCheck('${i.key}',this.checked)" style="width:14px;height:14px;accent-color:#22c55e;cursor:pointer;">
      <span style="font-size:.7rem;">${i.icon}</span>
      <span style="font-size:.65rem;color:${checked?'#22c55e':'var(--tx2)'};font-weight:${checked?'700':'400'};">${i.label}</span>
    </label>`;
  }).join('');
}

function toggleDailyCheck(key, checked){
  const today = new Date().toISOString().slice(0,10);
  if(!D.dailyChecks) D.dailyChecks = {};
  if(!D.dailyChecks[today]) D.dailyChecks[today] = {};
  D.dailyChecks[today][key] = checked || undefined;
  if(!checked) delete D.dailyChecks[today][key];
  save();
  renderDailyActivityCheck();
  if(checked){
    const items = DAC_ITEMS.filter(i=>!(i.faithOnly && D.faithMode===false) && !(i.noFaith && D.faithMode!==false));
    const done = items.filter(i=>D.dailyChecks[today][i.key]).length;
    if(done === items.length){
      earnPB(10, 'All daily activities completed!');
      showToast('🎉 All activities done! +10 PB');
    }
  }
}

// ── VISUAL LIFE MAP GAME BOARD ───────────────────────────────
function renderLifeMapBoard(){
  const el = document.getElementById('lifeMapBoard'); if(!el) return;
  const completed = DEV_MAP_STAGES.filter(s=>s.check()).length;
  const total = DEV_MAP_STAGES.length;
  const prog = document.getElementById('lifeMapProgress');
  if(prog) prog.textContent = completed + '/' + total;

  const colors = ['#22c55e','#38bdf8','#60a5fa','#a78bfa','#f472b6','#fbbf24','#fb923c','#ef4444',
                  '#06b6d4','#8b5cf6','#f59e0b','#22d3ee','#e879f9','#84cc16','#14b8a6','#eab308'];

  // Build a winding path game board
  const cols = 4;
  const rows = Math.ceil(total / cols);

  let boardHTML = '<div style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:0;min-width:300px;">';

  for(let r=0; r<rows; r++){
    const isReverse = r % 2 === 1;
    const rowItems = [];
    for(let c=0; c<cols; c++){
      const idx = r * cols + (isReverse ? (cols-1-c) : c);
      if(idx >= total){ rowItems.push('<div></div>'); continue; }
      const s = DEV_MAP_STAGES[idx];
      const done = s.check();
      const isCurrent = !done && (idx === 0 || DEV_MAP_STAGES[idx-1].check());
      const color = colors[idx % colors.length];

      rowItems.push(`<div style="display:flex;flex-direction:column;align-items:center;padding:.4rem .2rem;position:relative;">
        ${idx > 0 ? `<div style="position:absolute;${isReverse?(c===cols-1?'top:-8px;':'top:50%;left:-50%;'):(c===0&&r>0?'top:-8px;':'top:50%;left:-50%;')}width:${c===0&&r>0||c===cols-1&&isReverse?'2px':'100%'};height:${c===0&&r>0||c===cols-1&&isReverse?'16px':'2px'};background:${done?color:'rgba(255,255,255,.06)'};"></div>` : ''}
        <div style="width:40px;height:40px;border-radius:50%;background:${done?color+'20':'rgba(255,255,255,.04)'};border:2.5px solid ${done?color:isCurrent?'#fbbf24':'rgba(255,255,255,.08)'};display:flex;align-items:center;justify-content:center;font-size:${done?'1.1rem':'.9rem'};${isCurrent?'box-shadow:0 0 12px rgba(251,191,36,.3);animation:quizPulse 2s infinite;':''}${!done&&!isCurrent?'opacity:.3;filter:grayscale(1);':''}transition:all .3s;">
          ${done?s.icon:isCurrent?'⭐':'🔒'}
        </div>
        <div style="font-size:.5rem;font-weight:${done||isCurrent?'700':'400'};color:${done?color:isCurrent?'#fbbf24':'var(--tx3)'};margin-top:.2rem;text-align:center;line-height:1.2;max-width:70px;">${s.label}</div>
      </div>`);
    }
    boardHTML += rowItems.join('');
  }
  boardHTML += '</div>';

  // Legend
  boardHTML += `<div style="display:flex;gap:.6rem;justify-content:center;margin-top:.5rem;font-size:.55rem;color:var(--tx3);">
    <span>🟢 Done</span><span>⭐ Current</span><span>🔒 Locked</span>
  </div>`;

  el.innerHTML = boardHTML;
}

// ── HERO CLOCK & MOTIVATION ──────────────────────────────────
function updateHeroClock(){
  const el = document.getElementById('heroClock'); if(!el) return;
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2,'0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  el.textContent = hr + ':' + m + ' ' + ampm;
}
setInterval(updateHeroClock, 30000);

function renderHeroMotivation(){
  const el = document.getElementById('heroMotivation');
  const auth = document.getElementById('heroMotivationAuthor');
  if(!el) return;
  // Custom message first
  if(D.heroCustomMsg && D.heroCustomMsg.trim()){
    el.textContent = '"' + D.heroCustomMsg + '"';
    if(auth) auth.textContent = '';
    return;
  }
  // If data arrays not loaded yet (called too early during init), retry shortly
  const ready = (typeof DAILY_SCRIPTURES !== 'undefined' && DAILY_SCRIPTURES.length) ||
                (typeof DAILY_REFLECTIONS !== 'undefined' && DAILY_REFLECTIONS.length);
  if(!ready){ setTimeout(renderHeroMotivation, 200); return; }
  const day = getDayOfYear();
  const faithOn = D.faithMode !== false;
  if(faithOn && typeof DAILY_SCRIPTURES !== 'undefined' && DAILY_SCRIPTURES.length){
    const scr = DAILY_SCRIPTURES[(day-1) % DAILY_SCRIPTURES.length];
    el.textContent = '"' + scr[0] + '"';
    if(auth) auth.textContent = '— ' + scr[1];
  } else if(typeof DAILY_REFLECTIONS !== 'undefined' && DAILY_REFLECTIONS.length){
    const ref = DAILY_REFLECTIONS[(day-1) % DAILY_REFLECTIONS.length];
    el.textContent = '"' + ref.text + '"';
    if(auth) auth.textContent = '— ' + ref.author;
  } else {
    el.textContent = '"The only person you are destined to become is the person you decide to be."';
    if(auth) auth.textContent = '— Ralph Waldo Emerson';
  }
}
// Guaranteed re-fire after all scripts finish — fixes init race condition
window.addEventListener('load', function(){ renderHeroMotivation(); });

function toggleCustomMessage(){
  const current = D.heroCustomMsg || '';
  const msg = prompt('Set a custom message for your dashboard:\n(Leave empty to show daily quote/scripture)', current);
  if(msg === null) return; // cancelled
  D.heroCustomMsg = msg.trim();
  save();
  renderHeroMotivation();
  if(msg.trim()) showToast('Custom message set ✓');
  else showToast('Showing daily quote');
}

// ── CONTESTS & CHALLENGES ─────────────────────────────────────
const CHALLENGES = [
  {id:'quiz-champ',icon:'🧠',title:'Quiz Champion',desc:'Pass 3 parent quizzes this month',color:'#8b5cf6',
    target:3, check:()=>(Array.isArray(D.quizzes)?D.quizzes:[]).filter(q=>q.status==='passed'&&q.sentDate>=new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().slice(0,10)).length,
    reward:50, rewardType:'pb'},
  {id:'kindness-week',icon:'💛',title:'Kindness Challenge',desc:'Log 5 helpful deeds this week',color:'#fbbf24',
    target:5, check:()=>{const ws=new Date();ws.setDate(ws.getDate()-ws.getDay());const d=ws.toISOString().slice(0,10);return(Array.isArray(D.helpfulDeeds)?D.helpfulDeeds:[]).filter(h=>h.date>=d).length;},
    reward:30, rewardType:'pb'},
  {id:'chore-hero',icon:'✅',title:'Chore Champion',desc:'Complete 10 verified chores this month',color:'#22c55e',
    target:10, check:()=>{const ms=new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().slice(0,10);return(D.choreLog||[]).filter(l=>l.status==='verified'&&l.date>=ms).length;},
    reward:40, rewardType:'pb'},
  {id:'scripture-streak',icon:'✝️',title:'Scripture Warrior',desc:'Read scripture 7 days in a row',color:'#a78bfa',
    target:7, check:()=>typeof getScriptureStreak==='function'?getScriptureStreak():0,
    reward:35, rewardType:'pb'},
  {id:'journal-master',icon:'✍️',title:'Journal Master',desc:'Write 10 journal entries this month',color:'#f472b6',
    target:10, check:()=>{const ms=new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().slice(0,10);return(Array.isArray(D.journal)?D.journal:[]).filter(j=>(j.date||'')>=ms).length;},
    reward:30, rewardType:'pb'},
  {id:'goal-crusher',icon:'🎯',title:'Goal Crusher',desc:'Complete 3 goals',color:'#fb923c',
    target:3, check:()=>(Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length,
    reward:50, rewardType:'pb'},
  {id:'leader',icon:'👑',title:'Leadership Challenge',desc:'Earn 200+ Parent Bucks total',color:'#eab308',
    target:200, check:()=>(D.pb||{}).balance||0,
    reward:1, rewardType:'spin'},
  {id:'bookworm',icon:'📚',title:'Bookworm',desc:'Finish 2 books',color:'#06b6d4',
    target:2, check:()=>(Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length,
    reward:40, rewardType:'pb'},
];

const FAMILY_REWARDS = [
  {icon:'🍕',title:'Pizza Night',desc:'Family earns 500 combined PB',target:500,color:'#ef4444'},
  {icon:'🎬',title:'Movie Night',desc:'Family earns 750 combined PB',target:750,color:'#60a5fa'},
  {icon:'🎮',title:'Game Night',desc:'All kids log 3+ day streaks',target:3,color:'#8b5cf6'},
  {icon:'🍽️',title:'Kids Pick Dinner',desc:'Family completes 20 chores in a week',target:20,color:'#22c55e'},
  {icon:'🎉',title:'Family Outing',desc:'Family earns 1000 combined PB',target:1000,color:'#fbbf24'},
];

function initContests(){
  if(!D.helpfulDeeds) D.helpfulDeeds = [];
  if(!D.challengeProgress) D.challengeProgress = {};
  renderChallenges();
  renderLeaderboard();
  renderFamilyRewards();
  renderHelpfulDeeds();
}

function renderChallenges(){
  const el = document.getElementById('challengeCards'); if(!el) return;

  // Custom contests from parent
  const today = new Date().toISOString().slice(0,10);
  const customs = (Array.isArray(D.customContests)?D.customContests:[]).filter(c=>c.status==='active'&&c.endDate>=today);
  let customHTML = '';
  if(customs.length){
    customHTML = customs.map(c=>{
      const daysLeft = Math.max(0, Math.ceil((new Date(c.endDate)-new Date())/86400000));
      return `<div style="background:linear-gradient(135deg,rgba(251,191,36,.06),rgba(239,68,68,.04));border:2px solid rgba(251,191,36,.2);border-radius:12px;padding:.8rem;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;right:0;background:#fbbf24;color:#000;font-size:.5rem;font-weight:800;padding:.15rem .4rem;border-radius:0 0 0 8px;">⏰ ${daysLeft}d LEFT</div>
        <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.3rem;">
          <span style="font-size:1.3rem;">🏆</span>
          <div style="flex:1;">
            <div style="font-size:.85rem;font-weight:800;color:#fbbf24;">${c.title}</div>
            <div style="font-size:.62rem;color:var(--tx2);">${c.desc||'Custom contest from parent'}</div>
          </div>
        </div>
        <div style="font-size:.6rem;color:var(--tx3);">🏆 Prize: ${c.prize} PB · ${c.type==='group'?'👨‍👩‍👧‍👦 Family':'👤 Individual'} · Ends: ${c.endDate}</div>
      </div>`;
    }).join('');
  }

  el.innerHTML = customHTML + CHALLENGES.map(c=>{
    const current = c.check();
    const pct = Math.min(100, (current/c.target)*100);
    const done = current >= c.target;
    const claimed = D.challengeProgress && D.challengeProgress[c.id];
    return `<div style="background:rgba(255,255,255,.03);border:1px solid ${c.color}20;border-radius:12px;padding:.8rem;${done&&!claimed?'border-color:'+c.color+'60;box-shadow:0 0 15px '+c.color+'15;':''}">
      <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem;">
        <span style="font-size:1.3rem;">${c.icon}</span>
        <div style="flex:1;">
          <div style="font-size:.82rem;font-weight:700;">${c.title}</div>
          <div style="font-size:.62rem;color:var(--tx2);">${c.desc}</div>
        </div>
        ${done?claimed?'<span style="font-size:.6rem;color:var(--tx3);">✅ Claimed</span>':`<button class="btn bp bs" onclick="claimChallenge('${c.id}')" style="font-size:.55rem;">🎉 Claim</button>`:''}
      </div>
      <div style="display:flex;align-items:center;gap:.4rem;">
        <div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${c.color};border-radius:3px;transition:width .5s;"></div>
        </div>
        <span style="font-size:.6rem;font-weight:700;color:${done?'#22c55e':'var(--tx2)'};">${current}/${c.target}</span>
      </div>
      <div style="font-size:.55rem;color:var(--tx3);margin-top:.2rem;">Reward: ${c.rewardType==='pb'?'+'+c.reward+' PB':c.rewardType==='spin'?'🎰 Spin Ticket':'🎫 Scratch Card'}</div>
    </div>`;
  }).join('');
}

function claimChallenge(id){
  const c = CHALLENGES.find(x=>x.id===id); if(!c) return;
  if(c.check() < c.target){ showToast('Not complete yet!'); return; }
  if(!D.challengeProgress) D.challengeProgress = {};
  if(D.challengeProgress[id]){ showToast('Already claimed'); return; }
  D.challengeProgress[id] = Date.now();
  if(c.rewardType==='pb') earnPB(c.reward, 'Challenge: '+c.title);
  else if(c.rewardType==='spin') awardGameTicket('spin');
  else awardGameTicket('scratch');
  save(); renderChallenges();
  celebrateIfNeeded('badge');
  logActivity('challenge', 'Completed: '+c.title);
}

function logHelpfulDeed(){
  const input = document.getElementById('helpfulDeed');
  if(!input || !input.value.trim()){ showToast('Describe what you did'); return; }
  if(!D.helpfulDeeds) D.helpfulDeeds = [];
  D.helpfulDeeds.push({
    id:Date.now(), text:input.value.trim(), date:new Date().toISOString().slice(0,10),
    approved:false
  });
  input.value = '';
  save(); renderHelpfulDeeds(); renderChallenges();
  logActivity('helpful', 'Logged: '+D.helpfulDeeds[D.helpfulDeeds.length-1].text);
  showToast('Logged! Parent can approve for bonus points 🌟');
}

function renderHelpfulDeeds(){
  const el = document.getElementById('helpfulDeedsList'); if(!el) return;
  const deeds = (Array.isArray(D.helpfulDeeds)?D.helpfulDeeds:[]).slice().reverse().slice(0,8);
  if(!deeds.length){ el.innerHTML=''; return; }
  el.innerHTML = deeds.map(d=>`
    <div style="display:flex;align-items:center;gap:.3rem;padding:.2rem 0;font-size:.65rem;border-bottom:1px solid rgba(255,255,255,.03);">
      <span>${d.approved?'✅':'⏳'}</span>
      <span style="flex:1;color:var(--tx2);">${d.text}</span>
      <span style="font-size:.5rem;color:var(--tx3);">${d.date.slice(5)}</span>
    </div>
  `).join('');
}

function renderLeaderboard(){
  const el = document.getElementById('leaderboard'); if(!el) return;
  // Build from profiles if multi-child, otherwise show single child
  const entries = [];
  if(_profiles && _profiles.length > 1){
    _profiles.forEach(p=>{
      const pd = p.data || {};
      const pts = (pd.pb||{}).balance||0;
      const streak = pd.streak||0;
      const certs = Object.values(pd.skillCerts||{}).filter(Boolean).length;
      const score = pts + (streak*5) + (certs*20);
      entries.push({name:p.name, score, pts, streak, certs});
    });
  } else {
    const pts = (D.pb||{}).balance||0;
    const streak = D.streak||0;
    const certs = Object.values(D.skillCerts||{}).filter(Boolean).length;
    entries.push({name:D.name||'You', score: pts+(streak*5)+(certs*20), pts, streak, certs});
  }
  entries.sort((a,b)=>b.score-a.score);
  const medals = ['🥇','🥈','🥉'];
  el.innerHTML = entries.map((e,i)=>`
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;${i===0?'background:rgba(251,191,36,.06);border-radius:8px;':''}border-bottom:1px solid rgba(255,255,255,.03);">
      <span style="font-size:1rem;width:24px;text-align:center;">${medals[i]||'#'+(i+1)}</span>
      <span style="flex:1;font-size:.8rem;font-weight:${i===0?'800':'500'};">${e.name}</span>
      <span style="font-size:.65rem;color:var(--tx2);">🪙${e.pts} · 🔥${e.streak} · 🧠${e.certs}</span>
      <span style="font-size:.8rem;font-weight:800;color:${i===0?'#fbbf24':'var(--tx2)'};">${e.score}</span>
    </div>
  `).join('');
}

function renderFamilyRewards(){
  const el = document.getElementById('familyRewards'); if(!el) return;
  const totalPB = _profiles && _profiles.length>1 ? _profiles.reduce((s,p)=>s+((p.data||{}).pb||{}).balance||0,0) : (D.pb||{}).balance||0;
  el.innerHTML = FAMILY_REWARDS.map(r=>{
    const progress = r.desc.includes('PB') ? totalPB : 0;
    const pct = Math.min(100, (progress/r.target)*100);
    const unlocked = progress >= r.target;
    return `<div style="background:${unlocked?r.color+'12':'rgba(255,255,255,.02)'};border:1px solid ${unlocked?r.color+'30':'rgba(255,255,255,.05)'};border-radius:10px;padding:.7rem;text-align:center;">
      <div style="font-size:1.5rem;${unlocked?'':'filter:grayscale(.8);opacity:.5;'}">${r.icon}</div>
      <div style="font-size:.75rem;font-weight:700;margin:.2rem 0;">${r.title}</div>
      <div style="font-size:.58rem;color:var(--tx2);margin-bottom:.3rem;">${r.desc}</div>
      <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:${r.color};border-radius:2px;"></div>
      </div>
      <div style="font-size:.5rem;color:${unlocked?'#22c55e':'var(--tx3)'};margin-top:.2rem;">${unlocked?'🎉 UNLOCKED!':Math.round(pct)+'%'}</div>
    </div>`;
  }).join('');
}

// ── FAITH MODE TOGGLE ────────────────────────────────────────
function toggleFaithMode(btn){
  D.faithMode = D.faithMode === false ? true : (D.faithMode === true ? false : false);
  save();
  if(btn) btn.classList.toggle('on', D.faithMode !== false);
  applyFaithMode();
  showToast(D.faithMode !== false ? 'Faith Mode ON' : 'Faith Mode OFF — Daily Reflections active');
}

function applyFaithMode(){
  // Close any open modals when toggling
  const cm = document.getElementById('charModal');
  if(cm) cm.classList.remove('open');
  const faithOn = D.faithMode !== false; // default ON
  
  // 1. Hide/show Bible Study section
  const sec = document.getElementById('s-scripture');
  if(sec) sec.style.display = faithOn ? '' : 'none';
  
  // 2. Hide Bible & Faith nav item
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(n=>{
    if(n.textContent.includes('Bible') || n.textContent.includes('Faith') || n.textContent.includes('Scripture')){
      n.style.display = faithOn ? '' : 'none';
    }
  });
  
  // 3. Hide scripture dashboard card on home
  document.querySelectorAll('.dcard').forEach(card=>{
    if(card.querySelector('.dcard-label') && card.querySelector('.dcard-label').textContent.includes('SCRIPTURE')){
      card.style.display = faithOn ? '' : 'none';
    }
  });
  
  // 4. Home scripture banner - switch to Daily Reflection when OFF
  const scrTxt = document.getElementById('scrTxt');
  const scrRef = document.getElementById('scrRef');
  const scrIcon = scrTxt ? scrTxt.closest('div[style*="border-radius"]') : null;
  if(scrIcon){
    const crossIcon = scrIcon.querySelector('div');
    if(!faithOn){
      renderDailyReflection();
      // Change the cross icon to a lightbulb
      scrIcon.querySelectorAll('div').forEach(d=>{
        if(d.textContent.trim() === '✝️') d.textContent = '💡';
      });
    } else {
      // Restore scripture
      if(typeof renderScripturePage === 'function') renderScripturePage();
      scrIcon.querySelectorAll('div').forEach(d=>{
        if(d.textContent.trim() === '💡') d.textContent = '✝️';
      });
    }
  }
  
  // 5. Hide Scripture Warrior challenge
  // 6. Hide faith-related content in challenges
  // (challenges auto-filter based on what's visible)
  
  // 7. Hide the ✝️ verse add/next buttons when faith off
  const verseButtons = document.querySelectorAll('[onclick*="nextVerse"],[onclick*="addVerse"]');
  verseButtons.forEach(b=>b.style.display = faithOn ? '' : 'none');
  
  // Toggle button state
  const tg = document.getElementById('tg-faithmode');
  if(tg) tg.classList.toggle('on', faithOn);
  
  // If faith OFF and currently viewing Bible & Faith, go to home
  if(!faithOn){
    const scrSec = document.getElementById('s-scripture');
    if(scrSec && scrSec.classList.contains('active')){
      showSection('s-hero');
    }
  }
  
  // Rebuild faith-aware components
  buildCheckins();
  if(typeof renderDailyActivityCheck === 'function') renderDailyActivityCheck();
  if(typeof renderHeroMotivation === 'function') renderHeroMotivation();
}

// ── DAILY REFLECTIONS (when Faith Mode OFF) ──────────────────
const DAILY_REFLECTIONS = [
  {text:'The only person you are destined to become is the person you decide to be.',author:'Ralph Waldo Emerson'},
  {text:'What you do today can improve all your tomorrows.',author:'Ralph Marston'},
  {text:'Believe you can and you are halfway there.',author:'Theodore Roosevelt'},
  {text:'It is during our darkest moments that we must focus to see the light.',author:'Aristotle'},
  {text:'The future belongs to those who believe in the beauty of their dreams.',author:'Eleanor Roosevelt'},
  {text:'Success is not final, failure is not fatal: it is the courage to continue that counts.',author:'Winston Churchill'},
  {text:'You are never too old to set another goal or to dream a new dream.',author:'C.S. Lewis'},
  {text:'The best time to plant a tree was 20 years ago. The second best time is now.',author:'Chinese Proverb'},
  {text:'Do what you can, with what you have, where you are.',author:'Theodore Roosevelt'},
  {text:'The only way to do great work is to love what you do.',author:'Steve Jobs'},
  {text:'Your character is your destiny.',author:'Heraclitus'},
  {text:'Discipline is the bridge between goals and accomplishment.',author:'Jim Rohn'},
  {text:'Kindness is a language which the deaf can hear and the blind can see.',author:'Mark Twain'},
  {text:'In the middle of difficulty lies opportunity.',author:'Albert Einstein'},
  {text:'The greatest glory in living lies not in never falling, but in rising every time we fall.',author:'Nelson Mandela'},
  {text:'Act as if what you do makes a difference. It does.',author:'William James'},
  {text:'Happiness is not something ready-made. It comes from your own actions.',author:'Dalai Lama'},
  {text:'It always seems impossible until it is done.',author:'Nelson Mandela'},
  {text:'The mind is everything. What you think you become.',author:'Buddha'},
  {text:'Strive not to be a success, but rather to be of value.',author:'Albert Einstein'},
  {text:'The only impossible journey is the one you never begin.',author:'Tony Robbins'},
  {text:'What lies behind us and what lies before us are tiny matters compared to what lies within us.',author:'Ralph Waldo Emerson'},
  {text:'You must be the change you wish to see in the world.',author:'Mahatma Gandhi'},
  {text:'Life is 10% what happens to you and 90% how you react to it.',author:'Charles R. Swindoll'},
  {text:'The secret of getting ahead is getting started.',author:'Mark Twain'},
  {text:'Do not go where the path may lead; go instead where there is no path and leave a trail.',author:'Ralph Waldo Emerson'},
  {text:'Well done is better than well said.',author:'Benjamin Franklin'},
  {text:'Hard choices, easy life. Easy choices, hard life.',author:'Jerzy Gregorek'},
  {text:'Your time is limited. Do not waste it living someone else\'s life.',author:'Steve Jobs'},
  {text:'We become what we repeatedly do. Excellence, then, is not an act but a habit.',author:'Aristotle'},
  {text:'The best preparation for tomorrow is doing your best today.',author:'H. Jackson Brown Jr.'},
];

function renderDailyReflection(){
  const day = getDayOfYear();
  const ref = DAILY_REFLECTIONS[(day-1) % DAILY_REFLECTIONS.length];
  const scrTxt = document.getElementById('scrTxt');
  const scrRef = document.getElementById('scrRef');
  if(scrTxt) scrTxt.textContent = ref.text;
  if(scrRef) scrRef.textContent = '— ' + ref.author;
}

// ── CHARACTER & LIFE LESSONS ─────────────────────────────────
const CHARACTER_LESSONS = [
  {icon:'💛',title:'Kindness',sub:'The strength most people underestimate',color:'#fbbf24',
    body:`<h4>What Kindness Actually Is</h4><p>Kindness is not being nice to get something. It is choosing to treat people well even when you gain nothing from it — even when they do not deserve it, even when nobody is watching. It is a decision, not a feeling.</p><h4>Why It Matters</h4><p>Kind people are trusted. Kind people are remembered. Kind people build teams, friendships, and families that last. Research shows that acts of kindness boost your own serotonin (happiness chemical) as much as the person receiving it. Kindness is not weakness — it is strength under control.</p><h4>Real Life</h4><p>The kid sitting alone at lunch who you sit next to — that is kindness. Holding the door without being asked. Defending someone being talked about behind their back. Tipping well even when service was average. Texting someone "thinking of you" when they are going through something hard. These small acts compound into a reputation that opens every door.</p>`,
    quiz:[{q:'Kindness is primarily:',a:'A decision you make regardless of feelings',opts:['A feeling','A decision you make regardless of feelings','Something only nice people do','Weakness']},
          {q:'Research shows kindness boosts:',a:'Your own serotonin',opts:['Only the receiver\'s mood','Your own serotonin','Nothing measurable','Your popularity']}]},
  {icon:'🔵',title:'Honesty',sub:'The foundation everything else is built on',color:'#60a5fa',
    body:`<h4>What Honesty Actually Is</h4><p>Honesty is not just "not lying." It is living in alignment with truth — saying what you mean, doing what you say, and being the same person in every room. It is the refusal to manipulate reality to make yourself look better.</p><h4>Why It Matters</h4><p>Trust takes years to build and seconds to destroy. Every relationship — friendship, romantic, professional — is built on trust. And trust is built on honesty. People who are honest, even when it costs them, earn a level of respect that dishonest people can never buy.</p><h4>The Hard Part</h4><p>Honesty is hard because the truth sometimes hurts, and lying feels easier in the moment. But every lie requires another lie to support it, and eventually the structure collapses. Honest people sleep well. Honest people do not live in fear of being found out. The short-term discomfort of truth is always less painful than the long-term consequences of deception.</p>`,
    quiz:[{q:'Trust is primarily built through:',a:'Consistent honesty over time',opts:['Being likeable','Consistent honesty over time','Never disagreeing','Keeping secrets']},
          {q:'Why is lying ultimately more costly than truth?',a:'Each lie requires more lies to support it',opts:['It is illegal','Each lie requires more lies to support it','People always find out','It is a sin']}]},
  {icon:'🟢',title:'Responsibility',sub:'Owning your life before anyone makes you',color:'#22c55e',
    body:`<h4>What Responsibility Actually Is</h4><p>Responsibility means owning your choices and their consequences — the good ones and the bad ones. It means doing what needs to be done without being told, without making excuses, and without blaming others when things go wrong.</p><h4>Why It Matters</h4><p>Responsible people get promoted. Responsible people are trusted with more. Responsible people build lives they are proud of because they built them on purpose, not by accident. Every successful person you admire is responsible — they show up, they follow through, they own their mistakes.</p><h4>Real Life</h4><p>You forgot the homework? That is on you, not the teacher. You were late? That is on you, not traffic. You said something hurtful? That is on you, not "I was just joking." Responsibility is the bridge between where you are and where you want to be. Without it, nothing else works.</p>`,
    quiz:[{q:'Responsibility primarily means:',a:'Owning your choices and consequences',opts:['Doing chores','Owning your choices and consequences','Being perfect','Listening to adults']},
          {q:'When you make a mistake, responsible people:',a:'Own it and fix it',opts:['Blame someone else','Own it and fix it','Ignore it','Make excuses']}]},
  {icon:'🟠',title:'Patience',sub:'The skill that separates children from adults',color:'#fb923c',
    body:`<h4>What Patience Actually Is</h4><p>Patience is the ability to endure delay, difficulty, or discomfort without losing your composure. It is not passive waiting — it is active endurance. It is choosing to stay calm and focused when everything in you wants to react, rush, or quit.</p><h4>Why It Matters</h4><p>Impatient people make bad decisions. They send the angry text they regret. They quit the project one week before it succeeds. They damage relationships with words they cannot take back. Patient people let situations develop, gather information before reacting, and choose responses instead of reactions.</p><h4>How to Build It</h4><p>Patience is a muscle. Practice in small moments: the slow line at the store, the sibling who annoys you, the assignment that takes longer than expected. When you feel impatience rising, pause. Breathe. Ask: "Will this matter in a week?" Usually it will not. The pause between stimulus and response is where your character lives.</p>`,
    quiz:[{q:'Patience is best described as:',a:'Active endurance during difficulty',opts:['Passive waiting','Active endurance during difficulty','Ignoring problems','Being slow']},
          {q:'The pause between stimulus and response is where:',a:'Your character lives',opts:['Nothing happens','Your character lives','You lose control','Time is wasted']}]},
  {icon:'💜',title:'Forgiveness',sub:'Releasing others so you can be free',color:'#a78bfa',
    body:`<h4>What Forgiveness Actually Is</h4><p>Forgiveness is not saying what happened was okay. It is not pretending it did not hurt. It is choosing to stop carrying the weight of someone else's wrong. It is a decision to release the debt — not for their sake, but for yours.</p><h4>Why It Matters</h4><p>Unforgiveness is a poison you drink hoping the other person gets sick. It creates bitterness that leaks into every relationship. It replays the hurt on a loop in your mind. It keeps you chained to the person who wronged you. Forgiveness breaks the chain. It does not erase the past. It refuses to let the past control the future.</p><h4>The Hard Truth</h4><p>Some things are genuinely hard to forgive. Betrayal, abandonment, cruelty. You may need to forgive the same person for the same thing multiple times before it sticks. That is normal. Forgiveness is not a one-time event — it is a practice. And it gets easier each time you choose it.</p>`,
    quiz:[{q:'Forgiveness primarily benefits:',a:'The person who forgives',opts:['The person who did wrong','The person who forgives','Nobody','Society']},
          {q:'Forgiveness means:',a:'Releasing the debt, not condoning the action',opts:['Saying it was okay','Forgetting what happened','Releasing the debt, not condoning the action','Letting them do it again']}]},
  {icon:'🔷',title:'Integrity',sub:'Who you are when nobody is watching',color:'#06b6d4',
    body:`<h4>What Integrity Actually Is</h4><p>Integrity is the alignment between what you believe, what you say, and what you do. It is being the same person in public and in private. It is doing the right thing when it is hard, when nobody will know, when it costs you something.</p><h4>Why It Matters</h4><p>Your reputation is what people think of you. Your integrity is what you actually are. In the long run, integrity always wins — because eventually, who you really are becomes visible. People with integrity attract trust, opportunities, and respect that people without it can never achieve no matter how hard they try.</p><h4>The Test</h4><p>Integrity is tested in the small moments: Do you return the extra change the cashier gave you by mistake? Do you do the full assignment or cut corners? Do you keep the promise you made when it becomes inconvenient? Do you speak well of people who are not in the room? These small choices compound into the person you become.</p>`,
    quiz:[{q:'Integrity is best defined as:',a:'Alignment between beliefs, words, and actions',opts:['Being popular','Alignment between beliefs, words, and actions','Following rules','Never making mistakes']},
          {q:'Integrity is most tested in:',a:'Small everyday moments',opts:['Big public decisions','Small everyday moments','School exams','Emergencies']}]},
  {icon:'🟡',title:'Respect',sub:'The currency of every relationship',color:'#eab308',
    body:`<h4>What Respect Actually Is</h4><p>Respect is treating people as valuable — not because of what they can do for you, but because they are human. It is listening when someone speaks, honoring boundaries, showing up on time, keeping your word, and acknowledging other people's experiences even when they differ from yours.</p><h4>Why It Matters</h4><p>Respect is the foundation of every functioning relationship, team, family, and society. Without it, communication breaks down, trust evaporates, and conflict escalates. With it, people feel safe enough to be honest, collaborate, and grow together.</p><h4>Respect is Not</h4><p>Respect is not agreement. You can deeply respect someone you disagree with. It is not obedience — blind compliance is not respect. It is not earned by authority alone — a title demands courtesy, but real respect is built through consistent character. And respect is never demanded — it is demonstrated, and it is reciprocal.</p>`,
    quiz:[{q:'Respect is fundamentally about:',a:'Treating people as valuable because they are human',opts:['Obeying authority','Treating people as valuable because they are human','Agreeing with everyone','Being quiet']},
          {q:'You can respect someone you:',a:'Disagree with',opts:['Only agree with','Disagree with','Are afraid of','Want something from']}]}
];

function renderCharacterGrid(){
  const el = document.getElementById('characterGrid'); if(!el) return;
  el.innerHTML = CHARACTER_LESSONS.map((l,i)=>`
    <div onclick="openCharLesson(${i})" style="background:rgba(255,255,255,.03);border:1px solid ${l.color}20;border-left:4px solid ${l.color};border-radius:12px;padding:.8rem 1rem;cursor:pointer;transition:all .15s;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;">
        <span style="font-size:1.3rem;">${l.icon}</span>
        <div>
          <div style="font-size:.88rem;font-weight:800;color:var(--tx);">${l.title}</div>
          <div style="font-size:.68rem;color:var(--tx2);">${l.sub}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function openCharLesson(idx){
  const l = CHARACTER_LESSONS[idx]; if(!l) return;
  document.getElementById('charIcon').textContent = l.icon;
  document.getElementById('charTitle').textContent = l.title;
  document.getElementById('charSub').textContent = l.sub;
  document.getElementById('charBody').innerHTML = l.body;

  // Quiz
  const quizEl = document.getElementById('charQuiz');
  if(quizEl && l.quiz && l.quiz.length){
    quizEl.innerHTML = `<div style="font-size:.78rem;font-weight:700;margin-bottom:.5rem;">🧠 Quick Check</div>` +
      l.quiz.map((q,qi)=>`
        <div style="margin-bottom:.6rem;" id="cq${idx}_${qi}">
          <div style="font-size:.78rem;font-weight:600;margin-bottom:.3rem;">${q.q}</div>
          <div style="display:flex;flex-direction:column;gap:.25rem;">
            ${q.opts.sort(()=>Math.random()-.5).map(opt=>`
              <button onclick="checkCharAnswer(${idx},${qi},'${opt.replace(/'/g,"\\'")}',this)" style="text-align:left;padding:.45rem .7rem;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);font-size:.75rem;cursor:pointer;font-family:var(--fm);color:var(--tx);">${opt}</button>
            `).join('')}
          </div>
        </div>
      `).join('');
  } else {
    quizEl.innerHTML = '';
  }
  openModal('charModal');
  logActivity('character', 'Read: ' + l.title);
}

function checkCharAnswer(lessonIdx, qIdx, answer, btn){
  const q = CHARACTER_LESSONS[lessonIdx].quiz[qIdx];
  const correct = answer === q.a;
  const container = document.getElementById('cq'+lessonIdx+'_'+qIdx);
  if(!container) return;
  // Disable all buttons
  container.querySelectorAll('button').forEach(b=>{
    b.disabled = true;
    b.style.opacity = '.5';
  });
  btn.style.opacity = '1';
  btn.style.background = correct ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)';
  btn.style.borderColor = correct ? '#22c55e' : '#ef4444';
  btn.style.color = correct ? '#22c55e' : '#ef4444';
  if(correct) earnPB(3, 'Character quiz: ' + CHARACTER_LESSONS[lessonIdx].title);
}

// ── BETA TESTING FEEDBACK ─────────────────────────────────────
let _betaType = '';
function setBetaType(type){
  _betaType = type;
  ['bug','suggest','love'].forEach(t=>{
    const el = document.getElementById('betaType'+t.charAt(0).toUpperCase()+t.slice(1));
    if(el){
      el.style.borderWidth = t.includes(type.substring(0,3)) ? '2px' : '1px';
      el.style.fontWeight = t.includes(type.substring(0,3)) ? '800' : '400';
    }
  });
  document.getElementById('betaTypeBug').style.borderWidth = type==='bug'?'2px':'1px';
  document.getElementById('betaTypeSuggest').style.borderWidth = type==='suggestion'?'2px':'1px';
  document.getElementById('betaTypeLove').style.borderWidth = type==='love'?'2px':'1px';
}

async function submitBetaFeedback(){
  const name = (document.getElementById('betaName')||{}).value.trim();
  const age = (document.getElementById('betaAge')||{}).value;
  const feature = (document.getElementById('betaFeature')||{}).value;
  const details = (document.getElementById('betaDetails')||{}).value.trim();
  const msg = document.getElementById('betaMsg');
  
  if(!details){ if(msg) msg.innerHTML='<span style="color:#ef4444;">Please describe your feedback</span>'; return; }
  
  // Store locally and prepare for email
  if(!D.betaFeedback) D.betaFeedback = [];
  const feedback = {
    id:Date.now(), name, age, feature, type:_betaType||'general',
    details, date:new Date().toISOString().slice(0,10)
  };
  D.betaFeedback.push(feedback);
  save();
  
  // Send silently via Brevo
  const emailSubject = 'LifeOS Beta Feedback: '+(_betaType||'General');
  const emailBody = 'Name: '+(name||'Anonymous')+'\nAge: '+(age||'N/A')+'\nFeature: '+(feature||'General')+'\nType: '+(_betaType||'General')+'\nDate: '+feedback.date+'\n\nFeedback:\n'+details;
  try{
    const resp = await fetch('/api/send-email',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        subject:emailSubject,
        textContent:emailBody,
        senderName:'Life OS App'
      })
    });
    if(resp.ok){
      if(msg) msg.innerHTML='<span style="color:#22c55e;">✅ Feedback submitted! Thank you.</span>';
    } else {
      throw new Error('API error '+resp.status);
    }
  }catch(e){
    console.error('Beta feedback send failed:',e);
    if(msg) msg.innerHTML='<span style="color:#f87171;">Failed to send. Please try again.</span>';
  }
  
  // Clear form
  if(document.getElementById('betaDetails')) document.getElementById('betaDetails').value = '';
  showToast('Thank you for your feedback! 🧪');
}


// ── GROWTH TRACKER ───────────────────────────────────────────
function saveGrowthRecord(){
  const ft = parseInt((document.getElementById('grFeet')||{}).value)||0;
  const inch = parseInt((document.getElementById('grInches')||{}).value)||0;
  const wt = parseFloat((document.getElementById('grWeight')||{}).value)||0;
  const note = (document.getElementById('grNote')||{}).value.trim();
  if(!ft && !wt){ showToast('Enter height or weight'); return; }
  if(!D.growthLog) D.growthLog = [];
  const totalInches = ft*12 + inch;
  D.growthLog.push({
    id:Date.now(), date:new Date().toISOString().slice(0,10),
    height:totalInches||null, weight:wt||null, note
  });
  save(); renderGrowthTracker();
  if(document.getElementById('grNote')) document.getElementById('grNote').value='';
  logActivity('growth','Recorded: '+(totalInches?Math.floor(totalInches/12)+"'"+totalInches%12+'"':'')+(wt?' '+wt+'lbs':''));
  showToast('Growth recorded ✓');
}

function renderGrowthTracker(){
  const log = (D.growthLog||[]).slice().sort((a,b)=>a.id-b.id);
  
  const chart = document.getElementById('growthChart'); 
  if(chart && log.length>=2){
    const heights = log.filter(l=>l.height).map(l=>({date:l.date,val:l.height}));
    const weights = log.filter(l=>l.weight).map(l=>({date:l.date,val:l.weight}));
    let chartHTML = '';

    // Height SVG line chart
    if(heights.length>=2){
      const first = heights[0].val; const last = heights[heights.length-1].val;
      const grew = last - first;
      const maxH = Math.max(...heights.map(h=>h.val));
      const minH = Math.min(...heights.map(h=>h.val));
      const range = maxH - minH || 1;
      const w = 100; // percentage-based
      const h = 120;
      const padding = 10;
      const pts = heights.map((d,i)=>{
        const x = padding + (i/(heights.length-1))*(w-padding*2);
        const y = h - padding - ((d.val-minH)/range)*(h-padding*2);
        return {x,y,date:d.date,val:d.val};
      });
      const line = pts.map(p=>p.x+','+p.y).join(' ');
      const area = pts.map(p=>p.x+','+p.y).join(' ') + ` ${pts[pts.length-1].x},${h-padding} ${pts[0].x},${h-padding}`;

      chartHTML += `<div style="background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1);border-radius:10px;padding:.6rem .8rem;margin-bottom:.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;">
          <div style="font-size:.72rem;color:#38bdf8;font-weight:700;">📏 Height</div>
          <div style="font-size:.75rem;font-weight:800;color:var(--tx);">${Math.floor(last/12)}'${last%12}" ${grew>0?'<span style="color:#22c55e;font-size:.65rem;">(+'+grew+' in)</span>':''}</div>
        </div>
        <svg viewBox="0 0 100 ${h}" style="width:100%;height:${h}px;" preserveAspectRatio="none">
          <polygon points="${area}" fill="rgba(56,189,248,.1)"/>
          <polyline points="${line}" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          ${pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="#38bdf8" stroke="#0d1117" stroke-width="1"><title>${p.date}: ${Math.floor(p.val/12)}'${p.val%12}"</title></circle>`).join('')}
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:.5rem;color:var(--tx3);margin-top:.15rem;">
          <span>${heights[0].date.slice(5)}</span><span>${heights[heights.length-1].date.slice(5)}</span>
        </div>
      </div>`;
    }

    // Weight SVG line chart
    if(weights.length>=2){
      const lastW = weights[weights.length-1].val;
      const firstW = weights[0].val;
      const diff = lastW - firstW;
      const maxW = Math.max(...weights.map(w=>w.val));
      const minW = Math.min(...weights.map(w=>w.val));
      const range = maxW - minW || 1;
      const w = 100;
      const h = 120;
      const padding = 10;
      const pts = weights.map((d,i)=>{
        const x = padding + (i/(weights.length-1))*(w-padding*2);
        const y = h - padding - ((d.val-minW)/range)*(h-padding*2);
        return {x,y,date:d.date,val:d.val};
      });
      const line = pts.map(p=>p.x+','+p.y).join(' ');
      const area = pts.map(p=>p.x+','+p.y).join(' ') + ` ${pts[pts.length-1].x},${h-padding} ${pts[0].x},${h-padding}`;

      chartHTML += `<div style="background:rgba(34,197,94,.04);border:1px solid rgba(34,197,94,.1);border-radius:10px;padding:.6rem .8rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;">
          <div style="font-size:.72rem;color:#22c55e;font-weight:700;">⚖️ Weight</div>
          <div style="font-size:.75rem;font-weight:800;color:var(--tx);">${lastW} lbs ${diff!==0?'<span style="color:'+(diff>0?'#fb923c':'#22c55e')+';font-size:.65rem;">('+(diff>0?'+':'')+diff.toFixed(1)+' lbs)</span>':''}</div>
        </div>
        <svg viewBox="0 0 100 ${h}" style="width:100%;height:${h}px;" preserveAspectRatio="none">
          <polygon points="${area}" fill="rgba(34,197,94,.1)"/>
          <polyline points="${line}" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          ${pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="#22c55e" stroke="#0d1117" stroke-width="1"><title>${p.date}: ${p.val}lbs</title></circle>`).join('')}
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:.5rem;color:var(--tx3);margin-top:.15rem;">
          <span>${weights[0].date.slice(5)}</span><span>${weights[weights.length-1].date.slice(5)}</span>
        </div>
      </div>`;
    }
    chart.innerHTML = chartHTML;
  } else if(chart){
    chart.innerHTML = '<div style="font-size:.68rem;color:var(--tx3);text-align:center;padding:.5rem;">Record 2+ measurements to see growth charts</div>';
  }

  // Milestones
  const ms = document.getElementById('growthMilestones');
  if(ms && log.length >= 1){
    const latest = log[log.length-1];
    const first = log[0];
    const totalH = latest.height && first.height ? latest.height - first.height : 0;
    const totalW = latest.weight && first.weight ? (latest.weight - first.weight).toFixed(1) : 0;
    const daySpan = Math.round((latest.id - first.id)/(1000*60*60*24));
    ms.innerHTML = `<div style="display:flex;gap:.5rem;margin-bottom:.5rem;flex-wrap:wrap;">
      <div style="background:rgba(56,189,248,.06);border-radius:8px;padding:.35rem .6rem;font-size:.65rem;"><b style="color:#38bdf8;">${log.length}</b> measurements</div>
      ${totalH?`<div style="background:rgba(34,197,94,.06);border-radius:8px;padding:.35rem .6rem;font-size:.65rem;"><b style="color:#22c55e;">+${totalH} inches</b> grown</div>`:''}
      ${daySpan>0?`<div style="background:rgba(167,139,250,.06);border-radius:8px;padding:.35rem .6rem;font-size:.65rem;">over <b style="color:#a78bfa;">${daySpan}</b> days</div>`:''}
    </div>`;
  } else if(ms){
    ms.innerHTML = '';
  }

  // History
  const hist = document.getElementById('growthHistory'); if(!hist) return;
  const reversed = log.slice().reverse();
  if(!reversed.length){ hist.innerHTML='<div style="font-size:.68rem;color:var(--tx3);text-align:center;">No records yet</div>'; return; }
  hist.innerHTML = reversed.map(r=>`
    <div style="display:flex;align-items:center;gap:.5rem;padding:.35rem .5rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.7rem;">
      <span style="color:var(--tx3);font-size:.62rem;min-width:55px;">${r.date}</span>
      ${r.height?`<span style="color:#38bdf8;font-weight:600;">📏 ${Math.floor(r.height/12)}'${r.height%12}"</span>`:''}
      ${r.weight?`<span style="color:#22c55e;font-weight:600;">⚖️ ${r.weight} lbs</span>`:''}
      ${r.note?`<span style="color:var(--tx2);font-style:italic;flex:1;">${r.note}</span>`:''}
      <button onclick="D.growthLog=(D.growthLog||[]).filter(x=>x.id!==${r.id});save();renderGrowthTracker();" style="font-size:.4rem;color:var(--tx3);background:none;border:none;cursor:pointer;">🗑</button>
    </div>
  `).join('');
}

// ── DEVELOPMENT MAP (Life Game Board) ────────────────────────
const DEV_MAP_STAGES = [
  {id:'start',icon:'🌱',label:'Getting Started',desc:'Set up your profile',check:()=>!!D.name,color:'#22c55e'},
  {id:'firstHabit',icon:'⚡',label:'First Habit',desc:'Check off a daily habit',check:()=>(D.streak||0)>=1,color:'#38bdf8'},
  {id:'firstLesson',icon:'📖',label:'First Lesson',desc:'Read a life skill lesson',check:()=>Object.values(D.skillCerts||{}).filter(Boolean).length>=1||((Array.isArray(D.activityLog)?D.activityLog:[]).find(a=>a.type==='lesson')),color:'#60a5fa'},
  {id:'scripture5',icon:'✝️',label:'5 Days Reading',desc:'Read scripture 5 days',check:()=>Object.keys(D.scrReadDays||{}).length>=5,color:'#a78bfa'},
  {id:'streak7',icon:'🔥',label:'7-Day Streak',desc:'Build a 7-day streak',check:()=>(D.streak||0)>=7,color:'#f472b6'},
  {id:'firstGoal',icon:'🎯',label:'Goal Achieved',desc:'Complete your first goal',check:()=>(Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length>=1,color:'#fbbf24'},
  {id:'chore10',icon:'✅',label:'10 Chores Done',desc:'Complete 10 verified chores',check:()=>(D.choreLog||[]).filter(l=>l.status==='verified').length>=10,color:'#22c55e'},
  {id:'cert3',icon:'🧠',label:'3 Certificates',desc:'Earn 3 skill certificates',check:()=>Object.values(D.skillCerts||{}).filter(Boolean).length>=3,color:'#06b6d4'},
  {id:'journal10',icon:'✍️',label:'10 Journal Entries',desc:'Write 10 reflections',check:()=>(Array.isArray(D.journal)?D.journal:[]).length>=10,color:'#fb923c'},
  {id:'book1',icon:'📚',label:'First Book',desc:'Finish reading a book',check:()=>(Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length>=1,color:'#8b5cf6'},
  {id:'pb100',icon:'🪙',label:'100 Parent Bucks',desc:'Earn 100 PB',check:()=>(D.pb||{}).balance>=100||(D.pb||{}).balance>=100,color:'#fbbf24'},
  {id:'streak30',icon:'💎',label:'30-Day Streak',desc:'Unstoppable consistency',check:()=>(D.streak||0)>=30,color:'#ef4444'},
  {id:'cert10',icon:'🎓',label:'10 Certificates',desc:'Master 10 skill areas',check:()=>Object.values(D.skillCerts||{}).filter(Boolean).length>=10,color:'#22d3ee'},
  {id:'scripture100',icon:'📜',label:'100 Days Reading',desc:'Read 100 daily scriptures',check:()=>Object.keys(D.scrReadDays||{}).length>=100,color:'#a78bfa'},
  {id:'goals10',icon:'🏆',label:'10 Goals Done',desc:'Achieve 10 goals',check:()=>(Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length>=10,color:'#fbbf24'},
  {id:'master',icon:'👑',label:'Life Master',desc:'Complete all milestones above',check:()=>DEV_MAP_STAGES.slice(0,-1).every(s=>s.check()),color:'linear-gradient(135deg,#fbbf24,#22c55e)'},
];

function renderDevMap(){
  const el = document.getElementById('devMapArea'); if(!el) return;
  const completed = DEV_MAP_STAGES.filter(s=>s.check()).length;
  const total = DEV_MAP_STAGES.length;
  const pct = Math.round((completed/total)*100);

  el.innerHTML = `
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(251,191,36,.08);border-radius:14px;padding:.7rem .9rem;cursor:pointer;" onclick="this.querySelector('.devmap-expanded').style.display=this.querySelector('.devmap-expanded').style.display==='none'?'block':'none'">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.3rem;">
        <span style="font-size:.72rem;font-weight:700;letter-spacing:1px;">🗺️ YOUR LIFE MAP</span>
        <span style="font-size:.65rem;color:var(--tx2);">${completed}/${total} milestones · ${pct}%</span>
      </div>
      <!-- Mini path preview -->
      <div style="display:flex;gap:3px;align-items:center;margin-bottom:.3rem;overflow-x:auto;">
        ${DEV_MAP_STAGES.map((s,i)=>{
          const done = s.check();
          return `<div style="width:22px;height:22px;border-radius:50%;background:${done?s.color:'rgba(255,255,255,.06)'};display:flex;align-items:center;justify-content:center;font-size:.55rem;flex-shrink:0;${done?'':'opacity:.4;'}" title="${s.label}">${done?s.icon:'🔒'}</div>${i<DEV_MAP_STAGES.length-1?'<div style="width:8px;height:2px;background:'+( done?s.color:'rgba(255,255,255,.06)')+';flex-shrink:0;"></div>':''}`;
        }).join('')}
      </div>
      <!-- Expanded view -->
      <div class="devmap-expanded" style="display:none;margin-top:.5rem;border-top:1px solid rgba(255,255,255,.05);padding-top:.5rem;">
        ${DEV_MAP_STAGES.map((s,i)=>{
          const done = s.check();
          return `<div style="display:flex;align-items:center;gap:.5rem;padding:.3rem 0;${i<DEV_MAP_STAGES.length-1?'border-bottom:1px solid rgba(255,255,255,.02);':''}">
            <div style="width:28px;height:28px;border-radius:50%;background:${done?s.color:'rgba(255,255,255,.06)'};display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0;${done?'':'opacity:.3;filter:grayscale(1);'}">${s.icon}</div>
            <div style="flex:1;">
              <div style="font-size:.72rem;font-weight:${done?'700':'500'};color:${done?'var(--tx)':'var(--tx3)'};">${s.label}</div>
              <div style="font-size:.58rem;color:var(--tx3);">${s.desc}</div>
            </div>
            <span style="font-size:.6rem;color:${done?'#22c55e':'var(--tx3)'};">${done?'✅':'🔒'}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function charTab(tab, btn){
  ['core','social','emotion','leader'].forEach(t=>{
    const el = document.getElementById('ct-'+t);
    if(el) el.style.display = t===tab ? 'block' : 'none';
  });
  document.querySelectorAll('.charTabs .tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

// ── FRIENDSHIP & SOCIAL SKILLS ───────────────────────────────
const SOCIAL_LESSONS = [
  {icon:'🤝',title:'How to Be a Real Friend',sub:'Not a follower, not a performer — a friend',color:'#f472b6',
    body:`<h4>What Real Friendship Looks Like</h4><p>A real friend tells you what you need to hear, not just what you want to hear. They keep your secrets, show up when things are hard, celebrate your wins without jealousy, and give you space when you need it. Real friendship is built on trust, shared experience, and mutual investment over time — it cannot be speed-run.</p><h4>How to Be That Friend</h4><p>Initiate — don't wait for others to text first. Remember details — ask how their test went, how their family stuff is going. Be reliable — if you say you'll be there, be there. Forgive imperfection — friends will let you down sometimes, and so will you. Grace keeps friendships alive.</p><h4>The Difference</h4><p>Social media followers are not friends. Streaks are not friendships. Having 500 connections means nothing if none of them would help you move. Invest in 3-5 people who actually know you.</p>`},
  {icon:'🗣️',title:'Resolving Disagreements',sub:'Fighting fair so the relationship survives',color:'#60a5fa',
    body:`<h4>Conflict is Inevitable</h4><p>Every relationship will have disagreements. The question is not whether you will fight — it is whether you will fight well. Fighting fair means attacking the problem, not the person.</p><h4>The Rules</h4><p>No name-calling — ever. No bringing up old issues that were already resolved. No "you always" or "you never" — these are exaggerations that escalate everything. Take a break if emotions are too high — say "I need 10 minutes" and come back calmer. Listen to understand, not to win.</p><h4>The Goal</h4><p>The goal of a disagreement is not to be right. It is to be understood — and to understand. Sometimes the resolution is compromise. Sometimes it is agreeing to disagree. Sometimes it is one person realizing they were wrong and owning it. All of these are healthy outcomes.</p>`},
  {icon:'🫂',title:'Empathy — Feeling What Others Feel',sub:'The superpower of every great leader and friend',color:'#a78bfa',
    body:`<h4>What Empathy Is</h4><p>Empathy is the ability to understand and share someone else's feelings — to see the world through their eyes, even when their experience is different from yours. It is not "I know how you feel" (you often don't). It is "I'm trying to understand how you feel."</p><h4>Why It Matters</h4><p>Empathetic people have stronger friendships, better romantic relationships, more successful careers, and more influence. People trust those who understand them. Empathy is the foundation of every act of kindness, every good leadership decision, and every strong team.</p><h4>How to Build It</h4><p>Listen without planning your response. Ask "how did that make you feel?" and actually wait for the answer. Read books and watch stories about people whose lives are different from yours. Before judging someone, ask "what might be happening in their life that I can't see?"</p>`},
  {icon:'🌍',title:'Respecting Differences',sub:'People are different. That is the point.',color:'#22d3ee',
    body:`<h4>The Reality</h4><p>You will work with, live near, and depend on people who look different, think different, believe different, and live different from you. This is not a problem to solve — it is a feature of being human. The ability to respect differences without abandoning your own values is one of the most important skills you will ever develop.</p><h4>What Respect Looks Like</h4><p>Respect does not mean agreement. You can deeply respect someone you disagree with. It means listening before judging, assuming good intent until proven otherwise, and treating every person's dignity as non-negotiable — regardless of their background, beliefs, or choices.</p><h4>The Test</h4><p>Can you articulate the strongest version of an argument you disagree with? Can you be friends with someone who votes differently? Can you learn from someone whose lifestyle is different from yours? If yes, you have the kind of maturity that most adults never achieve.</p>`},
  {icon:'🛡️',title:'Dealing with Toxic People',sub:'When to try harder and when to walk away',color:'#ef4444',
    body:`<h4>Recognizing Toxicity</h4><p>Toxic people drain you. After spending time with them, you feel worse — anxious, smaller, exhausted. They keep score, guilt-trip you when you set boundaries, talk about you behind your back, and make everything about themselves. This pattern is just as damaging in friendships as in romantic relationships.</p><h4>What to Do</h4><p>Set clear boundaries: "I'm not comfortable when you talk about me to others." If they respect the boundary, the relationship can improve. If they don't, that tells you everything you need to know. You are not obligated to maintain a friendship that consistently harms you.</p><h4>Walking Away</h4><p>Ending a toxic friendship is not selfish. It is self-preservation. You don't need a dramatic confrontation. Sometimes you simply stop initiating and let the relationship fade. Your energy is limited — invest it in people who invest in you.</p>`},
];

// ── PARENT ACTIVITY AUDIT ────────────────────────────────────
function renderParentActivityAudit(){
  const el = document.getElementById('parentActivityFeed'); if(!el) return;
  const log = (Array.isArray(D.activityLog)?D.activityLog:[]).slice().reverse().slice(0,30);
  if(!log.length){
    el.innerHTML = '<div style="font-size:.7rem;color:var(--tx3);padding:.5rem;">No activity logged yet.</div>';
    return;
  }
  el.innerHTML = log.map(l=>{
    const d = new Date(l.time);
    const timeStr = d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const icons = {scripture:'✝️',habit:'⚡',chore:'✅',lesson:'🧠',quiz:'📝',goal:'🎯',journal:'✍️',mood:'😊',badge:'🏅',login:'👤'};
    return `<div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.65rem;">
      <span>${icons[l.type]||'📌'}</span>
      <span style="flex:1;color:var(--tx2);">${l.detail}</span>
      <span style="font-size:.55rem;color:var(--tx3);white-space:nowrap;">${timeStr}</span>
    </div>`;
  }).join('');
}

// ── PIN MODAL ENGINE ─────────────────────────────────────────
let _pinEntry = '';
let _pinMode = '';
let _pinTemp = '';
let _pinCallback = null;
let _pinCancelCb = null;

function showPinModal(title, sub, icon, mode, callback, cancelCb){
  _pinEntry = ''; _pinMode = mode; _pinTemp = '';
  _pinCallback = callback; _pinCancelCb = cancelCb || null;
  document.getElementById('pinModalTitle').textContent = title;
  document.getElementById('pinModalSub').textContent = sub;
  // Icon: render as colored avatar circle (initial letter or emoji)
  const iconEl = document.getElementById('pinModalIcon');
  if(iconEl){
    iconEl.textContent = icon || '🔒';
    const isLetter = icon && icon.length <= 2 && /^[A-Za-z]/.test(icon);
    iconEl.style.background = isLetter ? 'var(--c)' : 'rgba(56,189,248,.15)';
    iconEl.style.fontSize = isLetter ? '1.8rem' : '2rem';
    iconEl.style.border = isLetter ? 'none' : '1px solid rgba(56,189,248,.25)';
  }
  const errEl = document.getElementById('pinModalError');
  if(errEl) errEl.textContent = '';
  _pinUpdateDots();
  document.getElementById('pinModal').style.display = 'flex';
}

function _pinUpdateDots(){
  for(let i=0;i<6;i++){
    const d = document.getElementById('pd'+i);
    if(d) d.className = 'pin-dot' + (_pinEntry.length > i ? ' filled' : '');
  }
}

function _pinKey(k){
  if(String(k) === '⌫'){ _pinEntry = _pinEntry.slice(0,-1); _pinUpdateDots(); return; }
  if(String(k) === '' || _pinEntry.length >= 6) return;
  _pinEntry += String(k);
  _pinUpdateDots();
  if(_pinEntry.length === 6) setTimeout(_pinSubmit, 200);
}

function _pinError(msg){
  for(let i=0;i<6;i++){ const d=document.getElementById('pd'+i); if(d) d.className='pin-dot error'; }
  const errEl = document.getElementById('pinModalError');
  if(errEl) errEl.textContent = msg || 'Incorrect PIN';
  setTimeout(()=>{ _pinEntry=''; _pinUpdateDots(); if(errEl) errEl.textContent=''; }, 800);
}

function _pinSubmit(){
  if(_pinMode === 'enter'){
    const correct = D.chorePin || D.parentPIN;
    if(_pinEntry === correct){
      document.getElementById('pinModal').style.display = 'none';
      _pinCallback && _pinCallback(_pinEntry);
    } else {
      _pinError('Incorrect PIN — try again');
    }
  } else if(_pinMode === 'create'){
    _pinTemp = _pinEntry; _pinEntry = ''; _pinMode = 'confirm';
    document.getElementById('pinModalTitle').textContent = 'Confirm PIN';
    document.getElementById('pinModalSub').textContent = 'Enter your PIN again to confirm';
    _pinUpdateDots();
  } else if(_pinMode === 'confirm'){
    if(_pinEntry === _pinTemp){
      document.getElementById('pinModal').style.display = 'none';
      _pinCallback && _pinCallback(_pinEntry);
    } else {
      setTimeout(()=>{
        _pinEntry=''; _pinTemp=''; _pinMode='create';
        document.getElementById('pinModalTitle').textContent = 'Create PIN';
        document.getElementById('pinModalSub').textContent = "PINs didn't match — try again";
        _pinUpdateDots();
      }, 800);
      _pinError("PINs didn't match");
    }
  }
}

function _pinCancel(){
  document.getElementById('pinModal').style.display = 'none';
  _pinCancelCb && _pinCancelCb();
}

function _requirePin(title, sub, icon, onSuccess){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO){ onSuccess && onSuccess(); return; }
  const pin = D.chorePin || D.parentPIN;
  if(!pin){
    // No PIN set — just proceed directly
    onSuccess && onSuccess();
    return;
  }
  showPinModal(title, sub, icon||'🔒', 'enter', onSuccess);
}


// ── QUICK ACCESS BUTTONS (top-right) ─────────────────────────
function quickSettings(){
  var children=(_profiles||[]).filter(function(p){return p.isParent===false;});
  // If no children, just open settings directly
  if(!children.length){ openSettings(); return; }
  // Always show the picker so user can choose child or parent settings
  openSettingsPicker();
}
function openSettingsPicker(){
  var modal=document.getElementById('settingsPickerModal'); if(!modal) return;
  var list=document.getElementById('spmProfileList'); if(!list) return;

  // Always find a parent — fallback to active profile or first profile
  var parent = _profiles.find(function(p){ return p.isParent===true; })
    || _profiles.find(function(p){ return p.id===_activeProfileId; })
    || _profiles[0];
  var children = _profiles.filter(function(p){ return p.isParent===false; });

  var html='';
  if(parent){
    html+='<button class="spm-btn parent" onclick="closeSettingsPicker();_openParentSettings()">'
      +'<span style="font-size:1.2rem;">👨‍👩‍👧</span><div><div>'+(parent.name||'Parent')+' (You)</div>'
      +'<div style="font-size:.68rem;color:var(--tx2);font-weight:400;">Full settings</div></div></button>';
  }
  children.forEach(function(c){
    html+='<button class="spm-btn child" onclick="closeSettingsPicker();_openChildSettings(\''+c.id+'\')">'
      +'<span style="font-size:1.2rem;">'+(c.avatar||'👤')+'</span><div><div>'+c.name+'</div>'
      +'<div style="font-size:.68rem;color:var(--tx2);font-weight:400;">Name, grade &amp; color</div></div></button>';
  });
  list.innerHTML=html;
  modal.classList.add('open');
}
function closeSettingsPicker(){
  var modal=document.getElementById('settingsPickerModal'); if(modal) modal.classList.remove('open');
}
function _openParentSettings(){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO){ openSettings(); return; }
  var pin = D.chorePin || D.parentPIN;
  // Always require PIN if one is set, regardless of session state
  if(pin && !D.parentPinDisabled){
    showPinModal('Parent Settings','Enter your 6-digit parent PIN',(D.name||'P').charAt(0).toUpperCase(),'enter',function(){
      var parentProf=(_profiles||[]).find(function(p){return p.isParent!==false;});
      if(parentProf&&_activeProfileId!==parentProf.id){
        switchToProfile(parentProf.id);
        setTimeout(openSettings,300);
      } else {
        openSettings();
      }
    });
    return;
  }
  // No PIN set — open directly
  var parentProf=(_profiles||[]).find(function(p){return p.isParent!==false;});
  if(parentProf&&_activeProfileId!==parentProf.id){
    switchToProfile(parentProf.id);
    setTimeout(openSettings,300);
  } else {
    openSettings();
  }
}
function _openChildSettings(cid){
  // Switch to child profile temporarily for settings, then open
  var prev=_activeProfileId;
  if(_activeProfileId!==cid) switchToProfile(cid);
  openSettings();
}

function quickParentHub(){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO){ showSection('s-parent'); _doUnlockParent(); return; }
  if(D.parentPinDisabled){ showSection('s-parent'); _doUnlockParent(); return; }
  if(_parentDashUnlocked){ showSection('s-parent'); return; }
  // If no PIN set yet, let them straight in
  if(!D.chorePin && !D.parentPIN){ showSection('s-parent'); _doUnlockParent(); return; }
  const init=(D.name||'P').charAt(0).toUpperCase();
  _requirePin('Parent Hub', 'Enter your 6-digit parent PIN', init, ()=>{
    showSection('s-parent');
    _doUnlockParent();
  });
}

// ── REWARDS LOCK SYSTEM ──────────────────────────────────────
function toggleRewardsLock(){
  const content = document.getElementById('rewardsContent');
  const locked = document.getElementById('rewardsLockedMsg');
  const btn = document.getElementById('rewardsLockBtn');
  if(!content || !locked) return;
  if(content.style.display === 'none'){
    const init=(D.name||'P').charAt(0).toUpperCase();
    _requirePin('Rewards', 'Enter your 6-digit parent PIN', init, ()=>{
      content.style.display = 'block';
      locked.style.display = 'none';
      if(btn) btn.textContent = '🔓 Unlocked';
      renderScreenTime(); renderEarnings(); renderParentBucks(); renderGameTickets();
      showToast('Rewards unlocked ✓');
    });
  } else {
    content.style.display = 'none';
    locked.style.display = 'block';
    if(btn) btn.textContent = '🔒 Locked';
  }
}



// ── CELEBRATION ANIMATION ─────────────────────────────────────
function showCelebration(message, emoji){
  const overlay = document.getElementById('celebOverlay');
  const msgEl = document.getElementById('celebMessage');
  if(!overlay || !msgEl) return;

  // Remove old confetti
  overlay.querySelectorAll('.confetti-piece').forEach(p=>p.remove());

  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'rgba(0,0,0,.75)';
  overlay.style.pointerEvents = 'auto';

  msgEl.innerHTML = `
    <div style="font-size:3.5rem;margin-bottom:.3rem;">${emoji||'🎉'}</div>
    <div style="font-family:var(--fh);font-size:1.6rem;font-weight:900;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.5);margin-bottom:.2rem;">${message||'GREAT JOB!'}</div>
    <div style="font-size:.9rem;color:rgba(255,255,255,.8);">Keep it up! 🔥</div>
  `;
  msgEl.style.animation = 'none';
  void msgEl.offsetWidth;
  msgEl.style.animation = 'celebBounce .6s ease-out';

  // Confetti
  const colors = ['#fbbf24','#22c55e','#60a5fa','#f472b6','#a78bfa','#ef4444','#fb923c','#38bdf8'];
  for(let i=0;i<40;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random()*100+'%';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.borderRadius = Math.random()>.5?'50%':'2px';
    piece.style.width = (4+Math.random()*8)+'px';
    piece.style.height = (4+Math.random()*8)+'px';
    piece.style.animationDelay = (Math.random()*1.5)+'s';
    piece.style.animationDuration = (2+Math.random()*2)+'s';
    overlay.appendChild(piece);
  }
  setTimeout(()=>{ overlay.style.display='none'; overlay.querySelectorAll('.confetti-piece').forEach(p=>p.remove()); }, 3500);
}

// Hook celebrations into key actions
function celebrateIfNeeded(type, detail){
  switch(type){
    case 'chore': showCelebration('CHORE DONE!','✅'); break;
    case 'badge': showCelebration('BADGE EARNED!','🏅'); break;
    case 'goal': showCelebration('GOAL COMPLETE!','🎯'); break;
    case 'cert': showCelebration('CERTIFIED!','🎓'); break;
    case 'book': showCelebration('BOOK FINISHED!','📖'); break;
    case 'streak7': showCelebration('7-DAY STREAK!','🔥'); break;
    case 'streak30': showCelebration('30-DAY STREAK!','💎'); break;
    case 'scripture': showCelebration('DAILY READING DONE!','✝️'); break;
    default: showCelebration(detail||'AWESOME!','🎉');
  }
}

// ── WEEKLY PROGRESS REPORTS ──────────────────────────────────

function saveProgressEmailPref(){
  const email = (document.getElementById('progressEmailInput')||{}).value||'';
  const auto  = (document.getElementById('progressAutoEmailToggle')||{}).checked||false;
  D.progressEmailPref = {email, auto};
  save();
}

function renderProgressReportsTab(){
  // Restore email prefs
  const pref = D.progressEmailPref||{};
  const emailEl = document.getElementById('progressEmailInput');
  const autoEl  = document.getElementById('progressAutoEmailToggle');
  if(emailEl) emailEl.value = pref.email||(_supaUser?_supaUser.email:'')||'';
  if(autoEl)  autoEl.checked = !!pref.auto;

  const container = document.getElementById('progressChildCards');
  if(!container) return;

  const children = (_profiles||[]).filter(p=>!p.isParent);
  if(!children.length){
    container.innerHTML = '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:1.5rem;text-align:center;color:var(--tx2);font-size:.8rem;">No children added yet. Go to <b>Manage Users</b> to add a child profile.</div>';
    return;
  }
  const colors = ['#38bdf8','#34d399','#fbbf24','#f472b6','#a78bfa','#fb923c'];
  container.innerHTML = children.map((child,i)=>{
    const c = colors[i%colors.length];
    const d = child.data||{};
    const name = child.name||'Child';
    const initial = name.charAt(0).toUpperCase();
    // Quick stat preview
    const ws = _getWeekStart(0);
    const chores = (d.choreLog||[]).filter(l=>l.date>=ws&&l.status==='verified').length;
    const moods  = (d.moods||[]).filter(m=>m.date>=ws).length;
    const study  = (d.studyLog||[]).filter(s=>s.date&&s.date>=ws.replace(/-/g,'/')).length;
    const journal= (Array.isArray(d.journal)?d.journal:[]).filter(j=>j.date>=ws).length;
    return `<div style="background:rgba(255,255,255,.03);border:1px solid ${c}25;border-radius:14px;padding:.9rem 1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.6rem;">
          <div style="width:36px;height:36px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-weight:900;color:#06101e;font-size:.85rem;">${initial}</div>
          <div>
            <div style="font-weight:800;font-size:.9rem;">${name}</div>
            <div style="font-size:.55rem;color:var(--tx3);">This week: ${chores} chores · ${moods}/7 moods · ${study} study · ${journal} journal</div>
          </div>
        </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
          <button onclick="generateWeeklySummary('${child.id}',false)" style="background:${c};border:none;border-radius:8px;padding:.4rem .9rem;font-size:.7rem;font-weight:800;color:#06101e;cursor:pointer;font-family:var(--fn);">📊 Generate Report</button>
          <button onclick="generateWeeklySummary('${child.id}',true)" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:.4rem .9rem;font-size:.7rem;font-weight:700;color:var(--tx2);cursor:pointer;font-family:var(--fn);">📧 Generate & Email</button>
        </div>
      </div>
      <div id="wsOutput_${child.id}" style="display:none;"></div>
    </div>`;
  }).join('');
}

function _getWeekStart(weeksAgo){
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - (weeksAgo*7));
  return d.toISOString().slice(0,10);
}

function _getWeekEnd(weeksAgo){
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - (weeksAgo*7) + 6);
  return d.toISOString().slice(0,10);
}

function _collectChildStats(d, weeksAgo){
  const ws  = _getWeekStart(weeksAgo);
  const we  = _getWeekEnd(weeksAgo);
  const gradeMap = {'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D+':1.3,'D':1,'D-':0.7,'F':0};

  const choresDone    = (d.choreLog||[]).filter(l=>l.date>=ws&&l.date<=we&&l.status==='verified').length;
  const choresPending = (d.choreLog||[]).filter(l=>l.date>=ws&&l.date<=we&&l.status==='pending').length;
  const moodsLogged   = (d.moods||[]).filter(m=>m.date>=ws&&m.date<=we).length;
  const moodAvg       = (()=>{ const ms=(d.moods||[]).filter(m=>m.date>=ws&&m.date<=we); return ms.length?Math.round(ms.reduce((s,m)=>s+m.level,0)/ms.length*10)/10:null; })();
  const studySessions = (d.studyLog||[]).filter(s=>s.date&&s.date.replace(/\//g,'-')>=ws&&s.date.replace(/\//g,'-')<=we).length;
  const journalEntries= (Array.isArray(d.journal)?d.journal:[]).filter(j=>j.date>=ws&&j.date<=we).length;
  const goalsCompleted= (Array.isArray(d.goals)?d.goals:[]).filter(g=>g.done&&g.doneDate&&g.doneDate>=ws&&g.doneDate<=we).length;
  const positiveBeh   = (Array.isArray(d.behaviorLog)?d.behaviorLog:[]).filter(b=>b.date>=ws&&b.date<=we&&b.type==='positive').length;
  const negativeBeh   = (Array.isArray(d.behaviorLog)?d.behaviorLog:[]).filter(b=>b.date>=ws&&b.date<=we&&b.type==='negative').length;
  const classes       = d.classes||[];
  const grades        = classes.filter(c=>c.grade).map(c=>gradeMap[c.grade]||0);
  const gpa           = grades.length?Math.round(grades.reduce((a,b)=>a+b,0)/grades.length*100)/100:null;
  const streak        = d.streak||0;
  const badges        = Object.values(d.badges||{}).filter(Boolean).length;
  const certs         = Object.values(d.skillCerts||{}).filter(Boolean).length;
  const booksReading  = (Array.isArray(d.books)?d.books:[]).filter(b=>b.status==='reading').length;
  const booksDone     = (Array.isArray(d.books)?d.books:[]).filter(b=>b.status==='done').length;
  const savingsTotal  = (Array.isArray(d.savingsGoals)?d.savingsGoals:[]).reduce((s,g)=>s+(g.current||0),0);
  const screenBalance = d.screenTimeBalance||0;

  return { choresDone, choresPending, moodsLogged, moodAvg, studySessions, journalEntries,
           goalsCompleted, positiveBeh, negativeBeh, gpa, streak, badges, certs,
           booksReading, booksDone, savingsTotal, screenBalance, classCount:classes.length };
}

function _delta(curr, prev, label, higherIsBetter=true){
  if(curr===null&&prev===null) return '';
  const diff = (curr||0)-(prev||0);
  if(diff===0) return `<span style="color:var(--tx3);">→ Same as last week</span>`;
  const up = higherIsBetter ? diff>0 : diff<0;
  const arrow = diff>0?'▲':'▼';
  const color = up?'#34d399':'#f87171';
  const sign = diff>0?'+':'';
  return `<span style="color:${color};font-weight:700;">${arrow} ${sign}${diff} ${label}</span>`;
}

async function generateWeeklySummary(childId, sendEmail){
  const child = (_profiles||[]).find(p=>p.id===childId);
  if(!child){ showToast('Child not found'); return; }
  const outEl = document.getElementById('wsOutput_'+childId);
  if(!outEl) return;

  outEl.style.display = 'block';
  outEl.innerHTML = `<div style="padding:1rem;text-align:center;color:var(--tx2);font-size:.78rem;">
    <div style="font-size:1.4rem;margin-bottom:.4rem;">⏳</div>Generating ${child.name}'s report with AI analysis…</div>`;

  const d    = child.data||{};
  const curr = _collectChildStats(d, 0);
  const prev = _collectChildStats(d, 1);

  const ws0  = _getWeekStart(0);
  const ws1  = _getWeekStart(1);
  const we1  = _getWeekEnd(1);

  // Build AI prompt
  const statsText = `
Child name: ${child.name}
Week being summarized: ${ws1} through ${we1}

THIS WEEK STATS:
- Chores completed & verified: ${curr.choresDone} (pending: ${curr.choresPending})
- Mood logs: ${curr.moodsLogged}/7 days${curr.moodAvg!==null?' (avg mood: '+curr.moodAvg+'/5)':''}
- Study sessions: ${curr.studySessions}
- Journal entries: ${curr.journalEntries}
- Goals completed: ${curr.goalsCompleted}
- Positive behavior notes: ${curr.positiveBeh}
- Needs-work behavior notes: ${curr.negativeBeh}
- Current GPA: ${curr.gpa!==null?curr.gpa:'N/A'}
- Daily habit streak: ${curr.streak} days
- Life skill certs earned (total): ${curr.certs}
- Badges earned (total): ${curr.badges}
- Books currently reading: ${curr.booksReading}

LAST WEEK STATS (for comparison):
- Chores verified: ${prev.choresDone}
- Mood logs: ${prev.moodsLogged}/7${prev.moodAvg!==null?' (avg: '+prev.moodAvg+'/5)':''}
- Study sessions: ${prev.studySessions}
- Journal entries: ${prev.journalEntries}
- Goals completed: ${prev.goalsCompleted}
- Positive behavior notes: ${prev.positiveBeh}
- Needs-work behavior notes: ${prev.negativeBeh}`;

  let aiSummary = '';
  try{
    const prompt = `You are a warm, encouraging family progress coach writing a weekly summary for a parent about their child's productivity app activity. Write exactly one paragraph (4-6 sentences). Be specific about the numbers. Highlight genuine wins no matter how small. If something declined, acknowledge it gently and suggest one encouraging forward-looking idea — never shame or demean. Keep the tone like a supportive mentor, not a report card. Always end with a positive motivational sentence directed at the parent about their child's potential.\n\n${statsText}`;
    const resp = await fetch('/api/ai-summary',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ prompt })
    });
    const data = await resp.json();
    aiSummary = data.text || 'Summary unavailable — AI could not generate a response.';
  }catch(e){
    aiSummary = 'AI summary unavailable at this time. The statistics above reflect this week\'s activity.';
  }

  // Build stat rows
  const rows = [
    {icon:'✅', label:'Chores Verified',      curr:curr.choresDone,     prev:prev.choresDone,     unit:''},
    {icon:'😊', label:'Moods Logged',          curr:curr.moodsLogged,    prev:prev.moodsLogged,    unit:'/7'},
    {icon:'📖', label:'Study Sessions',        curr:curr.studySessions,  prev:prev.studySessions,  unit:''},
    {icon:'✍️', label:'Journal Entries',       curr:curr.journalEntries, prev:prev.journalEntries, unit:''},
    {icon:'🎯', label:'Goals Completed',       curr:curr.goalsCompleted, prev:prev.goalsCompleted, unit:''},
    {icon:'👍', label:'Positive Behavior',     curr:curr.positiveBeh,    prev:prev.positiveBeh,    unit:''},
    {icon:'👎', label:'Needs-Work Notes',      curr:curr.negativeBeh,    prev:prev.negativeBeh,    unit:'', lower:true},
  ];

  const colors = ['#38bdf8','#34d399','#fbbf24','#f472b6','#a78bfa','#fb923c'];
  const ci = (_profiles||[]).filter(p=>!p.isParent).findIndex(p=>p.id===childId);
  const cc = colors[ci%colors.length];

  const statsHTML = rows.map(r=>{
    const diff = (r.curr||0)-(r.prev||0);
    const up   = r.lower ? diff<0 : diff>0;
    const arrow = diff===0?'→':diff>0?'▲':'▼';
    const acol  = diff===0?'var(--tx3)':up?'#34d399':'#f87171';
    const sign  = diff>0?'+':'';
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:.4rem .5rem;background:rgba(255,255,255,.02);border-radius:8px;margin-bottom:.2rem;">
      <div style="display:flex;align-items:center;gap:.5rem;font-size:.72rem;">
        <span style="font-size:.9rem;">${r.icon}</span>
        <span style="color:var(--tx2);">${r.label}</span>
      </div>
      <div style="display:flex;align-items:center;gap:.8rem;">
        <span style="font-size:.65rem;color:var(--tx3);">Last: ${r.prev||0}${r.unit}</span>
        <span style="font-weight:800;font-size:.8rem;color:${cc};">${r.curr||0}${r.unit}</span>
        <span style="font-size:.65rem;font-weight:700;color:${acol};min-width:36px;text-align:right;">${arrow}${diff!==0?(sign+(Math.abs(diff))):'—'}</span>
      </div>
    </div>`;
  }).join('');

  const gpaChange = curr.gpa!==null&&prev.gpa!==null ? (curr.gpa-prev.gpa) : null;
  const gpaChip   = gpaChange!==null ? `<span style="font-size:.62rem;color:${gpaChange>=0?'#34d399':'#f87171'};font-weight:700;margin-left:.4rem;">${gpaChange>=0?'▲':''} ${gpaChange>0?'+':''}${gpaChange!==null?gpaChange.toFixed(2):''}</span>` : '';

  const weekLabel = new Date(ws1+'T12:00:00').toLocaleDateString('en',{month:'short',day:'numeric'})+' – '+new Date(we1+'T12:00:00').toLocaleDateString('en',{month:'short',day:'numeric'});

  outEl.innerHTML = `
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:.8rem 1rem;margin-top:.3rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem;flex-wrap:wrap;gap:.3rem;">
        <div style="font-size:.72rem;font-weight:800;color:${cc};">WEEK OF ${weekLabel.toUpperCase()}</div>
        <div style="display:flex;gap:.4rem;">
          <button onclick="emailWeeklySummary('${childId}')" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:.3rem .7rem;font-size:.62rem;font-weight:700;color:var(--tx2);cursor:pointer;">📧 Email This Report</button>
          <button onclick="document.getElementById('wsOutput_${childId}').style.display='none'" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:7px;padding:.3rem .7rem;font-size:.62rem;font-weight:600;color:var(--tx3);cursor:pointer;">✕ Close</button>
        </div>
      </div>
      ${curr.gpa!==null?`<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:.45rem .6rem;margin-bottom:.5rem;display:flex;align-items:center;justify-content:space-between;"><span style="font-size:.72rem;color:var(--tx2);">🎓 Current GPA</span><span style="font-size:.82rem;font-weight:900;color:${cc};">${curr.gpa}${gpaChip}</span></div>`:''}
      ${statsHTML}
      <div style="margin-top:.75rem;padding:.75rem;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.12);border-radius:10px;">
        <div style="font-size:.6rem;font-weight:800;color:var(--c);letter-spacing:.06em;margin-bottom:.35rem;">🤖 AI PROGRESS SUMMARY</div>
        <div id="wsAiText_${childId}" style="font-size:.76rem;color:var(--tx);line-height:1.7;">${aiSummary}</div>
      </div>
    </div>`;

  // Store report so emailWeeklySummary can access it
  if(!D._weeklyReports) D._weeklyReports = {};
  D._weeklyReports[childId] = {
    childName:child.name, weekLabel, stats:curr, prevStats:prev,
    aiSummary, generated:new Date().toISOString()
  };

  if(sendEmail) await emailWeeklySummary(childId);
}

async function emailWeeklySummary(childId){
  const rpt = (D._weeklyReports||{})[childId];
  if(!rpt){ showToast('Generate the report first'); return; }
  const pref  = D.progressEmailPref||{};
  const toEmail = pref.email||(_supaUser?_supaUser.email:'')||'';
  if(!toEmail){ showToast('Add a parent email address first ↑'); return; }

  const s = rpt.stats;
  const p = rpt.prevStats;
  const name = rpt.childName;
  const rows = [
    ['✅ Chores Verified',    s.choresDone,     p.choresDone    ],
    ['😊 Moods Logged',       s.moodsLogged,    p.moodsLogged   ],
    ['📖 Study Sessions',     s.studySessions,  p.studySessions ],
    ['✍️ Journal Entries',    s.journalEntries, p.journalEntries],
    ['🎯 Goals Completed',    s.goalsCompleted, p.goalsCompleted],
    ['👍 Positive Behavior',  s.positiveBeh,    p.positiveBeh   ],
    ['📊 Current GPA',        s.gpa,            p.gpa           ],
  ].filter(r=>r[1]!==null);

  const tableRows = rows.map(([label,curr,prev])=>{
    const diff = (curr||0)-(prev||0);
    const sign = diff>0?'+':diff<0?'':'';
    const col = diff>0?'#22c55e':diff<0?'#ef4444':'#94a3b8';
    return `<tr><td style="padding:6px 10px;border-bottom:1px solid #1e293b;color:#94a3b8;">${label}</td><td style="padding:6px 10px;border-bottom:1px solid #1e293b;text-align:center;font-weight:700;color:#f1f5f9;">${curr||0}</td><td style="padding:6px 10px;border-bottom:1px solid #1e293b;text-align:center;font-size:11px;color:${col};">${diff!==0?(sign+diff):'—'}</td></tr>`;
  }).join('');

  const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="background:#0d1117;font-family:Inter,Arial,sans-serif;margin:0;padding:20px;">
<div style="max-width:540px;margin:0 auto;background:#161b27;border-radius:14px;overflow:hidden;border:1px solid rgba(56,189,248,.15);">
  <div style="background:linear-gradient(135deg,#38bdf8,#818cf8);padding:20px 24px;">
    <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:28px;letter-spacing:4px;color:#06101e;">YourLife CC</div>
    <div style="font-size:13px;color:#06101e;opacity:.75;margin-top:2px;">Weekly Progress Report</div>
  </div>
  <div style="padding:20px 24px;">
    <div style="font-size:20px;font-weight:800;color:#f1f5f9;margin-bottom:4px;">📈 ${name}'s Week</div>
    <div style="font-size:12px;color:#64748b;margin-bottom:18px;">${rpt.weekLabel}</div>
    <table style="width:100%;border-collapse:collapse;background:#0d1117;border-radius:10px;overflow:hidden;">
      <thead><tr style="background:#1c2333;">
        <th style="padding:8px 10px;text-align:left;font-size:11px;color:#64748b;font-weight:700;">CATEGORY</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:700;">THIS WEEK</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:700;">vs LAST WEEK</th>
      </tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div style="margin-top:18px;padding:14px;background:#0d1117;border:1px solid rgba(56,189,248,.15);border-radius:10px;">
      <div style="font-size:10px;font-weight:800;color:#38bdf8;letter-spacing:.1em;margin-bottom:8px;">🤖 AI PROGRESS SUMMARY</div>
      <div style="font-size:13px;color:#cbd5e1;line-height:1.7;">${rpt.aiSummary}</div>
    </div>
    <div style="margin-top:16px;text-align:center;font-size:11px;color:#334155;padding-top:12px;border-top:1px solid #1e293b;">
      This report was generated by <span style="color:#38bdf8;">YourLife CC</span> · <a href="https://yourlife.cc" style="color:#38bdf8;">yourlife.cc</a><br>
      You're receiving this because weekly summaries are enabled in your Parent Hub.
    </div>
  </div>
</div></body></html>`;

  try{
    const btn = event && event.target ? event.target : null;
    if(btn){ btn.textContent='Sending…'; btn.disabled=true; }
    const resp = await fetch('/api/send-email',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        to:[{email:toEmail}],
        subject:`📈 ${name}'s Weekly Progress Report — ${rpt.weekLabel}`,
        htmlContent,
        textContent:`${name}'s Weekly Progress Report (${rpt.weekLabel})\n\nChores: ${s.choresDone} | Moods: ${s.moodsLogged}/7 | Study: ${s.studySessions} | Journal: ${s.journalEntries}\n\nAI SUMMARY:\n${rpt.aiSummary}\n\n— YourLife CC`,
        senderName:'YourLife CC'
      })
    });
    if(resp.ok){
      showToast('📧 Report emailed to '+toEmail+' ✓');
      if(btn){ btn.textContent='✅ Sent!'; setTimeout(()=>{ btn.textContent='📧 Email This Report'; btn.disabled=false; },3000); }
    } else {
      throw new Error('API error');
    }
  }catch(e){
    showToast('Email failed — check connection');
    console.error('emailWeeklySummary error:',e);
  }
}

async function generateAllWeeklySummaries(){
  const children = (_profiles||[]).filter(p=>!p.isParent);
  if(!children.length){ showToast('No children found'); return; }
  showToast('Generating '+children.length+' report'+(children.length>1?'s':'')+'…');
  for(const child of children){
    await generateWeeklySummary(child.id, false);
  }
  showToast('All reports ready ✓');
}

// ── AUTO MONDAY EMAIL ─────────────────────────────────────────
function checkAutoWeeklyEmail(){
  try{
    const pref = D.progressEmailPref||{};
    if(!pref.auto || !pref.email) return;
    const today = new Date();
    if(today.getDay() !== 1) return; // only Monday
    const todayStr = today.toISOString().slice(0,10);
    const lastSent = D.progressLastAutoSent||'';
    if(lastSent === todayStr) return; // already sent today
    // Mark first, then send
    D.progressLastAutoSent = todayStr;
    save();
    const children = (_profiles||[]).filter(p=>!p.isParent);
    children.forEach(async(child)=>{
      await generateWeeklySummary(child.id, true);
    });
  }catch(e){ console.error('Auto weekly email error:',e); }
}

// ── SYNC RESILIENCE ──────────────────────────────────────────
// Auto-sync when browser comes back online after losing connection
window.addEventListener('online', function(){
  if(typeof cloudSync === 'function' && typeof _supaUser !== 'undefined' && _supaUser){
    showToast('Back online — syncing ☁');
    cloudSync();
  }
});

// Check if Monday auto-email should fire (runs 5s after load to ensure data is ready)
setTimeout(function(){ if(typeof checkAutoWeeklyEmail==='function') checkAutoWeeklyEmail(); }, 5000);

// Refresh "Last saved X min ago" label every 60 seconds so it stays accurate
setInterval(function(){
  if(typeof setSyncSt === 'function'){
    const last = localStorage.getItem('lifeos_last_sync');
    if(last) setSyncSt('cloud');
  }
}, 60000);
