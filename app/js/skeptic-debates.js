// YourLife CC — Skeptic vs. Evidence (Proof & Prophecy §4b, 2026-07-06)
// Swipeable debate cards: each leads with the strongest skeptical
// objection at full strength → reveal the evidence response → optional
// "Dig Deeper" (3–4 paragraphs). The reader judges each round —
// swipe/tap LEFT "I'd say that too" (skeptic lands) or RIGHT "Evidence
// lands" — tracked PER SESSION ONLY (never persisted; this is
// exploration, not a quiz). Closing summary: "You found N of 12
// convincing." Cards with a proofId open the real PROOF_PROPHECY_DATA
// drawer via the cmOpenFullProof door pattern.
// Completion: SETTLE — evidence considered is not a quiz won. No XP,
// no streak.
// Containment: the whole surface is #skepticOverlay, display:none idle
// (0 flow height; can't intrude on the sidebar — the 2026-07-06 rule).

var _SK_CATS = [
  { key: 'all',           label: 'All' },
  { key: 'resurrection',  label: 'Resurrection' },
  { key: 'manuscripts',   label: 'Manuscripts' },
  { key: 'historical',    label: 'Historical' },
  { key: 'philosophical', label: 'Philosophical' }
];
var _skCat = 'all';
var _skDeck = [];
var _skIdx = 0;
var _skRevealed = false;
var _skVerdicts = {};       // { id: 'evidence' | 'skeptic' } — session only
var _skTouch = null;

