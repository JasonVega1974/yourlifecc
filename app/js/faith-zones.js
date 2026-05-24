/* =============================================================
   faith-zones.js — V1 Rebuild · Faith Tab Redesign
   The 3-zone rebuild of #s-scripture.

     ZONE 1 — Convince Me hero (#fzZone1)
       Flip-card deck driven by CONVINCE_ME_DECK (data/faith-zones-data.js).
       Front: curiosity question + CTA. Back: answer + bullets + closer.
       Swipe left = next, swipe right = previous (mobile). Dig Deeper opens
       the matching Proof & Prophecy entry. Curiosity streak ticks once per
       local day on any card engagement.

     ZONE 2 — Today (#fzZone2)
       Three stacked cards:
         A. Daily Faith Challenge — rotates through FAITH_CHALLENGES by
            day-of-year. Tap "Mark Complete" → D.faithChallenges[YYYY-MM-DD].
         B. Quick Prayer — taps open the new overlay (#quickPrayerOverlay).
            Submit pushes to D.quickPrayers[] (cap 50) and animates 🕊️ up.
         C. Mood + Soundscape — 5 mood emoji buttons (D.faithMood) and
            three soundscape pills (visual toggle + toast — audio layer
            ships separately per AUDIO_LAYER_SPEC).

     ZONE 3 — Explore collapse (#fzZone3Wrap)
       Wraps the legacy Ask Scripture card + .scrTabs + every bf-* panel.
       Default collapsed. Persisted in D.faithExploreOpen. Auto-expanded
       on deep-link into any non-'home' sub-tab via the bfTab hook in
       faith.js.
============================================================= */

