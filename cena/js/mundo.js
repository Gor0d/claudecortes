// Os cenários em 3D (formas simples, cores chapadas) e o peixe. Cada cenário fica num pedaço do espaço (ENVX),
// para a câmera cortar de um para o outro sem carregar nada. Nada aleatório: tudo sai do tempo t ou de h(n).
import * as THREE from "three";
import { material, malha } from "./kit.js";
import { h } from "./hud.js";

export const ENVX = { cais: 0, deck: 100, oficina: 200, mar: 300, comores: 400, mercado: 500, palco: 600 };

const add = (g, m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); g.add(m); return m; };
const B = (w, hh, d, c, r = 0.8) => malha(new THREE.BoxGeometry(w, hh, d), material(c, { roughness: r }));
const C = (rt, rb, hh, c, seg = 18) => malha(new THREE.CylinderGeometry(rt, rb, hh, seg), material(c, { roughness: 0.8 }));
const S = (r, c, sx = 1, sy = 1, sz = 1) => { const m = malha(new THREE.SphereGeometry(r, 22, 16), material(c, { roughness: 0.7 })); m.scale.set(sx, sy, sz); return m; };
const PL = (w, d, c) => { const m = malha(new THREE.PlaneGeometry(w, d), material(c, { roughness: 1 })); m.rotation.x = -Math.PI / 2; m.castShadow = false; return m; };

export function placa(texto, w, hh, fg = "#ffffff", bg = "#2f4b66", px = 150) {
  const cv = document.createElement("canvas");
  cv.width = 1024; cv.height = Math.round(1024 * hh / w);
  const x = cv.getContext("2d");
  x.fillStyle = bg; x.fillRect(0, 0, cv.width, cv.height);
  x.strokeStyle = "#141414"; x.lineWidth = 18; x.strokeRect(9, 9, cv.width - 18, cv.height - 18);
  x.fillStyle = fg; x.font = `900 ${px}px "Arial Black", Arial, sans-serif`; x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText(texto, cv.width / 2, cv.height / 2 + 6);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
}

// ---------------- o celacanto ----------------
export function criarPeixe(corpoCor = 0x3a6fb5) {
  const g = new THREE.Group();
  g.add(S(1, corpoCor, 1.7, 0.62, 0.42));
  for (let i = 0; i < 16; i++) {                       // as manchas brancas
    const a = (h(i * 3 + 1) * 2 - 1) * 0.82, lado = i % 2 ? 1 : -1;
    const k = Math.sqrt(1 - a * a);
    const m = S(0.052, 0xffffff, 1, 1, 0.35);
    m.position.set(a * 1.7, (h(i + 9) * 1.2 - 0.45) * 0.62 * k, lado * 0.42 * k * 0.97);
    g.add(m);
  }
  const rabo = new THREE.Group();
  rabo.position.set(-1.62, 0, 0);
  const leque = malha(new THREE.ConeGeometry(0.5, 1.0, 3), material(0x2c5a96));
  leque.rotation.z = -Math.PI / 2; leque.scale.set(1, 1, 0.16); leque.position.x = -0.5;
  rabo.add(leque);
  const lobo = S(0.22, 0x2c5a96, 1.8, 0.3, 0.3); lobo.position.set(-0.9, 0, 0); rabo.add(lobo);   // a pequena barbatana do meio do rabo
  g.add(rabo);
  for (const s of [-1, 1]) {                           // as barbatanas "de perna" do celacanto
    const f = S(0.3, 0x2c5a96, 1.4, 0.3, 0.45); f.position.set(0.55, -0.42, s * 0.5); f.rotation.z = -0.5; f.rotation.y = s * 0.5; g.add(f);
    const f2 = S(0.26, 0x2c5a96, 1.3, 0.3, 0.4); f2.position.set(-0.6, -0.45, s * 0.38); f2.rotation.z = 0.5; g.add(f2);
    const olho = S(0.065, 0x111111); olho.position.set(1.3, 0.2, s * 0.33); g.add(olho);
  }
  const d1 = S(0.3, 0x2c5a96, 1.2, 0.55, 0.15); d1.position.set(-0.2, 0.62, 0); g.add(d1);
  g.userData.rabo = rabo;
  g.visible = false;
  return g;
}

