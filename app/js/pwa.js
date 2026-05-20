// PWA install prompt handler
// Keys: ylcc_pwa_dismissed, ylcc_ios_prompt_shown, ylcc_visit_count
(function () {
  var BANNER_ID = 'pwa-install-banner';
  var DISMISS_KEY = 'ylcc_pwa_dismissed';
  var IOS_SHOWN_KEY = 'ylcc_ios_prompt_shown';
  var VISIT_KEY = 'ylcc_visit_count';
  var SHOW_DELAY_FIRST = 30000;   // 30 s on first visit
  var SHOW_DELAY_RETURN = 3000;   // 3 s on return visits
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

  function getVisits() {
    var n = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    return n;
  }

  function createBanner(ios) {
    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Install app');
    banner.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'z-index:9500',
      'background:#0a1f5e',
      'color:#fff',
      'border-top:2px solid rgba(255,255,255,0.12)',
      'padding:12px 16px calc(12px + env(safe-area-inset-bottom))',
      'display:flex',
      'align-items:center',
      'gap:12px',
      'font-family:Inter,system-ui,sans-serif',
      'font-size:14px',
      'box-shadow:0 -4px 24px rgba(0,0,0,0.35)'
    ].join(';');

    var img = document.createElement('img');
    img.src = '/app/icons/icon-192.png';
    img.alt = '';
    img.width = 40;
    img.height = 40;
    img.style.cssText = 'border-radius:9px;flex-shrink:0';

    var msg = document.createElement('span');
    msg.style.cssText = 'flex:1;line-height:1.4';
    msg.innerHTML = ios
      ? '<strong>Add YourLife CC</strong> to your home screen — tap <em>Share</em> then “Add to Home Screen”'
      : '<strong>Add YourLife CC</strong> to your home screen for quick access';

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
      var el = document.getElementById(BANNER_ID);
      if (el) el.remove();
      if (!ios) suppressForDays(SUPPRESS_DAYS);
    };

    banner.appendChild(img);
    banner.appendChild(msg);

    if (!ios) {
      var addBtn = document.createElement('button');
      addBtn.textContent = 'Add';
      addBtn.style.cssText = [
        'background:#fff',
        'color:#0a1f5e',
        'border:none',
        'border-radius:6px',
        'padding:7px 14px',
        'font-weight:700',
        'font-size:13px',
        'cursor:pointer',
        'flex-shrink:0',
        'font-family:inherit'
      ].join(';');
      addBtn.onclick = function () {
        var el = document.getElementById(BANNER_ID);
        if (el) el.remove();
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
    document.body.appendChild(createBanner(ios));
  }

  // Already installed — nothing to do
  if (isStandalone()) return;

  var visits = getVisits();
  var delay = visits >= 2 ? SHOW_DELAY_RETURN : SHOW_DELAY_FIRST;

  if (isIOS()) {
    // Show once only — Apple doesn't allow programmatic Add to Home Screen
    if (!localStorage.getItem(IOS_SHOWN_KEY)) {
      localStorage.setItem(IOS_SHOWN_KEY, '1');
      setTimeout(function () { showBanner(true); }, delay);
    }
    return;
  }

  // Android / Chrome: wait for the native install event
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (!isDismissed()) {
      setTimeout(function () { showBanner(false); }, delay);
    }
  });
})();
