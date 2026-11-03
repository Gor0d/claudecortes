# Estudo: reel DfP0hbxNGhV (primeiros 15 segundos)

Fonte: https://www.instagram.com/reel/DfP0hbxNGhV/ · baixado sem login · arquivo `referencia/DfP0hbxNGhV.mp4`.
Tudo abaixo foi medido no arquivo, quadro a quadro. Onde digo "olhando os quadros", conferi abrindo as imagens (`quadros/`).

## 0. Dados do arquivo

| Item | Valor |
|---|---|
| FPS real | **30** (`r_frame_rate` = `avg_frame_rate` = 30/1; o `yt-dlp -F` também lista só trilhas de 30 quadros) |
| Resolução | 1080 × 1920 (vertical 9:16), vídeo VP9, áudio AAC 44,1 kHz |
| Duração total | 60,3 s (1809 quadros). Estudados: os primeiros 15 s = **450 quadros** |
| Idioma do original | Português do Brasil (voz + legenda) |
| Volume (0-15 s) | **-14,1 LUFS** integrado, pico real -0,9 dBFS, LRA 3,3 LU |

Como estudar: 30 fps, então 1 quadro = 0,033 s. Estudar em 60 fps só repetiria quadros.

## 1. Os cortes (onde a imagem troca de uma vez)

Medida: diferença média de brilho entre quadros vizinhos (escala 0-255, imagem reduzida para 135×240). A imagem parada fica em 1-2; um corte seco passa de 50.

| # | Segundo | Quadro | Diferença | O que acontece (olhando os quadros) |
|---|---|---|---|---|
| 1 | **1,567** | 47 | 54,9 | Corte seco do plano aberto (personagem pequeno, cogumelo da bomba ao fundo) para **close no rosto** com borrão de movimento forte |
| 2 | **2,567** | 77 | 51,4 | Volta ao plano aberto do gramado (personagem pequeno, braços abertos) |
| 3 | **4,333** | 130 | 54,3 | Corte para a escada do bunker (plano vertical, personagem subindo) |
| 4 | **6,733** | 202 | 40,9 | A cena inteira vira **tela de celular**: moldura grande no quadro 6,733 que encolhe até ~0,5× em 4 quadros (6,733 → 6,867); fundo vira desfocado e escuro |
| 5 | **13,300** | 399 | 70,9 | Fundo laranja. Celular novo entra **pequeno e cresce** até quase a largura toda em 3 quadros (13,300 → 13,367) |
| 6 | **14,800** | 444 | 37,0 | Dentro do celular (que fica parado), corte do plano aberto do quintal para **close na escavadeira** com o personagem à direita |

- **6 cortes em 15 s** = 1 corte a cada 2,5 s (24 por minuto).
- Duração dos 7 planos: 1,57 · 1,00 · 1,77 · 2,40 · 6,57 · 1,50 · 0,23+ (continua depois de 15).
- O plano mais curto é o close de **1,00 s**; o mais longo é a tela do celular com **6,57 s**, mas ela não é parada (ver 3).
- **Troca suave (sem corte de câmera):** no segundo **11,833** o vídeo dentro do celular troca (do bunker para o quintal com a casa). Diferença 12,5 no quadro 355. A moldura do celular continua igual.
- **A ferramenta `camera.py` perdeu 3 cortes** (1,567, 6,733 e 13,300) porque tratou como zoom: foi aviso do próprio skill sobre tela dentro de tela. Os números acima são da medida quadro a quadro mais conferência visual.

## 2. Quanto a imagem muda de um quadro para o outro

450 quadros medidos (449 diferenças).

| Faixa | Quadros | Parte |
|---|---|---|
| Quase parado (diferença < 3) | 295 | **65,6 %** |
| Movimento (3 a 12) | 120 | 26,7 % |
| Forte (≥ 12): cortes e whip | 35 | 7,8 % |

Mediana 1,48 · percentil 90 = 9,15 · percentil 99 = 40,9.

Média por segundo (e pico):

