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
  if(name === 'today')          renderHabitsToday();
  else if(name === 'streaks')   renderHabitsStreaks();
  else if(name === 'analytics') renderHabitsAnalytics();
  else if(name === 'stack')     renderHabitsStack();
  else if(name === 'library')   renderHabitsLibrary();
  else if(name === 'science')   renderHabitsScience();
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

// ── ANALYTICS PANEL ──────────────────────────────────────────
// Chart instances are kept on a single window-scoped registry so the next
// renderHabitsAnalytics() call can destroy them before re-creating —
// otherwise Chart.js leaks canvases and ghost-redraws on hover.
const HB_CHARTS = {};

function destroyHbChart(key){
  if(HB_CHARTS[key] && typeof HB_CHARTS[key].destroy === 'function'){
    try { HB_CHARTS[key].destroy(); } catch(_) {}
  }
  HB_CHARTS[key] = null;
}

function renderHabitsAnalytics(){
  initHabitsData();
  const habits = D.habitsV2 || [];

  // ── KPI strip ──
  const kpi = document.getElementById('habitsKpi');
  if(kpi){
    const wkThis = getWeekRange(0);
    const wkLast = getWeekRange(7);
    const pctThis = completionPctInRange(habits, wkThis.start, wkThis.end);
    const pctLast = completionPctInRange(habits, wkLast.start, wkLast.end);
    const longest = habits.reduce((m,h)=>Math.max(m, getHabitLongestStreak(h)), 0);
    const total   = habits.reduce((s,h)=>s + getHabitTotalCompletions(h), 0);
    const delta   = pctThis - pctLast;
    const deltaStr = delta === 0 ? '—' : (delta > 0 ? '↑ ' + delta + '%' : '↓ ' + Math.abs(delta) + '%');
    const deltaColor = delta > 0 ? '#22c55e' : (delta < 0 ? '#f87171' : 'var(--tx3)');

    kpi.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.6rem;margin-bottom:1rem;">
        ${kpiCard('This Week', pctThis + '%', deltaStr, deltaColor, '📈')}
        ${kpiCard('Last Week', pctLast + '%', '', 'var(--tx3)', '📅')}
        ${kpiCard('Longest Streak', longest + ' days', '', '#fb923c', '🔥')}
        ${kpiCard('Total Done', String(total), 'all time', 'var(--tx3)', '✅')}
      </div>
    `;
  }

  if(!habits.length){
    const empty = document.getElementById('habitsAnalyticsEmpty');
    if(empty){
      empty.style.display = '';
      empty.innerHTML = '<div class="hb-stub">Add habits in the Today tab to unlock analytics.</div>';
    }
    return;
  }
  const empty = document.getElementById('habitsAnalyticsEmpty');
  if(empty) empty.style.display = 'none';

  if(typeof Chart === 'undefined'){
    const wrap = document.getElementById('habitsChartsWrap');
    if(wrap) wrap.innerHTML = '<div class="hb-stub">Chart library failed to load. Refresh the page and try again.</div>';
    return;
  }

  // ── Weekly completion (7 bars: Mon–Sun of current ISO-ish week) ──
  const cvWeek = document.getElementById('hbChartWeekly');
  if(cvWeek){
    destroyHbChart('weekly');
    const labels = [];
    const data = [];
    const wkThis = getWeekRange(0);
    const dt = new Date(wkThis.start);
    for(let i = 0; i < 7; i++){
      const key = localDateString(dt);
      labels.push(dt.toLocaleDateString(undefined, {weekday:'short'}));
      const tot = habits.length;
      const done = habits.filter(h => (h.completions||{})[key]).length;
      data.push(tot > 0 ? Math.round((done/tot)*100) : 0);
      dt.setDate(dt.getDate() + 1);
    }
    HB_CHARTS.weekly = new Chart(cvWeek, {
      type:'bar',
      data:{labels, datasets:[{
        label:'% complete',
        data,
        backgroundColor:'rgba(52,211,153,.6)',
        borderColor:'#34d399',
        borderWidth:1,
        borderRadius:6,
      }]},
      options:hbChartOpts('% of habits completed this week'),
    });
  }

  // ── Best day of week (averaged over last 12 weeks) ──
  const cvBest = document.getElementById('hbChartBestDay');
  if(cvBest){
    destroyHbChart('bestDay');
    const sums = [0,0,0,0,0,0,0];
    const counts = [0,0,0,0,0,0,0];
    const today = new Date();
    for(let i = 0; i < 84; i++){
      const d = new Date(today); d.setDate(d.getDate() - i);
      const key = localDateString(d);
      const dow = d.getDay();
      const tot = habits.length;
      const done = habits.filter(h => (h.completions||{})[key]).length;
      sums[dow]   += tot > 0 ? (done/tot)*100 : 0;
      counts[dow] += 1;
    }
    const labels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const data = sums.map((s,i)=> counts[i] ? Math.round(s/counts[i]) : 0);
    HB_CHARTS.bestDay = new Chart(cvBest, {
      type:'bar',
      data:{labels, datasets:[{
        label:'Avg %',
        data,
        backgroundColor:'rgba(56,189,248,.6)',
        borderColor:'#38bdf8',
        borderWidth:1,
        borderRadius:6,
      }]},
      options:hbChartOpts('Average completion rate by day of week (12-week avg)'),
    });
  }

  // ── Time-of-day success rate ──
  const cvTOD = document.getElementById('hbChartTimeOfDay');
  if(cvTOD){
    destroyHbChart('timeOfDay');
    const labels = ['Morning','Afternoon','Evening','Anytime'];
    const keys   = ['morning','afternoon','evening','anytime'];
    const data = keys.map(k => {
      const group = habits.filter(h => (h.timeOfDay||'anytime') === k);
      if(!group.length) return 0;
      const last30 = lastNDayKeys(30);
      let done = 0, possible = group.length * last30.length;
      group.forEach(h => {
        last30.forEach(dk => { if((h.completions||{})[dk]) done++; });
      });
      return possible > 0 ? Math.round((done/possible)*100) : 0;
    });
    HB_CHARTS.timeOfDay = new Chart(cvTOD, {
      type:'doughnut',
      data:{labels, datasets:[{
        data,
        backgroundColor:['#fbbf24','#f59e0b','#a78bfa','#34d399'],
        borderColor:'rgba(0,0,0,.2)',
        borderWidth:2,
      }]},
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          legend:{position:'bottom', labels:{color:getCss('--tx2','#bcbedb'), font:{family:'inherit', size:11}}},
          title:{display:true, text:'30-day completion % by time-of-day', color:getCss('--tx2','#bcbedb'), font:{size:11, weight:'normal'}},
          tooltip:{callbacks:{label:(ctx)=>` ${ctx.label}: ${ctx.parsed}%`}},
        },
      },
    });
  }
}

function kpiCard(label, value, sub, subColor, icon){
  return `
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
                border-radius:12px;padding:.7rem .8rem;">
      <div style="display:flex;align-items:center;gap:.35rem;font-size:.58rem;
                  letter-spacing:1.2px;font-weight:800;color:var(--tx3);margin-bottom:.25rem;">
        <span style="font-size:.85rem;">${icon}</span>${escapeHtml(label).toUpperCase()}
      </div>
      <div style="font-size:1.2rem;font-weight:800;color:var(--tx);font-family:var(--fn);">${escapeHtml(value)}</div>
      ${sub ? `<div style="font-size:.62rem;color:${subColor};font-weight:700;margin-top:.15rem;">${escapeHtml(sub)}</div>` : ''}
    </div>
  `;
}

function hbChartOpts(titleText){
  const tx2 = getCss('--tx2','#bcbedb');
  const tx3 = getCss('--tx3','#7c809f');
  return {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
      legend:{display:false},
      title:{display:true, text:titleText, color:tx2, font:{size:11, weight:'normal'}},
      tooltip:{callbacks:{label:(ctx)=>` ${ctx.parsed.y}%`}},
    },
    scales:{
      x:{ticks:{color:tx3, font:{size:10}}, grid:{display:false}},
      y:{ticks:{color:tx3, font:{size:10}, callback:(v)=>v+'%'}, grid:{color:'rgba(255,255,255,.05)'}, beginAtZero:true, max:100},
    },
  };
}

// Helper: read a CSS variable from :root, fall back to a default.
function getCss(varName, fallback){
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return v || fallback;
  } catch(_) { return fallback; }
}

// Week range starting Monday. offsetDays = 0 → this week, 7 → last week.
function getWeekRange(offsetDays){
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const dow = d.getDay() || 7;  // make Sunday = 7
  const monday = new Date(d);
  monday.setDate(monday.getDate() - (dow - 1));
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return {start: monday, end: sunday};
}

function lastNDayKeys(n){
  const out = [];
  const d = new Date();
  for(let i = 0; i < n; i++){ out.push(localDateString(d)); d.setDate(d.getDate() - 1); }
  return out;
}

function completionPctInRange(habits, startDate, endDate){
  if(!habits.length) return 0;
  let total = 0, done = 0;
  const cursor = new Date(startDate);
  while(cursor <= endDate){
    const key = localDateString(cursor);
    habits.forEach(h => {
      total++;
      if((h.completions||{})[key]) done++;
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return total > 0 ? Math.round((done/total)*100) : 0;
}

// ── HABIT STACK PANEL ────────────────────────────────────────
// D.habitStacks = [{id, name, cue, habitIds:[...], createdAt}]
function initStackData(){
  if(!Array.isArray(D.habitStacks)) D.habitStacks = [];
}

function addHabitStack(){
  initHabitsData();
  initStackData();
  if(!D.habitsV2.length){
    if(typeof showToast === 'function') showToast('Add at least one habit first');
    return;
  }
  const name = prompt('Stack name (e.g. "Morning routine"):');
  if(!name || !name.trim()) return;
  const cue = prompt('Cue — the trigger event (e.g. "After I brush my teeth"):', 'After I wake up');
  if(cue === null) return;
  const id = 'stk_' + Date.now().toString(36);
  D.habitStacks.push({
    id, name: name.trim().slice(0,60), cue: (cue||'').trim().slice(0,80),
    habitIds: [], createdAt: Date.now(),
  });
  save();
  renderHabitsStack();
}

function removeHabitStack(id){
  initStackData();
  if(!confirm('Remove this stack? Your habits stay; only the chain is removed.')) return;
  D.habitStacks = D.habitStacks.filter(s => s.id !== id);
  save();
  renderHabitsStack();
}

function addHabitToStack(stackId, habitId){
  initStackData();
  const s = D.habitStacks.find(x => x.id === stackId);
  if(!s || !habitId) return;
  if(s.habitIds.indexOf(habitId) >= 0) return;  // already in chain
  s.habitIds.push(habitId);
  save();
  renderHabitsStack();
}

function removeHabitFromStack(stackId, habitId){
  initStackData();
  const s = D.habitStacks.find(x => x.id === stackId);
  if(!s) return;
  s.habitIds = s.habitIds.filter(h => h !== habitId);
  save();
  renderHabitsStack();
}

// Up/down reorder — simpler than HTML5 drag-and-drop and works on mobile.
function moveStackHabit(stackId, habitId, direction){
  initStackData();
  const s = D.habitStacks.find(x => x.id === stackId);
  if(!s) return;
  const idx = s.habitIds.indexOf(habitId);
  if(idx < 0) return;
  const newIdx = idx + (direction === 'up' ? -1 : 1);
  if(newIdx < 0 || newIdx >= s.habitIds.length) return;
  const tmp = s.habitIds[idx];
  s.habitIds[idx] = s.habitIds[newIdx];
  s.habitIds[newIdx] = tmp;
  save();
  renderHabitsStack();
}

function renderHabitsStack(){
  initHabitsData();
  initStackData();
  const wrap = document.getElementById('habitsStackBody');
  if(!wrap) return;
  const habits = D.habitsV2 || [];
  const stacks = D.habitStacks || [];

  if(!stacks.length){
    wrap.innerHTML = `
      <div class="hb-stub">
        <div class="hb-stub-icon">🔗</div>
        <div class="hb-stub-label">NO STACKS YET</div>
        <div style="font-size:.78rem;line-height:1.6;max-width:440px;margin:.4rem auto 1rem;">
          Habit stacking links a new habit to one you already do. The cue
          becomes "After I [existing thing], I will [new habit]." Build one
          chain and order your habits inside it.
        </div>
        <button class="btn bp" onclick="addHabitStack()"
                style="font-size:.75rem;padding:.55rem 1.4rem;border-radius:10px;">
          + Build your first stack
        </button>
      </div>
    `;
    return;
  }

  const habitMap = {};
  habits.forEach(h => { habitMap[h.id] = h; });

  wrap.innerHTML = stacks.map(s => {
    const chain = s.habitIds.map((hid, i) => {
      const h = habitMap[hid];
      if(!h) return '';
      const isFirst = i === 0;
      const isLast  = i === s.habitIds.length - 1;
      return `
        <div style="display:flex;align-items:center;gap:.55rem;padding:.55rem .7rem;
                    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
                    border-radius:10px;margin-top:.4rem;">
          <span style="font-size:.62rem;font-weight:800;color:var(--tx3);font-family:var(--fn);">${i + 1}</span>
          <span style="font-size:1rem;">${escapeHtml(h.emoji||'✅')}</span>
          <span style="flex:1;font-size:.8rem;color:var(--tx);">${escapeHtml(h.name)}</span>
          <button onclick="moveStackHabit('${escapeHtml(s.id)}','${escapeHtml(h.id)}','up')"
                  ${isFirst ? 'disabled' : ''}
                  style="background:none;border:none;color:var(--tx2);cursor:pointer;font-size:.85rem;padding:.1rem .25rem;opacity:${isFirst?.3:.85};"
                  title="Move up">↑</button>
          <button onclick="moveStackHabit('${escapeHtml(s.id)}','${escapeHtml(h.id)}','down')"
                  ${isLast ? 'disabled' : ''}
                  style="background:none;border:none;color:var(--tx2);cursor:pointer;font-size:.85rem;padding:.1rem .25rem;opacity:${isLast?.3:.85};"
                  title="Move down">↓</button>
          <button onclick="removeHabitFromStack('${escapeHtml(s.id)}','${escapeHtml(h.id)}')"
                  style="background:none;border:none;color:#f87171;cursor:pointer;font-size:.85rem;padding:.1rem .25rem;opacity:.7;"
                  title="Remove from chain">×</button>
        </div>
      `;
    }).join('');

    // Picker of habits not already in this stack
    const avail = habits.filter(h => s.habitIds.indexOf(h.id) < 0);

    return `
      <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);
                  border-radius:14px;padding:1rem;margin-bottom:1rem;">
        <div style="display:flex;align-items:flex-start;gap:.6rem;margin-bottom:.6rem;">
          <div style="flex:1;min-width:0;">
            <div style="font-family:var(--fh);font-size:.95rem;font-weight:800;color:var(--tx);">
              🔗 ${escapeHtml(s.name)}
            </div>
            <div style="font-size:.7rem;color:var(--tx2);margin-top:.2rem;font-style:italic;">
              ${escapeHtml(s.cue || 'After I ___')}, I will…
            </div>
          </div>
          <button onclick="removeHabitStack('${escapeHtml(s.id)}')"
                  style="background:none;border:none;color:#f87171;font-size:.85rem;
                         cursor:pointer;padding:.2rem .3rem;opacity:.7;"
                  title="Remove stack">×</button>
        </div>
        ${chain || '<div style="font-size:.72rem;color:var(--tx3);padding:.3rem 0;">No habits in this chain yet. Pick one below to start.</div>'}
        ${avail.length ? `
          <div style="margin-top:.7rem;display:flex;gap:.4rem;align-items:center;">
            <select id="stkPick_${escapeHtml(s.id)}"
                    style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
                           color:var(--tx);padding:.4rem .55rem;border-radius:8px;font-size:.75rem;
                           font-family:var(--fn);">
              <option value="">+ Add habit to this chain…</option>
              ${avail.map(h => `<option value="${escapeHtml(h.id)}">${escapeHtml(h.emoji||'✅')} ${escapeHtml(h.name)}</option>`).join('')}
            </select>
            <button onclick="addHabitToStack('${escapeHtml(s.id)}', document.getElementById('stkPick_${escapeHtml(s.id)}').value)"
                    class="btn bp" style="font-size:.7rem;padding:.4rem .8rem;border-radius:8px;">Add</button>
          </div>
        ` : '<div style="font-size:.65rem;color:var(--tx3);margin-top:.5rem;">Every habit is already in this chain.</div>'}
      </div>
    `;
  }).join('') + `
    <div style="display:flex;justify-content:center;margin-top:.5rem;">
      <button class="btn bp" onclick="addHabitStack()"
              style="font-size:.72rem;padding:.5rem 1.2rem;border-radius:10px;">
        + New stack
      </button>
    </div>
  `;
}

// ── LIBRARY PANEL ────────────────────────────────────────────
// 60 curated habits across 6 categories. Each entry has emoji, name,
// recommended time of day, and a category. One-tap add creates a habit
// in D.habitsV2 using these defaults.
const HABIT_LIBRARY = {
  Health: [
    {e:'💧', n:'Drink 8 glasses of water',           t:'morning'},
    {e:'😴', n:'Sleep 8 hours',                       t:'evening'},
    {e:'🚶', n:'Walk 10,000 steps',                   t:'anytime'},
    {e:'🧘', n:'Stretch for 5 minutes',               t:'morning'},
    {e:'📵', n:'No phone for 60 min before bed',      t:'evening'},
    {e:'🍎', n:'Eat a piece of fruit',                t:'anytime'},
    {e:'☀️', n:'Get 10 minutes of sunlight',          t:'morning'},
    {e:'🪥', n:'Floss',                               t:'evening'},
    {e:'💪', n:'10 push-ups (any variation)',         t:'afternoon'},
    {e:'🥬', n:'Eat one serving of vegetables',       t:'anytime'},
    {e:'🚰', n:'Glass of water on waking',            t:'morning'},
    {e:'🧴', n:'Sunscreen on face',                   t:'morning'},
    {e:'🛏️', n:'Make the bed',                        t:'morning'},
    {e:'🏃', n:'15-minute walk after dinner',         t:'evening'},
    {e:'🦷', n:'Brush teeth 2 minutes',               t:'evening'},
  ],
  Mind: [
    {e:'📖', n:'Read 20 minutes',                      t:'evening'},
    {e:'✍️', n:'Journal one paragraph',                t:'evening'},
    {e:'🧘', n:'Meditate 5 minutes',                   t:'morning'},
    {e:'🙏', n:'Gratitude — list 3 things',            t:'evening'},
    {e:'🧠', n:'Learn one new thing',                  t:'anytime'},
    {e:'🎧', n:'Listen to a podcast episode',          t:'anytime'},
    {e:'🎯', n:'Review goals for 2 minutes',           t:'morning'},
    {e:'📝', n:'Write the day in three sentences',     t:'evening'},
    {e:'💭', n:'Pause and breathe 4-7-8 once',         t:'anytime'},
    {e:'📚', n:'Read non-fiction 10 minutes',          t:'morning'},
  ],
  Faith: [
    {e:'🙏', n:'Pray for 5 minutes',                   t:'morning'},
    {e:'📖', n:'Read one Bible chapter',               t:'morning'},
    {e:'✝️', n:'Daily devotional',                     t:'morning'},
    {e:'✨', n:'Memorize one verse',                   t:'anytime'},
    {e:'❤️', n:'Serve someone (small act)',            t:'anytime'},
    {e:'💝', n:'Tithe / give',                         t:'anytime'},
    {e:'⛪', n:'Worship music for 10 min',             t:'anytime'},
    {e:'📔', n:'Spiritual journaling',                 t:'evening'},
    {e:'🕯️', n:'Examen (review the day with God)',    t:'evening'},
    {e:'🤝', n:'Encourage someone',                    t:'anytime'},
  ],
  Productivity: [
    {e:'📅', n:'Plan tomorrow tonight',                t:'evening'},
    {e:'🎯', n:'Review weekly goals',                  t:'morning'},
    {e:'1️⃣', n:'Single-task for 25 minutes',          t:'afternoon'},
    {e:'📥', n:'Inbox to zero (or under 10)',          t:'morning'},
    {e:'🗒️', n:'Pick top 3 priorities for the day',   t:'morning'},
    {e:'⏰', n:'Wake up at the same time',             t:'morning'},
    {e:'🧹', n:'5-minute desk reset',                  t:'evening'},
    {e:'🚫', n:'No social media before noon',          t:'morning'},
    {e:'📑', n:'Review yesterday before starting',     t:'morning'},
    {e:'🎓', n:'Study without phone in room',          t:'afternoon'},
  ],
  Social: [
    {e:'📞', n:'Call a friend or family member',       t:'anytime'},
    {e:'💌', n:'Send one thoughtful message',          t:'anytime'},
    {e:'🤗', n:'Random act of kindness',               t:'anytime'},
    {e:'🍽️', n:'Family dinner — no phones',           t:'evening'},
    {e:'❤️', n:'Tell someone what you appreciate',     t:'anytime'},
    {e:'🤝', n:'Make plans with a friend',             t:'anytime'},
    {e:'👋', n:'Greet someone new',                    t:'anytime'},
    {e:'🎉', n:'Celebrate someone\'s win',             t:'anytime'},
  ],
  Financial: [
    {e:'💰', n:'Track spending for the day',           t:'evening'},
    {e:'🛑', n:'No impulse buys today',                t:'anytime'},
    {e:'💵', n:'Save $X today',                        t:'anytime'},
    {e:'📊', n:'Review budget for 2 minutes',          t:'evening'},
    {e:'🏦', n:'Check bank balance (intentionally)',   t:'morning'},
    {e:'📈', n:'Read one finance article',             t:'anytime'},
    {e:'🛒', n:'Make a grocery list before shopping',  t:'anytime'},
  ],
};

function renderHabitsLibrary(){
  initHabitsData();
  const wrap = document.getElementById('habitsLibraryBody');
  if(!wrap) return;
  const existingNames = new Set((D.habitsV2 || []).map(h => h.name.toLowerCase()));

  const cats = Object.keys(HABIT_LIBRARY);
  wrap.innerHTML = `
    <div style="font-size:.78rem;color:var(--tx2);margin-bottom:1rem;line-height:1.55;">
      One-tap add. Each card lands in your habits with a recommended
      time-of-day pre-set. ${Object.values(HABIT_LIBRARY).reduce((s,a)=>s+a.length,0)} curated habits across ${cats.length} categories.
    </div>
    ${cats.map(cat => `
      <div style="margin-bottom:1.2rem;">
        <div style="font-family:var(--fh);font-size:.74rem;letter-spacing:1.5px;
                    font-weight:800;color:var(--tx);margin-bottom:.45rem;">
          ${escapeHtml(cat).toUpperCase()} <span style="font-weight:400;color:var(--tx3);letter-spacing:0;font-family:var(--f);">(${HABIT_LIBRARY[cat].length})</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.5rem;">
          ${HABIT_LIBRARY[cat].map((h,i) => {
            const added = existingNames.has(h.n.toLowerCase());
            return `
              <button onclick="libraryAdd('${escapeHtml(cat)}', ${i}, this)"
                      ${added ? 'disabled' : ''}
                      style="text-align:left;padding:.55rem .7rem;border-radius:10px;
                             background:${added?'rgba(52,211,153,.10)':'rgba(255,255,255,.03)'};
                             border:1px solid ${added?'rgba(52,211,153,.35)':'rgba(255,255,255,.07)'};
                             color:var(--tx);cursor:${added?'default':'pointer'};
                             display:flex;align-items:center;gap:.5rem;
                             font-family:inherit;font-size:.78rem;transition:all .18s;
                             ${added?'opacity:.78;':''}">
                <span style="font-size:1.1rem;flex-shrink:0;">${escapeHtml(h.e)}</span>
                <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;
                             white-space:nowrap;">${escapeHtml(h.n)}</span>
                <span style="font-size:.55rem;letter-spacing:.5px;color:var(--tx3);font-weight:700;flex-shrink:0;">
                  ${added ? '✓ ADDED' : h.t.toUpperCase()}
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

function libraryAdd(cat, idx, btnEl){
  const h = (HABIT_LIBRARY[cat] || [])[idx];
  if(!h) return;
  addHabitV2(h.n, h.e, h.t, cat, '');
  if(btnEl){
    btnEl.disabled = true;
    btnEl.style.background = 'rgba(52,211,153,.10)';
    btnEl.style.borderColor = 'rgba(52,211,153,.35)';
    btnEl.style.opacity = '.78';
    btnEl.style.cursor = 'default';
    const tag = btnEl.querySelector('span:last-child');
    if(tag) tag.textContent = '✓ ADDED';
  }
}

// ── SCIENCE PANEL ────────────────────────────────────────────
// Six cards on the behavioural science behind habit formation. Same
// substance level as the Faith-tab Proof & Prophecy cards: a clear
// headline, two short body paragraphs, a "try this today" practical
// takeaway, and a research/source anchor. Carousel with prev/next +
// dot indicators; no touch-swipe (extra complexity, not in scope).
const HABIT_SCIENCE_CARDS = [
  {
    icon:    '🔁',
    title:   'The 3R Loop',
    subtitle:'Cue → Routine → Reward',
    body: [
      "Every habit your brain has ever formed runs the same three-step loop. A CUE triggers a craving (the smell of coffee, the phone buzz, the 3 PM crash). The ROUTINE is the behaviour you perform in response (pour the coffee, open Instagram, grab a snack). The REWARD is what your brain logs as worth repeating (caffeine hit, dopamine, sugar).",
      "Once the brain has the loop, the cue alone is enough to start the routine — automatically, without you deciding. That's why willpower fails: by the time you notice you're scrolling, the cue already fired. The way out is not more willpower. It's redesigning the loop."
    ],
    tryThis: "Pick one habit you want to stop. Write down its three R's — what cue triggers it? what routine runs? what reward does your brain expect? Just naming the loop weakens it.",
    source:  "Charles Duhigg, The Power of Habit (2012)",
  },
  {
    icon:    '📅',
    title:   '66 Days, Not 21',
    subtitle:'The myth of the 21-day habit',
    body: [
      "The \"21 days makes a habit\" claim comes from a 1960 plastic-surgery book where Dr. Maltz observed his patients took roughly 21 days to adjust to their new faces. It was an observation about acceptance — not a study of habit formation.",
      "The actual research (Lally, van Jaarsveld, Potts & Wardle, European Journal of Social Psychology, 2010) tracked 96 people forming new habits over 12 weeks. The average time for a behaviour to become automatic was 66 days. The range was 18 to 254 days depending on the habit's difficulty. Simple habits (drinking water at breakfast) formed faster; harder ones (50 sit-ups before lunch) much slower."
    ],
    tryThis: "If you're past day 21 and the habit still feels effortful, you're not broken. You're on day 21. Keep going. The science says the line you're looking for is closer to day 66 — and longer for harder behaviours.",
    source:  "Lally et al., 'How are habits formed' (2010), Eur. J. of Social Psych.",
  },
  {
    icon:    '🎯',
    title:   'Implementation Intentions',
    subtitle:'When X happens, I will do Y',
    body: [
      "Goals are vague (\"I'll exercise more\"). Implementation intentions are specific (\"When my alarm goes off at 6:30 AM, I will put on the running shoes I left by my bed\"). The format is rigid for a reason: it pre-decides the moment, the location, and the action so the brain doesn't have to deliberate when the cue fires.",
      "A meta-analysis of 94 studies (Gollwitzer & Sheeran, 2006) found people who wrote implementation intentions were 2–3× more likely to follow through than people with the same goal but no plan. The difference is not motivation — it's removing the decision from the moment of action."
    ],
    tryThis: "Pick one habit on your list. Fill in the blanks out loud: \"When ___ happens, in ___, I will ___.\" Write it down. Put it where you'll see it before the cue fires.",
    source:  "Gollwitzer & Sheeran, 'Implementation intentions and goal achievement' (2006)",
  },
  {
    icon:    '🔗',
    title:   'Habit Stacking',
    subtitle:'Anchor the new to the already-automatic',
    body: [
      "Starting a habit from scratch means manufacturing a cue. Stacking means using a cue you already have. The format: \"After I [current habit], I will [new habit].\" After I pour my morning coffee, I will read one page. After I brush my teeth, I will do ten push-ups. After I sit down for dinner, I will say one thing I'm grateful for.",
      "The current habit is already automatic — it doesn't need willpower. By piggybacking the new behaviour onto the old one, you inherit the existing cue for free. James Clear calls this the most reliable shortcut he knows for building new habits."
    ],
    tryThis: "Open the Habit Stack sub-tab. Build one chain. The first habit in the chain should be something you already do without thinking (brush teeth, pour coffee, sit down at your desk). Everything else hangs off that anchor.",
    source:  "James Clear, Atomic Habits (2018), ch. 5",
  },
  {
    icon:    '🏠',
    title:   'Environment Design',
    subtitle:'Make good obvious, bad invisible',
    body: [
      "You are not a person with infinite self-control fighting your environment all day. You are a body that responds to whatever your environment makes obvious, attractive, easy, and rewarding. Most of what looks like willpower is actually environment.",
      "The intervention is simple: increase friction on the bad habit (phone in another room, junk food in the back of the pantry, social media apps deleted from the home screen) and decrease friction on the good one (water bottle on the desk, book on the pillow, gym clothes laid out the night before). Studies of habit change repeatedly find environment changes outperform motivation interventions by a wide margin."
    ],
    tryThis: "Walk through one room you spend a lot of time in. Find one thing you can move, hide, or place in plain sight to nudge a habit in the right direction. Do that thing right now, before you keep reading.",
    source:  "BJ Fogg, Tiny Habits (2019); James Clear, Atomic Habits (2018), ch. 6–8",
  },
  {
    icon:    '⏱️',
    title:   'The 2-Minute Rule',
    subtitle:'Start ridiculously small',
    body: [
      "The biggest reason habits fail is starting too big. \"I'll run 30 minutes every morning\" lasts three days. \"I'll put on my running shoes every morning\" lasts months — and somewhere in those months the running shoes turn into a real run.",
      "The 2-Minute Rule: take any habit you want to build and shrink the entry point until you can do it in two minutes or less. Read for 20 minutes → open the book. Meditate for 10 minutes → sit on the cushion and breathe once. Workout daily → walk to the gym. The point isn't the two minutes. The point is establishing the identity — the kind of person who shows up — without burning out before the loop forms."
    ],
    tryThis: "Pick the hardest habit on your list. Shrink it. What's the 2-minute version? Add THAT to your Today tab. The bigger version will follow once the entry-point habit is automatic.",
    source:  "James Clear, Atomic Habits (2018), ch. 13",
  },
];

let _habitsScienceIdx = 0;

function renderHabitsScience(){
  const wrap = document.getElementById('habitsScienceBody');
  if(!wrap) return;
  const total = HABIT_SCIENCE_CARDS.length;
  const i = ((_habitsScienceIdx % total) + total) % total;  // normalize negatives
  const c = HABIT_SCIENCE_CARDS[i];

  const dots = HABIT_SCIENCE_CARDS.map((_, idx) => `
    <button onclick="habitsScienceGo(${idx})" aria-label="Card ${idx+1}"
            style="width:8px;height:8px;border-radius:50%;
                   background:${idx === i ? '#22d3ee' : 'rgba(255,255,255,.18)'};
                   border:none;padding:0;cursor:pointer;transition:all .2s;
                   margin:0 3px;"></button>
  `).join('');

  wrap.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(34,211,238,.08),rgba(167,139,250,.04));
                border:1px solid rgba(34,211,238,.22);border-radius:16px;
                padding:1.3rem 1.4rem;margin-bottom:.8rem;min-height:380px;
                display:flex;flex-direction:column;">
      <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:.7rem;">
        <div style="font-size:2.2rem;">${escapeHtml(c.icon)}</div>
        <div>
          <div style="font-size:.6rem;letter-spacing:1.5px;font-weight:800;color:#22d3ee;
                      font-family:var(--fh);">CARD ${i + 1} OF ${total}</div>
          <div style="font-family:var(--fh);font-size:1.15rem;font-weight:800;
                      color:var(--tx);letter-spacing:.5px;margin-top:.1rem;">${escapeHtml(c.title)}</div>
          <div style="font-size:.78rem;color:var(--tx2);font-style:italic;margin-top:.15rem;">${escapeHtml(c.subtitle)}</div>
        </div>
      </div>

      <div style="flex:1;">
        ${c.body.map(p => `
          <p style="font-size:.85rem;color:var(--tx2);line-height:1.7;margin:0 0 .8rem;">
            ${escapeHtml(p)}
          </p>
        `).join('')}

        <div style="background:rgba(34,211,238,.06);border-left:3px solid #22d3ee;
                    border-radius:0 8px 8px 0;padding:.7rem .9rem;margin:.9rem 0 .7rem;">
          <div style="font-size:.6rem;letter-spacing:1.2px;font-weight:800;color:#22d3ee;
                      margin-bottom:.25rem;">TRY THIS TODAY</div>
          <div style="font-size:.82rem;color:var(--tx);line-height:1.65;">${escapeHtml(c.tryThis)}</div>
        </div>

        <div style="font-size:.66rem;color:var(--tx3);font-style:italic;margin-top:.6rem;">
          ${escapeHtml(c.source)}
        </div>
      </div>
    </div>

    <!-- Carousel controls -->
    <div style="display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin-top:.5rem;">
      <button onclick="habitsSciencePrev()"
              style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                     color:var(--tx);padding:.5rem .9rem;border-radius:10px;cursor:pointer;
                     font-family:var(--fn);font-size:.72rem;font-weight:700;">← Prev</button>
      <div style="display:flex;align-items:center;">${dots}</div>
      <button onclick="habitsScienceNext()"
              style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                     color:var(--tx);padding:.5rem .9rem;border-radius:10px;cursor:pointer;
                     font-family:var(--fn);font-size:.72rem;font-weight:700;">Next →</button>
    </div>
  `;
}

function habitsScienceNext(){ _habitsScienceIdx++; renderHabitsScience(); }
function habitsSciencePrev(){ _habitsScienceIdx--; renderHabitsScience(); }
function habitsScienceGo(i){ _habitsScienceIdx = i; renderHabitsScience(); }

// ── SUPABASE MIGRATION HELPER ────────────────────────────────
// Copies D.habitsV2 (the JSONB blob source-of-truth) into the dedicated
// `habits` + `habit_completions` tables after docs/migrations/habits-schema.sql
// has been applied. Idempotent — re-running is safe (upserts by habit id,
// completions UNIQUE on habit_id+date). Silently no-ops if tables don't
// exist yet, so calling before the SQL is applied is harmless.
//
// Manual invocation only: window.migrateHabitsToSupabase() from the
// console while signed in. Not auto-fired from initHabits() — the SQL
// migration is OPTIONAL until family leaderboards land (mirrors the
// F2-F memory_verses opt-in pattern).
async function migrateHabitsToSupabase(){
  if(typeof getSupabase !== 'function'){
    console.warn('[habits] getSupabase() not available — cannot migrate.');
    return { ok:false, reason:'no-supabase-client' };
  }
  const sb = getSupabase();
  if(!sb){ console.warn('[habits] Supabase client null.'); return { ok:false, reason:'no-supabase-client' }; }

  const { data: { user } = {} } = (await sb.auth.getUser()) || {};
  if(!user || !user.id){
    console.warn('[habits] Not signed in.');
    return { ok:false, reason:'no-session' };
  }

  initHabitsData();
  const habits = Array.isArray(D.habitsV2) ? D.habitsV2 : [];
  if(!habits.length){
    console.log('[habits] No habits to migrate.');
    return { ok:true, habitsMigrated:0, completionsMigrated:0 };
  }

  // Upsert habits. Insert completions in a second pass so habit_id FKs resolve.
  const habitRows = habits.map(h => ({
    id:             h.id,
    user_id:        user.id,
    name:           String(h.name || '').slice(0, 200),
    emoji:          h.emoji || '✅',
    category:       h.category || null,
    time_of_day:    (['morning','afternoon','evening','anytime'].indexOf(h.timeOfDay) >= 0)
                      ? h.timeOfDay : 'anytime',
    cue:            h.cue || null,
    stack_after:    h.stackAfter || null,
    streak:         typeof h.streak === 'number' ? h.streak : getHabitCurrentStreak(h),
    longest_streak: typeof h.longestStreak === 'number' ? h.longestStreak : getHabitLongestStreak(h),
    created_at:     h.createdAt ? new Date(h.createdAt).toISOString() : new Date().toISOString(),
    updated_at:     new Date().toISOString(),
  }));

  const { error: hErr } = await sb.from('habits').upsert(habitRows, { onConflict: 'id' });
  if(hErr){
    // Most likely cause: SQL migration hasn't been applied yet (table missing).
    console.warn('[habits] habits upsert failed — has habits-schema.sql been applied?', hErr.message);
    return { ok:false, reason:'habits-upsert-failed', error: hErr.message };
  }

  const completionRows = [];
  habits.forEach(h => {
    const comps = h.completions || {};
    Object.keys(comps).forEach(dateKey => {
      if(comps[dateKey]){
        completionRows.push({
          habit_id:       h.id,
          user_id:        user.id,
          completed_date: dateKey,
        });
      }
    });
  });

  let completionsMigrated = 0;
  if(completionRows.length){
    // upsert with ignoreDuplicates so a re-run doesn't error on the
    // UNIQUE(habit_id, completed_date) constraint.
    const { error: cErr } = await sb
      .from('habit_completions')
      .upsert(completionRows, { onConflict: 'habit_id,completed_date', ignoreDuplicates: true });
    if(cErr){
      console.warn('[habits] completions upsert had errors:', cErr.message);
      return { ok:false, reason:'completions-upsert-failed', error: cErr.message };
    }
    completionsMigrated = completionRows.length;
  }

  console.log(`[habits] Migrated ${habitRows.length} habits + ${completionsMigrated} completions to Supabase.`);
  return { ok:true, habitsMigrated: habitRows.length, completionsMigrated };
}

// ── ENTRY POINTS ─────────────────────────────────────────────
function renderHabitsAll(){
  renderHabitsHero();
  renderHabitsToday();
  // Re-render Streaks/Analytics/Stack/Library/Science lazily on tab switch.
}

function initHabits(){
  initHabitsData();
  renderHabitsHero();
  renderHabitsToday();
}

// Expose globals (vanilla-JS, no modules).
window.initHabits             = initHabits;
window.habitsTab              = habitsTab;
window.toggleHabitV2Today     = toggleHabitV2Today;
window.addHabitV2             = addHabitV2;
window.removeHabitV2          = removeHabitV2;
window.openAddHabit           = openAddHabit;
window.renderHabitsHero       = renderHabitsHero;
window.renderHabitsToday      = renderHabitsToday;
window.renderHabitsStreaks    = renderHabitsStreaks;
window.renderHabitsAnalytics  = renderHabitsAnalytics;
window.renderHabitsStack      = renderHabitsStack;
window.renderHabitsLibrary    = renderHabitsLibrary;
window.addHabitStack          = addHabitStack;
window.removeHabitStack       = removeHabitStack;
window.addHabitToStack        = addHabitToStack;
window.removeHabitFromStack   = removeHabitFromStack;
window.moveStackHabit         = moveStackHabit;
window.libraryAdd             = libraryAdd;
window.renderHabitsScience    = renderHabitsScience;
window.habitsScienceNext      = habitsScienceNext;
window.habitsSciencePrev      = habitsSciencePrev;
window.habitsScienceGo        = habitsScienceGo;
window.migrateHabitsToSupabase= migrateHabitsToSupabase;
