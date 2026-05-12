/* =============================================================
   faith-resources.js — Christian Life Guide (F1.1)
   12 topical guides with full modal content. Filter tabs, modal
   open/close, ESC-to-close, click-outside-to-close, print support.
============================================================= */

let _faithResInitDone = false;
let _faithResEscBound = false;

function faithResourcesInit(){
  if (_faithResInitDone) return;
  faithResBindFilterTabs();
  faithResBindGlobalHandlers();
  _faithResInitDone = true;
}

function faithResBindFilterTabs(){
  const tabs = document.querySelectorAll('#s-christian-living .filter-tab');
  const cards = document.querySelectorAll('#s-christian-living .resource-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', function(){
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const cat = this.getAttribute('data-category');
      cards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function faithResBindGlobalHandlers(){
  // Click outside modal-content closes the modal.
  document.addEventListener('click', function(e){
    if (e.target.classList && e.target.classList.contains('modal-overlay') &&
        e.target.closest('#s-christian-living')) {
      e.target.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
  // ESC closes any open faith-resources modal.
  if (_faithResEscBound) return;
  _faithResEscBound = true;
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    const open = document.querySelector('#s-christian-living .modal-overlay.active');
    if (open) {
      open.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

// Open / close functions are global (called from inline onclick attributes
// inside the section markup). Prefixed with `faithRes` to avoid collision
// with the existing `openModal` / `closeModal` in ui.js, which take element
// IDs (not resource keys) and use a different `.open` class.
//
// Phase 5.8 Pass B: the modal renders INLINE inside #s-christian-living
// (no fixed overlay). Opening hides the card grid / filter tabs / hero
// banner and prepends a "← Back" pill at the top of the modal content.
// Closing restores the grid view.
function faithResOpenModal(resourceId){
  const modal = document.getElementById('modal-' + resourceId);
  if (!modal) return;
  const section = document.getElementById('s-christian-living');
  if (section) {
    const grid    = section.querySelector('.resource-container');
    const filters = section.querySelector('.filter-tabs');
    const header  = section.querySelector('.resource-header');
    if (grid)    grid.style.display    = 'none';
    if (filters) filters.style.display = 'none';
    if (header)  header.style.display  = 'none';
    // Hide any other open modal so only one inline panel is active at a time
    section.querySelectorAll('.modal-overlay.active').forEach(m => {
      if (m !== modal) m.classList.remove('active');
    });
    // Inject the "← Back" pill at the top of the active modal once
    const content = modal.querySelector('.modal-content');
    if (content && !content.querySelector('.clg-back-btn')) {
      const back = document.createElement('button');
      back.className = 'clg-back-btn';
      back.type = 'button';
      back.innerHTML = '← Back to all topics';
      back.onclick = function(){ faithResCloseModal(resourceId); };
      content.insertBefore(back, content.firstChild);
    }
  }
  modal.classList.add('active');
  // Scroll the active modal into view so the user sees the topic top
  try { modal.scrollIntoView({behavior:'smooth', block:'start'}); } catch(e){}
}

function faithResCloseModal(resourceId){
  const modal = document.getElementById('modal-' + resourceId);
  if (!modal) return;
  modal.classList.remove('active');
  const section = document.getElementById('s-christian-living');
  if (section) {
    const grid    = section.querySelector('.resource-container');
    const filters = section.querySelector('.filter-tabs');
    const header  = section.querySelector('.resource-header');
    if (grid)    grid.style.display    = '';
    if (filters) filters.style.display = '';
    if (header)  header.style.display  = '';
    try { section.scrollIntoView({behavior:'smooth', block:'start'}); } catch(e){}
  }
  // Inline mode never locks body scroll; safe no-op restore for any legacy
  // overlay state that might have leaked in.
  document.body.style.overflow = 'auto';
}

// Print only the open modal. Injects scoped print styles, prints, removes.
function faithResPrintResource(resourceId){
  const style = document.createElement('style');
  style.id = 'faith-res-print-styles';
  style.textContent = `
    @media print {
      body * { visibility: hidden; }
      #modal-${resourceId}, #modal-${resourceId} * { visibility: visible; }
      #modal-${resourceId} { position: absolute; left: 0; top: 0; width: 100%; }
      .modal-overlay { background: white !important; }
      .modal-content { max-height: none !important; box-shadow: none !important; page-break-inside: avoid; }
      .modal-header { page-break-after: avoid; }
      .content-section { page-break-inside: avoid; margin-bottom: 20px; }
      .modal-actions, .close-modal { display: none !important; }
      .modal-body { overflow: visible !important; max-height: none !important; }
      .scripture-box, .prayer-type, .giving-reason, .faq-item, .timeline-item, .step { page-break-inside: avoid; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => {
    const s = document.getElementById('faith-res-print-styles');
    if (s) s.remove();
  }, 1000);
}
