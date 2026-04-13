/* =============================================================
   resume.js — Resume Builder, Job Tracker tab switching,
               save/load named resumes, live preview & templates
============================================================= */

// ── CURRENT TEMPLATE ─────────────────────────────────────────
let _resumeTemplate = 'modern';

// ── TAB SWITCHING ─────────────────────────────────────────────
function resumeTab(tab, btn) {
  document.querySelectorAll('[id^="rPanel-"]').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tabs .tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('rPanel-' + tab);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
  if (tab === 'tracker') renderJobTracker();
}

// ── TEMPLATE SELECTOR ─────────────────────────────────────────
function setTemplate(name, btn) {
  _resumeTemplate = name;
  document.querySelectorAll('.res-tmpl-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (!D.resume) D.resume = {};
  D.resume.template = name;
  save();
  livePreview();
}

// ── EXPERIENCE ENTRIES ────────────────────────────────────────
function addExpEntry(data) {
  const list = document.getElementById('expList');
  if (!list) return;
  const id = 'exp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const d = data || {};
  const row = document.createElement('div');
  row.className = 'res-entry';
  row.dataset.id = id;
  row.style.cssText = 'background:rgba(255,255,255,.04);border-radius:10px;padding:.7rem;margin-bottom:.5rem;border:1px solid rgba(255,255,255,.08);';
  row.innerHTML = `
    <div class="g2" style="gap:.4rem;margin-bottom:.38rem;">
      <input class="re-title" placeholder="Job Title" value="${escHtml(d.title||'')}" oninput="livePreview()" style="font-size:.8rem;">
      <input class="re-company" placeholder="Company / Org" value="${escHtml(d.company||'')}" oninput="livePreview()" style="font-size:.8rem;">
    </div>
    <div class="g2" style="gap:.4rem;margin-bottom:.38rem;">
      <input class="re-dates" placeholder="Dates (e.g. Jun 2022 – Present)" value="${escHtml(d.dates||'')}" oninput="livePreview()" style="font-size:.8rem;">
      <input class="re-location" placeholder="Location (optional)" value="${escHtml(d.location||'')}" oninput="livePreview()" style="font-size:.8rem;">
    </div>
    <textarea class="re-bullets" rows="3" placeholder="• Led a team of 5…&#10;• Increased revenue by 20%…&#10;• Built X using Y…" oninput="livePreview()" style="font-size:.78rem;min-height:60px;">${escHtml(d.bullets||'')}</textarea>
    <div style="text-align:right;margin-top:.28rem;">
      <button onclick="removeEntry(this)" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:.8rem;">✕ Remove</button>
    </div>`;
  list.appendChild(row);
  if (!_resumeRestoring) livePreview();
}

// ── EDUCATION ENTRIES ─────────────────────────────────────────
function addEduEntry(data) {
  const list = document.getElementById('eduList');
  if (!list) return;
  const id = 'edu_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const d = data || {};
  const row = document.createElement('div');
  row.className = 'res-entry';
  row.dataset.id = id;
  row.style.cssText = 'background:rgba(255,255,255,.04);border-radius:10px;padding:.7rem;margin-bottom:.5rem;border:1px solid rgba(255,255,255,.08);';
  row.innerHTML = `
    <div class="g2" style="gap:.4rem;margin-bottom:.38rem;">
      <input class="re-school" placeholder="School / Institution" value="${escHtml(d.school||'')}" oninput="livePreview()" style="font-size:.8rem;">
      <input class="re-degree" placeholder="Degree / Program" value="${escHtml(d.degree||'')}" oninput="livePreview()" style="font-size:.8rem;">
    </div>
    <div class="g2" style="gap:.4rem;">
      <input class="re-dates" placeholder="Dates (e.g. 2020 – 2024)" value="${escHtml(d.dates||'')}" oninput="livePreview()" style="font-size:.8rem;">
      <input class="re-gpa" placeholder="GPA / Honors (optional)" value="${escHtml(d.gpa||'')}" oninput="livePreview()" style="font-size:.8rem;">
    </div>
    <div style="text-align:right;margin-top:.28rem;">
      <button onclick="removeEntry(this)" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:.8rem;">✕ Remove</button>
    </div>`;
  list.appendChild(row);
  if (!_resumeRestoring) livePreview();
}

function removeEntry(btn) {
  const row = btn.closest('.res-entry');
  if (row) row.remove();
  livePreview();
  save();
}

// ── COLLECT ENTRIES (called by sync.js save()) ────────────────
function collectEntries(type) {
  // During initResume restore, return already-saved data to prevent half-built lists from overwriting good data
  if (_resumeRestoring) return (D.resume && D.resume[type === 'exp' ? 'experience' : 'education']) || [];
  const listId = type === 'exp' ? 'expList' : 'eduList';
  const list = document.getElementById(listId);
  if (!list) return [];
  const rows = list.querySelectorAll('.res-entry');
  if (type === 'exp') {
    return Array.from(rows).map(r => ({
      title:   (r.querySelector('.re-title')   || {}).value || '',
      company: (r.querySelector('.re-company') || {}).value || '',
      dates:   (r.querySelector('.re-dates')   || {}).value || '',
      location:(r.querySelector('.re-location')|| {}).value || '',
      bullets: (r.querySelector('.re-bullets') || {}).value || ''
    })).filter(e => e.title || e.company);
  } else {
    return Array.from(rows).map(r => ({
      school: (r.querySelector('.re-school') || {}).value || '',
      degree: (r.querySelector('.re-degree') || {}).value || '',
      dates:  (r.querySelector('.re-dates')  || {}).value || '',
      gpa:    (r.querySelector('.re-gpa')    || {}).value || ''
    })).filter(e => e.school || e.degree);
  }
}

// ── INIT — populate fields from D.resume on section open ──────
let _resumeRestoring = false; // guard: suppress livePreview mid-restore

function initResume() {
  if (_resumeRestoring) return;
  _resumeRestoring = true;

  const r = D.resume || {};

  // Restore template
  if (r.template) {
    _resumeTemplate = r.template;
    document.querySelectorAll('.res-tmpl-btn').forEach(b => b.classList.remove('active'));
    const tb = document.getElementById('tmpl-' + r.template);
    if (tb) tb.classList.add('active');
  }

  // Restore flat fields
  const map = {
    rName: 'name', rTitle: 'title', rEmail: 'email', rPhone: 'phone',
    rLocation: 'location', rLinkedin: 'linkedin', rWebsite: 'website',
    rSummary: 'summary', rSkills: 'skills', rCerts: 'certs', rLangs: 'langs'
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && r[key] !== undefined) el.value = r[key];
  });

  // Restore experience entries — always clear first to prevent duplicates on re-open
  const expList = document.getElementById('expList');
  if (expList) {
    expList.innerHTML = '';
    (r.experience || []).forEach(e => addExpEntry(e));
  }

  // Restore education entries — always clear first to prevent duplicates on re-open
  const eduList = document.getElementById('eduList');
  if (eduList) {
    eduList.innerHTML = '';
    (r.education || []).forEach(e => addEduEntry(e));
  }

  // Populate saved resume dropdown
  _populateResumeSelect();

  _resumeRestoring = false;

  // Single preview render after full restore — not per-entry
  livePreview();
}

