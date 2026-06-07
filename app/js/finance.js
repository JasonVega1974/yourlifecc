/* =============================================================
   finance.js — Money manager, transactions, savings goals,
               budgeting, allowance, earnings
============================================================= */

// ── FINANCE ──────────────────────────────────────────────────
// Tab 2 Inc 1 (2026-06-05) — sub-tab IA reshuffled to 8 routes:
//   dashboard  (was 'overview')
//   tx
//   budget
//   goals      (NEW — merges old 'savings' + 'savgoals' panels)
//   bills
//   paycheck
//   allowance  (NEW — empty stub until Inc 4 ships)
//   learn      (NEW — absorbs the old 'taxed' Tax Ed content as
//              Lesson 5 of an upcoming 8-lesson series, Inc 5)
//
// The route keys 'overview', 'savings', 'savgoals', 'taxed' are
// retired. Any external caller still passing them will land on a
// hidden panel (no matching #mt-{key} div) — harmless but logs a
// deprecation note in dev to surface the stale call site.
function mTab(tab,btn){
  document.querySelectorAll('[id^="mt-"]').forEach(t=>t.style.display='none');
  document.querySelectorAll('.moneyTabs .tab').forEach(b=>b.classList.remove('active'));
  const te=document.getElementById('mt-'+tab); if(te) te.style.display='block';
  if(btn) btn.classList.add('active');
  // Legacy route keys flagged on call. Won't throw — just routes to no
  // panel — but the warn line surfaces upgrade-misses in dev consoles.
  if(tab==='overview' || tab==='savings' || tab==='savgoals' || tab==='taxed'){
    console.warn('[mTab] deprecated route', tab, '— mapped to:',
      tab==='overview'?'dashboard':(tab==='savings'||tab==='savgoals')?'goals':'learn');
  }
  // Active-renderer dispatch (post-Inc-1).
  if(tab==='dashboard'){
    renderSpendingDonut();
    // Tab 2 Inc 7 Step A — paint cached coach + auto-fetch when the
    // ISO week has rolled over and there's enough activity to coach
    // about. Manual refresh button always works via the ↻ control.
    if(typeof renderMoneyCoach         === 'function') renderMoneyCoach();
    if(typeof _maybeAutoFetchMoneyCoach === 'function') _maybeAutoFetchMoneyCoach();
  }
  if(tab==='tx')        renderTx();
  if(tab==='budget')    calcBudget();
  if(tab==='goals')   { renderSavingsTab(); renderSavGoalCards(); if(typeof _runWhatIf === 'function') setTimeout(_runWhatIf, 0); }
  if(tab==='bills')     renderBills();
  if(tab==='paycheck')  calcPaycheckSim();
  if(tab==='allowance' && typeof renderAllowance === 'function') renderAllowance();
  // Learn panel — Inc 4 renderer routes to the lesson grid or to a
  // specific lesson based on _learnView state. Lesson 5 (Taxes) keeps
  // its static HTML which embeds the calcTax form, so we still fire
  // calcTax on activation when lesson 5 is visible.
  if(tab==='learn'){
    if(typeof renderLearn === 'function') renderLearn();
    if(typeof calcTax === 'function') calcTax();
  }
}

function saveBal(){
  const b=parseFloat(document.getElementById('bankBal').value);
  const l=(document.getElementById('bankLbl').value||'Checking').trim();
  const sa=parseFloat(document.getElementById('savAcctBal').value);
  const sl=(document.getElementById('savAcctLbl').value||'Savings').trim();
  if(!isNaN(b)&&b>=0){ D.bank=b; D.bankLabel=l; }
  if(!isNaN(sa)&&sa>=0){ D.bankSavAcct=sa; D.bankSavAcctLabel=sl; }
  if(!D.bankHistory) D.bankHistory=[];
  D.bankHistory.unshift({bank:D.bank,savAcct:D.bankSavAcct,label:l,date:new Date().toLocaleDateString()});
  if(D.bankHistory.length>12) D.bankHistory=D.bankHistory.slice(0,12);
  save(); renderBankHist(); updateFinSum(); showToast('Balances updated! 💰');
}

function renderBankHist(){
  const el=document.getElementById('bankHist'); if(!el) return;
  el.innerHTML=(D.bankHistory||[]).map(h=>`
    <div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.78rem;">
      <span style="color:#c8d4e8;">${h.date} · ${h.label||''}</span>
      <span style="color:#c4b5fd;font-weight:700;">$${(h.bank||0).toLocaleString()}</span>
      ${h.savAcct!==undefined?`<span style="color:var(--gr);font-weight:700;">+$${(h.savAcct||0).toLocaleString()}</span>`:''}
    </div>`).join('');
}

function addBill(){
  const name=(document.getElementById('billName').value||'').trim();
  const amt=parseFloat(document.getElementById('billAmt').value);
  const day=parseInt(document.getElementById('billDay').value)||1;
  const cat=document.getElementById('billCat').value;
  if(!name||isNaN(amt)){ showToast('Enter name and amount'); return; }
  if(!D.bills) D.bills=[];
  D.bills.push({id:Date.now(),name,amt,day,cat,paid:false});
  D.bills.sort((a,b)=>a.day-b.day);
  document.getElementById('billName').value=''; document.getElementById('billAmt').value='';
  save(); renderBills(); updateFinSum(); showToast('Bill added!');
}

function ord(n){ const s=['th','st','nd','rd'],v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }

function renderBills(){
  const el=document.getElementById('billList'); if(!el) return;
  if(!(D.bills||[]).length){ el.innerHTML='<div style="font-size:.82rem;color:#c8d4e8;text-align:center;padding:1.2rem;">No bills yet — add one above!</div>'; return; }
  el.innerHTML=D.bills.map(b=>`
    <div style="display:flex;align-items:center;gap:.55rem;padding:.55rem .8rem;background:rgba(255,255,255,.1);border-radius:9px;margin-bottom:.3rem;border-left:3px solid ${b.paid?'var(--gr)':'var(--pk)'};${b.paid?'opacity:.55;':''}cursor:pointer;" onclick="toggleBill(${b.id})">
      <div style="font-size:.95rem;">${b.paid?'✅':'⭕'}</div>
      <div style="flex:1;"><div style="font-weight:700;font-size:.87rem;${b.paid?'text-decoration:line-through;':''}">${escapeHtml(b.name)}</div>
      <div style="font-size:.68rem;color:#c8d4e8;">${b.cat} · Due ${ord(b.day)}</div></div>
      <div style="font-weight:800;color:${b.paid?'var(--gr)':'var(--pk)'};">$${(b.amt||0).toFixed(2)}</div>
      <button class="eb" onclick="event.stopPropagation();editBill(${b.id})">✎</button>
      <button class="db" onclick="event.stopPropagation();deleteBill(${b.id})">✕</button>
    </div>`).join('');
  const tot=(D.bills||[]).reduce((a,b)=>a+b.amt,0);
  const te=document.getElementById('billTotal'); if(te) te.textContent='Total: $'+tot.toFixed(2);
}

function toggleBill(id){ const b=(D.bills||[]).find(b=>b.id===id); if(b){b.paid=!b.paid; save(); renderBills(); updateFinSum();} }
function editBill(id){ const b=(D.bills||[]).find(b=>b.id===id); if(!b) return; const n=prompt('Bill name:',b.name); if(!n) return; const a=parseFloat(prompt('Amount:',b.amt)); if(!isNaN(a)) b.amt=a; b.name=n.trim(); save(); renderBills(); updateFinSum(); }
function deleteBill(id){ D.bills=(D.bills||[]).filter(b=>b.id!==id); save(); renderBills(); updateFinSum(); }

// Tab 2 Inc 2 (+ Inc 3 edit-mode) — addTx handles BOTH new entries
// and in-place edits. When _moneyTxEditingId is set, the function
// finds that entry in D.transactions and updates it; otherwise it
// unshifts a new entry. Edit mode is set by editTx() (Inc 3 swap
// from prompt() to inline form-population per UX review scope E).
function addTx(){
  const name = (document.getElementById('txName').value || '').trim();
  const amt  = parseFloat(document.getElementById('txAmt').value);
  // Fall back to the module-scoped defaults if the hidden fields
  // are missing (e.g. partial deploy or another caller path).
  const typeEl = document.getElementById('txType');
  const catEl  = document.getElementById('txCat');
  const type = (typeEl && typeEl.value) || (typeof _moneyTxActiveType !== 'undefined' ? _moneyTxActiveType : 'expense');
  const cat  = (catEl  && catEl.value)  || (typeof _moneyTxActiveCat  !== 'undefined' ? _moneyTxActiveCat  : 'Other');
  const dateRaw = (document.getElementById('txDate') || {}).value;
  const date = dateRaw || (typeof localDateString === 'function' ? localDateString() : new Date().toISOString().slice(0,10));
  if(!name){ showToast('Add a description'); return; }
  if(isNaN(amt) || amt <= 0){ showToast('Enter an amount'); return; }
  if(!D.transactions) D.transactions = [];

  // Inc 3 — edit-mode path. Mutate the existing entry in place so
  // the row stays at its original position in history (the natural
  // expectation when correcting a typo on a 3-day-old transaction).
  if(typeof _moneyTxEditingId !== 'undefined' && _moneyTxEditingId !== null){
    const entry = D.transactions.find(t => t && t.id === _moneyTxEditingId);
    if(entry){
      entry.name = name;
      entry.amt  = amt;
      entry.type = type;
      entry.cat  = cat;
      entry.date = date;
      _moneyTxCancelEdit();
      save();
      renderTx();
      updateFinSum();
      showToast('Transaction updated ✓');
      return;
    }
    // Fall through to insert if the id vanished (e.g. profile swap
    // mid-edit). The leftover edit mode is cleared.
    _moneyTxCancelEdit();
  }

  // Default path — insert a new entry.
  D.transactions.unshift({ id:Date.now(), name, amt, type, cat, date });
  document.getElementById('txName').value = '';
  document.getElementById('txAmt').value  = '';
  if(typeof _checkMoneyMilestones === 'function') _checkMoneyMilestones();
  save();
  renderTx();
  updateFinSum();
  // Subject-forward toast — the user just logged a real-money flow;
  // celebrate the action, not the database write. UX reviewer call.
  const amtStr = '$' + amt.toFixed(2);
  showToast(
    type === 'income'
      ? '💚 ' + amtStr + ' income logged'
      : '🪙 ' + amtStr + ' spent on ' + cat
  );
}

function filterTx(type,btn){ _txFilter=type; document.querySelectorAll('.txf').forEach(b=>b.classList.remove('active')); if(btn) btn.classList.add('active'); renderTx(); }
// Tab 2 Inc 3 — editTx replaced the native prompt() flow with an
// inline edit-mode that populates the existing add-form with the
// row's values. UX reviewer flagged the prompt() as the loudest
// design-system violation on the surface. _moneyTxBeginEdit lives
// in the Inc 3 block at the bottom of this file.
function editTx(id){
  if(typeof _moneyTxBeginEdit === 'function'){ _moneyTxBeginEdit(id); return; }
  // Defensive fallback only — should never hit in production.
  const t=(D.transactions||[]).find(t=>t.id===id); if(!t) return;
  const n=prompt('Description:',t.name); if(!n) return;
  const a=parseFloat(prompt('Amount:',t.amt)); if(!isNaN(a)) t.amt=a;
  t.name=n.trim(); save(); renderTx(); updateFinSum();
}
function deleteTx(id){ D.transactions=(D.transactions||[]).filter(t=>t.id!==id); save(); renderTx(); updateFinSum(); }

// Tab 2 Inc 2 — renderTx is a thin shim that delegates to the new
// month-grouped, --mz-* styled renderer. Legacy flat-list fallback
// retained in case a deploy ships finance.js with the new mTab
// dispatch but the index.html panel still has the OLD #txList
// container (mid-rollout safety).
function renderTx(){
  if(typeof _moneyRenderTransactions === 'function'
     && document.getElementById('mzTxList')){
    _moneyRenderTransactions();
    return;
  }
  // ─── Legacy flat-list fallback ───────────────────────────────
  const el = document.getElementById('txList'); if(!el) return;
  const list = (D.transactions||[]).filter(t => _txFilter === 'all' || t.type === _txFilter);
  if(!list.length){
    el.innerHTML = '<div style="font-size:.82rem;color:#c8d4e8;text-align:center;padding:1rem;">No transactions yet</div>';
    return;
  }
  const cols = { income:'var(--c)', expense:'var(--pk)', savings:'var(--gr)' };
  el.innerHTML = list.slice(0,80).map(t => `
    <div style="display:flex;align-items:center;gap:.55rem;padding:.5rem .75rem;background:rgba(255,255,255,.1);border-radius:9px;margin-bottom:.28rem;border-left:3px solid ${cols[t.type]||'var(--mt)'};">
      <div style="flex:1;"><div style="font-weight:700;font-size:.85rem;">${escapeHtml(t.name)}</div>
      <div style="font-size:.68rem;color:#c8d4e8;">${t.cat} · ${t.date}</div></div>
      <div style="font-weight:800;color:${cols[t.type]||'var(--mt)'};">${t.type==='income'?'+':'-'}$${(t.amt||0).toFixed(2)}</div>
      <button class="eb" onclick="editTx(${t.id})">✎</button>
      <button class="db" onclick="deleteTx(${t.id})">✕</button>
    </div>`).join('');
}

function updateFinSum(){
  const now=new Date(), ym=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  let inc=0,exp=0;
  (D.transactions||[]).forEach(t=>{ if(t.date&&t.date.startsWith(ym)){if(t.type==='income') inc+=t.amt; else if(t.type==='expense') exp+=t.amt;} });
  const bills=(D.bills||[]).reduce((a,b)=>a+b.amt,0);
  const net=inc-exp-bills;
  const unpaid=(D.bills||[]).filter(b=>!b.paid).length;
  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  set('statBank','$'+(D.bank||0).toLocaleString()); set('statBankLbl',D.bankLabel||'—');
  set('statSavAcct','$'+(D.bankSavAcct||0).toLocaleString()); set('statSavAcctLbl',D.bankSavAcctLabel||'—');
  set('statInc','$'+inc.toFixed(2)); set('statBills','$'+bills.toFixed(2));
  set('statUnpaid',unpaid+' unpaid');
  const ne=document.getElementById('statNet'); if(ne){ne.textContent='$'+Math.abs(net).toFixed(2); ne.style.color=net>=0?'var(--or)':'var(--pk)';}
  updateSavStats(); updateQuickStats();
  renderMonthSnap(inc,exp,bills);
  // Phase C-Finance: write the warm summary opener (3-number card that
  // replaced the legacy 6-stat row). Balance + month spending + savings %.
  const goals = D.savingsGoals||[];
  const ts = goals.reduce((a,g)=>a+(g.current||0),0);
  const tt = goals.reduce((a,g)=>a+(g.target||0),0);
  const savPct = tt > 0 ? Math.min(100, (ts/tt)*100) : 0;
  set('finSumBalance', '$'+(D.bank||0).toLocaleString());
  set('finSumMonthSpend', '$'+exp.toFixed(2));
  set('finSumSavPct', savPct.toFixed(0)+'%');
  // The donut chart re-renders on overview-tab activation; refresh here
  // too so it stays current when transactions change while overview is open.
  if(typeof renderSpendingDonut === 'function'){
    const donutEl = document.getElementById('spendingDonut');
    if(donutEl && donutEl.offsetParent !== null) renderSpendingDonut();
  }
}

