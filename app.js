/* Studio Dott. Francesco Biondi – Desk Folder Prototype */

const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>Array.from(el.querySelectorAll(s));

// Dev grid (100x100) toggle via ?grid=1
try{
  const sp = new URLSearchParams(location.search);
  if(sp.get('grid') === '1') document.body.classList.add('show-grid');
}catch{}

// Page enter animation: switch from .preload to .is-ready once assets are ready
window.addEventListener('load', ()=>{
  document.body.classList.remove('preload');
  document.body.classList.add('is-ready');
});

// Year
qs('#year').textContent = String(new Date().getFullYear());

// Dialog helpers
function openDialog(id){
  const d = qs(id);
  if(!d) return;
  d.classList.add('is-open');
  d.setAttribute('aria-hidden','false');
}
function closeDialog(id){
  const d = qs(id);
  if(!d) return;
  d.classList.remove('is-open');
  d.setAttribute('aria-hidden','true');
}

// Booking CTA (placeholder)
function goBook(){
  // TODO: replace with MioDottore / WhatsApp / booking URL
  alert('TODO: collega qui la prenotazione (MioDottore / WhatsApp / form).');
}

qs('#btnBook').addEventListener('click', goBook);
qs('#btnContacts').addEventListener('click', ()=>openDialog('#contactsDialog'));
qs('#btnAbout').addEventListener('click', ()=>openDialog('#aboutDialog'));

qsa('[data-close="about"]').forEach(b=>b.addEventListener('click', ()=>closeDialog('#aboutDialog')));
qsa('[data-close="contacts"]').forEach(b=>b.addEventListener('click', ()=>closeDialog('#contactsDialog')));
qs('#aboutCTA').addEventListener('click', goBook);
qs('#contactsCTA').addEventListener('click', goBook);

// Close dialogs on backdrop click
qsa('.dialog__backdrop').forEach(bg=>bg.addEventListener('click', (e)=>{
  const close = e.currentTarget.getAttribute('data-close');
  if(close === 'about') closeDialog('#aboutDialog');
  if(close === 'contacts') closeDialog('#contactsDialog');
}));

// Folder open logic – hover opens, click pins (like early versions)
const folder = qs('#folder');
const folderBtn = qs('#folderBtn');
const folderContent = qs('#folderContent');
let pinnedOpen = false;

function setFolderOpen(open){
  folder.classList.toggle('is-open', open);
  document.body.classList.toggle('folder-open', open);
  folderBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  folderContent.hidden = !open;
}

folder.addEventListener('mouseenter', ()=>{ if(!pinnedOpen) setFolderOpen(true); });
folder.addEventListener('mouseleave', ()=>{ if(!pinnedOpen) setFolderOpen(false); });
folderBtn.addEventListener('click', ()=>{
  pinnedOpen = !pinnedOpen;
  setFolderOpen(pinnedOpen);
});

// Keyboard accessibility
folderBtn.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    pinnedOpen = !pinnedOpen;
    setFolderOpen(pinnedOpen);
  }
});

// Tabs
const tabs = qsa('.tab', folder);
const panels = {
  treatments: qs('#panel-treatments'),
  reviews: qs('#panel-reviews'),
  products: qs('#panel-products')
};

