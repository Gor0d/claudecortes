# Comparação com a referência (primeiros 15 s)

Referência: `referencia/DfP0hbxNGhV.mp4`. Meu: `renders/video-v1.mp4` (voz guia). Folha lado a lado: `quadros/comparacao-v1.png`. Vídeo lado a lado: `renders/lado-a-lado-v1.mp4`.

## Cortes: referência × v1 (voz guia)

| Evento | Referência | v1 | Diferença |
|---|---|---|---|
| Corte para o close (borrão) | 1,567 s | 1,23 s | 0,34 s antes |
| Volta ao plano aberto | 2,567 s | 2,60 s | igual (0,03 s) |
| Corte para a escada | 4,333 s | 4,03 s | 0,30 s antes |
| Celular entra e encolhe | 6,733 s | ~7,3 s (palavra "cientistas") | ~0,6 s depois |
| Fundo laranja | 13,300 s | 13,77 s | 0,47 s depois |
| Close dentro do celular | 14,800 s | 15,50 s | 0,70 s depois |

**Causa:** os cortes seguem as palavras, e a voz guia do Windows tem um ritmo diferente do reel. Não é erro de montagem. Com a voz final, o objetivo é cada palavra-âncora cair a menos de 0,1 s da referência: "Lia" em 2,56 s, "chegar" em ~4,1 s, "Pausa" em 5,90 s, "cientistas" em ~6,70 s, "Você/Sabe" em 11,82 s, "1938" em ~13,25 s.

## O que está igual
- Corte seco para o close com borrão de movimento (5 quadros) e volta ao plano aberto.
- Relógio vermelho 00:10 → 00:07, decrescendo a cada 0,83 s.
- Ícone de pausa, a cena vira tela de celular que encolhe em ~4 quadros.
- Contador de números subindo em 7 passos, corações subindo, X vermelho sobre ícone de câmera.
- Celular laranja que entra pequeno e cresce em 3 quadros.
- Legenda de uma palavra por vez, amarela nas palavras-chave, a 19 % da altura.

## O que era diferente e foi corrigido na v2
| Segundo | Diferença | Correção |
|---|---|---|
| 0,5 a 1,5 | Personagem pequena no plano aberto (12 % da altura; a referência tem ~30 %) | Câmera mais perto (distância 25 → 14) |
| 1,4 a 2,5 | Sobrancelhas de espanto saíam em "V" e pareciam bravas | Sobrancelhas altas e inclinadas para cima |
| 6,9 a 13,3 | Fundo do celular era um degradê liso; na referência é a própria cena, desfocada e escura | Fundo = a cena em miniatura (54×96) escurecida |
| 3,3 a 6,7 | Relógio pequeno | Fonte maior (64 → 92 px) |
| 8,3 a 13,3 | Pílula do contador pequena | Fonte e margens maiores |
| 8,5 a 11,5 | Corações e ícone de câmera/X pequenos | Corações ~1,6× e ícones ~1,9× maiores |
| todos | Legenda grande demais | 74 → 62 px |

## O que ainda é diferente (de propósito ou pendente)
- **Estilo:** a referência é um boneco 3D com textura e luz realista; o meu é personagem plano (a pesquisadora Lia) em mundo 3D de cores chapadas. Foi uma escolha sua (personagem de pesquisa) e do material do zip.
- **Efeito de profundidade:** a referência desfoca o fundo nos planos do personagem; o meu não (só no fundo do celular).
- **Pílula:** a referência tem um ícone de olho e a palavra "visualizações"; a minha mostra "anos de sumiço" (o assunto é outro).
- **Som:** não medi nem recriei os efeitos sonoros do original.
- **Câmera durante 7 a 13 s:** parada como na referência, mas o meu celular só treme de leve; a referência inclina o celular entre 11,8 e 13,2 s (já inclinado -3°).

## Próximo pedido
Refazer a voz final e conferir se as palavras-âncora caem nos segundos da referência (tabela acima). Depois, nova comparação (v3).
