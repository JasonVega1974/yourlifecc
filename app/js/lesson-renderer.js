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
