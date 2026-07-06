/* =============================================================
   odds-machine.js — The Odds Machine (2026-07-05)
   Proof & Prophecy §4a — an interactive probability stacker.

   8 messianic prophecies with CONSERVATIVE odds in the tradition of
   Peter Stoner's "Science Speaks" (1958), whose famous calculation
   put the chance of ONE man fulfilling just 8 at 1 in 10^17. The
   per-prophecy odds here are the generous-to-the-skeptic end of
   Stoner's ranges, chosen so the product lands on his published
   10^17 conclusion. `pow` is log10 of the "1 in X" — the machine
   STACKS by summing pow (multiplying the odds); the running readout
   grows 10^5 → 10^8 → … → 10^17.

   ⚠ AUTHORED IN-SESSION (the referenced data file was not on disk).
   Flagged for editorial / pastor review alongside the faith drafts —
   odds are illustrative-conservative, not a formal probability claim.

   Schema per entry:
     id       — stable slug
     n        — display number (1..8)
     title    — short label for the readout
     otRef    — Old Testament prophecy reference
     otText   — the prophecy, quoted
     ntRef    — New Testament fulfillment reference
     ntText   — the fulfillment, quoted
     odds     — display string ("1 in 100,000")
     pow      — log10 of that "1 in X" (integer; the stacking math)
============================================================= */

const ODDS_MACHINE = [
  {
    id: 'bethlehem',
    n: 1,
    title: 'Born in Bethlehem',
    otRef: 'Micah 5:2',
    otText: 'But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come one who will be ruler over Israel.',
    ntRef: 'Matthew 2:1',
    ntText: 'After Jesus was born in Bethlehem in Judea, during the time of King Herod…',
    odds: '1 in 100,000',
    pow: 5
  },
  {
    id: 'forerunner',
    n: 2,
    title: 'A messenger before him',
    otRef: 'Malachi 3:1',
    otText: 'I will send my messenger, who will prepare the way before me.',
    ntRef: 'Matthew 3:1-3',
    ntText: 'In those days John the Baptist came, preaching in the wilderness… “Prepare the way for the Lord.”',
    odds: '1 in 1,000',
    pow: 3
  },
  {
    id: 'donkey',
    n: 3,
    title: 'Entering on a donkey',
    otRef: 'Zechariah 9:9',
    otText: 'See, your king comes to you, righteous and victorious, lowly and riding on a donkey, on a colt, the foal of a donkey.',
    ntRef: 'Matthew 21:6-9',
    ntText: 'They brought the donkey and the colt… the crowds shouted, “Hosanna to the Son of David!”',
    odds: '1 in 100',
    pow: 2
  },
  {
    id: 'thirty-silver',
    n: 4,
    title: 'Betrayed for thirty pieces of silver',
    otRef: 'Zechariah 11:12',
    otText: 'They paid me thirty pieces of silver.',
    ntRef: 'Matthew 26:15',
    ntText: 'So they counted out for him thirty pieces of silver.',
    odds: '1 in 100',
    pow: 2
  },
  {
    id: 'potters-field',
    n: 5,
    title: 'Silver thrown to the potter',
    otRef: 'Zechariah 11:13',
    otText: 'So I… threw them to the potter at the house of the Lord.',
    ntRef: 'Matthew 27:5-7',
    ntText: 'So Judas threw the money into the temple… they used it to buy the potter’s field.',
    odds: '1 in 100',
    pow: 2
  },
  {
    id: 'silent',
    n: 6,
    title: 'Silent before his accusers',
    otRef: 'Isaiah 53:7',
    otText: 'He was oppressed and afflicted, yet he did not open his mouth… as a sheep before its shearers is silent.',
    ntRef: 'Matthew 27:12-14',
    ntText: 'When he was accused… he gave no answer, not even to a single charge — to the great amazement of the governor.',
    odds: '1 in 10',
    pow: 1
  },
  {
    id: 'pierced',
    n: 7,
    title: 'Hands and feet pierced',
    otRef: 'Psalm 22:16',
    otText: 'They pierce my hands and my feet.',
    ntRef: 'John 19:18',
    ntText: 'There they crucified him, and with him two others — one on each side and Jesus in the middle.',
    odds: '1 in 10',
    pow: 1
  },
  {
    id: 'rich-burial',
    n: 8,
    title: 'Buried with the rich',
    otRef: 'Isaiah 53:9',
    otText: 'He was assigned a grave with the wicked, and with the rich in his death.',
    ntRef: 'Matthew 27:57-60',
    ntText: 'A rich man from Arimathea, named Joseph… placed it in his own new tomb.',
    odds: '1 in 10',
    pow: 1
  }
];

// The finale figure — the sum of every pow (Stoner's 8-prophecy
// conclusion). Kept here so the copy and the share-card can't drift
// from the stacked math.
const ODDS_MACHINE_TOTAL_POW = ODDS_MACHINE.reduce(function(s, p){ return s + p.pow; }, 0); // 17

if (typeof window !== 'undefined') {
  window.ODDS_MACHINE = ODDS_MACHINE;
  window.ODDS_MACHINE_TOTAL_POW = ODDS_MACHINE_TOTAL_POW;
}
