// A cena do vídeo: "O peixe que voltou" (Taxon Lazarus, o celacanto). 58 s, 1080x1920, 30 fps.
// Tudo é função do tempo e cada coisa entra numa palavra falada (Wd). Os cortes seguem o ritmo medido na referência (estudo.md).
import * as THREE from "three";
import { clamp, lerp, ramp, pop, easeOut, easeIO, K, camera } from "./kit.js";
import { criarTextos } from "./textos.js";
import { criarHud, h, CORACAO, CAMERA } from "./hud.js";
import { criarPessoa, CFG } from "./pessoas.js";
import { criarMundos, criarPeixe, animarMar, ENVX } from "./mundo.js";
import T from "./tempos.js";

const W = 1080, H = 1920;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]/g, "");
const PALAVRAS = T.frases.flatMap((f, i) => f.palavras.map((p) => ({ ...p, frase: i })));
export function Wd(palavra, n = 0) {
  const alvo = norm(palavra);
  const achadas = PALAVRAS.filter((p) => norm(p.w).startsWith(alvo));
  if (!achadas[n]) throw new Error(`a palavra "${palavra}" (${n}) não está nas falas`);
  return achadas[n].s;
}
const Z = (env, x, y, z) => [ENVX[env] + x, y, z];
const milhar = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ---------- os instantes: cada um é uma palavra do roteiro ----------
const A = {
  cut1: Wd("reaparecer") - 0.03,      // referência: corte seco para o close em 1,567 s
  cut2: Wd("lia"),                    // 2,567 s
  tTimer: Wd("10"),                   // o relógio de 10 s (3,33 s)
  cut3: Wd("chegar") + 0.25,          // 4,333 s
  pausa: Wd("pausa"),
  phone: Wd("cientistas"),            // o celular (6,733 s)
  mi66: Wd("66"), anos: Wd("anos"), ninguem: Wd("ninguem"), viu: Wd("viu"),
  sabe: Wd("sabe"),                   // o conteúdo do celular troca (11,833 s)
  laranja: Wd("1938") - 0.1,          // fundo laranja (13,3 s)
  rede: Wd("rede"),                   // close dentro do celular (14,8 s)
  capitao: Wd("capitao"),
  azul: Wd("azul", 1), manchas: Wd("manchas"),
  ela: Wd("ela"), empalhar: Wd("empalhar"),
  quase: Wd("quase"), chega: Wd("chega", 1), olha: Wd("olha"), celacanto: Wd("celacanto"),
  duvida: Wd("cientistas", 1), jornais: Wd("jornais"), mas: Wd("mas"),
  taxon: Wd("cientistas", 2), some: Wd("some"), volta: Wd("volta"),
  proc: Wd("smith", 1), a1952: Wd("1952"), comores: Wd("comores"), a1997: Wd("1997"), indo: Wd("indonesia"),
  era: Wd("era"), segunda: Wd("segunda"), lia2: Wd("lia", 1), curadora: Wd("curadora"), nunca: Wd("nunca"),
};
A.azulCena = Wd("peixe", 3) - 0.1;
const PALAVRAS_AMARELAS = new Set(["laboratorio", "66", "milhoes", "celacanto", "taxon", "lazaro", "1938", "1952", "1997", "comores", "indonesia", "azul", "manchas", "fossil", "vivo", "curadora", "empalhar"]);

const pz = (tw, bracos = "baixo", humor = "neutro", mov = 0, olhar = 0) => ({ ph: tw * 10, mov, bracos, humor, olhar });

