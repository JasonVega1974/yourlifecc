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
      { duration: 30, type: 'opening', text: 'Take three slow breaths. Let your body settle. God is already here with you.' },
      { duration: 60, type: 'scripture', text: 'The steadfast love of the Lord never ceases. His mercies never come to an end. They are new every morning. Great is His faithfulness.', verse: 'Lamentations 3:22-23' },
      { duration: 60, type: 'reflection', text: 'New mercies. Today. Not yesterday\'s mercies for today\'s troubles — fresh ones, made for this exact day.' },
      { duration: 60, type: 'silence', text: 'Sit with that truth in silence for a moment.' },
      { duration: 90, type: 'scripture', text: 'This is the day that the Lord has made. We will rejoice and be glad in it.', verse: 'Psalm 118:24' },
      { duration: 60, type: 'reflection', text: 'Whatever today holds — it was made. Made by a God who never improvises, never panics, never abandons. Made for you.' },
      { duration: 60, type: 'prayer', text: 'Father, I receive Your mercies for today. Help me walk in them. Help me notice You as I go.' },
      { duration: 30, type: 'close', text: 'Open your eyes. Step into the day God has made for you.' }
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
      { duration: 60, type: 'opening', text: 'Wherever you are right now, you are safe in this moment. Take a slow breath. Hold it. Release it.' },
      { duration: 30, type: 'breath', text: 'Breathe in for four counts. Hold for four. Out for four. Again.' },
      { duration: 60, type: 'scripture', text: 'Do not be anxious about anything. But in every situation, by prayer and petition, with thanksgiving, present your requests to God.', verse: 'Philippians 4:6' },
      { duration: 60, type: 'reflection', text: 'You don\'t have to fix the anxiety first. You bring it as it is. God can handle the messy version of your prayer.' },
      { duration: 60, type: 'scripture', text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', verse: 'Philippians 4:7' },
      { duration: 90, type: 'reflection', text: 'Notice the word guard. Peace becomes a sentinel around your mind. It doesn\'t depend on understanding the situation — it depends on Christ.' },
      { duration: 60, type: 'cast', text: 'Now physically open your hands. Imagine placing your worry in them. Picture handing it to Jesus. He takes it. He carries it.' },
      { duration: 90, type: 'scripture', text: 'Cast all your anxiety on Him because He cares for you.', verse: '1 Peter 5:7' },
      { duration: 60, type: 'prayer', text: 'Lord, I cast this onto You. I don\'t pick it back up. Your peace, which transcends all understanding, guard my heart.' },
      { duration: 30, type: 'close', text: 'When you\'re ready, open your eyes. You are not alone in this.' }
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
      { duration: 30, type: 'opening', text: 'Settle into stillness. Notice your breath. Notice your heartbeat. Both are gifts you didn\'t earn.' },
      { duration: 60, type: 'scripture', text: 'Make a joyful noise to the Lord, all the earth. Serve the Lord with gladness. Come into His presence with singing.', verse: 'Psalm 100:1-2' },
      { duration: 90, type: 'reflection', text: 'Gratitude is not pretending things are perfect. It\'s noticing where God has been good — even in imperfect days. Think back over the last 24 hours. What\'s one small kindness you noticed?' },
      { duration: 60, type: 'silence', text: 'Hold that moment. Let yourself feel the goodness of it.' },
      { duration: 90, type: 'scripture', text: 'Enter His gates with thanksgiving and His courts with praise. Give thanks to Him. Bless His name.', verse: 'Psalm 100:4' },
      { duration: 60, type: 'practice', text: 'Name three things aloud right now that you are thankful for. Speak them. Hear them.' },
      { duration: 30, type: 'close', text: 'Carry that thankful posture into your day. Watch how it changes what you see.' }
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
      { duration: 30, type: 'opening', text: 'Sit comfortably. Let your shoulders drop. The world has been telling you things about yourself today. Time to hear the truth.' },
      { duration: 90, type: 'declaration', text: 'I am loved by God. Before I did anything, before I failed at anything, I was loved.', verse: 'Ephesians 1:4' },
      { duration: 60, type: 'silence', text: 'Let that land. Don\'t move past it too quickly.' },
      { duration: 90, type: 'declaration', text: 'I am chosen. Not an accident. Not a backup plan. Chosen by name.', verse: 'Ephesians 1:4-5' },
      { duration: 90, type: 'declaration', text: 'I am forgiven. The blood of Jesus has cleansed every sin — past, present, and future.', verse: 'Ephesians 1:7' },
      { duration: 90, type: 'declaration', text: 'I am sealed by the Holy Spirit. God Himself lives in me. I belong to Him.', verse: 'Ephesians 1:13' },
      { duration: 60, type: 'reflection', text: 'These are not feelings. These are facts. You can stand on them when feelings betray you.' },
      { duration: 60, type: 'prayer', text: 'God, plant these truths so deep in me that nothing can shake them out. I receive who You say I am.' },
      { duration: 30, type: 'close', text: 'You are loved. Chosen. Forgiven. Sealed. Go walk in that.' }
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
      { duration: 60, type: 'opening', text: 'You are not behind. You are not too much. Wherever you are right now is where God wants to meet you.' },
      { duration: 60, type: 'breath', text: 'Long, slow breath in. Long, slow breath out. Do that three times.' },
      { duration: 90, type: 'scripture', text: 'Come to Me, all you who are weary and burdened, and I will give you rest.', verse: 'Matthew 11:28' },
      { duration: 120, type: 'reflection', text: 'Notice — Jesus doesn\'t ask you to deserve the rest. He doesn\'t ask you to earn it. He just says come. Tired, messy, behind. Come anyway.' },
      { duration: 90, type: 'scripture', text: 'Take My yoke upon you and learn from Me. For I am gentle and humble in heart. You will find rest for your souls.', verse: 'Matthew 11:29' },
      { duration: 120, type: 'reflection', text: 'A yoke ties two animals together so the stronger one carries the weight. Jesus is the stronger one. You are not pulling alone.' },
      { duration: 90, type: 'silence', text: 'Sit in the silence. Don\'t produce anything. Don\'t fix anything. Just be.' },
      { duration: 90, type: 'scripture', text: 'For My yoke is easy and My burden is light.', verse: 'Matthew 11:30' },
      { duration: 60, type: 'prayer', text: 'Jesus, I am tired. I receive Your rest. I lay down what I was never meant to carry.' },
      { duration: 30, type: 'close', text: 'You can rest in Him. The world will keep spinning. He has not let go.' }
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
      { duration: 30, type: 'opening', text: 'Wherever you are in this season — God sees it. He hasn\'t looked away.' },
      { duration: 90, type: 'scripture', text: 'I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.', verse: 'Romans 8:18' },
      { duration: 90, type: 'reflection', text: 'This is not minimizing your pain. Paul wrote this from prison. It is saying — what is coming is more weight than what is here. Both are real.' },
      { duration: 90, type: 'scripture', text: 'And we know that in all things God works for the good of those who love Him.', verse: 'Romans 8:28' },
      { duration: 120, type: 'reflection', text: 'In ALL things. Not just the good ones. He weaves even this into something good. You may not see it yet. Trust the weaver.' },
      { duration: 60, type: 'silence', text: 'Sit in the not-yet. God is still working.' },
      { duration: 90, type: 'prayer', text: 'Father, I don\'t see how this becomes good yet. But I trust You. Plant hope in me that doesn\'t depend on what I can see.' },
      { duration: 30, type: 'close', text: 'Hope is not pretending the wait isn\'t hard. It\'s knowing the wait is not the end.' }
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
      { duration: 30, type: 'opening', text: 'Faith doesn\'t mean you have no doubts. It means you choose trust in spite of them.' },
      { duration: 90, type: 'scripture', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', verse: 'Hebrews 11:1' },
      { duration: 90, type: 'reflection', text: 'Substance. Faith has weight even when the answer is invisible. It\'s not empty hoping — it\'s solid trust in a real God.' },
      { duration: 90, type: 'scripture', text: 'Trust in the Lord with all your heart and lean not on your own understanding. In all your ways acknowledge Him, and He will make your paths straight.', verse: 'Proverbs 3:5-6' },
      { duration: 90, type: 'reflection', text: 'You don\'t need to understand the path. You need to trust the One who knows it. What\'s one decision you\'re trying to figure out alone?' },
      { duration: 60, type: 'silence', text: 'Hand that decision to God right now. Not with words. Just in your heart.' },
      { duration: 60, type: 'prayer', text: 'Lord, I lean not on my own understanding. I acknowledge You in this. Make my path straight.' },
      { duration: 30, type: 'close', text: 'Trust Him with the next step. He\'ll show you the one after that.' }
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
    repeatCount: 3
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
    ]
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
    ]
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
    fullPassage: 'Genesis 1:1-31'
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
    ]
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
    ]
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
    fullPassage: 'John 10:11-29'
  }
];

