/* =============================================================
   bible-stories.js — Story Mode narrative scenes (F4-G)

   Each story is an array of scenes. Each scene has its own
   hand-coded SVG illustration in the cathedral-blueprint
   aesthetic established in F4-D / F4-E (deep navy bg, gold
   accents, silhouette compositions).

   Player UI in faith.js: full-screen modal, tap to advance,
   Bible text overlay, optional Web Speech API narration.
============================================================= */

// ── Reusable scene background (sky gradient + soft star field) ──
function _bsBackdrop(opts){
  const o = opts || {};
  const skyTop = o.skyTop || '#0a0d1a';
  const skyMid = o.skyMid || '#1a1233';
  const skyBot = o.skyBot || '#3d2a5e';
  const stars  = o.stars  !== false;
  const starsHtml = stars ? `
    <radialGradient id="${o.idPrefix||'bs'}-glow" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="rgba(251,191,36,0.35)"/>
      <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
    </radialGradient>` : '';
  return `
    <defs>
      <linearGradient id="${o.idPrefix||'bs'}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyTop}"/>
        <stop offset="55%" stop-color="${skyMid}"/>
        <stop offset="100%" stop-color="${skyBot}"/>
      </linearGradient>
      ${starsHtml}
    </defs>
    <rect width="800" height="500" fill="url(#${o.idPrefix||'bs'}-sky)"/>
    ${stars ? `
      <g fill="#fef3c7" opacity="0.85">
        <circle cx="80"  cy="60"  r="0.9"/>
        <circle cx="142" cy="120" r="1.1"/>
        <circle cx="200" cy="40"  r="0.7"/>
        <circle cx="260" cy="150" r="0.9"/>
        <circle cx="340" cy="80"  r="1.0"/>
        <circle cx="420" cy="40"  r="1.2"/>
        <circle cx="500" cy="100" r="0.8"/>
        <circle cx="570" cy="60"  r="1.0"/>
        <circle cx="640" cy="130" r="0.9"/>
        <circle cx="710" cy="80"  r="1.1"/>
        <circle cx="760" cy="160" r="0.8"/>
      </g>` : ''}
  `;
}

const BIBLE_STORIES = [

  // ════════════════════════════════════════════════════════════
  // STORY 1 — The Christmas Story
  // ════════════════════════════════════════════════════════════
  {
    id: 'christmas',
    title: 'The Christmas Story',
    subtitle: 'God enters time. A virgin gives birth in Bethlehem.',
    icon: '⭐',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Luke 1-2 · Matthew 1-2',
    duration: '~8 min',
    scenes: [
      {
        id: 'announcement',
        title: 'The Annunciation',
        scriptureRef: 'Luke 1:26-38',
        bibleText: '"Greetings, you who are highly favored! The Lord is with you... You will conceive and give birth to a son, and you are to call him Jesus."',
        narration: 'It was a quiet evening in Nazareth. An angel of the Lord appeared to a young woman named Mary. The greeting troubled her. The promise terrified her. And yet she said: "I am the Lord\'s servant. May your word to me be fulfilled."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'ann'})}
          <!-- Distant Nazareth hills -->
          <path d="M 0 360 Q 150 320 300 350 T 600 340 T 800 360 L 800 500 L 0 500 Z" fill="#1e1638" opacity="0.85"/>
          <path d="M 0 400 Q 200 370 400 395 T 800 405 L 800 500 L 0 500 Z" fill="#0a0d1a" opacity="0.95"/>
          <!-- Beam of light from above -->
          <defs>
            <linearGradient id="annBeam" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="rgba(254,243,199,0.7)"/>
              <stop offset="60%" stop-color="rgba(251,191,36,0.25)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="400,0 320,500 480,500" fill="url(#annBeam)"/>
          <!-- Angel as glowing figure (top) -->
          <circle cx="400" cy="120" r="55" fill="url(#ann-glow)"/>
          <ellipse cx="400" cy="120" rx="14" ry="22" fill="#fef3c7"/>
          <path d="M 386 110 Q 360 105 348 130 M 414 110 Q 440 105 452 130" stroke="#fef3c7" stroke-width="2" fill="none" opacity="0.85"/>
          <!-- Mary kneeling silhouette (bottom-center) -->
          <g transform="translate(400 380)">
            <path d="M -22 0 Q -28 -55 0 -65 Q 28 -55 22 0 Z" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-78" rx="14" ry="18" fill="#0a0d1a"/>
            <!-- Halo hint -->
            <circle cx="0" cy="-78" r="22" fill="none" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
          </g>
          <text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Nazareth · evening</text>
        </svg>`
      },
      {
        id: 'visit',
        title: 'Mary Visits Elizabeth',
        scriptureRef: 'Luke 1:39-56',
        bibleText: '"My soul magnifies the Lord, and my spirit rejoices in God my Savior."',
        narration: 'Mary hurried to the hill country to her cousin Elizabeth. The baby in Elizabeth\'s womb leapt for joy. And Mary sang — a song that would echo through the ages. The Magnificat.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'vst', skyMid:'#241846', skyBot:'#4a3270'})}
          <!-- Hill country layers -->
          <path d="M 0 320 Q 100 280 200 310 Q 300 290 400 315 Q 500 285 620 308 Q 720 295 800 315 L 800 500 L 0 500 Z" fill="#1e1638" opacity="0.7"/>
          <path d="M 0 360 Q 150 330 320 355 Q 480 335 800 358 L 800 500 L 0 500 Z" fill="#0a0d1a" opacity="0.85"/>
          <path d="M 0 410 Q 200 390 400 405 T 800 412 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Small house in distance -->
          <g transform="translate(640 320)">
            <rect x="-22" y="-15" width="44" height="22" fill="#0a0d1a" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <polygon points="-26,-15 0,-30 26,-15" fill="#0a0d1a" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <rect x="-5" y="-8" width="10" height="15" fill="rgba(251,191,36,0.5)"/>
          </g>
          <!-- Two embracing figures (Mary and Elizabeth) -->
          <g transform="translate(380 380)">
            <!-- Elizabeth -->
            <path d="M -55 0 Q -62 -60 -32 -75 Q -2 -68 -10 0 Z" fill="#0a0d1a"/>
            <ellipse cx="-37" cy="-88" rx="14" ry="18" fill="#0a0d1a"/>
            <!-- Mary -->
            <path d="M 10 0 Q 0 -60 30 -75 Q 60 -65 55 0 Z" fill="#1a1233"/>
            <ellipse cx="35" cy="-88" rx="14" ry="18" fill="#1a1233"/>
            <!-- Embracing arms -->
            <path d="M -20 -65 Q 0 -55 25 -70" stroke="rgba(254,243,199,0.5)" stroke-width="3" fill="none"/>
            <!-- Halos -->
            <circle cx="-37" cy="-88" r="24" fill="none" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
            <circle cx="35"  cy="-88" r="24" fill="none" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
          </g>
          <!-- Soft light from sky -->
          <ellipse cx="400" cy="60" rx="180" ry="60" fill="rgba(251,191,36,0.12)"/>
          <text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Hill country of Judea</text>
        </svg>`
      },
      {
        id: 'journey',
        title: 'Journey to Bethlehem',
        scriptureRef: 'Luke 2:1-5',
        bibleText: '"And Joseph also went up from Galilee, out of the city of Nazareth, into Judea, to the city of David, which is called Bethlehem."',
        narration: 'A Roman census forced them onto the road. Eighty miles. Mary, very pregnant. Joseph at her side. The stars wheeled overhead. Bethlehem was full when they arrived.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jrn', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#2a1a44'})}
          <!-- Road curve -->
          <path d="M 0 460 Q 200 420 400 440 Q 600 460 800 430" stroke="rgba(254,243,199,0.3)" stroke-width="2" fill="none" stroke-dasharray="6 8"/>
          <!-- Distant Bethlehem on the horizon -->
          <g transform="translate(640 360)">
            <rect x="-15" y="-12" width="14" height="14" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <rect x="2" y="-18" width="14" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <rect x="20" y="-10" width="12" height="12" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <rect x="-1" y="-9" width="3" height="3" fill="rgba(251,191,36,0.7)"/>
            <rect x="6" y="-12" width="3" height="3" fill="rgba(251,191,36,0.7)"/>
          </g>
          <text x="640" y="345" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2.5" fill="rgba(251,191,36,0.7)">BETHLEHEM</text>
          <!-- Hills -->
          <path d="M 0 380 Q 200 360 400 375 Q 600 355 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Donkey + Mary + Joseph silhouettes -->
          <g transform="translate(280 430)">
            <!-- Donkey body -->
            <ellipse cx="0" cy="0" rx="32" ry="14" fill="#0a0d1a"/>
            <!-- Legs -->
            <line x1="-22" y1="10" x2="-22" y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="-10" y1="12" x2="-10" y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="10"  y1="12" x2="10"  y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="22"  y1="10" x2="22"  y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <!-- Donkey head -->
            <ellipse cx="-32" cy="-8" rx="9" ry="6" fill="#0a0d1a"/>
            <line x1="-37" y1="-13" x2="-39" y2="-19" stroke="#0a0d1a" stroke-width="3"/>
            <!-- Mary on donkey -->
            <ellipse cx="0" cy="-14" rx="10" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-32" rx="8" ry="10" fill="#1a1233"/>
            <!-- Joseph walking beside -->
            <ellipse cx="42" cy="-5" rx="7" ry="20" fill="#0a0d1a"/>
            <ellipse cx="42" cy="-32" rx="7" ry="9" fill="#0a0d1a"/>
            <!-- Walking staff -->
            <line x1="48" y1="-20" x2="56" y2="14" stroke="#0a0d1a" stroke-width="2"/>
          </g>
          <!-- Bright star -->
          <g transform="translate(640 60)">
            <circle r="3.5" fill="#fef3c7"/>
            <circle r="11" fill="rgba(251,191,36,0.4)" opacity="0.7"/>
            <line x1="0" y1="-22" x2="0" y2="22" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
            <line x1="-22" y1="0" x2="22" y2="0" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Eighty miles to the city of David</text>
        </svg>`
      },
      {
        id: 'birth',
        title: 'The Birth in Bethlehem',
        scriptureRef: 'Luke 2:6-7',
        bibleText: '"And she gave birth to her firstborn, a son. She wrapped him in cloths and placed him in a manger, because there was no guest room available for them."',
        narration: 'A stable, because no room remained. A manger, because no cradle waited. The eternal Son of God — born among the animals, wrapped in swaddling cloths. Heaven\'s King, in a feeding trough.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'brt', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e', stars:false})}
          <!-- Stars -->
          <g fill="#fef3c7" opacity="0.7">
            <circle cx="100" cy="50" r="1"/>
            <circle cx="200" cy="80" r="0.9"/>
            <circle cx="320" cy="40" r="1.1"/>
            <circle cx="450" cy="70" r="0.8"/>
            <circle cx="580" cy="55" r="1"/>
            <circle cx="700" cy="90" r="0.9"/>
          </g>
          <!-- Stable structure (silhouette of a simple wooden shelter) -->
          <g>
            <polygon points="200,250 600,250 580,170 220,170" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="1.5"/>
            <rect x="220" y="250" width="360" height="180" fill="#251607" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
            <line x1="280" y1="250" x2="280" y2="430" stroke="rgba(251,191,36,0.2)" stroke-width="1"/>
            <line x1="400" y1="250" x2="400" y2="430" stroke="rgba(251,191,36,0.2)" stroke-width="1"/>
            <line x1="520" y1="250" x2="520" y2="430" stroke="rgba(251,191,36,0.2)" stroke-width="1"/>
          </g>
          <!-- Light radiating from manger -->
          <radialGradient id="brtGlow" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
            <stop offset="40%" stop-color="rgba(251,191,36,0.45)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="350" rx="260" ry="180" fill="url(#brtGlow)"/>
          <!-- Manger -->
          <g transform="translate(400 360)">
            <path d="M -55 0 L 55 0 L 42 30 L -42 30 Z" fill="#3d2a16" stroke="#fef3c7" stroke-width="1.5"/>
            <!-- Baby in cloths -->
            <ellipse cx="0" cy="0" rx="28" ry="10" fill="#fef3c7"/>
            <ellipse cx="0" cy="-2" rx="10" ry="6" fill="#fef3c7"/>
            <!-- Halo -->
            <circle cx="0" cy="-2" r="22" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.5"/>
          </g>
          <!-- Mary (left) -->
          <g transform="translate(310 365)">
            <ellipse cx="0" cy="0" rx="14" ry="35" fill="#1a1233"/>
            <ellipse cx="0" cy="-32" rx="10" ry="13" fill="#1a1233"/>
            <circle cx="0" cy="-32" r="18" fill="none" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
          </g>
          <!-- Joseph (right) -->
          <g transform="translate(490 365)">
            <ellipse cx="0" cy="0" rx="14" ry="35" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-32" rx="10" ry="13" fill="#0a0d1a"/>
          </g>
          <!-- Animals (suggested silhouettes) -->
          <g fill="#0a0d1a" opacity="0.85">
            <ellipse cx="220" cy="385" rx="22" ry="12"/>
            <ellipse cx="200" cy="380" rx="6" ry="7"/>
            <ellipse cx="580" cy="385" rx="22" ry="12"/>
            <ellipse cx="600" cy="380" rx="6" ry="7"/>
          </g>
          <!-- Star above -->
          <g transform="translate(400 100)">
            <circle r="5" fill="#fef3c7"/>
            <line x1="0" y1="-30" x2="0" y2="30" stroke="rgba(251,191,36,0.55)" stroke-width="1.4"/>
            <line x1="-30" y1="0" x2="30" y2="0" stroke="rgba(251,191,36,0.55)" stroke-width="1.4"/>
            <line x1="-21" y1="-21" x2="21" y2="21" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <line x1="-21" y1="21" x2="21" y2="-21" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"For unto us a child is born"</text>
        </svg>`
      },
      {
        id: 'shepherds',
        title: 'Shepherds in the Field',
        scriptureRef: 'Luke 2:8-15',
        bibleText: '"Glory to God in the highest heaven, and on earth peace to those on whom his favor rests."',
        narration: 'Shepherds were keeping watch over their flocks by night. Then the sky split open with light. An angel announced. A great host of heaven sang. The first to hear of the Messiah were not kings, but the lowest workers in Judea.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'shp'})}
          <!-- Hills/fields -->
          <path d="M 0 360 Q 200 320 400 350 Q 600 320 800 350 L 800 500 L 0 500 Z" fill="#1e1638"/>
          <path d="M 0 410 Q 200 390 400 410 Q 600 390 800 410 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Brilliant sky filled with light -->
          <radialGradient id="shpHeaven" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0%" stop-color="rgba(254,243,199,0.65)"/>
            <stop offset="35%" stop-color="rgba(251,191,36,0.35)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="120" rx="380" ry="180" fill="url(#shpHeaven)"/>
          <!-- Angelic host (3 glowing figures + smaller stars of light) -->
          <g>
            <ellipse cx="320" cy="120" rx="20" ry="32" fill="rgba(254,243,199,0.85)" opacity="0.9"/>
            <ellipse cx="400" cy="100" rx="24" ry="38" fill="rgba(254,243,199,0.95)" opacity="0.95"/>
            <ellipse cx="480" cy="120" rx="20" ry="32" fill="rgba(254,243,199,0.85)" opacity="0.9"/>
            <!-- Smaller angels in background -->
            <circle cx="220" cy="140" r="8" fill="rgba(251,191,36,0.7)"/>
            <circle cx="580" cy="140" r="8" fill="rgba(251,191,36,0.7)"/>
            <circle cx="160" cy="180" r="5" fill="rgba(251,191,36,0.55)"/>
            <circle cx="640" cy="180" r="5" fill="rgba(251,191,36,0.55)"/>
          </g>
          <!-- Shepherds looking up (3 silhouettes) -->
          <g transform="translate(280 380)">
            <ellipse cx="0" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <line x1="6" y1="-14" x2="14" y2="14" stroke="#0a0d1a" stroke-width="2"/>
          </g>
          <g transform="translate(370 395)">
            <ellipse cx="0" cy="0" rx="10" ry="28" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-25" rx="9" ry="10" fill="#0a0d1a"/>
            <line x1="6" y1="-15" x2="16" y2="14" stroke="#0a0d1a" stroke-width="2.2"/>
          </g>
          <g transform="translate(450 385)">
            <ellipse cx="0" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
          </g>
          <!-- Sheep silhouettes -->
          <g fill="#0a0d1a" opacity="0.85">
            <ellipse cx="160" cy="430" rx="14" ry="9"/>
            <ellipse cx="148" cy="426" rx="5" ry="5"/>
            <ellipse cx="220" cy="425" rx="13" ry="8"/>
            <ellipse cx="210" cy="421" rx="5" ry="5"/>
            <ellipse cx="540" cy="430" rx="14" ry="9"/>
            <ellipse cx="528" cy="426" rx="5" ry="5"/>
            <ellipse cx="610" cy="425" rx="13" ry="8"/>
            <ellipse cx="598" cy="421" rx="5" ry="5"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"Behold, I bring you good news of great joy"</text>
        </svg>`
      },
      {
        id: 'wise-men',
        title: 'The Wise Men Follow the Star',
        scriptureRef: 'Matthew 2:1-12',
        bibleText: '"On coming to the house, they saw the child with his mother Mary, and they bowed down and worshiped him. Then they opened their treasures and presented him with gifts of gold, frankincense and myrrh."',
        narration: 'From the East they came — astronomers, scholars, perhaps Persian Zoroastrian priests. They followed a star they did not understand to a child they could not have predicted. They knelt anyway. They gave their best.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'wsm', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#2a1a44'})}
          <!-- Desert dunes -->
          <path d="M 0 380 Q 100 350 250 370 Q 400 340 550 365 Q 700 345 800 360 L 800 500 L 0 500 Z" fill="#1e1638" opacity="0.85"/>
          <path d="M 0 430 Q 200 410 400 425 Q 600 405 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Bright star (top right) -->
          <g transform="translate(620 80)">
            <circle r="6" fill="#fef3c7"/>
            <circle r="22" fill="rgba(251,191,36,0.45)" opacity="0.7"/>
            <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(251,191,36,0.7)" stroke-width="1.6"/>
            <line x1="-50" y1="0" x2="50" y2="0" stroke="rgba(251,191,36,0.7)" stroke-width="1.6"/>
            <line x1="-35" y1="-35" x2="35" y2="35" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
            <line x1="-35" y1="35" x2="35" y2="-35" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
            <!-- Trail of light pointing toward Bethlehem -->
            <path d="M -8 8 L -200 240" stroke="rgba(251,191,36,0.25)" stroke-width="2" fill="none"/>
          </g>
          <!-- Distant Bethlehem (lower-left) -->
          <g transform="translate(180 360)">
            <rect x="-12" y="-10" width="10" height="10" fill="#0a0d1a" stroke="rgba(251,191,36,0.4)" stroke-width="0.8"/>
            <rect x="2" y="-15" width="11" height="15" fill="#0a0d1a" stroke="rgba(251,191,36,0.4)" stroke-width="0.8"/>
            <rect x="16" y="-9" width="9" height="9" fill="#0a0d1a" stroke="rgba(251,191,36,0.4)" stroke-width="0.8"/>
          </g>
          <!-- Three camels with riders -->
          <g transform="translate(450 410)">
            <!-- Camel 1 -->
            <g transform="translate(0 0)">
              <ellipse cx="0" cy="0" rx="40" ry="14" fill="#0a0d1a"/>
              <path d="M -20 -8 Q -22 -28 -10 -28 Q -2 -28 0 -8" fill="#0a0d1a"/>
              <path d="M 12 -8 Q 14 -32 24 -32 Q 32 -32 30 -8" fill="#0a0d1a"/>
              <line x1="-30" y1="12" x2="-30" y2="32" stroke="#0a0d1a" stroke-width="4"/>
              <line x1="30" y1="12" x2="30" y2="32" stroke="#0a0d1a" stroke-width="4"/>
              <line x1="-15" y1="12" x2="-15" y2="32" stroke="#0a0d1a" stroke-width="4"/>
              <line x1="15" y1="12" x2="15" y2="32" stroke="#0a0d1a" stroke-width="4"/>
              <ellipse cx="-38" cy="-30" rx="6" ry="8" fill="#0a0d1a"/>
              <line x1="-38" y1="-38" x2="-44" y2="-50" stroke="#0a0d1a" stroke-width="3"/>
              <!-- Rider on hump -->
              <ellipse cx="20" cy="-44" rx="9" ry="14" fill="#1a1233"/>
              <ellipse cx="20" cy="-58" rx="7" ry="9" fill="#1a1233"/>
            </g>
            <!-- Camel 2 (slightly behind, higher) -->
            <g transform="translate(80 -10)">
              <ellipse cx="0" cy="0" rx="36" ry="12" fill="#0a0d1a" opacity="0.9"/>
              <path d="M -18 -7 Q -20 -25 -8 -25 Q -2 -25 0 -7" fill="#0a0d1a" opacity="0.9"/>
              <path d="M 10 -7 Q 12 -29 22 -29 Q 30 -29 28 -7" fill="#0a0d1a" opacity="0.9"/>
              <line x1="-26" y1="11" x2="-26" y2="28" stroke="#0a0d1a" stroke-width="4" opacity="0.9"/>
              <line x1="28" y1="11" x2="28" y2="28" stroke="#0a0d1a" stroke-width="4" opacity="0.9"/>
              <ellipse cx="-34" cy="-27" rx="5" ry="7" fill="#0a0d1a" opacity="0.9"/>
              <ellipse cx="18" cy="-39" rx="8" ry="13" fill="#1a1233" opacity="0.95"/>
              <ellipse cx="18" cy="-52" rx="6" ry="8" fill="#1a1233" opacity="0.95"/>
            </g>
            <!-- Camel 3 (further back, smaller) -->
            <g transform="translate(160 -18)">
              <ellipse cx="0" cy="0" rx="30" ry="10" fill="#0a0d1a" opacity="0.8"/>
              <path d="M -15 -6 Q -16 -22 -6 -22 Q -2 -22 0 -6" fill="#0a0d1a" opacity="0.8"/>
              <path d="M 8 -6 Q 10 -26 18 -26 Q 25 -26 23 -6" fill="#0a0d1a" opacity="0.8"/>
              <line x1="-22" y1="9" x2="-22" y2="24" stroke="#0a0d1a" stroke-width="3" opacity="0.8"/>
              <line x1="22" y1="9" x2="22" y2="24" stroke="#0a0d1a" stroke-width="3" opacity="0.8"/>
              <ellipse cx="-28" cy="-24" rx="4" ry="6" fill="#0a0d1a" opacity="0.8"/>
              <ellipse cx="14" cy="-35" rx="7" ry="11" fill="#1a1233" opacity="0.9"/>
              <ellipse cx="14" cy="-46" rx="5" ry="7" fill="#1a1233" opacity="0.9"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"We have seen His star in the East"</text>
        </svg>`
      },
      {
        id: 'flight',
        title: 'Flight to Egypt',
        scriptureRef: 'Matthew 2:13-15',
        bibleText: '"Get up, take the child and his mother and escape to Egypt. Stay there until I tell you, for Herod is going to search for the child to kill him."',
        narration: 'A dream warned Joseph in the night. Herod was coming. So they fled — under cover of darkness, by camel and donkey, across the desert toward Egypt. The Christ-child became a refugee.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'flt', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#1a1233', stars:false})}
          <!-- Moon -->
          <g transform="translate(640 100)">
            <circle r="40" fill="#fef3c7" opacity="0.4"/>
            <circle r="32" fill="#fef3c7"/>
            <circle r="32" fill="#1a1233"/>
            <circle cx="6" r="32" fill="#fef3c7" opacity="0.95"/>
          </g>
          <!-- Stars -->
          <g fill="#fef3c7" opacity="0.6">
            <circle cx="80" cy="60" r="0.9"/>
            <circle cx="160" cy="120" r="0.7"/>
            <circle cx="240" cy="80" r="0.8"/>
            <circle cx="380" cy="140" r="0.9"/>
            <circle cx="500" cy="110" r="0.8"/>
            <circle cx="730" cy="180" r="0.9"/>
          </g>
          <!-- Egyptian pyramid silhouettes (right) -->
          <polygon points="700,400 760,300 800,400" fill="#241846" opacity="0.8"/>
          <polygon points="640,400 680,340 720,400" fill="#1e1638" opacity="0.85"/>
          <!-- Desert ground -->
          <path d="M 0 360 Q 200 340 400 350 Q 600 330 800 360 L 800 500 L 0 500 Z" fill="#1e1638"/>
          <path d="M 0 420 Q 200 405 400 420 Q 600 400 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Donkey + family fleeing (left to right) -->
          <g transform="translate(280 425)">
            <ellipse cx="0" cy="0" rx="32" ry="13" fill="#0a0d1a"/>
            <line x1="-22" y1="10" x2="-22" y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="-10" y1="12" x2="-10" y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="10"  y1="12" x2="10"  y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="22"  y1="10" x2="22"  y2="28" stroke="#0a0d1a" stroke-width="4"/>
            <ellipse cx="-32" cy="-8" rx="9" ry="6" fill="#0a0d1a"/>
            <line x1="-37" y1="-13" x2="-39" y2="-19" stroke="#0a0d1a" stroke-width="3"/>
            <ellipse cx="0" cy="-14" rx="11" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-32" rx="8" ry="10" fill="#1a1233"/>
            <!-- Mary holding baby (small bright bundle) -->
            <ellipse cx="0" cy="-14" rx="6" ry="5" fill="#fef3c7" opacity="0.6"/>
            <!-- Joseph alongside, looking back -->
            <ellipse cx="40" cy="-5" rx="7" ry="20" fill="#0a0d1a"/>
            <ellipse cx="40" cy="-32" rx="7" ry="9" fill="#0a0d1a"/>
            <line x1="46" y1="-20" x2="54" y2="14" stroke="#0a0d1a" stroke-width="2"/>
            <!-- Joseph turning back, watchful -->
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">By night · into Egypt</text>
        </svg>`
      },
      {
        id: 'return',
        title: 'Return to Nazareth',
        scriptureRef: 'Matthew 2:19-23',
        bibleText: '"And he came and lived in a town called Nazareth. So was fulfilled what was said through the prophets: He will be called a Nazarene."',
        narration: 'When Herod died, an angel told Joseph it was safe to come home. They settled in Nazareth — the obscure village in Galilee. There the Son of God grew in wisdom and stature, hidden in plain sight, for thirty silent years.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'rtn', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378'})}
          <!-- Galilee hills - softer dawn palette -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 285 800 310 L 800 500 L 0 500 Z" fill="#241846" opacity="0.85"/>
          <path d="M 0 380 Q 200 355 400 375 Q 600 350 800 375 L 800 500 L 0 500 Z" fill="#0a0d1a" opacity="0.9"/>
          <!-- Nazareth village (cluster of houses) -->
          <g transform="translate(380 340)">
            <rect x="-50" y="-15" width="14" height="15" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <polygon points="-52,-15 -43,-22 -34,-15" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <rect x="-30" y="-20" width="16" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <polygon points="-32,-20 -22,-28 -12,-20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <rect x="-8" y="-17" width="14" height="17" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <polygon points="-10,-17 -1,-25 8,-17" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <rect x="14" y="-14" width="13" height="14" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <polygon points="12,-14 21,-21 30,-14" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <rect x="34" y="-18" width="14" height="18" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <polygon points="32,-18 41,-25 50,-18" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <!-- Lit windows -->
            <rect x="-44" y="-9" width="3" height="3" fill="rgba(251,191,36,0.7)"/>
            <rect x="-22" y="-11" width="4" height="4" fill="rgba(251,191,36,0.7)"/>
            <rect x="-1" y="-9" width="3" height="3" fill="rgba(251,191,36,0.7)"/>
            <rect x="20" y="-7" width="3" height="3" fill="rgba(251,191,36,0.7)"/>
            <rect x="40" y="-10" width="3" height="3" fill="rgba(251,191,36,0.7)"/>
          </g>
          <text x="400" y="320" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2.5" fill="rgba(251,191,36,0.7)">NAZARETH</text>
          <!-- Family arriving (smaller, in foreground) -->
          <g transform="translate(220 425)">
            <ellipse cx="0" cy="0" rx="22" ry="9" fill="#0a0d1a"/>
            <line x1="-15" y1="6" x2="-15" y2="22" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="15" y1="6" x2="15" y2="22" stroke="#0a0d1a" stroke-width="3"/>
            <ellipse cx="-22" cy="-4" rx="6" ry="4" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-10" rx="8" ry="10" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="6" ry="7" fill="#1a1233"/>
            <ellipse cx="28" cy="-3" rx="5" ry="14" fill="#0a0d1a"/>
            <ellipse cx="28" cy="-22" rx="5" ry="7" fill="#0a0d1a"/>
          </g>
          <!-- Small light suggesting child -->
          <circle cx="220" cy="415" r="3" fill="#fef3c7" opacity="0.7"/>
          <!-- Soft dawn glow -->
          <ellipse cx="400" cy="100" rx="280" ry="60" fill="rgba(251,191,36,0.18)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Thirty hidden years</text>
        </svg>`
      },
    ],
    closing: 'The God of the universe became a baby in Bethlehem — small enough to be held, vulnerable enough to be killed, and humble enough to grow up unnoticed in Nazareth. The Christmas story isn\'t mainly about a holiday. It\'s about a king who came not to be served, but to serve. And to give His life as a ransom for many.',
    closingPrompt: 'What part of the Christmas story do you most need to remember today — and why?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 2 — The Resurrection
  // ════════════════════════════════════════════════════════════
  {
    id: 'resurrection',
    title: 'The Resurrection',
    subtitle: 'Friday\'s grief. Sunday\'s impossible joy.',
    icon: '🌅',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Matthew 26-28 · John 18-21',
    duration: '~7 min',
    scenes: [
      {
        id: 'gethsemane',
        title: 'Gethsemane',
        scriptureRef: 'Matthew 26:36-46',
        bibleText: '"My Father, if it is possible, may this cup be taken from me. Yet not as I will, but as you will."',
        narration: 'On a quiet Thursday night, Jesus knelt in a garden of olive trees. He prayed in such anguish that His sweat became like drops of blood. The disciples slept. The cross was hours away. He chose it anyway.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gth', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <g fill="#fef3c7" opacity="0.5"><circle cx="80" cy="60" r="0.8"/><circle cx="180" cy="100" r="0.7"/><circle cx="280" cy="40" r="0.9"/><circle cx="400" cy="120" r="0.8"/><circle cx="540" cy="80" r="0.7"/><circle cx="680" cy="50" r="0.9"/><circle cx="730" cy="140" r="0.6"/></g>
          <!-- Olive trees (twisted silhouettes) -->
          <g fill="#0a0d1a">
            <path d="M 100 380 Q 90 330 100 280 Q 70 280 80 320 Q 50 300 70 350 Q 60 380 100 380 Z"/>
            <ellipse cx="90" cy="280" rx="35" ry="25" fill="#1e1638"/>
            <path d="M 700 380 Q 690 330 700 280 Q 670 280 680 320 Q 650 300 670 350 Q 660 380 700 380 Z"/>
            <ellipse cx="690" cy="280" rx="35" ry="25" fill="#1e1638"/>
            <path d="M 200 400 Q 195 360 205 320 Q 220 360 215 400 Z"/>
            <ellipse cx="208" cy="320" rx="25" ry="18" fill="#1e1638"/>
            <path d="M 620 400 Q 615 360 625 320 Q 640 360 635 400 Z"/>
            <ellipse cx="628" cy="320" rx="25" ry="18" fill="#1e1638"/>
          </g>
          <!-- Jesus kneeling alone in center -->
          <g transform="translate(400 380)">
            <ellipse cx="0" cy="0" rx="22" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-18" rx="14" ry="20" fill="#1a1233"/>
            <ellipse cx="0" cy="-44" rx="11" ry="13" fill="#1a1233"/>
            <!-- Halo -->
            <circle cx="0" cy="-44" r="22" fill="none" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <!-- Hands clasped, head bowed -->
            <ellipse cx="0" cy="-30" rx="6" ry="3" fill="#0a0d1a"/>
          </g>
          <!-- Sleeping disciples (3 silhouettes in distance) -->
          <g fill="#0a0d1a" opacity="0.85">
            <ellipse cx="180" cy="445" rx="22" ry="7"/>
            <ellipse cx="180" cy="438" rx="9" ry="6"/>
            <ellipse cx="240" cy="450" rx="22" ry="7"/>
            <ellipse cx="240" cy="443" rx="9" ry="6"/>
            <ellipse cx="560" cy="448" rx="22" ry="7"/>
            <ellipse cx="560" cy="441" rx="9" ry="6"/>
          </g>
          <!-- Faint light from sky on Jesus -->
          <ellipse cx="400" cy="280" rx="100" ry="30" fill="rgba(251,191,36,0.06)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Garden of olive trees · midnight</text>
        </svg>`
      },
      {
        id: 'arrest',
        title: 'The Arrest',
        scriptureRef: 'Matthew 26:47-56',
        bibleText: '"Friend, do what you came for. Then the men stepped forward, seized Jesus and arrested him."',
        narration: 'Torchlight broke through the trees. Judas led the soldiers. He kissed Jesus on the cheek — the agreed signal. Peter drew a sword and struck. Jesus healed the wound. "Put your sword away," He said. Then they took Him.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'arr', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Torchlight glow -->
          <radialGradient id="arrTorch" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stop-color="rgba(251,113,38,0.7)"/>
            <stop offset="40%" stop-color="rgba(251,191,36,0.35)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="500" cy="350" rx="280" ry="180" fill="url(#arrTorch)"/>
          <!-- Trees (olive) -->
          <g fill="#0a0d1a">
            <ellipse cx="80" cy="320" rx="50" ry="40"/>
            <ellipse cx="720" cy="310" rx="50" ry="40"/>
            <ellipse cx="200" cy="350" rx="35" ry="28"/>
            <ellipse cx="640" cy="340" rx="35" ry="28"/>
          </g>
          <!-- Ground -->
          <path d="M 0 380 Q 400 360 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Mob with torches (right side) -->
          <g transform="translate(500 380)">
            <!-- Multiple silhouettes -->
            <ellipse cx="0" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <ellipse cx="40" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="40" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <ellipse cx="-30" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="-30" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <ellipse cx="80" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="80" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <!-- Torches (flames) -->
            <line x1="-30" y1="-30" x2="-30" y2="-60" stroke="#0a0d1a" stroke-width="2"/>
            <ellipse cx="-30" cy="-66" rx="7" ry="11" fill="#fb923c"/>
            <ellipse cx="-30" cy="-66" rx="4" ry="7" fill="#fbbf24"/>
            <line x1="40" y1="-30" x2="40" y2="-60" stroke="#0a0d1a" stroke-width="2"/>
            <ellipse cx="40" cy="-66" rx="7" ry="11" fill="#fb923c"/>
            <ellipse cx="40" cy="-66" rx="4" ry="7" fill="#fbbf24"/>
            <!-- Spear -->
            <line x1="80" y1="-30" x2="90" y2="-90" stroke="#0a0d1a" stroke-width="2"/>
            <polygon points="89,-90 92,-95 87,-95" fill="#fef3c7"/>
          </g>
          <!-- Jesus standing alone (left of mob) -->
          <g transform="translate(370 380)">
            <ellipse cx="0" cy="0" rx="11" ry="35" fill="#1a1233"/>
            <ellipse cx="0" cy="-32" rx="10" ry="13" fill="#1a1233"/>
            <circle cx="0" cy="-32" r="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
            <!-- Open hands -->
            <ellipse cx="-12" cy="-12" rx="3" ry="5" fill="#fef3c7" opacity="0.4"/>
            <ellipse cx="12" cy="-12" rx="3" ry="5" fill="#fef3c7" opacity="0.4"/>
          </g>
          <!-- Judas, between Jesus and mob -->
          <g transform="translate(420 380)">
            <ellipse cx="0" cy="0" rx="9" ry="28" fill="#251607"/>
            <ellipse cx="0" cy="-26" rx="8" ry="10" fill="#251607"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"Put your sword away"</text>
        </svg>`
      },
      {
        id: 'crucifixion',
        title: 'The Crucifixion',
        scriptureRef: 'John 19:17-30',
        bibleText: '"It is finished." With that, he bowed his head and gave up his spirit.',
        narration: 'They led Him to a hill called Skull Place. Three crosses. Six hours. Darkness fell over the land at noon. The Temple veil tore from top to bottom. The Lamb of God took away the sin of the world.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="crxSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="40%" stop-color="#1a0a16"/>
              <stop offset="100%" stop-color="#3d1414"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#crxSky)"/>
          <!-- Eclipsed sun behind clouds -->
          <circle cx="640" cy="120" r="45" fill="rgba(254,243,199,0.18)"/>
          <ellipse cx="640" cy="120" rx="80" ry="20" fill="#1a0a16" opacity="0.85"/>
          <ellipse cx="640" cy="135" rx="75" ry="18" fill="#1a0a16" opacity="0.7"/>
          <!-- Hill (Golgotha) -->
          <path d="M 0 400 Q 200 360 400 380 Q 600 360 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Three crosses (center is Jesus, taller) -->
          <g stroke="#0a0d1a" fill="#0a0d1a">
            <!-- Left cross -->
            <rect x="265" y="245" width="6" height="160"/>
            <rect x="245" y="280" width="46" height="6"/>
            <!-- Right cross -->
            <rect x="529" y="245" width="6" height="160"/>
            <rect x="509" y="280" width="46" height="6"/>
            <!-- Center cross — taller -->
            <rect x="397" y="200" width="8" height="200"/>
            <rect x="365" y="240" width="72" height="8"/>
          </g>
          <!-- Jesus on the center cross (silhouette) -->
          <g transform="translate(401 250)">
            <ellipse cx="0" cy="14" rx="14" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-8" rx="9" ry="11" fill="#1a1233"/>
            <line x1="-30" y1="-2" x2="30" y2="-2" stroke="#1a1233" stroke-width="6" stroke-linecap="round"/>
            <!-- Crown of thorns hint -->
            <circle cx="0" cy="-12" r="13" fill="none" stroke="#251607" stroke-width="1.5" stroke-dasharray="2 2"/>
          </g>
          <!-- Two thieves on outside crosses -->
          <g transform="translate(269 281)">
            <ellipse cx="0" cy="14" rx="11" ry="18" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-4" rx="7" ry="9" fill="#0a0d1a"/>
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#0a0d1a" stroke-width="5" stroke-linecap="round"/>
          </g>
          <g transform="translate(533 281)">
            <ellipse cx="0" cy="14" rx="11" ry="18" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-4" rx="7" ry="9" fill="#0a0d1a"/>
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#0a0d1a" stroke-width="5" stroke-linecap="round"/>
          </g>
          <!-- Mary + John (mourners at base) -->
          <g fill="#1a1233" opacity="0.85">
            <ellipse cx="370" cy="430" rx="9" ry="22"/>
            <ellipse cx="370" cy="412" rx="8" ry="9"/>
            <ellipse cx="430" cy="430" rx="9" ry="22"/>
            <ellipse cx="430" cy="412" rx="8" ry="9"/>
          </g>
          <!-- Distant crowd silhouette -->
          <g fill="#0a0d1a" opacity="0.75">
            <rect x="120" y="395" width="6" height="20"/>
            <rect x="135" y="395" width="6" height="20"/>
            <rect x="150" y="395" width="6" height="20"/>
            <rect x="640" y="395" width="6" height="20"/>
            <rect x="655" y="395" width="6" height="20"/>
            <rect x="670" y="395" width="6" height="20"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.55)">Skull Place · the sixth hour</text>
        </svg>`
      },
      {
        id: 'burial',
        title: 'The Burial',
        scriptureRef: 'John 19:38-42',
        bibleText: '"At the place where Jesus was crucified, there was a garden, and in the garden a new tomb... they laid Jesus there."',
        narration: 'Joseph of Arimathea took the body. Nicodemus brought the spices — seventy-five pounds of myrrh and aloes. They wrapped Him in linen and laid Him in a borrowed tomb. A great stone rolled across the entrance. The Sabbath began. Heaven held its breath.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'brl', skyTop:'#1a1233', skyMid:'#241846', skyBot:'#3d2a5e', stars:false})}
          <g fill="#fef3c7" opacity="0.4"><circle cx="100" cy="80" r="0.8"/><circle cx="220" cy="60" r="0.7"/><circle cx="380" cy="110" r="0.9"/><circle cx="500" cy="80" r="0.7"/><circle cx="640" cy="50" r="0.9"/></g>
          <!-- Hill with tomb (center) -->
          <path d="M 0 320 Q 200 290 400 295 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#3d2a5e"/>
          <path d="M 100 350 Q 300 320 500 330 Q 700 325 800 360 L 800 500 L 100 500 Z" fill="#241846"/>
          <!-- Tomb opening (cave-cut, with stone) -->
          <g transform="translate(400 360)">
            <ellipse cx="0" cy="0" rx="80" ry="50" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-5" rx="65" ry="35" fill="#0a0d1a" stroke="#3d2a5e" stroke-width="2"/>
            <!-- Rolling stone in front -->
            <circle cx="55" cy="20" r="35" fill="#1e1638" stroke="#fef3c7" stroke-width="1.5"/>
            <circle cx="55" cy="20" r="28" fill="none" stroke="rgba(254,243,199,0.3)" stroke-width="0.8"/>
            <!-- Track in dirt -->
            <line x1="-65" y1="55" x2="55" y2="55" stroke="rgba(254,243,199,0.2)" stroke-width="2"/>
          </g>
          <!-- Olive trees -->
          <g fill="#0a0d1a">
            <ellipse cx="120" cy="305" rx="28" ry="22"/>
            <rect x="118" y="320" width="4" height="20"/>
            <ellipse cx="680" cy="305" rx="28" ry="22"/>
            <rect x="678" y="320" width="4" height="20"/>
          </g>
          <!-- Two figures walking away (Joseph, Nicodemus) -->
          <g transform="translate(220 410)">
            <ellipse cx="0" cy="0" rx="8" ry="22" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-22" rx="7" ry="9" fill="#0a0d1a"/>
            <ellipse cx="22" cy="0" rx="8" ry="22" fill="#0a0d1a"/>
            <ellipse cx="22" cy="-22" rx="7" ry="9" fill="#0a0d1a"/>
          </g>
          <!-- Faint moonlight on tomb -->
          <ellipse cx="400" cy="200" rx="180" ry="40" fill="rgba(254,243,199,0.05)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.55)">A great stone · the Sabbath begins</text>
        </svg>`
      },
      {
        id: 'silence',
        title: 'The Sabbath Silence',
        scriptureRef: 'Matthew 27:62-66',
        bibleText: 'They went and made the tomb secure by sealing the stone and posting the guard.',
        narration: 'All day Saturday, Jerusalem rested. Mary wept. Peter cursed his denial. The disciples hid behind locked doors. The chief priests sealed the tomb and posted Roman guards. The Light of the World lay buried. Hope, it seemed, was over.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sln', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#1e1638', stars:false})}
          <g fill="#fef3c7" opacity="0.3"><circle cx="100" cy="100" r="0.6"/><circle cx="220" cy="60" r="0.7"/><circle cx="380" cy="110" r="0.5"/><circle cx="500" cy="80" r="0.7"/><circle cx="640" cy="120" r="0.6"/><circle cx="730" cy="60" r="0.6"/></g>
          <!-- Sealed tomb in distance -->
          <g transform="translate(400 280)">
            <ellipse cx="0" cy="0" rx="50" ry="32" fill="#0a0d1a"/>
            <circle cx="20" cy="10" r="22" fill="#1e1638" stroke="#fef3c7" stroke-width="1"/>
            <!-- Roman guards -->
            <g fill="#fb1414" opacity="0.7">
              <ellipse cx="-50" cy="40" rx="6" ry="14"/>
              <ellipse cx="-50" cy="22" rx="5" ry="6"/>
              <line x1="-46" y1="35" x2="-40" y2="60" stroke="#fb1414" stroke-width="1.5"/>
              <ellipse cx="55" cy="40" rx="6" ry="14"/>
              <ellipse cx="55" cy="22" rx="5" ry="6"/>
              <line x1="60" y1="35" x2="66" y2="60" stroke="#fb1414" stroke-width="1.5"/>
            </g>
          </g>
          <!-- Hills -->
          <path d="M 0 320 Q 200 290 400 300 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#1e1638"/>
          <path d="M 0 380 Q 200 360 400 380 Q 600 360 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Distant Jerusalem -->
          <g transform="translate(580 365)" fill="#0a0d1a" stroke="rgba(251,191,36,0.3)" stroke-width="0.8">
            <rect x="-30" y="-12" width="14" height="14"/>
            <rect x="-12" y="-18" width="14" height="20"/>
            <rect x="6" y="-15" width="14" height="17"/>
            <rect x="24" y="-10" width="12" height="12"/>
          </g>
          <!-- Locked-room window with weeping figures (left) -->
          <g transform="translate(120 360)">
            <rect x="-30" y="-25" width="60" height="55" fill="#0a0d1a" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
            <rect x="-12" y="-12" width="24" height="18" fill="rgba(251,191,36,0.45)"/>
            <!-- Silhouettes inside -->
            <ellipse cx="-4" cy="0" rx="3" ry="6" fill="#0a0d1a"/>
            <ellipse cx="6" cy="0" rx="3" ry="6" fill="#0a0d1a"/>
          </g>
          <!-- Rain hint? No, just heavy darkness -->
          <ellipse cx="400" cy="60" rx="400" ry="40" fill="rgba(0,0,0,0.4)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.5)">"The Light of the World lay buried"</text>
        </svg>`
      },
      {
        id: 'empty-tomb',
        title: 'The Empty Tomb',
        scriptureRef: 'Matthew 28:1-10 · John 20:1-18',
        bibleText: '"He is not here; he has risen, just as he said. Come and see the place where he lay."',
        narration: 'At dawn on the first day of the week, the women came with spices. There was an earthquake. An angel of the Lord rolled the stone away — and sat on it. The guards fell as dead men. The tomb was empty. He was risen.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="empSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e1846"/>
              <stop offset="40%" stop-color="#fbbf24" stop-opacity="0.4"/>
              <stop offset="80%" stop-color="#fef3c7" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#fef3c7"/>
            </linearGradient>
            <radialGradient id="empSunrise" cx="0.5" cy="1" r="0.8">
              <stop offset="0%" stop-color="rgba(254,243,199,1)"/>
              <stop offset="35%" stop-color="rgba(251,191,36,0.7)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#empSky)"/>
          <ellipse cx="400" cy="500" rx="500" ry="280" fill="url(#empSunrise)"/>
          <!-- Hills in soft sunrise color -->
          <path d="M 0 350 Q 200 320 400 335 Q 600 320 800 345 L 800 500 L 0 500 Z" fill="#3d2a5e" opacity="0.7"/>
          <path d="M 0 410 Q 200 390 400 405 Q 600 385 800 410 L 800 500 L 0 500 Z" fill="#241846" opacity="0.85"/>
          <!-- Tomb open, stone rolled aside -->
          <g transform="translate(400 320)">
            <ellipse cx="0" cy="0" rx="70" ry="48" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-3" rx="55" ry="35" fill="#0a0d1a" stroke="rgba(251,191,36,0.4)" stroke-width="1.5"/>
            <!-- Empty interior glow -->
            <ellipse cx="0" cy="-3" rx="40" ry="22" fill="url(#empSunrise)" opacity="0.6"/>
            <!-- Linen wrappings hint -->
            <ellipse cx="0" cy="5" rx="22" ry="6" fill="rgba(254,243,199,0.7)"/>
            <!-- Rolled-away stone -->
            <circle cx="-95" cy="35" r="40" fill="#1e1638" stroke="#fef3c7" stroke-width="1.5"/>
            <circle cx="-95" cy="35" r="32" fill="none" stroke="rgba(254,243,199,0.3)" stroke-width="0.8"/>
            <!-- Stone-roll track -->
            <path d="M -55 50 Q -75 50 -95 35" stroke="rgba(254,243,199,0.4)" stroke-width="2" fill="none"/>
          </g>
          <!-- Angel sitting on the rolled stone -->
          <g transform="translate(305 325)">
            <ellipse cx="0" cy="0" rx="22" ry="32" fill="#fef3c7" opacity="0.95"/>
            <ellipse cx="0" cy="-22" rx="11" ry="13" fill="#fef3c7"/>
            <!-- Wing hints -->
            <path d="M -22 -10 Q -45 -20 -50 5" stroke="#fef3c7" stroke-width="2" fill="none"/>
            <path d="M 22 -10 Q 45 -20 50 5" stroke="#fef3c7" stroke-width="2" fill="none"/>
            <circle cx="0" cy="-22" r="22" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1.5"/>
          </g>
          <!-- Two women approaching with spices (right) -->
          <g transform="translate(560 410)">
            <ellipse cx="0" cy="0" rx="9" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="8" ry="9" fill="#1a1233"/>
            <ellipse cx="-2" cy="-10" rx="5" ry="3" fill="rgba(251,191,36,0.5)"/>
            <ellipse cx="22" cy="0" rx="9" ry="22" fill="#1a1233"/>
            <ellipse cx="22" cy="-22" rx="8" ry="9" fill="#1a1233"/>
          </g>
          <!-- Burst of light rays from open tomb -->
          <g stroke="rgba(254,243,199,0.55)" stroke-width="1.4" opacity="0.7">
            <line x1="400" y1="320" x2="200" y2="120"/>
            <line x1="400" y1="320" x2="600" y2="120"/>
            <line x1="400" y1="320" x2="100" y2="220"/>
            <line x1="400" y1="320" x2="700" y2="220"/>
            <line x1="400" y1="320" x2="400" y2="40"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="#0a0d1a" font-weight="700">"He is risen, just as He said"</text>
        </svg>`
      },
      {
        id: 'appearance',
        title: 'On the Road to Emmaus',
        scriptureRef: 'Luke 24:13-35',
        bibleText: '"Were not our hearts burning within us while he talked with us on the road and opened the Scriptures to us?"',
        narration: 'That same Sunday afternoon, two disciples walked the seven miles to Emmaus, devastated. A stranger joined them. He explained the Scriptures — Moses, the Prophets, all of it pointing to a suffering Messiah. They invited Him in. He broke the bread. Their eyes were opened. It was Jesus. Then He vanished.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="emmSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3d2a5e"/>
              <stop offset="40%" stop-color="#fb923c" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.6"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#emmSky)"/>
          <!-- Setting sun -->
          <circle cx="650" cy="380" r="55" fill="#fef3c7"/>
          <circle cx="650" cy="380" r="80" fill="rgba(251,191,36,0.4)"/>
          <!-- Distant hills -->
          <path d="M 0 380 Q 200 350 400 365 Q 600 345 800 380 L 800 500 L 0 500 Z" fill="#3d2a16" opacity="0.85"/>
          <path d="M 0 430 Q 200 410 400 425 Q 600 405 800 430 L 800 500 L 0 500 Z" fill="#1a0a16"/>
          <!-- Road -->
          <path d="M 100 460 Q 350 420 700 380" stroke="rgba(254,243,199,0.4)" stroke-width="3" fill="none" stroke-dasharray="8 6"/>
          <!-- Three figures walking -->
          <g transform="translate(380 420)">
            <!-- Disciple 1 -->
            <ellipse cx="-30" cy="0" rx="9" ry="26" fill="#1a0a16"/>
            <ellipse cx="-30" cy="-22" rx="8" ry="9" fill="#1a0a16"/>
            <line x1="-25" y1="-12" x2="-18" y2="14" stroke="#1a0a16" stroke-width="2"/>
            <!-- Jesus center -->
            <ellipse cx="0" cy="0" rx="10" ry="28" fill="#1a1233"/>
            <ellipse cx="0" cy="-25" rx="9" ry="11" fill="#1a1233"/>
            <circle cx="0" cy="-25" r="20" fill="none" stroke="rgba(254,243,199,0.5)" stroke-width="1.2"/>
            <!-- Soft glow around Jesus -->
            <ellipse cx="0" cy="-12" rx="22" ry="36" fill="rgba(254,243,199,0.18)"/>
            <!-- Disciple 2 -->
            <ellipse cx="30" cy="0" rx="9" ry="26" fill="#1a0a16"/>
            <ellipse cx="30" cy="-22" rx="8" ry="9" fill="#1a0a16"/>
          </g>
          <!-- Long shadows pointing east (toward Emmaus, away from sun) -->
          <g opacity="0.4" fill="#0a0d1a">
            <ellipse cx="350" cy="455" rx="20" ry="3"/>
            <ellipse cx="380" cy="455" rx="20" ry="3"/>
            <ellipse cx="410" cy="455" rx="20" ry="3"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">"Then their eyes were opened"</text>
        </svg>`
      },
    ],
    closing: 'The resurrection isn\'t a spiritual metaphor. It\'s a historical claim — a body that was dead, was alive again. Friday\'s grief was real. Sunday\'s joy was even more real. And the same Spirit that raised Jesus from the dead is now the inheritance of every person who trusts Him. Death has lost. Light has won.',
    closingPrompt: 'Where in your life right now do you most need resurrection power — and are you willing to trust it?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 3 — Noah's Ark (Phase 5.7 content sprint, batch 1)
  // ════════════════════════════════════════════════════════════
  {
    id: 'noahs-ark',
    title: "Noah's Ark",
    subtitle: 'Judgment and mercy. A ship on a dying world.',
    icon: '🌊',
    color: '#38bdf8',
    accentColor: '#fef3c7',
    era: 'creation',
    scriptureRef: 'Genesis 6-9',
    duration: '~6 min',
    scenes: [
      {
        id: 'warning',
        title: 'The Warning',
        scriptureRef: 'Genesis 6:13-22',
        bibleText: '"I am surely going to destroy both them and the earth. So make yourself an ark of cypress wood."',
        narration: 'The earth had filled with violence. God grieved that He had made humanity. But one man walked with God: Noah. To him alone, the warning came. To him alone, the strange task — build an ark on dry land. He listened. He obeyed.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'noaw', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <g fill="#fef3c7" opacity="0.5">
            <circle cx="120" cy="50" r="0.8"/><circle cx="240" cy="90" r="0.7"/><circle cx="360" cy="40" r="0.9"/>
            <circle cx="500" cy="80" r="0.8"/><circle cx="620" cy="60" r="0.7"/><circle cx="720" cy="100" r="0.9"/>
          </g>
          <!-- Beam of light from above -->
          <defs>
            <linearGradient id="noawBeam" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="rgba(254,243,199,0.65)"/>
              <stop offset="60%" stop-color="rgba(251,191,36,0.25)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="400,0 320,440 480,440" fill="url(#noawBeam)"/>
          <!-- Distant ruined city silhouette (cracked, leaning towers) -->
          <g fill="#0a0d1a" opacity="0.85">
            <polygon points="60,400 60,330 78,330 78,400"/>
            <polygon points="78,330 88,310 98,330"/>
            <polygon points="120,400 120,350 138,350 138,400"/>
            <polygon points="160,400 160,320 178,335 178,400"/>
            <polygon points="178,335 188,316 196,335"/>
          </g>
          <!-- Ground -->
          <path d="M 0 400 Q 200 380 400 395 Q 600 380 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Noah standing alone, arms slightly raised -->
          <g transform="translate(400 420)">
            <ellipse cx="0" cy="0" rx="14" ry="40" fill="#1a1233"/>
            <ellipse cx="0" cy="-38" rx="11" ry="14" fill="#1a1233"/>
            <!-- Beard hint -->
            <path d="M -7 -32 Q 0 -22 7 -32" stroke="rgba(251,191,36,0.45)" stroke-width="1.2" fill="none"/>
            <!-- Raised hands -->
            <line x1="-12" y1="-20" x2="-20" y2="-44" stroke="#1a1233" stroke-width="4"/>
            <line x1="12" y1="-20" x2="20" y2="-44" stroke="#1a1233" stroke-width="4"/>
            <!-- Halo of attention -->
            <circle cx="0" cy="-38" r="22" fill="none" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"Noah walked with God"</text>
        </svg>`
      },
      {
        id: 'building',
        title: 'Building the Ark',
        scriptureRef: 'Genesis 6:14-22',
        bibleText: '"Noah did everything just as God commanded him."',
        narration: 'For decades the work continued. Cypress beams, sealed with pitch. Three decks. A door in the side. Stalls for every kind of animal. Neighbors mocked. Children grew up watching it rise. Noah kept building.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'noab', skyTop:'#1a1233', skyMid:'#3d2a16', skyBot:'#4a3220', stars:false})}
          <!-- Sun low on horizon -->
          <circle cx="650" cy="160" r="42" fill="#fbbf24" opacity="0.5"/>
          <circle cx="650" cy="160" r="22" fill="#fef3c7"/>
          <!-- Distant dry ground -->
          <path d="M 0 380 Q 200 360 400 375 Q 600 358 800 380 L 800 500 L 0 500 Z" fill="#3d2a16" opacity="0.85"/>
          <path d="M 0 430 Q 200 415 400 425 Q 600 410 800 430 L 800 500 L 0 500 Z" fill="#1a0a16"/>
          <!-- Ark under construction (large hull silhouette) -->
          <g transform="translate(400 360)">
            <!-- Hull -->
            <path d="M -180 0 Q -160 30 -120 30 L 120 30 Q 160 30 180 0 L 170 -90 L -170 -90 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.5)" stroke-width="1.5"/>
            <!-- Ribs / vertical beams -->
            <line x1="-130" y1="-90" x2="-130" y2="30" stroke="rgba(251,191,36,0.25)" stroke-width="1"/>
            <line x1="-80" y1="-90" x2="-80" y2="30" stroke="rgba(251,191,36,0.25)" stroke-width="1"/>
            <line x1="-30" y1="-90" x2="-30" y2="30" stroke="rgba(251,191,36,0.25)" stroke-width="1"/>
            <line x1="20" y1="-90" x2="20" y2="30" stroke="rgba(251,191,36,0.25)" stroke-width="1"/>
            <line x1="70" y1="-90" x2="70" y2="30" stroke="rgba(251,191,36,0.25)" stroke-width="1"/>
            <line x1="120" y1="-90" x2="120" y2="30" stroke="rgba(251,191,36,0.25)" stroke-width="1"/>
            <!-- Top deck planking suggestion -->
            <rect x="-170" y="-90" width="340" height="6" fill="#251607"/>
            <!-- Door on the side -->
            <rect x="-10" y="-10" width="20" height="30" fill="#1a0a16" stroke="rgba(251,191,36,0.45)" stroke-width="0.8"/>
            <!-- Upper missing planks (still being built) -->
            <line x1="-170" y1="-130" x2="170" y2="-130" stroke="rgba(251,191,36,0.4)" stroke-width="1" stroke-dasharray="6 4"/>
          </g>
          <!-- Worker silhouettes on ark (tiny) -->
          <g fill="#0a0d1a">
            <ellipse cx="305" cy="262" rx="4" ry="9"/>
            <circle cx="305" cy="252" r="3"/>
            <line x1="307" y1="258" x2="313" y2="248" stroke="#0a0d1a" stroke-width="1.5"/>
            <ellipse cx="430" cy="262" rx="4" ry="9"/>
            <circle cx="430" cy="252" r="3"/>
            <line x1="432" y1="258" x2="438" y2="248" stroke="#0a0d1a" stroke-width="1.5"/>
            <ellipse cx="490" cy="262" rx="4" ry="9"/>
            <circle cx="490" cy="252" r="3"/>
          </g>
          <!-- Noah in foreground -->
          <g transform="translate(180 440)">
            <ellipse cx="0" cy="0" rx="11" ry="32" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-30" rx="9" ry="11" fill="#0a0d1a"/>
            <!-- Tool in hand -->
            <line x1="8" y1="-12" x2="22" y2="6" stroke="#0a0d1a" stroke-width="3"/>
          </g>
          <!-- Mocking neighbors (distant, smaller) -->
          <g fill="#0a0d1a" opacity="0.7">
            <ellipse cx="660" cy="395" rx="5" ry="14"/>
            <circle cx="660" cy="381" r="4"/>
            <ellipse cx="690" cy="397" rx="5" ry="14"/>
            <circle cx="690" cy="383" r="4"/>
            <ellipse cx="720" cy="395" rx="5" ry="14"/>
            <circle cx="720" cy="381" r="4"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Decades of obedience · long before the rain</text>
        </svg>`
      },
      {
        id: 'flood',
        title: 'The Flood',
        scriptureRef: 'Genesis 7:11-12',
        bibleText: '"On that day all the springs of the great deep burst forth, and the floodgates of the heavens were opened. And rain fell on the earth forty days and forty nights."',
        narration: 'The skies tore open. The deep broke loose. Within forty days the whole world disappeared beneath grey water. Inside the ark, eight people and countless animals waited in darkness while the storm beat against the hull. God remembered Noah.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="noafSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="55%" stop-color="#1a1d2e"/>
              <stop offset="100%" stop-color="#2a3550"/>
            </linearGradient>
            <linearGradient id="noafSea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2a3550"/>
              <stop offset="100%" stop-color="#0a0d1a"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#noafSky)"/>
          <!-- Lightning flash -->
          <path d="M 540 0 L 525 90 L 555 95 L 530 200" stroke="rgba(254,243,199,0.55)" stroke-width="2.5" fill="none"/>
          <!-- Rain streaks -->
          <g stroke="rgba(254,243,199,0.32)" stroke-width="1">
            <line x1="60" y1="40" x2="40" y2="160"/>
            <line x1="120" y1="20" x2="100" y2="140"/>
            <line x1="180" y1="60" x2="160" y2="180"/>
            <line x1="240" y1="30" x2="220" y2="150"/>
            <line x1="300" y1="50" x2="280" y2="170"/>
            <line x1="380" y1="20" x2="360" y2="140"/>
            <line x1="440" y1="60" x2="420" y2="180"/>
            <line x1="500" y1="40" x2="480" y2="160"/>
            <line x1="600" y1="30" x2="580" y2="150"/>
            <line x1="660" y1="50" x2="640" y2="170"/>
            <line x1="720" y1="60" x2="700" y2="180"/>
            <line x1="760" y1="40" x2="740" y2="160"/>
          </g>
          <!-- Wave layers -->
          <path d="M 0 290 Q 100 270 200 290 Q 300 305 400 285 Q 500 268 600 290 Q 700 308 800 285 L 800 500 L 0 500 Z" fill="url(#noafSea)"/>
          <path d="M 0 360 Q 120 340 240 360 Q 360 380 480 358 Q 600 340 800 360 L 800 500 L 0 500 Z" fill="#0a0d1a" opacity="0.85"/>
          <!-- Distant mountain peak just above water -->
          <polygon points="80,290 110,260 140,290" fill="#1a1d2e" opacity="0.6"/>
          <!-- Ark on waves -->
          <g transform="translate(420 280)">
            <path d="M -130 0 Q -110 28 -80 28 L 80 28 Q 110 28 130 0 L 120 -55 L -120 -55 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="1.2"/>
            <rect x="-120" y="-55" width="240" height="5" fill="#251607"/>
            <!-- Cabin -->
            <rect x="-40" y="-90" width="80" height="38" fill="#3d2a16" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
            <polygon points="-44,-90 0,-110 44,-90" fill="#251607" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
            <!-- One lit window -->
            <rect x="-10" y="-78" width="8" height="10" fill="rgba(251,191,36,0.7)"/>
            <rect x="4" y="-78" width="8" height="10" fill="rgba(251,191,36,0.4)"/>
          </g>
          <!-- Spray around ark -->
          <g fill="rgba(254,243,199,0.35)">
            <circle cx="280" cy="288" r="2"/>
            <circle cx="305" cy="295" r="1.5"/>
            <circle cx="540" cy="290" r="2"/>
            <circle cx="565" cy="298" r="1.5"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"God remembered Noah"</text>
        </svg>`
      },
      {
        id: 'rainbow',
        title: 'The Rainbow Covenant',
        scriptureRef: 'Genesis 8:11, 9:13',
        bibleText: '"I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth."',
        narration: 'The waters subsided. A dove returned with an olive leaf. The ark rested on Ararat. Noah built an altar and worshiped. And God set a bow in the clouds — a promise. Never again would He flood the earth. Mercy had the final word.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="noarSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#241846"/>
              <stop offset="50%" stop-color="#3d2a5e"/>
              <stop offset="100%" stop-color="#5a3f7a"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#noarSky)"/>
          <!-- Soft cream halo -->
          <ellipse cx="400" cy="200" rx="380" ry="120" fill="rgba(254,243,199,0.12)"/>
          <!-- Rainbow arc -->
          <g fill="none" stroke-width="6" opacity="0.78">
            <path d="M 100 320 Q 400 60 700 320" stroke="#f87171"/>
            <path d="M 110 326 Q 400 76 690 326" stroke="#fb923c"/>
            <path d="M 120 332 Q 400 92 680 332" stroke="#fbbf24"/>
            <path d="M 130 338 Q 400 108 670 338" stroke="#22c55e"/>
            <path d="M 140 344 Q 400 124 660 344" stroke="#38bdf8"/>
            <path d="M 150 350 Q 400 140 650 350" stroke="#a78bfa"/>
          </g>
          <!-- Mt. Ararat -->
          <polygon points="200,400 360,200 520,400" fill="#1a1233" opacity="0.95"/>
          <polygon points="320,260 360,200 400,260 380,280 340,280" fill="#fef3c7" opacity="0.6"/>
          <!-- Sea below -->
          <path d="M 0 400 Q 200 388 400 396 Q 600 388 800 400 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 440 Q 200 432 400 438 Q 600 430 800 440 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Ark resting on the mountainside -->
          <g transform="translate(370 380)">
            <path d="M -55 0 Q -45 14 -30 14 L 30 14 Q 45 14 55 0 L 50 -28 L -50 -28 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <rect x="-15" y="-46" width="30" height="18" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="0.8"/>
            <polygon points="-17,-46 0,-58 17,-46" fill="#251607"/>
          </g>
          <!-- Dove with olive branch (foreground center, gold) -->
          <g transform="translate(400 240)">
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="#fef3c7"/>
            <ellipse cx="-10" cy="-3" rx="6" ry="4" fill="#fef3c7"/>
            <path d="M 5 -2 Q 18 -8 28 -3" stroke="#fef3c7" stroke-width="2" fill="none"/>
            <!-- Olive leaf -->
            <ellipse cx="-18" cy="-1" rx="6" ry="2" fill="#22c55e" transform="rotate(-20 -18 -1)"/>
          </g>
          <!-- Altar with small smoke wisp -->
          <g transform="translate(540 414)">
            <rect x="-12" y="-6" width="24" height="10" fill="#0a0d1a"/>
            <path d="M 0 -8 Q -4 -22 0 -32 Q 4 -42 0 -54" stroke="rgba(254,243,199,0.45)" stroke-width="1.5" fill="none"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">"As long as the earth endures"</text>
        </svg>`
      },
    ],
    closing: 'Noah\'s story is not just an ancient flood myth. It\'s a picture of judgment and rescue — of a God who hates evil enough to act against it, and loves people enough to provide a way through. The ark prefigures the cross. The flood waters point to baptism. And the rainbow still rises after every storm — proof that the same God who judges, also keeps His promises.',
    closingPrompt: 'What "ark" might God be asking you to build right now — something obedient that the people around you don\'t yet understand?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 4 — Abraham & Isaac (Phase 5.7 content sprint, batch 1)
  // ════════════════════════════════════════════════════════════
  {
    id: 'abraham-isaac',
    title: 'Abraham & Isaac',
    subtitle: 'The test of a hundred-year promise.',
    icon: '🔥',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'patriarchs',
    scriptureRef: 'Genesis 22',
    duration: '~5 min',
    scenes: [
      {
        id: 'command',
        title: 'The Unthinkable Command',
        scriptureRef: 'Genesis 22:1-2',
        bibleText: '"Take your son, your only son, whom you love—Isaac—and go to the region of Moriah. Sacrifice him there as a burnt offering."',
        narration: 'Abraham had waited a hundred years for this son. The son of the promise. The son of laughter. Then the voice came in the night with the unthinkable request. Abraham did not argue. He rose early the next morning and saddled his donkey.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'abc', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846'})}
          <!-- Beam of light -->
          <defs>
            <linearGradient id="abcBeam" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="rgba(254,243,199,0.7)"/>
              <stop offset="55%" stop-color="rgba(251,191,36,0.22)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="400,0 350,500 450,500" fill="url(#abcBeam)"/>
          <!-- Desert horizon -->
          <path d="M 0 400 Q 200 380 400 395 Q 600 380 800 400 L 800 500 L 0 500 Z" fill="#1e1638" opacity="0.85"/>
          <path d="M 0 440 Q 200 425 400 435 Q 600 420 800 440 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Tent in distance with sleeping child silhouette -->
          <g transform="translate(620 380)">
            <polygon points="-30,0 30,0 0,-35" fill="#0a0d1a" stroke="rgba(251,191,36,0.35)" stroke-width="0.8"/>
            <rect x="-3" y="-3" width="6" height="3" fill="rgba(251,191,36,0.5)"/>
          </g>
          <text x="620" y="343" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(251,191,36,0.55)">ISAAC SLEEPS</text>
          <!-- Abraham standing alone, head tilted back -->
          <g transform="translate(400 430)">
            <ellipse cx="0" cy="0" rx="13" ry="40" fill="#1a1233"/>
            <ellipse cx="0" cy="-38" rx="11" ry="14" fill="#1a1233"/>
            <!-- Beard hint -->
            <path d="M -8 -32 Q 0 -20 8 -32" stroke="rgba(251,191,36,0.45)" stroke-width="1.2" fill="none"/>
            <!-- One hand on chest -->
            <ellipse cx="-5" cy="-18" rx="4" ry="3" fill="#0a0d1a"/>
            <!-- Halo of attention -->
            <circle cx="0" cy="-38" r="22" fill="none" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"Take your son, your only son…"</text>
        </svg>`
      },
      {
        id: 'journey',
        title: 'Three Days to Moriah',
        scriptureRef: 'Genesis 22:3-8',
        bibleText: '"My son, God himself will provide the lamb for the burnt offering."',
        narration: 'For three days they walked. Servants. A donkey. Wood for the fire. Isaac, finally, asked the question every reader of the story wants to ask: "Father, where is the lamb?" Abraham\'s answer was both deflection and prophecy — "God will provide."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'abj', skyTop:'#1a1233', skyMid:'#3d2a5e', skyBot:'#5a3f7a', stars:false})}
          <!-- Pre-dawn glow -->
          <ellipse cx="650" cy="180" rx="180" ry="80" fill="rgba(251,191,36,0.22)"/>
          <circle cx="660" cy="200" r="32" fill="#fbbf24" opacity="0.55"/>
          <circle cx="660" cy="200" r="16" fill="#fef3c7"/>
          <!-- Mountain rising on the right -->
          <polygon points="500,420 720,180 800,420" fill="#1a1233" opacity="0.95"/>
          <polygon points="640,260 720,180 760,260" fill="#fef3c7" opacity="0.18"/>
          <!-- Path winding up -->
          <path d="M 60 460 Q 220 430 360 420 Q 500 410 640 320 Q 700 280 720 200" stroke="rgba(254,243,199,0.3)" stroke-width="2" fill="none" stroke-dasharray="6 8"/>
          <!-- Two figures walking together, son carrying wood -->
          <g transform="translate(280 430)">
            <!-- Abraham (taller, behind) -->
            <ellipse cx="0" cy="0" rx="11" ry="34" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-32" rx="10" ry="12" fill="#0a0d1a"/>
            <line x1="9" y1="-16" x2="22" y2="20" stroke="#0a0d1a" stroke-width="2"/>
            <!-- Beard hint -->
            <path d="M -6 -26 Q 0 -17 6 -26" stroke="rgba(251,191,36,0.45)" stroke-width="1" fill="none"/>
            <!-- Isaac (smaller, ahead) -->
            <ellipse cx="40" cy="6" rx="9" ry="26" fill="#1a1233"/>
            <ellipse cx="40" cy="-18" rx="8" ry="10" fill="#1a1233"/>
            <!-- Bundle of wood on Isaac's back -->
            <rect x="34" y="-12" width="14" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="0.8"/>
            <line x1="34" y1="-10" x2="48" y2="-10" stroke="rgba(251,191,36,0.4)" stroke-width="0.5"/>
            <line x1="34" y1="-6" x2="48" y2="-6" stroke="rgba(251,191,36,0.4)" stroke-width="0.5"/>
          </g>
          <!-- Donkey + servants in the distance behind -->
          <g transform="translate(140 450)" opacity="0.7">
            <ellipse cx="0" cy="0" rx="22" ry="9" fill="#0a0d1a"/>
            <line x1="-14" y1="6" x2="-14" y2="20" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="14" y1="6" x2="14" y2="20" stroke="#0a0d1a" stroke-width="3"/>
            <ellipse cx="-22" cy="-4" rx="6" ry="4" fill="#0a0d1a"/>
            <ellipse cx="-50" cy="-14" rx="5" ry="14" fill="#0a0d1a"/>
            <ellipse cx="-50" cy="-30" rx="5" ry="6" fill="#0a0d1a"/>
            <ellipse cx="-70" cy="-12" rx="5" ry="14" fill="#0a0d1a"/>
            <ellipse cx="-70" cy="-28" rx="5" ry="6" fill="#0a0d1a"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">"God Himself will provide the lamb"</text>
        </svg>`
      },
      {
        id: 'altar',
        title: 'The Altar',
        scriptureRef: 'Genesis 22:9-10',
        bibleText: '"Then he reached out his hand and took the knife to slay his son."',
        narration: 'They built the altar together — stones, wood, the place prepared. Isaac let himself be bound. There is no record of resistance. Abraham raised the knife. Every father who has ever read this scene feels the weight of that moment. So did Abraham.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'aba', skyTop:'#1a0a16', skyMid:'#3d1414', skyBot:'#5a1818', stars:false})}
          <!-- Heavy red-tinted clouds -->
          <ellipse cx="200" cy="120" rx="220" ry="40" fill="rgba(40,12,12,0.5)"/>
          <ellipse cx="600" cy="100" rx="240" ry="50" fill="rgba(40,12,12,0.5)"/>
          <!-- Mountain summit ground -->
          <path d="M 0 380 Q 200 360 400 370 Q 600 360 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Stone altar with wood on top -->
          <g transform="translate(400 370)">
            <!-- Stones -->
            <rect x="-70" y="0" width="140" height="20" fill="#3d2a16" stroke="rgba(251,191,36,0.45)" stroke-width="1"/>
            <rect x="-78" y="-18" width="156" height="22" fill="#251607" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <line x1="-50" y1="-18" x2="-50" y2="4" stroke="rgba(251,191,36,0.3)" stroke-width="0.8"/>
            <line x1="-10" y1="-18" x2="-10" y2="4" stroke="rgba(251,191,36,0.3)" stroke-width="0.8"/>
            <line x1="30" y1="-18" x2="30" y2="4" stroke="rgba(251,191,36,0.3)" stroke-width="0.8"/>
            <!-- Wood arranged on top -->
            <line x1="-60" y1="-22" x2="60" y2="-22" stroke="#3d2a16" stroke-width="6"/>
            <line x1="-60" y1="-30" x2="60" y2="-30" stroke="#3d2a16" stroke-width="6"/>
            <!-- Isaac bound -->
            <ellipse cx="0" cy="-36" rx="50" ry="8" fill="#1a1233"/>
            <ellipse cx="-44" cy="-36" rx="8" ry="9" fill="#1a1233"/>
            <!-- Rope -->
            <line x1="-50" y1="-36" x2="-38" y2="-36" stroke="rgba(254,243,199,0.5)" stroke-width="1.5"/>
            <line x1="-20" y1="-36" x2="-12" y2="-36" stroke="rgba(254,243,199,0.5)" stroke-width="1.5"/>
            <line x1="10" y1="-36" x2="18" y2="-36" stroke="rgba(254,243,199,0.5)" stroke-width="1.5"/>
            <line x1="32" y1="-36" x2="40" y2="-36" stroke="rgba(254,243,199,0.5)" stroke-width="1.5"/>
          </g>
          <!-- Abraham, raised knife -->
          <g transform="translate(400 280)">
            <ellipse cx="0" cy="0" rx="12" ry="34" fill="#1a1233"/>
            <ellipse cx="0" cy="-32" rx="11" ry="13" fill="#1a1233"/>
            <!-- Raised arm with knife -->
            <line x1="6" y1="-18" x2="36" y2="-78" stroke="#1a1233" stroke-width="5"/>
            <polygon points="32,-78 40,-92 44,-78" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <!-- Beard -->
            <path d="M -8 -26 Q 0 -16 8 -26" stroke="rgba(251,191,36,0.45)" stroke-width="1.2" fill="none"/>
          </g>
          <!-- Wind / tension lines -->
          <g stroke="rgba(254,243,199,0.18)" stroke-width="1" fill="none">
            <path d="M 60 200 Q 120 195 180 200"/>
            <path d="M 620 220 Q 680 215 740 220"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">Moriah · the place prepared</text>
        </svg>`
      },
      {
        id: 'ram',
        title: 'The Ram in the Thicket',
        scriptureRef: 'Genesis 22:11-14',
        bibleText: '"Do not lay a hand on the boy. Now I know that you fear God." Abraham looked up and there in a thicket he saw a ram caught by its horns.',
        narration: 'A voice from heaven stopped the knife. A ram, snared in nearby brush — provided. Abraham named that place "The Lord Will Provide." Centuries later, on a hill in the same region called Moriah, God would not spare His own Son. Isaac was spared. Jesus was not. That is the gospel.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'abr', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e'})}
          <!-- Bright opening in the sky -->
          <radialGradient id="abrLight" cx="0.5" cy="0.25" r="0.55">
            <stop offset="0%" stop-color="rgba(254,243,199,0.85)"/>
            <stop offset="50%" stop-color="rgba(251,191,36,0.32)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="120" rx="340" ry="160" fill="url(#abrLight)"/>
          <!-- Angel figure suggested in the light -->
          <ellipse cx="400" cy="110" rx="22" ry="36" fill="rgba(254,243,199,0.7)" opacity="0.85"/>
          <ellipse cx="400" cy="80" rx="14" ry="18" fill="rgba(254,243,199,0.9)"/>
          <path d="M 380 100 Q 350 90 340 120 M 420 100 Q 450 90 460 120" stroke="rgba(254,243,199,0.7)" stroke-width="2" fill="none"/>
          <!-- Ground -->
          <path d="M 0 400 Q 200 380 400 395 Q 600 380 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Empty altar with knife on stones -->
          <g transform="translate(330 370)">
            <rect x="-60" y="0" width="120" height="18" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <rect x="-68" y="-18" width="136" height="22" fill="#251607" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
            <line x1="-40" y1="-18" x2="-40" y2="4" stroke="rgba(251,191,36,0.3)" stroke-width="0.8"/>
            <line x1="0" y1="-18" x2="0" y2="4" stroke="rgba(251,191,36,0.3)" stroke-width="0.8"/>
            <line x1="35" y1="-18" x2="35" y2="4" stroke="rgba(251,191,36,0.3)" stroke-width="0.8"/>
            <!-- Knife laid down on top -->
            <line x1="-25" y1="-22" x2="15" y2="-22" stroke="#fef3c7" stroke-width="2"/>
            <polygon points="15,-24 24,-22 15,-20" fill="#fef3c7"/>
          </g>
          <!-- Thicket with ram on the right -->
          <g transform="translate(580 390)">
            <!-- Brush silhouette -->
            <ellipse cx="0" cy="0" rx="60" ry="22" fill="#1e1638"/>
            <path d="M -55 -8 Q -40 -28 -20 -16 M -10 -16 Q 0 -34 12 -20 M 20 -16 Q 36 -32 50 -14" stroke="#1e1638" stroke-width="3" fill="none"/>
            <!-- Ram body -->
            <ellipse cx="0" cy="-12" rx="32" ry="14" fill="#0a0d1a"/>
            <!-- Ram head -->
            <ellipse cx="-26" cy="-20" rx="11" ry="9" fill="#0a0d1a"/>
            <!-- Curved horns -->
            <path d="M -30 -25 Q -42 -22 -42 -10 Q -42 0 -34 4" stroke="#fef3c7" stroke-width="2.5" fill="none"/>
            <path d="M -22 -27 Q -10 -28 -8 -16 Q -8 -4 -16 0" stroke="#fef3c7" stroke-width="2.5" fill="none"/>
            <!-- Legs partly in brush -->
            <line x1="-12" y1="0" x2="-12" y2="8" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="10" y1="0" x2="10" y2="8" stroke="#0a0d1a" stroke-width="3"/>
          </g>
          <!-- Abraham bowing, knife dropped -->
          <g transform="translate(260 420)">
            <ellipse cx="0" cy="0" rx="14" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-18" rx="10" ry="11" fill="#1a1233"/>
            <path d="M -8 -8 Q 0 0 8 -8" stroke="rgba(251,191,36,0.4)" stroke-width="1" fill="none"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Jehovah-Jireh — The Lord Will Provide"</text>
        </svg>`
      },
    ],
    closing: 'Abraham\'s faith was not blind obedience to a tyrant. It was deep trust in the character of a God who had kept every previous promise. He believed God could even raise the dead, if it came to that (Hebrews 11:19). And in the ram he saw a shadow of what God would one day do at Calvary — provide the sacrifice Himself, so that we would not have to.',
    closingPrompt: 'What "Isaac" might God be asking you to surrender — and do you trust that He provides on the other side of the test?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 5 — Joseph & His Brothers (Phase 5.7 content sprint, batch 1)
  // ════════════════════════════════════════════════════════════
  {
    id: 'joseph',
    title: 'Joseph & His Brothers',
    subtitle: 'Betrayal, prison, providence, and a family restored.',
    icon: '👑',
    color: '#a78bfa',
    accentColor: '#fef3c7',
    era: 'patriarchs',
    scriptureRef: 'Genesis 37-50',
    duration: '~8 min',
    scenes: [
      {
        id: 'coat',
        title: 'The Dreams and the Coat',
        scriptureRef: 'Genesis 37:3-11',
        bibleText: '"They hated him all the more because of his dream and what he had said."',
        narration: 'Jacob loved Joseph more than his other sons, and gave him a coat of many colors. Joseph dreamed: sheaves of wheat bowing, sun and moon and stars bowing. He told his brothers. He told his father. Resentment burned in the family.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jsc', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e'})}
          <!-- Soft warm glow on Joseph -->
          <ellipse cx="400" cy="320" rx="180" ry="120" fill="rgba(251,191,36,0.18)"/>
          <!-- Ground -->
          <path d="M 0 400 Q 200 380 400 395 Q 600 380 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Joseph in center, coat with colorful stripes -->
          <g transform="translate(400 410)">
            <!-- Body in striped coat -->
            <path d="M -22 0 Q -26 -60 0 -75 Q 26 -60 22 0 Z" fill="#3d2a5e"/>
            <!-- Coat stripes -->
            <path d="M -22 -10 Q 0 -8 22 -10" stroke="#fbbf24" stroke-width="3" fill="none"/>
            <path d="M -24 -22 Q 0 -20 24 -22" stroke="#f87171" stroke-width="3" fill="none"/>
            <path d="M -25 -34 Q 0 -32 25 -34" stroke="#38bdf8" stroke-width="3" fill="none"/>
            <path d="M -26 -46 Q 0 -44 26 -46" stroke="#22c55e" stroke-width="3" fill="none"/>
            <path d="M -26 -58 Q 0 -56 26 -58" stroke="#fef3c7" stroke-width="3" fill="none"/>
            <!-- Head -->
            <ellipse cx="0" cy="-88" rx="13" ry="17" fill="#1a1233"/>
            <!-- Subtle halo -->
            <circle cx="0" cy="-88" r="22" fill="none" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
          </g>
          <!-- Brothers in shadow on either side -->
          <g fill="#0a0d1a">
            <g transform="translate(160 425)">
              <ellipse cx="0" cy="0" rx="11" ry="32"/>
              <ellipse cx="0" cy="-30" rx="9" ry="11"/>
            </g>
            <g transform="translate(220 430)">
              <ellipse cx="0" cy="0" rx="11" ry="30"/>
              <ellipse cx="0" cy="-28" rx="9" ry="11"/>
            </g>
            <g transform="translate(280 425)">
              <ellipse cx="0" cy="0" rx="11" ry="32"/>
              <ellipse cx="0" cy="-30" rx="9" ry="11"/>
            </g>
            <g transform="translate(520 425)">
              <ellipse cx="0" cy="0" rx="11" ry="32"/>
              <ellipse cx="0" cy="-30" rx="9" ry="11"/>
            </g>
            <g transform="translate(580 430)">
              <ellipse cx="0" cy="0" rx="11" ry="30"/>
              <ellipse cx="0" cy="-28" rx="9" ry="11"/>
            </g>
            <g transform="translate(640 425)">
              <ellipse cx="0" cy="0" rx="11" ry="32"/>
              <ellipse cx="0" cy="-30" rx="9" ry="11"/>
            </g>
          </g>
          <!-- Wheat sheaves bowing (small symbolic illustration in upper sky) -->
          <g transform="translate(400 130)" opacity="0.6">
            <g transform="translate(-90 0)">
              <line x1="-6" y1="0" x2="-6" y2="-20" stroke="#fbbf24" stroke-width="1.5"/>
              <line x1="0" y1="2" x2="0" y2="-22" stroke="#fbbf24" stroke-width="1.5"/>
              <line x1="6" y1="0" x2="6" y2="-20" stroke="#fbbf24" stroke-width="1.5"/>
              <ellipse cx="0" cy="-22" rx="9" ry="5" fill="#fbbf24" transform="rotate(-30 0 -22)"/>
            </g>
            <g transform="translate(90 0) rotate(180)">
              <line x1="-6" y1="0" x2="-6" y2="-20" stroke="#fbbf24" stroke-width="1.5"/>
              <line x1="0" y1="2" x2="0" y2="-22" stroke="#fbbf24" stroke-width="1.5"/>
              <line x1="6" y1="0" x2="6" y2="-20" stroke="#fbbf24" stroke-width="1.5"/>
              <ellipse cx="0" cy="-22" rx="9" ry="5" fill="#fbbf24" transform="rotate(-30 0 -22)"/>
            </g>
            <line x1="-72" y1="0" x2="72" y2="0" stroke="rgba(251,191,36,0.3)" stroke-width="0.8" stroke-dasharray="3 3"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"Listen to this dream I had…"</text>
        </svg>`
      },
      {
        id: 'sold',
        title: 'Sold into Egypt',
        scriptureRef: 'Genesis 37:23-28',
        bibleText: '"They sold him for twenty shekels of silver to the Ishmaelites, who took him to Egypt."',
        narration: 'When their chance came, the brothers stripped him of his coat and threw him into a dry well. A caravan of traders passed. For twenty pieces of silver Joseph was sold. They dipped the coat in goat blood and brought it to their father. Jacob mourned for years.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jss', skyTop:'#0a0d1a', skyMid:'#3d2a16', skyBot:'#5a3220', stars:false})}
          <!-- Hot sun -->
          <circle cx="120" cy="120" r="38" fill="#fbbf24" opacity="0.55"/>
          <circle cx="120" cy="120" r="22" fill="#fef3c7"/>
          <!-- Desert horizon -->
          <path d="M 0 360 Q 200 340 400 360 Q 600 340 800 360 L 800 500 L 0 500 Z" fill="#3d2a16" opacity="0.85"/>
          <path d="M 0 420 Q 200 400 400 420 Q 600 400 800 420 L 800 500 L 0 500 Z" fill="#1a0a16"/>
          <!-- Pit (cistern) in foreground -->
          <ellipse cx="250" cy="430" rx="80" ry="18" fill="#0a0d1a"/>
          <ellipse cx="250" cy="425" rx="78" ry="14" fill="#1a0a16"/>
          <!-- Joseph in the pit (just head and shoulders showing) -->
          <g transform="translate(250 420)">
            <ellipse cx="0" cy="-2" rx="12" ry="6" fill="#1a1233"/>
            <ellipse cx="0" cy="-10" rx="9" ry="11" fill="#1a1233"/>
            <line x1="-6" y1="-4" x2="-12" y2="6" stroke="#1a1233" stroke-width="2"/>
            <line x1="6" y1="-4" x2="12" y2="6" stroke="#1a1233" stroke-width="2"/>
          </g>
          <!-- Coat being held up by a brother -->
          <g transform="translate(180 390)">
            <path d="M -16 0 Q -16 -34 0 -38 Q 16 -34 16 0 Z" fill="#3d2a5e"/>
            <path d="M -16 -8 Q 0 -6 16 -8" stroke="#fbbf24" stroke-width="2"/>
            <path d="M -16 -18 Q 0 -16 16 -18" stroke="#f87171" stroke-width="2"/>
            <path d="M -16 -28 Q 0 -26 16 -28" stroke="#38bdf8" stroke-width="2"/>
          </g>
          <!-- Brothers standing around -->
          <g fill="#0a0d1a">
            <g transform="translate(150 425)">
              <ellipse cx="0" cy="0" rx="10" ry="28"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
              <line x1="-3" y1="-12" x2="-3" y2="-32" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(340 425)">
              <ellipse cx="0" cy="0" rx="10" ry="28"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
              <line x1="6" y1="-14" x2="14" y2="6" stroke="#0a0d1a" stroke-width="2"/>
            </g>
            <g transform="translate(380 430)">
              <ellipse cx="0" cy="0" rx="10" ry="28"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
            </g>
          </g>
          <!-- Ishmaelite caravan in distance (3 camels) -->
          <g transform="translate(550 370)" opacity="0.85">
            <g transform="translate(0 0)">
              <ellipse cx="0" cy="0" rx="22" ry="8" fill="#0a0d1a"/>
              <path d="M -10 -4 Q -12 -16 -4 -16 Q 0 -16 2 -4" fill="#0a0d1a"/>
              <path d="M 8 -4 Q 10 -18 16 -18 Q 22 -18 20 -4" fill="#0a0d1a"/>
              <line x1="-14" y1="6" x2="-14" y2="18" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="14" y1="6" x2="14" y2="18" stroke="#0a0d1a" stroke-width="3"/>
              <ellipse cx="-20" cy="-16" rx="4" ry="6" fill="#0a0d1a"/>
              <ellipse cx="12" cy="-26" rx="6" ry="9" fill="#1a1233"/>
            </g>
            <g transform="translate(50 -6)">
              <ellipse cx="0" cy="0" rx="20" ry="7" fill="#0a0d1a" opacity="0.85"/>
              <path d="M -10 -4 Q -12 -16 -4 -16 Q 0 -16 2 -4" fill="#0a0d1a" opacity="0.85"/>
              <path d="M 8 -4 Q 10 -18 16 -18 Q 20 -18 18 -4" fill="#0a0d1a" opacity="0.85"/>
              <line x1="-12" y1="6" x2="-12" y2="16" stroke="#0a0d1a" stroke-width="3" opacity="0.85"/>
              <line x1="12" y1="6" x2="12" y2="16" stroke="#0a0d1a" stroke-width="3" opacity="0.85"/>
              <ellipse cx="-18" cy="-16" rx="4" ry="5" fill="#0a0d1a" opacity="0.85"/>
            </g>
            <g transform="translate(100 -10)" opacity="0.7">
              <ellipse cx="0" cy="0" rx="18" ry="6" fill="#0a0d1a"/>
              <path d="M -8 -4 Q -10 -14 -4 -14 Q 0 -14 2 -4" fill="#0a0d1a"/>
              <path d="M 8 -4 Q 10 -16 14 -16 Q 18 -16 16 -4" fill="#0a0d1a"/>
              <ellipse cx="-16" cy="-14" rx="4" ry="5" fill="#0a0d1a"/>
            </g>
          </g>
          <!-- Coins (small gold dots in transaction) -->
          <g fill="#fbbf24">
            <circle cx="430" cy="395" r="2.2"/>
            <circle cx="436" cy="392" r="2"/>
            <circle cx="441" cy="396" r="2.2"/>
            <circle cx="447" cy="393" r="2"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Twenty shekels of silver</text>
        </svg>`
      },
      {
        id: 'pharaoh',
        title: "Pharaoh's Dreams",
        scriptureRef: 'Genesis 41:14-40',
        bibleText: '"I cannot do it, Pharaoh replied, but God will give Pharaoh the answer he desires."',
        narration: 'Years passed. Prison. Forgotten. Then Pharaoh had two terrifying dreams no wise man could read. Joseph was summoned. "Not I," he told Pharaoh, "but God." He interpreted the dreams: seven years of plenty, seven of famine. Pharaoh made the foreign slave second in command over all Egypt.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jsp', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <!-- Two large columns framing throne hall -->
          <g fill="#3d2a16" stroke="rgba(251,191,36,0.45)" stroke-width="1">
            <rect x="80" y="120" width="60" height="320"/>
            <rect x="70" y="110" width="80" height="14"/>
            <rect x="660" y="120" width="60" height="320"/>
            <rect x="650" y="110" width="80" height="14"/>
            <!-- Hieroglyph hints on columns -->
            <rect x="100" y="200" width="20" height="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="100" y="240" width="20" height="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="100" y="280" width="20" height="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="680" y="200" width="20" height="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="680" y="240" width="20" height="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="680" y="280" width="20" height="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
          </g>
          <!-- Throne dais -->
          <path d="M 250 440 L 550 440 L 540 410 L 260 410 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
          <path d="M 260 410 L 540 410 L 530 390 L 270 390 Z" fill="#251607" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
          <!-- Throne -->
          <g transform="translate(500 380)">
            <rect x="-20" y="-20" width="40" height="40" fill="#0a0d1a"/>
            <rect x="-22" y="-50" width="44" height="34" fill="#0a0d1a"/>
            <rect x="-18" y="-46" width="36" height="22" fill="#3d2a16"/>
          </g>
          <!-- Pharaoh on throne -->
          <g transform="translate(500 360)">
            <ellipse cx="0" cy="0" rx="12" ry="20" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="10" ry="12" fill="#1a1233"/>
            <!-- Crown (nemes hint) -->
            <path d="M -12 -28 L -16 -36 L 16 -36 L 12 -28 Z" fill="#fbbf24"/>
            <rect x="-2" y="-40" width="4" height="6" fill="#fef3c7"/>
            <!-- Scepter -->
            <line x1="-10" y1="-10" x2="-24" y2="-44" stroke="#fbbf24" stroke-width="2"/>
            <circle cx="-24" cy="-44" r="3" fill="#fef3c7"/>
          </g>
          <!-- Joseph standing before throne -->
          <g transform="translate(330 400)">
            <ellipse cx="0" cy="0" rx="12" ry="36" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-34" rx="10" ry="12" fill="#0a0d1a"/>
            <!-- Hands gesturing -->
            <line x1="-10" y1="-20" x2="-16" y2="-44" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="10" y1="-20" x2="16" y2="-44" stroke="#0a0d1a" stroke-width="3"/>
            <!-- Halo of God's wisdom -->
            <circle cx="0" cy="-34" r="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          </g>
          <!-- Cows of dream above (seven thin, seven fat) -->
          <g transform="translate(400 180)" opacity="0.55">
            <g transform="translate(-70 0)">
              <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fbbf24"/>
              <line x1="-7" y1="6" x2="-7" y2="12" stroke="#fbbf24" stroke-width="1.5"/>
              <line x1="7" y1="6" x2="7" y2="12" stroke="#fbbf24" stroke-width="1.5"/>
              <ellipse cx="-15" cy="-3" rx="4" ry="4" fill="#fbbf24"/>
            </g>
            <g transform="translate(70 0)">
              <ellipse cx="0" cy="0" rx="10" ry="3" fill="rgba(254,243,199,0.45)"/>
              <line x1="-5" y1="2" x2="-5" y2="10" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
              <line x1="5" y1="2" x2="5" y2="10" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
              <ellipse cx="-10" cy="-2" rx="3" ry="3" fill="rgba(254,243,199,0.45)"/>
            </g>
            <text x="0" y="32" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="rgba(251,191,36,0.6)">SEVEN AND SEVEN</text>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">"Not I, but God"</text>
        </svg>`
      },
      {
        id: 'famine',
        title: 'Famine Brings Them Back',
        scriptureRef: 'Genesis 42-44',
        bibleText: '"It was not you who sent me here, but God."',
        narration: 'The famine came as Joseph said. Eventually his brothers, desperate, traveled to Egypt to buy grain. They did not recognize the brother they had sold, now ruling. He tested them. Watched. Wept in private. Then he revealed himself: "I am Joseph, your brother, whom you sold into Egypt."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jsf', skyTop:'#1a1233', skyMid:'#3d2a16', skyBot:'#4a3220', stars:false})}
          <!-- Sun -->
          <circle cx="120" cy="100" r="32" fill="#fbbf24" opacity="0.5"/>
          <circle cx="120" cy="100" r="18" fill="#fef3c7"/>
          <!-- Distant pyramids -->
          <g fill="#0a0d1a" opacity="0.85">
            <polygon points="540,360 620,260 700,360"/>
            <polygon points="640,360 700,290 760,360"/>
          </g>
          <!-- Ground -->
          <path d="M 0 380 Q 200 360 400 375 Q 600 360 800 380 L 800 500 L 0 500 Z" fill="#1a0a16"/>
          <!-- Raised platform with Joseph (governor) -->
          <path d="M 280 440 L 520 440 L 510 410 L 290 410 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
          <g transform="translate(400 370)">
            <ellipse cx="0" cy="0" rx="14" ry="38" fill="#1a1233"/>
            <ellipse cx="0" cy="-36" rx="11" ry="13" fill="#1a1233"/>
            <!-- Egyptian collar -->
            <ellipse cx="0" cy="-22" rx="14" ry="3" fill="#fbbf24"/>
            <!-- Headdress hint -->
            <path d="M -11 -42 L -14 -50 L 14 -50 L 11 -42 Z" fill="#fbbf24"/>
            <!-- Halo / authority -->
            <circle cx="0" cy="-36" r="22" fill="none" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
          </g>
          <!-- Brothers kneeling/bowing -->
          <g fill="#0a0d1a">
            <g transform="translate(180 440)">
              <path d="M -10 0 L 10 0 L 8 -16 Q 0 -22 -8 -16 Z"/>
              <ellipse cx="0" cy="-22" rx="7" ry="7"/>
            </g>
            <g transform="translate(220 444)">
              <path d="M -10 0 L 10 0 L 8 -16 Q 0 -22 -8 -16 Z"/>
              <ellipse cx="0" cy="-22" rx="7" ry="7"/>
            </g>
            <g transform="translate(260 442)">
              <path d="M -10 0 L 10 0 L 8 -16 Q 0 -22 -8 -16 Z"/>
              <ellipse cx="0" cy="-22" rx="7" ry="7"/>
            </g>
          </g>
          <!-- Sacks of grain -->
          <g fill="#3d2a16" stroke="rgba(251,191,36,0.35)" stroke-width="0.8">
            <path d="M 580 440 Q 575 410 590 405 Q 605 410 600 440 Z"/>
            <path d="M 620 440 Q 615 410 630 405 Q 645 410 640 440 Z"/>
            <path d="M 600 438 Q 595 412 610 408 Q 625 412 620 438 Z"/>
          </g>
          <!-- A tear / drop near Joseph (private weeping) -->
          <circle cx="412" cy="346" r="2" fill="rgba(254,243,199,0.7)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">They did not recognize him</text>
        </svg>`
      },
      {
        id: 'reunion',
        title: 'Reconciliation',
        scriptureRef: 'Genesis 45:14-15, 50:20',
        bibleText: '"You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives."',
        narration: 'Joseph embraced them, weeping. They wept with him. The brothers who had betrayed him became the family he saved. Decades later, at his father\'s death, the brothers feared retribution. Joseph said no — what they meant for evil, God had used for good. Forgiveness had the last word.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jsr', skyTop:'#241846', skyMid:'#3d2a5e', skyBot:'#5a3f7a'})}
          <!-- Soft dawn glow over horizon -->
          <radialGradient id="jsrGlow" cx="0.5" cy="0.8" r="0.7">
            <stop offset="0%" stop-color="rgba(254,243,199,0.45)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="360" rx="420" ry="180" fill="url(#jsrGlow)"/>
          <!-- Distant Egypt skyline -->
          <g fill="#1a1233" opacity="0.85">
            <polygon points="80,400 140,330 200,400"/>
            <polygon points="600,400 660,330 720,400"/>
            <rect x="290" y="350" width="14" height="50"/>
            <rect x="320" y="340" width="14" height="60"/>
            <rect x="466" y="340" width="14" height="60"/>
            <rect x="496" y="350" width="14" height="50"/>
          </g>
          <!-- Ground -->
          <path d="M 0 420 Q 200 408 400 416 Q 600 405 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Joseph in center embraced by brothers -->
          <g transform="translate(400 440)">
            <!-- Joseph (center, slightly taller) -->
            <ellipse cx="0" cy="0" rx="14" ry="40" fill="#1a1233"/>
            <ellipse cx="0" cy="-38" rx="11" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-24" rx="14" ry="3" fill="#fbbf24"/>
            <circle cx="0" cy="-38" r="22" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <!-- Brother left -->
            <ellipse cx="-30" cy="2" rx="12" ry="36" fill="#0a0d1a"/>
            <ellipse cx="-30" cy="-32" rx="10" ry="12" fill="#0a0d1a"/>
            <!-- Brother right -->
            <ellipse cx="30" cy="2" rx="12" ry="36" fill="#0a0d1a"/>
            <ellipse cx="30" cy="-32" rx="10" ry="12" fill="#0a0d1a"/>
            <!-- Embracing arms across the three -->
            <path d="M -25 -28 Q 0 -20 25 -28" stroke="rgba(254,243,199,0.55)" stroke-width="3" fill="none"/>
            <path d="M -22 -14 Q 0 -8 22 -14" stroke="rgba(254,243,199,0.4)" stroke-width="2" fill="none"/>
          </g>
          <!-- More brothers in soft background -->
          <g fill="#0a0d1a" opacity="0.7">
            <g transform="translate(290 445)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
            </g>
            <g transform="translate(250 448)">
              <ellipse cx="0" cy="0" rx="9" ry="26"/>
              <ellipse cx="0" cy="-24" rx="7" ry="9"/>
            </g>
            <g transform="translate(510 445)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
            </g>
            <g transform="translate(550 448)">
              <ellipse cx="0" cy="0" rx="9" ry="26"/>
              <ellipse cx="0" cy="-24" rx="7" ry="9"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"What you meant for evil, God meant for good"</text>
        </svg>`
      },
    ],
    closing: 'Joseph\'s story is one of the longest in Genesis — and one of the most quietly stunning. God never spoke audibly to Joseph the way He did to Abraham. There were no burning bushes. Just slavery, prison, and finally power — every step shaped by hidden providence. The same God who worked through betrayal to save a nation is at work in your life right now, in ways you may not see for decades.',
    closingPrompt: 'Where in your life has something that felt like a betrayal or setback turned out to be God positioning you — and what are you currently in the middle of that might be the same thing?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 6 — Moses & the Burning Bush (Phase 5.7 content sprint)
  // ════════════════════════════════════════════════════════════
  {
    id: 'burning-bush',
    title: 'Moses & the Burning Bush',
    subtitle: 'A shepherd. A flame that would not die.',
    icon: '🔥',
    color: '#fb923c',
    accentColor: '#fef3c7',
    era: 'exodus-conquest',
    scriptureRef: 'Exodus 3',
    duration: '~5 min',
    scenes: [
      {
        id: 'shepherd',
        title: 'Shepherd in the Wilderness',
        scriptureRef: 'Exodus 3:1',
        bibleText: '"Now Moses was tending the flock of Jethro his father-in-law… and he led the flock to the far side of the wilderness and came to Horeb, the mountain of God."',
        narration: 'Once a prince of Egypt, now a shepherd in Midian. Forty years of obscurity. Moses had killed an Egyptian, run for his life, and never been the same. He led another man\'s flock through a desert he never expected to leave. And then he saw a flicker among the rocks.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'mbs', skyTop:'#241846', skyMid:'#3d2a5e', skyBot:'#5a3f7a', stars:false})}
          <!-- Setting sun -->
          <circle cx="160" cy="170" r="36" fill="#fb923c" opacity="0.55"/>
          <circle cx="160" cy="170" r="22" fill="#fbbf24"/>
          <!-- Mountain rising on the right (Horeb) -->
          <polygon points="500,400 700,160 800,400" fill="#1a1233" opacity="0.95"/>
          <polygon points="620,250 700,160 740,250" fill="#fef3c7" opacity="0.2"/>
          <!-- Lower hills -->
          <path d="M 0 380 Q 150 350 300 370 Q 450 350 600 380 L 600 420 L 0 420 Z" fill="#1e1638" opacity="0.8"/>
          <!-- Ground -->
          <path d="M 0 420 Q 200 408 400 416 Q 600 405 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Moses with staff -->
          <g transform="translate(240 430)">
            <ellipse cx="0" cy="0" rx="11" ry="34" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-32" rx="10" ry="12" fill="#0a0d1a"/>
            <!-- Beard -->
            <path d="M -7 -26 Q 0 -16 7 -26" stroke="rgba(251,191,36,0.45)" stroke-width="1.2" fill="none"/>
            <!-- Staff -->
            <line x1="14" y1="-50" x2="22" y2="20" stroke="#0a0d1a" stroke-width="3"/>
            <!-- Foot turned slightly forward -->
          </g>
          <!-- Sheep silhouettes -->
          <g fill="#0a0d1a" opacity="0.85">
            <ellipse cx="320" cy="440" rx="14" ry="9"/>
            <ellipse cx="308" cy="436" rx="5" ry="5"/>
            <ellipse cx="380" cy="445" rx="13" ry="8"/>
            <ellipse cx="370" cy="441" rx="5" ry="5"/>
            <ellipse cx="430" cy="440" rx="14" ry="9"/>
            <ellipse cx="442" cy="436" rx="5" ry="5"/>
            <ellipse cx="480" cy="448" rx="12" ry="7"/>
            <ellipse cx="490" cy="444" rx="4" ry="4"/>
          </g>
          <!-- Faint flicker on the mountainside -->
          <g transform="translate(640 320)">
            <ellipse cx="0" cy="0" rx="4" ry="6" fill="#fbbf24" opacity="0.85"/>
            <ellipse cx="0" cy="-2" rx="2" ry="4" fill="#fef3c7"/>
            <circle r="14" fill="rgba(251,191,36,0.18)"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">Forty years on the far side of the wilderness</text>
        </svg>`
      },
      {
        id: 'bush',
        title: 'The Bush That Would Not Burn Out',
        scriptureRef: 'Exodus 3:2-6',
        bibleText: '"Take off your sandals, for the place where you are standing is holy ground."',
        narration: 'A bush blazed but was not consumed. Moses turned aside to see. A voice spoke from inside the flame: "Moses, Moses." He removed his sandals. He hid his face. The God of Abraham, of Isaac, of Jacob — was standing right there, in a thornbush, in a forgotten desert.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="mbbSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="55%" stop-color="#1a1233"/>
              <stop offset="100%" stop-color="#3d2a16"/>
            </linearGradient>
            <radialGradient id="mbbGlow" cx="0.5" cy="0.5" r="0.55">
              <stop offset="0%" stop-color="rgba(254,243,199,0.85)"/>
              <stop offset="40%" stop-color="rgba(251,191,36,0.55)"/>
              <stop offset="100%" stop-color="rgba(251,113,38,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#mbbSky)"/>
          <!-- Big radial halo from bush -->
          <ellipse cx="500" cy="320" rx="320" ry="220" fill="url(#mbbGlow)"/>
          <!-- Ground -->
          <path d="M 0 400 Q 200 380 400 395 Q 600 380 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Burning bush -->
          <g transform="translate(500 380)">
            <!-- Bush branches (silhouette) -->
            <g stroke="#0a0d1a" stroke-width="3" fill="none">
              <path d="M -30 0 Q -28 -50 -18 -70"/>
              <path d="M -12 0 Q -10 -56 0 -80"/>
              <path d="M 6 0 Q 8 -52 18 -72"/>
              <path d="M 24 0 Q 22 -44 32 -66"/>
            </g>
            <!-- Flames -->
            <g>
              <path d="M -30 -70 Q -36 -90 -22 -100 Q -10 -90 -16 -70 Z" fill="#fb923c"/>
              <path d="M -30 -82 Q -32 -92 -22 -98 Q -14 -90 -18 -80 Z" fill="#fbbf24"/>
              <path d="M -8 -80 Q -14 -106 0 -118 Q 14 -106 8 -80 Z" fill="#fb923c"/>
              <path d="M -6 -92 Q -10 -110 0 -116 Q 10 -110 6 -94 Z" fill="#fbbf24"/>
              <path d="M -2 -100 Q -4 -110 0 -114 Q 4 -110 2 -102 Z" fill="#fef3c7"/>
              <path d="M 14 -72 Q 10 -94 24 -104 Q 36 -94 30 -72 Z" fill="#fb923c"/>
              <path d="M 16 -84 Q 14 -98 24 -102 Q 32 -94 28 -84 Z" fill="#fbbf24"/>
              <path d="M 30 -68 Q 28 -84 38 -90 Q 46 -84 42 -68 Z" fill="#fb923c"/>
            </g>
            <!-- Halo of holiness -->
            <circle cx="0" cy="-86" r="60" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1"/>
            <circle cx="0" cy="-86" r="90" fill="none" stroke="rgba(251,191,36,0.25)" stroke-width="1"/>
          </g>
          <!-- Moses kneeling, sandals beside him -->
          <g transform="translate(280 420)">
            <ellipse cx="0" cy="0" rx="16" ry="16" fill="#1a1233"/>
            <ellipse cx="0" cy="-18" rx="11" ry="13" fill="#1a1233"/>
            <!-- Hand to face / hiding -->
            <ellipse cx="-6" cy="-14" rx="4" ry="3" fill="#0a0d1a"/>
            <!-- Beard -->
            <path d="M -7 -12 Q 0 -2 7 -12" stroke="rgba(251,191,36,0.4)" stroke-width="1.2" fill="none"/>
            <!-- Staff laid flat -->
            <line x1="-22" y1="10" x2="20" y2="10" stroke="#0a0d1a" stroke-width="2.5"/>
            <!-- Sandals -->
            <ellipse cx="-30" cy="14" rx="8" ry="3" fill="#3d2a16"/>
            <ellipse cx="-44" cy="14" rx="8" ry="3" fill="#3d2a16"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"The place where you are standing is holy ground"</text>
        </svg>`
      },
      {
        id: 'commission',
        title: 'The Commission and the Name',
        scriptureRef: 'Exodus 3:10-15',
        bibleText: '"I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you."',
        narration: 'God\'s word was specific and impossible: "Go. I am sending you to Pharaoh to bring my people out of Egypt." Moses argued — who am I, what shall I say, they will not believe me. God answered with His own name. Not a job description. Not a function. Simply: "I AM." Then He sent His reluctant servant back to face an empire.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'mbc', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e'})}
          <!-- Beam from above onto Moses -->
          <defs>
            <linearGradient id="mbcBeam" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="rgba(254,243,199,0.85)"/>
              <stop offset="55%" stop-color="rgba(251,191,36,0.35)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="400,0 320,440 480,440" fill="url(#mbcBeam)"/>
          <!-- Mountain horizon -->
          <path d="M 0 380 Q 200 320 400 360 Q 600 320 800 380 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 430 Q 200 410 400 425 Q 600 408 800 430 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Distant Egypt suggestion (pyramids on horizon) -->
          <g fill="#0a0d1a" opacity="0.7">
            <polygon points="580,380 620,330 660,380"/>
            <polygon points="650,380 690,340 730,380"/>
          </g>
          <!-- Moses with staff raised -->
          <g transform="translate(400 430)">
            <ellipse cx="0" cy="0" rx="13" ry="42" fill="#1a1233"/>
            <ellipse cx="0" cy="-40" rx="11" ry="14" fill="#1a1233"/>
            <!-- Beard -->
            <path d="M -8 -32 Q 0 -22 8 -32" stroke="rgba(251,191,36,0.5)" stroke-width="1.2" fill="none"/>
            <!-- Staff held up -->
            <line x1="14" y1="-30" x2="40" y2="-100" stroke="#1a1233" stroke-width="4"/>
            <!-- Small flame on the staff tip suggesting divine fire -->
            <ellipse cx="40" cy="-104" rx="5" ry="8" fill="#fb923c"/>
            <ellipse cx="40" cy="-106" rx="3" ry="5" fill="#fef3c7"/>
            <!-- Halo -->
            <circle cx="0" cy="-40" r="22" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- "I AM" text shimmering in upper sky -->
          <text x="400" y="120" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="32" letter-spacing="10" fill="rgba(254,243,199,0.85)">I  AM</text>
          <text x="400" y="148" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="6" fill="rgba(251,191,36,0.6)">WHO  I  AM</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">A reluctant prophet sent back to an empire</text>
        </svg>`
      },
    ],
    closing: 'God meets people in unimpressive places. A shepherd in a wilderness. A teenager in a small town. A working man at his job. You do not have to wait for a "religious" moment to encounter Him — He is the I AM who is present right now, in the ordinary place you are standing. The question is not whether God is speaking. It is whether you will turn aside to look.',
    closingPrompt: 'What "bush" in your everyday life might be God trying to get your attention — something you have been walking past, that He is asking you to turn aside and see?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 7 — David & Goliath (Phase 5.7 content sprint, batch 1)
  // ════════════════════════════════════════════════════════════
  {
    id: 'david-goliath',
    title: 'David & Goliath',
    subtitle: 'A shepherd boy. A nine-foot giant. The name of the Lord.',
    icon: '🪨',
    color: '#34d399',
    accentColor: '#fef3c7',
    era: 'united-kingdom',
    scriptureRef: '1 Samuel 17',
    duration: '~6 min',
    scenes: [
      {
        id: 'giant',
        title: 'The Giant in the Valley',
        scriptureRef: '1 Samuel 17:4-11',
        bibleText: '"A champion named Goliath, who was from Gath, came out of the Philistine camp. He was over nine feet tall."',
        narration: 'For forty days the giant came out morning and evening. Bronze armor flashing in the sun. His shield-bearer ahead of him. He cursed Israel\'s God and called for a single combatant. The armies of Saul stayed in their tents. No one would go.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dvg', skyTop:'#1a1233', skyMid:'#3d2a16', skyBot:'#4a3220', stars:false})}
          <!-- Distant hills -->
          <path d="M 0 320 Q 100 280 200 310 Q 300 280 400 310 Q 500 280 600 310 Q 700 285 800 320 L 800 500 L 0 500 Z" fill="#1e1638" opacity="0.85"/>
          <!-- Israelite army hill (left) -->
          <path d="M 0 380 Q 80 340 200 360 L 200 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Philistine army hill (right) -->
          <path d="M 600 360 Q 720 340 800 380 L 800 500 L 600 500 Z" fill="#0a0d1a"/>
          <!-- Valley floor in middle -->
          <path d="M 200 360 Q 400 420 600 360 L 600 500 L 200 500 Z" fill="#1a0a16"/>
          <!-- Goliath silhouette in center of valley (enormous) -->
          <g transform="translate(400 420)">
            <!-- Body -->
            <ellipse cx="0" cy="-30" rx="28" ry="55" fill="#0a0d1a"/>
            <!-- Head with helmet -->
            <ellipse cx="0" cy="-100" rx="20" ry="22" fill="#0a0d1a"/>
            <path d="M -20 -114 Q 0 -130 20 -114 L 20 -98 L -20 -98 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.6)" stroke-width="1"/>
            <!-- Plume on helmet -->
            <path d="M 0 -130 Q 4 -150 0 -160" stroke="#f87171" stroke-width="3" fill="none"/>
            <!-- Arms -->
            <line x1="-26" y1="-50" x2="-40" y2="0" stroke="#0a0d1a" stroke-width="14"/>
            <line x1="26" y1="-50" x2="40" y2="0" stroke="#0a0d1a" stroke-width="14"/>
            <!-- Shield -->
            <ellipse cx="-44" cy="-22" rx="14" ry="22" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <!-- Spear -->
            <line x1="42" y1="-2" x2="62" y2="-110" stroke="#0a0d1a" stroke-width="4"/>
            <polygon points="60,-110 70,-126 64,-110" fill="#fef3c7" stroke="rgba(251,191,36,0.6)" stroke-width="0.6"/>
            <!-- Legs -->
            <rect x="-18" y="20" width="14" height="30" fill="#0a0d1a"/>
            <rect x="4" y="20" width="14" height="30" fill="#0a0d1a"/>
            <!-- Bronze armor highlights -->
            <ellipse cx="0" cy="-50" rx="22" ry="6" fill="rgba(251,191,36,0.35)"/>
            <ellipse cx="0" cy="-35" rx="20" ry="5" fill="rgba(251,191,36,0.25)"/>
            <ellipse cx="0" cy="-20" rx="18" ry="5" fill="rgba(251,191,36,0.18)"/>
          </g>
          <!-- Israelite soldiers cowering (left) -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(100 425)">
              <ellipse cx="0" cy="0" rx="8" ry="22"/>
              <ellipse cx="0" cy="-20" rx="7" ry="8"/>
              <line x1="5" y1="-12" x2="11" y2="6" stroke="#0a0d1a" stroke-width="1.5"/>
            </g>
            <g transform="translate(130 430)">
              <ellipse cx="0" cy="0" rx="7" ry="20"/>
              <ellipse cx="0" cy="-18" rx="7" ry="7"/>
            </g>
            <g transform="translate(160 425)">
              <ellipse cx="0" cy="0" rx="8" ry="22"/>
              <ellipse cx="0" cy="-20" rx="7" ry="8"/>
            </g>
          </g>
          <!-- Philistine soldiers (right, less cowering) -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(670 425)">
              <ellipse cx="0" cy="0" rx="8" ry="22"/>
              <ellipse cx="0" cy="-20" rx="7" ry="8"/>
              <line x1="-3" y1="-12" x2="-3" y2="-30" stroke="#0a0d1a" stroke-width="2"/>
            </g>
            <g transform="translate(700 430)">
              <ellipse cx="0" cy="0" rx="7" ry="20"/>
              <ellipse cx="0" cy="-18" rx="7" ry="7"/>
            </g>
            <g transform="translate(730 425)">
              <ellipse cx="0" cy="0" rx="8" ry="22"/>
              <ellipse cx="0" cy="-20" rx="7" ry="8"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Forty days · no one would go</text>
        </svg>`
      },
      {
        id: 'arrives',
        title: 'David Arrives',
        scriptureRef: '1 Samuel 17:17-29',
        bibleText: '"The Lord who rescued me from the paw of the lion and the bear will rescue me from this Philistine."',
        narration: 'Jesse sent his youngest son to bring food to his brothers at the front. David arrived, heard the giant, and was outraged. Not at the Philistines — at his own people\'s silence. "Who is this uncircumcised Philistine that he should defy the armies of the living God?" His brothers told him to go home.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dva', skyTop:'#241846', skyMid:'#3d2a5e', skyBot:'#5a3f7a', stars:false})}
          <!-- Soft warm halo from David -->
          <ellipse cx="280" cy="380" rx="180" ry="120" fill="rgba(251,191,36,0.18)"/>
          <!-- Ground -->
          <path d="M 0 380 Q 200 360 400 375 Q 600 360 800 380 L 800 500 L 0 500 Z" fill="#1a0a16"/>
          <!-- Distant giant on the horizon (small now) -->
          <g transform="translate(680 360)" opacity="0.85">
            <ellipse cx="0" cy="-20" rx="11" ry="22" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-46" rx="8" ry="10" fill="#0a0d1a"/>
            <line x1="-11" y1="-22" x2="-16" y2="-2" stroke="#0a0d1a" stroke-width="6"/>
            <line x1="11" y1="-22" x2="16" y2="-2" stroke="#0a0d1a" stroke-width="6"/>
            <line x1="14" y1="-12" x2="22" y2="-58" stroke="#0a0d1a" stroke-width="2"/>
          </g>
          <text x="680" y="320" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(251,191,36,0.55)">GOLIATH</text>
          <!-- David in shepherd's clothes, foreground -->
          <g transform="translate(280 420)">
            <!-- Tunic body -->
            <path d="M -16 0 Q -18 -42 0 -54 Q 18 -42 16 0 Z" fill="#1a1233"/>
            <!-- Belt -->
            <line x1="-16" y1="-12" x2="16" y2="-12" stroke="#fbbf24" stroke-width="2"/>
            <!-- Sling at belt -->
            <line x1="14" y1="-10" x2="22" y2="6" stroke="#fef3c7" stroke-width="1.2"/>
            <line x1="14" y1="-10" x2="22" y2="14" stroke="#fef3c7" stroke-width="1.2"/>
            <ellipse cx="22" cy="10" rx="3" ry="1.5" fill="#3d2a16"/>
            <!-- Head -->
            <ellipse cx="0" cy="-66" rx="11" ry="13" fill="#1a1233"/>
            <!-- Loaves/sack in hand -->
            <ellipse cx="-22" cy="-8" rx="10" ry="7" fill="#3d2a16" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
            <!-- Halo -->
            <circle cx="0" cy="-66" r="20" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Brothers / soldiers in armor talking down to him -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(380 430)">
              <ellipse cx="0" cy="0" rx="10" ry="30"/>
              <ellipse cx="0" cy="-28" rx="9" ry="11"/>
              <rect x="-12" y="-14" width="24" height="4" fill="rgba(251,191,36,0.35)"/>
              <!-- Helmet hint -->
              <path d="M -10 -38 L -12 -42 L 12 -42 L 10 -38 Z" fill="#3d2a16"/>
            </g>
            <g transform="translate(430 432)">
              <ellipse cx="0" cy="0" rx="10" ry="28"/>
              <ellipse cx="0" cy="-26" rx="9" ry="11"/>
              <rect x="-12" y="-14" width="24" height="4" fill="rgba(251,191,36,0.3)"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">"Is there not a cause?"</text>
        </svg>`
      },
      {
        id: 'stones',
        title: 'Five Smooth Stones',
        scriptureRef: '1 Samuel 17:38-40',
        bibleText: '"He took his staff in his hand, chose five smooth stones from the stream, put them in the pouch of his shepherd\'s bag and, with his sling in his hand, approached the Philistine."',
        narration: 'Saul tried to dress David in his own armor. It did not fit. David put it down. Down at the brook he picked up five smooth stones — choosing carefully, as a shepherd does. His weapon was a sling. His confidence was the name of the Lord of hosts.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dvs', skyTop:'#241846', skyMid:'#3d2a5e', skyBot:'#1a1233'})}
          <!-- Moon -->
          <circle cx="640" cy="120" r="34" fill="#fef3c7" opacity="0.4"/>
          <circle cx="640" cy="120" r="26" fill="#fef3c7"/>
          <!-- Hills -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 285 800 310 L 800 500 L 0 500 Z" fill="#1a1233" opacity="0.85"/>
          <path d="M 0 380 Q 200 360 400 375 Q 600 360 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Stream curving through foreground -->
          <path d="M 0 460 Q 200 430 400 450 Q 600 470 800 440" stroke="#38bdf8" stroke-width="6" fill="none" opacity="0.55"/>
          <path d="M 0 460 Q 200 430 400 450 Q 600 470 800 440" stroke="#fef3c7" stroke-width="2" fill="none" opacity="0.45"/>
          <!-- Water sparkles -->
          <g fill="rgba(254,243,199,0.7)">
            <circle cx="150" cy="455" r="1.5"/>
            <circle cx="320" cy="450" r="1.2"/>
            <circle cx="480" cy="460" r="1.5"/>
            <circle cx="640" cy="455" r="1.2"/>
          </g>
          <!-- David crouched at stream -->
          <g transform="translate(380 430)">
            <ellipse cx="0" cy="0" rx="18" ry="20" fill="#1a1233"/>
            <ellipse cx="0" cy="-18" rx="11" ry="13" fill="#1a1233"/>
            <!-- Arm reaching into stream -->
            <line x1="-6" y1="-4" x2="-26" y2="18" stroke="#1a1233" stroke-width="4"/>
            <ellipse cx="-28" cy="18" rx="4" ry="3" fill="#1a1233"/>
            <!-- Halo -->
            <circle cx="0" cy="-18" r="20" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          </g>
          <!-- Five stones on a stream-side rock -->
          <g transform="translate(280 446)">
            <rect x="-32" y="-6" width="64" height="14" fill="#1a1233" rx="2"/>
            <circle cx="-20" cy="-3" r="4" fill="#fef3c7" stroke="rgba(251,191,36,0.6)" stroke-width="0.6"/>
            <circle cx="-8" cy="-2" r="4.5" fill="#fef3c7" stroke="rgba(251,191,36,0.6)" stroke-width="0.6"/>
            <circle cx="4" cy="-4" r="4" fill="#fef3c7" stroke="rgba(251,191,36,0.6)" stroke-width="0.6"/>
            <circle cx="16" cy="-3" r="4.5" fill="#fef3c7" stroke="rgba(251,191,36,0.6)" stroke-width="0.6"/>
            <circle cx="28" cy="-4" r="4" fill="#fef3c7" stroke="rgba(251,191,36,0.6)" stroke-width="0.6"/>
          </g>
          <!-- Shepherd's staff laid beside -->
          <line x1="170" y1="440" x2="250" y2="450" stroke="#3d2a16" stroke-width="4"/>
          <!-- Soft glow on the stones -->
          <ellipse cx="280" cy="442" rx="60" ry="20" fill="rgba(251,191,36,0.15)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">Chosen carefully · as a shepherd does</text>
        </svg>`
      },
      {
        id: 'sling',
        title: 'One Stone and a Name',
        scriptureRef: '1 Samuel 17:45-50',
        bibleText: '"You come against me with sword and spear and javelin, but I come against you in the name of the Lord Almighty."',
        narration: 'David ran toward the line. He fitted a stone, spun the sling, and let it fly. It struck the giant in the forehead. Goliath fell face down on the ground. The whole army watched. The boy with the sling stood over the corpse. Nine feet of armored death — defeated by a name.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dvf', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e'})}
          <!-- Beam of light striking down on the scene -->
          <defs>
            <linearGradient id="dvfBeam" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="rgba(254,243,199,0.7)"/>
              <stop offset="55%" stop-color="rgba(251,191,36,0.3)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="250,0 200,440 320,440" fill="url(#dvfBeam)"/>
          <!-- Hills -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 400 Q 400 380 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Goliath falling backward (right) -->
          <g transform="translate(560 430) rotate(20)">
            <ellipse cx="0" cy="0" rx="32" ry="22" fill="#0a0d1a"/>
            <ellipse cx="-32" cy="-12" rx="14" ry="18" fill="#0a0d1a"/>
            <line x1="20" y1="-6" x2="42" y2="-18" stroke="#0a0d1a" stroke-width="9"/>
            <line x1="-12" y1="-18" x2="-18" y2="-40" stroke="#0a0d1a" stroke-width="9"/>
            <!-- Helmet rolling -->
            <ellipse cx="-46" cy="6" rx="9" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
            <!-- Spear flying away -->
            <line x1="30" y1="-22" x2="78" y2="-62" stroke="#0a0d1a" stroke-width="3"/>
            <polygon points="76,-62 86,-72 80,-58" fill="#fef3c7"/>
          </g>
          <!-- David running, sling in motion (left/center) -->
          <g transform="translate(260 420)">
            <!-- Body leaning forward -->
            <ellipse cx="0" cy="0" rx="11" ry="34" transform="rotate(-12 0 0)" fill="#1a1233"/>
            <!-- Head -->
            <ellipse cx="-3" cy="-30" rx="10" ry="12" fill="#1a1233"/>
            <!-- Halo -->
            <circle cx="-3" cy="-30" r="20" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1.2"/>
            <!-- Forward leg -->
            <line x1="6" y1="-2" x2="22" y2="32" stroke="#1a1233" stroke-width="5"/>
            <!-- Back leg pushing off -->
            <line x1="-8" y1="-2" x2="-26" y2="32" stroke="#1a1233" stroke-width="5"/>
            <!-- Sling whirling overhead -->
            <ellipse cx="0" cy="-72" rx="32" ry="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.5"/>
            <line x1="-20" y1="-30" x2="-20" y2="-72" stroke="#fef3c7" stroke-width="1.2"/>
            <line x1="20" y1="-30" x2="20" y2="-72" stroke="#fef3c7" stroke-width="1.2"/>
          </g>
          <!-- Stone in flight -->
          <g transform="translate(400 280)">
            <circle r="5" fill="#fef3c7"/>
            <circle r="14" fill="rgba(254,243,199,0.35)"/>
            <!-- Motion trail -->
            <line x1="-22" y1="22" x2="-2" y2="2" stroke="rgba(254,243,199,0.5)" stroke-width="2"/>
            <line x1="-40" y1="40" x2="-22" y2="22" stroke="rgba(254,243,199,0.25)" stroke-width="2"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"I come against you in the name of the Lord Almighty"</text>
        </svg>`
      },
    ],
    closing: 'David did not win because he was clever, brave, or skilled with a sling — though he was all three. He won because he showed up when no one else would, and because his confidence rested in a Name larger than the giant. The giants you face — anxiety, addiction, a difficult relationship, a calling you have been avoiding — those giants do not get smaller. The Name gets bigger.',
    closingPrompt: 'What "Goliath" has been taunting you for forty days — and what would it look like to walk toward it today, in the name of the Lord, instead of staying in your tent?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 6 — Daniel & the Lions' Den
  // ════════════════════════════════════════════════════════════
  {
    id: 'daniel-lions',
    title: "Daniel & the Lions' Den",
    subtitle: "An old man, an open window, a king's torment.",
    icon: '🦁',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'exile',
    scriptureRef: 'Daniel 6',
    duration: '~7 min',
    scenes: [
      {
        id: 'conspiracy',
        title: 'The Conspiracy',
        scriptureRef: 'Daniel 6:1-9',
        bibleText: '"All the high officers of the kingdom… have agreed that the king should make a strong decree… that whoever petitions any god or man for thirty days, except you, O king, shall be cast into the den of lions."',
        narration: 'Daniel was old now — eighty, perhaps eighty-five. He had outlived three empires and served in the highest courts of Babylon and Persia. King Darius loved him and was preparing to set him over the whole kingdom. The other satraps could not bear it. They watched him for any fault and found none. So they invented one. They wrote a decree forbidding prayer to any god or man but the king, and they slid it under Darius before he understood what he was sealing. In Persia, no law could be revoked. Not even by the king who signed it.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dnc', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Persian throne room — columns and arched ceiling -->
          <g fill="#0a0d1a" opacity="0.85">
            <rect x="40"  y="120" width="22" height="320"/>
            <rect x="140" y="120" width="22" height="320"/>
            <rect x="638" y="120" width="22" height="320"/>
            <rect x="738" y="120" width="22" height="320"/>
          </g>
          <!-- Column capitals (Persian bull-headed style hints) -->
          <g fill="#3d2a16" opacity="0.9">
            <rect x="34"  y="108" width="34" height="14"/>
            <rect x="134" y="108" width="34" height="14"/>
            <rect x="632" y="108" width="34" height="14"/>
            <rect x="732" y="108" width="34" height="14"/>
          </g>
          <!-- Throne dais -->
          <path d="M 320 350 L 480 350 L 460 440 L 340 440 Z" fill="#241846" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
          <!-- King Darius on throne -->
          <g transform="translate(400 340)">
            <rect x="-30" y="-50" width="60" height="40" fill="#3d2a16"/>
            <ellipse cx="0" cy="-15" rx="20" ry="30" fill="#1a1233"/>
            <ellipse cx="0" cy="-50" rx="14" ry="17" fill="#1a1233"/>
            <!-- Crown -->
            <path d="M -14 -64 L -10 -74 L -4 -67 L 0 -76 L 4 -67 L 10 -74 L 14 -64 Z" fill="rgba(251,191,36,0.85)"/>
            <!-- Scepter -->
            <line x1="22" y1="-30" x2="42" y2="-80" stroke="rgba(251,191,36,0.7)" stroke-width="2.5"/>
            <circle cx="42" cy="-80" r="4" fill="rgba(251,191,36,0.9)"/>
          </g>
          <!-- Scroll being presented (with gold seal) -->
          <g transform="translate(260 410)">
            <rect x="0" y="0" width="100" height="22" fill="#fef3c7" opacity="0.9"/>
            <circle cx="10" cy="11" r="6" fill="rgba(251,191,36,0.85)" stroke="#3d2a16" stroke-width="0.8"/>
            <line x1="22" y1="6"  x2="92" y2="6"  stroke="#3d2a16" stroke-width="0.6"/>
            <line x1="22" y1="11" x2="86" y2="11" stroke="#3d2a16" stroke-width="0.6"/>
            <line x1="22" y1="16" x2="80" y2="16" stroke="#3d2a16" stroke-width="0.6"/>
          </g>
          <!-- Three conspirator silhouettes (whispering, leaning in) -->
          <g transform="translate(220 420)">
            <ellipse cx="0"  cy="0"  rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0"  cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <ellipse cx="-26" cy="2"  rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="-26" cy="-20" rx="8" ry="9" fill="#0a0d1a"/>
            <ellipse cx="-52" cy="4"  rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="-52" cy="-18" rx="8" ry="9" fill="#0a0d1a"/>
          </g>
          <!-- Hanging brazier (light source) -->
          <line x1="500" y1="60" x2="500" y2="140" stroke="#3d2a16" stroke-width="2"/>
          <ellipse cx="500" cy="145" rx="14" ry="6" fill="#3d2a16"/>
          <ellipse cx="500" cy="138" rx="9" ry="11" fill="#fb923c"/>
          <ellipse cx="500" cy="138" rx="5" ry="7" fill="#fbbf24"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.6)">Susa · the king's hall · the scroll is sealed</text>
        </svg>`
      },
      {
        id: 'open-window',
        title: 'The Open Window',
        scriptureRef: 'Daniel 6:10-13',
        bibleText: '"When Daniel learned that the decree had been published, he went home to his upstairs room where the windows opened toward Jerusalem. Three times a day he got down on his knees and prayed."',
        narration: 'Daniel could have closed the shutters. He could have prayed in silence, with his face to the wall. He could have kept the kingdom and his life. He did not close the shutters. He went up to his upper room, opened the window toward a Jerusalem that was eight hundred miles away and seventy years burned, and knelt down — as he had done all his life. Three times a day. The men were already watching from the courtyard. They had what they came for.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dno', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378'})}
          <!-- Distant Jerusalem on the horizon, just visible -->
          <g transform="translate(640 280)">
            <rect x="-14" y="-12" width="11" height="12" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="0"   y="-18" width="14" height="18" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="-1,-18 6,-26 13,-18" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="17"  y="-10" width="11" height="10" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
          </g>
          <text x="640" y="266" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2.5" fill="rgba(251,191,36,0.65)">JERUSALEM</text>
          <!-- Upper-room wall taking up left half -->
          <rect x="0" y="0" width="500" height="500" fill="#1e1638"/>
          <rect x="0" y="0" width="500" height="500" fill="rgba(251,191,36,0.04)"/>
          <!-- Window arch (right edge of the room) -->
          <path d="M 360 110 L 360 360 L 500 360 L 500 110 Q 500 60 430 60 Q 360 60 360 110 Z" fill="url(#dno-sky)" stroke="rgba(251,191,36,0.5)" stroke-width="2"/>
          <!-- Window lattice -->
          <line x1="430" y1="60" x2="430" y2="360" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
          <line x1="360" y1="210" x2="500" y2="210" stroke="rgba(251,191,36,0.35)" stroke-width="1"/>
          <!-- Light streaming in -->
          <defs>
            <linearGradient id="dnoBeam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.5)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="360,110 500,110 200,440 100,440" fill="url(#dnoBeam)"/>
          <!-- Daniel kneeling beside the window, hands raised -->
          <g transform="translate(260 380)">
            <ellipse cx="0" cy="0" rx="26" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-20" rx="16" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-50" rx="13" ry="15" fill="#1a1233"/>
            <!-- Long beard -->
            <path d="M -10 -42 Q 0 -22 10 -42" stroke="rgba(254,243,199,0.6)" stroke-width="1.5" fill="none"/>
            <!-- Raised hands -->
            <line x1="-14" y1="-25" x2="-30" y2="-58" stroke="#1a1233" stroke-width="6"/>
            <line x1="14"  y1="-25" x2="30" y2="-58" stroke="#1a1233" stroke-width="6"/>
            <!-- Halo / glow -->
            <circle cx="0" cy="-50" r="26" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Spying conspirators peeking through a doorway (far left) -->
          <g transform="translate(60 380)">
            <rect x="-30" y="-100" width="50" height="100" fill="rgba(10,13,26,0.85)"/>
            <ellipse cx="-12" cy="-52" rx="6" ry="20" fill="#0a0d1a"/>
            <ellipse cx="-12" cy="-72" rx="6" ry="7" fill="#0a0d1a"/>
            <ellipse cx="4"   cy="-50" rx="6" ry="20" fill="#0a0d1a"/>
            <ellipse cx="4"   cy="-70" rx="6" ry="7" fill="#0a0d1a"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">"Three times a day · as he had always done"</text>
        </svg>`
      },
      {
        id: 'into-the-den',
        title: 'Cast into the Den',
        scriptureRef: 'Daniel 6:14-18',
        bibleText: '"The king said to Daniel, ‘May your God, whom you serve continually, rescue you!’ A stone was brought and placed over the mouth of the den, and the king sealed it with his own signet ring."',
        narration: 'The king was greatly distressed. He worked all day to find a way out of the law he had signed. There was none. As the sun set, soldiers led Daniel from his house, past the courtyard, out of the city, to the den. Darius stood at the rim and said the only thing he could say — "May your God, whom you serve continually, rescue you." Then they lowered the old man into the dark and rolled the stone over the mouth. The king pressed his ring into the wax. He went home. He fasted. He did not sleep all night.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dnd', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <g fill="#fef3c7" opacity="0.5">
            <circle cx="100" cy="40" r="0.7"/><circle cx="220" cy="80" r="0.8"/><circle cx="360" cy="50" r="0.9"/>
            <circle cx="520" cy="100" r="0.7"/><circle cx="660" cy="60" r="0.8"/>
          </g>
          <!-- Crescent moon -->
          <g transform="translate(140 90)">
            <circle r="22" fill="#fef3c7" opacity="0.85"/>
            <circle r="22" fill="#1a1233" transform="translate(8 -4)"/>
          </g>
          <!-- Earth / ground -->
          <path d="M 0 290 Q 200 270 400 285 Q 600 270 800 290 L 800 500 L 0 500 Z" fill="#1e1638"/>
          <path d="M 0 340 Q 200 320 400 335 Q 600 320 800 340 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- The den (cross-section) — pit cut into the rock -->
          <path d="M 280 290 Q 290 470 400 480 Q 510 470 520 290 L 480 290 Q 470 440 400 446 Q 330 440 320 290 Z" fill="#0a0d1a" stroke="rgba(251,191,36,0.4)" stroke-width="1.5"/>
          <!-- Stone being rolled over the mouth -->
          <ellipse cx="400" cy="288" rx="125" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          <!-- Wax seal on the stone -->
          <circle cx="400" cy="286" r="9" fill="rgba(251,113,38,0.85)" stroke="#fef3c7" stroke-width="0.8"/>
          <text x="400" y="290" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" fill="#0a0d1a">D</text>
          <!-- Daniel inside the den, just lowered, with rope still around his shoulders -->
          <g transform="translate(400 410)">
            <ellipse cx="0" cy="0" rx="11" ry="32" fill="#1a1233"/>
            <ellipse cx="0" cy="-28" rx="9" ry="11" fill="#1a1233"/>
            <line x1="0" y1="-32" x2="0" y2="-80" stroke="#3d2a16" stroke-width="1.5" stroke-dasharray="3 4"/>
            <circle cx="0" cy="-28" r="16" fill="none" stroke="rgba(251,191,36,0.35)" stroke-width="0.8"/>
          </g>
          <!-- Hint of waiting lions (eyes in the dark) -->
          <g fill="rgba(251,191,36,0.7)">
            <circle cx="338" cy="395" r="1.5"/>
            <circle cx="345" cy="395" r="1.5"/>
            <circle cx="455" cy="400" r="1.5"/>
            <circle cx="462" cy="400" r="1.5"/>
          </g>
          <!-- King Darius standing at the rim, head bowed -->
          <g transform="translate(620 280)">
            <ellipse cx="0" cy="0" rx="11" ry="32" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-28" rx="9" ry="11" fill="#0a0d1a"/>
            <!-- Crown -->
            <path d="M -8 -38 L -5 -45 L -2 -40 L 0 -46 L 2 -40 L 5 -45 L 8 -38 Z" fill="rgba(251,191,36,0.6)"/>
            <!-- Hand on face (grief) -->
            <line x1="6" y1="-28" x2="9" y2="-20" stroke="#0a0d1a" stroke-width="2.5"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.65)">Sealed with the king's own ring · night falls</text>
        </svg>`
      },
      {
        id: 'angel-lions',
        title: 'The Angel Among the Lions',
        scriptureRef: 'Daniel 6:19-22',
        bibleText: '"My God sent his angel, and he shut the mouths of the lions. They have not hurt me, because I was found innocent in his sight."',
        narration: 'Inside the den, the dark was complete. The lions paced — and then, very strangely, they did not. Something stood between Daniel and them. Daniel saw it, or felt it, and the lions saw it, and the lions lay down. They lay down the way a dog lies down at its master’s feet. Daniel sat. He leaned against the warm flank of a lion as if it were a cushion. He prayed, and then he slept. Above ground a king lay awake. Below ground an old man was rested by an angel.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dna', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <!-- Interior of the den (rock walls, framed) -->
          <path d="M 80 60 Q 60 200 80 360 Q 140 440 400 460 Q 660 440 720 360 Q 740 200 720 60 Q 660 40 400 38 Q 140 40 80 60 Z" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="2"/>
          <!-- Soft glow filling the den -->
          <radialGradient id="dnaGlow" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0%" stop-color="rgba(254,243,199,0.45)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.18)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="250" rx="320" ry="180" fill="url(#dnaGlow)"/>
          <!-- Angel figure (tall, glowing, standing center-back) -->
          <g transform="translate(400 290)">
            <ellipse cx="0" cy="0" rx="26" ry="80" fill="rgba(254,243,199,0.85)"/>
            <ellipse cx="0" cy="-90" rx="18" ry="22" fill="rgba(254,243,199,0.95)"/>
            <!-- Wings -->
            <path d="M -28 -40 Q -90 -10 -64 70" stroke="rgba(251,191,36,0.55)" stroke-width="2" fill="rgba(254,243,199,0.25)"/>
            <path d="M 28 -40 Q 90 -10 64 70"   stroke="rgba(251,191,36,0.55)" stroke-width="2" fill="rgba(254,243,199,0.25)"/>
            <!-- Halo -->
            <circle cx="0" cy="-90" r="34" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.5"/>
          </g>
          <!-- Lions lying down peacefully (silhouettes) -->
          <g fill="#1a1233" opacity="0.92">
            <!-- Lion 1 (left front, head up) -->
            <g transform="translate(220 400)">
              <ellipse cx="0" cy="0" rx="48" ry="18"/>
              <circle cx="-40" cy="-8" r="18"/>
              <!-- Mane suggestion -->
              <circle cx="-40" cy="-8" r="24" fill="none" stroke="#0a0d1a" stroke-width="3"/>
              <!-- Tail -->
              <path d="M 44 -2 Q 60 -16 70 -4" stroke="#1a1233" stroke-width="3" fill="none"/>
              <ellipse cx="-50" cy="-22" rx="5" ry="3"/>
              <ellipse cx="-30" cy="-22" rx="5" ry="3"/>
            </g>
            <!-- Lion 2 (right front, asleep on side) -->
            <g transform="translate(560 405)">
              <ellipse cx="0" cy="0" rx="52" ry="16"/>
              <circle cx="42" cy="-6" r="18"/>
              <circle cx="42" cy="-6" r="24" fill="none" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="-30" y1="14" x2="-30" y2="26" stroke="#1a1233" stroke-width="3"/>
              <line x1="-10" y1="14" x2="-10" y2="26" stroke="#1a1233" stroke-width="3"/>
            </g>
            <!-- Lion 3 (small, back-left) -->
            <g transform="translate(140 380)" opacity="0.7">
              <ellipse cx="0" cy="0" rx="32" ry="12"/>
              <circle cx="-26" cy="-6" r="12"/>
            </g>
            <!-- Lion 4 (small, back-right) -->
            <g transform="translate(680 380)" opacity="0.7">
              <ellipse cx="0" cy="0" rx="32" ry="12"/>
              <circle cx="26" cy="-6" r="12"/>
            </g>
          </g>
          <!-- Daniel resting against a lion's flank (front-center) -->
          <g transform="translate(360 400)">
            <ellipse cx="0" cy="-8" rx="16" ry="22" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-30" rx="11" ry="13" fill="#0a0d1a"/>
            <path d="M -7 -22 Q 0 -10 7 -22" stroke="rgba(254,243,199,0.55)" stroke-width="1.2" fill="none"/>
            <!-- Eyes closed peacefully (subtle) -->
            <line x1="-4" y1="-32" x2="-1" y2="-32" stroke="rgba(254,243,199,0.6)" stroke-width="0.8"/>
            <line x1="1"  y1="-32" x2="4"  y2="-32" stroke="rgba(254,243,199,0.6)" stroke-width="0.8"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"He shut the mouths of the lions"</text>
        </svg>`
      },
      {
        id: 'vindication',
        title: 'Vindication at Dawn',
        scriptureRef: 'Daniel 6:23-27',
        bibleText: '"At the first light of dawn, the king got up and hurried to the lions’ den… ‘Daniel, servant of the living God, has your God been able to rescue you?’ Daniel answered: ‘O king, live forever! My God sent his angel.’"',
        narration: 'At the first light of dawn, Darius hurried — an old king running like a child — to the mouth of the den. He could barely breathe. "Daniel, servant of the living God — has your God been able to rescue you?" From inside, a calm voice: "O king, live forever. My God sent his angel." They pulled him out. There was not a scratch on him. Then the king issued a different decree, one nobody asked him to sign, that throughout his whole empire people should reverence the God of Daniel — the living God who endures forever, whose kingdom will never be destroyed.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dnv', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Sunrise over the horizon -->
          <radialGradient id="dnvSun" cx="0.5" cy="0.8" r="0.8">
            <stop offset="0%"  stop-color="rgba(254,243,199,0.95)"/>
            <stop offset="35%" stop-color="rgba(251,191,36,0.5)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="320" rx="420" ry="180" fill="url(#dnvSun)"/>
          <!-- Distant horizon hills -->
          <path d="M 0 330 Q 200 310 400 320 Q 600 305 800 330 L 800 500 L 0 500 Z" fill="#3d2a16" opacity="0.7"/>
          <!-- Ground -->
          <path d="M 0 370 Q 200 350 400 365 Q 600 350 800 370 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Mouth of the den (opened, stone rolled aside) -->
          <ellipse cx="400" cy="370" rx="140" ry="18" fill="#0a0d1a" stroke="rgba(251,191,36,0.65)" stroke-width="1.5"/>
          <ellipse cx="220" cy="378" rx="40" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          <!-- Daniel just lifted out, arms raised in praise -->
          <g transform="translate(400 350)">
            <ellipse cx="0" cy="0" rx="14" ry="40" fill="#1a1233"/>
            <ellipse cx="0" cy="-40" rx="11" ry="14" fill="#1a1233"/>
            <path d="M -7 -32 Q 0 -22 7 -32" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <!-- Both arms raised -->
            <line x1="-12" y1="-22" x2="-32" y2="-56" stroke="#1a1233" stroke-width="6"/>
            <line x1="12"  y1="-22" x2="32" y2="-56" stroke="#1a1233" stroke-width="6"/>
            <!-- Halo bigger -->
            <circle cx="0" cy="-40" r="30" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.5"/>
          </g>
          <!-- King Darius kneeling at the den's edge -->
          <g transform="translate(560 360)">
            <ellipse cx="0" cy="0" rx="20" ry="13" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-16" rx="13" ry="18" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-42" rx="10" ry="12" fill="#0a0d1a"/>
            <!-- Crown -->
            <path d="M -7 -52 L -4 -60 L 0 -54 L 4 -60 L 7 -52 Z" fill="rgba(251,191,36,0.8)"/>
            <!-- Hands extended toward Daniel -->
            <line x1="-12" y1="-22" x2="-22" y2="-20" stroke="#0a0d1a" stroke-width="3"/>
          </g>
          <!-- Far-right: conspirators being seized (very small) -->
          <g transform="translate(720 360)" opacity="0.6">
            <ellipse cx="0" cy="0" rx="5" ry="14" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-12" rx="4" ry="5" fill="#0a0d1a"/>
            <ellipse cx="-10" cy="0" rx="5" ry="14" fill="#0a0d1a"/>
            <ellipse cx="-10" cy="-12" rx="4" ry="5" fill="#0a0d1a"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"My God has sent his angel"</text>
        </svg>`
      }
    ],
    closing: 'Daniel did not pray louder than usual. He did not write a defiant letter. He simply did not change. The decree was thirty days. Daniel was eighty years deep in a habit. He had walked with God so long that even a death threat could not get him to stop. And in the end, the king who signed his death warrant ended up writing a public decree about the God who saved him. What Daniel kept on doing for sixty-some unspectacular years was what God used to convert an empire.',
    closingPrompt: 'What small daily habit — prayer, scripture, generosity, telling the truth — would you most want to be doing the day a "decree" came against it?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 7 — Jonah & the Great Fish
  // ════════════════════════════════════════════════════════════
  {
    id: 'jonah',
    title: 'Jonah & the Great Fish',
    subtitle: "A prophet runs the wrong way. God's mercy chases him down.",
    icon: '🐋',
    color: '#38bdf8',
    accentColor: '#fef3c7',
    era: 'prophets',
    scriptureRef: 'Jonah 1-4',
    duration: '~7 min',
    scenes: [
      {
        id: 'flight-from-god',
        title: 'Running from God',
        scriptureRef: 'Jonah 1:1-3',
        bibleText: '"But Jonah ran away from the Lord and headed for Tarshish. He went down to Joppa, where he found a ship bound for that port."',
        narration: 'God told Jonah to go east — to Nineveh, the capital of Assyria, the empire that had butchered his people. "Preach against it," God said, "for its wickedness has come up before me." Jonah went west instead. He went down to the port of Joppa, paid the fare, and boarded a ship for Tarshish — the far edge of the known world. He did not just disobey. He fled. As if a person could outrun the God who made the sea.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jnf', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fb923c', stars:false})}
          <!-- Setting sun -->
          <circle cx="690" cy="290" r="38" fill="#fbbf24" opacity="0.55"/>
          <circle cx="690" cy="290" r="26" fill="#fef3c7"/>
          <!-- Sea -->
          <path d="M 0 320 Q 200 305 400 318 Q 600 305 800 320 L 800 500 L 0 500 Z" fill="#1e1846"/>
          <path d="M 0 380 Q 200 365 400 378 Q 600 365 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Wave hints -->
          <g fill="none" stroke="rgba(254,243,199,0.25)" stroke-width="1">
            <path d="M 60 340 Q 80 332 100 340"/>
            <path d="M 180 350 Q 200 342 220 350"/>
            <path d="M 340 360 Q 360 352 380 360"/>
            <path d="M 500 350 Q 520 342 540 350"/>
            <path d="M 640 360 Q 660 352 680 360"/>
          </g>
          <!-- Port of Joppa (left): dock and city -->
          <g fill="#0a0d1a" opacity="0.9">
            <rect x="0"  y="280" width="100" height="40"/>
            <polygon points="20,280 35,260 50,280"/>
            <rect x="50" y="260" width="30" height="60"/>
            <rect x="80" y="280" width="30" height="40"/>
            <!-- Dock -->
            <rect x="100" y="318" width="120" height="8"/>
          </g>
          <!-- Lit windows in town -->
          <g fill="rgba(251,191,36,0.7)">
            <rect x="56"  y="280" width="3" height="3"/>
            <rect x="64"  y="288" width="3" height="3"/>
            <rect x="88"  y="290" width="3" height="3"/>
          </g>
          <text x="60" y="265" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(251,191,36,0.65)">JOPPA</text>
          <!-- Ship sailing west (right edge of frame) -->
          <g transform="translate(560 330)">
            <!-- Hull -->
            <path d="M -64 0 Q -50 22 0 26 Q 50 22 64 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <!-- Mast -->
            <line x1="0" y1="0" x2="0" y2="-58" stroke="#3d2a16" stroke-width="3"/>
            <!-- Sail (single trapezoid, wind-filled) -->
            <path d="M 0 -56 L -36 -10 L 36 -10 Z" fill="#fef3c7" opacity="0.85" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <!-- Crow's nest (small) -->
            <circle cx="0" cy="-56" r="3" fill="#3d2a16"/>
          </g>
          <!-- Jonah on deck, looking back over shoulder (small silhouette) -->
          <g transform="translate(540 318)">
            <ellipse cx="0" cy="0" rx="5" ry="11" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-10" rx="4" ry="5" fill="#0a0d1a"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">Westward · away from Nineveh · away from the call</text>
        </svg>`
      },
      {
        id: 'storm',
        title: 'The Storm at Sea',
        scriptureRef: 'Jonah 1:4-16',
        bibleText: '"Pick me up and throw me into the sea, and it will become calm. I know that it is my fault that this great storm has come upon you."',
        narration: 'The Lord sent a wind so great the ship threatened to break apart. The sailors cried each man to his own god. They threw cargo overboard. They cast lots to find out who had brought the trouble — and the lot fell on Jonah, asleep below deck. He confessed. "I am a Hebrew, and I worship the Lord, the God of heaven, who made the sea." They tried not to throw him in. The storm got worse. Finally they lifted Jonah and dropped him over the side — and the sea grew calm. Pagan sailors, in that moment, feared the Lord more than the prophet did.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="jnsSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#0a0d1a"/>
              <stop offset="60%" stop-color="#241846"/>
              <stop offset="100%" stop-color="#3d2a16"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#jnsSky)"/>
          <!-- Lightning bolt -->
          <polygon points="180,40 200,180 170,170 200,310 150,160 178,170" fill="#fef3c7" opacity="0.9"/>
          <polygon points="180,40 200,180 170,170 200,310 150,160 178,170" fill="rgba(254,243,199,0.5)" stroke="rgba(254,243,199,0.7)" stroke-width="1"/>
          <!-- Storm clouds (heavy) -->
          <g fill="#0a0d1a" opacity="0.9">
            <ellipse cx="120" cy="90" rx="100" ry="38"/>
            <ellipse cx="280" cy="70" rx="120" ry="42"/>
            <ellipse cx="450" cy="100" rx="110" ry="38"/>
            <ellipse cx="620" cy="80" rx="100" ry="40"/>
            <ellipse cx="740" cy="110" rx="80" ry="36"/>
          </g>
          <!-- Massive waves -->
          <path d="M 0 360 Q 100 280 220 350 Q 340 280 460 360 Q 580 280 700 360 Q 770 340 800 360 L 800 500 L 0 500 Z" fill="#1e1846"/>
          <path d="M 0 410 Q 200 360 400 405 Q 600 360 800 410 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Wave crests / foam -->
          <g fill="none" stroke="rgba(254,243,199,0.55)" stroke-width="1.5">
            <path d="M 110 320 Q 130 308 155 318"/>
            <path d="M 340 318 Q 360 306 388 318"/>
            <path d="M 580 314 Q 600 304 624 314"/>
          </g>
          <!-- Ship pitched on a wave (tilted, near broken) -->
          <g transform="translate(460 360) rotate(-20)">
            <path d="M -64 0 Q -50 22 0 26 Q 50 22 64 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
            <line x1="0" y1="0" x2="0" y2="-58" stroke="#3d2a16" stroke-width="3"/>
            <!-- Sail torn/flapping -->
            <path d="M 0 -56 L -32 -16 L 24 -10 Z" fill="#fef3c7" opacity="0.7" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <!-- Sailors as small silhouettes clinging to deck -->
            <ellipse cx="-30" cy="6" rx="4" ry="6" fill="#0a0d1a"/>
            <ellipse cx="-10" cy="8" rx="4" ry="6" fill="#0a0d1a"/>
            <ellipse cx="14"  cy="8" rx="4" ry="6" fill="#0a0d1a"/>
          </g>
          <!-- Jonah being thrown overboard (small figure in mid-air, falling) -->
          <g transform="translate(380 330) rotate(45)">
            <ellipse cx="0" cy="0" rx="6" ry="16" fill="#1a1233"/>
            <ellipse cx="0" cy="-14" rx="5" ry="6" fill="#1a1233"/>
          </g>
          <!-- Splash where he's about to land -->
          <g fill="rgba(254,243,199,0.6)">
            <ellipse cx="340" cy="395" rx="22" ry="6"/>
            <line x1="328" y1="395" x2="324" y2="380" stroke="rgba(254,243,199,0.6)" stroke-width="2"/>
            <line x1="354" y1="395" x2="358" y2="380" stroke="rgba(254,243,199,0.6)" stroke-width="2"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">"The sea grew calmer and calmer"</text>
        </svg>`
      },
      {
        id: 'belly-of-fish',
        title: 'Three Days in the Belly',
        scriptureRef: 'Jonah 1:17 - 2:10',
        bibleText: '"Now the Lord provided a great fish to swallow Jonah, and Jonah was in the belly of the fish three days and three nights… ‘From inside the fish Jonah prayed to the Lord his God.’"',
        narration: 'The Lord did not let him drown. The Lord sent a fish. Inside the dark of its belly, Jonah was alive — and praying for the first time in the whole book. "In my distress I called to the Lord, and he answered me. From deep in the realm of the dead I called for help, and you listened to my cry." Three days and three nights. Long enough to understand. On the third day the fish vomited him out on dry land, and the word of the Lord came to him a second time: Go to Nineveh. This time he went.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="jnbSea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#1e1846"/>
              <stop offset="60%" stop-color="#0a0d1a"/>
              <stop offset="100%" stop-color="#000a14"/>
            </linearGradient>
            <radialGradient id="jnbGlow" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%"  stop-color="rgba(251,191,36,0.55)"/>
              <stop offset="55%" stop-color="rgba(251,191,36,0.15)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#jnbSea)"/>
          <!-- Bubbles rising -->
          <g fill="rgba(254,243,199,0.35)">
            <circle cx="90" cy="120" r="2"/><circle cx="150" cy="200" r="1.4"/>
            <circle cx="220" cy="80"  r="2.2"/><circle cx="640" cy="120" r="1.6"/>
            <circle cx="700" cy="220" r="2.4"/><circle cx="560" cy="60"  r="1.8"/>
            <circle cx="120" cy="380" r="2"/><circle cx="680" cy="400" r="1.6"/>
          </g>
          <!-- Faint underwater rays from above -->
          <g stroke="rgba(254,243,199,0.12)" stroke-width="2" fill="none">
            <line x1="200" y1="0" x2="320" y2="500"/>
            <line x1="400" y1="0" x2="400" y2="500"/>
            <line x1="600" y1="0" x2="480" y2="500"/>
          </g>
          <!-- The Great Fish (massive silhouette, side view) -->
          <g>
            <!-- Body -->
            <path d="M 80 270 Q 100 180 360 160 Q 620 180 720 240 Q 700 270 720 300 Q 620 360 360 360 Q 100 340 80 270 Z" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="2"/>
            <!-- Tail fin -->
            <path d="M 720 240 L 770 180 L 760 260 Z" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1.5"/>
            <path d="M 720 300 L 770 360 L 760 280 Z" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1.5"/>
            <!-- Dorsal fin -->
            <path d="M 380 158 Q 400 110 440 150 Z" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1.5"/>
            <!-- Eye -->
            <circle cx="160" cy="220" r="8" fill="#fef3c7"/>
            <circle cx="162" cy="220" r="4" fill="#0a0d1a"/>
            <!-- Mouth line -->
            <path d="M 80 270 Q 120 290 160 280" stroke="rgba(251,191,36,0.5)" stroke-width="1.2" fill="none"/>
            <!-- Gill -->
            <path d="M 200 200 Q 210 250 200 300" stroke="rgba(251,191,36,0.45)" stroke-width="1.2" fill="none"/>
          </g>
          <!-- Glow inside the belly (visible through the fish's silhouette, conceptual window) -->
          <ellipse cx="410" cy="260" rx="120" ry="60" fill="url(#jnbGlow)"/>
          <!-- Jonah inside, praying (silhouette over the glow) -->
          <g transform="translate(410 290)">
            <ellipse cx="0" cy="0" rx="9" ry="22" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <!-- Hands clasped -->
            <line x1="-7" y1="-12" x2="0" y2="-6" stroke="#0a0d1a" stroke-width="2"/>
            <line x1="7"  y1="-12" x2="0" y2="-6" stroke="#0a0d1a" stroke-width="2"/>
            <!-- Halo -->
            <circle cx="0" cy="-22" r="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <!-- "Day 1 · 2 · 3" tally -->
          <g fill="rgba(254,243,199,0.55)" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3">
            <text x="400" y="60" text-anchor="middle">THREE DAYS · THREE NIGHTS</text>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"From inside the fish, Jonah prayed"</text>
        </svg>`
      },
      {
        id: 'nineveh-repents',
        title: 'Nineveh Repents',
        scriptureRef: 'Jonah 3:1-10',
        bibleText: '"The Ninevites believed God. A fast was proclaimed, and all of them, from the greatest to the least, put on sackcloth… When God saw what they did and how they turned from their evil ways, he relented."',
        narration: 'Jonah walked into the largest city of the world and preached the shortest sermon ever recorded — eight words in Hebrew. "Forty more days and Nineveh will be overthrown." He did not even add a way out. And the city — every level of it, all the way to the king — fell on its face. The king came down from his throne, took off his royal robes, sat in ashes, and ordered that even the animals fast and put on sackcloth. God saw, and the city did not fall.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jnn', skyTop:'#241846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Massive Nineveh skyline — ziggurat in the center, walls and towers -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="1">
            <!-- Outer wall (long, low) -->
            <rect x="40" y="280" width="720" height="80"/>
            <!-- Battlements -->
            <g fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="1">
              <rect x="40" y="272" width="14" height="10"/>
              <rect x="70" y="272" width="14" height="10"/>
              <rect x="100" y="272" width="14" height="10"/>
              <rect x="130" y="272" width="14" height="10"/>
              <rect x="160" y="272" width="14" height="10"/>
              <rect x="618" y="272" width="14" height="10"/>
              <rect x="648" y="272" width="14" height="10"/>
              <rect x="678" y="272" width="14" height="10"/>
              <rect x="708" y="272" width="14" height="10"/>
              <rect x="738" y="272" width="14" height="10"/>
            </g>
            <!-- Gate towers (left + right) -->
            <rect x="200" y="200" width="40" height="160"/>
            <rect x="560" y="200" width="40" height="160"/>
            <!-- Ziggurat in center (stepped pyramid) -->
            <polygon points="320,280 480,280 460,240 340,240"/>
            <polygon points="340,240 460,240 444,210 356,210"/>
            <polygon points="356,210 444,210 432,180 368,180"/>
            <polygon points="368,180 432,180 422,140 378,140"/>
            <rect x="395" y="120" width="10" height="20"/>
          </g>
          <!-- Lit windows on the ziggurat -->
          <g fill="rgba(251,191,36,0.55)">
            <rect x="396" y="124" width="4" height="6"/>
            <rect x="386" y="160" width="4" height="6"/>
            <rect x="404" y="160" width="4" height="6"/>
          </g>
          <!-- Smoke rising from fasting fires -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="160" cy="200" rx="22" ry="40"/>
            <ellipse cx="640" cy="200" rx="22" ry="40"/>
          </g>
          <!-- Ground in front of walls -->
          <path d="M 0 360 Q 200 350 400 360 Q 600 350 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- People kneeling in sackcloth, lined up along the foreground -->
          <g fill="#0a0d1a">
            <g transform="translate(140 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
            <g transform="translate(200 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
            <g transform="translate(260 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
            <g transform="translate(320 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
            <g transform="translate(380 430)"><ellipse cx="0" cy="0" rx="16" ry="6"/><ellipse cx="-2" cy="-8" rx="8" ry="9"/>
              <!-- King (with simple crown -->
              <path d="M -6 -16 L -3 -22 L 0 -17 L 3 -22 L 6 -16 Z" fill="rgba(251,191,36,0.7)"/>
            </g>
            <g transform="translate(440 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
            <g transform="translate(500 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
            <g transform="translate(560 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
            <g transform="translate(620 430)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="7" ry="8"/></g>
          </g>
          <!-- Ash-smudges on the ground in front -->
          <g fill="rgba(254,243,199,0.25)">
            <ellipse cx="240" cy="455" rx="12" ry="3"/>
            <ellipse cx="380" cy="458" rx="14" ry="3"/>
            <ellipse cx="520" cy="455" rx="12" ry="3"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"From the greatest to the least"</text>
        </svg>`
      },
      {
        id: 'vine-and-worm',
        title: 'The Vine and the Worm',
        scriptureRef: 'Jonah 4',
        bibleText: '"You have been concerned about this plant, though you did not tend it or make it grow… should I not have concern for the great city of Nineveh, in which there are more than a hundred and twenty thousand people…?"',
        narration: 'Jonah was furious. He had wanted Nineveh to burn. He went out and made himself a shelter east of the city and sat under it to see what would happen. God made a vine grow up over him for shade, and Jonah was glad. The next morning God sent a worm. The worm ate the vine. The sun beat down. The wind blew hot. Jonah said: "It is better for me to die than to live." And the Lord said: "You care about a vine you did not grow. Should I not care about a hundred and twenty thousand people who do not know their right hand from their left?"',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="jnvSun" cx="0.7" cy="0.2" r="0.7">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="35%" stop-color="rgba(251,113,38,0.55)"/>
              <stop offset="100%" stop-color="rgba(251,113,38,0)"/>
            </radialGradient>
            <linearGradient id="jnvSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fb923c"/>
              <stop offset="50%" stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#3d2a16"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#jnvSky)"/>
          <!-- Blazing sun, high right -->
          <ellipse cx="630" cy="100" rx="240" ry="200" fill="url(#jnvSun)"/>
          <circle cx="630" cy="100" r="34" fill="#fef3c7"/>
          <circle cx="630" cy="100" r="50" fill="rgba(254,243,199,0.5)"/>
          <!-- Heat-shimmer ground -->
          <path d="M 0 360 Q 200 348 400 358 Q 600 346 800 360 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 410 Q 200 400 400 410 Q 600 398 800 410 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- Wilted vine: a thin twisted vine with a few drooping leaves and a worm -->
          <g transform="translate(220 380)">
            <!-- Stake / shelter post -->
            <line x1="0" y1="-160" x2="0" y2="0" stroke="#3d2a16" stroke-width="4"/>
            <!-- Withered vine -->
            <path d="M 0 -160 Q 30 -150 40 -120 Q 25 -110 50 -90 Q 30 -80 60 -60 Q 30 -50 70 -30" stroke="#3d2a16" stroke-width="2" fill="none"/>
            <!-- A few wilted leaves (small ovals drooping) -->
            <ellipse cx="42" cy="-118" rx="9" ry="4" transform="rotate(35 42 -118)" fill="#3d2a16"/>
            <ellipse cx="58" cy="-88"  rx="9" ry="4" transform="rotate(45 58 -88)"  fill="#3d2a16"/>
            <ellipse cx="68" cy="-58"  rx="8" ry="3.5" transform="rotate(60 68 -58)" fill="#3d2a16"/>
            <!-- Worm at the base -->
            <path d="M -8 -2 Q -2 -6 4 -2 Q 10 -6 16 -2" stroke="#fb923c" stroke-width="2.5" fill="none"/>
            <circle cx="16" cy="-2" r="1.5" fill="#fb923c"/>
          </g>
          <!-- Jonah sulking, seated on the ground, arms crossed, looking toward Nineveh -->
          <g transform="translate(360 410)">
            <ellipse cx="0" cy="0" rx="28" ry="12" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="18" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-52" rx="13" ry="15" fill="#1a1233"/>
            <!-- Arms crossed -->
            <path d="M -16 -28 Q -2 -22 14 -28" stroke="#0a0d1a" stroke-width="6" fill="none"/>
            <!-- Stubble of beard -->
            <path d="M -7 -44 Q 0 -34 7 -44" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Halo grayer / dimmer (he's not glorying here) -->
            <circle cx="0" cy="-52" r="22" fill="none" stroke="rgba(254,243,199,0.18)" stroke-width="1"/>
          </g>
          <!-- Distant Nineveh, very small, behind him -->
          <g transform="translate(620 360)" opacity="0.55">
            <rect x="-12" y="-14" width="10" height="14" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.6"/>
            <rect x="0"   y="-20" width="12" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.6"/>
            <polygon points="-1,-20 5,-26 12,-20" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.6"/>
            <rect x="14"  y="-12" width="10" height="12" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.6"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Should I not have concern for that great city?"</text>
        </svg>`
      }
    ],
    closing: 'The book of Jonah ends with a question — not a verdict. God asks Jonah whether the prophet’s pity for a leaf can really be larger than God’s pity for a city. We never get Jonah’s answer. The story leaves the question with us. There is always a Nineveh somewhere in our hearts — a person, a group, a city we secretly hope God will judge instead of save. Jonah’s storm, fish, and wilted vine are not really about a runaway prophet. They are about a God whose mercy is wider than our prejudice.',
    closingPrompt: 'Who is your "Nineveh" — the person or group you would rather not see God forgive — and what would it look like to pray, even once, for their good?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 8 — Elijah on Mount Carmel
  // ════════════════════════════════════════════════════════════
  {
    id: 'elijah-carmel',
    title: 'Elijah on Mount Carmel',
    subtitle: 'One prophet. Four hundred and fifty. A nation watching.',
    icon: '🔥',
    color: '#fb923c',
    accentColor: '#fef3c7',
    era: 'divided-kingdom',
    scriptureRef: '1 Kings 18',
    duration: '~8 min',
    scenes: [
      {
        id: 'the-challenge',
        title: 'The Challenge',
        scriptureRef: '1 Kings 18:17-24',
        bibleText: '"How long will you waver between two opinions? If the Lord is God, follow him; but if Baal is God, follow him."',
        narration: 'For three and a half years there had been no rain. Ahab the king and Jezebel his queen had filled Israel with the prophets of Baal. Elijah came down from hiding and sent word to the king: meet me on Mount Carmel. Bring all the prophets of Baal — four hundred and fifty of them. Bring the people. And there, on a windy ridge over the Mediterranean, Elijah stood alone in front of an entire nation and said: "Choose. If the Lord is God, follow him. If Baal is God, follow him." The people said nothing. So he set the terms — two altars, two bulls, no fire — and let heaven decide.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'elc', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Storm-promising clouds in the distance -->
          <g fill="#0a0d1a" opacity="0.6">
            <ellipse cx="120" cy="100" rx="80" ry="22"/>
            <ellipse cx="280" cy="80"  rx="100" ry="26"/>
            <ellipse cx="460" cy="100" rx="90" ry="22"/>
            <ellipse cx="640" cy="90"  rx="80" ry="24"/>
          </g>
          <!-- Mt Carmel ridge -->
          <path d="M 0 280 Q 150 230 280 260 Q 420 200 560 250 Q 680 220 800 260 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 340 Q 200 320 400 335 Q 600 310 800 335 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 410 Q 200 400 400 412 Q 600 400 800 412 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Two altars on the ridge -->
          <!-- Baal's altar (left, smoking, no fire) -->
          <g transform="translate(220 340)">
            <rect x="-26" y="-18" width="52" height="22" fill="#3d2a16" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <rect x="-30" y="-22" width="60" height="6"  fill="#3d2a16"/>
            <!-- Faint smoke -->
            <ellipse cx="0" cy="-30" rx="9" ry="14" fill="rgba(254,243,199,0.18)"/>
          </g>
          <text x="220" y="368" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(254,243,199,0.55)">BAAL</text>
          <!-- The Lord's altar (right, neat stones, still no fire) -->
          <g transform="translate(560 340)">
            <rect x="-26" y="-18" width="52" height="22" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <rect x="-30" y="-22" width="60" height="6"  fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <!-- 12 stones suggested -->
            <g fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.5">
              <rect x="-25" y="-16" width="11" height="9"/>
              <rect x="-13" y="-16" width="11" height="9"/>
              <rect x="-1"  y="-16" width="11" height="9"/>
              <rect x="11"  y="-16" width="11" height="9"/>
              <rect x="-25" y="-6"  width="11" height="9"/>
              <rect x="-13" y="-6"  width="11" height="9"/>
              <rect x="-1"  y="-6"  width="11" height="9"/>
              <rect x="11"  y="-6"  width="11" height="9"/>
            </g>
          </g>
          <text x="560" y="368" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(251,191,36,0.75)">THE LORD</text>
          <!-- Elijah standing alone between them, facing the crowd -->
          <g transform="translate(400 370)">
            <ellipse cx="0" cy="0" rx="12" ry="36" fill="#1a1233"/>
            <ellipse cx="0" cy="-36" rx="11" ry="13" fill="#1a1233"/>
            <!-- Wild beard / hair -->
            <path d="M -10 -28 Q 0 -16 10 -28" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -42 Q -14 -50 -8 -52 M 10 -42 Q 14 -50 8 -52" stroke="rgba(254,243,199,0.45)" stroke-width="1" fill="none"/>
            <!-- Staff -->
            <line x1="14" y1="-18" x2="22" y2="22" stroke="#3d2a16" stroke-width="2.5"/>
            <!-- Halo -->
            <circle cx="0" cy="-36" r="22" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1.2"/>
          </g>
          <!-- People watching (small silhouettes lined up in the foreground) -->
          <g fill="#0a0d1a" opacity="0.85">
            <ellipse cx="100" cy="450" rx="6" ry="16"/><ellipse cx="100" cy="436" rx="5" ry="6"/>
            <ellipse cx="140" cy="452" rx="6" ry="16"/><ellipse cx="140" cy="438" rx="5" ry="6"/>
            <ellipse cx="180" cy="450" rx="6" ry="16"/><ellipse cx="180" cy="436" rx="5" ry="6"/>
            <ellipse cx="620" cy="450" rx="6" ry="16"/><ellipse cx="620" cy="436" rx="5" ry="6"/>
            <ellipse cx="660" cy="452" rx="6" ry="16"/><ellipse cx="660" cy="438" rx="5" ry="6"/>
            <ellipse cx="700" cy="450" rx="6" ry="16"/><ellipse cx="700" cy="436" rx="5" ry="6"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"How long will you waver between two opinions?"</text>
        </svg>`
      },
      {
        id: 'prophets-of-baal',
        title: 'The Prophets of Baal',
        scriptureRef: '1 Kings 18:25-29',
        bibleText: '"Shout louder! Surely he is a god! Perhaps he is deep in thought, or busy, or traveling. Maybe he is sleeping and must be awakened."',
        narration: 'From morning until noon they shouted: "O Baal, answer us!" There was no answer. They danced around their altar. By noon Elijah was mocking them: shout louder, perhaps your god is asleep, perhaps he is on a journey. So they shouted louder, and slashed themselves with swords and spears as their custom was, until their blood ran down. From noon until the time of the evening sacrifice — three solid hours — they raved. There was no answer. There was no fire. There was no Baal.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'elb', skyTop:'#3d2a5e', skyMid:'#5a4378', skyBot:'#fb923c', stars:false})}
          <!-- Hot pale-blue sky with sun directly overhead -->
          <circle cx="400" cy="80" r="36" fill="#fef3c7" opacity="0.95"/>
          <circle cx="400" cy="80" r="58" fill="rgba(254,243,199,0.35)"/>
          <!-- Mountain ridge -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 400 Q 200 380 400 400 Q 600 380 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Baal's altar at center, stone-cold -->
          <g transform="translate(400 380)">
            <rect x="-38" y="-24" width="76" height="30" fill="#3d2a16" stroke="rgba(254,243,199,0.4)" stroke-width="1"/>
            <rect x="-44" y="-30" width="88" height="8"  fill="#3d2a16"/>
            <!-- Bull silhouette on altar (small, lying) -->
            <ellipse cx="0" cy="-12" rx="22" ry="6" fill="#1a1233"/>
            <ellipse cx="-22" cy="-15" rx="6" ry="6" fill="#1a1233"/>
            <path d="M -26 -18 L -30 -22 M -18 -18 L -14 -22" stroke="#1a1233" stroke-width="2"/>
            <!-- No smoke. No fire. -->
          </g>
          <!-- Frenzied prophets dancing around -->
          <g fill="#0a0d1a">
            <!-- Prophet 1 (left, arms raised, mid-leap) -->
            <g transform="translate(240 360)">
              <ellipse cx="0" cy="0" rx="9" ry="26"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="-10" y1="-12" x2="-22" y2="-44" stroke="#0a0d1a" stroke-width="4"/>
              <line x1="10"  y1="-12" x2="22" y2="-44" stroke="#0a0d1a" stroke-width="4"/>
              <!-- Knife in hand -->
              <line x1="22" y1="-44" x2="28" y2="-58" stroke="rgba(251,191,36,0.7)" stroke-width="1.5"/>
              <polygon points="28,-58 30,-62 26,-60" fill="#fef3c7"/>
            </g>
            <!-- Prophet 2 (bowed deeply over altar, head almost to ground) -->
            <g transform="translate(320 388) rotate(-30)">
              <ellipse cx="0" cy="0" rx="9" ry="26"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
            </g>
            <!-- Prophet 3 (right, arms thrown out) -->
            <g transform="translate(500 358)">
              <ellipse cx="0" cy="0" rx="9" ry="26"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="-10" y1="-14" x2="-24" y2="-30" stroke="#0a0d1a" stroke-width="4"/>
              <line x1="10"  y1="-14" x2="24" y2="-30" stroke="#0a0d1a" stroke-width="4"/>
            </g>
            <!-- Prophet 4 (far right, kneeling, hands tearing hair) -->
            <g transform="translate(580 388)">
              <ellipse cx="0" cy="0" rx="11" ry="14"/>
              <ellipse cx="0" cy="-16" rx="8" ry="9"/>
              <line x1="-6" y1="-12" x2="-10" y2="-26" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="6"  y1="-12" x2="10" y2="-26" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <!-- Background prophets (smaller, blurred) -->
            <ellipse cx="180" cy="380" rx="7" ry="20" opacity="0.6"/>
            <ellipse cx="180" cy="362" rx="6" ry="7" opacity="0.6"/>
            <ellipse cx="640" cy="380" rx="7" ry="20" opacity="0.6"/>
            <ellipse cx="640" cy="362" rx="6" ry="7" opacity="0.6"/>
          </g>
          <!-- Drops of blood (subtle dark red dots near prophet 1's knife) -->
          <g fill="rgba(120,20,20,0.55)">
            <circle cx="262" cy="304" r="1.5"/>
            <circle cx="266" cy="312" r="1.2"/>
            <circle cx="258" cy="318" r="1.5"/>
          </g>
          <!-- Elijah watching from right, arms crossed, calm -->
          <g transform="translate(710 370)">
            <ellipse cx="0" cy="0" rx="10" ry="30" fill="#1a1233"/>
            <ellipse cx="0" cy="-30" rx="9" ry="11" fill="#1a1233"/>
            <path d="M -14 -18 Q -2 -12 14 -18" stroke="#0a0d1a" stroke-width="4" fill="none"/>
            <circle cx="0" cy="-30" r="18" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">"There was no response · no one answered · no one paid attention"</text>
        </svg>`
      },
      {
        id: 'soaked-altar',
        title: 'The Soaked Altar',
        scriptureRef: '1 Kings 18:30-37',
        bibleText: '"Fill four large jars with water and pour it on the offering and on the wood. Do it again… and a third time. The water ran down around the altar and even filled the trench."',
        narration: 'When the prophets of Baal collapsed in exhaustion, Elijah called the people close. He rebuilt the altar of the Lord that had been torn down — twelve stones, one for each tribe. He cut up the bull and laid it on the wood. Then he made the impossible obviously impossible. "Fill four large jars with water and pour it on the offering and on the wood. Do it again. Do it a third time." Twelve jars in all. The water ran down the altar, soaked the wood, filled the trench around it. Then Elijah prayed — not loud, not long. "Answer me, Lord, so these people will know that you are God and that you are turning their hearts back."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'els', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e', stars:false})}
          <!-- Evening sky with a few stars -->
          <g fill="#fef3c7" opacity="0.6">
            <circle cx="80" cy="50" r="0.8"/><circle cx="200" cy="100" r="0.9"/>
            <circle cx="340" cy="60" r="0.7"/><circle cx="500" cy="90" r="0.9"/>
            <circle cx="640" cy="70" r="0.8"/>
          </g>
          <!-- Mountain top -->
          <path d="M 0 340 Q 200 320 400 335 Q 600 320 800 340 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- The trench around the altar (circular, filled with water reflection) -->
          <ellipse cx="400" cy="400" rx="170" ry="20" fill="#1e1846" stroke="rgba(254,243,199,0.5)" stroke-width="1"/>
          <ellipse cx="400" cy="400" rx="170" ry="20" fill="none" stroke="rgba(251,191,36,0.4)" stroke-width="0.8" stroke-dasharray="2 4"/>
          <!-- Reflective shimmer on water -->
          <g fill="rgba(254,243,199,0.5)">
            <ellipse cx="320" cy="402" rx="20" ry="2"/>
            <ellipse cx="400" cy="406" rx="22" ry="2"/>
            <ellipse cx="480" cy="402" rx="20" ry="2"/>
          </g>
          <!-- The altar of the Lord — 12 stones stacked, sacrifice on top, soaked -->
          <g transform="translate(400 388)">
            <!-- Base -->
            <rect x="-46" y="-8" width="92" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.8)" stroke-width="1.4"/>
            <!-- Middle row -->
            <rect x="-40" y="-22" width="80" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.8)" stroke-width="1.4"/>
            <!-- Top row -->
            <rect x="-34" y="-36" width="68" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.8)" stroke-width="1.4"/>
            <!-- 12 stones suggested by vertical lines -->
            <g stroke="rgba(254,243,199,0.45)" stroke-width="0.8">
              <line x1="-28" y1="-8"  x2="-28" y2="6"/>
              <line x1="-10" y1="-8"  x2="-10" y2="6"/>
              <line x1="10"  y1="-8"  x2="10"  y2="6"/>
              <line x1="28"  y1="-8"  x2="28"  y2="6"/>
              <line x1="-22" y1="-22" x2="-22" y2="-8"/>
              <line x1="0"   y1="-22" x2="0"   y2="-8"/>
              <line x1="22"  y1="-22" x2="22"  y2="-8"/>
              <line x1="-18" y1="-36" x2="-18" y2="-22"/>
              <line x1="0"   y1="-36" x2="0"   y2="-22"/>
              <line x1="18"  y1="-36" x2="18"  y2="-22"/>
            </g>
            <!-- Soaked wood + bull on top -->
            <line x1="-30" y1="-42" x2="30"  y2="-42" stroke="#3d2a16" stroke-width="3"/>
            <line x1="-30" y1="-46" x2="30"  y2="-46" stroke="#3d2a16" stroke-width="3"/>
            <!-- Bull silhouette -->
            <ellipse cx="0" cy="-54" rx="26" ry="8" fill="#0a0d1a"/>
            <ellipse cx="-22" cy="-58" rx="6" ry="6" fill="#0a0d1a"/>
            <path d="M -26 -62 L -30 -68 M -18 -62 L -14 -68" stroke="#0a0d1a" stroke-width="2"/>
            <!-- Water dripping down the sides -->
            <g stroke="rgba(254,243,199,0.55)" stroke-width="1.5" fill="none">
              <path d="M -44 -4 Q -46 8 -44 18"/>
              <path d="M -30 -18 Q -32 -4 -30 6"/>
              <path d="M 30 -18 Q 32 -4 30 6"/>
              <path d="M 44 -4 Q 46 8 44 18"/>
            </g>
          </g>
          <!-- Servants pouring jars (3, with last one tipping) -->
          <g fill="#1a1233">
            <g transform="translate(250 360)">
              <ellipse cx="0" cy="0" rx="10" ry="28"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
              <!-- Jar -->
              <ellipse cx="14" cy="-8" rx="9" ry="11" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <line x1="14" y1="-18" x2="22" y2="-22" stroke="#3d2a16" stroke-width="2"/>
              <path d="M 18 0 Q 22 10 18 18" stroke="rgba(254,243,199,0.7)" stroke-width="1.5" fill="none"/>
            </g>
            <g transform="translate(550 360)">
              <ellipse cx="0" cy="0" rx="10" ry="28"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
              <ellipse cx="-14" cy="-8" rx="9" ry="11" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <path d="M -18 0 Q -22 10 -18 18" stroke="rgba(254,243,199,0.7)" stroke-width="1.5" fill="none"/>
            </g>
          </g>
          <!-- Elijah praying, hands raised behind the altar -->
          <g transform="translate(400 332)">
            <ellipse cx="0" cy="0" rx="11" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="10" ry="12" fill="#1a1233"/>
            <line x1="-10" y1="-12" x2="-18" y2="-34" stroke="#1a1233" stroke-width="4"/>
            <line x1="10"  y1="-12" x2="18" y2="-34" stroke="#1a1233" stroke-width="4"/>
            <circle cx="0" cy="-22" r="20" fill="none" stroke="rgba(251,191,36,0.75)" stroke-width="1.4"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"Answer me, Lord · answer me"</text>
        </svg>`
      },
      {
        id: 'fire-from-heaven',
        title: 'Fire From Heaven',
        scriptureRef: '1 Kings 18:38-39',
        bibleText: '"Then the fire of the Lord fell and burned up the sacrifice, the wood, the stones and the soil, and also licked up the water in the trench."',
        narration: 'And then it fell. Not a torch tossed by a temple slave, not a slow ember nursed alive by men in robes — but fire from heaven. A column of light split the sky and struck the altar. It consumed the bull. It consumed the wood. It burned up the stones themselves. It vaporized the dust. It licked up every drop of water in the trench. And when there was nothing left to burn, when the air still rang with thunder and the people could feel the heat on their faces, they fell on their faces and cried out the only thing left to say: "The Lord — he is God. The Lord — he is God."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="elfHeaven" cx="0.5" cy="0.05" r="0.9">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="25%" stop-color="rgba(251,191,36,0.7)"/>
              <stop offset="60%" stop-color="rgba(251,113,38,0.4)"/>
              <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
            </radialGradient>
            <linearGradient id="elfBolt" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%"  stop-color="rgba(254,243,199,1)"/>
              <stop offset="50%" stop-color="rgba(251,191,36,0.95)"/>
              <stop offset="100%" stop-color="rgba(251,113,38,0.85)"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="#0a0d1a"/>
          <!-- Halo of heaven -->
          <ellipse cx="400" cy="60" rx="500" ry="240" fill="url(#elfHeaven)"/>
          <!-- The bolt of fire — a thick vertical pillar -->
          <polygon points="370,0 360,500 440,500 430,0" fill="url(#elfBolt)"/>
          <polygon points="378,0 372,500 428,500 422,0" fill="rgba(254,243,199,0.95)"/>
          <!-- Cracks of lightning beside the main column -->
          <polyline points="280,40 320,120 290,180 330,260 300,320 350,400" stroke="rgba(254,243,199,0.6)" stroke-width="1.5" fill="none"/>
          <polyline points="520,40 480,120 510,180 470,260 500,320 450,400" stroke="rgba(254,243,199,0.6)" stroke-width="1.5" fill="none"/>
          <!-- Ground and ridge silhouette -->
          <path d="M 0 380 Q 200 370 400 380 Q 600 370 800 380 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 440 Q 400 430 800 440 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Where the altar WAS — a glowing crater / ring -->
          <ellipse cx="400" cy="400" rx="80" ry="14" fill="rgba(251,113,38,0.85)"/>
          <ellipse cx="400" cy="400" rx="60" ry="10" fill="rgba(254,243,199,0.95)"/>
          <ellipse cx="400" cy="400" rx="40" ry="6"  fill="#fef3c7"/>
          <!-- Sparks flying -->
          <g fill="#fef3c7">
            <circle cx="320" cy="380" r="2"/>
            <circle cx="480" cy="380" r="2"/>
            <circle cx="360" cy="360" r="1.5"/>
            <circle cx="440" cy="360" r="1.5"/>
            <circle cx="300" cy="350" r="1.2"/>
            <circle cx="500" cy="350" r="1.2"/>
            <circle cx="380" cy="334" r="1.6"/>
            <circle cx="420" cy="334" r="1.6"/>
          </g>
          <!-- People fallen face-down (faint silhouettes left/right) -->
          <g fill="#0a0d1a" opacity="0.9">
            <ellipse cx="120" cy="445" rx="22" ry="6"/>
            <ellipse cx="110" cy="441" rx="9" ry="6"/>
            <ellipse cx="170" cy="450" rx="22" ry="6"/>
            <ellipse cx="160" cy="446" rx="9" ry="6"/>
            <ellipse cx="630" cy="445" rx="22" ry="6"/>
            <ellipse cx="620" cy="441" rx="9" ry="6"/>
            <ellipse cx="680" cy="450" rx="22" ry="6"/>
            <ellipse cx="670" cy="446" rx="9" ry="6"/>
          </g>
          <!-- Elijah, arms outstretched in awe (a small dark figure to the side of the column) -->
          <g transform="translate(250 380)">
            <ellipse cx="0" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-26" rx="8" ry="9" fill="#0a0d1a"/>
            <line x1="-9" y1="-16" x2="-26" y2="-32" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="9"  y1="-16" x2="26"  y2="-32" stroke="#0a0d1a" stroke-width="4"/>
            <circle cx="0" cy="-26" r="20" fill="none" stroke="rgba(251,191,36,0.8)" stroke-width="1.4"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"The Lord — he is God! The Lord — he is God!"</text>
        </svg>`
      }
    ],
    closing: 'Elijah did not light the fire. He did not even need to convince anyone. He just showed up, faced the wrong crowd alone, and trusted that the God who had brought him this far could be trusted to finish the sermon. Most days you will not see fire from heaven. You will see soaked wood and silence and a long stretch where it is unclear whether God is going to back up the prayer at all. Keep building the altar anyway. Keep pouring the water. The God who answered Elijah is the God who answers still.',
    closingPrompt: 'Where in your life are you wavering between two opinions — and what would it look like, this week, to build one altar and stop tending the other?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 9 — Esther: For Such a Time as This
  // ════════════════════════════════════════════════════════════
  {
    id: 'esther',
    title: 'Esther — For Such a Time',
    subtitle: 'A hidden queen, a death decree, an unspoken Name.',
    icon: '👑',
    color: '#a78bfa',
    accentColor: '#fef3c7',
    era: 'exile',
    scriptureRef: 'Esther 1-10',
    duration: '~7 min',
    scenes: [
      {
        id: 'hidden-queen',
        title: 'A Hidden Identity',
        scriptureRef: 'Esther 2:5-17',
        bibleText: '"Esther had not revealed her nationality and family background, because Mordecai had forbidden her to do so."',
        narration: 'King Xerxes ruled an empire stretching from India to Ethiopia from his winter palace in Susa. Looking for a new queen after deposing Vashti, he gathered the most beautiful young women in the kingdom. Among them was Hadassah — a Jewish orphan, raised by her cousin Mordecai. She took the Persian name Esther and entered the harem. Mordecai told her: tell no one you are Jewish. And of all the women, the king loved her most. He set the royal crown on her head. The empire saw a queen. It did not see a Jew. Not yet.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'esh', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Persian palace interior -->
          <g fill="#241846" stroke="rgba(251,191,36,0.5)" stroke-width="1">
            <!-- Floor pattern -->
            <rect x="0" y="380" width="800" height="120"/>
            <line x1="0" y1="400" x2="800" y2="400" stroke="rgba(251,191,36,0.25)" stroke-width="0.6"/>
            <line x1="0" y1="430" x2="800" y2="430" stroke="rgba(251,191,36,0.25)" stroke-width="0.6"/>
            <line x1="0" y1="460" x2="800" y2="460" stroke="rgba(251,191,36,0.25)" stroke-width="0.6"/>
            <!-- Diamond pattern -->
            <g fill="rgba(251,191,36,0.2)">
              <polygon points="100,415 110,410 120,415 110,420"/>
              <polygon points="200,415 210,410 220,415 210,420"/>
              <polygon points="300,415 310,410 320,415 310,420"/>
              <polygon points="500,415 510,410 520,415 510,420"/>
              <polygon points="600,415 610,410 620,415 610,420"/>
              <polygon points="700,415 710,410 720,415 710,420"/>
            </g>
          </g>
          <!-- Pillared archway behind the throne -->
          <g fill="#0a0d1a" opacity="0.92" stroke="rgba(251,191,36,0.55)" stroke-width="1">
            <rect x="80"  y="120" width="20" height="260"/>
            <rect x="700" y="120" width="20" height="260"/>
            <path d="M 80 120 Q 400 40 720 120" stroke="rgba(251,191,36,0.55)" stroke-width="2" fill="none"/>
          </g>
          <!-- Curtain (heavy purple/gold drape framing center) -->
          <g fill="#3d2a5e" opacity="0.85">
            <path d="M 220 120 Q 240 220 220 320 L 280 320 Q 260 220 280 120 Z"/>
            <path d="M 520 120 Q 540 220 520 320 L 580 320 Q 560 220 580 120 Z"/>
          </g>
          <g stroke="rgba(251,191,36,0.5)" stroke-width="1" fill="none">
            <path d="M 224 140 Q 244 220 224 314"/>
            <path d="M 576 140 Q 556 220 576 314"/>
          </g>
          <!-- Throne dais (small, off-center) -->
          <path d="M 470 360 L 530 360 L 522 410 L 478 410 Z" fill="#1a1233" stroke="rgba(251,191,36,0.45)" stroke-width="1"/>
          <!-- Esther crowned, in royal robe, standing forward of throne -->
          <g transform="translate(380 360)">
            <!-- Robe -->
            <path d="M -28 50 Q -22 -10 0 -30 Q 22 -10 28 50 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <path d="M -22 50 Q -16 -8 0 -22 Q 16 -8 22 50 Z" fill="#5a4378" opacity="0.6"/>
            <!-- Head -->
            <ellipse cx="0" cy="-44" rx="12" ry="14" fill="#1a1233"/>
            <!-- Hair (long, dark) -->
            <path d="M -12 -38 Q -16 -10 -14 24 M 12 -38 Q 16 -10 14 24" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <!-- Crown -->
            <path d="M -10 -56 L -7 -64 L -3 -58 L 0 -66 L 3 -58 L 7 -64 L 10 -56 Z" fill="rgba(251,191,36,0.9)" stroke="#fef3c7" stroke-width="0.5"/>
            <circle cx="0" cy="-60" r="2" fill="#fef3c7"/>
            <!-- Halo / glow -->
            <circle cx="0" cy="-44" r="28" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1"/>
          </g>
          <!-- Mordecai, watching from the gate (far right, smaller, plain robes) -->
          <g transform="translate(720 380)" opacity="0.7">
            <ellipse cx="0" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-26" rx="8" ry="10" fill="#0a0d1a"/>
            <!-- Beard -->
            <path d="M -7 -18 Q 0 -8 7 -18" stroke="rgba(254,243,199,0.4)" stroke-width="1.2" fill="none"/>
          </g>
          <text x="720" y="368" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="1.8" fill="rgba(254,243,199,0.55)">THE GATE</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">Susa · the king's palace · a secret beneath a crown</text>
        </svg>`
      },
      {
        id: 'mordecai-plea',
        title: "Mordecai's Plea",
        scriptureRef: 'Esther 4:1-17',
        bibleText: '"Who knows but that you have come to your royal position for such a time as this?"',
        narration: 'Haman, the king’s second-in-command, hated Mordecai because Mordecai would not bow to him. Hatred swelled into something bigger: Haman convinced the king to issue a decree wiping out every Jew in the empire on a single day. Mordecai tore his clothes, put on sackcloth and ashes, and sat at the king’s gate. Esther sent a messenger: what is wrong? He sent back a copy of the decree, and a sentence that has rung in every generation since: "Do not think that because you are in the king’s house you alone will escape. Who knows but that you have come to your royal position for such a time as this?"',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'esm', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Palace gate (heavy stone arch on left) -->
          <g fill="#1a1233" stroke="rgba(251,191,36,0.45)" stroke-width="1">
            <rect x="0" y="180" width="280" height="220"/>
            <path d="M 60 180 Q 60 100 160 100 Q 260 100 260 180" stroke="rgba(251,191,36,0.5)" stroke-width="2" fill="#0a0d1a"/>
            <!-- Bronze gate hint -->
            <rect x="80" y="180" width="160" height="200" fill="#241846" stroke="rgba(251,191,36,0.5)" stroke-width="1.5"/>
            <line x1="160" y1="180" x2="160" y2="380" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <g fill="rgba(251,191,36,0.55)">
              <circle cx="120" cy="220" r="2"/><circle cx="200" cy="220" r="2"/>
              <circle cx="120" cy="260" r="2"/><circle cx="200" cy="260" r="2"/>
              <circle cx="120" cy="300" r="2"/><circle cx="200" cy="300" r="2"/>
            </g>
          </g>
          <!-- Ground -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Mordecai sitting outside the gate, in sackcloth and ashes -->
          <g transform="translate(360 410)">
            <!-- Sackcloth wrapping -->
            <path d="M -28 0 Q -22 -42 0 -50 Q 22 -42 28 0 Z" fill="#3d2a16" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
            <ellipse cx="0" cy="-58" rx="11" ry="13" fill="#3d2a16"/>
            <!-- Ash on head -->
            <ellipse cx="0" cy="-70" rx="9" ry="3" fill="rgba(254,243,199,0.5)"/>
            <!-- Tear streaks -->
            <line x1="-3" y1="-58" x2="-3" y2="-50" stroke="rgba(254,243,199,0.5)" stroke-width="0.8"/>
            <line x1="3"  y1="-58" x2="3"  y2="-50" stroke="rgba(254,243,199,0.5)" stroke-width="0.8"/>
            <!-- Beard -->
            <path d="M -7 -52 Q 0 -38 7 -52" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
          </g>
          <!-- Ash heap around him -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="340" cy="420" rx="32" ry="6"/>
            <ellipse cx="380" cy="425" rx="36" ry="7"/>
          </g>
          <!-- Servant carrying message between gate and palace (mid-stride) -->
          <g transform="translate(560 400)">
            <ellipse cx="0" cy="0" rx="9" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-26" rx="8" ry="9" fill="#0a0d1a"/>
            <line x1="-6" y1="-12" x2="-22" y2="2" stroke="#0a0d1a" stroke-width="3"/>
            <!-- Scroll in hand -->
            <rect x="-26" y="-2" width="14" height="10" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <!-- Walking stride -->
            <line x1="-4" y1="22" x2="-12" y2="40" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="4"  y1="22" x2="12"  y2="40" stroke="#0a0d1a" stroke-width="4"/>
          </g>
          <!-- The decree (scroll on the ground next to Mordecai, with wax seal) -->
          <g transform="translate(440 430)">
            <rect x="0" y="0" width="80" height="18" fill="#fef3c7" opacity="0.9"/>
            <circle cx="8" cy="9" r="5" fill="rgba(251,113,38,0.85)" stroke="#3d2a16" stroke-width="0.6"/>
            <line x1="18" y1="5"  x2="74" y2="5"  stroke="#3d2a16" stroke-width="0.5"/>
            <line x1="18" y1="9"  x2="68" y2="9"  stroke="#3d2a16" stroke-width="0.5"/>
            <line x1="18" y1="13" x2="62" y2="13" stroke="#3d2a16" stroke-width="0.5"/>
          </g>
          <!-- Distant palace silhouette (right) -->
          <g fill="#0a0d1a" opacity="0.7" stroke="rgba(251,191,36,0.35)" stroke-width="0.8">
            <rect x="620" y="220" width="180" height="180"/>
            <polygon points="620,220 710,160 800,220"/>
            <rect x="675" y="280" width="14" height="20"/>
            <rect x="705" y="280" width="14" height="20"/>
            <rect x="735" y="280" width="14" height="20"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"For such a time as this"</text>
        </svg>`
      },
      {
        id: 'risky-approach',
        title: 'The Risky Approach',
        scriptureRef: 'Esther 5:1-2',
        bibleText: '"If I perish, I perish."',
        narration: 'No one came uninvited before King Xerxes. Even the queen could be executed for entering unsummoned. Esther fasted three days. Her servants fasted. Mordecai fasted. Then she put on her royal robes and walked into the inner court alone. The king saw her standing there. The whole room held its breath. He held out the golden scepter — the sign of welcome — and she touched the tip of it. "What is it, Queen Esther? Even up to half the kingdom, it will be given to you." She did not ask yet. She invited him — and Haman — to a banquet she had prepared. She was setting a snare with quiet hands.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'esr', skyTop:'#241846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Massive throne hall — soaring columns on both sides -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1">
            <rect x="40"  y="60"  width="40" height="380"/>
            <rect x="120" y="60"  width="40" height="380"/>
            <rect x="640" y="60"  width="40" height="380"/>
            <rect x="720" y="60"  width="40" height="380"/>
            <!-- Capitals -->
            <rect x="34"  y="44" width="52" height="20" fill="#3d2a16"/>
            <rect x="114" y="44" width="52" height="20" fill="#3d2a16"/>
            <rect x="634" y="44" width="52" height="20" fill="#3d2a16"/>
            <rect x="714" y="44" width="52" height="20" fill="#3d2a16"/>
          </g>
          <!-- Floor receding (perspective lines toward throne) -->
          <g stroke="rgba(251,191,36,0.3)" stroke-width="0.8" fill="none">
            <path d="M 0 440 L 400 380"/>
            <path d="M 800 440 L 400 380"/>
            <path d="M 0 480 L 400 400"/>
            <path d="M 800 480 L 400 400"/>
          </g>
          <!-- Throne dais (back-center, raised on steps) -->
          <g fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1.4">
            <path d="M 340 320 L 460 320 L 470 380 L 330 380 Z"/>
            <path d="M 320 380 L 480 380 L 488 410 L 312 410 Z"/>
            <path d="M 300 410 L 500 410 L 510 440 L 290 440 Z"/>
          </g>
          <!-- King Xerxes on throne, scepter extended -->
          <g transform="translate(400 320)">
            <rect x="-30" y="-44" width="60" height="44" fill="#3d2a5e" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <ellipse cx="0" cy="-20" rx="20" ry="28" fill="#1a1233"/>
            <ellipse cx="0" cy="-54" rx="13" ry="16" fill="#1a1233"/>
            <!-- Beard (full Persian style) -->
            <path d="M -10 -46 Q -14 -28 -8 -22 M 10 -46 Q 14 -28 8 -22" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <path d="M -8 -36 Q 0 -16 8 -36" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="none"/>
            <!-- Crown -->
            <path d="M -12 -66 L -8 -76 L -3 -68 L 0 -78 L 3 -68 L 8 -76 L 12 -66 Z" fill="rgba(251,191,36,0.9)"/>
            <!-- Scepter EXTENDED toward Esther — long golden line angled forward -->
            <line x1="22" y1="-22" x2="120" y2="-2" stroke="rgba(251,191,36,0.9)" stroke-width="3.5"/>
            <circle cx="120" cy="-2" r="6" fill="rgba(251,191,36,0.95)" stroke="#fef3c7" stroke-width="0.8"/>
          </g>
          <!-- Esther approaching, mid-walk, touching the scepter -->
          <g transform="translate(540 360)">
            <!-- Royal robes (long, flowing) -->
            <path d="M -32 60 Q -22 -10 0 -30 Q 22 -10 32 60 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.75)" stroke-width="1.4"/>
            <path d="M -24 60 Q -16 -8 0 -22 Q 16 -8 24 60 Z" fill="#5a4378" opacity="0.6"/>
            <!-- Head -->
            <ellipse cx="0" cy="-44" rx="12" ry="14" fill="#1a1233"/>
            <!-- Hair -->
            <path d="M -12 -38 Q -16 -10 -14 30 M 12 -38 Q 16 -10 14 30" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <!-- Crown -->
            <path d="M -9 -56 L -6 -62 L -2 -58 L 0 -64 L 2 -58 L 6 -62 L 9 -56 Z" fill="rgba(251,191,36,0.9)"/>
            <!-- Outstretched hand toward scepter -->
            <line x1="-14" y1="-22" x2="-40" y2="-8" stroke="#1a1233" stroke-width="3"/>
            <ellipse cx="-42" cy="-8" rx="3" ry="2" fill="#1a1233"/>
            <!-- Halo -->
            <circle cx="0" cy="-44" r="28" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
          </g>
          <!-- Beam of golden light from the scepter to Esther -->
          <line x1="420" y1="318" x2="500" y2="350" stroke="rgba(254,243,199,0.4)" stroke-width="6" opacity="0.55"/>
          <!-- Guards flanking (stone-still silhouettes) -->
          <g fill="#0a0d1a">
            <g transform="translate(220 410)">
              <ellipse cx="0" cy="0" rx="11" ry="36"/>
              <ellipse cx="0" cy="-36" rx="9" ry="11"/>
              <line x1="0" y1="-44" x2="0" y2="-90" stroke="#0a0d1a" stroke-width="3"/>
              <polygon points="-3,-90 3,-90 0,-104" fill="rgba(251,191,36,0.7)"/>
            </g>
            <g transform="translate(640 410)">
              <ellipse cx="0" cy="0" rx="11" ry="36"/>
              <ellipse cx="0" cy="-36" rx="9" ry="11"/>
              <line x1="0" y1="-44" x2="0" y2="-90" stroke="#0a0d1a" stroke-width="3"/>
              <polygon points="-3,-90 3,-90 0,-104" fill="rgba(251,191,36,0.7)"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"If I perish · I perish"</text>
        </svg>`
      },
      {
        id: 'banquet',
        title: 'The Banquet',
        scriptureRef: 'Esther 7:1-10',
        bibleText: '"The adversary and enemy is this vile Haman."',
        narration: 'At the second banquet — Esther had stretched it to two, building the moment — the king asked again: "Queen Esther, what is your petition? It will be granted." She took a breath and named her people for the first time. "If I have found favor with you, Your Majesty, and if it pleases you, grant me my life — this is my petition. And spare my people — this is my request. For I and my people have been sold to be destroyed." "Who is he?" the king roared. "Where is the man who has dared to do such a thing?" Esther pointed across the table. "An adversary and an enemy. This vile Haman." Haman went pale. By morning he hung on the very gallows he had built for Mordecai.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'esb', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Lamps hanging from chains -->
          <g>
            <line x1="200" y1="0" x2="200" y2="80" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <ellipse cx="200" cy="92" rx="14" ry="9" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="200" cy="88" rx="8" ry="8" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="200" cy="60" rx="42" ry="26" fill="rgba(251,191,36,0.18)"/>
            <line x1="600" y1="0" x2="600" y2="80" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <ellipse cx="600" cy="92" rx="14" ry="9" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="600" cy="88" rx="8" ry="8" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="600" cy="60" rx="42" ry="26" fill="rgba(251,191,36,0.18)"/>
          </g>
          <!-- Long banquet table running across the bottom -->
          <g>
            <rect x="80" y="320" width="640" height="40" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.5"/>
            <rect x="80" y="358" width="640" height="14" fill="#241846"/>
            <!-- Wine vessels -->
            <ellipse cx="200" cy="316" rx="10" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <path d="M 200 312 L 200 304" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="400" cy="316" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <path d="M 400 312 L 400 300" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="600" cy="316" rx="10" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <!-- Cups / fruit suggested -->
            <circle cx="260" cy="318" r="4" fill="rgba(251,191,36,0.65)"/>
            <circle cx="320" cy="318" r="3" fill="rgba(120,20,20,0.7)"/>
            <circle cx="340" cy="320" r="3" fill="rgba(120,20,20,0.7)"/>
            <circle cx="480" cy="318" r="4" fill="rgba(251,191,36,0.65)"/>
            <circle cx="540" cy="320" r="3" fill="rgba(120,20,20,0.7)"/>
          </g>
          <!-- King Xerxes (center, leaning forward in alarm) -->
          <g transform="translate(400 310)">
            <ellipse cx="0" cy="0" rx="22" ry="20" fill="#3d2a5e"/>
            <ellipse cx="0" cy="-20" rx="14" ry="18" fill="#1a1233"/>
            <!-- Crown -->
            <path d="M -10 -34 L -6 -42 L -2 -36 L 0 -44 L 2 -36 L 6 -42 L 10 -34 Z" fill="rgba(251,191,36,0.9)"/>
            <!-- Beard -->
            <path d="M -8 -16 Q 0 -2 8 -16" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Halo -->
            <circle cx="0" cy="-20" r="22" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="0.8"/>
          </g>
          <!-- Esther (left), standing, hand pointing across the table -->
          <g transform="translate(220 310)">
            <path d="M -22 50 Q -18 -8 0 -22 Q 18 -8 22 50 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-34" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -10 -28 Q -12 -8 -10 10 M 10 -28 Q 12 -8 10 10" stroke="#0a0d1a" stroke-width="2.5" fill="none"/>
            <!-- Crown -->
            <path d="M -8 -44 L -5 -50 L -2 -46 L 0 -52 L 2 -46 L 5 -50 L 8 -44 Z" fill="rgba(251,191,36,0.9)"/>
            <!-- Pointing arm extended toward Haman -->
            <line x1="14" y1="-14" x2="80" y2="-30" stroke="#1a1233" stroke-width="4"/>
            <circle cx="80" cy="-30" r="2.5" fill="#1a1233"/>
            <!-- Halo -->
            <circle cx="0" cy="-34" r="22" fill="none" stroke="rgba(251,191,36,0.8)" stroke-width="1.2"/>
          </g>
          <!-- Haman (right), recoiling, dropping cup -->
          <g transform="translate(580 312)">
            <ellipse cx="0" cy="0" rx="14" ry="22" fill="#3d2a16"/>
            <ellipse cx="0" cy="-20" rx="11" ry="14" fill="#1a1233"/>
            <!-- Open-mouth shock (a small dark oval for mouth) -->
            <ellipse cx="0" cy="-16" rx="3" ry="3" fill="rgba(254,243,199,0.7)"/>
            <!-- Pointed beard -->
            <path d="M -6 -16 Q 0 0 6 -16" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Hand grabbing chest (panic) -->
            <line x1="-10" y1="-8" x2="-2" y2="0" stroke="#1a1233" stroke-width="3"/>
            <!-- Dropped cup -->
            <g transform="translate(-26 14)">
              <ellipse cx="0" cy="0" rx="6" ry="3" fill="#3d2a16"/>
              <path d="M -2 2 Q -4 8 -2 14 M 2 2 Q 4 8 2 14" stroke="rgba(120,20,20,0.7)" stroke-width="1.5" fill="none"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Who is he? Where is the man who has dared?"</text>
        </svg>`
      },
      {
        id: 'purim',
        title: 'Deliverance — and Purim',
        scriptureRef: 'Esther 9:20-32',
        bibleText: '"These days should be remembered and observed in every generation… as days of feasting and joy and giving gifts of food to one another and gifts to the poor."',
        narration: 'A new decree went out from the palace — sealed with the king’s own ring — giving the Jews the right to defend themselves. On the very day Haman had set for their destruction, they were not destroyed. Mordecai was elevated to second in the kingdom. Esther wrote the story down and sent it to every province. Each year, from then until now, the people of God keep the festival of Purim — reading the scroll, sending gifts to the poor, eating and rejoicing. The most striking thing about the book of Esther: God’s name is never spoken aloud. He is everywhere — hidden, working, faithful — but unspoken. The exiles learned to see Him without being told.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'esp', skyTop:'#1e1846', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Sunburst centered (rejoicing) -->
          <radialGradient id="espSun" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%"  stop-color="rgba(254,243,199,0.85)"/>
            <stop offset="35%" stop-color="rgba(251,191,36,0.5)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="180" rx="380" ry="180" fill="url(#espSun)"/>
          <!-- Streets of Susa, ground -->
          <path d="M 0 360 Q 200 350 400 358 Q 600 350 800 360 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 420 Q 400 410 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Crowd celebrating: people with raised arms, scrolls, baskets -->
          <g fill="#0a0d1a">
            <!-- Person 1 with arms up -->
            <g transform="translate(120 410)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="-9" y1="-12" x2="-22" y2="-30" stroke="#0a0d1a" stroke-width="3.5"/>
              <line x1="9"  y1="-12" x2="22"  y2="-30" stroke="#0a0d1a" stroke-width="3.5"/>
            </g>
            <!-- Person 2 with scroll (the Megillah) -->
            <g transform="translate(220 412)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <!-- Held scroll -->
              <rect x="-14" y="-10" width="28" height="10" fill="#fef3c7"/>
              <line x1="-14" y1="-10" x2="-14" y2="0" stroke="#3d2a16" stroke-width="1.5"/>
              <line x1="14"  y1="-10" x2="14"  y2="0" stroke="#3d2a16" stroke-width="1.5"/>
            </g>
            <!-- Person 3 dancing (one leg up) -->
            <g transform="translate(330 410)">
              <ellipse cx="0" cy="-4" rx="9" ry="22"/>
              <ellipse cx="0" cy="-26" rx="8" ry="9"/>
              <line x1="-9" y1="-16" x2="-18" y2="-32" stroke="#0a0d1a" stroke-width="3.5"/>
              <line x1="9"  y1="-16" x2="20"  y2="-30" stroke="#0a0d1a" stroke-width="3.5"/>
              <line x1="-4" y1="16" x2="-10" y2="32" stroke="#0a0d1a" stroke-width="4"/>
              <line x1="4"  y1="16" x2="14" y2="22" stroke="#0a0d1a" stroke-width="4"/>
            </g>
            <!-- Person 4 carrying basket of gifts -->
            <g transform="translate(450 412)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="9" y1="-12" x2="22" y2="-6" stroke="#0a0d1a" stroke-width="3"/>
              <!-- Basket -->
              <path d="M 18 -8 Q 22 0 30 0 Q 38 0 42 -8 L 38 4 Q 30 8 22 4 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
              <!-- Fruit -->
              <circle cx="26" cy="-3" r="2" fill="rgba(251,191,36,0.85)"/>
              <circle cx="34" cy="-3" r="2" fill="rgba(251,113,38,0.85)"/>
            </g>
            <!-- Person 5 with raised cup -->
            <g transform="translate(560 412)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="9" y1="-12" x2="22" y2="-32" stroke="#0a0d1a" stroke-width="3"/>
              <ellipse cx="22" cy="-36" rx="6" ry="3" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.6"/>
            </g>
            <!-- Person 6 child running -->
            <g transform="translate(660 414)">
              <ellipse cx="0" cy="-2" rx="6" ry="14"/>
              <ellipse cx="0" cy="-18" rx="6" ry="6"/>
              <line x1="-4" y1="12" x2="-10" y2="22" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="4"  y1="12" x2="10" y2="22" stroke="#0a0d1a" stroke-width="3"/>
            </g>
          </g>
          <!-- Doves released (small) -->
          <g fill="#fef3c7" opacity="0.85">
            <path d="M 280 100 Q 290 96 296 100 Q 290 104 280 100" />
            <path d="M 460 80 Q 470 76 476 80 Q 470 84 460 80" />
            <path d="M 540 130 Q 550 126 556 130 Q 550 134 540 130" />
          </g>
          <!-- Mordecai in royal robes (small, in the background) -->
          <g transform="translate(400 350)" opacity="0.7">
            <path d="M -16 30 Q -12 -6 0 -16 Q 12 -6 16 30 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="0" cy="-22" rx="8" ry="10" fill="#1a1233"/>
            <path d="M -6 -16 Q 0 -4 6 -16" stroke="rgba(254,243,199,0.45)" stroke-width="1.2" fill="none"/>
            <path d="M -6 -32 L -4 -38 L -1 -33 L 0 -40 L 1 -33 L 4 -38 L 6 -32 Z" fill="rgba(251,191,36,0.85)"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">Days of feasting · gifts to one another · gifts to the poor</text>
        </svg>`
      }
    ],
    closing: 'God’s name is not mentioned even once in the entire book of Esther. No prophet calls down fire. No angel appears. There are no parted seas, no burning bushes, no walls falling down. There is only a young woman risking her life at the right time — and an old man in sackcloth pressing her to do it. That is how God most often works in your life and mine: not in fireworks, but in placements. He puts the right person in the right room before the room knows it needs them. You may be already standing where He has positioned you. The only question is whether you will speak.',
    closingPrompt: 'Where has God placed you that — quietly, without fanfare — only you can speak for someone who has no voice?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 10 — Joshua & the Battle of Jericho
  // ════════════════════════════════════════════════════════════
  {
    id: 'jericho',
    title: 'Joshua & the Battle of Jericho',
    subtitle: "An army that doesn't fight. A wall that doesn't stand.",
    icon: '📯',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'exodus-conquest',
    scriptureRef: 'Joshua 5-6',
    duration: '~7 min',
    scenes: [
      {
        id: 'captain-of-the-host',
        title: "The Captain of the Lord's Host",
        scriptureRef: 'Joshua 5:13-15',
        bibleText: '"Take off your sandals, for the place where you are standing is holy."',
        narration: 'Joshua was alone, scouting the walls of Jericho, when he looked up and saw a man standing in front of him with a drawn sword. Joshua walked toward him. "Are you for us or for our enemies?" "Neither," came the answer. "I am the commander of the army of the Lord. I have now come." Joshua dropped face-down to the ground. "What message does my Lord have for his servant?" The Commander said: "Take off your sandals, for the place where you are standing is holy." Before any wall fell, Joshua had to know who was really leading the army. It was not him.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jrc', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Distant walls of Jericho on the right -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1.2" opacity="0.92">
            <rect x="540" y="240" width="260" height="160"/>
            <!-- Battlements -->
            <g>
              <rect x="540" y="230" width="14" height="12"/>
              <rect x="570" y="230" width="14" height="12"/>
              <rect x="600" y="230" width="14" height="12"/>
              <rect x="630" y="230" width="14" height="12"/>
              <rect x="660" y="230" width="14" height="12"/>
              <rect x="690" y="230" width="14" height="12"/>
              <rect x="720" y="230" width="14" height="12"/>
              <rect x="750" y="230" width="14" height="12"/>
              <rect x="780" y="230" width="14" height="12"/>
            </g>
            <!-- Tower -->
            <rect x="620" y="170" width="44" height="70"/>
            <rect x="618" y="160" width="48" height="14"/>
          </g>
          <text x="660" y="222" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(251,191,36,0.55)">JERICHO</text>
          <!-- Plain in front of Jericho -->
          <path d="M 0 360 Q 200 340 400 350 Q 600 340 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 410 Q 400 400 800 410 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- The Commander of the Lord's army — tall radiant figure with drawn sword, center-left -->
          <g transform="translate(280 330)">
            <ellipse cx="0" cy="0" rx="18" ry="58" fill="rgba(254,243,199,0.92)"/>
            <ellipse cx="0" cy="-66" rx="14" ry="18" fill="rgba(254,243,199,0.95)"/>
            <!-- Sword raised, unsheathed -->
            <line x1="22" y1="-30" x2="64" y2="-110" stroke="rgba(251,191,36,0.95)" stroke-width="4"/>
            <polygon points="62,-110 70,-118 66,-104" fill="#fef3c7"/>
            <!-- Crossguard -->
            <line x1="14" y1="-86" x2="32" y2="-78" stroke="rgba(251,191,36,0.85)" stroke-width="3"/>
            <!-- Wings hint -->
            <path d="M -20 -30 Q -84 0 -56 70" stroke="rgba(251,191,36,0.5)" stroke-width="1.5" fill="rgba(254,243,199,0.2)"/>
            <path d="M 20 -30 Q 84 0 56 70"   stroke="rgba(251,191,36,0.5)" stroke-width="1.5" fill="rgba(254,243,199,0.2)"/>
            <!-- Halo -->
            <circle cx="0" cy="-66" r="30" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.5"/>
          </g>
          <!-- Glow on the ground around the Commander (holy ground) -->
          <ellipse cx="280" cy="410" rx="80" ry="14" fill="rgba(251,191,36,0.35)"/>
          <!-- Joshua face-down on the ground in front of Him -->
          <g transform="translate(420 410)">
            <ellipse cx="0" cy="0" rx="40" ry="8" fill="#1a1233"/>
            <ellipse cx="-32" cy="-4" rx="9" ry="6" fill="#1a1233"/>
            <!-- Arms extended in submission -->
            <line x1="20" y1="-2" x2="42" y2="-4" stroke="#1a1233" stroke-width="4"/>
            <line x1="20" y1="2"  x2="42" y2="4"  stroke="#1a1233" stroke-width="4"/>
            <!-- Sandals removed (small, beside him) -->
            <ellipse cx="-58" cy="6" rx="5" ry="2" fill="#3d2a16"/>
            <ellipse cx="-58" cy="12" rx="5" ry="2" fill="#3d2a16"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Take off your sandals · this place is holy"</text>
        </svg>`
      },
      {
        id: 'first-march',
        title: 'The First March',
        scriptureRef: 'Joshua 6:1-14',
        bibleText: '"You and all the armed men are to march around the city once. Do this for six days."',
        narration: 'The Lord’s battle plan was nothing any general had ever drawn. No siege engines. No ladders. No tunnels under the walls. Just: walk around the city once a day for six days. Seven priests with trumpets of ram’s horn out in front. Behind them the ark of the covenant. Behind the ark the armed men. And — strangest of all — total silence. Not a war cry. Not a whisper. Day one, they marched around the towering walls of Jericho once and went back to camp. The watchmen of Jericho stared from above and could not understand what they had just seen.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jrm', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Walls of Jericho (looming, foreshortened on the right edge) -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1.2">
            <polygon points="800,80 600,120 600,420 800,420"/>
            <!-- Stones suggested -->
            <g stroke="rgba(251,191,36,0.4)" stroke-width="0.6" fill="none">
              <line x1="600" y1="160" x2="800" y2="120"/>
              <line x1="600" y1="200" x2="800" y2="160"/>
              <line x1="600" y1="240" x2="800" y2="200"/>
              <line x1="600" y1="280" x2="800" y2="240"/>
              <line x1="600" y1="320" x2="800" y2="280"/>
              <line x1="600" y1="360" x2="800" y2="320"/>
            </g>
            <!-- Battlements on top -->
            <g stroke="rgba(251,191,36,0.55)" stroke-width="1">
              <rect x="610" y="110" width="14" height="10"/>
              <rect x="640" y="106" width="14" height="10"/>
              <rect x="670" y="100" width="14" height="10"/>
              <rect x="700" y="94"  width="14" height="10"/>
              <rect x="730" y="88"  width="14" height="10"/>
              <rect x="760" y="84"  width="14" height="10"/>
            </g>
            <!-- A watchman on the wall (small) -->
            <ellipse cx="700" cy="80"  rx="3" ry="6" fill="#1a1233"/>
            <ellipse cx="700" cy="73"  rx="3" ry="3" fill="#1a1233"/>
          </g>
          <!-- Ground (plain wrapping around the city) -->
          <path d="M 0 360 Q 200 340 400 350 Q 600 340 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 410 Q 400 400 800 410 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- The procession — left to right, marching beside the walls -->
          <!-- 1. Seven priests with trumpets at the head -->
          <g fill="#1a1233">
            <g transform="translate(60 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <!-- Trumpet (ram's horn shape) -->
              <path d="M 7 -16 Q 22 -22 30 -14" stroke="rgba(251,191,36,0.85)" stroke-width="2.5" fill="none"/>
              <circle cx="30" cy="-14" r="3" fill="rgba(251,191,36,0.9)"/>
            </g>
            <g transform="translate(110 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <path d="M 7 -16 Q 22 -22 30 -14" stroke="rgba(251,191,36,0.85)" stroke-width="2.5" fill="none"/>
              <circle cx="30" cy="-14" r="3" fill="rgba(251,191,36,0.9)"/>
            </g>
            <g transform="translate(160 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <path d="M 7 -16 Q 22 -22 30 -14" stroke="rgba(251,191,36,0.85)" stroke-width="2.5" fill="none"/>
              <circle cx="30" cy="-14" r="3" fill="rgba(251,191,36,0.9)"/>
            </g>
            <g transform="translate(210 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <path d="M 7 -16 Q 22 -22 30 -14" stroke="rgba(251,191,36,0.85)" stroke-width="2.5" fill="none"/>
              <circle cx="30" cy="-14" r="3" fill="rgba(251,191,36,0.9)"/>
            </g>
            <g transform="translate(260 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <path d="M 7 -16 Q 22 -22 30 -14" stroke="rgba(251,191,36,0.85)" stroke-width="2.5" fill="none"/>
              <circle cx="30" cy="-14" r="3" fill="rgba(251,191,36,0.9)"/>
            </g>
            <g transform="translate(310 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <path d="M 7 -16 Q 22 -22 30 -14" stroke="rgba(251,191,36,0.85)" stroke-width="2.5" fill="none"/>
              <circle cx="30" cy="-14" r="3" fill="rgba(251,191,36,0.9)"/>
            </g>
            <g transform="translate(360 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <path d="M 7 -16 Q 22 -22 30 -14" stroke="rgba(251,191,36,0.85)" stroke-width="2.5" fill="none"/>
              <circle cx="30" cy="-14" r="3" fill="rgba(251,191,36,0.9)"/>
            </g>
          </g>
          <!-- 2. The Ark of the Covenant, carried by 4 priests on poles -->
          <g transform="translate(440 388)">
            <!-- Poles -->
            <line x1="-50" y1="0" x2="50" y2="0" stroke="#3d2a16" stroke-width="3"/>
            <line x1="-50" y1="6" x2="50" y2="6" stroke="#3d2a16" stroke-width="3"/>
            <!-- Box -->
            <rect x="-30" y="-22" width="60" height="22" fill="rgba(251,191,36,0.85)" stroke="#fef3c7" stroke-width="1.2"/>
            <!-- Cherubim (two small angels facing) -->
            <ellipse cx="-12" cy="-30" rx="5" ry="6" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="12"  cy="-30" rx="5" ry="6" fill="rgba(251,191,36,0.95)"/>
            <path d="M -16 -34 Q -22 -38 -16 -42" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <path d="M 16 -34 Q 22 -38 16 -42" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <!-- 4 priests carrying (small) -->
            <g fill="#1a1233">
              <ellipse cx="-50" cy="14" rx="5" ry="14"/>
              <ellipse cx="-50" cy="-2" rx="4" ry="5"/>
              <ellipse cx="-30" cy="14" rx="5" ry="14"/>
              <ellipse cx="-30" cy="-2" rx="4" ry="5"/>
              <ellipse cx="30"  cy="14" rx="5" ry="14"/>
              <ellipse cx="30"  cy="-2" rx="4" ry="5"/>
              <ellipse cx="50"  cy="14" rx="5" ry="14"/>
              <ellipse cx="50"  cy="-2" rx="4" ry="5"/>
            </g>
          </g>
          <!-- 3. Armed men behind (compact rectangle of silhouettes — many) -->
          <g fill="#0a0d1a" opacity="0.92">
            <rect x="520" y="372" width="80" height="36"/>
            <!-- Spear tips above the block -->
            <g stroke="#0a0d1a" stroke-width="1.5">
              <line x1="528" y1="372" x2="528" y2="354"/>
              <line x1="538" y1="372" x2="538" y2="350"/>
              <line x1="548" y1="372" x2="548" y2="354"/>
              <line x1="558" y1="372" x2="558" y2="348"/>
              <line x1="568" y1="372" x2="568" y2="352"/>
              <line x1="578" y1="372" x2="578" y2="350"/>
              <line x1="588" y1="372" x2="588" y2="354"/>
            </g>
            <g fill="rgba(251,191,36,0.7)">
              <polygon points="525,354 531,354 528,346"/>
              <polygon points="535,350 541,350 538,342"/>
              <polygon points="545,354 551,354 548,346"/>
              <polygon points="555,348 561,348 558,338"/>
              <polygon points="565,352 571,352 568,342"/>
              <polygon points="575,350 581,350 578,340"/>
              <polygon points="585,354 591,354 588,344"/>
            </g>
          </g>
          <!-- "DAY 1" tally in the corner -->
          <text x="80" y="46" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3" fill="rgba(251,191,36,0.7)">DAY 1</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.7)">Silent · one lap · back to camp</text>
        </svg>`
      },
      {
        id: 'seventh-day',
        title: 'The Seventh Day, Seventh Time',
        scriptureRef: 'Joshua 6:15-19',
        bibleText: '"On the seventh day, they got up at daybreak and marched around the city seven times in the same manner."',
        narration: 'For six days they did the same. Walked once. Trumpets blowing the same low ram’s-horn note. Total silence from the people. Walked back to camp. The watchmen of Jericho counted four days, five days, six days. Their walls stood. Their gates stayed locked. Their food was rationing thin. On the seventh day they rose before dawn. This time they did not stop after one lap. They went around twice. Three times. The watchmen leaned over the parapet. Four. Five. Six. The dust hung in the dawn light. Seven. Joshua raised his hand.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jrs', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Dawn light over the city — top-down / map-like view of the circling march -->
          <radialGradient id="jrsDawn" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0%"  stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.15)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="160" rx="360" ry="180" fill="url(#jrsDawn)"/>
          <!-- City of Jericho viewed at slight angle (square walls) -->
          <g transform="translate(400 280)">
            <!-- Outer wall (square seen at slight perspective) -->
            <polygon points="-150,-30 150,-30 130,90 -130,90" fill="#0a0d1a" stroke="rgba(251,191,36,0.7)" stroke-width="2"/>
            <!-- Battlements -->
            <g stroke="rgba(251,191,36,0.55)" stroke-width="0.8" fill="#0a0d1a">
              <rect x="-148" y="-40" width="12" height="10"/>
              <rect x="-128" y="-40" width="12" height="10"/>
              <rect x="-108" y="-40" width="12" height="10"/>
              <rect x="-88"  y="-40" width="12" height="10"/>
              <rect x="-68"  y="-40" width="12" height="10"/>
              <rect x="-48"  y="-40" width="12" height="10"/>
              <rect x="-28"  y="-40" width="12" height="10"/>
              <rect x="-8"   y="-40" width="12" height="10"/>
              <rect x="12"   y="-40" width="12" height="10"/>
              <rect x="32"   y="-40" width="12" height="10"/>
              <rect x="52"   y="-40" width="12" height="10"/>
              <rect x="72"   y="-40" width="12" height="10"/>
              <rect x="92"   y="-40" width="12" height="10"/>
              <rect x="112"  y="-40" width="12" height="10"/>
              <rect x="132"  y="-40" width="12" height="10"/>
            </g>
            <!-- Houses inside -->
            <g fill="#241846" stroke="rgba(251,191,36,0.45)" stroke-width="0.5" opacity="0.85">
              <rect x="-100" y="0" width="22" height="22"/>
              <rect x="-70" y="-4" width="20" height="26"/>
              <rect x="-40" y="0" width="22" height="22"/>
              <rect x="-10" y="-4" width="22" height="26"/>
              <rect x="20" y="0" width="20" height="22"/>
              <rect x="50" y="-4" width="22" height="26"/>
              <rect x="84" y="0" width="20" height="22"/>
            </g>
            <!-- A single house on the wall with a RED CORD (Rahab's house) -->
            <rect x="-130" y="20" width="22" height="30" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <path d="M -119 22 Q -119 50 -119 60" stroke="rgba(180,40,40,0.95)" stroke-width="3" fill="none"/>
          </g>
          <!-- Concentric march tracks around the city (showing 7 laps) -->
          <g fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1" stroke-dasharray="4 4">
            <ellipse cx="400" cy="290" rx="200" ry="120"/>
            <ellipse cx="400" cy="292" rx="210" ry="126"/>
            <ellipse cx="400" cy="294" rx="220" ry="132"/>
            <ellipse cx="400" cy="296" rx="230" ry="138"/>
            <ellipse cx="400" cy="298" rx="240" ry="144"/>
            <ellipse cx="400" cy="300" rx="250" ry="150"/>
            <ellipse cx="400" cy="302" rx="260" ry="156"/>
          </g>
          <!-- Procession on the outer lap (small silhouettes) -->
          <g fill="#0a0d1a">
            <ellipse cx="170" cy="290" rx="4" ry="9"/>
            <ellipse cx="190" cy="280" rx="4" ry="9"/>
            <ellipse cx="220" cy="270" rx="4" ry="9"/>
            <ellipse cx="260" cy="262" rx="4" ry="9"/>
            <ellipse cx="300" cy="258" rx="4" ry="9"/>
            <ellipse cx="340" cy="254" rx="4" ry="9"/>
            <ellipse cx="380" cy="252" rx="4" ry="9"/>
            <ellipse cx="420" cy="252" rx="4" ry="9"/>
            <ellipse cx="460" cy="254" rx="4" ry="9"/>
            <ellipse cx="500" cy="258" rx="4" ry="9"/>
            <ellipse cx="540" cy="262" rx="4" ry="9"/>
            <ellipse cx="580" cy="268" rx="4" ry="9"/>
            <ellipse cx="610" cy="278" rx="4" ry="9"/>
            <ellipse cx="630" cy="290" rx="4" ry="9"/>
          </g>
          <!-- Ark of the covenant near the front of the procession -->
          <g transform="translate(140 300)">
            <rect x="-12" y="-8" width="24" height="14" fill="rgba(251,191,36,0.85)" stroke="#fef3c7" stroke-width="0.8"/>
            <ellipse cx="-5" cy="-12" rx="3" ry="3" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="5"  cy="-12" rx="3" ry="3" fill="rgba(251,191,36,0.95)"/>
          </g>
          <!-- "DAY 7 · LAP 7" tally -->
          <text x="80" y="40" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3" fill="rgba(251,191,36,0.85)">DAY 7</text>
          <text x="80" y="58" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.7)">LAP 7</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">Around · and around · and around · and around · and around · and around · and around</text>
        </svg>`
      },
      {
        id: 'walls-fall',
        title: 'The Shout and the Walls',
        scriptureRef: 'Joshua 6:20-21',
        bibleText: '"When the trumpets sounded, the army shouted, and at the sound of the trumpet, when the men gave a loud shout, the wall collapsed."',
        narration: 'Joshua shouted: "Shout! For the Lord has given you the city!" The priests blew a long blast — the kind of horn-cry that has been waiting in the throat for seven days. And the army of Israel, silent for a week, finally opened their mouths. They roared. The walls of Jericho — the famous unbreachable double walls, built thick enough that houses sat on top of them — shuddered. Then they did something walls do not do. They did not crumble inward as if pushed. They fell outward, away from the city, flattened in every direction so that anyone could walk straight in. Every wall except one. The single section of wall where a scarlet cord hung from a window still stood. Rahab was safe.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="jrwHeaven" cx="0.5" cy="0.2" r="0.7">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.85)"/>
              <stop offset="35%" stop-color="rgba(251,191,36,0.45)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="#0a0d1a"/>
          <ellipse cx="400" cy="120" rx="500" ry="220" fill="url(#jrwHeaven)"/>
          <!-- Dust clouds rising from the collapse -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="200" cy="320" rx="120" ry="50"/>
            <ellipse cx="400" cy="280" rx="180" ry="70"/>
            <ellipse cx="600" cy="320" rx="120" ry="50"/>
          </g>
          <!-- Walls falling OUTWARD (left and right slabs tipped) -->
          <!-- Left slab fallen out -->
          <g transform="translate(200 380) rotate(-72)">
            <rect x="-30" y="-150" width="60" height="150" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <!-- Stone seams -->
            <g stroke="rgba(251,191,36,0.4)" stroke-width="0.6">
              <line x1="-30" y1="-30"  x2="30" y2="-30"/>
              <line x1="-30" y1="-60"  x2="30" y2="-60"/>
              <line x1="-30" y1="-90"  x2="30" y2="-90"/>
              <line x1="-30" y1="-120" x2="30" y2="-120"/>
            </g>
          </g>
          <!-- Right slab fallen out -->
          <g transform="translate(600 380) rotate(72)">
            <rect x="-30" y="-150" width="60" height="150" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <g stroke="rgba(251,191,36,0.4)" stroke-width="0.6">
              <line x1="-30" y1="-30"  x2="30" y2="-30"/>
              <line x1="-30" y1="-60"  x2="30" y2="-60"/>
              <line x1="-30" y1="-90"  x2="30" y2="-90"/>
              <line x1="-30" y1="-120" x2="30" y2="-120"/>
            </g>
          </g>
          <!-- Center: rubble piles -->
          <g fill="#1a1233" stroke="rgba(251,191,36,0.4)" stroke-width="0.6">
            <polygon points="280,370 310,330 340,360 370,338 400,365 430,332 460,358 490,330 520,365"/>
          </g>
          <!-- One section of wall STILL STANDING (in the gap, with red cord hanging) -->
          <g transform="translate(400 320)">
            <rect x="-18" y="-80" width="36" height="80" fill="#0a0d1a" stroke="rgba(251,191,36,0.85)" stroke-width="1.5"/>
            <rect x="-10" y="-58" width="14" height="22" fill="#3d2a16"/>
            <!-- Red cord from window -->
            <path d="M -3 -40 Q -3 -10 -3 30" stroke="rgba(180,40,40,0.95)" stroke-width="3.5" fill="none"/>
            <text x="0" y="-92" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="8" letter-spacing="2" fill="rgba(180,40,40,0.9)">RAHAB</text>
          </g>
          <!-- Trumpet blasts radiating from the army's position (left) — concentric arcs -->
          <g fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="2">
            <path d="M 80 280 Q 200 240 320 260"/>
            <path d="M 80 290 Q 220 250 360 270"/>
            <path d="M 80 300 Q 240 270 400 290"/>
          </g>
          <!-- Tiny army of Israel at far left, mouths open shouting -->
          <g fill="#fef3c7" opacity="0.95">
            <circle cx="64" cy="290" r="3"/>
            <circle cx="60" cy="280" r="2.5"/>
            <circle cx="64" cy="310" r="3"/>
          </g>
          <g fill="#1a1233">
            <ellipse cx="64" cy="320" rx="5" ry="14"/>
            <ellipse cx="64" cy="304" rx="4" ry="5"/>
            <ellipse cx="50" cy="318" rx="5" ry="14"/>
            <ellipse cx="50" cy="302" rx="4" ry="5"/>
            <ellipse cx="78" cy="322" rx="5" ry="14"/>
            <ellipse cx="78" cy="306" rx="4" ry="5"/>
          </g>
          <!-- Ground level rubble strip -->
          <path d="M 0 410 Q 400 400 800 410 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"The wall collapsed · and every man charged straight in"</text>
        </svg>`
      }
    ],
    closing: 'The Lord did not need walls to come down to defeat Jericho. He could have moved them with a thought. He chose, instead, to defeat Jericho through a strange, slow, public obedience by ordinary people — and through the saved life of a Canaanite woman who would later appear in the family tree of Jesus. God’s victories rarely look like our strategies. Sometimes you are asked to walk the same lap, blow the same horn, hold the same line, day after day, when nothing seems to be happening. Then on the seventh day, the seventh time, the wall comes down all at once.',
    closingPrompt: 'What "wall" in your life have you been asked to keep marching around — and is today the seventh day, or only the third?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 13 — Gideon & the 300
  // ════════════════════════════════════════════════════════════
  {
    id: 'gideon-300',
    title: 'Gideon & the 300',
    subtitle: 'A frightened man, a soaked fleece, and an army cut down to nothing.',
    icon: '🔥',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'judges',
    scriptureRef: 'Judges 6-7',
    duration: '~7 min',
    scenes: [
      {
        id: 'winepress',
        title: 'The Mighty Warrior in a Winepress',
        scriptureRef: 'Judges 6:11-16',
        bibleText: '"The Lord is with you, mighty warrior… Go in the strength you have and save Israel out of Midian’s hand. Am I not sending you?"',
        narration: 'Israel was hiding. The Midianites came every harvest like locusts and stripped the land bare. Under an oak in Ophrah, a young man named Gideon was threshing wheat — not on the open hilltop where the wind would do the work, but down in a sunken winepress where no one could see him. The angel of the Lord sat on a rock and watched him. Then he spoke. "The Lord is with you, mighty warrior." Gideon laughed. He was the least man in the weakest clan of the smallest tribe. And the Lord said, "Go in the strength you have. Am I not sending you?"',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gdw', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <g fill="#fef3c7" opacity="0.4">
            <circle cx="120" cy="50" r="0.7"/><circle cx="260" cy="80" r="0.6"/><circle cx="420" cy="50" r="0.8"/>
            <circle cx="560" cy="90" r="0.7"/><circle cx="700" cy="60" r="0.6"/>
          </g>
          <!-- Hills with terebinth oak silhouette behind -->
          <path d="M 0 300 Q 200 270 400 290 Q 600 260 800 300 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 360 Q 400 340 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Oak silhouette (canopy + trunk) -->
          <g transform="translate(620 300)">
            <line x1="0" y1="0" x2="0" y2="-90" stroke="#0a0d1a" stroke-width="6"/>
            <ellipse cx="0" cy="-110" rx="60" ry="38" fill="#1e1638"/>
            <ellipse cx="-25" cy="-130" rx="22" ry="16" fill="#1e1638"/>
            <ellipse cx="22"  cy="-126" rx="22" ry="14" fill="#1e1638"/>
          </g>
          <!-- The winepress: a sunken stone trough cut into rock -->
          <g>
            <ellipse cx="280" cy="395" rx="180" ry="38" fill="#3d2a16" stroke="rgba(251,191,36,0.5)" stroke-width="1.4"/>
            <ellipse cx="280" cy="395" rx="180" ry="38" fill="none" stroke="rgba(254,243,199,0.3)" stroke-width="0.8" stroke-dasharray="3 5"/>
            <ellipse cx="280" cy="385" rx="160" ry="24" fill="#241846"/>
            <!-- Stone rim chunks -->
            <rect x="110" y="382" width="22" height="14" fill="#3d2a16" stroke="rgba(254,243,199,0.4)" stroke-width="0.6"/>
            <rect x="438" y="382" width="20" height="14" fill="#3d2a16" stroke="rgba(254,243,199,0.4)" stroke-width="0.6"/>
          </g>
          <!-- Wheat stalks scattered (suggestion) -->
          <g stroke="rgba(251,191,36,0.6)" stroke-width="0.8" fill="none">
            <line x1="200" y1="380" x2="190" y2="368"/>
            <line x1="220" y1="378" x2="215" y2="364"/>
            <line x1="340" y1="380" x2="346" y2="366"/>
            <line x1="360" y1="378" x2="368" y2="362"/>
            <!-- Wheat heads -->
            <circle cx="190" cy="368" r="1.4" fill="rgba(251,191,36,0.7)"/>
            <circle cx="215" cy="364" r="1.4" fill="rgba(251,191,36,0.7)"/>
            <circle cx="346" cy="366" r="1.4" fill="rgba(251,191,36,0.7)"/>
            <circle cx="368" cy="362" r="1.4" fill="rgba(251,191,36,0.7)"/>
          </g>
          <!-- Gideon inside the winepress, crouched, threshing with a flail -->
          <g transform="translate(280 380)">
            <ellipse cx="0" cy="0" rx="14" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="10" ry="12" fill="#1a1233"/>
            <path d="M -7 -16 Q 0 -4 7 -16" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/>
            <!-- Flail raised over shoulder -->
            <line x1="6" y1="-14" x2="22" y2="-44" stroke="#3d2a16" stroke-width="2.5"/>
            <line x1="22" y1="-44" x2="28" y2="-58" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="28" cy="-60" rx="3" ry="2" fill="#3d2a16"/>
          </g>
          <!-- Angel of the Lord seated on a rock at upper-right, glowing -->
          <g transform="translate(580 360)">
            <ellipse cx="0" cy="0" rx="30" ry="12" fill="#1a1233"/>
            <ellipse cx="0" cy="-18" rx="22" ry="36" fill="rgba(254,243,199,0.9)"/>
            <ellipse cx="0" cy="-58" rx="14" ry="18" fill="rgba(254,243,199,0.95)"/>
            <!-- Staff -->
            <line x1="22" y1="-30" x2="50" y2="-90" stroke="rgba(251,191,36,0.85)" stroke-width="2.5"/>
            <!-- Wing hints -->
            <path d="M -22 -30 Q -64 -10 -42 50" stroke="rgba(251,191,36,0.55)" stroke-width="1.5" fill="rgba(254,243,199,0.18)"/>
            <path d="M 22 -30 Q 64 -10 42 50"   stroke="rgba(251,191,36,0.55)" stroke-width="1.5" fill="rgba(254,243,199,0.18)"/>
            <!-- Halo -->
            <circle cx="0" cy="-58" r="26" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <!-- Light from the angel reaching Gideon -->
          <line x1="560" y1="320" x2="300" y2="378" stroke="rgba(254,243,199,0.25)" stroke-width="4"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"Mighty warrior" · spoken to a man who is hiding</text>
        </svg>`
      },
      {
        id: 'fleece',
        title: 'The Fleece on the Threshing Floor',
        scriptureRef: 'Judges 6:36-40',
        bibleText: '"If you will save Israel by my hand as you have promised — look, I will place a wool fleece on the threshing floor. If there is dew only on the fleece and the ground is dry, then I will know."',
        narration: 'Gideon wanted to be sure. He laid a fleece of wool on the bare threshing floor and asked the Lord to put dew on the fleece only — every blade of grass around it bone-dry by sunrise. In the morning he wrung out a bowl of water. Then he asked the opposite — fleece dry, ground wet. By the second sunrise the grass was soaked and the wool was a desert. Gideon believed. The Lord is patient with the people he has called.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="gdfSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#3d2a5e"/>
              <stop offset="55%" stop-color="#a78bfa"/>
              <stop offset="100%" stop-color="#fbbf24"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#gdfSky)"/>
          <!-- Two suns split: night side (left) + dawn side (right) -->
          <circle cx="160" cy="100" r="28" fill="rgba(254,243,199,0.65)"/>
          <circle cx="160" cy="100" r="20" fill="#fef3c7" opacity="0.35"/>
          <circle cx="660" cy="100" r="32" fill="#fef3c7"/>
          <circle cx="660" cy="100" r="46" fill="rgba(251,191,36,0.45)"/>
          <!-- Vertical divider line, very faint -->
          <line x1="400" y1="0" x2="400" y2="280" stroke="rgba(254,243,199,0.18)" stroke-width="1" stroke-dasharray="3 6"/>
          <!-- Hills (continuous across both halves) -->
          <path d="M 0 280 Q 200 260 400 270 Q 600 250 800 280 L 800 500 L 0 500 Z" fill="#241846" opacity="0.6"/>
          <path d="M 0 340 Q 400 320 800 340 L 800 500 L 0 500 Z" fill="#3d2a16" opacity="0.5"/>
          <!-- Threshing floor (round circle of packed earth) -->
          <ellipse cx="400" cy="400" rx="240" ry="42" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1.4"/>
          <ellipse cx="400" cy="400" rx="240" ry="42" fill="none" stroke="rgba(254,243,199,0.25)" stroke-width="0.8" stroke-dasharray="2 4"/>
          <!-- LEFT HALF — fleece WET, ground DRY -->
          <g transform="translate(280 395)">
            <!-- Wet fleece — bright white with dew drops -->
            <ellipse cx="0" cy="0" rx="50" ry="18" fill="#fef3c7"/>
            <ellipse cx="0" cy="-4" rx="40" ry="14" fill="rgba(255,255,255,0.95)"/>
            <!-- Dew droplets clinging to the fleece -->
            <g fill="rgba(56,189,248,0.85)">
              <circle cx="-32" cy="-2" r="2"/><circle cx="-18" cy="-8" r="1.6"/>
              <circle cx="-4"  cy="-10" r="2.2"/><circle cx="10" cy="-6" r="1.8"/>
              <circle cx="24"  cy="-2" r="2"/><circle cx="36"  cy="2"  r="1.4"/>
            </g>
            <text x="0" y="-30" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(254,243,199,0.7)">NIGHT 1</text>
          </g>
          <!-- Crackled dry ground around the LEFT fleece -->
          <g stroke="rgba(251,113,38,0.45)" stroke-width="0.8" fill="none">
            <path d="M 180 410 L 200 414 L 210 410"/>
            <path d="M 220 412 L 240 416 L 250 412"/>
            <path d="M 340 414 L 360 418 L 370 414"/>
          </g>
          <!-- RIGHT HALF — fleece DRY, ground WET -->
          <g transform="translate(520 395)">
            <!-- Dry fleece — slightly more yellow/cream, no droplets -->
            <ellipse cx="0" cy="0" rx="50" ry="18" fill="rgba(254,243,199,0.85)"/>
            <ellipse cx="0" cy="-4" rx="40" ry="14" fill="rgba(254,243,199,0.95)"/>
            <text x="0" y="-30" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(254,243,199,0.7)">NIGHT 2</text>
          </g>
          <!-- Dew/water glistening on the ground around the RIGHT fleece -->
          <g fill="rgba(56,189,248,0.75)">
            <circle cx="440" cy="410" r="1.8"/><circle cx="460" cy="414" r="2"/>
            <circle cx="480" cy="408" r="1.4"/><circle cx="500" cy="416" r="1.8"/>
            <circle cx="560" cy="412" r="1.8"/><circle cx="580" cy="408" r="2"/>
            <circle cx="600" cy="414" r="1.4"/><circle cx="620" cy="410" r="1.8"/>
            <circle cx="640" cy="416" r="2"/>
          </g>
          <!-- Gideon kneeling beside the wet ground, wringing the fleece -->
          <g transform="translate(720 380)">
            <ellipse cx="0" cy="0" rx="11" ry="20" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="9" ry="11" fill="#1a1233"/>
            <line x1="-7" y1="-12" x2="-20" y2="-2" stroke="#1a1233" stroke-width="3"/>
            <line x1="7"  y1="-12" x2="-6" y2="-4" stroke="#1a1233" stroke-width="3"/>
            <!-- Halo -->
            <circle cx="0" cy="-22" r="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">Two nights · two answers · one settled heart</text>
        </svg>`
      },
      {
        id: 'whittling',
        title: 'Whittling the Army to 300',
        scriptureRef: 'Judges 7:1-8',
        bibleText: '"You have too many men. I cannot deliver Midian into their hands, or Israel would boast against me, ‘My own strength has saved me.’"',
        narration: 'Thirty-two thousand men answered the call. The Lord said: too many. Anyone afraid, go home. Twenty-two thousand left. Ten thousand remained. The Lord said: still too many. Bring them down to the water. Those who knelt and put their face to the stream — set them aside. Those who scooped water to their mouth with one hand, eyes still up, watching — keep those. There were three hundred. The Lord had thinned the army by 99% so that no one could mistake the victory for a victory of numbers.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gdh', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Hillside descending to a spring -->
          <path d="M 0 240 Q 200 240 400 280 Q 600 320 800 320 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 320 Q 200 320 400 340 Q 600 360 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- The spring — a wide silver pool at lower-right -->
          <ellipse cx="560" cy="420" rx="200" ry="34" fill="#1e1846" stroke="rgba(56,189,248,0.55)" stroke-width="1.4"/>
          <ellipse cx="560" cy="420" rx="200" ry="34" fill="none" stroke="rgba(254,243,199,0.35)" stroke-width="0.8" stroke-dasharray="2 4"/>
          <!-- Water shimmer -->
          <g fill="rgba(254,243,199,0.55)">
            <ellipse cx="500" cy="418" rx="20" ry="2"/>
            <ellipse cx="560" cy="424" rx="22" ry="2"/>
            <ellipse cx="620" cy="418" rx="20" ry="2"/>
          </g>
          <!-- LEFT GROUP — many silhouettes (the 22,000 going home) marching off-screen -->
          <text x="120" y="40" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(254,243,199,0.55)">SENT HOME · 22,000</text>
          <g fill="#0a0d1a" opacity="0.85">
            <ellipse cx="40"  cy="200" rx="5" ry="14"/><ellipse cx="40"  cy="186" rx="4" ry="5"/>
            <ellipse cx="60"  cy="204" rx="5" ry="14"/><ellipse cx="60"  cy="190" rx="4" ry="5"/>
            <ellipse cx="80"  cy="200" rx="5" ry="14"/><ellipse cx="80"  cy="186" rx="4" ry="5"/>
            <ellipse cx="100" cy="204" rx="5" ry="14"/><ellipse cx="100" cy="190" rx="4" ry="5"/>
            <ellipse cx="120" cy="200" rx="5" ry="14"/><ellipse cx="120" cy="186" rx="4" ry="5"/>
            <ellipse cx="140" cy="204" rx="5" ry="14"/><ellipse cx="140" cy="190" rx="4" ry="5"/>
            <ellipse cx="40"  cy="240" rx="5" ry="14"/><ellipse cx="40"  cy="226" rx="4" ry="5"/>
            <ellipse cx="60"  cy="244" rx="5" ry="14"/><ellipse cx="60"  cy="230" rx="4" ry="5"/>
            <ellipse cx="80"  cy="240" rx="5" ry="14"/><ellipse cx="80"  cy="226" rx="4" ry="5"/>
            <ellipse cx="100" cy="244" rx="5" ry="14"/><ellipse cx="100" cy="230" rx="4" ry="5"/>
            <ellipse cx="120" cy="240" rx="5" ry="14"/><ellipse cx="120" cy="226" rx="4" ry="5"/>
          </g>
          <!-- Arrow pointing them off-screen left -->
          <line x1="30" y1="270" x2="0" y2="270" stroke="rgba(254,243,199,0.5)" stroke-width="2"/>
          <polygon points="0,270 8,266 8,274" fill="rgba(254,243,199,0.5)"/>
          <!-- MIDDLE GROUP — kneeling, face-down at water (rejected) -->
          <text x="380" y="290" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(254,243,199,0.55)">KNELT TO DRINK · 9,700</text>
          <g fill="#1a1233">
            <!-- Three kneeling figures, face-down -->
            <g transform="translate(320 410)">
              <ellipse cx="0" cy="0" rx="14" ry="6"/>
              <ellipse cx="-12" cy="-2" rx="6" ry="5"/>
              <line x1="2" y1="-2" x2="14" y2="-12" stroke="#1a1233" stroke-width="2"/>
            </g>
            <g transform="translate(380 414)">
              <ellipse cx="0" cy="0" rx="14" ry="6"/>
              <ellipse cx="-12" cy="-2" rx="6" ry="5"/>
              <line x1="2" y1="-2" x2="14" y2="-12" stroke="#1a1233" stroke-width="2"/>
            </g>
            <g transform="translate(440 410)">
              <ellipse cx="0" cy="0" rx="14" ry="6"/>
              <ellipse cx="-12" cy="-2" rx="6" ry="5"/>
              <line x1="2" y1="-2" x2="14" y2="-12" stroke="#1a1233" stroke-width="2"/>
            </g>
          </g>
          <!-- RIGHT GROUP — three figures STANDING, lapping from cupped hand, eyes up -->
          <text x="660" y="290" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.75)">KEPT · 300</text>
          <g fill="#1a1233">
            <g transform="translate(580 390)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <!-- Hand to mouth -->
              <line x1="0" y1="-14" x2="-8" y2="-24" stroke="#1a1233" stroke-width="3"/>
              <!-- Halo -->
              <circle cx="0" cy="-22" r="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
            </g>
            <g transform="translate(660 390)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="0" y1="-14" x2="-8" y2="-24" stroke="#1a1233" stroke-width="3"/>
              <circle cx="0" cy="-22" r="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
            </g>
            <g transform="translate(740 390)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="0" y1="-14" x2="-8" y2="-24" stroke="#1a1233" stroke-width="3"/>
              <circle cx="0" cy="-22" r="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Too many" · trimmed down so the victory cannot be claimed</text>
        </svg>`
      },
      {
        id: 'torches',
        title: 'Trumpets and Torches in the Night',
        scriptureRef: 'Judges 7:16-22',
        bibleText: '"The three companies blew the trumpets and smashed the jars. Grasping the torches in their left hands and holding in their right hands the trumpets they were to blow, they shouted, ‘A sword for the Lord and for Gideon!’"',
        narration: 'Gideon divided the three hundred into three companies. Every man got a trumpet of ram’s horn, a torch, and a clay jar to hide the torch in. They crept around the Midianite camp in the dead of night and waited for the signal. Then — all at once — the jars shattered, the torches blazed, the trumpets screamed, and three hundred voices roared, "A sword for the Lord and for Gideon!" The Midianites turned and killed each other in the dark. Israel did not lift a sword. The mighty warrior had brought down an empire — by hiding torches in clay.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gdt', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <g fill="#fef3c7" opacity="0.55">
            <circle cx="80" cy="50" r="0.8"/><circle cx="200" cy="80" r="0.9"/>
            <circle cx="340" cy="40" r="0.7"/><circle cx="500" cy="70" r="0.8"/>
            <circle cx="640" cy="90" r="0.9"/><circle cx="740" cy="50" r="0.7"/>
          </g>
          <!-- Distant Midianite camp in the valley (center, low) — tents -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.35)" stroke-width="0.8" opacity="0.92">
            <polygon points="320,360 360,310 400,360"/>
            <polygon points="380,360 420,310 460,360"/>
            <polygon points="440,360 480,310 520,360"/>
            <polygon points="300,400 340,360 380,400"/>
            <polygon points="380,400 420,360 460,400"/>
            <polygon points="460,400 500,360 540,400"/>
            <!-- Camp fire dying in center -->
            <ellipse cx="420" cy="395" rx="10" ry="3" fill="#3d2a16"/>
            <ellipse cx="420" cy="392" rx="4" ry="3" fill="#fb923c" opacity="0.6"/>
          </g>
          <!-- Ground -->
          <path d="M 0 400 Q 400 392 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Ring of torches around the camp — three companies (left, right, top) -->
          <!-- LEFT company -->
          <g>
            <g transform="translate(140 370)">
              <line x1="0" y1="0" x2="0" y2="-30" stroke="#3d2a16" stroke-width="2"/>
              <ellipse cx="0" cy="-36" rx="7" ry="11" fill="#fb923c"/>
              <ellipse cx="0" cy="-36" rx="4" ry="7" fill="#fbbf24"/>
              <!-- Soldier silhouette -->
              <ellipse cx="0" cy="6" rx="7" ry="20" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-12" rx="6" ry="7" fill="#0a0d1a"/>
              <!-- Trumpet in the other hand -->
              <path d="M -6 -10 Q -22 -20 -30 -8" stroke="rgba(251,191,36,0.85)" stroke-width="2" fill="none"/>
              <circle cx="-30" cy="-8" r="3" fill="rgba(251,191,36,0.95)"/>
            </g>
            <g transform="translate(200 380)">
              <line x1="0" y1="0" x2="0" y2="-28" stroke="#3d2a16" stroke-width="2"/>
              <ellipse cx="0" cy="-34" rx="7" ry="11" fill="#fb923c"/>
              <ellipse cx="0" cy="-34" rx="4" ry="7" fill="#fbbf24"/>
              <ellipse cx="0" cy="4" rx="7" ry="18" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-12" rx="6" ry="7" fill="#0a0d1a"/>
            </g>
            <g transform="translate(260 388)">
              <line x1="0" y1="0" x2="0" y2="-26" stroke="#3d2a16" stroke-width="2"/>
              <ellipse cx="0" cy="-32" rx="6" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-32" rx="3" ry="6" fill="#fbbf24"/>
              <ellipse cx="0" cy="2" rx="6" ry="16" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-12" rx="5" ry="6" fill="#0a0d1a"/>
            </g>
          </g>
          <!-- RIGHT company -->
          <g>
            <g transform="translate(540 388)">
              <line x1="0" y1="0" x2="0" y2="-26" stroke="#3d2a16" stroke-width="2"/>
              <ellipse cx="0" cy="-32" rx="6" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-32" rx="3" ry="6" fill="#fbbf24"/>
              <ellipse cx="0" cy="2" rx="6" ry="16" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-12" rx="5" ry="6" fill="#0a0d1a"/>
            </g>
            <g transform="translate(600 380)">
              <line x1="0" y1="0" x2="0" y2="-28" stroke="#3d2a16" stroke-width="2"/>
              <ellipse cx="0" cy="-34" rx="7" ry="11" fill="#fb923c"/>
              <ellipse cx="0" cy="-34" rx="4" ry="7" fill="#fbbf24"/>
              <ellipse cx="0" cy="4" rx="7" ry="18" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-12" rx="6" ry="7" fill="#0a0d1a"/>
            </g>
            <g transform="translate(660 370)">
              <line x1="0" y1="0" x2="0" y2="-30" stroke="#3d2a16" stroke-width="2"/>
              <ellipse cx="0" cy="-36" rx="7" ry="11" fill="#fb923c"/>
              <ellipse cx="0" cy="-36" rx="4" ry="7" fill="#fbbf24"/>
              <ellipse cx="0" cy="6" rx="7" ry="20" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-12" rx="6" ry="7" fill="#0a0d1a"/>
              <!-- Trumpet -->
              <path d="M 6 -10 Q 22 -20 30 -8" stroke="rgba(251,191,36,0.85)" stroke-width="2" fill="none"/>
              <circle cx="30" cy="-8" r="3" fill="rgba(251,191,36,0.95)"/>
            </g>
          </g>
          <!-- TOP rear company (further back, behind tents — three small torches) -->
          <g>
            <g transform="translate(360 295)">
              <line x1="0" y1="0" x2="0" y2="-22" stroke="#3d2a16" stroke-width="1.5"/>
              <ellipse cx="0" cy="-26" rx="5" ry="8" fill="#fb923c"/>
              <ellipse cx="0" cy="-26" rx="3" ry="5" fill="#fbbf24"/>
            </g>
            <g transform="translate(420 290)">
              <line x1="0" y1="0" x2="0" y2="-24" stroke="#3d2a16" stroke-width="1.5"/>
              <ellipse cx="0" cy="-28" rx="6" ry="9" fill="#fb923c"/>
              <ellipse cx="0" cy="-28" rx="3" ry="5" fill="#fbbf24"/>
            </g>
            <g transform="translate(480 295)">
              <line x1="0" y1="0" x2="0" y2="-22" stroke="#3d2a16" stroke-width="1.5"/>
              <ellipse cx="0" cy="-26" rx="5" ry="8" fill="#fb923c"/>
              <ellipse cx="0" cy="-26" rx="3" ry="5" fill="#fbbf24"/>
            </g>
          </g>
          <!-- Shattered clay jar pieces in foreground (left + right) -->
          <g fill="#3d2a16" stroke="rgba(251,191,36,0.5)" stroke-width="0.6">
            <polygon points="120,420 130,410 140,418 132,424"/>
            <polygon points="100,432 112,422 120,430 110,438"/>
            <polygon points="680,420 690,410 700,418 692,424"/>
            <polygon points="700,432 712,422 720,430 710,438"/>
          </g>
          <!-- Glow rising from the torches converging on the camp -->
          <radialGradient id="gdtGlow" cx="0.5" cy="0.6" r="0.45">
            <stop offset="0%"  stop-color="rgba(251,113,38,0.55)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.18)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="420" cy="380" rx="380" ry="120" fill="url(#gdtGlow)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"A sword for the Lord — and for Gideon!"</text>
        </svg>`
      }
    ],
    closing: 'Three hundred trumpets, three hundred torches in clay jars, and a man who had been hiding from his own harvest a few months earlier. The Lord did not enlarge Gideon’s army — he shrank it. He did not strengthen Gideon — he stripped Gideon of every excuse not to fight, and then handed him the win. There is no scenario in your life where God is intimidated by your weakness. The opposite: He prefers your weakness, because it is the cleanest stage He has to work on.',
    closingPrompt: 'Where in your life are you waiting to feel "strong enough" before you start — and what would it look like to go with the strength you actually have today?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 14 — Samson & Delilah
  // ════════════════════════════════════════════════════════════
  {
    id: 'samson-delilah',
    title: 'Samson & Delilah',
    subtitle: 'The strongest man in Israel — broken by a lap and a pair of scissors.',
    icon: '✂️',
    color: '#a78bfa',
    accentColor: '#fef3c7',
    era: 'judges',
    scriptureRef: 'Judges 13-16',
    duration: '~8 min',
    scenes: [
      {
        id: 'nazirite-promise',
        title: 'A Promise Before Birth',
        scriptureRef: 'Judges 13:2-7',
        bibleText: '"You will become pregnant and have a son whose head is never to be touched by a razor… he will take the lead in delivering Israel from the hands of the Philistines."',
        narration: 'Israel was crushed under forty years of Philistine rule. In a quiet village called Zorah, a barren woman was visited by the angel of the Lord. "You will conceive and bear a son. No razor must ever touch his head. He will be a Nazirite — set apart to God from the womb — and he will begin to deliver Israel." She told her husband Manoah. They both saw the angel. They watched him rise in the flame of their evening sacrifice and disappear into heaven. Then the long wait began.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'snp', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <g fill="#fef3c7" opacity="0.55">
            <circle cx="100" cy="50" r="0.8"/><circle cx="240" cy="80" r="0.9"/>
            <circle cx="380" cy="40" r="0.7"/><circle cx="540" cy="60" r="0.9"/>
            <circle cx="700" cy="80" r="0.8"/>
          </g>
          <!-- Hills -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Altar with offering, flame rising -->
          <g transform="translate(400 390)">
            <rect x="-30" y="-22" width="60" height="22" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <!-- Stone seams -->
            <line x1="-30" y1="-12" x2="30" y2="-12" stroke="rgba(254,243,199,0.4)" stroke-width="0.5"/>
            <line x1="-10" y1="-22" x2="-10" y2="0"  stroke="rgba(254,243,199,0.4)" stroke-width="0.5"/>
            <line x1="10"  y1="-22" x2="10"  y2="0" stroke="rgba(254,243,199,0.4)" stroke-width="0.5"/>
            <!-- Flame -->
            <ellipse cx="0" cy="-44" rx="14" ry="26" fill="#fb923c"/>
            <ellipse cx="0" cy="-50" rx="9" ry="18" fill="#fbbf24"/>
            <ellipse cx="0" cy="-58" rx="5" ry="10" fill="#fef3c7"/>
          </g>
          <!-- Angel rising IN the flame (tall radiant figure with outstretched arms) -->
          <g transform="translate(400 290)">
            <ellipse cx="0" cy="0" rx="22" ry="60" fill="rgba(254,243,199,0.8)"/>
            <ellipse cx="0" cy="-66" rx="14" ry="18" fill="rgba(254,243,199,0.95)"/>
            <line x1="-18" y1="-30" x2="-44" y2="-50" stroke="rgba(254,243,199,0.85)" stroke-width="4"/>
            <line x1="18"  y1="-30" x2="44" y2="-50" stroke="rgba(254,243,199,0.85)" stroke-width="4"/>
            <!-- Wings -->
            <path d="M -22 -20 Q -76 -10 -52 60" stroke="rgba(251,191,36,0.55)" stroke-width="1.5" fill="rgba(254,243,199,0.18)"/>
            <path d="M 22 -20 Q 76 -10 52 60"   stroke="rgba(251,191,36,0.55)" stroke-width="1.5" fill="rgba(254,243,199,0.18)"/>
            <!-- Halo big -->
            <circle cx="0" cy="-66" r="30" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <!-- Manoah and his wife kneeling, face-down on the ground in awe -->
          <g transform="translate(280 415)">
            <!-- Manoah -->
            <ellipse cx="0" cy="0" rx="22" ry="7" fill="#1a1233"/>
            <ellipse cx="-18" cy="-2" rx="7" ry="5" fill="#1a1233"/>
          </g>
          <g transform="translate(520 415)">
            <!-- Wife -->
            <ellipse cx="0" cy="0" rx="22" ry="7" fill="#1a1233"/>
            <ellipse cx="18" cy="-2" rx="7" ry="5" fill="#1a1233"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"He will be a Nazirite to God from the womb"</text>
        </svg>`
      },
      {
        id: 'lion',
        title: 'The Lion in the Vineyard',
        scriptureRef: 'Judges 14:5-6',
        bibleText: '"The Spirit of the Lord came powerfully upon him so that he tore the lion apart with his bare hands as he might have torn a young goat. But he told neither his father nor his mother what he had done."',
        narration: 'Samson grew into a giant of a man. The Lord stirred him. On the way down to Timnah he turned a corner and a young lion roared up out of the vineyard. The Spirit of the Lord rushed on him — and he tore the lion apart with his hands as easily as a goat. Then he kept walking. Days later, on his way back, he saw a swarm of bees had made honey in the carcass of the lion. He scooped it out, ate it, brought some home, did not say where it came from. Every strange gift God gave him, he kept secret. Even from his parents. Even from himself.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'snl', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Vineyard rows on a hillside -->
          <path d="M 0 280 Q 200 250 400 270 Q 600 250 800 280 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 360 Q 400 350 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Grapevine arches (suggestion) -->
          <g stroke="#0a0d1a" stroke-width="2" fill="none">
            <path d="M 80 320 L 120 290 L 160 320 L 200 290 L 240 320"/>
            <path d="M 560 320 L 600 290 L 640 320 L 680 290 L 720 320"/>
          </g>
          <g fill="#0a0d1a">
            <circle cx="120" cy="295" r="3"/><circle cx="160" cy="295" r="3"/>
            <circle cx="200" cy="295" r="3"/><circle cx="600" cy="295" r="3"/>
            <circle cx="640" cy="295" r="3"/><circle cx="680" cy="295" r="3"/>
          </g>
          <!-- Samson, broad-shouldered, gripping a lion's jaws — center -->
          <g transform="translate(400 380)">
            <!-- Lion body, twisted, claws splayed -->
            <g fill="#1a1233">
              <ellipse cx="50" cy="0" rx="60" ry="24"/>
              <circle cx="100" cy="-6" r="22"/>
              <circle cx="100" cy="-6" r="30" fill="none" stroke="#0a0d1a" stroke-width="4"/>
              <!-- Claws/paws -->
              <line x1="20" y1="18" x2="20" y2="38" stroke="#1a1233" stroke-width="5"/>
              <line x1="60" y1="22" x2="60" y2="38" stroke="#1a1233" stroke-width="5"/>
              <line x1="0"  y1="14" x2="-8" y2="30" stroke="#1a1233" stroke-width="5"/>
              <!-- Tail -->
              <path d="M -8 -6 Q -30 -16 -38 6" stroke="#1a1233" stroke-width="3" fill="none"/>
            </g>
            <!-- Samson — large silhouette wrestling, grip on lion's jaws -->
            <ellipse cx="-30" cy="-10" rx="16" ry="36" fill="#0a0d1a"/>
            <ellipse cx="-30" cy="-48" rx="13" ry="15" fill="#0a0d1a"/>
            <!-- Long Nazirite hair (7 braids hint) -->
            <path d="M -38 -42 Q -50 -28 -42 -10 M -22 -42 Q -10 -28 -18 -10" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <path d="M -34 -56 Q -44 -50 -40 -34" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <path d="M -26 -56 Q -16 -50 -20 -34" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <!-- Beard -->
            <path d="M -36 -40 Q -30 -22 -24 -40" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Arms reaching INTO the lion's jaws -->
            <line x1="-16" y1="-26" x2="74" y2="-14" stroke="#0a0d1a" stroke-width="9"/>
            <line x1="-16" y1="-14" x2="78" y2="-4"  stroke="#0a0d1a" stroke-width="9"/>
            <!-- Halo -->
            <circle cx="-30" cy="-48" r="22" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.5"/>
          </g>
          <!-- Spirit-of-the-Lord radiance from above onto Samson -->
          <defs>
            <linearGradient id="snlBeam" x1="0.4" y1="0" x2="0.4" y2="1">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.45)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="340,0 320,420 420,420" fill="url(#snlBeam)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"As easily as a young goat" · with his bare hands</text>
        </svg>`
      },
      {
        id: 'delilah',
        title: "Delilah's Lap",
        scriptureRef: 'Judges 16:18-19',
        bibleText: '"Having put him to sleep on her lap, she called for someone to shave off the seven braids of his hair, and so began to subdue him. And his strength left him."',
        narration: 'The Philistines could not beat him in battle, so they paid a woman to do it instead. Delilah asked Samson three times where his strength came from. Three times he lied. Three times she set the trap and three times he laughed and broke free. The fourth time she nagged him until he was sick to death of it, and he told her the truth: a razor has never touched my head — if my hair is cut, I will be like any other man. She put him to sleep on her lap. A man came in with a razor. The seven braids fell to the floor. He woke up and tried to break free as he always had — and did not know that the Lord had left him.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'snd', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Interior — pillars and a curtained alcove -->
          <g fill="#0a0d1a" opacity="0.95" stroke="rgba(251,191,36,0.4)" stroke-width="1">
            <rect x="60" y="60" width="22" height="380"/>
            <rect x="718" y="60" width="22" height="380"/>
          </g>
          <!-- Floor -->
          <rect x="0" y="440" width="800" height="60" fill="#1a1233"/>
          <!-- Oil lamp on a low stand (warm pool of light) -->
          <g transform="translate(180 360)">
            <rect x="-3" y="0" width="6" height="40" fill="#3d2a16"/>
            <rect x="-12" y="40" width="24" height="6" fill="#3d2a16"/>
            <ellipse cx="0" cy="-3" rx="14" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.8)" stroke-width="1"/>
            <ellipse cx="0" cy="-10" rx="6" ry="9" fill="#fb923c"/>
            <ellipse cx="0" cy="-12" rx="3" ry="6" fill="#fbbf24"/>
          </g>
          <!-- Pool of lamp light -->
          <radialGradient id="sndLamp" cx="0.5" cy="0.6" r="0.5">
            <stop offset="0%"  stop-color="rgba(251,113,38,0.45)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.15)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="380" rx="360" ry="140" fill="url(#sndLamp)"/>
          <!-- A low couch / cushioned platform -->
          <g>
            <rect x="240" y="380" width="320" height="44" fill="#3d2a5e" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <rect x="240" y="370" width="320" height="14" fill="#5a4378"/>
          </g>
          <!-- Delilah seated, Samson's head in her lap -->
          <g transform="translate(500 380)">
            <!-- Delilah body, seated -->
            <path d="M -28 0 Q -22 -60 0 -70 Q 22 -60 28 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <ellipse cx="0" cy="-80" rx="13" ry="16" fill="#1a1233"/>
            <!-- Long dark hair -->
            <path d="M -12 -72 Q -16 -40 -14 -8 M 12 -72 Q 16 -40 14 -8" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <!-- Ornament headband -->
            <line x1="-10" y1="-92" x2="10" y2="-92" stroke="rgba(251,191,36,0.85)" stroke-width="2"/>
          </g>
          <!-- Samson asleep, head on Delilah's lap (foreground) -->
          <g transform="translate(400 380)">
            <!-- Body lying flat -->
            <ellipse cx="0" cy="0" rx="80" ry="14" fill="#0a0d1a"/>
            <!-- Head on lap (right side) -->
            <ellipse cx="80" cy="-8" rx="16" ry="18" fill="#0a0d1a"/>
            <!-- Beard -->
            <path d="M 72 -6 Q 80 8 88 -6" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Closed eye -->
            <line x1="84" y1="-12" x2="90" y2="-12" stroke="rgba(254,243,199,0.55)" stroke-width="0.8"/>
            <!-- The seven braids — three CUT (lying on floor), four still attached but loose -->
            <path d="M 70 -22 Q 60 -14 56 -2"  stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <path d="M 78 -24 Q 72 -16 68 -4"  stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <path d="M 86 -24 Q 92 -14 90 -2"  stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <path d="M 94 -22 Q 100 -12 102 0" stroke="#0a0d1a" stroke-width="3" fill="none"/>
          </g>
          <!-- Three cut braids on the floor -->
          <g stroke="#0a0d1a" stroke-width="4" fill="none">
            <path d="M 360 432 Q 380 434 400 430"/>
            <path d="M 350 442 Q 370 444 392 440"/>
            <path d="M 365 450 Q 388 452 410 448"/>
          </g>
          <!-- A man with scissors crouching at the edge of the couch (in shadow) -->
          <g transform="translate(300 410)">
            <ellipse cx="0" cy="0" rx="8" ry="20" fill="rgba(10,13,26,0.9)"/>
            <ellipse cx="0" cy="-22" rx="7" ry="9" fill="rgba(10,13,26,0.9)"/>
            <!-- Scissors raised -->
            <line x1="6" y1="-12" x2="22" y2="-30" stroke="rgba(251,191,36,0.6)" stroke-width="2"/>
            <polygon points="22,-30 18,-36 24,-34" fill="rgba(254,243,199,0.85)"/>
            <polygon points="22,-30 26,-36 20,-34" fill="rgba(254,243,199,0.85)"/>
            <circle cx="20" cy="-22" r="3" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1"/>
            <circle cx="24" cy="-22" r="3" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"He did not know that the Lord had left him"</text>
        </svg>`
      },
      {
        id: 'mill',
        title: 'Grinding at the Mill',
        scriptureRef: 'Judges 16:21',
        bibleText: '"Then the Philistines seized him, gouged out his eyes and took him down to Gaza. Binding him with bronze shackles, they set him to grinding grain in the prison."',
        narration: 'They put out his eyes. They dragged him to Gaza in chains. They set him to a slave’s task — the millstone, the kind of stone normally turned by oxen. Day after day, in the dark prison, the man who had killed a thousand Philistines with a donkey’s jawbone walked in slow blind circles, grinding their grain. The Scripture says one quiet thing in the middle of it: "his hair began to grow back."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="snmDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#000a14"/>
              <stop offset="60%" stop-color="#0a0d1a"/>
              <stop offset="100%" stop-color="#1a1233"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#snmDark)"/>
          <!-- Stone walls of a prison cell — heavy blocks -->
          <g fill="#1a1233" stroke="rgba(251,191,36,0.25)" stroke-width="0.6">
            <rect x="0" y="60" width="60" height="380"/>
            <rect x="740" y="60" width="60" height="380"/>
            <g>
              <line x1="0" y1="120" x2="60" y2="120"/>
              <line x1="0" y1="180" x2="60" y2="180"/>
              <line x1="0" y1="240" x2="60" y2="240"/>
              <line x1="0" y1="300" x2="60" y2="300"/>
              <line x1="0" y1="360" x2="60" y2="360"/>
              <line x1="740" y1="120" x2="800" y2="120"/>
              <line x1="740" y1="180" x2="800" y2="180"/>
              <line x1="740" y1="240" x2="800" y2="240"/>
              <line x1="740" y1="300" x2="800" y2="300"/>
              <line x1="740" y1="360" x2="800" y2="360"/>
            </g>
          </g>
          <!-- High slit window on left wall, faint shaft of light -->
          <rect x="20" y="100" width="20" height="40" fill="rgba(254,243,199,0.4)"/>
          <polygon points="20,100 40,140 100,260 80,140" fill="rgba(254,243,199,0.08)"/>
          <!-- Floor -->
          <rect x="0" y="440" width="800" height="60" fill="#0a0d1a"/>
          <!-- The millstone — a heavy round stone with a wooden axle and bar -->
          <g transform="translate(400 400)">
            <!-- Lower stone (base) -->
            <ellipse cx="0" cy="0" rx="180" ry="36" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-6" rx="180" ry="36" fill="#241846"/>
            <!-- Upper stone (rotating) -->
            <ellipse cx="0" cy="-20" rx="120" ry="20" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-26" rx="120" ry="20" fill="#1a1233"/>
            <!-- Center hole -->
            <ellipse cx="0" cy="-28" rx="14" ry="5" fill="#0a0d1a"/>
            <!-- Push-bar extending from center -->
            <rect x="0" y="-30" width="220" height="6" fill="#3d2a16"/>
            <!-- Grain spilling from the hole -->
            <g fill="rgba(251,191,36,0.7)">
              <circle cx="-2" cy="-22" r="1.4"/><circle cx="3"  cy="-20" r="1.2"/>
              <circle cx="-6" cy="-18" r="1.2"/><circle cx="5"  cy="-16" r="1.4"/>
            </g>
          </g>
          <!-- Samson pushing the bar, head bowed, blindfolded (rags) -->
          <g transform="translate(620 370)">
            <ellipse cx="0" cy="0" rx="16" ry="40" fill="#1a1233"/>
            <ellipse cx="0" cy="-40" rx="13" ry="15" fill="#1a1233"/>
            <!-- Bandages over eyes -->
            <rect x="-13" y="-44" width="26" height="6" fill="rgba(254,243,199,0.45)"/>
            <!-- Beard -->
            <path d="M -7 -34 Q 0 -22 7 -34" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Hair just starting to grow back — short stubble on head (a few small lines) -->
            <line x1="-7"  y1="-54" x2="-7"  y2="-58" stroke="rgba(254,243,199,0.4)" stroke-width="1.4"/>
            <line x1="-3"  y1="-55" x2="-3"  y2="-59" stroke="rgba(254,243,199,0.4)" stroke-width="1.4"/>
            <line x1="1"   y1="-55" x2="1"   y2="-59" stroke="rgba(254,243,199,0.4)" stroke-width="1.4"/>
            <line x1="5"   y1="-55" x2="5"   y2="-58" stroke="rgba(254,243,199,0.4)" stroke-width="1.4"/>
            <!-- Both arms pushing the bar -->
            <line x1="-14" y1="-20" x2="-44" y2="-30" stroke="#1a1233" stroke-width="6"/>
            <line x1="-14" y1="-12" x2="-44" y2="-24" stroke="#1a1233" stroke-width="6"/>
            <!-- Bronze shackles -->
            <rect x="-48" y="-32" width="10" height="4" fill="rgba(251,113,38,0.7)" stroke="rgba(251,191,36,0.7)" stroke-width="0.5"/>
            <rect x="-48" y="-26" width="10" height="4" fill="rgba(251,113,38,0.7)" stroke="rgba(251,191,36,0.7)" stroke-width="0.5"/>
            <!-- Halo extinguished — a broken/dim ring -->
            <path d="M -20 -52 A 20 20 0 0 1 12 -54" stroke="rgba(251,191,36,0.18)" stroke-width="1.4" fill="none" stroke-dasharray="3 4"/>
          </g>
          <!-- Path worn in the dust around the millstone — concentric arcs -->
          <g fill="none" stroke="rgba(254,243,199,0.18)" stroke-width="1" stroke-dasharray="2 5">
            <ellipse cx="400" cy="425" rx="220" ry="34"/>
            <ellipse cx="400" cy="430" rx="240" ry="36"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"His hair began to grow back"</text>
        </svg>`
      },
      {
        id: 'temple',
        title: 'Between the Pillars',
        scriptureRef: 'Judges 16:28-30',
        bibleText: '"Sovereign Lord, remember me. Please, God, strengthen me just once more, and let me with one blow get revenge on the Philistines for my two eyes."',
        narration: 'They brought him out at the great feast of Dagon. Three thousand Philistines on the roof, lords feasting, mocking the blind giant chained between two pillars. Samson asked the boy who led him by the hand to set him against the central pillars. He prayed one last prayer — only one. "Sovereign Lord, remember me. Strengthen me just once more." He put one hand on the right pillar and one hand on the left. He pushed. The roof came down. He killed more in his dying than he ever killed in his living.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'snt', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Temple of Dagon — falling. Two massive pillars tilted outward, roof breaking apart. -->
          <!-- LEFT pillar tilting outward -->
          <g transform="translate(280 320) rotate(-12)">
            <rect x="-20" y="-200" width="40" height="220" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <rect x="-26" y="-208" width="52" height="14" fill="#241846"/>
            <!-- Carved seams -->
            <g stroke="rgba(254,243,199,0.45)" stroke-width="0.6">
              <line x1="-20" y1="-150" x2="20" y2="-150"/>
              <line x1="-20" y1="-100" x2="20" y2="-100"/>
              <line x1="-20" y1="-50"  x2="20" y2="-50"/>
              <line x1="-20" y1="0"    x2="20" y2="0"/>
            </g>
          </g>
          <!-- RIGHT pillar tilting outward -->
          <g transform="translate(520 320) rotate(12)">
            <rect x="-20" y="-200" width="40" height="220" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <rect x="-26" y="-208" width="52" height="14" fill="#241846"/>
            <g stroke="rgba(254,243,199,0.45)" stroke-width="0.6">
              <line x1="-20" y1="-150" x2="20" y2="-150"/>
              <line x1="-20" y1="-100" x2="20" y2="-100"/>
              <line x1="-20" y1="-50"  x2="20" y2="-50"/>
              <line x1="-20" y1="0"    x2="20" y2="0"/>
            </g>
          </g>
          <!-- Roof — broken, in pieces falling -->
          <g fill="#241846" stroke="rgba(251,191,36,0.5)" stroke-width="1">
            <polygon points="180,100 320,80 320,130 180,150"/>
            <polygon points="380,90 480,90 470,130 390,135"/>
            <polygon points="510,85 660,100 670,150 520,140"/>
          </g>
          <!-- Dust cloud rising -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="240" cy="170" rx="80" ry="40"/>
            <ellipse cx="420" cy="160" rx="100" ry="44"/>
            <ellipse cx="600" cy="170" rx="80" ry="40"/>
          </g>
          <!-- Falling Philistines from the rooftop (silhouettes mid-fall) -->
          <g fill="#0a0d1a" opacity="0.95">
            <g transform="translate(220 220) rotate(40)">
              <ellipse cx="0" cy="0" rx="6" ry="14"/>
              <ellipse cx="0" cy="-14" rx="5" ry="6"/>
            </g>
            <g transform="translate(360 200) rotate(20)">
              <ellipse cx="0" cy="0" rx="6" ry="14"/>
              <ellipse cx="0" cy="-14" rx="5" ry="6"/>
            </g>
            <g transform="translate(540 210) rotate(-30)">
              <ellipse cx="0" cy="0" rx="6" ry="14"/>
              <ellipse cx="0" cy="-14" rx="5" ry="6"/>
            </g>
            <g transform="translate(640 230) rotate(-15)">
              <ellipse cx="0" cy="0" rx="6" ry="14"/>
              <ellipse cx="0" cy="-14" rx="5" ry="6"/>
            </g>
          </g>
          <!-- Samson at center, head thrown back, arms wide on the two pillars -->
          <g transform="translate(400 360)">
            <ellipse cx="0" cy="0" rx="18" ry="50" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-52" rx="14" ry="16" fill="#0a0d1a"/>
            <!-- Beard -->
            <path d="M -8 -44 Q 0 -28 8 -44" stroke="rgba(254,243,199,0.55)" stroke-width="1.5" fill="none"/>
            <!-- Eye bandages -->
            <rect x="-14" y="-56" width="28" height="6" fill="rgba(254,243,199,0.5)"/>
            <!-- Restored hair (longer, flowing) -->
            <path d="M -14 -60 Q -34 -50 -38 -20" stroke="#0a0d1a" stroke-width="4" fill="none"/>
            <path d="M 14 -60 Q 34 -50 38 -20" stroke="#0a0d1a" stroke-width="4" fill="none"/>
            <path d="M -8 -68 Q -22 -78 -32 -64" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <path d="M 8 -68 Q 22 -78 32 -64" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <!-- Arms outstretched to both pillars -->
            <line x1="-18" y1="-30" x2="-110" y2="-50" stroke="#0a0d1a" stroke-width="14"/>
            <line x1="18"  y1="-30" x2="110" y2="-50" stroke="#0a0d1a" stroke-width="14"/>
            <!-- Halo bright -->
            <circle cx="0" cy="-52" r="28" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.6"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Strengthen me just once more"</text>
        </svg>`
      }
    ],
    closing: 'Samson is the most tragic and the most graceful story in Judges at the same time. He squandered every gift God gave him — and God gave him one last gift anyway, in the dark, at the end, when he finally remembered to ask. The Lord did not write Samson off when Samson cut himself off. Wherever you are in your own story — however much you have wasted, however far you feel from the man or woman God shaped you to be — He will still answer the prayer that asks for strength one more time.',
    closingPrompt: 'What gift in your life have you been wasting in secret — and what would it look like to ask the Lord to "strengthen me just once more" with it today?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 15 — Ruth & Naomi
  // ════════════════════════════════════════════════════════════
  {
    id: 'ruth-naomi',
    title: 'Ruth & Naomi',
    subtitle: 'A foreign widow, a bitter mother-in-law, a redeemer.',
    icon: '🌾',
    color: '#22c55e',
    accentColor: '#fef3c7',
    era: 'judges',
    scriptureRef: 'Ruth 1-4',
    duration: '~7 min',
    scenes: [
      {
        id: 'crossroads',
        title: 'Where You Go, I Will Go',
        scriptureRef: 'Ruth 1:14-17',
        bibleText: '"Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God."',
        narration: 'Naomi had buried her husband and both her sons in the fields of Moab. She had nothing left to give her two Moabite daughters-in-law except permission to leave. On the road back to Bethlehem she stopped them, kissed them, and told them to go home and find new husbands. Orpah wept and turned back. Ruth would not. "Don’t urge me to leave you. Where you go, I will go. Where you stay, I will stay. Your people will be my people and your God my God." A foreign young widow chose the bitter old woman’s God. The whole story of redemption pivots on that sentence.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'rnc', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Sun low on horizon -->
          <circle cx="200" cy="180" r="32" fill="#fef3c7"/>
          <circle cx="200" cy="180" r="48" fill="rgba(251,191,36,0.45)"/>
          <!-- Hills + dust road at the parting -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#241846" opacity="0.85"/>
          <path d="M 0 380 Q 400 360 800 380 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Dusty road forking — Y-shape -->
          <path d="M 400 440 Q 380 400 200 380 Q 100 372 0 380"
                stroke="rgba(254,243,199,0.5)" stroke-width="6" fill="none"/>
          <path d="M 400 440 Q 420 400 600 380 Q 700 372 800 380"
                stroke="rgba(254,243,199,0.6)" stroke-width="6" fill="none"/>
          <!-- Footprints heading right (toward Bethlehem) -->
          <g fill="rgba(254,243,199,0.45)">
            <ellipse cx="500" cy="430" rx="6" ry="3" transform="rotate(10 500 430)"/>
            <ellipse cx="540" cy="420" rx="6" ry="3" transform="rotate(10 540 420)"/>
            <ellipse cx="580" cy="412" rx="6" ry="3" transform="rotate(10 580 412)"/>
            <ellipse cx="620" cy="406" rx="6" ry="3" transform="rotate(10 620 406)"/>
          </g>
          <!-- ORPAH walking away to the LEFT, head down -->
          <g transform="translate(160 420)">
            <path d="M -20 0 Q -16 -50 0 -60 Q 16 -50 20 0 Z" fill="#3d2a16" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <!-- Headdress -->
            <path d="M -10 -78 Q 0 -90 10 -78" stroke="rgba(254,243,199,0.5)" stroke-width="2" fill="none"/>
            <!-- Tear on cheek -->
            <line x1="-5" y1="-70" x2="-5" y2="-64" stroke="rgba(56,189,248,0.7)" stroke-width="1"/>
          </g>
          <text x="160" y="470" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(254,243,199,0.55)">ORPAH · MOAB</text>
          <!-- NAOMI in the center, half-turned, hands on Ruth's face -->
          <g transform="translate(400 410)">
            <path d="M -22 0 Q -18 -54 0 -64 Q 18 -54 22 0 Z" fill="#1a1233" stroke="rgba(254,243,199,0.5)" stroke-width="1"/>
            <ellipse cx="0" cy="-74" rx="13" ry="15" fill="#1a1233"/>
            <!-- Grey hair hint -->
            <path d="M -10 -80 Q 0 -90 10 -80" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="none"/>
            <!-- Hands cupping Ruth's face (right side) -->
            <line x1="18" y1="-50" x2="38" y2="-60" stroke="#1a1233" stroke-width="4"/>
            <line x1="18" y1="-44" x2="38" y2="-50" stroke="#1a1233" stroke-width="4"/>
          </g>
          <text x="400" y="470" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(254,243,199,0.7)">NAOMI · BETHLEHEM</text>
          <!-- RUTH facing Naomi, holding on (right of center) -->
          <g transform="translate(460 410)">
            <path d="M -22 0 Q -18 -54 0 -64 Q 18 -54 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="0" cy="-74" rx="13" ry="15" fill="#3d2a16"/>
            <path d="M -10 -80 Q 0 -90 10 -80" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="none"/>
            <!-- Arm reaching forward / clinging -->
            <line x1="-18" y1="-46" x2="-44" y2="-50" stroke="#3d2a16" stroke-width="4"/>
            <!-- Halo -->
            <circle cx="0" cy="-74" r="20" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <text x="460" y="470" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(251,191,36,0.85)">RUTH · CHOSE TO STAY</text>
          <text x="400" y="490" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="11" fill="rgba(254,243,199,0.85)">"Where you go, I will go"</text>
        </svg>`
      },
      {
        id: 'gleaning',
        title: 'Gleaning in the Field of Boaz',
        scriptureRef: 'Ruth 2:8-12',
        bibleText: '"May the Lord repay you for what you have done. May you be richly rewarded by the Lord, the God of Israel, under whose wings you have come to take refuge."',
        narration: 'In Bethlehem there was a law for the poor: you do not harvest the corners of your field, and you do not pick up what your reapers drop. Leave it for the foreigner, the widow, the fatherless. Ruth — foreigner, widow, alone — went out to glean. By providence she happened into the field of Boaz, a relative of Naomi’s dead husband. He noticed her. He told his men to leave extra grain for her on purpose. He told her to come back every day. He prayed a blessing over her: "May you be richly rewarded by the Lord under whose wings you have come to take refuge."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'rng', skyTop:'#3d2a5e', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Bright midday sun -->
          <circle cx="650" cy="80" r="40" fill="#fef3c7"/>
          <circle cx="650" cy="80" r="60" fill="rgba(254,243,199,0.45)"/>
          <!-- Hill behind (Boaz watches from there) -->
          <path d="M 480 300 Q 600 260 800 280 L 800 360 L 480 360 Z" fill="#241846" opacity="0.75"/>
          <!-- Barley field — golden -->
          <path d="M 0 280 Q 200 270 400 280 Q 600 270 800 280 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 320 Q 200 310 400 320 Q 600 310 800 320 L 800 500 L 0 500 Z" fill="rgba(251,191,36,0.18)"/>
          <!-- Rows of barley stalks (gold strokes) -->
          <g stroke="rgba(251,191,36,0.8)" stroke-width="1" fill="none">
            <line x1="40"  y1="370" x2="40"  y2="340"/>
            <line x1="60"  y1="372" x2="60"  y2="338"/>
            <line x1="80"  y1="370" x2="80"  y2="340"/>
            <line x1="100" y1="372" x2="100" y2="338"/>
            <line x1="120" y1="370" x2="120" y2="340"/>
            <line x1="140" y1="372" x2="140" y2="338"/>
            <line x1="160" y1="370" x2="160" y2="340"/>
            <line x1="180" y1="372" x2="180" y2="338"/>
            <line x1="220" y1="370" x2="220" y2="340"/>
            <line x1="240" y1="372" x2="240" y2="338"/>
            <line x1="260" y1="370" x2="260" y2="340"/>
            <line x1="280" y1="372" x2="280" y2="338"/>
            <line x1="540" y1="370" x2="540" y2="340"/>
            <line x1="560" y1="372" x2="560" y2="338"/>
            <line x1="580" y1="370" x2="580" y2="340"/>
            <line x1="600" y1="372" x2="600" y2="338"/>
            <line x1="620" y1="372" x2="620" y2="340"/>
            <line x1="640" y1="370" x2="640" y2="338"/>
            <line x1="660" y1="372" x2="660" y2="340"/>
          </g>
          <!-- Barley heads -->
          <g fill="rgba(251,191,36,0.95)">
            <circle cx="40" cy="338" r="1.6"/><circle cx="60" cy="336" r="1.6"/>
            <circle cx="80" cy="338" r="1.6"/><circle cx="100" cy="336" r="1.6"/>
            <circle cx="120" cy="338" r="1.6"/><circle cx="140" cy="336" r="1.6"/>
            <circle cx="160" cy="338" r="1.6"/><circle cx="180" cy="336" r="1.6"/>
            <circle cx="220" cy="338" r="1.6"/><circle cx="240" cy="336" r="1.6"/>
            <circle cx="260" cy="338" r="1.6"/><circle cx="280" cy="336" r="1.6"/>
            <circle cx="540" cy="338" r="1.6"/><circle cx="560" cy="336" r="1.6"/>
            <circle cx="580" cy="338" r="1.6"/><circle cx="600" cy="336" r="1.6"/>
            <circle cx="620" cy="336" r="1.6"/><circle cx="640" cy="338" r="1.6"/>
            <circle cx="660" cy="336" r="1.6"/>
          </g>
          <!-- Fallen sheaves intentionally LEFT BEHIND in Ruth's path -->
          <g stroke="rgba(251,191,36,0.85)" stroke-width="1.5" fill="rgba(251,191,36,0.45)">
            <ellipse cx="380" cy="420" rx="22" ry="6" transform="rotate(20 380 420)"/>
            <ellipse cx="420" cy="435" rx="24" ry="7" transform="rotate(-12 420 435)"/>
            <ellipse cx="460" cy="425" rx="22" ry="6" transform="rotate(8 460 425)"/>
          </g>
          <!-- Ruth kneeling, gleaning a sheaf, basket beside her -->
          <g transform="translate(400 400)">
            <!-- Robe -->
            <path d="M -22 20 Q -18 -34 0 -44 Q 18 -34 22 20 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-54" rx="12" ry="14" fill="#1a1233"/>
            <!-- Headscarf -->
            <path d="M -10 -60 Q 0 -72 10 -60" stroke="rgba(254,243,199,0.55)" stroke-width="2.5" fill="rgba(254,243,199,0.18)"/>
            <!-- Hand reaching to a sheaf -->
            <line x1="18" y1="-26" x2="42" y2="14" stroke="#1a1233" stroke-width="4"/>
            <!-- Halo -->
            <circle cx="0" cy="-54" r="20" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <!-- Woven basket -->
          <g transform="translate(360 420)">
            <ellipse cx="0" cy="0" rx="22" ry="9" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <path d="M -18 -2 Q 0 -16 18 -2" stroke="rgba(251,191,36,0.7)" stroke-width="1" fill="none"/>
            <!-- Grain inside -->
            <ellipse cx="0" cy="-4" rx="14" ry="3" fill="rgba(251,191,36,0.85)"/>
          </g>
          <!-- Boaz on the hill, watching, with a staff -->
          <g transform="translate(640 300)">
            <ellipse cx="0" cy="0" rx="9" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="8" ry="10" fill="#1a1233"/>
            <path d="M -7 -16 Q 0 -6 7 -16" stroke="rgba(254,243,199,0.55)" stroke-width="1.2" fill="none"/>
            <line x1="9" y1="-12" x2="20" y2="22" stroke="#3d2a16" stroke-width="2.5"/>
            <circle cx="0" cy="-22" r="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Under whose wings you have come to take refuge"</text>
        </svg>`
      },
      {
        id: 'threshing-floor',
        title: 'At the Threshing Floor',
        scriptureRef: 'Ruth 3:7-13',
        bibleText: '"Don’t be afraid. I will do for you all you ask. All my fellow townsmen know that you are a woman of noble character."',
        narration: 'Naomi instructed Ruth in a custom older than the law itself — go to the threshing floor at night, wait until Boaz is full of bread and wine, then quietly lie down at his feet. It was a proposal of marriage with the silence of a question mark. Boaz woke in the middle of the night and found her there. He could have done anything. He covered her with his cloak and said, "Don’t be afraid." There was a nearer relative who had first right to redeem her. He promised: if that man will not, I will.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'rnt', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <g fill="#fef3c7" opacity="0.7">
            <circle cx="80" cy="50" r="0.9"/><circle cx="200" cy="80" r="1"/>
            <circle cx="340" cy="40" r="0.8"/><circle cx="500" cy="70" r="0.9"/>
            <circle cx="640" cy="60" r="1"/><circle cx="730" cy="100" r="0.8"/>
          </g>
          <!-- Moon, low and full -->
          <circle cx="660" cy="120" r="36" fill="#fef3c7"/>
          <circle cx="660" cy="120" r="44" fill="rgba(254,243,199,0.35)"/>
          <!-- Hills -->
          <path d="M 0 320 Q 400 290 800 320 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Threshing floor — round packed earth -->
          <ellipse cx="400" cy="400" rx="280" ry="44" fill="#3d2a16" stroke="rgba(251,191,36,0.45)" stroke-width="1"/>
          <ellipse cx="400" cy="400" rx="280" ry="44" fill="none" stroke="rgba(254,243,199,0.22)" stroke-width="0.8" stroke-dasharray="2 4"/>
          <!-- Stacked sheaves of barley along the back of the floor -->
          <g stroke="rgba(251,191,36,0.7)" stroke-width="1.2" fill="rgba(251,191,36,0.3)">
            <path d="M 200 380 Q 220 350 240 380 Z"/>
            <path d="M 260 380 Q 280 348 300 380 Z"/>
            <path d="M 500 380 Q 520 348 540 380 Z"/>
            <path d="M 560 380 Q 580 350 600 380 Z"/>
          </g>
          <!-- Heap of winnowed grain (small mound) -->
          <ellipse cx="400" cy="382" rx="50" ry="14" fill="rgba(251,191,36,0.55)" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
          <!-- Winnowing fork leaning -->
          <g transform="translate(440 380) rotate(20)">
            <line x1="0" y1="0" x2="-4" y2="-80" stroke="#3d2a16" stroke-width="2"/>
            <line x1="-4" y1="-80" x2="-10" y2="-94" stroke="#3d2a16" stroke-width="2"/>
            <line x1="-4" y1="-80" x2="-4"  y2="-94" stroke="#3d2a16" stroke-width="2"/>
            <line x1="-4" y1="-80" x2="2"   y2="-94" stroke="#3d2a16" stroke-width="2"/>
          </g>
          <!-- Boaz lying on a low blanket, head propped, awake -->
          <g transform="translate(360 412)">
            <ellipse cx="0" cy="0" rx="80" ry="12" fill="#3d2a16"/>
            <ellipse cx="-58" cy="-8" rx="14" ry="14" fill="#1a1233"/>
            <!-- Head propped on hand -->
            <line x1="-66" y1="-16" x2="-72" y2="-26" stroke="#1a1233" stroke-width="3"/>
            <!-- Beard -->
            <path d="M -64 -6 Q -56 4 -50 -6" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/>
            <!-- Cloak draped over Ruth -->
            <ellipse cx="55" cy="-3" rx="38" ry="14" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <!-- Ruth at Boaz's feet, lying small, hand on his foot -->
          <g transform="translate(458 408)">
            <ellipse cx="0" cy="0" rx="30" ry="8" fill="rgba(251,191,36,0.18)"/>
            <ellipse cx="22" cy="-3" rx="10" ry="12" fill="#1a1233"/>
            <!-- Hair scarf -->
            <path d="M 12 -10 Q 22 -16 32 -10" stroke="rgba(254,243,199,0.45)" stroke-width="1.4" fill="none"/>
            <!-- Halo -->
            <circle cx="22" cy="-3" r="14" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
          </g>
          <!-- A small lamp at the edge -->
          <g transform="translate(140 388)">
            <ellipse cx="0" cy="0" rx="9" ry="3" fill="#3d2a16"/>
            <ellipse cx="0" cy="-4" rx="4" ry="5" fill="#fb923c"/>
            <ellipse cx="0" cy="-5" rx="2" ry="3" fill="#fbbf24"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Don’t be afraid · I will do for you all you ask"</text>
        </svg>`
      },
      {
        id: 'obed',
        title: 'A Son for Naomi',
        scriptureRef: 'Ruth 4:13-17',
        bibleText: '"Praise be to the Lord, who this day has not left you without a guardian-redeemer… The women living there said, ‘Naomi has a son!’"',
        narration: 'The nearer relative passed on his right of redemption. Boaz took Ruth as his wife. The Lord enabled her to conceive and she bore a son. The women of the village laid the baby on Naomi’s chest and said, "Naomi has a son." The bitter old widow who had told everyone to call her Mara — bitter — was now holding the future of the world in her arms. The baby was named Obed. Obed had a son, Jesse. Jesse had a son, David. Twenty-eight generations later, in this same town, in another mother’s arms, a different baby would be born — and the foreign widow from Moab is in the Messiah’s family tree.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'rno', skyTop:'#1e1846', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Dawn over Bethlehem -->
          <radialGradient id="rnoDawn" cx="0.5" cy="0.2" r="0.7">
            <stop offset="0%"  stop-color="rgba(254,243,199,0.65)"/>
            <stop offset="50%" stop-color="rgba(251,191,36,0.3)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="120" rx="420" ry="220" fill="url(#rnoDawn)"/>
          <!-- Bethlehem skyline in the distance -->
          <g transform="translate(400 290)">
            <rect x="-90" y="-15" width="14" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="-92,-15 -83,-25 -74,-15" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="-70" y="-20" width="16" height="25" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="-72,-20 -62,-30 -52,-20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="-48" y="-18" width="14" height="23" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="-50,-18 -41,-26 -32,-18" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="-28" y="-22" width="16" height="27" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="-30,-22 -20,-32 -10,-22" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="-6" y="-18" width="14" height="23" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="14" y="-20" width="16" height="25" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="12,-20 22,-30 32,-20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="36" y="-15" width="14" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="56" y="-22" width="16" height="27" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="54,-22 64,-32 74,-22" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="78" y="-15" width="14" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
          </g>
          <text x="400" y="275" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2.5" fill="rgba(251,191,36,0.7)">BETHLEHEM</text>
          <!-- Foreground hill -->
          <path d="M 0 350 Q 400 330 800 350 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 420 Q 400 410 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Naomi seated on a low stone with baby Obed -->
          <g transform="translate(400 400)">
            <!-- Robe (warmer tone for Naomi — she's no longer Mara) -->
            <path d="M -34 20 Q -28 -36 0 -50 Q 28 -36 34 20 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.6)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-58" rx="13" ry="16" fill="#1a1233"/>
            <!-- Grey hair -->
            <path d="M -10 -64 Q 0 -76 10 -64" stroke="rgba(254,243,199,0.6)" stroke-width="2.2" fill="none"/>
            <!-- Arms cradling baby -->
            <path d="M -22 -28 Q 0 -38 22 -28" stroke="#1a1233" stroke-width="5" fill="none"/>
            <!-- Baby Obed — bright bundle in arms -->
            <ellipse cx="0" cy="-30" rx="18" ry="9" fill="#fef3c7"/>
            <ellipse cx="0" cy="-32" rx="6" ry="5" fill="#fef3c7"/>
            <!-- Baby's small halo of significance -->
            <circle cx="0" cy="-32" r="14" fill="none" stroke="rgba(251,191,36,0.9)" stroke-width="1.4"/>
            <!-- Naomi smiling (closed eyes, peaceful) — subtle face hint -->
            <line x1="-4" y1="-60" x2="-1" y2="-60" stroke="rgba(254,243,199,0.55)" stroke-width="0.8"/>
            <line x1="1"  y1="-60" x2="4"  y2="-60" stroke="rgba(254,243,199,0.55)" stroke-width="0.8"/>
          </g>
          <!-- Ruth standing beside, hand on Naomi's shoulder -->
          <g transform="translate(470 400)">
            <path d="M -22 20 Q -18 -34 0 -44 Q 18 -34 22 20 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="0" cy="-54" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -10 -60 Q 0 -72 10 -60" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="rgba(254,243,199,0.15)"/>
            <line x1="-14" y1="-30" x2="-36" y2="-32" stroke="#3d2a16" stroke-width="4"/>
            <circle cx="0" cy="-54" r="18" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
          </g>
          <!-- Boaz standing behind, slightly back -->
          <g transform="translate(340 400)" opacity="0.85">
            <ellipse cx="0" cy="0" rx="10" ry="26" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-26" rx="9" ry="11" fill="#0a0d1a"/>
            <path d="M -7 -18 Q 0 -8 7 -18" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/>
          </g>
          <!-- Faint Star of David glow over the baby (foreshadow) -->
          <g transform="translate(400 370)" opacity="0.5">
            <polygon points="0,-12 4,-4 12,-4 6,2 8,10 0,5 -8,10 -6,2 -12,-4 -4,-4" fill="none" stroke="rgba(251,191,36,0.8)" stroke-width="0.8"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Naomi has a son!" · the line that leads to Jesse · David · Christ</text>
        </svg>`
      }
    ],
    closing: 'Ruth did not know she was writing a chapter of the messianic family tree. She just chose to stay with the bitter old woman who had nothing left to give her. Boaz did not know he was a picture of Christ. He just refused to take advantage of a young widow lying at his feet in the dark. The hidden faithfulness of one young woman and one decent man in a small town during a violent period of history is exactly the kind of obedience the Lord weaves the world out of. Your small loyalty this week may be doing more than you can possibly see.',
    closingPrompt: 'Whose "Naomi" are you right now — the person you have been called to stay with even when there is no obvious payoff — and what would walking with them another mile look like?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 16 — Samuel Anoints David
  // ════════════════════════════════════════════════════════════
  {
    id: 'samuel-anoints-david',
    title: 'Samuel Anoints David',
    subtitle: 'The Lord looks not at the eldest, the tallest, or the obvious.',
    icon: '🫒',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'united-kingdom',
    scriptureRef: '1 Samuel 16',
    duration: '~6 min',
    scenes: [
      {
        id: 'samuel-sent',
        title: 'The Horn of Oil',
        scriptureRef: '1 Samuel 16:1-5',
        bibleText: '"How long will you mourn for Saul, since I have rejected him as king over Israel? Fill your horn with oil and be on your way. I am sending you to Jesse of Bethlehem. I have chosen one of his sons to be king."',
        narration: 'Saul was still on the throne, but the Lord had withdrawn from him. Samuel sat in his house in Ramah, grieving. The Lord said, "Stop grieving. Fill your horn with oil. I am sending you to Bethlehem. I have already chosen the next king from among Jesse’s sons." Samuel was afraid. If Saul finds out I am anointing a rival, he will kill me. The Lord said, "Take a heifer and say you are coming to sacrifice. Invite Jesse. I will show you what to do." So the old prophet walked out into the dawn with a clay horn full of oil and a young cow on a rope.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sas', skyTop:'#1e1846', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Dawn glow on horizon -->
          <radialGradient id="sasDawn" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0%"  stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="150" rx="380" ry="160" fill="url(#sasDawn)"/>
          <!-- Hills -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Road heading down to Bethlehem -->
          <path d="M 400 500 Q 480 440 560 400" stroke="rgba(254,243,199,0.5)" stroke-width="6" fill="none" stroke-dasharray="6 8"/>
          <!-- Distant Bethlehem -->
          <g transform="translate(660 388)">
            <rect x="-14" y="-12" width="12" height="14" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="0.7"/>
            <rect x="0"   y="-18" width="14" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="0.7"/>
            <polygon points="-1,-18 6,-26 13,-18" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="0.7"/>
            <rect x="16"  y="-10" width="12" height="12" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="0.7"/>
          </g>
          <text x="660" y="376" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2.5" fill="rgba(251,191,36,0.7)">BETHLEHEM</text>
          <!-- Samuel walking down the road, old man with staff -->
          <g transform="translate(380 415)">
            <!-- Long robe -->
            <path d="M -22 0 Q -22 -60 0 -70 Q 22 -60 22 0 Z" fill="#1a1233" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
            <ellipse cx="0" cy="-80" rx="13" ry="16" fill="#1a1233"/>
            <!-- Long beard -->
            <path d="M -7 -72 Q 0 -54 7 -72" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <path d="M -4 -58 Q 0 -48 4 -58" stroke="rgba(254,243,199,0.55)" stroke-width="1.2" fill="none"/>
            <!-- Staff in left hand -->
            <line x1="-22" y1="-30" x2="-32" y2="22" stroke="#3d2a16" stroke-width="2.5"/>
            <!-- Horn of oil in right hand — clay vessel with cap -->
            <g transform="translate(22 -28)">
              <ellipse cx="0" cy="0" rx="10" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
              <ellipse cx="0" cy="-12" rx="5" ry="3" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
              <!-- Single drop of oil at the tip -->
              <ellipse cx="0" cy="-16" rx="2" ry="3" fill="rgba(251,191,36,0.9)"/>
            </g>
            <!-- Halo -->
            <circle cx="0" cy="-80" r="22" fill="none" stroke="rgba(251,191,36,0.75)" stroke-width="1.3"/>
          </g>
          <!-- Young heifer on a rope walking beside him -->
          <g transform="translate(290 430)">
            <ellipse cx="0" cy="0" rx="30" ry="14" fill="#fef3c7" opacity="0.85"/>
            <ellipse cx="-30" cy="-6" rx="9" ry="7" fill="#fef3c7" opacity="0.95"/>
            <line x1="-22" y1="14" x2="-22" y2="28" stroke="#3d2a16" stroke-width="3"/>
            <line x1="-10" y1="14" x2="-10" y2="28" stroke="#3d2a16" stroke-width="3"/>
            <line x1="10"  y1="14" x2="10"  y2="28" stroke="#3d2a16" stroke-width="3"/>
            <line x1="22"  y1="14" x2="22"  y2="28" stroke="#3d2a16" stroke-width="3"/>
            <line x1="-38" y1="-10" x2="-44" y2="-16" stroke="#3d2a16" stroke-width="2"/>
            <!-- Rope from heifer to Samuel's hand -->
            <line x1="-28" y1="-8" x2="42" y2="-22" stroke="rgba(254,243,199,0.55)" stroke-width="1.5"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.75)">"I have chosen one of his sons"</text>
        </svg>`
      },
      {
        id: 'seven-sons',
        title: 'Not This One. Not This One. Not This One.',
        scriptureRef: '1 Samuel 16:6-10',
        bibleText: '"The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart."',
        narration: 'Jesse called his sons. Eliab walked in first — tall, strong, a soldier’s shoulders. Samuel said in his heart, "Surely the Lord’s anointed stands here." The Lord said: "Do not consider his appearance or his height, for I have rejected him. The Lord does not see what people see. People look at the outside. The Lord looks at the heart." Then Abinadab. No. Then Shammah. No. Then four more. No. No. No. No. Seven tall sons. Seven nos. Samuel was left standing in awkward silence in front of an embarrassed father.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sss', skyTop:'#241846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Interior of Jesse's house — wooden beams and stone -->
          <rect x="0" y="0" width="800" height="500" fill="#241846"/>
          <g fill="#3d2a16" opacity="0.6">
            <rect x="0" y="80" width="800" height="10"/>
            <rect x="0" y="380" width="800" height="20"/>
          </g>
          <!-- Lamp glow -->
          <radialGradient id="sssLamp" cx="0.5" cy="0.3" r="0.55">
            <stop offset="0%"  stop-color="rgba(251,191,36,0.35)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.1)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="170" rx="400" ry="160" fill="url(#sssLamp)"/>
          <!-- Hanging lamp -->
          <line x1="400" y1="0" x2="400" y2="100" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          <ellipse cx="400" cy="108" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
          <ellipse cx="400" cy="104" rx="6" ry="7" fill="#fbbf24"/>
          <!-- Floor -->
          <rect x="0" y="400" width="800" height="100" fill="#1a1233"/>
          <!-- Seven sons standing in a line, each tall, each crossed out with a faint red X -->
          <g fill="#0a0d1a">
            <g transform="translate(120 370)">
              <ellipse cx="0" cy="0" rx="13" ry="44"/>
              <ellipse cx="0" cy="-46" rx="11" ry="13"/>
              <path d="M -7 -38 Q 0 -22 7 -38" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
              <!-- Red X faintly over chest -->
              <line x1="-12" y1="-12" x2="12" y2="14" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
              <line x1="-12" y1="14" x2="12" y2="-12" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
            </g>
            <g transform="translate(210 380)">
              <ellipse cx="0" cy="0" rx="12" ry="40"/>
              <ellipse cx="0" cy="-42" rx="10" ry="12"/>
              <path d="M -6 -35 Q 0 -22 6 -35" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
              <line x1="-10" y1="-10" x2="10" y2="12" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
              <line x1="-10" y1="12" x2="10" y2="-10" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
            </g>
            <g transform="translate(290 374)">
              <ellipse cx="0" cy="0" rx="13" ry="44"/>
              <ellipse cx="0" cy="-46" rx="11" ry="13"/>
              <path d="M -7 -38 Q 0 -24 7 -38" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
              <line x1="-12" y1="-12" x2="12" y2="14" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
              <line x1="-12" y1="14" x2="12" y2="-12" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
            </g>
            <g transform="translate(370 378)">
              <ellipse cx="0" cy="0" rx="12" ry="42"/>
              <ellipse cx="0" cy="-44" rx="10" ry="12"/>
              <path d="M -6 -36 Q 0 -22 6 -36" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
              <line x1="-10" y1="-10" x2="10" y2="12" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
              <line x1="-10" y1="12" x2="10" y2="-10" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
            </g>
            <g transform="translate(450 374)">
              <ellipse cx="0" cy="0" rx="13" ry="44"/>
              <ellipse cx="0" cy="-46" rx="11" ry="13"/>
              <path d="M -7 -38 Q 0 -24 7 -38" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
              <line x1="-12" y1="-12" x2="12" y2="14" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
              <line x1="-12" y1="14" x2="12" y2="-12" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
            </g>
            <g transform="translate(530 380)">
              <ellipse cx="0" cy="0" rx="12" ry="40"/>
              <ellipse cx="0" cy="-42" rx="10" ry="12"/>
              <path d="M -6 -35 Q 0 -22 6 -35" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
              <line x1="-10" y1="-10" x2="10" y2="12" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
              <line x1="-10" y1="12" x2="10" y2="-10" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
            </g>
            <g transform="translate(610 376)">
              <ellipse cx="0" cy="0" rx="13" ry="44"/>
              <ellipse cx="0" cy="-46" rx="11" ry="13"/>
              <path d="M -7 -38 Q 0 -24 7 -38" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
              <line x1="-12" y1="-12" x2="12" y2="14" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
              <line x1="-12" y1="14" x2="12" y2="-12" stroke="rgba(248,113,113,0.55)" stroke-width="2"/>
            </g>
          </g>
          <!-- Samuel standing facing them on the right edge, horn in hand, head shaking -->
          <g transform="translate(720 375)">
            <path d="M -16 0 Q -16 -44 0 -54 Q 16 -44 16 0 Z" fill="#1a1233" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
            <ellipse cx="0" cy="-62" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -6 -56 Q 0 -42 6 -56" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <!-- Horn of oil, lowered -->
            <ellipse cx="14" cy="-12" rx="7" ry="10" fill="#3d2a16" stroke="rgba(251,191,36,0.8)" stroke-width="1"/>
            <circle cx="0" cy="-62" r="18" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
          </g>
          <!-- "1 2 3 4 5 6 7" small counter labels under each son -->
          <g font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="2" fill="rgba(254,243,199,0.6)">
            <text x="120" y="455" text-anchor="middle">1</text>
            <text x="210" y="455" text-anchor="middle">2</text>
            <text x="290" y="455" text-anchor="middle">3</text>
            <text x="370" y="455" text-anchor="middle">4</text>
            <text x="450" y="455" text-anchor="middle">5</text>
            <text x="530" y="455" text-anchor="middle">6</text>
            <text x="610" y="455" text-anchor="middle">7</text>
          </g>
          <text x="400" y="485" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"The Lord looks at the heart"</text>
        </svg>`
      },
      {
        id: 'forgotten-shepherd',
        title: 'The Forgotten Boy in the Field',
        scriptureRef: '1 Samuel 16:11-12',
        bibleText: '"Are these all the sons you have?" "There is still the youngest," Jesse answered. "He is tending the sheep."',
        narration: '"Are these all the sons you have?" Samuel asked. Jesse paused. "Well — there is the youngest. He is out tending the sheep." Send for him. We will not sit down until he comes. So they waited. The seven older brothers stood awkward in the room. Outside in the hills, a boy with reddish hair and a shepherd’s satchel was hurrying back at his father’s call, smelling of lanolin and dust. He walked through the door — and the Lord said, "Rise. Anoint him. This is the one."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sfs', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Open pasture, soft afternoon -->
          <ellipse cx="640" cy="100" rx="40" ry="30" fill="#fef3c7" opacity="0.85"/>
          <ellipse cx="640" cy="100" rx="60" ry="44" fill="rgba(251,191,36,0.45)"/>
          <!-- Rolling hills -->
          <path d="M 0 300 Q 200 270 400 290 Q 600 270 800 300 L 800 500 L 0 500 Z" fill="#241846" opacity="0.8"/>
          <path d="M 0 360 Q 400 340 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Distant sheep scattered on the hillside (small white ovals) -->
          <g fill="#fef3c7" opacity="0.85">
            <ellipse cx="120" cy="330" rx="10" ry="6"/>
            <ellipse cx="110" cy="326" rx="4" ry="4"/>
            <ellipse cx="180" cy="340" rx="9" ry="5"/>
            <ellipse cx="170" cy="336" rx="4" ry="4"/>
            <ellipse cx="240" cy="328" rx="10" ry="6"/>
            <ellipse cx="230" cy="324" rx="4" ry="4"/>
            <ellipse cx="60"  cy="345" rx="9" ry="5"/>
            <ellipse cx="50"  cy="341" rx="4" ry="4"/>
          </g>
          <!-- Old olive tree on the right (Jesse's farm boundary) -->
          <g transform="translate(680 310)">
            <line x1="0" y1="0" x2="0" y2="-90" stroke="#0a0d1a" stroke-width="5"/>
            <ellipse cx="0" cy="-110" rx="50" ry="32" fill="#1e1638"/>
            <ellipse cx="-20" cy="-128" rx="18" ry="12" fill="#1e1638"/>
            <ellipse cx="20"  cy="-122" rx="18" ry="12" fill="#1e1638"/>
          </g>
          <!-- David — small, ruddy, with shepherd's bag and staff, walking from the hills toward the viewer -->
          <g transform="translate(380 410)">
            <!-- Tunic -->
            <path d="M -14 0 Q -14 -34 0 -40 Q 14 -34 14 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="1.2"/>
            <!-- Head — ruddy/healthy color hint via a soft halo of warm tones, but base silhouette -->
            <ellipse cx="0" cy="-48" rx="10" ry="12" fill="#1a1233"/>
            <!-- Reddish-brown hair (a few short strokes) -->
            <path d="M -8 -54 Q -10 -60 -4 -60 M -2 -58 Q -2 -64 2 -62 M 4 -58 Q 4 -64 8 -60 M 8 -54 Q 12 -58 10 -52" stroke="rgba(251,113,38,0.75)" stroke-width="1.5" fill="none"/>
            <!-- Shepherd's bag on a strap -->
            <line x1="-8" y1="-32" x2="-22" y2="-12" stroke="#3d2a16" stroke-width="1.5"/>
            <ellipse cx="-22" cy="-8" rx="7" ry="9" fill="#241846" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <!-- Staff in right hand -->
            <line x1="12" y1="-22" x2="22" y2="22" stroke="#3d2a16" stroke-width="2.5"/>
            <!-- Sling tucked in belt (a small loop) -->
            <path d="M -6 -16 Q -2 -10 2 -16" stroke="rgba(254,243,199,0.55)" stroke-width="1.2" fill="none"/>
            <!-- Halo (brightest of any in the file — the chosen one) -->
            <circle cx="0" cy="-48" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
          </g>
          <!-- A small lamb following at his heels -->
          <g transform="translate(360 440)">
            <ellipse cx="0" cy="0" rx="9" ry="5" fill="#fef3c7"/>
            <ellipse cx="-8" cy="-2" rx="4" ry="3" fill="#fef3c7"/>
            <line x1="-5" y1="4" x2="-5" y2="9" stroke="#3d2a16" stroke-width="1.5"/>
            <line x1="3"  y1="4" x2="3"  y2="9" stroke="#3d2a16" stroke-width="1.5"/>
          </g>
          <!-- Beam of light from sky onto David -->
          <defs>
            <linearGradient id="sfsBeam" x1="0.4" y1="0" x2="0.4" y2="1">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.45)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
          </defs>
          <polygon points="350,0 320,420 440,420" fill="url(#sfsBeam)"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"There is still the youngest"</text>
        </svg>`
      },
      {
        id: 'anointing',
        title: 'Oil Poured · Spirit Falls',
        scriptureRef: '1 Samuel 16:13',
        bibleText: '"So Samuel took the horn of oil and anointed him in the presence of his brothers, and from that day on the Spirit of the Lord came powerfully upon David."',
        narration: 'Samuel poured the oil. It ran down David’s reddish hair and into his beard and onto the shoulders of his tunic. The seven older brothers watched. They had never been chosen for anything like this. From that day forward the Spirit of the Lord came powerfully upon David — quiet at first, and then more and more, until twenty-five hundred years later we are still singing the songs he wrote. Samuel went back to Ramah. David went back to the sheep. The kingdom would come for him in its own time.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'san', skyTop:'#1e1846', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Beam of glory pouring from above -->
          <defs>
            <linearGradient id="sanBeam" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.85)"/>
              <stop offset="50%" stop-color="rgba(251,191,36,0.5)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </linearGradient>
            <radialGradient id="sanGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%"  stop-color="rgba(254,243,199,0.7)"/>
              <stop offset="55%" stop-color="rgba(251,191,36,0.25)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <polygon points="380,0 280,500 520,500" fill="url(#sanBeam)"/>
          <ellipse cx="400" cy="280" rx="160" ry="180" fill="url(#sanGlow)"/>
          <!-- Floor -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Seven brothers stepped back, lined up in the shadows on the right -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(620 400)"><ellipse cx="0" cy="0" rx="6" ry="20"/><ellipse cx="0" cy="-22" rx="5" ry="6"/></g>
            <g transform="translate(650 400)"><ellipse cx="0" cy="0" rx="6" ry="20"/><ellipse cx="0" cy="-22" rx="5" ry="6"/></g>
            <g transform="translate(680 400)"><ellipse cx="0" cy="0" rx="6" ry="20"/><ellipse cx="0" cy="-22" rx="5" ry="6"/></g>
            <g transform="translate(710 400)"><ellipse cx="0" cy="0" rx="6" ry="20"/><ellipse cx="0" cy="-22" rx="5" ry="6"/></g>
            <g transform="translate(740 400)"><ellipse cx="0" cy="0" rx="6" ry="20"/><ellipse cx="0" cy="-22" rx="5" ry="6"/></g>
            <g transform="translate(770 400)"><ellipse cx="0" cy="0" rx="6" ry="20"/><ellipse cx="0" cy="-22" rx="5" ry="6"/></g>
            <g transform="translate(800 400)"><ellipse cx="0" cy="0" rx="6" ry="20"/><ellipse cx="0" cy="-22" rx="5" ry="6"/></g>
          </g>
          <!-- Jesse standing on the left, hands clasped -->
          <g transform="translate(180 400)">
            <ellipse cx="0" cy="0" rx="11" ry="32" fill="#1a1233"/>
            <ellipse cx="0" cy="-34" rx="11" ry="13" fill="#1a1233"/>
            <!-- Long beard -->
            <path d="M -8 -26 Q 0 -10 8 -26" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <line x1="-7" y1="-18" x2="7" y2="-14" stroke="#1a1233" stroke-width="3"/>
          </g>
          <!-- David kneeling in the beam of light, head bowed -->
          <g transform="translate(400 395)">
            <ellipse cx="0" cy="0" rx="20" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-18" rx="14" ry="18" fill="#3d2a16"/>
            <ellipse cx="0" cy="-44" rx="11" ry="13" fill="#1a1233"/>
            <!-- Reddish hair -->
            <path d="M -8 -50 Q -10 -56 -4 -56 M -2 -54 Q -2 -60 2 -58 M 4 -54 Q 4 -60 8 -56 M 8 -50 Q 12 -54 10 -48" stroke="rgba(251,113,38,0.75)" stroke-width="1.6" fill="none"/>
            <!-- Oil streaming over the head and down the face — droplets and golden streaks -->
            <g fill="rgba(251,191,36,0.9)">
              <ellipse cx="-3" cy="-44" rx="2" ry="3"/>
              <ellipse cx="3"  cy="-42" rx="2" ry="3"/>
              <path d="M -6 -38 Q -8 -28 -10 -18" stroke="rgba(251,191,36,0.85)" stroke-width="1.5" fill="none"/>
              <path d="M 6  -38 Q 8  -28 10  -18" stroke="rgba(251,191,36,0.85)" stroke-width="1.5" fill="none"/>
              <path d="M -2 -34 Q -2 -22 -2 -10" stroke="rgba(251,191,36,0.6)" stroke-width="1.2" fill="none"/>
            </g>
            <!-- Huge radiant halo -->
            <circle cx="0" cy="-44" r="36" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-44" r="48" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          </g>
          <!-- Samuel standing over David, horn tipped, oil flowing -->
          <g transform="translate(400 340)">
            <ellipse cx="0" cy="0" rx="13" ry="36" fill="#1a1233" opacity="0.85"/>
            <ellipse cx="0" cy="-38" rx="11" ry="14" fill="#1a1233"/>
            <path d="M -7 -30 Q 0 -16 7 -30" stroke="rgba(254,243,199,0.7)" stroke-width="1.5" fill="none"/>
            <!-- Arms raised, horn tipped over David -->
            <line x1="0" y1="-22" x2="-2" y2="-2" stroke="#1a1233" stroke-width="5"/>
            <g transform="translate(-2 8) rotate(40)">
              <ellipse cx="0" cy="0" rx="9" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
              <ellipse cx="0" cy="-14" rx="4" ry="3" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="0.8"/>
            </g>
            <circle cx="0" cy="-38" r="20" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.3"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"From that day on, the Spirit of the Lord came powerfully upon David"</text>
        </svg>`
      }
    ],
    closing: 'The eldest, the tallest, the most obviously qualified — none of them. The forgotten boy who was not even invited to the room — that one. God does not see what the family sees, what the workplace sees, what the mirror sees. He sees the heart. If you have ever been the one left in the field while everyone else was inside getting noticed, you are in good company. The Lord is fully capable of sending the prophet to your pasture and starting the kingdom from there.',
    closingPrompt: 'In what room have you been waiting to be invited — and how would your week change if you trusted that God already sees you in the field?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 17 — Solomon's Wisdom · The Two Mothers
  // ════════════════════════════════════════════════════════════
  {
    id: 'solomon-two-mothers',
    title: "Solomon's Wisdom",
    subtitle: 'A young king asks for wisdom. The first test arrives the next morning.',
    icon: '⚖️',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'united-kingdom',
    scriptureRef: '1 Kings 3',
    duration: '~6 min',
    scenes: [
      {
        id: 'dream-gibeon',
        title: 'The Dream at Gibeon',
        scriptureRef: '1 Kings 3:5-12',
        bibleText: '"Ask for whatever you want me to give you." …"So give your servant a discerning heart to govern your people and to distinguish between right and wrong."',
        narration: 'Solomon was barely twenty. His father David was buried. The kingdom was on his shoulders. He went up to the great altar at Gibeon and offered a thousand sacrifices. That night, in a dream, the Lord said, "Ask for whatever you want me to give you." Solomon could have said long life, or wealth, or victory over his enemies. He said, "I am only a child. I do not know how to lead this people. Give your servant a discerning heart, so I can tell right from wrong." The Lord was pleased. "Because you asked for this — and not for long life, or wealth, or your enemies’ heads — I will give you a wise and discerning heart like no one before you. And I will also give you what you did not ask for. Riches and honor."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sld', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <g fill="#fef3c7" opacity="0.7">
            <circle cx="80" cy="50" r="0.9"/><circle cx="200" cy="80" r="1"/>
            <circle cx="340" cy="40" r="0.8"/><circle cx="500" cy="70" r="0.9"/>
            <circle cx="640" cy="90" r="1"/><circle cx="730" cy="50" r="0.8"/>
          </g>
          <!-- The hill of Gibeon — silhouette altar on a high place -->
          <path d="M 0 320 Q 200 280 400 290 Q 600 280 800 320 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 380 Q 400 360 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Altar (smoke still rising from the day's sacrifice) -->
          <g transform="translate(140 360)">
            <rect x="-26" y="-20" width="52" height="22" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <ellipse cx="0" cy="-32" rx="8" ry="14" fill="rgba(254,243,199,0.22)"/>
            <ellipse cx="0" cy="-50" rx="12" ry="20" fill="rgba(254,243,199,0.12)"/>
          </g>
          <!-- Solomon asleep on a low mat, head propped, royal robe -->
          <g transform="translate(440 400)">
            <!-- Mat -->
            <rect x="-80" y="0" width="180" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <!-- Body lying -->
            <ellipse cx="20" cy="-6" rx="90" ry="14" fill="#3d2a5e" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <!-- Head propped -->
            <ellipse cx="-58" cy="-14" rx="14" ry="16" fill="#1a1233"/>
            <!-- Beard (young, short) -->
            <path d="M -64 -8 Q -58 0 -52 -8" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/>
            <!-- Eyes closed -->
            <line x1="-62" y1="-16" x2="-58" y2="-16" stroke="rgba(254,243,199,0.55)" stroke-width="0.8"/>
            <line x1="-54" y1="-16" x2="-50" y2="-16" stroke="rgba(254,243,199,0.55)" stroke-width="0.8"/>
            <!-- Crown beside him -->
            <g transform="translate(-92 6)">
              <path d="M -10 0 L -7 -8 L -3 -2 L 0 -10 L 3 -2 L 7 -8 L 10 0 Z" fill="rgba(251,191,36,0.85)" stroke="#fef3c7" stroke-width="0.5"/>
            </g>
          </g>
          <!-- Dream cloud above Solomon — the Lord speaking -->
          <g transform="translate(440 220)">
            <ellipse cx="0" cy="0" rx="180" ry="60" fill="rgba(254,243,199,0.18)"/>
            <ellipse cx="0" cy="0" rx="140" ry="44" fill="rgba(254,243,199,0.28)"/>
            <ellipse cx="0" cy="0" rx="100" ry="32" fill="rgba(254,243,199,0.42)"/>
            <!-- Three rays of pure light from the cloud down to Solomon -->
            <line x1="-40" y1="32" x2="-40" y2="170" stroke="rgba(254,243,199,0.45)" stroke-width="2"/>
            <line x1="0"   y1="36" x2="0"   y2="170" stroke="rgba(254,243,199,0.55)" stroke-width="2.5"/>
            <line x1="40"  y1="32" x2="40"  y2="170" stroke="rgba(254,243,199,0.45)" stroke-width="2"/>
            <!-- Sacred text within the cloud -->
            <text x="0" y="0" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3" fill="rgba(251,191,36,0.9)">ASK · WHATEVER · YOU · WANT</text>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Give your servant a discerning heart"</text>
        </svg>`
      },
      {
        id: 'two-mothers',
        title: 'The Two Mothers',
        scriptureRef: '1 Kings 3:16-22',
        bibleText: '"During the night this woman’s son died because she lay on him. So she got up in the middle of the night and took my son from my side while I was asleep. She put him by her breast and put her dead son by my breast."',
        narration: 'Two prostitutes living under the same roof brought their case before the king — and a court that had just heard a hundred trade disputes and tax cases held its breath. Both had given birth within three days of each other. One baby had died in the night. The grieving mother — they both said the other one — had switched the babies in the dark. Now each woman was insisting the living baby was hers. There were no other witnesses. No DNA. No evidence. Just two women shouting and one small baby in a blanket.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'slt', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Throne room — heavy columns -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1">
            <rect x="40" y="60" width="36" height="380"/>
            <rect x="724" y="60" width="36" height="380"/>
            <rect x="34" y="44" width="48" height="20" fill="#3d2a16"/>
            <rect x="718" y="44" width="48" height="20" fill="#3d2a16"/>
          </g>
          <!-- Floor with a tile pattern -->
          <g fill="#241846" stroke="rgba(251,191,36,0.3)" stroke-width="0.6">
            <rect x="0" y="380" width="800" height="120"/>
            <line x1="0"   y1="410" x2="800" y2="410"/>
            <line x1="0"   y1="440" x2="800" y2="440"/>
            <line x1="0"   y1="470" x2="800" y2="470"/>
          </g>
          <!-- Throne dais on the back wall -->
          <g fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2">
            <path d="M 340 320 L 460 320 L 470 380 L 330 380 Z"/>
          </g>
          <!-- Solomon on throne, listening, hand to chin -->
          <g transform="translate(400 310)">
            <rect x="-30" y="-44" width="60" height="40" fill="#3d2a5e" stroke="rgba(251,191,36,0.6)" stroke-width="1"/>
            <ellipse cx="0" cy="-20" rx="18" ry="24" fill="#1a1233"/>
            <ellipse cx="0" cy="-50" rx="13" ry="15" fill="#1a1233"/>
            <!-- Beard (young) -->
            <path d="M -8 -42 Q 0 -32 8 -42" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Hand to chin (thinking) -->
            <line x1="6" y1="-30" x2="2" y2="-42" stroke="#1a1233" stroke-width="3"/>
            <!-- Crown -->
            <path d="M -12 -62 L -8 -72 L -3 -64 L 0 -74 L 3 -64 L 8 -72 L 12 -62 Z" fill="rgba(251,191,36,0.95)"/>
            <!-- Halo -->
            <circle cx="0" cy="-50" r="24" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
          </g>
          <!-- Mother A on the left — pointing, agitated -->
          <g transform="translate(220 400)">
            <path d="M -22 0 Q -18 -50 0 -60 Q 18 -50 22 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -10 -76 Q 0 -86 10 -76" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="rgba(254,243,199,0.15)"/>
            <!-- Pointing finger toward the baby -->
            <line x1="18" y1="-36" x2="50" y2="-20" stroke="#1a1233" stroke-width="4"/>
            <circle cx="50" cy="-20" r="2.5" fill="#1a1233"/>
          </g>
          <!-- Mother B on the right — clutching baby, head turned away -->
          <g transform="translate(580 400)">
            <path d="M -22 0 Q -18 -50 0 -60 Q 18 -50 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -10 -76 Q 0 -86 10 -76" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="rgba(254,243,199,0.15)"/>
            <!-- Arms cradling baby -->
            <path d="M -22 -40 Q 0 -50 22 -40" stroke="#3d2a16" stroke-width="5" fill="none"/>
            <ellipse cx="0" cy="-42" rx="14" ry="7" fill="#fef3c7"/>
            <ellipse cx="0" cy="-44" rx="5" ry="4" fill="#fef3c7"/>
            <circle cx="0" cy="-44" r="14" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
          </g>
          <!-- A small bundle on the floor — the dead baby, swaddled, beside Mother A -->
          <g transform="translate(220 440)">
            <ellipse cx="0" cy="0" rx="24" ry="9" fill="rgba(254,243,199,0.55)"/>
            <ellipse cx="0" cy="-2" rx="7" ry="5" fill="rgba(254,243,199,0.55)"/>
            <!-- Faded halo (sorrow, not divine) -->
            <circle cx="0" cy="-2" r="12" fill="none" stroke="rgba(254,243,199,0.25)" stroke-width="0.8" stroke-dasharray="2 3"/>
          </g>
          <text x="400" y="490" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"He’s mine!" · "No · he’s mine!"</text>
        </svg>`
      },
      {
        id: 'sword',
        title: 'Cut the Baby in Two',
        scriptureRef: '1 Kings 3:23-25',
        bibleText: '"Cut the living child in two and give half to one and half to the other."',
        narration: 'The room went absolutely silent. Solomon’s voice was very even. "Bring me a sword." The captain of the guard drew his sword and stepped forward, looking sick. The young king did not blink. "Cut the living baby in two. Give half to the one. Half to the other." It was the most outrageous thing anyone had ever heard a king say. The captain raised the blade. Both women had to make a choice in the next two seconds — and only one of them could afford to make the right one.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sls', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#3d2a16', stars:false})}
          <!-- Dramatic vertical light from above on the table -->
          <radialGradient id="slsLight" cx="0.5" cy="0.4" r="0.45">
            <stop offset="0%"  stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.15)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="280" rx="280" ry="180" fill="url(#slsLight)"/>
          <!-- A low table -->
          <g>
            <rect x="280" y="320" width="240" height="20" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <rect x="280" y="338" width="240" height="14" fill="#241846"/>
          </g>
          <!-- The baby on the table, swaddled, vulnerable -->
          <g transform="translate(400 320)">
            <ellipse cx="0" cy="0" rx="38" ry="14" fill="#fef3c7"/>
            <ellipse cx="0" cy="-2" rx="10" ry="7" fill="#fef3c7"/>
            <!-- Tiny halo of innocence -->
            <circle cx="0" cy="-2" r="18" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- Solider raising sword over the baby (right side) -->
          <g transform="translate(560 370)">
            <ellipse cx="0" cy="0" rx="14" ry="40" fill="#1a1233"/>
            <ellipse cx="0" cy="-42" rx="11" ry="13" fill="#1a1233"/>
            <!-- Helmet -->
            <path d="M -12 -50 Q 0 -64 12 -50 Z" fill="rgba(251,113,38,0.8)" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <!-- Both arms raised over head, sword vertical pointing down at baby -->
            <line x1="-14" y1="-30" x2="-30" y2="-60" stroke="#1a1233" stroke-width="6"/>
            <line x1="14"  y1="-30" x2="30" y2="-60" stroke="#1a1233" stroke-width="6"/>
            <line x1="-30" y1="-60" x2="30" y2="-60" stroke="#3d2a16" stroke-width="3"/>
            <!-- Sword blade extending UP from joined hands (about to fall) -->
            <polygon points="-2,-60 2,-60 0,-140" fill="rgba(254,243,199,0.95)" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <line x1="-10" y1="-62" x2="10" y2="-62" stroke="#3d2a16" stroke-width="3"/>
          </g>
          <!-- True mother (left) — both arms thrown forward in horror, body lunging -->
          <g transform="translate(220 400)">
            <path d="M -24 0 Q -22 -56 0 -64 Q 22 -56 24 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-74" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -10 -80 Q 0 -90 10 -80" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="rgba(254,243,199,0.15)"/>
            <!-- Mouth open in scream -->
            <ellipse cx="0" cy="-69" rx="3" ry="4" fill="rgba(254,243,199,0.7)"/>
            <!-- Both arms thrown forward toward the baby -->
            <line x1="22" y1="-40" x2="80" y2="-30" stroke="#3d2a5e" stroke-width="6"/>
            <line x1="22" y1="-32" x2="80" y2="-22" stroke="#3d2a5e" stroke-width="6"/>
            <!-- Halo (bright — she is the true mother) -->
            <circle cx="0" cy="-74" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- False mother (further right, partly behind soldier) — arms crossed, satisfied -->
          <g transform="translate(680 400)">
            <path d="M -22 0 Q -18 -50 0 -60 Q 18 -50 22 0 Z" fill="#3d2a16" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <!-- Arms crossed -->
            <path d="M -14 -36 Q 0 -28 14 -36" stroke="#3d2a16" stroke-width="6" fill="none"/>
          </g>
          <!-- Solomon, far back-center, watching -->
          <g transform="translate(400 220)" opacity="0.7">
            <ellipse cx="0" cy="0" rx="11" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-22" rx="10" ry="12" fill="#1a1233"/>
            <path d="M -8 -54 L -4 -62 L 0 -56 L 4 -62 L 8 -54 Z" fill="rgba(251,191,36,0.6)"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Bring me a sword"</text>
        </svg>`
      },
      {
        id: 'true-mother',
        title: 'The Mother is Revealed',
        scriptureRef: '1 Kings 3:26-28',
        bibleText: '"Please, my lord, give her the living baby! Don’t kill him!" …The king gave his ruling: "Give the living baby to the first woman. Do not kill him; she is his mother." When all Israel heard the verdict the king had given, they were in awe of him.',
        narration: '"Please, my lord," cried the true mother, "give her the baby. Just don’t kill him." The other woman shrugged and said, "Cut him in two. Neither of us will have him." Solomon raised one hand. "Stop. Give the living baby to the first woman. Do not kill him. She is his mother." All Israel heard about the verdict. They were in awe. They saw that the wisdom of God was in him to administer justice. He was barely twenty years old. He had only ruled the kingdom for a few months. And he had just made his first great judgment by listening — not to the words people said, but to the love that came out of one of them and could not come out of the other.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sltm', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <!-- Calm warm light filling the room — verdict has been spoken -->
          <radialGradient id="sltGlow" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0%"  stop-color="rgba(254,243,199,0.5)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.18)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="280" rx="380" ry="220" fill="url(#sltGlow)"/>
          <!-- Floor -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- Solomon, smiling slightly, on the throne, scepter laid across his lap -->
          <g transform="translate(400 360)">
            <path d="M -40 40 L 40 40 L 32 -10 L -32 -10 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="1.4"/>
            <rect x="-32" y="-40" width="64" height="40" fill="#3d2a5e" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <ellipse cx="0" cy="-18" rx="18" ry="24" fill="#1a1233"/>
            <ellipse cx="0" cy="-46" rx="13" ry="15" fill="#1a1233"/>
            <path d="M -8 -38 Q 0 -28 8 -38" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- A tiny upturn at the mouth (smile) -->
            <path d="M -3 -34 Q 0 -32 3 -34" stroke="rgba(254,243,199,0.65)" stroke-width="1" fill="none"/>
            <!-- Scepter across lap -->
            <line x1="-30" y1="6" x2="30" y2="6" stroke="rgba(251,191,36,0.85)" stroke-width="3"/>
            <circle cx="30" cy="6" r="4" fill="rgba(251,191,36,0.95)"/>
            <!-- Crown -->
            <path d="M -12 -58 L -8 -68 L -3 -60 L 0 -70 L 3 -60 L 8 -68 L 12 -58 Z" fill="rgba(251,191,36,0.95)"/>
            <!-- Big halo of wisdom -->
            <circle cx="0" cy="-46" r="28" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-46" r="40" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          </g>
          <!-- True mother kneeling, receiving baby from a servant -->
          <g transform="translate(220 410)">
            <!-- Kneeling body -->
            <ellipse cx="0" cy="0" rx="24" ry="9" fill="#3d2a5e"/>
            <path d="M -16 0 Q -14 -36 0 -42 Q 14 -36 16 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="0" cy="-52" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -10 -58 Q 0 -68 10 -58" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="rgba(254,243,199,0.15)"/>
            <!-- Arms outstretched up to receive -->
            <line x1="-12" y1="-30" x2="-26" y2="-50" stroke="#3d2a5e" stroke-width="5"/>
            <line x1="12"  y1="-30" x2="26" y2="-50" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Halo big and bright -->
            <circle cx="0" cy="-52" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- The baby in the servant's hands, being lowered to true mother -->
          <g transform="translate(220 354)">
            <ellipse cx="0" cy="0" rx="22" ry="8" fill="#fef3c7"/>
            <ellipse cx="0" cy="-2" rx="6" ry="4" fill="#fef3c7"/>
            <!-- Servant's hands holding -->
            <line x1="-22" y1="0" x2="-30" y2="-14" stroke="#1a1233" stroke-width="3"/>
            <line x1="22"  y1="0" x2="30" y2="-14" stroke="#1a1233" stroke-width="3"/>
            <circle cx="0" cy="-2" r="14" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.3"/>
          </g>
          <!-- False mother walking AWAY in the background, head lowered -->
          <g transform="translate(620 410)" opacity="0.55">
            <path d="M -20 0 Q -18 -44 0 -54 Q 18 -44 20 0 Z" fill="#3d2a16"/>
            <ellipse cx="0" cy="-62" rx="11" ry="13" fill="#1a1233"/>
          </g>
          <!-- Crowd watching at the back — small silhouettes -->
          <g fill="#0a0d1a" opacity="0.6">
            <g transform="translate(60 410)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(90 414)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(720 412)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(750 416)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"She is his mother" · all Israel was in awe</text>
        </svg>`
      }
    ],
    closing: 'Solomon’s wisdom was not strategy or cleverness. It was discernment — the ability to listen for what could not be faked. The false mother could perform every word the right answer required. The true mother gave herself away in the only way that matters: she would rather lose her child than see him hurt. That kind of love can be heard, even by a twenty-year-old king. Ask the Lord, like Solomon did, for a heart that can tell the difference. Long life, riches, and honor will likely follow you anyway — but the wisdom is the gift.',
    closingPrompt: 'Where in your life do you need discernment more than you need a clever plan — and what would it look like, this week, to ask the Lord for a "discerning heart" first?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 19 — Baptism of Jesus & The Temptation
  // ════════════════════════════════════════════════════════════
  {
    id: 'baptism-temptation',
    title: 'Baptism & Temptation',
    subtitle: 'Heaven splits open. Then the wilderness.',
    icon: '🕊️',
    color: '#38bdf8',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Matthew 3-4',
    duration: '~6 min',
    scenes: [
      {
        id: 'jordan-preacher',
        title: 'A Voice in the Wilderness',
        scriptureRef: 'Matthew 3:1-6',
        bibleText: '"Repent, for the kingdom of heaven has come near."',
        narration: 'For four hundred years there had been no prophet. Then one came roaring out of the Judean desert in camel-hair clothing and a leather belt, eating locusts and wild honey. His name was John. He stood waist-deep in the Jordan River and shouted one sentence in everyone\'s direction: "Repent — the kingdom of heaven has come near." All Judea came down to him. They confessed their sins and he buried them under the water and lifted them out clean. He was not the One. He was getting the road ready.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'jbp', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <ellipse cx="660" cy="100" r="34" fill="#fef3c7"/>
          <ellipse cx="660" cy="100" r="50" fill="rgba(251,191,36,0.4)"/>
          <!-- Wilderness hills -->
          <path d="M 0 280 Q 200 250 400 270 Q 600 250 800 280 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- The Jordan winding through -->
          <path d="M 80 380 Q 200 360 320 380 Q 440 400 560 380 Q 680 360 800 380 L 800 440 Q 680 420 560 440 Q 440 460 320 440 Q 200 420 80 440 Z" fill="#1e1846" stroke="rgba(56,189,248,0.65)" stroke-width="1.2"/>
          <g fill="rgba(254,243,199,0.55)">
            <ellipse cx="180" cy="395" rx="18" ry="2"/>
            <ellipse cx="360" cy="412" rx="20" ry="2"/>
            <ellipse cx="540" cy="402" rx="18" ry="2"/>
            <ellipse cx="680" cy="395" rx="16" ry="2"/>
          </g>
          <!-- Banks (sandy) -->
          <path d="M 0 440 Q 200 430 400 442 Q 600 430 800 440 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <!-- John waist-deep, arm raised, shouting -->
          <g transform="translate(420 400)">
            <ellipse cx="0" cy="0" rx="14" ry="20" fill="#3d2a16"/>
            <ellipse cx="0" cy="-26" rx="11" ry="13" fill="#1a1233"/>
            <!-- Wild hair + beard -->
            <path d="M -12 -32 Q -16 -44 -8 -42 M -4 -34 Q -4 -50 0 -46 M 4 -34 Q 4 -50 8 -46 M 12 -32 Q 16 -44 8 -42" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <path d="M -8 -20 Q 0 -8 8 -20" stroke="rgba(254,243,199,0.55)" stroke-width="1.5" fill="none"/>
            <!-- Raised arm -->
            <line x1="10" y1="-12" x2="28" y2="-46" stroke="#3d2a16" stroke-width="5"/>
            <!-- Halo -->
            <circle cx="0" cy="-26" r="18" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1"/>
          </g>
          <!-- Crowds on bank, listening -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(120 430)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(160 432)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(200 430)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(240 432)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(620 432)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(660 430)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
            <g transform="translate(700 432)"><ellipse cx="0" cy="0" rx="6" ry="18"/><ellipse cx="0" cy="-20" rx="5" ry="6"/></g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Prepare the way of the Lord"</text>
        </svg>`
      },
      {
        id: 'baptism',
        title: 'The Dove and the Voice',
        scriptureRef: 'Matthew 3:13-17',
        bibleText: '"This is my Son, whom I love; with him I am well pleased."',
        narration: 'Then Jesus walked down from Galilee — eighty miles on foot — and stood in line with the sinners on the riverbank. John saw him and tried to refuse. "I need to be baptized by you, and you come to me?" Jesus said, "Let it be so for now. It is fitting for us to fulfill all righteousness." So John buried him under the water and lifted him out again — and the heavens split open. The Spirit of God came down on him in the bodily form of a dove. And a voice from the sky said, in a way nobody who heard it ever forgot: "This is my beloved Son. In him I am well pleased."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="bptSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fef3c7"/>
              <stop offset="40%" stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#a78bfa"/>
            </linearGradient>
            <radialGradient id="bptOpening" cx="0.5" cy="0.05" r="0.6">
              <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="60%" stop-color="rgba(251,191,36,0.35)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#bptSky)"/>
          <!-- Heavens torn open at the top -->
          <ellipse cx="400" cy="40" rx="400" ry="120" fill="url(#bptOpening)"/>
          <polygon points="320,0 360,160 440,160 480,0" fill="rgba(254,243,199,0.55)"/>
          <!-- Beam of light down to Jesus -->
          <polygon points="380,0 360,420 440,420 420,0" fill="rgba(254,243,199,0.35)"/>
          <!-- Dove descending -->
          <g transform="translate(400 180)">
            <ellipse cx="0" cy="0" rx="16" ry="9" fill="#fef3c7"/>
            <ellipse cx="-10" cy="-2" rx="5" ry="4" fill="#fef3c7"/>
            <path d="M -14 0 Q -28 -8 -32 4" stroke="rgba(254,243,199,0.9)" stroke-width="3" fill="rgba(254,243,199,0.55)"/>
            <path d="M 14 0 Q 28 -8 32 4"   stroke="rgba(254,243,199,0.9)" stroke-width="3" fill="rgba(254,243,199,0.55)"/>
            <circle cx="0" cy="0" r="24" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <!-- Jordan river surface -->
          <path d="M 0 380 Q 200 360 400 380 Q 600 360 800 380 L 800 460 Q 600 444 400 462 Q 200 444 0 460 Z" fill="#1e1846" stroke="rgba(56,189,248,0.7)" stroke-width="1.2"/>
          <!-- Three concentric ripples around Jesus -->
          <g fill="none" stroke="rgba(254,243,199,0.7)" stroke-width="1.2">
            <ellipse cx="400" cy="420" rx="80"  ry="6"/>
            <ellipse cx="400" cy="424" rx="110" ry="8"/>
            <ellipse cx="400" cy="428" rx="140" ry="10"/>
          </g>
          <!-- Jesus rising from water, arms slightly lifted -->
          <g transform="translate(400 410)">
            <ellipse cx="0" cy="0" rx="13" ry="16" fill="#3d2a16"/>
            <ellipse cx="0" cy="-22" rx="14" ry="22" fill="#3d2a16"/>
            <ellipse cx="0" cy="-52" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -44 Q 0 -32 8 -44" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Long hair hint -->
            <path d="M -10 -52 Q -16 -38 -12 -22 M 10 -52 Q 16 -38 12 -22" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Arms slightly raised, palms open -->
            <line x1="-12" y1="-22" x2="-30" y2="-16" stroke="#3d2a16" stroke-width="5"/>
            <line x1="12"  y1="-22" x2="30"  y2="-16" stroke="#3d2a16" stroke-width="5"/>
            <!-- Bright halo -->
            <circle cx="0" cy="-52" r="28" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-52" r="42" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          </g>
          <!-- John on the right, hand lifted in baptism gesture -->
          <g transform="translate(490 405)">
            <ellipse cx="0" cy="0" rx="11" ry="20" fill="#3d2a16"/>
            <ellipse cx="0" cy="-22" rx="10" ry="12" fill="#1a1233"/>
            <path d="M -9 -28 Q -12 -38 -4 -36 M 4 -36 Q 12 -38 9 -28" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <line x1="-10" y1="-12" x2="-22" y2="-2" stroke="#3d2a16" stroke-width="4"/>
            <circle cx="0" cy="-22" r="14" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"This is my beloved Son"</text>
        </svg>`
      },
      {
        id: 'wilderness',
        title: 'Forty Days Alone',
        scriptureRef: 'Matthew 4:1-2',
        bibleText: '"Then Jesus was led by the Spirit into the wilderness to be tempted by the devil. After fasting forty days and forty nights, he was hungry."',
        narration: 'The same Spirit that had just descended on him in the form of a dove now drove him out into the wilderness — the bone-dry, scorpion-haunted ravines south of Jericho. He fasted for forty days. He prayed for forty days. He did not eat. At the end of it, the man God himself had called beloved was thin and weak and famished. And that is the moment the enemy chose to walk in.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="wldSun" cx="0.7" cy="0.2" r="0.7">
              <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="35%" stop-color="rgba(251,113,38,0.5)"/>
              <stop offset="100%" stop-color="rgba(251,113,38,0)"/>
            </radialGradient>
            <linearGradient id="wldSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fb923c"/>
              <stop offset="60%" stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#3d2a16"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#wldSky)"/>
          <ellipse cx="620" cy="100" rx="240" ry="200" fill="url(#wldSun)"/>
          <circle cx="620" cy="100" r="36" fill="#fef3c7"/>
          <!-- Rocky barren desert -->
          <path d="M 0 320 Q 200 300 400 320 Q 600 300 800 320 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- Scattered boulders -->
          <g fill="#1a1233" stroke="rgba(254,243,199,0.3)" stroke-width="0.6">
            <ellipse cx="120" cy="410" rx="32" ry="14"/>
            <ellipse cx="180" cy="425" rx="22" ry="10"/>
            <ellipse cx="700" cy="415" rx="34" ry="14"/>
            <ellipse cx="650" cy="430" rx="20" ry="9"/>
            <ellipse cx="280" cy="438" rx="14" ry="6"/>
            <ellipse cx="540" cy="436" rx="18" ry="7"/>
          </g>
          <!-- Bone-dry cracked ground texture -->
          <g stroke="rgba(251,113,38,0.4)" stroke-width="0.7" fill="none">
            <path d="M 60 430 L 100 436 L 130 432"/>
            <path d="M 220 442 L 260 446 L 290 442"/>
            <path d="M 480 444 L 520 448 L 560 444"/>
            <path d="M 720 432 L 760 436 L 790 432"/>
          </g>
          <!-- Jesus kneeling alone in center, gaunt -->
          <g transform="translate(400 420)">
            <ellipse cx="0" cy="0" rx="22" ry="14" fill="#3d2a16"/>
            <ellipse cx="0" cy="-22" rx="14" ry="22" fill="#3d2a16"/>
            <ellipse cx="0" cy="-52" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -8 -44 Q 0 -32 8 -44" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -52 Q -16 -38 -12 -22 M 10 -52 Q 16 -38 12 -22" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Bowed head, hands clasped -->
            <ellipse cx="0" cy="-30" rx="5" ry="3" fill="#0a0d1a"/>
            <!-- Halo (dimmer than baptism — under trial) -->
            <circle cx="0" cy="-52" r="22" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- "40 DAYS" tally on a rock -->
          <g transform="translate(120 400)">
            <g stroke="rgba(254,243,199,0.7)" stroke-width="1.2">
              <line x1="-22" y1="-4" x2="-22" y2="4"/>
              <line x1="-18" y1="-4" x2="-18" y2="4"/>
              <line x1="-14" y1="-4" x2="-14" y2="4"/>
              <line x1="-10" y1="-4" x2="-10" y2="4"/>
              <line x1="-20" y1="0"  x2="-8"  y2="0"/>
              <line x1="-4" y1="-4" x2="-4" y2="4"/>
              <line x1="0" y1="-4" x2="0" y2="4"/>
              <line x1="4" y1="-4" x2="4" y2="4"/>
              <line x1="8" y1="-4" x2="8" y2="4"/>
              <line x1="-2" y1="0" x2="10" y2="0"/>
            </g>
            <text x="22" y="3" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="rgba(254,243,199,0.7)">+ 30 MORE</text>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Forty days and forty nights · he was hungry"</text>
        </svg>`
      },
      {
        id: 'three-temptations',
        title: 'It Is Written',
        scriptureRef: 'Matthew 4:3-11',
        bibleText: '"Man shall not live on bread alone, but on every word that comes from the mouth of God."',
        narration: 'Three offers. Tell these stones to become bread — meet your need on your own terms. Throw yourself from the temple — make God prove He loves you with a spectacle. Bow down to me and I will give you every kingdom in the world — skip the cross, take the crown. Three times Jesus answered the same way: It is written. It is written. It is written. The devil left. Angels came and brought him bread. He had won the test that the first Adam lost — and the road to the cross was now open.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'tmp', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <g fill="#fef3c7" opacity="0.5">
            <circle cx="80" cy="50" r="0.8"/><circle cx="240" cy="80" r="0.9"/>
            <circle cx="420" cy="40" r="0.7"/><circle cx="580" cy="70" r="0.8"/>
          </g>
          <!-- Three-panel triptych dividers -->
          <line x1="266" y1="40" x2="266" y2="400" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          <line x1="534" y1="40" x2="534" y2="400" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          <!-- PANEL 1 — Stones to Bread -->
          <g>
            <text x="133" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.75)">BREAD</text>
            <!-- Pile of stones -->
            <g fill="#3d2a16" stroke="rgba(254,243,199,0.5)" stroke-width="0.7">
              <ellipse cx="100" cy="320" rx="18" ry="9"/>
              <ellipse cx="130" cy="316" rx="20" ry="10"/>
              <ellipse cx="165" cy="324" rx="18" ry="9"/>
              <ellipse cx="115" cy="304" rx="16" ry="7"/>
              <ellipse cx="148" cy="302" rx="14" ry="7"/>
            </g>
            <!-- Faint loaf glow (rejected) -->
            <ellipse cx="133" cy="312" rx="34" ry="14" fill="none" stroke="rgba(254,243,199,0.18)" stroke-width="0.8" stroke-dasharray="3 4"/>
          </g>
          <!-- PANEL 2 — Pinnacle of Temple -->
          <g>
            <text x="400" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.75)">PINNACLE</text>
            <!-- Temple silhouette with high pinnacle -->
            <g fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1">
              <rect x="340" y="220" width="120" height="160"/>
              <rect x="334" y="200" width="132" height="20"/>
              <!-- Pinnacle/tower -->
              <rect x="386" y="120" width="28" height="80"/>
              <rect x="382" y="110" width="36" height="12"/>
            </g>
            <!-- Tiny figure on pinnacle -->
            <g transform="translate(400 110)">
              <ellipse cx="0" cy="-4" rx="3" ry="6" fill="#1a1233"/>
              <ellipse cx="0" cy="-12" rx="2.5" ry="3" fill="#1a1233"/>
              <circle cx="0" cy="-12" r="5" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            </g>
            <!-- Dashed downward arrow (the temptation to leap) -->
            <line x1="400" y1="130" x2="400" y2="350" stroke="rgba(248,113,113,0.55)" stroke-width="1.2" stroke-dasharray="3 5"/>
            <polygon points="395,350 405,350 400,360" fill="rgba(248,113,113,0.55)"/>
          </g>
          <!-- PANEL 3 — Mountain Kingdoms -->
          <g>
            <text x="667" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.75)">KINGDOMS</text>
            <!-- Mountain peak with kingdoms below -->
            <polygon points="667,140 600,360 734,360" fill="#1a1233" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <!-- City silhouettes at base -->
            <g fill="#241846" stroke="rgba(251,191,36,0.4)" stroke-width="0.5">
              <rect x="556" y="360" width="14" height="20"/>
              <polygon points="554,360 563,352 572,360"/>
              <rect x="574" y="360" width="12" height="20"/>
              <rect x="746" y="360" width="14" height="20"/>
              <polygon points="744,360 753,352 762,360"/>
              <rect x="764" y="360" width="12" height="20"/>
              <rect x="780" y="360" width="14" height="20"/>
            </g>
            <!-- Figure on summit (offering) -->
            <g transform="translate(667 140)">
              <ellipse cx="0" cy="0" rx="6" ry="14" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-16" rx="5" ry="6" fill="#0a0d1a"/>
              <line x1="-6" y1="-8" x2="-22" y2="-12" stroke="#0a0d1a" stroke-width="2"/>
              <line x1="6"  y1="-8" x2="22" y2="-12" stroke="#0a0d1a" stroke-width="2"/>
            </g>
          </g>
          <!-- Jesus across the bottom, walking past all three, scripture scroll in hand -->
          <g transform="translate(400 440)">
            <ellipse cx="0" cy="0" rx="14" ry="22" fill="#3d2a16"/>
            <ellipse cx="0" cy="-26" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -8 -18 Q 0 -6 8 -18" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -26 Q -16 -12 -12 4 M 10 -26 Q 16 -12 12 4" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Scroll in hand -->
            <rect x="14" y="-12" width="18" height="10" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <line x1="14" y1="-12" x2="14" y2="-2" stroke="#3d2a16" stroke-width="1.5"/>
            <line x1="32" y1="-12" x2="32" y2="-2" stroke="#3d2a16" stroke-width="1.5"/>
            <text x="23" y="-4" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="5" fill="#3d2a16">IT IS WRITTEN</text>
            <circle cx="0" cy="-26" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <text x="400" y="490" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"It is written · it is written · it is written"</text>
        </svg>`
      }
    ],
    closing: 'Jesus did not face the wilderness with secret divine cheat codes. He faced it the same way you and I are invited to: He stayed full of the Father\'s pleasure ("my beloved Son"), he stayed full of Scripture ("it is written"), and he refused to short-circuit obedience for the shortcut. The voice from heaven came BEFORE the testing. You are loved by God before you are tested by life — not after you pass. Stand on that fact when the offers come.',
    closingPrompt: 'Which of the three temptations — solve it yourself, demand proof, take the shortcut — most often shows up in your life, and what verse could you have ready the next time it does?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 20 — Sermon on the Mount
  // ════════════════════════════════════════════════════════════
  {
    id: 'sermon-mount',
    title: 'Sermon on the Mount',
    subtitle: 'The longest recorded teaching of Jesus — and the kingdom turned upside down.',
    icon: '⛰️',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Matthew 5-7',
    duration: '~7 min',
    scenes: [
      {
        id: 'mount-crowd',
        title: 'The Hillside Above Galilee',
        scriptureRef: 'Matthew 5:1-2',
        bibleText: '"Now when Jesus saw the crowds, he went up on a mountainside and sat down. His disciples came to him, and he began to teach them."',
        narration: 'Word about the new rabbi from Nazareth had spread fast. They came from Jerusalem and Judea, from Galilee, from across the Jordan, even from the pagan cities of the Decapolis. Whole families. The sick on stretchers. Day-laborers who had walked through the night to be there at sunrise. Jesus looked at the crowd on the lakeshore — too many, too pressed — and climbed up the green grassy hillside above the Sea of Galilee. He sat down. The disciples gathered close. The crowd settled around them like wheat. And he began to teach.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'smc', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <ellipse cx="640" cy="120" r="36" fill="#fef3c7"/>
          <ellipse cx="640" cy="120" r="54" fill="rgba(251,191,36,0.4)"/>
          <!-- Sea of Galilee in the distance, lower-right -->
          <path d="M 0 360 Q 200 340 400 360 Q 600 340 800 360 L 800 410 Q 600 396 400 412 Q 200 396 0 410 Z" fill="#1e1846" stroke="rgba(56,189,248,0.55)" stroke-width="1"/>
          <g fill="rgba(254,243,199,0.45)">
            <ellipse cx="200" cy="385" rx="22" ry="2"/>
            <ellipse cx="440" cy="392" rx="24" ry="2"/>
            <ellipse cx="640" cy="385" rx="22" ry="2"/>
          </g>
          <!-- Hillside rising from left to upper-right -->
          <path d="M 0 410 Q 200 360 400 320 Q 600 280 800 240 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 430 Q 200 390 400 360 Q 600 330 800 290 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.18)"/>
          <!-- Grass tuft hints -->
          <g stroke="rgba(34,197,94,0.6)" stroke-width="1" fill="none">
            <line x1="120" y1="440" x2="118" y2="430"/>
            <line x1="124" y1="440" x2="126" y2="432"/>
            <line x1="220" y1="420" x2="218" y2="410"/>
            <line x1="224" y1="420" x2="226" y2="412"/>
            <line x1="320" y1="400" x2="318" y2="392"/>
            <line x1="324" y1="400" x2="326" y2="392"/>
          </g>
          <!-- Jesus seated high on the hillside, glowing -->
          <g transform="translate(560 290)">
            <path d="M -22 0 Q -18 -38 0 -50 Q 18 -38 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-60" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -52 Q 0 -40 8 -52" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -60 Q -16 -46 -12 -32 M 10 -60 Q 16 -46 12 -32" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <circle cx="0" cy="-60" r="28" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-60" r="42" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          </g>
          <!-- Inner circle of disciples around him -->
          <g fill="#0a0d1a" opacity="0.9">
            <g transform="translate(490 320)"><ellipse cx="0" cy="0" rx="9" ry="6"/><ellipse cx="0" cy="-8" rx="6" ry="7"/></g>
            <g transform="translate(620 320)"><ellipse cx="0" cy="0" rx="9" ry="6"/><ellipse cx="0" cy="-8" rx="6" ry="7"/></g>
            <g transform="translate(530 340)"><ellipse cx="0" cy="0" rx="9" ry="6"/><ellipse cx="0" cy="-8" rx="6" ry="7"/></g>
            <g transform="translate(590 340)"><ellipse cx="0" cy="0" rx="9" ry="6"/><ellipse cx="0" cy="-8" rx="6" ry="7"/></g>
          </g>
          <!-- Crowd spread out down the hillside in concentric arcs (small dots) -->
          <g fill="#0a0d1a" opacity="0.7">
            <circle cx="80" cy="450" r="5"/><circle cx="140" cy="440" r="5"/>
            <circle cx="200" cy="430" r="5"/><circle cx="260" cy="420" r="5"/>
            <circle cx="320" cy="410" r="5"/><circle cx="380" cy="400" r="5"/>
            <circle cx="100" cy="470" r="5"/><circle cx="180" cy="460" r="5"/>
            <circle cx="260" cy="450" r="5"/><circle cx="340" cy="440" r="5"/>
            <circle cx="420" cy="430" r="5"/><circle cx="500" cy="420" r="5"/>
            <circle cx="60" cy="490" r="5"/><circle cx="140" cy="485" r="5"/>
            <circle cx="220" cy="480" r="5"/><circle cx="300" cy="475" r="5"/>
            <circle cx="380" cy="470" r="5"/><circle cx="460" cy="460" r="5"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">A grassy slope above the Sea of Galilee</text>
        </svg>`
      },
      {
        id: 'beatitudes',
        title: 'Blessed Are the…',
        scriptureRef: 'Matthew 5:3-12',
        bibleText: '"Blessed are the poor in spirit, for theirs is the kingdom of heaven."',
        narration: 'He started in the strangest possible place. Blessed are the poor in spirit. Blessed are the ones who mourn. Blessed are the meek, the hungry for righteousness, the merciful, the pure in heart, the peacemakers, and the persecuted. Nine times in a row, every category the world calls a loser, Jesus called blessed. He was not handing out consolation prizes. He was telling the truth about who actually gets the kingdom. The world bets on the wrong people. Heaven is rigged in favor of the ones the world has overlooked.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'smb', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Soft radiant glow behind Jesus -->
          <radialGradient id="smbHalo" cx="0.5" cy="0.5" r="0.55">
            <stop offset="0%" stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.2)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="250" rx="380" ry="240" fill="url(#smbHalo)"/>
          <!-- Ground -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Jesus center, hand raised in teaching gesture -->
          <g transform="translate(400 380)">
            <path d="M -26 0 Q -22 -48 0 -60 Q 22 -48 26 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-72" rx="13" ry="15" fill="#1a1233"/>
            <path d="M -8 -64 Q 0 -50 8 -64" stroke="rgba(254,243,199,0.6)" stroke-width="1.5" fill="none"/>
            <path d="M -10 -72 Q -16 -56 -12 -38 M 10 -72 Q 16 -56 12 -38" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Hand raised palm-out -->
            <line x1="22" y1="-30" x2="44" y2="-58" stroke="#3d2a16" stroke-width="6"/>
            <circle cx="44" cy="-58" r="6" fill="#3d2a16"/>
            <!-- Big radiant halo -->
            <circle cx="0" cy="-72" r="30" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-72" r="44" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Floating "BLESSED ARE THE..." banners on either side -->
          <g font-family="Bebas Neue, sans-serif" font-size="13" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">
            <text x="120" y="120" text-anchor="end">POOR IN SPIRIT</text>
            <text x="120" y="160" text-anchor="end">THOSE WHO MOURN</text>
            <text x="120" y="200" text-anchor="end">THE MEEK</text>
            <text x="120" y="240" text-anchor="end">THE HUNGRY</text>
            <text x="680" y="120" text-anchor="start">THE MERCIFUL</text>
            <text x="680" y="160" text-anchor="start">PURE IN HEART</text>
            <text x="680" y="200" text-anchor="start">PEACEMAKERS</text>
            <text x="680" y="240" text-anchor="start">THE PERSECUTED</text>
          </g>
          <!-- Subtle light rays from Jesus to each banner -->
          <g stroke="rgba(254,243,199,0.18)" stroke-width="1" fill="none">
            <line x1="380" y1="290" x2="130" y2="115"/>
            <line x1="380" y1="300" x2="130" y2="155"/>
            <line x1="380" y1="310" x2="130" y2="195"/>
            <line x1="380" y1="320" x2="130" y2="235"/>
            <line x1="420" y1="290" x2="670" y2="115"/>
            <line x1="420" y1="300" x2="670" y2="155"/>
            <line x1="420" y1="310" x2="670" y2="195"/>
            <line x1="420" y1="320" x2="670" y2="235"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">Nine "blessed are the…" — the kingdom turned right-side up</text>
        </svg>`
      },
      {
        id: 'lilies',
        title: 'Look at the Lilies',
        scriptureRef: 'Matthew 6:25-30',
        bibleText: '"See how the flowers of the field grow. They do not labor or spin. Yet I tell you that not even Solomon in all his splendor was dressed like one of these."',
        narration: 'He talked about anxiety more honestly than any teacher of his day. Look at the birds, he said — they do not sow or store, and your heavenly Father feeds them. Look at the lilies in the field — they do not stitch and they do not strain, and not even Solomon in all his royal closets was dressed as well as one of those wildflowers. If God dresses the grass that is here today and burned for fuel tomorrow, how much more will he take care of you? Therefore do not worry about tomorrow. Seek first His kingdom, and everything you need will come along behind you.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sml', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <ellipse cx="660" cy="100" r="38" fill="#fef3c7"/>
          <ellipse cx="660" cy="100" r="58" fill="rgba(254,243,199,0.4)"/>
          <!-- Rolling green field -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.32)"/>
          <path d="M 0 380 Q 400 370 800 380 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.45)"/>
          <!-- Lilies of the field — clusters of stylized white flowers -->
          <g>
            <!-- Lily cluster 1 -->
            <g transform="translate(150 410)">
              <line x1="0" y1="0" x2="-2" y2="-30" stroke="rgba(34,197,94,0.7)" stroke-width="1.5"/>
              <ellipse cx="-2" cy="-32" rx="8" ry="5" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
              <ellipse cx="-2" cy="-32" rx="3" ry="2" fill="rgba(251,191,36,0.85)"/>
              <line x1="4" y1="0" x2="6" y2="-22" stroke="rgba(34,197,94,0.7)" stroke-width="1.2"/>
              <ellipse cx="6" cy="-24" rx="6" ry="4" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            </g>
            <!-- Lily cluster 2 -->
            <g transform="translate(280 430)">
              <line x1="0" y1="0" x2="0" y2="-32" stroke="rgba(34,197,94,0.7)" stroke-width="1.5"/>
              <ellipse cx="0" cy="-34" rx="9" ry="6" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
              <ellipse cx="0" cy="-34" rx="3" ry="2" fill="rgba(251,191,36,0.85)"/>
              <line x1="-6" y1="0" x2="-9" y2="-20" stroke="rgba(34,197,94,0.7)" stroke-width="1.2"/>
              <ellipse cx="-9" cy="-22" rx="5" ry="3" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
              <line x1="6" y1="0" x2="9" y2="-24" stroke="rgba(34,197,94,0.7)" stroke-width="1.2"/>
              <ellipse cx="9" cy="-26" rx="5" ry="3" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            </g>
            <!-- Lily cluster 3 -->
            <g transform="translate(540 430)">
              <line x1="0" y1="0" x2="0" y2="-30" stroke="rgba(34,197,94,0.7)" stroke-width="1.5"/>
              <ellipse cx="0" cy="-32" rx="8" ry="5" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
              <ellipse cx="0" cy="-32" rx="3" ry="2" fill="rgba(251,191,36,0.85)"/>
            </g>
            <!-- Lily cluster 4 -->
            <g transform="translate(660 410)">
              <line x1="0" y1="0" x2="-2" y2="-34" stroke="rgba(34,197,94,0.7)" stroke-width="1.5"/>
              <ellipse cx="-2" cy="-36" rx="9" ry="6" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
              <line x1="4" y1="0" x2="6" y2="-24" stroke="rgba(34,197,94,0.7)" stroke-width="1.2"/>
              <ellipse cx="6" cy="-26" rx="5" ry="3" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            </g>
          </g>
          <!-- Two birds flying overhead -->
          <g fill="none" stroke="rgba(10,13,26,0.7)" stroke-width="1.6">
            <path d="M 220 130 Q 230 122 240 130 Q 250 122 260 130"/>
            <path d="M 360 90 Q 370 82 380 90 Q 390 82 400 90"/>
            <path d="M 480 140 Q 490 132 500 140 Q 510 132 520 140"/>
          </g>
          <!-- Jesus seated on a low rock, pointing toward the lilies -->
          <g transform="translate(400 360)">
            <path d="M -22 0 Q -18 -40 0 -52 Q 18 -40 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-62" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -54 Q 0 -42 8 -54" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Pointing hand -->
            <line x1="22" y1="-28" x2="58" y2="-12" stroke="#3d2a16" stroke-width="5"/>
            <circle cx="58" cy="-12" r="3" fill="#3d2a16"/>
            <circle cx="0" cy="-62" r="22" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Consider the lilies · how much more will he care for you"</text>
        </svg>`
      },
      {
        id: 'two-builders',
        title: 'The House on the Rock',
        scriptureRef: 'Matthew 7:24-27',
        bibleText: '"The rain came down, the streams rose, and the winds blew and beat against that house; yet it did not fall, because it had its foundation on the rock."',
        narration: 'He ended the sermon with a picture nobody forgot. Two builders. Same blueprint. Same storm. The wise one dug down and built on rock. The foolish one built on sand because it was faster. When the floods came and the winds beat both houses, the one on the rock stood and the one on the sand collapsed with a great crash. The difference was never visible until the day the weather came. The whole sermon — the Beatitudes, the lilies, the prayer he gave them, the call to love your enemies — was the rock. Hearing it changes nothing. Building on it changes everything.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="smtSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="50%" stop-color="#241846"/>
              <stop offset="100%" stop-color="#3d2a16"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#smtSky)"/>
          <!-- Storm clouds, lightning -->
          <g fill="#0a0d1a" opacity="0.85">
            <ellipse cx="160" cy="80" rx="90" ry="28"/>
            <ellipse cx="300" cy="60" rx="100" ry="30"/>
            <ellipse cx="500" cy="80" rx="100" ry="28"/>
            <ellipse cx="650" cy="65" rx="90" ry="30"/>
          </g>
          <polyline points="200,100 220,180 195,175 220,250" stroke="rgba(254,243,199,0.95)" stroke-width="1.5" fill="none"/>
          <polyline points="560,100 580,180 555,175 580,250" stroke="rgba(254,243,199,0.95)" stroke-width="1.5" fill="none"/>
          <!-- Rain streaks across whole sky -->
          <g stroke="rgba(56,189,248,0.4)" stroke-width="1" fill="none">
            <line x1="80" y1="120" x2="60" y2="280"/>
            <line x1="180" y1="140" x2="160" y2="300"/>
            <line x1="280" y1="120" x2="260" y2="280"/>
            <line x1="380" y1="140" x2="360" y2="300"/>
            <line x1="480" y1="120" x2="460" y2="280"/>
            <line x1="580" y1="140" x2="560" y2="300"/>
            <line x1="680" y1="120" x2="660" y2="280"/>
            <line x1="120" y1="130" x2="100" y2="290"/>
            <line x1="240" y1="150" x2="220" y2="310"/>
            <line x1="440" y1="150" x2="420" y2="310"/>
            <line x1="620" y1="150" x2="600" y2="310"/>
          </g>
          <!-- LEFT — house on rock, standing -->
          <text x="200" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.85)">ROCK</text>
          <g transform="translate(200 400)">
            <!-- Rock foundation -->
            <ellipse cx="0" cy="0" rx="100" ry="22" fill="#1a1233" stroke="rgba(251,191,36,0.7)" stroke-width="1.4"/>
            <g stroke="rgba(254,243,199,0.5)" stroke-width="0.6">
              <line x1="-80" y1="6" x2="80" y2="6"/>
              <line x1="-60" y1="14" x2="60" y2="14"/>
            </g>
            <!-- House -->
            <rect x="-50" y="-90" width="100" height="80" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <polygon points="-58,-90 0,-130 58,-90" fill="#241846" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <!-- Door (lit warmly) -->
            <rect x="-10" y="-40" width="20" height="30" fill="rgba(251,191,36,0.75)"/>
            <!-- Window -->
            <rect x="-34" y="-72" width="14" height="14" fill="rgba(251,191,36,0.55)"/>
            <rect x="20"  y="-72" width="14" height="14" fill="rgba(251,191,36,0.55)"/>
            <!-- House standing firmly -->
          </g>
          <!-- RIGHT — house on sand, collapsing -->
          <text x="600" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(248,113,113,0.85)">SAND</text>
          <g transform="translate(600 400)">
            <!-- Sand base (uneven, with a crack splitting through) -->
            <ellipse cx="0" cy="0" rx="100" ry="20" fill="#fbbf24" opacity="0.45" stroke="rgba(254,243,199,0.45)" stroke-width="0.8"/>
            <line x1="-10" y1="-8" x2="10" y2="22" stroke="#0a0d1a" stroke-width="2"/>
            <!-- House tilted, fragments breaking off -->
            <g transform="rotate(-22) translate(-10 0)">
              <rect x="-50" y="-90" width="100" height="80" fill="#3d2a16" stroke="rgba(248,113,113,0.85)" stroke-width="1.4"/>
              <polygon points="-58,-90 0,-130 58,-90" fill="#241846" stroke="rgba(248,113,113,0.85)" stroke-width="1.4"/>
              <!-- Crack lines on walls -->
              <line x1="-30" y1="-90" x2="-20" y2="-30" stroke="rgba(248,113,113,0.85)" stroke-width="1.4"/>
              <line x1="20"  y1="-90" x2="10" y2="-30" stroke="rgba(248,113,113,0.85)" stroke-width="1.4"/>
              <!-- Door swung open / shattered -->
              <polygon points="-12,-40 12,-40 16,-10 -16,-10" fill="#0a0d1a"/>
            </g>
            <!-- Roof piece flying off -->
            <polygon points="-60,-150 -90,-160 -75,-130" fill="#241846" stroke="rgba(248,113,113,0.85)" stroke-width="1"/>
            <polygon points="40,-160 70,-170 55,-140" fill="#241846" stroke="rgba(248,113,113,0.85)" stroke-width="1"/>
            <!-- Dust cloud at base -->
            <ellipse cx="0" cy="-4" rx="60" ry="14" fill="rgba(254,243,199,0.18)"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">Same storm · same plans · different foundation</text>
        </svg>`
      }
    ],
    closing: 'The Sermon on the Mount is the longest stretch of red letters in the gospels. It is also the most uncomfortable. Jesus is not telling sweet people how to be sweeter. He is telling regular people how to live in a kingdom whose rules look upside down from where we are standing. The poor are rich, the meek inherit, the hungry are full, the persecuted are blessed — and the rock under all of it is whether you actually do what he said, not just listen to it. The sermon is free. The foundation is expensive.',
    closingPrompt: 'Which sentence in the Sermon on the Mount have you been hearing for years and not yet built on — and what would obeying it one time this week look like?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 21 — Feeding of the 5,000
  // ════════════════════════════════════════════════════════════
  {
    id: 'feeding-5000',
    title: 'Feeding of the 5,000',
    subtitle: 'Five loaves, two fish, and a crowd that did not go home empty.',
    icon: '🐟',
    color: '#34d399',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'John 6:1-15',
    duration: '~6 min',
    scenes: [
      {
        id: 'hungry-crowd',
        title: 'A Crowd in a Lonely Place',
        scriptureRef: 'John 6:1-7',
        bibleText: '"Where shall we buy bread for these people to eat?" …Philip answered him, "It would take more than half a year\'s wages to buy enough bread for each one to have a bite!"',
        narration: 'Five thousand men, plus women, plus children — likely fifteen thousand people in all — had followed Jesus across the Sea of Galilee onto a remote hillside to hear him teach. By the time he looked up, the sun was getting low. The disciples wanted him to send them away to find food in nearby villages. Jesus said, "You feed them." Philip did the math out loud: eight months of wages would not buy a bite each. Andrew tried to be helpful. "There\'s a boy here with five small barley loaves and two small fish — but what are they among so many?"',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'fdc', skyTop:'#3d2a5e', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Evening sun, low -->
          <circle cx="680" cy="180" r="44" fill="#fef3c7"/>
          <circle cx="680" cy="180" r="64" fill="rgba(251,113,38,0.45)"/>
          <!-- Sea of Galilee in distance -->
          <path d="M 0 240 Q 200 230 400 240 Q 600 230 800 240 L 800 280 Q 600 268 400 282 Q 200 268 0 280 Z" fill="#1e1846" stroke="rgba(56,189,248,0.55)" stroke-width="1"/>
          <g fill="rgba(254,243,199,0.4)">
            <ellipse cx="200" cy="255" rx="22" ry="2"/>
            <ellipse cx="440" cy="262" rx="24" ry="2"/>
            <ellipse cx="640" cy="255" rx="22" ry="2"/>
          </g>
          <!-- Grassy hillside in foreground -->
          <path d="M 0 280 Q 400 260 800 280 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.28)"/>
          <path d="M 0 350 Q 400 340 800 350 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.45)"/>
          <!-- THE CROWD — densely packed rows of small silhouettes filling the lower 2/3 -->
          <g fill="#0a0d1a">
            <!-- Row 1 -->
            <g opacity="0.7">
              <circle cx="60"  cy="320" r="4"/><circle cx="100" cy="318" r="4"/>
              <circle cx="140" cy="320" r="4"/><circle cx="180" cy="318" r="4"/>
              <circle cx="220" cy="320" r="4"/><circle cx="260" cy="318" r="4"/>
              <circle cx="300" cy="320" r="4"/><circle cx="340" cy="318" r="4"/>
              <circle cx="380" cy="320" r="4"/><circle cx="460" cy="318" r="4"/>
              <circle cx="500" cy="320" r="4"/><circle cx="540" cy="318" r="4"/>
              <circle cx="580" cy="320" r="4"/><circle cx="620" cy="318" r="4"/>
              <circle cx="660" cy="320" r="4"/><circle cx="700" cy="318" r="4"/>
              <circle cx="740" cy="320" r="4"/><circle cx="780" cy="318" r="4"/>
            </g>
            <!-- Row 2 -->
            <g opacity="0.78">
              <circle cx="40"  cy="360" r="5"/><circle cx="85" cy="358" r="5"/>
              <circle cx="130" cy="360" r="5"/><circle cx="175" cy="358" r="5"/>
              <circle cx="220" cy="360" r="5"/><circle cx="265" cy="358" r="5"/>
              <circle cx="310" cy="360" r="5"/><circle cx="355" cy="358" r="5"/>
              <circle cx="440" cy="360" r="5"/><circle cx="485" cy="358" r="5"/>
              <circle cx="530" cy="360" r="5"/><circle cx="575" cy="358" r="5"/>
              <circle cx="620" cy="360" r="5"/><circle cx="665" cy="358" r="5"/>
              <circle cx="710" cy="360" r="5"/><circle cx="755" cy="358" r="5"/>
            </g>
            <!-- Row 3 -->
            <g opacity="0.86">
              <circle cx="60"  cy="410" r="6"/><circle cx="110" cy="408" r="6"/>
              <circle cx="160" cy="410" r="6"/><circle cx="210" cy="408" r="6"/>
              <circle cx="260" cy="410" r="6"/><circle cx="310" cy="408" r="6"/>
              <circle cx="360" cy="410" r="6"/><circle cx="450" cy="408" r="6"/>
              <circle cx="500" cy="410" r="6"/><circle cx="550" cy="408" r="6"/>
              <circle cx="600" cy="410" r="6"/><circle cx="650" cy="408" r="6"/>
              <circle cx="700" cy="410" r="6"/><circle cx="750" cy="408" r="6"/>
            </g>
            <!-- Row 4 (foreground, larger) -->
            <g>
              <circle cx="60"  cy="465" r="7"/><circle cx="115" cy="462" r="7"/>
              <circle cx="170" cy="465" r="7"/><circle cx="225" cy="462" r="7"/>
              <circle cx="280" cy="465" r="7"/><circle cx="335" cy="462" r="7"/>
              <circle cx="465" cy="462" r="7"/><circle cx="520" cy="465" r="7"/>
              <circle cx="575" cy="462" r="7"/><circle cx="630" cy="465" r="7"/>
              <circle cx="685" cy="462" r="7"/><circle cx="740" cy="465" r="7"/>
            </g>
          </g>
          <!-- Jesus + disciples standing on a small rise center, gap in crowd around them -->
          <g transform="translate(400 380)">
            <!-- Jesus -->
            <path d="M -14 0 Q -12 -36 0 -44 Q 12 -36 14 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-52" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -8 -44 Q 0 -34 8 -44" stroke="rgba(254,243,199,0.55)" stroke-width="1.3" fill="none"/>
            <circle cx="0" cy="-52" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <!-- Disciple to the right (Philip), gesturing in disbelief -->
            <g transform="translate(40 4)">
              <ellipse cx="0" cy="0" rx="8" ry="22" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-24" rx="7" ry="9" fill="#0a0d1a"/>
              <line x1="-7" y1="-14" x2="-22" y2="-22" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <!-- Disciple to the left (Andrew), leaning down toward boy -->
            <g transform="translate(-46 6)">
              <ellipse cx="0" cy="0" rx="8" ry="22" fill="#0a0d1a"/>
              <ellipse cx="0" cy="-24" rx="7" ry="9" fill="#0a0d1a"/>
              <line x1="6" y1="-14" x2="20" y2="-2" stroke="#0a0d1a" stroke-width="3"/>
            </g>
          </g>
          <text x="400" y="490" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"You give them something to eat"</text>
        </svg>`
      },
      {
        id: 'boy-lunch',
        title: 'A Boy and a Basket',
        scriptureRef: 'John 6:8-9',
        bibleText: '"Here is a boy with five small barley loaves and two small fish, but how far will they go among so many?"',
        narration: 'In the middle of fifteen thousand hungry people, the only one in the crowd who had brought food was a boy. Five small loaves of barley — the cheap bread of the poor. Two little fish, smoked or pickled. It was probably his lunch. Andrew brought him to Jesus almost apologetically. The boy looked up at the rabbi. He gave him everything he had brought from home. He did not know yet that he was about to be in the only miracle that all four Gospel writers thought important enough to tell.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'fbl', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Soft glow centered on the offering -->
          <radialGradient id="fblGlow" cx="0.5" cy="0.6" r="0.5">
            <stop offset="0%" stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.18)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="380" rx="320" ry="180" fill="url(#fblGlow)"/>
          <!-- Grassy ground -->
          <path d="M 0 380 Q 400 370 800 380 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.45)"/>
          <!-- Andrew on the left, hand on boy's shoulder -->
          <g transform="translate(260 400)">
            <path d="M -16 0 Q -14 -38 0 -48 Q 14 -38 16 0 Z" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-58" rx="11" ry="13" fill="#0a0d1a"/>
            <path d="M -8 -50 Q 0 -38 8 -50" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
            <line x1="14" y1="-30" x2="34" y2="-18" stroke="#0a0d1a" stroke-width="4"/>
          </g>
          <!-- The boy in the center, smaller, offering his basket up -->
          <g transform="translate(340 415)">
            <!-- Body -->
            <path d="M -11 0 Q -10 -26 0 -32 Q 10 -26 11 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="1"/>
            <ellipse cx="0" cy="-38" rx="9" ry="11" fill="#1a1233"/>
            <!-- Short, ruddy hair -->
            <path d="M -7 -44 Q -8 -50 -2 -50 M 2 -50 Q 8 -50 7 -44" stroke="rgba(251,113,38,0.7)" stroke-width="1.4" fill="none"/>
            <!-- Both arms lifted up holding basket -->
            <line x1="-9" y1="-18" x2="-22" y2="-44" stroke="#3d2a16" stroke-width="4"/>
            <line x1="9"  y1="-18" x2="22" y2="-44" stroke="#3d2a16" stroke-width="4"/>
            <!-- Halo (small, bright) -->
            <circle cx="0" cy="-38" r="18" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- The basket held aloft -->
          <g transform="translate(340 360)">
            <path d="M -28 0 Q -22 14 0 16 Q 22 14 28 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <line x1="-28" y1="0" x2="28" y2="0" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <path d="M -24 -2 Q 0 -14 24 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1.2" fill="none"/>
            <!-- 5 small barley loaves -->
            <ellipse cx="-16" cy="-2" rx="5" ry="3" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="-6"  cy="-3" rx="5" ry="3" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="4"   cy="-3" rx="5" ry="3" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="14"  cy="-2" rx="5" ry="3" fill="rgba(251,191,36,0.95)"/>
            <ellipse cx="-10" cy="-7" rx="5" ry="3" fill="rgba(251,191,36,0.95)"/>
            <!-- 2 small fish -->
            <g fill="#5a4378" stroke="#fef3c7" stroke-width="0.5">
              <path d="M 14 -8 Q 22 -10 28 -8 L 32 -10 L 32 -6 Z"/>
              <path d="M 20 -12 Q 28 -14 34 -12 L 38 -14 L 38 -10 Z"/>
            </g>
          </g>
          <!-- Jesus on the right, reaching down to receive the basket, smiling -->
          <g transform="translate(440 380)">
            <path d="M -16 20 Q -14 -38 0 -50 Q 14 -38 16 20 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-60" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -52 Q 0 -42 8 -52" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -60 Q -16 -48 -12 -34 M 10 -60 Q 16 -48 12 -34" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Both arms reaching DOWN to take the basket -->
            <line x1="-14" y1="-26" x2="-32" y2="-20" stroke="#3d2a16" stroke-width="5"/>
            <line x1="-32" y1="-20" x2="-30" y2="0"  stroke="#3d2a16" stroke-width="5"/>
            <!-- Big halo -->
            <circle cx="0" cy="-60" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.7"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Five small loaves · two small fish"</text>
        </svg>`
      },
      {
        id: 'blessing',
        title: 'He Gave Thanks',
        scriptureRef: 'John 6:10-11',
        bibleText: '"Jesus took the loaves, gave thanks, and distributed to those who were seated as much as they wanted. He did the same with the fish."',
        narration: 'He told them to sit down. They sat in groups of fifty and a hundred on the green grass — like seedbeds in a field, Mark says. Jesus took the boy\'s loaves, lifted them up to heaven, and gave thanks. Then he broke them. And kept breaking them. And kept breaking them. The disciples carried baskets of fresh barley loaves and steaming fish along the rows, walking past family after family — and the food in their baskets never ran out. Fifteen thousand people ate until they were full.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="fbgGlory" cx="0.5" cy="0.3" r="0.7">
              <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="35%" stop-color="rgba(251,191,36,0.55)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
            <linearGradient id="fbgSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fbbf24"/>
              <stop offset="60%" stop-color="#fef3c7"/>
              <stop offset="100%" stop-color="rgba(34,197,94,0.4)"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#fbgSky)"/>
          <!-- Heavens "opened" — beam from above -->
          <ellipse cx="400" cy="80" rx="400" ry="160" fill="url(#fbgGlory)"/>
          <polygon points="380,0 350,300 450,300 420,0" fill="rgba(254,243,199,0.45)"/>
          <!-- Grass ground -->
          <path d="M 0 360 Q 400 350 800 360 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.5)"/>
          <!-- Jesus center, both hands lifted holding the loaves up toward heaven -->
          <g transform="translate(400 360)">
            <path d="M -24 0 Q -20 -44 0 -56 Q 20 -44 24 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
            <ellipse cx="0" cy="-66" rx="13" ry="15" fill="#1a1233"/>
            <path d="M -8 -58 Q 0 -46 8 -58" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -66 Q -16 -50 -12 -36 M 10 -66 Q 16 -50 12 -36" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Arms raised straight up holding loaves -->
            <line x1="-12" y1="-32" x2="-22" y2="-80" stroke="#3d2a16" stroke-width="6"/>
            <line x1="12"  y1="-32" x2="22" y2="-80" stroke="#3d2a16" stroke-width="6"/>
            <!-- Loaves in the lifted hands -->
            <ellipse cx="-22" cy="-84" rx="14" ry="6" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <ellipse cx="22"  cy="-84" rx="14" ry="6" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <ellipse cx="0"   cy="-94" rx="12" ry="5" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <!-- Crown of radiance -->
            <circle cx="0" cy="-66" r="34" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-66" r="48" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Disciples flanking, baskets in hand, ready to distribute -->
          <g transform="translate(260 400)">
            <path d="M -12 0 Q -10 -32 0 -40 Q 10 -32 12 0 Z" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-48" rx="9" ry="11" fill="#0a0d1a"/>
            <!-- Basket -->
            <path d="M -14 -10 Q -8 0 0 0 Q 8 0 14 -10 L 10 4 Q 0 8 -10 4 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-6" rx="9" ry="3" fill="rgba(251,191,36,0.9)"/>
          </g>
          <g transform="translate(540 400)">
            <path d="M -12 0 Q -10 -32 0 -40 Q 10 -32 12 0 Z" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-48" rx="9" ry="11" fill="#0a0d1a"/>
            <path d="M -14 -10 Q -8 0 0 0 Q 8 0 14 -10 L 10 4 Q 0 8 -10 4 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-6" rx="9" ry="3" fill="rgba(251,191,36,0.9)"/>
          </g>
          <!-- Seated groups in distance — small clusters of dots -->
          <g fill="#0a0d1a" opacity="0.7">
            <g><circle cx="80"  cy="440" r="3"/><circle cx="92"  cy="438" r="3"/><circle cx="86"  cy="448" r="3"/></g>
            <g><circle cx="140" cy="450" r="3"/><circle cx="152" cy="448" r="3"/><circle cx="146" cy="458" r="3"/></g>
            <g><circle cx="200" cy="445" r="3"/><circle cx="212" cy="443" r="3"/><circle cx="206" cy="453" r="3"/></g>
            <g><circle cx="640" cy="445" r="3"/><circle cx="652" cy="443" r="3"/><circle cx="646" cy="453" r="3"/></g>
            <g><circle cx="700" cy="450" r="3"/><circle cx="712" cy="448" r="3"/><circle cx="706" cy="458" r="3"/></g>
            <g><circle cx="760" cy="440" r="3"/><circle cx="772" cy="438" r="3"/><circle cx="766" cy="448" r="3"/></g>
          </g>
          <text x="400" y="490" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"He looked up to heaven · and gave thanks"</text>
        </svg>`
      },
      {
        id: 'twelve-baskets',
        title: 'Twelve Baskets Left Over',
        scriptureRef: 'John 6:12-13',
        bibleText: '"Gather the pieces that are left over. Let nothing be wasted." So they gathered them and filled twelve baskets with the pieces of the five barley loaves left over by those who had eaten.',
        narration: 'When the crowd had eaten and were leaning back content, Jesus said something even more astonishing than feed-them-yourself: "Gather the pieces that are left over. Let nothing be wasted." The twelve disciples walked back through the rows with empty baskets. They came back with twelve baskets full. One basket for every disciple. Five loaves became fifteen thousand meals plus twelve baskets of leftovers. The boy had handed Jesus his lunch and watched it feed a city. The disciples each carried home a basket — a private, undeniable, calloused-knuckle reminder of what God can do with what little they had brought.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'ftb', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Late-afternoon sun, lower -->
          <circle cx="660" cy="120" r="38" fill="#fef3c7"/>
          <circle cx="660" cy="120" r="56" fill="rgba(251,113,38,0.45)"/>
          <!-- Ground -->
          <path d="M 0 320 Q 400 310 800 320 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.45)"/>
          <!-- Twelve baskets arranged in two rows across the foreground -->
          <!-- Row 1 (back) -->
          <g>
            <g transform="translate(110 340)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/><path d="M -26 -2 Q 0 -16 26 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1" fill="none"/><ellipse cx="0" cy="-4" rx="22" ry="6" fill="rgba(251,191,36,0.9)"/><text x="0" y="2" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" fill="rgba(254,243,199,0.85)">1</text></g>
            <g transform="translate(220 340)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/><path d="M -26 -2 Q 0 -16 26 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1" fill="none"/><ellipse cx="0" cy="-4" rx="22" ry="6" fill="rgba(251,191,36,0.9)"/><text x="0" y="2" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" fill="rgba(254,243,199,0.85)">2</text></g>
            <g transform="translate(330 340)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/><path d="M -26 -2 Q 0 -16 26 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1" fill="none"/><ellipse cx="0" cy="-4" rx="22" ry="6" fill="rgba(251,191,36,0.9)"/><text x="0" y="2" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" fill="rgba(254,243,199,0.85)">3</text></g>
            <g transform="translate(440 340)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/><path d="M -26 -2 Q 0 -16 26 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1" fill="none"/><ellipse cx="0" cy="-4" rx="22" ry="6" fill="rgba(251,191,36,0.9)"/><text x="0" y="2" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" fill="rgba(254,243,199,0.85)">4</text></g>
            <g transform="translate(550 340)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/><path d="M -26 -2 Q 0 -16 26 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1" fill="none"/><ellipse cx="0" cy="-4" rx="22" ry="6" fill="rgba(251,191,36,0.9)"/><text x="0" y="2" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" fill="rgba(254,243,199,0.85)">5</text></g>
            <g transform="translate(660 340)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/><path d="M -26 -2 Q 0 -16 26 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1" fill="none"/><ellipse cx="0" cy="-4" rx="22" ry="6" fill="rgba(251,191,36,0.9)"/><text x="0" y="2" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" fill="rgba(254,243,199,0.85)">6</text></g>
          </g>
          <!-- Row 2 (front, slightly bigger) -->
          <g>
            <g transform="translate(80 420)"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/><path d="M -30 -2 Q 0 -18 30 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1.2" fill="none"/><ellipse cx="0" cy="-5" rx="26" ry="7" fill="rgba(251,191,36,0.95)"/><text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" fill="rgba(254,243,199,0.95)">7</text></g>
            <g transform="translate(200 420)"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/><path d="M -30 -2 Q 0 -18 30 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1.2" fill="none"/><ellipse cx="0" cy="-5" rx="26" ry="7" fill="rgba(251,191,36,0.95)"/><text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" fill="rgba(254,243,199,0.95)">8</text></g>
            <g transform="translate(320 420)"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/><path d="M -30 -2 Q 0 -18 30 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1.2" fill="none"/><ellipse cx="0" cy="-5" rx="26" ry="7" fill="rgba(251,191,36,0.95)"/><text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" fill="rgba(254,243,199,0.95)">9</text></g>
            <g transform="translate(440 420)"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/><path d="M -30 -2 Q 0 -18 30 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1.2" fill="none"/><ellipse cx="0" cy="-5" rx="26" ry="7" fill="rgba(251,191,36,0.95)"/><text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" fill="rgba(254,243,199,0.95)">10</text></g>
            <g transform="translate(580 420)"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/><path d="M -30 -2 Q 0 -18 30 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1.2" fill="none"/><ellipse cx="0" cy="-5" rx="26" ry="7" fill="rgba(251,191,36,0.95)"/><text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" fill="rgba(254,243,199,0.95)">11</text></g>
            <g transform="translate(720 420)"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/><path d="M -30 -2 Q 0 -18 30 -2" stroke="rgba(251,191,36,0.85)" stroke-width="1.2" fill="none"/><ellipse cx="0" cy="-5" rx="26" ry="7" fill="rgba(251,191,36,0.95)"/><text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" fill="rgba(254,243,199,0.95)">12</text></g>
          </g>
          <!-- Big "12" tally banner at top -->
          <g>
            <text x="400" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="36" letter-spacing="6" fill="rgba(251,191,36,0.95)">12 BASKETS LEFT OVER</text>
            <text x="400" y="90" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="3" fill="rgba(254,243,199,0.75)">FROM 5 LOAVES · 2 FISH · 15,000 FED</text>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Let nothing be wasted"</text>
        </svg>`
      }
    ],
    closing: 'There is one fact about this miracle that is easy to miss: Jesus could have made bread out of nothing. He had already refused to do that for himself in the wilderness. Here, he started with what was on hand — a boy\'s lunch — and multiplied it through the hands of his disciples. He still works like this. He rarely asks you for what you do not have. He asks for what you do — your loaves, your fish, your forty minutes, your awkward conversation, your small obedience — and then he multiplies it through hands like yours until there are baskets left over.',
    closingPrompt: 'What is the "five loaves and two fish" in your hand right now — the small, almost embarrassing thing you could actually offer — and what would it look like to put it in Jesus\' hands this week?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 22 — The Prodigal Son
  // ════════════════════════════════════════════════════════════
  {
    id: 'prodigal-son',
    title: 'The Prodigal Son',
    subtitle: 'A wasted inheritance, a father running, and an older brother in the dark.',
    icon: '🤗',
    color: '#fb923c',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Luke 15:11-32',
    duration: '~7 min',
    scenes: [
      {
        id: 'departure',
        title: 'Give Me What is Coming to Me',
        scriptureRef: 'Luke 15:11-13',
        bibleText: '"Father, give me my share of the estate." …Not long after that, the younger son got together all he had, set off for a distant country and there squandered his wealth in wild living.',
        narration: 'A man had two sons. The younger one came to his father one afternoon and said, in effect, "I wish you were dead. Give me my share of the inheritance now." It was the most insulting thing a Hebrew son could say to his father. The father did not strike him. He did not even argue. He divided his property and handed it over. Not long after, the younger son packed everything, kissed nobody goodbye, and walked out for a far country — somewhere his name meant nothing and no one would tell him to come home.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pdd', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <ellipse cx="640" cy="120" r="36" fill="#fef3c7"/>
          <ellipse cx="640" cy="120" r="54" fill="rgba(251,191,36,0.4)"/>
          <!-- Hills behind -->
          <path d="M 0 300 Q 200 270 400 290 Q 600 270 800 300 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- Father's house — modest stone home, lit windows -->
          <g transform="translate(180 380)">
            <rect x="-50" y="-60" width="100" height="60" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.4"/>
            <polygon points="-58,-60 0,-94 58,-60" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1.4"/>
            <!-- Door -->
            <rect x="-10" y="-28" width="20" height="28" fill="rgba(251,191,36,0.65)"/>
            <!-- Windows lit -->
            <rect x="-34" y="-48" width="12" height="12" fill="rgba(251,191,36,0.55)"/>
            <rect x="22"  y="-48" width="12" height="12" fill="rgba(251,191,36,0.55)"/>
            <!-- Smoke from chimney -->
            <ellipse cx="0" cy="-110" rx="6" ry="14" fill="rgba(254,243,199,0.25)"/>
          </g>
          <!-- Road heading toward the right (far country) -->
          <path d="M 240 460 Q 400 420 600 400 Q 700 392 800 400" stroke="rgba(254,243,199,0.5)" stroke-width="6" fill="none" stroke-dasharray="6 8"/>
          <!-- Older brother working in field, head DOWN (left side) -->
          <g transform="translate(60 410)">
            <ellipse cx="0" cy="0" rx="9" ry="22" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <line x1="-8" y1="-14" x2="-20" y2="14" stroke="#0a0d1a" stroke-width="3"/>
            <!-- Pitchfork / staff -->
            <line x1="6" y1="-12" x2="20" y2="-50" stroke="#3d2a16" stroke-width="2.5"/>
          </g>
          <!-- Father at the doorstep, arm extended (handing money / blessing) — facing the leaving son -->
          <g transform="translate(220 360)">
            <ellipse cx="0" cy="0" rx="13" ry="36" fill="#1a1233"/>
            <ellipse cx="0" cy="-38" rx="12" ry="14" fill="#1a1233"/>
            <!-- Long beard -->
            <path d="M -9 -30 Q 0 -12 9 -30" stroke="rgba(254,243,199,0.65)" stroke-width="1.6" fill="none"/>
            <path d="M -6 -16 Q 0 -4 6 -16" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            <!-- Arm extending toward son — palm up, holding small money bag -->
            <line x1="12" y1="-22" x2="40" y2="-12" stroke="#1a1233" stroke-width="5"/>
            <ellipse cx="44" cy="-10" rx="9" ry="7" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <!-- Small coin glint on the bag -->
            <circle cx="44" cy="-10" r="3" fill="rgba(251,191,36,0.85)"/>
            <!-- Halo -->
            <circle cx="0" cy="-38" r="22" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <!-- Younger son walking AWAY from the house, knapsack over shoulder, head defiantly up -->
          <g transform="translate(440 400)">
            <ellipse cx="0" cy="0" rx="11" ry="26" fill="#3d2a16"/>
            <ellipse cx="0" cy="-26" rx="10" ry="12" fill="#1a1233"/>
            <path d="M -8 -34 Q -10 -42 -3 -42 M 3 -42 Q 10 -42 8 -34" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Knapsack -->
            <line x1="-6" y1="-22" x2="-22" y2="-32" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="-22" cy="-30" rx="9" ry="11" fill="#241846" stroke="rgba(251,191,36,0.6)" stroke-width="1"/>
            <!-- Walking stride -->
            <line x1="-3" y1="22" x2="-12" y2="40" stroke="#3d2a16" stroke-width="4"/>
            <line x1="3"  y1="22" x2="12" y2="40" stroke="#3d2a16" stroke-width="4"/>
            <!-- Halo dimmer (his choice has dimmed it) -->
            <circle cx="0" cy="-26" r="16" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1" stroke-dasharray="2 3"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Give me my share" · spoken as though the father were already dead</text>
        </svg>`
      },
      {
        id: 'far-country',
        title: 'The Far Country',
        scriptureRef: 'Luke 15:13',
        bibleText: '"There he squandered his wealth in wild living."',
        narration: 'In the far country the money lasted a season. He bought new clothes. He bought wine. He bought women. He bought friends — and they stayed as long as he was buying. The harder he chased the rush, the faster the bag emptied. He did things he would never have done in his father\'s house. He stopped praying. He stopped writing home. The night the last coin spent itself, he laughed louder than usual at the wrong joke and slept on the wrong floor. The next morning the city looked different — and so did his face in the bronze mirror.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pdf', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Distant pagan city skyline — domes, pillars, a temple -->
          <g fill="#0a0d1a" stroke="rgba(251,113,38,0.5)" stroke-width="0.8">
            <rect x="0" y="220" width="800" height="100"/>
            <!-- Domes and towers -->
            <ellipse cx="100" cy="220" rx="40" ry="30"/>
            <rect x="160" y="180" width="22" height="40"/>
            <ellipse cx="240" cy="220" rx="44" ry="34"/>
            <rect x="600" y="180" width="22" height="40"/>
            <ellipse cx="680" cy="220" rx="40" ry="30"/>
            <rect x="740" y="190" width="22" height="30"/>
          </g>
          <!-- Pillared columns of an opulent house — interior scene -->
          <g fill="#1a1233" stroke="rgba(251,113,38,0.7)" stroke-width="1">
            <rect x="60"  y="240" width="22" height="200"/>
            <rect x="720" y="240" width="22" height="200"/>
            <rect x="54"  y="226" width="34" height="14" fill="#3d2a16"/>
            <rect x="714" y="226" width="34" height="14" fill="#3d2a16"/>
          </g>
          <!-- Hanging lamp (party lighting) -->
          <line x1="400" y1="120" x2="400" y2="200" stroke="rgba(251,113,38,0.65)" stroke-width="1"/>
          <ellipse cx="400" cy="208" rx="20" ry="8" fill="#3d2a16" stroke="rgba(251,113,38,0.85)" stroke-width="1.2"/>
          <ellipse cx="400" cy="204" rx="8" ry="9" fill="#fb923c"/>
          <ellipse cx="400" cy="204" rx="4" ry="5" fill="#fbbf24"/>
          <radialGradient id="pdfLamp" cx="0.5" cy="0.4" r="0.45">
            <stop offset="0%" stop-color="rgba(251,113,38,0.4)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.15)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="320" rx="320" ry="140" fill="url(#pdfLamp)"/>
          <!-- A long banquet table -->
          <rect x="180" y="370" width="440" height="20" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
          <rect x="180" y="388" width="440" height="14" fill="#241846"/>
          <!-- Wine vessels + spilled cup -->
          <ellipse cx="240" cy="368" rx="10" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
          <line x1="240" y1="364" x2="240" y2="354" stroke="#3d2a16" stroke-width="2"/>
          <ellipse cx="340" cy="368" rx="12" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
          <line x1="340" y1="362" x2="340" y2="350" stroke="#3d2a16" stroke-width="2"/>
          <!-- Wine spilling off the table -->
          <ellipse cx="500" cy="368" rx="10" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8" transform="rotate(40 500 368)"/>
          <path d="M 510 372 Q 514 388 510 408" stroke="rgba(120,20,20,0.85)" stroke-width="2.5" fill="none"/>
          <ellipse cx="510" cy="412" rx="14" ry="3" fill="rgba(120,20,20,0.7)"/>
          <!-- Coins flying off the table (money flowing out) -->
          <g fill="rgba(251,191,36,0.95)" stroke="#fef3c7" stroke-width="0.5">
            <circle cx="200" cy="350" r="4"/><circle cx="220" cy="340" r="4"/>
            <circle cx="600" cy="345" r="4"/><circle cx="620" cy="335" r="4"/>
            <circle cx="160" cy="420" r="4"/><circle cx="640" cy="420" r="4"/>
          </g>
          <!-- The son seated at table center, slumped, head in hands -->
          <g transform="translate(400 360)">
            <path d="M -20 0 Q -16 -34 0 -42 Q 16 -34 20 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-52" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -42 Q -2 -34 0 -34 M 8 -42 Q 2 -34 0 -34" stroke="rgba(254,243,199,0.45)" stroke-width="1.3" fill="none"/>
            <!-- Head in hands -->
            <line x1="-12" y1="-42" x2="-6" y2="-50" stroke="#3d2a16" stroke-width="3"/>
            <line x1="12"  y1="-42" x2="6"  y2="-50" stroke="#3d2a16" stroke-width="3"/>
            <!-- No halo at all now -->
          </g>
          <!-- A friend leaving, walking out -->
          <g transform="translate(680 410)" opacity="0.7">
            <ellipse cx="0" cy="0" rx="9" ry="22" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-22" rx="8" ry="9" fill="#0a0d1a"/>
            <line x1="6" y1="-12" x2="20" y2="-8" stroke="#0a0d1a" stroke-width="3"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">The far country · everything bright · until the morning</text>
        </svg>`
      },
      {
        id: 'pigs',
        title: 'Among the Pigs',
        scriptureRef: 'Luke 15:14-17',
        bibleText: '"He longed to fill his stomach with the pods that the pigs were eating, but no one gave him anything. When he came to his senses…"',
        narration: 'A famine came over the country. There was no rush, no friends, no clothes, no food. He hired himself out to a citizen of that country who sent him into the fields to feed his pigs — the most unclean animal a Jewish boy could possibly be assigned to. He would have eaten the slop the pigs were eating if anyone had let him. He would have eaten anything. One morning he sat down in the mud and a sentence rose in his chest he had not heard for a long time. "How many of my father\'s hired servants have food to spare — and here I am, starving. I will go back to my father." Luke calls it: he came to his senses.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="pdpSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3d2a16"/>
              <stop offset="60%" stop-color="#241846"/>
              <stop offset="100%" stop-color="#1a1233"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#pdpSky)"/>
          <!-- Dim, washed-out sun (famine) -->
          <circle cx="660" cy="100" r="22" fill="rgba(254,243,199,0.45)"/>
          <!-- Cracked, dried-out ground -->
          <path d="M 0 280 Q 200 270 400 280 Q 600 270 800 280 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 360 Q 400 350 800 360 L 800 500 L 0 500 Z" fill="#241846"/>
          <g stroke="rgba(251,113,38,0.5)" stroke-width="0.7" fill="none">
            <path d="M 60 380 L 100 386 L 130 382"/>
            <path d="M 220 392 L 260 396 L 290 392"/>
            <path d="M 480 394 L 520 398 L 560 394"/>
            <path d="M 720 382 L 760 386 L 790 382"/>
          </g>
          <!-- Wooden pen fence -->
          <g stroke="#0a0d1a" stroke-width="3" fill="none">
            <line x1="40" y1="380" x2="40" y2="320"/>
            <line x1="80" y1="380" x2="80" y2="320"/>
            <line x1="120" y1="380" x2="120" y2="320"/>
            <line x1="40" y1="335" x2="120" y2="335"/>
            <line x1="40" y1="360" x2="120" y2="360"/>
          </g>
          <!-- Pigs (several) — dirty pink-grey silhouettes, snouts down -->
          <g fill="#1a1233" stroke="rgba(254,243,199,0.4)" stroke-width="0.5">
            <g transform="translate(230 410)">
              <ellipse cx="0" cy="0" rx="40" ry="16"/>
              <ellipse cx="36" cy="-4" rx="14" ry="11"/>
              <circle cx="42" cy="-2" r="3" fill="#fef3c7"/>
              <line x1="-26" y1="14" x2="-26" y2="22" stroke="#1a1233" stroke-width="3"/>
              <line x1="-10" y1="14" x2="-10" y2="22" stroke="#1a1233" stroke-width="3"/>
              <line x1="6"   y1="14" x2="6"   y2="22" stroke="#1a1233" stroke-width="3"/>
              <line x1="20"  y1="14" x2="20"  y2="22" stroke="#1a1233" stroke-width="3"/>
              <path d="M -36 -8 Q -42 -16 -34 -16" stroke="#1a1233" stroke-width="2" fill="none"/>
            </g>
            <g transform="translate(330 425)" opacity="0.85">
              <ellipse cx="0" cy="0" rx="34" ry="14"/>
              <ellipse cx="30" cy="-4" rx="12" ry="9"/>
              <circle cx="36" cy="-3" r="2.5" fill="#fef3c7"/>
            </g>
            <g transform="translate(560 420)" opacity="0.8">
              <ellipse cx="0" cy="0" rx="32" ry="13"/>
              <ellipse cx="-28" cy="-4" rx="11" ry="9"/>
              <circle cx="-34" cy="-3" r="2.5" fill="#fef3c7"/>
            </g>
            <g transform="translate(660 415)" opacity="0.7">
              <ellipse cx="0" cy="0" rx="28" ry="12"/>
              <ellipse cx="-22" cy="-3" rx="10" ry="8"/>
            </g>
          </g>
          <!-- Trough with pods/husks -->
          <g transform="translate(440 440)">
            <path d="M -50 0 L 50 0 L 40 16 L -40 16 Z" fill="#3d2a16" stroke="rgba(254,243,199,0.4)" stroke-width="1"/>
            <g fill="rgba(254,243,199,0.4)">
              <ellipse cx="-30" cy="6" rx="6" ry="2"/>
              <ellipse cx="-12" cy="6" rx="6" ry="2"/>
              <ellipse cx="8" cy="6" rx="6" ry="2"/>
              <ellipse cx="28" cy="6" rx="6" ry="2"/>
            </g>
          </g>
          <!-- Son seated in mud near the trough, gaunt, looking up -->
          <g transform="translate(420 380)">
            <!-- Tattered tunic -->
            <path d="M -16 0 Q -14 -36 0 -46 Q 14 -36 16 0 Z" fill="#241846" stroke="rgba(254,243,199,0.3)" stroke-width="0.8" stroke-dasharray="3 3"/>
            <ellipse cx="0" cy="-56" rx="11" ry="13" fill="#1a1233"/>
            <!-- Sunken cheeks (subtle) -->
            <line x1="-6" y1="-46" x2="-4" y2="-42" stroke="rgba(254,243,199,0.45)" stroke-width="0.8"/>
            <line x1="6"  y1="-46" x2="4"  y2="-42" stroke="rgba(254,243,199,0.45)" stroke-width="0.8"/>
            <!-- Scruffy beard -->
            <path d="M -7 -48 Q 0 -36 7 -48" stroke="rgba(254,243,199,0.4)" stroke-width="1.2" fill="none"/>
            <!-- Hand on forehead, head tilted up — "came to his senses" -->
            <line x1="-12" y1="-46" x2="-6" y2="-66" stroke="#241846" stroke-width="3"/>
            <!-- Eyes lifted (small upturn) -->
            <path d="M -5 -55 Q -3 -57 -1 -55 M 1 -55 Q 3 -57 5 -55" stroke="rgba(254,243,199,0.6)" stroke-width="0.8" fill="none"/>
            <!-- Faint reawakening halo -->
            <circle cx="0" cy="-56" r="20" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1" stroke-dasharray="3 3"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"He came to his senses"</text>
        </svg>`
      },
      {
        id: 'father-runs',
        title: 'The Father Saw Him',
        scriptureRef: 'Luke 15:20-24',
        bibleText: '"But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him."',
        narration: 'He rehearsed the speech the whole walk home. "Father, I have sinned against heaven and against you. I am no longer worthy to be called your son. Make me one of your hired servants." The road wound on for days. He was thin and dirty and smelled of pigs. He came over the last hill and saw the house. Before he was even close — while he was still a long way off — his father saw him. And the father did something no patriarch in that culture would ever do: he picked up the hem of his robe and he ran. He ran like a young man down the road. He fell on his son\'s neck and kissed him. The boy started his rehearsed speech and got halfway through it. The father did not let him finish.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pdr', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Dawn / midday sunburst behind the father -->
          <radialGradient id="pdrGlory" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0%" stop-color="rgba(254,243,199,0.85)"/>
            <stop offset="40%" stop-color="rgba(251,191,36,0.45)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="280" rx="440" ry="280" fill="url(#pdrGlory)"/>
          <!-- Father's house visible far behind on the right -->
          <g transform="translate(680 330)" opacity="0.7">
            <rect x="-40" y="-60" width="80" height="60" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <polygon points="-46,-60 0,-90 46,-60" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <rect x="-8" y="-26" width="16" height="26" fill="rgba(251,191,36,0.65)"/>
          </g>
          <!-- Road from upper-right to lower-left -->
          <path d="M 700 360 Q 500 400 200 460" stroke="rgba(254,243,199,0.55)" stroke-width="6" fill="none" stroke-dasharray="6 8"/>
          <!-- Ground -->
          <path d="M 0 410 Q 400 400 800 410 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.4)"/>
          <!-- THE FATHER RUNNING — robe billowing back, arms thrown wide, face forward -->
          <g transform="translate(360 360)">
            <!-- Body leaning forward, robe streaming behind -->
            <path d="M -10 28 Q -8 -10 0 -36 Q 8 -10 10 28 Z" fill="#3d2a5e"/>
            <path d="M 8 26 Q 36 18 60 36 L 38 12 Q 16 4 8 -8 Z" fill="#3d2a5e" opacity="0.85"/>
            <path d="M 50 30 Q 86 20 110 44" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="3"/>
            <!-- Head -->
            <ellipse cx="0" cy="-46" rx="12" ry="14" fill="#1a1233"/>
            <!-- Long beard, flying back from speed -->
            <path d="M -9 -38 Q 6 -22 18 -32" stroke="rgba(254,243,199,0.7)" stroke-width="2" fill="none"/>
            <!-- Arms thrown WIDE OPEN forward -->
            <line x1="-12" y1="-22" x2="-38" y2="-44" stroke="#3d2a5e" stroke-width="6"/>
            <line x1="-12" y1="-12" x2="-44" y2="-20" stroke="#3d2a5e" stroke-width="6"/>
            <!-- Running stride — back leg pushing off, front leg airborne -->
            <line x1="-3" y1="26" x2="-22" y2="44" stroke="#3d2a5e" stroke-width="5"/>
            <line x1="3"  y1="26" x2="14" y2="50" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Massive halo -->
            <circle cx="0" cy="-46" r="32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-46" r="48" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          </g>
          <!-- Son falling forward into the embrace, knees just buckling -->
          <g transform="translate(250 400)">
            <!-- Body, more torn / smaller / kneeling -->
            <path d="M -10 14 Q -10 -22 0 -32 Q 10 -22 10 14 Z" fill="#241846" stroke="rgba(254,243,199,0.4)" stroke-width="0.8" stroke-dasharray="3 3"/>
            <ellipse cx="0" cy="-40" rx="10" ry="12" fill="#1a1233"/>
            <!-- Hands raised, palms up, exhausted -->
            <line x1="-8" y1="-22" x2="-4" y2="-44" stroke="#241846" stroke-width="4"/>
            <line x1="8"  y1="-22" x2="4"  y2="-44" stroke="#241846" stroke-width="4"/>
            <!-- Knee buckling -->
            <line x1="-4" y1="14" x2="-10" y2="22" stroke="#241846" stroke-width="4"/>
            <line x1="4"  y1="14" x2="10" y2="22" stroke="#241846" stroke-width="4"/>
            <!-- A small halo re-emerging -->
            <circle cx="0" cy="-40" r="20" fill="none" stroke="rgba(251,191,36,0.75)" stroke-width="1.3"/>
          </g>
          <!-- Servants in the distance, running with robe + ring + sandals -->
          <g transform="translate(620 380)" opacity="0.75">
            <ellipse cx="0" cy="0" rx="8" ry="20" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-20" rx="7" ry="8" fill="#0a0d1a"/>
            <!-- Folded robe over arm -->
            <ellipse cx="-12" cy="-2" rx="9" ry="6" fill="rgba(251,191,36,0.7)" stroke="#fef3c7" stroke-width="0.5"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"While he was still a long way off · his father saw him · and ran"</text>
        </svg>`
      },
      {
        id: 'older-brother',
        title: 'The Older Brother in the Field',
        scriptureRef: 'Luke 15:25-32',
        bibleText: '"My son, you are always with me, and everything I have is yours. But we had to celebrate and be glad, because this brother of yours was dead and is alive again; he was lost and is found."',
        narration: 'The older brother was in the field when he heard the music. He came up to the house and asked a servant what was going on. "Your brother is back. Your father has killed the fattened calf." He stood in the dark of the yard, refusing to go in. The father came out — again the father went out. "Look. All these years I have been slaving for you. I never disobeyed your orders. You never gave me even a young goat to celebrate with my friends. But when this son of yours comes home — after squandering your money on prostitutes — you kill the fattened calf for him." And the father said, with the same patience he had shown the younger one, "Son. You are always with me. Everything I have is yours. But we had to celebrate. This brother of yours was dead, and now he is alive. He was lost, and he is found." The story ends there. We never learn whether the older brother went in.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pob', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <g fill="#fef3c7" opacity="0.6">
            <circle cx="80"  cy="50"  r="0.9"/><circle cx="220" cy="80"  r="0.8"/>
            <circle cx="380" cy="40"  r="0.9"/><circle cx="540" cy="70"  r="0.8"/>
            <circle cx="700" cy="60"  r="0.9"/>
          </g>
          <!-- The house, brightly lit, with music and dancing inside (right half of frame) -->
          <g transform="translate(560 360)">
            <rect x="-110" y="-110" width="220" height="110" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <polygon points="-118,-110 0,-156 118,-110" fill="#241846" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <!-- Open door, light pouring out -->
            <rect x="-22" y="-60" width="44" height="60" fill="rgba(251,191,36,0.85)"/>
            <!-- Lit windows -->
            <rect x="-86" y="-86" width="22" height="22" fill="rgba(251,191,36,0.7)"/>
            <rect x="-58" y="-86" width="22" height="22" fill="rgba(251,191,36,0.7)"/>
            <rect x="40"  y="-86" width="22" height="22" fill="rgba(251,191,36,0.7)"/>
            <rect x="68"  y="-86" width="22" height="22" fill="rgba(251,191,36,0.7)"/>
            <!-- Tiny dancing silhouettes through the windows -->
            <g fill="#0a0d1a">
              <ellipse cx="-75" cy="-75" rx="3" ry="6"/><ellipse cx="-75" cy="-82" rx="2.5" ry="2.5"/>
              <ellipse cx="-47" cy="-75" rx="3" ry="6"/><ellipse cx="-47" cy="-82" rx="2.5" ry="2.5"/>
              <ellipse cx="51"  cy="-75" rx="3" ry="6"/><ellipse cx="51"  cy="-82" rx="2.5" ry="2.5"/>
              <ellipse cx="79"  cy="-75" rx="3" ry="6"/><ellipse cx="79"  cy="-82" rx="2.5" ry="2.5"/>
            </g>
            <!-- Musical notes drifting out -->
            <g fill="rgba(251,191,36,0.85)">
              <text x="0"   y="-180" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="20">♪</text>
              <text x="-44" y="-200" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="14">♫</text>
              <text x="36"  y="-210" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="16">♪</text>
              <text x="-22" y="-230" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12">♫</text>
            </g>
          </g>
          <!-- Warm pool of light from the open door spilling onto the yard -->
          <radialGradient id="pobDoor" cx="0.5" cy="0.5" r="0.55">
            <stop offset="0%" stop-color="rgba(251,191,36,0.4)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.12)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="560" cy="400" rx="180" ry="50" fill="url(#pobDoor)"/>
          <!-- Field on the left, in deeper shadow -->
          <path d="M 0 380 Q 300 360 600 380 L 600 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Older brother standing in the dark just OUTSIDE the light, arms crossed -->
          <g transform="translate(280 410)">
            <path d="M -16 0 Q -14 -44 0 -54 Q 14 -44 16 0 Z" fill="#0a0d1a" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
            <ellipse cx="0" cy="-64" rx="12" ry="14" fill="#0a0d1a"/>
            <!-- Beard, taut -->
            <path d="M -8 -56 Q 0 -44 8 -56" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Arms crossed, tightly -->
            <path d="M -16 -32 Q 0 -22 16 -32" stroke="#0a0d1a" stroke-width="7" fill="none"/>
            <!-- Pitchfork leaning beside him -->
            <line x1="20" y1="-50" x2="34" y2="20" stroke="#3d2a16" stroke-width="3"/>
            <line x1="32" y1="-52" x2="38" y2="-50" stroke="#3d2a16" stroke-width="2"/>
            <line x1="34" y1="-52" x2="34" y2="-46" stroke="#3d2a16" stroke-width="2"/>
            <line x1="36" y1="-52" x2="30" y2="-50" stroke="#3d2a16" stroke-width="2"/>
            <!-- Halo absent — he is in shadow -->
          </g>
          <!-- Father just stepped OUT the door, half-lit, hand outstretched toward older brother -->
          <g transform="translate(440 400)">
            <path d="M -14 0 Q -12 -42 0 -52 Q 12 -42 14 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-60" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -9 -52 Q 0 -36 9 -52" stroke="rgba(254,243,199,0.7)" stroke-width="1.8" fill="none"/>
            <!-- Arm extended toward older brother -->
            <line x1="-12" y1="-30" x2="-50" y2="-22" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Big halo -->
            <circle cx="0" cy="-60" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.7"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Son · you are always with me · everything I have is yours"</text>
        </svg>`
      }
    ],
    closing: 'There are two lost sons in this parable, not one. The younger one is lost in a far country — wasted on wine and women and bad friends. The older one is lost in the field, three feet from the house — wasted on resentment and a ledger he has been keeping his whole life. The father runs out for both. The story is left open on purpose: Jesus does not tell us whether the older brother went in. Because the religious teachers he was telling the story to needed to decide that for themselves. So do we.',
    closingPrompt: 'Which son in the parable are you closer to today — the one in the far country, or the one in the dark yard refusing to come in — and what does the Father\'s voice sound like to you right now?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 23 — The Good Samaritan
  // ════════════════════════════════════════════════════════════
  {
    id: 'good-samaritan',
    title: 'The Good Samaritan',
    subtitle: 'Two religious men kept walking. A foreigner stopped.',
    icon: '❤️',
    color: '#f87171',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Luke 10:25-37',
    duration: '~6 min',
    scenes: [
      {
        id: 'lawyers-question',
        title: 'Who is My Neighbor?',
        scriptureRef: 'Luke 10:25-29',
        bibleText: '"And who is my neighbor?"',
        narration: 'An expert in the Law stood up to test Jesus. "Teacher, what must I do to inherit eternal life?" Jesus turned it back on him: "What is written in the Law? How do you read it?" The man answered correctly: "Love the Lord your God with all your heart, soul, strength, and mind — and love your neighbor as yourself." "You have answered well," Jesus said. "Do this and you will live." But the lawyer was not done. He wanted to look clever. He wanted to limit the field. "And who exactly," he asked, "is my neighbor?" In reply, Jesus told a story.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gsq', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Soft warm light from above on Jesus -->
          <radialGradient id="gsqHalo" cx="0.5" cy="0.4" r="0.55">
            <stop offset="0%" stop-color="rgba(254,243,199,0.5)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.18)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="240" rx="380" ry="220" fill="url(#gsqHalo)"/>
          <!-- A teaching courtyard with stone steps -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <g fill="#241846" stroke="rgba(251,191,36,0.35)" stroke-width="0.7">
            <rect x="100" y="380" width="600" height="22"/>
            <rect x="140" y="358" width="520" height="22"/>
          </g>
          <!-- Jesus seated/standing center, scroll-handling pose -->
          <g transform="translate(400 360)">
            <path d="M -22 0 Q -18 -44 0 -56 Q 18 -44 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-66" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -58 Q 0 -46 8 -58" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -66 Q -16 -52 -12 -36 M 10 -66 Q 16 -52 12 -36" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- One hand raised in teaching gesture -->
            <line x1="14" y1="-30" x2="32" y2="-50" stroke="#3d2a16" stroke-width="5"/>
            <circle cx="0" cy="-66" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <circle cx="0" cy="-66" r="40" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1"/>
          </g>
          <!-- The lawyer standing apart, scroll in hand, hand on hip (questioning) -->
          <g transform="translate(200 370)">
            <path d="M -16 0 Q -14 -46 0 -56 Q 14 -46 16 0 Z" fill="#0a0d1a" stroke="rgba(254,243,199,0.45)" stroke-width="1"/>
            <ellipse cx="0" cy="-66" rx="11" ry="13" fill="#0a0d1a"/>
            <!-- Tefillin / fancy hat hint -->
            <rect x="-9" y="-80" width="18" height="6" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="0.5"/>
            <!-- Beard -->
            <path d="M -7 -58 Q 0 -42 7 -58" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
            <!-- Hand on hip -->
            <line x1="-14" y1="-30" x2="-22" y2="-14" stroke="#0a0d1a" stroke-width="4"/>
            <!-- Other hand holding a scroll -->
            <line x1="14" y1="-28" x2="22" y2="-14" stroke="#0a0d1a" stroke-width="4"/>
            <rect x="22" y="-20" width="14" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <text x="29" y="-9" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="5" fill="#3d2a16">LAW</text>
          </g>
          <!-- Small crowd listening -->
          <g fill="#0a0d1a" opacity="0.7">
            <g transform="translate(560 410)"><ellipse cx="0" cy="0" rx="6" ry="14"/><ellipse cx="0" cy="-16" rx="5" ry="6"/></g>
            <g transform="translate(600 412)"><ellipse cx="0" cy="0" rx="6" ry="14"/><ellipse cx="0" cy="-16" rx="5" ry="6"/></g>
            <g transform="translate(640 410)"><ellipse cx="0" cy="0" rx="6" ry="14"/><ellipse cx="0" cy="-16" rx="5" ry="6"/></g>
            <g transform="translate(680 412)"><ellipse cx="0" cy="0" rx="6" ry="14"/><ellipse cx="0" cy="-16" rx="5" ry="6"/></g>
          </g>
          <!-- Floating question banner -->
          <text x="400" y="100" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="24" letter-spacing="4" fill="rgba(251,191,36,0.85)">"WHO IS MY NEIGHBOR?"</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">A question asked to draw a smaller circle. Jesus drew a larger one.</text>
        </svg>`
      },
      {
        id: 'road-robbery',
        title: 'The Road to Jericho',
        scriptureRef: 'Luke 10:30',
        bibleText: '"A man was going down from Jerusalem to Jericho, when he was attacked by robbers. They stripped him of his clothes, beat him and went away, leaving him half dead."',
        narration: 'The road from Jerusalem to Jericho dropped three thousand feet in seventeen miles. It coiled through stark limestone gorges. Bandits hid in the rocks. Everyone in the audience knew about that road. A man was going down it — Jesus did not bother to say what kind of man, what nationality, what occupation, what reputation. Just: a man. Bandits jumped him. They stripped him of his clothes, beat him, took everything, and walked away — leaving him half dead in the dust by the side of the road.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gsr', skyTop:'#3d2a5e', skyMid:'#fbbf24', skyBot:'#3d2a16', stars:false})}
          <ellipse cx="120" cy="120" r="32" fill="#fef3c7"/>
          <ellipse cx="120" cy="120" r="48" fill="rgba(251,113,38,0.4)"/>
          <!-- Steep limestone walls of the Wadi Qelt gorge -->
          <g fill="#3d2a16" stroke="rgba(254,243,199,0.4)" stroke-width="0.7">
            <polygon points="0,500 0,180 80,200 140,300 100,500"/>
            <polygon points="800,500 800,180 720,210 660,310 700,500"/>
            <polygon points="160,500 200,360 260,420 240,500"/>
            <polygon points="640,500 600,360 540,420 560,500"/>
          </g>
          <!-- Coiled road dropping through the gorge -->
          <path d="M 200 200 Q 280 240 240 300 Q 200 360 320 400 Q 440 440 500 460" stroke="rgba(254,243,199,0.55)" stroke-width="8" fill="none"/>
          <path d="M 200 200 Q 280 240 240 300 Q 200 360 320 400 Q 440 440 500 460" stroke="rgba(254,243,199,0.85)" stroke-width="3" fill="none" stroke-dasharray="6 8"/>
          <!-- "JERUSALEM" label at top of road -->
          <text x="160" y="180" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.7)">JERUSALEM</text>
          <text x="540" y="478" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.7)">JERICHO →</text>
          <!-- Robbers fleeing down the slope (small silhouettes, mid-run) -->
          <g fill="#0a0d1a">
            <g transform="translate(620 410)">
              <ellipse cx="0" cy="-4" rx="6" ry="14" transform="rotate(-15 0 -4)"/>
              <ellipse cx="-2" cy="-18" rx="5" ry="6"/>
              <line x1="-4" y1="8" x2="-12" y2="22" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="2"  y1="8" x2="8"  y2="22" stroke="#0a0d1a" stroke-width="3"/>
              <!-- Sack on back -->
              <ellipse cx="-12" cy="-8" rx="6" ry="8" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="0.6"/>
            </g>
            <g transform="translate(660 420)" opacity="0.85">
              <ellipse cx="0" cy="-4" rx="6" ry="14" transform="rotate(-12 0 -4)"/>
              <ellipse cx="-2" cy="-18" rx="5" ry="6"/>
              <line x1="-4" y1="8" x2="-12" y2="22" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="2"  y1="8" x2="8"  y2="22" stroke="#0a0d1a" stroke-width="3"/>
            </g>
          </g>
          <!-- The victim left on the side of the road, half-dead, naked -->
          <g transform="translate(360 405) rotate(-15)">
            <!-- Body, sprawled -->
            <ellipse cx="0" cy="0" rx="50" ry="14" fill="#3d2a16" stroke="rgba(254,243,199,0.35)" stroke-width="0.8" stroke-dasharray="3 3"/>
            <ellipse cx="-44" cy="-6" rx="12" ry="14" fill="#1a1233"/>
            <!-- Wound stains (blood) -->
            <ellipse cx="-20" cy="-8" rx="6" ry="3" fill="rgba(120,20,20,0.7)"/>
            <ellipse cx="10"  cy="-4" rx="5" ry="2" fill="rgba(120,20,20,0.7)"/>
            <ellipse cx="36"  cy="2" rx="4" ry="2"  fill="rgba(120,20,20,0.7)"/>
            <!-- Limp arm thrown out -->
            <line x1="40" y1="0" x2="58" y2="6" stroke="#3d2a16" stroke-width="5"/>
            <!-- Halo absent (no dignity remains in the moment) -->
          </g>
          <!-- A few coins / a torn cloak scattered nearby -->
          <g>
            <circle cx="280" cy="425" r="3" fill="rgba(251,191,36,0.9)"/>
            <circle cx="300" cy="438" r="3" fill="rgba(251,191,36,0.9)"/>
            <path d="M 240 442 Q 260 444 280 440" stroke="rgba(254,243,199,0.5)" stroke-width="2" fill="none"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"They beat him · and left him half dead"</text>
        </svg>`
      },
      {
        id: 'priest-and-levite',
        title: 'The Priest and the Levite Pass By',
        scriptureRef: 'Luke 10:31-32',
        bibleText: '"A priest happened to be going down the same road, and when he saw the man, he passed by on the other side. So too, a Levite, when he came to the place and saw him, passed by on the other side."',
        narration: 'A priest came down the road first. He had been serving in the temple. He had reasons. If the man was already dead, touching him would make the priest ceremonially unclean for a week. He could not afford that. He looked, and then he looked away, and then he crossed to the other side. A Levite came after — temple staff, an assistant to the priests, a man of God by every visible standard. He also saw. He also crossed over. Both men, in their robes, in their dignity, in their good standing with the religion, passed by their bleeding countryman in the dust.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gsp', skyTop:'#3d2a5e', skyMid:'#5a4378', skyBot:'#fbbf24', stars:false})}
          <!-- Wadi rocks -->
          <g fill="#3d2a16" opacity="0.85">
            <polygon points="0,360 60,280 140,320 100,360"/>
            <polygon points="700,360 760,280 800,360"/>
          </g>
          <!-- Road running across mid-frame — TWO lanes implied -->
          <path d="M 0 380 Q 400 376 800 380" stroke="rgba(254,243,199,0.55)" stroke-width="8" fill="none"/>
          <path d="M 0 420 Q 400 416 800 420" stroke="rgba(254,243,199,0.55)" stroke-width="8" fill="none"/>
          <line x1="0" y1="400" x2="800" y2="400" stroke="rgba(254,243,199,0.4)" stroke-width="1" stroke-dasharray="6 6"/>
          <!-- Ground beneath -->
          <rect x="0" y="440" width="800" height="60" fill="#241846"/>
          <!-- The wounded man on the lower lane (closer to viewer) -->
          <g transform="translate(400 432) rotate(-15)">
            <ellipse cx="0" cy="0" rx="44" ry="12" fill="#3d2a16" stroke="rgba(254,243,199,0.35)" stroke-width="0.8" stroke-dasharray="3 3"/>
            <ellipse cx="-38" cy="-4" rx="10" ry="12" fill="#1a1233"/>
            <ellipse cx="-16" cy="-6" rx="5" ry="2" fill="rgba(120,20,20,0.7)"/>
            <ellipse cx="10"  cy="-3" rx="4" ry="2" fill="rgba(120,20,20,0.7)"/>
            <line x1="34" y1="0" x2="48" y2="4" stroke="#3d2a16" stroke-width="4"/>
          </g>
          <!-- PRIEST walking on the UPPER lane (the other side), head down/averted -->
          <g transform="translate(280 360)">
            <!-- Long white-trim priestly robe -->
            <path d="M -14 0 Q -14 -50 0 -60 Q 14 -50 14 0 Z" fill="#fef3c7" opacity="0.85" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <!-- Blue trim -->
            <line x1="-14" y1="-4" x2="14" y2="-4" stroke="rgba(56,189,248,0.8)" stroke-width="1.4"/>
            <line x1="-14" y1="-2" x2="14" y2="-2" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <ellipse cx="0" cy="-70" rx="10" ry="12" fill="#1a1233"/>
            <!-- Turban / priestly headwear -->
            <ellipse cx="0" cy="-80" rx="11" ry="6" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <!-- Beard -->
            <path d="M -7 -62 Q 0 -48 7 -62" stroke="rgba(251,191,36,0.7)" stroke-width="1.4" fill="none"/>
            <!-- Eyes deliberately AWAY (face turned to the right, away from the body) -->
            <line x1="3" y1="-72" x2="5" y2="-72" stroke="rgba(120,20,20,0.7)" stroke-width="0.8"/>
            <!-- Hand lifting hem of robe to step further away -->
            <line x1="-12" y1="-22" x2="-22" y2="-2" stroke="#fef3c7" stroke-width="4"/>
            <!-- No halo -->
          </g>
          <text x="280" y="330" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.7)">PRIEST</text>
          <!-- LEVITE walking on the upper lane too, slightly behind the priest, head averted -->
          <g transform="translate(540 366)">
            <path d="M -13 0 Q -13 -48 0 -58 Q 13 -48 13 0 Z" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <!-- Sash -->
            <line x1="-13" y1="-12" x2="13" y2="-12" stroke="rgba(251,191,36,0.85)" stroke-width="1.5"/>
            <ellipse cx="0" cy="-68" rx="10" ry="12" fill="#1a1233"/>
            <!-- Cap -->
            <path d="M -10 -76 Q 0 -86 10 -76 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <!-- Beard -->
            <path d="M -7 -60 Q 0 -48 7 -60" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Hand pressed to the side of his face to NOT see -->
            <line x1="-12" y1="-44" x2="-6" y2="-66" stroke="#241846" stroke-width="4"/>
            <!-- No halo -->
          </g>
          <text x="540" y="330" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.7)">LEVITE</text>
          <!-- Arrows showing they crossed to the FAR lane -->
          <g stroke="rgba(248,113,113,0.55)" stroke-width="1.2" fill="none" stroke-dasharray="3 4">
            <path d="M 280 370 Q 290 400 308 416"/>
            <path d="M 540 370 Q 552 400 568 416"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"He passed by on the other side"</text>
        </svg>`
      },
      {
        id: 'samaritan-stops',
        title: 'The Samaritan Stopped',
        scriptureRef: 'Luke 10:33-35',
        bibleText: '"But a Samaritan, as he traveled, came where the man was; and when he saw him, he took pity on him. He went to him and bandaged his wounds, pouring on oil and wine. Then he put the man on his own donkey, brought him to an inn and took care of him."',
        narration: 'Then came a Samaritan. The lawyer in the audience would have winced just hearing the word. Samaritans were the wrong religion, the wrong bloodline, the wrong politics. A Samaritan would have been one of the LAST people anyone in his audience would have wanted to be saved by. And he stopped. He went to him. He took pity on him. He poured oil and wine into his wounds. He bandaged them. He lifted the broken stranger onto his own donkey and walked beside him to the next inn. He paid the innkeeper two days\' wages and promised to cover anything else when he came back. Jesus turned to the lawyer. "Which of these three was a neighbor to the man who fell among robbers?" The man could not even bring himself to say the word Samaritan. "The one who showed him mercy." "Go," Jesus said, "and do likewise."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gss', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Warm afternoon light bathing the scene -->
          <radialGradient id="gssGlow" cx="0.45" cy="0.55" r="0.5">
            <stop offset="0%" stop-color="rgba(254,243,199,0.65)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.25)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="380" cy="320" rx="380" ry="260" fill="url(#gssGlow)"/>
          <!-- Roadside cliff face on the right -->
          <g fill="#3d2a16" opacity="0.85">
            <polygon points="800,500 800,180 680,220 700,500"/>
            <polygon points="660,500 600,360 540,420 560,500"/>
          </g>
          <!-- Road -->
          <path d="M 0 410 Q 400 400 800 410" stroke="rgba(254,243,199,0.55)" stroke-width="8" fill="none"/>
          <!-- Ground -->
          <rect x="0" y="430" width="800" height="70" fill="#241846"/>
          <!-- The wounded man, now propped up slightly (about to be lifted) -->
          <g transform="translate(420 430)">
            <ellipse cx="0" cy="0" rx="44" ry="12" fill="#3d2a16" stroke="rgba(254,243,199,0.55)" stroke-width="0.8"/>
            <ellipse cx="-36" cy="-8" rx="11" ry="13" fill="#1a1233"/>
            <!-- Eyes faintly open -->
            <line x1="-40" y1="-12" x2="-37" y2="-12" stroke="rgba(254,243,199,0.7)" stroke-width="0.8"/>
            <line x1="-34" y1="-12" x2="-31" y2="-12" stroke="rgba(254,243,199,0.7)" stroke-width="0.8"/>
            <!-- Fresh bandages (white) -->
            <rect x="-22" y="-12" width="14" height="6" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.6"/>
            <rect x="-6"  y="-10" width="14" height="6" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.6"/>
            <rect x="16"  y="-8"  width="14" height="6" fill="#fef3c7" stroke="rgba(251,191,36,0.7)" stroke-width="0.6"/>
            <!-- Halo returning -->
            <circle cx="-36" cy="-8" r="20" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
          </g>
          <!-- The Samaritan kneeling beside, pouring from a flask -->
          <g transform="translate(310 390)">
            <!-- Body, kneeling -->
            <path d="M -16 30 Q -14 -20 0 -32 Q 14 -20 16 30 Z" fill="#5a4378" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <!-- Distinctive Samaritan headwrap / different from Levite cap -->
            <path d="M -12 -42 Q 0 -56 12 -42 Q 14 -32 0 -28 Q -14 -32 -12 -42 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <line x1="-12" y1="-42" x2="-22" y2="-30" stroke="rgba(251,191,36,0.85)" stroke-width="1.5"/>
            <line x1="12"  y1="-42" x2="22" y2="-30" stroke="rgba(251,191,36,0.85)" stroke-width="1.5"/>
            <!-- Head/face under wrap -->
            <ellipse cx="0" cy="-36" rx="9" ry="10" fill="#1a1233"/>
            <!-- Beard -->
            <path d="M -7 -30 Q 0 -20 7 -30" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Bent arm holding flask, pouring -->
            <line x1="14" y1="-8" x2="44" y2="20" stroke="#5a4378" stroke-width="5"/>
            <g transform="translate(48 22) rotate(40)">
              <ellipse cx="0" cy="0" rx="8" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.2"/>
              <ellipse cx="0" cy="-12" rx="4" ry="3" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="0.7"/>
            </g>
            <!-- Oil/wine pouring -->
            <path d="M 56 32 Q 60 44 80 50" stroke="rgba(251,191,36,0.9)" stroke-width="2.5" fill="none"/>
            <g fill="rgba(251,191,36,0.85)">
              <circle cx="80" cy="52" r="2"/>
              <circle cx="76" cy="48" r="1.5"/>
            </g>
            <!-- Halo (BRIGHT — the one with mercy) -->
            <circle cx="0" cy="-36" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <circle cx="0" cy="-36" r="34" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <!-- The Samaritan's donkey waiting patiently behind him -->
          <g transform="translate(200 410)">
            <ellipse cx="0" cy="0" rx="36" ry="14" fill="#3d2a16"/>
            <line x1="-22" y1="14" x2="-22" y2="32" stroke="#3d2a16" stroke-width="4"/>
            <line x1="-8"  y1="14" x2="-8"  y2="32" stroke="#3d2a16" stroke-width="4"/>
            <line x1="8"   y1="14" x2="8"   y2="32" stroke="#3d2a16" stroke-width="4"/>
            <line x1="22"  y1="14" x2="22"  y2="32" stroke="#3d2a16" stroke-width="4"/>
            <ellipse cx="-36" cy="-8" rx="9" ry="6" fill="#3d2a16"/>
            <line x1="-41" y1="-13" x2="-44" y2="-22" stroke="#3d2a16" stroke-width="2.5"/>
            <line x1="-32" y1="-13" x2="-30" y2="-22" stroke="#3d2a16" stroke-width="2.5"/>
            <!-- Saddle blanket and a coin purse hanging from saddle -->
            <rect x="-14" y="-10" width="28" height="8" fill="#5a4378" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            <ellipse cx="14" cy="2" rx="7" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <circle cx="14" cy="2" r="2" fill="rgba(251,191,36,0.85)"/>
          </g>
          <!-- Coins falling from purse (the two denarii he'll pay the innkeeper) -->
          <g fill="rgba(251,191,36,0.95)" stroke="#fef3c7" stroke-width="0.5">
            <circle cx="232" cy="416" r="3"/>
            <circle cx="244" cy="420" r="3"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Go · and do likewise"</text>
        </svg>`
      }
    ],
    closing: 'The story Jesus told was not designed to teach the lawyer how to find a worthy neighbor. It was designed to dismantle the question. The man on the ground was not Jewish, not righteous, not anybody — he was just a wounded human being. The Samaritan was, in the lawyer\'s framework, a worse-than-stranger. And mercy crossed every line that religion had drawn that morning. Jesus does not give you a list of who counts as your neighbor. He shows you the kind of person who BECOMES a neighbor by what they do when someone is bleeding in the road. Go and do likewise.',
    closingPrompt: 'Who is the "Samaritan" you have been keeping outside your circle of obligation — and who is the "man in the road" your week is currently crossing the street to avoid?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 24 — The Ten Plagues & the Red Sea
  // ════════════════════════════════════════════════════════════
  {
    id: 'plagues-red-sea',
    title: 'The Ten Plagues & the Red Sea',
    subtitle: "Pharaoh's heart against the God who made the Nile.",
    icon: '🌊',
    color: '#38bdf8',
    accentColor: '#fef3c7',
    era: 'exodus-conquest',
    scriptureRef: 'Exodus 7-14',
    duration: '~8 min',
    scenes: [
      {
        id: 'pharaohs-court',
        title: "Let My People Go",
        scriptureRef: 'Exodus 7:8-13',
        bibleText: '"Aaron threw his staff down in front of Pharaoh and his officials, and it became a snake. Pharaoh then summoned wise men and sorcerers, and the Egyptian magicians also did the same things by their secret arts."',
        narration: 'Moses and Aaron walked into the throne room of the most powerful king in the world and said, "The Lord, the God of Israel, says: let my people go." Pharaoh laughed. Aaron threw down his staff. It became a serpent. Pharaoh\'s magicians threw down their staffs — and theirs became serpents too. Then Aaron\'s serpent swallowed every one of them. Pharaoh\'s face did not change. The contest had begun.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pcp', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#3d2a16', stars:false})}
          <!-- Massive Egyptian columns with lotus capitals -->
          <g fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2">
            <rect x="60" y="80" width="40" height="380"/>
            <rect x="700" y="80" width="40" height="380"/>
            <!-- Lotus capital -->
            <path d="M 50 80 Q 80 60 110 80 L 100 90 L 60 90 Z" fill="#241846"/>
            <path d="M 690 80 Q 720 60 750 80 L 740 90 L 700 90 Z" fill="#241846"/>
            <!-- Hieroglyph bands -->
            <line x1="60"  y1="180" x2="100" y2="180" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <line x1="60"  y1="260" x2="100" y2="260" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <line x1="700" y1="180" x2="740" y2="180" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <line x1="700" y1="260" x2="740" y2="260" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
          </g>
          <!-- Throne dais -->
          <path d="M 320 320 L 480 320 L 470 400 L 330 400 Z" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
          <!-- Pharaoh seated, double crown + crook & flail -->
          <g transform="translate(400 320)">
            <rect x="-32" y="-50" width="64" height="44" fill="#3d2a5e" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="0" cy="-20" rx="20" ry="28" fill="#1a1233"/>
            <ellipse cx="0" cy="-58" rx="14" ry="16" fill="#1a1233"/>
            <!-- Double crown (white + red) -->
            <path d="M -10 -72 L -10 -86 L 10 -86 L 10 -72 Z" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <path d="M -10 -86 Q 0 -100 10 -86 Z" fill="rgba(251,113,38,0.9)" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <!-- Crook & flail crossed on chest -->
            <line x1="-18" y1="-28" x2="-8" y2="-4" stroke="rgba(251,191,36,0.9)" stroke-width="2.5"/>
            <line x1="18"  y1="-28" x2="8" y2="-4" stroke="rgba(251,191,36,0.9)" stroke-width="2.5"/>
            <path d="M -18 -28 Q -22 -34 -16 -36" stroke="rgba(251,191,36,0.9)" stroke-width="2" fill="none"/>
          </g>
          <!-- Aaron's serpent (large, swallowing the others) -->
          <g>
            <path d="M 220 410 Q 280 390 360 420 Q 440 450 480 420 Q 520 390 580 410" stroke="#3d2a16" stroke-width="14" fill="none" stroke-linecap="round"/>
            <path d="M 220 410 Q 280 390 360 420 Q 440 450 480 420 Q 520 390 580 410" stroke="rgba(251,191,36,0.55)" stroke-width="2" fill="none" stroke-dasharray="6 8"/>
            <!-- Head -->
            <ellipse cx="218" cy="408" rx="14" ry="10" fill="#3d2a16"/>
            <circle cx="212" cy="406" r="2" fill="#fb923c"/>
            <!-- Forked tongue -->
            <line x1="208" y1="408" x2="198" y2="404" stroke="rgba(251,113,38,0.85)" stroke-width="1.5"/>
            <line x1="208" y1="408" x2="198" y2="412" stroke="rgba(251,113,38,0.85)" stroke-width="1.5"/>
            <!-- Bulges where two smaller serpents have been swallowed -->
            <ellipse cx="380" cy="420" rx="22" ry="10" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <ellipse cx="500" cy="418" rx="20" ry="9" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
          </g>
          <!-- Moses and Aaron standing left, staff still extended -->
          <g transform="translate(140 410)">
            <ellipse cx="0" cy="0" rx="11" ry="30" fill="#1a1233"/>
            <ellipse cx="0" cy="-32" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -9 -24 Q 0 -10 9 -24" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <!-- Beard long -->
            <path d="M -7 -20 Q 0 -2 7 -20" stroke="rgba(254,243,199,0.7)" stroke-width="1.4" fill="none"/>
            <!-- Staff extended -->
            <line x1="11" y1="-18" x2="40" y2="-46" stroke="#3d2a16" stroke-width="3"/>
            <circle cx="0" cy="-32" r="22" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <g transform="translate(180 415)">
            <ellipse cx="0" cy="0" rx="10" ry="28" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-30" rx="10" ry="12" fill="#0a0d1a"/>
            <path d="M -8 -22 Q 0 -6 8 -22" stroke="rgba(254,243,199,0.6)" stroke-width="1.3" fill="none"/>
          </g>
          <!-- Egyptian magicians on the right side, recoiling -->
          <g fill="#0a0d1a" opacity="0.7">
            <g transform="translate(630 415)">
              <ellipse cx="0" cy="0" rx="9" ry="26"/>
              <ellipse cx="0" cy="-26" rx="8" ry="10"/>
              <line x1="-8" y1="-14" x2="-22" y2="-22" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(670 418)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-24" rx="8" ry="9"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Let my people go"</text>
        </svg>`
      },
      {
        id: 'plagues',
        title: 'Ten Plagues on Egypt',
        scriptureRef: 'Exodus 7-12',
        bibleText: '"By this you will know that I am the Lord."',
        narration: 'One by one the plagues came. The Nile turned to blood. Frogs covered the land. Gnats and flies darkened the sky. Livestock died. Boils broke out on the magicians themselves. Hail mixed with fire crushed the fields. Locusts ate everything the hail had left. Three days of darkness so thick it could be felt. Each plague was a strike at one of Egypt\'s gods. Each time Pharaoh almost relented and each time he hardened his heart again. Until the final and most terrible one: at midnight, the firstborn in every house in Egypt died — except the houses marked with the blood of a lamb on the doorpost.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'plg', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- 10-cell grid of plague icons -->
          <g font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.7)" text-anchor="middle">
            <!-- 1. Blood -->
            <g transform="translate(120 130)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(120,20,20,0.25)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <path d="M -10 -40 Q -10 -10 0 0 Q 10 -10 10 -40 Q 0 -50 -10 -40 Z" fill="rgba(120,20,20,0.9)"/>
              <ellipse cx="0" cy="-2" rx="6" ry="2" fill="rgba(120,20,20,0.8)"/>
              <text y="30">1 · BLOOD</text>
            </g>
            <!-- 2. Frogs -->
            <g transform="translate(240 130)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(34,197,94,0.18)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <ellipse cx="-10" cy="-10" rx="11" ry="7" fill="#22c55e"/>
              <circle cx="-15" cy="-14" r="2" fill="#fef3c7"/>
              <circle cx="-5" cy="-14" r="2" fill="#fef3c7"/>
              <ellipse cx="14" cy="0" rx="8" ry="5" fill="#22c55e" opacity="0.7"/>
              <text y="30">2 · FROGS</text>
            </g>
            <!-- 3. Gnats -->
            <g transform="translate(360 130)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(56,189,248,0.1)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <g fill="#0a0d1a">
                <circle cx="-22" cy="-30" r="1.5"/><circle cx="-10" cy="-20" r="1.5"/>
                <circle cx="0" cy="-30" r="1.5"/><circle cx="12" cy="-22" r="1.5"/>
                <circle cx="24" cy="-32" r="1.5"/><circle cx="-18" cy="-8" r="1.5"/>
                <circle cx="6"  cy="-12" r="1.5"/><circle cx="20" cy="-8" r="1.5"/>
                <circle cx="-30" cy="-18" r="1.5"/><circle cx="14" cy="-2" r="1.5"/>
              </g>
              <text y="30">3 · GNATS</text>
            </g>
            <!-- 4. Flies -->
            <g transform="translate(480 130)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(74,52,32,0.3)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <g fill="#0a0d1a">
                <ellipse cx="-22" cy="-30" rx="3" ry="1.6"/>
                <ellipse cx="-8" cy="-18" rx="3" ry="1.6"/>
                <ellipse cx="10" cy="-26" rx="3" ry="1.6"/>
                <ellipse cx="24" cy="-12" rx="3" ry="1.6"/>
                <ellipse cx="-18" cy="-6" rx="3" ry="1.6"/>
                <ellipse cx="18" cy="-2" rx="3" ry="1.6"/>
              </g>
              <text y="30">4 · FLIES</text>
            </g>
            <!-- 5. Livestock -->
            <g transform="translate(600 130)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(74,52,32,0.2)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <ellipse cx="0" cy="-12" rx="22" ry="9" fill="#1a1233"/>
              <ellipse cx="-22" cy="-16" rx="7" ry="6" fill="#1a1233"/>
              <line x1="-12" y1="-2" x2="-12" y2="6" stroke="#1a1233" stroke-width="2"/>
              <line x1="12"  y1="-2" x2="12"  y2="6" stroke="#1a1233" stroke-width="2"/>
              <!-- X over -->
              <line x1="-26" y1="-26" x2="26" y2="6" stroke="rgba(248,113,113,0.85)" stroke-width="2"/>
              <line x1="-26" y1="6"  x2="26" y2="-26" stroke="rgba(248,113,113,0.85)" stroke-width="2"/>
              <text y="30">5 · LIVESTOCK</text>
            </g>
            <!-- 6. Boils -->
            <g transform="translate(120 270)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(120,20,20,0.15)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <ellipse cx="0" cy="-14" rx="12" ry="20" fill="rgba(254,243,199,0.55)"/>
              <g fill="rgba(120,20,20,0.85)">
                <circle cx="-3" cy="-26" r="2"/><circle cx="5"  cy="-22" r="2.5"/>
                <circle cx="-4" cy="-14" r="2"/><circle cx="6"  cy="-10" r="2"/>
                <circle cx="-2" cy="0"   r="2"/><circle cx="4"  cy="6"   r="2"/>
              </g>
              <text y="30">6 · BOILS</text>
            </g>
            <!-- 7. Hail+Fire -->
            <g transform="translate(240 270)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(56,189,248,0.18)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <g fill="rgba(254,243,199,0.85)" stroke="rgba(56,189,248,0.7)" stroke-width="0.5">
                <circle cx="-20" cy="-30" r="3"/><circle cx="-4" cy="-28" r="3"/>
                <circle cx="12" cy="-32" r="3"/><circle cx="24" cy="-22" r="3"/>
                <circle cx="-12" cy="-14" r="3"/><circle cx="20" cy="-10" r="3"/>
              </g>
              <ellipse cx="0" cy="0" rx="9" ry="14" fill="#fb923c"/>
              <ellipse cx="0" cy="-2" rx="5" ry="8" fill="#fbbf24"/>
              <text y="30">7 · HAIL+FIRE</text>
            </g>
            <!-- 8. Locusts -->
            <g transform="translate(360 270)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(34,197,94,0.18)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <g fill="#22c55e">
                <ellipse cx="-26" cy="-26" rx="5" ry="2" transform="rotate(20 -26 -26)"/>
                <ellipse cx="-10" cy="-20" rx="5" ry="2" transform="rotate(-10 -10 -20)"/>
                <ellipse cx="10" cy="-28" rx="5" ry="2" transform="rotate(15 10 -28)"/>
                <ellipse cx="24" cy="-18" rx="5" ry="2" transform="rotate(-20 24 -18)"/>
                <ellipse cx="-18" cy="-4" rx="5" ry="2" transform="rotate(10 -18 -4)"/>
                <ellipse cx="4" cy="-10" rx="5" ry="2" transform="rotate(-15 4 -10)"/>
                <ellipse cx="22" cy="-2" rx="5" ry="2" transform="rotate(25 22 -2)"/>
              </g>
              <text y="30">8 · LOCUSTS</text>
            </g>
            <!-- 9. Darkness -->
            <g transform="translate(480 270)">
              <rect x="-50" y="-50" width="100" height="86" fill="#000a14" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
              <!-- Just black with faint outline of a hand -->
              <path d="M -10 -10 Q -8 -28 -2 -28 Q 4 -30 6 -28 Q 12 -30 14 -28 Q 20 -28 22 -22 Q 22 -10 16 -2 Q 12 6 0 8 Q -12 6 -10 -10 Z" fill="rgba(254,243,199,0.05)" stroke="rgba(254,243,199,0.18)" stroke-width="0.6"/>
              <text y="30">9 · DARKNESS</text>
            </g>
            <!-- 10. Firstborn -->
            <g transform="translate(600 270)">
              <rect x="-50" y="-50" width="100" height="86" fill="rgba(120,20,20,0.25)" stroke="rgba(248,113,113,0.85)" stroke-width="1.5"/>
              <!-- Door frame with blood on lintel + posts -->
              <g stroke="rgba(120,20,20,0.85)" stroke-width="3" fill="none">
                <line x1="-18" y1="-30" x2="-18" y2="6"/>
                <line x1="18"  y1="-30" x2="18"  y2="6"/>
                <line x1="-18" y1="-30" x2="18"  y2="-30"/>
              </g>
              <!-- Faint figure passing over (angel) -->
              <ellipse cx="0" cy="-32" rx="22" ry="6" fill="rgba(254,243,199,0.18)"/>
              <text y="30" fill="rgba(248,113,113,0.95)">10 · FIRSTBORN</text>
            </g>
          </g>
          <text x="400" y="450" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"By this you will know that I am the Lord"</text>
        </svg>`
      },
      {
        id: 'passover',
        title: 'The Night of Passover',
        scriptureRef: 'Exodus 12:1-13',
        bibleText: '"When I see the blood, I will pass over you."',
        narration: 'Take a lamb without defect. Slaughter it at twilight. Put some of its blood on the sides and the top of the doorframe. Roast the lamb over fire — head, legs, inner parts — and eat it the same night. Eat it with bitter herbs and bread made without yeast. Eat it in haste, with your cloak tucked into your belt, your sandals on your feet, your staff in your hand. At midnight the angel of death walked through the land and every house that had blood on the doorpost was passed over. Behind every door, a family ate standing up — and waited.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pvr', skyTop:'#0a0d1a', skyMid:'#000a14', skyBot:'#241846', stars:false})}
          <g fill="#fef3c7" opacity="0.4">
            <circle cx="80" cy="50" r="0.7"/><circle cx="200" cy="80" r="0.8"/>
            <circle cx="600" cy="60" r="0.7"/><circle cx="720" cy="90" r="0.8"/>
          </g>
          <!-- Faint dread cloud passing over the rooftops -->
          <ellipse cx="400" cy="80" rx="380" ry="40" fill="rgba(254,243,199,0.12)"/>
          <ellipse cx="400" cy="60" rx="320" ry="22" fill="rgba(254,243,199,0.08)"/>
          <!-- Row of small Hebrew houses, all with blood on doorposts/lintels -->
          <g>
            <!-- House 1 -->
            <g transform="translate(120 360)">
              <rect x="-40" y="-60" width="80" height="60" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <polygon points="-46,-60 0,-90 46,-60" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <rect x="-10" y="-30" width="20" height="30" fill="#0a0d1a"/>
              <!-- Blood on lintel + posts -->
              <g stroke="rgba(120,20,20,0.95)" stroke-width="2.5" fill="none">
                <line x1="-10" y1="-32" x2="10" y2="-32"/>
                <line x1="-10" y1="-30" x2="-10" y2="0"/>
                <line x1="10"  y1="-30" x2="10" y2="0"/>
              </g>
              <!-- Family inside (faint glow + silhouettes) -->
              <rect x="-30" y="-50" width="14" height="14" fill="rgba(251,191,36,0.55)"/>
              <ellipse cx="-23" cy="-43" rx="2" ry="3" fill="#0a0d1a"/>
            </g>
            <!-- House 2 -->
            <g transform="translate(290 360)">
              <rect x="-40" y="-60" width="80" height="60" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <polygon points="-46,-60 0,-90 46,-60" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <rect x="-10" y="-30" width="20" height="30" fill="#0a0d1a"/>
              <g stroke="rgba(120,20,20,0.95)" stroke-width="2.5" fill="none">
                <line x1="-10" y1="-32" x2="10" y2="-32"/>
                <line x1="-10" y1="-30" x2="-10" y2="0"/>
                <line x1="10"  y1="-30" x2="10" y2="0"/>
              </g>
              <rect x="-30" y="-50" width="14" height="14" fill="rgba(251,191,36,0.55)"/>
              <ellipse cx="-23" cy="-43" rx="2" ry="3" fill="#0a0d1a"/>
            </g>
            <!-- House 3 (focus / opened door — family inside eating standing) -->
            <g transform="translate(460 360)">
              <rect x="-50" y="-72" width="100" height="72" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
              <polygon points="-58,-72 0,-110 58,-72" fill="#241846" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
              <!-- Open doorway with warm light flooding out -->
              <rect x="-14" y="-38" width="28" height="38" fill="rgba(251,191,36,0.65)"/>
              <radialGradient id="pvrDoor" cx="0.5" cy="0.5" r="0.45">
                <stop offset="0%" stop-color="rgba(251,113,38,0.5)"/>
                <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
              </radialGradient>
              <ellipse cx="0" cy="0" rx="100" ry="40" fill="url(#pvrDoor)"/>
              <!-- Blood on doorposts -->
              <g stroke="rgba(120,20,20,0.95)" stroke-width="3.5" fill="none">
                <line x1="-14" y1="-40" x2="14" y2="-40"/>
                <line x1="-14" y1="-38" x2="-14" y2="0"/>
                <line x1="14"  y1="-38" x2="14" y2="0"/>
              </g>
              <!-- Family eating standing inside (3 silhouettes) -->
              <g fill="#0a0d1a">
                <ellipse cx="-6" cy="-22" rx="3" ry="10"/>
                <ellipse cx="-6" cy="-32" rx="2.5" ry="3"/>
                <ellipse cx="2"  cy="-20" rx="3" ry="10"/>
                <ellipse cx="2"  cy="-30" rx="2.5" ry="3"/>
                <ellipse cx="10" cy="-18" rx="2.5" ry="8"/>
                <ellipse cx="10" cy="-26" rx="2" ry="2.5"/>
              </g>
              <!-- Staff in hand (small line) -->
              <line x1="-6" y1="-12" x2="-12" y2="0" stroke="#0a0d1a" stroke-width="1"/>
            </g>
            <!-- House 4 -->
            <g transform="translate(630 360)">
              <rect x="-40" y="-60" width="80" height="60" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <polygon points="-46,-60 0,-90 46,-60" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              <rect x="-10" y="-30" width="20" height="30" fill="#0a0d1a"/>
              <g stroke="rgba(120,20,20,0.95)" stroke-width="2.5" fill="none">
                <line x1="-10" y1="-32" x2="10" y2="-32"/>
                <line x1="-10" y1="-30" x2="-10" y2="0"/>
                <line x1="10"  y1="-30" x2="10" y2="0"/>
              </g>
              <rect x="-30" y="-50" width="14" height="14" fill="rgba(251,191,36,0.55)"/>
              <ellipse cx="-23" cy="-43" rx="2" ry="3" fill="#0a0d1a"/>
            </g>
          </g>
          <!-- Egyptian house in the distance — NO blood, dark window, weeping silhouette inside -->
          <g transform="translate(60 380)" opacity="0.8">
            <rect x="-30" y="-50" width="60" height="50" fill="#1a1233" stroke="rgba(248,113,113,0.55)" stroke-width="1"/>
            <polygon points="-36,-50 0,-72 36,-50" fill="#0a0d1a" stroke="rgba(248,113,113,0.55)" stroke-width="1"/>
            <rect x="-8" y="-22" width="16" height="22" fill="rgba(248,113,113,0.25)"/>
            <!-- Lintel WITHOUT blood -->
          </g>
          <g transform="translate(750 380)" opacity="0.8">
            <rect x="-30" y="-50" width="60" height="50" fill="#1a1233" stroke="rgba(248,113,113,0.55)" stroke-width="1"/>
            <polygon points="-36,-50 0,-72 36,-50" fill="#0a0d1a" stroke="rgba(248,113,113,0.55)" stroke-width="1"/>
            <rect x="-8" y="-22" width="16" height="22" fill="rgba(248,113,113,0.25)"/>
          </g>
          <!-- Ground -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"When I see the blood · I will pass over you"</text>
        </svg>`
      },
      {
        id: 'red-sea-crossing',
        title: 'Walls of Water',
        scriptureRef: 'Exodus 14:21-22',
        bibleText: '"Then Moses stretched out his hand over the sea, and all that night the Lord drove the sea back with a strong east wind and turned it into dry land. The waters were divided, and the Israelites went through the sea on dry ground, with a wall of water on their right and on their left."',
        narration: 'Pharaoh changed his mind. He sent six hundred of his best chariots after the slaves who had walked away with his treasures. They cornered them against the sea. The people panicked. Moses said, "Stand still. The Lord will fight for you." Then he stretched out his staff over the water — and the Lord drove back the sea with a strong east wind all that night. The waters piled up on the right and on the left like walls of glass. Two million Israelites walked through on dry ground.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="rscSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="60%" stop-color="#241846"/>
              <stop offset="100%" stop-color="#5a4378"/>
            </linearGradient>
            <linearGradient id="rscWaterLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#1e1846"/>
              <stop offset="100%" stop-color="rgba(56,189,248,0.65)"/>
            </linearGradient>
            <linearGradient id="rscWaterRight" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stop-color="#1e1846"/>
              <stop offset="100%" stop-color="rgba(56,189,248,0.65)"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#rscSky)"/>
          <!-- Pillar of fire / pillar of cloud above the path -->
          <g transform="translate(400 80)">
            <ellipse cx="0" cy="60" rx="60" ry="40" fill="rgba(254,243,199,0.4)"/>
            <ellipse cx="0" cy="20" rx="40" ry="22" fill="rgba(251,191,36,0.55)"/>
            <ellipse cx="0" cy="-10" rx="22" ry="14" fill="#fb923c"/>
            <ellipse cx="0" cy="-26" rx="12" ry="9" fill="#fef3c7"/>
            <!-- Beam straight down -->
            <polygon points="-12,80 -22,420 22,420 12,80" fill="rgba(251,191,36,0.18)"/>
          </g>
          <!-- LEFT wall of water — tall, vertical, glassy -->
          <g transform="translate(160 320)">
            <path d="M -160 -200 L 0 -200 L 0 80 L -160 80 Z" fill="url(#rscWaterLeft)" stroke="rgba(254,243,199,0.65)" stroke-width="2"/>
            <!-- Wave foam at top -->
            <path d="M -160 -200 Q -120 -208 -80 -200 Q -40 -212 0 -200" stroke="rgba(254,243,199,0.85)" stroke-width="3" fill="none"/>
            <!-- Internal swirls / hint of fish -->
            <g fill="none" stroke="rgba(254,243,199,0.25)" stroke-width="1">
              <path d="M -130 -140 Q -100 -130 -70 -150"/>
              <path d="M -140 -70  Q -100 -60  -60 -80"/>
              <path d="M -130 0    Q -90 10    -50 -10"/>
            </g>
            <!-- A tiny fish silhouette suspended -->
            <g fill="#1a1233">
              <path d="M -90 -100 Q -84 -104 -78 -100 L -74 -103 L -74 -97 Z"/>
            </g>
          </g>
          <!-- RIGHT wall of water -->
          <g transform="translate(640 320)">
            <path d="M 0 -200 L 160 -200 L 160 80 L 0 80 Z" fill="url(#rscWaterRight)" stroke="rgba(254,243,199,0.65)" stroke-width="2"/>
            <path d="M 0 -200 Q 40 -208 80 -200 Q 120 -212 160 -200" stroke="rgba(254,243,199,0.85)" stroke-width="3" fill="none"/>
            <g fill="none" stroke="rgba(254,243,199,0.25)" stroke-width="1">
              <path d="M 130 -140 Q 100 -130 70 -150"/>
              <path d="M 140 -70  Q 100 -60  60 -80"/>
              <path d="M 130 0    Q 90 10    50 -10"/>
            </g>
            <g fill="#1a1233">
              <path d="M 90 -100 Q 84 -104 78 -100 L 74 -103 L 74 -97 Z"/>
            </g>
          </g>
          <!-- Dry corridor floor — sandy with ripple lines -->
          <rect x="160" y="380" width="480" height="60" fill="#3d2a16"/>
          <g stroke="rgba(254,243,199,0.35)" stroke-width="0.7" fill="none">
            <path d="M 180 400 Q 220 395 260 400 Q 300 395 340 400 Q 380 395 420 400 Q 460 395 500 400 Q 540 395 580 400 Q 620 395 640 400"/>
            <path d="M 180 415 Q 220 410 260 415 Q 300 410 340 415 Q 380 410 420 415 Q 460 410 500 415 Q 540 410 580 415 Q 620 410 640 415"/>
          </g>
          <!-- Israelites streaming through corridor — silhouettes -->
          <g fill="#0a0d1a">
            <g transform="translate(220 395)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(260 392)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(300 395)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(340 390)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(380 392)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(420 395)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(460 390)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(500 392)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(540 395)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
            <g transform="translate(580 390)"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-12" rx="4" ry="5"/></g>
          </g>
          <!-- Moses on a rise at left, staff extended over the sea -->
          <g transform="translate(220 360)">
            <ellipse cx="0" cy="0" rx="11" ry="26" fill="#1a1233"/>
            <ellipse cx="0" cy="-28" rx="10" ry="12" fill="#1a1233"/>
            <path d="M -8 -20 Q 0 -6 8 -20" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Long staff extended FORWARD over the sea -->
            <line x1="9" y1="-16" x2="50" y2="-44" stroke="#3d2a16" stroke-width="3.5"/>
            <circle cx="0" cy="-28" r="20" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"A wall of water on their right and on their left"</text>
        </svg>`
      },
      {
        id: 'army-drowned',
        title: "Pharaoh's Army Buried",
        scriptureRef: 'Exodus 14:26-28',
        bibleText: '"The water flowed back and covered the chariots and horsemen — the entire army of Pharaoh that had followed the Israelites into the sea. Not one of them survived."',
        narration: 'When the last Israelite stepped onto the far shore, Pharaoh\'s chariots were halfway across — wheels jamming, horses panicking. Moses stretched out his hand again. The walls of water that had stood all night collapsed in seconds. Six hundred chariots, six hundred captains, an empire\'s strongest soldiers — buried in a single roar of returning sea. The slaves stood on the eastern shore drying their feet in the morning sun and watched the most powerful army in the world become a stain in the water. Then Miriam picked up a tambourine and they sang their first song as a free people.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="rsdSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3d2a5e"/>
              <stop offset="60%" stop-color="#a78bfa"/>
              <stop offset="100%" stop-color="#fbbf24"/>
            </linearGradient>
            <linearGradient id="rsdWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(56,189,248,0.7)"/>
              <stop offset="100%" stop-color="#1e1846"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#rsdSky)"/>
          <!-- Dawn sun on the horizon -->
          <circle cx="700" cy="180" r="32" fill="#fef3c7"/>
          <circle cx="700" cy="180" r="50" fill="rgba(251,191,36,0.4)"/>
          <!-- Massive returning waves — collapsed walls now a single chaotic sea -->
          <path d="M 0 240 Q 120 200 240 240 Q 360 280 480 240 Q 600 200 720 240 Q 760 232 800 240 L 800 500 L 0 500 Z" fill="url(#rsdWater)"/>
          <!-- White caps -->
          <g stroke="rgba(254,243,199,0.85)" stroke-width="3" fill="none">
            <path d="M 60 230 Q 90 220 120 230"/>
            <path d="M 220 252 Q 260 240 300 252"/>
            <path d="M 420 234 Q 460 222 500 234"/>
            <path d="M 580 240 Q 620 230 660 240"/>
          </g>
          <!-- Sinking chariot wheels + Egyptian helmets + broken spears in the foam -->
          <g>
            <!-- Wheel 1 -->
            <g transform="translate(200 300)">
              <circle r="26" fill="none" stroke="#3d2a16" stroke-width="3"/>
              <line x1="-26" y1="0" x2="26" y2="0" stroke="#3d2a16" stroke-width="3"/>
              <line x1="0" y1="-26" x2="0" y2="26" stroke="#3d2a16" stroke-width="3"/>
              <line x1="-18" y1="-18" x2="18" y2="18" stroke="#3d2a16" stroke-width="2"/>
              <line x1="-18" y1="18"  x2="18" y2="-18" stroke="#3d2a16" stroke-width="2"/>
              <!-- Splash around -->
              <path d="M -36 0 Q -32 -16 -22 -20" stroke="rgba(254,243,199,0.55)" stroke-width="2" fill="none"/>
            </g>
            <!-- Wheel 2, half-submerged -->
            <g transform="translate(440 320)">
              <path d="M -28 0 A 28 28 0 0 1 28 0" stroke="#3d2a16" stroke-width="3" fill="none"/>
              <line x1="-28" y1="0" x2="28" y2="0" stroke="#3d2a16" stroke-width="3"/>
              <line x1="0" y1="-28" x2="0" y2="0" stroke="#3d2a16" stroke-width="3"/>
              <line x1="-20" y1="-20" x2="20" y2="-20" stroke="#3d2a16" stroke-width="2"/>
            </g>
            <!-- Helmet floating -->
            <g transform="translate(580 290)">
              <path d="M -16 0 Q -12 -16 0 -20 Q 12 -16 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
              <line x1="0" y1="-20" x2="0" y2="-28" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
              <ellipse cx="0" cy="-30" rx="3" ry="2" fill="rgba(251,191,36,0.85)"/>
            </g>
            <!-- Broken spear -->
            <line x1="100" y1="350" x2="170" y2="380" stroke="#3d2a16" stroke-width="3"/>
            <polygon points="100,346 100,354 92,350" fill="rgba(251,191,36,0.85)"/>
            <!-- Another broken spear -->
            <line x1="640" y1="340" x2="720" y2="370" stroke="#3d2a16" stroke-width="3"/>
            <polygon points="720,366 720,374 728,370" fill="rgba(251,191,36,0.85)"/>
            <!-- A horse silhouette mostly submerged, only head + flailing leg visible -->
            <g transform="translate(340 350)">
              <ellipse cx="0" cy="0" rx="20" ry="8" fill="#0a0d1a"/>
              <ellipse cx="-18" cy="-12" rx="10" ry="8" fill="#0a0d1a"/>
              <line x1="-22" y1="-18" x2="-30" y2="-32" stroke="#0a0d1a" stroke-width="2"/>
              <line x1="-18" y1="-22" x2="-26" y2="-34" stroke="#0a0d1a" stroke-width="2"/>
              <line x1="14" y1="-2" x2="22" y2="-22" stroke="#0a0d1a" stroke-width="3"/>
            </g>
          </g>
          <!-- East shore — Israelites celebrating, Miriam with tambourine -->
          <path d="M 0 380 Q 200 372 400 380 Q 600 372 800 380 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <g fill="#1a1233">
            <!-- Miriam center, arm raised, tambourine -->
            <g transform="translate(400 420)">
              <path d="M -14 0 Q -12 -36 0 -46 Q 12 -36 14 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
              <ellipse cx="0" cy="-52" rx="11" ry="13" fill="#1a1233"/>
              <path d="M -10 -58 Q 0 -68 10 -58" stroke="rgba(254,243,199,0.6)" stroke-width="2" fill="rgba(254,243,199,0.18)"/>
              <line x1="12" y1="-32" x2="34" y2="-58" stroke="#3d2a5e" stroke-width="4"/>
              <!-- Tambourine -->
              <circle cx="36" cy="-62" r="9" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
              <circle cx="30" cy="-60" r="1.5" fill="rgba(251,191,36,0.85)"/>
              <circle cx="42" cy="-60" r="1.5" fill="rgba(251,191,36,0.85)"/>
              <circle cx="36" cy="-54" r="1.5" fill="rgba(251,191,36,0.85)"/>
              <circle cx="0" cy="-52" r="20" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            </g>
            <!-- Other dancers -->
            <g transform="translate(260 430)">
              <ellipse cx="0" cy="0" rx="6" ry="14"/>
              <ellipse cx="0" cy="-16" rx="5" ry="6"/>
              <line x1="-6" y1="-8" x2="-14" y2="-22" stroke="#1a1233" stroke-width="3"/>
              <line x1="6"  y1="-8" x2="14" y2="-22" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(540 430)">
              <ellipse cx="0" cy="0" rx="6" ry="14"/>
              <ellipse cx="0" cy="-16" rx="5" ry="6"/>
              <line x1="-6" y1="-8" x2="-14" y2="-22" stroke="#1a1233" stroke-width="3"/>
              <line x1="6"  y1="-8" x2="14" y2="-22" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(160 442)" opacity="0.85"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-14" rx="4" ry="5"/></g>
            <g transform="translate(640 442)" opacity="0.85"><ellipse cx="0" cy="0" rx="5" ry="12"/><ellipse cx="0" cy="-14" rx="4" ry="5"/></g>
          </g>
          <!-- Musical notes -->
          <g fill="rgba(251,191,36,0.85)" font-family="Bebas Neue, sans-serif">
            <text x="380" y="320" font-size="16">♪</text>
            <text x="450" y="300" font-size="14">♫</text>
            <text x="420" y="280" font-size="12">♪</text>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Not one of them survived"</text>
        </svg>`
      }
    ],
    closing: 'Pharaoh thought he was the strongest force in the room. He was wrong by every measurement that matters. Ten plagues told him so. The Red Sea told him so. And the lamb\'s blood on the doorpost told the Israelites that what was protecting them was not their own courage or cleverness — it was a sacrifice they had not made themselves. Centuries later, on a Friday in Jerusalem, another lamb would die so the angel of death would pass over a much bigger family.',
    closingPrompt: 'What "Pharaoh" in your life has been telling you for a long time that he is the strongest force in the room — and what would it look like, this week, to step out toward the sea anyway?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 25 — The Ten Commandments
  // ════════════════════════════════════════════════════════════
  {
    id: 'ten-commandments',
    title: 'The Ten Commandments',
    subtitle: 'A mountain on fire. A nation on its knees. Ten words to live by.',
    icon: '📜',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'exodus-conquest',
    scriptureRef: 'Exodus 19-20 · 32',
    duration: '~7 min',
    scenes: [
      {
        id: 'sinai-trembles',
        title: 'The Mountain Trembled',
        scriptureRef: 'Exodus 19:16-19',
        bibleText: '"On the morning of the third day there was thunder and lightning, with a thick cloud over the mountain… Mount Sinai was covered with smoke, because the Lord descended on it in fire."',
        narration: 'Three months after they crossed the sea, the people camped at the foot of Mount Sinai. The Lord said: in three days I will come down on this mountain. Wash your clothes. Do not touch the mountain — anyone who does will die. On the morning of the third day, thunder split the sky. Lightning forked into the rocks. A thick cloud sat on the summit. A trumpet blast that nobody on earth blew got louder and louder. The whole mountain trembled. The people trembled with it.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="snSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="50%" stop-color="#1a1233"/>
              <stop offset="100%" stop-color="#3d2a16"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#snSky)"/>
          <!-- Heavy storm clouds wrapping mountain top -->
          <g fill="#0a0d1a" opacity="0.92">
            <ellipse cx="200" cy="120" rx="120" ry="36"/>
            <ellipse cx="400" cy="100" rx="160" ry="42"/>
            <ellipse cx="600" cy="120" rx="130" ry="38"/>
          </g>
          <!-- Lightning bolts -->
          <polyline points="260,150 280,210 250,220 280,290" stroke="rgba(254,243,199,0.95)" stroke-width="2" fill="none"/>
          <polyline points="540,150 560,210 530,220 560,290" stroke="rgba(254,243,199,0.95)" stroke-width="2" fill="none"/>
          <polyline points="400,160 416,220 400,232 416,300" stroke="rgba(254,243,199,0.85)" stroke-width="1.6" fill="none"/>
          <!-- Mount Sinai — towering jagged peak -->
          <polygon points="120,440 320,180 380,260 460,160 540,260 680,440" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="1.4"/>
          <polygon points="120,440 320,180 380,260 460,160 540,260 680,440" fill="rgba(251,113,38,0.18)" opacity="0.55"/>
          <!-- Fire crowning the top -->
          <g transform="translate(460 160)">
            <ellipse cx="0" cy="-12" rx="22" ry="40" fill="#fb923c"/>
            <ellipse cx="-8" cy="-24" rx="10" ry="20" fill="#fbbf24"/>
            <ellipse cx="6" cy="-30" rx="8" ry="18" fill="#fef3c7"/>
          </g>
          <!-- Smoke pouring upward from the peak -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="460" cy="100" rx="44" ry="28"/>
            <ellipse cx="460" cy="60" rx="60" ry="32"/>
            <ellipse cx="460" cy="20" rx="80" ry="32"/>
          </g>
          <!-- Trumpet sound waves emanating outward from mountain -->
          <g fill="none" stroke="rgba(251,191,36,0.4)" stroke-width="1.5" stroke-dasharray="3 6">
            <path d="M 100 360 Q 200 320 320 360"/>
            <path d="M 100 380 Q 200 340 320 380"/>
            <path d="M 600 360 Q 700 320 800 360"/>
            <path d="M 600 380 Q 700 340 800 380"/>
          </g>
          <!-- Border at the base of the mountain — DO NOT CROSS line of stones -->
          <g fill="#3d2a16" stroke="rgba(248,113,113,0.6)" stroke-width="1">
            <ellipse cx="180" cy="445" rx="12" ry="4"/>
            <ellipse cx="260" cy="448" rx="12" ry="4"/>
            <ellipse cx="340" cy="445" rx="12" ry="4"/>
            <ellipse cx="460" cy="448" rx="12" ry="4"/>
            <ellipse cx="540" cy="445" rx="12" ry="4"/>
            <ellipse cx="620" cy="448" rx="12" ry="4"/>
          </g>
          <!-- Ground -->
          <path d="M 0 460 Q 400 452 800 460 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- People at base, trembling, face-down or kneeling -->
          <g fill="#0a0d1a" opacity="0.95">
            <g transform="translate(80 480)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="-10" cy="-2" rx="5" ry="4"/></g>
            <g transform="translate(140 484)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="-10" cy="-2" rx="5" ry="4"/></g>
            <g transform="translate(200 480)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="-10" cy="-2" rx="5" ry="4"/></g>
            <g transform="translate(260 484)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="-10" cy="-2" rx="5" ry="4"/></g>
            <g transform="translate(540 484)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="10" cy="-2" rx="5" ry="4"/></g>
            <g transform="translate(600 480)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="10" cy="-2" rx="5" ry="4"/></g>
            <g transform="translate(660 484)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="10" cy="-2" rx="5" ry="4"/></g>
            <g transform="translate(720 480)"><ellipse cx="0" cy="0" rx="14" ry="5"/><ellipse cx="10" cy="-2" rx="5" ry="4"/></g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.9)">"The Lord descended on it in fire"</text>
        </svg>`
      },
      {
        id: 'moses-climbs',
        title: 'Moses Goes Up',
        scriptureRef: 'Exodus 19:20 · 24:15-18',
        bibleText: '"When Moses went up on the mountain, the cloud covered it… To the Israelites the glory of the Lord looked like a consuming fire on top of the mountain."',
        narration: 'The Lord called Moses up. He told Aaron to wait halfway, told Joshua to come no further than the cloud-line, and then walked up alone into the fire. The cloud closed behind him. For forty days and forty nights he stood inside what looked from below like a furnace, listening to the voice of God write the law on stone. The people at the base could see the glow flickering through the cloud. They could not see Moses. Some of them began to think they never would again.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'mcl', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <!-- Mountain rendered as a near-vertical ascent -->
          <polygon points="60,500 380,80 480,80 740,500" fill="#241846" stroke="rgba(251,191,36,0.55)" stroke-width="1.4"/>
          <!-- Striations / climbing path winding up -->
          <g stroke="rgba(251,191,36,0.45)" stroke-width="1" fill="none" stroke-dasharray="4 6">
            <path d="M 160 460 Q 240 400 200 340 Q 280 280 320 240 Q 380 200 420 160 Q 440 130 430 100"/>
          </g>
          <!-- Cloud band thick across upper third -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="200" cy="180" rx="120" ry="40"/>
            <ellipse cx="400" cy="140" rx="180" ry="44"/>
            <ellipse cx="600" cy="180" rx="140" ry="42"/>
          </g>
          <!-- Glow inside the cloud (where Moses is) -->
          <radialGradient id="mclGlow" cx="0.5" cy="0.3" r="0.4">
            <stop offset="0%" stop-color="rgba(254,243,199,0.7)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.35)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="430" cy="120" rx="180" ry="60" fill="url(#mclGlow)"/>
          <!-- Flickering fire ridge -->
          <g transform="translate(430 100)">
            <ellipse cx="0" cy="0" rx="20" ry="32" fill="#fb923c"/>
            <ellipse cx="-6" cy="-10" rx="10" ry="20" fill="#fbbf24"/>
            <ellipse cx="6" cy="-16" rx="6" ry="14" fill="#fef3c7"/>
          </g>
          <!-- Joshua halfway up, watching, alone -->
          <g transform="translate(310 280)">
            <ellipse cx="0" cy="0" rx="9" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-24" rx="8" ry="10" fill="#1a1233"/>
            <path d="M -7 -16 Q 0 -4 7 -16" stroke="rgba(254,243,199,0.55)" stroke-width="1.3" fill="none"/>
            <line x1="10" y1="-10" x2="22" y2="-30" stroke="#3d2a16" stroke-width="2"/>
            <circle cx="0" cy="-24" r="15" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="0.8"/>
          </g>
          <text x="345" y="270" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.6)">JOSHUA</text>
          <!-- Aaron and Hur with the elders just below cloud line -->
          <g fill="#0a0d1a" opacity="0.9">
            <g transform="translate(180 380)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-24" rx="8" ry="10"/>
              <path d="M -7 -16 Q 0 -2 7 -16" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            </g>
            <g transform="translate(620 380)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-24" rx="8" ry="10"/>
              <path d="M -7 -16 Q 0 -2 7 -16" stroke="rgba(254,243,199,0.5)" stroke-width="1.4" fill="none"/>
            </g>
          </g>
          <text x="180" y="350" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.5)">AARON</text>
          <text x="620" y="350" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.5)">HUR</text>
          <!-- Moses walking INTO the cloud — partial silhouette visible at cloud edge -->
          <g transform="translate(400 200)">
            <ellipse cx="0" cy="0" rx="9" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-24" rx="8" ry="10" fill="#1a1233"/>
            <path d="M -7 -16 Q 0 -2 7 -16" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <!-- Long beard -->
            <path d="M -5 -12 Q 0 4 5 -12" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Staff -->
            <line x1="9" y1="-10" x2="22" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
            <circle cx="0" cy="-24" r="20" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- People at base, looking up, awe -->
          <path d="M 0 460 Q 400 452 800 460 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(80 470)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
            <g transform="translate(120 472)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
            <g transform="translate(680 472)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
            <g transform="translate(720 470)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Forty days and forty nights" · inside the cloud</text>
        </svg>`
      },
      {
        id: 'tablets',
        title: 'Ten Words on Stone',
        scriptureRef: 'Exodus 20:1-17',
        bibleText: '"And God spoke all these words…"',
        narration: 'God Himself wrote ten words on two stone tablets with His finger. The first four were about loving Him. The other six were about loving each other. Not lists of opinions. Not negotiations. Foundations under everything Israel would ever be. No other gods. No idols. Do not misuse His name. Remember the Sabbath. Honor your father and mother. Do not murder, do not commit adultery, do not steal, do not bear false witness, do not covet. Ten short sentences that have shaped human civilization for thirty-three centuries. Moses came back down with them in his hands.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="tabHeaven" cx="0.5" cy="0.05" r="0.7">
              <stop offset="0%" stop-color="rgba(254,243,199,0.85)"/>
              <stop offset="60%" stop-color="rgba(251,191,36,0.35)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="#0a0d1a"/>
          <ellipse cx="400" cy="60" rx="440" ry="180" fill="url(#tabHeaven)"/>
          <!-- Beam of light pouring down between the two tablets -->
          <polygon points="380,0 340,440 460,440 420,0" fill="rgba(254,243,199,0.4)"/>
          <!-- LEFT tablet — first 4 commandments -->
          <g transform="translate(280 280)">
            <path d="M -80 -140 Q -80 -180 0 -180 Q 80 -180 80 -140 L 80 130 L -80 130 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="2"/>
            <path d="M -80 -140 Q -80 -180 0 -180 Q 80 -180 80 -140 L 80 130 L -80 130 Z" fill="rgba(254,243,199,0.06)"/>
            <!-- Hebrew-style commandment numbers -->
            <g font-family="Bebas Neue, sans-serif" fill="rgba(254,243,199,0.95)" letter-spacing="2" text-anchor="middle">
              <text x="0" y="-130" font-size="15">I</text>
              <text x="0" y="-100" font-size="8" letter-spacing="2">NO OTHER GODS</text>
              <text x="0" y="-65" font-size="15">II</text>
              <text x="0" y="-35" font-size="8">NO IDOLS</text>
              <text x="0" y="0" font-size="15">III</text>
              <text x="0" y="30" font-size="8">HIS NAME</text>
              <text x="0" y="65" font-size="15">IV</text>
              <text x="0" y="95" font-size="8">SABBATH</text>
            </g>
          </g>
          <!-- RIGHT tablet — last 6 commandments -->
          <g transform="translate(520 280)">
            <path d="M -80 -140 Q -80 -180 0 -180 Q 80 -180 80 -140 L 80 130 L -80 130 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="2"/>
            <path d="M -80 -140 Q -80 -180 0 -180 Q 80 -180 80 -140 L 80 130 L -80 130 Z" fill="rgba(254,243,199,0.06)"/>
            <g font-family="Bebas Neue, sans-serif" fill="rgba(254,243,199,0.95)" letter-spacing="2" text-anchor="middle">
              <text x="0" y="-140" font-size="13">V</text>
              <text x="0" y="-120" font-size="7">HONOR PARENTS</text>
              <text x="0" y="-90" font-size="13">VI</text>
              <text x="0" y="-70" font-size="7">DO NOT MURDER</text>
              <text x="0" y="-40" font-size="13">VII</text>
              <text x="0" y="-20" font-size="7">NO ADULTERY</text>
              <text x="0" y="10" font-size="13">VIII</text>
              <text x="0" y="30" font-size="7">DO NOT STEAL</text>
              <text x="0" y="60" font-size="13">IX</text>
              <text x="0" y="80" font-size="7">NO FALSE WITNESS</text>
              <text x="0" y="110" font-size="13">X</text>
              <text x="0" y="125" font-size="7">DO NOT COVET</text>
            </g>
          </g>
          <!-- Hand of God outlined faintly at the top, finger pointing down with light -->
          <g transform="translate(400 30)" opacity="0.75">
            <path d="M -40 0 Q -40 -28 -28 -32 Q -16 -36 -10 -32 Q -4 -36 0 -32 Q 6 -36 10 -32 Q 22 -34 32 -28 Q 40 -22 40 -10 Q 36 6 24 14 Q 8 22 -16 18 Q -34 14 -40 0 Z" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <!-- Index finger extended -->
            <path d="M -10 -32 L -10 -56 Q -10 -64 -2 -64 Q 4 -64 4 -56 L 4 -32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <line x1="-3" y1="-64" x2="-3" y2="-90" stroke="rgba(254,243,199,0.65)" stroke-width="1" stroke-dasharray="2 3"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Written by the finger of God"</text>
        </svg>`
      },
      {
        id: 'tablets-broken',
        title: 'A Golden Calf Below',
        scriptureRef: 'Exodus 32:15-20',
        bibleText: '"His anger burned and he threw the tablets out of his hands, breaking them to pieces at the foot of the mountain."',
        narration: 'While Moses was up the mountain receiving the law, the people at the foot of the mountain were already breaking it. They had made Aaron build them a golden calf to dance around. They were eating, drinking, and worshipping a statue forty days into their freedom. When Moses came back down with the tablets and saw the calf, his anger burned the same way the Lord\'s had. He hurled the two tablets to the ground at the base of the mountain. They shattered. The covenant was barely fresh ink and Israel had already broken it.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'tbb', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#3d2a16', stars:false})}
          <!-- Mountain face left (Moses coming down) -->
          <polygon points="0,500 200,80 300,280 0,500" fill="#241846" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          <!-- Ground -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Golden calf on a low altar in center-right -->
          <g transform="translate(540 380)">
            <!-- Altar block -->
            <rect x="-40" y="-12" width="80" height="20" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <!-- Calf body -->
            <g transform="translate(0 -36)">
              <ellipse cx="0" cy="0" rx="34" ry="14" fill="rgba(251,191,36,0.95)" stroke="#fef3c7" stroke-width="0.8"/>
              <ellipse cx="-28" cy="-4" rx="11" ry="9" fill="rgba(251,191,36,0.95)" stroke="#fef3c7" stroke-width="0.8"/>
              <!-- Horns -->
              <line x1="-32" y1="-12" x2="-36" y2="-20" stroke="rgba(251,191,36,0.9)" stroke-width="2"/>
              <line x1="-24" y1="-12" x2="-20" y2="-20" stroke="rgba(251,191,36,0.9)" stroke-width="2"/>
              <!-- Eye -->
              <circle cx="-30" cy="-2" r="1.5" fill="#0a0d1a"/>
              <!-- Legs -->
              <line x1="-20" y1="14" x2="-20" y2="26" stroke="rgba(251,191,36,0.9)" stroke-width="3"/>
              <line x1="-6"  y1="14" x2="-6"  y2="26" stroke="rgba(251,191,36,0.9)" stroke-width="3"/>
              <line x1="8"   y1="14" x2="8"   y2="26" stroke="rgba(251,191,36,0.9)" stroke-width="3"/>
              <line x1="22"  y1="14" x2="22"  y2="26" stroke="rgba(251,191,36,0.9)" stroke-width="3"/>
              <!-- Tail -->
              <path d="M 32 0 Q 42 -2 44 8" stroke="rgba(251,191,36,0.9)" stroke-width="2" fill="none"/>
            </g>
            <!-- Glow -->
            <ellipse cx="0" cy="-30" rx="60" ry="22" fill="rgba(251,191,36,0.18)"/>
          </g>
          <!-- People dancing around the calf — wild, arms up -->
          <g fill="#0a0d1a">
            <g transform="translate(440 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <line x1="-7" y1="-12" x2="-22" y2="-36" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="7"  y1="-12" x2="22" y2="-36" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(640 390)">
              <ellipse cx="0" cy="0" rx="7" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="7"/>
              <line x1="-7" y1="-12" x2="-22" y2="-36" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="7"  y1="-12" x2="22" y2="-36" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(480 414)" opacity="0.8">
              <ellipse cx="0" cy="0" rx="6" ry="18"/>
              <ellipse cx="0" cy="-20" rx="5" ry="6"/>
              <line x1="-6" y1="-10" x2="-18" y2="-22" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(600 414)" opacity="0.8">
              <ellipse cx="0" cy="0" rx="6" ry="18"/>
              <ellipse cx="0" cy="-20" rx="5" ry="6"/>
              <line x1="6" y1="-10" x2="18" y2="-22" stroke="#0a0d1a" stroke-width="3"/>
            </g>
          </g>
          <!-- Moses descending mountain on the left, mid-throw -->
          <g transform="translate(220 350)">
            <ellipse cx="0" cy="0" rx="12" ry="32" fill="#1a1233"/>
            <ellipse cx="0" cy="-34" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -8 -26 Q 0 -10 8 -26" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <path d="M -7 -18 Q 0 2 7 -18" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Both arms thrown forward/down (mid-hurl) -->
            <line x1="-14" y1="-22" x2="-24" y2="6" stroke="#1a1233" stroke-width="5"/>
            <line x1="14"  y1="-22" x2="32" y2="-2" stroke="#1a1233" stroke-width="5"/>
            <!-- Halo bright but anger evident -->
            <circle cx="0" cy="-34" r="22" fill="none" stroke="rgba(251,113,38,0.85)" stroke-width="1.6"/>
          </g>
          <!-- Broken tablets shattered in mid-air falling forward of Moses -->
          <g>
            <!-- Big half-tablet falling -->
            <g transform="translate(290 410) rotate(-22)">
              <path d="M -40 -50 Q -40 -70 0 -70 Q 40 -70 40 -50 L 40 30 L -40 30 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
              <g font-family="Bebas Neue, sans-serif" fill="rgba(254,243,199,0.9)" letter-spacing="2" text-anchor="middle">
                <text x="0" y="-40" font-size="10">I</text>
                <text x="0" y="-12" font-size="10">II</text>
                <text x="0" y="16" font-size="10">III</text>
              </g>
              <!-- Crack lines -->
              <line x1="-20" y1="-40" x2="20" y2="20" stroke="rgba(248,113,113,0.95)" stroke-width="2"/>
            </g>
            <!-- Shards -->
            <polygon points="350,420 380,415 365,440" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <polygon points="340,442 372,448 358,460" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <polygon points="386,438 406,438 396,452" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
            <polygon points="394,460 412,456 404,470" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
          </g>
          <!-- Dust on impact -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="360" cy="440" rx="44" ry="10"/>
            <ellipse cx="380" cy="446" rx="56" ry="8"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">The covenant · broken before it was 40 days old</text>
        </svg>`
      }
    ],
    closing: 'Ten short sentences. God did not write them on the wall — He wrote them on stone. He did not whisper them — He thundered them. Centuries later, Jesus said He had not come to abolish the law, but to fulfill it. The first tablet is summarized in "love the Lord your God with all your heart, soul, mind, and strength." The second is summarized in "love your neighbor as yourself." The whole law hangs on those two hooks. Anyone who tells you the Ten Commandments are old-fashioned has not looked at the news.',
    closingPrompt: 'Which of the Ten do you instinctively pretend is optional — and what would it look like, this week, to honor that one as if God had thundered it down a mountain?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 26 — Elijah & the Still Small Voice
  // ════════════════════════════════════════════════════════════
  {
    id: 'elijah-cave',
    title: 'Elijah & the Still Small Voice',
    subtitle: 'The man who called down fire — running for his life.',
    icon: '🪨',
    color: '#a78bfa',
    accentColor: '#fef3c7',
    era: 'divided-kingdom',
    scriptureRef: '1 Kings 19',
    duration: '~6 min',
    scenes: [
      {
        id: 'broom-tree',
        title: 'Under the Broom Tree',
        scriptureRef: '1 Kings 19:1-5',
        bibleText: '"He came to a broom bush, sat down under it and prayed that he might die. \'I have had enough, Lord,\' he said. \'Take my life; I am no better than my ancestors.\'"',
        narration: 'The day after the fire on Mount Carmel, Jezebel sent a message to Elijah: by this time tomorrow you will be as dead as my prophets. The man who had stood alone against four hundred and fifty paid clergy of Baal lost his nerve in one sentence from one queen. He ran a day\'s journey into the desert. Under a single broom bush he collapsed and prayed: "I have had enough, Lord. Take my life. I am no better than the prophets before me." Then he fell asleep in the dirt.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="ebtSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3d2a5e"/>
              <stop offset="60%" stop-color="#fb923c"/>
              <stop offset="100%" stop-color="#fbbf24"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#ebtSky)"/>
          <circle cx="660" cy="120" r="38" fill="#fef3c7"/>
          <circle cx="660" cy="120" r="60" fill="rgba(251,113,38,0.45)"/>
          <!-- Empty desert -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 410 Q 400 400 800 410 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- Cracked earth -->
          <g stroke="rgba(251,113,38,0.45)" stroke-width="0.7" fill="none">
            <path d="M 60 430 L 100 436 L 130 432"/>
            <path d="M 240 442 L 280 446 L 310 442"/>
            <path d="M 540 444 L 580 448 L 620 444"/>
          </g>
          <!-- Solitary broom tree (a single twisted shrub) -->
          <g transform="translate(380 380)">
            <!-- Trunk -->
            <line x1="0" y1="0" x2="-2" y2="-50" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="-2" y1="-50" x2="-12" y2="-78" stroke="#0a0d1a" stroke-width="2"/>
            <line x1="-2" y1="-50" x2="6" y2="-72" stroke="#0a0d1a" stroke-width="2"/>
            <line x1="0" y1="0" x2="14" y2="-60" stroke="#0a0d1a" stroke-width="2"/>
            <!-- Sparse foliage -->
            <ellipse cx="-12" cy="-82" rx="14" ry="6" fill="#1a1233" opacity="0.85"/>
            <ellipse cx="6" cy="-76" rx="12" ry="6" fill="#1a1233" opacity="0.85"/>
            <ellipse cx="14" cy="-64" rx="10" ry="5" fill="#1a1233" opacity="0.85"/>
          </g>
          <!-- Elijah collapsed under the tree -->
          <g transform="translate(380 410)">
            <ellipse cx="0" cy="0" rx="40" ry="10" fill="#1a1233"/>
            <ellipse cx="-32" cy="-6" rx="11" ry="14" fill="#1a1233"/>
            <!-- Wild hair -->
            <path d="M -38 -16 Q -42 -22 -34 -22 M -28 -18 Q -28 -26 -22 -24" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Beard -->
            <path d="M -38 -6 Q -32 4 -26 -6" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Arm thrown out -->
            <line x1="20" y1="0" x2="42" y2="4" stroke="#1a1233" stroke-width="5"/>
            <!-- Halo dimmed -->
            <circle cx="-32" cy="-6" r="18" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1" stroke-dasharray="3 4"/>
          </g>
          <!-- Footprints from upper right (where he ran from) -->
          <g fill="rgba(254,243,199,0.35)">
            <ellipse cx="720" cy="380" rx="5" ry="2.5" transform="rotate(-20 720 380)"/>
            <ellipse cx="680" cy="388" rx="5" ry="2.5" transform="rotate(-20 680 388)"/>
            <ellipse cx="630" cy="394" rx="5" ry="2.5" transform="rotate(-20 630 394)"/>
            <ellipse cx="570" cy="398" rx="5" ry="2.5" transform="rotate(-15 570 398)"/>
            <ellipse cx="510" cy="404" rx="5" ry="2.5" transform="rotate(-12 510 404)"/>
            <ellipse cx="460" cy="408" rx="5" ry="2.5" transform="rotate(-10 460 408)"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"I have had enough, Lord"</text>
        </svg>`
      },
      {
        id: 'angel-bread',
        title: 'An Angel Brought Bread',
        scriptureRef: '1 Kings 19:5-8',
        bibleText: '"All at once an angel touched him and said, \'Get up and eat.\' He looked around, and there by his head was some bread baked over hot coals, and a jar of water."',
        narration: 'While he slept, an angel touched him. "Get up and eat." Beside him on the sand was a fresh-baked cake of bread, still warm, and a jar of cool water. He ate. He drank. He fell asleep again. The angel touched him a second time. "Get up and eat — the journey is too great for you." So he ate a second time. And on the strength of that meal he walked forty days and forty nights, all the way to Mount Horeb — the mountain of God.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'eag', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <g fill="#fef3c7" opacity="0.7">
            <circle cx="80" cy="50" r="0.9"/><circle cx="200" cy="80" r="1"/>
            <circle cx="340" cy="40" r="0.8"/><circle cx="500" cy="70" r="0.9"/>
            <circle cx="640" cy="60" r="1"/><circle cx="720" cy="120" r="0.8"/>
          </g>
          <!-- Crescent moon -->
          <g transform="translate(120 90)">
            <circle r="26" fill="#fef3c7" opacity="0.55"/>
            <circle r="20" fill="#fef3c7"/>
            <circle r="20" fill="#1a1233" transform="translate(5 -2)"/>
          </g>
          <!-- Glow around the sleeping Elijah -->
          <radialGradient id="eagGlow" cx="0.5" cy="0.5" r="0.45">
            <stop offset="0%" stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.2)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="380" rx="260" ry="120" fill="url(#eagGlow)"/>
          <!-- Ground -->
          <path d="M 0 380 Q 400 372 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- The broom tree stub (just visible at the corner of the scene) -->
          <g transform="translate(140 380)">
            <line x1="0" y1="0" x2="-4" y2="-40" stroke="#241846" stroke-width="2"/>
            <ellipse cx="-4" cy="-44" rx="9" ry="5" fill="#241846"/>
          </g>
          <!-- Elijah sleeping on his side, peaceful -->
          <g transform="translate(420 408)">
            <ellipse cx="0" cy="0" rx="50" ry="12" fill="#1a1233"/>
            <ellipse cx="-44" cy="-6" rx="13" ry="15" fill="#1a1233"/>
            <!-- Beard -->
            <path d="M -50 -2 Q -44 8 -38 -2" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Closed eyes -->
            <line x1="-48" y1="-10" x2="-44" y2="-10" stroke="rgba(254,243,199,0.5)" stroke-width="0.8"/>
            <!-- Halo returning -->
            <circle cx="-44" cy="-6" r="20" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1.2"/>
          </g>
          <!-- Angel kneeling beside, one hand on Elijah's shoulder -->
          <g transform="translate(300 390)">
            <ellipse cx="0" cy="0" rx="20" ry="40" fill="rgba(254,243,199,0.9)"/>
            <ellipse cx="0" cy="-48" rx="14" ry="16" fill="rgba(254,243,199,0.95)"/>
            <!-- Reaching arm toward Elijah's shoulder -->
            <line x1="16" y1="-10" x2="36" y2="2" stroke="rgba(254,243,199,0.95)" stroke-width="5"/>
            <!-- Wings -->
            <path d="M -20 -24 Q -64 -12 -50 32" stroke="rgba(251,191,36,0.65)" stroke-width="2" fill="rgba(254,243,199,0.22)"/>
            <path d="M 20 -24 Q 64 -12 50 32"   stroke="rgba(251,191,36,0.65)" stroke-width="2" fill="rgba(254,243,199,0.22)"/>
            <!-- Halo -->
            <circle cx="0" cy="-48" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- Bread cake on hot coals, jar of water beside Elijah's head -->
          <g transform="translate(440 416)">
            <!-- Smoldering coals -->
            <ellipse cx="0" cy="0" rx="22" ry="6" fill="#fb923c"/>
            <ellipse cx="0" cy="-1" rx="14" ry="4" fill="#fbbf24"/>
            <!-- Round flat bread on top -->
            <ellipse cx="0" cy="-7" rx="18" ry="5" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-9" rx="10" ry="2" fill="rgba(251,113,38,0.4)"/>
          </g>
          <!-- Clay water jar -->
          <g transform="translate(490 410)">
            <ellipse cx="0" cy="0" rx="10" ry="4" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="0.8"/>
            <path d="M -10 0 Q -6 -22 0 -22 Q 6 -22 10 0" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="0.8"/>
            <ellipse cx="0" cy="-22" rx="6" ry="2" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="0.8"/>
            <!-- Handle -->
            <path d="M 10 -10 Q 16 -14 14 -20" stroke="#3d2a16" stroke-width="1.5" fill="none"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Get up and eat · the journey is too great for you"</text>
        </svg>`
      },
      {
        id: 'cave-horeb',
        title: 'The Cave at Horeb',
        scriptureRef: '1 Kings 19:9-12',
        bibleText: '"What are you doing here, Elijah?"',
        narration: 'He arrived at Mount Horeb — the same mountain where God had spoken to Moses — and crawled into a cave to spend the night. The voice of the Lord came to him: "What are you doing here, Elijah?" "I have been very zealous for the Lord. The Israelites have broken your covenant. I am the only one left, and they are trying to kill me too." The Lord said: come stand on the mountain. The Lord is about to pass by.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'ech', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <g fill="#fef3c7" opacity="0.55">
            <circle cx="80" cy="50" r="0.8"/><circle cx="220" cy="80" r="0.9"/>
            <circle cx="380" cy="40" r="0.7"/><circle cx="540" cy="60" r="0.9"/>
            <circle cx="700" cy="90" r="0.8"/>
          </g>
          <!-- The mountain — a single dark dome filling most of the frame -->
          <path d="M 0 500 L 0 280 Q 100 180 280 140 Q 460 100 580 140 Q 740 180 800 280 L 800 500 Z" fill="#241846" stroke="rgba(251,191,36,0.45)" stroke-width="1.4"/>
          <!-- Cave mouth — black arched opening in the rock face -->
          <g transform="translate(400 350)">
            <path d="M -60 30 Q -60 -60 0 -70 Q 60 -60 60 30 Z" fill="#000a14" stroke="rgba(251,191,36,0.75)" stroke-width="1.6"/>
            <!-- Faint inner glow -->
            <ellipse cx="0" cy="0" rx="40" ry="40" fill="rgba(251,191,36,0.08)"/>
          </g>
          <!-- Elijah sitting just inside the cave, knees drawn up, head tilted to listen -->
          <g transform="translate(400 370)">
            <ellipse cx="0" cy="0" rx="18" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-20" rx="13" ry="15" fill="#1a1233"/>
            <!-- Long beard -->
            <path d="M -9 -12 Q 0 8 9 -12" stroke="rgba(254,243,199,0.6)" stroke-width="1.5" fill="none"/>
            <!-- Hair -->
            <path d="M -10 -26 Q -14 -36 -8 -36 M 8 -36 Q 14 -36 10 -26" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Knees up -->
            <line x1="-12" y1="4" x2="-16" y2="14" stroke="#1a1233" stroke-width="5"/>
            <line x1="12" y1="4" x2="16" y2="14" stroke="#1a1233" stroke-width="5"/>
            <!-- Mantle pulled over head (he wraps face later but this scene we see his face) -->
            <circle cx="0" cy="-20" r="22" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.4"/>
          </g>
          <!-- Voice from above — text floating from sky into cave -->
          <text x="220" y="120" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="4" fill="rgba(251,191,36,0.85)">"WHAT ARE YOU</text>
          <text x="220" y="148" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="4" fill="rgba(251,191,36,0.85)">DOING HERE,</text>
          <text x="220" y="176" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="4" fill="rgba(251,191,36,0.85)">ELIJAH?"</text>
          <!-- Soft beams from sky into the mouth of the cave -->
          <g stroke="rgba(254,243,199,0.18)" stroke-width="2" fill="none">
            <line x1="280" y1="60" x2="380" y2="300"/>
            <line x1="320" y1="40" x2="400" y2="290"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">Horeb · the mountain of God</text>
        </svg>`
      },
      {
        id: 'still-small-voice',
        title: 'Wind · Earthquake · Fire · Silence',
        scriptureRef: '1 Kings 19:11-13',
        bibleText: '"But the Lord was not in the wind… not in the earthquake… not in the fire. And after the fire came a gentle whisper."',
        narration: 'A great wind tore the mountain apart, smashing rocks before the Lord. But the Lord was not in the wind. After the wind, an earthquake. The Lord was not in the earthquake. After the earthquake, fire. The Lord was not in the fire. Then — after the fire — a sound of thin silence. A gentle whisper. And Elijah heard it. He pulled his cloak up over his face and stepped to the mouth of the cave. The Lord said again, quietly: "Elijah. What are you doing here?" Then He gave him his next assignment and reminded him: there are seven thousand others who have not bowed the knee. You are not alone.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'ssv', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e', stars:false})}
          <!-- Four-panel grid showing the sequence -->
          <line x1="400" y1="40" x2="400" y2="400" stroke="rgba(251,191,36,0.4)" stroke-width="1.2"/>
          <line x1="40" y1="220" x2="760" y2="220" stroke="rgba(251,191,36,0.4)" stroke-width="1.2"/>
          <!-- PANEL 1 — WIND (top-left) -->
          <g>
            <text x="220" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.85)">WIND</text>
            <!-- Curving wind lines -->
            <g stroke="rgba(254,243,199,0.7)" stroke-width="2" fill="none">
              <path d="M 80 140 Q 180 100 260 140"/>
              <path d="M 60 160 Q 180 120 280 160"/>
              <path d="M 80 180 Q 180 140 260 180"/>
              <path d="M 100 200 Q 200 160 280 200"/>
            </g>
            <!-- Rocks being shattered -->
            <polygon points="160,200 170,180 180,200 175,210" fill="#1a1233"/>
            <polygon points="220,202 232,184 240,200 234,212" fill="#1a1233"/>
            <text x="220" y="200" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="3" fill="rgba(248,113,113,0.85)">NOT THE LORD</text>
          </g>
          <!-- PANEL 2 — EARTHQUAKE (top-right) -->
          <g>
            <text x="580" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.85)">EARTHQUAKE</text>
            <!-- Jagged ground crack -->
            <polyline points="430,180 470,140 460,170 520,120 510,160 560,110 555,150 600,100 595,150 640,110 635,160 680,130 680,180 720,150"
                      stroke="#fb923c" stroke-width="2" fill="none"/>
            <line x1="450" y1="190" x2="730" y2="190" stroke="rgba(254,243,199,0.4)" stroke-width="1" stroke-dasharray="3 4"/>
            <text x="580" y="208" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="3" fill="rgba(248,113,113,0.85)">NOT THE LORD</text>
          </g>
          <!-- PANEL 3 — FIRE (bottom-left) -->
          <g>
            <text x="220" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.85)">FIRE</text>
            <!-- Several leaping flames -->
            <g>
              <ellipse cx="140" cy="340" rx="14" ry="40" fill="#fb923c"/>
              <ellipse cx="140" cy="330" rx="8" ry="26" fill="#fbbf24"/>
              <ellipse cx="200" cy="340" rx="18" ry="50" fill="#fb923c"/>
              <ellipse cx="200" cy="328" rx="10" ry="30" fill="#fbbf24"/>
              <ellipse cx="200" cy="318" rx="5" ry="16" fill="#fef3c7"/>
              <ellipse cx="260" cy="340" rx="14" ry="40" fill="#fb923c"/>
              <ellipse cx="260" cy="330" rx="8" ry="26" fill="#fbbf24"/>
              <ellipse cx="310" cy="340" rx="12" ry="34" fill="#fb923c"/>
              <ellipse cx="310" cy="332" rx="6" ry="22" fill="#fbbf24"/>
            </g>
            <text x="220" y="394" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="3" fill="rgba(248,113,113,0.85)">NOT THE LORD</text>
          </g>
          <!-- PANEL 4 — STILL SMALL VOICE (bottom-right) -->
          <g>
            <text x="580" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.85)">A GENTLE WHISPER</text>
            <!-- Calm starlit hillside with cave -->
            <path d="M 420 380 Q 580 340 740 380" stroke="rgba(254,243,199,0.4)" stroke-width="1" fill="none"/>
            <path d="M 420 380 Q 580 340 740 380 L 740 400 L 420 400 Z" fill="#241846"/>
            <!-- Tiny figure stepping out of cave -->
            <g transform="translate(580 340)">
              <!-- Cave -->
              <path d="M -20 24 Q -22 -10 0 -16 Q 22 -10 20 24 Z" fill="#000a14" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
              <!-- Elijah at cave mouth, cloak over face -->
              <g transform="translate(0 18)">
                <ellipse cx="0" cy="0" rx="6" ry="10" fill="#1a1233"/>
                <ellipse cx="0" cy="-10" rx="5" ry="6" fill="#1a1233"/>
                <!-- Cloak over head + face -->
                <path d="M -8 -16 Q 0 -22 8 -16 Q 8 -8 -8 -8 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
                <!-- Halo bright -->
                <circle cx="0" cy="-10" r="14" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.2"/>
              </g>
            </g>
            <!-- A few faint stars + a single soft glow -->
            <g fill="#fef3c7" opacity="0.7">
              <circle cx="460" cy="260" r="0.8"/><circle cx="540" cy="280" r="0.9"/>
              <circle cx="620" cy="260" r="0.8"/><circle cx="700" cy="280" r="0.9"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"A still small voice"</text>
        </svg>`
      }
    ],
    closing: 'The Lord did not chase Elijah down with another fire show. He fed him bread. He let him sleep. He walked him forty days to a quiet mountain. And then He did NOT shout. The same God who had thundered down lightning on Mount Carmel chose, for this servant in this season, a whisper. There are seasons in your faith where God will be loud. There are other seasons where the only way you will hear Him is to slow down enough for a whisper. Both are Him.',
    closingPrompt: 'Where in your life have you been waiting for God to thunder — and what would it look like to slow down enough to hear a whisper instead?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 27 — Isaiah's Vision of the Throne
  // ════════════════════════════════════════════════════════════
  {
    id: 'isaiah-throne',
    title: "Isaiah's Vision",
    subtitle: "In the year King Uzziah died — the prophet saw the Lord.",
    icon: '👑',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'prophets',
    scriptureRef: 'Isaiah 6',
    duration: '~6 min',
    scenes: [
      {
        id: 'year-uzziah-died',
        title: 'The Year Uzziah Died',
        scriptureRef: 'Isaiah 6:1',
        bibleText: '"In the year that King Uzziah died…"',
        narration: 'For fifty-two years one king had been on the throne. Uzziah was the only ruler most of Judah had ever known. He had been a good king for most of his reign — until pride caught him and the Lord struck him with leprosy. When he finally died, Judah staggered. Who would lead? Where was God in all of this? Young Isaiah went up to the temple to pray, head full of grief, country full of fear. And in that moment, with the funeral incense still in the air, the unseen world opened.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'iuz', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#3d2a16', stars:false})}
          <!-- Temple silhouette on a hill in the background -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="1">
            <rect x="280" y="220" width="240" height="160"/>
            <rect x="270" y="200" width="260" height="22" fill="#241846"/>
            <!-- Columns -->
            <rect x="300" y="220" width="16" height="160"/>
            <rect x="340" y="220" width="16" height="160"/>
            <rect x="380" y="220" width="16" height="160"/>
            <rect x="420" y="220" width="16" height="160"/>
            <rect x="460" y="220" width="16" height="160"/>
            <rect x="500" y="220" width="16" height="160"/>
          </g>
          <!-- Smoke from temple altar rising -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="400" cy="180" rx="30" ry="40"/>
            <ellipse cx="400" cy="120" rx="40" ry="40"/>
            <ellipse cx="400" cy="60" rx="50" ry="34"/>
          </g>
          <!-- Funeral procession in foreground — pallbearers carrying a covered bier -->
          <g transform="translate(400 420)">
            <!-- Bier covered with dark cloth -->
            <rect x="-90" y="-14" width="180" height="22" fill="#1a1233" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <!-- Crown laid on top -->
            <path d="M -16 -16 L -10 -28 L -3 -20 L 0 -32 L 3 -20 L 10 -28 L 16 -16 Z" fill="rgba(251,191,36,0.85)"/>
            <!-- Four pallbearers -->
            <g fill="#0a0d1a">
              <g transform="translate(-86 6)"><ellipse cx="0" cy="0" rx="7" ry="22"/><ellipse cx="0" cy="-22" rx="6" ry="7"/></g>
              <g transform="translate(-46 6)"><ellipse cx="0" cy="0" rx="7" ry="22"/><ellipse cx="0" cy="-22" rx="6" ry="7"/></g>
              <g transform="translate(46 6)"><ellipse cx="0" cy="0" rx="7" ry="22"/><ellipse cx="0" cy="-22" rx="6" ry="7"/></g>
              <g transform="translate(86 6)"><ellipse cx="0" cy="0" rx="7" ry="22"/><ellipse cx="0" cy="-22" rx="6" ry="7"/></g>
            </g>
          </g>
          <!-- Mourners lining the road on either side, heads down -->
          <g fill="#0a0d1a" opacity="0.7">
            <g transform="translate(80 446)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
            <g transform="translate(120 442)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
            <g transform="translate(680 446)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
            <g transform="translate(720 442)"><ellipse cx="0" cy="0" rx="5" ry="14"/><ellipse cx="0" cy="-16" rx="4" ry="5"/></g>
          </g>
          <!-- Young Isaiah on the side, looking up toward the temple -->
          <g transform="translate(180 410)">
            <ellipse cx="0" cy="0" rx="11" ry="28" fill="#3d2a16"/>
            <ellipse cx="0" cy="-30" rx="10" ry="12" fill="#1a1233"/>
            <path d="M -7 -22 Q 0 -8 7 -22" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Looking UP -->
            <line x1="-3" y1="-32" x2="-1" y2="-34" stroke="rgba(254,243,199,0.55)" stroke-width="0.8"/>
            <circle cx="0" cy="-30" r="18" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.3"/>
          </g>
          <text x="180" y="370" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.85)">ISAIAH</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"In the year that King Uzziah died…"</text>
        </svg>`
      },
      {
        id: 'throne-vision',
        title: 'The Lord, High and Lifted Up',
        scriptureRef: 'Isaiah 6:1-4',
        bibleText: '"I saw the Lord, high and exalted, seated on a throne; and the train of his robe filled the temple."',
        narration: 'The roof of the temple peeled back. Isaiah saw the Lord, seated on a throne — high, towering, terrifying. The train of His robe filled the entire temple like a flood. Above the throne stood six-winged creatures called seraphim — flame-beings. With two wings they covered their faces. With two they covered their feet. With two they flew. And they were calling to each other in a voice that shook the doorposts: "Holy, holy, holy is the Lord Almighty. The whole earth is full of his glory." And the temple filled with smoke.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="itGlory" cx="0.5" cy="0.4" r="0.55">
              <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="40%" stop-color="rgba(251,191,36,0.5)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="#0a0d1a"/>
          <!-- Smoke filling the temple — dense layered ellipses -->
          <g fill="rgba(254,243,199,0.2)">
            <ellipse cx="120" cy="380" rx="120" ry="40"/>
            <ellipse cx="300" cy="400" rx="160" ry="36"/>
            <ellipse cx="500" cy="400" rx="160" ry="36"/>
            <ellipse cx="680" cy="380" rx="120" ry="40"/>
          </g>
          <!-- Heaven opening from above with massive glory -->
          <ellipse cx="400" cy="200" rx="500" ry="280" fill="url(#itGlory)"/>
          <!-- Towering throne — chevroned base + tall back -->
          <g transform="translate(400 240)">
            <path d="M -120 80 L 120 80 L 100 160 L -100 160 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <rect x="-100" y="-80" width="200" height="160" fill="#241846" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Back of throne soars upward -->
            <path d="M -100 -80 L -130 -180 L 130 -180 L 100 -80 Z" fill="#1a1233" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Pinnacle -->
            <polygon points="-30,-180 0,-220 30,-180" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.2"/>
          </g>
          <!-- Robe — vast train flowing down off the throne and across the floor -->
          <g fill="rgba(251,191,36,0.55)" stroke="rgba(251,191,36,0.85)" stroke-width="1.2">
            <path d="M 300 320 L 100 460 L 700 460 L 500 320 Z"/>
            <path d="M 320 360 L 200 460 L 600 460 L 480 360 Z" fill="rgba(251,191,36,0.3)"/>
          </g>
          <!-- The Lord seated — a luminous silhouetted form (we render only the implied figure, never literal) -->
          <g transform="translate(400 260)">
            <ellipse cx="0" cy="-40" rx="34" ry="60" fill="rgba(254,243,199,0.65)"/>
            <ellipse cx="0" cy="-110" rx="20" ry="22" fill="rgba(254,243,199,0.9)"/>
            <circle cx="0" cy="-110" r="40" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-110" r="60" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <!-- Crown silhouette implied -->
          </g>
          <!-- Seraphim — three on each side, six wings each, calling out -->
          <g fill="rgba(254,243,199,0.85)" stroke="rgba(251,191,36,0.85)" stroke-width="1">
            <!-- LEFT seraph 1 -->
            <g transform="translate(180 200)">
              <ellipse cx="0" cy="0" rx="11" ry="20" fill="rgba(251,113,38,0.5)"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9" fill="rgba(251,113,38,0.6)"/>
              <!-- 6 wings -->
              <path d="M -14 -12 Q -40 -20 -26 12" fill="rgba(254,243,199,0.35)"/>
              <path d="M 14 -12 Q 40 -20 26 12"   fill="rgba(254,243,199,0.35)"/>
              <path d="M -12 -28 Q -28 -42 -20 -50" fill="rgba(254,243,199,0.35)"/>
              <path d="M 12 -28 Q 28 -42 20 -50"   fill="rgba(254,243,199,0.35)"/>
              <path d="M -10 16 Q -22 32 -14 38"   fill="rgba(254,243,199,0.35)"/>
              <path d="M 10 16 Q 22 32 14 38"     fill="rgba(254,243,199,0.35)"/>
            </g>
            <!-- LEFT seraph 2 -->
            <g transform="translate(240 280)" opacity="0.9">
              <ellipse cx="0" cy="0" rx="9" ry="18" fill="rgba(251,113,38,0.5)"/>
              <ellipse cx="0" cy="-20" rx="7" ry="8" fill="rgba(251,113,38,0.6)"/>
              <path d="M -12 -10 Q -34 -16 -22 12" fill="rgba(254,243,199,0.3)"/>
              <path d="M 12 -10 Q 34 -16 22 12"   fill="rgba(254,243,199,0.3)"/>
            </g>
            <!-- RIGHT seraph 1 -->
            <g transform="translate(620 200)">
              <ellipse cx="0" cy="0" rx="11" ry="20" fill="rgba(251,113,38,0.5)"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9" fill="rgba(251,113,38,0.6)"/>
              <path d="M -14 -12 Q -40 -20 -26 12" fill="rgba(254,243,199,0.35)"/>
              <path d="M 14 -12 Q 40 -20 26 12"   fill="rgba(254,243,199,0.35)"/>
              <path d="M -12 -28 Q -28 -42 -20 -50" fill="rgba(254,243,199,0.35)"/>
              <path d="M 12 -28 Q 28 -42 20 -50"   fill="rgba(254,243,199,0.35)"/>
              <path d="M -10 16 Q -22 32 -14 38"   fill="rgba(254,243,199,0.35)"/>
              <path d="M 10 16 Q 22 32 14 38"     fill="rgba(254,243,199,0.35)"/>
            </g>
            <!-- RIGHT seraph 2 -->
            <g transform="translate(560 280)" opacity="0.9">
              <ellipse cx="0" cy="0" rx="9" ry="18" fill="rgba(251,113,38,0.5)"/>
              <ellipse cx="0" cy="-20" rx="7" ry="8" fill="rgba(251,113,38,0.6)"/>
              <path d="M -12 -10 Q -34 -16 -22 12" fill="rgba(254,243,199,0.3)"/>
              <path d="M 12 -10 Q 34 -16 22 12"   fill="rgba(254,243,199,0.3)"/>
            </g>
          </g>
          <!-- "HOLY HOLY HOLY" banner across the top -->
          <text x="400" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="28" letter-spacing="8" fill="rgba(251,191,36,0.95)">HOLY · HOLY · HOLY</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"The whole earth is full of his glory"</text>
        </svg>`
      },
      {
        id: 'woe-and-coal',
        title: 'Woe to Me — and a Coal',
        scriptureRef: 'Isaiah 6:5-7',
        bibleText: '"Woe to me! I am ruined! For I am a man of unclean lips… Then one of the seraphim flew to me with a live coal in his hand."',
        narration: 'Isaiah collapsed. "Woe to me! I am ruined! I am a man of unclean lips and I live among a people of unclean lips — and now my eyes have seen the King, the Lord Almighty!" He was undone. The closer to holiness you get, the more clearly you see your own filth. And then one of the seraphim flew down from the throne with a live coal in his hand — taken with tongs from the altar of God. He touched it to Isaiah\'s lips. The fire did not burn. It cleansed. "See — your guilt is taken away. Your sin is atoned for."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="iwcGlow" cx="0.5" cy="0.4" r="0.55">
              <stop offset="0%" stop-color="rgba(254,243,199,0.75)"/>
              <stop offset="55%" stop-color="rgba(251,113,38,0.35)"/>
              <stop offset="100%" stop-color="rgba(251,113,38,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="#0a0d1a"/>
          <ellipse cx="400" cy="250" rx="440" ry="280" fill="url(#iwcGlow)"/>
          <!-- Altar at left with glowing coals -->
          <g transform="translate(180 350)">
            <rect x="-30" y="-12" width="60" height="20" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-12" rx="28" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-14" rx="22" ry="4" fill="#fb923c"/>
            <g fill="#fbbf24">
              <ellipse cx="-12" cy="-14" rx="5" ry="3"/>
              <ellipse cx="0"   cy="-15" rx="5" ry="3"/>
              <ellipse cx="12"  cy="-14" rx="5" ry="3"/>
            </g>
            <!-- Smoke rising -->
            <ellipse cx="0" cy="-26" rx="9" ry="14" fill="rgba(254,243,199,0.25)"/>
            <ellipse cx="0" cy="-44" rx="14" ry="18" fill="rgba(254,243,199,0.18)"/>
          </g>
          <!-- Seraph flying from altar toward Isaiah, holding tongs with glowing coal -->
          <g transform="translate(360 280)">
            <ellipse cx="0" cy="0" rx="13" ry="26" fill="rgba(251,113,38,0.55)"/>
            <ellipse cx="0" cy="-28" rx="11" ry="13" fill="rgba(251,113,38,0.7)"/>
            <!-- Six wings, mid-flight -->
            <path d="M -14 -18 Q -50 -10 -34 30" fill="rgba(254,243,199,0.4)" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <path d="M 14 -18 Q 50 -10 34 30"   fill="rgba(254,243,199,0.4)" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <path d="M -12 -36 Q -34 -50 -22 -60" fill="rgba(254,243,199,0.35)" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <path d="M 12 -36 Q 34 -50 22 -60"   fill="rgba(254,243,199,0.35)" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <!-- Outstretched arm holding tongs with coal -->
            <line x1="14" y1="-10" x2="48" y2="22" stroke="rgba(254,243,199,0.95)" stroke-width="4"/>
            <!-- Tongs -->
            <line x1="48" y1="22" x2="62" y2="34" stroke="#3d2a16" stroke-width="2.5"/>
            <line x1="48" y1="22" x2="60" y2="38" stroke="#3d2a16" stroke-width="2.5"/>
            <!-- The coal -->
            <circle cx="64" cy="38" r="6" fill="#fef3c7"/>
            <circle cx="64" cy="38" r="9" fill="rgba(251,113,38,0.65)"/>
            <!-- Halo on the seraph -->
            <circle cx="0" cy="-28" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- Isaiah collapsed on his knees, face up, hands covering mouth -->
          <g transform="translate(540 380)">
            <ellipse cx="0" cy="0" rx="32" ry="14" fill="#1a1233" stroke="rgba(254,243,199,0.5)" stroke-width="1"/>
            <ellipse cx="0" cy="-20" rx="20" ry="24" fill="#1a1233"/>
            <ellipse cx="0" cy="-54" rx="14" ry="16" fill="#1a1233"/>
            <!-- Both hands raised to face -->
            <line x1="-12" y1="-30" x2="-6" y2="-50" stroke="#1a1233" stroke-width="4"/>
            <line x1="12"  y1="-30" x2="6"  y2="-50" stroke="#1a1233" stroke-width="4"/>
            <!-- Lips toward the coal -->
            <ellipse cx="0" cy="-48" rx="4" ry="2" fill="rgba(254,243,199,0.7)"/>
            <!-- Beard -->
            <path d="M -8 -46 Q 0 -32 8 -46" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Halo growing -->
            <circle cx="0" cy="-54" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- "WOE TO ME" floating up from Isaiah, fading -->
          <text x="640" y="290" font-family="Bebas Neue, sans-serif" font-size="16" letter-spacing="3" fill="rgba(254,243,199,0.45)">WOE TO ME</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Your guilt is taken away · your sin is atoned for"</text>
        </svg>`
      },
      {
        id: 'send-me',
        title: 'Here Am I — Send Me',
        scriptureRef: 'Isaiah 6:8',
        bibleText: '"Then I heard the voice of the Lord saying, \'Whom shall I send? And who will go for us?\' And I said, \'Here am I. Send me!\'"',
        narration: 'Then he heard the voice of the Lord. "Whom shall I send? Who will go for us?" Yesterday Isaiah had no idea anyone like him would ever be needed. This morning he had been a man of unclean lips, ruined by what he had seen. Forty seconds with a coal on his mouth and a cleansed soul, and his answer was one of the shortest, most famous sentences in the Bible: "Here am I. Send me." It was not bravery. It was gratitude. The cleansed always volunteer.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'ism', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Heaven open at top -->
          <radialGradient id="ismHeaven" cx="0.5" cy="0.05" r="0.7">
            <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.35)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="40" rx="440" ry="180" fill="url(#ismHeaven)"/>
          <!-- Beam down on Isaiah -->
          <polygon points="370,0 320,440 480,440 430,0" fill="rgba(254,243,199,0.42)"/>
          <!-- Ground -->
          <path d="M 0 410 Q 400 400 800 410 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Isaiah standing transformed, arms open, head lifted -->
          <g transform="translate(400 380)">
            <path d="M -22 0 Q -18 -56 0 -68 Q 18 -56 22 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-80" rx="13" ry="15" fill="#1a1233"/>
            <!-- Beard -->
            <path d="M -8 -72 Q 0 -56 8 -72" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <!-- Eyes lifted upward (small ovals tilted up) -->
            <line x1="-4" y1="-83" x2="-1" y2="-85" stroke="rgba(254,243,199,0.6)" stroke-width="0.9"/>
            <line x1="1"  y1="-85" x2="4"  y2="-83" stroke="rgba(254,243,199,0.6)" stroke-width="0.9"/>
            <!-- Arms thrown wide and up -->
            <line x1="-18" y1="-44" x2="-50" y2="-80" stroke="#3d2a5e" stroke-width="6"/>
            <line x1="18"  y1="-44" x2="50" y2="-80" stroke="#3d2a5e" stroke-width="6"/>
            <!-- Huge halo and outer ring -->
            <circle cx="0" cy="-80" r="32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-80" r="48" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Massive declaration text -->
          <text x="400" y="150" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="34" letter-spacing="8" fill="rgba(251,191,36,0.95)">"HERE AM I."</text>
          <text x="400" y="200" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="34" letter-spacing="8" fill="rgba(251,191,36,0.95)">"SEND ME."</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">The cleansed always volunteer</text>
        </svg>`
      }
    ],
    closing: 'Isaiah\'s call did not start with skills, training, networking, or a five-year plan. It started with a vision of how big God is and how small he was — and a coal from the altar that closed the gap between them. The pattern still holds. You will not be sent before you have been cleansed. And once you have been cleansed, you will not stay sitting down. "Here am I, send me" is what gratitude looks like when it finds its voice.',
    closingPrompt: 'What "unclean lip" in your life have you been hiding from God — and what would it look like to bring it close enough to the altar to be cleansed?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 28 — The Exile to Babylon
  // ════════════════════════════════════════════════════════════
  {
    id: 'exile-babylon',
    title: 'The Exile to Babylon',
    subtitle: 'Jerusalem falls. The temple burns. The people are marched away.',
    icon: '⛓️',
    color: '#5a4378',
    accentColor: '#fef3c7',
    era: 'exile',
    scriptureRef: '2 Kings 25 · Daniel 1 · Psalm 137',
    duration: '~6 min',
    scenes: [
      {
        id: 'jerusalem-falls',
        title: 'Jerusalem Falls',
        scriptureRef: '2 Kings 25:8-10',
        bibleText: '"He set fire to the temple of the Lord, the royal palace and all the houses of Jerusalem. Every important building he burned down."',
        narration: 'The prophets had warned them for a hundred and fifty years. They had not listened. In 586 BC, the army of Nebuchadnezzar, king of Babylon, broke through the walls of Jerusalem after a two-year siege. They torched the temple of the Lord. They torched the palace. They torched every important building. They tore down the walls. The unthinkable had happened: the place where God\'s glory had filled the air was a smoking ruin, and the chosen people of God stood in chains on its broken stones.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="jfSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="50%" stop-color="#3d2a16"/>
              <stop offset="100%" stop-color="#fb923c"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#jfSky)"/>
          <!-- Heavy smoke choking the sky -->
          <g fill="rgba(0,0,0,0.55)">
            <ellipse cx="200" cy="80" rx="180" ry="50"/>
            <ellipse cx="500" cy="60" rx="220" ry="48"/>
            <ellipse cx="700" cy="100" rx="180" ry="44"/>
          </g>
          <!-- Burning city skyline -->
          <g>
            <!-- Wall fragments -->
            <g fill="#1a1233" stroke="rgba(251,113,38,0.85)" stroke-width="1.2">
              <polygon points="60,420 60,300 120,310 100,420"/>
              <polygon points="160,420 160,280 220,290 200,420"/>
              <!-- Partial battlements -->
              <rect x="60" y="294" width="14" height="10"/>
              <rect x="92" y="298" width="14" height="10"/>
              <rect x="170" y="272" width="14" height="10"/>
              <rect x="206" y="278" width="14" height="10"/>
            </g>
            <!-- Temple in center, half-collapsed, on fire -->
            <g transform="translate(420 320)">
              <rect x="-80" y="-100" width="160" height="100" fill="#1a1233" stroke="rgba(251,113,38,0.85)" stroke-width="1.4"/>
              <polygon points="-92,-100 -42,-180 -36,-100" fill="#3d2a16" stroke="rgba(251,113,38,0.85)" stroke-width="1"/>
              <!-- Other half collapsed (jagged) -->
              <polygon points="20,-100 36,-150 80,-130 80,-100" fill="#1a1233" stroke="rgba(251,113,38,0.85)" stroke-width="1.4"/>
              <!-- Pillars knocked over -->
              <rect x="-66" y="-80" width="14" height="80"/>
              <rect x="-30" y="-80" width="14" height="80"/>
              <!-- Crumbled pillar lying on side -->
              <rect x="0" y="-12" width="80" height="14" fill="#1a1233" stroke="rgba(251,113,38,0.85)" stroke-width="0.8" transform="rotate(-15 40 -5)"/>
              <!-- Flames roaring from interior -->
              <ellipse cx="0" cy="-110" rx="60" ry="60" fill="#fb923c"/>
              <ellipse cx="-10" cy="-120" rx="30" ry="48" fill="#fbbf24"/>
              <ellipse cx="10" cy="-130" rx="20" ry="36" fill="#fef3c7"/>
            </g>
            <!-- Other burning buildings -->
            <g fill="#1a1233" stroke="rgba(251,113,38,0.85)" stroke-width="1">
              <rect x="600" y="280" width="60" height="60"/>
              <polygon points="596,280 630,250 666,280"/>
            </g>
            <ellipse cx="630" cy="240" rx="20" ry="30" fill="#fb923c"/>
            <ellipse cx="630" cy="244" rx="10" ry="20" fill="#fbbf24"/>
            <g fill="#1a1233" stroke="rgba(251,113,38,0.85)" stroke-width="1">
              <rect x="690" y="300" width="50" height="50"/>
            </g>
            <ellipse cx="715" cy="280" rx="15" ry="22" fill="#fb923c"/>
          </g>
          <!-- Soldiers (Babylonian) in foreground silhouettes with spears -->
          <g fill="#0a0d1a">
            <g transform="translate(80 420)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="10"/>
              <!-- Crested helmet -->
              <path d="M -8 -38 Q 0 -50 8 -38 L 4 -42 Z" fill="rgba(248,113,113,0.75)"/>
              <!-- Spear -->
              <line x1="0" y1="-22" x2="0" y2="-78" stroke="#0a0d1a" stroke-width="3"/>
              <polygon points="-3,-78 3,-78 0,-90" fill="rgba(251,191,36,0.85)"/>
            </g>
            <g transform="translate(720 425)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="10"/>
              <path d="M -8 -38 Q 0 -50 8 -38 L 4 -42 Z" fill="rgba(248,113,113,0.75)"/>
              <line x1="0" y1="-22" x2="0" y2="-78" stroke="#0a0d1a" stroke-width="3"/>
              <polygon points="-3,-78 3,-78 0,-90" fill="rgba(251,191,36,0.85)"/>
            </g>
          </g>
          <!-- Captive Jew kneeling in foreground, head bowed, hands chained -->
          <g transform="translate(280 440)">
            <ellipse cx="0" cy="0" rx="18" ry="8" fill="#1a1233"/>
            <ellipse cx="0" cy="-16" rx="14" ry="16" fill="#1a1233"/>
            <ellipse cx="0" cy="-40" rx="11" ry="13" fill="#1a1233"/>
            <!-- Hands bound -->
            <line x1="-8" y1="-22" x2="8" y2="-22" stroke="rgba(251,113,38,0.85)" stroke-width="2"/>
            <line x1="-4" y1="-24" x2="-4" y2="-20" stroke="rgba(251,113,38,0.85)" stroke-width="1.2"/>
            <line x1="4"  y1="-24" x2="4"  y2="-20" stroke="rgba(251,113,38,0.85)" stroke-width="1.2"/>
            <!-- Halo extinguished -->
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"He set fire to the temple of the Lord"</text>
        </svg>`
      },
      {
        id: 'long-march',
        title: 'The Long March East',
        scriptureRef: '2 Kings 25:11 · Jeremiah 52:30',
        bibleText: '"He carried into exile the people who remained in the city, along with the rest of the populace and those who had deserted to the king of Babylon."',
        narration: 'Five hundred miles. Northeast across the Syrian desert. A line of broken people in chains, prodded by spears, going to a city most of them had never seen. The strong went first — military officers, craftsmen, anyone with a usable skill. Then the priests. Then the scholars. Then nobles. Among them was a teenager named Daniel, and another named Hananiah, Mishael, and Azariah. They did not know yet that within two years they would be standing in Nebuchadnezzar\'s throne room. They were just walking. East. Out of the homeland.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="lmSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3d2a5e"/>
              <stop offset="60%" stop-color="#fb923c"/>
              <stop offset="100%" stop-color="#fbbf24"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#lmSky)"/>
          <circle cx="650" cy="120" r="34" fill="#fef3c7"/>
          <circle cx="650" cy="120" r="52" fill="rgba(251,113,38,0.4)"/>
          <!-- Receding road to the horizon -->
          <path d="M 100 460 Q 300 380 500 320 Q 600 290 700 280" stroke="rgba(254,243,199,0.55)" stroke-width="6" fill="none"/>
          <!-- Distant Babylon (city on horizon, ziggurat) -->
          <g transform="translate(700 270)">
            <rect x="-26" y="-12" width="52" height="14" fill="#0a0d1a" stroke="rgba(251,191,36,0.65)" stroke-width="0.8"/>
            <rect x="-20" y="-22" width="40" height="10" fill="#0a0d1a" stroke="rgba(251,191,36,0.65)" stroke-width="0.8"/>
            <rect x="-14" y="-32" width="28" height="10" fill="#0a0d1a" stroke="rgba(251,191,36,0.65)" stroke-width="0.8"/>
            <rect x="-8" y="-40" width="16" height="8" fill="#0a0d1a" stroke="rgba(251,191,36,0.65)" stroke-width="0.8"/>
          </g>
          <text x="700" y="252" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">BABYLON</text>
          <!-- Ground -->
          <path d="M 0 360 Q 400 350 800 360 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 420 Q 400 412 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- LONG line of marching captives (chained), recede into distance -->
          <g fill="#0a0d1a">
            <!-- Foreground (large) -->
            <g transform="translate(100 420)">
              <ellipse cx="0" cy="0" rx="13" ry="34"/>
              <ellipse cx="0" cy="-36" rx="11" ry="13"/>
              <path d="M -8 -28 Q 0 -16 8 -28" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
              <!-- Chain to next captive -->
              <line x1="11" y1="-28" x2="44" y2="-26" stroke="rgba(251,113,38,0.85)" stroke-width="2"/>
            </g>
            <g transform="translate(160 422)">
              <ellipse cx="0" cy="0" rx="12" ry="32"/>
              <ellipse cx="0" cy="-34" rx="10" ry="12"/>
              <path d="M -8 -26 Q 0 -16 8 -26" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
              <line x1="11" y1="-26" x2="44" y2="-24" stroke="rgba(251,113,38,0.85)" stroke-width="2"/>
            </g>
            <g transform="translate(220 420)">
              <ellipse cx="0" cy="0" rx="13" ry="34"/>
              <ellipse cx="0" cy="-36" rx="11" ry="13"/>
              <path d="M -8 -28 Q 0 -16 8 -28" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
              <line x1="11" y1="-28" x2="44" y2="-26" stroke="rgba(251,113,38,0.85)" stroke-width="2"/>
            </g>
            <!-- Mid-distance, smaller -->
            <g transform="translate(310 392)">
              <ellipse cx="0" cy="0" rx="8" ry="22"/>
              <ellipse cx="0" cy="-22" rx="6" ry="8"/>
              <line x1="7" y1="-18" x2="22" y2="-16" stroke="rgba(251,113,38,0.7)" stroke-width="1.5"/>
            </g>
            <g transform="translate(360 388)">
              <ellipse cx="0" cy="0" rx="7" ry="20"/>
              <ellipse cx="0" cy="-20" rx="6" ry="7"/>
              <line x1="6" y1="-16" x2="20" y2="-14" stroke="rgba(251,113,38,0.7)" stroke-width="1.3"/>
            </g>
            <g transform="translate(420 376)">
              <ellipse cx="0" cy="0" rx="6" ry="16"/>
              <ellipse cx="0" cy="-16" rx="5" ry="6"/>
              <line x1="5" y1="-13" x2="18" y2="-12" stroke="rgba(251,113,38,0.65)" stroke-width="1.2"/>
            </g>
            <!-- Far distance -->
            <g opacity="0.75">
              <ellipse cx="490" cy="362" rx="4" ry="10"/>
              <ellipse cx="490" cy="350" rx="3" ry="4"/>
              <ellipse cx="540" cy="354" rx="4" ry="9"/>
              <ellipse cx="540" cy="344" rx="3" ry="4"/>
              <ellipse cx="590" cy="346" rx="3" ry="8"/>
              <ellipse cx="590" cy="338" rx="2.5" ry="3.5"/>
            </g>
          </g>
          <!-- Soldier with whip on horseback at side, prodding the line -->
          <g transform="translate(60 410)">
            <ellipse cx="0" cy="0" rx="30" ry="12" fill="#0a0d1a"/>
            <ellipse cx="-26" cy="-8" rx="9" ry="6" fill="#0a0d1a"/>
            <line x1="-22" y1="14" x2="-22" y2="28" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="22"  y1="14" x2="22"  y2="28" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="-10" y1="14" x2="-10" y2="28" stroke="#0a0d1a" stroke-width="3"/>
            <line x1="10"  y1="14" x2="10"  y2="28" stroke="#0a0d1a" stroke-width="3"/>
            <!-- Rider with crested helmet -->
            <ellipse cx="0" cy="-14" rx="8" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-30" rx="7" ry="8" fill="#1a1233"/>
            <path d="M -7 -38 Q 0 -48 7 -38 L 4 -42 Z" fill="rgba(248,113,113,0.85)"/>
            <!-- Whip / spear -->
            <line x1="10" y1="-20" x2="34" y2="-44" stroke="#3d2a16" stroke-width="2"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">500 miles · northeast · into the empire that broke them</text>
        </svg>`
      },
      {
        id: 'rivers-babylon',
        title: 'By the Rivers of Babylon',
        scriptureRef: 'Psalm 137:1-4',
        bibleText: '"By the rivers of Babylon we sat and wept when we remembered Zion. There on the poplars we hung our harps… How can we sing the songs of the Lord while in a foreign land?"',
        narration: 'In Babylon they were not slaves exactly. They were resettled — given land, allowed to marry, told to live their lives. But everything was wrong. The temple was gone. Sabbath felt strange. The festivals had no center. They sat by the canals and the rivers — the Tigris, the Euphrates — and remembered Jerusalem. Their captors mocked them: "Sing us one of the songs of Zion!" They could not. They hung their harps on the willows by the water and wept. "How can we sing the songs of the Lord in a foreign land?"',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'rb', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Moon, melancholy -->
          <circle cx="660" cy="100" r="32" fill="#fef3c7" opacity="0.6"/>
          <circle cx="660" cy="100" r="44" fill="rgba(254,243,199,0.18)"/>
          <!-- Distant Babylon -->
          <g transform="translate(680 280)" opacity="0.8">
            <rect x="-30" y="-20" width="60" height="20" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.8"/>
            <rect x="-22" y="-35" width="44" height="15" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.8"/>
            <rect x="-14" y="-50" width="28" height="15" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.8"/>
            <rect x="-6" y="-58" width="12" height="8" fill="#0a0d1a" stroke="rgba(251,191,36,0.45)" stroke-width="0.8"/>
          </g>
          <!-- Wide river running across foreground -->
          <path d="M 0 360 Q 200 350 400 360 Q 600 350 800 360 L 800 480 Q 600 470 400 482 Q 200 470 0 480 Z" fill="#1e1846" stroke="rgba(56,189,248,0.55)" stroke-width="1.2"/>
          <g fill="rgba(254,243,199,0.4)">
            <ellipse cx="120" cy="380" rx="22" ry="2"/>
            <ellipse cx="340" cy="395" rx="22" ry="2"/>
            <ellipse cx="540" cy="382" rx="22" ry="2"/>
            <ellipse cx="700" cy="395" rx="22" ry="2"/>
          </g>
          <!-- Reflection of moon -->
          <ellipse cx="660" cy="392" rx="22" ry="3" fill="rgba(254,243,199,0.35)"/>
          <!-- Riverbank -->
          <path d="M 0 320 Q 400 310 800 320 L 800 360 L 0 360 Z" fill="#241846"/>
          <!-- Several willow / poplar trees with HARPS HANGING from branches -->
          <g>
            <!-- Tree 1 -->
            <g transform="translate(180 320)">
              <line x1="0" y1="0" x2="-2" y2="-120" stroke="#0a0d1a" stroke-width="5"/>
              <!-- Drooping branches -->
              <path d="M -2 -120 Q -30 -80 -40 -30" stroke="#0a0d1a" stroke-width="2" fill="none"/>
              <path d="M -2 -120 Q 30 -80 40 -30" stroke="#0a0d1a" stroke-width="2" fill="none"/>
              <path d="M -2 -100 Q -20 -60 -22 -10" stroke="#0a0d1a" stroke-width="1.5" fill="none"/>
              <path d="M -2 -100 Q 20 -60 22 -10" stroke="#0a0d1a" stroke-width="1.5" fill="none"/>
              <!-- Harp hanging -->
              <g transform="translate(20 -60)">
                <path d="M 0 0 L 12 -24 Q 18 -22 16 -8 L 8 4 Z" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
                <line x1="1" y1="-4" x2="14" y2="-22" stroke="rgba(254,243,199,0.65)" stroke-width="0.6"/>
                <line x1="3" y1="-2" x2="13" y2="-20" stroke="rgba(254,243,199,0.65)" stroke-width="0.6"/>
                <line x1="5" y1="0"  x2="12" y2="-18" stroke="rgba(254,243,199,0.65)" stroke-width="0.6"/>
              </g>
            </g>
            <!-- Tree 2 -->
            <g transform="translate(540 320)">
              <line x1="0" y1="0" x2="2" y2="-130" stroke="#0a0d1a" stroke-width="5"/>
              <path d="M 2 -130 Q -28 -90 -40 -30" stroke="#0a0d1a" stroke-width="2" fill="none"/>
              <path d="M 2 -130 Q 32 -90 40 -30" stroke="#0a0d1a" stroke-width="2" fill="none"/>
              <path d="M 2 -110 Q -20 -70 -22 -10" stroke="#0a0d1a" stroke-width="1.5" fill="none"/>
              <path d="M 2 -110 Q 20 -70 22 -10" stroke="#0a0d1a" stroke-width="1.5" fill="none"/>
              <!-- Harp -->
              <g transform="translate(-22 -70)">
                <path d="M 0 0 L -12 -24 Q -18 -22 -16 -8 L -8 4 Z" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
                <line x1="-1" y1="-4" x2="-14" y2="-22" stroke="rgba(254,243,199,0.65)" stroke-width="0.6"/>
                <line x1="-3" y1="-2" x2="-13" y2="-20" stroke="rgba(254,243,199,0.65)" stroke-width="0.6"/>
                <line x1="-5" y1="0"  x2="-12" y2="-18" stroke="rgba(254,243,199,0.65)" stroke-width="0.6"/>
              </g>
            </g>
          </g>
          <!-- Several exiles seated by the river weeping -->
          <g fill="#1a1233">
            <g transform="translate(280 340)">
              <ellipse cx="0" cy="0" rx="20" ry="10"/>
              <ellipse cx="0" cy="-14" rx="12" ry="14"/>
              <ellipse cx="0" cy="-32" rx="11" ry="13"/>
              <!-- Head bowed into hands -->
              <line x1="-10" y1="-22" x2="-4" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="10"  y1="-22" x2="4"  y2="-32" stroke="#1a1233" stroke-width="3"/>
              <!-- Tear streaks -->
              <line x1="-3" y1="-26" x2="-3" y2="-22" stroke="rgba(56,189,248,0.85)" stroke-width="1"/>
              <line x1="3"  y1="-26" x2="3"  y2="-22" stroke="rgba(56,189,248,0.85)" stroke-width="1"/>
            </g>
            <g transform="translate(380 348)">
              <ellipse cx="0" cy="0" rx="18" ry="9"/>
              <ellipse cx="0" cy="-12" rx="11" ry="13"/>
              <ellipse cx="0" cy="-28" rx="10" ry="12"/>
              <line x1="-9" y1="-20" x2="-4" y2="-28" stroke="#1a1233" stroke-width="3"/>
              <line x1="9"  y1="-20" x2="4"  y2="-28" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(460 342)" opacity="0.9">
              <ellipse cx="0" cy="0" rx="18" ry="9"/>
              <ellipse cx="0" cy="-12" rx="11" ry="13"/>
              <ellipse cx="0" cy="-28" rx="10" ry="12"/>
              <line x1="-9" y1="-20" x2="-4" y2="-28" stroke="#1a1233" stroke-width="3"/>
              <line x1="9"  y1="-20" x2="4"  y2="-28" stroke="#1a1233" stroke-width="3"/>
            </g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"We hung our harps on the poplars · and wept"</text>
        </svg>`
      },
      {
        id: 'daniel-resolved',
        title: 'Daniel Resolved in His Heart',
        scriptureRef: 'Daniel 1:8',
        bibleText: '"But Daniel resolved not to defile himself with the royal food and wine."',
        narration: 'The Babylonians chose the best young men from among the exiled Jews and put them in a three-year program to become advisers to the king. They were given new Babylonian names, taught Babylonian literature and language, and offered the king\'s own food and wine — food that had been dedicated to idols. Daniel resolved in his heart: I will not eat it. He was a teenager in a foreign empire and he drew his line on day one. The Lord met him there. By the end of the program, when the king tested them all, Daniel and his three friends were ten times wiser than the best Babylonian scholars in the realm. Exile had not made them less faithful. It had made them more.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'dr', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Persian/Babylonian interior — winged-bull capitals -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.7)" stroke-width="1">
            <rect x="60" y="80" width="36" height="380"/>
            <rect x="704" y="80" width="36" height="380"/>
            <rect x="54" y="60" width="48" height="20" fill="#3d2a16"/>
            <rect x="698" y="60" width="48" height="20" fill="#3d2a16"/>
          </g>
          <!-- Floor -->
          <rect x="0" y="440" width="800" height="60" fill="#1a1233"/>
          <!-- Banquet table center -->
          <g>
            <rect x="180" y="320" width="440" height="40" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <rect x="180" y="358" width="440" height="14" fill="#241846"/>
            <!-- Lavish food: roasted meat platter -->
            <ellipse cx="280" cy="316" rx="36" ry="9" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <path d="M 254 314 Q 280 296 306 314" fill="#3d2a16" stroke="rgba(251,113,38,0.85)" stroke-width="1"/>
            <!-- Wine vessels -->
            <ellipse cx="380" cy="318" rx="12" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <line x1="380" y1="312" x2="380" y2="298" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="480" cy="316" rx="14" ry="7" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <line x1="480" y1="309" x2="480" y2="290" stroke="#3d2a16" stroke-width="2"/>
            <!-- Fruit bowl -->
            <path d="M 540 322 Q 560 314 580 322 L 576 332 Q 560 338 544 332 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <circle cx="552" cy="318" r="4" fill="rgba(120,20,20,0.85)"/>
            <circle cx="562" cy="316" r="4" fill="rgba(120,20,20,0.85)"/>
            <circle cx="572" cy="318" r="4" fill="rgba(120,20,20,0.85)"/>
          </g>
          <!-- A small bowl of vegetables and water in front of Daniel (his alternative) -->
          <g transform="translate(180 330)">
            <ellipse cx="0" cy="0" rx="22" ry="7" fill="#241846" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-4" rx="16" ry="3" fill="rgba(34,197,94,0.7)"/>
            <!-- A few leafy greens on top -->
            <line x1="-8" y1="-5" x2="-10" y2="-12" stroke="rgba(34,197,94,0.85)" stroke-width="1.4"/>
            <line x1="0" y1="-5" x2="2" y2="-12" stroke="rgba(34,197,94,0.85)" stroke-width="1.4"/>
            <line x1="8" y1="-5" x2="10" y2="-12" stroke="rgba(34,197,94,0.85)" stroke-width="1.4"/>
            <!-- Plain water cup -->
            <ellipse cx="36" cy="-4" rx="8" ry="3" fill="#241846" stroke="rgba(56,189,248,0.7)" stroke-width="0.8"/>
          </g>
          <!-- Daniel standing at table, hand raised PALM-OUT in polite refusal -->
          <g transform="translate(180 410)">
            <path d="M -14 0 Q -12 -50 0 -60 Q 12 -50 14 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-68" rx="11" ry="13" fill="#1a1233"/>
            <!-- Young (no beard yet) -->
            <path d="M -6 -64 Q 0 -56 6 -64" stroke="rgba(254,243,199,0.55)" stroke-width="0.8" fill="none"/>
            <!-- Hand raised, palm out -->
            <line x1="14" y1="-30" x2="32" y2="-44" stroke="#3d2a16" stroke-width="5"/>
            <rect x="30" y="-50" width="10" height="14" fill="#3d2a16" stroke="rgba(254,243,199,0.45)" stroke-width="0.5"/>
            <!-- Halo bright -->
            <circle cx="0" cy="-68" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- Three friends behind him -->
          <g transform="translate(80 420)">
            <ellipse cx="0" cy="0" rx="10" ry="28" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-30" rx="9" ry="11" fill="#1a1233"/>
            <circle cx="0" cy="-30" r="16" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.1"/>
          </g>
          <g transform="translate(120 420)">
            <ellipse cx="0" cy="0" rx="10" ry="28" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-30" rx="9" ry="11" fill="#1a1233"/>
            <circle cx="0" cy="-30" r="16" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.1"/>
          </g>
          <g transform="translate(140 425)" opacity="0.85">
            <ellipse cx="0" cy="0" rx="9" ry="26" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-28" rx="8" ry="10" fill="#1a1233"/>
            <circle cx="0" cy="-28" r="14" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
          </g>
          <!-- Babylonian official on the right side, brow furrowed -->
          <g transform="translate(640 410)">
            <ellipse cx="0" cy="0" rx="14" ry="40" fill="#1a1233"/>
            <ellipse cx="0" cy="-42" rx="12" ry="14" fill="#1a1233"/>
            <!-- Pointed beard -->
            <path d="M -8 -34 Q 0 -14 8 -34" stroke="rgba(254,243,199,0.55)" stroke-width="1.5" fill="none"/>
            <!-- Pointed hat -->
            <polygon points="-9,-54 9,-54 0,-72" fill="#3d2a5e" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <!-- Arm extended (offering food / questioning) -->
            <line x1="-14" y1="-22" x2="-30" y2="-32" stroke="#1a1233" stroke-width="4"/>
          </g>
          <!-- Label -->
          <text x="180" y="380" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">DANIEL · 16 yrs</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Daniel resolved in his heart"</text>
        </svg>`
      }
    ],
    closing: 'Israel did not lose God when they lost the temple. They learned, in Babylon, that the God they had worshipped in stone buildings could be worshipped in any kitchen in the diaspora. The exile was the worst thing that ever happened to Old Testament Israel — and it was the thing that made faithful Judaism portable. When the worst things in your life take you somewhere you would never have chosen, the same God you trusted in the home country is still waiting in the foreign one.',
    closingPrompt: 'What "exile" are you in right now — a season, a place, a relationship, a job you did not choose — and where might God already be teaching you to worship Him there?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 29 — Lazarus Raised
  // ════════════════════════════════════════════════════════════
  {
    id: 'lazarus-raised',
    title: 'Lazarus Raised',
    subtitle: 'Four days in the grave. One word from Jesus. The dead walked out.',
    icon: '🕊️',
    color: '#a78bfa',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'John 11',
    duration: '~6 min',
    scenes: [
      {
        id: 'message',
        title: 'Word of Sickness',
        scriptureRef: 'John 11:1-6',
        bibleText: '"Lord, the one you love is sick."',
        narration: 'A messenger came running across the Jordan from Bethany. "Lord, the one you love is sick." Mary and Martha had sent for Jesus. He was their dearest friend in the world. He could heal a stranger from a hundred miles away with a single word — surely He would come now. Jesus heard the message. He said, "This sickness will not end in death. It is for the glory of God." And then He stayed where He was. Two more days. The disciples did not understand.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'lzm', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Sun low on horizon -->
          <circle cx="660" cy="120" r="34" fill="#fef3c7"/>
          <circle cx="660" cy="120" r="52" fill="rgba(251,191,36,0.4)"/>
          <!-- Hills + ground -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Distant Bethany on horizon -->
          <g transform="translate(700 290)" opacity="0.6">
            <rect x="-14" y="-10" width="10" height="10" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="0" y="-15" width="12" height="15" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <polygon points="-1,-15 5,-22 11,-15" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <rect x="14" y="-8" width="10" height="8" fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
          </g>
          <text x="700" y="280" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.7)">BETHANY</text>
          <!-- Jesus seated on stone, disciples around -->
          <g transform="translate(280 360)">
            <path d="M -22 0 Q -18 -44 0 -56 Q 18 -44 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-66" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -58 Q 0 -46 8 -58" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -66 Q -16 -52 -12 -36 M 10 -66 Q 16 -52 12 -36" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <circle cx="0" cy="-66" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- Disciples -->
          <g fill="#0a0d1a" opacity="0.8">
            <g transform="translate(200 410)"><ellipse cx="0" cy="0" rx="7" ry="20"/><ellipse cx="0" cy="-22" rx="6" ry="7"/></g>
            <g transform="translate(360 415)"><ellipse cx="0" cy="0" rx="7" ry="20"/><ellipse cx="0" cy="-22" rx="6" ry="7"/></g>
          </g>
          <!-- Messenger running toward Jesus, urgent — leaning forward -->
          <g transform="translate(500 400)">
            <ellipse cx="0" cy="0" rx="9" ry="22" transform="rotate(-18 0 0)" fill="#1a1233"/>
            <ellipse cx="-4" cy="-22" rx="8" ry="9" fill="#1a1233"/>
            <line x1="-6" y1="-10" x2="-20" y2="-30" stroke="#1a1233" stroke-width="4"/>
            <line x1="6"  y1="-10" x2="18" y2="-30" stroke="#1a1233" stroke-width="4"/>
            <line x1="-4" y1="20" x2="-16" y2="36" stroke="#1a1233" stroke-width="4"/>
            <line x1="4"  y1="18" x2="16" y2="32" stroke="#1a1233" stroke-width="4"/>
          </g>
          <!-- Dust kicked up behind messenger -->
          <g fill="rgba(254,243,199,0.3)">
            <ellipse cx="540" cy="425" rx="22" ry="6"/>
            <ellipse cx="580" cy="430" rx="18" ry="4"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Lord, the one you love is sick"</text>
        </svg>`
      },
      {
        id: 'late',
        title: 'Four Days Too Late',
        scriptureRef: 'John 11:17-27',
        bibleText: '"Lord, if you had been here, my brother would not have died… But even now, I know that whatever you ask, God will give you."',
        narration: 'When Jesus finally arrived, Lazarus had been dead four days. Martha heard He was coming and ran out of the village to meet Him. She did not say hello. She said: "Lord, if you had been here, my brother would not have died." Then she added a sentence that has rung in the heart of every grieving believer since: "But even now, I know that whatever you ask, God will give you." Jesus looked at her and said, "I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live. Do you believe this?" "Yes, Lord. I believe."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'lzl', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <g fill="#fef3c7" opacity="0.55">
            <circle cx="80" cy="50" r="0.8"/><circle cx="220" cy="80" r="0.9"/>
            <circle cx="380" cy="40" r="0.7"/><circle cx="540" cy="60" r="0.9"/>
          </g>
          <!-- Bethany — closer now, several houses on the right -->
          <g transform="translate(620 380)">
            <rect x="-50" y="-60" width="100" height="60" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <polygon points="-58,-60 0,-94 58,-60" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <rect x="-10" y="-30" width="20" height="30" fill="#0a0d1a"/>
            <rect x="-34" y="-50" width="14" height="14" fill="rgba(251,191,36,0.55)"/>
            <rect x="22"  y="-50" width="14" height="14" fill="rgba(251,191,36,0.55)"/>
          </g>
          <g transform="translate(720 400)" opacity="0.8">
            <rect x="-30" y="-40" width="60" height="40" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <polygon points="-36,-40 0,-60 36,-40" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <rect x="-8" y="-22" width="16" height="22" fill="#0a0d1a"/>
          </g>
          <!-- Ground / road -->
          <path d="M 0 410 Q 400 400 800 410 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 80 460 Q 300 430 540 410" stroke="rgba(254,243,199,0.5)" stroke-width="6" fill="none" stroke-dasharray="6 8"/>
          <!-- Martha running down the road in mourning robes -->
          <g transform="translate(400 410)">
            <path d="M -20 0 Q -18 -42 0 -52 Q 18 -42 20 0 Z" fill="#1a1233" stroke="rgba(254,243,199,0.5)" stroke-width="1"/>
            <ellipse cx="0" cy="-62" rx="12" ry="14" fill="#1a1233"/>
            <!-- Mourning veil -->
            <path d="M -12 -68 Q 0 -82 12 -68 Q 14 -54 0 -50 Q -14 -54 -12 -68 Z" fill="#0a0d1a" stroke="rgba(251,191,36,0.55)" stroke-width="0.7"/>
            <!-- Hands extended forward toward Jesus, palms up -->
            <line x1="-18" y1="-32" x2="-42" y2="-26" stroke="#1a1233" stroke-width="5"/>
            <line x1="18"  y1="-32" x2="42" y2="-26" stroke="#1a1233" stroke-width="5"/>
            <!-- Tear streaks on cheek -->
            <line x1="-3" y1="-62" x2="-3" y2="-56" stroke="rgba(56,189,248,0.7)" stroke-width="1"/>
            <line x1="3"  y1="-62" x2="3"  y2="-56" stroke="rgba(56,189,248,0.7)" stroke-width="1"/>
            <!-- Halo (faith returning) -->
            <circle cx="0" cy="-62" r="20" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.3"/>
          </g>
          <!-- Jesus walking up the road from the left, hand extended toward Martha -->
          <g transform="translate(220 400)">
            <path d="M -16 0 Q -14 -46 0 -56 Q 14 -46 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-66" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -58 Q 0 -46 8 -58" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -66 Q -16 -52 -12 -38 M 10 -66 Q 16 -52 12 -38" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Hand extended to Martha -->
            <line x1="14" y1="-30" x2="40" y2="-20" stroke="#3d2a16" stroke-width="5"/>
            <circle cx="0" cy="-66" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.7"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"I am the resurrection and the life"</text>
        </svg>`
      },
      {
        id: 'jesus-wept',
        title: 'Jesus Wept',
        scriptureRef: 'John 11:33-38',
        bibleText: '"When Jesus saw her weeping, and the Jews who had come along with her also weeping, he was deeply moved in spirit and troubled… Jesus wept."',
        narration: 'Mary came too. She fell at His feet sobbing. The whole village was wailing. Jesus, who knew exactly what He was about to do, did not skip ahead to the joyful part. He stood at the tomb of His friend and He cried. The shortest verse in the Bible: Jesus wept. The bystanders said, "See how he loved him." And then they led Him to the tomb — a cave with a stone rolled across its mouth.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'lzw', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <!-- Cliff face with cave tomb cut into it -->
          <path d="M 0 500 L 0 220 Q 100 180 280 200 Q 460 220 580 200 Q 740 180 800 220 L 800 500 Z" fill="#241846" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          <!-- The tomb — round opening sealed with a large rolled stone -->
          <g transform="translate(580 360)">
            <!-- Cave opening (visible behind stone, half covered) -->
            <ellipse cx="0" cy="0" rx="56" ry="46" fill="#000a14" stroke="rgba(251,191,36,0.6)" stroke-width="1.4"/>
            <!-- Large round rolling stone (mostly covering opening) -->
            <circle cx="-10" cy="6" r="48" fill="#3d2a16" stroke="rgba(254,243,199,0.55)" stroke-width="1.4"/>
            <circle cx="-18" cy="0" r="3" fill="rgba(254,243,199,0.45)"/>
            <circle cx="-2" cy="14" r="2" fill="rgba(254,243,199,0.4)"/>
          </g>
          <!-- "LAZARUS" small inscription above tomb -->
          <text x="580" y="290" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.6)">LAZARUS · 4 DAYS</text>
          <!-- Ground -->
          <path d="M 0 460 Q 400 452 800 460 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Jesus standing center-left, facing the tomb, weeping — head bowed, hand to face -->
          <g transform="translate(360 410)">
            <path d="M -22 0 Q -18 -50 0 -60 Q 18 -50 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
            <ellipse cx="0" cy="-70" rx="13" ry="15" fill="#1a1233"/>
            <path d="M -8 -62 Q 0 -50 8 -62" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <path d="M -10 -70 Q -16 -56 -12 -40 M 10 -70 Q 16 -56 12 -40" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Hand to face -->
            <line x1="-12" y1="-44" x2="-4" y2="-66" stroke="#3d2a16" stroke-width="4"/>
            <!-- TEARS visible -->
            <line x1="-4" y1="-66" x2="-4" y2="-58" stroke="rgba(56,189,248,0.85)" stroke-width="1.2"/>
            <line x1="4" y1="-68" x2="4" y2="-58" stroke="rgba(56,189,248,0.85)" stroke-width="1.2"/>
            <circle cx="-4" cy="-56" r="1.5" fill="rgba(56,189,248,0.85)"/>
            <circle cx="4"  cy="-56" r="1.5" fill="rgba(56,189,248,0.85)"/>
            <!-- Halo subdued (grief) -->
            <circle cx="0" cy="-70" r="24" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.3"/>
          </g>
          <!-- Mary collapsed at Jesus's feet -->
          <g transform="translate(290 442)">
            <ellipse cx="0" cy="0" rx="24" ry="9" fill="#1a1233"/>
            <ellipse cx="0" cy="-12" rx="13" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-30" rx="11" ry="13" fill="#1a1233"/>
            <line x1="-9" y1="-22" x2="-3" y2="-30" stroke="#1a1233" stroke-width="3"/>
            <line x1="9"  y1="-22" x2="3"  y2="-30" stroke="#1a1233" stroke-width="3"/>
            <line x1="-3" y1="-28" x2="-3" y2="-22" stroke="rgba(56,189,248,0.85)" stroke-width="1.2"/>
            <line x1="3"  y1="-28" x2="3"  y2="-22" stroke="rgba(56,189,248,0.85)" stroke-width="1.2"/>
          </g>
          <!-- Other mourners around, also weeping -->
          <g fill="#1a1233" opacity="0.85">
            <g transform="translate(160 430)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="-6" y1="-14" x2="-2" y2="-22" stroke="#1a1233" stroke-width="3"/>
              <line x1="6" y1="-14" x2="2" y2="-22" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(220 432)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="-6" y1="-14" x2="-2" y2="-22" stroke="#1a1233" stroke-width="3"/>
              <line x1="6" y1="-14" x2="2" y2="-22" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(430 432)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="-6" y1="-14" x2="-2" y2="-22" stroke="#1a1233" stroke-width="3"/>
              <line x1="6" y1="-14" x2="2" y2="-22" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(490 430)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="-6" y1="-14" x2="-2" y2="-22" stroke="#1a1233" stroke-width="3"/>
              <line x1="6" y1="-14" x2="2" y2="-22" stroke="#1a1233" stroke-width="3"/>
            </g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Jesus wept"</text>
        </svg>`
      },
      {
        id: 'come-out',
        title: 'Lazarus · Come Out!',
        scriptureRef: 'John 11:39-44',
        bibleText: '"Take away the stone." …Then Jesus called in a loud voice, "Lazarus, come out!" The dead man came out, his hands and feet wrapped with strips of linen.',
        narration: 'Take away the stone. Martha objected — Lord, by now he stinks; it has been four days. Jesus said, "Did I not tell you that if you believed, you would see the glory of God?" They rolled the stone aside. Jesus looked up to heaven and prayed out loud — not because He needed to, but so the people would hear. Then He cried with a great shout: "Lazarus! Come out!" And the dead man came out. Hands and feet wrapped in linen. Face still covered. Living. Jesus said: "Unbind him. Let him go."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="lzcGlory" cx="0.5" cy="0.4" r="0.55">
              <stop offset="0%" stop-color="rgba(254,243,199,0.85)"/>
              <stop offset="50%" stop-color="rgba(251,191,36,0.4)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="#0a0d1a"/>
          <ellipse cx="500" cy="240" rx="420" ry="280" fill="url(#lzcGlory)"/>
          <!-- Cliff face with tomb opening WIDE OPEN -->
          <path d="M 0 500 L 0 220 Q 100 180 280 200 Q 460 220 580 200 Q 740 180 800 220 L 800 500 Z" fill="#241846" stroke="rgba(251,191,36,0.6)" stroke-width="1.4"/>
          <!-- Massive dark cave opening (stone rolled all the way aside) -->
          <g transform="translate(580 340)">
            <path d="M -64 80 Q -70 -40 0 -70 Q 70 -40 64 80 Z" fill="#000a14" stroke="rgba(251,191,36,0.85)" stroke-width="2"/>
            <!-- Glow from inside -->
            <radialGradient id="lzcCave" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%" stop-color="rgba(254,243,199,0.6)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
            <ellipse cx="0" cy="0" rx="50" ry="40" fill="url(#lzcCave)"/>
          </g>
          <!-- Rolled-aside stone in front -->
          <circle cx="660" cy="430" r="44" fill="#3d2a16" stroke="rgba(254,243,199,0.55)" stroke-width="1.4"/>
          <!-- Lazarus emerging from the tomb opening, wrapped in linen, shuffling forward -->
          <g transform="translate(580 410)">
            <!-- Body wrapped head-to-toe in linen strips -->
            <ellipse cx="0" cy="0" rx="16" ry="40" fill="#fef3c7" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <ellipse cx="0" cy="-44" rx="14" ry="16" fill="#fef3c7" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <!-- Linen wrapping lines on body -->
            <g stroke="rgba(251,113,38,0.55)" stroke-width="0.7" fill="none">
              <line x1="-16" y1="-30" x2="16" y2="-30"/>
              <line x1="-16" y1="-15" x2="16" y2="-15"/>
              <line x1="-16" y1="0" x2="16" y2="0"/>
              <line x1="-16" y1="15" x2="16" y2="15"/>
              <line x1="-16" y1="30" x2="16" y2="30"/>
              <!-- Face wrap -->
              <line x1="-14" y1="-50" x2="14" y2="-50"/>
              <line x1="-14" y1="-44" x2="14" y2="-44"/>
              <line x1="-14" y1="-38" x2="14" y2="-38"/>
            </g>
            <!-- Halo big and bright (life returning) -->
            <circle cx="0" cy="-44" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-44" r="40" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1.2"/>
          </g>
          <text x="580" y="450" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.85)">LAZARUS</text>
          <!-- Jesus center-left, arm extended TOWARD the tomb, head thrown back, calling -->
          <g transform="translate(280 390)">
            <path d="M -22 0 Q -18 -50 0 -60 Q 18 -50 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-72" rx="13" ry="15" fill="#1a1233"/>
            <!-- Head thrown UP -->
            <path d="M -8 -64 Q 0 -52 8 -64" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <path d="M -10 -72 Q -18 -86 -8 -90" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <path d="M 10 -72 Q 18 -86 8 -90" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Arm extended forward toward tomb (right side) -->
            <line x1="22" y1="-36" x2="80" y2="-32" stroke="#3d2a16" stroke-width="6"/>
            <!-- Pointing finger -->
            <line x1="80" y1="-32" x2="92" y2="-30" stroke="#3d2a16" stroke-width="4"/>
            <!-- Bright halo + outer ring -->
            <circle cx="0" cy="-72" r="32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-72" r="46" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          </g>
          <!-- HUGE shouted command floating between them -->
          <text x="400" y="160" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="34" letter-spacing="8" fill="rgba(251,191,36,0.95)">"LAZARUS,</text>
          <text x="400" y="210" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="34" letter-spacing="8" fill="rgba(251,191,36,0.95)">COME OUT!"</text>
          <!-- Crowd witnessing (left edge) -->
          <g fill="#0a0d1a" opacity="0.75">
            <g transform="translate(80 430)"><ellipse cx="0" cy="0" rx="6" ry="16"/><ellipse cx="0" cy="-18" rx="5" ry="6"/></g>
            <g transform="translate(120 432)"><ellipse cx="0" cy="0" rx="6" ry="16"/><ellipse cx="0" cy="-18" rx="5" ry="6"/></g>
            <g transform="translate(160 430)"><ellipse cx="0" cy="0" rx="6" ry="16"/><ellipse cx="0" cy="-18" rx="5" ry="6"/></g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Unbind him · let him go"</text>
        </svg>`
      }
    ],
    closing: 'Jesus could have shown up before the funeral and there would have been no funeral. He chose to come after. He let four days of grief happen so that Mary and Martha and the whole village would see — with their own eyes — that He has authority not just over sickness but over death itself. Sometimes Jesus is "late" by your calendar. He is on time by His. The story you are in the middle of may look like a tomb. It may smell like one. He is on the way. And He has not forgotten how to call a name into the dark.',
    closingPrompt: 'What in your life has been dead long enough that you have stopped expecting Jesus to do anything about it — and what would it look like to bring Him to the tomb anyway?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 30 — Peter Walks on Water
  // ════════════════════════════════════════════════════════════
  {
    id: 'peter-walks-water',
    title: 'Peter Walks on Water',
    subtitle: 'A storm at the fourth watch — and a fisherman who got out of the boat.',
    icon: '🌊',
    color: '#38bdf8',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Matthew 14:22-33',
    duration: '~5 min',
    scenes: [
      {
        id: 'storm-boat',
        title: 'A Storm in the Fourth Watch',
        scriptureRef: 'Matthew 14:22-25',
        bibleText: '"Shortly before dawn Jesus went out to them, walking on the lake."',
        narration: 'Jesus had sent the disciples ahead of Him across the Sea of Galilee while He stayed back to pray on a mountainside. Out on the open water, a sudden wind came down on them. Waves rose higher than the gunwales. They rowed hard against it all night. By three in the morning — the fourth watch — they were exhausted, terrified, and getting nowhere.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="psbSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0d1a"/>
              <stop offset="60%" stop-color="#241846"/>
              <stop offset="100%" stop-color="#3d2a5e"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#psbSky)"/>
          <!-- Lightning -->
          <polyline points="160,40 200,180 170,170 200,310" stroke="rgba(254,243,199,0.85)" stroke-width="2" fill="none"/>
          <polyline points="620,60 660,180 630,170 660,300" stroke="rgba(254,243,199,0.85)" stroke-width="2" fill="none"/>
          <!-- Heavy storm clouds -->
          <g fill="#0a0d1a" opacity="0.9">
            <ellipse cx="160" cy="80" rx="140" ry="40"/>
            <ellipse cx="400" cy="60" rx="180" ry="44"/>
            <ellipse cx="640" cy="80" rx="140" ry="42"/>
          </g>
          <!-- Massive waves -->
          <path d="M 0 340 Q 100 270 220 340 Q 340 270 460 340 Q 580 270 700 340 L 800 340 L 800 500 L 0 500 Z" fill="#1e1846"/>
          <path d="M 0 410 Q 200 360 400 410 Q 600 360 800 410 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <g stroke="rgba(254,243,199,0.5)" stroke-width="1.6" fill="none">
            <path d="M 100 310 Q 130 296 160 310"/>
            <path d="M 340 312 Q 370 296 400 312"/>
            <path d="M 580 308 Q 610 294 640 308"/>
          </g>
          <!-- Boat tossed -->
          <g transform="translate(420 340) rotate(-15)">
            <path d="M -68 0 Q -52 22 0 26 Q 52 22 68 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.6)" stroke-width="1.4"/>
            <line x1="0" y1="0" x2="0" y2="-60" stroke="#3d2a16" stroke-width="3"/>
            <!-- Sail torn, flapping -->
            <path d="M 0 -58 L -28 -16 L 22 -10 Z" fill="#fef3c7" opacity="0.7" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <!-- Disciples gripping the boat -->
            <g fill="#0a0d1a">
              <ellipse cx="-40" cy="6" rx="5" ry="7"/>
              <ellipse cx="-20" cy="8" rx="5" ry="7"/>
              <ellipse cx="0" cy="8" rx="5" ry="7"/>
              <ellipse cx="20" cy="8" rx="5" ry="7"/>
              <ellipse cx="40" cy="6" rx="5" ry="7"/>
            </g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">The fourth watch of the night · still no shore in sight</text>
        </svg>`
      },
      {
        id: 'figure-walking',
        title: 'A Figure on the Water',
        scriptureRef: 'Matthew 14:25-27',
        bibleText: '"\'Take courage! It is I. Don\'t be afraid.\'"',
        narration: 'In the gray-black hour before dawn, one of the disciples pointed. Out on the open water — walking ON it — was a man. They thought it was a ghost. They cried out in terror. And then a voice they had all heard a hundred times said over the wind: "Take courage. It is I. Do not be afraid."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pfw', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e', stars:false})}
          <!-- Hint of dawn on horizon -->
          <ellipse cx="700" cy="240" rx="160" ry="40" fill="rgba(251,113,38,0.25)"/>
          <!-- Receding storm clouds -->
          <g fill="#0a0d1a" opacity="0.7">
            <ellipse cx="200" cy="100" rx="160" ry="36"/>
            <ellipse cx="500" cy="80" rx="180" ry="36"/>
          </g>
          <!-- Wavy sea -->
          <path d="M 0 320 Q 200 290 400 320 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#1e1846"/>
          <path d="M 0 380 Q 400 360 800 380 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <g stroke="rgba(254,243,199,0.45)" stroke-width="1.5" fill="none">
            <path d="M 60 330 Q 100 320 140 330"/>
            <path d="M 460 328 Q 500 318 540 328"/>
            <path d="M 680 332 Q 720 322 760 332"/>
          </g>
          <!-- Boat in foreground -->
          <g transform="translate(640 360) rotate(-8)">
            <path d="M -56 0 Q -42 18 0 22 Q 42 18 56 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <line x1="0" y1="0" x2="0" y2="-46" stroke="#3d2a16" stroke-width="2.5"/>
            <!-- Disciples — multiple silhouettes, one pointing -->
            <g fill="#0a0d1a">
              <ellipse cx="-32" cy="4" rx="5" ry="9"/>
              <ellipse cx="-32" cy="-6" rx="4" ry="4"/>
              <line x1="-30" y1="-4" x2="-46" y2="-14" stroke="#0a0d1a" stroke-width="2"/>
              <ellipse cx="-12" cy="6" rx="5" ry="8"/>
              <ellipse cx="-12" cy="-2" rx="4" ry="4"/>
              <ellipse cx="8" cy="6" rx="5" ry="8"/>
              <ellipse cx="8" cy="-2" rx="4" ry="4"/>
              <ellipse cx="28" cy="6" rx="5" ry="8"/>
              <ellipse cx="28" cy="-2" rx="4" ry="4"/>
            </g>
          </g>
          <!-- Jesus walking ON the water, far across, glowing -->
          <g transform="translate(220 360)">
            <!-- Glowing path on water beneath Him -->
            <ellipse cx="0" cy="20" rx="48" ry="6" fill="rgba(251,191,36,0.45)"/>
            <ellipse cx="0" cy="22" rx="32" ry="4" fill="rgba(254,243,199,0.55)"/>
            <!-- Figure -->
            <path d="M -18 20 Q -16 -36 0 -50 Q 16 -36 18 20 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-60" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -52 Q 0 -38 8 -52" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -60 Q -16 -46 -12 -32 M 10 -60 Q 16 -46 12 -32" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Halo brilliant -->
            <circle cx="0" cy="-60" r="28" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-60" r="42" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Take courage · it is I · do not be afraid"</text>
        </svg>`
      },
      {
        id: 'peter-steps-out',
        title: 'Lord — Tell Me to Come',
        scriptureRef: 'Matthew 14:28-29',
        bibleText: '"\'Lord, if it\'s you,\' Peter replied, \'tell me to come to you on the water.\' \'Come,\' he said. Then Peter got down out of the boat, walked on the water and came toward Jesus."',
        narration: 'Of the twelve men in that boat, only one asked the question Peter asked: "Lord — if it really is you — tell me to come to you on the water." Jesus said, "Come." And Peter swung his legs over the side of the boat and stepped down. The water held. For a few astonishing seconds, a Galilean fisherman walked on the surface of the Sea of Galilee toward the only Person who had ever called him out there. The other eleven watched from inside the boat.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pso', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#fb923c', stars:false})}
          <!-- Dawn -->
          <circle cx="680" cy="180" r="28" fill="#fef3c7"/>
          <circle cx="680" cy="180" r="44" fill="rgba(251,113,38,0.5)"/>
          <!-- Sea -->
          <path d="M 0 340 Q 400 320 800 340 L 800 500 L 0 500 Z" fill="#1e1846"/>
          <g stroke="rgba(254,243,199,0.4)" stroke-width="1.5" fill="none">
            <path d="M 100 360 Q 140 350 180 360"/>
            <path d="M 380 372 Q 420 362 460 372"/>
            <path d="M 620 368 Q 660 358 700 368"/>
          </g>
          <!-- Boat on right with disciples watching -->
          <g transform="translate(620 360)">
            <path d="M -54 0 Q -40 18 0 22 Q 40 18 54 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <line x1="0" y1="0" x2="0" y2="-44" stroke="#3d2a16" stroke-width="2.5"/>
            <!-- Disciples leaning over edge -->
            <g fill="#0a0d1a">
              <ellipse cx="-30" cy="-2" rx="5" ry="7"/>
              <ellipse cx="-12" cy="-2" rx="5" ry="7"/>
              <ellipse cx="6" cy="-2" rx="5" ry="7"/>
              <ellipse cx="24" cy="-2" rx="5" ry="7"/>
            </g>
            <!-- One missing — where Peter was sitting (empty bench, oar on the floor) -->
            <line x1="-46" y1="-2" x2="-30" y2="-8" stroke="#3d2a16" stroke-width="2"/>
          </g>
          <!-- Peter mid-water, taking second or third step, arms slightly out for balance -->
          <g transform="translate(400 360)">
            <!-- Splash ring under his feet -->
            <ellipse cx="0" cy="20" rx="32" ry="5" fill="rgba(254,243,199,0.55)"/>
            <ellipse cx="0" cy="22" rx="20" ry="3" fill="rgba(254,243,199,0.85)"/>
            <!-- Body -->
            <path d="M -16 18 Q -14 -32 0 -42 Q 14 -32 16 18 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.3"/>
            <ellipse cx="0" cy="-50" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -7 -42 Q 0 -28 7 -42" stroke="rgba(254,243,199,0.55)" stroke-width="1.3" fill="none"/>
            <!-- Arms outstretched -->
            <line x1="-14" y1="-22" x2="-32" y2="-30" stroke="#3d2a16" stroke-width="4"/>
            <line x1="14"  y1="-22" x2="32" y2="-30" stroke="#3d2a16" stroke-width="4"/>
            <!-- Halo (faith glowing) -->
            <circle cx="0" cy="-50" r="20" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <text x="400" y="395" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">PETER</text>
          <!-- Jesus at far left, arm extended welcoming, glowing -->
          <g transform="translate(160 360)">
            <ellipse cx="0" cy="20" rx="44" ry="6" fill="rgba(251,191,36,0.55)"/>
            <ellipse cx="0" cy="22" rx="28" ry="4" fill="rgba(254,243,199,0.85)"/>
            <path d="M -20 18 Q -16 -40 0 -54 Q 16 -40 20 18 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
            <ellipse cx="0" cy="-66" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -58 Q 0 -44 8 -58" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Arm extended welcoming Peter (forward) -->
            <line x1="20" y1="-30" x2="60" y2="-22" stroke="#3d2a16" stroke-width="6"/>
            <line x1="60" y1="-22" x2="80" y2="-20" stroke="#3d2a16" stroke-width="4"/>
            <circle cx="0" cy="-66" r="28" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-66" r="44" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Come"</text>
        </svg>`
      },
      {
        id: 'sinking-caught',
        title: 'Lord — Save Me!',
        scriptureRef: 'Matthew 14:30-32',
        bibleText: '"Immediately Jesus reached out his hand and caught him. \'You of little faith,\' he said, \'why did you doubt?\'"',
        narration: 'But then Peter saw the wind. He felt how high the waves really were. He thought about what he was doing — and as soon as he did, he started to sink. He cried out the shortest prayer in the New Testament: "Lord, save me!" Immediately Jesus reached out His hand and caught him. He pulled him up. He walked him back to the boat. He said, very gently, "You of little faith — why did you doubt?" The moment they climbed into the boat together, the wind died. The other eleven worshipped Him: "Truly you are the Son of God."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'psk', skyTop:'#3d2a5e', skyMid:'#fb923c', skyBot:'#fbbf24', stars:false})}
          <circle cx="660" cy="120" r="34" fill="#fef3c7"/>
          <circle cx="660" cy="120" r="54" fill="rgba(251,191,36,0.4)"/>
          <!-- Sea calmer than the storm now, but Peter is in trouble -->
          <path d="M 0 320 Q 200 305 400 320 Q 600 305 800 320 L 800 500 L 0 500 Z" fill="#1e1846"/>
          <g stroke="rgba(254,243,199,0.45)" stroke-width="1.5" fill="none">
            <path d="M 100 350 Q 140 340 180 350"/>
            <path d="M 480 358 Q 520 348 560 358"/>
          </g>
          <!-- Peter sinking — only upper body above water, splashing, arm reaching UP -->
          <g transform="translate(440 360)">
            <!-- Big splash around him -->
            <ellipse cx="0" cy="0" rx="50" ry="10" fill="rgba(254,243,199,0.55)"/>
            <ellipse cx="0" cy="-2" rx="36" ry="6" fill="rgba(254,243,199,0.85)"/>
            <!-- Spray droplets -->
            <g fill="rgba(254,243,199,0.95)">
              <circle cx="-40" cy="-12" r="2"/><circle cx="-30" cy="-22" r="2.5"/>
              <circle cx="40" cy="-12" r="2"/><circle cx="32" cy="-22" r="2.5"/>
              <circle cx="0" cy="-32" r="2"/>
            </g>
            <!-- Body half-submerged -->
            <path d="M -14 0 Q -12 -18 0 -22 Q 12 -18 14 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.75)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-28" rx="10" ry="12" fill="#1a1233"/>
            <!-- Wet beard -->
            <path d="M -7 -22 Q 0 -10 7 -22" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <!-- One arm thrown UP, frantic -->
            <line x1="6" y1="-12" x2="2" y2="-60" stroke="#3d2a16" stroke-width="6"/>
            <!-- Wide-open hand reaching -->
            <circle cx="2" cy="-64" r="6" fill="#3d2a16"/>
            <!-- Other arm under water -->
            <line x1="-10" y1="-6" x2="-22" y2="2" stroke="#3d2a16" stroke-width="4"/>
            <!-- Mouth open shouting -->
            <ellipse cx="0" cy="-25" rx="2" ry="3" fill="rgba(254,243,199,0.65)"/>
            <!-- Halo flickering (dashed) -->
            <circle cx="0" cy="-28" r="18" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1" stroke-dasharray="3 4"/>
          </g>
          <!-- Jesus right there, arm reaching DOWN, grasping Peter's upraised hand -->
          <g transform="translate(380 340)">
            <ellipse cx="0" cy="40" rx="36" ry="6" fill="rgba(251,191,36,0.45)"/>
            <ellipse cx="0" cy="42" rx="24" ry="4" fill="rgba(254,243,199,0.85)"/>
            <path d="M -20 40 Q -16 -22 0 -36 Q 16 -22 20 40 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-48" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -40 Q 0 -26 8 -40" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -48 Q -16 -32 -12 -16 M 10 -48 Q 16 -32 12 -16" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Arm reaching down forward -->
            <line x1="14" y1="-12" x2="60" y2="20" stroke="#3d2a16" stroke-width="7"/>
            <!-- Hand gripping Peter's hand (overlapping circles where hands meet) -->
            <circle cx="62" cy="20" r="9" fill="#3d2a16"/>
            <!-- Halo huge and bright -->
            <circle cx="0" cy="-48" r="32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-48" r="46" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          </g>
          <!-- Boat in distance, calm now -->
          <g transform="translate(680 340)" opacity="0.85">
            <path d="M -34 0 Q -22 14 0 16 Q 22 14 34 0 Z" fill="#3d2a16"/>
            <line x1="0" y1="0" x2="0" y2="-30" stroke="#3d2a16" stroke-width="2"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Lord · save me!" · "Why did you doubt?"</text>
        </svg>`
      }
    ],
    closing: 'Peter gets the wrong reputation for this story. The other eleven disciples never got out of the boat. He got out — and he sank halfway across — and Jesus did not call him a failure for sinking. He called him "of little faith" for doubting in the middle of a miracle that was already happening. The next time you find yourself sinking in the middle of obedience, remember: Jesus did not let go. The moment you cry out, the hand is already there.',
    closingPrompt: 'Where in your life is Jesus saying "come" — and what is the wind around you trying to convince you to look at instead?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 31 — The Last Supper
  // ════════════════════════════════════════════════════════════
  {
    id: 'last-supper',
    title: 'The Last Supper',
    subtitle: 'A Passover meal that became the first communion.',
    icon: '🍞',
    color: '#a78bfa',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'John 13 · Luke 22 · Matthew 26',
    duration: '~6 min',
    scenes: [
      {
        id: 'upper-room',
        title: 'The Upper Room',
        scriptureRef: 'Luke 22:7-13',
        bibleText: '"\'A man carrying a jar of water will meet you. Follow him to the house that he enters… He will show you a large room upstairs, all furnished. Make preparations there.\'"',
        narration: 'On the first day of Unleavened Bread, Jesus sent Peter and John ahead into Jerusalem. "You\'ll see a man carrying a water jar — which men never did. Follow him." They followed and were shown a large upper room, fully furnished and ready. They cooked the Passover lamb. They set out the bitter herbs and the unleavened bread and four cups of wine. As the sun went down, the twelve arrived. The room glowed with the warm light of a dozen oil lamps. Jesus took His place at the table and said, "I have eagerly desired to eat this Passover with you before I suffer."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'lsu', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Interior — upper room. Stone walls and ceiling beams -->
          <rect x="0" y="0" width="800" height="500" fill="#1a1233"/>
          <g fill="#3d2a16" opacity="0.7">
            <rect x="0" y="0" width="800" height="14"/>
            <rect x="0" y="160" width="800" height="6"/>
          </g>
          <!-- Hanging oil lamps -->
          <g>
            <line x1="200" y1="0" x2="200" y2="60" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <ellipse cx="200" cy="68" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="200" cy="64" rx="6" ry="7" fill="#fbbf24"/>
            <ellipse cx="200" cy="40" rx="40" ry="22" fill="rgba(251,191,36,0.2)"/>
            <line x1="400" y1="0" x2="400" y2="60" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <ellipse cx="400" cy="68" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="400" cy="64" rx="6" ry="7" fill="#fbbf24"/>
            <ellipse cx="400" cy="40" rx="40" ry="22" fill="rgba(251,191,36,0.22)"/>
            <line x1="600" y1="0" x2="600" y2="60" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            <ellipse cx="600" cy="68" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="600" cy="64" rx="6" ry="7" fill="#fbbf24"/>
            <ellipse cx="600" cy="40" rx="40" ry="22" fill="rgba(251,191,36,0.2)"/>
          </g>
          <!-- Warm pool of light filling middle -->
          <radialGradient id="lsuLamp" cx="0.5" cy="0.55" r="0.55">
            <stop offset="0%" stop-color="rgba(251,113,38,0.3)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.12)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="320" rx="380" ry="160" fill="url(#lsuLamp)"/>
          <!-- Low table (people would have reclined around it). Modern depiction works fine -->
          <g>
            <rect x="140" y="320" width="520" height="32" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <rect x="140" y="350" width="520" height="12" fill="#241846"/>
            <!-- Wine cups + bread plates + bitter herbs -->
            <ellipse cx="220" cy="316" rx="10" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <line x1="220" y1="311" x2="220" y2="300" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="320" cy="318" rx="14" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <!-- Round flat bread -->
            <ellipse cx="320" cy="312" rx="11" ry="3" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.5"/>
            <!-- Cup -->
            <ellipse cx="420" cy="316" rx="11" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <line x1="420" y1="311" x2="420" y2="298" stroke="#3d2a16" stroke-width="2"/>
            <!-- Bread loaf 2 -->
            <ellipse cx="500" cy="316" rx="14" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <ellipse cx="500" cy="312" rx="11" ry="3" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.5"/>
            <!-- Bitter herbs -->
            <line x1="560" y1="312" x2="558" y2="306" stroke="rgba(34,197,94,0.85)" stroke-width="1.5"/>
            <line x1="564" y1="312" x2="566" y2="304" stroke="rgba(34,197,94,0.85)" stroke-width="1.5"/>
            <line x1="568" y1="314" x2="570" y2="307" stroke="rgba(34,197,94,0.85)" stroke-width="1.5"/>
          </g>
          <!-- Jesus at center of the back of the table -->
          <g transform="translate(400 290)">
            <ellipse cx="0" cy="0" rx="16" ry="22" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-26" rx="13" ry="15" fill="#1a1233"/>
            <path d="M -8 -18 Q 0 -6 8 -18" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -26 Q -16 -12 -12 4 M 10 -26 Q 16 -12 12 4" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <circle cx="0" cy="-26" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-26" r="36" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          </g>
          <!-- Disciples around the table — 6 on each side -->
          <g fill="#0a0d1a">
            <!-- Back side (further) -->
            <g transform="translate(200 290)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/><path d="M -7 -14 Q 0 -2 7 -14" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/></g>
            <g transform="translate(260 286)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/><path d="M -7 -14 Q 0 -2 7 -14" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/></g>
            <g transform="translate(320 288)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/><path d="M -7 -14 Q 0 -2 7 -14" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/></g>
            <g transform="translate(480 288)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/><path d="M -7 -14 Q 0 -2 7 -14" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/></g>
            <g transform="translate(540 286)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/><path d="M -7 -14 Q 0 -2 7 -14" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/></g>
            <g transform="translate(600 290)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/><path d="M -7 -14 Q 0 -2 7 -14" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/></g>
            <!-- Front side (closer) -->
            <g transform="translate(220 400)"><ellipse cx="0" cy="0" rx="13" ry="18"/><ellipse cx="0" cy="-24" rx="11" ry="12"/></g>
            <g transform="translate(280 405)"><ellipse cx="0" cy="0" rx="13" ry="18"/><ellipse cx="0" cy="-24" rx="11" ry="12"/></g>
            <g transform="translate(340 402)"><ellipse cx="0" cy="0" rx="13" ry="18"/><ellipse cx="0" cy="-24" rx="11" ry="12"/></g>
            <g transform="translate(460 402)"><ellipse cx="0" cy="0" rx="13" ry="18"/><ellipse cx="0" cy="-24" rx="11" ry="12"/></g>
            <g transform="translate(520 405)"><ellipse cx="0" cy="0" rx="13" ry="18"/><ellipse cx="0" cy="-24" rx="11" ry="12"/></g>
            <g transform="translate(580 400)"><ellipse cx="0" cy="0" rx="13" ry="18"/><ellipse cx="0" cy="-24" rx="11" ry="12"/></g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"I have eagerly desired to eat this Passover with you"</text>
        </svg>`
      },
      {
        id: 'washing-feet',
        title: 'He Washed Their Feet',
        scriptureRef: 'John 13:1-5',
        bibleText: '"He poured water into a basin and began to wash his disciples\' feet, drying them with the towel that was wrapped around him."',
        narration: 'The disciples had walked all day on dusty roads. There was a basin and a towel and a water jar by the door — but no servant to do the foot-washing, and none of the twelve had volunteered. Halfway through the meal, Jesus got up from the table. He took off His outer cloak. He wrapped a towel around His waist. He poured water into the basin. And He — the rabbi, the Master, the Son of God in the room — knelt down at the feet of His disciples and washed them, one by one. Peter protested. Jesus said, "Unless I wash you, you have no part with me." Peter shut up.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'lswf', skyTop:'#1a1233', skyMid:'#3d2a16', skyBot:'#241846', stars:false})}
          <!-- Soft lamp light on the scene -->
          <radialGradient id="lswfLamp" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="rgba(251,113,38,0.4)"/>
            <stop offset="60%" stop-color="rgba(251,191,36,0.12)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="320" rx="360" ry="200" fill="url(#lswfLamp)"/>
          <!-- Floor stones -->
          <rect x="0" y="380" width="800" height="120" fill="#1a1233"/>
          <g stroke="rgba(254,243,199,0.18)" stroke-width="0.7">
            <line x1="0" y1="430" x2="800" y2="430"/>
            <line x1="0" y1="470" x2="800" y2="470"/>
          </g>
          <!-- Disciple seated on a low bench/cushion (Peter), one foot extended -->
          <g transform="translate(540 380)">
            <!-- Cushion -->
            <rect x="-44" y="0" width="88" height="22" fill="#5a4378" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <!-- Body -->
            <path d="M -22 0 Q -20 -50 0 -60 Q 20 -50 22 0 Z" fill="#1a1233" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <ellipse cx="0" cy="-68" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -60 Q 0 -46 8 -60" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
            <!-- Right foot extended forward over basin -->
            <line x1="-2" y1="22" x2="-50" y2="46" stroke="#1a1233" stroke-width="6"/>
            <ellipse cx="-54" cy="46" rx="9" ry="4" fill="#1a1233"/>
            <!-- Halo -->
            <circle cx="0" cy="-68" r="22" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
          </g>
          <text x="540" y="290" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">PETER</text>
          <!-- Basin of water on the floor -->
          <g transform="translate(440 440)">
            <ellipse cx="0" cy="0" rx="48" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-4" rx="42" ry="10" fill="rgba(56,189,248,0.7)"/>
            <!-- Water ripples -->
            <ellipse cx="0" cy="-4" rx="22" ry="3" fill="none" stroke="rgba(254,243,199,0.65)" stroke-width="0.7"/>
            <ellipse cx="-8" cy="-3" rx="6" ry="2" fill="rgba(254,243,199,0.85)"/>
            <!-- The foot dipped in -->
            <ellipse cx="-12" cy="-2" rx="8" ry="3" fill="rgba(74,52,32,0.85)"/>
          </g>
          <!-- Jesus kneeling, towel around waist, hands on the foot -->
          <g transform="translate(360 410)">
            <!-- Bent kneeling body -->
            <ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Towel around waist (off-white wrapped) -->
            <path d="M -22 -6 Q 0 -14 22 -6 L 16 14 Q 0 10 -16 14 Z" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <!-- Upper body bent forward -->
            <ellipse cx="0" cy="-26" rx="18" ry="22" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Head bowed -->
            <ellipse cx="14" cy="-46" rx="11" ry="13" fill="#1a1233"/>
            <path d="M 6 -38 Q 14 -28 22 -38" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Two arms forward, washing -->
            <line x1="6" y1="-30" x2="36" y2="-2" stroke="#3d2a16" stroke-width="6"/>
            <line x1="14" y1="-22" x2="42" y2="-4" stroke="#3d2a16" stroke-width="6"/>
            <!-- Halo big and bright -->
            <circle cx="14" cy="-46" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
          </g>
          <!-- Other disciples watching from the side -->
          <g fill="#0a0d1a" opacity="0.75">
            <g transform="translate(120 420)"><ellipse cx="0" cy="0" rx="8" ry="22"/><ellipse cx="0" cy="-24" rx="7" ry="9"/></g>
            <g transform="translate(170 420)"><ellipse cx="0" cy="0" rx="8" ry="22"/><ellipse cx="0" cy="-24" rx="7" ry="9"/></g>
            <g transform="translate(220 420)"><ellipse cx="0" cy="0" rx="8" ry="22"/><ellipse cx="0" cy="-24" rx="7" ry="9"/></g>
            <g transform="translate(680 420)"><ellipse cx="0" cy="0" rx="8" ry="22"/><ellipse cx="0" cy="-24" rx="7" ry="9"/></g>
            <g transform="translate(720 420)"><ellipse cx="0" cy="0" rx="8" ry="22"/><ellipse cx="0" cy="-24" rx="7" ry="9"/></g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">The Lord and Teacher · on his knees</text>
        </svg>`
      },
      {
        id: 'bread-cup',
        title: 'This is My Body · This is My Blood',
        scriptureRef: 'Luke 22:19-20',
        bibleText: '"This is my body given for you; do this in remembrance of me." …"This cup is the new covenant in my blood, which is poured out for you."',
        narration: 'When they were back at the table, Jesus took a loaf of unleavened bread. He gave thanks. He broke it. He gave it to them. "This is my body, given for you. Do this in remembrance of me." Then He took the cup. "This cup is the new covenant in my blood, which is poured out for you." Two thousand years of churches every Sunday — small towns and stadiums, persecution and prosperity — have been re-enacting that thirty-second moment. He turned the oldest Jewish meal in the world into the doorway of the New Covenant.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'lsbc', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a5e', stars:false})}
          <!-- Glory beam from above -->
          <radialGradient id="lsbcGlory" cx="0.5" cy="0.2" r="0.55">
            <stop offset="0%" stop-color="rgba(254,243,199,0.85)"/>
            <stop offset="50%" stop-color="rgba(251,191,36,0.4)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="120" rx="400" ry="200" fill="url(#lsbcGlory)"/>
          <polygon points="380,0 340,400 460,400 420,0" fill="rgba(254,243,199,0.35)"/>
          <!-- Table -->
          <g>
            <rect x="120" y="360" width="560" height="34" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <rect x="120" y="392" width="560" height="12" fill="#241846"/>
          </g>
          <!-- Disciples seated on far side of table, watching reverently -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(180 340)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/></g>
            <g transform="translate(240 336)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/></g>
            <g transform="translate(300 338)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/></g>
            <g transform="translate(500 338)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/></g>
            <g transform="translate(560 336)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/></g>
            <g transform="translate(620 340)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="10" ry="11"/></g>
          </g>
          <!-- Jesus at center, BOTH arms raised — bread in left hand, cup in right -->
          <g transform="translate(400 320)">
            <!-- Body -->
            <ellipse cx="0" cy="0" rx="20" ry="30" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-36" rx="14" ry="16" fill="#1a1233"/>
            <path d="M -8 -28 Q 0 -14 8 -28" stroke="rgba(254,243,199,0.65)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -36 Q -16 -22 -12 -8 M 10 -36 Q 16 -22 12 -8" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- LEFT arm raised holding bread -->
            <line x1="-16" y1="-18" x2="-44" y2="-44" stroke="#3d2a16" stroke-width="6"/>
            <ellipse cx="-50" cy="-46" rx="16" ry="6" fill="#fef3c7" stroke="rgba(251,191,36,0.95)" stroke-width="1.2"/>
            <!-- Break in the bread -->
            <line x1="-50" y1="-46" x2="-44" y2="-52" stroke="#3d2a16" stroke-width="1.5"/>
            <!-- RIGHT arm raised holding cup -->
            <line x1="16" y1="-18" x2="44" y2="-44" stroke="#3d2a16" stroke-width="6"/>
            <path d="M 38 -50 L 56 -50 L 54 -36 Q 46 -32 38 -36 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.2"/>
            <ellipse cx="47" cy="-50" rx="8" ry="2" fill="rgba(120,20,20,0.85)"/>
            <!-- Massive halo -->
            <circle cx="0" cy="-36" r="32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-36" r="46" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Bread + cup labels -->
          <text x="290" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3" fill="rgba(251,191,36,0.85)">"THIS IS MY BODY"</text>
          <text x="520" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3" fill="rgba(251,191,36,0.85)">"THIS IS MY BLOOD"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Do this · in remembrance of me"</text>
        </svg>`
      },
      {
        id: 'judas-leaves',
        title: 'And It Was Night',
        scriptureRef: 'John 13:21-30',
        bibleText: '"As soon as Judas took the bread, he went out. And it was night."',
        narration: 'Late in the meal, Jesus said quietly: "One of you will betray me." They all asked, "Surely not I, Lord?" John leaned back against Jesus and whispered, "Lord — who is it?" Jesus dipped a piece of bread into the dish and handed it to Judas. "What you are about to do, do quickly." Judas took the bread, stood up, and walked out of the room. The other eleven thought he was going to give to the poor or buy something for the festival. The reader of John\'s gospel is told the truth in five short words: "And it was night."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'lsjl', skyTop:'#0a0d1a', skyMid:'#1a1233', skyBot:'#241846', stars:false})}
          <!-- Lamp glow softer, more confined to the room -->
          <radialGradient id="lsjlLamp" cx="0.5" cy="0.5" r="0.4">
            <stop offset="0%" stop-color="rgba(251,113,38,0.3)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="380" cy="320" rx="300" ry="160" fill="url(#lsjlLamp)"/>
          <!-- Floor -->
          <rect x="0" y="400" width="800" height="100" fill="#0a0d1a"/>
          <!-- Doorway on the right — open to NIGHT (deep black + a single star outside) -->
          <g>
            <rect x="640" y="120" width="120" height="280" fill="#000a14" stroke="rgba(251,191,36,0.6)" stroke-width="1.4"/>
            <!-- Just darkness beyond -->
            <circle cx="700" cy="180" r="1" fill="#fef3c7"/>
            <circle cx="730" cy="240" r="1" fill="#fef3c7"/>
          </g>
          <!-- Table center-left -->
          <g>
            <rect x="60" y="340" width="500" height="32" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <rect x="60" y="370" width="500" height="12" fill="#241846"/>
            <!-- Vessels still on table -->
            <ellipse cx="120" cy="336" rx="10" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            <ellipse cx="200" cy="336" rx="12" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            <ellipse cx="200" cy="332" rx="9" ry="3" fill="#fef3c7"/>
            <ellipse cx="300" cy="336" rx="10" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            <ellipse cx="420" cy="336" rx="14" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
            <ellipse cx="500" cy="336" rx="10" ry="5" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.7"/>
          </g>
          <!-- Jesus center of the bench at the table, watching Judas leave -->
          <g transform="translate(310 320)">
            <ellipse cx="0" cy="0" rx="14" ry="18" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-22" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -14 Q 0 -2 8 -14" stroke="rgba(254,243,199,0.6)" stroke-width="1.3" fill="none"/>
            <!-- Halo subdued (sorrow) -->
            <circle cx="0" cy="-22" r="20" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.3"/>
          </g>
          <!-- John leaning against Jesus (left side) -->
          <g transform="translate(260 330)">
            <ellipse cx="0" cy="0" rx="11" ry="14" fill="#0a0d1a"/>
            <ellipse cx="6" cy="-12" rx="9" ry="11" fill="#0a0d1a"/>
          </g>
          <!-- Other disciples around table, oblivious to what's happening -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(120 326)"><ellipse cx="0" cy="0" rx="11" ry="15"/><ellipse cx="0" cy="-20" rx="9" ry="10"/></g>
            <g transform="translate(170 322)"><ellipse cx="0" cy="0" rx="11" ry="15"/><ellipse cx="0" cy="-20" rx="9" ry="10"/></g>
            <g transform="translate(380 322)"><ellipse cx="0" cy="0" rx="11" ry="15"/><ellipse cx="0" cy="-20" rx="9" ry="10"/></g>
            <g transform="translate(440 326)"><ellipse cx="0" cy="0" rx="11" ry="15"/><ellipse cx="0" cy="-20" rx="9" ry="10"/></g>
            <g transform="translate(500 322)"><ellipse cx="0" cy="0" rx="11" ry="15"/><ellipse cx="0" cy="-20" rx="9" ry="10"/></g>
          </g>
          <!-- JUDAS — silhouette mid-stride, walking AWAY toward the open door, money bag in one hand -->
          <g transform="translate(620 400)">
            <ellipse cx="0" cy="0" rx="10" ry="30" fill="#0a0d1a"/>
            <ellipse cx="2" cy="-30" rx="9" ry="11" fill="#0a0d1a"/>
            <!-- Walking forward into night -->
            <line x1="-4" y1="26" x2="-10" y2="40" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="4"  y1="26" x2="10" y2="40" stroke="#0a0d1a" stroke-width="4"/>
            <!-- Money bag in right hand, swung slightly -->
            <line x1="9" y1="-14" x2="20" y2="0" stroke="#0a0d1a" stroke-width="3"/>
            <ellipse cx="22" cy="2" rx="9" ry="8" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
            <!-- Halo absent / gone -->
          </g>
          <!-- "AND IT WAS NIGHT" banner across top -->
          <text x="400" y="80" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="6" fill="rgba(248,113,113,0.85)">"AND IT WAS NIGHT"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">Five words · weighed with everything</text>
        </svg>`
      }
    ],
    closing: 'The Last Supper is the one moment in Scripture where Jesus tells His disciples to keep doing something forever. Not "build a temple," not "write me a creed," not "start a denomination." Just: take this bread, take this cup, and remember me. The Christian church for two millennia has been a movement of broken bread and shared wine — billions of people in tens of thousands of languages, around a Table that was first set by Him.',
    closingPrompt: 'The next time you take communion (or sit at any meal), what would change if you slowed down enough to actually do it in remembrance of Him?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 32 — The Crucifixion
  // ════════════════════════════════════════════════════════════
  {
    id: 'crucifixion',
    title: 'The Crucifixion',
    subtitle: 'A Roman cross. The sky goes black. The veil tears in two.',
    icon: '✝️',
    color: '#5a4378',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Matthew 27 · John 19',
    duration: '~7 min',
    scenes: [
      {
        id: 'via-dolorosa',
        title: 'The Road of Sorrows',
        scriptureRef: 'Matthew 27:31-32 · Luke 23:26',
        bibleText: '"A certain man from Cyrene, Simon, the father of Alexander and Rufus, was passing by on his way in from the country, and they forced him to carry the cross."',
        narration: 'After a night of mockery and a hurried trial, the Roman soldiers stripped Jesus of his robe and led him out to crucify Him. He walked through the streets of Jerusalem carrying the crossbeam on His own shoulders. He had been beaten so badly He could barely stand. He fell. The soldiers grabbed a man at random from the crowd — Simon, a North African on his way into the city — and forced him to carry the wood the rest of the way. Behind them walked the women, weeping. Jesus turned and told them: weep for yourselves, not for me.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'cvd', skyTop:'#3d2a5e', skyMid:'#5a4378', skyBot:'#fb923c', stars:false})}
          <!-- Late morning sun -->
          <circle cx="660" cy="120" r="32" fill="#fef3c7"/>
          <circle cx="660" cy="120" r="50" fill="rgba(251,113,38,0.45)"/>
          <!-- Jerusalem walls on the right with city gate -->
          <g fill="#1a1233" stroke="rgba(251,191,36,0.55)" stroke-width="1">
            <rect x="540" y="200" width="260" height="220"/>
            <!-- Battlements -->
            <g>
              <rect x="540" y="192" width="14" height="10"/>
              <rect x="570" y="192" width="14" height="10"/>
              <rect x="600" y="192" width="14" height="10"/>
              <rect x="630" y="192" width="14" height="10"/>
            </g>
            <!-- Open gate -->
            <path d="M 540 360 Q 540 280 600 280 Q 660 280 660 360" fill="#0a0d1a" stroke="rgba(251,191,36,0.65)" stroke-width="1.4"/>
          </g>
          <!-- Cobblestone road leading away from gate -->
          <path d="M 540 360 Q 380 380 60 460" stroke="rgba(254,243,199,0.45)" stroke-width="10" fill="none"/>
          <g stroke="rgba(254,243,199,0.4)" stroke-width="0.7" fill="none">
            <path d="M 540 360 Q 380 380 60 460" stroke-dasharray="6 12"/>
          </g>
          <!-- Ground -->
          <path d="M 0 430 Q 400 416 800 430 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- Simon of Cyrene (forced) carrying the crossbeam — broad-shouldered, beam across shoulders -->
          <g transform="translate(280 400)">
            <!-- Body -->
            <ellipse cx="0" cy="0" rx="14" ry="30" fill="#3d2a16" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <ellipse cx="0" cy="-34" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -26 Q 0 -10 8 -26" stroke="rgba(254,243,199,0.5)" stroke-width="1.3" fill="none"/>
            <!-- Crossbeam (horizontal beam) across shoulders -->
            <rect x="-60" y="-38" width="120" height="10" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <!-- Bound hands gripping the beam from above -->
            <ellipse cx="-32" cy="-34" rx="4" ry="3" fill="#1a1233"/>
            <ellipse cx="32" cy="-34" rx="4" ry="3" fill="#1a1233"/>
          </g>
          <text x="280" y="360" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(254,243,199,0.7)">SIMON · CYRENE</text>
          <!-- Jesus walking just ahead, body bowed, crown of thorns -->
          <g transform="translate(200 410)">
            <path d="M -16 0 Q -14 -50 0 -60 Q 14 -50 16 0 Z" fill="#241846" stroke="rgba(120,20,20,0.7)" stroke-width="1"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -62 Q 0 -50 8 -62" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Crown of thorns — small spikes around the head -->
            <g stroke="rgba(120,20,20,0.9)" stroke-width="1.5" fill="none">
              <path d="M -12 -78 Q 0 -86 12 -78"/>
              <line x1="-10" y1="-80" x2="-12" y2="-86"/>
              <line x1="-4" y1="-84" x2="-5" y2="-90"/>
              <line x1="4" y1="-84" x2="5" y2="-90"/>
              <line x1="10" y1="-80" x2="12" y2="-86"/>
            </g>
            <!-- Blood drips from forehead -->
            <line x1="-3" y1="-72" x2="-3" y2="-66" stroke="rgba(120,20,20,0.85)" stroke-width="1.2"/>
            <line x1="3" y1="-70" x2="3" y2="-64" stroke="rgba(120,20,20,0.85)" stroke-width="1.2"/>
            <!-- Body slumped -->
            <line x1="0" y1="-44" x2="-12" y2="-30" stroke="#241846" stroke-width="1.5"/>
            <!-- Halo dimmer -->
            <circle cx="0" cy="-70" r="20" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1.2"/>
          </g>
          <!-- Roman soldiers — one with whip in hand, walking alongside -->
          <g transform="translate(100 410)">
            <ellipse cx="0" cy="0" rx="11" ry="32" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-34" rx="9" ry="11" fill="#0a0d1a"/>
            <!-- Crested helmet -->
            <path d="M -9 -42 Q 0 -54 9 -42 L 5 -48 Z" fill="rgba(248,113,113,0.85)"/>
            <line x1="9" y1="-22" x2="22" y2="-44" stroke="#0a0d1a" stroke-width="3"/>
            <polygon points="20,-44 24,-50 18,-48" fill="rgba(251,191,36,0.85)"/>
            <line x1="9" y1="-14" x2="32" y2="-2" stroke="#0a0d1a" stroke-width="2"/>
            <path d="M 32 -2 Q 36 6 30 12" stroke="rgba(248,113,113,0.85)" stroke-width="1.4" fill="none"/>
          </g>
          <!-- Weeping women behind, smaller silhouettes -->
          <g fill="#1a1233" opacity="0.85">
            <g transform="translate(440 420)"><ellipse cx="0" cy="0" rx="7" ry="20"/><ellipse cx="0" cy="-22" rx="6" ry="8"/><line x1="-5" y1="-14" x2="-2" y2="-22" stroke="#1a1233" stroke-width="3"/></g>
            <g transform="translate(490 422)"><ellipse cx="0" cy="0" rx="7" ry="20"/><ellipse cx="0" cy="-22" rx="6" ry="8"/></g>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">The Via Dolorosa · the road of sorrows</text>
        </svg>`
      },
      {
        id: 'three-crosses',
        title: 'Three Crosses on the Hill',
        scriptureRef: 'Luke 23:33-34 · 39-43',
        bibleText: '"\'Father, forgive them, for they do not know what they are doing.\'" …"Today you will be with me in paradise."',
        narration: 'They reached the place called Skull — Golgotha — outside the city wall. They drove nails through His wrists and His feet and lifted the crossbeam onto the upright. They did the same to two criminals on either side of Him. From the cross He prayed for the men who had killed Him: "Father, forgive them. They don\'t know what they are doing." One of the criminals taunted Him. The other one defended Him and asked, "Remember me when you come into your kingdom." Jesus answered, "Truly I tell you — today you will be with me in paradise."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="ctcSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1a1233"/>
              <stop offset="60%" stop-color="#3d2a16"/>
              <stop offset="100%" stop-color="#5a4378"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#ctcSky)"/>
          <!-- Dimmed afternoon sun, partially obscured -->
          <circle cx="660" cy="130" r="28" fill="rgba(254,243,199,0.4)"/>
          <!-- Hill of Skull (Golgotha) — bare rounded mound -->
          <path d="M 0 440 Q 200 400 400 380 Q 600 400 800 440 L 800 500 L 0 500 Z" fill="#241846"/>
          <!-- Skull rocks faintly visible -->
          <g fill="rgba(254,243,199,0.18)">
            <ellipse cx="120" cy="450" rx="14" ry="6"/>
            <ellipse cx="680" cy="450" rx="14" ry="6"/>
          </g>
          <!-- Three crosses — center higher, two flanking shorter -->
          <!-- LEFT cross with criminal -->
          <g transform="translate(220 400)">
            <line x1="0" y1="0" x2="0" y2="-220" stroke="#3d2a16" stroke-width="10"/>
            <line x1="-40" y1="-160" x2="40" y2="-160" stroke="#3d2a16" stroke-width="8"/>
            <!-- Bound figure -->
            <g transform="translate(0 -130)">
              <ellipse cx="0" cy="0" rx="12" ry="34" fill="#1a1233"/>
              <ellipse cx="0" cy="-36" rx="10" ry="11" fill="#1a1233"/>
              <line x1="-12" y1="-30" x2="-40" y2="-30" stroke="#1a1233" stroke-width="6"/>
              <line x1="12" y1="-30" x2="40" y2="-30" stroke="#1a1233" stroke-width="6"/>
            </g>
          </g>
          <!-- CENTER cross — taller, Jesus -->
          <g transform="translate(400 400)">
            <line x1="0" y1="0" x2="0" y2="-260" stroke="#3d2a16" stroke-width="12"/>
            <line x1="-56" y1="-200" x2="56" y2="-200" stroke="#3d2a16" stroke-width="10"/>
            <!-- INRI inscription at top -->
            <rect x="-22" y="-256" width="44" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1"/>
            <text x="0" y="-246" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.95)">INRI</text>
            <!-- Jesus body -->
            <g transform="translate(0 -170)">
              <!-- Crown of thorns -->
              <g stroke="rgba(120,20,20,0.9)" stroke-width="1.5" fill="none">
                <path d="M -14 -38 Q 0 -46 14 -38"/>
                <line x1="-10" y1="-40" x2="-12" y2="-48"/>
                <line x1="-4" y1="-44" x2="-5" y2="-52"/>
                <line x1="4" y1="-44" x2="5" y2="-52"/>
                <line x1="10" y1="-40" x2="12" y2="-48"/>
              </g>
              <!-- Head -->
              <ellipse cx="0" cy="-32" rx="13" ry="15" fill="#1a1233"/>
              <!-- Beard -->
              <path d="M -8 -22 Q 0 -8 8 -22" stroke="rgba(254,243,199,0.6)" stroke-width="1.5" fill="none"/>
              <!-- Body -->
              <ellipse cx="0" cy="0" rx="16" ry="36" fill="#241846" stroke="rgba(254,243,199,0.5)" stroke-width="0.8"/>
              <!-- Loincloth -->
              <path d="M -16 -2 Q 0 -8 16 -2 L 14 14 Q 0 10 -14 14 Z" fill="rgba(254,243,199,0.7)" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
              <!-- Arms outstretched on the crossbeam -->
              <line x1="-16" y1="-22" x2="-56" y2="-30" stroke="#241846" stroke-width="8"/>
              <line x1="16"  y1="-22" x2="56" y2="-30" stroke="#241846" stroke-width="8"/>
              <!-- Nails -->
              <circle cx="-50" cy="-30" r="2.5" fill="rgba(120,20,20,0.95)"/>
              <circle cx="50" cy="-30" r="2.5" fill="rgba(120,20,20,0.95)"/>
              <!-- Nail in feet -->
              <circle cx="0" cy="38" r="2.5" fill="rgba(120,20,20,0.95)"/>
              <!-- Spear wound (side) -->
              <line x1="14" y1="-2" x2="20" y2="6" stroke="rgba(120,20,20,0.85)" stroke-width="2"/>
              <!-- Halo (subdued but present) -->
              <circle cx="0" cy="-32" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
              <circle cx="0" cy="-32" r="36" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
            </g>
          </g>
          <!-- RIGHT cross with the other criminal (the "good thief", head turned toward Jesus) -->
          <g transform="translate(580 400)">
            <line x1="0" y1="0" x2="0" y2="-220" stroke="#3d2a16" stroke-width="10"/>
            <line x1="-40" y1="-160" x2="40" y2="-160" stroke="#3d2a16" stroke-width="8"/>
            <g transform="translate(0 -130)">
              <ellipse cx="0" cy="0" rx="12" ry="34" fill="#1a1233"/>
              <ellipse cx="-3" cy="-36" rx="10" ry="11" fill="#1a1233"/>
              <line x1="-12" y1="-30" x2="-40" y2="-30" stroke="#1a1233" stroke-width="6"/>
              <line x1="12" y1="-30" x2="40" y2="-30" stroke="#1a1233" stroke-width="6"/>
              <!-- Small halo (he just believed) -->
              <circle cx="-3" cy="-36" r="14" fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            </g>
          </g>
          <!-- Soldiers gambling for the robe at the base, women kneeling on the other side -->
          <g fill="#0a0d1a" opacity="0.8">
            <g transform="translate(120 460)">
              <ellipse cx="0" cy="0" rx="22" ry="6"/>
              <ellipse cx="-14" cy="-2" rx="6" ry="5"/>
            </g>
            <g transform="translate(180 462)">
              <ellipse cx="0" cy="0" rx="20" ry="6"/>
              <ellipse cx="14" cy="-2" rx="6" ry="5"/>
            </g>
            <!-- Three dice -->
            <rect x="148" y="450" width="6" height="6" fill="rgba(251,191,36,0.85)" stroke="#3d2a16" stroke-width="0.4"/>
            <rect x="158" y="450" width="6" height="6" fill="rgba(251,191,36,0.85)" stroke="#3d2a16" stroke-width="0.4"/>
            <rect x="168" y="450" width="6" height="6" fill="rgba(251,191,36,0.85)" stroke="#3d2a16" stroke-width="0.4"/>
          </g>
          <!-- Mary, John, women on the right side of the center cross -->
          <g transform="translate(440 460)">
            <ellipse cx="0" cy="0" rx="10" ry="14" fill="#3d2a5e" stroke="rgba(251,191,36,0.5)" stroke-width="0.7"/>
            <ellipse cx="0" cy="-16" rx="7" ry="8" fill="#1a1233"/>
            <line x1="-4" y1="-12" x2="-2" y2="-16" stroke="rgba(56,189,248,0.85)" stroke-width="1"/>
            <line x1="4" y1="-12" x2="2" y2="-16" stroke="rgba(56,189,248,0.85)" stroke-width="1"/>
          </g>
          <g transform="translate(478 462)">
            <ellipse cx="0" cy="0" rx="10" ry="14" fill="#1a1233"/>
            <ellipse cx="0" cy="-16" rx="7" ry="8" fill="#1a1233"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Father · forgive them"</text>
        </svg>`
      },
      {
        id: 'darkness',
        title: 'Darkness over the Land',
        scriptureRef: 'Matthew 27:45-46 · Luke 23:44',
        bibleText: '"From noon until three in the afternoon darkness came over all the land… Jesus cried out in a loud voice, \'My God, my God, why have you forsaken me?\'"',
        narration: 'At noon — when the sun should have been the brightest — the sky went dark. For three hours. Not a normal eclipse. Not a sudden storm. The sun itself was withheld. At three o\'clock Jesus cried out the opening line of Psalm 22 in a voice loud enough to carry to the back of the crowd: "My God, my God — why have you forsaken me?" Then He said, "It is finished." He bowed His head. And He breathed His last.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="cdkSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#000a14"/>
              <stop offset="100%" stop-color="#0a0d1a"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#cdkSky)"/>
          <!-- Black sun (eclipsed) -->
          <circle cx="660" cy="130" r="36" fill="#0a0d1a" stroke="rgba(254,243,199,0.5)" stroke-width="1.5"/>
          <!-- Corona of light around the eclipsed sun -->
          <g fill="none" stroke="rgba(254,243,199,0.35)" stroke-width="1.2">
            <circle cx="660" cy="130" r="44"/>
            <circle cx="660" cy="130" r="54" stroke-dasharray="2 4"/>
          </g>
          <!-- Hill -->
          <path d="M 0 440 Q 200 400 400 380 Q 600 400 800 440 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Center cross (taller), the only one visible in detail -->
          <g transform="translate(400 400)">
            <line x1="0" y1="0" x2="0" y2="-260" stroke="#3d2a16" stroke-width="12"/>
            <line x1="-56" y1="-200" x2="56" y2="-200" stroke="#3d2a16" stroke-width="10"/>
            <rect x="-22" y="-256" width="44" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <text x="0" y="-246" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(254,243,199,0.85)">INRI</text>
            <g transform="translate(0 -170)">
              <g stroke="rgba(120,20,20,0.9)" stroke-width="1.5" fill="none">
                <path d="M -14 -38 Q 0 -46 14 -38"/>
                <line x1="-10" y1="-40" x2="-12" y2="-48"/>
                <line x1="-4" y1="-44" x2="-5" y2="-52"/>
                <line x1="4" y1="-44" x2="5" y2="-52"/>
                <line x1="10" y1="-40" x2="12" y2="-48"/>
              </g>
              <ellipse cx="0" cy="-32" rx="13" ry="15" fill="#1a1233"/>
              <!-- Head bowed -->
              <line x1="0" y1="-22" x2="0" y2="-14" stroke="#1a1233" stroke-width="1"/>
              <ellipse cx="0" cy="0" rx="16" ry="36" fill="#241846" stroke="rgba(254,243,199,0.5)" stroke-width="0.8"/>
              <path d="M -16 -2 Q 0 -8 16 -2 L 14 14 Q 0 10 -14 14 Z" fill="rgba(254,243,199,0.7)" stroke="rgba(251,191,36,0.55)" stroke-width="0.8"/>
              <line x1="-16" y1="-22" x2="-56" y2="-30" stroke="#241846" stroke-width="8"/>
              <line x1="16"  y1="-22" x2="56" y2="-30" stroke="#241846" stroke-width="8"/>
              <circle cx="-50" cy="-30" r="2.5" fill="rgba(120,20,20,0.95)"/>
              <circle cx="50" cy="-30" r="2.5" fill="rgba(120,20,20,0.95)"/>
              <!-- Big halo barely visible -->
              <circle cx="0" cy="-32" r="24" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1.3"/>
            </g>
          </g>
          <!-- Side crosses faded to silhouettes -->
          <g opacity="0.5">
            <g transform="translate(220 400)">
              <line x1="0" y1="0" x2="0" y2="-220" stroke="#1a1233" stroke-width="10"/>
              <line x1="-40" y1="-160" x2="40" y2="-160" stroke="#1a1233" stroke-width="8"/>
            </g>
            <g transform="translate(580 400)">
              <line x1="0" y1="0" x2="0" y2="-220" stroke="#1a1233" stroke-width="10"/>
              <line x1="-40" y1="-160" x2="40" y2="-160" stroke="#1a1233" stroke-width="8"/>
            </g>
          </g>
          <!-- Soldiers/Crowd dimmed silhouettes at base -->
          <g fill="#0a0d1a" opacity="0.6">
            <ellipse cx="320" cy="460" rx="6" ry="14"/>
            <ellipse cx="320" cy="450" rx="5" ry="6"/>
            <ellipse cx="480" cy="460" rx="6" ry="14"/>
            <ellipse cx="480" cy="450" rx="5" ry="6"/>
          </g>
          <!-- "ELI, ELI, LAMA SABACHTHANI?" floating in dark space -->
          <text x="400" y="80" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="18" letter-spacing="5" fill="rgba(254,243,199,0.85)">"MY GOD · MY GOD ·</text>
          <text x="400" y="108" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="18" letter-spacing="5" fill="rgba(254,243,199,0.85)">WHY HAVE YOU FORSAKEN ME?"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"It is finished"</text>
        </svg>`
      },
      {
        id: 'veil-torn',
        title: 'The Veil Torn in Two',
        scriptureRef: 'Matthew 27:51-54',
        bibleText: '"At that moment the curtain of the temple was torn in two from top to bottom. The earth shook, the rocks split and the tombs broke open."',
        narration: 'The instant He died, two miles away in the temple, the great curtain that hung between the holy place and the most holy place — the one that had stood between God and humanity for centuries — was ripped from top to bottom. Not bottom to top, as if a human had done it. Top to bottom, as if God had done it. The earth shook. Rocks split. The Roman centurion at the foot of the cross — a hardened man who had seen many crucifixions — looked up at the dead man on the wood and said, "Surely this man was the Son of God."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'cvt', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <!-- Massive crack of lightning across sky -->
          <polyline points="80,30 200,160 170,170 240,310" stroke="rgba(254,243,199,0.85)" stroke-width="2" fill="none"/>
          <polyline points="620,30 540,180 570,190 500,320" stroke="rgba(254,243,199,0.85)" stroke-width="2" fill="none"/>
          <!-- Inside the temple — Holy of Holies behind the curtain -->
          <g>
            <rect x="100" y="80" width="600" height="280" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1.4"/>
            <!-- Columns left + right -->
            <rect x="120" y="100" width="22" height="260" fill="#3d2a16" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <rect x="658" y="100" width="22" height="260" fill="#3d2a16" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <!-- Inner sanctuary glow -->
            <radialGradient id="cvtHoly" cx="0.5" cy="0.5" r="0.4">
              <stop offset="0%" stop-color="rgba(254,243,199,0.55)"/>
              <stop offset="60%" stop-color="rgba(251,191,36,0.18)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
            <ellipse cx="400" cy="220" rx="200" ry="120" fill="url(#cvtHoly)"/>
            <!-- Ark of the Covenant glimpsed through torn curtain -->
            <g transform="translate(400 250)">
              <rect x="-26" y="-12" width="52" height="22" fill="rgba(251,191,36,0.85)" stroke="#fef3c7" stroke-width="1"/>
              <ellipse cx="-12" cy="-22" rx="5" ry="6" fill="rgba(251,191,36,0.95)"/>
              <ellipse cx="12"  cy="-22" rx="5" ry="6" fill="rgba(251,191,36,0.95)"/>
            </g>
          </g>
          <!-- The curtain — two halves split down the middle, edges jagged like cloth ripped -->
          <g>
            <!-- LEFT half (torn, dropping away to the left) -->
            <path d="M 142 80 L 380 80 L 380 100 L 376 120 L 384 140 L 374 160 L 388 180 L 380 200 L 392 220 L 380 240 L 394 260 L 382 280 L 396 300 L 380 320 L 388 340 L 380 360 L 142 360 Z"
                  fill="rgba(120,20,20,0.85)" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <!-- Gold embroidery hint -->
            <g stroke="rgba(251,191,36,0.55)" stroke-width="0.6" fill="none">
              <line x1="160" y1="100" x2="370" y2="100"/>
              <line x1="160" y1="160" x2="370" y2="160"/>
              <line x1="160" y1="220" x2="370" y2="220"/>
              <line x1="160" y1="280" x2="370" y2="280"/>
              <line x1="160" y1="340" x2="370" y2="340"/>
            </g>
            <!-- RIGHT half (torn, dropping away to the right) -->
            <path d="M 658 80 L 420 80 L 420 100 L 424 120 L 416 140 L 426 160 L 412 180 L 420 200 L 408 220 L 420 240 L 406 260 L 418 280 L 404 300 L 420 320 L 412 340 L 420 360 L 658 360 Z"
                  fill="rgba(120,20,20,0.85)" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <g stroke="rgba(251,191,36,0.55)" stroke-width="0.6" fill="none">
              <line x1="430" y1="100" x2="640" y2="100"/>
              <line x1="430" y1="160" x2="640" y2="160"/>
              <line x1="430" y1="220" x2="640" y2="220"/>
              <line x1="430" y1="280" x2="640" y2="280"/>
              <line x1="430" y1="340" x2="640" y2="340"/>
            </g>
          </g>
          <!-- "TOP TO BOTTOM" arrow from top of curtain down through the tear -->
          <g>
            <line x1="400" y1="40" x2="400" y2="80" stroke="rgba(254,243,199,0.85)" stroke-width="2"/>
            <polygon points="395,80 405,80 400,90" fill="rgba(254,243,199,0.85)"/>
          </g>
          <text x="400" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(254,243,199,0.85)">TOP TO BOTTOM</text>
          <!-- Cracked floor at the bottom, earthquake -->
          <path d="M 0 380 L 800 380" stroke="rgba(254,243,199,0.55)" stroke-width="1"/>
          <g stroke="rgba(248,113,113,0.85)" stroke-width="2" fill="none">
            <polyline points="80,420 130,400 110,440 180,420 160,460 220,440"/>
            <polyline points="540,420 590,400 570,440 640,420 620,460 700,440"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Surely this man was the Son of God"</text>
        </svg>`
      }
    ],
    closing: 'The crucifixion is the strangest moment in the universe\'s history. The Author of life let humans kill Him. The Holy One let Himself be reckoned a criminal. Heaven hid its face from the sun. And the curtain that had stood between sinful humanity and the holy presence of God — torn from top to bottom by the only hand strong enough to do it. The cross is not a tragic accident in a beautiful gospel. It IS the gospel.',
    closingPrompt: 'What weight are you still carrying that He carried up that hill so you would not have to — and what would it look like to lay it down at the foot of the cross today?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 33 — Pentecost
  // ════════════════════════════════════════════════════════════
  {
    id: 'pentecost',
    title: 'Pentecost',
    subtitle: 'A rushing wind. Tongues of fire. The Church begins.',
    icon: '🔥',
    color: '#fb923c',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Acts 2',
    duration: '~6 min',
    scenes: [
      {
        id: 'upper-room-wait',
        title: 'A Hundred and Twenty in Prayer',
        scriptureRef: 'Acts 1:13-14 · 2:1',
        bibleText: '"They all joined together constantly in prayer… When the day of Pentecost came, they were all together in one place."',
        narration: 'Forty days after the resurrection, Jesus ascended into heaven and told the disciples to wait in Jerusalem for the gift the Father had promised. A hundred and twenty of them gathered in an upper room — the eleven apostles, Mary the mother of Jesus, His brothers, the women who had followed Him from Galilee. For ten days they prayed. They had no idea what they were waiting for or how they would know when it arrived. On the morning of Pentecost — the Jewish feast of the harvest — they found out.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pur', skyTop:'#1a1233', skyMid:'#3d2a16', skyBot:'#241846', stars:false})}
          <!-- Upper room interior — stone walls, simple window on one side -->
          <rect x="0" y="0" width="800" height="500" fill="#1a1233"/>
          <g fill="#3d2a16" opacity="0.6">
            <rect x="0" y="0" width="800" height="12"/>
            <rect x="0" y="100" width="800" height="6"/>
          </g>
          <!-- Window on the right -->
          <g transform="translate(700 200)">
            <rect x="-30" y="-50" width="60" height="100" fill="#3d2a5e" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <line x1="-30" y1="0" x2="30" y2="0" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
          </g>
          <!-- Soft pool of light from a single lamp -->
          <radialGradient id="purLamp" cx="0.5" cy="0.5" r="0.45">
            <stop offset="0%" stop-color="rgba(251,113,38,0.25)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="320" rx="380" ry="180" fill="url(#purLamp)"/>
          <!-- Lamp -->
          <line x1="400" y1="0" x2="400" y2="80" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          <ellipse cx="400" cy="88" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
          <ellipse cx="400" cy="84" rx="6" ry="7" fill="#fbbf24"/>
          <!-- Many people gathered in prayer — concentric clusters kneeling, heads bowed -->
          <g fill="#0a0d1a">
            <!-- Inner circle -->
            <g transform="translate(320 380)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="6" ry="6"/></g>
            <g transform="translate(370 376)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="6" ry="6"/></g>
            <g transform="translate(420 380)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="6" ry="6"/></g>
            <g transform="translate(470 376)"><ellipse cx="0" cy="0" rx="14" ry="6"/><ellipse cx="-2" cy="-8" rx="6" ry="6"/></g>
            <!-- Middle circle -->
            <g transform="translate(220 410)" opacity="0.9"><ellipse cx="0" cy="0" rx="12" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
            <g transform="translate(270 412)" opacity="0.9"><ellipse cx="0" cy="0" rx="12" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
            <g transform="translate(520 412)" opacity="0.9"><ellipse cx="0" cy="0" rx="12" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
            <g transform="translate(570 410)" opacity="0.9"><ellipse cx="0" cy="0" rx="12" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
            <!-- Outer scatter -->
            <g opacity="0.75">
              <g transform="translate(140 440)"><ellipse cx="0" cy="0" rx="10" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
              <g transform="translate(180 444)"><ellipse cx="0" cy="0" rx="10" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
              <g transform="translate(620 444)"><ellipse cx="0" cy="0" rx="10" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
              <g transform="translate(660 440)"><ellipse cx="0" cy="0" rx="10" ry="5"/><ellipse cx="-2" cy="-6" rx="5" ry="5"/></g>
            </g>
          </g>
          <!-- Counter banner -->
          <text x="80" y="60" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,191,36,0.75)">120 PEOPLE · 10 DAYS · PRAYING</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"All together in one place"</text>
        </svg>`
      },
      {
        id: 'wind-fire',
        title: 'Wind · Fire · Voices',
        scriptureRef: 'Acts 2:1-4',
        bibleText: '"Suddenly a sound like the blowing of a violent wind came from heaven and filled the whole house… They saw what seemed to be tongues of fire that separated and came to rest on each of them. All of them were filled with the Holy Spirit."',
        narration: 'It came all at once. A roar from heaven like a violent rushing wind — not a wind they could feel on their skin, but a sound that filled the entire house. The walls vibrated. Doors blew open. And then over each one of the hundred and twenty, a small tongue of fire appeared — separate, individual, not consuming. The Holy Spirit had come. They were filled with Him. And they began to speak — and the words coming out of their mouths were not the words they had been about to say.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="pwfGlory" cx="0.5" cy="0.2" r="0.7">
              <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="50%" stop-color="rgba(251,113,38,0.5)"/>
              <stop offset="100%" stop-color="rgba(251,113,38,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="#0a0d1a"/>
          <ellipse cx="400" cy="120" rx="500" ry="240" fill="url(#pwfGlory)"/>
          <!-- Wind lines streaming downward through the room -->
          <g stroke="rgba(254,243,199,0.6)" stroke-width="2" fill="none">
            <path d="M 100 40 Q 150 200 200 340"/>
            <path d="M 220 40 Q 270 200 320 340"/>
            <path d="M 340 40 Q 390 200 440 340"/>
            <path d="M 460 40 Q 510 200 560 340"/>
            <path d="M 580 40 Q 630 200 680 340"/>
            <path d="M 700 40 Q 720 200 740 340"/>
          </g>
          <!-- Floor -->
          <rect x="0" y="440" width="800" height="60" fill="#1a1233"/>
          <!-- People standing in awe, faces up — many small figures arranged across the room -->
          <g fill="#1a1233">
            <g transform="translate(120 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <!-- Tongue of fire above head -->
              <ellipse cx="0" cy="-46" rx="5" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-48" rx="3" ry="6" fill="#fbbf24"/>
              <ellipse cx="0" cy="-50" rx="1.5" ry="3" fill="#fef3c7"/>
              <!-- Hands lifted in awe -->
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(200 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <ellipse cx="0" cy="-46" rx="5" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-48" rx="3" ry="6" fill="#fbbf24"/>
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(280 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <ellipse cx="0" cy="-46" rx="5" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-48" rx="3" ry="6" fill="#fbbf24"/>
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(360 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <ellipse cx="0" cy="-46" rx="6" ry="12" fill="#fb923c"/>
              <ellipse cx="0" cy="-50" rx="3" ry="7" fill="#fbbf24"/>
              <ellipse cx="0" cy="-52" rx="1.5" ry="4" fill="#fef3c7"/>
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(440 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <ellipse cx="0" cy="-46" rx="6" ry="12" fill="#fb923c"/>
              <ellipse cx="0" cy="-50" rx="3" ry="7" fill="#fbbf24"/>
              <ellipse cx="0" cy="-52" rx="1.5" ry="4" fill="#fef3c7"/>
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(520 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <ellipse cx="0" cy="-46" rx="5" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-48" rx="3" ry="6" fill="#fbbf24"/>
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(600 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <ellipse cx="0" cy="-46" rx="5" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-48" rx="3" ry="6" fill="#fbbf24"/>
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(680 410)">
              <ellipse cx="0" cy="0" rx="9" ry="28"/>
              <ellipse cx="0" cy="-30" rx="8" ry="9"/>
              <ellipse cx="0" cy="-46" rx="5" ry="10" fill="#fb923c"/>
              <ellipse cx="0" cy="-48" rx="3" ry="6" fill="#fbbf24"/>
              <line x1="-7" y1="-18" x2="-14" y2="-32" stroke="#1a1233" stroke-width="3"/>
              <line x1="7" y1="-18" x2="14" y2="-32" stroke="#1a1233" stroke-width="3"/>
            </g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"All of them were filled with the Holy Spirit"</text>
        </svg>`
      },
      {
        id: 'languages',
        title: 'Every Tongue Heard',
        scriptureRef: 'Acts 2:5-12',
        bibleText: '"How is it that each of us hears them in our native language?"',
        narration: 'A crowd was already gathering in Jerusalem because it was a feast day — Jews from every nation under heaven. Parthians, Medes, Elamites, residents of Mesopotamia, Cappadocia, Pontus, Asia, Phrygia, Pamphylia, Egypt, parts of Libya, Romans, Cretans, Arabs. They heard the noise and came running to the upper-room house. And every one of them — Persian, Egyptian, Libyan, Greek — heard the disciples praising God in their OWN language. They stood there asking each other, "What does this mean?"',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'plg', skyTop:'#3d2a5e', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- The upper-room house in center, glowing -->
          <radialGradient id="plgGlow" cx="0.5" cy="0.5" r="0.4">
            <stop offset="0%" stop-color="rgba(251,191,36,0.5)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="250" rx="240" ry="200" fill="url(#plgGlow)"/>
          <g transform="translate(400 280)">
            <rect x="-80" y="-80" width="160" height="100" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <polygon points="-90,-80 0,-130 90,-80" fill="#241846" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Tongues of fire visible through every window -->
            <rect x="-60" y="-60" width="22" height="22" fill="rgba(251,113,38,0.8)"/>
            <rect x="-20" y="-60" width="22" height="22" fill="rgba(251,113,38,0.8)"/>
            <rect x="38"  y="-60" width="22" height="22" fill="rgba(251,113,38,0.8)"/>
            <!-- Wide-open door pouring sound -->
            <rect x="-14" y="-22" width="28" height="40" fill="rgba(254,243,199,0.85)"/>
          </g>
          <!-- Sound waves radiating outward from the house -->
          <g fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.5" stroke-dasharray="4 6">
            <ellipse cx="400" cy="280" rx="200" ry="140"/>
            <ellipse cx="400" cy="280" rx="260" ry="180"/>
            <ellipse cx="400" cy="280" rx="320" ry="220"/>
          </g>
          <!-- Crowd around the building from every nation, each with their language word on speech bubble -->
          <g fill="#0a0d1a">
            <!-- Top-left -->
            <g transform="translate(120 220)">
              <ellipse cx="0" cy="0" rx="10" ry="22"/>
              <ellipse cx="0" cy="-22" rx="9" ry="10"/>
              <!-- Speech bubble: "Parthian" -->
              <rect x="20" y="-26" width="60" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.6" rx="2"/>
              <text x="50" y="-16" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="7" letter-spacing="1.4" fill="#3d2a16">PARTHIA</text>
            </g>
            <!-- Top-right -->
            <g transform="translate(680 220)">
              <ellipse cx="0" cy="0" rx="10" ry="22"/>
              <ellipse cx="0" cy="-22" rx="9" ry="10"/>
              <rect x="-80" y="-26" width="60" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.6" rx="2"/>
              <text x="-50" y="-16" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="7" letter-spacing="1.4" fill="#3d2a16">MEDIA</text>
            </g>
            <!-- Left middle -->
            <g transform="translate(80 380)">
              <ellipse cx="0" cy="0" rx="10" ry="22"/>
              <ellipse cx="0" cy="-22" rx="9" ry="10"/>
              <rect x="20" y="-26" width="60" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.6" rx="2"/>
              <text x="50" y="-16" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="7" letter-spacing="1.4" fill="#3d2a16">EGYPT</text>
            </g>
            <!-- Right middle -->
            <g transform="translate(720 380)">
              <ellipse cx="0" cy="0" rx="10" ry="22"/>
              <ellipse cx="0" cy="-22" rx="9" ry="10"/>
              <rect x="-80" y="-26" width="60" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.6" rx="2"/>
              <text x="-50" y="-16" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="7" letter-spacing="1.4" fill="#3d2a16">ROME</text>
            </g>
            <!-- Bottom-left -->
            <g transform="translate(220 440)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="10"/>
              <rect x="20" y="-26" width="60" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.6" rx="2"/>
              <text x="50" y="-16" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="7" letter-spacing="1.4" fill="#3d2a16">LIBYA</text>
            </g>
            <!-- Bottom-right -->
            <g transform="translate(580 440)">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="10"/>
              <rect x="-80" y="-26" width="60" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.6" rx="2"/>
              <text x="-50" y="-16" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="7" letter-spacing="1.4" fill="#3d2a16">ARABIA</text>
            </g>
            <!-- Bottom-center -->
            <g transform="translate(380 460)" opacity="0.85">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="10"/>
            </g>
            <g transform="translate(420 462)" opacity="0.85">
              <ellipse cx="0" cy="0" rx="9" ry="22"/>
              <ellipse cx="0" cy="-22" rx="8" ry="10"/>
            </g>
          </g>
          <text x="400" y="100" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="16" letter-spacing="4" fill="rgba(251,191,36,0.85)">"WHAT DOES THIS MEAN?"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Each of us hears in our native language"</text>
        </svg>`
      },
      {
        id: 'three-thousand',
        title: 'Three Thousand in One Day',
        scriptureRef: 'Acts 2:14-41',
        bibleText: '"Those who accepted his message were baptized, and about three thousand were added to their number that day."',
        narration: 'Peter — the same Peter who had denied Jesus three times two months earlier — stood up in front of the crowd and preached the first Christian sermon. He explained that the wind and the fire were the Holy Spirit promised by the prophet Joel. He told them Jesus of Nazareth had been crucified, raised, and was now seated at the right hand of God. The crowd was cut to the heart. "Brothers — what must we do?" Peter said: "Repent and be baptized in the name of Jesus Christ for the forgiveness of your sins." Three thousand people said yes that morning. The Church was born.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'p3k', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <ellipse cx="660" cy="120" r="38" fill="#fef3c7"/>
          <ellipse cx="660" cy="120" r="62" fill="rgba(251,191,36,0.4)"/>
          <!-- Stone steps where Peter stands -->
          <g fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2">
            <rect x="300" y="280" width="200" height="20"/>
            <rect x="280" y="300" width="240" height="20"/>
            <rect x="260" y="320" width="280" height="20"/>
          </g>
          <!-- Peter on top step, arm extended, preaching, with tongue of fire still over his head -->
          <g transform="translate(400 280)">
            <path d="M -16 0 Q -14 -50 0 -60 Q 14 -50 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -62 Q 0 -50 8 -62" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Tongue of fire above -->
            <ellipse cx="0" cy="-92" rx="6" ry="12" fill="#fb923c"/>
            <ellipse cx="0" cy="-94" rx="3" ry="7" fill="#fbbf24"/>
            <ellipse cx="0" cy="-96" rx="1.5" ry="4" fill="#fef3c7"/>
            <!-- Arm extended, preaching gesture -->
            <line x1="14" y1="-32" x2="48" y2="-52" stroke="#3d2a16" stroke-width="6"/>
            <!-- Bright halo -->
            <circle cx="0" cy="-70" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <circle cx="0" cy="-70" r="38" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.2"/>
          </g>
          <text x="400" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">PETER · FIRST SERMON</text>
          <!-- Other apostles standing on lower step -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(330 350)"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(370 350)"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(430 350)"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(470 350)"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
          </g>
          <!-- Massive crowd filling the foreground — multi-row pattern -->
          <g fill="#0a0d1a">
            <g opacity="0.85">
              <circle cx="60" cy="390" r="5"/><circle cx="110" cy="388" r="5"/>
              <circle cx="160" cy="390" r="5"/><circle cx="210" cy="388" r="5"/>
              <circle cx="600" cy="388" r="5"/><circle cx="650" cy="390" r="5"/>
              <circle cx="700" cy="388" r="5"/><circle cx="750" cy="390" r="5"/>
            </g>
            <g opacity="0.92">
              <circle cx="40" cy="420" r="6"/><circle cx="90" cy="418" r="6"/>
              <circle cx="140" cy="420" r="6"/><circle cx="190" cy="418" r="6"/>
              <circle cx="240" cy="420" r="6"/><circle cx="560" cy="418" r="6"/>
              <circle cx="610" cy="420" r="6"/><circle cx="660" cy="418" r="6"/>
              <circle cx="710" cy="420" r="6"/><circle cx="760" cy="418" r="6"/>
            </g>
            <g>
              <circle cx="60" cy="450" r="7"/><circle cx="115" cy="448" r="7"/>
              <circle cx="170" cy="450" r="7"/><circle cx="225" cy="448" r="7"/>
              <circle cx="280" cy="450" r="7"/><circle cx="530" cy="450" r="7"/>
              <circle cx="585" cy="448" r="7"/><circle cx="640" cy="450" r="7"/>
              <circle cx="695" cy="448" r="7"/><circle cx="750" cy="450" r="7"/>
            </g>
            <g>
              <circle cx="40" cy="478" r="8"/><circle cx="100" cy="475" r="8"/>
              <circle cx="160" cy="478" r="8"/><circle cx="220" cy="475" r="8"/>
              <circle cx="280" cy="478" r="8"/><circle cx="340" cy="475" r="8"/>
              <circle cx="460" cy="475" r="8"/><circle cx="520" cy="478" r="8"/>
              <circle cx="580" cy="475" r="8"/><circle cx="640" cy="478" r="8"/>
              <circle cx="700" cy="475" r="8"/><circle cx="760" cy="478" r="8"/>
            </g>
          </g>
          <!-- Counter banner -->
          <g>
            <text x="400" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="30" letter-spacing="6" fill="rgba(251,191,36,0.95)">3,000 BAPTIZED</text>
            <text x="400" y="90" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(254,243,199,0.85)">IN ONE DAY · THE CHURCH IS BORN</text>
          </g>
        </svg>`
      }
    ],
    closing: 'Pentecost is the inverse of Babel. At Babel, humanity tried to climb up to God on their own and was scattered into a thousand languages they could not understand. At Pentecost, God came down — and a thousand languages became one Gospel that every one of them understood. The Spirit who came that morning has not left. Every person who has trusted Jesus since has received the same Spirit — not a different one, not a smaller portion. He is in you the same way He was in the upper room.',
    closingPrompt: 'Where in your life are you living as if the Spirit who fell at Pentecost is somewhere far away — and what would change today if you remembered He is actually in you?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 34 — Paul's Damascus Road
  // ════════════════════════════════════════════════════════════
  {
    id: 'damascus-road',
    title: "Paul's Damascus Road",
    subtitle: "The chief persecutor met the One he was persecuting.",
    icon: '⚡',
    color: '#fef3c7',
    accentColor: '#fbbf24',
    era: 'new-testament',
    scriptureRef: 'Acts 9',
    duration: '~6 min',
    scenes: [
      {
        id: 'saul-letters',
        title: "Letters to Damascus",
        scriptureRef: 'Acts 9:1-2',
        bibleText: '"Meanwhile, Saul was still breathing out murderous threats against the Lord\'s disciples. He went to the high priest and asked him for letters to the synagogues in Damascus."',
        narration: 'Saul of Tarsus was the most zealous Pharisee of his generation. He had stood and approved while Stephen was stoned. He had dragged Christian families out of their homes and watched them imprisoned. Now he wanted more. He asked the high priest for letters authorizing him to arrest any followers of "The Way" in the synagogues of Damascus — one hundred and fifty miles north. Sealed scrolls in his saddlebag, a band of armed men at his side, he rode out the city gate at full gallop. He thought he was on the Lord\'s business.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'sl', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#3d2a16', stars:false})}
          <!-- Jerusalem walls receding behind -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.5)" stroke-width="1" opacity="0.85">
            <rect x="0" y="220" width="180" height="200"/>
            <rect x="0" y="210" width="14" height="10"/>
            <rect x="22" y="210" width="14" height="10"/>
            <rect x="44" y="210" width="14" height="10"/>
            <rect x="66" y="210" width="14" height="10"/>
            <rect x="88" y="210" width="14" height="10"/>
            <rect x="110" y="210" width="14" height="10"/>
            <!-- Gate -->
            <path d="M 100 420 Q 100 340 140 340 Q 180 340 180 420" fill="#000a14" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
          </g>
          <text x="90" y="200" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.65)">JERUSALEM</text>
          <!-- Road stretching to upper right toward Damascus -->
          <path d="M 100 460 Q 300 380 500 320 Q 650 280 760 260" stroke="rgba(254,243,199,0.45)" stroke-width="6" fill="none" stroke-dasharray="6 10"/>
          <text x="700" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.85)">→ DAMASCUS</text>
          <!-- Hills + ground -->
          <path d="M 0 380 Q 400 360 800 380 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 440 Q 400 432 800 440 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- Saul on horseback, riding northeast -->
          <g transform="translate(380 410)">
            <!-- Horse body -->
            <ellipse cx="0" cy="0" rx="50" ry="16" fill="#0a0d1a"/>
            <!-- Horse neck + head -->
            <path d="M 40 -10 Q 60 -20 64 -36 L 68 -36 L 70 -22 L 60 -8" fill="#0a0d1a"/>
            <!-- Mane -->
            <path d="M 44 -16 L 38 -24 L 50 -20 L 44 -28 L 56 -22" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Legs at gallop -->
            <line x1="-30" y1="14" x2="-38" y2="32" stroke="#0a0d1a" stroke-width="5"/>
            <line x1="-14" y1="14" x2="-6" y2="32" stroke="#0a0d1a" stroke-width="5"/>
            <line x1="12"  y1="14" x2="20" y2="32" stroke="#0a0d1a" stroke-width="5"/>
            <line x1="28"  y1="14" x2="40" y2="32" stroke="#0a0d1a" stroke-width="5"/>
            <!-- Tail flowing back -->
            <path d="M -50 -2 Q -64 -2 -74 8" stroke="#0a0d1a" stroke-width="3" fill="none"/>
            <!-- Saul on horse — leaning forward, sword on hip -->
            <g transform="translate(-4 -28)">
              <ellipse cx="0" cy="0" rx="12" ry="20" fill="#1a1233"/>
              <ellipse cx="4" cy="-22" rx="9" ry="11" fill="#1a1233"/>
              <!-- Sharp pointed beard -->
              <path d="M -3 -16 Q 4 0 11 -16" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
              <!-- Reins -->
              <line x1="10" y1="-6" x2="36" y2="-30" stroke="rgba(251,191,36,0.6)" stroke-width="1"/>
              <!-- Sword at side -->
              <line x1="-10" y1="0" x2="-22" y2="18" stroke="rgba(254,243,199,0.65)" stroke-width="2"/>
              <!-- Halo absent -->
            </g>
            <!-- Saddlebag with scrolls -->
            <rect x="-22" y="-2" width="16" height="14" fill="#3d2a16" stroke="rgba(251,191,36,0.8)" stroke-width="0.8"/>
            <line x1="-22" y1="0" x2="-6" y2="0" stroke="rgba(254,243,199,0.7)" stroke-width="0.6"/>
            <!-- Sealed scroll edge sticking out -->
            <rect x="-20" y="-6" width="10" height="4" fill="#fef3c7" stroke="rgba(120,20,20,0.85)" stroke-width="0.4"/>
            <circle cx="-18" cy="-4" r="1.5" fill="rgba(120,20,20,0.85)"/>
          </g>
          <text x="380" y="372" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">SAUL OF TARSUS</text>
          <!-- A few armed companions on foot behind, smaller -->
          <g fill="#0a0d1a" opacity="0.8">
            <g transform="translate(220 430)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-26" rx="8" ry="9"/>
              <line x1="0" y1="-18" x2="0" y2="-50" stroke="#0a0d1a" stroke-width="2.5"/>
              <polygon points="-3,-50 3,-50 0,-58" fill="rgba(251,191,36,0.85)"/>
            </g>
            <g transform="translate(260 432)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-26" rx="8" ry="9"/>
              <line x1="0" y1="-18" x2="0" y2="-48" stroke="#0a0d1a" stroke-width="2.5"/>
              <polygon points="-3,-48 3,-48 0,-56" fill="rgba(251,191,36,0.85)"/>
            </g>
          </g>
          <!-- Dust trail behind -->
          <g fill="rgba(254,243,199,0.25)">
            <ellipse cx="160" cy="450" rx="30" ry="6"/>
            <ellipse cx="220" cy="455" rx="26" ry="5"/>
            <ellipse cx="280" cy="458" rx="22" ry="4"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">Breathing out murderous threats</text>
        </svg>`
      },
      {
        id: 'blinding-light',
        title: 'The Light from Heaven',
        scriptureRef: 'Acts 9:3-9',
        bibleText: '"\'Saul, Saul, why do you persecute me?\' \'Who are you, Lord?\' \'I am Jesus, whom you are persecuting.\'"',
        narration: 'It happened near Damascus, in the heat of the day. A light from the sky brighter than the noon sun hit the road. Saul was thrown from his horse onto the ground. A voice — clear, near, unmistakable: "Saul, Saul, why do you persecute me?" His face in the dust, eyes shut against the brilliance, he answered: "Who are you, Lord?" "I am Jesus, whom you are persecuting." When he stood up he was blind. His men, terrified, had to lead him by the hand the rest of the way into the city he had ridden out to ravage.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="blGlory" cx="0.5" cy="0.2" r="0.65">
              <stop offset="0%" stop-color="rgba(254,243,199,1)"/>
              <stop offset="40%" stop-color="rgba(254,243,199,0.85)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="#fef3c7"/>
          <!-- Massive overwhelming light from above -->
          <ellipse cx="400" cy="100" rx="600" ry="320" fill="url(#blGlory)"/>
          <!-- Vertical pillar of light striking down -->
          <polygon points="320,0 280,420 520,420 480,0" fill="rgba(254,243,199,0.95)"/>
          <polygon points="370,0 350,420 450,420 430,0" fill="#fef3c7"/>
          <!-- Faint ground beneath -->
          <path d="M 0 420 Q 400 410 800 420 L 800 500 L 0 500 Z" fill="rgba(251,113,38,0.5)"/>
          <!-- Horse rearing on its hind legs in panic -->
          <g transform="translate(560 380)">
            <!-- Body angled up -->
            <ellipse cx="0" cy="0" rx="40" ry="16" fill="#0a0d1a" transform="rotate(-30 0 0)"/>
            <!-- Head thrown back -->
            <path d="M 28 -8 Q 44 -32 38 -52 L 42 -52 L 50 -36 L 38 -16" fill="#0a0d1a" transform="rotate(-30 28 -8)"/>
            <!-- Front legs flailing UP -->
            <line x1="22" y1="-6" x2="40" y2="-46" stroke="#0a0d1a" stroke-width="5" transform="rotate(-30 22 -6)"/>
            <line x1="30" y1="-2" x2="50" y2="-30" stroke="#0a0d1a" stroke-width="5" transform="rotate(-30 30 -2)"/>
            <!-- Back legs planted -->
            <line x1="-26" y1="12" x2="-26" y2="36" stroke="#0a0d1a" stroke-width="6"/>
            <line x1="-12" y1="14" x2="-12" y2="36" stroke="#0a0d1a" stroke-width="6"/>
          </g>
          <!-- Saul fallen, face DOWN on the ground, body sprawled, hands shielding his eyes -->
          <g transform="translate(380 430)">
            <ellipse cx="0" cy="0" rx="60" ry="16" fill="#1a1233"/>
            <ellipse cx="-50" cy="-6" rx="13" ry="14" fill="#1a1233"/>
            <!-- Arms thrown over face -->
            <line x1="-40" y1="-2" x2="-58" y2="-22" stroke="#1a1233" stroke-width="5"/>
            <line x1="-50" y1="2" x2="-66" y2="-12" stroke="#1a1233" stroke-width="5"/>
            <!-- Scrolls fallen out of saddlebag, broken seals -->
            <rect x="20" y="0" width="14" height="6" fill="#fef3c7" stroke="rgba(120,20,20,0.65)" stroke-width="0.5"/>
            <circle cx="22" cy="2" r="1.5" fill="rgba(120,20,20,0.85)"/>
            <rect x="40" y="4" width="14" height="6" fill="#fef3c7" stroke="rgba(120,20,20,0.65)" stroke-width="0.5"/>
          </g>
          <!-- Companions standing back, frozen, hearing but not seeing -->
          <g fill="#0a0d1a" opacity="0.55">
            <g transform="translate(140 430)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-26" rx="8" ry="9"/>
              <line x1="-8" y1="-18" x2="-22" y2="-2" stroke="#0a0d1a" stroke-width="3"/>
              <line x1="8" y1="-18" x2="22" y2="-2" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(200 430)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-26" rx="8" ry="9"/>
              <line x1="-8" y1="-18" x2="-22" y2="-8" stroke="#0a0d1a" stroke-width="3"/>
            </g>
          </g>
          <!-- "SAUL, SAUL — WHY DO YOU PERSECUTE ME?" descending in the light -->
          <text x="400" y="90" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="5" fill="rgba(120,20,20,0.95)">"SAUL · SAUL"</text>
          <text x="400" y="130" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="16" letter-spacing="4" fill="rgba(120,20,20,0.85)">"WHY DO YOU PERSECUTE ME?"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(120,20,20,0.95)">"I am Jesus, whom you are persecuting"</text>
        </svg>`
      },
      {
        id: 'ananias',
        title: 'Brother Saul',
        scriptureRef: 'Acts 9:10-19',
        bibleText: '"Brother Saul, the Lord — Jesus, who appeared to you on the road as you were coming here — has sent me so that you may see again and be filled with the Holy Spirit."',
        narration: 'For three days Saul sat in a stranger\'s house in Damascus — blind, fasting, undone. Meanwhile the Lord came to a Christian named Ananias in a vision and told him to go to Saul. Ananias protested: "Lord, I\'ve heard about him. He has authority from the priests to arrest us." The Lord said, "Go. He is my chosen instrument to carry my name before Gentiles and kings and the people of Israel." So Ananias — terrified — went. He laid his hands on the man who had come to arrest him. He called him brother. Something like scales fell from Saul\'s eyes. He could see. He was baptized that hour.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'an', skyTop:'#1a1233', skyMid:'#3d2a16', skyBot:'#241846', stars:false})}
          <!-- Modest Damascene house interior -->
          <g fill="#3d2a16" opacity="0.65">
            <rect x="0" y="0" width="800" height="12"/>
            <rect x="0" y="100" width="800" height="6"/>
          </g>
          <!-- Single window with pale daylight -->
          <g transform="translate(700 200)">
            <rect x="-30" y="-50" width="60" height="100" fill="#fbbf24" opacity="0.35" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <!-- Floor -->
          <rect x="0" y="420" width="800" height="80" fill="#1a1233"/>
          <!-- Saul seated on a low stool, eyes bandaged with strip of cloth, hands open in lap -->
          <g transform="translate(440 380)">
            <!-- Stool -->
            <rect x="-20" y="20" width="40" height="22" fill="#3d2a16" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
            <!-- Seated body -->
            <path d="M -18 20 Q -16 -30 0 -42 Q 16 -30 18 20 Z" fill="#1a1233" stroke="rgba(254,243,199,0.45)" stroke-width="0.8"/>
            <ellipse cx="0" cy="-52" rx="12" ry="14" fill="#1a1233"/>
            <!-- Bandage across eyes -->
            <rect x="-14" y="-56" width="28" height="6" fill="rgba(254,243,199,0.6)"/>
            <!-- Beard -->
            <path d="M -7 -44 Q 0 -34 7 -44" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="none"/>
            <!-- Open hands in lap (palms up — surrender) -->
            <line x1="-12" y1="-12" x2="-18" y2="6" stroke="#1a1233" stroke-width="4"/>
            <line x1="12" y1="-12" x2="18" y2="6" stroke="#1a1233" stroke-width="4"/>
            <!-- Halo barely beginning -->
            <circle cx="0" cy="-52" r="20" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1" stroke-dasharray="3 3"/>
          </g>
          <!-- Ananias standing beside Saul, hands on his head/shoulders, gentle posture -->
          <g transform="translate(340 380)">
            <path d="M -16 40 Q -14 -38 0 -50 Q 14 -38 16 40 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-60" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -52 Q 0 -36 8 -52" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Both arms extended toward Saul -->
            <line x1="14" y1="-26" x2="60" y2="-46" stroke="#3d2a16" stroke-width="6"/>
            <line x1="14" y1="-18" x2="60" y2="-30" stroke="#3d2a16" stroke-width="6"/>
            <!-- Halo bright -->
            <circle cx="0" cy="-60" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
            <circle cx="0" cy="-60" r="34" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <text x="340" y="280" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">ANANIAS</text>
          <text x="440" y="280" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(254,243,199,0.65)">SAUL · BLIND 3 DAYS</text>
          <!-- "Scales" falling from Saul's eyes — small flecks below the bandage -->
          <g fill="rgba(254,243,199,0.85)" opacity="0.85">
            <ellipse cx="436" cy="345" rx="3" ry="1.5" transform="rotate(20 436 345)"/>
            <ellipse cx="444" cy="350" rx="3" ry="1.5" transform="rotate(-20 444 350)"/>
            <ellipse cx="432" cy="358" rx="3" ry="1.5" transform="rotate(30 432 358)"/>
            <ellipse cx="448" cy="362" rx="3" ry="1.5" transform="rotate(-30 448 362)"/>
            <ellipse cx="440" cy="372" rx="3" ry="1.5" transform="rotate(15 440 372)"/>
          </g>
          <!-- Soft beam of light from above onto Saul -->
          <polygon points="430,40 410,360 470,360 450,40" fill="rgba(254,243,199,0.18)"/>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Brother Saul"</text>
        </svg>`
      },
      {
        id: 'preaching',
        title: 'At Once He Began to Preach',
        scriptureRef: 'Acts 9:20-22',
        bibleText: '"At once he began to preach in the synagogues that Jesus is the Son of God. All those who heard him were astonished and asked, \'Isn\'t he the man who raised havoc in Jerusalem?\'"',
        narration: 'The man who had ridden into Damascus to arrest Christians was, within days, preaching Christ in the Damascus synagogues. Same beard, same education, same intensity — total opposite of his life\'s work. The other Jews could not believe it. "Isn\'t this the same Saul we heard about?" Yes. The same Saul. The Lord changed his name from Saul to Paul, and Paul went on to write thirteen letters of the New Testament, plant the first churches across the Roman Empire, and die a martyr in Rome. The most violent persecutor of the early church became its greatest missionary. There is no one Jesus cannot turn around.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'pp', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fef3c7', stars:false})}
          <!-- Synagogue interior with columns -->
          <g fill="#0a0d1a" opacity="0.85" stroke="rgba(251,191,36,0.7)" stroke-width="1">
            <rect x="60" y="80" width="36" height="380"/>
            <rect x="700" y="80" width="36" height="380"/>
            <rect x="54" y="64" width="48" height="18" fill="#3d2a16"/>
            <rect x="694" y="64" width="48" height="18" fill="#3d2a16"/>
          </g>
          <!-- Floor -->
          <rect x="0" y="440" width="800" height="60" fill="#1a1233"/>
          <!-- Bema (raised platform) center, with Paul on it -->
          <g>
            <path d="M 320 380 L 480 380 L 470 440 L 330 440 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <!-- Paul standing at the center, scroll open in hand, arm raised, transformed -->
          <g transform="translate(400 360)">
            <path d="M -20 0 Q -18 -50 0 -60 Q 18 -50 20 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <!-- Pointed beard -->
            <path d="M -8 -62 Q 0 -42 8 -62" stroke="rgba(254,243,199,0.7)" stroke-width="1.5" fill="none"/>
            <!-- Open eyes (no more bandage) -->
            <line x1="-4" y1="-72" x2="-1" y2="-72" stroke="rgba(254,243,199,0.85)" stroke-width="1.2"/>
            <line x1="1" y1="-72" x2="4" y2="-72" stroke="rgba(254,243,199,0.85)" stroke-width="1.2"/>
            <!-- Hand raised in proclamation -->
            <line x1="14" y1="-32" x2="42" y2="-58" stroke="#3d2a16" stroke-width="6"/>
            <!-- Scroll in other hand -->
            <line x1="-14" y1="-26" x2="-30" y2="-18" stroke="#3d2a16" stroke-width="5"/>
            <rect x="-46" y="-22" width="22" height="14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <line x1="-46" y1="-22" x2="-46" y2="-8" stroke="#3d2a16" stroke-width="1.5"/>
            <line x1="-24" y1="-22" x2="-24" y2="-8" stroke="#3d2a16" stroke-width="1.5"/>
            <!-- Huge halo -->
            <circle cx="0" cy="-70" r="28" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-70" r="42" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.95)">SAUL → PAUL · APOSTLE TO THE GENTILES</text>
          <!-- Audience seated, listening, some leaning forward, some skeptical -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(160 420)">
              <ellipse cx="0" cy="0" rx="11" ry="16"/>
              <ellipse cx="0" cy="-20" rx="9" ry="10"/>
              <!-- Listening posture -->
            </g>
            <g transform="translate(220 420)">
              <ellipse cx="0" cy="0" rx="11" ry="16"/>
              <ellipse cx="0" cy="-20" rx="9" ry="10"/>
            </g>
            <g transform="translate(280 420)">
              <ellipse cx="0" cy="0" rx="11" ry="16"/>
              <ellipse cx="0" cy="-20" rx="9" ry="10"/>
            </g>
            <g transform="translate(520 420)">
              <ellipse cx="0" cy="0" rx="11" ry="16"/>
              <ellipse cx="0" cy="-20" rx="9" ry="10"/>
            </g>
            <g transform="translate(580 420)">
              <ellipse cx="0" cy="0" rx="11" ry="16"/>
              <ellipse cx="0" cy="-20" rx="9" ry="10"/>
            </g>
            <g transform="translate(640 420)">
              <ellipse cx="0" cy="0" rx="11" ry="16"/>
              <ellipse cx="0" cy="-20" rx="9" ry="10"/>
            </g>
          </g>
          <!-- Speech bubble: "JESUS IS THE SON OF GOD" -->
          <g transform="translate(560 200)">
            <rect x="-100" y="-22" width="200" height="40" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1" rx="6"/>
            <polygon points="-50,18 -60,32 -34,18" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <text x="0" y="2" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="2" fill="#3d2a16">"JESUS IS THE</text>
            <text x="0" y="16" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="2" fill="#3d2a16">SON OF GOD"</text>
          </g>
        </svg>`
      }
    ],
    closing: 'Paul did not gradually warm to the Gospel. He did not have a long quiet season of doubt that slowly turned into faith. He was knocked off his horse mid-gallop, blinded, and given a new name and a new mission within seventy-two hours. If you have ever been told you are too far gone, too violent in your past, too set in your ways to be useful to God — Saul of Tarsus is the rebuttal. Jesus is not afraid of who you were yesterday.',
    closingPrompt: 'Who do you know — or who are YOU — that you have written off as too far gone for grace, and what would it look like to leave a little room for the Damascus Road?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 35 — The Good Shepherd
  // ════════════════════════════════════════════════════════════
  {
    id: 'good-shepherd',
    title: 'The Good Shepherd',
    subtitle: '"I am the good shepherd. The good shepherd lays down his life for the sheep."',
    icon: '🐑',
    color: '#34d399',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'John 10',
    duration: '~5 min',
    scenes: [
      {
        id: 'gate-fold',
        title: 'I Am the Gate',
        scriptureRef: 'John 10:7-10',
        bibleText: '"I am the gate; whoever enters through me will be saved. They will come in and go out, and find pasture."',
        narration: 'In first-century Israel, a sheepfold was a stone-walled enclosure on a hillside with one narrow opening. At night the shepherd would lay his own body across the opening so no sheep could wander out and no wolf could slip in. Jesus pointed at the picture His listeners had grown up with and said: "I am the gate." Not a door. Not a wall. The Shepherd Himself, lying across the only way in or out. "The thief comes only to steal and kill and destroy. I came that they may have life, and have it abundantly."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gg', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#fbbf24', stars:false})}
          <ellipse cx="660" cy="120" r="34" fill="#fef3c7"/>
          <ellipse cx="660" cy="120" r="54" fill="rgba(251,113,38,0.4)"/>
          <!-- Rolling green hills -->
          <path d="M 0 320 Q 200 290 400 310 Q 600 290 800 320 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 380 Q 400 370 800 380 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.32)"/>
          <!-- Stone sheepfold (curved wall enclosure with one narrow opening at center) -->
          <g>
            <!-- Wall outline -->
            <path d="M 140 380 Q 80 320 100 240 Q 200 180 320 200 L 360 220 L 440 220 L 480 200 Q 600 180 700 240 Q 720 320 660 380"
                  stroke="rgba(251,191,36,0.85)" stroke-width="3" fill="none"/>
            <!-- Stone block pattern -->
            <g stroke="rgba(251,191,36,0.55)" stroke-width="0.7" fill="#3d2a16" opacity="0.7">
              <rect x="118" y="340" width="18" height="20"/>
              <rect x="118" y="320" width="18" height="18"/>
              <rect x="118" y="300" width="18" height="18"/>
              <rect x="664" y="340" width="18" height="20"/>
              <rect x="664" y="320" width="18" height="18"/>
              <rect x="664" y="300" width="18" height="18"/>
            </g>
            <!-- The narrow opening (gap in the wall at front-center) -->
            <rect x="360" y="220" width="80" height="40" fill="#1a1233"/>
          </g>
          <!-- Sheep inside the fold (a small flock) -->
          <g fill="#fef3c7">
            <g transform="translate(280 300)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="6" ry="5"/><line x1="-8" y1="6" x2="-8" y2="14" stroke="#3d2a16" stroke-width="2"/><line x1="6" y1="6" x2="6" y2="14" stroke="#3d2a16" stroke-width="2"/></g>
            <g transform="translate(360 320)"><ellipse cx="0" cy="0" rx="13" ry="8"/><ellipse cx="-10" cy="-4" rx="5" ry="5"/><line x1="-6" y1="5" x2="-6" y2="12" stroke="#3d2a16" stroke-width="2"/><line x1="4" y1="5" x2="4" y2="12" stroke="#3d2a16" stroke-width="2"/></g>
            <g transform="translate(440 318)"><ellipse cx="0" cy="0" rx="13" ry="8"/><ellipse cx="-10" cy="-4" rx="5" ry="5"/><line x1="-6" y1="5" x2="-6" y2="12" stroke="#3d2a16" stroke-width="2"/><line x1="4" y1="5" x2="4" y2="12" stroke="#3d2a16" stroke-width="2"/></g>
            <g transform="translate(520 300)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="6" ry="5"/><line x1="-8" y1="6" x2="-8" y2="14" stroke="#3d2a16" stroke-width="2"/><line x1="6" y1="6" x2="6" y2="14" stroke="#3d2a16" stroke-width="2"/></g>
          </g>
          <!-- Shepherd laying ACROSS the gap, body horizontal, blocking the opening -->
          <g transform="translate(400 260)">
            <!-- Body lying down -->
            <ellipse cx="0" cy="0" rx="48" ry="13" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Head on the right side -->
            <ellipse cx="42" cy="-6" rx="11" ry="13" fill="#1a1233"/>
            <path d="M 34 0 Q 42 14 50 0" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Long staff held down along the body -->
            <line x1="-50" y1="4" x2="50" y2="4" stroke="#3d2a16" stroke-width="3"/>
            <!-- Crook at the end of staff -->
            <path d="M -50 4 Q -58 4 -58 -4 Q -58 -10 -50 -10" stroke="#3d2a16" stroke-width="3" fill="none"/>
            <!-- Halo bright -->
            <circle cx="42" cy="-6" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- Wolf approaching from outside (left edge) -->
          <g transform="translate(80 360)" opacity="0.85">
            <ellipse cx="0" cy="0" rx="22" ry="9" fill="#0a0d1a"/>
            <ellipse cx="-18" cy="-6" rx="9" ry="7" fill="#0a0d1a"/>
            <!-- Ears -->
            <polygon points="-22,-12 -16,-22 -14,-12" fill="#0a0d1a"/>
            <polygon points="-14,-12 -8,-22 -8,-12" fill="#0a0d1a"/>
            <!-- Glowing eyes -->
            <circle cx="-20" cy="-6" r="1.5" fill="rgba(251,113,38,0.95)"/>
            <circle cx="-14" cy="-6" r="1.5" fill="rgba(251,113,38,0.95)"/>
            <!-- Legs -->
            <line x1="-12" y1="8" x2="-12" y2="18" stroke="#0a0d1a" stroke-width="2.5"/>
            <line x1="0" y1="8" x2="0" y2="18" stroke="#0a0d1a" stroke-width="2.5"/>
            <line x1="12" y1="8" x2="12" y2="18" stroke="#0a0d1a" stroke-width="2.5"/>
            <!-- Tail -->
            <path d="M 18 -2 Q 28 -8 30 6" stroke="#0a0d1a" stroke-width="2" fill="none"/>
          </g>
          <text x="80" y="332" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="8" letter-spacing="2" fill="rgba(248,113,113,0.85)">WOLF</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"I am the gate"</text>
        </svg>`
      },
      {
        id: 'voice-known',
        title: 'My Sheep Know My Voice',
        scriptureRef: 'John 10:3-5 · 14',
        bibleText: '"His sheep follow him because they know his voice. But they will never follow a stranger; in fact, they will run away from him because they do not recognize a stranger\'s voice."',
        narration: 'Every shepherd in Galilee had a unique whistle, a unique call, a unique way of speaking his sheep into motion. Multiple flocks could share a single fold for the night, and in the morning each shepherd would stand at the opening and call. His own sheep — and only his own — would come. They did not need to read his name. They knew the voice. Jesus said: "My sheep listen to my voice. I know them and they follow me. They will not follow a stranger." It is not religion that the sheep know. It is a Person.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gv', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Dawn -->
          <circle cx="660" cy="120" r="40" fill="#fef3c7"/>
          <circle cx="660" cy="120" r="58" fill="rgba(251,191,36,0.5)"/>
          <!-- Green hillside -->
          <path d="M 0 320 Q 400 290 800 320 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.35)"/>
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.55)"/>
          <!-- Shepherd standing on the left, hand cupped to mouth, calling -->
          <g transform="translate(180 380)">
            <path d="M -16 0 Q -14 -50 0 -62 Q 14 -50 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-72" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -64 Q 0 -52 8 -64" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Hand cupped to mouth -->
            <line x1="10" y1="-58" x2="22" y2="-66" stroke="#3d2a16" stroke-width="4"/>
            <ellipse cx="24" cy="-66" rx="5" ry="4" fill="#3d2a16"/>
            <!-- Staff -->
            <line x1="-18" y1="-32" x2="-26" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
            <path d="M -26 -38 Q -34 -38 -34 -28 Q -34 -22 -26 -22" stroke="#3d2a16" stroke-width="2.5" fill="none"/>
            <!-- Halo -->
            <circle cx="0" cy="-72" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- Sound waves emanating from shepherd's mouth -->
          <g fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.5" stroke-dasharray="3 5">
            <path d="M 220 314 Q 300 310 380 312"/>
            <path d="M 220 326 Q 300 322 380 324"/>
            <path d="M 220 338 Q 300 334 380 336"/>
          </g>
          <!-- Multiple sheep RESPONDING — all heads turned toward the shepherd, walking toward him -->
          <g fill="#fef3c7">
            <g transform="translate(400 380)">
              <ellipse cx="0" cy="0" rx="20" ry="12"/>
              <ellipse cx="-20" cy="-6" rx="8" ry="7"/>
              <circle cx="-24" cy="-4" r="1.5" fill="#0a0d1a"/>
              <line x1="-12" y1="10" x2="-12" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
              <line x1="6" y1="10" x2="6" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
              <line x1="14" y1="10" x2="14" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
            </g>
            <g transform="translate(470 388)">
              <ellipse cx="0" cy="0" rx="18" ry="11"/>
              <ellipse cx="-18" cy="-5" rx="7" ry="6"/>
              <circle cx="-22" cy="-4" r="1.5" fill="#0a0d1a"/>
              <line x1="-10" y1="9" x2="-10" y2="18" stroke="#3d2a16" stroke-width="2.5"/>
              <line x1="6" y1="9" x2="6" y2="18" stroke="#3d2a16" stroke-width="2.5"/>
            </g>
            <g transform="translate(540 384)">
              <ellipse cx="0" cy="0" rx="20" ry="12"/>
              <ellipse cx="-20" cy="-6" rx="8" ry="7"/>
              <circle cx="-24" cy="-4" r="1.5" fill="#0a0d1a"/>
              <line x1="-12" y1="10" x2="-12" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
              <line x1="14" y1="10" x2="14" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
            </g>
            <g transform="translate(610 390)">
              <ellipse cx="0" cy="0" rx="18" ry="11"/>
              <ellipse cx="-18" cy="-5" rx="7" ry="6"/>
              <circle cx="-22" cy="-4" r="1.5" fill="#0a0d1a"/>
              <line x1="-10" y1="9" x2="-10" y2="18" stroke="#3d2a16" stroke-width="2.5"/>
              <line x1="6" y1="9" x2="6" y2="18" stroke="#3d2a16" stroke-width="2.5"/>
            </g>
            <g transform="translate(680 380)">
              <ellipse cx="0" cy="0" rx="20" ry="12"/>
              <ellipse cx="-20" cy="-6" rx="8" ry="7"/>
              <circle cx="-24" cy="-4" r="1.5" fill="#0a0d1a"/>
              <line x1="-12" y1="10" x2="-12" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
              <line x1="14" y1="10" x2="14" y2="20" stroke="#3d2a16" stroke-width="2.5"/>
            </g>
            <g transform="translate(730 388)">
              <ellipse cx="0" cy="0" rx="18" ry="11"/>
              <ellipse cx="-18" cy="-5" rx="7" ry="6"/>
              <circle cx="-22" cy="-4" r="1.5" fill="#0a0d1a"/>
              <line x1="-10" y1="9" x2="-10" y2="18" stroke="#3d2a16" stroke-width="2.5"/>
              <line x1="6" y1="9" x2="6" y2="18" stroke="#3d2a16" stroke-width="2.5"/>
            </g>
          </g>
          <!-- Movement lines under sheep (indicating they're walking toward shepherd) -->
          <g stroke="rgba(0,0,0,0.25)" stroke-width="1" fill="none">
            <line x1="395" y1="396" x2="385" y2="396"/>
            <line x1="465" y1="402" x2="455" y2="402"/>
            <line x1="535" y1="400" x2="525" y2="400"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"They know his voice"</text>
        </svg>`
      },
      {
        id: 'lays-down-life',
        title: 'I Lay Down My Life',
        scriptureRef: 'John 10:11-15',
        bibleText: '"I am the good shepherd. The good shepherd lays down his life for the sheep."',
        narration: 'The hired hand runs when he sees the wolf coming, because the sheep aren\'t his. The Good Shepherd stays. He has only one weapon — His own body. He puts Himself between the wolf and the flock. "I lay down my life for the sheep," Jesus said. "No one takes it from me. I lay it down of my own accord, and I have authority to take it up again." A bunch of His listeners thought He was talking metaphorically. They were wrong.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gld', skyTop:'#0a0d1a', skyMid:'#241846', skyBot:'#3d2a16', stars:false})}
          <g fill="#fef3c7" opacity="0.55">
            <circle cx="80" cy="50" r="0.7"/><circle cx="260" cy="80" r="0.8"/>
            <circle cx="540" cy="60" r="0.9"/><circle cx="720" cy="100" r="0.7"/>
          </g>
          <!-- Hillside at night -->
          <path d="M 0 360 Q 400 340 800 360 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <path d="M 0 420 Q 400 412 800 420 L 800 500 L 0 500 Z" fill="#0a0d1a"/>
          <!-- THE WOLF on the left, snarling, lunging forward -->
          <g transform="translate(140 400) rotate(-10)">
            <ellipse cx="0" cy="0" rx="36" ry="14" fill="#0a0d1a"/>
            <ellipse cx="32" cy="-8" rx="14" ry="11" fill="#0a0d1a"/>
            <!-- Ears back/snarl -->
            <polygon points="20,-20 30,-30 28,-18" fill="#0a0d1a"/>
            <polygon points="34,-20 44,-30 42,-18" fill="#0a0d1a"/>
            <!-- Mouth open with teeth -->
            <path d="M 40 -4 Q 50 0 46 6 L 44 0 L 42 6 L 40 0 L 38 6 Z" fill="rgba(254,243,199,0.95)" stroke="#0a0d1a" stroke-width="0.6"/>
            <!-- Glowing eyes -->
            <circle cx="30" cy="-8" r="2" fill="rgba(251,113,38,0.95)"/>
            <circle cx="36" cy="-8" r="2" fill="rgba(251,113,38,0.95)"/>
            <!-- Legs mid-stride -->
            <line x1="-20" y1="14" x2="-28" y2="32" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="-4" y1="14" x2="0" y2="32" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="14" y1="14" x2="20" y2="32" stroke="#0a0d1a" stroke-width="4"/>
            <line x1="28" y1="14" x2="36" y2="32" stroke="#0a0d1a" stroke-width="4"/>
            <!-- Tail bristled -->
            <path d="M -34 -2 Q -50 -10 -52 4" stroke="#0a0d1a" stroke-width="3" fill="none"/>
          </g>
          <text x="140" y="358" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(248,113,113,0.95)">WOLF</text>
          <!-- THE SHEPHERD between wolf and flock, arms wide, body protecting the flock -->
          <g transform="translate(380 380)">
            <path d="M -22 0 Q -18 -50 0 -62 Q 18 -50 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-72" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -64 Q 0 -50 8 -64" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <!-- Arms thrown WIDE OUT toward the wolf to block -->
            <line x1="-18" y1="-44" x2="-50" y2="-50" stroke="#3d2a16" stroke-width="6"/>
            <line x1="18" y1="-44" x2="50" y2="-50" stroke="#3d2a16" stroke-width="6"/>
            <!-- Staff held forward -->
            <line x1="-30" y1="-30" x2="-60" y2="-10" stroke="#3d2a16" stroke-width="4"/>
            <!-- Halo -->
            <circle cx="0" cy="-72" r="28" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.8"/>
            <circle cx="0" cy="-72" r="40" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- The flock huddled behind the shepherd -->
          <g fill="#fef3c7">
            <g transform="translate(520 410)">
              <ellipse cx="0" cy="0" rx="16" ry="10"/>
              <ellipse cx="-14" cy="-5" rx="6" ry="6"/>
              <line x1="-10" y1="8" x2="-10" y2="16" stroke="#3d2a16" stroke-width="2"/>
              <line x1="6" y1="8" x2="6" y2="16" stroke="#3d2a16" stroke-width="2"/>
            </g>
            <g transform="translate(570 416)">
              <ellipse cx="0" cy="0" rx="16" ry="10"/>
              <ellipse cx="-14" cy="-5" rx="6" ry="6"/>
              <line x1="-10" y1="8" x2="-10" y2="16" stroke="#3d2a16" stroke-width="2"/>
              <line x1="6" y1="8" x2="6" y2="16" stroke="#3d2a16" stroke-width="2"/>
            </g>
            <g transform="translate(620 410)">
              <ellipse cx="0" cy="0" rx="16" ry="10"/>
              <ellipse cx="-14" cy="-5" rx="6" ry="6"/>
              <line x1="-10" y1="8" x2="-10" y2="16" stroke="#3d2a16" stroke-width="2"/>
              <line x1="6" y1="8" x2="6" y2="16" stroke="#3d2a16" stroke-width="2"/>
            </g>
            <g transform="translate(680 416)">
              <ellipse cx="0" cy="0" rx="16" ry="10"/>
              <ellipse cx="-14" cy="-5" rx="6" ry="6"/>
              <line x1="-10" y1="8" x2="-10" y2="16" stroke="#3d2a16" stroke-width="2"/>
              <line x1="6" y1="8" x2="6" y2="16" stroke="#3d2a16" stroke-width="2"/>
            </g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"I lay down my life · for the sheep"</text>
        </svg>`
      },
      {
        id: 'one-flock',
        title: 'One Flock · One Shepherd',
        scriptureRef: 'John 10:16',
        bibleText: '"I have other sheep that are not of this sheep pen. I must bring them also. They too will listen to my voice, and there shall be one flock and one shepherd."',
        narration: 'Then He said something that scandalized His Jewish listeners. "I have other sheep that are not of this sheep pen. I must bring them also." He was talking about the Gentiles — the foreigners outside the boundaries of Israel. Outsiders to the covenant. People His audience considered outside the covenant of God. Jesus said: I am their Shepherd too. There will be one flock — Jew and Gentile, every tribe, every tongue, every nation — and one Shepherd. He was redrawing the boundary of the people of God to include the whole world.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'gof', skyTop:'#3d2a5e', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <ellipse cx="660" cy="100" r="36" fill="#fef3c7"/>
          <ellipse cx="660" cy="100" r="58" fill="rgba(251,191,36,0.5)"/>
          <!-- Wide expansive grassland -->
          <path d="M 0 320 Q 400 300 800 320 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.4)"/>
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.6)"/>
          <!-- Shepherd standing center, arms gently raised, sheep streaming in from BOTH sides -->
          <g transform="translate(400 370)">
            <path d="M -22 0 Q -18 -50 0 -62 Q 18 -50 22 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-72" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -64 Q 0 -52 8 -64" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <!-- Both arms gently spread -->
            <line x1="-18" y1="-40" x2="-44" y2="-46" stroke="#3d2a16" stroke-width="6"/>
            <line x1="18" y1="-40" x2="44" y2="-46" stroke="#3d2a16" stroke-width="6"/>
            <!-- Staff -->
            <line x1="-26" y1="-32" x2="-32" y2="10" stroke="#3d2a16" stroke-width="3"/>
            <path d="M -32 -38 Q -42 -38 -42 -28 Q -42 -22 -32 -22" stroke="#3d2a16" stroke-width="3" fill="none"/>
            <!-- Massive halo -->
            <circle cx="0" cy="-72" r="32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-72" r="48" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
            <circle cx="0" cy="-72" r="64" fill="none" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
          </g>
          <!-- LEFT side: "Jewish" flock, streaming in -->
          <g fill="#fef3c7">
            <g transform="translate(80 400)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="5" ry="5"/><line x1="-8" y1="6" x2="-8" y2="14" stroke="#3d2a16" stroke-width="2"/><line x1="6" y1="6" x2="6" y2="14" stroke="#3d2a16" stroke-width="2"/></g>
            <g transform="translate(130 408)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="5" ry="5"/><line x1="-8" y1="6" x2="-8" y2="14" stroke="#3d2a16" stroke-width="2"/></g>
            <g transform="translate(180 400)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="5" ry="5"/><line x1="-8" y1="6" x2="-8" y2="14" stroke="#3d2a16" stroke-width="2"/></g>
            <g transform="translate(230 408)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="5" ry="5"/></g>
            <g transform="translate(280 400)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="5" ry="5"/></g>
            <g transform="translate(330 410)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="-12" cy="-4" rx="5" ry="5"/></g>
          </g>
          <text x="160" y="380" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">THIS FOLD</text>
          <!-- RIGHT side: "Other sheep" — DIFFERENT color flock to signal different ethnicity, streaming in -->
          <g fill="rgba(74,52,32,0.85)" stroke="#fef3c7" stroke-width="0.5">
            <g transform="translate(480 410)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="12" cy="-4" rx="5" ry="5"/><line x1="-6" y1="6" x2="-6" y2="14" stroke="#3d2a16" stroke-width="2"/><line x1="8" y1="6" x2="8" y2="14" stroke="#3d2a16" stroke-width="2"/></g>
            <g transform="translate(530 400)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="12" cy="-4" rx="5" ry="5"/></g>
            <g transform="translate(580 408)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="12" cy="-4" rx="5" ry="5"/></g>
            <g transform="translate(630 400)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="12" cy="-4" rx="5" ry="5"/></g>
            <g transform="translate(680 408)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="12" cy="-4" rx="5" ry="5"/></g>
            <g transform="translate(730 400)"><ellipse cx="0" cy="0" rx="14" ry="9"/><ellipse cx="12" cy="-4" rx="5" ry="5"/></g>
          </g>
          <text x="640" y="380" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">OTHER SHEEP</text>
          <!-- Big "ONE FLOCK · ONE SHEPHERD" banner at top -->
          <text x="400" y="60" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="6" fill="rgba(251,191,36,0.95)">ONE FLOCK · ONE SHEPHERD</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"They too will listen to my voice"</text>
        </svg>`
      }
    ],
    closing: 'In a world full of voices — algorithms, advertisers, anxious friends, our own racing thoughts — Jesus is still the only Shepherd whose voice actually leads sheep to water that does not run out. The good news is not just that He calls. The good news is that the sheep KNOW the voice. You may not feel like an expert at hearing Him. But if you belong to Him, the hearing is built into the relationship. Stay close. The voice gets clearer over time.',
    closingPrompt: 'When you slow down and listen, what does the Shepherd\'s voice actually sound like to you right now — and which competing voice has been louder lately?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 36 — Woman at the Well
  // ════════════════════════════════════════════════════════════
  {
    id: 'woman-at-well',
    title: 'The Woman at the Well',
    subtitle: 'Noon · Samaria · the longest conversation Jesus had with one person.',
    icon: '💧',
    color: '#38bdf8',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'John 4',
    duration: '~6 min',
    scenes: [
      {
        id: 'sychar-well',
        title: 'A Tired Rabbi at the Well',
        scriptureRef: 'John 4:1-6',
        bibleText: '"Jesus, tired as he was from the journey, sat down by the well. It was about noon."',
        narration: 'Most Jews going north from Jerusalem to Galilee detoured around Samaria to avoid the half-Jewish people who lived there. Jesus did not detour. He walked straight through. Around noon — the hottest hour of the day, when nobody in their right mind drew water — He came to Jacob\'s well outside the town of Sychar. He sent the disciples into town to buy lunch. He sat down on the stone rim of the well. He was tired and thirsty.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <radialGradient id="swSun" cx="0.5" cy="0.2" r="0.7">
              <stop offset="0%" stop-color="rgba(254,243,199,0.95)"/>
              <stop offset="40%" stop-color="rgba(251,113,38,0.45)"/>
              <stop offset="100%" stop-color="rgba(251,113,38,0)"/>
            </radialGradient>
            <linearGradient id="swSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fbbf24"/>
              <stop offset="60%" stop-color="#fef3c7"/>
              <stop offset="100%" stop-color="rgba(34,197,94,0.4)"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#swSky)"/>
          <ellipse cx="400" cy="100" rx="400" ry="180" fill="url(#swSun)"/>
          <circle cx="400" cy="80" r="40" fill="#fef3c7"/>
          <!-- Heat shimmer / dusty ground -->
          <path d="M 0 360 Q 200 350 400 360 Q 600 350 800 360 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 410 Q 400 402 800 410 L 800 500 L 0 500 Z" fill="rgba(74,52,32,0.5)"/>
          <!-- Distant Mt. Gerizim -->
          <g transform="translate(700 340)" opacity="0.55">
            <polygon points="-50,40 0,-30 50,40" fill="#241846" stroke="rgba(251,191,36,0.45)" stroke-width="0.8"/>
          </g>
          <text x="700" y="320" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.65)">MT GERIZIM</text>
          <!-- Town of Sychar (small, to the left in distance) -->
          <g transform="translate(120 360)" opacity="0.7">
            <rect x="-30" y="-30" width="60" height="30" fill="#3d2a16" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <polygon points="-36,-30 0,-50 36,-30" fill="#241846" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <rect x="-8" y="-16" width="16" height="16" fill="#0a0d1a"/>
          </g>
          <text x="120" y="320" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.65)">SYCHAR</text>
          <!-- Jacob's well — round stone curb in the center -->
          <g transform="translate(400 380)">
            <!-- Curb -->
            <ellipse cx="0" cy="0" rx="60" ry="22" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Dark opening at top -->
            <ellipse cx="0" cy="-4" rx="44" ry="14" fill="#0a0d1a"/>
            <!-- Stone seams -->
            <g stroke="rgba(254,243,199,0.55)" stroke-width="0.6">
              <line x1="-50" y1="10" x2="50" y2="10"/>
              <line x1="-50" y1="16" x2="50" y2="16"/>
              <line x1="-30" y1="2" x2="-30" y2="22"/>
              <line x1="0" y1="2" x2="0" y2="22"/>
              <line x1="30" y1="2" x2="30" y2="22"/>
            </g>
            <!-- Wooden beam across with rope hanging down -->
            <line x1="-50" y1="-30" x2="50" y2="-30" stroke="#3d2a16" stroke-width="3"/>
            <line x1="0" y1="-30" x2="0" y2="-8" stroke="rgba(254,243,199,0.55)" stroke-width="1"/>
          </g>
          <text x="400" y="358" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">JACOB'S WELL</text>
          <!-- Jesus seated on the well rim, head bowed, tired -->
          <g transform="translate(420 350)">
            <!-- Body slumped slightly -->
            <path d="M -16 0 Q -14 -42 0 -52 Q 14 -42 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-62" rx="12" ry="14" fill="#1a1233"/>
            <!-- Head tilted slightly down (tired) -->
            <path d="M -8 -54 Q 0 -42 8 -54" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -62 Q -16 -48 -12 -34 M 10 -62 Q 16 -48 12 -34" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Hand wiping forehead -->
            <line x1="10" y1="-46" x2="14" y2="-62" stroke="#3d2a16" stroke-width="3.5"/>
            <!-- Halo -->
            <circle cx="0" cy="-62" r="22" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          </g>
          <!-- Heat shimmer wavy lines rising from the ground -->
          <g stroke="rgba(254,243,199,0.35)" stroke-width="0.8" fill="none">
            <path d="M 200 460 Q 210 450 200 440"/>
            <path d="M 600 460 Q 610 450 600 440"/>
            <path d="M 250 470 Q 260 458 250 446"/>
            <path d="M 560 470 Q 570 458 560 446"/>
          </g>
          <text x="80" y="60" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="rgba(251,113,38,0.85)">NOON · THE SIXTH HOUR</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Jesus, tired from the journey, sat down by the well"</text>
        </svg>`
      },
      {
        id: 'woman-arrives',
        title: 'A Woman Came to Draw Water',
        scriptureRef: 'John 4:7-15',
        bibleText: '"Will you give me a drink?" …"How can you ask me for a drink? Sir, you have nothing to draw with and the well is deep. Where can you get this living water?"',
        narration: 'A Samaritan woman came to the well alone at the worst possible hour. The other women of Sychar drew water at dawn — together — when it was cool. She came at noon to avoid them. She had a reputation. Five husbands. The man she lived with now was not the sixth. She walked up with her clay jar, expecting silence. Instead a Jewish rabbi looked at her and said: "Will you give me a drink?" She froze. A Jew did not speak to a Samaritan. A man did not speak to a strange woman. A rabbi never. And yet He did.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'wwa', skyTop:'#fbbf24', skyMid:'#fef3c7', skyBot:'#3d2a16', stars:false})}
          <circle cx="400" cy="80" r="36" fill="#fef3c7"/>
          <!-- Ground -->
          <path d="M 0 360 Q 400 350 800 360 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 420 Q 400 412 800 420 L 800 500 L 0 500 Z" fill="rgba(74,52,32,0.5)"/>
          <!-- Well center-back -->
          <g transform="translate(400 380)">
            <ellipse cx="0" cy="0" rx="60" ry="22" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-4" rx="44" ry="14" fill="#0a0d1a"/>
            <g stroke="rgba(254,243,199,0.55)" stroke-width="0.6">
              <line x1="-50" y1="10" x2="50" y2="10"/>
              <line x1="-50" y1="16" x2="50" y2="16"/>
            </g>
            <line x1="-50" y1="-30" x2="50" y2="-30" stroke="#3d2a16" stroke-width="3"/>
          </g>
          <!-- Jesus on the right side of the well, still seated, gesturing softly toward her -->
          <g transform="translate(520 360)">
            <path d="M -16 0 Q -14 -42 0 -52 Q 14 -42 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-62" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -54 Q 0 -42 8 -54" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Open palm gesture toward woman -->
            <line x1="-14" y1="-30" x2="-44" y2="-22" stroke="#3d2a16" stroke-width="5"/>
            <circle cx="0" cy="-62" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- The Samaritan woman on the left, mid-step, surprised, carrying jar on shoulder -->
          <g transform="translate(280 380)">
            <path d="M -16 30 Q -14 -38 0 -50 Q 14 -38 16 30 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.65)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-60" rx="12" ry="14" fill="#1a1233"/>
            <!-- Headscarf -->
            <path d="M -10 -66 Q 0 -78 10 -66 Q 12 -54 0 -50 Q -12 -54 -10 -66 Z" fill="#241846" stroke="rgba(251,191,36,0.65)" stroke-width="1"/>
            <!-- Long hair under scarf -->
            <path d="M -10 -50 Q -14 -32 -10 -14" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <path d="M 10 -50 Q 14 -32 10 -14" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Right arm raised to steady jar on shoulder -->
            <line x1="14" y1="-30" x2="22" y2="-66" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Water jar on shoulder -->
            <g transform="translate(22 -70)">
              <ellipse cx="0" cy="0" rx="14" ry="8" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
              <path d="M -14 0 Q -10 -22 0 -22 Q 10 -22 14 0" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
              <ellipse cx="0" cy="-22" rx="6" ry="2" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.7"/>
              <!-- Handle -->
              <path d="M 14 -10 Q 22 -16 18 -22" stroke="#3d2a16" stroke-width="1.5" fill="none"/>
            </g>
            <!-- Free hand at waist (startled / defensive) -->
            <line x1="-14" y1="-26" x2="-22" y2="-12" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Halo subdued (faith not yet) -->
            <circle cx="0" cy="-60" r="20" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1" stroke-dasharray="2 3"/>
          </g>
          <text x="280" y="312" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">SAMARITAN WOMAN</text>
          <!-- Speech bubble from Jesus -->
          <g transform="translate(420 240)">
            <rect x="-86" y="-22" width="172" height="34" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1" rx="5"/>
            <polygon points="-30,12 -42,22 -22,12" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <text x="0" y="0" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#3d2a16">"WILL YOU GIVE ME</text>
            <text x="0" y="14" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#3d2a16">A DRINK?"</text>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">The first thing He asked her for · was a drink</text>
        </svg>`
      },
      {
        id: 'living-water',
        title: 'Living Water',
        scriptureRef: 'John 4:13-26',
        bibleText: '"Everyone who drinks this water will be thirsty again, but whoever drinks the water I give them will never thirst. The water I give them will become in them a spring of water welling up to eternal life."',
        narration: 'He told her about water she had never heard of. "Whoever drinks the water I give will never thirst. It will become in them a spring welling up to eternal life." She said, "Sir, give me this water." Then He turned to the place she had been hiding for years. "Go, call your husband." "I have no husband." "You are right. You have had five. The man you have now is not your husband." She did not flinch. She redirected — about which mountain to worship on. He answered her, kindly, and then said: "I, the one speaking to you — I am the Messiah." She left her water jar at the well. She ran into town.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'wlw', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Glowing midday light -->
          <radialGradient id="wlwGlow" cx="0.5" cy="0.4" r="0.55">
            <stop offset="0%" stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="55%" stop-color="rgba(56,189,248,0.22)"/>
            <stop offset="100%" stop-color="rgba(56,189,248,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="280" rx="400" ry="240" fill="url(#wlwGlow)"/>
          <!-- Ground -->
          <path d="M 0 360 Q 400 350 800 360 L 800 500 L 0 500 Z" fill="rgba(74,52,32,0.55)"/>
          <!-- Well center -->
          <g transform="translate(400 380)">
            <ellipse cx="0" cy="0" rx="60" ry="22" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-4" rx="44" ry="14" fill="#0a0d1a"/>
            <!-- Living water — luminous spring rising UP and OUT of the well -->
            <g>
              <path d="M -22 -8 Q -10 -50 0 -90 Q 10 -50 22 -8" fill="rgba(56,189,248,0.45)" stroke="rgba(254,243,199,0.85)" stroke-width="1.4"/>
              <path d="M -10 -16 Q -4 -50 0 -80 Q 4 -50 10 -16" fill="rgba(254,243,199,0.65)"/>
              <!-- Water droplets above -->
              <g fill="rgba(254,243,199,0.95)">
                <circle cx="-8" cy="-110" r="2"/>
                <circle cx="0" cy="-118" r="2.5"/>
                <circle cx="8" cy="-114" r="2"/>
                <circle cx="-14" cy="-94" r="1.6"/>
                <circle cx="14" cy="-98" r="1.6"/>
              </g>
            </g>
          </g>
          <!-- Jesus on left side, hand pointing UP at the rising spring -->
          <g transform="translate(260 380)">
            <path d="M -16 0 Q -14 -50 0 -60 Q 14 -50 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -62 Q 0 -50 8 -62" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Arm pointing toward the spring -->
            <line x1="14" y1="-32" x2="68" y2="-58" stroke="#3d2a16" stroke-width="6"/>
            <line x1="68" y1="-58" x2="82" y2="-72" stroke="#3d2a16" stroke-width="5"/>
            <circle cx="0" cy="-70" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.7"/>
            <circle cx="0" cy="-70" r="40" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Woman on right side, eyes opened, water jar already on the ground beside her -->
          <g transform="translate(540 380)">
            <path d="M -16 0 Q -14 -50 0 -60 Q 14 -50 16 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -10 -76 Q 0 -88 10 -76 Q 12 -64 0 -60 Q -12 -64 -10 -76 Z" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <!-- Hand on heart -->
            <line x1="-10" y1="-36" x2="-2" y2="-42" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Halo (now bright) -->
            <circle cx="0" cy="-70" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <!-- Water jar on the ground beside her (left behind!) -->
          <g transform="translate(580 410)">
            <ellipse cx="0" cy="0" rx="14" ry="8" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <path d="M -14 0 Q -10 -22 0 -22 Q 10 -22 14 0" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <ellipse cx="0" cy="-22" rx="6" ry="2" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.7"/>
          </g>
          <!-- Big banner -->
          <text x="400" y="70" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="20" letter-spacing="5" fill="rgba(251,191,36,0.95)">"A SPRING WELLING UP</text>
          <text x="400" y="100" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="20" letter-spacing="5" fill="rgba(251,191,36,0.95)">TO ETERNAL LIFE"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"I, the one speaking to you · I am he"</text>
        </svg>`
      },
      {
        id: 'samaria-believes',
        title: 'Come See',
        scriptureRef: 'John 4:28-30 · 39-42',
        bibleText: '"Many of the Samaritans from that town believed in him because of the woman\'s testimony… When the Samaritans came to him, they urged him to stay with them, and he stayed two days."',
        narration: 'She left the water jar at the well. She ran back into Sychar, the village she had been avoiding. She found the very people she had been hiding from and said: "Come, see a man who told me everything I ever did. Could this be the Messiah?" Half the town followed her back. They listened to Him themselves. They begged Him to stay. He stayed two days in a Samaritan town — something no respectable Jewish rabbi would have ever done — and many of them believed. They said to her: "We no longer believe just because of what you said. We have heard him ourselves."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'wsb', skyTop:'#3d2a5e', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <ellipse cx="660" cy="120" r="34" fill="#fef3c7"/>
          <ellipse cx="660" cy="120" r="54" fill="rgba(251,191,36,0.4)"/>
          <!-- Hills -->
          <path d="M 0 280 Q 400 250 800 280 L 800 500 L 0 500 Z" fill="#241846"/>
          <path d="M 0 360 Q 400 350 800 360 L 800 500 L 0 500 Z" fill="rgba(34,197,94,0.3)"/>
          <!-- Sychar village on the LEFT — gate visible, people streaming out -->
          <g transform="translate(180 360)">
            <rect x="-80" y="-90" width="160" height="90" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <polygon points="-86,-90 0,-130 86,-90" fill="#241846" stroke="rgba(251,191,36,0.7)" stroke-width="1.2"/>
            <!-- Open city gate -->
            <path d="M -22 0 Q -22 -60 0 -60 Q 22 -60 22 0" fill="#0a0d1a" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
            <!-- Buildings inside -->
            <rect x="-60" y="-66" width="20" height="20" fill="rgba(251,191,36,0.5)"/>
            <rect x="40" y="-66" width="20" height="20" fill="rgba(251,191,36,0.5)"/>
          </g>
          <text x="180" y="252" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">SYCHAR</text>
          <!-- Road from town to the well -->
          <path d="M 240 400 Q 360 380 480 400 Q 540 410 580 410" stroke="rgba(254,243,199,0.55)" stroke-width="6" fill="none" stroke-dasharray="6 8"/>
          <!-- The well center-right -->
          <g transform="translate(620 400)">
            <ellipse cx="0" cy="0" rx="40" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-2" rx="30" ry="10" fill="#0a0d1a"/>
            <line x1="-32" y1="-22" x2="32" y2="-22" stroke="#3d2a16" stroke-width="2"/>
          </g>
          <!-- Jesus seated at the well -->
          <g transform="translate(660 370)">
            <path d="M -14 0 Q -12 -38 0 -48 Q 12 -38 14 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-56" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -7 -48 Q 0 -36 7 -48" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <circle cx="0" cy="-56" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- A LINE of Samaritans streaming from town to the well -->
          <g fill="#0a0d1a">
            <!-- Woman (leading, looking back over her shoulder) -->
            <g transform="translate(280 410)">
              <path d="M -12 0 Q -10 -30 0 -38 Q 10 -30 12 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
              <ellipse cx="0" cy="-44" rx="9" ry="11" fill="#1a1233"/>
              <path d="M -8 -50 Q 0 -60 8 -50" stroke="rgba(254,243,199,0.55)" stroke-width="1.4" fill="rgba(254,243,199,0.18)"/>
              <!-- Arm extended pointing toward Jesus -->
              <line x1="10" y1="-22" x2="28" y2="-30" stroke="#3d2a5e" stroke-width="4"/>
              <circle cx="0" cy="-44" r="16" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.3"/>
            </g>
            <!-- Followers, varying postures -->
            <g transform="translate(340 412)" fill="#0a0d1a"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(390 410)" fill="#0a0d1a"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(440 414)" fill="#0a0d1a"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(490 412)" fill="#0a0d1a"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(540 414)" fill="#0a0d1a"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <!-- More following behind her -->
            <g transform="translate(360 432)" fill="#0a0d1a" opacity="0.8"><ellipse cx="0" cy="0" rx="7" ry="18"/><ellipse cx="0" cy="-20" rx="6" ry="8"/></g>
            <g transform="translate(420 434)" fill="#0a0d1a" opacity="0.8"><ellipse cx="0" cy="0" rx="7" ry="18"/><ellipse cx="0" cy="-20" rx="6" ry="8"/></g>
            <g transform="translate(480 432)" fill="#0a0d1a" opacity="0.8"><ellipse cx="0" cy="0" rx="7" ry="18"/><ellipse cx="0" cy="-20" rx="6" ry="8"/></g>
          </g>
          <!-- Speech bubble from the woman -->
          <g transform="translate(320 320)">
            <rect x="-80" y="-22" width="160" height="36" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1" rx="5"/>
            <polygon points="-30,14 -42,28 -22,14" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <text x="0" y="-3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#3d2a16">"COME SEE A MAN</text>
            <text x="0" y="10" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="#3d2a16">WHO TOLD ME EVERYTHING"</text>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">Two days in a Samaritan town · many believed</text>
        </svg>`
      }
    ],
    closing: 'Jesus did not just break a social rule that day. He demolished it. A Jewish rabbi spoke to a Samaritan; a man spoke at length to a woman alone; a holy person spoke to someone every "decent" person had written off — and He treated her like the most important person in the conversation. The first person He clearly told "I am the Messiah" was not Peter, not a priest, not John the Baptist. It was a five-times-divorced woman drawing water at noon to avoid people who looked like His own disciples. He does not measure people the way the room does.',
    closingPrompt: 'Who is the person you would never be caught talking to — and what would it look like to ask them for a drink this week?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 37 — Zacchaeus
  // ════════════════════════════════════════════════════════════
  {
    id: 'zacchaeus',
    title: 'Zacchaeus',
    subtitle: 'A short, hated tax collector in a sycamore tree.',
    icon: '🌳',
    color: '#34d399',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'Luke 19:1-10',
    duration: '~5 min',
    scenes: [
      {
        id: 'sycamore',
        title: 'Up the Sycamore',
        scriptureRef: 'Luke 19:1-4',
        bibleText: '"He wanted to see who Jesus was, but because he was short he could not see over the crowd. So he ran ahead and climbed a sycamore-fig tree to see him."',
        narration: 'Zacchaeus was the chief tax collector in Jericho — the richest crook in town. The Romans had outsourced tax collection to local Jews who could squeeze their own people for whatever the traffic would bear, keep the surplus, and have Roman soldiers enforce it. He was hated. He was rich. He was also very short. When the rumor went out that Jesus was passing through, the streets filled. Zacchaeus could not see over the heads of the crowd, and no one was going to step aside for him. So he did something undignified. He hiked up his expensive robes and ran. He climbed a sycamore-fig tree.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'zs', skyTop:'#3d2a5e', skyMid:'#a78bfa', skyBot:'#fbbf24', stars:false})}
          <ellipse cx="660" cy="120" r="32" fill="#fef3c7"/>
          <ellipse cx="660" cy="120" r="50" fill="rgba(251,191,36,0.4)"/>
          <!-- Distant Jericho rooftops -->
          <g transform="translate(40 360)" opacity="0.7">
            <rect x="0" y="-30" width="60" height="30" fill="#3d2a16" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <polygon points="-6,-30 30,-50 66,-30" fill="#241846" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <rect x="64" y="-26" width="60" height="26" fill="#3d2a16" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <polygon points="58,-26 94,-44 130,-26" fill="#241846" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
          </g>
          <text x="100" y="320" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(251,191,36,0.65)">JERICHO</text>
          <!-- Ground / road -->
          <path d="M 0 380 Q 400 370 800 380 L 800 500 L 0 500 Z" fill="#3d2a16"/>
          <path d="M 0 440 Q 400 432 800 440 L 800 500 L 0 500 Z" fill="rgba(74,52,32,0.5)"/>
          <!-- BIG sycamore-fig tree on the right -->
          <g transform="translate(580 380)">
            <!-- Trunk -->
            <rect x="-12" y="-90" width="24" height="90" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="0.8"/>
            <!-- Lower branches sturdy -->
            <line x1="-6" y1="-50" x2="-50" y2="-90" stroke="#3d2a16" stroke-width="6"/>
            <line x1="6" y1="-60" x2="50" y2="-100" stroke="#3d2a16" stroke-width="6"/>
            <line x1="0" y1="-70" x2="0" y2="-120" stroke="#3d2a16" stroke-width="5"/>
            <line x1="-3" y1="-90" x2="-30" y2="-130" stroke="#3d2a16" stroke-width="4"/>
            <line x1="3" y1="-90" x2="30" y2="-130" stroke="#3d2a16" stroke-width="4"/>
            <!-- Foliage -->
            <ellipse cx="-30" cy="-100" rx="40" ry="32" fill="#1e1638"/>
            <ellipse cx="30" cy="-110" rx="40" ry="32" fill="#1e1638"/>
            <ellipse cx="0" cy="-140" rx="50" ry="32" fill="#241846"/>
            <!-- A few green leaf accents -->
            <g fill="rgba(34,197,94,0.7)">
              <ellipse cx="-40" cy="-110" rx="10" ry="5" transform="rotate(20 -40 -110)"/>
              <ellipse cx="36" cy="-122" rx="10" ry="5" transform="rotate(-20 36 -122)"/>
              <ellipse cx="-6" cy="-150" rx="10" ry="5"/>
              <ellipse cx="10" cy="-138" rx="9" ry="4" transform="rotate(20 10 -138)"/>
            </g>
            <!-- A few small figs -->
            <g fill="rgba(251,113,38,0.85)">
              <circle cx="-22" cy="-92" r="2.5"/>
              <circle cx="42" cy="-104" r="2.5"/>
              <circle cx="-8" cy="-130" r="2.5"/>
            </g>
          </g>
          <!-- Zacchaeus — short, bald, robed, perched on a sturdy branch -->
          <g transform="translate(560 280)">
            <!-- Body straddling branch -->
            <path d="M -14 16 Q -12 -20 0 -28 Q 12 -20 14 16 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-36" rx="11" ry="13" fill="#1a1233"/>
            <!-- Short beard -->
            <path d="M -6 -28 Q 0 -20 6 -28" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/>
            <!-- Bald-ish head — just a thin fringe of hair -->
            <path d="M -8 -42 Q -4 -46 0 -46 Q 4 -46 8 -42" stroke="#0a0d1a" stroke-width="1.5" fill="none"/>
            <!-- Both hands clutching the branch -->
            <line x1="-12" y1="-10" x2="-30" y2="-4" stroke="#3d2a5e" stroke-width="4"/>
            <line x1="12" y1="-10" x2="30" y2="-4" stroke="#3d2a5e" stroke-width="4"/>
            <!-- Legs dangling on either side of branch -->
            <line x1="-6" y1="16" x2="-14" y2="36" stroke="#3d2a5e" stroke-width="4"/>
            <line x1="6" y1="16" x2="14" y2="36" stroke="#3d2a5e" stroke-width="4"/>
            <!-- Halo dashed (curiosity, not yet faith) -->
            <circle cx="0" cy="-36" r="18" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1" stroke-dasharray="3 3"/>
          </g>
          <text x="560" y="232" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">ZACCHAEUS</text>
          <!-- The crowd thronging in foreground, can't see over heads -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(60 410)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(110 412)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(160 410)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(210 412)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(260 410)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(310 412)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(360 410)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(410 412)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(460 410)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(700 410)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
            <g transform="translate(750 412)"><ellipse cx="0" cy="0" rx="9" ry="22"/><ellipse cx="0" cy="-22" rx="8" ry="9"/></g>
          </g>
          <!-- Jesus approaching from left, head visible above crowd -->
          <g transform="translate(380 410)">
            <path d="M -16 0 Q -14 -42 0 -52 Q 14 -42 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-62" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -54 Q 0 -42 8 -54" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <circle cx="0" cy="-62" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
          </g>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">A grown man · in a tree</text>
        </svg>`
      },
      {
        id: 'called-by-name',
        title: 'Zacchaeus · Come Down',
        scriptureRef: 'Luke 19:5-7',
        bibleText: '"\'Zacchaeus, come down immediately. I must stay at your house today.\'"',
        narration: 'Jesus reached the bottom of the tree. The whole crowd was watching to see if He would shame the corrupt little man perched in the branches. He stopped. He looked up. He called him by name — though they had never met. "Zacchaeus. Come down. I must stay at your house today." The crowd gasped. Of all the houses in Jericho, that one? The pious Jews began to mutter: "He has gone to be the guest of a sinner." But Zacchaeus scrambled out of that tree like a man who had spent his whole life trying to climb something and finally been asked to come down.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'zc', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Ground -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="rgba(74,52,32,0.5)"/>
          <!-- Tree on the right -->
          <g transform="translate(580 400)">
            <rect x="-12" y="-110" width="24" height="110" fill="#3d2a16" stroke="rgba(251,191,36,0.65)" stroke-width="0.8"/>
            <ellipse cx="-30" cy="-120" rx="40" ry="32" fill="#1e1638"/>
            <ellipse cx="30" cy="-130" rx="40" ry="32" fill="#1e1638"/>
            <ellipse cx="0" cy="-160" rx="50" ry="32" fill="#241846"/>
            <line x1="6" y1="-80" x2="50" y2="-120" stroke="#3d2a16" stroke-width="6"/>
            <line x1="-6" y1="-70" x2="-50" y2="-110" stroke="#3d2a16" stroke-width="6"/>
          </g>
          <!-- Zacchaeus mid-climb-down — body sliding down the trunk, both arms wrapped around it -->
          <g transform="translate(580 340)">
            <ellipse cx="0" cy="0" rx="14" ry="20" fill="#3d2a5e" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="-2" cy="-22" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -8 -16 Q -2 -8 4 -16" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/>
            <!-- Both arms hugging the trunk -->
            <path d="M -10 -10 Q -16 0 -10 12" stroke="#3d2a5e" stroke-width="5" fill="none"/>
            <path d="M 10 -10 Q 16 0 10 12" stroke="#3d2a5e" stroke-width="5" fill="none"/>
            <!-- Legs sliding -->
            <line x1="-4" y1="20" x2="-6" y2="40" stroke="#3d2a5e" stroke-width="5"/>
            <line x1="4" y1="20" x2="6" y2="40" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Halo (brightening now) -->
            <circle cx="-2" cy="-22" r="18" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.3"/>
          </g>
          <!-- Jesus standing at the base of the tree, looking UP -->
          <g transform="translate(440 410)">
            <path d="M -16 0 Q -14 -50 0 -60 Q 14 -50 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-70" rx="12" ry="14" fill="#1a1233"/>
            <!-- Head tilted UP -->
            <path d="M -8 -68 Q 0 -56 8 -68" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <path d="M -10 -70 Q -16 -56 -12 -42 M 10 -70 Q 16 -56 12 -42" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Arm pointing UP at Zacchaeus -->
            <line x1="14" y1="-40" x2="46" y2="-72" stroke="#3d2a16" stroke-width="6"/>
            <line x1="46" y1="-72" x2="62" y2="-86" stroke="#3d2a16" stroke-width="5"/>
            <circle cx="0" cy="-70" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.7"/>
            <circle cx="0" cy="-70" r="38" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Crowd in foreground/mid, some shocked, some pointing -->
          <g fill="#0a0d1a">
            <g transform="translate(80 430)"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(130 432)"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <g transform="translate(180 430)"><ellipse cx="0" cy="0" rx="8" ry="20"/><ellipse cx="0" cy="-22" rx="7" ry="9"/></g>
            <!-- Two pointing at Zacchaeus, disapproving -->
            <g transform="translate(240 432)">
              <ellipse cx="0" cy="0" rx="8" ry="20"/>
              <ellipse cx="0" cy="-22" rx="7" ry="9"/>
              <line x1="6" y1="-14" x2="22" y2="-18" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(300 430)">
              <ellipse cx="0" cy="0" rx="8" ry="20"/>
              <ellipse cx="0" cy="-22" rx="7" ry="9"/>
              <line x1="6" y1="-14" x2="22" y2="-18" stroke="#0a0d1a" stroke-width="3"/>
            </g>
          </g>
          <!-- Speech bubble from Jesus -->
          <g transform="translate(440 220)">
            <rect x="-100" y="-30" width="200" height="46" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1" rx="5"/>
            <polygon points="40,16 32,30 52,16" fill="#fef3c7" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
            <text x="0" y="-10" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#3d2a16">"ZACCHAEUS, COME DOWN.</text>
            <text x="0" y="6" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="#3d2a16">I MUST STAY AT YOUR HOUSE TODAY"</text>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">He called him by name · though they had never met</text>
        </svg>`
      },
      {
        id: 'dinner-house',
        title: "Dinner at Zacchaeus's",
        scriptureRef: 'Luke 19:6-7',
        bibleText: '"So he came down at once and welcomed him gladly. All the people saw this and began to mutter, \'He has gone to be the guest of a sinner.\'"',
        narration: 'Zacchaeus walked Jesus home through a crowd that hated them both. He set out his finest food on his finest plates. The rabbi everyone wanted came to dinner at the house everyone avoided. Outside, the religious leaders muttered: "He has gone to be the guest of a sinner." Inside, something was breaking and reforming in the heart of the chief tax collector of Jericho. Halfway through the meal, he stood up.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'zd', skyTop:'#241846', skyMid:'#3d2a16', skyBot:'#1a1233', stars:false})}
          <!-- Interior of Zacchaeus's house — opulent -->
          <rect x="0" y="0" width="800" height="500" fill="#1a1233"/>
          <g fill="#3d2a16" opacity="0.7">
            <rect x="0" y="0" width="800" height="12"/>
            <rect x="0" y="100" width="800" height="6"/>
          </g>
          <!-- Hanging lamps -->
          <line x1="220" y1="0" x2="220" y2="60" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          <ellipse cx="220" cy="68" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
          <ellipse cx="220" cy="64" rx="6" ry="7" fill="#fbbf24"/>
          <line x1="580" y1="0" x2="580" y2="60" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          <ellipse cx="580" cy="68" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1"/>
          <ellipse cx="580" cy="64" rx="6" ry="7" fill="#fbbf24"/>
          <radialGradient id="zdLamp" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="rgba(251,113,38,0.25)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="320" rx="400" ry="180" fill="url(#zdLamp)"/>
          <!-- Lavish low table -->
          <g>
            <rect x="160" y="320" width="480" height="40" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <rect x="160" y="358" width="480" height="14" fill="#241846"/>
            <!-- Gold decoration along edge -->
            <line x1="160" y1="324" x2="640" y2="324" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Wine + bread + fruit -->
            <ellipse cx="240" cy="318" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <line x1="240" y1="312" x2="240" y2="300" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="320" cy="318" rx="16" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <ellipse cx="320" cy="312" rx="12" ry="3" fill="#fef3c7"/>
            <ellipse cx="400" cy="316" rx="18" ry="7" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <ellipse cx="400" cy="310" rx="14" ry="3" fill="#fef3c7"/>
            <ellipse cx="480" cy="318" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <line x1="480" y1="312" x2="480" y2="298" stroke="#3d2a16" stroke-width="2"/>
            <ellipse cx="560" cy="318" rx="16" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="0.8"/>
            <circle cx="552" cy="312" r="3" fill="rgba(120,20,20,0.85)"/>
            <circle cx="560" cy="310" r="3" fill="rgba(120,20,20,0.85)"/>
            <circle cx="568" cy="312" r="3" fill="rgba(251,191,36,0.85)"/>
          </g>
          <!-- Jesus center, hand raised in blessing/teaching -->
          <g transform="translate(400 320)">
            <path d="M -16 0 Q -14 -42 0 -52 Q 14 -42 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-62" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -54 Q 0 -42 8 -54" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Blessing hand raised -->
            <line x1="14" y1="-30" x2="32" y2="-50" stroke="#3d2a16" stroke-width="5"/>
            <circle cx="0" cy="-62" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <circle cx="0" cy="-62" r="36" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <!-- Zacchaeus on the right side, smaller, leaning forward, listening intently -->
          <g transform="translate(520 320)">
            <path d="M -14 0 Q -12 -36 0 -44 Q 12 -36 14 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-54" rx="10" ry="11" fill="#1a1233"/>
            <path d="M -6 -48 Q 0 -40 6 -48" stroke="rgba(254,243,199,0.5)" stroke-width="1.2" fill="none"/>
            <circle cx="0" cy="-54" r="16" fill="none" stroke="rgba(251,191,36,0.85)" stroke-width="1.3"/>
          </g>
          <!-- Disciples around (Peter, John, others) -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(260 320)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="9" ry="10"/></g>
            <g transform="translate(320 318)"><ellipse cx="0" cy="0" rx="11" ry="16"/><ellipse cx="0" cy="-22" rx="9" ry="10"/></g>
          </g>
          <!-- Outside the house through a window: muttering Pharisees pointing in disapproval -->
          <g transform="translate(720 220)">
            <!-- Window frame -->
            <rect x="-30" y="-40" width="60" height="80" fill="#0a0d1a" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <line x1="0" y1="-40" x2="0" y2="40" stroke="rgba(251,191,36,0.6)" stroke-width="0.8"/>
            <!-- Pharisees outside -->
            <g fill="#0a0d1a">
              <ellipse cx="-15" cy="14" rx="6" ry="14"/>
              <ellipse cx="-15" cy="4" rx="5" ry="6"/>
              <ellipse cx="15" cy="14" rx="6" ry="14"/>
              <ellipse cx="15" cy="4" rx="5" ry="6"/>
              <!-- Pointing in -->
              <line x1="9" y1="6" x2="-2" y2="-4" stroke="#0a0d1a" stroke-width="2"/>
            </g>
          </g>
          <!-- "GUEST OF A SINNER" muttering text outside window -->
          <text x="720" y="170" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(248,113,113,0.85)">"GUEST OF A SINNER"</text>
          <text x="400" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">The rabbi everyone wanted · at the house everyone avoided</text>
        </svg>`
      },
      {
        id: 'restitution',
        title: 'Four Times Over',
        scriptureRef: 'Luke 19:8-10',
        bibleText: '"Here and now I give half of my possessions to the poor, and if I have cheated anybody out of anything, I will pay back four times the amount."',
        narration: 'Zacchaeus stood up in the middle of dinner and said, in front of everybody — Jesus, the disciples, his own servants, the crowd still gathered outside the door: "Look, Lord. Here and now I give half of all I own to the poor. And if I have cheated anyone out of anything — I will pay back four times the amount." Four times. The Old Testament law required only that the thief restore what he had taken plus a fifth. Zacchaeus quadrupled it of his own accord. Jesus turned to the room. "Today salvation has come to this house. For the Son of Man came to seek and save the lost."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'zr', skyTop:'#a78bfa', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <!-- Glow filling the room -->
          <radialGradient id="zrGlory" cx="0.5" cy="0.4" r="0.55">
            <stop offset="0%" stop-color="rgba(254,243,199,0.5)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.18)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="280" rx="400" ry="240" fill="url(#zrGlory)"/>
          <!-- Floor -->
          <rect x="0" y="420" width="800" height="80" fill="#1a1233"/>
          <!-- Table -->
          <rect x="180" y="360" width="440" height="32" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
          <rect x="180" y="388" width="440" height="14" fill="#241846"/>
          <!-- Zacchaeus standing UP from his seat, gesturing in declaration -->
          <g transform="translate(540 360)">
            <path d="M -16 0 Q -14 -50 0 -60 Q 14 -50 16 0 Z" fill="#3d2a5e" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
            <ellipse cx="0" cy="-70" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -6 -62 Q 0 -52 6 -62" stroke="rgba(254,243,199,0.55)" stroke-width="1.3" fill="none"/>
            <!-- Both arms thrown outward in declaration -->
            <line x1="-14" y1="-36" x2="-36" y2="-50" stroke="#3d2a5e" stroke-width="5"/>
            <line x1="14" y1="-36" x2="36" y2="-50" stroke="#3d2a5e" stroke-width="5"/>
            <!-- Big halo (transformation) -->
            <circle cx="0" cy="-70" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.7"/>
            <circle cx="0" cy="-70" r="36" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Coins/money bags scattered between Zacchaeus and the recipients (poor people at the door) -->
          <g>
            <!-- Money bags being thrown forward -->
            <g transform="translate(440 410)">
              <ellipse cx="0" cy="0" rx="14" ry="11" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1"/>
              <line x1="-6" y1="-10" x2="6" y2="-10" stroke="rgba(254,243,199,0.7)" stroke-width="1.2"/>
              <text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" fill="rgba(251,191,36,0.95)">$</text>
            </g>
            <g transform="translate(380 416)">
              <ellipse cx="0" cy="0" rx="12" ry="10" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1"/>
              <text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" fill="rgba(251,191,36,0.95)">$</text>
            </g>
            <g transform="translate(320 412)">
              <ellipse cx="0" cy="0" rx="14" ry="11" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1"/>
              <text x="0" y="3" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" fill="rgba(251,191,36,0.95)">$</text>
            </g>
            <!-- Loose coins -->
            <g fill="rgba(251,191,36,0.95)">
              <circle cx="260" cy="418" r="3"/>
              <circle cx="278" cy="422" r="3"/>
              <circle cx="464" cy="422" r="3"/>
              <circle cx="500" cy="420" r="3"/>
            </g>
          </g>
          <!-- Jesus seated, watching with a small smile, hand resting on knee -->
          <g transform="translate(360 360)">
            <path d="M -16 0 Q -14 -42 0 -52 Q 14 -42 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-62" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -54 Q 0 -42 8 -54" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Subtle smile -->
            <path d="M -4 -50 Q 0 -48 4 -50" stroke="rgba(254,243,199,0.7)" stroke-width="0.9" fill="none"/>
            <circle cx="0" cy="-62" r="24" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <circle cx="0" cy="-62" r="38" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          </g>
          <!-- Poor people receiving — at the left edge, smaller, hands extended -->
          <g fill="#1a1233" opacity="0.85">
            <g transform="translate(100 430)">
              <ellipse cx="0" cy="0" rx="9" ry="20"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="8" y1="-12" x2="22" y2="-2" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(160 432)">
              <ellipse cx="0" cy="0" rx="9" ry="20"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="8" y1="-12" x2="22" y2="-2" stroke="#1a1233" stroke-width="3"/>
            </g>
            <g transform="translate(220 430)">
              <ellipse cx="0" cy="0" rx="9" ry="20"/>
              <ellipse cx="0" cy="-22" rx="8" ry="9"/>
              <line x1="8" y1="-12" x2="22" y2="-2" stroke="#1a1233" stroke-width="3"/>
            </g>
          </g>
          <!-- Banner: "4X" -->
          <text x="400" y="80" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="32" letter-spacing="8" fill="rgba(251,191,36,0.95)">"FOUR TIMES OVER"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Today salvation has come to this house"</text>
        </svg>`
      }
    ],
    closing: 'Jesus did not lecture Zacchaeus into giving back the money. He did not threaten him. He did not even bring it up. He invited Himself to dinner. The repentance was Zacchaeus\'s idea. That is the order things often happen in: kindness comes first, repentance follows. The Lord is not waiting for you to clean up before He invites Himself in. He is happy to come into the mess and let the cleaning be the natural overflow of the meal.',
    closingPrompt: 'Where in your life have you been waiting to "fix things first" before letting Jesus in — and what would it look like to just invite Him to dinner anyway?'
  },

  // ════════════════════════════════════════════════════════════
  // STORY 38 — Healing the Man Born Blind
  // ════════════════════════════════════════════════════════════
  {
    id: 'blind-man',
    title: 'The Man Born Blind',
    subtitle: 'Mud · spit · Siloam. "Once I was blind. Now I see."',
    icon: '👁️',
    color: '#fbbf24',
    accentColor: '#fef3c7',
    era: 'new-testament',
    scriptureRef: 'John 9',
    duration: '~6 min',
    scenes: [
      {
        id: 'blind-begging',
        title: 'Born Blind',
        scriptureRef: 'John 9:1-3',
        bibleText: '"\'Rabbi, who sinned, this man or his parents, that he was born blind?\' \'Neither this man nor his parents sinned,\' said Jesus. \'This happened so that the works of God might be displayed in him.\'"',
        narration: 'He had been blind since birth. He sat outside the temple gates day after day with his cloak spread out beside him, hoping for a coin. Everyone in Jerusalem walked past him. The disciples did too — and then stopped to ask Jesus a theological question. "Rabbi, who sinned — this man or his parents — that he was born blind?" Jesus said neither. "He was born this way so the works of God might be displayed in him."',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'bb', skyTop:'#3d2a5e', skyMid:'#fbbf24', skyBot:'#fef3c7', stars:false})}
          <ellipse cx="660" cy="120" r="32" fill="#fef3c7"/>
          <ellipse cx="660" cy="120" r="50" fill="rgba(251,191,36,0.4)"/>
          <!-- Temple wall in the background, stone columns -->
          <g fill="#0a0d1a" stroke="rgba(251,191,36,0.65)" stroke-width="1">
            <rect x="0" y="160" width="800" height="200"/>
            <rect x="100" y="180" width="22" height="180"/>
            <rect x="200" y="180" width="22" height="180"/>
            <rect x="300" y="180" width="22" height="180"/>
            <rect x="500" y="180" width="22" height="180"/>
            <rect x="600" y="180" width="22" height="180"/>
            <rect x="700" y="180" width="22" height="180"/>
            <!-- Roof line -->
            <rect x="0" y="150" width="800" height="14" fill="#3d2a16"/>
          </g>
          <!-- Gate centered behind -->
          <path d="M 380 360 Q 380 220 400 220 Q 420 220 420 360" fill="#000a14" stroke="rgba(251,191,36,0.85)" stroke-width="1.4"/>
          <!-- Stone steps in foreground -->
          <rect x="0" y="360" width="800" height="20" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="0.8"/>
          <rect x="0" y="380" width="800" height="20" fill="#241846"/>
          <rect x="0" y="400" width="800" height="20" fill="#0a0d1a"/>
          <!-- Blind man sitting on lowest step, head tilted up, eyes closed/empty -->
          <g transform="translate(220 420)">
            <!-- Sitting body -->
            <ellipse cx="0" cy="0" rx="24" ry="14" fill="#1a1233" stroke="rgba(254,243,199,0.5)" stroke-width="0.8"/>
            <ellipse cx="0" cy="-26" rx="14" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-54" rx="11" ry="13" fill="#1a1233"/>
            <!-- Head tilted up slightly -->
            <path d="M -8 -50 Q 0 -38 8 -50" stroke="rgba(254,243,199,0.55)" stroke-width="1.3" fill="none"/>
            <!-- Empty eyes — no iris (just dark sockets with faint white) -->
            <line x1="-5" y1="-58" x2="-1" y2="-58" stroke="rgba(254,243,199,0.7)" stroke-width="1.4"/>
            <line x1="1" y1="-58" x2="5" y2="-58" stroke="rgba(254,243,199,0.7)" stroke-width="1.4"/>
            <!-- Outstretched hand for alms -->
            <line x1="-14" y1="-30" x2="-36" y2="-22" stroke="#1a1233" stroke-width="4"/>
            <ellipse cx="-40" cy="-20" rx="6" ry="4" fill="#1a1233"/>
            <!-- Begging bowl with a few coins -->
            <ellipse cx="-44" cy="-8" rx="14" ry="6" fill="#3d2a16" stroke="rgba(251,191,36,0.7)" stroke-width="1"/>
            <ellipse cx="-44" cy="-12" rx="8" ry="2" fill="rgba(251,191,36,0.8)"/>
            <!-- Faded halo (his identity matters, just barely visible) -->
            <circle cx="0" cy="-54" r="18" fill="none" stroke="rgba(251,191,36,0.45)" stroke-width="1" stroke-dasharray="2 3"/>
          </g>
          <text x="220" y="370" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(254,243,199,0.65)">BLIND · FROM BIRTH</text>
          <!-- Jesus and disciples approaching from right -->
          <g transform="translate(540 410)">
            <path d="M -14 0 Q -12 -44 0 -54 Q 12 -44 14 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-64" rx="11" ry="13" fill="#1a1233"/>
            <path d="M -7 -56 Q 0 -44 7 -56" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Looking at the man (head turned slightly toward viewer-left) -->
            <line x1="-10" y1="-30" x2="-28" y2="-22" stroke="#3d2a16" stroke-width="4"/>
            <circle cx="0" cy="-64" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
          </g>
          <!-- Disciples right behind, pointing at the man -->
          <g fill="#0a0d1a" opacity="0.85">
            <g transform="translate(620 412)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-26" rx="8" ry="9"/>
              <line x1="-8" y1="-16" x2="-26" y2="-12" stroke="#0a0d1a" stroke-width="3"/>
            </g>
            <g transform="translate(680 414)">
              <ellipse cx="0" cy="0" rx="9" ry="24"/>
              <ellipse cx="0" cy="-26" rx="8" ry="9"/>
            </g>
          </g>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"That the works of God might be displayed in him"</text>
        </svg>`
      },
      {
        id: 'mud-eyes',
        title: 'Mud on the Eyes',
        scriptureRef: 'John 9:6-7',
        bibleText: '"He spit on the ground, made some mud with the saliva, and put it on the man\'s eyes. \'Go,\' he told him, \'wash in the Pool of Siloam.\'"',
        narration: 'Jesus did something the man could not see but absolutely could feel. He bent down, spat on the dust between His sandals, and worked the spit into the dust until it became mud. Then He pressed the mud onto the man\'s closed eyes. Slimy. Cool. Strange. "Go," Jesus said. "Wash in the Pool of Siloam." It was about a quarter mile away. The blind man stood up — without a guide, without his cloak of coins, mud caked on his face — and started walking.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'bm', skyTop:'#fbbf24', skyMid:'#fef3c7', skyBot:'#3d2a16', stars:false})}
          <ellipse cx="660" cy="100" r="34" fill="#fef3c7"/>
          <!-- Step / ground -->
          <rect x="0" y="380" width="800" height="120" fill="#3d2a16"/>
          <rect x="0" y="440" width="800" height="60" fill="#241846"/>
          <!-- Jesus kneeling on one knee in front of the blind man -->
          <g transform="translate(400 410)">
            <!-- Bent leg -->
            <ellipse cx="0" cy="0" rx="34" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Upper body -->
            <ellipse cx="0" cy="-26" rx="18" ry="24" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <ellipse cx="0" cy="-58" rx="12" ry="14" fill="#1a1233"/>
            <path d="M -8 -50 Q 0 -38 8 -50" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Right arm reaching FORWARD, palm extended (applying mud to man's eyes) -->
            <line x1="14" y1="-32" x2="60" y2="-18" stroke="#3d2a16" stroke-width="6"/>
            <ellipse cx="64" cy="-18" rx="6" ry="4" fill="#3d2a16"/>
            <!-- Halo big and bright -->
            <circle cx="0" cy="-58" r="26" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.7"/>
            <circle cx="0" cy="-58" r="40" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Pool of spit in front of Jesus, becoming mud — small wet patch -->
          <g transform="translate(440 432)">
            <ellipse cx="0" cy="0" rx="14" ry="5" fill="rgba(74,52,32,0.85)"/>
            <ellipse cx="0" cy="-1" rx="9" ry="3" fill="rgba(74,52,32,0.95)"/>
          </g>
          <!-- The blind man seated in front of Jesus, head tilted back, Jesus's hand on his face -->
          <g transform="translate(540 420)">
            <ellipse cx="0" cy="0" rx="22" ry="12" fill="#1a1233" stroke="rgba(254,243,199,0.45)" stroke-width="0.8"/>
            <ellipse cx="0" cy="-24" rx="14" ry="22" fill="#1a1233"/>
            <ellipse cx="0" cy="-50" rx="11" ry="13" fill="#1a1233"/>
            <!-- MUD applied — brown smear across the eye area -->
            <ellipse cx="0" cy="-55" rx="10" ry="3" fill="rgba(74,52,32,0.95)"/>
            <!-- A little drip down the cheek -->
            <line x1="-5" y1="-50" x2="-5" y2="-44" stroke="rgba(74,52,32,0.85)" stroke-width="1.2"/>
            <!-- Beard -->
            <path d="M -7 -42 Q 0 -32 7 -42" stroke="rgba(254,243,199,0.55)" stroke-width="1.3" fill="none"/>
            <!-- Hands resting on knees (passive, being healed) -->
            <line x1="-12" y1="-22" x2="-22" y2="-6" stroke="#1a1233" stroke-width="3"/>
            <line x1="12" y1="-22" x2="22" y2="-6" stroke="#1a1233" stroke-width="3"/>
            <!-- Halo starting to brighten -->
            <circle cx="0" cy="-50" r="20" fill="none" stroke="rgba(251,191,36,0.75)" stroke-width="1.3"/>
          </g>
          <!-- Subtle motion lines around Jesus's hand showing it just made contact -->
          <g stroke="rgba(254,243,199,0.5)" stroke-width="1" fill="none">
            <path d="M 472 -10 + 470 -10" />
            <path d="M 488 -20 Q 496 -16 504 -20"/>
          </g>
          <!-- Sign / arrow toward "Pool of Siloam" -->
          <g transform="translate(180 380)">
            <line x1="0" y1="0" x2="-40" y2="0" stroke="rgba(254,243,199,0.85)" stroke-width="2"/>
            <polygon points="-40,-4 -40,4 -50,0" fill="rgba(254,243,199,0.85)"/>
          </g>
          <text x="100" y="376" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2.5" fill="rgba(251,191,36,0.85)">→ POOL OF SILOAM</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.85)">"Go · wash in the Pool of Siloam"</text>
        </svg>`
      },
      {
        id: 'sees',
        title: 'He Washed · He Came Back Seeing',
        scriptureRef: 'John 9:7',
        bibleText: '"So the man went and washed, and came home seeing."',
        narration: 'He found the pool. He knelt down. He cupped his hands and brought the cool water up to his face — washing the mud away. The first thing he saw, in all his life, was sunlight on water. The second was his own hands. The third was the sky. He stood up. The world he had only ever heard about for thirty-some years — the colors, the depth, the faces — was suddenly in front of him. He walked home looking at everything.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          <defs>
            <linearGradient id="bsSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a78bfa"/>
              <stop offset="50%" stop-color="#fef3c7"/>
              <stop offset="100%" stop-color="#fbbf24"/>
            </linearGradient>
            <radialGradient id="bsGlory" cx="0.5" cy="0.4" r="0.55">
              <stop offset="0%" stop-color="rgba(254,243,199,0.7)"/>
              <stop offset="55%" stop-color="rgba(251,191,36,0.25)"/>
              <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#bsSky)"/>
          <ellipse cx="400" cy="240" rx="420" ry="240" fill="url(#bsGlory)"/>
          <!-- Sun -->
          <circle cx="640" cy="100" r="40" fill="#fef3c7"/>
          <circle cx="640" cy="100" r="60" fill="rgba(251,191,36,0.5)"/>
          <!-- The Pool of Siloam — bright, glowing, with steps leading down -->
          <g transform="translate(300 400)">
            <!-- Stone pool -->
            <rect x="-160" y="-30" width="320" height="100" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.4"/>
            <!-- Steps leading into water -->
            <rect x="-150" y="-22" width="300" height="12" fill="#241846"/>
            <rect x="-130" y="-14" width="260" height="10" fill="rgba(56,189,248,0.75)"/>
            <!-- Water -->
            <rect x="-130" y="-4" width="260" height="60" fill="rgba(56,189,248,0.85)"/>
            <!-- Ripples + shimmer -->
            <g fill="rgba(254,243,199,0.85)">
              <ellipse cx="-60" cy="8" rx="22" ry="2"/>
              <ellipse cx="60" cy="20" rx="22" ry="2"/>
              <ellipse cx="0" cy="36" rx="22" ry="2"/>
            </g>
          </g>
          <!-- Man kneeling at the edge of the pool, water dripping from his face -->
          <g transform="translate(300 360)">
            <!-- Kneeling body -->
            <ellipse cx="0" cy="0" rx="24" ry="14" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-26" rx="16" ry="22" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="0" cy="-54" rx="12" ry="14" fill="#1a1233"/>
            <!-- CLEAN OPEN EYES — wide circles with bright irises -->
            <ellipse cx="-5" cy="-56" rx="3" ry="3" fill="#fef3c7"/>
            <ellipse cx="5" cy="-56" rx="3" ry="3" fill="#fef3c7"/>
            <circle cx="-5" cy="-56" r="1.5" fill="rgba(56,189,248,0.95)"/>
            <circle cx="5" cy="-56" r="1.5" fill="rgba(56,189,248,0.95)"/>
            <!-- Mouth opened wide in wonder -->
            <ellipse cx="0" cy="-46" rx="2.5" ry="3.5" fill="rgba(254,243,199,0.85)"/>
            <!-- Beard -->
            <path d="M -7 -42 Q 0 -32 7 -42" stroke="rgba(254,243,199,0.6)" stroke-width="1.4" fill="none"/>
            <!-- Both hands raised, water dripping -->
            <line x1="-14" y1="-30" x2="-22" y2="-50" stroke="#3d2a16" stroke-width="4"/>
            <line x1="14" y1="-30" x2="22" y2="-50" stroke="#3d2a16" stroke-width="4"/>
            <ellipse cx="-22" cy="-52" rx="4" ry="3" fill="#3d2a16"/>
            <ellipse cx="22" cy="-52" rx="4" ry="3" fill="#3d2a16"/>
            <!-- Water droplets falling from hands and face -->
            <g fill="rgba(56,189,248,0.85)">
              <circle cx="-20" cy="-42" r="2"/>
              <circle cx="-16" cy="-30" r="1.5"/>
              <circle cx="20" cy="-42" r="2"/>
              <circle cx="16" cy="-30" r="1.5"/>
              <circle cx="-4" cy="-40" r="1.5"/>
              <circle cx="4" cy="-38" r="1.5"/>
            </g>
            <!-- HUGE radiant halo -->
            <circle cx="0" cy="-54" r="32" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-54" r="46" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- "I CAN SEE" banner -->
          <text x="600" y="220" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="28" letter-spacing="6" fill="rgba(251,191,36,0.95)">"I CAN SEE!"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">He came home · seeing</text>
        </svg>`
      },
      {
        id: 'one-thing',
        title: 'One Thing I Know',
        scriptureRef: 'John 9:24-25 · 38',
        bibleText: '"\'Whether he is a sinner or not, I don\'t know. One thing I do know. I was blind but now I see!\'" …"Then the man said, \'Lord, I believe,\' and he worshiped him."',
        narration: 'The Pharisees interrogated him. "This Jesus is a sinner. Tell the truth." The man said, "I don\'t know if he\'s a sinner. I know one thing. I was blind, and now I see." They tried again. He said, "If this man were not from God, he could do nothing." They threw him out of the synagogue. Jesus heard, found him, and asked, "Do you believe in the Son of Man?" "Who is he, Lord, that I may believe?" "You have now seen him. The one speaking with you is he." The man said, "Lord, I believe." And he fell down and worshiped Him.',
        svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
          ${_bsBackdrop({idPrefix:'bot', skyTop:'#1e1846', skyMid:'#3d2a5e', skyBot:'#5a4378', stars:false})}
          <!-- Soft glow centered on the man and Jesus -->
          <radialGradient id="botGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="rgba(254,243,199,0.55)"/>
            <stop offset="55%" stop-color="rgba(251,191,36,0.2)"/>
            <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
          </radialGradient>
          <ellipse cx="400" cy="320" rx="380" ry="220" fill="url(#botGlow)"/>
          <!-- Ground -->
          <path d="M 0 400 Q 400 388 800 400 L 800 500 L 0 500 Z" fill="#1a1233"/>
          <!-- Pharisees in the BACKGROUND, on the left, with arms crossed, having just thrown him out -->
          <g transform="translate(120 380)" opacity="0.7">
            <ellipse cx="0" cy="0" rx="11" ry="32" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-34" rx="10" ry="12" fill="#0a0d1a"/>
            <path d="M -7 -26 Q 0 -10 7 -26" stroke="rgba(254,243,199,0.55)" stroke-width="1.3" fill="none"/>
            <!-- Pointy hat -->
            <polygon points="-9,-46 9,-46 0,-60" fill="#3d2a5e" stroke="rgba(251,191,36,0.55)" stroke-width="0.7"/>
            <!-- Arms crossed -->
            <path d="M -12 -18 Q 0 -10 12 -18" stroke="#0a0d1a" stroke-width="4" fill="none"/>
          </g>
          <g transform="translate(180 384)" opacity="0.7">
            <ellipse cx="0" cy="0" rx="11" ry="32" fill="#0a0d1a"/>
            <ellipse cx="0" cy="-34" rx="10" ry="12" fill="#0a0d1a"/>
            <polygon points="-9,-46 9,-46 0,-60" fill="#3d2a5e" stroke="rgba(251,191,36,0.55)" stroke-width="0.7"/>
            <path d="M -12 -18 Q 0 -10 12 -18" stroke="#0a0d1a" stroke-width="4" fill="none"/>
          </g>
          <text x="150" y="328" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="2" fill="rgba(248,113,113,0.65)">CAST OUT</text>
          <!-- THE MAN — kneeling, FACE DOWN in worship, in front of Jesus -->
          <g transform="translate(400 430)">
            <ellipse cx="0" cy="0" rx="40" ry="12" fill="#3d2a16" stroke="rgba(251,191,36,0.85)" stroke-width="1.2"/>
            <ellipse cx="-32" cy="-6" rx="12" ry="14" fill="#1a1233"/>
            <!-- Open eyes -->
            <ellipse cx="-36" cy="-10" rx="2" ry="2.5" fill="#fef3c7"/>
            <ellipse cx="-28" cy="-10" rx="2" ry="2.5" fill="#fef3c7"/>
            <!-- Both arms thrown FORWARD on the ground in prostration -->
            <line x1="-20" y1="-2" x2="22" y2="-6" stroke="#3d2a16" stroke-width="5"/>
            <line x1="-20" y1="4" x2="22" y2="0" stroke="#3d2a16" stroke-width="5"/>
            <!-- Halo bright -->
            <circle cx="-32" cy="-6" r="22" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="1.5"/>
            <circle cx="-32" cy="-6" r="34" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
          </g>
          <!-- Jesus standing in front of the man, hand extended IN BLESSING -->
          <g transform="translate(520 360)">
            <path d="M -16 0 Q -14 -54 0 -64 Q 14 -54 16 0 Z" fill="#3d2a16" stroke="rgba(251,191,36,0.95)" stroke-width="1.6"/>
            <ellipse cx="0" cy="-74" rx="13" ry="15" fill="#1a1233"/>
            <path d="M -8 -66 Q 0 -54 8 -66" stroke="rgba(254,243,199,0.65)" stroke-width="1.5" fill="none"/>
            <path d="M -10 -74 Q -16 -60 -12 -44 M 10 -74 Q 16 -60 12 -44" stroke="#0a0d1a" stroke-width="2" fill="none"/>
            <!-- Hand extended DOWN toward the kneeling man -->
            <line x1="-14" y1="-36" x2="-44" y2="-14" stroke="#3d2a16" stroke-width="6"/>
            <!-- Massive halo -->
            <circle cx="0" cy="-74" r="30" fill="none" stroke="rgba(251,191,36,0.95)" stroke-width="2"/>
            <circle cx="0" cy="-74" r="46" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.2"/>
          </g>
          <!-- Big "ONE THING I KNOW" banner -->
          <text x="400" y="80" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="24" letter-spacing="6" fill="rgba(251,191,36,0.95)">"ONE THING I KNOW"</text>
          <text x="400" y="120" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="18" letter-spacing="5" fill="rgba(254,243,199,0.85)">"I WAS BLIND · NOW I SEE"</text>
          <text x="400" y="478" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="rgba(254,243,199,0.95)">"Lord, I believe" · and he worshiped Him</text>
        </svg>`
      }
    ],
    closing: 'The Pharisees had every theological credential and could not see what was standing in front of them. The man had been blind from birth, knew nothing about Scripture, could not argue with them — and yet he saw exactly who Jesus was. You do not need a Bible degree to know the Lord. You need the experience of being touched by Him in your own real life. "One thing I know" is enough.',
    closingPrompt: 'What is your "one thing I know" — the moment in your life that you cannot explain away and would not trade for any argument the world has made against your faith?'
  },

];

if (typeof window !== 'undefined') {
  window.BIBLE_STORIES = BIBLE_STORIES;
}