| Segundo | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Média | 1,6 | **12,0** | 9,8 | 5,7 | 7,8 | 4,7 | 5,1 | 0,3 | 1,2 | 0,7 | 1,0 | 0,9 | 1,1 | 6,7 | 5,3 |
| Pico | 5,0 | 54,9 | 51,4 | 11,5 | 54,3 | 13,0 | 40,9 | 1,8 | 8,3 | 2,0 | 3,8 | 12,5 | 2,2 | 70,9 | 37,0 |

Leitura: o ritmo é de **duas ondas**. Segundos 1 a 6 (bomba, corrida, escada) e 13 a 15 (escavadeira) têm muita mudança. Segundos 7 a 12 (o celular com os números de visualizações) são quase parados: a mudança vem só de números, corações e ícones, não da câmera.

## 3. A câmera: onde anda e onde freia

Medida de zoom e deslocamento por quadro (`camera.py`) e conferida nos quadros a 30/s. O zoom automático fica ruidoso quando o personagem se mexe, então os números de zoom são aproximados.

| Trecho | O que a câmera faz | Quando começa e termina |
|---|---|---|
| 0,00 a 1,57 | Plano aberto, quase parada. Leve aproximação (≈ 1,07× no total) | movimento de 0,50 a 1,00 s |
| 1,567 a 2,567 | **Close com whip:** borrão de movimento nos 5 primeiros quadros (1,567 a 1,70). Depois **freia aos poucos**: o borrão some em ~1,80 e o enquadramento assenta até ~2,03; depois fica quase parada (1,18× no total, medida do `camera.py`) | 25 de 28 quadros em movimento |
| 2,567 a 4,333 | Acompanha o personagem correndo, de lado (deslize para a esquerda) | movimento de 2,77 a 4,30 |
| 4,333 a 6,733 | Plano vertical da escada, sobe devagar com o personagem | movimento de 4,67 a 5,63; depois parada |
| 6,733 a 13,300 | **Câmera 3D praticamente parada** (5 quadros em movimento de 196). Só a moldura do celular encolhe no começo | movimento 6,77 a 7,17 |
| 13,300 a 14,800 | Voo lento sobre o quintal com a escavadeira cavando (aproximação, vira para a esquerda) | movimento de 13,37 a 14,33 |
| 14,800 em diante | Close fixo na escavadeira | parada |

Regras tiradas da medida (valem como número de partida para a minha cópia):
- Cada movimento forte dura de **3 a 6 quadros** (0,10 a 0,20 s); o movimento mediano do vídeo todo é de 6 quadros. A freada do close de 1,567 é visível: o borrão some em 1,80 e o enquadramento estabiliza por volta de 2,03 (≈ 14 quadros depois do corte). Só medi essa freada; não generalizo para as outras.
- A câmera fica parada 72 % do tempo no vídeo todo (1809 quadros): **este reel não tem câmera sempre andando**, ao contrário da régua do skill. Aqui o que mantém o ritmo é a **troca de plano a cada 1 a 2,5 s** mais as animações dentro do quadro.
- Zoom para dentro de 1,15× no close e abertura repentina (0,51×) quando o celular aparece: esses são os dois únicos "empurrões" fortes dos 15 s.

## 4. Como cada coisa entra

