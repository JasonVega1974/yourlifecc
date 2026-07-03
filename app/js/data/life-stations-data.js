/* =============================================================
   life-stations-data.js — "My Climb" · The Road to Adulthood (L1)
   Pure data. Read by life-path.js; no behavior lives here.

   The main-app sibling of the faith side's "My Walk with God":
   4 chapters · 13 stations · the North Star horizon (never
   completable — adulthood is a way of walking, not a finish line).

   Template mirrors the walk stations for one-app coherence:
   welcome · what · understand[] · wisdom[] (trail markers —
   original principle lines, no scripture; that lives in the Well)
   · step {title,how} · markers[] · tools[] (route = main-app
   section id for showSection) · reflect · charge (say-this-to-
   yourself line) · human (ask someone who's done it).

   Tone rules (same as the walk, life-flavored):
   - Invitation, never a scoreboard. Self-paced. No one is "behind."
   - Written for a 12–22 year old who genuinely doesn't know yet.
   - Every station points to a real human, not just app features.
============================================================= */

const LIFE_CHAPTERS = [
  { id:'base-camp',   num:1, name:'Base Camp',       sub:'Foundations nobody can take from you' },
  { id:'the-ascent',  num:2, name:'The Ascent',      sub:'Taking charge of your own life' },
  { id:'high-country',num:3, name:'High Country',    sub:'Out in the real world' },
  { id:'summit-push', num:4, name:'The Summit Push', sub:'Standing on your own two feet' }
];

