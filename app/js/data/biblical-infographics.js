/* =============================================================
   biblical-infographics.js — Hand-coded SVG diagrams for Bible
   Lands site + discovery profiles (F4-E)

   Architectural-blueprint aesthetic:
     - Deep navy backdrop with subtle grid
     - Gold/cream line work (matches the timeline cathedral feel)
     - Bebas Neue labels with letter-spacing
     - All hand-drawn — no licensed photos, no rasters

   Keyed by site or discovery id. Looked up at render time by
   openBwSite (sites) and openBwDiscovery (discoveries).
============================================================= */

const BIBLICAL_INFOGRAPHICS = {

  // ── TABERNACLE LAYOUT (attached to Mount Sinai site) ──────
  'mt-sinai': {
    title: 'Tabernacle of Moses · Floor Plan',
    caption: 'The portable sanctuary built at Sinai (Exodus 25-40). 100×50 cubits. The Holy of Holies — westernmost — held the Ark.',
    svg: `<svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
  <defs>
    <pattern id="tabGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(251,191,36,0.06)" stroke-width="0.5"/>
    </pattern>
    <linearGradient id="tabBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0d1a"/>
      <stop offset="100%" stop-color="#1a1233"/>
    </linearGradient>
    <radialGradient id="tabHohGlow" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0%" stop-color="rgba(251,191,36,0.32)"/>
      <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="420" fill="url(#tabBg)"/>
  <rect width="800" height="420" fill="url(#tabGrid)"/>

  <!-- Outer Court (100x50 cubits) -->
  <g stroke="#fef3c7" stroke-width="2" fill="none">
    <rect x="60" y="80" width="680" height="280" rx="3"/>
  </g>
  <text x="400" y="55" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="6" fill="#fef3c7">OUTER COURT — 100 × 50 CUBITS</text>

  <!-- East entry curtain (right side, opening) -->
  <g stroke="#fbbf24" stroke-width="2" fill="none" stroke-dasharray="5 4">
    <line x1="740" y1="190" x2="740" y2="250"/>
  </g>
  <text x="755" y="225" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fbbf24">↓ EAST</text>
  <text x="755" y="240" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fbbf24">ENTRY</text>

  <!-- Bronze Altar -->
  <g>
    <rect x="540" y="180" width="70" height="70" fill="rgba(214,114,38,0.12)" stroke="#fb923c" stroke-width="2"/>
    <line x1="540" y1="215" x2="610" y2="215" stroke="#fb923c" stroke-width="0.7" opacity="0.6"/>
    <line x1="575" y1="180" x2="575" y2="250" stroke="#fb923c" stroke-width="0.7" opacity="0.6"/>
    <text x="575" y="270" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" letter-spacing="2" fill="#fb923c">BRONZE ALTAR</text>
    <text x="575" y="285" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">Burnt offerings</text>
  </g>

  <!-- Bronze Laver -->
  <g>
    <circle cx="430" cy="215" r="22" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="430" cy="215" r="14" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.6"/>
    <text x="430" y="265" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" letter-spacing="2" fill="#38bdf8">LAVER</text>
    <text x="430" y="278" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">Ritual washing</text>
  </g>

  <!-- The Tent (Tabernacle proper) -->
  <g stroke="#a78bfa" stroke-width="2.5" fill="none">
    <rect x="80" y="155" width="260" height="130" rx="2"/>
  </g>
  <!-- Veil between Holy Place and Holy of Holies -->
  <line x1="170" y1="155" x2="170" y2="285" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="172" y="148" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="#fbbf24">VEIL</text>

  <!-- Holy of Holies glow + Ark -->
  <rect x="80" y="155" width="90" height="130" fill="url(#tabHohGlow)"/>
  <g>
    <rect x="105" y="200" width="40" height="40" fill="#fbbf24" opacity="0.85"/>
    <rect x="103" y="195" width="44" height="8" fill="#fef3c7"/>
    <!-- Cherubim wings symbolic -->
    <path d="M 108 195 Q 110 188 116 192 Q 118 188 122 192" stroke="#0a0d1a" stroke-width="1.2" fill="none"/>
    <path d="M 144 195 Q 142 188 136 192 Q 134 188 130 192" stroke="#0a0d1a" stroke-width="1.2" fill="none"/>
    <text x="125" y="259" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fbbf24">ARK OF THE</text>
    <text x="125" y="272" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fbbf24">COVENANT</text>
  </g>
  <text x="125" y="148" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="#fef3c7">HOLY OF HOLIES</text>

  <!-- Holy Place -->
  <text x="255" y="148" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="#fef3c7">HOLY PLACE</text>

  <!-- Table of Showbread (north) -->
  <g>
    <rect x="190" y="170" width="42" height="20" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="211" y="166" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="1.5" fill="#fbbf24">TABLE OF SHOWBREAD</text>
  </g>

  <!-- Lampstand / Menorah (south) -->
  <g transform="translate(211, 248)">
    <line x1="0" y1="0" x2="0" y2="-22" stroke="#fbbf24" stroke-width="2"/>
    <path d="M -18 -10 Q -18 -22 0 -22 M -10 -10 Q -10 -22 0 -22 M 10 -10 Q 10 -22 0 -22 M 18 -10 Q 18 -22 0 -22" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <circle cx="-18" cy="-22" r="2" fill="#fef3c7"/>
    <circle cx="-10" cy="-22" r="2" fill="#fef3c7"/>
    <circle cx="0"   cy="-22" r="2" fill="#fef3c7"/>
    <circle cx="10"  cy="-22" r="2" fill="#fef3c7"/>
    <circle cx="18"  cy="-22" r="2" fill="#fef3c7"/>
    <line x1="-5" y1="0" x2="5" y2="0" stroke="#fbbf24" stroke-width="2"/>
    <text x="0" y="14" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="1.5" fill="#fbbf24">LAMPSTAND</text>
  </g>

  <!-- Altar of Incense (east of veil, near entry to Holy of Holies) -->
  <g>
    <rect x="263" y="208" width="22" height="22" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" stroke-width="1.5"/>
    <text x="274" y="246" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="1.5" fill="#a78bfa">INCENSE ALTAR</text>
  </g>

  <!-- North/South compass -->
  <g transform="translate(60, 380)">
    <text font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="#94a3b8">NORTH ↑   WEST ←   EAST →   SOUTH ↓</text>
  </g>
</svg>`,
  },

  // ── SOLOMON'S TEMPLE (attached to Temple Mount) ───────────
  'temple-mount': {
    title: "Solomon's Temple · Floor Plan",
    caption: "Built ~957 BC on Mount Moriah (1 Kings 6). Three chambers — vestibule, holy place, holy of holies — flanked by twin bronze pillars Jachin and Boaz.",
    svg: `<svg viewBox="0 0 800 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
  <defs>
    <pattern id="solGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(251,191,36,0.06)" stroke-width="0.5"/>
    </pattern>
    <linearGradient id="solBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0d1a"/>
      <stop offset="100%" stop-color="#1a1233"/>
    </linearGradient>
    <radialGradient id="solDevirGlow" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="rgba(251,191,36,0.42)"/>
      <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
    </radialGradient>
  </defs>

  <rect width="800" height="460" fill="url(#solBg)"/>
  <rect width="800" height="460" fill="url(#solGrid)"/>

  <text x="400" y="38" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="6" fill="#fef3c7">SOLOMON'S TEMPLE — 60 × 20 CUBITS</text>
  <text x="400" y="58" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="#94a3b8">~957 BC · 1 Kings 6 · Mount Moriah</text>

  <!-- Outer court walls (suggested) -->
  <g stroke="rgba(254,243,199,0.25)" stroke-width="1.5" fill="none" stroke-dasharray="8 6">
    <rect x="50" y="100" width="700" height="320"/>
  </g>
  <text x="60" y="118" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2.5" fill="rgba(254,243,199,0.4)">OUTER COURT</text>

  <!-- Bronze Sea -->
  <g>
    <circle cx="600" cy="220" r="36" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="600" cy="220" r="28" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.55"/>
    <!-- 12 oxen suggestion (4 cardinal points) -->
    <circle cx="600" cy="184" r="3" fill="#38bdf8"/>
    <circle cx="600" cy="256" r="3" fill="#38bdf8"/>
    <circle cx="564" cy="220" r="3" fill="#38bdf8"/>
    <circle cx="636" cy="220" r="3" fill="#38bdf8"/>
    <text x="600" y="278" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="2" fill="#38bdf8">BRONZE SEA</text>
    <text x="600" y="291" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">on 12 oxen</text>
  </g>

  <!-- Altar of Burnt Offering -->
  <g>
    <rect x="540" y="320" width="60" height="60" fill="rgba(214,114,38,0.14)" stroke="#fb923c" stroke-width="2"/>
    <line x1="540" y1="350" x2="600" y2="350" stroke="#fb923c" stroke-width="0.8" opacity="0.6"/>
    <line x1="570" y1="320" x2="570" y2="380" stroke="#fb923c" stroke-width="0.8" opacity="0.6"/>
    <text x="570" y="398" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="2" fill="#fb923c">ALTAR OF</text>
    <text x="570" y="411" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="12" letter-spacing="2" fill="#fb923c">BURNT OFFERING</text>
  </g>

  <!-- Twin Pillars: Jachin and Boaz -->
  <g>
    <circle cx="430" cy="170" r="9" fill="#fbbf24" stroke="#fef3c7" stroke-width="1.5"/>
    <circle cx="430" cy="270" r="9" fill="#fbbf24" stroke="#fef3c7" stroke-width="1.5"/>
    <text x="450" y="174" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fbbf24">JACHIN</text>
    <text x="450" y="274" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fbbf24">BOAZ</text>
  </g>

  <!-- Temple structure -->
  <g stroke="#a78bfa" stroke-width="2.5" fill="none">
    <rect x="160" y="140" width="270" height="160" rx="2"/>
  </g>

  <!-- Vestibule (Ulam) — eastern entry -->
  <g>
    <rect x="380" y="140" width="50" height="160" fill="rgba(167,139,250,0.06)"/>
    <text x="405" y="225" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="3" fill="#fef3c7" transform="rotate(-90 405 225)">VESTIBULE · ULAM</text>
  </g>

  <!-- Holy Place (Hekhal) -->
  <g>
    <rect x="240" y="140" width="140" height="160" fill="rgba(167,139,250,0.04)"/>
    <text x="310" y="135" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="#fef3c7">HOLY PLACE — HEKHAL</text>
    <!-- 10 lampstands (5 north / 5 south) -->
    <g fill="#fbbf24">
      <circle cx="260" cy="160" r="3"/><circle cx="280" cy="160" r="3"/><circle cx="300" cy="160" r="3"/><circle cx="320" cy="160" r="3"/><circle cx="340" cy="160" r="3"/>
      <circle cx="260" cy="280" r="3"/><circle cx="280" cy="280" r="3"/><circle cx="300" cy="280" r="3"/><circle cx="320" cy="280" r="3"/><circle cx="340" cy="280" r="3"/>
    </g>
    <text x="300" y="178" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="8" letter-spacing="1" fill="#fbbf24">10 LAMPSTANDS</text>
    <!-- Tables of showbread -->
    <rect x="260" y="195" width="80" height="14" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="1"/>
    <text x="300" y="218" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="8" letter-spacing="1.5" fill="#fbbf24">TABLE OF SHOWBREAD</text>
    <!-- Altar of Incense -->
    <rect x="290" y="232" width="20" height="20" fill="rgba(167,139,250,0.18)" stroke="#a78bfa" stroke-width="1"/>
    <text x="300" y="266" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="8" letter-spacing="1.2" fill="#a78bfa">INCENSE ALTAR</text>
  </g>

  <!-- Veil between Holy Place and Holy of Holies -->
  <line x1="240" y1="140" x2="240" y2="300" stroke="#fbbf24" stroke-width="3"/>
  <text x="234" y="135" text-anchor="end" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="1.5" fill="#fbbf24">↓ VEIL</text>

  <!-- Holy of Holies (Devir) — westernmost, smaller cube -->
  <rect x="160" y="140" width="80" height="160" fill="url(#solDevirGlow)"/>
  <g>
    <text x="200" y="135" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="#fef3c7">HOLY OF HOLIES — DEVIR</text>
    <text x="200" y="318" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">20 × 20 × 20 cubit cube</text>
    <!-- Ark + cherubim -->
    <rect x="186" y="208" width="28" height="20" fill="#fbbf24"/>
    <rect x="184" y="204" width="32" height="6" fill="#fef3c7"/>
    <text x="200" y="247" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="9" letter-spacing="1.5" fill="#fbbf24">ARK</text>
    <!-- Two giant cherubim flanking -->
    <path d="M 168 200 Q 176 188 200 188 Q 224 188 232 200" stroke="#fef3c7" stroke-width="1.2" fill="none" opacity="0.7"/>
  </g>

  <!-- East/West indicator -->
  <g transform="translate(60, 440)">
    <text font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="3" fill="#94a3b8">← WEST   ENTRANCE FACED EAST →</text>
  </g>
</svg>`,
  },

  // ── SEA OF GALILEE (cities + Jordan) ──────────────────────
  'sea-of-galilee': {
    title: 'Sea of Galilee · 1st Century',
    caption: 'Jesus called His first disciples here. Most of His ministry took place around these shores. The lake is 13 miles long, 8 wide, 700 feet below sea level.',
    svg: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
  <defs>
    <pattern id="galGrid" width="22" height="22" patternUnits="userSpaceOnUse">
      <path d="M22 0 L0 0 0 22" fill="none" stroke="rgba(251,191,36,0.05)" stroke-width="0.5"/>
    </pattern>
    <linearGradient id="galBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0d1a"/>
      <stop offset="100%" stop-color="#1a1233"/>
    </linearGradient>
    <radialGradient id="galWater" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="rgba(56,189,248,0.4)"/>
      <stop offset="80%" stop-color="rgba(56,189,248,0.18)"/>
      <stop offset="100%" stop-color="rgba(56,189,248,0.05)"/>
    </radialGradient>
  </defs>

  <rect width="800" height="500" fill="url(#galBg)"/>
  <rect width="800" height="500" fill="url(#galGrid)"/>

  <text x="400" y="38" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="6" fill="#fef3c7">SEA OF GALILEE — 1ST CENTURY</text>

  <!-- The lake — irregular oval -->
  <path d="M 305 130
           C 270 140 245 180 240 230
           C 235 290 260 350 320 380
           C 380 405 460 410 510 380
           C 555 350 575 295 565 240
           C 555 185 510 145 450 130
           C 410 122 350 122 305 130 Z"
        fill="url(#galWater)" stroke="#38bdf8" stroke-width="2"/>

  <!-- Ripple lines on water -->
  <g stroke="rgba(186,230,253,0.4)" stroke-width="0.8" fill="none">
    <path d="M 320 220 Q 380 215 440 222"/>
    <path d="M 310 270 Q 400 264 490 274"/>
    <path d="M 350 320 Q 420 315 480 322"/>
  </g>

  <!-- Jordan River entering from north -->
  <path d="M 405 60 L 410 80 L 405 100 L 410 120 L 405 130" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
  <text x="420" y="80" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#38bdf8">JORDAN ↓</text>
  <text x="420" y="93" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#38bdf8">RIVER IN</text>

  <!-- Jordan exiting south -->
  <path d="M 415 405 L 410 425 L 415 445 L 410 470" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
  <text x="425" y="430" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#38bdf8">↓ JORDAN OUT</text>
  <text x="425" y="443" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#38bdf8">to Dead Sea</text>

  <!-- City: Capernaum (NW, Jesus's base) -->
  <g>
    <circle cx="365" cy="170" r="9" fill="#fbbf24" stroke="#fef3c7" stroke-width="2"/>
    <circle cx="365" cy="170" r="14" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
    <text x="365" y="155" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" letter-spacing="2" fill="#fef3c7">CAPERNAUM</text>
    <text x="365" y="143" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">Jesus's base</text>
  </g>

  <!-- City: Bethsaida (NE) -->
  <g>
    <circle cx="500" cy="170" r="7" fill="#a78bfa" stroke="#fef3c7" stroke-width="1.5"/>
    <text x="500" y="155" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fef3c7">BETHSAIDA</text>
    <text x="500" y="143" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="9" fill="#94a3b8">Peter, Andrew, Philip</text>
  </g>

  <!-- City: Magdala (W) -->
  <g>
    <circle cx="280" cy="270" r="7" fill="#a78bfa" stroke="#fef3c7" stroke-width="1.5"/>
    <text x="270" y="265" text-anchor="end" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fef3c7">MAGDALA</text>
    <text x="270" y="278" text-anchor="end" font-family="Georgia, serif" font-style="italic" font-size="9" fill="#94a3b8">Mary's home</text>
  </g>

  <!-- City: Tiberias (W, Roman) -->
  <g>
    <circle cx="270" cy="335" r="7" fill="#fb923c" stroke="#fef3c7" stroke-width="1.5"/>
    <text x="260" y="330" text-anchor="end" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fef3c7">TIBERIAS</text>
    <text x="260" y="343" text-anchor="end" font-family="Georgia, serif" font-style="italic" font-size="9" fill="#94a3b8">Roman city</text>
  </g>

  <!-- Mt of Beatitudes -->
  <g>
    <path d="M 330 130 L 340 110 L 350 130 Z" fill="#10b981" opacity="0.7" stroke="#fef3c7" stroke-width="1"/>
    <text x="305" y="115" text-anchor="end" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="#10b981">MT OF</text>
    <text x="305" y="127" text-anchor="end" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="#10b981">BEATITUDES</text>
  </g>

  <!-- Decapolis region (E) -->
  <text x="640" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3" fill="rgba(254,243,199,0.55)">DECAPOLIS</text>
  <text x="640" y="256" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">10 Greek cities</text>

  <!-- Galilee region (W) -->
  <text x="160" y="240" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="14" letter-spacing="3" fill="rgba(254,243,199,0.55)">GALILEE</text>

  <!-- Compass -->
  <g transform="translate(700, 90)">
    <circle r="22" fill="rgba(10,13,26,0.7)" stroke="#fef3c7" stroke-width="1"/>
    <text y="-26" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fef3c7">N</text>
    <text y="32" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fef3c7">S</text>
    <text x="-30" y="4" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fef3c7">W</text>
    <text x="22" y="4" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fef3c7">E</text>
    <line x1="0" y1="-12" x2="0" y2="12" stroke="#fbbf24" stroke-width="1.5"/>
    <polygon points="0,-15 -3,-9 3,-9" fill="#fbbf24"/>
  </g>

  <!-- Scale + depth note -->
  <g transform="translate(60, 470)">
    <line x1="0" y1="0" x2="80" y2="0" stroke="#fef3c7" stroke-width="2"/>
    <line x1="0" y1="-4" x2="0" y2="4" stroke="#fef3c7" stroke-width="2"/>
    <line x1="80" y1="-4" x2="80" y2="4" stroke="#fef3c7" stroke-width="2"/>
    <text x="40" y="18" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="#fef3c7">~ 5 MILES</text>
  </g>
  <text x="600" y="488" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="11" fill="#94a3b8">700 ft below sea level · sudden squalls down the wadis</text>
</svg>`,
  },

  // ── HEZEKIAH'S TUNNEL CROSS-SECTION ──────────────────────
  'hezekiahs-tunnel': {
    title: "Hezekiah's Tunnel · Cross-Section",
    caption: 'Cut through 1,750 feet of solid bedrock in 701 BC. Two crews dug from opposite ends and met in the middle. Still walkable today.',
    svg: `<svg viewBox="0 0 900 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
  <defs>
    <linearGradient id="hzkBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0d1a"/>
      <stop offset="100%" stop-color="#1a1233"/>
    </linearGradient>
    <linearGradient id="hzkRock" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#574a3f"/>
      <stop offset="100%" stop-color="#322a23"/>
    </linearGradient>
    <linearGradient id="hzkWater" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>

  <rect width="900" height="460" fill="url(#hzkBg)"/>

  <text x="450" y="38" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="22" letter-spacing="5" fill="#fef3c7">HEZEKIAH'S TUNNEL — CROSS-SECTION</text>
  <text x="450" y="58" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="#94a3b8">701 BC · 1,750 feet (533 m) cut through bedrock · 2 Kings 20:20</text>

  <!-- Sky -->
  <rect x="50" y="80" width="800" height="80" fill="rgba(56,189,248,0.04)"/>

  <!-- Jerusalem city wall on top of bedrock -->
  <g>
    <rect x="350" y="110" width="220" height="50" fill="rgba(254,243,199,0.08)" stroke="#fef3c7" stroke-width="1.5"/>
    <!-- Crenellations -->
    <g fill="#fef3c7">
      <rect x="356" y="100" width="10" height="10"/>
      <rect x="380" y="100" width="10" height="10"/>
      <rect x="404" y="100" width="10" height="10"/>
      <rect x="428" y="100" width="10" height="10"/>
      <rect x="452" y="100" width="10" height="10"/>
      <rect x="476" y="100" width="10" height="10"/>
      <rect x="500" y="100" width="10" height="10"/>
      <rect x="524" y="100" width="10" height="10"/>
      <rect x="548" y="100" width="10" height="10"/>
    </g>
    <text x="460" y="142" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" letter-spacing="3" fill="#fef3c7">JERUSALEM CITY WALL</text>
  </g>

  <!-- Bedrock -->
  <path d="M 50 160 L 850 160 L 850 400 L 50 400 Z" fill="url(#hzkRock)"/>

  <!-- Bedrock texture lines -->
  <g stroke="rgba(0,0,0,0.3)" stroke-width="0.7" fill="none">
    <path d="M 80 200 Q 200 195 320 205 T 580 200 T 820 195"/>
    <path d="M 60 260 Q 180 255 300 265 T 560 260 T 800 255"/>
    <path d="M 90 320 Q 210 315 330 325 T 590 320 T 830 315"/>
    <path d="M 70 370 Q 190 365 310 375 T 570 370 T 810 365"/>
  </g>

  <!-- Spring of Gihon (left, outside walls) -->
  <g>
    <ellipse cx="120" cy="220" rx="22" ry="14" fill="url(#hzkWater)" stroke="#38bdf8" stroke-width="2"/>
    <line x1="100" y1="222" x2="142" y2="222" stroke="rgba(186,230,253,0.5)" stroke-width="0.7"/>
    <text x="120" y="195" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" letter-spacing="2" fill="#38bdf8">SPRING OF GIHON</text>
    <text x="120" y="183" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">outside the walls</text>
  </g>

  <!-- Pool of Siloam (right, inside walls) -->
  <g>
    <ellipse cx="780" cy="320" rx="32" ry="18" fill="url(#hzkWater)" stroke="#38bdf8" stroke-width="2"/>
    <line x1="752" y1="322" x2="808" y2="322" stroke="rgba(186,230,253,0.5)" stroke-width="0.7"/>
    <line x1="757" y1="328" x2="803" y2="328" stroke="rgba(186,230,253,0.4)" stroke-width="0.6"/>
    <text x="780" y="290" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="13" letter-spacing="2" fill="#38bdf8">POOL OF SILOAM</text>
    <text x="780" y="278" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="10" fill="#94a3b8">inside the walls</text>
  </g>

  <!-- The tunnel — S-curve through bedrock -->
  <path d="M 142 220
           C 200 230 230 270 280 280
           C 340 290 380 250 440 245
           C 500 240 540 290 600 305
           C 660 320 720 315 760 320"
        stroke="#38bdf8" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.85"/>
  <path d="M 142 220
           C 200 230 230 270 280 280
           C 340 290 380 250 440 245
           C 500 240 540 290 600 305
           C 660 320 720 315 760 320"
        stroke="rgba(186,230,253,0.6)" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="6 8"/>

  <!-- Meeting point of the two crews -->
  <g transform="translate(440, 245)">
    <circle r="14" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3 2"/>
    <circle r="5" fill="#fbbf24"/>
    <line x1="0" y1="0" x2="-30" y2="-50" stroke="#fbbf24" stroke-width="1"/>
    <text x="-30" y="-58" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="11" letter-spacing="2" fill="#fbbf24">CREWS MET HERE</text>
    <text x="-30" y="-46" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="9" fill="#94a3b8">Siloam Inscription</text>
  </g>

  <!-- Direction arrows showing crew advance -->
  <g fill="#fef3c7">
    <polygon points="200,238 220,234 200,230"/>
    <polygon points="660,316 680,312 660,308"/>
  </g>
  <text x="180" y="252" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="1.5" fill="#fef3c7">CREW A →</text>
  <text x="700" y="332" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="1.5" fill="#fef3c7">← CREW B</text>

  <!-- Distance scale -->
  <g transform="translate(60, 420)">
    <line x1="0" y1="0" x2="120" y2="0" stroke="#fef3c7" stroke-width="2"/>
    <line x1="0" y1="-4" x2="0" y2="4" stroke="#fef3c7" stroke-width="2"/>
    <line x1="120" y1="-4" x2="120" y2="4" stroke="#fef3c7" stroke-width="2"/>
    <text x="60" y="18" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" fill="#fef3c7">~ 250 FEET</text>
  </g>
  <text x="450" y="438" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="11" fill="#94a3b8">Sennacherib was coming. Hezekiah needed water inside the walls.</text>
</svg>`,
  },

};

if (typeof window !== 'undefined') {
  window.BIBLICAL_INFOGRAPHICS = BIBLICAL_INFOGRAPHICS;
}