function activateTab(name){
  tabs.forEach(t=>{
    const active = t.dataset.tab === name;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  Object.entries(panels).forEach(([k,p])=>{
    const active = k === name;
    p.classList.toggle('is-active', active);
    p.hidden = !active;
  });
}

tabs.forEach(t=>t.addEventListener('click', ()=>activateTab(t.dataset.tab)));
activateTab('treatments');

// Data
const TREATMENTS = [
  {
    id:'lips',
    title:'Filler Labbra',
    meta:'Volume naturale e proporzionato',
    text:'Un trattamento dedicato a definire e riequilibrare le proporzioni, mantenendo un risultato armonico.',
    bullets:['Valutazione forma e simmetrie','Tecnica delicata e controllata','Indicazioni post-trattamento chiare'],
    cta:'Prenota consulenza'
  },
  {
    id:'skinbooster',
    title:'Skin Booster',
    meta:'Idratazione profonda e glow',
    text:'Migliora la qualità della pelle con un approccio mirato a texture, luminosità e idratazione.',
    bullets:['Pelle più luminosa','Supporto a elasticità','Percorso modulabile'],
    cta:'Prenota visita'
  },
  {
    id:'bio',
    title:'Biorivitalizzazione',
    meta:'Skin quality e micro-rughe',
    text:'Percorso orientato a migliorare compattezza e aspetto generale, con un risultato naturale.',
    bullets:['Focus su qualità della pelle','Protocollo personalizzato','Follow-up consigliato'],
    cta:'Prenota'
  }
];

const PRODUCTS = [
  {
    id:'hyal-serum',
    title:'Hyal Serum',
    meta:'Siero idratante quotidiano',
    text:'Siero leggero pensato per sostenere l’idratazione e migliorare la sensazione di comfort cutaneo.',
    bullets:['Texture leggera','Routine AM/PM','Adatto anche post-trattamento'],
    cta:'Richiedi info'
  },
  {
    id:'barrier-cream',
    title:'Barrier Cream',
    meta:'Crema riparatrice',
    text:'Crema dedicata a barriera e protezione, ideale nei periodi di sensibilità o dopo trattamenti.',
    bullets:['Supporto barriera','Comfort immediato','Uso quotidiano'],
    cta:'Richiedi info'
  },
  {
    id:'spf-cloud',
    title:'SPF 50+ Cloud',
    meta:'Protezione leggera',
    text:'Fotoprotezione con finish leggero, pensata per l’uso quotidiano e la routine completa.',
    bullets:['Finish leggero','Uso quotidiano','Base perfetta per makeup'],
    cta:'Richiedi info'
  },
  {
    id:'calm-gel',
    title:'Calm Gel',
    meta:'Lenitivo post',
    text:'Gel calmante per ridurre la sensazione di sensibilità e favorire comfort dopo procedure.',
    bullets:['Effetto lenitivo','Ideale post','Applicazione semplice'],
    cta:'Richiedi info'
  },
  {
    id:'eye-repair',
    title:'Eye Repair',
    meta:'Contorno occhi',
    text:'Trattamento mirato per la zona perioculare, pensato per idratazione e aspetto più fresco.',
    bullets:['Zona delicata','Uso AM/PM','Texture morbida'],
    cta:'Richiedi info'
  },
  {
    id:'clean-foam',
    title:'Clean Foam',
    meta:'Detersione soft',
    text:'Detergente schiuma delicato per mantenere la barriera e preparare la pelle alla routine.',
    bullets:['Detersione delicata','Adatto a pelli sensibili','Uso quotidiano'],
    cta:'Richiedi info'
  }
];

const REVIEWS = [
  {stars:'★★★★★', quote:'"Mi sono sentita ascoltata. Risultato super naturale."', tag:'Trattamento: Labbra'},
  {stars:'★★★★★', quote:'"Spiegazioni chiare e studio impeccabile. Zero ansia."', tag:'Trattamento: Skin Booster'},
  {stars:'★★★★★', quote:'"Pelle più luminosa e compatta già dopo pochi giorni."', tag:'Trattamento: Biorivitalizzazione'}
];

// Render cards
function renderCard(item, type){
  const el = document.createElement('article');
  el.className = 'card';
  el.tabIndex = 0;
  el.setAttribute('role','button');
  el.dataset.type = type;
  el.dataset.id = item.id;

  el.innerHTML = `
    <div class="card__img" aria-hidden="true"></div>
    <div class="card__title">${item.title}</div>
    <div class="card__meta">${item.meta}</div>
  `;

  const open = ()=>openDetail(item);
  el.addEventListener('click', open);
  el.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); }
  });
  return el;
}

const treatmentsGrid = qs('#treatmentsGrid');
TREATMENTS.forEach(t=>treatmentsGrid.appendChild(renderCard(t,'treatment')));

const productsGrid = qs('#productsGrid');
PRODUCTS.forEach(p=>productsGrid.appendChild(renderCard(p,'product')));

const reviewsList = qs('#reviewsList');
REVIEWS.forEach(r=>{
  const el = document.createElement('article');
  el.className = 'review';
  el.innerHTML = `
    <div class="avatar" aria-hidden="true"></div>
    <div>
      <div class="stars">${r.stars}</div>
      <div class="quote">${r.quote}</div>
      <div class="tag">${r.tag}</div>
    </div>
    <div class="thumb" aria-hidden="true"></div>
  `;
  reviewsList.appendChild(el);
});

// Detail modal
const detail = qs('#detail');
const detailTitle = qs('#detailTitle');
const detailText = qs('#detailText');
const detailBullets = qs('#detailBullets');
const detailCTA = qs('#detailCTA');

function openDetail(item){
  detailTitle.textContent = item.title;
  detailText.textContent = item.text;
  detailBullets.innerHTML = '';
  item.bullets.forEach(b=>{
    const li = document.createElement('li');
    li.textContent = b;
    detailBullets.appendChild(li);
  });
  detailCTA.textContent = item.cta || 'Prenota';
  detail.classList.add('is-open');
  detail.setAttribute('aria-hidden','false');
}
function closeDetail(){
  detail.classList.remove('is-open');
  detail.setAttribute('aria-hidden','true');
}

qs('#detailClose').addEventListener('click', closeDetail);
qsa('[data-close-detail="1"]').forEach(b=>b.addEventListener('click', closeDetail));

// CTA inside detail -> booking
qs('#detailCTA').addEventListener('click', ()=>{
  closeDetail();
  goBook();
});

// ESC closes overlays
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    if(detail.classList.contains('is-open')) closeDetail();
    if(qs('#aboutDialog').classList.contains('is-open')) closeDialog('#aboutDialog');
    if(qs('#contactsDialog').classList.contains('is-open')) closeDialog('#contactsDialog');
  }
});
