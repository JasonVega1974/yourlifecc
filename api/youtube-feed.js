// api/youtube-feed.js
// Live channel feed for the Bible Project video archive surface.
// Fetches the latest 12 uploads from the BibleProject channel via the
// YouTube Data API v3 and returns them as JSON, edge-cached for 6h.
//
// SELF-ENABLING: if YOUTUBE_API_KEY is not set in the Vercel env, this
// returns { enabled:false, videos:[] } with a 200 — never an error — so
// the client silently falls back to the curated playlist. Add the key
// later and the live row lights up with no code change.
//
// Environment variable (Vercel → Project → Settings → Environment
// Variables): YOUTUBE_API_KEY — a Google Cloud API key with the
// "YouTube Data API v3" enabled (console.cloud.google.com).
//
// CommonJS on purpose — this deploy has 502'd on ESM before.

const https = require('https');

const CHANNEL_ID  = 'UCVfwlh9XpX2Y_tQfjeln9QA';                 // BibleProject
const PLAYLIST_ID = 'PLH0Szn1yYNedhbJcKSQbpwGmmk7fhwTyL';       // BibleProject playlist

module.exports = async (req, res) => {
  // Cache at the edge for 6h regardless of enabled/disabled, so the
  // disabled state is cheap too and we stay well under the API quota.
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
  res.setHeader('Content-Type', 'application/json');

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    // Part B not provisioned — client uses curated playlist only.
    return res.status(200).json({ enabled: false, videos: [], playlist: [] });
  }

  // Fetch the channel's latest uploads (search.list) and the playlist
  // (playlistItems.list) in parallel. Each falls back to [] on failure,
  // so one hiccup never blanks the whole surface.
  const channelUrl = 'https://www.googleapis.com/youtube/v3/search'
    + '?key=' + encodeURIComponent(key)
    + '&channelId=' + CHANNEL_ID
    + '&part=snippet&order=date&type=video&maxResults=12';
  const playlistUrl = 'https://www.googleapis.com/youtube/v3/playlistItems'
    + '?key=' + encodeURIComponent(key)
    + '&playlistId=' + encodeURIComponent(PLAYLIST_ID)
    + '&part=snippet&maxResults=25';

  const results = await Promise.all([
    getJson(channelUrl).then(mapSearch).catch(function () { return []; }),
    getJson(playlistUrl).then(mapPlaylist).catch(function () { return []; })
  ]);

  return res.status(200).json({ enabled: true, videos: results[0], playlist: results[1] });
};

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

function getJson(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (r) {
      let body = '';
      r.on('data', function (c) { body += c; });
      r.on('end', function () {
        try { resolve(JSON.parse(body)); }
        catch (err) { reject(err); }
      });
    }).on('error', reject);
  });
}
