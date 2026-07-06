/* =============================================================
   faith-videos.js — contextual video anchors (data only)
   Read by faith-videos.js renderer; no behavior lives here.

   These are NOT a video library. Each entry is a contextual anchor
   placed inside a specific walk station or faith surface via its
   `placement` keys:
     - 'station:<id>'  → a My Walk with God station (walk-path.js)
     - 'faith:<key>'   → a faith hub surface (faith.js bfTab)
     - 'story:<key>'   → a Story Mode beat (reserved; not yet wired)

   YouTube IDs verified/corrected 2026-07-06 (owner-supplied). Each
   youtubeId now resolves to its intended Bible Project video; the
   earlier vid-gospel/vid-resurrection collision is resolved.
============================================================= */

const FAITH_VIDEOS = [
  {
    id: 'vid-gospel',
    title: 'The Gospel',
    source: 'The Bible Project',
    youtubeId: 'xrzq_X1NNaA',
    duration: '4:52',
    placement: ['station:accepted', 'station:gospel', 'lesson:gospel-1'],
    description: 'What the gospel actually is — and why it changes everything.'
  },
  {
    id: 'vid-baptism',
    title: 'Baptism',
    source: 'The Bible Project',
    youtubeId: '0k4GbvZUPuo',
    duration: '5:24',
    placement: ['station:baptism'],
    description: 'What baptism means and why Jesus commanded it.'
  },
  {
    id: 'vid-jesus-messiah',
    title: 'Jesus the Messiah',
    source: 'The Bible Project',
    youtubeId: 'p7XRPGzL6kk',
    duration: '7:14',
    placement: ['faith:jesus', 'lesson:who-is-jesus-1'],
    description: 'Who Jesus claimed to be — and why it matters.'
  },
  {
    id: 'vid-resurrection',
    title: 'Death & Resurrection',
    source: 'The Bible Project',
    youtubeId: 'Vb24Lk1Oh5M',
    duration: '6:01',
    placement: ['faith:proof', 'story:cross', 'lesson:resurrection-1', 'lesson:resurrection-evidence'],
    description: 'The central claim of Christianity — examined.'
  },
  {
    id: 'vid-holy-spirit',
    title: 'Holy Spirit',
    source: 'The Bible Project',
    youtubeId: 'oNNZO9i1Gjc',
    duration: '5:13',
    placement: ['station:spirit', 'lesson:spirit-1', 'lesson:holy-spirit'],
    description: 'Who the Holy Spirit is and how He works in your life.'
  },
  {
    id: 'vid-prayer',
    title: 'Prayer',
    source: 'The Bible Project',
    youtubeId: '3-YlqQfKkKk',
    duration: '5:26',
    placement: ['faith:prayer', 'station:prayer-learn', 'lesson:pray-1', 'lesson:prayer-answers'],
    description: 'What prayer actually is — and how to do it.'
  },
  {
    id: 'vid-identity',
    title: 'Image of God',
    source: 'The Bible Project',
    youtubeId: 'YbipxLDtY8c',
    duration: '4:48',
    placement: ['station:assurance', 'lesson:identity-1'],
    description: 'Who you are now that you\'re in Christ.'
  },
  {
    id: 'vid-scripture',
    title: 'The Bible',
    source: 'The Bible Project',
    youtubeId: '7_CGP-12AE0',
    duration: '6:42',
    placement: ['station:word', 'faith:bible', 'lesson:read-1', 'lesson:how-to-read-bible'],
    description: 'What the Bible is and how to read it.'
  }
];

// Expose globally (project convention: no modules)
window.FAITH_VIDEOS = FAITH_VIDEOS;
