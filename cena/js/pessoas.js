// Personagens planos: cada pose é desenhada num canvas a partir do tempo e usada como textura de um plano
// que sempre olha para a câmera. Cabeça grande e redonda, contorno preto grosso, olhos de ponto, corpo e membros finos.
import * as THREE from "three";

const OUT = "#141414";
const CW = 256, CH = 512;

function traco(ctx, x0, y0, x1, y1, larg, cor) {
  ctx.lineCap = "round";
  ctx.strokeStyle = OUT; ctx.lineWidth = larg + 9;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.strokeStyle = cor; ctx.lineWidth = larg;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
}
function disco(ctx, x, y, r, cor, borda = 7) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = cor; ctx.fill();
  if (borda) { ctx.strokeStyle = OUT; ctx.lineWidth = borda; ctx.stroke(); }
}
function caixa(ctx, x, y, w, h, r, cor, borda = 7) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = cor; ctx.fill();
  if (borda) { ctx.strokeStyle = OUT; ctx.lineWidth = borda; ctx.stroke(); }
}

// pose: {ph: fase do passo, mov: 0..1 quanto anda, bracos: 'baixo'|'cima'|'frente'|'aponta'|'telefone'|'segurar'|'binoculo', humor, olhar: -1..1}
function desenhar(ctx, c, p) {
  ctx.clearRect(0, 0, CW, CH);
  ctx.lineJoin = "round";
  const cx = 128, quadril = 338, perna = 150;
  // pernas
  for (const s of [-1, 1]) {
    const a = Math.sin(p.ph + (s > 0 ? 0 : Math.PI)) * 0.7 * p.mov;
    const x0 = cx + s * 22, x1 = x0 + Math.sin(a) * perna, y1 = quadril + Math.cos(a) * perna - (p.sobe || 0);
    traco(ctx, x0, quadril, x1, y1, 16, c.calca);
    ctx.beginPath(); ctx.ellipse(x1 + 10, y1 + 6, 24, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.sapato || "#2a2a2e"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
  }
  // corpo
  caixa(ctx, 86, 186, 84, 160, 30, c.casaco);
  if (c.detalhe) c.detalhe(ctx, cx, p);
  // braços
  const ombro = [[96, 214], [160, 214]];
  const fim = [[0, 0], [0, 0]];
  const sw = Math.sin(p.ph) * 0.9 * p.mov;
  const B = p.bracos;
  for (let i = 0; i < 2; i++) {
    const s = i === 0 ? -1 : 1, [ox, oy] = ombro[i];
    let dx = s * 16, dy = 104;
    if (B === "cima") { dx = s * 46; dy = -108 + Math.sin(p.ph * 0.6 + i) * 8 * (p.mov || 0.5); }
    else if (B === "frente") { dx = s * 8 + Math.sin(sw * (i ? 1 : -1)) * 60; dy = Math.cos(sw * (i ? 1 : -1)) * 100; }
    else if (B === "aponta") { if (i === 1) { dx = 100; dy = -26; } }
    else if (B === "telefone") { if (i === 1) { dx = 38; dy = -66; } }
    else if (B === "segurar") { dx = s * -34; dy = 72; }
    else if (B === "binoculo") { dx = s * -4; dy = -78; }
    fim[i] = [ox + dx, oy + dy];
    traco(ctx, ox, oy, ox + dx, oy + dy, 14, c.casaco);
    disco(ctx, ox + dx, oy + dy, 12, c.pele, 6);
  }
  if (B === "segurar" && c.item) c.item(ctx, fim[0][0] + 20, fim[0][1]);
  // cabeça
  disco(ctx, cx, 118, 77, c.pele, 8);
  const h = c.cabelo;
  if (h === "coque") {
    ctx.beginPath(); ctx.arc(cx, 118, 80, Math.PI * 1.04, Math.PI * 1.96); ctx.closePath();
    ctx.fillStyle = c.corCabelo; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
    disco(ctx, cx, 30, 27, c.corCabelo, 8);
  } else if (h === "bone") {
    ctx.beginPath(); ctx.arc(cx, 112, 80, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath();
    ctx.fillStyle = c.corCabelo; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx + 24, 78, 66, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.corCabelo; ctx.fill(); ctx.stroke();
  } else if (h === "chapeu") {
    ctx.beginPath(); ctx.ellipse(cx, 66, 104, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.corCabelo; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
    caixa(ctx, cx - 54, 8, 108, 60, 22, c.corCabelo);
  } else if (h === "grisalho") {
    for (const s of [-1, 1]) disco(ctx, cx + s * 70, 104, 16, c.corCabelo, 7);
    ctx.beginPath(); ctx.arc(cx, 112, 79, Math.PI * 1.1, Math.PI * 1.9); ctx.closePath();
    ctx.fillStyle = c.corCabelo; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
  }
  // rosto
  const o = (p.olhar || 0) * 7;
  const hm = p.humor || "neutro";
  disco(ctx, cx - 30 + o, 122, 7, OUT, 0); disco(ctx, cx + 30 + o, 122, 7, OUT, 0);
  ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = "round";
  // sobrancelhas: [ponta de fora, ponta de dentro] em y. Espanto = altas e inclinadas para cima; bravo = "V"
  const [yo, yi] = hm === "espanto" ? [80, 72] : hm === "bravo" ? [90, 106] : hm === "feliz" ? [92, 86] : [98, 98];
  ctx.beginPath(); ctx.moveTo(cx - 48 + o, yo); ctx.lineTo(cx - 14 + o, yi); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 14 + o, yi); ctx.lineTo(cx + 48 + o, yo); ctx.stroke();
  ctx.beginPath();
  if (hm === "espanto") { ctx.arc(cx + o, 166, 11, 0, Math.PI * 2); ctx.stroke(); }
  else if (hm === "feliz") { ctx.arc(cx + o, 154, 24, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  else if (hm === "bravo") { ctx.arc(cx + o, 178, 20, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
  else { ctx.moveTo(cx - 16 + o, 164); ctx.lineTo(cx + 16 + o, 164); ctx.stroke(); }
  if (c.oculos) {
    ctx.lineWidth = 6;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * 30 + o, 122, 25, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx - 5 + o, 120); ctx.lineTo(cx + 5 + o, 120); ctx.stroke();
  }
  if (c.barba) {
    ctx.beginPath(); ctx.arc(cx, 140, 70, 0.15 * Math.PI, 0.85 * Math.PI); ctx.closePath();
    ctx.fillStyle = c.barba; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + o, 168, 10, 0, Math.PI * 2); ctx.fillStyle = hm === "espanto" ? OUT : "#d9a98a"; ctx.fill();
  }
  if (B === "binoculo") {                  // o binóculo fica na frente do rosto
    caixa(ctx, cx - 62, 98, 52, 48, 14, "#3a3d44", 7); caixa(ctx, cx + 10, 98, 52, 48, 14, "#3a3d44", 7);
    caixa(ctx, cx - 14, 112, 28, 16, 4, "#3a3d44", 5);
    for (const sd of [-1, 1]) disco(ctx, cx + sd * 36, 122, 10, "#9cc7ee", 4);
    for (const i of [0, 1]) disco(ctx, fim[i][0], fim[i][1] - 10, 12, c.pele, 6);
  }
  if (c.silhueta) {                       // pessoa real que não vamos desenhar com rosto: só a sombra
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = c.silhueta; ctx.fillRect(0, 0, CW, CH);
    ctx.globalCompositeOperation = "source-over";
  }
}

export function criarPessoa(cfg) {
  const cv = document.createElement("canvas");
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext("2d");
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: THREE.DoubleSide });
  const sprite = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.2), mat);
  sprite.position.y = 1.1;
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, toneMapped: false }));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = 0.03; sombra.scale.set(1, 0.45, 1);
  const grupo = new THREE.Group();
  grupo.add(sombra, sprite);
  grupo.visible = false;
  return {
    grupo,
    mostrar(pos, pose, camPos, escala = 1, espelho = false) {
      grupo.visible = true;
      grupo.position.set(pos[0], pos[1], pos[2]);
      sprite.scale.set(escala * (espelho ? -1 : 1), escala, 1);
      sprite.position.y = 1.1 * escala;
      sprite.rotation.y = Math.atan2(camPos.x - pos[0], camPos.z - pos[2]);
      sombra.rotation.z = 0;
      desenhar(ctx, cfg, pose);
      tex.needsUpdate = true;
    },
    esconder() { grupo.visible = false; },
  };
}

