/* =============================================================
   email.js — Brevo email sending, AI summary proxy calls,
               support/bug report, beta feedback, weekly summary email
============================================================= */

// ── SUPPORT BUG REPORT ────────────────────────────────────────
async function submitSupportBug(){
  const area=(document.getElementById('supportBugArea')||{}).value||'';
  const details=(document.getElementById('supportBugDetails')||{}).value?.trim()||'';
  const msgEl=document.getElementById('supportBugMsg');
  if(!details){msgEl.style.color='#f87171';msgEl.textContent='Please describe the issue first.';return;}

  msgEl.style.color='var(--tx2)';
  msgEl.textContent='Sending…';

  const emailBody=`Bug Report from Life OS\n\nUser: ${_supaUser?_supaUser.email:'(local)'}\nArea: ${area||'Not specified'}\n\n${details}`;
  try{
    const resp = await fetch('/api/send-email',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        subject:'Life OS Bug Report'+(area?' — '+area:''),
        textContent:emailBody,
        senderName:'Life OS App'
      })
    });
    if(resp.ok){
      msgEl.style.color='#22c55e';
      msgEl.textContent='✅ Bug report sent! Thank you.';
    } else {
      throw new Error('API error '+resp.status);
    }
  }catch(e){
    console.error('Bug report send failed:',e);
    msgEl.style.color='#f87171';
    msgEl.textContent='Failed to send. Please email info@kingdom-creatives.com directly.';
  }
  setTimeout(()=>msgEl.textContent='',5000);
}


// ── SCHOOL RESOURCES — CALCULATORS & MATH PRACTICE ───────────
let _mathCorrect=0, _mathWrong=0, _mathStreak=0, _mathExpected=0;

function generateMathProblem(){
  const level = (document.getElementById('mathLevel')||{}).value||'add';
  let a,b,q;
  switch(level){
    case 'add': a=Math.floor(Math.random()*100)+1; b=Math.floor(Math.random()*100)+1; q=a+' + '+b; _mathExpected=a+b; break;
    case 'sub': a=Math.floor(Math.random()*100)+10; b=Math.floor(Math.random()*a)+1; q=a+' − '+b; _mathExpected=a-b; break;
    case 'mul': a=Math.floor(Math.random()*12)+2; b=Math.floor(Math.random()*12)+2; q=a+' × '+b; _mathExpected=a*b; break;
    case 'div': b=Math.floor(Math.random()*12)+2; _mathExpected=Math.floor(Math.random()*12)+1; a=b*_mathExpected; q=a+' ÷ '+b; break;
    case 'pct': a=Math.floor(Math.random()*50)*5+5; b=(Math.floor(Math.random()*19)+1)*10; q='What is '+a+'% of '+b+'?'; _mathExpected=a/100*b; break;
    case 'alg': b=Math.floor(Math.random()*20)+1; _mathExpected=Math.floor(Math.random()*15)+1; a=Math.floor(Math.random()*5)+2; const c=a*_mathExpected+b; q=a+'x + '+b+' = '+c+', x = ?'; break;
  }
  document.getElementById('mathProblem').textContent = q;
  document.getElementById('mathAnswer').value = '';
  document.getElementById('mathResult').textContent = '';
  document.getElementById('mathAnswer').focus();
}

function checkMathAnswer(){
  const ans = parseFloat((document.getElementById('mathAnswer')||{}).value);
  if(isNaN(ans)){ return; }
  const correct = Math.abs(ans - _mathExpected) < 0.01;
  if(correct){
    _mathCorrect++; _mathStreak++;
    document.getElementById('mathResult').innerHTML = '<span style="color:#22c55e;font-weight:700;">✅ Correct!</span>';
  } else {
    _mathWrong++; _mathStreak=0;
    document.getElementById('mathResult').innerHTML = '<span style="color:#ef4444;font-weight:700;">❌ Answer: '+_mathExpected+'</span>';
  }
  document.getElementById('mathCorrect').textContent = _mathCorrect;
  document.getElementById('mathWrong').textContent = _mathWrong;
  document.getElementById('mathStreakDisp').textContent = _mathStreak;
  setTimeout(generateMathProblem, 1500);
}

function buildMultTable(){
  const el = document.getElementById('multTable'); if(!el) return;
  let h = '<tr><th style="padding:3px;background:rgba(56,189,248,.1);border-radius:3px;">×</th>';
  for(let i=1;i<=12;i++) h+='<th style="padding:3px;background:rgba(56,189,248,.06);">'+i+'</th>';
  h+='</tr>';
  for(let r=1;r<=12;r++){
    h+='<tr><td style="padding:3px;font-weight:700;background:rgba(56,189,248,.06);">'+r+'</td>';
    for(let c=1;c<=12;c++) h+='<td style="padding:3px;color:var(--tx2);">'+(r*c)+'</td>';
    h+='</tr>';
  }
  el.innerHTML = h;
}

function calcPct(){
  const x = parseFloat((document.getElementById('pctX')||{}).value)||0;
  const y = parseFloat((document.getElementById('pctY')||{}).value)||0;
  document.getElementById('pctResult').textContent = (x/100*y).toFixed(2);
}

function calcGrade(){
  const s = parseFloat((document.getElementById('grScore')||{}).value)||0;
  const t = parseFloat((document.getElementById('grTotal')||{}).value)||1;
  const pct = (s/t*100).toFixed(1);
  const letter = pct>=93?'A':pct>=90?'A-':pct>=87?'B+':pct>=83?'B':pct>=80?'B-':pct>=77?'C+':pct>=73?'C':pct>=70?'C-':pct>=67?'D+':pct>=60?'D':'F';
  document.getElementById('gradeResult').textContent = pct+'% ('+letter+')';
}

function calcTip(pct){
  const bill = parseFloat((document.getElementById('tipBill')||{}).value)||0;
  const tip = bill * pct/100;
  document.getElementById('tipResult').innerHTML = '<b>'+pct+'% tip:</b> $'+tip.toFixed(2)+' | <b>Total:</b> $'+(bill+tip).toFixed(2);
}

function doConvert(){
  const val = parseFloat((document.getElementById('convVal')||{}).value)||0;
  const type = (document.getElementById('convType')||{}).value;
  const conversions = {
    'mi2km':v=>v*1.609,'km2mi':v=>v/1.609,'lb2kg':v=>v*0.4536,'kg2lb':v=>v/0.4536,
    'f2c':v=>(v-32)*5/9,'c2f':v=>v*9/5+32,'in2cm':v=>v*2.54,'cm2in':v=>v/2.54,
    'gal2l':v=>v*3.785,'l2gal':v=>v/3.785
  };
  const result = conversions[type]?conversions[type](val):val;
  const units = {mi2km:'km',km2mi:'mi',lb2kg:'kg',kg2lb:'lbs',f2c:'°C',c2f:'°F',in2cm:'cm',cm2in:'in',gal2l:'L',l2gal:'gal'};
  document.getElementById('convResult').textContent = result.toFixed(2)+' '+units[type];
}

function initResources(){ generateMathProblem(); buildMultTable(); }


// ── PIN RESET SYSTEM ─────────────────────────────────────────
function resetAllPins(){
  if(!confirm('Reset ALL PINs? This clears the parent PIN and all child PINs.')){ return; }
  D.chorePin = null;
  D.parentPIN = null;
  _profiles = [];
  _activeProfileId = null;
  localStorage.removeItem('ylcc_profiles');
  localStorage.removeItem('ylcc_active_profile');
  save();
  renderProfileSwitcher();
  showToast('All PINs reset. Set a new one on next unlock.');
}

function resetChildPin(profileId){
  const profile = _profiles.find(p=>p.id===profileId);
  if(!profile){ showToast('Profile not found'); return; }
  let newPin='';
  let tries=0;
  do{ newPin=String(Math.floor(1000+Math.random()*9000)); tries++; }
  while(_profiles.find(p=>p.id===newPin) && tries<100);
  const oldId = profile.id;
  profile.id = newPin;
  if(_activeProfileId === oldId) _activeProfileId = newPin;
  saveProfiles();
  renderProfileSwitcher();
  renderManageUsers();
  // Show reveal modal
  const nm=document.getElementById('cprName');
  const pn=document.getElementById('cprPin');
  if(nm) nm.textContent=profile.name+"'s New PIN";
  if(pn) pn.textContent=newPin;
  document.getElementById('childPinReveal').style.display='flex';
}

function toggleParentPinRequired(){
  D.parentPinDisabled = !D.parentPinDisabled;
  save();
  updateParentPinToggleUI();
  showToast(D.parentPinDisabled ? 'PIN disabled — Parent Hub opens freely' : 'PIN now required ✓');
}

function updateParentPinToggleUI(){
  const tog=document.getElementById('parentPinToggle');
  const knob=document.getElementById('parentPinToggleKnob');
  const sec=document.getElementById('parentPinChangeSection');
  const gateMsg=document.getElementById('parentGateMsg');
  const pinFields=document.getElementById('parentPinFields');
  const off=!!D.parentPinDisabled;
  if(tog) tog.style.background=off?'#6b7280':'#22c55e';
  if(knob) knob.style.right=off?'19px':'3px';
  if(sec){sec.style.opacity=off?'.4':'1'; sec.style.pointerEvents=off?'none':'all';}
  if(gateMsg) gateMsg.textContent=off?'PIN is disabled — tap Unlock to enter':'Enter your 6-digit PIN to continue';
  if(pinFields) pinFields.style.display=off?'none':'block';
  // Set parent name initial in avatar circle
  const av=document.getElementById('pgAvatarCircle');
  if(av){
    const initial=(D.name||'').charAt(0).toUpperCase();
    av.textContent = initial || '👨‍👩‍👧';
    av.style.fontSize = initial ? '1.8rem' : '1.4rem';
  }
  // Show/hide direct unlock button when PIN disabled
  let unlockBtn=document.getElementById('pgDirectUnlock');
  if(off){
    if(!unlockBtn){
      unlockBtn=document.createElement('button');
      unlockBtn.id='pgDirectUnlock';
      unlockBtn.className='btn bp';
      unlockBtn.style.cssText='margin-top:.5rem;';
      unlockBtn.textContent='🔓 Unlock';
      unlockBtn.onclick=()=>_doUnlockParent();
      const gate=document.getElementById('parentGate');
      if(gate) gate.appendChild(unlockBtn);
    }
    unlockBtn.style.display='';
  } else {
    if(unlockBtn) unlockBtn.style.display='none';
  }
}