// ── Shared helpers ────────────────────────────────────────────
function _fzToday(){ return new Date().toISOString().slice(0,10); }
function _fzEsc(s){
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function _fzSave(){ if (typeof save === 'function') save(); }

// ════════════════════════════════════════════════════════════
// ZONE 1 — Convince Me hero
// ════════════════════════════════════════════════════════════

var _fzDeckOrder = null;   // shuffled list of indices into CONVINCE_ME_DECK
var _fzDeckIdx = 0;        // current position within _fzDeckOrder
var _fzFlipped = false;    // current card's face state
var _fzSwipeStart = null;  // { x, y, t } for the active touch

function _fzShuffle(arr){
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function _fzBuildDeckOrder(){
  if (typeof CONVINCE_ME_DECK === 'undefined') return [];
  var seen = (D && Array.isArray(D.convinceMeSeen)) ? D.convinceMeSeen : [];
  var unseen = [];
  for (var i = 0; i < CONVINCE_ME_DECK.length; i++){
    if (seen.indexOf(CONVINCE_ME_DECK[i].id) === -1) unseen.push(i);
  }
  // Once every card has been seen we reshuffle the full deck and reset
  // the seen list so the carousel keeps rotating instead of stalling.
  if (unseen.length === 0){
    if (D) D.convinceMeSeen = [];
    unseen = CONVINCE_ME_DECK.map(function(_, idx){ return idx; });
  }
  return _fzShuffle(unseen);
}

function _fzCurrentCard(){
  if (!_fzDeckOrder || !_fzDeckOrder.length){
    _fzDeckOrder = _fzBuildDeckOrder();
    _fzDeckIdx = 0;
  }
  if (typeof CONVINCE_ME_DECK === 'undefined') return null;
  var idx = _fzDeckOrder[_fzDeckIdx % _fzDeckOrder.length];
  return CONVINCE_ME_DECK[idx];
}

function _fzCuriosityCredit(){
  var today = _fzToday();
  if (!D) return;
  if (D.faithCuriosityLastDate === today) return;
  // Same-streak window: yesterday → continue; otherwise reset to 1.
  var yest = new Date(); yest.setDate(yest.getDate() - 1);
  var yestKey = yest.toISOString().slice(0,10);
  if (D.faithCuriosityLastDate === yestKey){
    D.faithCuriosityStreak = (D.faithCuriosityStreak || 0) + 1;
  } else {
    D.faithCuriosityStreak = 1;
  }
  D.faithCuriosityLastDate = today;
  _fzSave();
}

function renderConvinceMeHero(){
  var host = document.getElementById('fzZone1');
  if (!host) return;
  var card = _fzCurrentCard();
  if (!card){
    host.innerHTML = '<div class="fz-empty">Convince Me deck is loading…</div>';
    return;
  }
  var streak = (D && D.faithCuriosityStreak) || 0;
  var totalCards = (typeof CONVINCE_ME_DECK !== 'undefined') ? CONVINCE_ME_DECK.length : 0;
  var positionLabel = 'Mystery ' + ((_fzDeckIdx % _fzDeckOrder.length) + 1) + ' of ' + totalCards;
  var streakBadge = streak > 0
    ? '<span class="fz-streak">🔥 ' + streak + ' day curiosity streak</span>'
    : '';

  var bullets = card.bullets.map(function(b){
    return '<li>' + _fzEsc(b) + '</li>';
  }).join('');

  host.innerHTML =
    '<div class="cm-card-container' + (_fzFlipped ? ' flipped' : '') + '" id="cmCardContainer">' +
      '<div class="cm-card-inner">' +
        '<div class="cm-card-face cm-card-front">' +
          '<div class="cm-pill">' + _fzEsc(card.icon) + ' ' + _fzEsc(card.cat) + '</div>' +
          '<div class="cm-question">' + _fzEsc(card.q) + '</div>' +
          '<button type="button" class="cm-cta" onclick="cmFlip()">I\'m Curious →</button>' +
          '<div class="cm-foot">' +
            '<div class="cm-dots" aria-hidden="true">' + _fzRenderDots() + '</div>' +
            '<div class="cm-foot-row">' +
              '<span class="cm-pos">' + positionLabel + '</span>' +
              '<button type="button" class="cm-skip" onclick="cmNext()">Skip →</button>' +
            '</div>' +
            streakBadge +
          '</div>' +
          '<div class="cm-swipe-hint" aria-hidden="true">← swipe →</div>' +
        '</div>' +
        '<div class="cm-card-face cm-card-back">' +
          '<div class="cm-back-icon">' + _fzEsc(card.icon) + '</div>' +
          '<div class="cm-back-headline">' + _fzEsc(card.headline) + '</div>' +
          '<ul class="cm-back-bullets">' + bullets + '</ul>' +
          '<div class="cm-back-closer">' + _fzEsc(card.closer) + '</div>' +
          '<div class="cm-back-actions">' +
            '<button type="button" class="cm-back-btn" onclick="cmFlipBack()">← Back</button>' +
            '<button type="button" class="cm-back-btn cm-dig" onclick="cmDigDeeper()">Dig Deeper 📖</button>' +
            '<button type="button" class="cm-back-btn cm-next" onclick="cmNext()">Next Mystery →</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="cm-dig-drawer" id="cmDigDrawer" style="display:none;"></div>';

  _fzAttachSwipe();
}

function _fzRenderDots(){
  if (!_fzDeckOrder || !_fzDeckOrder.length) return '';
  // Show up to 5 dots — too many becomes noise on small screens.
  var count = Math.min(5, _fzDeckOrder.length);
  var active = _fzDeckIdx % count;
  var dots = '';
  for (var i = 0; i < count; i++){
    dots += '<span class="cm-dot' + (i === active ? ' active' : '') + '"></span>';
  }
  return dots;
}

function cmFlip(){
  var card = _fzCurrentCard();
  if (!card) return;
  if (!_fzFlipped){
    _fzFlipped = true;
    // Mark this id as seen + tick the curiosity streak the first time
    // the user actually engages a card today.
    if (D && Array.isArray(D.convinceMeSeen) && D.convinceMeSeen.indexOf(card.id) === -1){
      D.convinceMeSeen.push(card.id);
    }
    _fzCuriosityCredit();
    _fzSave();
  }
  var container = document.getElementById('cmCardContainer');
  if (container) container.classList.add('flipped');
}

function cmFlipBack(){
  _fzFlipped = false;
  var container = document.getElementById('cmCardContainer');
  if (container) container.classList.remove('flipped');
  var drawer = document.getElementById('cmDigDrawer');
  if (drawer){ drawer.style.display = 'none'; drawer.innerHTML = ''; }
}

function cmNext(){
  if (!_fzDeckOrder || !_fzDeckOrder.length) _fzDeckOrder = _fzBuildDeckOrder();
  _fzDeckIdx++;
  // Reshuffle when we've cycled through this run.
  if (_fzDeckIdx >= _fzDeckOrder.length){
    _fzDeckOrder = _fzBuildDeckOrder();
    _fzDeckIdx = 0;
  }
  _fzFlipped = false;
  renderConvinceMeHero();
}

function cmPrev(){
  if (!_fzDeckOrder || !_fzDeckOrder.length) _fzDeckOrder = _fzBuildDeckOrder();
  _fzDeckIdx = (_fzDeckIdx - 1 + _fzDeckOrder.length) % _fzDeckOrder.length;
  _fzFlipped = false;
  renderConvinceMeHero();
}

function cmDigDeeper(){
  var card = _fzCurrentCard();
  if (!card) return;
  var drawer = document.getElementById('cmDigDrawer');
  if (!drawer) return;

  var proof = null;
  if (card.proofId && typeof PROOF_PROPHECY_DATA !== 'undefined'){
    for (var i = 0; i < PROOF_PROPHECY_DATA.length; i++){
      if (PROOF_PROPHECY_DATA[i].id === card.proofId){ proof = PROOF_PROPHECY_DATA[i]; break; }
    }
  }

  if (!proof){
    drawer.innerHTML =
      '<div class="cm-dig-empty">' +
        '<div class="cm-dig-empty-icon">📖</div>' +
        '<div class="cm-dig-empty-title">Deeper dive coming soon</div>' +
        '<div class="cm-dig-empty-body">This card is part of the curiosity rotation. The full long-form proof for this question is being written and will appear here as soon as it ships.</div>' +
        '<button type="button" class="cm-back-btn" onclick="cmCloseDrawer()">Close</button>' +
      '</div>';
  } else {
    var detail = (proof.detail || '').split(/\n\n+/).map(function(p){
      return '<p>' + _fzEsc(p) + '</p>';
    }).join('');
    drawer.innerHTML =
      '<div class="cm-dig-card">' +
        '<div class="cm-dig-eyebrow">' + _fzEsc(proof.category || '') + '</div>' +
        '<div class="cm-dig-title">' + _fzEsc(proof.title || '') + '</div>' +
        '<div class="cm-dig-detail">' + detail + '</div>' +
        (proof.scripture ? '<div class="cm-dig-scripture"><span>Scripture:</span> ' + _fzEsc(proof.scripture) + '</div>' : '') +
        (proof.source    ? '<div class="cm-dig-source"><span>Source:</span> ' + _fzEsc(proof.source) + '</div>' : '') +
        '<div class="cm-dig-actions">' +
          '<button type="button" class="cm-back-btn" onclick="cmCloseDrawer()">Close</button>' +
          '<button type="button" class="cm-back-btn cm-next" onclick="cmOpenFullProof(\'' + _fzEsc(proof.id) + '\')">Open Full Proof →</button>' +
        '</div>' +
      '</div>';
  }
  drawer.style.display = '';
  setTimeout(function(){ drawer.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, 40);
}

function cmCloseDrawer(){
  var drawer = document.getElementById('cmDigDrawer');
  if (drawer){ drawer.style.display = 'none'; drawer.innerHTML = ''; }
}

function cmOpenFullProof(proofId){
  if (!proofId) return;
  toggleFaithExplore(true);
  if (typeof bfTab === 'function') bfTab('proofProphecy');
  setTimeout(function(){
    if (typeof ppOpenModal === 'function') ppOpenModal(proofId);
  }, 120);
}

// ── Swipe handling (touch only — mouse uses the Skip / Next buttons) ──
function _fzAttachSwipe(){
  var container = document.getElementById('cmCardContainer');
  if (!container) return;
  container.addEventListener('touchstart', _fzOnTouchStart, { passive:true });
  container.addEventListener('touchend',   _fzOnTouchEnd,   { passive:true });
}

function _fzOnTouchStart(e){
  if (!e.touches || !e.touches.length) return;
  var t = e.touches[0];
  _fzSwipeStart = { x:t.clientX, y:t.clientY, t:Date.now() };
}

function _fzOnTouchEnd(e){
  if (!_fzSwipeStart || !e.changedTouches || !e.changedTouches.length) {
    _fzSwipeStart = null; return;
  }
  var t = e.changedTouches[0];
  var dx = t.clientX - _fzSwipeStart.x;
  var dy = t.clientY - _fzSwipeStart.y;
  var dt = Date.now() - _fzSwipeStart.t;
  _fzSwipeStart = null;
  // Ignore long-press + heavy vertical motion (likely a scroll, not a swipe).
  if (dt > 600) return;
  if (Math.abs(dy) > Math.abs(dx)) return;
  if (Math.abs(dx) < 50) return;
  // When the card's back face is showing, a right-swipe acts as the
  // "close gesture" — flip back to the question instead of routing to
  // the previous card. Left-swipe always advances regardless of face.
  if (_fzFlipped && dx > 0) { cmFlipBack(); return; }
  if (dx < 0) cmNext(); else cmPrev();
}

// ════════════════════════════════════════════════════════════
// ZONE 2 — Today
// ════════════════════════════════════════════════════════════

function _fzDayOfYear(){
  var d = new Date();
  var start = new Date(d.getFullYear(), 0, 0);
  var diff = d - start;
  return Math.floor(diff / 86400000);
}

function _fzChallengeForToday(){
  if (typeof FAITH_CHALLENGES === 'undefined' || !FAITH_CHALLENGES.length) return null;
  return FAITH_CHALLENGES[_fzDayOfYear() % FAITH_CHALLENGES.length];
}

function renderTodayZone(){
  var host = document.getElementById('fzZone2');
  if (!host) return;
  renderDailyChallengeCard();
  renderQuickPrayerCard();
  renderMoodSoundscapeCard();
}

function renderDailyChallengeCard(){
  var host = document.getElementById('fzChallengeCard');
  if (!host) return;
  var ch = _fzChallengeForToday();
  if (!ch){ host.innerHTML = ''; return; }
  var done = !!(D && D.faithChallenges && D.faithChallenges[_fzToday()]);
  host.classList.toggle('fz-done', done);
  host.innerHTML =
    '<div class="fz-card-hdr">TODAY\'S CHALLENGE</div>' +
    '<div class="fz-ch-row">' +
      '<div class="fz-ch-emoji">' + _fzEsc(ch.emoji) + '</div>' +
      '<div class="fz-ch-text">' + _fzEsc(ch.text) + '</div>' +
    '</div>' +
    '<button type="button" class="fz-ch-btn" onclick="markChallengeComplete()" ' +
      (done ? 'disabled' : '') + '>' +
      (done ? 'Completed ✓' : 'Mark Complete ✓') +
    '</button>';
}

function markChallengeComplete(){
  if (!D) return;
  if (!D.faithChallenges || typeof D.faithChallenges !== 'object' || Array.isArray(D.faithChallenges)){
    D.faithChallenges = {};
  }
  var key = _fzToday();
  if (D.faithChallenges[key]) return;
  D.faithChallenges[key] = true;
  _fzSave();
  renderDailyChallengeCard();
  var ch = _fzChallengeForToday();
  if (typeof showToast === 'function'){
    showToast('+1 toward ' + (ch && ch.trait ? ch.trait : 'growth'));
  }
}

function renderQuickPrayerCard(){
  var host = document.getElementById('fzPrayerCard');
  if (!host) return;
  var monthKey = _fzToday().slice(0, 7);
  var count = 0;
  if (D && Array.isArray(D.quickPrayers)){
    for (var i = 0; i < D.quickPrayers.length; i++){
      var p = D.quickPrayers[i];
      if (p && p.date && p.date.slice(0,7) === monthKey) count++;
    }
  }
  host.innerHTML =
    '<div class="fz-card-hdr">QUICK PRAYER</div>' +
    '<div class="fz-pr-prompt">What\'s on your heart right now?</div>' +
    '<div class="fz-pr-meta">' + (count > 0 ? '🙏 ' + count + ' prayer' + (count === 1 ? '' : 's') + ' this month' : 'Tap anywhere to start') + '</div>';
  host.onclick = openQuickPrayer;
}

function openQuickPrayer(){
  var overlay = document.getElementById('quickPrayerOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.classList.add('modal-open');
  setTimeout(function(){
    var ta = document.getElementById('quickPrayerText');
    if (ta){ ta.value = ''; ta.focus(); }
  }, 80);
}

function closeQuickPrayer(){
  var overlay = document.getElementById('quickPrayerOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  if (!document.querySelector('.mo.open, #ppModal.open, #ppConvinceModal.open')){
    document.body.classList.remove('modal-open');
  }
}

function submitQuickPrayer(){
  var ta = document.getElementById('quickPrayerText');
  var text = ta ? String(ta.value || '').trim() : '';
  if (!text){
    if (typeof showToast === 'function') showToast('Add a few words first');
    if (ta) ta.focus();
    return;
  }
  if (!D) return;
  if (!Array.isArray(D.quickPrayers)) D.quickPrayers = [];
  D.quickPrayers.push({ text:text.slice(0, 600), date:_fzToday() });
  // Cap to the most recent 50 entries to keep the cloud blob lean.
  if (D.quickPrayers.length > 50){
    D.quickPrayers = D.quickPrayers.slice(-50);
  }
  _fzSave();
  _fzFloatDove(document.getElementById('quickPrayerSubmit'));
  setTimeout(function(){
    closeQuickPrayer();
    renderQuickPrayerCard();
  }, 700);
}

function _fzFloatDove(originBtn){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var dove = document.createElement('div');
  dove.className = 'fz-dove';
  dove.textContent = '🕊️';
  var rect = originBtn ? originBtn.getBoundingClientRect() : { left:window.innerWidth/2 - 16, top:window.innerHeight/2 };
  dove.style.left = (rect.left + rect.width/2 - 16) + 'px';
  dove.style.top  = (rect.top  - 8) + 'px';
  document.body.appendChild(dove);
  setTimeout(function(){ if (dove && dove.parentNode) dove.parentNode.removeChild(dove); }, 1900);
}

var _fzMoods = ['😞','😐','🙂','😊','🔥'];

function renderMoodSoundscapeCard(){
  var host = document.getElementById('fzMoodCard');
  if (!host) return;
  var today = _fzToday();
  var picked = (D && D.faithMood && D.faithMood[today]) || '';
  var moodHtml = _fzMoods.map(function(m){
    var active = (m === picked) ? ' active' : '';
    return '<button type="button" class="fz-mood-btn' + active + '" data-mood="' +
      _fzEsc(m) + '" onclick="setFaithMood(\'' + _fzEsc(m) + '\')" aria-label="Mood ' + _fzEsc(m) + '">' +
      _fzEsc(m) + '</button>';
  }).join('');
  var pills = [
    { id:'prayer',   icon:'🕯️', label:'Prayer Mode' },
    { id:'peace',    icon:'🌊', label:'Peace' },
    { id:'creation', icon:'🌲', label:'Creation' }
  ];
  var pillsHtml = pills.map(function(p){
    var active = (_fzActiveSoundscape === p.id) ? ' active' : '';
    return '<button type="button" class="fz-sound-pill' + active + '" data-sound="' + p.id +
      '" onclick="toggleSoundscape(\'' + p.id + '\')">' + p.icon + ' ' + p.label + '</button>';
  }).join('');

  host.innerHTML =
    '<div class="fz-card-hdr">RIGHT NOW</div>' +
    '<div class="fz-mood-row">' + moodHtml + '</div>' +
    '<div class="fz-sound-row">' + pillsHtml + '</div>';
}

function setFaithMood(mood){
  if (!D) return;
  if (!D.faithMood || typeof D.faithMood !== 'object' || Array.isArray(D.faithMood)){
    D.faithMood = {};
  }
  D.faithMood[_fzToday()] = mood;
  _fzSave();
  renderMoodSoundscapeCard();
}

var _fzActiveSoundscape = null;
var _fzSoundscapeToastShown = false;

function toggleSoundscape(id){
  // Audio layer isn't wired yet (see AUDIO_LAYER_SPEC.md). Visual toggle
  // only; first tap shows a "coming soon" toast so users know it isn't a
  // bug. Pills still highlight so the interaction feels real.
  if (_fzActiveSoundscape === id){
    _fzActiveSoundscape = null;
  } else {
    _fzActiveSoundscape = id;
    if (!_fzSoundscapeToastShown && typeof showToast === 'function'){
      showToast('Soundscape audio coming soon');
      _fzSoundscapeToastShown = true;
    }
  }
  renderMoodSoundscapeCard();
}

// ════════════════════════════════════════════════════════════
// ZONE 3 — Explore collapse
// ════════════════════════════════════════════════════════════

function renderFaithExploreToggle(){
  var btn = document.getElementById('fzExploreToggle');
  if (!btn) return;
  var open = !!(D && D.faithExploreOpen);
  btn.textContent = open ? '✦ Hide Explore  ↑' : '✦ Explore Faith  ↓';
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  var wrap = document.getElementById('fzZone3Wrap');
  if (wrap){
    wrap.style.display = open ? '' : 'none';
    wrap.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
}

function toggleFaithExplore(force){
  if (!D) return;
  if (typeof force === 'boolean'){
    D.faithExploreOpen = force;
  } else {
    D.faithExploreOpen = !D.faithExploreOpen;
  }
  _fzSave();
  renderFaithExploreToggle();
  if (D.faithExploreOpen){
    setTimeout(function(){
      var wrap = document.getElementById('fzZone3Wrap');
      if (wrap) wrap.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 60);
  }
}

// Called by faith.js bfTab() — auto-expand Zone 3 whenever the user
// navigates to a sub-tab other than 'home' so the panel they're aiming
// at is actually visible.
function ensureFaithExploreOpenForTab(tab){
  if (!D) return;
  if (tab && tab !== 'home' && !D.faithExploreOpen){
    D.faithExploreOpen = true;
    _fzSave();
    renderFaithExploreToggle();
  }
}

// ════════════════════════════════════════════════════════════
// Boot — single entry point
// ════════════════════════════════════════════════════════════

function renderFaithZones(){
  if (typeof D === 'undefined' || !D) return;
  // Defensive shape — sanitize anything cloudLoad may have mangled.
  if (!Array.isArray(D.convinceMeSeen)) D.convinceMeSeen = [];
  if (typeof D.faithCuriosityStreak !== 'number') D.faithCuriosityStreak = 0;
  if (typeof D.faithCuriosityLastDate !== 'string') D.faithCuriosityLastDate = '';
  if (!D.faithChallenges || typeof D.faithChallenges !== 'object' || Array.isArray(D.faithChallenges)) D.faithChallenges = {};
  if (!D.faithMood || typeof D.faithMood !== 'object' || Array.isArray(D.faithMood)) D.faithMood = {};
  if (!Array.isArray(D.quickPrayers)) D.quickPrayers = [];
  if (typeof D.faithExploreOpen !== 'boolean') D.faithExploreOpen = false;

  renderConvinceMeHero();
  renderTodayZone();
  renderFaithExploreToggle();
}

if (typeof document !== 'undefined'){
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden){
      // Re-render Zone 2 only — the time-sensitive bits (mood today,
      // challenge-of-day) update when the user returns mid-day.
      renderTodayZone();
    }
  });
}