// ── NAMED RESUME SAVE / LOAD / DELETE ─────────────────────────
function _populateResumeSelect() {
  const sel = document.getElementById('resumeSelect');
  if (!sel) return;
  const saved = D.savedResumes || {};
  const names = Object.keys(saved);
  sel.innerHTML = '<option value="">— New / Unsaved —</option>'
    + names.map(n => `<option value="${escHtml(n)}">${escHtml(n)}</option>`).join('');
}

function saveNamedResume() {
  const inp = document.getElementById('resumeNameInput');
  const name = (inp ? inp.value : '').trim();
  if (!name) { showToast('Enter a resume name first'); return; }

  // Snapshot current D.resume into savedResumes
  if (!D.savedResumes) D.savedResumes = {};
  D.savedResumes[name] = JSON.parse(JSON.stringify(D.resume || {}));
  if (inp) inp.value = '';
  save();
  _populateResumeSelect();
  showToast('💾 Resume "' + name + '" saved!');
}

function loadSavedResume(name) {
  if (!name) return;
  const saved = (D.savedResumes || {})[name];
  if (!saved) return;
  D.resume = JSON.parse(JSON.stringify(saved));
  initResume();
  showToast('📄 Loaded: ' + name);
}

function deleteResume() {
  const sel = document.getElementById('resumeSelect');
  const name = sel ? sel.value : '';
  if (!name) { showToast('Select a saved resume to delete'); return; }
  if (!confirm('Delete resume "' + name + '"?')) return;
  if (D.savedResumes) delete D.savedResumes[name];
  save();
  _populateResumeSelect();
  showToast('🗑 Deleted: ' + name);
}

