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

];

if (typeof window !== 'undefined') {
  window.BIBLE_STORIES = BIBLE_STORIES;
}
