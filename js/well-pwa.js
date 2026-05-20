// PWA install prompt for Enter the Well (faith.html)
// Keys: well_pwa_dismissed, well_ios_prompt_shown, well_visit_count
(function () {
  var BANNER_ID = 'well-install-banner';
  var DISMISS_KEY = 'well_pwa_dismissed';
  var IOS_SHOWN_KEY = 'well_ios_prompt_shown';
  var VISIT_KEY = 'well_visit_count';
  var SHOW_DELAY_FIRST = 30000;   // 30 s on first visit
  var SHOW_DELAY_RETURN = 3000;   // 3 s on return visits
  var REG_DELAY = 2000;           // 2 s after well:registered fires
  var SUPPRESS_DAYS = 7;

  var deferredPrompt = null;
  var bannerShown = false;

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           navigator.standalone === true;
  }

  function isDismissed() {
    var val = localStorage.getItem(DISMISS_KEY);
    if (!val) return false;
    return Date.now() < parseInt(val, 10);
  }

  function suppressForDays(days) {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + days * 864e5));
  }

  function clearSuppression() {
    localStorage.removeItem(DISMISS_KEY);
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
    banner.setAttribute('aria-label', 'Add Enter the Well to your home screen');
    banner.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'z-index:9999',
      'background:#0a1f5e',
      'color:#fff',
      'border-top:2px solid rgba(255,255,255,0.12)',
      'padding:14px 16px calc(14px + env(safe-area-inset-bottom))',
      'display:flex',
      'align-items:center',
      'gap:12px',
      'font-family:system-ui,-apple-system,sans-serif',
      'font-size:14px',
      'box-shadow:0 -4px 24px rgba(0,0,0,0.4)',
      'transform:translateY(100%)',
      'transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1)'
    ].join(';');

    var dove = document.createElement('span');
    dove.textContent = '🕊';
    dove.setAttribute('aria-hidden', 'true');
    dove.style.cssText = 'font-size:26px;flex-shrink:0;line-height:1';

    var msg = document.createElement('span');
    msg.style.cssText = 'flex:1;line-height:1.4';
    msg.innerHTML = ios
      ? '<strong>Add Enter the Well</strong> — tap <em>Share</em> then “Add to Home Screen”'
      : '<strong>Add Enter the Well</strong> to your home screen';

    var closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = [
      'background:none',
      'border:none',
      'color:rgba(255,255,255,0.65)',
      'font-size:22px',
      'line-height:1',
      'cursor:pointer',
      'padding:0 4px',
      'flex-shrink:0'
    ].join(';');
    closeBtn.onclick = function () {
      hideBanner();
      if (!ios) suppressForDays(SUPPRESS_DAYS);
    };

    banner.appendChild(dove);
    banner.appendChild(msg);

    if (!ios) {
      var addBtn = document.createElement('button');
      addBtn.textContent = 'Add';
      addBtn.style.cssText = [
        'background:#fff',
        'color:#0a1f5e',
        'border:none',
        'border-radius:8px',
        'padding:8px 16px',
        'font-weight:700',
        'font-size:13px',
        'cursor:pointer',
        'flex-shrink:0',
        'font-family:inherit'
      ].join(';');
      addBtn.onclick = function () {
        hideBanner();
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
        }
      };
      banner.appendChild(addBtn);
    }

    banner.appendChild(closeBtn);
    return banner;
  }

  function showBanner(ios) {
    if (bannerShown || document.getElementById(BANNER_ID)) return;
    bannerShown = true;
    var banner = createBanner(ios);
    document.body.appendChild(banner);
    // Two rAF frames ensure the initial transform is painted before animating
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.style.transform = 'translateY(0)';
      });
    });
  }

  function hideBanner() {
    var el = document.getElementById(BANNER_ID);
    if (!el) return;
    el.style.transform = 'translateY(100%)';
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 350);
  }

  // Expose globally so register-faith.html can call after a successful signup:
  //   if (window.wellPWA) window.wellPWA.triggerPostRegistration();
  window.wellPWA = {
    triggerPostRegistration: function () {
      window.dispatchEvent(new CustomEvent('well:registered'));
    }
  };

  if (isStandalone()) return;

  var visits = getVisits();
  var delay = visits >= 2 ? SHOW_DELAY_RETURN : SHOW_DELAY_FIRST;

  // Post-registration trigger — registered before the iOS early-return so it
  // always fires regardless of platform
  window.addEventListener('well:registered', function () {
    if (isStandalone()) return;
    // Clear any prior 7-day dismissal to give one more chance after sign-up
    clearSuppression();
    bannerShown = false;
    if (isIOS()) {
      setTimeout(function () { showBanner(true); }, REG_DELAY);
    } else if (deferredPrompt) {
      setTimeout(function () { showBanner(false); }, REG_DELAY);
    }
  });

  if (isIOS()) {
    // Show instruction banner once only — Apple has no programmatic install API
    if (!localStorage.getItem(IOS_SHOWN_KEY)) {
      localStorage.setItem(IOS_SHOWN_KEY, '1');
      setTimeout(function () { showBanner(true); }, delay);
    }
    return;
  }

  // Android / Chrome: catch the native install event
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (!isDismissed()) {
      setTimeout(function () { showBanner(false); }, delay);
    }
  });
})();
