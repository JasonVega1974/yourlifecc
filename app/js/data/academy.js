/* =============================================================
   academy.js — Faith Academy curriculum (F2-I full)
   5 modules · 18 courses · ~85 lessons · 18 quizzes · 6 badges
   per spec §4.11.

   Lesson body uses HTML so existing modal renders it correctly. Quiz
   per-question feedback shows ✅/❌ + the correct answer + explanation
   regardless of user choice (Roady's Training fix pattern).
============================================================= */

const FAITH_ACADEMY_CURRICULUM = [
  // ════════════════════════════════════════════════════════════
  // MODULE 1 — Foundations of Faith
  // ════════════════════════════════════════════════════════════
  {
    id: 'foundations',
    title: 'Foundations of Faith',
    icon: '⭐',
    color: '#a78bfa',
    description: 'Who God is, who Jesus is, what the gospel is, and why it all matters.',
    badgeId: 'faith-foundations',
    badgeLabel: 'Faith Foundations',
    badgeIcon: '⭐',
    courses: [
      {
        id: 'who-is-god',
        title: 'Who is God?',
        description: 'God\'s character, the Trinity, and why it matters that He is who He says He is.',
        lessons: [
          {
            id: 'who-is-god-1',
            title: 'God Exists and Has Spoken',
            duration: '5 min',
            body: `<h4>Not a Force, a Person</h4><p>The Bible doesn\'t open by arguing for God\'s existence — it assumes it. "In the beginning, God created the heavens and the earth" (Genesis 1:1). Christianity claims something much stranger than "there is a higher power": it claims that the Creator of the universe is a personal being who has chosen to speak.</p><h4>Why That Matters</h4><p>If God is just a force, your job is to align with it. If God is a person, your job is to know Him. Every page of Scripture is the second kind — God revealing Himself, not waiting to be discovered. That changes the question from "What is the meaning of life?" to "Who is the One who made me, and what does He want me to know?"</p>`,
            scriptureRefs: ['Genesis 1:1', 'Hebrews 1:1-2', 'Psalm 19:1-4'],
            reflectionPrompt: 'If God speaks, what does that change about how you approach the Bible?'
          },
          {
            id: 'who-is-god-2',
            title: 'God\'s Character — Holy, Just, Loving',
            duration: '6 min',
            body: `<h4>Three Words That Hold</h4><p>The Bible doesn\'t pick one attribute and reduce God to it. He is <b>holy</b> (set apart, pure, perfect), <b>just</b> (right in every action), and <b>loving</b> (committed to the good of others). The miracle of the gospel is that all three are true at once and never contradict.</p><h4>Why It Costs Something</h4><p>If God were only loving, sin wouldn\'t matter. If He were only just, none of us would survive. The cross is where holy + just + loving meet — Jesus absorbing what justice demanded so love could give what holiness required.</p>`,
            scriptureRefs: ['Isaiah 6:3', 'Psalm 145:17', '1 John 4:8', 'Romans 3:26'],
            reflectionPrompt: 'Which attribute of God do you most readily believe? Which is hardest?'
          },
          {
            id: 'who-is-god-3',
            title: 'The Trinity — One God, Three Persons',
            duration: '7 min',
            body: `<h4>The Hardest Doctrine to Get and the One That Holds Everything</h4><p>God is one being who exists eternally as three persons: Father, Son, and Holy Spirit. Not three gods. Not one God wearing three masks. One in essence, three in person.</p><h4>How We Know</h4><p>The Bible insists on both: <i>"Hear, O Israel: The LORD our God, the LORD is one"</i> (Deuteronomy 6:4) AND Jesus is called God, the Spirit is called God, and the Father is God. The early church didn\'t invent this — they were forced to articulate it because it\'s what Scripture teaches.</p><h4>Why It Matters</h4><p>Love is eternal because God is eternally three persons loving each other. You weren\'t made by an isolated being who needed company — you were made by a community of love that already had everything and wanted to share it.</p>`,
            scriptureRefs: ['Deuteronomy 6:4', 'Matthew 28:19', 'John 1:1-3', '2 Corinthians 13:14'],
            reflectionPrompt: 'How does the Trinity change your picture of God\'s love?'
          },
          {
            id: 'who-is-god-4',
            title: 'God Is Sovereign',
            duration: '5 min',
            body: `<h4>The King Who Doesn\'t Sleep</h4><p>Sovereign means in charge — fully, finally, always. The Bible never describes God as worried, surprised, or backed into a corner. <i>"Whatever the LORD pleases, he does, in heaven and on earth"</i> (Psalm 135:6).</p><h4>The Mystery</h4><p>Sovereignty doesn\'t cancel human responsibility. Both run through Scripture. Joseph\'s brothers meant evil; God meant it for good (Genesis 50:20). Pilate ordered the crucifixion; it was God\'s plan to save the world (Acts 4:27-28). We don\'t fully resolve the tension — we live in it.</p><h4>The Comfort</h4><p>If God is sovereign, your worst day is not outside His care. Romans 8:28 isn\'t a slogan — it\'s the logical consequence of who He is.</p>`,
            scriptureRefs: ['Psalm 135:6', 'Romans 8:28', 'Genesis 50:20', 'Proverbs 21:1'],
            reflectionPrompt: 'Where do you most need to remember that God is in charge?'
          },
          {
            id: 'who-is-god-5',
            title: 'God Is Near',
            duration: '4 min',
            body: `<h4>Not Distant</h4><p>Many religions teach a remote God. The Bible teaches the opposite: <i>"The LORD is near to all who call on him, to all who call on him in truth"</i> (Psalm 145:18). Jesus made it visible — God didn\'t send a memo, He came in person.</p><h4>Available to You Now</h4><p>Through the Holy Spirit, God lives inside every Christian. You don\'t schedule an appointment to talk to Him. The whisper of your worst anxiety at 2 a.m. — He hears that. The unspoken thank-you when something goes right — He receives that. He\'s not distant. He\'s here.</p>`,
            scriptureRefs: ['Psalm 145:18', 'Matthew 1:23', 'James 4:8', 'Romans 8:11'],
            reflectionPrompt: 'When did you last sense God\'s nearness? When did He feel far?'
          },
        ],
        quiz: {
          id: 'who-is-god-quiz',
          passThreshold: 0.8,
          questions: [
            { q: 'Which best summarizes the Bible\'s opening claim about God?', options: ['God is a force everyone can sense', 'God exists and has chosen to speak to us', 'God hides Himself from humanity', 'God evolves alongside human ideas'], correctIdx: 1, explanation: 'Genesis 1:1 assumes God\'s existence and the rest of Scripture is Him revealing Himself. Christianity is built on a personal, speaking God — not a discovered force.' },
            { q: 'The Trinity teaches that God is…', options: ['Three separate gods', 'One God appearing in three forms', 'One God eternally existing as three persons', 'A Father with two adopted sons'], correctIdx: 2, explanation: 'One being, three persons — Father, Son, and Spirit. Not three gods (tritheism) and not one God wearing different masks (modalism).' },
            { q: 'What is unique about the cross in showing God\'s character?', options: ['It cancels God\'s justice', 'It puts holiness, justice, and love together at once', 'It proves love beats holiness', 'It shows only love'], correctIdx: 1, explanation: 'The cross is where holy, just, and loving meet — Jesus absorbing justice so love could give what holiness required.' },
            { q: 'Sovereignty means…', options: ['God controls everything but gets surprised sometimes', 'God is in charge fully and finally', 'God only intervenes in big events', 'God lets fate decide'], correctIdx: 1, explanation: 'Psalm 135:6 — "Whatever the LORD pleases, he does." Fully, finally, always. Even in the cross, both human responsibility and divine plan held together.' },
            { q: 'The Bible\'s teaching on God\'s nearness is best captured by…', options: ['He watches from a distance', 'He waits for us to climb up to Him', 'He came near in Jesus and lives in believers by His Spirit', 'He visits occasionally'], correctIdx: 2, explanation: 'Matthew 1:23 — "Immanuel, God with us." Through the Spirit, God lives inside believers. Not distant. Here.' },
          ]
        }
      },
      {
        id: 'who-is-jesus',
        title: 'Who is Jesus?',
        description: 'His identity, His claims, His death, His resurrection.',
        lessons: [
          { id: 'who-is-jesus-1', title: 'Jesus Claimed to Be God', duration: '6 min', body: `<h4>Not Just a Teacher</h4><p>Jesus claimed to be the Son of God in the unique sense — God in human form. In John 14:6 he said, <i>"I am the way and the truth and the life."</i> In John 10:30, <i>"I and the Father are one."</i> When he said <i>"Before Abraham was, I AM"</i> (John 8:58), the crowd picked up stones because they understood: he was using God\'s covenant name from Exodus 3:14.</p><h4>Liar, Lunatic, or Lord</h4><p>C.S. Lewis put it bluntly: Jesus was a liar (he knew he wasn\'t God), a lunatic (he sincerely thought he was but wasn\'t), or he was telling the truth. Nice teachers don\'t claim to be God. So the polite "He was a great moral example" position doesn\'t survive contact with the Gospels.</p>`, scriptureRefs: ['John 14:6', 'John 10:30', 'John 8:58', 'Exodus 3:14'], reflectionPrompt: 'Which option (liar, lunatic, Lord) have you been quietly believing about Jesus?' },
          { id: 'who-is-jesus-2', title: 'Fully God and Fully Human', duration: '5 min', body: `<h4>Both, Not Half-and-Half</h4><p>Christianity teaches that Jesus was 100% God AND 100% human — not 50/50, not God in a costume, not a man who became divine. Born of a virgin, lived a real human life with real hunger and fatigue, and was the eternal Son of God all along.</p><h4>Why Both Matter</h4><p>If Jesus weren\'t fully human, he couldn\'t represent us. If he weren\'t fully God, his death wouldn\'t be enough. Both/and is the only combination that lets the cross actually save anyone.</p>`, scriptureRefs: ['John 1:14', 'Hebrews 4:15', 'Philippians 2:6-8'], reflectionPrompt: 'Does it bring you closer to Jesus or push you away to think He fully experienced what you experience?' },
          { id: 'who-is-jesus-3', title: 'Why He Came', duration: '5 min', body: `<h4>The Mission Statement</h4><p><i>"For the Son of Man came to seek and to save the lost"</i> (Luke 19:10). He didn\'t come to make moral people more moral. He came to rescue people who couldn\'t rescue themselves. That\'s a different category — a doctor, not a coach.</p><h4>What He Came To Do</h4><p>Live the perfect life we couldn\'t live. Die the death we deserved. Rise to give us a life we don\'t deserve. That\'s the gospel in one sentence, and it\'s why Christmas, Good Friday, and Easter all hang together.</p>`, scriptureRefs: ['Luke 19:10', 'Mark 10:45', '1 John 4:9-10'], reflectionPrompt: 'Where in your life do you most need a rescuer rather than a coach?' },
          { id: 'who-is-jesus-4', title: 'The Cross', duration: '7 min', body: `<h4>Not a Tragic Accident</h4><p>The cross wasn\'t Plan B. Isaiah 53 predicted it 700 years before. Jesus told his disciples it was coming. He chose it.</p><h4>What Happened There</h4><p>Sin separates us from a holy God. Justice demands a price. Jesus paid that price himself — not because we deserved it, but because he loved us. <i>"For God so loved the world that he gave his one and only Son"</i> (John 3:16). The cross is where God\'s holiness and God\'s love refuse to cancel each other out.</p><h4>What It Means For You</h4><p>You don\'t earn God\'s love. You receive it. The price is already paid. Your job is to trust the One who paid it.</p>`, scriptureRefs: ['Isaiah 53:5', 'John 3:16', 'Romans 5:8', '1 Peter 2:24'], reflectionPrompt: 'What sin or guilt are you trying to pay for yourself that Jesus has already covered?' },
          { id: 'who-is-jesus-5', title: 'The Resurrection — The Hinge of History', duration: '6 min', body: `<h4>If This Didn\'t Happen, Christianity Is Bankrupt</h4><p>Paul wrote, <i>"If Christ has not been raised, your faith is futile"</i> (1 Corinthians 15:17). He didn\'t soft-pedal it. Christianity is built on a single empirical claim: a man named Jesus was dead, and three days later he was alive again — physically, in a body, eating breakfast with his friends.</p><h4>The Evidence</h4><p>The tomb was empty (even his enemies admitted this). Over 500 people saw him alive (1 Corinthians 15:6). His disciples went from hiding to dying for their testimony — people don\'t die for what they know is a lie.</p><h4>What It Means</h4><p>Death is not the final word. The same power that raised Jesus is available to you. Your future is not "everyone dies and that\'s it." Your future is "the One who walked out of the grave is making everything new."</p>`, scriptureRefs: ['1 Corinthians 15:3-8', 'Romans 1:4', 'Matthew 28:1-10', '1 Corinthians 15:17'], reflectionPrompt: 'If the resurrection is real, what fear in your life loses its grip today?' },
          { id: 'who-is-jesus-6', title: 'Jesus Is Coming Back', duration: '4 min', body: `<h4>The Story Isn\'t Over</h4><p>Jesus ascended to the Father, but he\'s coming back. <i>"This same Jesus, who has been taken from you into heaven, will come back in the same way"</i> (Acts 1:11). The Christian story has four acts: creation, fall, redemption, restoration. We\'re between acts three and four.</p><h4>Why That Changes Today</h4><p>If Jesus is coming back to make everything right, then injustice today is real but temporary. Suffering today is real but not the last word. Every "this isn\'t how it should be" you feel is a foretaste of the day He says, <i>"Behold, I am making all things new"</i> (Revelation 21:5).</p>`, scriptureRefs: ['Acts 1:11', 'Revelation 21:5', '2 Peter 3:13', 'Matthew 24:30'], reflectionPrompt: 'What broken thing in your life or world do you most long for Jesus to return and fix?' },
        ],
        quiz: {
          id: 'who-is-jesus-quiz',
          passThreshold: 0.8,
          questions: [
            { q: 'When Jesus said "Before Abraham was, I am" (John 8:58), what was He claiming?', options: ['He was older than Abraham', 'He was God Himself, using the divine name from Exodus 3:14', 'He had time-traveled', 'He had been a prophet'], correctIdx: 1, explanation: '"I am" (Greek: ego eimi) directly invokes God\'s name from Exodus 3:14. The crowd understood it as a divinity claim — they tried to stone Him in the next verse.' },
            { q: 'Christianity teaches that Jesus was…', options: ['Half God, half man', 'Fully God and fully human', 'A great moral teacher who became divine', 'God wearing a human costume'], correctIdx: 1, explanation: 'Both/and. If He weren\'t fully human, He couldn\'t represent us. If He weren\'t fully God, His death couldn\'t pay for sin. Both are required for the gospel to work.' },
            { q: 'C.S. Lewis\'s "Liar, Lunatic, or Lord" argument means…', options: ['Jesus is just a moral example', 'Jesus must be one of those three — "great teacher" isn\'t an option', 'Jesus is mostly a myth', 'All three are equally likely'], correctIdx: 1, explanation: 'Given Jesus\'s claims to be God, the polite "great moral teacher" position isn\'t available. He was lying, deluded, or telling the truth.' },
            { q: 'According to 1 Corinthians 15:17, the resurrection is…', options: ['A nice metaphor', 'The hinge — without it, faith is futile', 'Optional for Christians', 'Symbolic of moral renewal'], correctIdx: 1, explanation: 'Paul stakes everything on it. If the resurrection didn\'t happen, Christianity collapses. It\'s a historical claim, not a metaphor.' },
            { q: 'The Christian story\'s four acts are…', options: ['Creation, Law, Sacrifice, Heaven', 'Birth, Life, Death, Resurrection', 'Creation, Fall, Redemption, Restoration', 'Old Testament, Gospels, Letters, Revelation'], correctIdx: 2, explanation: 'Creation (good world) → Fall (sin breaks it) → Redemption (Jesus rescues) → Restoration (Jesus returns and makes all things new). We live in act 3.' },
          ]
        }
      },
      {
        id: 'what-is-gospel',
        title: 'What is the Gospel?',
        description: 'God\'s rescue plan in five lessons.',
        lessons: [
          { id: 'gospel-1', title: 'God Made the World Good', duration: '4 min', body: `<h4>It Wasn\'t Supposed to Be This Way</h4><p>Genesis 1 ends seven times with "and God saw that it was good." Once, it says <i>"very good."</i> The default state of the world is not broken — it\'s blessed. Humans were made in God\'s image to enjoy Him and steward what He made.</p><h4>Why That Matters</h4><p>The gospel only makes sense if the brokenness you feel is unnatural. It\'s not how things were designed. Every "this isn\'t right" instinct is a memory of Eden.</p>`, scriptureRefs: ['Genesis 1:31', 'Genesis 2:7', 'Genesis 1:27'], reflectionPrompt: 'Where in your life do you most feel "this isn\'t how it\'s supposed to be"?' },
          { id: 'gospel-2', title: 'We Broke It', duration: '5 min', body: `<h4>The Crack in Everything</h4><p>Genesis 3: humans chose their own way over God\'s. The Bible calls this sin — not just bad behavior, but a fundamental break in our relationship with God, others, ourselves, and creation. Every funeral, every fight, every mirror you don\'t want to look in — Genesis 3 shows up everywhere.</p><h4>Why You Can\'t Just Fix It</h4><p>"All have sinned and fall short of the glory of God" (Romans 3:23). The wages of sin is death (Romans 6:23). You can be a great person and still need rescue, because the problem isn\'t mostly about behavior — it\'s about a relationship that needs restoring.</p>`, scriptureRefs: ['Genesis 3:1-13', 'Romans 3:23', 'Romans 6:23'], reflectionPrompt: 'What\'s one area where you keep trying to fix yourself and can\'t?' },
          { id: 'gospel-3', title: 'God Came to Get Us', duration: '5 min', body: `<h4>The Astonishing Move</h4><p>God could have left us in our mess. Instead, He came in. <i>"For God so loved the world that he gave his one and only Son"</i> (John 3:16). Jesus lived the perfect life we couldn\'t live, died the death we deserved, and rose to give us a future we couldn\'t earn.</p><h4>Three Words</h4><p><b>Substitution</b> — He took our place. <b>Resurrection</b> — death didn\'t hold Him. <b>Invitation</b> — He says "Follow me," not "Try harder."</p>`, scriptureRefs: ['John 3:16', '2 Corinthians 5:21', 'Romans 5:8'], reflectionPrompt: 'What part of "Jesus took your place" is hardest for you to actually receive?' },
          { id: 'gospel-4', title: 'Faith, Not Earning', duration: '4 min', body: `<h4>The Hardest Part for Religious People</h4><p>Most religion says: behave, then belong. The gospel says: belong, then behave. <i>"For it is by grace you have been saved, through faith — and this not from yourselves, it is the gift of God — not by works"</i> (Ephesians 2:8-9).</p><h4>What Faith Is</h4><p>Faith isn\'t blind belief. It\'s trust based on evidence — like trusting a chair to hold you. You don\'t prove it; you sit in it. You don\'t earn salvation; you receive it.</p>`, scriptureRefs: ['Ephesians 2:8-9', 'Romans 10:9-13', 'Galatians 2:16'], reflectionPrompt: 'Are you trying to behave your way into God\'s love or rest in what He\'s already done?' },
          { id: 'gospel-5', title: 'A New Life', duration: '5 min', body: `<h4>The Result, Not the Cause</h4><p>Following Jesus doesn\'t earn salvation — it\'s the natural response to receiving it. Christianity is "you are loved, therefore live like it," not "live a certain way and maybe earn love."</p><h4>What\'s Different Now</h4><p>You have a new identity (a child of God). A new power (the Holy Spirit). A new community (the church). A new mission (to make God\'s love visible). And a new ending (eternity with Him). The gospel doesn\'t just save you from something — it saves you for something.</p>`, scriptureRefs: ['2 Corinthians 5:17', 'Romans 8:14-17', 'Ephesians 2:10'], reflectionPrompt: 'If you\'re a Christian, what\'s one thing in your life that should change because of who you now are?' },
        ],
        quiz: { id: 'gospel-quiz', passThreshold: 0.8, questions: [
          { q: 'According to Genesis 1, the default state of creation is…', options: ['Broken and falling apart', 'Good and blessed', 'Neutral', 'A test'], correctIdx: 1, explanation: 'Genesis 1 ends 7 times with "it was good," and once with "very good." Brokenness came after Genesis 3, not in the original design.' },
          { q: 'What does the Bible call our chosen independence from God?', options: ['A misunderstanding', 'A learning opportunity', 'Sin — a relational break, not just bad behavior', 'A cultural difference'], correctIdx: 2, explanation: 'Sin is fundamentally a relationship break with God (and the broken behavior follows). That\'s why moral effort alone can\'t fix it.' },
          { q: 'The gospel pattern is…', options: ['Behave, then belong', 'Belong, then behave', 'Earn your way up', 'Stay neutral'], correctIdx: 1, explanation: 'Most religions say behave-then-belong. Christianity flips it — Jesus pays the price; you receive it; transformation follows from belonging, not as a condition for it.' },
          { q: 'According to Ephesians 2:8-9, salvation is…', options: ['Earned by good works', 'A gift received by faith', 'A reward for sincere effort', 'Determined at birth'], correctIdx: 1, explanation: '"By grace you have been saved, through faith — not by works, so that no one can boast." It\'s a gift, not a paycheck.' },
          { q: 'Following Jesus is…', options: ['How you earn salvation', 'Optional for Christians', 'The natural response to receiving salvation', 'A different religion'], correctIdx: 2, explanation: 'You don\'t obey to get saved; you obey because you are saved. Identity drives behavior, not the other way around.' },
        ]}
      },
      {
        id: 'who-is-spirit',
        title: 'Who is the Holy Spirit?',
        description: 'God in you, with you, for you.',
        lessons: [
          { id: 'spirit-1', title: 'The Spirit Is a Person, Not a Force', duration: '4 min', body: `<h4>"He," Not "It"</h4><p>Jesus called the Holy Spirit "another Counselor" (John 14:16) — using a personal pronoun. The Spirit grieves, loves, teaches, intercedes, and leads. He\'s not energy; He\'s a person — the third person of the Trinity, fully God.</p>`, scriptureRefs: ['John 14:16-17', 'Ephesians 4:30', 'Acts 13:2'], reflectionPrompt: 'How does treating the Spirit as a person change how you relate to Him?' },
          { id: 'spirit-2', title: 'What the Spirit Does', duration: '5 min', body: `<h4>Six Things in Scripture</h4><p><b>Convicts</b> of sin (John 16:8). <b>Comforts</b> the broken (John 14:26). <b>Teaches</b> truth (1 John 2:27). <b>Empowers</b> for mission (Acts 1:8). <b>Produces fruit</b> — love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control (Galatians 5:22-23). <b>Intercedes</b> when you can\'t pray (Romans 8:26).</p>`, scriptureRefs: ['John 16:8', 'Galatians 5:22-23', 'Acts 1:8', 'Romans 8:26'], reflectionPrompt: 'Which of those six do you most need today?' },
          { id: 'spirit-3', title: 'How to Walk in the Spirit', duration: '4 min', body: `<h4>Less Trying, More Yielding</h4><p>"Walk by the Spirit" (Galatians 5:16) is more about surrender than effort. It\'s noticing the Spirit\'s nudge to forgive, repent, encourage, or wait — and saying yes. It\'s asking before deciding. It\'s trusting an inner conviction even when it\'s inconvenient.</p>`, scriptureRefs: ['Galatians 5:16-25', 'Romans 8:5-9', 'Ephesians 5:18'], reflectionPrompt: 'Where have you felt the Spirit nudge you and ignored it?' },
          { id: 'spirit-4', title: 'The Spirit and Spiritual Gifts', duration: '4 min', body: `<h4>Tools for the Mission</h4><p>The Spirit gives gifts — abilities for serving the church and world. Some are speaking (teaching, encouraging), some are serving (helping, hospitality), some are signs (healing, prophecy). Different believers, different gifts, same Spirit. Discover yours by noticing what comes alive when you serve.</p>`, scriptureRefs: ['1 Corinthians 12:4-11', 'Romans 12:6-8', '1 Peter 4:10-11'], reflectionPrompt: 'What gift do you suspect God\'s given you that you haven\'t leaned into?' },
        ],
        quiz: { id: 'spirit-quiz', passThreshold: 0.8, questions: [
          { q: 'The Holy Spirit is…', options: ['A force or energy', 'The third person of the Trinity, fully God', 'An angel', 'A symbol of God\'s power'], correctIdx: 1, explanation: 'The Spirit is a person — He grieves, teaches, intercedes, and is called "He" by Jesus. Fully God, third person of the Trinity.' },
          { q: 'According to Galatians 5:22-23, the fruit of the Spirit includes…', options: ['Wealth, success, comfort', 'Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control', 'Knowledge of Scripture', 'Healing power'], correctIdx: 1, explanation: 'Nine qualities. They\'re not optional — they\'re the natural result of the Spirit\'s presence. They grow over time.' },
          { q: '"Walking in the Spirit" is mostly about…', options: ['Trying harder to obey rules', 'Listening and yielding to His promptings', 'Speaking in tongues', 'Achieving moral perfection'], correctIdx: 1, explanation: 'Surrender, not striving. The Spirit nudges; we say yes. That\'s how transformation actually happens.' },
          { q: 'Spiritual gifts are…', options: ['Earned by spiritual maturity', 'Given by the Spirit for serving the church and world', 'Reserved for pastors', 'Optional features'], correctIdx: 1, explanation: '1 Corinthians 12 — every believer has gifts, given by the Spirit, for serving others. Different gifts, same Spirit, same mission.' },
          { q: 'When you don\'t know how to pray, Romans 8:26 says…', options: ['God ignores you', 'You have to figure it out yourself', 'The Spirit intercedes for you with groanings too deep for words', 'You\'re out of luck'], correctIdx: 2, explanation: 'The Spirit prays for you when words fail. Silent, exhausted prayer is still heard.' },
        ]}
      },
      {
        id: 'resurrection',
        title: 'The Resurrection',
        description: 'Why this single event changes everything.',
        lessons: [
          { id: 'resurrection-1', title: 'What Happened', duration: '4 min', body: `<h4>The Sequence</h4><p>Friday: Jesus crucified, dead, buried in a sealed tomb under Roman guard. Sunday morning: women find the tomb empty. Over the next 40 days, Jesus appears to Mary Magdalene, the disciples, the Emmaus travelers, Thomas, 500 people at once, and others. Then He ascends.</p><h4>Why This Order Matters</h4><p>The resurrection isn\'t a story the church evolved into — it\'s the bedrock claim from day one. Within months, thousands in Jerusalem (where the body could have been produced if the story were false) believed.</p>`, scriptureRefs: ['Matthew 28:1-10', 'Luke 24:36-43', '1 Corinthians 15:3-8'], reflectionPrompt: 'What evidence would you need to believe this happened?' },
          { id: 'resurrection-2', title: 'The Evidence', duration: '5 min', body: `<h4>Four Facts Even Skeptical Historians Accept</h4><p>1. Jesus died by crucifixion. 2. The tomb was empty. 3. Multiple people, including former skeptics like James and Paul, claimed to see Him alive. 4. The disciples were transformed from terrified to bold, many dying for their testimony. The question isn\'t whether SOMETHING happened — it\'s what.</p><h4>The Best Explanation</h4><p>Theories like "the disciples stole the body" or "they hallucinated" don\'t fit the evidence. The simplest explanation is the one Christianity has always offered: He rose.</p>`, scriptureRefs: ['1 Corinthians 15:14-19', 'Acts 4:33', 'Acts 17:31'], reflectionPrompt: 'What\'s the strongest objection to the resurrection you\'ve heard? Have you actually weighed it?' },
          { id: 'resurrection-3', title: 'Why It Means You Can Hope', duration: '4 min', body: `<h4>Death Loses</h4><p>If Jesus rose, death is no longer the end. It\'s a doorway. <i>"Where, O death, is your victory? Where, O death, is your sting?"</i> (1 Corinthians 15:55). Funerals look different. Cancer scans look different. Your future looks different.</p><h4>Resurrection Power Now</h4><p>The same power that raised Jesus is at work in you (Ephesians 1:19-20). That means addictions can break. Wounds can heal. Marriages can rebuild. Identities can be remade. Not because you\'re strong — because He is.</p>`, scriptureRefs: ['1 Corinthians 15:55-57', 'Ephesians 1:19-20', 'Romans 6:4-5'], reflectionPrompt: 'What death — literal or metaphorical — do you most need resurrection power to speak to today?' },
        ],
        quiz: { id: 'resurrection-quiz', passThreshold: 0.8, questions: [
          { q: 'What does Paul say in 1 Corinthians 15:17 about the resurrection?', options: ['It\'s nice but optional', 'If Christ has not been raised, your faith is futile', 'It\'s a metaphor for moral renewal', 'Only some Christians need to believe it'], correctIdx: 1, explanation: 'Paul stakes everything on it. The resurrection is the hinge — Christianity rises or falls with it as a literal historical event.' },
          { q: 'How many people did Paul say saw the risen Jesus at one time (1 Cor 15:6)?', options: ['12', '70', 'More than 500', '120'], correctIdx: 2, explanation: '"He appeared to more than five hundred brothers and sisters at the same time, most of whom are still living." Paul invited verification.' },
          { q: 'Which is NOT one of the four historical facts even skeptical scholars accept?', options: ['Jesus died by crucifixion', 'The tomb was empty', 'The disciples were transformed', 'The Roman government converted to Christianity'], correctIdx: 3, explanation: 'The first three are historical bedrock. The Roman government persecuted Christians for centuries before Constantine.' },
          { q: 'According to Ephesians 1:19-20, the same power that raised Jesus is…', options: ['Only available in heaven', 'At work in believers now', 'Reserved for apostles', 'Not for ordinary people'], correctIdx: 1, explanation: '"The incomparably great power for us who believe… that he exerted when he raised Christ from the dead." Resurrection power is available now.' },
          { q: 'Resurrection means death is…', options: ['Permanent', 'A doorway, not the end', 'Just sleep', 'Reincarnation'], correctIdx: 1, explanation: '1 Corinthians 15:55 — death\'s sting is gone. For believers, death is a transition, not a terminus.' },
        ]}
      },
    ]
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 2 — Bible Survey
  // ════════════════════════════════════════════════════════════
  {
    id: 'bible-survey',
    title: 'Bible Survey',
    icon: '📖',
    color: '#10b981',
    description: 'Old and New Testament big picture, how to read it, and why it can be trusted.',
    badgeId: 'bible-scholar',
    badgeLabel: 'Bible Scholar',
    badgeIcon: '📖',
    courses: [
      {
        id: 'ot-story',
        title: 'Old Testament Story',
        description: 'Creation through Exile in 6 lessons.',
        lessons: [
          { id: 'ot-1', title: 'Creation, Fall, and Flood (Gen 1-11)', duration: '5 min', body: `<h4>The Setup</h4><p>God creates a perfect world. Humans break it. The damage spreads — Cain murders Abel, evil multiplies, God floods and restarts with Noah. By Babel, humanity is scattered. The first 11 chapters frame the human problem the rest of the Bible answers.</p>`, scriptureRefs: ['Genesis 1', 'Genesis 3', 'Genesis 6', 'Genesis 11'], reflectionPrompt: 'Where do you see Genesis 3 in your own life this week?' },
          { id: 'ot-2', title: 'The Patriarchs (Gen 12-50)', duration: '5 min', body: `<h4>God Picks One Family</h4><p>God calls Abraham — promises a nation, a land, and a blessing for all peoples through him. Isaac, Jacob, and Joseph carry the promise forward through famines, family chaos, and slavery in Egypt. The story narrows so it can later widen.</p>`, scriptureRefs: ['Genesis 12:1-3', 'Genesis 17', 'Genesis 50:20'], reflectionPrompt: 'Where is God working through ordinary, broken people in your life?' },
          { id: 'ot-3', title: 'Exodus and the Law', duration: '5 min', body: `<h4>Rescue and Identity</h4><p>God rescues Israel from Egypt through Moses, parts the Red Sea, and gives the Law at Sinai. The Law isn\'t how you earn rescue — it\'s how rescued people live. The Tabernacle is built so a holy God can dwell among His people.</p>`, scriptureRefs: ['Exodus 14', 'Exodus 20', 'Exodus 33:14'], reflectionPrompt: 'When have you been rescued first and disciplined later? How does that order matter?' },
          { id: 'ot-4', title: 'Conquest, Judges, and Kings', duration: '5 min', body: `<h4>The Cycle</h4><p>Joshua leads Israel into the Promised Land. Judges chronicles a downward spiral — Israel forgets God, suffers, cries out, gets rescued, forgets again. Israel demands a king; God gives Saul, then David (a flawed but faithful king). Solomon builds the temple, then drifts. The kingdom splits.</p>`, scriptureRefs: ['Judges 21:25', '1 Samuel 8', '2 Samuel 7:12-16'], reflectionPrompt: 'What\'s your version of the Judges cycle — what do you keep returning to forgetting?' },
          { id: 'ot-5', title: 'Prophets and Exile', duration: '5 min', body: `<h4>God Sends Warnings</h4><p>Major and minor prophets speak truth to kings — warning of judgment, calling for justice, promising a coming Messiah. Israel ignores them. Assyria conquers the north (722 BC). Babylon conquers Judah (586 BC). Jerusalem falls; the temple burns.</p>`, scriptureRefs: ['Isaiah 53', 'Jeremiah 31:31-34', 'Ezekiel 36:26-27'], reflectionPrompt: 'When God speaks correction to you (through Scripture, conscience, a friend), how do you usually respond?' },
          { id: 'ot-6', title: 'Return and Waiting', duration: '4 min', body: `<h4>A Slow Restoration</h4><p>After 70 years, a remnant returns under Ezra and Nehemiah. The temple is rebuilt — smaller, less glorious. The OT ends with Malachi: 400 silent years before the next chapter. Israel waits. The whole OT leans forward, asking: "Where is the Messiah?"</p>`, scriptureRefs: ['Ezra 3:11-12', 'Nehemiah 8:10', 'Malachi 4:5-6'], reflectionPrompt: 'What waiting season are you in right now? What does it ask of your faith?' },
        ],
        quiz: { id: 'ot-quiz', passThreshold: 0.8, questions: [
          { q: 'Genesis 1-11 ends with which scattering event?', options: ['The Flood', 'The Tower of Babel', 'Sodom and Gomorrah', 'The Exodus'], correctIdx: 1, explanation: 'Genesis 11 — God scatters humanity at Babel. Genesis 12 then narrows to Abraham, beginning the rescue plan.' },
          { q: 'God\'s promise to Abraham included…', options: ['Only land', 'A nation, a land, and a blessing for all peoples', 'Only descendants', 'Personal wealth'], correctIdx: 1, explanation: 'Genesis 12:1-3 — three pieces, including "in you all the families of the earth shall be blessed" (the gospel preview).' },
          { q: 'The Law given at Sinai was…', options: ['How Israel earned rescue', 'How rescued people live', 'Optional', 'Only for kings'], correctIdx: 1, explanation: 'Order matters: God rescues from Egypt FIRST, then gives the Law. Grace before obligation.' },
          { q: 'The book of Judges describes…', options: ['Stable, faithful Israel', 'A repeating downward cycle of forgetting and rescue', 'Israel\'s perfect kings', 'The Babylonian exile'], correctIdx: 1, explanation: 'Judges 21:25 — "everyone did what was right in his own eyes." The cycle ends with calls for a king.' },
          { q: 'The OT ends with…', options: ['The Messiah\'s arrival', 'A 400-year silence after Malachi', 'A new exodus', 'The temple being rebuilt'], correctIdx: 1, explanation: 'After Malachi, 400 silent years pass before Matthew. Israel waits for the promised Messiah.' },
        ]}
      },
      {
        id: 'nt-story',
        title: 'New Testament Story',
        description: 'Gospels, early church, letters, and Revelation in 6 lessons.',
        lessons: [
          { id: 'nt-1', title: 'The Four Gospels', duration: '5 min', body: `<h4>Why Four?</h4><p>Matthew, Mark, Luke, and John each tell Jesus\'s story from a different angle. Matthew (king for the Jews), Mark (suffering servant, fast-paced), Luke (compassionate Savior for outsiders), John (eternal Son of God). They overlap and complement — like four eyewitnesses describing the same event.</p>`, scriptureRefs: ['John 20:30-31', 'Luke 1:1-4'], reflectionPrompt: 'Which Gospel\'s portrait of Jesus speaks to you most right now?' },
          { id: 'nt-2', title: 'Acts — The Church Begins', duration: '5 min', body: `<h4>Pentecost Onward</h4><p>The Spirit descends. 3,000 believe in a day. The gospel spreads from Jerusalem to Judea to Samaria to "the ends of the earth" (Acts 1:8). Peter leads early; Paul takes the gospel to Gentiles. By Acts 28, the message has reached Rome.</p>`, scriptureRefs: ['Acts 1:8', 'Acts 2', 'Acts 28:30-31'], reflectionPrompt: 'What\'s "the ends of the earth" for you — where is God sending you that you keep avoiding?' },
          { id: 'nt-3', title: 'Paul\'s Letters', duration: '5 min', body: `<h4>13 Letters to Real Churches and People</h4><p>Romans (deepest theology). 1-2 Corinthians (church problems). Galatians (gospel vs. legalism). Ephesians (identity in Christ). Philippians (joy from prison). Colossians (Jesus is enough). 1-2 Thessalonians (return of Christ). Pastoral letters to Timothy, Titus, Philemon. Each one applies the gospel to specific real-life situations.</p>`, scriptureRefs: ['Romans 1:16-17', 'Galatians 2:20', 'Philippians 4:4-7'], reflectionPrompt: 'Which letter would you most benefit from reading slowly this month?' },
          { id: 'nt-4', title: 'General Letters', duration: '4 min', body: `<h4>Hebrews to Jude</h4><p>Hebrews (Jesus is greater than the OT system). James (faith works). 1 Peter (suffering with hope). 2 Peter & Jude (warning against false teachers). 1-3 John (love one another, stay in truth). Together, they pastor the early church through external threats and internal drift.</p>`, scriptureRefs: ['Hebrews 12:1-2', 'James 1:22', '1 John 4:7-8'], reflectionPrompt: 'Which warning or encouragement in those letters most fits your current season?' },
          { id: 'nt-5', title: 'Revelation', duration: '5 min', body: `<h4>Not a Code Book — A Revealing</h4><p>John\'s vision on Patmos. Jesus appears in glory. Letters to seven churches. Then symbolic visions of judgment and victory. The point isn\'t timing-chart prophecy — it\'s assurance for persecuted Christians: <b>Jesus wins</b>. Evil doesn\'t get the last word. The story ends with a new heaven, new earth, no more tears.</p>`, scriptureRefs: ['Revelation 1:17-18', 'Revelation 21:1-5', 'Revelation 22:20'], reflectionPrompt: 'What part of you most needs to hear "Jesus wins, evil loses" today?' },
          { id: 'nt-6', title: 'How the NT Hangs Together', duration: '4 min', body: `<h4>One Story</h4><p>The Gospels show what Jesus did. Acts shows the church carrying that on. The letters teach how to live it. Revelation shows where it\'s all going. Take any one out and the story bends. Take it all together and you have the most coherent rescue narrative ever written.</p>`, scriptureRefs: ['Luke 24:44-47'], reflectionPrompt: 'Which of those four sections (Gospels / Acts / Letters / Revelation) do you spend the least time in? What\'s one step toward changing that?' },
        ],
        quiz: { id: 'nt-quiz', passThreshold: 0.8, questions: [
          { q: 'Why are there four Gospels?', options: ['They contradict each other', 'Each tells Jesus\'s story from a different angle', 'Three are originals; one is a forgery', 'For length'], correctIdx: 1, explanation: 'Matthew, Mark, Luke, John — different angles on the same Jesus, like four eyewitnesses.' },
          { q: 'What is Acts about?', options: ['The end times', 'Jesus\'s childhood', 'The early church and how the gospel spread', 'Old Testament rituals'], correctIdx: 2, explanation: 'Acts 1:8 maps the spread: Jerusalem → Judea → Samaria → ends of the earth. By Acts 28 the gospel reaches Rome.' },
          { q: 'Paul\'s letter to the Romans is best known for…', options: ['Practical advice', 'The deepest theological exposition of the gospel', 'Travel logs', 'Personal stories'], correctIdx: 1, explanation: 'Romans is the densest gospel theology in the NT — "I am not ashamed of the gospel" (1:16) is the thesis.' },
          { q: 'Revelation\'s main point is…', options: ['A timing chart of the end', 'Jesus wins; evil loses; God restores', 'A code only experts can crack', 'Pessimism about the future'], correctIdx: 1, explanation: 'It\'s an "unveiling" — pulling back the curtain to show persecuted Christians that Jesus reigns and the story ends well.' },
          { q: 'How do the four NT sections connect?', options: ['They\'re separate stories', 'Gospels (Jesus) → Acts (church) → Letters (life) → Revelation (where it\'s going)', 'Each contradicts the last', 'Only the Gospels matter'], correctIdx: 1, explanation: 'One coherent story: what Jesus did → how the church carried it → how to live it → where it ends.' },
        ]}
      },
      {
        id: 'how-to-read',
        title: 'How to Read the Bible',
        description: 'Genres, context, application — getting more out of every chapter.',
        lessons: [
          { id: 'read-1', title: 'Read for Context, Not Verses', duration: '4 min', body: `<h4>The #1 Mistake</h4><p>Pulling a verse out of context. Before applying any verse, ask: who wrote it, to whom, in what genre, in what historical situation, and where does it fit in the book\'s argument? "I can do all things through Christ" (Phil 4:13) is in a paragraph about contentment in poverty — not a sports motto.</p>`, scriptureRefs: ['Philippians 4:10-13', '2 Timothy 2:15'], reflectionPrompt: 'Pick a "favorite verse" you\'ve memorized. Read the surrounding paragraph. What changes?' },
          { id: 'read-2', title: 'Recognize the Genre', duration: '4 min', body: `<h4>Different Genres, Different Rules</h4><p>History (read literally — it actually happened). Poetry (read figuratively — Psalms use vivid imagery). Prophecy (often symbolic, sometimes about near and far events). Law (Old Covenant context, principles still apply). Gospels (theological biography). Letters (specific situations, universal principles).</p>`, scriptureRefs: ['2 Timothy 3:16-17'], reflectionPrompt: 'Have you ever read poetry as literal history or history as metaphor? What got mangled?' },
          { id: 'read-3', title: 'The Big Story', duration: '4 min', body: `<h4>Every Page Points Somewhere</h4><p>Every passage fits in the four-act story: Creation → Fall → Redemption → Restoration. When you read OT laws or NT letters, ask: where does this fit? How does this point to Jesus or to the world being made new? Reading isolated verses misses the arc.</p>`, scriptureRefs: ['Luke 24:27', 'John 5:39'], reflectionPrompt: 'Read your favorite OT passage with "how does this point to Jesus?" in mind. What do you see?' },
          { id: 'read-4', title: 'Read to Be Changed', duration: '4 min', body: `<h4>Information vs Transformation</h4><p>James 1:22 — "Be doers of the word, and not hearers only, deceiving yourselves." After reading, ask: what does this say about God? What does it say about me? What\'s one specific thing I\'ll do differently this week? If you\'re only reading to know more, you\'re missing the point.</p>`, scriptureRefs: ['James 1:22-25', 'Hebrews 4:12'], reflectionPrompt: 'When did Scripture last change something specific in your behavior?' },
        ],
        quiz: { id: 'read-quiz', passThreshold: 0.8, questions: [
          { q: 'The #1 mistake in reading the Bible is…', options: ['Reading too slowly', 'Pulling verses out of context', 'Using a study Bible', 'Reading the Old Testament'], correctIdx: 1, explanation: 'Context (who wrote, to whom, what genre, where in the argument) determines meaning. Verses ripped out of context lose their actual point.' },
          { q: 'Which is NOT a biblical genre?', options: ['History', 'Poetry', 'Prophecy', 'Science textbook'], correctIdx: 3, explanation: 'The Bible isn\'t a science manual. It\'s history, poetry, prophecy, law, gospel narrative, and letters — each with its own rules of reading.' },
          { q: 'The Bible\'s big-picture story has how many acts?', options: ['Two (Old, New)', 'Four (Creation, Fall, Redemption, Restoration)', 'Seven', 'It\'s not a story'], correctIdx: 1, explanation: 'Creation → Fall → Redemption → Restoration. Every passage fits somewhere in this arc and points (eventually) to Jesus.' },
          { q: 'According to James 1:22, the goal of reading is…', options: ['Knowledge', 'Doing what it says, not just hearing', 'Memorization', 'Theological debate'], correctIdx: 1, explanation: '"Be doers of the word, and not hearers only." Information without obedience is self-deception.' },
          { q: 'Philippians 4:13 ("I can do all things through Christ") is in a passage about…', options: ['Athletic victory', 'Career success', 'Contentment in poverty and abundance', 'Spiritual warfare'], correctIdx: 2, explanation: 'Verses 10-13 are about being content "in any and every situation" including hunger and need. Sports motto reading misses the point.' },
        ]}
      },
      {
        id: 'why-trust',
        title: 'Why We Trust the Bible',
        description: 'Canon, manuscripts, and archaeology — the case for Scripture.',
        lessons: [
          { id: 'trust-1', title: 'How Did These 66 Books Get Chosen?', duration: '5 min', body: `<h4>Canon Wasn\'t a Vote</h4><p>Early Christians recognized which books had apostolic origin, doctrinal consistency, and widespread acceptance. The OT canon was already settled before Jesus. The NT was largely fixed by AD 200, formally affirmed in church councils. The councils didn\'t CHOOSE the canon — they recognized which books the Spirit had been authenticating in the church for generations.</p>`, scriptureRefs: ['2 Peter 3:15-16'], reflectionPrompt: 'Does it strengthen or weaken your trust to know the canon was a recognition process, not a top-down decision?' },
          { id: 'trust-2', title: 'Manuscripts — More Than Any Other Ancient Text', duration: '5 min', body: `<h4>By the Numbers</h4><p>Over 5,800 Greek NT manuscripts exist. Compare: Homer\'s Iliad — 1,800. Plato — 7. The earliest NT fragments date to within decades of the originals (P52 of John, around AD 125). Textual variants are mostly spelling differences; not one essential doctrine is in question.</p>`, scriptureRefs: ['Isaiah 40:8', '1 Peter 1:25'], reflectionPrompt: 'How does the manuscript evidence change how you think about whether the Bible has been preserved?' },
          { id: 'trust-3', title: 'Archaeology Confirms', duration: '5 min', body: `<h4>Stones That Speak</h4><p>The Tel Dan Stele (1993) names "the House of David" outside the Bible. The Pilate Stone (1961) confirms Pontius Pilate as prefect. The Caiaphas Ossuary (1990) names the high priest at Jesus\'s trial. The Dead Sea Scrolls (1947) confirmed OT texts dating 1,000 years older than previously available — virtually identical.</p>`, scriptureRefs: ['Luke 1:1-4'], reflectionPrompt: 'What do you do with the consistent confirmation between Scripture and archaeology?' },
          { id: 'trust-4', title: 'Fulfilled Prophecy', duration: '4 min', body: `<h4>The Hardest Test</h4><p>Hundreds of OT prophecies about the Messiah — born in Bethlehem (Micah 5:2), pierced (Ps 22:16, Zech 12:10), suffering servant (Isaiah 53). Written hundreds of years before Jesus. The probability of one person fulfilling even 8 specific prophecies is astronomical. The case isn\'t airtight, but it isn\'t blind either.</p>`, scriptureRefs: ['Isaiah 53', 'Micah 5:2', 'Psalm 22'], reflectionPrompt: 'Which area of trust (canon, manuscripts, archaeology, prophecy) was most new to you?' },
        ],
        quiz: { id: 'trust-quiz', passThreshold: 0.8, questions: [
          { q: 'How was the biblical canon established?', options: ['Voted on at one council', 'Recognized over time as books proved their apostolic origin and consistency', 'Chosen randomly', 'Decided by emperors'], correctIdx: 1, explanation: 'It was a recognition process — councils confirmed what the church had been authenticating for generations, not a top-down vote.' },
          { q: 'How many Greek NT manuscripts exist (approximately)?', options: ['200', '1,000', '5,800+', '20'], correctIdx: 2, explanation: '5,800+. By comparison: Homer\'s Iliad has 1,800; Plato\'s works have 7. The NT is the best-preserved ancient text by orders of magnitude.' },
          { q: 'The Dead Sea Scrolls (discovered 1947) confirmed…', options: ['NT manuscripts', 'OT texts dating 1,000 years older were virtually identical to existing copies', 'New books missing from the Bible', 'Different Hebrew language'], correctIdx: 1, explanation: 'Isaiah scrolls from Qumran, dated 100 BC, matched the Masoretic text from AD 1000 with stunning accuracy. Scripture was preserved faithfully across a millennium.' },
          { q: 'Which is an example of archaeology confirming biblical history?', options: ['No examples exist', 'The Tel Dan Stele names "the House of David"', 'The Bible was completely fictional', 'Only NT events have been confirmed'], correctIdx: 1, explanation: 'Tel Dan Stele (1993), Pilate Stone (1961), Caiaphas Ossuary (1990) — multiple finds confirm specific people and places named in the Bible.' },
          { q: 'Fulfilled prophecy refers to…', options: ['Vague predictions that could fit anyone', 'Hundreds of specific OT prophecies about the Messiah fulfilled in Jesus', 'Modern preachers\' predictions', 'Only general themes'], correctIdx: 1, explanation: 'Specific prophecies — birth in Bethlehem, the suffering servant, betrayal for 30 silver — written centuries before Jesus and fulfilled in detail.' },
        ]}
      },
    ]
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 3 — Christian Life Skills
  // ════════════════════════════════════════════════════════════
  {
    id: 'life-skills',
    title: 'Christian Life Skills',
    icon: '🌱',
    color: '#fbbf24',
    description: 'Practical skills for following Jesus day to day.',
    badgeId: 'disciple',
    badgeLabel: 'Disciple',
    badgeIcon: '🌱',
    courses: [
      {
        id: 'how-to-pray',
        title: 'How to Pray',
        description: 'Real conversation with God.',
        lessons: [
          { id: 'pray-1', title: 'Prayer Is a Conversation', duration: '4 min', body: `<h4>Not a Magic Formula</h4><p>Prayer is talking with God, not at Him. He\'s not impressed by long words or moved by repetition. He\'s a Father who loves to hear His kids. Start by being honest. End by listening.</p>`, scriptureRefs: ['Matthew 6:5-8', 'Hebrews 4:16'], reflectionPrompt: 'When was the last time you prayed honestly, not performatively?' },
          { id: 'pray-2', title: 'The Lord\'s Prayer as a Template', duration: '5 min', body: `<h4>Six Movements</h4><p>Worship ("hallowed be your name"). God\'s will ("your kingdom come"). Daily needs ("give us this day our daily bread"). Forgiveness ("forgive us our debts"). Protection ("lead us not into temptation"). Praise ("yours is the kingdom"). Use it as scaffolding, not a script.</p>`, scriptureRefs: ['Matthew 6:9-13'], reflectionPrompt: 'Which of those six movements do you neglect most?' },
          { id: 'pray-3', title: 'When You Don\'t Feel Like It', duration: '4 min', body: `<h4>Pray Anyway</h4><p>Feelings catch up to obedience more often than they precede it. Show up tired. Show up doubting. Show up angry. The Psalms model raw, honest prayer — including complaints. God can handle your real self.</p>`, scriptureRefs: ['Psalm 13', 'Romans 8:26'], reflectionPrompt: 'What\'s a "feelings prayer" you\'ve been avoiding because it doesn\'t feel reverent enough?' },
          { id: 'pray-4', title: 'Praying With Scripture', duration: '4 min', body: `<h4>Borrow God\'s Words</h4><p>When your own words run out, pray Scripture back to God. The Psalms work as prayers (try Psalm 23 personally). Paul\'s prayers (Eph 1:16-23) become great prayers for others. Lectio Divina — read slowly, notice what stands out, pray it back.</p>`, scriptureRefs: ['Ephesians 1:16-23', 'Psalm 119:18'], reflectionPrompt: 'Try praying Psalm 23 line by line, replacing "I" and "my" with someone you love.' },
          { id: 'pray-5', title: 'Listening Prayer', duration: '4 min', body: `<h4>Two-Way</h4><p>Prayer isn\'t a monologue. After speaking, sit in silence. The Spirit speaks through Scripture, conscience, an inner conviction, a Bible verse coming to mind, a wise friend\'s word. Test what you hear against Scripture and trusted believers.</p>`, scriptureRefs: ['1 Kings 19:11-13', 'John 10:27'], reflectionPrompt: 'Sit in silence for two minutes after praying today. What rose up?' },
        ],
        quiz: { id: 'pray-quiz', passThreshold: 0.8, questions: [
          { q: 'Prayer is best described as…', options: ['Repeating set words', 'A conversation with God', 'A magic formula', 'Performance for others'], correctIdx: 1, explanation: 'Matthew 6:5-8 — Jesus warns against performance and meaningless repetition. Talk with God like a real conversation.' },
          { q: 'The Lord\'s Prayer in Matthew 6 has how many movements?', options: ['Three', 'Five', 'Six (worship, will, needs, forgiveness, protection, praise)', 'Ten'], correctIdx: 2, explanation: 'Six clear movements — use as scaffolding for your own prayers, not a script to recite.' },
          { q: 'When you don\'t feel like praying, you should…', options: ['Wait until you do', 'Skip it; God doesn\'t want fake prayer', 'Pray anyway — the Psalms model raw, honest prayer', 'Ask someone else to pray for you only'], correctIdx: 2, explanation: 'Feelings follow obedience more often than they precede it. The Psalms include rage, despair, and doubt — God welcomes the real you.' },
          { q: 'Praying with Scripture means…', options: ['Quoting verses to God to manipulate Him', 'Borrowing God\'s words when your own run out (Psalms, NT prayers)', 'Only reading; not praying', 'It\'s not biblical'], correctIdx: 1, explanation: 'Pray the Psalms back. Pray Paul\'s prayers for others. When words fail, Scripture provides them.' },
          { q: 'Listening prayer is…', options: ['Hearing audible voices from God', 'Sitting in silence after speaking, attentive to the Spirit through Scripture, conscience, etc.', 'Optional', 'Only for monks'], correctIdx: 1, explanation: 'God speaks through Scripture, an inner conviction, a verse coming to mind, a wise friend. Test what you hear against Scripture.' },
        ]}
      },
      {
        id: 'handling-doubt',
        title: 'Handling Doubt',
        description: 'When questions feel like a crisis.',
        lessons: [
          { id: 'doubt-1', title: 'Doubt Isn\'t Disqualification', duration: '4 min', body: `<h4>Even John the Baptist Doubted</h4><p>John baptized Jesus, then later — from prison — sent disciples asking, "Are you the one?" (Matthew 11:3). Jesus didn\'t shame him. He answered with evidence. Doubt isn\'t the opposite of faith. The opposite of faith is unbelief that refuses to engage. Doubts that drive you toward Jesus are part of growing.</p>`, scriptureRefs: ['Matthew 11:1-6', 'Mark 9:24'], reflectionPrompt: 'What doubt have you been afraid to admit because it felt unspiritual?' },
          { id: 'doubt-2', title: 'Common Doubts and Where to Take Them', duration: '5 min', body: `<h4>Categories Help</h4><p><b>Intellectual</b>: science, evil, reliability of Scripture — read good books (Tim Keller, C.S. Lewis), talk to thinking believers. <b>Emotional</b>: God feels distant, prayer feels empty — usually requires honest community + spiritual practices, not better arguments. <b>Moral</b>: anger at the church, hypocrisy — distinguish Jesus from his followers; bring grievances to leaders. Different doubts need different responses.</p>`, scriptureRefs: ['Jude 1:22', '1 Peter 3:15'], reflectionPrompt: 'Which category fits your current doubt? Are you bringing it to the right kind of help?' },
          { id: 'doubt-3', title: 'Walking With People Who Doubt', duration: '4 min', body: `<h4>Don\'t Argue Them Back</h4><p>Listen first. Don\'t panic. Don\'t take it personally. Pray for them. Recommend specific resources. Stay in relationship — many people return to faith because someone refused to abandon them through the questions.</p>`, scriptureRefs: ['1 Thessalonians 5:14'], reflectionPrompt: 'Who in your life is doubting? What\'s your next conversation with them like?' },
          { id: 'doubt-4', title: 'When Doubt Lasts', duration: '4 min', body: `<h4>The Long Season</h4><p>Some seasons last years. Mother Teresa lived in spiritual darkness for decades while serving. C.S. Lewis battled doubt repeatedly. Persistence is its own faith. Keep showing up — to Scripture, to community, to prayer — even when it feels empty. You\'re not alone in the silence.</p>`, scriptureRefs: ['Psalm 88', 'Habakkuk 3:17-18'], reflectionPrompt: 'If your doubt lasted another year, what would faithfulness look like in the meantime?' },
        ],
        quiz: { id: 'doubt-quiz', passThreshold: 0.8, questions: [
          { q: 'According to Matthew 11, when John the Baptist doubted, Jesus…', options: ['Rebuked him', 'Answered with evidence and didn\'t shame him', 'Ignored him', 'Demoted him'], correctIdx: 1, explanation: 'Jesus pointed to the evidence (the blind see, the dead are raised) and treated John\'s doubt with patience, not contempt.' },
          { q: 'The opposite of faith is…', options: ['Doubt', 'Unbelief that refuses to engage', 'Questions', 'Wonder'], correctIdx: 1, explanation: 'Doubt that wrestles toward Jesus is part of faith. Unbelief that refuses to engage at all is the opposite.' },
          { q: 'Different categories of doubt require different responses. Emotional doubt usually needs…', options: ['Better arguments', 'Honest community and spiritual practices', 'Apologetics books', 'A debate'], correctIdx: 1, explanation: 'Intellectual doubts need books and reasoning. Emotional doubts need community, presence, and practices — not more facts.' },
          { q: 'When walking with someone who doubts, the first move is…', options: ['Argue them back', 'Cut them off', 'Listen first', 'Recommend a sermon'], correctIdx: 2, explanation: 'Listen first. Don\'t panic. Stay in relationship. Many people return because someone refused to abandon them through the questions.' },
          { q: 'Long-lasting doubt is…', options: ['A sign you\'re not really a Christian', 'Common; saints throughout history have walked through dark seasons', 'Cause for despair', 'Always resolved quickly'], correctIdx: 1, explanation: 'Mother Teresa, C.S. Lewis, and the writer of Psalm 88 walked through long darkness while persisting in faith. Persistence is its own faith.' },
        ]}
      },
      {
        id: 'sharing-faith',
        title: 'Sharing Your Faith',
        description: 'Naturally, not weirdly.',
        lessons: [
          { id: 'share-1', title: 'Why Share At All?', duration: '4 min', body: `<h4>If It\'s True, You\'d Be Stingy Not To</h4><p>If you found a cure for cancer, telling people wouldn\'t feel pushy — it would feel obvious. Christians believe Jesus is the cure for the deepest human problem. Sharing isn\'t marketing; it\'s love. The mission flows from compassion, not duty.</p>`, scriptureRefs: ['Matthew 28:19-20', '2 Corinthians 5:14-15'], reflectionPrompt: 'Why have you been quiet about your faith? What\'s the actual fear under the silence?' },
          { id: 'share-2', title: 'Your Story Is the Tool', duration: '4 min', body: `<h4>Three Sentences</h4><p>Practice your story in three parts: (1) Before Jesus, my life looked like… (2) I came to Jesus when… (3) Now I\'m experiencing… Most evangelism happens in the natural overflow of relationship — not through tracts or street preaching. People aren\'t arguments to win; they\'re stories meeting your story.</p>`, scriptureRefs: ['John 9:25', '1 Peter 3:15'], reflectionPrompt: 'Write your three-sentence story right now. Which part is hardest to say?' },
          { id: 'share-3', title: 'How to Have a Real Conversation', duration: '4 min', body: `<h4>Listen, Then Listen More</h4><p>Don\'t monologue. Ask questions. Find out what they actually believe (most people are unclear). Find points of common ground. Be honest about your doubts and journey. Don\'t pretend to have all the answers — that drives away seekers more than ignorance.</p>`, scriptureRefs: ['Colossians 4:5-6', 'Acts 17:22-23'], reflectionPrompt: 'In your last spiritual conversation, did you talk more or listen more?' },
          { id: 'share-4', title: 'When They Say No', duration: '4 min', body: `<h4>Plant Seeds, Don\'t Force Harvest</h4><p>Most people don\'t come to faith on first hearing. You may be one of seven or eight encounters God uses. Your job is to be faithful, not to "close the deal." Pray for them. Stay friends. Trust the Spirit to do the work you can\'t.</p>`, scriptureRefs: ['1 Corinthians 3:6-7', 'John 6:44'], reflectionPrompt: 'Who have you written off as "never going to believe"? Pray for them today.' },
        ],
        quiz: { id: 'share-quiz', passThreshold: 0.8, questions: [
          { q: 'Why do Christians share their faith?', options: ['Duty and pressure', 'Compassion — if Jesus is the cure, telling people is love', 'To meet a quota', 'For show'], correctIdx: 1, explanation: 'Mission flows from love, not obligation. If the gospel is true, sharing it is the most loving thing you can do.' },
          { q: 'Your three-sentence faith story has what structure?', options: ['Before Jesus / Met Jesus / Now', 'Childhood / Teen years / Adult', 'Sin list / Salvation / Heaven', 'Theology / Doctrine / Application'], correctIdx: 0, explanation: 'Before / Met / Now. It\'s short, memorable, and human — not a sermon.' },
          { q: 'In a spiritual conversation, you should mostly…', options: ['Talk more than listen', 'Listen and ask questions', 'Avoid the topic', 'Argue every point'], correctIdx: 1, explanation: 'Find out what they actually believe and feel. Most people aren\'t arguments to win — they\'re stories meeting your story.' },
          { q: 'Pretending to have all the answers usually…', options: ['Helps people believe', 'Drives seekers away faster than ignorance', 'Is required', 'Wins arguments'], correctIdx: 1, explanation: 'Honesty about your own doubts and journey builds trust. Manufactured certainty is a turn-off.' },
          { q: 'When someone says no, your response is…', options: ['Push harder', 'Plant seeds, pray, stay in relationship', 'Cut them off', 'Give up entirely'], correctIdx: 1, explanation: '1 Corinthians 3:6 — one plants, another waters, God gives the growth. Most people need many encounters.' },
        ]}
      },
      {
        id: 'sin-grace',
        title: 'Sin, Repentance & Grace',
        description: 'How to handle the gap between who you want to be and who you are.',
        lessons: [
          { id: 'sin-1', title: 'What Sin Actually Is', duration: '4 min', body: `<h4>Not Mostly About Rules</h4><p>Sin isn\'t breaking arbitrary rules — it\'s a relational rupture. The Hebrew word means "missing the mark." The Greek word implies "rebellion." It\'s loving anything more than God, treating people as means instead of ends, choosing your way over His. Both small and large versions matter.</p>`, scriptureRefs: ['Romans 3:23', '1 John 3:4'], reflectionPrompt: 'What\'s your most-loved thing that competes with God for first place?' },
          { id: 'sin-2', title: 'Repentance — Turning, Not Feeling Bad', duration: '4 min', body: `<h4>The Word Means "Change of Mind"</h4><p>Real repentance is more than guilt. It\'s honest naming, agreement with God that this is wrong, then turning. <i>"If we confess our sins, he is faithful and just to forgive us"</i> (1 John 1:9). Confession to God; sometimes to people you\'ve harmed; specific, not vague.</p>`, scriptureRefs: ['1 John 1:9', 'Acts 3:19', 'Psalm 51'], reflectionPrompt: 'What sin have you been managing instead of repenting of?' },
          { id: 'sin-3', title: 'Grace — Not Permission, Power', duration: '4 min', body: `<h4>Two Wrong Reactions</h4><p>One: "Grace covers everything, so live however." Paul calls this nonsense (Romans 6:1-2). Two: "I have to clean up before God accepts me." That\'s legalism. The truth: grace forgives the past AND empowers the present. You don\'t earn it; you receive it; it then works in you.</p>`, scriptureRefs: ['Titus 2:11-12', 'Romans 6:1-2', 'Ephesians 2:8-10'], reflectionPrompt: 'Are you treating grace as permission or as transformative power?' },
          { id: 'sin-4', title: 'Habitual Sin — How to Fight', duration: '4 min', body: `<h4>Confession + Community + Patterns</h4><p>You can\'t white-knuckle real change alone. Confess to a trusted believer (James 5:16). Look for triggers and replace them. Memorize Scripture for the moment. Cut off access where possible. Expect setbacks; don\'t use them as excuses to quit. Sanctification is slow.</p>`, scriptureRefs: ['James 5:16', 'Romans 6:11-14', 'Hebrews 12:1'], reflectionPrompt: 'Who is the trusted person you can confess your hardest struggle to this week?' },
        ],
        quiz: { id: 'sin-quiz', passThreshold: 0.8, questions: [
          { q: 'Sin is best understood as…', options: ['Breaking arbitrary rules', 'A relational break — loving things more than God', 'Cultural difference', 'A learning experience'], correctIdx: 1, explanation: 'Sin is fundamentally a relational rupture. The behavioral version follows from a deeper love disorder.' },
          { q: 'Real repentance is…', options: ['Feeling really bad', 'Honest naming + agreeing with God + turning', 'Promising to do better', 'Just confessing privately'], correctIdx: 1, explanation: 'The word means "change of mind." Guilt is just emotion; repentance changes direction.' },
          { q: 'Grace is…', options: ['Permission to keep sinning', 'Forgiveness of the past AND power for transformation', 'Earned by good behavior', 'A loophole'], correctIdx: 1, explanation: 'Titus 2:11-12 — grace teaches us to renounce ungodliness. It\'s not permission; it\'s the engine of change.' },
          { q: 'Habitual sin is best fought with…', options: ['Solo willpower', 'Confession + community + practical patterns', 'Avoiding the topic', 'Pretending it\'s gone'], correctIdx: 1, explanation: 'James 5:16 — confess to one another. Real change requires being known and supported.' },
          { q: 'Sanctification (becoming more like Jesus) is…', options: ['Instant', 'Slow, with setbacks expected', 'Optional', 'Only for pastors'], correctIdx: 1, explanation: 'It\'s a lifelong process. Setbacks aren\'t failure; they\'re part of the road.' },
        ]}
      },
      {
        id: 'money-generosity',
        title: 'Money & Generosity',
        description: 'Open-handed living in a closed-fisted world.',
        lessons: [
          { id: 'money-1', title: 'What Jesus Said About Money', duration: '4 min', body: `<h4>More Than You\'d Expect</h4><p>Jesus talked about money more than heaven, hell, or prayer. Why? Because money competes for our hearts. <i>"You cannot serve God and money"</i> (Matthew 6:24). Not "shouldn\'t" — "cannot." It\'s a worship competition, not a logistical one.</p>`, scriptureRefs: ['Matthew 6:19-24', 'Luke 12:15'], reflectionPrompt: 'Which would scare you more — losing your salary or losing your faith? Be honest.' },
          { id: 'money-2', title: 'Stewardship, Not Ownership', duration: '4 min', body: `<h4>Everything\'s On Loan</h4><p>"The earth is the LORD\'s, and everything in it" (Psalm 24:1). You\'re a manager, not an owner. That changes how you spend, save, and give. The question isn\'t "what do I want to do with MY money?" It\'s "what does God want done with HIS money that I\'m managing?"</p>`, scriptureRefs: ['Psalm 24:1', '1 Corinthians 4:7'], reflectionPrompt: 'Where in your spending do you act like an owner rather than a manager?' },
          { id: 'money-3', title: 'The Tithe — A Starting Point', duration: '4 min', body: `<h4>Ten Percent</h4><p>Tithing — giving 10% to God\'s work — predates the Law (Abraham did it). The OT prescribed it; Jesus assumed it. It\'s not a ceiling; it\'s a starting point. Begin somewhere, increase gradually, watch how God provides as you trust Him with the firstfruits.</p>`, scriptureRefs: ['Malachi 3:10', 'Genesis 14:20', 'Matthew 23:23'], reflectionPrompt: 'What percentage are you giving? What\'s your next step up?' },
          { id: 'money-4', title: 'Generosity Beyond the Tithe', duration: '4 min', body: `<h4>Where Your Treasure Is</h4><p>Beyond regular giving, look for opportunities — a friend in need, a cause that breaks your heart, a missionary, a struggling family. Cheerful giving (2 Cor 9:7) means proactive, not pressured. Generosity is the antidote to the grip money has on our hearts.</p>`, scriptureRefs: ['2 Corinthians 9:6-7', 'Acts 20:35'], reflectionPrompt: 'What\'s one generous act this week that nobody but God would know about?' },
        ],
        quiz: { id: 'money-quiz', passThreshold: 0.8, questions: [
          { q: 'According to Matthew 6:24, you cannot serve…', options: ['Two churches', 'God and money', 'Two countries', 'Two jobs'], correctIdx: 1, explanation: 'Jesus says "cannot" — not "shouldn\'t." It\'s a worship competition. Money is a god if it has your heart.' },
          { q: 'Stewardship means…', options: ['Owning everything', 'Managing what God has entrusted to you', 'Hoarding for security', 'Retiring early'], correctIdx: 1, explanation: 'Psalm 24:1 — everything is God\'s. You\'re managing what He\'s entrusted, not owning it.' },
          { q: 'The tithe (10%) is…', options: ['Optional and outdated', 'A starting point that predates the Law', 'A maximum ceiling', 'Only for the rich'], correctIdx: 1, explanation: 'Abraham tithed before any law existed (Genesis 14:20). Jesus assumed it. It\'s a baseline to build from, not the maximum.' },
          { q: 'Cheerful giving (2 Cor 9:7) means…', options: ['Giving when pressured', 'Giving from joy, not guilt', 'Only giving when finances allow', 'Giving begrudgingly'], correctIdx: 1, explanation: '"God loves a cheerful giver." Pressured generosity isn\'t the goal — joyful, free generosity is.' },
          { q: 'Generosity is the antidote to…', options: ['Tax bills', 'Money\'s grip on your heart', 'Inflation', 'Bad investments'], correctIdx: 1, explanation: 'Money is a worship competitor. Giving it away weakens its grip and reorients your heart.' },
        ]}
      },
      {
        id: 'purity-identity',
        title: 'Sexuality, Purity & Identity',
        description: 'God\'s design and everyday faithfulness.',
        ageGated: true,
        lessons: [
          { id: 'purity-1', title: 'God\'s Design for Sex', duration: '5 min', body: `<h4>Made Good, Designed Specifically</h4><p>Sex is a gift from God — designed for the lifelong covenant of marriage between a man and a woman. Within that context, it\'s deeply good. Outside it, it tends to cause damage — not because God is restrictive, but because the design is specific.</p>`, scriptureRefs: ['Genesis 2:24', 'Matthew 19:4-6', '1 Corinthians 6:18-20'], reflectionPrompt: 'How does treating sex as a gift change how you think about it?' },
          { id: 'purity-2', title: 'Identity in Christ, Not in Desire', duration: '5 min', body: `<h4>You Are Not Your Feelings</h4><p>The world says you ARE your sexuality, your attraction, your urges. The Bible says you are a child of God FIRST — and what you do with desire is a matter of stewardship and obedience, not identity. This is hard, especially today, but it\'s also liberating: your worth isn\'t tied to what you feel.</p>`, scriptureRefs: ['1 Corinthians 6:11', 'Galatians 2:20'], reflectionPrompt: 'Where have you let a feeling become an identity? What would change if you held it more loosely?' },
          { id: 'purity-3', title: 'Lust and Pornography', duration: '4 min', body: `<h4>Honest Naming</h4><p>Lust treats people as objects for consumption. Pornography rewires the brain, harms real intimacy, and traps users (and the people in the content). Jesus took it seriously — "everyone who looks at a woman with lustful intent" (Matthew 5:28). Fight it with confession, accountability, content blockers, and replacing the pattern with prayer.</p>`, scriptureRefs: ['Matthew 5:28', 'Job 31:1', '1 Thessalonians 4:3-5'], reflectionPrompt: 'If lust is a struggle for you, who knows? If no one, that\'s the first thing to change.' },
          { id: 'purity-4', title: 'Singleness and Waiting', duration: '5 min', body: `<h4>Singleness Is Not Second-Class</h4><p>Jesus and Paul were both single. Paul called singleness a gift (1 Cor 7). Singleness can be a season of focused mission, deeper friendships, undivided devotion. If you\'re single — willing or not — you are not waiting to start your real life. You\'re in it.</p>`, scriptureRefs: ['1 Corinthians 7:7-8', 'Matthew 19:11-12'], reflectionPrompt: 'How have you been treating singleness as a holding pattern instead of a season?' },
          { id: 'purity-5', title: 'Marriage as Mission', duration: '4 min', body: `<h4>Bigger Than Romance</h4><p>Christian marriage isn\'t mainly about happiness — it\'s about holiness and witness. Two sinners forming a one-flesh union, displaying God\'s love to the world, growing more like Jesus through daily refining. Hard, beautiful, mission-shaped.</p>`, scriptureRefs: ['Ephesians 5:22-33', 'Genesis 2:24'], reflectionPrompt: 'If you\'re married, what does Jesus see in your marriage right now? If you\'re single, what marriage example shaped your view?' },
        ],
        quiz: { id: 'purity-quiz', passThreshold: 0.8, questions: [
          { q: 'God\'s design for sex is…', options: ['Anywhere love is', 'The lifelong covenant of marriage between a man and a woman', 'Outdated', 'Whatever feels right'], correctIdx: 1, explanation: 'Genesis 2:24 and Matthew 19 are the clear biblical pattern. Within marriage, sex is a gift; the design is specific.' },
          { q: 'According to Scripture, your identity is rooted in…', options: ['Your sexuality', 'Your desires', 'Being a child of God in Christ', 'Cultural categories'], correctIdx: 2, explanation: '1 Corinthians 6:11 — "such were some of you, but you were washed." Desire isn\'t identity; sonship is.' },
          { q: 'Jesus taught that lust…', options: ['Is harmless if not acted on', 'Is the seed of adultery — looking with lustful intent already crosses the line', 'Doesn\'t exist', 'Is unavoidable'], correctIdx: 1, explanation: 'Matthew 5:28. Jesus locates the heart issue, not just behavior. The fight is at the level of the imagination.' },
          { q: 'Paul described singleness as…', options: ['Punishment', 'A gift', 'Always temporary', 'A defect'], correctIdx: 1, explanation: '1 Corinthians 7:7 — Paul calls his own singleness a gift. Singleness is a season for full devotion, not a holding pattern.' },
          { q: 'Christian marriage exists mainly for…', options: ['Personal happiness', 'Holiness, witness, and one-flesh union displaying God\'s love', 'Tax benefits', 'Social pressure'], correctIdx: 1, explanation: 'Ephesians 5 — marriage points to Christ and the church. Hard, beautiful, mission-shaped — happiness is a fruit, not the root.' },
        ]}
      },
    ]
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 4 — Topical Deep Dives
  // ════════════════════════════════════════════════════════════
  {
    id: 'topical',
    title: 'Topical Deep Dives',
    icon: '💎',
    color: '#38bdf8',
    description: 'Hard questions. Honest answers. Anchored in Scripture.',
    badgeId: 'wisdom-seeker',
    badgeLabel: 'Wisdom Seeker',
    badgeIcon: '💎',
    courses: [
      {
        id: 'anxiety-scripture',
        title: 'Anxiety & Scripture',
        description: 'What the Bible says when your mind won\'t stop.',
        lessons: [
          { id: 'anxiety-1', title: 'The Bible Doesn\'t Shame Anxiety', duration: '4 min', body: `<h4>Even Jesus Felt It</h4><p>In Gethsemane, Jesus was in agony — sweating drops like blood, asking the Father if there was any other way (Luke 22:44). Paul described "outward troubles, inward fears" (2 Cor 7:5). The Bible doesn\'t shame anxiety. It speaks into it.</p>`, scriptureRefs: ['Luke 22:44', '2 Corinthians 7:5', 'Matthew 26:38'], reflectionPrompt: 'What if your anxiety is something Jesus knows by experience, not just by knowledge?' },
          { id: 'anxiety-2', title: 'Philippians 4 — A Pattern, Not a Pep Talk', duration: '5 min', body: `<h4>Three Practices</h4><p>"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God" (Phil 4:6). <b>Pray</b> — bring it to God. <b>Specifically</b> — name it; don\'t generalize. <b>With thanksgiving</b> — anchor in what you know. The peace of God (v. 7) follows the practice, not feelings.</p>`, scriptureRefs: ['Philippians 4:6-9'], reflectionPrompt: 'Try praying tonight: name 3 specific worries, then 3 specific things you\'re grateful for. Note what shifts.' },
          { id: 'anxiety-3', title: 'When It\'s More Than a Bad Day', duration: '4 min', body: `<h4>Mental Health Matters</h4><p>Sometimes anxiety is a season; sometimes it\'s a chronic condition. Both are real. Christians shouldn\'t shame people for getting therapy, taking medication, or seeing a doctor any more than for treating diabetes. God uses Scripture, prayer, community, AND professional help. Pursue all of it.</p>`, scriptureRefs: ['Luke 5:31', 'Galatians 6:2'], reflectionPrompt: 'Have you been treating mental health as less spiritual than physical health? What would you tell a friend with the same symptoms?' },
          { id: 'anxiety-4', title: 'The Long Game — Renewing Your Mind', duration: '4 min', body: `<h4>Anxiety Patterns Are Trained</h4><p>Romans 12:2 — "be transformed by the renewing of your mind." Anxious thinking creates ruts. The way out is steady reformation: Scripture absorbed daily, gratitude practiced, lies named and replaced with truth, community that knows you, sleep, exercise, less news. Slow, repeated, patient. The brain rewires.</p>`, scriptureRefs: ['Romans 12:2', '2 Corinthians 10:5'], reflectionPrompt: 'Pick one practice (prayer, gratitude, Scripture, sleep, less news) and commit to it for two weeks.' },
        ],
        quiz: { id: 'anxiety-quiz', passThreshold: 0.8, questions: [
          { q: 'Did Jesus ever feel anxious?', options: ['No, He was God', 'Yes — Gethsemane records agony, sweat like drops of blood', 'Only emotionally, not physically', 'Unknown'], correctIdx: 1, explanation: 'Luke 22:44 — Jesus knows anxiety by experience. Hebrews 4:15 — He sympathizes with our weaknesses.' },
          { q: 'Philippians 4:6 prescribes what three practices?', options: ['Pray, specifically, with thanksgiving', 'Hide, deny, suppress', 'Worry harder, then release', 'Talk to one person, journal, sleep'], correctIdx: 0, explanation: 'Pray, name it specifically, anchor in thanksgiving. The peace of God follows the practice.' },
          { q: 'Christians who experience chronic anxiety should…', options: ['Just pray harder', 'Pursue Scripture, prayer, community AND professional help (therapy, medication)', 'Avoid medication as unspiritual', 'Hide it'], correctIdx: 1, explanation: 'Mental health matters. God uses many means — including doctors, therapists, and medication. Refusing them isn\'t more spiritual.' },
          { q: 'According to Romans 12:2, transformation comes through…', options: ['One-time conversion', 'Renewing of the mind — repeated, patient, steady', 'Avoiding anxiety triggers', 'Suppression'], correctIdx: 1, explanation: 'Anxious patterns are trained. Renewal is also trained — daily Scripture, truth replacing lies, community, healthy rhythms.' },
          { q: 'The peace of God (Phil 4:7) comes…', options: ['Before you act', 'After you practice the discipline', 'When circumstances change', 'Only in heaven'], correctIdx: 1, explanation: 'Verses 6 and 7 are linked — practice the discipline, peace follows. Feelings catch up to obedience.' },
        ]}
      },
      {
        id: 'identity-christ',
        title: 'Identity in Christ',
        description: 'Who you are when no one is watching.',
        lessons: [
          { id: 'identity-1', title: 'You Are Loved Before You Performed', duration: '4 min', body: `<h4>The Order Matters</h4><p>At Jesus\'s baptism — before he\'d preached one sermon or done one miracle — the Father said, "This is my beloved Son, with whom I am well pleased" (Matthew 3:17). Loved first. Sent second. The same order applies to you. Performance doesn\'t earn love. Love empowers performance.</p>`, scriptureRefs: ['Matthew 3:17', '1 John 3:1'], reflectionPrompt: 'What identity have you been earning instead of receiving?' },
          { id: 'identity-2', title: 'New Creation', duration: '4 min', body: `<h4>The Old Has Gone</h4><p>"If anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come" (2 Cor 5:17). Not "polished version" — new creation. Your worst days don\'t define you. Your past doesn\'t imprison you. The Spirit is rebuilding you.</p>`, scriptureRefs: ['2 Corinthians 5:17', 'Galatians 2:20'], reflectionPrompt: 'What old identity (failure, victim, screw-up) keeps resurrecting? What new identity does Scripture name instead?' },
          { id: 'identity-3', title: 'The Lies and the Truths', duration: '4 min', body: `<h4>Common Lies</h4><p>"I\'m worthless." "I\'m unforgivable." "I\'m too far gone." "I have to be perfect." <b>Truths to memorize:</b> "I am chosen" (1 Peter 2:9). "I am forgiven" (Eph 1:7). "I am God\'s workmanship" (Eph 2:10). "I am loved" (Rom 8:38-39). Catch the lie. Speak the truth back.</p>`, scriptureRefs: ['Ephesians 1:3-14', '1 Peter 2:9', 'Romans 8:38-39'], reflectionPrompt: 'What\'s the one lie you most often believe? Find a Scripture that directly counters it. Memorize it.' },
          { id: 'identity-4', title: 'Living from Identity', duration: '4 min', body: `<h4>Behavior Follows Belief</h4><p>The biggest source of bad behavior isn\'t lack of effort — it\'s identity confusion. People who feel orphaned act like orphans. People who know they\'re children of God act like children of God. Grow your identity through Scripture, prayer, community — and watch behavior follow.</p>`, scriptureRefs: ['Romans 8:14-17', 'Colossians 3:1-3'], reflectionPrompt: 'What part of your behavior is downstream from a wrong identity? What identity does Scripture offer in its place?' },
        ],
        quiz: { id: 'identity-quiz', passThreshold: 0.8, questions: [
          { q: 'At Jesus\'s baptism, the Father affirmed Him…', options: ['After He\'d preached sermons', 'Before He\'d done public ministry', 'Only after His resurrection', 'Conditionally'], correctIdx: 1, explanation: 'Matthew 3:17 — Father affirmed Jesus before any public ministry. Loved first, sent second. Same pattern for us.' },
          { q: '2 Corinthians 5:17 says you are…', options: ['A polished version of yourself', 'A new creation — old gone, new come', 'Slightly improved', 'Trying harder'], correctIdx: 1, explanation: 'Not improvement — new creation. The Spirit doesn\'t fix the old self; He raises a new one.' },
          { q: 'When you believe the lie "I\'m too far gone," the biblical counter is…', options: ['Try harder', '"I am forgiven" (Eph 1:7)', 'Hide', 'Argue'], correctIdx: 1, explanation: 'Catch the lie. Speak the truth. Ephesians 1:7 names redemption and the forgiveness of sins as already accomplished, not pending.' },
          { q: 'Bad behavior is most often downstream from…', options: ['Lack of willpower', 'Identity confusion', 'Lack of rules', 'Bad influences'], correctIdx: 1, explanation: 'People who feel orphaned act like orphans. Identity drives behavior, not the reverse. Grow identity, behavior follows.' },
          { q: 'Living from identity means…', options: ['Earning identity', 'Behavior flowing out of who Scripture says you already are', 'Pretending you\'re fine', 'Self-help'], correctIdx: 1, explanation: 'You don\'t behave to become a child of God; you behave because you are one. Identity precedes action.' },
        ]}
      },
      {
        id: 'suffering-hope',
        title: 'Suffering & Hope',
        description: 'Real grief. Real hope. Held together.',
        lessons: [
          { id: 'suffering-1', title: 'Why Does God Allow It?', duration: '5 min', body: `<h4>The Hardest Question</h4><p>The Bible doesn\'t fully answer it — but offers something better than an explanation: presence. God enters suffering rather than just commenting on it. Jesus weeps at Lazarus\'s tomb (John 11:35) — even though He knew the resurrection was minutes away. Tears were appropriate.</p>`, scriptureRefs: ['John 11:35', 'Hebrews 4:15', 'Romans 8:18-25'], reflectionPrompt: 'What if God\'s answer to your suffering isn\'t mainly explanation but presence?' },
          { id: 'suffering-2', title: 'Lament — Permission to Grieve Loud', duration: '4 min', body: `<h4>One-Third of the Psalms</h4><p>The Bible models loud grief. "How long, O LORD, will you forget me forever?" (Ps 13:1). "My God, my God, why have you forsaken me?" (Ps 22:1 — quoted by Jesus on the cross). Lament isn\'t doubt — it\'s honest faith refusing to pretend.</p>`, scriptureRefs: ['Psalm 13', 'Psalm 22', 'Lamentations 3:1-24'], reflectionPrompt: 'Pray a lament tonight — name the pain to God without dressing it up.' },
          { id: 'suffering-3', title: 'God Uses Suffering', duration: '4 min', body: `<h4>Not the Cause, But the Refining</h4><p>God doesn\'t cause every painful thing — but He uses everything. Romans 5:3-5 — suffering produces endurance, character, hope. James 1:2-4 — testing produces steadfastness. Not because pain is good, but because God is. He doesn\'t waste anything.</p>`, scriptureRefs: ['Romans 5:3-5', 'James 1:2-4', '2 Corinthians 4:17'], reflectionPrompt: 'Look back at a past hardship. What did God grow in you through it that you wouldn\'t trade?' },
          { id: 'suffering-4', title: 'The Hope That Doesn\'t Disappoint', duration: '4 min', body: `<h4>Not Wishful Thinking</h4><p>Christian hope is anchored in something that already happened — the resurrection. Because Jesus rose, every grief is real but not final. "He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning, nor crying, nor pain anymore" (Rev 21:4). Hold both: the grief AND the certainty that joy comes.</p>`, scriptureRefs: ['Romans 5:5', 'Revelation 21:4', '1 Peter 1:3-9'], reflectionPrompt: 'What grief are you holding that needs both honest tears AND eternal hope?' },
        ],
        quiz: { id: 'suffering-quiz', passThreshold: 0.8, questions: [
          { q: 'When Jesus wept at Lazarus\'s tomb (John 11:35), what does it teach us?', options: ['He was unsure of His power', 'Tears are appropriate even when resurrection is coming', 'Grief is unspiritual', 'He didn\'t actually weep'], correctIdx: 1, explanation: 'Jesus knew He was about to raise Lazarus AND wept anyway. Grief and hope coexist. Tears aren\'t a sign of weak faith.' },
          { q: 'What percentage of the Psalms include lament?', options: ['About 5%', 'About 10%', 'About one-third', 'None'], correctIdx: 2, explanation: 'Roughly a third of the Psalms are lament. The Bible models loud, honest grief — not papered-over piety.' },
          { q: 'According to Romans 5:3-5, suffering produces…', options: ['Bitterness', 'Endurance, character, hope', 'Despair', 'Avoidance'], correctIdx: 1, explanation: 'A chain: suffering → endurance → character → hope. God uses what He doesn\'t cause.' },
          { q: 'Christian hope is anchored in…', options: ['Wishful thinking', 'The resurrection — something that already happened', 'Personal optimism', 'Future possibility'], correctIdx: 1, explanation: '1 Peter 1:3 — "a living hope through the resurrection." Christian hope rests on a historical event, not feelings.' },
          { q: 'Revelation 21:4 promises…', options: ['Heaven on earth now', 'Every tear wiped away, no more death or pain', 'Suffering forever', 'Reincarnation'], correctIdx: 1, explanation: 'The Bible\'s last word on suffering: it ends. Permanently. Every tear, every death, every pain — gone.' },
        ]}
      },
      {
        id: 'forgiveness',
        title: 'Forgiveness',
        description: 'Real, hard, biblical forgiveness — given and received.',
        lessons: [
          { id: 'forgive-1', title: 'What Forgiveness Is (and Isn\'t)', duration: '4 min', body: `<h4>Two Common Confusions</h4><p>Forgiveness is NOT forgetting, excusing, restoring full trust, or denying that wrong happened. It IS a deliberate release of the right to revenge — handing the case over to God. <i>"Beloved, never avenge yourselves, but leave it to the wrath of God"</i> (Romans 12:19).</p>`, scriptureRefs: ['Romans 12:17-21', 'Ephesians 4:32'], reflectionPrompt: 'Have you been confusing forgiveness with forgetting or excusing?' },
          { id: 'forgive-2', title: 'How God Forgives Us', duration: '4 min', body: `<h4>The Pattern</h4><p>Not "I\'ll overlook this if you do better" — God forgave at His own cost. The cross is the price of forgiveness, not its avoidance. <i>"Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you"</i> (Eph 4:32). The same pattern: at our cost, we release.</p>`, scriptureRefs: ['Ephesians 4:32', 'Colossians 3:13', '1 John 1:9'], reflectionPrompt: 'What does it cost you to forgive the person who hurt you? Are you willing to pay it?' },
          { id: 'forgive-3', title: 'When They Don\'t Apologize', duration: '4 min', body: `<h4>Forgiveness Is For You</h4><p>Waiting for an apology gives the offender ongoing power. Forgiveness is something you do regardless — for the freedom of your own heart. Bitterness is poison you drink while waiting for the other person to die. Reconciliation requires both parties; forgiveness requires only one.</p>`, scriptureRefs: ['Mark 11:25', 'Hebrews 12:15'], reflectionPrompt: 'Is there someone you\'ve been holding bitterness toward who hasn\'t apologized? What would forgiveness without their apology look like?' },
          { id: 'forgive-4', title: 'Forgiving Yourself', duration: '4 min', body: `<h4>If God Has, You Can</h4><p>Sometimes the hardest person to forgive is the one in the mirror. But staying in self-condemnation isn\'t humility — it\'s pride saying your sin is bigger than the cross. <i>"There is therefore now no condemnation for those who are in Christ Jesus"</i> (Romans 8:1). Trust the verdict.</p>`, scriptureRefs: ['Romans 8:1', '1 John 1:9', 'Psalm 103:12'], reflectionPrompt: 'What past failure are you still flogging yourself for? Speak the truth: "If God has forgiven me, I receive His forgiveness."' },
        ],
        quiz: { id: 'forgive-quiz', passThreshold: 0.8, questions: [
          { q: 'Forgiveness is NOT…', options: ['Releasing revenge', 'Forgetting or excusing', 'Possible without an apology', 'A choice'], correctIdx: 1, explanation: 'Forgiveness doesn\'t require forgetting, excusing, or denying harm. It\'s a deliberate release of the right to revenge.' },
          { q: 'God forgave us at…', options: ['No cost — He just overlooked sin', 'His own cost — the cross', 'Our cost', 'Conditionally'], correctIdx: 1, explanation: 'The cross is the price of forgiveness, not its avoidance. We\'re called to forgive at our cost — like He did.' },
          { q: 'Reconciliation requires both parties; forgiveness…', options: ['Also requires both', 'Requires only one', 'Is impossible', 'Always brings restoration'], correctIdx: 1, explanation: 'You can forgive without the other person changing. Reconciliation may or may not follow — that requires both. Forgiveness frees YOU.' },
          { q: 'Bitterness is best described as…', options: ['Justice', 'Poison you drink while waiting for the other person to die', 'Healthy boundary', 'Christian virtue'], correctIdx: 1, explanation: 'Bitterness corrodes the holder. Hebrews 12:15 — "no root of bitterness springs up and causes trouble."' },
          { q: 'Romans 8:1 says…', options: ['Some condemnation remains', 'There is now no condemnation for those in Christ Jesus', 'Self-condemnation is humility', 'Only major sins are forgiven'], correctIdx: 1, explanation: 'Self-condemnation isn\'t humility — it\'s pride saying your sin is bigger than the cross. Trust the verdict.' },
        ]}
      },
    ]
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 5 — For Families (parent-only)
  // ════════════════════════════════════════════════════════════
  {
    id: 'families',
    title: 'For Families',
    icon: '🏡',
    color: '#fb923c',
    description: 'Discipling kids and teens day to day.',
    badgeId: 'family-shepherd',
    badgeLabel: 'Family Shepherd',
    badgeIcon: '🏡',
    parentOnly: true,
    courses: [
      {
        id: 'family-rhythms',
        title: 'Family Devotional Rhythms',
        description: 'Building habits that actually stick.',
        lessons: [
          { id: 'family-1', title: 'Why Rhythms Beat Lessons', duration: '4 min', body: `<h4>What Kids Remember</h4><p>Kids forget most of what you tell them. They remember what you DO. Eating dinner together. Praying before bed. The way you respond when you\'re wrong. Discipleship at home is mostly built into ordinary rhythms — not separate "spiritual" lectures.</p>`, scriptureRefs: ['Deuteronomy 6:6-9'], reflectionPrompt: 'What rhythm in your home already teaches your kids about God (good or bad)?' },
          { id: 'family-2', title: 'The Five-Minute Devotional', duration: '4 min', body: `<h4>Don\'t Aim Big</h4><p>The best family devotional is the one you\'ll actually do. Five minutes. After dinner or before bed. Read one passage. Ask one question. Pray one prayer. Better five minutes daily than thirty minutes once that gets dropped after two weeks.</p>`, scriptureRefs: ['Deuteronomy 6:7'], reflectionPrompt: 'When in your daily routine could you carve out 5 minutes? Pick the time, not just the intention.' },
          { id: 'family-3', title: 'Age-Appropriate Engagement', duration: '4 min', body: `<h4>Different Ages, Different Tools</h4><p><b>Toddlers/Preschool</b>: stories, songs, simple prayers. <b>Elementary</b>: kid Bibles, asking what they noticed, picture-based prompts. <b>Middle school</b>: harder questions welcomed, concept-driven, room to disagree. <b>Teens</b>: real conversations about doubt, sex, justice, identity. Don\'t talk down. Don\'t avoid hard topics.</p>`, scriptureRefs: ['Proverbs 22:6', 'Ephesians 6:4'], reflectionPrompt: 'For each kid in your home, what\'s the right level of engagement right now?' },
          { id: 'family-4', title: 'When Kids Don\'t Want To', duration: '4 min', body: `<h4>The Long Game</h4><p>Some seasons your kid will love family devotionals; some seasons they\'ll roll their eyes. Both are normal. Stay consistent without being heavy-handed. The point isn\'t to manufacture enthusiasm — it\'s to model that this matters. Decades from now, what they\'ll remember is that you didn\'t give up.</p>`, scriptureRefs: ['Galatians 6:9'], reflectionPrompt: 'Are you persisting through resistance, or have you been quietly giving up?' },
        ],
        quiz: { id: 'family-rhythms-quiz', passThreshold: 0.8, questions: [
          { q: 'Kids mostly learn from…', options: ['Lectures', 'What you do in ordinary moments', 'Sunday sermons', 'Christian movies'], correctIdx: 1, explanation: 'Deuteronomy 6 prescribes rhythm — "when you sit, walk, lie down, rise up." Discipleship is mostly built into life, not extracted from it.' },
          { q: 'The best family devotional is…', options: ['Long and thorough', 'Whatever you\'ll actually do — even 5 minutes daily', 'Once a week, intense', 'Led by an expert'], correctIdx: 1, explanation: 'Five minutes daily beats thirty minutes once. Consistency wins over intensity for kids.' },
          { q: 'When teaching teens, you should…', options: ['Avoid hard topics', 'Welcome real conversations including doubt and disagreement', 'Talk down to them', 'Refer them to youth pastor only'], correctIdx: 1, explanation: 'Teens know when you\'re dodging. Welcome the hard questions. Don\'t outsource discipleship.' },
          { q: 'When kids resist family devotionals, you should…', options: ['Force enthusiasm', 'Stop entirely', 'Stay consistent without heavy-handedness', 'Bribe them'], correctIdx: 2, explanation: 'Persistence without coercion. They\'ll remember decades later that you didn\'t give up.' },
          { q: 'Discipleship at home is built mostly through…', options: ['Lectures', 'Rhythms — bedtime, meals, conversations', 'Bible study materials only', 'Once-a-year retreats'], correctIdx: 1, explanation: 'Rhythms shape kids more than content does. The point is presence and consistency, not perfect curriculum.' },
        ]}
      },
      {
        id: 'talking-teens',
        title: 'Talking to Teens About Faith',
        description: 'Real conversations with the young people who matter most.',
        lessons: [
          { id: 'teens-1', title: 'Listen Before You Teach', duration: '4 min', body: `<h4>Earn the Right</h4><p>Teens spot performance instantly. Before sharing your views, find out what they actually think. Ask better questions. "What do your friends believe about ___?" "What questions do you have that nobody answers?" "What would you change about church if you could?" Listening = love.</p>`, scriptureRefs: ['James 1:19'], reflectionPrompt: 'When was the last time you asked your teen a real spiritual question and just listened?' },
          { id: 'teens-2', title: 'Don\'t Panic When They Doubt', duration: '4 min', body: `<h4>Doubt Is Often the Way Through</h4><p>Teens questioning faith aren\'t losing it — they\'re owning it. Many adults who are strong Christians went through deep doubt as teens. Welcome the questions. Don\'t shame them. Recommend resources (Tim Keller\'s "Reason for God," Lewis\'s "Mere Christianity"). Stay relationally close.</p>`, scriptureRefs: ['Mark 9:24', 'Jude 1:22'], reflectionPrompt: 'When your teen expressed doubt, did you respond with panic or curiosity? Which builds trust?' },
          { id: 'teens-3', title: 'The Hot Topics — Engage, Don\'t Lecture', duration: '5 min', body: `<h4>The Big Three</h4><p><b>Sexuality + identity</b>: lead with Genesis 1 (made in God\'s image, deeply loved). <b>Justice + politics</b>: separate the gospel from political tribe; teens detect mixed loyalties. <b>Suffering + hard questions about God</b>: don\'t flinch. Acknowledge tension. Bring honest answers, not pat ones. Show your own questions.</p>`, scriptureRefs: ['1 Peter 3:15'], reflectionPrompt: 'Of the big three, which do you most avoid because you\'re unsure how to handle it?' },
          { id: 'teens-4', title: 'When You\'ve Failed', duration: '4 min', body: `<h4>Repent Loud</h4><p>If you blew up at your teen, lied, modeled hypocrisy — apologize specifically. "I was wrong when I…" Don\'t hedge. Don\'t blame them. Teens watch this carefully. A parent who repents teaches more about the gospel than a thousand sermons. Apologies aren\'t weakness — they\'re strength.</p>`, scriptureRefs: ['Ephesians 6:4'], reflectionPrompt: 'Is there an apology you\'ve been owing your teen? When will you give it?' },
          { id: 'teens-5', title: 'Pray For Them — and With Them', duration: '4 min', body: `<h4>The Spiritual Layer</h4><p>Pray daily for each kid by name — for their faith, their friends, their future spouse, their character. When appropriate, pray WITH them — out loud, brief, real. Not weird. Not long. Just real. They\'ll remember it.</p>`, scriptureRefs: ['1 Samuel 1:27-28', 'Colossians 4:2'], reflectionPrompt: 'Are you praying daily for each of your kids by name? If not, start tonight.' },
        ],
        quiz: { id: 'teens-quiz', passThreshold: 0.8, questions: [
          { q: 'Before sharing views with teens, you should…', options: ['Lecture them', 'Listen and ask questions about what THEY think', 'Outsource to youth pastor', 'Avoid the topic'], correctIdx: 1, explanation: 'James 1:19 — quick to listen, slow to speak. Teens detect performance and earn the right approach with curiosity.' },
          { q: 'When a teen expresses doubt, the right response is…', options: ['Panic', 'Welcome it; doubt is often the way through to owning faith', 'Punish them', 'Cut off the conversation'], correctIdx: 1, explanation: 'Doubt that engages is part of faith maturing. Many strong Christian adults walked through deep teen doubt.' },
          { q: 'On hot topics like sexuality and politics, parents should…', options: ['Avoid them entirely', 'Lecture loudly', 'Engage thoughtfully — biblical truth + relational warmth, no political tribe-mixing', 'Defer to school'], correctIdx: 2, explanation: 'Teens detect mixed loyalties when politics and gospel get blended. Lead with biblical truth and humility.' },
          { q: 'When you\'ve failed your teen as a parent, you should…', options: ['Pretend it didn\'t happen', 'Apologize specifically without hedging', 'Blame them', 'Wait for them to forget'], correctIdx: 1, explanation: 'A parent who repents teaches the gospel more than sermons. Specific apologies build trust.' },
          { q: 'Praying for your teen should be…', options: ['Once a year', 'Daily, by name, for specific things', 'Done by the church only', 'Optional'], correctIdx: 1, explanation: 'Daily, named, specific. Their faith, friends, character, future. Prayer is the spiritual layer behind every other layer.' },
        ]}
      },
      {
        id: 'praying-kids',
        title: 'Praying With Your Kids',
        description: 'Modeling honest conversation with God.',
        lessons: [
          { id: 'praykid-1', title: 'Make It Normal, Not Weird', duration: '4 min', body: `<h4>Pray Like a Person</h4><p>Don\'t pray like a pastor. Don\'t pray fancy. Just talk to God. "God, thanks for today. Help me with the meeting tomorrow. Please be with the kids when they\'re scared. Amen." Kids learn that God is approachable when you pray approachably.</p>`, scriptureRefs: ['Matthew 6:7'], reflectionPrompt: 'Has your prayer style with kids accidentally taught them God is formal and far?' },
          { id: 'praykid-2', title: 'Pray About Real Things', duration: '4 min', body: `<h4>Specifics Matter</h4><p>Pray for the soccer game, the fight with their friend, the hard test, grandma\'s health. Not just generic "bless our day." When God answers specifics, kids notice. When He doesn\'t answer the way they wanted, that\'s also a faith-shaping moment to walk through.</p>`, scriptureRefs: ['Philippians 4:6'], reflectionPrompt: 'What specific thing in your kid\'s life have you been forgetting to pray about?' },
          { id: 'praykid-3', title: 'Let Them Pray', duration: '4 min', body: `<h4>Their Words, Not Yours</h4><p>Even toddlers can pray — short, simple, in their own voice. Let them. Don\'t correct theology mid-prayer. Don\'t finish their thoughts. Affirm. Their first prayers shape their lifelong picture of God. Make those moments warm, not anxious.</p>`, scriptureRefs: ['Matthew 19:14'], reflectionPrompt: 'When did you last let your kid pray out loud without coaching them?' },
        ],
        quiz: { id: 'praykid-quiz', passThreshold: 0.8, questions: [
          { q: 'When praying with kids, you should…', options: ['Use formal language to teach reverence', 'Talk to God conversationally so they learn He\'s approachable', 'Make prayers long', 'Quote Scripture exclusively'], correctIdx: 1, explanation: 'Matthew 6:7 — "do not heap up empty phrases." Approachable God = approachable prayer.' },
          { q: 'Praying about specific things teaches kids…', options: ['God is busy', 'God cares about their actual life', 'Prayer is for big things only', 'God will always say yes'], correctIdx: 1, explanation: 'When you pray about the soccer game and the test, kids learn God\'s involved in real life — not just Sunday morning.' },
          { q: 'When letting your kid pray out loud, you should…', options: ['Correct their theology mid-prayer', 'Affirm and let their voice form', 'Finish their thoughts for them', 'Discourage it until they\'re older'], correctIdx: 1, explanation: 'Matthew 19:14 — "let the children come." Their first prayers shape their picture of God. Make it warm.' },
        ]}
      },
      {
        id: 'teen-doubts',
        title: 'When Your Teen Doubts',
        description: 'The crisis that\'s often the breakthrough.',
        lessons: [
          { id: 'tdoubt-1', title: 'Don\'t Take It Personally', duration: '4 min', body: `<h4>It\'s Not About You</h4><p>When a teen doubts, the parent\'s instinct is panic — "did I fail?" Most teen doubt isn\'t about parenting; it\'s normal developmental wrestling. Take a breath. Don\'t make it about you. Make space for them to think out loud without your defensive reaction in the way.</p>`, scriptureRefs: ['Proverbs 18:13'], reflectionPrompt: 'When your teen doubts, do you process it as their journey or as your failure?' },
          { id: 'tdoubt-2', title: 'Categorize the Doubt', duration: '4 min', body: `<h4>Different Types, Different Help</h4><p><b>Intellectual</b> doubt → good books and thinking believers. <b>Emotional</b> doubt → presence, prayer, time. <b>Moral</b> doubt (anger at the church, hypocrisy) → distinguishing Jesus from the church, often through stories of redemption. Don\'t apply intellectual answers to emotional pain or vice versa.</p>`, scriptureRefs: ['Jude 1:22'], reflectionPrompt: 'What category fits your teen\'s current doubt? Are you offering the right kind of help?' },
          { id: 'tdoubt-3', title: 'Recommend, Don\'t Assign', duration: '4 min', body: `<h4>Curate Without Forcing</h4><p>Hand your teen a great book. Suggest a podcast. Offer a thinking adult mentor. But don\'t assign it like homework. Faith forced is faith resisted. Faith offered with respect is more often received.</p>`, scriptureRefs: ['Galatians 5:22-23'], reflectionPrompt: 'What\'s one resource you could put within reach for your teen this month — without pressuring?' },
          { id: 'tdoubt-4', title: 'Your Faith Is the Strongest Argument', duration: '4 min', body: `<h4>You Are the Living Apologetic</h4><p>What your teen sees in you when nobody\'s looking — peace under stress, grace when wronged, joy in hard seasons — preaches louder than any book. Your daily life either confirms or contradicts what you\'ve told them about Jesus. Live it. They\'re watching.</p>`, scriptureRefs: ['Philippians 4:9'], reflectionPrompt: 'What does your daily life teach your teen about whether Jesus is real? Honest answer.' },
        ],
        quiz: { id: 'tdoubt-quiz', passThreshold: 0.8, questions: [
          { q: 'When a teen expresses doubt, the parent\'s first task is to…', options: ['Argue them back', 'Make space without taking it personally', 'Send them to youth pastor', 'Punish them'], correctIdx: 1, explanation: 'Most teen doubt is normal development. Panic shuts down conversation. Space invites it.' },
          { q: 'Different doubt categories require…', options: ['The same answer', 'Different responses (intellectual, emotional, moral)', 'Always books', 'Always prayer alone'], correctIdx: 1, explanation: 'Don\'t answer emotional pain with intellectual proofs, or vice versa. Match the help to the type.' },
          { q: 'Resources for doubting teens should be…', options: ['Forced as homework', 'Offered with respect, not assigned', 'Withheld', 'Only from the pastor'], correctIdx: 1, explanation: 'Faith forced is faith resisted. Curate, suggest, hand over — but don\'t coerce.' },
          { q: 'The strongest argument for your teen\'s faith is…', options: ['A famous apologist', 'Your daily life when they\'re watching', 'A youth retreat', 'Christian school'], correctIdx: 1, explanation: 'Your peace, grace, joy, and integrity in ordinary life either confirm or contradict everything you\'ve told them.' },
        ]}
      },
    ]
  },
];

if (typeof window !== 'undefined') {
  window.FAITH_ACADEMY_CURRICULUM = FAITH_ACADEMY_CURRICULUM;
}
