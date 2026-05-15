// ═════════════════════════════════════════════════════════════
// Prayer Tab content — 5 structured datasets for the rebuilt
// Prayer "sanctuary" surface in faith.js.
// Authored 2026-05-15 by content-author-faith subagent. NIV refs.
// Loaded before faith.js so renderPrayer*Pane() can read window.PRAYER_*.
// ═════════════════════════════════════════════════════════════

const PRAYER_TYPES = [
  {
    key: 'adoration',
    name: 'Adoration',
    icon: '✨',
    oneLineDesc: 'Worship God for who He is, not just what He does.',
    longDesc: "Adoration is pure praise — no requests, no agenda. You're simply telling God that He is good, holy, worthy, and enough. It reorients your heart before anything else.",
    exampleSentence: 'You are worthy of every word I have, and I want to start here.',
    scriptureRef: 'Psalm 145:3',
  },
  {
    key: 'confession',
    name: 'Confession',
    icon: '🕊️',
    oneLineDesc: 'Bring the real stuff — and receive the grace waiting for you.',
    longDesc: "Confession isn't about earning forgiveness — it's about receiving the forgiveness already won. Naming what's wrong before God clears the static and brings you back into honest relationship with Him.",
    exampleSentence: "I've been carrying something I haven't named — I want to put it down right here.",
    scriptureRef: '1 John 1:9',
  },
  {
    key: 'thanksgiving',
    name: 'Thanksgiving',
    icon: '🙏',
    oneLineDesc: "Count what's good — and watch your perspective shift.",
    longDesc: "Thanksgiving is more than politeness — it's a discipline that trains your eyes to see God's hand in ordinary things. The more specifically you thank Him, the more you begin to notice.",
    exampleSentence: 'Thank you for things I almost walked past today without noticing.',
    scriptureRef: '1 Thessalonians 5:18',
  },
  {
    key: 'supplication',
    name: 'Supplication',
    icon: '🤲',
    oneLineDesc: 'Ask with humility — bring your real need, not a polished version.',
    longDesc: "Supplication means asking from a place of genuine dependence — not demanding, not pretending you're fine. It's the posture of someone who knows they need help and isn't embarrassed to say so.",
    exampleSentence: "I need you in this — I'm not going to pretend otherwise.",
    scriptureRef: 'Philippians 4:6',
  },
  {
    key: 'intercession',
    name: 'Intercession',
    icon: '🛡️',
    oneLineDesc: 'Stand in the gap for someone else who needs prayer right now.',
    longDesc: "Intercession is praying on behalf of another person — carrying them before God when they may not even know they need it. It's one of the most quietly powerful things you can do for someone you love.",
    exampleSentence: "I'm bringing someone else to you today — will you meet them where I can't reach?",
    scriptureRef: '1 Timothy 2:1',
  },
  {
    key: 'petition',
    name: 'Petition',
    icon: '📩',
    oneLineDesc: 'Bring a specific request — God invites honest, direct asking.',
    longDesc: 'Petition is focused asking — naming a particular need with clarity and faith. Jesus told his followers to ask, seek, and knock, so bring the actual thing, not a vague version of it.',
    exampleSentence: "Here's exactly what I'm asking for — and I trust you with the answer.",
    scriptureRef: 'Matthew 7:7',
  },
  {
    key: 'warfare',
    name: 'Warfare',
    icon: '⚔️',
    oneLineDesc: "Pray with authority against what's working against you spiritually.",
    longDesc: "Spiritual warfare prayer acknowledges that some of what you're fighting isn't just circumstance — it has a spiritual dimension. You pray from a position of authority in Christ, not from fear.",
    exampleSentence: 'In the name of Jesus, I refuse to surrender what God has promised for my life.',
    scriptureRef: 'Ephesians 6:12',
  },
  {
    key: 'contemplative',
    name: 'Contemplative',
    icon: '🌿',
    oneLineDesc: 'Slow down, go quiet, and let God do the talking for a moment.',
    longDesc: "Contemplative prayer is less about words and more about presence — sitting still before God, releasing the noise, and becoming available to whatever He wants to do. It's harder than it sounds, and more worthwhile than it looks.",
    exampleSentence: "I don't have words right now — I'm just here.",
    scriptureRef: 'Psalm 46:10',
  },
];

