/* =============================================================
   habits.js — Habits tab (Faith-style sub-tab system).

   State model (Commit 1 — JSONB-blob backed):
     D.habitsV2 = [{
       id, name, emoji, category, timeOfDay,
       cue, stackAfter, createdAt, completions: {YYYY-MM-DD: true}
     }, ...]

   Why a new key instead of overhauling D.checkin/D.customHabits:
   the existing dashboard "Daily W's" widget (ui.js buildCheckins)
   keeps using D.checkin so it does NOT break during this rollout.
   The Habits tab is the new first-class surface; the dashboard
   widget will be retired or rewired in a later commit.

   A Supabase-tables migration lands in Commit 3.
============================================================= */

// ── CONSTANTS ────────────────────────────────────────────────
const HABIT_TIME_ORDER  = ['morning','afternoon','evening','anytime'];
const HABIT_TIME_LABELS = {
  morning:   '🌅 Morning',
  afternoon: '☀️ Afternoon',
  evening:   '🌙 Evening',
  anytime:   '⚡ Anytime',
};
const HABIT_TIME_DESCS = {
  morning:   'Right after you wake up',
  afternoon: 'Sometime midday',
  evening:   'Before bed wind-down',
  anytime:   'Whenever it fits',
};

// 30 rotating taglines (~one per day of the month) — habit-science framing.
const HABIT_TAGLINES = [
  "Small habits, big compound.",
  "You don't rise to your goals. You fall to your systems.",
  "Habits are the compound interest of self-improvement.",
  "1% better every day is 37x better in a year.",
  "Identity, not outcomes. Become the person who does the habit.",
  "The 2-minute rule: start so small you can't say no.",
  "Make it obvious. Make it attractive. Make it easy. Make it satisfying.",
  "Motivation follows action — not the other way around.",
  "You don't need more time. You need more reps.",
  "Consistency beats intensity. Every day. Forever.",
  "Never miss twice.",
  "Your environment is shaping you. Shape it back.",
  "What you repeat, you become.",
  "Sow a habit, reap a character.",
  "Discipline equals freedom.",
  "Don't break the chain.",
  "The plateau of latent potential — you're closer than it feels.",
  "Tiny gains, hidden until they aren't.",
  "Be patient. The seed needs time underground.",
  "Show up on the bad days. That's the whole game.",
  "Implementation intention: when X, then Y.",
  "Stack a new habit on top of an old one.",
  "Habits are how you vote for the person you want to be.",
  "If it's worth doing, it's worth doing badly at first.",
  "Done is better than perfect. Repeated is better than done.",
  "The hardest part is starting. Just put on the shoes.",
  "You are your habits. Choose them carefully.",
  "Make the cue visible. Make the friction invisible.",
  "Track the streak. Trust the system.",
  "Be the kind of person who doesn't miss.",
];

// Milestone badges (cumulative single-habit streak thresholds).
const HABIT_BADGE_TIERS = [
  {days:7,   name:'Week One',     icon:'⭐', color:'#38bdf8'},
  {days:21,  name:'Three Weeks',  icon:'🔥', color:'#fb923c'},
  {days:30,  name:'One Month',    icon:'🏆', color:'#fbbf24'},
  {days:66,  name:'Formed',       icon:'💎', color:'#22d3ee'},
  {days:100, name:'Centurion',    icon:'👑', color:'#a78bfa'},
];

// ── INIT + SEED ──────────────────────────────────────────────
function initHabitsData(){
  if(!Array.isArray(D.habitsV2)) D.habitsV2 = [];
  if(!D._habitsV2Seeded && D.habitsV2.length === 0){
    // Seed from the existing dashboard widget so a returning user
    // arrives with their familiar habits already present.
    const defaults = (typeof DEFAULT_HABITS !== 'undefined') ? DEFAULT_HABITS : [];
    const custom   = Array.isArray(D.customHabits) ? D.customHabits : [];
    const merged   = [...defaults, ...custom];
    D.habitsV2 = merged.map((h, idx) => {
      const lbl = h.label || h.key || ('Habit ' + (idx+1));
      const emoji = (typeof lbl === 'string' && lbl.length)
        ? (lbl.match(/^\p{Extended_Pictographic}/u) ? lbl[0] : pickEmojiForKey(h.key))
        : '✅';
      return {
        id:        'hbt_seed_' + (h.key || idx),
        name:      stripLeadingEmoji(lbl),
        emoji:     emoji,
        category:  h.faithOnly ? 'Faith' : 'Health',
        timeOfDay: pickTimeForKey(h.key),
        cue:       '',
        stackAfter:null,
        createdAt: Date.now(),
        completions: backfillCompletionsForKey(h.key),
      };
    });
    D._habitsV2Seeded = true;
  }
}

