/* =============================================================
   finance.js — Money manager, transactions, savings goals,
               budgeting, allowance, earnings
============================================================= */

// ── FINANCE ──────────────────────────────────────────────────
function mTab(tab,btn){
  document.querySelectorAll('[id^="mt-"]').forEach(t=>t.style.display='none');
  document.querySelectorAll('.moneyTabs .tab').forEach(b=>b.classList.remove('active'));
  const te=document.getElementById('mt-'+tab); if(te) te.style.display='block';
  if(btn) btn.classList.add('active');
  if(tab==='savings') renderSavingsTab();
  if(tab==='savgoals') renderSavGoalCards();
  if(tab==='budget') calcBudget();
  if(tab==='bills') renderBills();
  if(tab==='tx') renderTx();
  if(tab==='taxed') calcTax();
  // Phase C-Finance additions
  if(tab==='overview') renderSpendingDonut();
  if(tab==='paycheck') calcPaycheckSim();
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

function addTx(){
  const name=(document.getElementById('txName').value||'').trim();
  const amt=parseFloat(document.getElementById('txAmt').value);
  const type=document.getElementById('txType').value;
  const cat=document.getElementById('txCat').value;
  const date=document.getElementById('txDate').value||new Date().toISOString().split('T')[0];
  if(!name||isNaN(amt)||amt<=0){showToast('Enter description and amount');return;}
  if(!D.transactions) D.transactions=[];
  D.transactions.unshift({id:Date.now(),name,amt,type,cat,date});
  document.getElementById('txName').value=''; document.getElementById('txAmt').value='';
  save(); renderTx(); updateFinSum(); showToast('Logged!');
}

function filterTx(type,btn){ _txFilter=type; document.querySelectorAll('.txf').forEach(b=>b.classList.remove('active')); if(btn) btn.classList.add('active'); renderTx(); }
function editTx(id){ const t=(D.transactions||[]).find(t=>t.id===id); if(!t) return; const n=prompt('Description:',t.name); if(!n) return; const a=parseFloat(prompt('Amount:',t.amt)); if(!isNaN(a)) t.amt=a; t.name=n.trim(); save(); renderTx(); updateFinSum(); }
function deleteTx(id){ D.transactions=(D.transactions||[]).filter(t=>t.id!==id); save(); renderTx(); updateFinSum(); }

function renderTx(){
  const el=document.getElementById('txList'); if(!el) return;
  const list=(D.transactions||[]).filter(t=>_txFilter==='all'||t.type===_txFilter);
  if(!list.length){el.innerHTML='<div style="font-size:.82rem;color:#c8d4e8;text-align:center;padding:1rem;">No transactions yet</div>';return;}
  const cols={income:'var(--c)',expense:'var(--pk)',savings:'var(--gr)'};
  el.innerHTML=list.slice(0,80).map(t=>`
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
  // Show overview tab by default, render stats
  document.querySelectorAll('[id^="mt-"]').forEach(t=>t.style.display='none');
  const ov = document.getElementById('mt-overview');
  if(ov) ov.style.display='block';
  // Set overview tab as active
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
function editSavGoal(id){ const g=(D.savingsGoals||[]).find(g=>g.id===id); if(!g) return; const n=prompt('Goal name:',g.name); if(!n) return; const t=parseFloat(prompt('Target ($):',g.target)); if(!isNaN(t)) g.target=t; g.name=n.trim(); save(); renderSavingsTab(); renderSavGoalCards(); }
function delSavGoal(id){ if(!confirm('Delete this goal?')) return; D.savingsGoals=(D.savingsGoals||[]).filter(g=>g.id!==id); save(); renderSavingsTab(); renderSavGoalCards(); updateFinSum(); }

function renderSavGoalCards(){
  // Phase C-Finance: SVG progress rings replace the linear bars. Card layout
  // stays the same so the existing edit/delete actions are unchanged.
  const el = document.getElementById('savGoalCards');
  if(!el) return;
  el.innerHTML = (D.savingsGoals||[]).map(g => {
    const pct = Math.min(100, ((g.current||0) / g.target) * 100);
    const done = pct >= 100;
    const ringColor = done ? 'var(--gr)' : 'var(--section-finance)';
    return '<div class="card" style="border-top:3px solid var(--section-finance);">'
      + '<div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.7rem;">'
      +   '<span style="font-size:1.5rem;flex-shrink:0;">'+g.emoji+'</span>'
      +   '<div style="flex:1;min-width:0;">'
      +     '<div style="font-weight:700;font-size:.95rem;line-height:1.2;">'+escapeHtml(g.name)+'</div>'
      +     '<div style="font-size:.74rem;color:var(--tx2);margin-top:.15rem;font-family:var(--fn);">$'+(g.current||0).toLocaleString()+' / $'+g.target.toLocaleString()+'</div>'
      +   '</div>'
      + '</div>'
      + '<div style="display:flex;justify-content:center;margin-bottom:.7rem;">'
      +   svgProgressRing(pct, 96, ringColor)
      + '</div>'
      + (done
          ? '<div style="text-align:center;font-size:.78rem;color:var(--gr);font-weight:700;margin-bottom:.6rem;">🎉 Goal reached!</div>'
          : '<div style="text-align:center;font-size:.72rem;color:var(--tx2);margin-bottom:.6rem;">$'+Math.max(0, g.target-(g.current||0)).toLocaleString()+' to go</div>')
      + '<div style="display:flex;gap:.32rem;">'
      +   '<button class="btn bgr bs" style="flex:1;" onclick="addToGoal('+g.id+')">+ Add</button>'
      +   '<button class="btn bgh bs" onclick="editSavGoal('+g.id+')">✎</button>'
      +   '<button class="btn bda bs" onclick="delSavGoal('+g.id+')">✕</button>'
      + '</div>'
      + '</div>';
  }).join('');
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

