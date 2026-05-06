/* =============================================================
   biblical-routes.js — Animated travel paths on the Bible Lands map (F4-A)

   Each route references existing site IDs from biblical-sites.js plus
   intermediate waypoints (lat/lng) where there's no formal site stop.
   Route playback uses SVG stroke-dashoffset on the polyline so the line
   draws progressively. Reduced-motion users get the polyline instantly.

   Tone: routes are educated reconstructions from the biblical text,
   not GPS truth. Labeled clearly in the UI as "suggested journey."
============================================================= */

const BIBLICAL_ROUTES = [
  {
    id: 'walk-with-jesus',
    label: "Walk With Jesus",
    description: "Bethlehem → ministry → empty tomb",
    color: '#10b981',           // green — matches Foundations module
    durationMs: 5000,
    waypoints: [
      { siteId: 'bethlehem',         label: 'Born',                ref: 'Luke 2:1-7'    },
      { siteId: 'nazareth',          label: 'Grew up',             ref: 'Luke 2:39-52'  },
      { siteId: 'jordan-river',      label: 'Baptized',            ref: 'Matthew 3:13-17' },
      { siteId: 'capernaum',         label: 'Ministry base',       ref: 'Matthew 4:13'  },
      { siteId: 'sea-of-galilee',    label: 'Calmed the storm',    ref: 'Mark 4:35-41'  },
      { siteId: 'caesarea-philippi', label: "Peter's confession",  ref: 'Matthew 16:13-20' },
      { siteId: 'jerusalem',         label: 'Triumphal entry',     ref: 'Matthew 21:1-11' },
      { siteId: 'gethsemane',        label: 'Arrested',            ref: 'Matthew 26:36-56' },
      { siteId: 'garden-tomb',       label: 'Risen',               ref: 'John 20:1-18'  },
    ],
  },
  {
    id: 'pauls-second-journey',
    label: "Paul's Second Journey",
    description: "Antioch → Macedonia → Athens → Corinth",
    color: '#a78bfa',           // violet
    durationMs: 5500,
    waypoints: [
      { siteId: 'antioch',  label: 'Sent out',         ref: 'Acts 15:36-41' },
      { siteId: 'damascus', label: 'Through Cilicia',  ref: 'Acts 16:1-5' },
      // Intermediate Macedonian crossing — no formal site profile.
      { lat: 40.6401, lng: 22.9444, label: 'Thessalonica', ref: 'Acts 17:1-9' },
      { siteId: 'athens',   label: 'Mars Hill sermon', ref: 'Acts 17:16-34' },
      { siteId: 'corinth',  label: 'Eighteen months',  ref: 'Acts 18:1-17' },
      { siteId: 'ephesus',  label: 'Brief stop',       ref: 'Acts 18:18-21' },
      { siteId: 'antioch',  label: 'Returned',         ref: 'Acts 18:22' },
    ],
  },
  {
    id: 'pauls-third-journey',
    label: "Paul's Third Journey",
    description: "Antioch → Ephesus (3 years) → Rome",
    color: '#f472b6',           // pink
    durationMs: 5500,
    waypoints: [
      { siteId: 'antioch',  label: 'Set out again',   ref: 'Acts 18:23' },
      { siteId: 'ephesus',  label: 'Three years',     ref: 'Acts 19:1-41' },
      // Intermediate Macedonia + Greece
      { lat: 40.6401, lng: 22.9444, label: 'Macedonia',  ref: 'Acts 20:1-3' },
      { siteId: 'corinth',  label: 'Three months',    ref: 'Acts 20:2-3' },
      { siteId: 'jerusalem', label: 'Arrested',       ref: 'Acts 21:17-36' },
      { lat: 32.4949, lng: 34.8895, label: 'Caesarea (2 yrs prison)', ref: 'Acts 24:27' },
      { siteId: 'rome',     label: 'Final imprisonment', ref: 'Acts 28:16-31' },
    ],
  },
  {
    id: 'exodus',
    label: "The Exodus",
    description: "Egypt → Sinai → Promised Land",
    color: '#fbbf24',           // amber — represents fire/cloud
    durationMs: 6000,
    waypoints: [
      { lat: 30.0444, lng: 31.2357, label: 'Egypt (Goshen)',     ref: 'Exodus 12' },
      { lat: 30.0028, lng: 32.5499, label: 'Red Sea crossing',   ref: 'Exodus 14' },
      { siteId: 'mt-sinai',         label: 'Mount Sinai · Law',  ref: 'Exodus 19-20' },
      { lat: 30.6500, lng: 34.7833, label: 'Wilderness wandering', ref: 'Numbers 14:33-34' },
      { lat: 31.7456, lng: 35.7253, label: 'Crossing the Jordan', ref: 'Joshua 3' },
      { siteId: 'jericho',          label: 'Jericho falls',       ref: 'Joshua 6' },
    ],
  },
  {
    id: 'patriarchs',
    label: "The Patriarchs",
    description: "Abraham → Isaac → Jacob → Joseph",
    color: '#38bdf8',           // cyan
    durationMs: 6000,
    waypoints: [
      // Abraham: Ur → Haran → Canaan → Egypt → back
      { lat: 30.9626, lng: 46.1059, label: 'Ur (Abraham\'s home)', ref: 'Genesis 11:31' },
      { lat: 36.8623, lng: 39.0322, label: 'Haran',               ref: 'Genesis 12:4' },
      { siteId: 'shechem',           label: 'Canaan promise',      ref: 'Genesis 12:6-7' },
      { siteId: 'bethel',            label: 'Altar at Bethel',     ref: 'Genesis 12:8' },
      { siteId: 'hebron',            label: 'Hebron settlement',   ref: 'Genesis 23' },
      // Joseph's journey to Egypt
      { lat: 30.0444, lng: 31.2357, label: 'Joseph in Egypt',     ref: 'Genesis 37-50' },
    ],
  },
];

if (typeof window !== 'undefined') {
  window.BIBLICAL_ROUTES = BIBLICAL_ROUTES;
}