function renderMonthSnap(inc,exp,bills){
  const el=document.getElementById('monthSnap'); if(!el) return;
  const paid=(D.bills||[]).filter(b=>b.paid).length;
  const total=(D.bills||[]).length;
  el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:.55rem;font-size:.84rem;">
    <div style="padding:.6rem;background:rgba(255,255,255,.1);border-radius:9px;"><div style="font-size:.62rem;color:#c8d4e8;">CHECKING</div><div style="font-weight:800;color:#c4b5fd;font-family:var(--fn);">$${(D.bank||0).toLocaleString()}</div></div>
    <div style="padding:.6rem;background:rgba(255,255,255,.1);border-radius:9px;"><div style="font-size:.62rem;color:#c8d4e8;">SAVINGS ACCT</div><div style="font-weight:800;color:var(--gr);font-family:var(--fn);">$${(D.bankSavAcct||0).toLocaleString()}</div></div>
    <div style="padding:.6rem;background:rgba(255,255,255,.1);border-radius:9px;"><div style="font-size:.62rem;color:#c8d4e8;">MONTH INCOME</div><div style="font-weight:800;color:var(--c);font-family:var(--fn);">$${inc.toFixed(2)}</div></div>
    <div style="padding:.6rem;background:rgba(255,255,255,.1);border-radius:9px;"><div style="font-size:.62rem;color:#c8d4e8;">MONTH EXPENSES</div><div style="font-weight:800;color:var(--pk);font-family:var(--fn);">$${exp.toFixed(2)}</div></div>
    <div style="padding:.6rem;background:rgba(255,255,255,.1);border-radius:9px;"><div style="font-size:.62rem;color:#c8d4e8;">BILLS PAID</div><div style="font-weight:800;color:var(--g);font-family:var(--fn);">${paid}/${total}</div></div>
    <div style="padding:.6rem;background:rgba(255,255,255,.1);border-radius:9px;"><div style="font-size:.62rem;color:#c8d4e8;">TOTAL BILLS</div><div style="font-weight:800;color:var(--pk);font-family:var(--fn);">$${bills.toFixed(2)}</div></div>
  </div>`;
}

function renderFinanceDash(){
  // Show the Dashboard sub-tab by default, render stats.
  // (Renamed 2026-06-05 from 'overview' → 'dashboard' per Inc 1 IA.)
  document.querySelectorAll('[id^="mt-"]').forEach(t=>t.style.display='none');
  const dash = document.getElementById('mt-dashboard');
  if(dash) dash.style.display='block';
  // Set the first tab (Dashboard) as active.
  document.querySelectorAll('.moneyTabs .tab').forEach(b=>b.classList.remove('active'));
  const firstTab = document.querySelector('.moneyTabs .tab');
  if(firstTab) firstTab.classList.add('active');
  // Update balance displays
  updateFinSum&&updateFinSum();
  renderBills&&renderBills();
}

function calcBudget(){
  const inc=parseFloat(document.getElementById('budgInc').value)||0;
  const sav=parseFloat(document.getElementById('budgSav').value)||0;
  const bills=(D.bills||[]).reduce((a,b)=>a+b.amt,0);
  const n=inc*.5,w=inc*.3,s=inc*.2;
  const el=document.getElementById('budgOut'); if(!el) return;
  el.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem;margin-bottom:.75rem;">
      <div style="padding:.65rem;background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.15);border-radius:9px;text-align:center;"><div style="font-size:.6rem;color:#c8d4e8;">NEEDS 50%</div><div style="font-family:var(--fn);font-size:.95rem;font-weight:700;color:var(--c);">$${n.toFixed(0)}</div></div>
      <div style="padding:.65rem;background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.15);border-radius:9px;text-align:center;"><div style="font-size:.6rem;color:#c8d4e8;">WANTS 30%</div><div style="font-family:var(--fn);font-size:.95rem;font-weight:700;color:var(--g);">$${w.toFixed(0)}</div></div>
      <div style="padding:.65rem;background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.15);border-radius:9px;text-align:center;"><div style="font-size:.6rem;color:#c8d4e8;">SAVINGS 20%</div><div style="font-family:var(--fn);font-size:.95rem;font-weight:700;color:var(--gr);">$${s.toFixed(0)}</div></div>
    </div>
    <div style="padding:.5rem .7rem;background:rgba(255,255,255,.1);border-radius:7px;font-size:.82rem;">Monthly bills: <strong>$${bills.toFixed(2)}</strong> ${bills>n?'<span style="color:var(--pk);">⚠ Over 50% budget</span>':'<span style="color:var(--gr);">✓ Within budget</span>'}</div>
    ${sav>0?`<div style="margin-top:.4rem;padding:.5rem .7rem;background:rgba(52,211,153,.06);border-radius:7px;font-size:.82rem;">Saving <strong style="color:var(--gr);">$${sav.toFixed(0)}/mo</strong> = <strong style="color:var(--gr);">$${(sav*12).toFixed(0)}/yr</strong> 🔥</div>`:''}`;
}

// ── SAVINGS GOALS ─────────────────────────────────────────────
function updateSavStats(){
  const goals=D.savingsGoals||[];
  const ts=goals.reduce((a,g)=>a+(g.current||0),0);
  const tt=goals.reduce((a,g)=>a+(g.target||0),0);
  const pct=tt>0?Math.min(100,(ts/tt)*100):0;
  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  set('statSaved','$'+ts.toLocaleString());
  set('savGoalCt',goals.length+' goals');
  const b=document.getElementById('savTopBar'); if(b) b.style.width=pct+'%';
}

function saveSavingsGoal(){
  const name=(document.getElementById('sgName').value||'').trim();
  const emoji=(document.getElementById('sgEmoji').value||'🎯').trim();
  const target=parseFloat(document.getElementById('sgTarget').value);
  const current=parseFloat(document.getElementById('sgCurrent').value)||0;
  if(!name||isNaN(target)){showToast('Fill in goal details');return;}
  if(!D.savingsGoals) D.savingsGoals=[];
  D.savingsGoals.push({id:Date.now(),name,emoji,target,current});
  ['sgName','sgEmoji','sgTarget','sgCurrent'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  save(); renderSavingsTab(); renderSavGoalCards(); closeModal('goalModal'); showToast('Goal created! 🎯');
}

function addToGoal(id){
  const a = parseFloat(prompt('Amount to add ($):'));
  if(isNaN(a) || a <= 0) return;
  const g = (D.savingsGoals||[]).find(g => g.id === id);
  if(!g) return;
  const wasIncomplete = (g.current || 0) < g.target;
  g.current = (g.current || 0) + a;
  save();
  renderSavingsTab();
  renderSavGoalCards();
  updateFinSum();
  // Phase C-Finance: celebration when a goal crosses the finish line.
  // launchSideConfetti is reduced-motion guarded (misc.js).
  if(wasIncomplete && g.current >= g.target){
    showToast('🎉 Goal complete! ' + g.emoji + ' ' + g.name);
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
  } else {
    showToast('+$' + a + ' added! 💚');
  }
}
// editSavGoal — replaced by the Inc 5 modal-reuse version at the
// bottom of this file. The new one repurposes goalModal in edit
// mode instead of chaining native prompt() dialogs.
function delSavGoal(id){ if(!confirm('Delete this goal?')) return; D.savingsGoals=(D.savingsGoals||[]).filter(g=>g.id!==id); save(); renderSavingsTab(); renderSavGoalCards(); updateFinSum(); }

// Tab 2 Inc 5 — renderSavGoalCards extended:
//   - Sanitizes D.savingsGoals (adds optional fields defensively)
//   - Renders the inline "+ Add" expanding row when
//     _quickAddOpenId === g.id (replaces the prompt-based addToGoal)
//   - Renders the hero photo when g.photoPath is set
//     (signed URL hydrated async via _hydrateGoalPhotos)
//   - Renders countdown chip when g.targetDate is set
//   - Renders completed badge when g.completedAt is set
//   - Edit / delete actions unchanged (editSavGoal now opens
//     goalModal in edit mode rather than chained prompts)
function renderSavGoalCards(){
  if(typeof _sanitizeSavingsGoals === 'function') _sanitizeSavingsGoals();
  const el = document.getElementById('savGoalCards');
  if(!el) return;
  const today = new Date().toISOString().slice(0,10);
  el.innerHTML = (D.savingsGoals||[]).map(g => {
    const pct = Math.min(100, ((g.current||0) / g.target) * 100);
    const done = pct >= 100;
    const ringColor = done ? 'var(--gr)' : 'var(--section-finance)';
    const hasPhoto = !!g.photoPath;
    // Hero: photo block when set, emoji otherwise. The photo div
    // gets data-goal-id so _hydrateGoalPhotos can attach the
    // signed URL after the sync paint.
    const heroHtml = hasPhoto
      ? '<div class="mz-goal-photo" data-goal-id="' + g.id + '" style="width:48px;height:48px;border-radius:10px;background:rgba(255,255,255,.05) center/cover no-repeat;flex-shrink:0;"></div>'
      : '<span style="font-size:1.5rem;flex-shrink:0;">' + g.emoji + '</span>';
    // Countdown chip — months remaining when targetDate set.
    let countdownHtml = '';
    if(g.targetDate && !done){
      const t = new Date(g.targetDate + 'T00:00:00');
      const n = new Date(today + 'T00:00:00');
      const daysLeft = Math.round((t - n) / 86400000);
      if(daysLeft < 0){
        countdownHtml = '<span class="mz-goal-chip mz-goal-chip--warn" style="font-size:.55rem;font-weight:800;background:rgba(251,113,133,.14);color:#fb7185;padding:.12rem .4rem;border-radius:5px;letter-spacing:.4px;">PAST DUE</span>';
      } else if(daysLeft < 60){
        countdownHtml = '<span class="mz-goal-chip" style="font-size:.55rem;font-weight:800;background:rgba(99,102,241,.14);color:#6366f1;padding:.12rem .4rem;border-radius:5px;letter-spacing:.4px;">' + daysLeft + ' DAYS LEFT</span>';
      } else {
        const monthsLeft = Math.round(daysLeft / 30);
        countdownHtml = '<span class="mz-goal-chip" style="font-size:.55rem;font-weight:800;background:rgba(99,102,241,.14);color:#6366f1;padding:.12rem .4rem;border-radius:5px;letter-spacing:.4px;">' + monthsLeft + ' MO LEFT</span>';
      }
    } else if(g.completedAt){
      countdownHtml = '<span class="mz-goal-chip" style="font-size:.55rem;font-weight:800;background:rgba(16,185,129,.16);color:#10b981;padding:.12rem .4rem;border-radius:5px;letter-spacing:.4px;">✓ ' + escapeHtml(g.completedAt.slice(0,7)) + '</span>';
    }
    // Action row — inline add form when this card is being edited,
    // standard buttons otherwise. The inline form keeps the user in
    // the same visual context and replaces the prompt() that lived
    // in addToGoal before Inc 5.
    let actionsHtml;
    if(_quickAddOpenId === g.id){
      actionsHtml = ''
        + '<div style="display:flex;gap:.32rem;align-items:center;">'
        +   '<input type="number" id="mzQuickAddInput_' + g.id + '" placeholder="$" step=".01" min=".01" style="flex:1;font-family:var(--fn);font-size:.85rem;padding:.45rem .65rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:var(--tx);" onkeydown="if(event.key===\'Enter\'){event.preventDefault();_quickAddSave(' + g.id + ');}else if(event.key===\'Escape\'){_quickAddCancel();}">'
        +   '<button class="btn bgr bs" onclick="_quickAddSave(' + g.id + ')">Save</button>'
        +   '<button class="btn bgh bs" onclick="_quickAddCancel()">Cancel</button>'
        + '</div>';
    } else {
      actionsHtml = ''
        + '<div style="display:flex;gap:.32rem;">'
        +   '<button class="btn bgr bs" style="flex:1;" onclick="addToGoal(' + g.id + ')">+ Add</button>'
        +   '<button class="btn bgh bs" onclick="editSavGoal(' + g.id + ')">✎</button>'
        +   '<button class="btn bda bs" onclick="delSavGoal(' + g.id + ')">✕</button>'
        + '</div>';
    }
    return '<div class="card" style="border-top:3px solid var(--section-finance);">'
      + '<div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.7rem;">'
      +   heroHtml
      +   '<div style="flex:1;min-width:0;">'
      +     '<div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;"><span style="font-weight:700;font-size:.95rem;line-height:1.2;">' + escapeHtml(g.name) + '</span>' + countdownHtml + '</div>'
      +     '<div style="font-size:.74rem;color:var(--tx2);margin-top:.15rem;font-family:var(--fn);">$' + (g.current||0).toLocaleString() + ' / $' + g.target.toLocaleString() + '</div>'
      +   '</div>'
      + '</div>'
      + '<div style="display:flex;justify-content:center;margin-bottom:.7rem;">'
      +   svgProgressRing(pct, 96, ringColor)
      + '</div>'
      + (done
          ? '<div style="text-align:center;font-size:.78rem;color:var(--gr);font-weight:700;margin-bottom:.6rem;">🎉 Goal reached!</div>'
          : '<div style="text-align:center;font-size:.72rem;color:var(--tx2);margin-bottom:.6rem;">$' + Math.max(0, g.target - (g.current||0)).toLocaleString() + ' to go</div>')
      + actionsHtml
      + '</div>';
  }).join('');
  // Hydrate hero photos asynchronously — the sync paint above writes
  // empty backgrounds for cards with photoPath; this fills them in
  // as createSignedUrl resolves.
  if(typeof _hydrateGoalPhotos === 'function') _hydrateGoalPhotos();
}

// SVG progress ring helper — Phase C-Finance. Renders a single ring with
// a centered percent label. Color and size are tunable.
function svgProgressRing(pct, size, color){
  const r = size/2 - 6;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, pct/100)) * c;
  const cx = size/2, cy = size/2;
  const fontSize = size >= 88 ? 19 : 14;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" role="img" aria-label="'+pct.toFixed(0)+'% complete">'
    + '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="6"/>'
    + '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+dash+' '+c+'" transform="rotate(-90 '+cx+' '+cy+')"/>'
    + '<text x="'+cx+'" y="'+(cy+fontSize*0.35)+'" text-anchor="middle" font-size="'+fontSize+'" font-weight="800" font-family="var(--fn)" fill="var(--tx)">'+pct.toFixed(0)+'%</text>'
    + '</svg>';
}

function renderSavingsTab(){
  const goals=D.savingsGoals||[];
  const ts=goals.reduce((a,g)=>a+(g.current||0),0);
  const tt=goals.reduce((a,g)=>a+(g.target||0),0);
  const pct=tt>0?Math.min(100,(ts/tt)*100):0;
  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  set('savTot','$'+ts.toLocaleString()); set('savGoalTot','$'+tt.toLocaleString());
  set('savNeed','$'+Math.max(0,tt-ts).toLocaleString()); set('savPct',pct.toFixed(1)+'%');
  const b=document.getElementById('savBigBar'); if(b) b.style.width=pct+'%';
  const sel=document.getElementById('qaGoal');
  if(sel) sel.innerHTML=goals.map(g=>`<option value="${g.id}">${escapeHtml(g.emoji)} ${escapeHtml(g.name)}</option>`).join('');
  const det=document.getElementById('savDetailCards'); if(!det) return;
  det.innerHTML=goals.map(g=>{
    const p=Math.min(100,((g.current||0)/g.target)*100);
    const col=p>=75?'var(--gr)':p>=40?'var(--c)':'var(--g)';
    return`<div class="card" style="border-top:3px solid ${col};">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;">
        <span style="font-size:1.35rem;">${g.emoji}</span>
        <div style="flex:1;"><div style="font-weight:800;font-size:.9rem;">${escapeHtml(g.name)}</div>
        <div style="font-size:.68rem;color:#c8d4e8;">$${Math.max(0,g.target-(g.current||0)).toLocaleString()} to go</div></div>
        <div style="font-family:var(--fn);font-size:.95rem;font-weight:700;color:${col};">${p.toFixed(0)}%</div>
      </div>
      <div class="pt" style="height:7px;margin-bottom:.6rem;"><div class="pf" style="background:${col};width:${p}%;"></div></div>
      <button class="btn bo bs" style="width:100%;color:${col};border-color:${col};" onclick="addToGoal(${g.id})">+ Add Money</button>
    </div>`;
  }).join('');
}

