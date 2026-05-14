/* =============================================================
   academy-lessons.js — Featured Faith Academy lessons (F8 redesign)

   15 stand-alone lessons across 5 categories, displayed as a
   "Featured" card grid at the top of #bf-academy above the legacy
   FAITH_ACADEMY_CURRICULUM module browser. Each lesson is fully
   self-contained: header SVG (shared per category), title +
   description, 3-4 content sections, keyVerse, "What This Means
   For You" callout, and a 5-question per-lesson quiz.

   Schema per lesson:
     id, category, title, description, duration, sections[],
     keyVerse{ref,text}, whatThisMeans, quiz[]
   sections[]: { heading, paragraphs[] }
   quiz[]:     { q, options[4], correctIdx, explanation? }

   Progress stored in D.academyProgress['lesson-'+id] = {score,total,passed,date}
   A lesson is "complete" when its quiz is passed at >= 80%.

   Categories + accent colors (used for card gradient + modal eyebrow):
     theology         → #a78bfa (violet)
     church-history   → #fbbf24 (gold)
     christian-living → #38bdf8 (cyan)
     apologetics      → #fb923c (orange)
     bible-study      → #22c55e (green)
============================================================= */

const ACADEMY_CATEGORIES = {
  'theology':         { label:'Theology',          color:'#a78bfa', soft:'rgba(167,139,250,', icon:'⚖️' },
  'church-history':   { label:'Church History',    color:'#fbbf24', soft:'rgba(251,191,36,',  icon:'🏛️' },
  'christian-living': { label:'Christian Living',  color:'#38bdf8', soft:'rgba(56,189,248,',  icon:'🌱' },
  'apologetics':      { label:'Apologetics',       color:'#fb923c', soft:'rgba(251,146,60,',  icon:'🛡️' },
  'bible-study':      { label:'Bible Study',       color:'#22c55e', soft:'rgba(34,197,94,',   icon:'📖' },
};

// One cathedral-blueprint SVG per category. Story Mode aesthetic:
// deep navy bg, gold accents, atmospheric silhouettes. viewBox 800x300.
const ACADEMY_CATEGORY_SVGS = {
  'theology': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="acsvg-th" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#1a1233"/><stop offset="100%" stop-color="#3d2a5e"/></linearGradient>'
    + '<radialGradient id="acsvg-th-glow" cx="50%" cy="40%" r="40%"><stop offset="0%" stop-color="rgba(251,191,36,.42)"/><stop offset="100%" stop-color="rgba(251,191,36,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#acsvg-th)"/>'
    + '<g fill="#fef3c7" opacity=".75"><circle cx="80" cy="50" r="1.0"/><circle cx="220" cy="40" r="0.9"/><circle cx="370" cy="55" r="0.8"/><circle cx="540" cy="35" r="1.1"/><circle cx="680" cy="60" r="0.9"/></g>'
    + '<rect width="800" height="300" fill="url(#acsvg-th-glow)"/>'
    + '<g fill="rgba(251,191,36,.95)"><circle cx="400" cy="110" r="36"/></g>'
    + '<g stroke="#0a0d1a" stroke-width="1.2" fill="none" opacity=".95"><circle cx="400" cy="110" r="36"/></g>'
    + '<g fill="#0a0d1a" font-family="Bebas Neue, sans-serif" font-size="22" text-anchor="middle"><text x="400" y="118" letter-spacing="3">θεός</text></g>'
    + '<g stroke="rgba(251,191,36,.6)" stroke-width="1.5" fill="none"><path d="M 400 145 L 340 220 M 400 145 L 460 220 M 340 220 L 460 220"/></g>'
    + '<g fill="rgba(167,139,250,.85)"><circle cx="340" cy="220" r="6"/><circle cx="460" cy="220" r="6"/><circle cx="400" cy="145" r="6"/></g>'
    + '<g fill="#fef3c7" font-family="Bebas Neue, sans-serif" font-size="10" letter-spacing="2" opacity=".75" text-anchor="middle">'
    + '<text x="400" y="138">FATHER</text><text x="320" y="240">SON</text><text x="480" y="240">SPIRIT</text></g>'
    + '<path d="M 0 270 Q 200 245 400 260 T 800 265 L 800 300 L 0 300 Z" fill="#0a0d1a" opacity=".95"/>'
    + '</svg>',

  'church-history': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="acsvg-ch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="60%" stop-color="#1a1233"/><stop offset="100%" stop-color="#2a1410"/></linearGradient>'
    + '<radialGradient id="acsvg-ch-glow" cx="50%" cy="55%" r="38%"><stop offset="0%" stop-color="rgba(251,191,36,.36)"/><stop offset="100%" stop-color="rgba(251,191,36,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#acsvg-ch)"/>'
    + '<g fill="#fef3c7" opacity=".7"><circle cx="100" cy="40" r="0.9"/><circle cx="240" cy="55" r="1.0"/><circle cx="400" cy="35" r="0.8"/><circle cx="560" cy="55" r="0.9"/><circle cx="700" cy="40" r="0.8"/></g>'
    + '<rect width="800" height="300" fill="url(#acsvg-ch-glow)"/>'
    + '<g fill="#0a0d1a" stroke="rgba(251,191,36,.65)" stroke-width="1.3" opacity=".95">'
    + '<path d="M 340 230 L 340 130 L 400 80 L 460 130 L 460 230 Z"/>'
    + '<rect x="392" y="150" width="16" height="34" fill="rgba(251,191,36,.4)"/>'
    + '<line x1="400" y1="80" x2="400" y2="60"/>'
    + '<path d="M 392 60 L 408 60 L 408 70 L 400 78 L 392 70 Z"/>'
    + '</g>'
    + '<g stroke="rgba(251,191,36,.55)" stroke-width="1" fill="none" stroke-dasharray="4 6">'
    + '<path d="M 60 240 Q 180 230 290 235"/><path d="M 510 235 Q 620 230 740 240"/></g>'
    + '<g fill="#0a0d1a" stroke="rgba(251,191,36,.5)" stroke-width="1">'
    + '<rect x="40" y="220" width="14" height="50"/><path d="M 33 220 L 61 220 L 57 212 L 37 212 Z"/>'
    + '<rect x="68" y="220" width="14" height="50"/><path d="M 61 220 L 89 220 L 85 212 L 65 212 Z"/>'
    + '<rect x="720" y="220" width="14" height="50"/><path d="M 713 220 L 741 220 L 737 212 L 717 212 Z"/>'
    + '<rect x="748" y="220" width="14" height="50"/><path d="M 741 220 L 769 220 L 765 212 L 745 212 Z"/>'
    + '</g>'
    + '<path d="M 0 270 Q 200 250 400 262 T 800 268 L 800 300 L 0 300 Z" fill="#0a0d1a" opacity=".95"/>'
    + '</svg>',

  'christian-living': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="acsvg-cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#0e2030"/><stop offset="100%" stop-color="#143850"/></linearGradient>'
    + '<radialGradient id="acsvg-cl-glow" cx="50%" cy="35%" r="40%"><stop offset="0%" stop-color="rgba(56,189,248,.32)"/><stop offset="100%" stop-color="rgba(56,189,248,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#acsvg-cl)"/>'
    + '<g fill="#fef3c7" opacity=".7"><circle cx="80" cy="40" r="0.9"/><circle cx="200" cy="60" r="0.8"/><circle cx="360" cy="40" r="1.0"/><circle cx="540" cy="55" r="0.9"/><circle cx="700" cy="40" r="0.8"/></g>'
    + '<rect width="800" height="300" fill="url(#acsvg-cl-glow)"/>'
    + '<path d="M 0 250 Q 200 220 400 240 T 800 235 L 800 300 L 0 300 Z" fill="#0a1a26" opacity=".92"/>'
    + '<g fill="#0a0d1a" stroke="rgba(56,189,248,.55)" stroke-width="1.2">'
    + '<path d="M 380 240 L 400 200 L 420 240 Z"/>'
    + '<path d="M 360 240 L 400 175 L 440 240 Z"/>'
    + '<line x1="400" y1="240" x2="400" y2="260"/>'
    + '</g>'
    + '<g fill="rgba(251,191,36,.85)"><circle cx="400" cy="170" r="3"/></g>'
    + '<g stroke="rgba(251,191,36,.55)" stroke-width="1" fill="none" stroke-linecap="round" stroke-dasharray="2 5">'
    + '<path d="M 400 170 L 400 90"/></g>'
    + '<g stroke="rgba(251,191,36,.4)" stroke-width="0.8" fill="none">'
    + '<path d="M 140 240 Q 160 220 180 240"/><path d="M 200 240 Q 220 215 240 240"/><path d="M 260 240 Q 285 225 310 240"/>'
    + '<path d="M 490 240 Q 510 220 530 240"/><path d="M 550 240 Q 575 215 600 240"/><path d="M 620 240 Q 645 225 670 240"/>'
    + '</g>'
    + '</svg>',

  'apologetics': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="acsvg-ap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#2a1410"/><stop offset="100%" stop-color="#5a2a0e"/></linearGradient>'
    + '<radialGradient id="acsvg-ap-glow" cx="50%" cy="45%" r="38%"><stop offset="0%" stop-color="rgba(251,146,60,.34)"/><stop offset="100%" stop-color="rgba(251,146,60,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#acsvg-ap)"/>'
    + '<g fill="#fef3c7" opacity=".6"><circle cx="100" cy="40" r="0.8"/><circle cx="260" cy="55" r="0.9"/><circle cx="540" cy="40" r="0.9"/><circle cx="700" cy="55" r="0.8"/></g>'
    + '<rect width="800" height="300" fill="url(#acsvg-ap-glow)"/>'
    + '<g fill="#0a0d1a" stroke="rgba(251,146,60,.7)" stroke-width="1.5">'
    + '<path d="M 400 70 L 460 110 L 460 180 L 400 230 L 340 180 L 340 110 Z"/>'
    + '</g>'
    + '<g fill="rgba(251,146,60,.4)"><path d="M 380 120 L 420 120 L 410 170 L 390 170 Z"/></g>'
    + '<g stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round">'
    + '<line x1="400" y1="95" x2="400" y2="135"/>'
    + '<line x1="385" y1="115" x2="415" y2="115"/>'
    + '</g>'
    + '<g stroke="rgba(251,146,60,.45)" stroke-width="0.8" fill="none" stroke-dasharray="3 5">'
    + '<path d="M 100 200 L 320 180"/><path d="M 480 180 L 700 200"/>'
    + '</g>'
    + '<g fill="#0a0d1a" stroke="rgba(251,191,36,.5)" stroke-width="0.8">'
    + '<text x="150" y="225" font-family="Georgia, serif" font-style="italic" font-size="10" fill="rgba(254,243,199,.6)">"why?"</text>'
    + '<text x="600" y="225" font-family="Georgia, serif" font-style="italic" font-size="10" fill="rgba(254,243,199,.6)">"how?"</text>'
    + '</g>'
    + '<path d="M 0 265 Q 200 245 400 258 T 800 263 L 800 300 L 0 300 Z" fill="#1a0d05" opacity=".92"/>'
    + '</svg>',

  'bible-study': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="acsvg-bs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#0d2818"/><stop offset="100%" stop-color="#0f4030"/></linearGradient>'
    + '<radialGradient id="acsvg-bs-glow" cx="50%" cy="45%" r="40%"><stop offset="0%" stop-color="rgba(34,197,94,.30)"/><stop offset="100%" stop-color="rgba(34,197,94,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#acsvg-bs)"/>'
    + '<g fill="#fef3c7" opacity=".7"><circle cx="80" cy="40" r="0.9"/><circle cx="220" cy="55" r="0.8"/><circle cx="380" cy="40" r="1.0"/><circle cx="540" cy="55" r="0.9"/><circle cx="700" cy="40" r="0.8"/></g>'
    + '<rect width="800" height="300" fill="url(#acsvg-bs-glow)"/>'
    + '<g fill="#fffaeb" stroke="rgba(120,80,20,.5)" stroke-width="1.2" opacity=".95">'
    + '<path d="M 280 90 L 400 80 L 520 90 L 520 230 L 400 220 L 280 230 Z"/>'
    + '<line x1="400" y1="80" x2="400" y2="220" stroke="rgba(120,80,20,.6)"/>'
    + '</g>'
    + '<g stroke="rgba(120,80,20,.45)" stroke-width="0.7">'
    + '<line x1="295" y1="105" x2="390" y2="98"/><line x1="295" y1="118" x2="390" y2="112"/><line x1="295" y1="131" x2="390" y2="126"/><line x1="295" y1="144" x2="390" y2="140"/><line x1="295" y1="157" x2="390" y2="154"/><line x1="295" y1="170" x2="390" y2="168"/><line x1="295" y1="183" x2="390" y2="182"/><line x1="295" y1="196" x2="390" y2="196"/>'
    + '<line x1="410" y1="98" x2="505" y2="105"/><line x1="410" y1="112" x2="505" y2="118"/><line x1="410" y1="126" x2="505" y2="131"/><line x1="410" y1="140" x2="505" y2="144"/><line x1="410" y1="154" x2="505" y2="157"/><line x1="410" y1="168" x2="505" y2="170"/><line x1="410" y1="182" x2="505" y2="183"/><line x1="410" y1="196" x2="505" y2="196"/>'
    + '</g>'
    + '<g stroke="rgba(251,191,36,.6)" stroke-width="1.2" fill="none">'
    + '<line x1="400" y1="60" x2="400" y2="78"/>'
    + '<path d="M 392 50 L 408 50 L 408 60 L 400 70 L 392 60 Z" fill="#fbbf24" opacity=".75"/>'
    + '</g>'
    + '<g fill="#fbbf24" opacity=".7"><circle cx="400" cy="55" r="3"/></g>'
    + '</svg>',
};