// ---------------- os cenários ----------------
function cais() {
  const g = new THREE.Group();
  add(g, PL(400, 400, 0x4a9bb8), 0, -0.55, 0);
  add(g, PL(160, 40, 0xd9c08f), 0, -0.5, -30);
  add(g, B(24, 0.4, 7, 0xb58a5b), 2, -0.1, 1.5);
  for (let i = 0; i < 13; i++) add(g, B(0.05, 0.41, 7, 0x8a6540), -9 + i * 2, -0.1, 1.5);
  for (let i = 0; i < 7; i++) { add(g, C(0.18, 0.18, 1.6, 0x6b4a2d), -9 + i * 4, -0.6, 5.2); add(g, C(0.18, 0.18, 1.6, 0x6b4a2d), -9 + i * 4, -0.6, -2.2); }
  add(g, B(8, 6, 6, 0xe9e1d0), 11, 3, -2.4);
  add(g, B(8.8, 0.5, 6.8, 0xb8553d), 11, 6.25, -2.4);
  add(g, B(1.6, 3, 0.2, 0x3e5c76), 11, 1.5, 0.7);
  add(g, B(2.6, 0.3, 1.3, 0xcfc7b4), 11, 0.15, 1.35);
  add(g, B(2.6, 0.3, 0.95, 0xcfc7b4), 11, 0.45, 1.0);
  add(g, B(2.6, 0.3, 0.6, 0xcfc7b4), 11, 0.75, 0.75);
  for (const x of [8.4, 13.6]) add(g, B(1.2, 1.2, 0.1, 0xbfe3f5), x, 3.5, 0.62);
  add(g, placa("LABORATÓRIO", 5.2, 1.0, "#ffffff", "#2f9e9a", 120), 11, 4.9, 0.68);
  for (const [x, z] of [[-8.2, -1.0], [-7.2, -1.4]]) add(g, C(0.6, 0.6, 1.1, 0x7a4a2d), x, 0.65, z);
  for (const [x, z] of [[-9.8, -1.0], [-8.8, -1.3]]) add(g, B(1, 1, 1, 0xc99a5b), x, 0.6, z);
  add(g, S(1.0, 0x2d6a4f, 1.6, 0.5, 1.1), -9.5, 0.35, 3.6);
  add(g, C(0, 22, 16, 0x5b7a99, 6), -45, 7, -90);
  add(g, C(0, 18, 12, 0x6a89a8, 6), 32, 5, -100);
  return g;
}
function mesaCais() {
  const g = new THREE.Group();
  add(g, B(3.2, 0.2, 1.8, 0x8e5a33), 2, 1.1, 1.8);
  for (const [x, z] of [[0.6, 1.1], [3.4, 1.1], [0.6, 2.5], [3.4, 2.5]]) add(g, B(0.15, 1.1, 0.15, 0x6b4a2d), x, 0.55, z);
  return g;
}
function deck() {
  const g = new THREE.Group();
  add(g, PL(400, 400, 0x3d86ad), 0, -1.2, 0);
  add(g, B(16, 1.8, 8, 0x8c5a34), 0, -0.5, 0);
  add(g, B(15.6, 0.2, 7.6, 0xb88650), 0, 0.4, 0);
  for (let i = 0; i < 15; i++) add(g, B(0.05, 0.21, 7.6, 0x8a6540), -7.2 + i, 0.4, 0);
  for (const z of [-3.8]) { add(g, B(15.6, 0.22, 0.2, 0x6b4a2d), 0, 1.4, z); for (let i = 0; i < 7; i++) add(g, B(0.2, 1.0, 0.2, 0x6b4a2d), -7 + i * 2.3, 0.9, z); }
  add(g, B(4, 3, 3.2, 0xe7e0d0), -4.5, 2.0, -2.2);
  add(g, B(4.4, 0.3, 3.6, 0xb8553d), -4.5, 3.6, -2.2);
  add(g, C(0.2, 0.2, 9, 0x6b4a2d), 3.5, 5, -2.2);
  add(g, S(1.6, 0x2d6a4f, 1.5, 0.4, 1.2), 1.6, 0.7, -1.2);
  for (const x of [-1, 0.3]) add(g, S(0.32, 0xe2482f), x, 0.75, -1.4);
  add(g, C(0, 20, 12, 0x6a89a8, 6), -60, 4, -100);
  return g;
}
function oficina() {
  const g = new THREE.Group();
  add(g, B(24, 0.3, 14, 0xb7834f), 0, -0.15, 0);
  add(g, B(24, 10, 0.3, 0xeee7db), 0, 5, -5.5);
  add(g, B(0.3, 10, 14, 0xe5dcc8), -11.5, 5, 0);
  add(g, B(3.4, 3.4, 0.12, 0x9cc7ee), -6, 5.2, -5.3);
  add(g, B(3.8, 0.2, 0.2, 0x6b4a2d), -6, 7, -5.3); add(g, B(3.8, 0.2, 0.2, 0x6b4a2d), -6, 3.4, -5.3);
  add(g, B(5.5, 0.2, 1.1, 0x8e5a33), 5, 4.2, -5);
  for (let i = 0; i < 5; i++) add(g, C(0.3, 0.3, 0.9, [0x9cc7ee, 0xf3d98b, 0x6faa7c][i % 3]), 2.9 + i * 1.0, 4.85, -5);
  add(g, B(5.6, 0.3, 2.6, 0x8e5a33), 0, 1.3, 0.4);
  for (const [x, z] of [[-2.5, -0.7], [2.5, -0.7], [-2.5, 1.5], [2.5, 1.5]]) add(g, B(0.2, 1.3, 0.2, 0x6b4a2d), x, 0.65, z);
  add(g, B(2.3, 5.2, 0.2, 0x6b4a2d), 8, 2.6, -5.2);
  add(g, placa("MUSEU", 4.2, 1.1, "#ffffff", "#274b8a", 150), 0, 7.6, -5.3);
  for (let i = 0; i < 3; i++) add(g, B(0.7, 0.9, 0.7, 0xc99a5b), -9 + i * 0.9, 0.45, -3.8);
  return g;
}
function mar() {
  const g = new THREE.Group();
  add(g, PL(500, 500, 0xc9b58a), 0, -9, 0);
  for (let i = 0; i < 26; i++) add(g, S(0.7 + h(i) * 1.6, 0x7a7466, 1.4, 0.7, 1), -40 + h(i + 3) * 80, -9 + 0.2, -30 + h(i + 7) * 40);
  for (let i = 0; i < 22; i++) {
    const m = malha(new THREE.ConeGeometry(0.4 + h(i + 2) * 0.5, 1.4 + h(i + 4) * 2.2, 7), material([0xe2482f, 0xffc94a, 0xd0669b, 0x6faa7c][i % 4]));
    m.position.set(-30 + h(i + 11) * 60, -8.2, -22 + h(i + 5) * 26); g.add(m);
  }
  for (let i = 0; i < 6; i++) {
    const ray = new THREE.Mesh(new THREE.PlaneGeometry(3, 40), new THREE.MeshBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0.09, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
    ray.position.set(-18 + i * 7, 4, -12); ray.rotation.z = 0.25; g.add(ray);
  }
  g.userData.bolhas = [];
  for (let i = 0; i < 28; i++) {
    const b = S(0.12 + h(i) * 0.12, 0xdff6ff); b.material = new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.55, toneMapped: false }); b.castShadow = false;
    g.add(b); g.userData.bolhas.push(b);
  }
  g.userData.peixinhos = [];
  for (let i = 0; i < 10; i++) {
    const f = S(0.28, [0xffc94a, 0xf09a92, 0x9cc7ee][i % 3], 1.8, 0.8, 0.5); g.add(f); g.userData.peixinhos.push(f);
  }
  return g;
}
export function animarMar(g, u) {
  g.userData.bolhas.forEach((b, i) => { const per = 7 + h(i + 20) * 5; b.position.set(-14 + h(i + 30) * 28 + Math.sin(u * 1.5 + i) * 0.3, -9 + ((u + h(i) * per) % per) / per * 18, -6 + h(i + 40) * 8); });
  g.userData.peixinhos.forEach((f, i) => { const v = 1.2 + h(i + 50) * 1.4; f.position.set(-30 + ((u * v + h(i) * 60) % 60), -2 + h(i + 60) * 8 + Math.sin(u + i) * 0.4, -14 - h(i + 70) * 10); });
}
function palmeira(g, x, z, incl) {
  const t = C(0.22, 0.34, 5.4, 0x8a5a34); t.position.set(x, 2.6, z); t.rotation.z = incl; g.add(t);
  for (let i = 0; i < 6; i++) {
    const f = malha(new THREE.ConeGeometry(0.35, 3.2, 4), material(0x3f9a4a)); f.scale.set(1, 1, 0.25);
    const a = (i / 6) * Math.PI * 2; f.position.set(x + Math.sin(incl) * -2.6 + Math.cos(a) * 1.3, 5.3, z + Math.sin(a) * 1.3);
    f.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1 + 0); g.add(f);
  }
}
function comores() {
  const g = new THREE.Group();
  add(g, PL(500, 500, 0x31c3c9), 0, -0.6, 0);
  add(g, S(9, 0xe8d49b, 1.9, 0.34, 1.3), -7, -0.4, -9);
  add(g, S(3.5, 0x4f8a4a, 1.6, 0.8, 1.2), -9, 0.5, -10);
  palmeira(g, -4, -8, 0.15); palmeira(g, -9, -7, -0.2); palmeira(g, -12, -10, 0.1);
  add(g, B(6, 0.5, 1.5, 0x8a5a34), 2.5, 0.0, 1.8);
  add(g, B(0.6, 0.9, 1.2, 0x8a5a34), -0.7, 0.3, 1.8); add(g, B(0.6, 0.9, 1.2, 0x8a5a34), 5.7, 0.3, 1.8);
  add(g, B(8, 0.08, 0.12, 0x6b4a2d), 2.5, 0.6, 3.1);
  add(g, C(0, 18, 12, 0x4f8a4a, 6), 40, 4, -90);
  return g;
}
function mercado() {
  const g = new THREE.Group();
  add(g, PL(160, 80, 0xcfc3ad), 0, 0, 0);
  add(g, B(44, 9, 0.3, 0xe8d3b8), 0, 4.5, -7);
  for (const x of [-7, 0, 7]) {
    add(g, B(5, 0.25, 2.2, 0x8e5a33), x, 1.3, -2);
    for (const dx of [-2.3, 2.3]) add(g, B(0.2, 1.3, 0.2, 0x6b4a2d), x + dx, 0.65, -2.9);
    for (let i = 0; i < 10; i++) add(g, B(0.52, 0.1, 3.0, i % 2 ? 0xe2482f : 0xf6f4ee), x - 2.34 + i * 0.52, 3.9, -2.6).rotation.x = 0.28;
    for (const dx of [-2.4, 2.4]) add(g, C(0.08, 0.08, 3.8, 0x6b4a2d), x + dx, 1.9, -3.4);
  }
  add(g, B(3.8, 0.45, 1.5, 0xdff1ff), 0, 1.7, -2);
  for (const [x, z] of [[-10, -1], [11, -1.2]]) add(g, B(1.1, 1.1, 1.1, 0xc99a5b), x, 0.55, z);
  add(g, placa("MERCADO", 4.6, 1.0, "#ffffff", "#c0392b", 130), 0, 7.2, -6.8);
  return g;
}
function palco() {
  const g = new THREE.Group();
  add(g, B(40, 16, 0.3, 0x2f9e9a), 0, 8, -6);
  add(g, B(40, 0.3, 24, 0xeee7db), 0, -0.15, 0);
  return g;
}

export function criarMundos(cena) {
  const m = { cais: cais(), mesa: mesaCais(), deck: deck(), oficina: oficina(), mar: mar(), comores: comores(), mercado: mercado(), palco: palco() };
  m.cais.position.x = ENVX.cais; m.mesa.position.x = ENVX.cais; m.deck.position.x = ENVX.deck; m.oficina.position.x = ENVX.oficina;
  m.mar.position.x = ENVX.mar; m.comores.position.x = ENVX.comores; m.mercado.position.x = ENVX.mercado; m.palco.position.x = ENVX.palco;
  Object.values(m).forEach((g) => cena.add(g));
  return m;
}
