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

const CHANNEL_ID = 'UCVfwlh9XpX2Y_tQfjeln9QA'; // BibleProject

module.exports = async (req, res) => {
  // Cache at the edge for 6h regardless of enabled/disabled, so the
  // disabled state is cheap too and we stay well under the API quota.
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
  res.setHeader('Content-Type', 'application/json');

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    // Part B not provisioned — client uses curated playlist only.
    return res.status(200).json({ enabled: false, videos: [] });
  }

  try {
    const url = 'https://www.googleapis.com/youtube/v3/search'
      + '?key=' + encodeURIComponent(key)
      + '&channelId=' + CHANNEL_ID
      + '&part=snippet&order=date&type=video&maxResults=12';
    const data = await getJson(url);

    if (!data || !Array.isArray(data.items)) {
      return res.status(200).json({ enabled: false, videos: [], error: 'bad_upstream' });
    }

    const videos = data.items
      .filter(function (it) { return it && it.id && it.id.videoId; })
      .map(function (it) {
        const sn = it.snippet || {};
        const th = sn.thumbnails || {};
        const pick = th.medium || th.high || th.default || {};
        return {
          youtubeId:   it.id.videoId,
          title:       sn.title || '',
          publishedAt: sn.publishedAt || '',
          thumb:       pick.url || ''
        };
      });

    return res.status(200).json({ enabled: true, videos: videos });
  } catch (e) {
    // On any upstream failure act like disabled — the client already
    // treats that as "show curated only", so no error ever surfaces.
    return res.status(200).json({ enabled: false, videos: [], error: 'fetch_failed' });
  }
};

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
