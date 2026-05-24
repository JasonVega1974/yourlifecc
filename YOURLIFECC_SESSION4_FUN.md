# Session 4 — Pure Fun, Celebration & Delight
## Every action feels like winning. Zero boring moments.

Paste this entire prompt into Claude Code.

---

```
Read YOURLIFECC_V1_REBUILD.md and current state of app/js/faith-zones.js,
app/js/traits.js, app/js/daily-briefing.js, app/js/animations.js (if exists).

This session is ALL about making the app feel alive, exciting, and addictive.
No new content walls. Pure celebration, surprise, and delight.

PRE-FLIGHT:
grep -n "function tick\|setInterval(tick\|Google Translate\|</body>" app/index.html | tail -10
for f in app/js/*.js app/js/data/*.js; do node --check "$f" >/dev/null 2>&1 || echo "FAIL: $f"; done

===================================================================
CREATE app/js/celebrations.js — the fun engine
===================================================================

This file handles every celebration moment in the app.
It is loaded globally and available everywhere.

// ═══════════════════════════════════════════════
// CELEBRATION 1 — MEGA CONFETTI BURST
// Used for: Real Life Win completed, all Daily 3 done
// ═══════════════════════════════════════════════
function megaConfetti() {
  const colors = ['#ffd700','#ff6b6b','#4ecdc4','#45b7d1','#96ceb4',
                  '#ffeaa7','#dfe6e9','#fd79a8','#a29bfe','#00b894'];
  const container = document.createElement('div');
  container.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:99999;overflow:hidden;
  `;
  document.body.appendChild(container);

  // Create 80 confetti pieces
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 8;
    const isRect = Math.random() > 0.5;
    const startX = 20 + Math.random() * 60; // concentrate in middle
    const delay = Math.random() * 0.4;
    const duration = 1.2 + Math.random() * 0.8;
    const endX = startX + (Math.random() - 0.5) * 60;
    const rotation = Math.random() * 720 - 360;

    piece.style.cssText = `
      position:absolute;
      left:${startX}%;
      top:-10px;
      width:${isRect ? size*1.5 : size}px;
      height:${size}px;
      background:${color};
      border-radius:${isRect ? '2px' : '50%'};
      opacity:1;
      animation: confettiFall${i} ${duration}s ease-in ${delay}s forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes confettiFall${i} {
        0%   { transform: translateX(0) translateY(0) rotate(0deg); opacity:1; }
        70%  { opacity:1; }
        100% { transform: translateX(${(endX-startX)*3}px) translateY(${window.innerHeight + 50}px) rotate(${rotation}deg); opacity:0; }
      }
    `;
    document.head.appendChild(style);
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 3000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 2 — SCREEN FLASH
// Quick color flash for emphasis
// ═══════════════════════════════════════════════
function screenFlash(color, duration = 300) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:${color};opacity:0;pointer-events:none;
    z-index:99998;transition:opacity 0.1s ease;
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '0.25';
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, duration);
  });
}

// ═══════════════════════════════════════════════
// CELEBRATION 3 — TRAIT EXPLOSION
// Big emoji flies up from bottom when trait awarded
// ═══════════════════════════════════════════════
function traitExplosion(emoji, traitName) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;
    bottom:100px;
    left:50%;
    transform:translateX(-50%) scale(0);
    font-size:4rem;
    z-index:99999;
    pointer-events:none;
    animation:traitExplode 1.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
    filter:drop-shadow(0 0 20px gold);
  `;
  el.textContent = emoji;
  document.body.appendChild(el);

  const label = document.createElement('div');
  label.style.cssText = `
    position:fixed;
    bottom:72px;
    left:50%;
    transform:translateX(-50%);
    font-size:0.9rem;
    font-weight:700;
    color:#ffd700;
    z-index:99999;
    pointer-events:none;
    opacity:0;
    animation:traitLabel 1.4s ease 0.3s forwards;
    text-shadow:0 0 10px rgba(255,215,0,0.8);
    white-space:nowrap;
  `;
  label.textContent = `${traitName} growing ↑`;
  document.body.appendChild(label);

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes traitExplode {
      0%   { transform:translateX(-50%) scale(0) translateY(0); opacity:0; }
      20%  { transform:translateX(-50%) scale(1.3) translateY(-10px); opacity:1; }
      60%  { transform:translateX(-50%) scale(1.0) translateY(-60px); opacity:1; }
      100% { transform:translateX(-50%) scale(0.6) translateY(-140px); opacity:0; }
    }
    @keyframes traitLabel {
      0%   { opacity:0; transform:translateX(-50%) translateY(0); }
      30%  { opacity:1; }
      80%  { opacity:1; }
      100% { opacity:0; transform:translateX(-50%) translateY(-30px); }
    }
  `;
  document.head.appendChild(styleEl);

  setTimeout(() => {
    el.remove();
    label.remove();
    styleEl.remove();
  }, 1800);
}

