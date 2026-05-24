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
    // Scroll cue — gentle downward chevron telling the user there's more
    // below the card (Today zone). Hidden after first scroll (see
    // _fzAttachScrollCueHide).
    '<div class="cm-scroll-cue" id="cmScrollCue" aria-hidden="true">⌄</div>' +
    '<div class="cm-dig-drawer" id="cmDigDrawer" style="display:none;"></div>';

  _fzAttachSwipe();
  _fzAttachScrollCueHide();
}

// One-shot scroll listener — fades the chevron the moment the user
// scrolls so the cue doesn't compete with content they've already seen.
// Reset on every render so the cue can re-appear if the section is
// re-mounted with the page at the top.
var _fzScrollCueAttached = false;
function _fzAttachScrollCueHide(){
  if (_fzScrollCueAttached) return;
  _fzScrollCueAttached = true;
  function hideCue(){
    var cue = document.getElementById('cmScrollCue');
    if (cue) cue.classList.add('cm-cue-hide');
    window.removeEventListener('scroll', onScroll, true);
  }
  function onScroll(){
    if (window.scrollY > 40 || window.pageYOffset > 40) hideCue();
  }
  // Capture so the listener fires regardless of which scroller moved.
  window.addEventListener('scroll', onScroll, { passive:true, capture:true });
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
    var firstFlip = !!(D && Array.isArray(D.convinceMeSeen) && D.convinceMeSeen.indexOf(card.id) === -1);
    if (firstFlip){
      D.convinceMeSeen.push(card.id);
    }
    _fzCuriosityCredit();
    _fzSave();
    // V1 Rebuild · Session 3 — trait award: curiosity engagement
    // builds Courage (asking the hard question) + Faith (sitting
    // with the answer). Only on FIRST flip of a given card so
    // re-flipping doesn't farm points.
    if (firstFlip && typeof awardTrait === 'function'){
      awardTrait('courage', 3);
      awardTrait('faith',   2);
    }
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
  // V1 Rebuild · Session 3 — Growth widget (top 3 traits). Module
  // is loaded BEFORE faith-zones.js so the function is defined,
  // but guard anyway for safety.
  if (typeof renderGrowthCompact === 'function') renderGrowthCompact();
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
  // V1 Rebuild · Session 3 — trait awards. Daily challenge always
  // builds Faith (showing up) + Discipline (doing the thing). If
  // the challenge config carries a trait hint, award a bonus there
  // too (gratitude/compassion/integrity/etc). awardTrait fires its
  // own toast, so we no longer need the standalone showToast.
  if (typeof awardTrait === 'function'){
    awardTrait('faith',      3);
    awardTrait('discipline', 2);
    if (ch && ch.trait && TRAITS && TRAITS[ch.trait]){
      awardTrait(ch.trait, 1);
    }
  } else if (typeof showToast === 'function'){
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

function openQuickPrayer(seedText){
  var overlay = document.getElementById('quickPrayerOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.classList.add('modal-open');
  var seed = (typeof seedText === 'string') ? seedText : '';
  setTimeout(function(){
    var ta = document.getElementById('quickPrayerText');
    if (ta){
      ta.value = seed;
      ta.focus();
      // Place caret at end so the user can keep typing past the seed.
      if (seed) ta.setSelectionRange(seed.length, seed.length);
    }
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
  var cleanText = text.slice(0, 600);
  D.quickPrayers.push({ text:cleanText, date:_fzToday() });
  // Cap to the most recent 50 entries to keep the cloud blob lean.
  if (D.quickPrayers.length > 50){
    D.quickPrayers = D.quickPrayers.slice(-50);
  }
  _fzSave();
  _fzFloatDove(document.getElementById('quickPrayerSubmit'));
  // V1 Rebuild · Session 3 — trait awards. Every prayer builds
  // Faith. If the user named someone else in the prayer (very
  // rough heuristic: mentions "for them/him/her/my X" or "pray
  // for") it also builds Compassion. Otherwise Compassion still
  // gets a small +1 — the act of pausing for prayer is itself
  // an outward turn.
  if (typeof awardTrait === 'function'){
    awardTrait('faith', 2);
    var lc = cleanText.toLowerCase();
    var aboutOthers = /\b(for|pray for|help)\b.{0,40}\b(them|him|her|my|friend|mom|dad|sister|brother|son|daughter|family|teacher|class)\b/.test(lc);
    awardTrait('compassion', aboutOthers ? 3 : 1);
  }
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
// SESSION 2 — Quick Prayer journal
// Builds automatically from D.quickPrayers (cap 50 in submit handler);
// renders into the #fzQuickPrayerJournal host placed at the bottom of
// the bf-prayer panel. Each entry can be marked Answered, which flips
// D.quickPrayers[i].answered and tints the card.
// ════════════════════════════════════════════════════════════

// Friendly date label: "Today", "Yesterday", or "May 22"
function _fzFriendlyDate(dateStr){
  if (!dateStr) return '';
  var today = _fzToday();
  if (dateStr === today) return 'Today';
  var d = new Date(dateStr + 'T00:00:00');
  var y = new Date(); y.setDate(y.getDate() - 1);
  if (dateStr === y.toISOString().slice(0,10)) return 'Yesterday';
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate();
}

function renderQuickPrayerJournal(){
  var host = document.getElementById('fzQuickPrayerJournal');
  if (!host) return;
  if (!D || !Array.isArray(D.quickPrayers)) {
    if (D) D.quickPrayers = [];
    else return;
  }
  var entries = D.quickPrayers.slice().reverse().slice(0, 30);
  var answeredCount = 0;
  for (var i = 0; i < D.quickPrayers.length; i++){
    if (D.quickPrayers[i] && D.quickPrayers[i].answered) answeredCount++;
  }
  var hdrSuffix = answeredCount > 0
    ? ' <span class="fz-jr-hdr-count">(' + answeredCount + ' answered 🙏)</span>'
    : '';

  if (!entries.length){
    host.innerHTML =
      '<div class="fz-jr-section">' +
        '<div class="fz-jr-hdr">My Prayers 📓</div>' +
        '<div class="fz-jr-empty">Your prayers will appear here. Tap Quick Prayer to start.</div>' +
      '</div>';
    return;
  }

  // Reverse-chronological ids → original-index map (so toggle handlers
  // know which item to flip without recalculating).
  var html = '<div class="fz-jr-section">' +
    '<div class="fz-jr-hdr">My Prayers 📓' + hdrSuffix + '</div>' +
    '<div class="fz-jr-list">';

  for (var k = 0; k < entries.length; k++){
    var p = entries[k];
    if (!p) continue;
    // Original index inside D.quickPrayers (so the toggle knows the row).
    var origIdx = D.quickPrayers.length - 1 - k;
    var answered = !!p.answered;
    var text = String(p.text || '').slice(0, 600);
    html +=
      '<div class="fz-jr-entry' + (answered ? ' fz-jr-answered' : '') + '" data-idx="' + origIdx + '">' +
        '<div class="fz-jr-row">' +
          '<span class="fz-jr-dove" aria-hidden="true">🕊️</span>' +
          '<div class="fz-jr-body">' +
            '<div class="fz-jr-meta">' +
              '<span class="fz-jr-date">' + _fzEsc(_fzFriendlyDate(p.date || '')) + '</span>' +
              (answered ? ' <span class="fz-jr-badge">🙏 Answered</span>' : '') +
            '</div>' +
            '<div class="fz-jr-text">' + _fzEsc(text) + '</div>' +
            '<button type="button" class="fz-jr-ans" onclick="toggleQuickPrayerAnswered(' + origIdx + ')">' +
              (answered ? 'Unmark answered' : 'Mark as answered ✓') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
  html += '</div></div>';
  host.innerHTML = html;
}

function toggleQuickPrayerAnswered(idx){
  if (!D || !Array.isArray(D.quickPrayers)) return;
  var entry = D.quickPrayers[idx];
  if (!entry) return;
  entry.answered = !entry.answered;
  if (entry.answered) entry.answered_at = new Date().toISOString();
  else delete entry.answered_at;
  _fzSave();
  renderQuickPrayerJournal();
}

// ════════════════════════════════════════════════════════════
// SESSION 2 — Night Reflection
//
// Three-step overlay rendered as a horizontal-slide track:
//   Step 1 (mood)     → Step 2 (rotating question + text)
//   Step 2            → Step 3 (pray-or-goodnight)
// Step 3 completes the reflection, fires the stars finale, saves to
// D.nightReflections (cap 60). "Yes, quick prayer" opens the Quick
// Prayer overlay with a 30-char seed from the reflection text.
// ════════════════════════════════════════════════════════════

var _nrState = { mood:null, moodLabel:null, text:'', step:1 };

// Rotation: 7 weekday questions (Mon-Sun) keyed by getDay(); the bonus
// is shown on the 1st of any month so it appears ~once/month without
// disrupting the weekday rhythm.
var _NR_QUESTIONS = {
  weekday: [
    "What was the best moment of your week?",                              // 0 Sun
    "What's one thing you're grateful for today?",                         // 1 Mon
    "What challenged you today?",                                          // 2 Tue
    "Where did you see God today — even slightly?",                        // 3 Wed
    "What do you wish you'd done differently?",                            // 4 Thu
    "Who made your day better?",                                           // 5 Fri
    "What are you carrying that you need to put down?"                     // 6 Sat
  ],
  bonus: "What's one thing you're worried about right now?"
};

function _nrQuestionForToday(){
  var d = new Date();
  if (d.getDate() === 1) return _NR_QUESTIONS.bonus;
  return _NR_QUESTIONS.weekday[d.getDay()];
}

function _nrFirstName(){
  if (D && D.name) return String(D.name).split(' ')[0];
  if (typeof _supaUser !== 'undefined' && _supaUser){
    var meta = _supaUser.user_metadata || {};
    if (meta.first_name) return meta.first_name;
    if (_supaUser.email) return _supaUser.email.split('@')[0];
  }
  return 'friend';
}

function openNightReflect(){
  var overlay = document.getElementById('nightReflectOverlay');
  if (!overlay) return;
  _nrState = { mood:null, moodLabel:null, text:'', step:1 };

  var nm = document.getElementById('nrName');
  if (nm) nm.textContent = _nrFirstName();
  var q = document.getElementById('nrQuestion');
  if (q) q.textContent = _nrQuestionForToday();
  var ta = document.getElementById('nrText');
  if (ta) ta.value = '';

  // Clear any previously-active mood + step states.
  var moods = overlay.querySelectorAll('.nr-mood-btn');
  for (var i = 0; i < moods.length; i++) moods[i].classList.remove('active');

  _nrSetStep(1);

  // Hide the finale pane if it was left visible from a previous run.
  var finale = document.getElementById('nrFinale');
  if (finale) finale.style.display = 'none';

  overlay.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeNightReflect(){
  var overlay = document.getElementById('nightReflectOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  if (!document.querySelector('.mo.open, #ppModal.open, #ppConvinceModal.open, #quickPrayerOverlay.open')){
    document.body.classList.remove('modal-open');
  }
}

function _nrSetStep(step){
  _nrState.step = step;
  var track = document.getElementById('nrTrack');
  if (track) track.setAttribute('data-step', String(step));
  // Step indicator dots
  var dots = document.querySelectorAll('#nrSteps .nr-step');
  for (var i = 0; i < dots.length; i++){
    dots[i].classList.toggle('active', i === (step - 1));
  }
  // Auto-focus the textarea when arriving on Step 2.
  if (step === 2){
    setTimeout(function(){
      var ta = document.getElementById('nrText');
      if (ta) ta.focus();
    }, 380);
  }
}

function nrPickMood(emoji, label){
  _nrState.mood = emoji;
  _nrState.moodLabel = label;
  var btns = document.querySelectorAll('#nightReflectOverlay .nr-mood-btn');
  for (var i = 0; i < btns.length; i++){
    btns[i].classList.toggle('active', btns[i].getAttribute('data-mood') === emoji);
  }
  setTimeout(function(){ _nrSetStep(2); }, 220);
}

function nrContinue(){
  var ta = document.getElementById('nrText');
  _nrState.text = ta ? String(ta.value || '').trim() : '';
  _nrSetStep(3);
}

function nrSkip(){
  _nrState.text = '';
  _nrSetStep(3);
}

function nrBack(toStep){
  _nrSetStep(toStep);
}

function nrCompleteWithPrayer(){
  _nrSaveReflection(true);
  // Brief stars-only flash (no "sleep well" message — keeps momentum
  // into the prayer overlay).
  _nrShowFinale(false, function(){
    closeNightReflect();
    var seed = 'God, about what I wrote tonight — ' +
               (String(_nrState.text || '').slice(0, 30));
    setTimeout(function(){ openQuickPrayer(seed); }, 200);
  });
}

function nrCompleteGoodnight(){
  _nrSaveReflection(false);
  _nrShowFinale(true, function(){ closeNightReflect(); });
}

function _nrSaveReflection(prayed){
  if (!D) return;
  if (!Array.isArray(D.nightReflections)) D.nightReflections = [];
  D.nightReflections.push({
    date:   _fzToday(),
    mood:   _nrState.mood || '',
    text:   String(_nrState.text || '').slice(0, 800),
    prayed: !!prayed,
    ts:     new Date().toISOString()
  });
  // Cap to most recent 60 entries.
  if (D.nightReflections.length > 60){
    D.nightReflections = D.nightReflections.slice(-60);
  }
  // Mark today as a "scripture day" for streak math — Night Reflection
  // counts as showing up for faith today. scrReadDays is the canonical
  // streak store and is shared with the existing getScriptureStreak().
  if (!D.scrReadDays || typeof D.scrReadDays !== 'object' || Array.isArray(D.scrReadDays)){
    D.scrReadDays = {};
  }
  D.scrReadDays[_fzToday()] = true;
  // V1 Rebuild · Session 3 — trait awards now go through awardTrait
  // (which fires the toast + handles level-ups + persists). The
  // previous direct D.traits writes were a Session-2 placeholder
  // that bypassed the toast/level-up affordance.
  if (typeof awardTrait === 'function'){
    awardTrait('wisdom',    2);
    awardTrait('gratitude', 2);
  }
  _fzSave();
  // Re-render any open faith surfaces that depend on the new state.
  if (typeof renderReflectionsHistory === 'function') renderReflectionsHistory();
  if (typeof renderDailyBriefing === 'function') renderDailyBriefing();
}

function _nrShowFinale(withMessage, done){
  var finale = document.getElementById('nrFinale');
  if (!finale){ if (done) done(); return; }
  // Inject N stars at random offsets so each finale feels a bit different.
  var stars = document.getElementById('nrStars');
  if (stars){
    stars.innerHTML = '';
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
      for (var i = 0; i < 6; i++){
        var s = document.createElement('span');
        s.className = 'nr-star';
        s.style.left = (10 + Math.random()*80) + '%';
        s.style.top  = (20 + Math.random()*40) + '%';
        s.style.animationDelay = (Math.floor(Math.random()*220)) + 'ms';
        s.style.animationDuration = (1100 + Math.floor(Math.random()*500)) + 'ms';
        stars.appendChild(s);
      }
    }
  }
  var msg = document.getElementById('nrFinaleMsg');
  if (msg) msg.style.display = withMessage ? '' : 'none';
  finale.style.display = '';
  var dwell = withMessage ? 2000 : 800;
  setTimeout(function(){
    finale.style.display = 'none';
    if (done) done();
  }, dwell);
}

// ── Reflection history (in bf-prayer panel, below My Prayers) ────
function renderReflectionsHistory(){
  var host = document.getElementById('fzReflectionsHistory');
  if (!host) return;
  if (!D || !Array.isArray(D.nightReflections)) {
    if (D) D.nightReflections = [];
    else return;
  }
  var entries = D.nightReflections.slice().reverse().slice(0, 14);
  if (!entries.length){
    host.innerHTML =
      '<div class="fz-jr-section">' +
        '<div class="fz-jr-hdr">My Reflections 🌙</div>' +
        '<div class="fz-jr-empty">Your reflections will appear here each night.</div>' +
      '</div>';
    return;
  }
  var html = '<div class="fz-jr-section">' +
    '<div class="fz-jr-hdr">My Reflections 🌙</div>' +
    '<div class="fz-jr-list">';
  for (var k = 0; k < entries.length; k++){
    var r = entries[k];
    if (!r) continue;
    var text = String(r.text || '');
    var preview = text.length > 60 ? text.slice(0, 60) + '…' : text;
    var origIdx = D.nightReflections.length - 1 - k;
    html +=
      '<div class="fz-jr-entry fz-nr-entry" data-idx="' + origIdx + '" onclick="toggleReflectionExpanded(' + origIdx + ')">' +
        '<div class="fz-jr-row">' +
          '<span class="fz-nr-mood" aria-hidden="true">' + _fzEsc(r.mood || '🌙') + '</span>' +
          '<div class="fz-jr-body">' +
            '<div class="fz-jr-meta">' +
              '<span class="fz-jr-date">' + _fzEsc(_fzFriendlyDate(r.date || '')) + '</span>' +
              (r.prayed ? ' <span class="fz-jr-badge fz-nr-prayed">🙏 Prayed</span>' : '') +
            '</div>' +
            '<div class="fz-jr-text fz-nr-preview" data-full="' + _fzEsc(text) + '">' +
              (text ? _fzEsc(preview) : '<em>(no text — just a mood check-in)</em>') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
  html += '</div></div>';
  host.innerHTML = html;
}

function toggleReflectionExpanded(idx){
  var entry = document.querySelector('.fz-nr-entry[data-idx="' + idx + '"]');
  if (!entry) return;
  var preview = entry.querySelector('.fz-nr-preview');
  if (!preview) return;
  var full = preview.getAttribute('data-full') || '';
  if (!full) return;
  var isExpanded = entry.classList.toggle('fz-nr-expanded');
  if (isExpanded){
    preview.textContent = full;
  } else {
    preview.textContent = full.length > 60 ? full.slice(0,60) + '…' : full;
  }
}

// ── Floating "🌙 Reflect" button on the faith hub after 7pm ──────
function updateReflectFloatVisibility(){
  var btn = document.getElementById('fzReflectFloat');
  if (!btn) return;
  var active = (typeof _activeSection !== 'undefined') ? _activeSection : '';
  var h = new Date().getHours();
  var show = (active === 's-scripture') && (h >= 19);
  btn.style.display = show ? '' : 'none';
  // Pulse animation after 8pm to draw attention.
  btn.classList.toggle('fz-pulse', show && h >= 20);
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
  if (!Array.isArray(D.nightReflections)) D.nightReflections = [];

  renderConvinceMeHero();
  renderTodayZone();
  renderFaithExploreToggle();
  updateReflectFloatVisibility();
}

if (typeof document !== 'undefined'){
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden){
      // Re-render Zone 2 only — the time-sensitive bits (mood today,
      // challenge-of-day, post-7pm reflect button) update when the user
      // returns mid-day.
      renderTodayZone();
      updateReflectFloatVisibility();
    }
  });
}
