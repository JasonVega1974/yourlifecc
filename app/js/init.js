/* =============================================================
   init.js — App bootstrap, DOMContentLoaded handlers,
             section init, first load logic
============================================================= */

// ── DEMO MODE ─────────────────────────────────────────────────
const IS_DEMO = new URLSearchParams(window.location.search).get('demo') === 'true';

// Per-user localStorage key for UI state flags (wizard-done, devotional-seen, etc.)
// that must survive cloudLoad() overwrites. Falls back to '_local' when no Supabase user.
function _ylccUserKey(base){
  var uid = (typeof _supaUser !== 'undefined' && _supaUser && _supaUser.id) ? _supaUser.id : 'local';
  return base + '_' + uid;
}

function loadDemoData(){
  D.name = 'Emma';
  D.chorePin = null;
  D.parentPIN = null;
  D.parentWizardDone = true;
  D.kidOnboardDone = true;
  D.streak = 14;
  D.lastCheckin = new Date().toISOString().slice(0,10);
  D.mode = 'high';
  D.faithMode = true;
  D.profile = { age:'16-17', sex:'F', education:'high', parentMode:false, parentName:'The Johnson Family' };

  // Finance
  D.bank = 487.50; D.bankLabel = 'Checking';
  D.bankSavAcct = 1240.00; D.bankSavAcctLabel = 'Savings';
  D.earnings = 320; D.allowance = 20;
  D.transactions = [
    {id:1,type:'income',amount:50,cat:'job',desc:'Babysitting',date:new Date().toISOString().slice(0,10)},
    {id:2,type:'expense',amount:12.99,cat:'food',desc:'Lunch with friends',date:new Date().toISOString().slice(0,10)},
    {id:3,type:'income',amount:20,cat:'allowance',desc:'Weekly allowance',date:new Date(Date.now()-86400000).toISOString().slice(0,10)},
  ];
  D.savingsGoals = [
    {id:1,name:'Emergency Fund',emoji:'🛡️',target:1000,current:650},
    {id:2,name:'New Car',emoji:'🚗',target:5000,current:1240},
    {id:3,name:'College',emoji:'🎓',target:3000,current:480},
  ];
  D.bills = [{id:1,name:'Phone Plan',amount:45,due:15,cat:'utilities'}];

  // School
  D.classes = [
    {id:1,name:'AP English',teacher:'Mrs. Garcia',grade:94,target:95,color:'#38bdf8'},
    {id:2,name:'Algebra II',teacher:'Mr. Thompson',grade:88,target:90,color:'#a78bfa'},
    {id:3,name:'US History',teacher:'Ms. Chen',grade:92,target:90,color:'#22c55e'},
    {id:4,name:'Biology',teacher:'Mr. Davis',grade:85,target:88,color:'#fbbf24'},
  ];
  D.gpaTarget = 4.0;
  D.assignments = [
    {id:1,subject:'AP English',title:'Essay — The Great Gatsby',type:'essay',due:new Date(Date.now()+2*86400000).toISOString().slice(0,10),done:false},
    {id:2,subject:'Algebra II',title:'Chapter 7 Problem Set',type:'homework',due:new Date(Date.now()+86400000).toISOString().slice(0,10),done:false},
    {id:3,subject:'US History',title:'Chapter 12 Reading',type:'reading',due:new Date(Date.now()-86400000).toISOString().slice(0,10),done:true},
  ];
  D.studyLog = [
    {id:1,subject:'AP English',mins:45,date:new Date().toLocaleDateString()},
    {id:2,subject:'Algebra II',mins:30,date:new Date(Date.now()-86400000).toLocaleDateString()},
  ];

  // Health
  const today = new Date();
  D.moods = Array.from({length:12},(_,i)=>({
    date:new Date(today.getTime()-i*86400000).toISOString().slice(0,10),
    level:[4,5,3,5,4,4,5,3,4,5,4,3][i], note:i===0?'Great day!':''
  }));
  D.weightLog = [
    {id:1,weight:128,date:'2026-03-01'},{id:2,weight:127,date:'2026-03-08'},
    {id:3,weight:126.5,date:'2026-03-15'},{id:4,weight:126,date:'2026-03-22'},
  ];
  D.weightGoal = 120;
  D.macroGoals = {cal:1800,pro:120,carb:180,fat:60};

  // Goals & Journal
  D.goals = [
    {id:1,text:'Read 12 books this year',done:false},
    {id:2,text:'Get into a 4-year university',done:false},
    {id:3,text:'Save $5,000 for a car',done:false},
    {id:4,text:'Run a 5K',done:true,achievedDate:'March 10, 2026'},
    {id:5,text:'Learn to cook 5 new meals',done:true,achievedDate:'February 28, 2026'},
  ];
  D.journal = [
    {id:1,title:'Why I want to study medicine',body:'Today in biology we talked about how the immune system works and I just realized this is exactly what I want to do with my life...',cat:'goal',date:new Date().toLocaleDateString(),time:'8:42 PM'},
    {id:2,title:'Grateful for today',body:'Mom surprised me with my favorite dinner and we just talked for like an hour. Those moments matter.',cat:'gratitude',date:new Date(Date.now()-86400000).toLocaleDateString(),time:'9:15 PM'},
  ];
  D.milestones = [
    {id:1,date:'2026-03-10',title:'Completed first 5K race',cat:'health',emoji:'🏃'},
    {id:2,date:'2026-02-14',title:'Honor Roll — 2nd semester',cat:'academic',emoji:'🎓'},
    {id:3,date:'2026-01-01',title:'Started saving for a car',cat:'financial',emoji:'💰'},
  ];

  // Chores & Rewards
  D.choreList = [
    {id:1,name:'Clean Room',emoji:'🧹',pts:10,active:true},
    {id:2,name:'Do Dishes',emoji:'🍽️',pts:5,active:true},
    {id:3,name:'Take Out Trash',emoji:'🗑️',pts:5,active:true},
    {id:4,name:'Vacuum Living Room',emoji:'🧽',pts:10,active:true},
    {id:5,name:'Help with Laundry',emoji:'👕',pts:8,active:true},
  ];
  D.chorePoints = {total:185,week:35};
  D.pb = {
    balance:120,
    log:[
      {id:1,type:'earn',amount:10,reason:'Cleaned room',date:'2026-03-22'},
      {id:2,type:'earn',amount:5,reason:'Did dishes',date:'2026-03-23'},
      {id:3,type:'earn',amount:50,reason:'Great week bonus!',date:'2026-03-20'},
    ],
    storeItems:[
      {id:1,emoji:'🎬',name:'Movie Night Pick',cost:50,active:true},
      {id:2,emoji:'🍕',name:'Pizza for Dinner',cost:75,active:true},
      {id:3,emoji:'😴',name:'Stay Up 1hr Late',cost:30,active:true},
    ],
    spinTickets:2, scratchTickets:1, spinnerSlices:[],
  };

  // Faith
  D.scrPoints = 45;
  D.scrReadDays = {};
  D.prayers = [
    {id:1,text:'For my AP English grade to improve',date:'2026-03-20'},
    {id:2,text:'For my grandma health',date:'2026-03-18'},
  ];

  // Books & Mentors
  D.books = [
    {id:1,title:'Atomic Habits',author:'James Clear',status:'done',finished:'2026-02-15'},
    {id:2,title:'Rich Dad Poor Dad',author:'Robert Kiyosaki',status:'reading'},
    {id:3,title:'The 7 Habits of Highly Effective Teens',author:'Sean Covey',status:'want'},
  ];
  D.mentors = [
    {id:1,name:'Dr. Sarah Mitchell',role:'counselor',email:'smitchell@school.edu',notes:'My school counselor — great for college advice',emoji:'🧠',roleLabel:'Counselor'},
    {id:2,name:'Coach Williams',role:'coach',phone:'(208) 555-0124',notes:'Track coach, always motivating',emoji:'🏅',roleLabel:'Coach'},
  ];

  // Skills & CBT progress
  D.skillCerts = {'ls-money':true,'ls-cooking':true};
  D.cbtProgress = {basics:{0:true,1:true,2:true},windows:{0:true,1:true}};

  // Screen time
  D.screenTime = {games:{earned:60,used:30},tv:{earned:90,used:45},phone:{earned:120,used:80}};

  // Growing Up topics read
  D.growingUpRead = {'emotions':'2026-03-15','self-worth':'2026-03-10','time-management':'2026-03-05'};

  // Profiles (multi-profile — parent + Emma)
  D._profiles = [
    {id:'demo-parent',name:'The Johnson Family',isParent:true,avatar:'👨‍👩‍👧'},
    {id:'demo-emma',name:'Emma',isParent:false,avatar:'👧',age:'16-17',sex:'F',color:'#38bdf8'},
  ];
  D._activeProfileId = 'demo-emma';
}