const PRAYER_EXAMPLES = [
  {
    id: 'morning-prayer',
    title: 'Morning Prayer',
    category: 'morning',
    previewLine: 'Start the day handed over — before the noise gets loud.',
    fullPrayer: "Before this day gets away from me, I want to give it to you. Whatever comes — the good, the awkward, the hard — let me meet it with you rather than on my own. Steady my hands. Slow my reactions. Keep my heart pointed at what actually matters.",
    scriptureAnchor: 'Psalm 143:8',
  },
  {
    id: 'evening-prayer',
    title: 'Evening Prayer',
    category: 'evening',
    previewLine: 'Lay down the day — the wins, the failures, the unfinished things.',
    fullPrayer: "Here's the day — all of it. The parts that went well and the parts I'd rather redo. I release what I can't fix tonight and trust you with what I can't control tomorrow. Restore what sleep is supposed to restore, and let me wake up knowing you were here through the night.",
    scriptureAnchor: 'Psalm 4:8',
  },
  {
    id: 'prayer-for-anxiety',
    title: 'Prayer for Anxiety',
    category: 'anxiety',
    previewLine: "When your mind won't stop — bring it all to the one who can hold it.",
    fullPrayer: "My thoughts are going fast and my chest is tight and I know logically things could be okay — but it doesn't feel that way. I'm not going to pretend it's fine. Take this anxious weight from me; I don't want to carry it alone. Breathe your peace into this moment, even if I can't feel it yet.",
    scriptureAnchor: 'Philippians 4:6-7',
  },
  {
    id: 'prayer-for-family',
    title: 'Prayer for Family',
    category: 'family',
    previewLine: 'For the people under the same roof — and the ones you wish were closer.',
    fullPrayer: "Cover the people I love most — the ones I see every day and sometimes take for granted. Where there's tension, soften it. Where there's distance, close it. Give us patience with each other and the grace to say the things we should have said sooner. Hold this family together with something stronger than just love for each other.",
    scriptureAnchor: 'Joshua 24:15',
  },
  {
    id: 'prayer-for-the-nation',
    title: 'Prayer for the Nation',
    category: 'nation',
    previewLine: 'Pray for your country with honesty — not pretending, not despairing.',
    fullPrayer: "You are not surprised by where we are. I bring my country to you — not with rose-colored glasses and not with despair. Give our leaders wisdom they don't naturally have. Protect the vulnerable. Heal what's been broken by selfishness and pride. Let justice and mercy find each other again in this place.",
    scriptureAnchor: '2 Chronicles 7:14',
  },
  {
    id: 'prayer-for-enemies',
    title: 'Prayer for Enemies',
    category: 'enemies',
    previewLine: 'The hardest prayer — and the one that might free you most.',
    fullPrayer: "There are people who have hurt me, and honestly I don't feel like praying for them right now — but I'm doing it anyway, because you said to. I'm not asking you to pretend what they did was okay. I'm asking you to reach them, change them, and keep bitterness from building a home in me. Do in them what only you can do — and do the same in me.",
    scriptureAnchor: 'Matthew 5:44',
  },
  {
    id: 'prayer-of-surrender',
    title: 'Prayer of Surrender',
    category: 'surrender',
    previewLine: "Let go of what you've been white-knuckling — and trust the one who holds it.",
    fullPrayer: "There's something I've been holding onto that was never really mine to control. I release it — not because I feel ready, but because holding it isn't working. Have your way in this. I trust that your plans for me are better than the ones I've been making on my own, even when I can't see it.",
    scriptureAnchor: 'Proverbs 3:5-6',
  },
  {
    id: 'prayer-of-gratitude',
    title: 'Prayer of Gratitude',
    category: 'gratitude',
    previewLine: "Name what's good today — even if it's just one thing.",
    fullPrayer: "You've been generous and I haven't always slowed down long enough to notice. Today I want to actually notice. Thank you for things I didn't earn, people I didn't deserve, and moments that were better than my circumstances should have allowed. Every good thing has your fingerprints on it.",
    scriptureAnchor: 'James 1:17',
  },
  {
    id: 'prayer-for-healing',
    title: 'Prayer for Healing',
    category: 'healing',
    previewLine: 'Bring the pain — physical, emotional, or both — to the one who heals.',
    fullPrayer: "Something in me is broken — body, mind, or both — and I need you. I'm not going to tell you how to fix it, but I am asking you to be present in it. Heal what you want to heal, strengthen what needs strengthening, and give me the grace to trust you even in the waiting.",
    scriptureAnchor: 'Jeremiah 17:14',
  },
  {
    id: 'prayer-for-guidance',
    title: 'Prayer for Guidance',
    category: 'guidance',
    previewLine: 'When the next step is unclear — ask the one who sees the whole road.',
    fullPrayer: "I'm standing at a crossroads and I genuinely don't know which way to go. I'm not asking for a sign I can ignore — I'm asking for clarity I can actually follow. Open the right doors and close the wrong ones. Let me recognize your voice when you speak, and have the courage to move when you do.",
    scriptureAnchor: 'Proverbs 3:6',
  },
  {
    id: 'prayer-for-strength',
    title: 'Prayer for Strength',
    category: 'strength',
    previewLine: "When you're running on empty — the supply line runs deeper than you think.",
    fullPrayer: "I've given a lot and I'm tired in a way sleep doesn't fully fix. I'm not asking to feel invincible — I'm asking for enough to do what's in front of me today. Be my strength when mine runs out. Let me lean on you instead of pretending I have reserves I don't have.",
    scriptureAnchor: 'Isaiah 40:31',
  },
  {
    id: 'prayer-for-salvation-of-loved-ones',
    title: 'Prayer for Salvation of Loved Ones',
    category: 'lost-loved-ones',
    previewLine: "Pray for the person on your heart who hasn't said yes to Jesus yet.",
    fullPrayer: "There's someone I love who doesn't know you the way I want them to. I'm not going to force it — that's not mine to do — but I'm bringing them to you again today. Reach them in ways I can't. Let something I say or do or even just am become a crack in the door. Don't give up on them.",
    scriptureAnchor: '2 Peter 3:9',
  },
];

