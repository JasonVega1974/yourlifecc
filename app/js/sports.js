/* ═══════════════════════════════════════════════════════════
   sports.js  —  YourLife CC
   Explore grid + My Sports with full Stats & Profile editing
   ═══════════════════════════════════════════════════════════ */

/* ── Sport catalogue ───────────────────────────────────────── */
const SPORT_DATA = [
  {
    id:'football', name:'Football', emoji:'🏈', gender:'boys',
    levels:['ms','hs','college'],
    desc:'America\'s most popular team sport. Requires strength, speed, and strategy.',
    scholarship:{pct:'Less than 1%',avg:'$10,000–$30,000/yr',note:'Only ~6.5% of HS players go on to play college ball. D1 full rides exist but are extremely rare.'},
    health:{injuries:'Concussions, ACL tears, shoulder injuries',prevention:'Proper tackling technique, strength training, rest'},
    development:'Focus on film study, versatility, and GPA. Coaches recruit character.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'td',label:'Touchdowns',type:'number'},
      {key:'yds',label:'Yards',type:'number'},
      {key:'tackles',label:'Tackles',type:'number'},
      {key:'sacks',label:'Sacks',type:'number'},
      {key:'int',label:'Interceptions',type:'number'},
    ]
  },
  {
    id:'basketball', name:'Basketball', emoji:'🏀', gender:'both',
    levels:['ms','hs','college'],
    desc:'Fast-paced, skill-intensive game built on footwork, IQ, and conditioning.',
    scholarship:{pct:'About 1%',avg:'$10,000–$40,000/yr',note:'D1 basketball offers full scholarships. Be seen at AAU tournaments and camps.'},
    health:{injuries:'Ankle sprains, knee issues, shin splints',prevention:'Dynamic warmup, ankle strengthening, proper landing'},
    development:'Ball handling and shooting every day. Film yourself. Attend open gyms.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'ppg',label:'Points Per Game',type:'number'},
      {key:'rpg',label:'Rebounds Per Game',type:'number'},
      {key:'apg',label:'Assists Per Game',type:'number'},
      {key:'spg',label:'Steals Per Game',type:'number'},
      {key:'fgPct',label:'FG%',type:'number'},
    ]
  },
  {
    id:'soccer', name:'Soccer', emoji:'⚽', gender:'both',
    levels:['ms','hs','college'],
    desc:'The world\'s most popular sport. Demands endurance, technical skill, and vision.',
    scholarship:{pct:'About 2–3%',avg:'Partial — avg $8,000/yr',note:'D1 women\'s soccer has more scholarships than men\'s. Club soccer is key for recruiting.'},
    health:{injuries:'ACL tears, ankle sprains, concussions from headers',prevention:'Neuromuscular training, proper heading technique'},
    development:'Club soccer is essential for recruiting. Build a highlight reel by sophomore year.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'goals',label:'Goals',type:'number'},
      {key:'assists',label:'Assists',type:'number'},
      {key:'shots',label:'Shots',type:'number'},
      {key:'saves',label:'Saves (GK)',type:'number'},
      {key:'cleanSheets',label:'Clean Sheets',type:'number'},
    ]
  },
  {
    id:'baseball', name:'Baseball', emoji:'⚾', gender:'boys',
    levels:['ms','hs','college'],
    desc:'A game of patience, precision, and explosive moments. High recruiting visibility.',
    scholarship:{pct:'About 2%',avg:'Partial — avg $7,500/yr',note:'D1 baseball has 11.7 scholarships split among a 27-man roster. Showcase camps matter.'},
    health:{injuries:'Rotator cuff, elbow (UCL), back strain',prevention:'Pitch counts, proper mechanics, off-season rest'},
    development:'Showcase tournaments and Perfect Game profiles are how recruiters find you.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'avg',label:'Batting Avg',type:'number'},
      {key:'hr',label:'Home Runs',type:'number'},
      {key:'rbi',label:'RBIs',type:'number'},
      {key:'era',label:'ERA (Pitchers)',type:'number'},
      {key:'k',label:'Strikeouts (P)',type:'number'},
    ]
  },
  {
    id:'softball', name:'Softball', emoji:'🥎', gender:'girls',
    levels:['ms','hs','college'],
    desc:'Fast-pitch softball is one of the most scholarship-rich women\'s sports in college.',
    scholarship:{pct:'About 5–7%',avg:'$10,000–Full ride',note:'D1 softball offers 12 full scholarships. One of the best ROI sports for female athletes.'},
    health:{injuries:'Shoulder, elbow, ankle',prevention:'Proper pitching mechanics, arm care routines'},
    development:'Travel ball exposure and pitching skill are the biggest recruiting factors.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'avg',label:'Batting Avg',type:'number'},
      {key:'hr',label:'Home Runs',type:'number'},
      {key:'rbi',label:'RBIs',type:'number'},
      {key:'era',label:'ERA (Pitchers)',type:'number'},
      {key:'k',label:'Strikeouts (P)',type:'number'},
    ]
  },
  {
    id:'track', name:'Track & Field', emoji:'🏃', gender:'both',
    levels:['ms','hs','college'],
    desc:'Sprints, jumps, throws, distance — a sport for every body type.',
    scholarship:{pct:'About 1–2%',avg:'Partial — avg $6,000/yr',note:'D1 track has 18 scholarships split across many events. Elite times/distances are key.'},
    health:{injuries:'Shin splints, stress fractures, hamstring pulls',prevention:'Gradual mileage increase, proper footwear, recovery'},
    development:'Focus on one or two events. State-level performance opens college doors.',
    statFields:[
      {key:'event',label:'Primary Event',type:'text'},
      {key:'pr',label:'Personal Record',type:'text'},
      {key:'placings',label:'Top Placings',type:'text'},
      {key:'gp',label:'Meets Competed',type:'number'},
    ]
  },
  {
    id:'crosscountry', name:'Cross Country', emoji:'🏔️', gender:'both',
    levels:['ms','hs','college'],
    desc:'Distance running across varied terrain. Builds mental toughness and aerobic base.',
    scholarship:{pct:'About 1%',avg:'Partial — avg $5,000/yr',note:'Most scholarships are partial. Sub-16 5K for boys, sub-18 for girls gets attention.'},
    health:{injuries:'IT band, stress fractures, plantar fasciitis',prevention:'Recovery runs, foam rolling, strength work'},
    development:'Consistency beats intensity. Log your miles and race times every season.',
    statFields:[
      {key:'gp',label:'Races Competed',type:'number'},
      {key:'pr5k',label:'5K PR',type:'text'},
      {key:'prMile',label:'Mile PR',type:'text'},
      {key:'bestPlace',label:'Best Finish Place',type:'number'},
    ]
  },
  {
    id:'volleyball', name:'Volleyball', emoji:'🏐', gender:'both',
    levels:['ms','hs','college'],
    desc:'An explosive, technical team sport with strong scholarship opportunities.',
    scholarship:{pct:'About 3–4%',avg:'$10,000–Full ride (women)',note:'Women\'s volleyball is a "headcount" sport at D1 — 12 full scholarships. Club is critical.'},
    health:{injuries:'Ankle sprains, patellar tendinitis, shoulder',prevention:'Plyometric training, proper landing, ankle bracing'},
    development:'Club volleyball is the #1 recruiting pathway. Liberos and setters in high demand.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'kills',label:'Kills',type:'number'},
      {key:'digs',label:'Digs',type:'number'},
      {key:'blocks',label:'Blocks',type:'number'},
      {key:'aces',label:'Aces',type:'number'},
      {key:'assists',label:'Assists',type:'number'},
    ]
  },
  {
    id:'swimming', name:'Swimming', emoji:'🏊', gender:'both',
    levels:['ms','hs','college'],
    desc:'Individual and relay events in a sport with excellent scholarship opportunities.',
    scholarship:{pct:'About 2–3%',avg:'Partial — avg $12,000/yr',note:'D1 has 9.9 (men) and 14 (women) scholarships. Event times must be nationally competitive.'},
    health:{injuries:'Shoulder impingement, neck strain, knee',prevention:'Dry-land strength work, technique focus, rest weeks'},
    development:'USA Swimming times and club rankings are how college coaches find you.',
    statFields:[
      {key:'event1',label:'Primary Event',type:'text'},
      {key:'pr1',label:'Primary PR',type:'text'},
      {key:'event2',label:'Secondary Event',type:'text'},
      {key:'pr2',label:'Secondary PR',type:'text'},
      {key:'meets',label:'Meets Competed',type:'number'},
    ]
  },
  {
    id:'wrestling', name:'Wrestling', emoji:'🤼', gender:'boys',
    levels:['ms','hs','college'],
    desc:'One of the oldest sports. Demands strength, technique, and mental toughness.',
    scholarship:{pct:'About 1–2%',avg:'Partial — avg $8,000/yr',note:'D1 has 9.9 scholarships across 10 weight classes. State placement and technique win recruits.'},
    health:{injuries:'Skin infections, shoulder, knee',prevention:'Hygiene protocols, strength training, avoid cutting weight aggressively'},
    development:'State placers get recruited. Don\'t cut weight — compete at your natural weight.',
    statFields:[
      {key:'weightClass',label:'Weight Class',type:'text'},
      {key:'record',label:'Season Record (W-L)',type:'text'},
      {key:'pins',label:'Pins',type:'number'},
      {key:'techFalls',label:'Tech Falls',type:'number'},
      {key:'majDec',label:'Major Decisions',type:'number'},
    ]
  },
  {
    id:'tennis', name:'Tennis', emoji:'🎾', gender:'both',
    levels:['ms','hs','college'],
    desc:'Individual skill meets strategy in one of the most globally played sports.',
    scholarship:{pct:'About 2–3%',avg:'Partial — avg $9,000/yr',note:'D1 offers 4.5 (men) and 8 (women) scholarships. UTR rating is the universal recruiting metric.'},
    health:{injuries:'Tennis elbow, wrist strain, rotator cuff',prevention:'Proper grip technique, forearm strengthening, rest'},
    development:'Get a UTR profile. Play USTA sanctioned tournaments. Rankings matter.',
    statFields:[
      {key:'utr',label:'UTR Rating',type:'text'},
      {key:'record',label:'Season Record (W-L)',type:'text'},
      {key:'ranking',label:'State/Regional Ranking',type:'text'},
      {key:'tourneys',label:'Tournaments Played',type:'number'},
    ]
  },
  {
    id:'golf', name:'Golf', emoji:'⛳', gender:'both',
    levels:['ms','hs','college'],
    desc:'A precision sport with strong academic culture and excellent scholarship ROI.',
    scholarship:{pct:'About 1–2%',avg:'Partial — avg $10,000/yr',note:'D1 men\'s has 4.5 and women\'s has 6 scholarships. Handicap index and state rankings drive recruiting.'},
    health:{injuries:'Back strain, wrist, elbow',prevention:'Core strength, proper swing mechanics, flexibility'},
    development:'AJGA events and a verified handicap index are essential for recruiting.',
    statFields:[
      {key:'handicap',label:'Handicap Index',type:'text'},
      {key:'avgScore',label:'Avg Score (18 holes)',type:'number'},
      {key:'events',label:'Events Played',type:'number'},
      {key:'bestFinish',label:'Best Tournament Finish',type:'text'},
    ]
  },
  {
    id:'lacrosse', name:'Lacrosse', emoji:'🥍', gender:'both',
    levels:['ms','hs','college'],
    desc:'One of the fastest growing sports in America. Strong scholarship growth.',
    scholarship:{pct:'About 3–4%',avg:'Partial — avg $11,000/yr',note:'D1 men\'s has 12.6 and women\'s has 12 scholarships. Club lacrosse visibility is key.'},
    health:{injuries:'Concussions, shoulder, wrist',prevention:'Proper equipment, stick skills training, conditioning'},
    development:'Attend recruiting showcases. Coaches recruit at club tournaments heavily.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'goals',label:'Goals',type:'number'},
      {key:'assists',label:'Assists',type:'number'},
      {key:'groundBalls',label:'Ground Balls',type:'number'},
      {key:'saves',label:'Saves (Goalie)',type:'number'},
    ]
  },
  {
    id:'gymnastics', name:'Gymnastics', emoji:'🤸', gender:'girls',
    levels:['ms','hs','college'],
    desc:'Power, grace, and discipline in one of the most technically demanding sports.',
    scholarship:{pct:'About 5–7%',avg:'$10,000–Full ride',note:'D1 women\'s gymnastics has 12 full scholarships — one of the best scholarships-to-athletes ratios.'},
    health:{injuries:'Wrist, ankle, back, stress fractures',prevention:'Progressive skill development, rest, nutrition'},
    development:'Level 8–10 USAG and J.O. competition experience is what colleges look for.',
    statFields:[
      {key:'level',label:'USAG Level',type:'text'},
      {key:'vault',label:'Vault Score',type:'number'},
      {key:'bars',label:'Bars Score',type:'number'},
      {key:'beam',label:'Beam Score',type:'number'},
      {key:'floor',label:'Floor Score',type:'number'},
      {key:'allAround',label:'All-Around Score',type:'number'},
    ]
  },
  {
    id:'hockey', name:'Hockey', emoji:'🏒', gender:'both',
    levels:['hs','college'],
    desc:'Fast, physical, and technical — ice hockey demands skill and dedication.',
    scholarship:{pct:'About 1–2%',avg:'Partial–Full (D1)',note:'D1 men\'s has 18 full scholarships. Playing juniors (USHL/NAHL) is often the path to D1.'},
    health:{injuries:'Concussions, shoulder, wrist',prevention:'Proper equipment, body contact rules, conditioning'},
    development:'AAA youth hockey, prep school, or junior hockey are pathways to college recruitment.',
    statFields:[
      {key:'gp',label:'Games Played',type:'number'},
      {key:'goals',label:'Goals',type:'number'},
      {key:'assists',label:'Assists',type:'number'},
      {key:'plusMinus',label:'+/-',type:'number'},
      {key:'pim',label:'Penalty Minutes',type:'number'},
      {key:'saves',label:'Saves (Goalie)',type:'number'},
    ]
  },
  {
    id:'cheerleading', name:'Cheerleading', emoji:'📣', gender:'girls',
    levels:['ms','hs','college'],
    desc:'Combines athleticism, tumbling, stunting, and performance. Growing in competition.',
    scholarship:{pct:'Limited — varies by school',avg:'Activity scholarships — not NCAA',note:'Competitive cheer is not an NCAA sport but some schools offer activity scholarships. It\'s a growing field.'},
    health:{injuries:'Ankle, wrist, concussions from stunting falls',prevention:'Proper spotting, progressive stunt training, conditioning'},
    development:'All-Star competitive cheer builds skills fastest. School cheer adds visibility.',
    statFields:[
      {key:'level',label:'All-Star Level',type:'text'},
      {key:'tumblingLevel',label:'Tumbling Skills',type:'text'},
      {key:'yearsExp',label:'Years Experience',type:'number'},
      {key:'competitions',label:'Competitions This Season',type:'number'},
    ]
  },
];

/* ── Explore tab ───────────────────────────────────────────── */
let _activeGender = 'all';
let _activeLevel  = 'all';

function filterSports(gender, btn){
  _activeGender = gender;
  document.querySelectorAll('#sp-explore .tabs:first-child .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSportsGrid();
}

function filterSportsLevel(level, btn){
  _activeLevel = level;
  document.querySelectorAll('#sp-explore .tabs:last-of-type .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSportsGrid();
}

/* Sports world-class · Phase 1 — Explore cards wear the shared Power-Card
   shell (tlc-power). A stable per-sport theme (2 of each of the 8 palettes)
   so a sport's colour doesn't shift when filters reorder the grid. The shell
   CSS lives in app.css (#s-sports added to the shared selectors). */
const SPORT_THEME = {
  football:'forge',  basketball:'ember',   soccer:'hunter',    baseball:'ocean',
  softball:'mind',   track:'lightning',    crosscountry:'treasury', volleyball:'time',
  swimming:'ocean',  wrestling:'forge',    tennis:'hunter',    golf:'treasury',
  lacrosse:'mind',   gymnastics:'ember',   hockey:'lightning', cheerleading:'time'
};
function renderSportsGrid(){
  const grid = document.getElementById('sportsGrid');
  if(!grid) return;
  const filtered = SPORT_DATA.filter(s=>{
    const gOk = _activeGender==='all' || s.gender===_activeGender || s.gender==='both';
    const lOk = _activeLevel==='all' || s.levels.includes(_activeLevel);
    return gOk && lOk;
  });
  grid.innerHTML = filtered.map((s,i)=>{
    const theme  = SPORT_THEME[s.id] || 'lightning';
    // Abbreviated so it stays a single tight meta-line in the 2-col phone grid
    // (full names wrapped to 3 ragged lines). MS/HS are explained in the section header.
    const levels = s.levels.map(l=>l==='ms'?'MS':l==='hs'?'HS':'College').join(' · ');
    // Staggered, repeating shimmer delay (bounded to 3 sweeps in CSS); replays
    // on entry because renderSports() re-runs this from the showSection hook.
    const delay  = ((i % 6) * 0.16).toFixed(2);
    return '<button type="button" class="tab-landing-card tlc-power"'
      + ' data-theme="' + theme + '"'
      + ' style="--tlc-shimmer-delay:' + delay + 's;"'
      + ' onclick="showSportDetail(\'' + s.id + '\')"'
      + ' aria-label="' + s.name + '">'
      + '<span class="tlc-shimmer" aria-hidden="true"></span>'
      + '<span class="tlc-icon" aria-hidden="true">' + s.emoji + '</span>'
      + '<span class="tlc-label">' + s.name + '</span>'
      + '<span class="tlc-sub">' + levels + '</span>'
    + '</button>';
  }).join('');
}

/* Section render entry — wired to the showSection('s-sports') hook in ui.js
   (was a no-op: renderSports didn't exist). Re-rendering the Explore grid on
   entry replays the bounded shimmer. Filters persist via the module vars. */
function renderSports(){ _injectFinderLaunch(); renderSportsGrid(); }

/* ── Sport detail sheet (Phase 2A) ───────────────────────────
   A Power-Card-styled sheet built from SPORT_DATA. Theme accent on the
   header ties it to the Explore card's colour (the shell nod); the body
   is clean, organised content with conventional meaning-colours (gold =
   scholarship, amber/green = injury/prevention, blue = development). The
   existing health-first framing — scholarship realism, anti-weight-cutting,
   injury prevention — is presented verbatim, not rewritten. CSS: app.css
   .sds-* (light/dark/reduced-motion handled). */
const THEME_HEX = {
  forge:['#fb923c','#ef4444'], ember:['#f59e0b','#f43f5e'], hunter:['#34d399','#14b8a6'],
  ocean:['#06b6d4','#3b82f6'], mind:['#ec4899','#f472b6'], lightning:['#38bdf8','#38bdf8'],
  treasury:['#fbbf24','#16a34a'], time:['#38bdf8','#22d3ee']
};
function _sdEsc(s){ return (typeof escapeHtml==='function') ? escapeHtml(String(s==null?'':s)) : String(s==null?'':s); }
function _sportSheetEl(){
  let m = document.getElementById('sportDetailModal');
  if(m) return m;
  m = document.createElement('div');
  m.id = 'sportDetailModal';
  m.className = 'sds-overlay';
  document.body.appendChild(m);
  m.addEventListener('click', e=>{ if(e.target===m) closeSportSheet(); });
  if(!window._sdsKeyWired){
    window._sdsKeyWired = true;
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeSportSheet(); });
  }
  return m;
}
function closeSportSheet(){
  const m = document.getElementById('sportDetailModal');
  if(m){ m.classList.remove('open'); m.classList.remove('sds-full'); document.body.style.overflow=''; }
  // a11y — return focus to the sport card that opened the sheet.
  try { if(window._sdsReturnFocus && window._sdsReturnFocus.focus) window._sdsReturnFocus.focus(); } catch(e){}
}
/* Distraction-free reading: a CSS expand (NOT the browser Fullscreen API — more
   predictable in the PWA, esp. iOS) that grows the sheet to fill the whole window.
   The overlay is already fixed/inset:0 at z 9999, so it covers the app's nav +
   top bar; full-screen just removes the centered-card margins. The close X stays
   put (both controls are absolute to the sheet). Reduced-motion handled in CSS. */
var _SDS_FS_EXPAND   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
var _SDS_FS_COLLAPSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>';
var _SDS_CLOSE_X     = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6 18 18M18 6 6 18"/></svg>';
function toggleSportSheetFull(btn){
  const m = document.getElementById('sportDetailModal'); if(!m) return;
  const full = m.classList.toggle('sds-full');
  // Brief cross-fade so entering/exiting full screen reads polished, not abrupt.
  // (CSS @keyframes sds-fade; zeroed under prefers-reduced-motion.) Reflow to restart it.
  const sh = m.querySelector('.sds-sheet');
  if(sh){ sh.classList.remove('sds-anim'); void sh.offsetWidth; sh.classList.add('sds-anim'); }
  if(btn){
    btn.setAttribute('aria-pressed', full ? 'true' : 'false');
    btn.setAttribute('aria-label', full ? 'Exit full screen' : 'Enter full screen');
    btn.innerHTML = full ? _SDS_FS_COLLAPSE : _SDS_FS_EXPAND;
  }
}
function showSportDetail(id){
  const s = SPORT_DATA.find(x=>x.id===id);
  if(!s) return;
  const m = _sportSheetEl();
  const theme = (typeof SPORT_THEME!=='undefined' && SPORT_THEME[id]) ? SPORT_THEME[id] : 'lightning';
  const hex   = THEME_HEX[theme] || THEME_HEX.lightning;
  const levelName  = l => l==='ms'?'Middle School' : l==='hs'?'High School' : 'College';
  const levelChips = s.levels.map(l=>'<span class="sds-chip">'+levelName(l)+'</span>').join('');
  // Phase 3: a sport with an authored SPORT_DETAIL entry renders the deep guide;
  // every other sport renders the original basic sheet byte-for-byte (below).
  const detail  = (typeof SPORT_DETAIL!=='undefined' && SPORT_DETAIL[id]) ? SPORT_DETAIL[id] : null;
  const tagline = (detail && detail.tagline) ? '<p class="sds-tag">'+_sdEsc(detail.tagline)+'</p>' : '';
  const body    = detail ? _sportDeepBody(s, detail) : _sportBasicBody(s);
  m.innerHTML =
    '<div class="sds-sheet" role="dialog" aria-modal="true" tabindex="-1" aria-label="' + _sdEsc(s.name) + ' details" style="--sd-a:' + hex[0] + ';--sd-b:' + hex[1] + ';">'
    + '<div class="sds-controls">'
    +   '<button class="sds-fs" type="button" aria-label="Enter full screen" aria-pressed="false" onclick="toggleSportSheetFull(this)">' + _SDS_FS_EXPAND + '</button>'
    +   '<button class="sds-close" type="button" aria-label="Close" onclick="closeSportSheet()">' + _SDS_CLOSE_X + '</button>'
    + '</div>'
    + '<div class="sds-head">'
    +   '<span class="sds-emoji" aria-hidden="true">' + s.emoji + '</span>'
    +   '<div class="sds-headtext"><h2 class="sds-name">' + _sdEsc(s.name) + '</h2>' + tagline + '<div class="sds-levels">' + levelChips + '</div></div>'
    + '</div>'
    + '<div class="sds-body">' + body + '</div>'
    + '</div>';
  try { window._sdsReturnFocus = document.activeElement; } catch(e){}
  m.classList.remove('sds-full');   // every sheet opens windowed; toggle re-expands
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  // a11y — move focus into the dialog on open (returned to the triggering card on close).
  try { const sh = m.querySelector('.sds-sheet'); if(sh) sh.focus(); } catch(e){}
  // Phase V — apply the optional visual layer (hero + scroll-reveal + count-up).
  // Guarded: if sports-fx.js isn't loaded, the sheet renders exactly as before.
  if(typeof window.sportsFxApply === 'function'){ try { window.sportsFxApply(m, id); } catch(e){} }
}
/* The original Phase-2A body — unchanged, now factored out. Every sport without
   an authored `detail` still renders exactly this. */
function _sportBasicBody(s){
  const statChips = (s.statFields||[]).map(f=>'<span class="sds-stat">'+_sdEsc(f.label)+'</span>').join('');
  return ''
    + '<p class="sds-overview">' + _sdEsc(s.desc) + '</p>'
    + '<section class="sds-sec"><div class="sds-sec__label sds-l--gold">🎓 The scholarship reality</div>'
    +   '<div class="sds-kv"><span class="sds-kv__k">Who gets one</span><span class="sds-kv__v">' + _sdEsc(s.scholarship.pct) + ' of HS athletes</span></div>'
    +   '<div class="sds-kv"><span class="sds-kv__k">Typical value</span><span class="sds-kv__v">' + _sdEsc(s.scholarship.avg) + '</span></div>'
    +   '<p class="sds-note">' + _sdEsc(s.scholarship.note) + '</p></section>'
    + '<section class="sds-sec"><div class="sds-sec__label sds-l--green">💚 Staying healthy</div>'
    +   '<p class="sds-line"><b class="sds-amber">Common injuries:</b> ' + _sdEsc(s.health.injuries) + '</p>'
    +   '<p class="sds-line"><b class="sds-grn">Prevention:</b> ' + _sdEsc(s.health.prevention) + '</p></section>'
    + '<section class="sds-sec"><div class="sds-sec__label sds-l--blue">📈 How to develop</div>'
    +   '<p class="sds-line">' + _sdEsc(s.development) + '</p></section>'
    + ((s.statFields||[]).length ? '<section class="sds-sec"><div class="sds-sec__label sds-l--violet">📊 Stats to track</div><div class="sds-stats">' + statChips + '</div></section>' : '');
}
/* Phase 3 deep guide body. A real resource: season reality, skill progression,
   roles, the mental game, how to start + find a team, the honest recruiting
   path (existing scholarship facts preserved verbatim), health (incl. health-
   first fueling — never weight/calorie/body-comp), and a character/role-model
   angle. All sections are flat .sds-* cards (theme accent stays on the header). */
function _sportDeepBody(s, d){
  const esc = _sdEsc;
  // Each deep section carries a square, color-coded left edge-tab (sds-deepsec--<tone>)
  // matching its label meaning-colour — a flat scannability cue for the long scroll.
  const sec  = (cls, icon, label, inner) => { const tone = cls.replace('sds-l--',''); return '<section class="sds-sec sds-deepsec sds-deepsec--'+tone+'"><div class="sds-sec__label '+cls+'">'+icon+' '+esc(label)+'</div>'+inner+'</section>'; };
  const line = (lead, text) => '<p class="sds-line">'+(lead?'<b>'+esc(lead)+'</b> ':'')+esc(text)+'</p>';
  const steps = (arr, body) => '<ol class="sds-steps">'+arr.map((x,i)=>'<li class="sds-step"><span class="sds-step__n" aria-hidden="true">'+(i+1)+'</span><span class="sds-step__b">'+body(x)+'</span></li>').join('')+'</ol>';
  const titled = (t, rest) => '<span class="sds-step__t">'+esc(t)+'</span>'+esc(rest);

  let html = '<p class="sds-overview sds-lead">' + esc(d.overview) + '</p>';

  html += sec('sds-l--blue', '🎬', 'What a season really looks like',
    line('A practice:', d.season.practice) + line('The season:', d.season.arc) + line('Time it takes:', d.season.commitment));

  html += sec('sds-l--blue', '🪜', 'Getting better, stage by stage',
    steps(d.progression, p => titled(p.stage, p.focus)));

  html += sec('sds-l--blue', '🧭', d.roles.label,
    '<div class="sds-roles">' + d.roles.items.map(r => '<div class="sds-role"><span class="sds-role__n">'+esc(r.name)+'</span><span class="sds-role__b">'+esc(r.blurb)+'</span></div>').join('') + '</div>');

  html += sec('sds-l--blue', '🧠', 'The mental game', '<p class="sds-line">' + esc(d.mental) + '</p>');

  html += sec('sds-l--green', '🚀', 'How to start & find a team',
    steps(d.getStarted.steps, t => esc(t))
    + '<div class="sds-finds">' + d.getStarted.findTeam.map(f => '<div class="sds-find"><span class="sds-find__v">'+esc(f.venue)+'</span><span class="sds-find__h">'+esc(f.how)+'</span></div>').join('') + '</div>');

  html += sec('sds-l--gold', '🎓', 'Recruiting & scholarship reality',
    '<p class="sds-note">' + esc(d.recruiting.truth) + '</p>'
    + '<div class="sds-kv"><span class="sds-kv__k">Who gets one</span><span class="sds-kv__v">' + esc(s.scholarship.pct) + ' of HS athletes</span></div>'
    + '<div class="sds-kv"><span class="sds-kv__k">Typical value</span><span class="sds-kv__v">' + esc(s.scholarship.avg) + '</span></div>'
    + steps(d.recruiting.timeline, t => titled(t.when, t.doThis))
    + line('Divisions:', d.recruiting.divisions));

  let healthInner = line('Common injuries:', d.health.injuries) + line('Staying healthy:', d.health.prevention) + line('Fueling well:', d.health.fuel);
  if(d.health.note) healthInner += line('Good to know:', d.health.note);
  html += sec('sds-l--green', '💚', 'Health & staying in the game', healthInner);

  html += sec('sds-l--violet', '⭐', 'Character & role models',
    '<div class="sds-model"><div class="sds-model__trait">' + esc(d.character.trait) + '</div>'
    + '<div class="sds-model__name">' + esc(d.character.model) + '</div>'
    + '<p class="sds-model__why">' + esc(d.character.why) + '</p></div>');

  // Beyond the Game (Phase V Part 2) — the honest HS->college->pro odds funnel +
  // the off-field mission. The funnel bar is a flat themed viz (decreasing width);
  // the figure + caption are full-width text (robust to long figures), and clean
  // counts (>=1000) count up on reveal via the shared sports-fx layer.
  const btg = (typeof SPORT_BTG !== 'undefined' && SPORT_BTG[s.id]) ? SPORT_BTG[s.id] : null;
  if(btg){
    const wrapFig = fig => { const m = String(fig).match(/\d{1,3}(?:,\d{3})+|\d{4,}/); if(!m) return esc(fig); const raw = m[0]; return esc(fig.slice(0, m.index)) + '<span class="fx-num" data-countup="'+raw.replace(/,/g,'')+'">'+esc(raw)+'</span>' + esc(fig.slice(m.index + raw.length)); };
    const widths = [100, 54, 28];
    const funnel = '<div class="sds-funnel">' + btg.funnel.map((t,i) =>
      '<div class="sds-ftier"><div class="sds-fbar" style="width:'+(widths[i] != null ? widths[i] : 26)+'%;" aria-hidden="true"></div>'
      + '<div class="sds-ffig">'+wrapFig(t.figure)+'</div>'
      + '<p class="sds-fcap"><b>'+esc(t.tier)+'</b> · '+esc(t.of)+'</p></div>').join('') + '</div>';
    html += sec('sds-l--violet', '🔭', 'The honest odds', '<p class="sds-note">'+esc(btg.oddsTruth)+'</p>' + funnel);
    const cm = (d.character && d.character.model) ? String(d.character.model).toLowerCase() : '';
    const models = (btg.roleModels||[]).filter(m => m.name.toLowerCase() !== cm)
      .map(m => '<div class="sds-rm"><span class="sds-rm__n">'+esc(m.name)+'</span><span class="sds-rm__f">'+esc(m.for)+'</span></div>').join('');
    html += sec('sds-l--green', '🌟', 'Bigger than the game',
      line('What it sets up off the field:', btg.education)
      + (models ? '<div class="sds-rmlabel">People who model it well</div><div class="sds-rms">'+models+'</div>' : ''));
  }

  const statChips = (s.statFields||[]).map(f => '<span class="sds-stat">'+esc(f.label)+'</span>').join('');
  if(statChips) html += sec('sds-l--violet', '📊', 'Stats to track', '<div class="sds-stats">' + statChips + '</div>');

  return html;
}

/* ── Phase 3 deep-guide content (SPORT_DETAIL) ───────────────
   Authored + adversarially wellbeing/accuracy-audited per sport (team /
   individual / contact exemplars first). Kept in its own map so SPORT_DATA
   stays untouched. Wellbeing rails: skill/health/durability framing only —
   weight appears solely as a static recruiting fact (e.g. a weight class),
   never a goal/target/metric; fueling is "eat enough & well", never
   restriction/calories/macros/body-comp; character is secular. */
