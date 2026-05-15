// api/upload-card-photo.js
// Vercel function — upload a photo from the admin browser to Supabase
// Storage (bucket: card-photos), then upsert the public URL into
// admin_card_photos.
//
// POST /api/upload-card-photo
//   Body (JSON): { card_id, fileData, fileName, mimeType }
//     card_id   string  /^[a-z0-9_-]{2,64}$/i
//     fileData  base64-encoded file bytes (no data: URI prefix)
//     fileName  original filename (informational only)
//     mimeType  image/jpeg | png | webp | gif
//
// bodyParser is disabled — we read the raw stream and JSON.parse
// ourselves. This is more reliable than relying on req.body for
// large payloads in plain Vercel serverless functions.
//
// Env vars required:
//   SUPA_SERVICE_KEY  service-role key for the project

const https = require('https');

const SUPA_PROJECT_REF = 'hrohgwcbfgywkpnvqxhk';
const SUPA_HOST        = SUPA_PROJECT_REF + '.supabase.co';
const BUCKET           = 'card-photos';
const TABLE            = 'admin_card_photos';
const MAX_FILE_BYTES   = 5 * 1024 * 1024;   // 5 MB decoded limit
const MAX_BODY_BYTES   = 8 * 1024 * 1024;   // 8 MB raw JSON (base64 overhead ~33%)

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
};

function readRawBody(req){
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES){
        req.destroy();
        const err = new Error('Payload too large');
        err.code = 'PAYLOAD_TOO_LARGE';
        return reject(err);
      }
      chunks.push(chunk);
    });
    req.on('end',   () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function supaUploadFile(path, data, contentType){
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: SUPA_HOST,
      path:     '/storage/v1/object/' + BUCKET + '/' + path,
      method:   'POST',
      headers: {
        'apikey':         process.env.SUPA_SERVICE_KEY,
        'Authorization':  'Bearer ' + process.env.SUPA_SERVICE_KEY,
        'Content-Type':   contentType,
        'Content-Length': data.length,
        'x-upsert':       'true',
        'Cache-Control':  '3600',
      },
    };
    const req = https.request(opts, (res) => {
      let buf = '';
      res.on('data', (chunk) => { buf += chunk; });
      res.on('end',  () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(buf);
        else reject(new Error('Supabase Storage ' + res.statusCode + ': ' + buf));
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function supaUpsertRow(row){
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(row);
    const opts = {
      hostname: SUPA_HOST,
      path:     '/rest/v1/' + TABLE + '?on_conflict=card_id',
      method:   'POST',
      headers: {
        'apikey':         process.env.SUPA_SERVICE_KEY,
        'Authorization':  'Bearer ' + process.env.SUPA_SERVICE_KEY,
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Prefer':         'resolution=merge-duplicates,return=representation',
      },
    };
    const req = https.request(opts, (res) => {
      let buf = '';
      res.on('data', (chunk) => { buf += chunk; });
      res.on('end',  () => {
        if (res.statusCode >= 200 && res.statusCode < 300){
          try { resolve(buf ? JSON.parse(buf) : null); }
          catch(e){ resolve(buf); }
        } else {
          reject(new Error('Supabase REST ' + res.statusCode + ': ' + buf));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.SUPA_SERVICE_KEY){
    return res.status(500).json({ error: 'Server not configured' });
  }

  // Read and parse the JSON body from the raw stream so we are not
  // dependent on Vercel's req.body parsing or its size-limit config.
  let body;
  try {
    const raw = await readRawBody(req);
    body = JSON.parse(raw.toString('utf8'));
  } catch(e){
    if (e && e.code === 'PAYLOAD_TOO_LARGE')
      return res.status(413).json({ error: 'Request body exceeds 8 MB limit' });
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const card_id  = typeof body.card_id  === 'string' ? body.card_id.trim()  : '';
  const fileData = typeof body.fileData === 'string' ? body.fileData.trim() : '';
  const mimeType = typeof body.mimeType === 'string'
    ? body.mimeType.toLowerCase().split(';')[0].trim() : '';

  if (!card_id || !/^[a-z0-9_-]{2,64}$/i.test(card_id)){
    return res.status(400).json({ error: 'Bad card_id' });
  }
  if (!fileData){
    return res.status(400).json({ error: 'No file data' });
  }
  if (!ALLOWED_MIME.has(mimeType)){
    return res.status(415).json({ error: 'Unsupported file type — must be JPEG, PNG, WebP, or GIF' });
  }

  let fileBuffer;
  try {
    fileBuffer = Buffer.from(fileData, 'base64');
  } catch(e){
    return res.status(400).json({ error: 'Invalid base64 data' });
  }

  if (!fileBuffer.length){
    return res.status(400).json({ error: 'Empty file' });
  }
  if (fileBuffer.length > MAX_FILE_BYTES){
    return res.status(413).json({ error: 'File exceeds 5 MB limit' });
  }

  const ext        = MIME_EXT[mimeType] || 'bin';
  const objectPath = 'cards/' + card_id + '-' + Date.now() + '.' + ext;

  try {
    await supaUploadFile(objectPath, fileBuffer, mimeType);
  } catch(e){
    const detail = e && e.message ? e.message : String(e);
    console.error('[upload-card-photo storage]', detail);
    return res.status(500).json({ error: 'Storage upload failed', detail });
  }

  const publicUrl =
    'https://' + SUPA_HOST + '/storage/v1/object/public/' + BUCKET + '/' + objectPath;

  try {
    await supaUpsertRow({ card_id, photo_url: publicUrl, updated_at: new Date().toISOString() });
  } catch(e){
    const detail = e && e.message ? e.message : String(e);
    console.error('[upload-card-photo upsert]', detail);
    return res.status(500).json({ error: 'DB upsert failed', detail });
  }

  return res.status(200).json({ ok: true, url: publicUrl });
};

// Disable Vercel's body parser — we read the raw stream directly.
module.exports.config = { api: { bodyParser: false } };
