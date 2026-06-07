/* =============================================================
   chores.js — Chore system, rewards store, screen time manager,
               earnings & savings jar, allowance
============================================================= */

// ── CHORES & REWARDS SYSTEM ──────────────────────────────────
let _parentMode = false;
const CHORE_LEVELS = [
  {level:1,name:'Beginner',min:0,max:100},
  {level:2,name:'Helper',min:100,max:250},
  {level:3,name:'Contributor',min:250,max:500},
  {level:4,name:'Rockstar',min:500,max:1000},
  {level:5,name:'Champion',min:1000,max:2000},
  {level:6,name:'Legend',min:2000,max:5000},
  {level:7,name:'Master',min:5000,max:10000},
  {level:8,name:'GOAT',min:10000,max:999999},
];

const CHORE_CAT_EMOJI = {cleaning:'🧹',kitchen:'🍽️',laundry:'👕',outdoor:'🌿',pets:'🐕',academic:'📚',personal:'🧑',family:'👪',other:'📌'};

function initChoreData(){
  if(!D.chores) D.chores=[];
  if(!Array.isArray(D.chores)) D.chores=[];
  if(!D.rewards) D.rewards=[];
  if(!D.choreLog) D.choreLog=[];
  // Handle legacy where chorePoints was stored as a number or array instead of {total,spent}
  if(!D.chorePoints || typeof D.chorePoints !== 'object' || Array.isArray(D.chorePoints)){
    const legacy = typeof D.chorePoints === 'number' ? D.chorePoints : 0;
    D.chorePoints = {total: legacy, spent: 0};
  }
  if(D.chorePoints.total === undefined) D.chorePoints.total = 0;
  if(D.chorePoints.spent === undefined) D.chorePoints.spent = 0;
  if(!D.chorePin) D.chorePin='';

  // ── Tab 1 Increment 3 — one-time store consolidation ────────
  // D.rewards was the kid-points reward shop inside #s-chores.
  // D.pb.storeItems is the Parent Bucks store inside #s-rewards
  // (and now also inside #ch-store). Now both flow through PB.
  // Migration rule: copy any D.rewards entry whose name doesn't
  // already exist in D.pb.storeItems (case-insensitive, trimmed).
  // Sets D.rewardsLegacyMigrated=true on first run so the copy
  // never repeats — guards against double-merging after a future
  // resave. D.rewards is left intact (read-only fallback in case
  // the migration produced a surprise; visible in cloud blob only).
  if(!D.rewardsLegacyMigrated && Array.isArray(D.rewards) && D.rewards.length){
    if(!D.pb && typeof initParentBucks === 'function') initParentBucks();
    if(!D.pb) D.pb = {balance:0, log:[], storeItems:[], spinTickets:0, scratchTickets:0};
    if(!Array.isArray(D.pb.storeItems)) D.pb.storeItems = [];
    const seen = new Set(D.pb.storeItems.map(it => String(it && it.name || '').trim().toLowerCase()).filter(Boolean));
    let copied = 0;
    D.rewards.forEach(r => {
      const key = String(r && r.name || '').trim().toLowerCase();
      if(!key)        return; // skip blank-name legacy rows
      if(seen.has(key)) return; // skip name match — dedup is by name only, regardless of cost
      D.pb.storeItems.push({
        id:     Date.now() + copied,            // ensure unique ids across the batch
        emoji:  '🎁',
        name:   r.name,
        cost:   Number.isFinite(+r.pts) ? +r.pts : 50,
        active: r.active !== false
      });
      seen.add(key);
      copied++;
    });
    D.rewardsLegacyMigrated = true;
    if(copied > 0) console.debug('[chores migration] copied', copied, 'D.rewards entry(ies) into D.pb.storeItems');
  }
}

// ── Tab 1 Increment 3 — photo proof helpers ─────────────────
// Allow-list mirrors the chore-proofs bucket's allowed_mime_types
// (see docs/migrations/chore-proofs-bucket.sql). 5 MB cap mirrors
// the bucket's file_size_limit. Both gates here so the user gets a
// friendly toast rather than a 413 from PostgREST.
const CHORE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const CHORE_PHOTO_MIME = {
  'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp',
  'image/heic':'heic', 'image/heif':'heif'
};
let _chorePhotoPendingId = null;

// Opens the hidden file input scoped to the current chore. The
// onchange handler in index.html routes the selected file back to
// markChoreDone(_chorePhotoPendingId, file). Falls back gracefully
// if the input isn't in the DOM (e.g., legacy single-file shells).
function chorePhotoPick(choreId){
  const input = document.getElementById('chorePhotoInput');
  if(!input){ showToast('Photo upload unavailable'); return; }
  _chorePhotoPendingId = choreId;
  input.value = ''; // allow re-select of the same file
  input.click();
}

// Wired from index.html onchange. Resolves the pending chore id,
// then delegates to markChoreDone with the selected file. Defensive
// against a stray click without a pending chore id.
function chorePhotoOnChange(input){
  const file = input && input.files && input.files[0];
  const id = _chorePhotoPendingId;
  _chorePhotoPendingId = null;
  if(!file || id === null || id === undefined) return;
  markChoreDone(id, file);
}

// Upload to chore-proofs under <user_id>/<profile_id>/<chore_id>/<ts>.<ext>.
// Returns { ok:true, path } on success, { ok:false, reason } on failure.
// Never throws — caller decides whether to proceed without a photo.
async function _uploadChoreProof(supa, userId, choreId, file){
  if(!supa || !userId) return { ok:false, reason:'not signed in' };
  // Path: profile is namespaced into chore_id already, but include it
  // explicitly as the second segment so future cleanup queries
  // (delete from storage.objects where name like ...) are tractable.
  const activeProfile =
    (typeof _activeProfileId !== 'undefined' && _activeProfileId)
      ? String(_activeProfileId)
      : '_solo';
  const ext = CHORE_PHOTO_MIME[file.type] || 'bin';
  const stamp = Date.now();
  const path = userId + '/' + activeProfile + '/' + String(choreId) + '/' + stamp + '.' + ext;
  try {
    const { error } = await supa.storage.from('chore-proofs')
      .upload(path, file, { contentType: file.type, upsert: false });
    if(error) return { ok:false, reason: error.message || 'upload failed' };
    return { ok:true, path: path };
  } catch(e){
    return { ok:false, reason: (e && e.message) || 'upload exception' };
  }
}

// Sub-tab nav for #s-chores (Tab 1 Increment 1). Mirrors the
// habits hb-tab / hb-panel pattern. Targets: ch-mychores, ch-store,
// ch-leaderboard, ch-history, ch-streaks.
function cTab(tab, btn){
  const panels = document.querySelectorAll('#s-chores .ch-panel');
  panels.forEach(p => p.style.display = 'none');
  const tabs = document.querySelectorAll('#s-chores .ch-tab');
  tabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
  const target = document.getElementById('ch-' + tab);
  if(target) target.style.display = 'block';
  if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); }
  // Tab 1 Inc 3 — when the Store tab is opened, ensure the unified
  // Parent Bucks store is freshly populated. renderParentBucks() is
  // the same renderer used by s-rewards' #pbStoreItems; it now also
  // fills #choreStoreItems (see email.js).
  if(tab === 'store' && typeof renderParentBucks === 'function') renderParentBucks();
  // Tab 1 Inc 4 — three read-only sub-tabs render on activation, not
  // on every renderChores() pass (each scans D.choreLog and walks
  // _profiles, so deferring to activation keeps the My Chores tab
  // snappy on every save).
  if(tab === 'streaks'     && typeof renderChoreStreaks      === 'function') renderChoreStreaks();
  if(tab === 'leaderboard' && typeof renderChoreLeaderboard  === 'function') renderChoreLeaderboard();
  if(tab === 'history'     && typeof renderChoreHistory      === 'function') renderChoreHistory();
  // Tab 1 Inc 5 Step C — paint the coach card on My Chores activation
  // and kick off an auto-fetch when the cached week is stale + the kid
  // has verified chores worth coaching about.
  if(tab === 'mychores'){
    if(typeof renderChoreCoach === 'function')         renderChoreCoach();
    if(typeof _maybeAutoFetchChoreCoach === 'function') _maybeAutoFetchChoreCoach();
  }
}


function addChore(){
  initChoreData();
  const name = document.getElementById('choreNewName').value.trim();
  if(!name){ showToast('Enter a chore name'); return; }
  const pts = parseInt(document.getElementById('choreNewPts').value)||10;
  const freq = document.getElementById('choreNewFreq').value;
  const cat = document.getElementById('choreNewCat').value;
  D.chores.push({id:Date.now(), name, pts, freq, cat, emoji:CHORE_CAT_EMOJI[cat]||'📌', active:true});
  document.getElementById('choreNewName').value='';
  document.getElementById('choreNewPts').value='';
  save(); renderChores();
  showToast('Chore added ✓');
}

// ════════════════════════════════════════════════════════════
// Tab 1 Increment 5 Step A-2 — Bulk-add seasonal chore packs.
//
// Looks up a pack by id in window.CHORE_PACKS (data module at
// app/js/data/chore-packs.js), then pushes each chore into
// D.chores unless a chore with the same name (case-insensitive,
// trimmed) already exists. Dedupe is "skip-copy on collision"
// per Inc 5 Step A decision #4 — idempotent re-apply, no
// duplicates, no "force re-add" affordance in v1.
//
// Side effects on successful add: save() + renderChores() to
// repaint the kid view + _checkChoreBadges() so a parent setup
// that pushes the kid over 5 categories awards Renaissance Kid
// immediately (Inc 5 Step A decision #7).
//
// Return shape lets the caller (Parent Hub UI in 5A-3) describe
// what just happened: { added, skipped, pack }.
// ════════════════════════════════════════════════════════════
function addChorePack(packId){
  initChoreData();
  var packs = (typeof window !== 'undefined' && Array.isArray(window.CHORE_PACKS))
    ? window.CHORE_PACKS : [];
  var pack = packs.find(function(p){ return p && p.id === packId; });
  if(!pack){
    if(typeof showToast === 'function') showToast('Pack not found');
    return { added: 0, skipped: 0, pack: null };
  }
  if(!Array.isArray(D.chores)) D.chores = [];

  // Case-insensitive trimmed name index of the kid's current
  // active+inactive chores. We dedupe across ALL chores, not just
  // active ones, so a re-apply doesn't resurrect a chore the
  // parent deliberately deactivated.
  var existingNames = {};
  D.chores.forEach(function(c){
    var key = String((c && c.name) || '').trim().toLowerCase();
    if(key) existingNames[key] = true;
  });

  var added = 0, skipped = 0;
  var rows = Array.isArray(pack.chores) ? pack.chores : [];
  rows.forEach(function(row, i){
    var key = String((row && row.name) || '').trim().toLowerCase();
    if(!key){ skipped++; return; }
    if(existingNames[key]){ skipped++; return; }
    // Fallback chain for emoji: explicit row.emoji > category
    // default from CHORE_CAT_EMOJI > generic 📌.
    var emoji = (row && row.emoji)
      || (typeof CHORE_CAT_EMOJI !== 'undefined' ? CHORE_CAT_EMOJI[row.cat] : '')
      || '📌';
    // id scheme matches addChore() — Date.now() with a per-row
    // offset so a batch doesn't collide if the loop runs faster
    // than Date.now()'s millisecond resolution.
    D.chores.push({
      id:         Date.now() + i,
      name:       row.name,
      pts:        Number.isFinite(+row.pts) ? +row.pts : 10,
      freq:       row.freq || 'daily',
      cat:        row.cat  || 'other',
      emoji:      emoji,
      difficulty: row.difficulty || 'easy',
      active:     true
    });
    existingNames[key] = true;
    added++;
  });

  if(added > 0){
    save();
    if(typeof renderChores === 'function') renderChores();
    // Trigger badge check — Renaissance Kid awards on 5+ verified
    // categories, and Helper Heart / streaks won't move on a pack
    // apply, but a future badge tied to "library size" would fire
    // here. Cheap to run; safe to skip on no-op (added===0).
    if(typeof _checkChoreBadges === 'function') _checkChoreBadges();
  }

  if(typeof showToast === 'function'){
    if(added === 0){
      showToast('All ' + skipped + ' chores already on your list');
    } else if(skipped === 0){
      showToast('Added ' + added + ' chores from "' + pack.name + '" ✓');
    } else {
      showToast('Added ' + added + ' · skipped ' + skipped + ' (already on list)');
    }
  }
  return { added: added, skipped: skipped, pack: pack };
}


