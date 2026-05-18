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
  document.documentElement.removeAttribute('data-app-loading');
  if(!window._faithFree){
    var _mwEl = document.getElementById('mainWrap');
    if(_mwEl) _mwEl.style.visibility = 'visible';
  }
  if(typeof initSidebarCollapse === 'function') initSidebarCollapse();
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

// ── FAITH-ONLY HERO ("Enter The Well") ── window._faithFree users only ──────

// Varied stone fills for realistic well construction
const _FO_STONE_FILLS = [
  '#3a4150','#4a4d58','#525560','#42444f','#3d4250',
  '#525050','#4a4845','#3f3d3a','#48453f','#4d4c4a',
  '#3e3f48','#454751','#4b4e58','#3a3c46','#454854',
  '#4f4d48','#3c3e48','#494a52','#414048','#4a4d52'
];

function _foStone(x, y, w, h, idx) {
  const fill = _FO_STONE_FILLS[idx % _FO_STONE_FILLS.length];
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${fill}" stroke="#1a1d28" stroke-width=".4"/>` +
    `<rect x="${(x + 0.6).toFixed(1)}" y="${(y + 0.6).toFixed(1)}" width="${(w - 1.2).toFixed(1)}" height="1.8" rx=".5" fill="rgba(255,255,255,.08)"/>` +
    `<rect x="${(x + 0.6).toFixed(1)}" y="${(y + h - 2.4).toFixed(1)}" width="${(w - 1.2).toFixed(1)}" height="1.8" rx=".5" fill="rgba(0,0,0,.45)"/>`;
}

function _foWellStones() {
  const rows = [
    {y:278, sizes:[20,23,22,21,18]},
    {y:290, sizes:[17,24,21,18,24]},
    {y:302, sizes:[22,18,22,23,19]},
    {y:314, sizes:[17,22,24,20,21]},
    {y:326, sizes:[20,21,22,19,22]},
    {y:338, sizes:[17,25,20,23,19]},
  ];
  let out = '';
  let idx = 0;
  rows.forEach(row => {
    let x = 350;
    row.sizes.forEach(w => {
      out += _foStone(x, row.y, w - 1.5, 10, idx++);
      x += w;
    });
  });
  return out;
}

function _foMossPatch(cx, cy, scale) {
  const s = scale;
  return `<path d="M${(cx-12*s).toFixed(1)},${cy.toFixed(1)} ` +
    `Q${(cx-14*s).toFixed(1)},${(cy-3*s).toFixed(1)} ${(cx-8*s).toFixed(1)},${(cy-4*s).toFixed(1)} ` +
    `Q${(cx-3*s).toFixed(1)},${(cy-6*s).toFixed(1)} ${(cx+2*s).toFixed(1)},${(cy-4*s).toFixed(1)} ` +
    `Q${(cx+8*s).toFixed(1)},${(cy-5*s).toFixed(1)} ${(cx+12*s).toFixed(1)},${(cy-2*s).toFixed(1)} ` +
    `Q${(cx+14*s).toFixed(1)},${(cy+1*s).toFixed(1)} ${(cx+10*s).toFixed(1)},${(cy+3*s).toFixed(1)} ` +
    `Q${(cx+5*s).toFixed(1)},${(cy+4*s).toFixed(1)} ${(cx-2*s).toFixed(1)},${(cy+3*s).toFixed(1)} ` +
    `Q${(cx-8*s).toFixed(1)},${(cy+3*s).toFixed(1)} ${(cx-12*s).toFixed(1)},${cy.toFixed(1)}Z" ` +
    `fill="#1f3a17" opacity=".7"/>` +
    `<ellipse cx="${(cx-3*s).toFixed(1)}" cy="${(cy-1*s).toFixed(1)}" rx="${(3*s).toFixed(1)}" ry="${(1.5*s).toFixed(1)}" fill="#2c5020" opacity=".55"/>` +
    `<ellipse cx="${(cx+5*s).toFixed(1)}" cy="${(cy+1*s).toFixed(1)}" rx="${(2*s).toFixed(1)}" ry="${(1*s).toFixed(1)}" fill="#385c28" opacity=".45"/>`;
}

function _foRope() {
  let out = '';
  out += `<line x1="400" y1="216" x2="400" y2="266" stroke="#7a5f38" stroke-width="2.6" opacity=".92"/>`;
  out += `<line x1="400" y1="216" x2="400" y2="266" stroke="#a88752" stroke-width="1.4" opacity=".8"/>`;
  for (let y = 219; y < 263; y += 4) {
    out += `<line x1="398.6" y1="${y}" x2="401.4" y2="${y + 1.5}" stroke="#5a3f25" stroke-width="1" opacity=".75"/>`;
  }
  return out;
}

