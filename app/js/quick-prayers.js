/* =============================================================
   quick-prayers.js — Renders the Quick Prayer library and wires
   each card's Save (YLM 'prayer' bookmarks) + Share buttons.

   Public surface:
     window.renderQuickPrayerLibrary(containerId, opts)
     window.qpSetFilter(topic)         — internal but exposed so
                                         inline onclicks can call it
     window.fzGoToPrayerLibrary()      — used by the Explore Faith
                                         pathway card to route the
                                         user from #bf-home into the
                                         Quick Prayer destination
                                         and scroll to the library

   Dependencies (in load order):
     ui.js                  — showToast()
     modal-actions.js       — window.YLM
     data/quick-prayers.js  — window.QUICK_PRAYERS
     faith-zones.js         — fzOpenDest, toggleFaithExplore
============================================================= */

(function (root) {
  'use strict';

  var _qpFilter = 'all';      // 'all' | 'saved' | <topic>
  var _qpHostId = null;       // remember the host so events can refresh

  function _esc(s) {
    if (typeof escapeHtml === 'function') return escapeHtml(String(s || ''));
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function _data() {
    return (root.QUICK_PRAYERS && Array.isArray(root.QUICK_PRAYERS))
      ? root.QUICK_PRAYERS : [];
  }

  function _topics() {
    var seen = {}, out = [];
    _data().forEach(function (p) {
      if (p && p.topic && !seen[p.topic]) { seen[p.topic] = true; out.push(p.topic); }
    });
    return out;
  }

  // Stable slug for anchor IDs. Strips ampersands, lowercases, and
  // collapses anything non-alphanumeric into hyphens. Used to build
  // qp-topic-<slug> ids that the pill chips scroll to.
  function _topicSlug(t) {
    return String(t || '')
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function _savedCount() {
    if (typeof root.YLM === 'undefined') return 0;
    var saved = root.YLM.list('prayer');
    var ids = {};
    _data().forEach(function (p) { ids[String(p.id)] = true; });
    var n = 0;
    saved.forEach(function (id) { if (ids[String(id)]) n++; });
    return n;
  }

  // Returns just the saved prayers (used by saved-mode rendering).
  function _savedList() {
    if (typeof root.YLM === 'undefined') return [];
    var savedIds = {};
    root.YLM.list('prayer').forEach(function (id) { savedIds[String(id)] = true; });
    return _data().filter(function (p) { return savedIds[String(p.id)]; });
  }

  function _pillsHtml() {
    var topics = _topics();
    var savedCount = _savedCount();
    var html = '';
    // Only All and ★ Saved carry an "active" state. Topic chips are
    // navigation, not filters — clicking one scrolls to that section
    // without changing the active mode.
    //
    // Chips are rendered with data-qp-action / data-qp-topic and wired
    // through a single delegated listener (see below). The previous
    // inline `onclick="qpSetFilter(' + JSON.stringify(t) + ')"` broke
    // for every topic because JSON.stringify wraps the value in double
    // quotes, which terminate the double-quoted onclick attribute and
    // leave the handler as the incomplete expression `qpSetFilter(`.
    var allActive   = (_qpFilter !== 'saved');
    var savedActive = (_qpFilter === 'saved');
    html += '<button type="button" class="qp-pill' + (allActive ? ' qp-pill-active' : '') + '" data-qp-action="all">All <span class="qp-pill-count">' + _data().length + '</span></button>';
    html += '<button type="button" class="qp-pill qp-pill-saved' + (savedActive ? ' qp-pill-active' : '') + '" data-qp-action="saved">★ Saved <span class="qp-pill-count">' + savedCount + '</span></button>';
    topics.forEach(function (t) {
      var count = _data().filter(function (p) { return p.topic === t; }).length;
      // _esc handles & " < > ' so the attribute survives all 31 topic
      // names ("Comparison & Jealousy", "Self-Worth", etc.).
      html += '<button type="button" class="qp-pill qp-pill-topic" data-qp-action="topic" data-qp-topic="' + _esc(t) + '">' + _esc(t) + ' <span class="qp-pill-count">' + count + '</span></button>';
    });
    return html;
  }

  function _cardHtml(prayer) {
    var prayId  = 'prayer-pray-'  + prayer.id;
    var saveId  = 'prayer-save-'  + prayer.id;
    var shareId = 'prayer-share-' + prayer.id;
    return ''
      + '<article class="qp-lib-card" data-prayer-id="' + _esc(prayer.id) + '">'
      +   '<header class="qp-lib-head">'
      +     '<span class="qp-lib-chip">' + _esc(prayer.topic) + '</span>'
      +     '<h4 class="qp-lib-title">' + _esc(prayer.title) + '</h4>'
      +     '<div class="qp-lib-verse">' + _esc(prayer.verse) + '</div>'
      +   '</header>'
      +   '<p class="qp-lib-text">' + _esc(prayer.text) + '</p>'
      +   '<button type="button" id="' + prayId + '" class="qp-lib-btn-pray">🙏 Pray this</button>'
      +   '<div class="qp-lib-actions">'
      +     '<button type="button" id="' + saveId  + '" class="qp-lib-btn qp-lib-btn-save"  aria-pressed="false"></button>'
      +     '<button type="button" id="' + shareId + '" class="qp-lib-btn qp-lib-btn-share">📤 Share</button>'
      +   '</div>'
      + '</article>';
  }

  function _bindCardActions() {
    _data().forEach(function (prayer) {
      var prayBtn  = document.getElementById('prayer-pray-'  + prayer.id);
      var saveBtn  = document.getElementById('prayer-save-'  + prayer.id);
      var shareBtn = document.getElementById('prayer-share-' + prayer.id);
      if (prayBtn) {
        prayBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof root.openPrayerFocus === 'function') {
            root.openPrayerFocus({
              title: prayer.title,
              text:  prayer.text,
              verse: prayer.verse,
              trait: 'faith',
              traitAmount: 3
            });
          } else if (typeof showToast === 'function') {
            showToast('Prayer focus unavailable — reload the app');
          }
        });
      }
      if (typeof root.YLM === 'undefined') return;
      if (saveBtn) {
        root.YLM.bindSaveButton(saveBtn, 'prayer', prayer.id, {
          savedLabel:   '★ Saved',
          unsavedLabel: '☆ Save'
        });
      }
      if (shareBtn) {
        shareBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          root.YLM.share({
            title: prayer.title,
            text:  prayer.text + ' — ' + prayer.verse,
            url:   'https://yourlifecc.com'
          });
        });
      }
    });
  }

  // Inject the CSS once. Lives in JS so the renderer can ship as a
  // single drop-in module without touching index.html beyond a script
  // tag — and so the styles travel with the data layer.
  var _stylesInjected = false;
  function _ensureStyles() {
    if (_stylesInjected) return;
    _stylesInjected = true;
    var css = ''
      + '.qp-lib-wrap{display:flex;flex-direction:column;gap:1rem;}'
      + '.qp-lib-header{display:flex;flex-direction:column;gap:.45rem;}'
      + '.qp-lib-eyebrow{font-family:var(--fm);font-size:.6rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;}'
      + '.qp-lib-title-h{font-family:var(--fh,var(--fm));font-size:1.3rem;line-height:1.2;color:var(--tx);margin:0;font-weight:700;}'
      + '.qp-lib-subtitle{font-family:var(--fm);font-size:.84rem;color:var(--tx2);line-height:1.5;}'
      + '.qp-lib-pills{display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0 .2rem;}'
      + '.qp-pill{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:99px;padding:.4rem .8rem;font-size:.72rem;font-weight:700;cursor:pointer;font-family:var(--fm);transition:background .15s,border-color .15s,color .15s;}'
      + '.qp-pill:hover{background:rgba(167,139,250,.12);border-color:rgba(167,139,250,.32);}'
      + '.qp-pill-active{background:#a78bfa;border-color:#a78bfa;color:#0b1220;}'
      + '.qp-pill-saved{border-color:rgba(251,191,36,.35);color:#fbbf24;}'
      + '.qp-pill-saved.qp-pill-active{background:#fbbf24;color:#0b1220;border-color:#fbbf24;}'
      + '.qp-pill-count{opacity:.7;margin-left:.2rem;font-weight:800;}'
      + '.qp-pill-active .qp-pill-count{opacity:.85;}'
      + '.qp-lib-body{display:flex;flex-direction:column;gap:1.4rem;}'
      // Topic section + header. scroll-margin-top reserves room above
      // the header for any sticky chrome (or just breathing space when
      // there is none) so chip jumps land cleanly.
      + '.qp-topic-group{display:flex;flex-direction:column;gap:.7rem;scroll-margin-top:1.5rem;}'
      + '.qp-topic-h{display:flex;align-items:center;gap:.6rem;margin:0;font-family:var(--fh,var(--fm));font-size:1.05rem;font-weight:800;color:var(--tx);letter-spacing:.01em;}'
      + '.qp-topic-h::before{content:"";display:inline-block;width:3px;height:1.1rem;background:linear-gradient(180deg,#a78bfa,#7c3aed);border-radius:2px;}'
      + '.qp-topic-h-label{flex:1;min-width:0;}'
      + '.qp-topic-h-count{font-family:var(--fm);font-size:.62rem;font-weight:800;letter-spacing:.14em;color:var(--tx3);opacity:.7;}'
      + '.qp-lib-grid{display:grid;gap:.85rem;}'
      + '@media (min-width:720px){.qp-lib-grid{grid-template-columns:1fr 1fr;}}'
      + '.qp-lib-card{background:linear-gradient(180deg,rgba(167,139,250,.06),rgba(15,18,40,.4));border:1px solid rgba(167,139,250,.22);border-radius:16px;padding:1.1rem 1.1rem 1rem;display:flex;flex-direction:column;gap:.7rem;box-shadow:0 6px 20px rgba(0,0,0,.18);}'
      + '.qp-lib-head{display:flex;flex-direction:column;gap:.35rem;}'
      + '.qp-lib-chip{align-self:flex-start;background:rgba(167,139,250,.16);border:1px solid rgba(167,139,250,.32);color:#cdb9ff;font-family:var(--fm);font-size:.62rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:.22rem .6rem;border-radius:99px;}'
      + '.qp-lib-title{font-family:var(--fh,var(--fm));font-size:1.05rem;font-weight:700;color:var(--tx);margin:0;line-height:1.25;}'
      + '.qp-lib-verse{font-family:var(--fm);font-size:.7rem;font-weight:800;letter-spacing:.04em;color:#fbbf24;}'
      + '.qp-lib-text{font-family:Georgia,"Times New Roman",serif;font-size:.92rem;line-height:1.65;color:var(--tx);margin:0;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}'
      + '.qp-lib-btn-pray{display:block;width:100%;margin-top:.4rem;background:linear-gradient(135deg,#a78bfa,#7c3aed);border:none;color:#fff;border-radius:12px;padding:.78rem 1rem;font-family:var(--fh,var(--fm));font-size:.92rem;font-weight:900;letter-spacing:.06em;cursor:pointer;box-shadow:0 8px 22px rgba(124,58,237,.32);transition:transform .15s,box-shadow .2s;}'
      + '.qp-lib-btn-pray:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(124,58,237,.44);}'
      + '.qp-lib-btn-pray:focus-visible{outline:2px solid #fbbf24;outline-offset:2px;}'
      + '.qp-lib-actions{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.5rem;}'
      + '.qp-lib-btn{flex:1;min-width:0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:var(--tx2);border-radius:10px;padding:.45rem .7rem;font-size:.7rem;font-weight:700;cursor:pointer;font-family:var(--fm);transition:background .15s,border-color .15s,color .15s;}'
      + '.qp-lib-btn:hover{background:rgba(167,139,250,.1);border-color:rgba(167,139,250,.28);color:var(--tx);}'
      + '.qp-lib-btn-save.ylm-saved{background:#fbbf24;border-color:#fbbf24;color:#0b1220;}'
      + '.qp-lib-empty{padding:1.2rem;text-align:center;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.15);border-radius:12px;color:var(--tx2);font-size:.85rem;}'
      + ':root.light .qp-lib-card{background:#fafaf9;border-color:rgba(124,58,237,.25);color:#1a1233;box-shadow:0 4px 14px rgba(15,23,42,.06);}'
      + ':root.light .qp-lib-text{color:#1a1233;}'
      + ':root.light .qp-lib-chip{background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.3);color:#5b21b6;}'
      + ':root.light .qp-pill{background:#f5f5f4;border-color:rgba(15,23,42,.12);color:#1a1233;}'
      + ':root.light .qp-pill-active{background:#7c3aed;border-color:#7c3aed;color:#fff;}'
      + ':root.light .qp-pill-saved{color:#b45309;border-color:rgba(180,83,9,.3);}'
      + ':root.light .qp-pill-saved.qp-pill-active{background:#fbbf24;color:#0b1220;border-color:#fbbf24;}'
      + ':root.light .qp-lib-btn{background:#fff;border-color:rgba(15,23,42,.14);color:#1a1233;}';
    var tag = document.createElement('style');
    tag.id = 'qp-lib-styles';
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function _wrapHtml(opts) {
    var heading = (opts && opts.heading) || 'Pray with the right words';
    var sub = (opts && opts.subtitle) || 'Borrow a prayer when you don\'t have your own. Tap a topic to jump straight to its prayers.';
    return ''
      + '<div class="qp-lib-wrap" id="qpLibInner">'
      +   '<div class="qp-lib-header">'
      +     '<div class="qp-lib-eyebrow">PRAYER LIBRARY</div>'
      +     '<h3 class="qp-lib-title-h">' + _esc(heading) + '</h3>'
      +     '<div class="qp-lib-subtitle">' + _esc(sub) + '</div>'
      +   '</div>'
      +   '<div class="qp-lib-pills" id="qpLibPills"></div>'
      +   '<div class="qp-lib-body" id="qpLibBody"></div>'
      + '</div>';
  }

  // Browse mode — every topic gets a section header with an id
  // ("qp-topic-<slug>") that the pill chips smooth-scroll into view.
  // scroll-margin-top on .qp-topic-group reserves visual room so the
  // header doesn't slam against the top of the viewport (and accounts
  // for any sticky chrome above the library).
  function _browseHtml() {
    var topics = _topics();
    return topics.map(function (t) {
      var slug = _topicSlug(t);
      var list = _data().filter(function (p) { return p.topic === t; });
      var cards = list.map(_cardHtml).join('');
      return ''
        + '<section class="qp-topic-group" id="qp-topic-' + slug + '">'
        +   '<h4 class="qp-topic-h">'
        +     '<span class="qp-topic-h-label">' + _esc(t) + '</span>'
        +     '<span class="qp-topic-h-count">' + list.length + '</span>'
        +   '</h4>'
        +   '<div class="qp-lib-grid">' + cards + '</div>'
        + '</section>';
    }).join('');
  }

  function _savedBodyHtml() {
    var list = _savedList();
    if (!list.length) {
      return '<div class="qp-lib-empty">No saved prayers yet. Tap ☆ Save on any prayer to keep it here.</div>';
    }
    return '<div class="qp-lib-grid">' + list.map(_cardHtml).join('') + '</div>';
  }

  function _renderInto(host) {
    if (!host) return;
    var pills = host.querySelector('#qpLibPills');
    var body  = host.querySelector('#qpLibBody');
    if (!pills || !body) {
      host.innerHTML = _wrapHtml();
      pills = host.querySelector('#qpLibPills');
      body  = host.querySelector('#qpLibBody');
    }
    if (!pills || !body) return;
    pills.innerHTML = _pillsHtml();
    body.innerHTML = (_qpFilter === 'saved') ? _savedBodyHtml() : _browseHtml();
    _bindCardActions();
  }

  function renderQuickPrayerLibrary(containerId, opts) {
    _ensureStyles();
    _qpHostId = containerId || _qpHostId;
    var host = document.getElementById(_qpHostId);
    if (!host) return;
    host.innerHTML = _wrapHtml(opts);
    _renderInto(host);
  }

  // The pill row is both a filter ("All" / "★ Saved") and a jump menu
  // (topic chips). Routing:
  //   'all'    → ensure browse mode, scroll to the library top
  //   'saved'  → switch to saved-only mode (no jump)
  //   <topic>  → ensure browse mode is rendered, scroll to that
  //              topic's section anchor (qp-topic-<slug>)
  //
  // _topicSlug is the single source of truth used by both
  // _browseHtml (to build the section id) AND this function (to look
  // it up) — so a chip click can never miss because of a slug
  // mismatch.
  function qpSetFilter(topic) {
    var host = _qpHostId && document.getElementById(_qpHostId);
    if (!host) return;

    if (topic === 'saved') {
      if (_qpFilter !== 'saved') {
        _qpFilter = 'saved';
        _renderInto(host);
      }
      return;
    }

    // Either 'all' or a specific topic — both mean browse mode.
    var wasSaved = (_qpFilter === 'saved');
    _qpFilter = 'all';
    if (wasSaved) _renderInto(host);

    // Double rAF: wait for style recalc (first frame) AND layout
    // commit (second frame) before measuring. If we re-rendered
    // browse mode above, the new section anchor isn't actually
    // laid out yet when the synchronous code returns — measuring
    // here would scroll to a stale rect.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var target;
        if (topic === 'all' || !topic) {
          target = host.querySelector('#qpLibBody') || host;
        } else {
          var slug = _topicSlug(topic);
          target = host.querySelector('#qp-topic-' + slug);
          if (!target) {
            // No band-aid silent fallback — surface the miss so future
            // data drift or slug-fn changes get caught in dev.
            try {
              console.warn('[quick-prayers] topic section not found',
                { topic: topic, slug: slug, lookedFor: '#qp-topic-' + slug });
            } catch (_) {}
            target = host.querySelector('#qpLibBody') || host;
          }
        }
        if (target && target.scrollIntoView) {
          // scrollIntoView walks every scrolling ancestor (overflow:auto
          // panels, the document) and respects the
          // scroll-margin-top:1.5rem on .qp-topic-group, so we don't
          // need to assume the document is the only scroller.
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Helper used by the Explore Faith pathway card — routes from
  // #bf-home back to the Quick Prayer destination view, then scrolls
  // the library into view. Stays defensive when the helpers are
  // missing so the click never silently fails.
  function fzGoToPrayerLibrary() {
    if (typeof toggleFaithExplore === 'function') {
      try { toggleFaithExplore(false); } catch (_) {}
    }
    setTimeout(function () {
      if (typeof fzOpenDest === 'function') {
        try { fzOpenDest('prayer'); } catch (_) {}
      }
      setTimeout(function () {
        var lib = document.getElementById('quickPrayerLibrary');
        if (lib && lib.scrollIntoView) lib.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 220);
    }, 80);
  }

  // Keep the Saved pill count + Saved view in sync when any prayer is
  // toggled from any UI (modal, card, future surfaces).
  if (typeof document !== 'undefined') {
    document.addEventListener('ylm:save-changed', function (e) {
      if (!e || !e.detail || e.detail.kind !== 'prayer') return;
      var host = _qpHostId && document.getElementById(_qpHostId);
      if (host) _renderInto(host);
    });

    // Single delegated click listener for every pill chip. Attached
    // once at module load so it survives every re-render of
    // #qpLibPills (innerHTML rebuilds destroy the chip nodes but the
    // document never goes away). Replaces the previous inline
    // onclick="qpSetFilter(' + JSON.stringify(t) + ')" pattern, which
    // was broken for every topic because JSON.stringify wraps the
    // value in double quotes that terminate the onclick="..."
    // attribute mid-handler.
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest && e.target.closest('[data-qp-action]');
      if (!btn) return;
      e.preventDefault();
      var action = btn.getAttribute('data-qp-action');
      if (action === 'all' || action === 'saved') {
        qpSetFilter(action);
      } else if (action === 'topic') {
        qpSetFilter(btn.getAttribute('data-qp-topic'));
      }
    });
  }

  root.renderQuickPrayerLibrary = renderQuickPrayerLibrary;
  root.qpSetFilter              = qpSetFilter;
  root.fzGoToPrayerLibrary      = fzGoToPrayerLibrary;
})(typeof window !== 'undefined' ? window : globalThis);
