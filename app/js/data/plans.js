/* =============================================================
   plans.js — Faith Hub 2.0 reading plans (F2-B)

   Eight launch plans (mix of topical, beginner, through-the-Bible).
   Schema per spec §4.2 — id, title, short, category, audience, days,
   badgeIcon, brandColor, daysData[{day, refs[], prompt}].

   Brand-palette discipline: brandColor uses ONLY:
     #38bdf8 (cyan)    — through-the-Bible
     #a78bfa (violet)  — topical
     #10b981 (green)   — beginner
     #fbbf24 (amber)   — family (reserved; first family plan ships in F2-H)

   Verse refs use ESV-compatible book names so they pass straight to
   the existing ESV API client without translation.
============================================================= */

const FAITH_PLANS = [
  // ── 1. Anxiety (topical, 7 days) ──────────────────────────
  {
    id: 'anxiety-7',
    title: '7 Days Through Anxiety',
    short: 'A week of Scripture for an anxious mind.',
    category: 'topical',
    audience: 'all',
    days: 7,
    badgeIcon: '🌿',
    brandColor: '#a78bfa',
    daysData: [
      { day: 1, refs: ['Philippians 4:4-9', 'Matthew 6:25-34'], prompt: 'Name one anxious thought that surfaced today. What would it look like to hand it over instead of solve it?' },
      { day: 2, refs: ['Psalm 23', '1 Peter 5:6-7'], prompt: 'Where is fear telling you to run away from God? Try running toward Him with the same energy.' },
      { day: 3, refs: ['Isaiah 41:10-13'], prompt: 'Picture God holding your right hand. What loosens when you hold that image for sixty seconds?' },
      { day: 4, refs: ['Psalm 46', 'Matthew 11:28-30'], prompt: 'The world is loud. What would "be still" look like in the next ten minutes?' },
      { day: 5, refs: ['Romans 8:31-39'], prompt: 'Name one thing you fear losing. Read v. 38-39 and put your fear in the list — does anything separate you from God\'s love?' },
      { day: 6, refs: ['Psalm 27', 'Hebrews 4:14-16'], prompt: 'Anxiety wants you to go silent. What would you tell God if there were no filter?' },
      { day: 7, refs: ['Philippians 4:10-13', 'Lamentations 3:22-26'], prompt: 'Look back at this week. What changed in your worry? What didn\'t? Both are honest.' },
    ],
  },

  // ── 2. What is the Gospel? (beginner, 5 days) ─────────────
  {
    id: 'gospel-5',
    title: 'What is the Gospel?',
    short: 'Five days through the story of God\'s rescue plan.',
    category: 'beginner',
    audience: 'all',
    days: 5,
    badgeIcon: '✨',
    brandColor: '#10b981',
    daysData: [
      { day: 1, refs: ['Genesis 1:26-31', 'Genesis 3:1-13'], prompt: 'Where do you see brokenness in your own life that traces back to the moment in Genesis 3?' },
      { day: 2, refs: ['Romans 3:9-26'], prompt: 'What\'s the hardest thing for you to admit needs God\'s grace?' },
      { day: 3, refs: ['John 3:1-21'], prompt: 'Read v. 16 slowly. Replace "the world" with your own name. What changes?' },
      { day: 4, refs: ['1 Corinthians 15:1-8', 'Mark 16:1-8'], prompt: 'If the resurrection is real, what could it change about your fear of death — or of failure?' },
      { day: 5, refs: ['Ephesians 2:1-10', 'Romans 10:9-13'], prompt: 'Today you can confess Jesus as Lord — out loud, to yourself or to someone you trust. Will you?' },
    ],
  },

  // ── 3. Who is Jesus? (beginner, 10 days) ──────────────────
  {
    id: 'jesus-10',
    title: 'Who is Jesus?',
    short: 'Ten days walking through the life of Jesus.',
    category: 'beginner',
    audience: 'all',
    days: 10,
    badgeIcon: '✝️',
    brandColor: '#10b981',
    daysData: [
      { day: 1,  refs: ['John 1:1-18'],                         prompt: 'Jesus is the Word who became flesh. Why does that matter to you today?' },
      { day: 2,  refs: ['Luke 2:1-20'],                         prompt: 'How does the way Jesus entered the world match — or contradict — your image of God?' },
      { day: 3,  refs: ['Matthew 4:1-11'],                      prompt: 'Jesus was tempted exactly where you are tempted. What does that change about your shame?' },
      { day: 4,  refs: ['Matthew 5:1-16'],                      prompt: 'Which Beatitude is hardest for you? Sit with that one for a few minutes.' },
      { day: 5,  refs: ['Mark 4:35-41'],                        prompt: 'What "storm" in your life needs Jesus to speak peace?' },
      { day: 6,  refs: ['John 11:1-44'],                        prompt: 'Jesus wept before raising Lazarus. He doesn\'t dismiss your grief — He shares it.' },
      { day: 7,  refs: ['Mark 14:32-72'],                       prompt: 'Read Peter\'s denial. Have you ever denied Jesus by silence? What did you learn?' },
      { day: 8,  refs: ['John 19:16-42'],                       prompt: 'Sit with the cross today. No application — just look.' },
      { day: 9,  refs: ['John 20:1-31'],                        prompt: 'What "doubts" would you bring to Jesus, like Thomas did?' },
      { day: 10, refs: ['Matthew 28:16-20', 'Acts 1:1-11'],     prompt: 'Where is Jesus sending you? Name one specific person or place.' },
    ],
  },

  // ── 4. How to Pray (beginner, 5 days) ─────────────────────
  {
    id: 'pray-5',
    title: 'How to Pray',
    short: 'Five days learning to talk with God like a real conversation.',
    category: 'beginner',
    audience: 'all',
    days: 5,
    badgeIcon: '🙏',
    brandColor: '#10b981',
    daysData: [
      { day: 1, refs: ['Matthew 6:5-13'],   prompt: 'Pray the Lord\'s Prayer slowly, line by line, out loud. Where did your mind catch?' },
      { day: 2, refs: ['Psalm 13', 'Psalm 22:1-11'], prompt: 'Honest prayer includes lament. What would your "How long, O Lord" sound like?' },
      { day: 3, refs: ['Luke 18:1-14'],     prompt: 'Two prayers, two postures. Which one is closer to yours today?' },
      { day: 4, refs: ['Philippians 4:6-7', 'James 5:13-18'], prompt: 'Take one specific worry to God right now. Then thank Him for one specific thing.' },
      { day: 5, refs: ['Romans 8:26-27', 'John 16:23-27'], prompt: 'When words fail, the Spirit prays for you. Sit in silence for two minutes — that counts.' },
    ],
  },

  // ── 5. Identity in Christ (topical, 7 days) ───────────────
  {
    id: 'identity-7',
    title: '7 Days on Identity',
    short: 'Who you are, according to the One who made you.',
    category: 'topical',
    audience: 'all',
    days: 7,
    badgeIcon: '💎',
    brandColor: '#a78bfa',
    daysData: [
      { day: 1, refs: ['Psalm 139:1-18'],                       prompt: 'God knows you completely and still loves you. Which line in this Psalm is hardest to receive?' },
      { day: 2, refs: ['Genesis 1:26-31'],                      prompt: 'You are made in God\'s image. What does that mean for how you treat your body, your mind, your reflection?' },
      { day: 3, refs: ['2 Corinthians 5:17', 'Galatians 2:20'], prompt: 'New creation. What from the old is still trying to define you?' },
      { day: 4, refs: ['Ephesians 1:3-14'],                     prompt: 'Underline every "in Christ" — count them. Which one do you most need today?' },
      { day: 5, refs: ['1 Peter 2:9-10'],                       prompt: 'Chosen, royal, holy, His. Which one feels like a stretch — and why?' },
      { day: 6, refs: ['Romans 8:14-17'],                       prompt: 'You are a child of God, not just a follower. Try praying using "Abba" today.' },
      { day: 7, refs: ['Colossians 3:1-17'],                    prompt: 'Set your mind above. What one thing of "the old self" are you ready to take off?' },
    ],
  },

  // ── 6. Forgiveness (topical, 7 days) ──────────────────────
  {
    id: 'forgive-7',
    title: '7 Days on Forgiveness',
    short: 'Real, hard, biblical forgiveness — given and received.',
    category: 'topical',
    audience: 'all',
    days: 7,
    badgeIcon: '🕊️',
    brandColor: '#a78bfa',
    daysData: [
      { day: 1, refs: ['Psalm 51'],                              prompt: 'Confession opens a door. What is one thing you have not yet honestly named to God?' },
      { day: 2, refs: ['1 John 1:5-10'],                         prompt: '"Faithful and just to forgive." Which word is harder for you to believe — faithful, or just?' },
      { day: 3, refs: ['Matthew 18:21-35'],                      prompt: 'Whose face came to mind in v. 28? Why?' },
      { day: 4, refs: ['Ephesians 4:25-32'],                     prompt: 'Forgive as God forgave you. What would change if you held that bar instead of "they deserve it"?' },
      { day: 5, refs: ['Luke 23:32-43'],                         prompt: 'From the cross, Jesus forgave. What does that say about the limit of forgiveness?' },
      { day: 6, refs: ['Romans 12:14-21'],                       prompt: 'Bless those who persecute you. Pick one person to actually pray a blessing over today.' },
      { day: 7, refs: ['Colossians 3:12-15'],                    prompt: 'Look back at this week. Has anything softened? Honest answer only.' },
    ],
  },

  // ── 7. Gospels in 30 (through-the-Bible, 30 days) ─────────
  {
    id: 'gospels-30',
    title: 'Gospels in 30',
    short: 'All four Gospels in a month — Matthew, Mark, Luke, John.',
    category: 'through-the-bible',
    audience: 'all',
    days: 30,
    badgeIcon: '📖',
    brandColor: '#38bdf8',
    daysData: [
      // Matthew (10 days)
      { day: 1,  refs: ['Matthew 1', 'Matthew 2', 'Matthew 3'],   prompt: 'Genealogy + Magi + Baptism. What does Jesus\'s lineage tell you about God\'s patience?' },
      { day: 2,  refs: ['Matthew 4', 'Matthew 5'],                prompt: 'Temptation, then the start of the Sermon on the Mount. Which Beatitude lands hardest?' },
      { day: 3,  refs: ['Matthew 6', 'Matthew 7'],                prompt: 'The rest of the Sermon. One teaching to apply this week — pick it.' },
      { day: 4,  refs: ['Matthew 8', 'Matthew 9'],                prompt: 'Miracles back-to-back. Which person Jesus healed do you most relate to?' },
      { day: 5,  refs: ['Matthew 10', 'Matthew 11', 'Matthew 12'],prompt: 'The cost of following + Sabbath confrontations. What does Jesus call rest?' },
      { day: 6,  refs: ['Matthew 13', 'Matthew 14', 'Matthew 15'],prompt: 'Parables of the Kingdom. Which soil are you?' },
      { day: 7,  refs: ['Matthew 16', 'Matthew 17', 'Matthew 18'],prompt: 'Peter\'s confession + Transfiguration + forgiveness. How is your "Who do you say I am"?' },
      { day: 8,  refs: ['Matthew 19', 'Matthew 20', 'Matthew 21'],prompt: 'Rich young ruler, last shall be first, triumphal entry. What is your "great possession"?' },
      { day: 9,  refs: ['Matthew 22', 'Matthew 23', 'Matthew 24'],prompt: 'The greatest command, woes, end times. What religious "for show" might Jesus be calling out in you?' },
      { day: 10, refs: ['Matthew 25', 'Matthew 26', 'Matthew 27', 'Matthew 28'], prompt: 'Last week, cross, resurrection. Sit with the empty tomb.' },
      // Mark (5 days, fast-paced)
      { day: 11, refs: ['Mark 1', 'Mark 2', 'Mark 3'],            prompt: 'Mark moves fast. Notice the urgency. Where does Jesus interrupt?' },
      { day: 12, refs: ['Mark 4', 'Mark 5', 'Mark 6'],            prompt: 'Storm calmed, demons cast out, 5,000 fed. What scale of problem do you bring to Jesus?' },
      { day: 13, refs: ['Mark 7', 'Mark 8', 'Mark 9'],            prompt: 'Heart vs. tradition + Peter\'s confession. What tradition are you defending more than Jesus?' },
      { day: 14, refs: ['Mark 10', 'Mark 11', 'Mark 12'],         prompt: 'Children, rich man, blind Bartimaeus. What does childlike faith look like for you?' },
      { day: 15, refs: ['Mark 13', 'Mark 14', 'Mark 15', 'Mark 16'], prompt: 'End of Mark. The young man at the empty tomb says, "He is risen." What does that change today?' },
      // Luke (8 days)
      { day: 16, refs: ['Luke 1', 'Luke 2'],                      prompt: 'Mary\'s song + Simeon\'s blessing. What does God do with the unlikely?' },
      { day: 17, refs: ['Luke 3', 'Luke 4', 'Luke 5'],            prompt: 'Baptism, temptation, Nazareth, calling fishermen. Where is Jesus calling you to drop the nets?' },
      { day: 18, refs: ['Luke 6', 'Luke 7', 'Luke 8'],            prompt: 'Sermon on the Plain + the woman who anointed His feet. What does grateful love look like for you?' },
      { day: 19, refs: ['Luke 9', 'Luke 10'],                     prompt: 'Sending the 72 + Good Samaritan + Mary and Martha. Which one is your default?' },
      { day: 20, refs: ['Luke 11', 'Luke 12'],                    prompt: 'Lord\'s Prayer + "do not worry." What anxiety would Jesus name today?' },
      { day: 21, refs: ['Luke 13', 'Luke 14', 'Luke 15'],         prompt: 'Lost sheep, lost coin, lost son. Which one are you in the story this week?' },
      { day: 22, refs: ['Luke 16', 'Luke 17', 'Luke 18'],         prompt: 'Lazarus and the rich man + persistent widow. What are you persistent about?' },
      { day: 23, refs: ['Luke 19', 'Luke 20', 'Luke 21', 'Luke 22', 'Luke 23', 'Luke 24'], prompt: 'Zacchaeus to the Emmaus road. Where is your heart "burning within you" lately?' },
      // John (7 days, theological)
      { day: 24, refs: ['John 1', 'John 2', 'John 3'],            prompt: 'The Word + Cana + Nicodemus. What part of you needs to be born again today?' },
      { day: 25, refs: ['John 4', 'John 5', 'John 6'],            prompt: 'The woman at the well + the bread of life. What thirst keeps coming back for you?' },
      { day: 26, refs: ['John 7', 'John 8', 'John 9'],            prompt: 'The woman caught + the man born blind. Which side are you on more often — accuser or accused?' },
      { day: 27, refs: ['John 10', 'John 11', 'John 12'],         prompt: 'Good Shepherd + Lazarus raised. What "tomb" needs Jesus\'s voice today?' },
      { day: 28, refs: ['John 13', 'John 14', 'John 15'],         prompt: 'Foot-washing + "I am the vine." Where are you trying to bear fruit cut off from the vine?' },
      { day: 29, refs: ['John 16', 'John 17', 'John 18'],         prompt: 'Jesus prays for you in chapter 17. Read v. 20 — that\'s about you.' },
      { day: 30, refs: ['John 19', 'John 20', 'John 21'],         prompt: '"Do you love me?" Jesus asks Peter three times. Sit with each one.' },
    ],
  },

  // ── 8. Psalms in 30 (through-the-Bible, 30 days) ──────────
  {
    id: 'psalms-30',
    title: 'Psalms in 30',
    short: 'A month through the prayer book of the Bible.',
    category: 'through-the-bible',
    audience: 'all',
    days: 30,
    badgeIcon: '🎵',
    brandColor: '#38bdf8',
    daysData: [
      { day: 1,  refs: ['Psalm 1',   'Psalm 23',  'Psalm 27'],  prompt: 'Foundational psalms. Which one do you most need today?' },
      { day: 2,  refs: ['Psalm 8',   'Psalm 19',  'Psalm 33'],  prompt: 'Creation and glory. Where did you see God\'s handiwork in the last 24 hours?' },
      { day: 3,  refs: ['Psalm 32',  'Psalm 51'],               prompt: 'Confession opens a door. What needs confessing?' },
      { day: 4,  refs: ['Psalm 42',  'Psalm 43',  'Psalm 88'],  prompt: 'Lament is sacred. What grief have you been carrying alone?' },
      { day: 5,  refs: ['Psalm 90',  'Psalm 91',  'Psalm 121'], prompt: 'God as refuge. What are you running from?' },
      { day: 6,  refs: ['Psalm 4',   'Psalm 5',   'Psalm 6'],   prompt: 'Morning, evening, weeping. Which time of day is hardest for your faith?' },
      { day: 7,  refs: ['Psalm 9',   'Psalm 10',  'Psalm 11'],  prompt: '"Why do You stand far off?" Have you ever asked that? Ask it now.' },
      { day: 8,  refs: ['Psalm 12',  'Psalm 13',  'Psalm 14'],  prompt: '"How long, O Lord?" — pray it about something specific.' },
      { day: 9,  refs: ['Psalm 15',  'Psalm 16',  'Psalm 17'],  prompt: 'Who dwells with God? Read 15:1-5 and check your own week.' },
      { day: 10, refs: ['Psalm 18'],                             prompt: 'David\'s long song after rescue. What rescue would you write a song about?' },
      { day: 11, refs: ['Psalm 20',  'Psalm 21',  'Psalm 22'],  prompt: 'Psalm 22 is the cross-prayer. Read it slowly — pay attention to v. 1.' },
      { day: 12, refs: ['Psalm 24',  'Psalm 25',  'Psalm 26'],  prompt: '"Who may ascend the hill of the Lord?" — what would clean hands and a pure heart mean for you today?' },
      { day: 13, refs: ['Psalm 28',  'Psalm 29',  'Psalm 30'],  prompt: '"Weeping may stay for the night, but joy comes in the morning." What night are you in?' },
      { day: 14, refs: ['Psalm 31',  'Psalm 33',  'Psalm 34'],  prompt: '"The Lord is close to the brokenhearted." Sit with that.' },
      { day: 15, refs: ['Psalm 35',  'Psalm 36',  'Psalm 37'],  prompt: '"Delight yourself in the Lord." What delights you about Him?' },
      { day: 16, refs: ['Psalm 38',  'Psalm 39',  'Psalm 40'],  prompt: '"He lifted me out of the slimy pit." What pit have you been lifted from?' },
      { day: 17, refs: ['Psalm 41',  'Psalm 44',  'Psalm 46'],  prompt: '"Be still, and know that I am God." Take 60 seconds of literal stillness.' },
      { day: 18, refs: ['Psalm 47',  'Psalm 48',  'Psalm 50'],  prompt: '"God is the King of all the earth." Where are you trying to be king?' },
      { day: 19, refs: ['Psalm 52',  'Psalm 53',  'Psalm 54'],  prompt: 'Surely God is my help. Where is help most needed this week?' },
      { day: 20, refs: ['Psalm 55',  'Psalm 56',  'Psalm 57'],  prompt: '"Cast your cares on the Lord." Cast one specific care right now.' },
      { day: 21, refs: ['Psalm 62',  'Psalm 63',  'Psalm 65'],  prompt: '"My soul thirsts for You." What are you thirsty for instead?' },
      { day: 22, refs: ['Psalm 66',  'Psalm 67',  'Psalm 68'],  prompt: 'Praise + blessing. Write a single sentence of thanks.' },
      { day: 23, refs: ['Psalm 71',  'Psalm 73',  'Psalm 77'],  prompt: '"My flesh and my heart may fail, but God is the strength of my heart."' },
      { day: 24, refs: ['Psalm 84',  'Psalm 86',  'Psalm 89'],  prompt: '"Better is one day in Your courts than a thousand elsewhere." Is that true for you?' },
      { day: 25, refs: ['Psalm 92',  'Psalm 95',  'Psalm 96'],  prompt: 'Psalm 96 is a worship invitation. Sing one song today, even alone.' },
      { day: 26, refs: ['Psalm 100', 'Psalm 103', 'Psalm 107'], prompt: '"Praise the Lord, my soul." List five benefits from Psalm 103 — out loud.' },
      { day: 27, refs: ['Psalm 110', 'Psalm 116', 'Psalm 118'], prompt: '"This is the day the Lord has made." Whatever today is — claim it.' },
      { day: 28, refs: ['Psalm 119:1-88'],                       prompt: 'Half of the longest Psalm — every line about God\'s Word. Underline one verse.' },
      { day: 29, refs: ['Psalm 119:89-176'],                     prompt: 'Finish 119. Your favorite line — write it on a card and put it somewhere you\'ll see it.' },
      { day: 30, refs: ['Psalm 139', 'Psalm 145', 'Psalm 150'],  prompt: '"Let everything that has breath praise the Lord." End the month with breath and praise.' },
    ],
  },
];

