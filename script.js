(() => {
  const folder = document.getElementById('folder');
  const folderFace = document.getElementById('folderFace');
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  // ---- Folder open logic: hover opens, click pins ----
  let pinned = false;

  const openFolder = () => folder.classList.add('open');
  const closeFolder = () => {
    if (!pinned) folder.classList.remove('open');
  };
  const togglePin = () => {
    pinned = !pinned;
    folder.dataset.pinned = String(pinned);
    if (pinned) openFolder();
    else closeFolder();
  };

  folderFace.addEventListener('mouseenter', openFolder);
  folder.addEventListener('mouseleave', closeFolder);
  folderFace.addEventListener('click', togglePin);

  // Keyboard accessibility
  folder.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePin();
    }
  });

  // ---- Tabs inside folder ----
  function setActiveTab(id){
    navItems.forEach(btn => {
      const active = btn.dataset.tab === id;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(p => p.classList.toggle('active', p.id === id));
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveTab(btn.dataset.tab);
    });
  });

  // Default tab
  setActiveTab('treatments');

  // ---- Modal system ----
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const openModal = (html) => {
    modalContent.innerHTML = html;
    modal.classList.add('open');
  };
  const closeModal = () => modal.classList.remove('open');

  document.getElementById('openAbout')?.addEventListener('click', () => {
    openModal(`
      <h2>Chi sono</h2>
      <p>
        Approccio naturale e personalizzato: ascolto, anamnesi e un percorso costruito sul tuo viso.
        L’obiettivo è valorizzare, non stravolgere.
      </p>
      <div class="modal-split">
        <div>
          <h3>Focus</h3>
          <ul>
            <li>Skin quality e prevenzione</li>
            <li>Armonizzazione labbra</li>
            <li>Trattamenti viso non invasivi</li>
          </ul>
        </div>
        <div>
          <h3>In studio</h3>
          <p>Consulenza, piano, trattamento e follow-up.</p>
        </div>
      </div>
    `);
  });

  document.getElementById('openContacts')?.addEventListener('click', () => {
    openModal(`
      <h2>Contatti</h2>
      <p>
        Per informazioni e prenotazioni:
      </p>
      <ul>
        <li><b>WhatsApp</b>: +39 000 000 0000</li>
        <li><b>Telefono</b>: +39 000 000 0000</li>
        <li><b>Email</b>: studio@example.com</li>
      </ul>
      <p class="muted">(Dati di esempio: sostituiscili con quelli reali.)</p>
    `);
  });

  document.getElementById('openBooking')?.addEventListener('click', () => {
    openModal(`
      <h2>Prenota</h2>
      <p>
        Scegli il canale di prenotazione più comodo.
      </p>
      <div class="booking-actions">
        <a class="action" href="#" onclick="return false;">Prenota su MioDottore (esempio)</a>
        <a class="action ghost" href="#" onclick="return false;">Scrivi su WhatsApp (esempio)</a>
      </div>
      <p class="muted">(Qui inseriamo i link reali.)</p>
    `);
  });

  // Close modal on backdrop click / ESC
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Optional dev grid (?grid=1)
  const params = new URLSearchParams(window.location.search);
  if (params.get('grid') === '1') {
    document.body.classList.add('show-grid');
  }
})();
