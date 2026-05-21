#!/usr/bin/env node
// Wires pre-rendered MP3 audioUrl fields into AUDIO_MEDITATIONS segments
// and segmentAudioUrls arrays into SLEEP_STORIES in audio-content.js.
// Safe to re-run — skips entries that already have the field.
'use strict';
const fs   = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '../../app/js/data/audio-content.js');
const src = fs.readFileSync(contentPath, 'utf8');

// Load runtime objects via eval (same approach as render-audio.js)
const sandbox = {};
eval(`(function(e){${src}\ne.M=AUDIO_MEDITATIONS;e.S=SLEEP_STORIES;})(sandbox)`);
const meds    = sandbox.M;
const stories = sandbox.S;

// Pre-compute segmentAudioUrls array for each story
// Uses the same segment-splitting logic as render-audio.js
const storyUrls = {};
stories.forEach(function(s) {
  const segs = s.verses
    ? s.verses
    : (s.content || '').split('...').map(function(t){ return t.trim(); }).filter(Boolean);
  storyUrls[s.id] = segs.map(function(_, i){
    return "'/audio/" + s.id + '_verse' + i + ".mp3'";
  });
});

// Normalize CRLF → LF so the closing `$` regex anchors work on Windows
const lines = src.replace(/\r\n/g, '\n').split('\n');
const out   = [];
let curMedIdx  = -1;
let curSegIdx  = 0;
let inMedSegs  = false;
let curStoryId = null;
let inVerses   = false;
const processed = new Set();

for(let li = 0; li < lines.length; li++) {
  const line = lines[li];
  const t    = line.trim();

  // ── Detect meditation id ────────────────────────────────────────────────
  const midM = line.match(/^\s+id:\s*'(med-[^']+)'/);
  if(midM) {
    curMedIdx  = meds.findIndex(function(m){ return m.id === midM[1]; });
    curSegIdx  = 0;
    inMedSegs  = false;
    curStoryId = null;
    inVerses   = false;
  }

  // ── Detect sleep story id ───────────────────────────────────────────────
  const sidM = line.match(/^\s+id:\s*'(sleep-[^']+)'/);
  if(sidM) {
    curStoryId = sidM[1];
    curMedIdx  = -1;
    inMedSegs  = false;
    inVerses   = false;
  }

  // ── Track meditation segments: [ open ──────────────────────────────────
  if(curMedIdx >= 0 && t === 'segments: [') {
    inMedSegs = true;
    curSegIdx = 0;
    out.push(line);
    continue;
  }
  // Track segments array close
  if(inMedSegs && t === ']') {
    inMedSegs = false;
    // fall through to out.push(line)
  }

  // ── Inject audioUrl into each segment line ──────────────────────────────
  if(inMedSegs && t.startsWith('{ duration:')) {
    const med = meds[curMedIdx];
    const url = '/audio/' + med.id + '_seg' + curSegIdx + '.mp3';
    curSegIdx++;
    if(!t.includes('audioUrl')) {
      // Handles both trailing ` },` (non-last) and ` }` (last segment)
      out.push(line.replace(/ \}(,?)$/, ", audioUrl: '" + url + "' }$1"));
      continue;
    }
  }

  // ── Track verses: [ open for story objects ─────────────────────────────
  if(curStoryId && t === 'verses: [') {
    inVerses = true;
    out.push(line);
    continue;
  }

  // ── Detect closing ] of verses array and inject segmentAudioUrls ───────
  if(inVerses && t === ']') {
    inVerses = false;
    // Add comma after ] so segmentAudioUrls becomes a valid next property
    out.push(line + ',');
    if(curStoryId && !processed.has(curStoryId)) {
      processed.add(curStoryId);
      const urls   = storyUrls[curStoryId];
      const indent = (line.match(/^(\s+)/) || ['', '    '])[1];
      out.push(indent + 'segmentAudioUrls: [' + urls.join(', ') + ']');
    }
    continue;
  }

  // ── Inject segmentAudioUrls after repeatCount or fullPassage ───────────
  // (for stories that use a `content` string instead of a `verses` array)
  if(curStoryId && !processed.has(curStoryId) &&
     (t.startsWith('repeatCount:') || t.startsWith('fullPassage:'))) {
    processed.add(curStoryId);
    // Ensure the current line ends with a comma (property separator)
    const lineWithComma = line.endsWith(',') ? line : line + ',';
    out.push(lineWithComma);
    const urls   = storyUrls[curStoryId];
    const indent = (line.match(/^(\s+)/) || ['', '    '])[1];
    out.push(indent + 'segmentAudioUrls: [' + urls.join(', ') + ']');
    continue;
  }

  out.push(line);
}

fs.writeFileSync(contentPath, out.join('\n'), 'utf8');

// ── Summary ─────────────────────────────────────────────────────────────────
const totalSegs   = meds.reduce(function(a, m){ return a + m.segments.length; }, 0);
const totalStoryV = Object.values(storyUrls).reduce(function(a, u){ return a + u.length; }, 0);
console.log('Done.');
console.log('  Meditation segments wired:', totalSegs);
console.log('  Sleep story verses wired:', totalStoryV);
console.log('  Stories processed:', processed.size, '/', stories.length);
