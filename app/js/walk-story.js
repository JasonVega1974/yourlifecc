/* =============================================================
   walk-story.js — "My Story": the My Walk spiritual journal.

   One chronological timeline composing every documentation system the
   walk already has — NOT a parallel store:
     👣 station completed  — auto, D.walk.completed (+ D.walk.reflections
                             shown under their station)
     🏆 quest completed    — auto, D.walk.questDone
     ⭐ milestone          — user-created here into D.walkStory; the legacy
                             Faith Journey milestones (_fjGetMilestones,
                             faith.js localStorage cache) render read-only
                             in the same timeline so nothing diverges
     📖 verse / 📔 note    — user-created, D.walkStory

   D.walkStory (DEF, data.js) is the ONLY new store. Entries carry a full
   ISO `ts` from day one (the reflections-lack-timestamps lesson). Synced
   via the profiles.data blob like everything else in D — deliberately NOT
   the faith_journey_entries table (its uuid id column rejects the legacy
   'm_<ts>' text ids, so that cloud path has never actually synced).

   Photos (⭐ milestones only) mirror the chore-proofs Vault pattern
   exactly: PRIVATE bucket 'walk-photos', client-side upload through the
   anon supabase client (RLS scopes paths to auth.uid()), reads only via
   short-lived createSignedUrl. No public URLs, no API endpoint — see
   docs/migrations/walk-photos-bucket.sql (must be run manually).

   Loads AFTER walk-path.js (defer order in index.html). Never touches
   walk-path internals — renders into hosts faith-zones.js provides
   (#walkStoryWrap, #walkDailyStrip) and reuses window.walkQuestBump.
   All cross-module calls typeof-guarded.
============================================================= */
(function(){
'use strict';

function _esc(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function _todayKey(){
  var d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function _friendly(dateStr){
  if(!dateStr) return '';
  var t=_todayKey();
  if(dateStr===t) return 'Today';
  var y=new Date(); y.setDate(y.getDate()-1);
  var yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  if(dateStr===yk) return 'Yesterday';
  var d=new Date(dateStr+'T00:00:00');
  var mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var lbl=mo[d.getMonth()]+' '+d.getDate();
  if(d.getFullYear()!==new Date().getFullYear()) lbl+=', '+d.getFullYear();
  return lbl;
}
function _toast(m){ if(typeof window.showToast==='function') window.showToast(m); }
function _juice(){
  try{ if(window.sfx && window.D && window.D.soundEnabled) window.sfx.correct(); }catch(_e){}
  try{ if(window.haptics && window.haptics.correct) window.haptics.correct(); }catch(_e){}
}
function _save(){ if(typeof window.save==='function') window.save(); }
function _userKey(suffix){
  return (typeof window._ylccUserKey==='function') ? window._ylccUserKey('ws_'+suffix) : ('ylcc_ws_'+suffix+'_local');
}

/* ── store ───────────────────────────────────────────────── */
function _story(){
  if(!window.D) window.D={};
  if(!Array.isArray(window.D.walkStory)) window.D.walkStory=[];
  return window.D.walkStory;
}
function _walk(){
  var D=window.D||{};
  return (D.walk && typeof D.walk==='object') ? D.walk : {};
}

/* ── compose the timeline ────────────────────────────────── */
// Normalized entry: {kind, id, date, ts, icon, title, body, ref, witnesses,
// church, photoPath, reflection}. Auto entries read their live sources.
function _entries(){
  var out=[];
  var w=_walk();
  var stations=(Array.isArray(window.WALK_STATIONS))?window.WALK_STATIONS:[];
  var quests=(Array.isArray(window.WALK_QUESTS_POOL))?window.WALK_QUESTS_POOL:[];
  var completed=(w.completed&&typeof w.completed==='object')?w.completed:{};
  var reflections=(w.reflections&&typeof w.reflections==='object')?w.reflections:{};
  var questDone=(w.questDone&&typeof w.questDone==='object')?w.questDone:{};

  Object.keys(completed).forEach(function(id){
    var s=null; for(var i=0;i<stations.length;i++){ if(stations[i]&&stations[i].id===id){ s=stations[i]; break; } }
    var refl=reflections[id];
    out.push({ kind:'station', id:'st_'+id, date:String(completed[id]||''), ts:'',
      icon:(s&&s.icon)||'👣', title:'Step taken: '+((s&&s.name)||id),
      reflection:(typeof refl==='string'&&refl.trim())?refl.trim():'' });
  });
  Object.keys(questDone).forEach(function(qid){
    var q=null; for(var j=0;j<quests.length;j++){ if(quests[j]&&quests[j].id===qid){ q=quests[j]; break; } }
    out.push({ kind:'quest', id:'q_'+qid, date:String(questDone[qid]||''), ts:'',
      icon:(q&&q.icon)||'🏆', title:'Quest: '+((q&&q.title)||qid) });
  });
  // Legacy Faith Journey milestones (read-only in this timeline — created
  // and edited in the Journey panel; same objects, never copied).
  if(typeof window._fjGetMilestones==='function' || typeof _fjGetMilestones==='function'){
    try{
      var legacy=(typeof _fjGetMilestones==='function')?_fjGetMilestones():window._fjGetMilestones();
      (legacy||[]).forEach(function(m){
        if(!m||!m.title) return;
        out.push({ kind:'milestone', id:String(m.id||''), date:String(m.date||''), ts:'',
          icon:'⭐', title:m.title, body:m.description||'',
          witnesses:(m.metadata&&m.metadata.witnesses)||'', church:m.church_name||'', legacy:true });
      });
    }catch(_e){}
  }
  // My Story user entries (D.walkStory — synced, timestamped).
  _story().forEach(function(e){
    if(!e||!e.type) return;
    if(e.type==='milestone'){
      out.push({ kind:'milestone', id:e.id, date:e.date||'', ts:e.ts||'', icon:'⭐',
        title:e.title||'Milestone', body:e.text||'', witnesses:e.witnesses||'',
        church:e.church||'', photoPath:e.photoPath||'' });
    } else if(e.type==='verse'){
      out.push({ kind:'verse', id:e.id, date:e.date||'', ts:e.ts||'', icon:'📖',
        title:e.ref||'A verse', body:e.text||'' });
    } else {
      out.push({ kind:'note', id:e.id, date:e.date||'', ts:e.ts||'', icon:'📔',
        title:'', body:e.text||'' });
    }
  });
  out.sort(function(a,b){
    if(a.date!==b.date) return a.date<b.date?1:-1;
    if(a.ts!==b.ts) return a.ts<b.ts?1:-1;
    var rank={station:0,milestone:1,verse:2,note:3,quest:4};
    return (rank[a.kind]||9)-(rank[b.kind]||9);
  });
  return out;
}

/* ── FJ panel bridge — both surfaces read the same union ─── */
// Story milestones in the legacy Faith Journey shape, for
// renderFJMilestones (faith.js) to merge into its list.
function walkStoryFjMilestones(){
  var out=[];
  _story().forEach(function(e){
    if(!e||e.type!=='milestone') return;
    out.push({ id:e.id, milestone_type:'custom', title:e.title||'Milestone',
      date:e.date||'', description:e.text||'', church_name:e.church||'',
      pastor_name:'', metadata:{ witnesses:e.witnesses||'' }, _story:true });
  });
  return out;
}
function walkStoryLastEntry(){
  var s=_story();
  var last=null;
  s.forEach(function(e){ if(e&&e.ts&&(!last||e.ts>last.ts)) last=e; });
  return last;
}

/* ── styles ──────────────────────────────────────────────── */
function _css(){
  if(document.getElementById('walkStoryCss')) return;
  var st=document.createElement('style'); st.id='walkStoryCss';
  st.textContent=[
    /* Continues the walk scene — hardcoded night-sky hex on purpose. */
    '.ws-wrap{margin-top:1.8rem;}',
    '.ws-eyebrow{font:600 10px/1 Oswald,sans-serif;letter-spacing:.26em;color:#f5b431;margin-bottom:.7rem;}',
    '.ws-actions{display:flex;gap:.55rem;margin-bottom:.9rem;}',
    '.ws-add{flex:1;padding:.7rem .8rem;border-radius:12px;border:1px solid rgba(245,180,49,.4);background:rgba(245,180,49,.1);color:#f5b431;font:600 .8rem/1 Oswald,sans-serif;letter-spacing:.04em;cursor:pointer;}',
    '.ws-share{flex-shrink:0;padding:.7rem .9rem;border-radius:12px;border:1px solid rgba(150,170,210,.25);background:rgba(150,170,210,.07);color:#aab4cc;font:600 .8rem/1 Oswald,sans-serif;letter-spacing:.04em;cursor:pointer;}',
    '.ws-card{background:rgba(20,26,48,.8);border:1px solid rgba(245,180,49,.14);border-radius:14px;padding:.4rem .9rem;}',
    '.ws-item{display:flex;gap:.7rem;align-items:flex-start;padding:.8rem 0;border-bottom:1px solid rgba(255,255,255,.06);}',
    '.ws-item:last-child{border-bottom:none;}',
    '.ws-ico{font-size:1.15rem;line-height:1.25;flex-shrink:0;}',
    '.ws-mid{flex:1;min-width:0;}',
    '.ws-title{display:block;font:600 .84rem/1.3 Oswald,sans-serif;letter-spacing:.02em;color:#e7dcc4;}',
    '.ws-body{display:block;font:italic 400 .8rem/1.5 Georgia,serif;color:#9aa2ba;margin-top:.25rem;white-space:pre-wrap;}',
    '.ws-meta{display:block;font:500 .68rem/1.4 Oswald,sans-serif;letter-spacing:.05em;color:#8a90a4;margin-top:.3rem;}',
    '.ws-date{flex-shrink:0;font:500 .68rem/1.4 Oswald,sans-serif;letter-spacing:.06em;color:#8a90a4;}',
    '.ws-verse .ws-title{color:#f3d9a0;}',
    '.ws-milestone{background:rgba(245,180,49,.05);margin:0 -0.9rem;padding:.8rem .9rem;border-left:2px solid rgba(245,180,49,.45);}',
    '.ws-thumb{margin-top:.45rem;width:96px;height:72px;border-radius:9px;object-fit:cover;border:1px solid rgba(245,180,49,.25);cursor:pointer;display:block;background:rgba(255,255,255,.04);}',
    '.ws-empty{font:italic 400 .85rem/1.55 Georgia,serif;color:#aab2c9;padding:1.1rem 1rem;}',
    '.ws-strip{background:rgba(20,26,48,.8);border:1px solid rgba(245,180,49,.16);border-radius:14px;padding:.75rem .9rem;margin-top:1.1rem;display:flex;gap:.6rem;align-items:flex-start;}',
    '.ws-strip-ico{font-size:1.1rem;flex-shrink:0;}',
    '.ws-strip-t{flex:1;font:italic 400 .82rem/1.45 Georgia,serif;color:#c9c2ae;}',
    '.ws-strip-eyebrow{display:block;font:600 9px/1 Oswald,sans-serif;letter-spacing:.24em;color:#f5b431;margin-bottom:.3rem;font-style:normal;}',
    '.ws-strip-x{flex-shrink:0;background:none;border:none;color:#8a90a4;font-size:.95rem;cursor:pointer;padding:0 .1rem;}',
    '.ws-strip-btn{flex-shrink:0;align-self:center;padding:.45rem .7rem;border-radius:9px;border:1px solid rgba(245,180,49,.4);background:rgba(245,180,49,.1);color:#f5b431;font:600 .68rem/1 Oswald,sans-serif;letter-spacing:.04em;cursor:pointer;}',
    /* Add sheet + photo viewer overlays (walkStationOverlay pattern). */
    '#walkStoryOverlay{display:none;position:fixed;inset:0;z-index:9200;background:rgba(5,8,18,.72);align-items:flex-end;justify-content:center;}',
    '#walkStoryOverlay .ws-sheet{width:100%;max-width:520px;max-height:86vh;overflow:auto;background:#121a30;border:1px solid rgba(245,180,49,.22);border-bottom:none;border-radius:20px 20px 0 0;padding:1.1rem 1.1rem 1.6rem;}',
    '.ws-sheet-h{font:600 11px/1 Oswald,sans-serif;letter-spacing:.24em;color:#f5b431;margin-bottom:.9rem;}',
    '.ws-types{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6rem;}',
    '.ws-type{padding:.9rem .5rem;border-radius:13px;border:1px solid rgba(245,180,49,.2);background:rgba(255,255,255,.03);color:#e7dcc4;font:600 .74rem/1.3 Oswald,sans-serif;cursor:pointer;text-align:center;}',
    '.ws-type span{display:block;font-size:1.4rem;margin-bottom:.3rem;}',
    '.ws-field{margin-bottom:.65rem;}',
    '.ws-label{display:block;font:600 .68rem/1 Oswald,sans-serif;letter-spacing:.08em;color:#aab2c9;margin-bottom:.3rem;}',
    '.ws-in{width:100%;box-sizing:border-box;padding:.55rem .65rem;border-radius:10px;border:1px solid rgba(245,180,49,.2);background:rgba(255,255,255,.05);color:#efe7d4;font:400 .85rem/1.4 Georgia,serif;}',
    'textarea.ws-in{resize:vertical;min-height:76px;}',
    '.ws-cta{width:100%;margin-top:.4rem;padding:.75rem;border-radius:12px;border:none;background:linear-gradient(135deg,#f6bd45,#d68a1c);color:#241a05;font:700 .85rem/1 Oswald,sans-serif;letter-spacing:.05em;cursor:pointer;}',
    '.ws-cancel{width:100%;margin-top:.45rem;padding:.55rem;border-radius:12px;border:none;background:none;color:#8a90a4;font:600 .74rem/1 Oswald,sans-serif;cursor:pointer;}',
    '#walkPhotoView{display:none;position:fixed;inset:0;z-index:9300;background:rgba(5,8,18,.9);align-items:center;justify-content:center;padding:1.2rem;}',
    '#walkPhotoView img{max-width:100%;max-height:90vh;border-radius:14px;border:1px solid rgba(245,180,49,.3);}',
    '@media (prefers-reduced-motion:reduce){.ws-wrap *{animation:none!important;}}'
  ].join('\n');
  document.head.appendChild(st);
}

/* ── photo helpers (Vault pattern: private bucket + signed URLs) ── */
var BUCKET='walk-photos', MAX_PHOTO=5*1024*1024;
var OK_MIME={'image/jpeg':1,'image/png':1,'image/webp':1,'image/heic':1,'image/heif':1};
function _supa(){ return (typeof window.getSupabase==='function')?window.getSupabase():null; }
function _uid(){ return (window._supaUser&&window._supaUser.id)||null; }

function _uploadPhoto(entryId,file){
  var supa=_supa(), uid=_uid();
  if(!supa||!uid) return Promise.resolve({ok:false,reason:'not signed in'});
  if(!file||!OK_MIME[file.type]) return Promise.resolve({ok:false,reason:'photo must be an image'});
  if(file.size>MAX_PHOTO) return Promise.resolve({ok:false,reason:'photo over 5 MB'});
  var ext=(file.type==='image/png')?'png':(file.type==='image/webp')?'webp':(file.type==='image/heic'||file.type==='image/heif')?'heic':'jpg';
  var path=uid+'/'+entryId+'_'+Date.now()+'.'+ext;
  return supa.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false})
    .then(function(r){ return r.error?{ok:false,reason:r.error.message||'upload failed'}:{ok:true,path:path}; })
    .catch(function(e){ return {ok:false,reason:(e&&e.message)||'upload exception'}; });
}
function _hydrateThumbs(host){
  var supa=_supa(); if(!supa) return;
  host.querySelectorAll('img[data-ws-photo]').forEach(function(img){
    var path=img.getAttribute('data-ws-photo');
    if(!path||img.src) return;
    supa.storage.from(BUCKET).createSignedUrl(path,3600).then(function(r){
      if(r&&r.data&&r.data.signedUrl) img.src=r.data.signedUrl;
      else img.style.display='none';
    }).catch(function(){ img.style.display='none'; });
  });
}
function walkStoryViewPhoto(path){
  var supa=_supa(); if(!supa||!path) return;
  var ov=document.getElementById('walkPhotoView');
  if(!ov){
    ov=document.createElement('div'); ov.id='walkPhotoView';
    ov.addEventListener('click',function(){ ov.style.display='none'; ov.innerHTML=''; });
    document.body.appendChild(ov);
  }
  supa.storage.from(BUCKET).createSignedUrl(path,600).then(function(r){
    if(!(r&&r.data&&r.data.signedUrl)){ _toast('Could not open photo'); return; }
    ov.innerHTML='<img alt="Milestone photo" src="'+_esc(r.data.signedUrl)+'">';
    ov.style.display='flex';
  }).catch(function(){ _toast('Could not open photo'); });
}

/* ── on this day + daily prompt ──────────────────────────── */
function _onThisDay(){
  var t=_todayKey(), mmdd=t.slice(5);
  var hits=_entries().filter(function(e){
    return e.date && e.date<t && e.date.slice(5)===mmdd;
  });
  return hits.length?hits[0]:null;
}
function _agoLabel(dateStr){
  var y1=parseInt(dateStr.slice(0,4),10), y2=parseInt(_todayKey().slice(0,4),10);
  var dy=y2-y1;
  if(dy===1) return 'One year ago today';
  if(dy>1) return dy+' years ago today';
  var m1=parseInt(dateStr.slice(5,7),10), m2=parseInt(_todayKey().slice(5,7),10);
  var dm=(m2-m1+12)%12||12;
  return dm===1?'One month ago today':dm+' months ago today';
}
var _PROMPTS=[
  'What did God do today?',
  'What are you thankful for tonight?',
  'Any answered prayer today?',
  'Where did you see grace today?',
  'One verse that stayed with you today?'
];
function _todaysPrompt(){ return _PROMPTS[Math.floor(Date.now()/86400000)%_PROMPTS.length]; }
function _promptDismissed(){
  try{ return localStorage.getItem(_userKey('prompt_done'))===_todayKey(); }catch(_e){ return false; }
}
function walkStoryDismissPrompt(){
  try{ localStorage.setItem(_userKey('prompt_done'),_todayKey()); }catch(_e){}
  var el=document.getElementById('wsPromptCard'); if(el) el.remove();
}

// The strip between the walk path and My Story: on-this-day (when one
// exists) + the once/day prompt. INLINE cards only — never a popup.
function renderWalkDailyStrip(hostId){
  var host=document.getElementById(hostId||'walkDailyStrip');
  if(!host) return;
  _css();
  var h='';
  var otd=_onThisDay();
  if(otd){
    h+='<div class="ws-strip"><span class="ws-strip-ico" aria-hidden="true">🕯️</span>'
      +'<span class="ws-strip-t"><span class="ws-strip-eyebrow">ON THIS DAY</span>'
      +_esc(_agoLabel(otd.date))+' — '+_esc(otd.icon)+' '+_esc(otd.title||otd.body||'')+'</span></div>';
  }
  if(!_promptDismissed()){
    h+='<div class="ws-strip" id="wsPromptCard"><span class="ws-strip-ico" aria-hidden="true">🖋️</span>'
      +'<span class="ws-strip-t"><span class="ws-strip-eyebrow">TONIGHT’S LINE</span>'+_esc(_todaysPrompt())+'</span>'
      +'<button type="button" class="ws-strip-btn" onclick="walkStoryOpenAdd(\'note\',true)">Write it</button>'
      +'<button type="button" class="ws-strip-x" onclick="walkStoryDismissPrompt()" aria-label="Dismiss for today">✕</button></div>';
  }
  host.innerHTML=h;
}

/* ── timeline render ─────────────────────────────────────── */
function renderWalkStory(hostId){
  var host=document.getElementById(hostId||'walkStoryWrap');
  if(!host) return;
  _css();
  var entries=_entries();
  var h='<div class="ws-wrap">'
    +'<div class="ws-eyebrow">MY STORY</div>'
    +'<div class="ws-actions">'
    +'<button type="button" class="ws-add" onclick="walkStoryOpenAdd()">+ Add to my story</button>'
    +'<button type="button" class="ws-share" onclick="walkStoryShare()" aria-label="Share a summary of your story">Share ↗</button>'
    +'</div>';
  if(!entries.length){
    h+='<div class="ws-card"><div class="ws-empty">This page is waiting for your story. Take a step on the path above, or tap “+ Add to my story” — one line tonight is enough.</div></div>';
  } else {
    h+='<div class="ws-card">';
    entries.forEach(function(e){
      var cls='ws-item ws-'+e.kind;
      h+='<div class="'+cls+'">'
        +'<span class="ws-ico" aria-hidden="true">'+_esc(e.icon)+'</span>'
        +'<span class="ws-mid">'
        +(e.title?'<span class="ws-title">'+_esc(e.title)+'</span>':'')
        +(e.body?'<span class="ws-body">'+(e.kind==='verse'?'&ldquo;':'')+_esc(e.body)+(e.kind==='verse'?'&rdquo;':'')+'</span>':'')
        +(e.reflection?'<span class="ws-body">&ldquo;'+_esc(e.reflection)+'&rdquo;</span>':'')
        +((e.witnesses||e.church)?'<span class="ws-meta">'+_esc([e.church,e.witnesses?('With '+e.witnesses):''].filter(Boolean).join(' · '))+'</span>':'')
        +(e.photoPath?'<img class="ws-thumb" alt="Milestone photo" data-ws-photo="'+_esc(e.photoPath)+'" onclick="walkStoryViewPhoto(this.getAttribute(\'data-ws-photo\'))">':'')
        +'</span>'
        +'<span class="ws-date">'+_esc(_friendly(e.date))+'</span>'
        +'</div>';
    });
    h+='</div>';
  }
  h+='</div>';
  host.innerHTML=h;
  _hydrateThumbs(host);
}

/* ── add-entry sheet ─────────────────────────────────────── */
var _pendingFile=null;
function _sheet(){
  var ov=document.getElementById('walkStoryOverlay');
  if(!ov){
    ov=document.createElement('div'); ov.id='walkStoryOverlay';
    ov.addEventListener('click',function(e){ if(e.target===ov) walkStoryCloseAdd(); });
    document.body.appendChild(ov);
  }
  return ov;
}
function walkStoryOpenAdd(type,fromPrompt){
  _css();
  var ov=_sheet();
  _pendingFile=null;
  if(!type){
    ov.innerHTML='<div class="ws-sheet"><div class="ws-sheet-h">ADD TO MY STORY</div>'
      +'<div class="ws-types">'
      +'<button type="button" class="ws-type" onclick="walkStoryOpenAdd(\'milestone\')"><span aria-hidden="true">⭐</span>Milestone</button>'
      +'<button type="button" class="ws-type" onclick="walkStoryOpenAdd(\'note\')"><span aria-hidden="true">📔</span>Note</button>'
      +'<button type="button" class="ws-type" onclick="walkStoryOpenAdd(\'verse\')"><span aria-hidden="true">📖</span>Verse</button>'
      +'</div>'
      +'<button type="button" class="ws-cancel" onclick="walkStoryCloseAdd()">Cancel</button></div>';
    ov.style.display='flex';
    return;
  }
  var f='';
  if(type==='milestone'){
    f='<div class="ws-field"><label class="ws-label" for="wsTitle">WHAT HAPPENED *</label><input id="wsTitle" class="ws-in" type="text" placeholder="e.g. Baptized at Celebration Church"></div>'
     +'<div class="ws-field"><label class="ws-label" for="wsDate">DATE</label><input id="wsDate" class="ws-in" type="date" value="'+_todayKey()+'"></div>'
     +'<div class="ws-field"><label class="ws-label" for="wsText">TELL THE STORY</label><textarea id="wsText" class="ws-in" placeholder="What happened? What did God do?"></textarea></div>'
     +'<div class="ws-field"><label class="ws-label" for="wsWit">WHO WAS THERE</label><input id="wsWit" class="ws-in" type="text" placeholder="Mom, Dad, youth group…"></div>'
     +'<div class="ws-field"><label class="ws-label" for="wsPhoto">PHOTO (OPTIONAL · PRIVATE TO YOU)</label><input id="wsPhoto" class="ws-in" type="file" accept="image/*"></div>';
  } else if(type==='verse'){
    f='<div class="ws-field"><label class="ws-label" for="wsRef">VERSE *</label><input id="wsRef" class="ws-in" type="text" placeholder="e.g. Romans 8:28"></div>'
     +'<div class="ws-field"><label class="ws-label" for="wsText">WHY IT MATTERED</label><textarea id="wsText" class="ws-in" placeholder="Why did this one land today?"></textarea></div>';
  } else {
    f='<div class="ws-field"><label class="ws-label" for="wsText">'+(fromPrompt?_esc(_todaysPrompt()).toUpperCase():'WRITE IT DOWN *')+'</label><textarea id="wsText" class="ws-in" placeholder="One honest line is enough."></textarea></div>';
  }
  var titles={milestone:'⭐ NEW MILESTONE',verse:'📖 SAVE A VERSE',note:'📔 NEW NOTE'};
  ov.innerHTML='<div class="ws-sheet"><div class="ws-sheet-h">'+titles[type]+'</div>'+f
    +'<button type="button" class="ws-cta" onclick="walkStorySave(\''+type+'\','+(fromPrompt?'true':'false')+')">Save to my story</button>'
    +'<button type="button" class="ws-cancel" onclick="walkStoryCloseAdd()">Cancel</button></div>';
  ov.style.display='flex';
  var first=ov.querySelector('input,textarea'); if(first) try{ first.focus(); }catch(_e){}
}
function walkStoryCloseAdd(){
  var ov=document.getElementById('walkStoryOverlay');
  if(ov){ ov.style.display='none'; ov.innerHTML=''; }
  _pendingFile=null;
}
function _rerender(){
  if(document.getElementById('walkStoryWrap')) renderWalkStory('walkStoryWrap');
  if(document.getElementById('walkDailyStrip')) renderWalkDailyStrip('walkDailyStrip');
}
function walkStorySave(type,fromPrompt){
  var val=function(id){ var el=document.getElementById(id); return el?String(el.value||'').trim():''; };
  var entry={ id:'ws_'+Date.now(), type:type, ts:new Date().toISOString(), date:_todayKey() };
  if(type==='milestone'){
    if(!val('wsTitle')){ _toast('Give it a title'); return; }
    entry.title=val('wsTitle');
    entry.date=val('wsDate')||_todayKey();
    entry.text=val('wsText');
    entry.witnesses=val('wsWit');
  } else if(type==='verse'){
    if(!val('wsRef')){ _toast('Which verse?'); return; }
    entry.ref=val('wsRef');
    entry.text=val('wsText');
  } else {
    if(!val('wsText')){ _toast('Write one line first'); return; }
    entry.text=val('wsText');
  }
  var fileEl=document.getElementById('wsPhoto');
  var file=(fileEl&&fileEl.files&&fileEl.files[0])||null;

  // Text saves FIRST — a photo failure can never lose the entry.
  _story().push(entry);
  _save();
  if(typeof window.walkQuestBump==='function'){ try{ window.walkQuestBump('reflect',1); }catch(_e){} }
  if(fromPrompt) walkStoryDismissPrompt();
  walkStoryCloseAdd();
  _juice();
  _toast(type==='milestone'?'⭐ Milestone saved to your story':type==='verse'?'📖 Verse saved to your story':'📔 Added to your story');
  _rerender();

  if(type==='milestone'&&file){
    _toast('Uploading photo…');
    _uploadPhoto(entry.id,file).then(function(r){
      if(r.ok){
        entry.photoPath=r.path;
        _save();
        _toast('Photo attached 📷');
      } else {
        _toast('Photo didn’t upload ('+r.reason+') — your milestone is saved');
      }
      _rerender();
    });
  }
}

/* ── share summary ───────────────────────────────────────── */
function _summaryText(){
  var w=_walk(), stations=(Array.isArray(window.WALK_STATIONS))?window.WALK_STATIONS:[];
  var completed=(w.completed&&typeof w.completed==='object')?w.completed:{};
  var doneIds=Object.keys(completed);
  var entries=_entries();
  var milestones=entries.filter(function(e){ return e.kind==='milestone'; });
  var notes=_story().filter(function(e){ return e&&e.type==='note'; }).length;
  var verses=_story().filter(function(e){ return e&&e.type==='verse'; }).length;
  var dates=entries.map(function(e){ return e.date; }).filter(Boolean).sort();
  var lines=['✨ My Walk with God — my story so far',''];
  if(doneIds.length&&stations.length){
    lines.push('👣 '+doneIds.length+' of '+stations.length+' steps walked:');
    stations.forEach(function(s){ if(s&&completed[s.id]) lines.push('   '+s.icon+' '+s.name+' — '+_friendly(completed[s.id])); });
    lines.push('');
  }
  if(milestones.length){
    lines.push('⭐ Milestones:');
    milestones.slice(0,6).forEach(function(m){ lines.push('   '+m.title+(m.date?' — '+_friendly(m.date):'')); });
    if(milestones.length>6) lines.push('   …and '+(milestones.length-6)+' more');
    lines.push('');
  }
  if(notes||verses) lines.push('📔 '+notes+' journal notes · 📖 '+verses+' verses that marked me');
  if(dates.length) lines.push('Walking since '+_friendly(dates[0]));
  lines.push('');
  lines.push('Start your own walk: https://yourlifecc.com');
  return lines.join('\n');
}
function walkStoryShare(){
  var text=_summaryText();
  // Photos and private reflections are never included — text summary only.
  if(navigator.share){
    navigator.share({ title:'My Walk with God', text:text }).catch(function(){});
    return;
  }
  var done=function(){ _toast('Story summary copied — paste it into email, text, anywhere'); };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(function(){
      try{ window.location.href='mailto:?subject='+encodeURIComponent('My Walk with God')+'&body='+encodeURIComponent(text); }catch(_e){}
    });
  } else {
    try{ window.location.href='mailto:?subject='+encodeURIComponent('My Walk with God')+'&body='+encodeURIComponent(text); }catch(_e){}
  }
}

/* ── expose ──────────────────────────────────────────────── */
window.renderWalkStory        = renderWalkStory;
window.renderWalkDailyStrip   = renderWalkDailyStrip;
window.walkStoryOpenAdd       = walkStoryOpenAdd;
window.walkStoryCloseAdd      = walkStoryCloseAdd;
window.walkStorySave          = walkStorySave;
window.walkStoryShare         = walkStoryShare;
window.walkStoryViewPhoto     = walkStoryViewPhoto;
window.walkStoryDismissPrompt = walkStoryDismissPrompt;
window.walkStoryFjMilestones  = walkStoryFjMilestones;
window.walkStoryLastEntry     = walkStoryLastEntry;

})();
