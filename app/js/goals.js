/* =============================================================
   goals.js — Goals system, journal, milestones, reading list,
              mood tracker extended, mentors
============================================================= */

// ── GOALS ─────────────────────────────────────────────────────
// Phase C-Goals (2026-05-15) — additions:
//   • motivation field on the goal ("What would completing this make possible?")
//   • milestones[] (2-5 mini-goals per goal) with actions[] (1-3 daily steps per milestone)
//   • SVG progress ring on each card (reuses svgProgressRing from finance.js)
//   • Auto-complete when all milestones are checked + slide-in completion card
//   • All cards carry --section-goals (#f97316) accent
function saveGoal(){
  const text = (document.getElementById('gText').value||'').trim();
  const type = document.getElementById('gType').value;
  const cat  = document.getElementById('gCat').value;
  const motivation = ((document.getElementById('gMotivation')||{}).value || '').trim();
  if(!text){ showToast('Enter your goal'); return; }
  if(!D.goals) D.goals = [];
  D.goals.push({
    id: Date.now(),
    text, type, cat,
    motivation,            // Phase C-Goals
    milestones: [],        // Phase C-Goals — { id, text, done, actions:[{id,text,done}] }
    done: false,
    date: new Date().toLocaleDateString()
  });
  document.getElementById('gText').value = '';
  const mEl = document.getElementById('gMotivation'); if(mEl) mEl.value = '';
  save(); renderGoals(); closeModal('goalAddModal'); showToast('Goal added! 🎯');
}
function toggleGoal(id){ const g=(Array.isArray(D.goals)?D.goals:[]).find(g=>g.id===id); if(g){g.done=!g.done;if(g.done)g.achievedDate=new Date().toLocaleDateString();save();renderGoals();showToast(g.done?'🏆 Goal achieved!':'Unchecked');} }
function editGoal(id){ const g=(Array.isArray(D.goals)?D.goals:[]).find(g=>g.id===id); if(!g) return; const n=prompt('Edit:',g.text); if(!n) return; g.text=n.trim(); save(); renderGoals(); }
function gFilter(f,btn){ _gFilter=f; document.querySelectorAll('.goalTabs .tab').forEach(b=>b.classList.remove('active')); if(btn) btn.classList.add('active'); renderGoals(); }

// Progress = completed milestones / total milestones. Goals with no
// milestones report 0% (incomplete) or 100% (completed via top check).
function goalProgressPct(g){
  const ms = g.milestones || [];
  if(!ms.length) return g.done ? 100 : 0;
  const done = ms.filter(m => m.done).length;
  return Math.round((done / ms.length) * 100);
}

function renderGoals(){
  const el = document.getElementById('goalsList'); if(!el) return;
  let goals = D.goals || [];

  // Stats (unchanged)
  const statsEl = document.getElementById('gvStats');
  if(statsEl){
    const total   = goals.length;
    const done    = goals.filter(g=>g.done).length;
    const longG   = goals.filter(g=>g.type==='long'&&!g.done).length;
    const shortG  = goals.filter(g=>g.type==='short'&&!g.done).length;
    statsEl.innerHTML = `
      <div class="gv-stat"><div class="gv-stat-num">${total}</div><div class="gv-stat-lbl">Total</div></div>
      <div class="gv-stat"><div class="gv-stat-num" style="color:#a78bfa;">${longG}</div><div class="gv-stat-lbl">Long-Term</div></div>
      <div class="gv-stat"><div class="gv-stat-num" style="color:#fbbf24;">${shortG}</div><div class="gv-stat-lbl">Short-Term</div></div>
      <div class="gv-stat"><div class="gv-stat-num" style="color:#34d399;">${done}</div><div class="gv-stat-lbl">Achieved</div></div>
    `;
  }

  // Filter (unchanged)
  if(_gFilter==='long')       goals = goals.filter(g=>g.type==='long'&&!g.done);
  else if(_gFilter==='short') goals = goals.filter(g=>g.type==='short'&&!g.done);
  else if(_gFilter==='done')  goals = goals.filter(g=>g.done);
  else                        goals = goals.filter(g=>!g.done);

  if(!goals.length){
    el.innerHTML = `<div class="gv-empty">${_gFilter==='done'?'No goals achieved yet — keep pushing! 💪':'No goals here yet. Hit + Add Goal to start.'}</div>`;
    return;
  }

  el.innerHTML = goals.map(g => renderGoalCard(g)).join('');
}

function renderGoalCard(g){
  const pct = goalProgressPct(g);
  const typeTag = g.done
    ? `<span class="gv-goal-tag done-tag">✅ Achieved</span>`
    : g.type==='long'
      ? `<span class="gv-goal-tag long">🏔 Long-Term</span>`
      : `<span class="gv-goal-tag short">⚡ Short-Term</span>`;
  const ms = g.milestones || [];
  const hasBreakdown = ms.length > 0;

  // SVG progress ring — uses svgProgressRing from finance.js (global).
  // Graceful fallback to a plain percent number if for any reason that
  // function isn't loaded (e.g. faith-free who doesn't load finance).
  const ringHtml = (typeof svgProgressRing === 'function' && !g.done)
    ? svgProgressRing(pct, 72, 'var(--section-goals)')
    : '';

  // Motivation block — Georgia italic, left-bordered in --section-goals.
  const motHtml = g.motivation
    ? `<div style="font-family:Georgia,serif;font-style:italic;font-size:.86rem;color:var(--tx2);line-height:1.55;margin:.55rem 0 .65rem;padding:.35rem 0 .35rem .85rem;border-left:2px solid var(--section-goals);">${escapeHtml(g.motivation)}</div>`
    : '';

  // Milestones nested under the goal.
  const breakdownHtml = hasBreakdown
    ? '<div style="margin-top:.65rem;">' + ms.map(m => renderMilestone(g.id, m)).join('') + '</div>'
    : '';

  // "Break it down" CTA (no milestones yet) or "+ Add milestone" (existing + room for more).
  const breakBtn = !hasBreakdown && !g.done
    ? `<button type="button" onclick="addMilestone(${g.id})" style="background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.28);color:var(--section-goals);padding:.45rem .9rem;border-radius:8px;cursor:pointer;font-size:.78rem;font-weight:600;font-family:var(--fm);margin-top:.6rem;">+ Break it down</button>`
    : '';
  const addMsBtn = hasBreakdown && !g.done && ms.length < 5
    ? `<button type="button" onclick="addMilestone(${g.id})" style="background:rgba(249,115,22,.04);border:1px dashed rgba(249,115,22,.35);color:var(--section-goals);padding:.4rem .8rem;border-radius:8px;cursor:pointer;font-size:.72rem;font-weight:600;font-family:var(--fm);margin-top:.45rem;width:100%;">+ Add milestone (${ms.length}/5)</button>`
    : '';

  // Completion stamp shown only when done.
  const doneStamp = g.done
    ? `<div style="margin-top:.55rem;padding:.4rem .8rem;background:rgba(249,115,22,.08);border-radius:8px;font-size:.78rem;color:var(--section-goals);font-weight:600;">🎉 Completed ${g.doneDate||''}</div>`
    : '';

  return `
    <div class="gv-goal-card ${g.done?'done':''}" id="gc-${g.id}" style="border-left:4px solid var(--section-goals);">
      <div style="display:flex;align-items:flex-start;gap:.85rem;">
        <div class="gv-goal-check" onclick="completeGoal(${g.id})" style="${g.done?'background:var(--section-goals);border-color:var(--section-goals);color:#fff;':''}">${g.done?'✓':''}</div>
        <div class="gv-goal-body" style="flex:1;min-width:0;">
          <div class="gv-goal-text">${escapeHtml(g.text)}</div>
          <div class="gv-goal-meta">${typeTag}<span class="gv-goal-cat">${g.cat||''}</span><span class="gv-goal-date">${g.doneDate||g.date||''}</span></div>
          ${motHtml}
        </div>
        ${ringHtml ? `<div style="flex-shrink:0;align-self:flex-start;">${ringHtml}</div>` : ''}
        <button class="gv-goal-del" onclick="deleteGoal(${g.id})" title="Delete">✕</button>
      </div>
      ${breakdownHtml}
      ${addMsBtn}
      ${breakBtn}
      ${doneStamp}
    </div>`;
}

function renderMilestone(gid, m){
  const acts = m.actions || [];
  const checkBoxStyle = m.done
    ? 'background:var(--section-goals);border:2px solid var(--section-goals);color:#fff;'
    : 'background:transparent;border:2px solid rgba(249,115,22,.55);color:transparent;';

  const actsHtml = acts.length
    ? '<div style="margin-top:.4rem;padding-left:1.75rem;">'
      + acts.map(a => {
          const ac = a.done
            ? 'background:var(--section-goals);border:1.5px solid var(--section-goals);color:#fff;'
            : 'background:transparent;border:1.5px solid rgba(249,115,22,.45);color:transparent;';
          return `<div style="display:flex;align-items:center;gap:.55rem;padding:.28rem 0;font-size:.78rem;color:${a.done?'var(--tx2)':'var(--tx)'};${a.done?'text-decoration:line-through;':''}">
            <span onclick="toggleAction(${gid},${m.id},${a.id})" style="width:16px;height:16px;border-radius:4px;${ac}display:flex;align-items:center;justify-content:center;font-size:.7rem;cursor:pointer;flex-shrink:0;">${a.done?'✓':''}</span>
            <span style="flex:1;">${escapeHtml(a.text)}</span>
            <button onclick="deleteAction(${gid},${m.id},${a.id})" style="background:none;border:none;color:rgba(255,255,255,.25);cursor:pointer;font-size:.78rem;padding:0 .25rem;">✕</button>
          </div>`;
        }).join('')
      + '</div>'
    : '';

  const addActBtn = !m.done && acts.length < 3
    ? `<button type="button" onclick="addAction(${gid},${m.id})" style="margin-top:.3rem;margin-left:1.75rem;background:none;border:none;color:rgba(249,115,22,.75);font-size:.72rem;font-weight:600;cursor:pointer;font-family:var(--fm);padding:0;">+ Add daily action</button>`
    : '';

  return `
    <div style="padding:.6rem .75rem;background:rgba(249,115,22,.05);border-left:3px solid var(--section-goals);border-radius:6px;margin-bottom:.4rem;margin-left:.4rem;">
      <div style="display:flex;align-items:center;gap:.55rem;">
        <span onclick="toggleMilestone(${gid},${m.id})" style="width:18px;height:18px;border-radius:4px;${checkBoxStyle}display:flex;align-items:center;justify-content:center;font-size:.78rem;cursor:pointer;flex-shrink:0;">${m.done?'✓':''}</span>
        <span style="flex:1;font-size:.86rem;font-weight:600;color:${m.done?'var(--tx2)':'var(--tx)'};${m.done?'text-decoration:line-through;':''}">${escapeHtml(m.text)}</span>
        <button onclick="deleteMilestone(${gid},${m.id})" style="background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:.78rem;padding:0 .25rem;">✕</button>
      </div>
      ${actsHtml}
      ${addActBtn}
    </div>`;
}

