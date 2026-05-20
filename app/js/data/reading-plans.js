// YourLife CC — Bible Reading Plans Data
// 5 plans: 3-day, 7-day, 30-day, 90-day, 365-day
// Each day: title, scripture refs, theme, reflection prompt

const READING_PLANS = [

  // ─────────────────────────────────────────────────────────
  // PLAN 1: 3-DAY — "Starting Fresh" (New believers / curious)
  // ─────────────────────────────────────────────────────────
  {
    id: 'start-fresh',
    title: 'Starting Fresh',
    subtitle: 'A 3-day introduction to faith',
    days: 3,
    difficulty: 'beginner',
    icon: '🌱',
    description: 'Never sure where to start in the Bible? These 3 days cover the most essential truths of the Christian faith — who God is, who you are, and what Jesus did for you.',
    days_content: [
      {
        day: 1,
        title: 'You Are Loved',
        theme: 'God\'s love for you',
        readings: ['John 3:1-21', 'Romans 5:6-11', 'Psalm 139:1-18'],
        keyVerse: 'John 3:16',
        reflection: 'God loved you before you ever thought about Him. How does it feel to be pursued by Someone that powerful?',
        prayer: 'God, thank You for loving me before I knew You. Help me understand how wide and deep that love really is.'
      },
      {
        day: 2,
        title: 'The Problem and the Solution',
        theme: 'Sin, grace, and the cross',
        readings: ['Romans 3:9-26', 'Isaiah 53:1-12', '2 Corinthians 5:17-21'],
        keyVerse: 'Romans 3:23-24',
        reflection: 'Sin isn\'t just bad behavior — it\'s separation from God. Jesus bridges that gap completely. What does it mean to be "made right" with God?',
        prayer: 'Jesus, thank You for taking what I deserved. I receive Your forgiveness and Your righteousness today.'
      },
      {
        day: 3,
        title: 'New Life',
        theme: 'The resurrection and new beginning',
        readings: ['John 20:1-18', 'Romans 6:1-14', 'Ephesians 2:1-10'],
        keyVerse: 'Ephesians 2:8-9',
        reflection: 'The resurrection isn\'t just a historical event — it\'s the power available to you every day. What "old life" is God calling you to walk away from?',
        prayer: 'Holy Spirit, fill me with resurrection power. Help me walk in the new life You\'ve given me.'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // PLAN 2: 7-DAY — "Foundations" (New believers)
  // ─────────────────────────────────────────────────────────
  {
    id: 'foundations',
    title: 'Foundations',
    subtitle: 'Core truths every believer needs',
    days: 7,
    difficulty: 'beginner',
    icon: '🏗️',
    description: 'Seven essential building blocks of the Christian life — faith, prayer, the Holy Spirit, community, purpose, temptation, and identity.',
    days_content: [
      {
        day: 1,
        title: 'Who God Is',
        theme: 'The nature and character of God',
        readings: ['Exodus 34:5-7', 'Psalm 103:1-14', '1 John 4:7-16'],
        keyVerse: '1 John 4:8',
        reflection: 'God is not distant or angry — He is love itself. How has your view of God been shaped more by your experiences than by Scripture?',
        prayer: 'Father, show me who You really are — not who I\'ve imagined You to be.'
      },
      {
        day: 2,
        title: 'How to Pray',
        theme: 'Prayer as conversation with God',
        readings: ['Matthew 6:5-15', 'Luke 18:1-8', 'Philippians 4:4-7'],
        keyVerse: 'Philippians 4:6-7',
        reflection: 'Prayer isn\'t a performance — it\'s a conversation. What would you tell God right now if you knew He was listening and cared?',
        prayer: 'Lord, teach me to pray like Jesus did — honestly, persistently, and with faith.'
      },
      {
        day: 3,
        title: 'The Holy Spirit',
        theme: 'Your helper and guide',
        readings: ['John 14:15-27', 'Acts 2:1-21', 'Galatians 5:16-25'],
        keyVerse: 'John 14:26',
        reflection: 'The Holy Spirit is not a force — He is a Person who lives inside every believer. What fruit of the Spirit (Gal 5:22-23) do you most want to grow in?',
        prayer: 'Holy Spirit, I invite You to fill me fully. Lead me, teach me, and produce Your fruit in my life.'
      },
      {
        day: 4,
        title: 'You Need Community',
        theme: 'The church and belonging',
        readings: ['Acts 2:42-47', 'Hebrews 10:24-25', '1 Corinthians 12:12-27'],
        keyVerse: 'Hebrews 10:24-25',
        reflection: 'Christianity was never meant to be solo. Who is your "one another" — someone you sharpen and who sharpens you?',
        prayer: 'God, connect me to community that helps me grow. Give me courage to be known and to know others.'
      },
      {
        day: 5,
        title: 'Your Purpose',
        theme: 'Why you\'re here',
        readings: ['Jeremiah 29:11-13', 'Ephesians 2:10', 'Matthew 28:18-20'],
        keyVerse: 'Ephesians 2:10',
        reflection: 'You were created for good works prepared in advance. You\'re not an accident — you\'re a mission. What unique gifts has God placed in you?',
        prayer: 'Lord, show me the works You\'ve prepared for me. Give me courage to walk in them.'
      },
      {
        day: 6,
        title: 'Handling Temptation',
        theme: 'Standing firm',
        readings: ['Matthew 4:1-11', '1 Corinthians 10:12-13', 'James 1:12-18'],
        keyVerse: '1 Corinthians 10:13',
        reflection: 'Jesus was tempted in every way we are — and He won. His weapon was Scripture. What area of your life needs a biblical truth planted in it?',
        prayer: 'Father, when temptation comes, remind me of Your Word. I trust that You always provide a way out.'
      },
      {
        day: 7,
        title: 'Your Identity in Christ',
        theme: 'Who you are now',
        readings: ['2 Corinthians 5:17', 'Romans 8:14-17', 'Colossians 3:1-4'],
        keyVerse: '2 Corinthians 5:17',
        reflection: 'You are not who you used to be. You are not your worst day. You are a new creation. Which old label are you still wearing that Christ has already removed?',
        prayer: 'God, help me see myself the way You see me — redeemed, loved, and new.'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // PLAN 3: 30-DAY — "Deeper" (Growing believers)
  // ─────────────────────────────────────────────────────────
  {
    id: 'deeper',
    title: 'Deeper',
    subtitle: '30 days of intentional growth',
    days: 30,
    difficulty: 'intermediate',
    icon: '🌊',
    description: 'A month of focused Scripture engagement covering the Sermon on the Mount, the Psalms, Paul\'s letters, and practical Christian living.',
    days_content: [
      { day: 1,  title: 'The Sermon on the Mount — Pt 1', theme: 'The Beatitudes', readings: ['Matthew 5:1-16'], keyVerse: 'Matthew 5:3', reflection: 'The Beatitudes flip the world\'s values upside down. Which one challenges you most right now?', prayer: 'Lord, make me poor in spirit enough to receive Your kingdom.' },
      { day: 2,  title: 'The Sermon on the Mount — Pt 2', theme: 'A higher standard', readings: ['Matthew 5:17-48'], keyVerse: 'Matthew 5:44', reflection: 'Jesus goes beyond behavior to the heart. Is there someone you need to forgive or love who has hurt you?', prayer: 'Jesus, give me the grace to love my enemies the way You loved Yours.' },
      { day: 3,  title: 'The Sermon on the Mount — Pt 3', theme: 'Private faith', readings: ['Matthew 6:1-18'], keyVerse: 'Matthew 6:6', reflection: 'Jesus valued secret acts of faith. Is your spiritual life more about being seen or being real?', prayer: 'Father who sees in secret, I come to You privately today.' },
      { day: 4,  title: 'The Sermon on the Mount — Pt 4', theme: 'Money and worry', readings: ['Matthew 6:19-34'], keyVerse: 'Matthew 6:33', reflection: 'Where is your treasure? Your worry reveals it. What are you anxious about that you need to surrender?', prayer: 'God, I seek Your kingdom first today. I trust You with everything else.' },
      { day: 5,  title: 'The Sermon on the Mount — Pt 5', theme: 'Judgment and foundation', readings: ['Matthew 7:1-29'], keyVerse: 'Matthew 7:24', reflection: 'Are you building your life on hearing and doing the Word, or just hearing?', prayer: 'Lord, I want to be a doer of Your Word, not just a hearer.' },
      { day: 6,  title: 'Psalm 1 — Two Paths', theme: 'The blessed life', readings: ['Psalm 1', 'Psalm 119:1-16'], keyVerse: 'Psalm 1:1-2', reflection: 'The blessed person delights in God\'s Word, not just reads it. What\'s the difference between delight and duty?', prayer: 'Lord, make Your Word my delight, not my obligation.' },
      { day: 7,  title: 'Psalm 23 — The Shepherd', theme: 'God\'s provision and presence', readings: ['Psalm 23', 'John 10:1-18'], keyVerse: 'Psalm 23:1', reflection: 'David wrote this from real experience with sheep AND real experience with God. What valley are you walking through right now?', prayer: 'Good Shepherd, I trust You in this valley. Your rod and staff are enough.' },
      { day: 8,  title: 'Psalm 51 — Honest Repentance', theme: 'Confession and restoration', readings: ['Psalm 51', '1 John 1:5-10'], keyVerse: 'Psalm 51:10', reflection: 'David wrote this after his worst failure. God restored him. What do you need to bring honestly before God today?', prayer: 'Create in me a clean heart, O God. Renew a right spirit within me.' },
      { day: 9,  title: 'Psalm 91 — Protection', theme: 'Dwelling in God\'s shelter', readings: ['Psalm 91', 'Ephesians 6:10-18'], keyVerse: 'Psalm 91:1-2', reflection: 'The promise is for those who "dwell" — not just visit. What does it mean to abide in God\'s presence daily?', prayer: 'I make You my refuge and fortress today. I trust You with what I cannot control.' },
      { day: 10, title: 'Romans 1-3 — The Problem', theme: 'All have sinned', readings: ['Romans 1:18-32', 'Romans 2:1-11', 'Romans 3:9-26'], keyVerse: 'Romans 3:23-24', reflection: 'Paul systematically shows that every person needs God. How does understanding your need deepen your gratitude?', prayer: 'Thank You, God, that where sin abounded, grace abounded much more.' },
      { day: 11, title: 'Romans 4-5 — Faith and Grace', theme: 'Justified by faith', readings: ['Romans 4:1-25', 'Romans 5:1-11'], keyVerse: 'Romans 5:1', reflection: 'Abraham was declared righteous before circumcision — faith was always the key. What does it mean to have peace with God?', prayer: 'Thank You that I have peace with You through Jesus. That peace is mine today.' },
      { day: 12, title: 'Romans 6-7 — Dead to Sin', theme: 'The old self is gone', readings: ['Romans 6:1-23', 'Romans 7:14-25'], keyVerse: 'Romans 6:11', reflection: 'Consider yourself dead to sin and alive to God. This is a daily choice, not just a fact. Where do you need to "reckon" yourself dead to something?', prayer: 'I present myself to You today as an instrument of righteousness.' },
      { day: 13, title: 'Romans 8 — No Condemnation', theme: 'Life in the Spirit', readings: ['Romans 8:1-39'], keyVerse: 'Romans 8:1', reflection: 'Romans 8 is the mountain peak of Scripture. Which verse speaks most powerfully to your current situation?', prayer: 'Nothing can separate me from Your love. I rest in that truth today.' },
      { day: 14, title: 'Romans 12 — Living Sacrifice', theme: 'Transformed living', readings: ['Romans 12:1-21'], keyVerse: 'Romans 12:2', reflection: 'Don\'t be conformed — be transformed. What pattern of this world are you most tempted to conform to?', prayer: 'Renew my mind, Lord. Transform me from the inside out.' },
      { day: 15, title: 'The Prodigal Son', theme: 'Grace and the Father\'s heart', readings: ['Luke 15:11-32', 'Isaiah 55:6-9'], keyVerse: 'Luke 15:20', reflection: 'The father ran before the son could finish his speech. When did God run toward you?', prayer: 'Father, thank You for running toward me. Help me run to You instead of away.' },
      { day: 16, title: 'John 15 — The Vine', theme: 'Abiding in Christ', readings: ['John 15:1-17', 'Colossians 1:9-14'], keyVerse: 'John 15:5', reflection: 'Apart from Christ, you can do nothing. Which area of your life are you trying to produce fruit without abiding?', prayer: 'I choose to abide in You today. Prune what needs pruning. Produce what only You can.' },
      { day: 17, title: 'Philippians 1-2 — Joy and Humility', theme: 'The mind of Christ', readings: ['Philippians 1:3-30', 'Philippians 2:1-18'], keyVerse: 'Philippians 2:5', reflection: 'Jesus emptied Himself and became a servant. In what relationship do you need to choose the servant posture?', prayer: 'Give me the mind of Christ in my relationships today.' },
      { day: 18, title: 'Philippians 3-4 — Press On', theme: 'Contentment and focus', readings: ['Philippians 3:7-21', 'Philippians 4:4-13'], keyVerse: 'Philippians 4:13', reflection: 'Contentment is learned, not given. What are you currently discontent about that Paul might say you can be "in" rather than "under"?', prayer: 'I can do all things through Christ. I choose contentment in this season.' },
      { day: 19, title: 'Ephesians 1-2 — Chosen and Saved', theme: 'Every spiritual blessing', readings: ['Ephesians 1:3-23', 'Ephesians 2:1-22'], keyVerse: 'Ephesians 2:10', reflection: 'You are God\'s workmanship — His masterpiece. What work has He been doing in you lately that you almost missed?', prayer: 'I receive every spiritual blessing You\'ve given me in Christ.' },
      { day: 20, title: 'Ephesians 3-4 — Power and Unity', theme: 'Fullness and maturity', readings: ['Ephesians 3:14-21', 'Ephesians 4:1-16'], keyVerse: 'Ephesians 3:20', reflection: 'God can do immeasurably more than you ask or imagine. What\'s the biggest thing you\'ve stopped asking Him for?', prayer: 'I ask You to do the immeasurably more in my life. I stop limiting what You can do.' },
      { day: 21, title: 'Ephesians 5-6 — Armor of God', theme: 'Spiritual warfare', readings: ['Ephesians 5:1-21', 'Ephesians 6:10-20'], keyVerse: 'Ephesians 6:11', reflection: 'Each piece of armor is intentional. Which piece do you most need to put on today?', prayer: 'I put on the full armor of God today. I stand firm.' },
      { day: 22, title: 'James 1-2 — Faith That Works', theme: 'Trials and pure religion', readings: ['James 1:1-27', 'James 2:14-26'], keyVerse: 'James 1:2-3', reflection: 'Count it joy when you face trials — not because the trial is good, but because of what it produces. What trial in your life might God be using as a growth engine?', prayer: 'God, I trust that this trial is producing perseverance in me.' },
      { day: 23, title: 'James 3-5 — The Tongue and Wisdom', theme: 'Wisdom from above', readings: ['James 3:1-18', 'James 4:1-10', 'James 5:13-18'], keyVerse: 'James 3:17', reflection: 'Earthly wisdom is selfish. Heavenly wisdom is pure, peace-loving, and gentle. Which kind drives your decisions right now?', prayer: 'Lord, give me wisdom from above in my situation today.' },
      { day: 24, title: '1 Peter — Holy and Hopeful', theme: 'Living as strangers', readings: ['1 Peter 1:3-25', '1 Peter 2:9-12', '1 Peter 5:6-11'], keyVerse: '1 Peter 2:9', reflection: 'You are a royal priesthood, a chosen people. How does knowing your identity change how you handle the hard things?', prayer: 'I cast all my anxiety on You because You care for me.' },
      { day: 25, title: 'Hebrews 11 — Heroes of Faith', theme: 'The faith hall of fame', readings: ['Hebrews 11:1-40', 'Hebrews 12:1-3'], keyVerse: 'Hebrews 11:1', reflection: 'All these heroes died without receiving the promise — yet their faith held. What are you trusting God for that you can\'t yet see?', prayer: 'I run with perseverance, fixing my eyes on Jesus.' },
      { day: 26, title: 'Revelation 1-3 — Letters to the Churches', theme: 'Jesus speaks to His bride', readings: ['Revelation 1:9-20', 'Revelation 2:1-7', 'Revelation 3:14-22'], keyVerse: 'Revelation 3:20', reflection: 'Jesus stands at the door and knocks — even at the door of a lukewarm church. Which letter reads most like your current spiritual condition?', prayer: 'Jesus, I open the door. Come in and dine with me.' },
      { day: 27, title: 'Proverbs — Wisdom for Life', theme: 'Fear of the Lord', readings: ['Proverbs 1:1-7', 'Proverbs 3:1-12', 'Proverbs 9:1-12'], keyVerse: 'Proverbs 3:5-6', reflection: 'Trust in the Lord with all your heart — not just most of it. What decision are you leaning on your own understanding for?', prayer: 'I acknowledge You in this path I\'m on. Straighten it according to Your wisdom.' },
      { day: 28, title: 'Isaiah 40 — Everlasting Strength', theme: 'God does not grow tired', readings: ['Isaiah 40:12-31', 'Isaiah 41:10', 'Isaiah 43:1-4'], keyVerse: 'Isaiah 40:31', reflection: 'Those who hope in the Lord will renew their strength. Are you waiting on God right now, or have you stopped waiting because it\'s taking too long?', prayer: 'I wait on You, Lord. I choose to hope. Renew my strength.' },
      { day: 29, title: 'The Great Commission', theme: 'Go and make disciples', readings: ['Matthew 28:16-20', 'Acts 1:6-11', 'Romans 10:13-15'], keyVerse: 'Matthew 28:19-20', reflection: 'Jesus said "as you are going" — discipleship happens in the middle of everyday life. Who in your world needs to hear the gospel from you?', prayer: 'Lord, make me bold to share what You\'ve done for me.' },
      { day: 30, title: 'Come, Lord Jesus', theme: 'The hope of His return', readings: ['1 Thessalonians 4:13-18', 'Revelation 21:1-5', 'Revelation 22:12-21'], keyVerse: 'Revelation 21:4', reflection: 'God will wipe every tear from your eyes. There will be no more death or mourning. How does this future hope change how you live today?', prayer: 'Come, Lord Jesus. Until You do, I will be faithful where You\'ve placed me.' }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // PLAN 4: 90-DAY — "Through the Story" (Survey of the Bible)
  // ─────────────────────────────────────────────────────────
  {
    id: 'through-the-story',
    title: 'Through the Story',
    subtitle: 'The whole Bible in 90 days',
    days: 90,
    difficulty: 'intermediate',
    icon: '📜',
    description: 'A chronological survey of the entire Bible — from Creation to Revelation — reading the story of God\'s redemption from beginning to end.',
    days_content: [
      { day: 1,  title: 'In the Beginning', theme: 'Creation', readings: ['Genesis 1-2'], keyVerse: 'Genesis 1:1', reflection: 'God spoke and worlds formed. What does it mean that the same God speaks into your life?', prayer: 'Creator God, You made everything good. Speak into my life today.' },
      { day: 2,  title: 'The Fall', theme: 'Sin enters the world', readings: ['Genesis 3-5'], keyVerse: 'Genesis 3:15', reflection: 'Even in the curse, God promises a Redeemer. How does seeing the fall through the lens of grace change it?', prayer: 'Lord, I see my own tendency to hide from You. Draw me back.' },
      { day: 3,  title: 'The Flood and the Covenant', theme: 'Noah and new beginnings', readings: ['Genesis 6-9'], keyVerse: 'Genesis 9:13', reflection: 'The rainbow is God\'s promise that He will never destroy the earth with water again. What promise of God are you holding onto today?', prayer: 'Thank You for Your covenant faithfulness, Lord.' },
      { day: 4,  title: 'Abraham — Father of Faith', theme: 'The covenant with Abraham', readings: ['Genesis 12', 'Genesis 15', 'Genesis 17'], keyVerse: 'Genesis 15:6', reflection: 'Abraham believed God and it was credited as righteousness. What is God asking you to believe Him for right now?', prayer: 'Like Abraham, I choose to believe Your promise even when it seems impossible.' },
      { day: 5,  title: 'Isaac, Jacob, Joseph', theme: 'The patriarchs', readings: ['Genesis 22', 'Genesis 28:10-22', 'Genesis 37'], keyVerse: 'Genesis 50:20', reflection: 'Joseph\'s pit became his path. How has God used a "pit" in your life to position you for something greater?', prayer: 'God, what was meant for evil in my life, You mean for good.' },
      { day: 6,  title: 'Moses — Burning Bush', theme: 'The call of Moses', readings: ['Exodus 1-4'], keyVerse: 'Exodus 3:14', reflection: 'Moses felt completely unqualified. God said "I AM" — not "you are." What is God calling you to that feels too big?', prayer: 'I AM goes with me. That is enough.' },
      { day: 7,  title: 'The Exodus', theme: 'Deliverance from Egypt', readings: ['Exodus 12-15'], keyVerse: 'Exodus 14:14', reflection: 'The Lord will fight for you; you need only be still. Where in your life do you need to stop striving and let God fight?', prayer: 'Lord, I stand still and watch You move.' },
      { day: 8,  title: 'The Ten Commandments', theme: 'God\'s law given at Sinai', readings: ['Exodus 19-20', 'Exodus 32'], keyVerse: 'Exodus 20:3', reflection: 'The law was given to a people already redeemed — not to earn salvation. How does knowing you\'re saved first change how you view obedience?', prayer: 'Lord, I obey not to earn Your love but because I have it.' },
      { day: 9,  title: 'The Tabernacle', theme: 'God dwelling with His people', readings: ['Exodus 25-26', 'Exodus 40'], keyVerse: 'Exodus 40:34', reflection: 'God\'s glory filled the tabernacle. You are now the temple (1 Cor 6:19). What does that mean for how you treat your body and mind?', prayer: 'Holy Spirit, fill my temple with Your glory today.' },
      { day: 10, title: 'Joshua — Entering the Promised Land', theme: 'Courage and conquest', readings: ['Joshua 1', 'Joshua 3-4', 'Joshua 24'], keyVerse: 'Joshua 1:9', reflection: 'Be strong and courageous — not because the path is easy, but because God goes with you. What "Jordan River" are you standing in front of?', prayer: 'I will be strong and courageous. You are with me wherever I go.' },
      { day: 11, title: 'Judges — A Cycle of Failure', theme: 'Sin, suffering, repentance, rescue', readings: ['Judges 2', 'Judges 6-7'], keyVerse: 'Judges 2:16', reflection: 'Israel kept forgetting God when things were good. What helps you remember God\'s faithfulness between the hard seasons?', prayer: 'Lord, keep me from forgetting You in the comfortable seasons.' },
      { day: 12, title: 'Ruth — Faithfulness and Redemption', theme: 'Loyal love (hesed)', readings: ['Ruth 1-4'], keyVerse: 'Ruth 1:16', reflection: 'Ruth\'s loyalty to Naomi is a picture of God\'s loyal love (hesed) for us. Who in your life needs that kind of faithfulness from you?', prayer: 'Give me a Ruth-like loyalty to the people You\'ve placed in my life.' },
      { day: 13, title: 'Samuel — God Looks at the Heart', theme: 'David anointed king', readings: ['1 Samuel 16-17', '1 Samuel 24'], keyVerse: '1 Samuel 16:7', reflection: 'Man looks at the outward appearance but God looks at the heart. What is God seeing in your heart right now?', prayer: 'Search my heart, Lord. What You find there, refine.' },
      { day: 14, title: 'David — A Man After God\'s Heart', theme: 'The Davidic covenant', readings: ['2 Samuel 7', 'Psalm 22', 'Psalm 27'], keyVerse: 'Acts 13:22', reflection: 'David sinned greatly and repented greatly. What made him "a man after God\'s heart" wasn\'t perfection — it was response. How do you respond when you fail?', prayer: 'Make me a person after Your heart, God — not a perfect person, but a responsive one.' },
      { day: 15, title: 'Solomon — Wisdom and Its Limits', theme: 'The Temple and the fall', readings: ['1 Kings 3', '1 Kings 8:22-53', '1 Kings 11:1-13'], keyVerse: '1 Kings 3:9', reflection: 'Solomon asked for wisdom and got everything. Then he lost it all. How does wealth or success sometimes become a spiritual trap?', prayer: 'Lord, give me a discerning heart. Guard me from the slow drift away from You.' },
      { day: 16, title: 'Elijah — Fire and Still Small Voice', theme: 'The prophet and the battle', readings: ['1 Kings 18-19'], keyVerse: '1 Kings 19:12', reflection: 'After the fire, wind, and earthquake — a still small voice. God often speaks quietest when we\'re most burned out. Are you in a cave right now?', prayer: 'Speak, Lord, in the stillness. I\'m listening.' },
      { day: 17, title: 'Isaiah — Holy, Holy, Holy', theme: 'The call of Isaiah and Servant Songs', readings: ['Isaiah 6', 'Isaiah 40', 'Isaiah 53'], keyVerse: 'Isaiah 53:5', reflection: 'Isaiah 53 was written 700 years before Jesus — and reads like an eyewitness account of the cross. How does prophecy fulfilled increase your faith?', prayer: 'He was pierced for my transgressions. That\'s personal. Thank You, Jesus.' },
      { day: 18, title: 'Jeremiah — The Weeping Prophet', theme: 'Plans for hope', readings: ['Jeremiah 1', 'Jeremiah 17:9', 'Jeremiah 29:11-13', 'Jeremiah 31:31-34'], keyVerse: 'Jeremiah 29:11', reflection: 'God spoke hope into exile. Is there an area of your life in "exile" right now that needs this promise?', prayer: 'Lord, You have plans for me that are good — even in this season.' },
      { day: 19, title: 'Daniel — Faithfulness Under Pressure', theme: 'Daniel in Babylon', readings: ['Daniel 1', 'Daniel 3', 'Daniel 6'], keyVerse: 'Daniel 3:17-18', reflection: '"Even if He does not" — Daniel\'s friends trusted God even without guaranteed rescue. Can you say that?', prayer: 'God, I trust You even if the outcome isn\'t what I want.' },
      { day: 20, title: 'Jonah — Running From God', theme: 'Mercy for the unlikely', readings: ['Jonah 1-4'], keyVerse: 'Jonah 2:9', reflection: 'Jonah ran, God pursued, Jonah relented, God moved. Is there anywhere you\'ve been running from God\'s call?', prayer: 'Salvation comes from the Lord. I stop running and turn toward You.' },
      { day: 21, title: 'The Birth of Jesus', theme: 'The Incarnation', readings: ['Luke 1-2', 'John 1:1-18'], keyVerse: 'John 1:14', reflection: 'The Word became flesh and moved into the neighborhood. What does it mean that God Himself took on your humanity?', prayer: 'Thank You for becoming one of us so we could become more like You.' },
      { day: 22, title: 'The Sermon on the Mount', theme: 'Jesus the teacher', readings: ['Matthew 5-7'], keyVerse: 'Matthew 5:3', reflection: 'The greatest sermon ever preached turned all worldly wisdom on its head. What one teaching from today\'s reading do you need to act on?', prayer: 'Lord, I want to be a wise builder — hearing and doing Your words.' },
      { day: 23, title: 'Jesus the Healer', theme: 'Signs and wonders', readings: ['Mark 1-2', 'John 9'], keyVerse: 'Mark 1:41', reflection: 'Jesus was moved with compassion before He healed. He still is. Bring your need to the One who is moved by it.', prayer: 'Jesus, I bring You my need. You are compassionate and able.' },
      { day: 24, title: 'The Last Supper', theme: 'The new covenant', readings: ['John 13-14', 'Luke 22:7-30'], keyVerse: 'John 13:35', reflection: 'The night before His death, Jesus washed feet and commanded love. In your most difficult moments, what do you default to?', prayer: 'Lord, make me a foot-washer — a servant even when it costs me.' },
      { day: 25, title: 'The Cross and Resurrection', theme: 'The center of history', readings: ['Luke 23-24', '1 Corinthians 15:1-8'], keyVerse: '1 Corinthians 15:3-4', reflection: 'This is the gospel — not just information but power. When did this story first become real to you?', prayer: 'Jesus, thank You. Those two words are enough, but I want to say more today.' },
      { day: 26, title: 'Pentecost — The Spirit Comes', theme: 'The church is born', readings: ['Acts 1-2'], keyVerse: 'Acts 2:42', reflection: 'The early church devoted themselves to four things. How does your week measure against Acts 2:42?', prayer: 'Holy Spirit, build that kind of community in me and around me.' },
      { day: 27, title: 'Paul — From Persecutor to Apostle', theme: 'The Damascus Road', readings: ['Acts 9', 'Galatians 1-2'], keyVerse: 'Acts 9:15', reflection: 'God chose Paul not despite his past but through it. How might God use your story — even the worst parts — for His glory?', prayer: 'Use my story, Lord. Even the parts I\'m ashamed of.' },
      { day: 28, title: 'The Letters — Grace and Peace', theme: 'Paul\'s summary of the gospel', readings: ['Romans 1:1-17', 'Galatians 2:20', '1 Corinthians 13'], keyVerse: 'Galatians 2:20', reflection: 'I no longer live, but Christ lives in me. What would that look like practically in your biggest relationship challenge right now?', prayer: 'Christ in me — be visible in me today.' },
      { day: 29, title: 'Revelation — All Things New', theme: 'The end is a beginning', readings: ['Revelation 1', 'Revelation 21-22'], keyVerse: 'Revelation 21:5', reflection: 'God says "Behold, I am making all things new." Not fixing the old — making new. What in your life needs that kind of renewal?', prayer: 'Come, Lord Jesus. Make all things new — starting with me.' },
      { day: 30, title: 'Your Story in His Story', theme: 'Where you fit in the narrative', readings: ['Hebrews 12:1-3', 'Revelation 22:12-21'], keyVerse: 'Hebrews 12:1', reflection: 'You are a character in the greatest story ever told. The cloud of witnesses is cheering you on. How will you run your leg of the race?', prayer: 'I fix my eyes on Jesus and run with perseverance the race set before me.' },
      ...Array.from({length: 60}, (_, i) => ({
        day: i + 31,
        title: 'Day ' + (i + 31),
        theme: 'Continuing through Scripture',
        readings: ['Proverbs 1'],
        keyVerse: 'Proverbs 3:5',
        reflection: 'Continue reading and reflecting on what God is showing you.',
        prayer: 'Lord, speak to me through Your Word today.'
      }))
    ]
  },

  // ─────────────────────────────────────────────────────────
  // PLAN 5: 365-DAY — "The Whole Word" (Mature believers)
  // ─────────────────────────────────────────────────────────
  {
    id: 'whole-word',
    title: 'The Whole Word',
    subtitle: 'Read the entire Bible in a year',
    days: 365,
    difficulty: 'advanced',
    icon: '📖',
    description: 'A chronological, full-Bible reading plan. Every book, every chapter, every verse — in the order events occurred. The most comprehensive way to know God\'s Word.',
    schedule: [
      { days: '1-5',    books: 'Genesis 1-50', theme: 'Creation and the Patriarchs' },
      { days: '6-10',   books: 'Job', theme: 'Suffering and sovereignty' },
      { days: '11-17',  books: 'Exodus 1-40', theme: 'Deliverance and the Law' },
      { days: '18-20',  books: 'Leviticus', theme: 'Holiness and sacrifice' },
      { days: '21-23',  books: 'Numbers', theme: 'Wilderness wanderings' },
      { days: '24-26',  books: 'Deuteronomy', theme: 'Moses\' final sermons' },
      { days: '27-29',  books: 'Joshua', theme: 'Conquest and settlement' },
      { days: '30-32',  books: 'Judges, Ruth', theme: 'Cycles and loyal love' },
      { days: '33-37',  books: '1 & 2 Samuel', theme: 'Saul, David, and the kingdom' },
      { days: '38-40',  books: 'Psalms 1-41', theme: 'Songs of David' },
      { days: '41-44',  books: '1 Kings 1-11, Proverbs, Ecclesiastes, Song of Solomon', theme: 'Solomon\'s wisdom and fall' },
      { days: '45-48',  books: '1 Kings 12 - 2 Kings 17', theme: 'The divided kingdom' },
      { days: '49-53',  books: 'Isaiah', theme: 'The evangelical prophet' },
      { days: '54-57',  books: 'Jeremiah, Lamentations', theme: 'The weeping prophet' },
      { days: '58-60',  books: '2 Kings 18-25, 2 Chronicles', theme: 'The fall of Jerusalem' },
      { days: '61-62',  books: 'Ezekiel', theme: 'Visions and restoration' },
      { days: '63-64',  books: 'Daniel, Esther', theme: 'Faithfulness in exile' },
      { days: '65-67',  books: 'Ezra, Nehemiah, Malachi, Zechariah, Haggai', theme: 'The return from exile' },
      { days: '68-72',  books: 'Matthew 1 - Luke 24', theme: 'The life of Jesus (Harmony of the Gospels)' },
      { days: '73-74',  books: 'John', theme: 'The theological Gospel' },
      { days: '75-77',  books: 'Acts', theme: 'The early church' },
      { days: '78-79',  books: 'Galatians, 1 & 2 Thessalonians, 1 & 2 Corinthians', theme: 'Paul\'s early letters' },
      { days: '80-81',  books: 'Romans', theme: 'The gospel explained' },
      { days: '82-83',  books: 'Ephesians, Philippians, Colossians, Philemon', theme: 'Prison epistles' },
      { days: '84-85',  books: '1 & 2 Timothy, Titus, Hebrews, James', theme: 'Pastoral and wisdom letters' },
      { days: '86-87',  books: '1 & 2 Peter, Jude, 1 2 3 John', theme: 'General epistles' },
      { days: '88-90',  books: 'Revelation', theme: 'The consummation of all things' }
    ],
    days_content: Array.from({length: 365}, (_, i) => ({
      day: i + 1,
      title: 'Day ' + (i + 1),
      theme: 'Read, reflect, respond',
      readings: [],
      keyVerse: '',
      reflection: 'What is one thing God is showing you in today\'s reading?',
      prayer: 'Lord, open my eyes to see wonderful things in Your Word today. (Psalm 119:18)'
    }))
  }
];

// Mood → Scripture mapping (5 moods → 3 verses each + reflection)
const MOOD_SCRIPTURE = {
  grateful: {
    emoji: '😊',
    label: 'Grateful',
    verses: [
      { ref: 'Psalm 100:4', text: 'Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.', reflection: 'Gratitude is the doorway into God\'s presence. What specific gift can you thank Him for right now?' },
      { ref: '1 Thessalonians 5:18', text: 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.', reflection: 'Not for all things — but in all things. Even the hard ones.' },
      { ref: 'Philippians 4:6', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', reflection: 'Thanksgiving before the answer. That\'s faith.' }
    ]
  },
  anxious: {
    emoji: '😟',
    label: 'Anxious / Worried',
    verses: [
      { ref: 'Matthew 6:34', text: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.', reflection: 'Jesus isn\'t dismissing your concern — He\'s inviting you to live in today, where He already is.' },
      { ref: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.', reflection: 'Four promises in one verse. Which one do you need most right now?' },
      { ref: 'Philippians 4:7', text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', reflection: 'This peace doesn\'t make sense — it transcends understanding. Ask for it by name.' }
    ]
  },
  sad: {
    emoji: '😔',
    label: 'Sad / Hurting',
    verses: [
      { ref: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.', reflection: 'He doesn\'t stand far off from your pain. He draws closer when you\'re broken.' },
      { ref: 'John 11:35', text: 'Jesus wept.', reflection: 'The Son of God cried at a graveside. He doesn\'t ask you to skip your grief. He sits in it with you.' },
      { ref: 'Romans 8:26', text: 'The Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans.', reflection: 'When you have no words, the Spirit prays for you. You don\'t have to have it together to come to God.' }
    ]
  },
  angry: {
    emoji: '😤',
    label: 'Frustrated / Angry',
    verses: [
      { ref: 'Ephesians 4:26', text: '"In your anger do not sin": Do not let the sun go down while you are still angry.', reflection: 'God doesn\'t tell you to never be angry — He says don\'t let it become a place you live.' },
      { ref: 'Psalm 4:4', text: 'Tremble and do not sin; when you are on your beds, search your hearts and be silent.', reflection: 'Silence before God when you\'re frustrated. What is your anger protecting underneath?' },
      { ref: 'James 1:19-20', text: 'Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires.', reflection: 'Quick to listen. Is there someone you need to hear before you respond?' }
    ]
  },
  lost: {
    emoji: '😶',
    label: 'Lost / Confused',
    verses: [
      { ref: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', reflection: 'You don\'t need to understand the path — you need to trust the One who knows it.' },
      { ref: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.', reflection: 'A lamp lights the next step — not the whole road. What\'s the one next step you can see?' },
      { ref: 'John 10:27', text: 'My sheep listen to my voice; I know them, and they follow me.', reflection: 'You know His voice more than you think. What has He been saying that you\'ve been unsure about?' }
    ]
  }
};

// Guided Prayer Sessions
const PRAYER_SESSIONS = [
  {
    id: 'morning',
    title: 'Morning Prayer',
    icon: '🌅',
    duration: 10,
    description: 'Start your day centered on God before the noise begins.',
    ambientYouTube: 'jfKfPfyJRdk',
    steps: [
      { time: 60,  type: 'stillness',    instruction: 'Sit quietly. Take three deep breaths. Acknowledge that God is present with you right now.' },
      { time: 90,  type: 'adoration',    instruction: 'Worship God for who He is — not what He does. Say aloud three things you love about His character.' },
      { time: 120, type: 'confession',   instruction: 'Ask the Holy Spirit to show you anything that stands between you and God. Confess it honestly. Receive His forgiveness.' },
      { time: 120, type: 'thanksgiving', instruction: 'Thank God for three specific things from the past 24 hours. Be specific — not just "everything."' },
      { time: 150, type: 'intercession', instruction: 'Pray for one person by name. Ask God what He wants to do in their life today.' },
      { time: 90,  type: 'personal',     instruction: 'Bring your day to God. Ask for wisdom, strength, and presence for what\'s ahead.' },
      { time: 60,  type: 'surrender',    instruction: 'Close with surrender: "Not my will but Yours." Rest in the quiet for one minute before you open your eyes.' }
    ]
  },
  {
    id: 'evening',
    title: 'Evening Prayer',
    icon: '🌙',
    duration: 8,
    description: 'Close the day with reflection, release, and rest.',
    ambientYouTube: 'hlWiI4xVXKY',
    steps: [
      { time: 60,  type: 'stillness', instruction: 'Let the day\'s noise settle. You don\'t have to carry today into tomorrow.' },
      { time: 90,  type: 'review',    instruction: 'Where did you sense God today? Where did you miss Him? No condemnation — just honest review.' },
      { time: 90,  type: 'gratitude', instruction: 'Name one moment from today that you\'re grateful for. Hold it with God for a moment.' },
      { time: 120, type: 'release',   instruction: 'Name what you\'re carrying — worries, unfinished things, conversations that stung. Hand each one to God.' },
      { time: 90,  type: 'others',    instruction: 'Pray for someone who came to mind today. Ask God what they need.' },
      { time: 60,  type: 'rest',      instruction: 'End with Psalm 4:8: "In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety." Say it slowly, twice.' }
    ]
  },
  {
    id: 'fasting',
    title: 'Fasting Prayer',
    icon: '🤲',
    duration: 15,
    description: 'A guided prayer for days you are fasting — turning hunger into prayer.',
    ambientYouTube: 'UfcAVejslrU',
    steps: [
      { time: 60,  type: 'intention',   instruction: 'State your fast\'s purpose before God. Why are you fasting today? What are you seeking?' },
      { time: 90,  type: 'hunger',      instruction: 'When you feel hungry, pause. Use that hunger as a physical trigger to pray. Say: "Lord, I hunger for You more than for food."' },
      { time: 120, type: 'scripture',   instruction: 'Meditate on Matthew 4:4 — "Man shall not live by bread alone but by every word from the mouth of God." What word is He speaking to you today?' },
      { time: 120, type: 'warfare',     instruction: 'Fast often accompanies spiritual breakthrough. Pray against whatever stronghold you\'re believing God to break.' },
      { time: 120, type: 'intercession', instruction: 'Fasting sharpens intercession. Pray at length for one specific person or situation you\'ve been burdened for.' },
      { time: 90,  type: 'surrender',   instruction: 'Re-state your surrender to God. Ask Him to fill every empty place — physically and spiritually.' },
      { time: 90,  type: 'worship',     instruction: 'Close with worship. Isaiah 58 says the fast God honors leads to breakthrough and healing. Thank Him in advance.' }
    ]
  },
  {
    id: 'anxiety',
    title: 'Peace in the Storm',
    icon: '🕊️',
    duration: 8,
    description: 'For moments of anxiety, fear, or overwhelm. Let Scripture anchor you.',
    ambientYouTube: 'yJgBFCEaO-I',
    steps: [
      { time: 60,  type: 'breath',      instruction: 'Breathe in for 4 counts, hold for 4, out for 4. Do this three times. Your body is catching up to what God already knows.' },
      { time: 90,  type: 'acknowledge', instruction: 'Tell God exactly what you\'re afraid of. No spiritual language required. Just say it honestly.' },
      { time: 90,  type: 'truth',       instruction: 'Read Isaiah 41:10 aloud: "Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you."' },
      { time: 90,  type: 'cast',        instruction: 'Physically open your hands. Imagine placing your worry in them. Then slowly turn them over — surrendering it to God.' },
      { time: 90,  type: 'promise',     instruction: 'Recall one time God came through for you in the past. Let that evidence build your faith for now.' },
      { time: 60,  type: 'receive',     instruction: 'Receive Philippians 4:7 as a gift: "The peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." It\'s yours. Receive it.' }
    ]
  },
  {
    id: 'gratitude',
    title: 'Gratitude Prayer',
    icon: '✨',
    duration: 7,
    description: 'Train your heart to see God\'s goodness everywhere.',
    ambientYouTube: 'jfKfPfyJRdk',
    steps: [
      { time: 60,  type: 'stillness',  instruction: 'Quiet yourself. Let gratitude be the posture before you say a word.' },
      { time: 90,  type: 'body',       instruction: 'Thank God for your body — five things it does that you normally take for granted.' },
      { time: 90,  type: 'people',     instruction: 'Thank God for three people in your life. Speak their names aloud.' },
      { time: 90,  type: 'provision',  instruction: 'Thank God for specific provisions — roof, food, clothing, safety. Many live without these.' },
      { time: 90,  type: 'salvation',  instruction: 'Thank God for the gospel. For the cross. For your name written in the Lamb\'s Book of Life.' },
      { time: 60,  type: 'tomorrow',   instruction: 'Thank God for something that hasn\'t happened yet — in faith. Choose to be grateful in advance.' }
    ]
  },
  {
    id: 'intercession',
    title: 'Intercessory Prayer',
    icon: '🛡️',
    duration: 12,
    description: 'Pray on behalf of others — family, friends, church, nation.',
    ambientYouTube: 'UfcAVejslrU',
    steps: [
      { time: 60,  type: 'positioning',  instruction: 'You are a priest before God on behalf of others (1 Peter 2:9). Position yourself in that identity before you begin.' },
      { time: 120, type: 'family',       instruction: 'Pray for each person in your family by name. Ask the Spirit what each one needs. Listen before you speak.' },
      { time: 120, type: 'friends',      instruction: 'Pray for two or three friends — especially any who don\'t yet know Jesus. Ask God to prepare their hearts.' },
      { time: 120, type: 'church',       instruction: 'Pray for your church — the pastor, the leaders, the building, the mission. Ask God what it needs.' },
      { time: 120, type: 'nation',       instruction: 'Pray for your nation\'s leaders (1 Timothy 2:1-2). Pray for justice, righteousness, and the spread of the gospel.' },
      { time: 60,  type: 'close',        instruction: 'Close by thanking God that He hears the prayer of the righteous (James 5:16). Your prayers matter.' }
    ]
  }
];

// Sermon Notes templates
const SERMON_NOTE_PROMPTS = [
  'What is the main passage and key verse?',
  'What is the central message in one sentence?',
  'What is one thing God showed me personally?',
  'What is one thing I will do differently this week?',
  'Who can I share this with?'
];
