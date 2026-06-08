/* =============================================================
   health.js — Mood tracker, weight log, nutrition, fitness habits
============================================================= */

// ════════════════════════════════════════════════════════════
// 2026-06-07 — Health Inc 1: Power Cards visual upgrade.
//
// HEALTH_DOMAINS groups the Health tab into 6 thematic clusters
// that render as Power Cards above the topic grid. Each domain
// has icon + accent + statFn (last-7-days completion). The strip
// is purely informational in Inc 1 (no click filter — clicking a
// domain card scrolls to / opens the corresponding sub-tab via
// _hDomainOpen helper). Per-domain stat helpers count days in the
// last 7 with at least one log entry.
//
// Movement domain returns 0/7 until Inc 4 ships the workout log;
// that's intentional — visible negative space invites the user.
// ════════════════════════════════════════════════════════════
function _hDomainCountDays7(predicate){
  let earned = 0;
  for(let i = 0; i < 7; i++){
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    if(predicate(ds)) earned++;
  }
  return earned;
}
function _hDomainSleep(){
  const log = (D && Array.isArray(D.sleepLog)) ? D.sleepLog : [];
  return { earned: _hDomainCountDays7(function(ds){ return log.some(function(s){ return s && s.date === ds; }); }), total: 7 };
}
function _hDomainMind(){
  const log = (D && Array.isArray(D.moods)) ? D.moods : [];
  return { earned: _hDomainCountDays7(function(ds){ return log.some(function(m){ return m && m.date === ds; }); }), total: 7 };
}
function _hDomainMeals(){
  const log = (D && Array.isArray(D.foodMeals)) ? D.foodMeals : [];
  return { earned: _hDomainCountDays7(function(ds){ return log.some(function(m){ return m && m.date === ds; }); }), total: 7 };
}
function _hDomainMovement(){
  const log = (D && Array.isArray(D.workoutLog)) ? D.workoutLog : [];
  return { earned: _hDomainCountDays7(function(ds){ return log.some(function(w){ return w && w.date === ds; }); }), total: 7 };
}
function _hDomainBody(){
  const log = (D && Array.isArray(D.weightLog)) ? D.weightLog : [];
  return { earned: _hDomainCountDays7(function(ds){ return log.some(function(w){ return w && w.date === ds; }); }), total: 7 };
}
function _hDomainHabits(){
  const checks = (D && D.dailyChecks) ? D.dailyChecks : {};
  return { earned: _hDomainCountDays7(function(ds){
    const bucket = checks[ds];
    if(!bucket) return false;
    for(const k in bucket){ if(bucket[k]) return true; }
    return false;
  }), total: 7 };
}

const HEALTH_DOMAINS = [
  {key:'sleep',    icon:'💤', name:'Sleep',    accent:'#818cf8',                       sub:'sleep',    stat:_hDomainSleep},
  {key:'mind',     icon:'💚', name:'Mind',     accent:'var(--section-health, #34d399)', sub:'mind',     stat:_hDomainMind},
  {key:'meals',    icon:'🍽️', name:'Meals',    accent:'#fbbf24',                       sub:'meals',    stat:_hDomainMeals},
  {key:'movement', icon:'🏃', name:'Movement', accent:'#f97316',                       sub:'habits',   stat:_hDomainMovement},
  {key:'body',     icon:'⚖️', name:'Body',     accent:'#22d3ee',                       sub:'weight',   stat:_hDomainBody},
  {key:'habits',   icon:'⚡', name:'Habits',   accent:'#a78bfa',                       sub:'habits',   stat:_hDomainHabits}
];

function renderHealthDomainStrip(){
  const host = document.getElementById('healthDomainStrip');
  if(!host) return;
  host.innerHTML = HEALTH_DOMAINS.map(function(dom){
    const s = dom.stat();
    const total = s.total || 7;
    const earned = s.earned || 0;
    const pct = total ? (earned / total) : 0;
    const offset = 125.66 * (1 - pct);
    const mastered = (earned === total && total > 0);
    return '<button type="button" class="h-domain-card'
      + (mastered ? ' is-mastered' : '') + '"'
      + ' data-domain="' + dom.key + '"'
      + ' style="--dom-accent:' + dom.accent + ';"'
      + ' onclick="_hDomainOpen(\'' + dom.sub + '\')"'
      + ' aria-label="' + dom.name + ' domain, ' + earned + ' of ' + total + ' days this week">'
      + '<span class="h-dom-ring" aria-hidden="true">'
        + '<svg viewBox="0 0 48 48">'
          + '<circle class="h-dom-ring-track" cx="24" cy="24" r="20"></circle>'
          + '<circle class="h-dom-ring-fill"  cx="24" cy="24" r="20"'
            + ' stroke-dasharray="125.66"'
            + ' stroke-dashoffset="' + offset + '"></circle>'
        + '</svg>'
        + '<span class="h-dom-icon">' + dom.icon + '</span>'
      + '</span>'
      + '<span class="h-dom-label">' + dom.name + '</span>'
      + '<span class="h-dom-progress">' + earned + ' of ' + total + '</span>'
    + '</button>';
  }).join('');
}