function toggleChoreActive(id){
  const chore = (Array.isArray(D.chores)?D.chores:[]).find(c=>c.id===id);
  if(chore){ chore.active = !chore.active; save(); renderChores(); }
}

// Difficulty multiplier helper (Tab 1 Increment 2). Legacy chores
// without an explicit difficulty fall through to 1.0× — no behavior
// change for chores created before this increment.
function _choreMultiplier(diff){
  if(diff === 'hard')   return 2.0;
  if(diff === 'medium') return 1.5;
  if(diff === 'easy')   return 1.0;
  return 1.0;
}

async function markChoreDone(id, file){
  initChoreData();
  const chore = (Array.isArray(D.chores)?D.chores:[]).find(c=>c.id===id);
  if(!chore) return;
  const today = new Date().toISOString().slice(0,10);
  // Check if already done today
  const already = D.choreLog.find(l=>l.choreId===id && l.date===today && (l.status==='done'||l.status==='pending'));
  if(already){ showToast('Already submitted today'); return; }

  // Tab 1 Increment 3 — optional photo proof. Validate client-side
  // first so a rejection surfaces as a toast, not a 413 from
  // PostgREST. Then upload; on success attach the storage path to
  // the log entry, on failure prompt the kid to decide.
  let photoPath = null;
  if(file){
    if(!CHORE_PHOTO_MIME[file.type]){
      showToast('Photos only — JPEG / PNG / WebP / HEIC');
      return;
    }
    if(file.size > CHORE_PHOTO_MAX_BYTES){
      showToast('Photo too large — max 5 MB');
      return;
    }
    const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
    const uid  = (typeof _supaUser !== 'undefined' && _supaUser) ? _supaUser.id : null;
    if(!supa || !uid){
      showToast('Sign in to add a photo — submitting without it');
      // fall through; submit text-only
    } else {
      showToast('Uploading photo…');
      const r = await _uploadChoreProof(supa, uid, id, file);
      if(r.ok){
        photoPath = r.path;
      } else {
        showToast('Photo upload failed — submitting without it');
        // Don't block the chore submission; behave the same as no-photo path.
      }
    }
  }

  // Tab 1 Increment 2 — apply difficulty multiplier at submit-time so the
  // pending log row already reflects what the kid will earn on verify.
  // Verify-time math is unchanged: it just awards entry.pts.
  const mult = _choreMultiplier(chore.difficulty);
  const basePts = Number.isFinite(+chore.pts) ? +chore.pts : 0;
  const earnedPts = Math.round(basePts * mult);
  D.choreLog.push({
    id:Date.now(), choreId:id, choreName:chore.name, pts:earnedPts,
    date:today, time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'}),
    status:'pending', emoji:chore.emoji,
    // Snapshot the base + multiplier for transparency in History — also
    // protects against the chore's difficulty being changed between
    // submit and verify.
    basePts: basePts, mult: mult,
    // Tab 1 Inc 3 — storage path (NOT a URL). Parent verification
    // signs short-lived URLs from this path on demand. null when no
    // photo was attached.
    photoPath: photoPath
  });
  save(); renderChores();
  showToast(photoPath ? 'Submitted with photo ✓' : 'Submitted for verification ✓');
}

function verifyChore(logId, approved){
  initChoreData();
  const entry = D.choreLog.find(l=>l.id===logId);
  if(!entry) return;
  if(approved){
    entry.status='verified';
    D.chorePoints.total += entry.pts;
    // Award Parent Bucks — 1 PB per chore point
    earnPB(entry.pts, 'Chore completed: '+entry.choreName);
    // Every 3rd verified chore earns a spin ticket
    const totalVerified = D.choreLog.filter(l=>l.status==='verified').length;
    if(totalVerified % 3 === 0){
      if(!D.pb) initParentBucks();
      D.pb.spinTickets = (D.pb.spinTickets||0) + 1;
      save(); renderGameTickets();
      showToast(`+${entry.pts} PB verified ✓ 🪙 +1 Spin earned! 🎰`);
    } else {
      showToast(`+${entry.pts} PB verified ✓ 🪙`);
    }
    // Tab 1 design pass — faith-style multi-layer celebration. screenFlash
    // first (always — sub-200ms; reduced-motion guarded internally), then
    // the bigger confetti burst on the every-3rd-verify spin-earn moment
    // and a streak banner when the chore streak crosses a 3/7/14/30/50/100
    // day milestone. No logic change — chore points / PB / spin tickets
    // are all awarded by the path above; this is presentation only.
    if(typeof screenFlash === 'function') screenFlash('#22c55e', 220);
    if(totalVerified % 3 === 0 && typeof launchBigConfetti === 'function'){
      launchBigConfetti();
    } else if(typeof launchSideConfetti === 'function'){
      launchSideConfetti();
    }
    if(typeof getChoreStreak === 'function' && typeof streakMilestoneBanner === 'function'){
      const newStreak = getChoreStreak();
      if([3,7,14,30,50,100].indexOf(newStreak) !== -1){
        setTimeout(()=>streakMilestoneBanner(newStreak), 350);
      }
    }
    // Tab 1 Inc 4 — refresh D.choreStreak cache and mirror to
    // public.chore_streaks. profile_id uses _pidOf(activeProfile)
    // (Phase 1 of the PIN -> stable-id decouple, v249) so the new
    // table is keyed by the stable id from day 1.
    if(typeof updateChoreStreak === 'function') updateChoreStreak();
    // Tab 1 Inc 5 Step B — re-check chore badges after every approval.
    // Helper toasts on first-earn and triggers a re-render of the grid.
    if(typeof _checkChoreBadges === 'function') _checkChoreBadges();
  } else {
    entry.status='rejected';
    showToast('Chore rejected');
  }
  save(); renderChores(); updateHeroDashboard(); updateDashCards();
}

function addReward(){
  initChoreData();
  const name = document.getElementById('rewardNewName').value.trim();
  if(!name){ showToast('Enter a reward name'); return; }
  const pts = parseInt(document.getElementById('rewardNewPts').value)||50;
  D.rewards.push({id:Date.now(), name, pts, active:true});
  document.getElementById('rewardNewName').value='';
  document.getElementById('rewardNewPts').value='';
  save(); renderChores();
  showToast('Reward added ✓');
}

function removeReward(id){
  D.rewards = (Array.isArray(D.rewards)?D.rewards:[]).filter(r=>r.id!==id); save(); renderChores();
}

function redeemReward(id){
  initChoreData();
  const reward = (Array.isArray(D.rewards)?D.rewards:[]).find(r=>r.id===id);
  if(!reward) return;
  const avail = D.chorePoints.total - D.chorePoints.spent;
  if(avail < reward.pts){ showToast(`Need ${reward.pts - avail} more points`); return; }
  D.chorePoints.spent += reward.pts;
  D.choreLog.push({
    id:Date.now(), choreId:null, choreName:'🎁 Redeemed: '+reward.name,
    pts:-reward.pts, date:new Date().toISOString().slice(0,10),
    time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'}),
    status:'redeemed', emoji:'🎁'
  });
  save(); renderChores();
  showToast(`Redeemed: ${reward.name} 🎉`);
}

function getChoreStreak(){
  initChoreData();
  const verified = D.choreLog.filter(l=>l.status==='verified');
  if(!verified.length) return 0;
  const dates = [...new Set(verified.map(l=>l.date))].sort().reverse();
  let streak = 0;
  const today = new Date();
  for(let i=0;i<dates.length;i++){
    const expected = new Date(today);
    expected.setDate(expected.getDate()-i);
    const exp = expected.toISOString().slice(0,10);
    if(dates.includes(exp)) streak++;
    else break;
  }
  return streak;
}

