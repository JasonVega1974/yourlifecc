/* =============================================================
   chores.js — Chore system, rewards store, screen time manager,
               earnings & savings jar, allowance
============================================================= */

// ── CHORES & REWARDS SYSTEM ──────────────────────────────────
let _parentMode = false;
const CHORE_LEVELS = [
  {level:1,name:'Beginner',min:0,max:100},
  {level:2,name:'Helper',min:100,max:250},
  {level:3,name:'Contributor',min:250,max:500},
  {level:4,name:'Rockstar',min:500,max:1000},
  {level:5,name:'Champion',min:1000,max:2000},
  {level:6,name:'Legend',min:2000,max:5000},
  {level:7,name:'Master',min:5000,max:10000},
  {level:8,name:'GOAT',min:10000,max:999999},
];

const CHORE_CAT_EMOJI = {cleaning:'🧹',kitchen:'🍽️',laundry:'👕',outdoor:'🌿',pets:'🐕',academic:'📚',personal:'🧑',family:'👪',other:'📌'};

function initChoreData(){
  if(!D.chores) D.chores=[];
  if(!Array.isArray(D.chores)) D.chores=[];
  if(!D.rewards) D.rewards=[];
  if(!D.choreLog) D.choreLog=[];
  // Handle legacy where chorePoints was stored as a number instead of {total,spent}
  if(!D.chorePoints || typeof D.chorePoints !== 'object'){
    const legacy = typeof D.chorePoints === 'number' ? D.chorePoints : 0;
    D.chorePoints = {total: legacy, spent: 0};
  }
  if(D.chorePoints.total === undefined) D.chorePoints.total = 0;
  if(D.chorePoints.spent === undefined) D.chorePoints.spent = 0;
  if(!D.chorePin) D.chorePin='';
}


function addChore(){
  initChoreData();
  const name = document.getElementById('choreNewName').value.trim();
  if(!name){ showToast('Enter a chore name'); return; }
  const pts = parseInt(document.getElementById('choreNewPts').value)||10;
  const freq = document.getElementById('choreNewFreq').value;
  const cat = document.getElementById('choreNewCat').value;
  D.chores.push({id:Date.now(), name, pts, freq, cat, emoji:CHORE_CAT_EMOJI[cat]||'📌', active:true});
  document.getElementById('choreNewName').value='';
  document.getElementById('choreNewPts').value='';
  save(); renderChores();
  showToast('Chore added ✓');
}


function toggleChoreActive(id){
  const chore = (Array.isArray(D.chores)?D.chores:[]).find(c=>c.id===id);
  if(chore){ chore.active = !chore.active; save(); renderChores(); }
}

function markChoreDone(id){
  initChoreData();
  const chore = (Array.isArray(D.chores)?D.chores:[]).find(c=>c.id===id);
  if(!chore) return;
  const today = new Date().toISOString().slice(0,10);
  // Check if already done today
  const already = D.choreLog.find(l=>l.choreId===id && l.date===today && (l.status==='done'||l.status==='pending'));
  if(already){ showToast('Already submitted today'); return; }
  D.choreLog.push({
    id:Date.now(), choreId:id, choreName:chore.name, pts:chore.pts,
    date:today, time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'}),
    status:'pending', emoji:chore.emoji
  });
  save(); renderChores();
  showToast('Submitted for verification ✓');
}

function verifyChore(logId, approved){
  initChoreData();
  const entry = D.choreLog.find(l=>l.id===logId);
  if(!entry) return;
  if(approved){
    entry.status='verified';
    D.chorePoints.total += entry.pts;
    // Award Parent Bucks — 1 PB per chore point
    earnPB(entry.pts, 'Chore completed: '+entry.choreName);
    // Every 3rd verified chore earns a spin ticket
    const totalVerified = D.choreLog.filter(l=>l.status==='verified').length;
    if(totalVerified % 3 === 0){
      if(!D.pb) initParentBucks();
      D.pb.spinTickets = (D.pb.spinTickets||0) + 1;
      save(); renderGameTickets();
      showToast(`+${entry.pts} PB verified ✓ 🪙 +1 Spin earned! 🎰`);
    } else {
      showToast(`+${entry.pts} PB verified ✓ 🪙`);
    }
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
  } else {
    entry.status='rejected';
    showToast('Chore rejected');
  }
  save(); renderChores(); updateHeroDashboard(); updateDashCards();
}

function addReward(){
  initChoreData();
  const name = document.getElementById('rewardNewName').value.trim();
  if(!name){ showToast('Enter a reward name'); return; }
  const pts = parseInt(document.getElementById('rewardNewPts').value)||50;
  D.rewards.push({id:Date.now(), name, pts, active:true});
  document.getElementById('rewardNewName').value='';
  document.getElementById('rewardNewPts').value='';
  save(); renderChores();
  showToast('Reward added ✓');
}

function removeReward(id){
  D.rewards = (Array.isArray(D.rewards)?D.rewards:[]).filter(r=>r.id!==id); save(); renderChores();
}

function redeemReward(id){
  initChoreData();
  const reward = (Array.isArray(D.rewards)?D.rewards:[]).find(r=>r.id===id);
  if(!reward) return;
  const avail = D.chorePoints.total - D.chorePoints.spent;
  if(avail < reward.pts){ showToast(`Need ${reward.pts - avail} more points`); return; }
  D.chorePoints.spent += reward.pts;
  D.choreLog.push({
    id:Date.now(), choreId:null, choreName:'🎁 Redeemed: '+reward.name,
    pts:-reward.pts, date:new Date().toISOString().slice(0,10),
    time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'}),
    status:'redeemed', emoji:'🎁'
  });
  save(); renderChores();
  showToast(`Redeemed: ${reward.name} 🎉`);
}