function printResume() {
  const preview = document.getElementById('resumePreview');
  if (!preview) return;
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Inter',Arial,sans-serif;background:#fff;color:#111;}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
    </style></head><body>${preview.innerHTML}</body></html>`);
  win.document.close();
  setTimeout(() => { win.print(); }, 400);
}

// ── LIVE PREVIEW ──────────────────────────────────────────────
function livePreview() {
  const el = document.getElementById('resumePreview');
  if (!el) return;

  const v = id => { const e = document.getElementById(id); return e ? (e.value || '').trim() : ''; };

  const name     = v('rName');
  const title    = v('rTitle');
  const email    = v('rEmail');
  const phone    = v('rPhone');
  const location = v('rLocation');
  const linkedin = v('rLinkedin');
  const website  = v('rWebsite');
  const summary  = v('rSummary');
  const skills   = v('rSkills');
  const certs    = v('rCerts');
  const langs    = v('rLangs');

  const experience = collectEntries('exp');
  const education  = collectEntries('edu');

  const tmpl = _resumeTemplate || 'modern';

  let html = '';

  if (tmpl === 'modern') {
    html = _tmplModern({ name, title, email, phone, location, linkedin, website, summary, skills, certs, langs, experience, education });
  } else if (tmpl === 'classic') {
    html = _tmplClassic({ name, title, email, phone, location, linkedin, website, summary, skills, certs, langs, experience, education });
  } else if (tmpl === 'minimal') {
    html = _tmplMinimal({ name, title, email, phone, location, linkedin, website, summary, skills, certs, langs, experience, education });
  } else if (tmpl === 'bold') {
    html = _tmplBold({ name, title, email, phone, location, linkedin, website, summary, skills, certs, langs, experience, education });
  }

  el.innerHTML = html;
}

// ── HELPER ────────────────────────────────────────────────────
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _contactLine(email, phone, location, linkedin, website) {
  return [email, phone, location, linkedin, website].filter(Boolean).join(' · ');
}

function _renderExp(experience, accentColor) {
  if (!experience.length) return '';
  return experience.map(e => `
    <div style="margin-bottom:.75rem;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <strong style="font-size:.92rem;">${escHtml(e.title)}</strong>
        <span style="font-size:.75rem;color:#666;">${escHtml(e.dates)}</span>
      </div>
      <div style="font-size:.8rem;color:${accentColor};margin-bottom:.18rem;">${escHtml(e.company)}${e.location?' · '+escHtml(e.location):''}</div>
      ${e.bullets ? '<div style="font-size:.78rem;color:#333;white-space:pre-line;margin-top:.18rem;">' + escHtml(e.bullets) + '</div>' : ''}
    </div>`).join('');
}

function _renderEdu(education, accentColor) {
  if (!education.length) return '';
  return education.map(e => `
    <div style="margin-bottom:.6rem;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <strong style="font-size:.88rem;">${escHtml(e.school)}</strong>
        <span style="font-size:.75rem;color:#666;">${escHtml(e.dates)}</span>
      </div>
      <div style="font-size:.78rem;color:${accentColor};">${escHtml(e.degree)}${e.gpa?' · '+escHtml(e.gpa):''}</div>
    </div>`).join('');
}

function _sectionHead(label, color, borderColor) {
  return `<div style="font-size:.65rem;font-weight:900;letter-spacing:2px;color:${color};text-transform:uppercase;border-bottom:2px solid ${borderColor};padding-bottom:.2rem;margin:1rem 0 .55rem;">${label}</div>`;
}

// ── TEMPLATE: MODERN (two-column: navy sidebar + white main) ──
function _tmplModern(d) {
  const sideHead = label => `<div style="font-size:.58rem;font-weight:900;letter-spacing:2.5px;text-transform:uppercase;color:#7dd3fc;border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:.2rem;margin:1rem 0 .45rem;">${label}</div>`;
  const mainHead = label => `<div style="font-size:.6rem;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:.18rem;margin:1rem 0 .5rem;">${label}</div>`;

  const contactItems = [
    d.email    ? `<div style="margin-bottom:.22rem;">✉ ${escHtml(d.email)}</div>` : '',
    d.phone    ? `<div style="margin-bottom:.22rem;">📞 ${escHtml(d.phone)}</div>` : '',
    d.location ? `<div style="margin-bottom:.22rem;">📍 ${escHtml(d.location)}</div>` : '',
    d.linkedin ? `<div style="margin-bottom:.22rem;">in ${escHtml(d.linkedin)}</div>` : '',
    d.website  ? `<div style="margin-bottom:.22rem;">🌐 ${escHtml(d.website)}</div>` : '',
  ].join('');

  const skillsList = d.skills ? d.skills.split(',').map(s => s.trim()).filter(Boolean)
    .map(s => `<div style="background:rgba(255,255,255,.12);border-radius:4px;padding:.18rem .45rem;font-size:.72rem;margin-bottom:.22rem;display:inline-block;margin-right:.2rem;">${escHtml(s)}</div>`).join('') : '';

  const sidebar = `
    <div style="background:#1e3a5f;color:#e0f0ff;padding:1.4rem 1rem;min-height:100%;box-sizing:border-box;">
      <!-- Name & Title -->
      <div style="margin-bottom:.3rem;">
        <div style="font-size:1.25rem;font-weight:900;line-height:1.2;color:#fff;">${d.name ? escHtml(d.name) : 'Your Name'}</div>
        ${d.title ? `<div style="font-size:.75rem;color:#7dd3fc;font-weight:600;margin-top:.25rem;text-transform:uppercase;letter-spacing:.5px;">${escHtml(d.title)}</div>` : ''}
      </div>

      ${contactItems ? sideHead('Contact') + `<div style="font-size:.72rem;color:#bfdbfe;">${contactItems}</div>` : ''}

      ${d.skills ? sideHead('Skills') + `<div>${skillsList}</div>` : ''}

      ${d.certs ? sideHead('Certifications') + `<div style="font-size:.72rem;color:#bfdbfe;white-space:pre-line;">${escHtml(d.certs)}</div>` : ''}

      ${d.langs ? sideHead('Languages') + `<div style="font-size:.72rem;color:#bfdbfe;white-space:pre-line;">${escHtml(d.langs)}</div>` : ''}
    </div>`;

  const main = `
    <div style="background:#fff;color:#111;padding:1.4rem 1.2rem;min-height:100%;box-sizing:border-box;">
      ${d.summary ? mainHead('Profile') + `<div style="font-size:.78rem;color:#333;line-height:1.55;">${escHtml(d.summary)}</div>` : ''}
      ${d.experience.length ? mainHead('Experience') + _renderExp(d.experience, '#1e3a5f') : ''}
      ${d.education.length  ? mainHead('Education')  + _renderEdu(d.education,  '#1e3a5f') : ''}
    </div>`;

  return `<div style="display:grid;grid-template-columns:38% 62%;font-family:'Inter',Arial,sans-serif;font-size:.82rem;line-height:1.5;min-height:500px;">
    ${sidebar}${main}
  </div>`;
}

// ── TEMPLATE: CLASSIC ─────────────────────────────────────────
function _tmplClassic(d) {
  const accent = '#111';
  return `<div style="padding:1.5rem 1.8rem;font-family:Georgia,'Times New Roman',serif;font-size:.82rem;line-height:1.55;color:#111;">
    <div style="text-align:center;border-bottom:2px solid #111;padding-bottom:.7rem;margin-bottom:.7rem;">
      ${d.name ? `<div style="font-size:1.5rem;font-weight:700;">${escHtml(d.name)}</div>` : '<div style="color:#bbb;">Your Name</div>'}
      ${d.title ? `<div style="font-size:.85rem;font-style:italic;margin:.1rem 0;">${escHtml(d.title)}</div>` : ''}
      <div style="font-size:.72rem;color:#444;margin-top:.2rem;">${escHtml(_contactLine(d.email,d.phone,d.location,d.linkedin,d.website))}</div>
    </div>
    ${d.summary ? `<div style="font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:.3rem;">Objective</div><div style="font-size:.8rem;margin-bottom:.7rem;">${escHtml(d.summary)}</div>` : ''}
    ${d.experience.length ? `<div style="font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #111;margin-bottom:.45rem;">Experience</div>${_renderExp(d.experience,'#555')}` : ''}
    ${d.education.length  ? `<div style="font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #111;margin:.8rem 0 .45rem;">Education</div>${_renderEdu(d.education,'#555')}` : ''}
    ${d.skills ? `<div style="font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #111;margin:.8rem 0 .35rem;">Skills</div><div style="font-size:.78rem;">${escHtml(d.skills)}</div>` : ''}
    ${d.certs  ? `<div style="font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #111;margin:.8rem 0 .35rem;">Certifications</div><div style="font-size:.78rem;white-space:pre-line;">${escHtml(d.certs)}</div>` : ''}
    ${d.langs  ? `<div style="font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #111;margin:.8rem 0 .35rem;">Languages</div><div style="font-size:.78rem;white-space:pre-line;">${escHtml(d.langs)}</div>` : ''}
  </div>`;
}

// ── TEMPLATE: MINIMAL ─────────────────────────────────────────
function _tmplMinimal(d) {
  const accent = '#888';
  return `<div style="padding:1.5rem 2rem;font-family:'Inter',Arial,sans-serif;font-size:.82rem;line-height:1.55;color:#222;">
    <div style="margin-bottom:1rem;">
      ${d.name ? `<div style="font-size:1.45rem;font-weight:700;letter-spacing:-.3px;">${escHtml(d.name)}</div>` : '<div style="color:#bbb;">Your Name</div>'}
      ${d.title ? `<div style="font-size:.82rem;color:${accent};margin:.08rem 0;">${escHtml(d.title)}</div>` : ''}
      <div style="font-size:.7rem;color:#aaa;margin-top:.18rem;">${escHtml(_contactLine(d.email,d.phone,d.location,d.linkedin,d.website))}</div>
    </div>
    ${d.summary ? `<div style="font-size:.62rem;font-weight:700;letter-spacing:2.5px;color:#bbb;text-transform:uppercase;margin-bottom:.3rem;">About</div><div style="font-size:.8rem;color:#444;margin-bottom:.9rem;">${escHtml(d.summary)}</div>` : ''}
    ${d.experience.length ? `<div style="font-size:.62rem;font-weight:700;letter-spacing:2.5px;color:#bbb;text-transform:uppercase;margin-bottom:.4rem;">Experience</div>${_renderExp(d.experience,accent)}` : ''}
    ${d.education.length  ? `<div style="font-size:.62rem;font-weight:700;letter-spacing:2.5px;color:#bbb;text-transform:uppercase;margin:.9rem 0 .4rem;">Education</div>${_renderEdu(d.education,accent)}` : ''}
    ${d.skills ? `<div style="font-size:.62rem;font-weight:700;letter-spacing:2.5px;color:#bbb;text-transform:uppercase;margin:.9rem 0 .3rem;">Skills</div><div style="font-size:.78rem;color:#444;">${escHtml(d.skills)}</div>` : ''}
    ${d.certs  ? `<div style="font-size:.62rem;font-weight:700;letter-spacing:2.5px;color:#bbb;text-transform:uppercase;margin:.9rem 0 .3rem;">Certifications</div><div style="font-size:.78rem;color:#444;white-space:pre-line;">${escHtml(d.certs)}</div>` : ''}
    ${d.langs  ? `<div style="font-size:.62rem;font-weight:700;letter-spacing:2.5px;color:#bbb;text-transform:uppercase;margin:.9rem 0 .3rem;">Languages</div><div style="font-size:.78rem;color:#444;white-space:pre-line;">${escHtml(d.langs)}</div>` : ''}
  </div>`;
}

// ── TEMPLATE: BOLD ────────────────────────────────────────────
function _tmplBold(d) {
  const accent = '#7c3aed';
  const headerBg = '#1e1b4b';
  return `<div style="font-family:'Inter',Arial,sans-serif;font-size:.82rem;line-height:1.5;color:#111;">
    <div style="background:${headerBg};color:#fff;padding:1.4rem 1.8rem;">
      ${d.name ? `<div style="font-size:1.65rem;font-weight:900;letter-spacing:-.5px;">${escHtml(d.name)}</div>` : '<div style="color:#888;">Your Name</div>'}
      ${d.title ? `<div style="font-size:.88rem;color:#a5b4fc;font-weight:600;margin:.1rem 0;">${escHtml(d.title)}</div>` : ''}
      <div style="font-size:.72rem;color:#c7d2fe;margin-top:.3rem;">${escHtml(_contactLine(d.email,d.phone,d.location,d.linkedin,d.website))}</div>
    </div>
    <div style="padding:1.1rem 1.8rem;">
      ${d.summary ? `<div style="font-size:.65rem;font-weight:900;letter-spacing:2px;color:${accent};text-transform:uppercase;margin-bottom:.3rem;">Profile</div><div style="font-size:.8rem;color:#333;margin-bottom:.9rem;">${escHtml(d.summary)}</div>` : ''}
      ${d.experience.length ? `<div style="font-size:.65rem;font-weight:900;letter-spacing:2px;color:${accent};text-transform:uppercase;border-left:3px solid ${accent};padding-left:.5rem;margin:.8rem 0 .5rem;">Experience</div>${_renderExp(d.experience,accent)}` : ''}
      ${d.education.length  ? `<div style="font-size:.65rem;font-weight:900;letter-spacing:2px;color:${accent};text-transform:uppercase;border-left:3px solid ${accent};padding-left:.5rem;margin:.8rem 0 .5rem;">Education</div>${_renderEdu(d.education,accent)}` : ''}
      ${d.skills ? `<div style="font-size:.65rem;font-weight:900;letter-spacing:2px;color:${accent};text-transform:uppercase;border-left:3px solid ${accent};padding-left:.5rem;margin:.8rem 0 .35rem;">Skills</div><div style="font-size:.78rem;color:#333;">${escHtml(d.skills)}</div>` : ''}
      ${d.certs  ? `<div style="font-size:.65rem;font-weight:900;letter-spacing:2px;color:${accent};text-transform:uppercase;border-left:3px solid ${accent};padding-left:.5rem;margin:.8rem 0 .35rem;">Certifications</div><div style="font-size:.78rem;color:#333;white-space:pre-line;">${escHtml(d.certs)}</div>` : ''}
      ${d.langs  ? `<div style="font-size:.65rem;font-weight:900;letter-spacing:2px;color:${accent};text-transform:uppercase;border-left:3px solid ${accent};padding-left:.5rem;margin:.8rem 0 .35rem;">Languages</div><div style="font-size:.78rem;color:#333;white-space:pre-line;">${escHtml(d.langs)}</div>` : ''}
    </div>
  </div>`;
}

// ── JOB TRACKER ───────────────────────────────────────────────
const JA_STATUSES = [
  'Applied','Phone Screen','Interview Scheduled','1st Interview',
  '2nd Interview','Final Round','Offer Received','Offer Accepted',
  'Waiting','Not Selected','Withdrew'
];

const JA_STATUS_COLORS = {
  'Applied':              '#38bdf8',
  'Phone Screen':         '#a78bfa',
  'Interview Scheduled':  '#fb923c',
  '1st Interview':        '#f472b6',
  '2nd Interview':        '#e879f9',
  'Final Round':          '#facc15',
  'Offer Received':       '#4ade80',
  'Offer Accepted':       '#22c55e',
  'Waiting':              '#94a3b8',
  'Not Selected':         '#f87171',
  'Withdrew':             '#64748b'
};

function addJobApp() {
  const company = (document.getElementById('jaCompany')||{}).value?.trim();
  const role    = (document.getElementById('jaRole')||{}).value?.trim();
  if (!company || !role) { showToast('Enter company and job title'); return; }

  if (!D.jobApps) D.jobApps = [];
  D.jobApps.unshift({
    id:      Date.now(),
    company,
    role,
    board:   (document.getElementById('jaBoard')||{}).value || '',
    date:    (document.getElementById('jaDate')||{}).value || new Date().toISOString().split('T')[0],
    salary:  (document.getElementById('jaSalary')||{}).value?.trim() || '',
    url:     (document.getElementById('jaUrl')||{}).value?.trim() || '',
    notes:   (document.getElementById('jaNotes')||{}).value?.trim() || '',
    status:  'Applied'
  });

  ['jaCompany','jaRole','jaSalary','jaUrl','jaNotes'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });

  save();
  renderJobApps();
  showToast('✅ Application logged!');
}

function updateJobStatus(id, status) {
  const app = (D.jobApps || []).find(a => a.id === id);
  if (app) { app.status = status; save(); renderJobApps(); }
}

function deleteJobApp(id) {
  if (!confirm('Remove this application?')) return;
  D.jobApps = (D.jobApps || []).filter(a => a.id !== id);
  save(); renderJobApps();
}

function renderJobTracker() { renderJobApps(); }

function renderJobApps() {
  const listEl  = document.getElementById('jaList');
  const countEl = document.getElementById('jaCount');
  const statsEl = document.getElementById('jaStats');
  if (!listEl) return;

  const filter = (document.getElementById('jaFilter')||{}).value || 'all';
  let apps = D.jobApps || [];
  if (filter !== 'all') apps = apps.filter(a => a.status === filter);

  if (countEl) countEl.textContent = apps.length + ' application' + (apps.length !== 1 ? 's' : '');

  // Stats
  if (statsEl) {
    const all = D.jobApps || [];
    const counts = {};
    all.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
    const highlights = ['Offer Received','Offer Accepted','Final Round','1st Interview','2nd Interview','Interview Scheduled'];
    statsEl.innerHTML = highlights.filter(s => counts[s]).map(s =>
      `<div style="font-size:.68rem;padding:.2rem .55rem;border-radius:20px;background:${JA_STATUS_COLORS[s]}22;color:${JA_STATUS_COLORS[s]};font-weight:700;">${s}: ${counts[s]}</div>`
    ).join('') + (all.length ? `<div style="font-size:.68rem;padding:.2rem .55rem;border-radius:20px;background:rgba(255,255,255,.06);color:var(--tx2);">Total: ${all.length}</div>` : '');
  }

  if (!apps.length) {
    listEl.innerHTML = `<div style="text-align:center;padding:1.5rem;font-size:.84rem;color:var(--tx2);">${filter==='all' ? 'No applications yet — log your first one above!' : 'No applications with this status.'}</div>`;
    return;
  }

  const statusOpts = JA_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('');

  listEl.innerHTML = apps.map(a => {
    const col = JA_STATUS_COLORS[a.status] || '#94a3b8';
    return `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-left:3px solid ${col};border-radius:10px;padding:.75rem .9rem;">
      <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;">
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;font-size:.9rem;">${escHtml(a.role)}</div>
          <div style="font-size:.76rem;color:var(--tx2);">${escHtml(a.company)}${a.board?' · '+escHtml(a.board):''}${a.date?' · '+a.date:''}</div>
          ${a.salary ? `<div style="font-size:.7rem;color:var(--gr);margin-top:.1rem;">💰 ${escHtml(a.salary)}</div>` : ''}
          ${a.notes  ? `<div style="font-size:.72rem;color:var(--tx2);margin-top:.18rem;font-style:italic;">${escHtml(a.notes)}</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;gap:.3rem;align-items:flex-end;">
          <select onchange="updateJobStatus(${a.id},this.value)" style="font-size:.7rem;padding:.22rem .4rem;border-radius:7px;background:${col}22;color:${col};border:1px solid ${col}55;font-weight:700;">
            ${JA_STATUSES.map(s => `<option value="${s}"${a.status===s?' selected':''}>${s}</option>`).join('')}
          </select>
          <div style="display:flex;gap:.3rem;">
            ${a.url ? `<a href="${escHtml(a.url)}" target="_blank" style="font-size:.68rem;padding:.18rem .45rem;border-radius:6px;background:rgba(56,189,248,.12);color:var(--c);text-decoration:none;font-weight:700;">🔗 View</a>` : ''}
            <button onclick="deleteJobApp(${a.id})" style="font-size:.68rem;padding:.18rem .45rem;border-radius:6px;background:rgba(248,113,113,.1);color:#f87171;border:none;cursor:pointer;">✕</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}
