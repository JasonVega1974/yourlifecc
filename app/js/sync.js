/* =============================================================
   sync.js — localStorage save/load, Supabase cloud sync, sync status UI
============================================================= */

// ── STORAGE ─────────────────────────────────────────────────
const LS='lifeos_v2', CU='lifeos_cu', CK='lifeos_ck';

// ── DEVICE-OWNER GUARD ─────────────────────────────────────
// Every signed-in user "claims" this device by stamping their user_id into
// localStorage. On the next sign-in, if the stamp doesn't match the current
// auth user, the local cache belongs to someone else (e.g. previous family
// who deleted their account, or a shared/used device). We wipe before any
// save/cloudSync can promote the stale data to the new user's cloud row.
//
// This is what prevents "Good afternoon, Lilly" appearing on a brand-new
// account signed up on a device that previously hosted a different family.
function _ylccEnforceOwner(userId){
  if(!userId) return;
  try {
    var prev = localStorage.getItem('lifeos_owner_user_id');
    if(prev && prev !== userId){
      console.log('[LifeOS] Owner mismatch — wiping local state. prev=', prev, 'new=', userId);
      var rememberEmail = null;
      try { rememberEmail = localStorage.getItem('lifeos_remember_email'); } catch(_){}
      // Sweep YLCC + LifeOS keys (and any legacy keys we know about)
      for(var i = localStorage.length - 1; i >= 0; i--){
        var k = localStorage.key(i);
        if(!k) continue;
        if(k === 'lifeos_remember_email') continue;
        if(k.indexOf('ylcc_')   === 0 ||
           k.indexOf('lifeos_') === 0 ||
           k.indexOf('dominic_')=== 0 ||
           k.indexOf('levelup_')=== 0){
          try { localStorage.removeItem(k); } catch(_){}
        }
      }
      try { sessionStorage.clear(); } catch(_){}
      if(rememberEmail){
        try { localStorage.setItem('lifeos_remember_email', rememberEmail); } catch(_){}
      }
      // Reset in-memory state — `D = {...}` only rebinds in the calling scope,
      // so we mutate D in place and zero the parent.js arrays via .length=0
      // so all modules holding the reference see the wipe.
      try {
        if(typeof _profiles !== 'undefined' && Array.isArray(_profiles)) _profiles.length = 0;
        if(typeof _activeProfileId !== 'undefined') _activeProfileId = null;
        if(typeof D === 'object' && D && typeof DEF === 'object' && DEF){
          for(var dk in D){ if(Object.prototype.hasOwnProperty.call(D, dk)) delete D[dk]; }
          Object.assign(D, JSON.parse(JSON.stringify(DEF)));
        }
      } catch(_){}
    }
    localStorage.setItem('lifeos_owner_user_id', userId);
  } catch(e){ console.warn('[LifeOS] _ylccEnforceOwner error:', e); }
}

function save(){
  // Sync resume fields to D before saving
  const rFields=['rName','rTitle','rEmail','rPhone','rLocation','rLinkedin','rWebsite','rSummary','rSkills','rCerts','rLangs'];
  if(document.getElementById('rName')){
    if(!D.resume) D.resume={};
    rFields.forEach(id=>{ const el=document.getElementById(id); if(el) D.resume[id.slice(1).toLowerCase()]=el.value; });
    // Special case field name mappings
    const m={name:'rName',title:'rTitle',email:'rEmail',phone:'rPhone',location:'rLocation',linkedin:'rLinkedin',website:'rWebsite',summary:'rSummary',skills:'rSkills',certs:'rCerts',langs:'rLangs'};
    Object.entries(m).forEach(([k,id])=>{ const el=document.getElementById(id); if(el) D.resume[k]=el.value; });
    D.resume.experience=collectEntries('exp');
    D.resume.education=collectEntries('edu');
  }
  // Sync current profile data if in multi-profile mode (parent.js)
  if(typeof _activeProfileId !== 'undefined' && _activeProfileId && typeof _profiles !== 'undefined'){
    const curProfile = _profiles.find(p=>p.id===_activeProfileId);
    if(curProfile) curProfile.data = JSON.parse(JSON.stringify(D));
  }
  localStorage.setItem(LS, JSON.stringify(D));
  showSaved();
  // Sync to Supabase if logged in (debounced 2s)
  clearTimeout(_wpTimer);
  _wpTimer = setTimeout(cloudSync, 2000);
}

function loadData(){
  const keys=[LS,'lifeos_p1','lifeos_v1','dominic_v1','levelup_v3'];
  for(const k of keys){
    try{
      const r=localStorage.getItem(k); if(!r) continue;
      const p=JSON.parse(r); if(!p||typeof p!=='object') continue;
      for(const key of Object.keys(DEF)){ if(key in p) D[key]=p[key]; }
      // Sanitize scrReadDays — must always be an object, never an array
      if(!D.scrReadDays || Array.isArray(D.scrReadDays)) D.scrReadDays = {};
      if(!D.devPopupSeen) D.devPopupSeen = '';
      // Never hide sections added after initial registration
      if(D.sections){ ['cbt','resume','motivation','mentors','hero','parent','christianLiving','worship','scripture'].forEach(s=>{ delete D.sections[s]; }); }
      if(D.sections && D.sections.cbt===0) delete D.sections.cbt;
      if(k!==LS){ localStorage.setItem(LS,JSON.stringify(D)); }
      return;
    }catch(e){}
  }
}

