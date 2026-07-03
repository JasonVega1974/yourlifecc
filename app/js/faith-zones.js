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

// V1 Rebuild · Session 4 — per-category flip glow color for the
// convinceMeFlipEffect celebration. Keyed by card.cat.
var _CM_CAT_COLORS = {
  'Mystery':'#7b68ee', 'Evidence':'#4ecdc4', 'Science':'#45b7d1',
  'Prophecy':'#ffd700', 'Philosophy':'#a29bfe', 'Challenge':'#ff6b6b'
};

function cmFlip(){
  var card = _fzCurrentCard();
  if (!card) return;
  var firstFlipForFx = false;
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
    // V1 Rebuild · Session 4 — celebration FX on first flip only
    // (spam-protected so re-flips don't re-fire). Pre-flip glow
    // fires BEFORE the .flipped class so the glow leads the flip.
    if (firstFlip && typeof convinceMeFlipEffect === 'function'){
      var glowColor = _CM_CAT_COLORS[card.cat] || '#7b68ee';
      convinceMeFlipEffect(glowColor);
    }
    firstFlipForFx = firstFlip;
  }
  var container = document.getElementById('cmCardContainer');
  if (container) container.classList.add('flipped');
  // V1 Rebuild · Session 4 — post-flip celebrations: sequential
  // bullet reveal once the flip transition has played out, plus
  // an optional Did-You-Know overlay and the curiosity-streak
  // milestone banner (session-flagged so each milestone only
  // surfaces once per page-load).
  if (firstFlipForFx){
    setTimeout(function(){
      if (typeof revealBulletsSequentially === 'function'){
        revealBulletsSequentially(document.querySelector('.cm-back-face') || document.querySelector('.cm-card-back'));
      }
    }, 450);
    if (typeof maybeShowDidYouKnow === 'function') maybeShowDidYouKnow(card.cat);
    if (typeof curiosityStreakMilestone === 'function' && D && D.faithCuriosityStreak){
      if ([3, 5, 7, 14, 30].indexOf(D.faithCuriosityStreak) !== -1){
        if (!window._cmStreakSeen) window._cmStreakSeen = {};
        if (!window._cmStreakSeen[D.faithCuriosityStreak]){
          window._cmStreakSeen[D.faithCuriosityStreak] = true;
          curiosityStreakMilestone(D.faithCuriosityStreak);
        }
      }
    }
  }
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

  // WC-1b — proof-prophecy.js is lazy-loaded. If this card points at a proof
  // but the data isn't loaded yet (user hasn't opened Proof & Prophecy), fetch
  // it via the shared helper, show a brief loading state, and re-enter so the
  // real long-form proof renders instead of the "coming soon" stub.
  if (card.proofId && typeof PROOF_PROPHECY_DATA === 'undefined' && typeof ylccEnsureData === 'function'){
    drawer.innerHTML = '<div class="cm-dig-empty"><div class="cm-dig-empty-icon">📖</div><div class="cm-dig-empty-title">Loading…</div></div>';
    ylccEnsureData('PROOF_PROPHECY_DATA', '/app/js/data/proof-prophecy.js').then(cmDigDeeper).catch(function(){});
    return;
  }

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
  // V1 Rebuild · Session 4 — celebration FX. Flash + confetti fire
  // immediately; the trait explosion is delayed so it lands as the
  // confetti starts to fall, drawing the eye to the trait gain.
  if (typeof screenFlash === 'function') screenFlash('#00d4aa', 200);
  if (typeof megaConfetti === 'function') megaConfetti();
  setTimeout(function(){
    if (typeof traitExplosion === 'function') traitExplosion('✝️', 'Faith');
  }, 200);
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
  // V1 Rebuild · Session 4 — prefer the celebrations.js prayerDove
  // (richer animation, accessibility hooks). Fall back to the
  // original _fzFloatDove if celebrations.js hasn't loaded yet.
  if (typeof prayerDove === 'function') {
    prayerDove(document.getElementById('quickPrayerSubmit'));
  } else {
    _fzFloatDove(document.getElementById('quickPrayerSubmit'));
  }
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
  // 2026-05-29 — the legacy dashed #fzExploreToggle button was
  // removed when the 4-button Faith Home menu replaced it. The
  // function used to early-return on missing btn — which silently
  // killed the wrap-visibility toggle and left Zone 3 stuck at
  // display:none, so the new "Explore Faith" menu button did
  // nothing. Now the btn-update lines are optional; the
  // wrap-visibility toggle ALWAYS runs.
  var open = !!(D && D.faithExploreOpen);
  var btn = document.getElementById('fzExploreToggle');
  if (btn){
    btn.textContent = open ? '✦ Hide Explore  ↑' : '✦ Explore Faith  ↓';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
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

function openNightReflect(){
  var overlay = document.getElementById('nightReflectOverlay');
  if (!overlay) return;
  _nrState = { mood:null, moodLabel:null, text:'', step:1 };

  var nm = document.getElementById('nrName');
  if (nm) nm.textContent = _fzFirstName();
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
  // V1 Rebuild · Session 4 — visual trait explosion fires right as
  // the reflection saves so the user sees the Wisdom gain land.
  if (typeof traitExplosion === 'function'){
    setTimeout(function(){ traitExplosion('📖', 'Wisdom'); }, 300);
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
  if (typeof D.faithLastVisit !== 'number') D.faithLastVisit = 0;
  if (D.faithLastDest !== null && typeof D.faithLastDest !== 'string') D.faithLastDest = null;

  // 2026-05-29 — Simplified Faith Home. The wall of cards (Convince
  // Me hero + 3-4 Today cards + Growth widget) is gone; the home is
  // now a greeting + 4 menu buttons. Each individual surface still
  // lives behind its destination and reuses the existing renderers
  // (renderConvinceMeHero / renderQuickPrayerCard / renderMoodSoundscapeCard
  // / renderDailyChallengeCard / renderGrowthCompact / renderQuickPrayerJournal),
  // which all gracefully no-op when their target div isn't in the DOM.
  //
  // 2026-05-30 — force Zone 3 closed on every home entry. Past
  // sessions could persist D.faithExploreOpen = true (set by the
  // deep-link auto-open in ensureFaithExploreOpenForTab), which made
  // returning users see Ask Scripture + the legacy sub-tab pills
  // hanging below the new 6-button menu. The Explore button in the
  // menu (fzOpenDest('explore')) is the only sanctioned path to
  // show Zone 3 now.
  D.faithExploreOpen = false;

  // Phase 3 — flag-gated Faith Journey home (account-based D.faithJourneyHome,
  // default OFF). Flag-OFF: _fjHomeOn() is false and the existing path below runs
  // UNCHANGED (byte-identical). Flag-ON: hide the classic home UP FRONT and
  // ALWAYS return, so a partial/throwing journey render can never fall through
  // and re-show #fzHome stacked under the journey scene.
  if (_fjHomeOn()){
    var _ch = document.getElementById('fzHome');
    if (_ch) _ch.style.display = 'none';
    try { renderFaithJourneyHome(); } catch (e) {}
    return;
  }

  // 2026-05-30 — Smart Welcome gate. If the user is returning after
  // a 24h+ gap, route them through the welcome screen with
  // time-aware paths + "continue where you left off" CTA. Otherwise
  // show the regular home view. Either way, stamp lastVisit so the
  // next session's gate is computed from THIS visit.
  var _nowMs = Date.now();
  var _last  = +D.faithLastVisit || 0;
  var _hoursAway = _last > 0 ? (_nowMs - _last) / (1000 * 60 * 60) : 0;
  var _isReturner = _last > 0 && _hoursAway >= 24;
  D.faithLastVisit = _nowMs;
  if (typeof save === 'function') save();
  if (_isReturner){
    showWelcomeBack();
    renderFaithExploreToggle();
    var _z3w = document.getElementById('fzZone3Wrap');
    if (_z3w) _z3w.style.display = 'none';
    updateReflectFloatVisibility();
    return;
  }

  renderFzGreeting();
  renderFaithExploreToggle();
  // Belt + suspenders — directly hide the wrap in case render didn't.
  var _z3 = document.getElementById('fzZone3Wrap');
  if (_z3) _z3.style.display = 'none';
  // Make sure the home is the visible view (returning from any
  // destination should land on home).
  var _home = document.getElementById('fzHome');
  var _dest = document.getElementById('fzDest');
  if (_home) _home.style.display = '';
  if (_dest) _dest.style.display = 'none';
  _fzCurrentDest = null;
  updateReflectFloatVisibility();
}

// 2026-05-29 — Faith Home greeting card. Renders into #fzGreeting:
// time-aware welcome + first name + streak chip (if any).
function renderFzGreeting(){
  if (typeof document === 'undefined') return;
  var el = document.getElementById('fzGreeting');
  if (!el) return;
  var h = new Date().getHours();
  var part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  // Streak source: faith curiosity streak (the one the rest of the
  // faith UI uses) — fall back to general daily streak if zero.
  var streak = 0;
  if (D){
    streak = (typeof D.faithCuriosityStreak === 'number' && D.faithCuriosityStreak > 0)
      ? D.faithCuriosityStreak
      : ((typeof getScriptureStreak === 'function')
          ? (getScriptureStreak() || 0)
          : ((typeof D.streak === 'number') ? D.streak : 0));
  }
  // First name — delegate to _fzFirstName so faith greeting + app-home
  // greeting can never diverge. _fzFirstName prefers the active
  // profile's name (multi-profile / child-switch aware).
  var name = (typeof _fzFirstName === 'function') ? _fzFirstName() : 'friend';
  var streakBadge = streak > 0
    ? '<span class="fz-streak">🔥 ' + streak + ' day' + (streak === 1 ? '' : 's') + '</span>'
    : '';
  el.innerHTML =
    '<div class="fz-greet-row">' +
      '<div class="fz-greet-text">' +
        '<div class="fz-greet-hi">Good ' + part + ', ' + _fzEsc(name) + ' 👋</div>' +
        '<div class="fz-greet-sub">What do you want to do?</div>' +
      '</div>' +
      streakBadge +
    '</div>';
  // 2026-05-26 — daily growth snapshot. Lives inside #fzHome between
  // the greeting and the menu (markup in index.html). Rendered here
  // so the card refreshes alongside the greeting every time the user
  // lands back on the faith home.
  if (typeof renderDailyGrowth === 'function'){
    try { renderDailyGrowth(); } catch (e) {}
  }
}

// ════════════════════════════════════════════════════════════
// Phase 3 — Faith Journey home (flag-gated · account-based D.faithJourneyHome)
// A night-sky "walk with God" home: Well hero (verse + greeting) → the 7 CORE
// discipleship steps lit from REAL D.walk progress (_fjRenderStations) → the
// daily doorways (wired to the existing fzOpenDest destinations).
// Greeting/streak/points use LIVE in-app data. Only renders when the per-user
// flag is ON.
// ════════════════════════════════════════════════════════════
function _fjHomeOn(){
  // ROLLOUT BOUNDARY (single source of truth — gate guard, renderFaithZones,
  // fzGoHome, and the floating Back all key off this):
  //   1) Explicit per-account opt-in: D.faithJourneyHome === true  -> ON for ANY
  //      account (e.g. full-app test / early-adopter accounts). Synced via
  //      profiles.data so it follows the user across devices.
  //   2) Faith-free accounts (window._faithFree) -> ON by default (the rollout).
  //   3) Everyone else — full-app / family, not opted in -> OFF -> classic Well,
  //      BYTE-IDENTICAL to today.
  // window._faithFree is set in auth.js (line 387) from profiles.plan_status ===
  // 'faith_free', so it is the canonical faith-free vs full-app distinction.
  try {
    if (typeof D !== 'undefined' && D && D.faithJourneyHome === true) return true;
    if (typeof window !== 'undefined' && window._faithFree === true) return true;
    return false;
  } catch (e){ return false; }
}

function _fjEnsureFonts(){
  if (typeof document === 'undefined' || document.getElementById('fjFonts')) return;
  try {
    var l = document.createElement('link');
    l.id = 'fjFonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap';
    document.head.appendChild(l);
  } catch (e){}
}

// Footprint silhouette (toes + ball + heel), oriented along the path and
// mirrored left/right. Muted warm gold for traveled prints, pale faint cream
// ahead. `done` prints cover the stretch of REAL walk progress (see
// _fjWalkState); faint prints invite the road ahead.
function _fjFoot(x,y,ang,flip,done){
  var sole = done ? 'rgba(246,222,165,.42)' : 'rgba(228,224,210,.20)';
  var toe  = done ? 'rgba(250,232,185,.52)' : 'rgba(232,228,214,.24)';
  var glow = done ? 'filter:drop-shadow(0 0 4px rgba(245,198,112,.32));' : '';
  return '<div style="position:absolute;left:'+x+'px;top:'+y+'px;width:14px;height:20px;'+glow+'transform:translate(-50%,-50%) rotate('+ang+'deg) scaleX('+flip+');">'
    +'<div style="position:absolute;left:5px;top:0;width:2.6px;height:3px;border-radius:50%;background:'+toe+';"></div>'
    +'<div style="position:absolute;left:7.6px;top:1.1px;width:2.3px;height:2.7px;border-radius:50%;background:'+toe+';"></div>'
    +'<div style="position:absolute;left:9.7px;top:2.7px;width:2px;height:2.4px;border-radius:50%;background:'+toe+';"></div>'
    +'<div style="position:absolute;left:3.5px;top:3.4px;width:9px;height:9.5px;border-radius:56% 44% 50% 50% / 64% 60% 40% 40%;background:'+sole+';"></div>'
    +'<div style="position:absolute;left:4.6px;top:11.6px;width:6.2px;height:7.6px;border-radius:50% 50% 50% 50% / 44% 44% 60% 60%;background:'+sole+';"></div>'
    +'</div>';
}

function _fjRenderScene(){
  if (typeof document === 'undefined') return;
  // Full-width star field — percentage positions so stars scatter across the
  // WHOLE night sky (#fjSkyStars fills #fzJourneyHome), not just the 393 path
  // column. More stars to cover the larger area.
  try {
    var sky = document.getElementById('fjSkyStars');
    if (sky){
      var stars = '';
      for (var i=0;i<72;i++){
        var lp = ((i*37.31)%100).toFixed(2);
        var tp = ((i*61.73)%100).toFixed(2);
        var bright = (i%6===0);
        var s = bright?2.6:((i%3===0)?1.6:1.1);
        var op = (0.30+((i*53)%55)/100).toFixed(2);
        var dur = (2.6+((i*31)%42)/10).toFixed(1);
        var d = (((i*17)%50)/10).toFixed(1);
        var sh = bright?'0 0 9px 1px rgba(255,245,215,.9)':'0 0 6px rgba(255,238,200,.8)';
        stars += '<div style="position:absolute;left:'+lp+'%;top:'+tp+'%;width:'+s+'px;height:'+s+'px;border-radius:50%;background:#fff;opacity:'+op+';box-shadow:'+sh+';animation:twinkle '+dur+'s ease-in-out infinite;animation-delay:'+d+'s;"></div>';
      }
      sky.innerHTML = stars;
    }
  } catch (e){}
  // Real walk state for the trail + station markers below. Computed once so
  // footprints and markers can never disagree.
  var wkState = _fjWalkState();
  // Footprint trail along the path — REAL progress. Gold prints cover the
  // stretch already walked (the leading run of completed core stations);
  // faint prints invite the road ahead. Neutral (all faint) when walk-path.js
  // isn't loaded.
  try {
    var NS = 'http://www.w3.org/2000/svg';
    var nodes = [{x:126,y:1476},{x:266,y:1322},{x:120,y:1168},{x:264,y:1012},{x:130,y:850},{x:268,y:688},{x:124,y:530},{x:196,y:392}];
    // nodes[0..6] are the 7 core stations (bottom→top, same coords as
    // _FJ_CORE); nodes[7] is the cross horizon. The traveled trail reaches
    // node[doneLeading] — all 7 done → gold all the way to the cross.
    var compIndex = wkState.doneLeading;
    var build = function(pts){ var dd='M'+pts[0].x+','+pts[0].y; for(var i=1;i<pts.length;i++){ var a=pts[i-1],b=pts[i]; var c1y=a.y+(b.y-a.y)*0.45; var c2y=a.y+(b.y-a.y)*0.55; dd+=' C'+a.x+','+c1y+' '+b.x+','+c2y+' '+b.x+','+b.y; } return dd; };
    var svg = document.createElementNS(NS,'svg'); svg.style.cssText='position:absolute;left:-9999px;top:0;width:0;height:0;overflow:hidden;';
    var pf = document.createElementNS(NS,'path'); pf.setAttribute('d',build(nodes));
    var pc = document.createElementNS(NS,'path'); pc.setAttribute('d',build(nodes.slice(0,compIndex+1)));
    svg.appendChild(pf); svg.appendChild(pc); document.body.appendChild(svg);
    var total = pf.getTotalLength(), compLen = pc.getTotalLength();
    var doneHTML='', futureHTML='', side=1;
    for (var ss=20; ss<total-14; ss+=32){
      var p = pf.getPointAtLength(ss);
      var p2 = pf.getPointAtLength(Math.min(ss+1.2,total));
      var dx=p2.x-p.x, dy=p2.y-p.y; var len=Math.hypot(dx,dy)||1; var off=7*side;
      var x = +(p.x+(-dy/len)*off).toFixed(1);
      var y = +(p.y+(dx/len)*off).toFixed(1);
      var ang = +(Math.atan2(dy,dx)*180/Math.PI+90).toFixed(1);
      if (compIndex>0 && ss<=compLen+6) doneHTML+=_fjFoot(x,y,ang,side,true); else futureHTML+=_fjFoot(x,y,ang,side,false);
      side*=-1;
    }
    document.body.removeChild(svg);
    var dH=document.getElementById('fjStepDone'), fH=document.getElementById('fjStepFuture');
    if (dH) dH.innerHTML = doneHTML;
    if (fH) fH.innerHTML = futureHTML;
  } catch (e){}
  // Station markers — done / current / future from the same state.
  try { _fjRenderStations(wkState); } catch (e){}
}

// ────────────────────────────────────────────────────────────
// The 7 CORE significant steps on the home vista (the spec's original seven),
// mapped to real walk-path station ids (WALK_STATIONS in
// data/walk-stations-data.js). Coordinates sit on the painted scene path in
// index.html (#fjScene, bottom→top); side is the lane the marker occupies —
// its label renders on the opposite side. The golden cross horizon above
// station 7 is static markup ("Becoming Like Christ") and stays untouched.
// ────────────────────────────────────────────────────────────
var _FJ_CORE = [
  { id:'curious',      x:126, y:1476, side:'L', name:'COME AND SEE',        verse:'“Come and see.” — John 1:39' },
  { id:'accepted',     x:266, y:1322, side:'R', name:'SAYING YES TO JESUS', verse:'“A new creation.” — 2 Corinthians 5:17' },
  { id:'baptism',      x:120, y:1168, side:'L', name:'BAPTISM',             verse:'“Raised to walk in new life.” — Rom 6:4' },
  { id:'word',         x:264, y:1012, side:'R', name:'ROOTED IN THE WORD',  verse:'“Rooted and built up in Him.” — Col 2:7' },
  { id:'discipleship', x:130, y:850,  side:'L', name:'DISCIPLESHIP',        verse:'“If you abide in my word, you are truly my disciples.” — John 8:31' },
  { id:'serving',      x:268, y:688,  side:'R', name:'SERVING OTHERS',      verse:'“Serve one another in love.” — Gal 5:13' },
  { id:'disciples',    x:124, y:530,  side:'L', name:'MAKING DISCIPLES',    verse:'“Go and make disciples.” — Matt 28:19' }
];

// Real walk state for the home vista. Existence-check walkGetProgress (proof
// walk-path.js loaded), then read D.walk.completed directly. Neutral result
// (nothing completed, no current beacon) when the module is missing — the
// scene renders in its dim inviting state and never throws (spec §5: no
// locks, nothing that accuses).
function _fjWalkState(){
  var st = { loaded:false, completed:{}, currentId:null, doneLeading:0 };
  try {
    if (typeof window === 'undefined' || typeof window.walkGetProgress !== 'function') return st;
    st.loaded = true;
    var comp = (typeof D !== 'undefined' && D && D.walk && D.walk.completed && typeof D.walk.completed === 'object')
      ? D.walk.completed : {};
    st.completed = comp;
    // Current = FIRST of the 7 core steps not yet completed (grace-first —
    // out-of-order completions still glow gold individually).
    for (var i = 0; i < _FJ_CORE.length; i++){
      if (!comp[_FJ_CORE[i].id]){ st.currentId = _FJ_CORE[i].id; break; }
    }
    // Leading run of completed steps — how far up the path the gold
    // footprint trail reaches (0..7; 7 = all core steps walked).
    var k = 0;
    while (k < _FJ_CORE.length && comp[_FJ_CORE[k].id]) k++;
    st.doneLeading = k;
  } catch (e){}
  return st;
}

// Render the 7 core-step markers + labels into #fjStations from real state.
//   done    → warm gold glow ring + ✓ (the scene's rgba(245,180,49,…) palette)
//   current → soft pulsing beacon — the walk path's "YOU ARE HERE" language,
//             smaller (this is a vista, not the map). Beacon pulse honors
//             prefers-reduced-motion via the #fzJourneyHome * override.
//   future  → dim, inviting. No locks, no labels that accuse.
// Every marker + label deep-links into My Walk at its station.
function _fjRenderStations(st){
  if (typeof document === 'undefined') return;
  var hostEl = document.getElementById('fjStations');
  if (!hostEl) return;
  st = st || _fjWalkState();
  var html = '';
  for (var i = 0; i < _FJ_CORE.length; i++){
    var s = _FJ_CORE[i];
    var done = !!st.completed[s.id];
    var isCur = st.currentId === s.id;
    var open = "_fjOpenWalkAt('" + s.id + "')";
    // Label geometry — opposite side of the marker's lane, same rules the
    // old static markup used (L-lane marker → label right; R-lane → label
    // left, right-aligned).
    var labelPos = (s.side === 'L')
      ? 'left:' + (s.x + 44) + 'px;text-align:left;'
      : 'right:' + (393 - s.x + 40) + 'px;text-align:right;';
    if (isCur){
      // Beacon rings + glowing orb (decorative, behind the button).
      html += '<div style="position:absolute;left:' + s.x + 'px;top:' + s.y + 'px;width:0;height:0;pointer-events:none;">'
        + '<div style="position:absolute;left:0;top:0;width:62px;height:62px;border-radius:50%;border:2px solid rgba(245,180,49,.55);transform:translate(-50%,-50%);animation:beacon 3.6s ease-out infinite;"></div>'
        + '<div style="position:absolute;left:0;top:0;width:62px;height:62px;border-radius:50%;border:2px solid rgba(245,180,49,.45);transform:translate(-50%,-50%);animation:beacon 3.6s ease-out infinite;animation-delay:1.8s;"></div>'
        + '</div>'
        + '<button type="button" onclick="' + open + '" aria-label="' + _fzEsc(s.name) + ' — your current step. Open in My Walk" style="position:absolute;left:' + s.x + 'px;top:' + s.y + 'px;transform:translate(-50%,-50%);width:58px;height:58px;border-radius:50%;background:radial-gradient(circle at 38% 30%,#fff4d2,#f7b733 58%,#d68a1c);animation:haze 3.2s ease-in-out infinite;border:0;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        + '<span style="width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#ffffff,rgba(255,255,255,0) 70%);"></span>'
        + '</button>'
        // Floating spark above the beacon — the "walk toward this" invitation.
        + '<div style="position:absolute;left:' + s.x + 'px;top:' + (s.y - 92) + 'px;transform:translate(-50%,0);animation:floaty 4.2s ease-in-out infinite;pointer-events:none;">'
        + '<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">'
        + '<div style="position:absolute;inset:-8px;border-radius:50%;background:radial-gradient(circle,rgba(255,233,170,.55),rgba(255,226,150,0) 64%);animation:sparklepulse 3s ease-in-out infinite;"></div>'
        + '<span style="position:relative;font-size:27px;line-height:1;color:#fffaf0;text-shadow:0 0 10px rgba(255,225,150,1),0 0 22px rgba(255,200,110,.85),0 0 36px rgba(255,185,90,.55);">✦</span>'
        + '</div></div>'
        + '<div onclick="' + open + '" aria-hidden="true" style="position:absolute;' + labelPos + 'top:' + s.y + 'px;transform:translateY(-50%);width:178px;cursor:pointer;">'
        + '<div style="font:600 10px/1 Oswald;letter-spacing:.24em;color:#f5b431;margin-bottom:6px;">YOU ARE HERE</div>'
        + '<div style="font:700 20px/1.05 Oswald;letter-spacing:.01em;color:#f7efdb;">' + s.name + '</div>'
        + '<div style="font:italic 400 12px/1.35 Newsreader;color:#aab2c9;margin-top:5px;">' + s.verse + '</div>'
        + '</div>';
    } else if (done){
      html += '<button type="button" onclick="' + open + '" aria-label="' + _fzEsc(s.name) + ' — step taken. Open in My Walk" style="position:absolute;left:' + s.x + 'px;top:' + s.y + 'px;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 38% 32%,rgba(64,54,30,.92),rgba(30,26,16,.92));border:1.5px solid rgba(245,197,110,.72);box-shadow:0 0 14px rgba(245,180,49,.28),0 0 30px rgba(245,180,49,.12);padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        + '<span style="color:#f5cd8c;font:600 15px/1 Oswald;text-shadow:0 0 8px rgba(245,190,90,.8);">✓</span>'
        + '</button>'
        + '<div onclick="' + open + '" aria-hidden="true" style="position:absolute;' + labelPos + 'top:' + s.y + 'px;transform:translateY(-50%);width:178px;cursor:pointer;">'
        + '<div style="font:600 16px/1.05 Oswald;letter-spacing:.02em;color:#e7dcc4;">' + s.name + '</div>'
        + '<div style="font:italic 400 12px/1.3 Newsreader;color:#8b93ab;margin-top:3px;">' + s.verse + '</div>'
        + '</div>';
    } else {
      html += '<button type="button" onclick="' + open + '" aria-label="' + _fzEsc(s.name) + ' — a step ahead. Open in My Walk" style="position:absolute;left:' + s.x + 'px;top:' + s.y + 'px;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#1c2945,#121a30);border:1px solid rgba(150,170,210,.22);box-shadow:0 0 12px rgba(8,12,26,.6);padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.85;">'
        + '<span style="width:8px;height:8px;border-radius:50%;background:rgba(184,198,228,.4);"></span>'
        + '</button>'
        + '<div onclick="' + open + '" aria-hidden="true" style="position:absolute;' + labelPos + 'top:' + s.y + 'px;transform:translateY(-50%);width:178px;opacity:.55;cursor:pointer;">'
        + '<div style="font:600 16px/1.05 Oswald;letter-spacing:.02em;color:#9aa3bb;">' + s.name + '</div>'
        + '<div style="font:italic 400 12px/1.3 Newsreader;color:#737b94;margin-top:3px;">' + s.verse + '</div>'
        + '</div>';
    }
  }
  hostEl.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
// 2026-07-03 — "My Journey so far" walk journal
// Renders below the quest board inside the My Walk destination. Reads ONLY
// existing D.walk state — completed (station → date), reflections (station →
// text, NO timestamp of its own, so each shows under its station's dated
// entry), questDone (quest → date). Chronological, newest first; stations
// outrank quests on the same day. Empty state is a warm one-liner — never
// fake data. Additive module: walk-path.js untouched.
// ════════════════════════════════════════════════════════════
function _fjWalkJournalEntries(){
  var w = (typeof D !== 'undefined' && D && D.walk && typeof D.walk === 'object') ? D.walk : {};
  var completed   = (w.completed   && typeof w.completed   === 'object') ? w.completed   : {};
  var reflections = (w.reflections && typeof w.reflections === 'object') ? w.reflections : {};
  var questDone   = (w.questDone   && typeof w.questDone   === 'object') ? w.questDone   : {};
  var stations = (typeof window !== 'undefined' && Array.isArray(window.WALK_STATIONS))    ? window.WALK_STATIONS    : [];
  var quests   = (typeof window !== 'undefined' && Array.isArray(window.WALK_QUESTS_POOL)) ? window.WALK_QUESTS_POOL : [];
  var out = [];
  Object.keys(completed).forEach(function(id){
    var s = null;
    for (var i = 0; i < stations.length; i++){ if (stations[i] && stations[i].id === id){ s = stations[i]; break; } }
    var refl = reflections[id];
    out.push({
      kind: 'station',
      date: String(completed[id] || ''),
      icon: (s && s.icon) || '👣',
      title: (s && s.name) || id,
      reflection: (typeof refl === 'string' && refl.trim()) ? refl.trim() : ''
    });
  });
  Object.keys(questDone).forEach(function(qid){
    var q = null;
    for (var j = 0; j < quests.length; j++){ if (quests[j] && quests[j].id === qid){ q = quests[j]; break; } }
    out.push({
      kind: 'quest',
      date: String(questDone[qid] || ''),
      icon: (q && q.icon) || '🏆',
      title: 'Quest: ' + ((q && q.title) || qid),
      reflection: ''
    });
  });
  out.sort(function(a, b){
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.kind !== b.kind) return a.kind === 'station' ? -1 : 1;
    return 0;
  });
  return out;
}

function renderWalkJournal(hostId){
  if (typeof document === 'undefined') return;
  var host = document.getElementById(hostId || 'walkJournalWrap');
  if (!host) return;
  var entries = _fjWalkJournalEntries();
  // Hardcoded night-sky hex on purpose — this continues the walk scene
  // (wk-scene, also hardcoded), not the themed dest chrome.
  var h = '<div style="margin-top:1.8rem;">'
        + '<div style="font:600 10px/1 Oswald,sans-serif;letter-spacing:.26em;color:#f5b431;margin-bottom:.7rem;">MY JOURNEY SO FAR</div>';
  if (!entries.length){
    h += '<div style="background:rgba(20,26,48,.8);border:1px solid rgba(245,180,49,.14);border-radius:14px;padding:1.1rem 1rem;font:italic 400 .85rem/1.5 Georgia,serif;color:#aab2c9;">Your journey starts with a single step — the path above is waiting.</div>';
  } else {
    h += '<div style="background:rgba(20,26,48,.8);border:1px solid rgba(245,180,49,.14);border-radius:14px;padding:.4rem .9rem;">';
    for (var i = 0; i < entries.length; i++){
      var e = entries[i];
      var border = (i === entries.length - 1) ? '' : 'border-bottom:1px solid rgba(255,255,255,.06);';
      h += '<div style="display:flex;gap:.7rem;align-items:flex-start;padding:.75rem 0;' + border + '">'
         + '<span style="font-size:1.15rem;line-height:1.2;" aria-hidden="true">' + _fzEsc(e.icon) + '</span>'
         + '<span style="flex:1;min-width:0;">'
         +   '<span style="display:block;font:600 .82rem/1.3 Oswald,sans-serif;letter-spacing:.02em;color:#e7dcc4;">' + _fzEsc(e.title) + '</span>'
         +   (e.reflection ? '<span style="display:block;font:italic 400 .78rem/1.45 Georgia,serif;color:#9aa2ba;margin-top:.25rem;">“' + _fzEsc(e.reflection) + '”</span>' : '')
         + '</span>'
         + '<span style="flex-shrink:0;font:500 .68rem/1.4 Oswald,sans-serif;letter-spacing:.06em;color:#8a90a4;">' + _fzEsc(_fzFriendlyDate(e.date)) + '</span>'
         + '</div>';
    }
    h += '</div>';
  }
  h += '</div>';
  host.innerHTML = h;
}

// Keep the journal live after a step is marked or a reflection saved,
// WITHOUT editing walk-path.js — wrapper-installer pattern (mirrors
// walk-quest-hooks.js). Installed on first walk-dest open; no-ops and
// retries next open if walk-path.js hasn't loaded yet.
function _fjInstallWalkJournalHooks(){
  if (typeof window === 'undefined' || window.__fjWalkJournalHooked) return;
  if (typeof window.walkMarkStep !== 'function') return; // walk-path not loaded — retry on next open
  ['walkMarkStep', 'walkSaveReflection'].forEach(function(fn){
    if (typeof window[fn] !== 'function') return;
    var _orig = window[fn];
    window[fn] = function(){
      var r = _orig.apply(this, arguments);
      try { if (document.getElementById('walkJournalWrap')) renderWalkJournal('walkJournalWrap'); } catch (e){}
      return r;
    };
  });
  window.__fjWalkJournalHooked = true;
}

// Home-vista footprint → My Walk, opened at that station. fzOpenDest('walk')
// renders the full path synchronously into #fzDest; the station sheet
// (walkOpenStation, walk-path.js) mounts its own body-level overlay right
// after. Both typeof-guarded — if walk-path.js is missing the user still
// lands on the (empty-panel) walk destination instead of throwing.
function _fjOpenWalkAt(stationId){
  if (typeof document === 'undefined') return;
  try {
    var jh = document.getElementById('fzJourneyHome');
    if (jh) jh.style.display = 'none';
    if (typeof fzOpenDest === 'function') fzOpenDest('walk');
    setTimeout(function(){
      if (typeof window !== 'undefined' && typeof window.walkOpenStation === 'function'){
        window.walkOpenStation(stationId);
      }
    }, 160);
  } catch (e){}
}

function renderFaithJourneyHome(){
  if (typeof document === 'undefined') return;
  var host = document.getElementById('fzJourneyHome');
  if (!host) return;
  _fjEnsureFonts();
  // Journey home is the visible view; hide the classic home + any open dest.
  var classic = document.getElementById('fzHome');
  var dest    = document.getElementById('fzDest');
  if (classic) classic.style.display = 'none';
  if (dest)    dest.style.display = 'none';
  host.style.display = 'block';
  _fzCurrentDest = null;

  // Returning to the journey home — drop any leftover Explore "back" button.
  try { var _eb = document.getElementById('fjExploreBack'); if (_eb) _eb.remove(); } catch (e){}
  // Wire the daily doorways to fzOpenDest(). Hide the journey home first so
  // the destination shows alone; the dest's back button (fzGoHome, flag-on)
  // returns here. LEGACY-SURFACE dests are special — their panels live inside
  // #fzHome (Zone 3 bf-* panels for the tab deep links; the classic menu +
  // topic grid for 'explore'/More), so we show #fzHome + a "back to journey"
  // button (no gate; Bug 1 fixed). 'worship' is its own app section —
  // showSection swaps away and worshipClose routes back through s-scripture,
  // which re-renders this home. Idempotent — el.onclick overwrites on every
  // render.
  var _fjLegacyDests = { explore:1, biblehub:1, timeline:1, proof:1, archaeology:1,
    // 2026-07-03 — GROW + CHURCH & YOU deep links (their bf-* panels live in
    // Zone 3 inside #fzHome). podcasts navigates to its own page and
    // reflect/growth/heart are dest takeovers — none of those belong here.
    academy:1, plans:1, devotional:1, memorize:1, traditions:1, sermon:1 };
  try {
    var doors = host.querySelectorAll('[data-fjdest]');
    for (var di=0; di<doors.length; di++){
      (function(el){
        var dst = el.getAttribute('data-fjdest');
        el.onclick = function(){
          host.style.display = 'none';
          if (_fjLegacyDests[dst]){
            var ch = document.getElementById('fzHome');
            if (ch){
              ch.style.display = '';
              if (!document.getElementById('fjExploreBack')){
                var b = document.createElement('button');
                b.id = 'fjExploreBack'; b.type = 'button';
                b.textContent = '← Back to your journey';
                b.style.cssText = 'display:block;width:100%;margin:0 0 .75rem;padding:.7rem 1rem;border:1px solid rgba(245,180,49,.4);border-radius:12px;background:rgba(245,180,49,.1);color:#f5b431;font:600 .8rem/1 Oswald,sans-serif;letter-spacing:.04em;cursor:pointer;';
                b.onclick = function(){ var x = document.getElementById('fjExploreBack'); if (x) x.remove(); if (typeof renderFaithJourneyHome === 'function') renderFaithJourneyHome(); };
                ch.insertBefore(b, ch.firstChild);
              }
            }
          }
          if (typeof fzOpenDest === 'function') fzOpenDest(dst);
        };
      })(doors[di]);
    }
  } catch (e){}

  // Greeting — live time-of-day + real first name (same _fzFirstName source as
  // the classic faith greeting). New user still shows their real name.
  var gEl = document.getElementById('fjGreeting');
  if (gEl){
    var h = new Date().getHours();
    var part = h < 12 ? 'GOOD MORNING' : (h < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING');
    var nm = (typeof _fzFirstName === 'function') ? _fzFirstName() : 'friend';
    gEl.textContent = part + ', ' + String(nm == null ? 'friend' : nm).toUpperCase();
  }
  // Streak — live D.xpStreak.count (honest; new user = 0).
  var sEl = document.getElementById('fjStreak');
  if (sEl){
    var st = (typeof D !== 'undefined' && D && D.xpStreak && typeof D.xpStreak.count === 'number') ? D.xpStreak.count : 0;
    sEl.textContent = st;
  }
  // Points — live D.scrPoints faith/devotional points (honest; new user = 0).
  var pEl = document.getElementById('fjPoints');
  if (pEl){
    var pts = (typeof D !== 'undefined' && D && typeof D.scrPoints === 'number') ? D.scrPoints : 0;
    pEl.textContent = Number(pts).toLocaleString();
  }
  // Today's verse — from the app's real VERSES list (day-of-year pick).
  try {
    var vEl = document.getElementById('fjVerse'), rEl = document.getElementById('fjRef');
    if (vEl && rEl && typeof VERSES !== 'undefined' && VERSES && VERSES.length){
      var now = new Date(), start = new Date(now.getFullYear(), 0, 0);
      var doy = Math.floor((now - start) / 86400000);
      var v = VERSES[doy % VERSES.length];
      if (v){ vEl.textContent = v.t; rEl.textContent = v.r; }
    }
  } catch (e){}
  // My Walk tile progress teaser — grace-first: show NOTHING until a step is
  // taken (spec §5, never make anyone feel behind). walkGetProgress() is from
  // walk-path.js and returns {done,total,pct}; typeof-guarded so a module-load
  // failure is a silent no-op.
  try {
    var _wt = document.getElementById('walkTeaser');
    if (_wt){
      var _wp = (typeof window.walkGetProgress === 'function') ? window.walkGetProgress() : null;
      if (_wp && _wp.done > 0){
        _wt.textContent = _wp.done + ' of ' + _wp.total + ' steps · ' + _wp.pct + '%';
        _wt.style.display = '';
      } else {
        _wt.textContent = '';
        _wt.style.display = 'none';
      }
    }
    // Second teaser line (2026-07-03): "Last step: {station} · {date}" — the
    // most recently dated completion. Grace-first: hidden when no steps yet.
    var _wtl = document.getElementById('walkTeaserLast');
    if (_wtl){
      var _comp = (typeof D !== 'undefined' && D && D.walk && D.walk.completed && typeof D.walk.completed === 'object') ? D.walk.completed : {};
      var _lastId = null, _lastDate = '';
      Object.keys(_comp).forEach(function(id){
        var dd = String(_comp[id] || '');
        if (dd > _lastDate){ _lastDate = dd; _lastId = id; }
      });
      if (_lastId && _lastDate){
        var _sts = (typeof window !== 'undefined' && Array.isArray(window.WALK_STATIONS)) ? window.WALK_STATIONS : [];
        var _st = null;
        for (var _si = 0; _si < _sts.length; _si++){ if (_sts[_si] && _sts[_si].id === _lastId){ _st = _sts[_si]; break; } }
        _wtl.textContent = 'Last step: ' + ((_st && _st.name) || _lastId) + ' · ' + _fzFriendlyDate(_lastDate);
        _wtl.style.display = '';
      } else {
        _wtl.textContent = '';
        _wtl.style.display = 'none';
      }
    }
  } catch (e){}
  // Scene — stars + footprint trail + the 7 core-step markers, all lit from
  // real D.walk progress (neutral when walk-path.js isn't loaded).
  _fjRenderScene();
}

// ════════════════════════════════════════════════════════════
// 2026-05-29 — Destination router
// Four menu buttons in #fzHome route here. Each destination
// renders into #fzDestBody; #fzHome hides while #fzDest is open.
// fzGoHome() reverses (back button + swipe-right gesture).
// ════════════════════════════════════════════════════════════
var _fzCurrentDest = null;

function fzOpenDest(dest){
  if (typeof document === 'undefined') return;
  var home   = document.getElementById('fzHome');
  var destEl = document.getElementById('fzDest');
  var titleEl= document.getElementById('fzDestTitle');
  var bodyEl = document.getElementById('fzDestBody');
  if (!home || !destEl || !titleEl || !bodyEl) return;

  // 2026-07-03 — Journey-home deep links into legacy Well surfaces. Thin
  // aliases only, no new features. 'worship' is its own app section (the
  // same door the Zone 3 topic card uses); the rest map to bf-* tab panels
  // inside Zone 3 — bfTab() auto-expands the wrap via
  // ensureFaithExploreOpenForTab and injects its own "← Back to Home" pill.
  // No destination takeover for any of these (like 'explore' below), so the
  // home stays visible under the opened panel.
  if (dest === 'worship'){
    if (D){
      D.faithLastDest = 'worship';
      if (typeof save === 'function') save();
    }
    if (typeof showSection === 'function') showSection('s-worship');
    return;
  }
  // 2026-07-03 — podcasts is its own page; browser back returns to the app
  // (which re-renders the journey home via the s-scripture entry hook).
  if (dest === 'podcasts'){
    if (typeof window !== 'undefined') window.location.href = '/app/podcasts.html';
    return;
  }
  var _fzTabAlias = {
    biblehub:'bible', timeline:'timeline', proof:'proofProphecy', archaeology:'bibleworld', prayerwall:'prayer',
    // 2026-07-03 — GROW + CHURCH & YOU cards (MORE-door retirement).
    // plans rides bfTab's readingPlans alias (pre-selects the reading
    // sub-tab); sermon notes live partway down the Journey panel.
    academy:'academy', plans:'readingPlans', devotional:'devotional', memorize:'memorize',
    traditions:'denominations', sermon:'journey'
  };
  // Scroll target per DEST where it isn't simply 'bf-' + tab.
  var _fzTabScrollId = { plans:'bf-plans', sermon:'sermonNotesList' };
  if (_fzTabAlias[dest]){
    if (D){
      D.faithLastDest = dest;
      if (typeof save === 'function') save();
    }
    var _fzTb = _fzTabAlias[dest];
    if (typeof bfTab === 'function') bfTab(_fzTb);
    setTimeout(function(){
      var p = document.getElementById(_fzTabScrollId[dest] || ('bf-' + _fzTb));
      if (p) p.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 120);
    return;
  }

  // Explore is special — no destination takeover. The legacy Zone 3
  // wrap holds ~1700 lines of bf-* panels with IDs + handlers that
  // can't be safely cloned or moved. Just toggle the existing
  // collapse, scroll to it, and stay on the home view.
  if (dest === 'explore'){
    if (D){
      D.faithLastDest = 'explore';
      if (typeof save === 'function') save();
    }
    if (typeof toggleFaithExplore === 'function') toggleFaithExplore(true);
    setTimeout(function(){
      var wrap = document.getElementById('fzZone3Wrap');
      if (wrap) wrap.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 80);
    return;
  }

  _fzCurrentDest = dest;
  // 2026-05-30 — track lastDest so the next 24h+ welcome screen
  // can offer "Continue where you left off".
  if (D){
    D.faithLastDest = dest;
    if (typeof save === 'function') save();
  }
  home.style.display = 'none';
  destEl.style.display = '';
  bodyEl.innerHTML = '';

  if (dest === 'mystery'){
    titleEl.textContent = "Today's Mystery";
    // Recreate the host div the existing renderer expects.
    bodyEl.innerHTML = '<div id="fzZone1" class="fz-zone fz-zone-1" aria-label="Convince Me hero"></div>';
    if (typeof renderConvinceMeHero === 'function') renderConvinceMeHero();
  } else if (dest === 'prayer'){
    // 2026-07-03 — unified Prayer hub. ONE door for every prayer surface,
    // composed from the existing renderers (no new features):
    //   Quick Prayers — composer + full library (each prayer's "Pray" button
    //                   already opens the Pray-This focus overlay)
    //   My Prayers    — quick-prayer journal (write / answered / history)
    //   Focus         — today's rotating prayer + a straight door into
    //                   openPrayerFocus (prayer-focus.js)
    // The legacy Prayer Wall (#bf-prayer: requests, praises, how-to,
    // examples, who-to-pray) is pinned to static Zone 3 markup and can't be
    // inlined — the door row below routes there via fzPrayerOpenWall().
    titleEl.textContent = "Prayer";
    bodyEl.innerHTML =
      '<div class="fz-ph-tabs" role="tablist">' +
        '<button type="button" class="fz-ph-tab active" data-ph-tab="quick" onclick="fzPrayerHubTab(\'quick\')">Quick Prayers</button>' +
        '<button type="button" class="fz-ph-tab" data-ph-tab="mine" onclick="fzPrayerHubTab(\'mine\')">My Prayers</button>' +
        '<button type="button" class="fz-ph-tab" data-ph-tab="focus" onclick="fzPrayerHubTab(\'focus\')">Focus</button>' +
      '</div>' +
      '<div id="fzPhQuick">' +
        '<div class="fz-dest-intro">What\'s on your heart right now?</div>' +
        '<div id="fzPrayerCard" class="fz-today-card fz-prayer-card" role="button" tabindex="0"></div>' +
        '<div id="quickPrayerLibrary" style="margin-top:1.75rem;"></div>' +
      '</div>' +
      '<div id="fzPhMine" style="display:none;">' +
        '<div id="fzQuickPrayerJournal"></div>' +
      '</div>' +
      '<div id="fzPhFocus" style="display:none;"></div>' +
      '<button type="button" class="fz-ph-wall" onclick="fzPrayerOpenWall()">' +
        '<span aria-hidden="true" style="font-size:1.3rem;">🕊️</span>' +
        '<span style="flex:1;min-width:0;">Prayer Wall' +
          '<span class="fz-ph-wall-sub">Requests, praises &amp; answered — plus how to pray</span>' +
        '</span>' +
        '<span aria-hidden="true">→</span>' +
      '</button>';
    if (typeof renderQuickPrayerCard       === 'function') renderQuickPrayerCard();
    if (typeof renderQuickPrayerLibrary    === 'function') renderQuickPrayerLibrary('quickPrayerLibrary');
    if (typeof renderQuickPrayerJournal    === 'function') renderQuickPrayerJournal();
    _fzRenderPrayerFocusTab();
  } else if (dest === 'reallife'){
    titleEl.textContent = "Real Life Win";
    bodyEl.innerHTML = renderRealLifeWinDestination();
  } else if (dest === 'reflect'){
    titleEl.textContent = "Night Reflection";
    // The "Start Reflection →" button opens the existing 3-step
    // overlay (openNightReflect lives in this file). Past
    // reflections render below into #fzReflectionsHistory — the
    // same host that the bf-prayer panel uses, so the renderer
    // works unchanged.
    bodyEl.innerHTML =
      '<div class="fz-reflect-intro">' +
        '<div class="fz-reflect-intro-emoji" aria-hidden="true">🌙</div>' +
        '<div class="fz-reflect-intro-body">Take 2 minutes to reflect on your day with God.</div>' +
      '</div>' +
      '<button class="fz-rlw-btn" onclick="openNightReflect()" style="display:block;margin:1.5rem auto 0;">' +
        'Start Reflection →' +
      '</button>' +
      '<div id="fzReflectionsHistory" style="margin-top:2rem;"></div>';
    if (typeof renderReflectionsHistory === 'function') renderReflectionsHistory();
  } else if (dest === 'growth'){
    titleEl.textContent = "Growth Profile";
    bodyEl.innerHTML =
      '<div class="fz-growth-explainer">' +
        '<div class="fzg-explain-emoji" aria-hidden="true">✦</div>' +
        '<h3 class="fzg-explain-title">Seven traits. One you.</h3>' +
        '<p class="fzg-explain-text">' +
          'Every action in the app grows the traits that match it. ' +
          'Pray for someone → Compassion grows. Face a hard question → ' +
          'Courage grows. Show up daily → Discipline grows.' +
        '</p>' +
        '<p class="fzg-explain-text-sub">Tap any trait to see what builds it.</p>' +
      '</div>' +
      '<div id="fzGrowthFull"></div>';
    renderGrowthFull();
  } else if (dest === 'heart'){
    titleEl.textContent = "Heart Check";
    bodyEl.innerHTML = renderHeartCheckPicker();
  } else if (dest === 'walk'){
    // My Walk with God — full-height pathway via the standard destination
    // takeover. renderWalkPath (walk-path.js) draws the node trail, golden-cross
    // horizon, "YOU ARE HERE" beacon, and weekly quests into #walkPathWrap.
    // typeof-guarded so a module-load failure falls back to an empty panel
    // instead of blanking the app.
    titleEl.textContent = "✨ My Walk with God";
    bodyEl.innerHTML = '<div id="walkPathWrap"></div><div id="walkJournalWrap"></div>';
    if (typeof window.renderWalkPath === 'function'){ window.renderWalkPath('walkPathWrap'); }
    // "My Journey so far" — journal below the quest board (additive; reads
    // existing D.walk state only, no walk-path.js edits).
    renderWalkJournal('walkJournalWrap');
    _fjInstallWalkJournalHooks();
  }

  setTimeout(function(){ destEl.scrollIntoView({ behavior:'smooth', block:'start' }); }, 60);
}

// ════════════════════════════════════════════════════════════
// 2026-07-03 — Prayer hub helpers (tabs · Focus tab · Prayer Wall door)
// ════════════════════════════════════════════════════════════
function fzPrayerHubTab(tab){
  if (typeof document === 'undefined') return;
  var map = { quick:'fzPhQuick', mine:'fzPhMine', focus:'fzPhFocus' };
  Object.keys(map).forEach(function(k){
    var el = document.getElementById(map[k]);
    if (el) el.style.display = (k === tab) ? '' : 'none';
  });
  var tabs = document.querySelectorAll('.fz-ph-tab');
  for (var i = 0; i < tabs.length; i++){
    tabs[i].classList.toggle('active', tabs[i].getAttribute('data-ph-tab') === tab);
  }
}

// Today's rotating library prayer — same day-of-year pick pattern as Real
// Life Wins, same data source the library renders from (window.QUICK_PRAYERS).
function _fzTodaysLibraryPrayer(){
  var list = (typeof window !== 'undefined' && Array.isArray(window.QUICK_PRAYERS)) ? window.QUICK_PRAYERS : [];
  if (!list.length) return null;
  return list[Math.floor(Date.now() / 86400000) % list.length] || null;
}

function _fzRenderPrayerFocusTab(){
  if (typeof document === 'undefined') return;
  var host = document.getElementById('fzPhFocus');
  if (!host) return;
  var p = _fzTodaysLibraryPrayer();
  if (!p){
    host.innerHTML = '<div class="fz-empty">The prayer library is still loading…</div>';
    return;
  }
  host.innerHTML =
    '<div class="fz-rlw-card">' +
      '<div class="fz-rlw-emoji" aria-hidden="true">🕊️</div>' +
      '<div class="fz-rlw-cat">Today\'s focus</div>' +
      '<div class="fz-rlw-text">' + _fzEsc(p.title || '') + '</div>' +
      (p.verse ? '<div class="fz-dest-intro">' + _fzEsc(p.verse) + '</div>' : '') +
      '<button class="fz-rlw-btn" onclick="fzPrayerFocusToday()">Begin focus 🕊️</button>' +
    '</div>';
}

// Opens the Pray-This overlay with today's prayer — the exact payload the
// library's per-prayer "Pray" button passes (quick-prayers.js).
function fzPrayerFocusToday(){
  var p = _fzTodaysLibraryPrayer();
  if (!p) return;
  if (typeof window !== 'undefined' && typeof window.openPrayerFocus === 'function'){
    window.openPrayerFocus({ title: p.title, text: p.text, verse: p.verse, trait: 'faith', traitAmount: 3 });
  } else if (typeof showToast === 'function'){
    showToast('Prayer focus unavailable — reload the app');
  }
}

// Hub → legacy Prayer Wall (#bf-prayer, static Zone 3 markup inside #fzHome).
// Close the hub dest, reveal the classic home that hosts Zone 3, then route
// through the 'prayerwall' tab alias (bfTab('prayer') + scroll). Journey
// users get the same "back to your journey" pill the More door injects.
function fzPrayerOpenWall(){
  if (typeof document === 'undefined') return;
  var dest = document.getElementById('fzDest');
  var body = document.getElementById('fzDestBody');
  var home = document.getElementById('fzHome');
  if (dest) dest.style.display = 'none';
  if (body) body.innerHTML = '';
  _fzCurrentDest = null;
  if (home) home.style.display = '';
  if (_fjHomeOn() && home && !document.getElementById('fjExploreBack')){
    var b = document.createElement('button');
    b.id = 'fjExploreBack'; b.type = 'button';
    b.textContent = '← Back to your journey';
    b.style.cssText = 'display:block;width:100%;margin:0 0 .75rem;padding:.7rem 1rem;border:1px solid rgba(245,180,49,.4);border-radius:12px;background:rgba(245,180,49,.1);color:#f5b431;font:600 .8rem/1 Oswald,sans-serif;letter-spacing:.04em;cursor:pointer;';
    b.onclick = function(){ var x = document.getElementById('fjExploreBack'); if (x) x.remove(); if (typeof renderFaithJourneyHome === 'function') renderFaithJourneyHome(); };
    home.insertBefore(b, home.firstChild);
  }
  if (typeof fzOpenDest === 'function') fzOpenDest('prayerwall');
}

// ════════════════════════════════════════════════════════════
// 2026-05-30 — Heart Check
// 12 emotional states (HEART_CHECK in data/heart-check-data.js).
// Picker → response flow: tap an emotion → see verse + prayer +
// action. Each response has two CTAs ("I prayed this" → faith +2;
// "I'll do this" → trait+3 keyed off the entry's `.trait` field).
// Usage logged to D.heartChecks (cap 100). Lives entirely inside
// #fzDestBody — no new top-level markup beyond the menu button.
// ════════════════════════════════════════════════════════════
function renderHeartCheckPicker(){
  if (typeof HEART_CHECK === 'undefined'){
    return '<div class="fz-empty">Heart Check is loading…</div>';
  }
  var keys = Object.keys(HEART_CHECK);
  var cells = keys.map(function(key){
    var item = HEART_CHECK[key];
    return '<button class="hc-emotion" onclick="openHeartCheck(\'' + _fzEsc(key) + '\')" aria-label="' + _fzEsc(item.label) + '">' +
             '<span class="hc-emoji" aria-hidden="true">' + _fzEsc(item.emoji) + '</span>' +
             '<span class="hc-label">' + _fzEsc(item.label) + '</span>' +
           '</button>';
  }).join('');
  return ''
    + '<div class="hc-intro">'
    +   '<div class="hc-intro-emoji" aria-hidden="true">💙</div>'
    +   '<div class="hc-intro-text">How are you really feeling right now?</div>'
    +   '<div class="hc-intro-sub">No filter. Pick what\'s closest.</div>'
    + '</div>'
    + '<div class="hc-grid">' + cells + '</div>';
}

function openHeartCheck(key){
  if (typeof document === 'undefined') return;
  if (typeof HEART_CHECK === 'undefined') return;
  var item = HEART_CHECK[key];
  if (!item) return;
  var bodyEl = document.getElementById('fzDestBody');
  if (!bodyEl) return;

  bodyEl.innerHTML =
    '<button class="hc-back-to-picker" onclick="backToHeartPicker()">← Different feeling</button>' +
    '<div class="hc-response">' +
      '<div class="hc-emoji-large" aria-hidden="true">' + _fzEsc(item.emoji) + '</div>' +
      '<div class="hc-headline">' + _fzEsc(item.headline) + '</div>' +
      '<div class="hc-section hc-verse-section">' +
        '<div class="hc-section-label">A VERSE FOR THIS</div>' +
        '<blockquote class="hc-verse">' + _fzEsc(item.verse) + '</blockquote>' +
        '<div class="hc-verse-ref">— ' + _fzEsc(item.verseRef) + '</div>' +
      '</div>' +
      '<div class="hc-section hc-prayer-section">' +
        '<div class="hc-section-label">PRAYER FOR RIGHT NOW</div>' +
        '<div class="hc-prayer">' + _fzEsc(item.prayer) + '</div>' +
        '<button class="hc-pray-btn" onclick="hcPrayWithThis(\'' + _fzEsc(key) + '\', this)">I prayed this 🙏</button>' +
      '</div>' +
      '<div class="hc-section hc-action-section">' +
        '<div class="hc-section-label">ONE THING TO DO</div>' +
        '<div class="hc-action">' + _fzEsc(item.action) + '</div>' +
        '<button class="hc-action-btn" onclick="hcDidAction(\'' + _fzEsc(key) + '\', this)">I\'ll do this →</button>' +
      '</div>' +
      '<div class="hc-footer">' +
        '<button class="hc-more-btn" onclick="backToHeartPicker()">Try a different feeling</button>' +
      '</div>' +
    '</div>';

  // Track usage. Cap to most recent 100 entries to keep the cloud
  // blob lean. Recorded the moment the user opens an emotion —
  // even if they don't tap any CTA — so the log reflects what
  // they were looking for, not just what they completed.
  if (D){
    if (!Array.isArray(D.heartChecks)) D.heartChecks = [];
    D.heartChecks.push({ key:key, date:new Date().toISOString() });
    if (D.heartChecks.length > 100){
      D.heartChecks = D.heartChecks.slice(-100);
    }
    _fzSave();
  }
}

function backToHeartPicker(){
  if (typeof document === 'undefined') return;
  var bodyEl = document.getElementById('fzDestBody');
  if (bodyEl) bodyEl.innerHTML = renderHeartCheckPicker();
}

// btn arg passed from the inline onclick so we don't rely on the
// (now-deprecated, Safari-flaky) `event` global.
function hcPrayWithThis(key, btn){
  if (typeof prayerDove === 'function' && btn) prayerDove(btn);
  if (typeof awardTrait === 'function') awardTrait('faith', 2);
  if (btn){
    btn.textContent = 'Amen 🙏';
    btn.disabled = true;
  }
}

function hcDidAction(key, btn){
  if (typeof HEART_CHECK === 'undefined') return;
  var item = HEART_CHECK[key];
  if (!item) return;
  if (typeof traitExplosion === 'function' && typeof TRAITS !== 'undefined' && item.trait && TRAITS[item.trait]){
    var t = TRAITS[item.trait];
    traitExplosion(t.emoji, t.name);
  }
  if (typeof awardTrait === 'function' && item.trait){
    awardTrait(item.trait, 3);
  }
  if (typeof screenFlash === 'function') screenFlash('#7b68ee', 200);
  if (btn){
    btn.textContent = "You're doing it ✓";
    btn.disabled = true;
  }
}

// 2026-05-29 (rev. 2026-05-26) — Growth Profile destination renderer.
// All 7 traits as cards with collapsed header → tap-to-expand inline
// detail (what-it-means, how-to-grow-it, your-journey through the 5
// levels). Reads the same TRAITS map + getTraitLevel from traits.js
// that renderGrowthCompact uses, just shows the full set + expansion.
function renderGrowthFull(){
  if (typeof document === 'undefined') return;
  var el = document.getElementById('fzGrowthFull');
  if (!el) return;
  if (typeof TRAITS === 'undefined'){
    el.innerHTML = '<div style="color:var(--tx2);text-align:center;padding:2rem;">Growth engine loading…</div>';
    return;
  }
  var thresholds = (typeof TRAIT_THRESHOLDS !== 'undefined') ? TRAIT_THRESHOLDS : [0,50,150,350,700];
  var keys = Object.keys(TRAITS);
  var html = '';
  for (var i = 0; i < keys.length; i++){
    var key = keys[i];
    var t = TRAITS[key];
    if (!t) continue;
    var pts = +((D && D.traits && D.traits[key]) || 0);
    var lvl = (typeof getTraitLevel === 'function') ? getTraitLevel(key, pts) : 0;
    var currentThreshold = thresholds[lvl] || 0;
    var nextIdx = Math.min(lvl + 1, thresholds.length - 1);
    var nextThreshold = thresholds[nextIdx] || 1;
    var inLevel = Math.max(0, pts - currentThreshold);
    var range = Math.max(1, nextThreshold - currentThreshold);
    var atMax = lvl >= thresholds.length - 1;
    var pct = atMax ? 100 : Math.min(100, Math.round((inLevel / range) * 100));
    var levelName = t.levels[lvl] || t.levels[t.levels.length - 1];
    var nextLevelName = atMax ? null : (t.levels[lvl + 1] || 'Max');
    var pointsToNext = atMax ? 0 : (nextThreshold - pts);

    // Clearer progress label per spec PART 4:
    //   max level → "✨ Max level reached"
    //   no progress yet in this level (pointsToNext === full range) →
    //                  "Tap actions to grow this trait"
    //   otherwise → "23 more to Brave"
    var nextLabel;
    if (atMax){
      nextLabel = '✨ Max level reached';
    } else if (pointsToNext === range){
      nextLabel = 'Tap actions to grow this trait';
    } else {
      nextLabel = pointsToNext + ' more to ' + _fzEsc(nextLevelName);
    }

    // Per-trait "how to grow it" list. Defined below; falls back to a
    // generic line if the key is unknown.
    var actions = getActionsForTrait(key);
    var actionsHtml = '';
    for (var a = 0; a < actions.length; a++){
      actionsHtml += '<li>' + _fzEsc(actions[a]) + '</li>';
    }

    // The 5-level journey rail. Reached levels get a checkmark + filled
    // dot; the current level is bordered; future levels are faded.
    var levelsHtml = '';
    for (var li = 0; li < t.levels.length; li++){
      var cls = 'fzg-level-item';
      if (li <= lvl) cls += ' fzg-level-reached';
      if (li === lvl) cls += ' fzg-level-current';
      var dot = (li <= lvl) ? '✓' : String(li + 1);
      var thresholdPts = thresholds[li] != null ? thresholds[li] : 0;
      levelsHtml += ''
        + '<div class="' + cls + '">'
        +   '<span class="fzg-level-dot">' + dot + '</span>'
        +   '<span class="fzg-level-name">' + _fzEsc(t.levels[li]) + '</span>'
        +   '<span class="fzg-level-pts">' + thresholdPts + ' pts</span>'
        + '</div>';
    }

    var keyEsc = _fzEsc(key);
    html += ''
      + '<div class="fz-growth-card" data-trait="' + keyEsc + '" '
      +      'onclick="toggleTraitDetail(\'' + keyEsc + '\')" '
      +      'role="button" tabindex="0">'
      +   '<div class="fz-growth-card-header">'
      +     '<span class="fz-growth-emoji" aria-hidden="true">' + _fzEsc(t.emoji) + '</span>'
      +     '<div class="fz-growth-info">'
      +       '<div class="fz-growth-name">' + _fzEsc(t.name) + '</div>'
      +       '<div class="fz-growth-level">Level ' + (lvl + 1) + ': ' + _fzEsc(levelName) + '</div>'
      +     '</div>'
      +     '<span class="fz-growth-expand" id="exp-' + keyEsc + '" aria-hidden="true">▼</span>'
      +   '</div>'
      +   '<div class="fz-growth-track" aria-hidden="true">'
      +     '<div class="fz-growth-fill" style="width:' + pct + '%"></div>'
      +   '</div>'
      +   '<div class="fz-growth-next">' + nextLabel + '</div>'
      +   '<div class="fz-growth-detail" id="detail-' + keyEsc + '" style="display:none;">'
      +     '<div class="fzg-detail-section">'
      +       '<div class="fzg-detail-label">WHAT IT MEANS</div>'
      +       '<div class="fzg-detail-text">' + _fzEsc(t.desc || '') + '</div>'
      +     '</div>'
      +     '<div class="fzg-detail-section">'
      +       '<div class="fzg-detail-label">HOW TO GROW IT</div>'
      +       '<ul class="fzg-grow-list">' + actionsHtml + '</ul>'
      +     '</div>'
      +     '<div class="fzg-detail-section">'
      +       '<div class="fzg-detail-label">YOUR JOURNEY</div>'
      +       '<div class="fzg-levels-list">' + levelsHtml + '</div>'
      +     '</div>'
      +   '</div>'
      + '</div>';
  }
  el.innerHTML = html;
}

// Returns the human-readable action list for "HOW TO GROW IT". Each
// entry is a one-line cue describing a real in-app interaction that
// awards points to the trait via awardTrait() (see traits.js callsites).
function getActionsForTrait(traitKey){
  var actionsByTrait = {
    courage: [
      'Tap "I’m Curious" on Today’s Mystery (+3)',
      'Pick "Doubting" or "Tempted" on Heart Check (+3)',
      'Complete a Real Life Win in the Courage category (+5)'
    ],
    discipline: [
      'Complete daily habits (+3 each)',
      'Finish chores (+2 each)',
      'Complete the Daily Faith Challenge (+2)',
      'Hit goal milestones (+2)'
    ],
    compassion: [
      'Submit a Quick Prayer mentioning someone (+3)',
      'Complete relational Real Life Wins (+3 to +5)',
      'Pick "Lonely" or "Heartbroken" on Heart Check (+2)'
    ],
    wisdom: [
      'Complete a Night Reflection (+2)',
      'Read your daily devotional (+3)',
      'Add a memory verse (+1)',
      'Bible reading plan progress (+3)'
    ],
    integrity: [
      'Anonymous acts of kindness Real Life Wins (+5)',
      'Pick "Angry" or "Tempted" on Heart Check (+3)',
      'Complete chores without reminders (+1)'
    ],
    gratitude: [
      'Complete a Night Reflection (+2)',
      'Pick "Grateful" or "Joyful" on Heart Check (+3)',
      'Presence-category Real Life Wins (+3)'
    ],
    faith: [
      'Submit any Quick Prayer (+2)',
      'Engage with Convince Me cards (+2 each new card)',
      'Complete the Daily Faith Challenge (+3)',
      'Read your daily devotional (+2)'
    ]
  };
  return actionsByTrait[traitKey] || ['Take actions across the app to grow this trait'];
}

// Single-open accordion — tapping a card opens its detail and closes
// any other open card. Tapping the same card again collapses it.
// Smooth-scrolls the now-expanded card into the viewport so the user
// can see the new content without manual scrolling.
function toggleTraitDetail(key){
  if (typeof document === 'undefined') return;
  var detail = document.getElementById('detail-' + key);
  var expand = document.getElementById('exp-' + key);
  if (!detail) return;
  var isOpen = detail.style.display !== 'none';
  // Close every open detail first so we behave as a single-open accordion.
  var allDetails = document.querySelectorAll('.fz-growth-detail');
  for (var i = 0; i < allDetails.length; i++) allDetails[i].style.display = 'none';
  var allExpand = document.querySelectorAll('.fz-growth-expand');
  for (var j = 0; j < allExpand.length; j++) allExpand[j].textContent = '▼';
  // Also drop the "expanded" modifier from every card so the
  // grid-column override (full-width on tablets+) clears.
  var allCards = document.querySelectorAll('.fz-growth-card');
  for (var k = 0; k < allCards.length; k++) allCards[k].classList.remove('fz-growth-card-expanded');
  if (!isOpen){
    detail.style.display = 'block';
    if (expand) expand.textContent = '▲';
    var card = detail.closest('.fz-growth-card');
    if (card){
      card.classList.add('fz-growth-card-expanded');
      setTimeout(function(){
        try { card.scrollIntoView({ behavior:'smooth', block:'nearest' }); } catch (_e) {}
      }, 100);
    }
  }
}

function fzGoHome(){
  if (typeof document === 'undefined') return;
  // Phase 3 — flag ON: back returns to the JOURNEY home (not the classic
  // #fzHome). Close the open destination, then re-render the journey home
  // (which re-shows #fzJourneyHome, hides #fzHome, and rebuilds greeting/
  // streak/scene/doorways). Flag OFF falls through to the existing logic below,
  // byte-identical. Thin conditional only — fzOpenDest + sub-views untouched.
  if (_fjHomeOn()){
    _fzCurrentDest = null;
    var jdest = document.getElementById('fzDest');
    var jbody = document.getElementById('fzDestBody');
    if (jdest) jdest.style.display = 'none';
    if (jbody) jbody.innerHTML = '';
    var jz3 = document.getElementById('fzZone3Wrap');
    if (jz3) jz3.style.display = 'none';
    if (typeof D !== 'undefined' && D) D.faithExploreOpen = false;
    if (typeof renderFaithJourneyHome === 'function') renderFaithJourneyHome();
    var jsec = document.getElementById('s-scripture');
    if (jsec) setTimeout(function(){ jsec.scrollIntoView({ behavior:'smooth', block:'start' }); }, 40);
    return;
  }
  _fzCurrentDest = null;
  var dest = document.getElementById('fzDest');
  var home = document.getElementById('fzHome');
  var body = document.getElementById('fzDestBody');
  if (dest) dest.style.display = 'none';
  if (home) home.style.display = '';
  if (body) body.innerHTML = '';
  // 2026-05-30 — re-collapse Zone 3 when returning home so the
  // Ask Scripture card + legacy sub-tab pills don't hang around
  // below the menu (only the Explore button should reveal them).
  var z3 = document.getElementById('fzZone3Wrap');
  if (z3) z3.style.display = 'none';
  if (D) D.faithExploreOpen = false;
  renderFzGreeting();
  var sec = document.getElementById('s-scripture');
  if (sec) setTimeout(function(){ sec.scrollIntoView({ behavior:'smooth', block:'start' }); }, 40);
}

// 2026-05-29 — Real Life Win destination. Big card, single CTA.
// Today's win comes from REAL_LIFE_WINS (faith-zones-data.js),
// indexed by day so the same win shows globally on a given day.
// Completion fires the full Session 4 celebration stack +
// awardTrait + persists to D.dailyThree[today].realWin.
function renderRealLifeWinDestination(){
  if (typeof REAL_LIFE_WINS === 'undefined' || !REAL_LIFE_WINS.length){
    return '<div class="fz-empty">Real Life Wins are loading…</div>';
  }
  var dayIndex = Math.floor(Date.now() / 86400000) % REAL_LIFE_WINS.length;
  var win = REAL_LIFE_WINS[dayIndex];
  var todayKey = _fzToday();
  var done = !!(D && D.dailyThree && D.dailyThree[todayKey] && D.dailyThree[todayKey].realWin);
  var btn = done
    ? '<div class="fz-rlw-done">✓ You did this today. That counts.</div>'
    : '<button class="fz-rlw-btn" onclick="fzCompleteRLW(\'' + _fzEsc(win.id) +
        '\',\'' + _fzEsc(win.trait) + '\',' + (+win.pts || 0) + ')">I did it ✓</button>';
  return ''
    + '<div class="fz-rlw-card">'
    +   '<div class="fz-rlw-emoji">' + _fzEsc(win.emoji) + '</div>'
    +   '<div class="fz-rlw-cat">' + _fzEsc(win.cat) + '</div>'
    +   '<div class="fz-rlw-text">' + _fzEsc(win.text) + '</div>'
    +   btn
    + '</div>';
}

function fzCompleteRLW(winId, trait, pts){
  if (!D) return;
  if (!D.dailyThree || typeof D.dailyThree !== 'object' || Array.isArray(D.dailyThree)){
    D.dailyThree = {};
  }
  var today = _fzToday();
  if (!D.dailyThree[today]) D.dailyThree[today] = { faith:false, growth:false, realWin:false };
  if (D.dailyThree[today].realWin) return; // already done — guard double-credit
  D.dailyThree[today].realWin   = true;
  D.dailyThree[today].realWinId = winId;
  _fzSave();

  if (typeof realLifeWinCelebration === 'function') realLifeWinCelebration();
  if (typeof traitExplosion === 'function' && typeof TRAITS !== 'undefined' && TRAITS[trait]){
    setTimeout(function(){ traitExplosion(TRAITS[trait].emoji, TRAITS[trait].name); }, 600);
  }
  if (typeof awardTrait === 'function' && trait && pts){
    awardTrait(trait, pts);
  }
  // Re-render the destination so the button → "done" state swaps in.
  setTimeout(function(){
    if (_fzCurrentDest === 'reallife') fzOpenDest('reallife');
  }, 1600);
}

// ────────────────────────────────────────────────────────────
// Swipe-right gesture → fzGoHome. Attached to document so the
// listener catches taps anywhere inside #fzDest regardless of
// when the destination markup is mounted (the body re-renders
// per dest). Only acts when a destination is currently open.
// ────────────────────────────────────────────────────────────
var _fzDestSwipe = null;
if (typeof document !== 'undefined'){
  document.addEventListener('touchstart', function(e){
    if (!_fzCurrentDest) return;
    var dest = document.getElementById('fzDest');
    if (!dest || dest.style.display === 'none') return;
    // Only fire if the touch started inside the destination.
    if (!dest.contains(e.target)) return;
    if (!e.touches || !e.touches.length) return;
    _fzDestSwipe = { x:e.touches[0].clientX, y:e.touches[0].clientY, t:Date.now() };
  }, { passive:true });
  document.addEventListener('touchend', function(e){
    if (!_fzDestSwipe) return;
    var t = e.changedTouches && e.changedTouches[0];
    var s = _fzDestSwipe;
    _fzDestSwipe = null;
    if (!t) return;
    var dx = t.clientX - s.x;
    var dy = t.clientY - s.y;
    var dt = Date.now() - s.t;
    // Right swipe: 80px+ horizontal, <50px vertical, <500ms.
    if (dx > 80 && Math.abs(dy) < 50 && dt < 500) fzGoHome();
  }, { passive:true });
}

// ════════════════════════════════════════════════════════════
// 2026-05-30 — Smart Welcome Back (24h+ returners)
// renderFaithZones() gates here when (Date.now() - faithLastVisit)
// crosses 24 hours. Surfaces a time-aware greeting, an optional
// "Continue {lastDest}" CTA, 3 paths tuned to the current hour,
// and a "Just browsing" escape that drops to the regular home.
// ════════════════════════════════════════════════════════════

function showWelcomeBack(){
  if (typeof document === 'undefined') return;
  var home = document.getElementById('fzHome');
  var dest = document.getElementById('fzDest');
  var z3   = document.getElementById('fzZone3Wrap');
  var welc = document.getElementById('fzWelcome');
  if (home) home.style.display = 'none';
  if (dest) dest.style.display = 'none';
  if (z3)   z3.style.display   = 'none';
  if (!welc) return;
  welc.style.display = 'block';
  renderWelcomeGreeting();
  renderContinueOption();
  renderTimeAwarePaths();
}

function _fzFirstName(){
  // Resolution chain — ONE source of truth for every greeting in the app.
  //
  // 1. Active CHILD profile: when a kid is using a child slot on the
  //    family parent's account, their child profile name is what we
  //    want to greet (e.g. "Amanda") — NOT the parent's auth metadata
  //    ("Jason Vega"). We explicitly check isParent === false; an
  //    active PARENT profile falls through to auth metadata below.
  //
  // 2. Current auth metadata: the live signed-in user's name from the
  //    signup form. Always preferred over D.name because D.name can be
  //    a stale cloud-synced value from a prior testing session (this
  //    is what was making the home greeting show "Jason" for a user
  //    whose signup name was different).
  //
  // 3. D.name (fallback for legacy accounts where metadata is empty).
  //
  // 4. Email local-part, then 'friend'.
  try {
    if (typeof _profiles !== 'undefined' && Array.isArray(_profiles)
        && typeof _activeProfileId !== 'undefined' && _activeProfileId){
      var _ap = _profiles.find(function(p){ return p && p.id === _activeProfileId; });
      if (_ap && _ap.isParent === false && _ap.name){
        return String(_ap.name).split(' ')[0];
      }
    }
  } catch(_){}
  if (typeof _supaUser !== 'undefined' && _supaUser){
    var meta = _supaUser.user_metadata || {};
    if (meta.first_name) return meta.first_name;
    if (meta.full_name)  return String(meta.full_name).split(' ')[0];
  }
  if (D && D.name) return String(D.name).split(' ')[0];
  if (typeof _supaUser !== 'undefined' && _supaUser && _supaUser.email){
    return _supaUser.email.split('@')[0];
  }
  return 'friend';
}
// Single source of truth for first-name resolution across the app.
// app-home.js, renderFzGreeting, and any future greeting code call this
// rather than re-implementing the chain. Keeps fixes in one place.
if (typeof window !== 'undefined') window._fzFirstName = _fzFirstName;

function renderWelcomeGreeting(){
  if (typeof document === 'undefined') return;
  var el = document.getElementById('fzWelcomeGreeting');
  if (!el) return;
  var h = new Date().getHours();
  var part = (h < 5)  ? 'late night'
           : (h < 12) ? 'morning'
           : (h < 17) ? 'afternoon'
           : (h < 21) ? 'evening'
           : 'night';
  var name = _fzFirstName();
  var streak = 0;
  if (D){
    streak = (typeof D.faithCuriosityStreak === 'number' && D.faithCuriosityStreak > 0)
      ? D.faithCuriosityStreak
      : ((typeof getScriptureStreak === 'function')
          ? (getScriptureStreak() || 0)
          : ((typeof D.streak === 'number') ? D.streak : 0));
  }
  var last = (D && +D.faithLastVisit) || 0;
  var daysAway = last ? Math.floor((Date.now() - last) / (24 * 60 * 60 * 1000)) : 0;
  var comeback;
  if (daysAway <= 1)      comeback = "Glad you're back.";
  else if (daysAway <= 3) comeback = "Good to see you again.";
  else if (daysAway <= 7) comeback = "Welcome back. We missed you.";
  else                    comeback = "Welcome back — it's been a while.";
  var streakLine = streak > 0
    ? '<div class="fz-welcome-streak">🔥 ' + streak + ' day streak</div>'
    : '';
  el.innerHTML =
    '<div class="fz-welcome-greeting">Good ' + part + ', ' + _fzEsc(name) + ' 👋</div>' +
    '<div class="fz-welcome-sub">' + _fzEsc(comeback) + '</div>' +
    streakLine;
}

var _FZ_CONTINUE_LABELS = {
  mystery:  { emoji:'✝️',  text:"Continue Today's Mystery"  },
  prayer:   { emoji:'🙏',  text:"Continue your prayers"     },
  reallife: { emoji:'🌍',  text:"Continue your Real Life Win"},
  reflect:  { emoji:'🌙',  text:"Continue Night Reflection" },
  growth:   { emoji:'✦',   text:"Check your Growth"         },
  explore:  { emoji:'📖',  text:"Continue exploring"        },
  // 2026-07-03 — journey-home destinations + legacy deep links.
  walk:        { emoji:'✨', text:"Continue your Walk with God" },
  worship:     { emoji:'🎵', text:"Back to worship"             },
  biblehub:    { emoji:'📖', text:"Back to the Bible"           },
  timeline:    { emoji:'🗺️', text:"Continue the Bible Timeline" },
  proof:       { emoji:'📜', text:"Continue Proof & Prophecy"   },
  archaeology: { emoji:'🏺', text:"Keep exploring Bible Lands"  },
  prayerwall:  { emoji:'🕊️', text:"Back to the Prayer Wall"     },
  academy:     { emoji:'🎓', text:"Continue Faith Academy"      },
  plans:       { emoji:'📚', text:"Continue your reading plan"  },
  devotional:  { emoji:'🕊️', text:"Continue today's devotional" },
  memorize:    { emoji:'🧠', text:"Continue memory verses"      },
  traditions:  { emoji:'✝️', text:"Continue Christian Traditions"},
  sermon:      { emoji:'📝', text:"Back to your sermon notes"   }
};

function renderContinueOption(){
  if (typeof document === 'undefined') return;
  var wrap = document.getElementById('fzWelcomeContinue');
  var txt  = document.getElementById('fzContinueText');
  if (!wrap || !txt) return;
  var lastDest = D && D.faithLastDest;
  if (lastDest && _FZ_CONTINUE_LABELS[lastDest]){
    var d = _FZ_CONTINUE_LABELS[lastDest];
    txt.innerHTML = '<span class="fz-continue-emoji">' + _fzEsc(d.emoji) +
                    '</span>' + _fzEsc(d.text);
    wrap.style.display = 'block';
    wrap.dataset.dest = lastDest;
  } else {
    wrap.style.display = 'none';
    delete wrap.dataset.dest;
  }
}

// 4 time bands tuned to natural rhythms of the day. Each band
// surfaces 3 paths that fit the moment. Edge cases (e.g. user
// hits the page at 04:59) are absorbed into the night band.
function renderTimeAwarePaths(){
  if (typeof document === 'undefined') return;
  var el = document.getElementById('fzWelcomePaths');
  if (!el) return;
  var h = new Date().getHours();
  var paths;
  if (h >= 5 && h < 11){
    // MORNING — start the day with God
    paths = [
      { emoji:'✝️', title:"Start with today's mystery", sub:'A question to think on',    dest:'mystery'  },
      { emoji:'📖', title:'Open the Bible',             sub:'Daily reading or devotional', dest:'explore'  },
      { emoji:'🙏', title:'Pray over your day',         sub:'One breath of prayer',      dest:'prayer'   }
    ];
  } else if (h >= 11 && h < 17){
    // MIDDAY — keep momentum
    paths = [
      { emoji:'🌍', title:'Do a Real Life Win',         sub:'One action, off your phone', dest:'reallife' },
      { emoji:'✝️', title:"Today's mystery",            sub:'Quick curiosity hit',        dest:'mystery'  },
      { emoji:'🙏', title:'Quick prayer',               sub:"What's on your heart?",      dest:'prayer'   }
    ];
  } else if (h >= 17 && h < 21){
    // EVENING — pause and connect. Heart Check replaces the growth
    // tile here since evening is when emotional weight is highest.
    paths = [
      { emoji:'🙏', title:'Quick prayer',               sub:'Talk to God',                dest:'prayer'   },
      { emoji:'✝️', title:'A mystery to ponder',        sub:"Tonight's question",         dest:'mystery'  },
      { emoji:'💙', title:'Heart Check',                sub:'How are you really feeling?', dest:'heart'   }
    ];
  } else {
    // NIGHT (21:00 - 04:59) — wind down. Reflection + prayer +
    // Heart Check — the late-night user is most often the one
    // who needs Heart Check most.
    paths = [
      { emoji:'🌙', title:'Night reflection',           sub:'How was today?',             dest:'reflect'  },
      { emoji:'🙏', title:'Quick prayer before bed',    sub:'Hand it over',               dest:'prayer'   },
      { emoji:'💙', title:'How are you feeling?',       sub:'Heart Check',                dest:'heart'    }
    ];
  }
  el.innerHTML = paths.map(function(p){
    return '<button class="fz-welcome-path" onclick="fzWelcomePath(\'' + p.dest + '\')">' +
             '<span class="fz-welcome-path-emoji" aria-hidden="true">' + _fzEsc(p.emoji) + '</span>' +
             '<span class="fz-welcome-path-text">' +
               '<span class="fz-welcome-path-title">' + _fzEsc(p.title) + '</span>' +
               '<span class="fz-welcome-path-sub">' + _fzEsc(p.sub) + '</span>' +
             '</span>' +
             '<span class="fz-welcome-path-arrow" aria-hidden="true">→</span>' +
           '</button>';
  }).join('');
}

function fzWelcomeContinue(){
  var wrap = document.getElementById('fzWelcomeContinue');
  var dest = wrap && wrap.dataset && wrap.dataset.dest;
  if (!dest) return;
  _fzHideWelcomeShowHome();
  setTimeout(function(){ fzOpenDest(dest); }, 100);
}

function fzWelcomePath(dest){
  _fzHideWelcomeShowHome();
  setTimeout(function(){ fzOpenDest(dest); }, 100);
}

function fzWelcomeBrowse(){
  _fzHideWelcomeShowHome();
  renderFzGreeting();
}

function _fzHideWelcomeShowHome(){
  var w = document.getElementById('fzWelcome');
  var h = document.getElementById('fzHome');
  if (w) w.style.display = 'none';
  if (h) h.style.display = '';
}

// Expose for non-module callers (init.js, ui.js, faith.js, onclick attrs).
if (typeof window !== 'undefined'){
  window.fzOpenDest        = fzOpenDest;
  window.fzGoHome          = fzGoHome;
  window.fzCompleteRLW     = fzCompleteRLW;
  window.renderFzGreeting  = renderFzGreeting;
  window.renderGrowthFull  = renderGrowthFull;
  window.toggleTraitDetail = toggleTraitDetail;
  window.getActionsForTrait= getActionsForTrait;
  window.fzWelcomeContinue = fzWelcomeContinue;
  window.fzWelcomePath     = fzWelcomePath;
  window.fzWelcomeBrowse   = fzWelcomeBrowse;
  window.showWelcomeBack   = showWelcomeBack;
  // 2026-07-03 — journey-home footprint deep link (inline onclick on the
  // #fjStations markers rendered by _fjRenderStations).
  window._fjOpenWalkAt     = _fjOpenWalkAt;
  // 2026-07-03 — Prayer hub (inline onclick handlers) + walk journal.
  window.fzPrayerHubTab    = fzPrayerHubTab;
  window.fzPrayerFocusToday= fzPrayerFocusToday;
  window.fzPrayerOpenWall  = fzPrayerOpenWall;
  window.renderWalkJournal = renderWalkJournal;
  // 2026-05-30 — Heart Check public surface.
  window.openHeartCheck    = openHeartCheck;
  window.backToHeartPicker = backToHeartPicker;
  window.hcPrayWithThis    = hcPrayWithThis;
  window.hcDidAction       = hcDidAction;
  // Dev aid — call testWelcome() in DevTools to force-show the
  // welcome screen without waiting 24 hours for the gate to trip.
  // Spoofs faithLastVisit to 25h ago + faithLastDest to mystery.
  window.testWelcome = function(){
    if (typeof D === 'undefined' || !D) return;
    D.faithLastVisit = Date.now() - (25 * 60 * 60 * 1000);
    D.faithLastDest  = D.faithLastDest || 'mystery';
    if (typeof save === 'function') save();
    showWelcomeBack();
  };
}

if (typeof document !== 'undefined'){
  // Quick-prayers dataset lazy-loads (data/quick-prayers.js fires this once
  // the canonical JSON resolves). If the Prayer hub is open, refresh the
  // Focus tab so "Today's focus" swaps its loading line for the real prayer
  // — mirrors the library's own listener in quick-prayers.js.
  document.addEventListener('quick-prayers:loaded', function(){
    if (_fzCurrentDest === 'prayer') _fzRenderPrayerFocusTab();
  });
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden){
      // Refresh the greeting (time-of-day might've changed) +
      // the floating reflect button. Re-render the current
      // destination if one is open so its time-sensitive bits
      // (mood today, challenge today) stay current.
      renderFzGreeting();
      updateReflectFloatVisibility();
      if (_fzCurrentDest) {
        // Re-open the same destination to refresh its body.
        var d = _fzCurrentDest;
        _fzCurrentDest = null;
        fzOpenDest(d);
      }
    }
  });
}
