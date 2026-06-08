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
  // 2026-05-26 — Per-day trait gains, used by the "TODAY'S GROWTH"
  // home-screen card. Shape: { 'YYYY-MM-DD': { courage:3, faith:2, … } }.
  // Pruned to last 30 days by _pruneDailyTraits() in traits.js so the
  // JSONB blob doesn't bloat. The lifetime totals in D.traits are still
  // the source of truth for levels — this is purely a daily-feedback view.
  traitsDaily:{},
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
  // 2026-06-07 — Faith tab swap. When set, the bottom tab bar
  // replaces the ✝️ Faith slot with the chosen alternative.
  // Valid values: '' (default, keeps Faith) | 'habits' | 'goals'
  // | 'money' | 'rewards'. See TAB_SWAP_OPTIONS + setTabSwap in
  // ui.js. The Well stays reachable via the sidebar regardless.
  // Faith-free users (window._faithFree) have no tab bar so this
  // field is inert for them.
  tabSwap:'',
  // 2026-06-07 — Skills Step 3: opt-in sound effects for the
  // Life Skills quiz. Subtle Web-Audio-synthesized tones —
  // correct ding, wrong thud, pass fanfare. Default OFF (no
  // sound until user toggles in Me → Settings). All quiz sound
  // hooks gate on D.skillsSound === true.
  skillsSound:false,
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
  // Tab 2 Inc 3 (Allowance, 2026-06-05) — recurring auto-credit
  // config. Parent sets in Parent Hub > Rewards; kid sees a
  // read-only schedule pill + history in #mt-allowance.
  // _maybeCreditAllowance() in finance.js inserts an income row
  // into D.transactions on every due date the schedule reaches,
  // double-guarded against re-crediting:
  //   1) lastCreditedOn (cheap path)
  //   2) per-date scan of D.transactions (survives LS clear / new
  //      device / config drift)
  // Schedule shape:
  //   amount         decimal USD per credit
  //   frequency      'weekly' | 'biweekly' | 'monthly'
  //   dayOfWeek      0..6 (Sun=0) for weekly + biweekly
  //   dayOfMonth     1..31 for monthly
  //   anchorDate     YYYY-MM-DD reference for biweekly cadence
  //                  (defines which Friday in the 14-day cycle)
  //   lastCreditedOn YYYY-MM-DD of the most recent successful credit
  //   enabled        true to allow auto-credit; false freezes everything
  // Catch-up is capped at 4 credits in one wake to prevent a long
  // app-absence from auto-granting months of allowance at once.
  // Distinct from the legacy D.allowance wallet object (parent.js
  // _renderLegacyAllowanceWallet) which is dead UI; D.allowance
  // retirement is tracked under TAB2_MONEY_BUILD_PLAN §11.3.
  allowanceConfig:{ amount:0, frequency:'weekly', dayOfWeek:5, dayOfMonth:1, anchorDate:'', lastCreditedOn:null, enabled:false },
  // Tab 2 Inc 5.5 — Money tab milestone log. Keyed by milestone id
  // (e.g. 'first_tx', 'first_50_saved', 'lessons_3'), value is the
  // ISO date the milestone first fired. _checkMoneyMilestones in
  // finance.js skips any key already present, so each milestone is a
  // single one-shot celebration. JSONB only — no new table.
  moneyMilestones:{},
  // Tab 2 Inc 7 Step B (2026-06-06) — Parent purchase approvals.
  // When a kid logs an EXPENSE in #mt-tx whose amount >= the per-kid
  // threshold, addTx() diverts the entry into D.purchaseRequests
  // instead of D.transactions. The parent reviews the queue inside
  // #ph-rewards → "Purchase approvals" section, then approves (which
  // promotes the request into a real transaction) or denies (which
  // marks it denied but keeps it visible so the kid doesn't re-ask).
  //
  // Request shape:
  //   { id, kidProfileId, name, amount, cat, requestedAt (iso),
  //     status:'pending'|'approved'|'denied',
  //     reviewedAt, reviewerNote, txId (set when approved → promoted) }
  //
  // No TTL / auto-expire in v1 — old requests stay visible with an
  // age tag so the parent can see how long they've been waiting.
  // Brevo email notify on submit via /api/notify-parent-purchase.
  purchaseRequests:[],
  // Per-user $ floor that triggers the approval gate. Editable from
  // Parent Hub in a future polish pass; for v1 it's the DEF default.
  purchaseApprovalThreshold:25,
  // Tab 2 Inc 7 Step A (2026-06-06) — Weekly AI Money Coach cache.
  //   weekKey   — ISO 'YYYY-Www' of the week the response was generated
  //   summary   — 2-3 second-person sentences naming concrete patterns
  //               from the last 30 days (cash in/out, top categories,
  //               savings goal traction)
  //   focus     — 1 sentence specific next-week nudge
  //   fetchedAt — ms epoch of last fetch (used for client-side throttle)
  // /api/ai-summary 'money-coach' mode is the only writer. Strictly
  // observational + suggestive — NEVER prescriptive financial advice
  // (no investment, debt, credit-product recommendations). See the
  // MONEY_COACH_SYSTEM prompt in api/ai-summary.js for the rules.
  financeCoachLastWeek:{ weekKey:'', summary:'', focus:'', fetchedAt:0 },
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
  // 2026-06-06 — Tab 1 Increment 5 Step B. Parallel badge surface for
  // chores — intentionally separate from the global traits.js Steward
  // XP so a kid can see their chore-specific achievements without the
  // wider trait-system context bleeding in. Shape:
  //   { '<badgeId>': 'YYYY-MM-DD'   ← ISO date awarded }
  // Catalog (10 badges) lives in chores.js → CHORE_BADGES. Award path:
  // _checkChoreBadges() runs after every verifyChore + approveSelfChore.
  choreBadges:{},
  // 2026-06-06 — Tab 1 Increment 5 Step C. Weekly AI Coach cache.
  //   weekKey   — ISO 'YYYY-Www' of the week the response was generated
  //   summary   — 2-3 second-person sentences praising specific wins
  //   focus     — 1 sentence specific suggestion for next week
  //   fetchedAt — ms epoch of last fetch (used for client-side throttle)
  // The /api/ai-summary 'chore-coach' mode is the only writer.
  // renderChoreCoach() in chores.js reads weekKey vs current ISO week to
  // decide whether to auto-fetch. Manual refresh button respects a 6h
  // floor between fetches to keep API spend down on impatient kids.
  choreCoachLastWeek:{ weekKey:'', summary:'', focus:'', fetchedAt:0 },
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
  // Phase 1 of the PIN → stable-id rework (Phase 2 cuts over). Phase 2
  // will populate `mappings` (pin → stableId) and POST to a server
  // migration route, then set `status` to 'complete'. In Phase 1 we
  // only ensure every profile has a stableId in memory + persistence;
  // nothing reads this flag yet. Status flow:
  //   'idle' → 'in_progress' → 'complete'   (or 'failed' on retry).
  // Kept distinct from D.pinMigration which tracks the PIN-hash rollout.
  profileIdMigration:{ status:'idle', mappings:{}, startedAt:null, completedAt:null },
};

let D = JSON.parse(JSON.stringify(DEF));
let _txFilter='all', _asgFilter='all', _gFilter='all', _galFilter='all';
let _timerSecs=1500, _timerRunning=false, _timerInterval=null, _timerStart=null;
let _calY=new Date().getFullYear(), _calM=new Date().getMonth();
let _audio=new Audio(), _tracks=[], _trackIdx=0, _playing=false;
let _wpTimer=null;


