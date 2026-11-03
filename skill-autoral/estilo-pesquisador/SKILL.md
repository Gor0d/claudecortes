---
name: estilo-pesquisador
description: >
  Faz um short animado em português do Brasil sobre ciência e curiosidades,
  no ritmo de um short de referência medido quadro a quadro: mundo em 3D,
  personagem pesquisador(a), legenda de uma palavra por vez, cortes nos
  segundos medidos. Use quando pedirem "um short desse estilo", "faz igual
  a esse reel" ou o próximo vídeo de uma série de ciência.
---

# Estilo pesquisador (skill autoral)

Versão própria, em português, do skill `estilo-palito`, com três mudanças:
1. **O personagem é um(a) pesquisador(a)** (`referencias/personagem.md`).
2. **O roteiro é de ciência, com fato conferido** e fontes guardadas à parte (`referencias/formula-roteiro.md`).
3. **As ferramentas rodam no Windows** (UTF-8 corrigido, transcrição sem o erro do PyAV).

As regras de ouro vêm do estilo-palito e valem aqui.

## Regras

1. **Número, nunca "ficou bonito".** Toda observação tem o segundo ou o quadro.
2. **Estude no fps real** (`ffprobe`: `r_frame_rate`). Se o vídeo tem 30, não estude em 60.
3. **Custo antes de gastar.** Antes de qualquer coisa paga (voz na ElevenLabs, por exemplo), diga os caracteres, o preço e **espere o ok**. A chave de API só fica no `.env` da pasta, nunca no chat.
4. **Não copie.** Da referência vêm a fórmula, o ritmo, a câmera e a forma da legenda. Frases, personagem, cenário, história, quadros e áudio são seus. Nada de personagem parecido com um personagem famoso (nada de bigode + boné vermelho).
5. **Fato conferido.** Pesquise antes de escrever e guarde as fontes em `fontes.md`, nunca na voz. O que for inventado (personagem, cena dramatizada) é dito como inventado.
6. **A referência manda**, não a régua do skill. Se a referência tem personagem 3D ou câmera parada, anote assim e siga. A régua só serve de comparação.
7. **Teste curto antes do vídeo todo**, e cada render tem versão nova (`v1`, `v2`...). Nunca sobrescreva.
8. **Abra as imagens você mesmo** (folhas de quadros, mapa, comparação).
9. **Um registro:** `registro.md` com uma linha por passo e o tempo gasto.
10. **Uma pasta por vídeo.** Nada de baixar coisa de terceiros dentro de uma pasta com scripts: cada download e cada zip em pasta própria.

## Antes de começar

Confira o computador e pergunte numa mensagem só: link e duração (comece com 15 s), assunto, voz (ElevenLabs pronta, clonada ou gravada) e personagem (proponha o seu).

Precisa: Python 3.10+, `pip install yt-dlp opencv-python numpy faster-whisper`, ffmpeg (`winget install Gyan.FFmpeg`), Node.js 22+. Cuidados no Windows:
- Chrome aberto trava `--cookies chrome`. Tente primeiro sem login.
- Se o `faster-whisper` fechar sozinho (segfault), use `pip install ctranslate2==4.5.0 "setuptools<81"`.
- Use sempre `python -I` e `PYTHONUTF8=1`. Depois de `winget`, abra um terminal novo para o ffmpeg entrar no PATH.

## Passo a passo

`$SKILL` é esta pasta. A pasta atual é a do vídeo.

### 1. Estudar (só com número)
1. `python -I $SKILL/ferramentas/baixar.py <link> --pasta referencia` e `ffprobe` para o fps real.
2. `transcrever.py referencia --saida transcricoes --lingua pt`: cada palavra com o tempo.
3. `camera.py referencia/<video>.mp4 --saida camera`. **Ela erra** em tela dentro de tela: confira com o passo 5.
4. `quadros.py <video> --por-segundo 6 --ate 15`, e a 30 por segundo em torno de cada corte.
5. Meça você mesmo a diferença média entre quadros vizinhos. Corte seco passa de ~50 (escala 0-255, imagem 135×240).
6. Meça a legenda: palavras por segundo, posição, cor, quando troca em relação à voz.
7. Meça o volume (`ffmpeg -af ebur128`) e onde há silêncio.
8. Escreva `estudo.md` com os cortes, a diferença por segundo, a câmera, como cada coisa entra, os textos, o roteiro com tempo e o som. Modelo pronto: `referencias/medidas-referencia-DfP0hbxNGhV.md`.

### 2. Roteiro
Siga `referencias/formula-roteiro.md`: tabela com o tempo, a frase da referência, a sua frase e a função. Confira fatos. Mostre a tabela e **espere o ok** antes de escrever `roteiro.txt`.

### 3. Personagem e cena
Proponha o personagem seguindo `referencias/personagem.md` e espere o ok antes de montar.

### 4. Montar
Igual ao estilo-palito: `voz.py --custo` (diga o custo e espere o ok), `montar.py`, troque o exemplo de `cena/js/cena.js` pelo mundo do vídeo, teste de 5 s, depois o render. Regras da cena em `referencias/render.md`, som em `referencias/som.md`, voz em `referencias/voz.md`.

### 5. Comparar e corrigir
`lado_a_lado.py`, `quadros.py` dos dois nos mesmos segundos, `conferir.py`. Diga o que está igual e o que está diferente, com o segundo. Um pedido por vez, uma versão nova a cada rodada.
