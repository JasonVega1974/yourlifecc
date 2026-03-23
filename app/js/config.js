/* =============================================================
   config.js — Constants, Supabase config, global state vars
============================================================= */

// ── SUPABASE CONFIG ───────────────────────────────────────────
// ── SUPABASE CONFIG ───────────────────────────────────────────
// Replace these two values with your actual Supabase project credentials
const SUPA_URL = 'https://hrohgwcbfgywkpnvqxhk.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyb2hnd2NiZmd5d2twbnZxeGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjcxNDYsImV4cCI6MjA4ODQwMzE0Nn0.PuWtBpiMw2DiCLp26ZP_Rd9BwzFvWT0sNZrDUNdULyo';

let _supa = null;
let _supaUser = null;

function getSupabase(){
  if(!_supa && window.supabase){
    _supa = window.supabase.createClient(SUPA_URL, SUPA_KEY);
  }
  return _supa;
}

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
