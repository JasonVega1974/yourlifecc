/* =============================================================
   modal-actions.js — Shared Save (bookmark) + Share path used
   by every faith modal. One robust implementation: native share
   with canShare gating, clipboard fallback, manual prompt as a
   last resort, per-user-scoped localStorage bookmarks, and
   consistent toast feedback on success and failure.

   Public surface (window.YLM):
     YLM.isSaved(kind, id)            -> boolean
     YLM.toggleSave(kind, id)         -> new boolean state; fires toast
     YLM.list(kind)                   -> array of saved ids
     YLM.bindSaveButton(btn, kind, id, opts) -> wires click + visuals
     YLM.share({title, text, url})    -> native -> clipboard -> prompt

   Storage:
     localStorage[ _ylccUserKey('ylcc_saved_' + kind) ] = JSON[]
   Per-user scoping uses init.js's _ylccUserKey() helper, falling
   back to a '_local' bucket when no user is signed in. This is
   intentional — the requirement is offline-first.

   Events:
     document fires 'ylm:save-changed' (detail:{kind,id,saved}) on
     every toggle so Saved views can refresh themselves.

   Load order: between ui.js (showToast) and faith.js. init.js
   loads later, so _ylccUserKey is resolved lazily on each call.
============================================================= */

(function (root) {
  'use strict';

  function _toast(msg) {
    if (typeof showToast === 'function') {
      try { showToast(msg); return; } catch (_) {}
    }
    try { console.log('[YLM toast]', msg); } catch (_) {}
  }

  function _keyFor(kind) {
    var base = 'ylcc_saved_' + String(kind || 'default');
    if (typeof _ylccUserKey === 'function') {
      try { return _ylccUserKey(base); } catch (_) {}
    }
    return base + '_local';
  }

  function _read(kind) {
    try {
      var raw = localStorage.getItem(_keyFor(kind));
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch (_) { return []; }
  }

  function _write(kind, arr) {
    try {
      localStorage.setItem(_keyFor(kind), JSON.stringify(arr.slice(0, 500)));
      return true;
    } catch (_) { return false; }
  }

  function isSaved(kind, id) {
    if (id == null || id === '') return false;
    return _read(kind).indexOf(String(id)) !== -1;
  }

  function list(kind) { return _read(kind); }

  // Returns the NEW saved state. Always fires a toast (success or
  // error) so the click is never silent.
  function toggleSave(kind, id) {
    if (id == null || id === '') { _toast('Cannot save — missing id'); return false; }
    var arr = _read(kind);
    var sid = String(id);
    var idx = arr.indexOf(sid);
    var nowSaved;
    if (idx === -1) { arr.push(sid); nowSaved = true; }
    else { arr.splice(idx, 1); nowSaved = false; }
    if (!_write(kind, arr)) {
      _toast('Save failed — storage full or blocked');
      return idx !== -1;
    }
    _toast(nowSaved ? 'Saved ✓' : 'Removed from Saved');
    try {
      document.dispatchEvent(new CustomEvent('ylm:save-changed', {
        detail: { kind: kind, id: sid, saved: nowSaved }
      }));
    } catch (_) {}
    return nowSaved;
  }

  function _applyButtonState(btn, kind, id, opts) {
    if (!btn) return;
    opts = opts || {};
    var saved = isSaved(kind, id);
    btn.textContent = saved
      ? (opts.savedLabel   || '★ Saved')
      : (opts.unsavedLabel || '☆ Save');
    btn.classList.toggle('ylm-saved', saved);
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    var style = saved ? opts.savedStyle : opts.unsavedStyle;
    if (typeof style === 'string') btn.style.cssText = style;
  }

  // Wire a button to toggle save state on click and update its own
  // text + class + aria-pressed. Safe to call repeatedly when the
  // modal re-renders — the previous listener is removed by cloning
  // the node, so we never stack handlers.
  function bindSaveButton(btn, kind, id, opts) {
    if (!btn) return null;
    var clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    btn = clone;
    _applyButtonState(btn, kind, id, opts);
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSave(kind, id);
      _applyButtonState(btn, kind, id, opts);
      if (opts && typeof opts.onChange === 'function') {
        try { opts.onChange(isSaved(kind, id)); } catch (_) {}
      }
    });
    return btn;
  }

  // Robust share: native -> clipboard -> manual prompt. Always
  // toasts on success or terminal failure. Must be called inside
  // the click handler's gesture window — that's why we don't
  // await any async work before invoking navigator.share.
  function share(payload) {
    payload = payload || {};
    var title = String(payload.title || 'YourLife CC');
    var text  = String(payload.text  || '');
    var url   = String(payload.url   || '');
    var shareData = { title: title, text: text };
    if (url) shareData.url = url;

    var canNative = !!navigator.share;
    if (canNative && navigator.canShare) {
      try { canNative = navigator.canShare(shareData); } catch (_) { canNative = true; }
    }

    if (canNative) {
      try {
        var p = navigator.share(shareData);
        if (p && typeof p.then === 'function') {
          p.then(function () {
            // OS share sheet already gave visual feedback; no toast needed.
          }).catch(function (err) {
            if (err && err.name === 'AbortError') return; // user cancelled
            _fallbackCopy(text, url);
          });
        }
        return;
      } catch (_) {
        // fall through to clipboard
      }
    }

    _fallbackCopy(text, url);
  }

  function _fallbackCopy(text, url) {
    var payload = text + (url ? (text ? '\n\n' : '') + url : '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(function () {
        _toast('Copied to clipboard ✓');
      }).catch(function () {
        _legacyCopy(payload);
      });
      return;
    }
    _legacyCopy(payload);
  }

  function _legacyCopy(payload) {
    try {
      var ta = document.createElement('textarea');
      ta.value = payload;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      var ok = false;
      try { ok = !!(document.execCommand && document.execCommand('copy')); } catch (_) {}
      document.body.removeChild(ta);
      if (ok) { _toast('Copied to clipboard ✓'); return; }
    } catch (_) {}
    try {
      window.prompt('Copy this to share:', payload);
      _toast('Manual copy ready');
    } catch (_) {
      _toast('Sharing not supported on this browser');
    }
  }

  root.YLM = {
    isSaved: isSaved,
    toggleSave: toggleSave,
    list: list,
    bindSaveButton: bindSaveButton,
    share: share,
    _read: _read,
    _write: _write
  };
})(typeof window !== 'undefined' ? window : globalThis);
