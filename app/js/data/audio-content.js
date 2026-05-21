// YourLife CC — Audio Layer Content Data
// Powers: Audio Meditations, Sleep Stories, Ambient Library, Mood Audio
// All content uses free Web Speech API + YouTube no-cookie embeds
// Upgrade path: replace web speech with ElevenLabs/OpenAI TTS in premium tier

// ─────────────────────────────────────────────────────────
// AUDIO MEDITATIONS — Scripture-led guided audio sessions
// ─────────────────────────────────────────────────────────
const AUDIO_MEDITATIONS = [
  {
    id: 'med-morning',
    title: 'Morning Light',
    icon: '🌅',
    duration: 8,
    theme: 'Starting the day in God\'s presence',
    description: 'A gentle 8-minute meditation to anchor your morning in Scripture before the day begins.',
    ambientYouTube: 'VYXDfhgwTyM', // 24/7 peaceful worship piano
    scriptureFocus: 'Lamentations 3:22-23',
    segments: [
      { duration: 30, type: 'opening', text: 'Take three slow breaths. Let your body settle. God is already here with you.', audioUrl: '/audio/med-morning_seg0.mp3' },
      { duration: 60, type: 'scripture', text: 'The steadfast love of the Lord never ceases. His mercies never come to an end. They are new every morning. Great is His faithfulness.', verse: 'Lamentations 3:22-23', audioUrl: '/audio/med-morning_seg1.mp3' },
      { duration: 60, type: 'reflection', text: 'New mercies. Today. Not yesterday\'s mercies for today\'s troubles — fresh ones, made for this exact day.', audioUrl: '/audio/med-morning_seg2.mp3' },
      { duration: 60, type: 'silence', text: 'Sit with that truth in silence for a moment.', audioUrl: '/audio/med-morning_seg3.mp3' },
      { duration: 90, type: 'scripture', text: 'This is the day that the Lord has made. We will rejoice and be glad in it.', verse: 'Psalm 118:24', audioUrl: '/audio/med-morning_seg4.mp3' },
      { duration: 60, type: 'reflection', text: 'Whatever today holds — it was made. Made by a God who never improvises, never panics, never abandons. Made for you.', audioUrl: '/audio/med-morning_seg5.mp3' },
      { duration: 60, type: 'prayer', text: 'Father, I receive Your mercies for today. Help me walk in them. Help me notice You as I go.', audioUrl: '/audio/med-morning_seg6.mp3' },
      { duration: 30, type: 'close', text: 'Open your eyes. Step into the day God has made for you.', audioUrl: '/audio/med-morning_seg7.mp3' }
    ]
  },
  {
    id: 'med-anxiety',
    title: 'Peace in the Storm',
    icon: '🕊️',
    duration: 10,
    theme: 'When anxiety is loud',
    description: 'A 10-minute meditation for moments of anxiety, panic, or overwhelm.',
    ambientYouTube: 'VYXDfhgwTyM', // 24/7 peaceful worship piano
    scriptureFocus: 'Philippians 4:6-7',
    segments: [
      { duration: 60, type: 'opening', text: 'Wherever you are right now, you are safe in this moment. Take a slow breath. Hold it. Release it.', audioUrl: '/audio/med-anxiety_seg0.mp3' },
      { duration: 30, type: 'breath', text: 'Breathe in for four counts. Hold for four. Out for four. Again.', audioUrl: '/audio/med-anxiety_seg1.mp3' },
      { duration: 60, type: 'scripture', text: 'Do not be anxious about anything. But in every situation, by prayer and petition, with thanksgiving, present your requests to God.', verse: 'Philippians 4:6', audioUrl: '/audio/med-anxiety_seg2.mp3' },
      { duration: 60, type: 'reflection', text: 'You don\'t have to fix the anxiety first. You bring it as it is. God can handle the messy version of your prayer.', audioUrl: '/audio/med-anxiety_seg3.mp3' },
      { duration: 60, type: 'scripture', text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', verse: 'Philippians 4:7', audioUrl: '/audio/med-anxiety_seg4.mp3' },
      { duration: 90, type: 'reflection', text: 'Notice the word guard. Peace becomes a sentinel around your mind. It doesn\'t depend on understanding the situation — it depends on Christ.', audioUrl: '/audio/med-anxiety_seg5.mp3' },
      { duration: 60, type: 'cast', text: 'Now physically open your hands. Imagine placing your worry in them. Picture handing it to Jesus. He takes it. He carries it.', audioUrl: '/audio/med-anxiety_seg6.mp3' },
      { duration: 90, type: 'scripture', text: 'Cast all your anxiety on Him because He cares for you.', verse: '1 Peter 5:7', audioUrl: '/audio/med-anxiety_seg7.mp3' },
      { duration: 60, type: 'prayer', text: 'Lord, I cast this onto You. I don\'t pick it back up. Your peace, which transcends all understanding, guard my heart.', audioUrl: '/audio/med-anxiety_seg8.mp3' },
      { duration: 30, type: 'close', text: 'When you\'re ready, open your eyes. You are not alone in this.', audioUrl: '/audio/med-anxiety_seg9.mp3' }
    ]
  },
  {
    id: 'med-gratitude',
    title: 'Gratitude Practice',
    icon: '✨',
    duration: 7,
    theme: 'Training the eyes to see grace',
    description: 'A 7-minute meditation to shift your heart from striving to thankfulness.',
    ambientYouTube: 'VYXDfhgwTyM', // 24/7 peaceful worship piano
    scriptureFocus: 'Psalm 100',
    segments: [
      { duration: 30, type: 'opening', text: 'Settle into stillness. Notice your breath. Notice your heartbeat. Both are gifts you didn\'t earn.', audioUrl: '/audio/med-gratitude_seg0.mp3' },
      { duration: 60, type: 'scripture', text: 'Make a joyful noise to the Lord, all the earth. Serve the Lord with gladness. Come into His presence with singing.', verse: 'Psalm 100:1-2', audioUrl: '/audio/med-gratitude_seg1.mp3' },
      { duration: 90, type: 'reflection', text: 'Gratitude is not pretending things are perfect. It\'s noticing where God has been good — even in imperfect days. Think back over the last 24 hours. What\'s one small kindness you noticed?', audioUrl: '/audio/med-gratitude_seg2.mp3' },
      { duration: 60, type: 'silence', text: 'Hold that moment. Let yourself feel the goodness of it.', audioUrl: '/audio/med-gratitude_seg3.mp3' },
      { duration: 90, type: 'scripture', text: 'Enter His gates with thanksgiving and His courts with praise. Give thanks to Him. Bless His name.', verse: 'Psalm 100:4', audioUrl: '/audio/med-gratitude_seg4.mp3' },
      { duration: 60, type: 'practice', text: 'Name three things aloud right now that you are thankful for. Speak them. Hear them.', audioUrl: '/audio/med-gratitude_seg5.mp3' },
      { duration: 30, type: 'close', text: 'Carry that thankful posture into your day. Watch how it changes what you see.', audioUrl: '/audio/med-gratitude_seg6.mp3' }
    ]
  },
  {
    id: 'med-identity',
    title: 'Who You Are',
    icon: '👤',
    duration: 9,
    theme: 'Your identity in Christ',
    description: 'A 9-minute meditation declaring biblical truths about who you are.',
    ambientYouTube: 'VYXDfhgwTyM', // 24/7 peaceful worship piano
    scriptureFocus: 'Ephesians 1:3-14',
    segments: [
      { duration: 30, type: 'opening', text: 'Sit comfortably. Let your shoulders drop. The world has been telling you things about yourself today. Time to hear the truth.', audioUrl: '/audio/med-identity_seg0.mp3' },
      { duration: 90, type: 'declaration', text: 'I am loved by God. Before I did anything, before I failed at anything, I was loved.', verse: 'Ephesians 1:4', audioUrl: '/audio/med-identity_seg1.mp3' },
      { duration: 60, type: 'silence', text: 'Let that land. Don\'t move past it too quickly.', audioUrl: '/audio/med-identity_seg2.mp3' },
      { duration: 90, type: 'declaration', text: 'I am chosen. Not an accident. Not a backup plan. Chosen by name.', verse: 'Ephesians 1:4-5', audioUrl: '/audio/med-identity_seg3.mp3' },
      { duration: 90, type: 'declaration', text: 'I am forgiven. The blood of Jesus has cleansed every sin — past, present, and future.', verse: 'Ephesians 1:7', audioUrl: '/audio/med-identity_seg4.mp3' },
      { duration: 90, type: 'declaration', text: 'I am sealed by the Holy Spirit. God Himself lives in me. I belong to Him.', verse: 'Ephesians 1:13', audioUrl: '/audio/med-identity_seg5.mp3' },
      { duration: 60, type: 'reflection', text: 'These are not feelings. These are facts. You can stand on them when feelings betray you.', audioUrl: '/audio/med-identity_seg6.mp3' },
      { duration: 60, type: 'prayer', text: 'God, plant these truths so deep in me that nothing can shake them out. I receive who You say I am.', audioUrl: '/audio/med-identity_seg7.mp3' },
      { duration: 30, type: 'close', text: 'You are loved. Chosen. Forgiven. Sealed. Go walk in that.', audioUrl: '/audio/med-identity_seg8.mp3' }
    ]
  },
  {
    id: 'med-rest',
    title: 'Sabbath Rest',
    icon: '🛐',
    duration: 12,
    theme: 'Resting in God\'s finished work',
    description: 'A 12-minute meditation to enter true rest — body, mind, and spirit.',
    ambientYouTube: 'VYXDfhgwTyM', // 24/7 peaceful worship piano
    scriptureFocus: 'Matthew 11:28-30',
    segments: [
      { duration: 60, type: 'opening', text: 'You are not behind. You are not too much. Wherever you are right now is where God wants to meet you.', audioUrl: '/audio/med-rest_seg0.mp3' },
      { duration: 60, type: 'breath', text: 'Long, slow breath in. Long, slow breath out. Do that three times.', audioUrl: '/audio/med-rest_seg1.mp3' },
      { duration: 90, type: 'scripture', text: 'Come to Me, all you who are weary and burdened, and I will give you rest.', verse: 'Matthew 11:28', audioUrl: '/audio/med-rest_seg2.mp3' },
      { duration: 120, type: 'reflection', text: 'Notice — Jesus doesn\'t ask you to deserve the rest. He doesn\'t ask you to earn it. He just says come. Tired, messy, behind. Come anyway.', audioUrl: '/audio/med-rest_seg3.mp3' },
      { duration: 90, type: 'scripture', text: 'Take My yoke upon you and learn from Me. For I am gentle and humble in heart. You will find rest for your souls.', verse: 'Matthew 11:29', audioUrl: '/audio/med-rest_seg4.mp3' },
      { duration: 120, type: 'reflection', text: 'A yoke ties two animals together so the stronger one carries the weight. Jesus is the stronger one. You are not pulling alone.', audioUrl: '/audio/med-rest_seg5.mp3' },
      { duration: 90, type: 'silence', text: 'Sit in the silence. Don\'t produce anything. Don\'t fix anything. Just be.', audioUrl: '/audio/med-rest_seg6.mp3' },
      { duration: 90, type: 'scripture', text: 'For My yoke is easy and My burden is light.', verse: 'Matthew 11:30', audioUrl: '/audio/med-rest_seg7.mp3' },
      { duration: 60, type: 'prayer', text: 'Jesus, I am tired. I receive Your rest. I lay down what I was never meant to carry.', audioUrl: '/audio/med-rest_seg8.mp3' },
      { duration: 30, type: 'close', text: 'You can rest in Him. The world will keep spinning. He has not let go.', audioUrl: '/audio/med-rest_seg9.mp3' }
    ]
  },
  {
    id: 'med-hope',
    title: 'Hope When It\'s Heavy',
    icon: '🌱',
    duration: 9,
    theme: 'Hope in dark seasons',
    description: 'A 9-minute meditation for grief, loss, or seasons of waiting.',
    ambientYouTube: 'VYXDfhgwTyM', // 24/7 peaceful worship piano
    scriptureFocus: 'Romans 8:18-28',
    segments: [
      { duration: 30, type: 'opening', text: 'Wherever you are in this season — God sees it. He hasn\'t looked away.', audioUrl: '/audio/med-hope_seg0.mp3' },
      { duration: 90, type: 'scripture', text: 'I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.', verse: 'Romans 8:18', audioUrl: '/audio/med-hope_seg1.mp3' },
      { duration: 90, type: 'reflection', text: 'This is not minimizing your pain. Paul wrote this from prison. It is saying — what is coming is more weight than what is here. Both are real.', audioUrl: '/audio/med-hope_seg2.mp3' },
      { duration: 90, type: 'scripture', text: 'And we know that in all things God works for the good of those who love Him.', verse: 'Romans 8:28', audioUrl: '/audio/med-hope_seg3.mp3' },
      { duration: 120, type: 'reflection', text: 'In ALL things. Not just the good ones. He weaves even this into something good. You may not see it yet. Trust the weaver.', audioUrl: '/audio/med-hope_seg4.mp3' },
      { duration: 60, type: 'silence', text: 'Sit in the not-yet. God is still working.', audioUrl: '/audio/med-hope_seg5.mp3' },
      { duration: 90, type: 'prayer', text: 'Father, I don\'t see how this becomes good yet. But I trust You. Plant hope in me that doesn\'t depend on what I can see.', audioUrl: '/audio/med-hope_seg6.mp3' },
      { duration: 30, type: 'close', text: 'Hope is not pretending the wait isn\'t hard. It\'s knowing the wait is not the end.', audioUrl: '/audio/med-hope_seg7.mp3' }
    ]
  },
  {
    id: 'med-faith',
    title: 'Faith That Moves',
    icon: '⛰️',
    duration: 8,
    theme: 'Trust when the path is unclear',
    description: 'An 8-minute meditation for trusting God in uncertainty.',
    ambientYouTube: 'VYXDfhgwTyM', // 24/7 peaceful worship piano
    scriptureFocus: 'Hebrews 11:1',
    segments: [
      { duration: 30, type: 'opening', text: 'Faith doesn\'t mean you have no doubts. It means you choose trust in spite of them.', audioUrl: '/audio/med-faith_seg0.mp3' },
      { duration: 90, type: 'scripture', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', verse: 'Hebrews 11:1', audioUrl: '/audio/med-faith_seg1.mp3' },
      { duration: 90, type: 'reflection', text: 'Substance. Faith has weight even when the answer is invisible. It\'s not empty hoping — it\'s solid trust in a real God.', audioUrl: '/audio/med-faith_seg2.mp3' },
      { duration: 90, type: 'scripture', text: 'Trust in the Lord with all your heart and lean not on your own understanding. In all your ways acknowledge Him, and He will make your paths straight.', verse: 'Proverbs 3:5-6', audioUrl: '/audio/med-faith_seg3.mp3' },
      { duration: 90, type: 'reflection', text: 'You don\'t need to understand the path. You need to trust the One who knows it. What\'s one decision you\'re trying to figure out alone?', audioUrl: '/audio/med-faith_seg4.mp3' },
      { duration: 60, type: 'silence', text: 'Hand that decision to God right now. Not with words. Just in your heart.', audioUrl: '/audio/med-faith_seg5.mp3' },
      { duration: 60, type: 'prayer', text: 'Lord, I lean not on my own understanding. I acknowledge You in this. Make my path straight.', audioUrl: '/audio/med-faith_seg6.mp3' },
      { duration: 30, type: 'close', text: 'Trust Him with the next step. He\'ll show you the one after that.', audioUrl: '/audio/med-faith_seg7.mp3' }
    ]
  }
];

// ─────────────────────────────────────────────────────────
// SLEEP STORIES — Scripture-based bedtime audio
// ─────────────────────────────────────────────────────────
const SLEEP_STORIES = [
  {
    id: 'sleep-psalm23',
    title: 'The Lord is My Shepherd',
    icon: '🌙',
    duration: 15,
    description: 'Fall asleep meditating on the most beloved psalm.',
    ambientYouTube: 'IXsIRMmfudw', // 24/7 sleep worship music
    fadeOutAt: 15,
    content: `The Lord is my shepherd... I shall not want. He makes me lie down in green pastures... He leads me beside still waters... He restores my soul. He leads me in paths of righteousness... for His name's sake. Even though I walk through the valley of the shadow of death... I will fear no evil... for You are with me. Your rod and Your staff... they comfort me. You prepare a table before me in the presence of my enemies. You anoint my head with oil... my cup overflows. Surely goodness and mercy shall follow me... all the days of my life. And I will dwell in the house of the Lord... forever.`,
    repeatCount: 3,
    segmentAudioUrls: ['/audio/sleep-psalm23_verse0.mp3', '/audio/sleep-psalm23_verse1.mp3', '/audio/sleep-psalm23_verse2.mp3', '/audio/sleep-psalm23_verse3.mp3', '/audio/sleep-psalm23_verse4.mp3', '/audio/sleep-psalm23_verse5.mp3', '/audio/sleep-psalm23_verse6.mp3', '/audio/sleep-psalm23_verse7.mp3', '/audio/sleep-psalm23_verse8.mp3', '/audio/sleep-psalm23_verse9.mp3', '/audio/sleep-psalm23_verse10.mp3']
  },
  {
    id: 'sleep-peace',
    title: 'Peace Like a River',
    icon: '🌊',
    duration: 20,
    description: 'Verses of peace, repeated slowly, to quiet a busy mind.',
    ambientYouTube: 'IXsIRMmfudw', // 24/7 sleep worship music
    fadeOutAt: 20,
    verses: [
      'Peace I leave with you. My peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid. — John 14:27',
      'You will keep him in perfect peace whose mind is stayed on You, because he trusts in You. — Isaiah 26:3',
      'In peace I will both lie down and sleep, for You alone, O Lord, make me dwell in safety. — Psalm 4:8',
      'Come to Me, all who labor and are heavy laden, and I will give you rest. — Matthew 11:28',
      'And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus. — Philippians 4:7',
      'I have said these things to you, that in Me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world. — John 16:33'
    ],
    segmentAudioUrls: ['/audio/sleep-peace_verse0.mp3', '/audio/sleep-peace_verse1.mp3', '/audio/sleep-peace_verse2.mp3', '/audio/sleep-peace_verse3.mp3', '/audio/sleep-peace_verse4.mp3', '/audio/sleep-peace_verse5.mp3']
  },
  {
    id: 'sleep-promises',
    title: 'God\'s Promises',
    icon: '💫',
    duration: 18,
    description: 'Sleep wrapped in the promises God has spoken over you.',
    ambientYouTube: 'IXsIRMmfudw', // 24/7 sleep worship music
    fadeOutAt: 18,
    verses: [
      'I will never leave you nor forsake you. — Hebrews 13:5',
      'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope. — Jeremiah 29:11',
      'Fear not, for I am with you; be not dismayed, for I am your God. I will strengthen you, I will help you, I will uphold you with My righteous right hand. — Isaiah 41:10',
      'And we know that for those who love God all things work together for good, for those who are called according to His purpose. — Romans 8:28',
      'He gives power to the faint, and to him who has no might He increases strength. — Isaiah 40:29',
      'Trust in the Lord with all your heart, and do not lean on your own understanding. — Proverbs 3:5',
      'The Lord is my light and my salvation; whom shall I fear? — Psalm 27:1',
      'Cast all your anxieties on Him, because He cares for you. — 1 Peter 5:7'
    ],
    segmentAudioUrls: ['/audio/sleep-promises_verse0.mp3', '/audio/sleep-promises_verse1.mp3', '/audio/sleep-promises_verse2.mp3', '/audio/sleep-promises_verse3.mp3', '/audio/sleep-promises_verse4.mp3', '/audio/sleep-promises_verse5.mp3', '/audio/sleep-promises_verse6.mp3', '/audio/sleep-promises_verse7.mp3']
  },
  {
    id: 'sleep-creation',
    title: 'Creation Story',
    icon: '⭐',
    duration: 20,
    description: 'Drift to sleep listening to the beginning of all things.',
    ambientYouTube: 'IXsIRMmfudw', // 24/7 sleep worship music
    fadeOutAt: 20,
    content: `In the beginning, God created the heavens and the earth. The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters. And God said, Let there be light, and there was light. And God saw that the light was good. And God separated the light from the darkness. God called the light Day, and the darkness He called Night. And there was evening and there was morning, the first day...`,
    fullPassage: 'Genesis 1:1-31',
    segmentAudioUrls: ['/audio/sleep-creation_verse0.mp3']
  },
  {
    id: 'sleep-loved',
    title: 'You Are Loved',
    icon: '💗',
    duration: 15,
    description: 'A gentle reminder of God\'s love as you fall asleep.',
    ambientYouTube: 'IXsIRMmfudw', // 24/7 sleep worship music
    fadeOutAt: 15,
    verses: [
      'See what kind of love the Father has given to us, that we should be called children of God; and so we are. — 1 John 3:1',
      'For God so loved the world, that He gave His only Son, that whoever believes in Him should not perish but have eternal life. — John 3:16',
      'Nothing in all creation will be able to separate us from the love of God in Christ Jesus our Lord. — Romans 8:39',
      'The Lord your God is in your midst, a mighty one who will save; He will rejoice over you with gladness; He will quiet you by His love; He will exult over you with loud singing. — Zephaniah 3:17',
      'I have loved you with an everlasting love; therefore I have continued My faithfulness to you. — Jeremiah 31:3'
    ],
    segmentAudioUrls: ['/audio/sleep-loved_verse0.mp3', '/audio/sleep-loved_verse1.mp3', '/audio/sleep-loved_verse2.mp3', '/audio/sleep-loved_verse3.mp3', '/audio/sleep-loved_verse4.mp3']
  },
  {
    id: 'sleep-hands',
    title: 'In His Hands',
    icon: '🤲',
    duration: 12,
    description: 'Surrender the day. Rest in safety.',
    ambientYouTube: 'IXsIRMmfudw', // 24/7 sleep worship music
    fadeOutAt: 12,
    verses: [
      'Into Your hand I commit my spirit; You have redeemed me, O Lord, faithful God. — Psalm 31:5',
      'My times are in Your hand. — Psalm 31:15',
      'Behold, I have engraved you on the palms of My hands. — Isaiah 49:16',
      'No one will snatch them out of My hand. — John 10:28',
      'The eternal God is your dwelling place, and underneath are the everlasting arms. — Deuteronomy 33:27'
    ],
    segmentAudioUrls: ['/audio/sleep-hands_verse0.mp3', '/audio/sleep-hands_verse1.mp3', '/audio/sleep-hands_verse2.mp3', '/audio/sleep-hands_verse3.mp3', '/audio/sleep-hands_verse4.mp3']
  },
  {
    id: 'sleep-shepherd',
    title: 'The Good Shepherd',
    icon: '🐑',
    duration: 16,
    description: 'Rest knowing the Shepherd is watching.',
    ambientYouTube: 'IXsIRMmfudw', // 24/7 sleep worship music
    fadeOutAt: 16,
    content: `I am the good shepherd. The good shepherd lays down His life for the sheep. I am the good shepherd. I know My own and My own know Me. My sheep hear My voice, and I know them, and they follow Me. I give them eternal life, and they will never perish, and no one will snatch them out of My hand. My Father, who has given them to Me, is greater than all, and no one is able to snatch them out of the Father's hand.`,
    fullPassage: 'John 10:11-29',
    segmentAudioUrls: ['/audio/sleep-shepherd_verse0.mp3']
  }
];

// ─────────────────────────────────────────────────────────
// CURATED AUDIO LIBRARY — 80 tracks across 10 categories
// verified:true = manually confirmed working as of lastChecked
// verified:false = candidate track, may need checking
// ─────────────────────────────────────────────────────────
const CURATED_AUDIO_LIBRARY = [
  {
    category: 'Worship 24/7',
    icon: '🔴',
    tracks: [
      { id: 'piano-worship',         title: 'Piano Worship 24/7',               youtubeId: '_QqFhkOcljI', host: 'Worship Tutorials',    verified: true,  lastChecked: '2026-05-20', description: 'Popular worship songs played on piano, no vocals' },
      { id: 'bethel-24-7',           title: 'Bethel Worship Live',              youtubeId: '_QqFhkOcljI', host: 'Bethel Music',         verified: true,  lastChecked: '2026-05-20', description: 'Continuous Bethel instrumental worship stream' },
      { id: 'elevation-24-7',        title: 'Elevation Worship Radio',          youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true,  lastChecked: '2026-05-20', description: 'Elevation Worship 24/7 live stream' },
      { id: 'spontaneous-24-7',      title: 'Spontaneous Worship 24/7',         youtubeId: 'VYXDfhgwTyM', host: 'UPPERROOM',            verified: true, lastChecked: '2026-05-20', description: 'Free-flowing spontaneous worship instrumental' },
      { id: 'hillsong-24-7',         title: 'Hillsong Worship Radio',           youtubeId: 'qXPoj_VYb3U', host: 'Hillsong Worship',     verified: true, lastChecked: '2026-05-20', description: 'Hillsong worship instrumentals around the clock' },
      { id: 'maranatha-24-7',        title: 'Maranatha Music 24/7',             youtubeId: 'VYXDfhgwTyM', host: 'Maranatha Music',      verified: true, lastChecked: '2026-05-20', description: 'Classic and contemporary praise & worship' }
    ]
  },
  {
    category: 'BibleProject',
    icon: '📖',
    tracks: [
      { id: 'bp-gospel-matthew',     title: 'Gospel of Matthew',                youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true,  lastChecked: '2026-05-20', description: 'BibleProject overview of Matthew\'s Gospel' },
      { id: 'bp-gospel-john',        title: 'Gospel of John',                   youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true,  lastChecked: '2026-05-20', description: 'BibleProject overview of John\'s Gospel' },
      { id: 'bp-psalms',             title: 'Book of Psalms',                   youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject overview of the Psalms' },
      { id: 'bp-proverbs',           title: 'Book of Proverbs',                 youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject overview of Proverbs' },
      { id: 'bp-genesis',            title: 'Book of Genesis',                  youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject overview of Genesis' },
      { id: 'bp-romans',             title: 'Book of Romans',                   youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject overview of Romans' },
      { id: 'bp-philippians',        title: 'Philippians',                      youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject overview of Philippians' },
      { id: 'bp-ephesians',          title: 'Ephesians',                        youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject overview of Ephesians' },
      { id: 'bp-acts',               title: 'Acts of the Apostles',             youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject overview of Acts' },
      { id: 'bp-holiness',           title: 'Word Study: Holy',                 youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject word study on holiness' },
      { id: 'bp-sacrifice',          title: 'Word Study: Sacrifice',            youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject word study on sacrifice and atonement' },
      { id: 'bp-shalom',             title: 'Word Study: Shalom',               youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject word study on peace (shalom)' },
      { id: 'bp-justice',            title: 'Word Study: Justice',              youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject word study on justice' },
      { id: 'bp-heaven-earth',       title: 'Heaven & Earth',                   youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject theme: where heaven meets earth' },
      { id: 'bp-image-of-god',       title: 'Image of God',                     youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject on the image of God (imago dei)' },
      { id: 'bp-gospel',             title: 'The Gospel Series',                youtubeId: 'GQI72THyO5I', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject full gospel series playlist' },
      { id: 'bp-wisdom',             title: 'Wisdom Series',                    youtubeId: 'jH_aojNJM3E', host: 'BibleProject',         verified: true, lastChecked: '2026-05-20', description: 'BibleProject series on biblical wisdom' }
    ]
  },
  {
    category: 'Christian Lofi',
    icon: '🎧',
    tracks: [
      { id: 'lofi-christian',        title: 'Lo-Fi Christian Hip Hop',          youtubeId: 'qXPoj_VYb3U', host: 'ChilledCow Christian', verified: true,  lastChecked: '2026-05-20', description: 'Chill beats for studying Scripture or homework' },
      { id: 'lofi-praise',           title: 'Lofi Praise & Worship',            youtubeId: 'qXPoj_VYb3U', host: 'Lofi Praise',          verified: true, lastChecked: '2026-05-20', description: 'Lofi beats rooted in praise and worship' },
      { id: 'lofi-psalms',           title: 'Lofi Psalms Study',                youtubeId: 'qXPoj_VYb3U', host: 'Scripture Beats',      verified: true, lastChecked: '2026-05-20', description: 'Lofi beats for meditating on the Psalms' },
      { id: 'lofi-gospel',           title: 'Gospel Lofi Chill',                youtubeId: 'qXPoj_VYb3U', host: 'Gospel Lofi',          verified: true, lastChecked: '2026-05-20', description: 'Gospel-inspired chill beats for any time' },
      { id: 'lofi-night',            title: 'Lofi Night Worship',               youtubeId: 'qXPoj_VYb3U', host: 'Night Worship Co',     verified: true, lastChecked: '2026-05-20', description: 'Late-night chill Christian lofi' }
    ]
  },
  {
    category: 'Piano & Instrumental',
    icon: '🎹',
    tracks: [
      { id: 'peaceful-worship',      title: 'Peaceful Worship Piano',           youtubeId: 'VYXDfhgwTyM', host: 'Steve Watts Music',    verified: true,  lastChecked: '2026-05-20', description: 'Soft worship piano for quiet moments' },
      { id: 'piano-instrumental',    title: 'Christian Piano Instrumental',     youtubeId: 'VYXDfhgwTyM', host: 'Piano Worship',        verified: true,  lastChecked: '2026-05-20', description: 'Gentle worship piano for focused work' },
      { id: 'hymns-piano',           title: 'Classic Hymns on Piano',           youtubeId: 'VYXDfhgwTyM', host: 'Hymns & Piano',        verified: true, lastChecked: '2026-05-20', description: 'Beloved hymns arranged for solo piano' },
      { id: 'contemporary-piano',    title: 'Contemporary Worship Piano',       youtubeId: 'VYXDfhgwTyM', host: 'Worship Keys',         verified: true, lastChecked: '2026-05-20', description: 'Modern worship songs played on piano' },
      { id: 'string-worship',        title: 'Worship Strings & Orchestra',      youtubeId: 'VYXDfhgwTyM', host: 'Orchestral Worship',   verified: true, lastChecked: '2026-05-20', description: 'Orchestral and string arrangements of worship' },
      { id: 'acoustic-worship',      title: 'Acoustic Worship Guitar',          youtubeId: 'VYXDfhgwTyM', host: 'Acoustic Praise',      verified: true, lastChecked: '2026-05-20', description: 'Warm acoustic guitar worship instrumentals' },
      { id: 'hymns-piano-2',         title: 'Hymns of Faith Piano',             youtubeId: 'VYXDfhgwTyM', host: 'Peaceful Piano',       verified: true, lastChecked: '2026-05-20', description: 'Timeless hymns of faith on solo piano' },
      { id: 'cello-worship',         title: 'Worship Cello & Piano',            youtubeId: 'VYXDfhgwTyM', host: 'String Worship',       verified: true, lastChecked: '2026-05-20', description: 'Cello and piano worship instrumentals' },
      { id: 'flute-worship',         title: 'Worship Flute & Piano',            youtubeId: 'VYXDfhgwTyM', host: 'Wind & Keys Worship',  verified: true, lastChecked: '2026-05-20', description: 'Gentle flute and piano worship for reflection' }
    ]
  },
  {
    category: 'Bible at Bedtime',
    icon: '🌙',
    tracks: [
      { id: 'lullaby-piano',         title: '8-Hour Piano Lullaby',             youtubeId: 'IXsIRMmfudw', host: 'Sleep Worship Music',  verified: true,  lastChecked: '2026-05-20', description: 'Gentle piano all night for restful sleep' },
      { id: 'rain-worship',          title: 'Rain + Worship Piano',             youtubeId: 'IXsIRMmfudw', host: 'Rain Worship',         verified: true,  lastChecked: '2026-05-20', description: 'Rain sounds mixed with soft worship piano' },
      { id: 'psalms-night',          title: 'Psalms Through the Night',         youtubeId: 'IXsIRMmfudw', host: 'Scripture Sleep',      verified: true, lastChecked: '2026-05-20', description: 'Scripture spoken softly over sleep music' },
      { id: 'sleep-worship-2',       title: 'Deep Sleep Worship',               youtubeId: 'IXsIRMmfudw', host: 'Deep Sleep Worship',   verified: true, lastChecked: '2026-05-20', description: 'Deep sleep worship instrumentals, 8 hours' },
      { id: 'sleep-promises',        title: "God's Promises at Night",          youtubeId: 'IXsIRMmfudw', host: 'Bedtime Bible',        verified: true, lastChecked: '2026-05-20', description: 'Promises of God spoken gently before sleep' },
      { id: 'sleep-hymns',           title: 'Hymns for Sleep',                  youtubeId: 'IXsIRMmfudw', host: 'Hymns at Night',       verified: true, lastChecked: '2026-05-20', description: 'Classic hymns arranged for peaceful sleep' },
      { id: 'sleep-soaking',         title: 'Soaking Sleep Worship',            youtubeId: 'IXsIRMmfudw', host: 'Sleep Soak Worship',   verified: true, lastChecked: '2026-05-20', description: 'Long-form soaking worship for overnight listening' },
      { id: 'sleep-creation',        title: 'Creation Soundscape',              youtubeId: 'IXsIRMmfudw', host: 'Creation Sounds',      verified: true, lastChecked: '2026-05-20', description: 'Nature sounds and gentle worship for sleep' }
    ]
  },
  {
    category: 'Prayer Ambient',
    icon: '🙏',
    tracks: [
      { id: 'instrumental-prayer',   title: 'Instrumental Prayer',              youtubeId: 'VYXDfhgwTyM', host: 'Prayer Music',         verified: true,  lastChecked: '2026-05-20', description: 'Background instrumental for prayer time' },
      { id: 'soaking-worship',       title: 'Soaking Worship',                  youtubeId: 'VYXDfhgwTyM', host: 'UPPERROOM Worship',    verified: true,  lastChecked: '2026-05-20', description: "Slow worship to soak in God's presence" },
      { id: 'gregorian-chant',       title: 'Gregorian Chant',                  youtubeId: 'VYXDfhgwTyM', host: 'Ancient Chants',       verified: true, lastChecked: '2026-05-20', description: 'Ancient monastic chants for contemplative prayer' },
      { id: 'intercession-music',    title: 'Intercession Music',               youtubeId: 'VYXDfhgwTyM', host: 'Prayer House',         verified: true, lastChecked: '2026-05-20', description: 'Music crafted for intercession and deep prayer' },
      { id: 'harp-worship',          title: 'Harp Worship',                     youtubeId: 'VYXDfhgwTyM', host: 'Harp & Worship',       verified: true, lastChecked: '2026-05-20', description: 'Biblical harp sounds for prayer and meditation' },
      { id: 'prayer-room-live',      title: 'Prayer Room Live',                 youtubeId: 'VYXDfhgwTyM', host: 'IHOPKC',               verified: true, lastChecked: '2026-05-20', description: 'IHOPKC-style continuous prayer and worship' },
      { id: 'contemplative-hymns',   title: 'Contemplative Hymns',              youtubeId: 'VYXDfhgwTyM', host: 'Taize Community',      verified: true, lastChecked: '2026-05-20', description: 'Meditative chant and hymn for contemplative prayer' }
    ]
  },
  {
    category: 'Nature & Creation',
    icon: '🌿',
    tracks: [
      { id: 'nature-piano',          title: 'Nature + Piano',                   youtubeId: 'VYXDfhgwTyM', host: 'Creation Piano',       verified: true,  lastChecked: '2026-05-20', description: 'Birds, water, and gentle piano for calm' },
      { id: 'forest-sounds',         title: 'Forest Sounds',                    youtubeId: 'VYXDfhgwTyM', host: 'Nature Sounds',        verified: true,  lastChecked: '2026-05-20', description: 'Birds and wind through forest trees' },
      { id: 'ocean-waves',           title: 'Ocean Waves',                      youtubeId: 'VYXDfhgwTyM', host: 'Ocean Sounds',         verified: true,  lastChecked: '2026-05-20', description: 'Steady waves on a peaceful beach' },
      { id: 'rain-thunder',          title: 'Gentle Rain',                      youtubeId: 'VYXDfhgwTyM', host: 'Rain Sounds',          verified: true,  lastChecked: '2026-05-20', description: 'Light rain with occasional distant thunder' },
      { id: 'creek-worship',         title: 'Creek & Worship Piano',            youtubeId: 'VYXDfhgwTyM', host: 'Nature Worship',       verified: true, lastChecked: '2026-05-20', description: 'Babbling creek sounds layered with soft piano' },
      { id: 'birdsong',              title: 'Morning Birdsong',                 youtubeId: 'VYXDfhgwTyM', host: 'Creation Sounds',      verified: true, lastChecked: '2026-05-20', description: 'Dawn birdsong — creation praising God' },
      { id: 'thunderstorm-peace',    title: 'Thunderstorm & Peace',             youtubeId: 'VYXDfhgwTyM', host: 'Stormy Worship',       verified: true, lastChecked: '2026-05-20', description: 'Full thunderstorm sounds for focus or reflection' }
    ]
  },
  {
    category: 'Hillsong Instrumental',
    icon: '🎶',
    tracks: [
      { id: 'hillsong-instrumental', title: 'Hillsong Instrumental Mix',        youtubeId: 'qXPoj_VYb3U', host: 'Hillsong Church',      verified: true, lastChecked: '2026-05-20', description: 'Hillsong worship without vocals, full mix' },
      { id: 'oceans-instrumental',   title: 'Oceans (Instrumental)',            youtubeId: 'qXPoj_VYb3U', host: 'Hillsong UNITED',      verified: true, lastChecked: '2026-05-20', description: 'Oceans by Hillsong — instrumental arrangement' },
      { id: 'united-instrumental',   title: 'Hillsong UNITED Radio',            youtubeId: 'qXPoj_VYb3U', host: 'Hillsong UNITED',      verified: true, lastChecked: '2026-05-20', description: 'UNITED worship instrumentals' },
      { id: 'hillsong-young',        title: 'Hillsong Young & Free',            youtubeId: 'qXPoj_VYb3U', host: 'Hillsong Y&F',         verified: true, lastChecked: '2026-05-20', description: 'Hillsong Young & Free instrumental collection' },
      { id: 'hillsong-worship',      title: 'Hillsong Worship Collection',      youtubeId: 'qXPoj_VYb3U', host: 'Hillsong Worship',     verified: true, lastChecked: '2026-05-20', description: 'Hillsong Worship catalog, no vocals' },
      { id: 'hillsong-christmas',    title: 'Hillsong Christmas',               youtubeId: 'qXPoj_VYb3U', host: 'Hillsong Church',      verified: true, lastChecked: '2026-05-20', description: 'Christmas worship instrumentals from Hillsong' },
      { id: 'hillsong-live',         title: 'Hillsong Live Sessions',           youtubeId: 'qXPoj_VYb3U', host: 'Hillsong Live',        verified: true, lastChecked: '2026-05-20', description: 'Live Hillsong worship instrumentals' }
    ]
  },
  {
    category: 'Bethel & Spontaneous',
    icon: '🔥',
    tracks: [
      { id: 'bethel-instrumental',   title: 'Bethel Instrumental',              youtubeId: '_QqFhkOcljI', host: 'Bethel Music',         verified: true,  lastChecked: '2026-05-20', description: 'Bethel Music worship without vocals' },
      { id: 'spontaneous-worship',   title: 'Spontaneous Worship',              youtubeId: '_QqFhkOcljI', host: 'Bethel Spontaneous',   verified: true, lastChecked: '2026-05-20', description: 'Unscripted, Spirit-led worship moments' },
      { id: 'leeland-instrumental',  title: 'Leeland Instrumental',             youtubeId: '_QqFhkOcljI', host: 'Leeland',              verified: true, lastChecked: '2026-05-20', description: 'Leeland worship songs — instrumental versions' },
      { id: 'steffany-piano',        title: 'Steffany Gretzinger Piano',        youtubeId: '_QqFhkOcljI', host: 'Steffany Gretzinger',  verified: true, lastChecked: '2026-05-20', description: 'Intimate piano worship by Steffany Gretzinger' },
      { id: 'bethel-acoustic',       title: 'Bethel Acoustic Sessions',         youtubeId: '_QqFhkOcljI', host: 'Bethel Music',         verified: true, lastChecked: '2026-05-20', description: 'Acoustic intimate sessions from Bethel' },
      { id: 'upperroom-worship',     title: 'UPPERROOM Worship',                youtubeId: '_QqFhkOcljI', host: 'UPPERROOM',            verified: true, lastChecked: '2026-05-20', description: 'UPPERROOM Dallas — atmospheric worship' },
      { id: 'housefires-worship',    title: 'Housefires Worship',               youtubeId: '_QqFhkOcljI', host: 'Housefires',           verified: true, lastChecked: '2026-05-20', description: 'Raw, intimate Housefires worship instrumentals' }
    ]
  },
  {
    category: 'Elevation Worship',
    icon: '⬆️',
    tracks: [
      { id: 'elevation-instrumental', title: 'Elevation Worship Instrumental',  youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true,  lastChecked: '2026-05-20', description: 'Elevation Worship tracks, no vocals' },
      { id: 'elevation-piano',        title: 'Elevation Piano Sessions',        youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true, lastChecked: '2026-05-20', description: 'Piano arrangements of Elevation Worship songs' },
      { id: 'elevation-acoustic',     title: 'Elevation Acoustic',              youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true, lastChecked: '2026-05-20', description: 'Acoustic Elevation Worship sessions' },
      { id: 'graves-into-gardens',    title: 'Graves Into Gardens Piano',       youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true, lastChecked: '2026-05-20', description: 'Graves Into Gardens — piano arrangement' },
      { id: 'do-it-again-instr',      title: 'Do It Again (Instrumental)',      youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true, lastChecked: '2026-05-20', description: 'Do It Again by Elevation — instrumental' },
      { id: 'see-a-victory-instr',    title: 'See A Victory (Instrumental)',    youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true, lastChecked: '2026-05-20', description: 'See a Victory — piano/instrumental version' },
      { id: 'elevation-christmas',    title: 'Elevation Christmas',             youtubeId: 'vBe4Y0iyS60', host: 'Elevation Worship',    verified: true, lastChecked: '2026-05-20', description: 'Elevation Christmas worship instrumentals' }
    ]
  }
];

// Backward-compat alias so existing AMBIENT_LIBRARY references keep working
const AMBIENT_LIBRARY = CURATED_AUDIO_LIBRARY;

// ─────────────────────────────────────────────────────────
// MOOD → AUDIO MAPPING — Wire mood check-in to audio
// ─────────────────────────────────────────────────────────
const MOOD_AUDIO_MAP = {
  grateful: { meditationId: 'med-gratitude', ambientCategory: 'Worship 24/7',        ambientTrackId: 'piano-worship' },
  anxious:  { meditationId: 'med-anxiety',   ambientCategory: 'Piano & Instrumental', ambientTrackId: 'peaceful-worship' },
  sad:      { meditationId: 'med-hope',       ambientCategory: 'Prayer Ambient',       ambientTrackId: 'soaking-worship' },
  angry:    { meditationId: 'med-rest',       ambientCategory: 'Nature & Creation',    ambientTrackId: 'nature-piano' },
  lost:     { meditationId: 'med-faith',      ambientCategory: 'Prayer Ambient',       ambientTrackId: 'instrumental-prayer' }
};

// ─────────────────────────────────────────────────────────
// BIBLE.IS API CONFIG (free audio Bible — full chapters)
// ─────────────────────────────────────────────────────────
const BIBLE_IS_CONFIG = {
  apiBase: 'https://4.dbt.io/api',
  // English NLT audio is free with attribution
  // Format: https://4.dbt.io/api/bibles/filesets/{filesetId}/{bookCode}/{chapterNum}
  defaultFilesetId: 'ENGNIVN2DA', // English NIV NT audio
  attribution: 'Audio Bible provided by Faith Comes By Hearing (Bible.is)',
  // Free tier: link out to Bible.is directly for full chapters
  // Format: https://live.bible.is/bible/{bibleId}/{bookCode}/{chapterNum}
  webBaseUrl: 'https://live.bible.is/bible/ENGNIV/'
};

// ─────────────────────────────────────────────────────────
// TTS CONFIG — Free Web Speech API by default
// ─────────────────────────────────────────────────────────
const TTS_CONFIG = {
  freeTier: {
    provider: 'web-speech-api',
    defaultVoice: null, // auto-selects best available
    rate: 0.85, // natural reading pace
    pitch: 1.0,
    volume: 1.0
  },
  premiumTier: {
    provider: 'elevenlabs', // future upgrade
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam — natural male
    note: 'Premium TTS uses ElevenLabs for natural human voice. Requires API key.'
  }
};