// Routes a domain card tap to its corresponding sub-tab. Clicks the
// matching .healthTabs .tab button so existing hTab() logic runs
// unchanged (render hooks, active class, deep-link compat).
function _hDomainOpen(sub){
  if(!sub) return;
  const btn = document.querySelector('.healthTabs .tab[onclick*="hTab(\'' + sub + '\'"]');
  if(btn && typeof btn.click === 'function') btn.click();
  // Scroll the active sub-tab content into view so the user lands
  // where they expect after the strip → tab transition.
  setTimeout(function(){
    const t = document.getElementById('ht-' + sub);
    if(t && typeof t.scrollIntoView === 'function'){
      t.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  }, 60);
}

// ── HEALTH ────────────────────────────────────────────────────
function hTab(tab,btn){
  document.querySelectorAll('[id^="ht-"]').forEach(t=>t.style.display='none');
  document.querySelectorAll('.healthTabs .tab').forEach(b=>b.classList.remove('active'));
  const te=document.getElementById('ht-'+tab); if(te) te.style.display='block';
  if(btn) btn.classList.add('active');
  if(tab==='weight') setTimeout(renderWeightChart,80);
  if(tab==='habits') renderHealthHabits();
  if(tab==='growth') renderGrowthTracker();
  // Phase C-Health additions
  if(tab==='sleep'){ renderSleepBars(); renderSleepList(); }
  if(tab==='mind') renderPhq2();
  if(tab==='meals') renderMealLog();
  // 2026-06-07 — Health Inc 2: hydration tracker
  if(tab==='water') renderWaterTracker();
  // 2026-06-07 — Health Inc 4: movement / workout tracker
  if(tab==='movement') renderMovementTracker();
  // 2026-06-07 — Health Inc 5: badges grid
  if(tab==='badges') renderBadgesGrid();
  // 2026-06-08 — Health Inc 6: body literacy. Defensive typeof
  // because body-literacy.js loads after health.js; on a cold cache
  // first render the global may briefly be undefined.
  if(tab==='body' && typeof renderBodyLiteracy === 'function') renderBodyLiteracy();
}

// ════════════════════════════════════════════════════════════
// 2026-06-07 — Health Inc 5: Milestone badges + PNG share.
//
// HEALTH_MILESTONES is the central config. Each entry carries the
// id (shared with misc.js BADGES via 'h-<id>' prefix), display name,
// glyph, color theme (used by the gradient ring + share PNG accent),
// short criterion description, and a check() function. _checkHealth-
// Milestones runs every check after each log action; first earn is
// written to D.healthMilestones[id] = YYYY-MM-DD and fires celebration.
//
// The misc.js BADGES system checks D.healthMilestones[id] presence —
// one-way ratchet, no false un-earns.
//
// shareBadgeImage(id) renders a 1080x1080 canvas portrait (glyph +
// name + earner name + date + brand) and tries Web Share files API,
// falling back to download.
// ════════════════════════════════════════════════════════════
const HEALTH_MILESTONES = [
  { id:'water7',       name:'Hydrated',          icon:'🌊', color:'#22d3ee',
    desc:'Hit your water goal 7 days in a row.',
    check: function(){ return (typeof calcWaterStreak === 'function') && calcWaterStreak() >= 7; } },
  { id:'sleep30',      name:'Sleep Scholar',     icon:'💤', color:'#818cf8',
    desc:'Log 30 nights of sleep.',
    check: function(){ return ((D && Array.isArray(D.sleepLog)) ? D.sleepLog.length : 0) >= 30; } },
  { id:'water100',     name:'Centurion',         icon:'💧', color:'#38bdf8',
    desc:'100 cups of water logged.',
    check: function(){
      const log = (D && Array.isArray(D.waterLog)) ? D.waterLog : [];
      return log.reduce(function(s, e){ return s + (Number(e.cups)||0); }, 0) >= 100;
    } },
  { id:'firstWorkout', name:'First Rep',         icon:'💪', color:'#f97316',
    desc:'Log your first workout.',
    check: function(){ return ((D && Array.isArray(D.workoutLog)) ? D.workoutLog.length : 0) >= 1; } },
  { id:'meals7',       name:'Consistent',        icon:'🍽️', color:'#fbbf24',
    desc:'Log a meal 7 days in a row.',
    check: function(){ return (typeof calcMealStreak === 'function') && calcMealStreak() >= 7; } },
  { id:'phq6',         name:'Check-in Champion', icon:'🧠', color:'#a78bfa',
    desc:'Complete 6 weekly mind check-ins.',
    check: function(){ return ((D && Array.isArray(D.phq2Log)) ? D.phq2Log.length : 0) >= 6; } },
  { id:'weeklyMin',    name:'Goal Crusher',      icon:'🎯', color:'#34d399',
    desc:'Hit your weekly active-minutes goal.',
    check: function(){
      const goal = (D && Number(D.workoutGoal)) || 150;
      return (typeof _calcActiveMinutesLast7 === 'function') && _calcActiveMinutesLast7() >= goal;
    } },
  { id:'mood7',        name:'In Tune',           icon:'💚', color:'#34d399',
    desc:'Log your mood 7 days in a row.',
    check: function(){ return _calcMoodStreak() >= 7; } }
];

// 7-day consecutive mood-log streak (matches calcMealStreak pattern).
function _calcMoodStreak(){
  const log = (D && Array.isArray(D.moods)) ? D.moods : [];
  if(!log.length) return 0;
  let streak = 0;
  const today = new Date();
  for(let i = 0; i < 90; i++){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    if(log.some(function(m){ return m && m.date === ds; })) streak++;
    else break;
  }
  return streak;
}

function _checkHealthMilestones(){
  if(!D.healthMilestones || typeof D.healthMilestones !== 'object') D.healthMilestones = {};
  let anyNew = false;
  HEALTH_MILESTONES.forEach(function(m){
    if(D.healthMilestones[m.id]) return; // already earned — one-way ratchet
    let earned = false;
    try { earned = !!m.check(); } catch(e){ earned = false; }
    if(earned){
      D.healthMilestones[m.id] = new Date().toISOString().slice(0,10);
      anyNew = true;
      // FAF Inc 2 — one feed event per first-earn so multi-badge
      // moments render line by line on the Activity tab.
      if(typeof logFamilyActivity === 'function'){
        logFamilyActivity('health', 'badge_earned', 'Health badge: ' + (m.name || m.id));
      }
      // Stagger celebrations so multiple-at-once still feel distinct.
      setTimeout(function(){ _celebrateHealthMilestone(m); }, 100);
    }
  });
  if(anyNew && typeof save === 'function') save();
}

function _celebrateHealthMilestone(m){
  if(!m) return;
  if(typeof launchBigConfetti === 'function') launchBigConfetti();
  if(typeof showToast === 'function'){
    showToast('🏆 Badge earned: ' + m.name + ' ' + m.icon);
  }
  // Refresh the badges grid live if the user happens to be viewing it.
  const bg = document.getElementById('ht-badges');
  if(bg && bg.style.display !== 'none' && typeof renderBadgesGrid === 'function'){
    renderBadgesGrid();
  }
}

function renderBadgesGrid(){
  const el = document.getElementById('ht-badges');
  if(!el) return;
  // Run a check first so freshly-earnable milestones land in
  // D.healthMilestones before the grid renders the earned state.
  _checkHealthMilestones();
  const earned = (D && D.healthMilestones && typeof D.healthMilestones === 'object') ? D.healthMilestones : {};
  const earnedCount = HEALTH_MILESTONES.filter(function(m){ return !!earned[m.id]; }).length;
  const total = HEALTH_MILESTONES.length;
  const pct = Math.round((earnedCount / total) * 100);

  el.innerHTML =
      '<div class="card" style="border-left:4px solid var(--section-health);">'
    +   '<div class="ct">🏆 Health Badges</div>'
    +   '<div style="display:flex;justify-content:space-between;align-items:center;gap:.8rem;margin-bottom:.6rem;flex-wrap:wrap;">'
    +     '<div style="font-size:.78rem;color:var(--tx2);line-height:1.55;flex:1;min-width:180px;">Earn a badge by hitting a streak or milestone. Tap any earned badge to share a card you can post.</div>'
    +     '<div class="hb-progress-pill"><span>' + earnedCount + '</span>/<span class="hb-progress-total">' + total + '</span> earned</div>'
    +   '</div>'
    +   '<div class="hb-progress-track"><div class="hb-progress-fill" style="width:' + pct + '%;"></div></div>'
    + '</div>'
    + '<div class="hb-grid">'
    +   HEALTH_MILESTONES.map(function(m){
        const isEarned = !!earned[m.id];
        const date = isEarned ? earned[m.id] : '';
        return '<button type="button" class="hb-card' + (isEarned ? ' is-earned' : ' is-locked') + '"'
          + ' style="--badge-accent:' + m.color + ';"'
          + ' onclick="' + (isEarned ? 'shareBadgeImage(\'' + m.id + '\')' : 'showBadgeCriteria(\'' + m.id + '\')') + '"'
          + ' aria-label="' + m.name + (isEarned ? ', earned ' + date + ', tap to share' : ', locked, ' + m.desc) + '">'
          + (isEarned ? '<span class="hb-shine" aria-hidden="true"></span>' : '')
          + '<span class="hb-glyph" aria-hidden="true">' + m.icon + '</span>'
          + '<span class="hb-name">' + m.name + '</span>'
          + (isEarned
              ? '<span class="hb-date">Earned ' + date + '</span><span class="hb-share-cue">Tap to share</span>'
              : '<span class="hb-criteria">' + m.desc + '</span><span class="hb-lock-cue">🔒 Locked</span>')
        + '</button>';
      }).join('')
    + '</div>';
}

function showBadgeCriteria(id){
  const m = HEALTH_MILESTONES.find(function(x){ return x.id === id; });
  if(!m) return;
  if(typeof showToast === 'function') showToast(m.icon + ' ' + m.name + ' — ' + m.desc);
}

// Helper: hex → rgba() for canvas gradient stops.
function _hbHexAlpha(hex, alpha){
  if(!hex || hex.charAt(0) !== '#') return 'rgba(255,255,255,' + alpha + ')';
  let h = hex.slice(1);
  if(h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
  if(h.length !== 6) return hex;
  const r = parseInt(h.slice(0,2), 16);
  const g = parseInt(h.slice(2,4), 16);
  const b = parseInt(h.slice(4,6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

async function shareBadgeImage(id){
  const m = HEALTH_MILESTONES.find(function(x){ return x.id === id; });
  if(!m) return;
  const earned = (D && D.healthMilestones && typeof D.healthMilestones === 'object') ? D.healthMilestones : {};
  const date = earned[m.id];
  if(!date){
    if(typeof showToast === 'function') showToast('Earn this badge first 🏆');
    return;
  }
  const userName = (D && D.name) ? String(D.name).toUpperCase() : 'CHAMPION';
  const accent = m.color || '#fbbf24';

  // 1080x1080 square — IG-feed friendly badge artifact
  const W = 1080, H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if(!ctx){
    if(typeof showToast === 'function') showToast('Canvas not supported');
    return;
  }

  // Background slate gradient + accent halo
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0d1117');
  bg.addColorStop(0.5, '#1e293b');
  bg.addColorStop(1, '#0d1117');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const halo = ctx.createRadialGradient(W/2, H/2 - 60, 0, W/2, H/2 - 60, W*0.55);
  halo.addColorStop(0, _hbHexAlpha(accent, 0.25));
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // Outer + inner border
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, W - 100, H - 100);
  ctx.strokeStyle = _hbHexAlpha(accent, 0.35);
  ctx.lineWidth = 1;
  ctx.strokeRect(72, 72, W - 144, H - 144);

  // 4 corner brackets
  const cornerSize = 64;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  function corner(x, y, dx, dy){
    ctx.beginPath();
    ctx.moveTo(x + dx*cornerSize, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy*cornerSize);
    ctx.stroke();
  }
  corner(72, 72, 1, 1);
  corner(W - 72, 72, -1, 1);
  corner(72, H - 72, 1, -1);
  corner(W - 72, H - 72, -1, -1);

  // Brand top
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = accent;
  ctx.font = '800 32px "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText('✦  YOURLIFE  BADGE  ✦', W/2, 180);

  // Big glyph in a colored ring
  const ringR = 150;
  const ringX = W/2, ringY = 430;
  // Subtle outer glow
  const glow = ctx.createRadialGradient(ringX, ringY, ringR * 0.6, ringX, ringY, ringR * 1.6);
  glow.addColorStop(0, _hbHexAlpha(accent, 0.35));
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(ringX, ringY, ringR * 1.6, 0, Math.PI * 2);
  ctx.fill();
  // Ring stroke
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
  ctx.stroke();
  // Inner thin ring
  ctx.strokeStyle = _hbHexAlpha(accent, 0.4);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(ringX, ringY, ringR - 16, 0, Math.PI * 2);
  ctx.stroke();
  // Glyph (emoji)
  ctx.font = '180px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", system-ui, sans-serif';
  ctx.fillText(m.icon, ringX, ringY + 64);

  // Badge name
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText((m.name || '').toUpperCase(), W/2, 700);

  // Star row
  ctx.fillStyle = accent;
  ctx.font = '34px "Segoe UI Symbol", "Apple Symbols", system-ui, sans-serif';
  ctx.fillText('★  ★  ★  ★  ★', W/2, 760);

  // Description
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = 'italic 500 22px "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText(m.desc, W/2, 815);

  // Earner name + date row
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '700 12px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('EARNED  BY', W/2, 880);
  ctx.fillStyle = accent;
  ctx.font = '900 36px "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText(userName, W/2, 920);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '500 18px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('on ' + date, W/2, 955);

  // Footer brand line
  ctx.fillStyle = accent;
  ctx.font = '700 16px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('yourlifecc.com', W/2, H - 90);

  // Export to PNG blob
  let blob;
  try {
    blob = await new Promise(function(resolve){ canvas.toBlob(resolve, 'image/png', 0.95); });
  } catch(e){ blob = null; }
  if(!blob){
    if(typeof showToast === 'function') showToast('Could not render image');
    return;
  }

  const filename = 'yourlifecc-badge-' + m.id + '.png';
  const shareText = 'Earned the ' + m.name + ' badge on YourLife CC! 🏆 — yourlifecc.com';

  // Web Share API with files
  try {
    if(navigator.canShare && navigator.share && typeof File === 'function'){
      const file = new File([blob], filename, { type: 'image/png' });
      if(navigator.canShare({ files: [file] })){
        try {
          await navigator.share({ files: [file], title: 'YourLife CC badge', text: shareText });
          return; // success
        } catch(shareErr){
          if(shareErr && shareErr.name === 'AbortError') return;
        }
      }
    }
  } catch(_){}

  // Download fallback
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
  if(typeof showToast === 'function') showToast('Badge image saved 📥');
}

// ════════════════════════════════════════════════════════════
// 2026-06-07 — Health Inc 4: Movement / workout log + active min.
//
// D.workoutLog is [{id, date, type, duration, intensity, note}].
// Each workout type carries an emoji + color used by the heatmap
// bars and the recent-sessions list. Intensity is 1 (easy) / 2
// (moderate) / 3 (hard) and shown as a dot row.
//
// Weekly active-minutes target lives in D.workoutGoal (default 150
// per the CDC). The big SVG ring fills to (last-7-days sum / goal),
// snapping to the gold "goal hit" gradient at 100%+.
//
// PR records live in D.prRecords as {[lowercaseKey]:{exercise, value,
// unit, date}}. addPR upserts by key so users can update an existing
// record without juggling list IDs.
//
// 1 Tim 4:8 faith line ("Train yourself for godliness") sits at the
// very bottom of the panel — same tonal treatment as the mood opener
// and Life-tab Goals card.
// ════════════════════════════════════════════════════════════
const WORKOUT_TYPES = [
  { key:'cardio',   icon:'🏃', label:'Cardio',   color:'#ef4444' },
  { key:'strength', icon:'💪', label:'Strength', color:'#f97316' },
  { key:'sport',    icon:'⚽', label:'Sport',    color:'#22d3ee' },
  { key:'mobility', icon:'🧘', label:'Mobility', color:'#a78bfa' }
];
const INTENSITY_LEVELS = [
  { v:1, label:'Easy',     color:'#22c55e' },
  { v:2, label:'Moderate', color:'#fbbf24' },
  { v:3, label:'Hard',     color:'#ef4444' }
];
const PR_UNITS = ['reps','sec','min','lbs','kg','miles','km'];

let _movementDraft = { type:'cardio', intensity:2 };

function _workoutTypeMeta(key){
  return WORKOUT_TYPES.find(function(t){ return t.key === key; }) || WORKOUT_TYPES[0];
}
function _intensityMeta(v){
  return INTENSITY_LEVELS.find(function(i){ return i.v === v; }) || INTENSITY_LEVELS[1];
}

function _calcActiveMinutesLast7(){
  const log = (D && Array.isArray(D.workoutLog)) ? D.workoutLog : [];
  const today = new Date(); today.setHours(0,0,0,0);
  const floor = new Date(today); floor.setDate(today.getDate() - 6);
  const floorISO = floor.toISOString().slice(0,10);
  return log
    .filter(function(w){ return w && (w.date || '') >= floorISO; })
    .reduce(function(s, w){ return s + (Number(w.duration)||0); }, 0);
}

function _setMovementDraftType(type){
  _movementDraft.type = type;
  // Repaint only the type pill row + intensity dot row (avoid clobbering
  // typed values in the duration/note inputs).
  document.querySelectorAll('#movementForm .mv-type-pill').forEach(function(p){
    p.classList.toggle('is-active', p.getAttribute('data-type') === type);
  });
}

function _setMovementDraftIntensity(v){
  _movementDraft.intensity = v;
  document.querySelectorAll('#movementForm .mv-int-dot').forEach(function(d){
    d.classList.toggle('is-active', parseInt(d.getAttribute('data-int'),10) === v);
  });
}

function logWorkout(){
  const durEl  = document.getElementById('mvDuration');
  const noteEl = document.getElementById('mvNote');
  const duration = parseInt(durEl ? durEl.value : '0', 10);
  if(!duration || duration < 1 || duration > 600){
    if(typeof showToast === 'function') showToast('Enter duration 1-600 min');
    return;
  }
  const type = _movementDraft.type || 'cardio';
  const intensity = parseInt(_movementDraft.intensity || 2, 10);
  const note = (noteEl ? String(noteEl.value || '') : '').trim().slice(0, 120);
  if(!Array.isArray(D.workoutLog)) D.workoutLog = [];
  const today = new Date().toISOString().slice(0,10);
  D.workoutLog.unshift({
    id: Date.now(),
    date: today,
    type: type,
    duration: duration,
    intensity: intensity,
    note: note
  });
  if(D.workoutLog.length > 500) D.workoutLog = D.workoutLog.slice(0, 500);
  save();
  renderMovementTracker();
  if(typeof renderHealthDomainStrip === 'function') renderHealthDomainStrip();
  // FAF Inc 2 — workout logged.
  if(typeof logFamilyActivity === 'function'){
    logFamilyActivity('health', 'workout_logged', 'Workout: ' + type + ' ' + duration + 'min');
  }
  if(typeof showToast === 'function') showToast('Workout logged 🏃 +' + duration + ' min');
  // Goal-hit celebration: did this entry cross 150 min for the week?
  const goal = Number(D.workoutGoal) || 150;
  const totalAfter = _calcActiveMinutesLast7();
  const totalBefore = totalAfter - duration;
  if(totalBefore < goal && totalAfter >= goal){
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
    if(typeof showToast === 'function') showToast('Weekly active-minutes goal hit! 🎯');
  }
  // 2026-06-07 — Health Inc 5: milestone check (firstWorkout + weeklyMin).
  if(typeof _checkHealthMilestones === 'function') _checkHealthMilestones();
}

function deleteWorkout(id){
  D.workoutLog = (Array.isArray(D.workoutLog) ? D.workoutLog : []).filter(function(w){ return w && w.id !== id; });
  save();
  renderMovementTracker();
  if(typeof renderHealthDomainStrip === 'function') renderHealthDomainStrip();
}

function setWorkoutGoal(value){
  const n = parseInt(value, 10);
  if(isNaN(n) || n < 15 || n > 2000) return;
  D.workoutGoal = n;
  save();
  renderMovementTracker();
  if(typeof showToast === 'function') showToast('Weekly goal: ' + n + ' min');
}

function addPR(){
  const exEl   = document.getElementById('mvPrExercise');
  const valEl  = document.getElementById('mvPrValue');
  const unitEl = document.getElementById('mvPrUnit');
  const exercise = (exEl ? String(exEl.value || '') : '').trim().slice(0, 40);
  const value    = parseFloat(valEl ? valEl.value : '');
  const unit     = unitEl ? String(unitEl.value || 'reps') : 'reps';
  if(!exercise){
    if(typeof showToast === 'function') showToast('Enter exercise name');
    return;
  }
  if(isNaN(value) || value <= 0 || value > 100000){
    if(typeof showToast === 'function') showToast('Enter a valid value');
    return;
  }
  if(PR_UNITS.indexOf(unit) === -1){
    if(typeof showToast === 'function') showToast('Pick a valid unit');
    return;
  }
  if(!D.prRecords || typeof D.prRecords !== 'object') D.prRecords = {};
  const key = exercise.toLowerCase();
  const prev = D.prRecords[key];
  D.prRecords[key] = {
    exercise: exercise,
    value:    value,
    unit:     unit,
    date:     new Date().toISOString().slice(0,10)
  };
  save();
  if(exEl)  exEl.value = '';
  if(valEl) valEl.value = '';
  renderMovementTracker();
  // FAF Inc 2 — PR set / updated. Logs both the first-record and the
  // "beat-your-PR" moments; we only fire when prev was missing OR the
  // new value beats prev, so an unchanged re-entry doesn't spam the
  // feed.
  if(typeof logFamilyActivity === 'function'){
    const beatPrev = prev && value > Number(prev.value || 0);
    if(!prev || beatPrev){
      logFamilyActivity('health', 'pr_set', 'New PR: ' + exercise + ' ' + value + unit);
    }
  }
  // Beat-your-PR moment: prev existed AND value > prev.value
  if(prev && value > Number(prev.value || 0)){
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
    if(typeof showToast === 'function') showToast('🎉 New PR — beat ' + prev.value + ' ' + prev.unit);
  } else if(typeof showToast === 'function'){
    showToast(prev ? 'PR updated' : 'PR logged 🏆');
  }
}

function deletePR(key){
  if(!D.prRecords || typeof D.prRecords !== 'object') return;
  delete D.prRecords[key];
  save();
  renderMovementTracker();
}

function renderMovementTracker(){
  const el = document.getElementById('ht-movement');
  if(!el) return;

  // ── Weekly active-minutes ring ─────────────────────────────
  const goal = Number(D.workoutGoal) || 150;
  const total = _calcActiveMinutesLast7();
  const fillFrac = Math.min(1, total / Math.max(1, goal));
  const pct = Math.round(fillFrac * 100);
  const r = 70;
  const C = 2 * Math.PI * r;
  const offset = C * (1 - fillFrac);
  const hitGoal = total >= goal;
  const ringClass = hitGoal ? ' is-hit' : '';

  // ── 7-day heatmap data ─────────────────────────────────────
  const today = new Date(); today.setHours(0,0,0,0);
  const log = Array.isArray(D.workoutLog) ? D.workoutLog : [];
  const days = [];
  let maxDayMin = 1;
  for(let i = 6; i >= 0; i--){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const dayLog = log.filter(function(w){ return w && w.date === ds; });
    const mins = dayLog.reduce(function(s,w){ return s + (Number(w.duration)||0); }, 0);
    if(mins > maxDayMin) maxDayMin = mins;
    // Dominant type by minutes — drives the bar color
    let dom = '';
    const byType = {};
    dayLog.forEach(function(w){ byType[w.type] = (byType[w.type]||0) + (Number(w.duration)||0); });
    let best = 0;
    for(const t in byType){ if(byType[t] > best){ best = byType[t]; dom = t; } }
    days.push({
      ds: ds,
      mins: mins,
      dom: dom,
      dl: d.toLocaleDateString('en-US',{weekday:'short'})
    });
  }
  const heatmapMax = Math.max(maxDayMin, 30);

  // ── Recent sessions list (last 8) ──────────────────────────
  const recent = log.slice(0, 8);

  // ── PR records (sorted by date desc) ───────────────────────
  const prMap = (D.prRecords && typeof D.prRecords === 'object') ? D.prRecords : {};
  const prList = Object.keys(prMap)
    .map(function(k){ return Object.assign({ key:k }, prMap[k]); })
    .sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); });

  // Draft pills — make sure the active state survives re-renders
  const draftType = _movementDraft.type || 'cardio';
  const draftInt = _movementDraft.intensity || 2;

  el.innerHTML =
      '<div class="card" style="border-left:4px solid var(--section-health);text-align:center;">'
    +   '<div class="ct" style="justify-content:center;">🏃 This Week — Active Minutes</div>'
    +   '<div style="font-size:.78rem;color:var(--tx2);margin-bottom:.85rem;line-height:1.55;">CDC recommends 150 min moderate / week. Build it however you want — runs, lifting, ball, stretching.</div>'
    +   '<div class="mv-ring-wrap' + ringClass + '">'
    +     '<svg viewBox="0 0 200 200" class="mv-ring-svg" aria-hidden="true">'
    +       '<defs>'
    +         '<linearGradient id="mvRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">'
    +           '<stop offset="0%"   stop-color="' + (hitGoal ? '#fde68a' : '#34d399') + '"/>'
    +           '<stop offset="100%" stop-color="' + (hitGoal ? '#f59e0b' : '#22d3ee') + '"/>'
    +         '</linearGradient>'
    +       '</defs>'
    +       '<circle class="mv-ring-track" cx="100" cy="100" r="' + r + '"></circle>'
    +       '<circle class="mv-ring-fill"  cx="100" cy="100" r="' + r + '"'
    +         ' stroke-dasharray="'  + C.toFixed(2) + '"'
    +         ' stroke-dashoffset="' + offset.toFixed(2) + '"></circle>'
    +     '</svg>'
    +     '<div class="mv-ring-center">'
    +       '<div class="mv-ring-min">' + total + '<span class="mv-ring-unit">/' + goal + '</span></div>'
    +       '<div class="mv-ring-label">min · ' + pct + '%</div>'
    +     '</div>'
    +   '</div>'
    +   (hitGoal
        ? '<div class="mv-streak-pill">🎯 Weekly goal hit</div>'
        : '<div class="mv-streak-hint">' + Math.max(0, goal - total) + ' min to your weekly goal.</div>')
    +   '<div class="mv-goal-row">'
    +     '<label for="mvGoalInput">Weekly goal</label>'
    +     '<input type="number" id="mvGoalInput" min="15" max="2000" value="' + goal + '" onchange="setWorkoutGoal(this.value)">'
    +     '<span>min</span>'
    +   '</div>'
    + '</div>'

    + '<div class="card" style="margin-top:.8rem;">'
    +   '<div class="ct">📊 Last 7 Days</div>'
    +   '<div class="mv-heatmap">'
    +     days.map(function(d){
            const h = d.mins > 0 ? Math.max(8, (d.mins / heatmapMax) * 100) : 0;
            const typeMeta = d.dom ? _workoutTypeMeta(d.dom) : null;
            const col = !d.mins ? 'rgba(255,255,255,.06)'
                      : 'linear-gradient(180deg, ' + (typeMeta ? typeMeta.color : '#22d3ee') + ', ' + (typeMeta ? typeMeta.color + '88' : '#22d3ee88') + ')';
            return '<div class="mv-bar-col">'
              + '<div class="mv-bar-stack">'
              + (d.mins > 0
                  ? '<div class="mv-bar-fill" style="height:' + h + '%;background:' + col + ';"></div>'
                  : '<div class="mv-bar-empty"></div>')
              + '</div>'
              + '<div class="mv-bar-label">' + d.dl + '</div>'
              + '<div class="mv-bar-val">' + (d.mins > 0 ? d.mins : '—') + '</div>'
              + '</div>';
          }).join('')
    +   '</div>'
    +   '<div class="mv-legend">'
    +     WORKOUT_TYPES.map(function(t){
            return '<span><span class="mv-legend-dot" style="background:' + t.color + ';"></span>' + t.icon + ' ' + t.label + '</span>';
          }).join('')
    +   '</div>'
    + '</div>'

    + '<div class="card" id="movementForm" style="margin-top:.8rem;">'
    +   '<div class="ct">➕ Log a Session</div>'
    +   '<label style="margin-top:.2rem;">Type</label>'
    +   '<div class="mv-type-row">'
    +     WORKOUT_TYPES.map(function(t){
            return '<button type="button" class="mv-type-pill' + (t.key === draftType ? ' is-active' : '') + '"'
              + ' data-type="' + t.key + '"'
              + ' style="--type-accent:' + t.color + ';"'
              + ' onclick="_setMovementDraftType(\'' + t.key + '\')"'
              + '><span class="mv-type-emoji">' + t.icon + '</span><span>' + t.label + '</span></button>';
          }).join('')
    +   '</div>'
    +   '<label>Duration (minutes)</label>'
    +   '<input type="number" id="mvDuration" min="1" max="600" placeholder="30">'
    +   '<label>Intensity</label>'
    +   '<div class="mv-int-row">'
    +     INTENSITY_LEVELS.map(function(i){
            return '<button type="button" class="mv-int-dot' + (i.v === draftInt ? ' is-active' : '') + '"'
              + ' data-int="' + i.v + '"'
              + ' style="--int-accent:' + i.color + ';"'
              + ' onclick="_setMovementDraftIntensity(' + i.v + ')"'
              + '><span class="mv-int-bullet"></span><span>' + i.label + '</span></button>';
          }).join('')
    +   '</div>'
    +   '<label>Note (optional)</label>'
    +   '<input type="text" id="mvNote" placeholder="Hill sprints with the dog" maxlength="120">'
    +   '<button class="btn bp" style="width:100%;margin-top:.7rem;background:var(--section-health);border-color:var(--section-health);color:#0b1020;" onclick="logWorkout()">Log workout</button>'
    + '</div>'

    + '<div class="card" style="margin-top:.8rem;">'
    +   '<div class="ct">📋 Recent Sessions</div>'
    +   (recent.length
        ? '<div class="mv-recent">'
          + recent.map(function(w){
              const tm = _workoutTypeMeta(w.type);
              const im = _intensityMeta(w.intensity);
              return '<div class="mv-recent-row">'
                + '<span class="mv-recent-icon" style="background:' + tm.color + '22;color:' + tm.color + ';">' + tm.icon + '</span>'
                + '<div class="mv-recent-body">'
                +   '<div class="mv-recent-line">' + tm.label + ' · ' + w.duration + ' min · <span style="color:' + im.color + ';">' + im.label + '</span></div>'
                +   '<div class="mv-recent-sub">' + (w.date) + (w.note ? ' · ' + escapeHtml(w.note) : '') + '</div>'
                + '</div>'
                + '<button class="db" onclick="deleteWorkout(' + w.id + ')">✕</button>'
                + '</div>';
            }).join('')
          + '</div>'
        : '<div class="mv-empty">No sessions logged yet — your first 10 min counts.</div>')
    + '</div>'

    + '<div class="card" style="margin-top:.8rem;">'
    +   '<div class="ct">🏆 Personal Records</div>'
    +   '<div style="font-size:.75rem;color:var(--tx2);margin-bottom:.7rem;">Track your best — max reps, longest plank, fastest mile, heaviest lift. Beat them.</div>'
    +   (prList.length
        ? '<div class="mv-pr-list">'
          + prList.map(function(pr){
              return '<div class="mv-pr-row">'
                + '<div class="mv-pr-body">'
                +   '<div class="mv-pr-name">' + escapeHtml(pr.exercise) + '</div>'
                +   '<div class="mv-pr-sub">Set ' + pr.date + '</div>'
                + '</div>'
                + '<div class="mv-pr-value">' + escapeHtml(String(pr.value)) + '<span class="mv-pr-unit"> ' + escapeHtml(pr.unit) + '</span></div>'
                + '<button class="db" onclick="deletePR(\'' + pr.key.replace(/'/g,"\\'") + '\')">✕</button>'
                + '</div>';
            }).join('')
          + '</div>'
        : '<div class="mv-empty">No PRs yet — log your first below.</div>')
    +   '<div class="mv-pr-form">'
    +     '<input type="text" id="mvPrExercise" placeholder="Exercise (e.g. Push-ups)" maxlength="40">'
    +     '<input type="number" id="mvPrValue" placeholder="Value" step="0.1" min="0">'
    +     '<select id="mvPrUnit">'
    +       PR_UNITS.map(function(u){ return '<option value="' + u + '">' + u + '</option>'; }).join('')
    +     '</select>'
    +     '<button class="btn bp" onclick="addPR()">+ Add PR</button>'
    +   '</div>'
    +   '<div class="mv-faith-divider" aria-hidden="true"></div>'
    +   '<div class="mv-faith">Train yourself for godliness. — 1 Tim 4:8</div>'
    + '</div>';
}

// ════════════════════════════════════════════════════════════
// 2026-06-07 — Health Inc 3: AI Health Coach (mirrors Money Coach).
//
// _healthCoachStats14d aggregates the last 14 days of sleep / meals /
// water / mood / PHQ-2 / weight into a structured stats blob (no
// free-text notes leave the device). fetchHealthCoach POSTs it to
// /api/ai-summary with mode 'health-coach' which loads the strict
// HEALTH_COACH_SYSTEM safety prompt (no diagnosis, no medication, no
// body-image judgment, doctor/parent referral for sustained low
// signals, 988 escalation language for elevated PHQ-2).
//
// Cache shape mirrors Money Coach (D.financeCoachLastWeek):
//   D.healthCoachCache = { dayKey, summary, focus, fetchedAt }
// Manual refresh rate-limited to 6h. Auto-fetch runs once per local
// day when the user has 3+ recent logs across the trackers.
// ════════════════════════════════════════════════════════════
function _healthCoachStats14d(){
  const now = new Date();
  const floor = new Date(now.getTime() - 14 * 86400000);
  const floorISO = floor.toISOString().slice(0,10);

  // Sleep: nights logged, avg hours, low (<7h) nights
  const sleep = (Array.isArray(D.sleepLog) ? D.sleepLog : []).filter(function(s){ return s && (s.date || '') >= floorISO; });
  const sleepNights = sleep.length;
  const sleepAvgRaw = sleepNights ? (sleep.reduce(function(t,e){ return t + (Number(e.hours)||0); }, 0) / sleepNights) : 0;
  const sleepAvg = Math.round(sleepAvgRaw * 10) / 10;
  const sleepLow = sleep.filter(function(s){ return (Number(s.hours)||0) < 7; }).length;

  // Meals: distinct days with at least one meal logged
  const meals = (Array.isArray(D.foodMeals) ? D.foodMeals : []).filter(function(m){ return m && (m.date || '') >= floorISO; });
  const mealDaySet = {};
  meals.forEach(function(m){ if(m.date) mealDaySet[m.date] = 1; });
  const mealDays = Object.keys(mealDaySet).length;

  // Water: days logged, days hit goal, avg cups, goal (Inc 2 field)
  const goal = Number(D.waterGoal) || 8;
  const water = (Array.isArray(D.waterLog) ? D.waterLog : []).filter(function(w){ return w && (w.date || '') >= floorISO; });
  const waterDays = water.length;
  const waterHitGoal = water.filter(function(w){ return (Number(w.cups)||0) >= goal; }).length;
  const waterAvg = waterDays ? Math.round(water.reduce(function(t,e){ return t + (Number(e.cups)||0); }, 0) / waterDays) : 0;

  // Mood: avg level (1-5), days logged, low-mood days (level ≤ 2)
  const moods = (Array.isArray(D.moods) ? D.moods : []).filter(function(m){ return m && (m.date || '') >= floorISO; });
  const moodDays = moods.length;
  const moodAvgRaw = moodDays ? (moods.reduce(function(t,m){ return t + (Number(m.level)||0); }, 0) / moodDays) : 0;
  const moodAvg = Math.round(moodAvgRaw * 10) / 10;
  const moodLow = moods.filter(function(m){ return (Number(m.level)||0) <= 2; }).length;

  // PHQ-2: latest score + elevated-run count (both q1 ≥ 2 AND q2 ≥ 2)
  const phq = (Array.isArray(D.phq2Log) ? D.phq2Log : []).filter(function(p){ return p && (p.date || '') >= floorISO; });
  const phqLast = phq[0] ? ((Number(phq[0].q1)||0) + (Number(phq[0].q2)||0)) : null;
  const phqElevated = phq.filter(function(p){ return (Number(p.q1)||0) >= 2 && (Number(p.q2)||0) >= 2; }).length;

  // Weight: 14-day start + latest + delta (lb)
  const weights = (Array.isArray(D.weightLog) ? D.weightLog : [])
    .filter(function(w){ return w && (w.date || '') >= floorISO; })
    .slice()
    .sort(function(a,b){ return new Date(a.date) - new Date(b.date); });
  const weightStart  = weights.length ? Number(weights[0].weight)  || null : null;
  const weightLatest = weights.length ? Number(weights[weights.length-1].weight) || null : null;
  const weightDelta  = (weightStart != null && weightLatest != null)
    ? Math.round((weightLatest - weightStart) * 10) / 10
    : null;

  const name = (D && D.name) ? String(D.name).slice(0,40) : 'friend';
  return {
    name:   name,
    days:   14,
    sleep:  { nightsLogged: sleepNights, avgHours: sleepAvg, lowNights: sleepLow },
    meals:  { daysLogged:   mealDays },
    water:  { daysLogged:   waterDays, daysHitGoal: waterHitGoal, avgCups: waterAvg, goal: goal },
    mood:   { daysLogged:   moodDays, avgLevel: moodAvg, lowDays: moodLow },
    phq2:   { latestScore: phqLast, elevatedRunsLast14d: phqElevated },
    weight: { startLb: weightStart, latestLb: weightLatest, deltaLb: weightDelta }
  };
}

async function fetchHealthCoach(){
  if(!D.healthCoachCache || typeof D.healthCoachCache !== 'object'){
    D.healthCoachCache = { dayKey:'', summary:'', focus:'', fetchedAt:0 };
  }
  // Rate-limit manual refreshes: max once per 6 hours (matches Money Coach).
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const now = Date.now();
  if(D.healthCoachCache.fetchedAt && (now - D.healthCoachCache.fetchedAt) < SIX_HOURS){
    if(typeof showToast === 'function') showToast('Coach refreshed recently — try again later.');
    return;
  }
  const stats = _healthCoachStats14d();
  const totalActivity = stats.sleep.nightsLogged + stats.meals.daysLogged + stats.water.daysLogged + stats.mood.daysLogged;

  if(totalActivity < 2){
    // Empty profile — friendly stub, no API call burned.
    D.healthCoachCache = {
      dayKey:    new Date().toISOString().slice(0,10),
      summary:   'Tracking just started — the first week is always quiet. Pick one thing you want to feel better about (sleep, hydration, mood) and log it once today.',
      focus:     'Log one thing today. One entry beats none.',
      fetchedAt: now
    };
    save();
    if(typeof renderHealthCoach === 'function') renderHealthCoach();
    return;
  }

  const host = document.getElementById('healthCoachCard');
  if(host){
    const body = host.querySelector('.h-coach__body');
    if(body) body.innerHTML = '<div class="h-coach__loading">Coach is reading the last two weeks…</div>';
  }

  try {
    const resp = await fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'health-coach', prompt: JSON.stringify(stats) })
    });
    const json = await resp.json();
    if(!json || !json.ok || !json.summary){
      throw new Error('Empty or malformed response');
    }
    D.healthCoachCache = {
      dayKey:    new Date().toISOString().slice(0,10),
      summary:   String(json.summary || '').slice(0, 500),
      focus:     String(json.focus   || '').slice(0, 200),
      fetchedAt: now
    };
    save();
    if(typeof renderHealthCoach === 'function') renderHealthCoach();
  } catch(e){
    console.debug('[health-coach] fetch failed:', e && e.message);
    if(host){
      const body2 = host.querySelector('.h-coach__body');
      if(body2) body2.innerHTML = '<div class="h-coach__err">Coach is offline right now. Try refresh in a minute.</div>';
    }
  }
}

