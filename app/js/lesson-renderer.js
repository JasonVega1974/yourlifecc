/* =============================================================
   lesson-renderer.js — spec-driven Life-Skills lesson presenter.

   ONE reusable renderer: given a module spec (an array of lesson
   specs, each a list of typed blocks), it renders a block-based
   lesson UI — so we redesign the presentation once and every lesson
   that has a spec upgrades. Isolation by design: openSkillCategory()
   in skills.js routes a category here only if SK_SPECS[key] exists;
   every other category stays on the legacy prose accordion untouched.

   Public:
     window.lessonRenderer.mount(hostEl, moduleSpec)
     window.lessonRenderer.blocks   — block-type → renderer map (extensible)
     window.lessonRenderer.viz      — viz kind → renderer map
     window.lessonRenderer.widgets  — widget kind → mount fn map

   moduleSpec = { key, color?, lessons: [ lessonSpec ] }
   lessonSpec = { id?, title, duration?, blocks: [ block ] }

   Block types (discriminated by `type`):
     lead      { text }
     keyIdea   { title?, text }
     stat      { items:[{value,label}] }
     list      { style?:'bullet'|'check', items:[ text | {strong,text} ] }
     compare   { left:{title,points[]}, right:{title,points[]} }
     steps     { items:[{title?,text}] }
     takeaways { items:[ text ] }
     tip       { text }                      ← the long-dark SK_DATA `tip`, finally shown
     check     { q, opts:[..], ans:idx, explain? }
     viz       { kind, data }                ← declarative visual (e.g. taxBrackets)
     widget    { kind, config }              ← interactive, mounted post-render (e.g. taxCalculator)
     prose     { html }                      ← escape hatch: trusted legacy HTML, verbatim

   TRUST BOUNDARY: typed text fields are escaped (escapeHtml). Only
   `prose.html` and viz/widget output (author-controlled, no user input)
   are injected as raw HTML — same trust model the legacy accordion used.
   ============================================================= */
