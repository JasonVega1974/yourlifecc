/* =============================================================
   jesus-questions.js — "Honest Questions" (Meet Jesus rebuild,
   2026-07-04). The questions people actually ask, answered plainly
   and at full strength — same honest posture as the archaeology
   certainty tags. Never strawmanned, never churchy filler.
   Each entry: id · q · a (plain answer, 2-3 short paragraphs as one
   string with \n\n breaks) · verse · verseRef ·
   deeper { label, kind } — kind: 'proof' | 'academy' | 'story'
   (routed by the Meet Jesus surface to existing doors).
   Static data — loaded with the data/*.js defer group.
============================================================= */

const JESUS_QUESTIONS = [
  { id:'real',
    q:'Was Jesus even a real person?',
    a:'Yes — and this isn\'t a church answer, it\'s the historians\' answer. Virtually every scholar of the ancient world, including skeptical and non-Christian ones, agrees Jesus of Nazareth existed, taught, and was crucified under Pontius Pilate.\n\nHe shows up outside the Bible too: the Roman historian Tacitus, the Jewish historian Josephus, and others mention him within decades of his death. For an ancient figure who never held office or led an army, the paper trail is unusually strong.',
    verse:'"He asked his disciples, \'Who do people say that the Son of Man is?\'"',
    verseRef:'Matthew 16:13',
    deeper:{ label:'See the evidence — Proof & Prophecy', kind:'proof' } },
  { id:'claim-god',
    q:'Did he actually claim to be God — or did his followers invent that later?',
    a:'He claimed it — carefully, and in ways his first audience couldn\'t miss. He took God\'s covenant name for himself ("Before Abraham was, I AM"), forgave sins that weren\'t committed against him, accepted worship, and said "whoever has seen me has seen the Father."\n\nThe strongest proof that he claimed it: it\'s what he was executed for. The charge at his trial was blasphemy. People don\'t get crucified for saying "be nice to each other."',
    verse:'"The high priest said, \'Tell us if you are the Christ, the Son of God.\' Jesus said to him, \'You have said so.\'"',
    verseRef:'Matthew 26:63-64',
    deeper:{ label:'Read his own words', kind:'words' } },
  { id:'why-die',
    q:'Why did he have to die? Couldn\'t God just forgive everyone?',
    a:'Real forgiveness always costs the forgiver. If someone wrecks your car and you forgive them, the damage doesn\'t vanish — you absorb it. The cross is God doing that at full scale: absorbing the damage instead of billing us for it.\n\nThe Bible\'s claim is not that an angry God punished an innocent third party. It\'s that God himself, in Jesus, stepped into the consequences we earned. Justice taken seriously and mercy given fully, at the same moment.',
    verse:'"God shows his love for us in that while we were still sinners, Christ died for us."',
    verseRef:'Romans 5:8',
    deeper:{ label:'The full story — start the track', kind:'story' } },
  { id:'resurrection',
    q:'Do people seriously believe he rose from the dead?',
    a:'Seriously enough that it\'s the founding claim of the faith — Paul wrote that if it didn\'t happen, Christianity is worthless. So it invites investigation, and the core facts most historians grant are striking: Jesus was really dead, the tomb was found empty, and hundreds of people — individuals and groups, skeptics included — became convinced they\'d seen him alive.\n\nEvery alternative explanation has to account for one more thing: the people closest to the facts accepted torture and death rather than take it back. Liars make poor martyrs.',
    verse:'"He is not here, for he has risen, as he said."',
    verseRef:'Matthew 28:6',
    deeper:{ label:'Weigh it yourself — Proof & Prophecy', kind:'proof' } },
  { id:'different',
    q:'What makes him different from Buddha, Muhammad, or any other founder?',
    a:'Every other founder said some version of "I found the path — follow it." Jesus said "I am the path." Others pointed away from themselves to a teaching; he pointed at himself. That\'s either the most arrogant sentence ever spoken, or it\'s true.\n\nAnd there\'s this: every other founder\'s tomb is occupied. The entire Christian claim stands or falls on an empty one.',
    verse:'"I am the way, and the truth, and the life."',
    verseRef:'John 14:6',
    deeper:{ label:'Compare the claims — Academy', kind:'academy' } },
  { id:'feelings',
    q:'Did Jesus actually feel things — or was he above all that?',
    a:'He wept at a friend\'s grave. He was indignant when his students blocked children from him. He felt compassion so physical the Greek word for it means your gut turns over. He sweat blood under dread the night before he died, and asked God for another way.\n\nWhatever you\'re feeling — grief, anger, dread, loneliness — the Christian claim is not that God watches it from a distance. It\'s that he\'s been inside it.',
    verse:'"Jesus wept."',
    verseRef:'John 11:35',
    deeper:{ label:'His words to the hurting', kind:'words' } },
  { id:'narrow',
    q:'"The only way"? Isn\'t that narrow and unfair?',
    a:'It\'s a fair objection — and worth stating at full strength: if there are many paths to God, Jesus\' claim is intolerant. But notice what kind of "only way" he claimed to be. Not a password some people never hear, but a rescue offered at God\'s own expense to anyone who wants it. Exclusive claim, radically inclusive invitation — "whoever comes to me I will never cast out."\n\nEvery worldview draws a line somewhere; even "all paths are valid" excludes everyone who disagrees with it. The question isn\'t whether there\'s a line. It\'s whether the one drawing it is trustworthy — and what it cost him to draw it where he did.',
    verse:'"Whoever comes to me I will never cast out."',
    verseRef:'John 6:37',
    deeper:{ label:'Push harder — Proof & Prophecy', kind:'proof' } },
  { id:'about-me',
    q:'What did he say about people like me?',
    a:'He was accused — constantly, by respectable people — of spending his time with exactly the wrong crowd: doubters, failures, outsiders, people with reputations. His answer: "Those who are well have no need of a physician. I came not to call the righteous, but sinners."\n\nThe pattern in the Gospels is almost embarrassing: the more disqualified a person felt, the more drawn to him they were. It was the people sure of themselves who couldn\'t stand him.',
    verse:'"Come to me, all who labor and are heavy laden, and I will give you rest."',
    verseRef:'Matthew 11:28',
    deeper:{ label:'His words — what he offered', kind:'words' } },
  { id:'want-from-me',
    q:'Okay — so what does he actually want from me?',
    a:'Not a cleanup first. Not a performance. The consistent invitation, to fishermen and tax collectors and skeptics alike, was one word: follow. Start walking with him and let the change come from knowing him, not the other way around.\n\nThat starts smaller than people think — honest prayer ("God, if you\'re real, show me"), reading what he said with an open hand, and asking your questions out loud instead of letting them calcify. He was never once recorded turning away an honest asker.',
    verse:'"Follow me."',
    verseRef:'Mark 1:17',
    deeper:{ label:'A first step — My Walk with God', kind:'walk' } },
  { id:'doubt',
    q:'What if I\'m not sure I believe any of this?',
    a:'Then you\'re in good company inside the story itself. Thomas refused secondhand reports and demanded evidence — Jesus showed up and offered it, no scolding. A desperate father prayed the most honest prayer in the Bible: "I believe; help my unbelief!" — and it was answered.\n\nDoubt isn\'t the opposite of faith; indifference is. If you\'re still asking, you\'re still in the conversation — and the invitation stands at exactly your level of certainty.',
    verse:'"I believe; help my unbelief!"',
    verseRef:'Mark 9:24',
    deeper:{ label:'Bring the hard questions — Proof & Prophecy', kind:'proof' } }
];

if (typeof window !== 'undefined') {
  window.JESUS_QUESTIONS = JESUS_QUESTIONS;
}