function getChoreStreak(){
  initChoreData();
  const verified = D.choreLog.filter(l=>l.status==='verified');
  if(!verified.length) return 0;
  const dates = [...new Set(verified.map(l=>l.date))].sort().reverse();
  let streak = 0;
  const today = new Date();
  for(let i=0;i<dates.length;i++){
    const expected = new Date(today);
    expected.setDate(expected.getDate()-i);
    const exp = expected.toISOString().slice(0,10);
    if(dates.includes(exp)) streak++;
    else break;
  }
  return streak;
}

function renderChores(){
  initChoreData();
  // Refresh Parent Hub pending list if it's visible
  if(typeof renderPhPendingChores === 'function') renderPhPendingChores();
  // Always sync the home dashboard chore card
  if(typeof updateDashCards === 'function') updateDashCards();
  const today = new Date().toISOString().slice(0,10);
  const dayOfWeek = new Date().getDay();
  const avail = D.chorePoints.total - D.chorePoints.spent;
  const streak = getChoreStreak();

  // Update summary cards
  const ae = document.getElementById('chorePointsAvail'); if(ae) ae.textContent = avail;
  const te = document.getElementById('chorePointsTotal'); if(te) te.textContent = D.chorePoints.total;
  const se = document.getElementById('choreStreak'); if(se) se.textContent = streak;

  // Level calc
  const lvl = CHORE_LEVELS.find(l=>D.chorePoints.total >= l.min && D.chorePoints.total < l.max) || CHORE_LEVELS[CHORE_LEVELS.length-1];
  const le = document.getElementById('choreLevel'); if(le) le.textContent = lvl.level;
  const ll = document.getElementById('choreLevelLabel'); if(ll) ll.textContent = `Level ${lvl.level} — ${lvl.name}`;
  const lp = document.getElementById('choreLevelPts'); if(lp) lp.textContent = `${D.chorePoints.total} / ${lvl.max} pts`;
  const lb = document.getElementById('choreLevelBar'); if(lb) lb.style.width = Math.min(100, ((D.chorePoints.total-lvl.min)/(lvl.max-lvl.min))*100)+'%';

  // Today's chores
  const todayEl = document.getElementById('choreTodayList');
  if(todayEl){
    const activeChores = (Array.isArray(D.chores)?D.chores:[]).filter(c=>{
      if(!c.active) return false;
      if(c.freq==='daily') return true;
      if(c.freq==='weekly') return true;
      if(c.freq==='once'){
        const verified = D.choreLog.find(l=>l.choreId===c.id && l.status==='verified');
        return !verified;
      }
      return true;
    });

    if(!activeChores.length){
      todayEl.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--tx2);font-size:.8rem;">${D.chores.length?'All caught up for today! 🎉':'No chores set up yet. Ask a parent to add some in Parent Hub.'}</div>`;
    } else {
      todayEl.innerHTML = activeChores.map(c=>{
        const todayLog = D.choreLog.find(l=>l.choreId===c.id && l.date===today);
        const status = todayLog ? todayLog.status : 'todo';
        const statusBadge = {
          todo:`<button class="btn bp bs" onclick="markChoreDone(${c.id})" style="font-size:.65rem;white-space:nowrap;">✓ Done</button>`,
          pending:'<span style="font-size:.6rem;background:rgba(251,191,36,.15);color:#fbbf24;padding:.2rem .5rem;border-radius:6px;">⏳ Pending</span>',
          verified:'<span style="font-size:.6rem;background:rgba(34,197,94,.15);color:#22c55e;padding:.2rem .5rem;border-radius:6px;">✅ Verified</span>',
          rejected:'<span style="font-size:.6rem;background:rgba(239,68,68,.15);color:#ef4444;padding:.2rem .5rem;border-radius:6px;">❌ Redo</span>'
        };
        return `<div style="display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;margin-bottom:.3rem;${status==='verified'?'opacity:.6;':''}">
          <span style="font-size:1rem;">${c.emoji}</span>
          <div style="flex:1;">
            <div style="font-size:.78rem;font-weight:600;color:var(--tx);${status==='verified'?'text-decoration:line-through;':''}">${escapeHtml(c.name)}</div>
            <div style="font-size:.58rem;color:var(--tx2);">${c.pts} pts · ${c.freq}</div>
          </div>
          ${statusBadge[status]||statusBadge.todo}
        </div>`;
      }).join('');
    }
  }

  // Parent mode lists
  if(_parentMode){
    // All chores management
    const allEl = document.getElementById('choreAllList');
    if(allEl){
      allEl.innerHTML = (Array.isArray(D.chores)?D.chores:[]).map(c=>`
        <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;margin-bottom:.25rem;${c.active?'':'opacity:.5;'}">
          <span>${c.emoji}</span>
          <span style="flex:1;font-size:.72rem;font-weight:600;color:var(--tx);">${escapeHtml(c.name)}</span>
          <span style="font-size:.6rem;color:var(--c);">${c.pts}pts</span>
          <span style="font-size:.55rem;color:var(--tx2);">${c.freq}</span>
          <button class="btn bgh bs" onclick="toggleChoreActive(${c.id})" style="font-size:.5rem;">${c.active?'Pause':'Resume'}</button>
          <button class="btn bda bs" onclick="removeChore(${c.id})" style="font-size:.5rem;">✕</button>
        </div>
      `).join('') || '<div style="font-size:.72rem;color:var(--tx2);padding:.5rem;">No chores yet.</div>';
    }

    // Pending verification
    const pendEl = document.getElementById('chorePendingList');
    if(pendEl){
      const pending = D.choreLog.filter(l=>l.status==='pending');
      if(!pending.length){
        pendEl.innerHTML = '<div style="font-size:.72rem;color:var(--tx2);padding:.5rem;">Nothing pending.</div>';
      } else {
        pendEl.innerHTML = pending.map(p=>`
          <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .6rem;background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.12);border-radius:10px;margin-bottom:.3rem;">
            <span style="font-size:1rem;">${p.emoji}</span>
            <div style="flex:1;">
              <div style="font-size:.75rem;font-weight:600;color:var(--tx);">${escapeHtml(p.choreName)}</div>
              <div style="font-size:.58rem;color:var(--tx2);">${p.date} at ${p.time} · ${p.pts} pts</div>
            </div>
            <button class="btn bp bs" onclick="verifyChore(${p.id},true)" style="font-size:.6rem;background:#22c55e;">✓ Verify</button>
            <button class="btn bda bs" onclick="verifyChore(${p.id},false)" style="font-size:.6rem;">✕ Reject</button>
          </div>
        `).join('');
      }
    }

    // Reward management
    const rmEl = document.getElementById('rewardManageList');
    if(rmEl){
      rmEl.innerHTML = (Array.isArray(D.rewards)?D.rewards:[]).map(r=>`
        <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;background:rgba(251,191,36,.04);border:1px solid rgba(251,191,36,.1);border-radius:8px;margin-bottom:.25rem;">
          <span>🎁</span>
          <span style="flex:1;font-size:.72rem;font-weight:600;color:var(--tx);">${escapeHtml(r.name)}</span>
          <span style="font-size:.62rem;color:#fbbf24;font-weight:700;">${r.pts} pts</span>
          <button class="btn bda bs" onclick="removeReward(${r.id})" style="font-size:.5rem;">✕</button>
        </div>
      `).join('') || '<div style="font-size:.72rem;color:var(--tx2);padding:.5rem;">No rewards set up.</div>';
    }

    // Weekly report
    const wrEl = document.getElementById('choreWeeklyReport');
    if(wrEl){
      const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const ws = weekStart.toISOString().slice(0,10);
      const weekLogs = D.choreLog.filter(l=>l.date>=ws);
      const verified = weekLogs.filter(l=>l.status==='verified');
      const pending = weekLogs.filter(l=>l.status==='pending');
      const rejected = weekLogs.filter(l=>l.status==='rejected');
      const ptsThisWeek = verified.reduce((s,l)=>s+l.pts,0);
      wrEl.innerHTML = `
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(34,197,94,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#22c55e;">${verified.length}</div><div style="font-size:.55rem;color:var(--tx2);">Verified</div></div>
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(251,191,36,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#fbbf24;">${pending.length}</div><div style="font-size:.55rem;color:var(--tx2);">Pending</div></div>
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(239,68,68,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#ef4444;">${rejected.length}</div><div style="font-size:.55rem;color:var(--tx2);">Rejected</div></div>
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(167,139,250,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#a78bfa;">${ptsThisWeek}</div><div style="font-size:.55rem;color:var(--tx2);">Pts Earned</div></div>
        </div>`;
    }
  }

  // Reward shop (kid view)
  const shopEl = document.getElementById('rewardShopList');
  if(shopEl){
    if(!(Array.isArray(D.rewards)?D.rewards:[]).length){
      shopEl.innerHTML = '<div style="text-align:center;color:var(--tx2);font-size:.75rem;padding:1rem;">No rewards available yet. Ask a parent to set some up!</div>';
    } else {
      shopEl.innerHTML = (Array.isArray(D.rewards)?D.rewards:[]).filter(r=>r.active!==false).map(r=>{
        const canAfford = avail >= r.pts;
        return `<div style="display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;background:${canAfford?'rgba(251,191,36,.06)':'rgba(255,255,255,.02)'};border:1px solid ${canAfford?'rgba(251,191,36,.15)':'rgba(255,255,255,.06)'};border-radius:10px;margin-bottom:.3rem;">
          <span style="font-size:1.1rem;">🎁</span>
          <div style="flex:1;">
            <div style="font-size:.78rem;font-weight:600;color:var(--tx);">${escapeHtml(r.name)}</div>
            <div style="font-size:.6rem;color:#fbbf24;font-weight:700;">${r.pts} points</div>
          </div>
          <button class="btn ${canAfford?'bp':'bgh'} bs" onclick="${canAfford?`redeemReward(${r.id})`:`showToast('Need ${r.pts-avail} more points')`}" style="font-size:.65rem;${canAfford?'':'opacity:.5;'}">${canAfford?'🎉 Redeem':'🔒 '+r.pts+'pts'}</button>
        </div>`;
      }).join('');
    }
  }

  // History
  const histEl = document.getElementById('choreHistory');
  if(histEl){
    const recent = D.choreLog.slice().sort((a,b)=>b.id-a.id).slice(0,20);
    if(!recent.length){
      histEl.innerHTML = '<div style="color:var(--tx2);font-size:.72rem;padding:.5rem;text-align:center;">No activity yet.</div>';
    } else {
      const statusColors = {pending:'#fbbf24',verified:'#22c55e',rejected:'#ef4444',redeemed:'#a78bfa'};
      const statusLabels = {pending:'Pending',verified:'Verified',rejected:'Rejected',redeemed:'Redeemed'};
      histEl.innerHTML = recent.map(l=>`
        <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.04);font-size:.65rem;">
          <span>${l.emoji}</span>
          <span style="flex:1;color:var(--tx);">${escapeHtml(l.choreName)}</span>
          <span style="color:${l.pts>0?'#22c55e':'#a78bfa'};font-weight:700;">${l.pts>0?'+':'-'}${Math.abs(l.pts)}</span>
          <span style="color:${statusColors[l.status]||'var(--tx2)'};font-size:.55rem;">${statusLabels[l.status]||l.status}</span>
          <span style="color:var(--tx2);font-size:.5rem;">${l.date.slice(5)}</span>
        </div>
      `).join('');
    }
  }
  renderHelpfulChores();
}


