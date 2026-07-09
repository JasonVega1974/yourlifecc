// mans-questions.js — "Man's Questions, God's Answers"
// 35 honest questions people actually ask about God, faith, and Jesus,
// answered warmly from Scripture. 3 categories.
//
// DRAFT CONTENT — AI-authored 2026-07-08, pending pastoral/church-
// leadership review. The reading surface (mans-questions-ui.js) shows a
// "Draft teaching — being reviewed with church leadership" note on every
// answer until that review lands. Sensitive entries (hell, hypocrisy,
// other religions, sexuality, Old Testament violence) are written for
// grace + truth and should get particular attention in review.
//
// Shape consumed by mans-questions-ui.js:
//   MQ_CATEGORIES:  { id, label, icon, sub }
//   MANS_QUESTIONS: { id, category, question, hook, answer[], scriptures[{ref,text}], goDeeper? }
//   goDeeper (optional): 'dest:proof' | 'dest:walk' | 'dest:jesus' | 'dest:mystery'

const MQ_CATEGORIES = [
  { id:'is-it-true',  label:'Is It Even True?',          icon:'🔍', sub:'The evidence, the resurrection, and whether any of it holds up.' },
  { id:'what-about',  label:'But What About…?',          icon:'🤔', sub:'Suffering, hell, science, other religions, hypocrites.' },
  { id:'what-for-me', label:'What Does It Mean For Me?', icon:'💗', sub:'Doubt, forgiveness, purpose — and where to even start.' },
];

