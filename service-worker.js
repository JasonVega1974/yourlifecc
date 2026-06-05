// YourLifeCC Service Worker
// Version bump this string whenever you deploy a major update
// to force old caches to clear.
const CACHE_NAME = 'yourlifecc-v246';

// Core assets to pre-cache on install — the app shell + key Well modules
// + the shared modal/save/share + prayer focus + Quick Prayer library
// modules + the canonical prayer dataset (now JSON, shared with /api)
// + the Command Center home (Constellation hero for full-app users).
const PRECACHE_ASSETS = [
  '/app/',
  '/app/index.html',
  '/manifest.json',
  '/app/css/app.css',
  '/app/js/init.js',
  '/app/js/faith.js',
  '/app/js/bible-study-data.js',
  '/app/js/ui.js',
  '/app/js/sync.js',
  '/app/js/streaks.js',
  '/app/js/modal-actions.js',
  '/app/js/prayer-focus.js',
  '/app/js/quick-prayers.js',
  '/app/js/command-center.js',
  '/app/js/data/quick-prayers.js',
  '/app/js/data/quick-prayers.json'
];

// ─── Install ───────────────────────────────────────────────────────────────
// Pre-cache the app shell so it loads instantly on repeat visits
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        // Non-fatal: some assets may not exist yet during first deploy
        console.warn('[SW] Pre-cache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Message ───────────────────────────────────────────────────────────────
// The page-side registration (app/index.html ~line 15661) postMessages
// {type:'SKIP_WAITING'} when a new SW is installed and waiting. Honor it.
// The install handler also calls skipWaiting() unconditionally, so this is
// belt-and-suspenders for any browser path where the install-time call
// no-ops (e.g. when an old controller is mid-fetch).
self.addEventListener('message', event => {
  if (event && event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─── Activate ──────────────────────────────────────────────────────────────
// Delete any old caches from previous SW versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch ─────────────────────────────────────────────────────────────────
// Strategy:
//   • Supabase API calls  → Network only (never cache live auth/data)
//   • Stripe API calls    → Network only
//   • Brevo API calls     → Network only
//   • Navigation requests → Network first, fall back to cached app shell
//   • Everything else     → Cache first, then network (static assets)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always go straight to network for third-party APIs
  const networkOnly = [
    'supabase.co',
    'stripe.com',
    'api.brevo.com',
    'api.sendinblue.com',
    'googleapis.com',
    'translate.googleapis.com'
  ];
  if (networkOnly.some(host => url.hostname.includes(host))) {
    return; // Pass through — never cache auth/payment/external calls
  }

  // First-party /api/ routes — network first, degrade to offline JSON on failure.
  // Actual lesson content is cached in localStorage by _bsGenerate() in faith.js.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request) ||
          new Response(JSON.stringify({ error: 'offline' }), {
            headers: { 'Content-Type': 'application/json' }
          });
      })
    );
    return;
  }

  // For navigation (HTML page loads) — network first, fallback to shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone and cache a fresh copy
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Offline fallback — serve cached app shell
          return caches.match('/app/index.html') || caches.match('/app/');
        })
    );
    return;
  }

  // JS and CSS — network first so deploys are always visible; cache as offline fallback
  const isAppAsset = (url.pathname.startsWith('/app/js/') || url.pathname.startsWith('/app/css/'));
  if (isAppAsset) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // For everything else — cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Only cache successful same-origin responses
        if (
          !response ||
          response.status !== 200 ||
          response.type === 'opaque' ||
          url.origin !== self.location.origin
        ) {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // For image/font failures offline — just return nothing gracefully
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});

// ─── Background Sync (optional future use) ─────────────────────────────────
// If you ever add offline form submissions, wire them up here.
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
    // Future: flush any queued offline mutations to Supabase
  }
});

// ─── Push Notifications ────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'YourLifeCC', {
      body:  data.body || '',
      icon:  '/app/icons/icon-192.png',
      badge: '/app/icons/badge-72.png',
      data:  { url: data.url || 'https://yourlifecc.com' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || 'https://yourlifecc.com')
  );
});