// ═══════════════════════════════════════════════
// CELEBRATION 4 — REAL LIFE WIN CELEBRATION
// The BIG moment — shown when "I did it" is tapped
// ═══════════════════════════════════════════════
function realLifeWinCelebration(winText) {
  megaConfetti();
  screenFlash('#00d4aa', 200);

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.85);z-index:99997;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    opacity:0;transition:opacity 0.3s ease;
    pointer-events:all;cursor:pointer;
  `;

  overlay.innerHTML = `
    <div style="text-align:center;padding:2rem;max-width:320px;">
      <div style="font-size:5rem;margin-bottom:1rem;
        animation:winPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;">
        🌍
      </div>
      <div style="font-size:1.8rem;font-weight:900;color:#ffd700;
        letter-spacing:-0.02em;margin-bottom:0.5rem;
        animation:winText 0.5s ease 0.3s both;opacity:0;
        text-shadow:0 0 30px rgba(255,215,0,0.6);">
        THAT'S REAL GROWTH
      </div>
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.8);
        margin-bottom:1.5rem;line-height:1.5;
        animation:winText 0.5s ease 0.5s both;opacity:0;">
        You didn't just use an app.<br>You did something real.
      </div>
      <div style="font-size:0.75rem;color:rgba(255,255,255,0.4);
        animation:winText 0.5s ease 0.8s both;opacity:0;">
        tap anywhere to continue
      </div>
    </div>
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes winPop {
      0%   { transform:scale(0) rotate(-20deg); }
      60%  { transform:scale(1.2) rotate(5deg); }
      100% { transform:scale(1) rotate(0deg); }
    }
    @keyframes winText {
      from { opacity:0; transform:translateY(15px); }
      to   { opacity:1; transform:translateY(0); }
    }
  `;
  document.head.appendChild(styleEl);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.style.opacity = '1');

  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.remove(); styleEl.remove(); }, 300);
  });

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.remove(); styleEl.remove(); }, 300);
    }
  }, 4000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 5 — CONVINCE ME CARD FLIP EFFECT
// Category color flash + sequential bullet reveal
// ═══════════════════════════════════════════════
function convinceMeFlipEffect(categoryColor) {
  screenFlash(categoryColor || '#7b68ee', 150);
}

function revealBulletsSequentially(backFaceEl) {
  if (!backFaceEl) return;
  const bullets = backFaceEl.querySelectorAll('.cm-bullet, li, .cm-evidence-item');
  bullets.forEach((b, i) => {
    b.style.opacity = '0';
    b.style.transform = 'translateX(-15px)';
    b.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      b.style.opacity = '1';
      b.style.transform = 'translateX(0)';
    }, 200 + i * 150);
  });
  // Closer line
  const closer = backFaceEl.querySelector('.cm-closer, .cm-conclusion');
  if (closer) {
    closer.style.opacity = '0';
    setTimeout(() => {
      closer.style.transition = 'opacity 0.4s ease';
      closer.style.opacity = '1';
    }, 200 + bullets.length * 150 + 100);
  }
}

// ═══════════════════════════════════════════════
// CELEBRATION 6 — CURIOSITY STREAK MILESTONE
// Shown when streak hits 3, 5, 7, 14 days
// ═══════════════════════════════════════════════
function curiosityStreakMilestone(days) {
  const messages = {
    3:  { text: "You're asking the right questions 🔥", color: '#ff6b35' },
    5:  { text: "Most people never look this deep ⚡", color: '#ffd700' },
    7:  { text: "One week of curiosity. That's rare 🌟", color: '#a29bfe' },
    14: { text: "Two weeks. Your faith is being built 📖", color: '#00b894' },
    30: { text: "A month of seeking. You've changed 🚀", color: '#fd79a8' },
  };
  const m = messages[days];
  if (!m) return;

  screenFlash(m.color, 200);

  const banner = document.createElement('div');
  banner.style.cssText = `
    position:fixed;
    top:0;left:0;right:0;
    background:linear-gradient(135deg, ${m.color}, ${m.color}88);
    color:#fff;
    text-align:center;
    padding:1rem;
    font-weight:700;
    font-size:1rem;
    z-index:99999;
    transform:translateY(-100%);
    transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow:0 4px 20px rgba(0,0,0,0.3);
    pointer-events:none;
  `;
  banner.textContent = m.text;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.style.transform = 'translateY(0)');
  setTimeout(() => {
    banner.style.transform = 'translateY(-100%)';
    setTimeout(() => banner.remove(), 400);
  }, 3000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 7 — DID YOU KNOW? SURPRISE FACT
// Pops up randomly after card flip (10% chance)
// ═══════════════════════════════════════════════
const DID_YOU_KNOW = [
  { cat:'Mystery',   fact:'The apostles had nothing financial to gain from their claims.' },
  { cat:'Evidence',  fact:'Jesus is mentioned by more ancient historians than Julius Caesar.' },
  { cat:'Science',   fact:'If gravity were slightly stronger, stars couldn\'t form at all.' },
  { cat:'Prophecy',  fact:'Over 300 specific Messianic prophecies were written centuries early.' },
  { cat:'Philosophy',fact:'Every human civilization independently developed a concept of God.' },
  { cat:'Mystery',   fact:'The empty tomb was never disputed — even by Jesus\'s enemies.' },
  { cat:'Evidence',  fact:'Eyewitness accounts of the resurrection were written within 25 years.' },
  { cat:'Science',   fact:'The complexity of a single human cell rivals a modern city.' },
  { cat:'Prophecy',  fact:'Micah predicted Bethlehem as birthplace 700 years in advance.' },
  { cat:'Philosophy',fact:'The fine-tuning of the universe\'s constants defies random chance.' },
];

function maybeShowDidYouKnow(category) {
  if (Math.random() > 0.12) return; // 12% chance
  const facts = DID_YOU_KNOW.filter(f => f.cat === category || Math.random() > 0.5);
  if (!facts.length) return;
  const item = facts[Math.floor(Math.random() * facts.length)];

  setTimeout(() => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;
      top:80px;right:12px;
      max-width:220px;
      background:linear-gradient(135deg,#1a0a3e,#2d1b69);
      border:1px solid #7b68ee;
      border-radius:12px;
      padding:0.8rem;
      z-index:99998;
      pointer-events:none;
      opacity:0;
      transform:translateX(20px);
      transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow:0 4px 20px rgba(123,104,238,0.4);
    `;
    el.innerHTML = `
      <div style="font-size:0.65rem;color:#a29bfe;font-weight:700;
        text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.3rem;">
        💡 Did you know?
      </div>
      <div style="font-size:0.8rem;color:#fff;line-height:1.4;">
        ${item.fact}
      </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    });
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(() => el.remove(), 400);
    }, 4000);
  }, 800); // slight delay after flip
}

// ═══════════════════════════════════════════════
// CELEBRATION 8 — DAILY 3 ALL COMPLETE
// The big home screen moment
// ═══════════════════════════════════════════════
function dailyThreeComplete() {
  megaConfetti();
  screenFlash('#ffd700', 300);

  setTimeout(() => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;
      bottom:90px;left:50%;
      transform:translateX(-50%) scale(0);
      background:linear-gradient(135deg,#f9ca24,#f0932b);
      border-radius:20px;
      padding:1rem 2rem;
      text-align:center;
      z-index:99999;
      pointer-events:none;
      box-shadow:0 8px 32px rgba(249,202,36,0.5);
      animation:dailyPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    `;
    el.innerHTML = `
      <div style="font-size:2rem;">🎉</div>
      <div style="font-size:1rem;font-weight:900;color:#fff;margin-top:0.2rem;">
        Day complete!
      </div>
      <div style="font-size:0.75rem;color:rgba(255,255,255,0.85);margin-top:0.2rem;">
        You showed up today. That matters.
      </div>
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes dailyPop {
        0%   { transform:translateX(-50%) scale(0); }
        60%  { transform:translateX(-50%) scale(1.05); }
        100% { transform:translateX(-50%) scale(1); }
      }
    `;
    document.head.appendChild(styleEl);
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.transition = 'all 0.4s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(20px) scale(0.9)';
      setTimeout(() => { el.remove(); styleEl.remove(); }, 400);
    }, 3500);
  }, 400);
}

