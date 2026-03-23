/* =============================================================
   sports.js — 14 sport profiles database, my sports system,
               music practice system, instrument guides,
               music theory, driver checklist
============================================================= */

// ── SPORTS DATABASE ──────────────────────────────────────────
const SPORTS_DB = [
  {name:'Football',icon:'🏈',gender:'boys',levels:['ms','hs','college'],season:'Fall',
   desc:'11-on-11 contact sport requiring strength, speed, and strategy. The most popular high school sport in America with over 1 million participants.',
   prep:'Start with flag football or youth leagues. Focus on speed, agility, and strength training. Learn multiple positions early.',
   health:'High injury risk — concussions, knee/ankle injuries. Proper conditioning, form tackling, and equipment fit are critical.',
   stats:'~1.04M HS players · ~73K college players · 6.5% HS-to-college rate · ~1.6% receive scholarships',
   scholarship:'FBS schools offer 85 full scholarships. FCS offers 63 equivalencies (can split). Start recruiting contact sophomore year.'},
  {name:'Basketball',icon:'🏀',gender:'both',levels:['ms','hs','college'],season:'Winter',
   desc:'Fast-paced 5-on-5 sport. Second most popular high school sport. Requires agility, endurance, and court vision.',
   prep:'Play year-round but cross-train to avoid burnout. Work on ball handling, shooting form, and basketball IQ. AAU circuits increase exposure.',
   health:'Ankle sprains are most common. Knee injuries (ACL) are significant, especially for girls. Proper warm-up and strength training prevent most injuries.',
   stats:'Boys: ~540K HS · ~19K college · 3.5% advance | Girls: ~399K HS · ~17K college · 4.1% advance',
   scholarship:'D1 men: 13 scholarships/team. D1 women: 15. Very competitive — attend camps and showcases.'},
  {name:'Soccer',icon:'⚽',gender:'both',levels:['ms','hs','college'],season:'Fall/Spring',
   desc:'The world\'s most popular sport. Continuous running, technical skill, and team coordination. Growing rapidly in the US.',
   prep:'Club soccer is the primary development pathway. Focus on technical skills (first touch, passing) before tactics. Play futsal in the offseason.',
   health:'Lower leg injuries (shin splints, ankle sprains) and concussions from headers. Girls have 2-3x higher ACL injury rates than boys.',
   stats:'Boys: ~459K HS · ~26K college | Girls: ~394K HS · ~28K college · Fastest growing girls sport',
   scholarship:'D1 men: 9.9 scholarships. D1 women: 14. Many partial scholarships. Club and ODP exposure helps.'},
  {name:'Baseball',icon:'⚾',gender:'boys',levels:['ms','hs','college'],season:'Spring',
   desc:'America\'s pastime. Requires hand-eye coordination, patience, and explosive athleticism. Long season with many games.',
   prep:'Travel ball provides competitive exposure. Focus on mechanics — pitching form is critical to prevent arm injuries. Hit off a tee daily.',
   health:'Overuse injuries dominate, especially for pitchers (UCL tears, shoulder injuries). Follow pitch count guidelines strictly. Tommy John surgery has become common.',
   stats:'~482K HS players · ~36K college · 7.3% advance · Most college baseball players drafted will still go to college',
   scholarship:'D1: 11.7 scholarships (split among ~35 roster spots). Most are partial. Academic money often supplements.'},
  {name:'Softball',icon:'🥎',gender:'girls',levels:['ms','hs','college'],season:'Spring',
   desc:'Fast-pitch softball is highly competitive at the college level. Requires explosive power, quick reflexes, and mental toughness.',
   prep:'Travel ball is essential for recruitment. Focus on pitching or hitting specialization early. Attend showcase tournaments and college camps.',
   health:'Shoulder and arm injuries common in pitchers. Sliding injuries. Proper warm-up routines are essential.',
   stats:'~362K HS players · ~20K college · 5.6% advance',
   scholarship:'D1: 12 scholarships/team. Strong Title IX sport with growing opportunities.'},
  {name:'Track & Field',icon:'🏃',gender:'both',levels:['ms','hs','college'],season:'Spring',
   desc:'Individual and relay events across sprints, distance, jumps, throws, and multi-events. Something for every body type and skill set.',
   prep:'Identify your best events early but stay versatile through middle school. Proper form coaching prevents injuries. Cross-train with swimming or cycling.',
   health:'Overuse injuries (shin splints, stress fractures) common in distance runners. Proper recovery and gradual mileage increases are key.',
   stats:'Boys: ~605K HS · ~29K college | Girls: ~500K HS · ~30K college · Most total college scholarship opportunities of any sport',
   scholarship:'D1 men: 12.6 scholarships. D1 women: 18. Scholarships often split — perform at state/national level for full rides.'},
  {name:'Cross Country',icon:'🏃‍♂️',gender:'both',levels:['ms','hs','college'],season:'Fall',
   desc:'Long-distance running (typically 5K for HS, 6K-10K for college). Requires mental toughness, endurance, and consistent training.',
   prep:'Build mileage gradually — 10% increase per week max. Summer base training is critical. Run easy most days, hard some days.',
   health:'Runner\'s knee, IT band syndrome, stress fractures. Most injuries come from too much too soon. Listen to your body.',
   stats:'Boys: ~270K HS | Girls: ~230K HS · One of the most accessible sports — low equipment cost',
   scholarship:'Combined with Track — D1 women: 18 total. Strong times at state meets attract coaches.'},
  {name:'Volleyball',icon:'🏐',gender:'both',levels:['ms','hs','college'],season:'Fall (girls) / Spring (boys)',
   desc:'Fast-paced net sport requiring vertical explosiveness, quick reactions, and team chemistry. Primarily a girls sport at the HS level but growing for boys.',
   prep:'Club volleyball is the primary pathway. Work on vertical jump, passing fundamentals, and serve receive. Attend college camps and showcases.',
   health:'Ankle sprains, shoulder overuse, knee injuries from jumping. Proper landing mechanics and ankle bracing help prevent injuries.',
   stats:'Girls: ~452K HS · ~17K college · 3.9% advance | Boys: ~62K HS and growing rapidly',
   scholarship:'D1 women: 12 scholarships. D1 men: 4.5. Women\'s volleyball has strong scholarship opportunities.'},
  {name:'Swimming & Diving',icon:'🏊',gender:'both',levels:['ms','hs','college'],season:'Winter',
   desc:'Individual and relay racing in the pool. Zero-impact sport that builds incredible cardiovascular fitness and full-body strength.',
   prep:'Year-round club swimming is standard. Focus on technique before speed — efficiency in the water beats raw power. Learn all four strokes.',
   health:'Shoulder injuries ("swimmer\'s shoulder") from overuse. Ear infections. Generally one of the safest sports with lowest injury rates.',
   stats:'Boys: ~138K HS | Girls: ~174K HS · Highly competitive at college level',
   scholarship:'D1 men: 9.9 scholarships. D1 women: 14. Times are objective — hit target times and coaches will find you.'},
  {name:'Tennis',icon:'🎾',gender:'both',levels:['ms','hs','college'],season:'Fall/Spring',
   desc:'Individual sport played in singles or doubles. Develops discipline, strategic thinking, and fitness. Lifetime sport you can play at any age.',
   prep:'Private lessons accelerate development. Tournament play (USTA Junior) builds ranking. Focus on consistency before power.',
   health:'Tennis elbow, wrist injuries, ankle sprains. Proper racquet size and string tension reduce arm stress.',
   stats:'Boys: ~159K HS | Girls: ~190K HS · Universal sport with college opportunities at all levels',
   scholarship:'D1 men: 4.5 scholarships. D1 women: 8. UTR (Universal Tennis Rating) is the key metric coaches use.'},
  {name:'Wrestling',icon:'🤼',gender:'boys',levels:['ms','hs','college'],season:'Winter',
   desc:'One-on-one combat sport in weight classes. Builds incredible discipline, mental toughness, and functional strength. Girls wrestling is the fastest-growing sport in America.',
   prep:'Start in youth or middle school programs. Learn takedowns and escapes. Strength and conditioning are critical. Weight management must be done safely.',
   health:'Skin infections (impetigo, ringworm) from mat contact. Joint injuries. NEVER cut weight dangerously — it damages developing bodies.',
   stats:'~247K HS boys · Girls wrestling growing 50%+ per year · Strong college opportunities',
   scholarship:'D1: 9.9 scholarships. Many wrestlers also earn strong academic scholarships due to discipline and GPA.'},
  {name:'Golf',icon:'⛳',gender:'both',levels:['ms','hs','college'],season:'Fall/Spring',
   desc:'Individual sport requiring precision, patience, and mental focus. One of the best lifetime sports with strong networking benefits.',
   prep:'Junior golf programs and PGA Junior League. Focus on short game first — putting and chipping win matches. Course management beats distance.',
   health:'Low injury risk. Back and wrist overuse possible. Walking 18 holes is excellent cardiovascular exercise.',
   stats:'Boys: ~152K HS | Girls: ~82K HS · College golf is highly competitive but under-recruited',
   scholarship:'D1 men: 4.5 scholarships. D1 women: 6. Low roster sizes mean good players have real chances.'},
  {name:'Cheerleading',icon:'📣',gender:'both',levels:['ms','hs','college'],season:'Year-round',
   desc:'Combines gymnastics, dance, and stunting. Competitive cheer is one of the most athletic and dangerous sports. Strong college opportunities.',
   prep:'Start with tumbling and gymnastics foundations. Join an All-Star gym for competitive cheer. Flexibility, strength, and trust are essential.',
   health:'Highest catastrophic injury rate of any women\'s sport. Concussions, wrist fractures, ankle injuries. Proper spotting and coaching are non-negotiable.',
   stats:'~400K HS participants · Growing college recognition · Many schools now offer scholarships',
   scholarship:'Varies widely. Some D1 programs offer full scholarships. Competitive programs recruit from All-Star gyms.'},
  {name:'Lacrosse',icon:'🥍',gender:'both',levels:['ms','hs','college'],season:'Spring',
   desc:'Fastest growing team sport in America. Combines elements of soccer, basketball, and hockey. Fast-paced with continuous action.',
   prep:'Start with stick skills — wall ball daily. Join club programs for exposure. The sport is expanding rapidly beyond traditional East Coast hotbeds.',
   health:'Boys: Contact sport with concussion risk. Girls: Non-contact but still has eye and stick injuries. Proper equipment is essential.',
   stats:'Boys: ~113K HS | Girls: ~99K HS · Doubled in participation over the last decade',
   scholarship:'D1 men: 12.6 scholarships. D1 women: 12. Growing sport means growing opportunities.'},
];

