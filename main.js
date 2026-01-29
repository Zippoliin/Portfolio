import * as THREE from "three";

const isCoarse = matchMedia("(pointer: coarse)").matches;
const mobileEl = document.getElementById("mobile");
const canvas = document.getElementById("c");

if (isCoarse) {
  mobileEl.classList.remove("hidden");
  canvas.style.display = "none";
  document.getElementById("hud").style.display = "none";
  document.getElementById("panel").style.display = "none";
  throw new Error("Mobile mode: drive disabled");
}

const speedEl = document.getElementById("speed");
const checkpointEl = document.getElementById("checkpoint");
const hintEl = document.getElementById("hint");
const panelEl = document.getElementById("panel");
const panelTitleEl = document.getElementById("panelTitle");
const panelSubtitleEl = document.getElementById("panelSubtitle");
const panelBodyEl = document.getElementById("panelBody");
document.getElementById("panelClose").addEventListener("click", () => panelEl.classList.remove("open"));
document.getElementById("toggleHelp").addEventListener("click", () => document.getElementById("help").classList.toggle("open"));

function openPanel({ title, subtitle, html }) {
  panelTitleEl.textContent = title;
  panelSubtitleEl.textContent = subtitle;
  panelBodyEl.innerHTML = html;
  panelEl.classList.add("open");
}
function closePanel() { panelEl.classList.remove("open"); }

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070610, 0.0027);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 8, 18);

scene.add(new THREE.AmbientLight(0x9b8cff, 0.55));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(60, 120, 30);
scene.add(dir);

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(1200, 32, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      top: { value: new THREE.Color(0x2c1680) },
      mid: { value: new THREE.Color(0x141047) },
      bot: { value: new THREE.Color(0x09071a) }
    },
    vertexShader: `varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vPos; uniform vec3 top; uniform vec3 mid; uniform vec3 bot;
      void main(){ float h = normalize(vPos).y*0.5+0.5;
      vec3 c1=mix(bot,mid,smoothstep(0.0,0.55,h));
      vec3 c2=mix(mid,top,smoothstep(0.35,1.0,h));
      gl_FragColor=vec4(mix(c1,c2,smoothstep(0.25,0.9,h)),1.0); }`
  })
);
scene.add(sky);

const worldSize = 800;
const ground = new THREE.Mesh(new THREE.PlaneGeometry(worldSize, worldSize), new THREE.MeshStandardMaterial({ color: 0x0a0816, roughness: 0.95 }));
ground.rotation.x = -Math.PI/2;
scene.add(ground);

const plaza = new THREE.Mesh(
  new THREE.CylinderGeometry(70, 70, 0.6, 64),
  new THREE.MeshStandardMaterial({ color: 0x0b0a18, roughness: 0.8, emissive: 0x201060, emissiveIntensity: 0.25 })
);
plaza.position.set(0, 0.3, 0);
scene.add(plaza);

function makeGrid(radius=60, step=4, color=0x8cf6ff, opacity=0.18) {
  const g = new THREE.Group();
  const m = new THREE.LineBasicMaterial({ color, transparent:true, opacity });
  for (let x=-radius; x<=radius; x+=step) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,0.02,-radius), new THREE.Vector3(x,0.02,radius)]), m));
  for (let z=-radius; z<=radius; z+=step) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-radius,0.02,z), new THREE.Vector3(radius,0.02,z)]), m));
  return g;
}
scene.add(makeGrid());

function addRoad(x, z, w, h) {
  const road = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: 0x101022, roughness: 1, emissive: 0x080820, emissiveIntensity: 0.25 }));
  road.rotation.x = -Math.PI/2; road.position.set(x, 0.01, z); scene.add(road);
  const line = new THREE.Mesh(new THREE.PlaneGeometry(w*0.06, h), new THREE.MeshStandardMaterial({ color: 0x1a1635, emissive: 0x8cf6ff, emissiveIntensity: 0.35, roughness: 1 }));
  line.rotation.x = -Math.PI/2; line.position.set(x, 0.02, z); scene.add(line);
}
addRoad(120, 0, 22, 240);
addRoad(-120, 0, 22, 240);
addRoad(0, 120, 240, 22);