| Segundo | Elemento | Como entra | Em quantos quadros |
|---|---|---|---|
| 1,00 a 1,50 | Cogumelo da bomba (3D, fundo) | Cresce no horizonte, laranja desfocado | ~15 (do segundo 0,33 ao 1,50) |
| 3,33 | Contador vermelho **00:10** | Aparece de uma vez, em cima (retângulo escuro com borda vermelha) | 1 |
| 3,33 a 6,67 | Contagem **10, 9, 8, 7** | Troca o número, sem animação | 1 quadro por troca |
| 6,00 a 6,50 | Ícone de pausa | Sobe do centro e cresce, com fundo escurecendo | ~15 |
| 6,73 | Celular | Moldura grande que encolhe | 4 |
| 8,33 a 9,17 | Contador **40.419 → 2.400.000** visualizações | Número subindo (40.419 · 324.442 · 791.989 · 1.338.188 · 1.858.170 · 2.247.064 · 2.400.000), cada valor ~5 quadros; para em 2.400.000 em 9,33 | 7 passos em ~1,0 s |
| 8,5 a 11,0 | Corações cor-de-rosa | Sobem pela direita do celular, vários por vez | contínuo |
| 10,50 | Ícone de câmera de filmar | Aparece num círculo branco ao lado do celular | 1 |
| 10,67 | **X vermelho** | Substitui a câmera e **fica** até 11,83 | 1 |
| 13,30 | Celular laranja | Cresce de ~0,55× a ~1,0× | 3 |
| 14,00 a 14,50 | Escavadeira e terra | Braço desce e a terra voa em partículas | animação contínua |

A peça entra **na palavra que fala dela ou 1 a 2 palavras antes**: o contador 40.419 → 2,4 milhões começa em 8,33 e a voz diz "2 milhões" em 8,24 a 8,92. O X vermelho entra em 10,67, na palavra "filmou" (10,70).

## 5. Texto na tela

