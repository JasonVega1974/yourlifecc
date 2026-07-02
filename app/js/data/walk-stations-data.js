/* =============================================================
   walk-stations-data.js — "My Walk with God" Pathway (W1)
   Pure data. Read by walk-path.js; no behavior lives here.

   Implements docs/my-walk-with-god-pathway-spec.md §2–§3:
   4 chapters · 14 stations · consistent 11-part station template.
   "Becoming Like Christ" is the horizon — never completable.

   PASTOR REVIEW: every station carries pastorReview:true until
   Pastor Tim (or a discipleship leader) has reviewed the teaching,
   order, and "how you'll know" markers. The app renders a small
   "reviewed with church leadership" line only when this is false.

   Tone rules baked into the copy (spec §5):
   - Invitation, never a scoreboard. Grace-first, self-paced.
   - Written for someone who doesn't know. No insider jargon.
   - Every station connects to a real person, never app-only.
============================================================= */

const WALK_CHAPTERS = [
  { id:'coming-home', num:1, name:'Coming Home',   sub:'From curious to found' },
  { id:'first-steps', num:2, name:'First Steps',   sub:'Learning to walk with Him' },
  { id:'growing-deep',num:3, name:'Growing Deep',  sub:'Roots that hold in storms' },
  { id:'living-out',  num:4, name:'Living It Out', sub:'A light that reaches others' }
];