function pickEmojiForKey(key){
  const map = {
    prayer:'🙏', bible:'📖', workout:'💪', water:'💧',
    'no-doom-scroll':'📵', journal:'✍️', study:'📚',
    gratitude:'🌟', sleep:'😴', tithe:'💝',
  };
  return map[key] || '✅';
}

function pickTimeForKey(key){
  const map = {
    prayer:'morning', bible:'morning', water:'morning', gratitude:'evening',
    workout:'afternoon', study:'afternoon',
    journal:'evening', sleep:'evening', 'no-doom-scroll':'evening',
    tithe:'anytime',
  };
  return map[key] || 'anytime';
}

function stripLeadingEmoji(s){
  if(typeof s !== 'string') return String(s||'');
  return s.replace(/^\p{Extended_Pictographic}\s*/u, '').trim() || s;
}

// Backfill existing D.checkin into the new habit. D.checkin keys are
// JS toDateString() format ("Fri May 22 2026") — translate to ISO YYYY-MM-DD.
function backfillCompletionsForKey(key){
  const out = {};
  if(!key || !D.checkin) return out;
  Object.keys(D.checkin).forEach(dateStr => {
    if(D.checkin[dateStr] && D.checkin[dateStr][key]){
      const dt = new Date(dateStr);
      if(!isNaN(dt.getTime())){
        out[localDateString(dt)] = true;
      }
    }
  });
  return out;
}

// ── HABIT CRUD ───────────────────────────────────────────────
function addHabitV2(name, emoji, timeOfDay, category, cue){
  initHabitsData();
  const id = 'hbt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,6);
  D.habitsV2.push({
    id,
    name:      String(name||'New Habit').slice(0,80),
    emoji:     emoji || '✅',
    category:  category || 'Health',
    timeOfDay: HABIT_TIME_ORDER.indexOf(timeOfDay) >= 0 ? timeOfDay : 'anytime',
    cue:       String(cue||'').slice(0,80),
    stackAfter:null,
    createdAt: Date.now(),
    completions: {},
  });
  save();
  renderHabitsAll();
  if(typeof showToast === 'function') showToast('Habit added ' + (emoji||'✅'));
  return id;
}

function removeHabitV2(id){
  initHabitsData();
  if(!confirm('Remove this habit and its streak history?')) return;
  D.habitsV2 = D.habitsV2.filter(h => h.id !== id);
  save();
  renderHabitsAll();
}

function toggleHabitV2Today(id){
  initHabitsData();
  const h = D.habitsV2.find(x => x.id === id);
  if(!h) return;
  if(!h.completions) h.completions = {};
  const today = localDateString();
  if(h.completions[today]){
    delete h.completions[today];
  } else {
    h.completions[today] = true;
    if(typeof launchSideConfetti === 'function') launchSideConfetti();
    if(typeof logActivity === 'function') logActivity('habit', 'Habit: ' + h.name);
  }
  save();
  renderHabitsToday();
  renderHabitsHero();
}

function openAddHabit(){
  const name = prompt('New habit name (e.g. "Drink water"):');
  if(!name || !name.trim()) return;
  const emoji = prompt('Emoji for this habit (one character):', '✅') || '✅';
  const t = prompt('When? Type morning / afternoon / evening / anytime:', 'anytime');
  const timeOfDay = HABIT_TIME_ORDER.indexOf((t||'').toLowerCase()) >= 0 ? t.toLowerCase() : 'anytime';
  addHabitV2(name.trim(), emoji.trim().charAt(0) || '✅', timeOfDay, 'Custom', '');
}