function renderHealthCoach(){
  const host = document.getElementById('healthCoachCard');
  if(!host) return;
  if(!D.healthCoachCache || typeof D.healthCoachCache !== 'object'){
    D.healthCoachCache = { dayKey:'', summary:'', focus:'', fetchedAt:0 };
  }
  const today = new Date().toISOString().slice(0,10);
  const esc = function(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  };
  const stale = D.healthCoachCache.dayKey !== today;
  const hasContent = !!(D.healthCoachCache.summary);

  if(hasContent){
    host.innerHTML = ''
      + '<div class="h-coach">'
      +   '<div class="h-coach__head">'
      +     '<div class="h-coach__title">💚 Your Health Coach</div>'
      +     '<button type="button" class="h-coach__refresh" onclick="fetchHealthCoach()" title="Refresh coach (max once per 6h)" aria-label="Refresh coach">↻</button>'
      +   '</div>'
      +   '<div class="h-coach__body">'
      +     '<p class="h-coach__summary">' + esc(D.healthCoachCache.summary) + '</p>'
      +     (D.healthCoachCache.focus
        ? '<p class="h-coach__focus"><span class="h-coach__focus-label">Today:</span> ' + esc(D.healthCoachCache.focus) + '</p>'
        : '')
      +   '</div>'
      +   (stale ? '<div class="h-coach__stale">New day — tap ↻ for a fresh read</div>' : '')
      + '</div>';
  } else {
    host.innerHTML = ''
      + '<div class="h-coach h-coach--empty">'
      +   '<div class="h-coach__head">'
      +     '<div class="h-coach__title">💚 Your Health Coach</div>'
      +     '<button type="button" class="h-coach__refresh" onclick="fetchHealthCoach()" title="Get my first coaching" aria-label="Get my first coaching">↻</button>'
      +   '</div>'
      +   '<div class="h-coach__body">'
      +     '<p class="h-coach__summary">No coaching yet. Tap ↻ once you\'ve logged sleep, water, or mood for a few days and I\'ll show you the pattern.</p>'
      +   '</div>'
      + '</div>';
  }
}

