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

];

if (typeof window !== 'undefined') {
  window.BIBLE_STORIES = BIBLE_STORIES;
}