function changeParentPin(){
  const np=document.getElementById('newParentPin');
  const cp=document.getElementById('confirmParentPin');
  if(!np||!cp) return;
  const pin=np.value.trim(), conf=cp.value.trim();
  if(pin.length!==6||isNaN(pin)){showToast('PIN must be exactly 6 digits'); return;}
  if(pin!==conf){showToast('PINs do not match'); return;}
  D.chorePin=pin; save();
  np.value=''; cp.value='';
  showToast('Parent PIN updated ✓');
}

function renderManageUsers(){
  updateParentPinToggleUI();
  const el=document.getElementById('manageUsersList'); if(!el) return;
  const colors=['#a78bfa','#4f8fff','#06d6a0','#f5a623','#f472b6','#22d3ee','#ef4444'];
  const bannerPresets=[
    {g:'none',label:'✕'},
    {g:'linear-gradient(135deg,#4f8fff,#06d6a0,#a78bfa)',label:'Aurora'},
    {g:'linear-gradient(135deg,#667eea,#764ba2)',label:'Violet'},
    {g:'linear-gradient(135deg,#f093fb,#f5576c)',label:'Pink'},
    {g:'linear-gradient(135deg,#4facfe,#00f2fe)',label:'Sky'},
    {g:'linear-gradient(135deg,#43e97b,#38f9d7)',label:'Mint'},
    {g:'linear-gradient(135deg,#fa709a,#fee140)',label:'Warm'},
    {g:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',label:'Ocean'},
    {g:'linear-gradient(135deg,#2d1b69,#11001c)',label:'Royal'},
    {g:'linear-gradient(135deg,#200122,#6f0000)',label:'Crimson'},
    {g:'linear-gradient(135deg,#1d1d1d,#333)',label:'Charcoal'},
  ];
  if(_profiles.length===0){el.innerHTML='<div style="font-size:.75rem;color:var(--tx3);">No profiles yet.</div>'; return;}
  el.innerHTML=_profiles.map((p,i)=>{
    const isP=!!p.isParent;
    const c=colors[i%colors.length];
    const currentBanner=(p.data&&p.data.heroBgPreset)||'none';
    const swatches = isP ? '' : bannerPresets.map(pr=>{
      const isActive = pr.g===currentBanner || (pr.g==='none'&&(!currentBanner||currentBanner==='none'));
      const bg = pr.g==='none' ? 'var(--s3)' : pr.g;
      return `<button onclick="phSetChildBanner('${p.id}','${pr.g.replace(/'/g,"\\'")}')" title="${pr.label}" style="width:22px;height:22px;border-radius:5px;border:${isActive?'2px solid #38bdf8':'1px solid rgba(255,255,255,.1)'};background:${bg};cursor:pointer;flex-shrink:0;font-size:.5rem;color:var(--tx2);display:inline-flex;align-items:center;justify-content:center;">${pr.g==='none'?'✕':''}</button>`;
    }).join('');

    return `<div style="padding:.65rem .4rem;border-bottom:1px solid rgba(255,255,255,.05);">
      <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:${isP?'0':'.5rem'};">
        <div style="width:32px;height:32px;border-radius:50%;background:${c}22;border:2px solid ${c};display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:800;color:${c};flex-shrink:0;">${p.name.charAt(0).toUpperCase()}</div>
        <div style="flex:1;">
          <div style="font-size:.8rem;font-weight:700;color:#e0e0e0;">${p.name}${isP?' <span style="font-size:.58rem;background:rgba(139,92,246,.2);color:#a78bfa;border-radius:4px;padding:1px 5px;margin-left:3px;">PARENT</span>':''}</div>
          <div style="font-size:.65rem;color:var(--tx3);">${isP?'6-digit PIN (managed above)':'4-digit PIN: <span style="font-family:monospace;letter-spacing:.15rem;color:var(--tx3);">••••</span>'}</div>
        </div>
        <div style="display:flex;gap:.3rem;">
          ${!isP?`<button onclick="resetChildPin('${p.id}')" style="font-size:.62rem;padding:3px 7px;border-radius:6px;background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);color:#fbbf24;cursor:pointer;">🔄 New PIN</button>`:''}
          ${!isP?`<button onclick="removeChildById('${p.id}')" style="font-size:.62rem;padding:3px 7px;border-radius:6px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;cursor:pointer;">🗑 Remove</button>`:''}
        </div>
      </div>
      ${!isP?`<div style="display:flex;align-items:center;gap:.3rem;flex-wrap:wrap;">
        <span style="font-size:.6rem;font-weight:700;color:var(--tx3);">🎨 Banner:</span>
        ${swatches}
      </div>`:''}
    </div>`;
  }).join('');
}

function phSetChildBanner(childId, gradient){
  const prof=_profiles.find(p=>p.id===childId); if(!prof) return;
  if(!prof.data) prof.data={};
  prof.data.heroBgPreset = gradient==='none' ? '' : gradient;
  saveProfiles();
  renderManageUsers();
  showToast('Banner color updated!');
}

function addChildFromHub(){
  const nameEl=document.getElementById('newChildName');
  const pinEl=document.getElementById('newChildPin');
  const name=nameEl?nameEl.value.trim():'';
  if(!name){showToast('Enter a name'); return;}
  let pin=pinEl?pinEl.value.trim():'';
  if(pin&&(pin.length!==4||isNaN(pin))){showToast('PIN must be exactly 4 digits'); return;}
  if(!pin){
    let tries=0;
    do{pin=String(Math.floor(1000+Math.random()*9000));tries++;}
    while(_profiles.find(p=>p.id===pin)&&tries<100);
  }
  if(_profiles.find(p=>p.id===pin)){showToast('PIN already in use — try a different one'); return;}
  if(_activeProfileId){const cur=_profiles.find(p=>p.id===_activeProfileId);if(cur)cur.data=JSON.parse(JSON.stringify(D));}
  _profiles.push({id:pin,name,isParent:false,data:{name,streak:0,mode:'mid_hs'}});
  saveProfiles();
  if(nameEl)nameEl.value='';
  if(pinEl)pinEl.value='';
  renderManageUsers();
  renderProfileSwitcher();
  showToast(name+' added!');
  // Show PIN reveal modal (replaces alert())
  const nm=document.getElementById('cprName');
  const pn=document.getElementById('cprPin');
  if(nm) nm.textContent=name+"'s Profile";
  if(pn) pn.textContent=pin;
  document.getElementById('childPinReveal').style.display='flex';
}

function removeChildById(id){
  const p=_profiles.find(x=>x.id===id); if(!p) return;
  if(!confirm('Remove '+p.name+'?\n\nAll their data will be permanently deleted.')) return;
  if(_activeProfileId===id) switchToProfile(_profiles.find(x=>x.isParent).id);
  _profiles=_profiles.filter(x=>x.id!==id);
  saveProfiles(); renderManageUsers(); renderProfileSwitcher();
  showToast(p.name+' removed');
}


// ── ANTI-GAMING / INTEGRITY CONTROLS ─────────────────────────
// Prevents kids from rushing through content without actually engaging

const COOLDOWNS = {};

function checkCooldown(action, seconds){
  const now = Date.now();
  const key = action;
  if(COOLDOWNS[key] && (now - COOLDOWNS[key]) < seconds*1000){
    const remaining = Math.ceil((seconds*1000 - (now - COOLDOWNS[key]))/1000);
    showToast('Please wait '+remaining+' seconds before doing that again');
    return false;
  }
  COOLDOWNS[key] = now;
  return true;
}

// Track time spent in sections for parent visibility
function logActivity(type, detail){
  if(!D.activityLog) D.activityLog = [];
  D.activityLog.push({
    type,
    detail,
    time: new Date().toISOString(),
    ts: Date.now()
  });
  // Keep last 200 entries
  if(D.activityLog.length > 200) D.activityLog = D.activityLog.slice(-200);
  save();
}

// ── SCRIPTURE READING TIMER ──────────────────────────────────
// Don't show "Mark as Read" for 30 seconds (must actually read it)
let _scrReadTimer = null;
let _scrCanMark = false;

function initScriptureTimer(){
  _scrCanMark = false;
  const actionEl = document.getElementById('scrDailyAction');
  if(!actionEl) return;
  const today = new Date().toISOString().slice(0,10);
  if(D.scrReadDays && D.scrReadDays[today]){
    // Already read today
    _scrCanMark = true;
    return;
  }
  // Show countdown then reveal button
  let countdown = 30;
  actionEl.innerHTML = `<div style="font-size:.75rem;color:var(--tx2);">Read the verse above... <span id="scrCountdown" style="color:var(--c);font-weight:700;">${countdown}s</span></div>`;
  if(_scrReadTimer) clearInterval(_scrReadTimer);
  _scrReadTimer = setInterval(()=>{
    countdown--;
    const cd = document.getElementById('scrCountdown');
    if(cd) cd.textContent = countdown+'s';
    if(countdown <= 0){
      clearInterval(_scrReadTimer);
      _scrCanMark = true;
      if(actionEl) actionEl.innerHTML = '<button class="btn bp" onclick="markScriptureReadSafe()" style="font-size:.85rem;">✅ Mark as Read (+5 pts)</button>';
    }
  },1000);
}

function markScriptureReadSafe(){
  if(!_scrCanMark){ showToast('Please read the verse first (30 second timer)'); return; }
  if(!checkCooldown('scripture', 60)) return;
  markScriptureRead();
  logActivity('scripture', 'Read daily scripture');
}

// ── DAILY W's COOLDOWN ───────────────────────────────────────
// Can only check off habits once per day (already enforced by date)
// But add logging for parent visibility
function logHabitCheck(habitName){
  logActivity('habit', 'Checked: '+habitName);
}

// ── LIFE SKILLS LESSON TIMER ─────────────────────────────────
// Track how long they spend reading a lesson before quiz
let _lessonOpenTime = 0;

function startLessonTimer(){
  _lessonOpenTime = Date.now();
}

function canTakeQuiz(){
  const timeSpent = (Date.now() - _lessonOpenTime) / 1000;
  if(timeSpent < 45){
    showToast('Please read the lesson for at least 45 seconds before taking the quiz');
    return false;
  }
  return true;
}


// ── SCRIPTURE READING TIMER ──────────────────────────────────
// Don't show "Mark as Read" for 30 seconds (must actually read it)
let _scrReadTimer = null;
let _scrCanMark = false;

function initScriptureTimer(){
  _scrCanMark = false;
  const actionEl = document.getElementById('scrDailyAction');
  if(!actionEl) return;
  const today = new Date().toISOString().slice(0,10);
  if(D.scrReadDays && D.scrReadDays[today]){
    // Already read today
    _scrCanMark = true;
    return;
  }
  // Show countdown then reveal button
  let countdown = 30;
  actionEl.innerHTML = `<div style="font-size:.75rem;color:var(--tx2);">Read the verse above... <span id="scrCountdown" style="color:var(--c);font-weight:700;">${countdown}s</span></div>`;
  if(_scrReadTimer) clearInterval(_scrReadTimer);
  _scrReadTimer = setInterval(()=>{
    countdown--;
    const cd = document.getElementById('scrCountdown');
    if(cd) cd.textContent = countdown+'s';
    if(countdown <= 0){
      clearInterval(_scrReadTimer);
      _scrCanMark = true;
      if(actionEl) actionEl.innerHTML = '<button class="btn bp" onclick="markScriptureReadSafe()" style="font-size:.85rem;">✅ Mark as Read (+5 pts)</button>';
    }
  },1000);
}

function markScriptureReadSafe(){
  if(!_scrCanMark){ showToast('Please read the verse first (30 second timer)'); return; }
  if(!checkCooldown('scripture', 60)) return;
  markScriptureRead();
  logActivity('scripture', 'Read daily scripture');
}

// ── DAILY W's COOLDOWN ───────────────────────────────────────
// Can only check off habits once per day (already enforced by date)
// But add logging for parent visibility
function logHabitCheck(habitName){
  logActivity('habit', 'Checked: '+habitName);
}

// ── LIFE SKILLS LESSON TIMER ─────────────────────────────────
// Track how long they spend reading a lesson before quiz
let _lessonOpenTime = 0;

function startLessonTimer(){
  _lessonOpenTime = Date.now();
}

function canTakeQuiz(){
  const timeSpent = (Date.now() - _lessonOpenTime) / 1000;
  if(timeSpent < 45){
    showToast('Please read the lesson for at least 45 seconds before taking the quiz');
    return false;
  }
  return true;
}

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


    overlay.appendChild(piece);
  }

  // Auto-close after 3 seconds
  setTimeout(()=>{
    overlay.style.display = 'none';
    // Remove confetti pieces
    overlay.querySelectorAll('.confetti-piece').forEach(p=>p.remove());
  }, 3500);
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