let _sportGenderFilter = 'all';
let _sportLevelFilter = 'all';

function filterSports(g, btn){
  _sportGenderFilter = g;
  document.querySelectorAll('#s-sports .tab:not(.bs)').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSports();
}

function filterSportsLevel(l, btn){
  _sportLevelFilter = l;
  document.querySelectorAll('#s-sports .tab.bs').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSports();
}

function renderSports(){
  const el = document.getElementById('sportsGrid'); if(!el) return;
  let list = SPORTS_DB;
  if(_sportGenderFilter !== 'all') list = list.filter(s=>s.gender===_sportGenderFilter || s.gender==='both');
  if(_sportLevelFilter !== 'all') list = list.filter(s=>s.levels.includes(_sportLevelFilter));

  if(!list.length){ el.innerHTML='<div style="color:var(--tx2);font-size:.82rem;padding:1rem;text-align:center;">No sports match this filter.</div>'; return; }

  el.innerHTML = list.map(s=>`
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:1rem;margin-bottom:.6rem;cursor:pointer;" onclick="this.querySelector('.sd').style.display=this.querySelector('.sd').style.display==='none'?'block':'none'">
      <div style="display:flex;align-items:center;gap:.6rem;">
        <span style="font-size:1.5rem;">${s.icon}</span>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:.88rem;">${s.name}</div>
          <div style="font-size:.6rem;color:var(--tx2);">${s.gender==='both'?'Boys & Girls':s.gender==='boys'?'Boys':'Girls'} · ${s.season} · ${s.levels.map(l=>l==='ms'?'MS':l==='hs'?'HS':'College').join(', ')}</div>
        </div>
        <span style="font-size:.6rem;color:var(--tx3);">tap ▼</span>
      </div>
      <div class="sd" style="display:none;margin-top:.7rem;border-top:1px solid rgba(255,255,255,.05);padding-top:.6rem;">
        <div style="font-size:.78rem;color:var(--tx2);line-height:1.6;margin-bottom:.5rem;">${s.desc}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;font-size:.72rem;">
          <div style="background:rgba(34,197,94,.04);border-radius:8px;padding:.5rem;"><div style="font-weight:700;color:#22c55e;font-size:.6rem;margin-bottom:.2rem;">HOW TO PREPARE</div>${s.prep}</div>
          <div style="background:rgba(239,68,68,.04);border-radius:8px;padding:.5rem;"><div style="font-weight:700;color:#ef4444;font-size:.6rem;margin-bottom:.2rem;">HEALTH & SAFETY</div>${s.health}</div>
          <div style="background:rgba(96,165,250,.04);border-radius:8px;padding:.5rem;"><div style="font-weight:700;color:#60a5fa;font-size:.6rem;margin-bottom:.2rem;">BY THE NUMBERS</div>${s.stats}</div>
          <div style="background:rgba(245,166,35,.04);border-radius:8px;padding:.5rem;"><div style="font-weight:700;color:#f5a623;font-size:.6rem;margin-bottom:.2rem;">SCHOLARSHIPS</div>${s.scholarship}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── MY SPORTS SYSTEM ─────────────────────────────────────────// ── MY SPORTS SYSTEM ─────────────────────────────────────────
function sportMainTab(tab, btn){
  document.getElementById('sp-explore').style.display = tab==='explore' ? 'block' : 'none';
  document.getElementById('sp-mine').style.display = tab==='mine' ? 'block' : 'none';
  document.querySelectorAll('#s-sports .tabs:first-of-type .tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  if(tab==='mine') renderMySportsList();
}

function addMySport(){
  const sel = (document.getElementById('mySportSelect')||{}).value;
  const custom = ((document.getElementById('mySportCustom')||{}).value||'').trim();
  const name = custom || sel;
  if(!name){ showToast('Select or type a sport name'); return; }
  const sport = {
    id: Date.now(),
    name,
    team: ((document.getElementById('mySportTeam')||{}).value||'').trim(),
    position: ((document.getElementById('mySportPosition')||{}).value||'').trim(),
    level: (document.getElementById('mySportLevel')||{}).value||'',
    season: (document.getElementById('mySportSeason')||{}).value||'',
    year: ((document.getElementById('mySportYear')||{}).value||'').trim(),
    wins:0, losses:0, ties:0,
    accomplishments:[], schedule:[], notes:'',
    stats:{}, injuries:[], gameNotes:[],
    prepNutrition:'', prepStretching:'', prepNotes:''
  };
  if(!D.mySports) D.mySports = [];
  D.mySports.push(sport);
  save();
  // Clear form
  ['mySportSelect','mySportCustom','mySportTeam','mySportPosition','mySportLevel','mySportSeason','mySportYear'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.value='';
  });
  renderMySportsList();
  showToast(name + ' added! 🏆');
}

function deleteMySport(id){
  if(!confirm('Delete this sport and all its data?')) return;
  D.mySports = (D.mySports||[]).filter(s=>s.id!==id);
  save(); renderMySportsList();
}

function saveMySportField(id, field, val){
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  s[field] = val; save();
}

function saveMySportRecord(id, type, val){
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  const num = parseInt(val)||0;
  s[type] = num; save();
  document.getElementById('ms-record-'+id).textContent = s.wins+'W / '+s.losses+'L'+(s.ties?' / '+s.ties+'T':'');
}

function addMySportAccomplishment(id){
  const inp = document.getElementById('ms-acc-inp-'+id); if(!inp||!inp.value.trim()) return;
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  if(!s.accomplishments) s.accomplishments=[];
  s.accomplishments.push({id:Date.now(), text:inp.value.trim(), date:new Date().toISOString().slice(0,10)});
  inp.value=''; save();
  renderAccomplishments(id);
}

function deleteAccomplishment(sportId, accId){
  const s = (D.mySports||[]).find(x=>x.id===sportId); if(!s) return;
  s.accomplishments = (s.accomplishments||[]).filter(a=>a.id!==accId);
  save(); renderAccomplishments(sportId);
}

function renderAccomplishments(id){
  const el = document.getElementById('ms-acc-list-'+id); if(!el) return;
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  const list = s.accomplishments||[];
  el.innerHTML = list.length ? list.map(a=>`
    <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.15);border-radius:8px;padding:.4rem .6rem;margin-bottom:.25rem;">
      <div>
        <div style="font-size:.78rem;color:var(--tx);">🏅 ${a.text}</div>
        <div style="font-size:.55rem;color:var(--tx3);">${a.date}</div>
      </div>
      <button onclick="deleteAccomplishment(${id},${a.id})" style="font-size:.55rem;color:var(--tx3);background:none;border:none;cursor:pointer;">🗑</button>
    </div>`).join('')
    : '<div style="font-size:.7rem;color:var(--tx3);padding:.3rem;">No accomplishments yet — add your first!</div>';
}

function addGameToSchedule(id){
  const opp = document.getElementById('ms-sched-opp-'+id);
  const dt = document.getElementById('ms-sched-date-'+id);
  const loc = document.getElementById('ms-sched-loc-'+id);
  if(!opp||!opp.value.trim()) return;
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  if(!s.schedule) s.schedule=[];
  s.schedule.push({id:Date.now(), opponent:opp.value.trim(), date:dt?dt.value:'', location:loc?loc.value:'', result:'', notes:''});
  opp.value=''; if(dt) dt.value=''; if(loc) loc.value='';
  save(); renderSchedule(id);
}

function updateGameResult(sportId, gameId, result){
  const s = (D.mySports||[]).find(x=>x.id===sportId); if(!s) return;
  const g = (s.schedule||[]).find(x=>x.id===gameId); if(!g) return;
  g.result = result; save();
  // update W/L record
  s.wins = (s.schedule||[]).filter(g=>g.result==='W').length;
  s.losses = (s.schedule||[]).filter(g=>g.result==='L').length;
  s.ties = (s.schedule||[]).filter(g=>g.result==='T').length;
  save();
  const rec = document.getElementById('ms-record-'+sportId);
  if(rec) rec.textContent = s.wins+'W / '+s.losses+'L'+(s.ties?' / '+s.ties+'T':'');
}

function deleteGame(sportId, gameId){
  const s = (D.mySports||[]).find(x=>x.id===sportId); if(!s) return;
  s.schedule = (s.schedule||[]).filter(g=>g.id!==gameId);
  save(); renderSchedule(sportId);
}

function renderSchedule(id){
  const el = document.getElementById('ms-sched-list-'+id); if(!el) return;
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  const list = (s.schedule||[]).sort((a,b)=>a.date>b.date?1:-1);
  if(!list.length){ el.innerHTML='<div style="font-size:.7rem;color:var(--tx3);padding:.3rem;">No games scheduled yet.</div>'; return; }
  const today = new Date().toISOString().slice(0,10);
  el.innerHTML = list.map(g=>{
    const isPast = g.date && g.date < today;
    const isNext = !isPast && list.find(x=>!x.date||x.date>=today)===g;
    const rColors = {W:'#22c55e',L:'#ef4444',T:'#f5a623','':'#a78bfa'};
    const bg = isNext ? 'rgba(56,189,248,.06)' : 'rgba(255,255,255,.02)';
    const bd = isNext ? 'rgba(56,189,248,.2)' : 'rgba(255,255,255,.05)';
    const resultColor = rColors[g.result]||'var(--tx)';
    const rbColor = g.result==='W'?'34,197,94':g.result==='L'?'239,68,68':'255,255,255';
    const opponentLabel = (isNext ? '⚡ NEXT: ' : '') + g.opponent;
    const dateLine = (g.date||'Date TBD') + (g.location ? ' · '+g.location : '');
    let rightCol;
    if(isPast){
      rightCol = '<select onchange="updateGameResult('+id+','+g.id+',this.value)" style="font-size:.7rem;border-radius:6px;padding:.2rem .4rem;background:var(--input-bg);border:1px solid rgba('+rbColor+',.3);color:'+resultColor+';font-weight:700;">'
        +'<option value=""'+(g.result?'':' selected')+'>Result</option>'
        +'<option value="W"'+(g.result==='W'?' selected':'')+'>Win ✅</option>'
        +'<option value="L"'+(g.result==='L'?' selected':'')+'>Loss ❌</option>'
        +'<option value="T"'+(g.result==='T'?' selected':'')+'>Tie 🤝</option>'
        +'</select>';
    } else {
      rightCol = '<span style="font-size:.65rem;color:#38bdf8;font-weight:700;">Upcoming</span>';
    }
    return '<div style="background:'+bg+';border:1px solid '+bd+';border-radius:10px;padding:.5rem .7rem;margin-bottom:.3rem;">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;gap:.4rem;">'
        +'<div style="flex:1;">'
          +'<div style="font-size:.78rem;font-weight:700;">'+opponentLabel+'</div>'
          +'<div style="font-size:.6rem;color:var(--tx3);">'+dateLine+'</div>'
        +'</div>'
        +rightCol
        +'<button onclick="deleteGame('+id+','+g.id+')" style="font-size:.55rem;color:var(--tx3);background:none;border:none;cursor:pointer;">🗑</button>'
      +'</div>'
    +'</div>';
  }).join('');
}

// Sport-specific stats fields
const SPORT_STAT_FIELDS = {
  'Football':      ['Touchdowns','Yards','Tackles','Sacks','Interceptions','Receptions'],
  'Basketball':    ['Points','Rebounds','Assists','Steals','Blocks','FG%','3PT%','FT%'],
  'Soccer':        ['Goals','Assists','Shots','Saves','Yellow Cards','Minutes Played'],
  'Baseball':      ['Batting Avg','Home Runs','RBIs','ERA','Strikeouts','Walks'],
  'Softball':      ['Batting Avg','Home Runs','RBIs','ERA','Strikeouts','Walks'],
  'Wrestling':     ['Wins','Pins','Tech Falls','Major Decisions','Takedowns','Escapes'],
  'Track & Field': ['Event','Personal Record','Season Best','State Rank'],
  'Cross Country': ['5K PR','Season Best','Team Finish','State Rank'],
  'Volleyball':    ['Kills','Aces','Digs','Blocks','Assists','Hitting %'],
  'Swimming':      ['Event','Personal Record','Season Best','State Qualifier'],
  'Tennis':        ['Match Record','UTR Rating','Aces','Unforced Errors'],
  'Golf':          ['Avg Score','Best Round','Handicap','Birdies','Eagles'],
  'Lacrosse':      ['Goals','Assists','Ground Balls','Saves','Shots'],
  'MMA':           ['Wins','Losses','Knockouts','Submissions','Decisions','Takedowns','Takedown Defense %'],
  'Boxing':        ['Wins','Losses','KOs','TKOs','Rounds Fought','Punches Landed','Punch Accuracy %'],
  'Jiu-Jitsu':     ['Wins','Losses','Submissions','Points Scored','Advantages','Competition Level','Belt/Stripe'],
  'Judo':          ['Wins','Losses','Ippons','Waza-ari','Competition Level','Rank/Belt'],
  'Karate':        ['Wins','Losses','Points Scored','Competition Level','Belt Rank'],
  'Taekwondo':     ['Wins','Losses','Points Scored','Kicks Landed','Competition Level','Belt Rank'],
  'Martial Arts':  ['Competition Record','Belt/Rank','Techniques Learned','Competition Level','Tournament Placements'],
  'default':       ['Stat 1','Stat 2','Stat 3','Stat 4']
};

// Prep reference data by sport
const SPORT_PREP_REF = {
  'Football': {
    nutrition: {text:'Focus on carbohydrate loading 2-3 days before game day. Prioritize lean protein (chicken, turkey, eggs) for muscle repair post-practice. Stay hydrated — aim for half your body weight in ounces of water daily.', links:[{label:'NATA Nutrition for Athletes',url:'https://www.nata.org'},{label:'CDC Heat & Hydration',url:'https://www.cdc.gov/niosh/topics/heatstress'}]},
    stretching: {text:'Dynamic warm-up before practice (leg swings, hip circles, high knees). Static stretching after practice — hold each stretch 20-30 seconds. Focus on hip flexors, hamstrings, and shoulders.', links:[{label:'NSCA Dynamic Warm-Up Guide',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching Basics',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Most common: concussions, ACL tears, ankle sprains, shoulder dislocations. Never return to play same day after a head injury. RICE method (Rest, Ice, Compression, Elevation) for acute sprains. Always report symptoms to a certified athletic trainer.', links:[{label:'CDC Heads Up — Concussion in Youth Sports',url:'https://www.cdc.gov/headsup'},{label:'NATA Sports Injury Prevention',url:'https://www.nata.org'}]}
  },
  'Wrestling': {
    nutrition: {text:'Maintain healthy weight — dangerous cutting is banned and harmful to developing bodies. Eat balanced meals with adequate protein (0.7-1g per lb body weight). Never fast or dehydrate to make weight.', links:[{label:'NATA Weight Management in Wrestling',url:'https://www.nata.org'},{label:'NIH Youth Athlete Nutrition',url:'https://www.nih.gov'}]},
    stretching: {text:'Full-body dynamic warm-up essential — bridges, hip rotations, sprawls. Post-practice static stretching for neck, shoulders, hips, and lower back. Yoga is excellent cross-training for wrestlers.', links:[{label:'NSCA Flexibility Training',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Skin infections (ringworm, impetigo) — inspect mat daily, shower immediately after practice, report any skin lesion. Joint injuries: shoulder, knee, ankle. Neck strain common — strengthen neck muscles.', links:[{label:'CDC Skin Infections in Wrestling',url:'https://www.cdc.gov'},{label:'NATA Injury Prevention',url:'https://www.nata.org'}]}
  },
  'MMA': {
    nutrition: {text:'MMA demands both aerobic and anaerobic energy systems. Eat 2-3 hours before training: complex carbs + lean protein. Post-training recovery meal within 45 min. Weight cutting is dangerous — work with a sports dietitian. Protein needs: 0.8-1g per lb body weight.', links:[{label:'NIH Sports Nutrition',url:'https://www.nih.gov'},{label:'NSCA Strength & Conditioning',url:'https://www.nsca.com'},{label:'CDC Healthy Weight',url:'https://www.cdc.gov/healthyweight'}]},
    stretching: {text:'Dynamic warm-up critical for MMA — hip circles, shoulder rolls, neck rotations, sprawl drills. Mobility work for hips and shoulders essential for grappling. Brazilian Jiu-Jitsu requires extreme hip flexibility. Cool down with static stretching 10-15 min after every session.', links:[{label:'NSCA Flexibility Guidelines',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'High injury risk: concussions, cauliflower ear, broken nose, shoulder dislocations, knee injuries (ACL, MCL), rib fractures. Never spar with head injuries. Tap early in training — protecting your training partner is the culture of good gyms. Use proper headgear and mouthguard always.', links:[{label:'CDC Heads Up Concussion',url:'https://www.cdc.gov/headsup'},{label:'NATA Sports Injury Resources',url:'https://www.nata.org'},{label:'CDC Youth Sports Safety',url:'https://www.cdc.gov/physicalactivity/sports'}]}
  },
  'Boxing': {
    nutrition: {text:'Boxing is weight-class based — maintain weight through healthy eating, not dangerous cutting. Carb-load 2 days before competition. Protein critical for muscle repair (0.7-1g per lb). Stay hydrated — dehydration severely impacts reaction time and power output.', links:[{label:'NIH Sports Nutrition',url:'https://www.nih.gov'},{label:'USDA MyPlate for Athletes',url:'https://www.myplate.gov'},{label:'CDC Healthy Weight',url:'https://www.cdc.gov/healthyweight'}]},
    stretching: {text:'Warm up with jump rope 5-10 min before any boxing session. Shadow box to activate muscle groups. Stretch shoulders, chest, hip flexors, and wrists after every session. Wrist and hand mobility prevents chronic joint issues from punching.', links:[{label:'NSCA Warm-Up Guidelines',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Head injuries are the primary risk in boxing — always use headgear in sparring, proper mouthguard, and quality gloves. Hand/wrist injuries from improper wrapping technique. Rib bruising common. Never spar when experiencing headache or dizziness. Concussion protocol must be followed strictly.', links:[{label:'CDC Heads Up Concussion',url:'https://www.cdc.gov/headsup'},{label:'NATA Head Injury Protocol',url:'https://www.nata.org'},{label:'NIH Brain Health',url:'https://www.nih.gov'}]}
  },
  'Jiu-Jitsu': {
    nutrition: {text:'BJJ training is intense and full-body — prioritize complex carbohydrates before training for energy and lean protein after for muscle repair. Competition weight cutting is dangerous, especially for youth. Eat real food consistently rather than extreme dieting.', links:[{label:'NIH Youth Athlete Nutrition',url:'https://www.nih.gov'},{label:'USDA MyPlate',url:'https://www.myplate.gov'}]},
    stretching: {text:'Hip mobility is essential for guard work in BJJ. Daily hip flexor, hamstring, and spine stretching dramatically improves performance. Shoulder mobility prevents injuries from arm locks. Yoga is the most popular cross-training activity for BJJ practitioners.', links:[{label:'NSCA Flexibility Training',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Most common BJJ injuries: finger sprains, knee injuries (from guard passing), shoulder strains, and neck strains. TAP EARLY — never try to muscle out of a submission. Ego causes most BJJ injuries. Skin infections (ringworm, staph) — shower immediately post-training, inspect mats.', links:[{label:'NATA Grappling Sports Safety',url:'https://www.nata.org'},{label:'CDC Skin Infections',url:'https://www.cdc.gov'},{label:'CDC Heads Up',url:'https://www.cdc.gov/headsup'}]}
  },
  'Judo': {
    nutrition: {text:'Judo is weight-class based — maintain weight year-round through healthy eating. Pre-competition carbohydrate loading 48 hours out. High protein intake supports the explosive strength demands of throwing techniques.', links:[{label:'NIH Sports Nutrition',url:'https://www.nih.gov'},{label:'NSCA Performance Nutrition',url:'https://www.nsca.com'}]},
    stretching: {text:'Ukemi (breakfall) practice requires full-body flexibility. Stretch shoulders, hips, and lower back daily. Gripping strength and forearm flexibility are critical and often overlooked. Warm up with light randori before intense drilling.', links:[{label:'NSCA Flexibility Guidelines',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Shoulder injuries from throwing and falling. Knee injuries from leg techniques. Proper ukemi (breakfall) technique is the single most important injury prevention skill in judo — master it before anything else.', links:[{label:'NATA Sports Injury Prevention',url:'https://www.nata.org'},{label:'CDC Sports Safety',url:'https://www.cdc.gov/physicalactivity/sports'}]}
  },
  'Karate': {
    nutrition: {text:'Karate training demands explosive power and endurance. Eat balanced meals with adequate carbohydrates for energy and protein for recovery. Pre-tournament nutrition: moderate carbs + protein 2-3 hours before, light snack 1 hour before.', links:[{label:'NIH Sports Nutrition',url:'https://www.nih.gov'},{label:'USDA MyPlate',url:'https://www.myplate.gov'}]},
    stretching: {text:'High kicks require excellent hamstring and hip flexor flexibility. Dynamic warm-up (leg swings, hip circles) before any session. Static post-practice stretching: splits progression, hip flexors, hamstrings, shoulders.', links:[{label:'NSCA Flexibility Training',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Foot/toe injuries from sparring without proper footwear. Wrist injuries from breaking techniques. Knee injuries from improper kicking mechanics. Always use protective gear in sparring (gloves, foot pads, mouthguard, cup).', links:[{label:'NATA Youth Sports Safety',url:'https://www.nata.org'},{label:'CDC Sports Injuries',url:'https://www.cdc.gov/safechild/sports_injuries'}]}
  },
  'Taekwondo': {
    nutrition: {text:'Taekwondo is weight-class based in competition. Focus on lean body composition through balanced nutrition rather than extreme weight cutting. High carbohydrate intake supports the explosive kicking demands. Stay well-hydrated — dehydration reduces reaction speed.', links:[{label:'NIH Youth Athlete Nutrition',url:'https://www.nih.gov'},{label:'USDA MyPlate for Athletes',url:'https://www.myplate.gov'}]},
    stretching: {text:'Flexibility is the foundation of high-level taekwondo. Daily stretching routine: dynamic warm-up (leg swings, hip circles), active stretching during training, passive static stretching after. Work toward full splits for maximum kick range.', links:[{label:'NSCA Flexibility Guidelines',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Knee injuries from spinning kicks — proper technique is the best prevention. Ankle sprains common. Head/face injuries from sparring — always wear WTF-approved headgear and face shield. Concussion protocol applies to all head contact sports.', links:[{label:'CDC Heads Up Concussion',url:'https://www.cdc.gov/headsup'},{label:'NATA Sports Safety',url:'https://www.nata.org'}]}
  },
  'Martial Arts': {
    nutrition: {text:'General martial arts nutrition: maintain healthy body composition through balanced eating. Pre-training: complex carbs + lean protein 2 hours before. Post-training: protein + carbs within 45 min for recovery. Never cut weight dangerously.', links:[{label:'NIH Sports Nutrition',url:'https://www.nih.gov'},{label:'USDA MyPlate',url:'https://www.myplate.gov'}]},
    stretching: {text:'Flexibility varies by discipline — most martial arts benefit from hip, hamstring, and shoulder mobility. Daily stretching accelerates technique development. Dynamic warm-up before every session, static stretching after.', links:[{label:'NSCA Flexibility Training',url:'https://www.nsca.com'},{label:'Mayo Clinic Stretching',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'}]},
    injuries: {text:'Follow your specific discipline safety protocols. Always use required protective equipment. Report all injuries to your instructor. Respect tapping in grappling arts — protect your training partners. Head contact sports require concussion awareness.', links:[{label:'CDC Heads Up Concussion',url:'https://www.cdc.gov/headsup'},{label:'NATA Injury Prevention',url:'https://www.nata.org'},{label:'CDC Youth Sports Safety',url:'https://www.cdc.gov/physicalactivity/sports'}]}
  },
  'Basketball': {
    nutrition: {text:'Complex carbs before games for sustained energy (oatmeal, whole grain pasta). Protein shakes or chocolate milk within 30 min post-workout for recovery. Avoid heavy meals within 2 hours of game time.', links:[{label:'NIH Sports Nutrition Overview',url:'https://www.nih.gov'},{label:'USDA MyPlate for Athletes',url:'https://www.myplate.gov'}]},
    stretching: {text:'Dynamic warm-up: high knees, butt kicks, lateral shuffles, arm circles. Static post-practice: hip flexors, quads, calves, shoulders. Ankle mobility drills daily reduce sprain risk significantly.', links:[{label:'NSCA Warm-Up Guide',url:'https://www.nsca.com'},{label:'Mayo Clinic Exercise Basics',url:'https://www.mayoclinic.org'}]},
    injuries: {text:'ACL tears — especially in female athletes (2-8x higher rate). Ankle sprains most common overall. Finger jams. Proper landing mechanics (land on balls of feet, bend knees) are the best prevention.', links:[{label:'NATA ACL Injury Prevention',url:'https://www.nata.org'},{label:'CDC Youth Sports Safety',url:'https://www.cdc.gov/physicalactivity/sports'}]}
  },
  'default': {
    nutrition: {text:'General athletic nutrition: eat within 1-2 hours before activity (carbs + protein), rehydrate after every session, aim for colorful vegetables and lean proteins daily. Avoid processed foods and sugary drinks on training days.', links:[{label:'NIH Sports Nutrition',url:'https://www.nih.gov'},{label:'USDA MyPlate',url:'https://www.myplate.gov'},{label:'CDC Physical Activity Guidelines',url:'https://www.cdc.gov/physicalactivity'}]},
    stretching: {text:'Always warm up before activity (5-10 min light movement) and cool down after (static stretching 5-10 min). Never stretch cold muscles. Hold stretches 20-30 seconds without bouncing.', links:[{label:'Mayo Clinic Stretching Guide',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931'},{label:'NSCA Foundation',url:'https://www.nsca.com'}]},
    injuries: {text:'Report all injuries to a coach or athletic trainer immediately. Do not play through pain. RICE: Rest, Ice (20 min on/off), Compression, Elevation for sprains. Concussion = stop play immediately, see a doctor before returning.', links:[{label:'CDC Heads Up — Concussion',url:'https://www.cdc.gov/headsup'},{label:'NATA Athletic Trainers',url:'https://www.nata.org'},{label:'CDC Youth Sports Injuries',url:'https://www.cdc.gov/safechild/sports_injuries'}]}
  }
};

function getSportPrep(sportName){ return SPORT_PREP_REF[sportName] || SPORT_PREP_REF['default']; }
function getSportStats(sportName){ return SPORT_STAT_FIELDS[sportName] || SPORT_STAT_FIELDS['default']; }

function renderMySportsList(){
  const el = document.getElementById('mySportsList'); if(!el) return;
  const list = D.mySports||[];
  if(!list.length){
    el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--tx3);font-size:.82rem;">No sports added yet.<br>Add your first sport above! 🏆</div>';
    return;
  }
  el.innerHTML = list.map(s=>{
    const prep = getSportPrep(s.name);
    const statFields = getSportStats(s.name);
    const meta = [s.team,s.position,s.level,s.season,s.year].filter(Boolean).join(' · ');
    const record = (s.wins||0)+'W / '+(s.losses||0)+'L'+(s.ties?' / '+s.ties+'T':'');

    // Sub-tab buttons (no nested backticks)
    const subTabsHtml = ['Stats','Schedule','Accomplishments','Prep','Notes'].map((t,i)=>{
      const bg = i===0 ? 'rgba(56,189,248,.08)' : 'none';
      const bd = i===0 ? '#38bdf8' : 'transparent';
      const cl = i===0 ? '#38bdf8' : 'var(--tx2)';
      return '<button onclick="mySportSubTab('+s.id+',\''+t.toLowerCase()+'\',this)" style="flex:1;padding:.5rem .4rem;font-size:.65rem;font-weight:700;background:'+bg+';border:none;border-bottom:2px solid '+bd+';color:'+cl+';cursor:pointer;white-space:nowrap;min-width:60px;" class="ms-subtab-'+s.id+'">'+t+'</button>';
    }).join('');

    // Stat fields (no nested backticks)
    const statsHtml = statFields.map(f=>{
      const val = (s.stats&&s.stats[f])||'';
      return '<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:.4rem .6rem;">'
        +'<div style="font-size:.58rem;color:var(--tx3);font-weight:700;text-transform:uppercase;margin-bottom:.2rem;">'+f+'</div>'
        +'<input type="text" value="'+val+'" onchange="saveMySportStat('+s.id+',\''+f+'\',this.value)" placeholder="—" style="width:100%;font-size:.82rem;font-weight:700;background:none;border:none;color:var(--tx);outline:none;padding:0;">'
        +'</div>';
    }).join('');

    // Link pills helper
    function linkPills(links){ return links.map(l=>'<a href="'+l.url+'" target="_blank" rel="noopener" style="font-size:.62rem;color:#38bdf8;text-decoration:none;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);border-radius:5px;padding:.2rem .5rem;">🔗 '+l.label+'</a>').join(''); }

    return '<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);border-radius:14px;margin-bottom:1rem;overflow:hidden;">'

      // Header
      +'<div style="background:linear-gradient(135deg,rgba(56,189,248,.1),rgba(139,92,246,.08));padding:.8rem 1rem;display:flex;align-items:center;justify-content:space-between;gap:.5rem;">'
        +'<div><div style="font-size:.95rem;font-weight:900;">🏆 '+s.name+'</div><div style="font-size:.65rem;color:var(--tx2);">'+meta+'</div></div>'
        +'<div style="display:flex;align-items:center;gap:.5rem;">'
          +'<span id="ms-record-'+s.id+'" style="font-size:.78rem;font-weight:700;color:#22c55e;">'+record+'</span>'
          +'<button onclick="deleteMySport('+s.id+')" style="font-size:.65rem;color:#f87171;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:6px;padding:.2rem .5rem;cursor:pointer;">Delete</button>'
        +'</div>'
      +'</div>'

      // Sub-tabs
      +'<div style="display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,.06);overflow-x:auto;">'+subTabsHtml+'</div>'

      // Stats panel
      +'<div id="ms-panel-stats-'+s.id+'" style="padding:.8rem 1rem;">'
        +'<div style="font-size:.72rem;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:1px;margin-bottom:.6rem;">📊 Season Statistics</div>'
        +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.4rem;">'+statsHtml+'</div>'
      +'</div>'

      // Schedule panel
      +'<div id="ms-panel-schedule-'+s.id+'" style="display:none;padding:.8rem 1rem;">'
        +'<div style="font-size:.72rem;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:1px;margin-bottom:.6rem;">📅 Schedule & Results</div>'
        +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.3rem;margin-bottom:.4rem;">'
          +'<input type="text" id="ms-sched-opp-'+s.id+'" placeholder="Opponent..." style="font-size:.72rem;border-radius:7px;padding:.35rem .5rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);">'
          +'<input type="date" id="ms-sched-date-'+s.id+'" style="font-size:.72rem;border-radius:7px;padding:.35rem .5rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);">'
          +'<input type="text" id="ms-sched-loc-'+s.id+'" placeholder="Home/Away..." style="font-size:.72rem;border-radius:7px;padding:.35rem .5rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);">'
          +'<button onclick="addGameToSchedule('+s.id+')" class="btn bp bs" style="font-size:.7rem;">+ Add</button>'
        +'</div>'
        +'<div id="ms-sched-list-'+s.id+'"></div>'
      +'</div>'

      // Accomplishments panel
      +'<div id="ms-panel-accomplishments-'+s.id+'" style="display:none;padding:.8rem 1rem;">'
        +'<div style="font-size:.72rem;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:1px;margin-bottom:.6rem;">🏅 Accomplishments</div>'
        +'<div style="display:flex;gap:.3rem;margin-bottom:.5rem;">'
          +'<input type="text" id="ms-acc-inp-'+s.id+'" placeholder="Add accomplishment (e.g. All-Conference 2025, scored 25 pts...)" style="flex:1;font-size:.75rem;border-radius:8px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);">'
          +'<button onclick="addMySportAccomplishment('+s.id+')" class="btn bp bs" style="font-size:.72rem;">+ Add</button>'
        +'</div>'
        +'<div id="ms-acc-list-'+s.id+'"></div>'
      +'</div>'

      // Prep panel
      +'<div id="ms-panel-prep-'+s.id+'" style="display:none;padding:.8rem 1rem;">'
        +'<div style="font-size:.72rem;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:1px;margin-bottom:.8rem;">🎯 Game/Event Preparation</div>'

        // Nutrition
        +'<div style="background:rgba(34,197,94,.04);border:1px solid rgba(34,197,94,.12);border-radius:10px;padding:.7rem .9rem;margin-bottom:.7rem;">'
          +'<div style="font-size:.72rem;font-weight:800;color:#22c55e;margin-bottom:.3rem;">🥗 Nutrition Reference</div>'
          +'<div style="font-size:.72rem;color:var(--tx2);line-height:1.7;margin-bottom:.4rem;">'+prep.nutrition.text+'</div>'
          +'<div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.5rem;">'+linkPills(prep.nutrition.links)+'</div>'
          +'<textarea placeholder="My nutrition notes for next game/event..." rows="2" onchange="saveMySportField('+s.id+',\'prepNutrition\',this.value)" style="width:100%;font-size:.75rem;border-radius:7px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);resize:vertical;">'+( s.prepNutrition||'')+'</textarea>'
        +'</div>'

        // Hydration
        +'<div style="background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.12);border-radius:10px;padding:.7rem .9rem;margin-bottom:.7rem;">'
          +'<div style="font-size:.72rem;font-weight:800;color:#38bdf8;margin-bottom:.3rem;">💧 Hydration</div>'
          +'<div style="font-size:.72rem;color:var(--tx2);line-height:1.7;margin-bottom:.4rem;">Drink 16-20 oz water 2 hours before activity. 8 oz every 15-20 min during. 24 oz per pound lost after activity. For sessions over 60 min, electrolyte drinks help. Urine should be pale yellow — dark = dehydrated.</div>'
          +'<a href="https://www.cdc.gov/niosh/topics/heatstress" target="_blank" rel="noopener" style="font-size:.62rem;color:#38bdf8;text-decoration:none;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);border-radius:5px;padding:.2rem .5rem;">🔗 CDC Heat &amp; Hydration Guide</a>'
        +'</div>'

        // Stretching
        +'<div style="background:rgba(167,139,250,.04);border:1px solid rgba(167,139,250,.12);border-radius:10px;padding:.7rem .9rem;margin-bottom:.7rem;">'
          +'<div style="font-size:.72rem;font-weight:800;color:#a78bfa;margin-bottom:.3rem;">🤸 Warm-Up &amp; Stretching</div>'
          +'<div style="font-size:.72rem;color:var(--tx2);line-height:1.7;margin-bottom:.4rem;">'+prep.stretching.text+'</div>'
          +'<div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.5rem;">'+linkPills(prep.stretching.links)+'</div>'
          +'<textarea placeholder="My stretching/warm-up routine notes..." rows="2" onchange="saveMySportField('+s.id+',\'prepStretching\',this.value)" style="width:100%;font-size:.75rem;border-radius:7px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);resize:vertical;">'+(s.prepStretching||'')+'</textarea>'
        +'</div>'

        // Injuries
        +'<div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:.7rem .9rem;margin-bottom:.7rem;">'
          +'<div style="font-size:.72rem;font-weight:800;color:#f87171;margin-bottom:.3rem;">🩹 Injury Reference &amp; Tracker</div>'
          +'<div style="font-size:.72rem;color:var(--tx2);line-height:1.7;margin-bottom:.4rem;">'+prep.injuries.text+'</div>'
          +'<div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.5rem;">'+linkPills(prep.injuries.links)+'</div>'
          +'<div style="display:flex;gap:.3rem;margin-bottom:.4rem;">'
            +'<input type="text" id="ms-inj-inp-'+s.id+'" placeholder="Log an injury or concern (e.g. Left ankle sprain 3/15)..." style="flex:1;font-size:.72rem;border-radius:7px;padding:.35rem .5rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);">'
            +'<button onclick="addInjuryLog('+s.id+')" class="btn" style="font-size:.7rem;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#f87171;border-radius:7px;padding:.35rem .6rem;cursor:pointer;">+ Log</button>'
          +'</div>'
          +'<div id="ms-inj-list-'+s.id+'"></div>'
          +'<div style="margin-top:.5rem;padding:.5rem;background:rgba(239,68,68,.06);border-radius:7px;font-size:.62rem;color:#f87171;line-height:1.6;">⚠️ This tracker is for personal notes only. Always report injuries to your coach and consult a licensed medical professional. Do not self-diagnose or delay medical care.</div>'
        +'</div>'

        // Next event prep
        +'<div style="background:rgba(245,166,35,.04);border:1px solid rgba(245,166,35,.12);border-radius:10px;padding:.7rem .9rem;">'
          +'<div style="font-size:.72rem;font-weight:800;color:#f5a623;margin-bottom:.3rem;">⚡ Next Game/Event Prep Notes</div>'
          +'<textarea placeholder="What do I need to focus on? Things to work on, mental prep, equipment check, travel info..." rows="3" onchange="saveMySportField('+s.id+',\'prepNotes\',this.value)" style="width:100%;font-size:.75rem;border-radius:7px;padding:.4rem .6rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);resize:vertical;">'+(s.prepNotes||'')+'</textarea>'
        +'</div>'
      +'</div>'

      // Notes panel
      +'<div id="ms-panel-notes-'+s.id+'" style="display:none;padding:.8rem 1rem;">'
        +'<div style="font-size:.72rem;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:1px;margin-bottom:.6rem;">📝 Coaching Notes &amp; Things to Work On</div>'
        +'<textarea placeholder="Notes from practice, things to improve, feedback from coach, game observations..." rows="6" onchange="saveMySportField('+s.id+',\'notes\',this.value)" style="width:100%;font-size:.78rem;border-radius:9px;padding:.6rem .8rem;background:var(--input-bg);border:1px solid var(--input-border);color:var(--tx);resize:vertical;line-height:1.7;">'+(s.notes||'')+'</textarea>'
      +'</div>'

    +'</div>';
  }).join('');

  // Render dynamic sub-sections
  list.forEach(s=>{
    renderAccomplishments(s.id);
    renderSchedule(s.id);
    renderInjuryLog(s.id);
  });
}

function mySportSubTab(sportId, tab, btn){
  ['stats','schedule','accomplishments','prep','notes'].forEach(t=>{
    const p = document.getElementById('ms-panel-'+t+'-'+sportId);
    if(p) p.style.display = t===tab?'block':'none';
  });
  document.querySelectorAll('.ms-subtab-'+sportId).forEach(b=>{
    b.style.background='none';
    b.style.borderBottom='2px solid transparent';
    b.style.color='var(--tx2)';
  });
  if(btn){
    btn.style.background='rgba(56,189,248,.08)';
    btn.style.borderBottom='2px solid #38bdf8';
    btn.style.color='#38bdf8';
  }
}

function saveMySportStat(id, field, val){
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  if(!s.stats) s.stats={};
  s.stats[field] = val; save();
}

function addInjuryLog(id){
  const inp = document.getElementById('ms-inj-inp-'+id); if(!inp||!inp.value.trim()) return;
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  if(!s.injuries) s.injuries=[];
  s.injuries.push({id:Date.now(), text:inp.value.trim(), date:new Date().toISOString().slice(0,10), resolved:false});
  inp.value=''; save(); renderInjuryLog(id);
}

function renderInjuryLog(id){
  const el = document.getElementById('ms-inj-list-'+id); if(!el) return;
  const s = (D.mySports||[]).find(x=>x.id===id); if(!s) return;
  const list = s.injuries||[];
  el.innerHTML = list.length ? list.map(inj=>`
    <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:7px;padding:.35rem .6rem;margin-bottom:.25rem;">
      <div>
        <span style="font-size:.72rem;color:var(--tx);${inj.resolved?'text-decoration:line-through;opacity:.5':''}">${inj.text}</span>
        <span style="font-size:.55rem;color:var(--tx3);margin-left:.5rem;">${inj.date}</span>
      </div>
      <div style="display:flex;gap:.3rem;align-items:center;">
        <button onclick="toggleInjuryResolved(${id},${inj.id})" style="font-size:.55rem;color:${inj.resolved?'var(--tx3)':'#22c55e'};background:none;border:none;cursor:pointer;">${inj.resolved?'↩ Reopen':'✅ Resolved'}</button>
        <button onclick="deleteInjuryLog(${id},${inj.id})" style="font-size:.55rem;color:var(--tx3);background:none;border:none;cursor:pointer;">🗑</button>
      </div>
    </div>`).join('')
    : '<div style="font-size:.7rem;color:var(--tx3);padding:.3rem;">No injuries logged — stay healthy! 💪</div>';
}

function toggleInjuryResolved(sportId, injId){
  const s = (D.mySports||[]).find(x=>x.id===sportId); if(!s) return;
  const inj = (s.injuries||[]).find(x=>x.id===injId); if(!inj) return;
  inj.resolved = !inj.resolved; save(); renderInjuryLog(sportId);
}

function deleteInjuryLog(sportId, injId){
  const s = (D.mySports||[]).find(x=>x.id===sportId); if(!s) return;
  s.injuries = (s.injuries||[]).filter(x=>x.id!==injId);
  save(); renderInjuryLog(sportId);
}

// ── MUSIC PRACTICE SYSTEM ────────────────────────────────────
function addMyInstrument(){
  const sel = document.getElementById('addInstrument');
  const instr = (sel||{}).value;
  if(!instr){ showToast('Select an instrument'); return; }
  const goal = parseInt((document.getElementById('practiceGoalMin')||{}).value)||0;
  if(!D.myInstruments) D.myInstruments=[];
  if(D.myInstruments.find(i=>i.name===instr)){ showToast('Already added'); return; }
  D.myInstruments.push({name:instr, goalMin:goal, totalMin:0});
  sel.value='';
  save(); renderMyInstruments(); updatePracticeSelects();
  showToast(instr+' added ✓');
}

function removeMyInstrument(name){
  D.myInstruments = (D.myInstruments||[]).filter(i=>i.name!==name);
  save(); renderMyInstruments(); updatePracticeSelects();
}

function renderMyInstruments(){
  const el = document.getElementById('myInstrumentsList'); if(!el) return;
  const list = D.myInstruments||[];
  if(!list.length){ el.innerHTML='<div style="font-size:.72rem;color:var(--tx2);padding:.3rem;">Add your first instrument above!</div>'; return; }

  const weekStart = new Date(); weekStart.setDate(weekStart.getDate()-weekStart.getDay());
  const ws = weekStart.toISOString().slice(0,10);

  el.innerHTML = list.map(i=>{
    const weekMins = (D.practiceSessions||[]).filter(s=>s.instrument===i.name && s.date>=ws).reduce((a,s)=>a+s.mins,0);
    const pct = i.goalMin>0 ? Math.min(100, (weekMins/i.goalMin)*100) : 0;
    return `<div style="display:flex;align-items:center;gap:.5rem;padding:.4rem 0;border-bottom:1px solid rgba(255,255,255,.04);">
      <span style="font-size:.9rem;">${i.name.split(' ')[0]}</span>
      <div style="flex:1;">
        <div style="font-size:.72rem;font-weight:600;">${i.name.split(' ').slice(1).join(' ')}</div>
        ${i.goalMin>0?`<div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:.2rem;"><div style="height:100%;width:${pct}%;background:${pct>=100?'#22c55e':'var(--c)'};border-radius:2px;"></div></div>
      <button class="tut-go-btn" onclick="tutGoTo('s-skills')">👉 Go to Life Skills</button>
        <div style="font-size:.5rem;color:var(--tx2);">${weekMins}/${i.goalMin} min this week</div>`:''}
      </div>
      <button class="btn bda bs" onclick="removeMyInstrument('${i.name}')" style="font-size:.45rem;">✕</button>
    </div>`;
  }).join('');
}

function updatePracticeSelects(){
  const list = D.myInstruments||[];
  const opts = list.map(i=>`<option value="${i.name}">${i.name}</option>`).join('');
  ['practiceInstrSelect','gigInstr'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.innerHTML = opts || '<option>Add an instrument first</option>';
  });
}

let _practiceInterval = null;
let _practiceSecsLeft = 0;

function setPracticeTimer(mins){
  _practiceSecsLeft = mins * 60;
  document.getElementById('practiceTimerDisp').textContent = mins+':00';
}

function startPractice(){
  if(_practiceInterval) return;
  if(_practiceSecsLeft <= 0) _practiceSecsLeft = 30*60;
  _practiceInterval = setInterval(()=>{
    _practiceSecsLeft--;
    if(_practiceSecsLeft <= 0){
      clearInterval(_practiceInterval); _practiceInterval=null;
      document.getElementById('practiceTimerDisp').textContent = '0:00';
      logPracticeSession();
      showToast('Practice complete! Session logged ✓');
      return;
    }
    const m = Math.floor(_practiceSecsLeft/60);
    const s = _practiceSecsLeft%60;
    document.getElementById('practiceTimerDisp').textContent = m+':'+(s<10?'0':'')+s;
  },1000);
}

function stopPractice(){
  if(_practiceInterval){ clearInterval(_practiceInterval); _practiceInterval=null; logPracticeSession(); }
}

function logPracticeSession(){
  const instr = (document.getElementById('practiceInstrSelect')||{}).value;
  if(!instr) return;
  const totalSecs = (D.myInstruments||[]).find(i=>i.name===instr);
  if(!D.practiceSessions) D.practiceSessions=[];
  const mins = Math.max(1, Math.round((30*60 - _practiceSecsLeft)/60));
  D.practiceSessions.push({id:Date.now(), instrument:instr, mins, date:new Date().toISOString().slice(0,10)});
  save(); renderMyInstruments(); renderPracticeWeek();
}

function renderPracticeWeek(){
  const el = document.getElementById('practiceWeekGrid'); if(!el) return;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(weekStart.getDate()-weekStart.getDay());

  const dayData = days.map((d,i)=>{
    const date = new Date(weekStart); date.setDate(date.getDate()+i);
    const ds = date.toISOString().slice(0,10);
    const mins = (D.practiceSessions||[]).filter(s=>s.date===ds).reduce((a,s)=>a+s.mins,0);
    const isToday = date.toDateString()===now.toDateString();
    return {day:d, mins, isToday};
  });

  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:.3rem;text-align:center;">
    ${dayData.map(d=>`<div style="padding:.3rem;border-radius:6px;background:${d.mins>0?'rgba(56,189,248,.08)':'rgba(255,255,255,.02)'};border:1px solid ${d.isToday?'rgba(56,189,248,.2)':'rgba(255,255,255,.04)'};">
      <div style="font-size:.5rem;color:${d.isToday?'var(--c)':'var(--tx2)'};font-weight:700;">${d.day}</div>
      <div style="font-size:.85rem;font-weight:800;color:${d.mins>0?'var(--c)':'var(--tx3)'};">${d.mins||'—'}</div>
      <div style="font-size:.42rem;color:var(--tx2);">${d.mins?'min':''}</div>
    </div>`).join('')}
  </div>`;
}

