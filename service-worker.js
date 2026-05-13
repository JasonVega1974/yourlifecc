// YourLifeCC Service Worker
// Version bump this string whenever you deploy a major update
// to force old caches to clear.
const CACHE_NAME = 'yourlifecc-v58';

// Core assets to pre-cache on install — the app shell
const PRECACHE_ASSETS = [
  '/app/',
  '/app/index.html',
  '/manifest.json'
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
    return; // Let browser handle it normally
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

// ─── Push Notifications (optional future use) ──────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'YourLifeCC', {
      body: data.body || '',
      icon: '/app/icons/icon-192.png',
      badge: '/app/icons/icon-192.png',
      data: { url: data.url || '/app/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/app/')
  );
});
