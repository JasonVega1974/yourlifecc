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

  // Phase V sample allowlist — one team / one individual / one reviewed exemplar.
  // Expand to all 16 once the pattern is approved.
  var FX_SPORTS = { basketball:1, track:1, swimming:1 };

  // Original line-art motifs (stroke paths, fill:none, currentColor → theme).
  var MOTIFS = {
    basketball:
      '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">'
      + '<circle cx="60" cy="60" r="46"/>'
      + '<line x1="60" y1="14" x2="60" y2="106"/>'
      + '<line x1="14" y1="60" x2="106" y2="60"/>'
      + '<path d="M27 27 Q60 60 27 93"/>'
      + '<path d="M93 27 Q60 60 93 93"/>'
      + '</svg>',
    track:
      '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
      + '<circle cx="66" cy="24" r="8.5"/>'                 // head
      + '<path d="M62 34 L53 63"/>'                          // forward-leaning torso
      + '<path d="M59 41 L77 35"/>'                          // lead arm reaching
      + '<path d="M56 44 L41 51"/>'                          // trailing arm
      + '<path d="M53 63 L67 58 L71 41"/>'                   // driving front leg (knee up)
      + '<path d="M53 63 L41 80 L30 92"/>'                   // extended back leg
      + '<line x1="18" y1="101" x2="100" y2="101"/>'         // track line
      + '<line x1="12" y1="40" x2="30" y2="40"/>'            // speed line
      + '<line x1="9" y1="52" x2="29" y2="52"/>'             // speed line
      + '</svg>',
    swimming:
      '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M6 76 Q22 68 38 76 T70 76 T102 76 T134 76"/>'  // water surface
      + '<circle cx="50" cy="64" r="8"/>'                        // head at the surface
      + '<path d="M45 67 Q70 78 98 68"/>'                        // body along the surface
      + '<path d="M55 60 Q64 38 82 46"/>'                        // recovering arm arcing over
      + '<path d="M47 68 L38 82"/>'                              // pulling arm
      + '<path d="M40 84 L35 90 M46 86 L43 92"/>'                // splash
      + '</svg>',
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
    if(!overlay || !FX_SPORTS[id]) return;
    var sheet = overlay.querySelector('.sds-sheet');
    if(!sheet) return;
    if(window._sportsFxObs){ try { window._sportsFxObs.disconnect(); } catch(e){} window._sportsFxObs = null; }

    // 1) Hero band — theme palette (CSS, from --sd-a/--sd-b) + line-art motif.
    var head = sheet.querySelector('.sds-head');
    if(head && !head.querySelector('.sds-hero-art')){
      head.classList.add('sds-hero');
      var art = document.createElement('div');
      art.className = 'sds-hero-art';
      art.setAttribute('aria-hidden', 'true');
      art.innerHTML = MOTIFS[id] || '';
      head.insertBefore(art, head.firstChild);
    }

    // 2) Count-up targets — the recruiting scholarship figures.
    var numEls = [];
    var gold = sheet.querySelector('.sds-deepsec--gold');
    if(gold){ Array.prototype.forEach.call(gold.querySelectorAll('.sds-kv__v'), function(v){ var n = wrapNumber(v); if(n) numEls.push(n); }); }

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

  window.sportsFxApply = apply;
})();
