// YourLife CC — The Odds Machine (Proof & Prophecy §4a, 2026-07-06)
// An interactive probability stacker: 8 messianic prophecies, one at a
// time (OT prophecy → NT fulfillment → conservative odds), with a BIG
// running multiplier that GROWS as they stack — 10^5 → 10^8 → … →
// 10^17 for all 8. Finale: a silver-dollar "cover Texas" scene + a
// canvas share-card (the thing teens screenshot) + a door into the
// Prophecy category of Proof & Prophecy.
// SETTLE — evidence presented is not a quiz won: no XP, no streak, no
// confetti; the share IS the engagement loop.
//
// LAYOUT-BUG ROOT CAUSE (2026-07-06): the share-card canvas lives
// inside #oddsShareModal (a display:none .mo), never in document flow —
// the same containment the working Academy diploma uses. It contributes
// ZERO to page height when idle. The whole interactive is inside
// #oddsOverlay (display:none idle), so nothing here can intrude on the
// fixed sidebar's hit region.

var _oddsStep = 0;   // 0 = closed; 1..8 = prophecy screens; 9 = finale
var _oddsAnimRAF = 0;

function _oddsData(){ return (typeof window !== 'undefined' && window.ODDS_MACHINE) || []; }
function _oddsEsc(s){
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function _oddsReduced(){
  try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  catch(_e){ return false; }
}
// Cumulative log10-odds after `step` prophecies (sum of pow).
function _oddsCum(step){
  var d = _oddsData(), s = 0;
  for(var i = 0; i < step && i < d.length; i++) s += d[i].pow;
  return s;
}
// "1 in 10^N" → a friendly gloss for the smaller milestones so the
// number means something before it goes astronomical.
function _oddsGloss(pow){
  var names = { 5:'a hundred thousand', 6:'a million', 8:'a hundred million', 9:'a billion',
    10:'ten billion', 12:'a trillion', 14:'a hundred trillion', 15:'a quadrillion', 17:'a hundred quadrillion' };
  return names[pow] || null;
}

function oddsOpen(){
  var ov = document.getElementById('oddsOverlay');
  if(!ov || !_oddsData().length) return;
  ov.style.display = 'flex';
  try { document.body.style.overflow = 'hidden'; } catch(_e){}
  _oddsStep = 1;
  _oddsRender();
  if(!ov.dataset.keys){
    ov.dataset.keys = '1';
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && document.getElementById('oddsOverlay') && document.getElementById('oddsOverlay').style.display !== 'none') oddsClose();
    });
  }
}

function oddsClose(){
  _oddsStep = 0;
  if(_oddsAnimRAF){ try { cancelAnimationFrame(_oddsAnimRAF); } catch(_e){} _oddsAnimRAF = 0; }
  var ov = document.getElementById('oddsOverlay');
  if(ov) ov.style.display = 'none';
  var sm = document.getElementById('oddsShareModal');
  if(sm) sm.classList.remove('open');
  try { document.body.style.overflow = ''; } catch(_e){}
}

function _oddsRender(){
  var host = document.getElementById('oddsHost');
  if(!host) return;
  if(_oddsStep >= 9){ _oddsRenderFinale(); return; }
  var d = _oddsData();
  var p = d[_oddsStep - 1];
  if(!p){ oddsClose(); return; }
  var esc = _oddsEsc;
  var cum = _oddsCum(_oddsStep);
  var prevCum = _oddsCum(_oddsStep - 1);
  var gloss = _oddsGloss(cum);
  // Progress pips
  var pips = '';
  for(var i = 1; i <= d.length; i++){
    pips += '<span class="odm-pip' + (i <= _oddsStep ? ' on' : '') + '"></span>';
  }
  host.innerHTML =
    '<button type="button" class="odm-close" onclick="oddsClose()" aria-label="Close">✕</button>' +
    '<div class="odm-pips" aria-hidden="true">' + pips + '</div>' +
    '<div class="odm-step">' +
      '<div class="odm-eyebrow">Prophecy ' + _oddsStep + ' of ' + d.length + '</div>' +
      '<div class="odm-ptitle">' + esc(p.title) + '</div>' +
      '<div class="odm-verse odm-ot"><span class="odm-vref">' + esc(p.otRef) + '</span>' + esc(p.otText) + '</div>' +
      '<div class="odm-arrow" aria-hidden="true">↓ fulfilled ↓</div>' +
      '<div class="odm-verse odm-nt"><span class="odm-vref">' + esc(p.ntRef) + '</span>' + esc(p.ntText) + '</div>' +
      '<div class="odm-odds">Chance of this alone: <strong>' + esc(p.odds) + '</strong></div>' +
      '<div class="odm-multi">' +
        '<div class="odm-multi-lbl">Stacked so far</div>' +
        '<div class="odm-multi-big" id="oddsBig" aria-live="polite">1 in 10<sup>' + prevCum + '</sup></div>' +
        (gloss ? '<div class="odm-multi-gloss" id="oddsGloss">one in ' + esc(gloss) + '</div>' : '<div class="odm-multi-gloss" id="oddsGloss"></div>') +
      '</div>' +
      '<button type="button" class="odm-cta" onclick="oddsNext()">' + (_oddsStep < d.length ? 'Stack the next one →' : 'See the odds →') + '</button>' +
    '</div>';
  // Roll the exponent from prevCum → cum with a scale pulse. Evidence
  // landing, not a slot machine: one smooth ~600ms climb, no spin.
  _oddsAnimExponent(prevCum, cum, gloss);
}

