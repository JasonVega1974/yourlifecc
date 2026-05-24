/* =============================================================
   traits.js — V1 Rebuild · Session 3 · Identity Traits System
   The 7-trait engine: each user action awards points toward one
   or more traits; crossing a threshold levels the trait up and
   fires a soft "you are now ___" affirmation card.

   Public surface (all attached to window so non-module callers in
   faith-zones.js / faith.js can reach them):
     TRAITS                      — canonical config map
     awardTrait(key, amount)     — add points, fire toast + level-up
     getTraitLevel(key, points)  — derive level [0..4] from points
     showTraitToast(key, amount) — small slide-up notice (2.5s)
     showTraitLevelUp(key, lvl)  — centered affirmation card (4s)
     renderGrowthCompact()       — top-3-traits widget for Zone 2
     openGrowthProfile()         — stub for the full 7-trait view
                                   (Session 5 wires the modal)

   State: D.traits = { courage:N, discipline:N, compassion:N,
                       wisdom:N, integrity:N, gratitude:N, faith:N }
   Persistence: save() (sync.js) — debounced cloudSync.
============================================================= */

var TRAITS = {
  courage:    { name:'Courage',    emoji:'⚔️',  desc:"You face hard things instead of avoiding them",         levels:['Timid','Trying','Brave','Bold','Fearless'] },
  discipline: { name:'Discipline', emoji:'💪',  desc:"You do what matters even when you don't feel like it",  levels:['Drifting','Trying','Consistent','Disciplined','Iron-willed'] },
  compassion: { name:'Compassion', emoji:'❤️',  desc:"You actually care about other people",                  levels:['Self-focused','Noticing','Caring','Generous','Servant-hearted'] },
  wisdom:     { name:'Wisdom',     emoji:'📖',  desc:"You seek understanding before you react",               levels:['Curious','Learning','Growing','Wise','Discerning'] },
  integrity:  { name:'Integrity',  emoji:'🛡️',  desc:"You do the right thing when no one is watching",       levels:['Shaky','Building','Steady','Trustworthy','Unshakeable'] },
  gratitude:  { name:'Gratitude',  emoji:'🌟',  desc:"You notice and name what's good",                       levels:['Unaware','Noticing','Thankful','Grateful','Overflowing'] },
  faith:      { name:'Faith',      emoji:'✝️',  desc:"You trust what you can't fully see",                   levels:['Questioning','Exploring','Believing','Trusting','Anchored'] }
};

var TRAIT_THRESHOLDS = [0, 50, 150, 350, 700];

// Per-trait per-level affirmation lines. Indexed by level [1..4]
// (level 0 is the default starting label — no affirmation needed
// for "you're at the start"). Each line is short, second-person,
// and avoids preachy language per the spec brief.
var TRAIT_AFFIRMATIONS = {
  courage:    ['', "Starting to try. That matters.",         "Choosing courage over comfort. That's rare.",   "Bold enough to lead. Keep going.",         "Fear has lost its grip on you."],
  discipline: ['', "Showing up. That's the start.",          "Consistency is a superpower. You're building it.","Discipline is your reputation now.",      "Iron will. Nothing stops you."],
  compassion: ['', "You're starting to notice people.",      "You see people. That changes everything.",       "Your generosity is shaping others.",       "You live to serve. That's Christlike."],
  wisdom:     ['', "Curiosity is wisdom's first step.",      "You're asking better questions.",                "Wisdom guides your choices now.",          "Others seek your counsel. Use it well."],
  integrity:  ['', "Building trust one choice at a time.",   "People can count on you.",                       "Your word is your bond.",                  "Unshakeable. This is who you are."],
  gratitude:  ['', "You're starting to notice the good.",    "Gratitude rewires the brain. You're doing it.",  "A grateful heart is a magnet for blessing.","Overflowing — and it spreads to everyone around you."],
  faith:      ['', "Honest questions are the start of real faith.", "Belief isn't certainty. It's showing up anyway.", "Your trust is becoming unshakeable.",  "Anchored. Nothing moves you from this."]
};

