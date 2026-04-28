/* =============================================================
   auth.js — Login, signup, PIN, plan picker, subscription gate, sign out
============================================================= */

// ── AUTH FUNCTIONS ─────────────────────────────────────────────
function authSwitchTab(tab){
  const isSignup = tab === 'signup';
  document.getElementById('authHeading').textContent = isSignup ? 'Create Your Account' : 'Sign In to Your Account';
  document.getElementById('authConfirmWrap').style.display = isSignup ? 'block' : 'none';
  document.getElementById('authForgotWrap').style.display = isSignup ? 'none' : 'block';
  document.getElementById('authSigninLink').style.display = isSignup ? 'block' : 'none';
  document.getElementById('authPlanWrap').style.display = isSignup ? 'block' : 'none';
  document.getElementById('authPaidLink').style.display = isSignup ? 'none' : 'block';
  document.getElementById('authBtn').textContent = isSignup ? 'Create Account' : 'Sign In';
  document.getElementById('authBtn').dataset.tab = tab;
  document.getElementById('authMsg').textContent = '';
  // Terms: show only in signup mode AND only when paid plan is selected
  if(isSignup){
    const selectedPlan = document.querySelector('input[name="authPlan"]:checked')?.value || 'paid';
    document.getElementById('authTermsWrap').style.display = selectedPlan === 'free_contest' ? 'none' : 'block';
  } else {
    document.getElementById('authTermsWrap').style.display = 'none';
  }
}

function authSetMsg(msg, color){ 
  const el = document.getElementById('authMsg');
  if(el){ el.textContent = msg; el.style.color = color || '#f87171'; }
}

function authSetLoading(on){
  const el = document.getElementById('authLoading');
  if(el) el.style.display = on ? 'flex' : 'none';
}

async function authSubmit(){
  const supa = getSupabase();
  if(!supa){ authSetMsg('Unable to connect. Please try again.'); return; }

  const email = (document.getElementById('authEmail')||{}).value?.trim();
  const pass = (document.getElementById('authPassword')||{}).value;
  const confirm = (document.getElementById('authConfirm')||{}).value;
  const tab = document.getElementById('authBtn').dataset.tab || 'login';
  const isSignup = tab === 'signup';

  if(!email || !pass){ authSetMsg('Please enter email and password.'); return; }
  const selectedPlan = document.querySelector('input[name="authPlan"]:checked')?.value || 'paid';
  if(isSignup && selectedPlan !== 'free_contest' && !document.getElementById('authTermsCheck')?.checked){
    authSetMsg('Please agree to the Terms of Service and Privacy Policy to create an account.');
    return;
  }
  if(pass.length < 6){ authSetMsg('Password must be at least 6 characters.'); return; }
  if(tab === 'signup' && pass !== confirm){ authSetMsg('Passwords do not match.'); return; }

  authSetLoading(true);
  authSetMsg('');

  try {
    let result;
    if(tab === 'signup'){
      result = await supa.auth.signUp({ email, password: pass });
      if(result.error) throw result.error;
      if(result.data?.user?.identities?.length === 0){
        authSetMsg('Account already exists. Please sign in.', '#fbbf24');
        authSwitchTab('login');
        authSetLoading(false);
        return;
      }
      authSetMsg('Account created! Check your email to confirm, or continue now.', 'var(--gr)');
      // Determine selected plan
      const planRadio = document.querySelector('input[name="authPlan"]:checked');
      const selectedPlan = planRadio ? planRadio.value : 'paid';
      // Save profile with plan type + referral code
      const refCode = getRefCookie();
      if(result.data?.user){
        try {
          const supaInst = getSupabase();
          const profileData = {
            user_id: result.data.user.id,
            email: result.data.user.email,
            updated_at: new Date().toISOString()
          };
          if(selectedPlan === 'free_contest') profileData.plan_status = 'free_contest';
          if(refCode) profileData.referred_by = refCode;
          await supaInst.from('profiles').upsert(profileData, { onConflict: 'user_id' });
          if(refCode) clearRefCookie();

          // Award account_created entry (1 entry)
          await awardContestEntries(supaInst, result.data.user.id, result.data.user.email, 'account_created', 1, null);

          // If referred, award 5 entries to referrer
          if(refCode){
            await awardReferrerEntries(supaInst, refCode, result.data.user.email);
          }
        } catch(e){ console.log('Profile save failed:', e); }
      }
      // Store plan type in session for immediate use
      window._contestFreeUser = (selectedPlan === 'free_contest');
      _supaUser = result.data.user;
      if(selectedPlan === 'free_contest'){
        // Free contest — go straight into app
        setTimeout(() => authComplete(false), 1200);
      } else {
        // Paid plan — show plan picker modal
        authSetMsg('Account created! Choose your plan below.', 'var(--gr)');
        setTimeout(() => showPlanPicker(), 800);
      }
    } else {
      result = await supa.auth.signInWithPassword({ email, password: pass });
      if(result.error) throw result.error;
      _supaUser = result.data.user;
      authSetMsg('Signed in!', 'var(--gr)');
      setTimeout(() => authComplete(true), 600);
    }
  } catch(err) {
    authSetLoading(false);
    const msg = err.message || 'Something went wrong.';
    if(msg.includes('Invalid login')) authSetMsg('Incorrect email or password.');
    else if(msg.includes('Email not confirmed')) authSetMsg('Please confirm your email first, or continue below.', '#fbbf24');
    else authSetMsg(msg);
  }
}