function _oddsAnimExponent(from, to, gloss){
  var big = document.getElementById('oddsBig');
  if(!big) return;
  if(_oddsReduced() || from === to){
    big.innerHTML = '1 in 10<sup>' + to + '</sup>';
    big.classList.add('odm-pulse');
    return;
  }
  var t0 = null, DUR = 650;
  var stepFn = function(ts){
    if(t0 === null) t0 = ts;
    var k = Math.min(1, (ts - t0) / DUR);
    var eased = 1 - Math.pow(1 - k, 3);
    var n = Math.round(from + (to - from) * eased);
    big.innerHTML = '1 in 10<sup>' + n + '</sup>';
    if(k < 1){ _oddsAnimRAF = requestAnimationFrame(stepFn); }
    else { big.classList.add('odm-pulse'); }
  };
  _oddsAnimRAF = requestAnimationFrame(stepFn);
}

function oddsNext(){
  var d = _oddsData();
  _oddsStep = (_oddsStep < d.length) ? _oddsStep + 1 : 9;
  _oddsRender();
}

function _oddsRenderFinale(){
  var host = document.getElementById('oddsHost');
  if(!host) return;
  var total = (typeof window !== 'undefined' && window.ODDS_MACHINE_TOTAL_POW) || _oddsCum(_oddsData().length);
  // Silver-dollar "Texas" scene — a dense field of silver dots with ONE
  // marked gold coin. Geometric/typographic only (no imagery of Jesus).
  var scene =
    '<div class="odm-tex" aria-hidden="true">' +
      '<div class="odm-tex-field"></div>' +
      '<div class="odm-tex-mark"></div>' +
    '</div>' +
    '<div class="odm-tex-cap">Cover Texas two feet deep in silver dollars. Mark one. Blindfold a man. One pick — anywhere in the state.</div>';
  host.innerHTML =
    '<button type="button" class="odm-close" onclick="oddsClose()" aria-label="Close">✕</button>' +
    '<div class="odm-fin">' +
      '<div class="odm-eyebrow">All eight, in one man</div>' +
      '<div class="odm-fin-big">1 in 10<sup>' + total + '</sup></div>' +
      '<div class="odm-fin-sub">That is the chance of one person fulfilling just these eight by accident.</div>' +
      scene +
      '<div class="odm-fin-actions">' +
        '<button type="button" class="odm-cta" onclick="oddsOpenShare()">Share this ↗</button>' +
        '<button type="button" class="odm-door" onclick="oddsDoorToProphecy()">One man fulfilled all eight. And 40+ more →</button>' +
      '</div>' +
    '</div>';
  // Settle — evidence received, not a level cleared. One low bell.
  if(window.sfx && typeof window.sfx.settle === 'function') window.sfx.settle();
  if(typeof logFaithActivity === 'function') try { logFaithActivity('proof', { source: 'odds-machine' }); } catch(_e){}
}

// ── Share card — canvas inside a display:none .mo (diploma pattern) ──
function oddsOpenShare(){
  var sm = document.getElementById('oddsShareModal');
  if(!sm) return;
  sm.classList.add('open');
  _oddsRenderShareCard();
}
function oddsCloseShare(){
  var sm = document.getElementById('oddsShareModal');
  if(sm) sm.classList.remove('open');
}

