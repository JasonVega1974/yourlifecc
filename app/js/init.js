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

// ── Show-once flag persistence (clobber-resistant + auth-gated) ──
// cloudLoad() overwrites D[*] with the cloud blob's values every load,
// and cloudSync is debounced 2s, so a flag set just before refresh can
// be clobbered before its cloud write fires. Fix:
//   1) Always dual-write to D[*] AND a per-user localStorage key
//      (ylcc_<name>_<uid>). The LS key survives cloudLoad.
//   2) Always read the LS key first; D is the fallback.
//   3) Defer gate-show decisions until auth has DEFINITIVELY resolved
//      (getSession returned, or the no-supabase path was taken).
//      A logged-in user's flag lives under _<uid>; reading before uid
//      is known silently falls to _local and then to the clobbered D,
//      both of which can be wrong → gate re-shows.
//   4) Pending promotions: if _ylccSetFlag is called pre-resolution
//      (e.g. before sign-up completes), the value lands at _local.
//      On resolution we copy it to _<uid> so flags survive the
//      logged-out → logged-in transition.
let _ylccAuthResolved = false;
let _ylccPendingFlagPromotions = [];
let _ylccAuthResolveWaiters = [];

function _ylccSetFlag(name, value){
  if (typeof D !== 'undefined') D[name] = value;
  try { localStorage.setItem(_ylccUserKey('ylcc_' + name), JSON.stringify(value)); } catch (e) {}
  // If we wrote while signed-out, queue a promotion so the value can be
  // copied to the real _<uid> key after sign-in. Same call also lands
  // the bytes at ylcc_<name>_local right now via the line above (since
  // _ylccUserKey returns _local when _supaUser is unset).
  if (typeof _supaUser === 'undefined' || !_supaUser) {
    _ylccPendingFlagPromotions.push([name, value]);
  }
}

function _ylccGetFlag(name, defaultVal){
  // Primary: per-user LS key — survives cloudLoad overwrites.
  try {
    var raw = localStorage.getItem(_ylccUserKey('ylcc_' + name));
    if (raw !== null) {
      try { return JSON.parse(raw); } catch (_) { return raw; }
    }
  } catch (e) {}
  // Pre-resolution-only fallback: a logged-out write would have landed
  // at _local. Trust it ONLY before auth has resolved; once we know the
  // uid, the authoritative scope is _<uid> and a missing key means
  // "really unset for this user."
  if (!_ylccAuthResolved) {
    try {
      var lraw = localStorage.getItem('ylcc_' + name + '_local');
      if (lraw !== null) {
        try { return JSON.parse(lraw); } catch (_) { return lraw; }
      }
    } catch (e) {}
  }
  // Final fallback: D field (clobber-prone, but covers first-load + pre-
  // migration users whose flag was set before this helper existed).
  if (typeof D !== 'undefined' && D[name] !== undefined && D[name] !== '' && D[name] !== false) {
    // Lazy backfill — pre-v243 users have D[name] but no LS key, so
    // the next cloudLoad-D-clobber would lose the flag again. Write
    // the LS key now using the same _ylccUserKey scope as fresh sets.
    // Auth-gated so we only land under _<uid> (not _local) for
    // logged-in users; genuine-value gated by the surrounding if so
    // we never backfill an empty/false/undefined.
    if (_ylccAuthResolved) {
      try { localStorage.setItem(_ylccUserKey('ylcc_' + name), JSON.stringify(D[name])); } catch (e) {}
    }
    return D[name];
  }
  return defaultVal;
}

// Marks auth as DEFINITIVELY resolved — getSession() returned (with or
// without a user) OR the offline / no-supabase path was taken. Drains
// pending promotions and runs any queued waiters. Idempotent.
function _ylccMarkAuthResolved(){
  if (_ylccAuthResolved) return;
  _ylccAuthResolved = true;
  if (typeof _supaUser !== 'undefined' && _supaUser && _ylccPendingFlagPromotions.length){
    _ylccPendingFlagPromotions.forEach(function(pair){
      try { localStorage.setItem(_ylccUserKey('ylcc_' + pair[0]), JSON.stringify(pair[1])); } catch (e) {}
    });
  }
  _ylccPendingFlagPromotions.length = 0;
  var waiters = _ylccAuthResolveWaiters.slice();
  _ylccAuthResolveWaiters.length = 0;
  waiters.forEach(function(cb){ try { cb(); } catch (e) {} });
}

