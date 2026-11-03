# Registro (uma linha por passo)

| Passo | O que foi feito | Tempo aprox. |
|---|---|---|
| 1 | Conferido o computador: faltavam yt-dlp, ffmpeg, opencv, whisper. Instalados (grátis). | ~5 min |
| 2 | Baixado o reel de referência (sem login). fps real: 30. | 1 min |
| 3 | Estudo quadro a quadro dos 15 s: cortes, diferença por quadro, câmera, legenda, voz, som. Saída em `estudo.md`. | ~40 min |
| 4 | Problema: `faster-whisper` caía (segfault). Resolvido com `ctranslate2==4.5.0` e leitura do wav por numpy. | ~10 min |
| 5 | Leitura do zip de inspiração (transcrições, prompt 2.5D, plugin Toon Story Studio). | ~10 min |
| 6 | Criada a skill autoral `skill-autoral/estilo-pesquisador` (ferramentas corrigidas para Windows). | ~15 min |
| 7 | Fatos do celacanto conferidos na web; `fontes.md`, `roteiro-proposto.md`, `nicho-animais.md`. | ~15 min |
| 8 | Roteiro de 58 s aprovado e gravado em `roteiro.txt` (172 palavras). | ~10 min |
| 9 | Voz guia **local e gratuita** (Windows, Microsoft Maria) só para dar tempo às palavras. Não é a voz final. | ~5 min |
| 10 | Nova ferramenta `ajustar_palavras.py`: legenda sai igual ao roteiro (Whisper errava "Courtenay"). | ~5 min |
| 11 | Cena em Three.js: 21 planos, Lia e mais 8 personagens planos, 6 cenários, celular, HUD. Revisão por snapshots. | ~1 h |
| 12 | Teste de 6 s: renderizou em 77 s, sem quadro preto nem travamento. | 2 min |
| 13 | Render completo `renders/video-v1.mp4` (voz guia). | em andamento |

## Pendências
- Voz final: ElevenLabs pronta, ElevenLabs clonada ou gravada pelo usuário (ainda não escolhida). **Custo só depois do ok.**
- Frase do "diretor de museu": só uma fonte. Conferir ou cortar.
- Comparar lado a lado com a referência (primeiros 15 s) e corrigir cena por cena, uma versão por vez.
- Música e efeitos sonoros (ver `referencias/som.md`); os efeitos do original não foram medidos.
- Instalar a skill em `~/.claude/skills` quando o usuário pedir.
