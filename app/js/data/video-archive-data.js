/* =============================================================
   video-archive-data.js — Bible Project video archive (data only)
   Read by video-archive.js; no behavior lives here.

   The FEATURED set: 9 owner-verified BibleProject explainers, grouped
   to match the faith app's categories. Fully offline. Separate from
   the contextual anchors in data/faith-videos.js.

   The archive surface also shows two LIVE sections fetched server-side
   via /api/youtube-feed (a Bible Project playlist + the channel's
   latest uploads); those are not in this file. All verified ids are
   owner-confirmed 2026-07-06.

   Channel:  BibleProject — UCVfwlh9XpX2Y_tQfjeln9QA
   Playlist: PLH0Szn1yYNedhbJcKSQbpwGmmk7fhwTyL (fetched live)
============================================================= */

const VIDEO_ARCHIVE = {
  channel: {
    id:   'UCVfwlh9XpX2Y_tQfjeln9QA',
    name: 'BibleProject',
    url:  'https://bibleproject.com'
  },
  playlists: [
    {
      eyebrow: 'GOSPEL & SALVATION',
      photoKey: 'va-gospel',
      videos: [
        { title:'The Gospel',           youtubeId:'xrzq_X1NNaA', duration:'4:52' },
        { title:'Death & Resurrection', youtubeId:'Vb24Lk1Oh5M', duration:'6:01' },
        { title:'Baptism',              youtubeId:'0k4GbvZUPuo', duration:'5:24' }
      ]
    },
    {
      eyebrow: 'WHO IS JESUS',
      photoKey: 'va-jesus',
      videos: [
        { title:'Jesus the Messiah',    youtubeId:'p7XRPGzL6kk', duration:'7:14' }
      ]
    },
    {
      eyebrow: 'THE HOLY SPIRIT & PRAYER',
      photoKey: 'va-spirit',
      videos: [
        { title:'Holy Spirit',          youtubeId:'oNNZO9i1Gjc', duration:'5:13' },
        { title:'Prayer',               youtubeId:'3-YlqQfKkKk', duration:'5:26' }
      ]
    },
    {
      eyebrow: 'WHO YOU ARE',
      photoKey: 'va-identity',
      videos: [
        { title:'Image of God',         youtubeId:'YbipxLDtY8c', duration:'4:48' }
      ]
    },
    {
      eyebrow: 'THE BIBLE',
      photoKey: 'va-bible',
      videos: [
        { title:'The Bible',            youtubeId:'7_CGP-12AE0', duration:'6:42' }
      ]
    },
    {
      eyebrow: 'APOLOGETICS',
      photoKey: 'va-apologetics',
      videos: [
        { title:'Resurrection',         youtubeId:'Vb24Lk1Oh5M', duration:'6:01' }
      ]
    }
  ]
};

// Expose globally (project convention: no modules)
window.VIDEO_ARCHIVE = VIDEO_ARCHIVE;
