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
    prose: function(b){ return '<div class="lr-prose">' + (b.html || '') + '</div>'; }  // trusted, verbatim
  };

  function renderBlock(b){
    if(!b || !b.type) return '';
    var fn = BLOCKS[b.type];
    return fn ? fn(b) : '';
  }
  function renderLessonBody(lesson){
    return (lesson.blocks || []).map(renderBlock).join('');
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
            + '<div class="lr-l__body">' + renderLessonBody(lesson) + '</div>'
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
            if(qq && qq.q && Array.isArray(qq.opts)){
              blocks.push({ type:'check', q:qq.q, opts:qq.opts, ans:qq.ans|0, explain:qq.explain });
            }
          });
        }
        return { title: l.h, blocks: blocks };
      })
    };
  }

  if(typeof window !== 'undefined'){
    window.lessonRenderer = { mount: mount, fromLegacy: fromLegacy, blocks: BLOCKS, viz: VIZ, widgets: WIDGETS, computeTax: computeTax };
  }
})();
