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

// Prevents finishInit() running twice on the same page load (e.g. onAuthStateChange
// SIGNED_IN fires and then authComplete() also calls finishInit). Reset on sign-out
// so the user can sign back in on the same page.
let _appInitialized = false;

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
        if(event === 'TOKEN_REFRESHED'){
          cloudSync();
        } else if(event === 'SIGNED_IN' && !_appInitialized){
          // Fires on explicit sign-in AND on deferred token restore (getSession returned
          // null because the access token was expired, but Supabase later refreshed it).
          // Only route if the auth screen is currently visible; authComplete() will handle
          // the explicit sign-in path ~600 ms later, and finishInit's _appInitialized guard
          // prevents a second init.
          var _authEl = document.getElementById('authScreen');
          if(_authEl && _authEl.style.display === 'flex'){
            checkPlanStatus().then(function(blocked){
              if(blocked) return;
              cloudLoad().then(function(loaded){
                if(!loaded){ loadData(); setTimeout(cloudSync, 1500); }
                var _ae = document.getElementById('authScreen');
                if(_ae) _ae.style.display = 'none';
                authSetLoading(false);
                setSyncSt(loaded ? 'cloud' : 'local');
                finishInit(true);
                setTimeout(setupContestFreeUser, 500);
              });
            });
          }
        }
      } else if(event === 'SIGNED_OUT'){
        _appInitialized = false;
        _supaUser = null;
        setSyncSt('local');
      }
    });

    let _gsResult;
    try { _gsResult = await supa.auth.getSession(); } catch(_e){ console.warn('[LifeOS] getSession failed:', _e); }
    const session = _gsResult && _gsResult.data && _gsResult.data.session;
    if(session && session.user){
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
  if(_appInitialized) return;
  _appInitialized = true;
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
  let _defaultLanding = 's-hero'; // faith-free hero rendered via renderFaithOnlyHero(); session restore skips login, not the hero
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
    if(!IS_DEMO && !window._faithFree && faithOn && !alreadyRead && !alreadySeen && !wizardOpen && !kidWizOpen){
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

  // Phase 1A — Streaks Engine
  if(typeof initStreaks === 'function') initStreaks();

  // Phase 1B — Notification + PWA install prompts. Wait 30 s after
  // sign-in (engagement window) before surfacing either prompt; iOS Safari
  // is routed to install-instructions first by _initPushPrompt itself,
  // since web push only works from an installed PWA on iOS. pwa.js carries
  // its own 30 s engagement timer for the install banner; this hook is
  // belt-and-suspenders + sequencing on top of it.
  if(!IS_DEMO) setTimeout(function(){
    if(typeof _initPushPrompt === 'function') _initPushPrompt();
    // Give the notif modal time to be answered before stacking install on
    // top. On iOS the install modal was already opened by _initPushPrompt
    // routing, so this is a no-op there (30-day cool-down keys throttle).
    setTimeout(function(){
      if(typeof showPwaInstallPrompt === 'function') showPwaInstallPrompt();
    }, 10000);
  }, 30000);
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
  // Retry until the hero has real layout dimensions — Android Chrome often
  // reports 0 immediately after innerHTML injection.
  var _hero = document.getElementById('faithOnlyHero');
  if (!_hero || _hero.offsetWidth === 0 || _hero.offsetHeight === 0) {
    setTimeout(_foStartCanvasScene, 80);
    return;
  }
  cv.width  = _hero.offsetWidth;
  cv.height = _hero.offsetHeight;
  // Promote canvas to its own GPU layer to prevent rasterisation stalls on Android.
  cv.style.transform = 'translateZ(0)';
  cv.style.webkitTransform = 'translateZ(0)';
  var ctx = cv.getContext('2d');
  var PI2 = Math.PI * 2, CYCLE = 60000;
  // _t: cycle position [0,1). 0 = midnight — hard start so first frame is always
  // the dark night sky regardless of wall-clock time.
  // _lastTs: 0 (falsy) means "first frame — skip delta accumulation".
  var _t = 0, _lastTs = 0;
  var _visChange = function() {
    if (document.visibilityState === 'visible') {
      _lastTs = 0; // discard the hidden gap so t doesn't jump forward on re-entry
      if (!window._foCanvasRaf) window._foCanvasRaf = requestAnimationFrame(tick);
    } else {
      if (window._foCanvasRaf) { cancelAnimationFrame(window._foCanvasRaf); window._foCanvasRaf = null; }
    }
  };
  document.addEventListener('visibilitychange', _visChange);
  var _rsz;
  var _onResize = function() {
    clearTimeout(_rsz);
    _rsz = setTimeout(function() {
      if (!cv.isConnected) return;
      var _rh = document.getElementById('faithOnlyHero');
      cv.width  = (_rh && _rh.offsetWidth)  || cv.offsetWidth  || 390;
      cv.height = (_rh && _rh.offsetHeight) || cv.offsetHeight || 700;
    }, 120);
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
    var mr=Math.max(14, H*0.030);
    var mx=W*0.82, my=H*0.38-mr;
    var hg=ctx.createRadialGradient(mx,my,mr*0.9,mx,my,mr*2.6);
    hg.addColorStop(0,rgb([200,192,160],(na*0.14).toFixed(2))); hg.addColorStop(1,'rgba(200,192,160,0)');
    ctx.beginPath(); ctx.arc(mx,my,mr*2.6,0,PI2); ctx.fillStyle=hg; ctx.fill();
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
  function dFarMtns(W,H,t){
    var pkS = Math.max(0.010, 11/W);
    function pathL1(){
      ctx.beginPath(); ctx.moveTo(0,H*.68);
      ctx.bezierCurveTo(W*.02,H*.67,W*.04,H*.65,W*.06,H*.63);
      ctx.bezierCurveTo(W*.07,H*.62,W*.09,H*.60,W*.11,H*.59);
      ctx.bezierCurveTo(W*.12,H*.58,W*.14,H*.57,W*.16,H*.57);
      ctx.bezierCurveTo(W*.17,H*.56,W*.19,H*.55,W*.21,H*.54);
      ctx.bezierCurveTo(W*.22,H*.53,W*.23,H*.52,W*.25,H*.53);
      ctx.bezierCurveTo(W*.26,H*.54,W*.28,H*.57,W*.30,H*.58);
      ctx.bezierCurveTo(W*.32,H*.59,W*.35,H*.61,W*.38,H*.61);
      ctx.bezierCurveTo(W*.40,H*.60,W*.42,H*.59,W*.43,H*.57);
      ctx.bezierCurveTo(W*.44,H*.55,W*.45,H*.54,W*.47,H*.53);
      ctx.bezierCurveTo(W*.49,H*.54,W*.51,H*.57,W*.54,H*.59);
      ctx.bezierCurveTo(W*.56,H*.61,W*.59,H*.62,W*.62,H*.61);
      ctx.bezierCurveTo(W*.63,H*.60,W*.65,H*.58,W*.67,H*.56);
      ctx.bezierCurveTo(W*.68,H*.55,W*.70,H*.54,W*.71,H*.55);
      ctx.bezierCurveTo(W*.73,H*.57,W*.75,H*.60,W*.78,H*.62);
      ctx.bezierCurveTo(W*.80,H*.63,W*.83,H*.63,W*.86,H*.63);
      ctx.bezierCurveTo(W*.88,H*.63,W*.91,H*.64,W*.93,H*.65);
      ctx.bezierCurveTo(W*.95,H*.66,W*.98,H*.67,W,H*.68);
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    }
    function pathL2(){
      ctx.beginPath(); ctx.moveTo(0,H*.63);
      ctx.bezierCurveTo(W*.02,H*.61,W*.04,H*.59,W*.06,H*.57);
      ctx.bezierCurveTo(W*.08,H*.55,W*.10,H*.52,W*.12,H*.50);
      ctx.bezierCurveTo(W*.12,H*.49,W*.15,H*.47,W*.17,H*.47);
      ctx.bezierCurveTo(W*.19,H*.48,W*.21,H*.51,W*.23,H*.53);
      ctx.bezierCurveTo(W*.25,H*.55,W*.27,H*.54,W*.29,H*.51);
      ctx.bezierCurveTo(W*.30,H*.49,W*.32,H*.46,W*.34,H*.44);
      ctx.bezierCurveTo(W*.35,H*.42,W*.37,H*.39,W*.38,H*.38);
      ctx.bezierCurveTo(W*.39,H*.37,W*(0.41-pkS),H*.34,W*.41,H*.34);
      ctx.bezierCurveTo(W*(0.41+pkS),H*.34,W*.43,H*.35,W*.44,H*.37);
      ctx.bezierCurveTo(W*.45,H*.39,W*.46,H*.40,W*.47,H*.39);
      ctx.bezierCurveTo(W*.47,H*.40,W*(0.50-pkS),H*.38,W*.50,H*.38);
      ctx.bezierCurveTo(W*(0.50+pkS),H*.385,W*.52,H*.43,W*.54,H*.47);
      ctx.bezierCurveTo(W*.55,H*.49,W*.57,H*.51,W*.59,H*.49);
      ctx.bezierCurveTo(W*.60,H*.48,W*.61,H*.46,W*.63,H*.44);
      ctx.bezierCurveTo(W*.64,H*.43,W*.65,H*.44,W*.67,H*.47);
      ctx.bezierCurveTo(W*.68,H*.49,W*.70,H*.52,W*.72,H*.51);
      ctx.bezierCurveTo(W*.73,H*.50,W*.75,H*.48,W*.77,H*.50);
      ctx.bezierCurveTo(W*.78,H*.52,W*.80,H*.55,W*.82,H*.54);
      ctx.bezierCurveTo(W*.83,H*.53,W*.85,H*.55,W*.87,H*.57);
      ctx.bezierCurveTo(W*.89,H*.58,W*.91,H*.59,W*.93,H*.59);
      ctx.bezierCurveTo(W*.95,H*.60,W*.97,H*.61,W*.99,H*.62);
      ctx.bezierCurveTo(W*.995,H*.62,W,H*.63,W,H*.63);
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    }
    pathL1(); ctx.fillStyle='#030508'; ctx.fill();
    pathL2(); ctx.fillStyle='#060c1a'; ctx.fill();
    ctx.save(); ctx.translate(0,H*0.006);
    pathL2(); ctx.fillStyle='rgba(18,30,55,0.45)'; ctx.fill();
    ctx.restore();
    [[W*.41,H*.34,W*.038,H*.012],[W*.50,H*.38,W*.030,H*.010],[W*.63,H*.44,W*.022,H*.007]].forEach(function(pk){
      var sg=ctx.createRadialGradient(pk[0],pk[1],0,pk[0],pk[1],pk[2]);
      sg.addColorStop(0,'rgba(200,210,225,0.15)'); sg.addColorStop(1,'rgba(200,210,225,0)');
      ctx.beginPath(); ctx.ellipse(pk[0],pk[1],pk[2],pk[3],0,0,PI2); ctx.fillStyle=sg; ctx.fill();
    });
    ctx.fillStyle='rgba(20,40,80,0.18)';
    ctx.fillRect(0,H*0.60,W,H*0.015);
  }
  function dMidMtns(W,H,t){
    var pkS = Math.max(0.010, 11/W);
    function pathM(){
      ctx.beginPath(); ctx.moveTo(0,H*.76);
      ctx.bezierCurveTo(W*.02,H*.74,W*.04,H*.72,W*.06,H*.70);
      ctx.bezierCurveTo(W*.08,H*.68,W*.10,H*.66,W*.12,H*.67);
      ctx.bezierCurveTo(W*.14,H*.68,W*.17,H*.65,W*.20,H*.62);
      ctx.bezierCurveTo(W*.22,H*.60,W*.24,H*.58,W*.26,H*.59);
      ctx.bezierCurveTo(W*.27,H*.60,W*.29,H*.62,W*.31,H*.63);
      ctx.bezierCurveTo(W*.33,H*.62,W*.35,H*.59,W*.37,H*.56);
      ctx.bezierCurveTo(W*.37,H*.56,W*(0.42-pkS),H*.52,W*.42,H*.52);
      ctx.bezierCurveTo(W*(0.42+pkS),H*.52,W*.44,H*.54,W*.46,H*.55);
      ctx.bezierCurveTo(W*.47,H*.56,W*.48,H*.59,W*.50,H*.61);
      ctx.bezierCurveTo(W*.52,H*.63,W*.54,H*.62,W*.56,H*.59);
      ctx.bezierCurveTo(W*.56,H*.58,W*(0.60-pkS),H*.56,W*.60,H*.56);
      ctx.bezierCurveTo(W*.62,H*.57,W*.63,H*.60,W*.65,H*.63);
      ctx.bezierCurveTo(W*.66,H*.64,W*.68,H*.65,W*.70,H*.63);
      ctx.bezierCurveTo(W*.71,H*.62,W*.73,H*.60,W*.75,H*.62);
      ctx.bezierCurveTo(W*.76,H*.63,W*.78,H*.65,W*.80,H*.67);
      ctx.bezierCurveTo(W*.82,H*.68,W*.84,H*.66,W*.86,H*.68);
      ctx.bezierCurveTo(W*.87,H*.69,W*.89,H*.70,W*.91,H*.70);
      ctx.bezierCurveTo(W*.93,H*.70,W*.95,H*.71,W*.97,H*.72);
      ctx.bezierCurveTo(W*.98,H*.725,W*.99,H*.73,W,H*.73);
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    }
    pathM(); ctx.fillStyle='#0a1422'; ctx.fill();
    ctx.strokeStyle='rgba(20,38,65,0.50)'; ctx.lineWidth=1.2;
    [[W*.06,H*.71,W*.25,H*.61,W*.44,H*.63],[W*.22,H*.66,W*.42,H*.57,W*.62,H*.61],[W*.44,H*.61,W*.62,H*.58,W*.80,H*.67],[W*.62,H*.65,W*.78,H*.68,W*.96,H*.72]].forEach(function(r){
      ctx.beginPath(); ctx.moveTo(r[0],r[1]); ctx.quadraticCurveTo(r[2],r[3],r[4],r[5]); ctx.stroke();
    });
    ctx.fillStyle='rgba(15,30,60,0.22)';
    ctx.fillRect(0,H*0.70,W,H*0.015);
  }
  function dNearMtns(W,H,t){
    ctx.beginPath(); ctx.moveTo(0,H*.82);
    ctx.bezierCurveTo(W*.02,H*.80,W*.05,H*.77,W*.08,H*.74);
    ctx.bezierCurveTo(W*.10,H*.72,W*.12,H*.70,W*.14,H*.71);
    ctx.bezierCurveTo(W*.16,H*.72,W*.18,H*.74,W*.20,H*.73);
    ctx.bezierCurveTo(W*.22,H*.71,W*.24,H*.68,W*.26,H*.67);
    ctx.bezierCurveTo(W*.28,H*.67,W*.30,H*.69,W*.32,H*.71);
    ctx.bezierCurveTo(W*.33,H*.72,W*.35,H*.71,W*.37,H*.69);
    ctx.bezierCurveTo(W*.38,H*.67,W*.40,H*.65,W*.42,H*.66);
    ctx.bezierCurveTo(W*.43,H*.67,W*.45,H*.70,W*.47,H*.72);
    ctx.bezierCurveTo(W*.49,H*.73,W*.51,H*.72,W*.53,H*.69);
    ctx.bezierCurveTo(W*.55,H*.67,W*.57,H*.65,W*.59,H*.66);
    ctx.bezierCurveTo(W*.60,H*.67,W*.62,H*.70,W*.64,H*.72);
    ctx.bezierCurveTo(W*.65,H*.73,W*.67,H*.72,W*.69,H*.70);
    ctx.bezierCurveTo(W*.71,H*.69,W*.72,H*.70,W*.74,H*.72);
    ctx.bezierCurveTo(W*.75,H*.74,W*.77,H*.75,W*.79,H*.74);
    ctx.bezierCurveTo(W*.81,H*.73,W*.83,H*.74,W*.85,H*.75);
    ctx.bezierCurveTo(W*.87,H*.76,W*.90,H*.77,W*.93,H*.77);
    ctx.bezierCurveTo(W*.95,H*.77,W*.97,H*.78,W*.99,H*.79);
    ctx.bezierCurveTo(W*.995,H*.795,W,H*.80,W,H*.80);
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    ctx.fillStyle='#0e1a2e'; ctx.fill();
    var dawnF=fade(t,.18,.25,.29,.36), duskF=fade(t,.60,.66,.71,.76);
    var tA=Math.max(dawnF,duskF)*0.08;
    if(tA>0.005){
      ctx.fillStyle='rgba(200,100,30,'+tA.toFixed(2)+')';
      ctx.fillRect(0,H*0.33,W,H*0.55);
    }
  }
  function dCross(W,H,t,now){
    var cx=W*.41, cy=H*.36;
    var crossH=H*0.032, crossW=H*0.003;
    var crossArm=crossH*0.52, crossArmH=crossW*0.9;
    var glowR=H*0.055;
    var gcy=cy-crossH*0.44;
    var pulse=0.5+0.5*Math.sin(now/2800*PI2);
    var na=nightA(t), sA=fade(t,.19,.26,.33,.43);
    var baseVis=0.3+na*0.55+sA*0.15;
    var glowA=(0.12+pulse*0.30)*baseVis;
    var pulseR=glowR*(0.7+pulse*0.55);
    var cg=ctx.createRadialGradient(cx,gcy,0,cx,gcy,pulseR);
    cg.addColorStop(0,'rgba(255,210,80,'+Math.min(1,glowA*2).toFixed(2)+')');
    cg.addColorStop(.40,'rgba(255,175,50,'+glowA.toFixed(2)+')');
    cg.addColorStop(1,'rgba(255,140,20,0)');
    ctx.beginPath(); ctx.arc(cx,gcy,pulseR,0,PI2); ctx.fillStyle=cg; ctx.fill();
    var crossAlpha=Math.min(1,0.55+baseVis*0.85);
    ctx.fillStyle='rgba(195,160,50,'+crossAlpha.toFixed(2)+')';
    ctx.fillRect(cx-crossW*0.5, cy-crossH*0.72, crossW, crossH);
    ctx.fillRect(cx-crossArm*0.5, cy-crossH*0.44, crossArm, crossArmH);
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
  function dWell(W,H,skyTop,now){
    var ws=Math.min(1,W/520), wcx=W*.50, wcy=H*.74, wr=57*ws, wh=H*.12;
    // Ground shadow
    var bsg=ctx.createRadialGradient(wcx,wcy+wh*.70,0,wcx,wcy+wh*.70,wr*2.0);
    bsg.addColorStop(0,'rgba(0,0,0,0.60)'); bsg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.ellipse(wcx,wcy+wh*.70,wr*2.0,wr*.38,0,0,PI2); ctx.fillStyle=bsg; ctx.fill();
    // Stone body — grey
    ctx.beginPath(); ctx.rect(wcx-wr,wcy-wh*.5,wr*2,wh);
    ctx.fillStyle='#474750'; ctx.fill(); ctx.strokeStyle='#2e2e35'; ctx.lineWidth=1.5; ctx.stroke();
    // Horizontal mortar lines
    ctx.strokeStyle='#2e2e35'; ctx.lineWidth=1;
    for(var ml=1;ml<=3;ml++){
      ctx.beginPath(); ctx.moveTo(wcx-wr,wcy-wh*.5+wh*(ml/4)); ctx.lineTo(wcx+wr,wcy-wh*.5+wh*(ml/4)); ctx.stroke();
    }
    // Staggered vertical joints (stone look)
    ctx.strokeStyle='#2e2e35'; ctx.lineWidth=0.8;
    [[-0.36,0,0.5],[0.22,0,0.5],[-0.12,0.5,1],[0.40,0.5,1]].forEach(function(j){
      var jx=wcx+j[0]*wr*2, y0=wcy-wh*.5+wh*j[1], y1=wcy-wh*.5+wh*j[2];
      ctx.beginPath(); ctx.moveTo(jx,y0); ctx.lineTo(jx,y1); ctx.stroke();
    });
    // Stone highlight — top front edge
    ctx.beginPath(); ctx.moveTo(wcx-wr,wcy-wh*.5); ctx.lineTo(wcx+wr,wcy-wh*.5);
    ctx.strokeStyle='#7a7a88'; ctx.lineWidth=1.5; ctx.stroke();
    // Rim — wide ellipse
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5,wr*1.08,wr*.28,0,0,PI2);
    ctx.fillStyle='#575762'; ctx.fill(); ctx.strokeStyle='#909098'; ctx.lineWidth=1.5; ctx.stroke();
    // Upward light spill — soft blue glow rising from water through rim opening
    var wog=ctx.createRadialGradient(wcx,wcy-wh*.5,0,wcx,wcy-wh*.5,wr*1.5);
    wog.addColorStop(0,'rgba(30,120,220,0.13)'); wog.addColorStop(1,'rgba(30,120,220,0)');
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5-6,wr*1.2,wr*.50,0,0,PI2); ctx.fillStyle=wog; ctx.fill();
    // Deep water base
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5+2,wr*.80,wr*.20,0,0,PI2);
    ctx.fillStyle='rgba(15,55,120,0.92)'; ctx.fill();
    // Radial glow from center of water
    var wg=ctx.createRadialGradient(wcx,wcy-wh*.5+2,0,wcx,wcy-wh*.5+2,wr*.80);
    wg.addColorStop(0,'rgba(80,180,255,0.75)');
    wg.addColorStop(0.4,'rgba(30,100,200,0.55)');
    wg.addColorStop(0.8,'rgba(10,50,140,0.35)');
    wg.addColorStop(1,'rgba(5,20,80,0)');
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5+2,wr*1.12,wr*.36,0,0,PI2); ctx.fillStyle=wg; ctx.fill();
    // Animated shimmer ripple
    var shimA=(0.15+0.10*Math.sin(now*0.003)).toFixed(2);
    ctx.fillStyle='rgba(140,210,255,'+shimA+')';
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5+2,wr*.48,wr*.10,0,0,PI2); ctx.fill();
    ctx.strokeStyle='#0a2860'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.ellipse(wcx,wcy-wh*.5+2,wr*.80,wr*.20,0,0,PI2); ctx.stroke();
    // Posts (wood)
    var ptopY=wcy-wh*.5-wh*.58;
    [wcx-wr*.76,wcx+wr*.76].forEach(function(px){
      ctx.beginPath(); ctx.rect(px-4,ptopY,7,wh*.58);
      ctx.fillStyle='#1c1408'; ctx.fill(); ctx.strokeStyle='#352510'; ctx.lineWidth=0.8; ctx.stroke();
    });
    // Crossbeam
    var beamY=ptopY;
    ctx.beginPath(); ctx.rect(wcx-wr*1.10,beamY-5,wr*2.20,6); ctx.fillStyle='#1c1408'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(wcx-wr*1.10,beamY-5); ctx.lineTo(wcx+wr*1.10,beamY-5);
    ctx.strokeStyle='#5a3c10'; ctx.lineWidth=1.2; ctx.stroke();
    // Roof triangle
    ctx.beginPath(); ctx.moveTo(wcx,beamY-wh*.45); ctx.lineTo(wcx-wr*1.44,beamY-2); ctx.lineTo(wcx+wr*1.44,beamY-2); ctx.closePath();
    ctx.fillStyle='#1c1408'; ctx.fill(); ctx.strokeStyle='#5a3c10'; ctx.lineWidth=1.2; ctx.stroke();
    // Rope and bucket
    var rx=wcx+3, rt=beamY-1, rb=wcy-wh*.5+5;
    ctx.beginPath(); ctx.moveTo(rx,rt); ctx.quadraticCurveTo(rx+6,(rt+rb)/2,rx,rb);
    ctx.strokeStyle='#4a3510'; ctx.lineWidth=1.8; ctx.stroke();
    ctx.beginPath(); ctx.rect(rx-6,rb,11,9); ctx.fillStyle='#3a2a10'; ctx.fill(); ctx.strokeStyle='#5a3c10'; ctx.lineWidth=0.8; ctx.stroke();
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
    try {
      if (!cv.isConnected) {
        document.removeEventListener('visibilitychange', _visChange);
        window.removeEventListener('resize', _onResize);
        window._foCanvasRaf = null; return;
      }
      // Advance t. _lastTs=0 on first frame so this branch is skipped → t stays at
      // midnight for tick 1. Cap dt to 50ms so a background tab wake-up doesn't
      // jump the sky forward by minutes.
      if (_lastTs) { _t = (_t + Math.min(ts - _lastTs, 50) / CYCLE) % 1; }
      _lastTs = ts;
      var t = _t;
      var W = cv.width, H = cv.height, sky = getSky(t), na = nightA(t);
      dSky(W,H,sky); dStars(W,H,ts,na); dMoon(W,H,na); dHorizonGlow(W,H,t); dSun(W,H,t);
      dClouds(W,H,t,ts); dFarMtns(W,H,t); dMidMtns(W,H,t); dNearMtns(W,H,t); dCross(W,H,t,ts); dMist(W,H,t);
      dBirds(W,H,t,ts); dWell(W,H,sky.top,ts); dFG(W,H); dSparks(W,H,t,ts); dScrim(W,H);
      window._foCanvasRaf = requestAnimationFrame(tick);
    } catch(e) {
      console.warn('[Well] canvas error:', e);
      window._foCanvasRaf = null;
      // Restart loop rather than dying silently.
      setTimeout(function() { if (cv.isConnected) window._foCanvasRaf = requestAnimationFrame(tick); }, 500);
    }
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
  // Auth metadata is always the current user — check it before D.name which
  // can hold a stale value from localStorage if cloudLoad hasn't finished yet.
  let name = '';
  if (typeof _supaUser !== 'undefined' && _supaUser) {
    const meta = _supaUser.user_metadata || {};
    name = (meta.first_name || (meta.name||'').split(/\s+/)[0] ||
            (meta.full_name||'').split(/\s+/)[0] || '').trim();
    if (!name && _supaUser.email)
      name = String(_supaUser.email).split('@')[0].split(/[.+_-]/)[0];
  }
  if (!name && typeof D !== 'undefined' && D && D.name) name = String(D.name).trim();
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
  // Fix Android Chrome: 100vh includes the address bar, pushing the "Enter The
  // Well" button below the visible fold. window.innerHeight is the real viewport.
  (function() {
    var _fhEl = document.getElementById('faithOnlyHero');
    if (_fhEl) _fhEl.style.height = window.innerHeight + 'px';
    if (!window._foResizeAttached) {
      window._foResizeAttached = true;
      window.addEventListener('resize', function() {
        var _h2 = document.getElementById('faithOnlyHero');
        if (_h2) _h2.style.height = window.innerHeight + 'px';
      });
    }
  })();
  var ctaBtn = document.querySelector('.fo-hero-cta') || document.querySelector('.fo-enter-btn');
  if (ctaBtn) ctaBtn.style.marginBottom = 'max(32px, env(safe-area-inset-bottom, 32px))';
  // 150ms gives Android Chrome time to finish layout before canvas reads dimensions.
  setTimeout(_foStartCanvasScene, 150);

  // ── Entry cards & today's verse intentionally NOT rendered. ──
  // After clicking "Enter The Well", wellGoto('home') takes them inside where
  // they choose Bible Stories / Reading Plans / Faith Academy / Prayer.
  setTimeout(() => launchFaithSparkles(40), 1800);
  setTimeout(startFaithSparkleLoop, 5500);
  attachFaithParallax();
  // Phase 2A — show onboarding overlay for first-time visitors
  _checkWellOnboarding();
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