function _tEsc(s){
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function _tEnsure(){
  if (typeof D === 'undefined' || !D) return false;
  if (!D.traits || typeof D.traits !== 'object' || Array.isArray(D.traits)) D.traits = {};
  return true;
}

function getTraitLevel(key, points){
  // Derive level [0..4] from accumulated points using
  // TRAIT_THRESHOLDS = [0, 50, 150, 350, 700].
  if (typeof points !== 'number' || points < 0) points = 0;
  var level = 0;
  for (var i = 0; i < TRAIT_THRESHOLDS.length; i++){
    if (points >= TRAIT_THRESHOLDS[i]) level = i;
  }
  return level;
}

function awardTrait(traitKey, amount){
  if (!_tEnsure()) return;
  if (!TRAITS[traitKey]) return;
  if (typeof amount !== 'number' || amount <= 0) return;
  var prev = +D.traits[traitKey] || 0;
  var next = prev + amount;
  D.traits[traitKey] = next;
  var oldLevel = getTraitLevel(traitKey, prev);
  var newLevel = getTraitLevel(traitKey, next);
  showTraitToast(traitKey, amount);
  if (newLevel > oldLevel) showTraitLevelUp(traitKey, newLevel);
  if (typeof save === 'function') save();
  // Re-render the compact widget if it's mounted (zone 2 of faith).
  if (typeof renderGrowthCompact === 'function') {
    try { renderGrowthCompact(); } catch (e) {}
  }
}

function showTraitToast(traitKey, amount){
  var t = TRAITS[traitKey];
  if (!t || typeof document === 'undefined') return;
  var el = document.createElement('div');
  el.className = 'trait-toast';
  el.setAttribute('role', 'status');
  el.innerHTML = _tEsc(t.emoji) + ' <span>+' + amount + ' toward ' + _tEsc(t.name) + '</span>';
  document.body.appendChild(el);
  // rAF tick before adding the show-class so the transition runs.
  requestAnimationFrame(function(){ el.classList.add('trait-toast-show'); });
  setTimeout(function(){
    el.classList.remove('trait-toast-show');
    setTimeout(function(){ if (el && el.parentNode) el.parentNode.removeChild(el); }, 400);
  }, 2500);
}

function showTraitLevelUp(traitKey, newLevel){
  var t = TRAITS[traitKey];
  if (!t || typeof document === 'undefined') return;
  var levelName = t.levels[newLevel] || t.levels[t.levels.length - 1];
  var bank = TRAIT_AFFIRMATIONS[traitKey] || [];
  var msg  = bank[newLevel] || 'Keep growing.';
  var el = document.createElement('div');
  el.className = 'trait-levelup';
  el.setAttribute('role', 'status');
  el.innerHTML =
    '<div class="tlu-emoji" aria-hidden="true">' + _tEsc(t.emoji) + '</div>' +
    '<div class="tlu-title">' + _tEsc(t.name) + ' leveled up!</div>' +
    '<div class="tlu-level">You are now: <strong>' + _tEsc(levelName) + '</strong></div>' +
    '<div class="tlu-msg">' + _tEsc(msg) + '</div>';
  document.body.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('tlu-show'); });
  setTimeout(function(){
    el.classList.remove('tlu-show');
    setTimeout(function(){ if (el && el.parentNode) el.parentNode.removeChild(el); }, 500);
  }, 4000);
}

// Compact "YOUR GROWTH" widget — top 3 most-active traits with
// progress bars toward the next level. Lives at #fzGrowthCompact
// inside Zone 2 of the faith tab; rendered by renderTodayZone.
function renderGrowthCompact(){
  if (typeof document === 'undefined') return;
  var el = document.getElementById('fzGrowthCompact');
  if (!el) return;
  _tEnsure();
  var keys = Object.keys(TRAITS);
  // Sort by accumulated points so the user's most active traits
  // surface first. Ties broken by config order (stable sort in
  // modern browsers).
  keys.sort(function(a, b){
    var pa = +((D && D.traits && D.traits[a]) || 0);
    var pb = +((D && D.traits && D.traits[b]) || 0);
    return pb - pa;
  });
  var top = keys.slice(0, 3);

  var rows = top.map(function(key){
    var t = TRAITS[key];
    var pts = +((D && D.traits && D.traits[key]) || 0);
    var lvl = getTraitLevel(key, pts);
    // Progress is toward the NEXT threshold. At max level we cap at 100%.
    var nextIdx = Math.min(lvl + 1, TRAIT_THRESHOLDS.length - 1);
    var nextThresh = TRAIT_THRESHOLDS[nextIdx] || 1;
    var prevThresh = TRAIT_THRESHOLDS[lvl] || 0;
    var span = Math.max(1, nextThresh - prevThresh);
    var into = Math.max(0, pts - prevThresh);
    var pct = (lvl >= TRAIT_THRESHOLDS.length - 1)
      ? 100
      : Math.min(100, Math.round((into / span) * 100));
    var levelName = t.levels[lvl];
    return ''
      + '<div class="trait-bar-row">'
      +   '<span class="trait-bar-emoji" aria-hidden="true">' + _tEsc(t.emoji) + '</span>'
      +   '<div class="trait-bar-info">'
      +     '<div class="trait-bar-name">' + _tEsc(t.name)
      +       ' <span class="trait-level-name">' + _tEsc(levelName) + '</span></div>'
      +     '<div class="trait-bar-track" aria-hidden="true">'
      +       '<div class="trait-bar-fill" style="width:' + pct + '%"></div>'
      +     '</div>'
      +   '</div>'
      + '</div>';
  }).join('');

  el.innerHTML =
    '<div class="fz-card-hdr">YOUR GROWTH</div>'
    + (rows || '<div class="fz-empty" style="padding:.5rem 0;">Start engaging Convince Me, prayers, and challenges to see your traits grow.</div>')
    + '<div class="trait-see-all" onclick="openGrowthProfile()" role="button" tabindex="0">See all 7 traits →</div>';
}

// Session 5 will wire the full 7-trait modal. For now this stub
// surfaces a toast so the tap target gives feedback.
function openGrowthProfile(){
  if (typeof showToast === 'function'){
    showToast('Full growth profile arrives in Session 5');
  }
}

// Expose for non-module scripts that load after this one (faith.js,
// faith-zones.js, init.js all reach these via the global scope).
if (typeof window !== 'undefined'){
  window.TRAITS              = TRAITS;
  window.TRAIT_THRESHOLDS    = TRAIT_THRESHOLDS;
  window.awardTrait          = awardTrait;
  window.getTraitLevel       = getTraitLevel;
  window.showTraitToast      = showTraitToast;
  window.showTraitLevelUp    = showTraitLevelUp;
  window.renderGrowthCompact = renderGrowthCompact;
  window.openGrowthProfile   = openGrowthProfile;
}