// ── PARENT BUCKS SYSTEM ──────────────────────────────────────
function initParentBucks(){
  if(!D.pb) D.pb = {balance:0,log:[],storeItems:[],spinnerSlices:[],scratchPrizes:[]};
  if(!D.pb.spinTickets) D.pb.spinTickets = 0;
  if(!D.pb.scratchTickets) D.pb.scratchTickets = 0;
  renderParentBucks();
  renderGameTickets();
}

function earnPB(amount, reason){
  if(!D.pb) initParentBucks();
  D.pb.balance += amount;
  D.pb.log.push({id:Date.now(),type:'earn',amount,reason,date:new Date().toISOString().slice(0,10)});
  save(); renderParentBucks();
}

function spendPB(amount, item){
  if(!D.pb || D.pb.balance < amount){ showToast('Not enough Parent Bucks!'); return false; }
  D.pb.balance -= amount;
  D.pb.log.push({id:Date.now(),type:'spend',amount,reason:'Redeemed: '+item,date:new Date().toISOString().slice(0,10)});
  save(); renderParentBucks();
  showToast('🎉 Redeemed: '+item);
  return true;
}

function renderParentBucks(){
  if(!D.pb) initParentBucks();
  const bal = D.pb.balance || 0;

  // Sync all PB balance displays across sections
  ['pbBalance','choresPBBalance','goalsPBBalance','skillsPBBalance','schoolPBBalance','heroPBBalance','phPBBalance'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = bal;
  });

  // Hero PB sub-text
  const heroSub = document.getElementById('heroPBSub');
  if(heroSub){
    const spins = D.pb.spinTickets||0;
    const scratches = D.pb.scratchTickets||0;
    heroSub.textContent = (spins>0||scratches>0) ? `🎰${spins} 🎫${scratches}` : 'Tap to spend';
  }

  // Hero PB status dot
  const dcPB = document.getElementById('dcPBStatus');
  if(dcPB){ dcPB.style.background = bal > 0 ? '#22c55e' : 'rgba(255,255,255,.1)'; }

  // Store items
  const store = document.getElementById('pbStoreItems'); 
  if(store){
    const items = D.pb.storeItems||[];
    if(!items.length){
      store.innerHTML = '<div style="font-size:.65rem;color:var(--tx3);grid-column:1/-1;text-align:center;padding:.5rem;">Parent adds store items in Parent Mode</div>';
    } else {
      store.innerHTML = items.map(it=>`
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(251,191,36,.1);border-radius:8px;padding:.5rem;text-align:center;">
          <div style="font-size:1rem;">${it.emoji||'🎁'}</div>
          <div style="font-size:.65rem;font-weight:700;margin:.15rem 0;">${it.name}</div>
          <div style="font-size:.75rem;font-weight:800;color:#fbbf24;">${it.cost} PB</div>
          <button class="btn bp bs" onclick="spendPB(${it.cost},'${it.name.replace(/'/g,"\\'")}')" style="font-size:.5rem;margin-top:.2rem;padding:.15rem .4rem;${D.pb.balance>=it.cost?'':'opacity:.4;pointer-events:none;'}">Redeem</button>
        </div>
      `).join('');
    }
  }

  // History
  const hist = document.getElementById('pbHistory');
  if(hist){
    const log = (D.pb.log||[]).slice().sort((a,b)=>b.id-a.id).slice(0,10);
    if(!log.length){ hist.innerHTML='<div style="font-size:.6rem;color:var(--tx3);padding:.2rem;">No transactions yet</div>'; }
    else {
      hist.innerHTML = log.map(l=>`<div style="display:flex;justify-content:space-between;padding:.15rem .2rem;font-size:.58rem;border-bottom:1px solid rgba(255,255,255,.02);">
        <span style="color:var(--tx2);">${l.reason}</span>
        <span style="font-weight:700;color:${l.type==='earn'?'#fbbf24':'#fb923c'};">${l.type==='earn'?'+':'-'}${l.amount} PB</span>
      </div>`).join('');
    }
  }
}

function renderGameTickets(){
  if(!D.pb) return;
  const spins = D.pb.spinTickets||0;
  const scratches = D.pb.scratchTickets||0;

  // Sync all spin/scratch displays across sections
  ['spinnerTickets','choreSpinCount','goalsSpinCount','skillsSpinCount','schoolSpinCount','phSpinCount'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent=spins;
  });
  ['scratchTickets','choresScratchCount','goalsScratchCount','skillsScratchCount','schoolScratchCount','phScratchCount'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent=scratches;
  });

  // Hero PB sub-text
  const heroSub = document.getElementById('heroPBSub');
  if(heroSub) heroSub.textContent = (spins>0||scratches>0) ? '🎰'+spins+' 🎫'+scratches : 'Tap to spend';

  // Rewards ticket preview
  const preview = document.getElementById('rewardsTicketPreview');
  if(preview){
    if(spins > 0 || scratches > 0){
      preview.style.display = 'flex';
      preview.innerHTML =
        (spins > 0 ? `<div style="background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:.5rem .9rem;font-size:.8rem;font-weight:700;color:#fbbf24;">🎰 ${spins} Spin${spins!==1?'s':''}</div>` : '') +
        (scratches > 0 ? `<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:.5rem .9rem;font-size:.8rem;font-weight:700;color:#4ade80;">🎫 ${scratches} Scratch${scratches!==1?'es':''}</div>` : '');
    } else {
      preview.style.display = 'none';
      preview.innerHTML = '';
    }
  }
}

// ── REWARD SPINNER ───────────────────────────────────────────
const DEFAULT_SPINNER = [
  {label:'+10 PB',color:'#fde68a',value:10,type:'pb'},
  {label:'+25 PB',color:'#bbf7d0',value:25,type:'pb'},
  {label:'+5 PB',color:'#bfdbfe',value:5,type:'pb'},
  {label:'+50 PB',color:'#fecaca',value:50,type:'pb'},
  {label:'15 min Screen',color:'#e9d5ff',value:15,type:'screen'},
  {label:'+10 PB',color:'#fed7aa',value:10,type:'pb'},
  {label:'30 min Screen',color:'#c7d2fe',value:30,type:'screen'},
  {label:'+100 PB!!',color:'#fef08a',value:100,type:'pb'},
];

let _spinAngle = 0;
let _spinning = false;

function openSpinner(){
  if(!D.pb) initParentBucks();
  if((D.pb.spinTickets||0) <= 0){ showToast('No spins available! Ask a parent to award spins from the Parent Hub.'); return; }
  document.getElementById('spinnerOverlay').style.display = 'flex';
  document.getElementById('spinnerResult').textContent = '';
  document.getElementById('spinnerBtn').disabled = false;
  document.getElementById('spinnerBtn').textContent = '🎰 SPIN!';
  // Defer draw so overlay is visible and canvas has layout dimensions
  requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ drawSpinner(_spinAngle); }); });
}

