/**
 * Todos os números do site vivem aqui.
 *
 * Fontes:
 *  - Formulário: planilha "Respostas — Quiz Descarte de Medicamentos" (74 respostas,
 *    02/10/2026 a 25/11/2026), apurada em 27/11/2026.
 *  - Alcance: métricas dos stories do @descartesaudavel (infos-alcance.txt).
 *
 * Atenção ao `n` de cada pergunta: as 2 primeiras respostas (02/10) vieram de uma
 * versão anterior do formulário e não têm as 3 últimas perguntas — por isso n=72 lá.
 */

/** slot = identidade (mesma resposta, mesma cor em todo o site).
 *  tone = a cor significa certo/errado, e sempre vem acompanhada de rótulo. */
export type Slice = {
  label: string
  value: number
  slot?: 1 | 2 | 3
  tone?: 'correto' | 'incorreto' | 'neutro'
}

export const FORM_TOTAL = 74
export const APURADO_EM = '27 de novembro de 2026'
export const PERIODO = '2 de outubro a 25 de novembro de 2026'

export const INSTAGRAM_URL = 'https://www.instagram.com/descartesaudavel/'
export const MAPA_URL = 'https://ecomed.eco.br/mapa'

/* ---------------------------------------------------------------- alcance */

export const ALCANCE = {
  visualizacoes: 1889,
  interacoes: 69,
  visitasPerfil: 4,
  metaPessoas: 350,
  publicacoes: 13,
}

/** Visualizações por sequência de stories. Soma = 1.889. */
export const STORIES: { label: string; detalhe: string; value: number }[] = [
  { label: 'Vamos fazer uma limpa na farmacinha?', detalhe: 'story de maior alcance', value: 609 },
  { label: 'Link do questionário', detalhe: '3 stories — 310, 179 e 20', value: 509 },
  { label: 'Como fazer o descarte', detalhe: '6 stories', value: 269 },
  { label: 'Pontos de coleta em Itajaí', detalhe: '4 stories', value: 259 },
  { label: 'Infográfico da logística reversa', detalhe: '1 story', value: 130 },
  { label: 'Enquete e "Pode descartar?"', detalhe: '3 stories', value: 113 },
]

export const STORY_DESTAQUE = {
  pergunta: 'Você sabe onde tem um ponto de descarte?',
  interacoes: 18,
  visualizacoes: 71,
}

export const ENQUETE_VENCIDO: Slice[] = [
  { label: 'Não', value: 7, slot: 2 },
  { label: 'Sim', value: 3, slot: 1 },
]

/* ------------------------------------------------------- respostas por dia */

export const RESPOSTAS_POR_DIA: { dia: string; value: number }[] = [
  { dia: '02/10', value: 2 },
  { dia: '13/10', value: 1 },
  { dia: '14/10', value: 8 },
  { dia: '15/10', value: 29 },
  { dia: '16/10', value: 9 },
  { dia: '21/10', value: 8 },
  { dia: '22/10', value: 1 },
  { dia: '23/10', value: 5 },
  { dia: '24/10', value: 1 },
  { dia: '30/10', value: 1 },
  { dia: '12/11', value: 1 },
  { dia: '13/11', value: 7 },
  { dia: '25/11', value: 1 },
]

/* ------------------------------------------------------------ formulário */

export type Pergunta = {
  id: string
  titulo: string
  n: number
  slices: Slice[]
  destaque?: string
  nota?: string
}

/** Sim = slot 1, Não = slot 2, Não sei = slot 3 — a mesma resposta tem sempre a mesma cor. */
export const PERGUNTAS: Pergunta[] = [
  {
    id: 'p1',
    titulo: 'Possui medicamentos que não utiliza mais em casa?',
    n: 74,
    slices: [
      { label: 'Sim', value: 49, slot: 1 },
      { label: 'Não', value: 19, slot: 2 },
      { label: 'Não sei', value: 6, slot: 3 },
    ],
    destaque: '2 em cada 3 pessoas guardam medicamentos que não usam mais.',
  },
  {
    id: 'p2',
    titulo: 'Possui medicamentos vencidos em casa?',
    n: 74,
    slices: [
      { label: 'Sim', value: 26, slot: 1 },
      { label: 'Não', value: 30, slot: 2 },
      { label: 'Não sei', value: 18, slot: 3 },
    ],
    destaque: '18 pessoas não sabem dizer — sinal de farmacinha sem conferência.',
  },
  {
    id: 'p4',
    titulo: 'Sabia que não se deve descartar medicamento no lixo ou no esgoto?',
    n: 74,
    slices: [
      { label: 'Sim', value: 33, slot: 1 },
      { label: 'Não', value: 41, slot: 2 },
    ],
    destaque: 'A maioria desconhecia a orientação básica antes do questionário.',
  },
  {
    id: 'p5',
    titulo: 'Sabe o que é logística reversa?',
    n: 74,
    slices: [
      { label: 'Sim', value: 11, slot: 1 },
      { label: 'Não', value: 63, slot: 2 },
    ],
    destaque: 'O maior buraco de conhecimento: 85% nunca ouviram o termo.',
  },
  {
    id: 'p6',
    titulo: 'Sabe onde há um ponto de coleta próximo?',
    n: 74,
    slices: [
      { label: 'Sim', value: 16, slot: 1 },
      { label: 'Não', value: 41, slot: 2 },
      { label: 'Não sei', value: 17, slot: 3 },
    ],
    destaque: '78% não conseguem apontar um ponto de coleta perto de casa.',
  },
  {
    id: 'p7',
    titulo: 'Já entregou medicamento em um ponto de coleta?',
    n: 72,
    slices: [
      { label: 'Sim', value: 18, slot: 1 },
      { label: 'Não', value: 54, slot: 2 },
    ],
    destaque: '1 em cada 4 já fez a devolução ao menos uma vez.',
    nota: 'n = 72: as 2 primeiras respostas vieram de uma versão anterior do formulário.',
  },
]

