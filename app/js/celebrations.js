/* =============================================================
   celebrations.js — V1 Rebuild · Session 4 · Pure fun engine
   2026-05-28 v10
   The "everything feels like winning" layer. No new content
   walls — just celebration, surprise, and delight wrapped around
   every meaningful action. Loaded globally so non-module callers
   in faith-zones.js, daily-briefing.js, and traits.js can reach
   the helpers via window.* without imports.

   Public surface (all attached to window):
     megaConfetti()                       — 80 falling pieces, 3s
                                             ‧ fires on: Real Life
                                             Win complete, Daily 3
                                             all done, Daily Faith
                                             Challenge complete
     screenFlash(color, duration=300)     — quick opacity flash
                                             ‧ fires on: any "big"
                                             tap that needs punch
     traitExplosion(emoji, traitName)     — emoji flies up + label
                                             "<trait> growing ↑"
                                             ‧ fires on: trait
                                             awarded (Tile 3 win,
                                             Night Reflection,
                                             Daily Faith Challenge)
     realLifeWinCelebration(winText)      — full-screen 🌍 overlay
                                             "THAT'S REAL GROWTH"
                                             ‧ fires on: Daily
                                             Briefing Tile 3 "I
                                             did it ✓"
     convinceMeFlipEffect(categoryColor)  — category-colored flash
                                             ‧ fires on: Convince
                                             Me card "I'm Curious"
                                             tap (before flip)
     revealBulletsSequentially(backFaceEl)— stagger-fade bullets +
                                             closer line on flip
                                             back face
     curiosityStreakMilestone(days)       — top banner for 3/5/7/
                                             14/30-day curiosity
                                             streaks
     maybeShowDidYouKnow(category)        — 12% chance toast with
                                             apologetic-style fact
                                             ‧ fires on: Convince
                                             Me flip
     dailyThreeComplete()                 — confetti + "Day
                                             complete!" pop card
                                             ‧ fires on: all 3
                                             Daily Briefing tiles
                                             checked off
     streakMilestoneBanner(days)          — top banner for 3/7/14/
                                             30/50/100-day overall
                                             streaks
     prayerDove(sourceEl)                 — 🕊️ floats up from the
                                             submit button
                                             ‧ fires on: Quick
                                             Prayer submit

   Conventions:
     - All overlays are body-level (z-index 99997–99999) and theme-
       independent on purpose — they need to land the same in dark
       mode, light mode, demo mode, and parent-hub mode.
     - Every function returns early when document is undefined
       (defensive for SSR / test stubs that won't happen in this
       PWA but keep the module safe to require anywhere).
     - prefers-reduced-motion is honored: animation-only helpers
       early-return; structural helpers (realLifeWinCelebration,
       curiosityStreakMilestone, streakMilestoneBanner,
       maybeShowDidYouKnow, dailyThreeComplete) still surface the
       outcome (overlay, banner, toast) but skip confetti/flash.
     - Injected <style> nodes are always removed in the same
       setTimeout that removes the element — otherwise we leak
       style nodes (~250/day at heavy use).
============================================================= */

function _ylccPrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (e) { return false; }
}

// ═══════════════════════════════════════════════
// CELEBRATION 1 — MEGA CONFETTI BURST
// Used for: Real Life Win completed, all Daily 3 done
// ═══════════════════════════════════════════════
function megaConfetti() {
  if (typeof document === 'undefined') return;
  if (_ylccPrefersReducedMotion()) return;

  const colors = ['#ffd700','#ff6b6b','#4ecdc4','#45b7d1','#96ceb4',
                  '#ffeaa7','#dfe6e9','#fd79a8','#a29bfe','#00b894'];
  var container = document.createElement('div');
  container.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:99999;overflow:hidden;
  `;
  document.body.appendChild(container);

  var styleNodes = [];

  // Create 80 confetti pieces
  for (var i = 0; i < 80; i++) {
    var piece = document.createElement('div');
    var color = colors[Math.floor(Math.random() * colors.length)];
    var size = 6 + Math.random() * 8;
    var isRect = Math.random() > 0.5;
    var startX = 20 + Math.random() * 60; // concentrate in middle
    var delay = Math.random() * 0.4;
    var duration = 1.2 + Math.random() * 0.8;
    var endX = startX + (Math.random() - 0.5) * 60;
    var rotation = Math.random() * 720 - 360;

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

    var style = document.createElement('style');
    style.textContent = `
      @keyframes confettiFall${i} {
        0%   { transform: translateX(0) translateY(0) rotate(0deg); opacity:1; }
        70%  { opacity:1; }
        100% { transform: translateX(${(endX-startX)*3}px) translateY(${window.innerHeight + 50}px) rotate(${rotation}deg); opacity:0; }
      }
    `;
    document.head.appendChild(style);
    styleNodes.push(style);
    container.appendChild(piece);
  }

  setTimeout(function () {
    container.remove();
    for (var j = 0; j < styleNodes.length; j++) styleNodes[j].remove();
  }, 3000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 2 — SCREEN FLASH
// Quick color flash for emphasis
// ═══════════════════════════════════════════════
function screenFlash(color, duration) {
  if (typeof document === 'undefined') return;
  if (_ylccPrefersReducedMotion()) return;
  if (typeof duration !== 'number') duration = 300;

  var el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:${color};opacity:0;pointer-events:none;
    z-index:99998;transition:opacity 0.1s ease;
  `;
  document.body.appendChild(el);
  requestAnimationFrame(function () {
    el.style.opacity = '0.25';
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 300);
    }, duration);
  });
}

