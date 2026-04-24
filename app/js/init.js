/* =============================================================
   init.js — App bootstrap, DOMContentLoaded handlers,
             section init, first load logic
============================================================= */

// ── DEMO MODE ─────────────────────────────────────────────────
const IS_DEMO = new URLSearchParams(window.location.search).get('demo') === 'true';

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
    // Keep _supaUser current whenever Supabase refreshes the token
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

      // ── CHECK SUBSCRIPTION STATUS ON EXISTING SESSION ──────
      const blocked = await checkPlanStatus();
      if(blocked) return; // show blocked screen, stop here

      const loaded = await cloudLoad();
      if(!loaded){ loadData(); setTimeout(cloudSync, 1500); } // load local + write row to Supabase
      setSyncSt(loaded ? 'cloud' : 'cloud'); // user is signed in either way
      if(!D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
      finishInit(true); // pass flag so popup shows after cloud data is confirmed loaded
      setTimeout(setupContestFreeUser, 500); // Show contest banner if applicable
      return;
    }
  } else {
    // Supabase not available - use localStorage
    loadData();
    setSyncSt('local');
    if(!D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
    finishInit();
    return;
  }

  // No session - show auth screen
  document.getElementById('authScreen').style.display = 'flex';
}

function finishInit(cloudReady){
  // Always ensure newly-added sections are visible regardless of saved state
  if(D.sections){ ['cbt','resume','motivation','mentors'].forEach(function(k){ delete D.sections[k]; }); }
  // Belt+suspenders: force CBT on
  if(D.sections && D.sections.cbt===0) delete D.sections.cbt;
  // Apply saved theme
  applyTheme();
  applyPalette();
  applyHeroBg();
  // Build sidebar nav
  buildSideNav();
  // Stamp the baseline profile so the child-switch guard in ui.js
  // knows who is active right now and can detect a PIN login switch.
  if(typeof _lastRenderedProfileId !== 'undefined'){
    _lastRenderedProfileId = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
  }
  // Show hero section by default
  showSection('s-hero');
  if(typeof trackSection === 'function') trackSection('s-hero');
  // Show daily devotional popup once per day — skip if wizard is open
  // Use a short delay if cloud data is confirmed loaded, longer if we need to wait for sync
  const popupDelay = cloudReady ? 800 : 3500;
  setTimeout(function(){
    const today = new Date().toISOString().slice(0,10);
    const faithOn = !(D.settings && D.settings.faithMode===false);
    const wizardOpen = (document.getElementById('parentOnboard')||{}).classList&&document.getElementById('parentOnboard').classList.contains('open');
    const kidWizOpen = (document.getElementById('kidOnboard')||{}).classList&&document.getElementById('kidOnboard').classList.contains('open');
    const alreadyRead = D.scrReadDays && D.scrReadDays[today];
    // Check localStorage FIRST (persists across sign-ins, not blocked by cloud sync timing).
    // Fall back to D.devPopupSeen for data migrated from older sessions.
    const alreadySeen = localStorage.getItem('ylcc_devPopupSeen') === today || (D.devPopupSeen && D.devPopupSeen === today);
    if(!IS_DEMO && faithOn && !alreadyRead && !alreadySeen && !wizardOpen && !kidWizOpen){
      showDailyDevModal();
      // Mark as seen today in BOTH localStorage (device-level, survives sign-out)
      // and D (cloud-synced). If showDailyDevModal already sets D.devPopupSeen,
      // this line is still safe — just belt-and-suspenders.
      localStorage.setItem('ylcc_devPopupSeen', today);
      D.devPopupSeen = today;
    }
  }, popupDelay);

  startClock();
  applySettings();
  applyChildAvatar();
  renderVerse();
  startVerseAutoRotation();
  // Start session timer
  if(typeof startSessionTimer === 'function') startSessionTimer();
  // Initial cloud sync after login
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
    ["devotional","jesus","learnBible","reading","bible","journey"].forEach(function(t){
      var el=document.getElementById("bf-"+t);
      if(el) el.style.display=t==="devotional"?"block":"none";
    });
    document.querySelectorAll(".scrTabs .tab").forEach(function(b,i){b.classList.toggle("active",i===0);});
  })();
  initParentBucks();
  renderParentBucks();
  renderGameTickets();
  hookRewardTriggers();
  initQuizSystem();
  initCharacter();
  initSkillsGrid();
  updateHeroClock();
  renderHeroMotivation();
  renderDailyActivityCheck();
  renderLifeMapBoard();
  initContests();
  applyFaithMode();
  renderDevMap();
  initResources();

  // Auto-show Quick Start Wizard on first visit — skip in demo
  // Only show if user has NOT yet completed the wizard. Do NOT rely on D.name
  // being empty as a "new user" signal, because D.name is temporarily empty
  // on every sign-in before cloud data loads — that caused the wizard to
  // re-open on every refresh/login.
  if(!IS_DEMO && !D.parentWizardDone){ setTimeout(showParentOnboard, 700); }

  // Macro goal inputs
  const g=D.macroGoals||{};
  ['goalCal','goalPro','goalCarb','goalFat'].forEach((id,i)=>{ const e=document.getElementById(id); const keys=['cal','pro','carb','fat']; if(e&&g[keys[i]]) e.value=g[keys[i]]; });

  // Today's date defaults
  const today=new Date().toISOString().split('T')[0];
  ['txDate','asgDue','evDate','wDate'].forEach(id=>{ const e=document.getElementById(id); if(e&&!e.value) e.value=today; });

  // Pre-fill budget if saved
  if(D.budgetIncome){ const bi=document.getElementById('budgInc'); if(bi) bi.value=D.budgetIncome; }
  if(D.budgetSavings){ const bs=document.getElementById('budgSav'); if(bs) bs.value=D.budgetSavings; }

  // Auto-open Parent Hub after onboarding flow (onboard.html sets this flag)
  if(localStorage.getItem('ylcc_goto_parent') === '1'){
    localStorage.removeItem('ylcc_goto_parent');
    setTimeout(function(){ showSection('s-parent'); }, 400);
  }
}





// ── CHILD PIN LOGIN — CLEAN DASHBOARD SWITCH ─────────────────
// Call this function from parent.js (or wherever childPinInput()
// confirms a match) INSTEAD of calling showSection('s-hero') directly.
//
//   replaceWith:  showSection('s-hero');
//   use instead:  switchToChild();
//
// It ensures D is fully reloaded from the new child's localStorage
// key before any dashboard widget reads it, preventing stale data
// from the previously-active child showing up briefly.
function switchToChild(){
  // _activeProfileId must already be set to the matched child before calling this.
  if(typeof load === 'function') load();                           // reload D for new child
  if(typeof _lastRenderedProfileId !== 'undefined'){
    _lastRenderedProfileId = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
  }
  if(typeof refreshDashForCurrentChild === 'function'){
    refreshDashForCurrentChild();                                   // full widget reset
  }
  showSection('s-hero');
  if(typeof trackSection === 'function') trackSection('s-hero');
}
