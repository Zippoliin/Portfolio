(function(){
  const desk = document.querySelector('.desk');
  const folder = document.getElementById('folder');
  const menu = document.getElementById('folderMenu');
  const overlay = document.getElementById('overlay');
  const overlayBackdrop = document.getElementById('overlayBackdrop');
  const panelTitle = document.getElementById('panelTitle');
  const panelCrumb = document.getElementById('panelCrumb');
  const panelContent = document.getElementById('panelContent');
  const closePanel = document.getElementById('closePanel');
  const ctaOpen = document.getElementById('ctaOpen');
  const btnBook = document.getElementById('btnBook');
  const btnInfo = document.getElementById('btnInfo');
  const infoDialog = document.getElementById('infoDialog');
  const year = document.getElementById('year');

  year.textContent = new Date().getFullYear();

  // Simple content templates (replace with real copy later)
  const pages = {
    home: {
      title: 'Home',
      crumb: 'Home',
      html: `
        <div class="kicker">Approccio</div>
        <p>
          Un percorso chiaro, costruito su ascolto, anamnesi e obiettivi realistici.
          L’idea è valorizzare il viso senza stravolgerlo.
        </p>
        <div class="cards">
          <div class="card">
            <h4>Sicurezza</h4>
            <p>Priorità a storia clinica, indicazioni corrette e gestione post-trattamento.</p>
          </div>
          <div class="card">
            <h4>Armonia</h4>
            <p>Risultati naturali: proporzioni e dettagli prima di tutto.</p>
          </div>
          <div class="card">
            <h4>Percorsi</h4>
            <p>Non “un singolo trattamento”, ma un piano coerente nel tempo.</p>
          </div>
        </div>
        <hr class="sepLine" />
        <div class="pills">
          <span class="pill">Skin Quality</span>
          <span class="pill">Full Face</span>
          <span class="pill">Prevenzione</span>
          <span class="pill">Post-trattamento</span>
        </div>
      `
    },
    about: {
      title: 'Chi sono',
      crumb: 'Chi sono',
      html: `
        <p>
          Qui inserirai una bio breve e credibile: formazione, approccio, cosa ti differenzia.
          (Questo contenuto è segnaposto: lo sostituiamo con il testo reale.)
        </p>
        <div class="cards">
          <div class="card"><h4>Metodo</h4><p>Anamnesi, valutazione e piano personalizzato.</p></div>
          <div class="card"><h4>Trasparenza</h4><p>Aspettative realistiche e consenso informato.</p></div>
          <div class="card"><h4>Follow-up</h4><p>Indicazioni chiare e controllo nel tempo.</p></div>
        </div>
      `
    },
    treatments: {
      title: 'Trattamenti',
      crumb: 'Trattamenti',
      html: `
        <p>Hub trattamenti (segnaposto): qui puoi inserire categorie e pagine dedicate.</p>
        <ul class="list">
          <li><strong>Viso</strong> — armonizzazione, definizione, skin quality.</li>
          <li><strong>Labbra</strong> — proporzioni e naturalezza.</li>
          <li><strong>Prevenzione</strong> — approccio progressivo e conservativo.</li>
          <li><strong>Corpo</strong> — trattamenti mirati (se presenti).</li>
        </ul>
        <hr class="sepLine" />
        <p><em>Tip:</em> per ogni trattamento aggiungi: per chi è, cosa aspettarsi, post-trattamento, CTA prenota.</p>
      `
    },
    products: {
      title: 'Prodotti',
      crumb: 'Prodotti',
      html: `
        <p>
          Mini shop “serio” (segnaposto). L’idea è vendere pochi prodotti perfetti: routine base,
          mantenimento e post-trattamento.
        </p>
        <div class="cards">
          <div class="card"><h4>Detersione</h4><p>Un prodotto delicato e coerente con la pelle trattata.</p></div>
          <div class="card"><h4>SPF</h4><p>Il vero anti-age quotidiano: protezione + texture gradevole.</p></div>
          <div class="card"><h4>Riparatore</h4><p>Barriera cutanea e comfort post-trattamento.</p></div>
        </div>
        <hr class="sepLine" />
        <p>
          Qui puoi integrare un checkout (Stripe/PayPal) o collegare una pagina Shopify/WooCommerce.
        </p>
      `
    },
    book: {
      title: 'Prenota',
      crumb: 'Prenota',
      html: `
        <p>
          Scegli l’opzione più semplice:
        </p>
        <div class="cards">
          <div class="card">
            <h4>MioDottore</h4>
            <p>CTA diretta al profilo di prenotazione (consigliato per partire subito).</p>
          </div>
          <div class="card">
            <h4>WhatsApp Business</h4>
            <p>Prenotazione rapida + messaggi automatici per orari e sedi.</p>
          </div>
          <div class="card">
            <h4>Modulo sul sito</h4>
            <p>Richiesta appuntamento con preferenze di data e trattamento.</p>
          </div>
        </div>
        <hr class="sepLine" />
        <button class="btn" type="button" onclick="alert('Collega qui il link di prenotazione (MioDottore/WhatsApp)')">Apri prenotazione</button>
      `
    },
    contact: {
      title: 'Contatti',
      crumb: 'Contatti',
      html: `
        <p>
          Inserisci qui indirizzi, sedi, orari e mappe.
        </p>
        <ul class="list">
          <li><strong>Telefono:</strong> +39 ...</li>
          <li><strong>WhatsApp:</strong> +39 ...</li>
          <li><strong>Sedi:</strong> Catania — (aggiungi indirizzi reali)</li>
          <li><strong>Email:</strong> ...</li>
        </ul>
        <hr class="sepLine" />
        <p class="kicker">Social</p>
        <div class="pills">
          <span class="pill">Instagram</span>
          <span class="pill">YouTube</span>
          <span class="pill">TikTok</span>
        </div>
      `
    },
    privacy: {
      title: 'Privacy',
      crumb: 'Privacy',
      html: `
        <p>Segnaposto privacy policy. (Da compilare con consulente / template GDPR.)</p>
      `
    },
    terms: {
      title: 'Termini',
      crumb: 'Termini',
      html: `
        <p>Segnaposto termini e condizioni. (Necessari se vendi prodotti.)</p>
      `
    }
  };

  // --- Folder open/close ---
  let isOpen = false;
  const openFolder = () => {
    isOpen = true;
    desk.classList.add('is-open');
    folder.setAttribute('aria-expanded', 'true');
  };
  const closeFolder = () => {
    isOpen = false;
    desk.classList.remove('is-open');
    folder.setAttribute('aria-expanded', 'false');
  };
  const toggleFolder = () => (isOpen ? closeFolder() : openFolder());

  // Hover opens on desktop
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    folder.addEventListener('mouseenter', openFolder);
    desk.addEventListener('mouseleave', closeFolder);
  }

  folder.addEventListener('click', (e) => {
    e.preventDefault();
    toggleFolder();
  });

  ctaOpen.addEventListener('click', () => openFolder());

  // --- Panel overlay ---
  let lastFocused = null;
  const showPanel = (key) => {
    const page = pages[key] || pages.home;
    panelTitle.textContent = page.title;
    panelCrumb.textContent = page.crumb;
    panelContent.innerHTML = page.html;

    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;

    // focus close button for accessibility
    closePanel.focus();
  };

  const hidePanel = () => {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  closePanel.addEventListener('click', hidePanel);
  overlayBackdrop.addEventListener('click', hidePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hidePanel();
      hideInfo();
      closeFolder();
    }
  });

  // menu item click
  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu__item');
    if (!btn) return;
    const target = btn.getAttribute('data-target');
    showPanel(target);
  });

  // quick open links
  document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-open');
      showPanel(key);
    });
  });

  // Topbar buttons
  btnBook.addEventListener('click', () => showPanel('book'));

  // --- Info dialog ---
  const showInfo = () => {
    btnInfo.setAttribute('aria-expanded', 'true');
    infoDialog.classList.add('is-visible');
    infoDialog.setAttribute('aria-hidden', 'false');
  };
  const hideInfo = () => {
    btnInfo.setAttribute('aria-expanded', 'false');
    infoDialog.classList.remove('is-visible');
    infoDialog.setAttribute('aria-hidden', 'true');
  };
  btnInfo.addEventListener('click', () => {
    const expanded = btnInfo.getAttribute('aria-expanded') === 'true';
    expanded ? hideInfo() : showInfo();
  });
  infoDialog.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-close') === 'info') hideInfo();
  });

  // Click outside open folder closes it (mobile-friendly)
  document.addEventListener('click', (e) => {
    const clickedFolder = e.target.closest('#folder');
    const clickedMenu = e.target.closest('#folderMenu');
    const clickedCTA = e.target.closest('#ctaOpen');
    if (!clickedFolder && !clickedMenu && !clickedCTA) {
      if (!finePointer) closeFolder();
    }
  });
})();