const ACADEMY_LESSONS = [

  // ═════════════════════════════ THEOLOGY (4) ═════════════════════════════

  {
    id: 'trinity',
    category: 'theology',
    title: 'The Trinity',
    description: 'One God, three persons — the hardest doctrine to grasp and the one that holds everything.',
    duration: '8 min',
    sections: [
      {
        heading: 'One God, Three Persons',
        paragraphs: [
          'The Bible says two things at the same time that should not both be true. First: there is only one God. "Hear, O Israel: The LORD our God, the LORD is one" (Deuteronomy 6:4). This is the foundation of every page that follows. Second: the Father is called God, the Son (Jesus) is called God, and the Holy Spirit is called God — and they relate to one another as distinct persons.',
          'The early church wrestled with this for centuries before landing on the language they had. One being. Three persons. Not three gods. Not one God wearing three masks. The Greek word they finally used was *homoousios* — "of the same substance." Whatever the Father is, the Son is. Whatever the Son is, the Spirit is. Yet they are not interchangeable.',
        ],
      },
      {
        heading: 'Why It Cannot Be a Math Problem',
        paragraphs: [
          'No analogy fully works. An egg has three parts? Water has three states? Both of those treat the Trinity like one substance in three modes — which is heresy (modalism). Three friends working together? That treats them like three gods (tritheism). The Trinity is unique. The Maker of reality is the only thing not analogous to anything inside it.',
          'C.S. Lewis put it this way: if you were a flat shape on a piece of paper, you would have a hard time imagining a cube. The cube is not anti-shape — it is more than shape. The Trinity is not anti-God; it is the fullness of God that we, with our limits, can only approach.',
        ],
      },
      {
        heading: 'Love Is Older Than Creation',
        paragraphs: [
          'Here is why the Trinity is not just abstract theology. If God were a single, isolated being, love would have begun with creation — He would have had no one to love until He made us. But because God has eternally existed as Father, Son, and Spirit loving each other, love is older than time. The universe was not made by a lonely deity who needed company; it was made by a community of love that already had everything and wanted to share it.',
          'When 1 John says "God is love," it is telling the truth in a way only Trinitarian Christianity can. Love is not what God does. Love is what God is, eternally, in Himself.',
        ],
      },
      {
        heading: 'Where We See It in Action',
        paragraphs: [
          'At the baptism of Jesus, the Trinity appears together publicly: the Son in the water, the Spirit descending as a dove, the Father speaking from heaven (Matthew 3:16-17). At the Great Commission, Jesus tells the disciples to baptize "in the name [singular] of the Father and of the Son and of the Holy Spirit" (Matthew 28:19) — one name, three persons. At the cross, the Father sends the Son, who offers Himself through the eternal Spirit (Hebrews 9:14). The gospel is Trinitarian all the way down.',
        ],
      },
    ],
    keyVerse: { ref: 'Matthew 28:19', text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.' },
    whatThisMeans: 'You were made by a community of love that already had everything it needed. Being adopted into the family of God is not just legal — it is being drawn into the relationship the three persons have been enjoying forever. You were made for that. That ache for belonging you have always carried is your soul remembering it was meant for this.',
    quiz: [
      { q: 'Which best describes the doctrine of the Trinity?', options: ['Three separate gods working together', 'One God appearing in three forms or modes', 'One God eternally existing as three distinct persons', 'God plus two highly-ranked angels'], correctIdx: 2, explanation: 'One being, three persons — Father, Son, and Spirit. Not three gods (tritheism) and not one God switching modes (modalism).' },
      { q: 'The Hebrew Shema (Deuteronomy 6:4) declares…', options: ['God is unknowable', 'The LORD our God, the LORD is one', 'Worship many gods', 'The Father is greater than the Son'], correctIdx: 1, explanation: 'The Shema is the foundation of biblical monotheism — and the Trinity is held in tension with it, not against it.' },
      { q: 'Which event in Jesus\'s life most clearly shows all three persons of the Trinity together?', options: ['The Sermon on the Mount', 'The baptism of Jesus', 'The feeding of the 5,000', 'The triumphal entry'], correctIdx: 1, explanation: 'At the baptism: Son in the water, Spirit descending as a dove, Father speaking from heaven (Matthew 3:16-17).' },
      { q: 'Why is the Trinity significant for the statement "God is love"?', options: ['It is just a slogan', 'A solitary God would have had no one to love until He created', 'Love is one of many things God does', 'Love only happens between humans'], correctIdx: 1, explanation: 'A solitary God would need creation in order to love. Because God is eternally three persons loving each other, love is older than time itself.' },
      { q: 'In the Great Commission (Matthew 28:19), Jesus tells the disciples to baptize in the…', options: ['Names of the three gods', 'Name of Jesus only', 'Name of the Father and of the Son and of the Holy Spirit', 'Name of any deity'], correctIdx: 2, explanation: 'One singular "name" — three persons. Greek grammar is precise: name (singular), Father, Son, Spirit.' },
    ],
  },

  {
    id: 'grace-faith',
    category: 'theology',
    title: 'Grace & Faith',
    description: 'The doctrine the Reformation was born around — saved by grace, through faith, not by what you do.',
    duration: '7 min',
    sections: [
      {
        heading: 'Two Words Worth a Lifetime',
        paragraphs: [
          'Grace is unearned, undeserved kindness from God. Faith is the open hand that receives it. Together, they form the engine room of Christianity. Ephesians 2:8-9 says it directly: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast."',
          'Every other world religion teaches some version of "do enough good things to qualify." Christianity teaches the opposite: you cannot qualify, the qualifying has been done for you, and your job is to receive it. That is so foreign to how we think that it sounds suspicious. Surely there must be a catch. There is not.',
        ],
      },
      {
        heading: 'Why Works Cannot Save',
        paragraphs: [
          'If even one of your sins is real, then a perfectly just God cannot ignore it. Imagine a judge who lets a guilty defendant walk because he seems like a nice guy. That is not justice. The problem with "be good enough" theology is that no amount of future good erases a single past wrong.',
          'The cross solves the problem by paying the actual debt. Christ takes what justice demanded and gives in return what holiness required. You receive the verdict "not guilty" not because the evidence was wrong, but because Someone Else served the sentence in your place. Romans 3:24 calls this "justified by his grace as a gift, through the redemption that is in Christ Jesus."',
        ],
      },
      {
        heading: 'What Faith Actually Is',
        paragraphs: [
          'Faith is not believing six impossible things before breakfast. It is not blind. It is trust based on evidence — the kind of trust that gets in the airplane after reading about how planes work. Biblical faith looks at Jesus — His life, His teaching, His death, His resurrection — and says: I will stake my life on what I see.',
          'James 2:17 says "faith by itself, if it does not have works, is dead." This is not a contradiction of grace. It is a description of real faith. Real trust changes how you live. The works do not earn the grace; they prove the faith was real. A person who claims to trust Jesus but lives unchanged was probably never trusting Him in the first place.',
        ],
      },
      {
        heading: 'Living Inside Grace',
        paragraphs: [
          'Once you really see grace, two things start happening. First, you stop trying to earn what you already have. The constant exhausting checklist of religious performance starts to dissolve. Second, you become more grateful, and gratitude turns out to be a far more powerful motivator for obedience than guilt ever was. The believer who knows they have been forgiven much loves much (Luke 7:47).',
        ],
      },
    ],
    keyVerse: { ref: 'Ephesians 2:8-9', text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.' },
    whatThisMeans: 'You do not have to earn God\'s love. You already have it. Whatever performance treadmill you have been on — religious or otherwise — you can step off. Your job today is not to qualify; your job today is to trust what Jesus has already done and let that trust reshape how you live.',
    quiz: [
      { q: 'According to Ephesians 2:8-9, salvation is…', options: ['Earned by good works', 'Given as a gift by grace through faith', 'Won by spiritual achievements', 'Granted to those who deserve it'], correctIdx: 1, explanation: 'Salvation is the gift of God, not a result of works, so that no one may boast.' },
      { q: 'Why can\'t good works save us?', options: ['Because God is unfair', 'Because no amount of future good erases a past wrong before a just Judge', 'Because works don\'t matter at all', 'Because God only saves the wealthy'], correctIdx: 1, explanation: 'A just God cannot ignore real guilt. The cross actually pays the debt rather than overlooking it.' },
      { q: 'What does James 2:17 mean by "faith without works is dead"?', options: ['Works earn salvation', 'Real faith produces real change', 'Faith and works are unrelated', 'Only works matter in the end'], correctIdx: 1, explanation: 'James isn\'t contradicting grace — he\'s saying genuine trust always changes how someone lives. Works prove the faith is real.' },
      { q: 'How is biblical faith different from "blind belief"?', options: ['It requires no thought', 'It is trust based on evidence — examining Jesus and staking your life on what you see', 'It ignores reason', 'It is the same thing'], correctIdx: 1, explanation: 'Faith is trust based on evidence — like getting on a plane after understanding aerodynamics, not despite it.' },
      { q: 'What was the main insight of the Reformation about grace?', options: ['Grace is earned through sacraments', 'Salvation comes by grace alone, through faith alone, in Christ alone', 'Grace depends on church membership', 'Grace is for the elite few'], correctIdx: 1, explanation: 'Sola gratia, sola fide, solus Christus — the Reformation\'s rediscovery that the gospel itself is the message of grace.' },
    ],
  },

  {
    id: 'sin-redemption',
    category: 'theology',
    title: 'Sin & Redemption',
    description: 'What went wrong in the world, what Christ did about it, and why that changes everything.',
    duration: '8 min',
    sections: [
      {
        heading: 'The Diagnosis Comes First',
        paragraphs: [
          'You cannot understand the cure until you understand the disease. Sin, in the biblical vocabulary, is not just "doing bad things." The Hebrew word *chata* and the Greek word *hamartia* both literally mean to miss the mark — to aim at the wrong target. Sin is the entire condition of being aimed at yourself instead of at God.',
          'This is why Christianity says everyone is a sinner. It is not a verdict about how bad you are compared to your neighbor. It is a description of the orientation of every human heart since Eden. Even your best moments are tainted with self-interest. Even your good works have a "what\'s in it for me" running underneath them. Be honest with yourself for a single hour and you will find this is true.',
        ],
      },
      {
        heading: 'Why It Costs Something',
        paragraphs: [
          'Sin does damage. It damages you — fractures your conscience, your relationships, your peace. It damages others — every word, every action ripples outward. And it damages your relationship with God — not because He stops loving you, but because sin is incompatible with His holiness, the way poison is incompatible with health.',
          'The wages of sin, Paul says, is death (Romans 6:23). Not just physical death. The slow death of joy, of meaning, of connection. The death you feel in your bones when you have hurt someone you love and cannot take it back. The death of the spiritual self that was meant to walk with God in the garden in the cool of the day.',
        ],
      },
      {
        heading: 'Redemption — Bought Back',
        paragraphs: [
          'The biblical word *redeem* means to buy back. In the ancient world, a slave could be redeemed — a relative would pay the price and the slave would walk out free. Jesus uses this exact language about Himself: "the Son of Man came not to be served but to serve, and to give his life as a ransom for many" (Mark 10:45).',
          'The cross is the price. Your sin had a real cost, and someone had to pay it. Christ paid it Himself, in His own body, in your place. This is not a metaphor. The blood was real, the suffering was real, the price was real. You were bought, the New Testament says, with the precious blood of Christ (1 Peter 1:19). You are not your own. You belong to the One who bought you back.',
        ],
      },
      {
        heading: 'New Creation, Not Just New Behavior',
        paragraphs: [
          'Christianity does not just offer better behavior. It offers a new identity. "If anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come" (2 Corinthians 5:17). The same Spirit who raised Jesus from the dead now lives in every believer, slowly making them into someone they could not have become on their own.',
          'This is why Christian moral effort is different from moral self-help. You are not trying to manufacture goodness from a contaminated source. You are letting a new life — already inside you by the Spirit — emerge in your behavior. The change happens; it just happens from the inside out.',
        ],
      },
    ],
    keyVerse: { ref: 'Romans 6:23', text: 'For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.' },
    whatThisMeans: 'Whatever you have done — and whatever has been done to you — there is a Redeemer who specializes in buying back what looked unredeemable. You do not have to clean yourself up to come to Him. You come to Him because He has already paid the price. Then He cleans you up from the inside out.',
    quiz: [
      { q: 'The Hebrew and Greek words for "sin" literally mean…', options: ['Big crime', 'To miss the mark / aim at the wrong target', 'To be uneducated', 'To worship the wrong god'], correctIdx: 1, explanation: 'Chata and hamartia both mean to miss the mark — sin is an orientation, aimed at self rather than God, not just isolated bad acts.' },
      { q: 'What does "redeemed" literally mean in the biblical context?', options: ['Forgiven without cost', 'Bought back at a price', 'Educated about right and wrong', 'Punished severely'], correctIdx: 1, explanation: 'Redeem means to purchase back — like a slave being bought free in the ancient world. The cross is the actual price paid.' },
      { q: 'According to Romans 6:23, the wages of sin is…', options: ['Bad luck', 'A scolding', 'Death', 'A delay'], correctIdx: 2, explanation: 'Death — not just physical, but the slow death of joy, meaning, and the spiritual self that was meant to walk with God.' },
      { q: '2 Corinthians 5:17 says of anyone in Christ…', options: ['They follow a better moral code', 'They are a new creation; the old has passed away', 'They become wealthy', 'They never sin again'], correctIdx: 1, explanation: 'A new creation. Christianity offers a new identity, not just improved behavior.' },
      { q: 'Why is Christian moral change different from self-help moral effort?', options: ['It requires more willpower', 'The Spirit produces real change from a new life already given inside the believer', 'It is identical', 'It happens only after death'], correctIdx: 1, explanation: 'You\'re not manufacturing goodness from a contaminated source — the new life is already inside you by the Spirit, emerging from the inside out.' },
    ],
  },

  {
    id: 'holy-spirit',
    category: 'theology',
    title: 'The Holy Spirit',
    description: 'The third person of the Trinity — who He is, what He does, and how He lives in you.',
    duration: '8 min',
    sections: [
      {
        heading: 'Not a "What" — a "Who"',
        paragraphs: [
          'The Holy Spirit is not a force, an energy, or a vague feeling. He is a person — the third person of the Trinity, fully God, equal with the Father and the Son. He can be grieved (Ephesians 4:30). He speaks (Acts 13:2). He intercedes for believers (Romans 8:26). He has a will and a mind and a relational presence. The Spirit is a He, not an It.',
          'In the Old Testament, the Spirit came upon specific people for specific tasks — prophets, kings, craftsmen. After Pentecost (Acts 2), the Spirit took up permanent residence inside every believer. This is one of the most underestimated changes in human history. The God of the universe lives inside His people now.',
        ],
      },
      {
        heading: 'What the Spirit Does in You',
        paragraphs: [
          'He convicts you of sin — gives you the gentle (or not so gentle) sense that something is wrong and needs to be brought to God (John 16:8). He teaches you, especially through Scripture — opens your eyes to see what you would have walked past on your own (John 14:26). He produces fruit in your character over time: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control (Galatians 5:22-23).',
          'He gives gifts to the church for the good of others — teaching, encouragement, mercy, leadership, hospitality, faith, healing, prophecy (1 Corinthians 12). He prays for you when you cannot pray, with groanings too deep for words (Romans 8:26). He seals you as God\'s permanent possession (Ephesians 1:13-14) — the deposit guaranteeing that everything God has promised, He will deliver.',
        ],
      },
      {
        heading: 'How to Walk in the Spirit',
        paragraphs: [
          'The New Testament uses several pictures: be filled with the Spirit (Ephesians 5:18), walk by the Spirit (Galatians 5:16), keep in step with the Spirit (Galatians 5:25). All three describe the same daily reality — an active, ongoing dependence on His presence and direction rather than self-effort.',
          'Practically, this looks like asking Him: Show me what I am missing. Convict me where I am dull. Strengthen me where I am tempted. Bring to mind what I have read. Help me love this person I would otherwise resent. Then watching for the answers, which usually come quietly — a thought, a verse, a nudge of conscience, an unexpected peace.',
        ],
      },
      {
        heading: 'When You Feel He Has Left',
        paragraphs: [
          'Many believers have seasons when the Spirit feels far. They feel dry, hollow, going through the motions. This is normal Christian experience, not a sign that He has departed. He has promised never to leave (John 14:16). The dryness is usually a season of formation — the Spirit working at deeper levels than your feelings can detect. Keep showing up. Keep praying even when prayers feel hollow. The dry season ends. It always has.',
        ],
      },
    ],
    keyVerse: { ref: 'John 14:26', text: 'But the Helper, the Holy Spirit, whom the Father will send in my name, he will teach you all things and bring to your remembrance all that I have said to you.' },
    whatThisMeans: 'You are not trying to live the Christian life alone. The same Spirit who raised Jesus from the dead lives inside you. Every prayer is heard, every effort is empowered, every dry season is supervised. Stop trying to manufacture energy you don\'t have. Ask Him for what only He can give.',
    quiz: [
      { q: 'The Holy Spirit is…', options: ['An impersonal force or energy', 'A person — the third person of the Trinity, fully God', 'A high-ranking angel', 'Another name for God\'s power'], correctIdx: 1, explanation: 'The Spirit is a person — He can be grieved, speaks, intercedes, has a will and a mind. He is a He, not an It.' },
      { q: 'What changed about the Spirit\'s presence after Pentecost?', options: ['Nothing changed', 'He took up permanent residence inside every believer', 'He stopped speaking', 'He only came on prophets'], correctIdx: 1, explanation: 'Old Testament: Spirit came upon specific people for specific tasks. After Pentecost: Spirit lives permanently inside every believer.' },
      { q: 'The fruit of the Spirit, according to Galatians 5, includes…', options: ['Wealth, fame, comfort', 'Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control', 'Cleverness, popularity, success', 'Strict rule-keeping'], correctIdx: 1, explanation: 'Nine fruit, all character traits. Not personal achievements — the Spirit\'s work in you over time.' },
      { q: 'How should we respond when the Spirit feels distant?', options: ['Assume He has left', 'Stop praying until feelings return', 'Recognize dry seasons are normal formation; keep showing up', 'Pursue stronger emotional experiences'], correctIdx: 2, explanation: 'He has promised never to leave. Dry seasons are usually deep formation happening below feelings. Keep showing up.' },
      { q: 'What does it mean to "walk by the Spirit" (Galatians 5:16)?', options: ['Try harder to be good', 'Live in active daily dependence on His presence and direction', 'Wait for dramatic experiences', 'Avoid all sin perfectly'], correctIdx: 1, explanation: 'Walking in step with the Spirit = ongoing dependence on His leading, not self-effort manufacturing Christian behavior.' },
    ],
  },

  // ═══════════════════════════ CHURCH HISTORY (3) ══════════════════════════

  {
    id: 'early-church',
    category: 'church-history',
    title: 'The Early Church',
    description: 'How a handful of fishermen and a tentmaker took the gospel to the Roman Empire in one generation.',
    duration: '9 min',
    sections: [
      {
        heading: 'From Upper Room to Empire',
        paragraphs: [
          'In AD 30, there were about 120 disciples gathered in an upper room in Jerusalem (Acts 1:15). By AD 100, there were Christian communities scattered from Spain to India, in nearly every major city of the Roman world. Within three centuries, the religion the Romans first ignored and then persecuted would be the official faith of the emperor himself. No movement in human history grew so far so fast from so little.',
          'How did it happen? Not military force — Christians had no army. Not political clout — they were largely poor and powerless. Not media — there was no printing press. The early church spread because ordinary believers told the truth about Jesus to their neighbors and lived such radically generous, sober, faithful lives that watching them was an apologetic in itself.',
        ],
      },
      {
        heading: 'Persecuted and Multiplying',
        paragraphs: [
          'For nearly three centuries, being a Christian could cost you your life. Nero blamed Christians for the great fire of Rome in AD 64. Domitian banished believers (including the apostle John) for refusing to call him "lord and god." Trajan, Hadrian, Decius, Diocletian — emperor after emperor tried various flavors of persecution, from social exclusion to mass execution in the arena.',
          'And the church grew. Tertullian, writing around AD 200, noticed the pattern: "the blood of the martyrs is the seed of the church." Watching Christians die well — forgiving their killers, singing hymns on the way to the arena, refusing to renounce Jesus when one sentence would have spared them — convinced thousands of pagan onlookers that whatever those Christians had, they wanted it.',
        ],
      },
      {
        heading: 'Caring for the Vulnerable',
        paragraphs: [
          'The Roman world threw newborn babies on the trash heap if they were unwanted, especially girls or the disabled. Christians went to the trash heaps and rescued them. Plague would devastate Roman cities and the wealthy would flee while their slaves were left behind. Christians stayed and nursed the sick at enormous personal cost. The historian Rodney Stark has argued that the early church\'s practical love for the poor, the abandoned, and the dying did as much to convert the empire as its preaching.',
          'When Emperor Julian the Apostate tried in the late 300s to revive paganism, he complained bitterly that pagans could not compete because "the impious Galileans support not only their poor but ours as well." Even the enemies of the church acknowledged that something different was happening among Christians.',
        ],
      },
      {
        heading: 'Setting the Canon and the Creeds',
        paragraphs: [
          'By the end of the apostolic age (around AD 100), all 27 New Testament books had been written, and they were already being copied, circulated, and read in churches. Over the next three centuries, the church recognized which writings were genuinely apostolic (going back to the original eyewitnesses) and which were not. The canon was not invented by a council; it was confirmed by one (Carthage, AD 397) — the books had been functioning as Scripture long before that.',
          'At the same time, the church wrote down the basic content of the faith in creeds — short summaries that could be memorized and recited. The Apostles\' Creed and the Nicene Creed (AD 325/381) are still recited every Sunday in millions of churches. They are not new revelations; they are the church\'s confession of what the Bible has always taught, refined under the pressure of heresies that tried to redefine Christ.',
        ],
      },
    ],
    keyVerse: { ref: 'Acts 1:8', text: 'You will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.' },
    whatThisMeans: 'The Christianity you have inherited was paid for in blood by people who refused to deny Jesus when it cost them everything. Every Bible on a shelf, every church on a corner, every Sunday service is downstream of their faithfulness. Your faith was never solo and was never cheap. Live like it.',
    quiz: [
      { q: 'About how many disciples were gathered after Jesus\'s ascension (Acts 1:15)?', options: ['12', '70', '120', '3,000'], correctIdx: 2, explanation: '120 in the upper room. By AD 100 there were churches across the Roman Empire — one of the most extraordinary growth stories in history.' },
      { q: 'Why did the early church grow despite persecution?', options: ['It had a powerful army', 'Ordinary believers told the truth, lived radically, and died well — converting watchers', 'It was wealthy and influential', 'It had government backing'], correctIdx: 1, explanation: 'Tertullian called it "the blood of the martyrs is the seed of the church." Their lives — and deaths — were the apologetic.' },
      { q: 'What practical care did early Christians provide that the Roman world did not?', options: ['Military protection', 'Care for abandoned babies, the sick, and the poor — even strangers', 'Free education for the wealthy', 'Athletic competitions'], correctIdx: 1, explanation: 'Christians rescued exposed babies from trash heaps and stayed in plague cities to nurse the sick. Even Julian the Apostate admitted this.' },
      { q: 'When were all 27 New Testament books written?', options: ['By the end of the apostolic age (~AD 100)', 'In the 400s', 'During the Reformation', 'In medieval times'], correctIdx: 0, explanation: 'All 27 NT books were written within the lifetime of the first generation of believers, then recognized and confirmed by the church over centuries.' },
      { q: 'The Nicene Creed (AD 325/381) was created to…', options: ['Replace the Bible', 'Confess the basic content of the faith — especially the deity of Christ — against heresies', 'Establish a new religion', 'Document church wealth'], correctIdx: 1, explanation: 'Creeds aren\'t new revelation. They\'re the church\'s confession of what Scripture has always taught, refined under pressure from heresies.' },
    ],
  },

  {
    id: 'reformation',
    category: 'church-history',
    title: 'The Reformation',
    description: 'How a monk\'s 95 questions in 1517 split the Western church and rediscovered the gospel of grace.',
    duration: '9 min',
    sections: [
      {
        heading: 'The Church Before October 31, 1517',
        paragraphs: [
          'By the early 1500s, the Western church had drifted far from its New Testament roots. The Bible was locked in Latin, a language ordinary people could not read. Salvation was framed as a transaction — do enough good works, attend enough masses, and you might shorten your time in purgatory after death. The pope sold "indulgences" — pieces of paper that supposedly reduced punishment for sins. The trade was lucrative; it funded the construction of St. Peter\'s Basilica in Rome.',
          'Into this world walked Martin Luther, a German Augustinian monk and university professor who was tormented by the question, "How can a holy God ever accept a sinful me?" He fasted, prayed, confessed, beat himself with whips. Nothing brought peace. Then, while studying Paul\'s letter to the Romans, he saw something that changed his life and eventually changed the Western world.',
        ],
      },
      {
        heading: 'The Discovery in Romans',
        paragraphs: [
          'Romans 1:17 says, "The righteous shall live by faith." Luther had been reading "the righteousness of God" as the standard God demands of us — terrifying, because no one can meet it. Then it hit him: it is a righteousness God gives, not one He demands. A righteousness received by faith, not earned by works.',
          'Luther later wrote, "I felt myself to be reborn and to have gone through open doors into paradise. The whole of Scripture took on a new meaning." If salvation is a gift received by faith, then the entire transactional system — indulgences, merit-earning, purgatory-shortening — was a structure built on a misunderstanding.',
        ],
      },
      {
        heading: 'The 95 Theses and What Came After',
        paragraphs: [
          'On October 31, 1517, Luther nailed 95 theological questions to the door of the church in Wittenberg — a public invitation to debate. He never intended to start a new church. He just wanted Catholic theology to return to the Bible. But the printing press had been invented seventy years earlier, and within weeks his theses were being read across Europe.',
          'Excommunication followed in 1521. Luther stood before Emperor Charles V at the Diet of Worms and was ordered to recant. His famous answer: "My conscience is captive to the Word of God. I cannot and will not recant anything... Here I stand. I can do no other. God help me. Amen." The reformation he started spread across Europe — Calvin in Geneva, Zwingli in Zurich, Cranmer in England, Knox in Scotland.',
        ],
      },
      {
        heading: 'The Five Solas',
        paragraphs: [
          'The Reformers eventually summarized their recovered understanding of the gospel in five "solas" — Latin for "alone." *Sola scriptura* — Scripture alone is the final authority. *Sola fide* — faith alone is the means of receiving salvation. *Sola gratia* — grace alone is the source of salvation. *Solus Christus* — Christ alone is the mediator between God and man. *Soli Deo gloria* — to God alone be the glory.',
          'These were not new doctrines. They were the rediscovery of what the New Testament had always taught and what the medieval church had partially obscured. Every Protestant denomination since the Reformation has, in some form, traced its theological lineage to these five summary phrases.',
        ],
      },
    ],
    keyVerse: { ref: 'Romans 1:16-17', text: 'For I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes... For in it the righteousness of God is revealed from faith for faith, as it is written, The righteous shall live by faith.' },
    whatThisMeans: 'You can read the Bible in your own language because a German monk discovered grace in Romans and refused to be silent about it. You do not have to earn your way to God. The gospel that lit Luther\'s heart on fire is the same gospel available to you today — by grace alone, through faith alone, in Christ alone.',
    quiz: [
      { q: 'What practice did Luther most directly protest in his 95 Theses?', options: ['Singing hymns', 'The sale of indulgences', 'Reading the Bible in Latin', 'Baptism'], correctIdx: 1, explanation: 'Indulgences — papers sold to supposedly shorten time in purgatory — were the immediate trigger. They funded St. Peter\'s Basilica.' },
      { q: 'What Bible passage especially shaped Luther\'s reformation breakthrough?', options: ['Genesis 1', 'Romans 1:17 — "the righteous shall live by faith"', 'Revelation 22', 'Psalm 23'], correctIdx: 1, explanation: 'Luther saw that "the righteousness of God" is a gift He gives, not a standard He demands — received by faith, not earned by works.' },
      { q: 'On what date did Luther post the 95 Theses?', options: ['October 31, 1517', 'July 4, 1776', 'December 25, 1500', 'January 1, 1600'], correctIdx: 0, explanation: 'October 31, 1517 — Reformation Day. Nailed to the door of the church in Wittenberg, Germany.' },
      { q: 'Which of the following is NOT one of the five solas of the Reformation?', options: ['Sola scriptura (Scripture alone)', 'Sola fide (faith alone)', 'Sola ecclesia (church alone)', 'Soli Deo gloria (glory to God alone)'], correctIdx: 2, explanation: 'The five are: scriptura, fide, gratia, Christus, Deo gloria. "Sola ecclesia" is not one of them — that would be the opposite of the Reformation\'s point.' },
      { q: 'What did Luther say at the Diet of Worms when ordered to recant?', options: ['I will think about it', 'My conscience is captive to the Word of God... Here I stand. I can do no other.', 'I take it all back', 'I need more time'], correctIdx: 1, explanation: 'One of the most famous statements in church history. "Here I stand. I can do no other. God help me. Amen."' },
    ],
  },

  {
    id: 'great-awakening',
    category: 'church-history',
    title: 'The Great Awakening',
    description: 'How God revived a sleepy colonial church and lit a fire that shaped American Christianity.',
    duration: '8 min',
    sections: [
      {
        heading: 'A Church Half Asleep',
        paragraphs: [
          'By the early 1700s, the colonial American church had grown comfortable and cold. Church attendance was still high — it was socially expected — but personal faith was largely formal. Ministers preached dry doctrinal sermons. Most pew-sitters could not have told you when they had last felt a conviction of sin or a thrill of grace. Religion had become a respectable habit, not a living relationship.',
          'Then, starting around 1730 and intensifying through the 1740s, something began to happen in scattered congregations across New England and the middle colonies. People started weeping during sermons. Whole communities turned toward serious prayer. Conversion became the talk of the town. The historians later called it the First Great Awakening.',
        ],
      },
      {
        heading: 'Edwards in Northampton',
        paragraphs: [
          'The man often associated with the start of it was Jonathan Edwards, a Yale-trained pastor in Northampton, Massachusetts. Edwards was not a flashy preacher. He read his manuscripts in a level voice, holding the page close to his eyes. But he preached with a clarity and weight that pierced his hearers. His 1741 sermon "Sinners in the Hands of an Angry God" — preached in Enfield, Connecticut — caused people to grip the pews to keep from falling out as they imagined themselves dangling, like spiders, over hell.',
          'Edwards was not trying to scare people for the sake of fear. He was trying to make the gospel feel as real as it actually is — that judgment is real, that grace is real, and that you can be on either side of the line before lunch tomorrow. People came to him in his study weeping for weeks, asking what they must do to be saved. Many did exactly what Paul told the Philippian jailer: they believed on the Lord Jesus Christ, and they were saved.',
        ],
      },
      {
        heading: 'Whitefield Crosses the Atlantic',
        paragraphs: [
          'Then the Englishman arrived. George Whitefield, an Anglican preacher from Gloucester, sailed to America seven times between 1738 and 1770. He preached in open fields when church buildings were too small or closed to him. He could be heard, contemporaries said, by 25,000 people without amplification. Benjamin Franklin, no believer himself, tested it experimentally and confirmed the claim — and got converted in his giving even when he had decided not to give.',
          'Whitefield preached the new birth. Over and over. You must be born again, he said, quoting John 3. Not religious. Not moral. Born again. Tens of thousands of colonials made decisions for Christ at his open-air meetings. The Awakening cut across denominational lines — Congregationalists, Presbyterians, Baptists, even Anglicans were affected. It is one of the closest things to a national revival America has ever seen.',
        ],
      },
      {
        heading: 'What the Awakening Left Behind',
        paragraphs: [
          'The Awakening reshaped American Christianity in lasting ways. It emphasized personal conversion over inherited religion. It elevated heartfelt preaching over dry orthodoxy. It birthed new schools to train pastors — Princeton, Dartmouth, Brown, Rutgers all trace their founding to Awakening-era churches that needed trained ministers. It produced waves of missionary expansion to Native Americans and, eventually, to the world.',
          'It also seeded the moral conviction that would later end the slave trade. Whitefield himself owned slaves and was inconsistent on the issue, but the spiritual logic of the Awakening — every soul is equally created, equally fallen, equally invited — eventually produced abolitionists like John Newton (the former slave-trader who wrote "Amazing Grace"), William Wilberforce in England, and Charles Finney in America. Revival has consequences. They always show up in how the converted treat the vulnerable.',
        ],
      },
    ],
    keyVerse: { ref: 'Habakkuk 3:2', text: 'O LORD, I have heard the report of you, and your work, O LORD, do I fear. In the midst of the years revive it; in the midst of the years make it known; in wrath remember mercy.' },
    whatThisMeans: 'Revival is not a strategy you engineer — it is what happens when ordinary believers start praying for it earnestly. The same God who revived a cold colonial church can revive yours. Start praying. Start preaching the gospel to yourself. Watch what He does. He is not a God of the past tense.',
    quiz: [
      { q: 'When did the First Great Awakening primarily take place?', options: ['1500s', '1730s-1740s', '1860s', '1950s'], correctIdx: 1, explanation: 'Starting around 1730 and intensifying through the 1740s in the American colonies and Britain.' },
      { q: 'Which pastor is most associated with the New England revival?', options: ['George Washington', 'Jonathan Edwards', 'John Wesley', 'Charles Spurgeon'], correctIdx: 1, explanation: 'Edwards in Northampton, Massachusetts. His sermon "Sinners in the Hands of an Angry God" is one of the most famous in American history.' },
      { q: 'George Whitefield was known for…', options: ['Quiet meditation', 'Preaching to massive open-air crowds across America', 'Writing hymns only', 'Political activism'], correctIdx: 1, explanation: 'Whitefield could be heard by 25,000 people without amplification — Benjamin Franklin tested it. He crossed the Atlantic seven times preaching.' },
      { q: 'What message did Whitefield repeatedly emphasize?', options: ['Be moral', 'You must be born again (John 3)', 'Pay your tithe', 'Obey the king'], correctIdx: 1, explanation: 'New birth. Not religious, not moral — born again. The core message of John 3 that fueled the Awakening.' },
      { q: 'What lasting effect did the Awakening have beyond personal conversion?', options: ['No lasting effects', 'Founded universities, fueled missions, eventually fed the abolitionist movement', 'Started a new religion', 'Ended denominations'], correctIdx: 1, explanation: 'Princeton, Dartmouth, Brown all trace to Awakening-era churches. Newton, Wilberforce, and Finney — abolitionists — grew from its spiritual logic.' },
    ],
  },

  // ════════════════════════ CHRISTIAN LIVING (4) ════════════════════════

  {
    id: 'spiritual-disciplines',
    category: 'christian-living',
    title: 'Spiritual Disciplines',
    description: 'The ordinary habits that make extraordinary believers — prayer, Scripture, fasting, silence, worship.',
    duration: '8 min',
    sections: [
      {
        heading: 'Habits, Not Heroics',
        paragraphs: [
          'Spiritual maturity is not produced by occasional bursts of intensity. It is produced by ordinary habits done consistently over years. Athletes call this training. The Bible calls it spiritual disciplines — practices that put you in the path of grace, where God can work on you.',
          '1 Timothy 4:7 says, "Train yourself for godliness." The word for "train" is *gymnazo* — where we get gymnasium. Same logic. Nobody bench-presses 300 pounds in week one. Nobody becomes a person of deep prayer or biblical wisdom in week one either. The transformation comes slowly, through repeated habits practiced when you do not feel like it.',
        ],
      },
      {
        heading: 'The Core Five',
        paragraphs: [
          'Prayer — talking and listening to God. Daily. Not just when you want something. Adoration (praising), confession, thanksgiving, supplication (asking). Even five disciplined minutes a day, repeated, will reshape your inner life over a year.',
          'Scripture — reading the Bible regularly and seriously. Not skimming for verses. Reading whole chapters, books, the whole Bible eventually. Asking what it says, what it means, what it asks of you. Memorizing key passages.',
          'Silence and solitude — pulling away from noise long enough to hear God. Jesus did this constantly (Luke 5:16). The phone goes off. The earbuds come out. You sit. You let the inner static settle. You wait.',
          'Fasting — voluntarily skipping a meal (or more) to focus on God instead. Hunger is a great teacher. It reminds you that you are not in control. It clears space for prayer that food would have filled.',
          'Worship — gathering with God\'s people regularly to sing, pray, hear the Word taught, take communion, be encouraged. Hebrews 10:25 specifically commands not to neglect this. The Christian life is not a solo project.',
        ],
      },
      {
        heading: 'Why the Discipline Matters',
        paragraphs: [
          'You cannot suddenly produce love, joy, peace, patience, kindness, and self-control on demand when life gets hard. They have to be growing already. The disciplines do not earn anything from God — Christ has already earned everything for you. The disciplines simply place you where the Spirit can do His work over time. You are not paying for grace; you are positioning yourself to receive it.',
          'Think of a sail. The sailor does not produce the wind. But by raising the sail and orienting it correctly, the sailor catches what is already blowing. Spiritual disciplines are sails. The Spirit is the wind. You raise the sail; He moves you.',
        ],
      },
      {
        heading: 'Start Small. Keep Going.',
        paragraphs: [
          'Most people fail at spiritual disciplines because they try to start too big. Read the whole Bible in 30 days. Pray for two hours every morning. Within a week they have burned out and feel like a failure. The wiser path: start tiny, stay consistent. Five minutes of prayer at 7 a.m. for a year will reshape you. Five hours once and never again will not. Pick something you can actually maintain. Then maintain it.',
        ],
      },
    ],
    keyVerse: { ref: '1 Timothy 4:7-8', text: 'Train yourself for godliness; for while bodily training is of some value, godliness is of value in every way, as it holds promise for the present life and also for the life to come.' },
    whatThisMeans: 'The Christian you want to be at 40 is being formed by the disciplines you practice at your current age. Start small. Be consistent. Five minutes daily beats two hours occasionally every time. Pick one discipline you have neglected this year and start it tomorrow. Then keep going.',
    quiz: [
      { q: 'The Greek word translated "train" in 1 Timothy 4:7 (gymnazo) is the root of…', options: ['Gymnasium', 'Gymnasium translation that\'s the same in English', 'Gymnasium / athletic training', 'Symphony'], correctIdx: 2, explanation: 'Gymnazo → gymnasium. Spiritual training works like physical training: ordinary habits done consistently over time.' },
      { q: 'Why do spiritual disciplines matter?', options: ['They earn God\'s love', 'They impress others', 'They position you where the Spirit can do His work over time', 'They make you superior'], correctIdx: 2, explanation: 'You do not earn grace through disciplines. They\'re sails; the Spirit is the wind. You raise the sail; He moves you.' },
      { q: 'According to Hebrews 10:25, what should believers not neglect?', options: ['Owning a Bible', 'Meeting together with God\'s people', 'Wearing the right clothes', 'Reading specific books'], correctIdx: 1, explanation: 'Christianity is not a solo project. Regular worship gathering is commanded for a reason.' },
      { q: 'Jesus\'s practice in Luke 5:16 demonstrates which discipline?', options: ['Long sermons', 'Withdrawing in silence and solitude to pray', 'Public debate', 'Fundraising'], correctIdx: 1, explanation: 'Jesus regularly withdrew to lonely places to pray. Even He, the Son of God, practiced solitude and silence.' },
      { q: 'What is the wisest approach to starting spiritual disciplines?', options: ['Read the whole Bible in 30 days', 'Pray two hours daily from day one', 'Start tiny and stay consistent — small daily practices beat occasional huge efforts', 'Wait until you feel inspired'], correctIdx: 2, explanation: 'Five minutes daily for a year will reshape you. Five hours once and never again will not. Sustainability beats intensity.' },
    ],
  },

  {
    id: 'serving-others',
    category: 'christian-living',
    title: 'Serving Others',
    description: 'Why Christian greatness is measured by feet washed, not titles earned.',
    duration: '7 min',
    sections: [
      {
        heading: 'The Towel Defines Greatness',
        paragraphs: [
          'On the last night before His death, Jesus did something His disciples never forgot. He took off His outer robe, wrapped a towel around His waist, knelt down, and washed the dirty feet of twelve grown men — including the one He knew would betray Him within hours. It was the work of the lowest household slave. The Lord of glory did it.',
          'Then He stood up, put His robe back on, sat down at the table, and said: "Do you understand what I have done to you? You call me Teacher and Lord, and you are right, for so I am. If I then, your Lord and Teacher, have washed your feet, you also ought to wash one another\'s feet" (John 13:12-14). The towel is the most countercultural object in human history. It is the badge of Christian greatness.',
        ],
      },
      {
        heading: 'Why Service Is Hard',
        paragraphs: [
          'Everything in your old nature resists service. Your default operating system whispers: protect yourself, advance yourself, get others to serve you. The cultural water you swim in tells you to build your platform, optimize your time, focus on your goals. None of this is wrong in small doses. All of it is wrong as the engine of your life.',
          'Jesus inverts the whole system. "Whoever would be great among you must be your servant" (Mark 10:43). The greatness He measures is not titles, credentials, or follower counts. It is feet washed when no one is watching. It is the elderly relative visited. The new kid sat with at lunch. The single mother brought groceries. The teammate who is hard to like, befriended.',
        ],
      },
      {
        heading: 'Where to Start',
        paragraphs: [
          'Most Christians fantasize about future big-impact service while neglecting present small-scale service. The pattern in Scripture is the reverse. Be faithful in little, Jesus says, and you will be entrusted with much (Luke 16:10). The mom who serves three exhausted kids in love is doing eternal work. The student who befriends the lonely classmate is doing eternal work. The teen who shovels the elderly neighbor\'s driveway without being asked is doing eternal work.',
          'A practical question: who in your immediate orbit — family, friends, classmates, neighbors — needs something you could provide? Time? Attention? Help with a task? A meal? A ride? A kind word? Start there. Heaven is paying attention.',
        ],
      },
      {
        heading: 'The Reward That Lasts',
        paragraphs: [
          'Jesus said that even a cup of cold water given in His name will not lose its reward (Matthew 10:42). Every small act of love done for the sake of His name is recorded, remembered, and rewarded. The world calls it invisible. Heaven calls it permanent.',
          'And there is a strange happiness that comes from serving — a deeper joy than anything self-focused living produces. Servants are some of the most genuinely happy people in any room. Try it for a week and see. Find one specific person each day and do something kind without telling anyone. Watch what it does to you.',
        ],
      },
    ],
    keyVerse: { ref: 'Mark 10:43-45', text: 'Whoever would be great among you must be your servant, and whoever would be first among you must be slave of all. For even the Son of Man came not to be served but to serve, and to give his life as a ransom for many.' },
    whatThisMeans: 'You will be measured by the towels you picked up, not the titles you held. Find one person this week who has nothing to give you back and do something kind for them anyway. Then do it again. That is how Christian greatness is built — invisibly, repeatedly, with a towel in your hand.',
    quiz: [
      { q: 'On the night before His death, Jesus modeled servant leadership by…', options: ['Giving a long speech', 'Washing His disciples\' feet — the work of the lowest household slave', 'Multiplying the bread again', 'Healing the sick'], correctIdx: 1, explanation: 'John 13. The Lord of glory taking a towel and basin — the most countercultural object lesson in history.' },
      { q: 'According to Mark 10:43, the path to greatness in God\'s kingdom is…', options: ['Power and influence', 'Servanthood', 'Wealth', 'Public recognition'], correctIdx: 1, explanation: 'Inverts every cultural definition of greatness. The kingdom\'s currency is service, not status.' },
      { q: 'Where does Scripture say to begin in service?', options: ['Major international ministry', 'Faithful in little — the people in your immediate orbit', 'Public roles only', 'Wait until you\'re older'], correctIdx: 1, explanation: 'Luke 16:10 — faithful in little, faithful in much. Start with the family, neighbor, classmate God has already placed near you.' },
      { q: 'According to Matthew 10:42, even a cup of cold water given in Jesus\'s name…', options: ['Is meaningless', 'Will not lose its reward', 'Earns salvation', 'Is forgotten quickly'], correctIdx: 1, explanation: 'Every small act of love done in His name is recorded, remembered, and rewarded by heaven.' },
      { q: 'What does Jesus say about the Son of Man\'s mission (Mark 10:45)?', options: ['He came to be served', 'He came to be a political king', 'He came not to be served but to serve, and to give His life as a ransom', 'He came to teach only'], correctIdx: 2, explanation: 'The pattern for Christian service traces straight back to Christ\'s own example — service unto death.' },
    ],
  },

  {
    id: 'integrity-character',
    category: 'christian-living',
    title: 'Integrity & Character',
    description: 'Being the same person in private as you are in public — and why that matters more than talent.',
    duration: '7 min',
    sections: [
      {
        heading: 'The Word "Integrity"',
        paragraphs: [
          'Integrity comes from the Latin *integer* — whole, undivided, complete. A person of integrity is the same person in every setting: at school, at home, on social media, alone in their bedroom at midnight. There are no separate versions running in parallel. What you see is what is.',
          'In an age of curated public images and hidden private lives, integrity is rare. And it is irreplaceable. You can have talent, intelligence, charisma, opportunity — and still wreck your life and the lives of people who trust you if your character is not undivided. The newspapers are full of brilliant people who collapsed because they were two people.',
        ],
      },
      {
        heading: 'Character Is What You Do When No One Is Watching',
        paragraphs: [
          'C.S. Lewis said that integrity is doing the right thing even when no one is watching. The classroom test you could cheat on but do not. The website you could open but close. The lie you could tell that no one would catch but do not. Each tiny choice is a brick being laid in your character. Brick by brick by brick.',
          'The same is true in reverse. Each tiny compromise — the small lie, the small dishonesty, the small unfaithfulness — is also a brick. A character is not built in a single moment. It is laid down over thousands of unwatched moments. By the time the public test comes, your character will have already decided how you respond. The work happens before the moment, not in it.',
        ],
      },
      {
        heading: 'Why Talent Is Not Enough',
        paragraphs: [
          'Proverbs 22:1 says, "A good name is to be chosen rather than great riches." Your reputation is a fragile asset that takes years to build and minutes to destroy. Talent gets you in the room. Character keeps you there. Plenty of talented people lose their jobs, marriages, ministries because their gifts outran their character.',
          'King David is the great case study. Brilliant, brave, gifted with words, anointed by God. He also had a private compromise that grew until it produced adultery and murder. The same David who killed Goliath was the David who killed Uriah. Character was the variable. When Nathan exposed him (2 Samuel 12), David repented deeply — Psalm 51 is the result. God restored him. But the consequences rolled forward through his family for decades. Character has a long shadow.',
        ],
      },
      {
        heading: 'How Character Is Built',
        paragraphs: [
          'There is no shortcut. Character is built by small repeated choices, prayer, accountable relationships, and time. The disciplines we covered earlier all feed into it. Surround yourself with friends who tell you the truth. Be radically honest with God in prayer about temptations. Confess sin quickly when it happens. Cultivate a private life that you would not be ashamed to have made public.',
          'A useful test: would you be okay if a respected friend, your future spouse, or your future kids saw what you just did, said, or watched? If not, that is data. Listen to it.',
        ],
      },
    ],
    keyVerse: { ref: 'Proverbs 10:9', text: 'Whoever walks in integrity walks securely, but he who makes his ways crooked will be found out.' },
    whatThisMeans: 'The person you are becoming in private is the person you will be when the pressure is on. Start building character today through small unwatched choices. Your future self — and the people who will depend on you — is being formed right now in what you do when no one is looking.',
    quiz: [
      { q: 'The word "integrity" comes from a Latin root meaning…', options: ['Strong', 'Whole, undivided, complete', 'Famous', 'Wealthy'], correctIdx: 1, explanation: 'Integer = whole, undivided. A person of integrity is the same person in every setting — no separate public/private versions.' },
      { q: 'C.S. Lewis described integrity as…', options: ['Being famous', 'Doing the right thing even when no one is watching', 'Being talented', 'Having many friends'], correctIdx: 1, explanation: 'Character is built in unwatched moments. Each tiny choice is a brick.' },
      { q: 'According to Proverbs 22:1, what is more valuable than great riches?', options: ['A nice house', 'A good name (reputation)', 'A high-paying job', 'Athletic ability'], correctIdx: 1, explanation: 'Years to build, minutes to destroy. Talent gets you in the room; character keeps you there.' },
      { q: 'David\'s story shows that…', options: ['Talent guarantees success', 'Character matters more than gift — and consequences are long', 'God doesn\'t care about character', 'Only outwardly visible sin matters'], correctIdx: 1, explanation: 'The same David who killed Goliath later killed Uriah. Gift was high; character lapsed. God restored him, but consequences rolled forward for decades.' },
      { q: 'According to Proverbs 10:9, the person who walks in integrity…', options: ['Becomes rich', 'Walks securely', 'Avoids all suffering', 'Is always praised'], correctIdx: 1, explanation: 'Integrity creates a kind of stability that crooked living cannot. Eventually, crooked living is found out.' },
    ],
  },

  {
    id: 'christian-community',
    category: 'christian-living',
    title: 'Christian Community',
    description: 'Why you cannot follow Jesus alone — and how the church is meant to function as family.',
    duration: '7 min',
    sections: [
      {
        heading: 'There Is No Solo Christianity',
        paragraphs: [
          'When you became a Christian, you did not just join a religion. You were adopted into a family. The New Testament uses the word *ekklesia* — the assembly, the gathered community — 114 times. The expectation throughout is that believers belong to a local body of other believers, worship together, eat together, suffer together, and grow together. Solo Christianity is not in the New Testament.',
          'Hebrews 10:25 is direct: "not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near." The author of Hebrews knew that some Christians were starting to drift away from gathering. He treated it as a serious problem. He still does.',
        ],
      },
      {
        heading: 'What the "One Another" Passages Reveal',
        paragraphs: [
          'The New Testament contains over fifty commands using the phrase "one another." Love one another (John 13:34). Encourage one another (1 Thessalonians 5:11). Bear one another\'s burdens (Galatians 6:2). Forgive one another (Colossians 3:13). Confess your sins to one another (James 5:16). Greet one another (Romans 16:16). Be kind to one another (Ephesians 4:32). Be hospitable to one another (1 Peter 4:9).',
          'You cannot obey any of these by yourself. They presuppose other Christians in your life close enough to bear burdens with, confess to, encourage, forgive. The Christian who does not have those people is disobeying — even if unknowingly. Christianity was designed to be received and lived in fellowship.',
        ],
      },
      {
        heading: 'Why Small Groups Matter',
        paragraphs: [
          'Sunday services are necessary but not sufficient. You cannot bear someone\'s burden in a crowd of 300. The early church met in homes, not just in the temple courts (Acts 2:46). Modern small groups — home gatherings of 6-12 believers who meet weekly to study Scripture, pray for each other, and live transparent lives — are the closest thing in most churches to the New Testament pattern.',
          'If you are not in one, ask your church about it. If your church doesn\'t have them, ask why. The depth of Christian transformation that happens in a healthy small group exceeds anything that can happen in the Sunday-only setting. Real spiritual growth is a contact sport. You need other believers in the trenches with you.',
        ],
      },
      {
        heading: 'When Community Is Hard',
        paragraphs: [
          'Christian community is hard. People disappoint you. Conflicts arise. Personalities clash. You will, at some point, want to walk away from your church. Many do. They become church-shoppers, or worse, give up on the institutional church altogether.',
          'Hebrews 10:25 was written exactly for that drift. Stay. Work it out. The church on earth is not perfect because it is made of redeemed sinners still being sanctified. Find a doctrinally faithful church, plant your feet, and build long. Your soul depends on it more than you currently know.',
        ],
      },
    ],
    keyVerse: { ref: 'Hebrews 10:24-25', text: 'And let us consider how to stir up one another to love and good works, not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near.' },
    whatThisMeans: 'You cannot follow Jesus alone. If you are not deeply rooted in a local church and a small group of believers who know you, that is your most important next step. Stop drifting. Plant your feet. Build long. The Christian life is a team sport, and you need a team.',
    quiz: [
      { q: 'How many "one another" commands does the New Testament contain?', options: ['Just a few', '15-20', 'Over 50', 'None'], correctIdx: 2, explanation: 'Over 50 commands using "one another" — love, encourage, bear burdens, forgive, confess. None can be obeyed solo.' },
      { q: 'Hebrews 10:25 specifically commands…', options: ['Reading the Bible daily', 'Not neglecting to meet together', 'Fasting weekly', 'Memorizing creeds'], correctIdx: 1, explanation: 'Not forsaking the assembling. The drift away from gathering was a problem then and still is.' },
      { q: 'In Acts 2:46, the early church met in…', options: ['Only the temple courts', 'Both temple courts AND homes', 'Public marketplaces only', 'Underground caves only'], correctIdx: 1, explanation: 'Large worship and small home gatherings — both. The combination has always been the healthy pattern.' },
      { q: 'Why are small groups important?', options: ['They\'re a modern fad', 'You cannot bear burdens or confess sins in a crowd of 300 — depth requires smaller settings', 'They replace the church', 'They\'re only for new believers'], correctIdx: 1, explanation: 'Sunday gathering is necessary but not sufficient. Real "one another" obedience requires smaller, more transparent settings.' },
      { q: 'What should you do when church relationships get hard?', options: ['Church-shop until it\'s easier', 'Stop attending altogether', 'Plant your feet, work it out, build long', 'Start your own church alone'], correctIdx: 2, explanation: 'The church on earth is imperfect because it\'s made of redeemed sinners. Hebrews 10:25 was written exactly for that drift. Stay.' },
    ],
  },

  // ══════════════════════════ APOLOGETICS (2) ══════════════════════════

  {
    id: 'why-trust-bible',
    category: 'apologetics',
    title: 'Why Trust the Bible',
    description: 'A handful of solid reasons to believe the Bible is what it claims to be — not blind faith.',
    duration: '9 min',
    sections: [
      {
        heading: 'A Book Like No Other',
        paragraphs: [
          'The Bible is not one book. It is 66 books written by about 40 authors over 1,500 years on three continents in three languages. Authors include kings, shepherds, fishermen, prophets, doctors, tax collectors, and a few you would not have invited to dinner. And yet the Bible tells one unified story — a creation, a fall, a covenant, a coming Messiah, a redemption, a restoration. No other ancient book has anything like its scope or coherence.',
          'If you tried today to commission 40 different authors over 1,500 years to write a unified theological narrative, the project would collapse before the first century was out. The Bible\'s internal consistency, after 1,500 years and dozens of independent contributors, is one of the strangest data points in literary history.',
        ],
      },
      {
        heading: 'Manuscript Evidence',
        paragraphs: [
          'Skeptics sometimes claim the Bible has been changed over centuries. The actual manuscript evidence tells a different story. For the New Testament, we have over 5,800 Greek manuscripts, plus over 19,000 in other ancient languages. Compare that to other ancient works: Homer\'s Iliad has about 1,800 surviving copies (and is considered well-attested). Plato\'s writings — 210 copies. Tacitus — 33 copies. The New Testament is the best-attested document of the ancient world by an enormous margin.',
          'Earliest fragment: the John Rylands Papyrus (P52) is a piece of John\'s gospel dated to about AD 125 — within 30 years of the original writing. Some of the earliest near-complete codices (Sinaiticus, Vaticanus) date to the AD 300s. The gap between original composition and surviving manuscript is measured in decades, not millennia. Comparing them across centuries and languages, the textual variation is around 1% and almost entirely insignificant (spelling differences, word order). Nothing material to Christian doctrine is in dispute.',
        ],
      },
      {
        heading: 'Prophecies and Their Fulfillment',
        paragraphs: [
          'The Old Testament contains hundreds of predictions about a coming Messiah, written centuries before Jesus\'s birth. The Dead Sea Scrolls, dated to about 200 BC, contain copies of Isaiah, Daniel, Psalms, and dozens of other books — proving these prophecies were written before Jesus could have engineered His own fulfillments. Yet the Messiah\'s birthplace (Micah 5:2), method of death (Psalm 22, Isaiah 53), pierced hands and feet, casting of lots for clothing, dying among criminals, burial in a rich man\'s tomb — all of it matches Jesus\'s biography.',
          'The mathematical odds of one person fulfilling even eight of those prophecies by accident, according to one calculation, are about 1 in 10^17. The Bible\'s predictive accuracy is not the only reason to trust it, but it is a serious one.',
        ],
      },
      {
        heading: 'It Tells the Truth About Its Heroes',
        paragraphs: [
          'Legendary literature whitewashes its heroes. Sacred founding texts of nations usually portray ancestors as virtuous and brave. The Bible, by contrast, records its heroes\' worst sins in detail. Abraham lied about his wife twice. David committed adultery and murder. Peter denied Jesus three times. Paul oversaw murders of Christians before his conversion. If the Bible were a fabricated PR document for a religion, these details would have been edited out.',
          'The honesty about human failure — including the failures of those who wrote and championed the Bible — is one of the strongest indirect arguments for its authenticity. Truth-tellers tell the truth about themselves. The Bible does.',
        ],
      },
    ],
    keyVerse: { ref: '2 Timothy 3:16-17', text: 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness, that the man of God may be complete, equipped for every good work.' },
    whatThisMeans: 'You can stake your life on this book with intellectual honesty, not in spite of evidence. Read it. Study it. Test what it says against what you observe in reality. Watch what it does to your soul. The book that has shaped more lives than any other in human history is not going to disappoint you.',
    quiz: [
      { q: 'Over how many years was the Bible written?', options: ['100', '500', '1,500', '3,000'], correctIdx: 2, explanation: '66 books, ~40 authors, 1,500 years, 3 continents, 3 languages — one unified story. Unmatched in literary history.' },
      { q: 'How does NT manuscript evidence compare to other ancient works?', options: ['Roughly equal to Homer', 'The best-attested ancient document by an enormous margin', 'Less well-attested', 'No surviving manuscripts'], correctIdx: 1, explanation: '5,800+ Greek manuscripts of the NT. Homer\'s Iliad: ~1,800. Plato: 210. Tacitus: 33. The gap is enormous.' },
      { q: 'The Dead Sea Scrolls (~200 BC) are significant because…', options: ['They contain only forgeries', 'They prove OT prophecies were written before Jesus and could not have been engineered after', 'They contradict the Bible', 'They were never authenticated'], correctIdx: 1, explanation: 'Pre-Christian copies of Isaiah, Daniel, etc. mean Messianic prophecies were already on paper before Jesus could have arranged His own fulfillments.' },
      { q: 'What makes the Bible\'s treatment of its heroes unusual?', options: ['It hides their sins', 'It records their worst sins in detail — unlike legendary literature', 'It makes them perfect', 'It exaggerates their virtues'], correctIdx: 1, explanation: 'Abraham lied. David committed adultery and murder. Peter denied. Paul persecuted. Honest about human failure — strong indirect evidence for authenticity.' },
      { q: 'According to 2 Timothy 3:16, the Bible is…', options: ['Just human wisdom', 'Breathed out by God and profitable for teaching, reproof, correction, training', 'A historical curiosity', 'A collection of legends'], correctIdx: 1, explanation: 'God-breathed (theopneustos). Useful for teaching, reproof, correction, training in righteousness. This is the Bible\'s claim about itself.' },
    ],
  },

  {
    id: 'does-god-exist',
    category: 'apologetics',
    title: 'Does God Exist',
    description: 'Four classic reasons thoughtful believers have always given for the existence of God.',
    duration: '8 min',
    sections: [
      {
        heading: 'The Question Itself Is a Clue',
        paragraphs: [
          'Almost every human culture in history has believed in some kind of divine reality. Atheism as a settled worldview is historically rare — a quirk of the post-Enlightenment West, and even there it remains a minority position globally. The question "does God exist?" is itself evidence that humans across cultures sense something larger than themselves. C.S. Lewis called it "an arrow in our hearts pointing beyond ourselves."',
          'This is not proof — it could be wishful thinking, as some atheists claim. But it is also not nothing. A universal human intuition is data. The burden of explanation falls on someone who claims a universal intuition is universally wrong.',
        ],
      },
      {
        heading: 'The Universe Had a Beginning',
        paragraphs: [
          'For most of recorded history, philosophers assumed the universe was eternal. Modern cosmology — the Big Bang, expansion of the universe, the second law of thermodynamics — has reversed that consensus. The universe demonstrably began. Time itself began. Everything that exists today traces back to a moment when nothing physical existed.',
          'That raises a sharp question: what caused the beginning? Whatever it was, it had to be outside time (since time began with the universe), immaterial (matter began with the universe), unimaginably powerful, and capable of choice (since something rather than nothing was decided upon). Those properties match a particular description: the personal God of biblical theism. This argument is called the *kalam cosmological argument*, and it is one of the cleanest modern arguments for God\'s existence.',
        ],
      },
      {
        heading: 'The Fine-Tuning of the Universe',
        paragraphs: [
          'Physicists have noticed that the universe is calibrated, against unbelievable odds, to support life. The strength of gravity, the cosmological constant, the mass of the electron, the ratio of forces — about 30 different constants must fall within incredibly narrow ranges for stars, planets, and life to be possible. If any one of these were off by a tiny fraction, no atoms would form, or no stars would burn long enough to seed planets, or no chemistry would be possible.',
          'The fine-tuning is so precise that even atheist physicists like Stephen Hawking and Roger Penrose have acknowledged it. The standard alternatives are: (a) chance, but the numbers make it absurdly unlikely; (b) some unproven multiverse with infinite trials; or (c) a Designer who calibrated the dials. The third option remains the most economical explanation.',
        ],
      },
      {
        heading: 'The Reality of Moral Obligation',
        paragraphs: [
          'You believe certain things are genuinely wrong, not just unpopular. Torturing children for fun is wrong — not "I personally dislike it." Murdering innocents is wrong. Promise-keeping is right. Compassion for the suffering is right. These convictions are universal across cultures, despite surface-level variation.',
          'If moral facts are real — and most people, including most atheists, behave as if they are — then they require a moral lawgiver. Naturalism (matter + chance + time) cannot produce real obligation, only feelings about behavior. The fact that you cannot live consistently as a moral relativist, even if you intellectually claim to be one, points to a moral reality that grounds your conscience. That moral reality is best explained by a God whose own character is the standard.',
        ],
      },
    ],
    keyVerse: { ref: 'Romans 1:19-20', text: 'For what can be known about God is plain to them, because God has shown it to them. For his invisible attributes, namely, his eternal power and divine nature, have been clearly perceived, ever since the creation of the world, in the things that have been made.' },
    whatThisMeans: 'You are not believing in God against the evidence. You are believing in God because the evidence — cosmological, scientific, moral, personal — fits the biblical claim better than the alternatives. When skeptical friends or doubts inside your own head challenge you, remember: thoughtful believers have answered these questions for two thousand years. Read. Study. Be ready (1 Peter 3:15).',
    quiz: [
      { q: 'What does modern cosmology say about whether the universe had a beginning?', options: ['It has always existed', 'The universe demonstrably began — Big Bang, expansion, thermodynamics', 'Science cannot tell', 'It begins and ends in cycles'], correctIdx: 1, explanation: 'Modern cosmology has reversed the ancient assumption of an eternal universe. The universe — and time itself — began.' },
      { q: 'The fine-tuning argument observes that…', options: ['Life is impossible', 'About 30 physical constants must fall in incredibly narrow ranges for life to exist', 'The universe is identical everywhere', 'Constants have changed dramatically over time'], correctIdx: 1, explanation: 'Even atheist physicists like Hawking acknowledged the precision. Chance, multiverse, or Designer — the third is most economical.' },
      { q: 'Why is the universal moral intuition (e.g. torturing children is wrong) evidence for God?', options: ['It isn\'t', 'Real moral obligation requires a moral lawgiver — naturalism cannot produce it', 'Morality is a recent invention', 'Only Christians have moral instincts'], correctIdx: 1, explanation: 'Naturalism produces preferences, not obligations. Real "ought" requires a real lawgiver. C.S. Lewis made this argument forcefully.' },
      { q: 'According to Romans 1:19-20, God\'s eternal power and divine nature are…', options: ['Hidden from everyone', 'Clearly perceived in what He has made — since the creation', 'Known only by Israel', 'Available only through visions'], correctIdx: 1, explanation: 'Romans 1: general revelation in nature itself testifies to God. No one is without witness.' },
      { q: '1 Peter 3:15 commands Christians to…', options: ['Avoid all hard questions', 'Always be prepared to give a reason for the hope that is in you', 'Argue with everyone', 'Only quote the Bible'], correctIdx: 1, explanation: 'Apologetics is biblical. Be ready to explain why you believe — with gentleness and respect.' },
    ],
  },

  // ════════════════════════════ BIBLE STUDY (2) ═══════════════════════════

  {
    id: 'how-to-read-bible',
    category: 'bible-study',
    title: 'How to Read the Bible',
    description: 'A simple, repeatable method for reading any passage with insight — observation, interpretation, application.',
    duration: '7 min',
    sections: [
      {
        heading: 'Slow Down First',
        paragraphs: [
          'Most Bible reading fails because we read it the way we read texts and social posts — fast, distracted, looking for one quick takeaway. The Bible was not written that way. Every paragraph has been condensed under enormous editorial pressure. Every word was selected. The way to read it well is to slow down dramatically.',
          'Try this exercise. Pick any short passage — 5-10 verses. Read it three times. The first time, just read normally. The second time, circle every name and place. The third time, underline every verb. You will see things that you walked past on read one. Slowing down is the master discipline of all Bible study.',
        ],
      },
      {
        heading: 'Step 1: Observation — What Does It Say?',
        paragraphs: [
          'Before you ask what it means, ask what it says. Who is the author? Who is the audience? What kind of literature is this — narrative, poetry, letter, prophecy, gospel? What happens in the passage? Who speaks? What is repeated? What contrasts are made?',
          'The Bereans in Acts 17:11 are praised because, after hearing Paul preach, they went home and examined the Scriptures daily to verify what he said. Observation is the long, slow look at the text. You cannot interpret well what you have not actually observed carefully.',
        ],
      },
      {
        heading: 'Step 2: Interpretation — What Does It Mean?',
        paragraphs: [
          'After observation, ask what the author meant when he wrote it. Not "what does it mean to me yet" — that comes later. What did Paul mean when he wrote this to the Romans in AD 57? What did Moses mean when he wrote this to Israel at the edge of the Promised Land?',
          'Context is your best friend. Read the verses before and after. Read the whole chapter. Where possible, read the whole book. The Bible interprets itself when you let it speak in context. A verse ripped from its setting can be twisted to mean almost anything. A verse held in its setting can only mean what the author intended.',
        ],
      },
      {
        heading: 'Step 3: Application — What Does It Do?',
        paragraphs: [
          'James 1:22 is direct: be doers of the Word, not hearers only. After observation and interpretation, you ask: what does this mean for me? What does it ask of me this week? What do I need to confess, change, or believe?',
          'Application is where most Bible study breaks down. People observe and interpret beautifully and then go to lunch. Real application is concrete: a habit changed, a relationship repaired, a sin confessed, a truth held in the moment of testing. Pick one specific application from every passage you study. Write it down. Pray about it. Then live it.',
        ],
      },
    ],
    keyVerse: { ref: 'James 1:22-23', text: 'But be doers of the word, and not hearers only, deceiving yourselves. For if anyone is a hearer of the word and not a doer, he is like a man who looks intently at his natural face in a mirror.' },
    whatThisMeans: 'You can spend the rest of your life with this method and never run out of depth. Observation, interpretation, application — practiced regularly — will turn you into a reader of Scripture, not just someone who reads Scripture occasionally. Start tomorrow morning. Pick a short passage. Read it three times. Begin.',
    quiz: [
      { q: 'The three steps in the basic Bible study method are…', options: ['Read, repeat, recite', 'Observation, interpretation, application', 'Memorize, recite, debate', 'Study, ignore, forget'], correctIdx: 1, explanation: 'O-I-A. What does it say? What does it mean? What does it ask of me? Repeat for life.' },
      { q: 'The Bereans (Acts 17:11) were praised because they…', options: ['Believed everything Paul said immediately', 'Examined the Scriptures daily to verify', 'Refused to listen', 'Argued with Paul'], correctIdx: 1, explanation: 'Eager reception of the word AND careful examination of the Scriptures. Both faith and verification.' },
      { q: 'In the "interpretation" step, you should primarily ask…', options: ['What does this verse mean to me?', 'What did the author mean to the original audience?', 'What feels right today?', 'What do my friends think?'], correctIdx: 1, explanation: 'Author intent first, applied meaning second. A verse means what its author meant. Context, context, context.' },
      { q: 'James 1:22 warns against…', options: ['Reading the Bible at all', 'Being hearers only, not doers — deceiving yourselves', 'Owning multiple translations', 'Studying with others'], correctIdx: 1, explanation: 'Hearing without doing is self-deception. Application matters or the previous steps are wasted.' },
      { q: 'What is the master discipline of all Bible study?', options: ['Speed', 'Slowing down dramatically', 'Memorization', 'Cross-referencing'], correctIdx: 1, explanation: 'The Bible was condensed under enormous editorial pressure. Slow reading is how you actually see what is there.' },
    ],
  },

  {
    id: 'ot-overview',
    category: 'bible-study',
    title: 'Old Testament Overview',
    description: 'The 39 books of the OT in 7 minutes — what they are, what story they tell, and how to read them.',
    duration: '8 min',
    sections: [
      {
        heading: 'Five Major Sections',
        paragraphs: [
          'The 39 books of the Old Testament fall into five major groupings. The *Law* (Genesis through Deuteronomy) — also called the Torah or Pentateuch — covers creation through Moses\'s death. The *Historical books* (Joshua through Esther) trace Israel\'s history from entering the Promised Land through the return from exile, roughly 1400 BC to 400 BC. The *Wisdom and Poetry* books (Job through Song of Solomon) — life-wisdom and worship from Israel\'s greatest thinkers and singers.',
          'The *Major Prophets* (Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel) — large prophetic books warning Israel and Judah and pointing toward the Messiah. The *Minor Prophets* (Hosea through Malachi) — twelve shorter prophetic books filling out the same prophetic centuries. "Minor" refers to length, not importance.',
        ],
      },
      {
        heading: 'The Story Arc',
        paragraphs: [
          'Genesis 1-11 covers creation, fall, flood, and Babel — the cosmic backstory. Genesis 12 narrows: God calls Abraham, promises a great nation, a land, and a blessing to all peoples. Genesis through Deuteronomy traces that family — Abraham, Isaac, Jacob, Joseph in Egypt, Moses leading the exodus, the Law at Sinai, forty years in the wilderness.',
          'Joshua leads the conquest of Canaan. Judges shows the cycle of forgetting and rescue. Samuel sets up the monarchy. David takes the throne; Solomon builds the temple; the kingdom splits. Kings and Chronicles trace the parallel histories of Israel (north) and Judah (south) until both go into exile — Israel to Assyria in 722 BC, Judah to Babylon in 586 BC. Ezra, Nehemiah, and Esther tell the return-from-exile story. Then the prophets, woven throughout, warn, comfort, and predict the coming Messiah.',
        ],
      },
      {
        heading: 'How to Read the OT Christianly',
        paragraphs: [
          'Jesus said on the Emmaus road, "beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself" (Luke 24:27). The whole Old Testament points to Christ. Reading the OT without seeing Jesus is like reading the chapters of a novel without realizing they share a protagonist.',
          'Major OT themes that flow into Christ: the lamb sacrificed in Eden\'s aftermath, Abraham\'s near-sacrifice of Isaac on Moriah (where the temple later stood and Christ was crucified nearby), the Passover lamb in Exodus, the bronze serpent lifted up in the wilderness (which Jesus references in John 3), the Davidic covenant promising an eternal throne, Isaiah 53\'s suffering servant. The OT is not a separate religion that Christianity discarded. It is the first half of the same story.',
        ],
      },
      {
        heading: 'A Reading Plan',
        paragraphs: [
          'Reading the whole Old Testament in a year is achievable at about 3-4 chapters a day. If that\'s too much, start with the highlights: Genesis, Exodus, key chapters of Deuteronomy, Joshua, the David stories in 1-2 Samuel, Psalms (the prayer book of Christianity), Proverbs (life wisdom), Ecclesiastes (existential honesty), Isaiah, Daniel, Jonah. That covers most of the major beats without overwhelming you.',
          'Keep a notebook nearby. Mark questions. Cross-reference. When you read about a sacrifice, ask: how does this point forward to Christ? When you read about a king failing, ask: what does this say about the heart? When you read a prophecy, ask: was this fulfilled in Israel\'s history, in Christ, or yet to come? The OT is one of the great gifts Christianity inherited. Receive it.',
        ],
      },
    ],
    keyVerse: { ref: 'Luke 24:27', text: 'And beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself.' },
    whatThisMeans: 'The OT is not a different religion. It is the first half of your story. Every sacrifice points to the cross. Every king\'s failure points to the King who would not fail. Every prophet\'s warning calls you back to the God who never gave up. Read it. The whole Bible — both testaments — is yours.',
    quiz: [
      { q: 'How many books are in the Old Testament?', options: ['27', '39', '66', '100'], correctIdx: 1, explanation: '39 OT books + 27 NT = 66 in the Protestant Bible. Catholic/Orthodox traditions include additional deuterocanonical books.' },
      { q: 'The first five OT books are called…', options: ['The Gospels', 'The Torah / Pentateuch / Law', 'The Wisdom Books', 'The Prophets'], correctIdx: 1, explanation: 'Genesis through Deuteronomy. Torah (Hebrew) or Pentateuch (Greek) means "five-book Law".' },
      { q: 'What does "Minor Prophets" refer to?', options: ['Less important prophets', 'Length of their books, not importance', 'Prophets to children', 'Failed prophets'], correctIdx: 1, explanation: 'Minor = shorter. Twelve shorter books (Hosea through Malachi). Equally important to the larger prophetic books.' },
      { q: 'According to Luke 24:27, how should we read the OT in light of Christ?', options: ['As outdated and irrelevant', 'Beginning with Moses and all the Prophets, He interpreted everything concerning Himself', 'Only the Psalms apply to Jesus', 'It has no connection to the NT'], correctIdx: 1, explanation: 'The Emmaus road model. Jesus showed that the whole OT points to Him — lamb, temple, kingship, prophecy.' },
      { q: 'Which century did the Babylonian exile of Judah begin?', options: ['1000 BC', '722 BC (that was Israel/north)', '586 BC', 'AD 70'], correctIdx: 2, explanation: 'Israel (north) fell to Assyria in 722 BC. Judah (south) fell to Babylon in 586 BC — the start of the Babylonian exile.' },
    ],
  },

  // ═══════════════════════ THEOLOGY · Batch 2 (3) ═══════════════════════

  {
    id: 'second-coming',
    category: 'theology',
    title: 'The Second Coming & End Times',
    description: 'What Jesus actually said about His return, and how to live in the meantime without losing your mind.',
    duration: '8 min',
    sections: [
      {
        heading: 'He Is Coming Back',
        paragraphs: [
          "Jesus did not leave the question of His return open. The angels at the Ascension delivered the message in one sentence: this same Jesus, who was taken up from you into heaven, will come in the same way as you saw him go (Acts 1:11). Visibly. Bodily. Personally. The early creeds — Apostles' and Nicene — confess it: \"He will come again to judge the living and the dead.\"",
          "Every New Testament writer addresses it. Paul writes about the trumpet sound and the dead in Christ rising first (1 Thessalonians 4). Peter writes about scoffers who will say \"where is the promise of his coming?\" (2 Peter 3:4). John ends the entire Bible with Jesus's words: \"Surely I am coming soon\" (Revelation 22:20). The Second Coming is not a side doctrine. It is the destination the whole story is pointed at.",
        ],
      },
      {
        heading: 'The Signs Jesus Named',
        paragraphs: [
          "In Matthew 24 and Mark 13, Jesus answers His disciples' questions about the end of the age. He names: false messiahs who will mislead many, wars and rumors of wars, famines and earthquakes, persecution of His followers, the gospel preached to all nations, an \"abomination of desolation\" in a holy place, cosmic disturbances. Then the Son of Man appearing on the clouds.",
          "He warns explicitly against date-setting: \"concerning that day and hour no one knows, not even the angels of heaven, nor the Son, but the Father only\" (Matthew 24:36). Every Christian who has set a date has been wrong. The signs are not a calendar — they are a posture. They tell us how to live in the meantime: alert, faithful, doing the master's work.",
        ],
      },
      {
        heading: 'What Different Christians Believe',
        paragraphs: [
          "Faithful Christians disagree about the timing and order of end-time events. Some hold to a pretribulation rapture (the church removed before a 7-year tribulation), some to a post-tribulation rapture (the church goes through it), some to amillennialism (the \"1,000 years\" of Revelation 20 is symbolic of the church age). Pre-millennial / post-millennial / amillennial are technical positions about how Christ's reign relates to a literal millennium.",
          "These are secondary debates among believers who agree on the core: Jesus is coming back, He will judge, He will set all things right, He will dwell with His people forever. Don't get so tangled in the order of events that you forget the point. The point is that He's coming.",
        ],
      },
      {
        heading: 'How to Live Waiting',
        paragraphs: [
          "Jesus's parables about the end all converge on one image: a master who returns. The wise servants are doing their assigned work when he arrives. The foolish are caught unprepared. The faithful are not predicting the date; they are living each day so that whenever He shows up, they will not be ashamed.",
          "Practically, this means: stay in the Word, stay in prayer, stay in fellowship, share the gospel, serve the poor, fight sin, love your neighbor. Not because the end is near (it may not be in your lifetime) — but because the King is real and watching, and the moment of His return will be the moment everything is recalibrated to truth.",
        ],
      },
    ],
    keyVerse: { ref: 'Revelation 22:20', text: 'He who testifies to these things says, Surely I am coming soon. Amen. Come, Lord Jesus!' },
    whatThisMeans: 'You do not need to know the date. You need to be ready. Live every ordinary day as though the King might return before lunch — not in panic, but in steady faithfulness. The story does end. Christ wins. That changes how you handle today.',
    quiz: [
      { q: 'Acts 1:11 says Jesus will return…', options: ['Spiritually only', 'In the same way the disciples saw him go — visibly, bodily', 'Through the actions of believers', 'Only in dreams'], correctIdx: 1, explanation: 'The angels at the Ascension were clear: this same Jesus, visibly and bodily.' },
      { q: 'What does Jesus say about the date of His return (Matthew 24:36)?', options: ['He will reveal it to His apostles', 'Only the Father knows — not even the Son or angels', 'It will be exactly 2,000 years', 'It depends on human readiness'], correctIdx: 1, explanation: 'No one — not even the Son or the angels — knows the day or hour. Date-setting is repeatedly forbidden.' },
      { q: 'Which of the following is NOT one of the signs Jesus named in Matthew 24?', options: ['False messiahs misleading many', 'Wars and rumors of wars', 'Stock market crashes', 'The gospel preached to all nations'], correctIdx: 2, explanation: 'Stock markets aren\'t in the Olivet Discourse. The actual signs are deception, conflict, natural disasters, persecution, global gospel proclamation.' },
      { q: 'What is the right Christian response to disagreement about end-time timing?', options: ['Cut off other Christians who disagree', 'Don\'t care at all', 'Hold the core (He is coming, He will judge, He will renew) and treat order/timing as a secondary debate', 'Pick one view and condemn all others'], correctIdx: 2, explanation: 'Faithful Christians have differed on rapture/millennium order for centuries. The core matters; the schedule is secondary.' },
      { q: 'Jesus\'s parables about His return all converge on what practical instruction?', options: ['Sell everything immediately', 'Predict the date', 'Be found doing the master\'s assigned work whenever He arrives', 'Hide until it\'s safe'], correctIdx: 2, explanation: 'Wise servants are at their post when the master returns. Live every day as though He might come before lunch — not in panic, but in faithfulness.' },
    ],
  },

  {
    id: 'heaven-hell-eternity',
    category: 'theology',
    title: 'Heaven, Hell & Eternity',
    description: 'What the Bible actually teaches about what comes next — and why eternity changes how you live today.',
    duration: '9 min',
    sections: [
      {
        heading: 'Eternity Is Real',
        paragraphs: [
          "Most modern people assume that whatever happens at death, it is brief and uncertain. The Bible insists otherwise. Eternity is real. Every human being lives forever — somewhere. Daniel 12:2 says some will rise to everlasting life and some to everlasting contempt. Jesus uses the same word (*aiōnion*, eternal) for both heaven and hell in Matthew 25:46. The two destinies are durably parallel.",
          "This is uncomfortable. C.S. Lewis put it this way: \"There are no ordinary people. You have never talked to a mere mortal.\" Every person you have ever met is going somewhere forever. Take that seriously, and the way you treat people in line at the coffee shop changes.",
        ],
      },
      {
        heading: 'What Heaven Actually Is',
        paragraphs: [
          "Most people picture heaven as clouds and harps and disembodied souls. That is not the biblical picture. The Bible's picture is a new heavens and a new earth (Isaiah 65:17, 2 Peter 3:13, Revelation 21:1) — God's renewed physical creation, with His people in resurrection bodies, dwelling with Him face to face. The holy city comes down from heaven to earth (Revelation 21:2-3) — the direction of travel is downward, not upward.",
          "Eternal life is not floating. It is the fullness of life as it was meant to be. Work without frustration. Relationships without sin. Worship without distraction. Bodies without decay. The river of life, the tree of life, the face of God — \"His servants will worship him. They will see his face, and his name will be on their foreheads\" (Revelation 22:3-4). The best moments of this life are previews of that life.",
        ],
      },
      {
        heading: 'What Hell Actually Is',
        paragraphs: [
          "Hell is the hardest doctrine in Christianity, and modern people often dismiss it. But Jesus taught it more than anyone else in the Bible. He used three images: outer darkness (Matthew 8:12), unquenchable fire (Mark 9:43), and weeping and gnashing of teeth (Matthew 13:42). The common thread: separation from God, conscious experience, no end.",
          "The most honest summary: hell is what happens when a soul gets, forever, what it spent its life choosing — separation from God, the source of every good thing. C.S. Lewis: \"There are only two kinds of people in the end: those who say to God, 'Thy will be done,' and those to whom God says, in the end, 'Thy will be done.'\" God does not send anyone to hell against their wishes. He honors the choice some have made every day to live without Him.",
        ],
      },
      {
        heading: 'Why It Changes Today',
        paragraphs: [
          "If eternity is real, two things follow. First, evangelism matters infinitely. The friend or family member or stranger you love who does not yet know Christ is heading somewhere they were never made for. You do not have to be aggressive — but you do not have the option of being silent. Pray for them. Tell them. Love them toward Jesus.",
          "Second, your own daily life is being weighed by an eternal scale. \"For we will all stand before the judgment seat of God\" (Romans 14:10). Every Christian will give an account. Not for salvation (that is settled by Christ) but for how we spent the time, the gifts, the money, the influence we were given. Live with eternity behind your eyelids and the day becomes precious.",
        ],
      },
    ],
    keyVerse: { ref: 'Revelation 21:3-4', text: 'Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people, and God himself will be with them as their God. He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning, nor crying, nor pain anymore, for the former things have passed away.' },
    whatThisMeans: 'You are not a mere mortal. The person in line behind you is not either. If eternity is real, evangelism matters infinitely and so does how you spend Tuesday. Live today like it counts forever — because it does.',
    quiz: [
      { q: 'What\'s the biblical picture of the final destination of believers?', options: ['Clouds and harps in disembodied bliss', 'A new heavens and new earth — renewed physical creation, resurrection bodies, God dwelling with people', 'Reincarnation', 'A spiritual realm with no physical reality'], correctIdx: 1, explanation: 'Revelation 21 — new heavens, new earth, holy city coming down. The direction is downward, not upward.' },
      { q: 'Who taught more about hell in the Bible than anyone else?', options: ['Paul', 'Moses', 'Jesus', 'John the Baptist'], correctIdx: 2, explanation: 'Jesus used three images repeatedly — outer darkness, unquenchable fire, weeping and gnashing of teeth.' },
      { q: 'According to Daniel 12:2 and Matthew 25:46, what\'s true of both heaven and hell?', options: ['They are equally pleasant', 'They are both temporary', 'They are both described as eternal (everlasting)', 'They are metaphorical'], correctIdx: 2, explanation: 'The same Greek word (aiōnion / eternal) is used for both destinies. They are durably parallel.' },
      { q: 'C.S. Lewis described two kinds of people in the end. What was his framework?', options: ['Religious vs irreligious', 'Those who say "Thy will be done" to God, and those to whom God says "thy will be done"', 'Rich vs poor', 'Educated vs uneducated'], correctIdx: 1, explanation: 'God honors the choice. He doesn\'t send anyone to hell against their will — He gives them, forever, what they chose every day.' },
      { q: 'Romans 14:10 says every Christian will…', options: ['Be punished for sins', 'Stand before the judgment seat of God to give an account', 'Decide their own eternity', 'Skip judgment entirely'], correctIdx: 1, explanation: 'Not for salvation (settled by Christ) but for how we stewarded what we were given — time, gifts, money, influence.' },
    ],
  },

  {
    id: 'prayer-answers',
    category: 'theology',
    title: 'Prayer & How God Answers',
    description: 'Why prayer matters even though God already knows, and how to read His answers — yes, no, wait, or different.',
    duration: '8 min',
    sections: [
      {
        heading: 'Why Pray If God Already Knows?',
        paragraphs: [
          "It's the question every honest person asks eventually. If God is sovereign and already knows what I need, why am I telling Him? The answer is that prayer is not primarily about informing God. It's about relationship with Him. Jesus tells us to pray \"Our Father\" (Matthew 6:9) — the language of family, not information transfer.",
          "Prayer also moves the world. God has ordained that real prayer produces real results. \"The prayer of a righteous person has great power as it is working\" (James 5:16). He could accomplish His purposes without our prayers, but He has chosen, in love, to do many of them through our prayers. The privilege is real. The participation is real.",
        ],
      },
      {
        heading: 'The Four Answers',
        paragraphs: [
          "God answers every prayer with one of four answers: yes, no, wait, or something better than you asked. The first three are easy to recognize. The fourth — \"different\" — is the one that takes faith to see. Sometimes God answers a prayer in a way the person didn't think to ask for, because He sees a need they didn't see in themselves.",
          "Paul prayed three times for the thorn in his flesh to be removed (2 Corinthians 12:7-9). God's answer: \"My grace is sufficient for you, for my power is made perfect in weakness.\" Not a removed thorn. A reframed thorn. A bigger gift than the one Paul asked for. Look for the \"different\" answers in your own life. They are often where God is most visible.",
        ],
      },
      {
        heading: 'When God Says No',
        paragraphs: [
          "Some prayers are answered with a clear no. Jesus prayed in Gethsemane for the cup to pass. The Father's answer was no — and the result was the salvation of the world (Matthew 26:39). David prayed for his sick child to live; the child died (2 Samuel 12:15-23). Both prayers were heard. Both received a no. Neither was wasted.",
          "When God says no, it's almost never because the prayer was wrong or the faith was small. It's because His view of the situation is bigger than ours. C.S. Lewis again: \"I am sure that if [God] heard our prayers as we wanted them heard, we should have done ourselves harm beyond measure.\" Trust the no. Sometimes it's a kindness you can only see later.",
        ],
      },
      {
        heading: 'The Patterns That Help',
        paragraphs: [
          "Jesus gave us a model in the Lord's Prayer (Matthew 6:9-13). Adoration, His kingdom coming, daily provision, forgiveness, deliverance. Many believers find ACTS helpful: Adoration, Confession, Thanksgiving, Supplication. Some pray Scripture back to God — read a psalm and turn it into prayer line by line. Some keep a prayer journal so they can see God's faithfulness over months and years.",
          "What doesn't help: fancy language, performance, or treating prayer like a vending machine where the right words produce the right outcome. God listens for honesty, not eloquence. Hannah at Shiloh prayed silently with moving lips, and God heard (1 Samuel 1:13-17). Pray the prayer you can actually pray. He hears it.",
        ],
      },
    ],
    keyVerse: { ref: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.' },
    whatThisMeans: 'You don\'t have to pray well to pray. You have to pray honestly. God\'s answers come in four flavors — yes, no, wait, different. Watch for the "different" ones; they are usually where the deepest work happens. He hears every single word, including the ones you can\'t get out loud.',
    quiz: [
      { q: 'Why does prayer matter if God already knows what we need?', options: ['It doesn\'t — Jesus said skip it', 'Because prayer is primarily relationship with God, not information transfer', 'God might forget without reminders', 'It activates our willpower'], correctIdx: 1, explanation: 'Jesus tells us to pray "Our Father" — family language. Prayer is relationship, not memo.' },
      { q: 'What does James 5:16 say about prayer?', options: ['Prayer never accomplishes anything', 'The prayer of a righteous person has great power as it is working', 'Only pray when in trouble', 'Only pastors\' prayers count'], correctIdx: 1, explanation: 'God has ordained that real prayer produces real results. He works through our prayers — not because He has to, but because He chose to.' },
      { q: 'How did God answer Paul\'s prayer for the removal of his "thorn in the flesh" (2 Corinthians 12:7-9)?', options: ['Yes, instantly', 'No, but with "my grace is sufficient — power perfected in weakness"', 'He ignored it', 'Wait'], correctIdx: 1, explanation: 'A "different" answer — bigger than Paul asked for. Reframed grace instead of removed thorn.' },
      { q: 'When God says no to a prayer, why is it usually?', options: ['The prayer was wrong', 'Faith was too small', 'His view of the situation is bigger than ours, and the no is a kindness only visible later', 'God is being mean'], correctIdx: 2, explanation: 'Even Jesus\'s prayer in Gethsemane got a no — and the result was the salvation of the world. Trust the no.' },
      { q: 'What does prayer NOT depend on?', options: ['Honesty', 'Fancy language and performance', 'Being a relationship', 'God\'s love for you'], correctIdx: 1, explanation: 'Hannah prayed silently with moving lips. God hears the prayer you can actually pray.' },
    ],
  },

  // ═══════════════════ CHURCH HISTORY · Batch 2 (3) ═══════════════════

  {
    id: 'nicaea',
    category: 'church-history',
    title: 'The Council of Nicaea',
    description: 'How 318 bishops in AD 325 defined the Trinity — and why it still shapes every Christian creed today.',
    duration: '8 min',
    sections: [
      {
        heading: 'A Crisis Over Christ',
        paragraphs: [
          "In the early 300s, a priest in Alexandria named Arius started teaching that Jesus was the highest of God's creations — but a creation, not God Himself. There was a time, Arius said, when the Son did not exist. The slogan caught fire: \"there was when he was not.\" Churches split. Bishops took sides. The new emperor Constantine, who had just legalized Christianity, watched the empire's most important new religion fracturing on a doctrinal question he didn't fully understand.",
          "If Arius was right, then Jesus was not God incarnate but a divine messenger — closer to the way Islam would later describe Him than to anything the New Testament said. The gospel itself was at stake: only if Jesus is fully God can His death actually pay for sin and bridge the gap between God and humanity.",
        ],
      },
      {
        heading: 'The Council of Nicaea',
        paragraphs: [
          "Constantine called a council. In June AD 325, about 318 bishops gathered in Nicaea (modern Iznik, Turkey). Many bore the scars of recent persecution — eye sockets empty from imperial torture, limbs maimed. They were not Constantine's puppets. They were veterans of the faith, gathered to settle who Jesus is.",
          "Arius presented his case. The opposing view was championed by a young deacon from Alexandria named Athanasius. The council deliberated. The result, after weeks of debate, was overwhelming: only two bishops sided with Arius. The rest produced the Nicene Creed, which states that Jesus is \"of the same substance\" (*homoousios*) as the Father — fully, truly, eternally God.",
        ],
      },
      {
        heading: 'What the Creed Says',
        paragraphs: [
          "The Nicene Creed (refined slightly in AD 381 to its final form) is the most universally accepted Christian statement of faith in history. Catholics, Eastern Orthodox, Protestants, Anglicans, and most Reformed churches recite it. It confesses: one God in three persons. Jesus \"begotten, not made, of one being with the Father.\" The Holy Spirit \"the Lord and giver of life... worshiped and glorified together with the Father and the Son.\"",
          "It also confesses the resurrection, the church (\"one, holy, catholic, and apostolic\"), one baptism, the forgiveness of sins, the resurrection of the dead, and the life of the world to come. In about 220 words it summarizes the irreducible content of the Christian faith. Memorizing it gives you a portable theology.",
        ],
      },
      {
        heading: 'Why It Still Matters',
        paragraphs: [
          "Every generation faces a version of the Arian challenge. Today it shows up as \"Jesus was a great moral teacher, but not God.\" Or \"all paths lead to the same destination.\" The Council of Nicaea's answer remains: if Jesus is not God, He cannot save. The gospel that has changed billions of lives depends on the doctrine the council defended.",
          "When you stand in a service and recite the Nicene Creed, you are speaking words that have been confessed by Christians on every continent for 1,700 years. Athanasius was eventually exiled five times for defending this doctrine. He held his ground. The whole church owes him — and the bishops at Nicaea — a debt that survives every century since.",
        ],
      },
    ],
    keyVerse: { ref: 'Colossians 2:9', text: 'For in him the whole fullness of deity dwells bodily.' },
    whatThisMeans: 'The Christianity you have inherited was not invented yesterday. It was forged at moments like Nicaea by people who could lose everything to defend the truth that Jesus is God. Recite the creed sometimes. You are joining a 1,700-year-old chorus.',
    quiz: [
      { q: 'What did Arius teach about Jesus?', options: ['Jesus was fully God', 'Jesus was a creation of God — the highest, but not God Himself', 'Jesus never existed', 'Jesus and the Father were the same person'], correctIdx: 1, explanation: 'Arius said "there was when he was not" — Jesus as the highest creation but not God. This is what Nicaea rejected.' },
      { q: 'In what year was the Council of Nicaea held?', options: ['AD 50', 'AD 325', 'AD 800', 'AD 1517'], correctIdx: 1, explanation: 'AD 325, called by Emperor Constantine. About 318 bishops gathered.' },
      { q: 'What Greek word did the Nicene Creed use to define Jesus\'s relationship to the Father?', options: ['Logos (Word)', 'Homoousios (of the same substance)', 'Theos (God)', 'Kyrios (Lord)'], correctIdx: 1, explanation: 'Homoousios — same substance. Jesus is "begotten, not made, of one being with the Father."' },
      { q: 'Why was Arianism a threat to the gospel?', options: ['It wasn\'t', 'If Jesus isn\'t fully God, His death cannot actually pay for sin or bridge God and humanity', 'It rejected the Old Testament', 'It denied prayer'], correctIdx: 1, explanation: 'The gospel itself depends on Jesus being God incarnate. Only God can save. Arius\'s Jesus couldn\'t.' },
      { q: 'How long has the Nicene Creed been confessed by Christians?', options: ['About 50 years', 'About 500 years', 'About 1,700 years', 'About 100 years'], correctIdx: 2, explanation: 'AD 325 (refined AD 381) to today — about 1,700 years. The most universally accepted Christian statement of faith in history.' },
    ],
  },

  {
    id: 'great-commission-history',
    category: 'church-history',
    title: 'The Great Commission Through History',
    description: 'How a dozen scared disciples in Jerusalem turned into 2.4 billion Christians across every continent.',
    duration: '8 min',
    sections: [
      {
        heading: 'Jesus\'s Last Words',
        paragraphs: [
          "Matthew ends his gospel on a Galilean mountain. The risen Jesus tells eleven men: \"Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age\" (Matthew 28:19-20). Four imperatives, one promise. The Great Commission.",
          "From an external view, this was absurd. Eleven Galilean peasants, no money, no army, no political backing, told to evangelize the entire world. Within three centuries, Christianity was the official religion of the Roman Empire. Within twenty centuries, it would be the largest religion in human history, present on every continent. The unlikeliest movement on earth.",
        ],
      },
      {
        heading: 'The First Five Centuries',
        paragraphs: [
          "By AD 100, churches existed in Jerusalem, Antioch, Ephesus, Corinth, Rome, Alexandria, and dozens of cities between. By AD 200, Christianity had reached India (the Mar Thoma tradition still traces itself to the apostle Thomas), Ethiopia, North Africa, and Britain. By AD 300, Armenia became the first officially Christian nation in AD 301 — 12 years before Constantine's edict. By AD 500, Patrick had evangelized Ireland. The faith spread through martyrdom, traders, slaves, scholars, monks, and ordinary believers moving across roads built by the empire that crucified the founder.",
          "It also spread through suffering. Tertullian wrote around AD 200: \"The blood of the martyrs is the seed of the church.\" Roman emperors killed Christians sporadically through the second and third centuries. Each persecution, paradoxically, swelled the movement.",
        ],
      },
      {
        heading: 'The Modern Missionary Movement',
        paragraphs: [
          "After centuries of mostly internal expansion within Europe and the Middle East, the modern missionary movement began with William Carey, a self-taught English shoemaker who in 1792 published a pamphlet titled \"An Enquiry into the Obligations of Christians to Use Means for the Conversion of the Heathens.\" He sailed for India in 1793. He translated the Bible into more than 40 languages over his lifetime.",
          "Carey's example sparked Hudson Taylor (China Inland Mission), David Livingstone (Africa), Adoniram Judson (Burma), Lottie Moon (China), Amy Carmichael (India), Jim Elliot (Ecuador), and thousands more. Today, the church has crossed nearly every cultural and linguistic boundary. The most rapidly growing churches in the 21st century are in sub-Saharan Africa, China (despite restrictions), India, Iran, and Latin America.",
        ],
      },
      {
        heading: 'The Commission Is Not Finished',
        paragraphs: [
          "Today, approximately 7,400 \"unreached people groups\" exist — ethno-linguistic communities with less than 2% evangelical Christians. About 3.4 billion people live in those communities. The Great Commission was given to the church as a whole, not to a specialized class of missionaries. Every Christian inherits it.",
          "You may not move overseas. But the people God has placed in your life — coworkers, classmates, neighbors, family — are part of the Commission too. Pray for them by name. Invite them. Tell them honestly what Jesus has done for you. The chain that runs from those eleven men on a Galilean mountain to your story runs through you to the next person.",
        ],
      },
    ],
    keyVerse: { ref: 'Matthew 28:18-20', text: 'All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.' },
    whatThisMeans: 'The Commission did not stop at the eleven. It rolled forward, through martyrs and missionaries and ordinary believers, to your inbox. You are the next link in a chain that has not broken in 2,000 years. Pray for one person who needs Jesus this week. Then introduce them.',
    quiz: [
      { q: 'How many imperatives are in the Great Commission?', options: ['One', 'Four (go, make disciples, baptize, teach)', 'Ten', 'Zero'], correctIdx: 1, explanation: 'Go, make disciples, baptize, teach — with the promise "I am with you always." Four verbs.' },
      { q: 'What was the first officially Christian nation?', options: ['Rome (under Constantine)', 'Armenia (AD 301)', 'Ethiopia', 'England'], correctIdx: 1, explanation: 'Armenia in AD 301 — twelve years before Constantine\'s Edict of Milan. King Tiridates III converted, then his nation.' },
      { q: 'Who is often called the father of the modern missionary movement?', options: ['William Carey (1793, India)', 'Martin Luther', 'John Wesley', 'D.L. Moody'], correctIdx: 0, explanation: 'Self-taught English shoemaker. Translated Bible into 40+ languages. Sailed for India in 1793.' },
      { q: 'What did Tertullian say about persecution and church growth (~AD 200)?', options: ['Persecution destroys faith', 'The blood of the martyrs is the seed of the church', 'Hide until safe', 'Compromise is wisdom'], correctIdx: 1, explanation: 'Each Roman persecution swelled the movement. Watching Christians die well converted thousands of pagans.' },
      { q: 'How many "unreached people groups" still exist today?', options: ['Zero', 'About 100', 'About 7,400 — roughly 3.4 billion people', 'Only 12'], correctIdx: 2, explanation: 'The Commission is not finished. Every Christian inherits it — pray, give, send, or go.' },
    ],
  },

  {
    id: 'modern-christianity',
    category: 'church-history',
    title: 'Modern Christianity',
    description: 'Why there are so many denominations, what most Christians actually agree on, and where the global church stands today.',
    duration: '9 min',
    sections: [
      {
        heading: 'Why So Many Denominations?',
        paragraphs: [
          "There are roughly 33,000 distinct Christian denominations worldwide. That number sounds catastrophic — until you realize most of those differences are about secondary issues (baptism mode, church governance, worship style, end-times timing) and that on the core gospel, the vast majority of these churches agree.",
          "The divisions trace through four major historical fractures: the AD 1054 East-West Schism (Roman Catholic vs Eastern Orthodox over papal authority and theological language), the 1500s Protestant Reformation (Luther, Calvin, the English Reformation under Cranmer), the 1700s evangelical awakenings that produced Methodists, Baptists, and others, and the 1900s charismatic/Pentecostal movement that reshaped global worship.",
        ],
      },
      {
        heading: 'The Four Main Traditions',
        paragraphs: [
          "**Roman Catholic** — the largest Christian body (~1.4 billion). Pope as central authority, sacramental theology, strong continuity with the medieval church, rich liturgy. Holds the Apostles' and Nicene Creeds.",
          "**Eastern Orthodox** — ~220 million, mostly in Eastern Europe, Russia, Greece, and the Middle East. No pope; led by patriarchs. Emphasizes mystery, the divine liturgy, and *theosis* (growing into God's likeness). Same creeds as Catholics.",
          "**Protestant** — ~800 million, in countless denominations: Lutheran, Anglican, Reformed/Presbyterian, Baptist, Methodist, Pentecostal, non-denominational. United by the Reformation solas: Scripture alone, faith alone, grace alone, Christ alone, glory to God alone.",
          "**Independent/Indigenous churches** — ~280 million, particularly in Africa and Asia. Often combine local cultural elements with biblical Christianity. Growing rapidly.",
        ],
      },
      {
        heading: 'What All Faithful Christians Agree On',
        paragraphs: [
          "Despite the denominational fences, there is remarkable agreement on the core. C.S. Lewis called it \"mere Christianity\" — the central beliefs that have united followers of Jesus across centuries and continents:",
          "One God in three persons. Jesus is fully God and fully human. He died on the cross for sin and rose bodily. Salvation is by grace through faith. The Bible is God's authoritative word. The church is Christ's body. Christ will return to judge and to renew all things. There is a real heaven and a real hell. The Holy Spirit lives in every believer. The Apostles' Creed and Nicene Creed summarize these in short form.",
          "If a body of believers affirms these, you can call them brothers and sisters even if you disagree about other things. If they deny these, you are dealing with a different religion that uses Christian vocabulary.",
        ],
      },
      {
        heading: 'Where the Global Church Is Now',
        paragraphs: [
          "For most of the 20th century, the center of Christianity was North America and Europe. That has shifted. The fastest-growing churches now are in sub-Saharan Africa, China (about 100 million believers despite government restrictions), Brazil and Latin America, South Korea, Iran (one of the fastest-growing underground churches in the world), and parts of India and the Philippines.",
          "Western Christianity is in a period of decline in raw numbers and cultural influence — but the global church has never been larger or more diverse. There are more Anglicans in Nigeria today than in England. More Christians worship in Mandarin every Sunday than in any other language. The center of gravity of world Christianity is now somewhere over the Atlantic, drifting south and east. This is not the church dying. This is the Spirit moving where He has always moved — wherever there is hunger for Christ.",
        ],
      },
    ],
    keyVerse: { ref: 'John 17:20-21', text: 'I do not ask for these only, but also for those who will believe in me through their word, that they may all be one, just as you, Father, are in me, and I in you, that they also may be in us, so that the world may believe that you have sent me.' },
    whatThisMeans: 'Denominations are a flawed but mostly normal feature of a global movement. Don\'t let them shake your confidence. The Christ-confessing church is one — fractured at its edges, united at its core. Find a doctrinally faithful local church, plant your feet, and don\'t leave because of secondary disagreements.',
    quiz: [
      { q: 'Roughly how many Christian denominations exist worldwide?', options: ['About 5', 'About 33,000', 'About 100', 'About 500,000'], correctIdx: 1, explanation: 'Most differences are secondary (baptism mode, governance, worship style). On the core gospel, the vast majority agree.' },
      { q: 'The Great Schism of 1054 split Christianity into…', options: ['Catholic vs Protestant', 'Roman Catholic vs Eastern Orthodox', 'Liberal vs Conservative', 'Old vs New Testament churches'], correctIdx: 1, explanation: 'The first major fracture — papal authority and theological language. The Reformation came 500 years later.' },
      { q: 'Which of the following is NOT a core belief all faithful Christians share?', options: ['The Trinity', 'The bodily resurrection of Christ', 'Salvation by grace through faith', 'A specific mode of baptism'], correctIdx: 3, explanation: 'Baptism mode (immersion vs sprinkling) is a secondary debate. The first three are core "mere Christianity."' },
      { q: 'Where are the fastest-growing churches in the world today?', options: ['Western Europe', 'Sub-Saharan Africa, China, Iran, Latin America, South Korea', 'North America', 'Antarctica'], correctIdx: 1, explanation: 'The center of gravity of world Christianity has shifted south and east. There are more Anglicans in Nigeria than in England.' },
      { q: 'Approximately how many believers are in China today?', options: ['10,000', 'About 100 million', '50 million', 'Christianity is illegal there'], correctIdx: 1, explanation: 'About 100 million despite government restrictions. One of the great untold stories of modern Christianity.' },
    ],
  },

  // ═════════════════ CHRISTIAN LIVING · Batch 2 (4) ═════════════════

  {
    id: 'forgiveness',
    category: 'christian-living',
    title: 'Forgiveness',
    description: 'How to forgive what doesn\'t deserve to be forgiven — without pretending it didn\'t happen.',
    duration: '8 min',
    sections: [
      {
        heading: 'The Command That Sounds Impossible',
        paragraphs: [
          "Peter once asked Jesus how many times he should forgive someone who sinned against him. \"As many as seven times?\" he asked, probably feeling generous. Jesus's answer: \"I do not say to you seven times, but seventy-seven times\" (Matthew 18:22). Other translations render it \"seventy times seven.\" Either way, the math is the point: stop counting.",
          "This sounds impossible because some wounds feel unforgivable. Abuse. Betrayal. The friend who lied. The parent who left. The classmate who humiliated you. Christianity does not minimize any of that. But it does insist that holding the wound — feeding it, replaying it, letting it run your inner life — does more damage to you than to them. Forgiveness is the only door out.",
        ],
      },
      {
        heading: 'What Forgiveness Is Not',
        paragraphs: [
          "Forgiveness is not saying \"it was okay.\" If it wasn't okay, don't pretend it was. Forgiveness is not forgetting. God does not have amnesia about your sin; He chooses not to count it. Forgiveness is not trust. Trust is rebuilt by changed behavior over time, and only when the offender is safe. Forgiveness is not staying. If someone is hurting you, leave first, then work on forgiveness from a distance.",
          "Forgiveness is releasing your right to retaliate, to keep the score, to define the offender by their worst moment. It is handing the case over to God — \"Vengeance is mine, I will repay, says the Lord\" (Romans 12:19). You are not the judge. You are stepping out of the courtroom.",
        ],
      },
      {
        heading: 'Why You Have To',
        paragraphs: [
          "Jesus tells a parable in Matthew 18 about a servant forgiven an enormous debt who then refuses to forgive a tiny debt owed to him. The master is furious. The point lands hard: every Christian has been forgiven an infinite debt by God. Refusing to forgive others while accepting that forgiveness is moral incoherence.",
          "There is also a practical reason. Unforgiveness is acid in the soul. You drink it expecting the other person to die. Anne Lamott: \"Not forgiving is like drinking rat poison and then waiting for the rat to die.\" The person who hurt you has moved on. You are the one still bound.",
        ],
      },
      {
        heading: 'How to Actually Do It',
        paragraphs: [
          "Name the wound honestly to God. Not in vague spiritual language. Specifically — \"They said this, they did that, it hurt this much.\" God can handle your rage; He invented the Psalms of lament. Then, with His help, release the right to repay. Not because you feel like it, but as an act of will. You may have to do this dozens of times for the same wound. That is normal.",
          "Pray for the person who hurt you. Even if you have to grit your teeth. Jesus said \"pray for those who persecute you\" (Matthew 5:44) — not because they deserve it, but because praying for someone slowly disassembles your enemy frame of them. Last, be patient with yourself. Forgiveness is a process, not a single event. The wound that took years to inflict may take years to fully heal.",
        ],
      },
    ],
    keyVerse: { ref: 'Ephesians 4:32', text: 'Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.' },
    whatThisMeans: 'The wound is real. The hurt is real. And forgiveness is still the door out. It does not mean what they did was fine; it means you are no longer carrying it. Hand the case to God. Pray for them through gritted teeth. Repeat as many times as it takes.',
    quiz: [
      { q: 'How many times does Jesus say to forgive (Matthew 18:22)?', options: ['Seven times', 'Seventy-seven (or seventy times seven) — stop counting', 'Three times', 'Only once'], correctIdx: 1, explanation: 'The math is the point — stop counting. Forgiveness is not a budget you spend down.' },
      { q: 'Which of the following IS forgiveness?', options: ['Saying it was okay', 'Forgetting it happened', 'Releasing your right to retaliate, handing the case to God', 'Immediately restoring trust'], correctIdx: 2, explanation: 'Forgiveness is releasing the right to repay. Trust is separate — rebuilt by changed behavior over time.' },
      { q: 'What does Romans 12:19 say about vengeance?', options: ['Take revenge quickly', 'Vengeance is mine, says the Lord — I will repay', 'Vengeance is impossible', 'Forgiveness means no consequences ever'], correctIdx: 1, explanation: 'You\'re stepping out of the courtroom. God is the judge — and a better one than you would be.' },
      { q: 'What metaphor did Anne Lamott use for unforgiveness?', options: ['A locked door', 'Drinking rat poison and waiting for the rat to die', 'A weight you can\'t lift', 'An infinite loop'], correctIdx: 1, explanation: 'The person who hurt you has moved on. You\'re the one still bound. Unforgiveness damages the unforgiving more than the unforgiven.' },
      { q: 'According to the lesson, forgiveness is best understood as…', options: ['A one-time event', 'A process — you may have to do it dozens of times for the same wound', 'Something only saints can do', 'Optional'], correctIdx: 1, explanation: 'Be patient with yourself. The wound that took years to inflict may take years to fully heal.' },
    ],
  },

  {
    id: 'dating-relationships',
    category: 'christian-living',
    title: "Dating & Relationships God's Way",
    description: 'How to date as a Christian — without the legalism, without the chaos, with eyes open.',
    duration: '9 min',
    sections: [
      {
        heading: 'Start With the End in Mind',
        paragraphs: [
          "Christian dating is not just \"normal dating but no sex.\" It is a different category. The end of dating is not entertainment; it is to figure out whether this person should become your spouse. If marriage isn't on the table — because of age, season, readiness, or character — there's no point in performing the simulation of a relationship that isn't going anywhere.",
          "This sounds intense, especially in a culture where teens \"date\" for six weeks at a time. But starting with the end in mind frees you. It means you can be a friend to many people without forcing every cute classmate into a romantic frame. It means when you do date someone, you take it seriously. It means you are not auditioning your future for entertainment now.",
        ],
      },
      {
        heading: 'What to Look For',
        paragraphs: [
          "The single most important question about a potential partner is: do they love Jesus more than they love me? Anyone who loves you more than they love Jesus is borrowing from a tank that will eventually run dry. Anyone who loves Jesus first will love you out of an inexhaustible reserve.",
          "Beyond that: 2 Corinthians 6:14 warns Christians not to be \"unequally yoked\" with unbelievers. It is not snobbery; it is realism. The most important decisions of your life — how to raise kids, how to handle suffering, what to die for — will be unrecognizable to a partner who does not share your faith. Look for character, faith, sense of calling, kindness to weak people, honesty under pressure, response to authority, and how they treat their parents. Looks fade. Character compounds.",
        ],
      },
      {
        heading: 'The Hard Parts: Sex and Boundaries',
        paragraphs: [
          "The Bible is clear that sex belongs inside marriage (1 Corinthians 6:18-20, Hebrews 13:4). This is not because sex is bad — it's because sex is so powerful that it requires the container of lifelong covenant. Outside that container, it tears people apart. Studies confirm what Scripture said three thousand years ago: cohabitation before marriage correlates with higher divorce rates, and the number of premarital sexual partners correlates with marital dissatisfaction.",
          "Practical boundaries: set them in your head before you're alone with someone, not in the moment. Decide what you will and won't do before your bloodstream is full of dopamine. Date in public. Be home by a reasonable time. Don't get drunk. If you have already crossed lines — and many have — God forgives. Confession, repentance, and a fresh start are always available. \"If we confess our sins, he is faithful and just to forgive us\" (1 John 1:9).",
        ],
      },
      {
        heading: 'Breaking Up Without Wreckage',
        paragraphs: [
          "Most dating relationships end. That is normal. Breaking up is not a failure; it is a discovery — you learned this was not the person, and you saved both of you from a much worse mistake.",
          "Break up in person when possible. Be honest but kind. Don't slow-fade. Don't ghost. Don't humiliate them publicly afterward. Take time alone before the next relationship — a rule of thumb is one month single per year of dating, or at least a few months no matter what. Read Scripture. Talk to wise older Christians. Pray about what you learned. Then, if and when it's time, try again — wiser.",
        ],
      },
    ],
    keyVerse: { ref: '2 Corinthians 6:14', text: 'Do not be unequally yoked with unbelievers. For what partnership has righteousness with lawlessness? Or what fellowship has light with darkness?' },
    whatThisMeans: 'Date with the end in mind. Look for someone who loves Jesus more than they love you. Set boundaries before you need them. Break up kindly when it\'s time. None of this is restriction — it\'s a path to something genuinely good. The world\'s playbook produces wreckage. God\'s playbook produces marriages worth having.',
    quiz: [
      { q: 'What is the right "end" of Christian dating?', options: ['Entertainment', 'To figure out whether this person should become your spouse', 'Social status', 'Sexual experience'], correctIdx: 1, explanation: 'If marriage isn\'t on the table — because of age, season, or character — there\'s no point in dating someone now.' },
      { q: 'What\'s the single most important question about a potential partner?', options: ['How attractive are they?', 'Do they love Jesus more than they love me?', 'How much money do they have?', 'Are they popular?'], correctIdx: 1, explanation: 'Anyone who loves you more than Jesus is borrowing from a tank that runs dry. Anyone who loves Jesus first loves you from an inexhaustible reserve.' },
      { q: 'Why does 2 Corinthians 6:14 warn against being "unequally yoked"?', options: ['Snobbery', 'Realism — the most important life decisions will be unrecognizable to a partner who doesn\'t share your faith', 'Cultural prejudice', 'It doesn\'t — that\'s a misreading'], correctIdx: 1, explanation: 'How to raise kids, handle suffering, what to die for — these decisions need shared foundations.' },
      { q: 'Why does the Bible reserve sex for marriage?', options: ['Sex is bad', 'Sex is so powerful it requires the container of lifelong covenant — outside that, it tears people apart', 'God is restrictive', 'Old cultural rule with no current relevance'], correctIdx: 1, explanation: 'Not because sex is bad, but because it\'s too powerful for anything less than a marriage covenant.' },
      { q: 'When breaking up, the lesson recommends…', options: ['Ghost them', 'Slow-fade', 'Be honest and kind, in person when possible, then take time alone before the next relationship', 'Make a scene online'], correctIdx: 2, explanation: 'Most dating ends. Breaking up is a discovery, not a failure. Take time alone, learn, then try again — wiser.' },
    ],
  },

  {
    id: 'social-media-faith',
    category: 'christian-living',
    title: 'Social Media & Christian Life',
    description: 'How to use the feed without letting the feed use you — wisdom for a tool the Bible never imagined.',
    duration: '8 min',
    sections: [
      {
        heading: 'A Tool the Bible Never Imagined',
        paragraphs: [
          "Scripture does not mention TikTok, Instagram, or Snapchat. But it has enormous amounts to say about the heart — and social media is a heart accelerator. It amplifies whatever was already there. Insecurity becomes worse. Comparison becomes constant. Anger becomes performative. Vanity becomes scalable. The platform is not neutral; it is engineered to maximize the attention you spend on it, often by exploiting the worst parts of human psychology.",
          "That doesn't mean Christians must leave social media. It means we have to use it like an adult uses a power tool — eyes open, with a job in mind, putting it down when finished. The default mode (passive, infinite scroll, comparison) is bad for almost everyone, especially teens and young adults.",
        ],
      },
      {
        heading: 'What Studies Confirm',
        paragraphs: [
          "The data is increasingly stark. Teen girls who spend more than 3 hours per day on social media show roughly double the rates of depression and anxiety as those who spend less than an hour. The U.S. Surgeon General issued a 2023 advisory warning of \"a profound risk of harm to the mental health and well-being of children and adolescents.\" The rise in teen mental health crises closely tracks smartphone and social media adoption (2010-2015 onward).",
          "The mechanisms are predictable: algorithmic amplification of negativity, social comparison with curated highlight reels, sleep disruption from late-night use, reduced face-to-face time. None of this is moralistic hand-wringing — it is the conclusion of the researchers who originally believed these platforms would be neutral or beneficial.",
        ],
      },
      {
        heading: 'What the Bible Says About the Heart',
        paragraphs: [
          "\"Above all else, guard your heart, for everything you do flows from it\" (Proverbs 4:23). The feed is constant input directly into your heart. If you don't curate it, the algorithm will — and the algorithm is optimized for engagement, not your flourishing.",
          "\"Whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things\" (Philippians 4:8). Audit your feed against that verse. If a follow makes you angry, anxious, lustful, or envious every time you see it, unfollow. Your inputs shape your outputs.",
        ],
      },
      {
        heading: 'Practical Wisdom',
        paragraphs: [
          "Set time limits — most phones have screen-time tools. Keep phones out of the bedroom at night. Do not check social media first thing in the morning; that decision determines what colonizes your brain for the rest of the day. Be slow to post when emotional. Never argue theology or politics in comments — no one has ever changed their mind from a comment war.",
          "And remember: every minute you spend on someone else's life is a minute you didn't spend on your own. The most striking thing about the heroes of the Bible is that they were not famous in their time. David was a shepherd. Mary was a teenager in a backwater village. They built things that lasted. Your real life — your friendships, your skills, your prayer life, your service to people in front of you — is the only life God has assigned you. The feed is not it.",
        ],
      },
    ],
    keyVerse: { ref: 'Philippians 4:8', text: 'Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.' },
    whatThisMeans: 'You don\'t have to delete every app. You have to use them like an adult with a job to do, then put them down. Audit your follows. Set limits. Keep phones out of the bedroom at night. Your real life — the people in front of you, the skills you\'re building, the prayer life you\'re developing — is the only life God assigned you. The feed is not it.',
    quiz: [
      { q: 'According to the U.S. Surgeon General\'s 2023 advisory, social media poses what risk to teens?', options: ['No measurable risk', 'A profound risk of harm to mental health and well-being', 'Only a risk if used illegally', 'Risk only to kids under 10'], correctIdx: 1, explanation: 'The data is increasingly clear: depression and anxiety roughly double for teens spending >3 hours/day on social media.' },
      { q: 'What does Proverbs 4:23 say about the heart?', options: ['Ignore it', 'Above all else, guard your heart — for everything you do flows from it', 'It is unreliable', 'Replace it with reason'], correctIdx: 1, explanation: 'If you don\'t curate your inputs, the algorithm will — and it\'s optimized for engagement, not your flourishing.' },
      { q: 'What standard does Philippians 4:8 give for what we should think about?', options: ['Whatever is entertaining', 'Whatever is true, honorable, just, pure, lovely, commendable, excellent, praiseworthy', 'Whatever is popular', 'Whatever feels good'], correctIdx: 1, explanation: 'Audit your feed against this verse. If a follow makes you angry, anxious, or envious every time, unfollow.' },
      { q: 'Which is NOT a practical recommendation from this lesson?', options: ['Set time limits', 'Keep phones out of the bedroom at night', 'Argue theology in comments to convert people', 'Be slow to post when emotional'], correctIdx: 2, explanation: 'No one has ever changed their mind from a comment war. That\'s not where evangelism happens.' },
      { q: 'What\'s the bigger point about social media?', options: ['Quit forever', 'Use it constantly', 'Your real life — the people in front of you, the skills you\'re building, the prayer life you\'re developing — is the only life God assigned you', 'It doesn\'t matter'], correctIdx: 2, explanation: 'Every minute on someone else\'s life is a minute not on your own. The feed is not your life.' },
    ],
  },

  {
    id: 'handling-doubt',
    category: 'christian-living',
    title: 'Handling Doubt Without Losing Faith',
    description: 'Doubt is normal. Many heroes of the Bible had it. Here\'s how to walk through doubt without it destroying your faith.',
    duration: '8 min',
    sections: [
      {
        heading: 'The People Who Doubted',
        paragraphs: [
          "John the Baptist was the greatest prophet Jesus ever named — and he doubted. From prison, awaiting execution, he sent disciples to ask Jesus: \"Are you the one who is to come, or shall we look for another?\" (Matthew 11:3). Thomas, the disciple, refused to believe in the resurrection until he could touch the wounds. The psalmist asks \"How long, O Lord? Will you forget me forever?\" (Psalm 13:1).",
          "Doubt is not the opposite of faith. Unbelief — a settled refusal to consider — is the opposite of faith. Doubt is the wrestling that often *strengthens* faith. If your parents or church told you doubt was dangerous, they meant well, but they were partly wrong. Doubt that is brought into the light, asked honestly, and pursued with rigor is one of the chief ways God matures believers.",
        ],
      },
      {
        heading: 'Where Doubt Usually Comes From',
        paragraphs: [
          "Most doubt is not actually intellectual, even when it sounds intellectual. Most doubt comes from one of three sources. First: suffering. Something bad happened, and the easy slogans of childhood faith collapsed under the weight. Second: cultural pressure. Smart people around you act like Christianity is silly, and you feel embarrassed. Third: hidden sin. You're living in a way that contradicts your faith, and doubt becomes the rationalization for the lifestyle.",
          "Diagnose your doubt honestly. If it is intellectual, study. If it is suffering, lament and seek a wise friend. If it is sin, repent. The treatment depends on the source. The same Tylenol does not cure both a broken arm and a fever.",
        ],
      },
      {
        heading: 'What To Do With Honest Questions',
        paragraphs: [
          "Bring them into the light. Doubt thrives in darkness, in 3 a.m. spirals, in the unspoken anxiety you don't dare voice. Write the doubt down explicitly: \"I'm not sure I believe X because Y.\" Then take it to (a) Scripture, (b) a wise older Christian, (c) a substantive book or podcast. Don't try to handle it alone in your head.",
          "Read C.S. Lewis (*Mere Christianity*, *The Problem of Pain*). Read Tim Keller (*The Reason for God*). Read Lee Strobel (*The Case for Christ*). Christianity has answered the hard questions for 2,000 years, often by smarter people than the social media accounts dunking on faith today. The answers are not always emotionally satisfying, but they are intellectually serious.",
        ],
      },
      {
        heading: 'Faith Through the Fog',
        paragraphs: [
          "Sometimes doubt is a season, not a crisis. You may not feel God for weeks or months. Many great Christians — Mother Teresa, C.S. Lewis after his wife died — described long stretches of spiritual dryness. Keep showing up. Read Scripture even when it feels flat. Pray even when it feels like the words are bouncing off the ceiling. Worship with God's people even when you'd rather sleep in. Faith is not a feeling. It is allegiance to what you have seen to be true, even when the feeling temporarily evaporates.",
          "Jude 22 gives the church a simple instruction: \"have mercy on those who doubt.\" If you doubt, you are not a second-class Christian. If a friend doubts, do not panic and do not lecture. Be patient. Pray. Walk with them. Faith is a journey, and the doubts that come on the way are often the very tools God uses to deepen it.",
        ],
      },
    ],
    keyVerse: { ref: 'Mark 9:24', text: 'I believe; help my unbelief!' },
    whatThisMeans: 'Doubt is normal, not disqualifying. The same disciple who saw Jesus walk on water also asked for proof of the resurrection. Diagnose the source — intellectual, suffering, or hidden sin — and treat accordingly. Bring doubt into the light. Read serious answers. Keep showing up. The faith on the other side of honest doubt is sturdier than the faith that never wrestled.',
    quiz: [
      { q: 'Who, from prison and facing execution, sent disciples to ask Jesus "are you really the one"?', options: ['Peter', 'John the Baptist', 'Paul', 'Stephen'], correctIdx: 1, explanation: 'Matthew 11:3. The greatest prophet Jesus ever named, doubting at the lowest moment. Doubt is not disqualifying.' },
      { q: 'What is the actual opposite of faith?', options: ['Doubt', 'Unbelief — settled refusal to consider', 'Worship', 'Knowledge'], correctIdx: 1, explanation: 'Doubt wrestles. Unbelief settles. The Bible is patient with the first and warns against the second.' },
      { q: 'What are the three most common sources of doubt named in this lesson?', options: ['Money, fame, power', 'Suffering, cultural pressure, hidden sin', 'School, work, family', 'Music, movies, books'], correctIdx: 1, explanation: 'Diagnose honestly. The same treatment doesn\'t fix all three. Intellectual doubt needs study; suffering needs lament; sin needs repentance.' },
      { q: 'What does Jude 22 say about doubters?', options: ['Excommunicate them', 'Have mercy on those who doubt', 'Argue them into faith', 'Ignore them'], correctIdx: 1, explanation: 'If you or a friend doubts — be patient, walk with them, don\'t panic. Faith is a journey.' },
      { q: 'In a season of spiritual dryness, what should a Christian do?', options: ['Walk away — clearly God isn\'t real', 'Keep showing up — read Scripture, pray, worship with God\'s people even when it feels flat', 'Switch religions', 'Wait for the feeling to come back before doing anything'], correctIdx: 1, explanation: 'Faith is allegiance to what you have seen to be true, not a feeling. Many great Christians described long stretches of dryness.' },
    ],
  },

  // ═══════════════════ APOLOGETICS · Batch 2 (3) ═══════════════════

  {
    id: 'resurrection-evidence',
    category: 'apologetics',
    title: 'Resurrection — Historical Evidence',
    description: 'Why even most non-Christian historians accept the basic facts surrounding the resurrection — and what those facts demand.',
    duration: '9 min',
    sections: [
      {
        heading: 'The Claim That Should Be Easy to Disprove',
        paragraphs: [
          "Christianity rises or falls on a single historical claim: that Jesus of Nazareth was crucified, buried, and three days later physically rose from the dead. Paul says it himself: \"if Christ has not been raised, then our preaching is in vain and your faith is in vain\" (1 Corinthians 15:14). Christianity is not a philosophy that survives if its founder didn't get up. It survives only if He did.",
          "This makes the religion uniquely falsifiable. Disprove the resurrection — produce a body, find a confession of fraud, demonstrate a coherent natural explanation — and the religion collapses. For 2,000 years, smart, motivated people have tried. None have succeeded.",
        ],
      },
      {
        heading: 'The Facts Most Historians Accept',
        paragraphs: [
          "Even skeptical New Testament scholars (Bart Ehrman, Gerd Lüdemann, others who do not personally believe in the resurrection) accept what historians call the \"minimal facts\": Jesus was crucified under Pontius Pilate around AD 30-33; His tomb was found empty by His female followers a few days later; multiple disciples claimed to see Him alive afterward (including individuals like Peter and Thomas, groups like the Twelve, women, more than 500 at once per Paul, and former skeptics like James His brother and Paul of Tarsus); and the earliest disciples — who were in the best position to know whether they had made up the story — went on to suffer and in many cases die for their claim, with no apparent earthly motive for the fabrication.",
          "These are not Sunday school facts. They are historical conclusions accepted across the ideological spectrum.",
        ],
      },
      {
        heading: 'The Theories That Don\'t Work',
        paragraphs: [
          "**Stolen body** — Matthew 28:13 notes this was the earliest counter-explanation. But it requires terrified, scattered disciples to outwit a Roman guard at a sealed tomb, then somehow inspire one another to risk torture and death for a corpse they hid.",
          "**Wrong tomb** — But the women, the Jewish authorities, and the Romans could all have produced the right tomb in days. They didn't, because there was no body in any tomb.",
          "**Hallucinations** — Hallucinations are individual experiences, not group experiences. They don't appear to skeptics like James and Paul. And hallucinations don't leave empty tombs.",
          "**Swoon theory (Jesus didn't really die)** — Asks us to believe a man who was scourged, crucified, and pierced through the side with a spear later revived in a cold tomb, rolled away a multi-ton stone, overpowered a Roman guard, and walked miles on freshly nailed feet to convince His disciples He had triumphed over death. Roman soldiers were professional executioners. He died.",
        ],
      },
      {
        heading: 'What the Best Explanation Is',
        paragraphs: [
          "The cumulative case from N.T. Wright, William Lane Craig, and many others is straightforward: the simplest explanation that accounts for all the facts is that Jesus actually rose from the dead. Empty tomb + multiple independent appearances + transformed disciples + sudden growth of the church in the same city where He was executed — the resurrection is the explanation that makes the most pieces fit.",
          "You do not have to be a historian to find the case persuasive. Read Lee Strobel's *The Case for Christ* — a former atheist journalist's investigation. Read N.T. Wright's *The Resurrection of the Son of God* — 800 pages of academic rigor. The evidence is not the kind that compels belief at gunpoint. It is the kind that, examined honestly, makes faith deeply reasonable.",
        ],
      },
    ],
    keyVerse: { ref: '1 Corinthians 15:3-6', text: 'For I delivered to you as of first importance what I also received: that Christ died for our sins in accordance with the Scriptures, that he was buried, that he was raised on the third day in accordance with the Scriptures, and that he appeared to Cephas, then to the twelve. Then he appeared to more than five hundred brothers at one time, most of whom are still alive.' },
    whatThisMeans: 'Christianity is uniquely falsifiable — show a body and the whole thing collapses. 2,000 years in, no one has done it. The historical case is not magic-thinking. It is one of the most evidence-backed claims about an ancient figure that exists. When skeptics ask, you can answer with confidence.',
    quiz: [
      { q: 'What does 1 Corinthians 15:14 say about the resurrection?', options: ['It\'s a metaphor', 'If Christ has not been raised, our preaching is in vain and your faith is in vain', 'It doesn\'t matter historically', 'Only the spiritual resurrection counts'], correctIdx: 1, explanation: 'Christianity rises or falls on this claim. Paul stakes the entire religion on it.' },
      { q: 'How many people did Paul say saw the risen Jesus at one time (1 Corinthians 15:6)?', options: ['12', '50', 'More than 500 — most still alive when he wrote', 'Only Peter'], correctIdx: 2, explanation: '"Most of whom are still alive" — Paul was essentially inviting his readers to check with the witnesses.' },
      { q: 'Which is NOT one of the "minimal facts" most historians accept?', options: ['Jesus was crucified under Pilate', 'His tomb was found empty', 'Disciples claimed to see Him alive', 'Pilate personally converted to Christianity'], correctIdx: 3, explanation: 'The first three are accepted across the ideological spectrum. The fourth is not historical.' },
      { q: 'What\'s the main problem with the "hallucination theory"?', options: ['Hallucinations don\'t exist', 'Hallucinations are individual experiences, not group — and don\'t leave empty tombs', 'Christians invented the term', 'It actually works perfectly'], correctIdx: 1, explanation: 'Group hallucinations of the same person aren\'t a real phenomenon. And hallucinations can\'t empty tombs.' },
      { q: 'What\'s the best historical explanation for all the facts?', options: ['Mass conspiracy', 'Group hallucinations', 'That Jesus actually rose from the dead', 'No one really knows'], correctIdx: 2, explanation: 'The simplest explanation that accounts for empty tomb + multiple appearances + transformed disciples + sudden church growth in Jerusalem is exactly what the disciples claimed.' },
    ],
  },

  {
    id: 'why-suffering',
    category: 'apologetics',
    title: 'Why Does God Allow Suffering?',
    description: 'The oldest, hardest question — and the answers Christianity actually gives. Not a dodge, not a cliché.',
    duration: '9 min',
    sections: [
      {
        heading: 'The Question Behind Most Doubt',
        paragraphs: [
          "If God is all-powerful and all-loving, why is there cancer? Why are there school shootings? Why was that child abused? The question is at least 3,000 years old — the book of Job, the laments of the psalmists, Habakkuk yelling at God for ignoring injustice. It is not a modern problem. It is the deepest problem in any worldview that posits a good God.",
          "Most people who have lost their faith point to suffering as the precipitating reason. So this is not a side issue. It is the question. And Christianity does not duck it. It actually has the most substantive answers of any worldview — but those answers require patience to receive.",
        ],
      },
      {
        heading: 'The Free Will Answer',
        paragraphs: [
          "Most evil in the world is moral evil — caused by human choices. War. Abuse. Theft. Lies. Neglect. God could have made a world without these — but only by removing genuine moral freedom. A robot that always does the right thing is not a moral being. Love is not love if it is forced. God's risk in creating beings who could love Him was the same risk in creating beings who could reject Him and hurt one another.",
          "C.S. Lewis: \"God created things which had free will. That means creatures which can go wrong or right. Some people think they can imagine a creature which was free but had no possibility of going wrong, but I can't.\" The price of love is the possibility of hate. God paid that price, and so do we.",
        ],
      },
      {
        heading: 'Natural Evil and the Broken World',
        paragraphs: [
          "But what about earthquakes, cancer, tsunamis — \"natural evils\" not caused by human choice? Christianity offers two layers of answer. First, Genesis 3 teaches that human rebellion broke not just human relationships but the natural order itself. \"Cursed is the ground because of you\" (Genesis 3:17). Creation \"was subjected to futility\" and \"groans together in the pains of childbirth\" (Romans 8:20-22). The world we live in is not the world God designed; it is a fallen version of it.",
          "Second, God promises that this is temporary. Revelation 21:4: \"He will wipe away every tear... death shall be no more, neither shall there be mourning, nor crying, nor pain anymore.\" The current state of suffering is not the final state. It is the wreckage on the way to something restored.",
        ],
      },
      {
        heading: 'Where God Actually Goes With Suffering',
        paragraphs: [
          "But none of those answers, by themselves, would be enough if Christianity were just an explanation. What makes Christianity unique is that God did not stay outside the suffering He allows. He stepped into it. Jesus was born into poverty, betrayed by friends, tortured, executed unjustly. \"He was despised and rejected by men, a man of sorrows and acquainted with grief\" (Isaiah 53:3).",
          "The Christian God is the only one in any major religion who has personally suffered. When you cry to Him, you are not crying to a distant being who has never felt your pain. You are crying to a person who has been there. The cross does not explain suffering. It does something better — it puts God inside it.",
        ],
      },
      {
        heading: 'How to Live in It',
        paragraphs: [
          "Christians do not have to pretend. The Psalms model the full range of human grief — anger, despair, complaint to God, even questioning Him. Lament is biblical. Forced positivity is not. When you suffer, you can be honest with God; He can take it.",
          "And Christianity has the most durable framework for staying upright through suffering: this is not the end of the story, God Himself entered it with us, and one day every tear will be wiped away. Romans 8:28 says \"all things work together for good for those who love God\" — not that all things are good, but that God can take even the wreckage and weave it into something redemptive. Many of the deepest Christians you will ever meet were forged in suffering. Your suffering is real. It is not the final word.",
        ],
      },
    ],
    keyVerse: { ref: 'Romans 8:18', text: 'For I consider that the sufferings of this present time are not worth comparing with the glory that is to be revealed to us.' },
    whatThisMeans: 'Christianity does not dodge the question of suffering. It gives you free will to explain moral evil, a fallen creation to explain natural evil, a coming restoration to anchor hope, and — most importantly — a God who stepped into the suffering with you on a Roman cross. You can be honest. You can lament. And you can hold on, because the story does end well.',
    quiz: [
      { q: 'Where does most evil in the world come from?', options: ['God', 'Human moral choices (war, abuse, theft, lies, neglect)', 'Random chance', 'Other religions'], correctIdx: 1, explanation: 'God could have removed all moral evil — but only by removing genuine moral freedom. Love that\'s forced isn\'t love.' },
      { q: 'What did C.S. Lewis say about free will and evil?', options: ['God forces good outcomes', 'God could create free creatures with no possibility of going wrong', 'God created creatures which can go wrong or right — the price of love is the possibility of hate', 'Free will doesn\'t exist'], correctIdx: 2, explanation: 'A robot that always does right is not a moral being. The price of love is the possibility of hate.' },
      { q: 'How does Christianity explain "natural evil" like earthquakes and disease?', options: ['God doesn\'t care', 'Genesis 3 teaches that human rebellion broke not just relationships but the natural order itself — creation is fallen', 'They\'re random with no meaning', 'God enjoys suffering'], correctIdx: 1, explanation: 'Romans 8:20-22 — creation groans, subjected to futility. This is a fallen version of the world God designed.' },
      { q: 'What does Christianity claim is unique about the Christian God compared to other religions?', options: ['He is most powerful', 'He personally entered suffering — born into poverty, betrayed, tortured, executed', 'He doesn\'t exist', 'He doesn\'t care about suffering'], correctIdx: 1, explanation: 'Isaiah 53:3 — a man of sorrows, acquainted with grief. The cross puts God inside the suffering He allows.' },
      { q: 'What does Romans 8:28 actually claim?', options: ['All things are good', 'All things work together for good for those who love God — He can weave even wreckage into something redemptive', 'Suffering is fake', 'God prevents all bad things'], correctIdx: 1, explanation: 'Not that all things are good, but that God can take wreckage and make something redemptive from it. Many of the deepest Christians were forged in suffering.' },
    ],
  },

  {
    id: 'science-and-faith',
    category: 'apologetics',
    title: 'Science & Faith — Are They Compatible?',
    description: 'The "science vs religion" framing is a modern myth. Here\'s what the actual history shows — and where the lines really are.',
    duration: '9 min',
    sections: [
      {
        heading: 'The Myth You\'ve Probably Been Told',
        paragraphs: [
          "The popular story goes: religion was the dark ages, science came along, and the two have been at war ever since. This narrative was invented in the late 1800s by two specific authors (John William Draper and Andrew Dickson White), and historians of science have spent the last century systematically dismantling it. Most contemporary academic historians of science (the actual experts) describe a \"complexity thesis\" instead — a long, mostly cooperative relationship punctuated by genuine but rare conflicts.",
          "What history actually shows: modern science largely emerged from a Christian Europe that believed (a) the universe was created by a rational God and therefore would be rationally ordered, and (b) the human mind, made in God's image, was capable of understanding that order. These two beliefs are not incidental to science — they are its philosophical foundations.",
        ],
      },
      {
        heading: 'The Christian Scientists',
        paragraphs: [
          "Most of the founders of modern science were Christians, often quite serious ones. Copernicus was a Catholic cleric. Galileo was a devout Catholic (the conflict with the Church was more about politics and theology of Scripture interpretation than about science vs religion — and he died comfortably in his own house). Kepler called his work \"thinking God's thoughts after Him.\" Newton wrote more on theology than on physics. Boyle, Faraday, Pasteur, Mendel (the monk who founded genetics), Lord Kelvin, Maxwell — all devout believers.",
          "In the 20th century: Werner Heisenberg, Max Planck, George Lemaître (the Catholic priest and physicist who proposed the Big Bang theory), Francis Collins (the geneticist who led the Human Genome Project). The notion that working scientists cannot be Christians is contradicted by the entire history of working scientists.",
        ],
      },
      {
        heading: 'Where the Conflict Is Real',
        paragraphs: [
          "There are genuine tensions, but they are narrower than the popular story suggests. Most are about the origin of the universe, the origin of life, and evolution. Christians hold a range of views: young-earth creationism (6,000-10,000 year old earth, literal six-day creation), old-earth creationism (the days of Genesis 1 are long ages), and theistic evolution (God created through the evolutionary process). All are held by faithful, thoughtful Christians.",
          "The Bible does not contradict science. The two ask different questions. Science asks \"how?\" — by what mechanism, with what timing. The Bible asks \"who?\" and \"why?\" — by what intent, for what purpose. A poem about a sunset and a physics paper about light wavelengths are not in conflict; they are doing different work.",
        ],
      },
      {
        heading: 'Where Science Actually Points',
        paragraphs: [
          "Modern cosmology has, if anything, made theism more reasonable, not less. The universe had a beginning (Big Bang) — which is what Genesis 1:1 has said for three thousand years. The fundamental constants of physics are fine-tuned to an extraordinary degree to permit life — what physicists call the \"fine-tuning problem.\" The information density of DNA is staggering. None of this proves God; the data is interpretable various ways. But the science is not the slam-dunk against faith that many people assume it is.",
          "The biggest question science cannot answer is the most important one: why is there something rather than nothing? Science explains how things in the universe behave. It cannot explain why the universe is here in the first place. That is a question for philosophy and theology — and the Christian answer (an eternal, personal God created it) remains coherent and powerful.",
        ],
      },
    ],
    keyVerse: { ref: 'Psalm 19:1-2', text: 'The heavens declare the glory of God, and the sky above proclaims his handiwork. Day to day pours out speech, and night to night reveals knowledge.' },
    whatThisMeans: 'You do not have to choose between believing the Bible and believing physics. The actual history of science and Christianity is one of partnership. Faithful Christians hold a range of views on Genesis. Modern cosmology, if anything, has made belief in a Creator more reasonable. Don\'t let a 19th-century myth talk you out of either your faith or your interest in science. You can have both.',
    quiz: [
      { q: 'According to historians of science, the "science vs religion war" narrative…', options: ['Is solid history', 'Was invented in the late 1800s and has been largely dismantled by historians since', 'Has been confirmed by modern research', 'Is a Christian conspiracy'], correctIdx: 1, explanation: 'Draper and White in the late 1800s. Most academic historians of science now describe a "complexity thesis" — long cooperation with rare genuine conflicts.' },
      { q: 'Which is true about most founders of modern science?', options: ['They were all atheists', 'Most were Christians, often quite serious ones (Newton wrote more on theology than physics)', 'They had no religious views', 'They opposed Christianity'], correctIdx: 1, explanation: 'Copernicus, Kepler, Newton, Boyle, Faraday, Pasteur, Mendel — almost all devout believers. The notion that scientists can\'t be Christian is contradicted by the entire history of science.' },
      { q: 'Who proposed the Big Bang theory?', options: ['An atheist astronomer', 'Georges Lemaître — a Catholic priest and physicist', 'Stephen Hawking', 'Charles Darwin'], correctIdx: 1, explanation: 'A Catholic priest. The Big Bang theory, far from disproving Genesis, is consistent with Genesis 1:1\'s claim that the universe had a beginning.' },
      { q: 'What questions do science and the Bible primarily ask, respectively?', options: ['Both ask "how"', 'Science asks "how"; the Bible asks "who" and "why"', 'They ask the same questions', 'Neither asks any real questions'], correctIdx: 1, explanation: 'A poem about a sunset and a physics paper about light wavelengths aren\'t in conflict — they\'re doing different work.' },
      { q: 'What\'s the biggest question science cannot answer?', options: ['How chemistry works', 'Why there is something rather than nothing', 'How DNA replicates', 'How stars form'], correctIdx: 1, explanation: 'Science explains how things in the universe behave. It cannot explain why the universe is here at all. That\'s a question for philosophy and theology.' },
    ],
  },

  // ═══════════════════ BIBLE STUDY · Batch 2 (2) ═══════════════════

  {
    id: 'nt-overview',
    category: 'bible-study',
    title: 'New Testament Overview',
    description: 'A bird\'s-eye view of the 27 books — Gospels, Acts, Letters, Revelation — and how they fit into one unified story.',
    duration: '9 min',
    sections: [
      {
        heading: 'One Story, 27 Books, ~95 Years',
        paragraphs: [
          "The New Testament was written between roughly AD 45 and AD 95 — fifty years of explosive growth from a small Jewish renewal movement in Galilee to a faith stretching across the Roman Empire. Twenty-seven books in four main groupings: four Gospels, one history (Acts), twenty-one letters, and one apocalyptic vision (Revelation). All originally written in Greek, the *lingua franca* of the eastern Mediterranean.",
          "What unites them is a single conviction: that Jesus of Nazareth — crucified under Pontius Pilate around AD 30 — rose from the dead, fulfilled the entire Old Testament, and inaugurated the long-promised kingdom of God. Every New Testament book is, in some way, working out what that means.",
        ],
      },
      {
        heading: 'The Four Gospels',
        paragraphs: [
          "Matthew, Mark, Luke, and John — four portraits of Jesus from four angles. Matthew (written for Jewish audiences) emphasizes Jesus as the fulfillment of Old Testament prophecy and the new Moses. Mark (the shortest, fastest-paced) presents Jesus as the suffering Servant, in action. Luke (the most polished Greek prose; written by a physician) emphasizes Jesus as Savior of all people — Gentiles, women, the poor, the outcast. John (the latest, most theological) presents Jesus as the eternal Word made flesh.",
          "Together they preserve the central event of human history: the life, teaching, death, and resurrection of Jesus. They are not four contradictory biographies but four complementary witnesses — the same event from four perspectives, like four photographs of one wedding from four angles.",
        ],
      },
      {
        heading: 'Acts and Paul\'s Letters',
        paragraphs: [
          "Acts (also written by Luke) is the only book of church history in the New Testament. It picks up where Luke's Gospel ends — the resurrection — and traces the first 30 years of the church, from Jerusalem to Rome. The Holy Spirit is the protagonist; Peter dominates the first half, Paul the second.",
          "Then come Paul's letters — thirteen books written to churches he planted (Romans, 1-2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1-2 Thessalonians) or to individuals (1-2 Timothy, Titus, Philemon). Romans is the most systematic — Paul's full theological vision. 1 Corinthians is the most practical — a church behaving badly being lovingly corrected. Galatians is the most urgent — Paul fighting for the gospel of grace. Each letter is occasioned by a specific situation but has shaped Christian thought for two millennia.",
        ],
      },
      {
        heading: 'General Letters and Revelation',
        paragraphs: [
          "Hebrews (anonymous, though traditionally attributed to Paul or one of his circle) is a sustained argument that Christ is superior to every Old Testament institution — better than angels, better than Moses, better than the high priest, the perfect sacrifice. James is the most Old-Testament-flavored, full of practical wisdom (\"faith without works is dead\"). 1-2 Peter, 1-2-3 John, and Jude round out the \"General Letters\" — short, pastoral, focused on perseverance and faithfulness under pressure.",
          "Revelation — the only book of biblical apocalyptic — was written by John on the island of Patmos around AD 95, during persecution under the Emperor Domitian. Its language is dense with Old Testament imagery and symbolism. Its message is simple: Christ wins. Empires fall. God dwells with His people forever. Don't read it as a chronological prediction; read it as a vision designed to comfort persecuted Christians and rally their hope.",
        ],
      },
      {
        heading: 'How to Read It as a Whole',
        paragraphs: [
          "A common reading order for first-time readers: start with Mark (the shortest Gospel), then read John, then Acts, then Romans, then the rest. This gives you Jesus's life, the founding of the church, Paul's theology, and the rest of the picture in roughly that order.",
          "What you'll see, reading the New Testament whole, is one cohesive story: the long-promised King arrives, dies for the world's sin, rises, sends His Spirit, builds His church across cultures and centuries, and one day will return to make all things new. Twenty-seven books. One story. Every chapter you read is a chapter you are part of.",
        ],
      },
    ],
    keyVerse: { ref: 'John 20:30-31', text: 'Now Jesus did many other signs in the presence of the disciples, which are not written in this book; but these are written so that you may believe that Jesus is the Christ, the Son of God, and that by believing you may have life in his name.' },
    whatThisMeans: 'The New Testament is not a random collection of religious writings. It is a unified witness to the most important event in history, written by people who were there or one degree removed. If you have never read it cover to cover, start with Mark this week. The story is the one your life is already inside.',
    quiz: [
      { q: 'How many books are in the New Testament?', options: ['27', '39', '66', '100'], correctIdx: 0, explanation: '27 books — 4 Gospels, 1 history (Acts), 21 letters, 1 apocalyptic vision (Revelation).' },
      { q: 'Which Gospel is the shortest, fastest-paced, presenting Jesus as Servant in action?', options: ['Matthew', 'Mark', 'Luke', 'John'], correctIdx: 1, explanation: 'Mark is the action Gospel — often the recommended starting point for first-time readers.' },
      { q: 'Who wrote Acts?', options: ['Peter', 'Paul', 'Luke — the physician who also wrote the Gospel of Luke', 'Mark'], correctIdx: 2, explanation: 'Acts is volume 2 of Luke\'s work. It traces the first 30 years of the church from Jerusalem to Rome.' },
      { q: 'How many letters did Paul write that are in the New Testament?', options: ['3', '7', '13', '21'], correctIdx: 2, explanation: 'Thirteen — Romans, 1-2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1-2 Thessalonians, 1-2 Timothy, Titus, Philemon.' },
      { q: 'What is the main message of Revelation?', options: ['A precise prediction of dates', 'Christ wins, empires fall, God dwells with His people forever — comfort and hope for persecuted Christians', 'How to interpret prophecy', 'An apocalyptic warning to non-believers only'], correctIdx: 1, explanation: 'Written under Domitian\'s persecution. Don\'t read it as a calendar — read it as a vision designed to rally hope.' },
    ],
  },

  {
    id: 'memorize-scripture',
    category: 'bible-study',
    title: 'How to Memorize Scripture',
    description: 'Why memorizing Scripture is one of the most life-changing disciplines — and a practical system that actually works.',
    duration: '8 min',
    sections: [
      {
        heading: 'Why Memorize at All?',
        paragraphs: [
          "Psalm 119:11 — \"I have stored up your word in my heart, that I might not sin against you.\" Memorization is not a parlor trick. It is a way of letting Scripture become your inner soundtrack — the voice that argues back at temptation, that comforts you at 2 a.m. when you can't sleep, that gives you words for prayer when you don't have your own.",
          "Jesus quoted Scripture from memory in His temptation in the wilderness (Matthew 4) — He did not pull out a scroll. The early apostles preached extensively from memory. Persecuted Christians under hostile regimes have sustained themselves on memorized Scripture when their Bibles were taken. Once it is in you, no one can take it away. Few disciplines pay larger dividends.",
        ],
      },
      {
        heading: 'The System That Works',
        paragraphs: [
          "The single most effective method is *spaced repetition* — reviewing each verse on an expanding schedule (day 1, day 2, day 4, day 7, day 14, day 30, day 60, day 90). This matches how human memory actually consolidates. Most failed memorization attempts fail not because the person isn't smart enough but because they reviewed the verse three times in a row and then forgot it. Spaced repetition guarantees the verse moves from short-term to long-term memory.",
          "The Memorize feature in YourLife CC's Faith Hub uses a simplified SM-2 algorithm — the same engine behind Anki and similar systems. Each verse gets a difficulty rating. Easier verses come back less often. Harder ones come back sooner. It does the spaced-repetition math for you. Use it.",
        ],
      },
      {
        heading: 'How to Memorize a Single Verse',
        paragraphs: [
          "Start with the reference: \"John 3:16.\" Say it out loud first. Read the verse aloud three times slowly. Then cover it and try to say it from memory. Look at the first word, then say the next phrase. Keep going. Make mistakes. Look back. Try again. Do this for about 3-5 minutes. Then move on with your day.",
          "Come back to that verse the next day. Then 3 days later. Then a week later. Within a month, that verse will be solid. Within a year of doing this with one new verse per week, you will have memorized fifty verses — more Scripture than most Christians know by heart in their entire lifetime.",
        ],
      },
      {
        heading: 'What to Memorize First',
        paragraphs: [
          "Start with verses you would actually use. The Beatitudes (Matthew 5:3-12). The Lord's Prayer (Matthew 6:9-13). John 3:16. Romans 8:28. Romans 8:38-39. Psalm 23. Psalm 1. Philippians 4:6-7. Philippians 4:13. Ephesians 2:8-9. The Great Commission (Matthew 28:18-20). 1 Corinthians 13. The fruit of the Spirit (Galatians 5:22-23). 1 John 1:9.",
          "Then move to passages: Romans 8, John 14-17, Hebrews 11, James 1. Eventually, whole books — Ephesians is a favorite. Some Christians memorize all of Philippians (4 chapters) or 1 John (5 chapters). It is not just for ancient monks. Ordinary Christians have done this throughout history. Start small. Be patient. Compound.",
        ],
      },
      {
        heading: 'The Spiritual Effect',
        paragraphs: [
          "Memorized Scripture changes you in ways that read-and-forget Scripture cannot. Words you have memorized come back to you uninvited — in the middle of a hard conversation, in a moment of temptation, in a wave of fear. The Holy Spirit uses what is already inside you. He does not have to wait for you to find your Bible.",
          "The promise of Joshua 1:8: \"This Book of the Law shall not depart from your mouth, but you shall meditate on it day and night, so that you may be careful to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success.\" Memorization is the discipline that puts the Word in your mouth. The other promises follow.",
        ],
      },
    ],
    keyVerse: { ref: 'Psalm 119:11', text: 'I have stored up your word in my heart, that I might not sin against you.' },
    whatThisMeans: 'Memorizing Scripture is one of the most life-changing disciplines available to any Christian, and you don\'t need to be smart or have a special memory to do it. Use spaced repetition. Start with one verse a week. In a year you\'ll know fifty. In a decade you\'ll be a different person. The Holy Spirit works with what is already in you — give Him plenty.',
    quiz: [
      { q: 'What does Psalm 119:11 say about Scripture memorization?', options: ['It\'s optional', 'I have stored up your word in my heart, that I might not sin against you', 'Only priests need to memorize', 'It\'s impossible for most people'], correctIdx: 1, explanation: 'Memorization is for sin-fighting, comfort, prayer. Scripture inside you is Scripture the Spirit can reach for in any moment.' },
      { q: 'How did Jesus answer Satan in the temptation in the wilderness (Matthew 4)?', options: ['By reading from a scroll', 'By quoting Scripture from memory', 'By calling on angels', 'By staying silent'], correctIdx: 1, explanation: 'Each temptation, Jesus responded "It is written..." — from memory. The model is set.' },
      { q: 'What is the most effective memorization technique?', options: ['Repeating the verse 100 times in one sitting', 'Spaced repetition — reviewing on an expanding schedule (day 1, 2, 4, 7, 14, 30)', 'Just hoping you remember', 'Writing it once'], correctIdx: 1, explanation: 'Matches how human memory consolidates. Cramming fails; spacing succeeds. YourLife CC\'s Memorize feature handles this for you.' },
      { q: 'What is a realistic memorization goal for a year?', options: ['Memorize the entire Bible', '50 verses (one per week)', 'Zero verses', 'Only short verses'], correctIdx: 1, explanation: 'One new verse per week, with spaced repetition, gets you 50 in a year — more than most Christians know in their entire lifetime.' },
      { q: 'What\'s the deeper spiritual effect of memorized Scripture?', options: ['Pride', 'Words come back uninvited in moments of temptation, fear, or hard conversation — the Holy Spirit uses what is already in you', 'Nothing special', 'It only helps in church'], correctIdx: 1, explanation: 'The Spirit doesn\'t have to wait for you to find your Bible. Memorized Word is always within reach.' },
    ],
  },
];

if (typeof window !== 'undefined') {
  window.ACADEMY_LESSONS = ACADEMY_LESSONS;
  window.ACADEMY_CATEGORIES = ACADEMY_CATEGORIES;
  window.ACADEMY_CATEGORY_SVGS = ACADEMY_CATEGORY_SVGS;
}
