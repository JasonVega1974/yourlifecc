// api/upload-card-photo.js
// Vercel function — upload a photo file directly from the admin
// browser to Supabase Storage (bucket: card-photos), then upsert
// the resulting public URL into admin_card_photos.
//
// Multipart/form-data POST with fields:
//   card_id   string  /^[a-z0-9_-]{2,64}$/i
//   file      the image — image/jpeg | png | webp | gif, ≤ 5 MB
//
// Env vars required:
//   SUPA_SERVICE_KEY      service-role key for the project
//
// Supabase prerequisites:
//   • A Storage bucket named `card-photos` must exist and be PUBLIC.
//   • Service role automatically bypasses bucket RLS for writes.
//
// Note: HMAC + ADMIN_PHOTO_SECRET requirement removed 2026-05-14.
// The Supabase service key on the server side is the real security
// gate; the admin photo manager is the only client that POSTs here.

const https = require('https');

const SUPA_PROJECT_REF = 'hrohgwcbfgywkpnvqxhk';
const SUPA_HOST        = SUPA_PROJECT_REF + '.supabase.co';
const BUCKET           = 'card-photos';
const TABLE            = 'admin_card_photos';
const MAX_BYTES        = 5 * 1024 * 1024;          // 5 MB hard limit
const READ_HEADROOM    = 64 * 1024;                // extra room for form fields

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
};

// Read the raw POST body as a Buffer. Caps at MAX_BYTES + headroom and
// rejects oversized payloads early to avoid eating Vercel function memory
// on hostile uploads.
function readRawBody(req){
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BYTES + READ_HEADROOM){
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

// Minimal multipart/form-data parser. Handles the field shapes the admin
// browser actually sends — no edge-case support for quoted-printable,
// nested multipart, or unusual encodings.
function parseMultipart(buffer, boundary){
  const fields = Object.create(null);
  const files  = Object.create(null);
  const boundaryBuf = Buffer.from('--' + boundary);
  let cursor = buffer.indexOf(boundaryBuf);
  if (cursor < 0) return { fields, files };
  cursor += boundaryBuf.length;
  while (cursor < buffer.length){
    // End marker `--boundary--`
    if (buffer[cursor] === 0x2D && buffer[cursor+1] === 0x2D) break;
    if (buffer[cursor] === 0x0D && buffer[cursor+1] === 0x0A) cursor += 2;
    const headerEnd = buffer.indexOf('\r\n\r\n', cursor);
    if (headerEnd < 0) break;
    const headers   = buffer.slice(cursor, headerEnd).toString('utf8');
    const partStart = headerEnd + 4;
    const nextBoundary = buffer.indexOf(boundaryBuf, partStart);
    if (nextBoundary < 0) break;
    const partEnd = nextBoundary - 2;  // strip CRLF before boundary
    const data    = buffer.slice(partStart, partEnd);
    const nameMatch     = /name="([^"]+)"/.exec(headers);
    const filenameMatch = /filename="([^"]*)"/.exec(headers);
    const ctypeMatch    = /Content-Type:\s*([^\r\n]+)/i.exec(headers);
    if (nameMatch){
      const name = nameMatch[1];
      if (filenameMatch !== null){
        files[name] = {
          filename:    filenameMatch[1] || '',
          contentType: ctypeMatch ? ctypeMatch[1].trim() : 'application/octet-stream',
          data:        data,
        };
      } else {
        fields[name] = data.toString('utf8');
      }
    }
    cursor = nextBoundary + boundaryBuf.length;
  }
  return { fields, files };
}

// Upload bytes to Supabase Storage at /storage/v1/object/<bucket>/<path>.
// x-upsert: true so re-uploading the same path replaces.
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

// Upsert the new public URL into admin_card_photos. Uses the same
// pattern as api/admin-card-photo.js (PostgREST + merge-duplicates).
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

const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.SUPA_SERVICE_KEY){
    return res.status(500).json({ error: 'Server not configured' });
  }

  const ct = String(req.headers['content-type'] || '').toLowerCase();
  const boundaryMatch = /boundary=([^;]+)/.exec(ct);
  if (!ct.startsWith('multipart/form-data') || !boundaryMatch){
    return res.status(400).json({ error: 'Expected multipart/form-data' });
  }
  const boundary = boundaryMatch[1].trim().replace(/^"|"$/g, '');

  let raw;
  try {
    raw = await readRawBody(req);
  } catch(e){
    if (e && e.code === 'PAYLOAD_TOO_LARGE') return res.status(413).json({ error: 'File exceeds 5MB limit' });
    return res.status(400).json({ error: 'Failed to read body' });
  }

  const { fields, files } = parseMultipart(raw, boundary);
  const card_id = (fields.card_id || '').trim();
  const file    = files.file;

  if (!card_id || !/^[a-z0-9_-]{2,64}$/i.test(card_id)){
    return res.status(400).json({ error: 'Bad card_id' });
  }
  if (!file || !file.data || file.data.length === 0){
    return res.status(400).json({ error: 'No file uploaded' });
  }
  if (file.data.length > MAX_BYTES){
    return res.status(413).json({ error: 'File exceeds 5MB limit' });
  }

  const mime = (file.contentType || '').toLowerCase().split(';')[0].trim();
  if (!ALLOWED_MIME.has(mime)){
    return res.status(415).json({ error: 'Unsupported file type — must be JPEG, PNG, WebP, or GIF' });
  }

  const ext        = MIME_EXT[mime] || 'bin';
  const objectPath = 'cards/' + card_id + '-' + Date.now() + '.' + ext;

  try {
    await supaUploadFile(objectPath, file.data, mime);
  } catch(e){
    console.error('[upload-card-photo storage]', e && e.message);
    return res.status(500).json({ error: 'Storage upload failed' });
  }

  const publicUrl = 'https://' + SUPA_HOST + '/storage/v1/object/public/' + BUCKET + '/' + objectPath;

  try {
    await supaUpsertRow({ card_id: card_id, photo_url: publicUrl, updated_at: new Date().toISOString() });
  } catch(e){
    console.error('[upload-card-photo upsert]', e && e.message);
    return res.status(500).json({ error: 'Saved file but failed to record override' });
  }

  return res.status(200).json({ ok: true, url: publicUrl });
};

// Disable Vercel's automatic body parser so multipart bytes stream
// through unchanged. The handler reads raw via readRawBody.
handler.config = { api: { bodyParser: false } };

module.exports = handler;
