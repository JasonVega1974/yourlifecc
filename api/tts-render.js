// CommonJS — Vercel Functions handler. Keep CommonJS; switching to ESM caused
// 502s on this deploy before.
//
// On-demand TTS via OpenAI tts-1 (voice: nova).
// Caches rendered MP3s in Supabase Storage bucket 'tts-cache' to avoid
// repeated API calls for the same text (VOTD repeats annually, devotional
// repeats only if same-day cache hit).
//
// Required env vars (set in Vercel dashboard):
//   OPENAI_API_KEY    — sk-... key with TTS access
//   SUPA_SERVICE_KEY  — already present; used for storage auth
//
// Supabase setup (one-time, run in Supabase SQL editor or dashboard):
//   INSERT INTO storage.buckets (id, name, public)
//   VALUES ('tts-cache', 'tts-cache', false);
//   -- RLS: service key bypasses RLS, so no policy needed for server-side access.
'use strict';

const https = require('https');

const OPENAI_KEY  = process.env.OPENAI_API_KEY;
const SUPA_URL    = 'https://hrohgwcbfgywkpnvqxhk.supabase.co';
const SUPA_KEY    = process.env.SUPA_SERVICE_KEY;
const BUCKET      = 'tts-cache';
const VOICE       = 'nova';
const MODEL       = 'tts-1';
const MAX_CHARS   = 4096;

module.exports = async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { text, cacheKey } = req.body || {};
  if(!text || !text.trim()) return res.status(400).json({error:'text required'});
  if(!OPENAI_KEY) return res.status(503).json({error:'TTS not configured — add OPENAI_API_KEY to Vercel env'});

  const safeKey = String(cacheKey||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,80) ||
    ('tts_'+Date.now());
  const objectPath = BUCKET + '/' + safeKey + '.mp3';
  const trimmedText = text.trim().slice(0, MAX_CHARS);

  // 1. Try Supabase Storage cache
  if(SUPA_KEY){
    try {
      const cached = await supaFetch('GET', '/storage/v1/object/' + objectPath, null);
      if(cached && cached.length > 500){
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
        res.setHeader('X-TTS-Source', 'cache');
        return res.send(cached);
      }
    } catch(_){}
  }

  // 2. Generate via OpenAI TTS
  let mp3;
  try {
    mp3 = await openAiTts(trimmedText);
  } catch(e) {
    console.error('[tts-render] OpenAI error:', e.message);
    return res.status(502).json({error:'TTS generation failed'});
  }

  // 3. Cache in Supabase Storage (fire-and-forget, non-blocking)
  if(SUPA_KEY && mp3){
    supaFetch('POST', '/storage/v1/object/' + objectPath, mp3, 'audio/mpeg').catch(()=>{});
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=604800');
  res.setHeader('X-TTS-Source', 'generated');
  res.send(mp3);
};

function openAiTts(text){
  return new Promise(function(resolve, reject){
    var body = JSON.stringify({model:MODEL, voice:VOICE, input:text});
    var opts = {
      hostname:'api.openai.com',
      path:'/v1/audio/speech',
      method:'POST',
      headers:{
        'Authorization':'Bearer '+OPENAI_KEY,
        'Content-Type':'application/json',
        'Content-Length':Buffer.byteLength(body)
      }
    };
    var req = https.request(opts, function(r){
      if(r.statusCode !== 200){
        var err='';
        r.on('data', function(d){ err+=d; });
        r.on('end', function(){ reject(new Error('OpenAI '+r.statusCode+': '+err)); });
        return;
      }
      var chunks=[];
      r.on('data', function(c){ chunks.push(c); });
      r.on('end', function(){ resolve(Buffer.concat(chunks)); });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function supaFetch(method, path, body, contentType){
  return new Promise(function(resolve, reject){
    var headers = {
      'Authorization':'Bearer '+SUPA_KEY,
      'apikey':SUPA_KEY
    };
    if(body && contentType) headers['Content-Type'] = contentType;
    if(body) headers['Content-Length'] = body.length;
    var url = new URL(SUPA_URL + path);
    var opts = {
      hostname:url.hostname,
      path:url.pathname+url.search,
      method:method,
      headers:headers
    };
    var r = https.request(opts, function(res){
      var chunks=[];
      res.on('data', function(c){ chunks.push(c); });
      res.on('end', function(){
        if(res.statusCode === 200 || res.statusCode === 201){
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error('Supabase '+res.statusCode));
        }
      });
    });
    r.on('error', reject);
    if(body) r.write(body);
    r.end();
  });
}
