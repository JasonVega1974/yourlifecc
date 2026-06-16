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
  ocean:['#06b6d4','#3b82f6'], mind:['#ec4899','#f472b6'], lightning:['#38bdf8','#818cf8'],
  treasury:['#fbbf24','#16a34a'], time:['#818cf8','#a78bfa']
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
  if(m){ m.classList.remove('open'); document.body.style.overflow=''; }
  // a11y — return focus to the sport card that opened the sheet.
  try { if(window._sdsReturnFocus && window._sdsReturnFocus.focus) window._sdsReturnFocus.focus(); } catch(e){}
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
    '<div class="sds-sheet" role="dialog" aria-modal="true" aria-label="' + _sdEsc(s.name) + ' details" style="--sd-a:' + hex[0] + ';--sd-b:' + hex[1] + ';">'
    + '<button class="sds-close" type="button" aria-label="Close" onclick="closeSportSheet()">✕</button>'
    + '<div class="sds-head">'
    +   '<span class="sds-emoji" aria-hidden="true">' + s.emoji + '</span>'
    +   '<div class="sds-headtext"><h2 class="sds-name">' + _sdEsc(s.name) + '</h2>' + tagline + '<div class="sds-levels">' + levelChips + '</div></div>'
    + '</div>'
    + '<div class="sds-body">' + body + '</div>'
    + '</div>';
  try { window._sdsReturnFocus = document.activeElement; } catch(e){}
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
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
  m.innerHTML = '<div class="sds-sheet sfind-sheet" role="dialog" aria-modal="true" aria-label="Find your sport" style="--sd-a:#38bdf8;--sd-b:#a78bfa;">'
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
  btn.classList.add('active');
  document.getElementById('sp-explore').style.display = tab==='explore' ? '' : 'none';
  document.getElementById('sp-mine').style.display    = tab==='mine'    ? '' : 'none';
  if(tab==='mine') renderMySports();
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
    profile:{ height:'', weight:'', gpa:'', gradYear:'', coach:'', coachEmail:'' },
    seasons: [],
    notes: ''
  };

  const arr = getMySports();
  arr.push(sport);
  saveMySports(arr);

  // Reset form
  select.value=''; custom.value=''; team.value=''; pos.value='';
  level.value=''; season.value=''; year.value='';
  renderMySports();
}

function deleteMySport(id){
  if(!confirm('Remove this sport?')) return;
  saveMySports(getMySports().filter(s=>s.id!==id));
  renderMySports();
}

/* ── Render My Sports list ─────────────────────────────────── */
function renderMySports(){
  const container = document.getElementById('mySportsList');
  if(!container) return;
  _migrateMySports();            // fold any legacy localStorage data into D once
  const sports = getMySports();
  if(!sports.length){
    container.innerHTML = '<div class="msp-empty"><span class="msp-empty__e" aria-hidden="true">🏅</span>'
      + '<div class="msp-empty__t">No sports added yet. Add your first sport to start tracking your seasons and recruiting profile.</div>'
      + '<button class="btn bp msp-empty__cta" onclick="var s=document.getElementById(\'mySportSelect\'); if(s){ s.scrollIntoView({block:\'center\'}); s.focus(); }">Add your first sport</button></div>';
    return;
  }
  container.innerHTML = sports.map(s=>{
    const data = s.dataId ? SPORT_DATA.find(x=>x.id===s.dataId) : null;
    const seasons = s.seasons||[];
    const hasSeasons = seasons.length > 0;
    const allKeys = hasSeasons
      ? [...new Set(seasons.flatMap(ss=>Object.keys(ss.stats||{})).filter(k=>seasons.some(ss=>ss.stats&&ss.stats[k])))]
      : [];
    const fields = data && data.statFields ? data.statFields : [];

    const tableHtml = hasSeasons
      ? '<div class="msp-tablewrap"><table class="msp-table"><thead><tr><th>Season</th>'
          + allKeys.map(k=>{ const f = fields.find(f=>f.key===k); return '<th>'+escapeHtml(f?f.label:k)+'</th>'; }).join('')
          + '<th aria-label="Remove"></th></tr></thead><tbody>'
          + seasons.map((ss,i)=>'<tr><td>'+escapeHtml(ss.seasonLabel||('Season '+(i+1)))+'</td>'
              + allKeys.map(k=>'<td><span class="msp-tv">'+escapeHtml((ss.stats&&ss.stats[k])||'—')+'</span></td>').join('')
              + '<td><button class="msp-rowdel" onclick="deleteSeasonStat('+s.id+','+i+')" aria-label="Remove '+escapeHtml(ss.seasonLabel||('Season '+(i+1)))+'">✕</button></td></tr>').join('')
          + '</tbody></table></div>'
      : '<div class="msp-noseasons">No seasons logged yet.</div>';

    return '<div class="msp-card">'
      + '<div class="msp-card__head"><span class="msp-emoji" aria-hidden="true">'+s.emoji+'</span>'
      +   '<div class="msp-id"><div class="msp-name">'+escapeHtml(s.name)+'</div>'
      +     '<div class="msp-meta">'+escapeHtml([s.team,s.position,s.level,s.season,s.year].filter(Boolean).join(' · ')||'No details added')+'</div></div>'
      +   '<div class="msp-actions">'
      +     '<button class="msp-btn msp-btn--edit" onclick="openSportEditor('+s.id+')">✏️ Edit</button>'
      +     '<button class="msp-btn msp-btn--danger" onclick="deleteMySport('+s.id+')" aria-label="Remove sport">✕</button>'
      +   '</div></div>'
      + '<div class="msp-body"><div class="msp-bodyhead"><span class="msp-bodyhead__l">📊 Season stats</span>'
      +   '<button class="msp-btn msp-btn--add" onclick="openSeasonEditor('+s.id+')">+ Add season</button></div>'
      +   tableHtml + '</div></div>';
  }).join('');
}