function closeSpinner(){ document.getElementById('spinnerOverlay').style.display = 'none'; }

function drawSpinner(angle){
  const c = document.getElementById('spinnerCanvas');
  if(!c) return;
  // Use canvas internal resolution (520x520)
  const size = c.width;
  const ctx = c.getContext('2d');
  const cx = size/2, cy = size/2, r = size/2 - 14;
  const slices = (D.pb&&D.pb.spinnerSlices&&D.pb.spinnerSlices.length) ? D.pb.spinnerSlices : DEFAULT_SPINNER;
  const n = slices.length;
  const arc = (Math.PI*2)/n;

  ctx.clearRect(0,0,size,size);

  // Outer glow ring
  const ringGrad = ctx.createRadialGradient(cx,cy,r-4,cx,cy,r+14);
  ringGrad.addColorStop(0,'rgba(253,230,138,.35)');
  ringGrad.addColorStop(1,'rgba(253,230,138,0)');
  ctx.beginPath();
  ctx.arc(cx,cy,r+14,0,Math.PI*2);
  ctx.fillStyle = ringGrad;
  ctx.fill();

  // Outer border ring
  ctx.beginPath();
  ctx.arc(cx,cy,r+6,0,Math.PI*2);
  ctx.strokeStyle = 'rgba(253,230,138,.6)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(angle * Math.PI/180);

  for(let i=0;i<n;i++){
    // Slice fill
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,r,i*arc,(i+1)*arc);
    ctx.closePath();
    // Alternate slight brightness
    ctx.fillStyle = slices[i].color;
    ctx.fill();
    // Divider lines
    ctx.strokeStyle = 'rgba(15,10,30,.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label text
    ctx.save();
    ctx.rotate(i*arc + arc/2);
    ctx.translate(r*0.62, 0);
    ctx.rotate(Math.PI/2);
    ctx.fillStyle = 'rgba(15,10,40,.85)';
    ctx.font = 'bold 11px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Word wrap if needed
    const words = slices[i].label.split(' ');
    if(words.length > 1){
      ctx.fillText(words[0], 0, -6);
      ctx.fillText(words.slice(1).join(' '), 0, 7);
    } else {
      ctx.fillText(slices[i].label, 0, 0);
    }
    ctx.restore();
  }
  ctx.restore();

  // Outer beveled ring decoration (tick marks)
  for(let i=0;i<n*2;i++){
    const a = (i / (n*2)) * Math.PI*2;
    const x1 = cx + Math.cos(a)*(r+2);
    const y1 = cy + Math.sin(a)*(r+2);
    const x2 = cx + Math.cos(a)*(r+7);
    const y2 = cy + Math.sin(a)*(r+7);
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = 'rgba(253,230,138,.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Center hub
  const hubGrad = ctx.createRadialGradient(cx-4,cy-4,2,cx,cy,24);
  hubGrad.addColorStop(0,'#fef3c7');
  hubGrad.addColorStop(.5,'#f59e0b');
  hubGrad.addColorStop(1,'#92400e');
  ctx.beginPath();
  ctx.arc(cx,cy,22,0,Math.PI*2);
  ctx.fillStyle = hubGrad;
  ctx.fill();
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#1a1a2e';
  ctx.font = `bold ${Math.round(size/25)}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPIN', cx, cy);
}

function doSpin(){
  if(_spinning) return;
  if(!D.pb || (D.pb.spinTickets||0) <= 0){ showToast('No spins!'); return; }
  _spinning = true;
  D.pb.spinTickets--;
  save(); renderGameTickets();

  const slices = (D.pb&&D.pb.spinnerSlices&&D.pb.spinnerSlices.length) ? D.pb.spinnerSlices : DEFAULT_SPINNER;
  const n = slices.length;
  const targetIdx = Math.floor(Math.random()*n);
  const extraSpins = 5 + Math.random()*3;
  const targetAngle = _spinAngle + (extraSpins*360) + (360 - (targetIdx*(360/n)) - (360/n)/2);
  const startAngle = _spinAngle;
  const duration = 3500;
  const startTime = Date.now();

  document.getElementById('spinnerBtn').disabled = true;
  document.getElementById('spinnerBtn').textContent = '🎰 Spinning...';
  document.getElementById('spinnerResult').textContent = '';
  const spinCanvas = document.getElementById('spinnerCanvas');
  if(spinCanvas) spinCanvas.style.filter = 'drop-shadow(0 0 18px rgba(253,230,138,.4))';

  function animate(){
    const elapsed = Date.now()-startTime;
    const progress = Math.min(1, elapsed/duration);
    // Ease out cubic
    const ease = 1 - Math.pow(1-progress, 3);
    _spinAngle = startAngle + (targetAngle-startAngle)*ease;
    drawSpinner(_spinAngle);
    if(progress < 1){
      requestAnimationFrame(animate);
    } else {
      _spinning = false;
      _spinAngle = _spinAngle % 360;
      if(spinCanvas) spinCanvas.style.filter = 'drop-shadow(0 0 8px rgba(253,230,138,.2))';
      const prize = slices[targetIdx];
      // Award prize
      if(prize.type === 'pb'){
        earnPB(prize.value, 'Spinner win: '+prize.label);
      } else if(prize.type === 'screen'){
        addScreenTimeReward('games', prize.value);
      }
      const isJackpot = prize.value >= 100 || prize.label.includes('!!');
      document.getElementById('spinnerResult').innerHTML =
        `<div style="font-size:${isJackpot?'2':'1.4'}rem;margin-bottom:.2rem;">${isJackpot?'🏆🎉🏆':'🎉'}</div>
         <div style="color:${prize.color};font-weight:900;font-size:${isJackpot?'1.3':'1.1'}rem;">${isJackpot?'JACKPOT! ':''} ${prize.label}!</div>
         ${isJackpot?'<div style="color:rgba(255,255,255,.5);font-size:.75rem;margin-top:.2rem;">Amazing!</div>':''}`;
      if(typeof launchBigConfetti==='function'){
        isJackpot ? launchBigConfetti() : launchSideConfetti();
      }
      document.getElementById('spinnerBtn').textContent = '✓ Collected!';
    }
  }
  requestAnimationFrame(animate);
}

// ── SCRATCH CARD ─────────────────────────────────────────────
const SCRATCH_SYMBOLS = ['🌟','💎','🔥','💰','🎯','⭐','🏆','💪'];
let _scratchRevealed = [false,false,false];
let _scratchValues   = [];
let _scratchDone     = false;
// Each panel: one offscreen canvas holds the prize, the main canvas holds the scratchable cover
const _scratchPrizeCanvases = [null,null,null];
const _scratchCtxs          = [null,null,null];

function openScratch(){
  if(!D.pb || (D.pb.scratchTickets||0) <= 0){ showToast('No scratch cards!'); return; }
  D.pb.scratchTickets--;
  save(); renderGameTickets();

  document.getElementById('scratchOverlay').style.display = 'flex';
  document.getElementById('scratchResult').innerHTML = '';
  const revBtn = document.getElementById('scratchRevealBtn');
  if(revBtn) revBtn.style.display = 'none';
  _scratchRevealed = [false,false,false];
  _scratchDone = false;
  _scratchStrokes[0] = _scratchStrokes[1] = _scratchStrokes[2] = 0;

  // Pick symbols — 35% win chance
  const win = Math.random() < 0.35;
  if(win){
    const sym = SCRATCH_SYMBOLS[Math.floor(Math.random()*SCRATCH_SYMBOLS.length)];
    _scratchValues = [sym,sym,sym];
  } else {
    const pool = [...SCRATCH_SYMBOLS].sort(()=>Math.random()-.5);
    _scratchValues = [pool[0],pool[1],pool[2]];
    // Prevent accidental 3-of-a-kind
    while(_scratchValues[0]===_scratchValues[1] && _scratchValues[1]===_scratchValues[2])
      _scratchValues[2] = SCRATCH_SYMBOLS[Math.floor(Math.random()*SCRATCH_SYMBOLS.length)];
  }

  // Small delay so overlay is visible before drawing
  setTimeout(()=>{ for(let i=0;i<3;i++) _initScratchCanvas(i); }, 80);
}

function _initScratchCanvas(idx){
  const canvas = document.getElementById('scratch'+idx);
  if(!canvas) return;
  const W = canvas.width, H = canvas.height;

  // Step 1 — draw the prize symbol onto an offscreen canvas
  const prize = document.createElement('canvas');
  prize.width = W; prize.height = H;
  const pCtx = prize.getContext('2d');
  // Dark background
  const bg = pCtx.createRadialGradient(W/2,H/2,8,W/2,H/2,W/2);
  bg.addColorStop(0,'#2d1b69'); bg.addColorStop(1,'#0f0a2e');
  pCtx.fillStyle = bg; pCtx.fillRect(0,0,W,H);
  // Symbol — big and centered
  pCtx.font = '52px sans-serif';
  pCtx.textAlign = 'center'; pCtx.textBaseline = 'middle';
  pCtx.fillText(_scratchValues[idx], W/2, H/2+2);
  _scratchPrizeCanvases[idx] = prize;

  // Step 2 — draw scratchable silver cover on the MAIN canvas
  const ctx = canvas.getContext('2d');
  _scratchCtxs[idx] = ctx;
  ctx.clearRect(0,0,W,H);
  // Silver gradient cover
  const sg = ctx.createLinearGradient(0,0,W,H);
  sg.addColorStop(0,'#4b5563');
  sg.addColorStop(0.35,'#9ca3af');
  sg.addColorStop(0.65,'#d1d5db');
  sg.addColorStop(1,'#6b7280');
  ctx.fillStyle = sg;
  ctx.fillRect(0,0,W,H);
  // Subtle texture lines
  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.lineWidth = 1;
  for(let y=4;y<H;y+=6){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  // "SCRATCH" label
  ctx.fillStyle = 'rgba(15,10,40,.5)';
  ctx.font = 'bold 11px Inter,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SCRATCH', W/2, H/2-7);
  ctx.fillText('HERE ✨', W/2, H/2+9);

  // Step 3 — attach pointer/touch events (replace canvas node to clear old listeners)
  const fresh = canvas.cloneNode(false);
  canvas.parentNode.replaceChild(fresh, canvas);
  const fc = document.getElementById('scratch'+idx);
  const fCtx = fc.getContext('2d');
  _scratchCtxs[idx] = fCtx;
  // Redraw cover on the fresh canvas
  fCtx.fillStyle = sg; fCtx.fillRect(0,0,W,H);
  for(let y=4;y<H;y+=6){ fCtx.beginPath(); fCtx.moveTo(0,y); fCtx.lineTo(W,y); fCtx.stroke(); }
  fCtx.fillStyle='rgba(15,10,40,.5)';
  fCtx.font='bold 11px Inter,sans-serif';
  fCtx.textAlign='center'; fCtx.textBaseline='middle';
  fCtx.fillText('SCRATCH',W/2,H/2-7); fCtx.fillText('HERE ✨',W/2,H/2+9);

  _attachScratchListeners(fc, idx);
}

function _attachScratchListeners(canvas, idx){
  let active = false;
  let lastX = null, lastY = null;

  function getXY(e){
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    const src = e.touches ? e.touches[0] : e;
    return { x:(src.clientX-r.left)*sx, y:(src.clientY-r.top)*sy };
  }

  function doScratch(x, y){
    if(_scratchDone) return;
    const ctx = _scratchCtxs[idx];
    const prize = _scratchPrizeCanvases[idx];
    if(!ctx || !prize) return;

    // Erase a circle from the cover layer
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI*2);
    ctx.fill();

    // If we have a previous point, draw a thick erasing line for smooth strokes
    if(lastX !== null){
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    // Stamp the prize through the erased area using destination-atop
    // Draw prize onto a temp canvas then composite
    const tmp = document.createElement('canvas');
    tmp.width = canvas.width; tmp.height = canvas.height;
    const tCtx = tmp.getContext('2d');
    tCtx.drawImage(prize, 0, 0);
    // Now draw the current scratch state on top with destination-atop so prize shows through holes
    tCtx.globalCompositeOperation = 'destination-in';
    // Get the current cover alpha mask
    const coverData = ctx.getImageData(0,0,canvas.width,canvas.height);
    // We invert: prize should show where cover is transparent
    // Actually simpler: just re-composite directly on canvas
    // Reset: draw prize first, then cover on top
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(prize, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    lastX = x; lastY = y;
    _checkScratchCoverage(idx);
  }

  function onStart(e){ e.preventDefault(); active=true; lastX=null; lastY=null; const p=getXY(e); doScratch(p.x,p.y); }
  function onMove(e){ e.preventDefault(); if(!active) return; const p=getXY(e); doScratch(p.x,p.y); }
  function onEnd(e){ active=false; lastX=null; lastY=null; }

  canvas.addEventListener('mousedown', onStart);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onEnd);
  canvas.addEventListener('mouseleave', onEnd);
  canvas.addEventListener('touchstart', onStart, {passive:false});
  canvas.addEventListener('touchmove', onMove, {passive:false});
  canvas.addEventListener('touchend', onEnd, {passive:false});
}

// Track stroke count per panel — simpler and more reliable than pixel sampling
const _scratchStrokes = [0,0,0];

function _checkScratchCoverage(idx){
  if(_scratchRevealed[idx]) return;
  _scratchStrokes[idx]++;
  // After ~12 strokes on a panel, consider it revealed
  if(_scratchStrokes[idx] >= 12){
    _revealPanel(idx);
  }
  // Also show the "Reveal All" button after first stroke on any panel
  const revBtn = document.getElementById('scratchRevealBtn');
  if(revBtn) revBtn.style.display = 'inline-block';
}

function _revealPanel(idx){
  if(_scratchRevealed[idx]) return;
  _scratchRevealed[idx] = true;
  // Auto-clear the cover so full symbol shows
  const canvas = document.getElementById('scratch'+idx);
  const ctx = _scratchCtxs[idx];
  const prize = _scratchPrizeCanvases[idx];
  if(ctx && canvas){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(prize) ctx.drawImage(prize,0,0);
  }
  _checkAllRevealed();
}

function revealAllPanels(){
  for(let i=0;i<3;i++) _revealPanel(i);
}

function _checkAllRevealed(){
  if(_scratchDone) return;
  if(!_scratchRevealed.every(Boolean)) return;
  _scratchDone = true;
  // Hide reveal button
  const revBtn = document.getElementById('scratchRevealBtn');
  if(revBtn) revBtn.style.display = 'none';

  setTimeout(()=>{
    const win = _scratchValues[0]===_scratchValues[1] && _scratchValues[1]===_scratchValues[2];
    const resultEl = document.getElementById('scratchResult');
    if(win){
      const prize = 25 + Math.floor(Math.random()*76);
      earnPB(prize,'Scratch card win!');
      if(resultEl) resultEl.innerHTML =
        `<div style="font-size:2.5rem;margin-bottom:.3rem;animation:popIn .4s ease;">🎉🎉🎉</div>
         <div style="color:#22c55e;font-weight:900;font-size:1.2rem;">THREE ${_scratchValues[0]}! YOU WIN!</div>
         <div style="color:#4ade80;font-size:.95rem;margin-top:.3rem;font-weight:700;">+${prize} Parent Bucks! 🪙</div>`;
      setTimeout(()=>{ if(typeof launchBigConfetti==='function') launchBigConfetti(); }, 100);
      setTimeout(()=>{ if(typeof launchBigConfetti==='function') launchBigConfetti(); }, 600);
    } else {
      if(resultEl) resultEl.innerHTML =
        '<div style="font-size:1.5rem;margin-bottom:.3rem;">😅</div>' +
        '<div style="color:var(--tx2);font-size:.88rem;">No match this time!</div>' +
        '<div style="color:var(--tx3);font-size:.72rem;margin-top:.2rem;">Keep earning scratch cards!</div>';
    }
    renderParentBucks();
  }, 200);
}

function closeScratch(){
  document.getElementById('scratchOverlay').style.display = 'none';
  _scratchDone = true;
}

// ── GAME TRIGGERS — award spins/scratches on achievements ────
function awardGameTicket(type){
  if(!D.pb) initParentBucks();
  if(type === 'spin'){
    D.pb.spinTickets = (D.pb.spinTickets||0) + 1;
    save(); renderGameTickets();
    celebrateIfNeeded('badge');
    setTimeout(openSpinner, 2000);
  } else if(type === 'scratch'){
    D.pb.scratchTickets = (D.pb.scratchTickets||0) + 1;
    save(); renderGameTickets();
    celebrateIfNeeded('goal');
    setTimeout(openScratch, 2000);
  }
}

// ── PARENT BUCKS STORE MANAGEMENT (Parent Mode) ──────────────
function renderParentBucksControls(){
  const el = document.getElementById('parentPBControls'); if(!el) return;
  if(!D.pb) initParentBucks();

  el.innerHTML = `
    <div style="font-family:var(--fh);font-size:.7rem;letter-spacing:1.5px;color:#fbbf24;margin-bottom:.5rem;">🪙 PARENT BUCKS CONTROLS</div>
    
    <div style="display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:.5rem;">
      <div style="font-size:.68rem;color:var(--tx2);">Balance: <b style="color:#fbbf24;">${D.pb.balance} PB</b></div>
      <div style="font-size:.68rem;color:var(--tx2);">Spins: <b>${D.pb.spinTickets||0}</b></div>
      <div style="font-size:.68rem;color:var(--tx2);">Scratch: <b>${D.pb.scratchTickets||0}</b></div>
    </div>

    <div style="display:grid;grid-template-columns:70px 1fr;gap:.4rem;margin-bottom:.4rem;">
      <input type="number" id="pbAddAmt" placeholder="PB" min="1">
      <input type="text" id="pbAddReason" placeholder="Reason (behavior, bonus, etc.)">
    </div>
    <div style="display:flex;gap:.35rem;margin-bottom:.5rem;">
      <button class="btn bp bs" onclick="parentAddPB()" style="flex:1;">+ Add PB</button>
      <button class="btn bs" onclick="parentDeductPB()" style="flex:1;font-size:.65rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2);">− Deduct PB</button>
    </div>

    <div style="display:flex;gap:.3rem;margin-bottom:.6rem;">
      <button class="btn bgh bs" onclick="if(!D.pb)initParentBucks();D.pb.spinTickets=(D.pb.spinTickets||0)+1;save();renderGameTickets();renderParentBucksControls();showToast('+1 Spin');" style="font-size:.55rem;">+1 Spin 🎰</button>
      <button class="btn bgh bs" onclick="if(!D.pb)initParentBucks();D.pb.scratchTickets=(D.pb.scratchTickets||0)+1;save();renderGameTickets();renderParentBucksControls();showToast('+1 Scratch');" style="font-size:.55rem;">+1 Scratch 🎫</button>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,.05);padding-top:.5rem;">
      <div style="font-size:.6rem;font-weight:700;color:var(--tx2);margin-bottom:.3rem;">STORE ITEMS</div>
      <div style="display:grid;grid-template-columns:45px 1fr 65px;gap:.35rem;margin-bottom:.4rem;">
        <input type="text" id="pbItemEmoji" placeholder="🎁" style="text-align:center;">
        <input type="text" id="pbItemName" placeholder="Item name (e.g. Pizza Night)">
        <input type="number" id="pbItemCost" placeholder="PB" min="1">
      </div>
      <button class="btn bp bs" onclick="addPBStoreItem()" style="font-size:.65rem;width:100%;margin-bottom:.3rem;">+ Add Store Item</button>
      <div id="pbStoreManage" style="max-height:120px;overflow-y:auto;"></div>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,.05);padding-top:.5rem;margin-top:.5rem;">
      <div style="font-size:.6rem;font-weight:700;color:#fde68a;margin-bottom:.3rem;">🎰 SPIN WHEEL SLICES</div>
      <div style="font-size:.55rem;color:var(--tx3);margin-bottom:.4rem;">Customize what kids can win. Leave empty to use the default 8-slice wheel.</div>
      <div id="pbSpinnerSlices" style="max-height:100px;overflow-y:auto;margin-bottom:.4rem;"></div>
      <div style="display:grid;grid-template-columns:1fr 60px 80px;gap:.3rem;margin-bottom:.3rem;">
        <input type="text" id="newSliceLabel" placeholder="Label (e.g. +50 PB)" style="font-size:.65rem;">
        <input type="number" id="newSliceValue" placeholder="Amt" min="0" style="font-size:.65rem;">
        <select id="newSliceType" style="font-size:.6rem;background:var(--s2);color:var(--tx);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:.2rem;">
          <option value="pb">PB</option>
          <option value="screen">Screen Min</option>
        </select>
      </div>
      <div style="display:flex;gap:.3rem;">
        <button class="btn bp bs" onclick="addSpinnerSlice()" style="flex:1;font-size:.6rem;">+ Add Slice</button>
        <button class="btn bs" onclick="resetSpinnerToDefault()" style="font-size:.55rem;color:var(--tx3);">Reset Default</button>
      </div>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,.05);padding-top:.5rem;margin-top:.5rem;">
      <div style="font-size:.6rem;font-weight:700;color:var(--tx2);margin-bottom:.3rem;">GAME TRIGGERS (auto-award spins/scratches)</div>
      <div style="font-size:.58rem;color:var(--tx2);line-height:1.5;">
        ✅ Chore verified → +5 PB + chance of spin<br>
        🧠 Quiz passed → +10 PB + scratch card<br>
        🏅 Badge earned → spin ticket<br>
        📚 Book finished → +15 PB<br>
        🎯 Goal completed → scratch card<br>
        ✝️ Scripture read → +2 PB
      </div>
    </div>
  `;

  // Render store management list
  const manage = document.getElementById('pbStoreManage');
  if(manage){
    const items = D.pb.storeItems||[];
    manage.innerHTML = items.map((it,i)=>`<div style="display:flex;align-items:center;gap:.3rem;padding:.15rem 0;font-size:.6rem;border-bottom:1px solid rgba(255,255,255,.02);">
      <span>${it.emoji||'🎁'}</span>
      <span style="flex:1;">${it.name}</span>
      <span style="color:#fbbf24;font-weight:700;">${it.cost} PB</span>
      <button class="btn bda bs" onclick="removePBStoreItem(${i})" style="font-size:.4rem;padding:.1rem .2rem;">✕</button>
    </div>`).join('') || '<div style="font-size:.55rem;color:var(--tx3);">No items yet</div>';
  }

  // Spinner slices section
  const spinManage = document.getElementById('pbSpinnerSlices');
  if(spinManage){
    const slices = D.pb.spinnerSlices||[];
    spinManage.innerHTML = slices.length ? slices.map((s,i)=>`<div style="display:flex;align-items:center;gap:.3rem;padding:.15rem 0;font-size:.6rem;border-bottom:1px solid rgba(255,255,255,.02);">
      <div style="width:12px;height:12px;border-radius:3px;background:${s.color||'#fde68a'};flex-shrink:0;"></div>
      <span style="flex:1;">${s.label} (${s.type==='pb'?s.value+' PB':s.value+' min screen'})</span>
      <button onclick="removeSpinnerSlice(${i})" style="font-size:.5rem;color:#f87171;background:none;border:none;cursor:pointer;">✕</button>
    </div>`).join('') : '<div style="font-size:.55rem;color:var(--tx3);">Using default 8-slice wheel</div>';
  }
}

function addSpinnerSlice(){
  if(!D.pb) initParentBucks();
  if(!D.pb.spinnerSlices) D.pb.spinnerSlices=[];
  const label=(document.getElementById('newSliceLabel')||{}).value?.trim();
  const val=parseFloat((document.getElementById('newSliceValue')||{}).value)||0;
  const type=(document.getElementById('newSliceType')||{}).value||'pb';
  if(!label){showToast('Enter a label');return;}
  const colors=['#fde68a','#bbf7d0','#bfdbfe','#fecaca','#e9d5ff','#fed7aa','#c7d2fe','#fef08a','#a7f3d0','#fbcfe8'];
  D.pb.spinnerSlices.push({label,value:val,type,color:colors[D.pb.spinnerSlices.length%colors.length]});
  save();renderParentBucksControls();showToast('Slice added to wheel!');
}

function removeSpinnerSlice(i){
  if(!D.pb||!D.pb.spinnerSlices)return;
  D.pb.spinnerSlices.splice(i,1);
  save();renderParentBucksControls();showToast('Slice removed');
}

function resetSpinnerToDefault(){
  if(!D.pb)initParentBucks();
  D.pb.spinnerSlices=[];
  save();renderParentBucksControls();showToast('Reset to default wheel');
}

function parentAddPB(){
  const amt = parseInt((document.getElementById('pbAddAmt')||{}).value)||0;
  const reason = (document.getElementById('pbAddReason')||{}).value.trim()||'Bonus';
  if(amt <= 0){ showToast('Enter amount'); return; }
  earnPB(amt, reason);
  if(document.getElementById('pbAddReason')) document.getElementById('pbAddReason').value = '';
  renderParentBucksControls();
  showToast('+'+amt+' PB added');
}

function parentDeductPB(){
  const amt = parseInt(prompt('How many Parent Bucks to deduct?'))||0;
  if(amt <= 0) return;
  const reason = prompt('Reason for deduction:')||'Deduction';
  if(!D.pb) initParentBucks();
  D.pb.balance = Math.max(0, D.pb.balance - amt);
  D.pb.log.push({id:Date.now(),type:'deduct',amount:amt,reason:'⛔ '+reason,date:new Date().toISOString().slice(0,10)});
  save(); renderParentBucks(); renderParentBucksControls();
  logActivity('deduction', 'Parent deducted '+amt+' PB: '+reason);
  showToast('−'+amt+' PB deducted');
}

function parentDeductEarning(){
  const amt = parseFloat(prompt('How much to deduct ($)?'))||0;
  if(amt <= 0) return;
  const reason = prompt('Reason for deduction:')||'Deduction';
  if(!D.earnings) initEarnings();
  D.earnings.balance = Math.max(0, D.earnings.balance - amt);
  D.earnings.log.push({id:Date.now(),amount:amt,reason:'⛔ '+reason,date:new Date().toISOString().slice(0,10),type:'deduct'});
  save(); renderEarnings(); renderParentEarningsControls();
  logActivity('deduction', 'Parent deducted $'+amt.toFixed(2)+': '+reason);
  showToast('−$'+amt.toFixed(2)+' deducted');
}

function deductScreenTime(){
  const cat = prompt('Which category? (games, tv, phone, tablet):');
  if(!cat || !['games','tv','phone','tablet'].includes(cat.toLowerCase())){ showToast('Invalid category'); return; }
  const mins = parseInt(prompt('How many minutes to deduct?'))||0;
  if(mins <= 0) return;
  if(!D.screenTime) D.screenTime = {};
  if(!D.screenTime[cat.toLowerCase()]) D.screenTime[cat.toLowerCase()] = {earned:0,used:0};
  D.screenTime[cat.toLowerCase()].earned = Math.max(0, D.screenTime[cat.toLowerCase()].earned - mins);
  save(); renderScreenTime(); renderParentScreenControls();
  logActivity('deduction', 'Parent deducted '+mins+' min '+cat+' screen time');
  showToast('−'+mins+' min deducted from '+cat);
}

function addPBStoreItem(){
  if(!D.pb) initParentBucks();
  const emoji = (document.getElementById('pbItemEmoji')||{}).value||'🎁';
  const name = (document.getElementById('pbItemName')||{}).value.trim();
  const cost = parseInt((document.getElementById('pbItemCost')||{}).value)||0;
  if(!name||!cost){ showToast('Name and cost required'); return; }
  if(!D.pb.storeItems) D.pb.storeItems = [];
  D.pb.storeItems.push({emoji,name,cost});
  save(); renderParentBucks(); renderParentBucksControls();
  if(document.getElementById('pbItemName')) document.getElementById('pbItemName').value = '';
  showToast(name+' added to store');
}

function removePBStoreItem(idx){
  if(!D.pb||!D.pb.storeItems) return;
  D.pb.storeItems.splice(idx,1);
  save(); renderParentBucks(); renderParentBucksControls();
}

// ── INTEGRATE PB INTO EXISTING REWARD TRIGGERS ───────────────
// Override/extend verifyChore to award PB and chance of spin
const _origVerifyChore = typeof verifyChore === 'function' ? verifyChore : null;

function hookRewardTriggers(){
  // Hook into markScriptureRead to award PB
  const origMSR = window.markScriptureRead;
  if(origMSR){
    window.markScriptureRead = function(){
      origMSR();
      earnPB(2, 'Scripture reading');
    };
  }
  // Make showCelebration globally accessible for manual triggers
  window.showCelebration = showCelebration;
  window.celebrateIfNeeded = celebrateIfNeeded;
}

// ── PARENT QUIZ SYSTEM ───────────────────────────────────────
function initQuizSystem(){
  if(!D.quizzes) D.quizzes = [];
  if(!D.quizResults) D.quizResults = [];
  renderQuizNotification();
}

// Pre-built question banks
const QUIZ_BANK = {
  'bible-ot':[
    {q:'Who built the ark?',a:'Noah',opts:['Moses','Noah','Abraham','David']},
    {q:'How many days did God take to create the world?',a:'6',opts:['5','6','7','4']},
    {q:'Who was the first man?',a:'Adam',opts:['Noah','Adam','Abraham','Moses']},
    {q:'Who killed Goliath?',a:'David',opts:['Saul','David','Solomon','Joshua']},
    {q:'What sea did Moses part?',a:'Red Sea',opts:['Dead Sea','Red Sea','Mediterranean','Sea of Galilee']},
    {q:'How many plagues were sent on Egypt?',a:'10',opts:['7','10','12','5']},
    {q:'Who was swallowed by a great fish?',a:'Jonah',opts:['Jonah','Daniel','Elijah','Job']},
    {q:'What were the first 5 books of the Bible called?',a:'The Pentateuch',opts:['The Gospels','The Pentateuch','The Psalms','The Prophets']},
    {q:'Who was sold into slavery by his brothers?',a:'Joseph',opts:['Jacob','Joseph','Benjamin','Judah']},
    {q:'What did God give Moses on Mount Sinai?',a:'The Ten Commandments',opts:['The Ark','The Ten Commandments','A sword','A crown']},
  ],
  'bible-nt':[
    {q:'Where was Jesus born?',a:'Bethlehem',opts:['Jerusalem','Nazareth','Bethlehem','Galilee']},
    {q:'How many apostles did Jesus choose?',a:'12',opts:['10','12','7','3']},
    {q:'Who baptized Jesus?',a:'John the Baptist',opts:['Peter','John the Baptist','Paul','James']},
    {q:'What was Jesus\' first miracle?',a:'Turning water into wine',opts:['Healing a blind man','Walking on water','Turning water into wine','Feeding 5000']},
    {q:'Who betrayed Jesus?',a:'Judas',opts:['Peter','Judas','Thomas','James']},
    {q:'How many days after His death did Jesus rise?',a:'3',opts:['1','3','7','40']},
    {q:'Who wrote the most books in the New Testament?',a:'Paul',opts:['Luke','Paul','John','Peter']},
    {q:'What is the last book of the Bible?',a:'Revelation',opts:['Jude','Revelation','Acts','Romans']},
    {q:'On what day did the Holy Spirit come?',a:'Pentecost',opts:['Passover','Pentecost','Sabbath','Easter']},
    {q:'Who denied Jesus three times?',a:'Peter',opts:['Peter','John','Thomas','James']},
  ],
  'bible-verses':[
    {q:'"For God so loved the world..." is found in:',a:'John 3:16',opts:['Romans 8:28','John 3:16','Psalm 23:1','Jeremiah 29:11']},
    {q:'"I can do all things through Christ..." is from:',a:'Philippians 4:13',opts:['Philippians 4:13','Romans 8:28','Psalm 46:10','Isaiah 40:31']},
    {q:'"The Lord is my shepherd" begins which Psalm?',a:'Psalm 23',opts:['Psalm 23','Psalm 91','Psalm 119','Psalm 1']},
    {q:'"Trust in the Lord with all your heart" is from:',a:'Proverbs 3:5',opts:['Proverbs 3:5','Psalm 37:4','Isaiah 41:10','Jeremiah 29:11']},
    {q:'"Be strong and courageous" was said to:',a:'Joshua',opts:['David','Moses','Joshua','Gideon']},
    {q:'"In the beginning God created..." starts which book?',a:'Genesis',opts:['Genesis','John','Matthew','Exodus']},
    {q:'"The fruit of the Spirit is love, joy, peace..." is in:',a:'Galatians 5',opts:['Romans 12','Galatians 5','Ephesians 4','Colossians 3']},
    {q:'"Faith without works is dead" is from:',a:'James',opts:['Romans','Hebrews','James','1 Peter']},
  ],
  'ls-money':[
    {q:'What is compound interest?',a:'Interest earned on interest',opts:['A bank fee','Interest earned on interest','A type of loan','A tax']},
    {q:'What is a credit score range?',a:'300-850',opts:['0-100','300-850','100-500','500-1000']},
    {q:'What percentage of income should go to savings?',a:'At least 20%',opts:['5%','At least 20%','50%','1%']},
    {q:'What is a 401k?',a:'Retirement savings account',opts:['Checking account','Retirement savings account','Credit card','Insurance']},
    {q:'Which costs more over time: renting or financing a car?',a:'It depends on the terms',opts:['Always renting','Always financing','It depends on the terms','They cost the same']},
  ],
  'ls-cooking':[
    {q:'What temperature kills most food bacteria?',a:'165°F (74°C)',opts:['100°F','165°F (74°C)','200°F','140°F']},
    {q:'How long can leftovers safely stay in the fridge?',a:'3-4 days',opts:['1 day','3-4 days','2 weeks','1 week']},
    {q:'What is cross-contamination?',a:'Spreading bacteria between foods',opts:['Mixing flavors','Spreading bacteria between foods','Overcooking','Undercooking']},
    {q:'What oil has the highest smoke point for frying?',a:'Avocado oil',opts:['Olive oil','Butter','Avocado oil','Coconut oil']},
    {q:'What does "al dente" mean for pasta?',a:'Firm to the bite',opts:['Overcooked','Firm to the bite','Raw','Mushy']},
  ],
  'ls-emergency':[
    {q:'What number do you call for emergencies in the US?',a:'911',opts:['411','911','311','711']},
    {q:'What is the first step if someone is choking?',a:'Ask if they can cough',opts:['Call 911 immediately','Give water','Ask if they can cough','Hit their back']},
    {q:'When performing CPR, how deep should compressions be?',a:'2 inches',opts:['1 inch','2 inches','4 inches','Half inch']},
    {q:'What does the "R" in RICE stand for (injury treatment)?',a:'Rest',opts:['Run','Rest','Repeat','Recover']},
    {q:'What should you do first in a house fire?',a:'Get out, then call 911',opts:['Find the fire','Get out, then call 911','Get your phone','Hide in bathroom']},
  ],
  'gu-safety':[
    {q:'What is the #1 killer of teens on the road?',a:'Distracted driving',opts:['Speeding','Drunk driving','Distracted driving','Weather']},
    {q:'How long does it take to refocus after checking your phone?',a:'23 minutes',opts:['5 seconds','23 minutes','1 minute','5 minutes']},
    {q:'What BAC level means zero tolerance for under 21?',a:'0.00-0.02',opts:['0.08','0.05','0.00-0.02','0.04']},
    {q:'What percentage of counterfeit pills contain fentanyl?',a:'60%',opts:['10%','30%','60%','90%']},
    {q:'How many hours of sleep do teens need?',a:'8-10 hours',opts:['5-6','6-7','8-10','12+']},
  ],
  'gu-relationships':[
    {q:'What is the most important quality in a real friendship?',a:'Trust and consistency',opts:['Having fun','Trust and consistency','Same interests','Popularity']},
    {q:'What is a healthy response when someone sets a boundary?',a:'Respect it',opts:['Argue','Ignore it','Respect it','Test it']},
    {q:'What does consent require?',a:'Clear, voluntary, ongoing agreement',opts:['Silence','Pressure','Clear, voluntary, ongoing agreement','One-time permission']},
    {q:'What is the 70/30 rule of communication?',a:'Listen 70%, talk 30%',opts:['Talk 70%, listen 30%','Listen 70%, talk 30%','50/50 split','Text 70%, talk 30%']},
    {q:'"Iron sharpens iron" refers to what?',a:'Good friends push each other to grow',opts:['Competition','Fighting','Good friends push each other to grow','Blacksmithing']},
  ],
};

let _quizCustomQs = [];
let _activeQuiz = null;
let _quizIdx = 0;
let _quizScore = 0;

function addQuizQuestion(){
  const idx = _quizCustomQs.length;
  _quizCustomQs.push({q:'',a:'',opts:['','','','']});
  renderCustomQuestions();
}

function renderCustomQuestions(){
  const el = document.getElementById('pqQuestions'); if(!el) return;
  el.innerHTML = _quizCustomQs.map((q,i)=>`
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:.5rem;margin-bottom:.4rem;">
      <div style="display:flex;justify-content:space-between;margin-bottom:.2rem;">
        <span style="font-size:.6rem;font-weight:700;color:var(--tx2);">Q${i+1}</span>
        <button onclick="_quizCustomQs.splice(${i},1);renderCustomQuestions();" style="font-size:.45rem;color:var(--tx3);background:none;border:none;cursor:pointer;">✕</button>
      </div>
      <input type="text" placeholder="Question" value="${q.q.replace(/"/g,'&quot;')}" onchange="_quizCustomQs[${i}].q=this.value" style="margin-bottom:.25rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.25rem;">
        <input type="text" placeholder="✅ Correct answer" value="${q.opts[0].replace(/"/g,'&quot;')}" onchange="_quizCustomQs[${i}].opts[0]=this.value;_quizCustomQs[${i}].a=this.value" style="border-color:rgba(34,197,94,.3);">
        <input type="text" placeholder="Wrong answer 2" value="${q.opts[1].replace(/"/g,'&quot;')}" onchange="_quizCustomQs[${i}].opts[1]=this.value">
        <input type="text" placeholder="Wrong answer 3" value="${q.opts[2].replace(/"/g,'&quot;')}" onchange="_quizCustomQs[${i}].opts[2]=this.value">
        <input type="text" placeholder="Wrong answer 4" value="${q.opts[3].replace(/"/g,'&quot;')}" onchange="_quizCustomQs[${i}].opts[3]=this.value">
      </div>
    </div>
  `).join('');
}

// ── PARENT HUB CHILD SELECTOR ────────────────────────────────
function populateParentChildSelect(){
  const sel = document.getElementById('parentChildSelect'); if(!sel) return;
  sel.innerHTML = '';
  if(_profiles && _profiles.length > 0){
    _profiles.forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name + (p.id === _activeProfileId ? ' (active)' : '');
      opt.selected = p.id === _activeProfileId;
      sel.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = 'current';
    opt.textContent = D.name || 'Current Child';
    sel.appendChild(opt);
  }
}

function switchParentView(profileId){
  if(!_profiles || !_profiles.length) return;
  const profile = _profiles.find(p=>p.id === profileId);
  if(!profile) return;
  
  // Switch active profile to view their data
  _activeProfileId = profile.id;
  D = profile.data || {};
  
  // Re-render all parent dashboard components
  renderParentDashboard();
  showToast('Viewing: ' + profile.name);
}

function renderParentDashboard(){ renderParentDash(); }

// ── PARENT HUB NAVIGATION ──
// ── PARENT HUB REWARDS TAB ───────────────────────────────────
function renderPhRewards(){
  if(!D.pb) initParentBucks();
  // Balance displays
  const phPB = document.getElementById('phPBBalance');
  const phSp = document.getElementById('phSpinCount');
  const phSc = document.getElementById('phScratchCount');
  if(phPB) phPB.textContent = D.pb.balance||0;
  if(phSp) phSp.textContent = D.pb.spinTickets||0;
  if(phSc) phSc.textContent = D.pb.scratchTickets||0;
  // Store list
  renderPhStoreList();
  // History
  renderPhPBHistory();
}

function phQuickAward(amount, reason){
  earnPB(amount, reason);
  renderPhRewards();
  showToast('+'+amount+' PB awarded! 🪙');
  if(typeof launchSideConfetti==='function') launchSideConfetti();
  const msg = document.getElementById('phAwardMsg');
  if(msg){ msg.style.color='#22c55e'; msg.textContent='✅ +'+amount+' PB awarded for: '+reason; setTimeout(()=>msg.textContent='',3000); }
}

function phAwardTicket(type, count){
  if(!D.pb) initParentBucks();
  if(type==='spin'){
    D.pb.spinTickets = (D.pb.spinTickets||0) + count;
    showToast('+'+count+' Spin'+(count>1?'s':'')+' awarded! 🎰');
  } else {
    D.pb.scratchTickets = (D.pb.scratchTickets||0) + count;
    showToast('+'+count+' Scratch Card'+(count>1?'s':'')+' awarded! 🎫');
  }
  save(); renderGameTickets(); renderPhRewards();
}

function phCustomAward(){
  if(!D.pb) initParentBucks();
  const cat = document.getElementById('phAwardCat').value;
  const pb = parseInt(document.getElementById('phAwardPB').value)||0;
  const spins = parseInt(document.getElementById('phAwardSpins').value)||0;
  const scratches = parseInt(document.getElementById('phAwardScratches').value)||0;
  const note = (document.getElementById('phAwardNote').value||'').trim();
  const catLabels = {behavior:'Good Behavior',chores:'Chores/Helping',school:'School/Grades',reading:'Reading',sports:'Sports/Practice',faith:'Faith/Church',kindness:'Kindness',goals:'Goals',special:'Special Occasion',custom:'Custom'};
  const reason = note || catLabels[cat] || cat;
  const msg = document.getElementById('phAwardMsg');

  if(pb<=0 && spins<=0 && scratches<=0){ if(msg){msg.style.color='#f87171';msg.textContent='Enter at least one reward amount.';} return; }

  if(pb>0) earnPB(pb, reason);
  if(spins>0){ D.pb.spinTickets=(D.pb.spinTickets||0)+spins; }
  if(scratches>0){ D.pb.scratchTickets=(D.pb.scratchTickets||0)+scratches; }
  save(); renderGameTickets(); renderPhRewards();

  const parts = [];
  if(pb>0) parts.push('+'+pb+' PB');
  if(spins>0) parts.push('+'+spins+' Spin'+(spins>1?'s':''));
  if(scratches>0) parts.push('+'+scratches+' Scratch'+(scratches>1?' Cards':' Card'));
  if(msg){ msg.style.color='#22c55e'; msg.textContent='✅ Awarded: '+parts.join(', ')+' for '+reason; setTimeout(()=>msg.textContent='',4000); }

  showToast('🎁 Awarded: '+parts.join(', '));
  if(typeof launchSideConfetti==='function') launchSideConfetti();
  // Reset inputs
  document.getElementById('phAwardPB').value='10';
  document.getElementById('phAwardSpins').value='0';
  document.getElementById('phAwardScratches').value='0';
  document.getElementById('phAwardNote').value='';
}

function phDeductPB(){
  if(!D.pb) initParentBucks();
  const amt = parseInt(document.getElementById('phDeductAmt').value)||0;
  const reason = (document.getElementById('phDeductReason').value||'Parent deduction').trim();
  const msg = document.getElementById('phDeductMsg');
  if(amt<=0){ if(msg){msg.style.color='#f87171';msg.textContent='Enter a valid amount.';} return; }
  D.pb.balance = Math.max(0, (D.pb.balance||0) - amt);
  D.pb.log.push({id:Date.now(),type:'deduct',amount:amt,reason,date:new Date().toISOString().slice(0,10)});
  save(); renderParentBucks(); renderPhRewards();
  if(msg){ msg.style.color='#f87171'; msg.textContent='➖ Deducted '+amt+' PB: '+reason; setTimeout(()=>msg.textContent='',3000); }
  showToast('➖ '+amt+' PB deducted');
}

function phAddStorePreset(emoji, name, cost){
  if(!D.pb) initParentBucks();
  if(!D.pb.storeItems) D.pb.storeItems=[];
  // Don't add duplicates
  if(D.pb.storeItems.find(i=>i.name===name)){ showToast('Already in store!'); return; }
  D.pb.storeItems.push({id:Date.now(),emoji,name,cost,active:true});
  save(); renderPhStoreList(); renderParentBucks();
  showToast('🏪 '+emoji+' '+name+' added to store!');
}

function phAddStoreItem(){
  const emoji = (document.getElementById('phStoreEmoji').value||'🎁').trim();
  const name = (document.getElementById('phStoreName').value||'').trim();
  const cost = parseInt(document.getElementById('phStoreCost').value)||50;
  if(!name){ showToast('Enter an item name'); return; }
  if(!D.pb) initParentBucks();
  if(!D.pb.storeItems) D.pb.storeItems=[];
  D.pb.storeItems.push({id:Date.now(),emoji,name,cost,active:true});
  save(); renderPhStoreList(); renderParentBucks();
  document.getElementById('phStoreEmoji').value='';
  document.getElementById('phStoreName').value='';
  document.getElementById('phStoreCost').value='';
  showToast('🏪 '+emoji+' '+name+' added!');
}

function phRemoveStoreItem(id){
  if(!D.pb||!D.pb.storeItems) return;
  D.pb.storeItems = D.pb.storeItems.filter(i=>i.id!==id);
  save(); renderPhStoreList(); renderParentBucks();
}

function renderPhStoreList(){
  const el = document.getElementById('phStoreList'); if(!el) return;
  const items = (D.pb&&D.pb.storeItems)||[];
  if(!items.length){ el.innerHTML='<div style="font-size:.65rem;color:var(--tx3);padding:.3rem;">No store items yet — add presets above or create custom items.</div>'; return; }
  el.innerHTML = items.map(it=>`
    <div style="display:flex;align-items:center;gap:.5rem;padding:.35rem .5rem;background:rgba(255,255,255,.03);border-radius:8px;margin-bottom:.25rem;">
      <span style="font-size:1rem;">${it.emoji||'🎁'}</span>
      <span style="flex:1;font-size:.75rem;">${it.name}</span>
      <span style="font-size:.75rem;font-weight:700;color:#fbbf24;">${it.cost} PB</span>
      <button onclick="phRemoveStoreItem(${it.id})" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:.8rem;padding:0 .2rem;">✕</button>
    </div>
  `).join('');
}

function renderPhPBHistory(){
  const el = document.getElementById('phPBHistory'); if(!el) return;
  const log = ((D.pb&&D.pb.log)||[]).slice().sort((a,b)=>b.id-a.id).slice(0,20);
  if(!log.length){ el.innerHTML='<div style="font-size:.65rem;color:var(--tx3);">No transactions yet.</div>'; return; }
  el.innerHTML = log.map(l=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.68rem;">
      <div>
        <span style="color:var(--tx2);">${l.reason||'—'}</span>
        <span style="color:var(--tx3);font-size:.6rem;margin-left:.4rem;">${l.date||''}</span>
      </div>
      <span style="font-weight:700;color:${l.type==='earn'?'#22c55e':'#f87171'};white-space:nowrap;">${l.type==='earn'?'+':'-'}${l.amount} PB</span>
    </div>
  `).join('');
}