function renderChores(){
  initChoreData();
  // Refresh Parent Hub pending list if it's visible
  if(typeof renderPhPendingChores === 'function') renderPhPendingChores();
  // Always sync the home dashboard chore card
  if(typeof updateDashCards === 'function') updateDashCards();
  // Tab 1 Inc 5 Step B — paint the chore-specific badge grid in the
  // #ch-mychores panel. Cheap (10 fixed entries) so re-render on every
  // chores refresh is fine. Skips gracefully if the host element isn't
  // mounted (e.g. partial DOM during boot).
  if(typeof renderChoreBadges === 'function') renderChoreBadges();
  // Tab 1 Inc 5 Step C — paint the AI Coach card. Renders the cached
  // copy only — fetching is driven by cTab('mychores') + the manual
  // refresh button to keep this hot path off the network.
  if(typeof renderChoreCoach === 'function') renderChoreCoach();
  const today = new Date().toISOString().slice(0,10);
  const dayOfWeek = new Date().getDay();
  const avail = D.chorePoints.total - D.chorePoints.spent;
  const streak = getChoreStreak();

  // Update summary cards
  const ae = document.getElementById('chorePointsAvail'); if(ae) ae.textContent = avail;
  const te = document.getElementById('chorePointsTotal'); if(te) te.textContent = D.chorePoints.total;
  const se = document.getElementById('choreStreak'); if(se) se.textContent = streak;
  // Tab 1 Inc 4 removed #choreStreakDetail — the Streaks sub-tab now
  // renders its own current/longest/total hero card via renderChoreStreaks.

  // Level calc
  const lvl = CHORE_LEVELS.find(l=>D.chorePoints.total >= l.min && D.chorePoints.total < l.max) || CHORE_LEVELS[CHORE_LEVELS.length-1];
  const le = document.getElementById('choreLevel'); if(le) le.textContent = lvl.level;
  const ll = document.getElementById('choreLevelLabel'); if(ll) ll.textContent = `Level ${lvl.level} — ${lvl.name}`;
  const lp = document.getElementById('choreLevelPts'); if(lp) lp.textContent = `${D.chorePoints.total} / ${lvl.max} pts`;
  const lb = document.getElementById('choreLevelBar'); if(lb) lb.style.width = Math.min(100, ((D.chorePoints.total-lvl.min)/(lvl.max-lvl.min))*100)+'%';

  // Today's chores — kanban (Tab 1 Increment 2). Three columns:
  // Todo / Pending / Verified, bucketed by today's log status. Rejected
  // chores fall back into Todo so the kid can resubmit. Each card shows
  // difficulty pill + due-date chip + effective points (base × mult).
  // Overdue badge state is computed below for the My Chores tab nav.
  const todayEl = document.getElementById('choreTodayList');
  let hasOverdueToday = false;
  if(todayEl){
    const activeChores = (Array.isArray(D.chores)?D.chores:[]).filter(c=>{
      if(!c.active) return false;
      if(c.freq==='daily') return true;
      if(c.freq==='weekly') return true;
      if(c.freq==='once'){
        const verified = D.choreLog.find(l=>l.choreId===c.id && l.status==='verified');
        return !verified;
      }
      return true;
    });

    const buckets = {todo:[], pending:[], verified:[]};
    activeChores.forEach(c => {
      const log = D.choreLog.find(l=>l.choreId===c.id && l.date===today);
      const st = log ? log.status : 'todo';
      const bucket = st === 'verified' ? 'verified' : st === 'pending' ? 'pending' : 'todo';
      buckets[bucket].push({c, log});
      if(c.dueDate && c.dueDate < today && st !== 'verified') hasOverdueToday = true;
    });

    if(!activeChores.length){
      todayEl.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--tx2);font-size:.8rem;">${D.chores.length?'All caught up for today! 🎉':'No chores set up yet. Ask a parent to add some in Parent Hub.'}</div>`;
    } else {
      const renderCard = ({c, log}) => {
        const mult = _choreMultiplier(c.difficulty);
        const basePts = Number.isFinite(+c.pts) ? +c.pts : 0;
        const effective = Math.round(basePts * mult);
        const diff = c.difficulty || '';
        const diffColor = diff==='hard' ? '#ef4444' : diff==='medium' ? '#fbbf24' : diff==='easy' ? '#22c55e' : 'var(--tx2)';
        const isOverdue = c.dueDate && c.dueDate < today && (!log || log.status !== 'verified');
        const diffPill = diff ? `<span style="font-size:.55rem;background:rgba(255,255,255,.05);color:${diffColor};padding:.1rem .35rem;border-radius:5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">${diff}</span>` : '';
        const dueChip = c.dueDate
          ? `<span style="font-size:.55rem;background:${isOverdue?'rgba(239,68,68,.15)':'rgba(255,255,255,.05)'};color:${isOverdue?'#ef4444':'var(--tx2)'};padding:.1rem .35rem;border-radius:5px;font-weight:600;">${isOverdue?'⚠ ':'📅 '}${c.dueDate.slice(5)}</span>`
          : '';
        const ptsLabel = (mult !== 1.0 && diff)
          ? `<span style="font-size:.58rem;color:var(--tx2);">${basePts}×${mult.toFixed(1)}=<b style="color:var(--c);">${effective}</b>pts</span>`
          : `<span style="font-size:.58rem;color:var(--tx2);">${effective} pts</span>`;
        const st = log ? log.status : 'todo';
        // Tab 1 Inc 3 — the 📸 button opens a hidden file picker
        // scoped to this chore; on selection we route through
        // markChoreDone(id, file) which uploads + attaches photoPath.
        const photoBtn = (st === 'todo' || st === 'rejected')
          ? `<button onclick="chorePhotoPick(${c.id})" title="Submit with photo proof" style="background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.22);color:#a78bfa;font-size:.62rem;padding:.3rem .45rem;border-radius:6px;cursor:pointer;margin-right:.25rem;">📸</button>`
          : '';
        const action = (st === 'todo' || st === 'rejected')
          ? `<button class="btn bp bs" onclick="markChoreDone(${c.id})" style="font-size:.6rem;white-space:nowrap;padding:.3rem .55rem;">${st==='rejected'?'↻ Redo':'✓ Done'}</button>`
          : st === 'pending'
            ? `<span style="font-size:.58rem;color:#fbbf24;font-weight:700;">⏳ Pending${log && log.photoPath ? ' 📸' : ''}</span>`
            : `<span style="font-size:.58rem;color:#22c55e;font-weight:700;">✅ Verified${log && log.photoPath ? ' 📸' : ''}</span>`;
        // Tab 1 Inc 5 Step D — data-chore-id is the key SortableJS uses
        // to compute the new order in _persistChoreOrder. Verified +
        // pending cards keep the attribute but aren't draggable (Sortable
        // is only instantiated on the Todo column).
        return `<div class="ch-card" data-chore-id="${c.id}" style="${st==='verified'?'opacity:.55;':''}">
          <div style="display:flex;align-items:flex-start;gap:.4rem;">
            <span style="font-size:1.05rem;line-height:1.1;">${c.emoji||'📌'}</span>
            <div style="flex:1;min-width:0;">
              <div style="font-size:.72rem;font-weight:600;color:var(--tx);${st==='verified'?'text-decoration:line-through;':''}word-wrap:break-word;line-height:1.25;">${escapeHtml(c.name)}</div>
              <div style="display:flex;gap:.25rem;align-items:center;margin-top:.25rem;flex-wrap:wrap;">${diffPill}${dueChip}${ptsLabel}</div>
            </div>
          </div>
          <div style="margin-top:.4rem;text-align:right;">${photoBtn}${action}</div>
        </div>`;
      };
      const renderCol = (key, label, dotColor, emptyMsg) => `
        <div class="ch-col ch-col-${key}">
          <div class="ch-col-h"><span class="ch-col-dot" style="background:${dotColor};"></span>${label}<span class="ch-col-n">${buckets[key].length}</span></div>
          ${buckets[key].length ? buckets[key].map(renderCard).join('') : `<div class="ch-col-empty">${emptyMsg}</div>`}
        </div>`;
      todayEl.innerHTML = `<div class="ch-kanban">
        ${renderCol('todo',     'Todo',     '#fbbf24', 'Nothing to do')}
        ${renderCol('pending',  'Pending',  '#a78bfa', 'None pending')}
        ${renderCol('verified', 'Verified', '#22c55e', 'None yet')}
      </div>`;
      // Tab 1 Inc 5 Step D — instantiate SortableJS on the Todo column
      // so the kid can reorder their priorities. Guarded on the global
      // so a CDN miss degrades to a static kanban (no error). Only the
      // Todo column is draggable: Pending = parent review queue,
      // Verified = done, neither benefits from manual reordering.
      if(typeof Sortable !== 'undefined'){
        var todoCol = todayEl.querySelector('.ch-col-todo');
        if(todoCol && !todoCol.__choreSortableWired){
          todoCol.__choreSortableWired = true;
          Sortable.create(todoCol, {
            animation:    150,
            draggable:    '.ch-card',
            ghostClass:   'ch-card--ghost',
            chosenClass:  'ch-card--chosen',
            dragClass:    'ch-card--drag',
            // forceFallback uses Sortable's pointer-based fallback
            // engine — required for reliable iOS / Android PWA touch
            // support. Native HTML5 DnD is unreliable on touch.
            forceFallback:    true,
            fallbackTolerance: 5,
            onEnd: function(){ _persistChoreOrder(todoCol); }
          });
        }
      }
    }
    // Overdue badge on the My Chores sub-tab nav
    const odEl = document.getElementById('chOverdueDot');
    if(odEl) odEl.style.display = hasOverdueToday ? 'inline-block' : 'none';
  }

  // Parent mode lists
  if(_parentMode){
    // All chores management
    const allEl = document.getElementById('choreAllList');
    if(allEl){
      allEl.innerHTML = (Array.isArray(D.chores)?D.chores:[]).map(c=>`
        <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;margin-bottom:.25rem;${c.active?'':'opacity:.5;'}">
          <span>${c.emoji}</span>
          <span style="flex:1;font-size:.72rem;font-weight:600;color:var(--tx);">${escapeHtml(c.name)}</span>
          <span style="font-size:.6rem;color:var(--c);">${c.pts}pts</span>
          <span style="font-size:.55rem;color:var(--tx2);">${c.freq}</span>
          <button class="btn bgh bs" onclick="toggleChoreActive(${c.id})" style="font-size:.5rem;">${c.active?'Pause':'Resume'}</button>
          <button class="btn bda bs" onclick="removeChore(${c.id})" style="font-size:.5rem;">✕</button>
        </div>
      `).join('') || '<div style="font-size:.72rem;color:var(--tx2);padding:.5rem;">No chores yet.</div>';
    }

    // Pending verification
    const pendEl = document.getElementById('chorePendingList');
    if(pendEl){
      const pending = D.choreLog.filter(l=>l.status==='pending');
      if(!pending.length){
        pendEl.innerHTML = '<div style="font-size:.72rem;color:var(--tx2);padding:.5rem;">Nothing pending.</div>';
      } else {
        pendEl.innerHTML = pending.map(p=>`
          <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .6rem;background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.12);border-radius:10px;margin-bottom:.3rem;">
            <span style="font-size:1rem;">${p.emoji}</span>
            <div style="flex:1;">
              <div style="font-size:.75rem;font-weight:600;color:var(--tx);">${escapeHtml(p.choreName)}</div>
              <div style="font-size:.58rem;color:var(--tx2);">${p.date} at ${p.time} · ${p.pts} pts</div>
            </div>
            <button class="btn bp bs" onclick="verifyChore(${p.id},true)" style="font-size:.6rem;background:#22c55e;">✓ Verify</button>
            <button class="btn bda bs" onclick="verifyChore(${p.id},false)" style="font-size:.6rem;">✕ Reject</button>
          </div>
        `).join('');
      }
    }

    // Reward management
    const rmEl = document.getElementById('rewardManageList');
    if(rmEl){
      rmEl.innerHTML = (Array.isArray(D.rewards)?D.rewards:[]).map(r=>`
        <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;background:rgba(251,191,36,.04);border:1px solid rgba(251,191,36,.1);border-radius:8px;margin-bottom:.25rem;">
          <span>🎁</span>
          <span style="flex:1;font-size:.72rem;font-weight:600;color:var(--tx);">${escapeHtml(r.name)}</span>
          <span style="font-size:.62rem;color:#fbbf24;font-weight:700;">${r.pts} pts</span>
          <button class="btn bda bs" onclick="removeReward(${r.id})" style="font-size:.5rem;">✕</button>
        </div>
      `).join('') || '<div style="font-size:.72rem;color:var(--tx2);padding:.5rem;">No rewards set up.</div>';
    }

    // Weekly report
    const wrEl = document.getElementById('choreWeeklyReport');
    if(wrEl){
      const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const ws = weekStart.toISOString().slice(0,10);
      const weekLogs = D.choreLog.filter(l=>l.date>=ws);
      const verified = weekLogs.filter(l=>l.status==='verified');
      const pending = weekLogs.filter(l=>l.status==='pending');
      const rejected = weekLogs.filter(l=>l.status==='rejected');
      const ptsThisWeek = verified.reduce((s,l)=>s+l.pts,0);
      wrEl.innerHTML = `
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(34,197,94,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#22c55e;">${verified.length}</div><div style="font-size:.55rem;color:var(--tx2);">Verified</div></div>
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(251,191,36,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#fbbf24;">${pending.length}</div><div style="font-size:.55rem;color:var(--tx2);">Pending</div></div>
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(239,68,68,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#ef4444;">${rejected.length}</div><div style="font-size:.55rem;color:var(--tx2);">Rejected</div></div>
          <div style="flex:1;min-width:80px;padding:.5rem;background:rgba(167,139,250,.08);border-radius:8px;text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#a78bfa;">${ptsThisWeek}</div><div style="font-size:.55rem;color:var(--tx2);">Pts Earned</div></div>
        </div>`;
    }
  }

  // Reward shop (kid view)
  const shopEl = document.getElementById('rewardShopList');
  if(shopEl){
    if(!(Array.isArray(D.rewards)?D.rewards:[]).length){
      shopEl.innerHTML = '<div style="text-align:center;color:var(--tx2);font-size:.75rem;padding:1rem;">No rewards available yet. Ask a parent to set some up!</div>';
    } else {
      shopEl.innerHTML = (Array.isArray(D.rewards)?D.rewards:[]).filter(r=>r.active!==false).map(r=>{
        const canAfford = avail >= r.pts;
        return `<div style="display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;background:${canAfford?'rgba(251,191,36,.06)':'rgba(255,255,255,.02)'};border:1px solid ${canAfford?'rgba(251,191,36,.15)':'rgba(255,255,255,.06)'};border-radius:10px;margin-bottom:.3rem;">
          <span style="font-size:1.1rem;">🎁</span>
          <div style="flex:1;">
            <div style="font-size:.78rem;font-weight:600;color:var(--tx);">${escapeHtml(r.name)}</div>
            <div style="font-size:.6rem;color:#fbbf24;font-weight:700;">${r.pts} points</div>
          </div>
          <button class="btn ${canAfford?'bp':'bgh'} bs" onclick="${canAfford?`redeemReward(${r.id})`:`showToast('Need ${r.pts-avail} more points')`}" style="font-size:.65rem;${canAfford?'':'opacity:.5;'}">${canAfford?'🎉 Redeem':'🔒 '+r.pts+'pts'}</button>
        </div>`;
      }).join('');
    }
  }

  // History
  const histEl = document.getElementById('choreHistory');
  if(histEl){
    const recent = D.choreLog.slice().sort((a,b)=>b.id-a.id).slice(0,20);
    if(!recent.length){
      histEl.innerHTML = '<div style="color:var(--tx2);font-size:.72rem;padding:.5rem;text-align:center;">No activity yet.</div>';
    } else {
      const statusColors = {pending:'#fbbf24',verified:'#22c55e',rejected:'#ef4444',redeemed:'#a78bfa'};
      const statusLabels = {pending:'Pending',verified:'Verified',rejected:'Rejected',redeemed:'Redeemed'};
      histEl.innerHTML = recent.map(l=>`
        <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.04);font-size:.65rem;">
          <span>${l.emoji}</span>
          <span style="flex:1;color:var(--tx);">${escapeHtml(l.choreName)}</span>
          <span style="color:${l.pts>0?'#22c55e':'#a78bfa'};font-weight:700;">${l.pts>0?'+':'-'}${Math.abs(l.pts)}</span>
          <span style="color:${statusColors[l.status]||'var(--tx2)'};font-size:.55rem;">${statusLabels[l.status]||l.status}</span>
          <span style="color:var(--tx2);font-size:.5rem;">${l.date.slice(5)}</span>
        </div>
      `).join('');
    }
  }
  renderHelpfulChores();
}


