// Davide Di Mauro — Portfolio folder UI
// Minimal data-driven approach: edit this array to add projects.
const projects = [
  {
    id: "a-petra",
    title: "A Petra — Bomboniere Laviche",
    meta: "Brand identity • 2025",
    badge: "Case study",
    description: "Identità minimale con accenti “lava”: palette, tipografia e mockup packaging.",
    slides: [
      "assets/a-petra-brand-identity.png"
    ],
  },
  {
    id: "nud",
    title: "NUD — Asian Kitchen",
    meta: "Visual system • 2025",
    badge: "Project",
    description: "Sistema visivo dinamico e urban, pensato per contenuti social e menù.",
    slides: ["assets/nud-01.svg"],
  },
  {
    id: "zuccarata",
    title: "Zuccarata — Pasticceria",
    meta: "Visual identity • 2025",
    badge: "Project",
    description: "Tono caldo e goloso: coerenza tra social, packaging e comunicazione.",
    slides: ["assets/zuccarata-01.svg"],
  },
  {
    id: "dinaink",
    title: "DinaInk Tattoo Studio",
    meta: "Brand identity • 2025",
    badge: "Project",
    description: "Contrasti netti e personalità forte, con applicazioni per social e studio.",
    slides: ["assets/dinaink-01.svg"],
  },
  {
    id: "studio-zen",
    title: "Studio Zen",
    meta: "Concept • Wellness",
    badge: "Concept",
    description: "Estetica premium e minimale: palette soft, tipografia pulita, layout modulare.",
    slides: [
      svgDataUri("Studio Zen", "Wellness • Calm & premium", "#a78bfa", "#0b1020"),
      svgDataUri("Studio Zen", "Social kit & grid", "#a78bfa", "#090a12"),
    ],
  },
  {
    id: "nordica-coffee",
    title: "Nordica Coffee",
    meta: "Concept • Coffee packaging",
    badge: "Concept",
    description: "Packaging con pattern modulare e look nordico: semplice, memorabile, scalabile.",
    slides: [
      svgDataUri("Nordica Coffee", "Packaging concept & pattern", "#60a5fa", "#091826"),
    ],
  },
];


// --- Helpers: generate quick SVG slides without extra files
function svgDataUri(title, subtitle, accent = "#22c55e", bg = "#0b0f14") {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg}"/>
        <stop offset="1" stop-color="#111827"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="20" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="1600" height="900" fill="url(#g)"/>
    <circle cx="1320" cy="180" r="220" fill="${accent}" opacity="0.18"/>
    <circle cx="1240" cy="740" r="320" fill="${accent}" opacity="0.12"/>
    <g filter="url(#s)">
      <rect x="120" y="130" rx="32" ry="32" width="1360" height="640" fill="#0f172a" stroke="#1f2937"/>
    </g>
    <text x="200" y="260" fill="#e5e7eb" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="68" font-weight="800">${escapeXml(title)}</text>
    <text x="200" y="335" fill="#a1a1aa" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="30" font-weight="500">${escapeXml(subtitle)}</text>
    <rect x="200" y="390" width="210" height="10" fill="${accent}" rx="5"/>
    <text x="200" y="470" fill="#cbd5e1" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="26">
      <tspan x="200" dy="0">Logo • Palette • Tipografia • Applicazioni</tspan>
      <tspan x="200" dy="44">Mockup • Social kit • Linee guida</tspan>
    </text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.trim());
}

function escapeXml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

// --- UI logic
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

let folderPinned = false;
let activeProject = null;
let activeIndex = 0;

// Build grid
projects.forEach((p) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `Apri progetto ${p.title}`);

  const previewSrc = p.slides[0];

  card.innerHTML = `
    <div class="preview">
      <span class="badge">${p.badge ?? "Project"}</span>
      <img src="${previewSrc}" alt="" loading="lazy" />
    </div>
    <div class="cardBody">
      <div class="cardTitle">${p.title}</div>
      <div class="cardDesc">${p.description}</div>
    </div>
  `;

  card.addEventListener("click", () => openProject(p));
  grid.appendChild(card);
});

