/* =============================================================
   faith-zones-data.js — V1 Rebuild · Faith Tab Redesign
   Pure data: Convince Me deck (Zone 1) + Daily Challenges (Zone 2).
   Both arrays are read by faith-zones.js; no behavior lives here.
============================================================= */

// ── ZONE 1 · CONVINCE ME DECK ──────────────────────────────────
// 20 curiosity-first cards. Each entry:
//   id        — stable id, used in D.convinceMeSeen[]
//   cat       — category label shown on the front pill
//   icon      — emoji shown on the front pill + back face header
//   q         — front-face question (2-3 lines, ~15-25 words)
//   headline  — back-face one-sentence answer
//   bullets   — back-face evidence (3-4 items, each ≤15 words)
//   closer    — back-face bold accent-color closing line
//   proofId   — best-match id from PROOF_PROPHECY_DATA for "Dig Deeper"
//               (when none matches the deck still works, Dig Deeper
//               shows the "more coming soon" placeholder)
const CONVINCE_ME_DECK = [
  {
    id:'cm1', cat:'Mystery', icon:'🔍',
    q:'What made 500 people willing to die for a story they could have just made up?',
    headline:'They had nothing to gain — and everything to lose — for the lie.',
    bullets:[
      'Eleven of twelve apostles died violent deaths refusing to recant.',
      'Liars don\'t die for what they invented; they confess to save themselves.',
      'Paul lists 500 living eyewitnesses (1 Cor 15:6) — verifiable in his lifetime.',
      'No competing 1st-century account claims the resurrection was a hoax.'
    ],
    closer:'When the cost of telling the truth is your life, lies don\'t survive long.',
    proofId:'res-eyewitness-count'
  },
  {
    id:'cm2', cat:'Mystery', icon:'🔍',
    q:'Why did the disciples go from hiding in fear to fearlessly preaching — overnight?',
    headline:'Something happened between Friday\'s grave and Sunday\'s street corner.',
    bullets:[
      'Peter denied Jesus three times to a servant girl on Thursday night.',
      'Fifty days later he preached to thousands in the same city.',
      'Fear-to-courage that complete usually requires a catastrophic event.',
      'They claimed it was seeing Jesus alive — and kept claiming it under torture.'
    ],
    closer:'No spin doctor in history has flipped a defeated cult into a global movement in two months.',
    proofId:'res-disciples-transformed'
  },
  {
    id:'cm3', cat:'Mystery', icon:'🔍',
    q:'What changed Paul from hunting Christians to becoming their biggest defender?',
    headline:'A man on a state-funded persecution mission abandoned everything mid-trip.',
    bullets:[
      'Paul had Rome\'s authority to arrest Christians — a fast career path.',
      'He gave it up for beatings, shipwrecks, and eventual execution.',
      'His own letters (uncontested even by skeptical scholars) describe the reversal.',
      'No bribe, no woman, no political reward — just a claimed encounter.'
    ],
    closer:'Ambition doesn\'t walk away from power unless something bigger replaces it.',
    proofId:'res-paul-conversion'
  },
  {
    id:'cm4', cat:'Evidence', icon:'⚡',
    q:'Why do secular historians mention Jesus if they had no reason to?',
    headline:'Pagan and Jewish historians wrote about Jesus — and they weren\'t selling Christianity.',
    bullets:[
      'Tacitus (Roman, c. 116 AD) records the crucifixion under Pontius Pilate.',
      'Josephus (Jewish, c. 93 AD) names Jesus, his brother James, and his followers.',
      'Pliny the Younger describes early Christians worshiping Jesus as God by 112 AD.',
      'These sources had every incentive to ignore a fringe movement. They didn\'t.'
    ],
    closer:'When your enemies confirm the basic facts, the basic facts probably happened.',
    proofId:'wit-tacitus'
  },
  {
    id:'cm5', cat:'Evidence', icon:'⚡',
    q:'What happened to Jesus\'s tomb that literally nobody — friend or enemy — disputes?',
    headline:'Everyone agreed the tomb was empty. They just argued about why.',
    bullets:[
      'The earliest enemy response was "the disciples stole the body" — not "no, it\'s still there."',
      'A still-occupied tomb would have ended Christianity in one sentence.',
      'Roman and Jewish authorities had every motive to produce the body.',
      'They never did — and the movement they tried to crush exploded.'
    ],
    closer:'The simplest disproof was a five-minute walk away. Nobody could take it.',
    proofId:'res-empty-tomb'
  },
  {
    id:'cm6', cat:'Evidence', icon:'⚡',
    q:'Why does the resurrection story have women as first witnesses — the least credible witnesses in 1st century culture?',
    headline:'No one inventing a 1st-century Roman story would have started it this way.',
    bullets:[
      'Women\'s testimony was inadmissible in Jewish courts at the time.',
      'A fabricated story would name Peter or John — both more credible publicly.',
      'Naming Mary Magdalene (a woman with a complicated past) was even worse PR.',
      'The detail survived only because the writers were reporting, not crafting.'
    ],
    closer:'Embarrassing details that don\'t help your case are usually the true ones.',
    proofId:'res-women-witnesses'
  },
  {
    id:'cm7', cat:'Science', icon:'🔭',
    q:'What do physicists say had to exist before the Big Bang?',
    headline:'Whatever caused the universe must be outside space, time, and matter.',
    bullets:[
      'The Big Bang is the beginning of space, time, matter, and energy — all four.',
      'Whatever caused it must be spaceless, timeless, immaterial, and immensely powerful.',
      'That\'s also the classical description of God — written 3,000 years before Hubble.',
      'No purely physical cause works: physics didn\'t exist yet.'
    ],
    closer:'The first verse of Genesis says "In the beginning." Modern cosmology agrees there was one.',
    proofId:'sci-big-bang'
  },
  {
    id:'cm8', cat:'Science', icon:'🔭',
    q:'Why does the universe appear fine-tuned to allow life — down to the exact constants of physics?',
    headline:'Roughly 30 physical constants sit in razor-thin life-permitting ranges.',
    bullets:[
      'Change gravity by 1 part in 10^60 — no stars, no planets, no us.',
      'Strong nuclear force tuning: shift it 0.5% and no carbon atoms form.',
      'Cosmological constant precision: 1 part in 10^120. That\'s not a typo.',
      'Atheist physicists call this "the most disturbing observation in modern science."'
    ],
    closer:'A universe this calibrated either won the lottery a hundred times in a row — or someone calibrated it.',
    proofId:'sci-fine-tuning'
  },
  {
    id:'cm9', cat:'Science', icon:'🔭',
    q:'What are the mathematical odds that DNA assembled itself by chance?',
    headline:'Even the simplest functional protein is statistically impossible by random chance.',
    bullets:[
      'A single 150-amino-acid protein has 10^195 possible sequences.',
      'Only 1 in 10^74 of those folds into anything functional.',
      'A bacterium needs hundreds of these — all working together — to live.',
      'The mathematician Fred Hoyle (atheist) called it "a tornado building a 747."'
    ],
    closer:'Information this dense doesn\'t arise from noise. It arises from intent.',
    proofId:'sci-dna-information'
  },
  {
    id:'cm10', cat:'Prophecy', icon:'📜',
    q:'How did a text written 700 years early predict the exact birthplace of Jesus?',
    headline:'Micah 5:2 named Bethlehem — a town of 300 people — seven centuries before Jesus was born.',
    bullets:[
      'Micah wrote around 700 BC; Bethlehem was an obscure backwater.',
      'It specifies Bethlehem Ephrathah — distinguishing it from a same-named town up north.',
      'The Septuagint translation (250 BC) confirms the text long before Jesus.',
      'No room for editing after the fact: the prophecy circulated for centuries first.'
    ],
    closer:'A 700-year time-stamped address in a tiny village isn\'t a lucky guess.',
    proofId:'pro-bethlehem'
  },
  {
    id:'cm11', cat:'Prophecy', icon:'📜',
    q:'What are the odds of one person fulfilling just 8 of the 300+ prophecies about the Messiah?',
    headline:'Mathematician Peter Stoner calculated 1 in 10^17 — for only 8 prophecies.',
    bullets:[
      '10^17 silver dollars would cover Texas two feet deep.',
      'Mark one, mix them all up, blindfold someone, ask them to grab that one.',
      'That\'s the chance of one man fulfilling 8 prophecies by accident.',
      'Jesus fulfilled hundreds — including ones he could not have engineered (his birthplace, death method, betrayal price).'
    ],
    closer:'At some point the math stops being coincidence and starts being a signature.',
    proofId:'pro-stoner-math'
  },
  {
    id:'cm12', cat:'Prophecy', icon:'📜',
    q:'Why does the Dead Sea Scrolls discovery matter so much for the Bible\'s reliability?',
    headline:'Scrolls written 1,000 years earlier than our best Bible matched it almost perfectly.',
    bullets:[
      'Found in 1947 — sealed in jars since around 100 BC.',
      'The full book of Isaiah is there, written long before Jesus.',
      'Compared word-for-word to the medieval text scholars used: 95%+ identical.',
      'The differences were spelling and word order — nothing doctrinal changed.'
    ],
    closer:'A book that survives a thousand years of copying without drift is a book that was guarded.',
    proofId:'mss-dead-sea-scrolls'
  },
  {
    id:'cm13', cat:'Philosophy', icon:'💭',
    q:'Why do humans across every culture and era — with zero contact — have a concept of God?',
    headline:'Belief in a creator shows up everywhere humans show up.',
    bullets:[
      'Anthropologists call it "innate religiosity" — found in every isolated tribe ever studied.',
      'Children raised without religion still spontaneously develop creator-belief by age 5.',
      'Atheism, by contrast, has to be taught — it\'s never the default position.',
      'C.S. Lewis: "If we find a desire no experience in this world can satisfy, the explanation is we were made for another world."'
    ],
    closer:'Universal hunger usually points to the existence of real food.',
    proofId:null
  },
  {
    id:'cm14', cat:'Philosophy', icon:'💭',
    q:'If God doesn\'t exist, where do humans get the idea that anything is actually wrong?',
    headline:'Without a moral lawgiver, "wrong" is just "I don\'t like that."',
    bullets:[
      'Atheists routinely say the Holocaust was evil — not just "culturally unpopular."',
      'Real evil requires a real standard above human opinion.',
      'Evolution can explain why we feel moral; it can\'t explain why we\'re right.',
      'The argument for objective morality is one of the strongest cases for God ever made.'
    ],
    closer:'You can\'t call something crooked without knowing what straight looks like.',
    proofId:null
  },
  {
    id:'cm15', cat:'Philosophy', icon:'💭',
    q:'Why did C.S. Lewis — one of history\'s sharpest atheist minds — completely change his position?',
    headline:'He started trying to disprove Christianity and ended up convinced by his own evidence.',
    bullets:[
      'Lewis was a hardened atheist Oxford professor — not soft on the question.',
      'His "Lord, liar, or lunatic" trilemma about Jesus has yet to be answered.',
      'He converted reluctantly: "the most dejected and reluctant convert in all England."',
      'His subsequent writing converted thousands of other skeptics — including doctors and scientists.'
    ],
    closer:'When the strongest critic switches sides, the case deserves a second look.',
    proofId:null
  },
  {
    id:'cm16', cat:'Challenge', icon:'❓',
    q:'What\'s the strongest argument against God you\'ve heard — and is there an answer?',
    headline:'The problem of evil. And yes — there is an answer worth wrestling with.',
    bullets:[
      'If God is good and all-powerful, why does evil exist?',
      'Christianity\'s answer: free will, real love, and a God who suffered evil himself.',
      'No other worldview takes evil this seriously without explaining it away.',
      'The cross is God saying "I will not stay distant from your worst day."'
    ],
    closer:'The Christian answer to evil isn\'t a logic puzzle — it\'s a person who entered the pain.',
    proofId:null
  },
  {
    id:'cm17', cat:'Challenge', icon:'❓',
    q:'If Christianity is true, what would you actually have to change about your life?',
    headline:'Everything — but probably not in the ways you think.',
    bullets:[
      'You\'d stop performing for approval — you already have it.',
      'You\'d be honest about who you actually are, even the bad parts.',
      'You\'d treat people you don\'t like as if they mattered too.',
      'You\'d stop being afraid of dying, which would change how you live.'
    ],
    closer:'The cost is your old self. The reward is everything you were actually built for.',
    proofId:null
  },
  {
    id:'cm18', cat:'Challenge', icon:'❓',
    q:'What would it realistically take for you to believe?',
    headline:'Be honest with yourself — many people set the bar so high no evidence could pass it.',
    bullets:[
      'A first-hand miracle? Witnesses always doubt them too.',
      'A philosophical proof? Smart people on both sides have them.',
      'Personal experience? People dismiss those as "in your head."',
      'The honest question: are you actually looking, or just looking for a reason not to look?'
    ],
    closer:'The Bible promises one thing for honest seekers: "Seek and you will find."',
    proofId:null
  },
  {
    id:'cm19', cat:'Mystery', icon:'🔍',
    q:'Why do near-death experiences from people of completely different cultures describe the same things?',
    headline:'Light. Peace. Loved ones. Awareness outside the body. Across every continent.',
    bullets:[
      'Documented in tens of thousands of cases — including blind people who "saw" for the first time.',
      'Verified out-of-body details: equipment in other rooms, conversations in waiting areas.',
      'No cultural or chemical theory explains the consistency across atheists, Hindus, and Christians.',
      'Many return permanently changed — losing their fear of death entirely.'
    ],
    closer:'When wildly different people report the same alien country, the country probably exists.',
    proofId:null
  },
  {
    id:'cm20', cat:'Evidence', icon:'⚡',
    q:'Why did the early church explode in growth in the exact city where Jesus was supposedly buried?',
    headline:'Jerusalem was the worst possible place to start a resurrection rumor — unless it was true.',
    bullets:[
      'Acts 2: 3,000 converts in a single day in Jerusalem, 50 days after the crucifixion.',
      'Everyone there could walk to the tomb and check.',
      'Producing the body would have killed the movement instantly.',
      'Instead, the church grew fastest right where it was easiest to disprove.'
    ],
    closer:'You don\'t start a lie in the one city that can verify it. Unless it isn\'t a lie.',
    proofId:'res-jerusalem-growth'
  }
];

