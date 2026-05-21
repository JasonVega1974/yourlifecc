#!/usr/bin/env node
// YourLife CC — OpenAI TTS pre-render script
// Reads AUDIO_MEDITATIONS + SLEEP_STORIES, calls OpenAI TTS for each segment,
// saves MP3 files to ./output/ with naming {id}_seg{N}.mp3 (meditations) or
// {id}_verse{N}.mp3 (sleep stories).
//
// Usage:
//   OPENAI_API_KEY=sk-... node scripts/audio-rendering/render-audio.js
//   # Optional: dry-run (count chars only, no API calls)
//   DRY_RUN=1 node scripts/audio-rendering/render-audio.js

'use strict';
const fs   = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.OPENAI_API_KEY;
const DRY_RUN = process.env.DRY_RUN === '1';
const VOICE   = process.env.TTS_VOICE || 'nova';   // nova = warm female, shimmer/echo/alloy also work
const MODEL   = 'tts-1';
const OUT_DIR      = path.join(__dirname, 'output');
const VOTD_OUT_DIR = path.join(__dirname, 'output', 'votd');

if(!API_KEY && !DRY_RUN){
  console.error('ERROR: Set OPENAI_API_KEY env var before running.');
  process.exit(1);
}

if(!fs.existsSync(OUT_DIR))      fs.mkdirSync(OUT_DIR,      { recursive: true });
if(!fs.existsSync(VOTD_OUT_DIR)) fs.mkdirSync(VOTD_OUT_DIR, { recursive: true });

// ── Load data ────────────────────────────────────────────────────────────────
// The data file uses const declarations — wrap in a function scope via eval.
const dataPath = path.join(__dirname, '../../app/js/data/audio-content.js');
const dataCode = fs.readFileSync(dataPath, 'utf8');
// Strip the trailing alias lines and execute; extract globals via global object trick.
const sandbox = {};
const wrapped = `(function(exports){${dataCode}\nexports.AUDIO_MEDITATIONS=AUDIO_MEDITATIONS;\nexports.SLEEP_STORIES=SLEEP_STORIES;\n})(sandbox)`;
try { eval(wrapped); } catch(e){ console.error('Failed to parse audio-content.js:', e.message); process.exit(1); }
const { AUDIO_MEDITATIONS, SLEEP_STORIES } = sandbox;

// ── Build work queue ──────────────────────────────────────────────────────────
const jobs = [];

(AUDIO_MEDITATIONS || []).forEach(function(med){
  (med.segments || []).forEach(function(seg, i){
    var text = (seg.text||'') + (seg.verse ? ' — ' + seg.verse : '');
    if(!text.trim()) return;
    jobs.push({
      file: med.id + '_seg' + i + '.mp3',
      text: text.trim(),
      source: med.id + ' seg ' + i
    });
  });
});

(SLEEP_STORIES || []).forEach(function(story){
  var segments = story.verses
    ? story.verses.slice()
    : (story.content || '').split('...').map(function(t){ return t.trim(); }).filter(Boolean);
  segments.forEach(function(seg, i){
    if(!seg.trim()) return;
    jobs.push({
      file: story.id + '_verse' + i + '.mp3',
      text: seg.trim(),
      source: story.id + ' verse ' + i
    });
  });
});

// ── VOTD (DAILY_SCRIPTURES) — extracted from faith.js ────────────────────────
// Bracket-count parser: avoids eval-ing 12,500 lines of faith.js.
// Output: output/votd/votd_{idx}.mp3 — copy to app/audio/votd/ after render.
var DAILY_SCRIPTURES = [];
try {
  var faithPath = path.join(__dirname, '../../app/js/faith.js');
  var faithCode = fs.readFileSync(faithPath, 'utf8');
  var dsStart = faithCode.indexOf('const DAILY_SCRIPTURES = [');
  if(dsStart >= 0){
    var arrStart = dsStart + 'const DAILY_SCRIPTURES = '.length;
    var depth = 0, i = arrStart;
    for(; i < faithCode.length; i++){
      if(faithCode[i]==='[') depth++;
      else if(faithCode[i]===']'){ depth--; if(depth===0){ i++; break; } }
    }
    var arrStr = faithCode.slice(arrStart, i);
    DAILY_SCRIPTURES = eval(arrStr); // eslint-disable-line no-eval
    console.log('VOTD: Extracted', DAILY_SCRIPTURES.length, 'verses from faith.js');
  } else {
    console.warn('VOTD: DAILY_SCRIPTURES not found in faith.js — skipping');
  }
} catch(e){
  console.warn('VOTD: Could not parse faith.js:', e.message, '— skipping VOTD render');
}

