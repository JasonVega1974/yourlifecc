/* =============================================================
   data.js — Default data object (DEF), D instance, local state vars
============================================================= */

// ═══════════════════════════════════════════════════════════
// LIFE OS — COMPLETE JAVASCRIPT
// ═══════════════════════════════════════════════════════════

const DEF = {
  // identity
  name:'', mode:'high', theme:'', palette:'', heroBg:'', heroBgPreset:'', appBgPreset:'',
  heroCustomMsg:'', bannerMode:'', faithMode:true, hideScripture:false,
  // profile
  profile:{age:'',sex:'',education:'',parentMode:false,parentName:'',parentEmail:''},
  bio:{}, vision:'', elevatorPitch:'',
  // sections visibility
  sections:{},
  // scripture / faith
  verses:[], verseIdx:0, verseSpeed:60000, verseSpeedMs:60000,
  favVerses:[], prayers:[], bibleReadings:[], scrNotes:{}, scrHighlight:{},
  scrPoints:0, scrReadDays:[], scrNotes:{},
  // streak / checkin
  streak:0, lastCheckin:null, checkin:{}, customHabits:[], dailyChecks:{},
  // money
  bank:0, bankLabel:'', bankSavAcct:0, bankSavAcctLabel:'', bankHistory:[],
  bills:[], transactions:[], earnings:0, allowance:0,
  budgetIncome:0, budgetSavings:0,
  savingsGoals:[
    {id:1, name:'Emergency Fund', emoji:'🛡️', target:1000, current:0},
    {id:2, name:'New Car', emoji:'🚗', target:5000, current:0},
    {id:3, name:'College / School', emoji:'🎓', target:3000, current:0},
  ],
  // school
  classes:[], assignments:[], studyLog:[], studyPlan:[], exams:[],
  gpaTarget:4.0, rsTypingBests:{}, ttBests:{},
  // schedule / calendar
  schedule:{}, events:[],
  // resume / jobs
  resume:{name:'',title:'',email:'',phone:'',location:'',linkedin:'',website:'',summary:'',education:[],experience:[],skills:[],certifications:[],languages:[],activeTemplate:'modern',resumes:{}},
  jobApps:[], mockInterviews:[],
  // health
  weightLog:[], weightGoal:null,
  foodLog:[], macroGoals:{cal:2000,pro:150,carb:200,fat:65},
  growthLog:[], activityLog:[], customActivities:[], hiddenActivities:[],
  screenTime:{}, sessionLog:[],
  // mood
  moods:[],
  // goals / milestones
  goals:[], milestones:[], selectedCareers:[], timeline:[],
  // journal / quotes
  journal:[], quotes:[],
  // reading
  books:[],
  // mentors
  mentors:[],
  // skills / CBT
  skillCerts:{}, skillQuizScores:{}, pendingQuizzes:[], quizResults:{}, quizzes:{},
  cbtProgress:{}, cbtTypingBests:{},
  // growing up
  growingUpRead:[],
  // music / craft
  gigLog:[], craftName:'My Craft', myInstruments:[], practiceSessions:[],
  // driving
  driverChecklist:{},
  // chores / rewards
  choreList:[], choreLog:[], chores:{}, selfChores:[], chorePoints:0, chorePin:'',
  rewards:[], incentives:[], behaviorLog:[], parentNotes:[],
  parentPIN:'', parentPinDisabled:false, parentWizardDone:false,
  parentGrowth:{}, childAvatar:'', childAvatarPhoto:'',
  // challenges / contests
  helpfulDeeds:[], challengeProgress:{}, customContests:[], customFamilyRewards:[],
  // badges / gamification
  bankSavAcct:0,
  // photos / media
  photos:[],
  // settings / misc
  betaFeedback:[], gsDismissed:false, gspDismissed:false, kidOnboardDone:false,
  bannerMode:'scroll',
};