// ── INIT ──────────────────────────────────────────────────────
async function init(){
  // ── DEMO MODE SHORTCUT ────────────────────────────────────
  if(IS_DEMO){
    loadDemoData();
    setSyncSt('local');
    window.save = function(){ /* no-op in demo — nothing persists */ };
    window.cloudSync = function(){ /* no-op in demo */ };
    finishInit();
    return;
  }

  setSyncSt('loading');

  // Check for existing Supabase session
  const supa = getSupabase();
  if(supa){
    supa.auth.onAuthStateChange(function(event, session){
      if(session && session.user){
        _supaUser = session.user;
        if(event === 'TOKEN_REFRESHED') cloudSync();
      } else if(event === 'SIGNED_OUT'){
        _supaUser = null;
        setSyncSt('local');
      }
    });

    const { data: { session } } = await supa.auth.getSession();
    if(session?.user){
      _supaUser = session.user;

      const blocked = await checkPlanStatus();
      if(blocked) return;

      const loaded = await cloudLoad();
      if(!loaded){ loadData(); setTimeout(cloudSync, 1500); }
      setSyncSt(loaded ? 'cloud' : 'cloud');
      if(!D.ageBracket && !IS_DEMO && !window._faithFree && _isChildProfileActive()){
        showAgePickerModal(function(){
          if(!D.parentPinHash && !D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
          finishInit(true);
          setTimeout(setupContestFreeUser, 500);
        });
        return;
      }
      if(!D.parentPinHash && !D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
      finishInit(true);
      setTimeout(setupContestFreeUser, 500);
      return;
    }
  } else {
    loadData();
    setSyncSt('local');
    if(!D.ageBracket && !IS_DEMO && !window._faithFree && _isChildProfileActive()){
      showAgePickerModal(function(){
        if(!D.parentPinHash && !D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
        finishInit();
      });
      return;
    }
    if(!D.parentPinHash && !D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
    finishInit();
    return;
  }

  document.getElementById('authScreen').style.display = 'flex';
}

// ── PHASE 2.1 AGE PICKER ─────────────────────────────────────
const _AGE_BRACKET_ALLOWLISTS = {
  '12_14': new Set(['chores','goals','mood','reading','scripture','rewards','flashcards']),
  '15_17': new Set(['chores','goals','mood','reading','scripture','rewards','school','health','finance','driving','skills','flashcards']),
  '18_22': null,
};

function _bracketAllowedKeys(bracket){
  if(!bracket) return null;
  return _AGE_BRACKET_ALLOWLISTS[bracket] || null;
}

let _agePickerCallback = null;

function _isChildProfileActive(){
  if(typeof _profiles === 'undefined' || !Array.isArray(_profiles)) return false;
  if(typeof _activeProfileId === 'undefined' || !_activeProfileId) return false;
  const ap = _profiles.find(p => p && p.id === _activeProfileId);
  return !!(ap && ap.isParent === false);
}

function showAgePickerModal(callback){
  _agePickerCallback = (typeof callback === 'function') ? callback : null;
  const m = document.getElementById('agePickerModal');
  if(m) m.style.display = 'flex';
}

function selectAgeBracket(bracket){
  if(!['12_14','15_17','18_22'].includes(bracket)) return;
  if(typeof D === 'undefined' || !D) return;
  D.ageBracket = bracket;
  applyAgeBracketSections(bracket);
  if(typeof save === 'function') save();
  const m = document.getElementById('agePickerModal');
  if(m) m.style.display = 'none';
  const cb = _agePickerCallback;
  _agePickerCallback = null;
  if(typeof cb === 'function') cb();
}

function applyAgeBracketSections(bracket){
  if(!D.sections) D.sections = {};
  const allow = _bracketAllowedKeys(bracket);
  if(typeof ALL_SECTIONS === 'undefined') return;
  ALL_SECTIONS.forEach(function(s){
    const key = s.id.replace('s-','');
    if(allow === null){
      if(D.sections[key] === 0) delete D.sections[key];
    } else {
      D.sections[key] = allow.has(key) ? 1 : 0;
    }
  });
}

function finishInit(cloudReady){
  if(D.sections){
    const FORCE = ['cbt','resume','motivation','mentors','christianLiving','worship','scripture'];
    const allowed = (typeof _bracketAllowedKeys === 'function') ? _bracketAllowedKeys(D.ageBracket) : null;
    FORCE.forEach(function(k){
      if(k === 'cbt'){ delete D.sections[k]; return; }
      if(allowed === null || allowed.has(k)) delete D.sections[k];
    });
  }
  // Belt+suspenders: force CBT on
  if(D.sections && D.sections.cbt===0) delete D.sections.cbt;

  // ── PERMANENT FIX: remove the old heroCard from the DOM entirely ──
  // The #heroCard element (Good Evening / CHAMPION / clock) is replaced
  // by the new Phase C hero greeting. Remove it on every init so no JS
  // or CSS rule can ever show it again.
  document.getElementById('heroCard')?.remove();

  // Apply saved theme
  applyTheme();
  applyPalette();
  applyHeroBg();
  buildSideNav();
  if(typeof renderBottomTabBar === 'function') renderBottomTabBar();
  if(typeof renderAllTabLandings === 'function') renderAllTabLandings();
  if(typeof _lastRenderedProfileId !== 'undefined'){
    _lastRenderedProfileId = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
  }
  let _defaultLanding = 's-hero';
  showSection(_defaultLanding);
  if(typeof trackSection === 'function') trackSection(_defaultLanding);
  const popupDelay = cloudReady ? 800 : 3500;
  setTimeout(function(){
    const today = new Date().toISOString().slice(0,10);
    const faithOn = !(D.settings && D.settings.faithMode===false);
    const wizardOpen = (document.getElementById('parentOnboard')||{}).classList&&document.getElementById('parentOnboard').classList.contains('open');
    const kidWizOpen = (document.getElementById('kidOnboard')||{}).classList&&document.getElementById('kidOnboard').classList.contains('open');
    const alreadyRead = D.scrReadDays && D.scrReadDays[today];
    const alreadySeen = localStorage.getItem(_ylccUserKey('ylcc_devPopupSeen')) === today || (D.devPopupSeen && D.devPopupSeen === today);
    if(!IS_DEMO && faithOn && !alreadyRead && !alreadySeen && !wizardOpen && !kidWizOpen){
      showDailyDevModal();
      try{ localStorage.setItem(_ylccUserKey('ylcc_devPopupSeen'), today); }catch(e){}
      D.devPopupSeen = today;
    }
  }, popupDelay);

  startClock();
  applySettings();
  applyChildAvatar();
  renderVerse();
  startVerseAutoRotation();
  if(typeof maybeShowOnboarding === 'function') maybeShowOnboarding();
  if(typeof startSessionTimer === 'function') startSessionTimer();
  setTimeout(function(){ if(_supaUser) cloudSync(); }, 1500);
  buildCheckins();
  updateStreak();
  updateQuickStats();

  // Finance
  const savedBankBal=D.bank||0, savedSavBal=D.bankSavAcct||0;
  const bbl=document.getElementById('bankBal'), sabl=document.getElementById('savAcctBal');
  const bll=document.getElementById('bankLbl'), sall=document.getElementById('savAcctLbl');
  if(bbl) bbl.value=savedBankBal||''; if(sabl) sabl.value=savedSavBal||'';
  if(bll) bll.value=D.bankLabel||''; if(sall) sall.value=D.bankSavAcctLabel||'';
  renderBankHist(); renderBills(); renderTx(); updateFinSum();

  // School
  renderClasses(); renderGPA(); refreshAsgClassSelect(); renderAsg(); renderStudyLog();

  // Schedule
  buildSchedule();

  // Calendar
  renderCalendar(); renderUpcoming();

  // Health
  updateWeightStats(); renderWeightList(); renderFoodLog(); updateMacros();

  // Goals
  renderGoals(); renderVision(); renderTimeline(); buildCareers();

  // Profile
  updateProfileButton(); applyProfileContext();

  // Growing Up
  buildGrowingGrid();

  // Life Skills
  buildSkillsGrid();

  // Craft / Gallery / Journal / Motivation
  buildCraftSection(); renderGallery(); renderJournal(); renderMotivation();
  loadBioFields();
  renderBooks(); renderMentors(); renderMilestones(); renderMoodTracker();
  renderChores();
  renderStudyPlan(); renderExams(); renderKidParentNotes();
  applyStageFilter();
  renderGettingStarted();
  renderMonthlyChallenge(); renderDailyPrompt(); renderBadges();
  initMusicAndSports();
  initDriving();
  initProfiles();
  initScreenTime(); renderEarnings();
  initBadgesPage();
  initScripture();
  if(typeof renderDevotionals==="function") renderDevotionals();
  if(typeof renderJesusGrid==="function") renderJesusGrid();
  if(typeof renderLearnBibleGrid==="function") renderLearnBibleGrid();
  if(typeof renderFaithJourney==="function") renderFaithJourney();
  if(typeof populateBibleBooks==="function") populateBibleBooks();
  (function(){
    var BF=["home","devotional","jesus","learnBible","reading","bible","journey","plans","prayer","memorize","academy","bibleworld","timeline"];
    BF.forEach(function(t){
      var el=document.getElementById("bf-"+t);
      if(el) el.style.display=t==="home"?"block":"none";
    });
    document.querySelectorAll(".scrTabs .tab").forEach(function(b){b.classList.remove("active");});
    var homeTab=document.querySelector('.scrTabs .tab[data-bf-tab="home"]');
    if(homeTab) homeTab.classList.add("active");
    if(typeof renderFaithHome==="function") renderFaithHome();
    if(typeof renderPlanCatalog==="function") renderPlanCatalog();
  })();
  initParentBucks();
  renderParentBucks();
  renderGameTickets();
  hookRewardTriggers();
  initQuizSystem();
  initCharacter();
  initSkillsGrid();
  if(typeof tgInitAll === 'function') tgInitAll();
  if(typeof loadCardPhotoOverrides === 'function') loadCardPhotoOverrides();
  updateHeroClock();
  renderHeroMotivation();
  renderDailyActivityCheck();
  renderLifeMapBoard();
  initContests();
  applyFaithMode();
  renderDevMap();
  initResources();

  if(!D.parentWizardDone
     && typeof _supaUser !== 'undefined' && _supaUser
     && _supaUser.user_metadata
     && _supaUser.user_metadata.signup_source === 'solo'){
    D.soloMode = true;
    D.parentWizardDone = true;
    try{ localStorage.setItem(_ylccUserKey('ylcc_parentWizardDone'), '1'); }catch(e){}
    if(typeof save === 'function') save();
    if(typeof applySoloMode === 'function') applySoloMode();
  }

  if(!IS_DEMO && !window._faithFree && !D.parentWizardDone && localStorage.getItem(_ylccUserKey('ylcc_parentWizardDone')) !== '1'){ setTimeout(showParentOnboard, 700); }

  // Macro goal inputs
  const g=D.macroGoals||{};
  ['goalCal','goalPro','goalCarb','goalFat'].forEach((id,i)=>{ const e=document.getElementById(id); const keys=['cal','pro','carb','fat']; if(e&&g[keys[i]]) e.value=g[keys[i]]; });

  // Today's date defaults
  const today=new Date().toISOString().split('T')[0];
  ['txDate','asgDue','evDate','wDate'].forEach(id=>{ const e=document.getElementById(id); if(e&&!e.value) e.value=today; });

  // Pre-fill budget if saved
  if(D.budgetIncome){ const bi=document.getElementById('budgInc'); if(bi) bi.value=D.budgetIncome; }
  if(D.budgetSavings){ const bs=document.getElementById('budgSav'); if(bs) bs.value=D.budgetSavings; }

  // Auto-open Parent Hub after onboarding flow
  if(localStorage.getItem('ylcc_goto_parent') === '1'){
    localStorage.removeItem('ylcc_goto_parent');
    setTimeout(function(){ showSection('s-parent'); }, 400);
  }
}


// ── CHILD PIN LOGIN — CLEAN DASHBOARD SWITCH ─────────────────
function switchToChild(){
  if(typeof lockParentDash === 'function') lockParentDash();
  if(typeof load === 'function') load();
  if(typeof _lastRenderedProfileId !== 'undefined'){
    _lastRenderedProfileId = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
  }
  if(typeof refreshDashForCurrentChild === 'function'){
    refreshDashForCurrentChild();
  }
  showSection('s-hero');
  if(typeof trackSection === 'function') trackSection('s-hero');
}

// ── HOME HEADLINE ─────────────────────────────────────────────
function summarizeChildStatus(){
  const today = new Date().toISOString().slice(0,10);
  const name = D.name || 'Your child';

  const activeChores = (D.choreList||[]).filter(c => c.active);
  const choresDue = activeChores.filter(c =>
    !(D.choreLog||[]).some(l => l.choreId === c.id && l.date === today &&
      (l.status === 'done' || l.status === 'pending' || l.status === 'verified'))
  ).length;

  const homeworkDue = (D.assignments||[]).filter(a => !a.done).length;
  const goalsActive = (D.goals||[]).filter(g => !g.done).length;

  let answer;
  if(choresDue === 0 && homeworkDue === 0){
    answer = name + ' is fully caught up today.';
  } else if(choresDue + homeworkDue <= 2){
    const parts = [];
    if(choresDue) parts.push(choresDue + ' chore' + (choresDue>1?'s':'') + ' left');
    if(homeworkDue) parts.push(homeworkDue + ' assignment' + (homeworkDue>1?'s':'') + ' pending');
    answer = 'Mostly on track — ' + parts.join(' and ') + '.';
  } else {
    answer = (choresDue + homeworkDue) + ' things still need attention today.';
  }

  const pills = [];
  if(choresDue > 0) pills.push({icon:'📋', label: choresDue + ' chore' + (choresDue>1?'s':'') + ' due', kind:'due'});
  if(homeworkDue > 0) pills.push({icon:'📚', label: homeworkDue + ' assignment' + (homeworkDue>1?'s':''), kind:'due'});
  if(goalsActive > 0) pills.push({icon:'🎯', label: goalsActive + ' active goal' + (goalsActive>1?'s':''), kind:'info'});

  return { question: 'How is ' + name + ' doing today?', answer, pills };
}

function renderHeroHeadline(){
  const q = document.getElementById('heroHeadlineQuestion');
  const a = document.getElementById('heroHeadlineAnswer');
  const p = document.getElementById('heroHeadlinePills');
  if(!q || !a || !p) return;

  const s = summarizeChildStatus();
  q.textContent = s.question;
  a.textContent = s.answer;
  p.innerHTML = s.pills.map(pill => {
    const dueStyle = 'background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);color:#fde68a;';
    const infoStyle = 'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#e2e8f0;';
    return '<span style="display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:99px;font-size:.74rem;' +
      (pill.kind==='due' ? dueStyle : infoStyle) + '">' + pill.icon + ' ' + pill.label + '</span>';
  }).join('');

  const m = document.getElementById('heroMicroStats');
  if(m){
    const streakVal = (D.streak||0) + ' day' + ((D.streak||0)===1?'':'s') + ' 🔥';
    const gpaVal = (typeof calcGPA==='function')
      ? (() => { const g = calcGPA(); return (g && !isNaN(g)) ? g.toFixed(2) : '—'; })()
      : '—';
    const moodArr = D.moods || [];
    const last = moodArr.length ? moodArr[moodArr.length-1] : null;
    const moodMap = {1:'😢', 2:'🙁', 3:'😐', 4:'🙂', 5:'😄'};
    const moodVal = last ? (moodMap[last.level] || '🙂') + ' ' + (last.date===new Date().toISOString().slice(0,10)?'today':'recent') : '—';
    const cards = [
      {l:'Streak', v: streakVal},
      {l:'GPA',    v: gpaVal},
      {l:'Mood',   v: moodVal},
    ];
    m.innerHTML = cards.map(c =>
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:10px 12px;">' +
        '<div style="font-size:.72rem;color:#64748b;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px;">' + c.l + '</div>' +
        '<div style="font-size:1rem;font-weight:700;color:var(--tx);">' + c.v + '</div>' +
      '</div>'
    ).join('');
  }

  renderHeroGreeting();
  renderHeroQuickStats();
  renderTodaysVerseHero();
}

// ── HERO GREETING ─────────────────────────────────────────────
function renderHeroGreeting(){
  const tEl = document.getElementById('heroGreetTime');
  const nEl = document.getElementById('heroGreetName');
  if(!tEl || !nEl) return;
  const hr = new Date().getHours();
  tEl.textContent = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  let name = (typeof D !== 'undefined' && D && D.name) ? String(D.name).trim() : '';
  if(!name && typeof _supaUser !== 'undefined' && _supaUser){
    const meta = _supaUser.user_metadata || {};
    name = (meta.first_name
         || (meta.name || '').split(/\s+/)[0]
         || (meta.full_name || '').split(/\s+/)[0]
         || '').trim();
    if(!name && _supaUser.email){
      name = String(_supaUser.email).split('@')[0].split(/[.+_-]/)[0];
    }
  }
  if(!name) name = 'friend';
  name = name.split(/\s+/)[0];
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  nEl.textContent = name;
}

// ── HERO QUICK STATS ──────────────────────────────────────────
function renderHeroQuickStats(){
  const sE = document.getElementById('heroQsStreak');
  const tE = document.getElementById('heroQsTasks');
  const pE = document.getElementById('heroQsPoints');
  if(!sE && !tE && !pE) return;
  const today = new Date().toISOString().slice(0,10);
  if(sE) sE.textContent = (D.streak || 0);
  if(tE){
    const choresDone = (D.choreLog||[]).filter(l =>
      l.date === today && (l.status === 'done' || l.status === 'verified')
    ).length;
    const asgDone = (D.assignments||[]).filter(a =>
      a.done && (a.doneDate === today || a.completedDate === today)
    ).length;
    tE.textContent = choresDone + asgDone;
  }
  if(pE){
    const cp = D.chorePoints;
    const chorePts = (cp && typeof cp === 'object') ? (cp.total || 0) : (cp || 0);
    const scrPts = D.scrPoints || 0;
    pE.textContent = chorePts + scrPts;
  }
}

// ── PHASE F — DAILY REFLECTION ────────────────────────────────
let _heroReflectQuestion = '';

function openHeroReflect(){
  const body = document.getElementById('heroReflectBody');
  const status = document.getElementById('heroReflectStatus');
  const q = document.getElementById('heroReflectQuestion');
  const ta = document.getElementById('heroReflectResponse');
  const acts = document.getElementById('heroReflectActions');
  const btn = document.getElementById('heroReflectBtn');
  if(!body) return;
  body.style.display = '';
  if(btn) btn.style.display = 'none';
  if(q){ q.style.display = 'none'; q.textContent = ''; }
  if(ta){ ta.style.display = 'none'; ta.value = ''; }
  if(acts) acts.style.display = 'none';
  if(status){
    status.style.display = '';
    status.textContent = '✨ Thinking…';
  }
  const verseText = (document.getElementById('heroTodaysVerseText')||{}).textContent || '';
  const verseRef  = (document.getElementById('heroTodaysVerseRef')||{}).textContent || '';
  let name = (D && D.name) ? String(D.name).trim().split(/\s+/)[0] : '';
  let mood = '';
  const today = new Date().toISOString().slice(0,10);
  const todayMood = (D.moods||[]).find(m => m.date === today);
  if(todayMood){
    const moodMap = {1:'rough',2:'low',3:'okay',4:'good',5:'great'};
    mood = moodMap[todayMood.level] || '';
  }
  const promptText = [
    verseText ? ('Verse: ' + verseText) : 'No specific verse today.',
    verseRef ? ('Reference: ' + verseRef.replace(/^—\s*/, '')) : '',
    name ? ('User name: ' + name) : '',
    mood ? ('Today\'s mood: ' + mood) : '',
    '',
    'Ask one warm reflection question.'
  ].filter(Boolean).join('\n');

  fetch('/api/ai-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'daily-reflection', prompt: promptText })
  })
  .then(r => r.ok ? r.json() : Promise.reject(r.status))
  .then(data => {
    if(!data || !data.text) throw new Error('Empty reflection');
    _heroReflectQuestion = data.text.trim();
    if(status) status.style.display = 'none';
    if(q){ q.textContent = _heroReflectQuestion; q.style.display = ''; }
    if(ta) ta.style.display = '';
    if(acts) acts.style.display = 'flex';
  })
  .catch(err => {
    if(status){
      status.innerHTML = '<span style="color:#f87171;">Couldn\'t connect — </span>'
        + '<button type="button" onclick="openHeroReflect()" style="background:none;border:none;color:#fbbf24;cursor:pointer;font-size:.85rem;font-weight:600;text-decoration:underline;font-family:var(--fm);">try again</button>';
    }
  });
}

function closeHeroReflect(){
  const body = document.getElementById('heroReflectBody');
  const btn = document.getElementById('heroReflectBtn');
  if(body) body.style.display = 'none';
  if(btn) btn.style.display = '';
}

// ── PHASE E — ONBOARDING OVERLAY ─────────────────────────────
let _onbCurrentStep = 1;
let _onbSelectedAge = null;
let _onbInterests = [];
let _onbFaith = 'yes';
let _onbReminder = 'on';

function maybeShowOnboarding(){
  if(typeof D === 'undefined' || !D) return;
  if(D.onboardingDone) return;
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO) return;
  if(typeof window !== 'undefined' && window._faithFree) return;
  const overlay = document.getElementById('onboardingOverlay');
  if(!overlay) return;
  _onbCurrentStep = 1;
  _onbSelectedAge = null;
  _onbInterests = [];
  _onbFaith = 'yes';
  _onbReminder = 'on';
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  const ni = document.getElementById('onbName');
  if(ni){
    let n = (D.name||'').trim();
    if(!n && typeof _supaUser !== 'undefined' && _supaUser){
      const meta = _supaUser.user_metadata || {};
      n = (meta.first_name || (meta.name||'').split(/\s+/)[0] || (meta.full_name||'').split(/\s+/)[0] || '').trim();
      if(!n && _supaUser.email) n = _supaUser.email.split('@')[0].split(/[.+_-]/)[0];
    }
    if(n){ ni.value = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase(); }
  }
  _onbShowStep(1);
}

function _onbShowStep(n){
  _onbCurrentStep = n;
  for(let i=1;i<=4;i++){
    const el = document.getElementById('onbStep'+i);
    if(!el) continue;
    el.style.display = (i === n) ? '' : 'none';
    el.classList.toggle('shown', i === n);
  }
  document.querySelectorAll('#onboardingOverlay .onb-dot').forEach(d => {
    const idx = parseInt(d.getAttribute('data-dot'));
    d.classList.remove('active', 'done');
    if(idx < n) d.classList.add('done');
    else if(idx === n) d.classList.add('active');
  });
  const back = document.getElementById('onbBackBtn');
  if(back) back.style.display = (n === 1) ? 'none' : 'flex';
  const overlay = document.getElementById('onboardingOverlay');
  if(overlay) overlay.scrollTop = 0;
  requestAnimationFrame(() => {
    const el = document.getElementById('onbStep'+n);
    if(el) el.classList.add('shown');
  });
}

function onbGoToStep(n){
  if(n < 1 || n > 4) return;
  _onbShowStep(n);
}

function onbBack(){
  if(_onbCurrentStep > 1) _onbShowStep(_onbCurrentStep - 1);
}

function onbSelectAge(bracket, btn){
  _onbSelectedAge = bracket;
  document.querySelectorAll('#onbStep2 .onb-card').forEach(c => c.classList.remove('selected'));
  if(btn) btn.classList.add('selected');
  setTimeout(() => onbGoToStep(3), 400);
}

function onbToggleInterest(key, btn){
  const idx = _onbInterests.indexOf(key);
  if(idx === -1) _onbInterests.push(key);
  else _onbInterests.splice(idx, 1);
  if(btn) btn.classList.toggle('selected', _onbInterests.indexOf(key) !== -1);
  const nextBtn = document.getElementById('onbStep3Next');
  if(nextBtn) nextBtn.disabled = _onbInterests.length === 0;
}

function onbSetFaith(val, btn){
  _onbFaith = val;
  document.querySelectorAll('#onbFaithToggle button').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function onbSetReminder(val, btn){
  _onbReminder = val;
  document.querySelectorAll('#onbReminderToggle button').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function onbComplete(){
  if(_onbSelectedAge && _onbSelectedAge !== 'parent') D.ageBracket = _onbSelectedAge;
  if(_onbSelectedAge === 'parent'){
    if(!D.profile) D.profile = {};
    D.profile.parentMode = true;
  }
  D.onboardingInterests = _onbInterests.slice();
  if(!D.settings) D.settings = {};
  D.settings.faithMode = (_onbFaith === 'yes');
  D.faithMode = D.settings.faithMode;
  D.dailyReminderOn = (_onbReminder === 'on');
  const ni = document.getElementById('onbName');
  const nameVal = ni ? ni.value.trim() : '';
  if(nameVal) D.name = nameVal;
  D.onboardingDone = true;
  if(typeof save === 'function') save();

  if(typeof applyName === 'function') applyName();
  if(typeof renderHeroGreeting === 'function') renderHeroGreeting();
  if(typeof applyStageFilter === 'function') applyStageFilter();

  if(typeof launchBigConfetti === 'function') launchBigConfetti();

  const overlay = document.getElementById('onboardingOverlay');
  if(overlay){
    overlay.style.transition = 'opacity .45s ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.style.opacity = '';
      overlay.style.transition = '';
      document.body.style.overflow = '';
      if(typeof showSection === 'function') showSection('s-hero');
    }, 450);
  } else {
    document.body.style.overflow = '';
    if(typeof showSection === 'function') showSection('s-hero');
  }
  if(typeof showToast === 'function') showToast('Welcome aboard 🎉');
}

function saveHeroReflect(){
  const ta = document.getElementById('heroReflectResponse');
  const responseText = ta ? ta.value.trim() : '';
  if(!_heroReflectQuestion && !responseText){
    closeHeroReflect();
    return;
  }
  if(!D.journal) D.journal = [];
  D.journal.unshift({
    id: Date.now(),
    text: (responseText || '(saved without a response)')
        + '\n\n— Reflection prompt: ' + _heroReflectQuestion,
    cat: 'reflection',
    date: new Date().toLocaleDateString()
  });
  if(D.journal.length > 500) D.journal = D.journal.slice(0, 500);
  save();
  showToast(responseText ? 'Reflection saved to journal ✓' : 'Closed');
  closeHeroReflect();
}

// ── TODAY'S VERSE on hero ─────────────────────────────────────
function renderTodaysVerseHero(){
  const card = document.getElementById('heroTodaysVerse');
  const reflectCard = document.getElementById('heroReflectCard');
  if(reflectCard) reflectCard.style.display = '';
  const pool = [].concat(
    (typeof VERSES !== 'undefined' && Array.isArray(VERSES)) ? VERSES : [],
    (typeof D !== 'undefined' && D && Array.isArray(D.verses)) ? D.verses : []
  );
  if(!pool.length){ card.style.display = 'none'; return; }
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const doy = Math.floor((now - start) / 86400000);
  const v = pool[doy % pool.length];
  if(!v || !v.t){ card.style.display = 'none'; return; }
  const txt = document.getElementById('heroTodaysVerseText');
  const ref = document.getElementById('heroTodaysVerseRef');
  if(txt) txt.textContent = '"' + v.t + '"';
  if(ref) ref.textContent = v.r ? '— ' + v.r : '';
  card.style.display = '';
}