/* ── Sport Profile Editor Modal ────────────────────────────── */
function openSportEditor(sportId){
  const sports = getMySports();
  const sport = sports.find(s=>s.id===sportId);
  if(!sport) return;

  const modal = document.getElementById('sportEditorModal') || createSportEditorModal();

  modal.querySelector('#seModalTitle').textContent = sport.emoji+' '+sport.name+' — Profile';
  modal.querySelector('#seHeight').value    = sport.profile.height||'';
  modal.querySelector('#seWeight').value    = sport.profile.weight||'';
  modal.querySelector('#seGpa').value       = sport.profile.gpa||'';
  modal.querySelector('#seGradYear').value  = sport.profile.gradYear||'';
  modal.querySelector('#seCoach').value     = sport.profile.coach||'';
  modal.querySelector('#seCoachEmail').value= sport.profile.coachEmail||'';
  modal.querySelector('#seNotes').value     = sport.notes||'';
  modal.querySelector('#seSaveBtn').onclick = ()=> saveSportProfile(sportId);
  modal.style.display = 'flex';
}

function saveSportProfile(sportId){
  const sports = getMySports();
  const idx = sports.findIndex(s=>s.id===sportId);
  if(idx<0) return;
  sports[idx].profile = {
    height:    document.getElementById('seHeight').value.trim(),
    weight:    document.getElementById('seWeight').value.trim(),
    gpa:       document.getElementById('seGpa').value.trim(),
    gradYear:  document.getElementById('seGradYear').value.trim(),
    coach:     document.getElementById('seCoach').value.trim(),
    coachEmail:document.getElementById('seCoachEmail').value.trim(),
  };
  sports[idx].notes = document.getElementById('seNotes').value.trim();
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
        <div class="msp-sheet__title" id="seModalTitle">Sport profile</div>
        <button class="msp-x" type="button" aria-label="Close" onclick="document.getElementById('sportEditorModal').style.display='none'">✕</button>
      </div>
      <div class="msp-formlabel">🏋️ Athletic profile</div>
      <div class="msp-grid2">
        <div class="msp-field"><label class="msp-label" for="seHeight">Height</label><input id="seHeight" class="msp-input" placeholder='e.g. 6\'2"'></div>
        <div class="msp-field"><label class="msp-label" for="seWeight">Weight (lbs)</label><input id="seWeight" class="msp-input" placeholder='e.g. 185'></div>
        <div class="msp-field"><label class="msp-label" for="seGpa">GPA</label><input id="seGpa" class="msp-input" placeholder='e.g. 3.7'></div>
        <div class="msp-field"><label class="msp-label" for="seGradYear">Graduation year</label><input id="seGradYear" class="msp-input" placeholder='e.g. 2027'></div>
      </div>
      <div class="msp-formlabel">👤 Coach info</div>
      <div class="msp-grid2">
        <div class="msp-field"><label class="msp-label" for="seCoach">Coach name</label><input id="seCoach" class="msp-input" placeholder='Coach Smith'></div>
        <div class="msp-field"><label class="msp-label" for="seCoachEmail">Coach email</label><input id="seCoachEmail" class="msp-input" type="email" placeholder='coach@school.edu'></div>
      </div>
      <div class="msp-formlabel">📝 Notes</div>
      <textarea id="seNotes" class="msp-textarea" rows="3" placeholder="Goals, highlights, recruiting notes..."></textarea>
      <button id="seSaveBtn" class="btn bp msp-addbtn">Save profile</button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{ if(e.target===m) m.style.display='none'; });
  _wireMspEscape();
  return m;
}
/* Esc-to-close for the My Sports editor modals (wired once). Mirrors the
   .sds sheet's keyboard behaviour so both overlays close consistently. */
function _wireMspEscape(){
  if(window._mspKeyWired) return;
  window._mspKeyWired = true;
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    ['sportEditorModal','seasonEditorModal'].forEach(function(id){ var el = document.getElementById(id); if(el) el.style.display = 'none'; });
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