function addBuildingsCluster(cx, cz, palette) {
  const group = new THREE.Group();
  for (let i=0;i<26;i++){
    const w = 10 + Math.random()*24, d = 10 + Math.random()*24, h = 8 + Math.random()*45;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), new THREE.MeshStandardMaterial({ color: palette.base, roughness: 0.9, metalness: 0.05, emissive: palette.em, emissiveIntensity: 0.10 }));
    box.position.set(cx + (Math.random()*220-110), h/2, cz + (Math.random()*220-110));
    group.add(box);
    if (Math.random() > 0.55) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(w*0.9, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x111122, emissive: palette.neon, emissiveIntensity: 0.9, roughness: 1 }));
      strip.position.set(box.position.x, box.position.y*0.6, box.position.z + d*0.5 + 0.2);
      group.add(strip);
    }
  }
  scene.add(group);
}
addBuildingsCluster(240, 0,   { base:0x0f0f1c, em:0x12082a, neon:0x8cf6ff });
addBuildingsCluster(0, 240,   { base:0x151522, em:0x220a2a, neon:0xb48cff });
addBuildingsCluster(-240, 0,  { base:0x121018, em:0x24110a, neon:0xffb06a });

const car = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.1, 6.2), new THREE.MeshStandardMaterial({ color: 0x171529, roughness: 0.55, metalness: 0.3, emissive: 0x0a0830, emissiveIntensity: 0.15 }));
body.position.y = 1.0; car.add(body);
const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, 2.4), new THREE.MeshStandardMaterial({ color: 0x0d0b18, roughness: 0.25, metalness: 0.6, emissive: 0x101040, emissiveIntensity: 0.25 }));
cabin.position.set(0, 1.65, -0.4); car.add(cabin);

function wheelMesh() {
  const w = new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.5,16), new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.95, metalness: 0.1 }));
  w.rotation.z = Math.PI/2; w.position.y = 0.6; return w;
}
const wheels = [];
for (const [x,y,z] of [[-1.3,0.6,2.2],[1.3,0.6,2.2],[-1.3,0.6,-2.2],[1.3,0.6,-2.2]]) { const w = wheelMesh(); w.position.set(x,y,z); car.add(w); wheels.push(w); }

const under = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 5.4), new THREE.MeshStandardMaterial({ color: 0x050411, emissive: 0x8cf6ff, emissiveIntensity: 0.35, roughness: 1 }));
under.position.set(0, 0.35, 0); car.add(under);
scene.add(car);

const ramps = [];
function addRamp(x,z, rotY=0){
  const ramp = new THREE.Mesh(new THREE.BoxGeometry(10, 1.2, 20), new THREE.MeshStandardMaterial({ color: 0x0f0f22, roughness: 0.9, emissive: 0x8cf6ff, emissiveIntensity: 0.10 }));
  ramp.position.set(x, 0.6, z); ramp.rotation.y = rotY; ramp.rotation.x = -0.18; scene.add(ramp); ramps.push(ramp);
}
addRamp(270, -30, Math.PI/8);
addRamp(-270, 40, -Math.PI/10);
function isOnRamp() {
  const p = car.position;
  for (const r of ramps) { if (Math.abs(p.x - r.position.x) < 6 && Math.abs(p.z - r.position.z) < 12) return true; }
  return false;
}

function addTotem(x,z, color=0x8cf6ff){
  const g = new THREE.Group();
  const col = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 6.2, 12), new THREE.MeshStandardMaterial({ color: 0x101022, roughness: 0.7, emissive: 0x080820, emissiveIntensity: 0.25 }));
  col.position.y = 3.1; g.add(col);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.0, 0.3), new THREE.MeshStandardMaterial({ color: 0x0b0a18, emissive: color, emissiveIntensity: 0.7, roughness: 1 }));
  screen.position.set(0, 4.6, 1.2); g.add(screen);
  g.position.set(x,0,z); scene.add(g); return g;
}
addTotem(10, 12, 0x8cf6ff);
addTotem(-14, 10, 0xffb06a);
addTotem(0, -16, 0xb48cff);

