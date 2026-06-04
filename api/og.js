// /api/og — dynamic OG image generator (1200×630 PNG).
// Edge runtime; ESM. Powered by @vercel/og (Satori under the hood).
//
// Visual language: deep indigo→violet gradient + soft top glow,
// matching the "Enter the Well" aesthetic. Title + verse + CTA are
// the must-reads at thumbnail size; the hook line is supportive.
//
// Reads the canonical dataset at /app/js/data/quick-prayers.json so
// the OG card can never drift from the live prayer text.
//
// Why a runtime fetch and not an `import ... assert { type: 'json' }`?
//   - JSON import attributes (assert / with) are inconsistent across
//     Vercel Edge runtime versions and caused this function to fail on
//     the preview deploy. A plain HTTP fetch against the same-origin
//     static file is well-supported on every Edge runtime release.
//   - The fetched JSON is cached in module scope, so the cost is one
//     extra request per cold start per Edge instance.

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const WIDTH  = 1200;
const HEIGHT = 630;

// Fallback OG card when no id or an unknown id is requested.
const FALLBACK = {
  topic: 'The Well',
  title: 'Prayers for real life',
  hook:  "Borrow a prayer when you don't have your own. Free in The Well.",
  verse: ''
};

// ── helpers ──────────────────────────────────────────────────────

function firstSentence(text, maxLen) {
  if (!text) return '';
  const m = String(text).match(/^[^.!?]+[.!?]/);
  let s = (m ? m[0] : String(text)).trim();
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen - 1).trim() + '…';
  return s;
}

// Derive the canonical site URL for this request. Order:
//   1. SITE_URL env var (explicit override for production)
//   2. VERCEL_URL env var (preview deploys — Vercel provides host only)
//   3. The request's own origin (works on any preview, even when env
//      vars aren't injected into the Edge runtime)
function baseUrlFor(req) {
  try {
    const explicit =
      (typeof process !== 'undefined' && process.env && process.env.SITE_URL) || '';
    if (explicit) return explicit.replace(/\/+$/, '');
  } catch (_) {}
  try {
    const vercel =
      (typeof process !== 'undefined' && process.env && process.env.VERCEL_URL) || '';
    if (vercel) return 'https://' + vercel.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  } catch (_) {}
  try {
    const u = new URL(req.url);
    return u.origin;
  } catch (_) {}
  return 'https://yourlifecc.com';
}

// Runtime fetch of the canonical JSON. Cached at module scope so the
// dataset is fetched at most once per Edge instance cold start. On
// transient failure the cache is cleared so the next request can retry.
let _prayersPromise = null;
function loadPrayers(origin) {
  if (_prayersPromise) return _prayersPromise;
  const url = origin + '/app/js/data/quick-prayers.json';
  _prayersPromise = fetch(url, { cache: 'force-cache' })
    .then(r => {
      if (!r.ok) throw new Error('prayers fetch ' + r.status + ' from ' + url);
      return r.json();
    })
    .then(arr => Array.isArray(arr) ? arr : [])
    .catch(err => {
      _prayersPromise = null;
      console.warn('[api/og] prayers load failed:', err && err.message || err);
      return [];
    });
  return _prayersPromise;
}

// Hardened Google Fonts loader. The previous one would throw "Font URL
// not found" when Google Fonts returned a CSS shape that didn't match
// the rigid `src: url(...) format('woff2')` regex — multi-subset
// responses, single-line CSS, or any shape change cause the regex to
// miss. This version:
//   • Sends a modern desktop UA so Google returns woff2 (not woff).
//   • Globally scans every woff2 URL in the CSS regardless of how the
//     `format()` suffix is written.
//   • Tries each candidate URL until one returns 200, instead of
//     committing to the first match.
//   • Surfaces the real cause when every attempt fails.
async function loadGoogleFont(family, weight) {
  const cssUrl =
    'https://fonts.googleapis.com/css2?family=' +
    encodeURIComponent(family) + ':wght@' + weight + '&display=swap';
  const res = await fetch(cssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) {
    throw new Error('Google Fonts CSS HTTP ' + res.status + ' for ' + family + '@' + weight);
  }
  const css = await res.text();
  const urls = [];
  const re = /url\((https:\/\/[^)]+\.woff2)\)/g;
  let m;
  while ((m = re.exec(css))) urls.push(m[1]);
  if (!urls.length) {
    throw new Error(
      'No woff2 URL in Google Fonts CSS for ' + family + '@' + weight +
      ' (head: ' + css.slice(0, 120).replace(/\s+/g, ' ') + ')'
    );
  }
  const errors = [];
  for (const u of urls) {
    try {
      const r = await fetch(u);
      if (r.ok) return await r.arrayBuffer();
      errors.push(u + ' -> ' + r.status);
    } catch (e) {
      errors.push(u + ' -> ' + (e && e.message || e));
    }
  }
  throw new Error(
    'Every woff2 fetch failed for ' + family + '@' + weight +
    ': ' + errors.join('; ')
  );
}