// ── SCREEN TIME MANAGER ──────────────────────────────────────
const SCREEN_CATS = [
  {key:'games',icon:'🎮',label:'Video Games',color:'#8b5cf6'},
  {key:'tv',icon:'📺',label:'TV / Streaming',color:'#38bdf8'},
  {key:'phone',icon:'📱',label:'Phone / Social',color:'#f472b6'},
  {key:'tablet',icon:'📲',label:'Tablet / iPad',color:'#22c55e'},
];

function initScreenTime(){
  if(!D.screenTime) D.screenTime = {games:{earned:0,used:0},tv:{earned:0,used:0},phone:{earned:0,used:0},tablet:{earned:0,used:0}};
  renderScreenTime();
  renderHeroScreenTime();
}

function renderHeroScreenTime(){
  const el = document.getElementById('heroScreenTime'); if(!el) return;
  if(!D.screenTime) return;
  el.innerHTML = SCREEN_CATS.map(c=>{
    const d = (D.screenTime||{})[c.key]||{earned:0,used:0};
    const avail = Math.max(0, d.earned - d.used);
    return `<div style="text-align:center;padding:.2rem .35rem;background:rgba(255,255,255,.03);border-radius:6px;min-width:50px;">
      <div style="font-size:.75rem;">${c.icon}</div>
      <div style="font-size:.7rem;font-weight:800;color:${avail>0?c.color:'var(--tx3)'};">${avail}m</div>
    </div>`;
  }).join('');
}