let D = JSON.parse(JSON.stringify(DEF));
let _txFilter='all', _asgFilter='all', _gFilter='all', _galFilter='all';
let _timerSecs=1500, _timerRunning=false, _timerInterval=null, _timerStart=null;
let _calY=new Date().getFullYear(), _calM=new Date().getMonth();
let _audio=new Audio(), _tracks=[], _trackIdx=0, _playing=false;
let _wpTimer=null;

// ── STORAGE ─────────────────────────────────────────────────
const LS='lifeos_v2', CU='lifeos_cu', CK='lifeos_ck';

function save(){
  // Sync resume fields to D before saving
  const rFields=['rName','rTitle','rEmail','rPhone','rLocation','rLinkedin','rWebsite','rSummary','rSkills','rCerts','rLangs'];
  if(document.getElementById('rName')){
    if(!D.resume) D.resume={};
    rFields.forEach(id=>{ const el=document.getElementById(id); if(el) D.resume[id.slice(1).toLowerCase()]=el.value; });
    // Special case field name mappings
    const m={name:'rName',title:'rTitle',email:'rEmail',phone:'rPhone',location:'rLocation',linkedin:'rLinkedin',website:'rWebsite',summary:'rSummary',skills:'rSkills',certs:'rCerts',langs:'rLangs'};
    Object.entries(m).forEach(([k,id])=>{ const el=document.getElementById(id); if(el) D.resume[k]=el.value; });
    D.resume.experience=collectEntries('exp');
    D.resume.education=collectEntries('edu');
  }
  localStorage.setItem(LS, JSON.stringify(D));
  showSaved();
  // Sync to Supabase if logged in (debounced 2s)
  clearTimeout(_wpTimer);
  _wpTimer = setTimeout(cloudSync, 2000);
}

function loadData(){
  const keys=[LS,'lifeos_p1','lifeos_v1','dominic_v1','levelup_v3'];
  for(const k of keys){
    try{
      const r=localStorage.getItem(k); if(!r) continue;
      const p=JSON.parse(r); if(!p||typeof p!=='object') continue;
      for(const key of Object.keys(DEF)){ if(key in p) D[key]=p[key]; }
      // Never hide sections added after initial registration
      if(D.sections){ ['cbt','resume','motivation','mentors','hero','parent'].forEach(s=>{ delete D.sections[s]; }); }
      if(D.sections && D.sections.cbt===0) delete D.sections.cbt;
      if(k!==LS){ localStorage.setItem(LS,JSON.stringify(D)); }
      return;
    }catch(e){}
  }
}

function showSaved(){
  ['svi','svi2'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    el.style.opacity='1';
    clearTimeout(el._t);
    el._t=setTimeout(()=>el.style.opacity='0',1800);
  });
}

// ── CLOUD ────────────────────────────────────────────────────
function setSyncSt(s){ 
  // If we have a logged-in user, never show "Local Only" — show syncing state instead
  if(s==='local' && _supaUser) s='cloud';
  const labels={loading:['⟳ Syncing…','#888'],cloud:['☁ Cloud Saved','var(--gr)'],local:['💾 Local Only','var(--tx2)']};
  var t,col; var base=labels[s]||labels.local;
  t=base[0]; col=base[1];
  if(s==='cloud'){
    const last=localStorage.getItem('lifeos_last_sync');
    if(last){
      const mins=Math.round((Date.now()-parseInt(last))/60000);
      const timeStr=mins<1?'just now':mins<60?mins+'m ago':Math.round(mins/60)+'h ago';
      t='☁ Saved · '+timeStr;
    }
  }
  ['syncSt','syncSt2'].forEach(function(id){var el=document.getElementById(id);if(el){el.textContent=t;el.style.color=col;}});
  var emailEl=document.getElementById('authUserEmail');
  if(emailEl) emailEl.textContent=_supaUser?_supaUser.email:'';
  var sob=document.getElementById('sideSignOutBtn');
  if(sob) sob.style.display=_supaUser?'block':'none';
}