function _foStars(count) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const sx = +(8 + Math.random() * 784).toFixed(1);
    const sy = +(4 + Math.random() * 216).toFixed(1);
    const sr = +(0.3 + Math.random() * 2.1).toFixed(2);
    const baseOp = +(0.32 + Math.random() * 0.68).toFixed(2);
    const dimOp = +(baseOp * (0.1 + Math.random() * 0.3)).toFixed(2);
    const dur = +(2 + Math.random() * 4).toFixed(2);
    const del = +(Math.random() * 8).toFixed(2);
    const peakR = +(sr * (1.3 + Math.random() * 0.7)).toFixed(2);
    out += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="#fff" opacity="${baseOp}">` +
      `<animate attributeName="opacity" values="${baseOp};${dimOp};${baseOp}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/>` +
      `<animate attributeName="r" values="${sr};${peakR};${sr}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/>` +
      `</circle>`;
  }
  return out;
}

function _foFireflies(count) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const fx = Math.round(70 + Math.random() * 660);
    const fy = Math.round(205 + Math.random() * 135);
    const pts = ['0,0'];
    for (let k = 0; k < 4; k++) {
      pts.push(`${Math.round(-55 + Math.random() * 110)},${Math.round(-45 + Math.random() * 90)}`);
    }
    pts.push('0,0');
    const fdur = +(4 + Math.random() * 8).toFixed(1);
    const fdel = +(Math.random() * 6).toFixed(2);
    const fop = +(0.55 + Math.random() * 0.45).toFixed(2);
    const fr = +(1.5 + Math.random() * 1.7).toFixed(2);
    const path = pts.join(';');
    out += `<circle cx="${fx}" cy="${fy}" r="${fr}" fill="#fde68a" opacity="0" filter="url(#foBlurSm)">` +
      `<animate attributeName="opacity" values="0;${fop};${fop};${(fop * 0.5).toFixed(2)};0" dur="${fdur}s" begin="${fdel}s" repeatCount="indefinite"/>` +
      `<animateTransform attributeName="transform" type="translate" values="${path}" dur="${fdur}s" begin="${fdel}s" repeatCount="indefinite" additive="sum"/>` +
      `</circle>` +
      `<circle cx="${fx}" cy="${fy}" r="${(fr * 0.4).toFixed(2)}" fill="#fffce0" opacity="0">` +
      `<animate attributeName="opacity" values="0;1;1;.55;0" dur="${fdur}s" begin="${fdel}s" repeatCount="indefinite"/>` +
      `<animateTransform attributeName="transform" type="translate" values="${path}" dur="${fdur}s" begin="${fdel}s" repeatCount="indefinite" additive="sum"/>` +
      `</circle>`;
  }
  return out;
}

function _foGoldRise() {
  let out = '';
  for (let i = 0; i < 15; i++) {
    const startX = +(382 + Math.random() * 36).toFixed(1);
    const driftX = Math.round(-35 + Math.random() * 70);
    const riseY = -(70 + Math.round(Math.random() * 110));
    const dur = +(3.5 + Math.random() * 4).toFixed(2);
    const del = +(Math.random() * 7).toFixed(2);
    const r = +(1.2 + Math.random() * 1.5).toFixed(2);
    out += `<circle cx="${startX}" cy="272" r="${r}" fill="#fbbf24" opacity="0">` +
      `<animate attributeName="opacity" values="0;.95;.7;0" keyTimes="0;.15;.55;1" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/>` +
      `<animateTransform attributeName="transform" type="translate" values="0,0;${(driftX / 2).toFixed(1)},${(riseY / 2).toFixed(1)};${driftX},${riseY}" dur="${dur}s" begin="${del}s" repeatCount="indefinite" additive="sum"/>` +
      `</circle>`;
  }
  return out;
}

function launchFaithSparkles(count) {
  const hero = document.querySelector('.fo-hero');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  const n = count || 40;
  // Origin = well opening (~50% horizontal, ~72% vertical of hero)
  const wellX = rect.left + rect.width * 0.5;
  const wellY = rect.top + rect.height * 0.72;
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const sp = document.createElement('div');
      sp.className = 'fo-sparkle';
      const cx = wellX + (-30 + Math.random() * 60);
      const cy = wellY + (-8 + Math.random() * 16);
      const dx = Math.round(-90 + Math.random() * 180);
      const dy = Math.round(-200 + Math.random() * -60);
      const size = Math.round(8 + Math.random() * 12);
      const dur = Math.round(1200 + Math.random() * 1600);
      sp.style.cssText = `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;--dx:${dx}px;--dy:${dy}px;--dur:${dur}ms;`;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), dur + 100);
    }, i * 30);
  }
}