export const DESCARTE: Pergunta = {
  id: 'p3',
  titulo: 'Como costuma descartar os medicamentos?',
  n: 74,
  slices: [
    { label: 'Lixo comum', value: 47, tone: 'incorreto' },
    { label: 'Farmácia ou ponto de coleta', value: 16, tone: 'correto' },
    { label: 'Guardo em casa', value: 6, tone: 'neutro' },
    { label: 'Outra forma', value: 3, tone: 'incorreto' },
    { label: 'Pia ou vaso sanitário', value: 2, tone: 'incorreto' },
  ],
  destaque: '64% jogam no lixo comum — o comportamento que o projeto precisa mudar.',
  nota: 'Uma das respostas em "Outra forma" foi literalmente "ateio fogo".',
}

export const ONDE_OUVIU: Pergunta = {
  id: 'onde-ouviu',
  titulo: 'Onde já ouviu falar sobre descarte correto de medicamentos?',
  n: 72,
  slices: [
    { label: 'Este é o meu primeiro contato', value: 42 },
    { label: 'Drogarias', value: 9 },
    { label: 'Redes sociais / WhatsApp', value: 8 },
    { label: 'Outro', value: 8 },
    { label: 'Unidade de Saúde', value: 5 },
  ],
  destaque: 'Para 58% dos participantes, o questionário foi o primeiro contato com o tema.',
}

export const CANAL: Pergunta = {
  id: 'canal',
  titulo: 'Por onde a pessoa chegou até o questionário',
  n: 72,
  slices: [
    { label: 'WhatsApp', value: 69, slot: 1 },
    { label: 'Instagram', value: 2, slot: 2 },
    { label: 'Outro', value: 1, slot: 3 },
  ],
  destaque: 'A rede pessoal levou quase todo mundo até o formulário.',
}

/* ----------------------------------------------------------------- metas */

export const METAS: {
  titulo: string
  meta: string
  status: string
  situacao: 'atingida' | 'parcial'
}[] = [
  {
    titulo: 'Alcançar no mínimo 350 pessoas',
    meta: 'meta: 350 pessoas',
    status: '1.889 visualizações de stories e 74 respostas registradas',
    situacao: 'atingida',
  },
  {
    titulo: 'Produzir ao menos dois materiais educativos',
    meta: 'meta: 2 materiais',
    status: '13 publicações no Instagram e 6 sequências de stories',
    situacao: 'atingida',
  },
  {
    titulo: 'Aplicar um questionário de conhecimentos e hábitos',
    meta: 'meta: 1 questionário',
    status: '74 respostas entre outubro e novembro de 2026',
    situacao: 'atingida',
  },
  {
    titulo: 'Mapear e divulgar pontos de recebimento da região',
    meta: 'meta: 20 estabelecimentos consultados',
    status: 'Divulgação feita em 4 stories e pelo mapa da EcoMed; o total consultado não está consolidado nesta base',
    situacao: 'parcial',
  },
]

export const ODS = [
  { numero: 3, titulo: 'Saúde e bem-estar', meta: 'Meta 3.9 — reduzir doenças por produtos químicos perigosos' },
  { numero: 6, titulo: 'Água potável e saneamento', meta: 'Meta 6.3 — reduzir o lançamento de produtos perigosos' },
  { numero: 12, titulo: 'Consumo e produção responsáveis', meta: 'Metas 12.4, 12.5 e 12.8 — manejo adequado de resíduos' },
  { numero: 15, titulo: 'Vida terrestre', meta: 'Metas 15.1 e 15.5 — proteger ecossistemas e habitats' },
]

export const ORIENTACOES = [
  'Não descarte medicamentos no lixo comum, na pia ou no vaso sanitário.',
  'Não reutilize, doe ou compartilhe medicamentos sem orientação profissional.',
  'Leve a um ponto fixo ou temporário de recebimento e siga as instruções do local.',
  'Mantenha fora do alcance de crianças, nas embalagens originais, até a devolução.',
  'A orientação vale para medicamentos domiciliares de uso humano.',
]
