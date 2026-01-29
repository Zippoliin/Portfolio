/* Davide Di Mauro — Portfolio Folder UI
   Vanilla JS, robust (no runtime crashes if some elements are missing).
*/

const projects = [
  {
    id: "a-petra",
    title: "A Petra — Bomboniere Laviche",
    meta: "Brand identity • 2025",
    badge: "Case study",
    description: "Identità minimale con accenti “lava”: palette, tipografia e mockup packaging.",
    slides: ["assets/a-petra-brand-identity.png"],
  },
  {
    id: "zuccarata",
    title: "Zuccarata — Pasticceria",
    meta: "Brand identity • 2025",
    badge: "Project",
    description: "Sistema visivo caldo e riconoscibile, pensato per contenuti social e vetrina.",
    slides: [
      svgDataUri("Zuccarata", "Pasticceria • Visual system & social kit", "#f97316", "#0b1220"),
      svgDataUri("Zuccarata", "Palette & layout", "#f97316", "#070a0f"),
    ],
  },
  {
    id: "nud",
    title: "NUD — Asian Kitchen",
    meta: "Brand identity • 2025",
    badge: "Project",
    description: "Tono urban e dinamico: identità pronta per video brevi, menù e comunicazione.",
    slides: [
      svgDataUri("NUD", "Asian kitchen • Brand rhythm", "#3b82f6", "#071024"),
      svgDataUri("NUD", "Template social & pattern", "#3b82f6", "#070a0f"),
    ],
  },
  {
    id: "dinaink",
    title: "DinaInk Tattoo Studio",
    meta: "Brand identity • 2025",
    badge: "Project",
    description: "Contrasti netti e carattere forte, con applicazioni per studio e social.",
    slides: [
      svgDataUri("DinaInk", "Tattoo studio • Bold & authentic", "#ef4444", "#090a12"),
      svgDataUri("DinaInk", "Layout & typography", "#ef4444", "#070a0f"),
    ],
  },
  {
    id: "magic-pizza",
    title: "Magic Pizza",
    meta: "Brand refresh • 2025",
    badge: "Project",
    description: "Linee guida visive e sistema promo: leggibile, coerente, facile da mantenere.",
    slides: [
      svgDataUri("Magic Pizza", "Promo system & visual guidelines", "#22c55e", "#07130e"),
    ],
  },
];

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function svgDataUri(title, subtitle, accent = "#60a5fa", bg = "#0b1020") {
  const t = escapeHtml(title);
  const st = escapeHtml(subtitle);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg}" />
        <stop offset="1" stop-color="#06070b" />
      </linearGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="80" />
      </filter>
    </defs>
    <rect width="1600" height="1000" fill="url(#g)"/>
    <circle cx="420" cy="430" r="280" fill="${accent}" opacity=".28" filter="url(#blur)"/>
    <circle cx="1150" cy="320" r="260" fill="${accent}" opacity=".16" filter="url(#blur)"/>
    <rect x="120" y="160" width="1360" height="680" rx="44" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.08)"/>
    <text x="180" y="320" font-size="72" fill="rgba(255,255,255,.92)" font-family="ui-sans-serif, -apple-system, system-ui, Segoe UI">
      ${t}
    </text>
    <text x="180" y="380" font-size="34" fill="rgba(148,163,184,.92)" font-family="ui-sans-serif, -apple-system, system-ui, Segoe UI">
      ${st}
    </text>
    <rect x="180" y="460" width="420" height="14" rx="7" fill="${accent}" opacity=".85"/>
    <rect x="180" y="500" width="640" height="10" rx="5" fill="rgba(255,255,255,.18)"/>
    <rect x="180" y="528" width="560" height="10" rx="5" fill="rgba(255,255,255,.14)"/>
    <rect x="180" y="556" width="600" height="10" rx="5" fill="rgba(255,255,255,.12)"/>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Elements
  const folderWrap = document.querySelector(".folderWrap");
  const folderBtn = document.getElementById("folder");
  const closePopover = document.getElementById("closePopover");
  const grid = document.getElementById("projectGrid");

  const projectModal = document.getElementById("projectModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeModal = document.getElementById("closeModal");
  const prevSlideBtn = document.getElementById("prevSlide");
  const nextSlideBtn = document.getElementById("nextSlide");
  const slideImg = document.getElementById("slideImg");
  const thumbsEl = document.getElementById("thumbs");
  const mTitle = document.getElementById("mTitle");
  const mMeta = document.getElementById("mMeta");

  const aboutModal = document.getElementById("aboutModal");
  const aboutBackdrop = document.getElementById("aboutBackdrop");
  const btnAbout = document.getElementById("btnAbout");
  const closeAbout = document.getElementById("closeAbout");

  // --- Guards
  if (grid) renderGrid();

  // --- Folder open/close (hover open + click pin)
  if (folderWrap && folderBtn) {
    let pinned = false;
    const setOpen = (v) => {
      folderWrap.classList.toggle("open", v);
      folderBtn.setAttribute("aria-expanded", v ? "true" : "false");
    };
    folderWrap.addEventListener("mouseenter", () => { if (!pinned) setOpen(true); });
    folderWrap.addEventListener("mouseleave", () => { if (!pinned) setOpen(false); });
    folderBtn.addEventListener("click", () => { pinned = !pinned; setOpen(pinned || !folderWrap.classList.contains("open")); });
    if (closePopover) closePopover.addEventListener("click", () => { pinned = false; setOpen(false); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") { pinned = false; setOpen(false); closeProject(); hideAbout(); }});
  }

  // --- Info modal
  function showAbout(){ if (aboutModal) aboutModal.setAttribute("aria-hidden","false"); }
  function hideAbout(){ if (aboutModal) aboutModal.setAttribute("aria-hidden","true"); }
  if (btnAbout) btnAbout.addEventListener("click", (e)=>{ e.preventDefault(); showAbout(); });
  if (closeAbout) closeAbout.addEventListener("click", hideAbout);
  if (aboutBackdrop) aboutBackdrop.addEventListener("click", hideAbout);

  // --- Project viewer
  let activeProject = null;
  let activeIndex = 0;

  function openProject(project) {
    if (!projectModal || !slideImg) return;
    activeProject = project;
    activeIndex = 0;
    projectModal.setAttribute("aria-hidden", "false");
    if (mTitle) mTitle.textContent = project.title;
    if (mMeta) mMeta.textContent = project.meta ?? "";
    renderProject();
  }

  function closeProject() {
    if (!projectModal) return;
    projectModal.setAttribute("aria-hidden", "true");
    activeProject = null;
    activeIndex = 0;
    if (thumbsEl) thumbsEl.innerHTML = "";
  }

  function renderProject() {
    if (!activeProject || !slideImg) return;
    const src = activeProject.slides[activeIndex];
    slideImg.src = src;
    slideImg.alt = `Slide ${activeIndex + 1} — ${activeProject.title}`;

    if (!thumbsEl) return;
    thumbsEl.innerHTML = "";
    activeProject.slides.forEach((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "thumb" + (i === activeIndex ? " active" : "");
      b.innerHTML = `<img src="${s}" alt="Miniatura ${i+1}" loading="lazy" />`;
      b.addEventListener("click", () => { activeIndex = i; renderProject(); });
      thumbsEl.appendChild(b);
    });
  }

  function nextSlide() {
    if (!activeProject) return;
    activeIndex = (activeIndex + 1) % activeProject.slides.length;
    renderProject();
  }
  function prevSlide() {
    if (!activeProject) return;
    activeIndex = (activeIndex - 1 + activeProject.slides.length) % activeProject.slides.length;
    renderProject();
  }

  if (nextSlideBtn) nextSlideBtn.addEventListener("click", nextSlide);
  if (prevSlideBtn) prevSlideBtn.addEventListener("click", prevSlide);
  if (closeModal) closeModal.addEventListener("click", closeProject);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeProject);

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = "";
    projects.forEach((p) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.setAttribute("role", "listitem");
      card.setAttribute("aria-label", `Apri progetto ${p.title}`);
      const previewSrc = p.slides[0];

      card.innerHTML = `
        <div class="preview">
          <span class="badge">${escapeHtml(p.badge ?? "Project")}</span>
          <img src="${previewSrc}" alt="Anteprima ${escapeHtml(p.title)}" loading="lazy" />
        </div>
        <div class="cardBody">
          <div class="cardTitle">${escapeHtml(p.title)}</div>
          <div class="cardDesc">${escapeHtml(p.description)}</div>
        </div>
      `;
      card.addEventListener("click", () => openProject(p));
      grid.appendChild(card);
    });
  }

  // --- Smooth cursor-follow background (lerp)
  (function(){
    let tx = 50, ty = 50, cx = 50, cy = 50;
    window.addEventListener("mousemove", (e) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    }, {passive:true});
    function tick(){
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      document.documentElement.style.setProperty("--mx", cx.toFixed(2) + "%");
      document.documentElement.style.setProperty("--my", cy.toFixed(2) + "%");
      requestAnimationFrame(tick);
    }
    tick();
  })();
});