let _foSparkleIntervalId = null;
function startFaithSparkleLoop() {
  if (_foSparkleIntervalId) return;
  _foSparkleIntervalId = setInterval(() => {
    if (!document.querySelector('.fo-hero')) {
      clearInterval(_foSparkleIntervalId);
      _foSparkleIntervalId = null;
      return;
    }
    launchFaithSparkles(20);
  }, 5000);
}

let _foParallaxRAF = null;
let _foParallaxLastE = null;
function _foParallaxMove(e) {
  _foParallaxLastE = e;
  if (_foParallaxRAF) return;
  _foParallaxRAF = requestAnimationFrame(() => {
    _foParallaxRAF = null;
    if (!window._faithFree || !_foParallaxLastE) return;
    const hero = document.getElementById('faithHeroCinematic');
    if (!hero || hero.style.display === 'none') return;
    const ev = _foParallaxLastE;
    const x = (ev.clientX / window.innerWidth - 0.5) * 16;
    const y = (ev.clientY / window.innerHeight - 0.5) * 16;
    const stars = hero.querySelector('.fo-layer-stars');
    const moon = hero.querySelector('.fo-layer-moon');
    const mid = hero.querySelector('.fo-layer-mid');
    const fg = hero.querySelector('.fo-layer-fg');
    if (stars) stars.style.transform = `translate(${(x * 0.22).toFixed(2)}px,${(y * 0.22).toFixed(2)}px)`;
    if (moon) moon.style.transform = `translate(${(x * 0.45).toFixed(2)}px,${(y * 0.45).toFixed(2)}px)`;
    if (mid) mid.style.transform = `translate(${(x * 1).toFixed(2)}px,${(y * 1).toFixed(2)}px)`;
    if (fg) fg.style.transform = `translate(${(x * 2.4).toFixed(2)}px,${(y * 2.4).toFixed(2)}px)`;
  });
}
let _foParallaxAttached = false;
function attachFaithParallax() {
  if (_foParallaxAttached) return;
  document.addEventListener('mousemove', _foParallaxMove, { passive: true });
  _foParallaxAttached = true;
}