const PRAY_FOR_CATEGORIES = [
  {
    key: 'family',
    name: 'Family',
    emoji: '🏠',
    prompt: 'Lift up the people closest to you — the ones who shape your daily life.',
    suggestions: [
      'Thank God for a specific way a family member has shown up for you this week.',
      'Ask the Lord to bring peace to any tension or conflict currently in your home.',
      "Pray for a family member who is struggling with something they haven't told you about.",
      'Ask God to help you love your family the way they actually need to be loved.',
    ],
  },
  {
    key: 'friends',
    name: 'Friends',
    emoji: '🤝',
    prompt: 'Pray for the people who walk alongside you — the ones who know the real you.',
    suggestions: [
      'Thank God for the friend who has been there during a hard season.',
      'Ask the Lord to protect a specific friend from a decision that could hurt them.',
      'Pray for a friendship that has felt distant lately — ask God to restore it.',
      'Ask God to make you a better friend than you were last month.',
    ],
  },
  {
    key: 'enemies',
    name: 'Enemies',
    emoji: '🕊️',
    prompt: "Pray for those who have hurt you — it's hard, and it matters.",
    suggestions: [
      'Ask God to protect you from bitterness toward someone who wronged you.',
      'Pray that God reaches the person who hurt you — genuinely, not just as a formality.',
      'Ask the Lord to show you if there is anything on your side that needs to change.',
      "Thank God that forgiveness is something He helps you do — you don't have to manufacture it alone.",
    ],
  },
  {
    key: 'leaders',
    name: 'Leaders',
    emoji: '🏛️',
    prompt: 'Pray for those in authority — locally and nationally.',
    suggestions: [
      "Ask God to give your city or town's leaders wisdom they couldn't find on their own.",
      'Pray for national leaders to prioritize justice and the protection of the vulnerable.',
      'Ask the Lord to surround decision-makers with honest voices they will actually listen to.',
      'Thank God for any leader who is genuinely trying to serve well, even imperfectly.',
    ],
  },
  {
    key: 'church',
    name: 'Church',
    emoji: '⛪',
    prompt: 'Pray for the church — your local body and the broader family of faith.',
    suggestions: [
      'Thank God for the people in your church who quietly serve without recognition.',
      'Ask the Lord to give your pastor wisdom, courage, and rest this week.',
      'Pray that your church family would be genuinely unified — not just polite.',
      'Ask God to reach someone new through your church community in the coming weeks.',
    ],
  },
  {
    key: 'nation',
    name: 'Nation',
    emoji: '🗺️',
    prompt: 'Pray for your country — with honesty, not despair.',
    suggestions: [
      'Ask God to heal division in your nation and replace it with something real.',
      'Pray for communities most affected by poverty, violence, or injustice right now.',
      'Ask the Lord to raise up leaders of integrity at every level of government.',
      "Thank God for freedoms you often take for granted — and pray for those who don't have them.",
    ],
  },
  {
    key: 'the-lost',
    name: 'The Lost',
    emoji: '💛',
    prompt: "Pray for those who don't yet know Jesus — including ones you love.",
    suggestions: [
      "Name one person who doesn't know Jesus and ask God to reach them specifically.",
      'Ask the Lord to open a natural conversation about faith with someone in your life.',
      'Pray for people who have heard the gospel and walked away — ask God to draw them back.',
      'Ask God to use your life as a quiet but clear witness to people around you.',
    ],
  },
  {
    key: 'the-suffering',
    name: 'The Suffering',
    emoji: '❤️‍🩹',
    prompt: 'Pray for those carrying grief, illness, or pain right now.',
    suggestions: [
      'Ask God to be present with someone you know who is in physical pain or illness.',
      'Pray for people in your community who are grieving a loss right now.',
      'Ask the Lord to send the right people to those who are isolated and alone.',
      'Thank God for His promise to be close to the brokenhearted — and ask Him to prove it to someone today.',
    ],
  },
  {
    key: 'yourself',
    name: 'Yourself',
    emoji: '🪞',
    prompt: "It's okay to pray for yourself — God wants to hear from you too.",
    suggestions: [
      'Ask God to show you one thing about your character He wants to strengthen this season.',
      "Thank Him for something He has done in your life that you haven't fully acknowledged.",
      "Ask the Lord to help you with something you've been too proud to admit you're struggling with.",
      "Pray for clarity on a decision, relationship, or direction you're unsure about.",
    ],
  },
  {
    key: 'the-world',
    name: 'The World',
    emoji: '🌍',
    prompt: 'Lift your eyes beyond your own context — the whole world is on His heart.',
    suggestions: [
      'Ask God to protect and provide for people living in war zones or active conflict right now.',
      'Pray for communities facing famine, drought, or natural disaster this week.',
      'Ask the Lord to give courage to Christians who face genuine persecution for their faith.',
      'Thank God that His love is not limited by geography — and ask Him to act where only He can.',
    ],
  },
];