// ── PHASE 1B — PUSH NOTIFICATION PROMPT ──────────────────────
// Shows a soft in-app banner (never the browser native prompt) asking
// the user to enable push. Only runs once per browser — once they
// choose Allow or Not Now, ylcc_push_prompted is set and we never ask again.

function _vapidUrlB64ToUint8(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  var raw = window.atob(base64);
  var arr = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function _pushSubscribeAndSave() {
  try {
    var keyResp = await fetch('/api/push-vapid-key');
    if (!keyResp.ok) return;
    var keyData = await keyResp.json();
    var applicationServerKey = _vapidUrlB64ToUint8(keyData.publicKey);

    var reg = await navigator.serviceWorker.ready;
    var sub = await reg.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: applicationServerKey,
    });

    var token = (typeof _supaUser !== 'undefined' && _supaUser)
      ? (await (typeof getSupabase === 'function' ? getSupabase() : null)
          ?.auth?.getSession())?.data?.session?.access_token
      : null;
    if (!token) return;

    await fetch('/api/push-subscribe', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
  } catch (e) {
    console.warn('[push] subscribe failed:', e);
  }
}

// Friendly toast shown after the user grants notification permission.
function _pushToast(msg) {
  var toast = document.createElement('div');
  toast.style.cssText = [
    'position:fixed','bottom:1.5rem','left:50%','transform:translateX(-50%)',
    'z-index:9999','background:#10b981','color:#fff','padding:.85rem 1.3rem',
    'border-radius:12px','font-family:var(--fm,sans-serif)','font-weight:600',
    'font-size:.85rem','box-shadow:0 12px 40px rgba(16,185,129,.4)',
    'max-width:90vw','text-align:center'
  ].join(';');
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function(){
    toast.style.transition = 'opacity .4s';
    toast.style.opacity = '0';
    setTimeout(function(){ if (toast.parentNode) toast.parentNode.removeChild(toast); }, 450);
  }, 3200);
}