// ---------- os planos ----------
// cam(t0, t1) -> pontos-chave; cena(u, f, tw) -> quem aparece, onde e em qual pose
const SH = [
  { t0: 0, env: "cais", bg: 0xf5cfa3,
    cam: (a, b) => [K(a, Z("cais", 0.2, 1.7, 1.6), 8, 5, 14), K(b, Z("cais", 0.2, 1.7, 1.6), 2, 5, 12)],
    cena: (u, f, tw) => ({ gente: [["lia", Z("cais", 0.5, 0.1, 1.8), pz(tw, "baixo", f > 0.8 ? "espanto" : "neutro")]], peixe: { pos: Z("cais", -2.2, 0.5, 3.3), rot: [0.4, 0], esc: 1.05 } }) },
  { t0: A.cut1, env: "cais", bg: 0xf5cfa3,           // close com borrão de movimento, freando aos poucos
    cam: (a, b) => [K(a, Z("cais", 0.5, 1.75, 1.8), -12, 3, 2.3), K(a + 0.5, Z("cais", 0.5, 1.75, 1.8), -8, 3, 3.9), K(b, Z("cais", 0.5, 1.75, 1.8), -4, 3, 4.3)],
    cena: (u, f, tw) => ({ gente: [["lia", Z("cais", 0.5, 0.1, 1.8), pz(tw, "cima", "espanto", 0.3)]], peixe: { pos: Z("cais", -2.2, 0.5, 3.3), rot: [0.4, 0], esc: 1.05 } }) },
  { t0: A.cut2, env: "cais", bg: 0xf5cfa3,           // ela corre, câmera de lado
    cam: (a, b) => [K(a, Z("cais", -3.5, 1.5, 1.8), -32, 5, 11), K(b, Z("cais", 6.5, 1.5, 1.8), -32, 5, 11)],
    cena: (u, f, tw) => ({ gente: [["lia", Z("cais", lerp(-3.5, 6.5, f), 0.1, 1.8), pz(tw, "frente", "neutro", 1)]], peixe: { pos: Z("cais", -2.2, 0.5, 3.3), rot: [0.4, 0], esc: 1.05 } }) },
  { t0: A.cut3, env: "cais", bg: 0xf5cfa3,           // a escada do laboratório
    cam: (a, b) => [K(a, Z("cais", 7, 1.6, 1.4), 20, 4, 10), K(A.pausa, Z("cais", 10.8, 1.9, 1.0), 10, 3, 8), K(b, Z("cais", 10.8, 1.9, 1.0), 10, 3, 8)],
    cena: (u, f, tw, s) => {
      const ff = clamp(u / (A.pausa - s.t0)), p1 = clamp(ff / 0.4), p2 = clamp((ff - 0.4) / 0.6);
      return { gente: [["lia", [ENVX.cais + lerp(lerp(6.5, 10.2, p1), 11, p2), lerp(0.1, 0.95, easeIO(p2)), lerp(1.8, 0.9, p2)], pz(tw, "frente", "neutro", p2 < 0.95 ? 1 : 0)]] };
    } },
  { t0: A.sabe, env: "mar", bg: 0x0b4a7d, fog: true,   // dentro do celular: o mar
    cam: (a, b) => [K(a, Z("mar", -2, -1, 0), 12, 4, 16), K(b, Z("mar", 2, -1, 0), -6, 3, 13)],
    cena: (u, f, tw) => ({ gente: [], peixe: { pos: Z("mar", lerp(-9, 3, f), -1 + Math.sin(u * 1.2) * 0.5, 0), rot: [0, 0], esc: 1.2, nada: true } }) },
  { t0: A.laranja, env: "deck", bg: 0x9fd0ea,         // 1938: o barco puxa a rede
    cam: (a, b) => [K(a, Z("deck", 0, 2.2, 0.5), -18, 8, 22), K(b, Z("deck", 0.5, 1.6, 1), -6, 6, 14)],
    cena: (u, f, tw) => ({ gente: [["capitao", Z("deck", -2, 0.5, 1.2), pz(tw, "baixo")], ["marinheiro", Z("deck", 2.8, 0.5, 0.8), pz(tw, "frente", "bravo", 0.5)]], peixe: { pos: Z("deck", 1.2, 1.3, 2.0), rot: [0.3, 0], esc: 1.3 } }) },
  { t0: A.rede, env: "deck", bg: 0x9fd0ea,            // close na rede subindo
    cam: (a, b) => [K(a, Z("deck", 1.2, 1.3, 1.8), 8, 5, 6.5), K(b, Z("deck", 1.2, 1.3, 1.8), 0, 4, 5.5)],
    cena: (u, f, tw) => ({ gente: [["marinheiro", Z("deck", 2.8, 0.5, 0.8), pz(tw, "cima", "bravo", 0.4)], ["capitao", Z("deck", -1.2, 0.5, 1.2), pz(tw, "baixo")]], peixe: { pos: Z("deck", 1.2, 1.3, 2.0), rot: [0.3, 0], esc: 1.3 } }) },
  { t0: A.capitao, env: "deck", bg: 0x9fd0ea,          // o celular some e vira tela cheia: o capitão liga para o museu
    cam: (a, b) => [K(a, Z("deck", -1, 1.9, 1.2), -14, 4, 7), K(b, Z("deck", -1, 1.9, 1.2), -6, 4, 6)],
    cena: (u, f, tw) => ({ gente: [["capitao", Z("deck", -1.2, 0.5, 1.2), pz(tw, "telefone", "feliz")], ["marinheiro", Z("deck", 3.4, 0.5, 0.5), pz(tw, "baixo")]], peixe: { pos: Z("deck", 1.0, 1.25, 2.2), rot: [0.3, 0], esc: 1.2 } }) },
  { t0: A.azulCena, env: "cais", bg: 0xf5cfa3, mesa: true,   // o peixe azul na mesa
    cam: (a, b) => [K(a, Z("cais", 2.8, 1.9, 1.8), -14, 12, 8), K(b, Z("cais", 2.8, 1.9, 1.8), -6, 10, 6.5)],
    cena: (u, f, tw) => ({ gente: [["lia", Z("cais", 4.5, 0.1, 2.4), pz(tw, "segurar", "espanto"), 1, true]], peixe: { pos: Z("cais", 2, 1.78, 1.8), rot: [0.25, 0], esc: 0.85 }, mesa: true }) },
  { t0: A.ela, env: "oficina", bg: 0xe9dcc4,            // ela manda empalhar
    cam: (a, b) => [K(a, Z("oficina", 0, 2.2, 0.8), -10, 6, 15), K(b, Z("oficina", 0, 2.0, 0.8), 2, 5, 12.5)],
    cena: (u, f, tw) => ({ gente: [["lia", Z("oficina", -2.0, 0.05, 2.5), pz(tw, "segurar", "neutro")], ["taxidermista", Z("oficina", 2.0, 0.05, 2.5), pz(tw, "frente", "neutro", 0.3)]], peixe: { pos: Z("oficina", 0, 2.2, 0.4), rot: [0.2, 0], esc: 1.0 } }) },
  { t0: A.quase, env: "oficina", bg: 0xe9dcc4,          // quase dois meses depois: Smith chega
    cam: (a, b) => [K(a, Z("oficina", 1, 2.2, 1), 10, 6, 15), K(b, Z("oficina", 0.6, 2.0, 1), 0, 5, 12)],
    cena: (u, f, tw) => ({ gente: [["lia", Z("oficina", -2.2, 0.05, 2.5), pz(tw, "segurar", "neutro")], ["smith", [ENVX.oficina + lerp(7, 2.0, easeOut(clamp(f * 1.5))), 0.05, 2.5], f < 0.65 ? pz(tw, "frente", "neutro", 1) : pz(tw, "baixo")]], peixe: { pos: Z("oficina", 0, 2.2, 0.4), rot: [0.2, 0], esc: 1.0 } }) },
  { t0: A.olha, env: "oficina", bg: 0xe9dcc4,           // ele reconhece: é um celacanto
    cam: (a, b) => [K(a, Z("oficina", 0.4, 2.1, 1.2), -10, 4, 9.5), K(b, Z("oficina", 0.4, 2.1, 1.2), -4, 4, 8)],
    cena: (u, f, tw) => ({ gente: [["smith", Z("oficina", 1.7, 0.05, 2.5), pz(tw, "aponta", "espanto"), 1, true], ["lia", Z("oficina", -1.9, 0.05, 2.5), pz(tw, "segurar", "espanto")]], peixe: { pos: Z("oficina", 0, 2.2, 0.4), rot: [0.2, 0], esc: 1.0 } }) },
  { t0: A.duvida - 0.1, env: "oficina", bg: 0xe9dcc4,   // cientistas e jornais do mundo inteiro duvidaram
    cam: (a, b) => [K(a, Z("oficina", 0, 2.0, 1.4), -6, 4, 13), K(b, Z("oficina", 0, 2.0, 1.4), 6, 4, 11.5)],
    cena: (u, f, tw) => ({ gente: [["diretor", Z("oficina", -1.5, 0.05, 2.6), pz(tw, "aponta", "bravo")], ["smith", Z("oficina", 1.5, 0.05, 2.6), pz(tw, "baixo", "neutro")]], peixe: { pos: Z("oficina", 0, 2.2, 0.2), rot: [0.2, 0], esc: 1.0 } }) },
  { t0: A.mas - 0.1, env: "mar", bg: 0x0b4a7d, fog: true,   // mas ele não sumiu: vivia no fundo do mar
    cam: (a, b) => [K(a, Z("mar", -3, 3, 0), 14, 8, 18), K(b, Z("mar", 1, -3, 0), 0, 3, 13)],
    cena: (u, f, tw) => ({ gente: [], peixe: { pos: Z("mar", lerp(-6, 4, f), lerp(3, -3, easeIO(f)), 0), rot: [0, -0.2], esc: 1.4, nada: true } }) },
  { t0: A.taxon, env: "mar", bg: 0x0b4a7d, fog: true,    // táxon Lázaro
    cam: (a, b) => [K(a, Z("mar", 0, -2, 0), -16, 3, 11), K(b, Z("mar", 2, -2, 0), 12, 4, 9)],
    cena: (u, f, tw) => ({ gente: [], peixe: { pos: Z("mar", lerp(-3, 5, f), -2 + Math.sin(u * 1.5) * 0.4, 0), rot: [0, 0], esc: 1.4, nada: true } }) },
  { t0: A.proc, env: "deck", bg: 0x9fd0ea,               // Smith procura outro por mais de dez anos
    cam: (a, b) => [K(a, Z("deck", 2, 2, 1.4), -12, 6, 11), K(b, Z("deck", 2.8, 2, 1.4), 4, 5, 8.5)],
    cena: (u, f, tw) => ({ gente: [["smith", Z("deck", 3, 0.5, 1.4), pz(tw, "binoculo", "neutro", 0, Math.sin(u * 2))]], peixe: null }) },
  { t0: A.a1952 - 0.1, env: "comores", bg: 0x8fd3f0,       // 1952: Comores
    cam: (a, b) => [K(a, Z("comores", 0, 2.2, 0), -14, 9, 22), K(b, Z("comores", 1.5, 1.8, 1.5), 6, 6, 12)],
    cena: (u, f, tw) => ({ gente: [["pescador", Z("comores", 1.2, 0.4, 1.9), pz(tw, "cima", "feliz", 0.2)]], peixe: { pos: Z("comores", 1.2, 2.9, 1.9), rot: [0, 0.4], esc: 0.9 } }) },
  { t0: A.a1997 - 0.1, env: "mercado", bg: 0xbfe3f5,       // 1997: um biólogo em lua de mel
    cam: (a, b) => [K(a, Z("mercado", -1.5, 1.9, 0), -12, 5, 13), K(b, Z("mercado", -1, 1.9, 0), 4, 5, 9.5)],
    cena: (u, f, tw) => ({ gente: [["biologo", Z("mercado", -2.6, 0.05, 1.2), pz(tw, "aponta", "espanto")], ["parceira", Z("mercado", -4.1, 0.05, 1.5), pz(tw, "baixo", "feliz")]], peixe: { pos: Z("mercado", 0, 2.55, -2), rot: [0.1, 0], esc: 1.0 } }) },
  { t0: A.era, env: "mercado", bg: 0xbfe3f5,              // era uma segunda espécie
    cam: (a, b) => [K(a, Z("mercado", 0, 2.1, -1), 0, 8, 10), K(b, Z("mercado", 0, 2.1, -1), -4, 8, 8.6)],
    cena: (u, f, tw) => ({ gente: [["biologo", Z("mercado", 0, 0.05, 0.4), pz(tw, "aponta", "feliz")]], peixe: { pos: Z("mercado", -1.25, 2.4, -2), rot: [0.1, 0], esc: 0.7 }, peixe2: { pos: Z("mercado", 1.25, 2.4, -2), rot: [0.1 + Math.PI, 0], esc: 0.7 } }) },
  { t0: A.lia2, env: "palco", bg: 0xeee7db,                // a Lia é inventada; a curadora, não
    cam: (a, b) => [K(a, Z("palco", 0, 1.9, 0), 0, 3, 9.5), K(b, Z("palco", 0, 1.9, 0), 0, 3, 8)],
    cena: (u, f, tw) => ({ gente: [["lia", Z("palco", -1.0, 0.05, 0), pz(tw, "baixo", "feliz")], ["curadora", Z("palco", 1.0, 0.05, 0), pz(tw, "segurar", "neutro")]] }) },
  { t0: A.nunca - 0.05, env: "mar", bg: 0x0b4a7d, fog: true,  // o peixe nunca foi embora
    cam: (a, b) => [K(a, Z("mar", -3, -1, 0), 0, 2, 9), K(b, Z("mar", -8, 0, 0), -12, 3, 24)],
    cena: (u, f, tw) => ({ gente: [], peixe: { pos: Z("mar", lerp(-1, -16, easeIO(f)), lerp(-1, 1, f), 0), rot: [Math.PI, 0], esc: 1.4, nada: true } }) },
];
SH.forEach((s, i) => { s.t1 = SH[i + 1] ? SH[i + 1].t0 : T.duracao; });
const shotDe = (tw) => { let k = 0; for (let i = 0; i < SH.length; i++) if (tw >= SH[i].t0) k = i; return k; };

