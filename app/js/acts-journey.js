// YourLife CC — ACTS Guided Prayer Journey (Wave 2 §2a, 2026-07-05)
// Four walked screens (Adoration → Confession → Thanksgiving →
// Supplication) mirroring First Light's staged-beat machine, then a
// finale that assembles the four fragments into one prayer.
// SETTLE register — a prayer written is not a quiz won: sfx.settle,
// no confetti, no XP fanfare; the 'prayer' quest metric bumps once/day
// through the persisted D.hcDaily throttle (wrapped in the quiet-moment
// flag so no XP juice fires). Reads ACTS_STARTERS (installed data);
// hues inherit the established ACTS_FRAMEWORK vocabulary — no third
// accent scheme. Draft auto-persists to D.actsSess so a mid-walk reload
// resumes; the journal gets ONE combined entry on Save, not four
// fragments.

// Movement order + hues (from ACTS_FRAMEWORK — the same colors the
// How-to-Pray grid already trains). light values chosen for paper.
var _ACTS_ORDER = ['adoration', 'confession', 'thanksgiving', 'supplication'];
var _ACTS_HUE = {
  adoration:    { hex: '#fbbf24', light: '#92400e' },
  confession:   { hex: '#a78bfa', light: '#6d28d9' },
  thanksgiving: { hex: '#22c55e', light: '#047857' },
  supplication: { hex: '#38bdf8', light: '#0369a1' }
};

var _actsBeat = 0;          // 0 = launcher; 1..4 = movements; 5 = finale
var _actsMoves = {};        // { adoration:'…', … } — in-flight draft

