// /api/prayer-share — server-rendered landing page for /prayer/:id.
// CommonJS, Node runtime — matches the rest of /api/* (CLAUDE.md
// warns ESM here has caused 502s on this deploy).
//
// Reads the canonical dataset at /app/js/data/quick-prayers.json
// (same file the browser and /api/og use), so a shared card can
// never drift from the live prayer.
//
// The crawler/share path:
//   1. User shares https://yourlifecc.com/prayer/p_anx (URL built by
//      the prayer card's Share action via YLM.share).
//   2. Facebook/Slack/iMessage/etc. fetch the URL and parse the OG
//      tags in the HEAD of the response we return here.
//   3. The OG image points at /api/og?id=p_anx, which renders the
//      dynamic 1200×630 PNG.
//   4. A human who taps the link sees the full prayer + the "Enter
//      the Well — free" CTA driving to /faith.
//
// Vercel rewrite: /prayer/:id → /api/prayer-share?id=:id
// (defined in vercel.json).

const PRAYERS = require('../app/js/data/quick-prayers.json');

const SITE_URL = 'https://yourlifecc.com';
const CTA_URL  = SITE_URL + '/faith';

const FALLBACK = {
  id:    '',
  topic: 'The Well',
  title: 'Prayers for real life',
  verse: '',
  text:  ''
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function firstSentence(text, maxLen) {
  if (!text) return '';
  var m = String(text).match(/^[^.!?]+[.!?]/);
  var s = (m ? m[0] : String(text)).trim();
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen - 1).trim() + '…';
  return s;
}