// ═══════════════════════════════════════════════
// CELEBRATION 3 — TRAIT EXPLOSION
// Big emoji flies up from bottom when trait awarded
// ═══════════════════════════════════════════════
function traitExplosion(emoji, traitName) {
  if (typeof document === 'undefined') return;
  if (_ylccPrefersReducedMotion()) return;

  var el = document.createElement('div');
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

  var label = document.createElement('div');
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

  var styleEl = document.createElement('style');
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

  setTimeout(function () {
    el.remove();
    label.remove();
    styleEl.remove();
  }, 1800);
}

// ═══════════════════════════════════════════════
// CELEBRATION 4 — REAL LIFE WIN CELEBRATION
// The BIG moment — shown when "I did it" is tapped
// (Structural outcome: overlay always shown. With reduced
//  motion we skip the confetti + flash but keep the overlay.)
// ═══════════════════════════════════════════════
function realLifeWinCelebration(winText) {
  if (typeof document === 'undefined') return;

  var reduced = _ylccPrefersReducedMotion();
  if (!reduced) {
    megaConfetti();
    screenFlash('#00d4aa', 200);
  }

  var overlay = document.createElement('div');
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

  var styleEl = document.createElement('style');
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

  requestAnimationFrame(function () { overlay.style.opacity = '1'; });

  overlay.addEventListener('click', function () {
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.remove(); styleEl.remove(); }, 300);
  });

  // Auto-dismiss after 4 seconds
  setTimeout(function () {
    if (document.body.contains(overlay)) {
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); styleEl.remove(); }, 300);
    }
  }, 4000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 5 — CONVINCE ME CARD FLIP EFFECT
// Category color flash + sequential bullet reveal
// ═══════════════════════════════════════════════
function convinceMeFlipEffect(categoryColor) {
  if (typeof document === 'undefined') return;
  if (_ylccPrefersReducedMotion()) return;
  screenFlash(categoryColor || '#f5c842', 150);
}

function revealBulletsSequentially(backFaceEl) {
  if (typeof document === 'undefined') return;
  if (!backFaceEl) return;
  if (_ylccPrefersReducedMotion()) return;

  var bullets = backFaceEl.querySelectorAll('.cm-bullet, li, .cm-evidence-item');
  bullets.forEach(function (b, i) {
    b.style.opacity = '0';
    b.style.transform = 'translateX(-15px)';
    b.style.transition = 'all 0.3s ease';
    setTimeout(function () {
      b.style.opacity = '1';
      b.style.transform = 'translateX(0)';
    }, 200 + i * 150);
  });
  // Closer line
  var closer = backFaceEl.querySelector('.cm-closer, .cm-conclusion');
  if (closer) {
    closer.style.opacity = '0';
    setTimeout(function () {
      closer.style.transition = 'opacity 0.4s ease';
      closer.style.opacity = '1';
    }, 200 + bullets.length * 150 + 100);
  }
}

// ═══════════════════════════════════════════════
// CELEBRATION 6 — CURIOSITY STREAK MILESTONE
// Shown when streak hits 3, 5, 7, 14, 30 days
// (Structural outcome: banner always shown. With reduced
//  motion we skip the flash but keep the banner copy.)
// ═══════════════════════════════════════════════
function curiosityStreakMilestone(days) {
  if (typeof document === 'undefined') return;

  const messages = {
    3:  { text: "You're asking the right questions 🔥", color: '#ff6b35' },
    5:  { text: "Most people never look this deep ⚡", color: '#ffd700' },
    7:  { text: "One week of curiosity. That's rare 🌟", color: '#a29bfe' },
    14: { text: "Two weeks. Your faith is being built 📖", color: '#00b894' },
    30: { text: "A month of seeking. You've changed 🚀", color: '#fd79a8' },
  };
  var m = messages[days];
  if (!m) return;

  var reduced = _ylccPrefersReducedMotion();
  if (!reduced) screenFlash(m.color, 200);

  var banner = document.createElement('div');
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
  requestAnimationFrame(function () { banner.style.transform = 'translateY(0)'; });
  setTimeout(function () {
    banner.style.transform = 'translateY(-100%)';
    setTimeout(function () { banner.remove(); }, 400);
  }, 3000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 7 — DID YOU KNOW? SURPRISE FACT
// Pops up randomly after card flip (12% chance)
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
  if (typeof document === 'undefined') return;
  if (Math.random() > 0.12) return; // 12% chance
  var facts = DID_YOU_KNOW.filter(function (f) { return f.cat === category || Math.random() > 0.5; });
  if (!facts.length) return;
  var item = facts[Math.floor(Math.random() * facts.length)];
  var reduced = _ylccPrefersReducedMotion();

  setTimeout(function () {
    var el = document.createElement('div');
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
      opacity:${reduced ? '1' : '0'};
      transform:${reduced ? 'translateX(0)' : 'translateX(20px)'};
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
    if (!reduced) {
      requestAnimationFrame(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      });
    }
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(function () { el.remove(); }, 400);
    }, 4000);
  }, 800); // slight delay after flip
}