function _maybeAutoFetchHealthCoach(){
  if(!D.healthCoachCache || typeof D.healthCoachCache !== 'object') return;
  const today = new Date().toISOString().slice(0,10);
  if(D.healthCoachCache.dayKey === today) return; // already fetched today
  const s = _healthCoachStats14d();
  const totalActivity = s.sleep.nightsLogged + s.meals.daysLogged + s.water.daysLogged + s.mood.daysLogged;
  // Auto-fetch only when there's meaningful pattern data — empty
  // profiles get the friendly stub via the manual ↻ path instead.
  if(totalActivity < 3) return;
  fetchHealthCoach();
}

// ════════════════════════════════════════════════════════════
// 2026-06-07 — Health Inc 2: Hydration tracker.
//
// One entry per local day in D.waterLog ([{date, cups}]). logWater(±1)
// bumps today's entry (finds-or-creates), capping at 0..30 cups and
// the log itself at 365 entries. Midnight reset is automatic — a new
// date string => a new entry on first tap of the new day.
//
// Streak: count consecutive days back from today where cups >= goal.
// Today is excluded if it hasn't yet hit goal (preserves yesterday's
// streak while the user is mid-day).
//
// Goal-hit celebration: side confetti + toast on the cup that crosses
// the threshold. Single-fire per day (only when cups === goal exactly).
// ════════════════════════════════════════════════════════════
function logWater(delta){
  if(!D.waterLog) D.waterLog = [];
  const today = new Date().toISOString().slice(0,10);
  let entry = D.waterLog.find(e => e && e.date === today);
  if(!entry){
    entry = { date: today, cups: 0 };
    D.waterLog.unshift(entry);
  }
  const prev = entry.cups || 0;
  entry.cups = Math.max(0, Math.min(30, prev + delta));
  if(D.waterLog.length > 365) D.waterLog = D.waterLog.slice(0, 365);
  save();
  renderWaterTracker();
  // Cross-tab freshness — the Health domain strip doesn't currently
  // include a Hydration tile, but this keeps existing rings honest.
  if(typeof renderHealthDomainStrip === 'function') renderHealthDomainStrip();
  const goal = D.waterGoal || 8;
  if(delta > 0 && prev < goal && entry.cups >= goal){
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
    if(typeof showToast === 'function') showToast('Daily water goal hit! 💧');
    // FAF Inc 2 — emit only on the cup that crosses the goal so the
    // feed gets one event per day, not one per cup.
    if(typeof logFamilyActivity === 'function'){
      logFamilyActivity('health', 'water_goal_hit', 'Daily water goal hit! 💧');
    }
  }
  // 2026-06-07 — Health Inc 5: milestone check (water7 + water100).
  if(typeof _checkHealthMilestones === 'function') _checkHealthMilestones();
}