const SPORT_DETAIL = {
  "basketball": {
    "tagline": "Five players, one ball, endless decisions per second.",
    "overview": "Basketball is a fast, skill-intensive game built on footwork, court IQ, and conditioning. There's a fit for every kind of athlete: the steady decision-maker who runs the offense, the sharpshooter, the relentless defender, the rebounder who owns the paint, the energy player off the bench. You don't need to be the tallest or the fastest in the gym to matter. You need a skill the team can count on and the willingness to do the unglamorous work.",
    "season": {
      "practice": "A typical practice opens with a dynamic warmup and ballhandling, moves into shooting and skill stations, then position and team work: half-court sets, defensive shell drills, transition. It usually closes with conditioning or live 5-on-5 scrimmage. Expect plenty of reps on fundamentals even at varsity level.",
      "arc": "Tryouts and preseason in late fall build conditioning and install the system. The regular season runs winter (roughly 20-25+ games) with practices most days and 1-2 games a week. It builds toward conference play, then district/regional/state postseason brackets. Many players then roll into AAU/club season in spring and summer.",
      "commitment": "In season, expect 10-15+ hours a week between practices, games, travel, and film. Off-season skill work adds more if you choose to put it in. Rest days are part of training, not a break from it: your nervous system, joints, and shot all sharpen during recovery, and skipping rest is how overuse injuries and burnout start."
    },
    "progression": [
      { "stage": "Beginner", "focus": "Master a comfortable dribble with both hands, a repeatable shooting form (balance, elbow, follow-through), and the triple-threat stance. Learn to pivot without traveling, make a chest and bounce pass, and play on-ball defense in a stance. Learn the rules and basic spacing." },
      { "stage": "Developing", "focus": "Build a reliable jump shot out to the free-throw line, finish layups with both hands, and read pick-and-roll. Sharpen footwork: jab steps, change of pace, defensive slides without crossing your feet. Start understanding rotations, help defense, and boxing out." },
      { "stage": "Intermediate", "focus": "Extend range toward and past the three-point line, develop a counter move off your go-to, and make quick reads (drive, kick, finish). Defend multiple positions, communicate switches, and play with pace and control. Film yourself to spot habits." },
      { "stage": "Advanced", "focus": "Specialize in a role you do at a high level while staying a complete player. Shoot off the dribble and the catch, run an offense or anchor a defense, and impact winning in ways the box score misses: spacing, screens, deflections, leadership." }
    ],
    "roles": {
      "label": "Positions",
      "items": [
        { "name": "Point Guard (PG)", "blurb": "The floor general. Runs the offense, sets the pace, handles pressure, and gets teammates the ball where they're dangerous. Lives on vision, ballhandling, and decision-making." },
        { "name": "Shooting Guard (SG)", "blurb": "The perimeter scorer. Knocks down shots off the catch and the dribble, moves without the ball, and often defends the other team's best guard. Lives on shooting touch and conditioning." },
        { "name": "Small Forward (SF)", "blurb": "The versatile wing. Scores inside and out, rebounds, and guards multiple positions. Often the most adaptable player on the floor." },
        { "name": "Power Forward (PF)", "blurb": "The interior workhorse. Rebounds, sets screens, scores around the rim, and increasingly stretches the floor with outside shooting. Lives on positioning, strength, and effort." },
        { "name": "Center (C)", "blurb": "The anchor. Protects the rim, controls the boards, finishes inside, and communicates the defense. The last line of defense and a screen-setting hub on offense." },
        { "name": "Sixth man / role player", "blurb": "The energy and specialist spot. A spark off the bench, a defensive stopper, a corner shooter, a hustle rebounder. Every winning team needs players who do one thing reliably." }
      ]
    },
    "mental": "Basketball is a game of mistakes; you'll turn it over, miss shots, and get scored on, sometimes in front of a crowd. What separates good players is the next play: a short memory, eyes up, and energy back on defense before the miss even registers. Nerves are normal, even for starters; channel them into your routine (same free-throw ritual, same pre-game prep) so your body knows what to do when your head is loud. Being a good teammate is a skill you practice on purpose: talk on defense, celebrate an assist as much as a bucket, stay ready when you're on the bench, and own your mistakes instead of pointing fingers. Coaches notice the kid who lifts the group.",
    "getStarted": {
      "steps": [
        "Get a ball and find a hoop. Spend 15-20 minutes a day on form shooting close to the rim and ballhandling with both hands. Consistency beats marathon sessions.",
        "Learn the rules and watch the game with intent: notice spacing, screens, and where good players move without the ball.",
        "Play live as often as you can. Pickup games, open gyms, and driveway 1-on-1 teach reads no drill can.",
        "Film yourself shooting and playing, then compare to your form. Fix one habit at a time.",
        "Find a team or league to play organized ball and get coached."
      ],
      "findTeam": [
        { "venue": "School team", "how": "Ask your PE teacher or athletic office when basketball tryouts are (usually late fall). Show up in shape, knowing the basics, and ready to defend and compete. Freshman, JV, and varsity levels mean there's often a spot to grow into." },
        { "venue": "Club / AAU travel", "how": "Search for AAU or club programs in your area and attend their open tryouts, often in spring. This is the real recruiting pathway: AAU tournaments and exposure camps are where college coaches watch. Ask about cost and travel up front, and look for programs that develop players, not just collect them." },
        { "venue": "Rec & community leagues", "how": "Check your local rec center, YMCA, Boys & Girls Club, or city parks-and-rec for youth and teen leagues. These are lower-cost, lower-pressure, and a great place to start, get reps, and just love the game." },
        { "venue": "Open gyms & pickup", "how": "Most schools and rec centers run open gym hours. Show up, get in line, call winners, and play. No signup, no tryout, just basketball and the fastest way to improve your feel for the game." }
      ]
    },
    "recruiting": {
      "truth": "Be honest with yourself about the numbers: only about 1% of high school players go on to play NCAA Division I. That is not a reason to quit; it's a reason to play for the right reasons and keep options open. Far more players thrive in D2, D3, NAIA, and JUCO, and millions more play rec and intramural ball for the rest of their lives. College basketball is a great goal; making it your only definition of success is a setup for heartbreak. Chase being the best version of your game, and let recruiting follow.",
      "timeline": [
        { "when": "Freshman / Sophomore year", "doThis": "Play as much as you can (school plus AAU/club), build fundamentals, and keep your grades strong. Academics open doors and money that talent alone won't." },
        { "when": "Junior year", "doThis": "Get seen. Compete at AAU tournaments and exposure camps, build a highlight film, and email coaches at programs that fit you academically and athletically. Be realistic about which divisions match your level." },
        { "when": "Summer before / Senior year", "doThis": "Take official and unofficial visits, narrow your list by fit (playing time, major, coaching staff, cost), and finalize academic eligibility through the NCAA/NAIA clearinghouse." },
        { "when": "Throughout", "doThis": "Stay coachable and durable. References from your coaches and your reputation as a teammate matter as much as your stat line." }
      ],
      "divisions": "D1 basketball offers full scholarships, but they're rare and intensely competitive. Men's and women's D1 basketball are head-count sports, so an offer is typically a full ride covering tuition, room, board, and fees, which can be worth tens of thousands of dollars a year and more at pricier schools. D2 and NAIA often blend partial athletic money with academic aid. D3 offers no athletic scholarships but strong academic and need-based aid, often at excellent schools. JUCO is a real path to develop, get grades right, and transfer up. The smartest move is to pick the level and school where you'll actually play, get a degree you want, and afford it. Fit and academics beat prestige every time."
    },
    "health": {
      "injuries": "Ankle sprains are the most common, along with knee issues (including ACL/patellar strain), jammed fingers, and shin splints from repeated jumping and cutting. Overuse injuries climb when players skip rest.",
      "prevention": "Always do a dynamic warmup before play (leg swings, lunges, light jog, gradual cutting), strengthen your ankles and hips, and drill proper landing mechanics: land soft on both feet with bent knees. Build single-leg balance and core strength, work on jumping and decelerating under control, and respect rest and recovery days so tissue can adapt. Good shoes and taped or braced ankles help if you've sprained before.",
      "fuel": "Fuel your body to grow and compete, not to shrink it. Eat enough across the day: balanced meals with carbs for energy, protein to repair muscle, plus fruits, vegetables, and healthy fats. Hydrate before, during, and after, especially in hot gyms; bring water to every practice. Sleep is where you actually get better, so aim for a full night, 8-10 hours for teens. Eating enough and sleeping well will do more for your game than any supplement.",
      "note": "Take any head contact seriously. If you take a hard fall or collision and feel dizzy, foggy, or have a headache, sit out and tell a coach or parent; never play through a suspected concussion. There's no toughness award for hiding it."
    },
    "character": {
      "trait": "Work ethic and humility",
      "model": "Tim Duncan",
      "why": "Duncan won at the highest level for nearly two decades by mastering fundamentals instead of flash. Teammates and coaches described him as humble, unselfish, and team-first; he let his game and his consistency speak, took coaching, and made everyone around him better. He's a model for the truth that the unglamorous work, footwork, positioning, and showing up the same way every day, is what builds a great player and a great teammate."
    }
  },
  "track": {
    "tagline": "A sport with an event for every kind of athlete.",
    "overview": "Track & field is one sport made of many: sprints, distance, hurdles, jumps, and throws, each rewarding a different kind of athlete. A sprinter, a miler, a thrower, and a pole vaulter look nothing alike in how they compete, and all of them belong on the same team. It is the most accessible high school sport to start because most programs have no cuts: you show up, you train, you compete. The scoreboard is honest here. The clock and the tape measure do not care who you are, only what you did that day.",
    "season": {
      "practice": "Practice splits by event group. After a shared warm-up and dynamic stretching, sprinters do block starts and acceleration work, distance runners head out for intervals or a tempo run, hurdlers drill trail-leg mechanics, jumpers rep approach runs and takeoffs, and throwers work technique in the ring or on the runway. Most sessions end with strength, mobility, and cooldown. You spend more time on one or two events than on everything at once.",
      "arc": "Many areas have two seasons: indoor (winter) and outdoor (spring), plus optional summer club meets. Early weeks build base fitness and clean technique. Mid-season is dual meets and invitationals where you chase personal records. The season peaks at conference, then sectional/regional, then state qualifying meets, where one good performance can change your year.",
      "commitment": "Expect roughly 10-15 hours a week in season: practice most weekdays plus Saturday meets that can run long. Rest days are not optional extras, they are part of the training. Sprint and jump power and distance endurance are both built during recovery, not just during hard work. A planned easy day or full day off is when your body actually adapts and gets faster."
    },
    "progression": [
      { "stage": "Beginner (first season)", "focus": "Try a couple of event groups and find what clicks. Learn to warm up properly, run relaxed, and understand meet logistics: heats, marks, scratches. Goal is a baseline PR and clean fundamentals, not a finished athlete." },
      { "stage": "Developing", "focus": "Settle into one or two events. Sharpen technique: block starts, hurdle rhythm, jump approach steps, or throw footwork. Build consistency so your performances stop swinging wildly meet to meet. Add structured strength and mobility work." },
      { "stage": "Competitive", "focus": "Train your event with intent: race tactics, splits, approach precision, or release angles. Know your seed marks and where you stand in your conference and section. Start tracking the qualifying standards that matter for your goals." },
      { "stage": "Advanced", "focus": "Refine the small margins that separate places at state and beyond. Periodize your training to peak at the right meets, manage load to stay healthy, and compete with a plan for every round. This is where state-level marks open college doors." }
    ],
    "roles": {
      "label": "Event groups",
      "items": [
        { "name": "Sprints (100/200/400)", "blurb": "Explosive, fast-twitch racing. Block starts, top-end speed, and holding form when it hurts. Also the backbone of relay teams." },
        { "name": "Distance (800 to 3200 / XC crossover)", "blurb": "Endurance, pacing, and mental grit. Built on consistent mileage and interval work. Often the same athletes who run cross country in fall." },
        { "name": "Hurdles (100/110, 300/400)", "blurb": "Sprinting plus rhythm and technique. Trail-leg mechanics and three-step patterns between barriers. Rewards athletes who love a technical challenge." },
        { "name": "Jumps (long, triple, high, pole vault)", "blurb": "Speed converted into distance or height. Precise approach runs and takeoff timing. Pole vault especially rewards coordination and fearless practice." },
        { "name": "Throws (shot put, discus, javelin)", "blurb": "Power, balance, and technique in the ring or on the runway. Footwork and timing matter as much as raw strength. A great fit for athletes who love refining a skill." },
        { "name": "Relays & multi-events", "blurb": "Relays (4x100, 4x400) add team handoffs and chemistry to an individual sport. Multi-events (heptathlon/decathlon) reward versatile athletes who train across groups." }
      ]
    },
    "mental": "Track exposes you because the result is just a number, and that is also what makes it fair. Pre-race nerves are normal even for elite athletes; channel them with a fixed warm-up routine and a simple cue to focus on (drive your arms, relax your shoulders, hit your first mark). A bad race or a foul is one data point, not a verdict, and the next meet always comes. Even in an individual sport, teammates matter: you split relays, share warm-ups, and cheer each other through the last 100 meters. Be the athlete who claps for the freshman's first PR as loud as for your own.",
    "getStarted": {
      "steps": [
        "Pick the season: most schools run outdoor track in spring, and some add indoor in winter. Find the start date from the athletic office or coach.",
        "Get a physical. Nearly every school requires a current sports physical and signed forms before you can practice.",
        "Show up to the first practice. Track usually has no cuts, so the hardest part is walking onto the track that first day.",
        "Try a couple of event groups before committing. Tell a coach you are new and ask where they think you might fit.",
        "Get basic gear: running shoes that fit well now, and event-specific spikes later once you know your event. Borrow or buy used to start."
      ],
      "findTeam": [
        { "venue": "Your high school team", "how": "Email or find the head track coach, ask about the season start and physical requirements, and just attend the first practice. This is the no-cut, lowest-barrier entry point for almost everyone." },
        { "venue": "USATF / AAU club or travel team", "how": "Search the USA Track & Field (USATF) or AAU club finder for your area for summer and year-round competition. Clubs let you keep training and competing outside the school season and reach bigger meets." },
        { "venue": "Community / rec running programs", "how": "Local parks departments, YMCAs, and all-comers summer meets welcome newcomers with no experience. A great low-pressure way to test events and build fitness before a school season." },
        { "venue": "Cross country (fall crossover)", "how": "If distance running interests you, joining cross country in the fall builds the base that carries straight into spring track. Same coaches and teammates at many schools." }
      ]
    },
    "recruiting": {
      "truth": "Be clear-eyed: only about 1-2% of high school track athletes compete in college on scholarship, and most who do receive partial aid. Track is an equivalency sport, meaning a D1 program divides a limited scholarship budget into many partial awards spread across dozens of athletes and every event group — so full rides are rare and most recruited athletes get partial aid. (Scholarship and roster rules have changed in recent years, so confirm the current limits for your division and gender when you start talking to coaches.) The athletes who get recruited have marks, the times and distances that meet a program's standards. That is the currency. Most track athletes do not compete in college, and that is completely fine: the discipline, fitness, and habits you build here outlast the sport.",
      "timeline": [
        { "when": "Freshman / Sophomore", "doThis": "Compete, find your best event, and chase honest PRs. Keep your grades strong; academics open as many doors as marks do. Start a simple log of your results and the meets you ran." },
        { "when": "Junior year", "doThis": "Know the recruiting standards for your event at the division levels that fit you. Email coaches with your verified marks (FAT times, measured distances), your GPA/test scores, and a meet schedule. Junior-year marks matter most." },
        { "when": "Summer before senior year", "doThis": "Attend college camps or compete at meets where target coaches will see you. Narrow your list by academic fit and the program's culture, not just name recognition. Follow up with coaches who showed interest." },
        { "when": "Senior year", "doThis": "Lock in official visits, compare any aid offers honestly (athletic plus academic), and confirm you have the marks and grades for admission. Have a plan you are happy with even if the offer is partial or walk-on." }
      ],
      "divisions": "Aim for fit over prestige. D1 has the deepest talent and the most pressure, but D2, D3, NAIA, and JUCO all offer real competition and often a better balance of athletics and academics. D3 gives no athletic scholarships but can stack generous academic and need-based aid. JUCO is a strong path to develop marks and transfer up. The best program is the one where you would be happy even if you got injured, because the academics, coaches, and people fit you."
    },
    "health": {
      "injuries": "The common ones are overuse: shin splints and stress fractures (especially in distance runners and jumpers), hamstring and groin pulls (sprinters and hurdlers), and tendon irritation in the knees, Achilles, and shoulders (throwers). Most trace back to doing too much too soon.",
      "prevention": "Increase mileage and training load gradually, never spiking volume after time off. Warm up dynamically before every session, build strength and mobility for your event, and replace running shoes before they break down. Take your rest days seriously and treat sleep as part of training. If something hurts beyond normal soreness, stop and get it checked early rather than running through it.",
      "fuel": "Fuel your body well and eat enough to train and grow. You are an athlete who is also still growing, so meals should be plentiful and balanced: carbohydrates for energy, protein to repair muscle, and plenty of fruits and vegetables. Eat a real meal a few hours before competing and refuel within an hour after hard sessions. Hydrate through the day, not just at practice, and prioritize sleep, which is when your body actually adapts and gets faster.",
      "note": "Track has no weight classes and no reason to manipulate your weight. Eating too little to chase a number does the opposite of what you want: it raises stress-fracture risk, drains your energy, and stalls progress. Strong, well-fueled, and durable beats light every time. If running, eating, or your body image starts to feel anxious or controlling, talk to a coach, parent, athletic trainer, or doctor."
    },
    "character": {
      "trait": "Disciplined consistency",
      "model": "Eliud Kipchoge",
      "why": "The marathon world record holder is known less for raw talent than for relentless, humble consistency: he keeps a simple training log, shares chores at his training camp despite his fame, and credits his results to showing up every day. His line, that only the disciplined ones are free in life, captures why the unglamorous daily work, the easy runs and the rest days, is what builds a real athlete."
    }
  },
  "wrestling": {
    "tagline": "Just you, the other kid, and what you put in the room.",
    "overview": "Wrestling is one of the oldest sports on earth: two athletes, a circle, and the goal of controlling your opponent and pinning their shoulders to the mat. It rewards leverage and technique over raw size, which is why there is a place for the explosive kid, the relentless grinder, the cerebral chess-player, and the late starter who simply outworks everyone. You compete inside your own weight class against someone your own size, so this is a sport for every kind of athlete who is willing to learn and keep showing up.",
    "season": {
      "practice": "A typical practice is warm-up and movement drilling, then technique (a takedown, an escape, a pin combination) broken down rep by rep, then live wrestling in short hard goes, then conditioning. You drill the same moves hundreds of times until they happen without thinking. Expect to be tired, sweaty, and a little sore - and to learn something concrete every single day.",
      "arc": "Folkstyle season (the high-school and college style) runs roughly November to February or March: preseason conditioning, dual meets and weekend tournaments through the winter, then the postseason ladder - districts/regionals to state. Many wrestlers add a spring/summer freestyle and Greco-Roman season to keep building, but that is optional, not required.",
      "commitment": "In season, expect practice 5-6 days a week plus weekend competitions - roughly 10-15 hours. Rest days are part of the training, not a break from it: muscle, skin, and your nervous system rebuild on the days off, and overtraining is how good wrestlers get hurt or burned out. A planned rest day makes you better, not softer."
    },
    "progression": [
      { "stage": "Beginner (first season)", "focus": "Learn the stance, motion, and level change. Get comfortable in contact and being on your back without panicking. Master a basic takedown (often a double-leg), a stand-up escape, and a pinning hold. Losing a lot early is normal - everyone does. Show up every day." },
      { "stage": "Intermediate (1-2 years in)", "focus": "Build a go-to series: a takedown you can hit on anyone, an answer when you are on bottom, and a finish on top. Learn to chain moves so a stopped shot flows into the next attack. Start scouting opponents and wrestling smart, not just hard." },
      { "stage": "Advanced (varsity / postseason)", "focus": "Sharpen your A-game until it works against the best in your bracket, develop counters to their counters, and master mat-sense - scoring in scrambles, riding time, managing the clock. Funk, setups, and pace separate placers from the pack. This is technique and timing, never about changing your body." }
    ],
    "roles": {
      "label": "Styles & weight classes",
      "items": [
        { "name": "Folkstyle", "blurb": "The American scholastic style used in every U.S. high school and college. Rewards control and riding on top, with points for escapes and reversals. This is the style you compete in to get recruited." },
        { "name": "Freestyle", "blurb": "An international and Olympic style, big in spring/summer club season. Faster and more open, with exposure points and big throws - great for rounding out your attack." },
        { "name": "Greco-Roman", "blurb": "Olympic style with no attacks below the waist - all upper-body: ties, throws, and leverage. Builds elite hand-fighting and a fearsome upper body." },
        { "name": "Weight classes", "blurb": "You wrestle others within your weight class, from the lightest up to heavyweight. Your class is simply where your natural, well-fueled body sits - a fact about you, never a number to chase. You compete at the weight you walk around at, hydrated and strong." }
      ]
    },
    "mental": "Wrestling is famously a mental sport because there is nowhere to hide - no teammate to pass to, no bench to blame. The flip side is that nerves before a match are normal, even for state champs; a routine (warm-up, breathing, the same three things you tell yourself) turns that adrenaline into focus. You will get taken down, scored on, and pinned, and the wrestlers who improve are the ones who treat a loss as film to study rather than a verdict on who they are. And though you compete alone, you are made by your room: good teammates give honest goes in practice, celebrate each other's wins, and pick each other up after losses.",
    "getStarted": {
      "steps": [
        "Find the wrestling program at your school or a local club and ask to attend a practice - most coaches welcome newcomers any time and will lend you gear to start.",
        "Get the basics: wrestling shoes, headgear, and clean workout clothes. You do not need a singlet to begin practicing.",
        "Learn and live the hygiene rules from day one - shower right after every practice, wash gear, and never wrestle with an open or suspicious skin spot. This protects you and your teammates.",
        "Commit to showing up daily for a full season before you judge it. Wrestling feels awkward and humbling for the first few weeks, then it clicks.",
        "Compete at your natural weight from the start. Eat enough, drink water, and let your body tell you your class - never the other way around."
      ],
      "findTeam": [
        { "venue": "Your school team", "how": "Ask the athletic office or PE teacher who the wrestling coach is, then email or catch the coach and say you want to try out. Middle and high schools rarely cut wrestlers - they need bodies in every weight class." },
        { "venue": "A youth or club program", "how": "Search for a local wrestling club, USA Wrestling club, or 'kids/youth wrestling' near you. These run year-round, take total beginners, and are how most wrestlers log extra mat time." },
        { "venue": "Rec leagues & community centers", "how": "Many YMCAs, rec departments, and Police Athletic Leagues run intro wrestling in winter - low cost, low pressure, and a great place to find out if you like the contact before joining a school team." }
      ]
    },
    "recruiting": {
      "truth": "Be honest with yourself: most high-school wrestlers do not wrestle in college, and that is completely fine - the discipline, toughness, and habits you build carry into the rest of your life no matter what. For those who do compete in college, wrestling is an equivalency sport: D1 splits about 9.9 scholarships across 10 weight classes, so almost everyone is on a partial. About 1-2% of high schoolers wrestle in college, and the average award is partial - around $8,000 a year. What actually moves the needle is state placement and clean, finishable technique on film, not your record against weak competition.",
      "timeline": [
        { "when": "Grades 9-10", "doThis": "Wrestle as much live as you can, compete in offseason freestyle/Greco, and start a highlight reel. Keep your grades up - academics widen every door, especially at D3 and NAIA." },
        { "when": "Grade 11", "doThis": "Chase a strong postseason finish (qualify for and place at regionals/state if you can), build a recruiting profile with your record and key match film, and email coaches at programs that fit you academically and as a wrestler." },
        { "when": "Grade 12", "doThis": "Follow up with interested coaches, take official/unofficial visits, and choose for fit - the room, the coaching, the major - over the logo. Lock in academic eligibility and finalize any aid." }
      ],
      "divisions": "There are far more landing spots than just D1. D2, D3, NAIA, and JUCO all have strong wrestling, and many are the better choice for a real chance to compete, get coached, and graduate. D3 offers no athletic scholarships but strong academic and need-based aid, and JUCO can be a launchpad to a four-year program. Pick the place where you will actually wrestle, fit in, and earn a degree - prestige is worth nothing if you ride the bench or never finish school."
    },
    "health": {
      "injuries": "The most common issues are skin infections (ringworm, impetigo, herpes gladiatorum) from mat contact, plus shoulder and knee injuries, cauliflower ear, and sprains from scrambles. Most are preventable with hygiene and good technique.",
      "prevention": "Shower immediately after every practice, wash your gear and the mats, and sit out any session if you have an open or unidentified skin spot - this is non-negotiable and protects the whole room. Build durability with strength and mobility work, drill safe technique so your body is in good positions, wear headgear, and treat rest and recovery as real training. Sleep is when you rebuild.",
      "fuel": "Fuel your body to train and grow: eat regular, balanced meals with protein, carbs for energy, fruits and vegetables, and plenty of water all day. The goal is eating enough to wrestle hard and recover - never eating less. Skipping meals or restricting to drop weight wrecks your strength, focus, and long-term health.",
      "note": "Wrestling has a dangerous weight-cutting culture, and you must reject it: aggressive cutting through dehydration, starvation, or sweating down has killed wrestlers, which is exactly why hydration tests and weight-management rules now exist. Your weight class is wherever your healthy, hydrated, well-fed body lands. Compete there. Never starve, dehydrate, or cut to 'make weight' - if a coach pressures you to, talk to a parent or trusted adult."
    },
    "character": {
      "trait": "Relentless work ethic paired with humility",
      "model": "Dan Gable",
      "why": "Gable is wrestling's standard for character because of how he trained and how he carried himself - legendary, near-obsessive work in the room, yet known for crediting his coaches and teammates and pouring himself into developing others. He turned discipline and toughness into a way of treating the sport and the people in it with respect. The lesson is not to copy his volume, but his mindset: outwork the excuses, stay humble, and lift everyone around you."
    }
  },
  "crosscountry": {
    "tagline": "Show up easy days and hard days alike. The runner who fuels well and runs consistently beats the one chasing light.",
    "overview": "Cross country is distance running over grass, dirt, and hills - usually 5K (3.1 miles) in high school, 6K-10K in college. You race alone against the clock and the field, but the team scores together: each runner's finishing place becomes points, the lowest team total wins, and the 5th and 6th runners decide meets as much as the 1st. There is no body type for this sport. Tall, short, sturdy, late-blooming, early-blooming - they all run, and the athlete who trains consistently and fuels enough to recover beats the one trying to be smaller almost every time. It's mostly the same aerobic base as distance track, just on grass and hills. Anyone willing to build mileage slowly and run easy on easy days belongs here.",
    "season": {
      "practice": "Most teams run 5-6 days a week in season: a mix of easy runs, one harder workout (intervals or tempo), a long run on the weekend, plus strength and mobility work. Easy days should feel conversational - actually easy. At least one full rest day a week is part of the plan, not a reward for it.",
      "arc": "Summer is base-building (easy aerobic miles before anyone races). The fall season runs roughly August through the conference, regional, and state championships in late October or November. Then a deliberate down week or two before winter training and indoor/outdoor track pick the base back up.",
      "commitment": "Plan on 6-10 hours a week in season including the long run and meets. Saturday meets can eat a morning. The non-negotiables that make it sustainable: 1+ rest day weekly, 8-10 hours of sleep, and easy days kept truly easy so the hard days land. Skipping rest is how you get hurt, not how you get fast."
    },
    "progression": [
      {
        "stage": "Beginner (first season)",
        "focus": "Build the habit of running, not speed. Run-walk if you need to, finish every easy run able to talk, and add mileage slowly - roughly 10% a week, no more. Learn to lace shoes right, warm up, and cool down. The only goal is to finish the season healthy and still wanting to run."
      },
      {
        "stage": "Developing",
        "focus": "A consistent weekly mileage you recover from, one structured workout a week (intervals or tempo), and a weekend long run. Start logging easy/hard days and how you slept and ate. Add basic strength - hips, core, calves - twice a week to bank durability. Race times drop on their own when the base is steady."
      },
      {
        "stage": "Competitive (varsity)",
        "focus": "Higher but still recoverable mileage, two quality workouts plus a long run, and pacing discipline so you don't go out too fast. Learn race tactics: pack running, surging hills, closing the last 800. Strength and mobility become non-optional injury insurance."
      },
      {
        "stage": "Advanced (college-track athlete)",
        "focus": "Periodized training built around peaking for championships, higher mileage introduced gradually over years (not one summer), and sharp self-knowledge about fueling, sleep, and early injury signs. Skill here is patience and consistency over time - never getting smaller."
      }
    ],
    "roles": {
      "label": "How a team scores (and where you fit)",
      "items": [
        {
          "name": "Top 5 scorers",
          "blurb": "Your team's five finishers whose places are added up - lowest total wins. Every runner is trying to earn one of these spots, and they shift meet to meet."
        },
        {
          "name": "6th & 7th (displacers)",
          "blurb": "They don't add to your score but they push rival runners to higher places, raising the other team's total. Quietly decide close meets - depth wins championships."
        },
        {
          "name": "Front-runner / pacesetter",
          "blurb": "Comfortable leading and setting honest early pace. A role of nerve and rhythm, not of being the lightest - it's about race sense."
        },
        {
          "name": "Closer / pack runner",
          "blurb": "Sits in, runs with teammates, and finishes hard over the last kilometer. Most points are won in the final stretch, where strength and grit show."
        }
      ]
    },
    "mental": "Cross country is mostly run between your ears. Races hurt on purpose - the skill is staying calm when it does, holding pace when your brain begs you to back off, and reeling in one runner at a time instead of staring at the leader. The bigger mental work is patience across months: trusting that boring easy miles are doing something, not panicking after a bad race, and resisting the lie that lighter is faster. Define a good day by effort and showing up, not by a number on a watch or a scale. The runners who last are the ones who are kind to themselves on hard days and still toe the line the next morning.",
    "getStarted": {
      "steps": [
        "Get one pair of properly fitted running shoes from a running store - tell them you're starting cross country and let them watch you walk. This is the one piece of gear that prevents injuries.",
        "Start with easy run-walks 3-4 days a week and build slowly. If you can talk while running, the pace is right. Add no more than about 10% more total time or distance per week.",
        "Eat enough to recover and drink water through the day - fuel before and after runs is what lets your body adapt and get stronger.",
        "Find a team or group and just show up to a practice; coaches expect beginners and there are no tryout cuts in most programs.",
        "Keep a simple log: how far, how it felt, how you slept. Patterns in that log teach you more than any single workout."
      ],
      "findTeam": [
        {
          "venue": "High school team",
          "how": "Cross country almost never cuts - if you can run, you can join. Find the coach through the athletics office, show up to summer or preseason practice, and complete the school's sports physical and forms."
        },
        {
          "venue": "Club / USATF youth or junior team",
          "how": "Search USATF or RRCA for a local club. These run summer and into fall and are great if your school has no team or you want more coaching. Most welcome all levels."
        },
        {
          "venue": "Rec & community running groups",
          "how": "Parks & rec departments, local running stores, and YMCA often host beginner run groups or couch-to-5K programs. A low-pressure way to build a base and meet other runners before joining a competitive team."
        },
        {
          "venue": "Local road races (5K fun runs)",
          "how": "Sign up for a community 5K - many are free or cheap and welcome walkers. It gets you a baseline time and a taste of racing with zero commitment."
        }
      ]
    },
    "recruiting": {
      "truth": "Be honest with yourself: most high school runners do not compete in college, and that is completely fine. Running is a lifelong sport - the fitness, discipline, and friendships outlast any roster spot. If you love it, keep racing for your high school team and run for life. College running is a path for some, not a verdict on whether you're a real runner.",
      "timeline": [
        {
          "when": "9th-10th grade",
          "doThis": "Just train consistently, stay healthy, and build a base. Race for your team and learn to love the process. Keep your grades up - academics open more doors in running recruiting than almost any other sport. No need to think about recruiting yet."
        },
        {
          "when": "11th grade",
          "doThis": "This is when times start to matter to coaches. Keep a simple athletic resume of your PRs, school, and grades. Email coaches at schools that fit you academically with your honest times and ask about their program. Go to a summer running camp if you can."
        },
        {
          "when": "12th grade",
          "doThis": "Take visits, compare programs honestly, and confirm current roster and aid rules directly with each coach - the rules changed in 2025-26 (see below). Choose the school where you'd be happy even if running ended. Sign and finish strong."
        }
      ],
      "divisions": "There are running programs across NCAA Divisions I, II, and III, plus NAIA and junior colleges - and a fast NAIA or D-III runner on a team that fits is far better off than a miserable one chasing a famous name. Important and current: the House v. NCAA settlement took effect in 2025-26 and replaced old per-sport scholarship limits with roster limits, so a school can offer full, partial, or no aid to any runner up to the roster cap. The reality hasn't changed much for distance runners: most get partial aid or none, full rides are rare, and academic money often matters more than athletic money. Ignore any old 'X scholarships per team' figure - confirm current limits for your division directly with the coach. Pick fit and academics over prestige every time."
    },
    "health": {
      "injuries": "The common ones are overuse, not contact: stress fractures (often shin or foot), IT band syndrome, shin splints, plantar fasciitis, Achilles and runner's knee. Almost all of them come from doing too much too soon, running hard on tired legs, or under-fueling. Sharp, localized, or worsening pain - especially bone pain - means stop and see an athletic trainer or doctor, not run through it.",
      "prevention": "Build mileage slowly (about 10% a week), keep easy days genuinely easy, and take your rest day. Strength work for hips, core, and calves twice a week, regular foam rolling and mobility, replacing shoes on schedule, and sleeping 8-10 hours do more to keep you healthy than any single workout. Listen to small aches early - they're cheap to fix and expensive to ignore.",
      "fuel": "Fuel to grow, not to shrink. Endurance running burns a lot of energy, and your body needs enough food - carbs, protein, fats, plus iron and calcium-rich foods - to repair, adapt, and get faster. This is the part people get backwards: under-fueling doesn't make you faster, it directly CAUSES stress fractures, drains your energy, stalls your progress, and (for girls) can disrupt periods - a real warning sign called RED-S / the female athlete triad. Eat before runs, refuel after, drink water through the day. Strong and durable beats light and small, every season. There are no calorie or weight goals here - just eat enough and eat well.",
      "note": "Growth and puberty are normal and good - your body is supposed to change, gain, and get stronger as you grow, and that's a sign of health, not a problem to fix. A bigger, stronger body is usually a faster, more durable one over time. Cross country has a real culture around leanness, and it's worth naming plainly: lighter is not a training goal, and no one should ever feel they must shrink to belong on a team. If eating or body image starts to feel anxious or controlling - counting, restricting, dreading meals, or tying your worth to a number - talk to a coach, parent, athletic trainer, or doctor. Reaching out early is strength, and it's how good runners stay runners."
    },
    "character": {
      "trait": "Quiet consistency and respect for the work",
      "model": "Eliud Kipchoge",
      "why": "The marathon great is known less for any single win than for his discipline and humility - he logs the same easy miles in a simple training camp, sleeps and recovers like it's part of the job, and famously says 'only the disciplined ones are free.' He shows that greatness in distance running comes from showing up consistently, respecting recovery, and steady patient effort - not from shortcuts or trying to be the smallest runner on the line."
    }
  },
  "swimming": {
    "tagline": "Just you, the clock, and the water that doesn't lie.",
    "overview": "Swimming is power and technique against the resistance of water and the honesty of a clock. There's a place for every kind of athlete: the explosive 50-freestyle sprinter, the gritty distance swimmer who eats up the 500 and the mile, the technical butterflyer, the strategic individual-medley racer who has to do all four strokes. You don't need a particular body type to belong here. Tall and short, lean and powerful, kids who grew early and kids still growing all swim fast. A body in a racing suit is an athlete's body, full stop. What matters is your stroke, your feel for the water, your work in training, and your willingness to show up to early practices when the pool is cold. The clock rewards the swimmer who put in the meters, not the one who looks a certain way.",
    "season": {
      "practice": "A typical practice opens with a dryland or in-water warm-up, then a main set built around your event group: sprinters do short, fast repeats with full rest; distance swimmers grind long aerobic sets; everyone drills stroke technique, starts off the blocks, flip turns, and underwater dolphin kicks. Sessions often close with a cool-down swim and some dryland core or mobility work. You'll log thousands of yards or meters in a single practice, with the coach calling intervals off the pace clock.",
      "arc": "High school season usually runs late fall into winter, building from base conditioning toward a championship taper, where you cut back volume so you're rested and fast for the conference, sectional, and state meets. Many swimmers also swim club year-round (USA Swimming), with short-course season in winter and long-course in summer, peaking at championship meets. The whole year is shaped around resting hard at the right time so you can race fast when it counts.",
      "commitment": "In season, expect 10-20+ hours a week between pool practices (often before school and after), meets that can fill a whole Saturday, and dryland work. Serious club swimmers train more. Rest days and recovery are part of the plan, not a break from it: your shoulders, your aerobic system, and your speed all rebuild during recovery. Skipping rest is how shoulder overuse and burnout start, so honor the easy days and the days off."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Get comfortable and safe in deep water and learn the four strokes well enough to swim a length of each. Master freestyle breathing on a rhythm, a basic flip turn, and how to read a pace clock. Learn meet basics: how heats and lanes work, what a false start is, and how to leave the blocks legally. The goal is clean fundamentals and your first honest times, not finished technique."
      },
      {
        "stage": "Developing",
        "focus": "Sharpen stroke technique so you stop fighting the water: a high elbow catch, a steady kick, streamlined push-offs, and underwater dolphin kicks off every wall. Build aerobic base through consistent yardage and learn to hold pace across a set. Start picking the events that suit you and add structured dryland strength and shoulder care."
      },
      {
        "stage": "Intermediate",
        "focus": "Train your main events with intent: race strategy, split times, turn and underwater work where races are won, and a reliable start. Know your best times and where they stand in your league and age group. Begin tracking the time standards that matter for your goals (sectionals, state cuts, recruiting times)."
      },
      {
        "stage": "Advanced",
        "focus": "Refine the small margins, the tenths of a second in your starts, turns, and finishes, that decide places at championship meets. Periodize training and taper so you peak when it matters, manage load to protect your shoulders, and race with a plan for every event. This is where nationally competitive times open college doors."
      }
    ],
    "roles": {
      "label": "Strokes, distances & relays",
      "items": [
        {
          "name": "Freestyle",
          "blurb": "The fastest stroke and the foundation of the sport. Ranges from the all-out 50 sprint to the 500 and the mile (1650) for distance swimmers. Rewards a strong catch, steady kick, and clean breathing."
        },
        {
          "name": "Backstroke",
          "blurb": "The only stroke raced on your back, starting in the water off the wall. Demands body position, a steady rhythm, and a great backstroke flip turn. Rewards swimmers with feel for staying flat and long."
        },
        {
          "name": "Breaststroke",
          "blurb": "The most technical stroke, built on timing: pull, breathe, kick, glide. A legal whip kick and tight streamline make or break it. Rewards patient swimmers who love refining a precise skill."
        },
        {
          "name": "Butterfly",
          "blurb": "The most physically demanding stroke, powered by a strong core and dolphin kick. Rhythm and timing matter more than brute force. Rewards athletes who can stay smooth when it's burning."
        },
        {
          "name": "Individual Medley (IM)",
          "blurb": "All four strokes in one race (200 or 400), swum fly, back, breast, free. Rewards the complete, versatile swimmer who has no glaring weakness and can manage a race across changing strokes."
        },
        {
          "name": "Relays",
          "blurb": "Where an individual sport becomes a team one: the 200/400 free relay and the 200/400 medley relay. Adds the pressure and thrill of clean exchanges, relay starts, and racing for teammates, not just yourself."
        }
      ]
    },
    "mental": "Swimming is honest to the point of being brutal: your time is just a number on a board, and there's nowhere to hide when you touch the wall. That's also what makes it fair. Pre-race nerves behind the blocks are normal even for Olympians; channel them with a fixed warm-up and a simple race cue (fast feet off the start, hold your stroke, finish through the wall). A bad swim is one race, not a verdict, and there's always another heat. The training is mentally hard too, staring at a black line for thousands of yards, so build the habit of staying present set by set. And even though you race alone, the team is real: you split relays, cheer the lanes next to you through the last 25, and warm up together at 6 a.m. Be the swimmer who claps loudest for a teammate's first best time.",
    "getStarted": {
      "steps": [
        "Get water-confident and learn the strokes. Swim lessons or a learn-to-swim program at a pool, YMCA, or rec center is the right starting point if you're new, no shame in it at any age.",
        "Learn to read a pace clock and swim a length of each of the four strokes. These basics let you join a practice without getting lost.",
        "Get a physical. Nearly every school and club requires a current sports physical and signed forms before you can practice or compete.",
        "Get simple gear to start: well-fitting goggles, a swim cap, and a practice suit. Borrow or buy used; you don't need a tech racing suit to begin.",
        "Find a team or program and just show up to the first practice. Tell the coach you're new and ask which events might fit you."
      ],
      "findTeam": [
        {
          "venue": "High school swim team",
          "how": "Ask your athletic office or find the swim coach about the season start (usually fall/winter) and physical requirements. Many high school teams have no cuts and welcome beginners, so the hardest part is showing up to that first practice."
        },
        {
          "venue": "USA Swimming club team",
          "how": "Use the USA Swimming club finder to locate a year-round team near you and attend a tryout or trial practice. This is the main pathway to nationally competitive times and college recruiting. Ask up front about cost, practice schedule, and how they develop swimmers."
        },
        {
          "venue": "Summer / rec & YMCA leagues",
          "how": "Summer swim leagues, YMCA teams, and parks-and-rec programs are lower-cost, lower-pressure, and a great place to start, race, and just love the water. Many fast swimmers began in a neighborhood summer league."
        },
        {
          "venue": "Learn-to-swim & masters-style lessons",
          "how": "If you're new to swimming entirely, start with group or private lessons at a local pool or YMCA to build water safety and stroke basics before joining a competitive team. It's the right, normal first step."
        }
      ]
    },
    "recruiting": {
      "truth": "Be clear-eyed about the numbers: most high school swimmers don't go on to swim in college, and most who do receive partial aid, not a full ride. That's not a reason to quit, it's a reason to swim for the right reasons and keep your options open. The swimmers who get recruited have times, USA Swimming and high school times that meet a program's standards. That is the currency, and it's measured by the clock, not by how you look. Many more swimmers thrive in D2, D3, NAIA, and JUCO than in D1, and millions more swim for fitness and joy for life. Making college swimming your only definition of success is a setup for heartbreak; chase being the fastest, most complete version of your own swimmer, and let recruiting follow.",
      "timeline": [
        {
          "when": "Freshman / Sophomore year",
          "doThis": "Train consistently (high school plus club), find the events that suit you, and chase honest best times. Keep your grades strong, academics open as many doors and as much money as your times do. Keep a simple log of your verified times and the meets you swam."
        },
        {
          "when": "Junior year",
          "doThis": "Know the recruiting time standards for your events at the division levels that fit you. Email coaches with your best times (with the meet and date), your GPA and test scores, and your meet schedule. Junior-year times matter most, so race the meets where you can drop time."
        },
        {
          "when": "Summer before senior year",
          "doThis": "Swim long-course championship meets and college camps where target coaches can see you. Narrow your list by academic fit and team culture, not just name recognition, and follow up with coaches who showed interest."
        },
        {
          "when": "Senior year",
          "doThis": "Take official and unofficial visits, compare any aid offers honestly (athletic plus academic), and confirm your eligibility through the NCAA/NAIA process. Have a plan you're happy with even if the offer is partial or a walk-on spot."
        }
      ],
      "divisions": "Aim for fit over prestige. Important: the rules changed for 2025-26 under the House v. NCAA settlement, which replaced the old per-team scholarship caps with overall roster limits, so a program can now give full, partial, or no aid to swimmers up to its roster limit. The old swimming scholarship counts you may see quoted are outdated, confirm the current limits for your division and gender with coaches when you start talking. In practice, full rides remain rare and most recruited swimmers get partial athletic aid often stacked with academic money. D1 has the deepest talent and the most pressure; D2, D3, NAIA, and JUCO all offer real competition and often a better athletics-academics balance. D3 gives no athletic scholarships but can stack generous academic and need-based aid at strong schools. JUCO is a real path to develop times and transfer up. The best program is the one where you'd be happy even if you got injured, because the academics, coaches, and people fit you."
    },
    "health": {
      "injuries": "The most common issues are overuse, especially shoulder impingement and tendon irritation (\"swimmer's shoulder\") from the high volume of overhead strokes. Breaststrokers can develop knee irritation from the whip kick, and neck and lower-back strain show up from poor body position and a lot of yardage. Most of these trace back to doing too much too soon or training through fatigue.",
      "prevention": "Build training volume gradually and never spike yardage after time off. Do regular dryland and shoulder-care work: rotator-cuff and scapular strengthening, core stability, and mobility. Keep your stroke technique clean, since most shoulder problems start with mechanics. Warm up before hard sets, respect rest and recovery days so tissue can adapt, and if a shoulder, knee, or back ache goes beyond normal soreness, get it checked early instead of swimming through it.",
      "fuel": "Fuel to grow, not to shrink. Swimming burns a lot of energy, often two practices a day, so you need to eat plenty and eat well: balanced meals with carbohydrates for energy, protein to repair muscle, and lots of fruits, vegetables, and healthy fats. Eat a real meal a few hours before racing and refuel within an hour after hard training. Growth and puberty are normal and good; a growing athlete needs more food, not less. Hydrate through the day (yes, you sweat in the pool even when you can't feel it), and treat sleep as part of training, aim for 8-10 hours, because that's when your body actually adapts and gets faster.",
      "note": "Swimming has no weight classes and no reason to manipulate your body. Strong and durable beats light or small every time: a powerful, well-fueled swimmer moves more water. Racing suits are tight by design and the pool exposes more of your body than most sports, which can feel uncomfortable, that's normal, and it never means your body needs to change. No body type is required to be fast, and fit with a team or program is about your interest and skill, never your size. If eating or body image starts to feel anxious or controlling, talk to a coach, parent, athletic trainer, or doctor. Asking for help early is strength, not weakness."
    },
    "character": {
      "trait": "Resilience and humility",
      "model": "Katie Ledecky",
      "why": "Ledecky is one of the most dominant distance swimmers ever, yet she's known for an almost unglamorous love of the daily grind: thousands of meters, the same hard sets, showing up and out-working everyone with no drama. Teammates and coaches describe her as humble, gracious in winning and losing, and genuinely encouraging to younger swimmers. She models the truth that the boring, repeated work, the early practices and the meters no one sees, is what builds both a great racer and a great teammate."
    }
  },
  "gymnastics": {
    "tagline": "Power, grace, and discipline — one skill, then the next, then the next.",
    "overview": "Gymnastics is one of the most technically demanding sports there is: you train strength, flexibility, air awareness, and nerve, then perform it under bright lights with judges watching every landing. It rewards patience and repetition more than almost any other sport — progress is measured in skills mastered, not seasons survived. There is no body type that \"belongs\" in gymnastics. Judges score what you DO — amplitude, form, control, and stuck landings — not how you look or how small you are. Power comes from being strong and well-fueled, and the gymnasts who last are the ones who grow into durable, capable bodies. Growing taller, getting stronger, and going through puberty are normal and good; they change how you train, but they do not end your gymnastics. If you love learning hard skills and chasing clean execution, this sport is for you.",
    "season": {
      "practice": "Club gymnastics is year-round. Lower levels train roughly 6-12 hours a week; competitive Levels 8-10 and elite often train 16-25+ hours across 4-6 days, split between strength/conditioning, event rotations, and routine run-throughs.",
      "arc": "USAG competition season generally runs winter into spring (sectionals, state, regionals, and for top levels nationals), with summer and fall used to upgrade skills and build new routines. College season runs January through April.",
      "commitment": "This is a high-hours sport, so rest is part of the plan, not a reward. Build in at least one full day off each week, protect 8-10 hours of sleep, and take real off-weeks after big meets. Wrists, ankles, and backs need recovery time — chronic soreness or pain that lingers is a signal to back off, not push through."
    },
    "progression": [
      {
        "stage": "Beginner (rec / USAG Level 1-3 or Xcel Bronze)",
        "focus": "Basics on all four events: handstands, cartwheels, pullovers and casts on bars, straight-line walks and jumps on beam, rolls and round-offs on floor, plus daily flexibility and core. Learn how to fall and bail safely. The goal here is clean fundamentals, not big tricks."
      },
      {
        "stage": "Developing (USAG Level 4-7 or Xcel Silver/Gold)",
        "focus": "Real routines on each event, back handsprings, kips on bars, leaps and turns on beam and floor. Conditioning ramps up. You start to find which events click for you. Skill mastery — not size or weight — is what moves you up a level."
      },
      {
        "stage": "Advanced (USAG Level 8-10)",
        "focus": "Difficult, connected skills and full competitive routines: giants and release moves on bars, series and dismounts on beam, tumbling passes with twists on floor, more powerful vaults. Level 9-10 meet experience and a strong all-around (or one or two standout events) is what college coaches look for."
      },
      {
        "stage": "Elite / collegiate",
        "focus": "Elite is the international/Olympic track with its own qualifying system; college gymnastics is the more common end goal for most competitive club gymnasts. Both demand consistency under pressure, clean execution, and durability built over years."
      }
    ],
    "roles": {
      "label": "The four events (plus all-around)",
      "items": [
        {
          "name": "Vault",
          "blurb": "A few seconds of pure power and air awareness — sprint, hurdle, block off the table, and stick a blind landing. Rewards explosiveness and fearless commitment."
        },
        {
          "name": "Uneven bars",
          "blurb": "Swing, rhythm, and grip strength. Giants, transitions, release moves, and a controlled dismount. The most technical event for timing and air sense."
        },
        {
          "name": "Balance beam",
          "blurb": "Four inches of nerve. Acro series, leaps, turns, and dismounts performed with total control. Mental focus and consistency matter as much as the skills."
        },
        {
          "name": "Floor exercise",
          "blurb": "Tumbling passes, leaps, and dance to music — power and artistry together. Where personality and amplitude show, and where conditioning is tested most."
        },
        {
          "name": "All-around",
          "blurb": "Competing all four events and scoring across them. The all-arounder is versatile and consistent — strong everywhere, with no event left to chance."
        }
      ]
    },
    "mental": "Gymnastics is a confidence sport disguised as a physical one. You will spend months on a single skill, fall hundreds of times, and have meets where one wobble costs a podium — and you have to come back the next day and do it again. The mental game is learning to compete one event at a time, reset after a fall, and trust training when fear shows up (it will, especially on new skills and on beam). Talk openly with your coach about skills that scare you — pushing a terrified gymnast onto a skill is how injuries and \"the twisties\" happen. Celebrate the skill you stuck in practice, not just the score. The gymnasts who last are the ones who stay curious and patient, not the ones who never get scared.",
    "getStarted": {
      "steps": [
        "Find a USA Gymnastics (USAG) member club near you and sign up for a beginner or rec class — no experience needed, and most clubs start kids and teens at the basics.",
        "Go consistently and build the fundamentals: handstands, flexibility, core strength, and how to fall safely. These never stop mattering.",
        "Ask your coach about the team or pre-team track once you're comfortable; they'll point you toward USAG Levels or the Xcel program based on your skills and goals.",
        "Get the basics of safety dialed in — proper warm-up, listening to your body, and never trying big skills without a coach and mats. Fuel and sleep well so you have the energy to train.",
        "Compete when you're ready. Local meets are low-pressure ways to learn how to perform, and they show you what to work on next."
      ],
      "findTeam": [
        {
          "venue": "Club / private gym (USAG or Xcel)",
          "how": "The main pathway. Search 'USA Gymnastics member club' plus your town, call to ask about beginner classes and the team track, and visit to watch a practice before signing up."
        },
        {
          "venue": "Rec center / YMCA",
          "how": "Lower-cost intro classes for fundamentals and fun. Great for trying the sport before committing to a competitive club; ask the front desk about youth/teen gymnastics."
        },
        {
          "venue": "School (high school team, where offered)",
          "how": "Some states sanction high school girls' gymnastics — ask the athletic director. Where it exists you can compete for your school alongside or instead of club."
        },
        {
          "venue": "Xcel program",
          "how": "USAG's flexible, lower-hours competitive track. Ask any member club if they offer Xcel — it's a great fit for teens starting later or wanting to compete without elite-level hours."
        }
      ]
    },
    "recruiting": {
      "truth": "Honest truth: most gymnasts do not compete in college, and that is completely okay. Gymnastics gives you discipline, body awareness, work ethic, and resilience that carry into the rest of your life whether or not you ever compete past your club years. College rosters are small, so chase the sport because you love learning hard skills — not only as a ticket somewhere.",
      "timeline": [
        {
          "when": "Freshman / Level 8-ish",
          "doThis": "Train consistently, keep your grades strong, and focus on clean execution. It's early — build skills and stay healthy rather than worrying about recruiting."
        },
        {
          "when": "Sophomore",
          "doThis": "Compete at Level 9/10 if you're on that track, start a simple highlight reel (full routines, not just big skills), and research college programs and academics that fit you."
        },
        {
          "when": "Junior",
          "doThis": "Reach out to college coaches with your reel, scores, and academics. Attend camps at schools you like. This is the key window — coaches watch juniors closely. Take official/unofficial visits."
        },
        {
          "when": "Senior",
          "doThis": "Finalize your list around fit — coaching, team culture, academics, and where you'd be happy if gymnastics ended tomorrow. Confirm any aid in writing and lock in your academics."
        }
      ],
      "divisions": "Look for fit and academics over prestige. NCAA gymnastics (D1, D2, D3) and NAIA all offer paths, and a great team culture matters more than a famous name. On money: the rules changed for 2025-26 under the House v. NCAA settlement — old 'X scholarships per team' figures are outdated. Schools now operate under roster limits and can offer full, partial, or no athletic aid to athletes up to that limit. Most college athletes get partial aid or none, and full rides remain rare, so weigh academic scholarships and overall cost too. Always confirm current scholarship and roster rules for a specific division and school directly with that coach. (Related growing college pathways: Acrobatics & Tumbling and STUNT gained NCAA championship status starting in 2026 — worth a look if those styles appeal to you.)"
    },
    "health": {
      "injuries": "Common areas are wrists, ankles, lower back, elbows, and knees, plus overuse issues like stress fractures from high-impact landings and repetitive loading. Most are manageable with smart training, good technique, and rest.",
      "prevention": "Progressive skill development (no skipping steps), thorough warm-ups, wrist and ankle strengthening, proper landing mechanics, and matting/spotting on new skills. Don't train through pain — lingering or sharp pain means see an athletic trainer or doctor. Real rest days and enough sleep are prevention, not laziness.",
      "fuel": "Fuel to grow and get strong, not to shrink. Gymnastics is powered by energy — eat ENOUGH, across regular meals and snacks, with carbs for power, protein for recovery, and plenty of water through long training sessions. Strong and durable beats light and small every single time; under-fueling steals the power your skills depend on and raises injury and stress-fracture risk. There are no calorie counts, macros, or weight goals here — just eating well and often enough to train hard and grow.",
      "note": "Gymnastics has real, well-documented pressure around leanness and body image, so this part matters as much as any skill. Growing, gaining strength, and going through puberty are normal and good — they do not end your gymnastics; they change how you train, and good coaches adjust with you. Judges score skill and execution, never body size, and no body type is required to belong here. If eating or body image starts to feel anxious or controlling, talk to a coach, parent, athletic trainer, or doctor. Asking for help early is a strength, and you deserve support."
    },
    "character": {
      "trait": "Resilience and grace under pressure",
      "model": "Simone Biles",
      "why": "Beyond being the most decorated gymnast in history, Biles is widely respected for what she modeled in 2021: she stepped back at the Tokyo Olympics when she lost her air awareness ('the twisties'), openly prioritizing her safety and mental health over a medal — then returned to win again. She showed that listening to your body and mind, asking for help, and protecting yourself are signs of strength, not weakness. For a sport with real wellbeing pressures, that's exactly the example worth following."
    }
  },
  "cheerleading": {
    "tagline": "A team that builds people into the air and catches them every time.",
    "overview": "Cheerleading is a real athletic sport that blends tumbling, stunting, jumps, and synchronized performance into one routine where every person has a job and the whole thing falls apart if anyone skips theirs. There is a place for every kind of athlete here: the powerful base who holds a teammate overhead, the flyer with the air awareness and trust to be up there, the tumbler who throws passes across the floor, the back spot who runs the stunt and protects everyone's safety. You do not need a particular body type, and no one should ever tell you that you do. Strong bases and strong flyers are both built by training hard and fueling well, and the fit between you and a role is about your interest, your skill, and what the team needs, never about your size. This is a trust sport: you literally put your body in your teammates' hands, and they put theirs in yours.",
    "season": {
      "practice": "A typical practice opens with a dynamic warmup and conditioning, then splits into stations: tumbling lines (back handsprings, layouts, full passes), stunt groups drilling load-ins and dismounts with spotters, jump technique, and finally putting sections of the routine together to count and music. Safety is built in, not bolted on: stunts progress only when the group has the previous skill clean, and spotters stay engaged every rep. Expect to rep the same eight counts until the timing is automatic for all twenty-some people at once.",
      "arc": "School cheer often runs across the year: a fall sideline season for football, a winter season for basketball, and for competitive squads a competition season that peaks at regional and national championships in late winter and spring. All-Star (club) cheer runs a competition season from roughly late summer through April, ending at big national events. Tryouts are usually in spring for the next school year. Early weeks build conditioning and clean fundamentals; mid-season is about cleaning the routine; the peak is competition day, where a two-and-a-half-minute routine is the whole season.",
      "commitment": "In season expect roughly 10-15+ hours a week between practice, games or competitions, and travel, more on a serious All-Star or competitive school squad. Rest days are part of training, not time off: your wrists, ankles, shoulders, and nervous system recover and get stronger on the days you are not pounding tumbling passes. Skipping rest is how overuse injuries and burnout start. Build in at least one or two genuine rest or light days a week, and treat sleep as part of the program."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Build body control and trust before height. Learn a solid forward and backward roll, cartwheel, round-off, and bridge; develop core and shoulder strength; and learn the sharp, full-body motions and clean jumps (toe touch, hurdler) that make a routine look crisp. In stunts, learn to base and back-spot a simple two-person or thigh-stand stunt with proper grips and a spotter. Learn the counts and how to perform to a crowd."
      },
      {
        "stage": "Developing",
        "focus": "Add a standing back handspring and a round-off back handspring with confidence, and clean up jump technique (height, pointed toes, timing). In stunting, progress to extension-level stunts and basic dismounts as a group, with everyone solid on their role. Flyers build the body tension and air awareness to hold positions; bases and back spots build the strength and footwork to hold and absorb."
      },
      {
        "stage": "Intermediate",
        "focus": "Develop tumbling toward a layout and connected passes (round-off back handspring tuck), and contribute to harder stunts and basket tosses with clean technique. Learn to hit a full routine with stamina so your last eight counts look like your first. Start mentoring newer teammates on the skills you have mastered."
      },
      {
        "stage": "Advanced",
        "focus": "Specialize where you excel (elite tumbler, base, flyer, or back spot) while staying a reliable all-around teammate. Throw advanced passes (full twisting layouts) or anchor complex pyramids and tosses with the consistency a routine demands. At this level, leadership, consistency under pressure, and protecting your group's safety matter as much as the hardest skill."
      }
    ],
    "roles": {
      "label": "Roles",
      "items": [
        {
          "name": "Base",
          "blurb": "The strength and foundation of every stunt. Bases hold, lift, and catch the flyer using legs, core, and technique, not just arms. Footwork, timing, and communication keep the stunt and the flyer safe. Strong bases are built by training and fueling well."
        },
        {
          "name": "Flyer",
          "blurb": "The athlete lifted into the air to hit positions and get tossed and caught. Flying takes body tension, balance, air awareness, and real courage to trust the group below. There is no required size to fly, and no one should be pressured to shrink to do it; good technique from the whole group is what makes it safe."
        },
        {
          "name": "Back spot",
          "blurb": "The leader and safety anchor of the stunt group. The back spot calls the counts, supports the flyer's ankles and waist, watches the whole stunt, and is responsible for protecting the flyer's head and neck on any dismount or fall. Often the most experienced person in the group."
        },
        {
          "name": "Tumbler",
          "blurb": "The athlete who throws the floor passes, from round-offs and handsprings to layouts and fulls. Tumbling is power, timing, and fearless repetition built progressively over time with proper coaching and matting."
        },
        {
          "name": "Jumper / dancer",
          "blurb": "Every cheerleader performs the jumps (toe touches, pikes, hurdlers) and dance sections in sync. Sharp motions, height, and timing across the whole squad are what make a routine look clean and powerful to judges and crowds."
        }
      ]
    },
    "mental": "Cheerleading is a sport where one person's missed count or late catch affects everyone, so the mental game is about trust and ownership. You will drop stunts, fall out of tumbling passes, and have rough practices, sometimes right before a competition. The athletes who get better have a short memory: reset, communicate, and run it again. Performing in front of a crowd or judges brings real nerves; channel them into your routine and your counts so your body does what it has drilled a thousand times even when your head is loud. Being a good teammate is a skill you practice on purpose here: spot every rep like it matters, own your mistakes instead of blaming your group, hype up the teammate who is struggling with a skill, and keep your energy up even when you are tired. The squads that win are the ones where everyone protects each other, on the mat and off it.",
    "getStarted": {
      "steps": [
        "Build a base of strength and body control first: core, shoulders, and legs, plus basic tumbling like rolls, cartwheels, and a round-off. A tumbling class at a local gym is the fastest safe start.",
        "Learn the motions and jumps. Sharp arm motions and clean jumps (toe touch, hurdler) are half of what makes a cheerleader look polished, and you can practice them anywhere.",
        "Take a beginner stunt or cheer class so you learn grips, spotting, and safety from a coach before ever trying skills on your own. Never teach yourself stunting or tumbling off videos.",
        "Watch routines with intent: notice how bases, flyers, and back spots move together, and how the whole squad stays in sync.",
        "Find a school squad, All-Star gym, or rec program and try out or sign up. Show up coachable, in shape, and ready to learn your role."
      ],
      "findTeam": [
        {
          "venue": "School squad",
          "how": "Ask your athletic office or a current cheerleader when tryouts are (usually spring for the next school year). Show up knowing basic motions, jumps, and any tumbling you have, ready to learn a short routine on the spot. Many schools have JV and varsity levels, plus separate sideline and competitive squads, so there is often a spot to grow into."
        },
        {
          "venue": "All-Star / club gym",
          "how": "Search for All-Star cheer gyms in your area and ask about evaluations or beginner teams. All-Star is the fastest skill-building pathway and runs leveled teams (1 through 6) so beginners and elite athletes both have a place. Ask about cost, travel, and time commitment up front, since competitive All-Star can be a big investment."
        },
        {
          "venue": "Rec & community programs",
          "how": "Check your local parks-and-rec, YMCA, or youth cheer league for lower-cost, lower-pressure squads, often tied to youth football. A great place to start, learn basics, and find out if you love it before committing to a bigger program."
        },
        {
          "venue": "Tumbling & stunt classes",
          "how": "Most gymnastics and All-Star gyms offer drop-in tumbling and stunt clinics with no team commitment. These build the exact skills tryouts look for and teach them safely with coaches and proper matting."
        }
      ]
    },
    "recruiting": {
      "truth": "Be honest with yourself about the numbers: most high school cheerleaders do not cheer in college, and that is completely fine. The strength, discipline, teamwork, and confidence you build here outlast the sport. For those who want to continue, the pathways are real and growing, but they are competitive and most athletes who continue get partial aid or none. Traditional sideline and competitive cheer at many colleges is funded as an activity or club rather than a full athletic scholarship, while the closely related collegiate sports give a clearer scholarship and recruiting path. Cheer for the love of it and the team, do the work, and let the next step follow, rather than making a college roster the only measure of whether it was worth it.",
      "timeline": [
        {
          "when": "Freshman / Sophomore year",
          "doThis": "Build skills and keep your grades strong. Get consistent tumbling and stunting through a school squad or All-Star gym, and start a simple record of your skills (tumbling passes, stunt positions, All-Star level). Academics open doors and money that athletics alone will not."
        },
        {
          "when": "Junior year",
          "doThis": "Decide which pathway fits: sideline/competitive college cheer, or the NCAA sports Acrobatics & Tumbling or STUNT. Make a skills video, research programs that fit you academically, and email coaches with your skills, your level, your GPA, and a clip. Visit programs if you can."
        },
        {
          "when": "Summer before senior year",
          "doThis": "Attend college cheer or A&T/STUNT clinics and prospect camps where coaches evaluate athletes directly. Narrow your list by academic fit, cost, and team culture, not just name recognition, and follow up with any coach who showed interest."
        },
        {
          "when": "Senior year",
          "doThis": "Lock in tryouts or visits, compare any aid offers honestly (athletic plus academic plus need-based), and confirm you have the grades and skills for both admission and the team. Have a plan you are happy with even if the spot is a walk-on or partial."
        }
      ],
      "divisions": "The college landscape changed in 2025-26, so confirm current rules with coaches rather than relying on older scholarship numbers. Under the House settlement, sport-by-sport scholarship caps were replaced by roster limits, meaning a school can offer full, partial, or no scholarship to athletes up to a team's roster size; full rides are rare in most sports and partial aid or none is the norm. Traditional sideline and competitive cheer is still not an NCAA championship sport and is often funded as an activity, with limited and school-dependent aid. The two closely related collegiate sports, Acrobatics & Tumbling and STUNT, were elevated to NCAA championship status beginning in 2026 and are real, growing pathways with clearer recruiting structures. Across all of it, pick the school where you will get a degree you want, afford it, and be happy even if you stopped competing. Fit and academics beat prestige every time."
    },
    "health": {
      "injuries": "The common ones are ankle and wrist sprains from tumbling and landings, knee injuries (including ACL), and concussions from stunt and basket-toss falls, which are the most serious risk in the sport. Overuse injuries in the wrists, shoulders, and lower back climb when athletes pound tumbling without enough rest.",
      "prevention": "Safety comes from technique and progression, not from anyone being smaller. Always warm up dynamically, and only attempt stunts and tumbling skills you have earned, with trained spotters and proper matting; never skip steps to rush a skill. Strengthen ankles, wrists, core, and shoulders so your joints can absorb landings, and drill safe landing and dismount mechanics. Good technique from the whole stunt group, not a lighter flyer, is what makes stunts safe. Respect rest and recovery days so tissue can adapt, and replace worn shoes.",
      "fuel": "Fuel your body to grow and get stronger, not to shrink it. This is the sport where you may hear pressure about a flyer's weight, so be clear: no one should ever push a flyer to lose weight, and strong, well-fueled bases and flyers are what make stunting safe. Eat enough across the whole day, with balanced meals: carbohydrates for energy, protein to repair muscle, and plenty of fruits, vegetables, and healthy fats. Hydrate before, during, and after practice, especially in hot gyms, and aim for a full night of sleep (8-10 hours for teens), which is when your body actually adapts and gets stronger. Strong and durable beats light or small, every time.",
      "note": "Take every head impact seriously: if you fall or get hit and feel dizzy, foggy, or headachy, sit out and tell a coach, parent, or athletic trainer; never hide a suspected concussion to stay in a routine. And know that growing and going through puberty are normal and good, not problems to fix; your body changing is part of becoming a stronger athlete. If eating or body image ever starts to feel anxious or controlling, talk to a coach, parent, athletic trainer, or doctor. Asking for help early is strength, not weakness."
    },
    "character": {
      "trait": "Trust and team-first selflessness",
      "model": "Sydney McLaughlin-Levrone",
      "why": "The Olympic champion hurdler is widely respected for the way she carries herself: humble in victory, gracious in defeat, and consistent about crediting her team, coaches, and family rather than herself. She models the exact mindset cheerleading demands, that the work is shared, that you protect and lift the people around you, and that how you treat your teammates matters as much as the skills you can throw. Her steady, no-drama character under enormous pressure is a model for any young athlete in a trust-based team sport."
    }
  },
  "football": {
    "tagline": "Eleven players, one assignment each, every snap.",
    "overview": "Football is a game of leverage, technique, and trust: eleven players each doing one job so the play works. The myth is that you have to be the biggest kid on the field. The truth is there is a role for nearly every build and temperament. Lean and fast plays receiver or corner; quick and tough plays running back or linebacker; smart and patient quarterbacks the offense; strong and disciplined anchors the line; a precise foot kicks and punts. What every spot rewards is the same: knowing your assignment, playing low and under control, and competing on every down. You earn a place here with skill, effort, and how coachable you are, never with a number on a scale.",
    "season": {
      "practice": "A typical practice opens with a dynamic warmup and form-tackling or ball-handling fundamentals, then breaks into position groups: linemen work hand placement and footwork, skill players run routes and coverage, the quarterback and receivers time throws. It builds to team periods, install of that week's plays, and situational work (red zone, two-minute, special teams), often closing with conditioning. Safe tackling and blocking technique get drilled constantly, at every level.",
      "arc": "Summer brings weight room, 7-on-7, and a preseason camp where the team installs its system and earns conditioning. The regular season runs late summer into fall, usually one game a week (often Friday nights) with practice most other days and a film session. It builds toward conference play and then a playoff bracket. Off-season is strength work, speed and agility, and skill development, with rest built in.",
      "commitment": "In season, expect 12-18+ hours a week between practices, the game, travel, film study, and special teams. Off-season strength and speed work adds more if you choose to put it in. Rest days are part of the program, not a reward for finishing it: muscle, joints, and your nervous system rebuild during sleep and recovery, and skipping rest is how soft-tissue injuries and burnout start. One full day off a week is normal and smart."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Learn the rules, the positions, and your stance. Get the fundamentals of a safe, heads-up tackle (eyes up, never lead with the crown of your helmet), a basic block with proper hand placement, and how to catch with your hands away from your body. Learn one position's assignment well before trying to learn them all."
      },
      {
        "stage": "Developing",
        "focus": "Build position-specific technique: route running and ball security, pad level and footwork on the line, backpedal and breaks for defensive backs, reading your keys at linebacker. Start learning the playbook and the why behind assignments. Add general strength and speed work appropriate for your age."
      },
      {
        "stage": "Intermediate",
        "focus": "Play faster by thinking less: recognize fronts and coverages, diagnose plays pre-snap, and trust your technique under contact. Sharpen your craft (release moves, hand combat, tackling angles) and study film to fix habits. Become reliable on special teams, which is real playing time and value."
      },
      {
        "stage": "Advanced",
        "focus": "Master a position at a high level while understanding the whole scheme. Win your one-on-one matchup consistently, communicate and lead your unit, and impact winning in ways the stat sheet misses: a perfect block, a leverage tackle, a checked protection. This is the level that earns trust and, for some, college looks."
      }
    ],
    "roles": {
      "label": "Positions",
      "items": [
        {
          "name": "Quarterback (QB)",
          "blurb": "The decision-maker. Runs the offense, reads the defense, and delivers the ball on time. Lives on accuracy, processing speed, leadership, and poise under pressure, not arm strength alone."
        },
        {
          "name": "Running back & receiver",
          "blurb": "The ball handlers. Backs run, block, and catch on vision, balance, and ball security; receivers and tight ends win with crisp routes, reliable hands, and separation. Precise, decisive athletes."
        },
        {
          "name": "Offensive line (T, G, C)",
          "blurb": "The unsung anchors. Protect the quarterback and open running lanes with footwork, hand placement, and leverage. The most team-first spot on the field: no stats, just trust and technique."
        },
        {
          "name": "Defensive line / Edge",
          "blurb": "The disruptors. Beat blocks, set the edge, rush the passer, and stuff the run with hand combat and explosiveness. Leverage and effort beat raw size here."
        },
        {
          "name": "Linebacker",
          "blurb": "The defense's quarterback. Reads plays, fills gaps, covers, and tackles in space. Rewards instincts, communication, and players who love to read and react."
        },
        {
          "name": "Defensive back & specialists",
          "blurb": "DBs cover, break on the ball, and tackle in the open field on footwork and a short memory. Kickers, punters, and snappers win field position on pure technique and nerve, a real path onto the team."
        }
      ]
    },
    "mental": "Football is a game of short memory and the next play. You will get beat on a rep, miss a tackle, drop a pass, sometimes under Friday-night lights with a crowd watching. What separates good players is how fast they reset: eyes up, learn it on the sideline from film, and go win the next snap. Nerves before a game are normal even for starters; channel them into your routine and your assignment so your body knows what to do when your head is loud. This is the ultimate team sport: your job only works if ten others do theirs, so being a good teammate is a skill you practice on purpose. Talk on defense, finish your block for the guy with the ball, lift the freshman, own your mistake instead of pointing at someone else. Coaches recruit character, and teammates remember who they could count on.",
    "getStarted": {
      "steps": [
        "Get a physical and the paperwork done early. Nearly every program requires a current sports physical and signed forms before you can practice or hit.",
        "Learn the game with intent: watch film and live games noticing assignments, leverage, and where players line up, not just the ball.",
        "Get in football shape over the summer: general strength, speed, agility, and conditioning. Show up to camp ready to compete, not to get into shape on day one.",
        "Pick a position to start and learn its fundamentals and one assignment cold. Tell a coach you're new and ask where your speed, size, and instincts fit best.",
        "Don't sleep on special teams. It's real playing time and the fastest way for a new player to earn the field and the coaches' trust."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Ask your athletic office or a PE teacher when football starts; summer camp and tryouts usually begin weeks before fall classes. Most schools have freshman, JV, and varsity levels, so there's often a spot to grow into. Show up in shape, knowing the basics, ready to be coached."
        },
        {
          "venue": "Youth & club leagues",
          "how": "For younger or newer players, look up Pop Warner, American Youth Football, or local Parks & Rec tackle and flag leagues. These teach fundamentals and safe technique in age- and often weight-grouped divisions, a lower-pressure place to learn the game."
        },
        {
          "venue": "Flag football",
          "how": "A fast-growing, non-contact way to learn football's skills and IQ with far less injury risk. Check school clubs, rec leagues, and the NFL FLAG network. Girls' flag football is now a sanctioned high school sport in a growing number of states and an emerging college pathway."
        },
        {
          "venue": "7-on-7 & camps",
          "how": "Off-season 7-on-7 (passing-game, no linemen) and position camps build skill and get skill-position players seen. Search local programs and college-run camps, and ask about cost and travel up front. Great for development and exposure once you know your position."
        }
      ]
    },
    "recruiting": {
      "truth": "Be honest with yourself about the numbers: only a small share of high school football players, well under one in ten, ever play in college, and a tiny fraction of those play at the highest level on a full scholarship. That isn't a reason to quit; it's a reason to play for the right reasons and keep your options open. Far more players find a great home in D2, D3, NAIA, and JUCO, and most who love the game move on to coaching, refereeing, intramurals, or just being a fan with stories. College football is a worthy goal; making it your only measure of success sets you up for heartache. Chase being the best, most coachable version of your game, take care of your grades, and let recruiting follow.",
      "timeline": [
        {
          "when": "Freshman / Sophomore year",
          "doThis": "Play, learn your position, and lift and run to build a healthy athletic base. Keep your grades strong from day one. Academics open doors and money that football alone won't, and stay eligible: ineligible players don't get recruited."
        },
        {
          "when": "Junior year",
          "doThis": "This is the big year. Build a highlight film from game tape, get verified athletic testing if you can, and email coaches at programs that fit you academically and athletically. Attend camps to be evaluated in person. Be realistic about which level matches your film."
        },
        {
          "when": "Summer before / Senior year",
          "doThis": "Take visits, narrow your list by fit (playing time, major, coaching staff, cost, where you'd actually be happy), and finalize academic eligibility through the NCAA or NAIA clearinghouse. Keep your senior film and grades up; offers can come late."
        },
        {
          "when": "Throughout",
          "doThis": "Stay coachable, durable, and a leader. Coaches recruit character and ask around: a reputation as a great teammate and a hard worker can matter as much as your stat line."
        }
      ],
      "divisions": "The recruiting rules changed in 2025-26. Under the House v. NCAA settlement, the old per-team scholarship caps are gone, replaced by roster limits (football's is set at 105), and a school can offer any athlete a full, partial, or no scholarship up to that roster limit. What that means for you: most college players get partial aid or none, and full rides remain rare and competitive, so don't treat any old 'X scholarships per team' figure as current, and confirm the rules for your division with coaches directly. D1 (FBS and FCS) is the highest level and the hardest to reach. D2 and NAIA often blend partial athletic money with academic aid. D3 offers no athletic scholarships but strong academic and need-based aid at often-excellent schools. JUCO is a real path to develop, fix grades, and transfer up. The smartest move is to pick the level and school where you'll actually play, get a degree you want, and afford it. Fit and academics beat prestige every time."
    },
    "health": {
      "injuries": "Football carries real contact risk: concussions, sprains and ligament tears in the knee (ACL/MCL) and ankle, shoulder injuries and stingers, and the bumps and bruises of a contact sport. Heat illness is a serious preseason risk. Overuse injuries climb when players skip rest and recovery.",
      "prevention": "Technique is your best protection: drill heads-up, see-what-you-hit tackling and proper blocking, and never lead with the crown of your helmet. Always warm up and build flexibility, strength, and especially neck and core strength. Make sure your helmet and pads fit and are worn correctly every rep. Hydrate and acclimate carefully in summer heat to prevent heat illness, and respect rest days so your body adapts and durable strength sticks.",
      "fuel": "Fuel to grow and get strong, not to hit a number on the scale. Your body is still developing, and growth and puberty are normal and good; let your size come on its own timeline. Eat enough across the day, real, balanced meals with carbs for energy, protein to repair and build muscle, plus fruits, vegetables, and healthy fats, and hydrate well, especially in the heat. Strength and durability are built in the weight room and the kitchen over time, never by force-bulking or chasing pounds fast. Strong and durable beats simply heavier or bigger, and sleep (8-10 hours for teens) is where you actually get better.",
      "note": "Take any head contact seriously, this is the most important rule in football. If you take a hard hit or collision and feel dizzy, foggy, slow, or have a headache or blurry vision, come out and tell a coach, parent, or athletic trainer right away. Never hide a suspected concussion or talk your way back in; there is no toughness award for it, and a brain needs time to heal. Linemen sometimes feel pressure to 'bulk up' fast, ignore it: build strength the healthy way with training, eating enough good food, and sleep, and never make weight a goal. If eating or body image ever starts to feel anxious or controlling, talk to a coach, parent, athletic trainer, or doctor."
    },
    "character": {
      "trait": "Discipline and team-first leadership",
      "model": "Peyton Manning",
      "why": "Manning was famous for preparation, not flash: he out-studied everyone, knew his assignments and his teammates' cold, and made the players around him better. He treated linemen, backups, and staff with respect, owned his mistakes, and let relentless work and accountability define him. He's a model for the truth that the unseen work, film study, mastering your assignment, and showing up the same way every day, is what builds a great player and a leader teammates trust."
    }
  },
  "soccer": {
    "tagline": "The world's game. Eleven players, one ball, ninety minutes of reading what happens next.",
    "overview": "Soccer rewards endurance, first touch, and vision more than raw size. The smallest player on the pitch can be the best one - what wins is control of the ball, awareness of space, and the engine to keep running in minute 85 the way you ran in minute 5. There is a position and a role for almost every body and temperament: relentless runners, calm passers, brave defenders, quick finishers, fearless keepers. You don't need to be tall or fast to start - you need a good touch, a willingness to work, and the patience to learn where to be before the ball arrives. Everything else is built through reps.",
    "season": {
      "practice": "High school season runs through the fall (or spring for girls in some states) with 4-6 sessions a week of training plus 1-2 games; club soccer runs nearly year-round with practices 2-4 nights a week and weekend matches or showcase tournaments.",
      "arc": "Preseason builds your aerobic base and reintroduces ball work; the regular season layers in tactics and game fitness; playoffs and showcases peak; the off weeks are for rest, cross-training, and fixing one weakness. Many committed players juggle a high school season and a club season back to back - guard against running 12 months straight.",
      "commitment": "Plan on 2-3 dedicated rest or active-recovery days a week even in season - legs that never recover get hurt. Take at least a few weeks fully off the ball each year. A real off-period is not laziness; it is how tendons, growth plates, and motivation all reset."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Comfort on the ball with both feet - dribbling at a walk then a jog, simple inside-of-foot passes, trapping a moving ball dead. Learn the basic shape of the field and what each position roughly does."
      },
      {
        "stage": "Developing",
        "focus": "First touch under light pressure, passing and receiving on the move, striking a clean ball with your laces, and reading when to dribble vs. pass. Pick a position you enjoy and learn its job in and out of possession."
      },
      {
        "stage": "Competitive",
        "focus": "Tactical awareness - scanning before you receive, playing one and two touch, defending angles instead of lunging, and timing runs. Develop a weaker foot and a position-specific skill (a keeper's distribution, a winger's cross, a center back's heading)."
      },
      {
        "stage": "Advanced",
        "focus": "Game intelligence at speed - controlling tempo, exploiting space before it opens, and consistency match to match. This is where decision-making, not just technique, separates players. Film study and honest self-review become part of training."
      }
    ],
    "roles": {
      "label": "Positions",
      "items": [
        {
          "name": "Goalkeeper (GK)",
          "blurb": "The last line and the first attack. Needs brave hands, quick feet, loud communication, and increasingly the ability to play out of the back with the ball at their feet. A specialist role - find a keeper coach early."
        },
        {
          "name": "Defenders",
          "blurb": "Center backs read danger, win duels, and organize; outside backs defend the flank and join the attack. Positioning and timing beat raw speed. Calm under pressure is the job."
        },
        {
          "name": "Midfielders",
          "blurb": "The engine room. Defensive mids screen and recover; central mids link play and dictate tempo; attacking mids create chances. The most running and the most decisions per minute on the field."
        },
        {
          "name": "Forwards",
          "blurb": "Wingers beat defenders and deliver; strikers finish and press from the front. Needs sharp movement, composure in front of goal, and a short memory after a miss."
        }
      ]
    },
    "mental": "Soccer is a low-scoring game built on mistakes - you will give the ball away, get beaten, and miss chances every single match, and so will the best player on the field. The mental skill is the short memory: lose the ball, win it back; miss the shot, make the next run. Confidence comes from preparation, not from never failing. Learn to communicate out loud (good players talk constantly), to stay switched on when the ball is 60 yards away, and to handle a coach's hard coaching without collapsing. The 90-minute focus is a muscle - it trains like any other.",
    "getStarted": {
      "steps": [
        "Get a ball and juggle and dribble at home - daily touches on the ball are the single best thing a beginner can do, and they cost nothing.",
        "Join any organized team - rec, school, or club - to learn the flow of a real game; you cannot learn spacing alone in a backyard.",
        "Play small-sided pickup (3v3, 5v5) as much as you can; more touches per minute than full-field games and the fastest way to improve decisions.",
        "Pick a position you enjoy, then learn one new skill for it each month - a move, a pass, a defensive habit.",
        "Watch full matches and follow one player in your position for a half - notice their movement when they don't have the ball."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Try out through your middle or high school athletics office. No-cut JV programs exist in many schools - ask the coach about levels and tryout dates before the season."
        },
        {
          "venue": "Club / travel",
          "how": "Search your state youth soccer association or US Youth Soccer for local clubs; most hold open tryouts in spring. Clubs range from house-level to elite (ECNL, MLS NEXT) - start where you can play real minutes, not on the bench of the highest team."
        },
        {
          "venue": "Rec league",
          "how": "City parks and rec departments and the YMCA run low-cost, low-pressure leagues open to all skill levels with rolling sign-ups - the best on-ramp if you've never played."
        }
      ]
    },
    "recruiting": {
      "truth": "The large majority of high school soccer players do not play in college, and that is completely fine. Soccer is a game you can play in pickup, intramural, and adult leagues for the rest of your life. Chasing a roster spot should never be the only reason you play - if it happens, treat it as a bonus on top of a sport you love.",
      "timeline": [
        {
          "when": "9th-10th grade",
          "doThis": "Play as much real soccer as you can and get into a competitive club environment if recruiting is a goal. Keep your grades up from day one - academics open more doors than highlight clips. Start saving game clips."
        },
        {
          "when": "10th-11th grade",
          "doThis": "Build an honest highlight video (full clips and game film, not just goals), play in showcases where college coaches actually attend, and email coaches at programs that fit you. Take an unofficial visit or two to feel out levels."
        },
        {
          "when": "11th-12th grade",
          "doThis": "Narrow to schools that fit academically, financially, and athletically. Keep in touch with interested coaches, attend their ID camps, and be realistic about which division matches your level and your life."
        },
        {
          "when": "Throughout",
          "doThis": "Stay healthy and durable - a recruit who is always injured is a hard recruit. Protect your body and your transcript as carefully as your touch."
        }
      ],
      "divisions": "NCAA D1, D2, D3, NAIA, and junior colleges all field soccer teams at very different intensities. As of the 2025-26 House settlement, sport-by-sport scholarship caps were replaced by roster limits - a school can offer full, partial, or no aid to any player up to its roster size, so older per-team scholarship counts are outdated. The practical reality is unchanged: most college players receive partial aid or none, and full rides are rare, especially on the men's side. D3 and many NAIA schools give no athletic money but often strong academic aid. Confirm current limits and aid for your division directly with coaches, and weigh fit, playing time, and academics over the prestige of a logo."
    },
    "health": {
      "injuries": "ACL tears (especially in female players), ankle and knee sprains, hamstring and groin strains, and concussions - from head-to-head and head-to-ground collisions more than from clean headers.",
      "prevention": "Do a neuromuscular warm-up like FIFA 11+ before every session - it measurably cuts ACL and lower-limb injury rates. Build hip, hamstring, and core strength; learn to land and cut under control. Use proper heading technique and respect age guidelines that limit heading for younger players. Report and rest any suspected concussion - no header, no header drill, no game until cleared. Don't play 12 months straight; overuse is its own injury.",
      "fuel": "Eat enough to train, grow, and recover - soccer burns a huge amount of energy, and underfueling shows up as fatigue, poor touch late in games, and injuries that won't heal. Build meals around carbs for running energy, protein to repair muscle, and plenty of fruit and vegetables. Eat to grow, not to shrink. Hydrate before, during, and after - cramps in the second half are usually a fluid story. Sleep 8-10 hours; recovery happens at night, not in the gym.",
      "note": "Soccer demands a real aerobic base, so off-season fitness matters - but legs need recovery days, and growing bodies need rest more than extra reps. Durability and fitness, never performance at any cost."
    },
    "character": {
      "trait": "Composure and leadership under pressure",
      "model": "Megan Rapinoe",
      "why": "Beyond the trophies, she was known for stepping up in the biggest moments - including taking and converting high-pressure penalties when the whole tournament was watching - and for leading and standing up for what she believed in. The lesson for a young player is that real influence on a team comes from being reliable when it's hardest and from how you carry yourself, not just from raw talent."
    }
  },
  "baseball": {
    "tagline": "A game of failure handled well — fail 7 of 10 at bat and you're an All-Star. Patience, repetition, and one explosive swing.",
    "overview": "Baseball rewards the long game. It's nine players, but every at-bat and every pitch is a one-on-one battle, so quiet kids and loud kids both find a home. There's no single body type that wins — wiry contact hitters, tall pitchers, stocky catchers, and fast middle infielders all start. What separates players is repeatable skill: a clean swing, a true throw, reading the game a half-second early. It's a slow sport to look at and a fast one to play, and the kids who love the daily grind of reps tend to be the ones who stick.",
    "season": {
      "practice": "In season, roughly 5-6 days/week: team practice or a game most days, plus throwing and hitting. Pitchers throw on a structured schedule with mandatory rest between outings. Off-season is lighter — 3-4 days of strength, agility, and skill work.",
      "arc": "High school season runs spring (Feb-May/June depending on region). Many players add summer travel/showcase ball (June-Aug) and fall ball. The honest catch: stacking spring + summer + fall with no break is how arms break down. Build in a true off-season.",
      "commitment": "Plan at least 1-2 full rest days a week and 2-3 months a year with NO competitive throwing — arms need real recovery, not just lighter days. More baseball is not always better baseball."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Learn to catch, throw with clean mechanics, and make contact. Field ground balls and fly balls. Understand the count, outs, and where to throw. Have fun and play multiple positions."
      },
      {
        "stage": "Developing",
        "focus": "Consistent swing you can repeat, accurate throws from a real position, base-running reads, and bunting. Start tracking pitch types. Pitchers: command of one or two pitches over raw velocity."
      },
      {
        "stage": "Skilled",
        "focus": "Hit good pitching, drive the ball to all fields, and defend a position at game speed. Pitchers develop a third pitch and command the zone. Read situations before they happen."
      },
      {
        "stage": "Advanced",
        "focus": "Compete against elite arms and hitters, perform under recruiting eyes, and own a defined role. This is skill, timing, and baseball IQ — not size. Late physical maturity is common; many late bloomers pass early peakers."
      }
    ],
    "roles": {
      "label": "Positions & roles",
      "items": [
        {
          "name": "Pitchers (SP / RP / closer)",
          "blurb": "The most scrutinized arms on the field. Starters go deep into games; relievers and closers handle short, high-leverage stretches. Velocity gets attention, but command, a usable off-speed pitch, and durability keep you on the mound."
        },
        {
          "name": "Catcher",
          "blurb": "The field general — calls pitches, blocks the plate, controls the running game, and manages the pitcher. Toughness and game smarts matter as much as the bat. Heavily recruited because the position is hard to fill."
        },
        {
          "name": "Infield (1B, 2B, SS, 3B)",
          "blurb": "Quick hands, footwork, and arm strength. Shortstop and second-base players turn double plays and cover ground; corners (1B/3B) defend hard-hit balls and often carry more power in the lineup."
        },
        {
          "name": "Outfield (LF, CF, RF)",
          "blurb": "Range, reads off the bat, and arm strength. Center field rewards speed; corners reward a strong, accurate arm. Often where the lineup's best athletes and hitters live."
        },
        {
          "name": "Hitter / DH",
          "blurb": "Every position player is a hitter first to the recruiter — contact, plate discipline, and the ability to drive the ball. The DH role lets a strong bat contribute without playing the field."
        }
      ]
    },
    "mental": "Baseball is a sport of managed failure. A great hitter is out 70% of the time, errors happen in front of everyone, and a bad inning can't be erased — only answered by the next pitch. The players who last build a short memory: let the last at-bat go, lock onto the next one. Slumps are normal and temporary; pressing makes them worse. Learn to slow your breathing, trust your reps, and judge yourself on process — good swings, smart throws, right reads — not just the box score. The scoreboard lies about how you played more often than people admit.",
    "getStarted": {
      "steps": [
        "Get a glove that fits and learn to throw and catch with clean mechanics before anything else — bad throwing habits cause arm injuries later.",
        "Join any organized team — rec league, school, or a local club — and play. Reps against live pitching beat solo drills.",
        "Try multiple positions early. Don't lock into 'I'm only a pitcher' at 13; versatility keeps you on the field and protects your arm.",
        "Hit off a tee and do soft-toss regularly — a repeatable swing is built on boring volume, not batting-cage home-run derbies.",
        "If you fall in love with it, find a coach or program that teaches mechanics and arm care, not just wins."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Try out for your middle or high school team — ask the athletic office or coach about tryout dates (usually late winter/early spring). No experience needed for JV or freshman teams at most schools."
        },
        {
          "venue": "Club / travel ball",
          "how": "Search local travel organizations or academies and attend a tryout. These cost money and travel more; they're where recruiting happens, but you don't need them to start or to enjoy the game."
        },
        {
          "venue": "Rec / Little League / Babe Ruth",
          "how": "Sign up through your city parks department or a local league online — open to all skill levels, low cost, and the best low-pressure place to learn the game."
        }
      ]
    },
    "recruiting": {
      "truth": "Most high-school players — the large majority — never play college baseball, and that is completely fine. Baseball can be a sport you love for life: rec leagues, coaching, intramurals, or just playing catch with your own kids someday. Don't let 'will I get recruited' steal the joy of the game you have right now.",
      "timeline": [
        {
          "when": "9th-10th grade",
          "doThis": "Play, get strong and healthy, and build clean mechanics. Keep your grades up — academics open more doors and money than most people expect. No need for expensive showcases yet; develop the skill first."
        },
        {
          "when": "11th grade",
          "doThis": "This is the key recruiting window. If college is a real goal, get evaluated at legit showcases or camps, build an honest highlight profile, and email coaches at programs that fit your level and your grades. Be realistic about which divisions match your ability."
        },
        {
          "when": "12th grade",
          "doThis": "Finalize your list, take official/unofficial visits, and weigh fit, playing time, academics, and cost — not just the most famous name. Walk-on and partial-aid paths are common and legitimate."
        }
      ],
      "divisions": "The college landscape changed in 2025-26 under the House v. NCAA settlement: the old per-team scholarship caps (you may have heard '11.7 scholarships') are gone, replaced by roster limits, and schools can now offer full, partial, or no aid up to that limit. The honest reality hasn't changed — most college baseball players get partial aid or none, and full rides are rare. Confirm current roster and aid rules for any specific division with that program's coach. On the draft path: a player can be drafted out of high school, but once you enroll at a four-year college you generally aren't draft-eligible again until after your junior year or age 21 — JUCO (two-year college) players can be drafted sooner. A signing bonus is real money but it's an either/or with the college experience; it's a personal and family decision, not a no-brainer. Across all of this, prioritize fit, playing time, and academics over prestige — the right program for YOU beats a famous logo on the bench."
    },
    "health": {
      "injuries": "Arm injuries dominate baseball: rotator-cuff and shoulder strain, and elbow UCL damage (the ligament repaired by 'Tommy John' surgery). Also back strain from rotation and the occasional hit-by-pitch or sliding injury.",
      "prevention": "Arm care is everything. Respect pitch counts and required rest days between outings — these exist because of real injury data, not to slow you down. Don't pitch through soreness, don't throw year-round with no off-season, and avoid maxing out velocity on every pitch. A proper warm-up, gradual throwing buildup, mobility work, and balanced shoulder/core strength protect the arm. If your elbow or shoulder hurts, stop and tell an adult — pushing through is how a sore arm becomes surgery.",
      "fuel": "Eat enough to fuel long days of practice and games and to support a growing body — that means real meals with carbs for energy, protein to recover, and plenty of fruits and vegetables. Eat to grow, not to shrink. Hydrate well, especially for hot spring and summer doubleheaders, and sleep 8-10 hours so your body and arm actually recover. Food is fuel, not something to restrict.",
      "note": "Weight and size are static facts for a recruiting profile, never a goal to chase. Don't try to bulk up or slim down to fit a position — build healthy, durable strength and let your body grow on its own timeline. Late maturers catch up; injuries from overdoing it don't always."
    },
    "character": {
      "trait": "Steady professionalism and respect for the game",
      "model": "Derek Jeter",
      "why": "Across 20 seasons Jeter built a reputation for showing up, playing the game the right way, and handling both winning and pressure with composure and class — rarely making headlines for anything but his play and conduct. He's a secular example of how steady, respectful professionalism earns lasting respect, which fits baseball's grind: it's the everyday consistency, not the flashy moment, that defines a player."
    }
  },
  "softball": {
    "tagline": "A thinking-fast game of split-second reads, clean throws, and the nerve to come through with the bases loaded.",
    "overview": "Fast-pitch softball rewards players who read the game quickly and execute clean fundamentals under pressure. It's a sport of repeatable skills — fielding a ground ball the same way every time, putting the bat on the ball, throwing accurately to a base — stacked on top of fast decisions. There's a spot for every kind of athlete: the patient contact hitter, the rangey shortstop, the steady catcher who runs the defense, the pitcher who lives in the circle. You don't need a certain build to belong here. Quick hands, a coachable attitude, and a willingness to take a thousand reps will take you further than raw size ever will. The windmill (fast-pitch) motion is its own distinct skill — powerful and demanding — which is exactly why it's learnable: with good coaching and arm care, you build it rep by rep.",
    "season": {
      "practice": "In-season teams typically practice or play 4-6 days a week — a mix of hitting, fielding, situational reps, and conditioning. Pitchers add separate bullpen and arm-care sessions. Build in at least one full rest day every week so your arm and body recover.",
      "arc": "High school season runs in spring (roughly Feb-May depending on region). But the recruiting engine is travel/club ball, which runs summer and fall showcases and tournaments. Many serious players are on a near-year-round cycle — which makes deliberate off weeks essential, not optional.",
      "commitment": "Real but manageable if you protect recovery. Expect several practices plus games or a weekend tournament most weeks in season. Guard one rest day weekly and take a few weeks fully off the throwing motion each year to let your arm heal. Tired arms get hurt; rested arms get better."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Learn to catch and throw correctly, field a ground ball with two hands in front of you, and make solid contact off a tee and front toss. Master the overhand throw before anything else. Goal here is clean, repeatable mechanics — not power."
      },
      {
        "stage": "Developing",
        "focus": "Live hitting against real speed, footwork at your position, reading hops, and game situations (where's the play, what's the count). Pitchers begin the windmill motion with a coach who teaches arm care from day one. Hit off-speed, not just fastballs."
      },
      {
        "stage": "Competitive",
        "focus": "Play travel/club ball for real reps against strong competition. Sharpen one or two positions, get faster and more agile, and learn to perform when it matters. Pitchers and catchers refine their pitch mix and game-calling. Consistency under pressure separates players here."
      },
      {
        "stage": "Advanced",
        "focus": "Elite reads, plus-level skill at a specific position, and the mental game to stay locked in across a long tournament. This is showcase and recruiting territory — but it's built on the same fundamentals, just executed faster and cleaner than everyone else."
      }
    ],
    "roles": {
      "label": "Positions",
      "items": [
        {
          "name": "Pitcher",
          "blurb": "Runs the game from the circle with the windmill motion. The most specialized, arm-demanding role — protect it with mechanics and rest."
        },
        {
          "name": "Catcher",
          "blurb": "The field general. Calls pitches, blocks balls in the dirt, throws out runners, and keeps the defense organized. Tough and tactical."
        },
        {
          "name": "Corner infield (1B / 3B)",
          "blurb": "First base scoops throws and saves errors; third is the 'hot corner' — quick reactions and a strong arm across the diamond."
        },
        {
          "name": "Middle infield (SS / 2B)",
          "blurb": "Range, soft hands, and fast footwork. Turn double plays and cover the most ground in the infield."
        },
        {
          "name": "Outfield (LF / CF / RF)",
          "blurb": "Cover ground, read the ball off the bat, and make accurate throws to the right base. Center field needs the most speed and range."
        },
        {
          "name": "Utility / DP / Flex",
          "blurb": "Players who can hit, fill multiple spots, or specialize as a designated hitter. Versatility keeps you in the lineup."
        }
      ]
    },
    "mental": "Softball is a game of failure — even great hitters get out most of the time, and every fielder boots a ball eventually. The players who last are the ones with short memories: make the error, flush it, get ready for the next pitch. Stay present, control your breathing in tight spots, and trust the reps you've put in. Confidence here isn't loud; it's the quiet belief that you've done the work and you'll handle whatever comes. Be a teammate who picks people up after mistakes — that's the dugout culture that wins close games.",
    "getStarted": {
      "steps": [
        "Learn to catch and throw correctly first — get the overhand throw clean before anything fancy.",
        "Get a glove that fits and break it in; borrow gear to start, you don't need everything.",
        "Hit off a tee and field grounders against a wall or with a parent — quality reps add up fast.",
        "Join a team (rec, school, or club) to learn positions and game situations with coaching.",
        "If you love it and want to play seriously, look into travel/club ball — that's the recruiting pathway."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Try out for your middle or high school team — ask the athletic office or PE teacher about tryout dates and what to bring. No cost beyond basic gear."
        },
        {
          "venue": "Rec / Little League",
          "how": "Local parks-and-rec or Little League Softball leagues take beginners of all ages with low fees and no tryout. The best place to start and learn the game."
        },
        {
          "venue": "Travel / club ball",
          "how": "Tryout-based teams that travel to tournaments and showcases — the main recruiting pathway. More time and cost; ask local coaches or search USA Softball / your state's club directory to find teams near you."
        }
      ]
    },
    "recruiting": {
      "truth": "Here's the honest part: most players who love softball don't play in college, and that is completely fine. Playing through high school teaches you toughness, teamwork, and how to handle failure — skills that outlast the sport. If college ball is the goal, chase it with open eyes. If it's not, the game still gave you something real.",
      "timeline": [
        {
          "when": "Grades 7-9 (MS / early HS)",
          "doThis": "Build fundamentals and play as much as you can. Get on a club/travel team if you want to pursue recruiting. Keep your grades strong — academics open doors and money that athletics can't."
        },
        {
          "when": "Grades 9-10",
          "doThis": "Lock in your primary position, play strong travel/showcase events, and start a simple highlight reel. Begin a list of schools that fit you academically and athletically, not just by name."
        },
        {
          "when": "Grade 11",
          "doThis": "The key recruiting window. Attend camps and showcases, email coaches with your video, schedule, and GPA, and take unofficial visits. Be realistic about the division level that fits you."
        },
        {
          "when": "Grade 12",
          "doThis": "Finalize visits, compare offers (athletic and academic aid together), and choose the school where you'd be happy even if you got hurt and never played. Fit first."
        }
      ],
      "divisions": "College softball spans NCAA D1, D2, D3, NAIA, and junior college (NJCAA) — plus club teams that are real, competitive, and a great way to keep playing. Big news: the 2025-26 House settlement changed the scholarship rules. Sport-by-sport scholarship caps were replaced with roster limits, so older 'X scholarships per team' numbers are outdated — don't rely on them. The honest reality stays the same: most college athletes get partial aid or none, and full rides remain rare. Don't chase prestige. Chase fit, playing time, the right academic program, and a coach you trust. Always confirm current scholarship and roster limits for your division directly with the coaches recruiting you."
    },
    "health": {
      "injuries": "Most common are overuse and impact injuries — shoulder and elbow strain (especially for pitchers from the windmill motion), ankle and knee sprains from sliding and fielding, finger and wrist jams, and the occasional bruise from a hard-hit ball. Catchers also wear on their knees.",
      "prevention": "Warm up and throw progressively before going full speed — never max-effort cold. Learn correct throwing and pitching mechanics from a qualified coach; bad mechanics cause most arm injuries. Pitchers: follow a real arm-care routine (bands, shoulder strengthening) and respect pitch-count and rest limits — don't pitch through arm pain. Build overall strength and agility, take at least one rest day a week, and take a few weeks fully off throwing each year to recover.",
      "fuel": "Fuel to train, grow, and recover — eat ENOUGH, not less. Your body needs steady, balanced meals and snacks to power through long practices and tournament days. Hydrate before, during, and after — hot spring and summer games drain you fast. Prioritize sleep; it's when your body actually rebuilds. The goal is to fuel your body well so it can grow strong and durable — eat enough to grow, never to shrink. No calorie counting, no skipping meals, no weight goals.",
      "note": "Listen to your arm. Shoulder or elbow pain that lingers is a signal, not something to push through — tell a coach or parent and get it checked early. A small problem rested is far better than a big one that ends a season."
    },
    "character": {
      "trait": "Composure under pressure",
      "model": "Cat Osterman",
      "why": "One of the most respected pitchers in softball history, Osterman was known not just for her dominance but for her calm, professional poise in the circle and her gracious conduct as a longtime mentor and ambassador for the game. She showed that the best competitors stay composed — handling big moments and tough losses with the same steady class, and lifting up the next generation along the way."
    }
  },
  "volleyball": {
    "tagline": "Six players, one ball, and a rally that's never the same twice.",
    "overview": "Volleyball is a fast, technical team sport built on reading the play, precise touches, and trusting the five people around you. There's a fit for every kind of athlete: the setter who quarterbacks every point, the explosive hitter who finishes rallies, the middle who travels the net to block, the libero who reads a hitter and digs the ball off the floor. Height helps at the net, but it's nowhere near the whole game; ball control, court sense, footwork, and quickness win rallies, and the libero and defensive spots reward exactly those skills. You don't need a certain body to belong here. You need clean contacts you can repeat under pressure, good feet, and the willingness to communicate and cover for your teammates.",
    "season": {
      "practice": "A typical practice opens with a dynamic warmup and ballhandling (pepper, passing lines), then moves into skill work by phase: serving, passing/serve-receive, setting, hitting approaches, and blocking footwork. It usually builds into 6-on-6 wash drills and live scrimmage with scoring, plus serving under fatigue at the end. Expect heavy reps on passing and serve-receive at every level; the team that controls the first contact controls the match.",
      "arc": "Tryouts and preseason hit in late summer, building conditioning and installing the system and rotations. The school season runs fall (roughly 20-30+ matches) with practices most days and 1-2 matches a week, building toward conference, then district/regional/state brackets. Many players then roll into club season, which runs roughly winter through spring and is the heart of the recruiting calendar.",
      "commitment": "In season, expect 12-18+ hours a week between practices, matches, travel, and film; club tournament weekends are long days on your feet. Rest days are part of the plan, not a reward: jumping and hitting load up your knees and shoulder, and they adapt during recovery. Skipping rest is exactly how patellar tendinitis and shoulder overuse start. Build in real days off and listen when something nags."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Learn a platform pass (forearm passing) you can repeat, a clean overhand set with your fingers, and a consistent underhand or float serve that lands in. Learn to move your feet to the ball instead of reaching, call the ball loudly, and understand rotation, the three-contact rule, and basic court positions."
      },
      {
        "stage": "Developing",
        "focus": "Pass a served ball to target consistently, set off the net with control, and learn a four-step (or three-step) hitting approach with proper arm swing and timing. Start serving with intent to zones, read where the set is going on defense, and learn to base-and-read your block footwork. Get comfortable in serve-receive."
      },
      {
        "stage": "Intermediate",
        "focus": "Hit with shot variety (line, cross, high hands off the block, tips and rolls) instead of swinging full every time. Block as a unit and read hitters' shoulders and approach. As a setter, run a faster offense and disguise your sets; as a passer/libero, take a bigger seam and dig hard-driven balls. Film yourself to clean up footwork and arm swing."
      },
      {
        "stage": "Advanced",
        "focus": "Specialize in a position you play at a high level while staying a complete, reliable player. Read the whole court a beat early, terminate or dig balls others can't reach, serve aggressively under pressure, and run or anchor a system. Impact winning in the ways the box score misses: clean serve-receive, smart coverage, and calm communication when the gym is loud."
      }
    ],
    "roles": {
      "label": "Positions",
      "items": [
        {
          "name": "Outside Hitter (OH)",
          "blurb": "The all-around workhorse. Hits from the left front, passes in serve-receive, and plays back-row defense. Gets a high volume of swings, including the tough out-of-system ball. Lives on a reliable arm swing and consistency."
        },
        {
          "name": "Opposite / Right-Side Hitter",
          "blurb": "Attacks from the right front and is the primary blocker against the other team's outside. Often a powerful scorer and, in some systems, a second setting option. Lives on footwork, blocking range, and a heavy swing."
        },
        {
          "name": "Middle Blocker (MB)",
          "blurb": "The net traveler. Reads the setter and forms the block on every play, and attacks quick tempo sets in the middle. Demands fast footwork, timing, and the ability to make decisions in a split second. Effort and reading, not just height, make a middle."
        },
        {
          "name": "Setter",
          "blurb": "The floor general. Touches the second ball nearly every rally, runs the offense, decides who gets the ball and when, and disguises the play. Lives on soft hands, quick feet, court vision, and steady decision-making under pressure."
        },
        {
          "name": "Libero",
          "blurb": "The back-row specialist (different jersey). The best passer and digger on the team, anchoring serve-receive and defense. Cannot attack above the net or block, so it's a pure skill, reading, and ball-control position; quickness and grit matter far more than height."
        },
        {
          "name": "Defensive Specialist (DS)",
          "blurb": "A back-row defender and passer who subs in to shore up serve-receive and defense, and often to serve. A great role for a quick, scrappy player who reads the game and controls the ball; every winning team needs reliable passing off the bench."
        }
      ]
    },
    "mental": "Volleyball is a game of errors, and the scoreboard moves on every single one; you'll shank a pass, get stuffed, or miss a serve at the worst time, sometimes with everyone watching. What separates good players is the next ball: a short memory, eyes up, and quick reset to be ready when the serve comes again. Because it's rally scoring, momentum swings fast, so the steadiest team usually wins, not the most talented. Nerves are normal even for starters; lean on a routine (the same pre-serve breath and bounce) so your body knows what to do when your head gets loud. Being a great teammate is a skill you practice on purpose: call the ball loudly, celebrate a good dig as much as a kill, cover your hitter, stay ready on the bench, and own your error instead of pointing at the pass. Coaches and recruiters notice the player who keeps the group calm and connected.",
    "getStarted": {
      "steps": [
        "Get a ball and a wall (or a partner). Spend 15-20 minutes a day on platform passing and overhand setting against a wall; clean, repeatable contacts are the whole foundation.",
        "Learn the rules and watch the game with intent: notice serve-receive formations, how setters disguise the play, and where defenders move before the ball is even hit.",
        "Play and rep as much as you can. Pepper with a friend, open gyms, and grass/sand doubles all build ball control fast because you touch the ball constantly.",
        "Film yourself passing, setting, and approaching, then fix one habit at a time: your platform angle, your footwork to the ball, your arm swing.",
        "Find a team or program to play organized ball and get coached on rotations, systems, and reads."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Ask your PE teacher or athletic office when volleyball tryouts are (usually late summer for fall season). Show up in shape, knowing how to pass, set, and serve, and ready to communicate and hustle. Freshman, JV, and varsity levels mean there's often a spot to grow into."
        },
        {
          "venue": "Club / travel volleyball",
          "how": "Search for junior club programs in your area (often affiliated with USA Volleyball/AAU) and attend open tryouts, usually in the fall for a winter-spring season. This is the #1 recruiting pathway: club tournaments and qualifiers are where college coaches watch. Ask about cost, travel, and team level up front, and look for a program that develops players, not just collects them."
        },
        {
          "venue": "Rec & community leagues",
          "how": "Check your local rec center, YMCA, parks-and-rec, or school intramurals for youth and teen leagues. These are lower-cost, lower-pressure, and a great place to start, learn the game, and get reps without the club commitment."
        },
        {
          "venue": "Open gyms, sand & pickup",
          "how": "Many schools, rec centers, and beaches run open gyms or sand courts. Show up, get in a rotation, and play. Grass and sand doubles especially force you to do everything (pass, set, hit, defend), which makes you a far better indoor player."
        }
      ]
    },
    "recruiting": {
      "truth": "Be honest with yourself about the numbers: only a small fraction of high school volleyball players go on to play in college, and far fewer at the Division I level. That isn't a reason to quit; it's a reason to play for the love of it and keep your options open. Plenty of players thrive in D2, D3, NAIA, and JUCO, and many more keep playing club, sand, intramural, and rec leagues for the rest of their lives. College volleyball is a great goal; making it your only definition of success sets you up for heartbreak. Chase being the best, most reliable version of your game, take care of your body and your grades, and let recruiting follow.",
      "timeline": [
        {
          "when": "Freshman / Sophomore year",
          "doThis": "Play as much as you can (school plus club), build rock-solid fundamentals in passing, setting, and serving, and keep your grades strong. Academics open doors and money that athletics alone won't."
        },
        {
          "when": "Junior year",
          "doThis": "Get seen. Club is where it happens: compete at qualifiers and showcases, build a highlight and skills video, and email coaches at programs that fit you academically and athletically. Be realistic about which division and level match your game right now."
        },
        {
          "when": "Summer before / Senior year",
          "doThis": "Take official and unofficial visits, narrow your list by fit (playing time, position need, major, coaching staff, cost), and finalize academic eligibility through the NCAA/NAIA clearinghouse."
        },
        {
          "when": "Throughout",
          "doThis": "Stay coachable, communicative, and durable. Your reputation as a teammate and a passer who shows up every rally matters as much as your kill totals; coaches recruit character and consistency."
        }
      ],
      "divisions": "Here's the honest, current picture: starting with the 2025-26 school year, the old per-team scholarship caps were replaced by roster limits under the House v. NCAA settlement. That means a school can now offer full, partial, or no scholarship to any athlete up to its roster limit, so the familiar 'X scholarships per team' figures you'll find online are outdated. The reality on the ground hasn't flipped overnight: most college athletes still get partial aid or none, and full rides remain relatively rare and competitive, especially outside the top D1 women's programs. D2 and NAIA commonly blend partial athletic money with academic aid; D3 offers no athletic scholarships but strong academic and need-based aid at often-excellent schools; JUCO is a real path to develop, fix grades, and transfer up. Because the rules just changed, confirm the current roster and aid limits for your division and gender directly with college coaches, don't trust an old chart. The smartest move is unchanged: pick the level and school where you'll actually play, get a degree you want, and can afford. Fit and academics beat prestige every time."
    },
    "health": {
      "injuries": "Ankle sprains are the most common, usually from landing on a teammate's or blocker's foot at the net. Knee issues like patellar tendinitis ('jumper's knee') and shoulder overuse (from repeated hitting and serving) build up over a season, along with jammed fingers from blocking and contact. Overuse injuries climb fast when players skip rest.",
      "prevention": "Always do a dynamic warmup before play (leg swings, lunges, light jog, arm circles, then gradual jumping and swinging). Drill soft landing mechanics: land on both feet with bent knees and absorb the jump, and learn to land sideways off the net to avoid coming down on a foot. Strengthen your ankles, hips, and core, build single-leg balance, and work on jumping and decelerating under control. Take care of your hitting shoulder with rotator-cuff and scapular strength work, and respect rest and recovery days so tissue can adapt. Bracing or taping helps if you've sprained an ankle before.",
      "fuel": "Fuel your body to grow and compete, not to shrink it. Eat enough across the day, including long tournament days: balanced meals with carbs for energy, protein to repair muscle, plus fruits, vegetables, and healthy fats. Pack snacks for club weekends so you're not running on empty between matches. Hydrate before, during, and after, especially in hot gyms; bring water to every practice. Sleep is where you actually get better, so aim for a full night, 8-10 hours for teens. Eating enough and sleeping well will do more for your game than any supplement.",
      "note": "Take your shoulder and knees seriously over a long season; nagging pain that doesn't ease with rest is a signal to back off and get it checked, not to push through. And take any head contact (a hard collision or fall) seriously: if you feel dizzy, foggy, or get a headache, sit out and tell a coach or parent. There's no toughness award for hiding an injury."
    },
    "character": {
      "trait": "Composure and relentless team-first effort",
      "model": "Karch Kiraly",
      "why": "Kiraly is the only player to win Olympic gold in both indoor and beach volleyball, and what made him great wasn't just talent; it was his ball control, his relentless effort on defense, and his calm, demanding leadership. He was known for doing the unglamorous work (passing, digging, reading the game) at the highest level and for holding himself and his teammates to a standard of focus and class. He's a model for the truth that mastering the fundamentals, staying composed when the rally gets chaotic, and competing for your teammates is what builds both a great player and a great teammate."
    }
  },
  "tennis": {
    "tagline": "You and a racquet against the problem in front of you. No teammates to blame, no clock to hide behind, just whether you solve it.",
    "overview": "Tennis rewards problem-solvers, not body types. The best junior on your court might be tall and powerful or small and relentless. What every good player shares is racquet skill, footwork, and the patience to construct a point. It is one of the most globally played sports, which means deep talent but also a clear, public yardstick: your UTR (Universal Tennis Rating), a number from roughly 1 to 16 that travels with you and tells coaches exactly where you stand. You can start at any age and improve at any age. Progress comes from reps, smart coaching, and competitive matches, not from genetics. If you can grip a racquet and keep showing up, there is a place for you in this sport.",
    "season": {
      "practice": "In-season: 4-6 days/week mixing drilling, point play, and match-style practice sets, often with 1-2 days of conditioning or hitting baskets. Competitive juniors add private lessons. Build in at least 1 full rest day; growing bodies need recovery to absorb the work.",
      "arc": "High school season runs a single semester (spring in most states, fall in some). Serious players treat tennis as year-round: USTA junior tournaments cluster in summer and over breaks, with a winter indoor stretch. The off-season is for fixing technique and building strength, not just grinding matches.",
      "commitment": "Recreational: a few hours a week. High school team: daily practice plus matches. Tournament-track junior: 10-15+ hours/week including lessons, drilling, fitness, and weekend tournaments that can eat whole days. Protect sleep and at least one rest day no matter the level - chronic overuse, not talent, is what ends most junior careers early."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Continental and forehand grips, ready position, and consistent rallying. Goal: keep 10+ balls in play, serve into the box reliably, and move with split-steps instead of standing flat. Footwork over power."
      },
      {
        "stage": "Developing",
        "focus": "Reliable topspin forehand and backhand, a directable serve with first/second-serve thinking, and approach shots and volleys. Start playing USTA sanctioned matches to earn a real UTR. Learn to play a full match without falling apart mentally."
      },
      {
        "stage": "Advanced",
        "focus": "Weapons and patterns: a serve you can spot, a forehand you build points around, and the ability to change spin, depth, and pace on purpose. Develop a clear style and a B-plan when it stops working. Doubles tactics (poaching, court coverage) become real, and your UTR starts mattering to college coaches."
      }
    ],
    "roles": {
      "label": "Formats & playing styles",
      "items": [
        {
          "name": "Singles",
          "blurb": "You cover the whole court alone. Rewards fitness, shot tolerance, and the discipline to construct points rather than go for too much."
        },
        {
          "name": "Doubles",
          "blurb": "Two per side, heavier on serving, returning, net play, and communication. Often where college teams clinch dual matches - and a great path onto a roster if your singles UTR is borderline."
        },
        {
          "name": "Baseliner",
          "blurb": "Lives behind the baseline, wins with consistency, depth, and footwork. The most common modern style. Patient, grinding, hard to rush."
        },
        {
          "name": "Serve-and-volley / net-rusher",
          "blurb": "Pressures opponents by getting forward and finishing at the net. Rarer today, but a sharp weapon in doubles and on fast courts."
        },
        {
          "name": "All-court player",
          "blurb": "Comfortable everywhere - rallies from the baseline, comes in when the ball is short, mixes spins. The most adaptable style, and what most coaches hope to develop."
        }
      ]
    },
    "mental": "Tennis is the loneliest scoreboard in sports: no coaching during points in most junior matches, no teammate to bail you out, and a margin so thin that you can lose more points than your opponent and still win the match. That structure makes it a brutal but honest teacher of composure. The skill to build is resetting between points - a deep breath, a routine at the back fence, a short memory. You will play matches where your strokes feel perfect and you lose, and matches where everything is ugly and you win; learning to compete instead of to perform is the whole game. Treat every \"I'm choking\" or \"I can't close this out\" as information, not a verdict. The players who last are the ones who get curious about the next point instead of angry about the last one.",
    "getStarted": {
      "steps": [
        "Get on a court with a racquet that fits your hand and a can of balls - borrow or buy used to start. Take a group lesson or clinic at a local park, rec center, or club to learn grips and basic strokes correctly before bad habits set in.",
        "Build consistency before power: rally with a wall, a parent, a friend, or a ball machine and aim to keep the ball in play. Footwork and repetition beat trying to hit winners.",
        "Try out for your middle or high school team - most have no-cut or low-bar tryouts and welcome beginners, especially for doubles and JV.",
        "Create a UTR Sports profile (free). It becomes your competitive identity the moment you play rated matches.",
        "Enter a USTA sanctioned junior tournament in your age division to get your first real UTR and a regional ranking. Play up when you can handle it - matches against better players raise your rating faster than easy wins."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Ask the athletic office or a PE teacher when tryouts are. Many programs run spring (or fall) and take JV players at any level. Show up to the interest meeting and bring a racquet."
        },
        {
          "venue": "Club / academy",
          "how": "Search local tennis clubs and junior academies for group clinics by level (beginner, intermediate, high-performance). Most offer trial lessons. This is where year-round players train and where coaches help you enter tournaments."
        },
        {
          "venue": "Rec / community",
          "how": "City Parks & Rec departments, YMCAs, and public courts run cheap or free clinics, ladders, and 'Net Generation' (USTA youth) programs. The lowest-cost on-ramp to find hitting partners and a coach."
        },
        {
          "venue": "USTA",
          "how": "Make a free UTR Sports profile and a USTA membership, then find sanctioned junior tournaments and local leagues by zip code. This is how you turn practice into a ranking coaches can see."
        }
      ]
    },
    "recruiting": {
      "truth": "The honest math: the large majority of high school tennis players do not play in college, and that is completely fine. Tennis can be a sport you love and play well for the rest of your life - in leagues, on weekends, at the gym you join in your 40s - whether or not a college coach ever calls. If you do want to play in college, your UTR is the single most important number; recruiting is increasingly transparent because coaches can look you up in seconds. Pursue it because you love competing, not because you expect it to pay for school.",
      "timeline": [
        {
          "when": "Freshman / Sophomore (9-10)",
          "doThis": "Play. Get a real UTR by entering USTA sanctioned tournaments, raise it through competitive matches, and build your game and fitness. Keep grades strong - academics widen your options more than any forehand. No need to contact coaches yet."
        },
        {
          "when": "Junior year (11)",
          "doThis": "The key recruiting year. Build a target list of programs that match your UTR honestly (coaches list current player ratings - aim where you'd actually compete). Email coaches with your UTR, schedule, video, and academics. Play national-level tournaments if you're chasing higher divisions, and take official/unofficial visits."
        },
        {
          "when": "Senior year (12)",
          "doThis": "Finalize fit, narrow offers, and confirm what aid each program can actually put together for your division - rules changed in 2025-26, so ask coaches directly. Keep your UTR up and your grades steady through signing. Less competitive divisions recruit later, so keep options open."
        },
        {
          "when": "Throughout",
          "doThis": "Be coachable, be honest about your level, and prioritize a school you'd be happy at without tennis. Injuries, burnout, and recruiting reality all change fast - a great academic fit protects you when sport plans shift."
        }
      ],
      "divisions": "College tennis runs across NCAA D1, D2, D3, NAIA, and junior colleges, plus men's and women's programs. UTR ranges loosely sort the levels (top D1 lineups are very high, with strong tennis at every tier below), but fit matters more than prestige: playing time, the coach, the academics, and the cost you can actually afford. Here is the part that recently changed - the House v. NCAA settlement took effect for 2025-26 and replaced the old per-team scholarship caps (you may have seen figures like '4.5 for men, 8 for women' - those are outdated) with roster limits. Schools can now offer full, partial, or no aid to any player up to the roster limit, but most college athletes receive partial aid or none, and full rides remain rare in tennis. D3 and the Ivies offer no athletic scholarships at all but often strong academic and need-based aid. Don't trust old scholarship numbers online - ask each coach what they can actually offer for your division in the current year, and weigh academic aid alongside it."
    },
    "health": {
      "injuries": "Overuse injuries dominate: tennis elbow (lateral epicondylitis) and wrist strain from repetitive impact and grip, rotator cuff and shoulder issues from serving, and lower-body problems like ankle sprains, knee pain, and stress injuries from constant stop-start movement. Lower-back strain is common from the serve and trunk rotation.",
      "prevention": "Use sound grip technique and properly strung, correctly sized equipment - many elbow problems are technique or gear, not effort. Warm up and do dynamic movement prep before hitting; cool down after. Build forearm, shoulder (rotator cuff), core, and leg strength so your joints aren't carrying the load alone. Respect rest days and don't spike your hours suddenly; if something hurts on every serve or backhand, stop and get it checked early rather than playing through it.",
      "fuel": "Fuel to play and to grow. Tennis matches can run hours in the heat, so eat enough - balanced meals with carbs for energy, protein to repair, and fruits and vegetables across the day - and never train on empty. Hydrate before, during, and after; bring water (and electrolytes for long hot matches) and sip on every changeover. The goal is to eat enough to grow and recover, not to shrink. Prioritize 8-10 hours of sleep - it is when your body actually builds the strength and skill you practiced.",
      "note": "Heat is a real hazard in tennis - long outdoor matches cause cramping and heat illness. Learn the early signs (dizziness, cramping, nausea), use changeovers to cool and drink, and never tough out heat symptoms to finish a match. Your durability over years matters far more than any single result."
    },
    "character": {
      "trait": "Composure and self-honesty under pressure",
      "model": "Roger Federer",
      "why": "Federer is widely respected not just for how he played but for how he conducted himself - calm under pressure, gracious in defeat, and known for sportsmanship across a 20-plus-year career. He had a famously hot temper as a junior and openly talks about learning to master it; that arc is the useful one for a teen. In a sport with no coaching mid-match and a scoreboard that exposes you, the model isn't to never feel rattled - it's to reset, respect your opponent, and call your own lines honestly when no referee is watching."
    }
  },
  "golf": {
    "tagline": "A game you can play for life - and one where your scorecard, not your size, decides everything.",
    "overview": "Golf is an individual stroke-play sport: you against the course, every shot counting, no one to hide behind and no one to blame. That honesty is the appeal. Anyone can play it - tall or short, lean or strong, fast or not - because the game rewards control, patience, and good decisions over raw athleticism. In high school you compete individually but your scores often combine into a team total. In college, the team format sharpens: a lineup of 5 plays, and the best 4 scores count. It has one of the strongest academic cultures in sports and travels with you into adulthood, business, and family long after most sports stop. You do not need a country club to start - public courses, ranges, and junior programs exist exactly for new players. What you do need is a willingness to practice the unglamorous parts and keep your head when a hole goes wrong.",
    "season": {
      "practice": "Range and short-game work most days in season, plus play (9-18 holes) when you can. A common week: 2-3 full-swing range sessions, 2-3 short-game/putting sessions, 1-2 rounds on course. Quality reps beat ball-beating - 50 focused balls with a target beats 200 mindless ones.",
      "arc": "High school golf is typically a fall or spring season depending on your state and gender; serious junior players compete in tournaments year-round (AJGA, state and local junior tours) outside the school season. Off-season is for swing changes, strength and mobility work, and building your tournament resume.",
      "commitment": "Plan on most days touching the game in season, but build in 1-2 real rest days a week - your back, wrists, and focus all need recovery. More is not better if your body is breaking down or your practice has gone mindless. Walking 18 holes is real physical load; respect it."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Learn a safe, repeatable grip, posture, and setup. Make solid contact and get the ball airborne consistently. Learn the rules and on-course etiquette (pace, where to stand, repairing the green). Start putting and chipping early - that is where scores actually live."
      },
      {
        "stage": "Developing",
        "focus": "Build a reliable full swing and start shaping a short game. Establish a verified handicap index by posting real scores. Play your first local junior events. Learn course management - aiming at the fat part of the green, laying up when smart, avoiding the big number."
      },
      {
        "stage": "Competitive",
        "focus": "Get your handicap into the single digits. Compete in state and regional junior events and start AJGA. Sharpen wedge distances, putting under pressure, and your pre-shot routine. Learn to score on bad-swing days - that is the skill that wins."
      },
      {
        "stage": "Advanced / recruitable",
        "focus": "Consistent low scores in real tournament conditions, a verified low handicap, and ranked junior results (AJGA, state rankings). A repeatable routine, mental steadiness over 36-hole events, and the maturity to manage your own schedule and travel."
      }
    ],
    "roles": {
      "label": "Formats and parts of the game (golf has no positions - master these instead)",
      "items": [
        {
          "name": "Stroke play",
          "blurb": "The standard format: every shot counts, lowest total wins. Rewards consistency and avoiding disaster holes. This is what most junior and college events use."
        },
        {
          "name": "Match play",
          "blurb": "You compete hole-by-hole against one opponent; win more holes, win the match. More aggressive and strategic - a blow-up hole only costs you one hole, not your whole round."
        },
        {
          "name": "Driving",
          "blurb": "Getting the ball in play off the tee. Distance helps, but position and keeping it in the fairway matter more than raw power for scoring."
        },
        {
          "name": "Irons / approach play",
          "blurb": "Hitting greens from distance and controlling where the ball lands. The bridge between a good drive and a makeable putt."
        },
        {
          "name": "Short game",
          "blurb": "Chipping, pitching, and bunker play around the green. This is where amateurs lose the most strokes and where you can score fastest with practice - no athleticism required, just reps."
        },
        {
          "name": "Putting & course management",
          "blurb": "Putting is nearly half your strokes; course management is deciding the smart shot, not just the heroic one. Together they separate good ball-strikers from low scorers."
        }
      ]
    },
    "mental": "Golf is the most exposed mental game in sports - every mistake is yours alone, visible on the card, with minutes to stew before the next shot. The players who last learn to treat each shot as its own event: hit it, accept it, move on. A bad hole is not a bad round until you let it be. Build a consistent pre-shot routine so pressure has something steady to land on. Expect frustration - it is built into the game - and judge yourself on your process and your composure, not just the number. The discipline you build standing over a 4-foot putt with everything on the line transfers directly to tests, interviews, and hard conversations for the rest of your life.",
    "getStarted": {
      "steps": [
        "Get to a range or short-game area and take 2-3 lessons from a PGA professional to build a safe grip and setup early - it is far easier than fixing bad habits later.",
        "Learn the rules and etiquette before your first round (pace of play, where to stand, fixing your marks). It shows respect and makes playing with others easy.",
        "Start a verified handicap by posting your real scores through a GHIN account (ask a local course or junior program how to set one up). Recruiters and tournaments rely on it.",
        "Spend at least half your practice on putting and the short game - it lowers scores faster than chasing distance.",
        "Play actual rounds, not just the range. On-course scoring, course management, and nerves are different skills than hitting balls."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Most high schools have a golf team; ask the athletic office or a coach about tryouts and the season. Many will help a beginner who shows up coachable and on time."
        },
        {
          "venue": "Junior golf programs / club",
          "how": "Local courses, First Tee chapters, and junior tours run clinics and events for new and improving players. First Tee is built for beginners and teaches the game plus life skills affordably."
        },
        {
          "venue": "Public course / rec",
          "how": "Public and municipal courses offer affordable junior rates, range access, and group lessons - no membership needed. This is the cheapest honest on-ramp into the game."
        }
      ]
    },
    "recruiting": {
      "truth": "Most junior golfers do not play in college - and that is completely fine. Golf is a lifetime game; the round you play at 50 matters more than whether you made a college roster at 18. If college golf is the goal, recruiting runs on cold numbers - a verified handicap index, tournament scoring average, and ranked junior results - which makes it one of the more transparent recruiting paths. Chase fit and academics over a famous logo.",
      "timeline": [
        {
          "when": "9th-10th grade",
          "doThis": "Establish and lower your verified handicap. Play local and state junior events to learn tournament golf. Build the academic record - golf programs care about grades, and good ones open doors."
        },
        {
          "when": "11th grade",
          "doThis": "Play a competitive tournament schedule (state events, regional tours, AJGA if your scores qualify). Build a simple recruiting profile with your handicap, scoring average, and results. Start emailing coaches at realistic-fit schools with your numbers and schedule."
        },
        {
          "when": "12th grade",
          "doThis": "Keep competing and posting scores, take official/unofficial visits, and weigh offers by academic fit, coach relationship, and where you would actually be happy - not prestige. Confirm current scholarship and roster rules directly with each coach."
        }
      ],
      "divisions": "The rules changed for 2025-26 under the House settlement: the old sport-by-sport scholarship caps (the per-team numbers golf used to quote) are gone, replaced by roster limits. A school can now give full, partial, or no aid to any player up to its roster limit. In practice, most college golfers receive partial aid or none, and full rides remain rare - golf money is usually split across a roster. Across D1, D2, D3, NAIA, and junior college there is a fit for a wide range of players; D3 offers no athletic scholarships but often strong academic aid. Do not assume any specific number - confirm current limits for your division and school directly with the coach, and weigh academics and fit first."
    },
    "health": {
      "injuries": "Lower-back strain, lead-wrist and elbow tendon issues, and shoulder irritation - mostly overuse from repetitive swinging and from ball-beating with poor mechanics.",
      "prevention": "Build core and hip strength and rotational mobility, warm up before you swing hard, and get your swing mechanics checked - efficient technique protects your back. Vary your practice so you are not pounding hundreds of identical reps, and take real rest days when something aches. Pain in the back, wrist, or elbow is a signal to stop and recover, not push through.",
      "fuel": "Fuel to grow and to last 18 holes on your feet - eat ENOUGH across regular meals and snacks, especially before and during a long round. Bring food and water onto the course; a round can be 4-5 hours in the sun, so hydrate steadily and snack on the back nine to keep your focus and energy up. Prioritize sleep and real recovery between practice and tournament days. Eat to grow and play well, never to shrink - no calorie counting, no weight goals, just enough good fuel to keep your body and mind sharp.",
      "note": "Sun protection matters in golf more than almost any sport - hat, sunscreen, and sunglasses on every round. Heat and dehydration quietly wreck scores and health over a long day, so manage them before you feel them."
    },
    "character": {
      "trait": "Honesty and self-governed integrity",
      "model": "Bobby Jones",
      "why": "Golf is the only major sport where players routinely call penalties on themselves, even when no one else saw. Bobby Jones famously penalized himself a stroke in a U.S. Open when his ball moved - a stroke that may have cost him the title - and when praised, said you might as well praise a man for not robbing a bank. That is the standard golf still holds: you are accountable to the rules even when it costs you and no one is watching. Living that on the course builds the kind of integrity that defines you everywhere else."
    }
  },
  "lacrosse": {
    "tagline": "A field-running, stick-skill team sport where smarts and effort beat size.",
    "overview": "Lacrosse is a fast, transition-heavy team sport built on stick skills, field vision, and conditioning. Two things to know up front. First, men's and women's lacrosse are genuinely different games. Men's is full-contact with helmet, gloves, and pads, and allows body checking. Women's is limited-contact with no body checking and lighter gear (eyewear and mouthguard, plus a different stick and rules). They are not the same sport with different uniforms. Second, no body type owns this game. Quick, smaller players thrive at attack and midfield; rangy players dominate defense and win balls in the air; goalies are made of reaction time and nerve. What carries you is clean stick work with both hands, the conditioning to run for a full game, and the lacrosse IQ to read the field. Skill beats size here, and skill is trainable. A wall and a stick will take a beginner further than any growth spurt.",
    "season": {
      "practice": "In-season: practice 4-5 days a week (90 min to 2 hours) plus 1-2 games. Expect wall ball, line drills, ground-ball work, transition, and full-field scrimmage. Off-season is where stick skills and conditioning actually get built - wall ball almost daily, plus club ball and showcases for older players.",
      "arc": "High school spring season runs roughly Feb-May. Club/travel season layers on top in summer and fall, which is when most college recruiting happens. Many serious players play 9-11 months a year split across school and club - guard against burnout by protecting a true off-stretch.",
      "commitment": "A committed high-schooler trains most days, but you need at least 1-2 full rest days every week and a few weeks fully off the stick each year. Rest is when your body actually adapts and your joints recover. More reps on a tired body is how overuse injuries and burnout happen, not how you get better."
    },
    "progression": [
      {
        "stage": "Beginner (new to the stick)",
        "focus": "Learn to cradle, throw, and catch with your dominant hand, then immediately start your off-hand. Wall ball is everything - 50-100 reps a day builds more than any drill. Learn ground balls (low, two hands, scoop through it) and basic field positioning. Get the rules for YOUR game (men's vs women's) clear."
      },
      {
        "stage": "Developing",
        "focus": "Off-hand becomes reliable under light pressure. Add dodging, shooting on the run, and off-ball movement. Goalies drill footwork and arc; defenders learn approach and positioning over slashing. Start playing real game situations so decisions get faster."
      },
      {
        "stage": "Competitive (varsity/club)",
        "focus": "Both hands are weapons. You read defenses, win ground-ball battles, and play your role inside a team system. Conditioning lets you compete late in games. This is the level where film study and IQ separate players more than athleticism."
      },
      {
        "stage": "Advanced (recruitable)",
        "focus": "Polished, position-specific skill and consistency under pressure. You impact games in transition and in the clutch, communicate on the field, and perform at club tournaments and showcases where coaches watch. Reliability and decision-making set you apart."
      }
    ],
    "roles": {
      "label": "Positions",
      "items": [
        {
          "name": "Attack",
          "blurb": "Lives near the opponent's goal. Job is to score and feed. Needs both hands, dodging, vision, and finishing under pressure. Quickness and stick skill matter far more than size."
        },
        {
          "name": "Midfield",
          "blurb": "Runs the whole field, plays both offense and defense, and lives in transition. The conditioning position - endurance and two-way IQ are the price of entry. Often the most positionally flexible role."
        },
        {
          "name": "Defense",
          "blurb": "Stops the other team's best scorers. In men's play, uses the long pole, body positioning, and checks; in women's, uses footwork, angles, and stick checks within the limited-contact rules. Communication and discipline over reckless aggression."
        },
        {
          "name": "Goalie",
          "blurb": "Last line of defense and the loudest voice on the field. Lives on reaction time, fearlessness, and footwork, and runs the defense by directing it. A great goalie wins games and is always in demand."
        },
        {
          "name": "Specialists (men's: FOGO / women's: draw)",
          "blurb": "Men's faceoff specialists (FOGO) win possessions at the X; women's draw specialists win the draw control at the center. Possession is a hidden superpower - winning these reps changes games and is a recruitable skill on its own."
        }
      ]
    },
    "mental": "Lacrosse moves fast and punishes hesitation, so the mental game is real. You will throw the ball away, get beat, or let in a goal - everyone does. The players who get better are the ones with a short memory: next play, next ground ball, reset. Wall ball is a quiet discipline test - the kids who put in unseen reps are the ones who look effortless on Saturday. Learn to control what you can (effort, hustle to ground balls, communication) and let go of what you can't (a ref's call, a bad bounce). Lean on teammates and coaches when you're frustrated. If the sport ever stops being something you look forward to, that's worth talking about with someone you trust - this is a game, and it's supposed to add to your life, not drain it.",
    "getStarted": {
      "steps": [
        "Figure out which game you're playing - men's (full-contact) or women's (limited-contact). The rules, sticks, and gear differ, so get the right basics from the start.",
        "Get a stick and a ball and find a wall. Wall ball is the single highest-value thing a beginner can do. Start with your dominant hand, then force the off-hand early.",
        "Learn to scoop ground balls and cradle while moving. Possession in lacrosse comes from ground balls, and beginners who hustle to loose balls play immediately.",
        "Borrow or buy entry-level gear - many programs and rec leagues have loaner gear so you don't have to invest before you know you love it.",
        "Join a team (school, club, or rec) and tell the coach you're new. Coaches expect to teach fundamentals and value coachable, hardworking beginners."
      ],
      "findTeam": [
        {
          "venue": "School team",
          "how": "Ask your PE teacher, athletic director, or the lacrosse coach about tryouts and the spring schedule. No-cut JV and developmental programs exist at many schools - just show up willing to learn."
        },
        {
          "venue": "Club / travel team",
          "how": "Search US Lacrosse / USA Lacrosse and local club programs in your area. Club is the main recruiting pathway for older players, but many clubs also run beginner and developmental teams. Expect tryouts and travel costs - ask about financial aid, which many clubs offer."
        },
        {
          "venue": "Rec / community league",
          "how": "Check your city parks department, YMCA, or a local youth lacrosse association. Rec leagues are the lowest-pressure, lowest-cost way to learn the game and often supply loaner gear."
        }
      ]
    },
    "recruiting": {
      "truth": "Most people who play high school lacrosse do not play in college, and that is completely fine. Lacrosse gives you conditioning, teammates, stick skills, and grit you keep for life whether or not you ever play past 12th grade. Play because you love the game, not only to chase a roster spot.",
      "timeline": [
        {
          "when": "9th-10th grade",
          "doThis": "Build skill and play - school plus a club team if you can. Master your off-hand. Keep grades strong; academics open more doors (and more aid) than most athletes expect. No need to stress about contacting coaches yet."
        },
        {
          "when": "10th-11th grade",
          "doThis": "Play club and attend tournaments and showcases where college coaches actually watch - this is lacrosse's primary recruiting stage. Make a simple highlight clip, build a target list of schools that fit you academically and athletically, and start emailing coaches with your schedule and film."
        },
        {
          "when": "11th-12th grade",
          "doThis": "Take official/unofficial visits, keep communicating with coaches who show real interest, and be honest about where you'd genuinely fit and play. Confirm current scholarship and roster rules directly with each program (the rules changed recently - see below). Have an academic backup plan."
        }
      ],
      "divisions": "The college landscape changed for 2025-26 under the House v. NCAA settlement. The old per-team scholarship caps (the kind of '12.6 for men, 12 for women' figures you may have seen) no longer work the way they used to - sport-by-sport scholarship limits were replaced by roster limits, and a school can now offer full, partial, or no aid to any athlete up to its roster limit. What hasn't changed: most college lacrosse players receive partial aid or none, and full rides remain rare. Don't chase a number or a prestige logo. Chase fit - a program where you'll actually play, that's strong academically for what you want to study, and where you can picture yourself happy for four years. D1, D2, D3, NAIA, and club lacrosse all offer great experiences; D3 gives no athletic scholarships but often strong academic aid. Always confirm current scholarship and roster rules for your division directly with the coaches recruiting you."
    },
    "health": {
      "injuries": "Most common: concussions (especially in men's contact, but possible in both games), shoulder and wrist injuries, ankle sprains and knee injuries (ACL risk is notable in women's lacrosse), and the bruises and overuse aches that come with a long, run-heavy season.",
      "prevention": "Wear properly fitted gear and a current mouthguard, and never play through a suspected concussion - report head injuries immediately and follow a real return-to-play protocol cleared by a medical professional. Warm up and do dynamic prep before practice. Build conditioning gradually and include knee/ankle stability and neck-strengthening work (both lower ACL and concussion risk). Clean stick skills reduce reckless contact. Respect rest days so overuse injuries don't pile up.",
      "fuel": "Eat ENOUGH to fuel long runs and keep growing - lacrosse burns a lot over a full game. Build plates around carbs for energy, protein to recover, and plenty of fruits and vegetables, and eat regularly across the day. Hydrate before, during, and after (spring and summer heat is real), and sleep 8-10 hours so your body actually adapts. Eat to grow and play strong, not to shrink. This isn't a weight-class sport - your weight is just a fact, never a goal or something to track. If food or your body ever feels stressful, talk to a parent, coach, or doctor.",
      "note": "Tell a coach or athletic trainer about pain early instead of hiding it - especially anything to do with your head. A small issue caught now is a problem you avoid later, and there's no toughness in playing hurt."
    },
    "character": {
      "trait": "Selfless leadership and class",
      "model": "Paul Rabil",
      "why": "Rabil is one of the most accomplished and recognizable lacrosse players ever, but he's most respected for how he carried himself - relentless work ethic, sportsmanship, and growing the game for everyone by co-founding a professional league and teaching his craft openly. He models that you can compete ferociously and still lift up the sport and the people around you. That's the trait worth copying: be the player whose effort and conduct make the whole team better."
    }
  },
  "hockey": {
    "tagline": "Fast, physical, and skilled - hockey rewards work ethic and never stops teaching you.",
    "overview": "Ice hockey is a team contact sport built on skating, puck skill, and reading the game at speed. It asks a lot - learning to skate well takes real time and patience - but it gives back teamwork, toughness, and a sport you can play for life. There's a place on the ice for every kind of player: the fast skater, the smart passer, the steady defender, the calm goalie. Skill, hockey sense, and effort matter far more than how big you are - players of all sizes and builds succeed at every level. If you love being part of a team and you're willing to put in the reps, you can play this game.",
    "season": {
      "practice": "Club/travel teams typically practice 2-4 times a week with games on weekends; high school seasons run through the winter. Add skating, stickhandling, and off-ice training as you progress, but always build in days off.",
      "arc": "Winter is the main season (roughly November-March for high school), often with fall tryouts and spring/summer skills, camps, and optional spring leagues. Many serious players also do dryland and skating in the off-season.",
      "commitment": "Real but flexible - rec hockey can be one practice and a game a week, while travel and high school hockey is a multi-day commitment. Protect at least 1-2 full rest days a week, and take a few weeks off the ice each year to let your body and mind recover. More ice time is not always better."
    },
    "progression": [
      {
        "stage": "Beginner",
        "focus": "Learn to skate first - forward, backward, stopping, and edges. Get comfortable on the ice, learn basic puck handling, and understand the rules and positions. Borrow or rent gear before buying."
      },
      {
        "stage": "Developing",
        "focus": "Build crossovers, tighter turns, and a quick first step. Work on passing, receiving, and a basic wrist and snap shot. Start reading the game - support the puck, get open, and play your position."
      },
      {
        "stage": "Competitive",
        "focus": "Sharpen edge work, shooting in stride, and decision-making at game speed. Learn systems (forecheck, breakouts, defensive coverage), play both ways, and compete in battles and on special teams."
      },
      {
        "stage": "Advanced",
        "focus": "Refine pace, hockey IQ, and consistency shift to shift. Specialize where you're strongest, add strength and agility through smart off-ice training, and play up against tougher competition to keep growing - skill and reads, not size."
      }
    ],
    "roles": {
      "label": "Positions",
      "items": [
        {
          "name": "Center (C)",
          "blurb": "The forward who plays the middle of the ice end to end, takes faceoffs, and links offense and defense. Rewards two-way effort, vision, and conditioning."
        },
        {
          "name": "Winger (LW/RW)",
          "blurb": "Plays the wings and the boards, drives the net, and finishes chances. Rewards speed, a quick shot, and battling for pucks along the wall."
        },
        {
          "name": "Defenseman (D)",
          "blurb": "Defends the rush, moves the puck out cleanly, and runs the play from the blue line. Needs strong backward skating, good gaps, and composure under pressure."
        },
        {
          "name": "Goaltender (G)",
          "blurb": "The last line - tracks the puck, controls rebounds, and stays calm when shots come. A specialized position with its own technique, gear, and mindset."
        }
      ]
    },
    "mental": "Hockey moves fast and doesn't wait for you to feel ready - mistakes happen in front of everyone, and the next shift comes whether the last one went well or not. The mental game is learning to reset quickly: short memory after a bad play, next-shift focus, and trust in your training. It teaches composure under contact, reading the game instead of just reacting, and the team-first habit of doing the unglamorous work - backchecking, blocking shots, finishing checks clean. Handling a coach's feedback, sitting a shift, and bouncing back builds resilience that lasts well beyond the rink.",
    "getStarted": {
      "steps": [
        "Take a learn-to-skate or learn-to-play hockey program - skating is the foundation, and most rinks and youth associations run beginner sessions.",
        "Borrow or rent gear to start. A helmet with a cage, gloves, shin/elbow/shoulder pads, skates, and a stick are the basics - don't buy everything new until you know you're sticking with it.",
        "Get on the ice often: public skates, stick-and-puck sessions, and drop-in games all build comfort and confidence faster than anything else.",
        "Join a beginner or house-league team to start playing real games at your level, and ask coaches what to work on next.",
        "As you improve, look into travel/AAA, high school, or prep hockey - and remember strong skating and hockey sense open more doors than chasing the highest level too early."
      ],
      "findTeam": [
        {
          "venue": "School",
          "how": "Many high schools field hockey teams or co-op with nearby schools - ask the athletic office about tryouts, club teams, or how to get on a co-op roster."
        },
        {
          "venue": "Club / Travel",
          "how": "Local youth hockey associations and travel clubs run teams at every level from house league to AAA. Look up your area's association or USA Hockey to find registration and tryout dates."
        },
        {
          "venue": "Rec / Drop-in",
          "how": "Most rinks run house leagues and drop-in 'stick time' or pickup skates for all ages and levels - the lowest-pressure way to start playing and improving."
        }
      ]
    },
    "recruiting": {
      "truth": "Most players who love hockey will not play in college, and that is completely fine. Hockey is worth playing for the team, the skills, and the lifelong love of the game - not just as a path to a scholarship. College spots are limited and recruiting is competitive, so play because you love it, keep your grades strong, and let the rest follow.",
      "timeline": [
        {
          "when": "Grades 9-10",
          "doThis": "Focus on getting better and playing as much as you can - skating, skills, and game reps. Keep your grades up from day one; academics open as many doors as hockey does. Play at a level that challenges and develops you."
        },
        {
          "when": "Grade 11",
          "doThis": "Hockey's recruiting clock runs later than most sports - many players develop in juniors after high school. If college is a real goal, talk honestly with your coach about fit, keep current game film, and start emailing coaches at programs that match you academically and athletically."
        },
        {
          "when": "Grade 12 / post-grad",
          "doThis": "Many committed players spend a year or two in junior hockey before college. Choose your next step - school, prep, or juniors - based on development and academic fit, and confirm current eligibility and roster rules directly with college coaches."
        }
      ],
      "divisions": "College hockey runs across NCAA Division I and Division III plus ACHA (club) hockey, and the typical path runs through junior leagues like the USHL and NAHL or strong prep programs. A major recent change: starting in 2025-26, players in the major-junior CHL (OHL, WHL, QMJHL) can keep NCAA Division I eligibility - previously they were treated as professionals and barred (note: this applies to D1, not D3). Also new for 2025-26, the House settlement replaced fixed per-team scholarship caps with roster limits, so schools can give full, partial, or no aid to any rostered player. Older 'X scholarships per team' figures (like the old 18 for men's D1) are outdated. The honest reality: most college athletes get partial aid or none, full rides are rare, and the rules are changing - so confirm current limits for your division and level directly with coaches. Chase fit and academics over prestige; the right program is one where you'll play, develop, and get a degree you value."
    },
    "health": {
      "injuries": "Concussions are the most important risk in a contact sport - take any head injury seriously. Shoulder, wrist (from falls and board contact), knee, and hand injuries are also common, along with cuts and bruises.",
      "prevention": "Wear properly fitted, certified gear every time, including a helmet with a cage or shield and a mouthguard. Learn legal body contact and how to take and give a check safely, build neck, core, and leg strength, and never play through a suspected concussion - report it and get cleared by a medical professional before returning.",
      "fuel": "Fuel to grow and play, not to shrink. Eat enough balanced food - carbs for energy, protein to recover, fruits and vegetables - especially around practices and games, which burn a lot in the cold. Hydrate before, during, and after ice time (you sweat more than you think under all that gear), and prioritize sleep and rest days so your body can recover and develop.",
      "note": "Hockey gear is expensive and grows with you - check used-gear swaps and association loaner programs. Get skates fitted properly; bad-fitting skates cause blisters and hold back your skating more than anything else."
    },
    "character": {
      "trait": "Selfless team-first leadership",
      "model": "Sidney Crosby",
      "why": "One of the best players of his generation, Crosby is widely respected for his relentless work ethic, accountability, and putting the team before personal stats. He's known for leading by example, staying composed and professional under enormous pressure, and treating the game and his teammates with respect - the kind of conduct any young player can learn from."
    }
  }
};

