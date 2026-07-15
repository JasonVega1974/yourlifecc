/* =============================================================
   data.js — Default data object (DEF), D instance, local state vars
============================================================= */

// ═══════════════════════════════════════════════════════════
// YourLife CC — COMPLETE JAVASCRIPT
// ═══════════════════════════════════════════════════════════

const DEF = {
  // identity
  name:'', mode:'mid_hs', theme:'', palette:'', heroBg:'', heroBgPreset:'', appBgPreset:'', cardTheme:'kingdom',
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
  // Sync v2 — last-saved timestamp (ms). Stamped by save(); drives cloudLoad's
  // last-write-wins merge so an older/empty cloud value can't overwrite newer
  // local data. In DEF so loadData restores it from localStorage on reload.
  _savedAt:0,
  // ── DEF-membership backfill (2026-06-22 persistence audit, Tier 1) — these
  //    were written by their modules but MISSING from DEF, so loadData (which
  //    restores only DEF keys) silently dropped them on an offline reload.
  //    Defaults match each writer's first-use shape. See the audit + the rule.
  habitsV2:[],                 // habits.js — [{id,name,emoji,...,completions:{}}]
  habitStacks:[],              // habits.js — [{id,name,cue,habitIds:[],createdAt}]
  _habitsV2Seeded:false,       // habits.js — one-time seed flag (boolean)
  savedResumes:{},             // resume.js — {name: <resume snapshot>}
  scheduleBlocks:[],           // school.js — [{id,act,actLabel,...}]
  academyProgress:{},          // faith.js (lesson-renderer) — {'lesson-<id>':{...}}
  // W3-4 Tracks & Diplomas (2026-07-05) — earned track diplomas:
  // [{track, name, date}], append-only, dedup by track. In DEF so a
  // fridge-worthy artifact survives offline reload.
  academyDiplomas:[],
  // W3-4 — one-shot review queue: [{lessonId, qIdx, date}], cap 10
  // (oldest dropped), dedup by lesson+question, entries retire on
  // answer right OR wrong. Explicitly NOT a second SRS engine —
  // memory verses own spaced repetition.
  academyReview:[],
  moneyLessonsProgress:{ opened:{}, completed:{}, openedAt:{}, completedAt:{} }, // finance.js
  choreStreak:{ current:0, longest:0, total:0, last:null },  // chores.js
  firstUseDate:'',             // chores.js — 'YYYY-MM-DD' first app-use date
  parentPinHash:'',            // auth.js — active profile's parent PIN hash (also per-profile)
  // WC-2a — unified app-wide XP currency. xpTotal is the single player-facing
  // progress score (drives the WC-2b ring / streak / league). Purely additive
  // and SEPARATE from the feature-internal mechanics chorePoints (spendable
  // wallet), scrPoints (faith XP) and traits (trait XP) — never merged. Lives
  // in D so it is per-profile. awardXP() in xp.js is the only writer; xpToday
  // rolls over at the day boundary (xpDayKey). xpLog is an append-only ring
  // buffer capped ~365 of {ts,n,source}. dailyGoal feeds the WC-2b ring.
  xpTotal:0, xpToday:0, xpDayKey:null, xpLog:[], dailyGoal:25,
  // WC-2b-ii — unified streak (the flame). count = consecutive "any-XP" days
  // (Sabbath-bridged: an idle Sunday between two active days doesn't break it).
  // Maintained only by awardXP; lastDayKey is the last counted UTC day. Seeded
  // once from getScriptureStreak() so existing streaks don't reset to 1.
  xpStreak:{ count:0, lastDayKey:null, longest:0 },
  // WC-D1 — exercise engine anti-farm marker: { [setId]: 'YYYY-MM-DD' } last
  // UTC day each practice set was cleared. awardPracticeSet (xp.js) awards XP
  // only on the first clear of a set per day; replays award 0.
  practiceClears:{},
  // F2-B reading plans: active is keyed by planId (object so multiple plans
  // can run concurrently); completed is an append-only list of planId archives.
  faithPlans:{ active:{}, completed:[] },
  // W3-3 "The Path" (2026-07-05) — READING_PLANS graduation log:
  // [{id, date}] appended once per finished plan. The catalog ✓ badge
  // stays wired to per-plan localStorage progress (single source of
  // truth); this array is the cloud-synced record for the ladder /
  // "plans finished" count. Array of objects, append-only. In DEF so
  // it survives offline reload.
  plansCompleted:[],
  // F2-D Bible reader annotations. Each entry is { id, book, chapter, verse, ... }.
  // Highlights carry color, notes carry text, bookmarks just mark the verse.
  faithHighlights:[], faithNotes:[], faithBookmarks:[],
  // 📺 Contextual faith videos (faith-videos.js) — ids the user bookmarked
  // via the "Watch later" control on a video card. DEF membership required
  // so the list survives an offline localStorage reload.
  savedVideos:[],
  // Per-user reader prefs (font size, line height, family). UI exposes these
  // in a collapsible Settings cog on the ESV reader.
  faithReaderSettings:{ fontSize:'medium', lineHeight:'normal', fontFamily:'serif' },
  // Daily-keyed log so re-opening a chapter doesn't repeatedly grant +2 XP.
  // Key shape: 'YYYY-MM-DD|<book>|<chapter>'. Pruned implicitly by date drift.
  faithChapterReadLog:{},
  // Wave 2 §3a/§3d (2026-07-04) — Continue Reading. bibleLast is the
  // resume pointer, overwritten on every ESV chapter render:
  // { book, chapter, scrollPct, verse, snippet, ts }. bibleRead is the
  // NON-METRIC "I read this chapter" map — streak/XP credit stays with
  // the on-open awardEsvChapterXP call; Finished is a personal marker,
  // never a second reward event. Shape: { '<book>|<chapter>':'YYYY-MM-DD' }.
  // Object, never array (the scrReadDays lesson).
  bibleLast:null,
  bibleRead:{},
  // Meet Jesus rebuild (2026-07-04) — "In His Own Words" reader resume
  // index into RED_LETTERS (0-based). In DEF so a tired reader lands
  // back on statement 14, not statement 1.
  jwIdx:0,
  // The Story scrollytelling (2026-07-05, jesus-story.js) — Who Is
  // Jesus seven-chapter scroll journey. read:{1..7:true} chapter
  // completion, lastCh resume pointer (jwIdx idiom), titles:{i:true}
  // constellation visited stars, done = the all-seven settle moment
  // has played (once ever), view:'story'|'page' escape preference.
  // Object, never array. In DEF so progress survives offline reload.
  jesusStory:{ read:{}, lastCh:1, titles:{}, done:false, view:'story' },
  // F2-F memory verses with SM-2-lite scheduling.
  // Each entry: { id, reference, text, category, ease, intervalDays, nextDue (ISO date),
  //               lastReviewed, mastered, masteredAt, createdAt, totalReviews, correctReviews }
  // W3-1 (2026-07-04) — entries gain optional `rung` (0-3, practice
  // ladder position; absent = derived from interval) and `masterHits`
  // (distinct ISO dates of from-the-heart passes; 3 => mastered —
  // the second mastery path alongside interval>=90).
  memoryVerses:[],
  // W3-1 — in-flight ladder session for same-day resume:
  // { date:'YYYY-MM-DD', ids:[], idx, climbed, graced } or null.
  mvSess:null,
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
  faithBibleWorld:{ sites:{}, discoveries:{}, badges:{}, excavated:{}, regionBadges:{}, hintSeen:false }, // Bible Lands. excavated{id:{ts}}=Dig Mode; regionBadges{regionId:{ts}}=passport regions; hintSeen=dig coach mark shown (bible-world-dig.js)
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
  // 2026-07-08 — Man's Questions, God's Answers read-state: array of
  // question ids the user has opened (drives the gold read-dot on the
  // list). Must live in DEF or loadData() drops it on an offline reload.
  mqRead:[],
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
  // Phase 3 — Faith Journey home opt-in (ACCOUNT-based: this blob syncs to
  // profiles.data and cloudLoad restores it, so the flag follows the user across
  // devices). Default false = classic faith home (byte-identical). Per-user opt-in.
  faithJourneyHome:false,
  // My Walk with God pathway — completed stations, reflections, weekly quest
  // state (walk-path.js). cloudLoad() restores it automatically; no sync.js
  // changes needed. Dark launch — nothing reads it until renderWalkPath() runs.
  walk:{},
  lifePath: {},  // L1 My Climb (road to adulthood) — completed stations, timestamped reflections, weekly quest state (life-path.js)
  // My Story (walk-story.js, 2026-07-03) — user-created spiritual-journal
  // entries on the My Walk timeline. Array of
  //   { id:'ws_<ms>', type:'milestone'|'note'|'verse', ts:<ISO>,
  //     date:'YYYY-MM-DD', title?, text?, ref?, witnesses?, church?,
  //     photoPath? }
  // ts is a full ISO timestamp from day one (station reflections lack one —
  // lesson learned). photoPath is a PRIVATE storage path in the walk-photos
  // bucket (signed-URL reads only), never a public URL. Auto entries
  // (stations, quests, legacy FJ milestones) are composed at render time
  // from their own sources and are never copied in here.
  walkStory:[],
  // V1 Rebuild · Session 2 — Night Reflection log. Each entry shape:
  // { date:'YYYY-MM-DD', mood:'😞|😐|🙂|🔥', text:string, prayed:bool, ts:isoString }
  // Capped client-side to the most recent 60 entries by faith-zones.js
  // so the cloud-synced blob stays lean. Surfaced in the Prayer sub-tab
  // history strip and used by Session 3 traits to award Wisdom + Gratitude.
  nightReflections:[],
  // Night Player (Wave 2 §4a/§4b, 2026-07-05) — sleep-story session
  // log: [{storyId, ts, completed, end:'natural'|'timer'|'manual',
  // duration}] capped 30. Quiet telemetry only — never surfaces as
  // celebratory UI (rest is not a performance). DISTINCT from the
  // Health module's D.sleepLog (bed/wake hours — do not merge).
  sleepStoryLog:[],
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
  // L2 photo-card home — last main-app section opened ('s-goals' etc.),
  // written by showSection() in ui.js; the Command Center reads it for
  // the "Continue where you left off" card. Mirrors faithLastDest
  // (string|null). Home/parent/Well navigations are not recorded.
  // lifeLastDestTs is the ms timestamp of that write — the resume card
  // hides when the destination is stale (>1h old) or the ts is missing.
  lifeLastDest:null,
  lifeLastDestTs:0,
  // 2026-05-30 — Heart Check usage log. Each entry { key, date }
  // where key is one of the 12 HEART_CHECK ids. Capped to the
  // most recent 100 in faith-zones.js. Used for trait awards on
  // prayer/action completion + future personalization.
  // 2026-07-04 (The Pulse) — entries gain optional numeric
  // before/after intensity (1-10) written by the guided journey;
  // old {key,date} entries stay valid and just lack them.
  heartChecks:[],
  // ACTS Guided Prayer Journey (Wave 2 §2a, 2026-07-05) — in-flight
  // draft so a mid-walk reload resumes: { date, moves:{adoration…},
  // beat }. Cleared on finale-save or clean exit. The finished prayer
  // lands as ONE combined entry in D.quickPrayers (source:'acts') —
  // this key never accumulates. Object, never array.
  actsSess:{ date:'', moves:{}, beat:0 },
  // 2026-07-04 (The Pulse) — per-day reward throttle for the guided
  // journey: {prayer|reflect|xp: 'YYYY-MM-DD'}. MUST live in DEF (not
  // a module var) or a reload re-arms the XP/quest farm.
  hcDaily:{},
  // 2026-06-07 — Faith tab swap. When set, the bottom tab bar
  // replaces the ✝️ Faith slot with the chosen alternative.
  // Valid values: '' (default, keeps Faith) | 'habits' | 'goals'
  // | 'money' | 'rewards'. See TAB_SWAP_OPTIONS + setTabSwap in
  // ui.js. The Well stays reachable via the sidebar regardless.
  // Faith-free users (window._faithFree) have no tab bar so this
  // field is inert for them.
  tabSwap:'',
  // 2026-06-07 — Skills Step 3: opt-in sound effects (original field).
  // RETIRED 2026-06-14 (WC-D2): no longer read by any sound hook and no
  // longer written by any toggle. Kept ONLY as the one-time migration seed
  // for soundEnabled (see sync.js loadData/cloudLoad). Do not write it.
  skillsSound:false,
  // 2026-06-14 — WC-D2: unified sound-effects preference. The SINGLE gate
  // for window.sfx.* — both the exercise engine and the Life-Skills quiz
  // route through it. Default OFF (faith/family app, shared/quiet spaces).
  // Migrated once from the retired skillsSound so nobody's state flips;
  // adoption is driven by a one-time opt-in nudge, not by flipping this on.
  soundEnabled:false,
  // 2026-06-14 — WC-D2: one-time guard for the "Add sound effects?" nudge
  // shown after a first completed practice set. Set true the moment the
  // nudge is shown (accept OR ignore), so it never re-nags.
  soundNudgeSeen:false,
  // 2026-06-14 — WC-D3: vibration feedback preference (mirrors soundEnabled
  // but a separate, SILENT modality — someone in a quiet room may want buzz
  // without sound). Default ON: silent, so the quiet-space concern doesn't
  // apply, and it's a clean no-op where navigator.vibrate is unsupported
  // (iOS Safari, Firefox 129+). The Settings → Feedback → Vibration row is
  // hidden where unsupported, so this is never a dead toggle.
  hapticsEnabled:true,
  // 2026-06-15 — Reach build 1: when a faith_free user taps "Let me know
  // when I can get this" on a locked academy module, this top-level flag is
  // set true (+ academyInterestAt timestamp). Stored at the TOP of the blob
  // on purpose so it's aggregate-countable from PostgREST without a schema
  // migration: profiles?select=user_id&data->>academyInterest=eq.true. The
  // CTA also flips emailPrefs.crossoverOptOut=false (the live soft-invite).
  academyInterest:false,
  academyInterestAt:null,
  // 2026-06-15 — Reach: full-app "tap to pick" awareness (faith_free only).
  // Each tap on the in-academy awareness card records per-feature interest
  // here, top-level so it's aggregate-countable from PostgREST WITHOUT a
  // migration, e.g. profiles?select=user_id&data->fullAppInterest->>parentHub=eq.true
  // The 'moneyModules' key stays consistent with academyInterest above.
  fullAppInterest:{},
  fullAppInterestAt:null,
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
  growthLog:[], customActivities:[], hiddenActivities:[],
  screenTime:{}, sessionLog:[],
  // Phase C-Health: sleep (D.sleepLog[]), weekly PHQ-2 mind check-ins
  // (D.phq2Log[]), and simple breakfast/lunch/dinner/snack meal log
  // (D.foodMeals[]) — distinct from D.foodLog above which is the macro
  // tracker. Capped client-side: sleep 90d, phq2 52 entries, meals 500.
  sleepLog:[], phq2Log:[], foodMeals:[],
  // 2026-06-07 — Health Inc 2: hydration tracker. waterLog is one
  // entry per local day, [{date:'YYYY-MM-DD', cups:N}]. Cups bumped
  // via logWater(±1) in health.js — midnight reset happens naturally
  // because logWater finds-or-creates the entry for today's date.
  // waterGoal is configurable (default 8 cups); the Power Card ring
  // and streak helper both gate against it. Cap 365 entries.
  waterLog:[], waterGoal:8,
  // 2026-06-07 — Health Inc 3: AI Health Coach. Cache mirrors the
  // Money Coach pattern (financeCoachLastWeek) but with a daily key
  // instead of weekly. dayKey:'YYYY-MM-DD' last fetch day; summary +
  // focus are the JSON-shaped response from /api/ai-summary mode
  // 'health-coach'; fetchedAt rate-limits manual refresh (6h floor).
  // Auto-fetched on s-health entry when dayKey != today AND user has
  // 3+ recent logs across sleep/meals/water/mood.
  healthCoachCache:{ dayKey:'', summary:'', focus:'', fetchedAt:0 },
  // 2026-06-07 — Health Inc 4: Movement / workout log.
  //   workoutLog  — [{id, date, type, duration, intensity, note}]
  //                 type ∈ 'cardio'|'strength'|'sport'|'mobility'
  //                 intensity ∈ 1 (easy) | 2 (moderate) | 3 (hard)
  //   workoutGoal — weekly active-minutes target (default 150 per CDC)
  //   prRecords   — {[lowercaseExerciseKey]:{exercise, value, unit, date}}
  //                 keyed by lowercase so addPR upserts naturally;
  //                 preserves original case via the exercise field.
  // Wired through the Movement sub-tab + the Inc 1 domain strip
  // (the existing _hDomainMovement helper reads D.workoutLog).
  workoutLog:[], workoutGoal:150, prRecords:{},
  // 2026-06-08 — Health Inc 6: body literacy engagement tracking.
  //   bodyLiteracyViewed   — { '<topicId>': 'YYYY-MM-DD' } first-view
  //                          stamp per topic. Used by Parent Hub to
  //                          surface "Body literacy: N topics viewed"
  //                          aggregate engagement (kid's reading is
  //                          NOT exposed; only the count).
  //   bodyLiteracyFeedback — { '<topicId>': 'up'|'down' } content-
  //                          iteration signal. Kid-private.
  // First-view side effect: logFamilyActivity('health',
  // 'body_literacy_viewed', topicTitle, {topicId}) — single feed
  // entry per topic per kid lifetime so parent feed stays uncluttered.
  bodyLiteracyViewed:   {},
  bodyLiteracyFeedback: {},
  // 2026-06-07 — Health Inc 5: milestone badges. Permanent ratchet —
  // {[id]: 'YYYY-MM-DD'} — once earned, never un-earns. Health badges
  // gate on this field (one-way: HEALTH_MILESTONES check fires only
  // on first earn, then writes the date). Mirrors the Skills cert
  // pattern (D.skillCerts) plus enables the canvas-rendered badge
  // PNG share artifact in shareBadgeImage(id).
  healthMilestones:{},
  // 2026-06-07 — Goals Inc 2: milestone badges. Same permanent-ratchet
  // shape as healthMilestones — {[id]: 'YYYY-MM-DD'}. Earn-detection
  // logic lives in _checkGoalMilestones() in goals.js, wired into
  // saveGoal / completeGoal / saveVision / saveTl / addMilestone /
  // addAction. misc.js BADGES (g-* prefix) check D.goalMilestones[id]
  // presence — no false un-earns. Powers shareGoalImage(goalId) too.
  goalMilestones:{},
  // 2026-06-07 — Goals Inc 3: AI Goals Coach. Cache mirrors the Money +
  // Health Coach pattern but uses a WEEKLY key (not daily) — goal
  // momentum is slower than money/health momentum. Shape:
  //   { weekKey:'YYYY-Www', summary, focus, scripture, fetchedAt }
  // scripture is OPT-IN by the model — only populated when the user's
  // category mix or vision language signals receptivity (see strict
  // safety prompt GOAL_COACH_SYSTEM in api/ai-summary.js). fetchedAt
  // rate-limits manual refresh (6h floor); auto-fetch runs once per
  // ISO-ish week when user has 2+ goals in the system.
  goalCoachCache:{ weekKey:'', summary:'', focus:'', scripture:'', fetchedAt:0 },
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
  // Sports Phase B (2026-06-16) — the My Sports tracker. Moved here from a
  // device-only bare `mySports` localStorage key so its profile PII (weight,
  // GPA, coach email) rides the owner-guarded, cloud-synced, RLS-protected D
  // blob and is reset to DEF on a user switch. Array of sport entries; legacy
  // localStorage data is folded in once by _migrateMySports() (sports.js).
  // Wellbeing: weight is a static recruiting fact only — never tracked over time.
  mySports:[],
  // Home Shortcuts (Phase D) — per-profile pinned feature shortcuts shown on the
  // flat-nav Command Center home. Items {route, icon, title, hue}; soft cap 8.
  // Read/written ONLY by the flat-nav shortcut code; inert ([]) for flag-off.
  homeShortcuts:[],
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
  // HOME_UPGRADE_PLAN.md Session 2 task 4 (WC-3c) — the guided first-win
  // banner shown once right after the wizard closes. Set true whether the
  // kid taps "Try it" or dismisses; never shown again after either.
  onboardingFirstWinShown:false,
  // 2026-07-07 — faith-only 3-screen wizard (onboard.html, standalone
  // page, no sync.js loaded there). Written directly into the shared
  // localStorage blob on wizard completion; must exist here for
  // loadData() to restore it. Distinct from onboardingDone (the
  // unrelated interest-picker overlay above) and from the in-app "Well
  // Onboarding" overlay (profiles.well_onboarded, Supabase-only, not
  // mirrored into D) — three separate onboarding flags, don't conflate.
  onboarding_complete:false,
  bannerMode:'scroll',
  // ── Email Engagement Bundle (PR 0, 2026-06-08) ──────────────
  // Per-user opt-ins, send-stamps, and counters for three email
  // streams powered by Vercel Cron:
  //
  //   • DIGEST    — Sunday 7pm local weekly family summary.
  //                 Opt-IN (default false). Single-recipient.
  //                 /api/cron/weekly-digest (Track 1).
  //   • ENGAGEMENT— Inactivity / streak-at-risk / new-features /
  //                 refer-a-friend / onboarding-incomplete triggers.
  //                 Opt-IN (default false). Max 1 per user per week.
  //                 /api/cron/engagement-tick (Track 2). Excludes
  //                 plan_status='faith_free' (Track 3 owns them).
  //   • CROSSOVER — Faith-only-to-full-app soft invitations every
  //                 6 weeks, hard-capped 4 lifetime sends per user.
  //                 Opt-OUT (default included — faith_free users
  //                 signed up expecting communication; the 4-send
  //                 cap + unsubscribe link bound it).
  //                 /api/cron/crossover-tick (Track 3).
  //
  // allOptOut is the master kill — true overrides every other
  // stream's per-list flag.
  //
  // Unsubscribe path: /unsubscribe?token=&list=&action= renders the
  // static page; /api/email-prefs validates the signed JWT and
  // mutates this object via Supabase service-role.
  // Suppression list also lands in public.email_suppressions so it
  // survives account deletion (privacy.html promise).
  emailPrefs:{
    digestOptIn:           false,
    engagementOptIn:       false,
    crossoverOptOut:       false,   // INVERTED — see comment above
    allOptOut:             false,
    // Reserved opt-in for general Kingdom Creatives product updates
    // (newsletter-style emails). Surfaced by the signup card's 3rd
    // checkbox; no cron writes to it yet — reserved for a future
    // broader-comms track. Default false (explicit opt-in).
    updatesOptIn:          false,
    recipientEmail:        '',      // defaults to _supaUser.email at first save
    timezoneOffsetMin:     null,    // captured from Intl at first save (Track 1 anchors local-7pm)
    lastDigestSent:        null,    // ISO date
    lastEngagementSent:    null,    // ISO date — Track 2 1-per-week cap
    lastReferralNudge:     null,    // ISO date — Track 2 refer-a-friend 90d spacing
    lastCrossoverSent:     null,    // ISO date
    engagementSentInWeek:  0,       // reset by cron at week boundary
    crossoverSendCount:    0,       // permanent — hard cap at 4
    lastReleaseNoteVersion:0,       // Track 2 "what's new" trigger
    upgradedAt:            null,    // set when plan_status flips faith_free → active
    // 2026-06-08 — signup-flow opt-in card + crossover awareness
    // banner shown-once flags. Both are set to true at app load
    // for users who already have activity history (existing users
    // shouldn't see a "just signed up" card on the first post-
    // deploy load).
    signupPromptShown:     false,   // Part 1 signup email-prefs modal
    crossoverBannerShown:  false    // Part 2 faith-free awareness banner
  },
  // WC-3d — push retention prefs + the shared cross-channel streak-nudge stamp.
  // pushPrefs.retentionOptOut mutes the streak-at-risk PUSH without killing the
  // device subscription. pushPrefs.lastStreakRiskPush is the push channel's own
  // per-day cooldown (UTC date). lastStreakNudgeDate is SHARED: both the push
  // cron (api/cron/push-tick) and the email cron (engagement-tick) check + set
  // it so a family gets at most one streak nudge per day across BOTH channels.
  pushPrefs:           { retentionOptOut: false, lastStreakRiskPush: null },
  lastStreakNudgeDate: null,
  // ── Family Activity Feed (FAF Inc 1, 2026-06-08) ────────────
  // Unified, append-only event stream powering the Parent Hub
  // home strip (FAF Inc 4) and the full Activity tab feed (FAF
  // Inc 3). One writer — logFamilyActivity() in activity-log.js
  // — for every new call site; the legacy logActivity(type,
  // detail) two-arg form is preserved as a back-compat shim so
  // the 63 existing call sites across faith/parent/habits/skills/
  // misc keep working until Inc 2 migrates them. Entry shape:
  //   { id, ts (ms), date ('YYYY-MM-DD'), profileId,
  //     domain  — 'chore'|'money'|'school'|'health'|'goal'|
  //               'skill'|'habit'|'mood'|'journal'|'book'|
  //               'faith'|'parent'|'auth'|'misc',
  //     event   — per-domain string, e.g. 'completed'|'earned'|
  //               'logged'|'submitted'|'milestone'|'badge',
  //     title   — human one-liner (what the parent sees),
  //     meta?   — optional domain-specific payload }
  // Legacy entries from before Inc 1 carry { type, detail, time,
  // ts } and are read transparently via dual-shape accessors in
  // activity-log.js — no on-load rewrite required.
  // Capped client-side at 500 entries / 90 days by
  // _pruneActivityLog() on every write. Cloud-synced via the
  // normal profiles.data JSONB blob (NO separate Supabase table
  // — multi-profile is one auth user with many profileIds, so
  // the existing blob already syncs cross-device).
  // Was previously declared inside the health block, which read
  // as if D.activityLog belonged to the activity-scheduler
  // subsystem; moved here for clarity.
  activityLog:[],
  // Phase 1 of the PIN → stable-id rework (Phase 2 cuts over). Phase 2
  // will populate `mappings` (pin → stableId) and POST to a server
  // migration route, then set `status` to 'complete'. In Phase 1 we
  // only ensure every profile has a stableId in memory + persistence;
  // nothing reads this flag yet. Status flow:
  //   'idle' → 'in_progress' → 'complete'   (or 'failed' on retry).
  // Kept distinct from D.pinMigration which tracks the PIN-hash rollout.
  profileIdMigration:{ status:'idle', mappings:{}, startedAt:null, completedAt:null },
  // ── Daily Spark (Phase 4, 2026-07-09, daily-spark.js) ────────
  // Once-per-day engagement card. sparkLastShown = 'YYYY-MM-DD' local
  // date the card last auto-showed (gate: never twice in one day).
  // sparkDismissedToday = user closed it (the ✨ chip reopens it that
  // day); reset when the date rolls. sparkTodayKind = 'faith'|'main',
  // frozen at first show so a chip reopen renders the SAME spark even
  // if the user has since navigated to the other home.
  sparkLastShown:'', sparkDismissedToday:false, sparkTodayKind:'',
  // ── DEF-membership backfill #2 (2026-07-09 Phase 0 audit) — fields
  //    written by modules but MISSING from DEF, so loadData (which
  //    restores only DEF keys) dropped them on any offline reload and
  //    the next cloudSync propagated the loss. Defaults match each
  //    writer's first-use shape / lazy-init expectations.
  flashcardProgress:{},        // index.html flashcards — { [cardIdx]: 'correct'|'incorrect' }
  flashcardHistory:[],         // index.html flashcards — session log, capped 50
  settings:{},                 // init.js onboarding — { faithMode:boolean } (see D.faithMode mirror)
  pinMigration:null,           // auth.js — lazily seeded { status, startedAt, completedAt, childrenMigrated[] }
  donationPromptDismissed:false, // faith.js — faith_free donation ask dismissed
  rewardsLegacyMigrated:false, // chores.js — one-time rewards migration flag
  _weeklyReports:{},           // parent.js — { [childId]: weekly report snapshot }
  wellLastTab:'home',          // faith.js — Well tab resume pointer
  age:'',                      // init.js onboarding — raw age answer
  onboardingCompletedAt:'',    // init.js — ISO timestamp of wizard completion
};