function addMilestone(gid){
  const g = (D.goals||[]).find(g => g.id === gid);
  if(!g) return;
  if(!g.milestones) g.milestones = [];
  if(g.milestones.length >= 5){ showToast('Max 5 milestones per goal'); return; }
  const text = prompt('Milestone (mini-goal):');
  if(!text || !text.trim()) return;
  g.milestones.push({id: Date.now(), text: text.trim(), done: false, actions: []});
  save(); renderGoals();
}

function deleteMilestone(gid, mid){
  const g = (D.goals||[]).find(g => g.id === gid);
  if(!g || !g.milestones) return;
  if(!confirm('Delete this milestone and its actions?')) return;
  g.milestones = g.milestones.filter(m => m.id !== mid);
  save(); renderGoals();
}

function toggleMilestone(gid, mid){
  const g = (D.goals||[]).find(g => g.id === gid);
  if(!g || !g.milestones) return;
  const m = g.milestones.find(m => m.id === mid);
  if(!m) return;
  m.done = !m.done;
  save();
  checkGoalAutoComplete(gid);
  renderGoals();
}

function addAction(gid, mid){
  const g = (D.goals||[]).find(g => g.id === gid);
  if(!g || !g.milestones) return;
  const m = g.milestones.find(m => m.id === mid);
  if(!m) return;
  if(!m.actions) m.actions = [];
  if(m.actions.length >= 3){ showToast('Max 3 actions per milestone'); return; }
  const text = prompt('Daily action (specific small step):');
  if(!text || !text.trim()) return;
  m.actions.push({id: Date.now() + Math.floor(Math.random()*1000), text: text.trim(), done: false});
  save(); renderGoals();
}

function deleteAction(gid, mid, aid){
  const g = (D.goals||[]).find(g => g.id === gid);
  if(!g || !g.milestones) return;
  const m = g.milestones.find(m => m.id === mid);
  if(!m || !m.actions) return;
  m.actions = m.actions.filter(a => a.id !== aid);
  save(); renderGoals();
}

function toggleAction(gid, mid, aid){
  const g = (D.goals||[]).find(g => g.id === gid);
  if(!g || !g.milestones) return;
  const m = g.milestones.find(m => m.id === mid);
  if(!m || !m.actions) return;
  const a = m.actions.find(a => a.id === aid);
  if(!a) return;
  a.done = !a.done;
  save(); renderGoals();
  // Goal-action ticks do not feed the hero's "tasks today" counter today —
  // that reads choreLog + assignments. If a unified task surface is wanted
  // later, route through a shared task source.
}

function checkGoalAutoComplete(gid){
  const g = (D.goals||[]).find(g => g.id === gid);
  if(!g || !g.milestones || !g.milestones.length) return;
  const allDone = g.milestones.every(m => m.done);
  if(allDone && !g.done){
    g.done = true;
    g.doneDate = new Date().toLocaleDateString();
    save();
    const pbAmt = g.type === 'long' ? 25 : 10;
    if(typeof earnPB === 'function') earnPB(pbAmt, 'Goal completed: '+g.text);
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
    showGoalCompletionCard(g);
  }
}

function showGoalCompletionCard(g){
  // Slide-in completion card. Auto-dismisses after 4s, dismissable on tap.
  // Respects prefers-reduced-motion via opacity-only transition (no transform).
  const existing = document.getElementById('goalCompletionCard');
  if(existing) existing.remove();
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const card = document.createElement('div');
  card.id = 'goalCompletionCard';
  card.style.cssText = 'position:fixed;left:50%;top:80px;transform:translateX(-50%) translateY(' + (reduce?'0':'-20px') + ');opacity:0;background:linear-gradient(135deg,rgba(249,115,22,.95),rgba(251,146,60,.92));color:#fff;padding:1.2rem 1.8rem;border-radius:20px;box-shadow:0 18px 60px rgba(249,115,22,.45);z-index:99997;max-width:90%;text-align:center;font-family:var(--fm);transition:opacity .35s ease, transform .35s ease;cursor:pointer;';
  card.onclick = () => card.remove();
  card.innerHTML = '<div style="font-size:1.9rem;line-height:1;margin-bottom:.4rem;">🎉</div>'
    + '<div style="font-family:var(--fh);font-size:1.35rem;letter-spacing:.04em;margin-bottom:.3rem;">You did it!</div>'
    + '<div style="font-size:.94rem;font-weight:600;line-height:1.4;">'+escapeHtml(g.text)+'</div>'
    + '<div style="font-size:.74rem;opacity:.85;margin-top:.4rem;">Completed '+(g.doneDate||new Date().toLocaleDateString())+'</div>';
  document.body.appendChild(card);
  requestAnimationFrame(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    if(card.parentNode){
      card.style.opacity = '0';
      if(!reduce) card.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => { try{ card.remove(); }catch(e){} }, 400);
    }
  }, 4000);
}

function completeGoal(id){
  if(!D.goals) return;
  const g = D.goals.find(g=>g.id===id); if(!g) return;
  const wasDone = g.done;
  g.done = !g.done;
  g.doneDate = g.done ? new Date().toLocaleDateString() : null;
  save(); renderGoals();
  if(g.done && !wasDone){
    const pbAmt = g.type==='long' ? 25 : 10;
    if(typeof earnPB === 'function') earnPB(pbAmt, 'Goal completed: '+g.text);
    const totalDone = (Array.isArray(D.goals)?D.goals:[]).filter(x=>x.done).length;
    if(totalDone % 5 === 0){
      if(!D.pb && typeof initParentBucks === 'function') initParentBucks();
      if(D.pb){
        D.pb.scratchTickets = (D.pb.scratchTickets||0) + 1;
        save();
        if(typeof renderGameTickets === 'function') renderGameTickets();
      }
      showToast(`🏆 Goal achieved! +${pbAmt} PB 🪙 +1 Scratch Card! 🎫`);
    } else {
      showToast(`🏆 Goal achieved! +${pbAmt} PB 🪙`);
    }
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
    showGoalCompletionCard(g);
  }
}

function deleteGoal(id){
  if(!D.goals) return;
  D.goals = D.goals.filter(g=>g.id!==id);
  save(); renderGoals();
}

function openVisionEdit(){
  const current = (D.vision||'').trim();
  document.getElementById('visionEditArea').value = current;
  openModal('visionEditModal');
}

function saveVision(){
  D.vision = document.getElementById('visionEditArea').value.trim();
  save(); renderVision(); closeModal('visionEditModal');
  showToast('Vision saved ✦');
}

function renderVision(){
  const el = document.getElementById('gvVisionText'); if(!el) return;
  const v = (D.vision||'').trim();
  el.innerHTML = v
    ? escapeHtml(v)
    : '<span class="gv-vision-placeholder">Tap to write your life vision statement — who do you want to become?</span>';
}

let _tlEditYear = 1;
function openTlEdit(yr){
  _tlEditYear = yr;
  const descs = {
    1:'What do you want to have accomplished by this time next year?',
    3:'Where do you want to be in 3 years — career, relationships, faith, finances?',
    5:'What does your life look like in 5 years? Be specific and ambitious.',
    10:'Paint the picture of your life a decade from now. Dream boldly.'
  };
  document.getElementById('tlEditTitle').textContent = `📅 ${yr}-Year Vision`;
  document.getElementById('tlEditDesc').textContent = descs[yr]||'';
  document.getElementById('tlEditArea').value = ((D.timeline||{})[yr]||'');
  openModal('tlEditModal');
}

function saveTl(){
  if(!D.timeline) D.timeline={};
  D.timeline[_tlEditYear] = document.getElementById('tlEditArea').value.trim();
  save(); renderTimeline(); closeModal('tlEditModal');
  showToast(`${_tlEditYear}-year vision saved!`);
}

function renderTimeline(){
  [1,3,5,10].forEach(yr=>{
    const val = ((D.timeline||{})[yr]||'').trim();
    const card = document.getElementById(`tl-${yr}`);
    const prev = document.getElementById(`tlPrev-${yr}`);
    if(!prev) return;
    if(val){
      prev.textContent = val;
      card && card.classList.add('has-content');
    } else {
      prev.innerHTML = '<span class="gv-tl-add">+ Tap to set</span>';
      card && card.classList.remove('has-content');
    }
  });
}