function quickAdd(){
  const sel=document.getElementById('qaGoal'); const amt=parseFloat(document.getElementById('qaAmt').value); const fb=document.getElementById('qaMsg');
  if(!sel||isNaN(amt)||amt<=0){if(fb) fb.textContent='Enter a valid amount';return;}
  const id=parseInt(sel.value); const g=(D.savingsGoals||[]).find(g=>g.id===id); if(!g) return;
  g.current=(g.current||0)+amt; document.getElementById('qaAmt').value='';
  save(); renderSavingsTab(); renderSavGoalCards(); updateFinSum();
  if(fb){fb.textContent=`✅ Added $${amt} to ${g.emoji} ${g.name}!`; setTimeout(()=>fb.textContent='',3000);}
}

// ═══════════════════════════════════════════════════════════════════
// Phase C-Finance additions — 2026-05-15
// Spending donut · Paycheck simulator. (Summary opener writes to
// finSum* IDs from updateFinSum above; SVG rings live in renderSavGoalCards.)
// ═══════════════════════════════════════════════════════════════════

// ── 1. SVG DONUT — monthly spending by category ────────────────────
// Maps transaction categories to 5 visual buckets per the user spec:
// Food · Entertainment · Clothing · Transport · Other.
const FIN_DONUT_BUCKETS = {
  'Food / Groceries': 'Food',
  'Entertainment':    'Entertainment',
  'Clothing':         'Clothing',
  'Gas':              'Transport',
  'Car':              'Transport'
};
const FIN_DONUT_COLORS = {
  Food:          '#f59e0b',
  Entertainment: '#c084fc',
  Clothing:      '#f472b6',
  Transport:     '#38bdf8',
  Other:         '#94a3b8'
};
const FIN_DONUT_ORDER = ['Food','Entertainment','Clothing','Transport','Other'];

function renderSpendingDonut(){
  const el = document.getElementById('spendingDonut');
  if(!el) return;
  const now = new Date();
  const ym = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  const sums = {Food:0, Entertainment:0, Clothing:0, Transport:0, Other:0};
  (D.transactions||[]).forEach(t => {
    if(t.type !== 'expense' || !t.date || !t.date.startsWith(ym)) return;
    const bucket = FIN_DONUT_BUCKETS[t.cat] || 'Other';
    sums[bucket] += (t.amt || 0);
  });
  const total = FIN_DONUT_ORDER.reduce((a,k) => a + sums[k], 0);
  if(total === 0){
    el.innerHTML = '<div style="text-align:center;padding:2rem 1rem;color:var(--tx2);font-size:.85rem;line-height:1.6;">No expenses logged this month yet.<br><span style="font-size:.75rem;color:var(--tx3);">Log a transaction on the Transactions tab to see this chart fill in.</span></div>';
    return;
  }
  const size = 180, r = 70, cx = size/2, cy = size/2, sw = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let segs = '';
  FIN_DONUT_ORDER.forEach(k => {
    if(sums[k] <= 0) return;
    const dash = (sums[k] / total) * circ;
    segs += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none"'
      + ' stroke="'+FIN_DONUT_COLORS[k]+'" stroke-width="'+sw+'"'
      + ' stroke-dasharray="'+dash+' '+(circ-dash)+'"'
      + ' stroke-dashoffset="'+(-offset)+'"'
      + ' transform="rotate(-90 '+cx+' '+cy+')"'
      + ' style="cursor:pointer;"'
      + ' onclick="finDonutOpenCategory(\''+k+'\')"'
      + '><title>'+k+': $'+sums[k].toFixed(2)+'</title></circle>';
    offset += dash;
  });
  const centerHtml = '<text x="'+cx+'" y="'+(cy-2)+'" text-anchor="middle" fill="var(--tx)" font-size="22" font-weight="800" font-family="var(--fn)">$'+total.toFixed(0)+'</text>'
    + '<text x="'+cx+'" y="'+(cy+18)+'" text-anchor="middle" fill="var(--tx2)" font-size="10" font-weight="600" letter-spacing="1">THIS MONTH</text>';
  const legend = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-top:.7rem;">'
    + FIN_DONUT_ORDER.filter(k => sums[k] > 0).map(k =>
        '<button type="button" onclick="finDonutOpenCategory(\''+k+'\')" style="display:flex;align-items:center;gap:.45rem;font-size:.78rem;cursor:pointer;background:none;border:none;padding:.25rem 0;color:var(--tx);text-align:left;font-family:var(--fm);">'
        + '<span style="width:10px;height:10px;background:'+FIN_DONUT_COLORS[k]+';border-radius:3px;flex-shrink:0;"></span>'
        + '<span style="color:var(--tx2);">'+k+'</span>'
        + '<span style="margin-left:auto;font-weight:700;color:var(--tx);font-family:var(--fn);">$'+sums[k].toFixed(0)+'</span>'
        + '</button>'
      ).join('')
    + '</div>';
  el.innerHTML = '<div style="display:flex;justify-content:center;">'
    + '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" role="img" aria-label="Spending by category">'
    + segs + centerHtml
    + '</svg></div>' + legend;
}

function finDonutOpenCategory(bucket){
  // Phase C-Finance v1: tap → navigate to the Transactions tab and filter to
  // expenses. A future iteration can add category-level filtering on top of
  // the existing _txFilter type/all switch; for now the user lands where
  // they can see their expense list.
  _txFilter = 'expense';
  const tabs = document.querySelectorAll('.moneyTabs .tab');
  // Find the Transactions tab (index 2 in the current 7-tab list)
  let txTab = null;
  tabs.forEach(t => { if(t.textContent && t.textContent.indexOf('Transactions') !== -1) txTab = t; });
  if(txTab) mTab('tx', txTab);
  // Also light up the Expenses filter button for clarity
  const filterBtns = document.querySelectorAll('.txf');
  filterBtns.forEach(b => b.classList.remove('active'));
  filterBtns.forEach(b => { if(b.textContent && b.textContent.trim() === 'Expenses') b.classList.add('active'); });
  showToast('Showing this month\'s '+bucket.toLowerCase()+' & other expenses');
}

// ── 2. FIRST PAYCHECK SIMULATOR ────────────────────────────────────
// Spec: wage + hours/week → gross, simplified fed (15%) + state (5%),
// net, and a 50/30/20 split on the net. Educational copy explains why
// the first check feels smaller than expected.
function calcPaycheckSim(){
  const wage  = parseFloat((document.getElementById('paySimWage')||{}).value) || 0;
  const hours = parseFloat((document.getElementById('paySimHours')||{}).value) || 0;
  const el = document.getElementById('paySimOutput');
  if(!el) return;
  if(wage <= 0 || hours <= 0){
    el.innerHTML = '<div style="text-align:center;padding:1.2rem 1rem;color:var(--tx2);font-size:.85rem;line-height:1.6;">Enter your wage and hours to see the breakdown.<br><span style="font-size:.75rem;color:var(--tx3);">This is a simplified estimate — your actual paycheck will also have FICA and possibly insurance/401k.</span></div>';
    return;
  }
  const gross = wage * hours;
  const fed   = gross * 0.15;
  const state = gross * 0.05;
  const net   = gross - fed - state;
  const needs = net * 0.5;
  const wants = net * 0.3;
  const sav   = net * 0.2;

  el.innerHTML =
    '<div style="background:linear-gradient(135deg,rgba(22,163,74,.08),rgba(34,211,153,.05));border:1px solid rgba(22,163,74,.18);border-left:4px solid var(--section-finance);border-radius:14px;padding:1rem 1.2rem;margin-bottom:.8rem;">'
    + '<div style="font-family:var(--fh);font-size:.85rem;letter-spacing:.06em;color:var(--section-finance);margin-bottom:.5rem;">YOUR WEEKLY PAYCHECK</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;">'
    +   '<div style="padding:.6rem .8rem;background:rgba(255,255,255,.04);border-radius:10px;">'
    +     '<div style="font-size:.62rem;color:var(--tx2);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Gross pay</div>'
    +     '<div style="font-family:var(--fn);font-size:1.3rem;font-weight:800;color:var(--tx);">$'+gross.toFixed(2)+'</div>'
    +   '</div>'
    +   '<div style="padding:.6rem .8rem;background:rgba(255,255,255,.04);border-radius:10px;">'
    +     '<div style="font-size:.62rem;color:#f87171;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Federal (~15%)</div>'
    +     '<div style="font-family:var(--fn);font-size:1.3rem;font-weight:800;color:#f87171;">-$'+fed.toFixed(2)+'</div>'
    +   '</div>'
    +   '<div style="padding:.6rem .8rem;background:rgba(255,255,255,.04);border-radius:10px;">'
    +     '<div style="font-size:.62rem;color:#fb923c;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">State (~5%)</div>'
    +     '<div style="font-family:var(--fn);font-size:1.3rem;font-weight:800;color:#fb923c;">-$'+state.toFixed(2)+'</div>'
    +   '</div>'
    +   '<div style="padding:.6rem .8rem;background:rgba(22,163,74,.12);border:1px solid rgba(22,163,74,.3);border-radius:10px;">'
    +     '<div style="font-size:.62rem;color:var(--section-finance);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Take-home</div>'
    +     '<div style="font-family:var(--fn);font-size:1.45rem;font-weight:800;color:var(--section-finance);">$'+net.toFixed(2)+'</div>'
    +   '</div>'
    + '</div></div>'
    + '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:1rem 1.2rem;margin-bottom:.8rem;">'
    + '<div style="font-family:var(--fh);font-size:.85rem;letter-spacing:.06em;color:var(--tx);margin-bottom:.5rem;">SUGGESTED 50 / 30 / 20 SPLIT</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem;">'
    +   '<div style="padding:.55rem .7rem;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);border-radius:9px;text-align:center;">'
    +     '<div style="font-size:.6rem;color:#c8d4e8;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Needs 50%</div>'
    +     '<div style="font-family:var(--fn);font-size:1.1rem;font-weight:800;color:var(--c);">$'+needs.toFixed(2)+'</div>'
    +   '</div>'
    +   '<div style="padding:.55rem .7rem;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:9px;text-align:center;">'
    +     '<div style="font-size:.6rem;color:#c8d4e8;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Wants 30%</div>'
    +     '<div style="font-family:var(--fn);font-size:1.1rem;font-weight:800;color:var(--g);">$'+wants.toFixed(2)+'</div>'
    +   '</div>'
    +   '<div style="padding:.55rem .7rem;background:rgba(22,163,74,.1);border:1px solid rgba(22,163,74,.25);border-radius:9px;text-align:center;">'
    +     '<div style="font-size:.6rem;color:#c8d4e8;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Savings 20%</div>'
    +     '<div style="font-family:var(--fn);font-size:1.1rem;font-weight:800;color:var(--section-finance);">$'+sav.toFixed(2)+'</div>'
    +   '</div>'
    + '</div></div>'
    + '<div style="background:rgba(56,189,248,.05);border:1px solid rgba(56,189,248,.15);border-radius:14px;padding:1rem 1.2rem;font-size:.82rem;color:var(--tx2);line-height:1.7;">'
    +   '<b style="color:var(--tx);">Your first paycheck will feel smaller than you expect — here\'s why.</b> '
    +   'Taxes are taken out before the money ever reaches you. The federal and state percentages here are simplified estimates; your real W-2 paycheck will also have FICA '
    +   '(Social Security + Medicare, ~7.65%), and might have health insurance or 401(k) contributions deducted on top. The take-home above is roughly right for a teen earning under ~$45k a year. '
    +   '<b style="color:var(--tx);">Always plan on net, never gross.</b>'
    + '</div>';
}

// ════════════════════════════════════════════════════════════════
// Tab 2 Increment 2 — Transactions sub-tab build-out
// ════════════════════════════════════════════════════════════════
//
// Visual + interaction layer for #mt-tx. JSONB-first reads from
// D.transactions; dual-write to public.money_transactions via the
// _mirrorMoneyToCloud helper in sync.js (fires on every cloudSync,
// 2s debounced). Per Phase 1 of the PIN -> stable-id decouple
// (v249), profile_id in the mirror uses _pidOf(activeProfile).
//
// Adds:
//   - MONEY_CAT_EMOJI single source of truth for category emoji
//   - segmented income / expense toggle that drives a hidden #txType
//   - emoji-chip category picker that drives a hidden #txCat
//   - month-grouped renderer with --mz-accent / --mz-coral amounts
//   - filter chips (All / Income / Expense) with live counts
//   - debounced search across description + category
//   - CSV export (date, description, category, type, amount)

const MONEY_CAT_EMOJI = {
  'Food':           '🍔',
  'Groceries':      '🛒',
  'Entertainment':  '🎮',
  'School':         '📚',
  'Clothes':        '👕',
  'Transport':      '🚗',
  'Health':         '🏥',
  'Gifts':          '🎁',
  'Savings':        '💚',
  'Tithe':          '⛪',
  'Job':            '💼',
  'Side Hustle':    '🎵',
  'Family':         '👪',
  'Other':          '📌'
};
const MONEY_CATEGORIES = Object.keys(MONEY_CAT_EMOJI);

// Module-scoped UI state. _txFilter is the legacy var (data.js) and
// is reused so filterTx() stays back-compat. _moneyTxSearch is new.
let _moneyTxSearch     = '';
let _moneyTxActiveType = 'expense';
let _moneyTxActiveCat  = 'Other';

// ─── add-form interactions ────────────────────────────────────────

function _moneyTxSetType(t, btn){
  if(t !== 'income' && t !== 'expense') return;
  _moneyTxActiveType = t;
  const hidden = document.getElementById('txType');
  if(hidden) hidden.value = t;
  // Sync the segmented toggle state + ARIA so screen readers
  // report the right selection (the UX reviewer flagged this —
  // aria-selected was previously only set on the initial markup
  // and never updated as the user clicked between options).
  document.querySelectorAll('.mz-tx-toggle__btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  if(btn){
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  }
}

