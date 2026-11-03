// Elementos de tela por cima da cena: contador, ícone de pausa, corações, cartões. Tudo é função do tempo.
export const h = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };   // "aleatório" fixo

const CSS = `
.hud { position:absolute; left:0; top:0; font-family:"Arial Black", Arial, sans-serif; font-weight:900; white-space:nowrap; pointer-events:none; display:none }
.timer { font-size:92px; color:#ff2a2a; background:#1b0b0b; border:10px solid #ff2a2a; border-radius:26px; padding:4px 34px; letter-spacing:3px }
.pausa { width:200px; height:200px; border-radius:50%; background:rgba(34,34,34,.82); display:none }
.pausa i { position:absolute; top:52px; width:28px; height:96px; background:#fff; border-radius:6px }
.play { width:200px; height:200px; border-radius:50%; background:rgba(34,34,34,.7); display:none }
.play i { position:absolute; left:70px; top:50px; border-left:84px solid #fff; border-top:50px solid transparent; border-bottom:50px solid transparent }
.pilula { font-size:74px; color:#101010; background:#fff; border-radius:80px; padding:14px 60px 10px; text-align:center; line-height:1.05 }
.pilula small { display:block; font-size:34px; color:#444; font-weight:700; letter-spacing:1px }
.icone { width:98px; height:98px; border-radius:50%; background:#fff; display:none }
.xis b { position:absolute; left:46px; top:12px; width:12px; height:74px; background:#e8232b; border-radius:6px; transform:rotate(45deg) }
.xis b + b { transform:rotate(-45deg) }
.cartao { font-size:82px; color:#ffe53b; -webkit-text-stroke:14px #1b1206; paint-order:stroke fill; text-align:center }
.chip { font-size:46px; color:#fff; border-radius:22px; padding:8px 28px 4px; -webkit-text-stroke:0; border:6px solid #111 }
.data { font-size:54px; color:#101010; background:#fff; border-radius:24px; padding:8px 30px 4px; border:7px solid #111 }
`;

export function criarHud(raiz) {
  const st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);
  const camada = document.createElement("div");
  camada.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:6";
  raiz.appendChild(camada);
  const mk = (cls, html = "") => {
    const d = document.createElement("div");
    d.className = "hud " + cls;
    d.innerHTML = html;
    camada.appendChild(d);
    return d;
  };
  const pos = (e, x, y, s = 1, giro = 0, op = 1) => {
    e.style.display = "block";
    e.style.opacity = op;
    e.style.transform = `translate(${x - e.offsetWidth / 2}px, ${y - e.offsetHeight / 2}px) rotate(${giro}deg) scale(${s})`;
  };
  const off = (e) => { e.style.display = "none"; };
  return { mk, pos, off };
}

export const CORACAO = `<svg viewBox="0 0 24 24" width="60" height="60"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.2 3 4.5 6.6 4.5c2 0 3.6 1.1 4.4 2.6.8-1.5 2.4-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.3C19.5 16.4 12 21 12 21z" fill="#ff2e63" stroke="#fff" stroke-width="1.2"/></svg>`;
export const CAMERA = `<svg viewBox="0 0 24 24" width="62" height="62" style="margin:18px"><rect x="2" y="7" width="13" height="10" rx="2" fill="#4b2d83"/><path d="M16 10l6-3v10l-6-3z" fill="#4b2d83"/></svg>`;
