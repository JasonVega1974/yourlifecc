// YourLifeCC Service Worker
// Version bump this string whenever you deploy a major update
// to force old caches to clear.
const CACHE_NAME = 'yourlifecc-v503';

// Core assets to pre-cache on install — the app shell + key Well modules
// + the shared modal/save/share + prayer focus + Quick Prayer library
// modules + the canonical prayer dataset (now JSON, shared with /api)
// + the Command Center home (Constellation hero for full-app users).
// IMPORTANT: list only canonical, non-redirecting URLs here.
// Vercel's `/app -> /app/index.html` is an INTERNAL rewrite (no HTTP
// redirect), so `/app` is safe. Do NOT list `/app/` or `/app/index.html`
// here — if either becomes a server-side redirect (trailingSlash:false
// or a permanent redirect rule), the cached response gets
// `redirected:true` and the SW would strand navigation handlers.
const PRECACHE_ASSETS = [
  '/app',
  '/manifest.json',
  '/app/css/app.css',
  '/app/js/init.js',
  '/app/js/lazy-data.js',
  '/app/js/faith.js',
  '/app/js/bible-study-data.js',
  '/app/js/ui.js',
  '/app/js/sync.js',
  '/app/js/activity-log.js',
  '/app/js/family-feed.js',
  '/app/js/streaks.js',
  '/app/js/xp.js',
  '/app/js/xp-juice.js',
  '/app/js/exercise-engine.js',
  '/app/js/sfx.js',
  '/app/js/haptics.js',
  '/app/js/lesson-renderer.js',
  '/app/js/data/lesson-specs.js',
  '/app/js/modal-actions.js',
  '/app/js/prayer-focus.js',
  '/app/js/quick-prayers.js',
  '/app/js/command-center.js',
  '/app/js/constellation-kit.js',
  '/app/js/parent-celestial.js',
  '/app/js/parent-watch-scene.js',
  '/app/js/data/quick-prayers.js',
  '/app/js/data/quick-prayers.json',
  '/app/js/data/money-lessons.js',
  '/app/js/data/chore-packs.js',
  // The Story scrollytelling (2026-07-05) — module + its data source,
  // precached for offline parity.
  '/app/js/jesus-story.js',
  '/app/js/data/jesus-data.js',
  // W3-3 "The Path" (2026-07-05) — READING_PLANS data, precached so
  // the day-path/plan content survives a cold offline start.
  '/app/js/data/reading-plans.js',
  // ACTS Guided Prayer Journey (Wave 2 §2a) — module + starter data.
  '/app/js/acts-journey.js',
  '/app/js/data/acts-starters.js',
  // The Odds Machine (Proof & Prophecy §4a) — module + data.
  '/app/js/odds-machine.js',
  '/app/js/data/odds-machine.js',
  // Skeptic vs Evidence (Proof & Prophecy §4b) — module + data.
  '/app/js/skeptic-debates.js',
  '/app/js/data/skeptic-debates.js',
  // My Walk with God pathway (dark launch) — precached for offline parity.
  '/app/js/data/walk-stations-data.js',
  '/app/js/walk-path.js',
  '/app/js/walk-story.js',
  // My Walk two-tab shell (2026-07-07) — Pathway + My Faith Life.
  '/app/js/my-walk-tabs.js',
  // Contextual faith videos — data + renderer + full-screen player.
  '/app/js/data/faith-videos.js',
  '/app/js/faith-videos.js',
  '/app/js/video-player.js',
  // Bible Project video archive — curated data + renderer (live feed is
  // network-only via /api/youtube-feed; curated works fully offline).
  '/app/js/data/video-archive-data.js',
  '/app/js/video-archive.js',
  '/app/js/walk-quest-hooks.js',
  // My Climb pathway (dark launch) — precached for offline parity.
  '/app/js/data/life-stations-data.js',
  '/app/js/life-path.js'
];

// ─── Install ───────────────────────────────────────────────────────────────
// Pre-cache the app shell so it loads instantly on repeat visits.
// Uses Promise.allSettled + per-URL cache.add (NOT cache.addAll) so that a
// single failure (404, redirect, network blip) doesn't void the whole
// precache — addAll is all-or-nothing, which previously left the cache
// empty whenever one URL went bad.
//
// Self-activation (2026-06-10): skipWaiting() fires SYNCHRONOUSLY at the
// top of the handler, NOT chained after precache. iOS standalone PWAs
// fire updatefound unreliably and can't be counted on to send the page-
// side SKIP_WAITING message; an eager skipWaiting also means we don't
// stall in "waiting" state if precache hangs on a missing asset or a
// network blip. The fetch handler is network-first for app code, so the
// brief window before precache completes is safe.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(PRECACHE_ASSETS.map(u => cache.add(u))).then(results => {
        results.forEach((r, i) => {
          if (r.status === 'rejected') {
            console.warn('[SW] Precache miss:', PRECACHE_ASSETS[i], r.reason);
          }
        });
      })
    )
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
// Self-activation (2026-06-10): clients.claim() fires FIRST so the new SW
// takes control of any open page/PWA immediately. The page-side
// controllerchange listener (in app/index.html) then auto-reloads onto
// the fresh assets without waiting for the user to close + reopen.
// Old-cache cleanup runs after, in the same waitUntil chain so the SW
// stays alive until both finish.
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim().then(() =>
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        )
      )
    )
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

  // For navigation (HTML page loads) — network first, fallback to shell.
  //
  // CRITICAL: per the Service Worker spec, a navigation response MUST NOT
  // have `redirected:true`. If we let `fetch(...)` follow a server redirect
  // and hand the resulting Response straight to event.respondWith(), the
  // browser aborts the navigation with NetworkError — that's how the brief
  // /app/index.html -> /app redirect stranded SW-controlled clients.
  //
  // When we detect a followed redirect, rebuild the Response from the
  // decoded body. Only Content-Type is carried over — copying the original
  // headers would propagate content-encoding / content-length values that
  // describe the ENCODED payload, which would corrupt the decoded blob.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.redirected) {
            return response.blob().then(body => new Response(body, {
              status: response.status,
              statusText: response.statusText,
              headers: { 'Content-Type': response.headers.get('content-type') || 'text/html' }
            }));
          }
          // Clone and cache a fresh copy
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() =>
          // Offline fallback — serve cached app shell. caches.match returns
          // a Promise (always truthy), so chain via .then() rather than ||.
          caches.match('/app').then(r => r || caches.match('/app/index.html'))
        )
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
