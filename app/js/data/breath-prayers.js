/* =============================================================
   breath-prayers.js — Breath Prayer pairs (Increment 2, 2026-07-04)
   Ancient practice: one line prayed on the inhale, one on the
   exhale. 10 curated pairs, each rooted in a verse. Rendered by
   the prayer hub's Breath tab + full-screen session in
   faith-zones.js. Static data — loaded with the data/*.js defer
   group (small file, no lazy-load needed).
   Fields: id · inhale · exhale · ref (scripture root) ·
   when (picker hint — why you'd reach for this one).
============================================================= */

const BREATH_PRAYERS = [
  { id:'be-still',   inhale:'Be still',                 exhale:'and know that You are God',        ref:'Psalm 46:10',       when:'For racing thoughts' },
  { id:'mercy',      inhale:'Lord Jesus Christ',        exhale:'have mercy on me',                 ref:'Luke 18:13',        when:'The ancient Jesus Prayer' },
  { id:'shepherd',   inhale:'The Lord is my shepherd',  exhale:'I shall not want',                 ref:'Psalm 23:1',        when:'For wanting what you don\'t have' },
  { id:'abba',       inhale:'Abba, Father',             exhale:'I belong to You',                  ref:'Romans 8:15',       when:'For feeling unwanted' },
  { id:'spirit',     inhale:'Come, Holy Spirit',        exhale:'fill my heart',                    ref:'Acts 2',            when:'For emptiness' },
  { id:'surrender',  inhale:'Not my will',              exhale:'but Yours be done',                ref:'Luke 22:42',        when:'For letting go' },
  { id:'with-me',    inhale:'You are with me',          exhale:'I will not fear',                  ref:'Psalm 23:4',        when:'For fear' },
  { id:'strength',   inhale:'I can do all things',      exhale:'through Christ who strengthens me',ref:'Philippians 4:13',  when:'Before something hard' },
  { id:'listening',  inhale:'Speak, Lord',              exhale:'Your servant is listening',        ref:'1 Samuel 3:10',     when:'For seeking direction' },
  { id:'peace',      inhale:'My peace I give you',      exhale:'let not your heart be troubled',   ref:'John 14:27',        when:'For a troubled heart' }
];

if (typeof window !== 'undefined') {
  window.BREATH_PRAYERS = BREATH_PRAYERS;
}