function showSaved(){
  ['svi','svi2'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    el.style.opacity='1';
    clearTimeout(el._t);
    el._t=setTimeout(()=>el.style.opacity='0',1800);
  });
}

// ── CLOUD ────────────────────────────────────────────────────
function setSyncSt(s){ 
  // If we have a logged-in user, never show "Local Only" — show syncing state instead
  if(s==='local' && _supaUser) s='cloud';
  const labels={loading:['⟳ Syncing…','#888'],cloud:['☁ Cloud Saved','var(--gr)'],local:['💾 Local Only','var(--tx2)']};
  var t,col; var base=labels[s]||labels.local;
  t=base[0]; col=base[1];
  if(s==='cloud'){
    const last=localStorage.getItem('lifeos_last_sync');
    if(last){
      const mins=Math.round((Date.now()-parseInt(last))/60000);
      const timeStr=mins<1?'just now':mins<60?mins+'m ago':Math.round(mins/60)+'h ago';
      t='☁ Saved · '+timeStr;
    }
  }
  ['syncSt','syncSt2'].forEach(function(id){var el=document.getElementById(id);if(el){el.textContent=t;el.style.color=col;}});
  var emailEl=document.getElementById('authUserEmail');
  if(emailEl) emailEl.textContent=_supaUser?_supaUser.email:'';
  var sob=document.getElementById('sideSignOutBtn');
  if(sob) sob.style.display=_supaUser?'block':'none';
}


// ── CLOUD SYNC (Supabase) ─────────────────────────────────────
async function cloudSync(){
  console.log('[LifeOS Sync] cloudSync called. _supaUser:', _supaUser ? _supaUser.email : 'NULL');
  const supa = getSupabase();
  console.log('[LifeOS Sync] supa client:', supa ? 'OK' : 'NULL');
  if(!supa || !_supaUser){ 
    console.log('[LifeOS Sync] Aborting - no supa or no user');
    setSyncSt('local'); 
    return; 
  }
  try {
    console.log('[LifeOS Sync] Attempting upsert for user:', _supaUser.id);
    const { data, error } = await supa.from('profiles').upsert({
      user_id: _supaUser.id,
      email: _supaUser.email,
      data: D,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' }).select();
    console.log('[LifeOS Sync] Result - error:', error, 'data:', data);
    setSyncSt(error ? 'local' : 'cloud');
    if(!error) localStorage.setItem('lifeos_last_sync', Date.now());
    if(error) console.error('[LifeOS Sync] Upsert error details:', JSON.stringify(error));
  } catch(e){ 
    console.error('[LifeOS Sync] Exception:', e); 
    setSyncSt('local'); 
  }
}

async function cloudLoad(){
  const supa = getSupabase();
  if(!supa || !_supaUser) return false;
  // Wipe stale data from a different account before loading. No-op when the
  // stamp matches the current user (the common case).
  _ylccEnforceOwner(_supaUser.id);
  try {
    const { data, error } = await supa.from('profiles')
      .select('data')
      .eq('user_id', _supaUser.id)
      .single();
    if(error || !data?.data) return false;
    const saved = data.data;
    for(const k of Object.keys(DEF)){ if(k in saved) D[k] = saved[k]; }
    // Also restore keys saved in D that aren't in DEF (pb, myInstruments, etc.)
    for(const k of Object.keys(saved)){ if(!(k in DEF) && k !== 'undefined') D[k] = saved[k]; }
    // Sanitize scrReadDays — must always be an object {date:true}, never an array
    if(!D.scrReadDays || Array.isArray(D.scrReadDays)) D.scrReadDays = {};
    // Ensure devPopupSeen exists
    if(!D.devPopupSeen) D.devPopupSeen = '';
    // Strip any sections that should never be hidden
    if(D.sections){
      ['cbt','resume','motivation','mentors','hero','parent','christianLiving','worship','scripture'].forEach(function(k){ delete D.sections[k]; });
        // Force CBT always visible after cloud load
        if(D.sections && D.sections.cbt===0) delete D.sections.cbt;
    }
    localStorage.setItem('lifeos_last_sync', Date.now());
    // Restore profiles from cloud data into localStorage for this device.
    // Route through saveProfiles so per-profile data lands in its own LS key
    // and the index stays slim — writing the cloud's bloated array directly
    // into ylcc_profiles is what blew the quota in the first place.
    if(saved._profiles && saved._profiles.length > 0){
      _profiles = JSON.parse(JSON.stringify(saved._profiles));
      _activeProfileId = saved._activeProfileId || null;
      try { saveProfiles(); }
      catch(e){ console.warn('[YLCC profile] cloudLoad saveProfiles failed:', e.message); }
      console.log('[YLCC profile] cloudLoad restored profiles:', _profiles.map(p=>({id:p.id,name:p.name,isParent:p.isParent})), 'active=', _activeProfileId);
    }
    // Re-save cleaned data back to Supabase immediately so bad values don't persist
    try {
      await supa.from('profiles').upsert({
        user_id: _supaUser.id,
        email: _supaUser.email,
        data: D,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch(e){}
    return true;
  } catch(e){ return false; }
}

// Legacy - kept for settings page compatibility
function getCC(){ return null; }

function saveCloud(){ showToast("Cloud sync is now handled automatically via Supabase ☁"); }
function testCloud(){ showToast("Cloud sync is now handled automatically via Supabase ☁"); }

