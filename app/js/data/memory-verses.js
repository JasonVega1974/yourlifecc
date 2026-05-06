/* =============================================================
   memory-verses.js — Faith Hub 2.0 memory-verse library (F2-F)

   50 starter verses across 9 categories. Users add from this library
   (or paste a custom verse) and the verse enters their personal
   spaced-repetition queue stored in D.memoryVerses.

   ESV quotations. Reference format kept short for chip-style UI.
============================================================= */

const MEMORY_VERSE_LIBRARY = [
  // ── Identity & Foundations (8) ────────────────────────────
  { reference:'John 3:16',         category:'identity', text:'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.' },
  { reference:'Genesis 1:27',      category:'identity', text:'So God created man in his own image, in the image of God he created him; male and female he created them.' },
  { reference:'Psalm 139:14',      category:'identity', text:'I praise you, for I am fearfully and wonderfully made. Wonderful are your works; my soul knows it very well.' },
  { reference:'2 Corinthians 5:17',category:'identity', text:'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.' },
  { reference:'Galatians 2:20',    category:'identity', text:'I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.' },
  { reference:'Ephesians 2:10',    category:'identity', text:'For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.' },
  { reference:'1 Peter 2:9',       category:'identity', text:'But you are a chosen race, a royal priesthood, a holy nation, a people for his own possession.' },
  { reference:'Romans 8:1',        category:'identity', text:'There is therefore now no condemnation for those who are in Christ Jesus.' },

  // ── Anxiety & Peace (7) ───────────────────────────────────
  { reference:'Philippians 4:6',   category:'peace',    text:'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be known to God.' },
  { reference:'Philippians 4:7',   category:'peace',    text:'And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.' },
  { reference:'1 Peter 5:7',       category:'peace',    text:'Casting all your anxieties on him, because he cares for you.' },
  { reference:'Matthew 6:34',      category:'peace',    text:'Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble.' },
  { reference:'Isaiah 26:3',       category:'peace',    text:'You keep him in perfect peace whose mind is stayed on you, because he trusts in you.' },
  { reference:'John 14:27',        category:'peace',    text:'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.' },
  { reference:'Psalm 46:10',       category:'peace',    text:'Be still, and know that I am God.' },

  // ── Strength & Courage (7) ────────────────────────────────
  { reference:'Joshua 1:9',        category:'strength', text:'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go.' },
  { reference:'Philippians 4:13',  category:'strength', text:'I can do all things through him who strengthens me.' },
  { reference:'Isaiah 41:10',      category:'strength', text:'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.' },
  { reference:'2 Timothy 1:7',     category:'strength', text:'For God gave us a spirit not of fear but of power and love and self-control.' },
  { reference:'Psalm 27:1',        category:'strength', text:'The LORD is my light and my salvation; whom shall I fear? The LORD is the stronghold of my life; of whom shall I be afraid?' },
  { reference:'Ephesians 6:10',    category:'strength', text:'Finally, be strong in the Lord and in the strength of his might.' },
  { reference:'Isaiah 40:31',      category:'strength', text:'But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.' },

  // ── Faith & Trust (6) ─────────────────────────────────────
  { reference:'Hebrews 11:1',      category:'faith',    text:'Now faith is the assurance of things hoped for, the conviction of things not seen.' },
  { reference:'Proverbs 3:5',      category:'faith',    text:'Trust in the LORD with all your heart, and do not lean on your own understanding.' },
  { reference:'Proverbs 3:6',      category:'faith',    text:'In all your ways acknowledge him, and he will make straight your paths.' },
  { reference:'Romans 8:28',       category:'faith',    text:'And we know that for those who love God all things work together for good, for those who are called according to his purpose.' },
  { reference:'Jeremiah 29:11',    category:'faith',    text:'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.' },
  { reference:'2 Corinthians 5:7', category:'faith',    text:'For we walk by faith, not by sight.' },

  // ── Love & Relationships (5) ──────────────────────────────
  { reference:'1 Corinthians 13:4',category:'love',     text:'Love is patient and kind; love does not envy or boast; it is not arrogant or rude.' },
  { reference:'1 John 4:19',       category:'love',     text:'We love because he first loved us.' },
  { reference:'John 15:13',        category:'love',     text:'Greater love has no one than this, that someone lay down his life for his friends.' },
  { reference:'Ephesians 4:32',    category:'love',     text:'Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.' },
  { reference:'Colossians 3:12',   category:'love',     text:'Put on then, as God\'s chosen ones, holy and beloved, compassionate hearts, kindness, humility, meekness, and patience.' },

  // ── Wisdom & Self-Control (5) ─────────────────────────────
  { reference:'James 1:5',         category:'wisdom',   text:'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.' },
  { reference:'Proverbs 1:7',      category:'wisdom',   text:'The fear of the LORD is the beginning of knowledge; fools despise wisdom and instruction.' },
  { reference:'James 1:19',        category:'wisdom',   text:'Let every person be quick to hear, slow to speak, slow to anger.' },
  { reference:'Galatians 5:22-23', category:'wisdom',   text:'But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.' },
  { reference:'Proverbs 4:23',     category:'wisdom',   text:'Keep your heart with all vigilance, for from it flow the springs of life.' },

  // ── Hope & Eternity (5) ───────────────────────────────────
  { reference:'Romans 15:13',      category:'hope',     text:'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.' },
  { reference:'Lamentations 3:22-23', category:'hope',  text:'The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.' },
  { reference:'Revelation 21:4',   category:'hope',     text:'He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning, nor crying, nor pain anymore.' },
  { reference:'John 11:25',        category:'hope',     text:'Jesus said to her, I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live.' },
  { reference:'2 Corinthians 4:17',category:'hope',     text:'For this light momentary affliction is preparing for us an eternal weight of glory beyond all comparison.' },

  // ── Worship & Gratitude (4) ───────────────────────────────
  { reference:'Psalm 100:4',       category:'worship',  text:'Enter his gates with thanksgiving, and his courts with praise! Give thanks to him; bless his name!' },
  { reference:'1 Thessalonians 5:16-18', category:'worship', text:'Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.' },
  { reference:'Psalm 34:1',        category:'worship',  text:'I will bless the LORD at all times; his praise shall continually be in my mouth.' },
  { reference:'Psalm 118:24',      category:'worship',  text:'This is the day that the LORD has made; let us rejoice and be glad in it.' },

  // ── Mission & Service (3) ─────────────────────────────────
  { reference:'Matthew 28:19',     category:'mission',  text:'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.' },
  { reference:'Matthew 5:16',      category:'mission',  text:'In the same way, let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.' },
  { reference:'Micah 6:8',         category:'mission',  text:'He has told you, O man, what is good; and what does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?' },
];

const MEMORY_VERSE_CATEGORIES = [
  { id:'identity', label:'Identity',   icon:'💎', color:'#a78bfa' },
  { id:'peace',    label:'Peace',      icon:'🕊️', color:'#38bdf8' },
  { id:'strength', label:'Strength',   icon:'💪', color:'#fbbf24' },
  { id:'faith',    label:'Faith',      icon:'⚓', color:'#10b981' },
  { id:'love',     label:'Love',       icon:'❤️', color:'#f472b6' },
  { id:'wisdom',   label:'Wisdom',     icon:'🧠', color:'#a78bfa' },
  { id:'hope',     label:'Hope',       icon:'🌅', color:'#fb923c' },
  { id:'worship',  label:'Worship',    icon:'🎵', color:'#38bdf8' },
  { id:'mission',  label:'Mission',    icon:'✨', color:'#10b981' },
];

if (typeof window !== 'undefined') {
  window.MEMORY_VERSE_LIBRARY    = MEMORY_VERSE_LIBRARY;
  window.MEMORY_VERSE_CATEGORIES = MEMORY_VERSE_CATEGORIES;
}
