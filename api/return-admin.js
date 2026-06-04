// api/return-admin.js
// The Return — single authenticated ingress for all writes against /return.
//
// Anon clients keep reading directly from PostgREST (return_totes,
// return_supply_items, return_events). Anything that mutates state, or
// reads admin/audit tables, comes through this function.
//
// Endpoints (all POST /api/return-admin with body { op, ... }):
//
//   auth.login        { pin }                            -> { sessionToken, admin }
//   auth.verify       { sessionToken }                   -> { admin }
//
//   admin.list        { sessionToken }                   owner-only
//   admin.issue       { sessionToken, name, role }       owner-only  -> { pin, admin }
//   admin.changePin   { sessionToken, adminId, newPin }  owner OR self
//   admin.revoke      { sessionToken, adminId }          owner-only (not self)
//
//   events.create     { sessionToken, label }            owner-only
//   events.setActive  { sessionToken, eventId }          owner-only
//
//   inventory.seedTotes      { sessionToken }
//   inventory.saveToteMeta   { sessionToken, toteId, label, category, location }
//   inventory.addItem        { sessionToken, toteId, ...fields }
//   inventory.updateItem     { sessionToken, itemId, field, value }
//   inventory.deleteItem     { sessionToken, itemId }
//   inventory.importItems    { sessionToken, rows, replaceTotes }
//
//   audit.record      { sessionToken, itemId, count, notes }
//
// Required Vercel environment variables:
//   SUPA_SERVICE_KEY       Supabase service-role key (already set for /api/admin-card-photo)
//   RETURN_OWNER_PIN       6-digit bootstrap PIN. When no active owner exists,
//                          a successful login with this PIN seeds an Owner row.
//   RETURN_SESSION_SECRET  Random 32+ char string. HMAC key for session tokens.

const https = require('https');
const crypto = require('crypto');

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;   // 8 hours
const LOCKOUT_THRESHOLD = 5;                  // failed attempts before lockout
const LOCKOUT_WINDOW_MS = 5 * 60 * 1000;      // lockout duration

// ─────────────────────────────────────────────────────────────────────
// Crypto — scrypt for PIN hashing, HMAC-SHA256 for session tokens
// ─────────────────────────────────────────────────────────────────────

function hashPin(pin) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(pin), salt, 64);
  return salt.toString('hex') + '$' + hash.toString('hex');
}

function verifyPin(pin, stored) {
  if (typeof stored !== 'string') return false;
  const [saltHex, hashHex] = stored.split('$');
  if (!saltHex || !hashHex) return false;
  let actual;
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    actual = crypto.scryptSync(String(pin), salt, expected.length);
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch (e) {
    return false;
  }
}

function b64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  s = String(s).replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

function signToken(adminId, role) {
  const payload = { adminId, role, exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = crypto.createHmac('sha256', process.env.RETURN_SESSION_SECRET)
    .update(payloadB64).digest();
  return payloadB64 + '.' + b64url(sig);
}

function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payloadB64, sigB64] = token.split('.');
  if (!payloadB64 || !sigB64) return null;
  const expected = crypto.createHmac('sha256', process.env.RETURN_SESSION_SECRET)
    .update(payloadB64).digest();
  let actual;
  try { actual = b64urlDecode(sigB64); } catch (e) { return null; }
  if (actual.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(actual, expected)) return null;
  let payload;
  try { payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8')); }
  catch (e) { return null; }
  if (!payload || !payload.adminId || !payload.role || !payload.exp) return null;
  if (Date.now() > payload.exp) return null;
  return payload;
}

// ─────────────────────────────────────────────────────────────────────
// Supabase REST (matches the existing /api/admin-card-photo style)
// ─────────────────────────────────────────────────────────────────────

