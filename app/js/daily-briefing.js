/* =============================================================
   daily-briefing.js — V1 Rebuild · Session 1
   The single Daily Briefing card at the top of the home screen.

   What it renders:
     - Time-aware greeting (morning / afternoon / evening) + first name
     - Streak flame with 4 size/glow tiers (small / medium / large / epic)
       sourced from getScriptureStreak() with a D.streak fallback
     - Daily 3 tiles (Faith mystery / Growth / Real-Life Win) wired to the
       sections that hold those features today; Sessions 2-4 will swap the
       routes as the new features land.
     - Trait momentum placeholder — reads D.traits if it exists (Session 3
       wires the real seven-trait engine), otherwise shows Discipline at
       14% so the card has the correct visual shape on day 1.
     - Night Reflection prompt that only appears after 7pm local. Stub
       handler until Session 2 ships the overlay.

   State: D.dailyThree[YYYY-MM-DD] = { faith:bool, growth:bool, realWin:bool }
   Persistence: save() (sync.js) — debounced cloudSync on every flip.
============================================================= */

function _dbToday() {
  return new Date().toISOString().slice(0, 10);
}

function _dbTimeOfDay() {
  var h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function _dbFirstName() {
  if (typeof D !== 'undefined' && D && D.name) {
    return String(D.name).split(' ')[0];
  }
  if (typeof _supaUser !== 'undefined' && _supaUser) {
    var meta = _supaUser.user_metadata || {};
    if (meta.first_name) return meta.first_name;
    if (meta.full_name)  return String(meta.full_name).split(' ')[0];
    if (_supaUser.email) return _supaUser.email.split('@')[0];
  }
  return 'friend';
}

function _dbStreakDays() {
  if (typeof getScriptureStreak === 'function') {
    var n = getScriptureStreak();
    if (typeof n === 'number' && n >= 0) return n;
  }
  if (typeof D !== 'undefined' && D && typeof D.streak === 'number') return D.streak;
  return 0;
}

function _dbFlameTier(days) {
  if (days >= 30) return 'epic';
  if (days >= 14) return 'large';
  if (days >= 7)  return 'medium';
  return 'small';
}

function _dbState() {
  if (typeof D === 'undefined' || !D) return { faith:false, growth:false, realWin:false };
  if (!D.dailyThree || typeof D.dailyThree !== 'object' || Array.isArray(D.dailyThree)) {
    D.dailyThree = {};
  }
  var key = _dbToday();
  if (!D.dailyThree[key]) D.dailyThree[key] = { faith:false, growth:false, realWin:false };
  return D.dailyThree[key];
}

function _dbAllDone(state) {
  return !!(state && state.faith && state.growth && state.realWin);
}

function _dbCurrentTrait() {
  var EMOJI = { courage:'⚔️', discipline:'💪', compassion:'❤️', wisdom:'📖',
                integrity:'🛡️', gratitude:'🌟', faith:'✝️' };
  if (typeof D !== 'undefined' && D && D.traits && typeof D.traits === 'object') {
    var leading = null, leadVal = -1;
    Object.keys(D.traits).forEach(function(k){
      var v = +D.traits[k] || 0;
      if (v > leadVal) { leadVal = v; leading = k; }
    });
    if (leading) {
      var pct = Math.min(100, Math.max(4, (leadVal % 20) * 5));
      var label = leading.charAt(0).toUpperCase() + leading.slice(1);
      return { name: label, emoji: EMOJI[leading] || '•', pct: pct };
    }
  }
  return { name:'Discipline', emoji:'💪', pct:14 };
}

function renderDailyBriefing() {
  var card = document.getElementById('dailyBriefingCard');
  if (!card) return;
  // Hide on parent surface (the parent dashboard owns its own greeting) and
  // on the faith-free cinematic hero (which is full-bleed by design).
  if (document.body && document.body.classList.contains('parent-view')) {
    card.style.display = 'none';
    return;
  }
  if (window._faithFree) {
    card.style.display = 'none';
    return;
  }
  card.style.display = '';

  var gt = document.getElementById('dbGreetTime');
  if (gt) gt.textContent = _dbTimeOfDay();
  var gn = document.getElementById('dbGreetName');
  if (gn) gn.textContent = _dbFirstName();

  var days = _dbStreakDays();
  var tier = _dbFlameTier(days);
  var dn = document.getElementById('dbStreakN');
  if (dn) dn.textContent = String(days);
  var flame = document.getElementById('dbFlame');
  if (flame) {
    flame.classList.remove('db-flame-small','db-flame-medium','db-flame-large','db-flame-epic');
    flame.classList.add('db-flame-' + tier);
  }

  var state = _dbState();
  ['faith','growth','realWin'].forEach(function(slot){
    var tile = card.querySelector('.db-tile[data-slot="'+slot+'"]');
    if (!tile) return;
    var done = !!state[slot];
    tile.classList.toggle('db-tile-done', done);
    tile.setAttribute('aria-pressed', done ? 'true' : 'false');
  });
  var done = _dbAllDone(state);
  var completeEl = document.getElementById('dbComplete');
  if (completeEl) completeEl.style.display = done ? '' : 'none';

  var t = _dbCurrentTrait();
  var tn = document.getElementById('dbTraitName');
  if (tn) tn.textContent = t.name + ' ' + t.emoji;
  var tf = document.getElementById('dbTraitFill');
  if (tf) tf.style.width = t.pct + '%';

  var h = new Date().getHours();
  var ref = document.getElementById('dbReflect');
  if (ref) {
    ref.style.display = h >= 19 ? '' : 'none';
    // V1 Rebuild · Session 2 — gentle pulse after 8pm to draw attention
    // to the Night Reflection entry point without nagging earlier in the
    // evening when the user might still be active.
    ref.classList.toggle('db-reflect-pulse', h >= 20);
  }
}

// First tap navigates AND credits the tile. The spec is explicit: tap →
// navigate; completion shows the green check + fill animation. We mark
// complete on the navigating tap so users get credit for engaging, not
// only for returning home after the fact.
function dbTileTap(slot) {
  if (!slot) return;
  var state = _dbState();
  var wasDone = !!state[slot];

  try {
    if (slot === 'faith') {
      if (typeof showSection === 'function') showSection('s-scripture');
      if (typeof bfTab === 'function') {
        setTimeout(function(){ bfTab('proofProphecy'); }, 80);
      }
    } else if (slot === 'growth') {
      if (typeof showSection === 'function') showSection('s-health');
    } else if (slot === 'realWin') {
      if (typeof showSection === 'function') showSection('s-contests');
    }
  } catch (e) { /* navigation failure shouldn't block credit */ }

  if (!wasDone) {
    state[slot] = true;
    if (typeof save === 'function') save();
  }

  setTimeout(renderDailyBriefing, 50);

  if (!wasDone && _dbAllDone(state)) {
    setTimeout(_dbConfettiBurst, 280);
    if (typeof showToast === 'function') showToast('Day complete! 🎉');
  }
}

function _dbConfettiBurst() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var card = document.getElementById('dailyBriefingCard');
  if (!card) return;
  var host = document.createElement('div');
  host.className = 'db-confetti-host';
  card.appendChild(host);
  var colors = ['#fbbf24','#34d399','#38bdf8','#f87171','#a78bfa','#fef3c7'];
  for (var i = 0; i < 18; i++) {
    var p = document.createElement('span');
    p.className = 'db-confetti';
    p.style.left = (5 + Math.random()*90) + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.floor(Math.random()*120) + 'ms';
    p.style.animationDuration = (1100 + Math.floor(Math.random()*600)) + 'ms';
    host.appendChild(p);
  }
  setTimeout(function(){
    if (host && host.parentNode) host.parentNode.removeChild(host);
  }, 2200);
}

// V1 Rebuild · Session 2 — routes the Daily Briefing prompt into the
// real Night Reflection overlay (mood → rotating question → optional
// prayer). Falls back to a toast if the faith-zones module isn't loaded.
function dbOpenNightReflect() {
  if (typeof openNightReflect === 'function') {
    openNightReflect();
    return;
  }
  if (typeof showToast === 'function') {
    showToast('Night Reflection unavailable — reload the app');
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden) renderDailyBriefing();
  });
}