function renderHtml(p, opts) {
  var isValid = !!opts.isValid;
  var canonical = isValid ? SITE_URL + '/prayer/' + p.id : SITE_URL + '/faith';
  var ogImage   = SITE_URL + '/api/og' + (isValid ? '?id=' + encodeURIComponent(p.id) : '');
  var ogDesc    = isValid
    ? firstSentence(p.text, 200)
    : "Borrow a prayer when you don't have your own — 30+ real prayers, free in The Well.";
  var ogTitle   = isValid ? (p.title + ' — A prayer for ' + p.topic) : 'Prayers for real life — YourLife · The Well';

  // Break the full text into paragraphs at double newlines, then at
  // sentence boundaries inside long runs, so the read scrolls
  // comfortably on mobile.
  var paragraphs = isValid
    ? String(p.text).split(/\n\n+/).map(function (para) {
        return '<p class="qp-para">' + esc(para.trim()) + '</p>';
      }).join('\n        ')
    : '';

  var bodyContent = isValid
    ? (
        '<header class="hero">' +
          '<span class="chip">' + esc(p.topic) + '</span>' +
          '<h1 class="title">' + esc(p.title) + '</h1>' +
          '<div class="verse">' + esc(p.verse) + '</div>' +
        '</header>' +
        '<article class="prayer">' +
          paragraphs +
        '</article>'
      )
    : (
        '<header class="hero">' +
          '<span class="chip">' + esc('The Well') + '</span>' +
          '<h1 class="title">Prayers for real life</h1>' +
          '<div class="verse">A prayer when you don\'t have your own</div>' +
        '</header>' +
        '<article class="prayer">' +
          '<p class="qp-para">' +
            'We couldn\'t find that specific prayer, but The Well has 30+ ' +
            'prayers across anxiety, school, forgiveness, identity, grief, ' +
            'and more — all free, no sign-up wall.' +
          '</p>' +
        '</article>'
      );

  return ''
    + '<!DOCTYPE html>\n'
    + '<html lang="en">\n'
    + '<head>\n'
    + '  <meta charset="UTF-8">\n'
    + '  <meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + '  <title>' + esc(ogTitle) + '</title>\n'
    + '  <meta name="description" content="' + esc(ogDesc) + '">\n'
    + '  <link rel="canonical" href="' + esc(canonical) + '">\n'
    + '  <!-- Open Graph -->\n'
    + '  <meta property="og:type" content="article">\n'
    + '  <meta property="og:site_name" content="YourLife CC">\n'
    + '  <meta property="og:title" content="' + esc(ogTitle) + '">\n'
    + '  <meta property="og:description" content="' + esc(ogDesc) + '">\n'
    + '  <meta property="og:url" content="' + esc(canonical) + '">\n'
    + '  <meta property="og:image" content="' + esc(ogImage) + '">\n'
    + '  <meta property="og:image:width" content="1200">\n'
    + '  <meta property="og:image:height" content="630">\n'
    + '  <meta property="og:image:alt" content="' + esc(ogTitle) + '">\n'
    + '  <!-- Twitter -->\n'
    + '  <meta name="twitter:card" content="summary_large_image">\n'
    + '  <meta name="twitter:title" content="' + esc(ogTitle) + '">\n'
    + '  <meta name="twitter:description" content="' + esc(ogDesc) + '">\n'
    + '  <meta name="twitter:image" content="' + esc(ogImage) + '">\n'
    + '  <link rel="icon" href="data:,">\n'
    + '  <link rel="preconnect" href="https://fonts.googleapis.com">\n'
    + '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    + '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">\n'
    + '  <style>\n'
    + '    :root{ --bg:#0a0d1a; --bg2:#1a1233; --p:#a78bfa; --tx:#f5f3ff; --tx2:#cdb9ff; --gold:#fbbf24; }\n'
    + '    *{box-sizing:border-box;}\n'
    + '    html,body{margin:0;padding:0;background:var(--bg);color:var(--tx);font-family:Inter,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;}\n'
    + '    body{min-height:100vh;background:radial-gradient(ellipse at 50% 0%, rgba(167,139,250,.32) 0%, transparent 55%), linear-gradient(180deg, var(--bg2) 0%, var(--bg) 60%, #07070f 100%);}\n'
    + '    .wrap{max-width:42rem;margin:0 auto;padding:3.5rem 1.5rem 7rem;position:relative;}\n'
    + '    .brand{font-size:.7rem;font-weight:800;letter-spacing:.32em;text-transform:uppercase;color:var(--tx2);opacity:.85;margin-bottom:2.4rem;}\n'
    + '    .hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.85rem;margin-bottom:2.2rem;}\n'
    + '    .chip{display:inline-block;background:rgba(167,139,250,.18);border:1px solid rgba(167,139,250,.45);color:var(--tx2);padding:.32rem .85rem;border-radius:99px;font-size:.66rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase;}\n'
    + '    .title{font-family:Inter,system-ui,sans-serif;font-size:clamp(1.8rem,5.2vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.01em;color:#fdfcff;margin:0;}\n'
    + '    .verse{font-family:Inter,system-ui,sans-serif;font-size:.9rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);}\n'
    + '    .prayer{font-family:Georgia,"Times New Roman",serif;font-size:1.08rem;line-height:1.85;color:#fdfcff;}\n'
    + '    .qp-para{margin:0 0 1.1rem;}\n'
    + '    .cta-wrap{display:flex;flex-direction:column;align-items:center;gap:.5rem;margin-top:3rem;padding:2rem 1.5rem 0;border-top:1px solid rgba(167,139,250,.18);}\n'
    + '    .cta{display:inline-flex;align-items:center;gap:.5rem;background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;text-decoration:none;padding:1rem 1.8rem;border-radius:14px;font-size:1rem;font-weight:800;letter-spacing:.04em;box-shadow:0 14px 36px rgba(124,58,237,.36);transition:transform .15s, box-shadow .2s;}\n'
    + '    .cta:hover{transform:translateY(-2px);box-shadow:0 18px 44px rgba(124,58,237,.48);}\n'
    + '    .cta-sub{font-size:.82rem;color:var(--tx2);opacity:.7;margin-top:.4rem;}\n'
    + '    .footer{margin-top:3rem;text-align:center;font-size:.72rem;color:var(--tx2);opacity:.55;}\n'
    + '    .footer a{color:var(--tx2);}\n'
    + '    @media (max-width:520px){\n'
    + '      .wrap{padding:2.2rem 1.1rem 6rem;}\n'
    + '      .prayer{font-size:1.02rem;line-height:1.8;}\n'
    + '    }\n'
    + '  </style>\n'
    + '</head>\n'
    + '<body>\n'
    + '  <main class="wrap">\n'
    + '    <div class="brand">YourLife · The Well</div>\n'
    + '    ' + bodyContent + '\n'
    + '    <div class="cta-wrap">\n'
    + '      <a class="cta" href="' + esc(CTA_URL) + '">🙏 Start free — Enter the Well</a>\n'
    + '      <div class="cta-sub">30+ prayers for real life, free in The Well.</div>\n'
    + '    </div>\n'
    + '    <div class="footer">\n'
    + '      <a href="' + esc(SITE_URL) + '">yourlifecc.com</a> · A YourLife CC project\n'
    + '    </div>\n'
    + '  </main>\n'
    + '</body>\n'
    + '</html>\n';
}

module.exports = function handler(req, res) {
  var id = '';
  try {
    if (req.query && typeof req.query.id === 'string') id = req.query.id;
    else if (req.url) {
      var u = new URL(req.url, SITE_URL);
      id = u.searchParams.get('id') || '';
    }
  } catch (_) {}

  var prayer = id ? PRAYERS.find(function (p) { return p && p.id === id; }) : null;
  var isValid = !!prayer;
  var data = prayer || FALLBACK;
  var html = renderHtml(data, { isValid: isValid });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400');
  // Crawlers always get 200 OK so OG parsers don't refuse to unfurl.
  res.statusCode = 200;
  res.end(html);
};