// ── handler ──────────────────────────────────────────────────────

export default async function handler(req) {
  const origin = baseUrlFor(req);

  let id = '';
  try {
    id = (new URL(req.url)).searchParams.get('id') || '';
  } catch (_) {}

  // Body of work wrapped so any failure (font, JSON, render) lands in
  // a single catch and returns a graceful fallback PNG instead of 500.
  try {
    const PRAYERS = await loadPrayers(origin);
    const prayer = id ? PRAYERS.find(p => p && p.id === id) : null;
    const data = prayer
      ? {
          topic: prayer.topic || 'The Well',
          title: prayer.title,
          hook:  firstSentence(prayer.text, 120),
          verse: prayer.verse || ''
        }
      : FALLBACK;

    const [interBold, interMedium] = await Promise.all([
      loadGoogleFont('Inter', 800),
      loadGoogleFont('Inter', 500)
    ]);

    return new ImageResponse(buildTree(data), {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Inter', data: interBold,   weight: 800, style: 'normal' },
        { name: 'Inter', data: interMedium, weight: 500, style: 'normal' }
      ],
      headers: {
        'Cache-Control':
          'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    console.error('[api/og] render failed:', err && err.message || err);
    // Try a minimal text-only fallback so crawlers still get a PNG.
    // If even the fallback font fails, surface a real 500 so the error
    // is visible in logs (we don't want to swallow it silently).
    try {
      const fontData = await loadGoogleFont('Inter', 800);
      return new ImageResponse(buildFallbackTree(), {
        width: WIDTH,
        height: HEIGHT,
        fonts: [{ name: 'Inter', data: fontData, weight: 800, style: 'normal' }],
        headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' }
      });
    } catch (fontErr) {
      console.error('[api/og] fallback font failed:', fontErr && fontErr.message || fontErr);
      return new Response('og render failed: ' + (err && err.message || 'unknown'), {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  }
}

// ── visual tree ──────────────────────────────────────────────────

function buildTree(data) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '72px 80px',
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.32) 0%, rgba(11,16,36,0) 60%),' +
          ' linear-gradient(135deg, #0b1024 0%, #1a1240 65%, #0a0d1a 100%)',
        color: '#f5f3ff',
        fontFamily: 'Inter'
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              background:
                'linear-gradient(135deg, rgba(167,139,250,0) 35%, rgba(167,139,250,0.12) 50%, rgba(167,139,250,0) 65%)'
            }
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 22, fontWeight: 800,
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: '#cdb9ff', opacity: 0.85
            },
            children: 'YourLife · The Well'
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignSelf: 'flex-start',
              marginTop: 40,
              padding: '10px 22px',
              borderRadius: 999,
              background: 'rgba(167,139,250,0.18)',
              border: '1px solid rgba(167,139,250,0.5)',
              color: '#e9defe',
              fontSize: 22, fontWeight: 800,
              letterSpacing: '0.24em', textTransform: 'uppercase'
            },
            children: data.topic
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              marginTop: 30,
              fontSize: data.title.length > 26 ? 76 : 92,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: '#fefbff',
              maxWidth: 1040
            },
            children: data.title
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              marginTop: 28,
              fontSize: 30, fontWeight: 500, lineHeight: 1.45,
              fontStyle: 'italic',
              color: '#cdb9ff',
              maxWidth: 1040
            },
            children: data.hook
          }
        },
        { type: 'div', props: { style: { display: 'flex', flex: 1 } } },
        data.verse
          ? {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontSize: 38, fontWeight: 800,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#fbbf24'
                },
                children: data.verse
              }
            }
          : { type: 'div', props: { style: { display: 'flex' } } },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              marginTop: 32,
              padding: '22px 34px',
              borderRadius: 18,
              background:
                'linear-gradient(135deg, rgba(167,139,250,0.22) 0%, rgba(124,58,237,0.18) 100%)',
              border: '1px solid rgba(167,139,250,0.45)',
              color: '#f5f3ff',
              fontSize: 30, fontWeight: 800,
              letterSpacing: '0.01em'
            },
            children: '🙏  Enter the Well — free at yourlifecc.com/faith'
          }
        }
      ]
    }
  };
}

function buildFallbackTree() {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px', height: '630px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px',
        background: 'linear-gradient(135deg, #0b1024, #1a1240)',
        color: '#f5f3ff', fontFamily: 'Inter', textAlign: 'center'
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 64, fontWeight: 800, marginBottom: 24
            },
            children: 'YourLife · The Well'
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 32, color: '#cdb9ff'
            },
            children: 'Prayers for real life — free at yourlifecc.com/faith'
          }
        }
      ]
    }
  };
}

export { firstSentence, baseUrlFor };