// ═══════════════════════════════════════════════════
//  CAREERS DATA — 35 most in-demand careers
// ═══════════════════════════════════════════════════
const CAREERS = [
  {
    id:'software-dev',
    icon:'💻',
    name:'Software Developer',
    salary:'$85k–$175k+',
    tag:'Tech',
    tagColor:'#60a5fa',
    desc:'Build the apps and systems the world runs on.',
    overview:'Software developers design, build, and maintain applications, websites, and systems. It\'s one of the fastest-growing, highest-paying, and most flexible careers in existence — you can work remotely, freelance, or at a startup or Fortune 500.',
    dayInLife:'Write and review code, attend team standups, debug issues, design features, collaborate with designers and product managers. Mostly independent deep work with regular team touchpoints.',
    salaryRange:'Entry: $65k–$90k | Mid: $100k–$140k | Senior: $150k–$200k+ | Staff/Principal: $200k–$400k+',
    howToStart:'Learn programming fundamentals (Python, JavaScript, or Java). Build projects. Get a CS degree OR complete a coding bootcamp (3–6 months, $10k–$15k). Build a portfolio on GitHub. Apply for junior roles or internships.',
    skills:'Problem-solving, logical thinking, attention to detail, continuous learning. Languages: JavaScript, Python, Java, TypeScript, SQL.',
    timeline:'6 months self-study → first job possible | 2–3 years → mid-level | 5+ years → senior/lead',
    resources:['freeCodeCamp.org (free)','The Odin Project (free)','CS50 on edX (free)','LeetCode for interview prep'],
    faithAngle:'Technology built with integrity — software that genuinely helps people rather than exploits them — is a direct expression of loving your neighbor.'
  },
  {
    id:'nurse',
    icon:'🏥',
    name:'Registered Nurse',
    salary:'$70k–$120k+',
    tag:'Healthcare',
    tagColor:'#34d399',
    desc:'Care for patients at their most vulnerable.',
    overview:'RNs are the backbone of healthcare — assessing patients, administering medications, coordinating care, and advocating for patients. Demand is consistently high, job security is excellent, and the work is deeply meaningful.',
    dayInLife:'Assess new patients, administer medications, coordinate with doctors, update care plans, respond to emergencies, support families, document everything carefully. Fast-paced, emotionally demanding, genuinely life-saving.',
    salaryRange:'New grad: $60k–$75k | Staff RN: $75k–$100k | Specialty/Travel: $100k–$150k | NP (advanced): $110k–$180k',
    howToStart:'Complete an Associate Degree in Nursing (ADN, 2 years) or Bachelor of Science in Nursing (BSN, 4 years). Pass the NCLEX-RN licensing exam. Consider travel nursing after 1–2 years of experience for dramatic pay increases.',
    skills:'Clinical assessment, critical thinking under pressure, empathy, communication, attention to detail, physical stamina.',
    timeline:'2–4 years education → NCLEX → first RN job | 1–2 years experience → specialty options | 4–6 years → NP or management',
    resources:['NCLEX prep: Kaplan or UWorld','allnurses.com community','NursingWorld.org (ANA)'],
    faithAngle:'Nursing is one of the most direct expressions of compassionate service — caring for people at their most vulnerable is sacred work regardless of their background.'
  },
  {
    id:'electrician',
    icon:'⚡',
    name:'Electrician',
    salary:'$60k–$110k+',
    tag:'Trades',
    tagColor:'#fbbf24',
    desc:'The skilled trade the modern world cannot function without.',
    overview:'Electricians install, maintain, and repair electrical systems in homes, commercial buildings, and industrial facilities. Demand vastly outpaces supply — there is a national shortage of electricians that is only growing as the country electrifies everything.',
    dayInLife:'Read blueprints, run conduit, pull wire, install panels and outlets, troubleshoot electrical faults, work with inspectors. Physical work, problem-solving, and significant responsibility.',
    salaryRange:'Apprentice: $20–$28/hr | Journeyman: $35–$55/hr | Master electrician: $60–$90k+ | Business owner: $100k–$300k+',
    howToStart:'Apply for an apprenticeship through IBEW (International Brotherhood of Electrical Workers) or an independent electrical contractor. Apprenticeships are 4–5 years — you get paid while you learn (no tuition debt). Then pass your journeyman exam.',
    skills:'Math, blueprint reading, problem-solving, physical fitness, attention to safety codes, reliability.',
    timeline:'Apply apprenticeship → 4–5 year paid apprenticeship → journeyman license → master license (2+ more years) → potentially own business',
    resources:['IBEW.org (apprenticeship locator)','Independent Electrical Contractors (ieci.org)','Mike Holt\'s Illustrated Guide (code study)'],
    faithAngle:'Skilled trades are deeply dignified work — you build and maintain the infrastructure people depend on every day. There\'s no shame in working with your hands; Jesus was a carpenter.'
  },
  {
    id:'teacher',
    icon:'🎓',
    name:'Teacher / Educator',
    salary:'$45k–$85k+',
    tag:'Education',
    tagColor:'#a78bfa',
    desc:'Shape the people who will shape the world.',
    overview:'Teachers at every level — K-12, community college, trade instruction — shape human potential. The financial compensation is modest but improving in many states, and the influence compounds across thousands of students over a career.',
    dayInLife:'Plan and deliver lessons, grade assignments, meet with students and parents, collaborate with colleagues, attend professional development, supervise extracurriculars. Summers off but significant prep work continues.',
    salaryRange:'Starting: $38k–$50k | Mid-career: $55k–$70k | Senior/Admin: $75k–$100k+ | Higher ed faculty: $70k–$150k',
    howToStart:'Bachelor\'s degree in education or subject area + state teaching certification/licensure. Most states require student teaching (a semester of supervised classroom practice). Alternative certification paths exist in most states for career changers.',
    skills:'Communication, patience, creativity, classroom management, subject mastery, empathy, organization.',
    timeline:'4-year degree + certification → student teaching → first teaching job | Optional: Master\'s degree for pay bump and advancement',
    resources:['TeachersPayTeachers.com (resources)','Edutopia.org (best practices)','State DOE website (certification requirements)'],
    faithAngle:'Teaching is discipleship in its purest form — pouring into people so they become more than they would have been. Jesus was a teacher.'
  },
  {
    id:'plumber',
    icon:'🔧',
    name:'Plumber',
    salary:'$58k–$100k+',
    tag:'Trades',
    tagColor:'#fbbf24',
    desc:'Essential, recession-proof, and increasingly well-paid.',
    overview:'Plumbers install and repair water, gas, and drainage systems in homes and commercial buildings. Like electricians, demand far exceeds supply — and a leaking pipe can\'t be fixed remotely. Physical work with real intellectual challenge and excellent income potential.',
    dayInLife:'Read blueprints, install pipes and fixtures, diagnose leaks, work with water heaters and gas lines, collaborate with contractors and inspectors. Emergency calls add variety (and overtime pay).',
    salaryRange:'Apprentice: $18–$25/hr | Journeyman: $30–$50/hr | Master plumber: $60k–$90k+ | Business owner: $100k–$250k+',
    howToStart:'Plumbing apprenticeship through UA (United Association of Plumbers and Pipefitters) — 4–5 years, paid while learning, no tuition. Community college plumbing programs also available. Pass journeyman then master plumber licensing exams.',
    skills:'Math, blueprint reading, problem-solving, physical fitness, knowledge of codes, customer communication.',
    timeline:'Apprenticeship (4–5 years paid) → journeyman license → master license → optional business ownership',
    resources:['UA.org (apprenticeship finder)','Plumbing-Heating-Cooling Contractors Association (phccweb.org)'],
    faithAngle:'Plumbers protect public health — clean water and proper sanitation save more lives than almost any other profession. Unglamorous but irreplaceable.'
  },
  {
    id:'entrepreneur',
    icon:'🚀',
    name:'Entrepreneur',
    salary:'$0–$unlimited',
    tag:'Business',
    tagColor:'#fb923c',
    desc:'Build something from nothing that creates real value.',
    overview:'Entrepreneurship isn\'t a job — it\'s a path. You identify a real problem, build a solution, find customers willing to pay, and scale. The risk is high, the failure rate is high, and the potential reward — financial and personal — is unlike any other path.',
    dayInLife:'Wildly variable. Early stage: everything yourself. Later: hiring, delegating, strategic decisions. Constant: talking to customers, solving problems, making decisions with incomplete information, managing cash.',
    salaryRange:'Years 1–3: often below minimum wage or negative. Successful small business: $80k–$300k. Scaled company: life-changing wealth or moderate stable income depending on type.',
    howToStart:'Don\'t quit your job on day one. Identify a real problem (ideally one you have yourself). Talk to 20 potential customers before building anything. Start as a side project, validate revenue, then go full-time. Read "The Lean Startup" and "$100M Offers."',
    skills:'Sales, resilience, customer empathy, financial literacy, leadership, decision-making under uncertainty, coachability.',
    timeline:'Idea → validation (months) → first revenue → product-market fit → scale | Most successful companies took 3–7 years to reach stability',
    resources:['"The E-Myth Revisited" (Gerber)','"$100M Offers" (Hormozi)','Y Combinator Startup School (free online)','SCORE.org (free mentoring)'],
    faithAngle:'Entrepreneurship done right is stewardship — creating value, providing jobs, solving real problems. Proverbs is full of business wisdom. Faith gives you the resilience to survive the valleys.'
  },
  {
    id:'financial-advisor',
    icon:'📈',
    name:'Financial Advisor',
    salary:'$65k–$200k+',
    tag:'Finance',
    tagColor:'#4ade80',
    desc:'Help people build financial security and freedom.',
    overview:'Financial advisors help individuals and families manage investments, plan for retirement, navigate taxes, and build long-term wealth. A mix of financial expertise and relationship skills. Commission-based models offer high upside; fee-only models offer steady growth.',
    dayInLife:'Client meetings, reviewing portfolios, creating financial plans, prospecting new clients, continuing education on tax law and investment products, compliance documentation.',
    salaryRange:'New advisor: $45k–$65k base + commissions | Established: $100k–$200k | Top producers: $300k+',
    howToStart:'Bachelor\'s degree (finance, economics, business). Pass Series 7 and Series 66 exams (securities licensing). Consider CFP (Certified Financial Planner) designation — the gold standard, requires 6,000 hours experience + exam. Many start at large firms (Edward Jones, Fidelity, Schwab) for training.',
    skills:'Financial analysis, communication, sales, empathy, ethics, continuing education discipline.',
    timeline:'Degree → licensing exams → 2–3 years building client base → CFP designation → established practice',
    resources:['CFP Board (cfp.net)','Investopedia for foundational knowledge','NAPFA.org (fee-only planners association)'],
    faithAngle:'Helping people be wise stewards of what God has given them is ministry. Financial security reduces anxiety and expands generosity capacity.'
  },
  {
    id:'pastor',
    icon:'⛪',
    name:'Pastor / Ministry',
    salary:'$35k–$90k+',
    tag:'Ministry',
    tagColor:'#c084fc',
    desc:'Lead people toward God — the highest calling.',
    overview:'Pastors lead congregations spiritually, preach and teach Scripture, counsel members through life\'s hardest moments, develop leaders, and steward the mission of the local church. It\'s simultaneously the most rewarding and most demanding work a person can do.',
    dayInLife:'Sermon preparation (15–20 hrs/week for most pastors), counseling, hospital visits, staff meetings, leadership development, community presence, administrative responsibilities. There is no off switch when people are in crisis.',
    salaryRange:'Small church: $30k–$50k | Mid-size: $55k–$85k | Large church: $90k–$150k | Benefits often include housing allowance (tax-advantaged)',
    howToStart:'Bachelor\'s degree → Master of Divinity (MDiv, 3 years) from an accredited seminary. Alternatively, many denominations have mentorship and residency pathways. Start by serving — youth pastor, associate pastor, church planting resident — before solo pastoring.',
    skills:'Biblical knowledge, preaching and teaching, pastoral care, leadership, organizational management, emotional resilience.',
    timeline:'Undergrad → MDiv (3 years) → associate pastor 2–5 years → lead pastor | OR apprenticeship/residency pathway',
    resources:['Gordon-Conwell, Dallas Seminary, Southern Seminary (MDiv programs)','9Marks.org (church health resources)','Preaching Today (sermon development)'],
    faithAngle:'This is a calling, not merely a career. 1 Timothy 3 and Titus 1 lay out the character requirements — and they\'re demanding for good reason. Shepherd people the way Christ shepherded you.'
  },
  {
    id:'physician',
    icon:'👨‍⚕️',
    name:'Physician (Doctor)',
    salary:'$220k–$400k+',
    tag:'Healthcare',
    tagColor:'#34d399',
    desc:'The pinnacle of medical training and patient care.',
    overview:'Physicians diagnose and treat illness, manage chronic conditions, perform procedures, and coordinate care. The path is long and demanding — but the scope of impact, compensation, and professional respect are unmatched in healthcare.',
    dayInLife:'Patient appointments, procedures, reviewing test results, documentation (significant), hospital rounds, consultation with specialists, continuing education. Specialty determines schedule dramatically — surgery vs. primary care are very different lives.',
    salaryRange:'Primary care: $220k–$280k | Specialist (cardiology, orthopedics): $400k–$600k+ | Surgeon: $350k–$700k+',
    howToStart:'4-year bachelor\'s (science heavy) → MCAT → 4-year medical school → 3–7 year residency (specialty dependent) → optional 1–3 year fellowship. Total: 11–15 years post-high school. Shadow physicians early, volunteer in healthcare settings, build research experience.',
    skills:'Scientific thinking, empathy, attention to detail, stamina, communication, continuous learning.',
    timeline:'4 yr college + 4 yr med school + 3–7 yr residency = 11–15 years total training | Then finally independent practice',
    resources:['AAMC.org (pre-med resources)','Kaplan MCAT prep','Student Doctor Network forums (SDN)'],
    faithAngle:'Medicine at its best is compassionate service with extraordinary skill. The long training is a test of character as much as intellect.'
  },
  {
    id:'content-creator',
    icon:'🎥',
    name:'Content Creator',
    salary:'$0–$500k+',
    tag:'Media',
    tagColor:'#f472b6',
    desc:'Build an audience and monetize your passion or expertise.',
    overview:'Content creators — YouTube, TikTok, podcasting, newsletters, Instagram — build audiences around a niche and monetize through ads, sponsorships, merchandise, courses, and memberships. Extremely high variance: most make little, some make life-changing income.',
    dayInLife:'Ideation, filming or writing, editing, posting, engaging with audience, negotiating sponsorships, analyzing analytics, experimenting with new formats. Requires both creative and business skills.',
    salaryRange:'Most: under $5k/yr | Growing (100k+ followers): $30k–$100k | Established (1M+): $200k–$1M+ | Top tier: millions',
    howToStart:'Pick a specific niche you know deeply. Post consistently for 12+ months before expecting income. Quality > quantity. Build an email list from day one — you own it unlike social followers. Treat it as a business immediately. Study creators in your niche.',
    skills:'Communication, consistency, video or writing craft, SEO, analytics, business development, willingness to be on camera.',
    timeline:'0–6 months: building skills | 6–18 months: audience building | 18–36 months: first monetization | 3–5 years: sustainable income',
    resources:['Creator Now (YouTube channel)','Sean Cannell — Think Media','ConvertKit for email list (free to start)'],
    faithAngle:'A platform is a stewardship opportunity. What you build an audience around and what you do with their trust matters eternally.'
  },
  {
    id:'real-estate',
    icon:'🏘️',
    name:'Real Estate Agent',
    salary:'$45k–$200k+',
    tag:'Business',
    tagColor:'#fb923c',
    desc:'Help people buy and sell their biggest asset.',
    overview:'Real estate agents guide buyers and sellers through property transactions — one of the largest financial decisions most people ever make. Fully commission-based: high effort in building a client base, but high upside and flexible schedule once established.',
    dayInLife:'Client meetings, property showings, writing and negotiating offers, coordinating inspections and closings, prospecting for new clients, continuing education, and relentless networking.',
    salaryRange:'New agents: $25k–$45k (building pipeline) | Established: $75k–$150k | Top producers: $250k–$500k+',
    howToStart:'Complete your state\'s pre-licensing education (40–150 hours depending on state). Pass the real estate licensing exam. Join a brokerage — most new agents start at a large firm (Keller Williams, RE/MAX, Coldwell Banker) for training and leads.',
    skills:'Communication, negotiation, local market knowledge, networking, self-motivation, marketing.',
    timeline:'Licensing (2–4 months) → join brokerage → 6–18 months building first clients → 2–3 years to consistent income',
    resources:['BiggerPockets.com (real estate knowledge)','Your state\'s real estate commission website','Keller Williams training programs'],
    faithAngle:'Real estate done with integrity — truly serving clients rather than maximizing your commission — is a form of love. Some of the best deals you\'ll do are the ones you\'re honest enough to advise people against.'
  },
  {
    id:'ux-designer',
    icon:'🎨',
    name:'UX/UI Designer',
    salary:'$70k–$150k+',
    tag:'Tech',
    tagColor:'#60a5fa',
    desc:'Make technology human — design experiences people love.',
    overview:'UX (User Experience) and UI (User Interface) designers make software intuitive, beautiful, and effective. They research how users behave, design interfaces, prototype interactions, and work closely with engineers and product managers.',
    dayInLife:'User research, wireframing, prototyping in Figma, usability testing, presenting designs to stakeholders, iterating based on feedback, writing design documentation.',
    salaryRange:'Junior: $65k–$85k | Mid: $90k–$120k | Senior: $130k–$160k | Design lead: $160k–$200k+',
    howToStart:'Learn Figma (free, industry standard). Build a portfolio of 3–5 case studies — redesign existing apps, solve real problems. Take Google UX Design Certificate on Coursera (~6 months, $40/mo) or dedicated bootcamp. Portfolio matters more than degree.',
    skills:'Empathy, visual design, research skills, communication, Figma proficiency, systems thinking.',
    timeline:'3–6 months learning → build portfolio → job search | Portfolio is everything — quality over quantity',
    resources:['Google UX Design Certificate (Coursera)','Figma.com (free)','Laws of UX (lawsofux.com)','Nielsen Norman Group (nngroup.com)'],
    faithAngle:'Good design serves the user. Designing things that are honest, clear, and genuinely helpful (rather than manipulative dark patterns) is ethical work that honors people\'s dignity.'
  },
  {
    id:'cybersecurity',
    icon:'🔒',
    name:'Cybersecurity Analyst',
    salary:'$80k–$160k+',
    tag:'Tech',
    tagColor:'#60a5fa',
    desc:'Defend the digital infrastructure everything depends on.',
    overview:'Cybersecurity analysts protect organizations from hackers, data breaches, and malware. With every industry moving digital and attacks increasing, the talent shortage is severe — over 700,000 unfilled cybersecurity jobs in the U.S. alone.',
    dayInLife:'Monitor networks for threats, analyze security incidents, implement security controls, conduct vulnerability assessments, respond to breaches, write security policies, train staff on phishing awareness.',
    salaryRange:'Entry: $65k–$85k | Mid: $90k–$120k | Senior/architect: $130k–$180k | CISO: $200k+',
    howToStart:'CompTIA Security+ certification is the industry-standard entry point (self-study: 3–4 months, exam ~$400). Then pursue CEH or CISSP with experience. Degree in CS or IT helps but isn\'t required. TryHackMe and HackTheBox for hands-on practice.',
    skills:'Networking fundamentals, analytical thinking, knowledge of attack/defense, attention to detail, continuous learning.',
    timeline:'Security+ cert → entry job → 2–3 years → CISSP → senior/specialized roles',
    resources:['CompTIA Security+ (comptia.org)','TryHackMe.com (hands-on labs, free tier)','Cybrary.it (free courses)'],
    faithAngle:'Protecting people\'s data and privacy is a form of protecting their dignity. Cybersecurity with integrity means never crossing ethical lines even when you technically could.'
  },
  {
    id:'physical-therapist',
    icon:'🦴',
    name:'Physical Therapist',
    salary:'$80k–$110k+',
    tag:'Healthcare',
    tagColor:'#34d399',
    desc:'Restore movement, reduce pain, change quality of life.',
    overview:'Physical therapists help patients recover from injuries, surgeries, and chronic conditions through targeted exercises, manual therapy, and education. High job satisfaction, strong demand, and meaningful daily impact.',
    dayInLife:'Evaluate patients, develop individualized treatment plans, guide therapeutic exercises, perform manual therapy, document progress, collaborate with physicians and specialists.',
    salaryRange:'New grad: $70k–$85k | Experienced: $85k–$105k | Specialty/private practice: $100k–$130k+',
    howToStart:'Bachelor\'s degree (any science focus) → 3-year Doctor of Physical Therapy (DPT) program → pass NPTE licensing exam. Shadowing a PT before applying to DPT programs is required for most applications. Volunteer in a clinic to confirm it\'s the right fit.',
    skills:'Anatomy knowledge, empathy, communication, physical assessment, manual skills, patient motivation.',
    timeline:'4-yr undergrad + 3-yr DPT + licensing = 7–8 years | Then clinical specialty if desired',
    resources:['APTA.org (American Physical Therapy Association)','PTCASapplication.org (DPT program applications)'],
    faithAngle:'Restoring someone\'s ability to walk, lift their child, or live without pain is deeply human work. Healing ministry takes many forms.'
  },
  {
    id:'accountant',
    icon:'🧾',
    name:'Accountant / CPA',
    salary:'$55k–$130k+',
    tag:'Finance',
    tagColor:'#4ade80',
    desc:'The financial backbone of every organization.',
    overview:'Accountants manage financial records, prepare taxes, audit financial statements, and advise on financial decisions. CPAs (Certified Public Accountants) command significantly higher pay and broader scope. Recession-resistant and in demand across every industry.',
    dayInLife:'Preparing financial statements, analyzing data, ensuring tax compliance, auditing accounts, advising clients on financial decisions, working in spreadsheets and accounting software.',
    salaryRange:'Entry: $48k–$65k | CPA: $70k–$100k | Senior/manager: $100k–$140k | Partner: $200k–$500k+',
    howToStart:'Bachelor\'s in accounting (most states require 150 credit hours for CPA — often need a 5th year or master\'s). Pass all 4 sections of the CPA exam. 1 year of supervised work experience. Then licensure. The CPA is one of the most valuable professional designations in finance.',
    skills:'Attention to detail, analytical thinking, Excel proficiency, tax law knowledge, ethics, communication.',
    timeline:'4–5 yr degree → CPA exam (4 sections) → 1 yr experience → CPA license → career advancement',
    resources:['AICPA.org','Becker CPA Review (exam prep)','Roger CPA Review'],
    faithAngle:'Financial integrity — refusing to fudge numbers, advising honestly even when it costs you — is a direct expression of character. The financial world needs more CPAs who won\'t compromise.'
  },
  {
    id:'social-worker',
    icon:'🤝',
    name:'Social Worker',
    salary:'$45k–$80k+',
    tag:'Service',
    tagColor:'#f87171',
    desc:'Advocate for the most vulnerable people in society.',
    overview:'Social workers help individuals and families navigate crisis, connect with resources, and build better lives. Child welfare, mental health, healthcare, school, and community organization settings all employ social workers. Deeply meaningful but emotionally demanding.',
    dayInLife:'Case management, client meetings, crisis intervention, connecting clients to housing/food/healthcare resources, court appearances (child welfare), documentation, collaboration with other agencies.',
    salaryRange:'BSW: $38k–$52k | MSW (clinical): $55k–$80k | LCSW (licensed therapist): $65k–$90k',
    howToStart:'Bachelor of Social Work (BSW) for entry roles. Master of Social Work (MSW) required for clinical work (therapy) and management. Licensure varies by state — LSW, LCSW, LMSW levels. Fieldwork (internship) is built into both degree programs.',
    skills:'Empathy, crisis management, cultural competency, documentation, resilience, systems navigation, advocacy.',
    timeline:'BSW (4 yr) → entry roles | MSW (2 yr additional) → clinical licensure → independent practice',
    resources:['NASW.org (National Association of Social Workers)','socialworkguide.org','CSWE.org (accredited programs)'],
    faithAngle:'This is Micah 6:8 in professional form: "do justice, love kindness, walk humbly." Social work is one of the most direct expressions of caring for "the least of these."'
  },
  {
    id:'hvac',
    icon:'❄️',
    name:'HVAC Technician',
    salary:'$55k–$95k+',
    tag:'Trades',
    tagColor:'#fbbf24',
    desc:'Keep people comfortable year-round — and get paid well for it.',
    overview:'HVAC (Heating, Ventilation, Air Conditioning) technicians install and maintain climate control systems in homes and commercial buildings. With aging infrastructure, electrification trends, and climate change, demand is only growing.',
    dayInLife:'Diagnosing HVAC system failures, installing new equipment, performing preventive maintenance, reading blueprints, working with refrigerants, customer communication. Mix of indoor and outdoor work.',
    salaryRange:'Apprentice: $18–$26/hr | Journeyman tech: $28–$45/hr | Lead/commercial: $55k–$80k | Business owner: $100k+',
    howToStart:'Community college HVAC programs (6 months–2 years) or apprenticeship through HVAC Excellence or UA. EPA 608 certification required to handle refrigerants (~$20, easy exam). Some states require additional licensing. Apprenticeships pay while you learn.',
    skills:'Mechanical aptitude, electrical knowledge, customer service, physical fitness, problem-solving, refrigerant handling.',
    timeline:'6–24 months training → EPA 608 → entry tech → journeyman → specialization or business',
    resources:['HVAC Excellence (hvacexcellence.org)','EPA 608 study: ESCO Institute','Trade-schools.net for local programs'],
    faithAngle:'Keeping a family warm in winter and cool in summer is tangible care for people\'s wellbeing. Trades done with excellence and integrity build communities.'
  },
  {
    id:'police',
    icon:'🚔',
    name:'Law Enforcement',
    salary:'$50k–$100k+',
    tag:'Service',
    tagColor:'#f87171',
    desc:'Protect and serve — with courage and integrity.',
    overview:'Law enforcement officers protect communities, respond to emergencies, investigate crimes, and maintain public order. It demands courage, character, and restraint in equal measure. Benefits typically include strong pensions, health insurance, and job security.',
    dayInLife:'Patrol shifts, responding to calls (traffic stops to serious crimes), writing reports, court appearances, community policing, working with detectives and prosecutors on investigations.',
    salaryRange:'Starting: $40k–$60k | Experienced officer: $60k–$85k | Sergeant/detective: $75k–$100k | Federal (FBI, DEA): $85k–$130k+',
    howToStart:'High school diploma minimum, many departments prefer/require college. Apply to a local, state, or federal agency. Pass written exam, physical fitness test, psychological evaluation, background investigation, polygraph. Complete police academy (16–24 weeks). Some agencies offer tuition assistance.',
    skills:'Physical fitness, communication, de-escalation, decision-making under pressure, report writing, integrity under pressure.',
    timeline:'Application (months) → academy (4–6 months) → field training (3–12 months) → solo patrol | Advancement through testing and time',
    resources:['USA Jobs (federal law enforcement)','Your city/county police or sheriff\'s department career page','National Police Foundation (policefoundation.org)'],
    faithAngle:'Romans 13 describes government authority as God\'s servant for good. Law enforcement done with justice and mercy — particularly treating every person with dignity — is honorable service.'
  },
  {
    id:'welder',
    icon:'🔥',
    name:'Welder',
    salary:'$48k–$90k+',
    tag:'Trades',
    tagColor:'#fbbf24',
    desc:'Join metal — build the structures civilization depends on.',
    overview:'Welders fuse metal components to build everything from pipelines to skyscrapers to ships. Specializing in underwater welding, pipeline welding, or aerospace welding dramatically increases earning potential — some specialized welders earn $100k–$200k+.',
    dayInLife:'Reading blueprints, setting up and operating welding equipment, inspecting welds for quality, working in various positions and environments (shop, construction site, offshore platforms).',
    salaryRange:'Entry: $35k–$48k | Experienced: $55k–$75k | Specialized (pipeline, underwater): $80k–$200k+',
    howToStart:'Vocational/trade school welding program (6 months–2 years) or community college. AWS (American Welding Society) certifications increase pay and options. Start with SMAW (stick welding), then TIG and MIG. Build a portfolio of certification tests.',
    skills:'Manual dexterity, attention to detail, blueprint reading, physical endurance, safety consciousness.',
    timeline:'6–24 months training → AWS certifications → entry job → specialization → significant pay increase',
    resources:['AWS.org (American Welding Society)','Lincoln Electric Welding School','Hobart Institute of Welding Technology'],
    faithAngle:'Building with excellence and precision — creating things that are structurally sound and safe for others — is stewardship of skill. There is dignity in making things that last.'
  },
  {
    id:'data-analyst',
    icon:'📊',
    name:'Data Analyst',
    salary:'$65k–$130k+',
    tag:'Tech',
    tagColor:'#60a5fa',
    desc:'Turn raw numbers into decisions that drive organizations forward.',
    overview:'Data analysts collect, clean, and analyze data to help organizations make better decisions. With data generation exploding across every industry, skilled analysts are in high demand in healthcare, finance, marketing, government, and tech.',
    dayInLife:'Pulling data from databases (SQL), cleaning messy datasets, building dashboards and visualizations (Tableau, Power BI), finding patterns, presenting findings to non-technical stakeholders, answering business questions with data.',
    salaryRange:'Entry: $55k–$75k | Mid: $80k–$110k | Senior/data scientist: $110k–$160k+',
    howToStart:'Learn SQL (free on Mode Analytics, SQLZoo), Excel, and Python or R. Build 3–5 portfolio projects analyzing real datasets (Kaggle has free datasets). Google Data Analytics Certificate (Coursera, ~6 months) is an excellent starting path. No CS degree required.',
    skills:'SQL, Excel, Python or R, data visualization, statistical thinking, communication of findings.',
    timeline:'3–6 months learning SQL + Excel → add Python → build portfolio → first analyst role',
    resources:['Google Data Analytics Certificate (Coursera)','Kaggle.com (free datasets + courses)','Mode Analytics SQL tutorial (free)','Tableau Public (free)'],
    faithAngle:'Making good decisions requires good information. Analysts who present data honestly — not manipulating it to support predetermined conclusions — serve truth.'
  },

  {
    id:'military',icon:'🎖️',name:'Military Service',
    salary:'$22k-$120k+ (rank dependent)',tag:'Service',tagColor:'#059669',
    desc:'Serve your country while gaining world-class training, education benefits, and leadership skills.',
    overview:'Military careers span hundreds of specializations across six branches. From cybersecurity to medicine, aviation to engineering, the military trains you for free and pays you while learning. Benefits include the GI Bill (free college), VA home loans, healthcare, and a pension after 20 years.',
    path:'Enlist with a high school diploma or pursue officer commissioning through ROTC, service academies, or OCS with a college degree. ASVAB scores determine available career fields.',
    why:'Unmatched benefits package, free education and training, travel, leadership development, job security, lifelong network, and the honor of serving something bigger than yourself.',
    dayInLife:'Varies enormously by branch and MOS/rate. Infantry: physical training at 0600, tactical drills, weapons maintenance, field exercises. Medical: hospital rotations similar to civilian nurses. Cyber: office environment analyzing threats. All branches: physical fitness standards, formation, duty rotations, potential deployment.',
    salaryRange:'E-1 (Private): $22k | E-4 (Specialist): $32k | E-7 (Sergeant First Class): $52k-$65k | O-1 (2nd Lieutenant): $44k | O-3 (Captain): $62k-$80k | O-5+: $100k-$150k+ | Plus housing allowance, food allowance, healthcare, and tax advantages that add $15k-$30k in effective compensation',
    howToStart:'Talk to recruiters from multiple branches — compare offers. Take the ASVAB (Armed Services Vocational Aptitude Battery) — your score determines available jobs. Higher scores = better MOS options. Complete MEPS (Medical Examination Processing Station). Choose your MOS/rate carefully — this determines your career path. For officer track: complete a 4-year degree first, then apply to OCS or ROTC.',
    skills:'Discipline, physical fitness, leadership under pressure, teamwork, adaptability, technical skills specific to your MOS, time management, following and giving orders.',
    timeline:'Enlistment: ASVAB → MEPS → Basic Training (8-13 weeks) → AIT/MOS school (4 weeks-2 years) → First duty station. Officer: 4-year degree → OCS (12 weeks) → branch school → First assignment. Typical enlistment: 4-6 years.',
    resources:['GoArmy.com','Navy.com','AirForce.com','Marines.com','GoCoastGuard.com','SpaceForce.mil','TodaysMilitary.com (comparison tool)','ASVAB practice tests on March2Success.com'],
    faithAngle:'Military service is one of the most tangible expressions of sacrificial love — laying down your comfort, safety, and preferences for the protection of others. Many find their faith deepened through the challenges of service.'
  },
  {
    id:'paralegal',icon:'⚖️',name:'Paralegal / Legal Assistant',
    salary:'$42k-$75k',tag:'Legal',tagColor:'#818cf8',
    desc:'Support attorneys with research, documentation, and case management.',
    overview:'Paralegals are essential to every law firm, corporate legal department, and government agency. They research case law, draft legal documents, organize evidence, and manage client communications. The work is intellectually stimulating and provides exposure to the entire legal system.',
    path:'Associate degree or certificate in paralegal studies. Many employers prefer a bachelor degree. Certification through NALA or NFPA strengthens your resume. Entry-level positions are available at law firms, corporate legal departments, and government agencies.',
    why:'Growing field with strong job security, intellectual challenge, pathway to law school if desired, and the satisfaction of helping people navigate the legal system.',
    dayInLife:'Research case law and statutes, draft legal documents, organize case files, interview clients, prepare exhibits for trial, file court documents, manage attorney calendars. Heavy reading and writing. Detail-oriented office work with occasional courthouse visits.',
    salaryRange:'Entry: $35k-$45k | Mid (3-5 years): $50k-$65k | Senior/Specialized: $65k-$85k | Corporate paralegal in major city: $70k-$100k+',
    howToStart:'Associate degree in paralegal studies (2 years) or bachelor degree with paralegal certificate. ABA-approved programs preferred by employers. Some firms hire bachelor degree holders and train on the job. Internships at law firms during school are critical for landing first job.',
    skills:'Legal research (Westlaw, LexisNexis), writing and document drafting, organization, attention to detail, client communication, critical thinking, technology proficiency, ability to handle confidential information.',
    timeline:'2-year associate degree → entry-level paralegal | 4-year degree + certificate → stronger starting position | 3-5 years experience → senior paralegal or specialization',
    resources:['National Association of Legal Assistants (NALA)','National Federation of Paralegal Associations (NFPA)','ABA-approved paralegal programs list at AmericanBar.org'],
    faithAngle:'The legal system exists to protect the vulnerable and pursue justice. Paralegals who work with integrity contribute directly to fairness in a system that desperately needs ethical people.'
  },
  {
    id:'dental-hygienist',icon:'🦷',name:'Dental Hygienist',
    salary:'$65k-$95k',tag:'Healthcare',tagColor:'#34d399',
    desc:'Clean teeth, take X-rays, and educate patients on oral health.',
    overview:'Dental hygienists are in high demand with excellent work-life balance. Most work 3-4 days per week with no evenings or weekends. The job involves cleaning teeth, examining patients for oral diseases, taking X-rays, and educating patients on proper oral care techniques.',
    path:'Associate degree in dental hygiene (2-3 years) from an accredited program. Must pass the National Board Dental Hygiene Examination and a state clinical exam for licensure.',
    why:'Top-tier pay for an associate degree, flexible schedules, low stress compared to other healthcare roles, and genuine patient relationships.',
    dayInLife:'Clean teeth, take X-rays, examine patients for oral diseases, apply fluoride and sealants, educate patients on oral health, document treatment. Typically work 3-4 days per week with flexible scheduling. Patient interaction all day.',
    salaryRange:'Entry: $55k-$65k | Mid: $70k-$80k | Experienced: $80k-$100k+ | Top markets (CA, WA): $100k-$120k',
    howToStart:'Associate degree in dental hygiene from an accredited program (typically 3 years including prerequisites). Must pass the National Board Dental Hygiene Examination and state/regional clinical board exam. Licensure required in all states.',
    skills:'Manual dexterity, patient communication, attention to detail, knowledge of oral anatomy, radiography, infection control, empathy, ability to work in close physical proximity with patients.',
    timeline:'Prerequisites (1 year) → Dental hygiene program (2 years) → Licensing exams → Employed immediately (demand is very high)',
    resources:['American Dental Hygienists Association (ADHA.org)','Commission on Dental Accreditation program search','DentalHygienistSchools.com'],
    faithAngle:'Healthcare is service. Every patient you see is someone made in God\'s image who deserves your best care and attention, regardless of their circumstances.'
  },
  {
    id:'pilot',icon:'✈️',name:'Pilot (Commercial/Private)',
    salary:'$60k-$250k+',tag:'Aviation',tagColor:'#60a5fa',
    desc:'Fly commercial airlines, cargo, private charter, or military aircraft.',
    overview:'Pilots are in massive demand as the industry faces a shortage. Commercial airline pilots earn six figures with excellent benefits. The path requires significant training investment but the career payoff is substantial. Regional airline pilots start lower but advance to major airlines within 3-7 years.',
    path:'Private pilot license, then instrument rating, commercial license, and multi-engine rating. Build hours as a flight instructor or regional pilot. Airline transport pilot certificate (ATP) requires 1,500 hours. Military path provides training at no cost.',
    why:'Incredible earning potential, travel the world, shortage means strong job security, and the literal thrill of flight.',
    dayInLife:'Commercial airline: pre-flight checks, flight planning, weather briefing, fly 2-4 legs per day, manage crew, communicate with ATC. Regional pilots may be away from home 15+ days/month. Corporate/charter pilots have more variety. Flight instructors teach daily in small aircraft.',
    salaryRange:'Flight Instructor: $30k-$50k | Regional First Officer: $50k-$80k | Regional Captain: $80k-$120k | Major Airline First Officer: $100k-$200k | Major Airline Captain: $200k-$350k+',
    howToStart:'Private Pilot License (PPL): 40-70 flight hours, ~$10k-$15k. Then Instrument Rating, Commercial License, Multi-Engine Rating, and finally ATP (Airline Transport Pilot) certificate at 1,500 hours. Total cost: $70k-$100k through traditional route. Aviation degree programs and airline cadet programs can reduce costs.',
    skills:'Spatial awareness, decision-making under pressure, communication, physics and weather knowledge, multitasking, discipline, calm temperament, physical health (FAA medical certificate required).',
    timeline:'PPL (3-6 months) → Instrument + Commercial (6-12 months) → CFI and build hours (1-2 years) → Regional airline (2-5 years) → Major airline. Total: 5-8 years from zero to major airline.',
    resources:['AOPA.org (Aircraft Owners and Pilots Association)','FAA.gov student pilot resources','ATP Flight School','local flight schools at your nearest airport'],
    faithAngle:'Pilots literally hold lives in their hands. The discipline, preparation, and responsibility required mirror the stewardship God calls us to in every area of life.'
  },
  {
    id:'project-manager',icon:'📋',name:'Project Manager',
    salary:'$65k-$130k+',tag:'Business',tagColor:'#fbbf24',
    desc:'Lead teams and manage complex projects from start to finish across any industry.',
    overview:'Project managers are needed in every industry. They plan, execute, and close projects on time and on budget. Strong PMs are rare and highly valued. The role develops transferable skills in leadership, communication, risk management, and strategic thinking.',
    path:'Bachelor degree in business or related field. PMP certification from PMI is the gold standard and significantly boosts earning potential. Many PMs start in coordinator roles or transition from technical positions.',
    why:'Universal demand across all industries, strong salaries, leadership development, and variety in every project.',
    dayInLife:'Lead team meetings, track project timelines and budgets, remove blockers for team members, communicate with stakeholders, update project plans, manage risks, create status reports. High collaboration role — you are the hub that keeps everything moving.',
    salaryRange:'Entry/Associate PM: $55k-$70k | Mid-level PM: $75k-$100k | Senior PM: $100k-$130k | Program Manager: $120k-$160k | Director of PMO: $150k-$200k+',
    howToStart:'Any bachelor degree works. Get experience leading projects in any context (school, volunteer, work). Earn PMP (Project Management Professional) certification after 3 years experience — this is the industry gold standard. Agile/Scrum certifications (CSM, PSM) are valuable for tech. Entry-level: look for Project Coordinator or Associate PM roles.',
    skills:'Communication, organization, leadership, risk management, budgeting, stakeholder management, conflict resolution, tools (Jira, Asana, MS Project, Monday.com), Agile and Waterfall methodologies.',
    timeline:'Entry role as coordinator (1-2 years) → Project Manager (2-4 years) → PMP certification → Senior PM (5-8 years) → Program/Portfolio Manager (8+ years)',
    resources:['PMI.org (Project Management Institute)','Google Project Management Certificate on Coursera (free)','PMP exam prep courses','Agile Alliance (agilealliance.org)'],
    faithAngle:'Project management is the art of bringing order from chaos and helping groups of people accomplish together what none could do alone — a direct reflection of how God designs community.'
  },
  {
    id:'graphic-designer',icon:'🎨',name:'Graphic Designer',
    salary:'$40k-$85k',tag:'Creative',tagColor:'#ec4899',
    desc:'Create visual content for brands, marketing, web, print, and media.',
    overview:'Graphic designers create visual concepts using software to communicate ideas. They develop layouts for websites, advertisements, brochures, magazines, packaging, and corporate branding. The field is evolving rapidly with AI tools and motion graphics becoming increasingly important.',
    path:'Bachelor degree in graphic design or related field, though a strong portfolio can outweigh formal education. Master Adobe Creative Suite, Figma, and basic motion graphics. Freelancing is common and a great way to build your portfolio.',
    why:'Creative expression meets real-world impact, freelance flexibility, growing demand for digital content, and every business needs design.',
    dayInLife:'Create visual concepts for brands, websites, marketing materials, social media, packaging. Meet with clients to understand needs, sketch concepts, work in Adobe Creative Suite or Figma, revise based on feedback, prepare files for print or digital delivery.',
    salaryRange:'Entry/Junior: $35k-$48k | Mid-level: $50k-$70k | Senior: $70k-$95k | Art Director: $90k-$130k | Freelance: $25-$150+/hour depending on specialization and clients',
    howToStart:'Bachelor degree in graphic design, visual communication, or fine arts is traditional. Alternatively: self-teach through YouTube and online courses + build a strong portfolio. Bootcamps (3-6 months) can accelerate. Your portfolio matters more than your degree — show 8-12 of your best projects.',
    skills:'Adobe Photoshop, Illustrator, InDesign, Figma. Typography, color theory, layout, branding, UI/UX fundamentals, print production, creative problem-solving, client communication.',
    timeline:'Self-taught portfolio (6-12 months) → freelance or junior role | Degree (4 years) → entry role immediately | 3-5 years → mid/senior | 7+ years → art director potential',
    resources:['Skillshare and YouTube for tutorials','Behance.net for portfolio hosting and inspiration','Dribbble.com for design community','Google UX Design Certificate on Coursera'],
    faithAngle:'Design is visual communication — the ability to take complex ideas and make them beautiful and accessible. Creating beauty that serves others is a gift you can steward.'
  },
  {
    id:'pharmacy-tech',icon:'💊',name:'Pharmacy Technician',
    salary:'$35k-$50k',tag:'Healthcare',tagColor:'#22d3ee',
    desc:'Assist pharmacists with dispensing medications and managing prescriptions.',
    overview:'Pharmacy technicians work in retail pharmacies, hospitals, and mail-order facilities. They receive and fill prescriptions, manage inventory, process insurance claims, and assist customers. Hospital pharmacy techs often earn more and work in specialized areas like IV compounding.',
    path:'High school diploma plus on-the-job training, though certification through PTCB significantly improves job prospects and pay. Many community colleges offer pharmacy technician certificate programs that can be completed in under a year.',
    why:'Quick entry into healthcare, stable demand, stepping stone to pharmacist if desired, and the satisfaction of helping people with their health.',
    dayInLife:'Fill prescriptions, count and label medications, manage inventory, process insurance claims, assist pharmacists, interact with customers. Work in retail pharmacies, hospitals, or mail-order facilities. Standing for long shifts, high accuracy required.',
    salaryRange:'Entry: $30k-$36k | Experienced: $36k-$45k | Hospital/Specialized: $40k-$52k | Lead Tech: $45k-$55k',
    howToStart:'High school diploma + on-the-job training (some states) OR pharmacy technician certificate program (6-12 months). Pass the PTCB (Pharmacy Technician Certification Board) exam for national certification. Most states require registration or licensure.',
    skills:'Attention to detail (medication errors can be fatal), math, customer service, organization, knowledge of drug names and interactions, insurance processing, inventory management.',
    timeline:'Certificate program (6-12 months) → PTCB exam → Employed. Very fast pathway from decision to career. Can advance to lead tech, then pharmacy school for PharmD if desired.',
    resources:['PTCB.org for certification info','PharmacyTechnicianSchools.com','local community college programs','CVS and Walgreens both offer training programs'],
    faithAngle:'Pharmacy technicians are healthcare workers who directly impact whether patients receive the right medication safely. Accuracy and care in this role is a form of loving your neighbor.'
  },
  {
    id:'logistics',icon:'🚚',name:'Logistics / Supply Chain Manager',
    salary:'$55k-$110k',tag:'Business',tagColor:'#fb923c',
    desc:'Manage the movement of goods from manufacturers to consumers.',
    overview:'Supply chain professionals keep the world running. They coordinate the flow of materials, products, and information across global networks. The field exploded in visibility during COVID when supply chain disruptions affected everyone. Demand for skilled logistics professionals has never been higher.',
    path:'Bachelor degree in supply chain management, business, or related field. APICS CSCP or CPIM certification is highly valued. Many enter through warehouse management, purchasing, or transportation coordinator roles.',
    why:'Critical industry with strong growth, competitive salaries, global opportunities, and the intellectual challenge of optimizing complex systems.',
    dayInLife:'Coordinate the movement of goods from manufacturers to consumers. Manage warehouses, shipping schedules, vendor relationships, inventory levels, and transportation routes. Analyze data to optimize efficiency and reduce costs. Problem-solve when shipments are delayed or demand spikes.',
    salaryRange:'Entry (Coordinator): $40k-$52k | Mid (Manager): $60k-$85k | Senior Manager: $85k-$120k | Director: $120k-$160k | VP of Supply Chain: $150k-$250k+',
    howToStart:'Bachelor degree in supply chain management, business, or logistics. Internships at logistics companies, manufacturers, or retailers. Entry roles: logistics coordinator, inventory analyst, procurement assistant. APICS/ASCM certifications (CSCP, CPIM) significantly boost career progression.',
    skills:'Analytical thinking, Excel/data analysis, ERP systems (SAP, Oracle), negotiation, vendor management, problem-solving under pressure, communication, understanding of global trade and regulations.',
    timeline:'Bachelor degree → Coordinator role (1-2 years) → Manager (3-5 years) → Senior Manager (5-8 years) → Director/VP (10+ years). Certifications accelerate at every level.',
    resources:['ASCM.org (Association for Supply Chain Management)','CSCMP.org','MIT MicroMasters in Supply Chain on edX','LinkedIn Learning supply chain courses'],
    faithAngle:'Supply chain professionals ensure that food, medicine, and essential goods reach the people who need them. During crises, this work becomes visibly life-saving.'
  },
  {
    id:'auto-mechanic',icon:'🔧',name:'Auto Mechanic / Technician',
    salary:'$35k-$75k+',tag:'Trades',tagColor:'#94a3b8',
    desc:'Diagnose, repair, and maintain vehicles — increasingly including EVs and hybrids.',
    overview:'Modern auto technicians are highly skilled professionals who use computerized diagnostic equipment alongside traditional tools. The shift to electric and hybrid vehicles is creating new specialization opportunities. Dealership techs often earn more than independent shop mechanics, and specialized techs (diesel, EV, European) command premium rates.',
    path:'Technical school certificate or associate degree in automotive technology. ASE certification is the industry standard. Many dealerships offer paid apprenticeship programs. Specializing in EVs or diesel significantly increases earning potential.',
    why:'Hands-on work with tangible results, growing EV specialization demand, ability to start your own shop, and vehicles will always need service.',
    dayInLife:'Diagnose vehicle problems using diagnostic computers and manual inspection. Repair and replace parts — brakes, engines, transmissions, electrical systems. Perform maintenance services (oil changes, tire rotations). Explain repairs to customers. Physical work in a shop environment.',
    salaryRange:'Entry/Lube Tech: $28k-$35k | General Mechanic: $40k-$55k | Certified Master Tech: $55k-$80k | Specialized (diesel, European): $65k-$100k+ | Shop Owner: $80k-$200k+',
    howToStart:'Vocational/trade school program (6 months-2 years) OR apprenticeship at a shop. ASE (Automotive Service Excellence) certifications are the industry standard — earn them progressively. Many dealerships offer paid training programs. Start as a lube tech or general service tech and work up.',
    skills:'Mechanical aptitude, diagnostic thinking, physical stamina, tool proficiency, electrical/computer systems knowledge, customer communication, continuous learning (cars change every year).',
    timeline:'Trade school or apprenticeship (6-24 months) → General tech (1-3 years) → ASE certifications → Master Tech (5-8 years) → Shop foreman or own shop (10+ years)',
    resources:['ASE.com for certification info','UTI (Universal Technical Institute)','local community college automotive programs','manufacturer-specific training (Ford ASSET','Toyota T-TEN','GM ASEP)'],
    faithAngle:'Honest mechanics are rare and deeply valued. In a profession with a trust problem, being the person who tells the truth about what a car needs — and what it doesn\'t — is ministry in work clothes.'
  },
  {
    id:'marketing',icon:'📣',name:'Marketing / Digital Marketing',
    salary:'$45k-$110k+',tag:'Business',tagColor:'#a78bfa',
    desc:'Drive brand awareness, customer engagement, and revenue through strategic campaigns.',
    overview:'Digital marketing encompasses SEO, social media, content marketing, email campaigns, paid advertising, analytics, and brand strategy. Every business needs marketing, creating enormous demand. The field rewards creativity, analytical thinking, and adaptability as platforms and algorithms constantly evolve.',
    path:'Bachelor degree in marketing, communications, or business. Build real experience through internships, freelancing, or managing social media for local businesses. Google Analytics and Google Ads certifications are free and highly valued. HubSpot Academy offers free marketing certifications.',
    why:'Creative and analytical balance, remote work opportunities, measurable impact, and every business needs you.',
    dayInLife:'Create campaigns across social media, email, and search. Analyze data, write copy, manage budgets, A/B test. Fast-paced and creative.',
    salaryRange:'Entry: $38k-$50k | Mid: $55k-$80k | Senior: $85k-$130k | VP: $130k-$200k+ | CMO: $200k+',
    howToStart:'Degree in marketing OR free Google/HubSpot certifications plus personal projects. Start a blog or run ads for a local business.',
    skills:'Copywriting, data analysis, Google Analytics, SEO/SEM, social media, email marketing, paid ads, content strategy.',
    timeline:'Build skills (3-6 months) > Entry role (1-2 years) > Manager (3-5 years) > Director (5-8 years).',
    resources:['Google Digital Garage','HubSpot Academy','Meta Blueprint','Neil Patel blog'],
    faithAngle:'Using persuasion to promote products that genuinely help people rather than manipulate them is a choice that matters.'
  }
,
  {
    id:'firefighter',icon:'🔥',name:'Firefighter / EMT',
    salary:'$40k-$85k',tag:'Service',tagColor:'#ef4444',
    desc:'Save lives, fight fires, and serve your community on the front lines.',
    overview:'Firefighters respond to fires, medical emergencies, car accidents, and natural disasters. Most departments also provide EMT/paramedic services. The job is physically demanding and deeply rewarding. Many firefighters work 24-hour shifts followed by 48-72 hours off.',
    path:'High school diploma, EMT certification (3-6 months), fire academy (12-16 weeks). Many departments require paramedic certification for advancement. Volunteer firefighting is an excellent entry point.',
    why:'Meaningful life-saving work, strong brotherhood, excellent benefits, pension, flexible schedule, and community respect.',
    dayInLife:'Create campaigns across social media, email, search engines, and content platforms. Analyze data to understand what works. Write copy, design ads, manage budgets, A/B test, create content calendars. Fast-paced, creative, and data-driven simultaneously.',
    salaryRange:'Entry (Coordinator): $38k-$50k | Mid (Manager): $55k-$80k | Senior/Director: $85k-$130k | VP of Marketing: $130k-$200k+ | CMO: $200k-$400k+',
    howToStart:'Bachelor degree in marketing, communications, or business — OR build skills through Google certifications (free), HubSpot Academy (free), and personal projects. Start a blog, grow a social media account, or run ads for a local business to build real experience. Entry roles: social media coordinator, marketing assistant, content writer.',
    skills:'Copywriting, data analysis, social media platforms, Google Analytics, SEO/SEM, email marketing, paid advertising (Meta, Google Ads), content strategy, A/B testing, creative thinking.',
    timeline:'Build skills + certifications (3-6 months) → Entry role (1-2 years) → Manager (3-5 years) → Director (5-8 years). Digital marketing moves fast — continuous learning is required.',
    resources:['Google Digital Garage (free certifications)','HubSpot Academy (free)','Meta Blueprint (free)','Neil Patel blog and YouTube','MarketingProfs.com'],
    faithAngle:'Marketing is persuasion. Using that skill to promote products and causes that genuinely help people — rather than manipulate them — is a choice that matters more than most marketers realize.',
    dayInLife:'24-hour or 48-hour shifts at the station. Respond to fires, medical emergencies, car accidents, hazmat situations. Between calls: maintain equipment, train, exercise, cook meals, study. High adrenaline during calls, downtime between. Strong brotherhood/sisterhood culture.',
    salaryRange:'EMT-Basic: $30k-$40k | Firefighter: $45k-$65k | Firefighter/Paramedic: $55k-$80k | Captain: $75k-$100k | Battalion Chief: $100k-$140k+ | Overtime can add 20-40% to base pay',
    howToStart:'EMT-Basic certification (3-6 months, ~$1,000). Then firefighter academy (12-16 weeks). Apply to fire departments — many require EMT-B minimum, Paramedic preferred. Volunteer fire departments are excellent starting points. Physical fitness testing is required — start training early. Paramedic certification (1-2 years) significantly increases pay and opportunities.',
    skills:'Physical fitness, calm under extreme pressure, teamwork, medical knowledge, mechanical aptitude, problem-solving, compassion, ability to function with minimal sleep.',
    timeline:'EMT-B (3-6 months) → Volunteer/apply (1-2 years of applications is normal) → Academy (12-16 weeks) → Probationary firefighter (1 year) → Paramedic certification while working → Career advancement',
    resources:['National Registry of EMTs (NREMT.org)','local fire department ride-along programs','CPAT (Candidate Physical Ability Test) prep','Fire Science degree programs at community colleges'],
    faithAngle:'Running toward danger when everyone else runs away is the most literal form of laying down your life for others. First responders embody sacrificial service every shift.',
    dayInLife:'Create campaigns across social media, email, search engines, and content. Analyze data, write copy, manage budgets, A/B test, create content calendars. Fast-paced, creative, and data-driven.',
    salaryRange:'Entry: $38k-$50k | Mid: $55k-$80k | Senior/Director: $85k-$130k | VP: $130k-$200k+ | CMO: $200k-$400k+',
    howToStart:'Degree in marketing or communications, OR build skills through free Google and HubSpot certifications plus personal projects. Start a blog, grow a social account, or run ads for a local business.',
    skills:'Copywriting, data analysis, Google Analytics, SEO/SEM, social media, email marketing, paid ads (Meta, Google), content strategy, A/B testing.',
    timeline:'Build skills (3-6 months) → Entry role (1-2 years) → Manager (3-5 years) → Director (5-8 years). Continuous learning required.',
    resources:['Google Digital Garage (free)','HubSpot Academy (free)','Meta Blueprint (free)','Neil Patel blog'],
    faithAngle:'Marketing is persuasion. Using that skill to promote products that genuinely help people — rather than manipulate — is a choice that matters.'
  },
  {
    id:'chef',icon:'👨‍🍳',name:'Chef / Culinary Arts',
    salary:'$30k-$90k+',tag:'Hospitality',tagColor:'#fb923c',
    desc:'Create food experiences that bring people together.',
    overview:'Professional chefs work in restaurants, hotels, catering companies, hospitals, and private households. The path ranges from fast-casual to fine dining, food trucks to TV shows. Culinary arts combines creativity, business, chemistry, and leadership.',
    path:'Culinary school (optional but helpful), or work your way up from line cook. Start in any kitchen willing to teach. Certifications from the American Culinary Federation add credibility. Specializing (pastry, sushi, BBQ) can dramatically increase earning potential.',
    why:'Creative expression through food, entrepreneurship opportunities, travel, and the immediate gratification of making people happy.',
    dayInLife:'Menu development, food preparation, managing kitchen staff, ordering ingredients, maintaining food safety standards, plating and presentation. Long hours (10-14 hour days are common), hot kitchens, physically demanding. Nights, weekends, and holidays are standard work times.',
    salaryRange:'Line Cook: $28k-$38k | Sous Chef: $40k-$55k | Head Chef: $55k-$80k | Executive Chef: $75k-$120k+ | Celebrity/Restaurant Owner: $150k-$500k+ | Private Chef: $60k-$120k',
    howToStart:'Culinary school (2-4 years, $20k-$50k) OR start working in kitchens immediately as a prep cook and work your way up (the traditional path). Many successful chefs never went to culinary school. Stage (intern) at the best restaurant that will have you. Learn fundamentals: knife skills, mother sauces, heat control, timing.',
    skills:'Palate development, knife skills, heat and timing intuition, creativity, leadership, stress management, food safety (ServSafe certification), cost management, multitasking at extreme speed.',
    timeline:'Kitchen entry (prep/line cook): immediate → Culinary school or 2-3 years working up → Sous chef (3-5 years) → Head/Executive chef (7-12 years). Opening your own restaurant: 10+ years experience recommended.',
    resources:['ACF (American Culinary Federation)','ServSafe certification','CIA (Culinary Institute of America)','local community college culinary programs','Gordon Ramsay MasterClass','YouTube channels (Bon Appetit','Joshua Weissman)'],
    faithAngle:'Food brings people together. Every meal prepared with care is an act of service — feeding people is one of the most fundamental ways to show love.'
  },
  {
    id:'counselor',icon:'🧠',name:'Therapist / Counselor',
    salary:'$45k-$90k',tag:'Healthcare',tagColor:'#a78bfa',
    desc:'Help people overcome challenges and improve their mental health.',
    overview:'Licensed counselors and therapists work with individuals, couples, families, and groups dealing with mental health challenges, life transitions, trauma, and relationship issues. Demand has surged in recent years as mental health awareness grows. Many therapists eventually open private practices.',
    path:'Bachelor degree in psychology or related field, then a master degree in counseling or social work (2-3 years). Complete supervised clinical hours (2,000-4,000) and pass licensing exams. Specializations include marriage/family, substance abuse, child/adolescent, and trauma.',
    why:'Deeply meaningful work, growing demand, flexible schedule potential, private practice ownership, and making a lasting impact on lives.',
    dayInLife:'See 5-8 clients per day for 50-minute sessions. Listen, ask questions, help clients identify patterns, teach coping strategies, maintain confidential records, consult with other professionals. Emotionally demanding but deeply meaningful. Many therapists work in private practice with flexible schedules.',
    salaryRange:'Entry (LPC/LMFT associate): $40k-$52k | Licensed (3-5 years): $55k-$75k | Private Practice: $80k-$130k+ | Specialized (trauma, addiction): $90k-$150k | Psychologist (PhD): $80k-$160k+',
    howToStart:'Bachelor degree (psychology, social work, or related field) → Master degree in counseling, clinical psychology, social work, or marriage and family therapy (2-3 years) → Supervised clinical hours (2,000-4,000 depending on state) → Pass licensing exam (NCE, NCMHCE, or state exam) → Licensed practitioner.',
    skills:'Active listening, empathy, emotional regulation, clinical assessment, treatment planning, cultural sensitivity, ethics, documentation, self-care (burnout prevention), specialized modalities (CBT, EMDR, DBT, etc.).',
    timeline:'Bachelor (4 years) → Master (2-3 years) → Supervised hours (2-3 years) → Full licensure → Private practice possible. Total: 8-10 years from high school to independent practice.',
    resources:['ACA (American Counseling Association)','AAMFT.org','Psychology Today therapist directory','GradSchoolShopper.com for program research','BetterHelp/Talkspace for understanding the industry'],
    faithAngle:'Counseling is healing work. Helping people find freedom from anxiety, depression, trauma, and relational pain is one of the most Christlike professions you can pursue.'
  },
  {
    id:'it-support',icon:'🖥️',name:'IT Support / Systems Admin',
    salary:'$40k-$85k',tag:'Tech',tagColor:'#22d3ee',
    desc:'Keep technology running for businesses and organizations.',
    overview:'IT support professionals maintain computer systems, networks, and software for organizations. They troubleshoot problems, set up new equipment, manage security, and ensure business operations run smoothly. Every company needs IT support, making it one of the most stable career paths in tech.',
    path:'CompTIA A+ certification (entry-level), then Network+ and Security+ for advancement. Many roles require only certifications and experience rather than a degree. Help desk positions are common starting points that lead to system administrator and network engineer roles.',
    why:'High demand in every industry, clear certification path without requiring a degree, good salary growth, and constant learning.',
    dayInLife:'Troubleshoot hardware and software problems. Set up workstations, manage user accounts, maintain servers, handle help desk tickets, implement security updates, manage backups. Mix of hands-on technical work and user interaction. Can be in-office or remote.',
    salaryRange:'Help Desk/Tier 1: $35k-$48k | Desktop Support: $45k-$60k | Systems Administrator: $60k-$85k | Senior Sysadmin: $85k-$110k | IT Manager: $100k-$140k+ | DevOps Engineer: $100k-$160k+',
    howToStart:'CompTIA A+ certification (the entry point — study 2-3 months, exam ~$350). Then CompTIA Network+ and Security+. No degree required for many entry roles, though an associate or bachelor degree helps advancement. Build a home lab. Apply for help desk roles — this is where everyone starts.',
    skills:'Windows/Mac/Linux troubleshooting, networking (TCP/IP, DNS, DHCP), Active Directory, cloud platforms (AWS, Azure, Google Cloud), scripting (PowerShell, Bash), customer service, documentation, security fundamentals.',
    timeline:'CompTIA A+ (2-3 months) → Help Desk (1-2 years) → Network+/Security+ → Desktop Support/Jr Sysadmin (2-3 years) → Sysadmin (3-5 years) → Senior/Architect (5-10 years). Can branch into cybersecurity, cloud engineering, or DevOps.',
    resources:['CompTIA.org','Professor Messer (free YouTube training)','ITProTV','r/ITCareerQuestions on Reddit','AWS Free Tier for cloud practice'],
    faithAngle:'IT professionals serve by keeping systems running that others depend on. It is unseen, often thankless work — and it is essential. Faithfulness in the hidden work builds character that translates everywhere.'
  },
  {
    id:'photographer',icon:'📸',name:'Photographer / Videographer',
    salary:'$30k-$85k+',tag:'Creative',tagColor:'#ec4899',
    desc:'Capture moments, tell stories, and build a visual brand.',
    overview:'Professional photographers and videographers work in weddings, portraits, real estate, commercial advertising, journalism, sports, and social media content. The barrier to entry is low (you need a camera and skills) but building a sustainable business requires marketing, business sense, and a strong portfolio.',
    path:'No formal education required but courses in photography, lighting, and editing software help. Build a portfolio by shooting for free or cheap initially. Master Adobe Lightroom, Photoshop, and Premiere Pro. Specialize in a niche to stand out. Social media is your primary marketing tool.',
    why:'Creative freedom, flexible schedule, entrepreneurship, variety in every job, and the ability to work anywhere in the world.',
    dayInLife:'Shoot sessions or events, edit photos/video, meet clients, market your business. Freelance means handling everything yourself.',
    salaryRange:'Entry: $25k-$35k | Working: $40k-$60k | Established: $60k-$100k | Top: $100k-$200k+',
    howToStart:'Buy a used camera ($300-$600). Learn exposure, composition, lighting. Shoot constantly. Build a portfolio website.',
    skills:'Camera operation, lighting, composition, Lightroom, Photoshop, Premiere Pro, client communication, storytelling.',
    timeline:'Fundamentals (3-6 months) > First paid work (6-12 months) > Full-time viable (2-5 years) > Established (5+ years).',
    resources:['Peter McKinnon YouTube','CreativeLive','PPA (Professional Photographers of America)'],
    faithAngle:'Capturing moments families treasure for generations. Seeing beauty and preserving memory is a gift that serves others.'
  }
];



