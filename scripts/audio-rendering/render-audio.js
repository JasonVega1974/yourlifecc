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
const OUT_DIR = path.join(__dirname, 'output');

if(!API_KEY && !DRY_RUN){
  console.error('ERROR: Set OPENAI_API_KEY env var before running.');
  process.exit(1);
}

if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

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

// ── Stats ─────────────────────────────────────────────────────────────────────
const totalChars = jobs.reduce(function(a,j){ return a + j.text.length; }, 0);
const costUSD    = (totalChars / 1_000_000) * 15; // tts-1: $15 / 1M chars
console.log('Jobs:', jobs.length, '| Characters:', totalChars.toLocaleString(), '| Est. cost: $' + costUSD.toFixed(2));

if(DRY_RUN){
  console.log('DRY_RUN=1 — no API calls made.');
  jobs.forEach(function(j){ console.log(' ', j.file, '(' + j.text.length + ' chars)'); });
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
  for(var j of jobs){
    var outFile = path.join(OUT_DIR, j.file);
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
  console.log('Output directory:', OUT_DIR);
})();
