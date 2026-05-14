/* =============================================================
   ui.js — Sidebar nav, section routing, toasts, modals, settings,
           check-ins, clock, scripture header, life stage system
============================================================= */

// ── CLOCK ────────────────────────────────────────────────────
function startClock(){
  function tick(){
    const now=new Date();
    const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',hour:'numeric',minute:'2-digit',hour12:true}).formatToParts(now);
    const g=t=>(p.find(x=>x.type===t)||{}).value||'00';
    const te=document.getElementById('clockTime'),ae=document.getElementById('clockAP');
    if(te) te.textContent=g('hour')+':'+g('minute');
    if(ae) ae.textContent=g('dayPeriod')+' · MT';
    const h=parseInt(new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',hour:'numeric',hour12:false}).format(now));
    const gr=h<12?'morning':h<17?'afternoon':'evening';
    const ge=document.getElementById('greet'); if(ge) ge.textContent=gr;
    const de=document.getElementById('heroDate'); if(de) de.textContent=now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone:'America/Denver'});
  }
  tick(); setInterval(tick,30000);
}

// ── SCRIPTURE ────────────────────────────────────────────────
const VERSES=[
  {t:"I can do all things through Christ who strengthens me.",r:"Philippians 4:13"},
  {t:"For God has not given us a spirit of fear, but of power and of love and of a sound mind.",r:"2 Timothy 1:7"},
  {t:"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",r:"Proverbs 3:5-6"},
  {t:"Commit to the LORD whatever you do, and he will establish your plans.",r:"Proverbs 16:3"},
  {t:"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",r:"Joshua 1:9"},
  {t:"For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",r:"Jeremiah 29:11"},
  {t:"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",r:"Colossians 3:23"},
  {t:"No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace.",r:"Hebrews 12:11"},
  {t:"The LORD is my strength and my shield; my heart trusts in him, and he helps me.",r:"Psalm 28:7"},
  {t:"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",r:"Galatians 6:9"},
  {t:"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",r:"Philippians 4:6"},
  {t:"The heart of man plans his way, but the LORD establishes his steps.",r:"Proverbs 16:9"},
  {t:"But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary.",r:"Isaiah 40:31"},
  {t:"The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you.",r:"Zephaniah 3:17"},
  {t:"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.",r:"Matthew 7:7"},
  {t:"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",r:"Ephesians 2:10"},
  {t:"The name of the LORD is a fortified tower; the righteous run to it and are safe.",r:"Proverbs 18:10"},
  {t:"Greater love has no one than this: to lay down one's life for one's friends.",r:"John 15:13"},
  {t:"And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",r:"Romans 8:28"},
  {t:"Even youths grow tired and weary, and young men stumble and fall; but those who hope in the LORD will renew their strength.",r:"Isaiah 40:30-31"},
  {t:"The LORD is close to the brokenhearted and saves those who are crushed in spirit.",r:"Psalm 34:18"},
  {t:"For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",r:"2 Timothy 1:7"},
  {t:"I have been crucified with Christ and I no longer live, but Christ lives in me.",r:"Galatians 2:20"},
  {t:"Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right — think about such things.",r:"Philippians 4:8"},
  {t:"The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures.",r:"Psalm 23:1-2"},
  {t:"This is the day the LORD has made; let us rejoice and be glad in it.",r:"Psalm 118:24"},
  {t:"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",r:"John 3:16"},
  {t:"I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",r:"Psalm 139:14"},
  {t:"Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",r:"1 Corinthians 13:4"},
  {t:"With God all things are possible.",r:"Matthew 19:26"},
];

// Tracks which profile was last rendered on the home dashboard.
// When a different child logs in via PIN, this triggers a clean reload.
let _lastRenderedProfileId = null;