function _moneyTxSetCat(c, btn){
  if(!MONEY_CAT_EMOJI[c]) return;
  _moneyTxActiveCat = c;
  const hidden = document.getElementById('txCat');
  if(hidden) hidden.value = c;
  document.querySelectorAll('.mz-tx-catchip').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function _moneyRenderCatPicker(){
  const el = document.getElementById('txCatGrid');
  if(!el) return;
  el.innerHTML = MONEY_CATEGORIES.map(c => `
    <button type="button"
            class="mz-tx-catchip${c === _moneyTxActiveCat ? ' active' : ''}"
            onclick="_moneyTxSetCat('${c}', this)"
            aria-pressed="${c === _moneyTxActiveCat ? 'true' : 'false'}">
      <span class="mz-tx-catchip__emoji" aria-hidden="true">${MONEY_CAT_EMOJI[c]}</span>
      <span class="mz-tx-catchip__label">${escapeHtml(c)}</span>
    </button>`).join('');
}

// ─── list filter + search ────────────────────────────────────────

const _MONEY_TX_FILTERS = [
  { id:'all',     label:'All',     match: t => true },
  { id:'income',  label:'Income',  match: t => t.type === 'income' },
  { id:'expense', label:'Expense', match: t => t.type === 'expense' }
];

function _moneyTxSetFilter(id, btn){
  _txFilter = id;
  document.querySelectorAll('.mz-tx-chip').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  _moneyRenderTransactions();
}

function _moneyTxSetSearch(input){
  _moneyTxSearch = String((input && input.value) || '').trim().toLowerCase();
  _moneyRenderTransactions();
}

// ─── month-grouped renderer ──────────────────────────────────────

function _moneyRenderTransactions(){
  const root = document.getElementById('mzTxList');
  if(!root) return;
  _moneyRenderCatPicker();

  const list = (D.transactions || []).slice();

  // Filter chip count badges — computed from the FULL list so
  // counts represent the dataset, not the current filtered view.
  _MONEY_TX_FILTERS.forEach(f => {
    const el = document.getElementById('mzTxChipN_' + f.id);
    if(el) el.textContent = list.filter(t => t && f.match(t)).length;
  });

  // Apply chip filter. Legacy 'savings' / 'transfer' entries
  // (pre-Inc-1) appear under 'all' but not under income/expense —
  // accurate to the data, no silent reclassification.
  const activeFilter = _MONEY_TX_FILTERS.find(f => f.id === _txFilter) || _MONEY_TX_FILTERS[0];
  let rows = list.filter(t => t && activeFilter.match(t));

  // Free-text search across description + category.
  if(_moneyTxSearch){
    rows = rows.filter(t =>
      (t.name || '').toLowerCase().includes(_moneyTxSearch)
      || (t.cat || '').toLowerCase().includes(_moneyTxSearch)
    );
  }

  // Newest-first sort. Ties broken by Date.now() id.
  rows.sort((a,b) =>
    (b.date || '').localeCompare(a.date || '')
    || (b.id || 0) - (a.id || 0)
  );

  if(!rows.length){
    root.innerHTML = '<div class="mz-tx-empty">No transactions match. Log one above to start your ledger.</div>';
    return;
  }

  // Group by YYYY-MM (newest month first).
  const groups = {};
  rows.forEach(t => {
    const ym = (t.date || '0000-00').slice(0,7);
    if(!groups[ym]) groups[ym] = [];
    groups[ym].push(t);
  });
  const ymKeys = Object.keys(groups).sort().reverse();

  const monthLabel = ym => {
    if(ym === '0000-00') return 'Unknown date';
    const [y, m] = ym.split('-');
    const dt = new Date(+y, +m - 1, 1);
    return dt.toLocaleDateString('en', { month:'long', year:'numeric' });
  };

  root.innerHTML = ymKeys.map(ym => {
    const items = groups[ym].map(t => {
      const emoji = MONEY_CAT_EMOJI[t.cat] || '📌';
      const amt   = Number.isFinite(+t.amt) ? +t.amt : 0;
      const sign  = t.type === 'income' ? '+' : '-';
      const amtClass = t.type === 'income'  ? 'mz-tx-row__amt mz-tx-row__amt--inc'
                    : t.type === 'expense' ? 'mz-tx-row__amt mz-tx-row__amt--exp'
                    : 'mz-tx-row__amt mz-tx-row__amt--neutral';
      return `
        <div class="mz-tx-row">
          <div class="mz-tx-row__emoji">${emoji}</div>
          <div class="mz-tx-row__main">
            <div class="mz-tx-row__name">${escapeHtml(t.name || 'Transaction')}</div>
            <div class="mz-tx-row__meta">
              <span class="mz-tx-row__date">${escapeHtml(t.date || '')}</span>
              <span class="mz-tx-row__cat">${escapeHtml(t.cat || 'Other')}</span>
            </div>
          </div>
          <div class="${amtClass}">${sign}$${amt.toFixed(2)}</div>
          <div class="mz-tx-row__actions">
            <button class="mz-tx-row__act" onclick="editTx(${t.id})" aria-label="Edit">✎</button>
            <button class="mz-tx-row__act mz-tx-row__act--del" onclick="deleteTx(${t.id})" aria-label="Delete">✕</button>
          </div>
        </div>`;
    }).join('');
    return `
      <div class="mz-tx-month">
        <div class="mz-tx-month__title">${monthLabel(ym)} <span class="mz-tx-month__n">${groups[ym].length}</span></div>
        ${items}
      </div>`;
  }).join('');
}

// ─── CSV export ──────────────────────────────────────────────────
//
// RFC 4180 escaping: wrap any value containing comma / quote /
// newline in double quotes and double any internal quotes. Output
// uses \r\n line endings (Excel + Numbers + Sheets all accept).

function _moneyTxExportCsv(){
  const list = (D.transactions || []).slice();
  if(!list.length){ showToast('No transactions to export'); return; }
  list.sort((a,b) =>
    (b.date || '').localeCompare(a.date || '')
    || (b.id || 0) - (a.id || 0)
  );
  const esc = v => {
    if(v === null || v === undefined) return '';
    const s = String(v);
    if(/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const header = 'date,description,category,type,amount';
  const rows = list.map(t => [
    t.date || '',
    t.name || '',
    t.cat  || '',
    t.type || '',
    Number.isFinite(+t.amt) ? (+t.amt).toFixed(2) : ''
  ].map(esc).join(','));
  const csv = [header].concat(rows).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const stamp = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = 'transactions_' + stamp + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Exported ' + list.length + ' transactions ✓');
}

// ════════════════════════════════════════════════════════════════
// Tab 2 Increment 3 — Allowance sub-tab + edit-mode for Tx
// ════════════════════════════════════════════════════════════════
//
// Allowance is a parent-set recurring credit that flows into
// D.transactions as a regular income row with category='Allowance'.
// No new table — credits live in money_transactions alongside
// every other income row (plan decision D2).
//
// Auto-credit fires ONLY from mTab('allowance') — never from
// DOMContentLoaded (that path runs before cloudLoad completes and
// would credit stale D, then get clobbered by the cloud restore).
// Two-layer idempotency guard:
//   1) D.allowanceConfig.lastCreditedOn (cheap fast path)
//   2) per-date scan of D.transactions for an existing
//      category='Allowance' entry on the candidate date (survives
//      LS clear / fresh device / config drift)
//
// Catch-up cap = ALLOWANCE_MAX_CATCHUP. A kid returning from a
// long absence gets at most this many backfilled credits, not the
// full backlog.
//
// Edit-mode (scope E from the UX review) replaces the prompt()
// path in editTx with form-population + a "Save Changes" button.
// State lives in _moneyTxEditingId; addTx() above branches on it.

const ALLOWANCE_CATEGORY     = 'Allowance';
const ALLOWANCE_MAX_CATCHUP  = 4;
const ALLOWANCE_FREQUENCIES  = ['weekly','biweekly','monthly'];
const ALLOWANCE_DAY_NAMES    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const ALLOWANCE_DAY_SHORT    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// Module state — toast fires at most once per page load on the
// first credit (subsequent visits this session stay quiet).
let _allowanceToastSeen = false;

// Tx edit-mode — null when not editing, id of the entry under edit
// otherwise. addTx() branches on this; editTx() sets it via
// _moneyTxBeginEdit.
let _moneyTxEditingId = null;

// ─── Local date helpers ──────────────────────────────────────────
// LOCAL time — credit days must align with the kid's calendar
// (toISOString silently shifts to UTC).
function _mzDateStr(d){
  const y  = d.getFullYear();
  const m  = String(d.getMonth()+1).padStart(2,'0');
  const da = String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+da;
}
function _mzToday(){ return _mzDateStr(new Date()); }
function _mzDateFromStr(s){
  // Parse YYYY-MM-DD as local midnight (NOT UTC).
  if(!s || typeof s !== 'string') return null;
  const parts = s.split('-');
  if(parts.length !== 3) return null;
  return new Date(+parts[0], (+parts[1]) - 1, +parts[2]);
}
function _mzAddDays(s, n){
  const d = _mzDateFromStr(s); if(!d) return s;
  d.setDate(d.getDate() + n);
  return _mzDateStr(d);
}
function _mzDaysBetween(aStr, bStr){
  const a = _mzDateFromStr(aStr); const b = _mzDateFromStr(bStr);
  if(!a || !b) return 0;
  return Math.round((b - a) / 86400000);
}

// ─── Config sanitize / accessors ─────────────────────────────────
function _allowanceConfig(){
  if(!D.allowanceConfig || typeof D.allowanceConfig !== 'object' || Array.isArray(D.allowanceConfig)){
    D.allowanceConfig = { amount:0, frequency:'weekly', dayOfWeek:5, dayOfMonth:1, anchorDate:'', lastCreditedOn:null, enabled:false };
  }
  const c = D.allowanceConfig;
  if(typeof c.amount !== 'number' || !isFinite(c.amount) || c.amount < 0) c.amount = 0;
  if(ALLOWANCE_FREQUENCIES.indexOf(c.frequency) === -1) c.frequency = 'weekly';
  if(typeof c.dayOfWeek !== 'number' || c.dayOfWeek < 0 || c.dayOfWeek > 6) c.dayOfWeek = 5;
  if(typeof c.dayOfMonth !== 'number' || c.dayOfMonth < 1 || c.dayOfMonth > 31) c.dayOfMonth = 1;
  if(typeof c.anchorDate !== 'string') c.anchorDate = '';
  if(typeof c.lastCreditedOn !== 'string' && c.lastCreditedOn !== null) c.lastCreditedOn = null;
  if(typeof c.enabled !== 'boolean') c.enabled = false;
  return c;
}

// True if a given YYYY-MM-DD is a "due date" under the config.
function _allowanceIsDueDate(cfg, dateStr){
  const d = _mzDateFromStr(dateStr); if(!d) return false;
  if(cfg.frequency === 'weekly'){
    return d.getDay() === cfg.dayOfWeek;
  }
  if(cfg.frequency === 'biweekly'){
    if(d.getDay() !== cfg.dayOfWeek) return false;
    // anchorDate-relative — only every other matching dayOfWeek
    // counts. If anchorDate is empty, fall through to weekly.
    if(!cfg.anchorDate) return true;
    const diff = _mzDaysBetween(cfg.anchorDate, dateStr);
    if(diff < 0) return false;
    return (diff % 14) === 0;
  }
  if(cfg.frequency === 'monthly'){
    return d.getDate() === cfg.dayOfMonth;
  }
  return false;
}

// Returns sorted array of YYYY-MM-DD strings: every due date >
// lastCreditedOn AND <= today. Capped at ALLOWANCE_MAX_CATCHUP so
// a long app-absence can't grant months of allowance in one wake.
function _allowanceDueDatesUpTo(cfg, todayStr){
  if(!cfg.enabled || cfg.amount <= 0) return [];
  const today = todayStr || _mzToday();
  // Start the walk one day after the last credit. If no last
  // credit exists yet, treat "yesterday" as the floor so today is
  // included if today is a due date — first-ever credit lands
  // promptly without backfilling history.
  let cursor = cfg.lastCreditedOn ? _mzAddDays(cfg.lastCreditedOn, 1) : _mzAddDays(today, -1);
  const out = [];
  // Walk forward day by day. Guard against runaway loops by
  // capping the scan at MAX_CATCHUP * 31 days (more than enough
  // for monthly cadence with full catch-up).
  let safety = ALLOWANCE_MAX_CATCHUP * 31 + 7;
  while(safety-- > 0 && cursor <= today){
    if(_allowanceIsDueDate(cfg, cursor)){
      out.push(cursor);
      if(out.length >= ALLOWANCE_MAX_CATCHUP) break;
    }
    cursor = _mzAddDays(cursor, 1);
  }
  return out;
}

// Compute the next due date strictly AFTER the given date. Used by
// the renderer to show "next credit: in N days".
function _allowanceNextAfter(cfg, fromStr){
  if(!cfg.enabled || cfg.amount <= 0) return null;
  const from = fromStr || _mzToday();
  let cursor = _mzAddDays(from, 1);
  let safety = 366;
  while(safety-- > 0){
    if(_allowanceIsDueDate(cfg, cursor)) return cursor;
    cursor = _mzAddDays(cursor, 1);
  }
  return null;
}

// Double-guard: even if cfg.lastCreditedOn drifted (LS clear /
// fresh device / hand-edit), refuse to insert a credit on a date
// that already has a Allowance/income row in D.transactions.
function _allowanceAlreadyOnDate(dateStr){
  const log = Array.isArray(D.transactions) ? D.transactions : [];
  return log.some(t => t
    && t.cat === ALLOWANCE_CATEGORY
    && t.type === 'income'
    && t.date === dateStr);
}

// Core auto-credit. Fires only from mTab('allowance') (which runs
// AFTER cloudLoad has resolved and D is settled). Idempotent.
function _maybeCreditAllowance(){
  const cfg = _allowanceConfig();
  if(!cfg.enabled || cfg.amount <= 0) return;

  const dueDates = _allowanceDueDatesUpTo(cfg, _mzToday());
  if(!dueDates.length) return;

  if(!D.transactions) D.transactions = [];

  let credited = 0;
  let advanceLastTo = cfg.lastCreditedOn;
  const amt = +(+cfg.amount).toFixed(2);

  for(let i=0;i<dueDates.length;i++){
    const d = dueDates[i];
    if(_allowanceAlreadyOnDate(d)){
      // Already credited via a different path (cloud restore, hand
      // edit, manual entry). Advance lastCreditedOn so the cheap
      // fast-path catches it next time but DON'T insert again.
      advanceLastTo = d;
      continue;
    }
    D.transactions.unshift({
      id:   Date.now() + i,    // unique-ish per credit in the batch
      name: 'Allowance',
      amt:  amt,
      type: 'income',
      cat:  ALLOWANCE_CATEGORY,
      date: d
    });
    advanceLastTo = d;
    credited++;
  }

  cfg.lastCreditedOn = advanceLastTo;
  save();

  if(credited > 0 && !_allowanceToastSeen){
    _allowanceToastSeen = true;
    const total = credited * amt;
    showToast(credited === 1
      ? '+$' + amt.toFixed(2) + ' allowance landed 💵'
      : credited + ' allowance credits — +$' + total.toFixed(2) + ' 💵');
  }
}

// ─── Kid-side renderer for #mt-allowance ─────────────────────────
//
// Read-only schedule pill + countdown + recent credits + this-
// month total. Config UI lives in Parent Hub > Rewards
// (renderPhAllowance below) — never editable from this surface.
function renderAllowance(){
  // Auto-credit first so the history immediately reflects today's
  // credit if today happens to be a due date.
  _maybeCreditAllowance();

  const root = document.getElementById('mt-allowance');
  if(!root) return;
  const cfg = _allowanceConfig();

  // Recent credits (last 8) from D.transactions filtered by
  // category=Allowance, newest first.
  const allowanceLog = (D.transactions || [])
    .filter(t => t && t.cat === ALLOWANCE_CATEGORY && t.type === 'income')
    .slice()
    .sort((a,b) => (b.date || '').localeCompare(a.date || '') || (b.id || 0) - (a.id || 0));

  const recent = allowanceLog.slice(0, 8);

  // This-month total (sum of credits where date starts with current YYYY-MM).
  const today = _mzToday();
  const ym = today.slice(0, 7);
  const monthTotal = allowanceLog
    .filter(t => (t.date || '').startsWith(ym))
    .reduce((sum, t) => sum + (Number.isFinite(+t.amt) ? +t.amt : 0), 0);

  // Hero copy
  let heroHtml;
  if(!cfg.enabled || cfg.amount <= 0){
    // UX reviewer fix — kid-forward copy. The original phrasing
    // positioned the kid as waiting for a parent action; the
    // reframe names the upcoming benefit + invites them to ask.
    heroHtml = `
      <div class="mz-allow-hero mz-allow-hero--off">
        <div class="mz-allow-hero__icon">💵</div>
        <div class="mz-allow-hero__title">Your allowance starts here</div>
        <div class="mz-allow-hero__body">Once your parent activates a schedule in Parent Hub, credits land automatically every pay day. Ask them to switch it on — your future self will thank you.</div>
      </div>`;
  } else {
    const dayName = cfg.frequency === 'monthly'
      ? 'the ' + cfg.dayOfMonth + (function(n){ var s=['th','st','nd','rd'],v=n%100; return s[(v-20)%10]||s[v]||s[0]; })(cfg.dayOfMonth) + ' of each month'
      : (cfg.frequency === 'biweekly' ? 'every other ' : 'every ') + ALLOWANCE_DAY_NAMES[cfg.dayOfWeek];
    const next = _allowanceNextAfter(cfg, today);
    const nextLabel = next
      ? (function(){
          const days = _mzDaysBetween(today, next);
          if(days === 0) return 'today';
          if(days === 1) return 'tomorrow';
          if(days < 7)   return 'in ' + days + ' days';
          const d = _mzDateFromStr(next);
          return 'on ' + d.toLocaleDateString('en', { month:'short', day:'numeric' });
        })()
      : '—';
    heroHtml = `
      <div class="mz-allow-hero">
        <div class="mz-allow-hero__row">
          <div class="mz-allow-hero__amt">$${(+cfg.amount).toFixed(2)}</div>
          <div class="mz-allow-hero__cadence">${escapeHtml(dayName)}</div>
        </div>
        <div class="mz-allow-hero__next">
          <span class="mz-allow-hero__next-label">Next credit</span>
          <span class="mz-allow-hero__next-val">${escapeHtml(nextLabel)}</span>
        </div>
      </div>`;
  }

  // This-month chip
  const monthChipHtml = monthTotal > 0
    ? `<div class="mz-allow-monthchip">📅 $${monthTotal.toFixed(2)} received this ${(_mzDateFromStr(today)||new Date()).toLocaleDateString('en',{month:'long'})}</div>`
    : '';

  // History list
  let historyHtml;
  if(!recent.length){
    historyHtml = '<div class="mz-allow-empty">No allowance credits yet. The first one lands on the next scheduled day.</div>';
  } else {
    historyHtml = recent.map(t => {
      const dt = _mzDateFromStr(t.date);
      const dateLabel = dt
        ? dt.toLocaleDateString('en', { month:'short', day:'numeric', year:'numeric' })
        : (t.date || '');
      return `
        <div class="mz-allow-row">
          <div class="mz-allow-row__emoji">💵</div>
          <div class="mz-allow-row__main">
            <div class="mz-allow-row__name">Allowance</div>
            <div class="mz-allow-row__date">${escapeHtml(dateLabel)}</div>
          </div>
          <div class="mz-allow-row__amt">+$${(+t.amt || 0).toFixed(2)}</div>
        </div>`;
    }).join('');
  }

  root.innerHTML = `
    <div class="mz-section-title mz-section-title--amber">💰 ALLOWANCE</div>
    ${heroHtml}
    ${monthChipHtml}
    <div class="mz-section-title" style="margin-top:1.1rem;">RECENT CREDITS</div>
    <div class="mz-allow-list">${historyHtml}</div>
    <div class="mz-allow-hint">⚙️ Allowance is set by a parent in <b>Parent Hub → Rewards</b>.</div>
  `;
}

// ─── Parent-Hub config card — #parentAllowanceArea ───────────────
//
// Solo mode: one editable form for D.allowanceConfig.
// Multi-kid: one card per non-parent profile, each editing
// p.data.allowanceConfig and persisted via saveProfiles().
function renderPhAllowance(){
  const root = document.getElementById('parentAllowanceArea');
  if(!root) return;

  const profiles = (typeof _profiles !== 'undefined' && Array.isArray(_profiles)) ? _profiles : [];
  const kids = profiles.filter(p => p && p.isParent === false);

  let cardsHtml;
  if(kids.length === 0){
    // Solo mode (or pre-multi-profile state) — edit D.allowanceConfig directly.
    cardsHtml = _allowancePhCardHtml(null, _allowanceConfig());
  } else {
    cardsHtml = kids.map(kid => {
      // Each kid's config lives on their per-profile data blob. If
      // the active profile IS the kid, D.allowanceConfig is the
      // canonical copy; otherwise p.data.allowanceConfig is.
      let cfg;
      if(typeof _activeProfileId !== 'undefined' && kid.id === _activeProfileId){
        cfg = _allowanceConfig();
      } else {
        const pd = (kid.data && typeof kid.data === 'object') ? kid.data : (kid.data = {});
        if(!pd.allowanceConfig || typeof pd.allowanceConfig !== 'object' || Array.isArray(pd.allowanceConfig)){
          pd.allowanceConfig = { amount:0, frequency:'weekly', dayOfWeek:5, dayOfMonth:1, anchorDate:'', lastCreditedOn:null, enabled:false };
        }
        cfg = pd.allowanceConfig;
      }
      return _allowancePhCardHtml(kid, cfg);
    }).join('');
  }

  root.innerHTML = `
    <div class="mz-allow-ph">
      <div class="mz-allow-ph__title">💵 ALLOWANCE</div>
      <div class="mz-allow-ph__sub">Set a recurring credit per child. The app auto-inserts the income row on each pay day.</div>
      ${cardsHtml}
    </div>
  `;
}

// Builds the editable card HTML for one profile (or solo). profile
// is null in solo mode. Inputs carry data-attributes so the change
// handlers can scope writes to the right profile.
function _allowancePhCardHtml(profile, cfg){
  const pid = profile ? String(profile.id) : '';
  const label = profile ? (profile.name || 'Child') : 'You';
  const enabledTxt = cfg.enabled ? 'ON' : 'OFF';
  const wkOpts = ALLOWANCE_DAY_NAMES.map((n,i) =>
    `<option value="${i}"${i === cfg.dayOfWeek ? ' selected' : ''}>${n}</option>`).join('');
  const monthOpts = (function(){
    let out = '';
    for(let i=1;i<=31;i++) out += `<option value="${i}"${i === cfg.dayOfMonth ? ' selected' : ''}>${i}</option>`;
    return out;
  })();
  const dayPickerHtml =
    (cfg.frequency === 'monthly')
      ? `<label>Day of month <select onchange="_allowanceFormChange('${pid}','dayOfMonth',this.value)">${monthOpts}</select></label>`
      : `<label>Day of week <select onchange="_allowanceFormChange('${pid}','dayOfWeek',this.value)">${wkOpts}</select></label>`;

  return `
    <div class="mz-allow-card">
      <div class="mz-allow-card__head">
        <div class="mz-allow-card__name">${escapeHtml(label)}</div>
        <button type="button"
                role="switch"
                aria-checked="${cfg.enabled ? 'true' : 'false'}"
                aria-label="Allowance ${cfg.enabled ? 'enabled' : 'disabled'} for ${escapeHtml(label)}"
                class="mz-allow-card__toggle ${cfg.enabled ? 'on' : 'off'}"
                onclick="_allowanceFormToggle('${pid}')">${enabledTxt}</button>
      </div>
      <div class="mz-allow-card__grid">
        <label>Amount ($)
          <input type="number" min="0" step="0.25" value="${cfg.amount || ''}"
                 oninput="_allowanceFormChange('${pid}','amount',this.value)">
        </label>
        <label>Frequency
          <select onchange="_allowanceFormChange('${pid}','frequency',this.value)">
            <option value="weekly"${cfg.frequency === 'weekly' ? ' selected' : ''}>Weekly</option>
            <option value="biweekly"${cfg.frequency === 'biweekly' ? ' selected' : ''}>Every 2 weeks</option>
            <option value="monthly"${cfg.frequency === 'monthly' ? ' selected' : ''}>Monthly</option>
          </select>
        </label>
        ${dayPickerHtml}
      </div>
    </div>
  `;
}

// Mutates the right config blob (solo D.* vs kid p.data.*), saves,
// and re-renders both the Parent Hub card AND the kid's #mt-allowance
// if it happens to be visible. pidStr is '' for solo mode.
function _allowanceResolveConfig(pidStr){
  if(!pidStr){
    return _allowanceConfig();
  }
  // Multi-kid path — find the profile and return its config.
  if(typeof _profiles === 'undefined' || !Array.isArray(_profiles)) return null;
  const kid = _profiles.find(p => p && String(p.id) === pidStr);
  if(!kid) return null;
  if(typeof _activeProfileId !== 'undefined' && kid.id === _activeProfileId){
    return _allowanceConfig();
  }
  const pd = (kid.data && typeof kid.data === 'object') ? kid.data : (kid.data = {});
  if(!pd.allowanceConfig || typeof pd.allowanceConfig !== 'object' || Array.isArray(pd.allowanceConfig)){
    pd.allowanceConfig = { amount:0, frequency:'weekly', dayOfWeek:5, dayOfMonth:1, anchorDate:'', lastCreditedOn:null, enabled:false };
  }
  return pd.allowanceConfig;
}

function _allowanceFormChange(pidStr, field, value){
  const cfg = _allowanceResolveConfig(pidStr);
  if(!cfg) return;
  if(field === 'amount'){
    const v = parseFloat(value);
    cfg.amount = (isFinite(v) && v >= 0) ? v : 0;
  } else if(field === 'frequency'){
    if(ALLOWANCE_FREQUENCIES.indexOf(value) !== -1) cfg.frequency = value;
  } else if(field === 'dayOfWeek'){
    const n = parseInt(value, 10);
    if(!isNaN(n) && n >= 0 && n <= 6) cfg.dayOfWeek = n;
  } else if(field === 'dayOfMonth'){
    const n = parseInt(value, 10);
    if(!isNaN(n) && n >= 1 && n <= 31) cfg.dayOfMonth = n;
  } else {
    return;
  }
  // Persist through whichever path the config lives on.
  if(!pidStr || (typeof _activeProfileId !== 'undefined' && pidStr === String(_activeProfileId))){
    save();
  } else if(typeof saveProfiles === 'function'){
    saveProfiles();
  } else {
    save();
  }
  // Re-render the parent card (frequency change swaps the day
  // picker between week / month variants).
  renderPhAllowance();
}

function _allowanceFormToggle(pidStr){
  const cfg = _allowanceResolveConfig(pidStr);
  if(!cfg) return;
  const wasOff = !cfg.enabled;
  if(!cfg.enabled){
    // Enabling — set lastCreditedOn so today's date is the floor
    // for catch-up. Prevents instant backfill of historical due
    // dates that pre-date the configuration moment.
    cfg.lastCreditedOn = _mzAddDays(_mzToday(), -1);
    cfg.enabled = true;
  } else {
    cfg.enabled = false;
  }
  // Allowance-setup milestone — fires the first time enabled flips
  // to true AND an amount is configured. _checkMoneyMilestones is
  // idempotent so re-toggling won't re-fire.
  if(wasOff && cfg.enabled && (+cfg.amount || 0) > 0 && typeof _checkMoneyMilestones === 'function'){
    _checkMoneyMilestones();
  }
  if(!pidStr || (typeof _activeProfileId !== 'undefined' && pidStr === String(_activeProfileId))){
    save();
  } else if(typeof saveProfiles === 'function'){
    saveProfiles();
  } else {
    save();
  }
  renderPhAllowance();
  // Refresh the kid view if it's mounted (active profile matches).
  if(document.getElementById('mt-allowance')) renderAllowance();
}

// ─── Tx edit-mode plumbing (scope E from UX review) ──────────────

function _moneyTxBeginEdit(id){
  const entry = (D.transactions || []).find(t => t && t.id === id);
  if(!entry){ showToast('Entry not found'); return; }
  _moneyTxEditingId = id;

  // Populate form fields. Type toggle + chip picker need the matched
  // button-click sequence so their visual state stays in sync.
  const nameEl = document.getElementById('txName'); if(nameEl) nameEl.value = entry.name || '';
  const amtEl  = document.getElementById('txAmt');  if(amtEl)  amtEl.value  = entry.amt || '';
  const dateEl = document.getElementById('txDate'); if(dateEl) dateEl.value = entry.date || '';

  if(entry.type === 'income' || entry.type === 'expense'){
    const btnEl = document.querySelector('.mz-tx-toggle__btn--' + entry.type);
    if(btnEl) _moneyTxSetType(entry.type, btnEl);
  }
  if(entry.cat){
    // Re-render the picker so we can find the chip element for the
    // entry's category, then click it through the same handler the
    // user would.
    _moneyRenderCatPicker();
    const chips = document.querySelectorAll('.mz-tx-catchip');
    chips.forEach(chip => {
      const label = chip.querySelector('.mz-tx-catchip__label');
      if(label && label.textContent === entry.cat){
        _moneyTxSetCat(entry.cat, chip);
      }
    });
  }

  // Swap the submit button label + reveal cancel.
  const submit = document.getElementById('mzTxSubmitBtn');
  if(submit) submit.textContent = 'Save Changes';
  const cancel = document.getElementById('mzTxCancelBtn');
  if(cancel) cancel.style.display = '';

  // Scroll the form into view so the edit moment feels intentional.
  const form = document.querySelector('#mt-tx .card');
  if(form && typeof form.scrollIntoView === 'function'){
    try { form.scrollIntoView({ behavior:'smooth', block:'start' }); } catch(_) {}
  }
}

function _moneyTxCancelEdit(){
  _moneyTxEditingId = null;
  const nameEl = document.getElementById('txName'); if(nameEl) nameEl.value = '';
  const amtEl  = document.getElementById('txAmt');  if(amtEl)  amtEl.value  = '';
  // Date stays as user set it — that's fine for "log another".
  const submit = document.getElementById('mzTxSubmitBtn');
  if(submit) submit.textContent = 'Log It';
  const cancel = document.getElementById('mzTxCancelBtn');
  if(cancel) cancel.style.display = 'none';
}

// ════════════════════════════════════════════════════════════════
// Tab 2 Increment 4 — Learn sub-tab (8 financial-literacy lessons)
// ════════════════════════════════════════════════════════════════
//
// State machine inside #mt-learn:
//
//   _learnView === 'grid'        -> #mzLearnGrid visible (default)
//   _learnView === 'lesson:5'    -> #mzLearnLesson5Static visible
//                                   (carries the existing TY2025
//                                   Tax Ed markup + calcTax form)
//   _learnView === 'lesson:N'    -> #mzLearnLesson visible, content
//                                   rendered from MONEY_LESSONS[N-1]
//
// Lesson 5's static branch is the only special case — every other
// lesson goes through the template renderer fed by money-lessons.js.
//
// Progress tracking is JSONB only — D.moneyLessonsProgress. No
// new table (per the plan). Two maps:
//   opened     { N: true }   any lesson the user has tapped open
//   completed  { N: true }   lessons they've explicitly marked done
// + timestamp mirrors for analytics.

let _learnView = 'grid';

function _learnInitProgress(){
  if(!D.moneyLessonsProgress || typeof D.moneyLessonsProgress !== 'object' || Array.isArray(D.moneyLessonsProgress)){
    D.moneyLessonsProgress = { opened:{}, completed:{}, openedAt:{}, completedAt:{} };
  }
  const p = D.moneyLessonsProgress;
  if(!p.opened     || typeof p.opened     !== 'object' || Array.isArray(p.opened))     p.opened     = {};
  if(!p.completed  || typeof p.completed  !== 'object' || Array.isArray(p.completed))  p.completed  = {};
  if(!p.openedAt   || typeof p.openedAt   !== 'object' || Array.isArray(p.openedAt))   p.openedAt   = {};
  if(!p.completedAt|| typeof p.completedAt!== 'object' || Array.isArray(p.completedAt))p.completedAt= {};
  return p;
}

function _learnLessonByNum(n){
  if(typeof MONEY_LESSONS === 'undefined') return null;
  return MONEY_LESSONS.find(l => l && l.num === n) || null;
}

// All 8 lessons in display order — used for the landing grid + the
// 8-dot progress row. Lesson 5 is the only static one; everything
// else comes from MONEY_LESSONS. We synthesize a tiny header for
// lesson 5 here so the grid card has the same shape.
const _LEARN_LESSON_5_META = {
  num: 5,
  title: 'Taxes (TY2025)',
  icon: '🧾',
  readMinutes: 5,
  hook: 'The biggest paycheck shock you can prepare for. Brackets, withholding, deductions, credits — and a built-in calculator with the actual TY2025 numbers.'
};

function _learnAllLessons(){
  // Build the 8-lesson list in num order, blending lesson 5's
  // static meta with the MONEY_LESSONS array entries.
  const out = [];
  for(let n = 1; n <= 8; n++){
    if(n === 5){
      out.push(_LEARN_LESSON_5_META);
    } else {
      const l = _learnLessonByNum(n);
      if(l) out.push(l);
    }
  }
  return out;
}

// Public — fires on mTab('learn'). Reads state, shows the right
// container, populates content.
function renderLearn(){
  _learnInitProgress();

  const grid = document.getElementById('mzLearnGrid');
  const less = document.getElementById('mzLearnLesson');
  const l5   = document.getElementById('mzLearnLesson5Static');

  if(_learnView === 'grid'){
    if(grid) grid.style.display = '';
    if(less) less.style.display = 'none';
    if(l5)   l5.style.display   = 'none';
    _renderLearnGrid();
    return;
  }

  if(_learnView === 'lesson:5'){
    if(grid) grid.style.display = 'none';
    if(less) less.style.display = 'none';
    if(l5)   l5.style.display   = '';
    return;
  }

  // Numbered lesson (not 5) — render the template into #mzLearnLesson.
  const m = /^lesson:(\d+)$/.exec(_learnView);
  const n = m ? parseInt(m[1], 10) : null;
  if(n && n >= 1 && n <= 8 && n !== 5){
    if(grid) grid.style.display = 'none';
    if(less) less.style.display = '';
    if(l5)   l5.style.display   = 'none';
    _renderLearnLessonPage(n);
    return;
  }

  // Anything unexpected falls back to the grid.
  _learnView = 'grid';
  renderLearn();
}

// ─── Grid renderer ───────────────────────────────────────────────

function _renderLearnGrid(){
  const root = document.getElementById('mzLearnGrid');
  if(!root) return;
  const p = _learnInitProgress();
  const lessons = _learnAllLessons();
  const completedCount = lessons.filter(l => l && p.completed[l.num]).length;

  // 8-dot progress row.
  const dots = lessons.map(l => {
    const done   = !!p.completed[l.num];
    const opened = !!p.opened[l.num];
    let cls = 'mz-learn-dot';
    if(done) cls += ' mz-learn-dot--done';
    else if(opened) cls += ' mz-learn-dot--opened';
    const titleAttr = 'Lesson ' + l.num + ' — ' + l.title + (done ? ' (complete)' : opened ? ' (opened)' : '');
    return '<button type="button" class="' + cls + '" title="' + escapeHtml(titleAttr) + '" onclick="_learnOpen(' + l.num + ')">' + l.num + '</button>';
  }).join('');

  // UX reviewer fix — surface the lowest-numbered incomplete lesson
  // as "Continue" so a returning user has a clear focal point. The
  // grid was reading as a flat syllabus; now it reads as a living
  // progress tracker with a single entry hint.
  const nextNum = (function(){
    for(let i = 0; i < lessons.length; i++){
      const l = lessons[i];
      if(l && !p.completed[l.num]) return l.num;
    }
    return null;  // all 8 complete
  })();

  // 8 cards.
  const cards = lessons.map(l => {
    const done   = !!p.completed[l.num];
    const opened = !!p.opened[l.num];
    const isNext = !done && l.num === nextNum;
    const stateChip = done
      ? '<span class="mz-learn-card__chip mz-learn-card__chip--done">✓ Complete</span>'
      : isNext
        ? '<span class="mz-learn-card__chip mz-learn-card__chip--next">' + (opened ? 'Continue' : 'Start here') + '</span>'
        : opened
          ? '<span class="mz-learn-card__chip mz-learn-card__chip--opened">In progress</span>'
          : '<span class="mz-learn-card__chip">New</span>';
    let cls = 'mz-learn-card';
    if(done)        cls += ' mz-learn-card--done';
    else if(isNext) cls += ' mz-learn-card--next';
    return ''
      + '<button type="button" class="' + cls + '" onclick="_learnOpen(' + l.num + ')">'
      +   '<div class="mz-learn-card__head">'
      +     '<span class="mz-learn-card__num">LESSON ' + l.num + '</span>'
      +     stateChip
      +   '</div>'
      +   '<div class="mz-learn-card__icon">' + l.icon + '</div>'
      +   '<div class="mz-learn-card__title">' + escapeHtml(l.title) + '</div>'
      +   '<div class="mz-learn-card__meta">' + l.readMinutes + ' min read</div>'
      + '</button>';
  }).join('');

  root.innerHTML = ''
    + '<div class="mz-learn-frame">'
    +   '<div class="mz-learn-frame__title">📚 FINANCIAL LITERACY · 8-LESSON SERIES</div>'
    +   '<div class="mz-learn-frame__body">Eight short lessons that compound. Tap any card to open. Mark complete when you finish — your progress lives on this device and follows you across the rest of the Money tab.</div>'
    +   '<div class="mz-learn-frame__dots" aria-label="Lesson progress">' + dots + '</div>'
    +   '<div class="mz-learn-frame__counter">' + completedCount + ' of 8 complete</div>'
    + '</div>'
    + '<div class="mz-learn-grid">' + cards + '</div>';
}

// ─── Lesson page renderer (lessons 1, 2, 3, 4, 6, 7, 8) ──────────

function _renderLearnLessonPage(n){
  const root = document.getElementById('mzLearnLesson');
  if(!root) return;
  const l = _learnLessonByNum(n);
  if(!l){
    root.innerHTML = '<div class="mz-tx-empty">Lesson not found. <button onclick="_learnBackToGrid()" style="color:var(--mz-indigo);background:none;border:none;cursor:pointer;text-decoration:underline;">Back to all lessons</button></div>';
    return;
  }

  const p = _learnInitProgress();
  const isDone = !!p.completed[n];

  const faithBlock = l.faithFrame
    ? '<div class="mz-lesson-faith">' +
        '<div class="mz-lesson-faith__label">FAITH FRAMING</div>' +
        '<div class="mz-lesson-faith__body">' + l.faithFrame + '</div>' +
      '</div>'
    : '';

  const tryBlock = l.tryThis
    ? '<div class="mz-lesson-try">' +
        '<div class="mz-lesson-try__label">TRY THIS</div>' +
        '<div class="mz-lesson-try__body">' + l.tryThis + '</div>' +
      '</div>'
    : '';

  root.innerHTML = ''
    + '<button type="button" class="mz-lesson-back" onclick="_learnBackToGrid()">← All lessons</button>'
    + '<div class="mz-lesson-page">'
    +   '<div class="mz-lesson-chip">LESSON ' + l.num + ' · ' + l.readMinutes + ' MIN READ</div>'
    +   '<h2 class="mz-lesson-title">' + l.icon + ' ' + escapeHtml(l.title) + '</h2>'
    +   '<div class="mz-lesson-hook">' + escapeHtml(l.hook) + '</div>'
    +   '<div class="mz-lesson-concept">' + l.conceptHtml + '</div>'
    +   '<div class="mz-lesson-example">'
    +     '<div class="mz-lesson-example__label">WORKED EXAMPLE</div>'
    +     '<div class="mz-lesson-example__body">' + l.exampleHtml + '</div>'
    +   '</div>'
    +   '<div class="mz-lesson-takeaway">'
    +     '<div class="mz-lesson-takeaway__label">KEY TAKEAWAY</div>'
    +     '<div class="mz-lesson-takeaway__body">' + escapeHtml(l.takeaway) + '</div>'
    +   '</div>'
    +   tryBlock
    +   faithBlock
    +   '<div class="mz-lesson-footer">'
    +     '<button type="button" class="mz-lesson-complete' + (isDone ? ' mz-lesson-complete--done' : '') + '" onclick="_learnComplete(' + n + ')">'
    +       (isDone ? '✓ Marked complete' : 'Mark complete')
    +     '</button>'
    +   '</div>'
    + '</div>';

  // Scroll back to top of the panel when opening a new lesson —
  // long lessons that used to scroll on the grid would land
  // mid-page otherwise.
  if(typeof root.scrollIntoView === 'function'){
    try { root.scrollIntoView({ behavior:'smooth', block:'start' }); } catch(_) {}
  }
}

// ─── State handlers (exposed globally for onclick handlers) ──────

function _learnOpen(n){
  const p = _learnInitProgress();
  const today = (typeof localDateString === 'function')
    ? localDateString()
    : new Date().toISOString().slice(0,10);
  if(!p.opened[n]){
    p.opened[n]   = true;
    p.openedAt[n] = today;
    save();
  }
  _learnView = 'lesson:' + n;
  renderLearn();
}

function _learnBackToGrid(){
  _learnView = 'grid';
  renderLearn();
}

function _learnComplete(n){
  const p = _learnInitProgress();
  const today = (typeof localDateString === 'function')
    ? localDateString()
    : new Date().toISOString().slice(0,10);
  // Toggle — tapping a completed lesson un-completes (lets the
  // user correct a mis-tap without diving into devtools).
  if(p.completed[n]){
    delete p.completed[n];
    delete p.completedAt[n];
    showToast('Marked back to in-progress');
  } else {
    p.completed[n]   = true;
    p.completedAt[n] = today;
    // Also mark opened in case they jumped straight from the grid.
    if(!p.opened[n]){
      p.opened[n]   = true;
      p.openedAt[n] = today;
    }
    showToast('Lesson ' + n + ' complete ✓');
    // Lesson-count milestones fire from here (first_lesson / lessons_3
    // / lessons_all). The toast above lands first; the milestone
    // celebration follows ~420ms later so the two beats don't blur.
    if(typeof _checkMoneyMilestones === 'function') _checkMoneyMilestones();
  }
  save();
  // Re-render to flip the button label + update the grid counter.
  renderLearn();
}

// ════════════════════════════════════════════════════════════════
// Tab 2 Increment 5 — Goals polish + What-If + receipt/goal photos
// ════════════════════════════════════════════════════════════════
//
// This block lands:
//   1. Math helpers — _calcCompoundFV, _calcLoanPayoff,
//      _calcSavingsToGoal, _calcMonthlyForGoal. All four use
//      MONTHLY compounding (consumer-calc standard).
//   2. _renderWhatIf — 3-mode simulator (Compound / Loan / Goal),
//      one Chart.js canvas, dataset swap per mode.
//   3. addToGoal inline expand — replaces the prompt() that lived
//      here. Tap "+ Add" → row reveals input + Save/Cancel.
//   4. editSavGoal modal-reuse — repurpose goalModal in edit mode
//      via _savEditingId. saveSavingsGoal branches on the flag.
//   5. Goal field sanitize — D.savingsGoals gets optional
//      targetDate / photoPath / createdAt / completedAt fields.
//   6. Photo upload helpers — _uploadGoalPhoto, _uploadReceipt port
//      the chore-proofs upload pattern to the new money-images +
//      money-receipts buckets.
//
// Math consistency: the formulas reproduce the EXACT numbers quoted
// in Lessons 7 and 8 (corrected in the lesson-fix commit just
// before this one). Verified before commit.

const MONEY_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const MONEY_PHOTO_MIME = {
  'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp',
  'image/heic':'heic', 'image/heif':'heif'
};

// ─── Math: compound interest (monthly compounded) ────────────────
function _calcCompoundFV(monthlyContrib, annualRatePct, contribYears, growYears){
  const r = (annualRatePct / 100) / 12;
  const m1 = Math.max(0, contribYears) * 12;
  const m2 = Math.max(0, growYears)    * 12;
  let phase1 = 0;
  if(m1 > 0){
    if(r === 0) phase1 = monthlyContrib * m1;
    else        phase1 = monthlyContrib * (Math.pow(1+r, m1) - 1) / r;
  }
  const finalValue       = phase1 * Math.pow(1+r, m2);
  const totalContributed = monthlyContrib * m1;
  return {
    finalValue,
    totalContributed,
    growthEarned: finalValue - totalContributed
  };
}

// ─── Math: loan payoff (standard amortization) ────────────────────
function _calcLoanPayoff(balance, aprPct, monthlyPayment){
  const r = (aprPct / 100) / 12;
  if(monthlyPayment <= balance * r){
    return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, neverPaysOff: true };
  }
  if(r === 0){
    const months = Math.ceil(balance / monthlyPayment);
    return { months, totalInterest: 0, totalPaid: balance };
  }
  const nAnalytical = -Math.log(1 - r * balance / monthlyPayment) / Math.log(1 + r);
  const months = Math.round(nAnalytical);
  let remaining = balance, totalPaid = 0;
  for(let i = 0; i < months; i++){
    const interest = remaining * r;
    const pay = Math.min(monthlyPayment, remaining + interest);
    remaining = remaining + interest - pay;
    totalPaid += pay;
    if(remaining <= 0.005) break;
  }
  if(remaining > 0.005){
    const interest = remaining * r;
    totalPaid += remaining + interest;
  }
  return {
    months: months,
    totalInterest: totalPaid - balance,
    totalPaid: totalPaid
  };
}

// ─── Math: savings to goal ───────────────────────────────────────
function _calcSavingsToGoal(currentBalance, target, monthlyContrib, annualRatePct){
  if(currentBalance >= target) return { months: 0, finalAmount: currentBalance };
  if(monthlyContrib <= 0) return { months: Infinity, finalAmount: currentBalance, neverReaches: true };
  const r = (annualRatePct / 100) / 12;
  if(r === 0){
    const needed = target - currentBalance;
    return { months: Math.ceil(needed / monthlyContrib), finalAmount: target };
  }
  const num = target + monthlyContrib / r;
  const den = currentBalance + monthlyContrib / r;
  if(den <= 0 || num <= 0) return { months: Infinity, finalAmount: currentBalance, neverReaches: true };
  const n = Math.log(num / den) / Math.log(1 + r);
  if(!isFinite(n) || n < 0) return { months: Infinity, finalAmount: currentBalance, neverReaches: true };
  return { months: Math.ceil(n), finalAmount: target };
}

// ─── Math: monthly contribution needed to hit goal in N months ───
function _calcMonthlyForGoal(currentBalance, target, months, annualRatePct){
  if(currentBalance >= target) return { monthly: 0, alreadyMet: true };
  if(months <= 0) return { monthly: Infinity, impossible: true };
  const r = (annualRatePct / 100) / 12;
  if(r === 0){
    return { monthly: (target - currentBalance) / months };
  }
  const factor = Math.pow(1+r, months);
  const monthly = (target - currentBalance * factor) * r / (factor - 1);
  return { monthly: Math.max(0, monthly) };
}

// ─── Chart series builders ────────────────────────────────────────
function _whatIfCompoundSeries(monthly, ratePct, contribYears, growYears){
  const r = (ratePct / 100) / 12;
  const totalMonths = (contribYears + growYears) * 12;
  const contribMonths = contribYears * 12;
  const step = Math.max(1, Math.floor(totalMonths / 60));
  const out = [];
  let balance = 0;
  for(let m = 0; m <= totalMonths; m++){
    if(m > 0){
      balance = balance * (1 + r);
      if(m <= contribMonths) balance += monthly;
    }
    if(m % step === 0 || m === totalMonths){
      out.push({ month: m, balance });
    }
  }
  return out;
}

function _whatIfLoanSeries(balance, aprPct, monthlyPayment){
  const r = (aprPct / 100) / 12;
  if(monthlyPayment <= balance * r) return [];
  const points = [{ month: 0, balance: balance }];
  let rem = balance, m = 0;
  while(rem > 0.005 && m < 600){
    rem = rem * (1 + r) - monthlyPayment;
    if(rem < 0) rem = 0;
    m++;
    points.push({ month: m, balance: rem });
  }
  return points;
}

function _whatIfGoalSeries(current, target, monthly, annualRatePct){
  const r = (annualRatePct / 100) / 12;
  const points = [{ month: 0, balance: current }];
  let bal = current, m = 0;
  while(bal < target && m < 600){
    bal = bal * (1 + r) + monthly;
    m++;
    points.push({ month: m, balance: bal });
  }
  return points;
}

// ─── What-If renderer ────────────────────────────────────────────
let _whatIfMode  = 'compound';
let _whatIfChart = null;

function _setWhatIfMode(mode){
  if(['compound','loan','goal'].indexOf(mode) === -1) return;
  _whatIfMode = mode;
  document.querySelectorAll('.mz-whatif-chip').forEach(b => b.classList.remove('active'));
  const active = document.querySelector('.mz-whatif-chip[data-mode="' + mode + '"]');
  if(active) active.classList.add('active');
  // Toggle input panels.
  document.querySelectorAll('.mz-whatif-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById('mzWhatIfPanel_' + mode);
  if(panel) panel.style.display = '';
  // Toggle output cards — only one renders at a time.
  ['compound','loan','goal'].forEach(m => {
    const out = document.getElementById('mzWhatIfOut_' + m);
    if(out) out.style.display = (m === mode) ? '' : 'none';
  });
  _runWhatIf();
}

function _readWhatIfInput(id){
  const el = document.getElementById(id);
  if(!el) return 0;
  const v = parseFloat(el.value);
  return isFinite(v) ? v : 0;
}

function _runWhatIf(){
  if(_whatIfMode === 'compound'){
    const monthly = _readWhatIfInput('whatIfCmpMonthly');
    const rate    = _readWhatIfInput('whatIfCmpRate');
    const cYears  = _readWhatIfInput('whatIfCmpContribY');
    const gYears  = _readWhatIfInput('whatIfCmpGrowY');
    const res = _calcCompoundFV(monthly, rate, cYears, gYears);
    const outEl = document.getElementById('mzWhatIfOut_compound');
    if(outEl){
      outEl.innerHTML = ''
        + '<div class="mz-whatif-out__main">$' + Math.round(res.finalValue).toLocaleString() + '</div>'
        + '<div class="mz-whatif-out__row"><span>Total contributed</span><span>$' + Math.round(res.totalContributed).toLocaleString() + '</span></div>'
        + '<div class="mz-whatif-out__row"><span>Growth earned</span><span class="mz-whatif-out__row--accent">$' + Math.round(res.growthEarned).toLocaleString() + '</span></div>';
    }
    _drawWhatIfChart(_whatIfCompoundSeries(monthly, rate, cYears, gYears), 'Compound balance', '#10b981');
    return;
  }
  if(_whatIfMode === 'loan'){
    const balance = _readWhatIfInput('whatIfLoanBalance');
    const apr     = _readWhatIfInput('whatIfLoanApr');
    const payment = _readWhatIfInput('whatIfLoanPayment');
    const res = _calcLoanPayoff(balance, apr, payment);
    const outEl = document.getElementById('mzWhatIfOut_loan');
    if(outEl){
      if(res.neverPaysOff){
        const need = Math.ceil(balance * (apr/1200));
        outEl.innerHTML = '<div class="mz-whatif-out__warn">⚠ Payment doesn\'t cover monthly interest — this loan never pays off. Increase the payment above $' + need.toLocaleString() + '/month.</div>';
      } else {
        const years = (res.months / 12).toFixed(1);
        outEl.innerHTML = ''
          + '<div class="mz-whatif-out__main">' + res.months + ' months</div>'
          + '<div class="mz-whatif-out__row"><span>That\'s</span><span>' + years + ' years</span></div>'
          + '<div class="mz-whatif-out__row"><span>Total interest</span><span class="mz-whatif-out__row--warn">$' + Math.round(res.totalInterest).toLocaleString() + '</span></div>'
          + '<div class="mz-whatif-out__row"><span>Total paid</span><span>$' + Math.round(res.totalPaid).toLocaleString() + '</span></div>';
      }
    }
    _drawWhatIfChart(_whatIfLoanSeries(balance, apr, payment), 'Loan balance', '#fb7185');
    return;
  }
  if(_whatIfMode === 'goal'){
    const current = _readWhatIfInput('whatIfGoalCurrent');
    const target  = _readWhatIfInput('whatIfGoalTarget');
    const monthly = _readWhatIfInput('whatIfGoalMonthly');
    const rate    = _readWhatIfInput('whatIfGoalRate');
    const res = _calcSavingsToGoal(current, target, monthly, rate);
    const outEl = document.getElementById('mzWhatIfOut_goal');
    if(outEl){
      if(res.neverReaches){
        outEl.innerHTML = '<div class="mz-whatif-out__warn">⚠ At this rate you won\'t reach the goal. Increase the monthly contribution.</div>';
      } else if(res.months === 0){
        outEl.innerHTML = '<div class="mz-whatif-out__main">Already there 🎉</div>';
      } else {
        const years = (res.months / 12).toFixed(1);
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + res.months);
        const monthLabel = targetDate.toLocaleDateString('en', { month:'long', year:'numeric' });
        outEl.innerHTML = ''
          + '<div class="mz-whatif-out__main">' + res.months + ' months</div>'
          + '<div class="mz-whatif-out__row"><span>That\'s</span><span>' + years + ' years (around ' + monthLabel + ')</span></div>'
          + '<div class="mz-whatif-out__row"><span>Monthly contribution</span><span>$' + monthly.toFixed(0) + '</span></div>';
      }
    }
    _drawWhatIfChart(_whatIfGoalSeries(current, target, monthly, rate), 'Balance toward goal', '#10b981');
    return;
  }
}

function _drawWhatIfChart(series, label, color){
  if(typeof Chart === 'undefined') return;
  const canvas = document.getElementById('mzWhatIfChart');
  if(!canvas || !series || !series.length) return;
  const labels = series.map(p => p.month);
  const values = series.map(p => Math.round(p.balance));
  if(_whatIfChart){
    _whatIfChart.data.labels = labels;
    _whatIfChart.data.datasets[0].label = label;
    _whatIfChart.data.datasets[0].data = values;
    _whatIfChart.data.datasets[0].borderColor = color;
    _whatIfChart.data.datasets[0].backgroundColor = color + '22';
    _whatIfChart.update('none');
    return;
  }
  _whatIfChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        borderColor: color,
        backgroundColor: color + '22',
        fill: true,
        tension: 0.25,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Months', color: 'rgba(255,255,255,.5)' }, ticks: { color: 'rgba(255,255,255,.5)' }, grid: { color: 'rgba(255,255,255,.05)' } },
        y: { ticks: { color: 'rgba(255,255,255,.5)', callback: v => '$' + Number(v).toLocaleString() }, grid: { color: 'rgba(255,255,255,.05)' } }
      }
    }
  });
}

