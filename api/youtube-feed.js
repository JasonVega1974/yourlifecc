// api/youtube-feed.js
// Live feed for the Bible Project video archive surface.
//   - Channel "latest uploads" via playlistItems.list on the channel's
//     auto-generated UPLOADS playlist. Every channel has one; its id is the
//     channel id with the 'UC' prefix swapped for 'UU'. This needs no OAuth
//     and costs 1 quota unit — it replaces both the 100-unit search.list
//     (which 403'd: "caller does not have permission" on the free tier) and
//     the extra channels.list hop.
//   - The old hand-picked playlist (PLH0Szn1…) 404'd (deleted or private),
//     so the curated live-playlist section is retired. The response still
//     returns `playlist: []` and the archive UI hides that section
//     gracefully — one live feed now (latest uploads), two archive sections
//     (Featured curated from VIDEO_ARCHIVE + New from Bible Project).
//
// SELF-ENABLING: if YOUTUBE_API_KEY is unset, returns { enabled:false,
// videos:[], playlist:[] } (200, never an error) so the client shows the
// curated set only.
//
// CACHING: only a data-bearing response is edge-cached 6h; empty/error
// responses are 'no-store' so nothing stale gets pinned at the edge.
//
// DIAGNOSE (raw YouTube state, no key leak):
//   GET /api/youtube-feed?debug=1
// adds a `diag` block with the API method, HTTP status, any Google error
// message + reason, item count, and totalResults — enough to tell apart a
// wrong playlist id (404 playlistNotFound), a restricted key (403 + reason),
// and an exceeded quota (403 quotaExceeded).
//
// KEY REQUIREMENTS (Google Cloud console): YouTube Data API v3 must be
// ENABLED, and the key must NOT be HTTP-referrer-restricted (server calls
// send no referrer — use "None" or an IP restriction), and if the key has
// API restrictions, YouTube Data API v3 must be in the allow-list. Env-var
// changes require a redeploy to take effect.
//
// CommonJS on purpose — this deploy has 502'd on ESM before.

const https = require('https');

// BibleProject channel UCVfwlh9XpX2Y_tQfjeln9QA → uploads playlist (UC → UU).
const UPLOADS_ID = 'UUVfwlh9XpX2Y_tQfjeln9QA';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const debug = !!(req && req.query && (req.query.debug === '1' || req.query.debug === 'true'));

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ enabled: false, videos: [], playlist: [], keyPresent: false });
  }

  const up = await fetchUploads(key);
  const videos  = up.items;
  const hasData = videos.length > 0;

  res.setHeader('Cache-Control', hasData
    ? 's-maxage=21600, stale-while-revalidate=86400'
    : 'no-store');

  const body = { enabled: true, videos: videos, playlist: [] };
  if (debug) body.diag = { uploads: up.diag };
  return res.status(200).json(body);
};

// Latest uploads via playlistItems.list on the UU uploads playlist.
// No channels.list, no search.list, no OAuth — free-tier safe.
async function fetchUploads(key) {
  const url = api('playlistItems', { playlistId: UPLOADS_ID, part: 'snippet', maxResults: 12 }, key);
  const r = await getJson(url);
  const diag = diagOf('uploads.playlistItems', r);
  diag.playlistId = UPLOADS_ID;
  if (r.status !== 200 || errOf(r)) return { items: [], diag: diag };
  return { items: mapPlaylist(r.data), diag: diag };
}

// playlistItems.list items: snippet.resourceId.videoId + snippet.
function mapPlaylist(data) {
  if (!data || !Array.isArray(data.items)) return [];
  return data.items
    .filter(function (it) {
      var rid = it && it.snippet && it.snippet.resourceId;
      var title = (it && it.snippet && it.snippet.title || '').toLowerCase();
      // Skip private/deleted entries YouTube leaves in playlists.
      return rid && rid.videoId && title !== 'private video' && title !== 'deleted video';
    })
    .map(function (it) { return shape(it.snippet.resourceId.videoId, it.snippet); });
}

function shape(videoId, sn) {
  sn = sn || {};
  var th = sn.thumbnails || {};
  var pick = th.medium || th.high || th.default || {};
  return { youtubeId: videoId, title: sn.title || '', publishedAt: sn.publishedAt || '', thumb: pick.url || '' };
}

// ── helpers ──────────────────────────────────────────────
function api(method, params, key) {
  var qs = 'key=' + encodeURIComponent(key);
  Object.keys(params).forEach(function (k) { qs += '&' + k + '=' + encodeURIComponent(params[k]); });
  return 'https://www.googleapis.com/youtube/v3/' + method + '?' + qs;
}

function errOf(r) {
  return (r.data && r.data.error) ? (r.data.error.message || r.data.error.status || 'api_error') : null;
}

// Compact, key-safe snapshot of one upstream call for ?debug=1.
function diagOf(label, r) {
  var d = { call: label, httpStatus: r.status, error: errOf(r) };
  if (r.data) {
    if (Array.isArray(r.data.items)) d.itemCount = r.data.items.length;
    if (r.data.pageInfo && typeof r.data.pageInfo.totalResults === 'number') d.totalResults = r.data.pageInfo.totalResults;
    var sample = path(r.data, ['items', 0, 'snippet', 'title']);
    if (sample) d.sampleTitle = sample;
    var reason = path(r.data, ['error', 'errors', 0, 'reason']);
    if (reason) d.reason = reason;
  }
  return d;
}

function path(obj, keys) {
  for (var i = 0; i < keys.length; i++) { if (obj == null) return undefined; obj = obj[keys[i]]; }
  return obj;
}

// Resolve { status, data } so callers can see non-200 + Google error bodies.
function getJson(url) {
  return new Promise(function (resolve) {
    https.get(url, function (r) {
      var body = '';
      r.on('data', function (c) { body += c; });
      r.on('end', function () {
        var data = null;
        try { data = JSON.parse(body); } catch (_e) {}
        resolve({ status: r.statusCode, data: data });
      });
    }).on('error', function () { resolve({ status: 0, data: null }); });
  });
}