function setWaterGoal(value){
  const n = parseInt(value, 10);
  if(isNaN(n) || n < 1 || n > 30) return;
  D.waterGoal = n;
  save();
  renderWaterTracker();
  if(typeof showToast === 'function') showToast('Goal set: ' + n + ' cups');
}

function calcWaterStreak(){
  const log = D.waterLog || [];
  const goal = D.waterGoal || 8;
  if(!log.length) return 0;
  let streak = 0;
  const today = new Date().toISOString().slice(0,10);
  const todayEntry = log.find(e => e && e.date === today);
  // Today not yet hit goal → start counting from yesterday (don't
  // break an existing streak just because the day is in progress).
  let startOffset = 0;
  if(!todayEntry || (todayEntry.cups||0) < goal) startOffset = 1;
  for(let i = startOffset; i < 90; i++){
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const entry = log.find(e => e && e.date === ds);
    if(entry && (entry.cups||0) >= goal) streak++;
    else break;
  }
  return streak;
}

function renderWaterTracker(){
  const el = document.getElementById('ht-water');
  if(!el) return;
  const today = new Date().toISOString().slice(0,10);
  const log = D.waterLog || [];
  const goal = D.waterGoal || 8;
  const todayEntry = log.find(e => e && e.date === today);
  const cups = todayEntry ? (todayEntry.cups || 0) : 0;
  const streak = calcWaterStreak();

  // Big progress ring — r=70, viewBox 200x200, stroke 14
  const r = 70;
  const C = 2 * Math.PI * r;
  const fillFrac = Math.min(1, cups / Math.max(1, goal));
  const offset = C * (1 - fillFrac);
  const pct = Math.round(fillFrac * 100);

  el.innerHTML =
      '<div class="card" style="border-left:4px solid var(--section-health);text-align:center;">'
    +   '<div class="ct" style="justify-content:center;">💧 Today\'s Hydration</div>'
    +   '<div style="font-size:.78rem;color:var(--tx2);margin-bottom:.85rem;line-height:1.55;">Tap to log each cup. Resets at midnight. 64 oz (8 cups) is the teen minimum.</div>'
    +   '<div class="water-ring-wrap">'
    +     '<svg viewBox="0 0 200 200" class="water-ring-svg" aria-hidden="true">'
    +       '<defs>'
    +         '<linearGradient id="waterRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">'
    +           '<stop offset="0%"   stop-color="#38bdf8"/>'
    +           '<stop offset="100%" stop-color="#22d3ee"/>'
    +         '</linearGradient>'
    +       '</defs>'
    +       '<circle class="water-ring-track" cx="100" cy="100" r="' + r + '"></circle>'
    +       '<circle class="water-ring-fill"  cx="100" cy="100" r="' + r + '"'
    +         ' stroke-dasharray="'  + C.toFixed(2) + '"'
    +         ' stroke-dashoffset="' + offset.toFixed(2) + '"></circle>'
    +     '</svg>'
    +     '<div class="water-ring-center">'
    +       '<div class="water-ring-cups">' + cups + '<span class="water-ring-unit">/' + goal + '</span></div>'
    +       '<div class="water-ring-label">cups · ' + pct + '%</div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="water-actions">'
    +     '<button class="water-btn water-minus" onclick="logWater(-1)" aria-label="Remove a cup"' + (cups<=0?' disabled':'') + '>−</button>'
    +     '<button class="water-btn water-plus"  onclick="logWater(1)"  aria-label="Add a cup">+ Cup</button>'
    +   '</div>'
    +   (streak > 0
        ? '<div class="water-streak-pill">🔥 ' + streak + '-day streak</div>'
        : '<div class="water-streak-hint">Hit the goal today to start a streak.</div>')
    +   '<div class="water-goal-row">'
    +     '<label for="waterGoalInput">Daily goal</label>'
    +     '<input type="number" id="waterGoalInput" min="1" max="30" value="' + goal + '" onchange="setWaterGoal(this.value)">'
    +     '<span>cups</span>'
    +   '</div>'
    + '</div>'
    + '<div class="card" style="margin-top:.8rem;">'
    +   '<div class="ct">📊 Last 7 Days</div>'
    +   '<div id="waterWeekChart"></div>'
    +   '<div class="water-tip">Pale yellow urine = hydrated. Dark yellow = drink more. Soda and juice don\'t count.</div>'
    + '</div>';

  _renderWaterDayChart();
}