function buildCareers(){
  const el = document.getElementById('careerGrid'); if(!el) return;
  el.innerHTML = CAREERS.map(car => {
    const starred = (D.selectedCareers||[]).includes(car.name);
    return `
    <div class="cv-card ${starred?'starred':''}"
         onclick="openCareerModal('${car.id}')"
         data-name="${car.name}">
      <div class="cv-card-top">
        <div class="cv-card-icon">${car.icon}</div>
        <div class="cv-card-star" onclick="event.stopPropagation();toggleCareer(this,'${car.name}')"
             title="${starred?'Unstar':'Star this career'}">
          ${starred ? '⭐' : '☆'}
        </div>
      </div>
      <div class="cv-card-name">${car.name}</div>
      <div class="cv-card-salary">${car.salary}</div>
      <div class="cv-card-tag" style="background:${car.tagColor}22;color:${car.tagColor};">${car.tag}</div>
    </div>`;
  }).join('');
}

function toggleCareer(el, name){
  if(!D.selectedCareers) D.selectedCareers = [];
  const on = !D.selectedCareers.includes(name);
  if(on){
    D.selectedCareers.push(name);
    el.textContent = '⭐';
    el.closest('.cv-card').classList.add('starred');
  } else {
    D.selectedCareers = D.selectedCareers.filter(c => c !== name);
    el.textContent = '☆';
    el.closest('.cv-card').classList.remove('starred');
  }
  save();
}