// ── INSTRUMENT REFERENCE GUIDES ──────────────────────────────
const INSTRUMENT_GUIDES = [
  {name:'Piano / Keyboard',icon:'🎹',family:'Keys',difficulty:'Moderate',range:'A0–C8 (88 keys)',
   desc:'The foundation instrument. Learning piano teaches music theory, reading both clefs, and hand independence. Translates to every other instrument.',
   startAge:'Age 5-7 ideal, but any age works',tips:'Start with proper hand position. Practice scales daily. Learn to read both treble and bass clef simultaneously.'},
  {name:'Acoustic Guitar',icon:'🎸',family:'Strings',difficulty:'Moderate',range:'E2–E6 (standard tuning)',
   desc:'The most popular instrument in the world. Versatile across every genre. Relatively affordable to start.',
   startAge:'Age 8+ (hand size matters)',tips:'Start with nylon strings — easier on fingers. Learn open chords first. Practice chord transitions, not just individual chords.'},
  {name:'Electric Guitar',icon:'🎸',family:'Strings',difficulty:'Moderate',range:'E2–E6+',
   desc:'The backbone of rock, blues, jazz, and pop. Lighter strings than acoustic, but requires an amp. Endless effects and tones.',
   startAge:'Age 8+',tips:'Start on acoustic first for finger strength. Learn power chords and pentatonic scale early. Practice with a metronome.'},
  {name:'Bass Guitar',icon:'🎸',family:'Strings',difficulty:'Moderate',range:'E1–G4',
   desc:'The rhythmic foundation of every band. Often overlooked but always in demand. Connects the drums to the melody.',
   startAge:'Age 10+',tips:'Learn to lock in with the drummer. Practice with a metronome relentlessly. Fingerstyle before pick for most genres.'},
  {name:'Drums',icon:'🥁',family:'Percussion',difficulty:'Moderate',range:'N/A',
   desc:'The heartbeat of music. Develops coordination, timing, and physical fitness. Every band needs a drummer.',
   startAge:'Age 5+ (start with practice pad)',tips:'Start with a practice pad and sticks before a full kit. Rudiments are everything — paradiddles, flams, rolls. Play along to songs.'},
  {name:'Voice / Vocals',icon:'🎤',family:'Vocal',difficulty:'Varies',range:'Depends on voice type',
   desc:'The most personal instrument — you carry it everywhere. Singing develops breath control, ear training, and emotional expression.',
   startAge:'Any age, formal training at 10+',tips:'Breath support is everything. Never strain — if it hurts, stop. Record yourself and listen back. Warm up before every session.'},
  {name:'Violin',icon:'🎻',family:'Strings',difficulty:'Hard',range:'G3–A7',
   desc:'One of the most expressive and demanding instruments. Central to classical, folk, and increasingly modern genres.',
   startAge:'Age 4-6 ideal (Suzuki method)',tips:'Intonation is everything — no frets to guide you. Daily practice is non-negotiable. Quality teacher matters more than quality instrument at the start.'},
  {name:'Cello',icon:'🎻',family:'Strings',difficulty:'Hard',range:'C2–E6',
   desc:'Deep, warm, rich tone. The range closest to the human voice. Beautiful as both solo and ensemble instrument.',
   startAge:'Age 6-8',tips:'Proper posture and bow hold prevent injury. The instrument is large — ensure proper sizing. Listen to Yo-Yo Ma.'},
  {name:'Saxophone',icon:'🎷',family:'Woodwind',difficulty:'Moderate',range:'Bb3–F#6 (alto)',
   desc:'Versatile across jazz, rock, classical, and pop. Relatively easy to produce sound compared to other woodwinds.',
   startAge:'Age 10+ (need adult front teeth)',tips:'Start with alto sax. Embouchure is key — don\'t puff cheeks. Long tones build tone quality. Jazz improv starts with learning blues scale.'},
  {name:'Trumpet',icon:'🎺',family:'Brass',difficulty:'Hard',range:'F#3–D6',
   desc:'The lead voice of brass sections. Requires lip strength and breath control. Used in jazz, classical, marching band, and pop.',
   startAge:'Age 8-10',tips:'Buzz on the mouthpiece daily. Don\'t use pressure — use air support. Range develops slowly — be patient. Practice long tones.'},
  {name:'Flute',icon:'🪈',family:'Woodwind',difficulty:'Moderate',range:'C4–D7',
   desc:'Light, bright, and versatile. Common in concert bands, orchestras, and increasingly in folk and world music.',
   startAge:'Age 8+',tips:'Producing the first sound is the hardest part. Once air stream is consistent, progress is fast. Practice breathing exercises.'},
  {name:'Clarinet',icon:'🪈',family:'Woodwind',difficulty:'Moderate',range:'D3–Bb6',
   desc:'Warm, woody tone with huge range. Staple of concert bands and jazz. Transitions well to saxophone.',
   startAge:'Age 9+',tips:'Reed quality matters — try several. Cover the holes completely. Crossing the "break" between registers takes practice.'},
  {name:'Ukulele',icon:'🪕',family:'Strings',difficulty:'Easy',range:'C4–A5',
   desc:'Small, portable, and fun. Only 4 strings make it one of the easiest string instruments to learn. Great gateway to guitar.',
   startAge:'Age 5+',tips:'Learn 4 chords (C, G, Am, F) and you can play hundreds of songs. Strum patterns matter more than you think.'},
  {name:'Trombone',icon:'🪗',family:'Brass',difficulty:'Moderate',range:'E2–Bb5',
   desc:'The only common brass instrument using a slide instead of valves. Rich, powerful tone. Essential in jazz and concert bands.',
   startAge:'Age 9+ (need arm length)',tips:'Slide positions must be memorized physically. Lip slurs build flexibility. Practice in front of a mirror to check slide position.'},
];