// ─── Goal field sanitize ─────────────────────────────────────────
function _sanitizeSavingsGoals(){
  if(!Array.isArray(D.savingsGoals)) D.savingsGoals = [];
  D.savingsGoals.forEach(g => {
    if(!g || typeof g !== 'object') return;
    if(typeof g.targetDate   !== 'string') g.targetDate   = '';
    if(typeof g.photoPath    !== 'string') g.photoPath    = '';
    if(typeof g.createdAt    !== 'string') g.createdAt    = '';
    if(typeof g.completedAt  !== 'string') g.completedAt  = '';
    if(g.current >= g.target && !g.completedAt){
      g.completedAt = new Date().toISOString().slice(0,10);
    }
  });
}

// ─── addToGoal — inline expanding row (no more prompt()) ─────────
let _quickAddOpenId = null;

function addToGoal(id){
  _quickAddOpenId = id;
  if(typeof renderSavGoalCards === 'function') renderSavGoalCards();
  setTimeout(function(){
    const inp = document.getElementById('mzQuickAddInput_' + id);
    if(inp) { try { inp.focus(); inp.select(); } catch(_) {} }
  }, 60);
}

function _quickAddSave(id){
  _sanitizeSavingsGoals();
  const inp = document.getElementById('mzQuickAddInput_' + id);
  const amt = inp ? parseFloat(inp.value) : NaN;
  if(!isFinite(amt) || amt <= 0){ showToast('Enter an amount'); return; }
  const g = D.savingsGoals.find(g => g && g.id === id);
  if(!g) return;
  const wasIncomplete = (g.current || 0) < g.target;
  g.current = (g.current || 0) + amt;
  if(g.current >= g.target && !g.completedAt){
    g.completedAt = new Date().toISOString().slice(0,10);
  }
  _quickAddOpenId = null;
  // Quick-add can push g.current past 50 or 100 — the milestone
  // celebrations fire here so a single contribution that crosses
  // both thresholds at once is detected.
  if(typeof _checkMoneyMilestones === 'function') _checkMoneyMilestones();
  save();
  if(typeof renderSavingsTab    === 'function') renderSavingsTab();
  if(typeof renderSavGoalCards  === 'function') renderSavGoalCards();
  if(typeof updateFinSum        === 'function') updateFinSum();
  if(wasIncomplete && g.current >= g.target){
    showToast('🎉 Goal complete! ' + (g.emoji||'🎯') + ' ' + g.name);
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
  } else {
    showToast('+$' + amt.toFixed(2) + ' added to ' + (g.emoji||'🎯') + ' ' + g.name);
  }
}