let lastCheckpoint = { pos: new THREE.Vector3(0,0,0), yaw: 0, name:"HUB" };
const triggers = [
  { id:"who", name:"HUB / Chi sono", pos:new THREE.Vector3(10,0,12), r:12, checkpoint:true,
    content: () => ({ title:"Chi sono", subtitle:"Video Editor • Graphic Designer • Video Maker",
      html:`<p>Portfolio esperienziale: guidi, esplori e rallenti per leggere.</p><p><b>Focus:</b> ritmo, storytelling, identità visiva, output pulito.</p>` }) },
  { id:"contacts", name:"HUB / Contatti", pos:new THREE.Vector3(-14,0,10), r:12, checkpoint:false,
    content: () => ({ title:"Contatti", subtitle:"Scrivimi e facciamo qualcosa di memorabile",
      html:`<p><b>Email:</b> <a href="mailto:ciao@tuodominio.it">ciao@tuodominio.it</a></p><a class="cta" href="mailto:ciao@tuodominio.it">Contattami</a>` }) },
  { id:"pdf", name:"HUB / Portfolio PDF", pos:new THREE.Vector3(0,0,-16), r:12, checkpoint:false,
    content: () => ({ title:"Portfolio PDF", subtitle:"Scarica la versione completa",
      html:`<p>Metti il file <b>portfolio.pdf</b> nella stessa cartella del sito.</p><a class="cta" href="./portfolio.pdf" download>Scarica PDF</a>` }) },
  { id:"editShowreel", name:"VIDEO EDITING / Showreel", pos:new THREE.Vector3(280,0,0), r:16, checkpoint:true,
    content: () => ({ title:"Video Editing — Showreel", subtitle:"Ritmo • Storytelling • Emozione",
      html:`<p>Showreel compatto (30–60s). Sostituisci l’embed con il tuo.</p><div class="ratio"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Showreel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` }) },
  { id:"designWork", name:"GRAPHIC DESIGN / Lavori", pos:new THREE.Vector3(0,0,280), r:16, checkpoint:true,
    content: () => ({ title:"Graphic Design — Selezione", subtitle:"Branding • Copertine • UI",
      html:`<p><b>Branding:</b> sistemi coerenti e applicabili.</p><p><b>Thumbnails:</b> gerarchia + leggibilità + contrasto.</p>` }) },
  { id:"makerProcess", name:"VIDEO MAKER / Processo", pos:new THREE.Vector3(-280,0,0), r:16, checkpoint:true,
    content: () => ({ title:"Video Maker — Processo", subtitle:"Riprese • Backstage • Output finale",
      html:`<p>Riprese pulite, set essenziale, output pronto.</p>` }) }
];

const keys = new Set();
addEventListener("keydown", (e) => keys.add(e.code));
addEventListener("keyup", (e) => keys.delete(e.code));

const state = { yaw: 0, speed: 0, yVel: 0, grounded: true, drift: false };
const cfg = { maxSpeed:38, accel:28, brake:36, reverseMax:8, steer:1.9, steerAtHigh:1.1, friction:10.5, driftFriction:4.6, gravity:32, jumpVel:12.5, minReadSpeed:10.5, worldHalf: worldSize/2 - 12 };
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

const camTarget = new THREE.Vector3();
const camPos = new THREE.Vector3();
function updateCamera(dt){
  const forward = new THREE.Vector3(Math.sin(state.yaw), 0, Math.cos(state.yaw));
  const speedN = clamp(Math.abs(state.speed)/cfg.maxSpeed,0,1);
  const zoom = THREE.MathUtils.lerp(16,22,speedN);
  camTarget.copy(car.position).add(new THREE.Vector3(0,2.2,0));
  camPos.copy(car.position).addScaledVector(forward,-zoom).add(new THREE.Vector3(0,9,0));
  camera.position.lerp(camPos, 1 - Math.pow(0.001, dt));
  camera.lookAt(camTarget);
}