function renderInstrGuides(){
  const el = document.getElementById('instrumentGuides'); if(!el) return;
  const search = (document.getElementById('instrSearch')||{}).value.toLowerCase();
  let list = INSTRUMENT_GUIDES;
  if(search) list = list.filter(i=>i.name.toLowerCase().includes(search) || i.family.toLowerCase().includes(search));

  el.innerHTML = list.map(i=>`
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:1rem;margin-bottom:.5rem;cursor:pointer;" onclick="this.querySelector('.id').style.display=this.querySelector('.id').style.display==='none'?'block':'none'">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span style="font-size:1.3rem;">${i.icon}</span>
        <div style="flex:1;"><div style="font-weight:700;font-size:.85rem;">${i.name}</div><div style="font-size:.58rem;color:var(--tx2);">${i.family} · Difficulty: ${i.difficulty} · Start: ${i.startAge}</div></div>
      </div>
      <div class="id" style="display:none;margin-top:.6rem;border-top:1px solid rgba(255,255,255,.05);padding-top:.5rem;font-size:.75rem;color:var(--tx2);line-height:1.6;">
        <p>${i.desc}</p>
        <p style="margin-top:.4rem;"><b style="color:var(--tx);">Range:</b> ${i.range}</p>
        <p style="margin-top:.4rem;"><b style="color:var(--c);">Tips:</b> ${i.tips}</p>
      </div>
    </div>
  `).join('');
}

