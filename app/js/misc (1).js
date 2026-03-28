/* =============================================================
   misc.js — QR code generator, logo maker, video showcase,
             mentors & contacts, reading list, milestones,
             daily prompts, weekly wisdom, user profile system,
             contests, referral, leaderboard, parent learning
============================================================= */

// ── QR CODE GENERATOR (compact implementation) ───────────────
function generateBioQR(){
  const url = (document.getElementById('bioQRUrl')||{}).value||'';
  const el = document.getElementById('bioQRPreview');
  if(!el) return;
  if(!url.trim()){ el.innerHTML='<span style="font-size:.6rem;color:#999;">Enter URL to generate</span>'; return; }
  // Generate QR as SVG using minimal encoder
  const svg = generateQRSVG(url.trim(), 120);
  el.innerHTML = svg;
  updateBioPreview();
}

function generateQRSVG(text, size){
  // Minimal QR code encoder - generates a data matrix
  const mods = encodeQR(text);
  if(!mods) return '<span style="font-size:.55rem;color:#c00;">Text too long</span>';
  const n = mods.length;
  const cellSize = size / n;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${n} ${n}" style="background:#fff;">`;
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(mods[r][c]) svg+=`<rect x="${c}" y="${r}" width="1" height="1" fill="#000"/>`;
  svg+=`</svg>`;
  return svg;
}

function encodeQR(text){
  // Byte mode QR encoder (version 1-6, ECC-L)
  const data = [];
  for(let i=0;i<text.length;i++){
    const code = text.charCodeAt(i);
    if(code>255) return null;
    data.push(code);
  }

  // Version selection based on data length (byte mode, ECC-L)
  const caps = [0,17,32,53,78,106,134]; // max bytes per version 1-6
  let ver = 0;
  for(let v=1;v<=6;v++) if(data.length<=caps[v]){ ver=v; break; }
  if(!ver) return null;

  const size = ver*4+17;
  const grid = Array.from({length:size},()=>Array(size).fill(0));
  const mask = Array.from({length:size},()=>Array(size).fill(false));

  // Finder patterns
  const drawFinder=(r,c)=>{
    for(let dr=-1;dr<=7;dr++) for(let dc=-1;dc<=7;dc++){
      const rr=r+dr, cc=c+dc;
      if(rr<0||rr>=size||cc<0||cc>=size) continue;
      const inOuter = dr===0||dr===6||dc===0||dc===6;
      const inInner = dr>=2&&dr<=4&&dc>=2&&dc<=4;
      grid[rr][cc]=(inOuter||inInner)?1:0;
      mask[rr][cc]=true;
    }
  };
  drawFinder(0,0); drawFinder(0,size-7); drawFinder(size-7,0);

  // Timing patterns
  for(let i=8;i<size-8;i++){
    if(!mask[6][i]){ grid[6][i]=i%2===0?1:0; mask[6][i]=true; }
    if(!mask[i][6]){ grid[i][6]=i%2===0?1:0; mask[i][6]=true; }
  }

  // Alignment pattern (ver >= 2)
  if(ver>=2){
    const pos = [6, size-7];
    for(const ar of pos) for(const ac of pos){
      if(mask[ar][ac]) continue;
      for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){
        const rr=ar+dr, cc=ac+dc;
        if(rr<0||rr>=size||cc<0||cc>=size) continue;
        if(!mask[rr][cc]){
          grid[rr][cc]=(Math.abs(dr)===2||Math.abs(dc)===2||(!dr&&!dc))?1:0;
          mask[rr][cc]=true;
        }
      }
    }
  }

  // Dark module + reserved
  grid[size-8][8]=1; mask[size-8][8]=true;

  // Encode data bits
  const totalBits = getDataBits(ver);
  const bits = [];
  // Mode indicator (0100 = byte)
  bits.push(0,1,0,0);
  // Character count
  const ccLen = ver<=9?8:16;
  for(let i=ccLen-1;i>=0;i--) bits.push((data.length>>i)&1);
  // Data
  for(const byte of data) for(let i=7;i>=0;i--) bits.push((byte>>i)&1);
  // Terminator
  for(let i=0;i<4&&bits.length<totalBits;i++) bits.push(0);
  while(bits.length%8) bits.push(0);
  // Pad bytes
  const pads=[0xEC,0x11]; let pi=0;
  while(bits.length<totalBits){ for(let i=7;i>=0;i--) bits.push((pads[pi]>>i)&1); pi^=1; }

  // Place data bits
  let bitIdx=0;
  let upward=true;
  for(let col=size-1;col>=1;col-=2){
    if(col===6) col=5;
    const rows = upward ? Array.from({length:size},(_,i)=>size-1-i) : Array.from({length:size},(_,i)=>i);
    for(const row of rows){
      for(const dc of [0,-1]){
        const c=col+dc;
        if(c<0||c>=size||mask[row][c]) continue;
        if(bitIdx<bits.length) grid[row][c]=bits[bitIdx++];
        mask[row][c]=true;
      }
    }
    upward=!upward;
  }

  // Apply mask pattern 0 (checkerboard)
  for(let r=0;r<size;r++) for(let c=0;c<size;c++){
    if(!isReserved(r,c,size,ver) && (r+c)%2===0) grid[r][c]^=1;
  }

  // Format info (mask 0, ECC-L = 0)
  const fmtBits = [1,1,1,0,1,1,1,1,1,0,0,0,1,0,0];
  const fmtPositions=[];
  for(let i=0;i<8;i++){
    const r=i<6?i:(i===6?7:8), c=8;
    fmtPositions.push([r,c]);
  }
  for(let i=0;i<7;i++){
    const r=8, c=i<1?size-1:(size-1-i);
    fmtPositions.push([r,c]);
  }
  // Simplified: just set basic format
  for(let i=0;i<15&&i<fmtPositions.length;i++){
    const [r,c]=fmtPositions[i];
    if(r<size&&c<size) grid[r][c]=fmtBits[i];
  }

  // Add quiet zone
  const q=2, total=size+q*2;
  const final=Array.from({length:total},()=>Array(total).fill(0));
  for(let r=0;r<size;r++) for(let c=0;c<size;c++) final[r+q][c+q]=grid[r][c];
  return final;
}

function isReserved(r,c,size,ver){
  if(r<=8&&c<=8) return true;
  if(r<=8&&c>=size-8) return true;
  if(r>=size-8&&c<=8) return true;
  if(r===6||c===6) return true;
  if(r===size-8&&c===8) return true;
  return false;
}

function getDataBits(ver){
  const bits=[0,152,272,440,640,864,1088];
  return bits[ver]||152;
}

let _bioShowQR = false;
function toggleQROnBio(){
  _bioShowQR = !_bioShowQR;
  const btn = document.getElementById('bioQRToggleBtn');
  if(btn) btn.textContent = _bioShowQR ? '➖ Remove from Bio' : '➕ Add to Bio';
  updateBioPreview();
}

function downloadBioQR(){
  const el = document.getElementById('bioQRPreview');
  if(!el) return;
  const svg = el.querySelector('svg');
  if(!svg){ showToast('Generate a QR code first'); return; }
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  canvas.width=400; canvas.height=400;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload=()=>{ ctx.drawImage(img,0,0,400,400); const a=document.createElement('a'); a.download='qr-code.png'; a.href=canvas.toDataURL('image/png'); a.click(); showToast('QR downloaded ✓'); };
  img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svgData)));
}

// ── LOGO MAKER ───────────────────────────────────────────────
let _logoSettings = {text:'AB', bg:'linear-gradient(135deg,#1e3a5f,#2563eb)', shape:'circle', icon:''};
let _bioLogo = '';

function openLogoMaker(){
  const name = (document.getElementById('bioName')||{}).value||D.name||'';
  const initials = name.split(' ').map(w=>w[0]||'').join('').toUpperCase().slice(0,3)||'AB';
  _logoSettings.text = initials;
  const ti = document.getElementById('logoText');
  if(ti) ti.value = initials;
  openModal('logoMakerModal');
  setTimeout(drawLogo, 50);
}

function setLogoBg(el){
  document.querySelectorAll('.logo-color-opt').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  _logoSettings.bg = el.getAttribute('data-bg');
  drawLogo();
}

function setLogoShape(btn){
  document.querySelectorAll('.logo-shape-btn').forEach(b=>{b.classList.remove('active','bp');b.classList.add('bgh');});
  btn.classList.add('active','bp'); btn.classList.remove('bgh');
  _logoSettings.shape = btn.getAttribute('data-shape');
  drawLogo();
}

function setLogoIcon(el){
  document.querySelectorAll('.logo-icon-opt').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  _logoSettings.icon = el.getAttribute('data-icon');
  drawLogo();
}