function _actsEsc(s){
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function _actsToday(){ return new Date().toISOString().slice(0, 10); }
function _actsData(){ return (typeof window !== 'undefined' && window.ACTS_STARTERS) || []; }
function _actsMovement(mv){ return _actsData().find(function(m){ return m.movement === mv; }) || null; }
function _actsReduced(){
  try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  catch(_e){ return false; }
}
function _actsSave(){ if(typeof save === 'function') save(); }

// Draft session state (DEF: data.js actsSess). Cleared on finale-save
// or a clean exit. Persisting mid-walk means a reload resumes.
function _actsSess(){
  if(typeof D === 'undefined' || !D) return { date: '', moves: {}, beat: 0 };
  var s = D.actsSess;
  if(!s || typeof s !== 'object' || Array.isArray(s)) s = D.actsSess = { date: '', moves: {}, beat: 0 };
  if(!s.moves || typeof s.moves !== 'object' || Array.isArray(s.moves)) s.moves = {};
  return s;
}
function _actsPersistDraft(){
  var s = _actsSess();
  s.date = _actsToday();
  s.moves = {}; _ACTS_ORDER.forEach(function(mv){ if(_actsMoves[mv]) s.moves[mv] = _actsMoves[mv]; });
  s.beat = _actsBeat;
  _actsSave();
}
function _actsClearDraft(){
  if(typeof D !== 'undefined' && D) D.actsSess = { date: '', moves: {}, beat: 0 };
  _actsSave();
}

// Date-seeded order for a movement's 3 starters (deterministic — the
// whole family sees the same arrangement; same idiom as First Light's
// daily pick). Rotates which starter leads without a bigger library.
function _actsStarterOrder(mv, starters){
  var day = Math.floor(Date.parse(_actsToday()) / 86400000);
  var offset = (day + mv.length) % starters.length;
  var out = [];
  for(var i = 0; i < starters.length; i++) out.push(starters[(i + offset) % starters.length]);
  return out;
}

// ── Launcher (rendered into #actsWalkHost by renderHowToPrayPane) ──
function renderActsLauncher(){
  var host = document.getElementById('actsWalkHost');
  if(!host) return;
  var s = _actsSess();
  var resume = (s.date === _actsToday() && Object.keys(s.moves).length > 0 && !s.moves.__done);
  host.innerHTML =
    '<div class="acts-launch">' +
      '<div class="acts-launch-eye">GUIDED · A · C · T · S</div>' +
      '<div class="acts-launch-title">Walk a full prayer</div>' +
      '<div class="acts-launch-sub">Four movements, a few quiet minutes. Your words, one at a time — Adoration, Confession, Thanksgiving, Supplication.</div>' +
      '<div class="acts-launch-row">' +
        '<button type="button" class="acts-cta" onclick="actsBegin(' + (resume ? 'true' : 'false') + ')">' + (resume ? 'Continue your prayer →' : 'Begin →') + '</button>' +
        (resume ? '<button type="button" class="acts-skipflow" onclick="actsRestart()">Start fresh</button>' : '') +
      '</div>' +
    '</div>';
}

// True while a walk/finale is on screen — lets renderHowToPrayPane
// avoid stomping a live walk on a pane re-render.
function _actsBeatActive(){ return _actsBeat > 0; }

function actsRestart(){ _actsMoves = {}; _actsClearDraft(); actsBegin(false); }

function actsBegin(resume){
  var host = document.getElementById('actsWalkHost');
  var stat = document.getElementById('actsHowtoStatic');
  if(!host) return;
  if(stat) stat.style.display = 'none';   // the walk takes the pane
  _actsMoves = {};
  if(resume){
    var s = _actsSess();
    _ACTS_ORDER.forEach(function(mv){ if(s.moves && s.moves[mv]) _actsMoves[mv] = s.moves[mv]; });
  }
  _actsBeat = 1;
  _actsRender();
  try { host.scrollIntoView({ block: 'start' }); } catch(_e){}
}

function _actsRender(){
  var host = document.getElementById('actsWalkHost');
  if(!host) return;
  if(_actsBeat === 5){ _actsRenderFinale(); return; }
  var mv = _ACTS_ORDER[_actsBeat - 1];
  var m = _actsMovement(mv);
  if(!m){ actsExit(); return; }
  var hue = _ACTS_HUE[mv] || { hex: '#fbbf24' };
  var esc = _actsEsc;
  // Scripture staged word-by-word (hc-vw) — read, then write.
  var words = String(m.scripture).split(/\s+/);
  var scr;
  if(words.length <= 26){
    var groups = [];
    for(var i = 0; i < words.length; i += 4) groups.push(words.slice(i, i + 4).join(' '));
    scr = '<blockquote class="acts-scr hc-verse-staged">' + groups.map(function(g, gi){
      return '<span class="hc-vw" style="animation-delay:' + (gi * 0.16).toFixed(2) + 's">' + esc(g) + ' </span>';
    }).join('') + '</blockquote>';
  } else {
    scr = '<blockquote class="acts-scr">' + esc(m.scripture) + '</blockquote>';
  }
  var existing = _actsMoves[mv] || '';
  var starters = _actsStarterOrder(mv, m.starters || []);
  var chips = starters.map(function(st, i){
    return '<button type="button" class="acts-starter" data-i="' + i + '" onclick="actsStarterTap(' + i + ')">' + esc(st) + '</button>';
  }).join('');
  // Progress arc (dl-ring idiom) filled to this movement in its hue.
  var arcDeg = Math.round((_actsBeat / 4) * 360);
  host.innerHTML =
    '<button type="button" class="acts-back" onclick="actsExit()">← Prayer</button>' +
    '<div class="acts-beat" style="--acts-hex:' + hue.hex + ';--acts-hex-l:' + (hue.light || hue.hex) + ';">' +
      '<div class="acts-ring-wrap" aria-hidden="true"><div class="acts-ring" style="--acts-arc:' + arcDeg + 'deg;"></div><div class="acts-ring-num">' + _actsBeat + '/4</div></div>' +
      '<div id="actsSr" class="acts-sr" aria-live="polite">Movement ' + _actsBeat + ' of 4: ' + esc(m.label) + '</div>' +
      '<div class="acts-eyebrow">' + esc(m.icon) + ' ' + esc(m.label) + '</div>' +
      '<div class="acts-settle-line">' + esc(m.prompt) + '</div>' +
      scr +
      '<textarea id="actsInput" class="acts-input" rows="3" maxlength="1200" placeholder="Your words…" oninput="actsInputChanged()">' + esc(existing) + '</textarea>' +
      '<div class="acts-starter-row" id="actsStarterRow">' + chips + '</div>' +
      '<div class="acts-line-row">' +
        '<button type="button" class="acts-skipflow" onclick="actsSkip()">Skip this one</button>' +
        '<button type="button" class="acts-cta acts-cta--inline" onclick="actsNext()">' + (_actsBeat < 4 ? 'Continue →' : 'See your prayer →') + '</button>' +
      '</div>' +
    '</div>';
  // Read, then write: do NOT auto-focus (popping the mobile keyboard
  // would shove the just-revealed scripture off-screen before it's
  // read — post-build review). The tap-to-write is the reader's own
  // gesture. Reset scroll on EVERY beat so each movement opens from
  // the same anchor, not wherever the last one was scrolled to.
  if(document.getElementById('actsInput')) _actsSyncStarters();
  try { host.scrollIntoView({ block: 'start' }); } catch(_e){}
}

// Starters insert ONLY when the textarea is empty — never silently
// overwrite typed words (a trust break). Once text exists, the chips
// recede.
function actsStarterTap(i){
  var inp = document.getElementById('actsInput');
  if(!inp) return;
  if(inp.value.trim()){ return; }   // guard: don't clobber
  var mv = _ACTS_ORDER[_actsBeat - 1];
  var m = _actsMovement(mv);
  var starters = _actsStarterOrder(mv, (m && m.starters) || []);
  inp.value = (starters[i] || '') + ' ';
  try { inp.focus(); } catch(_e){}
  _actsSyncStarters();
}
function actsInputChanged(){ _actsSyncStarters(); }
function _actsSyncStarters(){
  var inp = document.getElementById('actsInput');
  var row = document.getElementById('actsStarterRow');
  if(!inp || !row) return;
  row.classList.toggle('acts-starter-row--dim', !!inp.value.trim());
}

function _actsCapture(){
  var inp = document.getElementById('actsInput');
  var mv = _ACTS_ORDER[_actsBeat - 1];
  if(inp && mv){
    var v = inp.value.trim();
    if(v) _actsMoves[mv] = v; else delete _actsMoves[mv];
  }
  _actsPersistDraft();
}
function actsNext(){ _actsCapture(); _actsBeat = (_actsBeat < 4) ? _actsBeat + 1 : 5; _actsRender(); }
function actsSkip(){
  var mv = _ACTS_ORDER[_actsBeat - 1];
  if(mv) delete _actsMoves[mv];
  _actsPersistDraft();
  _actsBeat = (_actsBeat < 4) ? _actsBeat + 1 : 5;
  _actsRender();
}

// Assemble non-empty movements into one flowing prayer. Skipped
// movements are OMITTED entirely (no empty "Confession: —" block).
function _actsAssembled(){
  return _ACTS_ORDER.filter(function(mv){ return _actsMoves[mv]; }).map(function(mv){
    var m = _actsMovement(mv);
    var h = _ACTS_HUE[mv] || {};
    return { mv: mv, label: m ? m.label : mv, hue: h.hex || '#fbbf24', hueL: h.light || h.hex || '#92400e', text: _actsMoves[mv] };
  });
}

function _actsRenderFinale(){
  var host = document.getElementById('actsWalkHost');
  if(!host) return;
  var parts = _actsAssembled();
  var esc = _actsEsc;
  var body;
  if(!parts.length){
    // All four skipped — no empty card, no active Save. A grounding line.
    body = '<div class="acts-fin-quiet">Some nights the quiet is the prayer.</div>' +
      '<button type="button" class="acts-cta" onclick="actsExit()">Amen →</button>';
  } else {
    body = '<div class="acts-fin-prayer">' + parts.map(function(p){
      return '<div class="acts-fin-move" style="--acts-hex:' + p.hue + ';--acts-hex-l:' + p.hueL + ';">' +
        '<div class="acts-fin-lbl">' + esc(p.label) + '</div>' +
        '<div class="acts-fin-text">' + esc(p.text) + '</div>' +
      '</div>';
    }).join('') + '</div>' +
    '<div class="acts-fin-actions">' +
      '<button type="button" class="acts-cta" onclick="actsSaveJournal(this)">Save to journal</button>' +
      '<button type="button" class="acts-share" onclick="actsShareWall(this)">Share to wall (optional)</button>' +
      '<button type="button" class="acts-done" onclick="actsExit()">Done</button>' +
    '</div>';
  }
  host.innerHTML =
    '<button type="button" class="acts-back" onclick="actsExit()">← Prayer</button>' +
    '<div class="acts-fin" id="actsFin">' +
      '<div class="acts-eyebrow">Amen</div>' +
      '<div class="acts-fin-title">This was your prayer today.</div>' +
      body +
    '</div>';
  try { host.scrollIntoView({ block: 'start' }); } catch(_e){}
  // Settle — a prayer written is not a quiz won. One low bell, one
  // throttled quest bump (quiet-moment flag suppresses XP juice). Fires
  // once per finale reach.
  window._ylccQuietMoment = true;
  try {
    if(window.sfx && typeof window.sfx.settle === 'function' && parts.length) window.sfx.settle();
    if(parts.length && typeof window.walkQuestBump === 'function' && typeof _hcOnce === 'function' && _hcOnce('prayer')){
      window.walkQuestBump('prayer', 1);
    }
  } finally { window._ylccQuietMoment = false; }
  if(typeof logFaithActivity === 'function') try { logFaithActivity('prayer', { source: 'acts' }); } catch(_e){}
  // Quiet cross-fade in (not a dove — a settle, not a symbol).
  if(!_actsReduced()){
    var fin = document.getElementById('actsFin');
    if(fin){ fin.style.opacity = '0'; requestAnimationFrame(function(){ fin.style.transition = 'opacity .3s ease'; fin.style.opacity = '1'; }); }
  }
}

// Save = ONE combined entry into the Quick Prayer journal (source
// 'acts'), tagged. Not four fragments — the journal stays clean.
function actsSaveJournal(btn){
  var parts = _actsAssembled();
  if(!parts.length){ actsExit(); return; }
  var combined = parts.map(function(p){ return p.label + '\n' + p.text; }).join('\n\n');
  if(typeof D !== 'undefined' && D){
    if(!Array.isArray(D.quickPrayers)) D.quickPrayers = [];
    D.quickPrayers.push({
      text: combined, date: _actsToday(), source: 'acts',
      movements: parts.map(function(p){ return p.mv; }), ts: new Date().toISOString()
    });
    while(D.quickPrayers.length > 50) D.quickPrayers.shift();
    _actsSave();
  }
  _actsClearDraft();
  if(typeof showToast === 'function') showToast('Saved to your prayer journal 🙏');
  if(btn){ btn.textContent = '✓ Saved'; btn.disabled = true; }
  if(typeof renderQuickPrayerJournal === 'function') try { renderQuickPrayerJournal(); } catch(_e){}
}

// Share = optional, secondary. Direct insert to the community wall
// (mirrors prSubmitWallPost); needs an authenticated user.
function actsShareWall(btn){
  var parts = _actsAssembled();
  if(!parts.length) return;
  var text = parts.map(function(p){ return p.label + ': ' + p.text; }).join(' · ');
  if(text.length > 1000) text = text.slice(0, 1000);
  try {
    var supa = (typeof getSupabase === 'function') ? getSupabase() : null;
    if(!supa){ if(typeof showToast === 'function') showToast('Sharing is unavailable right now'); return; }
    supa.auth.getUser().then(function(res){
      var uid = res && res.data && res.data.user && res.data.user.id;
      if(!uid){ if(typeof showToast === 'function') showToast('Sign in to share to the wall'); return; }
      supa.from('prayer_requests').insert({ user_id: uid, text: text, type: 'request', category: 'acts', privacy: 'community' }).then(function(r){
        if(r && r.error){ if(typeof showToast === 'function') showToast('Could not share right now'); return; }
        if(typeof showToast === 'function') showToast('Shared to the prayer wall 🙏');
        if(btn){ btn.textContent = '✓ Shared'; btn.disabled = true; }
      });
    });
  } catch(_e){ if(typeof showToast === 'function') showToast('Could not share right now'); }
}

function actsExit(){
  _actsBeat = 0;
  var host = document.getElementById('actsWalkHost');
  var stat = document.getElementById('actsHowtoStatic');
  if(stat) stat.style.display = '';
  renderActsLauncher();
  if(host){ try { host.scrollIntoView({ block: 'start' }); } catch(_e){} }
}