function _renderWaterDayChart(){
  const el = document.getElementById('waterWeekChart');
  if(!el) return;
  const log = D.waterLog || [];
  const goal = D.waterGoal || 8;
  const today = new Date();
  const days = [];
  for(let i = 6; i >= 0; i--){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const entry = log.find(e => e && e.date === ds);
    const cups = entry ? (entry.cups||0) : 0;
    days.push({
      ds: ds,
      cups: cups,
      hasData: !!entry,
      dl: d.toLocaleDateString('en-US',{weekday:'short'}),
      hit: cups >= goal
    });
  }
  const maxC = Math.max(goal + 2, ...days.map(d => d.cups));
  el.innerHTML = '<div class="water-bars">'
    + days.map(d => {
        const pct = d.cups > 0 ? Math.max(6, (d.cups / maxC) * 100) : 0;
        const color = !d.cups ? 'rgba(255,255,255,.06)'
                    : d.hit  ? 'linear-gradient(180deg, #22d3ee, #38bdf8)'
                             : 'linear-gradient(180deg, #60a5fa, #3b82f6)';
        return '<div class="water-bar-col">'
          + '<div class="water-bar-stack">'
          + (d.cups > 0
              ? '<div class="water-bar-fill" style="height:' + pct + '%;background:' + color + ';"></div>'
              : '<div class="water-bar-empty"></div>')
          + '</div>'
          + '<div class="water-bar-label">' + d.dl + '</div>'
          + '<div class="water-bar-val">' + (d.cups > 0 ? d.cups : '—') + '</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

function logWeight(){ const w=parseFloat(document.getElementById('wInput').value); const goal=parseFloat(document.getElementById('wGoal').value); const date=document.getElementById('wDate').value||localDateString(); if(isNaN(w)||w<=0){showToast('Enter a valid weight');return;} if(!isNaN(goal)&&goal>0) D.weightGoal=goal; if(!D.weightLog) D.weightLog=[]; D.weightLog.unshift({id:Date.now(),weight:w,date}); if(D.weightLog.length>90) D.weightLog=D.weightLog.slice(0,90); document.getElementById('wInput').value=''; save(); renderWeightList(); renderWeightChart(); updateWeightStats(); showToast('Logged! ⚖️'); }

function updateWeightStats(){ const log=D.weightLog||[]; const latest=[...log].sort((a,b)=>new Date(b.date)-new Date(a.date))[0]; const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;}; set('wCurDisp',latest?latest.weight+' lbs':'— lbs'); set('wGoalDisp',D.weightGoal?D.weightGoal+' lbs':'Not set'); if(latest&&D.weightGoal&&log.length>1){ const start=[...log].sort((a,b)=>new Date(a.date)-new Date(b.date))[0].weight; const lost=Math.max(0,start-latest.weight); const toGo=Math.max(0,latest.weight-D.weightGoal); const pct=D.weightGoal<start?Math.min(100,(lost/(start-D.weightGoal))*100):0; const b=document.getElementById('wProgFill'); if(b) b.style.width=pct.toFixed(0)+'%'; const l=document.getElementById('wProgLbl'); if(l) l.textContent=lost.toFixed(1)+' lbs lost · '+toGo.toFixed(1)+' to goal · '+pct.toFixed(0)+'%'; } }

function renderWeightList(){ const el=document.getElementById('wList'); if(!el) return; el.innerHTML=(D.weightLog||[]).slice(0,8).map(e=>`<div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.8rem;"><span style="color:#c8d4e8;">${e.date}</span><span style="font-weight:700;color:var(--c);">${e.weight} lbs</span><button class="db" onclick="D.weightLog=D.weightLog.filter(x=>x.id!=${e.id});save();renderWeightList();renderWeightChart();">✕</button></div>`).join(''); }

function renderWeightChart(){
  const canvas=document.getElementById('wCanvas'); if(!canvas) return;
  const log=[...(D.weightLog||[])].sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-30);
  const ctx=canvas.getContext('2d');
  const W=canvas.offsetWidth||400,H=260; canvas.width=W; canvas.height=H; ctx.clearRect(0,0,W,H);
  if(log.length<2){ctx.fillStyle='#6b7a99';ctx.font='13px Inter';ctx.textAlign='center';ctx.fillText('Log 2+ weights to see chart',W/2,H/2);return;}
  const weights=log.map(e=>e.weight),minW=Math.min(...weights)-3,maxW=Math.max(...weights)+3;
  // Extra top/bottom padding to fit labels
  const p={t:38,r:20,b:30,l:48},cW=W-p.l-p.r,cH=H-p.t-p.b;
  const tx=i=>p.l+(log.length===1?cW/2:i*(cW/(log.length-1)));
  const ty=w=>p.t+cH-(w-minW)*(cH/(maxW-minW));

  // Grid lines
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=p.t+(cH/4)*i;
    ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(W-p.r,y);ctx.stroke();
    ctx.fillStyle='#6b7a99';ctx.font='10px Inter';ctx.textAlign='right';
    ctx.fillText((maxW-(maxW-minW)*i/4).toFixed(0),p.l-4,y+4);
  }

  // Goal line
  if(D.weightGoal&&D.weightGoal>=minW&&D.weightGoal<=maxW){
    const gy=ty(D.weightGoal);
    ctx.strokeStyle='rgba(251,191,36,.5)';ctx.setLineDash([5,5]);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(p.l,gy);ctx.lineTo(W-p.r,gy);ctx.stroke();
    ctx.setLineDash([]);ctx.fillStyle='rgba(251,191,36,.85)';ctx.font='bold 10px Inter';
    ctx.textAlign='left';ctx.fillText('Goal: '+D.weightGoal,p.l+3,gy-4);
  }

  // Gradient fill under line
  const grad=ctx.createLinearGradient(0,p.t,0,H-p.b);
  grad.addColorStop(0,'rgba(56,189,248,.25)');grad.addColorStop(1,'rgba(56,189,248,0)');
  ctx.beginPath();ctx.moveTo(tx(0),ty(weights[0]));
  log.forEach((e,i)=>{if(i>0)ctx.lineTo(tx(i),ty(e.weight));});
  ctx.lineTo(tx(log.length-1),H-p.b);ctx.lineTo(tx(0),H-p.b);ctx.closePath();
  ctx.fillStyle=grad;ctx.fill();

  // Line
  ctx.strokeStyle='#38bdf8';ctx.lineWidth=2;ctx.setLineDash([]);
  ctx.beginPath();
  log.forEach((e,i)=>{i===0?ctx.moveTo(tx(i),ty(e.weight)):ctx.lineTo(tx(i),ty(e.weight));});
  ctx.stroke();

  // Dots + labels
  log.forEach((e,i)=>{
    const x=tx(i),y=ty(e.weight);

    // Outer dot
    ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='#38bdf8';ctx.fill();
    // Inner dot
    ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fillStyle='#0f1117';ctx.fill();

    // Label: alternate above/below based on index to reduce overlap
    // Also nudge closer to edges inward
    const labelAbove=i%2===0;
    const weight=e.weight+' lbs';
    // Shorten date: "2025-03-15" → "3/15"
    const parts=e.date.split('-');
    const shortDate=parts.length===3?parseInt(parts[1])+'/'+parseInt(parts[2]):e.date;

    const lx=Math.max(p.l+2,Math.min(W-p.r-2,x));

    if(labelAbove){
      // Label above dot
      ctx.fillStyle='#f0f4ff';ctx.font='bold 9px Inter';ctx.textAlign='center';
      ctx.fillText(weight,lx,y-10);
      ctx.fillStyle='#8090b0';ctx.font='8px Inter';
      ctx.fillText(shortDate,lx,y-2);
    } else {
      // Label below dot
      ctx.fillStyle='#f0f4ff';ctx.font='bold 9px Inter';ctx.textAlign='center';
      ctx.fillText(weight,lx,y+13);
      ctx.fillStyle='#8090b0';ctx.font='8px Inter';
      ctx.fillText(shortDate,lx,y+21);
    }
  });
}