/* ── Beyond the Game (Phase V Part 2) ─────────────────────────
   Per-sport "beyond the game" content: the honest HS->college->pro odds
   (web-verified vs NCAA data; empowering realism, never dream-crushing), the
   athlete-education mission gem, and secular character/leadership role models.
   Own map so SPORT_DETAIL stays byte-identical; rendered as the closing deep-
   sheet section + the count-up funnel (built on the shared sports-fx layer). */
const SPORT_BTG = {
  "football": {
    "oddsTruth": "Here's the honest math, and it's good news, not bad: of all the kids who play high school football, only a small slice play in college, and a tiny slice of those ever play a down in the NFL. Read that and feel free, not small. Going pro is a long-shot bonus, never the point. You are not playing to beat the odds -- you're playing for what football builds in you right now: discipline, toughness, brotherhood, and a body and mind that work. If the NFL never calls, you did not fail. The kid who gives everything to this game and walks away stronger, with a degree and real friends, won. That's the win that's actually on the table.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~1 million",
        "of": "boys play football nationwide each year"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~7%",
        "of": "of HS players go on to play NCAA football"
      },
      {
        "tier": "Get drafted to the NFL",
        "figure": "~1.6%",
        "of": "of NCAA players are drafted to the pros"
      }
    ],
    "education": "This is the real prize: football opens the door to college. Scholarships and recruiting attention can put you on a campus and in a classroom you might not have reached otherwise -- that degree and that network outlast any highlight reel. And the game itself trains things employers and life reward: showing up early, taking coaching, leading a unit, bouncing back from a bad play, and trusting teammates to do their job so you can do yours. You carry every bit of that off the field, no matter how far you go on it.",
    "roleModels": [
      {
        "name": "Peyton Manning",
        "for": "Relentless preparation and film study, treating teammates and opponents with respect, and becoming a steady, generous leader and mentor long after his playing days."
      },
      {
        "name": "Russell Wilson",
        "for": "Composure under pressure, an upbeat leadership style that lifts the room, and consistent work with youth and hospital charities off the field."
      },
      {
        "name": "J.J. Watt",
        "for": "All-out work ethic and the way he carries himself -- famously rallying massive disaster-relief efforts and quietly helping people, leading by example more than by talk."
      }
    ]
  },
  "basketball": {
    "oddsTruth": "Here's the honest truth, and it should make you feel free, not small: almost nobody who plays basketball plays it for a living, and that's completely okay. The pros are a lottery-ticket bonus on top of everything the game already gives you - not the reason to lace up. Read the numbers below clear-eyed. They aren't a verdict on you; they're just how rare the pro tier is. If you never make it past your high school gym, you have not failed at anything. The real win is who you become from showing up, working hard, and competing - and that's a win you get to keep no matter what level you reach.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~540,000",
        "of": "boys playing nationwide (girls add ~356,000 more)"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~3.6% / ~4.7%",
        "of": "of HS players reach the NCAA (men / women)"
      },
      {
        "tier": "Get drafted to the pros",
        "figure": "~1.0% / ~0.8%",
        "of": "of NCAA players are drafted (NBA / WNBA)"
      }
    ],
    "education": "The biggest door basketball can open isn't the NBA - it's a classroom. A roster spot can come with a scholarship, and that scholarship is really access to an education and a degree you keep for life, long after your last game. And the things the game drills into you - discipline, reading a situation fast, trusting teammates, staying composed when you're down, doing the unglamorous reps - those are the exact skills that win in college, in a first job, and in life. You're not just building a jump shot; you're building the person who shows up when it's hard.",
    "roleModels": [
      {
        "name": "Tim Duncan",
        "for": "Quiet, ego-free leadership - let his game and his teammates speak, stayed humble at the top, and finished his degree before chasing the league."
      },
      {
        "name": "Sue Bird",
        "for": "Elevating everyone around her, leading with poise over two decades, and carrying herself with class on and off the court."
      },
      {
        "name": "Stephen Curry",
        "for": "Relentless, unflashy work ethic, gratitude, and lifting up the people around him - proof that being the hardest worker matters more than being the biggest name."
      }
    ]
  },
  "soccer": {
    "oddsTruth": "Here's the honest truth, and it should set you free, not shrink you: almost everyone who loves soccer plays it without ever turning pro, and that is not failure. It's the normal, beautiful path. The pro level is a long-shot bonus draw, never the reason to lace up. You play for what the game is handing you right now: fitness, discipline, the read-the-field smarts, teammates who become family, and the doors a strong player can open at school. Reach for the top with everything you've got, and know your worth was never sitting at the end of that funnel.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~850,000",
        "of": "boys and girls play soccer nationwide each year"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~5.6% (men) / ~7.9% (women)",
        "of": "of HS players go on to compete in the NCAA"
      },
      {
        "tier": "Reach the pros",
        "figure": "~1.4% (men)",
        "of": "of NCAA men's players are drafted by MLS. On the women's side, the NWSL dropped its college draft in 2024 and now signs players directly, so there's no single draft percentage -- but the pro pathway is very real and growing for women."
      }
    ],
    "education": "This is the real prize. A college soccer roster spot can be your ticket onto a campus and into a degree you carry for life long after the cleats are hung up. Coaches and admissions notice players who show up, train, and lead, and that can open scholarship money and acceptance letters. Even beyond the money, the game is teaching you transferable things: how to work under pressure, communicate fast, recover from a loss, and keep promises to a team. Those travel with you into any classroom, job, or family you build.",
    "roleModels": [
      {
        "name": "Megan Rapinoe",
        "for": "Used her platform and captain's voice to stand up for teammates and fight for fair treatment, leading off the field as much as on it."
      },
      {
        "name": "Tim Howard",
        "for": "Played at the highest level while openly managing Tourette syndrome, showing that grit and steadiness beat any obstacle put in front of you."
      },
      {
        "name": "Christian Pulisic",
        "for": "Carried big expectations young with humility, kept his head down to work, and stayed gracious and team-first under intense pressure."
      }
    ]
  },
  "baseball": {
    "oddsTruth": "Here's the honest math, and it's good news, not bad: baseball gives you the most where it costs you the least. The pro path is a long-shot bonus -- not the point, and never the scoreboard for your worth. Play for what the game hands you right now: the work ethic, the way you handle a strikeout and step back in, the teammates, the joy of a clean play. Almost nobody reaches the bigs, and that is not failure -- it is just rare. The kid who never gets drafted still walks away built, schooled, and connected. That is the win you can actually count on.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~473,000",
        "of": "boys play baseball nationwide"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~8.8%",
        "of": "of HS players go on to play in the NCAA"
      },
      {
        "tier": "Get drafted (MLB)",
        "figure": "~4.9%",
        "of": "of draft-eligible NCAA players are picked in the MLB draft"
      }
    ],
    "education": "The real prize baseball can hand you is a door, not a contract. A roster spot often comes with scholarship money -- which is really access to a college education you might not have paid for otherwise -- plus coaches and alumni who open networks for life. The discipline of daily reps, the patience of a long season, learning to fail in front of a crowd and reset for the next pitch: those transfer straight into school, work, and being someone people can count on. You keep the degree and the character long after you hang up the cleats.",
    "roleModels": [
      {
        "name": "Derek Jeter",
        "for": "carried himself with quiet class and accountability for two decades, led by example, and never made it about himself"
      },
      {
        "name": "Mariano Rivera",
        "for": "humble, gracious, and respectful to teammates and opponents alike -- the first player ever voted to the Hall of Fame unanimously, as much for character as for skill"
      },
      {
        "name": "Jackie Robinson",
        "for": "showed courage and dignity under enormous pressure, lifting others by how he endured and led with restraint and conviction"
      }
    ]
  },
  "softball": {
    "oddsTruth": "Here's the honest truth, said with respect: most great softball players don't play in college, and most college players don't play pro -- and that takes nothing away from you. The diamond gives you its best gifts now: grit, footwork, a team that has your back, a body that moves well, and a reason to keep showing up. Pro softball is a long-shot bonus, not the scoreboard your worth is measured on. Hanging up the cleats one day isn't losing -- it's graduating into everything the game built in you. Play because you love it and because it's making you into someone steady. That return is guaranteed.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~338,000",
        "of": "girls play softball nationwide"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~6.5%",
        "of": "of HS players go on to play NCAA softball"
      },
      {
        "tier": "Reach the pros",
        "figure": "very few",
        "of": "no standard pro tier -- pro softball is small and still finding its footing; the AUSL (Athletes Unlimited Softball League, launched 2025) signs only a handful of top college stars each year"
      }
    ],
    "education": "Here's the real prize: softball is a door to education. Even a partial scholarship -- or just being a recruited athlete who stands out on an application -- can put college within reach and lower the bill. But the deeper win travels with you for life: showing up to early practice teaches discipline, owning an error teaches accountability, captaining a huddle teaches leadership, and grinding through a slump teaches you that effort pays off even when results lag. Coaches and employers chase those exact traits. The classroom and the career are the field the game is really preparing you for.",
    "roleModels": [
      {
        "name": "Jennie Finch",
        "for": "Carried herself with class and humility at the top of the sport, and has spent her career growing the game and mentoring young players rather than chasing the spotlight."
      },
      {
        "name": "Cat Osterman",
        "for": "Known for relentless preparation and quiet leadership, she set a standard of professionalism and gives back as a coach lifting the next generation."
      },
      {
        "name": "Natasha Watley",
        "for": "A trailblazing leader who plays and gives with generosity, building youth programs to open the game to kids who never had access to it."
      }
    ]
  },
  "track": {
    "oddsTruth": "Here is the honest, freeing truth: about 1 in 16 high school track athletes goes on to run, jump, or throw in the NCAA, and the pro/Olympic level is tiny and elite. Read that and breathe easy, not small. You don't lace up to chase a long shot. You do it for what the work gives you right now: a body that gets stronger, a mind that learns to grind, and a clock that teaches you to compete against yourself. Making the Olympics would be a rare bonus on top of all that, never the point. Not reaching the top is not failure. The kid who keeps showing up to practice is already winning the thing that matters.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~1.16 million",
        "of": "boys and girls run track & field nationwide"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~5.4% men / ~6.5% women",
        "of": "of HS track athletes compete in the NCAA"
      },
      {
        "tier": "Reach the top",
        "figure": "tiny, elite",
        "of": "there is no standard pro tier - the peak is Olympic/elite and extremely rare"
      }
    ],
    "education": "This is the real prize. Track is one of the widest doors in sport to a college education - schools sponsor it for both men and women, and a roster spot can come with scholarship money and academic support that opens classrooms you might not otherwise reach. The habits track builds travel everywhere: showing up early, splitting a big goal into daily reps, handling a bad race and resetting for the next one. That is discipline, resilience, and time management an employer will pay for long after your last meet. The medal you keep is the person the training makes you.",
    "roleModels": [
      {
        "name": "Allyson Felix",
        "for": "Carried herself with quiet class through a long career and used her platform to fight for better treatment of mothers in sport - leading by lifting others, not by talking herself up."
      },
      {
        "name": "Sydney McLaughlin-Levrone",
        "for": "Models humility, steady work, and grace under enormous pressure - she talks about gratitude and process over hype, and treats competitors with respect."
      },
      {
        "name": "Steve Prefontaine",
        "for": "Remembered for guts, honesty, and giving everything he had in every race - a reminder that effort and heart are the legacy, not just the times on the clock."
      }
    ]
  },
  "crosscountry": {
    "oddsTruth": "Here's the honest truth, runner to runner: most high schoolers don't run in college, and almost no one makes a living running. There's no clear pro tier in cross country -- the very top is sponsored elite and Olympic distance running, and that's rare enough that you can count the names. So don't run to \"make it.\" Run for what the miles are already giving you: a body that's strong, a mind that holds discipline when it's hard, and proof you can do hard things when no one's watching. Reaching the next level is a bonus, never the point. If your last race is in high school, you didn't fall short -- you got everything the sport had to give.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~430,000",
        "of": "boys and girls run cross country nationwide"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~5.3% (men), ~7.1% (women)",
        "of": "of HS runners go on to compete in the NCAA"
      }
    ],
    "education": "This is the real prize. A cross country roster spot can open the door to a college education -- partial scholarships, plus walk-on chances and academic aid that coaches help you find, because distance programs value runners who show up and grind. But the deeper win is who the training makes you: someone who plans the long game, manages time around hard workouts, pushes through discomfort, and finishes what they start. Those are the exact habits that carry into a degree, a first job, and a whole life -- long after the spikes are retired.",
    "roleModels": [
      {
        "name": "Eliud Kipchoge",
        "for": "Carries himself with humility and discipline -- famous for the line \"no human is limited\" and for crediting his team, not just himself. He models patience, steady daily work, and grace in both winning and losing."
      },
      {
        "name": "Molly Seidel",
        "for": "Open and honest about mental health and the pressure athletes carry, she shows that toughness includes asking for help and looking out for teammates -- leading with realness, not just results."
      },
      {
        "name": "Galen Rupp",
        "for": "Known for relentless, quiet consistency over many years and for mentoring younger runners coming up. He models showing up, doing the unglamorous work, and lifting the next generation."
      }
    ]
  },
  "volleyball": {
    "oddsTruth": "Here's the honest truth, and it's good news, not bad: about 4% of high-school volleyball players go on to play in the NCAA. That's a real, reachable goal worth chasing hard. But unlike some sports, volleyball has no standard pro draft in the U.S. - paid pro careers exist (the LOVB league here, plus clubs overseas), but the data is thin and the spots are few. So play volleyball for what it actually gives you right now: the discipline, the team trust, the joy, the health, and the doors it opens to college. Reaching the NCAA would be a win; a paid pro career would be a rare bonus on top. Not making either is not failure - the kid who grew through the grind already won the real prize.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~493,000",
        "of": "girls play volleyball nationwide (one of the largest girls' HS sports - second only to track & field)"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~4%",
        "of": "of HS players go on to play in the NCAA (men's is similar, ~3.7%)"
      }
    ],
    "education": "This is the real payoff. A volleyball scholarship isn't about the sport - it's about access to a college education you might not otherwise afford, and the degree you walk away with long after your last match. The court teaches what classrooms can't: communicating fast under pressure, trusting teammates, owning your role, bouncing back point after point. Those habits - reliability, leadership, grit - are exactly what colleges and employers want. Whether you play one season or four, the sport builds the person.",
    "roleModels": [
      {
        "name": "Kerri Walsh Jennings",
        "for": "How she carries herself - relentless work ethic, gracious in wins and losses, and decades of mentoring younger players and growing the game."
      },
      {
        "name": "Foluke Akinradewo Gunderson",
        "for": "Quiet, steady leadership and humility - a teammate-first captain who modeled showing up, doing your job, and lifting the people around you."
      },
      {
        "name": "David Lee",
        "for": "Calm, team-first competitor known for his composure, sportsmanship, and steadying presence under pressure rather than chasing the spotlight."
      }
    ]
  },
  "swimming": {
    "oddsTruth": "Here's the honest truth, said with respect: swimming gives you almost everything that matters long before any podium does - discipline, health, a team, and doors to a college education. Only a small share of swimmers go on to compete in college, and the very top is Olympic and national-team level, which is rare. That takes nothing away from what the pool builds in you. Reaching the elite tier is a bonus, never the point - the kid who swims hard and grows is already winning.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~255,000",
        "of": "boys and girls swim and dive on HS teams nationwide (NFHS, recent year)"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~7%",
        "of": "of HS swimmers go on to compete in the NCAA across all three divisions (slightly higher for girls, ~7.5%, than boys, ~7%)"
      },
      {
        "tier": "Reach the top",
        "figure": "Olympic / elite only",
        "of": "swimming has no standard pro league - the ceiling is national-team and Olympic level, and that's extremely rare"
      }
    ],
    "education": "This is the real prize. A swimming roster spot can open the door to a college education - financial aid, an academic home, and a network you carry for life. And the habits the pool builds travel everywhere: getting up before dawn, showing up when it's hard, managing time around a brutal schedule, handling pressure one race at a time. Those are the skills that make a strong student, employee, and adult - no matter how fast your final time ever was.",
    "roleModels": [
      {
        "name": "Katie Ledecky",
        "for": "Quiet, relentless work ethic and humility - lets her preparation speak, treats teammates and rivals with grace, and stays grounded through years at the top."
      },
      {
        "name": "Michael Phelps",
        "for": "Turning his platform toward honest talk about mental health, showing that asking for help is strength and that an athlete is more than their results."
      },
      {
        "name": "Caeleb Dressel",
        "for": "Openness about pressure and stepping back to protect his wellbeing, and the steady, team-first way he carries himself and lifts younger swimmers."
      }
    ]
  },
  "wrestling": {
    "oddsTruth": "Here's the honest math: about 3 in 100 high school wrestlers ever wrestle in college, and the very top of the sport is Olympic and elite-level only -- no big standard pro league, just a tiny handful who make a living at it. Read that and feel free, not small. You don't step on the mat to beat those odds; you step on it for what wrestling forges in you right now -- toughness, discipline, the habit of getting up. Reaching the elite level would be a wild bonus, never the point. If your last match is in high school or college, you have not failed at anything. The grit a wrestler builds shows up for the rest of your life, in rooms that have nothing to do with a singlet.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~300,000",
        "of": "wrestlers nationwide (NCAA, recent year)"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~3.0%",
        "of": "of HS wrestlers go on to wrestle in the NCAA (roughly 7,000-9,000 college wrestlers across all divisions)"
      },
      {
        "tier": "Reach the top",
        "figure": "Olympic / elite-only",
        "of": "no standard pro league -- the ceiling is national team and Olympic level, reached by an extremely small number"
      }
    ],
    "education": "The biggest door wrestling opens isn't a podium -- it's a classroom. College wrestling spots come with scholarship and recruiting support that can make a degree reachable when it otherwise might not be, and that education outlasts every match. Beyond the scholarship, the mat trains things employers and life reward: showing up when it's hard, cutting through nerves alone in the circle, owning a loss and adjusting, and out-working the room. Wrestlers carry discipline, self-reliance, and resilience into every job and relationship they ever have. That is the real prize, no matter how far up the bracket you go.",
    "roleModels": [
      {
        "name": "Jordan Burroughs",
        "for": "world and Olympic champion known for humility, mentoring younger wrestlers, and being a steady family man and ambassador for the sport"
      },
      {
        "name": "Kyle Snyder",
        "for": "carries himself with quiet discipline and class, leads by work ethic and example rather than talk"
      },
      {
        "name": "Kyle Dake",
        "for": "respected for relentless preparation, grace in winning and losing, and lifting up teammates and the wrestling community"
      }
    ]
  },
  "tennis": {
    "oddsTruth": "Here's the honest truth: only about 5 out of every 100 high school tennis players go on to play in the NCAA, and the pro tour is rarer still. Read that and feel free, not small. The pro tour is a long-shot bonus, never the point. You play tennis for what it builds in you right now - the discipline of practicing a serve a thousand times, the calm of solving problems alone on the court, the grit to lose a tough match and show up the next morning. Not turning pro is not failure. The kid who uses tennis to earn a degree, make lifelong friends, and learn to handle pressure has already won the thing that lasts.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~360,000",
        "of": "boys and girls play HS tennis nationwide"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~5% (men), ~5% (women)",
        "of": "of HS tennis players go on to play in the NCAA (roughly 1 in 20)"
      }
    ],
    "education": "This is the real prize: tennis can open the door to college. Coaches recruit across all three NCAA divisions, and scholarship or admissions support can put a degree within reach that changes a family's whole trajectory. The point of the scholarship isn't the tennis - it's the education and the doors it opens. And the habits tennis drills into you - showing up early, managing your own schedule, staying composed when you're down a set, owning your mistakes because there's no teammate to blame - are exactly the skills colleges, employers, and life reward long after you hang up the racket.",
    "roleModels": [
      {
        "name": "Roger Federer",
        "for": "Carried himself with grace and respect for opponents and officials across two decades; widely admired for sportsmanship, humility in winning and losing, and a foundation funding education for kids in Africa."
      },
      {
        "name": "Frances Tiafoe",
        "for": "Son of immigrant parents who grew up at the tennis center where his dad worked; models gratitude, joy, and work ethic, and openly uses his platform to show kids from any background they belong in the game."
      },
      {
        "name": "Coco Gauff",
        "for": "Leads with poise and maturity well beyond her years; known for thoughtful interviews, lifting up younger players, and handling pressure and setbacks with composure and class."
      }
    ]
  },
  "golf": {
    "oddsTruth": "Here is the honest truth about golf: there is no clean, guaranteed road to the pros, and you should not need one. Tours like the PGA and LPGA exist, but reaching them is rare enough that the NCAA does not even publish a standard pro figure for golf the way it does for football or basketball. Read that as freedom, not a closed door. Golf gives you a real shot at a college roster and a scholarship that pays for school, and it builds a level head and self-discipline you will use for the rest of your life. Chasing the pro tour is a long-shot bonus, never the point. If you never turn pro, you have not failed -- you have already won the things that actually last.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~162,000 boys / ~85,000 girls",
        "of": "play high school golf nationwide"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~5.4% (boys) / ~6.9% (girls)",
        "of": "of HS golfers go on to play in the NCAA"
      }
    ],
    "education": "This is the real prize. A golf roster spot can open the door to a college education -- scholarship money, admission support, and a built-in team and coaches who want you to graduate. The discipline golf teaches you (managing your own emotions, recovering after a bad hole, being honest enough to call a penalty on yourself when no one is watching) is exactly what employers and life reward. Golf is also a sport you can play and enjoy for sixty more years, long after every other game is over. Whatever level you reach, what it builds in you -- patience, integrity, composure -- and the doors it opens to school are yours to keep.",
    "roleModels": [
      {
        "name": "Annika Sorenstam",
        "for": "Models steady class and quiet, relentless work; built a foundation that mentors young players and lifts the next generation of girls in golf."
      },
      {
        "name": "Gary Player",
        "for": "Known for discipline, fitness, and a lifetime of sportsmanship; treated every opponent with respect and credited hard work over natural talent."
      },
      {
        "name": "Lorena Ochoa",
        "for": "Carried herself with humility at the very top, then stepped away on her own terms to serve kids through her foundation -- character over chasing more."
      }
    ]
  },
  "lacrosse": {
    "oddsTruth": "Here's the honest, freeing truth: of every group of high school lacrosse players, most will not play in the NCAA, and that is completely normal -- not a failure. Lacrosse actually has one of the friendliest paths to college play of any sport, but the pro game (the PLL) is tiny and brand new, so reaching it is a rare bonus, never the goal. Play because the game makes you tougher, faster, and more connected to a team right now. Where you finish on the ladder has nothing to do with your worth; what the sport builds in you travels with you for life.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~114,000 boys / ~99,000 girls",
        "of": "play lacrosse nationwide each year"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~13-14% (boys) / ~13% (girls)",
        "of": "of HS players go on to play in the NCAA -- one of the better odds in all of sports"
      },
      {
        "tier": "Reach the pros",
        "figure": "~0.8%",
        "of": "of NCAA men reach the pro PLL; the league is small and new, and there is no comparable women's pro tier"
      }
    ],
    "education": "This is the real prize. Lacrosse is one of the surest sports for turning play into a college opportunity, and a roster spot or scholarship is access -- to a degree, a network, and doors that stay open long after your last game. On the way there the sport drills habits that outlast it: showing up early, reading a fast-moving field, trusting teammates, and bouncing back after a loss. Those are the skills colleges, employers, and life reward. Chase the education the game can unlock, and you win no matter how far you climb.",
    "roleModels": [
      {
        "name": "Paul Rabil",
        "for": "A founder of the PLL who built the modern pro game so players after him could earn a living -- known for relentless work, humility, and lifting the whole sport, not just himself"
      },
      {
        "name": "Lyle Thompson",
        "for": "Carries himself with quiet dignity and pride in his roots, mentors young players, and lets his game and his character -- not trash talk -- do the talking"
      },
      {
        "name": "Taylor Cummings",
        "for": "A three-time national player of the year who leads by example and gives back through coaching and growing the women's game for the next generation"
      }
    ]
  },
  "gymnastics": {
    "oddsTruth": "Here's the honest truth about gymnastics: it has no normal pro league. The very top is the national team and the Olympics, and that road is one of the narrowest in all of sports. Almost no one walks it, and that is not a knock on you. Read it the other way: gymnastics asks for discipline, courage, and daily repetition that most people never build, and you keep every bit of that whether or not you ever make a college roster. Going elite would be a rare bonus on top of a great thing. It is never the point, and not reaching it is not failure. The strength, nerve, and work ethic this sport puts in you are yours for life.",
    "funnel": [
      {
        "tier": "In high school / club",
        "figure": "hundreds of thousands",
        "of": "young gymnasts train in clubs nationwide (the NCAA does not publish a clean HS rate, since most train at clubs, not school teams)"
      },
      {
        "tier": "Compete in the NCAA",
        "figure": "~3,500 women, ~200 men",
        "of": "across roughly 84-86 women's and only about 15 men's college programs - mostly Level 10/elite recruits"
      },
      {
        "tier": "Reach the top (Olympic / elite)",
        "figure": "a few dozen",
        "of": "make a U.S. national or Olympic team - no standard pro league exists, so this is the rare ceiling"
      }
    ],
    "education": "The real prize in gymnastics is the door it opens to college. Women's gymnastics is a fully-funded NCAA scholarship sport, so a strong gymnast can earn a debt-free or low-cost education, and a degree outlasts any routine you'll ever do. Beyond the scholarship, the sport quietly builds the exact things that carry you through life: showing up every day, performing under pressure, falling and getting back on the beam, and trusting your own preparation. That discipline, poise, and grit transfer to any classroom, job, or team you ever join.",
    "roleModels": [
      {
        "name": "Simone Biles",
        "for": "how she speaks openly about mental health and well-being, puts her own health first, and uses her platform to make the sport safer and kinder for the gymnasts who come after her"
      },
      {
        "name": "Gabby Douglas",
        "for": "the poise and humility she carried as a young pioneer, leading from within a team and staying gracious in the brightest spotlight"
      },
      {
        "name": "Sam Mikulak",
        "for": "his resilience and longevity in men's gymnastics, the way he kept competing through injuries and worked to lift and protect a sport with few programs left"
      }
    ]
  },
  "hockey": {
    "oddsTruth": "Here's the honest part, said with respect for you: hockey has one of the friendliest college funnels of any sport, and even so, the pros are a long shot for almost everyone who laces up. Read that and feel free, not small. You don't play hockey to \"make it\" - you play for what it's building in you right now: grit, composure under pressure, the habit of showing up at 5 a.m. when no one's watching. Reaching the NHL would be a wild bonus on top of all that. Not reaching it is not failure - it never was. The kid who gives everything and tops out in juniors or college walks away with the exact same character, friendships, and open doors as the one who gets drafted.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~32,000",
        "of": "boys play HS ice hockey nationwide (many more play club/juniors)"
      },
      {
        "tier": "Make an NCAA roster",
        "figure": "~11%",
        "of": "of HS hockey players reach the NCAA - one of the highest rates of any sport"
      },
      {
        "tier": "Get drafted (NHL)",
        "figure": "~7%",
        "of": "of draft-eligible NCAA players are picked in the NHL Draft"
      }
    ],
    "education": "This is the real prize: hockey can open the door to college. A scholarship or a roster spot isn't just ice time - it's access to an education and a degree that pays off for the rest of your life, long after the skates are hung up. And the things the rink drills into you - discipline, teamwork, handling adversity, leading and being led, bouncing back from a bad shift - are exactly the skills that make you good at school, at work, and at being a steady person. The doors hockey opens off the ice outlast anything on the scoreboard.",
    "roleModels": [
      {
        "name": "Sidney Crosby",
        "for": "Leads by relentless work ethic and humility - first one on the ice, last off, and famous for treating equipment staff and young teammates with the same respect as stars."
      },
      {
        "name": "P.K. Subban",
        "for": "Carries himself with joy and generosity off the ice, known for huge community giving and lifting up kids who didn't see themselves in the sport."
      },
      {
        "name": "Hayley Wickenheiser",
        "for": "One of the most respected leaders in the game - relentless competitor who built her life around education and mentoring the next generation."
      }
    ]
  },
  "cheerleading": {
    "oddsTruth": "Here's the honest part: cheerleading has no standard pro league, and only a small slice of high-school cheerleaders go on to do it in college. That's not a warning - it's freedom. You don't cheer to chase a paycheck that doesn't exist; you cheer for what it actually hands you right now: strength, fearless teamwork, poise under pressure, and a crew that has your back. Going on to a college squad or one of the new NCAA pathways is a real, worthy goal - a bonus if it comes. But not getting there is not failing. The discipline and confidence you build on the mat are yours for life, no matter the highest stage you ever step onto.",
    "funnel": [
      {
        "tier": "In high school",
        "figure": "~206,000",
        "of": "girls in competitive cheer/spirit nationwide (NFHS 2024-25), plus many more on sideline squads"
      },
      {
        "tier": "Compete in college",
        "figure": "a small share",
        "of": "go on to a college spirit squad, STUNT, or Acrobatics & Tumbling team"
      }
    ],
    "education": "This is the real prize. College spirit squads and the fast-growing NCAA pathways - STUNT and Acrobatics & Tumbling, now full championship sports - can open doors to scholarships and campus opportunities, and scholarship money is really access to an education and a degree that pays off for decades. Even off the mat, cheer builds the stuff colleges and employers want: showing up early, leading a group, performing when the pressure is on, and trusting teammates with literal weight on the line. Those habits travel everywhere - that's the door cheer opens.",
    "roleModels": [
      {
        "name": "Gabby Douglas",
        "for": "Olympic gymnast whose grit, humility, and work ethic in a tumbling-heavy sport model how to handle big pressure and bigger setbacks with grace."
      },
      {
        "name": "Simone Biles",
        "for": "shows that real toughness includes knowing your limits, speaking up for your wellbeing, and lifting up teammates - leadership beyond any score."
      },
      {
        "name": "Laurie Hernandez",
        "for": "carries herself with joy and encouragement, cheering on competitors and proving you can be fierce and kind at the same time."
      }
    ]
  }
};