const ACTS_FRAMEWORK = [
  {
    letter: 'A',
    word: 'Adoration',
    color: 'gold',
    hex: '#fbbf24',
    oneLine: 'Start with who God is — before the requests.',
    explanation: "Adoration means praising God for His character — His holiness, love, faithfulness, power — not for what He's done for you recently. Beginning here reorients your heart and reminds you who you're actually talking to.",
    examplePrayer: 'You are holy, you are good, and you were both of those things long before I needed anything.',
  },
  {
    letter: 'C',
    word: 'Confession',
    color: 'purple',
    hex: '#a78bfa',
    oneLine: 'Clear the air — bring what\'s real, not what\'s presentable.',
    explanation: "Confession is naming before God the specific ways you've fallen short — in thought, word, or action — and receiving the forgiveness He has already made available through Christ. It's not self-punishment; it's returning to honest relationship.",
    examplePrayer: "I've been selfish this week in ways I can name, and I'm not going to dress it up.",
  },
  {
    letter: 'T',
    word: 'Thanksgiving',
    color: 'green',
    hex: '#22c55e',
    oneLine: "Name what's good — specifically, not generally.",
    explanation: "Thanksgiving moves beyond vague gratitude into concrete recognition of God's goodness in your actual life. The more specific you get — this moment, that person, that outcome — the more your heart notices what it usually rushes past.",
    examplePrayer: "Thank you for the conversation I had today that I didn't expect to go that well.",
  },
  {
    letter: 'S',
    word: 'Supplication',
    color: 'blue',
    hex: '#38bdf8',
    oneLine: 'Ask — for yourself and for others — with honesty.',
    explanation: "Supplication is the asking portion of prayer, both for yourself (petition) and for others (intercession). God doesn't need a polished request — He needs an honest one, brought by someone willing to depend on Him.",
    examplePrayer: "Here's what I actually need, and here's who I'm carrying to you today.",
  },
];

