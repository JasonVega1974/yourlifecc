/* =============================================================
   constellation-kit.js — shared SVG primitives for the parent
   (#parentCelestialHome) and child (#appCommandCenter)
   constellation surfaces. Pure fragment + helper module — no
   DOM queries, no innerHTML, no surface coupling. Both renderers
   consume the kit; surface-specific node tables, link topology,
   and wrapper classes stay in their own files.

   Loaded BEFORE parent-celestial.js and command-center.js in
   index.html so both consumers see the kit's globals.

   Exports on window.ck*:
     ckMagRadii            tier table (bright / mid / dim)
     ckCurvePath(a,b,bow)  quadratic-bezier path string
     ckBuildStar(node,opts) bloom + halo + core + optional spikes + badge
     ckBuildMicrofield(positions) tiny background star circles
     ckPressNode(el,fn)    120ms flare-then-route press helper
============================================================= */

(function(){
  'use strict';

  // ── Magnitude radii ────────────────────────────────────
  // Per-tier radii for the three stacked circles each star is
  // built from. Bright tier additionally gets diffraction
  // spikes painted on top.
  const MAG_RADII = {
    bright: { core: 4,   halo: 7,   bloom: 15 },
    mid:    { core: 3.2, halo: 5.5, bloom: 11 },
    dim:    { core: 2.6, halo: 4.5, bloom:  9 }
  };

  // ── Curve helper ───────────────────────────────────────
  // Builds the SVG path for a single quadratic-bezier link.
  // The control point sits on the perpendicular bisector of
  // the chord, offset by `bow` units. Pure math, no DOM.
  function ckCurvePath(a, b, bow){
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    const px = -dy / len;
    const py =  dx / len;
    const cx = mx + px * bow;
    const cy = my + py * bow;
    return 'M ' + a.x + ' ' + a.y + ' Q ' + cx.toFixed(1) + ' ' + cy.toFixed(1)
         + ' ' + b.x + ' ' + b.y;
  }

  // ── Star primitive ─────────────────────────────────────
  // Returns an SVG string for one star: bloom + halo + core +
  // optional diffraction spikes (bright tier) + optional count
  // badge. Caller wraps in their own <g> with the wrapper
  // class (.pch-node / .cc-orb) and any state classes
  // (--hot / --reveal / --focus).
  //
  // node: { x, y, mag, count? }
  // opts: { accent? }  -- accent color overrides the brass
  //                       default (#FBBF24) for bloom + halo
  //                       fills. Child surface uses each
  //                       tile's per-domain accent; parent
  //                       omits and gets the brass language.
  function ckBuildStar(node, opts){
    opts = opts || {};
    const radii = MAG_RADII[node.mag] || MAG_RADII.mid;
    const accent = opts.accent || '#FBBF24';
    let out = '';

    // Bloom -- outermost soft wash. Reads as atmospheric glow
    // around the star. Hovered state lifts the opacity via CSS.
    out += '<circle class="star-bloom" cx="' + node.x + '" cy="' + node.y
         +    '" r="' + radii.bloom + '" fill="' + accent + '" fill-opacity=".11"/>';

    // Halo -- mid radius. Its opacity pulses on the surface's
    // breathe period via the .star-halo animation, which reads
    // --starBreathePeriod from the wrapper's inline style.
    out += '<circle class="star-halo" cx="' + node.x + '" cy="' + node.y
         +    '" r="' + radii.halo + '" fill="' + accent + '" fill-opacity=".45"/>';

    // Core -- warm-white center. The actual "star" itself.
    out += '<circle class="star-core" cx="' + node.x + '" cy="' + node.y
         +    '" r="' + radii.core + '" fill="#FFF7E0"/>';

    // Diffraction spikes -- bright tier only. A horizontal +
    // vertical line cross at +/-13 units, reading as the classic
    // four-spike sparkle of the chart's brightest stars.
    if (node.mag === 'bright') {
      out += '<line class="star-spike" x1="' + node.x + '" y1="' + (node.y - 13)
           +    '" x2="' + node.x + '" y2="' + (node.y + 13) + '"/>';
      out += '<line class="star-spike" x1="' + (node.x - 13) + '" y1="' + node.y
           +    '" x2="' + (node.x + 13) + '" y2="' + node.y + '"/>';
    }

    // Companion count badge -- amber dot with the count, sits
    // at upper-right of the star. The +4 y-offset on the text
    // centers vertically inside the r=8 circle without relying
    // on dominant-baseline (Safari quirk).
    if (node.count && node.count > 0) {
      out += '<circle class="star-badge-bg" cx="' + (node.x + 13)
           +    '" cy="' + (node.y - 13) + '" r="8" fill="#FBBF24"/>';
      out += '<text class="star-badge-text" x="' + (node.x + 13)
           +    '" y="' + (node.y - 13 + 4) + '">' + node.count + '</text>';
    }

    return out;
  }

  // ── Microfield ─────────────────────────────────────────
  // Builds SVG circles for an array of hardcoded faint stars.
  // Each: { x, y, r, fill, op, twinkle? } where twinkle is
  // the period in ms; positions WITH twinkle get the
  // .star-microfield--twinkle class + inline --starTwinklePeriod
  // CSS var so each twinkler runs on its own slow period.
  function ckBuildMicrofield(positions){
    if (!positions || !positions.length) return '';
    let out = '';
    for (let i = 0; i < positions.length; i++) {
      const m = positions[i];
      const cls = m.twinkle ? 'star-microfield star-microfield--twinkle' : 'star-microfield';
      const sty = m.twinkle ? (' style="--starTwinklePeriod:' + m.twinkle + 'ms;"') : '';
      out += '<circle class="' + cls + '"'
           +    ' cx="' + m.x + '" cy="' + m.y + '" r="' + m.r + '"'
           +    ' fill="' + m.fill + '" fill-opacity="' + m.op + '"'
           +    sty + '/>';
    }
    return out;
  }

  // ── Press flare helper ─────────────────────────────────
  // Adds .star-node--flare for ~200ms, then fires the
  // callback. The visual lands as "tap responds" rather than
  // "tap stalls". Surface-agnostic: parent passes
  // function(){ phNav(slot); }, child passes
  // function(){ ccOpenDest(dest); }.
  function ckPressNode(el, fn){
    if (!el || typeof fn !== 'function') return;
    try { el.classList.add('star-node--flare'); } catch(_e){}
    setTimeout(function(){
      try { fn(); } catch(_e){}
      setTimeout(function(){
        try { el.classList.remove('star-node--flare'); } catch(_e){}
      }, 220);
    }, 120);
  }

  // ── Exports ────────────────────────────────────────────
  if (typeof window !== 'undefined') {
    window.ckMagRadii         = MAG_RADII;
    window.ckCurvePath        = ckCurvePath;
    window.ckBuildStar        = ckBuildStar;
    window.ckBuildMicrofield  = ckBuildMicrofield;
    window.ckPressNode        = ckPressNode;
  }
})();
