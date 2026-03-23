/* =============================================================
   init.js — App bootstrap, DOMContentLoaded handlers,
             section init, first load logic
============================================================= */

// ── INIT ──────────────────────────────────────────────────────
async function init(){
  setSyncSt('loading');

  // Check for existing Supabase session
  const supa = getSupabase();
  if(supa){
    // Keep _supaUser current whenever Supabase refreshes the token
    supa.auth.onAuthStateChange(function(event, session){
      if(session && session.user){
        _supaUser = session.user;
        if(event === 'TOKEN_REFRESHED') cloudSync();
      } else if(event === 'SIGNED_OUT'){
        _supaUser = null;
        setSyncSt('local');
      }
    });

    const { data: { session } } = await supa.auth.getSession();
    if(session?.user){
      _supaUser = session.user;

      // ── CHECK SUBSCRIPTION STATUS ON EXISTING SESSION ──────
      const blocked = await checkPlanStatus();
      if(blocked) return; // show blocked screen, stop here

      const loaded = await cloudLoad();
      if(!loaded){ loadData(); setTimeout(cloudSync, 1500); } // load local + write row to Supabase
      setSyncSt(loaded ? 'cloud' : 'cloud'); // user is signed in either way
      if(!D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
      finishInit();
      setTimeout(setupContestFreeUser, 500); // Show contest banner if applicable
      return;
    }
  } else {
    // Supabase not available - use localStorage
    loadData();
    setSyncSt('local');
    if(!D.chorePin && !D.parentPIN){ showFirstTimeGate(); return; }
    finishInit();
    return;
  }

  // No session - show auth screen
  document.getElementById('authScreen').style.display = 'flex';
}

function finishInit(){
  // Always ensure newly-added sections are visible regardless of saved state
  if(D.sections){ ['cbt','resume','motivation','mentors'].forEach(function(k){ delete D.sections[k]; }); }
  // Belt+suspenders: force CBT on
  if(D.sections && D.sections.cbt===0) delete D.sections.cbt;
  // Apply saved theme
  applyTheme();
  applyPalette();
  applyHeroBg();
  // Build sidebar nav
  buildSideNav();
  // Show hero section by default
  showSection('s-hero');
  // Show daily devotional popup once per day — skip if wizard is open
  setTimeout(function(){
    const today = new Date().toISOString().slice(0,10);
    const faithOn = !(D.settings && D.settings.faithMode===false);
    const wizardOpen = (document.getElementById('parentOnboard')||{}).classList&&document.getElementById('parentOnboard').classList.contains('open');
    const kidWizOpen = (document.getElementById('kidOnboard')||{}).classList&&document.getElementById('kidOnboard').classList.contains('open');
    if(faithOn && (!D.devPopupSeen || D.devPopupSeen !== today) && !wizardOpen && !kidWizOpen){
      showDailyDevModal();
    }
  }, 1200);

  startClock();
  applySettings();
  applyChildAvatar();
  renderVerse();
  startVerseAutoRotation();
  // Start session timer
  if(typeof startSessionTimer === 'function') startSessionTimer();
  // Initial cloud sync after login
  setTimeout(function(){ if(_supaUser) cloudSync(); }, 1500);
  buildCheckins();
  updateStreak();
  updateQuickStats();

  // Finance
  const savedBankBal=D.bank||0, savedSavBal=D.bankSavAcct||0;
  const bbl=document.getElementById('bankBal'), sabl=document.getElementById('savAcctBal');
  const bll=document.getElementById('bankLbl'), sall=document.getElementById('savAcctLbl');
  if(bbl) bbl.value=savedBankBal||''; if(sabl) sabl.value=savedSavBal||'';
  if(bll) bll.value=D.bankLabel||''; if(sall) sall.value=D.bankSavAcctLabel||'';
  renderBankHist(); renderBills(); renderTx(); updateFinSum();

  // School
  renderClasses(); renderGPA(); refreshAsgClassSelect(); renderAsg(); renderStudyLog();

  // Schedule
  buildSchedule();

  // Calendar
  renderCalendar(); renderUpcoming();

  // Health
  updateWeightStats(); renderWeightList(); renderFoodLog(); updateMacros();

  // Goals
  renderGoals(); renderVision(); renderTimeline(); buildCareers();

  // Profile
  updateProfileButton(); applyProfileContext();

  // Growing Up
  buildGrowingGrid();

  // Life Skills
  buildSkillsGrid();

  // Craft / Gallery / Journal / Motivation
  buildCraftSection(); renderGallery(); renderJournal(); renderMotivation();
  loadBioFields();
  renderBooks(); renderMentors(); renderMilestones(); renderMoodTracker();
  renderChores();
  renderStudyPlan(); renderExams(); renderKidParentNotes();
  applyStageFilter();
  renderGettingStarted();
  renderMonthlyChallenge(); renderDailyPrompt(); renderBadges();
  initMusicAndSports();
  initDriving();
  initProfiles();
  initScreenTime(); renderEarnings();
  initBadgesPage();
  initScripture();
  initParentBucks();
  renderParentBucks();
  renderGameTickets();
  hookRewardTriggers();
  initQuizSystem();
  initCharacter();
  initSkillsGrid();
  updateHeroClock();
  renderHeroMotivation();
  renderDailyActivityCheck();
  renderLifeMapBoard();
  initContests();
  applyFaithMode();
  renderDevMap();
  initResources();

  // Auto-show Quick Start Wizard on first visit
  // isNewUser catches accounts where parentWizardDone:true was saved from a prior test
  const isNewUser = !D.name || D.name === '';
  if(!D.parentWizardDone || isNewUser){ setTimeout(showParentOnboard, 700); }

  // Macro goal inputs
  const g=D.macroGoals||{};
  ['goalCal','goalPro','goalCarb','goalFat'].forEach((id,i)=>{ const e=document.getElementById(id); const keys=['cal','pro','carb','fat']; if(e&&g[keys[i]]) e.value=g[keys[i]]; });

  // Today's date defaults
  const today=new Date().toISOString().split('T')[0];
  ['txDate','asgDue','evDate','wDate'].forEach(id=>{ const e=document.getElementById(id); if(e&&!e.value) e.value=today; });

  // Pre-fill budget if saved
  if(D.budgetIncome){ const bi=document.getElementById('budgInc'); if(bi) bi.value=D.budgetIncome; }
  if(D.budgetSavings){ const bs=document.getElementById('budgSav'); if(bs) bs.value=D.budgetSavings; }
}