// ---- os personagens do vídeo ----
const PELE = "#f4d2a6", PELE2 = "#d9a06b", PELE3 = "#8a5a36";
export const CFG = {
  // Lia, pesquisadora (inventada): jaleco branco com gola verde-água, óculos redondos, coque, prancheta
  lia: { pele: PELE, calca: "#22408f", casaco: "#f7f7f4", cabelo: "coque", corCabelo: "#4a3226", oculos: true,
    detalhe(ctx) { ctx.beginPath(); ctx.moveTo(108, 188); ctx.lineTo(128, 232); ctx.lineTo(148, 188); ctx.closePath(); ctx.fillStyle = "#2f9e9a"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(128, 232); ctx.lineTo(128, 338); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
      caixa(ctx, 140, 248, 20, 26, 4, "#ffffff", 4); },
    item(ctx, x, y) { caixa(ctx, x - 36, y - 40, 54, 70, 6, "#b7834f", 6); caixa(ctx, x - 28, y - 30, 38, 52, 3, "#ffffff", 4); } },
  capitao: { pele: PELE2, calca: "#2b3a55", casaco: "#274b8a", cabelo: "bone", corCabelo: "#1d2f55", barba: "#cfd3d8",
    detalhe(ctx) { for (const y of [220, 258, 296]) disco(ctx, 128, y, 6, "#ffc94a", 4); } },
  marinheiro: { pele: PELE3, calca: "#6b4a2d", casaco: "#e9e4d6", cabelo: "bone", corCabelo: "#b7834f",
    detalhe(ctx) { for (const y of [210, 250, 290]) { ctx.strokeStyle = "#2c5a96"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(90, y); ctx.lineTo(166, y); ctx.stroke(); } } },
  taxidermista: { pele: PELE2, calca: "#3a3a40", casaco: "#d8c8a8", cabelo: "grisalho", corCabelo: "#8a8f95", oculos: true,
    detalhe(ctx) { caixa(ctx, 100, 240, 56, 98, 10, "#a0522d", 5); } },
  // Smith: cientista da época, desenhado de forma genérica (sem tentar parecer com a pessoa real)
  smith: { pele: PELE, calca: "#2b2b30", casaco: "#6b5b4b", cabelo: "chapeu", corCabelo: "#4a4038", oculos: true,
    detalhe(ctx) { ctx.beginPath(); ctx.moveTo(128, 190); ctx.lineTo(116, 204); ctx.lineTo(128, 296); ctx.lineTo(140, 204); ctx.closePath(); ctx.fillStyle = "#e2482f"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); } },
  diretor: { pele: PELE, calca: "#1d2a3f", casaco: "#22408f", cabelo: "grisalho", corCabelo: "#d8d8d8",
    detalhe(ctx) { ctx.beginPath(); ctx.moveTo(128, 190); ctx.lineTo(118, 206); ctx.lineTo(128, 262); ctx.lineTo(138, 206); ctx.closePath(); ctx.fillStyle = "#a02030"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); } },
  pescador: { pele: PELE3, calca: "#e2482f", casaco: "#f3d98b", cabelo: "chapeu", corCabelo: "#e8d49b",
    detalhe() {} },
  biologo: { pele: PELE2, calca: "#33415c", casaco: "#2f9e9a", cabelo: "bone", corCabelo: "#f2b233",
    detalhe(ctx) { caixa(ctx, 104, 230, 48, 40, 8, "#ffffff", 4); } },
  parceira: { pele: PELE3, calca: "#33415c", casaco: "#f2b233", cabelo: "coque", corCabelo: "#1c1c1c",
    detalhe() {} },
  curadora: { pele: PELE, calca: "#22408f", casaco: "#f7f7f4", cabelo: "coque", corCabelo: "#4a3226", silhueta: "#1d4f58",
    detalhe() {} },
};