// ── SCREEN TIME MANAGER ──────────────────────────────────────
const SCREEN_CATS = [
  {key:'games',icon:'🎮',label:'Video Games',color:'#8b5cf6'},
  {key:'tv',icon:'📺',label:'TV / Streaming',color:'#38bdf8'},
  {key:'phone',icon:'📱',label:'Phone / Social',color:'#f472b6'},
  {key:'tablet',icon:'📲',label:'Tablet / iPad',color:'#06d6a0'},
];

function initScreenTime(){
  if(!D.screenTime) D.screenTime = {games:{earned:0,used:0},tv:{earned:0,used:0},phone:{earned:0,used:0},tablet:{earned:0,used:0}};
  renderScreenTime();
  renderHeroScreenTime();
}

function renderHeroScreenTime(){
  const el = document.getElementById('heroScreenTime'); if(!el) return;
  if(!D.screenTime) return;
  el.innerHTML = SCREEN_CATS.map(c=>{
    const d = (D.screenTime||{})[c.key]||{earned:0,used:0};
    const avail = Math.max(0, d.earned - d.used);
    return `<div style="text-align:center;padding:.2rem .35rem;background:rgba(255,255,255,.03);border-radius:6px;min-width:50px;">
      <div style="font-size:.75rem;">${c.icon}</div>
      <div style="font-size:.7rem;font-weight:800;color:${avail>0?c.color:'var(--tx3)'};">${avail}m</div>
    </div>`;
  }).join('');
}

