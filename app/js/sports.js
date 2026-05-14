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

function renderSportsGrid(){
  const grid = document.getElementById('sportsGrid');
  if(!grid) return;
  const filtered = SPORT_DATA.filter(s=>{
    const gOk = _activeGender==='all' || s.gender===_activeGender || s.gender==='both';
    const lOk = _activeLevel==='all' || s.levels.includes(_activeLevel);
    return gOk && lOk;
  });
  grid.innerHTML = filtered.map(s=>`
    <div onclick="showSportDetail('${s.id}')" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:.9rem 1rem;cursor:pointer;transition:all .2s;" onmouseover="this.style.borderColor='var(--c)'" onmouseout="this.style.borderColor='rgba(255,255,255,.07)'">
      <div style="font-size:1.6rem;margin-bottom:.3rem;">${s.emoji}</div>
      <div style="font-size:.85rem;font-weight:800;color:var(--tx);">${s.name}</div>
      <div style="font-size:.7rem;color:var(--tx2);margin-top:.2rem;">${s.levels.map(l=>l==='ms'?'Middle School':l==='hs'?'High School':'College').join(' · ')}</div>
    </div>
  `).join('');
}

function showSportDetail(id){
  const s = SPORT_DATA.find(x=>x.id===id);
  if(!s) return;
  const modal = document.getElementById('sportDetailModal') || createSportModal();
  modal.querySelector('#sdTitle').textContent = s.emoji+' '+s.name;
  modal.querySelector('#sdDesc').textContent  = s.desc;
  modal.querySelector('#sdScholarship').innerHTML = `
    <b style="color:#f5a623;">🎓 Scholarships:</b> ${s.scholarship.pct} of HS athletes receive one. Avg: ${s.scholarship.avg}.<br><span style="color:var(--tx2);">${s.scholarship.note}</span>`;
  modal.querySelector('#sdHealth').innerHTML = `
    <b style="color:#f87171;">⚠️ Common Injuries:</b> ${s.health.injuries}<br>
    <b style="color:#22c55e;">✅ Prevention:</b> ${s.health.prevention}`;
  modal.querySelector('#sdDev').textContent = s.development;
  modal.style.display = 'flex';
}