const LECTIO_PRACTICE_VERSE = { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' };

const LECTIO_DIVINA = [
  {
    step: 1,
    latinName: 'Lectio',
    englishName: 'Read',
    oneLine: 'Read it slowly — slower than feels natural.',
    howTo: "Read Psalm 46:10 out loud or quietly, two or three times. Don't rush. Pay attention to which word or phrase catches your attention — not which one you think should stand out, just the one that does. That's your starting point.",
  },
  {
    step: 2,
    latinName: 'Meditatio',
    englishName: 'Reflect',
    oneLine: 'Sit with the word that caught you — and let it speak.',
    howTo: "Take the word or phrase that stood out and turn it over slowly in your mind. Ask: what does this mean? Why did it land on me right now? You're not looking for a sermon — you're listening for something personal. Sit with it for at least two full minutes before moving on.",
  },
  {
    step: 3,
    latinName: 'Oratio',
    englishName: 'Respond',
    oneLine: 'Talk back — whatever the verse stirred up in you.',
    howTo: "Respond to God from what you just noticed — it might be gratitude, a question, a confession, or just an honest reaction. There's no wrong answer here. You can write it, speak it quietly, or just think it. The goal is a real exchange, not a performance.",
  },
  {
    step: 4,
    latinName: 'Contemplatio',
    englishName: 'Rest',
    oneLine: 'Stop talking — and just be with God for a moment.',
    howTo: "Set down your thoughts, close your eyes if that helps, and simply be present with God — no agenda, no words required. This is the hardest step for most people, especially teens, and that's okay. Even sixty seconds of stillness counts. Let Him have the last word.",
  },
];

if (typeof window !== 'undefined') {
  window.PRAYER_TYPES = PRAYER_TYPES;
  window.PRAYER_EXAMPLES = PRAYER_EXAMPLES;
  window.PRAY_FOR_CATEGORIES = PRAY_FOR_CATEGORIES;
  window.ACTS_FRAMEWORK = ACTS_FRAMEWORK;
  window.LECTIO_DIVINA = LECTIO_DIVINA;
  window.LECTIO_PRACTICE_VERSE = LECTIO_PRACTICE_VERSE;
}