// Add VOTD jobs — each file name encodes the index so speakVotd() can load
// /app/audio/votd/votd_{idx}.mp3 directly by day index from getVotdForDay().
var votdJobs = [];
(DAILY_SCRIPTURES || []).forEach(function(entry, idx){
  var verse = Array.isArray(entry) ? entry[0] : '';
  var ref   = Array.isArray(entry) ? entry[1] : '';
  if(!verse || !verse.trim()) return;
  var text = (ref ? ref + '. ' : '') + verse;
  votdJobs.push({
    file:   'votd_' + idx + '.mp3',
    text:   text.trim(),
    source: 'votd idx ' + idx,
    outDir: VOTD_OUT_DIR
  });
});

// ── Stats ─────────────────────────────────────────────────────────────────────
var allJobs = jobs.concat(votdJobs);
var totalChars = allJobs.reduce(function(a,j){ return a + j.text.length; }, 0);
var costUSD    = (totalChars / 1_000_000) * 15; // tts-1: $15 / 1M chars
console.log('Jobs:', allJobs.length, '('+jobs.length+' med/story + '+votdJobs.length+' VOTD) | Characters:', totalChars.toLocaleString(), '| Est. cost: $' + costUSD.toFixed(2));

if(DRY_RUN){
  console.log('DRY_RUN=1 — no API calls made.');
  allJobs.forEach(function(j){ console.log(' ', j.file, '(' + j.text.length + ' chars)'); });
  process.exit(0);
}

// ── TTS helper ────────────────────────────────────────────────────────────────
function ttsToFile(text, outFile){
  return new Promise(function(resolve, reject){
    if(fs.existsSync(outFile)){
      console.log('  SKIP (exists):', path.basename(outFile));
      return resolve();
    }
    var body = JSON.stringify({ model: MODEL, voice: VOICE, input: text });
    var options = {
      hostname: 'api.openai.com',
      path: '/v1/audio/speech',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    var req = https.request(options, function(res){
      if(res.statusCode !== 200){
        var err = '';
        res.on('data', function(d){ err += d; });
        res.on('end', function(){ reject(new Error('API ' + res.statusCode + ': ' + err)); });
        return;
      }
      var chunks = [];
      res.on('data', function(c){ chunks.push(c); });
      res.on('end', function(){
        fs.writeFileSync(outFile, Buffer.concat(chunks));
        console.log('  OK:', path.basename(outFile));
        resolve();
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Sequential run (avoid rate-limit bursts) ──────────────────────────────────
(async function run(){
  var ok = 0, skip = 0, fail = 0;
  for(var j of allJobs){
    var dir = j.outDir || OUT_DIR;
    var outFile = path.join(dir, j.file);
    try {
      if(fs.existsSync(outFile)){ skip++; continue; }
      await ttsToFile(j.text, outFile);
      ok++;
      await new Promise(function(r){ setTimeout(r, 200); }); // gentle rate limiting
    } catch(e){
      console.error('  FAIL:', j.source, '-', e.message);
      fail++;
    }
  }
  console.log('\nDone. Generated:', ok, '| Skipped:', skip, '| Failed:', fail);
  console.log('Meditation/story output:', OUT_DIR);
  console.log('VOTD output:', VOTD_OUT_DIR);
  console.log('After render: copy output/votd/*.mp3 → app/audio/votd/');
})();
