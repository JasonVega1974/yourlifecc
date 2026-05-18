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

function _foStartCanvasScene() {
  if (window._foCanvasRaf) { cancelAnimationFrame(window._foCanvasRaf); window._foCanvasRaf = null; }
  var cv = document.getElementById('fo-canvas-scene');
  if (!cv) return;
  cv.width = cv.offsetWidth || 390;
  cv.height = cv.offsetHeight || 700;
  var ctx = cv.getContext('2d');
  var PI2 = Math.PI * 2, CYCLE = 60000;
  var _elapsed = 0, _lastTs = null, _rafPaused = false;
  var _visChange = function() {
    _rafPaused = document.hidden;
    if (!_rafPaused) _lastTs = null;
  };
  document.addEventListener('visibilitychange', _visChange);
  var _rsz;
  var _onResize = function() {
    clearTimeout(_rsz);
    _rsz = setTimeout(function() { if (cv.isConnected) { cv.width = cv.offsetWidth || 390; cv.height = cv.offsetHeight || 700; } }, 120);
  };
  window.addEventListener('resize', _onResize);

  // ── Static data ──
  var STARS = Array.from({length:65}, function() {
    return { x:0.02+Math.random()*0.96, y:0.03+Math.random()*0.44, r:0.5+Math.random()*1.5,
             op:0.35+Math.random()*0.65, tp:1800+Math.random()*4200, to:Math.random()*PI2 };
  });
  var CLOUDS = Array.from({length:5}, function() {
    return { x:Math.random(), y:0.22+Math.random()*0.17, sc:0.55+Math.random()*0.60,
             dp:55000+Math.random()*65000, dr:0.05+Math.random()*0.08, doff:Math.random()*PI2 };
  });
  var SPARKS = Array.from({length:32}, function(_,i) {
    return { x:i<20?0.30+Math.random()*0.40:0.08+Math.random()*0.84,
             y:i<20?0.55+Math.random()*0.28:0.35+Math.random()*0.48,
             r:0.7+Math.random()*1.6, fp:2200+Math.random()*3500,
             fo:Math.random()*PI2, op:0.28+Math.random()*0.55 };
  });
  var BIRDS = Array.from({length:5}, function() {
    return { x:Math.random(), y:0.09+Math.random()*0.19,
             sp:0.000012+Math.random()*0.000012, ws:4+Math.random()*9,
             dir:Math.random()>0.5?1:-1 };
  });
  var PUFFS = [[-.52,.20,.95,.52],[0,0,1.28,.62],[.52,.18,.95,.52],[.04,-.32,.65,.42]];

  // Sky phases [t, topRGB, botRGB]
  var SKY = [
    [0.000,[3,6,26],[7,13,40]],    [0.120,[30,12,48],[75,28,38]],
    [0.250,[122,48,16],[200,95,26]],[0.380,[55,114,195],[144,195,235]],
    [0.500,[30,100,195],[140,189,230]],[0.625,[180,96,36],[216,140,55]],
    [0.720,[60,18,64],[96,35,79]], [0.850,[12,10,32],[20,19,41]],
    [1.000,[3,6,26],[7,13,40]]
  ];

  var lr  = function(a,b,f){ return (a+(b-a)*f)|0; };
  var lrC = function(a,b,f){ return [lr(a[0],b[0],f),lr(a[1],b[1],f),lr(a[2],b[2],f)]; };
  var rgb = function(c,a){ return a===undefined?'rgb('+c[0]+','+c[1]+','+c[2]+')':'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; };
  var ss  = function(x){ return x<0?0:x>1?1:x*x*(3-2*x); };
  var getSky = function(t) {
    var p0=SKY[0],p1=SKY[1];
    for(var k=0;k<SKY.length-1;k++){ if(t>=SKY[k][0]&&t<=SKY[k+1][0]){p0=SKY[k];p1=SKY[k+1];break;} }
    var f=p1[0]===p0[0]?0:(t-p0[0])/(p1[0]-p0[0]);
    return {top:lrC(p0[1],p1[1],f),bot:lrC(p0[2],p1[2],f)};
  };
  var fade   = function(t,t0,t1,t2,t3){ if(t<=t0||t>=t3)return 0; if(t<t1)return ss((t-t0)/(t1-t0)); if(t<=t2)return 1; return ss((t3-t)/(t3-t2)); };
  var nightA = function(t){ if(t<0.18)return 1; if(t<0.30)return ss(1-(t-0.18)/0.12); if(t<0.68)return 0; if(t<0.80)return ss((t-0.68)/0.12); return 1; };

  // ── Draw helpers ──
  function dSky(W,H,sky){
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,rgb(sky.top)); g.addColorStop(1,rgb(sky.bot));
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  }
  function dStars(W,H,now,na){
    if(na<0.01)return;
    for(var i=0;i<STARS.length;i++){
      var s=STARS[i], tw=0.45+0.55*(0.5+0.5*Math.sin(now/s.tp*PI2+s.to));
      var a=s.op*tw*na; if(a<0.02)continue;
      ctx.beginPath(); ctx.arc(s.x*W,s.y*H,s.r,0,PI2);
      ctx.fillStyle='rgba(255,255,255,'+a.toFixed(2)+')'; ctx.fill();
    }
  }
  function dMoon(W,H,na){
    if(na<0.01)return;
    var mx=W*0.78,my=H*0.10,mr=Math.min(W,H)*0.048;
    var hg=ctx.createRadialGradient(mx,my,mr*0.9,mx,my,mr*3.8);
    hg.addColorStop(0,rgb([200,192,160],(na*0.14).toFixed(2))); hg.addColorStop(1,'rgba(200,192,160,0)');
    ctx.beginPath(); ctx.arc(mx,my,mr*3.8,0,PI2); ctx.fillStyle=hg; ctx.fill();
    ctx.beginPath(); ctx.arc(mx,my,mr,0,PI2); ctx.fillStyle=rgb([214,208,190],na.toFixed(2)); ctx.fill();
    [[-.28,-.22,.26],[.24,.26,.18],[.12,-.42,.13],[-.40,.18,.15]].forEach(function(cr){
      ctx.beginPath(); ctx.ellipse(mx+cr[0]*mr,my+cr[1]*mr,cr[2]*mr,cr[2]*mr*0.7,0,0,PI2);
      ctx.fillStyle='rgba(148,143,118,'+(0.55*na).toFixed(2)+')'; ctx.fill();
    });
  }
  function dHorizonGlow(W,H,t){
    var da=fade(t,.18,.25,.29,.36),dka=fade(t,.64,.70,.73,.79),a=Math.max(da,dka);
    if(a<0.01)return;
    var hy=H*0.60, g=ctx.createLinearGradient(0,hy-H*.12,0,hy+H*.05);
    var cl=da>dka?'200,100,30':'170,55,90';
    g.addColorStop(0,'rgba(0,0,0,0)');
    g.addColorStop(.45,'rgba('+cl+','+(a*.55).toFixed(2)+')');
    g.addColorStop(1,'rgba('+cl+','+(a*.38).toFixed(2)+')');
    ctx.fillStyle=g; ctx.fillRect(0,hy-H*.12,W,H*.17);
  }
  function dSun(W,H,t){
    var a=fade(t,.24,.34,.64,.73); if(a<0.01)return;
    var ts=(t-.24)/(.73-.24), sx=W*(0.04+ts*0.92), sy=H*(0.54-0.46*Math.sin(ts*Math.PI)), r=Math.min(W,H)*0.032;
    var g=ctx.createRadialGradient(sx,sy,r*.3,sx,sy,r*5.5);
    g.addColorStop(0,'rgba(255,228,120,'+a.toFixed(2)+')');
    g.addColorStop(.3,'rgba(255,190,60,'+(a*.35).toFixed(2)+')');
    g.addColorStop(1,'rgba(255,150,0,0)');
    ctx.beginPath(); ctx.arc(sx,sy,r*5.5,0,PI2); ctx.fillStyle=g; ctx.fill();
    ctx.beginPath(); ctx.arc(sx,sy,r,0,PI2); ctx.fillStyle='rgba(255,240,180,'+a.toFixed(2)+')'; ctx.fill();
  }
  function dClouds(W,H,t,now){
    var ca=fade(t,.30,.38,.64,.72); if(ca<0.01)return;
    var dawnF=fade(t,.20,.27,.31,.38), duskF=fade(t,.60,.66,.71,.76);
    var rC=Math.round(220+dawnF*8+duskF*8), gC=Math.round(215-dawnF*45-duskF*58), bC=Math.round(210-dawnF*75-duskF*90);
    var ba=(0.20*ca).toFixed(2), ba2=(0.20*ca*0.45).toFixed(2);
    CLOUDS.forEach(function(cl){
      var drift=Math.sin(now/cl.dp*PI2+cl.doff)*cl.dr, frac=((cl.x+drift)%1+1)%1;
      var px=frac*W, py=cl.y*H, rb=W*0.09*cl.sc;
      PUFFS.forEach(function(pf){
        var pcx=px+pf[0]*rb, pcy=py+pf[1]*rb*.55, pr=rb*Math.max(pf[2],pf[3]);
        var pg=ctx.createRadialGradient(pcx,pcy,0,pcx,pcy,pr);
        pg.addColorStop(0,'rgba('+rC+','+gC+','+bC+','+ba+')');
        pg.addColorStop(.55,'rgba('+rC+','+gC+','+bC+','+ba2+')');
        pg.addColorStop(1,'rgba('+rC+','+gC+','+bC+',0)');
        ctx.beginPath(); ctx.ellipse(pcx,pcy,rb*pf[2],rb*pf[3],0,0,PI2); ctx.fillStyle=pg; ctx.fill();
      });
    });
  }
  function dFarMtns(W,H){
    ctx.beginPath(); ctx.moveTo(0,H*.65);
    ctx.bezierCurveTo(W*.08,H*.50, W*.17,H*.54, W*.27,H*.44);
    ctx.bezierCurveTo(W*.37,H*.36, W*.41,H*.38, W*.47,H*.42);
    ctx.bezierCurveTo(W*.53,H*.45, W*.58,H*.36, W*.67,H*.43);
    ctx.bezierCurveTo(W*.76,H*.50, W*.85,H*.46, W*.93,H*.53);
    ctx.bezierCurveTo(W*.97,H*.56, W,H*.59, W,H*.62);
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    ctx.fillStyle='#060c1a'; ctx.fill();
    [[W*.27,H*.44,W*.055,H*.018],[W*.58,H*.36,W*.055,H*.016]].forEach(function(pk){
      var sg=ctx.createRadialGradient(pk[0],pk[1],0,pk[0],pk[1],pk[2]);
      sg.addColorStop(0,'rgba(180,190,210,0.12)'); sg.addColorStop(1,'rgba(180,190,210,0)');
      ctx.beginPath(); ctx.ellipse(pk[0],pk[1],pk[2],pk[3],0,0,PI2); ctx.fillStyle=sg; ctx.fill();
    });
  }
  function dMidMtns(W,H){
    ctx.strokeStyle='rgba(20,35,60,0.6)'; ctx.lineWidth=0.8;
    [[W*.05,H*.67,W*.22,H*.60,W*.40,H*.65],[W*.36,H*.70,W*.55,H*.62,W*.70,H*.67],[W*.66,H*.71,W*.82,H*.64,W*.98,H*.69]].forEach(function(rd){
      ctx.beginPath(); ctx.moveTo(rd[0],rd[1]); ctx.quadraticCurveTo(rd[2],rd[3],rd[4],rd[5]); ctx.stroke();
    });
    ctx.beginPath(); ctx.moveTo(0,H*.73);
    ctx.bezierCurveTo(W*.10,H*.61, W*.21,H*.65, W*.31,H*.58);
    ctx.bezierCurveTo(W*.39,H*.53, W*.44,H*.55, W*.50,H*.61);
    ctx.bezierCurveTo(W*.56,H*.55, W*.63,H*.52, W*.71,H*.59);
    ctx.bezierCurveTo(W*.81,H*.63, W*.91,H*.61, W,H*.66);
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    ctx.fillStyle='#0a1422'; ctx.fill();
  }
  function dCross(W,H,t){
    var cx=W*.41, cy=H*.36, vH=H*.032, vW=2.4, hW=W*.027, hH=1.9;
    var sA=fade(t,.19,.26,.33,.43);
    if(sA>0){
      var cg=ctx.createRadialGradient(cx,cy,0,cx,cy,W*.07);
      cg.addColorStop(0,'rgba(255,215,90,'+(sA*.52).toFixed(2)+')');
      cg.addColorStop(.45,'rgba(255,180,60,'+(sA*.18).toFixed(2)+')');
      cg.addColorStop(1,'rgba(255,180,60,0)');
      ctx.beginPath(); ctx.arc(cx,cy,W*.07,0,PI2); ctx.fillStyle=cg; ctx.fill();
    }
    ctx.fillStyle='#060b16';
    ctx.fillRect(cx-vW*.5, cy-vH*.62, vW, vH);
    ctx.fillRect(cx-hW*.5, cy-vH*.18, hW, hH);
  }
  function dMist(W,H,t){
    var ma=fade(t,.18,.26,.32,.41); if(ma<0.01)return;
    [[.15,.59,.32,.034],[.74,.63,.25,.028],[.46,.66,.40,.040]].forEach(function(m){
      var mg=ctx.createRadialGradient(m[0]*W,m[1]*H,0,m[0]*W,m[1]*H,m[2]*W);
      mg.addColorStop(0,'rgba(140,160,180,'+(ma*.27).toFixed(2)+')');
      mg.addColorStop(1,'rgba(140,160,180,0)');
      ctx.beginPath(); ctx.ellipse(m[0]*W,m[1]*H,m[2]*W,m[3]*H,0,0,PI2); ctx.fillStyle=mg; ctx.fill();
    });
  }
  function dBirds(W,H,t,now){
    var ba=fade(t,.34,.42,.64,.72); if(ba<0.01)return;
    BIRDS.forEach(function(b){
      var bx=((b.x+now*b.sp*b.dir)%1+1)%1, bxa=bx*W, bya=b.y*H, ws=b.ws;
      ctx.beginPath();
      ctx.moveTo(bxa,bya); ctx.quadraticCurveTo(bxa-ws*.55*b.dir,bya-ws*.52,bxa-ws*b.dir,bya);
      ctx.moveTo(bxa,bya); ctx.quadraticCurveTo(bxa+ws*.55*b.dir,bya-ws*.52,bxa+ws*b.dir,bya);
      ctx.strokeStyle='rgba(18,30,46,'+(ba*.88).toFixed(2)+')'; ctx.lineWidth=1.4; ctx.stroke();
    });
  }
  function dWell(W,H,skyTop){
    var wcx=W*.50, wcy=H*.74, wr=W*.066, wh=H*.11;
    var bsg=ctx.createRadialGradient(wcx,wcy+wh*.65,0,wcx,wcy+wh*.65,wr*1.85);
    bsg.addColorStop(0,'rgba(0,0,0,0.55)'); bsg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.ellipse(wcx,wcy+wh*.65,wr*1.85,wr*.38,0,0,PI2); ctx.fillStyle=bsg; ctx.fill();
    ctx.beginPath(); ctx.rect(wcx-wr,wcy-wh*.5,wr*2,wh);
    ctx.fillStyle='#2a1e0e'; ctx.fill(); ctx.strokeStyle='#352510'; ctx.lineWidth=1; ctx.stroke();
    ctx.strokeStyle='#1c1408'; ctx.lineWidth=1;
    for(var ml=1;ml<=3;ml++){
      ctx.beginPath(); ctx.moveTo(wcx-wr,wcy-wh*.5+wh*(ml/4)); ctx.lineTo(wcx+wr,wcy-wh*.5+wh*(ml/4)); ctx.stroke();
    }
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5,wr,wr*.27,0,0,PI2);
    ctx.fillStyle='#3a2508'; ctx.fill(); ctx.strokeStyle='#7a5820'; ctx.lineWidth=1.2; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5+2,wr*.76,wr*.19,0,0,PI2);
    ctx.fillStyle='rgb('+skyTop[0]+','+skyTop[1]+','+skyTop[2]+')'; ctx.fill();
    ctx.strokeStyle='#1c1408'; ctx.lineWidth=0.8; ctx.stroke();
    var ptopY=wcy-wh*.5-wh*.56;
    [wcx-wr*.72,wcx+wr*.72].forEach(function(px){
      ctx.beginPath(); ctx.rect(px-3,ptopY,6,wh*.56);
      ctx.fillStyle='#1c1408'; ctx.fill(); ctx.strokeStyle='#352510'; ctx.lineWidth=0.8; ctx.stroke();
    });
    var beamY=ptopY;
    ctx.beginPath(); ctx.rect(wcx-wr*1.04,beamY-4,wr*2.08,5); ctx.fillStyle='#1c1408'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(wcx-wr*1.04,beamY-4); ctx.lineTo(wcx+wr*1.04,beamY-4);
    ctx.strokeStyle='#5a3c10'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wcx,beamY-wh*.42); ctx.lineTo(wcx-wr*1.38,beamY-2); ctx.lineTo(wcx+wr*1.38,beamY-2); ctx.closePath();
    ctx.fillStyle='#1c1408'; ctx.fill(); ctx.strokeStyle='#5a3c10'; ctx.lineWidth=1.2; ctx.stroke();
    var rx=wcx+2, rt=beamY-1, rb=wcy-wh*.5+4;
    ctx.beginPath(); ctx.moveTo(rx,rt); ctx.quadraticCurveTo(rx+5,(rt+rb)/2,rx,rb);
    ctx.strokeStyle='#3a2508'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.rect(rx-5,rb,10,8); ctx.fillStyle='#352510'; ctx.fill(); ctx.strokeStyle='#5a3c10'; ctx.lineWidth=0.8; ctx.stroke();
  }
  function dFG(W,H){
    ctx.beginPath(); ctx.moveTo(0,H*.845);
    ctx.bezierCurveTo(W*.14,H*.825, W*.32,H*.852, W*.50,H*.836);
    ctx.bezierCurveTo(W*.68,H*.820, W*.86,H*.850, W,H*.836);
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fillStyle='#03060e'; ctx.fill();
  }
  function dSparks(W,H,t,now){
    var dim=fade(t,.40,.46,.57,.63), gm=1-dim*.58;
    SPARKS.forEach(function(sp){
      var fy=Math.sin(now/sp.fp*PI2+sp.fo)*.011, sx=sp.x*W, sy=(sp.y+fy)*H;
      var a=sp.op*gm*(0.38+0.62*(0.5+0.5*Math.sin(now/sp.fp*PI2+sp.fo+1.2)));
      if(a<0.02)return;
      if(sp.r>1.2){
        var hg=ctx.createRadialGradient(sx,sy,0,sx,sy,sp.r*3.8);
        hg.addColorStop(0,'rgba(255,210,55,'+(a*.65).toFixed(2)+')'); hg.addColorStop(1,'rgba(255,210,55,0)');
        ctx.beginPath(); ctx.arc(sx,sy,sp.r*3.8,0,PI2); ctx.fillStyle=hg; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(sx,sy,sp.r,0,PI2); ctx.fillStyle='rgba(255,222,75,'+Math.min(1,a*1.6).toFixed(2)+')'; ctx.fill();
      if(sp.r>1.6){
        var cs=sp.r*3.2; ctx.strokeStyle='rgba(255,210,55,'+(a*.55).toFixed(2)+')'; ctx.lineWidth=0.7;
        ctx.beginPath(); ctx.moveTo(sx-cs,sy); ctx.lineTo(sx+cs,sy); ctx.moveTo(sx,sy-cs); ctx.lineTo(sx,sy+cs); ctx.stroke();
      }
    });
  }
  function dScrim(W,H){
    var g=ctx.createLinearGradient(0,0,0,H*.36);
    g.addColorStop(0,'rgba(0,0,0,0.55)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H*.36);
  }

  // ── RAF loop ──
  function tick(ts) {
    if (!cv.isConnected) {
      document.removeEventListener('visibilitychange', _visChange);
      window.removeEventListener('resize', _onResize);
      window._foCanvasRaf = null; return;
    }
    if (_rafPaused) { window._foCanvasRaf = requestAnimationFrame(tick); return; }
    if (_lastTs !== null) _elapsed += ts - _lastTs;
    _lastTs = ts;
    var t = (_elapsed % CYCLE) / CYCLE;
    var W = cv.width, H = cv.height, sky = getSky(t), na = nightA(t);
    dSky(W,H,sky); dStars(W,H,ts,na); dMoon(W,H,na); dHorizonGlow(W,H,t); dSun(W,H,t);
    dClouds(W,H,t,ts); dFarMtns(W,H); dMidMtns(W,H); dCross(W,H,t); dMist(W,H,t);
    dBirds(W,H,t,ts); dWell(W,H,sky.top); dFG(W,H); dSparks(W,H,t,ts); dScrim(W,H);
    window._foCanvasRaf = requestAnimationFrame(tick);
  }
  window._foCanvasRaf = requestAnimationFrame(tick);
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
        '<canvas id="fo-canvas-scene" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;"></canvas>' +
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
  setTimeout(_foStartCanvasScene, 0);

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