/* =============================================================
   daily-spark.js — Daily Spark (Phase 4, 2026-07-09)

   A once-per-day engagement card: first home render of the day, a
   spark card slides up (bottom sheet on mobile, centered modal on
   desktop) after a ~2s settle delay. Dismissible, never nags; a ✨
   chip stays on the home for same-day reopening.

   Pool selection is LANDING-HOME based (owner ruling 2026-07-09):
   faith home landing → faith spark; main-app home → main spark;
   faith_free plans always get faith sparks (they only have one home).
   The daily pick is deterministic (date-hash rotation) so the whole
   family sees the same spark category on the same day; if a category
   doesn't apply to this user (no active habit, walk not started) the
   rotation advances to the next applicable one.

   State (DEF, data.js): sparkLastShown 'YYYY-MM-DD', sparkDismissedToday,
   sparkTodayKind 'faith'|'main' (frozen at first show).

   Guardrails: never during onboarding, never twice a day, never
   blocks (X / backdrop / Esc all close), never over another open
   [aria-modal] dialog, reduced-motion renders without the slide.

   DOM contract (app/index.html tail): #dailySparkOverlay with
   .dsp-backdrop / .dsp-card / #dspBody / .dsp-x, plus #dailySparkChip.
   No other module edits — this file owns its own boot timer.
============================================================= */
(function(){
'use strict';

/* ── tiny helpers ────────────────────────────────────────── */
function _D(){ return (typeof window!=='undefined' && window.D && typeof window.D==='object') ? window.D : null; }
function _esc(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function _todayKey(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
// djb2 — stable across sessions/devices for the same date string.
function _hash(str){
  let h = 5381;
  for(let i=0;i<str.length;i++){ h = (((h<<5)+h) + str.charCodeAt(i)) >>> 0; }
  return h;
}
function _prm(){
  try{ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch(e){ return false; }
}
function _vis(el){ return !!(el && el.offsetWidth > 0 && el.offsetHeight > 0); }
function _save(){ if(typeof save === 'function'){ try{ save(); }catch(e){} } }
function _settleSfx(){
  try{ if(window.sfx && typeof window.sfx.settle === 'function') window.sfx.settle(); }catch(e){}
}

/* ── landing / visibility ────────────────────────────────── */
// Which world did the user open? faith_free users only have the faith
// world; otherwise: the faith journey home / Well hero visible → faith,
// anything else → main.
function _poolKind(){
  if (window._faithFree) return 'faith';
  const d = _D();
  if (d && d.faithOnly) return 'faith';
  const scrip = document.getElementById('s-scripture');
  if (scrip && scrip.classList.contains('active')) return 'faith';
  if (_vis(document.getElementById('fzJourneyHome'))) return 'faith';
  if (_vis(document.getElementById('faithHeroCinematic'))) return 'faith';
  return 'main';
}
// A "home" surface is on screen (CC / legacy home / faith journey home /
// faith-free Well hero). The spark only auto-shows over a home, and the
// chip only shows there too.
function _homeVisible(){
  return _vis(document.getElementById('appCommandCenter')) ||
         _vis(document.getElementById('appHome')) ||
         _vis(document.getElementById('fzJourneyHome')) ||
         _vis(document.getElementById('faithHeroCinematic'));
}
// Another modal dialog (onboarding wizard, PIN gate, auth sheet…) is up —
// stay out of the way. Our own overlay is excluded.
function _otherDialogOpen(){
  const dlgs = document.querySelectorAll('[aria-modal="true"]');
  for(let i=0;i<dlgs.length;i++){
    if (dlgs[i].id !== 'dailySparkOverlay' && _vis(dlgs[i])) return true;
  }
  return false;
}

/* ── faith pool ──────────────────────────────────────────── */
// Each item: { id, avail(), build(h) → {kicker,title,body,ref,cta,go} }.
// go() runs the deep link — every target is typeof-guarded, falling back
// to just opening the faith home so the CTA can never dead-end.
function _goFaith(dest){
  const scrip = document.getElementById('s-scripture');
  const onFaith = scrip && scrip.classList.contains('active');
  if (!onFaith && typeof showSection === 'function') showSection('s-scripture');
  setTimeout(function(){
    if (typeof fzOpenDest === 'function'){ try{ fzOpenDest(dest); }catch(e){} }
  }, onFaith ? 0 : 300);
}
const _PRAYER_PROMPTS = [
  'Sixty seconds: pray for someone who hurt you — by name.',
  'Sixty seconds: thank God for three things from yesterday.',
  'Sixty seconds: pray for the person in your family having the hardest week.',
  'Sixty seconds: ask God for courage for the one thing you’ve been avoiding.',
  'Sixty seconds: pray for a friend who doesn’t know God yet.',
  'Sixty seconds: sit in silence first. Then just say what’s actually on your mind.',
  'Sixty seconds: pray for your future self — the person you’re becoming.'
];
const FAITH_POOL = [
  { id:'verse',
    avail:function(){ return Array.isArray(window.MEMORY_VERSE_LIBRARY) && window.MEMORY_VERSE_LIBRARY.length > 0; },
    build:function(h){
      const lib = window.MEMORY_VERSE_LIBRARY;
      const v = lib[h % lib.length];
      return { kicker:'Verse of the day', title:null, body:'“' + v.text + '”', ref:v.reference,
               cta:'Memorize it', go:function(){ _goFaith('memorize'); } };
    } },
  { id:'question',
    avail:function(){ return Array.isArray(window.MANS_QUESTIONS) && window.MANS_QUESTIONS.length > 0; },
    build:function(h){
      const all = window.MANS_QUESTIONS;
      const top = all.filter(function(q){ return q && q.top10; });
      const list = top.length ? top : all;
      const q = list[h % list.length];
      return { kicker:'Today’s question', title:q.question, body:q.hook || 'An honest question deserves an honest answer.', ref:null,
               cta:'Read the answer', go:function(){ _goFaith('questions'); } };
    } },
  { id:'mystery',
    avail:function(){ return true; },
    build:function(){
      return { kicker:'Today’s mystery', title:'A question worth sitting with.',
               body:'One honest question about God, examined with evidence — a new one every day.', ref:null,
               cta:'Open it', go:function(){ _goFaith('mystery'); } };
    } },
  { id:'walk',
    avail:function(){
      const d = _D();
      if(!d || !d.walk || typeof d.walk !== 'object') return false;
      const done = d.walk.completed && typeof d.walk.completed === 'object' ? d.walk.completed : {};
      if(!Object.keys(done).length) return false;               // mid-pathway only
      const sts = Array.isArray(window.WALK_STATIONS) ? window.WALK_STATIONS : [];
      return sts.some(function(s){ return s && s.id && !done[s.id]; });
    },
    build:function(){
      const d = _D();
      const done = (d.walk && d.walk.completed) || {};
      const sts = window.WALK_STATIONS || [];
      const next = sts.find(function(s){ return s && s.id && !done[s.id]; });
      return { kicker:'My Walk with God', title:'Your next step: ' + ((next && (next.name || next.title)) || 'the next station'),
               body:'The path is still under your feet. One station today keeps you moving.', ref:null,
               cta:'Continue the Walk', go:function(){ _goFaith('walk'); } };
    } },
  { id:'redletter',
    avail:function(){ return Array.isArray(window.RED_LETTERS) && window.RED_LETTERS.length > 0; },
    build:function(h){
      const r = window.RED_LETTERS[h % window.RED_LETTERS.length];
      return { kicker:'Jesus said', title:null, body:'“' + r.text + '”', ref:r.ref,
               cta:'Sit with it', go:function(){ _goFaith('jesus'); } };
    } },
  { id:'prayer',
    avail:function(){ return true; },
    build:function(h){
      return { kicker:'Prayer prompt', title:null, body:_PRAYER_PROMPTS[h % _PRAYER_PROMPTS.length], ref:null,
               cta:'Open Breath Prayer', go:function(){ _goFaith('prayer'); } };
    } },
  { id:'proof',
    avail:function(){ return Array.isArray(window.PROOF_PROPHECY_DATA) && window.PROOF_PROPHECY_DATA.length > 0; },
    build:function(h){
      const p = window.PROOF_PROPHECY_DATA[h % window.PROOF_PROPHECY_DATA.length];
      // First sentence of the summary is the hook; the eyebrow is a long
      // metadata line, wrong register for a card title.
      const hook = String(p.summary || '').split('. ')[0];
      return { kicker:'From the evidence', title:p.title,
               body:(hook ? hook + '.' : 'Real places, real dates, real manuscripts — worth ten minutes of your day.'), ref:null,
               cta:'See the evidence', go:function(){ _goFaith('proof'); } };
    } }
];

/* ── main pool ───────────────────────────────────────────── */
function _goSection(id){ if(typeof showSection === 'function'){ try{ showSection(id); }catch(e){} } }
const MAIN_POOL = [
  { id:'habit',
    avail:function(){ const d=_D(); return !!(d && Array.isArray(d.habitsV2) && d.habitsV2.length); },
    build:function(){
      const d = _D();
      let best = null, bestN = -1;
      d.habitsV2.forEach(function(hb){
        let n = 0;
        try{ if(typeof getHabitCurrentStreak === 'function') n = getHabitCurrentStreak(hb) || 0; }catch(e){}
        if(n > bestN){ bestN = n; best = hb; }
      });
      const name = (best && (best.name || 'your habit'));
      const body = bestN > 0
        ? 'Your ' + name + ' streak is at ' + bestN + ' day' + (bestN===1?'':'s') + '. One small check keeps it going.'
        : 'Your habit “' + name + '” is waiting for day one. Today’s a good day for it.';
      return { kicker:'Habit nudge', title:null, body:body, ref:null,
               cta:'Keep it alive', go:function(){ _goSection('s-habits'); } };
    } },
  { id:'climb',
    avail:function(){
      const d = _D();
      if(!d || !d.lifePath || typeof d.lifePath !== 'object') return false;
      const done = d.lifePath.completed && typeof d.lifePath.completed === 'object' ? d.lifePath.completed : {};
      if(!Object.keys(done).length) return false;               // mid-pathway only
      const sts = Array.isArray(window.LIFE_STATIONS) ? window.LIFE_STATIONS : [];
      return sts.some(function(s){ return s && s.id && !done[s.id]; });
    },
    build:function(){
      const d = _D();
      const done = (d.lifePath && d.lifePath.completed) || {};
      const sts = window.LIFE_STATIONS || [];
      const next = sts.find(function(s){ return s && s.id && !done[s.id]; });
      return { kicker:'My Climb', title:'Next step on your climb: ' + ((next && (next.name || next.title)) || 'the next station'),
               body:'You’ve already covered real ground. One station today keeps the summit closing in.', ref:null,
               cta:'Continue the Climb',
               go:function(){ if(typeof window.ccOpenClimb === 'function'){ try{ window.ccOpenClimb(); return; }catch(e){} } _goSection('s-hero'); } };
    } },
  { id:'skilltip',
    avail:function(){ return (typeof SK_DATA !== 'undefined') && SK_DATA && Object.keys(SK_DATA).length > 0; },
    build:function(h){
      const cats = Object.keys(SK_DATA).sort();
      const cat = cats[h % cats.length];
      const lessons = Array.isArray(SK_DATA[cat]) ? SK_DATA[cat] : [];
      const lesson = lessons.length ? lessons[h % lessons.length] : null;
      return { kicker:'60-second skill', title:(lesson && lesson.h) || 'One small skill, yours for life',
               body:'One short lesson. Future-you already thinks it was worth it.', ref:null,
               cta:'Learn it', go:function(){ _goSection('s-skills'); } };
    } },
  { id:'goal',
    avail:function(){ const d=_D(); return !!(d && Array.isArray(d.goals) && d.goals.some(function(g){ return g && !g.done; })); },
    build:function(h){
      const open = _D().goals.filter(function(g){ return g && !g.done; });
      const g = open[h % open.length];
      return { kicker:'Goal check', title:null,
               body:'Your goal “' + (g.text || 'your goal') + '” — one small step today?', ref:null,
               cta:'Open Goals', go:function(){ _goSection('s-goals'); } };
    } },
  { id:'money',
    avail:function(){ return Array.isArray(window.MONEY_LESSONS) && window.MONEY_LESSONS.length > 0; },
    build:function(h){
      const m = window.MONEY_LESSONS[h % window.MONEY_LESSONS.length];
      return { kicker:'Quick money wisdom', title:m.title, body:m.takeaway || m.hook || '', ref:null,
               cta:'Read the lesson', go:function(){ _goSection('s-finance'); } };
    } },
  { id:'challenge',
    avail:function(){
      const d = _D();
      if(!d || !Array.isArray(d.xpLog) || !d.xpLog.length) return false;
      return _yesterdayXpCount(d) > 0;
    },
    build:function(){
      const n = _yesterdayXpCount(_D());
      return { kicker:'Beat yesterday', title:null,
               body:'Yesterday you logged ' + n + ' XP moment' + (n===1?'':'s') + '. See what today can do.', ref:null,
               cta:'Start with today’s Daily 3', go:function(){ _goSection('s-hero'); } };
    } }
];
function _yesterdayXpCount(d){
  const y = new Date(); y.setDate(y.getDate() - 1);
  const start = new Date(y.getFullYear(), y.getMonth(), y.getDate()).getTime();
  const end = start + 86400000;
  let n = 0;
  (d.xpLog || []).forEach(function(e){ if(e && e.ts >= start && e.ts < end) n++; });
  return n;
}

/* ── deterministic pick ──────────────────────────────────── */
// Rotation start = hash(dateKey) — the whole family lands on the same
// category; user-specific avail() gaps advance to the next applicable.
function _pick(pool, h){
  for(let i=0;i<pool.length;i++){
    const item = pool[(h + i) % pool.length];
    try{ if(item.avail()) return item; }catch(e){}
  }
  return null;
}

/* ── render + show/hide ──────────────────────────────────── */
let _openedThisSession = false;
function _renderCard(kind, h){
  const pool = kind === 'faith' ? FAITH_POOL : MAIN_POOL;
  const item = _pick(pool, h);
  if(!item) return false;
  let c;
  try{ c = item.build(h); }catch(e){ return false; }
  if(!c) return false;
  const body = document.getElementById('dspBody');
  const card = document.querySelector('#dailySparkOverlay .dsp-card');
  if(!body || !card) return false;
  card.classList.toggle('dsp-faith', kind === 'faith');
  card.classList.toggle('dsp-main',  kind !== 'faith');
  body.innerHTML =
    '<div class="dsp-eyebrow">✨ Today’s Spark<span class="dsp-eyebrow-kicker"> · ' + _esc(c.kicker) + '</span></div>' +
    (c.title ? '<h3 class="dsp-title" id="dspTitle">' + _esc(c.title) + '</h3>' : '') +
    '<p class="dsp-body' + (kind==='faith' ? ' dsp-serif' : '') + '"' + (c.title ? '' : ' id="dspTitle"') + '>' + _esc(c.body) + '</p>' +
    (c.ref ? '<div class="dsp-ref">' + _esc(c.ref) + '</div>' : '') +
    '<button type="button" class="dsp-cta">' + _esc(c.cta) + ' →</button>';
  const cta = body.querySelector('.dsp-cta');
  if(cta) cta.onclick = function(){ _hide(); try{ c.go(); }catch(e){} };
  return true;
}
function _show(){
  const d = _D();
  if(!d) return false;
  const today = _todayKey();
  // Freeze the kind at first show; a chip reopen re-renders the same spark.
  let kind = (d.sparkLastShown === today && (d.sparkTodayKind === 'faith' || d.sparkTodayKind === 'main'))
    ? d.sparkTodayKind : _poolKind();
  const h = _hash(today);
  if(!_renderCard(kind, h)) return false;
  const ov = document.getElementById('dailySparkOverlay');
  if(!ov) return false;
  d.sparkLastShown = today;
  d.sparkTodayKind = kind;
  _save();
  ov.hidden = false;
  ov.classList.remove('dsp-in');
  if(_prm()){ ov.classList.add('dsp-in'); }
  else { requestAnimationFrame(function(){ requestAnimationFrame(function(){ ov.classList.add('dsp-in'); }); }); }
  // Settle is the app's contemplative cue — faith sparks only; a gamified
  // main-register nudge opens silently (see acts-journey.js:5's ruling).
  if(kind === 'faith') _settleSfx();
  _openedThisSession = true;
  _chipSync();
  const x = ov.querySelector('.dsp-x');
  if(x){ try{ x.focus(); }catch(e){} }
  return true;
}
function _hide(){
  const ov = document.getElementById('dailySparkOverlay');
  if(!ov || ov.hidden) return;
  ov.classList.remove('dsp-in');
  ov.hidden = true;
  const d = _D();
  if(d && !d.sparkDismissedToday){ d.sparkDismissedToday = true; _save(); }
  _chipSync();
  // Return focus somewhere sensible — the chip if it's on screen.
  const chip = document.getElementById('dailySparkChip');
  if(chip && !chip.hidden){ try{ chip.focus(); }catch(e){} }
}

/* ── ✨ chip (same-day reopen) ─────────────────────────────── */
let _chipTimer = null;
function _chipSync(){
  const chip = document.getElementById('dailySparkChip');
  if(!chip) return;
  const d = _D();
  const ov = document.getElementById('dailySparkOverlay');
  const on = !!(d && d.sparkLastShown === _todayKey() && ov && ov.hidden && _homeVisible() && !_otherDialogOpen());
  chip.hidden = !on;
  if(on) chip.classList.toggle('dsp-chip-faith', d.sparkTodayKind === 'faith');
}
function _chipLoopStart(){
  if(_chipTimer) return;
  _chipTimer = setInterval(_chipSync, 2000);
  _chipSync();
}

/* ── boot ────────────────────────────────────────────────── */
// Self-contained: no init.js hook. From ~2s after DOMContentLoaded, poll
// until the app has settled on a home surface, then show once. Gives up
// after ~40s (auth screen, parent-only session, etc.) without writing
// any state — the next boot gets a fresh chance.
function _boot(){
  const d0 = _D();
  if(d0 && d0.sparkLastShown && d0.sparkLastShown !== _todayKey() && d0.sparkDismissedToday){
    d0.sparkDismissedToday = false;   // day rolled — chip state resets
  }
  let tries = 0;
  const t = setInterval(function(){
    tries++;
    if(tries > 50){ clearInterval(t); return; }
    const d = _D();
    if(!d) return;
    if(!d.onboardingDone && !d.onboarding_complete) return;   // never during onboarding
    if(_otherDialogOpen()) return;                            // wizard / PIN / auth sheet up
    if(document.body.classList.contains('parent-view')) return;
    if(d.sparkLastShown === _todayKey()){ clearInterval(t); _chipLoopStart(); return; }
    if(!_homeVisible()) return;
    clearInterval(t);
    setTimeout(function(){
      const dd = _D();
      if(dd && dd.sparkLastShown !== _todayKey() && !_otherDialogOpen() && _homeVisible()) _preloadThenShow();
      _chipLoopStart();
    }, 400);
  }, 800);
}
// Proof & Prophecy data is lazy (~238 KB). If today's rotation starts on
// the proof tease and the data isn't in yet, give it one short fetch
// window before showing (the pick falls through to the next category if
// the fetch loses the race — deterministic order is preserved either way).
function _preloadThenShow(){
  const kind = _poolKind();
  const h = _hash(_todayKey());
  const needsProof = kind === 'faith' &&
                     FAITH_POOL[h % FAITH_POOL.length] && FAITH_POOL[h % FAITH_POOL.length].id === 'proof' &&
                     !Array.isArray(window.PROOF_PROPHECY_DATA) &&
                     typeof window.ylccEnsureData === 'function';
  if(!needsProof){ _show(); return; }
  let done = false;
  const fin = function(){ if(done) return; done = true; _show(); };
  try{ window.ylccEnsureData('PROOF_PROPHECY_DATA', '/app/js/data/proof-prophecy.js').then(fin, fin); }
  catch(e){ fin(); return; }
  setTimeout(fin, 2000);
}
function _wire(){
  const ov = document.getElementById('dailySparkOverlay');
  if(ov){
    const x = ov.querySelector('.dsp-x');
    const bd = ov.querySelector('.dsp-backdrop');
    if(x) x.onclick = _hide;
    if(bd) bd.onclick = _hide;
  }
  const chip = document.getElementById('dailySparkChip');
  if(chip) chip.onclick = function(){ _show(); };
  document.addEventListener('keydown', function(e){
    const o = document.getElementById('dailySparkOverlay');
    if(!o || o.hidden) return;
    if(e.key === 'Escape'){ _hide(); return; }
    // aria-modal promise: keep Tab inside the dialog while it's open.
    if(e.key === 'Tab'){
      const f = o.querySelectorAll('button');
      if(!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); try{ last.focus(); }catch(_){/**/} }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); try{ first.focus(); }catch(_){/**/} }
      else if(!o.contains(document.activeElement)){ e.preventDefault(); try{ first.focus(); }catch(_){/**/} }
    }
  });
}
if(typeof document !== 'undefined'){
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ _wire(); setTimeout(_boot, 2000); });
  } else { _wire(); setTimeout(_boot, 2000); }
}

/* ── public surface ──────────────────────────────────────── */
if(typeof window !== 'undefined'){
  window.sparkOpen = _show;      // chip / debug entry
  window.sparkClose = _hide;
  // Pure internals exposed for the node smoke harness only.
  window._sparkTest = { hash:_hash, pick:_pick, todayKey:_todayKey,
                        faithPool:FAITH_POOL, mainPool:MAIN_POOL, poolKind:_poolKind };
}
})();
