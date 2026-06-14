/* =============================================================
   exercise-engine.js — WC-D1. Reusable interactive exercise engine.

   A spec-driven, surface-agnostic LIBRARY: given a set {id, title,
   questions:[...]}, it renders + grades five formats and reports the
   result. It only PRESENTS — XP / streak stay the single source of
   truth in xp.js. Designed as the convergence target: other renderers
   (skills, and later faith with go-ahead) can delegate to
   window.exerciseEngine.run() so we end with ONE engine.

   Formats: 'mc' (multiple-choice), 'pairs' (tap-the-pairs), 'blank'
   (fill-the-blank), 'order' (drag/move-to-order), 'word' (tap-the-word).

   Feedback (kind, no hearts/lives, no hard fail):
     - correct  -> green pulse + advance
     - wrong    -> gentle shake + encouraging retry (question stays)
   prefers-reduced-motion swaps pulse/shake for a static color/state
   change (no motion) and skips the perfect-set confetti.

   XP: on the FIRST clear of a set per day, calls window.awardPracticeSet
   (xp.js) once for the whole set — which awards practice_set XP and fires
   the juice toast. Never calls xpJuice() directly. megaConfetti() only on
   a perfect, first-of-day clear.

   Public:
     window.openPractice()                 — D1 host: open the seeded sets
     window.exerciseEngine.run(set, host, cb)  — run any set in any host
============================================================= */
(function(){
  'use strict';

  function _reduced(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(_e){ return false; }
  }
  function _esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // ── Seed sets (Step-1 non-faith content as specs; 'order' + 'word' are the
  //    two tiny hand-shaped examples to demonstrate those formats). ──────────
  var SEED_SETS = [
    {
      id: 'd1-money', title: 'Money smarts', emoji: '💰',
      questions: [
        { type:'mc', prompt:'What is compound interest?',
          choices:['A bank fee','Interest earned on interest','A type of loan','A tax'],
          answer:1, explain:'Interest on your interest — it snowballs over time.' },
        { type:'mc', prompt:'What is a healthy credit-score range?',
          choices:['0–100','300–850','100–500','500–1000'],
          answer:1, explain:'Credit scores run 300–850; higher means lenders trust you more.' },
        { type:'pairs', prompt:'Match each money term to what it means.',
          pairs:[['401(k)','Retirement savings account'],['Credit score','How lenders rate your reliability'],['Budget','A plan for your money']] },
        { type:'blank', prompt:'Aim to save at least ___ of your income.',
          choices:['5%','20%','50%'], answer:1, explain:'20%+ is the classic savings target.' }
      ]
    },
    {
      id: 'd1-cooking', title: 'Kitchen safety', emoji: '🍳',
      questions: [
        { type:'mc', prompt:'What temperature kills most food bacteria?',
          choices:['100°F','165°F (74°C)','200°F','140°F'],
          answer:1, explain:'165°F is the safe internal temp for most foods.' },
        { type:'mc', prompt:'How long are leftovers safe in the fridge?',
          choices:['1 day','3–4 days','2 weeks','1 week'],
          answer:1, explain:'3–4 days — when in doubt, throw it out.' },
        // hand-shaped 'word' example
        { type:'word', prompt:'Tap every food-safety habit (and only those).',
          words:['Wash your hands','Thaw meat on the counter overnight','Keep raw meat separate','Reheat to 165°F','Leave leftovers out all day'],
          answer:[0,2,3], explain:'Wash hands, separate raw meat, reheat hot. Skip the unsafe ones.' }
      ]
    },
    {
      id: 'd1-safety', title: 'Stay-safe basics', emoji: '🦺',
      questions: [
        { type:'mc', prompt:'What number do you call for emergencies in the US?',
          choices:['411','911','311','711'], answer:1, explain:'911 — for any real emergency.' },
        // hand-shaped 'order' example
        { type:'order', prompt:'Put the house-fire steps in the right order.',
          items:['Get low and get out','Call 911 from outside','Go to your meeting spot'],
          answer:[0,1,2], explain:'Out first, then call, then regroup where your family meets.' }
      ]
    }
  ];

  // ── Active run state ─────────────────────────────────────────
  var _run = null;   // { set, host, qi, wrong, onDone, q* per-question state }

  // ── Feedback line (aria-live) ────────────────────────────────
  function _say(host, msg, ok){
    var el = host.querySelector('.ex-feedback');
    if(!el) return;
    el.textContent = msg || '';
    el.className = 'ex-feedback' + (ok === true ? ' ex-feedback--ok' : ok === false ? ' ex-feedback--no' : '');
  }
  // gentle shake (or static state under reduced motion)
  function _nudge(elem){
    if(!elem) return;
    if(_reduced()){ elem.classList.add('ex-wrong'); setTimeout(function(){ elem.classList.remove('ex-wrong'); }, 900); return; }
    elem.classList.remove('ex-shake'); void elem.offsetWidth; elem.classList.add('ex-shake');
    setTimeout(function(){ elem.classList.remove('ex-shake'); }, 480);
  }

  function _progressHtml(){
    var n = _run.set.questions.length, i = _run.qi;
    return '<div class="ex-progress" aria-hidden="true">'
      + Array.apply(null, {length:n}).map(function(_, k){
          return '<span class="ex-dot' + (k < i ? ' ex-dot--done' : k === i ? ' ex-dot--now' : '') + '"></span>';
        }).join('')
      + '</div>';
  }

  // ── Render the current question (dispatch by type) ───────────
  function _renderQuestion(){
    var host = _run.host, q = _run.set.questions[_run.qi];
    var head = '<div class="ex-head">' + _progressHtml()
      + '<button class="ex-close" type="button" data-ex="close" aria-label="Close practice">✕</button></div>'
      + '<h3 class="ex-prompt">' + _esc(q.prompt) + '</h3>';
    var body = '';

    if(q.type === 'mc' || q.type === 'blank'){
      _run.qstate = null;
      body = '<div class="ex-choices" role="group" aria-label="Answer choices">'
        + q.choices.map(function(c, i){
            return '<button class="ex-choice" type="button" data-ex="choice" data-i="' + i + '">' + _esc(c) + '</button>';
          }).join('')
        + '</div>';

    } else if(q.type === 'pairs'){
      // left items in order; right items shuffled deterministically per render
      var rights = q.pairs.map(function(p, i){ return { t:p[1], i:i }; });
      for(var s = rights.length - 1; s > 0; s--){ var j = (s * 7 + _run.qi * 3 + 1) % (s + 1); var tmp = rights[s]; rights[s] = rights[j]; rights[j] = tmp; }
      _run.qstate = { matched: {}, sel: null, rights: rights };
      body = '<div class="ex-pairs">'
        + '<div class="ex-col" role="group" aria-label="Terms">'
        +   q.pairs.map(function(p, i){ return '<button class="ex-pair" type="button" data-ex="pairL" data-i="' + i + '">' + _esc(p[0]) + '</button>'; }).join('')
        + '</div><div class="ex-col" role="group" aria-label="Matches">'
        +   rights.map(function(r){ return '<button class="ex-pair" type="button" data-ex="pairR" data-i="' + r.i + '">' + _esc(r.t) + '</button>'; }).join('')
        + '</div></div>';

    } else if(q.type === 'order'){
      _run.qstate = { order: q.items.map(function(_, i){ return i; }) };
      body = _orderListHtml() + '<button class="ex-check" type="button" data-ex="check">Check</button>';

    } else if(q.type === 'word'){
      _run.qstate = { sel: {} };
      body = '<div class="ex-words" role="group" aria-label="Words">'
        + q.words.map(function(w, i){ return '<button class="ex-word" type="button" data-ex="word" data-i="' + i + '" aria-pressed="false">' + _esc(w) + '</button>'; }).join('')
        + '</div><button class="ex-check" type="button" data-ex="check">Check</button>';
    }

    host.innerHTML = '<div class="ex-card">' + head + body
      + '<div class="ex-feedback" role="status" aria-live="polite"></div>'
      + '<div class="ex-foot"></div></div>';
  }

  function _orderListHtml(){
    var q = _run.set.questions[_run.qi], ord = _run.qstate.order;
    return '<ul class="ex-order" aria-label="Drag or use the arrows to order">'
      + ord.map(function(itemIdx, pos){
          return '<li class="ex-orow">'
            + '<span class="ex-otext">' + _esc(q.items[itemIdx]) + '</span>'
            + '<span class="ex-obtns">'
            +   '<button class="ex-omove" type="button" data-ex="move" data-pos="' + pos + '" data-dir="-1" aria-label="Move up"' + (pos === 0 ? ' disabled' : '') + '>▲</button>'
            +   '<button class="ex-omove" type="button" data-ex="move" data-pos="' + pos + '" data-dir="1" aria-label="Move down"' + (pos === ord.length - 1 ? ' disabled' : '') + '>▼</button>'
            + '</span></li>';
        }).join('')
      + '</ul>';
  }

  // ── Advance / complete ───────────────────────────────────────
  function _advance(){
    _run.qi++;
    if(_run.qi >= _run.set.questions.length){ _complete(); return; }
    _renderQuestion();
  }
  function _markWrong(){ _run.wrong = true; }

  function _complete(){
    var host = _run.host, set = _run.set, perfect = !_run.wrong;
    var awarded = false;
    try { if(typeof window.awardPracticeSet === 'function') awarded = window.awardPracticeSet(set.id); } catch(_e){}
    if(perfect && awarded){
      // Fanfare rides the 🎉 + XP line (shown even under reduced motion).
      // Sound is not motion, so it still plays when confetti is suppressed.
      try { if(window.sfx) window.sfx.perfect(); } catch(_e){}
      if(!_reduced()){
        try { if(typeof window.megaConfetti === 'function') window.megaConfetti(); else if(typeof window.launchBigConfetti === 'function') window.launchBigConfetti(); } catch(_e){}
      }
    }
    var line = awarded
      ? (perfect ? 'Perfect set! +' + _xpVal() + ' XP' : 'Set complete — +' + _xpVal() + ' XP')
      : 'Nice practice! (already earned today)';
    host.innerHTML = '<div class="ex-card ex-done">'
      + '<div class="ex-done__emoji" aria-hidden="true">' + (perfect ? '🎉' : '✅') + '</div>'
      + '<h3 class="ex-prompt">' + _esc(set.title) + '</h3>'
      + '<div class="ex-done__line' + (awarded ? ' ex-done__line--xp' : '') + '">' + _esc(line) + '</div>'
      + '<div class="ex-foot">'
      +   '<button class="ex-btn" type="button" data-ex="again">Practice again</button>'
      +   '<button class="ex-btn ex-btn--primary" type="button" data-ex="picker">Pick another set</button>'
      + '</div></div>';
    if(typeof _run.onDone === 'function'){ try { _run.onDone({ setId:set.id, perfect:perfect, awarded:awarded }); } catch(_e){} }
    _maybeSoundNudge();
  }
  function _xpVal(){ try { return (window.XP_VALUES && window.XP_VALUES.practice_set) || 6; } catch(_e){ return 6; } }

  // ── One-time "Add sound effects?" opt-in nudge (WC-D2) ───────
  // Shown once, after a completed set, only when sound is OFF. Guards:
  //   • truly one-time — soundNudgeSeen is set the MOMENT it shows (so an
  //     ignored/auto-dismissed nudge can never re-nag), persisted via save();
  //   • no preview — nothing plays until the user taps "Turn on"; that tap
  //     is the gesture that unlocks audio on iOS and plays the first ding;
  //   • skipped for anyone already on (incl. migrated-on users) and where
  //     there's no Web Audio support at all.
  function _maybeSoundNudge(){
    try {
      if(!window.D) return;
      if(window.D.soundEnabled) return;     // already on — nothing to offer
      if(window.D.soundNudgeSeen) return;   // already shown once
      if(!window.sfx) return;               // no audio support — skip silently
      if(document.querySelector('.ex-nudge')) return;
      window.D.soundNudgeSeen = true;       // set on SHOW so it never re-nags
      if(typeof window.save === 'function') window.save();
      _showSoundNudge();
    } catch(_e){}
  }
  function _showSoundNudge(){
    var wrap = document.createElement('div');
    wrap.className = 'ex-nudge';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Add sound effects');
    var msg = document.createElement('div');
    msg.className = 'ex-nudge__msg';
    msg.innerHTML = '<span class="ex-nudge__emoji" aria-hidden="true">🔊</span>'
      + '<span>Add sound effects? A little ding when you nail it.</span>';
    var btns = document.createElement('div');
    btns.className = 'ex-nudge__btns';
    var no = document.createElement('button');
    no.type = 'button'; no.className = 'ex-nudge__btn'; no.textContent = 'Not now';
    var yes = document.createElement('button');
    yes.type = 'button'; yes.className = 'ex-nudge__btn ex-nudge__btn--primary'; yes.textContent = 'Turn on';
    var timer = 0;
    function close(){ try { wrap.remove(); } catch(_e){} if(timer) clearTimeout(timer); }
    no.addEventListener('click', close);
    yes.addEventListener('click', function(){
      try {
        if(window.D) window.D.soundEnabled = true;
        if(typeof window.save === 'function') window.save();
        var tg = document.getElementById('tg-soundEnabled');
        if(tg) tg.classList.add('on');
        // first sound rides THIS gesture (also unlocks the iOS audio context)
        if(window.sfx){ try { window.sfx.unlock(); } catch(_e){} window.sfx.correct(); }
        if(typeof window.showToast === 'function') window.showToast('Sound effects on 🔊');
      } catch(_e){}
      close();
    });
    btns.appendChild(no); btns.appendChild(yes);
    wrap.appendChild(msg); wrap.appendChild(btns);
    document.body.appendChild(wrap);
    timer = setTimeout(close, 9000);  // auto-dismiss; still counts as seen
    try { requestAnimationFrame(function(){ wrap.classList.add('ex-nudge--in'); }); }
    catch(_e){ wrap.classList.add('ex-nudge--in'); }
  }

  // ── Click dispatch (single delegated listener on the root) ───
  function _onClick(e){
    var btn = e.target.closest && e.target.closest('[data-ex]');
    if(!btn || !_run) return;
    var act = btn.getAttribute('data-ex');
    var q = _run.set ? _run.set.questions[_run.qi] : null;

    if(act === 'close'){ closePractice(); return; }
    if(act === 'picker'){ _renderPicker(); return; }
    if(act === 'again'){ _startSet(_run.set, _run.host, _run.onDone); return; }
    if(act === 'setpick'){ var id = btn.getAttribute('data-id'); var s = SEED_SETS.filter(function(x){ return x.id === id; })[0]; if(s) _startSet(s, _run.host, _run.onDone); return; }
    if(!q) return;

    if(act === 'choice'){
      var i = +btn.getAttribute('data-i');
      var ok = (i === q.answer) || (q.choices[i] === q.answer);
      if(ok){ btn.classList.add('ex-right'); if(window.sfx) window.sfx.correct(); _say(_run.host, q.explain || 'Nice!', true); _disableGroup(_run.host, '.ex-choice'); setTimeout(_advance, _reduced() ? 700 : 850); }
      else { _markWrong(); if(window.sfx) window.sfx.tryAgain(); _nudge(btn); btn.classList.add('ex-off'); _say(_run.host, 'Not quite — try again, you’ve got this.', false); }
      return;
    }

    if(act === 'pairL' || act === 'pairR'){
      var st = _run.qstate, idx = +btn.getAttribute('data-i');
      if(st.matched[idx]) return;
      var side = (act === 'pairL') ? 'L' : 'R';
      if(!st.sel){ st.sel = { side:side, idx:idx, el:btn }; btn.classList.add('ex-sel'); btn.setAttribute('aria-pressed','true'); return; }
      if(st.sel.side === side){ st.sel.el.classList.remove('ex-sel'); st.sel.el.setAttribute('aria-pressed','false'); st.sel = { side:side, idx:idx, el:btn }; btn.classList.add('ex-sel'); btn.setAttribute('aria-pressed','true'); return; }
      // one of each side selected — match if same pair index
      if(st.sel.idx === idx){
        st.matched[idx] = true;
        [st.sel.el, btn].forEach(function(el){ el.classList.remove('ex-sel'); el.classList.add('ex-right'); el.setAttribute('disabled',''); el.setAttribute('aria-pressed','false'); });
        st.sel = null;
        if(window.sfx) window.sfx.correct();
        if(Object.keys(st.matched).length === q.pairs.length){ _say(_run.host, q.explain || 'All matched!', true); setTimeout(_advance, _reduced() ? 700 : 850); }
        else { _say(_run.host, 'Match!', true); }
      } else {
        _markWrong();
        if(window.sfx) window.sfx.tryAgain();
        var a = st.sel.el, b = btn; _nudge(a); _nudge(b); a.classList.remove('ex-sel'); a.setAttribute('aria-pressed','false'); st.sel = null;
        _say(_run.host, 'Those don’t match — try again.', false);
      }
      return;
    }

    if(act === 'word'){
      var st2 = _run.qstate, wi = +btn.getAttribute('data-i');
      if(st2.sel[wi]){ delete st2.sel[wi]; btn.classList.remove('ex-sel'); btn.setAttribute('aria-pressed','false'); }
      else { st2.sel[wi] = true; btn.classList.add('ex-sel'); btn.setAttribute('aria-pressed','true'); }
      _say(_run.host, '', null);
      return;
    }

    if(act === 'move'){
      var pos = +btn.getAttribute('data-pos'), dir = +btn.getAttribute('data-dir'), ord = _run.qstate.order;
      var np = pos + dir; if(np < 0 || np >= ord.length) return;
      var t = ord[pos]; ord[pos] = ord[np]; ord[np] = t;
      var list = _run.host.querySelector('.ex-order'); if(list){ list.outerHTML = _orderListHtml(); }
      return;
    }

    if(act === 'check'){
      if(q.type === 'word'){
        var want = (q.answer || []).slice().sort().join(',');
        var got = Object.keys(_run.qstate.sel).map(Number).sort(function(a,b){ return a-b; }).join(',');
        if(want === got){ if(window.sfx) window.sfx.correct(); _say(_run.host, q.explain || 'Exactly!', true); _disableGroup(_run.host, '.ex-word'); btn.setAttribute('disabled',''); setTimeout(_advance, _reduced() ? 700 : 850); }
        else { _markWrong(); if(window.sfx) window.sfx.tryAgain(); _nudge(_run.host.querySelector('.ex-words')); _say(_run.host, 'Close — adjust your picks and check again.', false); }
      } else if(q.type === 'order'){
        var ans = (q.answer || []).join(','), cur = _run.qstate.order.join(',');
        if(ans === cur){ if(window.sfx) window.sfx.correct(); _say(_run.host, q.explain || 'Right order!', true); _disableGroup(_run.host, '.ex-omove'); btn.setAttribute('disabled',''); setTimeout(_advance, _reduced() ? 700 : 850); }
        else { _markWrong(); if(window.sfx) window.sfx.tryAgain(); _nudge(_run.host.querySelector('.ex-order')); _say(_run.host, 'Not the right order yet — try again.', false); }
      }
      return;
    }
  }
  function _disableGroup(host, sel){ Array.prototype.forEach.call(host.querySelectorAll(sel), function(el){ el.setAttribute('disabled',''); }); }

  // ── Picker + run lifecycle ───────────────────────────────────
  function _renderPicker(){
    _run.set = null; _run.qi = 0; _run.wrong = false;
    var today = _today();
    _run.host.innerHTML = '<div class="ex-card">'
      + '<div class="ex-head"><div class="ex-kicker">Practice</div>'
      +   '<button class="ex-close" type="button" data-ex="close" aria-label="Close practice">✕</button></div>'
      + '<h3 class="ex-prompt">Pick a quick set</h3>'
      + '<div class="ex-setlist">'
      +   SEED_SETS.map(function(s){
            var done = _clearedToday(s.id, today);
            return '<button class="ex-setcard" type="button" data-ex="setpick" data-id="' + _esc(s.id) + '">'
              + '<span class="ex-setcard__emoji" aria-hidden="true">' + _esc(s.emoji || '🧩') + '</span>'
              + '<span class="ex-setcard__body"><span class="ex-setcard__title">' + _esc(s.title) + '</span>'
              + '<span class="ex-setcard__meta">' + s.questions.length + ' questions' + (done ? ' · ✓ earned today' : '') + '</span></span></button>';
          }).join('')
      + '</div></div>';
  }
  function _today(){ return new Date().toISOString().slice(0,10); }
  function _clearedToday(id, today){ try { return !!(window.D && D.practiceClears && D.practiceClears[id] === today); } catch(_e){ return false; } }

  function _startSet(set, host, onDone){
    _run = { set:set, host:host, qi:0, wrong:false, onDone:onDone };
    _renderQuestion();
    var first = host.querySelector('button[data-ex]'); if(first) try { first.focus(); } catch(_e){}
  }

  // ── Public host (D1) ─────────────────────────────────────────
  function openPractice(){
    if(typeof document === 'undefined') return;
    var root = document.getElementById('exPracticeRoot');
    if(!root) return;
    root.hidden = false;
    root.classList.add('open');
    if(!root.__exWired){ root.__exWired = true; root.addEventListener('click', _onClick); }
    document.addEventListener('keydown', _onEsc);
    _run = { set:null, host:root, qi:0, wrong:false, onDone:null };
    _renderPicker();
    var c = root.querySelector('.ex-close'); if(c) try { c.focus(); } catch(_e){}
  }
  function closePractice(){
    var root = document.getElementById('exPracticeRoot');
    if(root){ root.classList.remove('open'); root.hidden = true; root.innerHTML = ''; }
    document.removeEventListener('keydown', _onEsc);
    _run = null;
  }
  function _onEsc(e){ if(e.key === 'Escape') closePractice(); }

  // ── Reusable run() — any set, any host (convergence API) ─────
  function run(set, hostEl, onDone){
    if(!set || !hostEl) return;
    if(!hostEl.__exWired){ hostEl.__exWired = true; hostEl.addEventListener('click', _onClick); }
    _startSet(set, hostEl, onDone);
  }

  if(typeof window !== 'undefined'){
    window.openPractice = openPractice;
    window.exerciseEngine = { open: openPractice, close: closePractice, run: run, sets: SEED_SETS };
  }
})();