// a câmera: pontos-chave de todos os planos; entre planos o corte é seco (dois pontos quase no mesmo instante)
const chaves = [];
SH.forEach((s, i) => {
  if (i > 0) chaves.push({ ...chaves[chaves.length - 1], t: s.t0 - 0.001 });
  chaves.push(...s.cam(s.t0, s.t1));
});

const PW = W * 0.96, PH = H * 0.96, BEZ = 26;
const SW = PW - 2 * BEZ, SHT = PH - 2 * BEZ;

function formaArredondada(x, y, w, hh, r) {
  const s = new THREE.Shape();
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + hh - r); s.quadraticCurveTo(x + w, y + hh, x + w - r, y + hh);
  s.lineTo(x + r, y + hh); s.quadraticCurveTo(x, y + hh, x, y + hh - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function fundoGradiente(c1, c2) {
  const g = new THREE.PlaneGeometry(W, H);
  const a = new THREE.Color(c1), b = new THREE.Color(c2);
  g.setAttribute("color", new THREE.BufferAttribute(new Float32Array([a.r, a.g, a.b, a.r, a.g, a.b, b.r, b.g, b.b, b.r, b.g, b.b]), 3));
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
}

// o celular: tamanho, onde fica e inclinação, por instante
function faseCelular(t) {
  if (t >= A.phone && t < A.laranja) {
    const u = clamp((t - A.phone) / 0.13);          // encolhe em 4 quadros, como em 6,733 s da referência
    const tilt = -3 * ramp(t, A.sabe, A.sabe + 0.25) * (1 - ramp(t, A.laranja - 0.3, A.laranja - 0.05));
    return { s: lerp(1.0, 0.54, easeOut(u)), rot: tilt, cx: W / 2, cy: H * (0.5 + 0.03 * easeOut(u)), laranja: false };
  }
  if (t >= A.laranja && t < A.capitao + 0.35) {
    if (t < A.capitao) return { s: lerp(0.5, 0.92, easeOut(clamp((t - A.laranja) / 0.1))), rot: 0, cx: W / 2, cy: H * 0.5, laranja: true };   // entra em 3 quadros
    return { s: lerp(0.92, 1.09, easeIO(clamp((t - A.capitao) / 0.35))), rot: 0, cx: W / 2, cy: H * 0.5, laranja: true };
  }
  return null;
}

export function criarCena(canvas, raiz) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1);
  r.setSize(W, H, false);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NeutralToneMapping;
  const cena = new THREE.Scene();
  cena.background = new THREE.Color(0xf5cfa3);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x9a8f80, 1.15);
  const sol = new THREE.DirectionalLight(0xfff0dc, 2.0);
  sol.position.set(-6, 12, 8);
  cena.add(hemi, sol);
  const FOG = new THREE.Fog(0x0b4a7d, 9, 60);
  const mundos = criarMundos(cena);
  const peixe = criarPeixe(0x3a6fb5), peixe2 = criarPeixe(0x8a6a45);
  cena.add(peixe, peixe2);
  const gente = {};
  for (const k of Object.keys(CFG)) { gente[k] = criarPessoa(CFG[k]); cena.add(gente[k].grupo); }

  // o celular (cena de dentro da cena): a imagem do mundo vai para um alvo e é colada numa tela com moldura
  const rt = new THREE.WebGLRenderTarget(540, 960);
  const ui = new THREE.Scene();
  const uiCam = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -10, 10);
  const rtPeq = new THREE.WebGLRenderTarget(54, 96);          // a cena em miniatura vira o fundo desfocado atrás do celular
  const bgCinza = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: rtPeq.texture, color: 0x6a6a6a, toneMapped: false })), bgLaranja = fundoGradiente(0xf0842f, 0xc9511b);
  bgCinza.position.z = -5; bgLaranja.position.z = -5;
  ui.add(bgCinza, bgLaranja);
  const celular = new THREE.Group();
  const moldura = new THREE.Mesh(new THREE.ShapeGeometry(formaArredondada(-PW / 2, -PH / 2, PW, PH, 96)), new THREE.MeshBasicMaterial({ color: 0x14161a, toneMapped: false }));
  const tela = new THREE.Mesh(new THREE.ShapeGeometry(formaArredondada(0, 0, 1, 1, 0.045)), new THREE.MeshBasicMaterial({ map: rt.texture, toneMapped: false }));
  tela.scale.set(SW, SHT, 1); tela.position.set(-SW / 2, -SHT / 2, 1);
  const entalhe = new THREE.Mesh(new THREE.ShapeGeometry(formaArredondada(-110, -22, 220, 44, 22)), new THREE.MeshBasicMaterial({ color: 0x14161a, toneMapped: false }));
  entalhe.position.set(0, SHT / 2 - 48, 2);
  celular.add(moldura, tela, entalhe);
  ui.add(celular);

  const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 400);
  const textos = criarTextos(raiz, W, H);
  const hud = criarHud(raiz);

  // ---- os elementos de tela (HUD) ----
  const eTimer = hud.mk("timer", "00:10"), ePausa = hud.mk("pausa", "<i style='left:58px'></i><i style='left:114px'></i>"), ePlay = hud.mk("play", "<i></i>");
  const ePilula = hud.mk("pilula", "0<small>anos de sumiço</small>");
  const eCam = hud.mk("icone", CAMERA), eXis = hud.mk("icone xis", "<b></b><b></b>");
  const eBarra = hud.mk("barra", ""); eBarra.style.cssText += ";height:10px;background:#ff2e63;border-radius:5px";
  const eCora = Array.from({ length: 12 }, () => hud.mk("cora", CORACAO));
  const eData = hud.mk("data", "22/12/1938"), eAnos = hud.mk("data", "1939");
  const eTaxon = hud.mk("cartao", "TÁXON<br>LÁZARO"), eFossil = hud.mk("chip", "FÓSSIL"), eVivo = hud.mk("chip", "VIVO");
  eFossil.style.background = "#6b6f76"; eVivo.style.background = "#2f9e5a";
  const VAL = [1200000, 9800000, 24500000, 39000000, 52300000, 61700000, 66000000];

  const ET = [
    { id: "azul", texto: "AZUL", t0: A.azul, ponto: Z("cais", 2, 2.6, 1.8) },
    { id: "manchas", texto: "MANCHAS BRANCAS", t0: A.manchas, ponto: Z("cais", 2, 2.15, 1.8) },
    { id: "empalhar", texto: "EMPALHAR", t0: A.empalhar, ponto: Z("oficina", 0, 3.6, 0.4) },
    { id: "celacanto", texto: "CELACANTO", t0: A.celacanto, ponto: Z("oficina", 0, 3.6, 0.4) },
    { id: "duvida", texto: "CÉTICOS", t0: A.jornais, ponto: Z("oficina", -1.5, 2.9, 2.6) },
    { id: "comores", texto: "COMORES · 1952", t0: A.comores, ponto: Z("comores", 1.2, 4.4, 1.9) },
    { id: "indo", texto: "INDONÉSIA · 1997", t0: A.indo, ponto: Z("mercado", 0, 0.7, 1.6) },
    { id: "esp1", texto: "ESPÉCIE 1", t0: A.era, ponto: Z("mercado", -1.25, 3.0, -2) },
    { id: "esp2", texto: "ESPÉCIE 2", t0: A.segunda, ponto: Z("mercado", 1.25, 3.0, -2) },
    { id: "curadora", texto: "MARJORIE COURTENAY-LATIMER", t0: A.curadora, ponto: Z("palco", 1.0, 3.4, 0) },
  ].map((e) => ({ ...e, t1: e.t0 + 2.4, ponto: new THREE.Vector3(...e.ponto) }));

  function legendaEm(t) {
    for (let i = 0; i < PALAVRAS.length; i++) {
      const p = PALAVRAS[i], fim = Math.min(PALAVRAS[i + 1]?.s ?? p.e + 0.6, p.e + 0.6);
      if (t >= p.s && t < fim) return { texto: p.w.replace(/[.,!?:;]+$/, ""), nome: PALAVRAS_AMARELAS.has(norm(p.w)), t0: p.s };
    }
    return null;
  }

  function colocarPeixe(pk, p, tw) {
    pk.visible = !!p;
    if (!p) return;
    pk.position.set(...p.pos);
    pk.rotation.set(0, p.rot ? p.rot[0] : 0, p.rot ? p.rot[1] : 0);
    pk.scale.setScalar(p.esc || 1);
    pk.userData.rabo.rotation.y = Math.sin(tw * (p.nada ? 5 : 9)) * (p.nada ? 0.3 : 0.5);
    if (p.nada) pk.position.y += Math.sin(tw * 2) * 0.12;
  }

  function quadro(t) {
    const tw = (t >= A.pausa && t < A.sabe) ? A.pausa : t;      // o "vídeo" do celular fica em pausa
    const si = shotDe(tw), s = SH[si], u = tw - s.t0, f = clamp(u / (s.t1 - s.t0));
    for (const [k, g] of Object.entries(mundos)) g.visible = k === s.env || (k === "mesa" && !!s.mesa);
    cena.background.set(s.bg);
    cena.fog = s.fog ? FOG : null;
    const lum = (t >= A.pausa && t < A.sabe) ? 1 - 0.45 * ramp(t, A.pausa, A.pausa + 0.7) : 1;   // a imagem escurece na pausa
    hemi.intensity = 1.15 * lum; sol.intensity = 2.0 * lum;
    cena.background.multiplyScalar(lum);
    if (s.env === "mar") animarMar(mundos.mar, tw);

    const c = camera(chaves, tw);
    cam.fov = c.fov; cam.position.set(...c.p); cam.lookAt(...c.l); cam.updateProjectionMatrix();

    const d = s.cena(u, f, tw, s);
    for (const g of Object.values(gente)) g.esconder();
    for (const [k, pos, pose, esc = 1, esp = false] of d.gente || []) gente[k].mostrar(pos, pose, cam.position, esc, esp);
    colocarPeixe(peixe, d.peixe, tw);
    colocarPeixe(peixe2, d.peixe2, tw);

    // o borrão de movimento logo depois do corte para o close (5 quadros), como na referência
    const bl = (t >= A.cut1 && t < A.cut1 + 0.17) ? 22 * (1 - (t - A.cut1) / 0.17) : 0;
    canvas.style.filter = bl > 0.4 ? `blur(${bl.toFixed(1)}px)` : "none";

    const ph = faseCelular(t);
    if (!ph) {
      r.setRenderTarget(null);
      r.render(cena, cam);
    } else {
      r.setRenderTarget(rtPeq);
      r.render(cena, cam);
      r.setRenderTarget(rt);
      r.render(cena, cam);
      r.setRenderTarget(null);
      bgCinza.visible = !ph.laranja; bgLaranja.visible = ph.laranja;
      celular.position.set(ph.cx - W / 2, H / 2 - ph.cy, 0);
      celular.scale.setScalar(ph.s);
      celular.rotation.z = (ph.rot * Math.PI) / 180;
      r.render(ui, uiCam);
    }
    const mapa = ph ? { cx: ph.cx, cy: ph.cy, w: SW, h: SHT, s: ph.s } : null;
    textos.desenhar(t, legendaEm(t), ET, cam, mapa);
    hudQuadro(t, tw, ph);
  }

  function hudQuadro(t, tw, ph) {
    const noCel = (rx, ry) => [ph.cx + rx * (SW / 2) * ph.s, ph.cy - ry * (SHT / 2) * ph.s];
    const sc = ph ? ph.s : 1;
    // o relógio de 10 segundos: no alto da imagem; no celular, dentro da tela
    if (tw >= A.tTimer && t < A.sabe && !(ph && ph.laranja)) {
      const n = Math.max(7, 10 - Math.floor((tw - A.tTimer) / 0.83));
      eTimer.textContent = "00:" + String(n).padStart(2, "0");
      if (ph) { const [x, y] = noCel(0, 0.82); hud.pos(eTimer, x, y, sc); } else hud.pos(eTimer, W / 2, H * 0.105, pop(t, A.tTimer, 0.08) || 1);
    } else hud.off(eTimer);
    // pausa
    if (t >= A.pausa && t < A.sabe) {
      const [x, y] = ph ? noCel(0, 0.08) : [W / 2, H * 0.55];
      hud.pos(ePausa, x, y, (pop(t, A.pausa, 0.3) || 0.01) * (ph ? sc * 0.9 : 1));
    } else hud.off(ePausa);
    if (t >= A.sabe && t < A.sabe + 0.5 && ph) {
      const [x, y] = noCel(0, 0.0);
      hud.pos(ePlay, x, y, sc * 0.9, 0, 1 - (t - A.sabe) / 0.5);
    } else hud.off(ePlay);
    // o contador de anos sumindo: 7 passos
    if (ph && !ph.laranja && t >= A.mi66 && t < A.laranja) {
      const i = Math.min(6, Math.floor(clamp((t - A.mi66) / (A.anos + 0.15 - A.mi66)) * 7));
      ePilula.firstChild.nodeValue = milhar(VAL[i]);
      hud.pos(ePilula, W / 2, ph.cy + (PH * ph.s) / 2 + H * 0.07, 1);
    } else hud.off(ePilula);
    // corações subindo do lado do celular
    eCora.forEach((e, i) => {
      const t0 = A.mi66 + i * 0.28, p = (((t - t0) % 3.4) + 3.4) % 3.4;
      if (ph && !ph.laranja && t >= t0 && t < A.laranja - 0.2 && p < 1.4) {
        const q = p / 1.4;
        hud.pos(e, ph.cx + (PW * ph.s) / 2 - 10 + h(i) * 70 + Math.sin(q * 6 + i) * 14, ph.cy + PH * ph.s * 0.12 - q * PH * ph.s * 0.45, (1.0 + 0.7 * h(i + 3)) * Math.max(0.7, ph.s * 1.6), 0, 1 - q * q);
      } else hud.off(e);
    });
    // a câmera de filmar e o X vermelho (ninguém viu nenhum)
    if (ph && !ph.laranja && t >= A.ninguem && t < A.viu) { const [x, y] = noCel(1.12, 0.45); hud.pos(eCam, x, y, pop(t, A.ninguem, 0.1) * 1.9); } else hud.off(eCam);
    if (ph && !ph.laranja && t >= A.viu && t < A.sabe + 0.2) { const [x, y] = noCel(1.12, 0.45); hud.pos(eXis, x, y, pop(t, A.viu, 0.1) * 1.9); } else hud.off(eXis);
    // a barra de progresso do vídeo do celular
    if (ph && t >= A.phone + 0.2) {
      const larg = SW * ph.s * (0.08 + 0.3 * clamp((t - A.phone) / (A.capitao - A.phone)));
      eBarra.style.width = larg + "px";
      hud.pos(eBarra, ph.cx - (SW * ph.s) / 2 + larg / 2 + 4, ph.cy + (SHT * ph.s) / 2 - 16 * ph.s, 1);
    } else hud.off(eBarra);
    // 22/12/1938 -> 16/02/1939
    if (t >= A.quase && t < A.olha) { eData.textContent = t < A.chega ? "22/12/1938" : "16/02/1939"; hud.pos(eData, W / 2, H * 0.31, pop(t, A.quase, 0.15) || 1); } else hud.off(eData);
    // 1939 -> 1952
    if (t >= A.proc && t < A.a1952) {
      eAnos.textContent = String(Math.round(lerp(1939, 1952, easeIO(clamp((t - A.proc) / (A.a1952 - 0.3 - A.proc))))));
      hud.pos(eAnos, W / 2, H * 0.8, pop(t, A.proc, 0.15) || 1);
    } else hud.off(eAnos);
    // táxon Lázaro: o grupo some do fóssil e volta vivo
    if (t >= A.taxon && t < A.proc) {
      hud.pos(eTaxon, W / 2, H * 0.34, pop(t, A.taxon, 0.2) || 0.01);
      if (t >= A.some) hud.pos(eFossil, W * 0.3, H * 0.48, pop(t, A.some, 0.15)); else hud.off(eFossil);
      if (t >= A.volta) hud.pos(eVivo, W * 0.7, H * 0.48, pop(t, A.volta, 0.15)); else hud.off(eVivo);
    } else { hud.off(eTaxon); hud.off(eFossil); hud.off(eVivo); }
  }
  return { quadro };
}
