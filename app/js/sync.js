/* =============================================================
   sync.js — localStorage save/load, Supabase cloud sync, sync status UI
============================================================= */

// ── STORAGE ─────────────────────────────────────────────────
const LS='lifeos_v2', CU='lifeos_cu', CK='lifeos_ck';

// ── DATE HELPER ─────────────────────────────────────────────
// new Date().toISOString().split('T')[0] returns the UTC date — for users
// west of UTC after ~16:00 local, that string is already "tomorrow" relative
// to the user's clock, which breaks "today's events" matching. This helper
// returns the local-clock YYYY-MM-DD string instead. Pass a Date or omit.
function localDateString(d){
  d = d || new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth()+1).padStart(2,'0') + '-' +
    String(d.getDate()).padStart(2,'0');
}

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
  } catch(_){}
}

function save(){
  // Parent-hub drill-down guard: while D holds a drilled child's data,
  // save()/cloudSync() would write the child's data under the parent's
  // user_id and corrupt the parent profile row. Block until parentDrillExit().
  if(typeof window._isParentDrillActive === 'function' && window._isParentDrillActive()) return;
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
      // WC-D2 (2026-06-14): one-time seed of the unified soundEnabled pref
      // from the retired skillsSound. Keyed off the STORED blob — once
      // soundEnabled has been persisted it's present here and we never
      // re-seed (idempotent), so an explicit OFF can't be flipped back ON.
      if(!('soundEnabled' in p)){
        if('skillsSound' in p) D.soundEnabled = !!p.skillsSound;
        // else: no prior sound pref at all — keep DEF default (false)
      }
      // Never hide sections added after initial registration
      if(D.sections){
        const FORCE = ['cbt','resume','motivation','mentors','hero','parent','christianLiving','worship','scripture'];
        const allowed = (typeof _bracketAllowedKeys === 'function') ? _bracketAllowedKeys(D.ageBracket) : null;
        FORCE.forEach(function(s){
          // 'hero', 'parent', 'cbt' are always-visible specials regardless of bracket.
          if(s === 'hero' || s === 'parent' || s === 'cbt'){ delete D.sections[s]; return; }
          if(allowed === null || allowed.has(s)) delete D.sections[s];
        });
      }
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


// ── SPEC 8 stomp-guard state ─────────────────────────────────
// _lastSeenUpdatedAt — server's updated_at as of our last successful
//   load/sync. Captured from the server's response (not constructed
//   locally) so cross-format string comparisons stay apples-to-apples.
// _lastSyncedDBaseline — JSON clone of D at the moment of last sync.
//   Used during a stomp-detected refetch to identify which keys THIS
//   device modified locally vs. which keys are identical to the version
//   we last synced. Only locally-modified keys overlay the fresh server
//   data; the rest take the server's newer values, preserving the other
//   device's writes for keys this device didn't touch.
let _lastSeenUpdatedAt = null;
let _lastSyncedDBaseline = null;

// ── CLOUD SYNC (Supabase) ─────────────────────────────────────
async function cloudSync(){
  const supa = getSupabase();
  if(!supa || !_supaUser){
    setSyncSt('local');
    return;
  }
  try {
    // Stomp guard — if we have a baseline from a prior load/sync, check
    // whether another device wrote since then before we overwrite their
    // change with our blob. Spec: select failure → proceed with the
    // write (availability > consistency, never block a save on a flaky
    // read). First-write (no baseline) also proceeds directly.
    if(_lastSeenUpdatedAt){
      let serverUpdatedAt = null;
      let selectOk = true;
      try {
        const { data: row, error: selErr } = await supa.from('profiles')
          .select('updated_at')
          .eq('user_id', _supaUser.id)
          .single();
        if(selErr) selectOk = false;
        else if(row && row.updated_at) serverUpdatedAt = row.updated_at;
      } catch(_){ selectOk = false; }
      if(selectOk && serverUpdatedAt && serverUpdatedAt !== _lastSeenUpdatedAt){
        console.warn('[sync] stomp averted — server updated_at ' + serverUpdatedAt +
                     ' differs from our last-seen ' + _lastSeenUpdatedAt +
                     '; per-key merge before write');
        // Snapshot what THIS device intends to write; fetch the fresh
        // server blob WITHOUT going through cloudLoad's re-save chain
        // (we'll re-save once at the end of this cloudSync); per-key
        // merge: keys this device locally modified win, the rest take
        // the server's fresh values.
        const myPending = JSON.parse(JSON.stringify(D));
        try {
          const { data: fresh, error: freshErr } = await supa.from('profiles')
            .select('data, updated_at')
            .eq('user_id', _supaUser.id)
            .single();
          if(!freshErr && fresh && fresh.data){
            const serverD = fresh.data;
            const baseline = _lastSyncedDBaseline || {};
            // Iterate every key present in either myPending or serverD
            // — covers DEF keys plus any non-DEF keys (pb, myInstruments)
            // that the existing cloudLoad already restores.
            const allKeys = new Set();
            Object.keys(myPending || {}).forEach(k => allKeys.add(k));
            Object.keys(serverD || {}).forEach(k => allKeys.add(k));
            allKeys.forEach(k => {
              if(k === 'undefined') return;
              const localEdited = JSON.stringify(myPending[k]) !== JSON.stringify(baseline[k]);
              if(localEdited){
                D[k] = myPending[k];      // this device modified it — keep our value
              } else if(k in serverD){
                D[k] = serverD[k];        // server has a newer value — take it
              }
              // else: key only exists in baseline; leave D[k] alone (cloudLoad
              // would also drop it under the current top-level shape).
            });
          }
        } catch(_){ /* fresh-fetch failed → fall through and upsert our pending */ }
      }
    }

    const writeStamp = new Date().toISOString();
    const { data: writeRow, error } = await supa.from('profiles').upsert({
      user_id: _supaUser.id,
      email: _supaUser.email,
      data: D,
      updated_at: writeStamp
    }, { onConflict: 'user_id' }).select('updated_at').single();
    setSyncSt(error ? 'local' : 'cloud');
    if(!error){
      // Use the SERVER's echoed updated_at as the new baseline timestamp
      // (microsecond precision + tz format that future SELECTs return).
      _lastSeenUpdatedAt = (writeRow && writeRow.updated_at) || writeStamp;
      _lastSyncedDBaseline = JSON.parse(JSON.stringify(D));
      localStorage.setItem('lifeos_last_sync', Date.now());
      // Tab 1 Increment 1 — fire-and-forget mirror of D.chores +
      // D.choreLog into public.chores / public.chore_completions.
      // No-ops silently if chores-schema.sql hasn't been applied yet.
      _mirrorChoresToCloud(supa, _supaUser.id);
      // Tab 2 Increment 2 — same discipline for D.transactions ->
      // public.money_transactions. Silent bail on 42P01 (table not
      // applied yet) so the JSONB-first path keeps working in the
      // pre-migration window.
      if(typeof _mirrorMoneyToCloud === 'function'){
        _mirrorMoneyToCloud(supa, _supaUser.id);
      }
    }
  } catch(_){
    setSyncSt('local');
  }
}

// Tab 1 Increment 1 — dual-write helper.
//
// Mirrors D.chores into public.chores (idempotent upsert on id) and
// D.choreLog into public.chore_completions (UNIQUE chore_id+completed_date).
// JSONB blob remains canonical until later increments swap reads over.
//
// Multi-profile safety (revised post-Increment-1):
//   parent.js maintains _profiles[] + _activeProfileId so one auth
//   account can host multiple kids. D.chores flips to the active
//   profile's chore set on every switchToProfile(). Without
//   profile_id, Kid A's chores and Kid B's chores would intermingle
//   under user_id=mom.id with no way to filter them apart.
//
//   We solve this two ways belt-and-suspenders:
//     1) profile_id column on both tables (sourced from
//        _activeProfileId, '_solo' sentinel when undefined). RLS
//        still isolates by user_id; app reads filter by profile_id.
//     2) Chore ID is namespaced with profile id —
//        'ch_<profileId>_<numericId>' — so sibling profiles cannot
//        collide on the text PK even in theory.
//
// Defensive by design — if chores-schema.sql hasn't been applied,
// PostgREST returns 42P01 and we silently bail. Never throws.
async function _mirrorChoresToCloud(supa, userId){
  try {
    const chores = Array.isArray(D.chores) ? D.chores : [];
    const log    = Array.isArray(D.choreLog) ? D.choreLog : [];
    if(!chores.length && !log.length) return;

    // Resolve the active profile id. Multi-profile mode is opt-in via
    // parent.js; for solo accounts _activeProfileId is empty/undefined
    // and the '_solo' sentinel keeps the column NOT NULL.
    const activeProfile =
      (typeof _activeProfileId !== 'undefined' && _activeProfileId)
        ? String(_activeProfileId)
        : '_solo';

    const choreId = (v) => {
      if(v === null || v === undefined) return null;
      const s = String(v);
      if(s.startsWith('ch_')) return s;
      return 'ch_' + activeProfile + '_' + s;
    };
    const VALID_FREQ = new Set(['daily','weekly','monthly','once']);
    const VALID_DIFF = new Set(['easy','medium','hard']);
    const VALID_STATUS = new Set(['pending','verified','rejected','redeemed']);

    // chores rows
    const choreRows = chores.map((c, idx) => ({
      id:         choreId(c.id),
      user_id:    userId,
      profile_id: activeProfile,
      name:       String(c.name || ''),
      emoji:      c.emoji || '📌',
      category:   c.cat || null,
      points:     Number.isFinite(+c.pts) ? +c.pts : 10,
      difficulty: VALID_DIFF.has(c.difficulty) ? c.difficulty : 'medium',
      frequency:  VALID_FREQ.has(c.freq) ? c.freq : 'daily',
      active:     c.active !== false,
      sort_order: idx,
      updated_at: new Date().toISOString()
    })).filter(r => r.id && r.name);

    if(choreRows.length){
      const { error } = await supa.from('chores').upsert(choreRows, { onConflict: 'id' });
      // 42P01 = relation does not exist (migration not applied yet) → silent bail
      if(error && error.code !== '42P01'){
        console.debug('[chores mirror] upsert chores skipped:', error.message);
      }
      if(error) return; // bail before touching chore_completions
    }

    // chore_completions rows — skip redemptions (choreId null) and entries whose
    // parent chore no longer exists (FK would fail).
    const existingIds = new Set(choreRows.map(r => r.id));
    const completions = log.filter(l => l.choreId && l.date && VALID_STATUS.has(l.status))
      .map(l => ({
        chore_id:       choreId(l.choreId),
        user_id:        userId,
        profile_id:     activeProfile,
        completed_date: l.date,
        status:         l.status,
        points_awarded: (l.status === 'verified' && Number.isFinite(+l.pts)) ? +l.pts : 0,
        // Tab 1 Inc 3 — storage path under chore-proofs bucket. Null
        // when no photo was attached; never a public URL.
        photo_url:      l.photoPath || null
      }))
      .filter(r => existingIds.has(r.chore_id));

    if(completions.length){
      const { error } = await supa.from('chore_completions').upsert(completions, { onConflict: 'chore_id,completed_date' });
      if(error && error.code !== '42P01'){
        console.debug('[chores mirror] upsert completions skipped:', error.message);
      }
    }
  } catch(e){
    // Never let dual-write break the main save flow
    console.debug('[chores mirror] exception:', e && e.message);
  }
}

// Tab 2 Increment 2 — D.transactions -> public.money_transactions
// fire-and-forget mirror. Same discipline as the chores mirror:
//   - JSONB blob (D.transactions) stays canonical
//   - Silent bail on 42P01 (table not applied yet)
//   - Never throws — wrapped in try/catch so save() never breaks
//   - Idempotent upsert on text PK so re-runs are safe
//
// Per Phase 1 of the PIN -> stable-id decouple (v249), profile_id
// uses _pidOf(activeProfile) — the stable id. New rows have NO
// PIN debt and require no Phase 2 remap.
//
// id coercion: legacy D.transactions entries have numeric Date.now()
// ids. We coerce to 'tx_<profile>_<n>' so sibling profiles can't
// collide on the text PK (matches the chores 'ch_<profile>_<n>'
// pattern). Already-text ids that begin with 'tx_' pass through
// unchanged so the coercion is idempotent across syncs.
async function _mirrorMoneyToCloud(supa, userId){
  try {
    const transactions = Array.isArray(D.transactions) ? D.transactions : [];
    if(!transactions.length) return;

    // Resolve active profile via _pidOf (Phase 1 stable id) with
    // graceful fallbacks. Solo accounts continue to use '_solo'
    // matching the chores / chore_completions mirror sentinel.
    let activeProfile = '_solo';
    if(typeof _profiles !== 'undefined' && _profiles
       && typeof _activeProfileId !== 'undefined' && _activeProfileId){
      const active = _profiles.find(p => p && p.id === _activeProfileId);
      if(active){
        const k = (typeof _pidOf === 'function')
          ? _pidOf(active)
          : (active.stableId || active.id);
        if(k) activeProfile = String(k);
      }
    }

    const txId = (v) => {
      if(v === null || v === undefined) return null;
      const s = String(v);
      if(s.startsWith('tx_')) return s;
      return 'tx_' + activeProfile + '_' + s;
    };

    const VALID_TYPE = new Set(['income','expense','savings','transfer']);
    const today = new Date().toISOString().slice(0,10);

    const rows = transactions.map(t => {
      if(!t) return null;
      const id     = txId(t.id);
      const amount = Number.isFinite(+t.amt) ? +t.amt : null;
      if(id === null || amount === null) return null;
      // type 'expense' is the safest fallback for legacy entries
      // missing the field — UI surfaces them as expenses (red)
      // rather than silently dropping them or miscounting as income.
      const type = VALID_TYPE.has(t.type) ? t.type : 'expense';
      return {
        id:          id,
        user_id:     userId,
        profile_id:  activeProfile,
        amount:      amount,
        type:        type,
        category:    t.cat || null,
        description: String(t.name || ''),
        date:        t.date || today,
        updated_at:  new Date().toISOString()
      };
    }).filter(Boolean);

    if(!rows.length) return;

    const { error } = await supa.from('money_transactions').upsert(rows, { onConflict: 'id' });
    if(error && error.code !== '42P01'){
      console.debug('[money mirror] upsert transactions skipped:', error.message);
    }
  } catch(e){
    // Never let dual-write break the main save flow
    console.debug('[money mirror] exception:', e && e.message);
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
      .select('data, updated_at')
      .eq('user_id', _supaUser.id)
      .single();
    if(error || !data?.data) return false;
    const saved = data.data;
    // SPEC 8 — capture the server's updated_at immediately on load so
    // subsequent cloudSync calls have a baseline to detect cross-device
    // writes against. Refreshed below from the post-load re-save's echo.
    if(data.updated_at) _lastSeenUpdatedAt = data.updated_at;
    for(const k of Object.keys(DEF)){ if(k in saved) D[k] = saved[k]; }
    // Also restore keys saved in D that aren't in DEF (pb, myInstruments, etc.)
    for(const k of Object.keys(saved)){ if(!(k in DEF) && k !== 'undefined') D[k] = saved[k]; }
    // Sanitize scrReadDays — must always be an object {date:true}, never an array
    if(!D.scrReadDays || Array.isArray(D.scrReadDays)) D.scrReadDays = {};
    // Ensure devPopupSeen exists
    if(!D.devPopupSeen) D.devPopupSeen = '';
    // WC-D2 (2026-06-14): seed the unified soundEnabled pref from the
    // retired skillsSound on the first cloud load that predates it. If the
    // cloud row already carries soundEnabled the DEF-merge above restored
    // it and this is skipped (idempotent) — the cloud value is authoritative.
    if(!('soundEnabled' in saved)){
      if('skillsSound' in saved) D.soundEnabled = !!saved.skillsSound;
    }
    // Strip any sections that should never be hidden
    if(D.sections){
      const FORCE = ['cbt','resume','motivation','mentors','hero','parent','christianLiving','worship','scripture'];
      const allowed = (typeof _bracketAllowedKeys === 'function') ? _bracketAllowedKeys(D.ageBracket) : null;
      FORCE.forEach(function(k){
        if(k === 'hero' || k === 'parent' || k === 'cbt'){ delete D.sections[k]; return; }
        if(allowed === null || allowed.has(k)) delete D.sections[k];
      });
      // Force CBT always visible after cloud load
      if(D.sections.cbt===0) delete D.sections.cbt;
    }
    localStorage.setItem('lifeos_last_sync', Date.now());
    // Restore profiles from cloud data into localStorage for this device.
    // Route through saveProfiles so per-profile data lands in its own LS key
    // and the index stays slim — writing the cloud's bloated array directly
    // into ylcc_profiles is what blew the quota in the first place.
    if(saved._profiles && saved._profiles.length > 0){
      _profiles = JSON.parse(JSON.stringify(saved._profiles));
      _activeProfileId = saved._activeProfileId || null;
      try { saveProfiles(); } catch(_){}
    }
    // Re-save cleaned data back to Supabase immediately so bad values don't persist
    try {
      const { data: writeRow } = await supa.from('profiles').upsert({
        user_id: _supaUser.id,
        email: _supaUser.email,
        data: D,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }).select('updated_at').single();
      // SPEC 8 — bump the baseline to the value the server echoes back
      // (matches the format of future SELECTs for clean comparison).
      if(writeRow && writeRow.updated_at) _lastSeenUpdatedAt = writeRow.updated_at;
    } catch(e){}
    // SPEC 8 — snapshot D as the per-key merge baseline. Subsequent
    // local edits + cloudSync's stomp guard diff against this to decide
    // which top-level keys this device actually modified.
    _lastSyncedDBaseline = JSON.parse(JSON.stringify(D));
    return true;
  } catch(e){ return false; }
}

// Legacy - kept for settings page compatibility
function getCC(){ return null; }

function saveCloud(){ showToast("Cloud sync is now handled automatically via Supabase ☁"); }
function testCloud(){ showToast("Cloud sync is now handled automatically via Supabase ☁"); }