function _oddsRenderShareCard(){
  var canvas = document.getElementById('oddsShareCanvas');
  if(!canvas) return;
  var total = (typeof window !== 'undefined' && window.ODDS_MACHINE_TOTAL_POW) || 17;
  var draw = function(){
    var W = 1080, H = 1080;
    var dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? Math.min(3, window.devicePixelRatio) : 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = '100%'; canvas.style.maxWidth = '420px'; canvas.style.height = 'auto';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0a0d1a'); g.addColorStop(1, '#1a1233');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(251,191,36,.85)'; ctx.lineWidth = 3; ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.strokeStyle = 'rgba(251,191,36,.3)'; ctx.lineWidth = 1; ctx.strokeRect(54, 54, W - 108, H - 108);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(251,191,36,.8)';
    ctx.font = '700 30px Georgia, serif';
    ctx.fillText('T H E   O D D S', W / 2, 250);
    // Hero: 1 in 10^17 with a raised exponent.
    ctx.fillStyle = '#fbbf24';
    ctx.font = '150px "Bebas Neue", Georgia, serif';
    var base = '1 IN 10';
    var baseW = ctx.measureText(base).width;
    ctx.font = '80px "Bebas Neue", Georgia, serif';
    var expW = ctx.measureText(String(total)).width;
    var startX = W / 2 - (baseW + expW) / 2;
    ctx.textAlign = 'left';
    ctx.font = '150px "Bebas Neue", Georgia, serif';
    ctx.fillText(base, startX, 560);
    ctx.font = '80px "Bebas Neue", Georgia, serif';
    ctx.fillText(String(total), startX + baseW + 6, 500);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(241,233,213,.85)';
    ctx.font = 'italic 34px Georgia, serif';
    ctx.fillText('Eight prophecies. One man.', W / 2, 700);
    ctx.fillStyle = 'rgba(241,233,213,.6)';
    ctx.font = '26px Georgia, serif';
    ctx.fillText('The chance of fulfilling just eight by accident.', W / 2, 750);
    ctx.fillStyle = 'rgba(251,191,36,.7)';
    ctx.font = '700 26px Georgia, serif';
    ctx.fillText('yourlifecc.com', W / 2, 960);
  };
  // Bebas Neue is a webfont — gate on fonts so the fallback serif never
  // bakes into the exported PNG (diploma lesson).
  try {
    if(document.fonts && document.fonts.ready && typeof document.fonts.load === 'function'){
      document.fonts.load('150px "Bebas Neue"').then(draw).catch(draw);
    } else { draw(); }
  } catch(_e){ draw(); }
}

function _oddsShareBlob(cb){
  var canvas = document.getElementById('oddsShareCanvas');
  if(!canvas){ cb(null); return; }
  try { canvas.toBlob(function(b){ cb(b); }, 'image/png'); }
  catch(_e){
    try {
      var dataUrl = canvas.toDataURL('image/png');
      var bin = atob(dataUrl.split(',')[1]);
      var arr = new Uint8Array(bin.length);
      for(var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      cb(new Blob([arr], { type: 'image/png' }));
    } catch(_e2){ cb(null); }
  }
}
function oddsShareDownload(){
  _oddsShareBlob(function(blob){
    if(!blob){ if(typeof showToast === 'function') showToast('Could not export the card'); return; }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'yourlifecc-odds.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
    if(typeof showToast === 'function') showToast('Saved ✓');
  });
}
function oddsShareShare(){
  _oddsShareBlob(function(blob){
    if(!blob){ oddsShareDownload(); return; }
    try {
      var file = new File([blob], 'yourlifecc-odds.png', { type: 'image/png' });
      if(navigator.canShare && navigator.share && navigator.canShare({ files: [file] })){
        navigator.share({ files: [file], title: 'The Odds' }).catch(function(){});
        return;
      }
    } catch(_e){}
    oddsShareDownload();
  });
}

// Door into the Prophecy category of Proof & Prophecy.
function oddsDoorToProphecy(){
  oddsClose();
  try {
    if(typeof bfTab === 'function') bfTab('proofProphecy');
    setTimeout(function(){ if(typeof ppSetCategory === 'function') ppSetCategory('prophecy'); }, 120);
  } catch(_e){}
}