// ── MUSIC THEORY BASICS ──────────────────────────────────────
function renderMusicTheory(){
  const el = document.getElementById('theoryContent'); if(!el) return;
  el.innerHTML = `
    <div class="g2">
      <div class="card"><div class="ct">🎵 Notes & the Staff</div>
        <div style="font-size:.78rem;color:var(--tx2);line-height:1.7;">
          <p>Music is written on a <b style="color:var(--tx);">staff</b> — five horizontal lines. Notes sit on or between the lines. The <b>treble clef</b> (𝄞) covers higher notes (right hand on piano). The <b>bass clef</b> (𝄢) covers lower notes (left hand).</p>
          <p style="margin-top:.5rem;"><b style="color:var(--tx);">Note names:</b> A B C D E F G — then they repeat. The distance between two of the same letter (C to C) is called an <b>octave</b>.</p>
          <p style="margin-top:.5rem;"><b style="color:var(--tx);">Sharps (♯) and Flats (♭):</b> Sharp raises a note half a step. Flat lowers it half a step. The black keys on a piano are sharps and flats.</p>
        </div>
      </div>
      <div class="card"><div class="ct">🎼 Rhythm & Time</div>
        <div style="font-size:.78rem;color:var(--tx2);line-height:1.7;">
          <p><b style="color:var(--tx);">Time signature</b> tells you how many beats per measure. 4/4 time (most common) = 4 beats per measure. 3/4 = waltz feel. 6/8 = flowing compound time.</p>
          <p style="margin-top:.5rem;"><b style="color:var(--tx);">Note values:</b> Whole note = 4 beats. Half note = 2 beats. Quarter note = 1 beat. Eighth note = ½ beat. Sixteenth = ¼ beat.</p>
          <p style="margin-top:.5rem;"><b style="color:var(--tx);">Tempo</b> is speed — measured in BPM (beats per minute). 60 BPM = one beat per second. 120 BPM = two beats per second. A metronome is your best friend.</p>
        </div>
      </div>
      <div class="card"><div class="ct">🎹 Scales</div>
        <div style="font-size:.78rem;color:var(--tx2);line-height:1.7;">
          <p>A <b style="color:var(--tx);">scale</b> is a set of notes in order. The two most important:</p>
          <p style="margin-top:.4rem;"><b style="color:var(--c);">Major scale</b> (happy sound): W-W-H-W-W-W-H (W=whole step, H=half step). C Major = all white keys: C D E F G A B C.</p>
          <p style="margin-top:.3rem;"><b style="color:var(--pk);">Minor scale</b> (sad/serious sound): W-H-W-W-H-W-W. A Minor = all white keys: A B C D E F G A.</p>
          <p style="margin-top:.4rem;">Practice scales every day. They are the foundation of every melody, solo, and chord progression in Western music.</p>
        </div>
      </div>
      <div class="card"><div class="ct">🎸 Chords</div>
        <div style="font-size:.78rem;color:var(--tx2);line-height:1.7;">
          <p>A <b style="color:var(--tx);">chord</b> is 3+ notes played together. Built by stacking thirds on top of a root note.</p>
          <p style="margin-top:.4rem;"><b style="color:var(--c);">Major chord</b> = Root + Major 3rd + Perfect 5th (sounds happy). C Major = C-E-G.</p>
          <p style="margin-top:.3rem;"><b style="color:var(--pk);">Minor chord</b> = Root + Minor 3rd + Perfect 5th (sounds sad). A minor = A-C-E.</p>
          <p style="margin-top:.4rem;"><b style="color:var(--tx);">The 4-chord trick:</b> Most pop songs use just 4 chords: I-V-vi-IV. In C major: C-G-Am-F. Learn these on any instrument and you can play hundreds of songs.</p>
        </div>
      </div>
    </div>
  `;
}