let D = JSON.parse(JSON.stringify(DEF));

// 2026-07-03 — window.D bridge. `let D` lives in the global LEXICAL
// environment, NOT on window, so `window.D` was always undefined. Any module
// reading/writing `window.D` (walk-path.js W(), sfx.js, haptics.js,
// exercise-engine.js, two index.html fallbacks) silently operated on nothing —
// walk-path.js even created a PHANTOM `window.D = {}` and stored My Walk
// progress there, where save()/cloudSync never saw it and the journey home
// (which reads the real D) never lit up. A live accessor keeps window.D
// permanently in sync with the binding, INCLUDING after the two `D = …`
// reassignments (auth.js owner-guard reset, email.js profile switch) that a
// one-time `window.D = D` copy would go stale on.
try {
  Object.defineProperty(window, 'D', {
    configurable: true,
    get: function(){ return D; },
    set: function(v){ D = v; }
  });
} catch (e) { try { window.D = D; } catch (e2) {} }

let _txFilter='all', _asgFilter='all', _gFilter='all', _galFilter='all';
let _timerSecs=1500, _timerRunning=false, _timerInterval=null, _timerStart=null;
let _calY=new Date().getFullYear(), _calM=new Date().getMonth();
let _audio=new Audio(), _tracks=[], _trackIdx=0, _playing=false;
let _wpTimer=null;