// ─────────────────────────────────────────────────────────
// AMBIENT AUDIO LIBRARY — Background audio for any moment
// ─────────────────────────────────────────────────────────
const AMBIENT_LIBRARY = [
  {
    category: 'Focus & Study',
    icon: '🎯',
    tracks: [
      { id: 'lofi-christian', title: 'Lo-Fi Christian Hip Hop', youtubeId: 'qXPoj_VYb3U', description: 'Beats for studying Scripture or homework' },
      { id: 'piano-instrumental', title: 'Christian Piano Instrumental', youtubeId: 'qXPoj_VYb3U', description: 'Soft worship piano for focus time' },
      { id: 'hillsong-instrumental', title: 'Hillsong Instrumental', youtubeId: 'qXPoj_VYb3U', description: 'Hillsong worship without vocals' }
    ]
  },
  {
    category: 'Calm & Peace',
    icon: '🕊️',
    tracks: [
      { id: 'peaceful-worship', title: 'Peaceful Worship', youtubeId: 'VYXDfhgwTyM', description: 'Soft worship for quiet moments' },
      { id: 'nature-piano', title: 'Nature + Piano', youtubeId: 'VYXDfhgwTyM', description: 'Birds, water, gentle piano' },
      { id: 'soaking-worship', title: 'Soaking Worship', youtubeId: 'VYXDfhgwTyM', description: 'Slow worship to soak in God\'s presence' }
    ]
  },
  {
    category: 'Prayer & Meditation',
    icon: '🙏',
    tracks: [
      { id: 'gregorian-chant', title: 'Gregorian Chant', youtubeId: 'VYXDfhgwTyM', description: 'Ancient chants for deep prayer' },
      { id: 'instrumental-prayer', title: 'Instrumental Prayer', youtubeId: 'VYXDfhgwTyM', description: 'Background for prayer time' },
      { id: 'spontaneous-worship', title: 'Spontaneous Worship', youtubeId: 'VYXDfhgwTyM', description: 'Free-flowing worship instrumental' }
    ]
  },
  {
    category: 'Sleep',
    icon: '🌙',
    tracks: [
      { id: 'lullaby-piano', title: '8-Hour Piano Lullaby', youtubeId: 'IXsIRMmfudw', description: 'All-night gentle piano' },
      { id: 'rain-worship', title: 'Rain + Worship Piano', youtubeId: 'IXsIRMmfudw', description: 'Rain sounds with soft worship' },
      { id: 'psalms-night', title: 'Psalms Through the Night', youtubeId: 'IXsIRMmfudw', description: 'Scripture spoken softly' }
    ]
  },
  {
    category: 'Worship',
    icon: '🎵',
    tracks: [
      { id: 'bethel-instrumental', title: 'Bethel Instrumental', youtubeId: '_QqFhkOcljI', description: 'Bethel worship without vocals' },
      { id: 'elevation-instrumental', title: 'Elevation Worship Instrumental', youtubeId: 'vBe4Y0iyS60', description: 'Elevation tracks instrumental' },
      { id: 'piano-worship', title: 'Piano Worship', youtubeId: '_QqFhkOcljI', description: 'Popular worship songs on piano' }
    ]
  },
  {
    category: 'Nature & Creation',
    icon: '🌿',
    tracks: [
      { id: 'forest-sounds', title: 'Forest Sounds', youtubeId: 'eKFTSSKCzWA', description: 'Birds and wind through trees' },
      { id: 'ocean-waves', title: 'Ocean Waves', youtubeId: 'V1bFr2SWP1I', description: 'Steady waves on a beach' },
      { id: 'rain-thunder', title: 'Gentle Rain', youtubeId: 'mPZkdNFkNps', description: 'Light rain with distant thunder' }
    ]
  }
];

// ─────────────────────────────────────────────────────────
// MOOD → AUDIO MAPPING — Wire mood check-in to audio
// ─────────────────────────────────────────────────────────
const MOOD_AUDIO_MAP = {
  grateful: { meditationId: 'med-gratitude', ambientCategory: 'Worship', ambientTrackId: 'piano-worship' },
  anxious: { meditationId: 'med-anxiety', ambientCategory: 'Calm & Peace', ambientTrackId: 'peaceful-worship' },
  sad: { meditationId: 'med-hope', ambientCategory: 'Calm & Peace', ambientTrackId: 'soaking-worship' },
  angry: { meditationId: 'med-rest', ambientCategory: 'Calm & Peace', ambientTrackId: 'nature-piano' },
  lost: { meditationId: 'med-faith', ambientCategory: 'Prayer & Meditation', ambientTrackId: 'instrumental-prayer' }
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
