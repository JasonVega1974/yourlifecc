/* =============================================================
   faith-resources.js — Christian Living & Life Guides (F1.1)
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
function faithResOpenModal(resourceId){
  const modal = document.getElementById('modal-' + resourceId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function faithResCloseModal(resourceId){
  const modal = document.getElementById('modal-' + resourceId);
  if (!modal) return;
  modal.classList.remove('active');
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