// Expose globally so faith.js (loaded after this file) can read the catalog
// without needing module imports — same pattern as DAILY_SCRIPTURES + DEVOTIONALS.
if (typeof window !== 'undefined') {
  window.FAITH_PLANS = FAITH_PLANS;
}

// ── F3-F: Geography reading plans tied to Biblical World ─────
// Appended after launch in F3-F. Users walking the Walk-Where-Jesus-Walked
// or Following-Paul plans encounter ESV chapters that include data-place
// markers from F3-B; tapping place names opens the site profile drawer.
const FAITH_GEOGRAPHY_PLANS = [
  {
    id: 'walk-where-jesus-walked-10',
    title: 'Walk Where Jesus Walked',
    short: 'Ten days reading Scripture in the towns Jesus actually visited.',
    category: 'through-the-bible',
    audience: 'all',
    days: 10,
    badgeIcon: '🚶',
    brandColor: '#34d399',
    routeId: 'walk-with-jesus',
    markerEmoji: '🚶',
    daysData: [
      { day: 1,  refs: ['Luke 2:1-20'],     prompt: 'Bethlehem — read where He was born. Tap Bethlehem in the text to see the site.' },
      { day: 2,  refs: ['Luke 2:39-52'],    prompt: 'Nazareth — His hometown for 30 silent years. What does that say about ordinary obedience?' },
      { day: 3,  refs: ['Matthew 3:13-17'], prompt: 'Jordan River — His baptism. The Father said "beloved" before any public ministry.' },
      { day: 4,  refs: ['Mark 1:14-39'],    prompt: 'Capernaum — base of His ministry. What\'s your "Capernaum" — the place He keeps sending you back to?' },
      { day: 5,  refs: ['Mark 4:35-41'],    prompt: 'Sea of Galilee — He calmed the storm. What storm needs that voice today?' },
      { day: 6,  refs: ['Matthew 16:13-20'],prompt: 'Caesarea Philippi — "Who do you say I am?" Sit with the question.' },
      { day: 7,  refs: ['John 4:1-42'],     prompt: 'Shechem (Sychar) — the woman at the well. What well do you keep going back to?' },
      { day: 8,  refs: ['Matthew 21:1-17'], prompt: 'Jerusalem — triumphal entry, then Temple cleansing. The week begins.' },
      { day: 9,  refs: ['Matthew 26:36-56'],prompt: 'Gethsemane — "Not my will, but yours." Pray it slowly tonight.' },
      { day: 10, refs: ['John 19:17-42','John 20:1-18'], prompt: 'Golgotha and the empty tomb. Sit with both.' },
    ],
  },
  {
    id: 'following-paul-14',
    title: 'Following Paul',
    short: 'Fourteen days through the cities Paul evangelized.',
    category: 'through-the-bible',
    audience: 'all',
    days: 14,
    badgeIcon: '✉️',
    brandColor: '#f472b6',
    routeId: 'pauls-third-journey',
    markerEmoji: '⛵',
    daysData: [
      { day: 1,  refs: ['Acts 9:1-22'],   prompt: 'Damascus — Saul becomes Paul. Where has Jesus interrupted you?' },
      { day: 2,  refs: ['Acts 11:19-30'], prompt: 'Antioch — disciples first called Christians. The church gets its name.' },
      { day: 3,  refs: ['Acts 13:1-12'],  prompt: 'Cyprus — first missionary journey starts. The Spirit sends.' },
      { day: 4,  refs: ['Acts 14:8-28'],  prompt: 'Lystra and Derbe — preaching, stoning, returning. Resilience.' },
      { day: 5,  refs: ['Acts 16:6-15'],  prompt: 'Macedonia call → Philippi. Lydia\'s heart opened.' },
      { day: 6,  refs: ['Acts 16:16-40'], prompt: 'Philippi prison — Paul and Silas singing at midnight. What can you sing in your prison?' },
      { day: 7,  refs: ['Acts 17:1-15'],  prompt: 'Thessalonica + Berea — Bereans "examined the Scriptures daily." How is your daily reading?' },
      { day: 8,  refs: ['Acts 17:16-34'], prompt: 'Athens — Mars Hill sermon. Cross-cultural witness.' },
      { day: 9,  refs: ['Acts 18:1-17'],  prompt: 'Corinth — Paul stays 18 months. Slow ministry in a hard city.' },
      { day: 10, refs: ['Acts 19:1-22'],  prompt: 'Ephesus — three years. The longest stop. What is your Ephesus?' },
      { day: 11, refs: ['Acts 19:23-41'], prompt: 'Ephesus riots — when the gospel disrupts an economy.' },
      { day: 12, refs: ['Acts 20:17-38'], prompt: 'Miletus — Paul\'s farewell to Ephesian elders. Read the tears.' },
      { day: 13, refs: ['Acts 21:27 - 22:30'], prompt: 'Jerusalem arrest. The mission costs.' },
      { day: 14, refs: ['Acts 28:11-31'], prompt: 'Rome — Paul preaches "openly and without hindrance" from house arrest. The end of Acts. The story keeps going.' },
    ],
  },
  {
    id: 'stones-that-speak-7',
    title: 'Stones That Speak',
    short: 'Seven days through Scripture confirmed by archaeology.',
    category: 'through-the-bible',
    audience: 'all',
    days: 7,
    badgeIcon: '🏺',
    brandColor: '#fbbf24',
    daysData: [
      { day: 1, refs: ['2 Kings 18:13-19','2 Chronicles 32:9-23'], prompt: 'Sennacherib\'s siege of Jerusalem. The Assyrian prism agrees on every detail except the outcome.' },
      { day: 2, refs: ['2 Kings 20:20','2 Chronicles 32:30'],     prompt: 'Hezekiah\'s tunnel. Still walkable today. The Bible mentions a specific construction project; archaeologists still walk through it.' },
      { day: 3, refs: ['Numbers 6:24-26'],                          prompt: 'Aaronic blessing. The Ketef Hinnom silver scrolls have it inscribed in 7th-century BC silver — oldest biblical text we have.' },
      { day: 4, refs: ['2 Samuel 7:12-16','1 Kings 14:30'],        prompt: 'House of David. Tel Dan Stele names it on stone — the same royal house, in the same century.' },
      { day: 5, refs: ['Luke 3:1','John 19:1-22'],                 prompt: 'Pontius Pilate, prefect. The Pilate Stone confirms he existed, governing where the Bible says he did.' },
      { day: 6, refs: ['John 5:1-15','John 9:1-12'],               prompt: 'Pools of Bethesda and Siloam. Both excavated. Both match John\'s description.' },
      { day: 7, refs: ['Romans 16:23'],                              prompt: 'Erastus, Corinth\'s public-works director. A Latin pavement inscription names him in his role. Paul\'s greetings list is real social fabric.' },
    ],
  },
  {
    id: 'through-holy-land-21',
    title: 'Through the Holy Land',
    short: 'Three weeks across all the major biblical regions.',
    category: 'through-the-bible',
    audience: 'all',
    days: 21,
    badgeIcon: '🗺️',
    brandColor: '#38bdf8',
    routeId: 'patriarchs',
    markerEmoji: '📍',
    daysData: [
      { day: 1,  refs: ['Genesis 12:1-9'],   prompt: 'Ur to Canaan — Abraham\'s call.' },
      { day: 2,  refs: ['Genesis 22:1-19'],  prompt: 'Mount Moriah — the binding of Isaac.' },
      { day: 3,  refs: ['Genesis 28:10-22'], prompt: 'Bethel — Jacob\'s ladder.' },
      { day: 4,  refs: ['Genesis 32:22-32'], prompt: 'Peniel — Jacob wrestles God.' },
      { day: 5,  refs: ['Exodus 14'],        prompt: 'Red Sea crossing.' },
      { day: 6,  refs: ['Exodus 19','Exodus 20'], prompt: 'Mount Sinai — the giving of the Law.' },
      { day: 7,  refs: ['Joshua 6'],         prompt: 'Jericho — the walls fall.' },
      { day: 8,  refs: ['Joshua 24'],        prompt: 'Shechem — covenant renewal.' },
      { day: 9,  refs: ['1 Samuel 17'],      prompt: 'Valley of Elah — David and Goliath.' },
      { day: 10, refs: ['1 Kings 8'],        prompt: 'Jerusalem — Solomon dedicates the Temple.' },
      { day: 11, refs: ['1 Kings 18'],       prompt: 'Mount Carmel — Elijah and the prophets of Baal.' },
      { day: 12, refs: ['Daniel 6'],         prompt: 'Babylon — Daniel in the lions\' den.' },
      { day: 13, refs: ['Nehemiah 6'],       prompt: 'Jerusalem rebuilt — Nehemiah finishes the wall.' },
      { day: 14, refs: ['Luke 2:1-20'],      prompt: 'Bethlehem — Jesus is born.' },
      { day: 15, refs: ['Matthew 4:1-11'],   prompt: 'Wilderness — Jesus\'s temptation.' },
      { day: 16, refs: ['Matthew 5:1-16'],   prompt: 'Mount of Beatitudes — the Sermon on the Mount.' },
      { day: 17, refs: ['John 11:1-44'],     prompt: 'Bethany — Lazarus raised.' },
      { day: 18, refs: ['Matthew 26:36 - 27:66'], prompt: 'Jerusalem — Gethsemane to the cross.' },
      { day: 19, refs: ['John 20'],          prompt: 'The empty tomb.' },
      { day: 20, refs: ['Acts 1:1-11','Acts 2'], prompt: 'Mount of Olives → Pentecost in Jerusalem. The church begins.' },
      { day: 21, refs: ['Revelation 21:1-7','Revelation 22:1-5'], prompt: 'New Jerusalem — where the whole story is going.' },
    ],
  },
];

if (typeof window !== 'undefined') {
  window.FAITH_PLANS = FAITH_PLANS.concat(FAITH_GEOGRAPHY_PLANS);
}