// Notification permission prompt — modal explaining why we're asking.
// Storage (per-user via _ylccUserKey):
//   notif_prompt_seen        — 'granted' | 'denied' | 'later:YYYY-MM-DD'
//   notif_permission_granted — 'true' | 'false'
// 30-day cool-down on "Maybe Later" (bypassed by opts.force).
//
// iOS Safari can't deliver web push from a browser tab — only from a PWA
// installed to the home screen. So on iOS-non-standalone we redirect to the
// Add-to-Home-Screen flow instead; the notification prompt fires on the
// next launch when the user opens us from the home-screen icon.
function _initPushPrompt(opts) {
  opts = opts || {};
  var isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var isStandaloneMode = window.navigator.standalone === true ||
                         window.matchMedia('(display-mode: standalone)').matches;
  console.log('[NOTIF] _initPushPrompt called, force:', !!opts.force, 'isIOS:', isIOSDevice, 'isStandalone:', isStandaloneMode, 'hasNotification:', ('Notification' in window), 'hasSW:', ('serviceWorker' in navigator));

  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    console.log('[NOTIF] Notification or ServiceWorker API not available — skip');
    return;
  }
  if (document.getElementById('pushPromptModal')) {
    console.log('[NOTIF] modal already exists');
    return;
  }

  // iOS in a Safari tab — defer notifications, show install instructions.
  if (isIOSDevice && !isStandaloneMode) {
    console.log('[NOTIF] iOS non-standalone → routing to install prompt');
    if (typeof showIosInstallPrompt === 'function') showIosInstallPrompt(opts);
    else console.warn('[NOTIF] showIosInstallPrompt undefined — pwa.js not loaded?');
    return;
  }

  var seenKey    = _ylccUserKey('notif_prompt_seen');
  var grantedKey = _ylccUserKey('notif_permission_granted');
  var seenVal    = localStorage.getItem(seenKey);

  if (Notification.permission === 'granted') {
    console.log('[NOTIF] permission already: granted — subscribing silently');
    localStorage.setItem(seenKey, 'granted');
    localStorage.setItem(grantedKey, 'true');
    _pushSubscribeAndSave();
    return;
  }
  if (Notification.permission === 'denied') {
    console.log('[NOTIF] permission already: denied — cannot prompt');
    localStorage.setItem(seenKey, 'denied');
    localStorage.setItem(grantedKey, 'false');
    return;
  }
  // 30-day cool-down on prior dismissals.
  if (!opts.force && seenVal) {
    if (seenVal === 'granted' || seenVal === 'denied') {
      console.log('[NOTIF] suppressed by cooldown, seenVal:', seenVal);
      return;
    }
    if (seenVal.indexOf('later:') === 0) {
      var savedDay = seenVal.slice(6);
      var ageMs = Date.now() - Date.parse(savedDay);
      if (ageMs < 30 * 86400000) {
        console.log('[NOTIF] suppressed by cooldown, seenVal:', seenVal, 'ageDays:', (ageMs / 86400000).toFixed(1));
        return;
      }
    }
  }
  console.log('[NOTIF] showing notification modal');

  var overlay = document.createElement('div');
  overlay.id = 'pushPromptModal';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:9800','background:rgba(0,0,0,.65)',
    'display:flex','align-items:center','justify-content:center','padding:1.2rem'
  ].join(';');

  overlay.innerHTML =
    '<div role="dialog" aria-labelledby="pushPromptTitle" style="max-width:380px;width:100%;background:#0d1424;border:1px solid rgba(245,166,35,.35);border-radius:18px;padding:1.7rem 1.5rem 1.4rem;box-shadow:0 24px 60px rgba(0,0,0,.6);font-family:var(--fm,sans-serif);color:#f1f5f9;">' +
      '<div style="font-size:2.4rem;text-align:center;margin-bottom:.65rem;">🔔</div>' +
      '<h2 id="pushPromptTitle" style="margin:0 0 .8rem;font-size:1.1rem;font-weight:800;text-align:center;line-height:1.3;">Stay connected with God</h2>' +
      '<p style="margin:0 0 .65rem;font-size:.85rem;color:#cbd5e1;line-height:1.5;text-align:center;">Get gentle reminders for:</p>' +
      '<ul style="margin:0 0 1rem;padding-left:1.5rem;font-size:.83rem;color:#e2e8f0;line-height:1.75;">' +
        '<li>Your daily devotional</li>' +
        '<li>Reading plan streaks</li>' +
        '<li>Prayer reflection time</li>' +
      '</ul>' +
      '<p style="margin:0 0 1.3rem;font-size:.8rem;color:#f5a623;text-align:center;font-weight:600;">We\'ll never spam you.</p>' +
      '<button id="pushAllowBtn" style="width:100%;background:linear-gradient(135deg,#f5a623,#f97316);color:#1a0e02;border:none;border-radius:10px;padding:.85rem;font-size:.9rem;font-weight:800;cursor:pointer;margin-bottom:.55rem;min-height:44px;font-family:inherit;">Enable Reminders</button>' +
      '<button id="pushDenyBtn" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.18);color:#94a3b8;border-radius:10px;padding:.7rem;font-size:.82rem;font-weight:600;cursor:pointer;min-height:44px;font-family:inherit;">Maybe Later</button>' +
    '</div>';

  document.body.appendChild(overlay);

  function _dismiss(){
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  document.getElementById('pushDenyBtn').addEventListener('click', function(){
    localStorage.setItem(seenKey, 'later:' + new Date().toISOString().slice(0,10));
    _dismiss();
  });

  document.getElementById('pushAllowBtn').addEventListener('click', async function(){
    _dismiss();
    try {
      var perm = await Notification.requestPermission();
      localStorage.setItem(seenKey, perm);
      localStorage.setItem(grantedKey, perm === 'granted' ? 'true' : 'false');
      if (perm === 'granted') {
        _pushSubscribeAndSave();
        _pushToast('✓ Notifications enabled — you\'ll get gentle reminders');
      }
    } catch(e){ console.warn('[push] requestPermission failed:', e); }
  });
}