**Legenda de palavra em palavra**
- Mostra **1 palavra por vez**, sempre. Nunca duas palavras juntas.
- **45 palavras em 15 s** (0,0 a 14,94) = 3,0 palavras por segundo; intervalo médio entre palavras 0,34 s (mín. 0,08 s, máx. 0,88 s); cada palavra fica na tela em média 0,29 s.
- A palavra troca **no quadro em que a voz começa** (conferido contra a transcrição, ±1 quadro).
- Posição: centrada na horizontal, a **19 % da altura** (≈ y 360 de 1920). Fica sempre no alto, acima do assunto.
- Estilo: fonte bold arredondada, **branca com contorno preto grosso**. Palavra-chave em **amarelo (aprox. #FFE53B)** com o mesmo contorno: *Bunker* (4,50 a 5,17 e 7,50), *Milhões* (8,50 a 8,92).
- Altura da letra ≈ 2,6 % da altura da tela; "Bunker" tem uns 225 px de largura (21 % da largura).
- Funciona sem som: sim, a legenda e os números contam a história sozinhos.

**Outros textos e símbolos**
- Contador de bomba **00:10 → 00:07**, vermelho num painel escuro (3,33 a 6,73): é o relógio do problema da história.
- Ícone de **pausa** (6,0 a 6,7): a voz diz "Pausa" em 5,90.
- Número de visualizações, dentro de uma pílula branca com "visualizações" embaixo (8,33 a 13,3).
- **X vermelho** de "ninguém filmou" (10,67).
- Moldura de celular com interface de rede social (corações, comentário, compartilhar, barra de progresso vermelha embaixo): marca o "vídeo dentro do vídeo".

## 6. Visual

- **3D estilizado** com cara de modelo plastificado (parecido com jogo): chão de grama verde com listras, árvores de cópia baixa, fundo de céu claro. **O personagem não é um palito 2D**: é um **boneco 3D** (chapéu de obra vermelho, bigode grande, colete laranja, macacão azul). Isto difere da régua do skill ("personagem plano"). A referência manda, então a minha cópia de estilo deve seguir o que está aqui.
- Cores: gramado verde saturado, céu pêssego (bomba), escada e bunker cinza-esverdeados, laranja forte no fundo do celular (13,3 em diante).
- Luz: sol alto e suave, sombras macias; desfoque de fundo (profundidade de campo) quando o celular aparece (6,7 a 13,3).
- Um cenário por assunto: gramado (0 a 4,3), bunker (4,3 a 6,7), quintal com casa e escavadeira (11,8 em diante).
- O personagem (Alex) aparece nos segundos 0 a 6,7 e de novo em 14,8. Entre 6,7 e 14,8 ele fica só como cena minúscula dentro do celular.

## 7. Roteiro e voz (transcrição com tempo de cada palavra)

Fórmula em 15 s: **notícia absurda → relógio correndo → "pausa" (quebra de ritmo) → o assunto real (os números do vídeo) → pergunta para o espectador → começa a história do gancho seguinte**.

| Segundo | Frase |
|---|---|
| 0,00 a 1,98 | "Uma bomba atômica acabou de explodir." |
| 2,12 a 4,72 | "E o Alex só tem 10 segundos para chegar no bunker." |
| 5,16 a 5,56 | "Calma." |
| 5,90 a 6,36 | "Pausa." |
| 6,70 a 9,86 | "Esse vídeo do bunker passou de 2 milhões de visualizações." |
| 10,04 a 11,46 | "E ninguém filmou nada." |
| 11,82 a 12,98 | "Você já viu esses vídeos?" |
| 13,24 a 14,48 | "Alguém cava um buraco," |
| 14,62 em diante | "a terra aparece por dentro e..." |

- Abre **na primeira palavra**, sem saudação: 0,00 s.
- Velocidade: **176 palavras por minuto** (45 palavras em 15 s).
- Pausas ≥ 0,15 s entre frases: 4,72 → 5,16 (0,44 s) · 5,56 → 5,90 (0,34) · 6,36 → 6,70 (0,34) · 9,86 → 10,04 (0,18) · 11,46 → 11,82 (0,36) · 12,98 → 13,24 (0,26).
- Duas frases de **uma palavra** ("Calma." e "Pausa.") em sequência: é a "piada" do trecho, e pega na hora em que o vídeo vira o celular.
- Pedido ao espectador: pergunta direta em 11,82 ("Você já viu...?").
- A transcrição foi feita com Whisper (large-v3-turbo, local, de graça). A legenda na tela bate com ela.

## 8. Som

- Voz de narração em tom firme e rápido (mais de 3 palavras por segundo).
- **Não há música contínua**: o único silêncio detectado (abaixo de -35 dB por ≥ 0,15 s) é de **11,53 a 12,05 s**, ou seja, a trilha só tem a voz mais efeitos; se tivesse música de fundo esse trecho não ficaria quase mudo.
- Volume final ≈ **-14,1 LUFS**, na faixa de vídeo de rede social (-14).
- Efeitos sonoros: não medi um por um. Peço para abrir o áudio com você nos segundos 1,5 (explosão), 6,7 (celular), 8,3 (contador) e 10,7 (X).

## 9. Resumo da régua para a minha cópia (15 s)

- 450 quadros a 30 fps, 1080 × 1920.
- Cortes nos segundos **1,57 · 2,57 · 4,33 · 6,73 · 13,30 · 14,80** (6 cortes) + troca suave do conteúdo do celular em **11,83**.
- Câmera: 65,6 % dos quadros quase parados; empurrões fortes de 3 a 6 quadros; whip com borrão nos 5 quadros após o corte de 1,57.
- Legenda: 1 palavra por vez, ≈ 3 palavras por segundo, branca com contorno preto, 19 % da altura, amarelo nas palavras-chave.
- Voz: ≈ 176 palavras por minuto, abre na palavra 1, 6 pausas curtas, uma quebra de uma palavra ("Calma." / "Pausa.").
- Volume final: -14 LUFS, sem música contínua.

## 10. O que ainda falta saber (não medi)

- Os efeitos sonoros um a um (precisa ouvir).
- Se a voz é gravada de pessoa ou sintética (parece sintética pelo ritmo, mas não medi).
- Os 45 s seguintes do reel: o plano é copiar só os 15 primeiros.

## 11. Observação de direitos

O visual da referência tem um personagem (chapéu vermelho, bigode grande, colete laranja) parecido com o de um encanador famoso de videogame. Da referência uso **a fórmula, o ritmo, a câmera e a forma de legenda**. O personagem, o cenário, as frases e a história da cópia serão novos (Taxon Lazarus), e não uso quadros nem áudio do original no vídeo final.