let activeTriggerId = null;
function updateInteractions(){
  const p = car.position, sp = Math.abs(state.speed);
  let best=null, bestDist=1e9;
  for (const t of triggers) {
    const d = p.distanceTo(t.pos);
    if (d < t.r && d < bestDist) { best=t; bestDist=d; }
  }
  const canRead = sp < cfg.minReadSpeed;

  if (!best) {
    hintEl.classList.remove("hot");
    hintEl.textContent = "Rallenta vicino ai totem per leggere";
    activeTriggerId=null; closePanel(); return;
  }
  hintEl.classList.add("hot");
  hintEl.textContent = canRead ? "Contenuto disponibile (fermati qui)" : "Rallenta per leggere";

  if (canRead) {
    if (activeTriggerId !== best.id) {
      openPanel(best.content());
      activeTriggerId = best.id;
      if (best.checkpoint) {
        lastCheckpoint = { pos: best.pos.clone(), yaw: state.yaw, name: best.name };
        checkpointEl.textContent = lastCheckpoint.name;
      }
    }
  } else { activeTriggerId=null; closePanel(); }
}

function resetToCheckpoint(){
  car.position.copy(lastCheckpoint.pos); car.position.y=0;
  state.yaw = lastCheckpoint.yaw; state.speed=0; state.yVel=0; state.grounded=true;
  closePanel();
}

let last = performance.now();
function animate(now){
  const dt = Math.min((now-last)/1000, 0.033); last = now;

  const w = keys.has("KeyW"), s = keys.has("KeyS"), a = keys.has("KeyA"), d = keys.has("KeyD");
  const space = keys.has("Space");
  const shift = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const r = keys.has("KeyR");
  if (r) resetToCheckpoint();

  state.drift = space;
  if (w) state.speed += cfg.accel*dt;
  else if (s) { if (state.speed>1.2) state.speed -= cfg.brake*dt; else state.speed -= (cfg.accel*0.55)*dt; }
  state.speed = clamp(state.speed, -cfg.reverseMax, cfg.maxSpeed);

  const fr = state.drift ? cfg.driftFriction : cfg.friction;
  if (!w && !s) { if (state.speed>0) state.speed = Math.max(0, state.speed - fr*dt); if (state.speed<0) state.speed = Math.min(0, state.speed + fr*dt); }
  else state.speed *= (1 - 0.02*dt);

  const spAbs = Math.abs(state.speed);
  const steerMul = THREE.MathUtils.lerp(1.0, cfg.steerAtHigh, clamp(spAbs/cfg.maxSpeed,0,1));
  const steerInput = (a?1:0) + (d?-1:0);
  if (spAbs>0.2 && steerInput!==0) {
    const driftBonus = state.drift ? 1.25 : 1.0;
    const steerRate = cfg.steer * steerMul * driftBonus;
    const dirSign = state.speed >= 0 ? 1 : -1;
    state.yaw += steerInput * steerRate * dt * (0.55 + spAbs/cfg.maxSpeed) * dirSign;
  }

  if (shift && state.grounded && isOnRamp()) { state.yVel = cfg.jumpVel; state.grounded=false; }
  if (!state.grounded) {
    state.yVel -= cfg.gravity*dt;
    car.position.y += state.yVel*dt;
    if (car.position.y <= 0) { car.position.y=0; state.yVel=0; state.grounded=true; }
  }

  const forward = new THREE.Vector3(Math.sin(state.yaw), 0, Math.cos(state.yaw));
  car.position.addScaledVector(forward, state.speed*dt);
  car.position.x = clamp(car.position.x, -cfg.worldHalf, cfg.worldHalf);
  car.position.z = clamp(car.position.z, -cfg.worldHalf, cfg.worldHalf);
  car.rotation.set(0, state.yaw, 0);
  for (const wh of wheels) wh.rotation.x -= state.speed*dt*0.9;

  updateCamera(dt);
  updateInteractions();
  speedEl.textContent = Math.round(spAbs);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
});
