// Os textos por cima da cena: a legenda (uma palavra por vez) e as etiquetas com o nome das coisas.
// Medido na referência: 1 palavra por vez, branca com contorno preto, a 19% da altura, amarela nas palavras-chave.
// As etiquetas seguem o objeto na tela: o ponto 3D é projetado na imagem a cada quadro.
import * as THREE from "three";
import { clamp, pop } from "./kit.js";

const CSS = `
.leg { position:absolute; left:0; top:0; font-family:"Arial Black", Arial, sans-serif; font-weight:900; font-size:62px; color:#fff;
  -webkit-text-stroke:13px #0c0c0e; paint-order:stroke fill; white-space:nowrap; pointer-events:none }
.leg.nome { color:#ffe53b }
.etq { position:absolute; left:0; top:0; font-family:"Arial Black", Arial, sans-serif; font-weight:900; font-size:46px; color:#ffe53b;
  -webkit-text-stroke:10px #1b1206; paint-order:stroke fill; white-space:nowrap; pointer-events:none }
`;

export function criarTextos(raiz, W, H) {
  const st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);
  const camada = document.createElement("div");
  camada.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:5";
  raiz.appendChild(camada);
  const els = new Map(), v = new THREE.Vector3();
  const el = (id, cls) => {
    if (!els.has(id)) {
      const d = document.createElement("div");
      d.className = cls;
      camada.appendChild(d);
      els.set(id, d);
    }
    return els.get(id);
  };
  const por = (e, x, y, s = 1, giro = 0) => {
    e.style.display = "";
    e.style.transform = `translate(${x - e.offsetWidth / 2}px, ${y - e.offsetHeight / 2}px) rotate(${giro}deg) scale(${s})`;
  };
  // legenda: {texto, nome, t0}; etiquetas: [{id, texto, t0, t1, ponto: Vector3}]
  // tela: null (imagem inteira) ou {cx, cy, w, h, s}: o retângulo da tela do celular, onde a cena aparece
  function desenhar(t, legenda, etiquetas, cam, tela = null) {
    const vistos = new Set();
    if (legenda) {
      const e = el("leg", "leg");
      e.className = "leg" + (legenda.nome ? " nome" : "");
      e.textContent = legenda.texto;
      por(e, W / 2, H * 0.19, 1 + 0.08 * (1 - clamp((t - legenda.t0) / 0.1)));
      vistos.add("leg");
    }
    for (const q of etiquetas) {
      if (t < q.t0 || t >= q.t1) continue;
      const e = el(q.id, "etq");
      e.textContent = q.texto;
      v.copy(q.ponto).project(cam);
      let x = (v.x * 0.5 + 0.5) * W, y = (0.5 - v.y * 0.5) * H, esc = 1;
      if (tela) {
        x = tela.cx + v.x * 0.5 * tela.w * tela.s;
        y = tela.cy - v.y * 0.5 * tela.h * tela.s;
        esc = Math.max(0.5, tela.s);
      }
      // aparece em 3 quadros (0,1 s), como na referência
      por(e, x, y, pop(t, q.t0, 0.1) * esc, -3);
      const meia = (e.offsetWidth * esc) / 2 + 28;     // nunca sai da imagem
      if (x < meia || x > W - meia) por(e, clamp(x, meia, W - meia), y, pop(t, q.t0, 0.1) * esc, -3);
      vistos.add(q.id);
    }
    for (const [id, e] of els) if (!vistos.has(id)) e.style.display = "none";
  }
  return { desenhar };
}