// Folder open/close
function setFolderOpen(open) {
  folderWrap.classList.toggle("open", open);
  folderBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

function closeFolder() {
  folderPinned = false;
  setFolderOpen(false);
}

folderWrap.addEventListener("mouseenter", () => {
  if (!folderPinned) setFolderOpen(true);
});
folderWrap.addEventListener("mouseleave", () => {
  if (!folderPinned) setFolderOpen(false);
});

folderBtn.addEventListener("click", () => {
  folderPinned = !folderPinned;
  setFolderOpen(folderPinned || !folderWrap.classList.contains("open"));
});

closePopover.addEventListener("click", closeFolder);

// Project modal
function openProject(project) {
  activeProject = project;
  activeIndex = 0;

  mTitle.textContent = project.title;
  mMeta.textContent = project.meta;

  renderSlide();
  renderThumbs();

  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProject() {
  projectModal.setAttribute("aria-hidden", "true");
  activeProject = null;
  activeIndex = 0;
  document.body.style.overflow = "";
}

function renderSlide() {
  if (!activeProject) return;
  const src = activeProject.slides[activeIndex];
  slideImg.src = src;
  slideImg.alt = `${activeProject.title} — slide ${activeIndex + 1}`;
  updateThumbActive();
}

function renderThumbs() {
  thumbsEl.innerHTML = "";
  if (!activeProject) return;

  activeProject.slides.forEach((src, idx) => {
    const t = document.createElement("button");
    t.type = "button";
    t.className = "thumb";
    t.setAttribute("aria-label", `Vai alla slide ${idx + 1}`);
    t.innerHTML = `<img src="${src}" alt="" loading="lazy" />`;
    t.addEventListener("click", () => {
      activeIndex = idx;
      renderSlide();
    });
    thumbsEl.appendChild(t);
  });
  updateThumbActive();
}

function updateThumbActive() {
  const children = Array.from(thumbsEl.children);
  children.forEach((el, idx) => el.classList.toggle("active", idx === activeIndex));
}

function prevSlide() {
  if (!activeProject) return;
  activeIndex = (activeIndex - 1 + activeProject.slides.length) % activeProject.slides.length;
  renderSlide();
}

function nextSlide() {
  if (!activeProject) return;
  activeIndex = (activeIndex + 1) % activeProject.slides.length;
  renderSlide();
}

prevSlideBtn.addEventListener("click", prevSlide);
nextSlideBtn.addEventListener("click", nextSlide);
closeModal.addEventListener("click", closeProject);
modalBackdrop.addEventListener("click", closeProject);

// About modal
btnAbout.addEventListener("click", () => {
  aboutModal.setAttribute("aria-hidden", "false");
});
closeAbout.addEventListener("click", () => aboutModal.setAttribute("aria-hidden", "true"));
aboutBackdrop.addEventListener("click", () => aboutModal.setAttribute("aria-hidden", "true"));

// Keyboard
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (projectModal.getAttribute("aria-hidden") === "false") closeProject();
    if (aboutModal.getAttribute("aria-hidden") === "false") aboutModal.setAttribute("aria-hidden", "true");
    if (folderWrap.classList.contains("open")) closeFolder();
  }
  if (projectModal.getAttribute("aria-hidden") === "false") {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  }
});

  alert("Placeholder CV: sostituisci questo link con il tuo PDF.");
});


// Background follows cursor (subtle)
window.addEventListener("mousemove", (e) => {
  const x = Math.round((e.clientX / window.innerWidth) * 100);
  const y = Math.round((e.clientY / window.innerHeight) * 100);
  document.documentElement.style.setProperty("--mx", x + "%");
  document.documentElement.style.setProperty("--my", y + "%");
});