const LIFE_STATIONS = [

/* ── CHAPTER 1 · BASE CAMP ───────────────────────────────── */
{
  id:'own-day', chapter:'base-camp', order:1, icon:'🧭',
  name:'Own Your Day', tagline:'The day runs you, or you run the day.',
  welcome:'Every climb starts the same way: you decide the day isn\'t just something that happens to you.',
  what:'This step is building a simple daily rhythm you actually control — a wake time, one or two anchor habits, and knowing what today holds before it holds you. Not a perfect schedule. A spine.',
  understand:[
    'Here\'s the secret adults don\'t say out loud: nobody feels like doing the things that build a life. Motivated people don\'t have more willpower — they\'ve built routines so the important stuff happens on autopilot, feelings or not.',
    'Start embarrassingly small. One habit, attached to something you already do: make your bed when your feet hit the floor, review tomorrow before your head hits the pillow. Tiny and unbreakable beats ambitious and abandoned — a habit you keep for 30 days rewires more than a plan you quit in 4.',
    'And track it. Not because the streak is the point, but because what gets seen gets repeated. The difference between a kid and an adult isn\'t age — it\'s who\'s steering.'
  ],
  wisdom:[
    'You don\'t decide your future. You decide your habits, and your habits decide your future.',
    'The best time to plant a routine was last year. The second best time is tonight.'
  ],
  step:{
    title:'Run one anchor habit for 14 days',
    how:'Pick ONE small daily habit — make your bed, 10-minute tidy, plan tomorrow before bed — and add it to your Habits tracker with a real time attached. Hold it 14 days straight. Miss a day? Restart the count, not the mission.'
  },
  markers:[
    'You have at least one habit with a two-week streak behind it.',
    'You usually know what tomorrow looks like before it arrives.',
    'When you skip your routine, you notice — it feels like something\'s missing.'
  ],
  tools:[
    { icon:'🔁', label:'Habits tracker', route:'s-habits' },
    { icon:'📅', label:'My Schedule', route:'s-schedule' },
    { icon:'🎯', label:'Goals', route:'s-goals' }
  ],
  reflect:'What\'s the one small thing that, done daily, would make everything else in your life a little easier? Why haven\'t you started it yet — honestly?',
  charge:'I don\'t wait to feel ready. I built a rhythm, and the rhythm carries me.',
  human:'Ask the most on-top-of-it adult you know: "What\'s your morning routine, and when did you build it?" Steal shamelessly.'
},
{
  id:'own-space', chapter:'base-camp', order:2, icon:'🧹',
  name:'Own Your Space', tagline:'Your room, your stuff, your responsibility.',
  welcome:'Before anyone trusts you with big things, you prove yourself with the square footage you already have.',
  what:'This step is taking full ownership of your physical world — your room, your things, your share of the home — without being asked, reminded, or paid every time.',
  understand:[
    'There\'s a reason every mentor, coach, and drill sergeant in history starts with "clean your space": your environment is the one part of your life you can fix TODAY, completely, with zero permission. It\'s the first rep of a much bigger skill — seeing what needs doing and doing it.',
    'The real graduation isn\'t doing chores. It\'s doing them unprompted. The moment you take out the trash because you noticed it was full — not because someone said your name in that tone — you crossed a line most people don\'t cross until their twenties.',
    'And take care of what you own. Charge your things, maintain your gear, know where your stuff is. People who respect their possessions get trusted with bigger ones. That\'s not a rule someone made up; it\'s just how trust works.'
  ],
  wisdom:[
    'How you do the small things is how you\'ll do the big things.',
    'Unprompted is the whole skill. Anyone can obey a reminder.'
  ],
  step:{
    title:'One week, zero reminders',
    how:'For seven days, handle every chore and your whole space without a single reminder from anyone. Track them in Chores. Bonus rep: once this week, do something that needed doing that nobody asked you to do — and don\'t announce it.'
  },
  markers:[
    'A full week of chores has happened without anyone chasing you.',
    'You\'ve done at least one unasked, unannounced thing for the household.',
    'Your space is somewhere you\'d be fine letting anyone see, most days.'
  ],
  tools:[
    { icon:'🧹', label:'Chores', route:'s-chores' },
    { icon:'🏆', label:'Rewards', route:'s-rewards' },
    { icon:'🔁', label:'Habits tracker', route:'s-habits' }
  ],
  reflect:'Who does the invisible work in your home — the things that just "get done"? What would change if you took one of those things off their plate permanently?',
  charge:'I see what needs doing, and I do it. Nobody has to say my name twice.',
  human:'Tell a parent or the adult you live with: "Pick one thing you\'re tired of reminding me about. It\'s mine now." Then make it true.'
},
{
  id:'own-health', chapter:'base-camp', order:3, icon:'💪',
  name:'Own Your Health', tagline:'The body you\'re building is the one you\'ll live in.',
  welcome:'You only get one body for the whole climb. This step is learning to be its manager, not its passenger.',
  what:'This step is taking over the basics adults have handled for you: sleep like it matters, move most days, eat like fuel counts, and know your own body\'s signals.',
  understand:[
    'Sleep is the cheat code nobody uses. Teen brains need 8–10 hours, and nearly everything you care about — mood, skin, grades, sports, not snapping at people — runs on it. The most underrated adult skill is a bedtime you actually keep.',
    'Movement isn\'t about being an athlete. It\'s 30–60 minutes of anything that raises your heartbeat, most days — a sport, a walk, hoops in the driveway. The habit matters more than the sport; bodies in motion stay in motion for decades.',
    'Food is fuel math, not morality: real food most of the time, water as your default drink, and no foods you\'re "bad" for eating. You\'re not on a diet — you\'re learning to feed an athlete on a long climb. And learn your signals: what tired-vs-sick feels like, when to rest, when to speak up about how you\'re feeling — body or mind.'
  ],
  wisdom:[
    'Discipline is choosing what you want most over what you want now.',
    'Nobody regrets the workout, the water, or the early night.'
  ],
  step:{
    title:'Two weeks of the big three',
    how:'For 14 days, log the big three in Health: a consistent sleep window, movement most days (aim for 5 of 7), and water as your main drink. Not perfection — a visible pattern you built yourself.'
  },
  markers:[
    'You have a bedtime you mostly keep — chosen by you, not enforced on you.',
    'Moving your body is a normal part of most days, not an event.',
    'You can tell someone honestly how you\'re doing — body and mind — without shrugging it off.'
  ],
  tools:[
    { icon:'💪', label:'Health', route:'s-health' },
    { icon:'🏀', label:'Sports', route:'s-sports' },
    { icon:'🔁', label:'Habits tracker', route:'s-habits' }
  ],
  reflect:'What does your body keep telling you that you keep ignoring? What would taking it seriously look like this week?',
  charge:'I\'m the manager of this body now. I feed it, move it, and rest it like it has somewhere important to be — because it does.',
  human:'Ask an adult who\'s in good shape at 40+: "What do you wish you\'d started at my age?" Their answer is a map.'
},
{
  id:'own-mind', chapter:'base-camp', order:4, icon:'🧠',
  name:'Own Your Mind', tagline:'Feelings are real. They\'re just not in charge.',
  welcome:'The strongest climbers aren\'t the ones who never struggle — they\'re the ones who know what to do when they do.',
  what:'This step is learning to work WITH your own mind: naming what you feel, catching thought-spirals before they own you, managing the phone instead of being managed by it, and knowing when and how to ask for help.',
  understand:[
    'Naming a feeling shrinks it. "I\'m angry because that felt unfair" is a thought you can work with; a slammed door isn\'t. The skill is putting words between the feeling and the reaction — that gap is where every good decision you\'ll ever make lives.',
    'Your thoughts aren\'t always true. Everyone\'s brain generates junk: "everyone\'s judging me," "I always mess up," "this will never get better." You can learn to catch these, question them, and answer back with something more accurate. That\'s not positive thinking — it\'s honest thinking.',
    'And your phone is engineered by professionals to keep you scrolling — dopamine loops are a design feature, not your weakness. Owning your mind means deciding when the phone works for you: notifications you chose, a charging spot that isn\'t your bed, and real face-to-face time that no feed can fake. Finally, the strongest move in this whole station: asking for help early. Struggling silently isn\'t strength — it\'s just struggling.'
  ],
  wisdom:[
    'Feelings are information, not instructions.',
    'You can\'t stop the waves, but you can learn to surf.'
  ],
  step:{
    title:'Track your mind for one week',
    how:'For seven days, do a daily mood check-in and write one honest line in your journal — what you felt, what triggered it, what you did. And pick ONE phone boundary (bed-free charging, one app limit, notifications off for one app) and hold it all week.'
  },
  markers:[
    'You can name what you\'re feeling with a better word than "fine" or "whatever."',
    'You\'ve caught at least one junk thought this week and answered it back.',
    'There\'s at least one person you\'d actually tell if things got heavy.'
  ],
  tools:[
    { icon:'🌤️', label:'Mood & mindset', route:'s-mood' },
    { icon:'📔', label:'Journal', route:'s-journal' },
    { icon:'🧠', label:'Mind skills', route:'s-cbt' }
  ],
  reflect:'When your mind gets loud, what do you usually reach for — and does it actually help, or just postpone? What could you reach for instead?',
  charge:'I feel things fully, name them honestly, and choose my next move on purpose.',
  human:'This station especially isn\'t a solo climb. If your mind has felt heavy lately, tell one trusted adult this week — a parent, counselor, coach, or mentor. That conversation is strength, full stop.'
},

/* ── CHAPTER 2 · THE ASCENT ──────────────────────────────── */
{
  id:'money-basics', chapter:'the-ascent', order:5, icon:'💵',
  name:'Money Basics', tagline:'Every dollar is a little employee. Give it a job.',
  welcome:'Money isn\'t complicated. It just punishes people who never learned the three moves: earn, save, spend on purpose.',
  what:'This step is running your first real money system: money coming in (allowance, chores, a job), a saving rule you actually follow, and knowing where your money goes instead of wondering where it went.',
  understand:[
    'The habit that separates people who have money from people who don\'t isn\'t income — it\'s the save-first reflex. Before you spend a dollar of anything you earn, a slice (start with 10–20%) goes to savings automatically. Not what\'s left over at the end. First. People who wait to save what\'s left discover there\'s never anything left.',
    'Then give every remaining dollar a job before it disappears: some to spend freely, some toward a goal you actually want (that\'s what makes saving feel like winning instead of losing), some to give. A budget isn\'t a punishment — it\'s just you telling your money what you want instead of asking it what happened.',
    'And learn the difference between wanting something and wanting the feeling of buying something. The 48-hour rule kills most bad purchases: still want it in two days? Fine. Most of the time, you won\'t even remember it.'
  ],
  wisdom:[
    'Save first, spend what\'s left — never the reverse.',
    'Rich is what you keep, not what you show.'
  ],
  step:{
    title:'Run the save-first system for one month',
    how:'Set your save-first percentage (10–20%) and apply it to every dollar that comes in for 30 days. Track everything in Money — every buck in, every buck out — and set one savings goal with a picture attached so you know what you\'re climbing toward.'
  },
  markers:[
    'Saving happens automatically when money arrives — it\'s a reflex, not a debate.',
    'You can say where last month\'s money went without guessing.',
    'You\'ve talked yourself out of at least one purchase with the 48-hour rule.'
  ],
  tools:[
    { icon:'💵', label:'Money', route:'s-finance' },
    { icon:'🏆', label:'Rewards & earning', route:'s-rewards' },
    { icon:'🎯', label:'Savings goals', route:'s-goals' }
  ],
  reflect:'If someone handed you $500 today, what would you honestly do with it — and what does that answer tell you about your money habits?',
  charge:'My money works for me. Every dollar gets a job, and the first job is always my future.',
  human:'Ask an adult you trust: "What\'s the biggest money mistake you made before 25?" You\'re collecting the tuition they already paid.'
},
{
  id:'own-learning', chapter:'the-ascent', order:6, icon:'📚',
  name:'Own Your Learning', tagline:'Grades are the receipt. Learning is the product.',
  welcome:'Somewhere on this climb, school stops being something done TO you and becomes something you run. That switch is this step.',
  what:'This step is taking over your own education: tracking your assignments and grades yourself, studying in ways that actually work, and asking for help before the hole gets deep.',
  understand:[
    'The single biggest school upgrade isn\'t intelligence — it\'s a system. Every assignment, test, and due date in ONE place you check daily. The kids who seem effortlessly on top of it aren\'t smarter; they just never let anything sneak up on them.',
    'Most studying is fake studying. Re-reading notes and highlighting feel productive but barely work. What works: testing yourself (flashcards, practice problems, explaining it out loud to nobody), spacing it over days instead of cramming, and starting ugly early instead of perfectly late.',
    'And the highest-level move in any classroom: asking. Ask when you\'re lost. Email the teacher. Go in early. Every adult who runs anything got there by asking questions other people were too proud to ask. Confusion isn\'t embarrassing — staying confused on purpose is.'
  ],
  wisdom:[
    'Start ugly and early. Perfect and late loses every time.',
    'The question you\'re afraid to ask is the one costing you the grade.'
  ],
  step:{
    title:'Run your own system for two weeks',
    how:'Load every current assignment and test into School and check it daily for 14 days. Study for your next test with self-testing instead of re-reading. And ask at least one real question — in class, after class, or by email — this week.'
  },
  markers:[
    'Nothing has "snuck up on you" in two weeks — you saw everything coming.',
    'You\'ve replaced at least one cram session with spaced self-testing.',
    'You\'ve asked a teacher a real question recently and survived it.'
  ],
  tools:[
    { icon:'📚', label:'School', route:'s-school' },
    { icon:'🗂️', label:'Flashcards', route:'s-flashcards' },
    { icon:'📅', label:'Schedule', route:'s-schedule' }
  ],
  reflect:'Which class are you avoiding thinking about right now? That avoidance is information — what\'s one small move you could make on it today?',
  charge:'Nobody manages my education but me. I see it all coming, and I ask before I sink.',
  human:'Find someone a few years ahead — a senior, a college student, a cousin — and ask: "What study habit actually changed things for you?"'
},
{
  id:'feed-yourself', chapter:'the-ascent', order:7, icon:'🍳',
  name:'Feed Yourself', tagline:'A person who can cook five meals is never helpless.',
  welcome:'There\'s a moment on every climb where you realize: if I can feed myself, I can take care of myself. This is that moment.',
  what:'This step is learning to actually cook — not gourmet, just capable: five real meals you can make without a recipe, basic kitchen safety, and shopping for what you cook.',
  understand:[
    'Five meals is the magic number. Learn five real meals cold — say: eggs any style, a pasta with real sauce, a stir-fry, a solid chicken dish, and one breakfast-for-dinner move — and you can feed yourself, feed a friend, and never be the roommate who lives on delivery. Everything else in cooking is just adding verses to songs you know.',
    'The kitchen has maybe six skills under everything: knife basics (claw grip, sharp knife, cut away from yourself), heat control (most people cook too hot), tasting as you go, timing so things finish together, cleanliness with raw meat, and cleaning as you cook so the kitchen isn\'t a crime scene at the end.',
    'And cooking is quietly a money skill and a love skill. A home-cooked meal costs a third of takeout — and cooking for someone is one of the oldest ways humans say "you matter to me." A person who can cook is never showing up to life empty-handed.'
  ],
  wisdom:[
    'Recipes are training wheels. Five meals from memory is riding the bike.',
    'Clean as you go — future you is a real person who deserves better.'
  ],
  step:{
    title:'Cook three real meals this month',
    how:'Pick three meals from the cooking lessons and cook each one start to finish — including the shopping list and the cleanup. At least one must be for someone other than you. Work toward your five-meal repertoire.'
  },
  markers:[
    'You\'ve cooked complete meals — shopping to cleanup — without rescue.',
    'You\'ve fed at least one other human something you made, on purpose.',
    'You have at least a couple of meals you could make right now, no recipe.'
  ],
  tools:[
    { icon:'🍳', label:'Cooking skills', route:'s-skills' },
    { icon:'💪', label:'Health & nutrition', route:'s-health' },
    { icon:'💵', label:'Grocery budgeting', route:'s-finance' }
  ],
  reflect:'What meal from your childhood would you most want to be able to make yourself? Who could teach you — and have you asked?',
  charge:'I can walk into a kitchen and walk out with a real meal. I take care of myself, and I can take care of others.',
  human:'The best cooking teacher is standing in a kitchen you already know. Ask the cook in your family to teach you their signature dish — it\'s a recipe and a relationship in one.'
},
{
  id:'speak-up', chapter:'the-ascent', order:8, icon:'🗣️',
  name:'Speak Up', tagline:'The world runs on conversations most people are afraid to have.',
  welcome:'Almost everything you\'ll ever want — help, jobs, respect, repair after a fight — sits on the other side of a conversation. This step is learning to have them.',
  what:'This step is building the communication moves adults use daily: looking people in the eye, asking for what you need, disagreeing without exploding, apologizing like you mean it, and handling hard conversations instead of hiding from them.',
  understand:[
    'Start with the mechanics, because they\'re trainable: eye contact, a real handshake or greeting, phone down when someone\'s talking, and actually listening — which means hearing to understand, not just waiting for your turn. These sound small. They are the entire first impression, every time, for the rest of your life.',
    'Then the harder moves. Asking for what you need, directly and kindly: "Can you help me with this?" beats a week of hinting. Disagreeing without warfare: "I see it differently — here\'s why" keeps the relationship AND your point. And the black belt: a real apology — name what you did, no "but," say what changes. "I\'m sorry you\'re upset" is not an apology; it\'s a dodge wearing one\'s clothes.',
    'Hard conversations don\'t get easier by waiting — they get bigger. The friend thing you\'re avoiding, the grade conversation, the "I need help" — the version of it today is the smallest it will ever be. People who handle things early live lighter than people who hide.'
  ],
  wisdom:[
    'Say the hard thing kindly and early — it only grows in the dark.',
    'Listening is not waiting for your turn to talk.'
  ],
  step:{
    title:'Have one conversation you\'ve been avoiding',
    how:'Pick the conversation you\'ve been putting off — an ask, an apology, a disagreement, an "I need help" — plan your opening line, and have it this week, face to face if possible. Journal how it actually went versus how you feared it would.'
  },
  markers:[
    'You\'ve made a direct ask recently instead of hinting and hoping.',
    'You\'ve delivered a real apology — named it, no "but," changed something.',
    'The conversation you were dreading is behind you, and you\'re still standing.'
  ],
  tools:[
    { icon:'🗣️', label:'People skills', route:'s-skills' },
    { icon:'📔', label:'Journal it', route:'s-journal' },
    { icon:'🌤️', label:'Mood & mindset', route:'s-mood' }
  ],
  reflect:'What conversation are you avoiding right now — and what\'s the actual worst case if you have it versus the guaranteed cost of not having it?',
  charge:'I say what I need, I own what I break, and I have the hard conversations while they\'re still small.',
  human:'Ask an adult you respect: "What\'s a conversation you\'re glad you had — and one you waited too long to have?" Both answers are gold.'
},

/* ── CHAPTER 3 · HIGH COUNTRY ────────────────────────────── */
{
  id:'get-moving', chapter:'high-country', order:9, icon:'🚗',
  name:'Get Moving', tagline:'Freedom is being able to get yourself where life happens.',
  welcome:'High country starts here: the ability to move through the world on your own — safely, legally, and without waiting on a ride.',
  what:'This step is mastering your own transportation: learning to drive (permit, practice hours, license) or truly owning your city\'s transit, plus the responsibility that comes bolted to it.',
  understand:[
    'Driving is the most dangerous ordinary thing you will ever do — car crashes are the top killer of teens, and almost every one traces to the same three: speed, distraction, inexperience. Respecting that isn\'t fear; it\'s exactly what the best drivers on the road do. The phone goes in do-not-disturb before the engine starts. Every time. That one habit is worth more than every other driving tip combined.',
    'The license is a process, not an event: permit rules, real practice hours in real conditions (rain, night, highway — with a calm adult), and knowing the basics of the machine itself: gas, tires, oil light, what that noise probably is, what insurance is for. A car is freedom with a maintenance schedule.',
    'No car or not there yet? Owning transit is the same graduation: knowing your routes, reading the schedule, budgeting the fare, getting yourself to work or practice on time without a parent-taxi. The skill isn\'t the vehicle — it\'s "I can reliably get myself where I committed to be."'
  ],
  wisdom:[
    'Phone down, every drive, no exceptions — the text will still be there; make sure you are.',
    'Freedom and responsibility are the same purchase. They don\'t sell them separately.'
  ],
  step:{
    title:'Advance one real stage',
    how:'Move your transportation forward one concrete stage this season: book the permit test, log 10 practice hours, take the license test — or map and ride your three most important routes solo. Track it in Driving.'
  },
  markers:[
    'You\'ve advanced a real stage — permit, hours, license, or solo routes.',
    'Your phone is silenced before you drive, as a reflex.',
    'You can reliably get yourself to the places you\'ve committed to be.'
  ],
  tools:[
    { icon:'🚗', label:'Driving', route:'s-driving' },
    { icon:'🎯', label:'Set the goal', route:'s-goals' },
    { icon:'💵', label:'Gas & fare budget', route:'s-finance' }
  ],
  reflect:'Where would you go — what would you do — if getting there were never the obstacle? That\'s what this step buys you.',
  charge:'I get myself where I\'m supposed to be. Safely, on time, phone down, every time.',
  human:'Your practice hours need a calm adult in the passenger seat. Ask specifically: "Can you give me 30 minutes of driving practice this weekend?" Scheduled beats someday.'
},
{
  id:'first-work', chapter:'high-country', order:10, icon:'💼',
  name:'First Work', tagline:'Your first job teaches what no classroom can.',
  welcome:'Somebody paying you real money for real work changes how you see yourself. This step is going and getting that.',
  what:'This step is landing and keeping your first real work — a job, steady babysitting, a lawn-care hustle, a summer gig — plus the resume, the ask, and the show-up-well habits that turn a first job into a first reference.',
  understand:[
    'Your first resume feels like a joke because you "haven\'t done anything." Wrong frame. Babysitting is childcare experience. Yard work is client service. The church tech booth is A/V operations. A resume\'s job is translating what you\'ve actually done into what it actually demonstrated: reliability, effort, trust. Everyone starts with a thin page; the people who win just refuse to be embarrassed by it.',
    'Most first jobs aren\'t won by applications — they\'re won by asking. Walk in, ask if they\'re hiring, look at the human, leave a name. Tell every adult you know you\'re looking. It feels awkward for about nine seconds, and it puts you ahead of the whole pile of silent online applicants.',
    'Then keep it, because keeping a job is 80% shockingly simple: show up early, phone away, do the boring parts without being asked twice, and be pleasant to work with. Do that for six months and you have the thing that unlocks every future job — a boss who\'ll say "yes, hire them." Your first job isn\'t about the money. It\'s about becoming someone with a track record.'
  ],
  wisdom:[
    'Fifteen minutes early is on time. On time is late.',
    'Your reputation is just your habits, witnessed.'
  ],
  step:{
    title:'Build the resume, make five asks',
    how:'Build your one-page resume in Resume — translate everything you\'ve really done. Then make five real asks: applications, walk-ins, or "I\'m looking for work" conversations with adults who know you. Track every ask and answer.'
  },
  markers:[
    'A real one-page resume exists and doesn\'t embarrass you.',
    'You\'ve made five actual asks — silence and no\'s included; they count.',
    'You\'ve earned money from someone outside your family for real work.'
  ],
  tools:[
    { icon:'📄', label:'Resume builder', route:'s-resume' },
    { icon:'💼', label:'Career skills', route:'s-skills' },
    { icon:'💵', label:'First paycheck plan', route:'s-finance' }
  ],
  reflect:'What work would you actually be good at right now — and who, specifically, could you ask about it this week?',
  charge:'I show up early, work like it matters, and build a name people vouch for.',
  human:'Ask any working adult: "What was your first job, and what did it teach you?" Everyone has this story, everyone loves telling it, and every one of them contains a cheat code.'
},
{
  id:'money-grows', chapter:'high-country', order:11, icon:'🏦',
  name:'Money That Grows', tagline:'Level two: your money starts earning money.',
  welcome:'Base camp money was earn-save-spend. High country money is different: accounts, credit, and the quiet machine called compound growth.',
  what:'This step is stepping into the real financial system: a bank account you manage, understanding what credit really is before it can hurt you, and meeting the single most powerful force in money — compounding — while time is massively on your side.',
  understand:[
    'A bank account is your money\'s first real home: checking for moving money, savings for keeping it, and the discipline of checking your balance like a pilot checks fuel — routinely, not in emergencies. Learn the bank\'s tricks too: overdraft "protection" that charges you $35 to be broke, and fees that quietly eat small accounts.',
    'Credit is borrowing reputation. A credit score is just the record of whether you pay what you owe, on time — and it will someday decide your apartment, your car loan, even some jobs. The rules fit on a sticky note: pay the full balance every month, never carry a balance for "points," and treat a credit card as a debit card with a reputation attached. Credit cards aren\'t evil; carrying 24% interest is.',
    'And compounding — the reason starting young is a superpower. Money invested earns returns, then the returns earn returns. A dollar invested at 16 can outgrow ten dollars invested at 40, not because of talent, but time. You don\'t need much: understanding index funds and starting with anything at all beats understanding everything and starting at 30.'
  ],
  wisdom:[
    'Compound interest pays the patient and charges the impatient — pick your side early.',
    'Pay the card in full or don\'t swipe it. There is no third option that ends well.'
  ],
  step:{
    title:'Open the account, learn the machine',
    how:'Open (or fully take over managing) a real bank account — with a parent as required by age. Complete the credit and investing lessons in Skills. Then set up one automatic transfer, even $5, from checking to savings: your first money machine.'
  },
  markers:[
    'You have an account you actually manage — you know the balance without looking.',
    'You can explain a credit score to a friend in two sentences.',
    'Something automatic is quietly moving money toward your future every month.'
  ],
  tools:[
    { icon:'💵', label:'Money', route:'s-finance' },
    { icon:'🎓', label:'Credit & investing lessons', route:'s-skills' },
    { icon:'🎯', label:'Long-term goals', route:'s-goals' }
  ],
  reflect:'What do you want money to make possible in your life — not to buy, to make POSSIBLE? Compounding only works with a destination.',
  charge:'I\'m playing the long game. My money has a home, my name pays on time, and time is on my side.',
  human:'Opening an account under 18 requires a parent anyway — make it a conversation, not a signature: ask them to walk you through how they bank, what they\'d do differently, and what credit has cost or built for them.'
},

/* ── CHAPTER 4 · THE SUMMIT PUSH ─────────────────────────── */
{
  id:'adulting-papers', chapter:'summit-push', order:12, icon:'📋',
  name:'Adulting Papers', tagline:'The boring stuff that runs the world.',
  welcome:'Near the summit, the climb changes: less muscle, more paperwork. The adults who seem "together" just learned this stuff on purpose instead of in a crisis.',
  what:'This step is demystifying the paperwork layer of adult life: taxes (what they are, how filing works), insurance (what it\'s actually for), and your own documents — ID, social security card, records — organized and findable.',
  understand:[
    'Taxes, decoded: a slice of what you earn funds roads, schools, and the fire department; your employer withholds an estimate from each paycheck; once a year you file a return that settles the difference — often getting money BACK at your income level. Your first W-2 job makes this real. Filing a simple return is an afternoon, not a nightmare, and free tools exist for exactly your situation. Read your first pay stub line by line once: gross, withheld, net. That\'s the whole mystery.',
    'Insurance is the deal where everyone pays a little so nobody gets destroyed by a lot. Health, auto, renter\'s — the vocabulary is just four words: premium (what you pay), deductible (what you cover first), coverage (what they pay), claim (how you ask). Driving uninsured or skipping health coverage isn\'t saving money; it\'s betting your whole future against a bad day.',
    'And your documents: know where your birth certificate, social security card, and ID live. Memorize your SSN and guard it like the key it is — it\'s the master key to your identity, and identity theft against young people is common precisely because nobody\'s watching. One folder — physical or digital — labeled "Important," findable in five minutes. That folder is adulthood in miniature.'
  ],
  wisdom:[
    'Boring and important beats exciting and ignored — that\'s most of adulthood.',
    'Learn it on purpose now, or learn it in a crisis later.'
  ],
  step:{
    title:'Build your "Important" folder + finish the lessons',
    how:'Complete the taxes and insurance lessons in Skills. Then build your Important folder: locate your key documents (with a parent), list what exists and where it lives, and decode one real pay stub if you have one.'
  },
  markers:[
    'You can explain withholding and a tax return to a friend without googling.',
    'You know the four insurance words and what policies cover you right now.',
    'Your key documents are findable in five minutes, and you know your SSN cold.'
  ],
  tools:[
    { icon:'🎓', label:'Taxes & insurance lessons', route:'s-skills' },
    { icon:'💵', label:'Paycheck math', route:'s-finance' },
    { icon:'📔', label:'Document checklist', route:'s-journal' }
  ],
  reflect:'What piece of adult paperwork intimidates you most? Intimidation is usually just unfamiliarity wearing a costume — what would 30 minutes of learning do to it?',
  charge:'The boring stuff doesn\'t scare me. I learn it before it\'s urgent, and I know where everything lives.',
  human:'Ask a parent to walk you through one real document this month — their pay stub, an insurance card, last year\'s tax return. Fifteen minutes of "so this line means..." is worth a semester.'
},
{
  id:'launch', chapter:'summit-push', order:13, icon:'🏠',
  name:'Launch', tagline:'Could you run your own life for a month? Prove it.',
  welcome:'The last station before the summit. Everything on the climb converges here: could you actually live on your own?',
  what:'This step is the full dress rehearsal for independent life: knowing what living really costs, running a true monthly budget, handling home basics, and building your launch plan — whatever your launch looks like: college, work, trade school, or service.',
  understand:[
    'Start with the number nobody teaches: what a month of life actually costs. Rent for a real apartment near you, utilities, groceries, phone, transport, insurance — price it for real, tonight, with real listings. That number is your target. Every skill on this climb has secretly been preparation for clearing it.',
    'Then run the drill: a full month living inside a real budget as if you paid the bills — plan groceries and cook (Feed Yourself), track every dollar (Money Basics), keep the systems running (Own Your Day). And stock the home-basics toolkit: do laundry completely, unclog a drain, reset a breaker, hang something level, read a lease before signing anything. None of it is hard; all of it is dignity.',
    'And here\'s the truth about launching: independence doesn\'t mean alone. Adults who thrive aren\'t the ones who never need anybody — they\'re the ones who built lives strong enough to be generous FROM. You\'ll still call home. You\'ll still ask for help. The difference is you\'ll be standing on your own feet when you do.'
  ],
  wisdom:[
    'Independence isn\'t needing no one. It\'s being someone others can lean on.',
    'Price your life before life prices it for you.'
  ],
  step:{
    title:'The one-month launch drill',
    how:'Price your real monthly cost of living with actual local listings. Then run 30 days as a dress rehearsal: a written budget you track, meals you plan and cook, your systems running without reminders. Write your launch plan — the where, the when, the how — in Goals.'
  },
  markers:[
    'You know your real monthly number — priced, not guessed.',
    'You\'ve survived a full month inside a budget as if the bills were yours.',
    'A written launch plan exists: your next chapter, in your handwriting.'
  ],
  tools:[
    { icon:'🎓', label:'Adulting & home skills', route:'s-skills' },
    { icon:'💵', label:'The real budget', route:'s-finance' },
    { icon:'🎯', label:'Launch plan', route:'s-goals' },
    { icon:'📄', label:'Resume ready', route:'s-resume' }
  ],
  reflect:'Picture yourself one year after launch — the morning routine, the fridge, the bank balance, the people you call. What, specifically, does that person know that you don\'t yet?',
  charge:'I could run my own life — I\'ve priced it, planned it, and rehearsed it. When my launch day comes, I\'ll be ready and I won\'t be alone.',
  human:'Sit down with your parents or a mentor and say: "Walk me through a real month of bills." It\'s one of the most adult conversations you\'ll ever start — and they\'ve been waiting years for you to ask.'
}
];

