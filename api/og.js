// /api/og — dynamic OG image generator (1200×630 PNG).
// Edge runtime; ESM. Powered by @vercel/og (Satori under the hood).
//
// Visual language: deep indigo→violet gradient + soft top glow,
// matching the "Enter the Well" aesthetic. Title + verse + CTA are
// the must-reads at thumbnail size; the hook line is supportive.
//
// Reads the canonical dataset at /app/js/data/quick-prayers.json so
// the OG card can never drift from the live prayer text.

import { ImageResponse } from '@vercel/og';
import PRAYERS from '../app/js/data/quick-prayers.json' assert { type: 'json' };

export const config = { runtime: 'edge' };

const WIDTH  = 1200;
const HEIGHT = 630;
const SITE_URL = 'https://yourlifecc.com';

// Fallback OG card when no id or an unknown id is requested.
const FALLBACK = {
  topic: 'The Well',
  title: 'Prayers for real life',
  hook:  "Borrow a prayer when you don't have your own. Free in The Well.",
  verse: ''
};

function firstSentence(text, maxLen) {
  if (!text) return '';
  const m = String(text).match(/^[^.!?]+[.!?]/);
  let s = (m ? m[0] : String(text)).trim();
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen - 1).trim() + '…';
  return s;
}

// Load a Google Font weight via the standard /css2 dance: fetch the
// CSS, extract the woff2 URL inside, fetch the binary. Vercel's own
// @vercel/og examples use this pattern; works on the Edge runtime.
async function loadFont(family, weight) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, {
    headers: {
      // Sending a modern UA gets us the woff2 source; without it
      // Google Fonts may serve a different format.
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }).then(r => r.text());
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]woff2['"]\)/);
  if (!match) throw new Error(`Font URL not found for ${family} ${weight}`);
  const fontUrl = match[1].replace(/^['"]|['"]$/g, '');
  return fetch(fontUrl).then(r => r.arrayBuffer());
}

export default async function handler(req) {
  let id = '';
  try {
    id = (new URL(req.url)).searchParams.get('id') || '';
  } catch (_) {}

  const prayer = id ? PRAYERS.find(p => p && p.id === id) : null;
  const data = prayer
    ? {
        topic: prayer.topic || 'The Well',
        title: prayer.title,
        hook:  firstSentence(prayer.text, 120),
        verse: prayer.verse || ''
      }
    : FALLBACK;

  // Two weights of Inter = clean hierarchy without a second font
  // fetch. Italic emphasis on the hook line is done via Satori's
  // fontStyle: 'italic' even though the file is Roman; Satori
  // simulates italic by slanting glyphs, which reads acceptably for
  // a serif-style hook at this size.
  const [interBold, interMedium] = await Promise.all([
    loadFont('Inter', 800),
    loadFont('Inter', 500)
  ]);

  const tree = {
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
        // Faint diagonal light shaft over the gradient — a soft
        // "Enter the Well" cue without the heavy canvas animation.
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
        // Wordmark (top)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#cdb9ff',
              opacity: 0.85
            },
            children: 'YourLife · The Well'
          }
        },
        // Topic chip
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
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.24em',
              textTransform: 'uppercase'
            },
            children: data.topic
          }
        },
        // Title — the headline read
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
        // Hook — supportive first sentence
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              marginTop: 28,
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.45,
              fontStyle: 'italic',
              color: '#cdb9ff',
              maxWidth: 1040
            },
            children: data.hook
          }
        },
        // Spacer so verse + CTA sit at the bottom
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: 1
            }
          }
        },
        // Verse reference — gold, bold
        data.verse
          ? {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#fbbf24'
                },
                children: data.verse
              }
            }
          : { type: 'div', props: { style: { display: 'flex' } } },
        // CTA bar — full-width pill at the bottom
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
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '0.01em'
            },
            children: '🙏  Enter the Well — free at yourlifecc.com/faith'
          }
        }
      ]
    }
  };

  return new ImageResponse(tree, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Inter', data: interBold,   weight: 800, style: 'normal' },
      { name: 'Inter', data: interMedium, weight: 500, style: 'normal' }
    ],
    headers: {
      // 1 hour at the edge, served stale up to 1 day while
      // revalidating. OG crawlers respect these.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

// Silences any lint that wants the helper used elsewhere too.
export { firstSentence, SITE_URL };
