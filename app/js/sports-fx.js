/* sports-fx.js — Sports deep-sheet visual layer (Phase V).
   ONE deferred, non-blocking module (loaded via <script defer> alongside the
   other sports scripts). Adds, to the deep sport sheet:
     1) a per-sport hero band — the sport's theme palette + an ORIGINAL line-art
        SVG motif (no raster, no photos, no network requests);
     2) scroll-reveal entrance choreography — sections fade + translateY-in as
        they enter view, staggered, via ONE IntersectionObserver that unobserves
        each element after it fires;
     3) count-up — the recruiting scholarship figure counts up on reveal.

   HARD perf guardrails (see harness): CSS/SVG only; transform + opacity only
   (no layout-animating properties); IntersectionObserver-gated so off-screen
   content never animates; full prefers-reduced-motion path (instant reveal, no
   movement, count-up shows the final value immediately); vanilla JS + CSS, no
   libraries. The visual state is applied by THIS module via .fx-reveal/.fx-in —
   a sheet rendered without the module loaded looks exactly as before. */
(function(){
  'use strict';

  // Original line-art motifs — ENVIRONMENTAL: each evokes the sport's SPACE or
  // signature equipment (the emoji is the sport ID; the motif is its place).
  // Clean geometric forms, stroke paths, fill:none, currentColor → theme. One
  // per SPORT_DATA sport so the hero treatment can roll across all 16.
  function svg(body){ return '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>'; }
  var MOTIFS = {
    // gridiron — yard lines, hash marks + a goalpost
    football: svg('<path d="M16 46 H104 M16 62 H104 M16 78 H104 M16 94 H104"/><path d="M58 46 v5 M62 46 v5 M58 62 v5 M62 62 v5 M58 78 v5 M62 78 v5"/><path d="M48 46 V26 M72 46 V26 M44 30 H76 M60 30 V14"/>'),
    // the key — lane, free-throw circle, baseline + restricted arc
    basketball: svg('<rect x="44" y="34" width="32" height="58"/><circle cx="60" cy="34" r="15"/><path d="M44 92 H76"/><path d="M51 92 a9 9 0 0 1 18 0"/>'),
    // the pitch — boundary, halfway line, center circle, penalty boxes
    soccer: svg('<rect x="20" y="24" width="80" height="72" rx="2"/><path d="M20 60 H100"/><circle cx="60" cy="60" r="13"/><rect x="46" y="24" width="28" height="13"/><rect x="46" y="83" width="28" height="13"/>'),
    // the diamond — bases, pitcher\'s mound + foul lines
    baseball: svg('<path d="M60 30 L86 56 L60 82 L34 56 Z"/><circle cx="60" cy="56" r="4.5"/><path d="M60 82 L32 100 M60 82 L88 100"/><rect x="57.5" y="79.5" width="5" height="5"/><rect x="83" y="53.5" width="5" height="5"/><rect x="57.5" y="28" width="5" height="5"/><rect x="32" y="53.5" width="5" height="5"/>'),
    // the diamond — with the softball pitching circle (heavier so it reads small)
    softball: svg('<path d="M60 32 L84 56 L60 80 L36 56 Z"/><circle cx="60" cy="56" r="10" stroke-width="3.4"/><path d="M60 80 L34 98 M60 80 L86 98"/>'),
    // the oval — outer track + inner lane + finish line
    track: svg('<rect x="20" y="38" width="80" height="46" rx="23"/><rect x="31" y="48" width="58" height="26" rx="13"/><path d="M60 38 V48"/>'),
    // a winding course — hill ridge, an S-curving trail + a finish arch at its end
    crosscountry: svg('<path d="M10 54 Q32 38 54 52 T96 48"/><path d="M14 96 Q34 88 42 76 Q50 62 68 66 Q82 69 86 80"/><path d="M76 80 V70 M96 80 V70 M76 70 a10 10 0 0 1 20 0"/>'),
    // the court — net, attack lines + center net mesh
    volleyball: svg('<rect x="24" y="44" width="72" height="34"/><path d="M60 34 V88"/><path d="M44 44 V78 M76 44 V78"/><path d="M55 42 H65 M55 50 H65 M55 58 H65 M55 66 H65 M58 40 V72 M62 40 V72"/>'),
    // the pool — lane ropes + wall T-marks
    swimming: svg('<rect x="18" y="34" width="84" height="52" rx="2"/><path d="M18 47 H102 M18 60 H102 M18 73 H102"/><path d="M28 42 V52 M92 42 V52 M28 68 V78 M92 68 V78"/>'),
    // the mat — concentric circles + center starting lines
    wrestling: svg('<circle cx="60" cy="60" r="42"/><circle cx="60" cy="60" r="26"/><circle cx="60" cy="60" r="5"/><path d="M52 57 H58 M52 63 H58 M62 57 H68 M62 63 H68"/>'),
    // the court — net, singles lines, service boxes
    tennis: svg('<rect x="22" y="28" width="76" height="64"/><path d="M22 60 H98"/><path d="M34 28 V92 M86 28 V92"/><path d="M34 44 H86 M34 76 H86"/><path d="M60 44 V76"/>'),
    // the green — flagstick, flag, hole + a fairway sweep
    golf: svg('<ellipse cx="58" cy="62" rx="42" ry="26"/><circle cx="68" cy="58" r="3"/><path d="M68 58 V22"/><path d="M68 22 L90 28 L68 35"/><path d="M16 92 Q40 82 60 86"/>'),
    // the goal, net + the full crease arc and restraining line (the lacrosse tell)
    lacrosse: svg('<rect x="48" y="40" width="24" height="20"/><path d="M48 47 H72 M48 54 H72 M56 40 V60 M64 40 V60"/><path d="M26 60 a34 34 0 0 1 68 0"/><path d="M26 60 H94"/><path d="M20 78 H100"/>'),
    // the uneven bars — two asymmetric rail sets, side by side (no figure)
    gymnastics: svg('<path d="M26 46 H58 M28 46 V96 M56 46 V96"/><path d="M62 72 H96 M64 72 V96 M94 72 V96"/><path d="M22 96 H100"/>'),
    // the rink — center line, faceoff circle, blue lines + dots
    hockey: svg('<rect x="18" y="30" width="84" height="60" rx="20"/><path d="M60 30 V90"/><circle cx="60" cy="60" r="10"/><path d="M40 30 V90 M80 30 V90"/><circle cx="32" cy="46" r="1.8"/><circle cx="88" cy="74" r="1.8"/>'),
    // the competition floor — bordered mat, interior panel grid + a tumbling-pass arc
    cheerleading: svg('<rect x="18" y="38" width="84" height="48" rx="3"/><rect x="25" y="45" width="70" height="34"/><path d="M48 45 V79 M72 45 V79 M25 62 H95"/><path d="M30 76 Q50 46 66 72 Q78 90 92 56"/>'),
  };

  function prefersReduce(){
    try { return (window._fxForceReduce === true) || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(e){ return false; }
  }

  // Count a number up from 0 to its target on reveal. Reserves the final width
  // first (tabular-nums + min-width) so the text update never reflows layout.
  function countUp(el){
    if(!el || el._fxDone) return; el._fxDone = true;
    var target = parseFloat(String(el.getAttribute('data-countup') || '').replace(/,/g, ''));
    if(!isFinite(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var fmt = function(n){ return prefix + Math.round(n).toLocaleString('en-US'); };
    el.textContent = fmt(target);
    try { el.style.minWidth = el.offsetWidth + 'px'; } catch(e){}
    if(prefersReduce()) return;            // final value already shown
    el.textContent = fmt(0);
    try { el.setAttribute('aria-hidden', 'true'); } catch(e){}  // don't announce in-between values
    var dur = 900, t0 = null;
    function step(ts){
      if(t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if(p < 1){ requestAnimationFrame(step); }
      else { el.textContent = fmt(target); try { el.removeAttribute('aria-hidden'); } catch(e){} }
    }
    requestAnimationFrame(step);
  }

  // Wrap the first meaningful number (>= 100, so trivial "1%" is left alone) in a
  // value cell so it can count up. Returns the span, or null.
  function wrapNumber(el){
    var html = el.innerHTML, m = html.match(/\$?\d[\d,]*/);
    if(!m) return null;
    var raw = m[0], num = raw.replace(/[$,]/g, '');
    if(parseFloat(num) < 100) return null;
    var span = '<span class="fx-num" data-countup="' + num + '"' + (raw.charAt(0) === '$' ? ' data-prefix="$"' : '') + '>' + raw + '</span>';
    el.innerHTML = html.replace(raw, span);
    return el.querySelector('.fx-num');
  }

  function apply(overlay, id){
    if(!overlay) return;
    var sheet = overlay.querySelector('.sds-sheet');
    if(!sheet) return;
    if(window._sportsFxObs){ try { window._sportsFxObs.disconnect(); } catch(e){} window._sportsFxObs = null; }

    // 1) Hero band — theme palette (CSS, from --sd-a/--sd-b) + line-art motif.
    var head = sheet.querySelector('.sds-head');
    if(head && MOTIFS[id] && !head.querySelector('.sds-hero-art')){
      head.classList.add('sds-hero');
      var art = document.createElement('div');
      art.className = 'sds-hero-art';
      art.setAttribute('aria-hidden', 'true');
      art.innerHTML = MOTIFS[id] || '';
      head.insertBefore(art, head.firstChild);
    }

    // 2) Count-up targets — wrap the recruiting scholarship figures, then collect
    //    every .fx-num (recruiting + any pre-marked funnel figures from Beyond the Game).
    var gold = sheet.querySelector('.sds-deepsec--gold');
    if(gold){ Array.prototype.forEach.call(gold.querySelectorAll('.sds-kv__v'), function(v){ wrapNumber(v); }); }
    var numEls = Array.prototype.slice.call(sheet.querySelectorAll('.fx-num[data-countup]'));

    // 3) Scroll-reveal — hidden state applied here (so no-module = visible).
    var secs = sheet.querySelectorAll('.sds-lead, .sds-sec');
    var i = 0;
    Array.prototype.forEach.call(secs, function(el){ el.classList.add('fx-reveal'); el.style.setProperty('--fx-i', (i++ % 6)); });

    if(prefersReduce()){
      Array.prototype.forEach.call(secs, function(el){ el.classList.add('fx-in'); });
      numEls.forEach(countUp);             // sets final value immediately
      return;
    }

    var remaining = secs.length;
    var obs = new IntersectionObserver(function(entries, o){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        en.target.classList.add('fx-in');
        numEls.forEach(function(n){ if(en.target.contains(n)) countUp(n); });
        o.unobserve(en.target);            // disconnect this element after firing
        if(--remaining <= 0){ try { o.disconnect(); } catch(e){} if(window._sportsFxObs === o) window._sportsFxObs = null; }
      });
    }, { root: sheet, threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    window._sportsFxObs = obs;
    Array.prototype.forEach.call(secs, function(el){ obs.observe(el); });
  }

  // Generic scroll-reveal for surfaces beyond the deep sheet (e.g. the My Sports
  // athlete page). Reveal ONLY — no count-up — so nothing here ever animates a
  // number (weight stays a static, un-animated field). Observed against the page
  // viewport; full reduced-motion path (instant, no movement).
  function reveal(scope, sel){
    if(!scope) return null;
    var els = scope.querySelectorAll(sel);
    var i = 0;
    Array.prototype.forEach.call(els, function(el){ el.classList.add('fx-reveal'); el.style.setProperty('--fx-i', (i++ % 6)); });
    if(prefersReduce()){ Array.prototype.forEach.call(els, function(el){ el.classList.add('fx-in'); }); return null; }
    var remaining = els.length;
    if(!remaining) return null;
    var obs = new IntersectionObserver(function(entries, o){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        en.target.classList.add('fx-in');
        o.unobserve(en.target);
        if(--remaining <= 0){ try { o.disconnect(); } catch(e){} }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    Array.prototype.forEach.call(els, function(el){ obs.observe(el); });
    return obs;
  }

  window.sportsFxApply  = apply;
  window.sportsFxReveal = function(scope, sel){ return reveal(scope, sel || '.fx-reveal-target'); };
  window.sportsFxMotif  = function(id){ return MOTIFS[id] || ''; };
})();