let _verseTimer=null;
function renderVerse(){
  const all=[...VERSES,...(D.verses||[])];
  if(!all.length) return;
  const raw=parseInt(D.verseIdx)||0;
  const idx=((raw%all.length)+all.length)%all.length;
  const v=all[idx]; if(!v) return;
  const te=document.getElementById('scrTxt'),re=document.getElementById('scrRef');
  // Fade transition
  if(te){ te.style.transition='opacity .3s'; te.style.opacity='0'; setTimeout(()=>{ te.textContent='"'+v.t+'"'; te.style.opacity='1'; },250); }
  if(re){ re.style.transition='opacity .3s'; re.style.opacity='0'; setTimeout(()=>{ re.textContent='— '+v.r; re.style.opacity='1'; },250); }
}
function nextVerse(){ D.verseIdx=((D.verseIdx||0)+1); save(); renderVerse(); }
function prevVerse(){ const all=[...VERSES,...(D.verses||[])]; D.verseIdx=((D.verseIdx||0)-1+all.length)%all.length; save(); renderVerse(); }
function addVerse(){ const t=prompt('Enter scripture or quote:'); if(!t) return; const r=prompt('Reference (e.g. John 3:16):'); if(!r) return; if(!D.verses) D.verses=[]; D.verses.push({t:t.trim(),r:r.trim()}); save(); showToast('Verse added! 🙏'); renderVerse(); }
function addVerseFromSettings(){
  const t=(document.getElementById('newVerseText').value||'').trim();
  const r=(document.getElementById('newVerseRef').value||'').trim();
  if(!t){showToast('Enter a scripture or quote');return;}
  if(!D.verses) D.verses=[];
  D.verses.push({t,r:r||'Custom'});
  document.getElementById('newVerseText').value='';
  document.getElementById('newVerseRef').value='';
  save(); renderVerseSettingsList(); renderVerse(); showToast('Scripture added! ✝️');
}
function deleteCustomVerse(i){
  if(!D.verses||!D.verses[i]) return;
  D.verses.splice(i,1); save(); renderVerseSettingsList(); renderVerse();
}
function renderVerseSettingsList(){
  const el=document.getElementById('customVerseList'); if(!el) return;
  if(!(D.verses||[]).length){ el.innerHTML='<div style="font-size:.73rem;color:var(--tx2);padding:.3rem 0;">No custom scriptures yet.</div>'; return; }
  el.innerHTML=D.verses.map((v,i)=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.38rem .5rem;background:rgba(167,139,250,.07);border-radius:7px;margin-bottom:.28rem;">
      <div style="flex:1;min-width:0;"><div style="font-size:.74rem;font-weight:700;color:var(--p);">${escapeHtml(v.r)}</div>
      <div style="font-size:.68rem;color:var(--tx2);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">"${escapeHtml(v.t.substring(0,60))}${v.t.length>60?'…':''}"</div></div>
      <button class="db" onclick="deleteCustomVerse(${i})">✕</button>
    </div>`).join('');
}
function startVerseAutoRotation(){
  clearInterval(_verseTimer); _verseTimer=null;
  const speed=parseInt(D.verseSpeed)||60000;
  if(speed < 5000) return; // safety guard — never run faster than 5 seconds
  _verseTimer=setInterval(()=>{ nextVerse(); },speed);
  const btn=document.getElementById('versePlayBtn'); if(btn) btn.textContent='⏸ Auto-Rotate On';
}
function verseAutoPlay(){
  const btn=document.getElementById('versePlayBtn');
  if(_verseTimer){ clearInterval(_verseTimer); _verseTimer=null; if(btn) btn.textContent='▶ Auto-Rotate Off'; showToast('Auto-rotate paused'); }
  else { startVerseAutoRotation(); showToast('Auto-rotating verses ✝️'); }
}
function setVerseSpeed(v){ D.verseSpeed=parseInt(v); save(); if(_verseTimer) startVerseAutoRotation(); }

// ── NAME ─────────────────────────────────────────────────────
const MODE_LABELS={middle:'Middle School',fresh:'Freshman',mid_hs:'High School',senior:'Senior Year',college:'College',adult:'Young Adult'};

// ── LIFE STAGE SYSTEM — content filtering & learning pathways ──────
const STAGE_CONFIG = {
  middle:{
    label:'Middle School',emoji:'🎒',
    sections:['s-hero','s-cbt','s-school','s-resources','s-schedule','s-calendar','s-health','s-goals','s-skills','s-growing','s-craft','s-journal','s-motivation','s-reading','s-mood','s-chores','s-sports','s-parent','s-worship','s-flashcards'],
    skillCats:['health','dental','cooking','relationships','faith','mental','emergency','family','digital','safety','investing','insurance','travel'],
    careerTags:['all'],
    pathways:[
      {name:'Freshman Foundations',icon:'🎒',desc:'Get ready for high school',items:[
        {type:'skill',cat:'health',title:'Read Health & Body basics'},
        {type:'skill',cat:'cooking',title:'Learn Cooking & Food skills'},
        {type:'skill',cat:'digital',title:'Complete Digital Life lessons'},
        {type:'habit',title:'Log 7 daily check-ins in a row'},
        {type:'reading',title:'Add 3 books to your reading list'},
        {type:'goal',title:'Set and complete your first goal'},
        {type:'journal',title:'Write 5 journal entries'},
        {type:'growing',title:'Read 3 Growing Up topics'},
      ]},
    ]
  },
  fresh:{
    label:'9th Grade',emoji:'📚',
    sections:['s-hero','s-finance','s-cbt','s-school','s-resources','s-schedule','s-calendar','s-health','s-goals','s-skills','s-growing','s-craft','s-journal','s-motivation','s-reading','s-mentors','s-mood','s-contests','s-chores','s-rewards','s-scripture','s-worship','s-flashcards','s-badges','s-driving','s-sports','s-parent'],
    skillCats:['health','dental','cooking','car','relationships','faith','mental','emergency','family','digital','civic','credit','safety','investing','insurance','travel'],
    careerTags:['all'],
    pathways:[
      {name:'High School Launch',icon:'🚀',desc:'Own your freshman year',items:[
        {type:'skill',cat:'credit',title:'Complete Credit & Banking basics'},
        {type:'skill',cat:'civic',title:'Read Civic Life lessons'},
        {type:'skill',cat:'digital',title:'Master Digital Life'},
        {type:'school',title:'Add all your classes and track GPA'},
        {type:'habit',title:'Build a 14-day check-in streak'},
        {type:'reading',title:'Finish 2 books'},
        {type:'mentors',title:'Add 3 key people to My People'},
        {type:'goal',title:'Set 3 goals and complete 1'},
      ]},
    ]
  },
  mid_hs:{
    label:'10th–11th Grade',emoji:'📖',
    sections:['s-hero','s-finance','s-cbt','s-school','s-resources','s-schedule','s-calendar','s-health','s-goals','s-skills','s-growing','s-craft','s-journal','s-motivation','s-resume','s-reading','s-mentors','s-milestones','s-mood','s-contests','s-chores','s-rewards','s-scripture','s-worship','s-flashcards','s-badges','s-driving','s-sports','s-parent'],
    skillCats:['taxes','car','health','dental','cooking','home','career','credit','relationships','faith','mental','civic','emergency','digital','family','college','adulting','safety','investing','insurance','travel'],
    careerTags:['all'],
    pathways:[
      {name:'College & Career Prep',icon:'🎓',desc:'Start planning your future',items:[
        {type:'skill',cat:'college',title:'Complete College & Future lessons'},
        {type:'skill',cat:'career',title:'Read Career & Work skills'},
        {type:'skill',cat:'credit',title:'Master Credit & Banking'},
        {type:'career',title:'Explore 5 careers in Career Explorer'},
        {type:'resume',title:'Build your first resume'},
        {type:'reading',title:'Finish 3 books from recommended list'},
        {type:'milestone',title:'Log 3 milestones'},
        {type:'habit',title:'Build a 30-day streak'},
      ]},
    ]
  },
  senior:{
    label:'Senior Year',emoji:'🎓',
    sections:['s-hero','s-finance','s-cbt','s-school','s-resources','s-schedule','s-calendar','s-health','s-goals','s-skills','s-growing','s-craft','s-journal','s-motivation','s-resume','s-bio','s-reading','s-mentors','s-milestones','s-mood','s-contests','s-chores','s-rewards','s-scripture','s-worship','s-flashcards','s-badges','s-driving','s-sports','s-parent'],
    skillCats:['taxes','car','health','dental','cooking','home','career','credit','relationships','faith','mental','civic','emergency','digital','family','college','legal','adulting','safety','investing','insurance','travel'],
    careerTags:['all'],
    pathways:[
      {name:'Launch Year',icon:'🚀',desc:'Everything you need before you leave',items:[
        {type:'skill',cat:'taxes',title:'Complete Taxes & Filing'},
        {type:'skill',cat:'home',title:'Master Home & Renting'},
        {type:'skill',cat:'car',title:'Complete Car & Driving'},
        {type:'skill',cat:'credit',title:'Finish all Credit & Banking'},
        {type:'resume',title:'Complete your resume'},
        {type:'bio',title:'Build your bio page'},
        {type:'career',title:'Research your top 3 career paths'},
        {type:'college',title:'Complete college/military prep lessons'},
        {type:'milestone',title:'Log 5+ milestones'},
        {type:'reading',title:'Finish 5 books'},
      ]},
    ]
  },
  college:{
    label:'College',emoji:'🏛️',
    sections:['s-hero','s-finance','s-cbt','s-school','s-resources','s-schedule','s-calendar','s-health','s-goals','s-skills','s-growing','s-craft','s-journal','s-motivation','s-resume','s-bio','s-reading','s-mentors','s-milestones','s-mood','s-contests','s-chores','s-rewards','s-scripture','s-worship','s-flashcards','s-badges','s-driving','s-sports','s-parent'],
    skillCats:['taxes','car','health','dental','cooking','home','career','credit','relationships','faith','mental','civic','emergency','digital','family','college','legal','adulting','safety','investing','insurance','travel'],
    careerTags:['all'],
    pathways:[
      {name:'College Success',icon:'🏛️',desc:'Thrive in college and prepare for what is next',items:[
        {type:'skill',cat:'taxes',title:'Master Taxes & Filing'},
        {type:'skill',cat:'home',title:'Complete Home & Renting'},
        {type:'skill',cat:'career',title:'Complete Career & Work'},
        {type:'resume',title:'Polish your professional resume'},
        {type:'bio',title:'Create a shareable bio page'},
        {type:'interview',title:'Log 3 mock interview sessions'},
        {type:'mentors',title:'Build network of 5+ contacts'},
        {type:'reading',title:'Finish 8 books'},
        {type:'milestone',title:'Log 10+ milestones'},
      ]},
    ]
  },
  adult:{
    label:'Young Adult',emoji:'💼',
    sections:['s-hero','s-finance','s-cbt','s-school','s-resources','s-schedule','s-calendar','s-health','s-goals','s-skills','s-growing','s-craft','s-journal','s-motivation','s-resume','s-bio','s-reading','s-mentors','s-milestones','s-mood','s-contests','s-chores','s-rewards','s-scripture','s-worship','s-flashcards','s-badges','s-driving','s-sports','s-parent'],
    skillCats:['taxes','car','health','dental','cooking','home','career','credit','relationships','faith','mental','civic','emergency','digital','family','college','legal','adulting','safety','investing','insurance','travel'],
    careerTags:['all'],
    pathways:[
      {name:'Adulting Mastery',icon:'💼',desc:'Own your life like a pro',items:[
        {type:'skill',cat:'taxes',title:'Finish all 16 Life Skill categories'},
        {type:'resume',title:'Maintain updated resume'},
        {type:'bio',title:'Professional bio page live'},
        {type:'goal',title:'Complete 10 life goals'},
        {type:'reading',title:'Finish 12 books'},
        {type:'milestone',title:'Log 15+ milestones'},
        {type:'mentors',title:'Network of 8+ contacts'},
        {type:'habit',title:'90-day check-in streak'},
      ]},
    ]
  }
};

function applyName(){
  updateStartHereBtn();
  const name=(D.name||'').trim();
  const el=document.getElementById('heroName');
  if(el) el.textContent=name?(name.toUpperCase()):'CHAMPION';
  const ml=document.getElementById('modeLbl'); if(ml) ml.textContent=MODE_LABELS[D.mode||'high']||'High School';
}

function editNameInline(el){
  const old=el.textContent;
  const inp=document.createElement('input');
  inp.value=D.name||'';
  inp.placeholder='Enter your name';
  inp.style.cssText='background:transparent;border:none;border-bottom:2px solid var(--c);color:var(--c);font-family:var(--fh);font-size:2.8rem;letter-spacing:2px;width:100%;outline:none;';
  el.replaceWith(inp); inp.focus(); inp.select();
  inp.onblur=()=>{ const v=inp.value.trim(); if(v) D.name=v; save(); inp.replaceWith(el); applyName(); };
  inp.onkeydown=e=>{ if(e.key==='Enter') inp.blur(); if(e.key==='Escape'){ inp.value=D.name||''; inp.blur(); } };
}

function saveName(){
  const v=(document.getElementById('settingsName').value||'').trim();
  if(v) D.name=v;
  D.mode=document.getElementById('modeSelect').value;
  save(); applyName();
  // Only close settings for parent — child stays in settings after saving
  var _snProf=_profiles&&_activeProfileId?_profiles.find(function(p){return p.id===_activeProfileId;}):null;
  if(!_snProf||_snProf.isParent!==false) closeSettings();
  showToast('Saved! '+(v?'Hello, '+v+'! 👋':''));
}
function setMode(m){ D.mode=m; save(); applyName(); applyStageFilter(); }

function applyStageFilter(){
  // faith_free users skip stage filtering — their sidebar is governed entirely
  // by FAITH_FREE_ALLOWED + buildSideNav. Without this guard, applyStageFilter
  // hides any flat sidebar item not in D.mode's STAGE_CONFIG.sections list,
  // including F1.0+ additions like Worship Playlist.
  if(window._faithFree) return;
  const mode = D.mode||'mid_hs';
  const config = STAGE_CONFIG[mode]||STAGE_CONFIG.mid_hs;

  // Update sidebar nav visibility — handle both flat and grouped items
  NAV_ITEMS.forEach(n=>{
    if(n.isGroup){
      // Check children
      (n.children||[]).forEach(c=>{
        const btn = document.getElementById('ni-'+c.id);
        if(btn) btn.style.display = config.sections.includes(c.id) ? '' : 'none';
      });
    } else {
      if(n.key==='cbt') return; // CBT always visible — never hide it
      const btn = document.getElementById('ni-'+n.id);
      if(btn) btn.style.display = config.sections.includes(n.id) ? '' : 'none';
    }
  });

  // Update home mode badge
  const badge = document.getElementById('heroModeBadge');
  if(badge) badge.style.display = 'none';

  // Render pathway on home
  renderPathway();
}

function renderPathway(){
  const el = document.getElementById('heroPathway'); if(!el) return;
  const mode = D.mode||'mid_hs';
  const config = STAGE_CONFIG[mode]||STAGE_CONFIG.mid_hs;
  const pathway = (config.pathways||[])[0];
  if(!pathway){ el.innerHTML=''; return; }

  const items = pathway.items||[];
  const completed = items.map(item=>{
    switch(item.type){
      case 'skill': return Object.values(D.skillCerts||{}).filter(Boolean).length > 0 && (D.skillCerts||{})[item.cat];
      case 'habit': {
        const target = parseInt((item.title.match(/(\d+)/)||[])[1])||7;
        return (D.streak||0) >= target;
      }
      case 'reading': {
        const target = parseInt((item.title.match(/(\d+)/)||[])[1])||1;
        return (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length >= target;
      }
      case 'goal': {
        const target = parseInt((item.title.match(/(\d+)/)||[])[1])||1;
        return (Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length >= target;
      }
      case 'journal': {
        const target = parseInt((item.title.match(/(\d+)/)||[])[1])||1;
        return (Array.isArray(D.journal)?D.journal:[]).length >= target;
      }
      case 'mentors': {
        const target = parseInt((item.title.match(/(\d+)/)||[])[1])||1;
        return (D.mentors||[]).length >= target;
      }
      case 'milestone': {
        const target = parseInt((item.title.match(/(\d+)/)||[])[1])||1;
        return (D.milestones||[]).length >= target;
      }
      case 'career': return (D.selectedCareers||[]).length >= (parseInt((item.title.match(/(\d+)/)||[])[1])||1);
      case 'resume': return D.resume && D.resume.name;
      case 'bio': return D.bio && D.bio.name;
      case 'school': return (D.classes||[]).length > 0;
      case 'growing': return true; // hard to track reads
      case 'interview': return (D.mockInterviews||[]).length >= (parseInt((item.title.match(/(\d+)/)||[])[1])||1);
      default: return false;
    }
  });

  const done = completed.filter(Boolean).length;
  const pct = items.length ? Math.round((done/items.length)*100) : 0;

  el.innerHTML = `
    <div style="background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.12);border-radius:14px;padding:.9rem 1.2rem;margin-bottom:.8rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;">
        <div>
          <span style="font-size:.9rem;">${pathway.icon}</span>
          <span style="font-family:var(--fh);font-size:.72rem;letter-spacing:1px;color:#a78bfa;font-weight:700;margin-left:.3rem;">${pathway.name.toUpperCase()}</span>
        </div>
        <span style="font-size:.7rem;font-weight:800;color:${pct>=100?'#22c55e':pct>=50?'#fbbf24':'#a78bfa'};">${done}/${items.length} · ${pct}%</span>
      </div>
      <div style="background:rgba(139,92,246,.1);border-radius:5px;height:7px;overflow:hidden;margin-bottom:.6rem;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#8b5cf6,${pct>=100?'#22c55e':'#a78bfa'});border-radius:5px;transition:width .5s;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.2rem .5rem;">
        ${items.map((item,i)=>`<div style="display:flex;align-items:center;gap:.3rem;padding:.2rem 0;">
          <span style="font-size:.7rem;">${completed[i]?'✅':'⬜'}</span>
          <span style="font-size:.6rem;color:${completed[i]?'var(--tx2)':'var(--tx)'};${completed[i]?'text-decoration:line-through;':''}">${item.title}</span>
        </div>`).join('')}
      </div>
      ${pct>=100?'<div style="text-align:center;margin-top:.5rem;font-size:.72rem;color:#22c55e;font-weight:700;">🎉 Pathway Complete!</div>':''}
    </div>
  `;
}

// ── CHECK-INS ────────────────────────────────────────────────
const DEFAULT_HABITS=[
  {key:'prayer',label:'🙏 Prayer',faithOnly:true},{key:'bible',label:'📖 Read Bible',faithOnly:true},
  {key:'workout',label:'💪 Workout'},{key:'water',label:'💧 Drink Water'},
  {key:'noScroll',label:'📵 No Doom-Scroll'},{key:'journal',label:'✍️ Journal'},
  {key:'study',label:'📚 Study'},{key:'grateful',label:'🙌 Gratitude'},
  {key:'sleep',label:'😴 Good Sleep'},{key:'tithe',label:'⛪ Tithe/Give',faithOnly:true},
];

function buildCheckins(){
  const today=new Date().toDateString(), td=(D.checkin||{})[today]||{};
  const faithOn = D.faithMode !== false;
  const all=[...DEFAULT_HABITS,...(D.customHabits||[])].filter(h=>!h.faithOnly || faithOn);
  const el=document.getElementById('checkinGrid'); if(!el) return;
  el.innerHTML=all.map(h=>{
    const done=!!td[h.key];
    const isCustom=D.customHabits&&D.customHabits.find(c=>c.key===h.key);
    return `<div class="chi${done?' done':''}" data-key="${h.key}" onclick="toggleCheckin(this)" style="position:relative;">
      <div style="width:20px;height:20px;border-radius:5px;border:2px solid ${done?'var(--gr)':'rgba(255,255,255,.25)'};background:${done?'var(--gr)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;">
        ${done?'<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7L10 1" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}
      </div>
      <span style="flex:1;font-size:.82rem;">${h.label}</span>
      ${isCustom?`<button class="db" onclick="event.stopPropagation();removeHabit('${h.key}')" style="opacity:.5;font-size:.6rem;padding:0 .2rem;">✕</button>`:''}
    </div>`;
  }).join('');
}

function toggleCheckin(el){
  const key=el.dataset.key, today=new Date().toDateString();
  if(!D.checkin) D.checkin={};
  if(!D.checkin[today]) D.checkin[today]={};
  const done=!D.checkin[today][key];
  D.checkin[today][key]=done;
  el.classList.toggle('done',done);
  const box=el.querySelector('div');
  if(box){
    box.style.borderColor=done?'var(--gr)':'rgba(255,255,255,.25)';
    box.style.background=done?'var(--gr)':'transparent';
    box.innerHTML=done?'<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7L10 1" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>':'';
  }
  updateStreak(); save();
}

function addHabit(){ const l=prompt('New habit (include emoji):'); if(!l) return; const key='c_'+Date.now(); if(!D.customHabits) D.customHabits=[]; D.customHabits.push({key,label:l.trim()}); save(); buildCheckins(); showToast('Habit added! ✅'); }
function removeHabit(key){ D.customHabits=(D.customHabits||[]).filter(h=>h.key!==key); save(); buildCheckins(); }

function updateStreak(){
  const today=new Date().toDateString();
  const done=Object.values((D.checkin||{})[today]||{}).filter(Boolean).length;
  if(done>=4&&D.lastCheckin!==today){ D.streak=(D.streak||0)+1; D.lastCheckin=today; }
  const sc=document.getElementById('streakCount'),sb=document.getElementById('streakBadge'),qs=document.getElementById('qsStreak');
  if(sc) sc.textContent=D.streak||0;
  if(sb) sb.textContent=(D.streak||0)+' days 🔥';
  if(qs) qs.textContent=D.streak||0;
}

function updateQuickStats(){
  const goalSaved=(D.savingsGoals||[]).reduce((a,g)=>a+(g.current||0),0);
  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  set('qsBank','$'+(D.bank||0).toLocaleString());
  set('qsSavAcct','$'+(D.bankSavAcct||0).toLocaleString());
  set('qsGoalSav','$'+goalSaved.toLocaleString());
  set('qsGPA',calcGPA()?calcGPA().toFixed(2):'—');
  updateStreak();
  updateHeroDashboard();
}

// Phase 2.2 — persistent hero compact toggle. D.heroCompact=1 hides full
// stats grid (default), 0 shows it. Reapplied on every hero refresh so the
// state holds across renders and cloud-load.
function applyHeroCompactState(){
  const w = document.getElementById('heroFullStats');
  const link = document.getElementById('heroFullStatsToggle');
  if(!w) return;
  const compact = (typeof D !== 'undefined' && D && D.heroCompact === 0) ? false : true;
  w.style.display = compact ? 'none' : 'block';
  if(link) link.innerHTML = compact ? 'See full stats &rarr;' : 'Hide full stats &uarr;';
}

function toggleHeroFullStats(){
  if(typeof D === 'undefined' || !D) return;
  D.heroCompact = (D.heroCompact === 0) ? 1 : 0;
  if(typeof save === 'function') save();
  applyHeroCompactState();
}

function updateHeroDashboard(){
  // Mom-persona home: render the plain-English headline first.
  // Defined in init.js; null-guard in case of load order.
  if(typeof renderHeroHeadline === 'function') renderHeroHeadline();
  applyHeroCompactState();

  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.innerHTML=v; };

  // ── BILLS ALERT ──
  const now=new Date(), week=new Date(now.getTime()+7*86400000);
  const bills=(D.bills||[]).filter(b=>{
    if(!b.due) return false;
    const d=new Date(b.due+'T00:00:00');
    return d>=now && d<=week;
  });
  if(bills.length>0){
    const total=bills.reduce((a,b)=>a+(parseFloat(b.amt)||0),0);
    set('heroBillAlert','<span style="color:#fbbf24;">⚠️ '+bills.length+' bill'+(bills.length>1?'s':'')+' due<br><span style="font-size:.6rem;">$'+total.toLocaleString()+' this week</span></span>');
  } else {
    set('heroBillAlert','<span style="color:var(--gr);font-size:.65rem;">✓ No bills due</span>');
  }

  // ── SAVINGS GOALS MINI BARS ──
  const sgEl=document.getElementById('heroSavingsGoals');
  if(sgEl){
    const sgs=(D.savingsGoals||[]).slice(0,3);
    if(sgs.length){
      sgEl.innerHTML=sgs.map(g=>{
        const pct=Math.min(100,Math.round(((g.current||0)/Math.max(g.target,1))*100));
        return`<div style="margin-bottom:.4rem;">
          <div style="display:flex;justify-content:space-between;font-size:.58rem;margin-bottom:.15rem;">
            <span style="color:var(--tx2);">${g.emoji||'💰'} ${g.name}</span>
            <span style="color:var(--gr);font-weight:700;">${pct}%</span>
          </div>
          <div style="background:rgba(52,211,153,.1);border-radius:4px;height:5px;overflow:hidden;">
            <div style="height:100%;background:var(--gr);border-radius:4px;width:${pct}%;transition:width .4s;"></div>
          </div>
        </div>`;
      }).join('');
    } else {
      sgEl.innerHTML='';
    }
  }

  // ── CLASS COUNT + ASSIGNMENTS ──
  const classes=(D.classes||[]).length;
  const asg=(D.assignments||[]).filter(a=>!a.done).length;
  if(classes>0){
    set('heroClassCount',classes+' class'+(classes>1?'es':'')+' · <span style="color:'+(asg>0?'#fbbf24':'var(--gr)')+';">'+asg+' due</span>');
  } else {
    set('heroClassCount','<span style="opacity:.5;">Add classes to track</span>');
  }

  // ── WEIGHT + TREND ──
  const wl=(D.weightLog||[]);
  const latest=wl.length?wl[wl.length-1]:null;
  if(latest){
    set('heroWeight',latest.lbs||latest.w||'—');
    if(wl.length>=2){
      const prev=wl[wl.length-2];
      const diff=((latest.lbs||latest.w)-(prev.lbs||prev.w)).toFixed(1);
      const arrow=diff>0?'↑':'↓';
      const color=D.weightGoal==='lose'?(diff<0?'var(--gr)':'#f87171'):(diff>0?'var(--gr)':'#f87171');
      set('heroWeightTrend','<span style="color:'+color+';">'+arrow+' '+Math.abs(diff)+' lbs</span> since last');
    } else {
      set('heroWeightTrend','First weigh-in ✓');
    }
  } else {
    set('heroWeight','—');
    set('heroWeightTrend','<span style="opacity:.5;">Log your first weigh-in</span>');
  }

  // ── GOALS TRACKER WITH PROGRESS ──
  const gtEl=document.getElementById('heroGoalTracker');
  if(gtEl){
    const goals=(Array.isArray(D.goals)?D.goals:[]);
    const active=goals.filter(g=>!g.done);
    const done=goals.filter(g=>g.done);
    if(goals.length){
      const pct=goals.length?Math.round((done.length/goals.length)*100):0;
      let html=`<div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.65rem;">
        <div style="position:relative;width:56px;height:56px;flex-shrink:0;">
          <svg width="56" height="56" style="transform:rotate(-90deg);">
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(251,191,36,.12)" stroke-width="5"/>
            <circle cx="28" cy="28" r="24" fill="none" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"
              stroke-dasharray="${Math.round(150.8*pct/100)} 150.8"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fn);font-size:.75rem;font-weight:900;color:#fbbf24;">${pct}%</div>
        </div>
        <div>
          <div style="font-size:.85rem;font-weight:700;color:var(--tx);">${done.length}/${goals.length} Complete</div>
          <div style="font-size:.62rem;color:var(--tx2);">${active.length} active · ${goals.filter(g=>g.type==='long'&&!g.done).length} long-term</div>
        </div>
      </div>`;
      // Show top 3 active goals
      html+=active.slice(0,3).map(g=>{
        const icon=g.type==='long'?'🏔️':g.type==='short'?'⚡':'🎯';
        return`<div style="display:flex;align-items:center;gap:.5rem;padding:.3rem 0;border-top:1px solid rgba(251,191,36,.06);">
          <span style="font-size:.7rem;">${icon}</span>
          <span style="font-size:.7rem;color:var(--tx);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${g.text||g.name||'Goal'}</span>
          ${g.done?'<span style="font-size:.6rem;color:var(--gr);">✓</span>':''}
        </div>`;
      }).join('');
      if(active.length>3) html+=`<div style="font-size:.6rem;color:var(--tx2);margin-top:.25rem;">+${active.length-3} more</div>`;
      gtEl.innerHTML=html;
    } else {
      gtEl.innerHTML=`<div style="text-align:center;padding:.3rem 0;">
        <div style="font-size:1.6rem;margin-bottom:.3rem;opacity:.5;">🎯</div>
        <div style="font-size:.75rem;color:var(--tx);font-weight:600;margin-bottom:.2rem;">No goals yet</div>
        <div style="font-size:.62rem;color:var(--tx2);line-height:1.4;">Tap to add your first goal</div>
      </div>`;
    }
  }

  // ── UPCOMING EVENTS + BILLS ──
  const upEl=document.getElementById('heroUpcoming');
  if(upEl){
    const today=new Date().toISOString().split('T')[0];
    const events=(D.events||[]).filter(ev=>ev.date>=today).slice(0,4);
    const upBills=(D.bills||[]).filter(b=>b.due&&b.due>=today).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,2);
    let items=[];
    // Events
    events.forEach(ev=>{
      const d=new Date(ev.date+'T00:00:00');
      const dayName=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
      const isToday=ev.date===today;
      items.push({
        date:ev.date,
        html:`<div style="display:flex;align-items:center;gap:.6rem;padding:.35rem 0;${isToday?'':''}">
          <div style="width:38px;text-align:center;flex-shrink:0;">
            <div style="font-size:.5rem;text-transform:uppercase;color:${isToday?'var(--c)':'#64748b'};font-weight:700;letter-spacing:1px;">${isToday?'TODAY':dayName}</div>
            <div style="font-family:var(--fn);font-size:1rem;font-weight:900;color:${isToday?'var(--c)':'var(--tx)'};">${d.getDate()}</div>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:.72rem;font-weight:600;color:var(--tx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ev.title}</div>
            ${ev.time?'<div style="font-size:.58rem;color:#64748b;">'+ev.time+'</div>':''}
          </div>
          <div style="font-size:.75rem;opacity:.3;">📅</div>
        </div>`
      });
    });
    // Bills as upcoming items
    upBills.forEach(b=>{
      const d=new Date(b.due+'T00:00:00');
      const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
      items.push({
        date:b.due,
        html:`<div style="display:flex;align-items:center;gap:.6rem;padding:.35rem 0;">
          <div style="width:38px;text-align:center;flex-shrink:0;">
            <div style="font-size:.5rem;text-transform:uppercase;color:#fbbf24;font-weight:700;letter-spacing:1px;">${mon}</div>
            <div style="font-family:var(--fn);font-size:1rem;font-weight:900;color:#fbbf24;">${d.getDate()}</div>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:.72rem;font-weight:600;color:var(--tx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">💳 ${b.name}</div>
            <div style="font-size:.58rem;color:#fbbf24;font-weight:700;">$${parseFloat(b.amt||0).toLocaleString()}</div>
          </div>
          <div style="font-size:.75rem;opacity:.3;">💰</div>
        </div>`
      });
    });
    items.sort((a,b)=>a.date.localeCompare(b.date));
    if(items.length){
      upEl.innerHTML=items.slice(0,5).map(i=>i.html).join('<div style="border-top:1px solid rgba(56,189,248,.06);"></div>');
    } else {
      upEl.innerHTML='<div style="color:var(--tx2);font-size:.75rem;text-align:center;padding:.5rem 0;">No upcoming events — <span style="color:var(--c);cursor:pointer;" onclick="showSection(\'s-calendar\')">add one</span></div>';
    }
  }

  // ── LIFE SKILLS PROGRESS ──
  const certs=Object.keys(D.skillCerts||{}).length;
  const totalCats=typeof SK_CATS!=='undefined'?SK_CATS.length:16;
  const skillPct=totalCats?Math.round((certs/totalCats)*100):0;
  set('heroSkillsPct',skillPct+'%');
  const barEl=document.getElementById('heroSkillsBar');
  if(barEl) barEl.style.width=skillPct+'%';
  set('heroSkillsDetail','<span>'+certs+' of '+totalCats+' certificates earned</span><span style="color:var(--c);cursor:pointer;" onclick="showSection(\'s-skills\')">Continue learning →</span>');
}

// ── SETTINGS ─────────────────────────────────────────────────
const ALL_SECTIONS=[
  {id:'s-finance',label:'💰 Money Manager'},
  {id:'s-school',label:'📚 School'},{id:'s-resources',label:'📐 School Resources'},{id:'s-schedule',label:'📅 Schedule'},
  {id:'s-calendar',label:'🗓️ Calendar'},{id:'s-health',label:'💪 Health'},
  {id:'s-goals',label:'🎯 Goals'},{id:'s-skills',label:'🧠 Life Skills'},{id:'s-growing',label:'🌱 Growing Up'},
  {id:'s-craft',label:'🎵 Music & Practice'},{id:'s-contests',label:'🏆 Challenges'},{id:'s-rewards',label:'🎁 Rewards'},{id:'s-scripture',label:'✝️ The Well'},{id:'s-worship',label:'🎵 Worship Playlist'},{id:'s-flashcards',label:'📇 Bible Flashcards'},{id:'s-badges',label:'🏅 Badges'},{id:'s-driving',label:'🚗 Driving'},{id:'s-sports',label:'🏆 Sports'},
  {id:'s-journal',label:'✍️ Journal'},{id:'s-motivation',label:'🔥 Fuel Wall'},{id:'s-resume',label:'📄 Jobs/Resume'},{id:'s-bio',label:'🪪 Bio Page'},{id:'s-reading',label:'📖 Reading List'},{id:'s-mentors',label:'🤝 My People'},{id:'s-milestones',label:'🏆 Milestones'},{id:'s-mood',label:'😊 Mood Tracker'},{id:'s-chores',label:'✅ Chores'},
];

function buildToggles(){
  const el=document.getElementById('sectionToggles'); if(!el) return;
  el.innerHTML=ALL_SECTIONS.map(s=>{
    const key=s.id.replace('s-',''), on=(D.sections||{})[key]!==0;
    return`<div class="tr"><span style="font-size:.84rem;">${s.label}</span><button class="tg${on?' on':''}" id="tg-${s.id}" onclick="toggleSec('${s.id}',this)"></button></div>`;
  }).join('');
}

function toggleSec(id,btn){
  const el=document.getElementById(id); if(!el) return;
  const key=id.replace('s-',''), on=!btn.classList.contains('on');
  btn.classList.toggle('on',on); el.style.display=on?'':'none';
  if(!D.sections) D.sections={};
  D.sections[key]=on?1:0; save();
  buildSideNav();
  if(!on && _activeSection===id) showSection('s-hero');
}

// ── HOME BANNER MODE (Scripture vs Motivational vs Off) ──────
const MOTIVATIONAL_QUOTES = [
  ['The only way to do great work is to love what you do.','Steve Jobs'],
  ['Success is not final, failure is not fatal: it is the courage to continue that counts.','Winston Churchill'],
  ['Believe you can and you are halfway there.','Theodore Roosevelt'],
  ['It does not matter how slowly you go as long as you do not stop.','Confucius'],
  ['The future belongs to those who believe in the beauty of their dreams.','Eleanor Roosevelt'],
  ['Discipline is the bridge between goals and accomplishment.','Jim Rohn'],
  ['You miss 100% of the shots you never take.','Wayne Gretzky'],
  ['The best time to plant a tree was 20 years ago. The second best time is now.','Chinese Proverb'],
  ['Hard work beats talent when talent does not work hard.','Tim Notke'],
  ['Your life does not get better by chance. It gets better by change.','Jim Rohn'],
  ['Do something today that your future self will thank you for.','Sean Patrick Flanery'],
  ['The pain you feel today will be the strength you feel tomorrow.','Unknown'],
  ['Dream big. Start small. Act now.','Robin Sharma'],
  ['Winners are not people who never fail, but people who never quit.','Unknown'],
  ['If you want something you have never had, you must do something you have never done.','Thomas Jefferson'],
  ['Small daily improvements over time lead to stunning results.','Robin Sharma'],
  ['The man who moves a mountain begins by carrying small stones.','Confucius'],
  ['Education is the most powerful weapon which you can use to change the world.','Nelson Mandela'],
  ['Be the change you wish to see in the world.','Mahatma Gandhi'],
  ['What you get by achieving your goals is not as important as what you become by achieving them.','Zig Ziglar'],
  ['The only person you are destined to become is the person you decide to be.','Ralph Waldo Emerson'],
  ['Stay hungry. Stay foolish.','Steve Jobs'],
  ['You are never too old to set another goal or to dream a new dream.','C.S. Lewis'],
  ['Courage is not the absence of fear, but the triumph over it.','Nelson Mandela'],
  ['A person who never made a mistake never tried anything new.','Albert Einstein'],
  ['The secret of getting ahead is getting started.','Mark Twain'],
  ['Do not wait for opportunity. Create it.','George Bernard Shaw'],
  ['Great things never come from comfort zones.','Unknown'],
  ['The harder you work for something, the greater you will feel when you achieve it.','Unknown'],
  ['Be so good they cannot ignore you.','Steve Martin'],
];

function setBannerMode(mode){
  D.bannerMode = mode;
  save();
  renderHomeBanner();
  // Update button states
  ['scripture','motivational','off'].forEach(m=>{
    const btn = document.getElementById('bannerMode-'+m);
    if(btn){
      btn.style.background = m===mode ? 'rgba(56,189,248,.15)' : '';
      btn.style.color = m===mode ? '#38bdf8' : '';
      btn.style.borderColor = m===mode ? 'rgba(56,189,248,.3)' : '';
    }
  });
}

function renderHomeBanner(){
  const scrEl = document.getElementById('scrTxt');
  const refEl = document.getElementById('scrRef');
  const bannerWrap = scrEl ? scrEl.closest('div[style*="border-radius"]') : null;
  if(!bannerWrap) return;

  const mode = D.bannerMode || 'scripture';
  if(mode === 'off'){
    bannerWrap.style.display = 'none';
    return;
  }
  bannerWrap.style.display = 'flex';

  if(mode === 'motivational'){
    const idx = Math.floor(Date.now()/(60000*(D.verseSpeedMs||60000)/60000)) % MOTIVATIONAL_QUOTES.length;
    const q = MOTIVATIONAL_QUOTES[idx];
    if(scrEl) scrEl.textContent = q[0];
    if(refEl) refEl.textContent = '— '+q[1];
    // Change the icon
    const iconEl = bannerWrap.querySelector('div[style*="flex-shrink"]');
    if(iconEl && iconEl.textContent.trim()==='✝️') iconEl.textContent = '💪';
  } else {
    // Scripture mode - restore the cross icon
    const iconEl = bannerWrap.querySelector('div[style*="flex-shrink"]');
    if(iconEl && iconEl.textContent.trim()==='💪') iconEl.textContent = '✝️';
  }
}

function toggleScriptureBanner(btn){
  const on=!btn.classList.contains('on');
  btn.classList.toggle('on',on);
  D.hideScripture=on?0:1; save();
  const el=document.getElementById('scriptureBanner');
  if(el) el.style.display=on?'':'none';
}

function applySettings(){
  buildSideNav(); // rebuild sidebar with current visibility settings
  ALL_SECTIONS.forEach(s=>{
    const el=document.getElementById(s.id); if(!el) return;
    const key=s.key||s.id.replace('s-','');
    if((D.sections||{})[key]===0) el.style.display='none';
  });
  // faith_free DOM hide — covers (a) every <section class="sec"> not in
  // the allow-list, including ones not in ALL_SECTIONS (e.g. s-cbt);
  // (b) the hero dashboard tile grid, which surfaces gated-section data
  // (GPA/Bank/Parent Bucks/etc.) inside the allowed s-hero; (c) the
  // Refer & Earn buttons in the global top bar, which sit outside any
  // section.
  // Set/clear html[data-faith-free] so CSS can hide parent/child chrome and
  // simplify Settings without depending on this JS path running first.
  if(window._faithFree) document.documentElement.setAttribute('data-faith-free', '1');
  else document.documentElement.removeAttribute('data-faith-free');

  if(window._faithFree){
    document.querySelectorAll('section.sec').forEach(el => {
      if(!isSectionAllowed(el.id)) el.style.display='none';
    });
    const tilesGrid = document.querySelector('#s-hero .dashGrid');
    if(tilesGrid) tilesGrid.style.display = 'none';
    // BRITTLE: onclick-attribute selector — migrate to a data-attribute
    // or class-based selector when F2 touches the top bar.
    document.querySelectorAll('button[onclick*="showSection(\'s-referral\'"]')
      .forEach(b => b.style.display = 'none');
    // Hero child-stats widgets — surface paid-tier data (GPA / chore counts /
    // mood / Life Map progression) inside the allowed s-hero. F1 hero variant
    // will replace this block wholesale.
    ['heroHeadline', 'heroMicroStats'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.style.display = 'none';
    });
    ['dacGrid', 'lifeMapBoard', 'checkinGrid'].forEach(id => {
      const el = document.getElementById(id);
      if(el && el.parentElement) el.parentElement.style.display = 'none';
    });
    // Child Login buttons (desktop top bar + mobile quick bar). faith_free
    // is a single-user account; no parent/child distinction applies.
    ['childLoginTopBtn', 'childLoginMobBtn'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.style.display = 'none';
    });
    // Child avatar wrap. The tooltip ("Upload child photo or choose avatar")
    // and modal are tied to the parent/child schema; faith_free has neither.
    const av = document.getElementById('childAvatarWrap');
    if(av) av.style.display = 'none';
    // Parent Welcome Card. CSS at app.css:2156 uses `display: block !important`
    // when body.parent-view is set, so we MUST use setProperty(...,'important')
    // to beat the stylesheet. Inline !important wins over stylesheet !important.
    const pw = document.getElementById('parentWelcomeCard');
    if(pw) pw.style.setProperty('display', 'none', 'important');
    // Hero Card. The faith_free user is flagged as a parent (no child profile),
    // so body.parent-view is set, and CSS at app.css:2155 hides #heroCard with
    // `display: none !important`. Force-show it so the user sees greeting +
    // name + date + scripture verse (the only hero content faith_free should see).
    const hc = document.getElementById('heroCard');
    if(hc) hc.style.setProperty('display', 'block', 'important');
    // Parent buttons in the global top bar (desktop + mobile quick bar).
    // BRITTLE: same onclick-attribute selector caveat as Refer & Earn — migrate
    // to a stable data-attribute when F2 touches the top bar.
    document.querySelectorAll('button[onclick*="quickParentHub"]')
      .forEach(b => b.style.display = 'none');
    // Floating "Start Here!" button is parent-onboard wizard. faith_free is
    // a single-person tier — no wizard applies.
    const sh = document.getElementById('startHereBtn');
    if(sh) sh.style.display = 'none';
    // Getting Started guide is also parent/child-framed; suppress for faith_free.
    const gs = document.getElementById('gettingStarted');
    if(gs) gs.style.display = 'none';
  }
  const sb=document.getElementById('scriptureBanner');
  if(sb && D.hideScripture) sb.style.display='none';
  applyName();
}

// Mom-persona: persist "where do I land on sign-in?" preference. Single
// localStorage flag, no Supabase column. Read in init.js finishInit() routing.
function setDefaultView(value){
  try {
    if(value === 'parent') localStorage.removeItem('ylcc_default_view');
    else localStorage.setItem('ylcc_default_view', value);
  } catch(e){}
}

function openSettings(){
  // Reflect current default-view preference in the radio group.
  try {
    const cur = localStorage.getItem('ylcc_default_view') === 'child' ? 'child' : 'parent';
    const dv = document.querySelector('input[name="ylccDefaultView"][value="'+cur+'"]');
    if(dv) dv.checked = true;
  } catch(e){}

  const _snEl=document.getElementById('settingsName'); if(_snEl) _snEl.value=D.name||'';
  const _msEl=document.getElementById('modeSelect'); if(_msEl) _msEl.value=D.mode||'high';
  // Verse speed
  const vs=document.getElementById('verseSpeed');
  if(vs) vs.value=D.verseSpeed||60000;
  // Auto-rotate button state
  const vpb=document.getElementById('versePlayBtn');
  if(vpb) vpb.textContent=_verseTimer?'⏸ Auto-Rotate On':'▶ Auto-Rotate Off';
  buildToggles();
  const stb=document.getElementById('tg-scripture');
  if(stb) stb.classList.toggle('on',!D.hideScripture);
  renderVerseSettingsList();
  renderActivityList();
  // Populate sync + subscription status
  refreshSettingsSyncStatus();
  refreshSettingsPlanStatus();
  document.getElementById('sp').classList.add('open');
  document.getElementById('so').classList.add('open');
  var _spProf=(_profiles||[]).find(function(p){return p.id===_activeProfileId;});
  // Only show child-view when EXPLICITLY a child (isParent===false)
  // Default to parent/full view for any ambiguous state
  var _spIsChild=!!(_spProf&&_spProf.isParent===false);
  var _spEl=document.getElementById('sp');
  if(_spEl){ if(_spIsChild) _spEl.classList.add('child-view'); else _spEl.classList.remove('child-view'); }
  var _ctBtn=document.getElementById('sp-child-tutorial');
  if(_ctBtn) _ctBtn.style.display=_spIsChild?'block':'none';
}
function closeSettings(){ document.getElementById('sp').classList.remove('open'); document.getElementById('so').classList.remove('open'); }

// ── SETTINGS: SYNC STATUS ─────────────────────────────────────
function refreshSettingsSyncStatus(){
  const icon=document.getElementById('settingsSyncIcon');
  const label=document.getElementById('settingsSyncLabel');
  const sub=document.getElementById('settingsSyncSub');
  if(!icon||!label||!sub) return;
  const lastSync=localStorage.getItem('lifeos_last_sync');
  if(_supaUser){
    icon.textContent='☁️';
    label.textContent='Synced to cloud';
    label.style.color='var(--gr)';
    if(lastSync){
      const mins=Math.round((Date.now()-parseInt(lastSync))/60000);
      sub.textContent=mins<1?'Just synced':mins<60?`${mins}m ago`:`${Math.round(mins/60)}h ago`;
    } else {
      sub.textContent=_supaUser.email||'Signed in';
      // No timestamp yet — trigger a sync now
      setTimeout(cloudSync, 500);
    }
  } else {
    icon.textContent='💾';
    label.textContent='Local only';
    label.style.color='var(--tx2)';
    sub.textContent='Sign in to enable cloud sync';
  }
}

// ── SETTINGS: SUBSCRIPTION STATUS ────────────────────────────
async function refreshSettingsPlanStatus(){
  const badge=document.getElementById('settingsPlanBadge');
  const emailEl=document.getElementById('settingsPlanEmail');
  const nextBill=document.getElementById('settingsPlanNextBilling');
  const localNote=document.getElementById('settingsPlanLocalNote');
  if(!badge) return;

  if(!_supaUser){
    badge.textContent='—';
    badge.style.background='rgba(255,255,255,.08)';
    badge.style.color='var(--tx3)';
    badge.style.borderColor='rgba(255,255,255,.1)';
    if(emailEl) emailEl.textContent='';
    if(nextBill) nextBill.textContent='';
    if(localNote) localNote.style.display='block';
    return;
  }
  if(localNote) localNote.style.display='none';
  if(emailEl) emailEl.textContent=_supaUser.email||'';
  badge.textContent='Checking…';

  try {
    const supa=getSupabase();
    if(!supa) throw new Error('no client');
    const {data,error}=await supa.from('profiles').select('plan_status,current_period_end').eq('user_id',_supaUser.id).single();
    if(error||!data){badge.textContent='Active';return;}

    const status=data.plan_status||'active';
    const statusMap={
      'active':   {label:'Active',   bg:'rgba(34,197,94,.15)', color:'#22c55e', border:'rgba(34,197,94,.25)'},
      'trialing': {label:'Trial',    bg:'rgba(56,189,248,.15)',color:'#38bdf8', border:'rgba(56,189,248,.25)'},
      'past_due': {label:'Past Due', bg:'rgba(245,158,11,.15)',color:'#f59e0b', border:'rgba(245,158,11,.25)'},
      'cancelled':{label:'Cancelled',bg:'rgba(239,68,68,.15)', color:'#f87171', border:'rgba(239,68,68,.25)'},
    };
    const s=statusMap[status]||statusMap['active'];
    badge.textContent=s.label;
    badge.style.background=s.bg;
    badge.style.color=s.color;
    badge.style.borderColor=s.border;

    if(nextBill && data.current_period_end){
      const d=new Date(data.current_period_end*1000);
      const label=status==='cancelled'?'Cancelled':'Next billing';
      nextBill.textContent=`${label}: ${d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;
    }
  } catch(e){
    badge.textContent='Active';
    badge.style.background='rgba(34,197,94,.15)';
    badge.style.color='#22c55e';
  }
}

// ── SUPPORT BUG REPORT ────────────────────────────────────────

// ── SIDEBAR NAV ──────────────────────────────────────────────
const NAV_ITEMS = [
  {id:'s-hero', icon:'🏠', label:'Home', key:'home'},
  {id:'_group_learn', icon:'📚', label:'Learning', isGroup:true, children:[
    {id:'s-skills',    icon:'🎓', icon:'🧠',label:'Life Skills',    key:'skills'},
    {id:'s-growing',   icon:'🌱', label:'Growing Up',     key:'growing'},
    {id:'s-driving',   icon:'🚗', label:'Driving',        key:'driving'},
    {id:'s-sports',    icon:'⚽', label:'Sports',         key:'sports'},
    {id:'s-mentors',   icon:'🤝', label:'My People',      key:'mentors'},
  ]},
  // F8: "Bible & Faith" group renamed to "The Well". CLG removed —
  // its 10 unique topics live as Life Topics reading plans now
  // (see FAITH_LIFE_TOPICS_PLANS in plans.js). The s-christian-living
  // section markup remains in index.html as dormant content.
  {id:'_group_faith', icon:'✝️', label:'The Well', isGroup:true, children:[
    {id:'s-scripture',        icon:'📖', label:'The Well',              key:'scripture'},
    {id:'s-flashcards',       icon:'📇', label:'Bible Flashcards',      key:'flashcards'},
    {id:'s-worship',          icon:'🎵', label:'Worship Playlist',      key:'worship'},
  ]},
  {id:'_group_school', icon:'🎓', label:'School & Career', isGroup:true, children:[
    {id:'s-school',    icon:'📚', label:'School',         key:'school'},
    {id:'s-resume',    icon:'💼', label:'Jobs/Resume',    key:'resume'},
    {id:'s-bio',       icon:'📋', label:'Bio Page',       key:'bio'},
    {id:'s-resources', icon:'📦', label:'School Resources', key:'resources'},
  ]},
  {id:'s-cbt', icon:'💻', label:'Tech Skills', key:'cbt'},
  {id:'_group_daily', icon:'📅', label:'Daily Life', isGroup:true, children:[
    {id:'s-chores',    icon:'✅', label:'Chores',         key:'chores'},
    {id:'s-goals',     icon:'🎯', icon:'🎯',label:'Goals',          key:'goals'},
    {id:'s-schedule',  icon:'📝', label:'Schedule',       key:'schedule'},
    {id:'s-calendar',  icon:'📅', label:'Calendar',       key:'calendar'},
  ]},
  {id:'_group_wellness', icon:'💚', label:'Wellness', isGroup:true, children:[
    {id:'s-health',    icon:'💪', label:'Health',         key:'health'},
    {id:'s-journal',   icon:'✍️', icon:'✍️',label:'Journal',        key:'journal'},
    {id:'s-mood',      icon:'😊', label:'Mood Tracker',   key:'mood'},
    {id:'s-motivation',icon:'🔥', label:'Fuel Wall',      key:'motivation'},
  ]},
  {id:'_group_money', icon:'💰', label:'Money & Rewards', isGroup:true, children:[
    {id:'s-finance',   icon:'💰', label:'Money Manager',  key:'money'},
    {id:'s-rewards',   icon:'🎰', label:'Rewards',        key:'rewards'},
    {id:'s-contests',  icon:'🏆', label:'Challenges',     key:'contests'},
    {id:'s-badges',    icon:'🏅', label:'Badges',         key:'badges'},
  ]},
  {id:'_group_activities', icon:'🎵', label:'Activities', isGroup:true, children:[
    {id:'s-craft',     icon:'🎵', label:'Music & Practice',key:'music'},
    {id:'s-reading',   icon:'📖', label:'Reading List',   key:'reading'},
    {id:'s-milestones',icon:'🗺️', label:'Milestones',     key:'milestones'},
  ]},

];
let _activeSection = 's-hero';

function buildSideNav(){
  const el = document.getElementById('sideNav'); if(!el) return;
  // New sections added after launch - always visible, ignore saved hide state
  // Force-show new sections regardless of any saved hide state
  if(!D.sections) D.sections={};
  // Always force CBT, resume, referral visible — delete any hidden=0 state.
  // Faith Hub sections are also force-visible so users who toggled them off
  // pre-F2 see Christian Life Guide / Worship / Bible & Faith again.
  ['cbt','resume','referral','christianLiving','worship','scripture','flashcards'].forEach(k=>{ if(D.sections[k]===0) delete D.sections[k]; });
  delete D.sections.referral; // referral is now Parent Hub only
  const hidden = D.sections||{};
  if(!D._navGroups) D._navGroups={};
  // Phase 2.2 spec: collapse sidebar groups by default. Only Daily Life is
  // force-open (highest-frequency group). All others — School & Career,
  // Wellness, Money & Rewards, Activities — respect user preference and
  // start closed for new users. CBT injection below works regardless of
  // group open/closed state (DOM-based, not display-state-based).
  D._navGroups["Daily Life"] = true;
  // F8: "Bible & Faith" group renamed to "The Well" — still open by default
  if(D._navGroups["The Well"] !== false) D._navGroups["The Well"] = true;
  // Backward-compat: migrate users whose D._navGroups still has the old key
  if(D._navGroups["Bible & Faith"] !== undefined){ delete D._navGroups["Bible & Faith"]; }
  const openGroups = D._navGroups || {};

  let navHTML = '<div class="sid-sep">Sections</div>';

  NAV_ITEMS.forEach(n=>{
    if(n.isGroup){
      // Collapsible group — Phase 2.2: default closed unless user explicitly opened.
      const isOpen = openGroups[n.label] === true;
      const childHTML = (n.children||[]).map(c=>{
        if(!isSectionAllowed(c.id)) return '';
        if(c.key && hidden[c.key]===0 && typeof hidden[c.key]!=='undefined') return '';
        return `<button class="nav-item nav-child${c.id===_activeSection?' active':''}" id="ni-${c.id}" onclick="showSection('${c.id}')" style="padding-left:2.2rem;font-size:.78rem;">
          <span class="ni">${c.icon}</span>
          <span>${c.label}</span>
        </button>`;
      }).filter(Boolean).join('');
      
      if(!childHTML) return; // All children hidden
      
      navHTML += `<div class="nav-group">
        <button class="nav-item nav-group-toggle" onclick="toggleNavGroup('${n.label}')" style="font-weight:700;">
          <span class="ni">${n.icon}</span>
          <span style="flex:1;">${n.label}</span>
          <span style="font-size:.5rem;color:var(--tx3);margin-left:auto;">${isOpen?'▼':'▶'}</span>
        </button>
        <div class="nav-group-items" id="ng-${n.label.replace(/[^a-zA-Z]/g,'')}" style="display:${isOpen?'block':'none'};">
          ${childHTML}
        </div>
      </div>`;
    } else {
      // Regular item — CBT always visible regardless of D.sections
      if(!isSectionAllowed(n.id)) return;
      if(n.key!=='cbt' && n.key && hidden[n.key]===0 && typeof hidden[n.key]!=='undefined') return;
      navHTML += `<button class="nav-item${n.id===_activeSection?' active':''}" id="ni-${n.id}" onclick="showSection('${n.id}')">
        <span class="ni">${n.icon}</span>
        <span>${n.label}</span>
      </button>`;
    }
  });
  
  el.innerHTML = navHTML;

  // Force-inject CBT button if missing (immune to section visibility settings).
  // Works whether School & Career group is open or closed — the .nav-group-items
  // div exists in the DOM either way; display:none doesn't affect querySelector.
  if(!document.getElementById('ni-s-cbt') && isSectionAllowed('s-cbt')){
    const cbtBtn = document.createElement('button');
    cbtBtn.className = 'nav-item nav-child' + ('s-cbt'===_activeSection?' active':'');
    cbtBtn.id = 'ni-s-cbt';
    cbtBtn.setAttribute('onclick', "showSection('s-cbt')");
    cbtBtn.style.cssText = 'padding-left:2.2rem;font-size:.78rem;';
    cbtBtn.innerHTML = '<span class="ni">💻</span><span>Tech Skills</span>';
    // Find the School & Career group items div and append to it
    const allGroupDivs = el.querySelectorAll('.nav-group-items');
    let inserted = false;
    allGroupDivs.forEach(div => {
      if(!inserted && div.innerHTML.includes('s-resources')) {
        div.appendChild(cbtBtn);
        inserted = true;
      }
    });
    // Fallback: add as standalone item before first group
    if(!inserted){
      const firstGroup = el.querySelector('.nav-group');
      if(firstGroup) el.insertBefore(cbtBtn, firstGroup);
      else el.appendChild(cbtBtn);
    }
  }
}

function toggleNavGroup(label){
  if(!D._navGroups) D._navGroups = {};
  const key = label.replace(/[^a-zA-Z]/g,'');
  const el = document.getElementById('ng-'+key);
  if(!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  D._navGroups[label] = !isOpen;
  // Update arrow
  const toggle = el.previousElementSibling;
  if(toggle){
    const arrow = toggle.querySelector('span:last-child');
    if(arrow) arrow.textContent = isOpen ? '▶' : '▼';
  }
  save();
}

// ── Phase 5.8 Pass D/E — Tab-replacement card grids ──
// Each section that has a tab bar opens in "card grid" mode by default.
// Tapping a card hides the grid + tab bar + PB-bar and shows the matching
// tab panel. A "← Back" pill (.topic-back-btn) returns to the grid.
// Pass E (this commit) adds Driving / Sports / Resume and replaces the
// hardcoded fnName ternary in tgOpenTopic with a per-section `tabFn`
// field — so new sections plug in without touching tgOpenTopic.
const _TG_CONFIG = {
  's-school': {
    gridId: 'schoolTopicGrid',
    tabBar: '.schoolTabs',
    tabFn: 'sTab',
    extraHide: ['#schoolPBBalance'],
    panels: {
      classes: 'st-classes',
      assignments: 'st-assignments',
      gpa: 'st-gpa',
      study: 'st-study',
      prep: 'st-prep',
    },
  },
  's-finance': {
    gridId: 'financeTopicGrid',
    tabBar: '.moneyTabs',
    tabFn: 'mTab',
    extraHide: [],
    panels: {
      overview: 'mt-overview',
      bills: 'mt-bills',
      tx: 'mt-tx',
      savings: 'mt-savings',
      savgoals: 'mt-savgoals',
      budget: 'mt-budget',
      taxed: 'mt-taxed',
    },
  },
  's-health': {
    gridId: 'healthTopicGrid',
    tabBar: '.healthTabs',
    tabFn: 'hTab',
    extraHide: [],
    panels: {
      weight: 'ht-weight',
      food: 'ht-food',
      nutEd: 'ht-nutEd',
      growth: 'ht-growth',
      habits: 'ht-habits',
    },
  },
  // ── Pass E ──────────────────────────────────────────────────────
  's-driving': {
    gridId: 'drivingTopicGrid',
    tabBar: '.driveTabs',
    tabFn: 'sTab',  // Driving shares sTab with School (legacy — the same
                    // global handler swaps both st-* prefixes).
    extraHide: [],
    panels: {
      drLicense: 'st-drLicense',
      drSafety: 'st-drSafety',
      drMaintenance: 'st-drMaintenance',
      drCosts: 'st-drCosts',
    },
  },
  's-sports': {
    gridId: 'sportsTopicGrid',
    tabBar: '.sportsTabs',
    tabFn: 'sportMainTab',
    extraHide: [],
    panels: {
      explore: 'sp-explore',
      mine: 'sp-mine',
    },
  },
  's-resume': {
    gridId: 'resumeTopicGrid',
    tabBar: '.resumeTabs',
    tabFn: 'resumeTab',
    // Resume's panels also need the .r-panel.active class flipped — the
    // resumeTab() handler does that itself when we invoke it below.
    extraHide: [],
    panels: {
      resume: 'rPanel-resume',
      tracker: 'rPanel-tracker',
      prep: 'rPanel-prep',
      practice: 'rPanel-practice',
    },
  },
};

function tgShowGrid(sectionId){
  const cfg = _TG_CONFIG[sectionId]; if(!cfg) return;
  const section = document.getElementById(sectionId); if(!section) return;
  const grid = document.getElementById(cfg.gridId);
  if(grid) grid.style.display = '';
  const bar = section.querySelector(cfg.tabBar);
  if(bar) bar.style.display = 'none';
  Object.values(cfg.panels).forEach(pid => {
    const e = document.getElementById(pid);
    if(e) e.style.display = 'none';
  });
  (cfg.extraHide || []).forEach(sel => {
    const e = section.querySelector(sel);
    if(e && e.parentElement) e.parentElement.style.display = '';
  });
  const back = section.querySelector('.tg-back-btn');
  if(back) back.remove();
}

function tgOpenTopic(sectionId, tabName){
  const cfg = _TG_CONFIG[sectionId]; if(!cfg) return;
  const section = document.getElementById(sectionId); if(!section) return;
  const panelId = cfg.panels[tabName];
  if(!panelId) return;
  const grid = document.getElementById(cfg.gridId);
  if(grid) grid.style.display = 'none';
  const bar = section.querySelector(cfg.tabBar);
  if(bar) bar.style.display = 'none';
  Object.entries(cfg.panels).forEach(([t, pid]) => {
    const e = document.getElementById(pid);
    if(e) e.style.display = (t === tabName) ? '' : 'none';
  });
  (cfg.extraHide || []).forEach(sel => {
    const e = section.querySelector(sel);
    if(e && e.parentElement) e.parentElement.style.display = 'none';
  });
  // Inject ← Back pill once
  if(!section.querySelector('.tg-back-btn')){
    const back = document.createElement('button');
    back.className = 'tg-back-btn topic-back-btn';
    back.type = 'button';
    back.innerHTML = '← Back to topics';
    back.onclick = function(){ tgShowGrid(sectionId); };
    const panel = document.getElementById(panelId);
    if(panel && panel.parentNode) panel.parentNode.insertBefore(back, panel);
    else section.appendChild(back);
  }
  // Fire any tab-specific side effects (charts, lists) by calling the
  // original tab handler. It re-does the panel display we already set,
  // but that's idempotent. Pulled from cfg.tabFn so new sections plug
  // in without editing this function.
  const fnName = cfg.tabFn || null;
  if(fnName && typeof window[fnName] === 'function'){
    try { window[fnName](tabName); } catch(e) {}
  }
}

function tgInitAll(){
  Object.keys(_TG_CONFIG).forEach(sid => tgShowGrid(sid));
}

// ── Admin Photo Manager — runtime override loader ──────────────
// On boot (init.js calls this after tgInitAll), pull any admin-defined
// photo URL overrides from the Vercel function. The endpoint is the
// only entry point because admin_card_photos has service-role-only
// RLS — the anon Supabase client cannot read the table directly.
//
// For every override row whose card_id matches a <img data-card-id="…">
// in the DOM, swap the src. For Life Skills card_ids (sk-<key>), also
// mutate SK_CAT_PHOTOS so subsequent buildSkillsGrid() re-renders pick
// up the override (the dynamic template reads SK_CAT_PHOTOS each call).
async function loadCardPhotoOverrides(){
  try {
    const resp = await fetch('/api/admin-card-photo', { method:'GET' });
    if(!resp.ok) return;
    const data = await resp.json();
    const overrides = (data && data.overrides) || {};
    let appliedDom = 0;
    let appliedSk  = 0;
    Object.keys(overrides).forEach(cardId => {
      const url = overrides[cardId];
      if(!url) return;
      // Update every matching hero img in the DOM (static cards).
      document.querySelectorAll('img[data-card-id="' + cardId + '"]').forEach(img => {
        if(img.getAttribute('src') !== url){
          img.setAttribute('src', url);
          appliedDom++;
        }
      });
      // Mutate the SK_CAT_PHOTOS map so dynamic Life Skills cards (built
      // by buildSkillsGrid) honor the override on the next render.
      if(cardId.indexOf('sk-') === 0 && typeof SK_CAT_PHOTOS !== 'undefined'){
        const key = cardId.slice(3);
        if(SK_CAT_PHOTOS[key] !== url){
          SK_CAT_PHOTOS[key] = url;
          appliedSk++;
        }
      }
    });
    // If any skills overrides changed, re-render the grid (cheap, idempotent).
    if(appliedSk > 0 && typeof buildSkillsGrid === 'function'){
      try { buildSkillsGrid(); } catch(e){}
    }
  } catch(e){
    // Fail silently — overrides are non-essential. The base photo set
    // baked into the HTML/skills.js is always a safe fallback.
  }
}

// ── Phase 5.8: Global card-grid navigation utilities ──────────
// Two helpers that any section can use to toggle between a card-grid
// landing view and a per-topic detail panel. Convention:
//   - The grid is an element whose id ends with "-grid"
//   - Each detail panel is an element whose id ends with "-panel-<topicId>"
// showCardGrid(scope): hide all panels under scope, show the grid.
// showTopicCard(scope, topicId): hide grid, show the matching panel.
// `scope` is either an element id, the element itself, or a section id
// like 's-skills' — the helper finds [data-topic-grid] / [data-topic-panel]
// children inside the scope element.
function _resolveScopeEl(scope){
  if(!scope) return document;
  if(typeof scope === 'string'){
    const el = document.getElementById(scope);
    return el || document;
  }
  return scope;
}
function showCardGrid(scope){
  const root = _resolveScopeEl(scope);
  if(!root || !root.querySelectorAll) return;
  root.querySelectorAll('[data-topic-grid]').forEach(g => { g.style.display = ''; });
  root.querySelectorAll('[data-topic-panel]').forEach(p => { p.style.display = 'none'; });
  // Scroll the grid into view for tall sections
  const grid = root.querySelector('[data-topic-grid]');
  if(grid && typeof grid.scrollIntoView === 'function'){
    try { grid.scrollIntoView({behavior:'smooth', block:'start'}); } catch(e){}
  }
}
function showTopicCard(scope, topicId){
  const root = _resolveScopeEl(scope);
  if(!root || !root.querySelectorAll) return;
  root.querySelectorAll('[data-topic-grid]').forEach(g => { g.style.display = 'none'; });
  root.querySelectorAll('[data-topic-panel]').forEach(p => {
    p.style.display = (p.getAttribute('data-topic-panel') === topicId) ? '' : 'none';
  });
  const target = root.querySelector('[data-topic-panel="' + topicId + '"]');
  if(target && typeof target.scrollIntoView === 'function'){
    try { target.scrollIntoView({behavior:'smooth', block:'start'}); } catch(e){}
  }
}

function showSection(id, fromMobile){
  // faith_free fail-closed: redirect to home if the requested section is
  // outside the allow-list. Silent redirect — some callers fire from
  // setTimeout chains where a throw would surface as an unhandled rejection.
  if(!isSectionAllowed(id)) id = 's-hero';
  if(id==='s-referral') setTimeout(initReferralTab,50);
  // Hide all, show target
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  const target = document.getElementById(id);
  if(target){ target.style.display = ''; target.classList.add('active'); }
  _activeSection = id;

  // Update nav highlights
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  const btn = document.getElementById('ni-'+id);
  if(btn) btn.classList.add('active');

  // Mobile: close sidebar after nav
  closeSidebar();

  // Scroll to top of main
  window.scrollTo(0,0);

  // Auto-bypass Parent Hub gate if currently within the unlock window or PIN
  // gate is disabled. Does NOT extend the unlock — must be active already.
  if(id==='s-parent' && typeof D!=='undefined' && ((typeof isParentUnlocked==='function' && isParentUnlocked()) || D.parentPinDisabled)){
    const gate = document.getElementById('parentGate');
    const content = document.getElementById('parentDashContent');
    if(gate) gate.style.display='none';
    if(content) content.style.display='block';
    setTimeout(()=>{ typeof renderParentDash==='function'&&renderParentDash(); typeof updateIncConditions==='function'&&updateIncConditions(); },50);
  }

  // Trigger renders that need visible DOM
  if(id==='s-schedule') setTimeout(buildSchedule,60);
  if(id==='s-health') setTimeout(()=>{ renderWeightChart(); renderHealthHabits(); },80);
  if(id==='s-school'){ renderSchool&&renderSchool(); setTimeout(()=>{ renderStudyPlan&&renderStudyPlan(); renderExams&&renderExams(); },100); }
  if(id==='s-resources') setTimeout(()=>{
    // Show Math tab by default
    document.querySelectorAll('[id^="rs-"]').forEach(t=>t.style.display='none');
    const mathTab = document.getElementById('rs-math');
    if(mathTab) mathTab.style.display='block';
    // Set active tab button
    document.querySelectorAll('.resTabs .tab').forEach(b=>b.classList.remove('active'));
    const mathBtn = document.querySelector('.resTabs .tab');
    if(mathBtn) mathBtn.classList.add('active');
  }, 60);
  if(id==='s-resume') setTimeout(()=>{ typeof initResume==='function'&&initResume(); },80);
  if(id==='s-finance') setTimeout(renderFinanceDash,50);
  if(id==='s-cbt') setTimeout(()=>{ typingReset(); renderCbtLesson('basics'); renderCbtLesson('windows'); renderCbtLesson('linux'); renderCbtLesson('coding'); renderCbtLesson('internet'); },80);
  if(id==='s-rewards') setTimeout(()=>{ renderGameTickets(); renderPBStore&&renderPBStore(); renderRewardLog&&renderRewardLog(); },80);
  if(id==='s-resume') setTimeout(initResume,80);
  if(id==='s-badges') setTimeout(renderBadgesPage,50);
  if(id==='s-hero'){
    // ── CHILD-SWITCH GUARD ──────────────────────────────────────
    // If the active profile changed since the last home render (e.g. a
    // different child just logged in via PIN), force a fresh load() so D
    // reflects the correct child's data before any widget reads it.
    const _currentProfileId = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
    if(_currentProfileId !== _lastRenderedProfileId){
      _lastRenderedProfileId = _currentProfileId;
      if(typeof load === 'function') load(); // swap D to new child's localStorage key
    }
    // ────────────────────────────────────────────────────────────
    setTimeout(()=>{ renderGettingStarted(); renderPathway(); renderMonthlyChallenge(); renderDailyPrompt(); renderBadges(); updateDashCards(); renderHeroScreenTime(); renderDevMap(); },50);
  }

  // ── Group 2: render fns exist, just needed wiring ──────────────────
  if(id==='s-calendar')   setTimeout(()=>{ typeof renderCalendar==='function'&&renderCalendar(); },60);
  if(id==='s-goals')      setTimeout(()=>{ typeof renderGoals==='function'&&renderGoals(); },60);
  if(id==='s-journal')    setTimeout(()=>{ typeof renderJournal==='function'&&renderJournal(); },60);
  if(id==='s-chores')     setTimeout(()=>{ typeof renderChores==='function'&&renderChores(); },60);
  if(id==='s-milestones') setTimeout(()=>{ typeof renderMilestones==='function'&&renderMilestones(); },60);
  if(id==='s-mood')       setTimeout(()=>{ typeof renderMoodTracker==='function'&&renderMoodTracker(); },60);
  if(id==='s-sports')     setTimeout(()=>{ typeof renderSports==='function'&&renderSports(); },60);
  if(id==='s-growing')    setTimeout(()=>{ typeof buildGrowingGrid==='function'&&buildGrowingGrid(); },60);
  if(id==='s-skills')     setTimeout(()=>{ typeof initSkillsGrid==='function'&&initSkillsGrid(); },60);
  if(id==='s-motivation') setTimeout(()=>{ typeof renderMotivation==='function'&&renderMotivation(); },60);
  if(id==='s-mentors')    setTimeout(()=>{ typeof renderMentors==='function'&&renderMentors(); },60);

  // ── Group 3: init functions were never called on section open ───────
  if(id==='s-bio')        setTimeout(()=>{ typeof loadBioFields==='function'&&loadBioFields(); typeof updateBioPreview==='function'&&updateBioPreview(); },80);
  if(id==='s-reading')    setTimeout(()=>{ typeof renderBooks==='function'&&renderBooks(); },60);
  if(id==='s-contests')   setTimeout(()=>{ typeof initContests==='function'&&initContests(); typeof renderChallenges==='function'&&renderChallenges(); typeof renderHelpfulDeeds==='function'&&renderHelpfulDeeds(); },80);
  if(id==='s-scripture')  setTimeout(()=>{
    typeof initScripture==='function'&&initScripture();
    typeof renderScripturePage==='function'&&renderScripturePage();
    // F9: Auto-show the user's last-visited Well sub-tab (or Home on first
    // visit). Replaces the old hardcoded "open Devotional first" branch.
    const lastTab = (typeof D !== 'undefined' && D && D.wellLastTab) ? D.wellLastTab : 'home';
    const validTabs = ['home','bible','plans','devotional','prayer','academy','bibleworld','stories','timeline','memorize','journey'];
    const target = validTabs.indexOf(lastTab) >= 0 ? lastTab : 'home';
    if(typeof bfTab === 'function') bfTab(target);
  },80);
  if(id==='s-driving')    setTimeout(()=>{ typeof initDriving==='function'&&initDriving(); },60);
  if(id==='s-worship')    setTimeout(()=>{ typeof worshipInit==='function'&&worshipInit(); },60);
  if(id==='s-christian-living') setTimeout(()=>{ typeof faithResourcesInit==='function'&&faithResourcesInit(); },60);
  if(id==='s-flashcards')       setTimeout(()=>{ typeof fcInit==='function'&&fcInit(); },60);
  if(id==='s-craft')      setTimeout(()=>{ typeof buildCraftSection==='function'&&buildCraftSection(); typeof initMusicAndSports==='function'&&initMusicAndSports(); },60);
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('mob-open');
  document.getElementById('sideOverlay').classList.toggle('open');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('mob-open');
  document.getElementById('sideOverlay').classList.remove('open');
}

// helpers
function go(id){ showSection(id); }
function openModal(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add('open');
  // F4 — Inject a fullscreen toggle button into the modal's .md if it
  // doesn't already have one. One implementation, every modal benefits.
  _ensureFullscreenToggle(el);
}
function closeModal(id){
  const el = document.getElementById(id);
  if(!el) return;
  // If the modal was in fullscreen, drop out of it on close.
  if(document.fullscreenElement && el.contains(document.fullscreenElement)){
    try { document.exitFullscreen(); } catch(_){}
  }
  el.classList.remove('open');
  el.classList.remove('mo-fullscreen');
}

// Inject a fullscreen toggle button into the modal's dialog. Idempotent.
function _ensureFullscreenToggle(modalEl){
  const dialog = modalEl.querySelector('.md');
  if(!dialog) return;
  if(dialog.querySelector('[data-modal-fs]')) return;
  const btn = document.createElement('button');
  btn.setAttribute('data-modal-fs','1');
  btn.setAttribute('aria-label','Toggle fullscreen');
  btn.title = 'Fullscreen (Esc to exit)';
  btn.innerHTML = '⛶';
  btn.style.cssText = 'position:absolute;top:10px;right:46px;z-index:10;width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(15,23,42,.35);color:var(--cd-banner-text,#fff);cursor:pointer;font-size:1rem;font-weight:800;line-height:1;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);transition:background .15s,transform .15s;font-family:var(--fm);';
  btn.addEventListener('mouseenter',function(){ this.style.background='rgba(15,23,42,.55)'; this.style.transform='scale(1.05)'; });
  btn.addEventListener('mouseleave',function(){ this.style.background='rgba(15,23,42,.35)'; this.style.transform=''; });
  btn.addEventListener('click', function(ev){
    ev.preventDefault(); ev.stopPropagation();
    toggleModalFullscreen(modalEl);
  });
  // .md must be position:relative so the absolute button anchors to it.
  if(!dialog.style.position) dialog.style.position = 'relative';
  dialog.appendChild(btn);
}

function toggleModalFullscreen(modalEl){
  if(!modalEl) return;
  const dialog = modalEl.querySelector('.md');
  if(!dialog) return;
  const inFs = document.fullscreenElement === dialog;
  const btn  = dialog.querySelector('[data-modal-fs]');
  if(inFs){
    try { document.exitFullscreen(); } catch(_){}
    modalEl.classList.remove('mo-fullscreen');
    if(btn) btn.innerHTML = '⛶';
  } else {
    if(dialog.requestFullscreen){
      dialog.requestFullscreen().then(function(){
        modalEl.classList.add('mo-fullscreen');
        if(btn) btn.innerHTML = '⤢';
      }).catch(function(){
        // Some Safari versions reject programmatic FS. Fall back to a CSS class.
        modalEl.classList.add('mo-fullscreen');
        if(btn) btn.innerHTML = '⤢';
      });
    } else {
      modalEl.classList.add('mo-fullscreen');
      if(btn) btn.innerHTML = '⤢';
    }
  }
}

// Listen for native fullscreen exit (Esc key) so our state matches the browser.
document.addEventListener('fullscreenchange', function(){
  if(!document.fullscreenElement){
    document.querySelectorAll('.mo.mo-fullscreen').forEach(function(m){
      m.classList.remove('mo-fullscreen');
      const btn = m.querySelector('[data-modal-fs]');
      if(btn) btn.innerHTML = '⛶';
    });
  }
});
function showToast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2400); }

// ── CHILD-SWITCH FULL REFRESH ─────────────────────────────────
// Called after a child PIN login to guarantee the home dashboard
// reflects the newly-active child's data with no stale reads.
// Usage: call this from init.js / auth.js right after setting
//        _activeProfileId and before showSection('s-hero').
function refreshDashForCurrentChild(){
  const pid = (typeof _activeProfileId !== 'undefined') ? _activeProfileId : null;
  _lastRenderedProfileId = pid;
  if(typeof load === 'function') load();               // reload D from localStorage
  if(typeof applyName === 'function') applyName();     // hero name + mode badge
  if(typeof buildCheckins === 'function') buildCheckins(); // daily habits
  if(typeof buildSideNav === 'function') buildSideNav(); // nav avatar / name
  if(typeof updateQuickStats === 'function') updateQuickStats();
  if(typeof updateHeroDashboard === 'function') updateHeroDashboard();
  if(typeof renderVerse === 'function') renderVerse();
  if(typeof buildToggles === 'function') buildToggles();
}