const WALK_STATIONS = [

/* ── CHAPTER 1 · COMING HOME ─────────────────────────────── */
{
  id:'curious', chapter:'coming-home', order:1, icon:'🔭',
  name:'Come and See', tagline:'I\'m curious. I\'m not sure yet. That\'s okay.',
  pastorReview:true,
  welcome:'You don\'t have to believe anything yet to stand here. Curiosity is how almost every walk with God begins.',
  what:'This step is simply being honest: "I want to know if this is real." When Jesus met His first followers, they asked where He was staying — and He didn\'t hand them a rulebook. He said, "Come and see." That invitation is still open.',
  understand:[
    'A lot of people think faith means switching your brain off. The Bible actually invites the opposite — "Come now, let us reason together" (Isaiah 1:18). Questions aren\'t the enemy of faith. Fake certainty is.',
    'You\'re allowed to investigate. Look at the evidence for Jesus\'s life, death, and resurrection like a detective would. Look at the prophecies written centuries before He was born. Look at how the universe itself points to a Beginner.',
    'And here\'s the quiet truth underneath the searching: while you\'re looking for God, He is already looking at you — with kindness, not a scorecard. "You will seek me and find me, when you seek me with all your heart" (Jeremiah 29:13).'
  ],
  verses:[
    { ref:'John 1:39', text:'"Come," he replied, "and you will see."' },
    { ref:'Jeremiah 29:13', text:'You will seek me and find me when you seek me with all your heart.' },
    { ref:'Psalm 34:8', text:'Taste and see that the LORD is good.' }
  ],
  step:{
    title:'Investigate one honest question',
    how:'Pick the one question that most keeps you from believing — "Did the resurrection really happen?" "Does science rule God out?" — and actually chase it down. Flip three Convince Me cards, or open Proof & Prophecy and read one full case. Don\'t settle for a vibe; look at the evidence.'
  },
  markers:[
    'You\'ve moved from "this is silly" to "okay… this deserves a real look."',
    'You have a specific question you\'re genuinely chasing, not avoiding.',
    'You\'ve caught yourself thinking about Jesus when nobody made you.'
  ],
  tools:[
    { icon:'🃏', label:'Convince Me cards', route:'convince' },
    { icon:'📜', label:'Proof & Prophecy', route:'proof' },
    { icon:'✝️', label:'Who Is Jesus?', route:'jesus' }
  ],
  reflect:'What\'s the real question underneath your hesitation? Write it out honestly — God is not offended by it.',
  pray:'God, if You\'re real, I want to know. I\'m not pretending to be sure. But I\'m open. Show me something true. Amen.',
  human:'Curiosity grows best in conversation. Is there one person you know who genuinely follows Jesus? Ask them how it started for them.'
},
{
  id:'gospel', chapter:'coming-home', order:2, icon:'💛',
  name:'Understand the Gospel', tagline:'What Jesus actually did — and why it\'s for you.',
  pastorReview:true,
  welcome:'"Gospel" just means good news. Before you can say yes to it, you deserve to actually understand it.',
  what:'This step is grasping the heart of Christianity in plain language: God made you, loves you, and wants you — but something is broken between us and Him, and Jesus came to fix what we never could.',
  understand:[
    'Start here: you were made on purpose, by a God who loves you. But every one of us has broken things — we\'ve hurt people, lied, chosen ourselves. The Bible calls that sin, and it separates us from a perfect God the way a wall separates two rooms.',
    'Here\'s the part people miss: God didn\'t respond to that wall with a to-do list. He responded with a rescue. Jesus — God Himself, in person — lived the perfect life we couldn\'t, then died on a cross taking the penalty our sin earned. The innocent one traded places with the guilty ones. That\'s the exchange at the center of everything.',
    'Then He rose from the dead — not as a metaphor, as an event with eyewitnesses — proving the payment worked and death doesn\'t get the last word.',
    'So the good news is not "try harder and God might accept you." It\'s "it is finished — will you receive it?" Grace means it\'s a gift. You can\'t earn a gift. You can only take it or leave it.'
  ],
  verses:[
    { ref:'John 3:16', text:'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
    { ref:'Romans 5:8', text:'God demonstrates his own love for us in this: While we were still sinners, Christ died for us.' },
    { ref:'Ephesians 2:8-9', text:'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.' }
  ],
  step:{
    title:'Tell the gospel back in your own words',
    how:'Open your journal and write the good news as if explaining it to a friend in four sentences: God made me and loves me. My sin built a wall. Jesus died and rose to tear it down. It\'s a gift I can receive. If you can say it, you understand it.'
  },
  markers:[
    'You can explain the gospel simply, without churchy words.',
    'You understand it\'s a rescue to receive, not a standard to reach.',
    'It has started to feel less like information and more like an invitation.'
  ],
  tools:[
    { icon:'📖', label:'Story Mode: the whole story', route:'story' },
    { icon:'🎓', label:'Faith Academy basics', route:'academy' },
    { icon:'🃏', label:'Convince Me cards', route:'convince' }
  ],
  reflect:'Which half is harder for you to believe — that you needed rescuing, or that God wanted to rescue you? Why?',
  pray:'Jesus, I\'m starting to see what You did — for me, specifically. Help me understand it all the way down. Amen.',
  human:'Ask a pastor or a Christian you trust: "What does the gospel mean to you, personally?" Their answer will teach you something a page can\'t.'
},
{
  id:'accepted', chapter:'coming-home', order:3, icon:'🕊️',
  name:'Saying Yes to Jesus', tagline:'The most important step on the whole path.',
  pastorReview:true,
  welcome:'Everything before this was learning about Him. This step is meeting Him.',
  what:'Accepting Christ means personally receiving the gift — telling God you believe Jesus died and rose for you, turning from running your own life, and inviting Him to lead it. It\'s not a ritual. It\'s a decision, made in honest words.',
  understand:[
    'The Bible makes the doorway surprisingly simple: "If you declare with your mouth, \'Jesus is Lord,\' and believe in your heart that God raised him from the dead, you will be saved" (Romans 10:9). Believe. Receive. Say it.',
    'Two honest words describe what happens. Repent — which isn\'t groveling, it\'s a U-turn: I stop steering and hand Jesus the wheel. And believe — I trust that His death counts for me and His resurrection is my future.',
    'There\'s no magic script. God listens to hearts, not scripts. But if you want words to lean on, the prayer below has carried millions of people through this doorway.',
    'And know this: heaven does not shrug at this moment. Jesus said there is joy in the presence of the angels of God over one sinner who repents (Luke 15:10). One. You.'
  ],
  verses:[
    { ref:'Romans 10:9', text:'If you declare with your mouth, "Jesus is Lord," and believe in your heart that God raised him from the dead, you will be saved.' },
    { ref:'John 1:12', text:'To all who did receive him, to those who believed in his name, he gave the right to become children of God.' },
    { ref:'Revelation 3:20', text:'Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in.' }
  ],
  step:{
    title:'Pray and mean it',
    how:'Find a quiet moment. Pray something like this, out loud if you can: "Jesus, I believe You are the Son of God. I believe You died for my sins and rose again. Forgive me. I turn from going my own way. Come into my life — I\'m Yours. Amen." If you prayed that and meant it, mark this step. Today is Day One.'
  },
  markers:[
    'You\'ve prayed to receive Christ — in your words or the ones above.',
    'It was you talking to God, not you reading at Him.',
    'Something in you knows a line was crossed — even if it felt quiet.'
  ],
  tools:[
    { icon:'🙏', label:'Prayer space', route:'prayer' },
    { icon:'📔', label:'Record it in your Faith Journey', route:'journey' },
    { icon:'💛', label:'Re-read the gospel station', route:'gospel' }
  ],
  reflect:'Write down today\'s date and what you prayed. Years from now, you will want to remember this exact moment.',
  pray:'Jesus, I said yes. I\'m Yours now. Thank You for making me a child of God. Teach me to walk with You from here. Amen.',
  human:'Tell one person today — a pastor, a believing friend, a family member. Saying it out loud to a real human makes it real in a whole new way. (And they will want to celebrate you.)'
},
{
  id:'assurance', chapter:'coming-home', order:4, icon:'🪞',
  name:'Assurance & New Identity', tagline:'Knowing you\'re saved — and who you are now.',
  pastorReview:true,
  welcome:'Almost every new believer hits the same question within days: "Did it work? Am I really saved?" Let\'s settle it.',
  what:'This step is learning to stand on what God says instead of what you feel. Feelings are weather — they change hourly. Your salvation rests on a finished fact, not a fluctuating mood.',
  understand:[
    'Here\'s the test the Bible gives, and notice what it isn\'t: "Whoever has the Son has life" (1 John 5:12). Not "whoever feels spiritual today." Not "whoever hasn\'t messed up this week." Has the Son. Did you receive Jesus? Then you have life. That\'s the whole equation.',
    'You will still sin. That will feel like proof it didn\'t work. It isn\'t — it\'s proof you\'re alive and growing. The difference is that now, when you fall, you fall inside the family. "If we confess our sins, he is faithful and just and will forgive us" (1 John 1:9). Confession isn\'t re-applying for salvation; it\'s a kid coming to a Father who already loves them.',
    'And your name tags changed. The Bible now calls you: a child of God (John 1:12). A new creation (2 Corinthians 5:17). Chosen (1 Peter 2:9). No longer condemned (Romans 8:1). Those aren\'t compliments — they\'re your legal identity in God\'s eyes. Learning to believe your new name is the work of this station.'
  ],
  verses:[
    { ref:'1 John 5:13', text:'I write these things to you who believe in the name of the Son of God so that you may know that you have eternal life.' },
    { ref:'2 Corinthians 5:17', text:'If anyone is in Christ, the new creation has come: The old has gone, the new is here!' },
    { ref:'Romans 8:1', text:'Therefore, there is now no condemnation for those who are in Christ Jesus.' }
  ],
  step:{
    title:'Memorize your anchor verse',
    how:'Add 1 John 5:13 or Romans 8:1 to Scripture Memory and learn it cold. The next time doubt whispers "did it work?", you answer out loud with a verse instead of a feeling.'
  },
  markers:[
    'When doubt hits, you reach for what God said before how you feel.',
    'After you mess up, you confess and get back up instead of hiding for a week.',
    'You\'ve started to catch yourself thinking "I\'m His" — and believing it.'
  ],
  tools:[
    { icon:'🧠', label:'Scripture Memory', route:'memory' },
    { icon:'💗', label:'Heart Check', route:'heartcheck' },
    { icon:'🎓', label:'Faith Academy: identity lessons', route:'academy' }
  ],
  reflect:'Which of your new names — child, new creation, chosen, not condemned — is hardest for you to believe? Tell God why, honestly.',
  pray:'Father, when my feelings argue with Your Word, help me side with Your Word. I am Yours because You said so. Amen.',
  human:'Share your hardest doubt with a mature believer. Watch how un-shocked they are — every strong Christian you admire has stood exactly where you\'re standing.'
},

/* ── CHAPTER 2 · FIRST STEPS ─────────────────────────────── */
{
  id:'baptism', chapter:'first-steps', order:5, icon:'🌊',
  name:'Baptism', tagline:'Going public with your new life.',
  pastorReview:true,
  welcome:'You said yes in your heart. Baptism is saying it with your whole body, in front of witnesses.',
  what:'Baptism is a public picture of what already happened inside you: going under the water portrays being buried with Christ; coming up portrays rising with Him into new life. It doesn\'t save you — Jesus did that. It announces it.',
  understand:[
    'Jesus Himself was baptized, and He told His followers to baptize everyone who follows Him (Matthew 28:19). In the book of Acts, baptism follows belief so quickly it\'s almost breathless — the Ethiopian official sees water from his chariot and says, "What can stand in the way of my being baptized?" (Acts 8:36).',
    'Think of it like a wedding ring. The ring doesn\'t make you married — the covenant does. But you wear the ring because you want the world to know. Baptism is your ring: a soaked, smiling, public "I\'m His."',
    'Nervous about being up front? Almost everyone is. But something happens when you declare it with witnesses — the private decision gets roots. Churches that follow Jesus in this will walk you through every detail; the timing and details are a conversation with your pastor.'
  ],
  verses:[
    { ref:'Romans 6:4', text:'We were therefore buried with him through baptism into death in order that, just as Christ was raised from the dead through the glory of the Father, we too may live a new life.' },
    { ref:'Matthew 28:19', text:'Go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.' },
    { ref:'Acts 8:36', text:'"Look, here is water. What can stand in the way of my being baptized?"' }
  ],
  step:{
    title:'Have the baptism conversation',
    how:'Talk to a pastor at your church this month and say the words: "I\'ve accepted Christ and I want to be baptized." That one sentence sets everything in motion. If you don\'t have a church yet, the Finding Your Church Family station will help — the two steps often happen together.'
  },
  markers:[
    'You\'ve told a pastor you want to be baptized (or you\'re already scheduled).',
    'You understand it\'s a declaration of grace received, not a graduation earned.',
    'You\'ve thought about who you want watching from the front row.'
  ],
  tools:[
    { icon:'📔', label:'Log it as a Faith Journey milestone', route:'journey' },
    { icon:'⛪', label:'Finding Your Church Family station', route:'church' },
    { icon:'🎓', label:'Faith Academy: baptism lesson', route:'academy' }
  ],
  reflect:'Who do you want to witness your baptism — and who might God be planning to reach through watching you go public?',
  pray:'Jesus, You went into the water for me; I\'ll go into the water for You. Give me courage to declare You out loud. Amen.',
  human:'This entire step runs through a real church and a real pastor — that\'s by design. Faith was never meant to be announced to an empty room.'
},
{
  id:'prayer-learn', chapter:'first-steps', order:6, icon:'🙏',
  name:'Learning to Pray', tagline:'Actually talking with God — not performing.',
  pastorReview:true,
  welcome:'Prayer intimidates almost everyone at first. Here\'s the secret: God is not grading your grammar.',
  what:'Prayer is honest conversation with a Father who is already listening. Not a formula, not fancy words, not a performance. Jesus\'s own disciples asked "teach us to pray" — so wanting to learn puts you in very good company.',
  understand:[
    'Jesus gave a pattern, not a script — the Lord\'s Prayer (Matthew 6:9-13). Inside it: honoring God ("hallowed be your name"), inviting His will ("your kingdom come"), asking for needs ("daily bread"), clearing the air ("forgive us"), and asking for protection ("deliver us"). Five moves you can pray in your own words in ninety seconds.',
    'A simple on-ramp many believers use is P.R.A.Y. — Pause (get quiet), Rejoice (thank Him for something specific), Ask (for others and yourself), Yield ("Your will, not mine"). Structure isn\'t a cage; it\'s training wheels.',
    'Two promises to hold: you can come boldly, not groveling (Hebrews 4:16), and when you don\'t even have words, "the Spirit himself intercedes for us through wordless groans" (Romans 8:26). Sitting silently with God, out of words, still counts as prayer. Some of the best prayers have no sentences at all.'
  ],
  verses:[
    { ref:'Matthew 6:9', text:'This, then, is how you should pray: "Our Father in heaven, hallowed be your name..."' },
    { ref:'Philippians 4:6', text:'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
    { ref:'Hebrews 4:16', text:'Let us then approach God\'s throne of grace with confidence.' }
  ],
  step:{
    title:'Pray 5 minutes a day for 7 days',
    how:'One week. Five minutes. Use the P.R.A.Y. pattern or a Quick Prayer as a starter, then finish in your own words. Write one line in your prayer journal each day so you can watch what God does with a single honest week.'
  },
  markers:[
    'You\'ve prayed in your own unpolished words — and it felt like talking, not reciting.',
    'You\'ve brought God something real: a fear, a hope, a person you love.',
    'You\'ve noticed yourself praying small prayers in the middle of ordinary moments.'
  ],
  tools:[
    { icon:'⚡', label:'Quick Prayers library', route:'prayer' },
    { icon:'🎯', label:'Pray-this focus mode', route:'prayerfocus' },
    { icon:'📔', label:'Prayer journal', route:'journey' }
  ],
  reflect:'What have you never said to God because it felt too honest? He can handle it — He already knows. Say it this week.',
  pray:'Father, teach me to pray like Jesus taught His friends. I\'m done performing. Here\'s my real voice. Amen.',
  human:'Ask someone to pray with you out loud — a parent, a leader, a friend. Two-person prayer is the fastest prayer school on earth.'
},
{
  id:'word', chapter:'first-steps', order:7, icon:'📖',
  name:'Rooted in the Word', tagline:'Learning to feed yourself from Scripture.',
  pastorReview:true,
  welcome:'The Bible is a library, not a straight-through novel — and nobody hands you a map. Here\'s yours.',
  what:'This step is building a simple, sustainable rhythm of reading the Bible for yourself — and learning to hear God through it, not just get through it.',
  understand:[
    'Where to start matters. Most guides point new believers to the Gospel of John first — it was written so "that you may believe" (John 20:31). Then Mark (fast-moving), then Acts (what happened next), then Psalms alongside everything (the Bible\'s prayer book). Genesis-to-Revelation cover-to-cover can wait; you don\'t start a library in the reference section.',
    'How you read matters more than how much. Try three questions on any passage: What does this say? What does it show me about God? What do I do with it today? Ten verses with those questions beats three chapters skimmed.',
    'Jesus called Scripture bread (Matthew 4:4) — daily food, not occasional dessert. Some days it will read like fire. Some days it will feel like eating cardboard. Eat anyway; nourishment doesn\'t depend on your appetite. The streak you\'re building here isn\'t a game score — it\'s a survival skill.'
  ],
  verses:[
    { ref:'Psalm 119:105', text:'Your word is a lamp for my feet, a light on my path.' },
    { ref:'Matthew 4:4', text:'Man shall not live on bread alone, but on every word that comes from the mouth of God.' },
    { ref:'2 Timothy 3:16', text:'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.' }
  ],
  step:{
    title:'Start a reading plan and finish week one',
    how:'Open Reading Plans and start one built for beginners (a Gospel of John plan is perfect). Read every day for seven days — even if some days are two minutes. Highlight one verse each day that lands, and save your favorite.'
  },
  markers:[
    'You have a plan and a daily-ish rhythm — imperfect but alive.',
    'A verse has followed you into your day and changed how you handled something.',
    'You\'re starting to ask "what does this show me about God?" on your own.'
  ],
  tools:[
    { icon:'📚', label:'Reading Plans', route:'plans' },
    { icon:'📖', label:'Bible + study tools', route:'bible' },
    { icon:'🧠', label:'Scripture Memory', route:'memory' },
    { icon:'🗺️', label:'Bible Timeline & Lands', route:'timeline' }
  ],
  reflect:'What\'s your realistic daily Bible moment — morning, lunch, before bed? Name the time and place; vague plans die young.',
  pray:'God, as I open this book, open me. Give me an appetite for Your Word that grows the more I eat. Amen.',
  human:'Reading with someone doubles your staying power. Invite one friend or family member to do the same 7-day plan and compare highlights.'
},
{
  id:'church', chapter:'first-steps', order:8, icon:'⛪',
  name:'Finding Your Church Family', tagline:'Faith was never meant to be solo.',
  pastorReview:true,
  welcome:'An ember alone goes cold. An ember in the fire glows for hours. You need the fire — and the fire needs you.',
  what:'This step is finding, joining, and actually belonging to a local church — real people who will know your name, celebrate your wins, catch you when you fall, and give you a place to serve.',
  understand:[
    'The New Testament doesn\'t know anything about a solo Christian. Its letters were written to churches; its "one another" commands (love one another, encourage one another, carry one another\'s burdens) are literally impossible alone. "Not giving up meeting together" (Hebrews 10:25) was the instruction when meeting was dangerous — it\'s still the instruction now that it\'s merely inconvenient.',
    'What to look for: a church that teaches the Bible like it\'s true, exalts Jesus, and feels like a family you could be honest in. What not to look for: a perfect church. There isn\'t one — and if there were, we\'d ruin it by joining. You\'re looking for real, not flawless.',
    'And the door into belonging is smaller than Sunday: it\'s usually a small group, a youth night, a serving team. Rows make attenders; circles make family. If you have a church already, this station is about going deeper in, not shopping around.'
  ],
  verses:[
    { ref:'Hebrews 10:24-25', text:'Let us consider how we may spur one another on toward love and good deeds, not giving up meeting together... but encouraging one another.' },
    { ref:'Psalm 92:13', text:'Planted in the house of the LORD, they will flourish in the courts of our God.' },
    { ref:'1 Corinthians 12:27', text:'Now you are the body of Christ, and each one of you is a part of it.' }
  ],
  step:{
    title:'Show up twice, join once',
    how:'Attend a church two weeks in a row (two visits tells you what one can\'t). Then take one belonging step: join a small group, a youth or young-adult night, or introduce yourself to a pastor. Log your church in your Faith Journey profile.'
  },
  markers:[
    'There\'s a church where people know your name and notice when you\'re gone.',
    'You\'re in a circle, not just a row — a group where honesty is possible.',
    'Sunday has started to feel like going home, not attending an event.'
  ],
  tools:[
    { icon:'✝️', label:'Christian Traditions explorer', route:'denominations' },
    { icon:'📝', label:'Sermon Notes', route:'sermons' },
    { icon:'📔', label:'Faith Journey profile (my church)', route:'journey' }
  ],
  reflect:'What has kept you on the edge of belonging — schedule, shyness, a past hurt? Name it, and decide what one step past it looks like.',
  pray:'Father, plant me. Give me a church family to grow with, be honest with, and serve beside. And make me the kind of member I hope to find. Amen.',
  human:'This whole station is humans. If church has ever hurt you, tell a trusted believer that story before you try again — wounds heal faster in the light.'
},

/* ── CHAPTER 3 · GROWING DEEP ────────────────────────────── */
{
  id:'spirit', chapter:'growing-deep', order:9, icon:'🔥',
  name:'Walking in the Spirit', tagline:'You were never meant to do this alone — and you don\'t have to.',
  pastorReview:true,
  welcome:'Here\'s news that changes everything: the Christian life isn\'t you trying hard for God. It\'s God, living in you.',
  what:'When you received Christ, the Holy Spirit — God Himself — came to live in you. This step is learning to notice Him, listen to Him, and let Him produce in you what willpower never could.',
  understand:[
    'Jesus told His friends it was actually better for them that He go, because the Helper would come (John 16:7). Not a force, not a feeling — a Person: He teaches, guides, comforts, convicts, reminds you of truth in the exact moment you need it.',
    'The Spirit\'s job description in you is fruit: "love, joy, peace, patience, kindness, goodness, faithfulness, gentleness and self-control" (Galatians 5:22-23). Notice it\'s fruit, not achievements. Fruit grows on connected branches — "apart from me you can do nothing" (John 15:5). Your job is staying connected; growth is His department.',
    'Practically, walking in the Spirit looks like small mid-moment prayers: "Spirit, what do You want here?" before the reaction, the reply, the decision. Christians in different churches describe the Spirit\'s gifts and power in different ways — that conversation is worth having with your own pastor. What every tradition agrees on: He is in you, He is for you, and He finishes what He starts.'
  ],
  verses:[
    { ref:'Galatians 5:25', text:'Since we live by the Spirit, let us keep in step with the Spirit.' },
    { ref:'John 14:26', text:'The Advocate, the Holy Spirit, whom the Father will send in my name, will teach you all things.' },
    { ref:'Romans 8:11', text:'The Spirit of him who raised Jesus from the dead is living in you.' }
  ],
  step:{
    title:'Practice one week of "keep in step" prayers',
    how:'For seven days, pray one sentence at three hinge moments — waking up ("Spirit, lead me today"), one hard moment ("Spirit, what do You want here?"), and bedtime ("What were You showing me today?"). Journal what you notice. It will be more than you expect.'
  },
  markers:[
    'You\'ve started asking the Spirit\'s input mid-moment, not just in emergencies.',
    'Someone has noticed fruit in you — more patience, more peace — before you announced it.',
    'Conviction has started to feel like a Father\'s hand on your shoulder, not a siren.'
  ],
  tools:[
    { icon:'🎧', label:'Audio meditations & worship', route:'audio' },
    { icon:'💗', label:'Heart Check', route:'heartcheck' },
    { icon:'🎓', label:'Faith Academy: the Holy Spirit', route:'academy' }
  ],
  reflect:'Which fruit of the Spirit is most missing in your life right now? Ask Him — not willpower — to grow it.',
  pray:'Holy Spirit, I don\'t want to walk ahead of You or drag behind You. Teach me Your pace. Fill me and lead me. Amen.',
  human:'Ask your pastor or a mature believer: "How do you recognize the Holy Spirit\'s leading?" Their stories will train your ears.'
},
{
  id:'freedom', chapter:'growing-deep', order:10, icon:'🕊️',
  name:'Freedom & Wholeness', tagline:'A gentle door. Open it whenever you\'re ready.',
  pastorReview:true, gentle:true,
  welcome:'This station is different. Nothing here is required, tracked, or shown to anyone. It\'s a quiet room with a kind light on.',
  what:'Everyone carries something — a habit that owns them a little, a wound that still talks, shame that lies about who they are. Jesus said He came "to proclaim freedom" (Luke 4:18). This step is simply deciding to walk toward that freedom instead of hiding.',
  understand:[
    'First, the ground rules of grace: you are not behind, you are not disqualified, and you are not the only one. "There is now no condemnation for those who are in Christ Jesus" (Romans 8:1) — that verse was written for exactly the thing you just thought of.',
    'Freedom in Christ usually isn\'t a lightning bolt (though sometimes it is). More often it\'s a walk: honesty with God, honesty with one safe person, new habits replacing old hiding places, and time. "Confess your sins to each other and pray for each other so that you may be healed" (James 5:16) — notice healing lives next to telling someone.',
    'This is also the station where an app must be honest about being an app. If what you carry involves addiction, self-harm, abuse, or a weight that feels bigger than you — you deserve a real person: a pastor, a counselor, a recovery group, a trusted adult. Reaching for human help isn\'t weak faith. It is exactly what faith does.'
  ],
  verses:[
    { ref:'John 8:36', text:'So if the Son sets you free, you will be free indeed.' },
    { ref:'Psalm 34:18', text:'The LORD is close to the brokenhearted and saves those who are crushed in spirit.' },
    { ref:'James 5:16', text:'Confess your sins to each other and pray for each other so that you may be healed.' }
  ],
  step:{
    title:'Name it to God — and to one safe person',
    how:'Privately, in your journal or out loud, name the one area where you want freedom. That\'s the whole app step — no checkboxes, no lists, nothing stored for anyone to see. Then take the real step: tell one safe human. A pastor, a counselor, a parent, a mentor. Freedom grows at the speed of honesty.'
  },
  markers:[
    'You\'ve stopped pretending to God about it (He wasn\'t fooled, but you\'re freer).',
    'One safe person knows and is walking with you.',
    'You\'re measuring direction, not perfection — and the direction is toward the light.'
  ],
  tools:[
    { icon:'💗', label:'Heart Check', route:'heartcheck' },
    { icon:'🙏', label:'Prayer space', route:'prayer' },
    { icon:'🎧', label:'Peace & anxiety meditations', route:'audio' }
  ],
  reflect:'What would you do differently this month if you truly believed Romans 8:1 applied to you? (It does.)',
  pray:'Jesus, You know the thing. I\'m done hiding it from You. Set me free — and give me the courage to let one person help. Amen.',
  human:'This step runs on real help, not app features. Pastor, Christian counselor, recovery group, trusted adult — pick one and reach out this week. If you\'re carrying something heavy or unsafe, please don\'t wait: talk to someone you trust today.'
},
{
  id:'discipleship', chapter:'growing-deep', order:11, icon:'🌳',
  name:'Discipleship', tagline:'Training your roots to go deep.',
  pastorReview:true,
  welcome:'A disciple is just a lifelong student of Jesus. This station is where habits become roots.',
  what:'Discipleship is deliberately building the practices that form you into Christ\'s likeness over years, not weeks: Scripture, prayer, worship, generosity, rest, community — done consistently enough that they change who you are.',
  understand:[
    'Jesus ended His most famous sermon with a builder\'s choice: hear these words and do them, and you\'re a house on rock; hear and don\'t, and you\'re a house on sand (Matthew 7:24-27). Same storm hits both houses. The foundations decide the ending. Spiritual disciplines are how you pour foundation before the storm.',
    'Paul told a young believer: "Train yourself to be godly" (1 Timothy 4:7). Train — an athlete\'s word. Nobody accidentally runs a marathon, and nobody accidentally becomes deeply like Jesus. But here\'s the paradox of grace: the training doesn\'t earn God\'s love (you have all of it already). It positions you where His love can shape you.',
    'Character is the scoreboard, not activity. The point of reading, praying, and serving is becoming more honest, more patient, harder to offend, quicker to forgive. If your disciplines grow and your kindness doesn\'t, recheck the disciplines. Generosity belongs here too — money, time, attention. It\'s the discipline that most reliably breaks selfishness\'s grip.'
  ],
  verses:[
    { ref:'1 Timothy 4:7-8', text:'Train yourself to be godly. For physical training is of some value, but godliness has value for all things.' },
    { ref:'Matthew 7:24', text:'Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock.' },
    { ref:'Colossians 2:6-7', text:'Just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him.' }
  ],
  step:{
    title:'Build your Rule of Life — 3 anchor habits',
    how:'Choose three keystone practices with real times attached — e.g., Scripture at breakfast, prayer on the drive, church every Sunday, giving on the 1st. Add them as tracked habits and hold them for 30 days. Small and unbreakable beats big and abandoned.'
  },
  markers:[
    'Your three anchors have survived 30 days — including days you didn\'t feel like it.',
    'Someone close to you could name a way you\'ve changed this year.',
    'Missing a practice now feels like missing a meal — you notice the hunger.'
  ],
  tools:[
    { icon:'📿', label:'Faith disciplines tracker', route:'disciplines' },
    { icon:'🎓', label:'Faith Academy (30 lessons)', route:'academy' },
    { icon:'🧠', label:'Scripture Memory', route:'memory' },
    { icon:'📝', label:'Sermon Notes', route:'sermons' }
  ],
  reflect:'Fast-forward ten years of your current habits. Who do they build? Now design the habits that build who you actually want to become.',
  pray:'Lord, make me a lifelong student. Build my house on rock — one unglamorous, faithful day at a time. Amen.',
  human:'Every athlete has a coach. Ask a mature believer to mentor you — even one coffee a month. "I want to grow; will you check on me?" is a sentence that changes trajectories.'
},

/* ── CHAPTER 4 · LIVING IT OUT ───────────────────────────── */
{
  id:'serving', chapter:'living-out', order:12, icon:'🤝',
  name:'Serving Others', tagline:'Love with its sleeves rolled up.',
  pastorReview:true,
  welcome:'Everything you\'ve received now becomes something you give. This is where faith gets visible.',
  what:'Serving is deliberately using your time, hands, and gifts for other people\'s good — in your church, your home, and your everyday world — because that\'s what Jesus did with His.',
  understand:[
    'Jesus defined greatness upside down: "whoever wants to become great among you must be your servant... For even the Son of Man did not come to be served, but to serve" (Mark 10:43-45). The night before the cross, God incarnate picked up a towel and washed feet. That towel is the family crest.',
    'You have gifts — actual God-given wiring — "to serve others, as faithful stewards of God\'s grace" (1 Peter 4:10). Some people come alive helping with tech, some with kids, some with setup crews, music, meals, listening. You find your gifts the same way you find your position on a team: by playing. Try things.',
    'And don\'t romanticize it into something distant. Serving starts closer than a mission trip: the dishes nobody asked you to do, the new kid nobody sits with, the younger sibling with homework. "Whatever you did for one of the least of these... you did for me" (Matthew 25:40). Small, unseen, uncelebrated — that\'s often exactly where Jesus says He was standing.'
  ],
  verses:[
    { ref:'Mark 10:45', text:'For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.' },
    { ref:'1 Peter 4:10', text:'Each of you should use whatever gift you have received to serve others.' },
    { ref:'Galatians 5:13', text:'Serve one another humbly in love.' }
  ],
  step:{
    title:'Join one team, do one hidden act',
    how:'Two moves this month. Public: join one serving team at your church (ask a leader "where do you need help?" — they will have an answer). Hidden: do one act of service nobody will ever find out about. The hidden one trains your heart; the public one trains your hands.'
  },
  markers:[
    'You have a regular serving spot where people count on you.',
    'You\'ve served at least once with zero credit — and it felt strangely rich.',
    'You\'re starting to walk into rooms asking "who needs help?" instead of "who sees me?"'
  ],
  tools:[
    { icon:'📔', label:'Log serving milestones', route:'journey' },
    { icon:'💛', label:'Giving tracker', route:'giving' },
    { icon:'⛪', label:'Your church connection', route:'church' }
  ],
  reflect:'What work makes you lose track of time? That\'s a clue to your gifting. How could that exact thing serve someone this week?',
  pray:'Jesus, You took the towel. Hand it to me. Open my eyes to the need right in front of me — starting at home. Amen.',
  human:'Ask a ministry leader at your church: "What\'s the least glamorous job you need filled?" Take it for a month. It\'s the fastest servant-heart bootcamp there is.'
},
{
  id:'disciples', chapter:'living-out', order:13, icon:'🌍',
  name:'Making Disciples', tagline:'Helping someone else begin their walk.',
  pastorReview:true,
  welcome:'Someone lit your candle. This station is where you light the next one.',
  what:'Making disciples is Jesus\'s final instruction to His people: share your faith naturally, and walk with newer believers the way someone walked with you. Not a job for professionals — a lifestyle for the family.',
  understand:[
    'The Great Commission — "go and make disciples of all nations" (Matthew 28:19) — wasn\'t addressed to a stage. It was given to fishermen, ex-tax collectors, and doubters on a hillside. The qualification is not a theology degree; it\'s "come and see what I found." The healed blind man\'s entire training was one sentence: "One thing I do know. I was blind but now I see!" (John 9:25). Your story is your credential.',
    'Sharing usually isn\'t a speech — it\'s a friendship with the lights on. Pray for three people by name. Live honestly in front of them. Invite them into something (church, this app, a conversation). Answer what they ask, and when you don\'t know, say "great question — let\'s find out" (1 Peter 3:15 says give answers with gentleness and respect; the gentleness is half the answer).',
    'Then comes the deeper joy: when someone says yes, walk with them. Show them this path from station one. Read with them. Pray with them. Paul\'s method was a relay: "the things you have heard me say... entrust to reliable people who will also be qualified to teach others" (2 Timothy 2:2). Four generations in one verse. You\'re a link in that chain right now — because someone was that link for you.'
  ],
  verses:[
    { ref:'Matthew 28:19-20', text:'Therefore go and make disciples of all nations... And surely I am with you always, to the very end of the age.' },
    { ref:'1 Peter 3:15', text:'Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect.' },
    { ref:'2 Timothy 2:2', text:'The things you have heard me say... entrust to reliable people who will also be qualified to teach others.' }
  ],
  step:{
    title:'Pray for 3, share with 1',
    how:'Write down three people you care about who don\'t know Jesus. Pray for them daily for two weeks. Then take one natural step with one of them: share a bit of your story, invite them to church or youth group, or send them something from this app that helped you. Plant; God grows.'
  },
  markers:[
    'Three names are on your list and in your daily prayers.',
    'You\'ve shared some of your story out loud — imperfectly counts.',
    'You\'ve begun walking alongside someone newer in faith than you.'
  ],
  tools:[
    { icon:'💬', label:'Share a prayer or verse', route:'prayer' },
    { icon:'🃏', label:'Convince Me (great to share)', route:'convince' },
    { icon:'📔', label:'Your story (Faith Journey)', route:'journey' }
  ],
  reflect:'Write your 2-minute story: what you were like, what happened, what\'s different now. Practice it until it sounds like you.',
  pray:'Lord, give me eyes for the three people You\'re already pursuing. Make me brave, natural, and kind — and do what only You can do. Amen.',
  human:'Making disciples is a with-people calling by definition. Tell a leader at church "I want to learn to share my faith" — many churches will train and pair you.'
}
];

/* ── THE HORIZON — never completable (spec §2) ───────────── */
const WALK_HORIZON = {
  id:'becoming', icon:'✨',
  name:'Becoming Like Christ',
  tagline:'The goal that\'s never "complete" — always shining ahead.',
  welcome:'This isn\'t a station you finish. It\'s the light the whole path walks toward.',
  what:'Every step behind you — and every step still ahead — points at one destination: being formed into the likeness of Jesus. "We all... are being transformed into his image with ever-increasing glory" (2 Corinthians 3:18). Being transformed. Present tense. Always.',
  verses:[
    { ref:'Philippians 1:6', text:'He who began a good work in you will carry it on to completion until the day of Christ Jesus.' },
    { ref:'2 Corinthians 3:18', text:'We all... are being transformed into his image with ever-increasing glory.' },
    { ref:'1 John 3:2', text:'When Christ appears, we shall be like him, for we shall see him as he is.' }
  ],
  pray:'Jesus, keep making me like You — a little more every year, until the day I see You face to face. Amen.'
};

/* ── WEEKLY QUESTS — Duolingo-style contests (W2) ─────────
   3 quests per week, rotated by ISO week number. Each quest:
   id, icon, title, desc, target (count), metric key tracked in
   D.walk.questProg, xp reward. Grace-first: quests reset weekly
   with zero penalty — a fresh board, never a failure notice.   */
const WALK_QUESTS_POOL = [
  { id:'q-devotion3',  icon:'🕊️', title:'Quiet Time ×3',      desc:'Complete 3 devotionals this week',            metric:'devotional', target:3, xp:30 },
  { id:'q-prayer5',    icon:'🙏', title:'Faithful in Prayer',  desc:'Pray or journal a prayer 5 days this week',   metric:'prayer',     target:5, xp:40 },
  { id:'q-verse1',     icon:'🧠', title:'Hide the Word',       desc:'Master 1 new memory verse',                   metric:'verse',      target:1, xp:25 },
  { id:'q-read4',      icon:'📖', title:'Rooted Reader',       desc:'Read your plan 4 days this week',             metric:'reading',    target:4, xp:35 },
  { id:'q-station1',   icon:'👣', title:'Take a Step',         desc:'Complete 1 station on your Walk',             metric:'station',    target:1, xp:50 },
  { id:'q-kindness3',  icon:'🤝', title:'Hands & Feet',        desc:'Do 3 real-life acts of kindness',             metric:'kindness',   target:3, xp:30 },
  { id:'q-worship2',   icon:'🎧', title:'Soak & Worship',      desc:'Listen to 2 worship or meditation sessions',  metric:'audio',      target:2, xp:20 },
  { id:'q-share1',     icon:'💬', title:'Pass the Light',      desc:'Share 1 verse or prayer with someone',        metric:'share',      target:1, xp:25 },
  { id:'q-academy2',   icon:'🎓', title:'Student of the Way',  desc:'Finish 2 Faith Academy lessons',              metric:'academy',    target:2, xp:30 },
  { id:'q-gratitude4', icon:'💛', title:'Count the Gifts',     desc:'Log gratitude or praise 4 days this week',    metric:'gratitude',  target:4, xp:30 },
  { id:'q-streak7',    icon:'🔥', title:'Seven Alive',         desc:'Open your Walk 7 days in a row',              metric:'visit',      target:7, xp:45 },
  { id:'q-reflect2',   icon:'📔', title:'Look Inward',         desc:'Write 2 station reflections',                 metric:'reflect',    target:2, xp:25 }
];

// Expose globally (project convention: no modules)
window.WALK_CHAPTERS    = WALK_CHAPTERS;
window.WALK_STATIONS    = WALK_STATIONS;
window.WALK_HORIZON     = WALK_HORIZON;
window.WALK_QUESTS_POOL = WALK_QUESTS_POOL;