// ── STREAK MATH ──────────────────────────────────────────────
function getHabitCurrentStreak(h){
  if(!h || !h.completions) return 0;
  let streak = 0;
  const cursor = new Date();
  const todayKey = localDateString(cursor);
  const todayDone = !!h.completions[todayKey];
  // If today isn't done yet, the "current" streak runs through yesterday
  // (don't punish the user mid-day).
  if(!todayDone) cursor.setDate(cursor.getDate() - 1);
  while(true){
    const key = localDateString(cursor);
    if(h.completions[key]){
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getHabitLongestStreak(h){
  if(!h || !h.completions) return 0;
  const keys = Object.keys(h.completions).filter(k => h.completions[k]).sort();
  if(!keys.length) return 0;
  let longest = 1, run = 1;
  for(let i=1; i<keys.length; i++){
    const prev = new Date(keys[i-1] + 'T00:00:00');
    const cur  = new Date(keys[i]   + 'T00:00:00');
    const diffDays = Math.round((cur - prev) / 86400000);
    if(diffDays === 1){ run++; if(run > longest) longest = run; }
    else { run = 1; }
  }
  return longest;
}

function getHabitTotalCompletions(h){
  if(!h || !h.completions) return 0;
  return Object.values(h.completions).filter(v => v).length;
}

// ── SUB-TAB ROUTING ──────────────────────────────────────────
function habitsTab(name, btn){
  const panels = document.querySelectorAll('#s-habits .hb-panel');
  panels.forEach(p => p.style.display = 'none');
  const tabs = document.querySelectorAll('#s-habits .hb-tab');
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
  const target = document.getElementById('hb-' + name);
  if(target) target.style.display = '';
  if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); }
  if(name === 'today')        renderHabitsToday();
  else if(name === 'streaks') renderHabitsStreaks();
}

// ── HERO ─────────────────────────────────────────────────────
function renderHabitsHero(){
  const el = document.getElementById('habitsHero');
  if(!el) return;
  initHabitsData();
  const habits = D.habitsV2 || [];
  const today  = localDateString();
  const doneT  = habits.filter(h => (h.completions||{})[today]).length;
  const total  = habits.length;
  const pct    = total > 0 ? Math.round((doneT/total)*100) : 0;

  // Tagline rotates daily — same all day, fresh tomorrow.
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
  const tagline = HABIT_TAGLINES[dayOfYear % HABIT_TAGLINES.length];

  const r = 34;
  const C = 2 * Math.PI * r;
  const dash = (pct/100) * C;

  el.innerHTML = `
    <div style="
      background:linear-gradient(135deg,rgba(52,211,153,.18),rgba(56,189,248,.10));
      border:1px solid rgba(52,211,153,.22);
      border-radius:16px;padding:1.1rem 1.2rem;margin-bottom:1rem;
      display:flex;gap:1.1rem;align-items:center;">
      <svg width="84" height="84" viewBox="0 0 84 84" style="flex-shrink:0;">
        <circle cx="42" cy="42" r="${r}" stroke="rgba(255,255,255,.10)" stroke-width="7" fill="none"/>
        <circle cx="42" cy="42" r="${r}" stroke="#34d399" stroke-width="7" fill="none"
                stroke-linecap="round"
                stroke-dasharray="${dash} ${C-dash}"
                transform="rotate(-90 42 42)"
                style="transition:stroke-dasharray .6s ease;"/>
        <text x="42" y="42" text-anchor="middle" dominant-baseline="central"
              fill="var(--tx)" font-size="1.1rem" font-weight="800"
              font-family="var(--fn)">${pct}%</text>
      </svg>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.62rem;font-weight:800;letter-spacing:1.5px;color:#34d399;margin-bottom:.3rem;">
          ${doneT} / ${total} DONE TODAY
        </div>
        <div style="font-size:.95rem;font-weight:600;color:var(--tx);line-height:1.4;">
          ${escapeHtml(tagline)}
        </div>
      </div>
    </div>
  `;
}

// ── TODAY PANEL ──────────────────────────────────────────────
function renderHabitsToday(){
  const wrap = document.getElementById('habitsTodayByTime');
  if(!wrap) return;
  initHabitsData();
  const habits = D.habitsV2 || [];
  if(!habits.length){
    wrap.innerHTML = renderHabitsEmptyState();
    return;
  }
  const today = localDateString();
  const byTime = {morning:[], afternoon:[], evening:[], anytime:[]};
  habits.forEach(h => {
    const t = byTime[h.timeOfDay] ? h.timeOfDay : 'anytime';
    byTime[t].push(h);
  });

  const groups = HABIT_TIME_ORDER.map(t => {
    const list = byTime[t];
    if(!list.length) return '';
    return `
      <div class="hb-group" style="margin-bottom:1rem;">
        <div style="display:flex;align-items:baseline;gap:.5rem;margin-bottom:.5rem;">
          <div style="font-family:var(--fh);font-size:.78rem;letter-spacing:1.5px;font-weight:800;color:var(--tx);">${HABIT_TIME_LABELS[t]}</div>
          <div style="font-size:.62rem;color:var(--tx3);">${HABIT_TIME_DESCS[t]}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.5rem;">
          ${list.map(h => renderHabitTile(h, today)).join('')}
        </div>
      </div>
    `;
  }).join('');

  wrap.innerHTML = groups + `
    <div style="margin-top:1rem;display:flex;gap:.5rem;justify-content:center;">
      <button class="btn bp" onclick="openAddHabit()" style="font-size:.7rem;padding:.45rem 1rem;border-radius:10px;">
        + New habit
      </button>
    </div>
  `;
}

function renderHabitTile(h, today){
  const done   = !!(h.completions||{})[today];
  const streak = getHabitCurrentStreak(h);
  const flame  = streak >= 3 ? `<span style="font-size:.85rem;">🔥</span><span style="font-size:.7rem;font-weight:800;color:#fb923c;">${streak}</span>` : '';
  const bg     = done
    ? 'background:linear-gradient(135deg,rgba(52,211,153,.18),rgba(34,197,94,.08));border:1.5px solid #34d399;'
    : 'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);';
  return `
    <div onclick="toggleHabitV2Today('${escapeHtml(h.id)}')"
         class="hb-tile${done?' hb-tile-done':''}"
         style="${bg}padding:.7rem .85rem;border-radius:12px;cursor:pointer;
                display:flex;align-items:center;gap:.65rem;transition:all .2s;">
      <div style="width:28px;height:28px;border-radius:8px;
                  background:${done?'#34d399':'rgba(255,255,255,.06)'};
                  display:flex;align-items:center;justify-content:center;
                  font-size:.95rem;flex-shrink:0;">
        ${done ? '<svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5L5 9L13 1" stroke="#0a1f5e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' : escapeHtml(h.emoji||'✅')}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.82rem;font-weight:600;color:var(--tx);
                    ${done?'text-decoration:line-through;opacity:.7;':''}
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${escapeHtml(h.name)}
        </div>
        ${h.cue ? `<div style="font-size:.6rem;color:var(--tx3);margin-top:.1rem;">${escapeHtml(h.cue)}</div>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:.25rem;flex-shrink:0;">
        ${flame}
        <button onclick="event.stopPropagation();removeHabitV2('${escapeHtml(h.id)}')"
                style="background:none;border:none;color:var(--tx3);cursor:pointer;
                       font-size:.85rem;padding:0 .2rem;opacity:.5;"
                title="Remove habit">×</button>
      </div>
    </div>
  `;
}

function renderHabitsEmptyState(){
  return `
    <div style="padding:2.5rem 1.5rem;text-align:center;
                background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.1);
                border-radius:14px;">
      <div style="font-size:2.4rem;margin-bottom:.5rem;">⚡</div>
      <div style="font-family:var(--fh);font-size:.95rem;font-weight:800;letter-spacing:1px;color:var(--tx);margin-bottom:.4rem;">
        START WITH ONE HABIT
      </div>
      <div style="font-size:.78rem;color:var(--tx2);max-width:380px;margin:0 auto 1rem;line-height:1.55;">
        The 2-minute rule: pick something so small you can't say no.
        Drink one glass of water. Read one page. Do one push-up.
      </div>
      <button class="btn bp" onclick="openAddHabit()" style="font-size:.75rem;padding:.55rem 1.4rem;border-radius:10px;">
        + Add your first habit
      </button>
    </div>
  `;
}

// ── STREAKS PANEL ────────────────────────────────────────────
function renderHabitsStreaks(){
  initHabitsData();
  const habits = D.habitsV2 || [];

  // 1. Summary cards (current + longest across all habits)
  const summary = document.getElementById('habitsStreakSummary');
  if(summary){
    if(!habits.length){
      summary.innerHTML = '<div style="font-size:.78rem;color:var(--tx3);text-align:center;padding:1rem;">Add habits in the Today tab to see streak data.</div>';
    } else {
      const cards = habits.map(h => {
        const cur = getHabitCurrentStreak(h);
        const lng = getHabitLongestStreak(h);
        const tot = getHabitTotalCompletions(h);
        return `
          <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
                      border-radius:12px;padding:.8rem;">
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
              <span style="font-size:1.1rem;">${escapeHtml(h.emoji||'✅')}</span>
              <span style="font-size:.78rem;font-weight:700;color:var(--tx);flex:1;
                           white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${escapeHtml(h.name)}
              </span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;text-align:center;">
              <div>
                <div style="font-size:1.1rem;font-weight:800;color:#fb923c;font-family:var(--fn);">${cur}</div>
                <div style="font-size:.52rem;letter-spacing:1px;color:var(--tx3);font-weight:700;">CURRENT 🔥</div>
              </div>
              <div>
                <div style="font-size:1.1rem;font-weight:800;color:#fbbf24;font-family:var(--fn);">${lng}</div>
                <div style="font-size:.52rem;letter-spacing:1px;color:var(--tx3);font-weight:700;">LONGEST</div>
              </div>
              <div>
                <div style="font-size:1.1rem;font-weight:800;color:#34d399;font-family:var(--fn);">${tot}</div>
                <div style="font-size:.52rem;letter-spacing:1px;color:var(--tx3);font-weight:700;">TOTAL</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      summary.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.6rem;">
          ${cards}
        </div>
      `;
    }
  }

  // 2. 66-day formation tracker (longest current streak across all habits)
  const tracker66 = document.getElementById('habits66Tracker');
  if(tracker66){
    const bestCurrent = habits.reduce((m,h)=>Math.max(m, getHabitCurrentStreak(h)), 0);
    const pct = Math.min(100, Math.round((bestCurrent/66)*100));
    tracker66.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(34,211,238,.10),rgba(167,139,250,.06));
                  border:1px solid rgba(34,211,238,.22);border-radius:14px;
                  padding:1rem 1.1rem;margin:1rem 0;">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
          <span style="font-size:1.3rem;">💎</span>
          <div style="flex:1;">
            <div style="font-family:var(--fh);font-size:.72rem;letter-spacing:1.5px;font-weight:800;color:#22d3ee;">
              66-DAY FORMATION TRACKER
            </div>
            <div style="font-size:.65rem;color:var(--tx3);margin-top:.1rem;">
              Research average for a behaviour to feel automatic (Lally et al., 2010).
            </div>
          </div>
          <div style="font-size:1.1rem;font-weight:800;color:#22d3ee;font-family:var(--fn);">${bestCurrent}/66</div>
        </div>
        <div style="background:rgba(255,255,255,.06);height:8px;border-radius:6px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;
                      background:linear-gradient(90deg,#22d3ee,#a78bfa);
                      border-radius:6px;transition:width .6s ease;"></div>
        </div>
        ${bestCurrent >= 66
          ? '<div style="font-size:.68rem;color:#22d3ee;font-weight:700;margin-top:.4rem;">💎 Formed. Behaviour is now part of who you are.</div>'
          : `<div style="font-size:.62rem;color:var(--tx3);margin-top:.4rem;">${66 - bestCurrent} day${(66-bestCurrent)===1?'':'s'} to go on your strongest streak.</div>`
        }
      </div>
    `;
  }

  // 3. 12-week completion heatmap (all habits combined)
  const heatmap = document.getElementById('habitsHeatmap');
  if(heatmap){
    heatmap.innerHTML = buildHabitsHeatmap(habits, 12);
  }

  // 4. Milestone badges earned
  const badges = document.getElementById('habitsBadges');
  if(badges){
    const earned = new Set();
    habits.forEach(h => {
      const lng = getHabitLongestStreak(h);
      HABIT_BADGE_TIERS.forEach(t => { if(lng >= t.days) earned.add(t.days); });
    });
    badges.innerHTML = `
      <div style="font-family:var(--fh);font-size:.72rem;letter-spacing:1.5px;font-weight:800;color:var(--tx);margin:1rem 0 .5rem;">
        🏅 MILESTONE BADGES
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:.5rem;">
        ${HABIT_BADGE_TIERS.map(t => {
          const got = earned.has(t.days);
          return `
            <div style="background:${got ? t.color+'18' : 'rgba(255,255,255,.03)'};
                        border:1px solid ${got ? t.color+'55' : 'rgba(255,255,255,.06)'};
                        border-radius:12px;padding:.7rem .5rem;text-align:center;
                        opacity:${got?1:.45};transition:all .3s;">
              <div style="font-size:1.6rem;${got?'':'filter:grayscale(1);'}">${t.icon}</div>
              <div style="font-size:.68rem;font-weight:800;color:${got?t.color:'var(--tx3)'};margin-top:.2rem;">
                ${t.name}
              </div>
              <div style="font-size:.55rem;color:var(--tx3);margin-top:.1rem;">${t.days} days</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// 12-week heatmap. Today is bottom-right cell. Weeks go left-to-right oldest-to-newest.
function buildHabitsHeatmap(habits, weeks){
  const totalDays = weeks * 7;
  const today = new Date();
  const cells = [];

  // For each habit on each day, count completion. Intensity = day's completion % across habits.
  for(let i = totalDays - 1; i >= 0; i--){
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = localDateString(d);
    const tot = habits.length || 1;
    const done = habits.filter(h => (h.completions||{})[key]).length;
    const pct = done / tot;
    cells.push({date: key, pct, done, total: habits.length});
  }

  // Render as inline SVG grid.
  const cell = 14, gap = 3, padX = 8, padY = 22;
  const cols = weeks, rows = 7;
  const W = padX*2 + cols*(cell+gap) - gap;
  const H = padY + padX + rows*(cell+gap) - gap;

  const intensityColor = pct => {
    if(pct <= 0)    return 'rgba(255,255,255,.04)';
    if(pct < 0.25)  return 'rgba(52,211,153,.22)';
    if(pct < 0.5)   return 'rgba(52,211,153,.45)';
    if(pct < 0.75)  return 'rgba(52,211,153,.7)';
    return '#34d399';
  };

  const svg = [`
    <svg width="100%" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="max-width:520px;">
      <text x="${padX}" y="14" fill="var(--tx2)" font-size="9" font-weight="700" font-family="var(--fn)" letter-spacing="1.2">
        12-WEEK COMPLETION HEATMAP
      </text>`];
  cells.forEach((c, idx) => {
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const x = padX + col * (cell + gap);
    const y = padY + row * (cell + gap);
    svg.push(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="${intensityColor(c.pct)}"><title>${c.date}: ${c.done}/${c.total||0}</title></rect>`);
  });
  // Legend
  const legendY = H - 4;
  svg.push(`<text x="${padX}" y="${legendY}" fill="var(--tx3)" font-size="7.5" font-family="var(--fn)">less</text>`);
  ['rgba(255,255,255,.04)','rgba(52,211,153,.22)','rgba(52,211,153,.45)','rgba(52,211,153,.7)','#34d399'].forEach((c,i)=>{
    svg.push(`<rect x="${padX + 22 + i*9}" y="${legendY-7}" width="7" height="7" rx="1.5" fill="${c}"/>`);
  });
  svg.push(`<text x="${padX + 22 + 5*9 + 3}" y="${legendY}" fill="var(--tx3)" font-size="7.5" font-family="var(--fn)">more</text>`);
  svg.push('</svg>');
  return `
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);
                border-radius:14px;padding:.9rem 1rem;margin-top:1rem;">
      ${svg.join('')}
      <div style="font-size:.62rem;color:var(--tx3);margin-top:.4rem;">
        Each cell is one day across the last ${weeks} weeks. Greener = higher % of your habits completed that day.
      </div>
    </div>
  `;
}

// ── ENTRY POINTS ─────────────────────────────────────────────
function renderHabitsAll(){
  renderHabitsHero();
  renderHabitsToday();
  // Re-render Streaks lazily on tab switch.
}

function initHabits(){
  initHabitsData();
  renderHabitsHero();
  renderHabitsToday();
}

// Expose globals (vanilla-JS, no modules).
window.initHabits           = initHabits;
window.habitsTab            = habitsTab;
window.toggleHabitV2Today   = toggleHabitV2Today;
window.addHabitV2           = addHabitV2;
window.removeHabitV2        = removeHabitV2;
window.openAddHabit         = openAddHabit;
window.renderHabitsHero     = renderHabitsHero;
window.renderHabitsToday    = renderHabitsToday;
window.renderHabitsStreaks  = renderHabitsStreaks;
