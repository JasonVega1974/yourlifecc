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
  scrPoints:0, scrReadDays:{}, devPopupSeen:'',
  // F2-B reading plans: active is keyed by planId (object so multiple plans
  // can run concurrently); completed is an append-only list of planId archives.
  faithPlans:{ active:{}, completed:[] },
  // F2-D Bible reader annotations. Each entry is { id, book, chapter, verse, ... }.
  // Highlights carry color, notes carry text, bookmarks just mark the verse.
  faithHighlights:[], faithNotes:[], faithBookmarks:[],
  // Per-user reader prefs (font size, line height, family). UI exposes these
  // in a collapsible Settings cog on the ESV reader.
  faithReaderSettings:{ fontSize:'medium', lineHeight:'normal', fontFamily:'serif' },
  // Daily-keyed log so re-opening a chapter doesn't repeatedly grant +2 XP.
  // Key shape: 'YYYY-MM-DD|<book>|<chapter>'. Pruned implicitly by date drift.
  faithChapterReadLog:{},
  // F2-F memory verses with SM-2-lite scheduling.
  // Each entry: { id, reference, text, category, ease, intervalDays, nextDue (ISO date),
  //               lastReviewed, mastered, masteredAt, createdAt, totalReviews, correctReviews }
  memoryVerses:[],
  // F2-G Ask the Bible history. Each entry: { id, question, answer, verses[], application, createdAt }.
  // Capped client-side at 50 entries to keep the cloud-synced blob lean.
  faithAiHistory:[],
  // F2-I Faith Academy progress.
  // Shape: { lessons:{ '<lessonId>': isoDate },
  //          courses:{ '<courseId>': { quizAttempts, quizBestScore, quizPassedAt, certificateId, certificateIssuedAt } },
  //          badges:{ '<moduleId>': isoDate } }
  faithAcademyProgress:{ lessons:{}, courses:{}, badges:{} },
  // F2-H sermon notes — added in 🌟 Journey tab. Each entry:
  // { id, date, church, speaker, title, scriptures, notes, takeaway, actionStep, createdAt, updatedAt }
  sermonNotes:[],
  // F2-H streak-forgiveness state. weekKey is ISO YYYY-Www; skipUsed tracks
  // whether the user already cashed in their one free weekday skip this week.
  // Sundays are always auto-protected (Sabbath Rest) — no skip needed.
  faithStreakState:{ weekKey:'', skipUsed:false },
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
  parentGrowth:[], childAvatar:'', childAvatarPhoto:'',
  // challenges / contests
  helpfulDeeds:[], challengeProgress:{}, customContests:[], customFamilyRewards:[],
  // photos / media
  photos:[],
  // settings / misc
  betaFeedback:[], gsDismissed:false, gspDismissed:false, kidOnboardDone:false, soloMode:false,
  bannerMode:'scroll',
};

let D = JSON.parse(JSON.stringify(DEF));
let _txFilter='all', _asgFilter='all', _gFilter='all', _galFilter='all';
let _timerSecs=1500, _timerRunning=false, _timerInterval=null, _timerStart=null;
let _calY=new Date().getFullYear(), _calM=new Date().getMonth();
let _audio=new Audio(), _tracks=[], _trackIdx=0, _playing=false;
let _wpTimer=null;