function _quickAddCancel(){
  _quickAddOpenId = null;
  if(typeof renderSavGoalCards === 'function') renderSavGoalCards();
}

// ─── editSavGoal — modal reuse (no more prompt() chain) ──────────
let _savEditingId = null;

function editSavGoal(id){
  _sanitizeSavingsGoals();
  const g = D.savingsGoals.find(g => g && g.id === id);
  if(!g){ showToast('Goal not found'); return; }
  _savEditingId = id;
  const nameEl    = document.getElementById('sgName');       if(nameEl)    nameEl.value    = g.name    || '';
  const emojiEl   = document.getElementById('sgEmoji');      if(emojiEl)   emojiEl.value   = g.emoji   || '🎯';
  const targetEl  = document.getElementById('sgTarget');     if(targetEl)  targetEl.value  = g.target  || '';
  const currentEl = document.getElementById('sgCurrent');    if(currentEl) currentEl.value = g.current || '';
  const dateEl    = document.getElementById('sgTargetDate'); if(dateEl)    dateEl.value    = g.targetDate || '';
  const submitEl = document.getElementById('sgSubmitBtn'); if(submitEl) submitEl.textContent = 'Save Changes';
  const titleEl  = document.getElementById('sgModalTitle'); if(titleEl) titleEl.textContent = 'Edit savings goal';
  if(typeof openModal === 'function') openModal('goalModal');
}