function updateDashCards(){
  // Chore points
  const cp = document.getElementById('qsChorePts');
  const pts = (D.chorePoints||{}).total||0;
  if(cp) cp.textContent = pts;
  const cl = document.getElementById('qsChoreLevel');
  if(cl && typeof CHORE_LEVELS !== 'undefined'){
    const lvl = CHORE_LEVELS.find(l=>pts>=l.min && pts<l.max)||{name:'GOAT',level:8};
    cl.textContent = 'Lvl '+lvl.level+' '+lvl.name;
  }
  // Earnings
  const eb = document.getElementById('qsEarnings');
  if(eb) eb.textContent = '$'+((D.earnings||{}).balance||0).toFixed(2);
  const sg = document.getElementById('qsSavingsGoal');
  if(sg){
    const e = D.earnings||{};
    sg.textContent = e.goalName ? '$'+(e.saved||0).toFixed(0)+' / $'+(e.goalAmount||0).toFixed(0) : '';
  }
  // Certs
  const ce = document.getElementById('qsCerts');
  const certCount = Object.values(D.skillCerts||{}).filter(Boolean).length;
  if(ce) ce.textContent = certCount;
  // Mood
  const me = document.getElementById('qsMoodEmoji');
  const ml = document.getElementById('qsMoodLabel');
  const today = new Date().toISOString().slice(0,10);
  const todayMood = (D.moods||[]).find(m=>m.date===today);
  if(me) me.textContent = todayMood ? ['😢','😔','😐','🙂','😄'][todayMood.level-1]||'😊' : '—';
  if(ml) ml.textContent = todayMood ? ['Rough','Low','Okay','Good','Great'][todayMood.level-1]||'' : 'Log today';
  // Books
  const bk = document.getElementById('qsBooks');
  const booksDone = (Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length;
  if(bk) bk.textContent = booksDone;
  // Journal
  const jn = document.getElementById('qsJournal');
  if(jn) jn.textContent = (Array.isArray(D.journal)?D.journal:[]).length;
  // Milestones
  const ms = document.getElementById('qsMilestones');
  if(ms) ms.textContent = (D.milestones||[]).length;

  // ── STATUS COLORS (green=good, red=needs attention, yellow=neutral) ──
  function setStatus(id, color){
    const el = document.getElementById(id);
    if(el){ el.className = 'dcard-status ' + color; }
  }

  // GPA
  const classes = D.classes||[];
  const gradeMap = {'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D+':1.3,'D':1,'D-':0.7,'F':0};
  const grades = classes.filter(c=>c.grade).map(c=>gradeMap[c.grade]||0);
  const gpa = grades.length ? grades.reduce((a,b)=>a+b,0)/grades.length : 0;
  setStatus('dcGpaStatus', !classes.length ? 'green' : gpa>=3.0 ? 'green' : gpa>=2.0 ? 'yellow' : 'red');

  // Streak
  const streak = D.streak||0;
  setStatus('dcStreakStatus', streak>=7 ? 'green' : streak>=1 ? 'green' : 'yellow');

  // Chores
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate()-weekStart.getDay());
  const ws = weekStart.toISOString().slice(0,10);
  const weekChores = (D.choreLog||[]).filter(l=>l.date>=ws && l.status==='verified').length;
  setStatus('dcChoreStatus', weekChores>=5 ? 'green' : weekChores>=1 ? 'green' : (Array.isArray(D.chores)?D.chores:[]).length ? 'yellow' : 'green');

  // Earnings
  const bal = (D.earnings||{}).balance||0;
  setStatus('dcEarnStatus', 'green');

  // Certs
  setStatus('dcCertStatus', certCount>=5 ? 'green' : certCount>=1 ? 'green' : 'yellow');

  // Goals
  const goalsDone = (Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length;
  const goalsTotal = (Array.isArray(D.goals)?D.goals:[]).length;
  setStatus('dcGoalStatus', goalsDone>0 ? 'green' : goalsTotal>0 ? 'green' : 'yellow');

  // Mood
  setStatus('dcMoodStatus', todayMood ? (todayMood.level>=4?'green':todayMood.level>=3?'yellow':'red') : 'green');

  // Books
  setStatus('dcBookStatus', booksDone>=3 ? 'green' : booksDone>=1 ? 'green' : 'yellow');

  // Health
  setStatus('dcHealthStatus', 'green');

  // Screen Time
  setStatus('dcScreenStatus', 'green');

  // Finance
  setStatus('dcFinStatus', 'green');

  // Calendar
  setStatus('dcCalStatus', 'green');

  // Skills
  setStatus('dcSkillStatus', certCount>=10 ? 'green' : certCount>=3 ? 'green' : certCount>=1 ? 'yellow' : 'green');

  // Journal
  setStatus('dcJournalStatus', (Array.isArray(D.journal)?D.journal:[]).length>=10 ? 'green' : (Array.isArray(D.journal)?D.journal:[]).length>=1 ? 'green' : 'yellow');

  // Milestones
  setStatus('dcMileStatus', (D.milestones||[]).length>=5 ? 'green' : (D.milestones||[]).length>=1 ? 'green' : 'yellow');

  // Scripture
  const scrToday = new Date().toISOString().slice(0,10);
  const scrRead = D.scrReadDays && D.scrReadDays[scrToday];
  const scrStrk = document.getElementById('qsScrStreak');
  if(scrStrk) scrStrk.textContent = typeof getScriptureStreak==='function' ? getScriptureStreak() : 0;
  const scrLbl = document.getElementById('qsScrLabel');
  if(scrLbl) scrLbl.textContent = scrRead ? 'Read today ✓' : 'Read today';
  setStatus('dcScrStatus', scrRead ? 'green' : 'yellow');

  // Life Score (same calculation as parent hub)
  const lsGpa = grades.length ? Math.min(100,(gpa/4)*100) : 50;
  const weekStartLS = new Date(); weekStartLS.setDate(weekStartLS.getDate()-weekStartLS.getDay());
  const wsLS = weekStartLS.toISOString().slice(0,10);
  const weekChoresLS = (D.choreLog||[]).filter(l=>l.date>=wsLS && l.status==='verified').length;
  const activeChoresLS = (Array.isArray(D.chores)?D.chores:[]).filter(c=>c.active).length;
  const lsResponsibility = activeChoresLS>0 ? Math.min(100, (weekChoresLS/Math.max(1,activeChoresLS))*100) : 50;
  const lsGrowth = Math.min(100, certCount*6 + booksDone*4 + goalsDone*5);
  const recentMoods = (D.moods||[]).filter(m=>{const diff=(new Date()-new Date(m.date+'T12:00:00'))/(86400000);return diff<=14;});
  const moodAvg = recentMoods.length ? recentMoods.reduce((s,m)=>s+m.level,0)/recentMoods.length : 3;
  const lsWellbeing = Math.min(100, (moodAvg/5)*50 + Math.min(50, streak*3));
  const behLogs = D.behaviorLog||[];
  const posB = behLogs.filter(b=>b.type==='positive').length;
  const negB = behLogs.filter(b=>b.type==='negative').length;
  const lsCharacter = behLogs.length>0 ? Math.min(100,(posB/(posB+negB))*100) : 50;
  const lsEngagement = Math.min(100, (Array.isArray(D.journal)?D.journal:[]).length*3 + (D.milestones||[]).length*5);
  const lsTotal = Math.round((lsGpa*25 + lsResponsibility*20 + lsGrowth*15 + lsWellbeing*15 + lsCharacter*15 + lsEngagement*10)/100);

  // Require 3 full days of app use before issuing any grade
  const firstUseKey = D.firstUseDate;
  const lsToday = new Date().toISOString().slice(0,10);
  if(!D.firstUseDate){ D.firstUseDate = lsToday; save(); }
  const daysSinceFirst = D.firstUseDate ? Math.floor((new Date(lsToday) - new Date(D.firstUseDate)) / 86400000) : 0;
  const hasEnoughData = daysSinceFirst >= 3;

  // Floor score at D+ until there's a full week of data — no rock-bottom grades for beginners
  const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
  const wk = oneWeekAgo.toISOString().slice(0,10);
  const weekActivity = (D.choreLog||[]).filter(l=>l.date>=wk).length +
    (D.moods||[]).filter(m=>m.date>=wk).length +
    (Array.isArray(D.journal)?D.journal:[]).filter(j=>(j.date||'')>=wk).length;
  const hasWeekData = daysSinceFirst >= 7 || weekActivity >= 5;

  // Effective score — floor at 60 if not enough data yet
  const effectiveScore = hasEnoughData && hasWeekData ? lsTotal : Math.max(lsTotal, 60);

  let lsLetter, lsColor, lsSubLabel;
  if(!hasEnoughData){
    lsLetter = '🌱';
    lsColor = '#22c55e';
    lsSubLabel = 'Just getting started!';
  } else {
    lsLetter = effectiveScore>=93?'A+':effectiveScore>=90?'A':effectiveScore>=87?'A-':effectiveScore>=83?'B+':effectiveScore>=80?'B':effectiveScore>=77?'B-':effectiveScore>=73?'C+':effectiveScore>=70?'C':effectiveScore>=67?'C-':effectiveScore>=60?'D+':'D';
    lsColor = effectiveScore>=87?'#22c55e':effectiveScore>=77?'#4ade80':effectiveScore>=70?'#fbbf24':effectiveScore>=60?'#fb923c':'#f87171';
    // Inspiring sub-labels
    const inspireMap = {
      'A+':'🏆 Crushing it!', 'A':'⭐ Excellent!', 'A-':'🔥 Keep going!',
      'B+':'💪 Almost there!', 'B':'👏 Great work!', 'B-':'📈 Rising up!',
      'C+':'🎯 On track!', 'C':'💡 Keep pushing!', 'C-':'🌱 Growing!',
      'D+':'⚡ Keep at it!', 'D':'🚀 You can do this!'
    };
    lsSubLabel = inspireMap[lsLetter] || lsTotal+'/100';
  }

  const lsEl = document.getElementById('qsLifeScore');
  if(lsEl){ lsEl.textContent = lsLetter; lsEl.style.color = lsColor; lsEl.style.fontSize = lsLetter==='🌱'?'2rem':'2rem'; }
  const lsLbl = document.getElementById('qsLifeScoreLabel');
  if(lsLbl) lsLbl.textContent = hasEnoughData ? lsSubLabel : 'Just getting started!';
  setStatus('dcLifeScoreStatus', !hasEnoughData ? 'green' : effectiveScore>=80?'green':effectiveScore>=60?'yellow':'red');

  // Parent Bucks — writes go to card #1 (heroPBBalance/heroPBSub).
  // Card #2 (qsPB/qsPBGames) deleted 2026-05-10 in Phase 2.2 hero compact.
  // Format matches email.js renderParentBucks for consistency.
  const pbBal = (D.pb||{}).balance||0;
  const pbEl = document.getElementById('heroPBBalance');
  if(pbEl) pbEl.textContent = pbBal;
  const pbSub = document.getElementById('heroPBSub');
  if(pbSub){
    const spins = (D.pb||{}).spinTickets||0;
    const scratches = (D.pb||{}).scratchTickets||0;
    pbSub.textContent = (spins+scratches)>0 ? '🎰'+spins+' 🎫'+scratches : 'Tap to spend';
  }
  setStatus('dcPBStatus', pbBal>0?'green':'yellow');
}

// Preset backgrounds
function setPresetBg(gradient){
  const layer = document.getElementById('heroBgLayer');
  const card = document.getElementById('heroCard');
  if(gradient === 'none'){
    if(layer) layer.style.backgroundImage = '';
    if(card) card.classList.add('no-photo');
    D.heroBgPreset = ''; save();
  } else {
    if(layer) layer.style.backgroundImage = gradient;
    if(card) card.classList.remove('no-photo');
    D.heroBgPreset = gradient; save();
  }
}

function setAppBg(gradient){
  if(gradient === 'none'){
    document.body.style.backgroundImage = '';
    D.appBgPreset = ''; save();
  } else {
    document.body.style.backgroundImage = gradient;
    document.body.style.backgroundAttachment = 'fixed';
    D.appBgPreset = gradient; save();
  }
}

function loadPresetBg(){
  if(D.heroBgPreset){
    const layer = document.getElementById('heroBgLayer');
    const card = document.getElementById('heroCard');
    if(layer) layer.style.backgroundImage = D.heroBgPreset;
    if(card) card.classList.remove('no-photo');
  }
}

let _stInterval = null;
let _stKey = null;
let _stSecsLeft = 0;

function renderScreenTime(){
  const el = document.getElementById('screenTimeCards'); if(!el) return;
  if(!D.screenTime) initScreenTime();
  const st = D.screenTime;

  el.innerHTML = SCREEN_CATS.map(cat=>{
    const data = st[cat.key]||{earned:0,used:0};
    const avail = Math.max(0, data.earned - data.used);
    const pct = data.earned>0 ? Math.min(100,(data.used/data.earned)*100) : 0;
    return `<div style="background:rgba(255,255,255,.03);border:1px solid ${cat.color}25;border-radius:10px;padding:.6rem;text-align:center;">
      <div style="font-size:1.2rem;">${cat.icon}</div>
      <div style="font-size:.6rem;font-weight:600;margin:.15rem 0;">${cat.label}</div>
      <div style="font-size:1.1rem;font-weight:900;color:${avail>0?cat.color:'var(--tx3)'};">${avail}m</div>
      <div style="font-size:.45rem;color:var(--tx2);">available</div>
      <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin:.3rem 0;">
        <div style="height:100%;width:${pct}%;background:${cat.color};border-radius:2px;"></div>
      </div>
      <div style="font-size:.42rem;color:var(--tx3);">${data.used}/${data.earned}m used</div>
      ${avail>0?`<button class="btn bp bs" onclick="startScreenTimer('${cat.key}')" style="font-size:.5rem;margin-top:.3rem;padding:.2rem .5rem;">▶ Use</button>`:''}
    </div>`;
  }).join('');
}

function startScreenTimer(key){
  if(_stInterval) return;
  const data = (D.screenTime||{})[key]||{earned:0,used:0};
  const avail = Math.max(0, data.earned - data.used);
  if(avail <= 0){ showToast('No time available'); return; }
  _stKey = key;
  _stSecsLeft = avail * 60;
  const cat = SCREEN_CATS.find(c=>c.key===key);
  document.getElementById('stTimerLabel').textContent = cat?cat.icon+' '+cat.label:key;
  document.getElementById('screenTimeTimer').style.display = 'block';
  _stInterval = setInterval(()=>{
    _stSecsLeft--;
    if(_stSecsLeft<=0){ stopScreenTimer(); showToast('Screen time is up!'); return; }
    const m=Math.floor(_stSecsLeft/60), s=_stSecsLeft%60;
    document.getElementById('stTimerDisp').textContent = m+':'+(s<10?'0':'')+s;
  },1000);
}

function stopScreenTimer(){
  if(!_stInterval) return;
  clearInterval(_stInterval); _stInterval=null;
  const cat = (D.screenTime||{})[_stKey];
  if(cat){
    const avail = Math.max(0, cat.earned - cat.used);
    const usedNow = avail - Math.ceil(_stSecsLeft/60);
    cat.used += Math.max(1, usedNow);
    save();
  }
  document.getElementById('screenTimeTimer').style.display = 'none';
  _stKey = null;
  renderScreenTime();
}

// Parent adds screen time (called from parent mode)
function addScreenTimeReward(key, mins){
  if(!D.screenTime) D.screenTime = {};
  if(!D.screenTime[key]) D.screenTime[key] = {earned:0,used:0};
  D.screenTime[key].earned += mins;
  save(); renderScreenTime();
  showToast('+'+mins+' min added ✓');
}

// ── EARNINGS & SAVINGS JAR ───────────────────────────────────
function initEarnings(){
  if(!D.earnings) D.earnings = {balance:0,totalEarned:0,goalName:'',goalAmount:0,saved:0,log:[]};
}

function addEarning(amount, reason){
  initEarnings();
  D.earnings.balance += amount;
  D.earnings.totalEarned += amount;
  D.earnings.log.push({id:Date.now(),amount,reason,date:new Date().toISOString().slice(0,10),type:'earn'});
  save(); renderEarnings();
}

function addToSavings(amount){
  initEarnings();
  if(amount > D.earnings.balance){ showToast('Not enough balance'); return; }
  D.earnings.balance -= amount;
  D.earnings.saved += amount;
  D.earnings.log.push({id:Date.now(),amount,reason:'Saved toward goal',date:new Date().toISOString().slice(0,10),type:'save'});
  save(); renderEarnings();
  showToast('$'+amount.toFixed(2)+' saved! 🎯');
}

function renderEarnings(){
  initEarnings();
  const e = D.earnings;

  // Balance
  const bal = document.getElementById('earningsBalance');
  if(bal) bal.textContent = '$'+e.balance.toFixed(2);
  const tot = document.getElementById('earningsTotal');
  if(tot) tot.textContent = 'Total earned: $'+e.totalEarned.toFixed(2);

  // Savings goal
  const gn = document.getElementById('savingsGoalName');
  if(gn) gn.textContent = e.goalName || 'Set a goal in Parent Hub';
  const fill = document.getElementById('savingsJarFill');
  const pctEl = document.getElementById('savingsJarPct');
  const amts = document.getElementById('savingsJarAmounts');
  if(e.goalAmount > 0){
    const pct = Math.min(100,(e.saved/e.goalAmount)*100);
    if(fill) fill.style.height = pct+'%';
    if(pctEl) pctEl.textContent = Math.round(pct)+'%';
    if(amts) amts.textContent = '$'+e.saved.toFixed(2)+' / $'+e.goalAmount.toFixed(2);
  } else {
    if(fill) fill.style.height = '0%';
    if(pctEl) pctEl.textContent = '—';
    if(amts) amts.textContent = '';
  }

  // History
  const hist = document.getElementById('earningsHistory'); if(!hist) return;
  const log = (e.log||[]).slice().sort((a,b)=>b.id-a.id).slice(0,15);
  if(!log.length){ hist.innerHTML='<div style="font-size:.65rem;color:var(--tx2);padding:.3rem;">No earnings yet. Complete chores and earn rewards!</div>'; return; }
  hist.innerHTML = log.map(l=>`
    <div style="display:flex;align-items:center;gap:.35rem;padding:.25rem .3rem;border-bottom:1px solid rgba(255,255,255,.03);font-size:.63rem;">
      <span>${l.type==='earn'?'💰':'🎯'}</span>
      <span style="flex:1;color:var(--tx2);">${escapeHtml(l.reason)}</span>
      <span style="font-weight:700;color:${l.type==='earn'?'#22c55e':'#60a5fa'};">${l.type==='earn'?'+':'-'}$${l.amount.toFixed(2)}</span>
      <span style="font-size:.48rem;color:var(--tx3);">${l.date.slice(5)}</span>
    </div>
  `).join('');
}

// ── PARENT SCREEN TIME & EARNINGS CONTROLS ───────────────────
function renderParentScreenControls(){
  const el = document.getElementById('parentScreenTimeControls'); if(!el) return;
  el.innerHTML = `
    <div style="font-family:var(--fh);font-size:.7rem;letter-spacing:1.5px;color:#38bdf8;margin-bottom:.5rem;">📱 SCREEN TIME CONTROLS</div>
    <div style="font-size:.72rem;color:var(--tx2);margin-bottom:.6rem;">Add earned minutes for good behavior, grades, or chores.</div>
    <div style="display:grid;grid-template-columns:1fr 80px;gap:.4rem;margin-bottom:.5rem;">
      <select id="pstCat" style="width:100%;">${SCREEN_CATS.map(c=>`<option value="${c.key}">${c.icon} ${c.label}</option>`).join('')}</select>
      <input type="number" id="pstMins" placeholder="Min" min="5" step="5" value="30">
    </div>
    <div style="display:flex;gap:.35rem;margin-bottom:.6rem;flex-wrap:wrap;">
      <button class="btn bp bs" onclick="addScreenTimeReward(document.getElementById('pstCat').value, parseInt(document.getElementById('pstMins').value)||30)" style="flex:1;">+ Add Time</button>
      <button class="btn bs" onclick="deductScreenTime()" style="flex:1;font-size:.65rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2);">− Deduct Time</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.35rem;margin-bottom:.5rem;">
      ${SCREEN_CATS.map(c=>{
        const data = (D.screenTime||{})[c.key]||{earned:0,used:0};
        return `<div style="background:rgba(255,255,255,.03);border-radius:6px;padding:.35rem .5rem;font-size:.65rem;">${c.icon} <b>${data.earned-data.used}m</b> avail / ${data.earned}m total</div>`;
      }).join('')}
    </div>
    <button class="btn bgh bs" onclick="resetScreenTime()" style="font-size:.6rem;width:100%;">Reset All Screen Time</button>
  `;
}

function resetScreenTime(){
  if(!confirm('Reset all screen time to zero?')) return;
  D.screenTime = {games:{earned:0,used:0},tv:{earned:0,used:0},phone:{earned:0,used:0},tablet:{earned:0,used:0}};
  save(); renderScreenTime(); renderParentScreenControls();
  showToast('Screen time reset');
}

function renderParentEarningsControls(){
  const el = document.getElementById('parentEarningsControls'); if(!el) return;
  initEarnings();
  el.innerHTML = `
    <div style="font-family:var(--fh);font-size:.7rem;letter-spacing:1.5px;color:#22c55e;margin-bottom:.5rem;">💰 EARNINGS & ALLOWANCE</div>
    <div style="display:grid;grid-template-columns:70px 1fr;gap:.4rem;margin-bottom:.4rem;">
      <input type="number" id="peAmt" placeholder="$" min="0.25" step="0.25" value="5">
      <input type="text" id="peReason" placeholder="Reason (chores, grades, bonus)">
    </div>
    <div style="display:flex;gap:.35rem;margin-bottom:.5rem;">
      <button class="btn bp bs" onclick="parentAddEarning()" style="flex:1;">+ Add $</button>
      <button class="btn bs" onclick="parentDeductEarning()" style="flex:1;font-size:.65rem;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2);">− Deduct $</button>
    </div>
    <div style="display:flex;gap:1rem;margin-bottom:.5rem;font-size:.72rem;color:var(--tx2);">
      <div>Balance: <b style="color:#22c55e;">$${(D.earnings||{}).balance?.toFixed(2)||'0.00'}</b></div>
      <div>Saved: <b style="color:#60a5fa;">$${(D.earnings||{}).saved?.toFixed(2)||'0.00'}</b></div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.05);padding-top:.5rem;margin-top:.3rem;">
      <div style="font-size:.6rem;font-weight:700;color:var(--tx2);margin-bottom:.3rem;">Savings Goal Setup:</div>
      <div style="display:grid;grid-template-columns:1fr 70px;gap:.35rem;margin-bottom:.4rem;">
        <input type="text" id="peGoalName" placeholder="Goal name (e.g. New shoes)" value="${(D.earnings||{}).goalName||''}">
        <input type="number" id="peGoalAmt" placeholder="$" min="1" value="${(D.earnings||{}).goalAmount||''}">
      </div>
      <button class="btn bgh bs" onclick="setSavingsGoal()" style="font-size:.65rem;width:100%;">Set Savings Goal</button>
    </div>
  `;
}

function parentAddEarning(){
  const amt = parseFloat((document.getElementById('peAmt')||{}).value)||0;
  const reason = (document.getElementById('peReason')||{}).value.trim()||'Bonus';
  if(amt<=0){ showToast('Enter an amount'); return; }
  addEarning(amt, reason);
  document.getElementById('peReason').value='';
  renderParentEarningsControls();
  showToast('+$'+amt.toFixed(2)+' added ✓');
}

function setSavingsGoal(){
  initEarnings();
  D.earnings.goalName = (document.getElementById('peGoalName')||{}).value.trim();
  D.earnings.goalAmount = parseFloat((document.getElementById('peGoalAmt')||{}).value)||0;
  save(); renderEarnings(); renderParentEarningsControls();
  showToast('Savings goal set ✓');
}

// ════════════════════════════════════════════════════════════════
// Tab 1 Increment 4 — Streaks / Leaderboard / History sub-tabs
// ════════════════════════════════════════════════════════════════
//
// Three read-only sub-tabs surfacing existing data:
//   • Streaks      — current/longest streak hero + 12-week heatmap
//                    + milestone badges (3/7/14/30/50/100 days)
//   • Leaderboard  — family points ranking across _profiles (multi-kid).
//                    Per the locked plan: ranked by total chore points,
//                    streak + verified count shown as chips.
//   • History      — full D.choreLog, filterable by status, searchable
//                    by chore name, grouped by month (newest first).
//
// Dual-write target: public.chore_streaks (see
// docs/migrations/chore-streaks-schema.sql). updateChoreStreak() fires
// from verifyChore on every approval. profile_id is _pidOf(activeProfile)
// — Phase 1 of the PIN -> stable-id decouple (v249) backfilled
// stableId for every profile, so the new table has no PIN debt.

// ── Date helpers (LOCAL time, not UTC) ─────────────────────────
// Heatmap cells must align with the kid's calendar day, which is local
// time. toISOString().slice(0,10) silently shifts to UTC and can drop
// or duplicate days across timezones — never use it for streak math.
function _chDateStr(d){
  const y  = d.getFullYear();
  const m  = String(d.getMonth()+1).padStart(2,'0');
  const da = String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+da;
}
function _chToday(){ return _chDateStr(new Date()); }

// Resolve the active profile's DATA key. Uses Phase 1's _pidOf() so
// new chore_streaks rows are written under the stable id, not the
// PIN. Solo accounts (no _profiles or no active) fall through to the
// '_solo' sentinel matching the chores / chore_completions mirrors.
function _chProfileKey(){
  if(typeof _profiles !== 'undefined' && _profiles
     && typeof _activeProfileId !== 'undefined' && _activeProfileId){
    const active = _profiles.find(p => p && p.id === _activeProfileId);
    if(active){
      const k = (typeof _pidOf === 'function') ? _pidOf(active) : (active.stableId || active.id);
      if(k) return String(k);
    }
  }
  return '_solo';
}

// Defensive sibling-data hydration for the leaderboard.
// _profiles[i].data is only guaranteed loaded for the active profile;
// inactive siblings' data lives in their per-profile LS key
// (lifeos_profile_<id>) and may not be in memory. Without hydrating,
// inactive siblings render as zero across all metrics — making the
// ranking misleading. Mirrors the existing initProfiles pattern at
// parent.js:1442.
function _chHydrateAllProfiles(){
  if(typeof _profiles === 'undefined' || !Array.isArray(_profiles)) return;
  if(typeof _ylccProfileDataKey !== 'function') return;
  _profiles.forEach(function(p){
    if(p && p.id && (!p.data || (typeof p.data === 'object' && Object.keys(p.data).length === 0))){
      try {
        const raw = localStorage.getItem(_ylccProfileDataKey(p.id));
        if(raw) p.data = JSON.parse(raw);
      } catch(e){ /* per-profile failure is non-fatal; row just shows zero */ }
    }
  });
}

// Computes { current, longest, total, last } from D.choreLog. Reused
// by the Streaks renderer and updateChoreStreak's cloud-mirror so a
// single source of truth defines streak semantics.
//   current — consecutive days up to today w/ >= 1 verified chore
//   longest — longest run anywhere in history
//   last    — most recent date with >= 1 verified chore (YYYY-MM-DD)
//   total   — distinct days lifetime with >= 1 verified chore
function _choreStreakStats(){
  initChoreData();
  const verified = (D.choreLog||[]).filter(l => l && l.status === 'verified' && l.date);
  if(!verified.length) return { current:0, longest:0, total:0, last:null };
  const dates = [...new Set(verified.map(l => l.date))].sort();
  const last  = dates[dates.length-1];

  // Longest: walk sorted dates, count consecutive runs.
  let longest = 0, run = 0, prev = null;
  dates.forEach(d => {
    if(!prev){ run = 1; }
    else {
      const pd = new Date(prev); pd.setDate(pd.getDate()+1);
      const exp = _chDateStr(pd);
      run = (exp === d) ? run+1 : 1;
    }
    if(run > longest) longest = run;
    prev = d;
  });

  // Current: walk backwards from today. A gap immediately breaks.
  const dateSet = new Set(dates);
  let current = 0;
  const cursor = new Date();
  while(dateSet.has(_chDateStr(cursor))){
    current++;
    cursor.setDate(cursor.getDate()-1);
  }
  return { current, longest, total: dates.length, last };
}

// Heatmap intensity buckets (per the locked plan decision):
//   0 -> faint  /  1 -> light  /  2 -> medium  /  3-4 -> strong  /  5+ -> peak
function _chHeatmapColor(count){
  if(count <= 0)  return 'rgba(255,255,255,.04)';
  if(count === 1) return 'rgba(34,197,94,.22)';
  if(count === 2) return 'rgba(34,197,94,.45)';
  if(count <= 4)  return 'rgba(34,197,94,.7)';
  return '#22c55e';
}

// 12-week SVG heatmap — pattern adapted from habits.js:buildHabitsHeatmap.
// One cell per day, columns = weeks (oldest left), rows = day-of-week.
function _chBuildHeatmap(weeks){
  initChoreData();
  const totalDays = weeks * 7;
  const today = new Date();

  // Bucket verified chores by date.
  const dayCount = {};
  (D.choreLog||[]).forEach(l => {
    if(l && l.status === 'verified' && l.date){
      dayCount[l.date] = (dayCount[l.date]||0) + 1;
    }
  });

  const cell = 14, gap = 3, padX = 8, padY = 22;
  const cols = weeks, rows = 7;
  const W = padX*2 + cols*(cell+gap) - gap;
  const H = padY + padX + rows*(cell+gap) - gap;

  const cells = [];
  for(let i = totalDays - 1; i >= 0; i--){
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = _chDateStr(d);
    cells.push({ date:key, count: dayCount[key] || 0 });
  }

  const svg = [
    `<svg width="100%" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="max-width:520px;">`,
    `<text x="${padX}" y="14" fill="var(--tx2)" font-size="9" font-weight="700" font-family="var(--fn)" letter-spacing="1.2">${weeks}-WEEK CHORE HEATMAP</text>`
  ];
  cells.forEach((c, idx) => {
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const x = padX + col * (cell + gap);
    const y = padY + row * (cell + gap);
    svg.push(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="${_chHeatmapColor(c.count)}"><title>${c.date}: ${c.count} verified</title></rect>`);
  });
  // Legend
  const legendY = H - 4;
  svg.push(`<text x="${padX}" y="${legendY}" fill="var(--tx3)" font-size="7.5" font-family="var(--fn)">less</text>`);
  ['rgba(255,255,255,.04)','rgba(34,197,94,.22)','rgba(34,197,94,.45)','rgba(34,197,94,.7)','#22c55e'].forEach((c,i)=>{
    svg.push(`<rect x="${padX + 22 + i*9}" y="${legendY-7}" width="7" height="7" rx="1.5" fill="${c}"/>`);
  });
  svg.push(`<text x="${padX + 22 + 5*9 + 3}" y="${legendY}" fill="var(--tx3)" font-size="7.5" font-family="var(--fn)">more</text>`);
  svg.push('</svg>');
  return svg.join('');
}

const CHORE_MILESTONES = [
  { days: 3,   tier:'green',  icon:'🌱', label:'3 days' },
  { days: 7,   tier:'green',  icon:'🔥', label:'7 days' },
  { days: 14,  tier:'gold',   icon:'⚡', label:'14 days' },
  { days: 30,  tier:'gold',   icon:'🏆', label:'30 days' },
  { days: 50,  tier:'purple', icon:'💎', label:'50 days' },
  { days: 100, tier:'purple', icon:'👑', label:'100 days' }
];

function renderChoreStreaks(){
  const root = document.getElementById('ch-streaks'); if(!root) return;
  const s = _choreStreakStats();
  const heatmap = _chBuildHeatmap(12);

  const milestones = CHORE_MILESTONES.map(m => {
    const lit = s.longest >= m.days;
    // Map the tier name to the matching --cz-* token pair so the badge
    // borrows the chores design system's color story instead of hardcoding.
    const tierColor = m.tier === 'gold'   ? 'var(--cz-gold)'
                    : m.tier === 'purple' ? 'var(--cz-purple)'
                    : 'var(--cz-accent)';
    const tierBd    = m.tier === 'gold'   ? 'var(--cz-gold-bd)'
                    : m.tier === 'purple' ? 'var(--cz-purple-bd)'
                    : 'var(--cz-accent-bd)';
    return `
      <div class="cz-milestone${lit?' lit':''}" style="--mc:${tierColor};--mb:${tierBd};">
        <div class="cz-milestone__icon">${m.icon}</div>
        <div class="cz-milestone__label">${m.label}</div>
        ${lit?'<div class="cz-milestone__check">✓</div>':''}
      </div>`;
  }).join('');

  root.innerHTML = `
    <div class="cz-streak-hero">
      <div class="cz-streak-stat cz-streak-stat--main">
        <div class="cz-streak-num">${s.current}</div>
        <div class="cz-streak-label">CURRENT</div>
      </div>
      <div class="cz-streak-stat">
        <div class="cz-streak-num cz-streak-num--alt">${s.longest}</div>
        <div class="cz-streak-label">LONGEST</div>
      </div>
      <div class="cz-streak-stat">
        <div class="cz-streak-num cz-streak-num--alt">${s.total}</div>
        <div class="cz-streak-label">TOTAL DAYS</div>
      </div>
    </div>

    <div class="cz-heatmap-card">
      ${heatmap}
      <div class="cz-heatmap-caption">Each cell is one day across the last 12 weeks. Greener = more verified chores that day.</div>
    </div>

    <div class="cz-section-title">🏅 MILESTONES</div>
    <div class="cz-milestones">${milestones}</div>
  `;
}

function renderChoreLeaderboard(){
  const root = document.getElementById('ch-leaderboard'); if(!root) return;

  // Sibling-data hydration first — inactive profiles' .data may live
  // only in their per-profile LS key. Without this they render as 0
  // across every metric, making the ranking misleading.
  _chHydrateAllProfiles();

  const profs = (typeof _profiles !== 'undefined' && Array.isArray(_profiles))
    ? _profiles.filter(p => p && p.isParent !== true)
    : [];

  if(profs.length < 2){
    root.innerHTML = `
      <div class="cz-empty">
        <div class="cz-empty__icon">🏅</div>
        <div class="cz-empty__title">FAMILY LEADERBOARD</div>
        <div class="cz-empty__body">Add a sibling profile to start the family ranking. Each kid's points, streak, and verified chores will be compared here.</div>
        <button class="btn bp bs" onclick="showSection('s-parent')" style="font-size:.72rem;margin-top:.85rem;">Open Parent Hub →</button>
      </div>`;
    return;
  }

  // Per the locked plan: rank by total chore points; streak + verified
  // count are informational chips. Solo profiles without a chorePoints
  // field render as 0 — accurate "no data" rather than a crash.
  const entries = profs.map(p => {
    const pd = (p.data && typeof p.data === 'object') ? p.data : {};
    const cp = (pd.chorePoints && typeof pd.chorePoints === 'object') ? pd.chorePoints : { total:0 };
    const log = Array.isArray(pd.choreLog) ? pd.choreLog : [];
    const verified = log.filter(l => l && l.status === 'verified').length;
    const st  = pd.choreStreak;
    const cur = (st && typeof st === 'object') ? (+st.current || 0)
              : (Number.isFinite(+st) ? +st : 0);
    return {
      id: p.id,
      name: p.name || 'Profile',
      pts: +cp.total || 0,
      verified: verified,
      streak: cur
    };
  }).sort((a,b) => b.pts - a.pts);

  const medals = ['🥇','🥈','🥉'];
  const rows = entries.map((e,i) => `
    <div class="cz-rank-row${i===0?' cz-rank-row--top':''}">
      <div class="cz-rank-medal">${medals[i] || '#'+(i+1)}</div>
      <div class="cz-rank-name">${escapeHtml(e.name)}</div>
      <div class="cz-rank-chips">
        <span class="cz-rank-chip">🔥 ${e.streak}d</span>
        <span class="cz-rank-chip">✅ ${e.verified}</span>
      </div>
      <div class="cz-rank-pts">${e.pts}<span>pts</span></div>
    </div>
  `).join('');

  root.innerHTML = `
    <div class="cz-section-title">🏅 FAMILY LEADERBOARD</div>
    <div class="cz-rank-list">${rows}</div>
    <div class="cz-rank-caption">Ranked by total chore points. Streak + verified count shown for context.</div>
  `;
}

// History sub-tab — filter chips + search input + month-grouped list.
// Module-scoped UI state (not D.* — these don't need cloud sync).
let _choreHistFilter = 'all';
let _choreHistSearch = '';

function _choreHistorySetFilter(f){ _choreHistFilter = f; renderChoreHistory(); }
function _choreHistorySetSearch(input){
  _choreHistSearch = String((input && input.value) || '').trim().toLowerCase();
  renderChoreHistory();
}

const _CHORE_HIST_FILTERS = [
  { id:'all',      label:'All',      match: l => true },
  { id:'verified', label:'Verified', match: l => l.status === 'verified' },
  { id:'pending',  label:'Pending',  match: l => l.status === 'pending' },
  { id:'rejected', label:'Rejected', match: l => l.status === 'rejected' },
  { id:'redeemed', label:'Redeemed', match: l => l.status === 'redeemed' }
];

function renderChoreHistory(){
  const root = document.getElementById('ch-history'); if(!root) return;
  initChoreData();
  const log = Array.isArray(D.choreLog) ? D.choreLog.slice() : [];
  // Newest first, ties broken by id (Date.now() at submit-time).
  log.sort((a,b) => (b.date||'').localeCompare(a.date||'') || (b.id||0) - (a.id||0));

  const counts = {};
  _CHORE_HIST_FILTERS.forEach(f => {
    counts[f.id] = log.filter(l => l && f.match(l)).length;
  });

  const filterChips = _CHORE_HIST_FILTERS.map(f => `
    <button class="cz-hist-chip${_choreHistFilter===f.id?' cz-hist-chip--on':''}"
            onclick="_choreHistorySetFilter('${f.id}')">
      ${f.label} <span class="cz-hist-chip__n">${counts[f.id]||0}</span>
    </button>`).join('');

  const activeFilter = _CHORE_HIST_FILTERS.find(f => f.id === _choreHistFilter) || _CHORE_HIST_FILTERS[0];
  let rows = log.filter(l => l && activeFilter.match(l));
  if(_choreHistSearch){
    rows = rows.filter(l => (l.choreName||'').toLowerCase().includes(_choreHistSearch));
  }

  let listHtml = '';
  if(!rows.length){
    listHtml = `<div class="cz-empty cz-empty--inline">No entries match. Verified chores will appear here as you finish them.</div>`;
  } else {
    // Month groups, newest first. Empty/unknown dates bucket as 0000-00.
    const groups = {};
    rows.forEach(l => {
      const ym = (l.date || '0000-00').slice(0,7);
      if(!groups[ym]) groups[ym] = [];
      groups[ym].push(l);
    });
    const ymKeys = Object.keys(groups).sort().reverse();
    const monthLabel = ym => {
      if(ym === '0000-00') return 'Unknown date';
      const [y,m] = ym.split('-');
      const dt = new Date(+y, +m - 1, 1);
      return dt.toLocaleDateString('en', { month:'long', year:'numeric' });
    };

    listHtml = ymKeys.map(ym => {
      const items = groups[ym].map(l => {
        // Difficulty comes from the log entry if snapshotted at submit,
        // else falls back to the parent chore (may have changed since).
        const choreObj = (D.chores||[]).find(c => c && c.id === l.choreId);
        const diff = String(l.difficulty || (choreObj && choreObj.difficulty) || '');
        const diffPill = diff
          ? `<span class="cz-diff-pill cz-diff-pill--${diff}">${diff}</span>`
          : '';
        const statusPill = `<span class="cz-status-pill cz-status-pill--${l.status||'pending'}">${escapeHtml(l.status||'—')}</span>`;
        // Redemptions carry negative pts (- spent on a reward). Show
        // them in the purple --cz-purple to distinguish from earnings.
        const ptsRaw = (l.pts == null) ? null : (+l.pts || 0);
        const ptsText = (ptsRaw == null) ? '' : (ptsRaw > 0 ? '+'+ptsRaw : String(ptsRaw));
        const ptsClass = (ptsRaw != null && ptsRaw < 0) ? 'cz-hist-pts cz-hist-pts--neg' : 'cz-hist-pts';
        return `
          <div class="cz-hist-row">
            <div class="cz-hist-emoji">${escapeHtml(l.emoji || '📌')}</div>
            <div class="cz-hist-main">
              <div class="cz-hist-name">${escapeHtml(l.choreName || 'Chore')}</div>
              <div class="cz-hist-meta">
                <span class="cz-hist-date">${escapeHtml(l.date || '')}</span>
                ${diffPill}
                ${statusPill}
              </div>
            </div>
            <div class="${ptsClass}">${ptsText}</div>
          </div>`;
      }).join('');
      return `
        <div class="cz-hist-month">
          <div class="cz-hist-month__title">${monthLabel(ym)} <span class="cz-hist-month__n">${groups[ym].length}</span></div>
          ${items}
        </div>`;
    }).join('');
  }

  root.innerHTML = `
    <div class="cz-section-title">📜 ACTIVITY HISTORY</div>
    <div class="cz-hist-chipbar">${filterChips}</div>
    <div class="cz-hist-search">
      <input type="text" placeholder="Search chore name…"
             value="${escapeHtml(_choreHistSearch)}"
             oninput="_choreHistorySetSearch(this)">
    </div>
    <div class="cz-hist-list">${listHtml}</div>
  `;
}

// Dual-write: refresh D.choreStreak cache AND mirror to
// public.chore_streaks. Fired from verifyChore on every approval.
// Silent bail on 42P01 (table not applied yet) — matches the existing
// _mirrorChoresToCloud discipline. Never throws.
async function updateChoreStreak(){
  initChoreData();
  const s = _choreStreakStats();
  D.choreStreak = { current:s.current, longest:s.longest, total:s.total, last:s.last };

  const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  const uid  = (typeof _supaUser  !== 'undefined' && _supaUser) ? _supaUser.id : null;
  if(!supa || !uid) return;

  try {
    const { error } = await supa.from('chore_streaks').upsert({
      user_id:        uid,
      profile_id:     _chProfileKey(),  // _pidOf(activeProfile) — Phase 1 stable id
      current_streak: s.current,
      longest_streak: s.longest,
      last_completed: s.last,
      total_verified: s.total,
      updated_at:     new Date().toISOString()
    }, { onConflict: 'user_id,profile_id' });
    if(error && error.code !== '42P01'){
      console.debug('[chore_streaks mirror] upsert skipped:', error.message);
    }
  } catch(e){
    console.debug('[chore_streaks mirror] exception:', e && e.message);
  }
}

// ════════════════════════════════════════════════════════════
// Tab 1 Increment 5 Step B — Chore badges (parallel surface,
// separate from traits.js Steward XP).
//
// Ten kid-facing achievements scoped to the chore loop. Storage
// in D.choreBadges keyed by badge id → ISO award date. Test
// functions read live D shape; defensive ?? falls so a legacy
// blob without the supporting array can't throw. Award path
// runs from verifyChore (parent approval) and approveSelfChore
// (helpful-deed approval); render path runs from renderChores
// + cTab('mychores') for the initial paint.
// ════════════════════════════════════════════════════════════
const CHORE_BADGES = [
  { id:'first_step',     label:'First Step',      sub:'Verified your first chore',
    icon:'🌱', accent:'#22c55e',
    test:function(D){
      return (Array.isArray(D.choreLog)?D.choreLog:[])
        .some(l => l && l.status === 'verified');
    }
  },
  { id:'three_in_a_row', label:'On a Roll',       sub:'3-day chore streak',
    icon:'⚡', accent:'#f59e0b',
    test:function(D){
      var s = (typeof getChoreStreak === 'function') ? getChoreStreak() :
              (D.choreStreak && D.choreStreak.current) || 0;
      return s >= 3;
    }
  },
  { id:'week_strong',    label:'Week Strong',     sub:'7-day chore streak',
    icon:'🔥', accent:'#ef4444',
    test:function(D){
      var s = (typeof getChoreStreak === 'function') ? getChoreStreak() :
              (D.choreStreak && D.choreStreak.current) || 0;
      return s >= 7;
    }
  },
  { id:'month_master',   label:'Month Master',    sub:'30-day chore streak',
    icon:'👑', accent:'#fbbf24',
    test:function(D){
      var s = (typeof getChoreStreak === 'function') ? getChoreStreak() :
              (D.choreStreak && D.choreStreak.current) || 0;
      return s >= 30;
    }
  },
  { id:'century_club',   label:'Century Club',    sub:'100 points earned',
    icon:'💯', accent:'#06b6d4',
    test:function(D){ return D.chorePoints && D.chorePoints.total >= 100; }
  },
  { id:'high_roller',    label:'High Roller',     sub:'500 points earned',
    icon:'🚀', accent:'#a78bfa',
    test:function(D){ return D.chorePoints && D.chorePoints.total >= 500; }
  },
  { id:'big_spender',    label:'Big Spender',     sub:'1000 points earned',
    icon:'💎', accent:'#38bdf8',
    test:function(D){ return D.chorePoints && D.chorePoints.total >= 1000; }
  },
  { id:'proof_it',       label:'Proof It',        sub:'5 chores verified with a photo',
    icon:'📸', accent:'#ec4899',
    test:function(D){
      return (Array.isArray(D.choreLog)?D.choreLog:[])
        .filter(l => l && l.status === 'verified' && l.photoPath).length >= 5;
    }
  },
  { id:'helper_heart',   label:'Helper Heart',    sub:'3 helpful deeds approved',
    icon:'💛', accent:'#fcd34d',
    test:function(D){
      return (Array.isArray(D.selfChores)?D.selfChores:[])
        .filter(c => c && (c.status === 'approved' || c.status === 'verified')).length >= 3;
    }
  },
  { id:'all_categories', label:'Renaissance Kid', sub:'Verified chores in 5+ categories',
    icon:'🌈', accent:'#34d399',
    test:function(D){
      var cats = {};
      var log = Array.isArray(D.choreLog) ? D.choreLog : [];
      var chores = Array.isArray(D.chores) ? D.chores : [];
      log.forEach(function(l){
        if(!l || l.status !== 'verified') return;
        var c = chores.find(function(x){ return x.id === l.choreId; });
        var cat = (c && c.cat) || l.cat;
        if(cat) cats[cat] = true;
      });
      return Object.keys(cats).length >= 5;
    }
  }
];

function _checkChoreBadges(){
  if(!D.choreBadges || typeof D.choreBadges !== 'object') D.choreBadges = {};
  var today = new Date().toISOString().slice(0,10);
  var newCount = 0;
  var firstNew = null;
  CHORE_BADGES.forEach(function(b){
    if(D.choreBadges[b.id]) return;
    try {
      if(b.test(D)){
        D.choreBadges[b.id] = today;
        newCount++;
        if(!firstNew) firstNew = b;
      }
    } catch(e){}
  });
  if(newCount > 0){
    save();
    if(typeof renderChoreBadges === 'function') renderChoreBadges();
    if(typeof showToast === 'function' && firstNew){
      var more = newCount > 1 ? ' (+' + (newCount - 1) + ' more)' : '';
      showToast('🏆 Badge earned: ' + firstNew.label + more);
    }
  }
}

// ════════════════════════════════════════════════════════════
// Tab 1 Increment 5 Step D — Kanban drag-drop persistence.
//
// SortableJS instantiated in renderChores fires onEnd → this
// helper. Reads the new DOM order of .ch-card[data-chore-id] in
// the Todo column, and reorders D.chores in place so the chore
// the kid just moved sticks at its new position. Verified +
// pending chores are untouched (their order is derived from log
// dates, not the chore array). save() debounce-pushes to cloud.
//
// No re-render after drop — SortableJS already moved the DOM,
// and the next renderChores (verify, complete, save, etc.) will
// paint from the new array order. That keeps the drop visually
// snappy and avoids the post-drop flash.
// ════════════════════════════════════════════════════════════
function _persistChoreOrder(colEl){
  if(!colEl || !Array.isArray(D.chores)) return;
  var newIds = Array.prototype.map.call(
    colEl.querySelectorAll('.ch-card[data-chore-id]'),
    function(el){ return Number(el.getAttribute('data-chore-id')); }
  ).filter(function(n){ return Number.isFinite(n); });
  if(!newIds.length) return;
  // Build a fast lookup of the new order rank — chores not in the
  // dragged column (pending / verified / inactive) keep their existing
  // relative position by mapping to Infinity (i.e. sorted to the end
  // of the dragged set but still in their original order via a stable
  // sort).
  var rank = {};
  newIds.forEach(function(id, i){ rank[id] = i; });
  var dragged = D.chores.filter(function(c){ return rank[c.id] !== undefined; });
  var rest    = D.chores.filter(function(c){ return rank[c.id] === undefined; });
  dragged.sort(function(a, b){ return rank[a.id] - rank[b.id]; });
  // Splice strategy: insert the reordered dragged group at the index
  // of the first dragged item's original position so the rest of the
  // chore list stays anchored.
  var firstDraggedOrigIdx = D.chores.findIndex(function(c){ return rank[c.id] !== undefined; });
  if(firstDraggedOrigIdx < 0) firstDraggedOrigIdx = 0;
  var merged = rest.slice();
  merged.splice(firstDraggedOrigIdx, 0, ...dragged);
  D.chores = merged;
  save();
}

// ════════════════════════════════════════════════════════════
// Tab 1 Increment 5 Step C — AI Chore Coach.
//
// One-paragraph weekly summary + one-sentence next-week focus,
// kid voice, second-person. Cached per-week in
// D.choreCoachLastWeek so the kid can re-open the tab without
// re-paying for the same week's response.
//
// Auto-fetch: on first paint when D.choreCoachLastWeek.weekKey
// !== current ISO week AND there is at least 1 verified chore
// in the last 7 days (no point coaching an empty week).
//
// Manual refresh: button on the card. Throttled to once per 6h
// to keep API costs sane.
// ════════════════════════════════════════════════════════════
function _chCoachIsoWeek(d){
  d = (d instanceof Date) ? d : new Date();
  // Copy + jump to nearest Thursday (ISO week numbering).
  var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  var week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return t.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function _chCoachStats7d(){
  var now = new Date();
  var floor = new Date(now.getTime() - 7 * 86400000);
  var floorISO = floor.toISOString().slice(0,10);
  var log = Array.isArray(D.choreLog) ? D.choreLog : [];
  var chores = Array.isArray(D.chores) ? D.chores : [];
  var verified = log.filter(function(l){
    return l && l.status === 'verified' && (l.date || '') >= floorISO;
  });
  var pts = verified.reduce(function(s, l){ return s + (Number(l.pts) || 0); }, 0);
  var catCounts = {};
  verified.forEach(function(l){
    var c = chores.find(function(x){ return x.id === l.choreId; });
    var cat = (c && c.cat) || l.cat || 'other';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  var topCats = Object.keys(catCounts)
    .sort(function(a,b){ return catCounts[b] - catCounts[a]; })
    .slice(0,3);
  var streak = (typeof getChoreStreak === 'function') ? getChoreStreak() : 0;
  var name = (D.name || (D.profile && D.profile.parentName) || 'friend').slice(0,40);
  return {
    name:           name,
    verifiedCount:  verified.length,
    pointsEarned:   pts,
    currentStreak:  streak,
    topCategories:  topCats,
    badgesEarned:   Object.keys(D.choreBadges || {}).length
  };
}

async function fetchChoreCoach(){
  if(!D.choreCoachLastWeek || typeof D.choreCoachLastWeek !== 'object'){
    D.choreCoachLastWeek = { weekKey:'', summary:'', focus:'', fetchedAt:0 };
  }
  // 6-hour client-side throttle on manual refresh — server-side rate
  // limiting belongs to the platform layer, this is just "don't let
  // an impatient kid spam the API".
  var SIX_HOURS = 6 * 60 * 60 * 1000;
  var now = Date.now();
  if(D.choreCoachLastWeek.fetchedAt && (now - D.choreCoachLastWeek.fetchedAt) < SIX_HOURS){
    if(typeof showToast === 'function') showToast('Coach refreshed recently — try again later.');
    return;
  }
  var stats = _chCoachStats7d();
  if(stats.verifiedCount === 0){
    // Don't burn an API call on a kid with nothing to coach about.
    // Show a fallback friendly stub instead.
    D.choreCoachLastWeek = {
      weekKey: _chCoachIsoWeek(),
      summary: 'No verified chores this week yet — that\'s OK. The first one always feels the heaviest.',
      focus:   'Pick one easy chore today. Get the streak started.',
      fetchedAt: now
    };
    save();
    if(typeof renderChoreCoach === 'function') renderChoreCoach();
    return;
  }
  var host = document.getElementById('choreCoachCard');
  if(host){
    var body = host.querySelector('.cc-coach__body');
    if(body) body.innerHTML = '<div class="cc-coach__loading">Coach is thinking…</div>';
  }
  try {
    var prompt = JSON.stringify(stats);
    var resp = await fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'chore-coach', prompt: prompt })
    });
    var json = await resp.json();
    // /api/ai-summary spreads parsed JSON onto the top-level response
    // for JSON modes: { ok:true, summary, focus }. Read direct.
    if(!json || !json.ok || !json.summary){
      throw new Error('Empty or malformed response');
    }
    D.choreCoachLastWeek = {
      weekKey:   _chCoachIsoWeek(),
      summary:   String(json.summary || '').slice(0, 500),
      focus:     String(json.focus   || '').slice(0, 200),
      fetchedAt: now
    };
    save();
    if(typeof renderChoreCoach === 'function') renderChoreCoach();
  } catch(e){
    console.debug('[chore-coach] fetch failed:', e && e.message);
    if(host){
      var body2 = host.querySelector('.cc-coach__body');
      if(body2) body2.innerHTML = '<div class="cc-coach__err">Coach is offline right now. Try refresh in a minute.</div>';
    }
  }
}

function renderChoreCoach(){
  var host = document.getElementById('choreCoachCard');
  if(!host) return;
  if(!D.choreCoachLastWeek || typeof D.choreCoachLastWeek !== 'object'){
    D.choreCoachLastWeek = { weekKey:'', summary:'', focus:'', fetchedAt:0 };
  }
  var esc = function(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  };
  var stale = D.choreCoachLastWeek.weekKey !== _chCoachIsoWeek();
  var hasContent = !!(D.choreCoachLastWeek.summary);

  if(hasContent){
    host.innerHTML = ''
      + '<div class="cc-coach">'
      +   '<div class="cc-coach__head">'
      +     '<div class="cc-coach__title">💬 Your Weekly Coach</div>'
      +     '<button type="button" class="cc-coach__refresh" onclick="fetchChoreCoach()" title="Refresh coach (max once per 6h)">↻</button>'
      +   '</div>'
      +   '<div class="cc-coach__body">'
      +     '<p class="cc-coach__summary">' + esc(D.choreCoachLastWeek.summary) + '</p>'
      +     (D.choreCoachLastWeek.focus
        ? '<p class="cc-coach__focus"><span class="cc-coach__focus-label">This week:</span> ' + esc(D.choreCoachLastWeek.focus) + '</p>'
        : '')
      +   '</div>'
      +   (stale ? '<div class="cc-coach__stale">New week — tap ↻ for a fresh read</div>' : '')
      + '</div>';
  } else {
    host.innerHTML = ''
      + '<div class="cc-coach cc-coach--empty">'
      +   '<div class="cc-coach__head">'
      +     '<div class="cc-coach__title">💬 Your Weekly Coach</div>'
      +     '<button type="button" class="cc-coach__refresh" onclick="fetchChoreCoach()" title="Get my first coaching">↻</button>'
      +   '</div>'
      +   '<div class="cc-coach__body">'
      +     '<p class="cc-coach__summary">No coaching yet. Tap ↻ once you\'ve verified a few chores and I\'ll tell you how it went.</p>'
      +   '</div>'
      + '</div>';
  }
}

// First-paint auto-fetch hook — fires on cTab('mychores') activation
// when (a) the cached weekKey is stale AND (b) the kid has activity
// worth coaching about. Manual button always works regardless.
function _maybeAutoFetchChoreCoach(){
  if(!D.choreCoachLastWeek || typeof D.choreCoachLastWeek !== 'object') return;
  var stale = D.choreCoachLastWeek.weekKey !== _chCoachIsoWeek();
  if(!stale) return;
  var s = _chCoachStats7d();
  if(s.verifiedCount < 1) return;
  // Stale + has activity → fire-and-forget.
  fetchChoreCoach();
}

function renderChoreBadges(){
  var host = document.getElementById('choreBadgesGrid');
  if(!host) return;
  if(!D.choreBadges || typeof D.choreBadges !== 'object') D.choreBadges = {};
  var esc = function(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  };
  var earnedCount = CHORE_BADGES.filter(function(b){ return !!D.choreBadges[b.id]; }).length;
  var total = CHORE_BADGES.length;

  var header = ''
    + '<div class="cb-head">'
    +   '<div class="cb-head__title">🏆 BADGES</div>'
    +   '<div class="cb-head__count">' + earnedCount + ' / ' + total + '</div>'
    + '</div>';

  var grid = CHORE_BADGES.map(function(b){
    var got = !!D.choreBadges[b.id];
    var date = got ? D.choreBadges[b.id] : '';
    var titleAttr = esc(b.sub) + (got ? ' · earned ' + date : '');
    return ''
      + '<div class="cb-badge' + (got ? ' cb-badge--earned' : ' cb-badge--locked') + '"'
      +   ' style="--cb-accent:' + esc(b.accent) + ';"'
      +   ' title="' + titleAttr + '">'
      +   '<div class="cb-badge__icon" aria-hidden="true">' + b.icon + '</div>'
      +   '<div class="cb-badge__label">' + esc(b.label) + '</div>'
      +   '<div class="cb-badge__sub">'   + esc(b.sub)   + '</div>'
      + '</div>';
  }).join('');

  host.innerHTML = header + '<div class="cb-grid">' + grid + '</div>';
}
