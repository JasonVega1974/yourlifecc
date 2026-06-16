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
