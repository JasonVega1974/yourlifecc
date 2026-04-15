/* =============================================================
   sync.js — localStorage save/load, Supabase cloud sync, sync status UI
============================================================= */

// ── STORAGE ─────────────────────────────────────────────────
const LS='lifeos_v2', CU='lifeos_cu', CK='lifeos_ck';

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
  localStorage.setItem(LS, JSON.stringify(D));
  showSaved();
  // Keep the active profile snapshot current so switchToProfile()
  // never loads stale data (fixes tutorial / devotional re-showing)
  if(typeof _profiles !== 'undefined' && typeof _activeProfileId !== 'undefined' && _activeProfileId){
    const _ap = _profiles.find(function(p){ return p.id === _activeProfileId; });
    if(_ap){ _ap.data = JSON.parse(JSON.stringify(D)); }
    if(typeof saveProfiles === 'function') saveProfiles();
  }
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
      if(D.sections){ ['cbt','resume','motivation','mentors','hero','parent'].forEach(s=>{ delete D.sections[s]; }); }
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
      ['cbt','resume','motivation','mentors','hero','parent'].forEach(function(k){ delete D.sections[k]; });
        // Force CBT always visible after cloud load
        if(D.sections && D.sections.cbt===0) delete D.sections.cbt;
    }
    localStorage.setItem('lifeos_last_sync', Date.now());
    // Restore profiles from cloud data into localStorage for this device
    if(saved._profiles && saved._profiles.length > 0){
      _profiles = JSON.parse(JSON.stringify(saved._profiles));
      _activeProfileId = saved._activeProfileId || null;
      localStorage.setItem('ylcc_profiles', JSON.stringify(_profiles));
      localStorage.setItem('ylcc_active_profile', _activeProfileId||'');
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