function openCareerModal(id){
  const car = CAREERS.find(c => c.id === id); if(!car) return;
  const starred = (D.selectedCareers||[]).includes(car.name);

  document.getElementById('cmIcon').textContent  = car.icon;
  document.getElementById('cmName').textContent  = car.name;
  document.getElementById('cmTag').textContent   = car.tag;
  document.getElementById('cmTag').style.cssText =
    `background:${car.tagColor}22;color:${car.tagColor};`;
  document.getElementById('cmSalary').textContent = car.salary;
  document.getElementById('cmStarBtn').textContent = starred ? '⭐ Starred' : '☆ Star This Career';
  document.getElementById('cmStarBtn').onclick = () => {
    const btn = document.getElementById('cmStarBtn');
    if(!D.selectedCareers) D.selectedCareers = [];
    const idx = D.selectedCareers.indexOf(car.name);
    if(idx === -1){
      D.selectedCareers.push(car.name);
      btn.textContent = '⭐ Starred';
    } else {
      D.selectedCareers.splice(idx, 1);
      btn.textContent = '☆ Star This Career';
    }
    save(); buildCareers();
  };

  // Build body content
  document.getElementById('cmBody').innerHTML = `
    <div class="cm-section">
      <div class="cm-section-label">📋 Overview</div>
      <p class="cm-text">${car.overview}</p>
    </div>
    <div class="cm-section">
      <div class="cm-section-label">☀️ Day in the Life</div>
      <p class="cm-text">${car.dayInLife}</p>
    </div>
    <div class="cm-section">
      <div class="cm-section-label">💰 Salary Ranges</div>
      <p class="cm-text">${car.salaryRange}</p>
    </div>
    <div class="cm-section">
      <div class="cm-section-label">🚀 How to Get Started</div>
      <p class="cm-text">${car.howToStart}</p>
    </div>
    <div class="cm-section">
      <div class="cm-section-label">🛠 Key Skills</div>
      <p class="cm-text">${car.skills}</p>
    </div>
    <div class="cm-section">
      <div class="cm-section-label">⏱ Realistic Timeline</div>
      <p class="cm-text">${car.timeline}</p>
    </div>
    <div class="cm-section">
      <div class="cm-section-label">📚 Resources to Start</div>
      <ul class="cm-list">
        ${(car.resources||[]).map(r=>`<li>${r}</li>`).join('')}
      </ul>
    </div>
    ${car.faithAngle ? `
    <div class="cm-faith">
      <div class="cm-faith-label">✝ Faith Perspective</div>
      <p class="cm-faith-text">${car.faithAngle}</p>
    </div>` : ''}
  `;

  openModal('careerModal');
}

function addCustomCareer(){ const v=(document.getElementById('customCareer').value||'').trim(); if(!v) return; const el=document.getElementById('careerGrid'); if(!el) return; const div=document.createElement('div'); div.setAttribute('onclick',`toggleCareer(this,'${v}')`); div.style.cssText='padding:.65rem;background:rgba(255,255,255,.1);border-radius:9px;cursor:pointer;border:1px solid transparent;transition:all .14s;'; div.innerHTML=`<div style="font-size:1.4rem;">💡</div><div style="font-weight:700;font-size:.8rem;margin:.22rem 0;">${v}</div><div style="font-size:.68rem;color:#c8d4e8;">Your idea</div>`; el.appendChild(div); document.getElementById('customCareer').value=''; showToast('Career added!'); }