function logFood(){ const item=(document.getElementById('foodName').value||'').trim(),cal=parseInt(document.getElementById('foodCal').value)||0,pro=parseInt(document.getElementById('foodPro').value)||0,carb=parseInt(document.getElementById('foodCarb').value)||0,fat=parseInt(document.getElementById('foodFat').value)||0; if(!item){showToast('Enter a food item');return;} if(!D.foodLog) D.foodLog=[]; D.foodLog.unshift({id:Date.now(),item,cal,pro,carb,fat,date:new Date().toDateString()}); ['foodName','foodCal','foodPro','foodCarb','foodFat'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';}); save(); renderFoodLog(); updateMacros(); showToast('Logged! 🥗'); }
function renderFoodLog(){ const el=document.getElementById('foodLog'); if(!el) return; const today=new Date().toDateString(); const tf=(D.foodLog||[]).filter(f=>f.date===today); if(!tf.length){el.innerHTML='<div style="font-size:.8rem;color:#c8d4e8;text-align:center;padding:.6rem;">No food logged today</div>';return;} el.innerHTML=tf.map(f=>`<div style="display:flex;align-items:center;gap:.55rem;padding:.48rem .7rem;background:rgba(255,255,255,.1);border-radius:8px;margin-bottom:.28rem;"><div style="flex:1;"><div style="font-weight:700;font-size:.85rem;">${escapeHtml(f.item)}</div><div style="font-size:.66rem;color:#c8d4e8;">${f.cal} cal · P:${f.pro}g · C:${f.carb}g · F:${f.fat}g</div></div><button class="db" onclick="D.foodLog=D.foodLog.filter(x=>x.id!=${f.id});save();renderFoodLog();updateMacros();">✕</button></div>`).join(''); }
function saveMacroGoals(){ D.macroGoals={cal:parseInt(document.getElementById('goalCal').value)||2000,pro:parseInt(document.getElementById('goalPro').value)||150,carb:parseInt(document.getElementById('goalCarb').value)||200,fat:parseInt(document.getElementById('goalFat').value)||65}; save(); updateMacros(); }
function updateMacros(){
  const today=new Date().toDateString(); const tf=(D.foodLog||[]).filter(f=>f.date===today);
  const tot=tf.reduce((a,f)=>({cal:a.cal+f.cal,pro:a.pro+f.pro,carb:a.carb+f.carb,fat:a.fat+f.fat}),{cal:0,pro:0,carb:0,fat:0});
  const g=D.macroGoals||{cal:2000,pro:150,carb:200,fat:65};
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set('totCal',tot.cal); set('totPro',tot.pro+'g');
  const sl=document.getElementById('macroSliders'); if(!sl) return;
  const bars=[{l:'Calories',v:tot.cal,m:g.cal,c:'var(--c)'},{l:'Protein',v:tot.pro,m:g.pro,c:'var(--gr)'},{l:'Carbs',v:tot.carb,m:g.carb,c:'var(--g)'},{l:'Fat',v:tot.fat,m:g.fat,c:'var(--or)'}];
  sl.innerHTML=bars.map(b=>`<div style="margin-bottom:.45rem;"><div style="display:flex;justify-content:space-between;font-size:.73rem;color:#c8d4e8;margin-bottom:.2rem;"><span>${b.l}</span><span style="color:${b.c};font-weight:700;">${b.v}/${b.m}${b.l==='Calories'?'':' g'}</span></div><div class="pt" style="height:6px;"><div class="pf" style="background:${b.c};width:${Math.min(100,(b.v/b.m)*100)}%;"></div></div></div>`).join('');
}
function renderHealthHabits(){ const el=document.getElementById('healthHabits'); if(!el) return; const today=new Date().toDateString(),td=(D.checkin||{})[today]||{},all=[...DEFAULT_HABITS,...(D.customHabits||[])]; el.innerHTML=all.map(h=>{const done=!!td[h.key];return `<div class="chi${done?' done':''}" data-key="${h.key}" onclick="toggleCheckin(this);renderHealthHabits();" style="position:relative;"><div style="width:20px;height:20px;border-radius:5px;border:2px solid ${done?'var(--gr)':'rgba(255,255,255,.25)'};background:${done?'var(--gr)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${done?'<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7L10 1" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</div><span style="flex:1;font-size:.82rem;">${h.label}</span></div>`}).join(''); }

// ═══════════════════════════════════════════════════════════════════
// Phase C-Health additions — 2026-05-15
// Mood check-in opener · Sleep tracker · Weekly PHQ-2 · Meal log
// Section accent: var(--section-health) #34d399
// ═══════════════════════════════════════════════════════════════════

// ── 1. MOOD CHECK-IN (section opener) ──────────────────────────────
const HEALTH_MOOD_OPTIONS = [
  {level:5, emoji:'🤩', label:'Great'},
  {level:4, emoji:'🙂', label:'Good'},
  {level:3, emoji:'😐', label:'Okay'},
  {level:2, emoji:'🙁', label:'Low'},
  {level:1, emoji:'😣', label:'Rough'}
];
const HEALTH_MOOD_RESPONSES = {
  5: "Love that. Carry it forward today.",
  4: "Solid day starting. Keep building.",
  3: "Okay is real — and okay. You're here.",
  2: "Tough start. Be kind to yourself today.",
  1: "Rough is real. You showed up. That counts."
};

function renderHealthMoodCheckin(){
  const el = document.getElementById('healthMoodCheckin');
  if(!el) return;
  const today = new Date().toISOString().slice(0,10);
  const moodArr = D.moods || [];
  const todayMood = moodArr.find(m => m.date === today);
  const opt = todayMood ? HEALTH_MOOD_OPTIONS.find(o => o.level === todayMood.level) : null;
  const head = '<div style="font-family:var(--fh);font-size:1.3rem;letter-spacing:.05em;color:var(--tx);margin-bottom:.4rem;">How are you feeling today?</div>';
  const ack = todayMood && opt
    ? '<div style="font-size:.85rem;color:var(--tx);margin-bottom:.5rem;line-height:1.5;"><span style="font-size:1.15rem;">'+opt.emoji+'</span> <b>'+opt.label+'</b> — '+(HEALTH_MOOD_RESPONSES[todayMood.level]||'')+'</div><div style="font-size:.73rem;color:var(--tx2);margin-bottom:.7rem;">Tap a face to change your check-in.</div>'
    : '<div style="font-size:.8rem;color:var(--tx2);margin-bottom:.7rem;">Pick what matches your day. There are no wrong answers.</div>';
  const grid = '<div class="health-mood-grid">'
    + HEALTH_MOOD_OPTIONS.map(o => {
        const active = todayMood && todayMood.level === o.level;
        return '<button type="button" class="health-mood-btn'+(active?' is-active':'')+'" onclick="logHealthMood('+o.level+')">'
          + '<span class="health-mood-emoji">'+o.emoji+'</span>'
          + '<span class="health-mood-label">'+o.label+'</span>'
        + '</button>';
      }).join('')
    + '</div>';
  // 2026-06-07 — Health Inc 1: scripture micro-line. Same tonal treatment
  // as Habits + Goals on the Life-tab Power Cards — italic Bebas, low
  // opacity, divider sweep above. Speaks to body stewardship without
  // overriding the secular mood flow.
  const faith = '<div class="health-mood-divider" aria-hidden="true"></div>'
    + '<div class="health-mood-faith">Your body is a temple. — 1 Cor 6:19</div>';
  el.innerHTML = head + ack + grid + faith;
}

function logHealthMood(level){
  if(!D.moods) D.moods = [];
  const today = new Date().toISOString().slice(0,10);
  const existing = D.moods.find(m => m.date === today);
  if(existing) existing.level = level;
  else D.moods.push({date:today, level, ts:Date.now()});
  if(D.moods.length > 365) D.moods = D.moods.slice(-365);
  save();
  renderHealthMoodCheckin();
  // FAF Inc 2 — mood logged. Same-day re-pick replaces the day's
  // entry, so we still log it (the parent might want to know the
  // kid revised the rating).
  if(typeof logFamilyActivity === 'function'){
    logFamilyActivity('health', 'mood_logged', 'Mood logged: ' + level + '/5');
  }
  if(typeof showToast === 'function') showToast('Logged ✓');
  // 2026-06-07 — Health Inc 5: milestone check (mood7).
  if(typeof _checkHealthMilestones === 'function') _checkHealthMilestones();
}

// ── 2. SLEEP TRACKER ───────────────────────────────────────────────
function logSleep(){
  const bed  = (document.getElementById('sleepBedtime')||{}).value || '';
  const wake = (document.getElementById('sleepWaketime')||{}).value || '';
  if(!bed || !wake){ showToast('Enter both bedtime and wake time'); return; }
  const [bH,bM] = bed.split(':').map(Number);
  const [wH,wM] = wake.split(':').map(Number);
  let hours = (wH + wM/60) - (bH + bM/60);
  if(hours < 0) hours += 24;
  hours = Math.round(hours * 10) / 10;
  const date = new Date().toISOString().slice(0,10);
  if(!D.sleepLog) D.sleepLog = [];
  D.sleepLog = D.sleepLog.filter(s => s.date !== date);
  D.sleepLog.unshift({id:Date.now(), date, bed, wake, hours});
  if(D.sleepLog.length > 90) D.sleepLog = D.sleepLog.slice(0, 90);
  save();
  const bI = document.getElementById('sleepBedtime'); if(bI) bI.value = '';
  const wI = document.getElementById('sleepWaketime'); if(wI) wI.value = '';
  renderSleepBars();
  renderSleepList();
  // FAF Inc 2 — sleep logged.
  if(typeof logFamilyActivity === 'function'){
    logFamilyActivity('health', 'sleep_logged', 'Sleep logged: ' + hours + 'h');
  }
  showToast('Sleep logged 💤');
  // 2026-06-07 — Health Inc 5: milestone check (sleep30).
  if(typeof _checkHealthMilestones === 'function') _checkHealthMilestones();
}

function renderSleepBars(){
  const el = document.getElementById('sleepChart');
  if(!el) return;
  const log = D.sleepLog || [];
  const today = new Date();
  const days = [];
  for(let i = 6; i >= 0; i--){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const entry = log.find(s => s.date === ds);
    days.push({ds, hours: entry ? entry.hours : 0, hasData: !!entry, dl: d.toLocaleDateString('en-US',{weekday:'short'})});
  }
  const maxH = 12;
  el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;align-items:end;height:160px;">'
    + days.map(d => {
        const pct = Math.max(2, (d.hours / maxH) * 100);
        const color = !d.hasData ? 'rgba(255,255,255,.06)'
                    : d.hours >= 8 ? 'var(--section-health)'
                    : d.hours >= 6 ? '#fbbf24' : '#ef4444';
        return '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;">'
          + '<div style="flex:1;display:flex;align-items:flex-end;width:100%;">'
          + '<div style="width:100%;background:'+color+';height:'+pct+'%;border-radius:6px 6px 2px 2px;transition:height .3s ease;"></div>'
          + '</div>'
          + '<div style="font-size:.62rem;color:var(--tx2);font-weight:600;">'+d.dl+'</div>'
          + '<div style="font-size:.7rem;font-weight:700;color:'+(d.hasData?'var(--tx)':'var(--tx2)')+';">'+(d.hasData?d.hours+'h':'—')+'</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

function renderSleepList(){
  const el = document.getElementById('sleepList');
  if(!el) return;
  const log = D.sleepLog || [];
  if(!log.length){
    el.innerHTML = '<div style="text-align:center;font-size:.8rem;color:var(--tx2);padding:1rem;">No sleep logged yet — log last night to start your chart.</div>';
    return;
  }
  el.innerHTML = log.slice(0,14).map(s =>
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:.45rem .7rem;background:rgba(255,255,255,.04);border-radius:8px;margin-bottom:.3rem;font-size:.78rem;">'
    + '<span style="color:var(--tx2);">'+s.date+'</span>'
    + '<span style="color:var(--tx2);">'+(s.bed||'')+' → '+(s.wake||'')+'</span>'
    + '<span style="font-weight:800;color:var(--section-health);font-family:var(--fn);">'+s.hours+'h</span>'
    + '</div>'
  ).join('');
}

// ── 3. PHQ-2 WEEKLY MIND CHECK-IN ──────────────────────────────────
let _phq2Choices = {1:null, 2:null};

function renderPhq2(){
  const el = document.getElementById('ht-mind');
  if(!el) return;
  _phq2Choices = {1:null, 2:null};
  const log = D.phq2Log || [];
  const last = log[0];
  const today = new Date();
  let daysSince = 999;
  if(last && last.date){
    const d = new Date(last.date);
    daysSince = Math.floor((today - d) / 86400000);
  }
  const due = daysSince >= 7;

  let html = '';
  if(due){
    html += '<div class="card" style="border-left:4px solid var(--section-health);">'
      + '<div class="ct" style="margin-bottom:.4rem;">💚 Weekly Mind Check-In</div>'
      + '<div style="font-size:.85rem;color:var(--tx2);margin-bottom:1rem;line-height:1.6;">Two questions about the past week. There are no right answers — just honest ones. This stays private on your device.</div>'
      + '<div style="font-size:.88rem;font-weight:600;margin-bottom:.55rem;color:var(--tx);">1. Over the past week, how often have you felt down or hopeless?</div>'
      + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:1.1rem;">'
      + ['Never','Sometimes','Often','Almost always'].map((lbl,i) =>
          '<button type="button" class="phq2-opt" data-q="1" data-v="'+i+'" onclick="phq2Pick(this)" style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.18);border-radius:9px;padding:9px 4px;font-size:.74rem;color:var(--tx);cursor:pointer;font-family:var(--fm);">'+lbl+'</button>'
        ).join('')
      + '</div>'
      + '<div style="font-size:.88rem;font-weight:600;margin-bottom:.55rem;color:var(--tx);">2. Over the past week, how often have you had little interest in things you usually enjoy?</div>'
      + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:1.1rem;">'
      + ['Never','Sometimes','Often','Almost always'].map((lbl,i) =>
          '<button type="button" class="phq2-opt" data-q="2" data-v="'+i+'" onclick="phq2Pick(this)" style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.18);border-radius:9px;padding:9px 4px;font-size:.74rem;color:var(--tx);cursor:pointer;font-family:var(--fm);">'+lbl+'</button>'
        ).join('')
      + '</div>'
      + '<button class="btn bp" style="width:100%;background:var(--section-health);border-color:var(--section-health);color:#0b1020;" onclick="submitPhq2()">Submit check-in</button>'
      + '</div>';
  } else {
    const nextDue = 7 - daysSince;
    html += '<div class="card" style="border-left:4px solid var(--section-health);">'
      + '<div class="ct">💚 Weekly Mind Check-In</div>'
      + '<div style="font-size:.85rem;color:var(--tx2);line-height:1.55;margin-bottom:.5rem;">Next check-in in <b style="color:var(--tx);">'+nextDue+' day'+(nextDue===1?'':'s')+'</b>. Once a week is enough — more often turns into self-monitoring noise.</div>';
    if(last){
      const total = (last.q1||0)+(last.q2||0);
      html += '<div style="font-size:.75rem;color:var(--tx3);">Last check-in: '+last.date+' — score '+total+'/6</div>';
    }
    html += '</div>';
  }

  if(log.length){
    html += '<div class="card" style="margin-top:.8rem;">'
      + '<div class="ct">📈 Check-In History</div>'
      + '<div style="display:flex;flex-direction:column;gap:6px;">'
      + log.slice(0,12).map(e => {
          const tot = (e.q1||0)+(e.q2||0);
          const col = tot >= 4 ? '#fbbf24' : 'var(--section-health)';
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.45rem .75rem;background:rgba(255,255,255,.04);border-radius:8px;font-size:.78rem;">'
            + '<span style="color:var(--tx2);">'+e.date+'</span>'
            + '<span style="font-weight:700;font-family:var(--fn);color:'+col+';">'+tot+'/6</span>'
            + '</div>';
        }).join('')
      + '</div></div>';
  }

  el.innerHTML = html;
}

function phq2Pick(btn){
  const q = btn.getAttribute('data-q');
  const v = parseInt(btn.getAttribute('data-v'));
  _phq2Choices[q] = v;
  document.querySelectorAll('.phq2-opt[data-q="'+q+'"]').forEach(b => {
    b.style.background = 'rgba(52,211,153,.06)';
    b.style.borderColor = 'rgba(52,211,153,.18)';
  });
  btn.style.background = 'rgba(52,211,153,.22)';
  btn.style.borderColor = 'var(--section-health)';
}

function submitPhq2(){
  if(_phq2Choices[1] === null || _phq2Choices[2] === null){
    showToast('Pick an option for each question');
    return;
  }
  if(!D.phq2Log) D.phq2Log = [];
  D.phq2Log.unshift({
    id: Date.now(),
    date: new Date().toISOString().slice(0,10),
    q1: _phq2Choices[1],
    q2: _phq2Choices[2]
  });
  if(D.phq2Log.length > 52) D.phq2Log = D.phq2Log.slice(0, 52);
  const high = _phq2Choices[1] >= 2 && _phq2Choices[2] >= 2;
  _phq2Choices = {1:null, 2:null};
  save();
  if(high){
    setTimeout(() => {
      alert(
        "Thanks for being honest about how you're feeling.\n\n"
        + "What you're feeling is real, and it's a lot to carry alone. "
        + "Talking to someone — a parent, school counselor, or any trusted adult — "
        + "often helps more than it feels like it will.\n\n"
        + "If you're in crisis or having thoughts of harming yourself, "
        + "call or text 988 (the Suicide & Crisis Lifeline). They're available "
        + "24/7, in English and Spanish. You don't have to go through this alone."
      );
    }, 250);
    showToast('Check-in logged. Take care today. 💚');
  } else {
    showToast('Check-in logged. 💚');
  }
  renderPhq2();
  // 2026-06-07 — Health Inc 5: milestone check (phq6).
  if(typeof _checkHealthMilestones === 'function') _checkHealthMilestones();
}

// ── 4. NUTRITION MEAL LOG ──────────────────────────────────────────
const MEAL_TYPES = [
  {key:'breakfast', emoji:'🌅', label:'Breakfast'},
  {key:'lunch',     emoji:'☀️', label:'Lunch'},
  {key:'dinner',    emoji:'🌙', label:'Dinner'},
  {key:'snack',     emoji:'🍎', label:'Snack'}
];

function renderMealLog(){
  const el = document.getElementById('ht-meals');
  if(!el) return;
  const today = new Date().toISOString().slice(0,10);
  const meals = D.foodMeals || [];
  const todayMeals = meals.filter(m => m.date === today);
  const streak = calcMealStreak();

  let html = '<div class="card" style="border-left:4px solid var(--section-health);margin-bottom:.85rem;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;flex-wrap:wrap;gap:.5rem;">'
    + '<div class="ct" style="margin:0;">🍽️ Today\'s Meals</div>'
    + '<div style="display:flex;align-items:center;gap:.4rem;background:rgba(52,211,153,.1);padding:.3rem .7rem;border-radius:99px;">'
    +   '<span style="font-size:1.05rem;">🔥</span>'
    +   '<span style="font-size:.78rem;font-weight:700;color:var(--section-health);">'+streak+' day streak</span>'
    + '</div></div>'
    + '<div style="font-size:.78rem;color:var(--tx2);margin-bottom:.85rem;line-height:1.55;">Just log what you ate — no calorie counting. Awareness is the win.</div>';

  MEAL_TYPES.forEach(t => {
    const entry = todayMeals.find(m => m.type === t.key);
    html += '<div style="display:flex;align-items:center;gap:.65rem;padding:.55rem .7rem;background:rgba(255,255,255,.04);border-radius:10px;margin-bottom:.35rem;">'
      + '<span style="font-size:1.2rem;">'+t.emoji+'</span>'
      + '<div style="flex:1;min-width:0;">'
      +   '<div style="font-size:.65rem;color:var(--tx2);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">'+t.label+'</div>'
      +   (entry
            ? '<div style="font-size:.85rem;color:var(--tx);font-weight:500;">'+escapeHtml(entry.item)+'</div>'
            : '<div style="font-size:.78rem;color:var(--tx3);font-style:italic;">Not logged yet</div>')
      + '</div>'
      + (entry
          ? '<button class="db" onclick="deleteMeal('+entry.id+')">✕</button>'
          : '<button class="btn bp bs" onclick="promptMeal(\''+t.key+'\')">+ Add</button>')
      + '</div>';
  });
  html += '</div>'
    + '<div class="card">'
    + '<div class="ct">📅 Last 7 Days</div>'
    + '<div id="mealWeekSummary"></div>'
    + '<div style="font-size:.74rem;color:var(--tx3);margin-top:.5rem;line-height:1.55;">Green = 3+ meals logged · Yellow = 1-2 · Gray = no log. The point is the streak, not the score.</div>'
    + '</div>';

  el.innerHTML = html;
  renderMealWeekSummary();
}

function promptMeal(type){
  const item = prompt('What did you have for '+type+'?');
  if(!item || !item.trim()) return;
  if(!D.foodMeals) D.foodMeals = [];
  const today = new Date().toISOString().slice(0,10);
  D.foodMeals = D.foodMeals.filter(m => !(m.date === today && m.type === type));
  D.foodMeals.unshift({id:Date.now(), date:today, type, item:item.trim()});
  if(D.foodMeals.length > 500) D.foodMeals = D.foodMeals.slice(0, 500);
  save();
  renderMealLog();
  showToast('Logged 🍽️');
  // 2026-06-07 — Health Inc 5: milestone check (meals7).
  if(typeof _checkHealthMilestones === 'function') _checkHealthMilestones();
}

function deleteMeal(id){
  D.foodMeals = (D.foodMeals || []).filter(m => m.id !== id);
  save();
  renderMealLog();
}

function calcMealStreak(){
  const meals = D.foodMeals || [];
  if(!meals.length) return 0;
  let streak = 0;
  const today = new Date();
  for(let i = 0; i < 60; i++){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    if(meals.some(m => m.date === ds)) streak++;
    else break;
  }
  return streak;
}

function renderMealWeekSummary(){
  const el = document.getElementById('mealWeekSummary');
  if(!el) return;
  const today = new Date();
  const meals = D.foodMeals || [];
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">';
  for(let i = 6; i >= 0; i--){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const count = meals.filter(m => m.date === ds).length;
    const dl = d.toLocaleDateString('en-US',{weekday:'short'});
    const dark = count >= 1;
    const color = count >= 3 ? 'var(--section-health)' : count >= 1 ? '#fbbf24' : 'rgba(255,255,255,.06)';
    const textCol = dark ? 'rgba(0,0,0,.85)' : 'var(--tx3)';
    html += '<div style="text-align:center;padding:.55rem 0;background:'+color+';border-radius:8px;">'
      + '<div style="font-size:.62rem;color:'+textCol+';font-weight:700;">'+dl+'</div>'
      + '<div style="font-size:1.05rem;font-weight:800;color:'+textCol+';margin-top:2px;">'+count+'</div>'
      + '</div>';
  }
  html += '</div>';
  el.innerHTML = html;
}