function createSportModal(){
  const m = document.createElement('div');
  m.id = 'sportDetailModal';
  m.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;align-items:center;justify-content:center;padding:1rem;';
  m.innerHTML = `
    <div style="background:#131927;border:1px solid rgba(255,255,255,.1);border-radius:20px;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;padding:1.4rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem;">
        <div style="font-size:1.1rem;font-weight:900;color:var(--tx);" id="sdTitle"></div>
        <button onclick="document.getElementById('sportDetailModal').style.display='none'" style="background:rgba(255,255,255,.08);border:none;border-radius:50%;width:28px;height:28px;color:var(--tx);cursor:pointer;font-size:1rem;">✕</button>
      </div>
      <div style="font-size:.82rem;color:var(--tx2);margin-bottom:.8rem;line-height:1.6;" id="sdDesc"></div>
      <div style="font-size:.78rem;line-height:1.7;margin-bottom:.7rem;" id="sdScholarship"></div>
      <div style="font-size:.78rem;line-height:1.7;margin-bottom:.7rem;" id="sdHealth"></div>
      <div style="font-size:.78rem;color:var(--tx2);line-height:1.6;" id="sdDev"></div>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e=>{ if(e.target===m) m.style.display='none'; });
  return m;
}

/* ── Main tab switcher ─────────────────────────────────────── */
function sportMainTab(tab, btn){
  document.querySelectorAll('#s-sports > .tabs > .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sp-explore').style.display = tab==='explore' ? '' : 'none';
  document.getElementById('sp-mine').style.display    = tab==='mine'    ? '' : 'none';
  if(tab==='mine') renderMySports();
}

/* ── My Sports — localStorage ──────────────────────────────── */
function getMySports(){ try{ return JSON.parse(localStorage.getItem('mySports')||'[]'); }catch(e){ return []; } }
function saveMySports(arr){ localStorage.setItem('mySports', JSON.stringify(arr)); }

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
  const sports = getMySports();
  if(!sports.length){
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--tx2);font-size:.82rem;">No sports added yet. Add your first sport above! 🏅</div>`;
    return;
  }
  container.innerHTML = sports.map(s=>{
    const data = s.dataId ? SPORT_DATA.find(x=>x.id===s.dataId) : null;
    const seasons = s.seasons||[];

    // Build seasons table rows
    const hasSeasons = seasons.length > 0;
    const allKeys = hasSeasons
      ? [...new Set(seasons.flatMap(ss=>Object.keys(ss.stats||{})).filter(k=>seasons.some(ss=>ss.stats&&ss.stats[k])))]
      : [];
    const fields = data && data.statFields ? data.statFields : [];

    const tableHtml = hasSeasons ? `
      <div style="overflow-x:auto;margin-top:.6rem;">
        <table style="width:100%;border-collapse:collapse;font-size:.75rem;">
          <thead>
            <tr style="background:#1a2235;">
              <th style="text-align:left;padding:.4rem .6rem;color:var(--tx2);font-weight:700;font-size:.65rem;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid rgba(255,255,255,.1);">Season</th>
              ${allKeys.map(k=>{
                const f = fields.find(f=>f.key===k);
                return `<th style="text-align:center;padding:.4rem .5rem;color:var(--tx2);font-weight:700;font-size:.65rem;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid rgba(255,255,255,.1);">${f?f.label:k}</th>`;
              }).join('')}
              <th style="text-align:center;padding:.4rem .5rem;color:var(--tx2);font-weight:700;font-size:.65rem;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid rgba(255,255,255,.1);"></th>
            </tr>
          </thead>
          <tbody>
            ${seasons.map((ss,i)=>`
              <tr style="background:${i%2===0?'rgba(255,255,255,.03)':'rgba(255,255,255,.015)'};border-bottom:1px solid rgba(255,255,255,.05);">
                <td style="padding:.45rem .6rem;color:var(--tx);font-weight:700;white-space:nowrap;">${ss.seasonLabel||'Season '+(i+1)}</td>
                ${allKeys.map(k=>`<td style="text-align:center;padding:.45rem .5rem;color:var(--c);font-weight:800;">${(ss.stats&&ss.stats[k])||'—'}</td>`).join('')}
                <td style="text-align:center;padding:.45rem .4rem;">
                  <button onclick="deleteSeasonStat(${s.id},${i})" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:.8rem;padding:.1rem .3rem;">✕</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>` : `<div style="font-size:.75rem;color:var(--tx2);padding:.5rem 0;">No seasons logged yet.</div>`;

    return `
    <div style="background:var(--s1,#131927);border:1px solid rgba(255,255,255,.1);border-radius:14px;margin-bottom:.8rem;overflow:hidden;">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:.7rem;padding:.8rem 1rem;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08);">
        <div style="font-size:1.6rem;">${s.emoji}</div>
        <div style="flex:1;">
          <div style="font-size:.9rem;font-weight:900;color:var(--tx);">${escapeHtml(s.name)}</div>
          <div style="font-size:.7rem;color:var(--tx2);margin-top:.1rem;">${escapeHtml([s.team,s.position,s.level,s.season,s.year].filter(Boolean).join(' · ')||'No details added')}</div>
        </div>
        <div style="display:flex;gap:.35rem;">
          <button onclick="openSportEditor(${s.id})" style="background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.25);border-radius:7px;padding:.3rem .65rem;color:#38bdf8;font-size:.7rem;cursor:pointer;font-weight:700;">✏️ Edit</button>
          <button onclick="deleteMySport(${s.id})" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:7px;padding:.3rem .55rem;color:#f87171;font-size:.7rem;cursor:pointer;">✕</button>
        </div>
      </div>
      <!-- Season Stats Table -->
      <div style="padding:.7rem 1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;">
          <div style="font-size:.65rem;font-weight:800;color:var(--c);text-transform:uppercase;letter-spacing:1px;">📊 Season Stats</div>
          <button onclick="openSeasonEditor(${s.id})" style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);border-radius:7px;padding:.25rem .65rem;color:#22c55e;font-size:.68rem;cursor:pointer;font-weight:700;">+ Add Season</button>
        </div>
        ${tableHtml}
      </div>
    </div>`;
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
  m.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;align-items:center;justify-content:center;padding:1rem;';
  m.innerHTML=`
    <div style="background:#131927;border:1px solid rgba(255,255,255,.1);border-radius:20px;max-width:460px;width:100%;max-height:85vh;overflow-y:auto;padding:1.4rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <div style="font-size:.95rem;font-weight:900;color:var(--tx);" id="seModalTitle">Sport Profile</div>
        <button onclick="document.getElementById('sportEditorModal').style.display='none'" style="background:rgba(255,255,255,.08);border:none;border-radius:50%;width:28px;height:28px;color:var(--tx);cursor:pointer;font-size:1rem;">✕</button>
      </div>
      <div style="font-size:.75rem;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem;">🏋️ Athletic Profile</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.6rem;">
        <div>
          <label style="font-size:.7rem;color:var(--tx2);">Height</label>
          <input id="seHeight" placeholder='e.g. 6\'2"' style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
        </div>
        <div>
          <label style="font-size:.7rem;color:var(--tx2);">Weight (lbs)</label>
          <input id="seWeight" placeholder='e.g. 185' style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
        </div>
        <div>
          <label style="font-size:.7rem;color:var(--tx2);">GPA</label>
          <input id="seGpa" placeholder='e.g. 3.7' style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
        </div>
        <div>
          <label style="font-size:.7rem;color:var(--tx2);">Graduation Year</label>
          <input id="seGradYear" placeholder='e.g. 2027' style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
        </div>
      </div>
      <div style="font-size:.75rem;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem;">👤 Coach Info</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.6rem;">
        <div>
          <label style="font-size:.7rem;color:var(--tx2);">Coach Name</label>
          <input id="seCoach" placeholder='Coach Smith' style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
        </div>
        <div>
          <label style="font-size:.7rem;color:var(--tx2);">Coach Email</label>
          <input id="seCoachEmail" placeholder='coach@school.edu' style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
        </div>
      </div>
      <div style="font-size:.75rem;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem;">📝 Notes</div>
      <textarea id="seNotes" rows="3" placeholder="Goals, highlights, recruiting notes..." style="width:100%;font-size:.8rem;border-radius:8px;padding:.5rem .7rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);resize:vertical;box-sizing:border-box;margin-bottom:.8rem;"></textarea>
      <button id="seSaveBtn" class="btn bp" style="width:100%;">💾 Save Profile</button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{ if(e.target===m) m.style.display='none'; });
  return m;
}

/* ── Season Stats Editor Modal ─────────────────────────────── */
function openSeasonEditor(sportId){
  const sports = getMySports();
  const sport = sports.find(s=>s.id===sportId);
  if(!sport) return;
  const data  = sport.dataId ? SPORT_DATA.find(x=>x.id===sport.dataId) : null;

  const modal = document.getElementById('seasonEditorModal') || createSeasonEditorModal();

  modal.querySelector('#ssModalTitle').textContent = sport.emoji+' '+sport.name+' — Season Stats';

  // Render existing seasons
  const existing = modal.querySelector('#ssExisting');
  existing.innerHTML = (sport.seasons||[]).length
    ? (sport.seasons||[]).map((ss,i)=>`
        <div style="background:rgba(255,255,255,.04);border-radius:10px;padding:.6rem .8rem;margin-bottom:.4rem;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:.78rem;font-weight:800;color:var(--tx);">${ss.seasonLabel||'Season '+(i+1)}</div>
            <div style="font-size:.68rem;color:var(--tx2);">${Object.entries(ss.stats||{}).filter(([k,v])=>v).map(([k,v])=>{
              const f=data&&data.statFields?data.statFields.find(f=>f.key===k):null;
              return (f?f.label:k)+': '+v;
            }).join(' · ')}</div>
          </div>
          <button onclick="deleteSeasonStat(${sportId},${i})" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:.2rem .5rem;color:#f87171;font-size:.68rem;cursor:pointer;">✕</button>
        </div>
      `).join('')
    : '<div style="font-size:.75rem;color:var(--tx2);text-align:center;padding:.8rem;">No seasons logged yet.</div>';

  // Build stat input fields
  const fields = data && data.statFields
    ? data.statFields
    : [{key:'gp',label:'Games Played',type:'number'},{key:'pts',label:'Points/Score',type:'number'},{key:'note',label:'Note',type:'text'}];

  modal.querySelector('#ssFields').innerHTML = `
    <div style="margin-bottom:.5rem;">
      <label style="font-size:.7rem;color:var(--tx2);">Season Label (e.g. "Fall 2025")</label>
      <input id="ssSeasonLabel" placeholder="Fall 2025" style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;">
      ${fields.map(f=>`
        <div>
          <label style="font-size:.7rem;color:var(--tx2);">${f.label}</label>
          <input id="ssStat_${f.key}" type="${f.type}" placeholder="${f.label}" style="width:100%;font-size:.8rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);box-sizing:border-box;margin-top:.2rem;">
        </div>
      `).join('')}
    </div>`;

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
  m.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;align-items:center;justify-content:center;padding:1rem;';
  m.innerHTML=`
    <div style="background:#131927;border:1px solid rgba(255,255,255,.1);border-radius:20px;max-width:480px;width:100%;max-height:85vh;overflow-y:auto;padding:1.4rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem;">
        <div style="font-size:.95rem;font-weight:900;color:var(--tx);" id="ssModalTitle">Season Stats</div>
        <button onclick="document.getElementById('seasonEditorModal').style.display='none'" style="background:rgba(255,255,255,.08);border:none;border-radius:50%;width:28px;height:28px;color:var(--tx);cursor:pointer;font-size:1rem;">✕</button>
      </div>
      <!-- Existing seasons -->
      <div style="font-size:.75rem;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:.4rem;">📅 Previous Seasons</div>
      <div id="ssExisting" style="margin-bottom:1rem;"></div>
      <!-- Add new season -->
      <div style="font-size:.75rem;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem;">➕ Add New Season</div>
      <div id="ssFields"></div>
      <button id="ssAddBtn" class="btn bp" style="width:100%;margin-top:.8rem;">📈 Save Season Stats</button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{ if(e.target===m) m.style.display='none'; });
  return m;
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderSportsGrid();
});
