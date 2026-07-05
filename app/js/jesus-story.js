// YourLife CC — The Story: Who Is Jesus, scrollytelling (2026-07-05)
// Spec: docs/THE_STORY_SCROLLYTELLING_SPEC.md (supersedes Wave 2 §1a).
// Seven-chapter scroll journey over JESUS_DATA (read-only source — all
// beat-splitting is a render-time transform). One sticky scene layer
// transitions night→dawn per chapter (scene-lite hardcoded hex, both
// themes); content cards stay interface-layer. The Cross darkens with
// scroll (quantized stops, AA floor); Risen breaks dawn once per
// session. Native scroll only — no parallax, no scroll-jacking.
// Progress persists in D.jesusStory {read, lastCh, titles, done, view}.

var _jsyIOBeats = null, _jsyIOCh = null;
var _jsyDarkRAF = 0, _jsyDarkLast = 0;
var _jsyDawnPlayed = false;      // once per SESSION (module var, not persisted)
var _jsyActiveCh = 1;
var _jsyConstWired = false;
var _jsyOpenSeal = -1;

// Star positions (viewBox 340×300) — a two-tier crown + apex. Every
// pair sits ≥48 units apart so the r=24 hit circles never overlap on
// a 340px mobile canvas (pre-build UX MUST; r padded 22→24 post-build
// so the rendered zone clears 44px with margin at 1:1 scale).
var _JSY_STARS = [
  { x: 52,  y: 212 }, { x: 112, y: 238 }, { x: 170, y: 248 }, { x: 228, y: 238 }, { x: 288, y: 212 },
  { x: 76,  y: 138 }, { x: 140, y: 112 }, { x: 200, y: 112 }, { x: 264, y: 138 },
  { x: 170, y: 46 }
];
// Crown perimeter — drawn only when all ten stars are lit.
var _JSY_LINKS = [[0,5],[5,6],[6,9],[9,7],[7,8],[8,4],[4,3],[3,2],[2,1],[1,0]];

// Prophecy-seal index (index only — no content duplication). Keyed by
// the OT ref in propheciesFulfilled[].reference. proofId maps to the
// matching Proof & Prophecy entry where one exists; only Micah 5:2 has
// a clean 1:1 entry (bethlehem-birth) — the others expand in place
// without an evidence door.
var _JSY_SEALS = {
  'Isaiah 7:14':    { line: 'Spoken to King Ahaz seven centuries before the manger.' },
  'Micah 5:2':      { line: 'The prophet named the exact town seven hundred years early.', proofId: 'bethlehem-birth' },
  'Hosea 11:1':     { line: 'Israel’s exodus road becomes the Son’s own road home.' },
  'Jeremiah 31:15': { line: 'Rachel’s weeping foretold the grief at Ramah.' }
};

var _JSY_CH_META = [
  { n: 1, label: 'Born' },
  { n: 2, label: 'Hidden Years' },
  { n: 3, label: 'The River' },
  { n: 4, label: 'The Wilderness' },
  { n: 5, label: 'The Ministry' },
  { n: 6, label: 'The Cross' },
  { n: 7, label: 'Risen' }
];

