/* =============================================================
   red-letters.js — "In His Own Words" (Meet Jesus rebuild, 2026-07-04)
   The actual recorded statements of Jesus — the red-letter tradition.
   25 curated entries in 4 groups. Each entry:
     id · group · text (his words, ESV-flavored) · ref ·
     scene (one line: who he said it to, when) ·
     then (one line: why it landed hard on first hearers — stated
           plainly, never flippant; these are claims, not captions)
   TONE RULE (ratified 2026-07-04, pre-build ux review): the `then`
   line is museum wall-label register. No modern slang, no
   exclamation points, no "can you imagine" rhetorical framing, no
   hot-take cadence. State the historical weight and stop.
   Rendered by the Meet Jesus "In His Own Words" resumable reader in
   faith.js (NOT a swipe deck — position persists in D.jwIdx).
   Static data — loaded with the data/*.js defer group.
============================================================= */

const RED_LETTERS = [
  // ── WHO HE SAID HE WAS ─────────────────────────────────────
  { id:'way',      group:'Who he said he was',
    text:'I am the way, and the truth, and the life. No one comes to the Father except through me.',
    ref:'John 14:6',
    scene:'To his closest friends, hours before his arrest.',
    then:'Not "I know the way" — I am it. Teachers point; he claimed to be the destination.' },
  { id:'before-abraham', group:'Who he said he was',
    text:'Before Abraham was, I am.',
    ref:'John 8:58',
    scene:'To religious scholars, in the temple courts.',
    then:'"I AM" is the name God gave Moses at the burning bush. They picked up stones on the spot — they knew exactly what he was claiming.' },
  { id:'father-one', group:'Who he said he was',
    text:'I and the Father are one.',
    ref:'John 10:30',
    scene:'Walking the temple colonnade in winter, pressed to say plainly if he was the Christ.',
    then:'A one-sentence answer that ended the conversation and nearly ended his life — the charge was blasphemy.' },
  { id:'bread',    group:'Who he said he was',
    text:'I am the bread of life; whoever comes to me shall not hunger.',
    ref:'John 6:35',
    scene:'The day after feeding five thousand people, to a crowd chasing another meal.',
    then:'They wanted breakfast; he offered himself. Many walked away that day — he let them.' },
  { id:'light',    group:'Who he said he was',
    text:'I am the light of the world. Whoever follows me will not walk in darkness.',
    ref:'John 8:12',
    scene:'In the temple treasury, under the great festival lamps of Jerusalem.',
    then:'The lamps celebrated God leading Israel by fire in the desert. He stood beneath them and said: that was me.' },
  { id:'resurrection', group:'Who he said he was',
    text:'I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live.',
    ref:'John 11:25',
    scene:'To a grieving sister, outside her brother\'s tomb — minutes before he called him out of it.',
    then:'He didn\'t say "there will be a resurrection someday." He said it was standing in front of her.' },
  { id:'seen-me',  group:'Who he said he was',
    text:'Whoever has seen me has seen the Father.',
    ref:'John 14:9',
    scene:'To Philip, who had just asked him to "show us the Father."',
    then:'Every question about what God is like, he answered with himself.' },

  // ── WHAT HE OFFERED ────────────────────────────────────────
  { id:'rest',     group:'What he offered',
    text:'Come to me, all who labor and are heavy laden, and I will give you rest.',
    ref:'Matthew 11:28',
    scene:'To crowds crushed under rules the religious leaders wouldn\'t lift a finger to carry.',
    then:'Every other teacher said "carry more, try harder." He said: bring it here.' },
  { id:'living-water', group:'What he offered',
    text:'Whoever drinks of the water that I will give him will never be thirsty again.',
    ref:'John 4:14',
    scene:'Noon, at a well, to a Samaritan woman everyone else crossed the street to avoid.',
    then:'A Jewish rabbi wasn\'t supposed to speak to her at all. He offered her the longest theology conversation in the Gospels.' },
  { id:'abundant', group:'What he offered',
    text:'I came that they may have life and have it abundantly.',
    ref:'John 10:10',
    scene:'Explaining why he came, against a thief who "comes only to steal and kill and destroy."',
    then:'The rumor has always been that God shrinks your life. He said he came to do the opposite.' },
  { id:'peace',    group:'What he offered',
    text:'My peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled.',
    ref:'John 14:27',
    scene:'The night before his execution — comforting them.',
    then:'He was hours from torture, and he was the calmest person in the room.' },
  { id:'with-you', group:'What he offered',
    text:'Behold, I am with you always, to the end of the age.',
    ref:'Matthew 28:20',
    scene:'His last recorded words on a hillside in Galilee, after the resurrection.',
    then:'Not "remember my teachings" — I am with you. A dead teacher can\'t promise presence.' },
  { id:'forgiven', group:'What he offered',
    text:'Son, your sins are forgiven.',
    ref:'Mark 2:5',
    scene:'To a paralyzed man lowered through a torn-open roof by four friends.',
    then:'The scholars in the room did the math instantly: "Who can forgive sins but God alone?" That was the point.' },

  // ── WHAT HE ASKED ──────────────────────────────────────────
  { id:'follow',   group:'What he asked',
    text:'Follow me.',
    ref:'Mark 1:17',
    scene:'To working fishermen, mid-shift, nets in hand.',
    then:'Rabbis waited for students to apply. He walked up to ordinary men at work and chose them.' },
  { id:'deny',     group:'What he asked',
    text:'If anyone would come after me, let him deny himself and take up his cross and follow me.',
    ref:'Mark 8:34',
    scene:'To the crowd, right after predicting his own execution.',
    then:'A cross wasn\'t a metaphor yet. Everyone listening had seen one used.' },
  { id:'love-enemies', group:'What he asked',
    text:'Love your enemies and pray for those who persecute you.',
    ref:'Matthew 5:44',
    scene:'On a hillside, to people living under Roman occupation.',
    then:'To an audience whose enemies carried swords and collected their taxes. No teacher had ever set the bar there.' },
  { id:'first-stone', group:'What he asked',
    text:'Let him who is without sin among you be the first to throw a stone at her.',
    ref:'John 8:7',
    scene:'To a mob mid-execution, a woman on the ground between them.',
    then:'One sentence disarmed a crowd. He was the only one there who qualified — and he didn\'t throw.' },
  { id:'love-one-another', group:'What he asked',
    text:'A new commandment I give to you, that you love one another: just as I have loved you.',
    ref:'John 13:34',
    scene:'Minutes after washing his students\' feet — the job reserved for the lowest servant.',
    then:'The standard isn\'t "love them as they deserve." It\'s "as I have loved you" — and he was about to show how far that went.' },
  { id:'be-perfect', group:'What he asked',
    text:'You therefore must be perfect, as your heavenly Father is perfect.',
    ref:'Matthew 5:48',
    scene:'Closing the most famous sermon ever preached.',
    then:'An impossible standard — on purpose. It\'s the line that makes everyone stop trying to be good enough and start needing grace.' },

  // ── HOW HE LOVED ───────────────────────────────────────────
  { id:'children', group:'How he loved',
    text:'Let the little children come to me and do not hinder them, for to such belongs the kingdom of God.',
    ref:'Mark 10:14',
    scene:'His own students were shooing the kids away. The text says he was indignant.',
    then:'In a world where children had no status, he made them the picture of who gets in.' },
  { id:'weep',     group:'How he loved',
    text:'Jesus wept.',
    ref:'John 11:35',
    scene:'At the tomb of his friend Lazarus — whom he was about to raise.',
    then:'He knew the ending was good and he cried anyway. Grief isn\'t a lack of faith; God did it.' },
  { id:'father-forgive', group:'How he loved',
    text:'Father, forgive them, for they know not what they do.',
    ref:'Luke 23:34',
    scene:'From the cross, about the men driving the nails.',
    then:'He practiced Matthew 5:44 at the one moment no one would have blamed him for skipping it.' },
  { id:'paradise', group:'How he loved',
    text:'Truly, I say to you, today you will be with me in paradise.',
    ref:'Luke 23:43',
    scene:'To the criminal dying next to him, who had nothing to offer but a request.',
    then:'No time to clean up his life, join anything, or prove anything. He asked; Jesus answered.' },
  { id:'lost',     group:'How he loved',
    text:'The Son of Man came to seek and to save the lost.',
    ref:'Luke 19:10',
    scene:'At dinner in the house of Zacchaeus — the most hated tax collector in Jericho.',
    then:'The crowd grumbled that he\'d chosen the worst man in town. He answered that this was the reason he came.' },
  { id:'know-mine', group:'How he loved',
    text:'I am the good shepherd. I know my own and my own know me.',
    ref:'John 10:14',
    scene:'Contrasting himself with hired hands who run when the wolf comes.',
    then:'The difference between a hireling and a shepherd is what they\'ll do when it costs. He said he\'d lay down his life — then did.' }
];

if (typeof window !== 'undefined') {
  window.RED_LETTERS = RED_LETTERS;
}