// ═══════════════════════════════════════════════
// CELEBRATION 9 — STREAK MILESTONE BANNER
// Fires at 3, 7, 14, 30, 50, 100 days
// ═══════════════════════════════════════════════
function streakMilestoneBanner(days) {
  const colors = {
    3:'#fd79a8', 7:'#e17055', 14:'#fdcb6e',
    30:'#e84393', 50:'#a29bfe', 100:'#ffd700'
  };
  const c = colors[days] || '#ffd700';
  screenFlash(c, 200);

  const banner = document.createElement('div');
  banner.style.cssText = `
    position:fixed;
    top:0;left:0;right:0;
    z-index:99999;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:0.5rem;
    padding:1rem;
    font-weight:900;
    font-size:1.1rem;
    color:#fff;
    text-shadow:0 2px 8px rgba(0,0,0,0.3);
    background:linear-gradient(90deg,${c},${c}cc,${c});
    box-shadow:0 4px 24px ${c}66;
    transform:translateY(-100%);
    transition:transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events:none;
  `;
  banner.innerHTML = `🔥 ${days} DAY STREAK! 🔥`;
  document.body.appendChild(banner);

  requestAnimationFrame(() => banner.style.transform = 'translateY(0)');
  setTimeout(() => {
    banner.style.transition = 'transform 0.4s ease';
    banner.style.transform = 'translateY(-100%)';
    setTimeout(() => banner.remove(), 400);
  }, 3000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 10 — PRAYER SUBMIT DOVE
// Dove floats up from center when prayer submitted
// ═══════════════════════════════════════════════
function prayerDove(sourceEl) {
  const rect = sourceEl?.getBoundingClientRect?.() || 
    { left: window.innerWidth/2, top: window.innerHeight/2 };
  const startX = rect.left + (rect.width||0)/2;
  const startY = rect.top;

  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;
    left:${startX}px;
    top:${startY}px;
    font-size:2.5rem;
    z-index:99999;
    pointer-events:none;
    transform:translate(-50%,-50%);
    animation:doveFloat 1.6s ease forwards;
    filter:drop-shadow(0 0 12px rgba(255,255,255,0.8));
  `;
  el.textContent = '🕊️';
  document.body.appendChild(el);

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes doveFloat {
      0%   { transform:translate(-50%,-50%) scale(0.5); opacity:0; }
      20%  { transform:translate(-50%,-50%) scale(1.2); opacity:1; }
      60%  { transform:translate(calc(-50% + ${(Math.random()-0.5)*40}px), calc(-50% - 120px)) scale(1); opacity:1; }
      100% { transform:translate(calc(-50% + ${(Math.random()-0.5)*60}px), calc(-50% - 220px)) scale(0.6); opacity:0; }
    }
  `;
  document.head.appendChild(styleEl);

  setTimeout(() => { el.remove(); styleEl.remove(); }, 1700);
}

// ═══════════════════════════════════════════════
// EXPOSE GLOBALLY
// ═══════════════════════════════════════════════
window.megaConfetti            = megaConfetti;
window.screenFlash             = screenFlash;
window.traitExplosion          = traitExplosion;
window.realLifeWinCelebration  = realLifeWinCelebration;
window.convinceMeFlipEffect    = convinceMeFlipEffect;
window.revealBulletsSequentially = revealBulletsSequentially;
window.curiosityStreakMilestone  = curiosityStreakMilestone;
window.maybeShowDidYouKnow     = maybeShowDidYouKnow;
window.dailyThreeComplete      = dailyThreeComplete;
window.streakMilestoneBanner   = streakMilestoneBanner;
window.prayerDove              = prayerDove;

===================================================================
REAL LIFE WINS — 30 offline actions for Daily Briefing Tile 3
===================================================================

Add to app/js/data/faith-zones-data.js:

const REAL_LIFE_WINS = [
  { id:'rlw1',  emoji:'💬', cat:'Relational',  trait:'compassion', pts:3, text:'Text one person right now: "Hey, I was thinking about you"' },
  { id:'rlw2',  emoji:'👁️', cat:'Relational',  trait:'integrity',  pts:3, text:'Look your parent in the eyes and say thank you for something specific' },
  { id:'rlw3',  emoji:'🤝', cat:'Relational',  trait:'compassion', pts:4, text:'Find someone sitting alone today and sit with them' },
  { id:'rlw4',  emoji:'📝', cat:'Relational',  trait:'compassion', pts:3, text:'Write a note on physical paper and leave it for someone to find' },
  { id:'rlw5',  emoji:'📞', cat:'Relational',  trait:'compassion', pts:3, text:'Call someone instead of texting them today' },
  { id:'rlw6',  emoji:'💛', cat:'Relational',  trait:'compassion', pts:4, text:'Tell a friend one specific thing you appreciate about them out loud' },
  { id:'rlw7',  emoji:'🧓', cat:'Relational',  trait:'wisdom',     pts:4, text:'Ask someone older than you: what\'s the best advice you ever got?' },
  { id:'rlw8',  emoji:'🤲', cat:'Relational',  trait:'compassion', pts:3, text:'Do something for your sibling they didn\'t ask for' },
  { id:'rlw9',  emoji:'🚪', cat:'Relational',  trait:'integrity',  pts:2, text:'Let someone go first — in line, in conversation, anywhere' },
  { id:'rlw10', emoji:'💌', cat:'Relational',  trait:'compassion', pts:3, text:'Check in on someone you haven\'t talked to in a while' },
  { id:'rlw11', emoji:'👋', cat:'Courage',     trait:'courage',    pts:5, text:'Introduce yourself to one person you\'ve never talked to' },
  { id:'rlw12', emoji:'🙏', cat:'Courage',     trait:'integrity',  pts:5, text:'Apologize to someone you\'ve been meaning to for a while' },
  { id:'rlw13', emoji:'🔓', cat:'Courage',     trait:'courage',    pts:4, text:'Share one honest thing about yourself you don\'t usually share' },
  { id:'rlw14', emoji:'❓', cat:'Courage',     trait:'faith',      pts:4, text:'Ask God one question you\'ve been afraid to ask' },
  { id:'rlw15', emoji:'⚡', cat:'Courage',     trait:'courage',    pts:5, text:'Do one thing today that scares you a little' },
  { id:'rlw16', emoji:'📵', cat:'Discipline',  trait:'discipline', pts:4, text:'Put your phone in another room for 2 hours. No exceptions.' },
  { id:'rlw17', emoji:'⏰', cat:'Discipline',  trait:'discipline', pts:4, text:'Wake up 30 minutes earlier tomorrow. Set the alarm right now.' },
  { id:'rlw18', emoji:'🧹', cat:'Discipline',  trait:'discipline', pts:3, text:'Clean or organize one space without being asked' },
  { id:'rlw19', emoji:'⏭️', cat:'Discipline',  trait:'integrity',  pts:3, text:'Skip one thing you enjoy today. Offer it up.' },
  { id:'rlw20', emoji:'📋', cat:'Discipline',  trait:'discipline', pts:3, text:'Write tomorrow\'s plan tonight before you sleep' },
  { id:'rlw21', emoji:'🎁', cat:'Faith',       trait:'compassion', pts:5, text:'Do one anonymous act of kindness. Tell absolutely no one.' },
  { id:'rlw22', emoji:'💰', cat:'Faith',       trait:'compassion', pts:4, text:'Give something away today — money, time, or something you own' },
  { id:'rlw23', emoji:'🙏', cat:'Faith',       trait:'faith',      pts:4, text:'Pray for someone you find difficult. Out loud.' },
  { id:'rlw24', emoji:'🚶', cat:'Faith',       trait:'faith',      pts:4, text:'Take a 10-minute walk with no phone. Just talk to God.' },
  { id:'rlw25', emoji:'👀', cat:'Faith',       trait:'integrity',  pts:4, text:'Find one way to serve today that no one will notice' },
  { id:'rlw26', emoji:'🌅', cat:'Presence',    trait:'gratitude',  pts:3, text:'Watch a sunset or the sky for 5 minutes. No phone.' },
  { id:'rlw27', emoji:'🍽️', cat:'Presence',    trait:'gratitude',  pts:3, text:'Eat one meal with no screens. Just be present.' },
  { id:'rlw28', emoji:'📓', cat:'Presence',    trait:'gratitude',  pts:3, text:'Write 3 specific things you\'re genuinely grateful for right now' },
  { id:'rlw29', emoji:'❤️', cat:'Presence',    trait:'faith',      pts:3, text:'Tell God what you\'re actually feeling. No filter.' },
  { id:'rlw30', emoji:'🌙', cat:'Presence',    trait:'discipline', pts:3, text:'Go to sleep 30 minutes earlier tonight' },
];
window.REAL_LIFE_WINS = REAL_LIFE_WINS;

===================================================================
WIRE REAL LIFE WINS to Daily Briefing Tile 3
===================================================================

In app/js/daily-briefing.js:

Replace the Tile 3 placeholder with a Real Life Win:

function getTodaysRealLifeWin() {
  const dayIndex = Math.floor(Date.now() / 86400000) % REAL_LIFE_WINS.length;
  return REAL_LIFE_WINS[dayIndex] || REAL_LIFE_WINS[0];
}

When Tile 3 is rendered, show:
- The win emoji (large)
- Short action text (truncated to 2 lines)
- "I did it ✓" button

When "I did it" is tapped:
1. realLifeWinCelebration() — the BIG celebration
2. traitExplosion(TRAITS[win.trait].emoji, TRAITS[win.trait].name)
3. awardTrait(win.trait, win.pts) if typeof awardTrait === 'function'
4. Mark tile as complete in D.dailyThree[today].realWin = true
5. Check if all 3 tiles done → dailyThreeComplete()

===================================================================
WIRE CELEBRATIONS to existing faith actions
===================================================================

In app/js/faith-zones.js, find these action handlers and add:

1. Convince Me card "I'm Curious" tap:
   - convinceMeFlipEffect(categoryColor) BEFORE the flip
   - After flip completes: revealBulletsSequentially(backFaceEl)
   - maybeShowDidYouKnow(card.cat)
   - Check curiosity streak milestones: 
     if ([3,5,7,14,30].includes(D.faithCuriosityStreak)) {
       curiosityStreakMilestone(D.faithCuriosityStreak);
     }

2. Daily Faith Challenge "Mark Complete":
   - screenFlash('#00d4aa', 200)
   - traitExplosion('✝️', 'Faith')
   - megaConfetti() — yes the full confetti, this is a big deal

3. Quick Prayer submit:
   - prayerDove(submitButtonEl)

4. Night Reflection complete:
   - traitExplosion('📖', 'Wisdom')

In app/js/daily-briefing.js:
5. When streak hits milestone:
   if ([3,7,14,30,50,100].includes(D.dailyStreak)) {
     streakMilestoneBanner(D.dailyStreak);
   }

===================================================================
LOAD ORDER in index.html
===================================================================

Add these script tags in order, before faith-zones.js:
<script src="/app/js/celebrations.js"></script>

(traits.js should already be there from Session 3)

The load order should be:
... existing scripts ...
<script src="/app/js/animations.js"></script>      (if exists)
<script src="/app/js/celebrations.js"></script>    (new)
<script src="/app/js/traits.js"></script>          (session 3)
<script src="/app/js/data/faith-zones-data.js"></script>
<script src="/app/js/faith-zones.js"></script>
<script src="/app/js/daily-briefing.js"></script>

===================================================================
VALIDATION:
===================================================================

for f in app/js/*.js app/js/data/*.js; do node --check "$f" >/dev/null 2>&1 || echo "FAIL: $f"; done
node --check app/index.html
grep -n "function tick\|setInterval(tick\|Google Translate\|</body>" app/index.html | tail -10
grep -oP 'id="\K[^"]+' app/index.html | sort | uniq -d
grep -oP "function \K\w+" app/js/*.js | sort | uniq -d

COMMIT:
git add -A
git commit -m "feat: Session 4 — celebrations.js (10 animations), Real Life Wins (30), confetti, trait explosions, dove, streak banners, card flip effects"
git push origin main
```