// Defer a callback until auth has DEFINITIVELY resolved. Runs
// immediately if already resolved; otherwise queues until
// _ylccMarkAuthResolved fires.
function _ylccOnAuthResolved(cb){
  if (typeof cb !== 'function') return;
  if (_ylccAuthResolved) cb();
  else _ylccAuthResolveWaiters.push(cb);
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
    {id:2,name:'Algebra II',teacher:'Mr. Thompson',grade:88,target:90,color:'#22d3ee'},
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
    {id:4,text:'Run a 5K',done:true,completedDate:'March 10, 2026'},
    {id:5,text:'Learn to cook 5 new meals',done:true,completedDate:'February 28, 2026'},
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
  // Demo Emma carries a 14-day scripture streak so getScriptureStreak() — and
  // the WC-2b-ii unified flame seeded from it — reflects her D.streak=14
  // instead of resetting to ~1 on an empty scrReadDays. UTC keys match the app.
  D.scrReadDays = (function(){
    var o = {}, d = new Date();
    for (var i = 0; i < 14; i++){ o[d.toISOString().slice(0, 10)] = true; d.setUTCDate(d.getUTCDate() - 1); }
    return o;
  })();
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
          // Bug A v3 (2026-06-08) — TOKEN_REFRESHED is Supabase's
          // "session was renewed, user is still here" signal. Refresh
          // the PIN grace stamps so long sessions don't age past the
          // 5-min idle window with a stale stamp from initial sign-in.
          // Without this, sessions longer than 5 min + a refresh
          // interval would auto-lock the parent even though Supabase
          // had just confirmed the session is alive.
          try {
            localStorage.setItem('ylcc_post_login', String(Date.now()));
            if(_supaUser && _supaUser.id) localStorage.setItem('ylcc_post_login_uid', String(_supaUser.id));
          } catch(_){}
          if(typeof _activeSection !== 'undefined' && _activeSection === 's-parent'
             && typeof unlockParentDash === 'function'){
            unlockParentDash();
          }
          cloudSync();
        } else if(event === 'SIGNED_IN' && !_appInitialized){
          // Fires on explicit sign-in AND on deferred token restore (getSession returned
          // null because the access token was expired, but Supabase later refreshed it).
          //
          // Bug A v3 (2026-06-08) — STAMPS + DISMISSAL HOISTED OUT of
          // the auth-screen visibility guard. Previously a silent
          // SIGNED_OUT → SIGNED_IN cycle (token-refresh hiccup) would
          // clear the stamps via the SIGNED_OUT handler and then the
          // follow-up SIGNED_IN here would skip the rewrite because
          // the auth screen wasn't visible — leaving the dash
          // unlocked but stampless, so the next idle auto-lock fired
          // a "session timed out" PIN gate even though the user was
          // actively authenticated. Writing the stamps unconditionally
          // on every SIGNED_IN closes that hole.
          //
          // The visibility guard still wraps the cloudLoad / finishInit
          // chain below — those side effects are tied to the explicit
          // fresh-sign-in flow (authComplete handles the auth-screen
          // dismissal ~600 ms later, finishInit's _appInitialized
          // guard prevents a second init) and must NOT run on silent
          // refresh.
          try {
            localStorage.setItem('ylcc_post_login', String(Date.now()));
            if(_supaUser && _supaUser.id) localStorage.setItem('ylcc_post_login_uid', String(_supaUser.id));
          } catch(_){}
          if(typeof _activeSection !== 'undefined' && _activeSection === 's-parent'
             && typeof unlockParentDash === 'function'){
            unlockParentDash();
          }
          var _authEl = document.getElementById('authScreen');
          if(_authEl && _authEl.style.display === 'flex'){
            // _supaUser was set above; mark auth resolved so any deferred
            // gates targeting this fresh sign-in see the right uid scope.
            _ylccMarkAuthResolved();
            checkPlanStatus().then(function(blocked){
              if(blocked) return;
              cloudLoad().then(function(loaded){
                if(!loaded){ loadData(); setTimeout(cloudSync, 1500); }
                var _ae = document.getElementById('authScreen');
                if(_ae) _ae.style.display = 'none';
                authSetLoading(false);
                setSyncSt(loaded ? 'cloud' : 'local');
                // Entry gate (Phase 1, flag-gated). OFF by default → returns false →
                // the existing two lines below run unchanged. Both boot paths hook here.
                if(typeof _entryGateMaybe === 'function' && _entryGateMaybe(function(){ finishInit(true); setTimeout(setupContestFreeUser, 500); })) return;
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
        // Bug A fix (2026-06-08): burn the post-login grace stamp on a
        // real Supabase sign-out so a leftover timestamp from a now-dead
        // session cannot unlock the Parent Hub on the next visit before
        // re-auth completes. lockParentDash() already clears these on
        // explicit Lock Hub; this covers session-expiry sign-outs the
        // parent never deliberately triggered.
        try {
          localStorage.removeItem('ylcc_post_login');
          localStorage.removeItem('ylcc_post_login_uid');
        } catch(_){}
      }
    });

    let _gsResult;
    try { _gsResult = await supa.auth.getSession(); } catch(_e){ console.warn('[YourLifeCC] getSession failed:', _e); }
    const session = _gsResult && _gsResult.data && _gsResult.data.session;
    if(session && session.user){
      _supaUser = session.user;
      // 2026-06-08 fix — extend the 5-min PIN grace to session restores,
      // not just fresh signInWithPassword. Otherwise returning users get
      // the parent PIN prompt on every app open. Stamping here gives them
      // the same grace window the fresh-login path sets at auth.js:144.
      // Bug A fix (2026-06-08): also stamp the auth uid so a leftover
      // stamp from a different account on the same device is rejected
      // by unlockParentDash's uid-match check.
      try {
        localStorage.setItem('ylcc_post_login', String(Date.now()));
        if(_supaUser && _supaUser.id) localStorage.setItem('ylcc_post_login_uid', String(_supaUser.id));
      } catch(_){}
      // Bug A v2 (2026-06-08): symmetric with the deferred SIGNED_IN
      // handler above — if the parent is currently on s-parent,
      // re-evaluate grace + dismiss the gate. At boot _activeSection
      // is typically the default landing (not s-parent), so this is
      // largely a no-op on the cold-load path but covers a hard
      // refresh while sitting on the Parent Hub.
      if(typeof _activeSection !== 'undefined' && _activeSection === 's-parent'
         && typeof unlockParentDash === 'function'){
        unlockParentDash();
      }
    }
    // Auth has now definitively resolved (with or without a user). Any
    // _ylccGetFlag reads from this point forward see the right scope.
    _ylccMarkAuthResolved();
    if(session && session.user){

      const blocked = await checkPlanStatus();
      if(blocked) return;

      const loaded = await cloudLoad();
      if(!loaded){ loadData(); setTimeout(cloudSync, 1500); }
      setSyncSt(loaded ? 'cloud' : 'cloud');
      // Entry gate (Phase 1, flag-gated). OFF by default → returns false → the
      // existing age-gate/finishInit continuation below runs byte-for-byte. When ON,
      // the gate handles the child age-gate + Parent Hub route itself (plain finishInit).
      if(typeof _entryGateMaybe === 'function' && _entryGateMaybe(function(){ finishInit(true); setTimeout(setupContestFreeUser, 500); })) return;
      // Read via _ylccGetFlag — survives cloudLoad's D overwrite (the
      // per-user LS key is the authoritative source once auth has
      // resolved, which it has by this point).
      if(!_ylccGetFlag('ageBracket', '') && !IS_DEMO && !window._faithFree && _isChildProfileActive()){
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
    // No Supabase client — auth is resolved as "no user" immediately.
    _ylccMarkAuthResolved();
    loadData();
    setSyncSt('local');
    if(!_ylccGetFlag('ageBracket', '') && !IS_DEMO && !window._faithFree && _isChildProfileActive()){
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

function showAgePickerModal(callback, opts){
  _agePickerCallback = (typeof callback === 'function') ? callback : null;
  // Polish E follow-up (2026-06-09) -- Narrowed chokepoint guard
  // against the kid-onboarding age-range picker leaking onto the
  // parent surface. The picker fired on parent-hub refresh when
  // the "Viewing" dropdown was set to a kid: _isChildProfileActive()
  // returns true regardless of who is operating the app, so the
  // init boot paths treated parent-supervising-kid the same as
  // an actual kid using the app.
  //
  // Reliable signal: _profiles contains a parent profile -> family
  // account -> kid-onboarding does not apply at the account level.
  // Skip the picker and fire the callback synchronously so
  // downstream init logic continues without the modal step.
  //
  // BUT: switchToProfile -> kid is genuine kid activation on a
  // family account and the kid still needs their bracket set.
  // opts.viaKidActivation === true bypasses the suppression at
  // that one explicit call site so kid onboarding stays intact.
  //
  // Option A (gate on a parent role in _supaUser.user_metadata)
  // was investigated and rejected -- only signup_source='solo' is
  // captured; no parallel 'parent' / 'family' field exists on
  // existing accounts, so the _profiles check is the only
  // reliable signal available.
  const viaKidActivation = !!(opts && opts.viaKidActivation);
  if (!viaKidActivation
      && typeof _profiles !== 'undefined' && Array.isArray(_profiles)
      && _profiles.some(function(p){ return p && p.isParent === true; })) {
    if (_agePickerCallback) {
      try { _agePickerCallback(); } catch(_){}
      _agePickerCallback = null;
    }
    return;
  }
  const m = document.getElementById('agePickerModal');
  if(m) m.style.display = 'flex';
}

function selectAgeBracket(bracket){
  if(!['12_14','15_17','18_22'].includes(bracket)) return;
  if(typeof D === 'undefined' || !D) return;
  // Dual-write through _ylccSetFlag — D[name] AND the per-user LS key.
  // The LS key is what survives cloudLoad's D overwrite when the
  // user refreshes before the 2s-debounced cloudSync fires.
  _ylccSetFlag('ageBracket', bracket);
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

async function finishInit(cloudReady){
  if(_appInitialized) return;
  _appInitialized = true;
  if(D.sections){
    // Phase 2 (2026-07-10): the old camelCase FORCE key never matched — the real
    // section key is 'christian-living' (id s-christian-living minus the
    // s- prefix). The camelCase entry was a silent no-op since it shipped.
    const FORCE = ['cbt','resume','motivation','mentors','christian-living','worship','scripture'];
    const allowed = (typeof _bracketAllowedKeys === 'function') ? _bracketAllowedKeys(D.ageBracket) : null;
    FORCE.forEach(function(k){
      if(k === 'cbt'){ delete D.sections[k]; return; }
      if(allowed === null || allowed.has(k)) delete D.sections[k];
    });
    // Phase 2: habits joined ALL_SECTIONS, so the bracket allowlist can
    // finally hide it — backfill existing 12_14/15_17 accounts once
    // (undefined guard: a future explicit parent toggle is never stomped).
    const _alw = (typeof _bracketAllowedKeys === 'function') ? _bracketAllowedKeys(D.ageBracket) : null;
    if(_alw && !_alw.has('habits') && D.sections.habits === undefined) D.sections.habits = 0;
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
  // V1 Rebuild · Session 1 — Daily Briefing renders once at boot. The
  // module itself re-renders on visibility-change so the time-of-day
  // greeting and post-7pm Night Reflection prompt stay accurate.
  if(typeof renderDailyBriefing === 'function') renderDailyBriefing();
  // V1 Rebuild · Faith Tab redesign — Zone 1/2/3 render. Zone 2's mood
  // + challenge cards auto-refresh on visibility-change inside the
  // module so returning users see today's state, not yesterday's.
  if(typeof renderFaithZones === 'function') renderFaithZones();
  if(typeof _lastRenderedProfileId !== 'undefined'){
    _lastRenderedProfileId = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
  }
  let _defaultLanding = 's-hero'; // faith-free hero rendered via renderFaithOnlyHero(); session restore skips login, not the hero
  // Parent accounts with child profiles configured, no child currently active,
  // and not faith-free → land on Parent Hub. Without this branch they hit
  // s-hero, which #appHome hides for parent-view users (legacy hero is wrapped
  // in a hidden div), leaving the screen blank. Active child profiles + solo
  // mode + fresh accounts (no children yet) continue to land on s-hero.
  //
  // 2026-06-08 — Option C fix. Restructured for explicit null-handling so the
  // routing decision is provable in every state:
  //   _activeProfileId set + maps to a kid          → s-hero  (kid mode)
  //   _activeProfileId set + maps to the parent     → s-parent
  //   _activeProfileId unset / null / missing      → s-parent  (parent default)
  //   solo mode, faith-free, or no kids configured → s-hero  (unchanged)
  // The previous code happened to do the right thing for the null case
  // (because _activeIsChild defaults to false), but it relied on
  // implicit fall-through. The new version is explicit.
  try {
    var _hasChildren = (typeof _profiles !== 'undefined' && Array.isArray(_profiles))
      && _profiles.some(function(p){ return p && p.isParent === false; });
    var _isSoloBoot = !!(typeof D !== 'undefined' && D && D.soloMode);
    var _activeProfileSet = (typeof _activeProfileId !== 'undefined') && _activeProfileId != null && _activeProfileId !== '';

    // Resolve who the active profile is. Three outcomes:
    //   'kid'    — a child profile is active
    //   'parent' — the parent profile is active
    //   null     — no active profile (treat as parent for routing purposes)
    var _activeKind = null;
    if (_activeProfileSet && typeof _profiles !== 'undefined' && Array.isArray(_profiles)) {
      var _ap = _profiles.find(function(p){ return p && p.id === _activeProfileId; });
      if (_ap) {
        _activeKind = (_ap.isParent === false) ? 'kid' : 'parent';
      }
    }

    // The parent-hub branch fires for everyone who is NOT a kid AND has
    // at least one kid profile to manage AND isn't faith-free or solo.
    // 'parent' explicitly + null implicitly both route here.
    var _routeToParentHub =
         _hasChildren
      && !_isSoloBoot
      && !window._faithFree
      && _activeKind !== 'kid';
    if (_routeToParentHub) {
      _defaultLanding = 's-parent';
    }
  } catch(_e){}
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
    // Defer the actual show-decision until auth has resolved — otherwise
    // _ylccGetFlag's per-user LS read could fall to _local and re-show.
    _ylccOnAuthResolved(function(){
      const today = new Date().toISOString().slice(0,10);
      // faithMode opt-out lives in D.settings.faithMode with a DEF-resident
      // mirror D.faithMode (init.js keeps them in sync at onboarding). Check
      // BOTH so a legacy blob whose settings object was stripped by the old
      // pre-DEF loadData still honors the opt-out.
      const faithOn = !((D.settings && D.settings.faithMode===false) || D.faithMode===false);
      const wizardOpen = (document.getElementById('parentOnboard')||{}).classList&&document.getElementById('parentOnboard').classList.contains('open');
      const kidWizOpen = (document.getElementById('kidOnboard')||{}).classList&&document.getElementById('kidOnboard').classList.contains('open');
      const alreadyRead = D.scrReadDays && D.scrReadDays[today];
      const alreadySeen = _ylccGetFlag('devPopupSeen', '') === today;
      if(!IS_DEMO && !window._faithFree && faithOn && !alreadyRead && !alreadySeen && !wizardOpen && !kidWizOpen){
        showDailyDevModal();
        _ylccSetFlag('devPopupSeen', today);
      }
      // Email Bundle (2026-06-08) — Parts 1 + 2 one-shot modals.
      // Both gate on auth-resolved + IS_DEMO false so demo runs never
      // trigger them. Each runs at most once per user, controlled by
      // D.emailPrefs.{signupPromptShown,crossoverBannerShown}.
      if(!IS_DEMO){
        if(typeof _showSignupEmailPrefsIfEligible === 'function') _showSignupEmailPrefsIfEligible();
        if(typeof _showCrossoverBannerIfEligible    === 'function') _showCrossoverBannerIfEligible();
      }
    });
  }, popupDelay);

  startClock();
  applySettings();
  applyChildAvatar();
  renderVerse();
  startVerseAutoRotation();
  // Awaited so the wizard never flashes for a returning user — the
  // ~100-300ms Supabase read is cheaper than the trust cost of showing
  // the overlay to someone who already finished it
  // (see feedback_ux_trust_over_perf.md).
  if(typeof maybeShowOnboarding === 'function') await maybeShowOnboarding();
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

  // Calendar — one-shot migration of legacy {date,time} events into the
  // new {startDate,endDate,startTime,endTime} shape. Idempotent; only
  // writes when a field is missing. See school.js:migrateEventsToRange.
  if(typeof migrateEventsToRange === 'function') migrateEventsToRange();
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
    // WC-1b — renderPlanCatalog() is no longer pre-rendered at boot; plans.js
    // (FAITH_PLANS ~1.09 MB) lazy-loads on first Topical sub-tab open instead.
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
  const today=localDateString();
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

  // Engagement: increment total_sessions if last_active was >30 min ago.
  // This treats a returning user after a half-hour gap as a new "session"
  // even if their localStorage / Supabase row persists. Silent on errors.
  trackNewSession();

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

// 2026-05-28 v6 — Rising "bubble" sparkles removed. The DOM-injected
// .fo-sparkle particles that continuously rose from the well opening
// read as bubbles, not as gold sparkles. The canvas dSparks fireflies
// near the well base stay (they wander on a sine wave — correct
// firefly behavior). launchFaithSparkles + startFaithSparkleLoop are
// deleted; their .fo-sparkle CSS + keyframes are removed in index.html.

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

// ─── 2026-05-26 — Day/night cycle driver for the SVG hero scene ──
// 120s full cycle: night → dawn → day → dusk → night. One RAF loop
// writes 7 CSS custom properties on the .fo-mtn-svg root each frame;
// CSS rules consume those vars to set sky stop colors, sun/moon/cloud/
// bird opacity, and cross glow intensity. Sun position is set as a
// direct transform attribute because SVG cx/cy as CSS properties has
// inconsistent cross-browser support.
//
// The cycle:
//   t = 0.00 → 0.25  night → dawn
//   t = 0.25 → 0.50  dawn  → day
//   t = 0.50 → 0.75  day   → dusk
//   t = 0.75 → 1.00  dusk  → night
// Loop. Each phase blends linearly into the next.
function _foStartDayNightCycle() {
  if (window._foDnRaf) { cancelAnimationFrame(window._foDnRaf); window._foDnRaf = null; }
  var svg = document.querySelector('.fo-mtn-svg');
  var sun = document.getElementById('foDaySun');
  if (!svg) { setTimeout(_foStartDayNightCycle, 120); return; }

  // Respect reduced-motion: pin to night and skip the loop.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    svg.style.setProperty('--fo-sky-top',    '#0a0520');
    svg.style.setProperty('--fo-sky-bot',    '#1a0a3e');
    svg.style.setProperty('--fo-sun-op',     '0');
    svg.style.setProperty('--fo-moon-op',    '1');
    svg.style.setProperty('--fo-night-op',   '1');
    svg.style.setProperty('--fo-cloud-op',   '0.15');
    svg.style.setProperty('--fo-bird-op',    '0');
    svg.style.setProperty('--fo-cross-glow', '1');
    return;
  }

  // Phase keyframes — t, sky-top, sky-bot, sun-op, sun-cx, sun-cy,
  // sun-color, moon-op, night-op (stars+moonrise halo),
  // cloud-op, bird-op, cross-glow
  var P = [
    [0.000, '#0a0520','#1a0a3e', 0.00, 700,240, '#ff8c00', 1.00, 1.00, 0.15, 0.00, 1.00],
    [0.250, '#1a0a3e','#ff8c42', 0.55, 620,200, '#ff8c00', 0.40, 0.45, 0.55, 0.35, 0.85],
    [0.500, '#1a6eb5','#87ceeb', 1.00, 400, 70, '#ffe066', 0.00, 0.00, 0.85, 1.00, 0.45],
    [0.750, '#2d1b69','#e05c2e', 0.55, 180,200, '#e05c2e', 0.40, 0.45, 0.55, 0.35, 0.85],
    [1.000, '#0a0520','#1a0a3e', 0.00, 100,240, '#e05c2e', 1.00, 1.00, 0.15, 0.00, 1.00]
  ];

  function hexToRgb(h){
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lerp(a, b, f){ return a + (b - a) * f; }
  function lerpColor(c1, c2, f){
    var r1 = hexToRgb(c1), r2 = hexToRgb(c2);
    return 'rgb(' +
      Math.round(lerp(r1[0], r2[0], f)) + ',' +
      Math.round(lerp(r1[1], r2[1], f)) + ',' +
      Math.round(lerp(r1[2], r2[2], f)) + ')';
  }
  function phaseAt(t){
    var p0 = P[0], p1 = P[1];
    for (var i = 0; i < P.length - 1; i++){
      if (t >= P[i][0] && t < P[i + 1][0]) { p0 = P[i]; p1 = P[i + 1]; break; }
    }
    var f = (p1[0] === p0[0]) ? 0 : (t - p0[0]) / (p1[0] - p0[0]);
    return {
      skyTop:    lerpColor(p0[1],  p1[1],  f),
      skyBot:    lerpColor(p0[2],  p1[2],  f),
      sunOp:     lerp(p0[3], p1[3], f),
      sunCx:     lerp(p0[4], p1[4], f),
      sunCy:     lerp(p0[5], p1[5], f),
      sunColor:  lerpColor(p0[6],  p1[6],  f),
      moonOp:    lerp(p0[7], p1[7], f),
      nightOp:   lerp(p0[8], p1[8], f),
      cloudOp:   lerp(p0[9], p1[9], f),
      birdOp:    lerp(p0[10], p1[10], f),
      crossGlow: lerp(p0[11], p1[11], f)
    };
  }

  var CYCLE = 120000;
  var startTs = 0;

  function frame(ts){
    if (!startTs) startTs = ts;
    if (!svg.isConnected) { window._foDnRaf = null; return; }
    if (document.hidden) {
      // Don't burn battery while the tab is hidden — wait for
      // visibilitychange to kick us back into the loop.
      window._foDnRaf = null;
      return;
    }
    var t = (((ts - startTs) % CYCLE) / CYCLE);
    var p = phaseAt(t);

    svg.style.setProperty('--fo-sky-top',    p.skyTop);
    svg.style.setProperty('--fo-sky-bot',    p.skyBot);
    svg.style.setProperty('--fo-sun-op',     p.sunOp.toFixed(3));
    svg.style.setProperty('--fo-sun-color',  p.sunColor);
    svg.style.setProperty('--fo-moon-op',    p.moonOp.toFixed(3));
    svg.style.setProperty('--fo-night-op',   p.nightOp.toFixed(3));
    svg.style.setProperty('--fo-cloud-op',   p.cloudOp.toFixed(3));
    svg.style.setProperty('--fo-bird-op',    p.birdOp.toFixed(3));
    svg.style.setProperty('--fo-cross-glow', p.crossGlow.toFixed(3));

    if (sun) sun.setAttribute('transform',
      'translate(' + p.sunCx.toFixed(1) + ' ' + p.sunCy.toFixed(1) + ')');

    window._foDnRaf = requestAnimationFrame(frame);
  }

  // Resume the loop after the tab becomes visible again.
  if (!window._foDnVisAttached) {
    window._foDnVisAttached = true;
    document.addEventListener('visibilitychange', function(){
      if (!document.hidden) {
        var liveSvg = document.querySelector('.fo-mtn-svg');
        if (liveSvg && !window._foDnRaf) {
          startTs = 0;
          window._foDnRaf = requestAnimationFrame(frame);
        }
      }
    });
  }

  window._foDnRaf = requestAnimationFrame(frame);
}

// 2026-05-28 v5 — canvas cross sprite-sheet removed entirely. The
// well cross is now a CSS-3D overlay (#wellCrossWrap) injected as
// a sibling of the canvas in renderFaithOnlyHero. Hardware-accelerated
// rotateY animation + drop-shadow glow filter live in app/index.html.
// _foStartCanvasScene no longer needs an init step for the cross.

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
  // 2026-05-28 v7 — shooting stars. Three independent slots, each with
  // its own timer + random next-launch interval. Once a slot fires, it
  // tracks position/velocity for the duration of one streak, then
  // resets and waits for its next interval. Each slot stays gated to
  // night-phase only via the night-alpha multiplier in drawShootingStars.
  var SHOOTING_STARS = [
    { timer:0, interval: 7000 + Math.random()*5000, active:false, x:0, y:0, dx:0, dy:0, life:0, maxLife:0 },
    { timer:0, interval:10000 + Math.random()*7000, active:false, x:0, y:0, dx:0, dy:0, life:0, maxLife:0 },
    { timer:0, interval:14000 + Math.random()*8000, active:false, x:0, y:0, dx:0, dy:0, life:0, maxLife:0 }
  ];


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
  // 2026-05-28 v7 — drawShootingStars. Gated to night phase via the
  // outer `na` (night alpha) multiplier — shooting stars only appear
  // in the dark sky, never against daylight blue. Each slot in
  // SHOOTING_STARS accumulates its own ms timer; when the timer hits
  // the per-slot interval, the slot launches one streak (random
  // start position in the upper-25% sky, downward-right angle 25-55°,
  // 180-320 px/sec) then resets with a fresh random interval.
  function drawShootingStars(W, H, dt, na){
    if (na < 0.02) {
      // Daylight: skip the draw but still advance timers so launches
      // queue up for the night side of the cycle.
      for (var k=0;k<SHOOTING_STARS.length;k++){
        SHOOTING_STARS[k].timer += dt;
        SHOOTING_STARS[k].active = false;
      }
      return;
    }
    for (var i = 0; i < SHOOTING_STARS.length; i++){
      var s = SHOOTING_STARS[i];
      s.timer += dt;
      if (!s.active && s.timer >= s.interval){
        s.active   = true;
        s.timer    = 0;
        s.interval = s.interval * 0.7 + Math.random() * s.interval * 0.6;
        s.x        = W * (0.10 + Math.random() * 0.70);
        s.y        = H * (0.05 + Math.random() * 0.25);
        var ang    = (25 + Math.random() * 30) * Math.PI / 180;
        var spd    = 180 + Math.random() * 140;
        s.dx       = Math.cos(ang) * spd;
        s.dy       = Math.sin(ang) * spd;
        s.maxLife  = 0.55 + Math.random() * 0.3;
        s.life     = 0;
      }
      if (!s.active) continue;
      s.life += dt / 1000;
      if (s.life >= s.maxLife){ s.active = false; continue; }
      var prog = s.life / s.maxLife;
      // Fade in over first 20%, hold, fade out over last 30%.
      var alpha = 1;
      if (prog < 0.2)      alpha = prog / 0.2;
      else if (prog > 0.7) alpha = (1 - prog) / 0.3;
      alpha *= na;
      if (alpha < 0.02) continue;
      // Head position
      var x2 = s.x + s.dx * s.life;
      var y2 = s.y + s.dy * s.life;
      // Trail follows the actual velocity direction (the user-spec
      // formula used a fixed 40° angle which broke for off-axis
      // launches). Tail = head minus unit-velocity * trailLen.
      var trailLen = 55 + Math.random() * 30;
      var spd2 = Math.sqrt(s.dx * s.dx + s.dy * s.dy) || 1;
      var nx = s.dx / spd2, ny = s.dy / spd2;
      var tailX = x2 - nx * trailLen;
      var tailY = y2 - ny * trailLen;
      // Bright-to-transparent linear gradient for the streak body.
      var grad = ctx.createLinearGradient(tailX, tailY, x2, y2);
      grad.addColorStop(0,   'rgba(255,255,255,0)');
      grad.addColorStop(0.6, 'rgba(200,220,255,' + (alpha * 0.5).toFixed(3) + ')');
      grad.addColorStop(1,   'rgba(255,255,255,' + alpha.toFixed(3) + ')');
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.globalAlpha = alpha;
      ctx.stroke();
      // Bright head dot
      ctx.beginPath();
      ctx.arc(x2, y2, 2, 0, PI2);
      ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
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
  // 2026-05-27 — sharp mountain bezier paths replaced with gentle
  // rolling-hill curves. Same parallax depth (3 layers), same colors,
  // same atmospheric bands. Snowcap glints + ridge strokes dropped
  // (those only made sense on jagged peaks). The hills sit lower on
  // the canvas so the well in the foreground stands clear against
  // them, and the cross above the well has open sky to breathe in.
  function dFarMtns(W,H,t){
    // Far layer — deepest hills, baseline H*.66, gentle waves
    ctx.beginPath(); ctx.moveTo(0,H*.66);
    ctx.bezierCurveTo(W*.12,H*.63, W*.22,H*.615, W*.34,H*.645);
    ctx.bezierCurveTo(W*.44,H*.665, W*.54,H*.64,  W*.66,H*.625);
    ctx.bezierCurveTo(W*.76,H*.615, W*.86,H*.635, W*.94,H*.655);
    ctx.bezierCurveTo(W*.98,H*.66,  W,   H*.66,   W,   H*.66);
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    ctx.fillStyle='#060c1a'; ctx.fill();
    // Subtle atmospheric mist band on top of the far layer
    ctx.fillStyle='rgba(20,40,80,0.18)';
    ctx.fillRect(0,H*0.625,W,H*0.012);
  }
  function dMidMtns(W,H,t){
    // Mid layer — slightly closer, baseline H*.72
    ctx.beginPath(); ctx.moveTo(0,H*.72);
    ctx.bezierCurveTo(W*.14,H*.69, W*.27,H*.67,  W*.40,H*.705);
    ctx.bezierCurveTo(W*.52,H*.735, W*.62,H*.705, W*.74,H*.685);
    ctx.bezierCurveTo(W*.85,H*.705, W*.95,H*.72,  W,   H*.715);
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    ctx.fillStyle='#0a1422'; ctx.fill();
    // Atmospheric band
    ctx.fillStyle='rgba(15,30,60,0.22)';
    ctx.fillRect(0,H*0.69,W,H*0.012);
  }
  function dNearMtns(W,H,t){
    // Near layer — front-most hills, baseline H*.79; well sits on this
    ctx.beginPath(); ctx.moveTo(0,H*.79);
    ctx.bezierCurveTo(W*.18,H*.77, W*.36,H*.785, W*.50,H*.80);
    ctx.bezierCurveTo(W*.64,H*.81, W*.82,H*.785, W,   H*.78);
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    ctx.fillStyle='#0e1a2e'; ctx.fill();
    // Warm dawn/dusk wash on the hill faces (preserved from original)
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
  // 2026-05-28 v5 — drawWellCross removed. The well cross is now a
  // CSS-3D overlay (#wellCrossWrap) injected by renderFaithOnlyHero
  // as a sibling of the canvas — see the .fo-* style block in
  // app/index.html for the rotateY animation + glow filter.
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
      // 2026-05-28 v7 — capture dt before updating _lastTs so shooting
      // stars get an accurate per-frame delta for their timers.
      var _dt = _lastTs ? Math.min(ts - _lastTs, 50) : 16;
      if (_lastTs) { _t = (_t + _dt / CYCLE) % 1; }
      _lastTs = ts;
      var t = _t;
      var W = cv.width, H = cv.height, sky = getSky(t), na = nightA(t);
      dSky(W,H,sky); dStars(W,H,ts,na); drawShootingStars(W,H,_dt,na); dMoon(W,H,na); dHorizonGlow(W,H,t); dSun(W,H,t);
      // 2026-05-27 — old sky-positioned dCross retired in favour of
      // drawWellCross (centred above the well, sine-pulsed). dCross
      // function kept as dead code in case of revert.
      dClouds(W,H,t,ts); dFarMtns(W,H,t); dMidMtns(W,H,t); dNearMtns(W,H,t); dMist(W,H,t);
      dBirds(W,H,t,ts); dWell(W,H,sky.top,ts);
      // 2026-05-28 v5 — canvas cross removed entirely. Replaced by a
      // CSS-3D overlay (#wellCrossWrap) injected as a sibling of this
      // canvas in renderFaithOnlyHero; rotation + glow live in CSS
      // keyframes (hardware-accelerated) and never touch the canvas
      // render path.
      dFG(W,H); dSparks(W,H,t,ts); dScrim(W,H);
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
  // Delegate to the single source of truth (_fzFirstName) so this
  // cinematic greeting and the Well/home greetings never diverge.
  // _fzFirstName prefers active child profile → auth metadata → D.name.
  let name = '';
  if (typeof window !== 'undefined' && typeof window._fzFirstName === 'function') {
    try { name = window._fzFirstName() || ''; } catch(_){ name = ''; }
  }
  if (!name && typeof _supaUser !== 'undefined' && _supaUser) {
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
    // ── 2026-05-25 — replaced the day-night Canvas painting
    //    (_foStartCanvasScene, init.js:761) with a clean layered SVG
    //    landscape per the redesign spec. Four mountain layers + star
    //    field + moonrise glow + shooting star + a minimal SVG well in
    //    the foreground. All colors thread through CSS variables so
    //    light/dark mode tracks. The legacy canvas function is left in
    //    place untouched as dead code (easy revert).
    var svgMountains =
      '<svg class="fo-mtn-svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
        '<defs>' +
          // Soft moonrise glow behind tallest peak (mid layer)
          '<radialGradient id="foGlow" cx="36%" cy="64%" r="38%">' +
            '<stop offset="0%"  stop-color="var(--p)" stop-opacity=".42"/>' +
            '<stop offset="55%" stop-color="var(--p)" stop-opacity=".10"/>' +
            '<stop offset="100%" stop-color="var(--p)" stop-opacity="0"/>' +
          '</radialGradient>' +
          // Sky gradient — top + bottom stops driven by --fo-sky-top /
          // --fo-sky-bot CSS vars set by _foStartDayNightCycle() each
          // frame. SVG presentation attrs don't reliably accept var(),
          // so we attach classes and write stop-color via the CSS rule.
          '<linearGradient id="foSky" x1="0" y1="0" x2="0" y2="1">' +
            '<stop class="fo-sky-stop-top" offset="0"/>' +
            '<stop class="fo-sky-stop-bot" offset="1"/>' +
          '</linearGradient>' +
        '</defs>' +

        // ── Sky (back of stack, ZD reorder fills entire viewBox) ──
        '<rect class="fo-sky" x="0" y="0" width="800" height="300" fill="url(#foSky)"/>' +

        // Moonrise halo behind tallest peak — dims with the moon op
        '<rect class="fo-sky-glow" x="0" y="0" width="800" height="300" fill="url(#foGlow)"/>' +

        // ── Moon — body + offset crescent shadow to suggest phase ──
        '<g class="fo-day-moon">' +
          '<circle class="fo-moon-glow"     cx="120" cy="50" r="22"/>' +
          '<circle class="fo-moon-body"     cx="120" cy="50" r="14"/>' +
          '<circle class="fo-moon-crescent" cx="125" cy="48" r="12"/>' +
        '</g>' +

        // ── Sun — base at (0,0), positioned each frame via transform ──
        '<g class="fo-day-sun" id="foDaySun" transform="translate(620 200)">' +
          '<circle class="fo-sun-halo"  cx="0" cy="0" r="44"/>' +
          '<circle class="fo-sun-body"  cx="0" cy="0" r="20"/>' +
        '</g>' +

        // ── Clouds — 3 soft cloud groups, drift via CSS keyframes ──
        '<g class="fo-cloud fo-cloud-1">' +
          '<ellipse cx="0"  cy="0" rx="34" ry="13"/>' +
          '<ellipse cx="-22" cy="6" rx="18" ry="10"/>' +
          '<ellipse cx="24" cy="5" rx="22" ry="10"/>' +
        '</g>' +
        '<g class="fo-cloud fo-cloud-2">' +
          '<ellipse cx="0"  cy="0" rx="40" ry="14"/>' +
          '<ellipse cx="-26" cy="7" rx="20" ry="11"/>' +
          '<ellipse cx="28" cy="6" rx="24" ry="11"/>' +
        '</g>' +
        '<g class="fo-cloud fo-cloud-3">' +
          '<ellipse cx="0"  cy="0" rx="30" ry="11"/>' +
          '<ellipse cx="-18" cy="5" rx="16" ry="9"/>' +
          '<ellipse cx="20" cy="4" rx="20" ry="9"/>' +
        '</g>' +

        // Stars — 11 scattered dots in the upper sky (fade in/out
        // with --fo-night-op so they recede during day)
        '<g class="fo-stars">' +
          '<circle cx="60"  cy="40"  r="1.1" />' +
          '<circle cx="115" cy="78"  r="0.9" />' +
          '<circle cx="178" cy="32"  r="1.4" />' +
          '<circle cx="232" cy="60"  r="0.8" />' +
          '<circle cx="296" cy="22"  r="1.2" />' +
          '<circle cx="355" cy="74"  r="1.0" />' +
          '<circle cx="430" cy="36"  r="1.5" />' +
          '<circle cx="510" cy="68"  r="0.9" />' +
          '<circle cx="588" cy="44"  r="1.3" />' +
          '<circle cx="652" cy="20"  r="0.8" />' +
          '<circle cx="730" cy="58"  r="1.1" />' +
        '</g>' +

        // North star — slightly larger with a soft cross-glow
        '<g class="fo-north-star">' +
          '<circle cx="290" cy="46" r="2.4" />' +
          '<line x1="282" y1="46" x2="298" y2="46" stroke-width="0.6" />' +
          '<line x1="290" y1="38" x2="290" y2="54" stroke-width="0.6" />' +
        '</g>' +

        // Shooting star — single thin diagonal line, animated via CSS
        '<line class="fo-shoot" x1="0" y1="0" x2="40" y2="14" stroke-width="1.4" />' +

        // ── Birds — 3 small silhouettes, drift via CSS keyframes ──
        '<g class="fo-bird fo-bird-1"><path d="M0,0 C-5,-4 -10,-2 -14,0 C-10,2 -5,0 0,0 C5,-4 10,-2 14,0 C10,2 5,0 0,0"/></g>' +
        '<g class="fo-bird fo-bird-2"><path d="M0,0 C-5,-4 -10,-2 -14,0 C-10,2 -5,0 0,0 C5,-4 10,-2 14,0 C10,2 5,0 0,0"/></g>' +
        '<g class="fo-bird fo-bird-3"><path d="M0,0 C-5,-4 -10,-2 -14,0 C-10,2 -5,0 0,0 C5,-4 10,-2 14,0 C10,2 5,0 0,0"/></g>' +

        // Layer 1 — gentle rolling hills (lightest, background)
        '<path class="fo-mtn-1" d="M0,200 C100,180 200,160 300,170 C400,180 500,155 600,165 C700,175 750,170 800,165 L800,300 L0,300 Z"/>' +

        // Layer 2 — tall central peak slightly off-center
        '<path class="fo-mtn-2" d="M0,220 C70,200 140,185 200,195 C250,200 280,170 320,140 C360,170 400,200 460,205 C540,210 620,180 700,195 C740,200 770,195 800,200 L800,300 L0,300 Z"/>' +

        // Layer 3 — bolder range with 3 distinct peaks
        '<path class="fo-mtn-3" d="M0,240 C50,225 110,215 160,225 C200,232 230,205 270,215 C310,225 340,180 380,180 C420,180 450,215 490,225 C530,230 580,205 620,210 C680,218 740,225 800,225 L800,300 L0,300 Z"/>' +

        // Layer 4 — rolling foreground hills (darkest)
        '<path class="fo-mtn-4" d="M0,265 C90,255 180,248 270,260 C360,270 450,248 540,258 C620,265 700,258 800,262 L800,300 L0,300 Z"/>' +

        // ── Glowing cross — spiritual centerpiece, above the well.
        // Opacity tracks --fo-cross-glow; the breathing glow filter
        // animates independently so the cross never feels static. ──
        '<g class="fo-cross" transform="translate(400 130)">' +
          '<rect x="-3" y="-30" width="6" height="60" rx="2"/>' +
          '<rect x="-20" y="-10" width="40" height="6" rx="2"/>' +
        '</g>' +

        // ── Fireflies near the well — staggered pulse cycles ──
        '<circle class="fo-fly fo-fly-1" cx="355" cy="285" r="1.6"/>' +
        '<circle class="fo-fly fo-fly-2" cx="378" cy="296" r="1.4"/>' +
        '<circle class="fo-fly fo-fly-3" cx="418" cy="282" r="1.5"/>' +
        '<circle class="fo-fly fo-fly-4" cx="441" cy="290" r="1.3"/>' +
        '<circle class="fo-fly fo-fly-5" cx="396" cy="298" r="1.7"/>' +

        // Foreground SVG well — small silhouette, centered, anchored
        // to the very bottom. Keeps the "Enter The Well" branding
        // anchored in the visual.
        '<g class="fo-well" transform="translate(380 252)">' +
          // Soft ground shadow under the well
          '<ellipse cx="20" cy="48" rx="36" ry="3.5" fill="rgba(0,0,0,.35)"/>' +
          // Roof triangle
          '<path d="M20,2 L0,18 L40,18 Z" />' +
          // Cross-beam under the roof
          '<rect x="-2" y="17" width="44" height="2.4" rx="0.6" />' +
          // Two posts (legs supporting the roof)
          '<rect x="2"  y="19" width="2"  height="20" rx="0.5" />' +
          '<rect x="36" y="19" width="2"  height="20" rx="0.5" />' +
          // Stone body of the well
          '<rect x="6"  y="32" width="28" height="14" rx="1.5" />' +
          // Top rim of the well
          '<ellipse cx="20" cy="32" rx="14" ry="2.6" />' +
          // Rope from beam to water (subtle thin line)
          '<line class="fo-well-rope" x1="20" y1="18" x2="20" y2="31" stroke-width="0.6"/>' +
          // Bucket at the bottom of the rope (tiny rect)
          '<rect class="fo-well-bucket" x="17.4" y="29.2" width="5.2" height="3.2" rx="0.5"/>' +
          // Water surface (cool highlight)
          '<ellipse class="fo-well-water" cx="20" cy="32.3" rx="10" ry="1.6"/>' +
          // Water reflection — thin white sliver on top of water
          '<ellipse class="fo-well-water-hl" cx="20" cy="31.7" rx="6" ry="0.5"/>' +
        '</g>' +
      '</svg>';

    // 2026-05-27 — reverted to the original canvas-painted scene from
    // before commit 70ae415. The SVG landscape (svgMountains above) and
    // its day/night cycle driver (_foStartDayNightCycle) are left in
    // place as dead code in case we ever revert again.
    hero.innerHTML =
      '<div class="fo-hero" id="faithOnlyHero">' +
        '<canvas id="fo-canvas-scene" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;"></canvas>' +
        // 2026-05-28 v6 — CSS-3D solid 12-face gold cross. Both bars
        // have all six faces (front/back/left/right/top/bottom) so
        // the cross reads as a real gold box from every rotation
        // angle instead of a flipping piece of paper. Positioned by
        // #wellCrossWrap in the .fo-* style block — sits in the sky
        // above the well graphic.
        '<div id="wellCrossWrap" aria-hidden="true">' +
          '<div id="wellCross3d">' +
            // Vertical bar — 6 faces
            '<div class="cx-face cx-vbar-front"></div>' +
            '<div class="cx-face cx-vbar-back"></div>' +
            '<div class="cx-face cx-vbar-left"></div>' +
            '<div class="cx-face cx-vbar-right"></div>' +
            '<div class="cx-face cx-vbar-top"></div>' +
            '<div class="cx-face cx-vbar-bot"></div>' +
            // Horizontal crossbeam — 6 faces
            '<div class="cx-face cx-hbar-front"></div>' +
            '<div class="cx-face cx-hbar-back"></div>' +
            '<div class="cx-face cx-hbar-left"></div>' +
            '<div class="cx-face cx-hbar-right"></div>' +
            '<div class="cx-face cx-hbar-top"></div>' +
            '<div class="cx-face cx-hbar-bot"></div>' +
          '</div>' +
        '</div>' +
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
  // 2026-05-27 — canvas restored. The SVG-based _foStartDayNightCycle
  // is left in place as dead code; switch the setTimeout target above
  // to revert to the SVG path if needed.
  setTimeout(_foStartCanvasScene, 150);

  // ── Entry cards & today's verse intentionally NOT rendered. ──
  // After clicking "Enter The Well", wellGoto('home') takes them inside where
  // they choose Bible Stories / Reading Plans / Faith Academy / Prayer.
  // (2026-05-28 v6 — sparkle "bubble" loop calls removed.)
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
  // Delegate to the single source of truth in faith-zones.js so every
  // greeting in the app — Daily Briefing, app-home, faith, and this
  // legacy hero — resolves to the SAME name (active profile first,
  // then D.name, then auth metadata).
  let name = '';
  if (typeof window !== 'undefined' && typeof window._fzFirstName === 'function') {
    try { name = window._fzFirstName() || ''; } catch(_){ name = ''; }
  }
  if(!name){
    name = (typeof D !== 'undefined' && D && D.name) ? String(D.name).trim() : '';
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

// Wizard step 2 collects an age BRACKET string ('12_14' / '15_17' /
// '18_22' / 'parent'). The new profiles.age column is INTEGER. We map
// brackets to a representative integer for the column; 'parent' maps
// to null since a parent shouldn't get a teen's int. The full bracket
// string still goes into profiles.age_bracket (existing TEXT column
// still read by api/faith-register.js).
const AGE_BRACKET_TO_INT = {
  '12_14': 13,
  '15_17': 16,
  '18_22': 20,
  'parent': null,
};

// Supabase-first onboarding gate. The wizard must NEVER flash for a user
// who has already completed it — see feedback_ux_trust_over_perf.md for
// why we eat ~100-300ms of boot delay rather than race a timeout.
//
// Order of truth:
//   1. D.onboardingDone === true       → trust, skip (no network call).
//      This flag only ever flips false → true, so a positive value is
//      always reliable. The bug we're fixing is the FALSE case.
//   2. profiles.onboarding_completed   → authoritative; survives Safari
//      localStorage wipes and the 2-second debounced cloudSync race
//      that used to drop the flag when the user closed the tab fast.
//   3. D.onboardingDone === false      → only trusted as a fallback when
//      the Supabase read errors (true offline scenario).
async function maybeShowOnboarding(){
  if(typeof D === 'undefined' || !D) return;
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO) return;
  if(typeof window !== 'undefined' && window._faithFree) return;

  // 1. Fast path — no network call for the common returning-user case.
  if(D.onboardingDone){
    console.log('[onboarding] D.onboardingDone=true — skip wizard');
    return;
  }

  // 2. Block on Supabase. The wizard overlay stays display:none until we
  //    know for sure whether to render it. Pulls first_name + age too so
  //    we can mirror them to D for offline consistency (Safari localStorage
  //    wipe scenario — Supabase becomes the source of truth on next boot).
  let supabaseSaysCompleted = null; // null = unknown (read failed)
  let supabaseProfile = null;
  try {
    const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
    if(supa && typeof _supaUser !== 'undefined' && _supaUser){
      const { data, error } = await supa.from('profiles')
        .select('onboarding_completed, first_name, age')
        .eq('user_id', _supaUser.id)
        .maybeSingle();
      if(error){
        console.warn('[onboarding] Supabase read error — fall back to D:', error.message);
      } else {
        supabaseProfile = data || null;
        supabaseSaysCompleted = !!(data && data.onboarding_completed);
        console.log('[onboarding] Supabase onboarding_completed =', supabaseSaysCompleted);
      }
    }
  } catch(e){
    console.warn('[onboarding] Supabase read threw — fall back to D:', e && e.message);
  }

  if(supabaseSaysCompleted === true){
    // Promote D so future fast-path checks short-circuit without a query.
    D.onboardingDone = true;
    if(supabaseProfile){
      if(supabaseProfile.first_name && !D.name) D.name = supabaseProfile.first_name;
      if(typeof supabaseProfile.age === 'number' && !D.age) D.age = supabaseProfile.age;
    }
    if(typeof save === 'function') save();
    console.log('[onboarding] Promoted D.onboardingDone from Supabase column');
    return;
  }

  // BACKFILL — existing user completed the wizard before the dedicated
  // columns shipped: D.onboardingDone=true (from cloudLoad blob) but
  // profiles.onboarding_completed=false (default). Write the completion
  // now so future boots take the Supabase fast-path and Safari users
  // who lose localStorage don't re-see the wizard.
  if(supabaseSaysCompleted === false && D.onboardingDone){
    console.log('[onboarding] backfilling existing user → Supabase columns…');
    try {
      const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
      if(supa && _supaUser){
        const ageInt = (typeof D.age === 'number')
          ? D.age
          : (AGE_BRACKET_TO_INT[D.ageBracket] !== undefined ? AGE_BRACKET_TO_INT[D.ageBracket] : null);
        const { error } = await supa.from('profiles').update({
          first_name:              D.name || null,
          age:                     ageInt,
          onboarding_completed:    true,
          onboarding_completed_at: D.onboardingCompletedAt || new Date().toISOString(),
        }).eq('user_id', _supaUser.id);
        if(error){
          console.warn('[onboarding] backfill write failed (non-blocking):', error.message);
        } else {
          console.log('[onboarding] backfill complete — wizard skipped');
        }
      }
    } catch(e){
      console.warn('[onboarding] backfill threw (non-blocking):', e && e.message);
    }
    return;
  }

  // 3. Offline fallback — only trust D.onboardingDone if the read FAILED.
  //    A successful read with onboarding_completed=false (or missing row)
  //    means we genuinely need to run the wizard.
  if(supabaseSaysCompleted === null && D.onboardingDone){
    console.log('[onboarding] Supabase unreachable, D says done — skip wizard');
    return;
  }

  await _showOnboardingWizard();
}

// Wizard render — extracted so the self-heal check at the top can run
// every time the overlay is about to mount, not just from the boot
// gate. maybeShowOnboarding decides "should we even consider showing
// it"; this function decides "is it actually safe to render right now"
// (final line of defence against stale local state).
async function _showOnboardingWizard(){
  // SELF-HEAL — last-chance Supabase check. If the column says completed
  // we don't render the wizard, we promote the local flag and bail.
  // Catches the scenarios maybeShowOnboarding's earlier reads missed:
  //   - boot-time Supabase fetch returned a transient error → null
  //     came back as supabaseSaysCompleted but the column is actually
  //     true; this read happens later so the network may now be healthy
  //   - manual call to _showOnboardingWizard from a debug path
  //   - stale-cache load that brought back an out-of-date D blob
  try {
    const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
    if(supa && typeof _supaUser !== 'undefined' && _supaUser){
      const { data } = await supa.from('profiles')
        .select('onboarding_completed')
        .eq('user_id', _supaUser.id)
        .maybeSingle();
      if(data && data.onboarding_completed === true){
        console.log('[onboarding] self-heal — Supabase says done, aborting wizard render');
        D.onboardingDone = true;
        if(typeof save === 'function') save();
        return;
      }
    }
  } catch(e){
    console.warn('[onboarding] self-heal check failed, continuing with wizard:', e && e.message);
  }

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

// Escape hatch for users convinced they've already done onboarding but
// still see the wizard (e.g. stale cache + Supabase column not set
// because the original completion predated the column migration).
// Confirms, writes the durable flag to BOTH Supabase and local D,
// then closes the overlay. Fire-and-forget on the Supabase write —
// the local flag closes the loop even if the network call fails.
function onbDismissAlreadyDone(){
  if(typeof confirm !== 'function') return;
  if(!confirm('Skip onboarding? You can update your name in Settings later.')) return;
  try {
    const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
    if(supa && typeof _supaUser !== 'undefined' && _supaUser){
      supa.from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('user_id', _supaUser.id)
        .then(function(res){
          if(res && res.error) console.warn('[onboarding] dismiss write failed:', res.error.message);
          else console.log('[onboarding] dismiss-already-done flag written to Supabase');
        });
    }
  } catch(e){
    console.warn('[onboarding] dismiss-already-done threw:', e && e.message);
  }
  D.onboardingDone = true;
  D.onboardingCompletedAt = new Date().toISOString();
  if(typeof save === 'function') save();
  const overlay = document.getElementById('onboardingOverlay');
  if(overlay){
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
  if(typeof showToast === 'function') showToast('Onboarding skipped — you can update your profile in Settings');
}
if(typeof window !== 'undefined'){
  window._showOnboardingWizard = _showOnboardingWizard;
  window.onbDismissAlreadyDone = onbDismissAlreadyDone;
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

// Atomic onboarding-completion writer.
//
// Spec called for `_completeOnboarding(name, age)` writing 4 columns
// (first_name, age, onboarding_completed, onboarding_completed_at).
// Extended to a 3-arg form so we can also write age_bracket (TEXT) in
// the SAME update — age_bracket is still read by api/faith-register.js
// and existed before this session's migration, so writing both in one
// round-trip is correct + avoids a second Supabase call.
//
// Always mirrors to D and saves locally first so the offline path
// works regardless of Supabase reachability. Returns {ok, fallback, error}.
async function _completeOnboarding(name, age, ageBracket){
  console.log('[onboarding] completing — writing to Supabase…');

  const now = new Date().toISOString();
  // Local mirror first — guarantees offline behaviour stays sane even
  // if the network call below throws.
  if(name) D.name = name;
  if(typeof age === 'number') D.age = age;
  D.onboardingDone = true;
  D.onboardingCompletedAt = now;
  if(typeof save === 'function') save();

  const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if(!supa || typeof _supaUser === 'undefined' || !_supaUser){
    console.warn('[onboarding] no Supabase session — falling back to localStorage only');
    return { ok: true, fallback: true };
  }
  try {
    const payload = {
      onboarding_completed:    true,
      onboarding_completed_at: now,
    };
    if(name)                     payload.first_name  = name;
    if(typeof age === 'number')  payload.age         = age;
    if(ageBracket)               payload.age_bracket = ageBracket;
    const { error } = await supa.from('profiles').update(payload).eq('user_id', _supaUser.id);
    if(error){
      console.error('[onboarding] Supabase write failed:', error);
      return { ok: false, error: error.message, fallback: true };
    }
    console.log('[onboarding] complete ✓ Supabase + local updated:', payload);
    return { ok: true };
  } catch(e){
    console.error('[onboarding] unexpected error:', e);
    return { ok: false, error: String(e), fallback: true };
  }
}

// Async — awaits a direct write to dedicated profiles columns before
// closing the wizard. The debounced cloudSync() inside save() is NOT
// reliable for completion state: a fast tab-close beats the 2-second
// debounce, and Safari's aggressive localStorage clearing leaves the
// returning user with no D.onboardingDone either. The dedicated columns
// (run docs/migrations/onboarding-flag.sql first) survive both.
async function onbComplete(){
  if(_onbSelectedAge && _onbSelectedAge !== 'parent'){
    // Phase 2.1 parity (2026-07-03) — mirror selectAgeBracket(), the
    // parent-created-child path: dual-write the bracket via _ylccSetFlag
    // (a bare D.ageBracket is lost if cloudLoad overwrites D before the
    // debounced cloudSync lands) and apply the same D.sections reduction
    // so a solo teen gets the identical surface a parent-created child
    // of the same bracket gets. The wizard runs after finishInit already
    // built the sidebar, so rebuild it; the applyStageFilter() call
    // below re-applies the stage layer on the fresh nodes.
    if(typeof _ylccSetFlag === 'function') _ylccSetFlag('ageBracket', _onbSelectedAge);
    else D.ageBracket = _onbSelectedAge;
    if(!window._faithFree && typeof applyAgeBracketSections === 'function'){
      applyAgeBracketSections(_onbSelectedAge);
      if(typeof buildSideNav === 'function') buildSideNav();
    }
  }
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
  const ageInt  = (AGE_BRACKET_TO_INT[_onbSelectedAge] !== undefined)
    ? AGE_BRACKET_TO_INT[_onbSelectedAge]
    : null;

  // Atomic 5-column write (first_name + age + age_bracket +
  // onboarding_completed + onboarding_completed_at). Awaited so the
  // overlay only closes after the flag is durably set — fast tab-close
  // can no longer drop the completion state.
  const result = await _completeOnboarding(nameVal, ageInt, _onbSelectedAge || null);
  if(result && result.fallback === true && typeof showToast === 'function'){
    if(typeof navigator !== 'undefined' && navigator.onLine === false){
      // Truly offline — quieter copy.
      showToast('Saved locally — will sync when reconnected');
    } else {
      // Online but write errored — surface so user knows something went wrong.
      showToast('Saved locally — we\'ll retry sync shortly');
    }
  }

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

// ── ENGAGEMENT: SESSION COUNTER ──────────────────────────────
// Increments profiles.total_sessions if last_active was >30 min ago. Called
// from finishInit. Silent on errors — analytics never breaks the app.
function trackNewSession(){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO) return;
  if(typeof _supaUser === 'undefined' || !_supaUser) return;
  var supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if(!supa) return;
  var uid = _supaUser.id;
  supa.from('profiles')
    .select('last_active, total_sessions')
    .eq('user_id', uid)
    .maybeSingle()
    .then(function(res){
      if(!res || res.error) return;
      var row = res.data || {};
      var lastActive = row.last_active ? new Date(row.last_active).getTime() : 0;
      var minutesAgo = lastActive > 0 ? (Date.now() - lastActive) / 60000 : Infinity;
      if(minutesAgo > 30){
        supa.from('profiles').update({
          total_sessions: (row.total_sessions || 0) + 1,
          last_active:    new Date().toISOString()
        }).eq('user_id', uid).then(function(r){
          if(r && r.error) console.warn('[engagement] session bump failed:', r.error.message);
        });
      }
    }, function(err){
      console.warn('[engagement] session read failed:', err && err.message);
    });
}
window.trackNewSession = trackNewSession;