// Public hooks. Signup uses force:true so a fresh user always sees the
// platform-appropriate prompt once, regardless of the 30-day cool-down.
function showPushPromptAfterSignup() {
  setTimeout(function(){ _initPushPrompt({ force: true }); }, 1500);
}
window.showPushPromptAfterSignup = showPushPromptAfterSignup;
window._initPushPrompt = _initPushPrompt;

// ── PHASE 2A — THE WELL ONBOARDING ───────────────────────────
// Full-screen 3-screen intro overlay shown once to first-time
// faith_free users. Reads profiles.well_onboarded from Supabase;
// sets it to true on completion or skip. Overlay is injected into
// document.body and removed from DOM completely on dismissal.

async function _checkWellOnboarding() {
  if (document.getElementById('wellOnboardOverlay')) return;
  var supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if (!supa || typeof _supaUser === 'undefined' || !_supaUser) return;
  try {
    var res = await supa.from('profiles')
      .select('well_onboarded')
      .eq('user_id', _supaUser.id)
      .maybeSingle();
    if (res.error) { console.warn('[well-onboard]', res.error.message); return; }
    if (!res.data || !res.data.well_onboarded) _showWellOnboarding();
  } catch (e) { console.warn('[well-onboard] check failed', e); }
}

async function _completeWellOnboarding(overlay) {
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  var supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if (!supa || typeof _supaUser === 'undefined' || !_supaUser) return;
  try {
    await supa.from('profiles')
      .update({ well_onboarded: true })
      .eq('user_id', _supaUser.id);
  } catch (e) { console.warn('[well-onboard] update failed', e); }
}

