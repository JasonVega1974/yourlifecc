/* nav-smoke.js — Phase 2 unified back model, source-level regression harness.
   Run: node scratch/nav-smoke.js  (from repo root)
   DOM behavior can't run under node; these assertions pin the structural
   invariants that the flow model depends on, so a future edit that breaks
   one fails loudly here. */
'use strict';
const fs = require('fs');
let pass = 0, fail = 0;
function T(name, cond){ (cond ? (pass++, console.log('  PASS ' + name)) : (fail++, console.log('  FAIL ' + name))); }
const ui = fs.readFileSync('app/js/ui.js', 'utf8');
const cc = fs.readFileSync('app/js/command-center.js', 'utf8');
const wo = fs.readFileSync('app/js/worship.js', 'utf8');
const pj = fs.readFileSync('app/js/parent.js', 'utf8');
const ix = fs.readFileSync('app/index.html', 'utf8');
const sy = fs.readFileSync('app/js/sync.js', 'utf8');
const inj = fs.readFileSync('app/js/init.js', 'utf8');
const da = fs.readFileSync('app/js/data.js', 'utf8');

console.log('\n[1] back model core (ui.js)');
T('origin stack declared', /var _navStack = \[\]/.test(ui));
T('ylBack pops one level with s-hero fallback', /_navStack\.pop\(\) : 's-hero'/.test(ui));
T('hub landing clears the stack', /_ylIsHub\(id\)\)\{ _navStack\.length = 0/.test(ui));
T('revisit truncates instead of pushing (loop guard)', /_navStack\.indexOf\(id\)/.test(ui) && /_navStack\.length = _ri/.test(ui));
T('stack hard cap present', /_navStack\.length > 10\) _navStack\.shift/.test(ui));
T('recording skips back-driven hops', /!_navIsBack && id !== _prevSection/.test(ui));
T('recording uses POST-redirect id (after _activeSection assignment)',
  ui.indexOf('_activeSection = id;') < ui.indexOf('if(!_navIsBack && id !== _prevSection)'));

console.log('\n[2] one history sentinel');
T('hub consumes sentinel', /if\(_hs && _hs\.ylccSec\) window\.history\.back\(\)/.test(ui));
T('lateral hop replaces (never stacks)', /window\.history\.replaceState\(\{ ylccSec: id \}/.test(ui));
T('hub→destination pushes once', /window\.history\.pushState\(\{ ylccSec: id \}/.test(ui));
T('climb overlay pushes cc-climb sentinel', /pushState\(\{ ylccSec: 'cc-climb' \}/.test(cc));
T('walk overlay pushes cc-walk sentinel', /pushState\(\{ ylccSec: 'cc-walk' \}/.test(cc));
T('ccCloseClimb itself is history-free (tool-launch race guard)',
  !/function ccCloseClimb\(\)[\s\S]{0,400}history\.back/.test(cc));

console.log('\n[3] popstate dispatch order (media surfaces own theirs)');
const pop = ui.slice(ui.indexOf("addEventListener('popstate'"), ui.indexOf("addEventListener('popstate'") + 2200);
T('meditation/sleep guard before section back', pop.indexOf('meditationOverlay') !== -1 && pop.indexOf('meditationOverlay') < pop.indexOf('ylBack()'));
T('video player guard present', /videoPlayerOverlay/.test(pop));
T('worship active guard present', /s-worship/.test(pop));
T('climb station sheet closes first, repushes', /lifeCloseStation/.test(pop) && /_ylNavRepush\('cc-climb'\)/.test(pop));
T('on-hub pop is a no-op (rule 4)', /if\(!_ylIsHub\(_activeSection\)\) ylBack\(\)/.test(pop));

console.log('\n[4] hardcoded backs retired');
T('#mobileHomeBack routes through ylBack', /mobileHomeBack[\s\S]{0,200}ylBack/.test(ix));
T('flatnav-back routes through ylBack', /flatnav-back[\s\S]{0,400}ylBack/.test(ui));
T('flatnav-back excludes s-worship', /s-worship'\) return;/.test(ui.slice(ui.indexOf('_ensureFlatBack'))));
T('mobile pill suppressed on s-worship', /_activeSection === 's-worship'\)/.test(ui));
T('worship close honors origin, Well fallback kept', /ylBackHasOrigin\(\) && typeof ylBack === 'function'\) ylBack\(\)/.test(wo) && /wellGoto\('home'\)/.test(wo));

console.log('\n[5] parent hub');
T('crumb goes to phNav(home), not splash re-gate', /phNav==='function'\)&&phNav\('home'\)"\s*id="phn-home-link"/.test(ix));
T('drill-down exit pill created', /phDrillExitPill/.test(pj));
T('pill removed in parentDrillExit (all exit paths)', /parentDrillExit[\s\S]{0,900}phDrillExitPill/.test(pj.slice(pj.indexOf('function parentDrillExit'))));

console.log('\n[6] age-bracket allowlist');
T('habits in ALL_SECTIONS', /\{id:'s-habits',label:/.test(ui));
T('habits backfill for existing brackets', /_alw\.has\('habits'\) && D\.sections\.habits === undefined/.test(inj));
T('My Faith tile honors sections.scripture===0', /D\.sections\.scripture === 0/.test(cc));
T("FORCE key fixed in sync.js ('christian-living')", /'christian-living'/.test(sy) && !/'christianLiving'/.test(sy));
T('FORCE key fixed in init.js', /'christian-living'/.test(inj) && !/'christianLiving'/.test(inj));
T("DEF mode is a valid stage key", /mode:'mid_hs'/.test(da) && !/mode:'high'/.test(da));

console.log('\n[7] tgOpenTopic scroll reset');
const tg = ui.slice(ui.indexOf('function tgOpenTopic'), ui.indexOf('function tgInitAll'));
T('scrollTo(0,0) at the end of tgOpenTopic', /window\.scrollTo\(0,0\)/.test(tg));

console.log('\n══ RESULT: ' + pass + ' pass / ' + fail + ' fail ══');
process.exit(fail ? 1 : 0);