function initMusicAndSports(){
  renderMyInstruments(); updatePracticeSelects(); renderPracticeWeek();
  renderInstrGuides(); renderMusicTheory(); renderSports();
}

// ── DRIVER CHECKLIST ─────────────────────────────────────────
const DRIVER_CHECKLIST = [
  'Study the state driver manual',
  'Take practice permit tests online',
  'Pass the written permit test',
  'Complete driver education course',
  'Log supervised practice hours',
  'Practice parking (parallel, perpendicular, angle)',
  'Practice highway merging and lane changes',
  'Practice night driving',
  'Practice driving in rain',
  'Take the road test and pass',
  'Get your license photo taken',
  'Learn to check oil, tires, and fluids',
  'Know what every dashboard warning light means',
  'Set up roadside emergency kit in trunk',
  'Save insurance info and emergency contacts in phone',
];

function renderDriverChecklist(){
  const el = document.getElementById('driverChecklist'); if(!el) return;
  if(!D.driverChecklist) D.driverChecklist = {};
  el.innerHTML = DRIVER_CHECKLIST.map((item,i)=>{
    const done = D.driverChecklist[i];
    return `<div style="display:flex;align-items:center;gap:.5rem;padding:.25rem 0;cursor:pointer;" onclick="toggleDriverCheck(${i})">
      <span style="font-size:.85rem;">${done?'✅':'⬜'}</span>
      <span style="font-size:.75rem;color:${done?'var(--tx2)':'var(--tx)'};${done?'text-decoration:line-through;':''}">${item}</span>
    </div>`;
  }).join('');
  const done = Object.values(D.driverChecklist).filter(Boolean).length;
  el.innerHTML += `<div style="margin-top:.5rem;font-size:.65rem;color:var(--c);font-weight:700;">${done}/${DRIVER_CHECKLIST.length} complete${done>=DRIVER_CHECKLIST.length?' — Road Ready! 🚗✨':''}</div>`;
}

function toggleDriverCheck(i){
  if(!D.driverChecklist) D.driverChecklist = {};
  D.driverChecklist[i] = !D.driverChecklist[i];
  save(); renderDriverChecklist();
}

