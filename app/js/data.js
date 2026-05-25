/* =============================================================
   data.js — Default data object (DEF), D instance, local state vars
============================================================= */

// ═══════════════════════════════════════════════════════════
// LIFE OS — COMPLETE JAVASCRIPT
// ═══════════════════════════════════════════════════════════

const DEF = {
  // identity
  name:'', mode:'high', theme:'', palette:'', heroBg:'', heroBgPreset:'', appBgPreset:'', cardTheme:'kingdom',
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
  // F3-B/D Bible Lands visit + badge progress.
  // Shape: { sites:{ '<siteId>': isoDate }, discoveries:{ '<discId>': isoDate }, badges:{ '<badgeId>': isoDate } }
  faithBibleWorld:{ sites:{}, discoveries:{}, badges:{} },
  // F2-H sermon notes — added in 🌟 Journey tab. Each entry:
  // { id, date, church, speaker, title, scriptures, notes, takeaway, actionStep, createdAt, updatedAt }
  sermonNotes:[],
  // F2-H streak-forgiveness state. weekKey is ISO YYYY-Www; skipUsed tracks
  // whether the user already cashed in their one free weekday skip this week.
  // Sundays are always auto-protected (Sabbath Rest) — no skip needed.
  faithStreakState:{ weekKey:'', skipUsed:false },
  // F4-G — Story Mode completion log. Keyed by `${YYYY-MM-DD}::${storyId}`,
  // value is true. Used to gate the per-day +10 XP award per story.
  faithStoriesViewed:{},
  // Proof & Prophecy — array of proof ids the user has bookmarked. Persisted
  // through cloudSync. Tab is read-only otherwise (D.savedProofs is the only
  // proof-prophecy field that mutates).
  savedProofs:[],
  // V1 Rebuild · Faith Tab Redesign — Zone 1 (Convince Me hero) state.
  // convinceMeSeen[] is the list of card ids the user has flipped; the
  // deck reshuffles + resets when every id is in the list. Curiosity
  // streak increments once per local day the user engages at least one
  // card; faithCuriosityLastDate is the YYYY-MM-DD of the last credit.
  convinceMeSeen:[],
  faithCuriosityStreak:0,
  faithCuriosityLastDate:'',
  // V1 Rebuild · Faith Tab Redesign — Zone 2 (Today). faithChallenges
  // keyed by YYYY-MM-DD → true when completed. faithMood keyed by
  // YYYY-MM-DD → one of '😞 😐 🙂 😊 🔥'. quickPrayers is an append-only
  // log (capped to 50 in faith-zones.js) — each { text, date }.
  faithChallenges:{},
  faithMood:{},
  quickPrayers:[],
  // V1 Rebuild · Faith Tab Redesign — Zone 3 toggle state. true means
  // the Explore section is expanded; persists across sessions.
  faithExploreOpen:false,
  // V1 Rebuild · Session 2 — Night Reflection log. Each entry shape:
  // { date:'YYYY-MM-DD', mood:'😞|😐|🙂|🔥', text:string, prayed:bool, ts:isoString }
  // Capped client-side to the most recent 60 entries by faith-zones.js
  // so the cloud-synced blob stays lean. Surfaced in the Prayer sub-tab
  // history strip and used by Session 3 traits to award Wisdom + Gratitude.
  nightReflections:[],
  // V1 Rebuild · Session 3 — Identity Traits. 7 keys: courage,
  // discipline, compassion, wisdom, integrity, gratitude, faith.
  // Stored as accumulated XP points; getTraitLevel() in traits.js
  // derives the [0..4] level using TRAIT_THRESHOLDS = [0,50,150,350,700].
  traits:{},
  // 2026-05-30 — Smart Welcome state. faithLastVisit is the ms
  // timestamp of the last time the user entered the faith section;
  // renderFaithZones uses it to decide whether to show the
  // welcome-back overlay (24h+ gap) or the regular home view.
  // faithLastDest is the last destination they opened, used to
  // surface "Continue where you left off" on the welcome screen.
  faithLastVisit:0,
  faithLastDest:null,
  // 2026-05-30 — Heart Check usage log. Each entry { key, date }
  // where key is one of the 12 HEART_CHECK ids. Capped to the
  // most recent 100 in faith-zones.js. Used for trait awards on
  // prayer/action completion + future personalization.
  heartChecks:[],
  // streak / checkin
  streak:0, lastCheckin:null, checkin:{}, customHabits:[], dailyChecks:{},
  // V1 Rebuild — Session 1 (Daily Briefing). Keyed by YYYY-MM-DD; per-day
  // shape { faith:bool, growth:bool, realWin:bool }. The Daily 3 tiles on
  // the new home card flip these flags; all-three-true triggers confetti.
  dailyThree:{},
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
  // Phase C-Health: sleep (D.sleepLog[]), weekly PHQ-2 mind check-ins
  // (D.phq2Log[]), and simple breakfast/lunch/dinner/snack meal log
  // (D.foodMeals[]) — distinct from D.foodLog above which is the macro
  // tracker. Capped client-side: sleep 90d, phq2 52 entries, meals 500.
  sleepLog:[], phq2Log:[], foodMeals:[],
  // mood
  moods:[],
  // goals / milestones
  goals:[], milestones:[], selectedCareers:[], timeline:{},
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
  choreList:[], choreLog:[], chores:{}, selfChores:[], chorePoints:{total:0,spent:0}, chorePin:'',
  rewards:[], incentives:[], behaviorLog:[], parentNotes:[],
  parentPIN:'', parentPinDisabled:false, parentWizardDone:false,
  parentGrowth:[], childAvatar:'', childAvatarPhoto:'',
  // challenges / contests
  helpfulDeeds:[], challengeProgress:{}, customContests:[], customFamilyRewards:[],
  // photos / media
  photos:[],
  // settings / misc
  betaFeedback:[], gsDismissed:false, gspDismissed:false, kidOnboardDone:false, soloMode:false,
  // Phase 2.2 hero: 1 = compact (cards collapsed under "See full stats" link); 0 = expanded
  heroCompact:1,
  // Phase 2.1 age picker: '' (unset, picker fires on first launch) | '12_14' | '15_17' | '18_22'
  ageBracket:'',
  // F6.3 — Data-layer mirror of window._faithFree. Set true alongside
  // window._faithFree in auth.js when plan_status='faith_free'. Either
  // flag may be read by feature code; both stay in sync.
  faithOnly:false,
  // Phase E (2026-05-15) — 4-step onboarding overlay shows once for
  // every new user, never again after completion. onboardingInterests
  // is the multi-select from step 3 — used by goal-suggest, content
  // personalization, and future home-screen curation.
  onboardingDone:false, onboardingInterests:[],
  bannerMode:'scroll',
};

let D = JSON.parse(JSON.stringify(DEF));
let _txFilter='all', _asgFilter='all', _gFilter='all', _galFilter='all';
let _timerSecs=1500, _timerRunning=false, _timerInterval=null, _timerStart=null;
let _calY=new Date().getFullYear(), _calM=new Date().getMonth();
let _audio=new Audio(), _tracks=[], _trackIdx=0, _playing=false;
let _wpTimer=null;


