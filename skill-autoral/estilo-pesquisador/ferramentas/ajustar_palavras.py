#!/usr/bin/env python3
"""Troca as palavras que o Whisper ouviu pelas palavras do roteiro aprovado, mantendo o tempo de cada uma.

O Whisper erra nomes ("Courtenay" vira "Kortenay") e a legenda é lida pelo público: ela tem que sair
igual ao roteiro. Alinha a transcrição ao roteiro (difflib) e copia o tempo.

Uso:
  python3 ajustar_palavras.py voz/voz.json roteiro.txt --saida voz/voz-ajustada.json

Escreve o json no mesmo formato do transcrever.py ({"texto", "palavras": [{"w","s","e"}]}) e diz o que trocou.
"""
import argparse, difflib, json, re, unicodedata
from pathlib import Path


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = re.sub(r"[̀-ͯ]", "", s)
    return re.sub(r"[^a-z0-9]", "", s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("transcricao")
    ap.add_argument("roteiro")
    ap.add_argument("--saida", default=None)
    a = ap.parse_args()
    ws = json.loads(Path(a.transcricao).read_text(encoding="utf-8"))["palavras"]
    alvo = Path(a.roteiro).read_text(encoding="utf-8").split()
    nw = [norm(w["w"]) for w in ws]
    na = [norm(w) for w in alvo]
    out, trocas = [None] * len(alvo), []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, nw, na, autojunk=False).get_opcodes():
        for k in range(j1, j2):
            if op == "equal":
                src = ws[i1 + (k - j1)]
                out[k] = {"w": alvo[k], "s": src["s"], "e": src["e"]}
            elif i2 > i1:                                  # troca ou sobra: reparte o tempo das palavras ouvidas
                n_i, n_j = i2 - i1, j2 - j1
                s0, e0 = ws[i1]["s"], ws[i2 - 1]["e"]
                s = s0 + (e0 - s0) * (k - j1) / n_j
                e = s0 + (e0 - s0) * (k - j1 + 1) / n_j
                out[k] = {"w": alvo[k], "s": round(s, 3), "e": round(e, 3)}
                if n_i == n_j: trocas.append((ws[i1 + (k - j1)]["w"], alvo[k]))
            else:                                          # palavra do roteiro que o Whisper não ouviu
                prev = out[k - 1]["e"] if k and out[k - 1] else (ws[i1 - 1]["e"] if i1 else 0)
                out[k] = {"w": alvo[k], "s": prev, "e": round(prev + 0.15, 3)}
                trocas.append(("(não ouvida)", alvo[k]))
    for w in out:
        w["s"], w["e"] = round(w["s"], 3), round(w["e"], 3)
    saida = Path(a.saida or a.transcricao)
    saida.write_text(json.dumps({"texto": " ".join(alvo), "palavras": out}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(alvo)} palavras do roteiro, {len(ws)} ouvidas; {len(trocas)} ajustadas")
    for ouvida, certa in trocas:
        print(f"  {ouvida!r} -> {certa!r}")


main()