/* ── "Find your sport" finder (Phase 2B) ─────────────────────
   A short, encouraging finder. Matches by INTEREST / PREFERENCE only —
   never body type, size, or physique. Every answer set yields suggestions
   (inclusive: "no wrong choice"); each result opens the detail sheet. Tags
   are lightweight sport metadata, NOT a user store. */
const SPORT_TAGS = {
  football:    {type:'team',       place:'outdoor', contact:'high', time:'season'},
  basketball:  {type:'team',       place:'indoor',  contact:'med',  time:'season'},
  soccer:      {type:'team',       place:'outdoor', contact:'med',  time:'year'},
  baseball:    {type:'team',       place:'outdoor', contact:'low',  time:'season'},
  softball:    {type:'team',       place:'outdoor', contact:'low',  time:'season'},
  track:       {type:'individual', place:'outdoor', contact:'low',  time:'season'},
  crosscountry:{type:'individual', place:'outdoor', contact:'low',  time:'season'},
  volleyball:  {type:'team',       place:'indoor',  contact:'low',  time:'season'},
  swimming:    {type:'individual', place:'indoor',  contact:'low',  time:'year'},
  wrestling:   {type:'individual', place:'indoor',  contact:'high', time:'season'},
  tennis:      {type:'individual', place:'outdoor', contact:'low',  time:'year'},
  golf:        {type:'individual', place:'outdoor', contact:'low',  time:'year'},
  lacrosse:    {type:'team',       place:'outdoor', contact:'high', time:'season'},
  gymnastics:  {type:'individual', place:'indoor',  contact:'low',  time:'year'},
  hockey:      {type:'team',       place:'indoor',  contact:'high', time:'year'},
  cheerleading:{type:'team',       place:'indoor',  contact:'med',  time:'year'}
};
const FINDER_Q = [
  { key:'type', q:'Do you like being part of a team — or doing your own thing?',
    opts:[{e:'🤝',l:'On a team',v:'team'},{e:'🎯',l:'On my own',v:'individual'},{e:'✨',l:'Either is great',v:'any'}] },
  { key:'place', q:'Where do you like to be?',
    opts:[{e:'🌤️',l:'Outdoors',v:'outdoor'},{e:'🏟️',l:'Indoors',v:'indoor'},{e:'✨',l:'No preference',v:'any'}] },
  { key:'contact', q:'How much physical contact are you up for?',
    opts:[{e:'💥',l:'Bring it on',v:'high'},{e:'👋',l:'A little',v:'med'},{e:'🕊️',l:'Little to none',v:'low'},{e:'✨',l:'No preference',v:'any'}] },
  { key:'time', q:'How much time do you want to put in?',
    opts:[{e:'🔥',l:'Year-round, all in',v:'year'},{e:'📅',l:'Just a season',v:'season'},{e:'✨',l:'No preference',v:'any'}] }
];
let _finderStep = 0, _finderAnswers = {};