function _showWellOnboarding() {
  if (document.getElementById('wellOnboardOverlay')) return;

  var overlay = document.createElement('div');
  overlay.id = 'wellOnboardOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#03061a;overflow:hidden;font-family:var(--fn,system-ui,sans-serif);';

  // ── Sliding track (3 screens side-by-side) ───────────────────
  var track = document.createElement('div');
  track.style.cssText = 'display:flex;height:100%;width:300%;transition:transform .45s cubic-bezier(.4,0,.2,1);will-change:transform;';

  function goTo(n) {
    track.style.transform = 'translateX(-' + (n * 100 / 3).toFixed(4) + '%)';
    overlay.querySelectorAll('.wo-dot').forEach(function(d, i) {
      d.style.background = i === n ? 'rgba(195,145,35,.92)' : 'rgba(195,145,35,.2)';
      d.style.transform  = i === n ? 'scale(1.4)' : 'scale(1)';
    });
  }

  function done() { _completeWellOnboarding(overlay); }

  // ── Shared inline style strings ──────────────────────────────
  var scrBase = 'position:relative;flex:0 0 calc(100% / 3);height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(1rem,4vw,1.6rem) clamp(1.2rem,5vw,2.5rem);box-sizing:border-box;overflow:hidden;';
  var skipSty = 'position:absolute;top:1.1rem;right:1.1rem;background:none;border:none;color:rgba(195,145,35,.48);font-size:clamp(.68rem,2.3vw,.78rem);cursor:pointer;letter-spacing:.1em;font-family:inherit;padding:.35rem .6rem;';
  var h2Sty   = 'font-size:clamp(1.4rem,5.5vw,2rem);font-weight:800;color:#f5e6c0;text-align:center;line-height:1.2;margin:0 0 .75rem;';
  var pSty    = 'font-size:clamp(.8rem,3vw,.95rem);color:rgba(245,230,192,.6);text-align:center;line-height:1.65;max-width:320px;margin:0 auto;';
  var btnSty  = 'display:inline-flex;align-items:center;gap:.35rem;background:linear-gradient(135deg,rgba(195,145,35,.92),rgba(170,112,16,.88));color:#1a0e02;border:none;border-radius:12px;padding:clamp(.65rem,2.5vw,.88rem) clamp(1.3rem,5.5vw,2rem);font-size:clamp(.84rem,3.5vw,1rem);font-weight:800;cursor:pointer;letter-spacing:.04em;box-shadow:0 4px 20px rgba(195,145,35,.2);transition:opacity .15s;';

  // ── Simple well SVG (screen 1 hero icon) ─────────────────────
  var wellSvg =
    '<svg viewBox="0 0 100 90" width="92" height="92" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M15 38 Q50 6 85 38" stroke="rgba(195,145,35,.85)" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<rect x="13" y="35" width="7" height="45" rx="2" fill="rgba(195,145,35,.4)"/>' +
      '<rect x="80" y="35" width="7" height="45" rx="2" fill="rgba(195,145,35,.4)"/>' +
      '<rect x="19" y="32" width="62" height="5" rx="2.5" fill="rgba(195,145,35,.55)"/>' +
      '<rect x="26" y="50" width="48" height="30" rx="5" fill="rgba(195,145,35,.08)" stroke="rgba(195,145,35,.45)" stroke-width="1.5"/>' +
      '<line x1="26" y1="62" x2="74" y2="62" stroke="rgba(195,145,35,.2)" stroke-width="1"/>' +
      '<line x1="26" y1="71" x2="74" y2="71" stroke="rgba(195,145,35,.2)" stroke-width="1"/>' +
      '<line x1="50" y1="37" x2="50" y2="56" stroke="rgba(195,145,35,.6)" stroke-width="1.5" stroke-dasharray="3,2"/>' +
      '<rect x="44" y="55" width="12" height="9" rx="2" fill="rgba(195,145,35,.5)" stroke="rgba(195,145,35,.88)" stroke-width="1"/>' +
      '<ellipse cx="50" cy="80" rx="20" ry="3" fill="rgba(56,189,248,.28)"/>' +
    '</svg>';

  // ── Screen 1: Welcome ─────────────────────────────────────────
  var s1 = document.createElement('div');
  s1.style.cssText = scrBase;
  s1.innerHTML =
    '<button class="wo-skip" style="' + skipSty + '">SKIP</button>' +
    '<div style="margin-bottom:1.5rem;filter:drop-shadow(0 0 22px rgba(195,145,35,.3));">' + wellSvg + '</div>' +
    '<h2 style="' + h2Sty + '">A place to draw near</h2>' +
    '<p style="' + pSty + '">The Well is your daily space for Scripture, prayer, and faith — built for you and your family.</p>' +
    '<div style="margin-top:1.8rem;"><button class="wo-next" style="' + btnSty + '">Next →</button></div>';

  // ── Screen 2: What's Inside ───────────────────────────────────
  var s2 = document.createElement('div');
  s2.style.cssText = scrBase;
  var crd = 'background:rgba(195,145,35,.07);border:1px solid rgba(195,145,35,.18);border-radius:13px;padding:.85rem .7rem;display:flex;flex-direction:column;align-items:center;gap:.35rem;';
  var cEm = 'font-size:clamp(1.4rem,4.5vw,1.65rem);line-height:1;';
  var cLb = 'font-size:clamp(.66rem,2.2vw,.76rem);font-weight:700;color:#f5e6c0;text-align:center;letter-spacing:.04em;';
  s2.innerHTML =
    '<button class="wo-skip" style="' + skipSty + '">SKIP</button>' +
    '<h2 style="' + h2Sty + 'margin-bottom:.5rem;">Everything you need to grow</h2>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.65rem;width:100%;max-width:296px;margin:.75rem 0;">' +
      '<div style="' + crd + '"><span style="' + cEm + '">&#x1F4D6;</span><span style="' + cLb + '">Bible Study</span></div>' +
      '<div style="' + crd + '"><span style="' + cEm + '">&#x1F64F;</span><span style="' + cLb + '">Prayer Wall</span></div>' +
      '<div style="' + crd + '"><span style="' + cEm + '">&#x2B50;</span><span style="' + cLb + '">Faith Proof</span></div>' +
      '<div style="' + crd + '"><span style="' + cEm + '">&#x1F525;</span><span style="' + cLb + '">Devotionals</span></div>' +
    '</div>' +
    '<p style="' + pSty + '">Guided studies, prayer tools, evidence for faith, and daily devotionals for every age.</p>' +
    '<div style="margin-top:1.4rem;"><button class="wo-next" style="' + btnSty + '">Next →</button></div>';

  // ── Screen 3: Community ───────────────────────────────────────
  var s3 = document.createElement('div');
  s3.style.cssText = scrBase;
  s3.innerHTML =
    '<div style="font-size:clamp(2.8rem,9vw,3.8rem);margin-bottom:1.1rem;line-height:1;">&#x1F91D;</div>' +
    '<h2 style="' + h2Sty + '">Built for families and groups</h2>' +
    '<p style="' + pSty + '">Study together, pray together, grow together. Invite your family or small group to join you.</p>' +
    '<div style="margin-top:1.8rem;">' +
      '<button class="wo-enter" style="' + btnSty + '">✦ Enter The Well ✦</button>' +
    '</div>';

  // ── Progress dots ─────────────────────────────────────────────
  var dotsEl = document.createElement('div');
  dotsEl.style.cssText = 'position:absolute;bottom:1.8rem;left:0;right:0;display:flex;justify-content:center;gap:.55rem;pointer-events:none;z-index:2;';
  for (var di = 0; di < 3; di++) {
    var dot = document.createElement('span');
    dot.className = 'wo-dot';
    dot.style.cssText = 'width:8px;height:8px;border-radius:50%;display:inline-block;transition:all .3s;';
    dot.style.background = di === 0 ? 'rgba(195,145,35,.92)' : 'rgba(195,145,35,.2)';
    dot.style.transform  = di === 0 ? 'scale(1.4)' : 'scale(1)';
    dotsEl.appendChild(dot);
  }

  // ── Assemble ──────────────────────────────────────────────────
  track.appendChild(s1);
  track.appendChild(s2);
  track.appendChild(s3);
  overlay.appendChild(track);
  overlay.appendChild(dotsEl);
  document.body.appendChild(overlay);

  // ── Wire buttons ──────────────────────────────────────────────
  s1.querySelector('.wo-next').addEventListener('click', function() { goTo(1); });
  s2.querySelector('.wo-next').addEventListener('click', function() { goTo(2); });
  s1.querySelector('.wo-skip').addEventListener('click', function() { done(); });
  s2.querySelector('.wo-skip').addEventListener('click', function() { done(); });
  s3.querySelector('.wo-enter').addEventListener('click', function() { done(); });
}

// ── PHASE 2B — OFFLINE INDICATOR ─────────────────────────────
// Fixed gold banner at top shown whenever navigator.onLine is false.
// Injected once; never duplicated. Shows immediately if already offline.
function initOfflineIndicator() {
  if(document.getElementById('ylcc-offline-banner')) return;
  var banner = document.createElement('div');
  banner.id = 'ylcc-offline-banner';
  banner.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(195,145,35,.95);color:#1a0c00;text-align:center;font-size:13px;font-weight:600;padding:8px;font-family:Georgia,serif;';
  banner.textContent = '⚡ You’re offline — showing saved content';
  document.body.appendChild(banner);
  window.addEventListener('offline', function() { banner.style.display = 'block'; });
  window.addEventListener('online',  function() { banner.style.display = 'none';  });
  if(!navigator.onLine) banner.style.display = 'block';
}
initOfflineIndicator();