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
      <div style="flex:1;"><div style="font-weight:700;font-size:.87rem;${b.paid?'text-decoration:line-through;':''}">${b.name}</div>
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
      <div style="flex:1;"><div style="font-weight:700;font-size:.85rem;">${t.name}</div>
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

function addToGoal(id){ const a=parseFloat(prompt('Amount to add ($):')); if(isNaN(a)||a<=0) return; const g=(D.savingsGoals||[]).find(g=>g.id===id); if(!g) return; g.current=(g.current||0)+a; save(); renderSavingsTab(); renderSavGoalCards(); updateFinSum(); showToast('+$'+a+' added! 💚'); }
function editSavGoal(id){ const g=(D.savingsGoals||[]).find(g=>g.id===id); if(!g) return; const n=prompt('Goal name:',g.name); if(!n) return; const t=parseFloat(prompt('Target ($):',g.target)); if(!isNaN(t)) g.target=t; g.name=n.trim(); save(); renderSavingsTab(); renderSavGoalCards(); }
function delSavGoal(id){ if(!confirm('Delete this goal?')) return; D.savingsGoals=(D.savingsGoals||[]).filter(g=>g.id!==id); save(); renderSavingsTab(); renderSavGoalCards(); updateFinSum(); }

function renderSavGoalCards(){
  const el=document.getElementById('savGoalCards'); if(!el) return;
  el.innerHTML=(D.savingsGoals||[]).map(g=>{
    const pct=Math.min(100,((g.current||0)/g.target)*100);
    return`<div class="card" style="border-top:3px solid var(--gr);">
      <span style="font-size:1.55rem;display:block;margin-bottom:.4rem;">${g.emoji}</span>
      <div style="font-weight:700;font-size:.95rem;margin-bottom:.48rem;">${g.name}</div>
      <div style="display:flex;gap:.4rem;align-items:baseline;font-size:.82rem;margin-bottom:.35rem;">
        <span style="color:var(--gr);font-weight:800;font-family:var(--fn);">$${(g.current||0).toLocaleString()}</span>
        <span style="color:#c8d4e8;">/ $${g.target.toLocaleString()}</span>
        <span style="color:var(--gr);font-family:var(--fn);font-weight:700;margin-left:auto;">${pct.toFixed(0)}%</span>
      </div>
      <div class="pt" style="height:7px;margin-bottom:.65rem;"><div class="pf" style="background:var(--gr);width:${pct}%;"></div></div>
      <div style="display:flex;gap:.32rem;">
        <button class="btn bgr bs" style="flex:1;" onclick="addToGoal(${g.id})">+ Add</button>
        <button class="btn bgh bs" onclick="editSavGoal(${g.id})">✎</button>
        <button class="btn bda bs" onclick="delSavGoal(${g.id})">✕</button>
      </div>
    </div>`;
  }).join('');
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
  if(sel) sel.innerHTML=goals.map(g=>`<option value="${g.id}">${g.emoji} ${g.name}</option>`).join('');
  const det=document.getElementById('savDetailCards'); if(!det) return;
  det.innerHTML=goals.map(g=>{
    const p=Math.min(100,((g.current||0)/g.target)*100);
    const col=p>=75?'var(--gr)':p>=40?'var(--c)':'var(--g)';
    return`<div class="card" style="border-top:3px solid ${col};">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;">
        <span style="font-size:1.35rem;">${g.emoji}</span>
        <div style="flex:1;"><div style="font-weight:800;font-size:.9rem;">${g.name}</div>
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