const MANS_QUESTIONS = [
  // ── IS IT EVEN TRUE? ────────────────────────────────────
  {
    id:'does-god-exist',
    category:'is-it-true',
    question:'Is there actually any reason to believe God exists?',
    hook:'Not blind faith — reasons.',
    answer:[
      "Yes — and they're worth taking seriously, not just feelings. The universe had a beginning, which means something outside of it started it. Its laws are fine-tuned for life with a precision that is hard to wave away as luck. And the fact that you even ask whether things are right or wrong assumes a standard that a purely random universe has no reason to contain.",
      "None of that forces you to believe. But the honest posture isn't \"there's no evidence\" — it's \"here is a real question, and it deserves a real look.\" Christianity claims the Maker of all this didn't stay hidden or distant; He made Himself known.",
    ],
    scriptures:[
      { ref:'Romans 1:20', text:"For his invisible attributes, namely, his eternal power and divine nature, have been clearly perceived, ever since the creation of the world, in the things that have been made." },
      { ref:'Psalm 19:1', text:"The heavens declare the glory of God, and the sky above proclaims his handiwork." },
    ],
    goDeeper:'dest:proof',
  },
  {
    id:'resurrection-real',
    category:'is-it-true',
    question:'Do people seriously believe Jesus rose from the dead?',
    hook:'The whole thing stands or falls here.',
    answer:[
      "Seriously enough that it's the founding claim of the faith. The apostle Paul said plainly: if Jesus didn't rise, Christianity is a waste of everyone's time. He staked it all on a historical event, not a nice idea.",
      "What has to be explained is a cluster of stubborn facts: a tomb that was empty in the very city where the claim was made, a group of frightened followers who suddenly would rather die than deny what they'd seen, and hundreds of people who said they met him alive. Every alternative theory has to account for all of it at once — and that's harder than it sounds.",
    ],
    scriptures:[
      { ref:'1 Corinthians 15:17', text:"And if Christ has not been raised, your faith is futile and you are still in your sins." },
      { ref:'Luke 24:6', text:"He is not here, but has risen." },
    ],
    goDeeper:'dest:proof',
  },
  {
    id:'bible-reliable',
    category:'is-it-true',
    question:"Hasn't the Bible been copied and changed so many times we can't trust it?",
    hook:'Telephone, or transmission?',
    answer:[
      "This assumes a game of telephone — one line of whispers drifting over centuries. That's not how it worked. There are thousands of ancient manuscript copies, from many places and dates, and scholars compare them to reconstruct the original with remarkable confidence. When copies disagree, it's usually spelling or word order, not the message.",
      "You don't have to take that on faith either — it's the ordinary work of textual scholarship, the same discipline applied to any ancient text, and the Bible is by far the best-attested of them all.",
    ],
    scriptures:[
      { ref:'Isaiah 40:8', text:"The grass withers, the flower fades, but the word of our God will stand forever." },
      { ref:'Matthew 24:35', text:"Heaven and earth will pass away, but my words will not pass away." },
    ],
    goDeeper:'dest:proof',
  },
  {
    id:'jesus-historical',
    category:'is-it-true',
    question:'Was Jesus even a real person, or is he a legend?',
    hook:'Even skeptics grant this one.',
    answer:[
      "Almost no serious historian doubts that Jesus of Nazareth lived, taught, gathered followers, and was executed under Pontius Pilate. He's referenced not only by Christians but by non-Christian sources like Tacitus and Josephus, writing within living memory of the events.",
      "The real debate has never been \"did he exist\" — it's \"who was he?\" A teacher? A prophet? Or exactly who he claimed to be? That's the question worth your time.",
    ],
    scriptures:[
      { ref:'John 1:14', text:"And the Word became flesh and dwelt among us, and we have seen his glory." },
      { ref:'Galatians 4:4', text:"But when the fullness of time had come, God sent forth his Son, born of woman." },
    ],
    goDeeper:'dest:proof',
  },
  {
    id:'miracles-happen',
    category:'is-it-true',
    question:"Miracles don't happen. Why would I believe the ones in the Bible?",
    hook:'What would it take?',
    answer:[
      "If there is no God, miracles are impossible by definition, and no evidence could ever count. But that's not a discovery — it's an assumption smuggled in ahead of time. The real question is whether a God capable of making a universe could also act within it.",
      "If such a God exists, a miracle isn't a violation of nature so much as its Author doing something personal and rare. The Bible treats miracles that way — never as magic tricks, always as signs pointing past themselves to the One doing them.",
    ],
    scriptures:[
      { ref:'John 20:30-31', text:"Now Jesus did many other signs… but these are written so that you may believe that Jesus is the Christ." },
      { ref:'Jeremiah 32:27', text:"Behold, I am the LORD, the God of all flesh. Is anything too hard for me?" },
    ],
  },
  {
    id:'contradictions',
    category:'is-it-true',
    question:'Isn\'t the Bible full of contradictions?',
    hook:'Different angles, or actual conflict?',
    answer:[
      "Most alleged contradictions turn out to be different witnesses describing the same event from different angles — the way four people at a car accident report different details without any of them lying. The Gospels read exactly like independent testimony, not a coordinated script.",
      "There are genuinely hard passages, and honest faith doesn't pretend otherwise. But \"I found two verses I can't immediately reconcile\" is a long way from \"the whole thing is incoherent.\" Sit with the hard ones — they usually reward the patience.",
    ],
    scriptures:[
      { ref:'2 Timothy 3:16', text:"All Scripture is breathed out by God and profitable for teaching, for reproof, for correction." },
      { ref:'Psalm 119:160', text:"The sum of your word is truth, and every one of your righteous rules endures forever." },
    ],
  },
  {
    id:'fine-tuning',
    category:'is-it-true',
    question:"Couldn't the universe just exist on its own, without a God?",
    hook:'Why is there something rather than nothing?',
    answer:[
      "It could seem simpler to say \"it just is.\" But everything we observe that begins to exist has a cause, and the universe itself appears to have begun. Something can't cause itself before it exists. That points to a cause outside of space, time, and matter — which is a fair description of God.",
      "And it isn't only that the universe exists, but that it is so exquisitely balanced for life. Tune a handful of constants by a hair and nothing lives. \"Lucky\" is one answer. \"Intended\" is another — and it fits the evidence at least as well.",
    ],
    scriptures:[
      { ref:'Hebrews 11:3', text:"By faith we understand that the universe was created by the word of God." },
      { ref:'Colossians 1:17', text:"And he is before all things, and in him all things hold together." },
    ],
    goDeeper:'dest:proof',
  },
  {
    id:'prophecy',
    category:'is-it-true',
    question:'Did the Bible actually predict the future, or is that a trick?',
    hook:'Written centuries before.',
    answer:[
      "The Bible contains specific claims written long before the events they describe — the place of the Messiah's birth, the manner of his death, details recorded centuries in advance. These aren't vague horoscopes; many are pointed and checkable.",
      "Skeptics have tried to date the texts later to explain them away, but the manuscript evidence keeps pushing back. Fulfilled prophecy isn't the only reason to believe, but it's one of the harder ones to shrug off.",
    ],
    scriptures:[
      { ref:'Isaiah 53:5', text:"But he was pierced for our transgressions; he was crushed for our iniquities." },
      { ref:'Micah 5:2', text:"But you, O Bethlehem… from you shall come forth for me one who is to be ruler in Israel." },
    ],
    goDeeper:'dest:proof',
  },
  {
    id:'blind-faith',
    category:'is-it-true',
    question:'Isn\'t faith just believing things without evidence?',
    hook:'Trust based on reasons.',
    answer:[
      "That's a popular definition, but it isn't the biblical one. In Scripture, faith is trust placed in someone shown to be trustworthy — like trusting a chair to hold you because you've seen it hold others. The disciples didn't believe because they turned off their brains; they believed because of what they saw.",
      "Faith and evidence aren't enemies. Faith is what you do with the evidence once it points somewhere your pride or comfort would rather not go.",
    ],
    scriptures:[
      { ref:'Hebrews 11:1', text:"Now faith is the assurance of things hoped for, the conviction of things not seen." },
      { ref:'John 20:27', text:"Do not disbelieve, but believe." },
    ],
  },
  {
    id:'hidden-god',
    category:'is-it-true',
    question:"If God is real, why doesn't he just show himself?",
    hook:'He did — in a person.',
    answer:[
      "The Christian claim is that he already did — not in a blinding proof that would overwhelm your freedom, but in a person you could look in the eye. Jesus said if you've seen him, you've seen the Father.",
      "A God who forced belief with undeniable spectacle would get compliance, not love. Instead he came close enough to be known and trusted, and left room for you to actually respond — which is what love requires.",
    ],
    scriptures:[
      { ref:'John 14:9', text:"Whoever has seen me has seen the Father." },
      { ref:'Jeremiah 29:13', text:"You will seek me and find me, when you seek me with all your heart." },
    ],
    goDeeper:'dest:mystery',
  },
  {
    id:'jesus-claim-god',
    category:'is-it-true',
    question:'Did Jesus actually claim to be God, or did his followers make that up?',
    hook:'He said it — and they killed him for it.',
    answer:[
      "He claimed it clearly enough that the religious leaders picked up stones. He forgave sins only God can forgive, accepted worship, and used God's own covenant name — \"before Abraham was, I am.\" His hearers didn't miss the meaning; that's why they charged him with blasphemy.",
      "So the polite \"good moral teacher\" option quietly disappears. A good teacher doesn't claim to be God unless he is one. That leaves you with a sharper choice than most people expect.",
    ],
    scriptures:[
      { ref:'John 8:58', text:"Jesus said to them, “Truly, truly, I say to you, before Abraham was, I am.”" },
      { ref:'John 10:30', text:"I and the Father are one." },
    ],
    goDeeper:'dest:jesus',
  },
  {
    id:'science-explains',
    category:'is-it-true',
    question:"Doesn't science explain everything, leaving no room for God?",
    hook:'Different questions, not rivals.',
    answer:[
      "Science is brilliant at describing how the physical world works. But \"how\" and \"why\" are different questions. Science can tell you the mechanism of a sunset; it can't tell you whether beauty means anything. It can describe the chemistry of love without touching whether love is real.",
      "Many of the founders of modern science were believers precisely because they expected an ordered universe to reflect an ordering mind. Science and faith aren't competitors — they're answering different questions about the same world.",
    ],
    scriptures:[
      { ref:'Psalm 111:2', text:"Great are the works of the LORD, studied by all who delight in them." },
      { ref:'Proverbs 25:2', text:"It is the glory of God to conceal things, but the glory of kings is to search things out." },
    ],
  },

  // ── BUT WHAT ABOUT…? ────────────────────────────────────
  {
    id:'suffering',
    category:'what-about',
    question:'If God is good, why is there so much suffering?',
    hook:'The oldest, hardest question.',
    answer:[
      "This is the question that has driven people toward God and away from him for as long as people have hurt. Christianity doesn't hand you a tidy formula. But it does say two remarkable things: that suffering is not the way things are supposed to be, and that God did not stay above it.",
      "In Jesus, God entered the suffering himself — betrayed, tortured, killed. Whatever else the cross means, it means you're not being told to endure pain by a God who kept his distance from it. He knows it from the inside.",
      "The Bible never promises you'll get the full explanation now. It promises a God who is with you in it, and a day when he wipes every tear away and makes it right.",
    ],
    scriptures:[
      { ref:'Psalm 34:18', text:"The LORD is near to the brokenhearted and saves the crushed in spirit." },
      { ref:'Revelation 21:4', text:"He will wipe away every tear from their eyes, and death shall be no more." },
    ],
  },
  {
    id:'hell',
    category:'what-about',
    question:'How can a loving God send people to hell?',
    hook:'A door locked from the inside.',
    answer:[
      "Start with the picture underneath the question. Hell in Scripture isn't God gleefully punishing people who'd rather be with him. It's the tragic honoring of a choice — the door, as one writer put it, locked from the inside. God will not force his presence on someone who has spent a lifetime saying \"leave me alone.\"",
      "And here's the part often left out: God did everything short of overriding your will to spare you from it. He came in person, took the weight himself, and holds the offer open. Love that can be refused is the only kind worth having — but it can be refused.",
    ],
    scriptures:[
      { ref:'2 Peter 3:9', text:"The Lord is… not wishing that any should perish, but that all should reach repentance." },
      { ref:'Ezekiel 33:11', text:"I have no pleasure in the death of the wicked, but that the wicked turn from his way and live." },
    ],
  },
  {
    id:'never-heard',
    category:'what-about',
    question:'What about people who never heard about Jesus?',
    hook:'The Judge of all the earth will do right.',
    answer:[
      "This one troubles honest people, and it should. The Bible doesn't give a full system for it, but it gives you the character of the Judge — perfectly just and perfectly merciful — and it says he judges people according to what they actually knew and how they responded to the light they had.",
      "Abraham's question stands: \"Shall not the Judge of all the earth do what is just?\" You can trust that no one will be treated unfairly by him. Which means the real question quietly turns back on you — because you have heard.",
    ],
    scriptures:[
      { ref:'Genesis 18:25', text:"Shall not the Judge of all the earth do what is just?" },
      { ref:'Romans 2:6', text:"He will render to each one according to his works." },
    ],
  },
  {
    id:'other-religions',
    category:'what-about',
    question:'Aren\'t all religions basically the same path up the mountain?',
    hook:'They make opposite claims.',
    answer:[
      "It sounds humble, but it actually flattens every faith by ignoring what each one says. The religions of the world don't agree on the mountain, the summit, or even whether there is one. They make genuinely different — often contradictory — claims about God, the problem with humanity, and the solution.",
      "Christianity's distinct claim is that you can't climb the mountain at all; God came down. Every other system, at heart, is advice about what you must do. The gospel is news about what has been done. That's not a different route up — it's a different kind of thing entirely.",
    ],
    scriptures:[
      { ref:'John 14:6', text:"I am the way, and the truth, and the life. No one comes to the Father except through me." },
      { ref:'Ephesians 2:8-9', text:"For by grace you have been saved through faith… not a result of works, so that no one may boast." },
    ],
  },
  {
    id:'science-vs-faith',
    category:'what-about',
    question:'Do I have to choose between science and faith?',
    hook:'Plenty of scientists didn\'t.',
    answer:[
      "No. The idea of a permanent war between them is more myth than history. Many of the people who built modern science — Newton, Kepler, Faraday, and countless working scientists today — held deep faith without feeling torn in half.",
      "Genesis was never trying to be a physics textbook; it answers who and why, not the mechanics of how. You're allowed to follow the evidence wherever it leads and still worship the God you believe stands behind it. Truth doesn't contradict truth.",
    ],
    scriptures:[
      { ref:'Psalm 19:1', text:"The heavens declare the glory of God, and the sky above proclaims his handiwork." },
      { ref:'Colossians 2:3', text:"In whom are hidden all the treasures of wisdom and knowledge." },
    ],
  },
  {
    id:'hypocrites',
    category:'what-about',
    question:'The church is full of hypocrites. Why would I want in?',
    hook:'You\'re not wrong. Now what?',
    answer:[
      "You're not wrong, and Jesus was harder on religious hypocrisy than anyone. He reserved his sharpest words for people who used God as a costume. So if hypocrites bother you, you're actually agreeing with him.",
      "But notice: hypocrisy is only a charge because there's a real standard being betrayed. The failure of Christians is an argument against Christians, not against Christ. The church isn't a museum of finished people; it's a hospital for broken ones — and there's a spot open for you exactly as you are.",
    ],
    scriptures:[
      { ref:'Matthew 9:12', text:"Those who are well have no need of a physician, but those who are sick." },
      { ref:'Romans 3:23', text:"For all have sinned and fall short of the glory of God." },
    ],
  },
  {
    id:'ot-violence',
    category:'what-about',
    question:'The Old Testament God seems violent and cruel. What\'s going on?',
    hook:'Read it slower than the memes.',
    answer:[
      "The hard passages are real, and they deserve to be read carefully rather than through internet summaries. Much of what looks arbitrary is God's judgment on genuinely horrific practices — child sacrifice, systemic cruelty — in a specific time and place, and it comes after long patience, not on a whim.",
      "The same Old Testament is also drenched in mercy: a God who spares, relents, rescues slaves, and defends the widow and the outsider. The story is moving somewhere — toward a God who would rather take judgment onto himself than pour it out on you. That's where the whole thing is heading.",
    ],
    scriptures:[
      { ref:'Exodus 34:6', text:"The LORD, a God merciful and gracious, slow to anger, and abounding in steadfast love." },
      { ref:'Ezekiel 18:23', text:"Have I any pleasure in the death of the wicked… and not rather that he should turn from his way and live?" },
    ],
  },
  {
    id:'religion-wars',
    category:'what-about',
    question:'Hasn\'t religion caused most of the wars and harm in history?',
    hook:'Check the actual ledger.',
    answer:[
      "It's a common line, but the historical ledger is more complicated. The bloodiest regimes of the last century were explicitly atheistic. Humans manage to kill each other over land, money, tribe, and ideology with or without religion — the problem runs deeper than any one belief system.",
      "That deeper problem is exactly what Christianity names: the human heart, curved in on itself. And it's also what Christianity has driven people to heal — hospitals, abolition, orphan care, and countless quiet acts of mercy done in Jesus' name. The question isn't whether people misuse religion. It's whether Jesus himself is worth following. He is.",
    ],
    scriptures:[
      { ref:'James 4:1', text:"What causes quarrels and fights among you? Is it not… your passions?" },
      { ref:'Micah 6:8', text:"To do justice, and to love kindness, and to walk humbly with your God." },
    ],
  },
  {
    id:'unanswered-prayer',
    category:'what-about',
    question:'I prayed and nothing happened. Doesn\'t that prove God isn\'t listening?',
    hook:'“No” and “not yet” are answers too.',
    answer:[
      "Prayer isn't a vending machine, and the Bible never presents it as one. A good father doesn't give a child everything asked for exactly when asked — sometimes because he can see what the child can't. \"No\" and \"wait\" are answers, even when they're the ones we hate.",
      "Jesus himself prayed in agony, \"let this cup pass\" — and it didn't. God's answer to that unanswered prayer was the rescue of the world. Silence isn't always absence. Sometimes it's a bigger story being told than the one you asked for.",
    ],
    scriptures:[
      { ref:'Matthew 26:39', text:"My Father, if it be possible, let this cup pass from me; nevertheless, not as I will, but as you will." },
      { ref:'Isaiah 55:8', text:"For my thoughts are not your thoughts, neither are your ways my ways, declares the LORD." },
    ],
  },
  {
    id:'sexuality',
    category:'what-about',
    question:'What does Christianity actually say about being gay?',
    hook:'Every person, made in God\'s image.',
    answer:[
      "First, the thing often missed: every person is made in God's image, loved by him, and treated by Jesus with more dignity than the culture around him offered anyone. Contempt has no place here, and where the church has offered it instead of love, it has misrepresented Jesus.",
      "The historic Christian view holds a specific vision of sex and marriage — and it asks something costly of everyone, gay or straight, because following Jesus reshapes all of our desires, not just some. These are deep waters, and they're best walked with real people in a real church who know your name, not settled by a paragraph.",
      "If this is your question, it deserves an unhurried conversation with someone who will both tell you the truth and love you through it. You are welcome to bring your whole self and every hard question here.",
    ],
    scriptures:[
      { ref:'Genesis 1:27', text:"So God created man in his own image, in the image of God he created him." },
      { ref:'John 8:11', text:"Neither do I condemn you; go, and from now on sin no more." },
    ],
  },
  {
    id:'exclusive-jesus',
    category:'what-about',
    question:'Isn\'t it arrogant to say Jesus is the only way?',
    hook:'Humility about a claim you didn\'t invent.',
    answer:[
      "It can sound arrogant — until you notice a Christian isn't claiming to be better, but rescued. If Jesus really is who he said, and really did rise, then reporting that isn't arrogance; it's honesty. The arrogance would be editing his words to be more comfortable.",
      "And the exclusivity cuts the other way from what people expect. Every other path says do enough, be enough, climb high enough. Jesus says you can't — so he came to you. The one \"way\" is the only one that doesn't depend on how impressive you are. That's not narrow. That's the widest door there is.",
    ],
    scriptures:[
      { ref:'Acts 4:12', text:"And there is salvation in no one else, for there is no other name… by which we must be saved." },
      { ref:'1 Timothy 2:5', text:"For there is one God, and there is one mediator between God and men, the man Christ Jesus." },
    ],
    goDeeper:'dest:jesus',
  },
  {
    id:'why-evil-exists',
    category:'what-about',
    question:'If God could stop evil, why doesn\'t he?',
    hook:'Which evil should he start with?',
    answer:[
      "Push the question all the way and it gets uncomfortable: if God erased all evil tonight, where exactly would he draw the line? Every cruelty, every lie, every selfish thought — much of it lives in us. To end all evil instantly, he'd have to end us.",
      "So instead he's doing something slower and stranger: dealing with evil at its root, in human hearts, one surrendered life at a time, and promising a day when he finishes the job for good. He hasn't ignored evil. He walked straight into it on a cross and is unwinding it from the inside.",
    ],
    scriptures:[
      { ref:'Romans 12:21', text:"Do not be overcome by evil, but overcome evil with good." },
      { ref:'Habakkuk 1:13', text:"You who are of purer eyes than to see evil and cannot look at wrong." },
    ],
  },

  // ── WHAT DOES IT MEAN FOR ME? ───────────────────────────
  {
    id:'doubts-ok',
    category:'what-for-me',
    question:'I have serious doubts. Does that mean my faith is fake?',
    hook:'Doubt isn\'t the opposite of faith.',
    answer:[
      "Doubt isn't the opposite of faith — indifference is. The father in the Gospels who cried \"I believe; help my unbelief!\" is one of the most honest lines in the Bible, and Jesus didn't scold him. He helped him.",
      "Faith with room for questions is sturdier than faith that was never tested. Bring the doubts into the open, ask them out loud, chase down real answers. A God big enough to make the universe is not threatened by your hardest question.",
    ],
    scriptures:[
      { ref:'Mark 9:24', text:"I believe; help my unbelief!" },
      { ref:'Jude 1:22', text:"And have mercy on those who doubt." },
    ],
    goDeeper:'dest:mystery',
  },
  {
    id:'too-far-gone',
    category:'what-for-me',
    question:'I\'ve done things I can\'t take back. Am I too far gone to be forgiven?',
    hook:'There is no bottom to this grace.',
    answer:[
      "No. And this isn't wishful thinking — it's the entire point. The people Jesus drew closest were the ones everyone else had written off: the betrayer, the traitor, the woman caught in the act, the criminal dying next to him. To that criminal, hours from death, he said, \"Today you will be with me in Paradise.\"",
      "Grace you could earn wouldn't be grace. Whatever you've done, it is not bigger than a cross that was built precisely for people who can't fix themselves. You are not too far gone. That fear is the last lie standing between you and the thing you actually want.",
    ],
    scriptures:[
      { ref:'1 John 1:9', text:"If we confess our sins, he is faithful and just to forgive us our sins." },
      { ref:'Luke 23:43', text:"Truly, I say to you, today you will be with me in Paradise." },
    ],
  },
  {
    id:'cost',
    category:'what-for-me',
    question:'What does following Jesus actually cost me?',
    hook:'Everything — and it\'s the best trade you\'ll make.',
    answer:[
      "Jesus was never a slick salesman about this. He told people to count the cost before they followed. It costs you the throne — the right to be your own final authority. It may cost comfort, certain relationships, plans you were fond of.",
      "But he framed it as the best trade a person ever makes: like a man who finds treasure buried in a field and joyfully sells everything to buy that field. You lose a small, self-made life and gain a real one — forgiven, known, and part of something that outlasts you. Nobody who's made the trade wants it back.",
    ],
    scriptures:[
      { ref:'Matthew 13:44', text:"The kingdom of heaven is like treasure hidden in a field… in his joy he goes and sells all that he has and buys that field." },
      { ref:'Mark 8:35', text:"For whoever would save his life will lose it, but whoever loses his life for my sake… will save it." },
    ],
    goDeeper:'dest:walk',
  },
  {
    id:'how-to-start',
    category:'what-for-me',
    question:'If I wanted to start following Jesus, where do I even begin?',
    hook:'Simpler than you think.',
    answer:[
      "You don't have to clean yourself up first — that's backwards. You come as you are. It begins with turning: admitting you've run your own way, believing Jesus is who he said and did what the story claims, and asking him to take the wheel.",
      "That can be as plain as a whispered, honest prayer right now — \"God, I've done this my way. I believe Jesus died and rose for me. I'm yours.\" Then don't do it alone: get a Bible and start in the Gospel of John, find some real Christians, and take the next step. The walk starts with one.",
    ],
    scriptures:[
      { ref:'Romans 10:9', text:"If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved." },
      { ref:'Revelation 3:20', text:"Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in." },
    ],
    goDeeper:'dest:walk',
  },
  {
    id:'does-god-care-about-me',
    category:'what-for-me',
    question:'Does God actually care about me specifically, or just people in general?',
    hook:'He knows the number of your hairs.',
    answer:[
      "Specifically. Jesus said God clothes wildflowers and feeds sparrows, and then looked people in the eye and said you're worth far more than those. He said the very hairs of your head are numbered — the language of a Father who notices, not a manager tracking statistics.",
      "The cross wasn't for humanity as an abstraction; the Bible says the Son of God loved \"me\" and gave himself for \"me.\" You are not lost in the crowd to him. You never were.",
    ],
    scriptures:[
      { ref:'Matthew 10:30-31', text:"But even the hairs of your head are all numbered. Fear not, therefore; you are of more value than many sparrows." },
      { ref:'Galatians 2:20', text:"The Son of God, who loved me and gave himself for me." },
    ],
    goDeeper:'dest:walk',
  },
  {
    id:'guilt-shame',
    category:'what-for-me',
    question:'How do I deal with the guilt and shame I carry?',
    hook:'Guilt says you did wrong. Grace answers it.',
    answer:[
      "There's a difference between guilt — I did something wrong — and shame — I am something wrong. Guilt can be dealt with, because the wrong can be forgiven. Shame is the lie that you're beyond repair, and the gospel takes direct aim at it.",
      "At the cross, the record against you was nailed up and cancelled. God doesn't merely overlook your worst; he removes it — \"as far as the east is from the west.\" You don't have to keep paying a debt that's already been paid. Let it go where it's already been carried.",
    ],
    scriptures:[
      { ref:'Psalm 103:12', text:"As far as the east is from the west, so far does he remove our transgressions from us." },
      { ref:'Romans 8:1', text:"There is therefore now no condemnation for those who are in Christ Jesus." },
    ],
  },
  {
    id:'dont-feel-anything',
    category:'what-for-me',
    question:'Everyone talks about “feeling” God. I don\'t feel anything. Is something wrong with me?',
    hook:'Faith rests on facts, not goosebumps.',
    answer:[
      "Nothing is wrong with you. Feelings come and go with sleep, weather, and brain chemistry; they're a terrible foundation and God never asked you to build on them. Faith rests on what is true, not on whether you got goosebumps this morning.",
      "Some of the deepest believers walked long stretches feeling nothing at all and kept walking anyway — and often the feelings returned on the far side. Trust the facts of what Jesus did; let the feelings be a guest that sometimes visits, never the landlord.",
    ],
    scriptures:[
      { ref:'2 Corinthians 5:7', text:"For we walk by faith, not by sight." },
      { ref:'Habakkuk 3:17-18', text:"Though the fig tree should not blossom… yet I will rejoice in the LORD." },
    ],
  },
  {
    id:'what-if-i-fail',
    category:'what-for-me',
    question:'What if I say yes to God and then blow it?',
    hook:'You will. He knew that going in.',
    answer:[
      "You will fail — and God knew that before you started. He didn't take you on because you'd be flawless; he took you on knowing exactly what he was getting. Peter denied Jesus three times, and Jesus restored him and built the church on him anyway.",
      "Following Jesus isn't a performance you can fail out of; it's a relationship you get carried through. When you fall, you don't lose your standing — you get up, come back, and keep walking. His grip on you is stronger than your grip on him.",
    ],
    scriptures:[
      { ref:'Proverbs 24:16', text:"For the righteous falls seven times and rises again." },
      { ref:'Philippians 1:6', text:"He who began a good work in you will bring it to completion at the day of Jesus Christ." },
    ],
    goDeeper:'dest:walk',
  },
  {
    id:'is-it-too-late',
    category:'what-for-me',
    question:'I\'ve ignored God for years. Is it too late for me?',
    hook:'The workers hired at the last hour got full pay.',
    answer:[
      "It's not too late. Jesus told a story about workers hired at the very last hour of the day who received the same full wage as those who'd worked since dawn — and the point was the outrageous generosity of the employer. God isn't standing at the gate with a stopwatch, docking you for lost years.",
      "The thief on the cross had one hour of faith and heard \"today you'll be with me.\" There's no age limit and no expiration date on this. The best time was years ago. The second-best time is right now.",
    ],
    scriptures:[
      { ref:'Matthew 20:9', text:"And when those hired about the eleventh hour came, each of them received a denarius." },
      { ref:'2 Corinthians 6:2', text:"Behold, now is the favorable time; behold, now is the day of salvation." },
    ],
    goDeeper:'dest:walk',
  },
  {
    id:'who-am-i',
    category:'what-for-me',
    question:'Does becoming a Christian mean I lose myself?',
    hook:'You lose the mask, not the face.',
    answer:[
      "It feels like a threat — hand yourself over and disappear into a religious mold. But Jesus said the opposite happens: try to keep your life clenched in your fist and you lose it; hand it to him and you find it. You lose the exhausting performance, not the real you.",
      "The people who followed Jesus didn't become less themselves — the fisherman, the tax collector, the zealot each became the fullest version of who they were made to be. He isn't out to erase you. He's out to finish you.",
    ],
    scriptures:[
      { ref:'Matthew 16:25', text:"For whoever would save his life will lose it, but whoever loses his life for my sake will find it." },
      { ref:'Ephesians 2:10', text:"For we are his workmanship, created in Christ Jesus for good works." },
    ],
  },
  {
    id:'purpose',
    category:'what-for-me',
    question:'Is there actually a point to my life?',
    hook:'You were made on purpose, for a purpose.',
    answer:[
      "If we're cosmic accidents, then no — any \"point\" is one you invent to feel better, and it dies with you. But that's not the Christian claim. You were made on purpose, by someone who wanted you to exist, and knit you together with intent.",
      "The point isn't fame or a perfect résumé. It's to know the God who made you and to reflect his love into a world that badly needs it — a purpose that survives your failures and outlasts your death. Your life is not random. It's a story being written by someone who loves you.",
    ],
    scriptures:[
      { ref:'Psalm 139:13-14', text:"For you formed my inward parts; you knitted me together in my mother's womb… I am fearfully and wonderfully made." },
      { ref:'Ephesians 2:10', text:"For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand." },
    ],
    goDeeper:'dest:walk',
  },
];

if (typeof window !== 'undefined') {
  window.MANS_QUESTIONS = MANS_QUESTIONS;
  window.MQ_CATEGORIES = MQ_CATEGORIES;
}