function updateDashCards(){
  // Chore points
  const cp = document.getElementById('qsChorePts');
  const pts = (D.chorePoints||{}).total||0;
  if(cp) cp.textContent = pts;
  const cl = document.getElementById('qsChoreLevel');
  if(cl && typeof CHORE_LEVELS !== 'undefined'){
    const lvl = CHORE_LEVELS.find(l=>pts>=l.min && pts<l.max)||{name:'GOAT',level:8};
    cl.textContent = 'Lvl '+lvl.level+' '+lvl.name;
  }
  // Earnings
  const eb = document.getElementById('qsEarnings');
  if(eb) eb.textContent = '$'+((D.earnings||{}).balance||0).toFixed(2);
  const sg = document.getElementById('qsSavingsGoal');
  if(sg){
    const e = D.earnings||{};
    sg.textContent = e.goalName ? '$'+(e.saved||0).toFixed(0)+' / $'+(e.goalAmount||0).toFixed(0) : '';
  }
  // Certs
  const ce = document.getElementById('qsCerts');
  const certCount = Object.values(D.skillCerts||{}).filter(Boolean).length;
  if(ce) ce.textContent = certCount;
  // Mood
  const me = document.getElementById('qsMoodEmoji');
  const ml = document.getElementById('qsMoodLabel');
  const today = new Date().toISOString().slice(0,10);
  const todayMood = (D.moods||[]).find(m=>m.date===today);
  if(me) me.textContent = todayMood ? ['😢','😔','😐','🙂','😄'][todayMood.level-1]||'😊' : '—';
  if(ml) ml.textContent = todayMood ? ['Rough','Low','Okay','Good','Great'][todayMood.level-1]||'' : 'Log today';
  // Books
  const bk = document.getElementById('qsBooks');
  const booksDone = (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length;
  if(bk) bk.textContent = booksDone;
  // Journal
  const jn = document.getElementById('qsJournal');
  if(jn) jn.textContent = (Array.isArray(D.journal)?D.journal:[]).length;
  // Milestones
  const ms = document.getElementById('qsMilestones');
  if(ms) ms.textContent = (D.milestones||[]).length;

  // ── STATUS COLORS (green=good, red=needs attention, yellow=neutral) ──
  function setStatus(id, color){
    const el = document.getElementById(id);
    if(el){ el.className = 'dcard-status ' + color; }
  }

  // GPA
  const classes = D.classes||[];
  const gradeMap = {'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D+':1.3,'D':1,'D-':0.7,'F':0};
  const grades = classes.filter(c=>c.grade).map(c=>gradeMap[c.grade]||0);
  const gpa = grades.length ? grades.reduce((a,b)=>a+b,0)/grades.length : 0;
  setStatus('dcGpaStatus', !classes.length ? 'green' : gpa>=3.0 ? 'green' : gpa>=2.0 ? 'yellow' : 'red');

  // Streak
  const streak = D.streak||0;
  setStatus('dcStreakStatus', streak>=7 ? 'green' : streak>=1 ? 'green' : 'yellow');

  // Chores
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate()-weekStart.getDay());
  const ws = weekStart.toISOString().slice(0,10);
  const weekChores = (D.choreLog||[]).filter(l=>l.date>=ws && l.status==='verified').length;
  setStatus('dcChoreStatus', weekChores>=5 ? 'green' : weekChores>=1 ? 'green' : (Array.isArray(D.chores)?D.chores:[]).length ? 'yellow' : 'green');

  // Earnings
  const bal = (D.earnings||{}).balance||0;
  setStatus('dcEarnStatus', 'green');

  // Certs
  setStatus('dcCertStatus', certCount>=5 ? 'green' : certCount>=1 ? 'green' : 'yellow');

  // Goals
  const goalsDone = (Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length;
  const goalsTotal = (Array.isArray(D.goals)?D.goals:[]).length;
  setStatus('dcGoalStatus', goalsDone>0 ? 'green' : goalsTotal>0 ? 'green' : 'yellow');

  // Mood
  setStatus('dcMoodStatus', todayMood ? (todayMood.level>=4?'green':todayMood.level>=3?'yellow':'red') : 'green');

  // Books
  setStatus('dcBookStatus', booksDone>=3 ? 'green' : booksDone>=1 ? 'green' : 'yellow');

  // Health
  setStatus('dcHealthStatus', 'green');

  // Screen Time
  setStatus('dcScreenStatus', 'green');

  // Finance
  setStatus('dcFinStatus', 'green');

  // Calendar
  setStatus('dcCalStatus', 'green');

  // Skills
  setStatus('dcSkillStatus', certCount>=10 ? 'green' : certCount>=3 ? 'green' : certCount>=1 ? 'yellow' : 'green');

  // Journal
  setStatus('dcJournalStatus', (Array.isArray(D.journal)?D.journal:[]).length>=10 ? 'green' : (Array.isArray(D.journal)?D.journal:[]).length>=1 ? 'green' : 'yellow');

  // Milestones
  setStatus('dcMileStatus', (D.milestones||[]).length>=5 ? 'green' : (D.milestones||[]).length>=1 ? 'green' : 'yellow');

  // Scripture
  const scrToday = new Date().toISOString().slice(0,10);
  const scrRead = D.scrReadDays && D.scrReadDays[scrToday];
  const scrStrk = document.getElementById('qsScrStreak');
  if(scrStrk) scrStrk.textContent = typeof getScriptureStreak==='function' ? getScriptureStreak() : 0;
  const scrLbl = document.getElementById('qsScrLabel');
  if(scrLbl) scrLbl.textContent = scrRead ? 'Read today ✓' : 'Read today';
  setStatus('dcScrStatus', scrRead ? 'green' : 'yellow');

  // Life Score (same calculation as parent hub)
  const lsGpa = grades.length ? Math.min(100,(gpa/4)*100) : 50;
  const weekStartLS = new Date(); weekStartLS.setDate(weekStartLS.getDate()-weekStartLS.getDay());
  const wsLS = weekStartLS.toISOString().slice(0,10);
  const weekChoresLS = (D.choreLog||[]).filter(l=>l.date>=wsLS && l.status==='verified').length;
  const activeChoresLS = (Array.isArray(D.chores)?D.chores:[]).filter(c=>c.active).length;
  const lsResponsibility = activeChoresLS>0 ? Math.min(100, (weekChoresLS/Math.max(1,activeChoresLS))*100) : 50;
  const lsGrowth = Math.min(100, certCount*6 + booksDone*4 + goalsDone*5);
  const recentMoods = (D.moods||[]).filter(m=>{const diff=(new Date()-new Date(m.date+'T12:00:00'))/(86400000);return diff<=14;});
  const moodAvg = recentMoods.length ? recentMoods.reduce((s,m)=>s+m.level,0)/recentMoods.length : 3;
  const lsWellbeing = Math.min(100, (moodAvg/5)*50 + Math.min(50, streak*3));
  const behLogs = D.behaviorLog||[];
  const posB = behLogs.filter(b=>b.type==='positive').length;
  const negB = behLogs.filter(b=>b.type==='negative').length;
  const lsCharacter = behLogs.length>0 ? Math.min(100,(posB/(posB+negB))*100) : 50;
  const lsEngagement = Math.min(100, (Array.isArray(D.journal)?D.journal:[]).length*3 + (D.milestones||[]).length*5);
  const lsTotal = Math.round((lsGpa*25 + lsResponsibility*20 + lsGrowth*15 + lsWellbeing*15 + lsCharacter*15 + lsEngagement*10)/100);

  // Require 3 full days of app use before issuing any grade
  const firstUseKey = D.firstUseDate;
  const lsToday = new Date().toISOString().slice(0,10);
  if(!D.firstUseDate){ D.firstUseDate = lsToday; save(); }
  const daysSinceFirst = D.firstUseDate ? Math.floor((new Date(lsToday) - new Date(D.firstUseDate)) / 86400000) : 0;
  const hasEnoughData = daysSinceFirst >= 3;

  // Floor score at D+ until there's a full week of data — no rock-bottom grades for beginners
  const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
  const wk = oneWeekAgo.toISOString().slice(0,10);
  const weekActivity = (D.choreLog||[]).filter(l=>l.date>=wk).length +
    (D.moods||[]).filter(m=>m.date>=wk).length +
    (Array.isArray(D.journal)?D.journal:[]).filter(j=>(j.date||'')>=wk).length;
  const hasWeekData = daysSinceFirst >= 7 || weekActivity >= 5;

  // Effective score — floor at 60 if not enough data yet
  const effectiveScore = hasEnoughData && hasWeekData ? lsTotal : Math.max(lsTotal, 60);

  let lsLetter, lsColor, lsSubLabel;
  if(!hasEnoughData){
    lsLetter = '🌱';
    lsColor = '#22c55e';
    lsSubLabel = 'Just getting started!';
  } else {
    lsLetter = effectiveScore>=93?'A+':effectiveScore>=90?'A':effectiveScore>=87?'A-':effectiveScore>=83?'B+':effectiveScore>=80?'B':effectiveScore>=77?'B-':effectiveScore>=73?'C+':effectiveScore>=70?'C':effectiveScore>=67?'C-':effectiveScore>=60?'D+':'D';
    lsColor = effectiveScore>=87?'#22c55e':effectiveScore>=77?'#4ade80':effectiveScore>=70?'#fbbf24':effectiveScore>=60?'#fb923c':'#f87171';
    // Inspiring sub-labels
    const inspireMap = {
      'A+':'🏆 Crushing it!', 'A':'⭐ Excellent!', 'A-':'🔥 Keep going!',
      'B+':'💪 Almost there!', 'B':'👏 Great work!', 'B-':'📈 Rising up!',
      'C+':'🎯 On track!', 'C':'💡 Keep pushing!', 'C-':'🌱 Growing!',
      'D+':'⚡ Keep at it!', 'D':'🚀 You can do this!'
    };
    lsSubLabel = inspireMap[lsLetter] || lsTotal+'/100';
  }

  const lsEl = document.getElementById('qsLifeScore');
  if(lsEl){ lsEl.textContent = lsLetter; lsEl.style.color = lsColor; lsEl.style.fontSize = lsLetter==='🌱'?'2rem':'2rem'; }
  const lsLbl = document.getElementById('qsLifeScoreLabel');
  if(lsLbl) lsLbl.textContent = hasEnoughData ? lsSubLabel : 'Just getting started!';
  setStatus('dcLifeScoreStatus', !hasEnoughData ? 'green' : effectiveScore>=80?'green':effectiveScore>=60?'yellow':'red');

  // Parent Bucks
  const pbBal = (D.pb||{}).balance||0;
  const pbEl = document.getElementById('qsPB');
  if(pbEl) pbEl.textContent = pbBal;
  const pbGames = document.getElementById('qsPBGames');
  if(pbGames){
    const spins = (D.pb||{}).spinTickets||0;
    const scratches = (D.pb||{}).scratchTickets||0;
    pbGames.textContent = (spins+scratches)>0 ? spins+' spins · '+scratches+' scratches' : 'Earn from activities';
  }
  setStatus('dcPBStatus', pbBal>0?'green':'yellow');
}

// Preset backgrounds
function setPresetBg(gradient){
  const layer = document.getElementById('heroBgLayer');
  const card = document.getElementById('heroCard');
  if(gradient === 'none'){
    if(layer) layer.style.backgroundImage = '';
    if(card) card.classList.add('no-photo');
    D.heroBgPreset = ''; save();
  } else {
    if(layer) layer.style.backgroundImage = gradient;
    if(card) card.classList.remove('no-photo');
    D.heroBgPreset = gradient; save();
  }
}

function setAppBg(gradient){
  if(gradient === 'none'){
    document.body.style.backgroundImage = '';
    D.appBgPreset = ''; save();
  } else {
    document.body.style.backgroundImage = gradient;
    document.body.style.backgroundAttachment = 'fixed';
    D.appBgPreset = gradient; save();
  }
}

function loadPresetBg(){
  if(D.heroBgPreset){
    const layer = document.getElementById('heroBgLayer');
    const card = document.getElementById('heroCard');
    if(layer) layer.style.backgroundImage = D.heroBgPreset;
    if(card) card.classList.remove('no-photo');
  }
}

let _stInterval = null;
let _stKey = null;
let _stSecsLeft = 0;

function renderScreenTime(){
  const el = document.getElementById('screenTimeCards'); if(!el) return;
  if(!D.screenTime) initScreenTime();
  const st = D.screenTime;

  el.innerHTML = SCREEN_CATS.map(cat=>{
    const data = st[cat.key]||{earned:0,used:0};
    const avail = Math.max(0, data.earned - data.used);
    const pct = data.earned>0 ? Math.min(100,(data.used/data.earned)*100) : 0;
    return `<div style="background:rgba(255,255,255,.03);border:1px solid ${cat.color}25;border-radius:10px;padding:.6rem;text-align:center;">
      <div style="font-size:1.2rem;">${cat.icon}</div>
      <div style="font-size:.6rem;font-weight:600;margin:.15rem 0;">${cat.label}</div>
      <div style="font-size:1.1rem;font-weight:900;color:${avail>0?cat.color:'var(--tx3)'};">${avail}m</div>
      <div style="font-size:.45rem;color:var(--tx2);">available</div>
      <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin:.3rem 0;">
        <div style="height:100%;width:${pct}%;background:${cat.color};border-radius:2px;"></div>
      </div>
      <div style="font-size:.42rem;color:var(--tx3);">${data.used}/${data.earned}m used</div>
      ${avail>0?`<button class="btn bp bs" onclick="startScreenTimer('${cat.key}')" style="font-size:.5rem;margin-top:.3rem;padding:.2rem .5rem;">▶ Use</button>`:''}
    </div>`;
  }).join('');
}

function startScreenTimer(key){
  if(_stInterval) return;
  const data = (D.screenTime||{})[key]||{earned:0,used:0};
  const avail = Math.max(0, data.earned - data.used);
  if(avail <= 0){ showToast('No time available'); return; }
  _stKey = key;
  _stSecsLeft = avail * 60;
  const cat = SCREEN_CATS.find(c=>c.key===key);
  document.getElementById('stTimerLabel').textContent = cat?cat.icon+' '+cat.label:key;
  document.getElementById('screenTimeTimer').style.display = 'block';
  _stInterval = setInterval(()=>{
    _stSecsLeft--;
    if(_stSecsLeft<=0){ stopScreenTimer(); showToast('Screen time is up!'); return; }
    const m=Math.floor(_stSecsLeft/60), s=_stSecsLeft%60;
    document.getElementById('stTimerDisp').textContent = m+':'+(s<10?'0':'')+s;
  },1000);
}

function stopScreenTimer(){
  if(!_stInterval) return;
  clearInterval(_stInterval); _stInterval=null;
  const cat = (D.screenTime||{})[_stKey];
  if(cat){
    const avail = Math.max(0, cat.earned - cat.used);
    const usedNow = avail - Math.ceil(_stSecsLeft/60);
    cat.used += Math.max(1, usedNow);
    save();
  }
  document.getElementById('screenTimeTimer').style.display = 'none';
  _stKey = null;
  renderScreenTime();
}

// Parent adds screen time (called from parent mode)
function addScreenTimeReward(key, mins){
  if(!D.screenTime) D.screenTime = {};
  if(!D.screenTime[key]) D.screenTime[key] = {earned:0,used:0};
  D.screenTime[key].earned += mins;
  save(); renderScreenTime();
  showToast('+'+mins+' min added ✓');
}

// ── EARNINGS & SAVINGS JAR ───────────────────────────────────
function initEarnings(){
  if(!D.earnings) D.earnings = {balance:0,totalEarned:0,goalName:'',goalAmount:0,saved:0,log:[]};
}

function addEarning(amount, reason){
  initEarnings();
  D.earnings.balance += amount;
  D.earnings.totalEarned += amount;
  D.earnings.log.push({id:Date.now(),amount,reason,date:new Date().toISOString().slice(0,10),type:'earn'});
  save(); renderEarnings();
}

function addToSavings(amount){
  initEarnings();
  if(amount > D.earnings.balance){ showToast('Not enough balance'); return; }
  D.earnings.balance -= amount;
  D.earnings.saved += amount;
  D.earnings.log.push({id:Date.now(),amount,reason:'Saved toward goal',date:new Date().toISOString().slice(0,10),type:'save'});
  save(); renderEarnings();
  showToast('$'+amount.toFixed(2)+' saved! 🎯');
}

function renderEarnings(){
  initEarnings();
  const e = D.earnings;

  // Balance
  const bal = document.getElementById('earningsBalance');
  if(bal) bal.textContent = '$'+e.balance.toFixed(2);
  const tot = document.getElementById('earningsTotal');
  if(tot) tot.textContent = 'Total earned: $'+e.totalEarned.toFixed(2);

  // Savings goal
  const gn = document.getElementById('savingsGoalName');
  if(gn) gn.textContent = e.goalName || 'Set a goal in Parent Hub';
  const fill = document.getElementById('savingsJarFill');
  const pctEl = document.getElementById('savingsJarPct');
  const amts = document.getElementById('savingsJarAmounts');
  if(e.goalAmount > 0){
    const pct = Math.min(100,(e.saved/e.goalAmount)*100);
    if(fill) fill.style.height = pct+'%';
    if(pctEl) pctEl.textContent = Math.round(pct)+'%';
    if(amts) amts.textContent = '$'+e.saved.toFixed(2)+' / $'+e.goalAmount.toFixed(2);
  } else {
    if(fill) fill.style.height = '0%';
    if(pctEl) pctEl.textContent = '—';
    if(amts) amts.textContent = '';
  }

  // History
  const hist = document.getElementById('earningsHistory'); if(!hist) return;
  const log = (e.log||[]).slice().sort((a,b)=>b.id-a.id).slice(0,15);
  if(!log.length){ hist.innerHTML='<div style="font-size:.65rem;color:var(--tx2);padding:.3rem;">No earnings yet. Complete chores and earn rewards!</div>'; return; }
  hist.innerHTML = log.map(l=>`
    <div style="display:flex;align-items:center;gap:.35rem;padding:.25rem .3rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.63rem;">
      <span>${l.type==='earn'?'💰':'🎯'}</span>
      <span style="flex:1;color:var(--tx2);">${escapeHtml(l.reason)}</span>
      <span style="font-weight:700;color:${l.type==='earn'?'#22c55e':'#60a5fa'};">${l.type==='earn'?'+':'-'}$${l.amount.toFixed(2)}</span>
      <span style="font-size:.48rem;color:var(--tx3);">${l.date.slice(5)}</span>
    </div>
  `).join('');
}

// ── PARENT SCREEN TIME & EARNINGS CONTROLS ───────────────────
function renderParentScreenControls(){
  const el = document.getElementById('parentScreenTimeControls'); if(!el) return;
  el.innerHTML = `
    <div style="font-family:var(--fh);font-size:.7rem;letter-spacing:1.5px;color:#38bdf8;margin-bottom:.5rem;">📱 SCREEN TIME CONTROLS</div>
    <div style="font-size:.72rem;color:var(--tx2);margin-bottom:.6rem;">Add earned minutes for good behavior, grades, or chores.</div>
    <div style="display:grid;grid-template-columns:1fr 80px;gap:.4rem;margin-bottom:.5rem;">
      <select id="pstCat" style="width:100%;">${SCREEN_CATS.map(c=>`<option value="${c.key}">${c.icon} ${c.label}</option>`).join('')}</select>
      <input type="number" id="pstMins" placeholder="Min" min="5" step="5" value="30">
    </div>
    <div style="display:flex;gap:.35rem;margin-bottom:.6rem;flex-wrap:wrap;">
      <button class="btn bp bs" onclick="addScreenTimeReward(document.getElementById('pstCat').value, parseInt(document.getElementById('pstMins').value)||30)" style="flex:1;">+ Add Time</button>
      <button class="btn bs" onclick="deductScreenTime()" style="flex:1;font-size:.65rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2);">− Deduct Time</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.35rem;margin-bottom:.5rem;">
      ${SCREEN_CATS.map(c=>{
        const data = (D.screenTime||{})[c.key]||{earned:0,used:0};
        return `<div style="background:rgba(255,255,255,.03);border-radius:6px;padding:.35rem .5rem;font-size:.65rem;">${c.icon} <b>${data.earned-data.used}m</b> avail / ${data.earned}m total</div>`;
      }).join('')}
    </div>
    <button class="btn bgh bs" onclick="resetScreenTime()" style="font-size:.6rem;width:100%;">Reset All Screen Time</button>
  `;
}

function resetScreenTime(){
  if(!confirm('Reset all screen time to zero?')) return;
  D.screenTime = {games:{earned:0,used:0},tv:{earned:0,used:0},phone:{earned:0,used:0},tablet:{earned:0,used:0}};
  save(); renderScreenTime(); renderParentScreenControls();
  showToast('Screen time reset');
}

function renderParentEarningsControls(){
  const el = document.getElementById('parentEarningsControls'); if(!el) return;
  initEarnings();
  el.innerHTML = `
    <div style="font-family:var(--fh);font-size:.7rem;letter-spacing:1.5px;color:#22c55e;margin-bottom:.5rem;">💰 EARNINGS & ALLOWANCE</div>
    <div style="display:grid;grid-template-columns:70px 1fr;gap:.4rem;margin-bottom:.4rem;">
      <input type="number" id="peAmt" placeholder="$" min="0.25" step="0.25" value="5">
      <input type="text" id="peReason" placeholder="Reason (chores, grades, bonus)">
    </div>
    <div style="display:flex;gap:.35rem;margin-bottom:.5rem;">
      <button class="btn bp bs" onclick="parentAddEarning()" style="flex:1;">+ Add $</button>
      <button class="btn bs" onclick="parentDeductEarning()" style="flex:1;font-size:.65rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2);">− Deduct $</button>
    </div>
    <div style="display:flex;gap:1rem;margin-bottom:.5rem;font-size:.72rem;color:var(--tx2);">
      <div>Balance: <b style="color:#22c55e;">$${(D.earnings||{}).balance?.toFixed(2)||'0.00'}</b></div>
      <div>Saved: <b style="color:#60a5fa;">$${(D.earnings||{}).saved?.toFixed(2)||'0.00'}</b></div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.05);padding-top:.5rem;margin-top:.3rem;">
      <div style="font-size:.6rem;font-weight:700;color:var(--tx2);margin-bottom:.3rem;">Savings Goal Setup:</div>
      <div style="display:grid;grid-template-columns:1fr 70px;gap:.35rem;margin-bottom:.4rem;">
        <input type="text" id="peGoalName" placeholder="Goal name (e.g. New shoes)" value="${(D.earnings||{}).goalName||''}">
        <input type="number" id="peGoalAmt" placeholder="$" min="1" value="${(D.earnings||{}).goalAmount||''}">
      </div>
      <button class="btn bgh bs" onclick="setSavingsGoal()" style="font-size:.65rem;width:100%;">Set Savings Goal</button>
    </div>
  `;
}

function parentAddEarning(){
  const amt = parseFloat((document.getElementById('peAmt')||{}).value)||0;
  const reason = (document.getElementById('peReason')||{}).value.trim()||'Bonus';
  if(amt<=0){ showToast('Enter an amount'); return; }
  addEarning(amt, reason);
  document.getElementById('peReason').value='';
  renderParentEarningsControls();
  showToast('+$'+amt.toFixed(2)+' added ✓');
}

function setSavingsGoal(){
  initEarnings();
  D.earnings.goalName = (document.getElementById('peGoalName')||{}).value.trim();
  D.earnings.goalAmount = parseFloat((document.getElementById('peGoalAmt')||{}).value)||0;
  save(); renderEarnings(); renderParentEarningsControls();
  showToast('Savings goal set ✓');
}