function supa(method, path, body, prefer) {
  return new Promise((resolve, reject) => {
    const data = body !== undefined ? JSON.stringify(body) : null;
    const opts = {
      hostname: SUPA_HOST,
      path: '/rest/v1/' + path,
      method: method,
      headers: {
        'apikey': process.env.SUPA_SERVICE_KEY,
        'Authorization': 'Bearer ' + process.env.SUPA_SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': prefer || 'return=representation',
      },
    };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(opts, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(buf ? JSON.parse(buf) : null); }
          catch (e) { resolve(buf); }
        } else {
          reject(new Error('Supabase ' + res.statusCode + ': ' + buf));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const supaSelect = (table, qs) => supa('GET',    table + (qs ? '?' + qs : ''));
const supaInsert = (table, body) => supa('POST',   table, body);
const supaUpdate = (table, qs, body) => supa('PATCH', table + '?' + qs, body);
const supaDelete = (table, qs) => supa('DELETE', table + '?' + qs);

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function ok(data) { return { status: 200, body: Object.assign({ ok: true }, data || {}) }; }
function err(status, message) { return { status, body: { ok: false, error: message } }; }
function nInt(v) { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; }

function clientIP(req) {
  const xf = req.headers['x-forwarded-for'];
  if (xf) return String(xf).split(',')[0].trim();
  return req.headers['x-real-ip']
    || (req.socket && req.socket.remoteAddress)
    || 'unknown';
}

async function checkLockout(ip) {
  const rows = await supaSelect('return_pin_attempts',
    'ip=eq.' + encodeURIComponent(ip) + '&select=locked_until');
  if (!rows || !rows.length) return null;
  const lu = rows[0].locked_until;
  if (lu && new Date(lu).getTime() > Date.now()) return lu;
  return null;
}

async function bumpFail(ip) {
  const rows = await supaSelect('return_pin_attempts',
    'ip=eq.' + encodeURIComponent(ip) + '&select=failed_count');
  const nowIso = new Date().toISOString();
  if (!rows || !rows.length) {
    await supaInsert('return_pin_attempts',
      { ip, failed_count: 1, last_attempt_at: nowIso });
    return 1;
  }
  const newCount = (rows[0].failed_count || 0) + 1;
  const patch = { failed_count: newCount, last_attempt_at: nowIso };
  if (newCount >= LOCKOUT_THRESHOLD) {
    patch.locked_until = new Date(Date.now() + LOCKOUT_WINDOW_MS).toISOString();
  }
  await supaUpdate('return_pin_attempts',
    'ip=eq.' + encodeURIComponent(ip), patch);
  return newCount;
}

async function resetFail(ip) {
  await supaUpdate('return_pin_attempts',
    'ip=eq.' + encodeURIComponent(ip),
    { failed_count: 0, locked_until: null, last_attempt_at: new Date().toISOString() });
}

// requireSession returns { admin } or { err: <errResponse> }
async function requireSession(body, requireOwner) {
  const session = verifyToken(body.sessionToken);
  if (!session) return { err: err(401, 'Session invalid') };
  const rows = await supaSelect('return_admins',
    'id=eq.' + session.adminId + '&select=id,name,role,active');
  const a = rows && rows[0];
  if (!a || !a.active) return { err: err(401, 'Account inactive') };
  if (requireOwner && a.role !== 'owner') return { err: err(403, 'Owner only') };
  return { admin: a };
}

// ─────────────────────────────────────────────────────────────────────
// Auth ops
// ─────────────────────────────────────────────────────────────────────

async function opAuthLogin(body, req) {
  const pin = String(body.pin || '').trim();
  if (!/^\d{6,8}$/.test(pin)) return err(400, 'PIN must be 6-8 digits');

  const ip = clientIP(req);
  const locked = await checkLockout(ip);
  if (locked) return err(429, 'Too many attempts. Try again after ' + locked);

  // Bootstrap / recovery path: if no active owner, env PIN seeds an owner.
  const admins = await supaSelect('return_admins',
    'active=eq.true&select=id,name,pin_hash,role');
  const activeOwners = (admins || []).filter(a => a.role === 'owner');

  if (activeOwners.length === 0) {
    const bootstrap = process.env.RETURN_OWNER_PIN || '';
    if (!bootstrap) return err(503, 'Bootstrap PIN not configured');
    if (pin !== bootstrap) {
      await bumpFail(ip);
      return err(401, 'Invalid PIN');
    }
    const inserted = await supaInsert('return_admins', {
      name: 'Owner',
      pin_hash: hashPin(pin),
      role: 'owner',
      active: true,
    });
    const o = Array.isArray(inserted) ? inserted[0] : inserted;
    await resetFail(ip);
    return ok({
      sessionToken: signToken(o.id, 'owner'),
      admin: { id: o.id, name: o.name, role: o.role },
      bootstrapped: true,
    });
  }

  // Normal verify — scan all active admins
  for (const a of (admins || [])) {
    if (verifyPin(pin, a.pin_hash)) {
      await resetFail(ip);
      return ok({
        sessionToken: signToken(a.id, a.role),
        admin: { id: a.id, name: a.name, role: a.role },
      });
    }
  }
  await bumpFail(ip);
  return err(401, 'Invalid PIN');
}

async function opAuthVerify(body) {
  const session = verifyToken(body.sessionToken);
  if (!session) return err(401, 'Session invalid');
  const rows = await supaSelect('return_admins',
    'id=eq.' + session.adminId + '&select=id,name,role,active');
  const a = rows && rows[0];
  if (!a || !a.active) return err(401, 'Account inactive');
  return ok({ admin: { id: a.id, name: a.name, role: a.role } });
}

// ─────────────────────────────────────────────────────────────────────
// Admin ops (PIN management)
// ─────────────────────────────────────────────────────────────────────

async function opAdminList(body) {
  const s = await requireSession(body, true); if (s.err) return s.err;
  const rows = await supaSelect('return_admins',
    'select=id,name,role,active,created_at,revoked_at&order=created_at.asc');
  return ok({ admins: rows || [] });
}

async function opAdminIssue(body) {
  const s = await requireSession(body, true); if (s.err) return s.err;
  const name = String(body.name || '').trim();
  const role = body.role === 'owner' ? 'owner' : 'operator';
  if (!name) return err(400, 'Name required');
  if (name.length > 80) return err(400, 'Name too long');

  // Random 6-digit PIN
  const pin = String(crypto.randomInt(0, 1000000)).padStart(6, '0');

  const row = await supaInsert('return_admins', {
    name: name,
    pin_hash: hashPin(pin),
    role: role,
    active: true,
    created_by_admin_id: s.admin.id,
  });
  const created = Array.isArray(row) ? row[0] : row;
  return ok({
    pin: pin,
    admin: { id: created.id, name: created.name, role: created.role, active: true },
  });
}

async function opAdminChangePin(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const adminId = String(body.adminId || '');
  const newPin = String(body.newPin || '').trim();
  if (!/^\d{6,8}$/.test(newPin)) return err(400, 'PIN must be 6-8 digits');
  // Operators can only change their own PIN
  if (s.admin.role !== 'owner' && s.admin.id !== adminId) {
    return err(403, 'Cannot change another user\'s PIN');
  }
  const target = await supaSelect('return_admins',
    'id=eq.' + adminId + '&select=id');
  if (!target || !target.length) return err(404, 'Admin not found');
  await supaUpdate('return_admins',
    'id=eq.' + adminId,
    { pin_hash: hashPin(newPin) });
  return ok({});
}

async function opAdminRevoke(body) {
  const s = await requireSession(body, true); if (s.err) return s.err;
  const adminId = String(body.adminId || '');
  if (!adminId) return err(400, 'adminId required');
  if (adminId === s.admin.id) return err(400, 'Cannot revoke yourself');
  await supaUpdate('return_admins',
    'id=eq.' + adminId,
    { active: false, revoked_at: new Date().toISOString() });
  return ok({});
}

// ─────────────────────────────────────────────────────────────────────
// Event ops
// ─────────────────────────────────────────────────────────────────────

async function opEventsCreate(body) {
  const s = await requireSession(body, true); if (s.err) return s.err;
  const label = String(body.label || '').trim();
  if (!label) return err(400, 'Label required');
  if (label.length > 80) return err(400, 'Label too long');
  try {
    const row = await supaInsert('return_events', { label: label, is_active: false });
    return ok({ event: Array.isArray(row) ? row[0] : row });
  } catch (e) {
    if (/duplicate/i.test(e.message || '')) return err(409, 'Event label already exists');
    throw e;
  }
}

async function opEventsSetActive(body) {
  const s = await requireSession(body, true); if (s.err) return s.err;
  const eventId = String(body.eventId || '');
  if (!eventId) return err(400, 'eventId required');
  // Two-step swap. The partial unique index permits a 0-active intermediate state.
  await supaUpdate('return_events', 'is_active=eq.true', { is_active: false });
  await supaUpdate('return_events', 'id=eq.' + eventId, { is_active: true });
  return ok({});
}

// ─────────────────────────────────────────────────────────────────────
// Inventory ops (any active PIN)
// ─────────────────────────────────────────────────────────────────────

async function opInvSeed(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const existing = await supaSelect('return_totes', 'select=id');
  const have = new Set((existing || []).map(t => t.id));
  const rows = [];
  for (let i = 1; i <= 25; i++) if (!have.has(i)) rows.push({ id: i, label: '' });
  if (!rows.length) return ok({ inserted: 0 });
  await supaInsert('return_totes', rows);
  return ok({ inserted: rows.length });
}

async function opInvSaveTote(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const id = parseInt(body.toteId, 10);
  if (!id || id < 1 || id > 999) return err(400, 'Bad toteId');
  const patch = {
    label: String(body.label || '').slice(0, 200),
    category: String(body.category || '').slice(0, 80),
    location: String(body.location || '').slice(0, 200),
  };
  await supaUpdate('return_totes', 'id=eq.' + id, patch);
  return ok({});
}

async function opInvAddItem(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const toteId = parseInt(body.toteId, 10);
  if (!toteId) return err(400, 'Bad toteId');
  const row = {
    tote_id: toteId,
    item_name: String(body.item_name || 'New item').slice(0, 200),
    item_number: String(body.item_number || '').slice(0, 80),
    category: String(body.category || '').slice(0, 80),
    quantity_target: nInt(body.quantity_target),
    on_hand: nInt(body.on_hand),
    reorder_threshold: nInt(body.reorder_threshold),
    reorder_qty: nInt(body.reorder_qty),
    unit: String(body.unit || 'ea').slice(0, 40),
    notes: String(body.notes || '').slice(0, 1000),
  };
  const inserted = await supaInsert('return_supply_items', row);
  return ok({ item: Array.isArray(inserted) ? inserted[0] : inserted });
}

async function opInvUpdateItem(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const itemId = String(body.itemId || '');
  const field = String(body.field || '');
  const numericFields = ['quantity_target','on_hand','reorder_threshold','reorder_qty'];
  const textFields = ['item_name','item_number','category','unit','notes'];
  if (!numericFields.includes(field) && !textFields.includes(field)) {
    return err(400, 'Bad field');
  }
  const value = numericFields.includes(field)
    ? nInt(body.value)
    : String(body.value || '').slice(0, 1000);
  await supaUpdate('return_supply_items',
    'id=eq.' + itemId,
    { [field]: value, updated_at: new Date().toISOString() });
  return ok({});
}

async function opInvDeleteItem(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const itemId = String(body.itemId || '');
  if (!itemId) return err(400, 'itemId required');
  await supaDelete('return_supply_items', 'id=eq.' + itemId);
  return ok({});
}

async function opInvImportItems(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (!rows.length) return err(400, 'No rows');
  const totes = [...new Set(rows.map(r => parseInt(r.tote_id, 10)).filter(Boolean))];
  // Self-heal: insert any missing totes
  const existing = await supaSelect('return_totes', 'select=id');
  const have = new Set((existing || []).map(t => t.id));
  const missing = totes.filter(id => !have.has(id));
  if (missing.length) {
    await supaInsert('return_totes', missing.map(id => ({ id, label: '' })));
  }
  if (body.replaceTotes) {
    await supaDelete('return_supply_items', 'tote_id=in.(' + totes.join(',') + ')');
  }
  const sanitized = rows.map(r => ({
    tote_id: parseInt(r.tote_id, 10),
    item_name: String(r.item_name || '').slice(0, 200),
    item_number: String(r.item_number || '').slice(0, 80),
    category: String(r.category || '').slice(0, 80),
    quantity_target: nInt(r.quantity_target),
    on_hand: nInt(r.on_hand),
    reorder_threshold: nInt(r.reorder_threshold),
    reorder_qty: nInt(r.reorder_qty),
    unit: String(r.unit || 'ea').slice(0, 40),
    notes: String(r.notes || '').slice(0, 1000),
  })).filter(r => r.tote_id && r.item_name);
  for (let i = 0; i < sanitized.length; i += 200) {
    await supaInsert('return_supply_items', sanitized.slice(i, i + 200));
  }
  return ok({ inserted: sanitized.length });
}

// ─────────────────────────────────────────────────────────────────────
// Audit ops
// ─────────────────────────────────────────────────────────────────────

async function opAuditRecord(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const itemId = String(body.itemId || '');
  const count = nInt(body.count);
  const notes = String(body.notes || '').slice(0, 500);
  if (!itemId) return err(400, 'itemId required');

  const events = await supaSelect('return_events', 'is_active=eq.true&select=id');
  if (!events || !events.length) return err(409, 'No active event');
  const eventId = events[0].id;

  const items = await supaSelect('return_supply_items',
    'id=eq.' + itemId + '&select=on_hand');
  if (!items || !items.length) return err(404, 'Item not found');
  const prev = items[0].on_hand;

  await supaInsert('return_audits', {
    item_id: itemId,
    event_id: eventId,
    on_hand_count: count,
    prev_count: prev,
    counted_by_admin_id: s.admin.id,
    notes: notes,
  });
  await supaUpdate('return_supply_items',
    'id=eq.' + itemId,
    { on_hand: count, updated_at: new Date().toISOString() });

  return ok({ prev_count: prev, on_hand_count: count });
}

// ─────────────────────────────────────────────────────────────────────
// Master list + audit history (operator+)
// ─────────────────────────────────────────────────────────────────────

async function opMasterList(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;

  const ev = await supaSelect('return_events', 'is_active=eq.true&select=id');
  const eventId = (ev && ev[0] && ev[0].id) || null;

  const items = await supaSelect('return_supply_items',
    'select=id,item_name,item_number,tote_id,on_hand,category,' +
    'return_totes(label,location)' +
    '&order=tote_id.asc,item_name.asc');

  let audits = [];
  if (eventId) {
    audits = await supaSelect('return_audits',
      'event_id=eq.' + eventId +
      '&select=item_id,on_hand_count,counted_at,return_admins(name)' +
      '&order=counted_at.desc');
  }

  const lastByItem = {};
  for (const a of (audits || [])) {
    if (!lastByItem[a.item_id]) lastByItem[a.item_id] = a;
  }

  const rows = (items || []).map(i => {
    const t = i.return_totes || {};
    const a = lastByItem[i.id] || null;
    return {
      id: i.id,
      item_name: i.item_name,
      item_number: i.item_number || '',
      tote_id: i.tote_id,
      tote_label: t.label || '',
      tote_location: t.location || '',
      on_hand: i.on_hand,
      category: i.category || '',
      last_audit_count: a ? a.on_hand_count : null,
      last_counted_by: a && a.return_admins ? a.return_admins.name : null,
      last_counted_at: a ? a.counted_at : null,
    };
  });
  return ok({ items: rows, eventId: eventId });
}

async function opAuditListForItem(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const itemId = String(body.itemId || '');
  if (!itemId) return err(400, 'itemId required');

  const rows = await supaSelect('return_audits',
    'item_id=eq.' + itemId +
    '&select=id,on_hand_count,prev_count,counted_at,notes,' +
    'return_admins(name),return_events(label)' +
    '&order=counted_at.desc');

  const out = (rows || []).map(a => ({
    id: a.id,
    on_hand_count: a.on_hand_count,
    prev_count: a.prev_count,
    counted_at: a.counted_at,
    notes: a.notes || '',
    counted_by_name: a.return_admins ? a.return_admins.name : '—',
    event_label: a.return_events ? a.return_events.label : '—',
  }));
  return ok({ audits: out });
}

// ─────────────────────────────────────────────────────────────────────
// Events list (anon can read return_events directly, but this lets the
// admin tab fetch the full list including inactive events through one
// authenticated call alongside admin.list)
// ─────────────────────────────────────────────────────────────────────

async function opEventsList(body) {
  const s = await requireSession(body, false); if (s.err) return s.err;
  const rows = await supaSelect('return_events',
    'select=id,label,is_active,created_at&order=created_at.desc');
  return ok({ events: rows || [] });
}

// ─────────────────────────────────────────────────────────────────────
// Dispatch
// ─────────────────────────────────────────────────────────────────────

const OPS = {
  'auth.login':            opAuthLogin,
  'auth.verify':           opAuthVerify,
  'admin.list':            opAdminList,
  'admin.issue':           opAdminIssue,
  'admin.changePin':       opAdminChangePin,
  'admin.revoke':          opAdminRevoke,
  'events.list':           opEventsList,
  'events.create':         opEventsCreate,
  'events.setActive':      opEventsSetActive,
  'inventory.seedTotes':   opInvSeed,
  'inventory.saveToteMeta':opInvSaveTote,
  'inventory.addItem':     opInvAddItem,
  'inventory.updateItem':  opInvUpdateItem,
  'inventory.deleteItem':  opInvDeleteItem,
  'inventory.importItems': opInvImportItems,
  'audit.record':          opAuditRecord,
  'master.list':           opMasterList,
  'audit.listForItem':     opAuditListForItem,
};

module.exports = async (req, res) => {
  // CORS — sessionToken lives in the body, no cookies, so * is fine.
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  if (!process.env.SUPA_SERVICE_KEY || !process.env.RETURN_SESSION_SECRET) {
    return res.status(500).json({ ok: false, error: 'Server not configured' });
  }

  const body = req.body || {};
  const op = String(body.op || '');
  const handler = OPS[op];
  if (!handler) return res.status(400).json({ ok: false, error: 'Unknown op' });

  try {
    const result = await handler(body, req);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(result.status).json(result.body);
  } catch (e) {
    console.error('[return-admin ' + op + ']', e && e.message);
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
};
