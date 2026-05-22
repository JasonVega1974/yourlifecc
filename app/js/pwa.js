// PWA install prompt handler.
// Storage keys (all unscoped — install state is browser-wide, not per-user):
//   ylcc_pwa_dismissed     — epoch ms before which we won't auto-show
//   ylcc_pwa_never         — '1' means user explicitly opted out
//   ylcc_ios_prompt_shown  — '1' after iOS instructions have been shown once
//   ylcc_visit_count       — visit counter (drives first-visit delay)
//
// Exposes window.showPwaInstallPrompt() so the post-signup flow and a
// Settings entry can re-trigger the banner on demand.
(function () {
  var BANNER_ID         = 'pwa-install-banner';
  var DISMISS_KEY       = 'ylcc_pwa_dismissed';
  var NEVER_KEY         = 'ylcc_pwa_never';
  var IOS_SHOWN_KEY     = 'ylcc_ios_prompt_shown';
  var VISIT_KEY         = 'ylcc_visit_count';
  var SHOW_DELAY_FIRST  = 30000; // 30 s on first visit — Google penalizes earlier
  var SHOW_DELAY_RETURN = 3000;  // 3 s on return visits
  var SUPPRESS_DAYS     = 7;     // default re-prompt window
  var NEVER_DAYS        = 365;   // "Don't show again" window

  var deferredPrompt = null;
  var bannerShown    = false;

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           navigator.standalone === true;
  }

  function isDismissed() {
    if (localStorage.getItem(NEVER_KEY) === '1') return true;
    var val = localStorage.getItem(DISMISS_KEY);
    if (!val) return false;
    return Date.now() < parseInt(val, 10);
  }

  function suppressForDays(days) {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + days * 864e5));
  }

  function getVisits() {
    var n = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    return n;
  }

  function createBanner(ios) {
    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Install YourLife CC');
    banner.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'z-index:9500',
      'background:#0a1f5e',
      'color:#fff',
      'border-top:2px solid rgba(255,255,255,0.12)',
      'padding:14px 16px calc(14px + env(safe-area-inset-bottom))',
      'display:flex',
      'flex-wrap:wrap',
      'align-items:center',
      'gap:12px',
      'font-family:Inter,system-ui,sans-serif',
      'font-size:14px',
      'box-shadow:0 -4px 24px rgba(0,0,0,0.35)'
    ].join(';');

    var icon = document.createElement('img');
    icon.src = '/app/icons/icon-192.png';
    icon.alt = '';
    icon.width = 44;
    icon.height = 44;
    icon.style.cssText = 'border-radius:9px;flex-shrink:0';

    var msg = document.createElement('div');
    msg.style.cssText = 'flex:1 1 60%;line-height:1.4;min-width:200px';
    if (ios) {
      msg.innerHTML =
        '<div style="font-weight:700;margin-bottom:4px;">Install YourLife CC</div>' +
        '<div style="font-size:12.5px;opacity:.85;">Tap <span aria-hidden="true">⬆️</span> <strong>Share</strong> at the bottom of Safari, then <strong>Add to Home Screen</strong>.</div>';
    } else {
      msg.innerHTML =
        '<div style="font-weight:700;margin-bottom:4px;">Add YourLife CC to your home screen</div>' +
        '<div style="font-size:12.5px;opacity:.85;">Faster launch, full-screen, works offline.</div>';
    }

    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;align-items:center;flex-shrink:0;margin-left:auto;';

    if (!ios) {
      var addBtn = document.createElement('button');
      addBtn.textContent = 'Add';
      addBtn.setAttribute('aria-label', 'Install YourLife CC');
      addBtn.style.cssText = [
        'background:#fff',
        'color:#0a1f5e',
        'border:none',
        'border-radius:8px',
        'padding:10px 16px',
        'font-weight:800',
        'font-size:13px',
        'cursor:pointer',
        'min-height:44px',
        'font-family:inherit'
      ].join(';');
      addBtn.onclick = function () {
        var el = document.getElementById(BANNER_ID);
        if (el) el.remove();
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function (choice) {
            if (choice && choice.outcome === 'accepted') {
              localStorage.setItem(NEVER_KEY, '1');
            }
            deferredPrompt = null;
          });
        }
      };
      actions.appendChild(addBtn);
    }

    var laterBtn = document.createElement('button');
    laterBtn.textContent = 'Later';
    laterBtn.setAttribute('aria-label', 'Dismiss for now');
    laterBtn.style.cssText = [
      'background:rgba(255,255,255,0.08)',
      'color:rgba(255,255,255,0.85)',
      'border:1px solid rgba(255,255,255,0.18)',
      'border-radius:8px',
      'padding:10px 12px',
      'font-size:12.5px',
      'cursor:pointer',
      'min-height:44px',
      'font-family:inherit'
    ].join(';');
    laterBtn.onclick = function () {
      var el = document.getElementById(BANNER_ID);
      if (el) el.remove();
      suppressForDays(SUPPRESS_DAYS);
    };
    actions.appendChild(laterBtn);

    var neverBtn = document.createElement('button');
    neverBtn.setAttribute('aria-label', "Don't show again");
    neverBtn.textContent = '×';
    neverBtn.style.cssText = [
      'background:none',
      'border:none',
      'color:rgba(255,255,255,0.55)',
      'font-size:22px',
      'line-height:1',
      'cursor:pointer',
      'padding:6px 8px',
      'min-width:44px',
      'min-height:44px',
      'font-family:inherit'
    ].join(';');
    neverBtn.title = "Don't show again";
    neverBtn.onclick = function () {
      var el = document.getElementById(BANNER_ID);
      if (el) el.remove();
      localStorage.setItem(NEVER_KEY, '1');
      suppressForDays(NEVER_DAYS);
    };
    actions.appendChild(neverBtn);

    banner.appendChild(icon);
    banner.appendChild(msg);
    banner.appendChild(actions);
    return banner;
  }

  function showBanner(ios) {
    if (bannerShown || document.getElementById(BANNER_ID)) return;
    if (isStandalone()) return;
    bannerShown = true;
    document.body.appendChild(createBanner(ios));
  }

  // Public — invoked from Settings ("Install as App") and after signup.
  // Bypasses isDismissed() so a fresh user always sees it once.
  function showPwaInstallPrompt(opts) {
    opts = opts || {};
    if (isStandalone()) return;
    // Reset transient flags so a manual trigger re-shows the banner.
    bannerShown = false;
    var existing = document.getElementById(BANNER_ID);
    if (existing) existing.remove();
    if (isIOS()) {
      showBanner(true);
      return;
    }
    if (deferredPrompt) {
      showBanner(false);
      return;
    }
    // Native prompt hasn't fired yet — flash a brief "install isn't ready"
    // toast only when the user manually invoked from Settings; silent when
    // called from the signup hook (signup will retry once the event fires).
    if (opts.fromSettings) {
      var t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:9999;background:#0d1424;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:.75rem 1.1rem;font-size:.82rem;font-family:Inter,system-ui,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.4);';
      t.textContent = "Your browser hasn't offered an install option yet — try again after using the app for a bit.";
      document.body.appendChild(t);
      setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, 4000);
    }
  }
  window.showPwaInstallPrompt = showPwaInstallPrompt;

  // Already installed — nothing to do.
  if (isStandalone()) {
    localStorage.setItem(NEVER_KEY, '1');
    return;
  }

  var visits = getVisits();
  var delay  = visits >= 2 ? SHOW_DELAY_RETURN : SHOW_DELAY_FIRST;

  if (isIOS()) {
    // iOS Safari can't fire beforeinstallprompt — show our instructions once
    // automatically, then expose the manual trigger via Settings forever.
    if (!localStorage.getItem(IOS_SHOWN_KEY) && !isDismissed()) {
      localStorage.setItem(IOS_SHOWN_KEY, '1');
      setTimeout(function () { showBanner(true); }, delay);
    }
    return;
  }

  // Android / Chrome / Edge — wait for the native install event.
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (!isDismissed()) {
      setTimeout(function () { showBanner(false); }, delay);
    }
  });

  // If the user installs via the browser UI directly, lock our banner out.
  window.addEventListener('appinstalled', function () {
    localStorage.setItem(NEVER_KEY, '1');
    var el = document.getElementById(BANNER_ID);
    if (el) el.remove();
  });
})();
