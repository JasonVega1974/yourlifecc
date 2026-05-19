// api/content-calendar.js — Admin Content Calendar (Phase 4A)
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// GET  — public-facing: returns today's published featured_content row.
//        No auth required (serves the Well homepage card).
//        Returns: { content: { id, title, content_type, content_body,
//                              scheduled_date, cta_label, cta_action } | null }
//
// POST — admin only (x-admin-token header).
//        Body: { title, content_type, content_body, scheduled_date,
//                is_published?, author?, cta_label?, cta_action? }
//        Upserts by scheduled_date (one entry per day).
//        Returns: { id }
//
// PATCH /api/content-calendar?id=<uuid> — toggle is_published.
//        Body: { is_published: bool }
//        Admin only.
//
// Env vars:
//   SUPA_SERVICE_KEY — Supabase service_role key

const SUPA_HOST   = 'hrohgwcbfgywkpnvqxhk.supabase.co';
const ADMIN_TOKEN = 'ylcc-admin-2729';

async function supaReq(method, path, serviceKey, body) {
  const opts = {
    method,
    headers: {
      'apikey':        serviceKey,
      'Authorization': 'Bearer ' + serviceKey,
      'Content-Type':  'application/json',
      'Prefer':        'return=representation',
    },
  };
  if(body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, opts);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch(_) { json = null; }
  return { ok: res.ok, status: res.status, json };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if(req.method === 'OPTIONS') return res.status(204).end();

  const serviceKey = process.env.SUPA_SERVICE_KEY;
  if(!serviceKey){
    console.error('content-calendar: SUPA_SERVICE_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // ── GET — today's published content ──────────────────────────
  if(req.method === 'GET'){
    const today = new Date().toISOString().slice(0, 10);
    const { ok, json } = await supaReq(
      'GET',
      `featured_content?select=id,title,content_type,content_body,scheduled_date,cta_label,cta_action&is_published=eq.true&scheduled_date=eq.${today}&limit=1`,
      serviceKey
    );
    if(!ok) return res.status(500).json({ error: 'DB error' });
    const row = (Array.isArray(json) && json[0]) || null;
    return res.status(200).json({ content: row });
  }

  // ── POST / PATCH — admin writes ───────────────────────────────
  if(req.headers['x-admin-token'] !== ADMIN_TOKEN){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if(req.method === 'POST'){
    const b = req.body || {};
    const { title, content_type, content_body, scheduled_date, is_published, author, cta_label, cta_action } = b;

    const VALID_TYPES = ['verse','devotional','challenge','announcement','study_prompt'];
    if(!title || !content_type || !content_body || !scheduled_date){
      return res.status(400).json({ error: 'title, content_type, content_body, and scheduled_date are required' });
    }
    if(!VALID_TYPES.includes(content_type)){
      return res.status(400).json({ error: 'Invalid content_type' });
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(scheduled_date)){
      return res.status(400).json({ error: 'scheduled_date must be YYYY-MM-DD' });
    }

    // Upsert by scheduled_date using onConflict
    const payload = {
      title: title.slice(0, 200),
      content_type,
      content_body: content_body.slice(0, 4000),
      scheduled_date,
      is_published: !!is_published,
      author: author ? author.slice(0, 100) : null,
      cta_label: cta_label ? cta_label.slice(0, 80) : null,
      cta_action: cta_action ? cta_action.slice(0, 200) : null,
    };

    const { ok, json: result } = await supaReq(
      'POST',
      'featured_content?on_conflict=scheduled_date',
      serviceKey,
      payload
    );
    if(!ok) return res.status(500).json({ error: 'DB write failed', detail: result });
    const row = Array.isArray(result) ? result[0] : result;
    return res.status(200).json({ id: row && row.id });
  }

  if(req.method === 'PATCH'){
    const id = (req.query && req.query.id) || '';
    if(!id || !/^[0-9a-f-]{36}$/i.test(id)){
      return res.status(400).json({ error: 'Valid id required' });
    }
    const b = req.body || {};
    if(typeof b.is_published !== 'boolean'){
      return res.status(400).json({ error: 'is_published (boolean) required' });
    }
    const { ok } = await supaReq(
      'PATCH',
      `featured_content?id=eq.${id}`,
      serviceKey,
      { is_published: b.is_published }
    );
    if(!ok) return res.status(500).json({ error: 'DB update failed' });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