// ─── saveSavingsGoal rewrite — new + edit branches ────────────────
function saveSavingsGoal(){
  _sanitizeSavingsGoals();
  const name       = (document.getElementById('sgName').value     || '').trim();
  const emoji      = (document.getElementById('sgEmoji').value    || '🎯').trim();
  const target     = parseFloat(document.getElementById('sgTarget').value);
  const current    = parseFloat(document.getElementById('sgCurrent').value) || 0;
  const targetDate = ((document.getElementById('sgTargetDate')||{}).value || '').trim();
  if(!name || isNaN(target)){ showToast('Fill in goal details'); return; }
  let goalId = null;
  if(_savEditingId !== null){
    const g = D.savingsGoals.find(g => g && g.id === _savEditingId);
    if(g){
      g.name       = name;
      g.emoji      = emoji;
      g.target     = target;
      g.current    = current;
      g.targetDate = targetDate;
      if(g.current >= g.target && !g.completedAt){
        g.completedAt = new Date().toISOString().slice(0,10);
      } else if(g.current < g.target){
        g.completedAt = '';
      }
      goalId = g.id;
      _savEditingId = null;
    }
  } else {
    if(!D.savingsGoals) D.savingsGoals = [];
    const newGoal = {
      id: Date.now(),
      name, emoji, target, current,
      targetDate: targetDate,
      photoPath: '',
      createdAt: new Date().toISOString().slice(0,10),
      completedAt: current >= target ? new Date().toISOString().slice(0,10) : ''
    };
    D.savingsGoals.push(newGoal);
    goalId = newGoal.id;
  }
  ['sgName','sgEmoji','sgTarget','sgCurrent','sgTargetDate'].forEach(id => { const e = document.getElementById(id); if(e) e.value = ''; });
  const submitEl = document.getElementById('sgSubmitBtn'); if(submitEl) submitEl.textContent = 'Create goal';
  const titleEl  = document.getElementById('sgModalTitle'); if(titleEl) titleEl.textContent = 'New savings goal';
  if(typeof _checkMoneyMilestones === 'function') _checkMoneyMilestones();
  save();
  if(typeof renderSavingsTab   === 'function') renderSavingsTab();
  if(typeof renderSavGoalCards === 'function') renderSavGoalCards();
  if(typeof closeModal         === 'function') closeModal('goalModal');
  showToast(_savEditingId === null ? 'Goal saved ✓' : 'Goal created! 🎯');
  // Photo upload (async, fire-and-forget) — runs AFTER the goal row
  // exists so the storage path can reference goalId.
  if(_pendingGoalPhotoFile && goalId !== null){
    _maybeUploadPendingGoalPhoto(goalId);
  }
}

