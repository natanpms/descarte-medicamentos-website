# Descarte Consciente — site de resultados

Site estático com os resultados, o alcance e os dados do formulário do projeto de
extensão **"Descarte Consciente: educação e conscientização sobre o descarte correto
de medicamentos"** — Farmácia Comunitária UNIVALI, Itajaí/SC.

Instagram do projeto: [@descartesaudavel](https://www.instagram.com/descartesaudavel/)

## Rodar

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/
```

## Stack

React + TypeScript + Vite, Tailwind CSS v4, [motion](https://motion.dev) para as
animações. **Sem biblioteca de gráficos** — as barras são `motion.div` e o gráfico
de área é um SVG de ~80 linhas, o que deixa as animações e as cores sob controle
direto.

## Onde ficam os dados

Tudo em [`src/data.ts`](src/data.ts). Para atualizar os números do site, mexa só
nesse arquivo.

Fontes:

- **Formulário** — planilha *"Respostas — Quiz Descarte de Medicamentos"*, 74 respostas
  entre 02/10/2026 e 25/11/2026, apuradas em 27/11/2026.
- **Alcance** — métricas de stories do perfil `@descartesaudavel`.

⚠️ As 2 primeiras respostas (02/10) vieram de uma **versão anterior do formulário** e
não têm as 3 últimas perguntas. Por isso algumas perguntas têm `n = 72` e não `n = 74`
— o `n` aparece em cada gráfico.

⚠️ O cabeçalho da planilha está desalinhado das colunas a partir da coluna H: os
rótulos `P7/P8/P9` não correspondem às respostas gravadas ali. Os títulos usados no
site foram deduzidos dos valores das respostas (ex.: a coluna com WhatsApp/Instagram
é o canal de origem, não "já entregou em ponto de coleta"). **Vale conferir contra o
Google Forms original.**

## Cores dos gráficos

A paleta foi validada com o validador do skill `dataviz` (checagem de daltonismo e
contraste), em modo claro e escuro, no modo `--pairs all`:

| papel | claro | escuro |
|---|---|---|
| série 1 — Sim | `#008300` | `#008300` |
| série 2 — Não | `#2a78d6` | `#3987e5` |
| série 3 — Não sei | `#eda100` | `#c98500` |
| erro (descarte incorreto) | `#d03b3b` | `#e36b6b` |

Regras que o código segue e que convém manter ao editar:

- **A mesma resposta tem sempre a mesma cor** em todos os gráficos (Sim = verde,
  Não = azul, Não sei = amarelo), em qualquer pergunta.
- Vermelho/verde só aparecem onde a cor **significa** certo/errado, e sempre com
  ícone (`✓` / `✕`) e rótulo ao lado — nunca cor sozinha.
- Todo gráfico tem **rótulo de valor direto** e uma **tabela-gêmea** (“Ver tabela”),
  porque três das cores ficam abaixo de 3:1 de contraste na superfície clara.
- O par verde/amarelo fica na faixa de alerta de daltonismo no modo escuro — é por
  isso que os rótulos diretos e o espaçamento de 2px entre segmentos **não são
  opcionais**.

Para revalidar depois de mudar alguma cor:

```bash
node <skill>/scripts/validate_palette.js "#008300,#2a78d6,#eda100" --mode light --surface "#fbfcfb" --pairs all
```

## Acessibilidade

Tema claro/escuro (segue o sistema, com botão que sobrepõe), `prefers-reduced-motion`
respeitado nos contadores, barras com foco por teclado, e tabela textual em cada
gráfico.