// ── CONTEST ENTRY TRACKING ────────────────────────────────────

async function awardContestEntries(supa, userId, email, entryType, entriesAwarded, referenceId){
  try {
    const { error } = await supa.from('contest_entries').insert({
      user_id: userId,
      email: email,
      entry_type: entryType,
      entries_awarded: entriesAwarded,
      reference_id: referenceId
    });
    if(error) console.warn('[Contest] Entry insert failed:', error.message);
    else console.log('[Contest] Awarded', entriesAwarded, 'entries for', entryType);
  } catch(e){ console.warn('[Contest] Entry error:', e); }
}

async function awardReferrerEntries(supa, refCode, newUserEmail){
  // refCode is first 8 chars of referrer's user_id (uppercased, no dashes)
  // Find the referrer's profile by matching their user_id pattern
  try {
    const { data: profiles } = await supa
      .from('profiles')
      .select('user_id, email');
    if(!profiles) return;
    const referrer = profiles.find(p => {
      if(!p.user_id) return false;
      return p.user_id.replace(/-/g,'').substring(0,8).toUpperCase() === refCode.toUpperCase();
    });
    if(referrer){
      await awardContestEntries(supa, referrer.user_id, referrer.email, 'referral', 5, newUserEmail);
      console.log('[Contest] Awarded 5 referral entries to', referrer.email);
    }
  } catch(e){ console.warn('[Contest] Referrer lookup failed:', e); }
}

async function getContestEntryCount(supa, userId, email){
  try {
    const { data, error } = await supa
      .from('contest_entries')
      .select('entries_awarded')
      .or(`user_id.eq.${userId},email.eq.${email}`);
    if(error || !data) return 0;
    return data.reduce((sum, row) => sum + (row.entries_awarded || 0), 0);
  } catch(e){ return 0; }
}

async function awardSocialShareEntry(platform){
  const supa = getSupabase();
  if(!supa || !_supaUser) return;
  const refLink = 'https://yourlifecc.com/app?ref=' + (_supaUser.id.replace(/-/g,'').substring(0,8).toUpperCase());
  
  // Open share in new tab
  const shareUrls = {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(refLink),
    twitter:  'https://twitter.com/intent/tweet?text=' + encodeURIComponent('I just joined the YourLife CC $5,000 Family Challenge! 🏆 Use my link to enter:') + '&url=' + encodeURIComponent(refLink),
    instagram: null, // Instagram has no web share API — open app
    tiktok:   null,
  };
  if(shareUrls[platform]) window.open(shareUrls[platform], '_blank');

  // Award entry (unique index prevents duplicates)
  await awardContestEntries(supa, _supaUser.id, _supaUser.email, 'social_share', 1, platform);
  
  // Refresh banner entry count
  setTimeout(refreshContestBannerCount, 1000);
}