function _skData(){ return (typeof window !== 'undefined' && window.SKEPTIC_DEBATES) || []; }
function _skEsc(s){
  if(typeof _fzEsc === 'function') return _fzEsc(s);
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function _skReduced(){
  try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  catch(_e){ return false; }
}
function _skBuildDeck(){
  var all = _skData();
  _skDeck = (_skCat === 'all') ? all.slice() : all.filter(function(d){ return d.category === _skCat; });
}

function skepticOpen(){
  var ov = document.getElementById('skepticOverlay');
  if(!ov || !_skData().length) return;
  _skCat = 'all'; _skVerdicts = {}; _skIdx = 0; _skRevealed = false;
  _skBuildDeck();
  ov.style.display = 'flex';
  try { document.body.style.overflow = 'hidden'; } catch(_e){}
  _skRender();
  if(!ov.dataset.keys){
    ov.dataset.keys = '1';
    document.addEventListener('keydown', function(e){
      var o = document.getElementById('skepticOverlay');
      if(!o || o.style.display === 'none') return;
      if(e.key === 'Escape') skepticClose();
      else if(_skRevealed && e.key === 'ArrowLeft') skepticJudge('skeptic');
      else if(_skRevealed && e.key === 'ArrowRight') skepticJudge('evidence');
    });
  }
}

function skepticClose(){
  var ov = document.getElementById('skepticOverlay');
  if(ov) ov.style.display = 'none';
  try { document.body.style.overflow = ''; } catch(_e){}
}

function skepticSetCat(cat){
  _skCat = cat; _skIdx = 0; _skRevealed = false;
  _skBuildDeck();
  _skRender();
}

function _skTabs(){
  return '<div class="sk-tabs" role="tablist">' + _SK_CATS.map(function(c){
    var n = (c.key === 'all') ? _skData().length : _skData().filter(function(d){ return d.category === c.key; }).length;
    return '<button type="button" class="sk-tab' + (c.key === _skCat ? ' on' : '') + '" onclick="skepticSetCat(\'' + c.key + '\')">' + _skEsc(c.label) + ' <span class="sk-tab-n">' + n + '</span></button>';
  }).join('') + '</div>';
}

function _skRender(){
  var host = document.getElementById('skepticHost');
  if(!host) return;
  if(_skIdx >= _skDeck.length){ _skRenderSummary(); return; }
  var d = _skDeck[_skIdx];
  var esc = _skEsc;
  var diffLabel = { common: 'Comes up often', serious: 'A serious one', hard: 'The hard case' }[d.difficulty] || '';
  host.innerHTML =
    '<div class="sk-top">' +
      '<button type="button" class="sk-close" onclick="skepticClose()" aria-label="Close">✕</button>' +
      '<div class="sk-count">' + (_skIdx + 1) + ' / ' + _skDeck.length + '</div>' +
    '</div>' +
    _skTabs() +
    '<div class="sk-card" id="skCard">' +
      '<div class="sk-badges"><span class="sk-cat sk-cat--' + esc(d.category) + '">' + esc(d.category) + '</span><span class="sk-diff">' + esc(diffLabel) + '</span></div>' +
      '<div class="sk-side sk-side--obj">' +
        '<div class="sk-eyebrow">The objection</div>' +
        '<div class="sk-obj">' + esc(d.objection) + '</div>' +
      '</div>' +
      (_skRevealed
        ? ('<div class="sk-side sk-side--ev">' +
             '<div class="sk-eyebrow sk-eyebrow--ev">The evidence</div>' +
             '<div class="sk-resp">' + esc(d.response) + '</div>' +
             '<button type="button" class="sk-dig" onclick="skepticDig(this)">Dig deeper ▾</button>' +
             '<div class="sk-detail" id="skDetail" hidden>' + d.detail.split(/\n\n+/).map(function(p){ return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
             (d.proofId ? '<button type="button" class="sk-proof" onclick="_skOpenProof(\'' + esc(d.proofId) + '\')">Open Full Proof →</button>' : '') +
           '</div>')
        : '<button type="button" class="sk-reveal" onclick="skepticReveal()">See the evidence →</button>') +
    '</div>' +
    (_skRevealed
      ? ('<div class="sk-verdict">' +
           '<button type="button" class="sk-vbtn sk-vbtn--skeptic" onclick="skepticJudge(\'skeptic\')">← I\'d say that too</button>' +
           '<button type="button" class="sk-vbtn sk-vbtn--ev" onclick="skepticJudge(\'evidence\')">Evidence lands →</button>' +
         '</div>')
      : '<div class="sk-hint">Read the objection at full strength first.</div>');
  _skAttachSwipe();
}

function skepticReveal(){ _skRevealed = true; _skRender(); }

function skepticDig(btn){
  var det = document.getElementById('skDetail');
  if(!det) return;
  var open = det.hidden;
  det.hidden = !open;
  if(btn) btn.textContent = open ? 'Less ▴' : 'Dig deeper ▾';
}

// Judge the round. Swipe/tap left = skeptic lands, right = evidence
// lands. Session-only; the card flies off in that direction.
function skepticJudge(verdict){
  if(!_skRevealed) return;
  var d = _skDeck[_skIdx];
  if(d) _skVerdicts[d.id] = verdict;
  var card = document.getElementById('skCard');
  var advance = function(){ _skIdx++; _skRevealed = false; _skRender(); };
  if(card && !_skReduced()){
    card.classList.add(verdict === 'skeptic' ? 'sk-fly-left' : 'sk-fly-right');
    setTimeout(advance, 300);
  } else { advance(); }
}

function _skRenderSummary(){
  var host = document.getElementById('skepticHost');
  if(!host) return;
  var total = Object.keys(_skVerdicts).length;
  var evidence = Object.keys(_skVerdicts).filter(function(k){ return _skVerdicts[k] === 'evidence'; }).length;
  host.innerHTML =
    '<div class="sk-top"><button type="button" class="sk-close" onclick="skepticClose()" aria-label="Close">✕</button></div>' +
    '<div class="sk-summary">' +
      '<div class="sk-eyebrow">Where you landed</div>' +
      '<div class="sk-sum-big">You found ' + evidence + ' of ' + (total || _skDeck.length) + ' convincing</div>' +
      '<div class="sk-sum-sub">No score kept — this is your thinking today, not a grade. The strongest objections deserve the strongest answers; sit with the ones that didn\'t land.</div>' +
      '<div class="sk-sum-actions">' +
        '<button type="button" class="sk-again" onclick="skepticSetCat(\'all\')">Walk them again</button>' +
        '<button type="button" class="sk-close-btn" onclick="skepticClose()">Done</button>' +
      '</div>' +
    '</div>';
  // Settle — evidence considered, not a quiz won. One low bell.
  if(window.sfx && typeof window.sfx.settle === 'function') window.sfx.settle();
  if(typeof logFaithActivity === 'function') try { logFaithActivity('proof', { source: 'skeptic-debates' }); } catch(_e){}
}

// Open the real proof drawer (cmOpenFullProof pattern) — lazy-gate the
// dataset first (PROOF_PROPHECY_DATA is lazy-loaded).
function _skOpenProof(proofId){
  if(!proofId) return;
  var go = function(){
    try {
      if(typeof toggleFaithExplore === 'function') toggleFaithExplore(true);
      if(typeof bfTab === 'function') bfTab('proofProphecy');
      setTimeout(function(){ if(typeof ppOpenModal === 'function') ppOpenModal(proofId); }, 140);
    } catch(_e){}
  };
  skepticClose();
  if(typeof PROOF_PROPHECY_DATA === 'undefined' && typeof ylccEnsureData === 'function'){
    ylccEnsureData('PROOF_PROPHECY_DATA', '/app/js/data/proof-prophecy.js').then(go).catch(go);
  } else { go(); }
}

// ── Touch swipe (reuse the deck idiom) — only judges after reveal ──
function _skAttachSwipe(){
  var card = document.getElementById('skCard');
  if(!card || card.dataset.sw){ return; }
  card.dataset.sw = '1';
  card.addEventListener('touchstart', function(e){
    if(!e.touches || !e.touches.length) return;
    var t = e.touches[0]; _skTouch = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, { passive: true });
  card.addEventListener('touchend', function(e){
    if(!_skTouch || !e.changedTouches || !e.changedTouches.length){ _skTouch = null; return; }
    var t = e.changedTouches[0];
    var dx = t.clientX - _skTouch.x, dy = t.clientY - _skTouch.y, dt = Date.now() - _skTouch.t;
    _skTouch = null;
    if(dt > 600) return;
    if(Math.abs(dy) > Math.abs(dx)) return;   // vertical → scroll, not a judgment
    if(Math.abs(dx) < 50) return;
    if(!_skRevealed) return;                    // can't judge before seeing the evidence
    skepticJudge(dx < 0 ? 'skeptic' : 'evidence');
  }, { passive: true });
}