function renderFaithOnlyHero() {
  // Hide ALL home-dashboard elements — faith-free home is fullscreen "Enter The Well" only.
  // Entry to Bible Stories / Plans / Academy happens after click via wellGoto('home').
  ['heroGreeting','heroQuickActions','heroQuickStats','childDashContent',
   'heroTodaysVerse','heroReflectCard','heroHeadline','heroHeadlineCard',
   'faithEntryCards','dashboardWrap','dashGrid','heroDashStats','homeStatsGrid',
   'heroReflect','aiDailyReflection','homeStudyPartner','heroGoalRow',
   'todayVerseCard','heroVerseCard'
  ].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  // CSS hid #mainWrap early to prevent flash; dashboard elements are now hidden
  // via the loop above so it's safe to restore visibility before rendering The Well.
  var _mw = document.getElementById('mainWrap');
  if(_mw) _mw.style.visibility = 'visible';
  // Lock scroll so the hero fills the viewport without any overflow
  document.body.classList.add('ff-hero-active');

  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  let name = (typeof D !== 'undefined' && D && D.name) ? String(D.name).trim() : '';
  if (!name && typeof _supaUser !== 'undefined' && _supaUser) {
    const meta = _supaUser.user_metadata || {};
    name = (meta.first_name || (meta.name||'').split(/\s+/)[0] ||
            (meta.full_name||'').split(/\s+/)[0] || '').trim();
    if (!name && _supaUser.email)
      name = String(_supaUser.email).split('@')[0].split(/[.+_-]/)[0];
  }
  if (!name) name = 'friend';
  name = name.split(/\s+/)[0];
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  name = name.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]||c));

  // ── SVG mountain scene — sky, stars, moon, mountains, cross, birds, mist ──
  let svgStars = '';
  for(let i=0;i<72;i++){
    const sx=(5+Math.random()*380).toFixed(1);
    const sy=(8+Math.random()*258).toFixed(1);
    const sr=(0.4+Math.random()*2.0).toFixed(2);
    const sop=(0.35+Math.random()*0.65).toFixed(2);
    const sdur=(2.2+Math.random()*5.5).toFixed(1);
    const sdel=(Math.random()*9).toFixed(2);
    const smin=(sop*0.09).toFixed(3);
    svgStars+=`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="#fff" opacity="${sop}"><animate attributeName="opacity" values="${sop};${smin};${sop}" dur="${sdur}s" begin="${sdel}s" repeatCount="indefinite"/></circle>`;
  }

  const svgFullScene =
    `<svg class="fo-full-scene" viewBox="0 0 390 520" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">` +
    `<defs>` +
      `<linearGradient id="foMtnSky" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0%" stop-color="#060a1e"/>` +
        `<stop offset="45%" stop-color="#0a1530"/>` +
        `<stop offset="100%" stop-color="#091226"/>` +
      `</linearGradient>` +
      `<radialGradient id="foMtnMoonHalo" cx="50%" cy="50%" r="50%">` +
        `<stop offset="0%" stop-color="#c8c0a0" stop-opacity="0"/>` +
        `<stop offset="60%" stop-color="#c8c0a0" stop-opacity=".08"/>` +
        `<stop offset="100%" stop-color="#c8c0a0" stop-opacity="0"/>` +
      `</radialGradient>` +
      `<radialGradient id="foMtnCrossGlow" cx="50%" cy="50%" r="50%">` +
        `<stop offset="0%" stop-color="#fef3c7" stop-opacity=".9"/>` +
        `<stop offset="40%" stop-color="#fbbf24" stop-opacity=".4"/>` +
        `<stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>` +
      `</radialGradient>` +
      `<filter id="foMtnBlur" x="-100%" y="-100%" width="300%" height="300%">` +
        `<feGaussianBlur stdDeviation="4"/>` +
      `</filter>` +
      `<filter id="foMtnCrossBlur" x="-200%" y="-200%" width="500%" height="500%">` +
        `<feGaussianBlur stdDeviation="3"/>` +
      `</filter>` +
    `</defs>` +
    `<rect width="390" height="520" fill="url(#foMtnSky)"/>` +
    `<g class="fo-layer-stars">${svgStars}</g>` +
    `<g class="fo-layer-moon">` +
      `<circle cx="315" cy="82" r="80" fill="url(#foMtnMoonHalo)">` +
        `<animate attributeName="opacity" values="1;.55;1" dur="4s" repeatCount="indefinite"/>` +
      `</circle>` +
      `<circle cx="315" cy="82" r="42" fill="#d6d0be"/>` +
      `<circle cx="304" cy="74" r="7" fill="#c4bda8" opacity=".7"/>` +
      `<circle cx="326" cy="90" r="5" fill="#c4bda8" opacity=".6"/>` +
      `<circle cx="318" cy="68" r="3.5" fill="#c0b9a4" opacity=".55"/>` +
      `<circle cx="298" cy="88" r="4" fill="#c0b9a4" opacity=".5"/>` +
      `<circle cx="308" cy="70" r="42" fill="#e8e2ce" opacity=".12" filter="url(#foMtnBlur)"/>` +
    `</g>` +
    `<path d="M48,110 Q52,104 57,110 Q62,104 67,110" stroke="#1a2a3a" stroke-width="1.4" fill="none" opacity=".8"/>` +
    `<path d="M74,98 Q79,91 85,98 Q91,91 97,98" stroke="#1a2a3a" stroke-width="1.5" fill="none" opacity=".85"/>` +
    `<path d="M112,118 Q116,112 121,118 Q126,112 131,118" stroke="#1a2a3a" stroke-width="1.3" fill="none" opacity=".7"/>` +
    `<path d="M155,108 Q161,100 168,108 Q175,100 182,108" stroke="#1a2a3a" stroke-width="1.6" fill="none" opacity=".9"/>` +
    `<path d="M210,125 Q214,119 219,125 Q224,119 229,125" stroke="#1a2a3a" stroke-width="1.3" fill="none" opacity=".65"/>` +
    `<path d="M245,100 Q252,92 260,100 Q268,92 276,100" stroke="#1a2a3a" stroke-width="1.7" fill="none" opacity=".8"/>` +
    `<g class="fo-layer-mid">` +
      `<ellipse cx="195" cy="350" rx="280" ry="30" fill="#0d1f35" opacity=".6"/>` +
      `<path d="M0,380 Q40,310 80,340 Q120,290 160,330 Q200,280 240,325 Q280,300 320,335 Q355,305 390,330 L390,520 L0,520 Z" fill="#0c1928"/>` +
      `<path d="M0,400 Q50,345 100,370 Q145,320 185,355 Q225,310 265,350 Q305,325 350,360 Q370,348 390,355 L390,520 L0,520 Z" fill="#060e1a"/>` +
    `</g>` +
    `<g class="fo-layer-fg">` +
      `<path d="M0,430 Q30,395 70,410 Q105,370 145,400 Q170,340 195,308 Q220,340 245,400 Q285,370 325,405 Q360,388 390,410 L390,520 L0,520 Z" fill="#03070f"/>` +
      `<ellipse cx="195" cy="322" rx="55" ry="55" fill="url(#foMtnCrossGlow)">` +
        `<animate attributeName="opacity" values="1;.6;1" dur="3s" repeatCount="indefinite"/>` +
        `<animate attributeName="rx" values="55;68;55" dur="3s" repeatCount="indefinite"/>` +
        `<animate attributeName="ry" values="55;68;55" dur="3s" repeatCount="indefinite"/>` +
      `</ellipse>` +
      `<g filter="url(#foMtnCrossBlur)" opacity=".65">` +
        `<rect x="191" y="272" width="8" height="60" rx="2" fill="#fef9e7"/>` +
        `<rect x="177" y="288" width="36" height="7" rx="2" fill="#fef9e7"/>` +
      `</g>` +
      `<rect x="192" y="274" width="6" height="56" rx="1.5" fill="#fef3c7"/>` +
      `<rect x="178" y="289" width="34" height="6" rx="1.5" fill="#fef3c7"/>` +
      `<ellipse cx="100" cy="395" rx="130" ry="16" fill="#0d1e30" opacity=".55"/>` +
      `<ellipse cx="290" cy="408" rx="120" ry="14" fill="#0d1e30" opacity=".5"/>` +
      `<ellipse cx="195" cy="420" rx="200" ry="20" fill="#091526" opacity=".65"/>` +
      `<rect x="0" y="475" width="390" height="45" fill="#020509"/>` +
    `</g>` +
    `</svg>`;

  // ── Cinematic greeting (letter-by-letter) ──
  const greetingText = (greet + ', ' + name).toUpperCase();
  let greetingHtml = '';
  for (let i = 0; i < greetingText.length; i++) {
    const ch = greetingText[i];
    if (ch === ' ') { greetingHtml += '<span class="fo-gl-space">&nbsp;</span>'; continue; }
    const delay = (0.3 + i * 0.04).toFixed(3);
    greetingHtml += `<span class="fo-gl" style="animation-delay:${delay}s">${ch}</span>`;
  }

  const hero = document.getElementById('faithHeroCinematic');
  if (hero) {
    hero.style.display = '';
    hero.innerHTML =
      '<div class="fo-hero" id="faithOnlyHero">' +
        svgFullScene +
        '<div class="fo-hero-scrim"></div>' +
        '<div class="fo-hero-content">' +
          '<div class="fo-hero-greeting">' + greetingHtml + '</div>' +
          '<div class="fo-hero-title">' +
            '<span class="fo-title-1">WELCOME TO</span>' +
            '<span class="fo-title-2">THE WELL</span>' +
          '</div>' +
          '<p class="fo-hero-sub">' +
            '<span class="fo-quote-mark">“</span>Come, all you who are thirsty, come to the waters.<span class="fo-quote-mark">”</span>' +
            '<span class="fo-cite">— Isaiah 55:1</span>' +
          '</p>' +
        '</div>' +
        '<div class="fo-cta-zone">' +
          '<button class="fo-hero-cta" onclick="if(typeof wellGoto===\'function\')wellGoto(\'home\');else if(typeof showSection===\'function\')showSection(\'s-scripture\')">' +
            '<span class="fo-cta-spark">✦</span>' +
            '<span class="fo-cta-text">Enter The Well</span>' +
            '<span class="fo-cta-spark">✦</span>' +
            '<span class="fo-cta-shimmer"></span>' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // ── Entry cards & today's verse intentionally NOT rendered. ──
  // After clicking "Enter The Well", wellGoto('home') takes them inside where
  // they choose Bible Stories / Reading Plans / Faith Academy / Prayer.
  setTimeout(() => launchFaithSparkles(40), 1800);
  setTimeout(startFaithSparkleLoop, 5500);
  attachFaithParallax();
}



function foGotoTab(tab) {
  if (typeof showSection === 'function') showSection('s-scripture');
  setTimeout(function() { if (typeof bfTab === 'function') bfTab(tab); }, 60);
}

function renderHeroHeadline(){
  if(window._faithFree){ renderFaithOnlyHero(); return; }
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