// ─── Photo upload helpers ────────────────────────────────────────
function _moneyProfileKey(){
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

async function _uploadGoalPhoto(supa, userId, goalId, file){
  if(!supa || !userId) return { ok:false, reason:'not signed in' };
  if(!file) return { ok:false, reason:'no file' };
  if(!MONEY_PHOTO_MIME[file.type]) return { ok:false, reason:'unsupported type' };
  if(file.size > MONEY_PHOTO_MAX_BYTES) return { ok:false, reason:'too large' };
  const ext = MONEY_PHOTO_MIME[file.type];
  const profileKey = _moneyProfileKey();
  const path = userId + '/' + profileKey + '/' + String(goalId) + '/' + Date.now() + '.' + ext;
  try {
    const { error } = await supa.storage.from('money-images')
      .upload(path, file, { contentType: file.type, upsert: false });
    if(error) return { ok:false, reason: error.message || 'upload failed' };
    return { ok:true, path };
  } catch(e){
    return { ok:false, reason: (e && e.message) || 'upload exception' };
  }
}

async function _uploadReceipt(supa, userId, txId, file){
  if(!supa || !userId) return { ok:false, reason:'not signed in' };
  if(!file) return { ok:false, reason:'no file' };
  if(!MONEY_PHOTO_MIME[file.type]) return { ok:false, reason:'unsupported type' };
  if(file.size > MONEY_PHOTO_MAX_BYTES) return { ok:false, reason:'too large' };
  const ext = MONEY_PHOTO_MIME[file.type];
  const profileKey = _moneyProfileKey();
  const path = userId + '/' + profileKey + '/' + String(txId) + '/' + Date.now() + '.' + ext;
  try {
    const { error } = await supa.storage.from('money-receipts')
      .upload(path, file, { contentType: file.type, upsert: false });
    if(error) return { ok:false, reason: error.message || 'upload failed' };
    return { ok:true, path };
  } catch(e){
    return { ok:false, reason: (e && e.message) || 'upload exception' };
  }
}

async function _signMoneyPhotoUrl(bucket, path){
  if(!path) return null;
  const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  if(!supa) return null;
  try {
    const { data, error } = await supa.storage.from(bucket).createSignedUrl(path, 60);
    if(error) return null;
    return (data && data.signedUrl) || null;
  } catch(_) { return null; }
}

function _hydrateGoalPhotos(){
  if(!Array.isArray(D.savingsGoals)) return;
  D.savingsGoals.forEach(g => {
    if(!g || !g.photoPath) return;
    _signMoneyPhotoUrl('money-images', g.photoPath).then(url => {
      if(!url) return;
      const el = document.querySelector('.mz-goal-photo[data-goal-id="' + g.id + '"]');
      if(el) el.style.backgroundImage = 'url("' + url + '")';
    });
  });
}

let _pendingGoalPhotoFile = null;

function _onGoalPhotoChange(inp){
  if(!inp || !inp.files || !inp.files[0]) { _pendingGoalPhotoFile = null; return; }
  const f = inp.files[0];
  if(!MONEY_PHOTO_MIME[f.type]){ showToast('Photos only — JPEG / PNG / WebP / HEIC'); inp.value=''; return; }
  if(f.size > MONEY_PHOTO_MAX_BYTES){ showToast('Photo too large — max 5 MB'); inp.value=''; return; }
  _pendingGoalPhotoFile = f;
  const preview = document.getElementById('sgPhotoPreviewLabel');
  if(preview) preview.textContent = '✓ ' + f.name;
}

async function _maybeUploadPendingGoalPhoto(goalId){
  if(!_pendingGoalPhotoFile) return;
  const supa = (typeof getSupabase === 'function') ? getSupabase() : null;
  const uid  = (typeof _supaUser !== 'undefined' && _supaUser) ? _supaUser.id : null;
  if(!supa || !uid){ showToast('Sign in to attach photos'); _pendingGoalPhotoFile = null; return; }
  showToast('Uploading photo…');
  const r = await _uploadGoalPhoto(supa, uid, goalId, _pendingGoalPhotoFile);
  _pendingGoalPhotoFile = null;
  const inp = document.getElementById('sgPhoto'); if(inp) inp.value = '';
  const preview = document.getElementById('sgPhotoPreviewLabel'); if(preview) preview.textContent = '';
  if(r.ok){
    const g = D.savingsGoals.find(g => g && g.id === goalId);
    if(g){ g.photoPath = r.path; save(); }
    showToast('Photo attached ✓');
    if(typeof renderSavGoalCards === 'function') renderSavGoalCards();
  } else {
    showToast('Photo upload failed — goal saved without it');
  }
}

// ════════════════════════════════════════════════════════════════
// Tab 2 Increment 5.5 — Money milestone celebrations
// ════════════════════════════════════════════════════════════════
//
// _checkMoneyMilestones() walks the milestone list, fires the
// celebration for any newly-crossed entry, and stamps
// D.moneyMilestones[key] so each milestone is one-shot. Reuses the
// existing Chores celebration engine: screenFlash + launchSideConfetti
// + showToast. JSONB only — no new table.
//
// Callers (addTx / saveSavingsGoal / _quickAddSave / _learnComplete
// / _allowanceFormToggle) invoke this BEFORE their save() so the
// new milestone state is persisted by the caller's save in the same
// flush. UI side-effects (flash + confetti + toast) are staggered via
// setTimeout when multiple fire in one pass (e.g. a single goal
// deposit pushes you over both $50 and $100 — both fire, ~420ms
// apart, so the bursts don't blur into one indistinct cheer).

function _milestoneLessonsCompleted(){
  const p = D.moneyLessonsProgress;
  if(!p || typeof p.completed !== 'object' || Array.isArray(p.completed)) return 0;
  return Object.keys(p.completed).length;
}

const MONEY_MILESTONES = [
  { key: 'first_tx',         msg: 'First transaction logged 💰',  test: () => Array.isArray(D.transactions)  && D.transactions.length  > 0 },
  { key: 'first_goal',       msg: 'First savings goal created 🎯', test: () => Array.isArray(D.savingsGoals) && D.savingsGoals.length > 0 },
  { key: 'first_50_saved',   msg: 'First $50 saved! 💚',           test: () => (D.savingsGoals||[]).some(g => g && (g.current||0) >=  50) },
  { key: 'first_100_saved',  msg: 'First $100 saved! 💵',          test: () => (D.savingsGoals||[]).some(g => g && (g.current||0) >= 100) },
  { key: 'first_lesson',     msg: 'First lesson completed 📚',     test: () => _milestoneLessonsCompleted() >= 1 },
  { key: 'lessons_3',        msg: '3 lessons down 🔥',              test: () => _milestoneLessonsCompleted() >= 3 },
  { key: 'lessons_all',      msg: 'All 8 lessons complete 🏆',     test: () => _milestoneLessonsCompleted() >= 8 },
  { key: 'allowance_setup',  msg: 'Allowance is live 🪙',           test: () => D.allowanceConfig && D.allowanceConfig.enabled === true && (+D.allowanceConfig.amount || 0) > 0 }
];

function _checkMoneyMilestones(){
  if(!D.moneyMilestones || typeof D.moneyMilestones !== 'object' || Array.isArray(D.moneyMilestones)){
    D.moneyMilestones = {};
  }
  const today = new Date().toISOString().slice(0,10);
  let fireIdx = 0;
  MONEY_MILESTONES.forEach(m => {
    if(D.moneyMilestones[m.key]) return;            // already fired — one-shot
    try {
      if(!m.test()) return;
      D.moneyMilestones[m.key] = today;
      // Stagger so back-to-back celebrations don't blur into one burst.
      const delay = fireIdx * 420;
      fireIdx++;
      setTimeout(() => {
        if(typeof screenFlash         === 'function') screenFlash('#10b981', 220);
        if(typeof launchSideConfetti  === 'function') launchSideConfetti();
        if(typeof showToast           === 'function') showToast(m.msg);
      }, delay);
    } catch(_) {
      // Don't let one milestone breakage block subsequent ones.
    }
  });
}

// ════════════════════════════════════════════════════════════
// Tab 2 Inc 7 Step A — AI Money Coach.
//
// Weekly kid-voice second-person coaching card on #mt-dashboard.
// Same architectural pattern as the chore coach (chores.js):
//   - ISO-week cached in D.financeCoachLastWeek
//   - Stats packaged from a 30-day window of D.transactions
//   - Strict-JSON response via /api/ai-summary mode='money-coach'
//   - Auto-fetch on mTab('dashboard') when stale + has activity
//   - Manual ↻ refresh throttled to once per 6h
//
// Guardrails (mirrored from MONEY_COACH_SYSTEM in api/ai-summary.js):
//   - never prescriptive financial advice
//   - never specific dollar prescriptions
//   - never compare to peers / averages
//   - never project the future ("at this rate…")
//   - empty weeks: encouraging, never shaming
// ════════════════════════════════════════════════════════════
function _finCoachIsoWeek(d){
  d = (d instanceof Date) ? d : new Date();
  var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  var week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return t.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function _finCoachStats30d(){
  var now = new Date();
  var floor = new Date(now.getTime() - 30 * 86400000);
  var floorISO = floor.toISOString().slice(0,10);
  var tx = Array.isArray(D.transactions) ? D.transactions : [];

  // 30-day window. Strip `note` so PII text never leaves the device.
  // The coach reads category + amount + type + date only.
  var inWindow = tx.filter(function(t){ return t && (t.date || '') >= floorISO; });
  var income  = inWindow.filter(function(t){ return t.type === 'income';  }).reduce(function(s,t){ return s + (Number(t.amount)||Number(t.amt)||0); }, 0);
  var expense = inWindow.filter(function(t){ return t.type === 'expense'; }).reduce(function(s,t){ return s + (Number(t.amount)||Number(t.amt)||0); }, 0);

  // Top expense categories (top 3 by total $)
  var catTotals = {};
  inWindow.forEach(function(t){
    if(t.type !== 'expense') return;
    var c = t.cat || 'other';
    catTotals[c] = (catTotals[c] || 0) + (Number(t.amount)||Number(t.amt)||0);
  });
  var topCats = Object.keys(catTotals)
    .sort(function(a,b){ return catTotals[b] - catTotals[a]; })
    .slice(0,3)
    .map(function(c){ return { cat:c, total:Math.round(catTotals[c]) }; });

  // Savings goal traction — % of each goal
  var goals = (Array.isArray(D.savingsGoals) ? D.savingsGoals : []).map(function(g){
    var pct = (g.target > 0) ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
    return { name:String(g.name || '').slice(0,40), pct:pct };
  });

  // Allowance shape — amount + cadence label only
  var allowance = null;
  if(D.allowanceConfig && D.allowanceConfig.enabled && Number(D.allowanceConfig.amount) > 0){
    allowance = {
      amount:    Number(D.allowanceConfig.amount),
      frequency: String(D.allowanceConfig.frequency || 'weekly')
    };
  }

  // Lessons — count completed of 8 (Inc 5 / D.moneyLessonsProgress)
  var lessonsCompleted = 0;
  if(D.moneyLessonsProgress && D.moneyLessonsProgress.completed){
    lessonsCompleted = Object.keys(D.moneyLessonsProgress.completed).length;
  }

  // Milestones earned in window (last 30d)
  var milestonesRecent = 0;
  if(D.moneyMilestones){
    milestonesRecent = Object.keys(D.moneyMilestones).filter(function(k){
      return D.moneyMilestones[k] >= floorISO;
    }).length;
  }

  var name = (D.name || (D.profile && D.profile.parentName) || 'friend').toString().slice(0,40);
  return {
    name:             name,
    days:             30,
    txCount:          inWindow.length,
    income:           Math.round(income),
    expense:          Math.round(expense),
    net:              Math.round(income - expense),
    topExpenseCats:   topCats,
    savingsGoals:     goals,
    allowance:        allowance,
    lessonsCompleted: lessonsCompleted,
    lessonsTotal:     8,
    milestonesRecent: milestonesRecent,
    bankBalance:      Math.round(Number(D.bank)||0),
    savingsBalance:   Math.round(Number(D.bankSavAcct)||0)
  };
}

async function fetchMoneyCoach(){
  if(!D.financeCoachLastWeek || typeof D.financeCoachLastWeek !== 'object'){
    D.financeCoachLastWeek = { weekKey:'', summary:'', focus:'', fetchedAt:0 };
  }
  var SIX_HOURS = 6 * 60 * 60 * 1000;
  var now = Date.now();
  if(D.financeCoachLastWeek.fetchedAt && (now - D.financeCoachLastWeek.fetchedAt) < SIX_HOURS){
    if(typeof showToast === 'function') showToast('Coach refreshed recently — try again later.');
    return;
  }
  var stats = _finCoachStats30d();
  if(stats.txCount === 0 && stats.lessonsCompleted === 0){
    // Don't burn an API call on an empty profile.
    D.financeCoachLastWeek = {
      weekKey:   _finCoachIsoWeek(),
      summary:   'No money activity yet — that\'s a clean slate. The first $1 saved is the hardest.',
      focus:     'Log one transaction this week. Even a tiny one. Start the pattern.',
      fetchedAt: now
    };
    save();
    if(typeof renderMoneyCoach === 'function') renderMoneyCoach();
    return;
  }
  var host = document.getElementById('moneyCoachCard');
  if(host){
    var body = host.querySelector('.mn-coach__body');
    if(body) body.innerHTML = '<div class="mn-coach__loading">Coach is reading the numbers…</div>';
  }
  try {
    var prompt = JSON.stringify(stats);
    var resp = await fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'money-coach', prompt: prompt })
    });
    var json = await resp.json();
    if(!json || !json.ok || !json.summary){
      throw new Error('Empty or malformed response');
    }
    D.financeCoachLastWeek = {
      weekKey:   _finCoachIsoWeek(),
      summary:   String(json.summary || '').slice(0, 500),
      focus:     String(json.focus   || '').slice(0, 200),
      fetchedAt: now
    };
    save();
    if(typeof renderMoneyCoach === 'function') renderMoneyCoach();
  } catch(e){
    console.debug('[money-coach] fetch failed:', e && e.message);
    if(host){
      var body2 = host.querySelector('.mn-coach__body');
      if(body2) body2.innerHTML = '<div class="mn-coach__err">Coach is offline right now. Try refresh in a minute.</div>';
    }
  }
}

function renderMoneyCoach(){
  var host = document.getElementById('moneyCoachCard');
  if(!host) return;
  if(!D.financeCoachLastWeek || typeof D.financeCoachLastWeek !== 'object'){
    D.financeCoachLastWeek = { weekKey:'', summary:'', focus:'', fetchedAt:0 };
  }
  var esc = function(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  };
  var stale = D.financeCoachLastWeek.weekKey !== _finCoachIsoWeek();
  var hasContent = !!(D.financeCoachLastWeek.summary);

  if(hasContent){
    host.innerHTML = ''
      + '<div class="mn-coach">'
      +   '<div class="mn-coach__head">'
      +     '<div class="mn-coach__title">💸 Your Money Coach</div>'
      +     '<button type="button" class="mn-coach__refresh" onclick="fetchMoneyCoach()" title="Refresh coach (max once per 6h)">↻</button>'
      +   '</div>'
      +   '<div class="mn-coach__body">'
      +     '<p class="mn-coach__summary">' + esc(D.financeCoachLastWeek.summary) + '</p>'
      +     (D.financeCoachLastWeek.focus
        ? '<p class="mn-coach__focus"><span class="mn-coach__focus-label">This week:</span> ' + esc(D.financeCoachLastWeek.focus) + '</p>'
        : '')
      +   '</div>'
      +   (stale ? '<div class="mn-coach__stale">New week — tap ↻ for a fresh read</div>' : '')
      + '</div>';
  } else {
    host.innerHTML = ''
      + '<div class="mn-coach mn-coach--empty">'
      +   '<div class="mn-coach__head">'
      +     '<div class="mn-coach__title">💸 Your Money Coach</div>'
      +     '<button type="button" class="mn-coach__refresh" onclick="fetchMoneyCoach()" title="Get my first coaching">↻</button>'
      +   '</div>'
      +   '<div class="mn-coach__body">'
      +     '<p class="mn-coach__summary">No coaching yet. Tap ↻ once you\'ve logged a few transactions and I\'ll show you the pattern.</p>'
      +   '</div>'
      + '</div>';
  }
}

function _maybeAutoFetchMoneyCoach(){
  if(!D.financeCoachLastWeek || typeof D.financeCoachLastWeek !== 'object') return;
  var stale = D.financeCoachLastWeek.weekKey !== _finCoachIsoWeek();
  if(!stale) return;
  var s = _finCoachStats30d();
  // Auto-fetch only when there's meaningful activity to coach about —
  // empty profiles get the friendly stub via the manual ↻ path instead.
  if(s.txCount < 2 && s.lessonsCompleted < 1) return;
  fetchMoneyCoach();
}