/* ── THE HORIZON — never completable ─────────────────────── */
const LIFE_HORIZON = {
  id:'north-star', icon:'⭐',
  name:'The North Star',
  tagline:'Not a finish line — the person you\'re becoming.',
  welcome:'This isn\'t a station you complete. It\'s the light the whole climb steers by.',
  what:'Every station behind you — and every one still ahead — points past the summit to something bigger than skills: the kind of person you\'re becoming. Reliable. Honest. Generous. Someone others can count on. Adulthood isn\'t an age you reach; it\'s a way of walking that never stops being chosen.',
  wisdom:[
    { text:'Skills get you up the mountain. Character is why people are glad you made it.' },
    { text:'The goal was never to arrive. It was to become someone worth following on the way.' }
  ],
  charge:'I keep climbing. Not to arrive — to become.'
};

/* ── WEEKLY QUESTS — the life app's contest layer ─────────
   3/week rotated by ISO week. Metrics map to existing xp.js
   completion events so the wrapper hooks can bump them:
   habit, chore, school, health, goal, skill, money, journal,
   station, reflect, visit.                                  */
const LIFE_QUESTS_POOL = [
  { id:'lq-habit5',   icon:'🔁', title:'Rhythm Keeper',     desc:'Complete habits on 5 days this week',      metric:'habit',   target:5, xp:35 },
  { id:'lq-chore4',   icon:'🧹', title:'No Reminders',      desc:'Finish 4 chores this week',                metric:'chore',   target:4, xp:30 },
  { id:'lq-school3',  icon:'📚', title:'Ahead of It',       desc:'Complete 3 assignments this week',         metric:'school',  target:3, xp:30 },
  { id:'lq-health4',  icon:'💪', title:'Body Manager',      desc:'Log health (sleep/move) 4 days',           metric:'health',  target:4, xp:30 },
  { id:'lq-goal1',    icon:'🎯', title:'Summit Step',       desc:'Complete 1 goal or milestone',             metric:'goal',    target:1, xp:40 },
  { id:'lq-skill1',   icon:'🎓', title:'New Tool',          desc:'Earn 1 skill certificate',                 metric:'skill',   target:1, xp:50 },
  { id:'lq-money3',   icon:'💵', title:'Every Dollar a Job',desc:'Log 3 money transactions',                 metric:'money',   target:3, xp:25 },
  { id:'lq-journal3', icon:'📔', title:'Mind on Paper',     desc:'Write 3 journal or mood entries',          metric:'journal', target:3, xp:25 },
  { id:'lq-station1', icon:'⛰️', title:'Take a Step',       desc:'Complete 1 station on your Climb',         metric:'station', target:1, xp:50 },
  { id:'lq-reflect2', icon:'💭', title:'Trail Notes',       desc:'Write 2 station reflections',              metric:'reflect', target:2, xp:25 },
  { id:'lq-visit7',   icon:'⭐', title:'Seven Summits',     desc:'Open your Climb 7 days in a row',          metric:'visit',   target:7, xp:45 },
  { id:'lq-mix3',     icon:'🧭', title:'All-Terrain',       desc:'Be active in 3 different areas this week', metric:'domains', target:3, xp:35 }
];

// Expose globally (project convention: no modules)
window.LIFE_CHAPTERS    = LIFE_CHAPTERS;
window.LIFE_STATIONS    = LIFE_STATIONS;
window.LIFE_HORIZON     = LIFE_HORIZON;
window.LIFE_QUESTS_POOL = LIFE_QUESTS_POOL;