function _jsyEsc(s){
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function _jsySave(){ if (typeof save === 'function') save(); }

function _jsyReduced(){
  try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  catch(_e){ return false; }
}

// Sanitize + return the persisted story state (DEF: data.js jesusStory).
function _jsyState(){
  if (typeof D === 'undefined' || !D) return { read: {}, lastCh: 1, titles: {}, done: false, view: 'story' };
  var s = D.jesusStory;
  if (!s || typeof s !== 'object' || Array.isArray(s)) s = D.jesusStory = {};
  if (!s.read || typeof s.read !== 'object' || Array.isArray(s.read)) s.read = {};
  if (!s.titles || typeof s.titles !== 'object' || Array.isArray(s.titles)) s.titles = {};
  if (typeof s.lastCh !== 'number' || s.lastCh < 1 || s.lastCh > 7) s.lastCh = 1;
  if (s.view !== 'page') s.view = 'story';
  return s;
}

// ── Beat splitting (render-time transform, no data rewrite) ─────────
// No lookbehind (older iOS Safari throws at parse time). Any trailing
// fragment without terminal punctuation (e.g. a closing "(Matthew
// 3:13-17)") is re-attached to the last sentence — zero content loss.
function _jsySentences(text){
  var t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return [];
  var m = t.match(/[^.!?]+[.!?]+["'”’)\]]*\s*/g);
  if (!m) return [t];
  var joined = m.join('');
  if (joined.length < t.length) m[m.length - 1] += t.slice(joined.length);
  return m.map(function(s){ return s.trim(); }).filter(Boolean);
}

// Group sentences into 2–3 sentence beats (~30–45 words) — the reader
// is always one beat from done.
function _jsyBeatsFrom(text){
  var sents = _jsySentences(text), beats = [], cur = [], words = 0;
  for (var i = 0; i < sents.length; i++){
    cur.push(sents[i]);
    words += sents[i].split(/\s+/).length;
    if (cur.length >= 3 || (cur.length >= 2 && words >= 30)){
      beats.push(cur.join(' ')); cur = []; words = 0;
    }
  }
  if (cur.length) beats.push(cur.join(' '));
  return beats;
}

// ── Chapter model (reads JESUS_DATA, untouched) ─────────────────────
// List content renders as ONE grouped card (miracles, appearances) —
// EXCEPT the Passion Week timeline and Seven Last Words, which keep
// per-item granularity under visible sub-headers (pre-build UX MUST:
// that content is already strong; don't sand it to a uniform template).
function _jsyChapters(){
  var d = (typeof JESUS_DATA !== 'undefined') ? JESUS_DATA : null;
  if (!d) return null;
  return [
    { n: 1, label: 'Born', title: d.life.birth.title,
      beats: _jsyBeatsFrom(d.life.birth.details),
      seals: d.life.birth.propheciesFulfilled || [] },
    { n: 2, label: 'Hidden Years', title: d.life.earlyLife.title,
      beats: _jsyBeatsFrom(d.life.earlyLife.details) },
    { n: 3, label: 'The River', title: d.life.baptism.title,
      beats: _jsyBeatsFrom(d.life.baptism.details),
      aside: d.life.baptism.significance || '' },
    { n: 4, label: 'The Wilderness', title: d.life.temptation.title,
      beats: _jsyBeatsFrom(d.life.temptation.details),
      chips: { label: 'He answered with', items: d.life.temptation.scriptures || [] } },
    { n: 5, label: 'The Ministry', title: d.life.ministry.title,
      beats: _jsyBeatsFrom(d.life.ministry.details),
      list: { label: 'The signs he gave', items: d.life.ministry.miracles || [] } },
    { n: 6, label: 'The Cross', title: d.crucifixion.title, cross: true,
      beats: _jsyBeatsFrom(d.crucifixion.overview),
      timeline: d.crucifixion.timeline || [],
      words: d.crucifixion.sevenLastWords || [],
      significance: d.crucifixion.significance || null },
    { n: 7, label: 'Risen', title: d.resurrection.title,
      beats: _jsyBeatsFrom(d.resurrection.summary),
      list: { label: 'He was seen — the recorded appearances', items: d.resurrection.appearances || [] },
      titles: (d.overview && d.overview.keyTitles) || [] }
  ];
}

// ── Render ──────────────────────────────────────────────────────────
function renderJesusStory(){
  var el = document.getElementById('jesusCardContainer');
  if (!el) return;
  if (typeof JESUS_DATA === 'undefined'){
    if (typeof renderJesusCard === 'function') renderJesusCard();
    return;
  }
  var st = _jsyState();
  if (st.view === 'page'){
    // "Read as one page" escape — the legacy study card, restyled
    // header (wine/gold FOLLOW-UP discharged in faith.js).
    if (el.dataset.jsyView !== 'page'){
      _jsyTeardown();
      delete el.dataset.rendered;
      el.innerHTML = '';
      el.dataset.jsyView = 'page';
    }
    if (typeof renderJesusCard === 'function') renderJesusCard();
    if (!document.getElementById('jsyStoryLink')){
      el.insertAdjacentHTML('afterbegin',
        '<button type="button" id="jsyStoryLink" class="jsy-viewlink" onclick="jsyViewStory()">← Back to The Story</button>');
    }
    return;
  }
  // Already built — refresh progress chrome only (don't reset scroll).
  if (el.dataset.jsyView === 'story' && document.getElementById('jesusStoryWrap')){
    _jsyRefreshRail(st);
    return;
  }
  _jsyTeardown();
  delete el.dataset.rendered;
  el.dataset.jsyView = 'story';
  var chs = _jsyChapters();
  el.innerHTML = _jsyBuildHTML(chs, st);
  _jsyWire(st);
}

function _jsyBuildHTML(chs, st){
  var allRead = true, i;
  for (i = 1; i <= 7; i++) if (!st.read[i]) allRead = false;

  // Scene: 7 crossfading gradient layers + the Cross dark veil + the
  // Risen dawn plane. All hardcoded hex — same treatment both themes.
  var scene = '<div class="jsy-scene" aria-hidden="true">';
  for (i = 1; i <= 7; i++) scene += '<div class="jsy-bg jsy-bg' + i + (i === 1 ? ' on' : '') + '"></div>';
  scene += '<div class="jsy-dawn" id="jsyDawn"></div><div class="jsy-dark"></div></div>';

  // Rail — mobile: dots + ONE running current-chapter label; desktop
  // (≥720px): dots + labels in a left column (pre-build UX MUST).
  var dots = _JSY_CH_META.map(function(c){
    return '<button type="button" class="jsy-dot' + (st.read[c.n] ? ' read' : '') + (c.n === 1 ? ' on' : '') + '" id="jsyDot' + c.n + '"' +
      ' aria-label="Chapter ' + c.n + ' · ' + _jsyEsc(c.label) + '" onclick="jsyJump(' + c.n + ')">' +
      '<span class="jsy-dot-pip"></span><span class="jsy-dot-label">' + _jsyEsc(c.label) + '</span></button>';
  }).join('');
  var rail = '<nav class="jsy-rail' + (allRead ? ' done' : '') + '" id="jsyRail" aria-label="The Story chapters">' +
    '<div class="jsy-rail-track">' + dots + '</div>' +
    '<div class="jsy-rail-now" id="jsyRailNow" aria-live="polite">1 · Born</div></nav>';

  // Top: kicker + escape + resume (a pill, not an auto-scroll — the
  // spec bans scroll-jacking; the reader chooses to jump).
  var resume = (!allRead && st.lastCh > 1)
    ? '<button type="button" class="jsy-resume" id="jsyResume" onclick="jsyJump(' + st.lastCh + ')">Continue · Ch ' + st.lastCh + ' ' + _jsyEsc(_JSY_CH_META[st.lastCh - 1].label) + ' →</button>'
    : '';
  var top = '<div class="jsy-top">' +
    '<div class="jsy-kicker">The Story</div>' +
    '<div class="jsy-tagline">His life, from night to dawn. Scroll to walk it.</div>' +
    '<div class="jsy-toprow">' + resume +
    '<button type="button" class="jsy-escape" onclick="jsyViewPage()">Read as one page →</button></div></div>';

  var body = chs.map(function(c){ return _jsyBuildChapter(c, st); }).join('');

  // Full-story settle moment — revealed only when all seven are read.
  var done = '<div class="jsy-done' + (allRead ? ' seen' : '') + '" id="jsyDone"' + (allRead ? '' : ' hidden') + '>' +
    '<div class="jsy-done-title">You know His story now.</div>' +
    '<div class="jsy-done-sub">Seven chapters — one life that split history in two.</div>' +
    '<div class="jsy-done-doors">' +
    '<button type="button" class="jsy-door" onclick="jsyDoor(\'words\')">In His Own Words →</button>' +
    '<button type="button" class="jsy-door" onclick="jsyDoor(\'walk\')">Walk with God →</button>' +
    '<button type="button" class="jsy-door" onclick="jsyDoor(\'proof\')">Proof &amp; Prophecy →</button>' +
    '</div></div>';

  return '<div id="jesusStoryWrap" class="jsy-wrap" data-ch="1" data-dark="0">' +
    scene + '<div class="jsy-flow">' + rail + top + body + done + '</div></div>';
}

function _jsyBuildChapter(c, st){
  var h = '<section class="jsy-ch' + (c.cross ? ' jsy-ch--cross' : '') + '" id="jsyCh' + c.n + '" data-ch="' + c.n + '">' +
    '<header class="jsy-chhead jsy-beat">' +
    '<div class="jsy-cheyebrow">Chapter ' + c.n + ' · ' + _jsyEsc(c.label) + '</div>' +
    '<h3 class="jsy-chtitle">' + _jsyEsc(c.title) + '</h3></header>';

  var blocks = [];
  c.beats.forEach(function(b){ blocks.push('<div class="jsy-beat">' + _jsyEsc(b) + '</div>'); });

  if (c.seals && c.seals.length){
    var chips = c.seals.map(function(p, i){
      var ot = String(p.reference || '').split('→')[0].trim();
      return '<button type="button" class="jsy-seal" id="jsySeal' + i + '" aria-expanded="false" onclick="jsySeal(' + i + ')">📜 ' + _jsyEsc(ot) + ' → fulfilled</button>';
    }).join('');
    blocks.push('<div class="jsy-beat jsy-seals"><div class="jsy-group-label">Prophecies fulfilled</div>' +
      '<div class="jsy-seal-row">' + chips + '</div>' +
      '<div class="jsy-seal-pop" id="jsySealPop" hidden></div></div>');
  }
  if (c.aside) blocks.push('<div class="jsy-beat jsy-aside">' + _jsyEsc(c.aside) + '</div>');
  if (c.chips && c.chips.items.length){
    blocks.push('<div class="jsy-beat jsy-group"><div class="jsy-group-label">' + _jsyEsc(c.chips.label) + '</div>' +
      '<div class="jsy-chip-row">' + c.chips.items.map(function(s){ return '<span class="jsy-chip">' + _jsyEsc(s) + '</span>'; }).join('') + '</div></div>');
  }
  if (c.timeline && c.timeline.length){
    blocks.push('<div class="jsy-beat jsy-subhead">Passion Week</div>');
    c.timeline.forEach(function(ev){
      blocks.push('<div class="jsy-beat jsy-event"><div class="jsy-event-name">' + _jsyEsc(ev.event) + '</div>' +
        '<div class="jsy-event-detail">' + _jsyEsc(ev.detail) + '</div>' +
        '<div class="jsy-ref">' + _jsyEsc(ev.ref) + '</div></div>');
    });
  }
  if (c.words && c.words.length){
    blocks.push('<div class="jsy-beat jsy-subhead">The Seven Last Words</div>');
    c.words.forEach(function(w){
      blocks.push('<div class="jsy-beat jsy-word"><blockquote class="jsy-word-quote">“' + _jsyEsc(w.words) + '”</blockquote>' +
        '<div class="jsy-ref">' + _jsyEsc(w.ref) + '</div>' +
        '<div class="jsy-word-meaning">' + _jsyEsc(w.meaning) + '</div></div>');
    });
  }
  if (c.significance){
    var sigLabels = { substitutionary: 'Substitution', propitiation: 'Propitiation', redemption: 'Redemption', reconciliation: 'Reconciliation', justification: 'Justification' };
    var rows = Object.keys(c.significance).map(function(k){
      return '<div class="jsy-sig"><span class="jsy-sig-tag">' + _jsyEsc(sigLabels[k] || k) + '</span><span class="jsy-sig-body">' + _jsyEsc(c.significance[k]) + '</span></div>';
    }).join('');
    blocks.push('<div class="jsy-beat jsy-group"><div class="jsy-group-label">What the cross means</div>' + rows + '</div>');
  }
  if (c.list && c.list.items.length){
    blocks.push('<div class="jsy-beat jsy-group"><div class="jsy-group-label">' + _jsyEsc(c.list.label) + '</div>' +
      '<ul class="jsy-group-list">' + c.list.items.map(function(m){ return '<li>' + _jsyEsc(m) + '</li>'; }).join('') + '</ul></div>');
  }
  if (c.titles && c.titles.length) blocks.push(_jsyConstellation(c.titles, st));

  // Chapter is "read" when its last beat has been seen (observer).
  if (blocks.length){
    blocks[blocks.length - 1] = blocks[blocks.length - 1].replace('class="jsy-beat', 'data-jsy-last="' + c.n + '" class="jsy-beat');
  }
  return h + blocks.join('') + '</section>';
}

// ── Titles Constellation ────────────────────────────────────────────
function _jsyConstellation(titles, st){
  var lit = 0, i;
  var stars = '';
  for (i = 0; i < titles.length && i < _JSY_STARS.length; i++){
    var p = _JSY_STARS[i];
    var isLit = !!st.titles[i];
    if (isLit) lit++;
    var body;
    if (typeof window !== 'undefined' && typeof window.ckBuildStar === 'function'){
      body = window.ckBuildStar({ x: p.x, y: p.y, mag: 'mid' }, { accent: '#FBBF24' });
    } else {
      body = '<circle cx="' + p.x + '" cy="' + p.y + '" r="8" fill="rgba(251,191,36,.18)"/>' +
             '<circle cx="' + p.x + '" cy="' + p.y + '" r="3.2" fill="#FFF7E0"/>';
    }
    stars += '<g class="jsy-star' + (isLit ? ' lit' : '') + '" data-i="' + i + '" role="button" tabindex="0"' +
      ' aria-label="' + (isLit ? _jsyEsc(titles[i].title) : 'Reveal a title of Christ — star ' + (i + 1) + ' of 10') + '">' +
      '<circle class="jsy-hit" cx="' + p.x + '" cy="' + p.y + '" r="24" fill="transparent"/>' + body + '</g>';
  }
  return '<div class="jsy-beat jsy-const">' +
    '<div class="jsy-const-eyebrow">Risen — so who is he?</div>' +
    '<div class="jsy-const-hint">Tap each star to reveal a title of Christ.</div>' +
    '<svg id="jsyConstSvg" viewBox="0 0 340 300" role="group" aria-label="The ten titles of Christ">' +
    '<g id="jsyLinks">' + (lit >= 10 ? _jsyLinkPaths(true) : '') + '</g>' + stars + '</svg>' +
    '<div class="jsy-const-count" id="jsyConstCount" aria-live="polite">' + lit + ' of 10</div>' +
    '<div class="jsy-const-card" id="jsyTitleCard" hidden></div>' +
    '<div class="jsy-const-settle" id="jsyConstSettle"' + (lit >= 10 ? '' : ' hidden') + '>Every title, one person.</div></div>';
}

function _jsyLinkPaths(still){
  // Crown perimeter — ckCurvePath if the shared star kit is loaded,
  // straight lines as the fallback.
  var bows = [-14, 12, -10, 14, -12, 10, -12, 12, -10, 12];
  return _JSY_LINKS.map(function(pair, i){
    var a = _JSY_STARS[pair[0]], b = _JSY_STARS[pair[1]];
    if (typeof window !== 'undefined' && typeof window.ckCurvePath === 'function'){
      return '<path class="jsy-link' + (still ? ' still' : '') + '" d="' + window.ckCurvePath(a, b, bows[i % bows.length]) + '"/>';
    }
    return '<line class="jsy-link' + (still ? ' still' : '') + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
  }).join('');
}

function jsyStar(i){
  var d = (typeof JESUS_DATA !== 'undefined') ? JESUS_DATA : null;
  var titles = (d && d.overview && d.overview.keyTitles) || [];
  var t = titles[i];
  if (!t) return;
  var st = _jsyState();
  var first = !st.titles[i];
  if (first){ st.titles[i] = true; _jsySave(); }
  var g = document.querySelector('#jsyConstSvg .jsy-star[data-i="' + i + '"]');
  if (g){ g.classList.add('lit'); g.setAttribute('aria-label', t.title); }
  var card = document.getElementById('jsyTitleCard');
  if (card){
    card.hidden = false;
    card.innerHTML = '<div class="jsy-tc-title">' + _jsyEsc(t.title) + '</div>' +
      '<div class="jsy-tc-meaning">' + _jsyEsc(t.meaning) + '</div>' +
      ((t.greek || t.hebrew) ? '<div class="jsy-tc-langs">' +
        (t.greek ? '<span class="jsy-tc-lang">Greek · ' + _jsyEsc(t.greek) + '</span>' : '') +
        (t.hebrew ? '<span class="jsy-tc-lang">Hebrew · ' + _jsyEsc(t.hebrew) + '</span>' : '') + '</div>' : '') +
      (t.ref ? '<div class="jsy-tc-ref">' + _jsyEsc(t.ref) + '</div>' : '');
  }
  var lit = 0, k;
  for (k = 0; k < titles.length; k++) if (st.titles[k]) lit++;
  var count = document.getElementById('jsyConstCount');
  if (count) count.textContent = lit + ' of 10';
  if (lit >= 10){
    var links = document.getElementById('jsyLinks');
    if (links && !links.innerHTML) links.innerHTML = _jsyLinkPaths(false);
    var settle = document.getElementById('jsyConstSettle');
    if (settle) settle.hidden = false;
  }
}

// ── Prophecy seals ──────────────────────────────────────────────────
function jsySeal(i){
  var d = (typeof JESUS_DATA !== 'undefined') ? JESUS_DATA : null;
  var seals = (d && d.life && d.life.birth && d.life.birth.propheciesFulfilled) || [];
  var p = seals[i];
  var pop = document.getElementById('jsySealPop');
  if (!p || !pop) return;
  var btn = document.getElementById('jsySeal' + i);
  if (_jsyOpenSeal === i){
    _jsyOpenSeal = -1;
    pop.hidden = true;
    if (btn) btn.setAttribute('aria-expanded', 'false');
    return;
  }
  for (var k = 0; k < seals.length; k++){
    var b = document.getElementById('jsySeal' + k);
    if (b) b.setAttribute('aria-expanded', k === i ? 'true' : 'false');
  }
  _jsyOpenSeal = i;
  var ot = String(p.reference || '').split('→')[0].trim();
  var meta = _JSY_SEALS[ot] || {};
  pop.hidden = false;
  pop.innerHTML = '<div class="jsy-pop-title">' + _jsyEsc(p.prophecy) + '</div>' +
    '<div class="jsy-pop-ref">' + _jsyEsc(p.reference) + '</div>' +
    (meta.line ? '<div class="jsy-pop-line">' + _jsyEsc(meta.line) + '</div>' : '') +
    ((meta.proofId && typeof cmOpenFullProof === 'function')
      ? '<button type="button" class="jsy-pop-door" onclick="cmOpenFullProof(\'' + meta.proofId + '\')">See the evidence →</button>'
      : '');
}

// ── Wiring: observers, dark loop, keys ──────────────────────────────
function _jsyWire(st){
  var wrap = document.getElementById('jesusStoryWrap');
  if (!wrap) return;
  var reduced = _jsyReduced();
  _jsyActiveCh = 1;

  if ('IntersectionObserver' in window){
    // Beat reveals — stagger only same-frame batches by 80ms (the
    // rail-jump case); normal scroll reveals one beat at a time.
    _jsyIOBeats = new IntersectionObserver(function(entries){
      var vis = entries.filter(function(e){ return e.isIntersecting; });
      vis.forEach(function(e, idx){
        _jsyIOBeats.unobserve(e.target);
        var el = e.target;
        setTimeout(function(){
          el.classList.add('seen');
          var last = el.getAttribute('data-jsy-last');
          if (last) _jsyMarkRead(parseInt(last, 10));
        }, reduced ? 0 : idx * 80);
      });
    }, { threshold: 0.15 });
    wrap.querySelectorAll('.jsy-beat').forEach(function(el){ _jsyIOBeats.observe(el); });

    // Chapter boundaries — a 5%-tall band at mid-viewport.
    _jsyIOCh = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) _jsySetCh(parseInt(e.target.getAttribute('data-ch'), 10));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    wrap.querySelectorAll('.jsy-ch').forEach(function(el){ _jsyIOCh.observe(el); });
  } else {
    // No IO — reveal everything; the story stays readable, the scene
    // simply rests on chapter 1 and read-tracking is unavailable.
    wrap.querySelectorAll('.jsy-beat').forEach(function(el){ el.classList.add('seen'); });
  }

  // Constellation keyboard support (Enter/Space on a star).
  var svg = document.getElementById('jsyConstSvg');
  if (svg && !svg.dataset.keys){
    svg.dataset.keys = '1';
    svg.addEventListener('keydown', function(e){
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var g = e.target && e.target.closest ? e.target.closest('.jsy-star') : null;
      if (!g) return;
      e.preventDefault();
      jsyStar(parseInt(g.getAttribute('data-i'), 10));
    });
    svg.addEventListener('click', function(e){
      var g = e.target && e.target.closest ? e.target.closest('.jsy-star') : null;
      if (g) jsyStar(parseInt(g.getAttribute('data-i'), 10));
    });
  }

  // Home/End jump the rail (Tab-component parity).
  var rail = document.getElementById('jsyRail');
  if (rail && !rail.dataset.keys){
    rail.dataset.keys = '1';
    rail.addEventListener('keydown', function(e){
      if (e.key === 'Home'){ e.preventDefault(); jsyJump(1); }
      else if (e.key === 'End'){ e.preventDefault(); jsyJump(7); }
    });
  }
}

function _jsySetCh(n){
  if (!n || n === _jsyActiveCh) return;
  _jsyActiveCh = n;
  var wrap = document.getElementById('jesusStoryWrap');
  if (!wrap) return;
  wrap.dataset.ch = String(n);
  wrap.querySelectorAll('.jsy-bg').forEach(function(el, i){
    el.classList.toggle('on', (i + 1) === n);
  });
  // Rail: current dot + the single running label (mobile).
  for (var i = 1; i <= 7; i++){
    var dot = document.getElementById('jsyDot' + i);
    if (dot) dot.classList.toggle('on', i === n);
  }
  var now = document.getElementById('jsyRailNow');
  if (now) now.textContent = n + ' · ' + _JSY_CH_META[n - 1].label;
  // Resume pointer (the D.jwIdx idiom).
  var st = _jsyState();
  if (st.lastCh !== n){ st.lastCh = n; _jsySave(); }
  // The Cross dark loop runs only while chapter 6 is active.
  if (n === 6){ _jsyDarkStart(); }
  else { wrap.dataset.dark = '0'; }
  // Risen — dawn breaks once per session.
  if (n === 7 && !_jsyDawnPlayed){
    _jsyDawnPlayed = true;
    var dawn = document.getElementById('jsyDawn');
    if (dawn){
      if (_jsyReduced()) dawn.classList.add('no-anim');
      dawn.classList.add('break');
    }
  }
}

// Scroll-linked darkening through The Cross — quantized to 6 stops
// (banding guard), floor reached at ~70% through the chapter and held,
// driven by a rAF loop throttled to ~120ms, active only in chapter 6.
function _jsyDarkStart(){
  if (_jsyDarkRAF) return;
  _jsyDarkLast = 0;
  var tick = function(){
    if (_jsyActiveCh !== 6){ _jsyDarkRAF = 0; return; }
    var now = Date.now();
    if (now - _jsyDarkLast >= 120){
      _jsyDarkLast = now;
      var sec = document.getElementById('jsyCh6');
      var wrap = document.getElementById('jesusStoryWrap');
      if (sec && wrap){
        var r = sec.getBoundingClientRect();
        var vh = window.innerHeight || 800;
        var p = (vh * 0.5 - r.top) / Math.max(1, r.height);
        p = Math.max(0, Math.min(1, p));
        var level = Math.min(5, Math.floor((p / 0.7) * 5));
        if (wrap.dataset.dark !== String(level)) wrap.dataset.dark = String(level);
      }
    }
    _jsyDarkRAF = requestAnimationFrame(tick);
  };
  _jsyDarkRAF = requestAnimationFrame(tick);
}

// ── Progress + completion ───────────────────────────────────────────
function _jsyMarkRead(n){
  var st = _jsyState();
  if (st.read[n]) return;
  st.read[n] = true;
  _jsySave();
  var dot = document.getElementById('jsyDot' + n);
  if (dot) dot.classList.add('read');
  var all = true;
  for (var i = 1; i <= 7; i++) if (!st.read[i]) all = false;
  if (all) _jsyComplete();
}

function _jsyComplete(){
  var st = _jsyState();
  var doneEl = document.getElementById('jsyDone');
  if (doneEl){ doneEl.hidden = false; doneEl.classList.add('seen'); }
  var rail = document.getElementById('jsyRail');
  if (rail) rail.classList.add('done');
  if (st.done) return;                      // the settle moment plays once, ever
  st.done = true;
  _jsySave();
  // SETTLE register — a story received is not a quiz won. One opt-in
  // low bell, no confetti, no XP fanfare; the reflect quest metric may
  // bump once through the persisted daily throttle.
  if (window.sfx && typeof window.sfx.settle === 'function') window.sfx.settle();
  if (typeof window.walkQuestBump === 'function' && typeof _hcOnce === 'function' && _hcOnce('reflect')){
    window.walkQuestBump('reflect', 1);
  }
}

// ── Navigation ──────────────────────────────────────────────────────
function jsyJump(n){
  var sec = document.getElementById('jsyCh' + n);
  if (!sec) return;
  try { sec.scrollIntoView({ behavior: _jsyReduced() ? 'auto' : 'smooth', block: 'start' }); }
  catch(_e){ sec.scrollIntoView(); }
}

function jsyDoor(kind){
  if (kind === 'words'){
    if (typeof jwOpenReader === 'function') jwOpenReader();
    try { var h = document.getElementById('jesusMeetHost'); if (h) h.scrollIntoView({ block: 'start' }); } catch(_e){}
    return;
  }
  if (kind === 'walk'){ if (typeof fzOpenDest === 'function') fzOpenDest('walk'); return; }
  if (kind === 'proof'){ if (typeof bfTab === 'function') bfTab('proofProphecy'); }
}

function jsyViewPage(){
  var st = _jsyState();
  st.view = 'page';
  _jsySave();
  renderJesusStory();
}

function jsyViewStory(){
  var st = _jsyState();
  st.view = 'story';
  _jsySave();
  var el = document.getElementById('jesusCardContainer');
  if (el){ delete el.dataset.jsyView; delete el.dataset.rendered; }
  renderJesusStory();
}

function _jsyRefreshRail(st){
  for (var i = 1; i <= 7; i++){
    var dot = document.getElementById('jsyDot' + i);
    if (dot) dot.classList.toggle('read', !!st.read[i]);
  }
}

function _jsyTeardown(){
  if (_jsyIOBeats){ try { _jsyIOBeats.disconnect(); } catch(_e){} _jsyIOBeats = null; }
  if (_jsyIOCh){ try { _jsyIOCh.disconnect(); } catch(_e){} _jsyIOCh = null; }
  if (_jsyDarkRAF){ try { cancelAnimationFrame(_jsyDarkRAF); } catch(_e){} _jsyDarkRAF = 0; }
  _jsyActiveCh = 1;
  _jsyOpenSeal = -1;
}