function _sportFinderEl(){
  let m = document.getElementById('sportFinderModal');
  if(m) return m;
  m = document.createElement('div');
  m.id = 'sportFinderModal';
  m.className = 'sds-overlay';
  document.body.appendChild(m);
  m.addEventListener('click', e=>{ if(e.target===m) closeSportFinder(); });
  return m;
}
function closeSportFinder(){
  const m = document.getElementById('sportFinderModal');
  if(m){ m.classList.remove('open'); document.body.style.overflow=''; }
}
function openSportFinder(){
  _finderStep = 0; _finderAnswers = {};
  const m = _sportFinderEl();
  _finderRender();
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function finderAnswer(key, val){ _finderAnswers[key] = val; _finderStep++; _finderRender(); }
function finderRestart(){ _finderStep = 0; _finderAnswers = {}; _finderRender(); }
function _finderScore(){
  const a = _finderAnswers, keys = ['type','place','contact','time'];
  return SPORT_DATA.map(s=>{
    const t = SPORT_TAGS[s.id] || {};
    let score = 0, asked = 0;
    keys.forEach(k=>{ if(a[k] && a[k]!=='any'){ asked++; if(t[k]===a[k]) score++; } });
    return { s, score, asked };
  }).sort((x,y)=> y.score - x.score || x.s.name.localeCompare(y.s.name));
}
function _finderRender(){
  const m = document.getElementById('sportFinderModal');
  if(!m) return;
  const total = FINDER_Q.length;
  let inner;
  if(_finderStep < total){
    const q = FINDER_Q[_finderStep];
    const dots = FINDER_Q.map((_,i)=>'<span class="sfind-dot'+(i<=_finderStep?' on':'')+'"></span>').join('');
    const opts = q.opts.map(o=>'<button type="button" class="sfind-opt" onclick="finderAnswer(\''+q.key+'\',\''+o.v+'\')"><span class="sfind-opt__e" aria-hidden="true">'+o.e+'</span><span>'+o.l+'</span></button>').join('');
    inner =
      '<div class="sfind-progress"><div class="sfind-dots">'+dots+'</div><div class="sfind-step">'+(_finderStep+1)+' of '+total+'</div></div>'
      + '<h2 class="sfind-q">'+_sdEsc(q.q)+'</h2>'
      + '<div class="sfind-opts">'+opts+'</div>';
  } else {
    const ranked = _finderScore();
    const best = ranked.length ? ranked[0].score : 0;
    // Show the strongest matches; pad to a friendly minimum so results never feel
    // thin (near-matches are honest "also worth a look" options, badged only when perfect).
    let top = ranked.filter(r=> r.asked===0 ? true : r.score>=Math.max(1,best));
    if(top.length < 4) top = ranked.slice(0, Math.min(6, Math.max(4, top.length)));
    top = top.slice(0, 6);
    const list = (top.length ? top : ranked.slice(0,6)).map(r=>{
      const s = r.s;
      const fit = (r.asked>0 && r.score===r.asked) ? '<span class="sfind-fit">✨ Great fit</span>' : '';
      return '<button type="button" class="sfind-res" onclick="closeSportFinder();showSportDetail(\''+s.id+'\')">'
        + '<span class="sfind-res__e" aria-hidden="true">'+s.emoji+'</span>'
        + '<span class="sfind-res__txt"><b>'+_sdEsc(s.name)+'</b>'+fit+'</span>'
        + '<span class="sfind-res__go" aria-hidden="true">→</span></button>';
    }).join('');
    inner =
      '<h2 class="sfind-q">Sports that fit you</h2>'
      + '<p class="sfind-sub">Great starting points based on what you told us. Tap any to learn more — there’s no wrong choice.</p>'
      + '<div class="sfind-results">'+list+'</div>'
      + '<button type="button" class="sfind-restart" onclick="finderRestart()">↺ Start over</button>';
  }
  m.innerHTML = '<div class="sds-sheet sfind-sheet" role="dialog" aria-modal="true" aria-label="Find your sport" style="--sd-a:#38bdf8;--sd-b:#22d3ee;">'
    + '<button class="sds-close" type="button" aria-label="Close" onclick="closeSportFinder()">✕</button>'
    + '<div class="sfind-body" aria-live="polite">'+inner+'</div></div>';
}
function _injectFinderLaunch(){
  const host = document.getElementById('sp-explore');
  if(!host || document.getElementById('sportFinderLaunch')) return;
  const b = document.createElement('button');
  b.id = 'sportFinderLaunch'; b.className = 'sfind-launch'; b.type = 'button';
  b.setAttribute('onclick','openSportFinder()');
  b.innerHTML = '<span class="sfind-launch__spark" aria-hidden="true">✨</span>'
    + '<span class="sfind-launch__txt"><b>Find your sport</b><span>Answer 4 quick questions — find one that fits you</span></span>'
    + '<span class="sfind-launch__go" aria-hidden="true">→</span>';
  host.insertBefore(b, host.firstChild);
}

/* ── Main tab switcher ─────────────────────────────────────── */
function sportMainTab(tab, btn){
  document.querySelectorAll('#s-sports > .tabs > .tab').forEach(b=>b.classList.remove('active'));
  // The topic-grid nav (tgOpenTopic in ui.js) invokes this as sportMainTab('mine')
  // with NO btn, inside a try/catch that swallows errors. Touching btn.classList
  // unguarded threw here and silently aborted before the render calls below — which
  // is why My Sports opened to an empty picker on real navigation. Guard it.
  if(btn) btn.classList.add('active');
  const ex = document.getElementById('sp-explore'); if(ex) ex.style.display = tab==='explore' ? '' : 'none';
  const mn = document.getElementById('sp-mine');    if(mn) mn.style.display    = tab==='mine'    ? '' : 'none';
  if(tab==='mine'){ renderMySports(); }  // renderMySports builds the list AND the intake picker + live preview
}

/* ── My Sports — owner-guarded, cloud-synced D blob (Phase B) ──
   Was a device-only bare `mySports` localStorage key OUTSIDE the owner-guard,
   so one kid's sports profile (weight, GPA, coach email) leaked into a sibling's
   session on a shared device. Now persisted in D.mySports → save() writes it to
   localStorage[lifeos_v2] + debounced cloudSync() into profiles.data (RLS:
   auth.uid()=user_id), and _ylccEnforceOwner resets it to DEF on a user switch.
   Legacy localStorage data is folded in once by _migrateMySports() below. */
function getMySports(){ if(!Array.isArray(D.mySports)) D.mySports = []; return D.mySports; }
function saveMySports(arr){ D.mySports = Array.isArray(arr) ? arr : []; if(typeof save === 'function') save(); }

/* One-time, idempotent migration of the legacy device-only mySports key into
   the owner-guarded D blob. Runs lazily from renderMySports() (and is a no-op
   after the bare key is removed). SAFE BY CONSTRUCTION: it only ever runs in
   the device's own already-loaded session, and the owner-guard sweep
   (_ylccEnforceOwner) has already DELETED a different user's bare key on sign-in
   — so this never attaches another kid's data to the current profile; it only
   relocates the active user's own data from the bare key into D, then clears it. */
function _migrateMySports(){
  try{
    var raw = localStorage.getItem('mySports');
    if(raw == null) return;               // nothing legacy / already migrated
    var legacy = null;
    try{ legacy = JSON.parse(raw); }catch(e){ legacy = null; }
    if(!Array.isArray(D.mySports)) D.mySports = [];
    if(Array.isArray(legacy) && legacy.length){
      var have = {};
      D.mySports.forEach(function(s){ if(s && s.id != null) have[s.id] = true; });
      // Cloud/D is authoritative; only add legacy entries not already present (by id).
      legacy.forEach(function(s){ if(s && (s.id == null || !have[s.id])) D.mySports.push(s); });
    }
    localStorage.removeItem('mySports'); // remove the device-only leak source
    if(typeof save === 'function') save(); // persist into the owner-guarded D (LS + cloud)
  }catch(e){}
}

function addMySport(){
  const select = document.getElementById('mySportSelect');
  const custom = document.getElementById('mySportCustom');
  const team   = document.getElementById('mySportTeam');
  const pos    = document.getElementById('mySportPosition');
  const level  = document.getElementById('mySportLevel');
  const season = document.getElementById('mySportSeason');
  const year   = document.getElementById('mySportYear');

  const name = custom.value.trim() || select.value;
  if(!name){ alert('Please select or type a sport name.'); return; }

  const data = SPORT_DATA.find(s=>s.name.toLowerCase()===name.toLowerCase());
  const sport = {
    id: Date.now(),
    name, team: team.value.trim(), position: pos.value.trim(),
    level: level.value, season: season.value, year: year.value,
    emoji: data ? data.emoji : '🏅',
    dataId: data ? data.id : null,
    // Athlete-page fields (Phase-B redesign) — identity + the documentation engine.
    // All ride the SAME owner-guarded D.mySports path; no new storage key.
    jersey: '', motto: '',
    milestones: [],   // [{ id, text, date }] — experiences, never metrics
    reflection: '',   // gentle season reflection (growth/character), free text
    profile:{ height:'', weight:'', gpa:'', gradYear:'', coach:'', coachEmail:'' },
    seasons: [],
    notes: ''
  };

  const arr = getMySports();
  arr.push(sport);
  saveMySports(arr);

  resetSportIntake();
  renderMySports();
}

/* ── "Start your athlete page" intake (Phase-B reskin) ───────
   A themed sport-tile picker + a live "your page, forming" preview that themes
   to the chosen sport (SPORT_THEME + the sports-fx motif). Presentation/UX only:
   the SAME fields write the SAME sport entry to the owner-guarded D.mySports path
   via addMySport(). The hidden #mySportSelect holds the picked sport so the data
   path is unchanged; "More / other" reveals the free-text custom input. No body
   metrics, no compulsion mechanics — invitational copy only. */
/* Wellbeing guard: the "Position / event" field is free text, so a user (or a
   wrestler entering a class) can type a body-weight figure like "152 lb". Weight
   is allowed to live quietly in "What coaches see" as ONE static fact, but it
   must NEVER ride inside the celebratory, theme-glowing hero subtitle — not in
   the live preview, not on the athlete page. This strips a weight-shaped value
   out of the HERO line only; the field is still saved and shown in the quiet
   facts row untouched. */
function _heroSafePos(pos){
  return /\b\d{2,3}\s?(?:lb|lbs|kg|pounds?|kilos?)\b/i.test(String(pos || '')) ? '' : pos;
}
function renderSportPicker(){
  const grid = document.getElementById('sportPickerGrid');
  if(!grid){ try { console.warn('[picker] #sportPickerGrid not found'); } catch(e){} return; }
  // Self-heal: (re)build when never built OR when a prior attempt left it empty.
  // The tiles are the ONLY way to add a sport — never early-return on a blank grid.
  if(grid.dataset.built === '1' && grid.children.length > 0) return;

  // Resolve dependencies defensively. A top-level `const` that hasn't initialised
  // yet sits in its temporal dead zone and THROWS even on `typeof` — so each
  // lookup is wrapped. The sport catalog is required; the theme maps are optional
  // (a missing/uninitialised theme must degrade to default colors, never blank the
  // whole picker). escapeHtml lives in parent.js (loads after this file).
  var catalog = null, themeMap = {}, hexMap = {}, esc;
  try { if(typeof SPORT_DATA  !== 'undefined') catalog  = SPORT_DATA; }  catch(e){ try { console.error('[picker] SPORT_DATA inaccessible:', e && e.message); } catch(_){} }
  try { if(typeof SPORT_THEME !== 'undefined') themeMap = SPORT_THEME || {}; } catch(e){ try { console.error('[picker] SPORT_THEME inaccessible:', e && e.message); } catch(_){} }
  try { if(typeof THEME_HEX   !== 'undefined') hexMap   = THEME_HEX || {}; }   catch(e){ try { console.error('[picker] THEME_HEX inaccessible:', e && e.message); } catch(_){} }
  esc = (typeof escapeHtml === 'function') ? escapeHtml
      : function(x){ return String(x == null ? '' : x).replace(/[&<>]/g, function(c){ return c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'; }); };

  if(!Array.isArray(catalog) || !catalog.length){
    var t; try { t = typeof SPORT_DATA; } catch(e){ t = 'TDZ-throw'; }
    try { console.error('[picker] sport catalog unavailable/empty — cannot build tiles (typeof SPORT_DATA=' + t + ', len=' + (catalog && catalog.length) + ')'); } catch(e){}
    return;
  }

  try {
    var tiles = catalog.map(function(s){
      var pal = themeMap[s.id], hex = (pal && hexMap[pal]) ? hexMap[pal] : ['#38bdf8','#38bdf8'];
      return '<button type="button" class="msp-tile" data-sport="'+s.id+'" style="--sd-a:'+hex[0]+';--sd-b:'+hex[1]+';" onclick="selectSportTile(\''+s.id+'\')" aria-label="'+esc(s.name)+'">'
        + '<span class="msp-tile__e" aria-hidden="true">'+s.emoji+'</span><span class="msp-tile__n">'+esc(s.name)+'</span></button>';
    }).join('');
    grid.innerHTML = tiles
      + '<button type="button" class="msp-tile msp-tile--more" data-sport="__more" onclick="selectSportCustom()" aria-label="Add another sport"><span class="msp-tile__e" aria-hidden="true">➕</span><span class="msp-tile__n">More / other</span></button>';
    grid.dataset.built = '1';
    try { console.log('[picker] built ' + grid.children.length + ' tiles from ' + catalog.length + ' sports'); } catch(e){}
  } catch(e){
    try { console.error('[picker] threw while building tiles:', e); } catch(_){}
    return;
  }
  // Entrance reveal (once) — reuses the sports-fx layer; reveal only, no count-up.
  const intake = document.getElementById('sportIntake');
  if(intake && typeof window.sportsFxReveal === 'function'){ try { window.sportsFxReveal(intake, '.fx-reveal-target'); } catch(e){} }
}
function _setActiveTile(key){
  const grid = document.getElementById('sportPickerGrid'); if(!grid) return;
  Array.prototype.forEach.call(grid.querySelectorAll('.msp-tile'), function(t){ t.classList.toggle('msp-tile--active', t.dataset.sport === key); });
}
function _themeIntake(dataId){
  const intake = document.getElementById('sportIntake'); if(!intake) return;
  const hex = (dataId && typeof SPORT_THEME !== 'undefined' && SPORT_THEME[dataId]) ? THEME_HEX[SPORT_THEME[dataId]] : ['#38bdf8','#38bdf8'];
  intake.style.setProperty('--sd-a', hex[0]);
  intake.style.setProperty('--sd-b', hex[1]);
}
function selectSportTile(dataId){
  const s = SPORT_DATA.find(x=>x.id===dataId);
  if(!s) return;
  const sel = document.getElementById('mySportSelect'); if(sel) sel.value = s.name;
  const custom = document.getElementById('mySportCustom'); if(custom) custom.value = '';
  const cw = document.getElementById('mySportCustomWrap'); if(cw) cw.style.display = 'none';
  _setActiveTile(dataId);
  _themeIntake(s.id);
  renderSportPreview();
}
function selectSportCustom(){
  const sel = document.getElementById('mySportSelect'); if(sel) sel.value = '';
  const cw = document.getElementById('mySportCustomWrap'); if(cw) cw.style.display = '';
  const custom = document.getElementById('mySportCustom'); if(custom){ try { custom.focus(); } catch(e){} }
  _setActiveTile('__more');
  _themeIntake(null);
  renderSportPreview();
}
function resetSportIntake(){
  ['mySportSelect','mySportCustom','mySportTeam','mySportPosition','mySportYear','mySportLevel','mySportSeason'].forEach(function(id){ var el = document.getElementById(id); if(el) el.value = ''; });
  const cw = document.getElementById('mySportCustomWrap'); if(cw) cw.style.display = 'none';
  _setActiveTile(null);
  _themeIntake(null);
  renderSportPreview();
}
function renderSportPreview(){
  const prev = document.getElementById('sportPreview'); if(!prev) return;
  const sel = document.getElementById('mySportSelect');
  const custom = document.getElementById('mySportCustom');
  const name = (custom && custom.value.trim()) || (sel && sel.value) || '';
  const cta = document.getElementById('mySportCTA');
  if(!name){
    prev.innerHTML = '<div class="msp-preview__ghost"><span class="msp-preview__ghe" aria-hidden="true">🏅</span><span>Pick a sport above to watch your page start forming.</span></div>';
    if(cta){ cta.textContent = 'Pick a sport to start'; cta.disabled = true; cta.setAttribute('aria-disabled','true'); }
    return;
  }
  const data = SPORT_DATA.find(s=>s.name.toLowerCase()===name.toLowerCase());
  const emoji = data ? data.emoji : '🏅';
  const themeId = data ? data.id : null;
  const hex = (themeId && SPORT_THEME[themeId]) ? THEME_HEX[SPORT_THEME[themeId]] : ['#38bdf8','#38bdf8'];
  const motif = (themeId && typeof window.sportsFxMotif === 'function') ? window.sportsFxMotif(themeId) : '';
  const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const sub = [_heroSafePos(val('mySportPosition')), val('mySportTeam'), val('mySportLevel')].filter(Boolean).join(' · ');
  const athleteName = (typeof D !== 'undefined' && D.name) ? D.name : '';
  prev.style.setProperty('--sd-a', hex[0]); prev.style.setProperty('--sd-b', hex[1]);
  prev.innerHTML = '<div class="msp-preview__card msp-hero">'
    + (motif ? '<div class="msp-hero-art" aria-hidden="true">'+motif+'</div>' : '')
    + '<div class="msp-preview__tag">Your page, forming</div>'
    + '<div class="msp-hero__emoji" aria-hidden="true">'+emoji+'</div>'
    + '<div class="msp-hero__name">'+escapeHtml(athleteName || name)+'</div>'
    + '<div class="msp-hero__sub">'+escapeHtml([name, sub].filter(Boolean).join(' · '))+'</div></div>';
  if(cta){ cta.textContent = 'Start my ' + (data ? data.name : name) + ' page'; cta.disabled = false; cta.removeAttribute('aria-disabled'); }
}

function deleteMySport(id){
  if(!confirm('Remove this sport?')) return;
  saveMySports(getMySports().filter(s=>s.id!==id));
  renderMySports();
}

/* ── My Sports — the athlete page (Phase-B redesign) ──────────
   Reframed from a form into the user's athlete page: a themed IDENTITY card
   (jersey / name / position / school / motto + the sports-fx hero + motif), a
   MILESTONES & memories documentation engine (free-text experiences, not
   metrics), a gentle SEASON REFLECTION (growth/character), an understated
   "WHAT COACHES SEE" recruiting row (weight = exactly ONE static field), and a
   gentle, invitational COMPLETENESS cue. Presentation only — every field rides
   the same owner-guarded D.mySports path. Wellbeing rails: nothing
   motivating/celebratory/animated ever attaches to weight or body metrics;
   completeness counts identity/milestones/reflection only; no streaks or
   frequency loops. The reveal uses sportsFxReveal (no count-up — weight is
   never animated). */
function renderMySports(){
  // The intake (sport-tile picker + live preview) is part of the My Sports view, so
  // build it on EVERY entry to the view — before any early-return below — regardless
  // of how the view was opened (topic-grid nav, tab click, or a post-edit re-render)
  // and even when the user has no sports yet (the empty-state path returns early).
  // This is the call site that was missing: nothing on the real open path invoked
  // the picker. renderSportPicker self-heals, so repeat calls are cheap no-ops.
  if(typeof renderSportPicker === 'function') renderSportPicker();
  if(typeof renderSportPreview === 'function') renderSportPreview();
  const container = document.getElementById('mySportsList');
  if(!container) return;
  _migrateMySports();            // fold any legacy localStorage data into D once
  const sports = getMySports();
  if(!sports.length){
    container.innerHTML = '<div class="msp-empty"><span class="msp-empty__e" aria-hidden="true">🏅</span>'
      + '<div class="msp-empty__t">This is your athlete page. Add a sport, then make it yours — your name and number, the moments that mattered, and what you took from each season.</div>'
      + '<button class="btn bp msp-empty__cta" onclick="var s=document.getElementById(\'mySportSelect\'); if(s){ s.scrollIntoView({block:\'center\'}); s.focus(); }">Start your athlete page</button></div>';
    return;
  }
  const athleteName = (typeof D !== 'undefined' && D.name) ? D.name : '';
  container.innerHTML = sports.map(s => _renderAthlete(s, athleteName)).join('');
  // Entrance reveal only — NO count-up, so no number (incl. weight) ever animates.
  if(typeof window.sportsFxReveal === 'function'){ try { window.sportsFxReveal(container, '.fx-reveal-target'); } catch(e){} }
}

function _renderAthlete(s, athleteName){
  const esc = escapeHtml;
  const jersey = s.jersey||'', motto = s.motto||'', milestones = s.milestones||[], reflection = s.reflection||'';
  const themeId = (s.dataId && typeof SPORT_THEME !== 'undefined' && SPORT_THEME[s.dataId]) ? s.dataId : null;
  const theme = themeId ? SPORT_THEME[themeId] : 'lightning';
  const hex = (typeof THEME_HEX !== 'undefined' && THEME_HEX[theme]) ? THEME_HEX[theme] : ['#38bdf8','#38bdf8'];
  const motif = (themeId && typeof window.sportsFxMotif === 'function') ? window.sportsFxMotif(themeId) : '';
  const subline = [s.name, _heroSafePos(s.position), s.team].filter(Boolean).join(' · ');

  // 1) Identity card (the hero — the athlete is the first thing seen)
  let html = '<div class="msp-ath" style="--sd-a:'+hex[0]+';--sd-b:'+hex[1]+';">'
    + '<div class="msp-asec msp-hero fx-reveal-target">'
    +   (motif ? '<div class="msp-hero-art" aria-hidden="true">'+motif+'</div>' : '')
    +   '<div class="msp-hero__top">'
    +     (jersey ? '<span class="msp-jersey">#'+esc(jersey)+'</span>' : '<span class="msp-jersey msp-jersey--ghost">#</span>')
    +     '<span class="msp-hero__emoji" aria-hidden="true">'+s.emoji+'</span>'
    +     '<button class="msp-iconx" type="button" onclick="deleteMySport('+s.id+')" aria-label="Remove '+esc(s.name)+'">✕</button>'
    +   '</div>'
    +   '<h3 class="msp-hero__name">'+esc(athleteName || s.name)+'</h3>'
    +   '<div class="msp-hero__sub">'+esc(subline || 'Add your position and school')+'</div>'
    +   (motto ? '<p class="msp-hero__motto">&ldquo;'+esc(motto)+'&rdquo;</p>' : '')
    +   '<button class="msp-btn msp-btn--edit msp-hero__edit" type="button" onclick="openSportEditor('+s.id+')">✏️ Edit identity</button>'
    + '</div>';

  // 2) Milestones & memories — experiences, not metrics
  const chips = milestones.map(m =>
    '<span class="msp-mschip">'+esc(m.text) + (m.date ? '<span class="msp-mschip__d">'+esc(m.date)+'</span>' : '')
    + '<button class="msp-mschip__x" type="button" onclick="deleteSportMilestone('+s.id+',\''+esc(m.id)+'\')" aria-label="Remove moment: '+esc(m.text)+'">✕</button></span>').join('');
  html += '<div class="msp-asec fx-reveal-target"><div class="msp-asec__l">✨ Milestones &amp; memories</div>'
    + (chips ? '<div class="msp-mschips">'+chips+'</div>' : '<p class="msp-asec__empty">Capture the moments that mattered — a first varsity start, a comeback, the day it finally clicked.</p>')
    + '<div class="msp-addmoment">'
    +   '<input class="msp-input msp-addmoment__t" id="msMs_'+s.id+'" aria-label="Add a moment" placeholder="Add a moment — e.g. named team captain" maxlength="90">'
    +   '<input class="msp-input msp-addmoment__d" id="msMsD_'+s.id+'" aria-label="When (optional)" placeholder="When (optional)" maxlength="24">'
    +   '<button class="msp-btn msp-btn--add" type="button" onclick="addSportMilestone('+s.id+')">+ Add a moment</button>'
    + '</div></div>';

  // 3) Season reflection — gentle, growth/character framed
  html += '<div class="msp-asec fx-reveal-target"><div class="msp-asec__l">🌱 Season reflection</div>'
    + '<p class="msp-reflect__q">What did this season teach you?</p>'
    + (reflection ? '<p class="msp-reflect__t">'+esc(reflection)+'</p>' : '<p class="msp-asec__empty">A line or two on how you grew — on the field or off it.</p>')
    + '<button class="msp-btn msp-btn--edit" type="button" onclick="openReflection('+s.id+')">'+(reflection ? '✏️ Edit reflection' : '+ Add your reflection')+'</button></div>';

  // 4) What coaches see — quiet recruiting row (weight = ONE static field) + stats
  const p = s.profile||{};
  const facts = [];
  if(s.position) facts.push(['Position', s.position]);
  if(s.level)    facts.push(['Grade', s.level]);
  if(p.gradYear) facts.push(['Grad year', p.gradYear]);
  if(p.gpa)      facts.push(['GPA', p.gpa]);
  if(p.height)   facts.push(['Height', p.height]);
  if(p.weight)   facts.push(['Weight', p.weight]);   // static recruiting snapshot — never tracked/animated
  const factRow = facts.length
    ? '<div class="msp-facts">'+facts.map(f=>'<div class="msp-fact"><span class="msp-fact__k">'+esc(f[0])+'</span><span class="msp-fact__v">'+esc(f[1])+'</span></div>').join('')+'</div>'
    : '<p class="msp-asec__empty">Add the recruiting snapshot coaches look for.</p>';
  html += '<div class="msp-asec fx-reveal-target"><div class="msp-asec__l">🎓 What coaches see</div>'
    + factRow + _renderSeasonStats(s)
    + '<div class="msp-coachrow"><button class="msp-btn msp-btn--edit" type="button" onclick="openSportEditor('+s.id+')">✏️ Edit recruiting</button>'
    +   '<button class="msp-btn msp-btn--add" type="button" onclick="openSeasonEditor('+s.id+')">+ Add season</button></div></div>';

  // 5) Gentle completeness — identity / milestones / reflection ONLY (no body data)
  const parts = [ !!(motto || jersey), milestones.length > 0, !!reflection ];
  const done = parts.filter(Boolean).length;
  html += '<div class="msp-asec msp-shape fx-reveal-target">'
    + (done >= 3
        ? '<span class="msp-shape__t">🌟 Your page is looking great — your identity, your milestones, and your reflection are all here.</span>'
        : '<span class="msp-shape__t">Your page is taking shape · '+done+' of 3 parts started</span><span class="msp-shape__h">'+_shapeHint(parts)+'</span>')
    + '</div>';

  return html + '</div>';
}

function _shapeHint(parts){
  if(!parts[0]) return 'Add a motto or your number to make it yours.';
  if(!parts[1]) return 'Add a milestone — a moment from your journey.';
  if(!parts[2]) return 'Add a reflection on what this season taught you.';
  return '';
}

/* The season-stats table — recruiting performance data (records, points), not
   body data. Kept inside "What coaches see". */
function _renderSeasonStats(s){
  const data = s.dataId ? SPORT_DATA.find(x=>x.id===s.dataId) : null;
  const seasons = s.seasons||[];
  if(!seasons.length) return '<div class="msp-noseasons">No seasons logged yet.</div>';
  const allKeys = [...new Set(seasons.flatMap(ss=>Object.keys(ss.stats||{})).filter(k=>seasons.some(ss=>ss.stats&&ss.stats[k])))];
  const fields = data && data.statFields ? data.statFields : [];
  return '<div class="msp-tablewrap"><table class="msp-table"><thead><tr><th>Season</th>'
    // Presentation-layer relabel only (SPORT_DATA byte-identical): make the wrestling
    // weight-class column unmistakably a competition bracket, never a body-weight log.
    + allKeys.map(k=>{ const f = fields.find(f=>f.key===k); const label = (f && f.key==='weightClass') ? 'Weight class (bracket)' : (f?f.label:k); return '<th>'+escapeHtml(label)+'</th>'; }).join('')
    + '<th aria-label="Remove"></th></tr></thead><tbody>'
    + seasons.map((ss,i)=>'<tr><td>'+escapeHtml(ss.seasonLabel||('Season '+(i+1)))+'</td>'
        + allKeys.map(k=>'<td><span class="msp-tv">'+escapeHtml((ss.stats&&ss.stats[k])||'—')+'</span></td>').join('')
        + '<td><button class="msp-rowdel" type="button" onclick="deleteSeasonStat('+s.id+','+i+')" aria-label="Remove '+escapeHtml(ss.seasonLabel||('Season '+(i+1)))+'">✕</button></td></tr>').join('')
    + '</tbody></table></div>';
}

/* Milestones & reflection — the documentation engine. Experiences/growth, free
   text; never weight/body-comp, never tracked-over-time metrics. */
function addSportMilestone(sportId){
  const t = document.getElementById('msMs_'+sportId);
  const dEl = document.getElementById('msMsD_'+sportId);
  const text = t ? t.value.trim() : '';
  if(!text) return;
  const sports = getMySports();
  const sp = sports.find(x=>x.id===sportId);
  if(!sp) return;
  if(!Array.isArray(sp.milestones)) sp.milestones = [];
  sp.milestones.push({ id: 'm'+Date.now(), text: text, date: dEl ? dEl.value.trim() : '' });
  saveMySports(sports);
  renderMySports();
}
function deleteSportMilestone(sportId, mid){
  const sports = getMySports();
  const sp = sports.find(x=>x.id===sportId);
  if(!sp || !Array.isArray(sp.milestones)) return;
  sp.milestones = sp.milestones.filter(m=>String(m.id)!==String(mid));
  saveMySports(sports);
  renderMySports();
}

/* ── Sport Profile Editor Modal ────────────────────────────── */
function openSportEditor(sportId){
  const sports = getMySports();
  const sport = sports.find(s=>s.id===sportId);
  if(!sport) return;
  const p = sport.profile||{};
  const modal = document.getElementById('sportEditorModal') || createSportEditorModal();
  modal.querySelector('#seModalTitle').textContent = sport.emoji+' '+sport.name+' — Your page';
  const set = (id,v)=>{ const el = modal.querySelector('#'+id); if(el) el.value = v||''; };
  set('seJersey', sport.jersey); set('sePosition', sport.position); set('seTeam', sport.team); set('seMotto', sport.motto);
  set('seHeight', p.height); set('seWeight', p.weight); set('seGpa', p.gpa);
  set('seGradYear', p.gradYear); set('seCoach', p.coach); set('seCoachEmail', p.coachEmail);
  modal.querySelector('#seSaveBtn').onclick = ()=> saveSportProfile(sportId);
  modal.style.display = 'flex';
  const j = modal.querySelector('#seJersey'); if(j) j.focus();
}

function saveSportProfile(sportId){
  const sports = getMySports();
  const idx = sports.findIndex(s=>s.id===sportId);
  if(idx<0) return;
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  sports[idx].jersey   = v('seJersey');
  sports[idx].position = v('sePosition');
  sports[idx].team     = v('seTeam');
  sports[idx].motto    = v('seMotto');
  sports[idx].profile = {
    height: v('seHeight'), weight: v('seWeight'), gpa: v('seGpa'),
    gradYear: v('seGradYear'), coach: v('seCoach'), coachEmail: v('seCoachEmail'),
  };
  saveMySports(sports);
  document.getElementById('sportEditorModal').style.display='none';
  renderMySports();
}

function createSportEditorModal(){
  const m = document.createElement('div');
  m.id = 'sportEditorModal';
  m.className = 'msp-overlay';
  m.innerHTML=`
    <div class="msp-sheet" role="dialog" aria-modal="true" aria-labelledby="seModalTitle">
      <div class="msp-sheet__head">
        <div class="msp-sheet__title" id="seModalTitle">Your page</div>
        <button class="msp-x" type="button" aria-label="Close" onclick="document.getElementById('sportEditorModal').style.display='none'">✕</button>
      </div>
      <div class="msp-formlabel">🎽 Your identity</div>
      <div class="msp-grid2">
        <div class="msp-field"><label class="msp-label" for="seJersey">Jersey number</label><input id="seJersey" class="msp-input" placeholder="e.g. 7" maxlength="6"></div>
        <div class="msp-field"><label class="msp-label" for="sePosition">Position / event</label><input id="sePosition" class="msp-input" placeholder="e.g. Point guard"></div>
      </div>
      <div class="msp-field" style="margin-bottom:.55rem;"><label class="msp-label" for="seTeam">School / team</label><input id="seTeam" class="msp-input" placeholder="e.g. Lincoln HS"></div>
      <div class="msp-field" style="margin-bottom:.2rem;"><label class="msp-label" for="seMotto">Your motto</label><input id="seMotto" class="msp-input" placeholder="A line you play by" maxlength="80"></div>
      <div class="msp-formlabel">🎓 What coaches see</div>
      <div class="msp-grid2">
        <div class="msp-field"><label class="msp-label" for="seHeight">Height</label><input id="seHeight" class="msp-input" placeholder='e.g. 6\'2"'></div>
        <div class="msp-field"><label class="msp-label" for="seWeight">Weight (lbs)</label><input id="seWeight" class="msp-input" placeholder="e.g. 185"></div>
        <div class="msp-field"><label class="msp-label" for="seGpa">GPA</label><input id="seGpa" class="msp-input" placeholder="e.g. 3.7"></div>
        <div class="msp-field"><label class="msp-label" for="seGradYear">Graduation year</label><input id="seGradYear" class="msp-input" placeholder="e.g. 2027"></div>
        <div class="msp-field"><label class="msp-label" for="seCoach">Coach name</label><input id="seCoach" class="msp-input" placeholder="Coach Smith"></div>
        <div class="msp-field"><label class="msp-label" for="seCoachEmail">Coach email</label><input id="seCoachEmail" class="msp-input" type="email" placeholder="coach@school.edu"></div>
      </div>
      <p class="msp-fieldnote">Weight here is just a recruiting snapshot for coaches &mdash; it is never tracked over time, charted, or counted toward your page.</p>
      <button id="seSaveBtn" class="btn bp msp-addbtn">Save</button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{ if(e.target===m) m.style.display='none'; });
  _wireMspEscape();
  return m;
}

/* ── Season Reflection editor ──────────────────────────────── */
function openReflection(sportId){
  const sports = getMySports();
  const sport = sports.find(s=>s.id===sportId);
  if(!sport) return;
  const modal = document.getElementById('reflectionModal') || createReflectionModal();
  modal.querySelector('#refTitle').textContent = sport.emoji+' '+sport.name+' — Reflection';
  modal.querySelector('#refText').value = sport.reflection||'';
  modal.querySelector('#refSaveBtn').onclick = ()=> saveReflection(sportId);
  modal.style.display = 'flex';
  const t = modal.querySelector('#refText'); if(t) t.focus();
}
function saveReflection(sportId){
  const sports = getMySports();
  const idx = sports.findIndex(s=>s.id===sportId);
  if(idx<0) return;
  const el = document.getElementById('refText');
  sports[idx].reflection = el ? el.value.trim() : '';
  saveMySports(sports);
  document.getElementById('reflectionModal').style.display='none';
  renderMySports();
}
function createReflectionModal(){
  const m = document.createElement('div');
  m.id = 'reflectionModal';
  m.className = 'msp-overlay';
  m.innerHTML=`
    <div class="msp-sheet" role="dialog" aria-modal="true" aria-labelledby="refTitle">
      <div class="msp-sheet__head">
        <div class="msp-sheet__title" id="refTitle">Reflection</div>
        <button class="msp-x" type="button" aria-label="Close" onclick="document.getElementById('reflectionModal').style.display='none'">✕</button>
      </div>
      <p class="msp-reflect__q" style="margin-top:0;">What did this season teach you? How did you grow &mdash; on the field or off it?</p>
      <textarea id="refText" class="msp-textarea" rows="5" placeholder="It taught me..."></textarea>
      <button id="refSaveBtn" class="btn bp msp-addbtn">Save reflection</button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{ if(e.target===m) m.style.display='none'; });
  _wireMspEscape();
  return m;
}
/* Esc-to-close for the My Sports editor modals (wired once). Mirrors the
   .sds sheet's keyboard behaviour so all overlays close consistently. */
function _wireMspEscape(){
  if(window._mspKeyWired) return;
  window._mspKeyWired = true;
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    ['sportEditorModal','seasonEditorModal','reflectionModal'].forEach(function(id){ var el = document.getElementById(id); if(el) el.style.display = 'none'; });
  });
}

/* ── Season Stats Editor Modal ─────────────────────────────── */
function openSeasonEditor(sportId){
  const sports = getMySports();
  const sport = sports.find(s=>s.id===sportId);
  if(!sport) return;
  const data  = sport.dataId ? SPORT_DATA.find(x=>x.id===sport.dataId) : null;

  const modal = document.getElementById('seasonEditorModal') || createSeasonEditorModal();

  modal.querySelector('#ssModalTitle').textContent = sport.emoji+' '+sport.name+' — Season stats';

  // Render existing seasons
  const existing = modal.querySelector('#ssExisting');
  existing.innerHTML = (sport.seasons||[]).length
    ? (sport.seasons||[]).map((ss,i)=>'<div class="msp-seasonrow"><div class="msp-seasonrow__l">'
        + '<div class="msp-seasonrow__t">'+escapeHtml(ss.seasonLabel||('Season '+(i+1)))+'</div>'
        + '<div class="msp-seasonrow__s">'+escapeHtml(Object.entries(ss.stats||{}).filter(([k,v])=>v).slice(0,3).map(([k,v])=>{
            const f=data&&data.statFields?data.statFields.find(f=>f.key===k):null;
            return (f?f.label:k)+': '+v;
          }).join(' · '))+'</div></div>'
        + '<button class="msp-btn msp-btn--danger" onclick="deleteSeasonStat('+sportId+','+i+')" aria-label="Remove '+escapeHtml(ss.seasonLabel||('Season '+(i+1)))+'">✕</button></div>').join('')
    : '<div class="msp-noseasons" style="text-align:center;">No seasons logged yet.</div>';

  // Build stat input fields
  const fields = data && data.statFields
    ? data.statFields
    : [{key:'gp',label:'Games Played',type:'number'},{key:'pts',label:'Points/Score',type:'number'},{key:'note',label:'Note',type:'text'}];

  modal.querySelector('#ssFields').innerHTML =
    '<div class="msp-field" style="margin-bottom:.55rem;"><label class="msp-label" for="ssSeasonLabel">Season label (e.g. "Fall 2025")</label>'
    + '<input id="ssSeasonLabel" class="msp-input" placeholder="Fall 2025"></div>'
    + '<div class="msp-grid2" style="margin-bottom:0;">'
    + fields.map(f=>'<div class="msp-field"><label class="msp-label" for="ssStat_'+f.key+'">'+escapeHtml(f.label)+'</label>'
        + '<input id="ssStat_'+f.key+'" class="msp-input" type="'+f.type+'" placeholder="'+escapeHtml(f.label)+'"></div>').join('')
    + '</div>';

  modal.querySelector('#ssAddBtn').onclick = ()=> addSeasonStat(sportId, fields);
  modal.style.display='flex';
}

function addSeasonStat(sportId, fields){
  const sports = getMySports();
  const idx = sports.findIndex(s=>s.id===sportId);
  if(idx<0) return;
  const label = document.getElementById('ssSeasonLabel').value.trim() || 'Season '+(sports[idx].seasons.length+1);
  const stats = {};
  fields.forEach(f=>{
    const el = document.getElementById('ssStat_'+f.key);
    if(el && el.value.trim()) stats[f.key] = el.value.trim();
  });
  if(!sports[idx].seasons) sports[idx].seasons=[];
  sports[idx].seasons.push({ seasonLabel:label, stats });
  saveMySports(sports);
  openSeasonEditor(sportId); // refresh modal
  renderMySports();
}

function deleteSeasonStat(sportId, idx){
  if(!confirm('Remove this season?')) return;
  const sports = getMySports();
  const sIdx = sports.findIndex(s=>s.id===sportId);
  if(sIdx<0) return;
  sports[sIdx].seasons.splice(idx,1);
  saveMySports(sports);
  openSeasonEditor(sportId);
  renderMySports();
}

function createSeasonEditorModal(){
  const m = document.createElement('div');
  m.id='seasonEditorModal';
  m.className = 'msp-overlay';
  m.innerHTML=`
    <div class="msp-sheet" role="dialog" aria-modal="true" aria-labelledby="ssModalTitle">
      <div class="msp-sheet__head">
        <div class="msp-sheet__title" id="ssModalTitle">Season stats</div>
        <button class="msp-x" type="button" aria-label="Close" onclick="document.getElementById('seasonEditorModal').style.display='none'">✕</button>
      </div>
      <div class="msp-formlabel">📅 Previous seasons</div>
      <div id="ssExisting" style="margin-bottom:1rem;"></div>
      <div class="msp-formlabel">➕ Add a new season</div>
      <div id="ssFields"></div>
      <button id="ssAddBtn" class="btn bp msp-addbtn" style="margin-top:.8rem;">Save season stats</button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{ if(e.target===m) m.style.display='none'; });
  _wireMspEscape();
  return m;
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderSportsGrid();
});
