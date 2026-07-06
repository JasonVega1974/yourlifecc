// api/youtube-feed.js
// Live feed for the Bible Project video archive surface. Fetches the
// channel's latest uploads (search.list) + a playlist (playlistItems.list)
// via the YouTube Data API v3 and returns them as JSON.
//
// SELF-ENABLING: if YOUTUBE_API_KEY is not set in the Vercel env, returns
// { enabled:false, videos:[], playlist:[] } with a 200 (never an error) so
// the client silently shows the curated playlist only.
//
// CACHING (Fix 3): only a DATA-BEARING response is edge-cached for 6h. The
// disabled/empty/error responses are 'no-store' — otherwise a stale
// 'disabled' response cached while the key was missing could stick at the
// edge for hours AFTER the key is added, which is exactly what kept the
// live sections from appearing.
//
// DIAGNOSE: GET /api/youtube-feed?debug=1 adds a `diag` block exposing the
// upstream error reason per source (e.g. an invalid/referrer-restricted key
// or an exceeded quota) without ever leaking the key itself.
//
// Environment variable (Vercel → Settings → Environment Variables):
//   YOUTUBE_API_KEY — a Google Cloud API key with "YouTube Data API v3"
//   ENABLED (console.cloud.google.com) and NO HTTP-referrer restriction
//   (server-side calls send no referrer; use "None" or an IP restriction).
//   Changing env vars requires a redeploy to take effect.
//
// CommonJS on purpose — this deploy has 502'd on ESM before.

const https = require('https');

const CHANNEL_ID  = 'UCVfwlh9XpX2Y_tQfjeln9QA';                 // BibleProject
const PLAYLIST_ID = 'PLH0Szn1yYNedhbJcKSQbpwGmmk7fhwTyL';       // BibleProject playlist

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    // Do NOT 6h-cache the disabled state — see the CACHING note above.
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ enabled: false, videos: [], playlist: [] });
  }

  const channelUrl = 'https://www.googleapis.com/youtube/v3/search'
    + '?key=' + encodeURIComponent(key)
    + '&channelId=' + CHANNEL_ID
    + '&part=snippet&order=date&type=video&maxResults=12';
  const playlistUrl = 'https://www.googleapis.com/youtube/v3/playlistItems'
    + '?key=' + encodeURIComponent(key)
    + '&playlistId=' + encodeURIComponent(PLAYLIST_ID)
    + '&part=snippet&maxResults=25';

  // Both in parallel; each degrades to [] (with a captured reason) on error.
  const results = await Promise.all([
    fetchSource(channelUrl, mapSearch),
    fetchSource(playlistUrl, mapPlaylist)
  ]);
  const videos   = results[0].items;
  const playlist = results[1].items;
  const hasData  = videos.length > 0 || playlist.length > 0;

  // Cache real data for 6h (playlistItems = 1 quota unit, search = 100, so a
  // 6h cache keeps us well within quota). Empty/error responses stay fresh.
  res.setHeader('Cache-Control', hasData
    ? 's-maxage=21600, stale-while-revalidate=86400'
    : 'no-store');

  const body = { enabled: true, videos: videos, playlist: playlist };
  if (req && req.query && (req.query.debug === '1' || req.query.debug === 'true')) {
    body.diag = { videosError: results[0].error, playlistError: results[1].error, hasData: hasData };
  }
  return res.status(200).json(body);
};

// One source: fetch, detect HTTP/API errors, map on success, capture reason.
async function fetchSource(url, mapFn) {
  try {
    const r = await getJson(url);
    const d = r.data;
    if (r.status !== 200 || (d && d.error)) {
      const msg = (d && d.error && (d.error.message || d.error.status)) || ('http_' + r.status);
      return { items: [], error: msg };
    }
    return { items: mapFn(d), error: null };
  } catch (e) {
    return { items: [], error: 'fetch_failed' };
  }
}

// search.list items: id.videoId + snippet
function mapSearch(data) {
  if (!data || !Array.isArray(data.items)) return [];
  return data.items
    .filter(function (it) { return it && it.id && it.id.videoId; })
    .map(function (it) { return shape(it.id.videoId, it.snippet); });
}

// playlistItems.list items: snippet.resourceId.videoId + snippet
function mapPlaylist(data) {
  if (!data || !Array.isArray(data.items)) return [];
  return data.items
    .filter(function (it) {
      var rid = it && it.snippet && it.snippet.resourceId;
      // Skip private/deleted entries YouTube leaves in playlists.
      return rid && rid.videoId && (it.snippet.title || '').toLowerCase() !== 'private video'
        && (it.snippet.title || '').toLowerCase() !== 'deleted video';
    })
    .map(function (it) { return shape(it.snippet.resourceId.videoId, it.snippet); });
}

function shape(videoId, sn) {
  sn = sn || {};
  var th = sn.thumbnails || {};
  var pick = th.medium || th.high || th.default || {};
  return {
    youtubeId:   videoId,
    title:       sn.title || '',
    publishedAt: sn.publishedAt || '',
    thumb:       pick.url || ''
  };
}

// Resolve { status, data } so callers can see non-200 + Google error bodies.
function getJson(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (r) {
      var body = '';
      r.on('data', function (c) { body += c; });
      r.on('end', function () {
        var data = null;
        try { data = JSON.parse(body); } catch (_e) {}
        resolve({ status: r.statusCode, data: data });
      });
    }).on('error', reject);
  });
}