function renderPhPendingChores(){
  const el = document.getElementById('phPendingList');
  const badge = document.getElementById('phPendingBadge');
  if(!el) return;
  const pending = (D.choreLog||[]).filter(l=>l.status==='pending').sort((a,b)=>b.id-a.id);
  if(badge){ badge.textContent = pending.length; badge.style.display = pending.length ? 'inline-block' : 'none'; }
  // Also update the nav item badge
  const navBadge = document.getElementById('phChoreNavBadge');
  if(navBadge){ navBadge.textContent = pending.length; navBadge.style.display = pending.length ? 'inline-block' : 'none'; }
  if(!pending.length){
    el.innerHTML = '<div style="font-size:.72rem;color:var(--tx3);padding:.4rem 0;">No pending chores — all caught up! ✅</div>';
    return;
  }
  el.innerHTML = pending.map(p=>`
    <div style="display:flex;align-items:center;gap:.5rem;padding:.55rem .7rem;background:rgba(251,191,36,.04);border:1px solid rgba(251,191,36,.12);border-radius:10px;margin-bottom:.35rem;">
      <span style="font-size:1.1rem;">${p.emoji||'📌'}</span>
      <div style="flex:1;">
        <div style="font-size:.78rem;font-weight:700;color:var(--tx);">${p.choreName}</div>
        <div style="font-size:.6rem;color:var(--tx2);">${p.date} at ${p.time} · <span style="color:#fbbf24;font-weight:700;">${p.pts} pts</span> · <span style="color:#22c55e;">+${p.pts} PB if verified</span></div>
      </div>
      <div style="display:flex;gap:.3rem;flex-shrink:0;">
        <button onclick="phVerifyChore(${p.id},true)" style="background:#22c55e;border:none;color:#fff;font-weight:800;font-size:.68rem;padding:.35rem .65rem;border-radius:7px;cursor:pointer;">✓ Verify</button>
        <button onclick="phVerifyChore(${p.id},false)" style="background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.25);color:#f87171;font-weight:700;font-size:.68rem;padding:.35rem .65rem;border-radius:7px;cursor:pointer;">✕ Reject</button>
      </div>
    </div>
  `).join('');
}

function phVerifyChore(logId, approved){
  verifyChore(logId, approved);
  // Re-render both the parent hub pending list and the overall chore section
  renderPhPendingChores();
  renderPhRewards();
  updateHeroDashboard();
}