// ═══════════════════════════════════════════════
// CELEBRATION 8 — DAILY 3 ALL COMPLETE
// The big home screen moment
// (Structural outcome: "Day complete!" card always shown.
//  With reduced motion we skip the confetti + flash.)
// ═══════════════════════════════════════════════
function dailyThreeComplete() {
  if (typeof document === 'undefined') return;

  var reduced = _ylccPrefersReducedMotion();
  if (!reduced) {
    megaConfetti();
    screenFlash('#ffd700', 300);
  }

  setTimeout(function () {
    var el = document.createElement('div');
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

    var styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes dailyPop {
        0%   { transform:translateX(-50%) scale(0); }
        60%  { transform:translateX(-50%) scale(1.05); }
        100% { transform:translateX(-50%) scale(1); }
      }
    `;
    document.head.appendChild(styleEl);
    document.body.appendChild(el);

    setTimeout(function () {
      el.style.transition = 'all 0.4s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(20px) scale(0.9)';
      setTimeout(function () { el.remove(); styleEl.remove(); }, 400);
    }, 3500);
  }, reduced ? 0 : 400);
}

// ═══════════════════════════════════════════════
// CELEBRATION 9 — STREAK MILESTONE BANNER
// Fires at 3, 7, 14, 30, 50, 100 days
// (Structural outcome: banner always shown. With reduced
//  motion we skip the flash but keep the banner copy.)
// ═══════════════════════════════════════════════
function streakMilestoneBanner(days) {
  if (typeof document === 'undefined') return;

  var colors = {
    3:'#fd79a8', 7:'#e17055', 14:'#fdcb6e',
    30:'#e84393', 50:'#a29bfe', 100:'#ffd700'
  };
  var c = colors[days] || '#ffd700';
  var reduced = _ylccPrefersReducedMotion();
  if (!reduced) screenFlash(c, 200);

  var banner = document.createElement('div');
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

  requestAnimationFrame(function () { banner.style.transform = 'translateY(0)'; });
  setTimeout(function () {
    banner.style.transition = 'transform 0.4s ease';
    banner.style.transform = 'translateY(-100%)';
    setTimeout(function () { banner.remove(); }, 400);
  }, 3000);
}

// ═══════════════════════════════════════════════
// CELEBRATION 10 — PRAYER SUBMIT DOVE
// Dove floats up from the submit button when prayer submitted
// ═══════════════════════════════════════════════
function prayerDove(sourceEl) {
  if (typeof document === 'undefined') return;
  if (_ylccPrefersReducedMotion()) return;

  var rect = (sourceEl && typeof sourceEl.getBoundingClientRect === 'function')
    ? sourceEl.getBoundingClientRect()
    : { left: window.innerWidth/2, top: window.innerHeight/2, width: 0 };
  var startX = rect.left + (rect.width||0)/2;
  var startY = rect.top;

  var el = document.createElement('div');
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

  var styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes doveFloat {
      0%   { transform:translate(-50%,-50%) scale(0.5); opacity:0; }
      20%  { transform:translate(-50%,-50%) scale(1.2); opacity:1; }
      60%  { transform:translate(calc(-50% + ${(Math.random()-0.5)*40}px), calc(-50% - 120px)) scale(1); opacity:1; }
      100% { transform:translate(calc(-50% + ${(Math.random()-0.5)*60}px), calc(-50% - 220px)) scale(0.6); opacity:0; }
    }
  `;
  document.head.appendChild(styleEl);

  setTimeout(function () { el.remove(); styleEl.remove(); }, 1700);
}

// ═══════════════════════════════════════════════
// EXPOSE GLOBALLY
// ═══════════════════════════════════════════════
window.megaConfetti              = megaConfetti;
window.screenFlash               = screenFlash;
window.traitExplosion            = traitExplosion;
window.realLifeWinCelebration    = realLifeWinCelebration;
window.convinceMeFlipEffect      = convinceMeFlipEffect;
window.revealBulletsSequentially = revealBulletsSequentially;
window.curiosityStreakMilestone  = curiosityStreakMilestone;
window.maybeShowDidYouKnow       = maybeShowDidYouKnow;
window.dailyThreeComplete        = dailyThreeComplete;
window.streakMilestoneBanner     = streakMilestoneBanner;
window.prayerDove                = prayerDove;