function drawLogo(){
  const canvas = document.getElementById('logoCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=200, H=200;
  ctx.clearRect(0,0,W,H);

  const text = (document.getElementById('logoText')||{}).value||_logoSettings.text;
  _logoSettings.text = text;
  const bg = _logoSettings.bg;
  const shape = _logoSettings.shape;
  const icon = _logoSettings.icon;

  // Parse gradient
  const gradMatch = bg.match(/linear-gradient\((\d+)deg,\s*(#\w+),\s*(#\w+)\)/);
  if(gradMatch){
    const angle = parseInt(gradMatch[1])*Math.PI/180;
    const x1=100-Math.cos(angle)*100, y1=100-Math.sin(angle)*100;
    const x2=100+Math.cos(angle)*100, y2=100+Math.sin(angle)*100;
    const grd = ctx.createLinearGradient(x1,y1,x2,y2);
    grd.addColorStop(0, gradMatch[2]); grd.addColorStop(1, gradMatch[3]);
    ctx.fillStyle = grd;
  } else {
    ctx.fillStyle = '#1e3a5f';
  }

  // Shape
  if(shape==='circle'){ ctx.beginPath(); ctx.arc(100,100,100,0,Math.PI*2); ctx.fill(); }
  else if(shape==='rounded'){ roundRect(ctx,0,0,W,H,30); ctx.fill(); }
  else { ctx.fillRect(0,0,W,H); }

  // Text
  ctx.fillStyle='#fff';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  if(icon){
    ctx.font='bold 60px system-ui'; ctx.fillText(text, 100, 78);
    ctx.font='48px system-ui'; ctx.fillText(icon, 100, 140);
  } else {
    ctx.font=`bold ${text.length>2?60:72}px system-ui`;
    ctx.fillText(text, 100, 104);
  }
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function applyLogoToBio(){
  const canvas = document.getElementById('logoCanvas');
  if(!canvas) return;
  _bioLogo = canvas.toDataURL('image/png');
  const prev = document.getElementById('bioLogoPreview');
  if(prev) prev.innerHTML=`<img src="${_bioLogo}" style="width:100%;height:100%;object-fit:cover;">`;
  closeModal('logoMakerModal');
  updateBioPreview();
  showToast('Logo applied ✓');
}

function setBioLogo(input){
  const file=input.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    _bioLogo=e.target.result;
    const prev=document.getElementById('bioLogoPreview');
    if(prev) prev.innerHTML=`<img src="${_bioLogo}" style="width:100%;height:100%;object-fit:cover;">`;
    updateBioPreview();
  };
  reader.readAsDataURL(file);
}

function removeBioLogo(){
  _bioLogo='';
  const prev=document.getElementById('bioLogoPreview');
  if(prev) prev.innerHTML='<span style="font-size:1.2rem;opacity:.3;">✦</span>';
  updateBioPreview();
}

// ── VIDEO SHOWCASE ───────────────────────────────────────────
let _bioVideos = [];

function extractYouTubeID(url){
  if(!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function addBioVideo(){
  const url = (document.getElementById('bioVideoUrl')||{}).value.trim();
  const title = (document.getElementById('bioVideoTitle')||{}).value.trim();
  const type = (document.getElementById('bioVideoType')||{}).value;
  if(!url){ showToast('Paste a video URL'); return; }
  const ytId = extractYouTubeID(url);
  const typeEmojis = {performance:'🎵',highlight:'⭐',interview:'🎤',tutorial:'📖',project:'💻',sermon:'✝️',game:'🏀',other:'📹'};
  _bioVideos.push({id:Date.now(), url, ytId, title:title||'Video', type, emoji:typeEmojis[type]||'📹'});
  document.getElementById('bioVideoUrl').value='';
  document.getElementById('bioVideoTitle').value='';
  renderBioVideoList();
  updateBioPreview();
  showToast('Video added ✓');
}

function removeBioVideo(id){
  _bioVideos = _bioVideos.filter(v=>v.id!==id);
  renderBioVideoList();
  updateBioPreview();
}

function renderBioVideoList(){
  const el = document.getElementById('bioVideoList'); if(!el) return;
  if(!_bioVideos.length){ el.innerHTML=''; return; }
  el.innerHTML = _bioVideos.map(v=>`
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:8px;margin-bottom:.3rem;">
      ${v.ytId?`<img src="https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg" style="width:48px;height:28px;border-radius:4px;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none'">`:`<div style="width:48px;height:28px;border-radius:4px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0;">📹</div>`}
      <div style="flex:1;min-width:0;">
        <div style="font-size:.72rem;font-weight:600;color:var(--tx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${v.emoji} ${v.title}</div>
        <div style="font-size:.55rem;color:var(--tx2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${v.url}</div>
      </div>
      <button class="btn bda bs" onclick="removeBioVideo(${v.id})" style="font-size:.55rem;padding:.15rem .35rem;">✕</button>
    </div>
  `).join('');
}

// ── READING LIST ─────────────────────────────────────────────
let _bookFilter = 'all';
const REC_BOOKS = [
  {t:'The 7 Habits of Highly Effective Teens',a:'Sean Covey',why:'The foundation for personal effectiveness'},
  {t:'Rich Dad Poor Dad',a:'Robert Kiyosaki',why:'Changes how you think about money'},
  {t:'Atomic Habits',a:'James Clear',why:'Small changes, remarkable results'},
  {t:'How to Win Friends and Influence People',a:'Dale Carnegie',why:'The original people skills book'},
  {t:'Mindset',a:'Carol Dweck',why:'Growth vs. fixed mindset changes everything'},
  {t:'Start With Why',a:'Simon Sinek',why:'Find your purpose before your plan'},
  {t:'The Bible',a:'',why:'The ultimate life manual'},
  {t:'Dare to Lead',a:'Brené Brown',why:'Courage and vulnerability in leadership'},
  {t:'The Total Money Makeover',a:'Dave Ramsey',why:'Step-by-step financial freedom'},
  {t:'Outliers',a:'Malcolm Gladwell',why:'What really makes people successful'},
  {t:'Grit',a:'Angela Duckworth',why:'Passion + perseverance beats talent'},
  {t:'Think and Grow Rich',a:'Napoleon Hill',why:'The classic mindset book'}
];

function addBook(){
  const title = document.getElementById('bookTitle').value.trim();
  if(!title){ showToast('Enter a book title'); return; }
  const author = document.getElementById('bookAuthor').value.trim();
  const status = document.getElementById('bookStatus').value;
  if(!D.books) D.books=[];
  D.books.push({id:Date.now(), title, author, status, added:new Date().toISOString().slice(0,10)});
  document.getElementById('bookTitle').value='';
  document.getElementById('bookAuthor').value='';
  save(); renderBooks();
  showToast('Book added ✓');
}

function updateBookStatus(id, status){
  const book = (Array.isArray(D.books)?D.books:[]).find(b=>b.id===id);
  if(book){ book.status=status; if(status==='done') book.finished=new Date().toISOString().slice(0,10); save(); renderBooks(); }
}

function removeBook(id){
  D.books = (Array.isArray(D.books)?D.books:[]).filter(b=>b.id!==id); save(); renderBooks();
}

function filterBooks(f, btn){
  _bookFilter=f;
  document.querySelectorAll('.book-filter').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderBooks();
}

function renderBooks(){
  const el = document.getElementById('bookList'); if(!el) return;
  const books = (Array.isArray(D.books)?D.books:[]).filter(b=> _bookFilter==='all' || b.status===_bookFilter);
  const statusIcons = {want:'📋',reading:'📖',done:'✅'};
  const statusLabels = {want:'Want to Read',reading:'Reading',done:'Finished'};
  const ct = document.getElementById('bookCount');
  if(ct) ct.textContent = `${(Array.isArray(D.books)?D.books:[]).length} books · ${(Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length} finished`;

  if(!books.length){ el.innerHTML=`<div style="text-align:center;color:var(--tx2);padding:1.5rem;font-size:.8rem;">${_bookFilter==='all'?'No books yet. Add your first one above!':'No books in this category.'}</div>`; return; }

  el.innerHTML = books.sort((a,b)=> a.status==='reading'?-1:b.status==='reading'?1:0).map(b=>`
    <div style="display:flex;align-items:center;gap:.6rem;padding:.5rem .6rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;margin-bottom:.3rem;">
      <span style="font-size:1.1rem;">${statusIcons[b.status]}</span>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.78rem;font-weight:600;color:var(--tx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${b.title}</div>
        ${b.author?`<div style="font-size:.62rem;color:var(--tx2);">by ${b.author}</div>`:''}
      </div>
      <select onchange="updateBookStatus(${b.id},this.value)" style="width:90px;font-size:.6rem;padding:.2rem;">
        <option value="want" ${b.status==='want'?'selected':''}>📋 Want</option>
        <option value="reading" ${b.status==='reading'?'selected':''}>📖 Reading</option>
        <option value="done" ${b.status==='done'?'selected':''}>✅ Done</option>
      </select>
      <button class="btn bda bs" onclick="removeBook(${b.id})" style="font-size:.55rem;padding:.15rem .3rem;">✕</button>
    </div>
  `).join('');

  // Recommended books
  const rec = document.getElementById('recBooks'); if(!rec) return;
  const existing = (Array.isArray(D.books)?D.books:[]).map(b=>b.title.toLowerCase());
  const unread = REC_BOOKS.filter(r=>!existing.includes(r.t.toLowerCase()));
  rec.innerHTML = unread.slice(0,6).map(r=>`
    <div style="padding:.5rem .6rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;cursor:pointer;" onclick="document.getElementById('bookTitle').value='${r.t.replace(/'/g,"\\'")}';document.getElementById('bookAuthor').value='${r.a.replace(/'/g,"\\'")}';showToast('Filled in — hit Add!');">
      <div style="font-size:.72rem;font-weight:600;color:var(--tx);">${r.t}</div>
      ${r.a?`<div style="font-size:.58rem;color:var(--tx2);">${r.a}</div>`:''}
      <div style="font-size:.55rem;color:var(--c);margin-top:.15rem;">${r.why}</div>
    </div>
  `).join('');
}

// ── MENTORS & KEY CONTACTS ──────────────────────────────────
function addMentor(){
  const name = document.getElementById('mentorName').value.trim();
  if(!name){ showToast('Enter a name'); return; }
  const role = document.getElementById('mentorRole').value;
  const phone = document.getElementById('mentorPhone').value.trim();
  const email = document.getElementById('mentorEmail').value.trim();
  const notes = document.getElementById('mentorNotes').value.trim();
  const roleEmojis = {mentor:'🧭',teacher:'📚',coach:'🏀',pastor:'⛪',boss:'💼',counselor:'🧠',family:'👨‍👩‍👧',friend:'🤝',reference:'📄',other:'📌'};
  const roleLabels = {mentor:'Mentor',teacher:'Teacher',coach:'Coach',pastor:'Pastor',boss:'Boss',counselor:'Counselor',family:'Family',friend:'Friend',reference:'Reference',other:'Other'};
  if(!D.mentors) D.mentors=[];
  D.mentors.push({id:Date.now(), name, role, phone, email, notes, emoji:roleEmojis[role]||'📌', roleLabel:roleLabels[role]||role});
  ['mentorName','mentorPhone','mentorEmail','mentorNotes'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  save(); renderMentors();
  showToast('Contact added ✓');
}

function removeMentor(id){
  D.mentors = (D.mentors||[]).filter(m=>m.id!==id); save(); renderMentors();
}

function renderMentors(){
  const el = document.getElementById('mentorList'); if(!el) return;
  const mentors = D.mentors||[];
  if(!mentors.length){ el.innerHTML='<div style="text-align:center;color:var(--tx2);padding:1.5rem;font-size:.8rem;">No contacts yet. Start building your network!</div>'; return; }
  el.innerHTML = mentors.map(m=>`
    <div style="display:flex;align-items:flex-start;gap:.6rem;padding:.6rem .7rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;margin-bottom:.35rem;">
      <div style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">${m.emoji}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.8rem;font-weight:700;color:var(--tx);">${m.name} <span style="font-weight:400;font-size:.65rem;color:var(--c);margin-left:.3rem;">${m.roleLabel}</span></div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;font-size:.62rem;color:var(--tx2);margin-top:.15rem;">
          ${m.phone?`<span>☎ ${m.phone}</span>`:''}
          ${m.email?`<span>✉ ${m.email}</span>`:''}
        </div>
        ${m.notes?`<div style="font-size:.62rem;color:var(--tx2);margin-top:.2rem;font-style:italic;">${m.notes}</div>`:''}
      </div>
      <button class="btn bda bs" onclick="removeMentor(${m.id})" style="font-size:.55rem;padding:.15rem .3rem;">✕</button>
    </div>
  `).join('');
}

// ── MILESTONES TIMELINE ─────────────────────────────────────
function addMilestone(){
  const date = document.getElementById('msDate').value;
  const title = document.getElementById('msTitle').value.trim();
  if(!title){ showToast('Describe your milestone'); return; }
  const cat = document.getElementById('msCat').value;
  const catEmojis = {academic:'🎓',career:'💼',personal:'⭐',faith:'⛪',health:'💪',creative:'🎨',financial:'💰',service:'🤝'};
  if(!D.milestones) D.milestones=[];
  D.milestones.push({id:Date.now(), date:date||new Date().toISOString().slice(0,10), title, cat, emoji:catEmojis[cat]||'⭐'});
  document.getElementById('msTitle').value='';
  save(); renderMilestones();
  showToast('Milestone recorded ✓');
}

function removeMilestone(id){
  D.milestones = (D.milestones||[]).filter(m=>m.id!==id); save(); renderMilestones();
}

function renderMilestones(){
  const el = document.getElementById('milestoneTimeline'); if(!el) return;
  const ms = (D.milestones||[]).sort((a,b)=>b.date.localeCompare(a.date));
  if(!ms.length){ el.innerHTML='<div style="text-align:center;color:var(--tx2);padding:2rem;font-size:.8rem;">No milestones yet. Record your first accomplishment!</div>'; return; }

  el.innerHTML = `<div style="position:absolute;left:8px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--c),transparent);"></div>` +
    ms.map(m=>{
      const d = new Date(m.date+'T12:00:00');
      const mon = d.toLocaleDateString('en',{month:'short'});
      const yr = d.getFullYear();
      return `<div style="display:flex;align-items:flex-start;gap:.7rem;margin-bottom:.7rem;position:relative;">
        <div style="width:18px;height:18px;border-radius:50%;background:var(--c);display:flex;align-items:center;justify-content:center;font-size:.55rem;flex-shrink:0;z-index:1;border:2px solid var(--bg);">${m.emoji}</div>
        <div style="flex:1;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:.5rem .7rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:.8rem;font-weight:700;color:var(--tx);">${m.title}</span>
            <button class="btn bda bs" onclick="removeMilestone(${m.id})" style="font-size:.5rem;padding:.1rem .25rem;">✕</button>
          </div>
          <div style="font-size:.6rem;color:var(--tx2);margin-top:.1rem;">${mon} ${d.getDate()}, ${yr}</div>
        </div>
      </div>`;
    }).join('');
}

// ── MOOD TRACKER ────────────────────────────────────────────
function logMood(level, btn){
  const note = (document.getElementById('moodNote')||{}).value||'';
  const today = new Date().toISOString().slice(0,10);
  if(!D.moods) D.moods=[];
  // Replace if already logged today
  D.moods = D.moods.filter(m=>m.date!==today);
  D.moods.push({date:today, level, note, time:new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})});
  document.querySelectorAll('.mood-btn').forEach(b=>b.style.border='2px solid transparent');
  btn.style.border='2px solid var(--c)';
  if(document.getElementById('moodNote')) document.getElementById('moodNote').value='';
  save(); renderMoodTracker();
  const labels = {5:'Great day!',4:'Good vibes',3:'Logged',2:'Hang in there',1:'Tomorrow is a new day'};
  showToast(labels[level]||'Mood logged ✓');
}

function renderMoodTracker(){
  const grid = document.getElementById('moodGrid');
  const log = document.getElementById('moodLog');
  if(!grid || !log) return;
  const moods = D.moods||[];
  const moodColors = {5:'#22c55e',4:'#86efac',3:'#fbbf24',2:'#fb923c',1:'#ef4444'};
  const moodEmojis = {5:'😄',4:'🙂',3:'😐',2:'😔',1:'😢'};

  // Grid - last 30 days
  const today = new Date();
  let gridHTML = '';
  for(let i=29;i>=0;i--){
    const d = new Date(today); d.setDate(d.getDate()-i);
    const ds = d.toISOString().slice(0,10);
    const entry = moods.find(m=>m.date===ds);
    const color = entry ? moodColors[entry.level] : 'rgba(255,255,255,.06)';
    const emoji = entry ? moodEmojis[entry.level] : '';
    const label = d.getDate();
    gridHTML+=`<div style="aspect-ratio:1;background:${color};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:.5rem;" title="${ds}: ${emoji||'No entry'}">${emoji||`<span style='font-size:.45rem;color:var(--tx2);'>${label}</span>`}</div>`;
  }
  grid.innerHTML = gridHTML;

  // Highlight today's mood button
  const todayStr = today.toISOString().slice(0,10);
  const todayMood = moods.find(m=>m.date===todayStr);
  if(todayMood){
    const btns = document.querySelectorAll('.mood-btn');
    btns.forEach((b,i)=>{ b.style.border = (5-i)===todayMood.level ? '2px solid var(--c)' : '2px solid transparent'; });
  }

  // Log - recent entries
  const recent = moods.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,15);
  if(!recent.length){ log.innerHTML='<div style="color:var(--tx2);font-size:.72rem;padding:1rem;text-align:center;">Log your first mood above!</div>'; return; }
  log.innerHTML = recent.map(m=>{
    const d = new Date(m.date+'T12:00:00');
    return `<div style="display:flex;align-items:center;gap:.5rem;padding:.35rem .4rem;border-bottom:1px solid rgba(255,255,255,.04);">
      <span style="font-size:1rem;">${moodEmojis[m.level]}</span>
      <div style="flex:1;">
        <div style="font-size:.68rem;color:var(--tx);">${d.toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})}</div>
        ${m.note?`<div style="font-size:.58rem;color:var(--tx2);">${m.note}</div>`:''}
      </div>
      <span style="font-size:.55rem;color:var(--tx2);">${m.time||''}</span>
    </div>`;
  }).join('');
}


// ── DAILY PROMPTS ─────────────────────────────────────────────
const DAILY_PROMPTS = [
  "What's one thing you're grateful for today?","If you could master any skill instantly, what would it be?",
  "What's the hardest decision you've made recently? Would you make it again?","Describe your perfect day 5 years from now.",
  "What's a lesson you learned the hard way?","Who has influenced you the most this year and why?",
  "What fear would you overcome if you could?","What does 'success' mean to you personally?",
  "Write about a time someone's kindness changed your day.","What would you tell your younger self?",
  "What's one habit you want to build? Why?","Describe a moment you felt truly proud of yourself.",
  "What's the biggest misconception people have about you?","If money wasn't an issue, what would you do with your life?",
  "What boundaries do you need to set or strengthen?","Write about someone you admire and what you'd ask them.",
  "What's something you've been putting off? Why?","Describe your ideal morning routine.",
  "What's a belief you've changed your mind about?","If you wrote a book, what would it be about?",
  "What does integrity look like in your daily life?","Name 3 things that always improve your mood.",
  "What's the best advice you've ever received?","What are you most curious about right now?",
  "Describe a challenge that made you stronger.","What would you do differently if nobody could judge you?",
  "Write about a friendship that shaped who you are.","What does 'home' mean to you?",
  "What's one thing you want to be known for?","How do you recharge when life gets heavy?",
  "What's a goal that scares you a little? That's the right one."
];

function getDailyPrompt(){
  const dayOfYear = Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(1000*60*60*24));
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}

function renderDailyPrompt(){ return;
  const el = document.getElementById('heroDailyPrompt'); if(!el) return;
  const prompt = getDailyPrompt();
  el.innerHTML = `
    <div style="background:rgba(167,139,250,.04);border:1px solid rgba(167,139,250,.1);border-radius:12px;padding:.7rem .9rem;margin-bottom:.6rem;cursor:pointer;" onclick="showSection('s-journal')">
      <div style="font-size:.55rem;text-transform:uppercase;letter-spacing:1.5px;color:#a78bfa;font-weight:700;margin-bottom:.25rem;">💭 TODAY'S JOURNAL PROMPT</div>
      <div style="font-size:.78rem;color:var(--tx);line-height:1.5;font-style:italic;">"${prompt}"</div>
      <div style="font-size:.5rem;color:var(--tx2);margin-top:.2rem;">Tap to open journal →</div>
    </div>`;
}

// ── WEEKLY WISDOM ─────────────────────────────────────────────
const WEEKLY_WISDOM = [
  {text:"The best time to plant a tree was 20 years ago. The second best time is now.",src:"Chinese Proverb"},
  {text:"Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.",src:"Benjamin Franklin"},
  {text:"The pain of discipline weighs ounces. The pain of regret weighs tons.",src:"Jim Rohn"},
  {text:"You don't have to be great to start, but you have to start to be great.",src:"Zig Ziglar"},
  {text:"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",src:"Jeremiah 29:11"},
  {text:"It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man who is actually in the arena.",src:"Theodore Roosevelt"},
  {text:"Compound interest is the eighth wonder of the world. He who understands it, earns it. He who doesn't, pays it.",src:"Albert Einstein"},
  {text:"The only person you are destined to become is the person you decide to be.",src:"Ralph Waldo Emerson"},
  {text:"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",src:"Philippians 4:6"},
  {text:"The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.",src:"Vince Lombardi"},
  {text:"Your life does not get better by chance, it gets better by change.",src:"Jim Rohn"},
  {text:"Train up a child in the way he should go; even when he is old he will not depart from it.",src:"Proverbs 22:6"},
  {text:"The secret of getting ahead is getting started.",src:"Mark Twain"},
  {text:"Don't let yesterday take up too much of today.",src:"Will Rogers"},
  {text:"Success is not final, failure is not fatal: it is the courage to continue that counts.",src:"Winston Churchill"},
  {text:"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",src:"Proverbs 3:5-6"},
  {text:"The greatest glory in living lies not in never falling, but in rising every time we fall.",src:"Nelson Mandela"},
  {text:"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",src:"Colossians 3:23"},
  {text:"An investment in knowledge pays the best interest.",src:"Benjamin Franklin"},
  {text:"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",src:"Joshua 1:9"},
  {text:"The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",src:"Steve Jobs"},
  {text:"A budget is telling your money where to go instead of wondering where it went.",src:"Dave Ramsey"},
  {text:"Show me your friends and I'll show you your future.",src:"Mark Ambrose"},
  {text:"I can do all things through Christ who strengthens me.",src:"Philippians 4:13"},
  {text:"The man who moves a mountain begins by carrying away small stones.",src:"Confucius"},
  {text:"Your time is limited. Don't waste it living someone else's life.",src:"Steve Jobs"},
  {text:"Two are better than one, because they have a good return for their labor.",src:"Ecclesiastes 4:9"},
  {text:"It's not about having time. It's about making time.",src:"Unknown"},
  {text:"The rich rule over the poor, and the borrower is slave to the lender.",src:"Proverbs 22:7"},
  {text:"You miss 100% of the shots you don't take.",src:"Wayne Gretzky"},
  {text:"Start where you are. Use what you have. Do what you can.",src:"Arthur Ashe"},
  {text:"Iron sharpens iron, and one man sharpens another.",src:"Proverbs 27:17"},
  {text:"The future belongs to those who prepare for it today.",src:"Malcolm X"},
  {text:"Habits are the compound interest of self-improvement.",src:"James Clear"},
  {text:"The Lord is my shepherd; I shall not want.",src:"Psalm 23:1"},
  {text:"What you do every day matters more than what you do once in a while.",src:"Gretchen Rubin"},
  {text:"A fool and his money are soon parted.",src:"Thomas Tusser"},
  {text:"Whoever walks with the wise becomes wise, but the companion of fools will suffer harm.",src:"Proverbs 13:20"},
  {text:"Be the change you wish to see in the world.",src:"Mahatma Gandhi"},
  {text:"Commit to the Lord whatever you do, and he will establish your plans.",src:"Proverbs 16:3"},
  {text:"Discipline is choosing between what you want now and what you want most.",src:"Abraham Lincoln"},
  {text:"The best investment you can make is in yourself.",src:"Warren Buffett"},
  {text:"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",src:"Galatians 6:9"},
  {text:"People don't care how much you know until they know how much you care.",src:"Theodore Roosevelt"},
  {text:"Every expert was once a beginner.",src:"Helen Hayes"},
  {text:"Whoever is faithful in very little is also faithful in much.",src:"Luke 16:10"},
  {text:"The only limit to our realization of tomorrow is our doubts of today.",src:"Franklin D. Roosevelt"},
  {text:"A penny saved is a penny earned.",src:"Benjamin Franklin"},
  {text:"He who has a why to live for can bear almost any how.",src:"Friedrich Nietzsche"},
  {text:"For where your treasure is, there your heart will be also.",src:"Matthew 6:21"},
  {text:"The journey of a thousand miles begins with a single step.",src:"Lao Tzu"},
  {text:"Don't tell me what you value. Show me your budget, and I'll tell you what you value.",src:"Joe Biden"},
];

function getWeeklyWisdom(){
  const weekNum = Math.floor((new Date()-new Date(new Date().getFullYear(),0,1))/(7*86400000));
  return WEEKLY_WISDOM[weekNum % WEEKLY_WISDOM.length];
}

// ── ACHIEVEMENT BADGES ────────────────────────────────────────
const BADGES = [
  {id:'b-first-login',name:'First Steps',icon:'👣',desc:'Logged in for the first time',check:()=>!!D.name},
  {id:'b-streak7',name:'Week Warrior',icon:'🔥',desc:'7-day check-in streak',check:()=>(D.streak||0)>=7},
  {id:'b-streak30',name:'Monthly Machine',icon:'⚡',desc:'30-day check-in streak',check:()=>(D.streak||0)>=30},
  {id:'b-streak90',name:'Unstoppable',icon:'💎',desc:'90-day check-in streak',check:()=>(D.streak||0)>=90},
  {id:'b-1cert',name:'Scholar',icon:'📜',desc:'Earned first certificate',check:()=>Object.values(D.skillCerts||{}).filter(Boolean).length>=1},
  {id:'b-5cert',name:'Knowledge Seeker',icon:'🎓',desc:'Earned 5 certificates',check:()=>Object.values(D.skillCerts||{}).filter(Boolean).length>=5},
  {id:'b-allcert',name:'Academy Master',icon:'🏅',desc:'All 18 certificates earned',check:()=>Object.values(D.skillCerts||{}).filter(Boolean).length>=18},
  {id:'b-1goal',name:'Goal Getter',icon:'🎯',desc:'Completed first goal',check:()=>(Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length>=1},
  {id:'b-10goal',name:'Dream Crusher',icon:'💪',desc:'Completed 10 goals',check:()=>(Array.isArray(D.goals)?D.goals:[]).filter(g=>g.done).length>=10},
  {id:'b-1book',name:'Bookworm',icon:'📖',desc:'Finished first book',check:()=>(Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length>=1},
  {id:'b-5book',name:'Bibliophile',icon:'📚',desc:'Finished 5 books',check:()=>(Array.isArray(D.books)?D.books:[]).filter(b=>b.status==='done').length>=5},
  {id:'b-journal10',name:'Deep Thinker',icon:'✍️',desc:'10 journal entries',check:()=>(Array.isArray(D.journal)?D.journal:[]).length>=10},
  {id:'b-journal50',name:'Reflective Mind',icon:'🪞',desc:'50 journal entries',check:()=>(Array.isArray(D.journal)?D.journal:[]).length>=50},
  {id:'b-resume',name:'Career Ready',icon:'📄',desc:'Built a resume',check:()=>!!(D.resume&&D.resume.name)},
  {id:'b-bio',name:'Digital Identity',icon:'🪪',desc:'Created a bio page',check:()=>!!(D.bio&&D.bio.name)},
  {id:'b-5career',name:'Explorer',icon:'🧭',desc:'Explored 5 careers',check:()=>(D.selectedCareers||[]).length>=5},
  {id:'b-milestone5',name:'Milestone Maker',icon:'🏆',desc:'Logged 5 milestones',check:()=>(D.milestones||[]).length>=5},
  {id:'b-chore100',name:'Chore Champion',icon:'🌟',desc:'100 chore points earned',check:()=>((D.chorePoints||{}).total||0)>=100},
  {id:'b-mood30',name:'Self-Aware',icon:'😊',desc:'30 days of mood logging',check:()=>(D.moods||[]).length>=30},
  {id:'b-mentor5',name:'Network Builder',icon:'🤝',desc:'5+ people in My People',check:()=>(D.mentors||[]).length>=5},
];

function renderBadges(){
  const el = document.getElementById('heroBadgeShowcase'); if(!el) return;
  const earned = BADGES.filter(b=>b.check());
  const recent = earned.slice(-4);
  if(!earned.length){ el.innerHTML=''; return; }
  el.innerHTML = `
    `;
}

function renderBadgesPage(){
  const grid = document.getElementById('badgesFullGrid'); if(!grid) return;
  const earned = BADGES.filter(b=>b.check());
  const locked = BADGES.filter(b=>!b.check());
  const total = BADGES.length;
  const pct = Math.round((earned.length/total)*100);

  // Stats
  const ec = document.getElementById('badgesEarnedCount'); if(ec) ec.textContent = earned.length;
  const lc = document.getElementById('badgesLockedCount'); if(lc) lc.textContent = locked.length;
  const pb = document.getElementById('badgesProgressBar'); if(pb) pb.style.width = pct+'%';
  const pl = document.getElementById('badgesProgressLabel'); if(pl) pl.textContent = earned.length+'/'+total+' · '+pct+'%';

  // Grid - earned first, then locked
  grid.innerHTML = BADGES.map(b=>{
    const done = b.check();
    return `<div style="background:${done?'rgba(245,166,35,.05)':'rgba(255,255,255,.02)'};border:1px solid ${done?'rgba(245,166,35,.15)':'rgba(255,255,255,.05)'};border-radius:12px;padding:1rem;text-align:center;${done?'':'opacity:.5;'}">
      <div style="font-size:2rem;margin-bottom:.3rem;${done?'':'filter:grayscale(1);'}">${b.icon}</div>
      <div style="font-size:.8rem;font-weight:700;color:${done?'var(--tx)':'var(--tx3)'};">${b.name}</div>
      <div style="font-size:.65rem;color:var(--tx2);margin-top:.15rem;line-height:1.4;">${b.desc}</div>
      <div style="margin-top:.4rem;font-size:.6rem;font-weight:700;color:${done?'#22c55e':'var(--tx3)'};">${done?'✅ EARNED':'🔒 Locked'}</div>
    </div>`;
  }).join('');
}

function initBadgesPage(){ renderBadgesPage(); }

// ── LESSON OF THE WEEK SPOTLIGHT ──────────────────────────────
function getLessonOfWeek(){
  const weekNum = Math.floor((new Date()-new Date(new Date().getFullYear(),0,1))/(7*86400000));
  const allCats = Object.keys(typeof SK_DATA!=='undefined'?SK_DATA:{});
  if(!allCats.length) return null;
  const catIdx = weekNum % allCats.length;
  const cat = allCats[catIdx];
  const lessons = (typeof SK_DATA!=='undefined'?SK_DATA[cat]:[])||[];
  if(!lessons.length) return null;
  const lessonIdx = Math.floor(weekNum/allCats.length) % lessons.length;
  return {cat, lesson:lessons[lessonIdx], catName:(typeof SK_CATS!=='undefined'?SK_CATS.find(c=>c.key===cat):null)};
}

const EMOTION_LESSONS = [
  {icon:'😤',title:'Anger Management',sub:'Anger is a signal, not a strategy',color:'#ef4444',
    body:`<h4>Anger Is Not Bad</h4><p>Anger is an emotion, not a character flaw. It signals that something is wrong — a boundary was crossed, an injustice occurred, you feel threatened or disrespected. The anger itself is information. What you do with it determines whether it helps or destroys.</p><h4>What Works</h4><p>Pause before reacting. The first 6 seconds of anger are the most dangerous — your rational brain is temporarily offline. Count to 10, take deep breaths, leave the room if needed. Then ask: "What am I actually angry about?" Often the surface issue hides a deeper one — you're not angry about the dishes, you're angry about feeling disrespected.</p><h4>Healthy Expression</h4><p>Use "I feel" statements: "I feel frustrated when..." instead of "You always..." Exercise is one of the most effective anger management tools — your body needs to process the adrenaline. Journal about what triggered you. Talk to someone you trust after you've calmed down, not during the peak.</p>`},
  {icon:'💙',title:'Emotional Awareness',sub:'Name it to tame it',color:'#60a5fa',
    body:`<h4>Most People Can't Name Their Emotions</h4><p>Ask someone how they feel and they say "fine," "good," or "bad." But there are hundreds of emotional states, and the more precisely you can identify what you're feeling, the better you can respond to it. "I'm anxious about the test" leads to a different action than "I'm overwhelmed by everything." Naming the emotion reduces its power over you.</p><h4>The Emotion Wheel</h4><p>Start with the basics: happy, sad, angry, scared, disgusted, surprised. Then go deeper. Sad could be lonely, disappointed, heartbroken, grief, or nostalgia. Angry could be frustrated, betrayed, jealous, or disrespected. Each one needs a different response.</p><h4>Building the Skill</h4><p>Check in with yourself 3 times a day: morning, afternoon, evening. Ask "What am I feeling right now? Why?" Write it down. Over time, you'll develop an emotional vocabulary that helps you navigate every situation with more clarity and less reactivity.</p>`},
  {icon:'🧘',title:'Stress & Anxiety Management',sub:'Techniques that actually work in the moment',color:'#22c55e',
    body:`<h4>Stress vs Anxiety</h4><p>Stress has a clear cause — the test, the deadline, the argument. Remove the cause and the stress reduces. Anxiety often has no clear cause or is disproportionate to the trigger. Both are manageable with the right tools.</p><h4>In the Moment</h4><p><b>Box breathing:</b> Inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold 4 seconds. Repeat 4 times. This activates your parasympathetic nervous system and physically calms you down. <b>5-4-3-2-1 grounding:</b> Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. This pulls you out of your head and into the present.</p><h4>Long-Term</h4><p>Regular exercise reduces anxiety by 20-30% (as effective as medication for mild-moderate anxiety). Sleep — anxiety and poor sleep feed each other in a cycle. Limit caffeine. Talk to someone — keeping anxiety internal makes it grow. Write it down — journaling reduces the power of anxious thoughts by externalizing them.</p>`},
  {icon:'🪞',title:'Self-Awareness',sub:'The foundation of every other emotional skill',color:'#a78bfa',
    body:`<h4>What Self-Awareness Is</h4><p>Self-awareness is the ability to see yourself clearly — your strengths, weaknesses, patterns, triggers, and blind spots. It is the most foundational emotional intelligence skill because without it, you cannot improve anything else. You can't manage emotions you don't recognize. You can't fix patterns you don't see.</p><h4>How to Build It</h4><p>Ask for honest feedback from people who know you well and actually listen without defending yourself. Journal regularly — patterns emerge on paper that are invisible in your head. Pay attention to your triggers — what situations consistently make you angry, anxious, or shut down? Those triggers reveal your deepest values and wounds.</p><h4>The Uncomfortable Truth</h4><p>Self-awareness often means seeing things about yourself you don't like. That discomfort is not a problem — it is the beginning of growth. The people who refuse to look honestly at themselves are the ones who repeat the same mistakes for decades.</p>`},
  {icon:'💬',title:'Communication Under Pressure',sub:'What to say when emotions are running high',color:'#fb923c',
    body:`<h4>When Emotions Are High, Intelligence Is Low</h4><p>Your prefrontal cortex (rational brain) goes partially offline when you're flooded with strong emotions. This is why you say things you regret, send the text you wish you hadn't, or go silent when you need to speak. Knowing this is your first defense.</p><h4>Practical Scripts</h4><p>"I need a few minutes before I can talk about this calmly." "I hear what you're saying, and I want to respond thoughtfully — give me a moment." "I'm feeling really [emotion] right now, and I don't want to say something I'll regret." These are not weakness — they are the most mature sentences you can speak.</p><h4>After You've Calmed Down</h4><p>Come back to the conversation. Don't let it fester. Use the format: "When [specific thing] happened, I felt [emotion] because [reason]. What I need is [specific request]." This is direct, honest, and gives the other person something concrete to work with.</p>`},
];

const LEADER_LESSONS = [
  {icon:'🎯',title:'Taking Responsibility',sub:'Why this is the #1 leadership trait',color:'#22c55e',
    body:`<h4>Leaders Own It</h4><p>The single trait that separates leaders from everyone else is ownership. When something goes wrong, a leader says "that's on me" — even when it isn't entirely their fault. Why? Because ownership gives you power. If it's someone else's fault, you're helpless. If it's yours, you can fix it.</p><h4>Why It Matters for YOU</h4><p>Responsibility is the skill that gets you promoted, trusted with more, and respected by peers. Every boss, coach, and mentor is looking for the person who doesn't make excuses. Be that person now — in school, at home, with friends — and you'll have a 10-year head start on most adults.</p><h4>The Daily Practice</h4><p>When something goes wrong today, before you explain why it wasn't your fault, ask: "What could I have done differently?" Even if the answer is "not much," the question itself builds the muscle.</p>`},
  {icon:'🧭',title:'Decision Making',sub:'How to choose well when the stakes are real',color:'#60a5fa',
    body:`<h4>You Will Make Thousands of Decisions</h4><p>Most are small and reversible. Some are big and permanent. Knowing the difference matters. For small decisions: decide fast, don't overthink. For big decisions: slow down, gather information, consider consequences.</p><h4>The Framework</h4><p><b>Step 1:</b> Define what you're actually deciding (not always obvious). <b>Step 2:</b> List your options (there are usually more than two). <b>Step 3:</b> For each option, ask "What happens in 10 minutes? 10 months? 10 years?" <b>Step 4:</b> Identify which option aligns with who you want to become, not just what feels good now. <b>Step 5:</b> Decide and commit. A good decision executed fully beats a perfect decision never made.</p><h4>When You Decide Wrong</h4><p>You will. Everyone does. The skill is not perfect decision-making — it is fast recovery. Acknowledge the mistake, learn the lesson, adjust course, and move forward. Dwelling on bad decisions is itself a bad decision.</p>`},
  {icon:'💪',title:'Self-Discipline',sub:'Doing what needs to be done when you don\'t feel like it',color:'#fbbf24',
    body:`<h4>Motivation Is a Lie</h4><p>Motivation is a feeling. It comes and goes like the weather. If you only work when you feel motivated, you will accomplish almost nothing. Discipline is doing the thing whether you feel like it or not. It is brushing your teeth when you're tired, studying when you'd rather scroll, exercising when the couch is calling.</p><h4>How to Build It</h4><p>Start absurdly small. Don't commit to "work out every day" — commit to "put on my shoes." Once the shoes are on, momentum takes over. Build one habit at a time. Stack habits onto things you already do: "After I brush my teeth, I read for 5 minutes." Remove friction from good choices and add friction to bad ones — put the phone in another room, keep healthy food visible.</p><h4>The Compound Effect</h4><p>Small disciplines compound into massive results over time. Reading 10 pages a day = 12 books a year. Saving $5/day = $1,825/year. 15 minutes of practice daily = 91 hours/year. Discipline is not dramatic. It is boring, consistent, and unstoppable.</p>`},
  {icon:'🗣️',title:'Influence Without Authority',sub:'Real leaders don\'t need a title',color:'#a78bfa',
    body:`<h4>Authority Is Given. Influence Is Earned.</h4><p>A title makes people listen. Character makes people follow. The most powerful leaders in any school, team, or workplace are often not the ones with official positions — they're the ones others naturally look to for direction, encouragement, and truth.</p><h4>How to Build Influence</h4><p>Be competent — know your stuff and do your work well. Be reliable — follow through on every commitment, no matter how small. Be generous — help others succeed without keeping score. Be honest — tell the truth even when it's unpopular. Be calm in crisis — when everyone else panics, the person who stays steady becomes the leader by default.</p><h4>The Test</h4><p>Would people follow you if they didn't have to? If you had no title, no authority, no leverage — would people still seek your input, trust your judgment, and want you on their team? That is real leadership, and it starts building now.</p>`},
  {icon:'🔥',title:'Resilience — Getting Back Up',sub:'The skill that makes every other skill possible',color:'#ef4444',
    body:`<h4>You Will Get Knocked Down</h4><p>Failure is not optional. You will fail tests, lose games, get rejected, make mistakes, and face situations that feel impossible. Resilience is not about avoiding these moments — it is about what you do after them.</p><h4>What Resilient People Do</h4><p>They feel the pain without pretending it doesn't exist. They give themselves a time limit to grieve or be frustrated — then they get moving. They ask "what can I learn?" instead of "why does this always happen to me?" They reach out to people who can help instead of isolating. They remember that they've survived 100% of their worst days so far.</p><h4>Building Resilience</h4><p>Expose yourself to difficulty on purpose — hard workouts, challenging courses, uncomfortable conversations. Each one builds your tolerance for discomfort. Keep a "wins" journal — on bad days, read it to remind yourself what you're capable of. Develop a short personal mantra: "I've handled hard things before. I can handle this."</p>`},
];

function renderSocialGrid(){
  const el = document.getElementById('socialGrid'); if(!el) return;
  el.innerHTML = SOCIAL_LESSONS.map((l,i)=>buildCharCard(l,i,'social')).join('');
}
function renderEmotionGrid(){
  const el = document.getElementById('emotionGrid'); if(!el) return;
  el.innerHTML = EMOTION_LESSONS.map((l,i)=>buildCharCard(l,i,'emotion')).join('');
}
function renderLeaderGrid(){
  const el = document.getElementById('leaderGrid'); if(!el) return;
  el.innerHTML = LEADER_LESSONS.map((l,i)=>buildCharCard(l,i,'leader')).join('');
}

function buildCharCard(l, i, type){
  return `<div onclick="openCharLesson2('${type}',${i})" style="background:rgba(255,255,255,.03);border:1px solid ${l.color}20;border-left:4px solid ${l.color};border-radius:12px;padding:.8rem 1rem;cursor:pointer;transition:all .15s;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
    <div style="display:flex;align-items:center;gap:.5rem;">
      <span style="font-size:1.3rem;">${l.icon}</span>
      <div><div style="font-size:.88rem;font-weight:800;">${l.title}</div><div style="font-size:.68rem;color:var(--tx2);">${l.sub}</div></div>
    </div>
  </div>`;
}

function openCharLesson2(type, idx){
  const banks = {social:SOCIAL_LESSONS, emotion:EMOTION_LESSONS, leader:LEADER_LESSONS};
  const l = banks[type][idx]; if(!l) return;
  document.getElementById('charIcon').textContent = l.icon;
  document.getElementById('charTitle').textContent = l.title;
  document.getElementById('charSub').textContent = l.sub;
  document.getElementById('charBody').innerHTML = l.body;
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');
  logActivity('character', 'Read: '+l.title);
}

function initCharacter(){
  renderCharacterGrid();
  renderSocialGrid();
  renderEmotionGrid();
  renderLeaderGrid();
}

// Close tutorial on backdrop click
document.addEventListener('DOMContentLoaded', ()=>{
  const modal = document.getElementById('tutModal');
  if(modal) modal.addEventListener('click', e=>{ if(e.target===modal) closeTutorial(); });
});

// Keyboard nav for tutorial
document.addEventListener('keydown', e=>{
  if(!document.getElementById('tutModal')?.classList.contains('open')) return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown') tutNav(1);
  if(e.key==='ArrowLeft'||e.key==='ArrowUp') tutNav(-1);
  if(e.key==='Escape') closeTutorial();
});


// ══════════════════════════════════════════════════════════════
// CONFETTI SYSTEM
// ══════════════════════════════════════════════════════════════
(function(){
  const COLORS = ['#38bdf8','#818cf8','#f472b6','#34d399','#fbbf24','#fb923c','#a78bfa','#4ade80'];
  let _cfCanvas, _cfCtx, _cfParticles=[], _cfRunning=false, _cfRaf=null;

  function ensureCanvas(){
    if(_cfCanvas) return;
    _cfCanvas = document.createElement('canvas');
    _cfCanvas.id = 'confettiCanvas';
    Object.assign(_cfCanvas.style,{
      position:'fixed',top:'0',left:'0',width:'100%',height:'100%',
      pointerEvents:'none',zIndex:'99999'
    });
    document.body.appendChild(_cfCanvas);
    _cfCtx = _cfCanvas.getContext('2d');
  }

  function resize(){
    if(!_cfCanvas) return;
    _cfCanvas.width  = window.innerWidth;
    _cfCanvas.height = window.innerHeight;
  }

  window.launchConfetti = function(opts){
    opts = opts||{};
    const count   = opts.count   || 120;
    const origin  = opts.origin  || {x:.5, y:.4};
    const spread  = opts.spread  || 70;
    const decay   = opts.decay   || .93;
    const gravity = opts.gravity || .6;
    const scalar  = opts.scalar  || 1;

    ensureCanvas();
    resize();

    for(let i=0;i<count;i++){
      const angle = (Math.random()*spread - spread/2) * (Math.PI/180);
      const vel   = (Math.random()*18 + 8) * scalar;
      _cfParticles.push({
        x   : _cfCanvas.width  * origin.x,
        y   : _cfCanvas.height * origin.y,
        vx  : Math.cos(angle + Math.PI/2 * (Math.random()>.5?-1:1)) * vel * (Math.random()*.8+.6),
        vy  : Math.sin(angle - Math.PI/2) * vel * (Math.random()*.8+.6) - (Math.random()*4+2),
        color: COLORS[Math.floor(Math.random()*COLORS.length)],
        w   : (Math.random()*10+5) * scalar,
        h   : (Math.random()*5+3) * scalar,
        rot : Math.random()*360,
        rotV: (Math.random()-0.5)*8,
        decay,
        gravity,
        alpha: 1,
        shape: Math.random()>.4 ? 'rect' : 'circle'
      });
    }
    if(!_cfRunning){ _cfRunning=true; _cfLoop(); }
  };

  window.launchBigConfetti = function(){
    // Big burst — used for quiz pass / cert earn
    launchConfetti({count:200, origin:{x:.5,y:.5}, spread:120, scalar:1.2, decay:.91});
    setTimeout(()=>launchConfetti({count:80, origin:{x:.2,y:.6}, spread:60}), 200);
    setTimeout(()=>launchConfetti({count:80, origin:{x:.8,y:.6}, spread:60}), 350);
  };

  window.launchSideConfetti = function(){
    // Small side burst — used for single correct answer
    launchConfetti({count:40, origin:{x:.5,y:.6}, spread:50, scalar:.9, decay:.94});
  };

  function _cfLoop(){
    if(!_cfCanvas) return;
    _cfCtx.clearRect(0,0,_cfCanvas.width,_cfCanvas.height);
    _cfParticles = _cfParticles.filter(p=>{
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity * .1;
      p.vx *= p.decay;
      p.vy *= p.decay;
      p.rot+= p.rotV;
      p.alpha = Math.max(0, p.alpha - .012);
      if(p.alpha <= 0) return false;
      _cfCtx.save();
      _cfCtx.globalAlpha = p.alpha;
      _cfCtx.fillStyle = p.color;
      _cfCtx.translate(p.x, p.y);
      _cfCtx.rotate(p.rot * Math.PI/180);
      if(p.shape==='circle'){
        _cfCtx.beginPath();
        _cfCtx.arc(0,0,p.w/2,0,Math.PI*2);
        _cfCtx.fill();
      } else {
        _cfCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      }
      _cfCtx.restore();
      return true;
    });
    if(_cfParticles.length > 0){
      _cfRaf = requestAnimationFrame(_cfLoop);
    } else {
      _cfRunning = false;
      _cfCtx.clearRect(0,0,_cfCanvas.width,_cfCanvas.height);
    }
  }
  window.addEventListener('resize', resize);
})();

// ══════════════════════════════════════════════════════════════
// SESSION TIMER
// ══════════════════════════════════════════════════════════════
(function(){
  let _sessStart = null;
  let _sessActive = false;
  let _sessTotal  = 0;    // seconds accumulated this session
  let _sessInterval = null;
  let _lastActivity = Date.now();
  const IDLE_THRESHOLD = 60000; // 1 min idle = pause timer
  const TICK = 1000;

  function _tick(){
    const now = Date.now();
    if(now - _lastActivity > IDLE_THRESHOLD){
      // User is idle — pause accumulating
      return;
    }
    _sessTotal++;
    _updateDisplay();
    _autosaveSession();
  }

  function _updateDisplay(){
    const el = document.getElementById('sessionTimerDisplay');
    const elP = document.getElementById('phSessionTime');
    const str = _formatTime(_sessTotal);
    if(el)  el.textContent = str;
    if(elP) elP.textContent = str;
  }

  function _formatTime(secs){
    const h = Math.floor(secs/3600);
    const m = Math.floor((secs%3600)/60);
    const s = secs%60;
    if(h>0) return `${h}h ${m}m`;
    if(m>0) return `${m}m ${String(s).padStart(2,'0')}s`;
    return `${s}s`;
  }

  function _autosaveSession(){
    // Save to D every 30 seconds
    if(_sessTotal % 30 === 0){
      if(!D.sessionLog) D.sessionLog = [];
      const today = new Date().toLocaleDateString();
      const existing = D.sessionLog.find(e=>e.date===today);
      if(existing){
        existing.secs = (existing.secs||0) + 30;
      } else {
        D.sessionLog.push({date:today, secs:30});
      }
      // Keep last 30 days only
      if(D.sessionLog.length > 30) D.sessionLog = D.sessionLog.slice(-30);
      save();
    }
  }

  // Track any user activity
  ['click','keydown','touchstart','scroll','mousemove'].forEach(evt=>{
    document.addEventListener(evt, ()=>{ _lastActivity = Date.now(); }, {passive:true});
  });

  window.startSessionTimer = function(){
    if(_sessInterval) return; // already running
    _sessStart  = Date.now();
    _lastActivity = Date.now();
    _sessInterval = setInterval(_tick, TICK);
    _sessActive = true;
  };

  window.getSessionSeconds = function(){ return _sessTotal; };

  window.getSessionLog = function(){
    return (D.sessionLog||[]).slice().reverse(); // newest first
  };

  window.renderSessionLog = function(){
    const el = document.getElementById('phSessionLog');
    if(!el) return;
    const log = getSessionLog();
    if(!log.length){
      el.innerHTML = '<div style="color:var(--tx3);font-size:.75rem;text-align:center;padding:.5rem;">No sessions recorded yet.</div>';
      return;
    }
    el.innerHTML = log.slice(0,14).map(e=>{
      const mins = Math.round((e.secs||0)/60);
      const bar = Math.min(100, Math.round(mins/60*100));
      return `<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;">
        <span style="font-size:.7rem;color:var(--tx2);width:72px;flex-shrink:0;">${e.date}</span>
        <div style="flex:1;height:6px;background:rgba(255,255,255,.07);border-radius:10px;overflow:hidden;">
          <div style="height:100%;width:${bar}%;background:var(--c);border-radius:10px;transition:width .4s;"></div>
        </div>
        <span style="font-size:.72rem;font-weight:700;color:var(--tx);width:44px;text-align:right;">${mins<1?'<1':mins}m</span>
      </div>`;
    }).join('');
  };
})();


document.addEventListener('DOMContentLoaded', ()=>{
  // Show verse immediately before async operations
  renderVerse();
  init();

  // Auto-open signup mode if URL param present (?signup=contest)
  const _urlParams = new URLSearchParams(window.location.search);
  if(_urlParams.get('signup') === 'contest'){
    setTimeout(function(){
      authSwitchTab('signup');
      const contestRadio = document.querySelector('input[name="authPlan"][value="free_contest"]');
      if(contestRadio){ contestRadio.checked = true; }
    }, 300);
  }
});




// ═══════════════════════════════════════════════════════════
// CBT — COMPUTER BASED TRAINING
// ═══════════════════════════════════════════════════════════

// ── CBT Tab switcher ────────────────────────────────────────
function cbtTab(name, btn){
  ['typing','basics','windows','linux','coding','internet'].forEach(t=>{
    const el = document.getElementById('cbt-'+t);
    if(el) el.style.display = t===name ? 'block' : 'none';
  });
  document.querySelectorAll('.cbtTabs .tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  if(name==='typing') typingReset();
  if(name==='basics')   renderCbtLesson('basics');
  if(name==='windows')  renderCbtLesson('windows');
  if(name==='linux')    renderCbtLesson('linux');
  if(name==='coding')   renderCbtLesson('coding');
  if(name==='internet') renderCbtLesson('internet');
}

// ── TYPING ENGINE ───────────────────────────────────────────

const TYPING_PASSAGES = {
  easy:[
    "The sun sets over the hills. Birds fly home as the sky turns orange and pink.",
    "A dog runs fast through the green park. The children laugh and play all day long.",
    "She opens the book and reads each page slowly. The story is fun and easy to follow.",
    "Turn on the light. The room is now bright and ready for us to get to work.",
    "He eats an apple every day to stay healthy and strong. Good food is important.",
  ],
  medium:[
    "The keyboard is one of the most important tools for working with computers. Learning to type without looking at your fingers will save you hours every week.",
    "Computers process millions of instructions every second using tiny chips called processors. The speed of a processor is measured in gigahertz, or GHz.",
    "A strong password should be at least twelve characters long and include a mix of letters, numbers, and symbols. Never share your password with anyone.",
    "The internet connects billions of devices around the world using a system of rules called protocols. The most common is HTTP, which powers every website.",
    "When you save a file, the computer writes data to the hard drive or solid-state drive. SSDs are faster than HDDs because they have no moving parts.",
  ],
  hard:[
    "Object-oriented programming organizes code into reusable structures called classes. Each class defines properties and methods that its objects inherit, enabling developers to write modular, maintainable software.",
    "The Linux kernel was first released by Linus Torvalds in 1991. Today it powers Android phones, web servers, supercomputers, and embedded systems worldwide. Its open-source nature means anyone can study or modify the code.",
    "Cybersecurity threats include phishing, ransomware, SQL injection, and man-in-the-middle attacks. Defending against these requires a layered strategy combining firewalls, encryption, regular patching, and user education.",
    "A central processing unit executes the fetch-decode-execute cycle billions of times per second. Modern CPUs contain multiple cores and cache layers to reduce latency and maximize instruction throughput.",
    "Version control systems like Git allow developers to track changes, branch code, merge contributions, and roll back to previous states. Repositories can be hosted on platforms like GitHub or GitLab for collaboration.",
  ]
};

let _typingActive=false, _typingTimer=null, _typingSeconds=0;
let _typingPassage='', _typingStart=null;

function typingReset(){
  clearInterval(_typingTimer);
  _typingActive=false; _typingSeconds=0;
  const diff = (document.getElementById('typingDifficulty')||{}).value||'medium';
  const pool = TYPING_PASSAGES[diff];
  _typingPassage = pool[Math.floor(Math.random()*pool.length)];

  const inp = document.getElementById('typingInput');
  if(inp){ inp.value=''; inp.disabled=true; inp.style.borderColor='rgba(255,255,255,.12)'; }

  const btn = document.getElementById('typingStartBtn');
  if(btn){ btn.textContent='▶ Start Test'; btn.disabled=false; }

  document.getElementById('typingWpm').textContent='—';
  document.getElementById('typingAcc').textContent='—';
  document.getElementById('typingTime').textContent='0s';
  document.getElementById('typingErrors').textContent='0';
  document.getElementById('typingResult').style.display='none';

  renderTypingPassage('');
  renderTypingBests();
}

function renderTypingPassage(typed){
  const el = document.getElementById('typingPassage');
  if(!el) return;
  let html='';
  for(let i=0;i<_typingPassage.length;i++){
    const ch = _typingPassage[i];
    const disp = ch===' ' ? '&nbsp;' : ch;
    if(i < typed.length){
      if(typed[i]===ch) html+=`<span style="color:#86efac;">${disp}</span>`;
      else html+=`<span style="background:#7f1d1d;color:#fca5a5;border-radius:2px;">${disp}</span>`;
    } else if(i===typed.length){
      html+=`<span style="border-left:2px solid #38bdf8;color:#fff;">${disp}</span>`;
    } else {
      html+=`<span style="color:rgba(255,255,255,.35);">${disp}</span>`;
    }
  }
  el.innerHTML=html;
}

function typingStart(){
  const btn = document.getElementById('typingStartBtn');
  if(btn){ btn.textContent='Typing…'; btn.disabled=true; }
  const inp = document.getElementById('typingInput');
  if(inp){ inp.disabled=false; inp.focus(); inp.value=''; }
  _typingActive=true;
  _typingStart=null;
  _typingSeconds=0;
}

function typingOnInput(){
  if(!_typingActive) return;
  const inp = document.getElementById('typingInput');
  if(!inp) return;
  const typed = inp.value;

  if(!_typingStart){ _typingStart=Date.now(); startTypingTimer(); }

  renderTypingPassage(typed);

  // Count errors
  let errors=0;
  for(let i=0;i<typed.length;i++){ if(typed[i]!==_typingPassage[i]) errors++; }
  document.getElementById('typingErrors').textContent=errors;

  // Live WPM
  const elapsed = (Date.now()-_typingStart)/60000;
  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  if(elapsed>0) document.getElementById('typingWpm').textContent=Math.round(words/elapsed);

  // Accuracy
  const acc = typed.length>0 ? Math.round(((typed.length-errors)/typed.length)*100) : 100;
  document.getElementById('typingAcc').textContent=acc+'%';

  // Finished?
  if(typed.length >= _typingPassage.length){
    typingFinish(typed);
  }
}

function startTypingTimer(){
  clearInterval(_typingTimer);
  _typingTimer=setInterval(()=>{
    if(!_typingActive){clearInterval(_typingTimer);return;}
    _typingSeconds++;
    document.getElementById('typingTime').textContent=_typingSeconds+'s';
  },1000);
}

function typingFinish(typed){
  clearInterval(_typingTimer);
  _typingActive=false;

  const elapsed = (Date.now()-_typingStart)/60000;
  let errors=0;
  for(let i=0;i<_typingPassage.length;i++){ if((typed[i]||'')!==_typingPassage[i]) errors++; }
  const acc = Math.round(((_typingPassage.length-errors)/_typingPassage.length)*100);
  const words = _typingPassage.split(/\s+/).length;
  const wpm = Math.round(words/elapsed);

  document.getElementById('typingWpm').textContent=wpm;
  document.getElementById('typingAcc').textContent=acc+'%';
  document.getElementById('typingErrors').textContent=errors;

  const diff = (document.getElementById('typingDifficulty')||{}).value||'medium';
  const grade = acc>=98?'S':acc>=95?'A':acc>=88?'B':acc>=75?'C':'D';
  const gradeColor = {S:'#fde68a',A:'#86efac',B:'#7dd3fc',C:'#fb923c',D:'#f87171'}[grade];

  // Save personal best
  if(!D.cbtTypingBests) D.cbtTypingBests={};
  if(!D.cbtTypingBests[diff]||wpm>D.cbtTypingBests[diff].wpm){
    D.cbtTypingBests[diff]={wpm,acc,errors,secs:_typingSeconds,date:new Date().toLocaleDateString()};
    save();
    showToast('🏆 New personal best on '+diff+'!');
  }

  const inp = document.getElementById('typingInput');
  if(inp) inp.disabled=true;

  const res = document.getElementById('typingResult');
  if(res){
    res.style.display='block';
    res.innerHTML=`
      <div style="font-size:2rem;margin-bottom:.3rem;">${grade==='S'?'🏆':grade==='A'?'🎉':grade==='B'?'👍':'💪'}</div>
      <div style="font-size:1.4rem;font-weight:800;color:${gradeColor};">Grade ${grade}</div>
      <div style="font-size:.85rem;color:var(--tx2);margin-top:.3rem;">${wpm} WPM · ${acc}% accuracy · ${errors} errors · ${_typingSeconds}s</div>
      <div style="font-size:.72rem;color:var(--tx3);margin-top:.5rem;">${acc>=95?'Excellent work! Your accuracy is on point.':acc>=80?'Good effort. Focus on accuracy over speed.':'Slow down and prioritize hitting every key correctly.'}</div>
      <button class="btn bp" onclick="typingReset()" style="margin-top:.8rem;font-size:.8rem;">Try Again</button>
    `;
  }
  renderTypingBests();
}

function renderTypingBests(){
  const el = document.getElementById('typingBests');
  if(!el) return;
  const bests = D.cbtTypingBests||{};
  const diffs = ['easy','medium','hard'];
  el.innerHTML = diffs.map(d=>{
    const b = bests[d];
    return `<div class="fst" style="text-align:center;border-top:3px solid ${d==='easy'?'#86efac':d==='medium'?'#7dd3fc':'#c084fc'};">
      <div class="stat-lbl" style="text-transform:capitalize;">${d}</div>
      ${b ? `<div class="stat-val" style="font-size:1rem;">${b.wpm}<span style="font-size:.55rem;"> WPM</span></div>
      <div style="font-size:.6rem;color:var(--tx3);">${b.acc}% acc · ${b.date}</div>` :
      `<div style="font-size:.75rem;color:var(--tx3);margin-top:.3rem;">Not yet</div>`}
    </div>`;
  }).join('');
}

// ── CBT LESSON RENDERER ─────────────────────────────────────

const CBT_LESSONS = {
  basics:[
    {icon:'🖥️', title:'What is a Computer?', body:'A computer is an electronic device that takes in data (input), processes it, stores it, and produces output. The four core operations — input, processing, storage, output — apply to every device from a smartphone to a supercomputer.', quiz:[{q:'What are the four core computer operations?',a:'Input, Processing, Storage, Output'}]},
    {icon:'🔩', title:'Hardware vs Software', body:'<b>Hardware</b> is any physical component you can touch — the monitor, keyboard, mouse, CPU, RAM, and hard drive. <b>Software</b> is the programs and data that run on the hardware. The operating system bridges the two, managing hardware resources for your apps.', quiz:[{q:'Give two examples of hardware.',a:'CPU and RAM / Monitor and keyboard (any two physical components)'}]},
    {icon:'⚡', title:'The CPU — Brain of the Computer', body:'The Central Processing Unit executes instructions. Speed is measured in <b>GHz</b> (gigahertz) — the number of instruction cycles per second. Modern CPUs have multiple <b>cores</b> so they can work on several tasks at once. The more cores and higher the GHz, the faster the processor.', quiz:[{q:'What does GHz measure in a CPU?',a:'The number of instruction cycles per second (speed)'}]},
    {icon:'💾', title:'Storage: HDD vs SSD', body:'A <b>Hard Disk Drive (HDD)</b> uses spinning magnetic platters to store data — slower but cheaper per GB. A <b>Solid State Drive (SSD)</b> stores data on flash chips with no moving parts — much faster, more durable, and increasingly affordable. Most modern laptops use SSDs.', quiz:[{q:'Why is an SSD faster than an HDD?',a:'An SSD has no moving parts — it reads/writes data electronically, not mechanically'}]},
    {icon:'🧠', title:'RAM — Short Term Memory', body:'<b>RAM (Random Access Memory)</b> is your computer\'s workspace. When you open a program, it loads from storage into RAM so the CPU can access it instantly. More RAM = more programs open at once without slowing down. When you shut down, RAM is wiped — it is not permanent storage.', quiz:[{q:'What happens to data in RAM when you shut down?',a:'It is erased — RAM is volatile (temporary) memory'}]},
    {icon:'🖱️', title:'Input & Output Devices', body:'<b>Input devices</b> send data INTO the computer: keyboard, mouse, microphone, webcam, scanner. <b>Output devices</b> send data OUT: monitor, speakers, printer, projector. Some devices do both — a touchscreen is both input and output. Understanding I/O helps you troubleshoot problems.', quiz:[{q:'Is a printer an input or output device?',a:'Output — it sends data out of the computer'}]},
    {icon:'📁', title:'Files, Folders & File Systems', body:'A <b>file</b> is a named collection of data. A <b>folder</b> (directory) organizes files hierarchically. The <b>file system</b> (NTFS on Windows, ext4 on Linux, APFS on Mac) tracks where every file is stored on the drive. File extensions (.docx, .jpg, .mp3) tell the OS what program should open the file.', quiz:[{q:'What does a file extension tell the operating system?',a:'Which program should be used to open the file'}]},
    {icon:'🔌', title:'Ports & Connectivity', body:'Computers connect to devices through <b>ports</b>. Common ones: <b>USB-A</b> (keyboards, flash drives), <b>USB-C</b> (fast data + charging), <b>HDMI</b> (video to monitors/TVs), <b>Ethernet</b> (wired internet), <b>3.5mm audio jack</b> (headphones). Wireless options include Wi-Fi and Bluetooth.', quiz:[{q:'Which port would you use to connect a laptop to a monitor?',a:'HDMI (or DisplayPort / USB-C with adapter)'}]},
  ],
  windows:[
    {icon:'🪟', title:'The Desktop & Taskbar', body:'The <b>desktop</b> is your main workspace. The <b>taskbar</b> at the bottom shows open apps and the Start menu. The <b>system tray</b> (bottom right) shows notifications, Wi-Fi, volume, and the clock. You can right-click the desktop to change wallpaper or create new folders.', quiz:[{q:'What is the system tray?',a:'The bottom-right area of the taskbar showing notifications, Wi-Fi, clock, etc.'}]},
    {icon:'🔍', title:'Windows Search & Start Menu', body:'Press the <b>Windows key</b> or click Start to open the menu. Type any app, file, or setting to search instantly. Press <b>Win + S</b> to open search directly. This is the fastest way to launch apps — faster than hunting through folders.', quiz:[{q:'What keyboard shortcut opens Windows Search?',a:'Win + S'}]},
    {icon:'📂', title:'File Explorer', body:'<b>File Explorer</b> (Win + E) lets you navigate drives, folders, and files. Key locations: <b>Desktop</b>, <b>Documents</b>, <b>Downloads</b>, <b>This PC</b>. The address bar shows your current path. Right-click any file to Copy, Cut, Rename, Delete, or check Properties.', quiz:[{q:'What shortcut opens File Explorer?',a:'Win + E'}]},
    {icon:'⚙️', title:'Settings & Control Panel', body:'<b>Settings</b> (Win + I) is where you manage Wi-Fi, display, sound, accounts, privacy, and updates. The older <b>Control Panel</b> still exists for advanced tasks. Always check <b>Windows Update</b> regularly — updates fix security vulnerabilities and bugs.', quiz:[{q:'What shortcut opens Windows Settings?',a:'Win + I'}]},
    {icon:'🖥️', title:'Task Manager', body:'Press <b>Ctrl + Shift + Esc</b> to open Task Manager. You can see which apps are using the most CPU, RAM, and disk. If an app freezes, right-click it and choose <b>End Task</b>. The Startup tab shows programs that launch when Windows boots — disable ones you don\'t need.', quiz:[{q:'How do you force-close a frozen app in Task Manager?',a:'Right-click the app and choose End Task'}]},
    {icon:'⌨️', title:'Essential Windows Shortcuts', body:'<b>Win+D</b> — show desktop · <b>Win+L</b> — lock screen · <b>Alt+Tab</b> — switch apps · <b>Win+Tab</b> — task view · <b>Ctrl+Z</b> — undo · <b>Ctrl+Y</b> — redo · <b>Ctrl+C/X/V</b> — copy/cut/paste · <b>Win+←/→</b> — snap window left/right · <b>F2</b> — rename file · <b>Delete / Shift+Delete</b> — delete / permanently delete.', quiz:[{q:'What shortcut locks your Windows screen?',a:'Win + L'}]},
    {icon:'🔒', title:'User Accounts & Security', body:'Windows supports multiple user accounts with different permission levels. <b>Administrator</b> accounts can install software and change system settings. <b>Standard</b> accounts are safer for everyday use. Enable <b>Windows Hello</b> (face/fingerprint/PIN) for secure, fast login. Always set a strong password.', quiz:[{q:'Which account type should you use for everyday browsing?',a:'Standard account — it is safer than Administrator'}]},
    {icon:'🌐', title:'Networking & Wi-Fi', body:'Click the Wi-Fi icon in the system tray to connect to networks. Your computer gets an <b>IP address</b> from the router via DHCP. Press <b>Win + R → cmd → ipconfig</b> to see your IP address. Use <b>ping google.com</b> in Command Prompt to test internet connectivity.', quiz:[{q:'What command in cmd shows your IP address?',a:'ipconfig'}]},
  ],
  linux:[
    {icon:'🐧', title:'What is Linux?', body:'Linux is a free, open-source operating system kernel created by Linus Torvalds in 1991. It powers Android, 96% of the world\'s top web servers, the International Space Station, and most supercomputers. <b>Distributions</b> (distros) like Ubuntu, Fedora, and Debian package the kernel with tools and apps.', quiz:[{q:'What percentage of web servers run Linux?',a:'About 96%'}]},
    {icon:'📟', title:'The Terminal', body:'The <b>terminal</b> (shell) lets you control Linux by typing commands. The default shell is usually <b>bash</b>. The prompt shows <code>username@hostname:directory$</code>. Everything in Linux can be controlled from the terminal — which is why sysadmins and developers love it.', quiz:[{q:'What is the name of the default Linux shell?',a:'bash (Bourne Again Shell)'}]},
    {icon:'📁', title:'Linux File System', body:'Linux uses a single root <code>/</code> tree. Key directories: <code>/home</code> (user files), <code>/etc</code> (config files), <code>/bin</code> (essential commands), <code>/var</code> (logs, variable data), <code>/tmp</code> (temporary files), <code>/usr</code> (user programs). Everything is a file in Linux — even devices and processes.', quiz:[{q:'Where are user home directories stored in Linux?',a:'/home (e.g. /home/username)'}]},
    {icon:'⌨️', title:'Essential Terminal Commands', body:'<code>pwd</code> — print working directory · <code>ls</code> — list files · <code>cd folder</code> — change directory · <code>mkdir name</code> — make directory · <code>rm file</code> — remove file · <code>cp src dst</code> — copy · <code>mv src dst</code> — move/rename · <code>cat file</code> — view file · <code>man cmd</code> — manual/help · <code>clear</code> — clear terminal.', quiz:[{q:'What command displays the current directory path?',a:'pwd (print working directory)'}]},
    {icon:'🔐', title:'Permissions & sudo', body:'Every file has read (r), write (w), execute (x) permissions for <b>owner</b>, <b>group</b>, and <b>others</b>. Run <code>ls -l</code> to see them. Use <code>chmod 755 file</code> to change permissions. <b>sudo</b> (superuser do) lets you run commands as root (admin). Example: <code>sudo apt install firefox</code>.', quiz:[{q:'What does sudo mean?',a:'Superuser do — run a command with administrator (root) privileges'}]},
    {icon:'📦', title:'Package Managers', body:'Linux uses <b>package managers</b> to install software safely from official repositories. Ubuntu/Debian uses <b>apt</b>: <code>sudo apt update</code> (refresh list) and <code>sudo apt install packagename</code> (install). Fedora uses <b>dnf</b>. Arch uses <b>pacman</b>. No hunting sketchy websites for installers.', quiz:[{q:'What apt command refreshes the package list?',a:'sudo apt update'}]},
    {icon:'🔄', title:'Processes & System Info', body:'<code>top</code> or <code>htop</code> shows running processes and resource usage. <code>ps aux</code> lists all processes. <code>kill PID</code> stops a process. <code>df -h</code> shows disk usage. <code>free -h</code> shows RAM. <code>uname -a</code> shows kernel info. <code>uptime</code> shows how long the system has been running.', quiz:[{q:'What command shows disk space usage in human-readable format?',a:'df -h'}]},
    {icon:'📝', title:'Text Editors: nano & vim', body:'<b>nano</b> is beginner-friendly: <code>nano filename</code> to open, <code>Ctrl+O</code> to save, <code>Ctrl+X</code> to exit. <b>vim</b> is powerful but has a steep learning curve: press <code>i</code> to insert text, <code>Esc</code> to stop, <code>:wq</code> to save and quit, <code>:q!</code> to quit without saving.', quiz:[{q:'In vim, what do you type to save and quit?',a:':wq (colon, w, q, then Enter)'}]},
  ],
  coding:[
    {icon:'💡', title:'What is Programming?', body:'Programming is giving a computer a precise sequence of instructions to solve a problem. A <b>program</b> is written in a <b>programming language</b> — a formal grammar the computer can interpret. Computers cannot guess intent — every instruction must be exact and logical.', quiz:[{q:'Why must programming instructions be exact?',a:'Computers cannot guess intent — they follow instructions literally'}]},
    {icon:'🔢', title:'Variables & Data Types', body:'A <b>variable</b> is a named container for data. <b>Data types</b> define what kind of data: <b>integer</b> (whole number), <b>float</b> (decimal), <b>string</b> (text in quotes), <b>boolean</b> (true/false). Example in Python: <code>name = "Alex"</code> · <code>age = 16</code> · <code>gpa = 3.8</code> · <code>isParent = False</code>', quiz:[{q:'What data type stores true/false values?',a:'Boolean'}]},
    {icon:'🔀', title:'Conditionals: if / else', body:'Conditionals let programs make decisions. Syntax: <code>if condition: do this else: do that</code>. Example: <code>if age >= 18: print("Adult") else: print("Minor")</code>. You can chain with <code>elif</code> for multiple conditions. Every app you use runs thousands of conditionals every second.', quiz:[{q:'What keyword adds a second condition to an if statement?',a:'elif (else if)'}]},
    {icon:'🔁', title:'Loops: for & while', body:'Loops repeat code. A <b>for loop</b> runs a set number of times: <code>for i in range(5): print(i)</code> prints 0–4. A <b>while loop</b> runs as long as a condition is true: <code>while score < 100: score += 10</code>. Be careful of <b>infinite loops</b> — always ensure the condition eventually becomes false.', quiz:[{q:'What kind of loop runs as long as a condition is true?',a:'while loop'}]},
    {icon:'🧩', title:'Functions', body:'A <b>function</b> is a named, reusable block of code. Define with <code>def</code> in Python: <code>def greet(name): return "Hello " + name</code>. Call it: <code>greet("Alex")</code>. Functions take <b>parameters</b> as input and can <b>return</b> a value. Good functions do one thing well.', quiz:[{q:'What Python keyword defines a function?',a:'def'}]},
    {icon:'📋', title:'Lists & Dictionaries', body:'A <b>list</b> stores ordered items: <code>grades = [95, 87, 92]</code>. Access by index: <code>grades[0]</code> = 95. A <b>dictionary</b> stores key-value pairs: <code>student = {"name":"Alex", "gpa":3.8}</code>. Access by key: <code>student["name"]</code>. These are the two most important data structures for beginners.', quiz:[{q:'How do you access the first item in a Python list called items?',a:'items[0] — lists are zero-indexed'}]},
    {icon:'🐛', title:'Debugging & Errors', body:'Bugs are mistakes in code. Types: <b>Syntax errors</b> — bad grammar (missing colon, wrong indent). <b>Runtime errors</b> — crashes while running (dividing by zero). <b>Logic errors</b> — runs but gives wrong answer. Debugging steps: read the error message, isolate the problem, add print statements, Google the error, ask for help.', quiz:[{q:'What type of error produces a wrong answer but does not crash?',a:'Logic error'}]},
    {icon:'🌐', title:'How the Web Works', body:'A website is files (HTML, CSS, JavaScript) served by a <b>web server</b>. When you visit a URL, DNS converts it to an IP address, your browser sends an <b>HTTP request</b>, the server responds with files, and your browser renders them. <b>HTML</b> = structure · <b>CSS</b> = style · <b>JavaScript</b> = interactivity.', quiz:[{q:'What do HTML, CSS, and JavaScript each handle in a website?',a:'HTML=structure, CSS=style, JavaScript=interactivity'}]},
  ],
  internet:[
    {icon:'🌐', title:'How the Internet Works', body:'The internet is a global network of computers connected by physical cables, fiber optics, and wireless signals. Data travels in small packets that are routed across the network and reassembled at the destination. The <b>TCP/IP protocol suite</b> governs how data is formatted, addressed, and delivered.', quiz:[{q:'How is data broken up for travel across the internet?',a:'Into small packets that are routed and reassembled'}]},
    {icon:'🔗', title:'DNS — The Internet\'s Phone Book', body:'Every website has an <b>IP address</b> like 142.250.80.46. <b>DNS (Domain Name System)</b> translates human-readable names like google.com into IP addresses. Your browser queries a DNS server every time you type a URL. If DNS fails, websites appear unreachable even if the internet connection is fine.', quiz:[{q:'What does DNS stand for and what does it do?',a:'Domain Name System — converts domain names to IP addresses'}]},
    {icon:'🔒', title:'HTTPS & Encryption', body:'<b>HTTP</b> sends data in plain text — anyone on the network can read it. <b>HTTPS</b> encrypts the connection using <b>TLS</b>. Look for the padlock icon and "https://" in the address bar. Never enter passwords or payment info on HTTP sites. Encryption scrambles data so only the intended recipient can decode it.', quiz:[{q:'What is the difference between HTTP and HTTPS?',a:'HTTPS encrypts the connection using TLS; HTTP sends data in plain text'}]},
    {icon:'🎣', title:'Phishing & Social Engineering', body:'<b>Phishing</b> is a scam where attackers disguise themselves as trusted sources (banks, Apple, IRS) to steal credentials. Warning signs: urgent language, misspelled domains, unexpected attachments, requests for passwords. Always verify sender email addresses. When in doubt, go directly to the official website instead of clicking links.', quiz:[{q:'Name two warning signs of a phishing email.',a:'Urgent language, misspelled domain, unexpected attachment, request for password (any two)'}]},
    {icon:'🔑', title:'Strong Passwords & MFA', body:'A strong password is 12+ characters with mixed case, numbers, and symbols. Never reuse passwords across sites. Use a <b>password manager</b> (Bitwarden, 1Password) to generate and store unique passwords. Enable <b>MFA (Multi-Factor Authentication)</b> everywhere — it requires a second factor (app code, SMS) even if your password is stolen.', quiz:[{q:'What is MFA and why is it important?',a:'Multi-Factor Authentication — requires a second verification step so stolen passwords alone cannot grant access'}]},
    {icon:'🛡️', title:'Firewalls & Antivirus', body:'A <b>firewall</b> monitors incoming and outgoing network traffic and blocks suspicious connections. Windows has a built-in firewall — keep it on. <b>Antivirus</b> software scans files for known malware. Keep your OS and antivirus updated — most attacks exploit known vulnerabilities that patches already fix.', quiz:[{q:'What does a firewall do?',a:'Monitors and filters network traffic, blocking suspicious connections'}]},
    {icon:'🕵️', title:'Privacy & Digital Footprint', body:'Every website you visit, every search you make, and every app you use collects data. Your <b>digital footprint</b> includes browsing history, location data, purchase history, and social posts. Use a <b>VPN</b> on public Wi-Fi, review app permissions, use private browsing for sensitive searches, and regularly audit what accounts have access to your data.', quiz:[{q:'What is a digital footprint?',a:'The trail of data left by your online activity — browsing, searches, purchases, social posts'}]},
    {icon:'💀', title:'Malware Types', body:'<b>Virus</b> — attaches to files and spreads when opened. <b>Ransomware</b> — encrypts your files and demands payment. <b>Spyware</b> — secretly monitors activity. <b>Trojan</b> — disguises itself as legitimate software. <b>Worm</b> — self-replicates across networks without user action. Prevention: keep software updated, avoid suspicious downloads, use antivirus.', quiz:[{q:'What does ransomware do?',a:'Encrypts your files and demands payment (ransom) for the decryption key'}]},
  ]
};

function renderCbtLesson(module){
  const targetId = 'cbt'+module.charAt(0).toUpperCase()+module.slice(1)+'Content';
  const el = document.getElementById(targetId);
  if(!el) return;
  const lessons = CBT_LESSONS[module]||[];
  if(!D.cbtProgress) D.cbtProgress={};
  if(!D.cbtProgress[module]) D.cbtProgress[module]={};

  el.innerHTML = lessons.map((lesson,i)=>{
    const done = D.cbtProgress[module][i];
    return `<div style="border:1px solid ${done?'rgba(134,239,172,.2)':'rgba(255,255,255,.07)'};border-radius:12px;padding:1rem;margin-bottom:.7rem;background:${done?'rgba(134,239,172,.04)':'rgba(255,255,255,.02)'};">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
        <span style="font-size:1.3rem;">${lesson.icon}</span>
        <div style="flex:1;">
          <div style="font-size:.8rem;font-weight:700;color:${done?'#86efac':'var(--tx)'};">${lesson.title}</div>
          <div style="font-size:.6rem;color:var(--tx3);">Lesson ${i+1} of ${lessons.length}</div>
        </div>
        <div style="font-size:1rem;">${done?'✅':'⭕'}</div>
      </div>
      <div style="font-size:.75rem;color:var(--tx2);line-height:1.7;margin-bottom:.7rem;">${lesson.body}</div>
      ${lesson.quiz.map((q,qi)=>`
        <div style="background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.12);border-radius:8px;padding:.6rem .8rem;margin-bottom:.4rem;">
          <div style="font-size:.7rem;font-weight:700;color:#7dd3fc;margin-bottom:.3rem;">📝 Quick Check: ${q.q}</div>
          <details style="font-size:.7rem;color:var(--tx2);">
            <summary style="cursor:pointer;color:var(--tx3);font-size:.65rem;">Reveal Answer</summary>
            <div style="margin-top:.3rem;color:#86efac;font-weight:600;">${q.a}</div>
          </details>
        </div>`).join('')}
      <button onclick="cbtMarkDone('${module}',${i},this)" class="btn ${done?'':'bp'}" style="font-size:.65rem;margin-top:.3rem;${done?'background:rgba(134,239,172,.1);color:#86efac;border-color:rgba(134,239,172,.2);':''}">
        ${done?'✅ Completed':'Mark Complete'}
      </button>
    </div>`;
  }).join('');
  renderCbtProgress(module);
}

function cbtMarkDone(module, idx, btn){
  if(!D.cbtProgress) D.cbtProgress={};
  if(!D.cbtProgress[module]) D.cbtProgress[module]={};
  D.cbtProgress[module][idx] = !D.cbtProgress[module][idx];
  save();
  renderCbtLesson(module);
}

function renderCbtProgress(module){
  const lessons = CBT_LESSONS[module]||[];
  const done = Object.values((D.cbtProgress||{})[module]||{}).filter(Boolean).length;
  const pct = lessons.length ? Math.round((done/lessons.length)*100) : 0;
  // Update section header if progress bar exists
  const pb = document.getElementById('cbtProgress_'+module);
  if(pb) pb.style.width=pct+'%';
}


// ═══════════════════════════════════════════════════
//  USER PROFILE SYSTEM
// ═══════════════════════════════════════════════════

let _pmSex = '', _pmAge = '', _pmEdu = '', _pmParent = false;

function openProfile(){
  const p = D.profile || {};
  _pmSex    = p.sex        || '';
  _pmAge    = p.age        || '';
  _pmEdu    = p.education  || '';
  _pmParent = p.parentMode || false;

  document.getElementById('pmName').value         = D.name || '';
  document.getElementById('pmParentName').value   = p.parentName || '';

  // Refresh button states
  ['M','F','O'].forEach(s => document.getElementById('pmSex'+s)?.classList.toggle('active', _pmSex===s));
  ['under13','13-15','16-17','18-22','23-29','30plus'].forEach(a =>
    document.getElementById('pmAge-'+a)?.classList.toggle('active', _pmAge===a));
  ['middle','high','college','trade','working','other'].forEach(e =>
    document.getElementById('pmEdu-'+e)?.classList.toggle('active', _pmEdu===e));

  const sw = document.getElementById('pmParentSwitch');
  if(sw) sw.classList.toggle('on', _pmParent);
  const pf = document.getElementById('pmParentFields');
  if(pf) pf.classList.toggle('open', _pmParent);

  // Update modal header display
  refreshPmHeader();
  openModal('profileModal');
}

function setPmSex(s){
  _pmSex = s;
  ['M','F','O'].forEach(x => document.getElementById('pmSex'+x)?.classList.toggle('active', x===s));
}

function setPmAge(a){
  _pmAge = a;
  ['under13','13-15','16-17','18-22','23-29','30plus'].forEach(x =>
    document.getElementById('pmAge-'+x)?.classList.toggle('active', x===a));
}

function setPmEdu(e){
  _pmEdu = e;
  ['middle','high','college','trade','working','other'].forEach(x =>
    document.getElementById('pmEdu-'+x)?.classList.toggle('active', x===e));
}

function toggleParentMode(){
  _pmParent = !_pmParent;
  document.getElementById('pmParentSwitch')?.classList.toggle('on', _pmParent);
  document.getElementById('pmParentFields')?.classList.toggle('open', _pmParent);
}

function refreshPmHeader(){
  const name = (document.getElementById('pmName')?.value || D.name || '').trim();
  const avatarEl = document.getElementById('pmAvatarLarge');
  const nameEl   = document.getElementById('pmNameDisplay');
  const subEl    = document.getElementById('pmSubDisplay');
  const badgeEl  = document.getElementById('pmBadgeRow');

  const initial = name ? name[0].toUpperCase() : '?';
  if(avatarEl){
    avatarEl.textContent = initial;
    avatarEl.className = 'pm-avatar-large' + (_pmParent ? ' parent' : '');
  }
  if(nameEl) nameEl.textContent = name || 'Set Up Your Profile';
  if(subEl){
    if(_pmParent){
      const pName = document.getElementById('pmParentName')?.value || '';
      subEl.textContent = pName ? `Parent account — ${pName}` : 'Parent / Guardian account';
    } else {
      const ageLabel = {under13:'Under 13',['13-15']:'13–15',['16-17']:'16–17',['18-22']:'18–22',['23-29']:'23–29','30plus':'30+'}[_pmAge] || '';
      subEl.textContent = ageLabel ? `Age ${ageLabel}` : 'Personalize your Life OS';
    }
  }
  // Badges
  if(badgeEl){
    const badges = [];
    if(_pmSex === 'M') badges.push({t:'♂ Male', hi:true});
    if(_pmSex === 'F') badges.push({t:'♀ Female', hi:true});
    if(_pmAge) badges.push({t: {under13:'Under 13','13-15':'13–15','16-17':'16–17','18-22':'18–22','23-29':'23–29','30plus':'30+'}[_pmAge]||_pmAge, hi:false});
    if(_pmEdu) badges.push({t: {middle:'Middle School',high:'High School',college:'College',trade:'Trade School',working:'Working',other:'Other'}[_pmEdu]||_pmEdu, hi:false});
    if(_pmParent) badges.push({t:'👨‍👧 Parent Mode', hi:true});
    badgeEl.innerHTML = badges.map(b=>
      `<span class="pm-badge${b.hi?' highlighted':''}">${b.t}</span>`
    ).join('');
  }
}

function saveProfile(){
  const name = (document.getElementById('pmName')?.value || '').trim();
  if(!name){ showToast('Please enter a name'); return; }

  D.name = name;
  if(!D.profile) D.profile = {};
  D.profile.sex        = _pmSex;
  D.profile.age        = _pmAge;
  D.profile.education  = _pmEdu;
  D.profile.parentMode = _pmParent;
  D.profile.parentName = (document.getElementById('pmParentName')?.value || '').trim();

  save();
  applyProfileContext();
  renderGreeting();
  updateProfileButton();
  closeModal('profileModal');
  showToast('Profile saved ✓');
}

// Apply age/profile context to the app
function applyProfileContext(){
  const p = D.profile || {};
  const age = p.age || '';

  // Show/hide "Growing Up" section based on age
  const isYoung = ['under13','13-15','16-17'].includes(age);
  const navEl = document.getElementById('ni-s-growing');
  if(navEl) navEl.style.display = isYoung ? '' : '';  // always show for now

  // If parent mode, show parent indicator in header
  const headerEl = document.getElementById('profileBtn');
  if(headerEl && p.parentMode){
    headerEl.title = `Parent mode — managing for ${D.name}`;
  }
}

function updateProfileButton(){
  const btn = document.getElementById('profileBtn');
  if(!btn) return;
  const p    = D.profile || {};
  const name = D.name || '';
  const initial = name ? name[0].toUpperCase() : '👤';
  const isParent = p.parentMode;
  btn.innerHTML = `
    <div class="profile-avatar${isParent?' parent':''}">${initial}</div>
    <span style="max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name || 'Profile'}</span>
  `;
}

// Context-aware greeting based on profile
function getProfileGreeting(){
  const p   = D.profile || {};
  const age = p.age || '';
  const hr  = new Date().getHours();
  const tod = hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : 'evening';
  const name = D.name || '';

  if(p.parentMode && p.parentName){
    return `Good ${tod}, ${p.parentName} 👋`;
  }

  const ageGreetings = {
    'under13': `Hey ${name}! 👋`,
    '13-15':   `What's up, ${name}! 🤙`,
    '16-17':   `Good ${tod}, ${name}`,
    '18-22':   `Good ${tod}, ${name}`,
    '23-29':   `Good ${tod}, ${name}`,
    '30plus':  `Good ${tod}, ${name}`,
  };
  return (age && ageGreetings[age]) ? ageGreetings[age] : `Good ${tod}${name ? ', '+name : ''}`;
}



// ═══════════════════════════════════════════════════
//  GROWING UP — topics data + render
// ═══════════════════════════════════════════════════

const GROWING_TOPICS = [
  {
    id:'puberty-male',
    icon:'💪',
    title:'Puberty — For Guys',
    sub:'What\'s happening to your body',
    color:'#60a5fa',
    showFor:['M','O',''],
    body:`
<p><strong>Puberty is normal. Every guy goes through it — and it usually starts between ages 9 and 14.</strong> Your body is going through one of the biggest changes of your entire life, driven almost entirely by one thing: testosterone. Here's what's happening and why.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What's changing and why</h4>
<ul>
  <li><strong>Height and muscle growth:</strong> Growth hormone surges. You may grow 3–4 inches in a single year during your peak growth spurt. Muscles become more defined as testosterone increases muscle protein synthesis.</li>
  <li><strong>Voice changes:</strong> Your larynx (voice box) grows — the same testosterone causing your muscles to develop is enlarging it. Your voice will crack and deepen over 1–2 years. This is temporary and normal.</li>
  <li><strong>Body hair:</strong> Hair grows in new places — face, underarms, chest, legs, pubic area. This is testosterone doing its job. Shaving is entirely your choice.</li>
  <li><strong>Skin and sweat:</strong> Sweat glands become more active and produce stronger-smelling sweat. Sebaceous (oil) glands enlarge, which is why acne is common. Showering daily and using deodorant matters now in a way it didn't before.</li>
  <li><strong>Genital development:</strong> The penis and testicles grow larger over several years. This is entirely normal and varies significantly between individuals.</li>
  <li><strong>Erections and ejaculation:</strong> Erections can happen randomly and unexpectedly — this is normal and not something you can always control. Nocturnal emissions (wet dreams) are normal — your body's natural response to hormonal changes.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Emotions during puberty</h4>
<p>Testosterone doesn't just affect your body — it significantly affects your brain. You may experience:</p>
<ul>
  <li>More intense emotions than before — things feel bigger</li>
  <li>Increased frustration or anger that seems out of proportion</li>
  <li>Strong attraction to others for the first time</li>
  <li>Mood swings — feeling great one hour, low the next</li>
</ul>
<p>This is biology. Your brain is being flooded with hormones it's never experienced at these levels. It doesn't make your emotions less real — but knowing the source helps you not be confused or scared by them.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What to actually do</h4>
<ul>
  <li>Shower daily — you sweat more and it smells different now</li>
  <li>Use deodorant every morning</li>
  <li>If acne is severe, see a doctor — it's treatable and you don't have to just live with it</li>
  <li>Talk to a trusted adult if something seems very different from what's described here</li>
  <li>Compare yourself to yourself, not other guys — puberty timing is highly individual</li>
</ul>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.2);">
  <strong style="color:#60a5fa;">Remember:</strong> Puberty is not a flaw. It's your body becoming what it's designed to be. Every uncomfortable thing happening right now has a biological reason and a finish line.
</div>
    `
  },
  {
    id:'puberty-female',
    icon:'🌸',
    title:'Puberty — For Girls',
    sub:'What\'s happening to your body',
    color:'#f472b6',
    showFor:['F','O',''],
    body:`
<p><strong>Puberty typically starts between ages 8 and 13 for girls</strong> — earlier than for boys — and is driven primarily by estrogen and progesterone. Here's exactly what's happening and why.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What's changing and why</h4>
<ul>
  <li><strong>Breast development:</strong> Usually the first visible change. Begins with breast buds — small raised areas around the nipple. Can be tender. Full development takes 2–5 years. Asymmetry (one side growing faster) is completely normal.</li>
  <li><strong>Body shape changes:</strong> Hips widen, waist becomes more defined — estrogen drives fat distribution to hips, thighs, and buttocks. This is your body preparing for its adult form, not something to fight.</li>
  <li><strong>Body hair:</strong> Hair grows in the pubic area and underarms. Leg hair becomes more noticeable. What you do with it is entirely your choice.</li>
  <li><strong>Skin and sweat:</strong> Oil glands become more active — the source of acne for many. Sweat glands become more active and produce stronger-smelling sweat. Daily showering and deodorant matter now.</li>
  <li><strong>Height growth:</strong> Girls typically have their growth spurt earlier than boys — often 1–2 years before starting their period.</li>
  <li><strong>Menstruation (your period):</strong> Usually starts 2–3 years after breast development begins. A period is the monthly shedding of the uterine lining. It typically lasts 3–7 days. Cycles vary — 21–35 days is considered normal. Cramping, bloating, and mood changes around your period are caused by prostaglandins and hormonal fluctuations. If periods are extremely painful or very irregular, see a doctor — conditions like endometriosis are real and treatable.</li>
  <li><strong>Vaginal discharge:</strong> Begins 6–12 months before the first period — this is normal and is the vagina's self-cleaning mechanism. Clear or white with no foul odor is normal.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Emotions during puberty</h4>
<p>Estrogen and progesterone fluctuate significantly throughout the monthly cycle, which directly affects mood, energy, and emotional sensitivity. This is biology, not weakness:</p>
<ul>
  <li>Increased emotional intensity overall</li>
  <li>PMS (premenstrual syndrome) — mood changes, irritability, or sadness in the days before your period. Caused by progesterone drop. Real, not "in your head."</li>
  <li>Strong attraction to others — this is estrogen and social brain development working together</li>
  <li>More acute awareness of social dynamics and relationships</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Practical things to know</h4>
<ul>
  <li>Keep pads or tampons in your bag before your period starts regularly</li>
  <li>Period tracking apps (Clue, Flo) help predict your cycle and understand your patterns</li>
  <li>Severe cramps, very heavy periods (soaking a pad/tampon every hour), or periods lasting more than 7 days deserve a doctor visit — these are treatable</li>
  <li>No two bodies develop on the same timeline — comparison to peers is genuinely unhelpful</li>
</ul>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(244,114,182,.08);border:1px solid rgba(244,114,182,.2);">
  <strong style="color:#f472b6;">Your body is not wrong.</strong> Every change has a biological purpose. The discomfort of puberty is real — and temporary. Your adult body is worth the awkward in-between.
</div>
    `
  },
  {
    id:'emotions',
    icon:'🧠',
    title:'Your Emotions Are Real',
    sub:'Understanding what you feel and why',
    color:'#a78bfa',
    showFor:['M','F','O',''],
    body:`
<p>Emotions are not weakness. They are biological signals — your brain's way of responding to your environment, relationships, and experiences. Understanding them gives you power over them. Suppressing them without processing them creates problems that show up later.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What emotions actually are</h4>
<p>An emotion is a rapid cascade of physical and mental responses triggered by your brain's interpretation of a situation. The amygdala (your brain's alarm system) fires first — before the rational prefrontal cortex even knows what's happening. This is why emotions feel automatic: because they are.</p>
<ul>
  <li><strong>Fear:</strong> Signals potential danger. Triggers fight-or-flight. Appropriate response to real danger; anxiety disorder when it fires without real threat.</li>
  <li><strong>Anger:</strong> Signals perceived injustice or threat. Motivates boundary-setting. Becomes destructive when it drives behavior before the rational brain engages.</li>
  <li><strong>Sadness:</strong> Signals loss or disappointment. Creates space for processing and healing. Not something to immediately fix — something to move through.</li>
  <li><strong>Shame:</strong> "I am bad" — distinct from guilt ("I did something bad"). Shame attacks identity; guilt addresses behavior. Chronic shame is profoundly destructive to mental health.</li>
  <li><strong>Loneliness:</strong> Signals a social need. Not a character flaw — as biologically real as hunger. The appropriate response is connection, not self-criticism.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What to do with big emotions</h4>
<ul>
  <li><strong>Name them first:</strong> "I feel angry" is different from acting from anger. Naming an emotion activates the prefrontal cortex and literally reduces amygdala activation — neuroscience calls this "name it to tame it."</li>
  <li><strong>Feel them without acting on them immediately:</strong> You can feel furious and still choose not to send the text, say the thing, or make the decision right now.</li>
  <li><strong>Find physical outlets:</strong> Exercise, walking, cold water, deep breathing — these discharge stress hormones physically. The emotion is stored in the body as much as the mind.</li>
  <li><strong>Talk to someone:</strong> Trusted friend, parent, counselor. Verbalizing an experience processes it differently than just thinking it. Social support is the #1 predictor of resilience.</li>
  <li><strong>Journal:</strong> Writing about experiences activates the narrative part of the brain, which integrates emotional experience more effectively than pure feeling.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Emotions and faith</h4>
<p>The Psalms contain 150 poems covering every human emotion — grief, rage, fear, despair, joy, gratitude — expressed directly and honestly to God. Lament (honest expression of suffering) is a fully biblical category. You don't have to perform emotional health for God. He already knows what you feel. Bring the real thing.</p>
<p>Psalm 34:18: "The Lord is close to the brokenhearted and saves those who are crushed in spirit."</p>
    `
  },
  {
    id:'depression',
    icon:'🌧️',
    title:'Depression — What It Is and What To Do',
    sub:'More than just feeling sad',
    color:'#94a3b8',
    showFor:['M','F','O',''],
    body:`
<p><strong>Depression is not a character flaw, weakness, or spiritual failure. It is a real medical condition with measurable changes in brain chemistry that responds to real treatment.</strong> It affects 1 in 5 people. Understanding it removes the stigma and makes it possible to get help.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What depression actually feels like</h4>
<p>Depression isn't just sadness. It can look like:</p>
<ul>
  <li>Persistent low mood most of the day, nearly every day for 2+ weeks</li>
  <li><strong>Anhedonia</strong> — the inability to feel pleasure in things that used to bring it. Music sounds flat. Food tastes like nothing. Activities feel pointless. This is the hallmark symptom.</li>
  <li>Exhaustion even after sleeping — fatigue that rest doesn't fix</li>
  <li>Difficulty concentrating, making decisions, or remembering things</li>
  <li>Changes in sleep — sleeping much more, or unable to sleep despite exhaustion</li>
  <li>Changes in appetite — not hungry at all, or eating compulsively</li>
  <li>Physical pain — depression often manifests as headaches, stomachaches, or unexplained pain</li>
  <li>Feeling worthless, hopeless, or like a burden to others</li>
  <li>Withdrawing from people, skipping school or work, letting things go</li>
  <li>Thoughts that life isn't worth living</li>
</ul>
<p>In teens especially, depression can look like <strong>irritability, anger, and acting out</strong> rather than visible sadness — which is why it's often missed or misread as a behavior problem.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What causes it</h4>
<p>Depression has multiple contributing factors — not one single cause:</p>
<ul>
  <li><strong>Brain chemistry:</strong> Dysregulation of serotonin, dopamine, and norepinephrine systems — real, measurable biological changes</li>
  <li><strong>Genetics:</strong> Family history of depression increases risk 2–3x</li>
  <li><strong>Life events:</strong> Loss, trauma, abuse, chronic stress, major transitions can trigger or worsen depression</li>
  <li><strong>Hormones:</strong> Puberty, postpartum, thyroid dysfunction all affect mood regulation</li>
  <li><strong>Isolation:</strong> Humans need connection — prolonged loneliness reliably worsens depression</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What actually helps</h4>
<ul>
  <li><strong>Tell someone:</strong> A parent, school counselor, doctor, trusted adult. Depression rarely resolves without external support.</li>
  <li><strong>Therapy:</strong> Cognitive Behavioral Therapy (CBT) is the most evidence-backed treatment for depression — as effective as medication for mild-moderate cases, and more durable long-term</li>
  <li><strong>Medication:</strong> SSRIs/SNRIs prescribed by a doctor help regulate brain chemistry. Often used with therapy. Finding the right one may take 2–3 tries — that's normal and worth doing</li>
  <li><strong>Exercise:</strong> 30 minutes of aerobic exercise 3–5x/week produces antidepressant effects comparable to medication in multiple studies. Hard to start when depressed — but one of the most powerful interventions available</li>
  <li><strong>Sleep:</strong> Depression disrupts sleep; poor sleep worsens depression. Stabilizing sleep (same wake time daily) is foundational</li>
  <li><strong>Social connection:</strong> Even when every instinct says to isolate — small doses of being with safe people genuinely helps</li>
</ul>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(148,163,184,.08);border:1px solid rgba(148,163,184,.2);">
  <strong style="color:#94a3b8;">The most important thing:</strong> Depression lies to you. It tells you it will always be this way, that nothing will help, that you're not worth helping. These are symptoms of the illness, not truth. Treatment works — and you deserve it.
</div>
    `
  },
  {
    id:'suicide',
    icon:'🆘',
    title:'Suicidal Thoughts — What To Do',
    sub:'Crisis resources and honest conversation',
    color:'#ef4444',
    showFor:['M','F','O',''],
    body:`
<div style="padding:.85rem 1rem;border-radius:11px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);margin-bottom:1rem;">
  <div style="font-weight:900;color:#f87171;margin-bottom:.4rem;">If you are in crisis right now:</div>
  <div style="margin-bottom:.6rem;font-size:.85rem;">
    📞 <strong>Call or text 988</strong> — Suicide & Crisis Lifeline (24/7, free, confidential)<br>
    💬 <strong>Text HOME to 741741</strong> — Crisis Text Line (24/7, free, confidential)<br>
    🚨 <strong>Call 911</strong> or go to your nearest emergency room if you are in immediate danger
  </div>
  <div style="font-size:.8rem;color:var(--tx2);">You don't have to be "suicidal enough" to call. If you're struggling, that's enough reason.</div>
</div>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What suicidal thoughts actually are</h4>
<p>Suicidal thoughts — from passive ("I wish I didn't exist") to active ("I'm thinking about how I would do it") — are <strong>symptoms of unbearable pain, not logical conclusions</strong>. The part of the brain experiencing these thoughts is in crisis. Crisis states are temporary. Death is permanent. The goal is to survive the crisis until the pain becomes bearable — which it does, with help.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Types of suicidal thoughts</h4>
<ul>
  <li><strong>Passive ideation:</strong> "I wish I were dead" or "I wouldn't care if I didn't wake up." Very common in depression. Should still be taken seriously and shared with someone.</li>
  <li><strong>Active ideation without a plan:</strong> Thinking about suicide as a possibility but without a specific plan. Requires immediate support from a professional or trusted adult.</li>
  <li><strong>Active ideation with a plan:</strong> Thinking about suicide with a specific method in mind. This is a crisis — get help immediately. Call 988 or go to an ER.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Warning signs in yourself or someone else</h4>
<ul>
  <li>Talking or writing about wanting to die, being a burden, or having no reason to live</li>
  <li>Giving away meaningful possessions</li>
  <li>Saying goodbye in a way that feels final</li>
  <li>Sudden calmness after a period of severe depression (can signal a decision has been made)</li>
  <li>Researching methods</li>
  <li>Increasing isolation, reckless behavior, substance use</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What to do if someone tells you</h4>
<p>If a friend or family member tells you they're thinking about suicide:</p>
<ul>
  <li><strong>Take it seriously</strong> — never say "you don't really mean that" or try to minimize it</li>
  <li><strong>Stay with them</strong> — don't leave them alone</li>
  <li><strong>Ask directly:</strong> "Are you thinking about suicide?" — asking does not plant the idea, it opens the door for honest conversation</li>
  <li><strong>Get help together</strong> — call 988, go with them to an ER, call a parent or trusted adult. You are not equipped to be their only support and you don't have to be.</li>
  <li><strong>Remove access to means</strong> if possible — especially firearms and large quantities of medications</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">A word about faith</h4>
<p>Many people in crisis feel shame about suicidal thoughts in a faith context. The truth: Scripture is full of people who wanted to die — Elijah (1 Kings 19), Jonah (Jonah 4), Job — who expressed it to God directly and were met with compassion, not condemnation. God is not shocked by your pain. The church at its best is a community that sits with suffering rather than explaining it away. If you've been given shame instead of care, that was a failure of the people — not of God.</p>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);">
  <strong style="color:#f87171;">Your pain is real. Your life has value. This feeling is not permanent.</strong><br>
  <span style="font-size:.82rem;">988 · Text HOME to 741741 · Emergency: 911</span>
</div>
    `
  },
  {
    id:'anxiety-teen',
    icon:'⚡',
    title:'Anxiety — When Worry Takes Over',
    sub:'Understanding and managing anxious feelings',
    color:'#fbbf24',
    showFor:['M','F','O',''],
    body:`
<p>Anxiety is the most common mental health experience in young people. It's your brain's threat-detection system doing its job — just sometimes doing it when there's no actual threat. Understanding what's happening in your body makes it far less frightening.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What anxiety feels like physically</h4>
<p>When your amygdala (brain's alarm) fires, it triggers a cascade:</p>
<ul>
  <li>Adrenaline releases into your bloodstream within seconds</li>
  <li>Heart rate increases — you feel it pounding</li>
  <li>Breathing quickens — can cause lightheadedness or tingling</li>
  <li>Muscles tighten — shoulders, jaw, chest, stomach</li>
  <li>Stomach gets butterflies or nausea — blood redirected from digestion</li>
  <li>Mind races — the brain is scanning for the threat</li>
</ul>
<p>During a panic attack, these sensations intensify rapidly. Panic attacks are not dangerous — they peak within 10 minutes and cannot cause you to stop breathing or lose your mind, even though they feel that way. Knowing this doesn't make them pleasant but makes them survivable.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Common anxiety triggers for young people</h4>
<ul>
  <li>Social situations — fear of judgment, embarrassment, rejection</li>
  <li>Academic pressure — grades, tests, college applications</li>
  <li>Family conflict or instability</li>
  <li>Social media — social comparison, FOMO, cyberbullying</li>
  <li>Uncertainty about the future</li>
  <li>Physical sensations themselves (health anxiety — worrying about being sick)</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What actually helps in the moment</h4>
<ul>
  <li><strong>4-7-8 breathing:</strong> Inhale 4 counts, hold 7 counts, exhale 8 counts. The extended exhale activates the parasympathetic nervous system — the biological brake on anxiety. Do it 4 times.</li>
  <li><strong>5-4-3-2-1 grounding:</strong> Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Forces your brain out of threat-mode and into the present moment.</li>
  <li><strong>Cold water:</strong> Splashing cold water on your face activates the diving reflex — slows heart rate within seconds.</li>
  <li><strong>Move your body:</strong> Walking or any physical activity burns off adrenaline, which is what the body is trying to do anyway.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">When to get help</h4>
<p>If anxiety is:</p>
<ul>
  <li>Happening most days</li>
  <li>Making you avoid school, activities, or people</li>
  <li>Causing panic attacks regularly</li>
  <li>Significantly affecting your sleep or ability to function</li>
</ul>
<p>...talk to a parent, counselor, or doctor. CBT (Cognitive Behavioral Therapy) and sometimes medication are highly effective treatments. You don't have to manage this alone.</p>
    `
  },
  {
    id:'social-pressure',
    icon:'👥',
    title:'Social Pressure and Identity',
    sub:'Staying yourself when the world pushes back',
    color:'#34d399',
    showFor:['M','F','O',''],
    body:`
<p>The teenage and young adult years are when identity is formed — psychologist Erik Erikson called this the central developmental task of adolescence. You're figuring out who you are while being surrounded by people who want to tell you who to be. This is hard. Here's a framework for navigating it.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Why peer pressure is so powerful at this age</h4>
<p>This isn't a character weakness — it's neuroscience. The adolescent brain is undergoing a massive rewiring with two important features:</p>
<ul>
  <li><strong>Heightened social sensitivity:</strong> Social acceptance and rejection activate the same brain regions as physical pain — more intensely in adolescence than at any other life stage. Social threat feels physically threatening because, to your brain, it is.</li>
  <li><strong>Reward-sensitivity:</strong> The dopamine system is highly active but the prefrontal cortex (which evaluates long-term consequences) isn't fully developed until age 25. This is why peer-influenced decisions often feel compelling in the moment and questionable in retrospect.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Types of pressure you'll face</h4>
<ul>
  <li><strong>Substance pressure:</strong> Alcohol, marijuana, vaping, other substances. The younger you start, the higher the risk of dependency — adolescent brains are significantly more vulnerable to addiction than adult brains.</li>
  <li><strong>Sexual pressure:</strong> To do things you're not ready for, to send images, to compromise your values. "If you loved me" is manipulation, not love.</li>
  <li><strong>Social identity pressure:</strong> To define yourself by group membership — to be what your friend group, school, or social media audience wants you to be rather than who you actually are.</li>
  <li><strong>Achievement pressure:</strong> To appear to have it together, to perform success and happiness, to never show struggle</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">How to hold your own identity</h4>
<ul>
  <li><strong>Know your values in advance:</strong> Decisions made under social pressure are harder when you haven't already thought through where you stand. Write down your values when you're calm. Know your lines before you're in the moment.</li>
  <li><strong>Choose friends who make integrity easier:</strong> You will naturally drift toward the norms of your closest friends. This is one of the most important decisions you can make.</li>
  <li><strong>Practice saying no in low-stakes situations:</strong> Every time you make a small choice based on your own values rather than social expectation, you build the capacity for larger ones.</li>
  <li><strong>Faith as anchor:</strong> Knowing who you are in God — loved, seen, purposely made — provides an identity that doesn't depend on social acceptance. Colossians 3:3: "Your life is hidden with Christ in God."</li>
</ul>
    `
  },
  {
    id:'self-worth',
    icon:'💛',
    title:'Self-Worth — You Are Not Your Performance',
    sub:'Building an identity that can handle failure',
    color:'#fbbf24',
    showFor:['M','F','O',''],
    body:`
<p>How you think about your own worth — and what you base it on — will shape almost everything about how you navigate life. This is worth getting right.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Contingent vs. unconditional self-worth</h4>
<p><strong>Contingent self-worth</strong> is based on external factors: grades, appearance, athletic performance, social approval, achievements. When these go well, you feel worthy. When they don't, your sense of self collapses. This is extremely common and extremely fragile — because external circumstances are unreliable and outside your full control.</p>
<p><strong>Unconditional self-worth</strong> is the belief that you have value regardless of performance. This doesn't mean standards don't matter — it means your fundamental worth as a human being is not up for debate based on outcomes.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">The performance trap</h4>
<p>When self-worth is conditional on performance:</p>
<ul>
  <li>Failure becomes identity-threatening, not just disappointing</li>
  <li>Success is never enough — the next achievement must be reached immediately</li>
  <li>Vulnerability feels dangerous — if people see your imperfections, your worth is at risk</li>
  <li>Comparison becomes constant and corrosive</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">A different foundation</h4>
<p>Christian faith makes a radical claim: your worth is not earned, it's given. "See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!" (1 John 3:1). You were loved before you achieved anything. This love doesn't increase when you succeed or decrease when you fail.</p>
<p>Practically, this means:</p>
<ul>
  <li>You can try hard without your identity depending on the outcome</li>
  <li>You can fail without it meaning you are a failure</li>
  <li>You can be honest about your struggles without it threatening your sense of self</li>
  <li>Other people's approval becomes less controlling — you're not desperately dependent on it</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Self-compassion as a skill</h4>
<p>Dr. Kristin Neff's research shows self-compassion (treating yourself with the kindness you'd show a good friend after failure) produces better outcomes than either self-criticism or self-esteem — lower anxiety, depression, and shame; higher motivation and resilience. The inner voice matters. You can train it.</p>
    `
  },
  {
    id:'substance-use',
    icon:'🚫',
    title:'Alcohol, Drugs & Peer Pressure',
    sub:'The facts, the risks, and how to handle the pressure',
    color:'#f87171',
    tags:['all'],
    body:`
<p>By the time you're 19, you've almost certainly been offered alcohol, marijuana, or other substances. This guide isn't a scare tactic — it's the real information about what these substances do to your body and brain, especially while your brain is still developing (which continues until about age 25).</p>

<h4 style="color:#f87171;margin:.8rem 0 .3rem;">What's actually happening in your brain</h4>
<p>Your prefrontal cortex — the part responsible for decision-making, impulse control, and weighing consequences — is literally the last part of your brain to finish developing. This is why teens and young adults are more likely to take risks and less likely to fully evaluate consequences. Alcohol and drugs don't just affect you — they affect the brain development process itself.</p>

<h4 style="color:#f87171;margin:.8rem 0 .3rem;">Alcohol — the facts</h4>
<ul>
<li><strong>Binge drinking</strong> (4-5 drinks in 2 hours) is the most dangerous pattern and the most common among young adults. It can cause alcohol poisoning, which kills about 2,200 Americans per year.</li>
<li><strong>Signs of alcohol poisoning:</strong> Confusion, vomiting, seizures, slow/irregular breathing, blue-tinged skin, unconsciousness. This is a medical emergency — call 911 immediately. Turn them on their side so they don't choke on vomit.</li>
<li><strong>Tolerance is not safety.</strong> Needing more to feel the same effect means your body is adapting to a toxin — that's the early stage of dependence, not a badge of honor.</li>
<li><strong>Drunk driving kills ~10,000 people per year</strong> in the US. Never get in a car with someone who's been drinking. Call a ride. Every single time.</li>
</ul>

<h4 style="color:#f87171;margin:.8rem 0 .3rem;">Marijuana — what they don't always tell you</h4>
<ul>
<li>Regular use before age 25 is associated with measurable IQ decline, memory impairment, and reduced motivation that can persist even after stopping</li>
<li>Today's marijuana is dramatically more potent than previous decades — THC concentrations have increased from ~4% to 15-25%+ in flower, and 60-90% in concentrates</li>
<li>Cannabis use disorder is real and affects roughly 1 in 3 users. Withdrawal symptoms include irritability, insomnia, anxiety, and loss of appetite</li>
</ul>

<h4 style="color:#f87171;margin:.8rem 0 .3rem;">How to handle the pressure</h4>
<ul>
<li><strong>Have your answer ready before you need it.</strong> Deciding in the moment while friends are watching is hard. Deciding beforehand is easy. Know what you'll say.</li>
<li><strong>Simple responses that work:</strong> "No thanks, I'm good." "I'm driving." "I'm in training." "Not my thing." You don't owe anyone an explanation.</li>
<li><strong>The people who pressure you aren't your real friends.</strong> Real friends respect your decisions. If someone can't hang out with you sober, the friendship isn't about you — it's about their need for validation.</li>
<li><strong>Leave if you need to.</strong> Always have a way out. Keep your phone charged, have a backup ride plan, and never feel trapped in a situation that makes you uncomfortable.</li>
</ul>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.2);">
<strong style="color:#f87171;">If you or someone you know needs help:</strong> SAMHSA National Helpline: 1-800-662-4357 (free, confidential, 24/7). They provide referrals to treatment, support groups, and community organizations.
</div>
    `
  },
  {
    id:'consent-boundaries',
    icon:'🤝',
    title:'Consent & Relationship Boundaries',
    sub:'What healthy relationships actually look like',
    color:'#f472b6',
    tags:['all'],
    body:`
<p>Consent and boundaries aren't just about physical intimacy — they're the foundation of every healthy relationship you'll ever have. Understanding them protects you from harm and helps you build relationships based on genuine respect rather than pressure, guilt, or manipulation.</p>

<h4 style="color:#f472b6;margin:.8rem 0 .3rem;">What consent actually means</h4>
<ul>
<li><strong>Freely given:</strong> No pressure, threats, manipulation, or guilt. If someone says yes because they're afraid of what happens if they say no, that's not consent.</li>
<li><strong>Informed:</strong> Both people understand what they're agreeing to. Deception invalidates consent.</li>
<li><strong>Reversible:</strong> Anyone can change their mind at any point. Saying yes earlier doesn't mean you can't say no now. "I wanted to before but I don't anymore" is completely valid.</li>
<li><strong>Enthusiastic:</strong> The absence of "no" is not a "yes." Look for genuine enthusiasm, not reluctant compliance.</li>
<li><strong>Specific:</strong> Consent to one thing is not consent to everything. Each escalation requires its own consent.</li>
<li><strong>Sober:</strong> Someone who is intoxicated, high, asleep, or unconscious cannot give consent. Period. This is both a moral principle and a legal fact.</li>
</ul>

<h4 style="color:#f472b6;margin:.8rem 0 .3rem;">Red flags in relationships</h4>
<ul>
<li>Checking your phone or demanding passwords</li>
<li>Isolating you from friends and family</li>
<li>Making you feel guilty for spending time with others</li>
<li>"If you loved me, you would..." (manipulation through guilt)</li>
<li>Explosive anger followed by intense apology and promises to change (the cycle of abuse)</li>
<li>Making all the decisions and dismissing your preferences</li>
<li>Threatening self-harm if you try to leave (this is manipulation, not love)</li>
</ul>

<h4 style="color:#f472b6;margin:.8rem 0 .3rem;">What healthy relationships look like</h4>
<ul>
<li>Both people feel free to express their needs and boundaries</li>
<li>Disagreements happen but they're resolved through conversation, not intimidation</li>
<li>Both people maintain their own friendships, hobbies, and identity</li>
<li>Trust is present — no need to monitor or control</li>
<li>Physical affection matches what both people genuinely want — not what one person pressures the other into</li>
<li>You feel more like yourself in the relationship, not less</li>
</ul>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(244,114,182,.08);border:1px solid rgba(244,114,182,.2);">
<strong style="color:#f472b6;">If you're in a relationship that doesn't feel right:</strong> National Dating Abuse Helpline: 1-866-331-9474 or text LOVEIS to 22522. You deserve to be treated with respect.
</div>
    `
  },
  {
    id:'addiction-screens',
    icon:'📱',
    title:'Addiction — Screens, Gaming & More',
    sub:'When habits become chains and how to break free',
    color:'#fb923c',
    tags:['all'],
    body:`
<p>Addiction isn't just about substances. Your brain's reward system can become hijacked by anything that provides a reliable dopamine hit — social media, video games, pornography, gambling, shopping, or even your phone itself. Understanding how behavioral addiction works is the first step toward freedom.</p>

<h4 style="color:#fb923c;margin:.8rem 0 .3rem;">How behavioral addiction works</h4>
<p>Your brain has a reward pathway that releases dopamine — a chemical that makes you feel good and motivates you to repeat behaviors. This system evolved to reward survival activities (eating, social connection, achievement). Modern technology has learned to exploit this system by delivering rewards that are:</p>
<ul>
<li><strong>Instant:</strong> No effort required — swipe and get a reward</li>
<li><strong>Variable:</strong> Sometimes amazing, sometimes nothing — like a slot machine, this unpredictability is more addictive than consistent rewards</li>
<li><strong>Infinite:</strong> No natural stopping point (infinite scroll, autoplay, "one more game")</li>
<li><strong>Escalating:</strong> Your brain adapts, requiring more stimulation to feel the same satisfaction</li>
</ul>

<h4 style="color:#fb923c;margin:.8rem 0 .3rem;">Signs you might have a problem</h4>
<ul>
<li>You use it to escape negative emotions (boredom, loneliness, anxiety, stress) rather than for genuine enjoyment</li>
<li>You've tried to cut back but couldn't maintain it</li>
<li>You feel anxious, irritable, or restless when you can't access it</li>
<li>It's affecting your sleep, grades, work, relationships, or health</li>
<li>You lie about or hide how much you use</li>
<li>You need more and more to feel satisfied (tolerance)</li>
<li>You continue despite knowing it's causing problems</li>
</ul>

<h4 style="color:#fb923c;margin:.8rem 0 .3rem;">Practical steps to regain control</h4>
<ul>
<li><strong>Track your actual usage.</strong> Screen Time (iOS) or Digital Wellbeing (Android) shows you real numbers. Most people are shocked by how much time they spend.</li>
<li><strong>Set hard limits with app timers.</strong> When the timer goes off, stop. The discomfort you feel is withdrawal — it passes.</li>
<li><strong>Replace the habit with something real.</strong> Your brain needs dopamine — but it can get it from exercise, creative work, real social connection, learning, or accomplishment. These sources don't leave you feeling empty afterward.</li>
<li><strong>Remove triggers.</strong> Delete apps from your phone (you can still access them from a browser when you intentionally choose to). Turn off notifications. Charge your phone outside your bedroom.</li>
<li><strong>Tell someone.</strong> Addiction thrives in secrecy. Telling a trusted friend, family member, pastor, or counselor removes its power and creates accountability.</li>
</ul>

<h4 style="color:#fb923c;margin:.8rem 0 .3rem;">A note about pornography</h4>
<p>Pornography is specifically designed to exploit your brain's reward system and is one of the most common behavioral addictions among young men and women. Research shows it rewires expectations about relationships, reduces satisfaction with real partners, and can create escalation patterns where increasingly extreme content is needed for the same response. If you're struggling with this, you are not alone and you are not broken. Talk to a counselor or check out resources like Fortify (joinfortify.com) which offers free, confidential support.</p>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.2);">
<strong style="color:#fb923c;">Remember:</strong> Recognizing a problem is not weakness — it's the most courageous step. "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear." (1 Corinthians 10:13)
</div>
    `
  },
  {
    id:'identity-purpose',
    icon:'🧭',
    title:'Identity & Purpose — Who Am I?',
    sub:'Finding who you are beyond what you do',
    color:'#a78bfa',
    tags:['all'],
    body:`
<p>Between the ages of 16 and 25, you're answering one of life's most fundamental questions: "Who am I?" This isn't a simple question, and the culture around you is offering a lot of answers — your grades, your followers, your job, your appearance, your relationship status, your productivity. But identity built on any of those things will eventually crack, because all of them can change or be taken away.</p>

<h4 style="color:#a78bfa;margin:.8rem 0 .3rem;">The identity trap</h4>
<p>Most people build their identity on one of these foundations without realizing it:</p>
<ul>
<li><strong>Performance:</strong> "I am what I accomplish." This creates a person who can never rest, because rest means losing value. Failure becomes an identity crisis, not just a setback.</li>
<li><strong>Approval:</strong> "I am what others think of me." This creates a chameleon who changes to fit every room and never develops a real self. Social media amplifies this enormously.</li>
<li><strong>Appearance:</strong> "I am how I look." This creates anxiety that intensifies with age, since the one thing guaranteed about appearance is that it changes.</li>
<li><strong>Relationships:</strong> "I am who I'm with." This creates codependence — losing the relationship means losing yourself.</li>
<li><strong>Possessions:</strong> "I am what I have." This creates an endless chase where the next purchase always promises satisfaction that never lasts.</li>
</ul>

<h4 style="color:#a78bfa;margin:.8rem 0 .3rem;">A more stable foundation</h4>
<p>The Christian understanding of identity offers something radically different: your value is inherent, not earned. You are made in the image of God (Genesis 1:27), known before you were born (Jeremiah 1:5), and loved not because of what you do but because of whose you are (Romans 8:38-39). This doesn't mean your choices and effort don't matter — they matter enormously. But they flow from identity, not toward it. You don't work to earn value; you work because you already have it.</p>

<h4 style="color:#a78bfa;margin:.8rem 0 .3rem;">Practical identity building</h4>
<ul>
<li><strong>Know your values.</strong> Write down the 5 things that matter most to you — not what you think should matter, but what actually does. Faith, family, integrity, creativity, service, excellence, adventure, justice, kindness. Your values are your compass.</li>
<li><strong>Notice what energizes you.</strong> What activities make you lose track of time? What would you do even if nobody was watching or paying you? These point toward purpose.</li>
<li><strong>Separate identity from outcome.</strong> You are not your GPA. You are not your job title. You are not your relationship status. You are a person of inherent worth who happens to be working on these things right now.</li>
<li><strong>Invest in depth over breadth.</strong> Having 3 deep friendships is worth more than 3,000 followers. Mastering one skill beats being mediocre at twelve. Go deep.</li>
<li><strong>Serve others.</strong> Purpose is almost always discovered in the intersection of your gifts and other people's needs. Volunteering, mentoring, and generosity reveal things about yourself that self-focus never can.</li>
</ul>

<h4 style="color:#a78bfa;margin:.8rem 0 .3rem;">The comparison problem</h4>
<p>Comparison is the thief of joy — and social media has turned it into a 24/7 assault. Everyone else seems more successful, more attractive, more confident, more connected. But you're comparing your behind-the-scenes to their highlight reel. The person you're envying is probably envying someone else. The way out isn't to win the comparison game — it's to stop playing it entirely. Run your own race.</p>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.2);">
<strong style="color:#a78bfa;">The truth about purpose:</strong> You don't have to have it all figured out at 19. Or 25. Or even 30. Purpose unfolds — it's not a destination you arrive at but a direction you grow into. Be faithful with what's in front of you today, stay curious, stay kind, and the path reveals itself. "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." (Ephesians 2:10)
</div>
    `
  },
  {
    id:'masculinity',
    icon:'🛡️',
    title:'Healthy Masculinity — What It Actually Means to Be a Man',
    sub:'Strength, leadership, and tenderness — not the stereotypes',
    color:'#6366f1',
    body:`
<p>Culture sends confusing signals about manhood. On one side: "Men don't cry, show no weakness, handle everything alone." On the other side: "Masculinity is toxic and needs to be fixed." Both extremes miss the point entirely. Healthy masculinity is one of the most powerful forces for good in the world — when it's built on the right foundation.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What healthy masculinity looks like</h4>
<ul>
  <li><strong>Strength under control.</strong> Real strength isn't about being aggressive or dominant — it's about having power and choosing to use it to protect, serve, and build up others. A man who can stay calm in a crisis, who uses his voice to defend someone weaker, who leads without needing to intimidate — that's strength.</li>
  <li><strong>Emotional honesty.</strong> The ability to say "I'm struggling" or "That hurt me" isn't weakness — it's courage. Burying emotions doesn't make them go away; it turns them into anger, addiction, isolation, or depression. The strongest men you'll ever meet are the ones who can name what they feel.</li>
  <li><strong>Taking responsibility.</strong> For your words, your actions, your failures, and your growth. Not blaming others, not making excuses, not disappearing when things get hard. Owning your mistakes and making them right is the definition of integrity.</li>
  <li><strong>Protecting without controlling.</strong> There's a critical difference between protecting someone because you care and controlling someone because you're insecure. Protection gives freedom; control takes it away.</li>
  <li><strong>Leading by serving.</strong> Jesus washed His disciples' feet. The greatest leaders in history weren't the ones demanding respect — they were the ones earning it through sacrifice. Real leadership is serving others before yourself.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">The lies to reject</h4>
<ul>
  <li>"Real men don't ask for help" — Every great man in history had mentors, counselors, and people he trusted. Isolation isn't toughness; it's a trap.</li>
  <li>"Your value is in what you achieve" — You are not your job title, your paycheck, or your bench press max. Your value comes from who you are, not what you do.</li>
  <li>"Vulnerability equals weakness" — Brené Brown's research shows vulnerability is the birthplace of courage, creativity, and connection. Being open about your struggles builds deeper relationships than pretending you're fine.</li>
  <li>"You should figure it out on your own" — No man is self-made. Seeking wisdom, therapy, mentorship, or spiritual guidance is the smartest decision you can make.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">The biblical model</h4>
<p>Jesus is the ultimate example of healthy masculinity: He wept openly (John 11:35). He expressed anger at injustice (Mark 11:15-17). He was tender with children (Mark 10:14). He confronted hypocrisy directly (Matthew 23). He served His friends (John 13). He laid down His life for others (John 15:13). He was simultaneously the strongest and most gentle person who ever lived.</p>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);">
  <strong style="color:#818cf8;">The truth:</strong> Being a man isn't about suppressing who you are — it's about becoming who you were made to be. Strong enough to lead, humble enough to serve, brave enough to feel, and wise enough to ask for help.
</div>
    `
  },
  {
    id:'loneliness',
    icon:'🌊',
    title:'Loneliness & Isolation — You Are Not the Only One',
    sub:'Why connection is hard and what to do about it',
    color:'#0ea5e9',
    body:`
<p>Loneliness is an epidemic among young adults — and almost nobody talks about it because admitting you're lonely feels like admitting you're defective. You're not. Research shows that 18-25 year olds are the loneliest age group in America. The reasons are structural, not personal — and understanding that changes everything.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Why loneliness hits hardest at this age</h4>
<ul>
  <li><strong>Life transitions break your social structure.</strong> High school gave you automatic daily contact with peers. After graduation — whether you went to college, started working, or moved — those structures disappear. Building new ones takes intentional effort that nobody teaches you.</li>
  <li><strong>Social media creates the illusion of connection.</strong> You can have 1,000 followers and zero people who know what you're actually going through. Digital interaction activates different brain pathways than face-to-face connection. Scrolling through other people's social lives while sitting alone amplifies loneliness.</li>
  <li><strong>Male friendship has specific barriers.</strong> Society teaches men that friendship means "doing stuff together" but not sharing feelings. Many guys have people they hang out with but no one they're truly honest with. That's activity partners, not friendship.</li>
  <li><strong>Busyness replaces connection.</strong> Work, school, side hustles, gym — the schedule fills up and there's no margin for the unstructured time where real friendship happens. You can be exhausted and lonely simultaneously.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What actually works</h4>
<ul>
  <li><strong>Show up consistently in one place.</strong> Research shows that friendship requires roughly 50 hours of shared time before people feel like friends, and 200 hours for close friendship. That means you need a recurring context — a church small group, a jiu-jitsu gym, a weekly hangout, a volunteer commitment. Showing up once isn't enough. Showing up every week for three months is.</li>
  <li><strong>Be the one who initiates.</strong> Most lonely people are waiting for someone else to reach out. Everyone is. Be the person who texts first, who suggests plans, who follows up. It feels vulnerable — and that's exactly why it works.</li>
  <li><strong>Go deeper than surface level.</strong> Ask real questions: "How are you actually doing?" Share something honest about your own life. Vulnerability is a trust accelerator. Most people are desperate for someone to be real with them.</li>
  <li><strong>Limit social media and increase face time.</strong> Replace 30 minutes of scrolling with a phone call, a coffee, or showing up somewhere in person. The brain processes physical presence differently than digital interaction.</li>
  <li><strong>Don't compare your friendships to what you see online.</strong> Most people have 2-3 close friends, not 20. Quality over quantity — always.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">When loneliness becomes dangerous</h4>
<p>Chronic loneliness is a health risk comparable to smoking 15 cigarettes a day. It weakens the immune system, increases cortisol, disrupts sleep, and significantly raises the risk of depression. If you've been isolated for weeks or months, that's not a character flaw — it's a situation that needs to change. Talk to someone. A counselor, a pastor, a family member. Taking that step is not weakness — it's wisdom.</p>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(14,165,233,.1);border:1px solid rgba(14,165,233,.25);">
  <strong style="color:#38bdf8;">Remember:</strong> Loneliness is not evidence that something is wrong with you. It's evidence that you need connection — and you were designed for it. "It is not good for man to be alone." (Genesis 2:18) God said that before sin entered the world. The need for connection is built into your design.
</div>
    `
  },
  {
    id:'anger',
    icon:'🔥',
    title:'Anger — The Emotion That Needs Direction, Not Destruction',
    sub:'Understanding your anger and using it for good',
    color:'#ef4444',
    body:`
<p>Anger is one of the most misunderstood emotions. Many people — especially guys — are taught either to suppress anger completely ("calm down, it's not a big deal") or to express it explosively (yelling, hitting things, intimidating people). Both responses cause damage. Anger itself is not the problem. What you do with it is everything.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What anger actually is</h4>
<p>Anger is a <strong>secondary emotion</strong> — it almost always covers something underneath: hurt, fear, frustration, feeling disrespected, feeling powerless, or feeling threatened. When someone cuts you off in traffic, the anger is instant — but underneath it is fear (you could have been hurt) and a sense of injustice (they violated the rules). Understanding what's under the anger gives you power over it.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Healthy vs. destructive anger</h4>
<ul>
  <li><strong>Healthy anger</strong> motivates you to address a real problem. It says "something is wrong and I need to act." Anger at injustice, at abuse, at being mistreated — that anger can fuel positive change when channeled constructively.</li>
  <li><strong>Destructive anger</strong> damages relationships, creates fear, and usually makes the original problem worse. Yelling at someone might release tension for you, but it teaches them to be afraid of you — not to respect you.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">The response framework</h4>
<ol>
  <li><strong>Pause.</strong> When anger spikes, your amygdala hijacks your rational brain. You literally cannot think clearly for 20-90 seconds. Do NOT speak or act during this window. Take a breath. Walk away if needed. Say "I need a minute" — that's not avoiding the issue, it's protecting the outcome.</li>
  <li><strong>Name the real feeling underneath.</strong> "I'm angry" → "I'm angry because I felt disrespected." "I'm angry" → "I'm angry because I'm afraid of losing this." Naming the root feeling immediately reduces its intensity and gives you clarity.</li>
  <li><strong>Choose your response.</strong> Once you're past the spike, decide: Is this worth addressing? If yes, address it calmly and directly — use "I" statements ("I felt disrespected when...") instead of "you" statements ("You always..."). If it's not worth addressing, genuinely let it go — don't bury it and bring it up later.</li>
  <li><strong>Address patterns, not just incidents.</strong> If you're angry all the time, the issue isn't the triggers — it's the underlying stress, hurt, or unresolved pain creating a low threshold. That's where counseling, exercise, prayer, or honest conversation with a mentor becomes essential.</li>
</ol>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">Physical outlets that help</h4>
<p>Anger creates physical energy — adrenaline, cortisol, muscle tension. Exercise is one of the most effective anger management tools because it metabolizes that energy constructively. Running, lifting, jiu-jitsu, hitting a heavy bag — these aren't avoidance; they're processing the physical component so your brain can handle the emotional component.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What the Bible says</h4>
<p>"Be angry and do not sin; do not let the sun go down on your anger." (Ephesians 4:26) Notice: it doesn't say don't be angry. It says be angry — but don't let it control you, and don't let it fester. Deal with it. Address it. Then release it.</p>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);">
  <strong style="color:#f87171;">The goal:</strong> Not to never feel angry — that's impossible and dishonest. The goal is to feel it, understand it, and direct it toward something productive instead of something destructive. A man who masters his anger is more powerful than a man who hides it or weaponizes it.
</div>
    `
  },
  {
    id:'grief-loss',
    icon:'🕊️',
    title:'Grief & Loss — When Life Takes Something Away',
    sub:'How to process pain without shutting down',
    color:'#6b7280',
    body:`
<p>Grief isn't just about death — although that's the most recognized form. You can grieve a breakup, a friendship that ended, a parent's divorce, moving away from home, losing a pet, a failed dream, or even the loss of what you thought your life would look like. Grief is the natural response to any significant loss, and pretending it doesn't affect you doesn't make it go away — it just makes it go underground.</p>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What grief actually feels like</h4>
<ul>
  <li><strong>It's not linear.</strong> You don't move neatly through "stages" and come out the other side. Grief comes in waves — you might feel fine for days, then a song or a smell hits and it's fresh again. That's normal. It doesn't mean you're going backward.</li>
  <li><strong>It's physical.</strong> Grief causes fatigue, appetite changes, difficulty concentrating, chest tightness, disrupted sleep, and weakened immune function. If your body feels wrong after a loss, grief is probably why.</li>
  <li><strong>It changes your sense of time.</strong> Things that used to matter seem pointless. The future feels uncertain. Motivation evaporates. This is your brain processing a world that's been reorganized by loss.</li>
  <li><strong>It can show up as anger.</strong> Especially for guys, grief often masks itself as irritability, anger, or withdrawal. If you're snapping at people or pulling away from everything after a loss, it might be grief you haven't processed.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">What helps</h4>
<ul>
  <li><strong>Let yourself feel it.</strong> Crying is not weakness — it's your body processing pain. Research shows that emotional tears actually contain stress hormones that are released from the body through crying. Suppressing tears keeps those chemicals circulating.</li>
  <li><strong>Talk about the person or the loss.</strong> Silence doesn't honor what you lost — memory does. Tell stories. Say their name. Share what they meant to you. People often avoid mentioning a loss because they don't want to "remind" you — but you haven't forgotten. Hearing their name spoken by someone else is usually a comfort, not a wound.</li>
  <li><strong>Keep basic routines.</strong> You don't need to "be productive." But eating meals, sleeping on a schedule, and moving your body gives your brain stability while it processes chaos. Structure is a lifeline during grief.</li>
  <li><strong>Don't grieve alone.</strong> Isolation during grief is dangerous. You don't need someone to fix it — you need someone to sit with you in it. A friend, a family member, a counselor, a pastor. Grief shared is grief that heals.</li>
  <li><strong>Give it time — and grace.</strong> There is no correct timeline. Society often expects you to "be over it" in weeks, but significant losses can take months or years to fully integrate. You don't "get over" a major loss — you learn to carry it differently.</li>
</ul>

<h4 style="color:var(--tx);margin:.9rem 0 .35rem;">When to get help</h4>
<p>If grief persists for months at the same intensity, if you can't function at work or school, if you're using substances to numb the pain, or if you're having thoughts of harming yourself — please reach out. Grief can become "complicated grief" or depression if it's not processed, and professional support makes a real difference. There is no shame in needing help to carry something heavy.</p>

<div style="margin-top:1rem;padding:.85rem;border-radius:11px;background:rgba(107,114,128,.12);border:1px solid rgba(107,114,128,.25);">
  <strong style="color:#9ca3af;">The hope:</strong> "He heals the brokenhearted and binds up their wounds." (Psalm 147:3) Grief is evidence that you loved. The pain is proportional to what mattered. And God doesn't waste your suffering — He meets you in the middle of it, and eventually, He brings something new from the ashes.
</div>
    `
  }
,
  {
    id:'time-management',
    icon:'⏰',
    title:'Time Management — Your Most Valuable Resource',
    sub:'You cannot make more time, but you can use it better',
    color:'#fbbf24',
    showFor:['M','F','O',''],
    body:`
<p><strong>Time is the one thing you cannot get back.</strong> Every person on earth gets the same 24 hours. The difference between people who accomplish their goals and those who do not is almost always how they spend their time.</p>
<h4 style="color:var(--tx)">The Priority Matrix</h4>
<p>Everything you could do falls into four categories: <b>Urgent + Important</b> (emergencies, deadlines — do these now), <b>Important but Not Urgent</b> (exercise, studying, relationships — schedule these, they build your future), <b>Urgent but Not Important</b> (most texts, interruptions — minimize these), and <b>Not Urgent + Not Important</b> (doom scrolling, random YouTube — eliminate these).</p>
<h4 style="color:var(--tx)">Practical Tips</h4>
<p><b>Time blocking:</b> Assign specific hours to specific tasks. Do not multitask — it makes everything worse. <b>The 2-minute rule:</b> If something takes less than 2 minutes, do it now. <b>Eat the frog:</b> Do your hardest, most important task first thing in the morning. <b>Phone discipline:</b> The average teen spends 7+ hours on screens daily. Even cutting that by 2 hours gives you 730 extra hours per year — enough to learn a language, master an instrument, or build a business.</p>`
  },
  {
    id:'social-media-reality',
    icon:'📱',
    title:'Social Media vs. Reality',
    sub:'What nobody tells you about the highlight reel',
    color:'#60a5fa',
    showFor:['M','F','O',''],
    body:`
<p><strong>What you see online is not real life.</strong> Every platform is designed to show you a curated, filtered, edited version of someone else existence. Nobody posts their failures, their boring Tuesday nights, their anxiety, or the 47 selfies they deleted before posting the one that got likes.</p>
<h4 style="color:var(--tx)">What the Research Shows</h4>
<p>Studies consistently link heavy social media use to increased anxiety, depression, loneliness, and poor body image — especially in teens and young adults. The algorithms are designed to keep you scrolling by triggering emotional reactions. You are not the customer — you are the product being sold to advertisers.</p>
<h4 style="color:var(--tx)">Healthy Boundaries</h4>
<p><b>Audit your feed:</b> Unfollow anyone who makes you feel worse about yourself. <b>Set time limits:</b> Most phones have screen time controls — use them. <b>No phone zones:</b> Keep it out of your bedroom at night, off the table at meals. <b>Create more than you consume:</b> Posting your art, music, or ideas is healthy. Endlessly scrolling through other people lives is not.</p>
<p>Your real life — the conversations, the experiences, the growth — happens when you look up from the screen.</p>`
  },
  {
    id:'conflict-resolution',
    icon:'🕊️',
    title:'Handling Conflict — Fighting Fair',
    sub:'Disagreements are normal. How you handle them defines you.',
    color:'#34d399',
    showFor:['M','F','O',''],
    body:`
<p><strong>Conflict is not the problem — how you handle it is.</strong> Every relationship will have disagreements. Learning to navigate them without destroying the relationship is one of the most important life skills you will ever develop.</p>
<h4 style="color:var(--tx)">The Rules of Fair Fighting</h4>
<p><b>Use I statements:</b> Say "I feel hurt when..." instead of "You always..." This prevents the other person from getting defensive. <b>Listen to understand, not to respond:</b> Most people are just waiting for their turn to talk. Actually hear what the other person is saying. <b>Stay on topic:</b> Do not bring up old issues. Deal with one thing at a time. <b>Take a break if needed:</b> If emotions are too high, say "I need 20 minutes to cool down" and come back to it.</p>
<h4 style="color:var(--tx)">What to Never Do</h4>
<p>Never use name-calling or insults. Never use physical intimidation. Never give the silent treatment for days. Never involve uninvolved people to take sides. Never say "always" or "never." And never make threats you do not intend to follow through on.</p>
<p>The goal of conflict is not to win — it is to understand each other better and find a path forward together.</p>`
  },
  {
    id:'respect-authority',
    icon:'🎩',
    title:'Respect, Authority, and Standing Your Ground',
    sub:'When to follow, when to lead, and when to speak up',
    color:'#818cf8',
    showFor:['M','F','O',''],
    body:`
<p><strong>Respect is not the same as obedience, and authority is not the same as always being right.</strong> Learning the difference is one of the most important parts of growing up.</p>
<h4 style="color:var(--tx)">Respect Goes Both Ways</h4>
<p>You should give basic respect to everyone — teachers, parents, bosses, strangers. But respect is also earned through character and actions. A teacher who belittles students does not deserve the same respect as one who invests in them. Both deserve professional behavior, but not the same level of trust.</p>
<h4 style="color:var(--tx)">When Authority Is Wrong</h4>
<p>Sometimes people in authority make mistakes. Sometimes they abuse their power. Knowing the difference between "I do not like this rule" and "this is genuinely wrong" matters. <b>If an adult asks you to do something illegal, inappropriate, or that violates your safety</b> — you have every right and responsibility to say no and tell someone you trust.</p>
<h4 style="color:var(--tx)">Standing Your Ground Respectfully</h4>
<p>You can disagree without being disrespectful. Say: "I understand your perspective, but I see it differently because..." This shows maturity. Yelling, storming off, or shutting down does not. The most respected people in any room are the ones who stay calm when others do not.</p>`
  },
  {id:'bullying',
    icon:'😠',
    title:'Bullying — How to Recognize It, Handle It, and Stop It',
    sub:'You are not powerless. Here is what actually works.',
    color:'#ef4444',
    showFor:['M','F','O',''],
    body:`
<p><strong>Bullying is not a rite of passage. It is not "just kids being kids." It is repeated, intentional behavior designed to harm someone who feels powerless to stop it.</strong> It can be physical, verbal, social (exclusion, rumor spreading), or digital (cyberbullying). If it is happening to you, it is not your fault, and you are not weak for being affected by it.</p>

<h4>What to Do If You're Being Bullied</h4>
<p><strong>Don't react with emotion in the moment.</strong> Bullies feed on your reaction — anger, tears, fear. Practice a calm, unbothered response. Walk away. This is not weakness — it is strategic. <strong>Document everything.</strong> Save screenshots, write dates and what happened. This creates evidence. <strong>Tell an adult you trust</strong> — parent, teacher, school counselor, coach. This is not snitching — it is self-advocacy. If the first adult does not help, tell another one. <strong>Block cyberbullies</strong> — don't engage online, don't respond, don't read their content if you can avoid it. Block and report on every platform.</p>

<h4>What to Do If You See Bullying</h4>
<p>Bystanders have more power than bullies. <strong>Don't laugh, don't share, don't stay silent.</strong> You don't have to be a hero — you can quietly check on the person afterward, sit with them at lunch, or report what you saw. Research shows that when even one person stands up, bullying drops dramatically. Be that one person.</p>

<h4>If You Have Bullied Others</h4>
<p>Own it. Power over others does not make you strong — it makes you afraid. Real strength is lifting people up, not pushing them down. If you recognize this pattern in yourself, talk to a counselor. There is usually something deeper driving it — pain, insecurity, a need for control. Address the root and the behavior changes.</p>`
  },
  {id:'teen-pregnancy',
    icon:'🤰',
    title:'Teen Pregnancy & Protection — The Real Conversation',
    sub:'Facts, consequences, and how to make wise decisions',
    color:'#f472b6',
    showFor:['M','F','O',''],
    body:`
<p><strong>This topic makes adults uncomfortable, which is exactly why most young people learn about it from the wrong sources.</strong> Whether your values come from faith, family, or personal conviction, you deserve accurate information to make informed decisions.</p>

<h4>The Reality</h4>
<p>About 170,000 teens become parents each year in the U.S. Teen pregnancy rates have dropped significantly over the past 30 years, but it still happens — and it fundamentally changes the trajectory of your life. Teen parents are significantly less likely to finish high school or college, more likely to live in poverty, and face enormous challenges balancing parenthood with education and career development. This does not mean their lives are over — many teen parents become incredible adults — but the path becomes dramatically harder.</p>

<h4>Abstinence</h4>
<p>The only 100% effective way to prevent pregnancy and STIs is abstinence — choosing not to have sex. This is not an outdated idea. It is a legitimate, respected choice that many young people make. You are never obligated to be sexually active regardless of what your peers, partners, or media suggest. Anyone who pressures you does not respect you.</p>

<h4>If You Choose to Be Sexually Active</h4>
<p>Know that no method of protection is 100% effective other than abstinence. Condoms reduce pregnancy risk and are the only method that protects against STIs. Other forms of contraception require a healthcare provider. <strong>Both partners are responsible</strong> — this is not "the girl's problem." Have this conversation before the situation arises, not during it.</p>

<h4>The Bigger Picture</h4>
<p>Your decisions about relationships and physical intimacy have lasting emotional consequences beyond pregnancy and health risks. Intimacy creates bonds that breakups tear apart. Guard your heart and your body — they are worth protecting. Whatever your values are on this topic, make your decision in advance, sober, and with clear thinking — not in the heat of a moment.</p>`
  },
  {id:'balancing-life',
    icon:'⚖️',
    title:'Balancing Life — When Everything Demands Your Time',
    sub:'School, sports, friends, family, work, sleep — and somehow staying sane',
    color:'#06d6a0',
    showFor:['M','F','O',''],
    body:`
<p><strong>You are probably doing more than any previous generation of teenagers.</strong> School, homework, sports practice, part-time job, college prep, social media, family expectations, friend groups, church, hobbies, and somehow you are supposed to sleep 8 hours. It is not lazy to feel overwhelmed — it is honest.</p>

<h4>The Priority Framework</h4>
<p>Not everything is equally important, even if everything feels urgent. Rank your commitments into three tiers. <strong>Tier 1: Non-negotiable</strong> — health (sleep, food, exercise), family relationships, and your education. These cannot be sacrificed. <strong>Tier 2: Important</strong> — your primary extracurricular (sport, music, job), close friendships, and faith/personal growth. <strong>Tier 3: Nice to have</strong> — social events, social media, entertainment, additional commitments. When life gets overwhelming, protect Tier 1 first and let Tier 3 flex.</p>

<h4>The Art of Saying No</h4>
<p>"No" is a complete sentence. You cannot do everything. Saying yes to one thing means saying no to something else — including rest. Practice this: "I appreciate the invite, but I can't this week." No explanation needed. People who respect you will understand. People who guilt you for having limits are showing you who they are.</p>

<h4>When You're Drowning</h4>
<p>Tell someone. Not in a dramatic way — just honestly: "I have too much going on and I need help prioritizing." Talk to a parent, counselor, or trusted adult. Sometimes the solution is dropping one commitment. Sometimes it is better time management. Sometimes you just need someone to say "you're doing enough." But you cannot solve it in silence.</p>`
  },
  {id:'politics-media',
    icon:'📺',
    title:'Politics & Media — How to Think for Yourself',
    sub:'Making decisions based on research, not what someone tells you to believe',
    color:'#94a3b8',
    showFor:['M','F','O',''],
    body:`
<p><strong>Here is something most adults will not tell you: almost every source of information you consume has an agenda.</strong> News networks, social media algorithms, political commentators, influencers, teachers, pastors, and yes — even your parents — all have perspectives that shape what they present and how they present it. This does not make them evil. It makes them human. Your job is to learn how to think, not what to think.</p>

<h4>How Indoctrination Works</h4>
<p>Indoctrination is when someone teaches you to accept beliefs without questioning them. It happens on every side of every issue — left, right, religious, secular. The warning signs: <strong>You are told the "other side" is evil, stupid, or dangerous.</strong> You are discouraged from reading, watching, or listening to opposing views. Complex issues are presented as simple with only one correct answer. Emotions (fear, anger, outrage) are used more than facts. You feel pressure to agree publicly or face social consequences.</p>

<h4>How to Think for Yourself</h4>
<p><strong>Read multiple sources on every issue.</strong> If you only get news from one network, podcast, or social media feed, you are getting a filtered version of reality. Read the source they are criticizing — in their own words, not through someone else's summary. <strong>Check primary sources.</strong> If someone says "studies show" — find the actual study. If someone quotes a politician — read the full quote in context. <strong>Ask "who benefits?"</strong> Every time you see a story designed to make you angry or afraid, ask who benefits from your emotional reaction. <strong>Be comfortable not having an opinion yet.</strong> On complex issues, "I'm still learning about this" is a more honest answer than a hot take you borrowed from someone else.</p>

<h4>The Goal</h4>
<p>The goal is not to have no opinions. It is to have opinions that are genuinely yours — formed through research, critical thinking, and honest evaluation, not handed to you by algorithms designed to keep you engaged and outraged. The most intelligent people in any room are the ones who can articulate the strongest version of the argument they disagree with. Build that skill.</p>`
  },
  {id:'world-issues',
    icon:'🌍',
    title:'World Issues — Understanding Suffering and How You Can Help',
    sub:'War, poverty, injustice — when the world feels dark, here is what you can do',
    color:'#60a5fa',
    showFor:['M','F','O',''],
    body:`
<p><strong>You are the first generation to see global suffering in real time, every day, on a screen in your pocket.</strong> Wars, natural disasters, poverty, trafficking, political oppression — the 24-hour news cycle and social media serve it to you constantly. It is normal to feel overwhelmed, anxious, helpless, or numb. None of those responses mean something is wrong with you. They mean your heart is working.</p>

<h4>Managing the Weight</h4>
<p><strong>You are not responsible for fixing everything.</strong> Read that again. Your awareness of global suffering does not obligate you to solve it personally, and carrying the emotional weight of every crisis will break you. <strong>Limit your intake.</strong> Checking the news once or twice a day is informed. Doom-scrolling for hours is self-harm disguised as awareness. <strong>Not every post needs your comment.</strong> Performative outrage on social media does not help victims — it helps algorithms.</p>

<h4>What You Can Actually Do</h4>
<p><strong>Start local.</strong> The most impactful thing you can do is serve people within your reach — volunteer at a food bank, help a neighbor, mentor a younger kid, donate to a local organization. Global problems are solved by millions of people fixing local ones. <strong>Educate yourself deeply on one issue</strong> rather than superficially on everything. Understand the root causes, not just the headlines. <strong>Give strategically.</strong> Research charities before donating — sites like GiveWell and Charity Navigator rate effectiveness. <strong>Develop skills that create change.</strong> Doctors, engineers, teachers, social workers, lawyers, and entrepreneurs have outsized impact on the problems that break your heart. Your education is not separate from your compassion — it is the vehicle for it.</p>

<h4>Holding Both</h4>
<p>You can hold two truths at once: the world has serious problems AND your life can still be full of joy, gratitude, and purpose. In fact, you are more useful to others when you are healthy, grounded, and strong than when you are depleted from absorbing everyone else's pain. Take care of yourself so you have something to give.</p>`
  },
  {id:'siblings',
    icon:'👫',
    title:'Siblings — Your Longest Relationship',
    sub:'They drive you crazy. They also shape who you become.',
    color:'#fb923c',
    showFor:['M','F','O',''],
    body:`
<p><strong>Your sibling relationship will likely be the longest relationship of your entire life</strong> — longer than your parents, longer than your spouse, longer than your closest friends. How you treat each other now builds a foundation that either sustains you both for decades or creates distance that becomes permanent.</p>

<h4>Why It Feels So Hard</h4>
<p>You didn't choose each other. You share space, parents, resources, and attention — all things that feel limited. Younger siblings can feel like they live in your shadow. Older siblings can feel burdened by responsibility they didn't ask for. Middle siblings can feel invisible. Blended families add the complexity of stepsiblings you're expected to love like family when you barely know them. All of this is real and valid.</p>

<h4>What Makes It Better</h4>
<p><strong>Stop competing.</strong> Your sibling's success is not your failure. Their strengths don't diminish yours. When you genuinely celebrate what they're good at, it transforms the relationship. <strong>Apologize when you're wrong.</strong> Not "I'm sorry you feel that way" — a real apology that takes ownership. <strong>Defend them publicly</strong> even if you fight privately. Nobody gets to bully your sibling but you — and ideally not even you. <strong>Create shared experiences.</strong> Inside jokes, traditions, and memories build a bond that conflict can't easily break. Play a game together, watch a show that's "yours," or just sit in the same room doing nothing.</p>

<h4>If Your Sibling Is Struggling</h4>
<p>If you notice a sibling withdrawing, changing behavior, being secretive, or showing signs of depression or substance use — you may see it before your parents do. You don't have to have answers. Just say: "I notice you seem different lately. I'm not trying to be annoying — I just care about you." That sentence can change everything. And if they are in danger, telling a parent is not betrayal — it is love.</p>`
  },
  {id:'divorced-parents',
    icon:'💔',
    title:'Divorced Parents — It Is Not Your Fault',
    sub:'Navigating two homes, split loyalty, and your own feelings',
    color:'#ef4444',
    showFor:['M','F','O',''],
    body:`
<p><strong>If your parents are divorced or separated, let me say the most important thing first: it is not your fault.</strong> Not because of something you did. Not because of something you didn't do. Not because you weren't enough. Adults make decisions about their relationships based on adult issues. You are not responsible for their marriage, and you are not responsible for fixing it.</p>

<h4>The Feelings Are Normal</h4>
<p>Anger — even at both of them. Sadness that hits at random times, years after it happened. Guilt when you enjoy time at one house and feel like you're betraying the other parent. Relief (if the home was tense or unsafe) — and then guilt about the relief. Fear that you'll repeat their patterns in your own relationships. Grief for the family you thought you'd have. All of these are completely normal, and none of them make you a bad person.</p>

<h4>What You Can Control</h4>
<p><strong>Refuse to be a messenger.</strong> "Tell your mother that..." and "Ask your father about..." — you are not a carrier pigeon. Gently say: "I'd prefer you talk to each other directly about that." <strong>Don't take sides.</strong> Even if one parent seems more "right" — you don't know the full story, and choosing sides damages you more than either of them. <strong>Don't spy or report.</strong> What happens at Mom's house stays at Mom's house. What happens at Dad's stays at Dad's. You are not a surveillance system. <strong>Set boundaries about bad-mouthing.</strong> It's okay to say: "I love both of you, and hearing you talk about Dad/Mom like that makes me uncomfortable."</p>

<h4>Two Homes Can Work</h4>
<p>Keep essentials at both houses — chargers, toiletries, comfortable clothes. Use a shared calendar so everyone knows your schedule. Communicate openly about what you need. And know this: many people who grew up with divorced parents say it taught them resilience, adaptability, and a clearer picture of what they want in their own relationships. Your parents' divorce does not define your future. Your choices do.</p>`
  },
  {id:'true-friendship',
    icon:'🫂',
    title:'True Friendship — Building Relationships That Last',
    sub:'Quality over quantity. How to find, be, and keep real friends.',
    color:'#22d3ee',
    showFor:['M','F','O',''],
    body:`
<p><strong>You don't need 50 friends. You need 3-5 people who actually know you, actually care, and actually show up.</strong> Social media has warped what friendship means — followers, likes, and streaks are not friendships. Friendship is built on trust, shared experience, and mutual investment over time. It can't be speed-run.</p>

<h4>Signs of a Real Friend</h4>
<p>They tell you what you need to hear, not just what you want to hear. They keep your secrets. They show up when things are hard — not just when things are fun. They don't talk about you behind your back. They celebrate your wins without jealousy. They give you space when you need it and check in when you've been quiet too long. They don't require you to perform a version of yourself to stay in the group.</p>

<h4>Signs of a Toxic Friendship</h4>
<p>You feel drained after spending time with them. They make you feel bad about yourself through "jokes" or subtle comments. They keep score ("I did this for you, so you owe me"). They only reach out when they need something. They pressure you into things that go against your values. They get angry or guilt you when you spend time with other people. These patterns are just as damaging in friendships as in romantic relationships — and harder to see because we don't talk about them as often.</p>

<h4>How to Be a Better Friend</h4>
<p><strong>Initiate.</strong> Don't wait for others to reach out — text first, make the plan, show up. <strong>Remember things.</strong> Ask how their test went, how the family stuff is going, what happened with that thing they mentioned. <strong>Be reliable.</strong> If you say you'll be there, be there. If you say you'll call, call. Consistency builds trust. <strong>Forgive imperfection.</strong> Your friends will let you down sometimes. So will you. Grace keeps friendships alive through the inevitable rough patches.</p>`
  },
  {id:'pets',
    icon:'🐕',
    title:'Pets & Responsibility — What Owning an Animal Actually Means',
    sub:'The joy, the work, and the life lessons no one warns you about',
    color:'#a78bfa',
    showFor:['M','F','O',''],
    body:`
<p><strong>Getting a pet is one of the most rewarding things you can do — and one of the most underestimated commitments.</strong> A dog lives 10-15 years. A cat lives 12-20 years. That pet you beg your parents for at 14 will still need feeding, vet visits, and attention when you're 28 and living on your own. That's not a warning — it's a reality check.</p>

<h4>What Pets Actually Teach You</h4>
<p><strong>Unconditional responsibility.</strong> Your pet can't feed itself, let itself out, or take itself to the vet. If you don't do it, nobody does. This is the purest form of accountability — another life depends on your consistency. <strong>Routine and discipline.</strong> Pets thrive on routine. Morning feeding, evening walks, regular play. This structure actually helps you build discipline in other areas of life. <strong>Empathy and patience.</strong> An animal can't tell you what's wrong. You learn to read body language, anticipate needs, and respond to something that can't advocate for itself. <strong>Grief.</strong> Losing a pet is often a young person's first experience with death. It's real grief — don't let anyone minimize it.</p>

<h4>The Real Cost</h4>
<p>Dogs cost $1,000-3,000+ per year (food, vet, supplies, grooming). Cats cost $500-1,500/year. Unexpected vet bills can be $1,000-5,000 for emergencies. Pet insurance ($30-60/month) can help. Before getting a pet, honestly ask: Can I afford this? Do I have time for daily care? Will my living situation allow a pet for its entire lifespan?</p>

<h4>If You Already Have a Pet</h4>
<p>Step up. If your parents are doing all the work, that pet is theirs, not yours — regardless of who begged for it. Feed them on schedule. Walk the dog daily (not just when you feel like it). Clean the litter box, the cage, the tank. Go to vet appointments. <strong>The way you treat something that depends on you says everything about your character.</strong> A pet is not a toy — it is a living being that trusted you with its life.</p>`
  },
  {id:'phone-use',
    icon:'📵',
    title:'Your Phone — The Most Powerful and Dangerous Thing You Own',
    sub:'How to use it without it using you',
    color:'#ef4444',
    showFor:['M','F','O',''],
    body:`
<p><strong>Your phone is a supercomputer, library, communication device, camera, GPS, bank, and entertainment center — in your pocket.</strong> It is also the single most carefully designed distraction machine ever created. The smartest engineers in the world are paid billions of dollars to keep you scrolling, tapping, and watching. Understanding this is the first step to taking control.</p>

<h4>The Numbers</h4>
<p>The average teen spends <b style="color:var(--tx);">7+ hours per day</b> on screens outside of schoolwork. That is nearly half of every waking hour. Over a year, that is <b>106 days</b> — almost a third of the year spent looking at a screen. If you started at age 12 and continued through 22, that is <b>nearly 3 full years</b> of your life consumed by a device. Whatever you could have built, learned, practiced, or experienced in 3 years — that is the real cost.</p>

<h4>What Your Phone Does to Your Brain</h4>
<p><strong>Dopamine loops:</strong> Every notification, like, message, and scroll triggers a small dopamine hit — the same chemical pathway that drives gambling and substance addiction. Your brain begins to crave the stimulation, making everything else (homework, reading, face-to-face conversation) feel boring by comparison. This is not willpower failure — it is a designed response.</p>
<p><strong>Attention fragmentation:</strong> Studies show it takes an average of <b>23 minutes</b> to regain focus after checking your phone. If you check it 50 times a day (the average for teens), you never actually achieve deep focus on anything. Your ability to concentrate is being physically rewired by constant interruption.</p>
<p><strong>Sleep destruction:</strong> Blue light from screens suppresses melatonin production. Using your phone within an hour of sleep delays sleep onset, reduces sleep quality, and disrupts REM cycles. Poor sleep cascades into poor mood, worse grades, weakened immunity, and impaired decision-making.</p>

<h4>Social Media Specifically</h4>
<p><strong>Comparison is the thief of joy</strong> — and social media is a comparison machine. Everyone posts their highlights, their best angles, their wins. You compare your behind-the-scenes reality to their highlight reel. This is linked to increased rates of anxiety, depression, body image issues, and loneliness — especially in girls, but in boys too. The irony: the platform designed to "connect" people makes most users feel more isolated.</p>
<p><strong>Cyberbullying</strong> follows you home. Before phones, bullying stopped at the school door. Now it is 24/7, in your pocket, in your bedroom. If you are experiencing this, see the Bullying topic in this section for specific steps.</p>

<h4>Taking Back Control</h4>
<p><strong>The rules that actually work:</strong></p>
<p>📵 <b>No phone in the bedroom at night.</b> Buy a $10 alarm clock. Charge your phone in another room. This single change improves sleep, mood, and morning productivity more than almost anything else.</p>
<p>⏰ <b>Set screen time limits</b> — use your phone's built-in tools (Screen Time on iPhone, Digital Wellbeing on Android). Set app limits for social media at 30-60 minutes per day. When the limit hits, stop.</p>
<p>🔕 <b>Turn off all non-essential notifications.</b> Keep calls and texts from real people. Turn off everything else — Instagram, TikTok, YouTube, games, news. Check them on your schedule, not theirs.</p>
<p>📚 <b>Replace scroll time with one activity.</b> You don't need to quit cold turkey. Just replace 30 minutes of scrolling with 30 minutes of reading, exercising, practicing an instrument, or being face-to-face with a real human. The goal is not zero phone use — it is intentional phone use.</p>
<p>🤝 <b>Create phone-free zones and times.</b> Meals. Conversations. The first hour of your day. The last hour. In the car. At church. These boundaries give your brain time to exist without stimulation — and that is when your best thinking happens.</p>

<h4>The Bottom Line</h4>
<p>Your phone is a tool. A hammer can build a house or destroy one — the tool is not the problem, the user is. <strong>Be the person who uses their phone intentionally, not the person whose phone uses them.</strong> In 10 years, you will not remember a single thing you scrolled past. You will remember what you built, who you loved, and what you became.</p>`
  },
  {id:'hygiene',
    icon:'🧼',
    title:'Hygiene — Nobody Will Tell You, So We Will',
    sub:'The honest guide to not being the person people avoid',
    color:'#22d3ee',
    showFor:['M','F','O',''],
    body:`
<p><strong>Here is the truth nobody wants to say out loud: bad hygiene will cost you friendships, relationships, job opportunities, and respect — and almost nobody will tell you directly.</strong> People will just quietly avoid you. They will not invite you. They will not sit near you. And you will never know why, because this is the one thing people are too uncomfortable to say to your face.</p>

<h4>Daily Non-Negotiables</h4>
<p><b style="color:var(--tx);">Shower every day.</b> Every single day. Not every other day. Not "when you feel like it." After puberty, your body produces oil and bacteria at a rate that requires daily cleaning. Use soap on your entire body — not just standing under water. Wash your face separately with a gentle cleanser. If you work out, you need a second shower.</p>
<p><b style="color:var(--tx);">Deodorant or antiperspirant — every morning, no exceptions.</b> Deodorant masks odor. Antiperspirant reduces sweating. Most people need antiperspirant. Apply it to dry skin after showering. Carry a backup in your bag during the school year. If you sweat heavily, clinical-strength products exist over the counter. This is not embarrassing — it is practical.</p>
<p><b style="color:var(--tx);">Brush your teeth twice a day.</b> Morning and before bed. Two full minutes each time. Brush your tongue — that is where most bad breath bacteria live. Floss at least once a day. Bad breath is one of the top things people notice and never mention. A $3 pack of floss and 4 minutes a day prevents most dental problems and social problems.</p>
<p><b style="color:var(--tx);">Wear clean clothes every day.</b> Underwear and socks — fresh pair daily, no exceptions. Shirts — one wear maximum before washing. Pants and jeans can go 2-3 wears if they are not dirty or smelly. If your clothes smell when you put them on, they are not clean. Doing laundry twice a week keeps this manageable.</p>

<h4>The Stuff Nobody Mentions</h4>
<p><b>Wash your bedsheets</b> every 1-2 weeks. You spend 8 hours sweating, shedding skin cells, and producing oils in your bed every night. Dirty sheets cause acne breakouts, skin irritation, and allergies. Pillow cases should be changed weekly — flip them mid-week for a fresh side.</p>
<p><b>Trim your nails.</b> Fingernails and toenails. Weekly is usually enough. Dirty, long nails are one of the first things people notice in close contact. A basic nail clipper costs $2 and takes 3 minutes.</p>
<p><b>Hair care.</b> Wash your hair 2-4 times per week depending on your hair type (oily hair needs more, dry/curly hair needs less). Use conditioner. Brush or comb daily. Get haircuts regularly — every 4-8 weeks for short hair, every 8-12 for long. If you are unsure what looks good, ask your barber or stylist for a recommendation based on your face shape.</p>
<p><b>Cologne and perfume:</b> Less is more. One spray on your neck or wrists. If someone can smell you from more than an arm's length away, you used too much. Fragrance should be discovered, not announced.</p>

<h4>Why This Matters Beyond the Obvious</h4>
<p>Hygiene is not vanity — it is respect. Respect for yourself, for the people around you, and for the spaces you share. It signals to the world that you care enough about yourself to maintain your own body. First impressions in job interviews, dates, friendships, and every social interaction are affected by how you present yourself physically. You do not need expensive products or a complicated routine. You need consistency with the basics.</p>`
  },
  {id:'living-clean',
    icon:'🏠',
    title:'Living Clean — Your Space Reflects Your Mind',
    sub:'Why a clean room actually changes how you feel, think, and perform',
    color:'#34d399',
    showFor:['M','F','O',''],
    body:`
<p><strong>Your environment directly affects your mental state.</strong> This is not your mom nagging you — it is psychology. Research consistently shows that cluttered, dirty spaces increase cortisol (stress hormone), reduce the ability to focus, worsen sleep quality, and increase feelings of anxiety and overwhelm. A clean space does the opposite. It calms your brain, helps you think clearly, and gives you a sense of control.</p>

<h4>Why It Is Hard</h4>
<p>Nobody taught you a system. You were told "clean your room" but never taught how to maintain a space efficiently. So it gets messy, then the mess feels overwhelming, then you avoid it, then it gets worse, and the cycle continues. The solution is not a marathon cleaning session every month — it is tiny daily habits that take less time than scrolling TikTok.</p>

<h4>The 10-Minute Daily Reset</h4>
<p>Set a timer for 10 minutes. Every night before bed, do these things in this order:</p>
<p>1. <b>Trash sweep</b> — grab anything that is actually garbage and throw it away. Wrappers, tissues, empty bottles. 90 seconds.</p>
<p>2. <b>Clothes</b> — dirty clothes in the hamper, clean clothes hung up or folded and put away. Not on the floor. Not on the chair. 3 minutes.</p>
<p>3. <b>Surfaces</b> — clear your desk, nightstand, and dresser top. Everything gets a home. If it does not have a home, make one. 3 minutes.</p>
<p>4. <b>Make tomorrow easier</b> — set out clothes for tomorrow, pack your bag, put your keys and wallet in the same spot every time. 2 minutes.</p>
<p>Do this for 7 days and your space will transform. Do it for 30 days and it becomes automatic.</p>

<h4>Weekly Tasks</h4>
<p><b>Laundry</b> — wash, dry, fold, and put away completely. The cycle is not complete until the clothes are in drawers, not in a basket. Do this twice a week. <b>Vacuum or sweep</b> your floor once a week. <b>Change your sheets</b> weekly. <b>Clean your bathroom</b> — wipe the sink, toilet, and mirror. Takes 8 minutes. <b>Take out trash</b> before it overflows.</p>

<h4>The Deeper Truth</h4>
<p>Cleaning your space is not about impressing anyone. It is about creating an environment where you can think, rest, and grow. The discipline of maintaining your physical space builds the same muscle that maintains your health, your relationships, and your career. <b>If you cannot manage a room, you cannot manage a life.</b> Start small, stay consistent, and watch how everything else gets easier when your environment is not fighting against you.</p>`
  },
  {id:'sleep',
    icon:'😴',
    title:'Sleep — The Superpower You Are Probably Destroying',
    sub:'Why sleep is the single most important thing you do every day',
    color:'#818cf8',
    showFor:['M','F','O',''],
    body:`
<p><strong>If someone offered you a free drug that improved your grades, made you stronger, reduced anxiety, improved your skin, boosted your immune system, made you more creative, improved your memory, helped you make better decisions, and added years to your life — you would take it immediately.</strong> That drug exists. It is called sleep. And most teenagers are severely deficient.</p>

<h4>What Sleep Actually Does</h4>
<p><b style="color:var(--tx);">Memory consolidation:</b> Your brain replays and organizes everything you learned during the day while you sleep. Students who sleep 8+ hours after studying retain 40% more information than those who sleep 6 hours. Pulling an all-nighter before a test actively makes you dumber — you lose the consolidation AND impair next-day recall.</p>
<p><b style="color:var(--tx);">Physical recovery:</b> Growth hormone is released primarily during deep sleep. Your muscles repair, your immune system strengthens, and your cells regenerate. Athletes who sleep less than 8 hours have a 1.7x higher injury rate. Sleep is not laziness — it is when your body builds itself.</p>
<p><b style="color:var(--tx);">Emotional regulation:</b> Sleep deprivation literally shrinks the connection between your prefrontal cortex (rational brain) and your amygdala (emotional brain). This is why you feel irritable, anxious, and emotionally reactive when tired. It is not weakness — it is neuroscience. One night of poor sleep increases emotional reactivity by 60%.</p>
<p><b style="color:var(--tx);">Skin and appearance:</b> "Beauty sleep" is not a myth. During sleep, blood flow to your skin increases, collagen production ramps up, and damage from UV and stress is repaired. Chronic sleep deprivation causes acne, dark circles, dull skin, and premature aging. If you want to look your best, sleep is more effective than any product you can buy.</p>

<h4>How Much You Actually Need</h4>
<p><b>Ages 13-18: 8-10 hours per night.</b> Not 6. Not 7. Not "I function fine on 5." You do not function fine on 5 — you have just normalized impairment. Your brain has adapted to a degraded state and convinced you it is normal. Studies consistently show that people who claim they only need 5-6 hours perform measurably worse on every cognitive test than those who get 8+. You cannot feel your own impairment — that is part of the impairment.</p>
<p><b>Ages 18-25: 7-9 hours.</b> The need decreases slightly but not as much as most young adults think. College culture normalizes sleep deprivation. It should not be normalized. It should be treated like any other health risk.</p>

<h4>Why You Cannot Sleep (and How to Fix It)</h4>
<p><b style="color:#ef4444;">📱 Your phone is the #1 enemy of sleep.</b> Blue light suppresses melatonin for up to 90 minutes after exposure. Social media and content consumption keep your brain in a stimulated state. The fix: phone out of the bedroom by 9 PM. Use a real alarm clock. This one change will transform your sleep within 3 days.</p>
<p><b style="color:var(--c);">Build a sleep schedule.</b> Go to bed and wake up at the same time every day — including weekends. Your circadian rhythm is a real biological clock that performs best with consistency. Sleeping in 3 extra hours on Saturday does not "make up" for a week of deprivation — it just disrupts your rhythm further.</p>
<p><b style="color:var(--c);">Create a wind-down routine.</b> 30-60 minutes before bed: dim the lights, no screens, read a book, journal, stretch, pray, or just sit quietly. Your brain needs a transition period between the stimulation of the day and the rest of sleep. Going from full-speed scrolling to "I should be asleep" does not work.</p>
<p><b style="color:var(--c);">Your room matters.</b> Cool temperature (65-68°F is ideal). Dark — use blackout curtains or a sleep mask. Quiet — use a white noise machine or fan if needed. Your bed is for sleep — not for homework, scrolling, or watching videos. Train your brain to associate bed with rest.</p>
<p><b style="color:var(--c);">Watch what you consume.</b> No caffeine after 2 PM (that includes energy drinks, soda, and tea). No large meals within 2-3 hours of bed. Exercise helps sleep quality dramatically — but not within 2 hours of bedtime.</p>

<h4>The Real Cost of Not Sleeping</h4>
<p>Sleep-deprived teens have: lower GPAs, higher rates of depression and anxiety, more car accidents (drowsy driving kills more teens than drunk driving), weakened immune systems (you get sick more often), worse athletic performance, impaired decision-making (you make riskier choices), and reduced creativity. <b>Every single area of your life improves with better sleep, and every single area suffers without it.</b></p>
<p>This is not a suggestion. It is the single highest-leverage change you can make in your life right now. Protect your sleep the way you would protect anything precious — because it is.</p>`
  },
  {id:'graduation',
    icon:'🎓',
    title:'Graduation & What Comes Next — Preparing for the Real World',
    sub:'The cap and gown are just the beginning. Here is what nobody tells you.',
    color:'#fde68a',
    showFor:['M','F','O',''],
    body:`
<p><strong>Graduation feels like a finish line. It is not. It is a starting line — and the race that follows has no syllabus, no teacher handing you a rubric, and no grade at the end of the semester to tell you if you are passing.</strong> That can be terrifying or exhilarating depending on how prepared you are. The goal of this page is to make it exhilarating.</p>

<h4>The Emotional Truth Nobody Talks About</h4>
<p>The months after graduation are disorienting. You lose the structure that organized every day of your life for 12+ years. Friendships that felt permanent start fading. You watch people around you seemingly figure it out while you feel lost. <strong>This is normal.</strong> Almost everyone feels this — most people just do not say it. The transition from "student" to "adult" is one of the biggest identity shifts a person goes through. Give yourself grace. You will not have it figured out immediately, and that is not failure — it is reality.</p>

<h4>The Practical Checklist</h4>
<p><strong>Before you walk across that stage, make sure you have:</strong></p>
<p>✅ <b>Your documents:</b> Birth certificate, Social Security card, passport (or apply for one), high school transcript, immunization records, insurance cards. Get these from your parents now and keep them in one secure place.</p>
<p>✅ <b>A bank account in your name</b> with online banking set up. If you only have a joint account with your parents, open your own. Financial independence starts with your own account.</p>
<p>✅ <b>A plan — even a rough one.</b> College, trade school, military, workforce, gap year — all are valid. What matters is that you chose it intentionally, not by default because you did not think about it.</p>
<p>✅ <b>Basic life skills covered.</b> Can you do your own laundry? Cook 5 basic meals? Make a budget? Schedule a doctor appointment? File basic taxes? Read a lease? If not, those are your homework assignments before move-out day.</p>
<p>✅ <b>A resume and an email address that is professional.</b> firstname.lastname@gmail.com — not xXgamer420Xx@hotmail.com. This sounds small but it matters more than you think.</p>

<h4>The Five Paths (All Are Valid)</h4>
<p><b style="color:#60a5fa;">🎓 College / University:</b> The traditional 4-year path. Ideal if you have a clear career goal that requires a degree (engineering, medicine, teaching, law) or if you want the campus experience and have a plan to avoid crippling debt. Apply for every scholarship you can find. Community college for the first 2 years saves tens of thousands of dollars with the same degree at the end.</p>
<p><b style="color:#22c55e;">🔧 Trade School / Certification:</b> Electricians, plumbers, welders, HVAC technicians, dental hygienists, and IT professionals often earn more than bachelor's degree holders — with less debt and a 2-year head start. Trades are in massive demand and many programs pay you while you learn.</p>
<p><b style="color:#f5a623;">🎖️ Military Service:</b> Structured environment, immediate income, healthcare, housing, and the GI Bill (which pays for college after service). Five branches, hundreds of career fields, and the discipline and network you build lasts a lifetime. Not for everyone — but transformational for those it fits.</p>
<p><b style="color:#a78bfa;">💼 Straight to Work:</b> Nothing wrong with starting to work immediately. Many successful people never went to college. The key: pick a field with growth potential, not just whatever pays this week. Learn skills on the job, take free online courses, and always be building toward something — not just clocking hours.</p>
<p><b style="color:#f472b6;">🌍 Gap Year:</b> A structured gap year (travel, volunteering, working, or a combination) can provide clarity that rushing into college never will. The key word is structured — a gap year with no plan becomes a gap decade. Set specific goals: save $X, volunteer Y hours, visit Z places, learn this skill.</p>

<h4>Wisdom From People Who Have Been Where You Are</h4>
<p><b style="color:var(--tx);">"The first year after graduation is about building habits, not achieving dreams."</b> Your morning routine, how you spend your free time, who you surround yourself with, and how you handle money right now will determine where you are in 5 years more than any single decision.</p>
<p style="margin-top:.4rem;"><b style="color:var(--tx);">"Stay close to the people who knew you before you had anything."</b> The friends, mentors, and family members who invested in you when you were just a kid with potential — those are your real people. Success will attract a lot of new faces. Loyalty is revealed in seasons of struggle, not celebration.</p>
<p style="margin-top:.4rem;"><b style="color:var(--tx);">"Learn to be alone without being lonely."</b> The ability to sit with yourself — no music, no phone, no distraction — and be okay is one of the most important skills an adult can develop. Journaling, walking, praying, and thinking are not boring — they are how you process a world that is moving fast.</p>
<p style="margin-top:.4rem;"><b style="color:var(--tx);">"Your twenties are for building. Not arriving."</b> You will compare yourself to people online who seem to have it together. They don't. Most of them are performing. Your job in your twenties is to learn, fail, adapt, build skills, build character, and show up consistently. The results come later — and they come in proportion to the foundation you are building now.</p>
<p style="margin-top:.4rem;"><b style="color:var(--tx);">"Nobody is coming to save you — and that is the best news you will ever hear."</b> It means your life is fully in your hands. Every decision is yours. Every consequence is yours. Every victory is yours. That is terrifying at first and then it becomes the most empowering realization of your life. You are not waiting for permission. You are the author of this story. Write something worth reading.</p>`
  },
  {id:'pills',
    icon:'💊',
    title:'Pills & Prescription Drugs — The Danger Nobody Sees Coming',
    sub:'Why medicine cabinets are more dangerous than street corners',
    color:'#ef4444',
    showFor:['M','F','O',''],
    body:`
<p><strong>The deadliest drug epidemic in American history is not caused by something bought on a street corner.</strong> It is caused by pills — prescription medications that start in medicine cabinets, get shared between friends, or are bought through social media. Fentanyl alone kills over 100,000 Americans per year, and it is now found in counterfeit pills that look identical to real prescription medications.</p>

<h4>How It Starts</h4>
<p>Almost nobody intends to develop a pill problem. The most common paths: <b>A legitimate prescription</b> after surgery or injury — opioid painkillers are powerfully addictive, and dependence can develop in as little as 5 days of use. <b>Taking someone else's medication</b> — a friend's Adderall to study, a parent's Xanax for anxiety, a leftover Vicodin for a headache. It feels safe because "it's medicine." <b>Buying pills through social media</b> — Snapchat, Instagram, and other platforms are flooded with dealers selling what look like legitimate Percocet, Xanax, or Adderall. Many of these are counterfeit pills pressed with fentanyl. <b>One pill can kill.</b> This is not exaggeration. The DEA has confirmed that 6 out of 10 counterfeit pills tested contain a lethal dose of fentanyl.</p>

<h4>What You Need to Know</h4>
<p><b style="color:#ef4444;">Never take a pill that was not prescribed to you by your doctor and dispensed by a pharmacy.</b> Period. No exceptions. Not from a friend, not from a family member, not from someone online. You cannot see, smell, or taste fentanyl. A pill that looks exactly like Xanax or Percocet can contain enough fentanyl to kill you.</p>
<p><b>Prescription medications are real drugs.</b> Opioids (Vicodin, OxyContin, Percocet) are chemically similar to heroin. Benzodiazepines (Xanax, Valium, Klonopin) cause severe physical dependence. Stimulants (Adderall, Ritalin) are amphetamines. Mixing any of these with alcohol can be fatal. These are not "safer" because a doctor prescribed them to someone — they are some of the most addictive substances on earth.</p>
<p><b>Addiction is not a character flaw.</b> It is a brain disease. These substances physically rewire your brain's reward system. People who become addicted are not weak — they are trapped by chemistry. The only guaranteed way to avoid prescription drug addiction is to never misuse them in the first place.</p>

<h4>What to Do</h4>
<p>If you are prescribed pain medication after surgery, take the minimum dose for the minimum time. Ask your doctor about non-opioid alternatives. If someone offers you pills, say no — it is not worth your life. If you know someone struggling with pill use, tell an adult you trust. If you or someone you know has taken something and is not responsive, call 911 immediately and say you suspect an opioid overdose — Narcan (naloxone) can reverse it if administered in time. Many states have Good Samaritan laws that protect you from legal trouble if you call for help during an overdose.</p>`
  },
  {id:'ms-to-hs',
    icon:'🏫',
    title:'Middle School to High School — The Jump Nobody Prepares You For',
    sub:'What changes, what stays, and how to own it from day one',
    color:'#38bdf8',
    showFor:['M','F','O',''],
    body:`
<p><strong>High school is a different world.</strong> More freedom, more responsibility, more people, more pressure, and more opportunity. The jump from 8th grade to 9th grade is one of the biggest transitions of your life — and most people stumble through it without a plan. You do not have to.</p>

<h4>What Actually Changes</h4>
<p><b style="color:var(--tx);">Grades matter now — permanently.</b> Your high school transcript follows you to college applications, scholarships, and some jobs. A bad semester in middle school disappears. A bad semester freshman year sits on your record for four years. Start strong — maintaining a good GPA is far easier than recovering a bad one.</p>
<p><b style="color:var(--tx);">The social world reshuffles.</b> Your middle school friend group will change, sometimes dramatically. People you were close to may drift. People you never talked to may become your best friends. This is normal. Be open to new connections while staying loyal to the people who have your back.</p>
<p><b style="color:var(--tx);">Nobody holds your hand anymore.</b> Teachers will not chase you for missing assignments. Counselors will not remind you to study. You are expected to manage your own schedule, deadlines, and responsibilities. The skills you build now carry into college and career.</p>

<h4>How to Win Freshman Year</h4>
<p>📚 <b>Get organized from day one.</b> Planner, study space, homework before screens. 🤝 <b>Join one thing you care about.</b> Sports, band, clubs — this is where friendships and experiences happen. 🗣️ <b>Build teacher relationships early.</b> They advocate for students they know. 🧠 <b>Your reputation starts fresh.</b> Whatever you were in middle school, you get to decide who you are now.</p>

<h4>Mistakes to Avoid</h4>
<p>Blowing off freshman year because "it doesn't count" (it does — colleges see all four years). Trying to be cool instead of genuine. Letting one bad grade spiral into giving up on a class. Comparing your experience to social media or TV — real high school is nothing like the movies.</p>`
  },
  {id:'empathy-gu',icon:'🫂',title:'Empathy — Understanding What Others Feel',sub:'The skill that makes every relationship better',color:'#a78bfa',showFor:[],body:`<p><strong>Empathy is not "being nice." It is the ability to understand someone else's feelings even when you have not experienced the same thing.</strong></p><p><b>Why it matters for YOU right now:</b> Empathetic people have stronger friendships, are chosen as leaders more often, do better in job interviews, and build romantic relationships that actually last. It is the single most predictor of social success at any age.</p><p><b>The three types of empathy:</b></p><p><b>Cognitive empathy</b> — understanding WHAT someone is feeling and WHY. "She is upset because she felt excluded." This is a thinking skill. <b>Emotional empathy</b> — actually FEELING what someone else feels. When your friend cries and your chest tightens — that is emotional empathy. <b>Compassionate empathy</b> — understanding + feeling + taking action. Not just knowing they are hurting, but doing something about it.</p><p><b>How to build it:</b> Before judging anyone, ask: "What might be happening in their life that I can't see?" Listen without planning your response. Read books about people whose lives are different from yours. When someone tells you something hard, don't immediately relate it to yourself — sit with THEIR experience first.</p><p><b>The hard truth:</b> Empathy requires discomfort. You have to be willing to feel someone else's pain, confusion, or frustration. Most people avoid this because it is easier to judge. The people who lean in become the ones everyone trusts.</p>`},
  {id:'emotional-awareness',icon:'🧠',title:'Emotional Awareness — Know What You Feel and Why',sub:'Name it to tame it',color:'#60a5fa',showFor:[],body:`<p><strong>Most people cannot name their emotions beyond "good," "bad," or "fine."</strong> But there are hundreds of emotional states, and the more precisely you can identify what you are feeling, the better you can respond to it.</p><p><b>Why this matters:</b> "I'm angry" leads to one response. "I'm actually hurt because I felt disrespected" leads to a completely different — and more effective — response. Naming the emotion reduces its power over you. Neuroscience shows that simply labeling a feeling activates your prefrontal cortex and calms your amygdala.</p><p><b>The emotion layers:</b> Most emotions have layers. On the surface you might feel angry, but underneath that anger might be fear, embarrassment, or sadness. Dig one layer deeper before reacting: "I feel angry. But underneath that, I feel scared that I'm not good enough."</p><p><b>Daily practice:</b> Check in with yourself 3 times a day — morning, afternoon, evening. Ask: "What am I feeling right now? Why?" Write it down in one sentence. Over time, you will develop an emotional vocabulary that helps you navigate every situation with more clarity and less reactivity.</p><p><b>Emotional awareness is not weakness.</b> Soldiers, athletes, CEOs, and surgeons all train emotional awareness. It is the foundation of performing under pressure.</p>`},
  {id:'communication-gu',icon:'🗣️',title:'Communication Skills — Say What You Mean, Mean What You Say',sub:'The skill behind every success in life',color:'#22c55e',showFor:[],body:`<p><strong>Every argument you have ever had was, at its core, a communication failure.</strong> Someone did not say what they meant, did not listen to what was said, or misread the intention behind the words.</p><p><b>The basics most people get wrong:</b> Make eye contact when someone is talking to you. Put your phone down — not face-down, away. Don't interrupt, even when you have the perfect response. Ask follow-up questions that prove you were listening: "What did you mean by that?" "How did that make you feel?"</p><p><b>Conflict communication:</b> Use "I feel" statements instead of "You always" accusations. "I feel frustrated when plans change last minute" is received completely differently than "You always cancel on me." One invites conversation. The other invites defense.</p><p><b>Digital communication:</b> Texts don't carry tone. What you meant as sarcasm reads as cruelty. What you meant as casual reads as cold. When something matters, call or talk in person. And never — ever — have a serious conversation over text. Screenshots last forever.</p><p><b>The listening ratio:</b> Listen 70% of the time, talk 30%. The best communicators in any room are the ones who listen the most. People trust those who hear them.</p>`},
  {id:'self-discipline-gu',icon:'💪',title:'Self-Discipline — The Bridge Between Goals and Reality',sub:'Doing what needs to be done when you don\'t feel like it',color:'#fbbf24',showFor:[],body:`<p><strong>Motivation is a feeling. It comes and goes like the weather.</strong> If you only work when you feel motivated, you will accomplish almost nothing important. Discipline is doing the thing whether you feel like it or not.</p><p><b>Why discipline beats motivation:</b> Motivation says "I feel like working out today." Discipline says "It's Monday — I work out on Mondays." One depends on emotion. The other depends on commitment. Successful people are not more motivated than you. They are more disciplined.</p><p><b>How to build it — start absurdly small:</b> Don't commit to "work out every day." Commit to "put on my shoes." Once the shoes are on, momentum takes over. Don't commit to "study for 3 hours." Commit to "open the textbook." The 5-minute start beats the all-day plan every time.</p><p><b>The compound effect:</b> Reading 10 pages a day = 12 books a year. Practicing 15 minutes daily = 91 hours a year. Saving $5 a day = $1,825 a year. Discipline is not dramatic. It is boring, consistent, and unstoppable. And after a year, the results are extraordinary.</p><p><b>WHY this prepares you for adulthood:</b> Every job, relationship, and goal requires doing things you don't feel like doing. The person who builds discipline now has a 10-year head start on everyone who waits for motivation.</p>`},
  {id:'self-confidence-gu',icon:'🌟',title:'Self-Confidence — Built, Not Born',sub:'Nobody is born confident. It is a skill you develop.',color:'#f472b6',showFor:[],body:`<p><strong>Confidence is not "believing you are great." Confidence is trusting yourself to handle whatever comes.</strong> It is not arrogance (thinking you're better than others). It is quiet certainty that you can figure things out, recover from failure, and keep going.</p><p><b>Where confidence actually comes from:</b> Not from compliments, not from social media likes, not from being the best. It comes from <b>evidence</b>. Every time you do something hard and survive, your brain files it as evidence: "I can handle hard things." Every time you fail and get back up, your brain files: "Failure doesn't destroy me." Stack enough evidence and confidence becomes automatic.</p><p><b>How to build it:</b> Do things that scare you — small things at first. Raise your hand in class. Introduce yourself to someone new. Try the hard assignment before asking for help. Each small act of courage deposits into your confidence account.</p><p><b>The confidence killers:</b> Comparing yourself to others (you're seeing their highlight reel, not their struggle). Negative self-talk ("I'm so stupid" — you would never say that to a friend). Avoiding challenges (comfort zones feel safe but they shrink your confidence). Seeking approval instead of building competence.</p><p><b>The truth:</b> The most confident people you know were once terrified. They just kept doing the thing despite the fear. That is the only difference.</p>`},
  {id:'decision-making-gu',icon:'🧭',title:'Decision Making — How to Choose Well When It Matters',sub:'The skill that shapes your entire future',color:'#06b6d4',showFor:[],body:`<p><strong>You will make thousands of decisions in your life. A few dozen of them will determine everything.</strong> Who you spend time with. What you study. What habits you build. Whether you speak up or stay silent. Learning to decide well is learning to live well.</p><p><b>The framework:</b> For any important decision, ask five questions: 1) What are ALL my options? (There are usually more than two.) 2) What happens if I choose each one — in 10 minutes? 10 months? 10 years? 3) Which option aligns with who I want to become? 4) What would I advise my best friend to do? 5) Which choice can I live with even if it goes wrong?</p><p><b>Speed vs quality:</b> Small decisions (what to eat, what to wear) — decide fast. Don't waste mental energy. Big decisions (what classes to take, who to date, whether to try substances) — slow down. Gather information. Sleep on it.</p><p><b>When you decide wrong:</b> You will. Everyone does. The skill is not perfect decision-making — it is fast recovery. Acknowledge the mistake, learn the lesson, adjust course, move forward. Dwelling on bad decisions is itself a bad decision.</p><p><b>WHY this matters now:</b> Every decision you make as a teenager is practice for the decisions that will define your adult life. Start building the muscle now. The people who become great decision-makers started by making lots of small decisions intentionally.</p>`}
,
  {id:'world-religions',icon:'🕊️',title:'Freedom of Religion — Understanding What Others Believe',sub:'Respecting all faiths while knowing your own',color:'#a78bfa',showFor:[],body:`<p><strong>The United States was founded on freedom of religion. This means every person has the right to believe — or not believe — according to their own conscience.</strong> Understanding what others believe does not weaken your faith. It strengthens your ability to respect, communicate with, and love people who see the world differently.</p>
<h4>Christianity</h4><p>The world's largest religion (~2.4 billion followers). Christians believe in one God who exists as the Trinity (Father, Son, Holy Spirit). They believe Jesus Christ is the Son of God who died for humanity's sins and rose from the dead. The Bible is the sacred text. Core values: love, forgiveness, salvation through grace, service to others. Major branches include Catholic, Protestant, and Orthodox.</p>
<h4>Islam</h4><p>~1.9 billion followers worldwide. Muslims believe in one God (Allah) and that Muhammad is His final prophet. The Quran is the holy book. The Five Pillars: faith declaration, prayer five times daily, charity, fasting during Ramadan, and pilgrimage to Mecca. Core values: submission to God, community, justice, compassion, and peace.</p>
<h4>Judaism</h4><p>One of the oldest religions (~16 million followers). Jews believe in one God and follow the Torah (first five books of the Hebrew Bible). They believe in a covenant between God and the Jewish people. Key practices: Sabbath observance, dietary laws (kosher), and holidays like Passover and Yom Kippur. Core values: justice, learning, community, and repairing the world (tikkun olam).</p>
<h4>Hinduism</h4><p>~1.2 billion followers, one of the world's oldest religions. Hinduism has many expressions but generally involves belief in Brahman (ultimate reality), karma (actions have consequences), dharma (moral duty), and reincarnation. Sacred texts include the Vedas and Bhagavad Gita. Core values: truth, non-violence, self-discipline, and respect for all living things.</p>
<h4>Buddhism</h4><p>~500 million followers. Founded on the teachings of Siddhartha Gautama (the Buddha). Buddhists follow the Four Noble Truths (life involves suffering, suffering comes from attachment, suffering can end, the path to end it is the Eightfold Path). No requirement to believe in a god. Core values: compassion, mindfulness, non-attachment, and inner peace.</p>
<h4>Sikhism</h4><p>~30 million followers. Founded by Guru Nanak in the 15th century. Sikhs believe in one God, equality of all people, honest work, sharing with others, and service to humanity. The Guru Granth Sahib is the holy scripture. Core values: truth, equality, service, and devotion to God.</p>
<h4>Atheism & Agnosticism</h4><p><b>Atheism:</b> The belief that no gods exist. Atheists often base their worldview on science, reason, and secular ethics. <b>Agnosticism:</b> The position that the existence of God is unknown or unknowable. Agnostics may live with open questions about spiritual matters. Both positions are protected under freedom of religion.</p>
<h4>What This Means for You</h4><p>You will go to school with, work alongside, and befriend people of every religion and none. Your job is not to convert them or argue with them. Your job is to understand what they believe and why, to treat them with the same dignity you want for yourself, and to be secure enough in your own beliefs that you don't feel threatened by theirs. "In essentials, unity. In non-essentials, liberty. In all things, love."</p>`}];

function buildGrowingGrid(){
  const el = document.getElementById('growingGrid'); if(!el) return;
  const sex = (D.profile||{}).sex || '';
  if(!D.growingUpRead) D.growingUpRead = {};

  const topics = GROWING_TOPICS.filter(t =>
    !t.showFor || t.showFor.length === 0 || t.showFor.includes(sex) || t.showFor.includes('')
  );

  const readCount = topics.filter(t=>D.growingUpRead[t.id]).length;

  // Progress bar
  let header = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;grid-column:1/-1;">
    <div style="font-size:.72rem;color:var(--tx2);">${readCount}/${topics.length} topics read</div>
    <div style="width:120px;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;">
      <div style="height:100%;width:${Math.round(readCount/topics.length*100)}%;background:#22c55e;border-radius:3px;"></div>
    </div>
  </div>`;

  el.innerHTML = header + topics.map(t => {
    const isRead = !!D.growingUpRead[t.id];
    return `<div onclick="openGrowingTopic('${t.id}')" style="
      border-radius:13px;padding:.85rem .8rem;
      background:${isRead?'rgba(34,197,94,.04)':'rgba(255,255,255,.04)'};
      border:1px solid ${isRead?'rgba(34,197,94,.12)':'rgba(255,255,255,.09)'};
      cursor:pointer;transition:all .16s;
      border-left:3px solid ${t.color};position:relative;">
      ${isRead?'<div style="position:absolute;top:.5rem;right:.5rem;font-size:.55rem;background:rgba(34,197,94,.15);color:#22c55e;padding:.1rem .35rem;border-radius:4px;font-weight:700;">✓ Read</div>':''}
      <div style="font-size:1.6rem;margin-bottom:.4rem;">${t.icon}</div>
      <div style="font-size:.84rem;font-weight:800;color:var(--tx);line-height:1.3;margin-bottom:.2rem;">${t.title}</div>
      <div style="font-size:.7rem;color:var(--tx2);">${t.sub}</div>
    </div>`;
  }).join('');
}

function toggleGrowingRead(topicId, checked){
  if(!D.growingUpRead) D.growingUpRead = {};
  if(checked){
    D.growingUpRead[topicId] = new Date().toISOString().slice(0,10);
    const topic = GROWING_TOPICS.find(t=>t.id===topicId);
    logActivity('growingup', 'Read: '+(topic?topic.title:topicId));
    earnPB(3, 'Growing Up topic read');
    showToast('Topic marked as read ✓');
  } else {
    delete D.growingUpRead[topicId];
  }
  save();
  buildGrowingGrid();
}

function openGrowingTopic(id){
  const t = GROWING_TOPICS.find(x => x.id === id); if(!t) return;
  if(!D.growingUpRead) D.growingUpRead = {};
  const isRead = !!D.growingUpRead[id];
  const readDate = D.growingUpRead[id] || '';
  document.getElementById('gtIcon').textContent = t.icon;
  document.getElementById('gtTitle').textContent = t.title;
  document.getElementById('gtSub').textContent = t.sub;
  document.getElementById('gtBody').innerHTML = t.body + `
    <div style="margin-top:1.2rem;padding-top:.8rem;border-top:2px solid rgba(255,255,255,.06);" id="gtReadArea">
      <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;padding:.6rem .8rem;border-radius:10px;background:${isRead?'rgba(34,197,94,.08)':'rgba(255,255,255,.03)'};border:1px solid ${isRead?'rgba(34,197,94,.2)':'rgba(255,255,255,.08)'};">
        <input type="checkbox" ${isRead?'checked':''} onchange="markGrowingReadFromModal('${id}',this)" style="width:20px;height:20px;cursor:pointer;accent-color:#22c55e;flex-shrink:0;">
        <div>
          <div style="font-size:.82rem;font-weight:700;color:${isRead?'#22c55e':'var(--tx)'};">${isRead?'✅ Marked as Read':'Mark as Read'}</div>
          <div style="font-size:.65rem;color:var(--tx3);">${readDate?'Completed on '+readDate:'Check this box when you have finished reading this topic'}</div>
        </div>
      </label>
    </div>`;
  document.getElementById('growingModal').querySelector('.md').style.borderTop = `3px solid ${t.color}`;
  openModal('growingModal');
}

function markGrowingReadFromModal(id, checkbox){
  toggleGrowingRead(id, checkbox.checked);
  // Update the read area in-place without reopening
  const area = document.getElementById('gtReadArea');
  if(!area) return;
  const isRead = !!D.growingUpRead[id];
  const readDate = D.growingUpRead[id] || '';
  area.innerHTML = `
    <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;padding:.6rem .8rem;border-radius:10px;background:${isRead?'rgba(34,197,94,.08)':'rgba(255,255,255,.03)'};border:1px solid ${isRead?'rgba(34,197,94,.2)':'rgba(255,255,255,.08)'};">
      <input type="checkbox" ${isRead?'checked':''} onchange="markGrowingReadFromModal('${id}',this)" style="width:20px;height:20px;cursor:pointer;accent-color:#22c55e;flex-shrink:0;">
      <div>
        <div style="font-size:.82rem;font-weight:700;color:${isRead?'#22c55e':'var(--tx)'};">${isRead?'✅ Marked as Read':'Mark as Read'}</div>
        <div style="font-size:.65rem;color:var(--tx3);">${readDate?'Completed on '+readDate:'Check this box when you have finished reading this topic'}</div>
      </div>
    </label>`;
}

// ═══════════════════════════════════════════════════
//  DATA MANAGEMENT — Export / Import / Reset
// ═══════════════════════════════════════════════════

function exportAllData(){
  try {
    const data = JSON.parse(localStorage.getItem('lifeos_data') || '{}');
    data._exportDate = new Date().toISOString();
    data._exportVersion = 'LIFEOS_v3';
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (data.name || 'lifeos').replace(/[^a-zA-Z0-9]/g,'_');
    a.download = `LIFEOS_backup_${name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup exported! 💾');
  } catch(e) {
    showToast('Export failed — ' + e.message);
  }
}

function importAllData(input){
  const file = input.files[0];
  if(!file) return;
  if(!confirm('This will REPLACE all your current data with the backup file. Are you sure?')) {
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e){
    try {
      const data = JSON.parse(e.target.result);
      if(!data || typeof data !== 'object') throw new Error('Invalid backup file');
      const cu = localStorage.getItem('lifeos_cloud_url');
      const ck = localStorage.getItem('lifeos_cloud_key');
      localStorage.setItem('lifeos_data', JSON.stringify(data));
      if(cu) localStorage.setItem('lifeos_cloud_url', cu);
      if(ck) localStorage.setItem('lifeos_cloud_key', ck);
      showToast('Data restored! Reloading... ✅');
      setTimeout(() => location.reload(), 800);
    } catch(err) {
      showToast('Invalid backup file — ' + err.message);
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function resetAllData(){
  if(!confirm('⚠️ This will permanently delete ALL your data — finances, goals, health logs, journal entries, everything.\n\nThis cannot be undone.\n\nAre you absolutely sure?')) return;
  const answer = prompt('Type YES to confirm complete data reset:');
  if(answer !== 'YES') {
    showToast('Reset cancelled');
    return;
  }
  localStorage.removeItem('lifeos_data');
  showToast('All data cleared. Reloading... 🗑');
  setTimeout(() => location.reload(), 800);
}



// ── CUSTOM LANGUAGE PICKER ──────────────────────────────
const LANGS = [
  {code:'en',    label:'🇺🇸', name:'English'},
  {code:'es',    label:'🇪🇸', name:'Spanish'},
  {code:'fr',    label:'🇫🇷', name:'French'},
  {code:'de',    label:'🇩🇪', name:'German'},
  {code:'pt',    label:'🇧🇷', name:'Portuguese'},
  {code:'it',    label:'🇮🇹', name:'Italian'},
  {code:'pl',    label:'🇵🇱', name:'Polish'},
  {code:'ru',    label:'🇷🇺', name:'Russian'},
  {code:'ar',    label:'🇸🇦', name:'Arabic'},
  {code:'hi',    label:'🇮🇳', name:'Hindi'},
  {code:'zh-CN', label:'🇨🇳', name:'Chinese (Simplified)'},
  {code:'zh-TW', label:'🇹🇼', name:'Chinese (Traditional)'},
  {code:'ko',    label:'🇰🇷', name:'Korean'},
  {code:'ja',    label:'🇯🇵', name:'Japanese'},
  {code:'vi',    label:'🇻🇳', name:'Vietnamese'},
  {code:'tl',    label:'🇵🇭', name:'Filipino'},
  {code:'sw',    label:'🇰🇪', name:'Swahili'},
  {code:'ha',    label:'🇳🇬', name:'Hausa'},
];

function googleTranslateElementInit(){
  // Init hidden — we use our own picker UI
  new google.translate.TranslateElement({
    pageLanguage:'en',
    includedLanguages:'en,es,fr,de,pt,zh-CN,zh-TW,ar,hi,ko,ja,ru,it,pl,vi,tl,sw,ha',
    autoDisplay:false
  },'google_translate_element');
}

function doTranslate(langCode){
  // Set the googtrans cookie and reload — most reliable method
  if(langCode === 'en'){
    // Remove translation
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
  } else {
    const val = '/en/' + langCode;
    document.cookie = 'googtrans=' + val + '; path=/';
    document.cookie = 'googtrans=' + val + '; path=/; domain=' + location.hostname;
  }
  // Trigger via the hidden select if available, else reload
  const sel = document.querySelector('#google_translate_element select, .goog-te-combo');
  if(sel){
    sel.value = langCode;
    sel.dispatchEvent(new Event('change'));
  } else {
    location.reload();
  }
  closeLangPicker();
}

function buildLangPicker(){
  let el = document.getElementById('langPickerDropdown');
  if(el) el.remove();
  el = document.createElement('div');
  el.id = 'langPickerDropdown';
  el.style.cssText = `
    position:fixed;z-index:2147483647;isolation:isolate;
    background:#0d1421;
    border:1px solid rgba(255,255,255,.12);
    border-radius:12px;
    padding:6px;
    width:200px;
    box-shadow:0 16px 48px rgba(0,0,0,.9);
    display:none;
    max-height:380px;
    overflow-y:auto;
  `;
  el.innerHTML = LANGS.map(l => `
    <div onclick="doTranslate('${l.code}')"
      style="padding:7px 12px;border-radius:8px;cursor:pointer;transition:all .12s;"
      onmouseenter="this.style.background='rgba(255,255,255,.08)'"
      onmouseleave="this.style.background=''">
      <span style="font-size:.68rem;font-weight:700;font-family:var(--fn);color:#d4e8f8;letter-spacing:.3px;">${l.name}</span>
    </div>`).join('');
  document.body.appendChild(el);
  document.addEventListener('click', function closeOnOutside(e){
    if(!el.contains(e.target) && !e.target.closest('#translateWrap') && !e.target.closest('.mqb-lang')){
      el.style.display = 'none';
    }
  });
}

function toggleLangPicker(anchorEl){
  buildLangPicker();
  const el = document.getElementById('langPickerDropdown');
  if(el.style.display === 'block'){ el.style.display='none'; return; }
  const r = anchorEl.getBoundingClientRect();
  el.style.top = (r.bottom + 6) + 'px';
  // Align right edge to anchor right edge, but keep on screen
  const left = Math.max(8, Math.min(r.right - 210, window.innerWidth - 218));
  el.style.left = left + 'px';
  el.style.display = 'block';
}

function closeLangPicker(){
  const el = document.getElementById('langPickerDropdown');
  if(el) el.style.display = 'none';
}

function toggleMobTranslate(){
  const btn = document.querySelector('#mobileQuickRow .mqb-lang');
  toggleLangPicker(btn || document.body);
}

function toggleTranslateDropdown(){
  const btn = document.getElementById('translateWrap');
  toggleLangPicker(btn || document.body);
}

// ── CHILD AVATAR PICKER ──────────────────────────────────────
const CAM_KIDS    = ['👦','👧','🧒','🧑','👨','👩','👦🏻','👧🏻','👦🏽','👧🏽','👦🏿','👧🏿','🧑‍🎓','👨‍🎓','👩‍🎓','🧑‍🎤'];
const CAM_ANIMALS = ['🦁','🐯','🐺','🦊','🐻','🐼','🐨','🐸','🦋','🦄','🐶','🐱','🐰','🐹','🦖','🦅'];
const CAM_SPORTS  = ['⚽','🏀','🏈','⚾','🎮','🎵','🎸','🏆','🚀','🔥','💪','👑','🌟','⚡','🎯','🏄'];

let _camPendingEmoji = null;
let _camPendingImg = null;

function _camBuildGrid(containerId, emojis){
  const grid = document.getElementById(containerId);
  if(!grid) return;
  grid.innerHTML = emojis.map(a => {
    const isSel = (D.childAvatar === a && !D.childAvatarPhoto);
    return `<div class="cam-av${isSel?' selected':''}" onclick="camSelectEmoji('${a}',this)" title="${a}">${a}</div>`;
  }).join('');
}

function openChildAvatarPicker(){
  _camPendingEmoji = null;
  _camPendingImg = null;

  // Build grids
  _camBuildGrid('camGridKids', CAM_KIDS);
  _camBuildGrid('camGridAnimals', CAM_ANIMALS);
  _camBuildGrid('camGridSports', CAM_SPORTS);

  // Set preview to current state
  const previewEmoji = document.getElementById('camPreviewEmoji');
  const previewImg = document.getElementById('camPreviewImg');
  if(D.childAvatarPhoto){
    if(previewImg){ previewImg.src = D.childAvatarPhoto; previewImg.style.display = 'block'; }
    if(previewEmoji) previewEmoji.style.display = 'none';
  } else {
    if(previewImg) previewImg.style.display = 'none';
    if(previewEmoji){ previewEmoji.style.display = ''; previewEmoji.textContent = D.childAvatar || '👤'; }
  }

  // Setup drag & drop
  const dropZone = document.getElementById('camDropZone');
  if(dropZone && !dropZone._ddSetup){
    dropZone._ddSetup = true;
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if(file && file.type.startsWith('image/')) camReadFile(file);
    });
  }

  document.getElementById('childAvatarModal').classList.add('open');
}

function closeChildAvatarPicker(){
  document.getElementById('childAvatarModal').classList.remove('open');
}

function camSelectEmoji(emoji, el){
  _camPendingEmoji = emoji;
  _camPendingImg = null;
  // Deselect all
  document.querySelectorAll('.cam-av').forEach(a => a.classList.remove('selected'));
  el.classList.add('selected');
  const previewEmoji = document.getElementById('camPreviewEmoji');
  const previewImg = document.getElementById('camPreviewImg');
  if(previewImg) previewImg.style.display = 'none';
  if(previewEmoji){ previewEmoji.style.display = ''; previewEmoji.textContent = emoji; }
}

function camReadFile(file){
  const reader = new FileReader();
  reader.onload = function(e){
    _camPendingImg = e.target.result;
    _camPendingEmoji = null;
    document.querySelectorAll('.cam-av').forEach(a => a.classList.remove('selected'));
    const previewEmoji = document.getElementById('camPreviewEmoji');
    const previewImg = document.getElementById('camPreviewImg');
    if(previewEmoji) previewEmoji.style.display = 'none';
    if(previewImg){ previewImg.src = _camPendingImg; previewImg.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
}

function camHandleUpload(input){
  const file = input.files[0]; if(!file) return;
  camReadFile(file);
}

function camClearPhoto(){
  _camPendingImg = null;
  _camPendingEmoji = '👤';
  document.querySelectorAll('.cam-av').forEach(a => a.classList.remove('selected'));
  const previewEmoji = document.getElementById('camPreviewEmoji');
  const previewImg = document.getElementById('camPreviewImg');
  if(previewImg) previewImg.style.display = 'none';
  if(previewEmoji){ previewEmoji.style.display = ''; previewEmoji.textContent = '👤'; }
}

function camSave(){
  if(_camPendingImg !== null){
    D.childAvatarPhoto = _camPendingImg;
    D.childAvatar = null;
  } else if(_camPendingEmoji !== null){
    D.childAvatar = _camPendingEmoji;
    D.childAvatarPhoto = null;
  }
  save();
  applyChildAvatar();
  closeChildAvatarPicker();
  showToast('Avatar updated! ✓');
}

function applyChildAvatar(){
  const defaultEl = document.getElementById('childAvatarDefault');
  const photoEl = document.getElementById('childAvatarPhoto');
  if(!defaultEl || !photoEl) return;
  if(D.childAvatarPhoto){
    photoEl.src = D.childAvatarPhoto;
    photoEl.style.display = 'block';
    defaultEl.style.display = 'none';
  } else {
    photoEl.style.display = 'none';
    defaultEl.style.display = '';
    defaultEl.textContent = D.childAvatar || '👤';
  }
}



// ══════════════ REFERRAL TAB ══════════════
async function initReferralTab(){
  const el = document.getElementById('refLinkDisplay');

  // Populate emails via JS (Cloudflare-proof)
  const em = 'info'+'@kingdom-creatives.com';
  const refEmailEl = document.getElementById('refEmailDisplay');
  const refPayoutEl = document.getElementById('refPayoutEmail');
  if(refEmailEl) refEmailEl.textContent = em;
  if(refPayoutEl) refPayoutEl.textContent = em;

  // Restore age gate if already confirmed this session
  const ageChecked = sessionStorage.getItem('ylcc_ref_age_ok');
  if(ageChecked === '1'){
    const cb = document.getElementById('refAgeCheck');
    if(cb) cb.checked = true;
    const main = document.getElementById('refMainContent');
    if(main) main.style.display = 'block';
  }

  if(!el) return;

  // Build ref code — use already-authenticated _supaUser first (no async needed)
  let refCode = null;

  if(_supaUser && _supaUser.id){
    // Use first segment of UUID — guaranteed unique per account
    refCode = _supaUser.id.split('-')[0].toUpperCase();
  } else if(supa){
    // Fallback: ask Supabase if _supaUser isn't set yet
    try{
      const { data } = await supa.auth.getUser();
      if(data && data.user) refCode = data.user.id.split('-')[0].toUpperCase();
    }catch(e){}
  }

  // Last resort: use parent name from local data
  if(!refCode){
    const rawName = (D.parentName || D.name || '').replace(/[^a-zA-Z0-9]/g,'');
    if(rawName) refCode = rawName.toUpperCase().substring(0,10);
  }

  if(refCode){
    el.textContent = 'https://www.yourlifecc.com/?ref=' + refCode;
    el.style.color = '#38bdf8';
  } else {
    el.textContent = 'Sign in to generate your link';
    el.style.color = 'var(--tx3)';
  }

  // Stats placeholder
  const t=document.getElementById('refStatTotal');
  const e=document.getElementById('refStatEarned');
  const p=document.getElementById('refStatPending');
  if(t) t.textContent='—';
  if(e) e.textContent='—';
  if(p) p.textContent='—';
}

function toggleRefAccess(cb){
  const main = document.getElementById('refMainContent');
  if(!main) return;
  if(cb.checked){
    main.style.display = 'block';
    sessionStorage.setItem('ylcc_ref_age_ok','1');
  } else {
    main.style.display = 'none';
    sessionStorage.removeItem('ylcc_ref_age_ok');
  }
}
function copyRefLink(){
  const el=document.getElementById('refLinkDisplay');
  if(!el) return;
  const link = el.textContent.trim();
  if(!link || link === 'Sign in to generate your link' || link === 'Loading your link...') return;
  navigator.clipboard.writeText(link).then(()=>{
    const btn=document.getElementById('refCopyBtn');
    if(btn){btn.textContent='✓ Copied!';btn.style.color='#22c55e';}
    setTimeout(()=>{if(btn){btn.textContent='Copy';btn.style.color='#38bdf8';}},2000);
  });
}
function refShareSMS(){
  const el=document.getElementById('refLinkDisplay');
  const link=el?el.textContent.trim():'https://www.yourlifecc.com';
  const msg=encodeURIComponent("Hey! Check out YourLife CC — it's a Life OS for families. Great for chores, goals, school tracking & more. Get $10 off with code REFER10: "+link);
  window.location.href='sms:?body='+msg;
}
function refShareEmail(){
  const el=document.getElementById('refLinkDisplay');
  const link=el?el.textContent.trim():'https://www.yourlifecc.com';
  const sub=encodeURIComponent("Check out YourLife CC — get $10 off");
  const body=encodeURIComponent("Hey!\n\nI've been using YourLife CC with my family — it's an all-in-one Life OS for chores, goals, school tracking, Bible study, and more.\n\nUse my link to sign up and get $10 off any plan with code REFER10:\n\n"+link+"\n\nHope your family loves it!");
  window.location.href='mailto:?subject='+sub+'&body='+body;
}
function copyRefCode(code,btn){
  navigator.clipboard.writeText(code).then(()=>{
    if(btn){btn.textContent='✓ Copied!';}
    setTimeout(()=>{if(btn)btn.textContent='Copy Code';},2000);
  });
}

(function(){
  var DRAW = new Date('2026-09-01T10:00:00-07:00');
  function tick(){
    var now  = new Date();
    var diff = DRAW - now;
    if(diff <= 0){
      ['tb-days','tb-hrs','tb-min','tb-sec'].forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.textContent = '00';
      });
      return;
    }
    var days = Math.floor(diff / (1000*60*60*24));
    var hrs  = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    var mins = Math.floor((diff % (1000*60*60)) / (1000*60));
    var secs = Math.floor((diff % (1000*60)) / 1000);
    var d = document.getElementById('tb-days');
    var h = document.getElementById('tb-hrs');
    var m = document.getElementById('tb-min');
    var s = document.getElementById('tb-sec');
    if(d) d.textContent = String(days).padStart(2,'0');
    if(h) h.textContent = String(hrs).padStart(2,'0');
    if(m) m.textContent = String(mins).padStart(2,'0');
    if(s) s.textContent = String(secs).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
})();

// ── ACCOUNT DELETION ─────────────────────────────────────────
function openDeleteAccountModal(){
  document.getElementById('deleteAccountConfirm').value = '';
  document.getElementById('deleteAccountMsg').textContent = '';
  const btn = document.getElementById('deleteAccountBtn');
  btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed';
  document.getElementById('deleteAccountModal').style.display = 'flex';
}

function closeDeleteAccountModal(){
  document.getElementById('deleteAccountModal').style.display = 'none';
}

function checkDeleteConfirm(){
  const val = document.getElementById('deleteAccountConfirm').value.trim();
  const btn = document.getElementById('deleteAccountBtn');
  const ready = val === 'DELETE';
  btn.disabled = !ready;
  btn.style.opacity = ready ? '1' : '.4';
  btn.style.cursor = ready ? 'pointer' : 'not-allowed';
}

async function confirmDeleteAccount(){
  const val = document.getElementById('deleteAccountConfirm').value.trim();
  if(val !== 'DELETE') return;
  const btn = document.getElementById('deleteAccountBtn');
  const msg = document.getElementById('deleteAccountMsg');
  btn.disabled = true;
  btn.textContent = 'Deleting…';
  msg.textContent = '';
  msg.style.color = '#f87171';

  try {
    const supa = getSupabase();
    if(!supa || !_supaUser){
      msg.textContent = 'You must be signed in to delete your account.';
      btn.disabled = false; btn.textContent = 'Delete Forever';
      return;
    }

    // Delete all data rows directly (RLS ensures users can only delete their own)
    const uid = _supaUser.id;
    const errors = [];

    const tables = ['profiles', 'families', 'billing_history', 'age_verifications', 'contest_entries'];
    for(const table of tables){
      try {
        const { error } = await supa.from(table).delete().eq('user_id', uid);
        if(error) errors.push(table + ': ' + error.message);
      } catch(e){ errors.push(table + ' exception'); }
    }

    if(errors.length > 0){
      console.warn('[Delete Account] Some rows could not be deleted:', errors);
      // Non-fatal — main profiles row is what matters
    }

    // Sign out the user
    await supa.auth.signOut();

    // Clear all local storage
    localStorage.clear();

    closeDeleteAccountModal();
    showToast('Account deleted. Goodbye 👋');
    setTimeout(function(){ window.location.href = '/'; }, 2000);
  } catch(e){
    console.error('Delete account error:', e);
    msg.textContent = 'Network error. Please try again or contact info@kingdom-creatives.com';
    btn.disabled = false; btn.textContent = 'Delete Forever';
  }
}

