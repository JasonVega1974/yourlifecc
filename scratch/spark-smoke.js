/* spark-smoke.js — Daily Spark regression harness (node, no browser).
   Run: node scratch/spark-smoke.js  (from repo root)
   Covers: deterministic date-hash pick, rotation past unavailable
   categories, once-per-day gate semantics, faith-free pool routing,
   DEF membership of the spark + backfill fields. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = process.cwd();

let pass = 0, fail = 0;
function T(name, cond){
  if(cond){ pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name); }
}

/* ── minimal browser shims ─────────────────────────────────── */
global.window = global;
global.document = {
  readyState: 'complete',
  addEventListener: function(){},
  getElementById: function(){ return null; },
  querySelector: function(){ return null; },
  querySelectorAll: function(){ return []; },
  body: { classList: { contains: function(){ return false; } } }
};
global.matchMedia = function(){ return { matches:false }; };
global.requestAnimationFrame = function(fn){ fn(); };
// Neutralize the module's boot timer so the harness stays synchronous.
const _origSetTimeout = global.setTimeout;
global.setTimeout = function(){ return 0; };
global.setInterval = function(){ return 0; };
global.clearInterval = function(){};

/* ── load real datasets the pools read ─────────────────────── */
function loadGlobalScript(rel){
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  // Data files use `const X = [...]` + window assignment; eval in global scope.
  (0, eval)(src);
}
loadGlobalScript('app/js/data/memory-verses.js');
loadGlobalScript('app/js/data/red-letters.js');
loadGlobalScript('app/js/data/money-lessons.js');
loadGlobalScript('app/js/data/mans-questions.js');

/* ── minimal D + module load ───────────────────────────────── */
global.D = { onboardingDone:true, sparkLastShown:'', sparkDismissedToday:false, sparkTodayKind:'',
             habitsV2:[], goals:[], xpLog:[], walk:{}, lifePath:{} };
loadGlobalScript('app/js/daily-spark.js');
global.setTimeout = _origSetTimeout;

const S = global._sparkTest;
console.log('\n[1] module surface');
T('window._sparkTest exposed', !!S && typeof S.hash === 'function' && typeof S.pick === 'function');
T('faith pool has 7 categories', S.faithPool.length === 7);
T('main pool has 6 categories', S.mainPool.length === 6);

console.log('\n[2] deterministic pick');
const h1 = S.hash('2026-07-09'), h2 = S.hash('2026-07-09'), h3 = S.hash('2026-07-10');
T('same date → same hash', h1 === h2);
T('different date → different hash', h1 !== h3);
const p1 = S.pick(S.faithPool, h1), p2 = S.pick(S.faithPool, h1);
T('same date → same faith pick', p1 && p2 && p1.id === p2.id);
// 30-day sweep: every day yields a pick, and ≥3 distinct categories rotate.
const seen = new Set();
let allPicked = true;
for(let i=1;i<=30;i++){
  const k = '2026-08-' + String(i).padStart(2,'0');
  const p = S.pick(S.faithPool, S.hash(k));
  if(!p) allPicked = false; else seen.add(p.id);
}
T('30-day sweep always picks', allPicked);
T('30-day sweep rotates ≥3 categories (' + seen.size + ')', seen.size >= 3);

console.log('\n[3] rotation skips unavailable categories');
const fakePool = [
  { id:'a', avail:function(){ return false; } },
  { id:'b', avail:function(){ throw new Error('boom'); } },
  { id:'c', avail:function(){ return true; } }
];
T('skips false + throwing avail, lands on c', (S.pick(fakePool, 0) || {}).id === 'c');
T('all-unavailable pool → null', S.pick(fakePool.slice(0,2), 5) === null);

console.log('\n[4] pool builds produce complete cards');
let builds = 0, complete = 0;
S.faithPool.concat(S.mainPool).forEach(function(item){
  try{
    if(!item.avail()) return;
    const c = item.build(h1);
    builds++;
    if(c && c.kicker && c.body != null && c.cta && typeof c.go === 'function') complete++;
  }catch(e){ builds++; }
});
T('every available build is complete (' + complete + '/' + builds + ')', builds > 0 && complete === builds);

console.log('\n[5] faith-free routes to faith pool');
global._faithFree = true;
T('poolKind = faith when _faithFree', S.poolKind() === 'faith');
global._faithFree = false;
T('poolKind = main otherwise (no faith DOM)', S.poolKind() === 'main');

console.log('\n[6] main pool avail gates on user data');
const mainIds = function(){ return S.mainPool.filter(function(i){ try{ return i.avail(); }catch(e){ return false; } }).map(function(i){ return i.id; }); };
let ids = mainIds();
T('empty D → habit/climb/goal/challenge unavailable', ['habit','climb','goal','challenge'].every(function(x){ return ids.indexOf(x) === -1; }));
T('money + skilltip availability from datasets', ids.indexOf('money') !== -1);
global.D.habitsV2 = [{ id:'h1', name:'Read', completions:{} }];
global.D.goals = [{ id:'g1', text:'Make varsity', done:false }];
ids = mainIds();
T('with habit + open goal → both available', ids.indexOf('habit') !== -1 && ids.indexOf('goal') !== -1);
global.D.goals[0].done = true;
ids = mainIds();
T('all goals done → goal spark unavailable', ids.indexOf('goal') === -1);

console.log('\n[7] DEF membership (data.js)');
const dataSrc = fs.readFileSync(path.join(ROOT, 'app/js/data.js'), 'utf8');
['sparkLastShown','sparkDismissedToday','sparkTodayKind','flashcardProgress','flashcardHistory',
 'pinMigration','donationPromptDismissed','rewardsLegacyMigrated','_weeklyReports','wellLastTab',
 'onboardingCompletedAt'].forEach(function(k){
  T('DEF has ' + k, new RegExp('(^\\s*|[,{]\\s*)' + k.replace(/[$_]/g,'\\$&') + '\\s*:', 'm').test(dataSrc));
});
// settings must be a DEF key (faithMode persistence)
T('DEF has settings', /^\s*settings\s*:\s*\{\}/m.test(dataSrc));

console.log('\n[8] once-per-day gate semantics (source-level)');
const sparkSrc = fs.readFileSync(path.join(ROOT, 'app/js/daily-spark.js'), 'utf8');
T('auto-show gated on sparkLastShown === today', /sparkLastShown === _todayKey\(\)/.test(sparkSrc));
T('sparkLastShown written only after successful render', sparkSrc.indexOf('_renderCard(kind, h)') < sparkSrc.indexOf('d.sparkLastShown = today'));
T('onboarding guard present', /onboardingDone/.test(sparkSrc) && /onboarding_complete/.test(sparkSrc));
T('Escape closes', /key === 'Escape'/.test(sparkSrc));
T('reduced-motion path present', /prefers-reduced-motion/.test(sparkSrc));

console.log('\n══ RESULT: ' + pass + ' pass / ' + fail + ' fail ══');
process.exit(fail ? 1 : 0);
