// PWA install handler — modal-based, platform-aware.
//
// iOS Safari can't fire beforeinstallprompt and can't deliver web push from a
// browser tab — so iOS users see Add-to-Home-Screen instructions first.
// Notification permission is then prompted on the next launch from the
// home-screen icon (standalone mode). Android / desktop Chrome get the native
// install flow via beforeinstallprompt.
//
// State keys (per-user via _ylccUserKey when available):
//   ios_install_prompt_seen     — 'later:YYYY-MM-DD' | 'installed' | 'declined'
//   android_install_prompt_seen — 'later:YYYY-MM-DD' | 'installed' | 'declined'
//
// Public entry points:
//   showPwaInstallPrompt({force, fromSettings}) — auto-routes by platform
//   showIosInstallPrompt({force})               — iOS-only
//   showAndroidInstallPrompt({force})           — Android-only
(function () {
  var IOS_KEY_BASE     = 'ios_install_prompt_seen';
  var ANDROID_KEY_BASE = 'android_install_prompt_seen';
  var COOLDOWN_DAYS    = 30;

  var deferredPrompt = null;

  // Lazy — _ylccUserKey may not exist when pwa.js first runs; the user may
  // also sign in after this IIFE. Computing on call picks up the right uid.
  function userKey(base) {
    return (typeof _ylccUserKey === 'function')
      ? _ylccUserKey(base)
      : 'ylcc_' + base + '_local';
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function isAndroid() {
    return /android/i.test(navigator.userAgent);
  }

  function isStandalone() {
    return window.navigator.standalone === true ||
           window.matchMedia('(display-mode: standalone)').matches;
  }

  // True if the user has seen this prompt within the cool-down window or has
  // permanently dismissed it. Bypassed by opts.force at the call site.
  function wasSeenRecently(key) {
    var val = localStorage.getItem(key);
    if (!val) return false;
    if (val === 'installed' || val === 'declined') {
      console.log('[PWA] suppressed by key:', key, 'value:', val);
      return true;
    }
    if (val.indexOf('later:') === 0) {
      var dateStr = val.slice(6);
      var age = Date.now() - Date.parse(dateStr);
      var recent = age < COOLDOWN_DAYS * 86400000;
      if (recent) console.log('[PWA] suppressed by key:', key, 'value:', val, 'ageDays:', (age / 86400000).toFixed(1));
      return recent;
    }
    return false;
  }

  function markLater(base) {
    localStorage.setItem(userKey(base), 'later:' + new Date().toISOString().slice(0, 10));
  }

  function markInstalled(base) {
    localStorage.setItem(userKey(base), 'installed');
  }

  // Brief toast — used when the user clicks "Install as App" in Settings but
  // the browser hasn't surfaced an install option yet.
  function toast(msg) {
    var t = document.createElement('div');
    t.style.cssText = [
      'position:fixed', 'bottom:1.5rem', 'left:50%', 'transform:translateX(-50%)',
      'z-index:9999', 'background:#0d1424', 'color:#fff',
      'border:1px solid rgba(255,255,255,.18)', 'border-radius:10px',
      'padding:.75rem 1.1rem', 'font-size:.82rem',
      'font-family:Inter,system-ui,sans-serif',
      'box-shadow:0 12px 32px rgba(0,0,0,.4)',
      'max-width:90vw', 'text-align:center'
    ].join(';');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 4000);
  }

  // ── iOS install instructions modal ──────────────────────────────────────
  function showIosInstallPrompt(opts) {
    opts = opts || {};
    console.log('[PWA] showIosInstallPrompt called, force:', !!opts.force, 'isStandalone:', isStandalone());
    if (isStandalone()) { console.log('[PWA] already standalone — skip iOS modal'); return; }
    var key = userKey(IOS_KEY_BASE);
    if (!opts.force && wasSeenRecently(key)) return;
    if (document.getElementById('pwaIosModal')) { console.log('[PWA] iOS modal already in DOM — skip'); return; }
    console.log('[PWA] showing iOS modal');

    var overlay = document.createElement('div');
    overlay.id = 'pwaIosModal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9700;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:1.2rem;';
    overlay.innerHTML =
      '<div role="dialog" aria-labelledby="iosInstallTitle" style="max-width:380px;width:100%;background:#0d1424;border:1px solid rgba(56,189,248,.35);border-radius:18px;padding:1.7rem 1.5rem 1.4rem;box-shadow:0 24px 60px rgba(0,0,0,.6);font-family:var(--fm,sans-serif);color:#f1f5f9;">' +
        '<div style="font-size:2.4rem;text-align:center;margin-bottom:.65rem;">📱</div>' +
        '<h2 id="iosInstallTitle" style="margin:0 0 .9rem;font-size:1.1rem;font-weight:800;text-align:center;line-height:1.3;">Install YourLife on iPhone</h2>' +
        '<p style="margin:0 0 1rem;font-size:.85rem;color:#cbd5e1;line-height:1.5;text-align:center;">For the best experience, add this app to your home screen:</p>' +
        '<ol style="margin:0 0 1.3rem;padding-left:1.4rem;font-size:.83rem;color:#e2e8f0;line-height:1.7;">' +
          '<li style="margin-bottom:.4rem;">Tap the share icon <span aria-hidden="true" style="display:inline-block;background:rgba(56,189,248,.15);border:1px solid rgba(56,189,248,.4);border-radius:5px;padding:1px 7px;font-weight:700;color:#38bdf8;margin:0 2px;">⎙</span> at the bottom of Safari</li>' +
          '<li style="margin-bottom:.4rem;">Scroll and tap <strong style="color:#fff;">"Add to Home Screen"</strong></li>' +
          '<li>Open the app from your home screen — get reminders and a real app experience</li>' +
        '</ol>' +
        '<button id="iosInstallOk" style="width:100%;background:linear-gradient(135deg,#38bdf8,#0ea5e9);color:#06141e;border:none;border-radius:10px;padding:.85rem;font-size:.9rem;font-weight:800;cursor:pointer;min-height:44px;font-family:inherit;">Got it, will do</button>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('iosInstallOk').addEventListener('click', function () {
      markLater(IOS_KEY_BASE);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });
    // Tap outside the dialog to dismiss (treated as Later).
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        markLater(IOS_KEY_BASE);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }
    });
  }
  window.showIosInstallPrompt = showIosInstallPrompt;

  // ── Android install modal (after beforeinstallprompt) ───────────────────
  function showAndroidInstallPrompt(opts) {
    opts = opts || {};
    console.log('[PWA] showAndroidInstallPrompt called, force:', !!opts.force, 'isStandalone:', isStandalone(), 'hasDeferredPrompt:', !!deferredPrompt);
    if (isStandalone()) { console.log('[PWA] already standalone — skip Android modal'); return; }
    if (!deferredPrompt) { console.log('[PWA] no deferredPrompt yet — skip Android modal'); return; }
    var key = userKey(ANDROID_KEY_BASE);
    if (!opts.force && wasSeenRecently(key)) return;
    if (document.getElementById('pwaAndroidModal')) { console.log('[PWA] Android modal already in DOM — skip'); return; }
    console.log('[PWA] showing Android modal');

    var overlay = document.createElement('div');
    overlay.id = 'pwaAndroidModal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9700;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:1.2rem;';
    overlay.innerHTML =
      '<div role="dialog" aria-labelledby="androidInstallTitle" style="max-width:380px;width:100%;background:#0d1424;border:1px solid rgba(56,189,248,.35);border-radius:18px;padding:1.7rem 1.5rem 1.4rem;box-shadow:0 24px 60px rgba(0,0,0,.6);font-family:var(--fm,sans-serif);color:#f1f5f9;">' +
        '<div style="font-size:2.4rem;text-align:center;margin-bottom:.65rem;">📱</div>' +
        '<h2 id="androidInstallTitle" style="margin:0 0 .65rem;font-size:1.1rem;font-weight:800;text-align:center;line-height:1.3;">Install YourLife as an app</h2>' +
        '<p style="margin:0 0 1.3rem;font-size:.85rem;color:#cbd5e1;line-height:1.5;text-align:center;">Get a real app icon on your home screen. Works offline. Faster launch.</p>' +
        '<button id="androidInstallYes" style="width:100%;background:linear-gradient(135deg,#38bdf8,#0ea5e9);color:#06141e;border:none;border-radius:10px;padding:.85rem;font-size:.9rem;font-weight:800;cursor:pointer;margin-bottom:.55rem;min-height:44px;font-family:inherit;">Install</button>' +
        '<button id="androidInstallLater" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.18);color:#94a3b8;border-radius:10px;padding:.7rem;font-size:.82rem;font-weight:600;cursor:pointer;min-height:44px;font-family:inherit;">Maybe Later</button>' +
      '</div>';
    document.body.appendChild(overlay);

    function dismiss() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }

    document.getElementById('androidInstallYes').addEventListener('click', async function () {
      dismiss();
      if (!deferredPrompt) return;
      try {
        deferredPrompt.prompt();
        var choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') markInstalled(ANDROID_KEY_BASE);
        else markLater(ANDROID_KEY_BASE);
      } catch (e) { console.warn('[pwa] install failed:', e); }
      deferredPrompt = null;
    });

    document.getElementById('androidInstallLater').addEventListener('click', function () {
      markLater(ANDROID_KEY_BASE);
      dismiss();
    });
  }
  window.showAndroidInstallPrompt = showAndroidInstallPrompt;

  // ── Unified entry: routes by platform ────────────────────────────────────
  function showPwaInstallPrompt(opts) {
    opts = opts || {};
    console.log('[PWA] showPwaInstallPrompt called, force:', !!opts.force, 'fromSettings:', !!opts.fromSettings, 'isIOS:', isIOS(), 'isStandalone:', isStandalone(), 'hasDeferredPrompt:', !!deferredPrompt);
    if (isStandalone()) return;
    if (isIOS()) { showIosInstallPrompt(opts); return; }
    if (deferredPrompt) { showAndroidInstallPrompt(opts); return; }
    if (opts.fromSettings) {
      toast("Your browser hasn't offered an install option yet — try again after using the app for a bit.");
    }
    console.log('[PWA] no install path available right now (Android without beforeinstallprompt fired)');
  }
  window.showPwaInstallPrompt = showPwaInstallPrompt;

  // ── Debug helpers (exposed on window for console use) ────────────────────
  window._ylccDebugClearPrompts = function () {
    Object.keys(localStorage).forEach(function (k) {
      if (k.indexOf('notif_prompt') > -1 ||
          k.indexOf('ios_install') > -1 ||
          k.indexOf('android_install') > -1 ||
          k.indexOf('ylcc_pwa') > -1 ||
          k.indexOf('notif_permission') > -1 ||
          k.indexOf('ylcc_push_prompted') > -1) {
        console.log('[DEBUG] clearing:', k);
        localStorage.removeItem(k);
      }
    });
    console.log('[DEBUG] prompt state cleared — refresh page to retest');
  };

  window._ylccTriggerInstallNow = function () {
    if (typeof showPwaInstallPrompt === 'function') {
      showPwaInstallPrompt({ force: true, fromSettings: true });
    } else {
      console.warn('[DEBUG] showPwaInstallPrompt not loaded');
    }
  };

  window._ylccTriggerNotifNow = function () {
    if (typeof _initPushPrompt === 'function') {
      _initPushPrompt({ force: true });
    } else {
      console.warn('[DEBUG] _initPushPrompt not loaded');
    }
  };

  console.log('[PWA] script loaded, isStandalone:', isStandalone(), 'isIOS:', isIOS(), 'isAndroid:', isAndroid(), 'ua:', navigator.userAgent.slice(0, 80));

  // ── Auto-fire after 30 s if the user has engaged ─────────────────────────
  // Engagement = scroll, tap, key, touch. If still idle after 30 s, poll
  // every 15 s up to 3 more times before giving up (don't pester an idle tab).
  if (isStandalone()) {
    console.log('[PWA] in standalone mode — auto-fire disabled');
    return;
  }

  var engaged = false;
  ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
    window.addEventListener(evt, function onEngage() {
      engaged = true;
      console.log('[PWA] engagement detected via:', evt);
      window.removeEventListener(evt, onEngage);
    }, { passive: true });
  });

  function attemptAutoShow() {
    console.log('[PWA] attemptAutoShow, engaged:', engaged, 'pollCount:', pollCount, 'hasDeferredPrompt:', !!deferredPrompt, 'isIOS:', isIOS());
    if (isStandalone()) return;
    if (isIOS()) { showIosInstallPrompt(); return; }
    if (deferredPrompt) { showAndroidInstallPrompt(); return; }
    // Android-without-event yet: wait for beforeinstallprompt to trigger.
  }

  var pollCount = 0;
  function scheduleAttempt() {
    var delay = pollCount === 0 ? 30000 : 15000;
    console.log('[PWA] scheduleAttempt, pollCount:', pollCount, 'delay:', delay);
    setTimeout(function () {
      if (engaged) { attemptAutoShow(); return; }
      if (++pollCount < 3) scheduleAttempt();
      else console.log('[PWA] giving up — no engagement after polling');
    }, delay);
  }
  scheduleAttempt();

  // Android / Chrome / Edge — capture the install event.
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] beforeinstallprompt captured');
    // If we already passed the engagement gate, show now.
    if (engaged) showAndroidInstallPrompt();
  });

  // User installed via browser UI directly — lock our modal out.
  window.addEventListener('appinstalled', function () {
    console.log('[PWA] appinstalled fired');
    markInstalled(ANDROID_KEY_BASE);
    var el = document.getElementById('pwaAndroidModal');
    if (el) el.remove();
    deferredPrompt = null;
  });
})();
