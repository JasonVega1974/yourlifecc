/* =============================================================
   faith-videos.js — contextual video anchors (data only)
   Read by faith-videos.js renderer; no behavior lives here.

   These are NOT a video library. Each entry is a contextual anchor
   placed inside a specific walk station or faith surface via its
   `placement` keys:
     - 'station:<id>'  → a My Walk with God station (walk-path.js)
     - 'faith:<key>'   → a faith hub surface (faith.js bfTab)
     - 'story:<key>'   → a Story Mode beat (reserved; not yet wired)

   ⚠ YOUTUBE IDS NEED VERIFICATION. These youtubeId values were
   supplied from an external spec and may be stale — YouTube IDs
   drift/expire and cannot be verified from the build environment.
   Confirm each resolves to the intended Bible Project video before
   relying on it in production. Known issue: vid-resurrection and
   vid-gospel currently share the same id (G-2e9mMf7E8) — at least
   one is almost certainly wrong.
============================================================= */

const FAITH_VIDEOS = [
  {
    id: 'vid-gospel',
    title: 'The Gospel',
    source: 'The Bible Project',
    youtubeId: 'G-2e9mMf7E8',
    duration: '4:52',
    placement: ['station:accepted', 'station:gospel'],
    description: 'What the gospel actually is — and why it changes everything.'
  },
  {
    id: 'vid-baptism',
    title: 'Baptism',
    source: 'The Bible Project',
    youtubeId: 'tZBm4vSdq40',
    duration: '5:24',
    placement: ['station:baptism'],
    description: 'What baptism means and why Jesus commanded it.'
  },
  {
    id: 'vid-jesus-messiah',
    title: 'Jesus the Messiah',
    source: 'The Bible Project',
    youtubeId: 'v9i2pSFWCiA',
    duration: '7:14',
    placement: ['faith:jesus'],
    description: 'Who Jesus claimed to be — and why it matters.'
  },
  {
    id: 'vid-resurrection',
    title: 'Death & Resurrection',
    source: 'The Bible Project',
    youtubeId: 'G-2e9mMf7E8',
    duration: '6:01',
    placement: ['faith:proof', 'story:cross'],
    description: 'The central claim of Christianity — examined.'
  },
  {
    id: 'vid-holy-spirit',
    title: 'Holy Spirit',
    source: 'The Bible Project',
    youtubeId: 'oNNZO9i1Gjc',
    duration: '5:13',
    placement: ['station:spirit'],
    description: 'Who the Holy Spirit is and how He works in your life.'
  },
  {
    id: 'vid-prayer',
    title: 'Prayer',
    source: 'The Bible Project',
    youtubeId: 'tYpRqKKJD0Q',
    duration: '5:26',
    placement: ['faith:prayer', 'station:prayer-learn'],
    description: 'What prayer actually is — and how to do it.'
  },
  {
    id: 'vid-identity',
    title: 'Image of God',
    source: 'The Bible Project',
    youtubeId: 'YbipxLDtY8c',
    duration: '4:48',
    placement: ['station:assurance'],
    description: 'Who you are now that you\'re in Christ.'
  },
  {
    id: 'vid-scripture',
    title: 'The Bible',
    source: 'The Bible Project',
    youtubeId: 'ak06MSETeo4',
    duration: '6:42',
    placement: ['station:word', 'faith:bible'],
    description: 'What the Bible is and how to read it.'
  }
];

// Expose globally (project convention: no modules)
window.FAITH_VIDEOS = FAITH_VIDEOS;