// ── ZONE 2 · DAILY CHALLENGES ─────────────────────────────────
// 30 offline-leaning challenges rotated by day-of-year. Sourced from
// the V1 Rebuild spec's "Real Life Wins" list — Session 4 will share
// or migrate this when the dedicated Real Life Wins surface ships.
// Each entry: { id, cat, emoji, text, trait }
const FAITH_CHALLENGES = [
  // Relational
  { id:'ch01', cat:'Relational',  emoji:'💬', text:'Text one person right now: "Hey, I was thinking about you."', trait:'compassion' },
  { id:'ch02', cat:'Relational',  emoji:'🙏', text:'Look your parent in the eyes and say thank you for something specific.', trait:'gratitude' },
  { id:'ch03', cat:'Relational',  emoji:'🤝', text:'Find someone sitting alone today and sit with them.', trait:'compassion' },
  { id:'ch04', cat:'Relational',  emoji:'✍️', text:'Write a note — physical paper — and leave it for someone to find.', trait:'compassion' },
  { id:'ch05', cat:'Relational',  emoji:'📞', text:'Call someone instead of texting them today.', trait:'compassion' },
  { id:'ch06', cat:'Relational',  emoji:'❤️', text:'Tell a friend one specific thing you appreciate about them — out loud.', trait:'compassion' },
  { id:'ch07', cat:'Relational',  emoji:'👂', text:'Ask someone older than you: what\'s the best advice you ever got?', trait:'wisdom' },
  { id:'ch08', cat:'Relational',  emoji:'🎁', text:'Do something for your sibling they didn\'t ask for.', trait:'compassion' },
  { id:'ch09', cat:'Relational',  emoji:'🤲', text:'Let someone go first — in line, in conversation, anywhere.', trait:'gratitude' },
  { id:'ch10', cat:'Relational',  emoji:'📨', text:'Check in on someone you haven\'t talked to in a while.', trait:'compassion' },
  // Courage
  { id:'ch11', cat:'Courage',     emoji:'👋', text:'Introduce yourself to one person you\'ve never talked to.', trait:'courage' },
  { id:'ch12', cat:'Courage',     emoji:'🙇', text:'Apologize to someone you\'ve been meaning to for a while.', trait:'courage' },
  { id:'ch13', cat:'Courage',     emoji:'💭', text:'Share one honest thing about yourself you don\'t usually share.', trait:'courage' },
  { id:'ch14', cat:'Courage',     emoji:'❓', text:'Ask God one question you\'ve been afraid to ask.', trait:'faith' },
  { id:'ch15', cat:'Courage',     emoji:'🦁', text:'Do one thing today that scares you a little.', trait:'courage' },
  // Discipline
  { id:'ch16', cat:'Discipline',  emoji:'📵', text:'Put your phone in another room for 2 hours. No exceptions.', trait:'discipline' },
  { id:'ch17', cat:'Discipline',  emoji:'⏰', text:'Wake up 30 minutes earlier tomorrow. Set the alarm now.', trait:'discipline' },
  { id:'ch18', cat:'Discipline',  emoji:'🧹', text:'Clean or organize one space without being asked.', trait:'discipline' },
  { id:'ch19', cat:'Discipline',  emoji:'🚫', text:'Skip one thing you enjoy today. Offer it up.', trait:'discipline' },
  { id:'ch20', cat:'Discipline',  emoji:'📝', text:'Write tomorrow\'s plan tonight before you sleep.', trait:'discipline' },
  // Faith in action
  { id:'ch21', cat:'Faith',       emoji:'🤫', text:'Do one anonymous act of kindness. Tell no one.', trait:'integrity' },
  { id:'ch22', cat:'Faith',       emoji:'🎁', text:'Give something away today — money, time, or something you own.', trait:'compassion' },
  { id:'ch23', cat:'Faith',       emoji:'🙏', text:'Pray for someone you find difficult. Out loud.', trait:'compassion' },
  { id:'ch24', cat:'Faith',       emoji:'🚶', text:'Take a 10-minute walk with no phone. Talk to God.', trait:'faith' },
  { id:'ch25', cat:'Faith',       emoji:'🧣', text:'Find one way to serve today that no one will notice.', trait:'integrity' },
  // Gratitude + presence
  { id:'ch26', cat:'Presence',    emoji:'🌅', text:'Watch a sunset or the sky for 5 minutes. No phone.', trait:'gratitude' },
  { id:'ch27', cat:'Presence',    emoji:'🍽️', text:'Eat one meal with no screens. Just be present.', trait:'gratitude' },
  { id:'ch28', cat:'Gratitude',   emoji:'📔', text:'Write down 3 specific — not general — things you\'re grateful for.', trait:'gratitude' },
  { id:'ch29', cat:'Presence',    emoji:'😮‍💨', text:'Tell God what you\'re actually feeling. No filter.', trait:'faith' },
  { id:'ch30', cat:'Discipline',  emoji:'🌙', text:'Go to sleep 30 minutes earlier tonight.', trait:'discipline' }
];

// Expose for non-module scripts that load after this one.
if (typeof window !== 'undefined') {
  window.CONVINCE_ME_DECK = CONVINCE_ME_DECK;
  window.FAITH_CHALLENGES = FAITH_CHALLENGES;
}