(function(){
  'use strict';

  function esc(s){
    if(typeof window.escapeHtml === 'function') return window.escapeHtml(s == null ? '' : String(s));
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function money(n){
    try { return '$' + Math.round(n).toLocaleString('en-US'); } catch(_e){ return '$' + Math.round(n); }
  }
  function pct(x){ return (Math.round(x * 1000) / 10) + '%'; }
  // Reduced-motion gate (mirrors exercise-engine). Diagrams stay fully
  // readable static; only CSS glow/animation is suppressed when true.
  function _reduced(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch(_e){ return false; }
  }
  // 5 lug nuts evenly around a hub (schematic).
  function _lugs(cx, cy, r, nr, fill){
    var s = '';
    for(var k = 0; k < 5; k++){
      var a = (-90 + k * 72) * Math.PI / 180;
      s += '<circle cx="' + (cx + r * Math.cos(a)).toFixed(1) + '" cy="' + (cy + r * Math.sin(a)).toFixed(1) + '" r="' + nr + '" fill="' + fill + '"/>';
    }
    return s;
  }
  // Small triangular arrowhead at (x,y) pointing along angle `ang` (radians).
  function _arrowhead(x, y, ang, color){
    var s = 8;
    var p2x = x - s * Math.cos(ang - 0.42), p2y = y - s * Math.sin(ang - 0.42);
    var p3x = x - s * Math.cos(ang + 0.42), p3y = y - s * Math.sin(ang + 0.42);
    return '<polygon points="' + x.toFixed(1) + ',' + y.toFixed(1) + ' ' + p2x.toFixed(1) + ',' + p2y.toFixed(1) + ' ' + p3x.toFixed(1) + ',' + p3y.toFixed(1) + '" fill="' + color + '"/>';
  }

  // ── Declarative visuals ──────────────────────────────────────
  // 2025 single-filer federal brackets, for the bracket ladder + calculator.
  var TAX_2025 = {
    single:  { std:15750, brackets:[[0,11925,.10],[11925,48475,.12],[48475,103350,.22],[103350,197300,.24],[197300,250525,.32],[250525,626350,.35],[626350,Infinity,.37]] },
    married: { std:31500, brackets:[[0,23850,.10],[23850,96950,.12],[96950,206700,.22],[206700,394600,.24],[394600,501050,.32],[501050,751600,.35],[751600,Infinity,.37]] }
  };
  var BRACKET_COLORS = ['#34d399','#22d3ee','#38bdf8','#818cf8','#a78bfa','#f472b6','#fb7185'];

  var VIZ = {
    // A horizontal stacked ladder of the progressive brackets — shows that
    // each rate applies only to its slice. Caps the top (∞) bracket visually.
    taxBrackets: function(data){
      var status = (data && data.status) || 'single';
      var rows = TAX_2025[status].brackets;
      // Visual cap so the wide upper slabs (35%/37%) don't drown the low
      // brackets most people actually live in. Clamp EVERY segment to the
      // cap and drop anything entirely above it; the last visible bracket
      // gets a "+" since its real ceiling runs past the chart.
      var capTop = 260000;
      var segs = [];
      for(var i = 0; i < rows.length; i++){
        var rawLo = rows[i][0], rawHi = rows[i][1], rate = rows[i][2];
        var lo = Math.min(rawLo, capTop);
        var hi = Math.min(rawHi === Infinity ? capTop : rawHi, capTop);
        var span = hi - lo;
        if(span <= 0) continue;                 // bracket starts beyond the chart
        var clipped = (rawHi === Infinity) || (rawHi > capTop);
        segs.push({ lo:rawLo, rawHi:rawHi, rate:rate, span:span, color:BRACKET_COLORS[i % BRACKET_COLORS.length], top:clipped });
      }
      var total = segs.reduce(function(s, x){ return s + x.span; }, 0) || 1;
      function range(s){ return money(s.lo) + (s.top ? '+' : '–' + money(s.rawHi)); }
      var bar = segs.map(function(s){
        var w = (s.span / total) * 100;
        return '<div class="lr-brk__seg" style="width:' + w.toFixed(2) + '%;background:' + s.color + ';" '
          + 'title="' + pct(s.rate) + ' on ' + range(s) + '">'
          + '<span class="lr-brk__rate">' + pct(s.rate) + '</span></div>';
      }).join('');
      var legend = segs.map(function(s){
        return '<div class="lr-brk__leg"><span class="lr-brk__dot" style="background:' + s.color + ';"></span>'
          + '<b>' + pct(s.rate) + '</b> <span>' + range(s) + '</span></div>';
      }).join('');
      return '<figure class="lr-brk"><figcaption class="lr-brk__cap">2025 federal brackets · ' + esc(status === 'married' ? 'married filing jointly' : 'single filer') + '</figcaption>'
        + '<div class="lr-brk__bar">' + bar + '</div>'
        + '<div class="lr-brk__legend">' + legend + '</div></figure>';
    },
    // FICO score ranges 300–850 as a proportional band.
    creditScoreBand: function(data){
      var bands = [
        { lo:300, hi:579, name:'Poor', color:'#ef4444' },
        { lo:580, hi:669, name:'Fair', color:'#fb923c' },
        { lo:670, hi:739, name:'Good', color:'#fbbf24' },
        { lo:740, hi:799, name:'Very good', color:'#a3e635' },
        { lo:800, hi:850, name:'Exceptional', color:'#34d399' }
      ];
      var total = 850 - 300;
      var bar = bands.map(function(b){
        var w = ((b.hi - b.lo + 1) / total) * 100;
        return '<div class="lr-brk__seg" style="width:' + w.toFixed(1) + '%;background:' + b.color + ';" title="' + b.name + ' ' + b.lo + '–' + b.hi + '"><span class="lr-brk__rate">' + (w > 15 ? b.name : '') + '</span></div>';
      }).join('');
      var legend = bands.map(function(b){
        return '<div class="lr-brk__leg"><span class="lr-brk__dot" style="background:' + b.color + ';"></span><b>' + b.lo + '–' + b.hi + '</b> <span>' + b.name + '</span></div>';
      }).join('');
      return '<figure class="lr-brk"><figcaption class="lr-brk__cap">FICO score ranges (300–850)</figcaption><div class="lr-brk__bar">' + bar + '</div><div class="lr-brk__legend">' + legend + '</div></figure>';
    },
    // The five FICO factors and their weights as a stacked 100% bar.
    creditFactors: function(data){
      var f = [
        { name:'Payment history', pct:35, color:'#34d399' },
        { name:'Utilization', pct:30, color:'#60a5fa' },
        { name:'Length of history', pct:15, color:'#a78bfa' },
        { name:'Credit mix', pct:10, color:'#fbbf24' },
        { name:'New credit', pct:10, color:'#fb7185' }
      ];
      var bar = f.map(function(x){
        return '<div class="lr-brk__seg" style="width:' + x.pct + '%;background:' + x.color + ';"><span class="lr-brk__rate">' + (x.pct >= 15 ? x.pct + '%' : '') + '</span></div>';
      }).join('');
      var legend = f.map(function(x){
        return '<div class="lr-brk__leg"><span class="lr-brk__dot" style="background:' + x.color + ';"></span><b>' + x.pct + '%</b> <span>' + x.name + '</span></div>';
      }).join('');
      return '<figure class="lr-brk"><figcaption class="lr-brk__cap">What makes up your FICO score</figcaption><div class="lr-brk__bar">' + bar + '</div><div class="lr-brk__legend">' + legend + '</div></figure>';
    },
    // Generic proportional labeled bars — the shared visual-pass primitive.
    //   data.mode 'stack'  → one bar split into segments (composition)
    //   data.mode 'compare'→ one bar per item, scaled to the max (magnitude)
    //   data.items: [{ label, value, color?, note?, highlight? }]
    //   data.money:true formats values as currency; data.unit appends a unit.
    //   data.caption: optional heading.
    valueBars: function(data){
      data = data || {};
      var items = data.items || [];
      var PAL = ['#60a5fa', '#fbbf24', '#34d399', '#a78bfa', '#fb7185', '#22d3ee'];
      var cap = data.caption ? '<figcaption class="lr-brk__cap">' + esc(data.caption) + '</figcaption>' : '';
      function fv(v){ return data.money ? money(v) : esc(v + (data.unit ? data.unit : '')); }
      if(data.mode === 'stack'){
        var total = items.reduce(function(s, x){ return s + (x.value || 0); }, 0) || 1;
        var bar = items.map(function(x, i){
          var w = ((x.value || 0) / total) * 100, col = x.color || PAL[i % PAL.length];
          return '<div class="lr-brk__seg" style="width:' + w.toFixed(1) + '%;background:' + col + ';'
            + (x.highlight ? 'outline:2px solid var(--tx);outline-offset:-2px;' : '') + '" title="' + esc(x.label) + '">'
            + '<span class="lr-brk__rate">' + (w >= 13 ? Math.round(w) + '%' : '') + '</span></div>';
        }).join('');
        var legend = items.map(function(x, i){
          var col = x.color || PAL[i % PAL.length];
          return '<div class="lr-brk__leg"><span class="lr-brk__dot" style="background:' + col + ';"></span><b>' + fv(x.value) + '</b> <span>' + esc(x.label) + (x.highlight ? ' ★' : '') + '</span></div>';
        }).join('');
        return '<figure class="lr-brk">' + cap + '<div class="lr-brk__bar">' + bar + '</div><div class="lr-brk__legend">' + legend + '</div></figure>';
      }
      // compare mode
      var max = items.reduce(function(m, x){ return Math.max(m, x.value || 0); }, 0) || 1;
      var rows = items.map(function(x, i){
        var w = ((x.value || 0) / max) * 100, col = x.color || PAL[i % PAL.length];
        return '<div class="lr-vb__row">'
          + '<span class="lr-vb__label">' + esc(x.label) + '</span>'
          + '<span class="lr-vb__track"><span class="lr-vb__fill' + (x.highlight ? ' lr-vb__fill--hl' : '') + '" style="width:' + w.toFixed(1) + '%;background:' + col + ';"></span></span>'
          + '<span class="lr-vb__val">' + fv(x.value) + '</span></div>'
          + (x.note ? '<div class="lr-vb__note">' + esc(x.note) + '</div>' : '');
      }).join('');
      return '<figure class="lr-brk">' + cap + '<div class="lr-vb">' + rows + '</div></figure>';
    }
  };

  // ── Schematic diagrams (reusable SVG primitives) ─────────────
  // Clean shapes, theme-token colors (adapt to light/dark). `ctx.animate`
  // is false under prefers-reduced-motion — diagrams stay fully readable;
  // only the star-sequence glow is gated.
  var DIAGRAMS = {
    // Break each lug nut loose while the wheel is still on the ground.
    wheelLoosen: function(cfg, ctx){
      var cx = 78, cy = 88;
      return '<svg viewBox="0 0 210 174" class="lr-svg" role="img" aria-label="Break each lug nut loose about a half turn counter-clockwise while the tire is still on the ground">'
        + '<line x1="10" y1="150" x2="200" y2="150" stroke="var(--tx3)" stroke-width="3" stroke-linecap="round"/>'
        + '<g stroke="var(--tx3)" stroke-width="1.5" opacity=".5"><line x1="26" y1="150" x2="18" y2="162"/><line x1="64" y1="150" x2="56" y2="162"/><line x1="102" y1="150" x2="94" y2="162"/><line x1="140" y1="150" x2="132" y2="162"/><line x1="178" y1="150" x2="170" y2="162"/></g>'
        + '<circle cx="' + cx + '" cy="' + cy + '" r="54" fill="none" stroke="var(--tx2)" stroke-width="16"/>'
        + '<circle cx="' + cx + '" cy="' + cy + '" r="38" fill="var(--s2)" stroke="var(--br)" stroke-width="2"/>'
        + _lugs(cx, cy, 22, 5.5, 'var(--tx3)')
        + '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="var(--tx3)"/>'
        + '<rect x="' + (cx + 16) + '" y="' + (cy - 6) + '" width="96" height="12" rx="3" fill="var(--lr-accent,#60a5fa)"/>'
        + '<circle cx="' + (cx + 22) + '" cy="' + cy + '" r="11" fill="none" stroke="var(--lr-accent,#60a5fa)" stroke-width="5"/>'
        + '<path d="M' + cx + ' ' + (cy - 50) + ' A50 50 0 0 0 ' + (cx - 50) + ' ' + cy + '" fill="none" stroke="var(--gr,#34d399)" stroke-width="4"/>'
        + _arrowhead(cx - 50, cy, Math.PI / 2, 'var(--gr,#34d399)')
        + '<text x="158" y="44" text-anchor="middle" font-size="12" font-weight="700" fill="var(--gr,#34d399)">loosen ½ turn</text>'
        + '<text x="105" y="170" text-anchor="middle" font-size="11" fill="var(--tx3)">tire still on the ground</text>'
        + '</svg>';
    },
    // Jack under the reinforced frame jack point near the flat.
    carJackPoint: function(cfg, ctx){
      return '<svg viewBox="0 0 250 150" class="lr-svg" role="img" aria-label="Place the jack under the reinforced frame jack point shown in your owner manual, near the flat tire">'
        + '<line x1="10" y1="132" x2="240" y2="132" stroke="var(--tx3)" stroke-width="3" stroke-linecap="round"/>'
        + '<path d="M28 98 L52 98 Q60 72 92 68 L150 66 Q178 66 198 94 L218 98 L224 102 L224 110 L28 110 Z" fill="var(--s3)" stroke="var(--tx2)" stroke-width="2"/>'
        + '<path d="M72 70 L96 72 L148 70 L172 72" fill="none" stroke="var(--tx2)" stroke-width="2" opacity=".7"/>'
        + '<circle cx="74" cy="112" r="20" fill="var(--tx2)"/><circle cx="74" cy="112" r="9" fill="var(--s2)"/>'
        + '<circle cx="188" cy="112" r="20" fill="var(--tx2)"/><circle cx="188" cy="112" r="9" fill="var(--s2)"/>'
        + '<g stroke="var(--lr-accent,#60a5fa)" stroke-width="3" fill="none"><path d="M150 110 L138 122 L150 132 M150 110 L162 122 L150 132"/></g>'
        + '<rect x="139" y="130" width="22" height="5" rx="2" fill="var(--lr-accent,#60a5fa)"/>'
        + '<line x1="150" y1="110" x2="150" y2="98" stroke="var(--g,#fbbf24)" stroke-width="3"/>'
        + _arrowhead(150, 98, -Math.PI / 2, 'var(--g,#fbbf24)')
        + '<text x="150" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="var(--g,#fbbf24)">frame jack point</text>'
        + '</svg>';
    },
    // 5 lug nuts numbered in star tightening order, with the star path.
    starPattern: function(cfg, ctx){
      var cx = 85, cy = 88, R = 56, nr = 15;
      var seq = [0, 2, 4, 1, 3];               // pentagram tightening order
      var pos = [];
      for(var k = 0; k < 5; k++){ var a = (-90 + k * 72) * Math.PI / 180; pos.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
      var numAt = [];
      seq.forEach(function(p, i){ numAt[p] = i + 1; });
      var d = 'M' + pos[seq[0]][0].toFixed(1) + ' ' + pos[seq[0]][1].toFixed(1);
      for(var i = 1; i < seq.length; i++){ d += ' L' + pos[seq[i]][0].toFixed(1) + ' ' + pos[seq[i]][1].toFixed(1); }
      d += ' Z';
      var nuts = '';
      for(var p = 0; p < 5; p++){
        var x = pos[p][0], y = pos[p][1], n = numAt[p];
        var glow = (ctx && ctx.animate) ? ' lr-star__glow' : '';
        nuts += '<circle class="lr-star__ring' + glow + '" style="animation-delay:' + ((n - 1) * 0.9).toFixed(2) + 's" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (nr + 5) + '" fill="none" stroke="var(--lr-accent,#60a5fa)" stroke-width="3"/>'
          + '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + nr + '" fill="var(--s2)" stroke="var(--tx3)" stroke-width="2"/>'
          + '<text x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--tx)">' + n + '</text>';
      }
      return '<svg viewBox="0 0 170 178" class="lr-svg" role="img" aria-label="Tighten the lug nuts in a star pattern: one, two, three, four, five across the wheel, not in a circle">'
        + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 16) + '" fill="none" stroke="var(--br)" stroke-width="2"/>'
        + '<path d="' + d + '" fill="none" stroke="var(--lr-accent,#60a5fa)" stroke-width="2" stroke-dasharray="4 4" opacity=".55"/>'
        + '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="var(--tx3)"/>'
        + nuts
        + '<text x="' + cx + '" y="172" text-anchor="middle" font-size="11" fill="var(--tx3)">star order 1 → 2 → 3 → 4 → 5</text>'
        + '</svg>';
    },
    // The three tools you need, labeled.
    toolRow: function(cfg, ctx){
      return '<svg viewBox="0 0 252 104" class="lr-svg lr-svg--wide" role="img" aria-label="Tools you need: a jack, a lug wrench, and the spare tire">'
        + '<g transform="translate(42,38)"><g stroke="var(--tx2)" stroke-width="3" fill="none"><path d="M-16 18 L0 0 L16 18 M-16 18 L0 34 L16 18"/></g><rect x="-15" y="32" width="30" height="6" rx="2" fill="var(--tx2)"/></g>'
        + '<text x="42" y="94" text-anchor="middle" font-size="11" fill="var(--tx2)">Jack</text>'
        + '<g transform="translate(126,36)" stroke="var(--tx2)" stroke-width="6" stroke-linecap="round" fill="none"><line x1="-22" y1="0" x2="22" y2="0"/><line x1="0" y1="-20" x2="0" y2="22"/></g>'
        + '<circle cx="126" cy="60" r="6" fill="var(--s2)" stroke="var(--tx2)" stroke-width="4"/>'
        + '<text x="126" y="94" text-anchor="middle" font-size="11" fill="var(--tx2)">Lug wrench</text>'
        + '<g transform="translate(210,40)"><circle r="26" fill="none" stroke="var(--tx2)" stroke-width="9"/><circle r="9" fill="var(--s2)" stroke="var(--br)" stroke-width="2"/></g>'
        + '<text x="210" y="94" text-anchor="middle" font-size="11" fill="var(--tx2)">Spare</text>'
        + '</svg>';
    },
    // Jumper-cable connection order. The whole point of this diagram is WHERE
    // clamp 4 lands: bare unpainted engine metal, away from the battery — and
    // the dead battery's − terminal is explicitly marked "never here", because
    // the final spark there can ignite vented hydrogen.
    jumperCables: function(cfg, ctx){
      var an = ctx && ctx.animate;
      function badge(x, y, n, fill){
        var g = an ? '<circle class="lr-seqglow" style="animation-delay:' + ((n - 1) * 0.9).toFixed(2) + 's" cx="' + x + '" cy="' + y + '" r="15" fill="' + fill + '"/>' : '';
        return g + '<circle cx="' + x + '" cy="' + y + '" r="10" fill="' + fill + '"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#0b1220">' + n + '</text>';
      }
      var s = '<svg viewBox="0 0 286 200" class="lr-svg lr-svg--wide" role="img" aria-label="Jumper cable order: one, red to the dead battery positive; two, red to the good battery positive; three, black to the good battery negative; four, black to bare unpainted engine metal on the dead car, away from the battery — never the dead battery negative terminal">';
      // red cable (1 -> 2) over the top, black cable (3 -> 4) down to the ground bolt
      s += '<path d="M40 50 C 64 18, 178 18, 198 50" fill="none" stroke="#ef4444" stroke-width="4"/>';
      s += '<path d="M246 50 C 258 116, 206 150, 162 162" fill="none" stroke="var(--tx2)" stroke-width="4"/>';
      // dead battery
      s += '<rect x="20" y="62" width="88" height="50" rx="5" fill="var(--s3)" stroke="var(--tx2)" stroke-width="2"/>';
      s += '<text x="64" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tx2)">DEAD</text>';
      s += '<rect x="35" y="52" width="10" height="12" fill="#ef4444"/><text x="40" y="48" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444">+</text>';
      s += '<rect x="83" y="52" width="10" height="12" fill="var(--tx3)"/>';
      // forbidden marker on dead − terminal
      s += '<circle cx="88" cy="58" r="13" fill="none" stroke="#ef4444" stroke-width="2.5"/><line x1="79" y1="67" x2="97" y2="49" stroke="#ef4444" stroke-width="2.5"/>';
      s += '<text x="104" y="44" font-size="9" font-weight="700" fill="#ef4444">never here</text>';
      // good battery
      s += '<rect x="178" y="62" width="88" height="50" rx="5" fill="var(--s3)" stroke="var(--tx2)" stroke-width="2"/>';
      s += '<text x="222" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tx2)">GOOD</text>';
      s += '<rect x="193" y="52" width="10" height="12" fill="#ef4444"/><text x="198" y="48" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444">+</text>';
      s += '<rect x="241" y="52" width="10" height="12" fill="var(--tx3)"/><text x="246" y="48" text-anchor="middle" font-size="13" font-weight="800" fill="var(--tx3)">−</text>';
      // engine ground bolt — lower middle, clearly away from both batteries
      s += '<g transform="translate(150,172)"><polygon points="-11,-6 0,-12 11,-6 11,6 0,12 -11,6" fill="var(--s4)" stroke="var(--tx2)" stroke-width="2"/><circle r="4" fill="var(--tx3)"/></g>';
      s += '<text x="150" y="194" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--gr,#34d399)">bare engine metal · away from battery</text>';
      // clamps
      s += badge(40, 50, 1, '#ef4444') + badge(198, 50, 2, '#ef4444') + badge(246, 50, 3, '#9ca3af') + badge(150, 160, 4, '#9ca3af');
      s += '</svg>';
      return s;
    },
    // Engine-oil dipstick: MIN/MAX marks, level band, and an oil-colour legend.
    oilDipstick: function(cfg, ctx){
      return '<svg viewBox="0 0 210 188" class="lr-svg" role="img" aria-label="Engine oil dipstick: wipe it clean, reinsert fully, pull again, and read that the oil sits between the MIN and MAX marks; amber is good, dark brown is due soon, black is overdue">'
        + '<circle cx="96" cy="26" r="15" fill="none" stroke="var(--tx2)" stroke-width="6"/>'
        + '<rect x="90" y="38" width="12" height="122" rx="5" fill="var(--s3)" stroke="var(--tx2)" stroke-width="2"/>'
        + '<line x1="82" y1="120" x2="110" y2="120" stroke="var(--tx2)" stroke-width="2"/><text x="120" y="124" font-size="11" font-weight="700" fill="var(--tx2)">MAX</text>'
        + '<line x1="82" y1="150" x2="110" y2="150" stroke="var(--tx2)" stroke-width="2"/><text x="120" y="154" font-size="11" font-weight="700" fill="var(--tx2)">MIN</text>'
        + '<rect x="90" y="130" width="12" height="30" rx="3" fill="#d9a441"/>'
        + '<text x="120" y="174" font-size="9.5" fill="var(--tx3)">level: good</text>'
        + '<g font-size="9.5">'
        +   '<rect x="14" y="118" width="12" height="12" rx="2" fill="#d9a441" stroke="var(--br)"/><text x="31" y="128" fill="var(--tx2)">amber — good</text>'
        +   '<rect x="14" y="136" width="12" height="12" rx="2" fill="#6b4423" stroke="var(--br)"/><text x="31" y="146" fill="var(--tx2)">dark — due soon</text>'
        +   '<rect x="14" y="154" width="12" height="12" rx="2" fill="#1f1a17" stroke="var(--br)"/><text x="31" y="164" fill="var(--tx2)">black — overdue</text>'
        + '</g>'
        + '</svg>';
    },
    // Penny tread test: penny inserted head-down into a groove; if tread no
    // longer covers the top of Lincoln's head, the tire is at/under 2/32".
    treadPenny: function(cfg, ctx){
      return '<svg viewBox="0 0 214 152" class="lr-svg lr-svg--wide" role="img" aria-label="Penny tread test: insert a penny upside down into the tread groove; if you can see the top of Lincoln head above the tread, the tire is worn to two thirty-seconds of an inch and must be replaced">'
        + '<line x1="12" y1="136" x2="202" y2="136" stroke="var(--tx3)" stroke-width="3"/>'
        + '<g fill="var(--tx2)"><rect x="20" y="74" width="44" height="62" rx="3"/><rect x="86" y="74" width="44" height="62" rx="3"/><rect x="152" y="74" width="42" height="62" rx="3"/></g>'
        // penny in the left groove (x 64-86)
        + '<rect x="66" y="42" width="18" height="94" rx="3" fill="#c98a4a" stroke="#a5692f" stroke-width="1.5"/>'
        + '<circle cx="75" cy="112" r="10" fill="#a5692f"/>'
        + '<path d="M70 112 q5 -9 10 0" fill="none" stroke="#7c4a1e" stroke-width="1.5"/>'
        // tread-surface reference line
        + '<line x1="60" y1="74" x2="92" y2="74" stroke="var(--gr,#34d399)" stroke-width="2" stroke-dasharray="3 3"/>'
        + '<text x="98" y="60" font-size="9.5" font-weight="700" fill="var(--gr,#34d399)">tread covers</text>'
        + '<text x="98" y="71" font-size="9.5" font-weight="700" fill="var(--gr,#34d399)">his head = OK</text>'
        + '<text x="107" y="150" text-anchor="middle" font-size="9.5" fill="var(--tx3)">see the top of his head? ≤ 2/32" — replace</text>'
        + '</svg>';
    },
    // Knife "claw" grip — guiding hand with fingertips curled back, knuckles
    // guiding the blade so the edge never reaches the fingertips.
    knifeClaw: function(cfg, ctx){
      return '<svg viewBox="0 0 216 152" class="lr-svg lr-svg--wide" role="img" aria-label="The claw grip: curl your fingertips under and let your knuckles guide the side of the blade, on a board steadied by a damp towel">'
        + '<rect x="16" y="118" width="184" height="11" rx="3" fill="var(--s3)" stroke="var(--br)" stroke-width="1.5"/>'
        + '<rect x="22" y="129" width="172" height="5" rx="2" fill="var(--tx3)" opacity=".45"/>'
        + '<text x="108" y="147" text-anchor="middle" font-size="8.5" fill="var(--tx3)">damp towel keeps the board from sliding</text>'
        + '<rect x="92" y="100" width="92" height="18" rx="3" fill="var(--gr,#34d399)"/>'
        // arm + back of hand
        + '<path d="M44 52 L14 38" stroke="var(--s4)" stroke-width="14" stroke-linecap="round"/>'
        + '<ellipse cx="62" cy="58" rx="26" ry="15" fill="var(--s4)" stroke="var(--tx2)" stroke-width="2"/>'
        // three curled fingers (knuckle to the right ~x100, fingertip tucked left ~x82 on the board)
        + '<g fill="none" stroke="var(--s4)" stroke-width="11" stroke-linecap="round">'
        +   '<path d="M70 66 Q 98 78 96 96 Q 94 110 82 116"/>'
        +   '<path d="M80 66 Q 104 80 100 98 Q 98 110 88 116"/>'
        + '</g>'
        + '<circle cx="100" cy="96" r="5" fill="var(--tx2)"/>'   // knuckle facing the blade
        // knife: blade rides against the knuckles; fingertips are safely behind it
        + '<rect x="108" y="40" width="7" height="78" rx="2" fill="var(--tx2)"/>'
        + '<rect x="104" y="22" width="16" height="20" rx="3" fill="var(--tx3)"/>'
        + '<text x="150" y="62" font-size="9" font-weight="700" fill="var(--tx2)">knuckles guide →</text>'
        + '<text x="14" y="100" font-size="9" font-weight="700" fill="var(--gr,#34d399)">fingertips</text>'
        + '<text x="14" y="111" font-size="9" font-weight="700" fill="var(--gr,#34d399)">curled back</text>'
        + '</svg>';
    },
    // Vertical food thermometer: 40–140°F danger zone banded, USDA safe temps marked.
    foodTempChart: function(cfg, ctx){
      return '<svg viewBox="0 0 218 208" class="lr-svg lr-svg--wide" role="img" aria-label="USDA safe internal temperatures: poultry and reheated leftovers 165, ground meats 160, beef pork lamb and fish 145 with a 3 minute rest for beef pork lamb; the bacteria danger zone is 40 to 140 degrees, keep perishables there under 2 hours">'
        + '<rect x="46" y="24" width="20" height="158" rx="10" fill="var(--s2)" stroke="var(--tx2)" stroke-width="2"/>'
        + '<rect x="48" y="26" width="16" height="33" fill="#34d399" opacity=".5"/>'
        + '<rect x="48" y="59" width="16" height="86" fill="#f59e0b" opacity=".55"/>'
        + '<rect x="48" y="145" width="16" height="35" fill="#60a5fa" opacity=".5"/>'
        + '<circle cx="56" cy="190" r="17" fill="#ef4444"/>'
        // danger-zone boundaries
        + '<line x1="40" y1="59" x2="70" y2="59" stroke="var(--tx2)" stroke-width="1.5"/><text x="38" y="56" text-anchor="end" font-size="9" fill="var(--tx2)">140°F</text>'
        + '<line x1="40" y1="145" x2="70" y2="145" stroke="var(--tx2)" stroke-width="1.5"/><text x="38" y="142" text-anchor="end" font-size="9" fill="var(--tx2)">40°F</text>'
        + '<text x="38" y="98" text-anchor="end" font-size="9.5" font-weight="700" fill="#d9822b">DANGER</text>'
        + '<text x="38" y="109" text-anchor="end" font-size="9.5" font-weight="700" fill="#d9822b">ZONE</text>'
        + '<text x="38" y="121" text-anchor="end" font-size="8" fill="var(--tx3)">≤ 2 hrs</text>'
        // safe-temp ticks + leaders + labels
        + '<line x1="66" y1="40" x2="84" y2="36" stroke="var(--tx3)" stroke-width="1"/><text x="88" y="40" font-size="9" fill="var(--tx)"><tspan font-weight="700">165°F</tspan> poultry · leftovers</text>'
        + '<line x1="66" y1="45" x2="84" y2="56" stroke="var(--tx3)" stroke-width="1"/><text x="88" y="60" font-size="9" fill="var(--tx)"><tspan font-weight="700">160°F</tspan> ground meats</text>'
        + '<line x1="66" y1="57" x2="84" y2="78" stroke="var(--tx3)" stroke-width="1"/><text x="88" y="82" font-size="9" fill="var(--tx)"><tspan font-weight="700">145°F</tspan> beef·pork·lamb·fish</text>'
        + '<text x="88" y="93" font-size="7.5" fill="var(--tx3)">beef/pork/lamb: rest 3 min</text>'
        + '</svg>';
    },
    // Grease fire response: cut the heat, slide a metal lid over to smother — never water.
    greaseFire: function(cfg, ctx){
      return '<svg viewBox="0 0 222 158" class="lr-svg lr-svg--wide" role="img" aria-label="Grease fire: turn off the heat and slide a metal lid or baking sheet over the pan to smother it. Never use water.">'
        + '<rect x="24" y="132" width="150" height="10" rx="3" fill="var(--s4)"/>'
        + '<rect x="56" y="108" width="92" height="22" rx="4" fill="var(--s3)" stroke="var(--tx2)" stroke-width="2"/>'
        + '<rect x="146" y="114" width="46" height="8" rx="4" fill="var(--tx3)"/>'
        // flames
        + '<path d="M78 108 Q 70 86 82 74 Q 80 92 92 84 Q 90 100 78 108 Z" fill="#fb923c"/>'
        + '<path d="M104 108 Q 94 80 110 64 Q 106 88 122 78 Q 120 100 104 108 Z" fill="#ef4444"/>'
        + '<path d="M128 108 Q 122 88 132 78 Q 130 94 142 88 Q 140 102 128 108 Z" fill="#fb923c"/>'
        // lid sliding over (with motion arrow)
        + '<path d="M44 70 A 52 30 0 0 1 148 70" fill="none" stroke="var(--tx2)" stroke-width="4"/>'
        + '<rect x="90" y="52" width="12" height="9" rx="3" fill="var(--tx2)"/>'
        + '<line x1="150" y1="64" x2="120" y2="64" stroke="var(--gr,#34d399)" stroke-width="3"/>'
        + _arrowhead(120, 64, Math.PI, 'var(--gr,#34d399)')
        + '<text x="96" y="44" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--gr,#34d399)">slide a metal lid over — smother it</text>'
        // never water badge
        + '<g transform="translate(196,40)"><path d="M0 -16 C 9 -4, 11 2, 11 6 A 11 11 0 1 1 -11 6 C -11 2, -9 -4, 0 -16 Z" fill="#60a5fa"/><circle r="17" fill="none" stroke="#ef4444" stroke-width="3"/><line x1="-12" y1="12" x2="12" y2="-12" stroke="#ef4444" stroke-width="3"/></g>'
        + '<text x="196" y="74" text-anchor="middle" font-size="9" font-weight="700" fill="#ef4444">never water</text>'
        + '</svg>';
    }
  };

  // ── Interactive widgets (mounted post-render) ────────────────
  function computeTax(income, status){
    var t = TAX_2025[status] || TAX_2025.single;
    var taxable = Math.max(0, income - t.std);
    var tax = 0, marginal = 0, rows = [];
    for(var i = 0; i < t.brackets.length; i++){
      var lo = t.brackets[i][0], hi = t.brackets[i][1], rate = t.brackets[i][2];
      if(taxable > lo){
        var amt = Math.min(taxable, hi) - lo;
        var owed = amt * rate;
        tax += owed; marginal = rate;
        rows.push({ rate:rate, amt:amt, owed:owed });
      }
    }
    return { std:t.std, taxable:taxable, tax:tax, marginal:marginal, eff:(income > 0 ? tax / income : 0), rows:rows };
  }

  var WIDGETS = {
    taxCalculator: function(mountEl, config){
      var income = (config && config.income) || 60000;
      var status = (config && config.status) || 'single';
      mountEl.innerHTML =
        '<div class="lr-calc">'
        + '<div class="lr-calc__head">Tax calculator</div>'
        + '<div class="lr-calc__controls">'
        +   '<label class="lr-calc__field"><span>Annual income</span>'
        +     '<input type="number" class="lr-calc__income" min="0" step="1000" value="' + income + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>Filing status</span>'
        +     '<select class="lr-calc__status">'
        +       '<option value="single">Single</option><option value="married">Married (jointly)</option>'
        +     '</select></label>'
        + '</div>'
        + '<div class="lr-calc__out" aria-live="polite"></div>'
        + '</div>';
      var $income = mountEl.querySelector('.lr-calc__income');
      var $status = mountEl.querySelector('.lr-calc__status');
      var $out = mountEl.querySelector('.lr-calc__out');
      $status.value = status;
      function render(){
        var inc = Math.max(0, parseFloat($income.value) || 0);
        var r = computeTax(inc, $status.value);
        var breakdown = r.rows.map(function(row){
          return '<div class="lr-calc__brk"><span class="lr-calc__brkrate">' + pct(row.rate) + '</span>'
            + '<span class="lr-calc__brkamt">on ' + money(row.amt) + '</span>'
            + '<span class="lr-calc__brkowed">' + money(row.owed) + '</span></div>';
        }).join('') || '<div class="lr-calc__brk lr-calc__brk--none">No federal income tax owed at this income.</div>';
        $out.innerHTML =
          '<div class="lr-calc__stats">'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(r.tax) + '</div><div class="lr-calc__sl">Federal tax</div></div>'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + pct(r.eff) + '</div><div class="lr-calc__sl">Effective rate</div></div>'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + pct(r.marginal) + '</div><div class="lr-calc__sl">Marginal rate</div></div>'
          + '</div>'
          + '<div class="lr-calc__note">After the ' + money(r.std) + ' standard deduction, ' + money(r.taxable) + ' is taxable:</div>'
          + '<div class="lr-calc__brks">' + breakdown + '</div>';
      }
      $income.addEventListener('input', render);
      $status.addEventListener('change', render);
      render();
    },

    // Compound-growth projector — future value of a monthly contribution
    // (ordinary annuity, monthly compounding) with a contributed-vs-growth bar.
    compoundGrowth: function(mountEl, config){
      var c = config || {};
      var d = { monthly:c.monthly || 150, start:c.startAge || 16, retire:c.retireAge || 65, rate:(c.rate != null ? c.rate : 8) };
      mountEl.innerHTML =
        '<div class="lr-calc">'
        + '<div class="lr-calc__head">Compound-growth projector</div>'
        + '<div class="lr-calc__controls">'
        +   '<label class="lr-calc__field"><span>$ / month</span><input type="number" class="cg-m" min="0" step="10" value="' + d.monthly + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>Start age</span><input type="number" class="cg-s" min="0" max="90" step="1" value="' + d.start + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>Retire age</span><input type="number" class="cg-r" min="1" max="100" step="1" value="' + d.retire + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>Return %/yr</span><input type="number" class="cg-y" min="0" max="20" step="0.5" value="' + d.rate + '" inputmode="decimal"></label>'
        + '</div><div class="lr-calc__out" aria-live="polite"></div></div>';
      var $m = mountEl.querySelector('.cg-m'), $s = mountEl.querySelector('.cg-s'),
          $r = mountEl.querySelector('.cg-r'), $y = mountEl.querySelector('.cg-y'),
          $out = mountEl.querySelector('.lr-calc__out');
      function render(){
        var pmt = Math.max(0, parseFloat($m.value) || 0);
        var years = Math.max(0, (parseFloat($r.value) || 0) - (parseFloat($s.value) || 0));
        var n = years * 12;
        var rate = Math.max(0, parseFloat($y.value) || 0) / 100 / 12;
        var fv = (rate > 0) ? pmt * ((Math.pow(1 + rate, n) - 1) / rate) : pmt * n;
        var put = pmt * n;
        var growth = Math.max(0, fv - put);
        var gp = fv > 0 ? (growth / fv) * 100 : 0, pp = 100 - gp;
        $out.innerHTML =
          '<div class="lr-calc__stats">'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(fv) + '</div><div class="lr-calc__sl">at age ' + (parseInt($r.value, 10) || 0) + '</div></div>'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(put) + '</div><div class="lr-calc__sl">you put in</div></div>'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(growth) + '</div><div class="lr-calc__sl">growth</div></div>'
          + '</div>'
          + '<div class="lr-brk__bar" style="margin-top:.5rem;">'
          +   '<div class="lr-brk__seg" style="width:' + pp.toFixed(1) + '%;background:#64748b;"></div>'
          +   '<div class="lr-brk__seg" style="width:' + gp.toFixed(1) + '%;background:var(--lr-accent,#10b981);"></div>'
          + '</div>'
          + '<div class="lr-brk__legend"><div class="lr-brk__leg"><span class="lr-brk__dot" style="background:#64748b;"></span><b>Contributions</b></div>'
          +   '<div class="lr-brk__leg"><span class="lr-brk__dot" style="background:var(--lr-accent,#10b981);"></span><b>Compound growth</b></div></div>'
          + '<div class="lr-calc__note">' + Math.round(years) + ' years of investing · estimate, monthly compounding.</div>';
      }
      [$m, $s, $r, $y].forEach(function(el){ el.addEventListener('input', render); });
      render();
    },

    // 4%-rule retirement target — annual spending → the nest egg you need.
    retirementTarget: function(mountEl, config){
      var spend = (config && config.spending) || 50000;
      mountEl.innerHTML =
        '<div class="lr-calc">'
        + '<div class="lr-calc__head">Your retirement number (4% rule)</div>'
        + '<div class="lr-calc__controls">'
        +   '<label class="lr-calc__field"><span>Yearly spending in retirement</span><input type="number" class="rt-s" min="0" step="1000" value="' + spend + '" inputmode="numeric"></label>'
        + '</div><div class="lr-calc__out" aria-live="polite"></div></div>';
      var $s = mountEl.querySelector('.rt-s'), $out = mountEl.querySelector('.lr-calc__out');
      function render(){
        var s = Math.max(0, parseFloat($s.value) || 0);
        var target = s * 25;
        $out.innerHTML =
          '<div class="lr-calc__stats">'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(target) + '</div><div class="lr-calc__sl">target nest egg</div></div>'
          +   '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(s) + '</div><div class="lr-calc__sl">supported / year</div></div>'
          + '</div>'
          + '<div class="lr-calc__note">Target = yearly spending × 25. Withdraw 4% a year and it historically lasts 30+ years.</div>';
      }
      $s.addEventListener('input', render);
      render();
    },

    // 50/30/20 split — take-home income in, live dollar amounts out. The
    // three percentages are editable and always RE-NORMALIZED to total 100%.
    budgetSplitter: function(mountEl, config){
      var c = config || {};
      var inc = c.income || 3500;
      var dN = (c.needs != null ? c.needs : 50), dW = (c.wants != null ? c.wants : 30), dG = (c.goals != null ? c.goals : 20);
      var COL = { needs:'#60a5fa', wants:'#fbbf24', goals:'#34d399' };
      function row(key, label, sub, val, col){
        return '<div class="lr-split__row"><span class="lr-split__dot" style="background:' + col + ';"></span>'
          + '<span class="lr-split__label">' + label + '<span class="lr-split__sub">' + sub + '</span></span>'
          + '<input type="number" class="lr-split__pctin bs-' + key + '" min="0" max="100" step="1" value="' + val + '" inputmode="numeric"><span class="lr-split__pctsym">%</span>'
          + '<span class="lr-split__amt bs-amt-' + key + '"></span></div>';
      }
      mountEl.innerHTML =
        '<div class="lr-calc">'
        + '<div class="lr-calc__head">50 / 30 / 20 budget</div>'
        + '<div class="lr-calc__controls"><label class="lr-calc__field"><span>Monthly take-home pay</span><input type="number" class="bs-income" min="0" step="100" value="' + inc + '" inputmode="numeric"></label></div>'
        + '<div class="lr-split">'
        +   row('needs', 'Needs', 'housing, food, utilities, minimum debt', dN, COL.needs)
        +   row('wants', 'Wants', 'dining out, fun, subscriptions', dW, COL.wants)
        +   row('goals', 'Goals', 'savings, investing, extra debt payoff', dG, COL.goals)
        + '</div>'
        + '<div class="lr-brk__bar" style="margin-top:.55rem;"><div class="lr-brk__seg bs-bar-needs" style="background:' + COL.needs + ';"></div><div class="lr-brk__seg bs-bar-wants" style="background:' + COL.wants + ';"></div><div class="lr-brk__seg bs-bar-goals" style="background:' + COL.goals + ';"></div></div>'
        + '<div class="lr-calc__note">Percentages re-normalize to total 100%. 50/30/20 is a widely-used guideline, not a rule — adjust it to your situation.</div>'
        + '</div>';
      var $i = mountEl.querySelector('.bs-income');
      var $n = mountEl.querySelector('.bs-needs'), $w = mountEl.querySelector('.bs-wants'), $g = mountEl.querySelector('.bs-goals');
      function upd(){
        var income = Math.max(0, parseFloat($i.value) || 0);
        var n = Math.max(0, parseFloat($n.value) || 0), w = Math.max(0, parseFloat($w.value) || 0), g = Math.max(0, parseFloat($g.value) || 0);
        var sum = n + w + g; if(sum <= 0){ n = 50; w = 30; g = 20; sum = 100; }
        var parts = { needs:n / sum, wants:w / sum, goals:g / sum };
        Object.keys(parts).forEach(function(k){
          var amt = mountEl.querySelector('.bs-amt-' + k);
          var bar = mountEl.querySelector('.bs-bar-' + k);
          if(amt) amt.textContent = money(income * parts[k]) + ' · ' + Math.round(parts[k] * 100) + '%';
          if(bar) bar.style.width = (parts[k] * 100).toFixed(1) + '%';
        });
      }
      [$i, $n, $w, $g].forEach(function(el){ el.addEventListener('input', upd); });
      upd();
    },

    // Savings-goal timeline — months to reach a target at $X/month (honest
    // month-by-month accrual, optional APY) + a Stage-2 target from expenses.
    savingsGoal: function(mountEl, config){
      var c = config || {};
      var target = c.target || 1000, monthly = c.monthly || 333, apy = (c.apy != null ? c.apy : 4), exp = c.expenses || 2500;
      mountEl.innerHTML =
        '<div class="lr-calc">'
        + '<div class="lr-calc__head">Savings-goal timeline</div>'
        + '<div class="lr-calc__controls">'
        +   '<label class="lr-calc__field"><span>Goal amount</span><input type="number" class="sg-t" min="0" step="100" value="' + target + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>Saving / month</span><input type="number" class="sg-m" min="0" step="10" value="' + monthly + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>APY % (optional)</span><input type="number" class="sg-a" min="0" max="10" step="0.1" value="' + apy + '" inputmode="decimal"></label>'
        + '</div><div class="lr-calc__out sg-out" aria-live="polite"></div>'
        + '<div class="lr-calc__head" style="margin-top:.7rem;">Stage-2 target from expenses</div>'
        + '<div class="lr-calc__controls"><label class="lr-calc__field"><span>Monthly expenses</span><input type="number" class="sg-e" min="0" step="100" value="' + exp + '" inputmode="numeric"></label></div>'
        + '<div class="lr-calc__out sg-out2" aria-live="polite"></div>'
        + '</div>';
      var $t = mountEl.querySelector('.sg-t'), $m = mountEl.querySelector('.sg-m'), $a = mountEl.querySelector('.sg-a'), $e = mountEl.querySelector('.sg-e');
      var $o1 = mountEl.querySelector('.sg-out'), $o2 = mountEl.querySelector('.sg-out2');
      function monthsTo(tg, mo, a){
        var r = a / 100 / 12, bal = 0, m = 0;
        if(mo <= 0 && r <= 0) return { m:-1, bal:0 };
        while(bal < tg && m < 1200){ bal = bal * (1 + r) + mo; m++; }
        return bal >= tg ? { m:m, bal:bal } : { m:-1, bal:bal };
      }
      function fmt(m){ if(m < 0) return '—'; if(m <= 1) return '1 mo'; var y = Math.floor(m / 12), mm = m % 12; return y ? (y + ' yr' + (mm ? ' ' + mm + ' mo' : '')) : (m + ' mo'); }
      function upd(){
        var tg = Math.max(0, parseFloat($t.value) || 0), mo = Math.max(0, parseFloat($m.value) || 0), a = Math.max(0, parseFloat($a.value) || 0);
        var res = monthsTo(tg, mo, a), m = res.m, put = mo * (m < 0 ? 0 : m), interest = Math.max(0, res.bal - put);
        $o1.innerHTML = '<div class="lr-calc__stats">'
          + '<div class="lr-calc__stat"><div class="lr-calc__sv">' + fmt(m) + '</div><div class="lr-calc__sl">to reach ' + money(tg) + '</div></div>'
          + '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(put) + '</div><div class="lr-calc__sl">you save</div></div>'
          + '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(interest) + '</div><div class="lr-calc__sl">interest</div></div>'
          + '</div>' + (m < 0 ? '<div class="lr-calc__note">Enter a monthly amount (or APY) so the goal is reachable.</div>' : '');
      }
      function upd2(){
        var e = Math.max(0, parseFloat($e.value) || 0);
        $o2.innerHTML = '<div class="lr-calc__stats">'
          + '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(e * 3) + '</div><div class="lr-calc__sl">3 months</div></div>'
          + '<div class="lr-calc__stat"><div class="lr-calc__sv">' + money(e * 6) + '</div><div class="lr-calc__sl">6 months</div></div>'
          + '</div><div class="lr-calc__note">A common guideline is 3–6 months of expenses (dual income often 3–4, single income closer to 6).</div>';
      }
      [$t, $m, $a].forEach(function(el){ el.addEventListener('input', upd); });
      $e.addEventListener('input', upd2);
      upd(); upd2();
    },

    // Credit-card payoff / minimum-payment trap. Honest amortization:
    // interest = APR/12 on the running balance; the MINIMUM recomputes each
    // month as max($25 floor, 1% of balance + that month's interest) — the
    // common real-card formula that drops principal ~1%/month; a guard
    // returns "never" when a payment can't cover the month's interest. (Kin
    // to savingsGoal's month loop, but it runs in reverse with a recomputing
    // payment, so it's its own engine.)
    cardPayoff: function(mountEl, config){
      var c = config || {};
      var balance = c.balance || 3000, apr = (c.apr != null ? c.apr : 22), payment = c.payment || 150;
      var PRINPCT = 0.01, FLOOR = 25;
      mountEl.innerHTML =
        '<div class="lr-calc">'
        + '<div class="lr-calc__head">Credit-card payoff</div>'
        + '<div class="lr-calc__controls">'
        +   '<label class="lr-calc__field"><span>Balance</span><input type="number" class="cp-b" min="0" step="100" value="' + balance + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>APR %</span><input type="number" class="cp-r" min="0" max="40" step="0.1" value="' + apr + '" inputmode="decimal"></label>'
        +   '<label class="lr-calc__field"><span>Your payment / mo</span><input type="number" class="cp-p" min="0" step="10" value="' + payment + '" inputmode="numeric"></label>'
        + '</div><div class="lr-calc__out cp-out" aria-live="polite"></div>'
        + '<div class="lr-calc__note">Minimum assumed at 1% of the balance plus that month\'s interest, or $25 — whichever is greater (a common card formula). General financial education, not personalized advice.</div>'
        + '</div>';
      var $b = mountEl.querySelector('.cp-b'), $r = mountEl.querySelector('.cp-r'), $p = mountEl.querySelector('.cp-p'), $o = mountEl.querySelector('.cp-out');
      function sim(bal0, r12, mode, fixed){
        var bal = bal0, months = 0, interest = 0;
        while(bal > 0.005 && months < 1200){
          var i = bal * r12;
          var pay = (mode === 'min') ? Math.max(FLOOR, PRINPCT * bal + i) : fixed;
          bal += i; interest += i;
          if(pay > bal) pay = bal;
          if(pay <= i) return { months:-1, interest:0, paid:0 };   // never amortizes
          bal -= pay; months++;
        }
        return bal <= 0.005 ? { months:months, interest:interest, paid:bal0 + interest } : { months:-1, interest:0, paid:0 };
      }
      function fmt(m){ if(m < 0) return 'never'; var y = Math.floor(m / 12), mm = m % 12; return y ? (y + ' yr' + (mm ? ' ' + mm + ' mo' : '')) : (m + ' mo'); }
      function stat(v, l, col){ return '<div class="lr-calc__stat"><div class="lr-calc__sv" style="color:' + col + ';">' + v + '</div><div class="lr-calc__sl">' + l + '</div></div>'; }
      function block(label, res, col){
        var t = res.months < 0 ? 'never' : fmt(res.months);
        var intr = res.months < 0 ? '—' : money(res.interest);
        var paid = res.months < 0 ? '—' : money(res.paid);
        return '<div class="lr-calc__sub">' + label + '</div><div class="lr-calc__stats">'
          + stat(t, 'to pay off', col) + stat(intr, 'interest', col) + stat(paid, 'total paid', col) + '</div>';
      }
      function render(){
        var bal = Math.max(0, parseFloat($b.value) || 0), apr2 = Math.max(0, parseFloat($r.value) || 0), pay = Math.max(0, parseFloat($p.value) || 0);
        var r12 = apr2 / 100 / 12;
        var mn = sim(bal, r12, 'min'), fx = sim(bal, r12, 'fixed', pay);
        var note = '';
        if(mn.months > 0 && fx.months > 0){
          var savedI = Math.max(0, mn.interest - fx.interest), savedM = mn.months - fx.months;
          note = '<div class="lr-calc__note">Paying ' + money(pay) + '/mo instead of the minimum saves ' + money(savedI) + ' in interest and ' + fmt(savedM) + '.</div>';
        } else if(fx.months < 0 && pay > 0){
          note = '<div class="lr-calc__note">That payment doesn\'t cover the monthly interest — the balance never goes down. Pay more than the interest each month.</div>';
        }
        $o.innerHTML = block('Paying only the minimum', mn, '#ef4444') + block('Paying ' + money(pay) + ' / month', fx, '#34d399') + note;
      }
      [$b, $r, $p].forEach(function(el){ el.addEventListener('input', render); });
      render();
    },

    // Credit utilization meter — balance ÷ limit, color-zoned, with the
    // under-30% guideline marked.
    utilizationMeter: function(mountEl, config){
      var c = config || {};
      var balance = c.balance || 1500, limit = c.limit || 5000;
      mountEl.innerHTML =
        '<div class="lr-calc">'
        + '<div class="lr-calc__head">Credit utilization</div>'
        + '<div class="lr-calc__controls">'
        +   '<label class="lr-calc__field"><span>Card balance(s)</span><input type="number" class="um-b" min="0" step="50" value="' + balance + '" inputmode="numeric"></label>'
        +   '<label class="lr-calc__field"><span>Total credit limit</span><input type="number" class="um-l" min="0" step="100" value="' + limit + '" inputmode="numeric"></label>'
        + '</div>'
        + '<div class="lr-util"><div class="lr-util__bar"><div class="lr-util__fill um-fill"></div><div class="lr-util__mark" style="left:30%;"></div><div class="lr-util__marklabel" style="left:30%;">30%</div></div></div>'
        + '<div class="lr-calc__out um-out" aria-live="polite"></div>'
        + '<div class="lr-calc__note">Under 30% is a widely-used guideline; under 10% is excellent. A guideline, not a rule.</div>'
        + '</div>';
      var $b = mountEl.querySelector('.um-b'), $l = mountEl.querySelector('.um-l'), $fill = mountEl.querySelector('.um-fill'), $o = mountEl.querySelector('.um-out');
      function render(){
        var b = Math.max(0, parseFloat($b.value) || 0), l = Math.max(0, parseFloat($l.value) || 0);
        var u = l > 0 ? (b / l) * 100 : 0;
        var col = u < 10 ? '#34d399' : u < 30 ? '#60a5fa' : u <= 50 ? '#f59e0b' : '#ef4444';
        var label = u < 10 ? 'Excellent' : u < 30 ? 'Good' : u <= 50 ? 'High' : 'Very high';
        $fill.style.width = Math.min(100, u).toFixed(1) + '%';
        $fill.style.background = col;
        $o.innerHTML = '<div class="lr-calc__stats"><div class="lr-calc__stat"><div class="lr-calc__sv" style="color:' + col + ';">' + u.toFixed(0) + '%</div><div class="lr-calc__sl">utilization · ' + label + '</div></div></div>';
      }
      [$b, $l].forEach(function(el){ el.addEventListener('input', render); });
      render();
    }
  };

  // ── Block renderers (return HTML strings) ────────────────────
  function listItem(it){
    if(it && typeof it === 'object'){
      return '<li>' + (it.strong ? '<strong>' + esc(it.strong) + '</strong> ' : '') + esc(it.text || '') + '</li>';
    }
    return '<li>' + esc(it) + '</li>';
  }

  var BLOCKS = {
    lead: function(b){ return '<p class="lr-lead">' + esc(b.text) + '</p>'; },
    keyIdea: function(b){
      return '<aside class="lr-key">'
        + (b.title ? '<div class="lr-key__t">' + esc(b.title) + '</div>' : '')
        + '<div class="lr-key__x">' + esc(b.text) + '</div></aside>';
    },
    stat: function(b){
      var items = (b.items || []).map(function(s){
        return '<div class="lr-stat"><div class="lr-stat__v">' + esc(s.value) + '</div><div class="lr-stat__l">' + esc(s.label) + '</div></div>';
      }).join('');
      return '<div class="lr-stats">' + items + '</div>';
    },
    list: function(b){
      var cls = (b.style === 'check') ? ' lr-list--check' : '';
      return '<ul class="lr-list' + cls + '">' + (b.items || []).map(listItem).join('') + '</ul>';
    },
    compare: function(b){
      function col(c){
        return '<div class="lr-cmp__col"><div class="lr-cmp__t">' + esc(c.title) + '</div><ul>'
          + (c.points || []).map(function(p){ return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>';
      }
      return '<div class="lr-cmp">' + col(b.left) + col(b.right) + '</div>';
    },
    steps: function(b){
      var items = (b.items || []).map(function(s, i){
        return '<li class="lr-step"><span class="lr-step__n">' + (i + 1) + '</span><div class="lr-step__b">'
          + (s.title ? '<div class="lr-step__t">' + esc(s.title) + '</div>' : '')
          + '<div class="lr-step__x">' + esc(s.text) + '</div></div></li>';
      }).join('');
      return '<ol class="lr-steps">' + items + '</ol>';
    },
    takeaways: function(b){
      return '<div class="lr-take"><div class="lr-take__h">Key takeaways</div><ul>'
        + (b.items || []).map(function(t){ return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
    },
    tip: function(b){
      return '<aside class="lr-tip"><span class="lr-tip__i" aria-hidden="true">💡</span><div class="lr-tip__x"><b>Pro tip.</b> ' + esc(b.text) + '</div></aside>';
    },
    check: function(b){
      var opts = (b.opts || []).map(function(o, i){
        return '<button type="button" class="lr-check__opt" data-i="' + i + '">' + esc(o) + '</button>';
      }).join('');
      return '<div class="lr-check" data-ans="' + (b.ans|0) + '"' + (b.explain ? ' data-explain="' + esc(b.explain) + '"' : '') + '>'
        + '<div class="lr-check__q">' + esc(b.q) + '</div>'
        + '<div class="lr-check__opts">' + opts + '</div>'
        + '<div class="lr-check__fb" role="status" aria-live="polite"></div></div>';
    },
    viz: function(b){
      var fn = VIZ[b.kind];
      return '<div class="lr-viz">' + (fn ? fn(b.data || {}) : '') + '</div>';
    },
    widget: function(b){
      // Placeholder; populated in _mountWidgets after innerHTML is set.
      return '<div class="lr-widget" data-lr-widget="' + esc(b.kind) + '" data-lr-config="' + esc(JSON.stringify(b.config || {})) + '"></div>';
    },
    diagram: function(b, ctx){
      var fn = DIAGRAMS[b.kind];
      return '<div class="lr-diagram">' + (fn ? fn(b.config || {}, ctx || {}) : '') + '</div>';
    },
    illustratedSteps: function(b, ctx){
      var items = (b.steps || []).map(function(s){
        var fn = s.diagram && DIAGRAMS[s.diagram.kind];
        var dia = fn ? '<div class="lr-istep__dia">' + fn(s.diagram.config || {}, ctx || {}) + '</div>' : '';
        return '<li class="lr-istep' + (dia ? '' : ' lr-istep--nodia') + '">'
          + dia
          + '<div class="lr-istep__body"><span class="lr-istep__n">' + esc(s.num) + '</span><span class="lr-istep__x">' + esc(s.text) + '</span></div>'
          + '</li>';
      }).join('');
      return '<ol class="lr-isteps">' + items + '</ol>';
    },
    // Danger-accented callout — distinct from `tip`, for safety-critical warnings.
    safety: function(b){
      return '<aside class="lr-safety" role="note"><span class="lr-safety__i" aria-hidden="true">⚠️</span>'
        + '<div class="lr-safety__x">'
        + (b.title ? '<div class="lr-safety__t">' + esc(b.title) + '</div>' : '')
        + '<div>' + esc(b.text) + '</div></div></aside>';
    },
    prose: function(b){ return '<div class="lr-prose">' + (b.html || '') + '</div>'; }  // trusted, verbatim
  };

  function renderBlock(b, ctx){
    if(!b || !b.type) return '';
    var fn = BLOCKS[b.type];
    return fn ? fn(b, ctx) : '';
  }
  function renderLessonBody(lesson, ctx){
    return (lesson.blocks || []).map(function(b){ return renderBlock(b, ctx); }).join('');
  }

  // ── Mount ────────────────────────────────────────────────────
  function _mountWidgets(host){
    Array.prototype.forEach.call(host.querySelectorAll('[data-lr-widget]'), function(el){
      if(el.__lrMounted) return;
      var kind = el.getAttribute('data-lr-widget');
      var fn = WIDGETS[kind];
      if(!fn){ return; }
      var cfg = {};
      try { cfg = JSON.parse(el.getAttribute('data-lr-config') || '{}'); } catch(_e){}
      el.__lrMounted = true;
      try { fn(el, cfg); } catch(_e){}
    });
  }
  // Delegated handler for the comprehension `check` blocks. Reveals
  // correct/incorrect + explanation; rides sfx/haptics like the quiz.
  function _onClick(e){
    var opt = e.target.closest && e.target.closest('.lr-check__opt');
    if(!opt) return;
    var wrap = opt.closest('.lr-check');
    if(!wrap || wrap.__answered) return;
    var ans = parseInt(wrap.getAttribute('data-ans'), 10) || 0;
    var chosen = parseInt(opt.getAttribute('data-i'), 10);
    var correct = chosen === ans;
    wrap.__answered = true;
    Array.prototype.forEach.call(wrap.querySelectorAll('.lr-check__opt'), function(b, i){
      b.setAttribute('disabled', '');
      if(i === ans) b.classList.add('lr-check__opt--right');
      else if(i === chosen) b.classList.add('lr-check__opt--wrong');
    });
    var fb = wrap.querySelector('.lr-check__fb');
    if(fb){
      var ex = wrap.getAttribute('data-explain') || '';
      fb.className = 'lr-check__fb ' + (correct ? 'lr-check__fb--ok' : 'lr-check__fb--no');
      fb.textContent = (correct ? 'Correct. ' : 'Not quite. ') + ex;
    }
    try {
      if(correct){ if(window.sfx) window.sfx.correct(); if(window.haptics) window.haptics.correct(); }
      else { if(window.sfx) window.sfx.tryAgain(); if(window.haptics) window.haptics.wrong(); }
    } catch(_e){}
  }

  function mount(host, moduleSpec){
    if(!host || !moduleSpec) return;
    var color = moduleSpec.color || 'var(--c)';
    var lessons = moduleSpec.lessons || [];
    var ctx = { animate: !_reduced() };   // diagram animation gate
    host.innerHTML = '<div class="lr-mod" style="--lr-accent:' + color + ';">'
      + lessons.map(function(lesson, i){
          var openCls = i === 0 ? ' lr-l--open' : '';
          return '<section class="lr-l' + openCls + '">'
            + '<button type="button" class="lr-l__head" aria-expanded="' + (i === 0 ? 'true' : 'false') + '">'
            +   '<span class="lr-l__n">L' + (i + 1) + '</span>'
            +   '<span class="lr-l__t">' + esc(lesson.title) + '</span>'
            +   (lesson.duration ? '<span class="lr-l__d">' + esc(lesson.duration) + '</span>' : '')
            +   '<span class="lr-l__chev" aria-hidden="true">▾</span>'
            + '</button>'
            + '<div class="lr-l__body">' + renderLessonBody(lesson, ctx) + '</div>'
            + '</section>';
        }).join('')
      + '</div>';
    // Accordion toggle (delegated, scoped to this host)
    if(!host.__lrWired){
      host.__lrWired = true;
      host.addEventListener('click', function(e){
        var head = e.target.closest && e.target.closest('.lr-l__head');
        if(head){
          var sec = head.parentNode;
          var open = sec.classList.toggle('lr-l--open');
          head.setAttribute('aria-expanded', open ? 'true' : 'false');
          return;
        }
        _onClick(e);
      });
    }
    _mountWidgets(host);
  }

  // ── Baseline auto-conversion ─────────────────────────────────
  // Turn a legacy SK_DATA module (array of { h, b, tip, q? }) into a module
  // spec WITHOUT hand-authoring, so every category gets the new shell at
  // once. Conservative + lossless: the first <p> becomes a `lead`, the rest
  // of the body is kept VERBATIM as a trusted `prose` block (so every <ul>,
  // <strong>, and sub-paragraph survives exactly), the long-dark `tip` field
  // finally renders as a callout, and any inline `q` checks are surfaced.
  // Hand-authored SK_SPECS modules (e.g. taxes) bypass this entirely.
  function fromLegacy(lessons, meta){
    meta = meta || {};
    return {
      key: meta.key,
      color: meta.color,
      lessons: (lessons || []).map(function(l){
        var blocks = [];
        var body = String(l.b || '');
        var rest = body;
        var m = body.match(/^\s*<p>([\s\S]*?)<\/p>/i);
        if(m){
          var leadTxt = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          // Only promote to a lead if it's a real sentence, not a tiny label.
          if(leadTxt.length >= 40){ blocks.push({ type:'lead', text:leadTxt }); rest = body.slice(m[0].length); }
        }
        if(rest && rest.replace(/\s+/g, '')) blocks.push({ type:'prose', html:rest });
        if(l.tip) blocks.push({ type:'tip', text:l.tip });
        if(Array.isArray(l.q)){
          l.q.forEach(function(qq){
            if(!qq || !qq.q) return;
            // Two legacy inline-check shapes coexist in SK_DATA:
            //   { opts, ans, explain }  and  { a, c, e }. Normalize both.
            var opts = Array.isArray(qq.opts) ? qq.opts : (Array.isArray(qq.a) ? qq.a : null);
            if(!opts) return;
            var ans = (qq.ans != null) ? qq.ans : (qq.c != null ? qq.c : 0);
            var explain = qq.explain || qq.e || '';
            blocks.push({ type:'check', q:qq.q, opts:opts, ans:ans|0, explain:explain });
          });
        }
        return { title: l.h, blocks: blocks };
      })
    };
  }

  // ── Per-LESSON elevation ─────────────────────────────────────
  // Compose the module to render: start from the auto-converted baseline,
  // then overlay any hand-authored lessons one at a time. A hand-authored
  // lesson targets its baseline slot by `matchTitle` (stable) or
  // `matchIndex`; with neither, lessons map positionally (a fully authored
  // module like taxes/investing simply replaces every slot in order). This
  // is what lets ONE lesson in a category be elevated while its siblings
  // stay on fromLegacy().
  function composeModule(legacyLessons, authored, meta){
    meta = meta || {};
    var baseline = fromLegacy(legacyLessons || [], meta).lessons;
    var color = (authored && authored.color) || meta.color;
    if(!authored || !Array.isArray(authored.lessons) || !authored.lessons.length){
      return { key: meta.key, color: color, lessons: baseline };
    }
    var merged = baseline.slice();
    var pos = 0;
    authored.lessons.forEach(function(L){
      var idx = -1;
      if(typeof L.matchIndex === 'number') idx = L.matchIndex;
      else if(L.matchTitle){
        for(var i = 0; i < legacyLessons.length; i++){
          if(legacyLessons[i] && legacyLessons[i].h === L.matchTitle){ idx = i; break; }
        }
      } else { idx = pos++; }
      if(idx >= 0 && idx < merged.length) merged[idx] = L;
      else merged.push(L);
    });
    return { key: meta.key, color: color, lessons: merged };
  }

  if(typeof window !== 'undefined'){
    window.lessonRenderer = { mount: mount, fromLegacy: fromLegacy, composeModule: composeModule, blocks: BLOCKS, viz: VIZ, diagrams: DIAGRAMS, widgets: WIDGETS, computeTax: computeTax };
  }
})();