async function refreshContestBannerCount(){
  const supa = getSupabase();
  if(!supa || !_supaUser) return;
  const count = await getContestEntryCount(supa, _supaUser.id, _supaUser.email);
  const el = document.getElementById('contestEntryCount');
  if(el) el.textContent = count;
}

// ── PLAN PICKER ───────────────────────────────────────────────
function showPlanPicker(){
  const modal = document.getElementById('planPickerModal');
  if(modal){ modal.style.display = 'flex'; }
  // Hide auth screen
  const auth = document.getElementById('authScreen');
  if(auth) auth.style.display = 'none';
}

// ── REFERRAL TRACKING ────────────────────────────────────────
function getRefCookie(){
  const match = document.cookie.match(/(?:^|;\s*)ylref=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}
function clearRefCookie(){
  document.cookie = 'ylref=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

async function authForgotPassword(){
  const supa = getSupabase();
  if(!supa){ authSetMsg('Not connected.'); return; }
  const email = (document.getElementById('authEmail')||{}).value?.trim();
  if(!email){ authSetMsg('Enter your email address first.'); return; }
  authSetLoading(true);
  const { error } = await supa.auth.resetPasswordForEmail(email);
  authSetLoading(false);
  if(error) authSetMsg(error.message);
  else authSetMsg('Password reset email sent!', 'var(--gr)');
}

// ── SUBSCRIPTION GATE ─────────────────────────────────────────
async function checkPlanStatus(){
  if(typeof IS_DEMO!=="undefined"&&IS_DEMO) return false;
  const supa = getSupabase();
  if(!supa || !_supaUser) return false; // local-only users pass through

  try {
    // Try by user_id first; fall back to email for rows where user_id is NULL
    let data, error;
    ({ data, error } = await supa
      .from('profiles')
      .select('plan_status')
      .eq('user_id', _supaUser.id)
      .single());

    if((error || !data) && _supaUser.email){
      ({ data, error } = await supa
        .from('profiles')
        .select('plan_status')
        .eq('email', _supaUser.email)
        .single());
    }

    if(error || !data) return false; // no record yet = new user, let through

    const status = data.plan_status;
    // Store plan status globally for access control
    window._userPlanStatus = status;
    window._contestFreeUser = (status === 'free_contest');
    // Block cancelled and past_due; allow active, trialing, null/undefined (legacy/free), free_contest
    if(status === 'cancelled' || status === 'past_due'){
      document.getElementById('authScreen').style.display = 'none';
      authSetLoading(false);

      const msgEl = document.getElementById('subBlockedMsg');
      const emailEl = document.getElementById('subBlockedEmail');
      if(emailEl) emailEl.textContent = _supaUser.email || '';
      if(msgEl){
        if(status === 'past_due'){
          msgEl.textContent = 'Your last payment failed and your subscription is past due. Please update your payment method to continue.';
          const cta = document.getElementById('subBlockedCTA');
          if(cta){ cta.textContent = 'Update Payment Method'; cta.href = 'https://billing.stripe.com/p/login/5kQaEQ52j4r783cftH7wA00'; }
        } else {
          msgEl.textContent = 'Your subscription has been cancelled. Reactivate anytime to pick up right where you left off — your data is saved.';
        }
      }
      document.getElementById('subBlockedScreen').style.display = 'flex';
      return true; // blocked
    }
    return false; // active / trialing / unknown = allow
  } catch(e){
    console.warn('[LifeOS] Plan status check failed, allowing through:', e);
    return false; // fail open — don't lock out on network errors
  }
}

async function authComplete(isReturningUser){
  // ── CHECK SUBSCRIPTION STATUS ──────────────────────────────
  if(_supaUser){
    const blocked = await checkPlanStatus();
    if(blocked) return; // blocked screen is shown, stop here
  }

  // For new users, wipe any stale localStorage so previous account data doesn't bleed in
  if(!isReturningUser){
    const keysToKeep = ['lifeos_last_sync']; // preserve nothing meaningful
    Object.keys(localStorage).forEach(function(k){
      if(!keysToKeep.includes(k)) localStorage.removeItem(k);
    });
    D = JSON.parse(JSON.stringify(DEF)); // reset in-memory data to defaults
  }

  // Try to load cloud data for returning users
  const loaded = isReturningUser ? await cloudLoad() : false;
  // Force-strip hidden sections that should always be visible
  if(!D.sections) D.sections={};
  ['cbt','resume','motivation','mentors','hero','parent'].forEach(function(k){ delete D.sections[k]; });
  
  document.getElementById('authScreen').style.display = 'none';
  authSetLoading(false);

  setSyncSt(loaded ? 'cloud' : 'local');

  // ── NEW USER: redirect to onboarding flow ──────────────────
  // Free contest users skip onboarding (no child setup needed yet)
  // Returning users skip it too — they already have profiles set up
  if(!isReturningUser && !window._contestFreeUser){
    // Store user ID so onboard.html can reference it
    if(_supaUser) localStorage.setItem('ylcc_onboard_uid', _supaUser.id);
    setTimeout(function(){ if(_supaUser) cloudSync(); }, 500);
    window.location.href = '/onboard.html';
    return;
  }

  // Returning users and free contest users go straight into the app
  finishInit();
  setTimeout(function(){ if(_supaUser) cloudSync(); }, 2000);
  // Setup contest free user UI if applicable
  setTimeout(setupContestFreeUser, 500);
}

function authContinueLocal(){
  // Skip auth, use localStorage only
  _supaUser = null;
  document.getElementById('authScreen').style.display = 'none';
  loadData();
  setSyncSt('local');
  finishInit();
}

// ── FREE CONTEST USER SETUP ────────────────────────────────────
function setupContestFreeUser(){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO) return;
  if(!window._contestFreeUser) return;

  // Generate referral code from user ID (first 8 chars)
  const uid = (_supaUser && _supaUser.id) ? _supaUser.id.replace(/-/g,'').substring(0,8).toUpperCase() : 'GUEST';
  const refLink = 'https://yourlifecc.com/app?ref=' + uid;

  // Insert contest banner at top of app
  const existing = document.getElementById('contestFreeBanner');
  if(existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'contestFreeBanner';
  banner.style.cssText = 'background:#000;border-bottom:2px solid #f5c842;padding:.85rem 1.25rem;position:sticky;top:0;z-index:9000;';
  banner.innerHTML = `
    <div style="max-width:700px;margin:0 auto;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.55rem;">
        <div>
          <div style="font-family:monospace;font-size:.6rem;font-weight:700;color:rgba(245,200,66,.7);letter-spacing:.15em;text-transform:uppercase;margin-bottom:.2rem;">🏆 CONTEST ENTRY ACCOUNT</div>
          <div style="font-size:.8rem;color:#f5c842;font-weight:800;">
            <span id="contestEntryCount" style="font-size:1.1rem;color:#fff;">...</span>
            <span style="color:rgba(245,200,66,.7);font-weight:600;"> contest entries</span>
          </div>
        </div>
        <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;">
          <button onclick="navigator.clipboard&&navigator.clipboard.writeText('${refLink}').then(()=>{this.textContent='✓ Copied!';setTimeout(()=>this.textContent='Copy Link',2000)})" style="background:#f5c842;color:#000;font-weight:800;font-size:.72rem;padding:.35rem .85rem;border:none;border-radius:6px;cursor:pointer;">Copy Link</button>
          <a href="https://yourlifecc.com/index.html#pricing" style="background:rgba(56,189,248,.15);color:#38bdf8;font-size:.72rem;font-weight:700;padding:.35rem .85rem;border-radius:6px;border:1px solid rgba(56,189,248,.3);text-decoration:none;white-space:nowrap;">Upgrade →</a>
        </div>
      </div>
      <div style="font-size:.65rem;color:rgba(245,200,66,.6);margin-bottom:.4rem;">📎 Your link: <span style="background:#1a1a00;padding:1px 6px;border-radius:3px;font-family:monospace;">${refLink}</span></div>
      <div style="display:flex;gap:.4rem;align-items:center;flex-wrap:wrap;">
        <span style="font-size:.62rem;color:rgba(255,255,255,.4);font-weight:600;margin-right:.2rem;">SHARE FOR +1 ENTRY EACH:</span>
        <button onclick="awardSocialShareEntry('facebook')" style="background:rgba(24,119,242,.2);border:1px solid rgba(24,119,242,.4);color:#4a9eff;font-size:.65rem;font-weight:700;padding:.25rem .6rem;border-radius:5px;cursor:pointer;" title="Share on Facebook">📘 Facebook</button>
        <button onclick="awardSocialShareEntry('twitter')" style="background:rgba(29,155,240,.2);border:1px solid rgba(29,155,240,.4);color:#4ab3ff;font-size:.65rem;font-weight:700;padding:.25rem .6rem;border-radius:5px;cursor:pointer;" title="Share on X/Twitter">𝕏 Twitter</button>
        <button onclick="awardSocialShareEntry('instagram')" style="background:rgba(225,48,108,.2);border:1px solid rgba(225,48,108,.4);color:#ff6b9d;font-size:.65rem;font-weight:700;padding:.25rem .6rem;border-radius:5px;cursor:pointer;" title="Share on Instagram">📸 Instagram</button>
        <button onclick="awardSocialShareEntry('tiktok')" style="background:rgba(105,201,208,.2);border:1px solid rgba(105,201,208,.4);color:#69c9d0;font-size:.65rem;font-weight:700;padding:.25rem .6rem;border-radius:5px;cursor:pointer;" title="Share on TikTok">🎵 TikTok</button>
      </div>
    </div>
  `;

  // Insert after nav/header if present, else at body start
  const appWrap = document.getElementById('app') || document.getElementById('mainApp') || document.body;
  appWrap.insertBefore(banner, appWrap.firstChild);

  // Load entry count async
  const supa = getSupabase();
  if(supa && _supaUser){
    getContestEntryCount(supa, _supaUser.id, _supaUser.email).then(count => {
      const el = document.getElementById('contestEntryCount');
      if(el) el.textContent = count;
    });
  }

  // Lock sections — only dashboard, life score, and referral are accessible
  const UNLOCKED_IDS = ['s-hero'];
  
  // Override showSection to block locked sections
  const _origShowSection = window.showSection;
  window.showSection = function(id){
    if(window._contestFreeUser && !UNLOCKED_IDS.includes(id)){
      // Show upgrade prompt instead
      showContestUpgradePrompt();
      return;
    }
    if(typeof _origShowSection === 'function') _origShowSection(id);
  };

  // Add lock indicators to sidebar nav items
  setTimeout(function(){
    document.querySelectorAll('.side-nav-item, .nav-item, [onclick*="showSection"]').forEach(function(el){
      const onclick = el.getAttribute('onclick') || '';
      const match = onclick.match(/showSection\(['"]([^'"]+)['"]\)/);
      if(match && !UNLOCKED_IDS.includes(match[1])){
        el.style.opacity = '0.45';
        el.title = 'Upgrade to unlock';
        if(!el.querySelector('.nav-lock')){
          const lockSpan = document.createElement('span');
          lockSpan.className = 'nav-lock';
          lockSpan.textContent = ' 🔒';
          lockSpan.style.cssText = 'font-size:.65rem;';
          el.appendChild(lockSpan);
        }
      }
    });

    // Lock the currently visible section if it's not in the allowed list
    const activeSec = document.querySelector('section.sec.active');
    if(activeSec && !UNLOCKED_IDS.includes(activeSec.id)){
      if(typeof _origShowSection === 'function') _origShowSection('s-hero');
    }
  }, 900);
}

// ── CONTEST UPGRADE PROMPT ────────────────────────────────────
function showContestUpgradePrompt(){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO) return;
  // Remove existing prompt if any
  const existing = document.getElementById('contestUpgradePrompt');
  if(existing) existing.remove();

  const prompt = document.createElement('div');
  prompt.id = 'contestUpgradePrompt';
  prompt.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;';
  prompt.innerHTML = `
    <div style="max-width:360px;width:90%;background:#0a0e1a;border:1.5px solid #f5c842;border-radius:20px;padding:2rem 1.75rem;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.8);">
      <div style="font-size:2rem;margin-bottom:.6rem;">🔒</div>
      <div style="font-size:1rem;font-weight:800;color:#fff;margin-bottom:.4rem;">This section is locked</div>
      <div style="font-size:.8rem;color:rgba(255,255,255,.5);margin-bottom:1.5rem;line-height:1.5;">Your contest account gives you access to the Dashboard and Refer & Earn sections. Upgrade to unlock everything.</div>
      <a href="https://yourlifecc.com/index.html#pricing" style="display:block;background:linear-gradient(135deg,#f5c842,#f59e0b);color:#000;font-weight:800;font-size:.9rem;padding:.85rem;border-radius:12px;text-decoration:none;margin-bottom:.75rem;">Upgrade to Full Access →</a>
      <button onclick="document.getElementById('contestUpgradePrompt').remove()" style="background:none;border:none;color:rgba(255,255,255,.35);font-size:.78rem;cursor:pointer;">Stay on Contest Account</button>
    </div>
  `;
  document.body.appendChild(prompt);
}

// ── SIGN OUT ──────────────────────────────────────────────────
async function signOut(){
  const supa = getSupabase();
  if(supa && _supaUser) await supa.auth.signOut();
  _supaUser = null;
  D = JSON.parse(JSON.stringify(DEF));
  localStorage.removeItem(LS);
  // Clear parent unlock flags on sign out
  localStorage.removeItem('lifeos_parent_unlocked');
  localStorage.removeItem('lifeos_pin_set');
  sessionStorage.removeItem('parentUnlocked');
  document.getElementById('subBlockedScreen').style.display = 'none';
  document.getElementById('authScreen').style.display = 'flex';
  setSyncSt('local');
}


// ── FIRST TIME GATE ───────────────────────────────────────────
function showFirstTimeGate(){
  if(typeof IS_DEMO !== 'undefined' && IS_DEMO) return;
  // PIN setup removed — go straight to app
  finishInit();
}

function hideFirstTimeGate(){
  const el = document.getElementById('firstTimeGate');
  if(el) el.style.display = 'none';
}


// ── PIN HASHING & MIGRATION (Phase 1.1 add-on) ────────────────
// Salt is the Supabase user id when present (different per family) and a
// constant 'local' for local-only users. The salt is not a secret — it just
// keeps hashes from being directly comparable across users. PINs are 4–6
// digits so the hash alone is brute-forceable; the salt prevents trivial
// rainbow-table reuse and reading the hash gives no immediate plaintext.
function _pinSalt(){
  return (typeof _supaUser !== 'undefined' && _supaUser && _supaUser.id) ? _supaUser.id : 'local';
}

async function hashPin(pin){
  const text = String(pin) + ':' + _pinSalt();
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Verify parent PIN. Hash-aware with plaintext fallback so partially migrated
// users keep working. The hash and the legacy plaintext can both live on D
// or on any profile.data depending on which profile was active when set —
// scan both. Returns boolean.
async function verifyParentPin(input){
  const v = String(input || '');
  // Collect candidate hashes from D and from every profile.data.
  const hashes = [];
  if(typeof D !== 'undefined' && D && D.parentPinHash) hashes.push(D.parentPinHash);
  if(typeof _profiles !== 'undefined' && _profiles){
    for(let i=0;i<_profiles.length;i++){
      const pd = _profiles[i] && _profiles[i].data;
      if(pd && pd.parentPinHash) hashes.push(pd.parentPinHash);
    }
  }
  if(hashes.length){
    const h = await hashPin(v);
    return hashes.indexOf(h) !== -1;
  }
  // Legacy plaintext fallback.
  let plain = (typeof D !== 'undefined' && D) ? (D.chorePin || D.parentPIN) : '';
  if(!plain && typeof _profiles !== 'undefined' && _profiles){
    for(let i=0;i<_profiles.length;i++){
      const pd = _profiles[i] && _profiles[i].data;
      if(pd && (pd.chorePin || pd.parentPIN)){ plain = pd.chorePin || pd.parentPIN; break; }
    }
  }
  return !!plain && v === String(plain);
}

// Verify a child profile's PIN. Hash-aware with id-as-PIN fallback for
// children that haven't been migrated yet.
async function verifyChildPin(profile, input){
  if(!profile) return false;
  const v = String(input || '');
  if(profile.pinHash) return (await hashPin(v)) === profile.pinHash;
  return v === String(profile.id || '');
}

// Set parent PIN (hash). Writes to D AND to the parent profile's data so
// verification works while a child is the active profile (D is the child's
// data in that case). Clears every legacy plaintext field. Caller saves.
async function setParentPin(newPin){
  if(typeof D === 'undefined' || !D) return false;
  const h = await hashPin(newPin);
  D.parentPinHash = h;
  D.chorePin = ''; D.parentPIN = '';
  if(typeof _profiles !== 'undefined' && _profiles){
    _profiles.forEach(function(p){
      if(p && p.data){
        if(p.isParent) p.data.parentPinHash = h;
        if(p.data.chorePin) p.data.chorePin = '';
        if(p.data.parentPIN) p.data.parentPIN = '';
        // Stale hashes on non-parent profiles get cleared.
        if(!p.isParent && p.data.parentPinHash) p.data.parentPinHash = '';
      }
    });
  }
  return true;
}

async function setChildPinHash(profile, newPin){
  if(!profile) return false;
  profile.pinHash = await hashPin(newPin);
  return true;
}

// Has the family got any plaintext PIN to migrate?
function hasPlaintextPin(){
  if(typeof D !== 'undefined' && D && (D.chorePin || D.parentPIN)) return true;
  if(typeof _profiles !== 'undefined' && _profiles){
    for(let i=0;i<_profiles.length;i++){
      const pd = _profiles[i] && _profiles[i].data;
      if(pd && (pd.chorePin || pd.parentPIN)) return true;
    }
  }
  return false;
}

function getPinMigration(){
  if(typeof D === 'undefined' || !D) return null;
  if(!D.pinMigration){
    D.pinMigration = { status:'pending', startedAt:null, completedAt:null, childrenMigrated:[] };
  }
  if(!Array.isArray(D.pinMigration.childrenMigrated)) D.pinMigration.childrenMigrated = [];
  return D.pinMigration;
}

function setPinMigrationStatus(status){
  const m = getPinMigration();
  if(!m) return;
  if(!m.startedAt && status !== 'pending') m.startedAt = new Date().toISOString();
  m.status = status;
  if(status === 'complete') m.completedAt = new Date().toISOString();
}

// Recovery: re-confirm Supabase password, then set a fresh parent PIN.
// Returns { ok:true } or { ok:false, error:'message' }.
async function parentPinResetWithPassword(password, newPin){
  if(typeof _supaUser === 'undefined' || !_supaUser || !_supaUser.email){
    return { ok:false, error:'Sign in to your account before resetting your PIN.' };
  }
  if(!newPin || String(newPin).length < 4){
    return { ok:false, error:'New PIN is required.' };
  }
  const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if(!supa) return { ok:false, error:'Cannot reach the server. Check your connection.' };
  try {
    const r = await supa.auth.signInWithPassword({ email:_supaUser.email, password:String(password||'') });
    if(r.error) return { ok:false, error:'Wrong password — try again.' };
  } catch(e){
    return { ok:false, error:'Could not verify password. Please try again.' };
  }
  await setParentPin(newPin);
  if(typeof save === 'function') save();
  return { ok:true };
}
