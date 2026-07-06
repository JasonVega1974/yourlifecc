/* =============================================================
   video-archive-data.js — Bible Project video archive (data only)
   Read by video-archive.js; no behavior lives here.

   A curated, offline-first playlist of BibleProject explainers,
   grouped to match the faith app's existing categories. Separate
   from the contextual anchors in data/faith-videos.js — this is the
   browsable "channel" surface.

   ⚠ youtubeId:'' means the id is NOT YET VERIFIED. Those render a
   "Video coming soon" placeholder, never a broken embed. IDs are
   never guessed — the owner fills in each // VERIFY ID before it
   goes live. Supplied/verified ids are owner-confirmed 2026-07-06.

   Channel: BibleProject — UCVfwlh9XpX2Y_tQfjeln9QA
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
      videos: [
        { title:'The Gospel',            youtubeId:'xrzq_X1NNaA', duration:'4:52' },
        { title:'Death & Resurrection',  youtubeId:'Vb24Lk1Oh5M', duration:'6:01' },
        { title:'Baptism',               youtubeId:'0k4GbvZUPuo', duration:'5:24' },
        { title:'Atonement',             youtubeId:'', duration:'' }  // VERIFY ID — search "Bible Project Atonement"
      ]
    },
    {
      eyebrow: 'WHO IS JESUS',
      videos: [
        { title:'Jesus the Messiah',     youtubeId:'p7XRPGzL6kk', duration:'7:14' },
        { title:'Son of Man',            youtubeId:'', duration:'' }, // VERIFY ID — search "Bible Project Son of Man"
        { title:'The Servant',           youtubeId:'', duration:'' }  // VERIFY ID — search "Bible Project Servant of the Lord"
      ]
    },
    {
      eyebrow: 'THE HOLY SPIRIT & PRAYER',
      videos: [
        { title:'Holy Spirit',           youtubeId:'oNNZO9i1Gjc', duration:'5:13' },
        { title:'Prayer',                youtubeId:'3-YlqQfKkKk', duration:'5:26' }
      ]
    },
    {
      eyebrow: 'WHO YOU ARE',
      videos: [
        { title:'Image of God',          youtubeId:'YbipxLDtY8c', duration:'4:48' },
        { title:'Holiness',              youtubeId:'', duration:'' }  // VERIFY ID — search "Bible Project Holiness"
      ]
    },
    {
      eyebrow: 'THE BIBLE',
      videos: [
        { title:'The Bible',             youtubeId:'7_CGP-12AE0', duration:'6:42' },
        { title:'How to Read the Bible', youtubeId:'', duration:'' }, // VERIFY ID — search "Bible Project How to Read the Bible"
        { title:'Word of God',           youtubeId:'', duration:'' }  // VERIFY ID — search "Bible Project Word of God"
      ]
    },
    {
      eyebrow: 'APOLOGETICS',
      videos: [
        { title:'Resurrection',          youtubeId:'Vb24Lk1Oh5M', duration:'6:01' },
        { title:'Creation',              youtubeId:'', duration:'' }, // VERIFY ID — search "Bible Project Creation"
        { title:'Heaven and Earth',      youtubeId:'', duration:'' }  // VERIFY ID — search "Bible Project Heaven and Earth"
      ]
    }
  ]
};

// Expose globally (project convention: no modules)
window.VIDEO_ARCHIVE = VIDEO_ARCHIVE;
