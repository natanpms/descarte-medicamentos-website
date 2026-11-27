import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import {
  HiArrowRight,
  HiArrowUpRight,
  HiBars3,
  HiCheck,
  HiExclamationTriangle,
  HiOutlineMoon,
  HiOutlineSun,
  HiXMark,
} from 'react-icons/hi2'
import { LuRecycle } from 'react-icons/lu'
import { FaInstagram } from 'react-icons/fa6'
import {
  ALCANCE,
  APURADO_EM,
  CANAL,
  DESCARTE,
  ENQUETE_VENCIDO,
  FORM_TOTAL,
  INSTAGRAM_URL,
  MAPA_URL,
  METAS,
  ODS,
  ONDE_OUVIU,
  ORIENTACOES,
  PERGUNTAS,
  PERIODO,
  RESPOSTAS_POR_DIA,
  STORIES,
  STORY_DESTAQUE,
} from './data'
import { AreaChart, BarList, Card, Counter, GrowBar, Reveal, StackedBar, StatTile, pct } from './components/charts'

const SECOES = [
  { id: 'alcance', label: 'Alcance' },
  { id: 'formulario', label: 'Formulário' },
  { id: 'respostas', label: 'Respostas' },
  { id: 'metas', label: 'Metas' },
  { id: 'orientacoes', label: 'Como descartar' },
]

/* --------------------------------------------------------------- chrome */

function ThemeToggle() {
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('tema') === 'dark' ||
      (!localStorage.getItem('tema') && matchMedia('(prefers-color-scheme: dark)').matches),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('tema', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="grid size-10 place-items-center rounded-full border transition-colors"
      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
    >
      <motion.span
        key={String(dark)}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        className="grid place-items-center"
      >
        {dark ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
      </motion.span>
    </button>
  )
}

/** Hambúrguer ⇄ X. Os dois ícones trocam com rotação, um de cada vez. */
function MenuButton({ aberto, onClick }: { aberto: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={aberto}
      className="relative grid size-10 place-items-center rounded-full border md:hidden"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={aberto ? 'x' : 'menu'}
          initial={{ rotate: aberto ? -90 : 90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: aberto ? 90 : -90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {aberto ? <HiXMark size={21} /> : <HiBars3 size={21} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

function MobileNav({ aberto, fechar }: { aberto: boolean; fechar: () => void }) {
  // trava o scroll do fundo enquanto o painel está aberto
  useEffect(() => {
    if (!aberto) return
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = anterior
      removeEventListener('keydown', onKey)
    }
  }, [aberto, fechar])

  // fecha primeiro, rola depois: com o scroll travado o salto por hash não acontece
  const irPara = (id: string) => {
    fechar()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', `#${id}`)
    }, 260)
  }

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          key="painel"
          /* z-10 < z-20 da barra: o painel cobre a página, mas nunca o botão X */
          className="fixed inset-0 z-10 flex flex-col md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: 'var(--surface-2)' }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-20 size-80 rounded-full blur-3xl"
            style={{ background: 'var(--series-1)', opacity: 0.14 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          <nav className="relative mt-24 flex-1 px-5">
            <ul>
              {SECOES.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.45, delay: 0.06 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b"
                  style={{ borderColor: 'var(--grid)' }}
                >
                  <button
                    type="button"
                    onClick={() => irPara(s.id)}
                    className="flex w-full items-center gap-4 py-5 text-left active:opacity-60"
                  >
                    <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      0{i + 1}
                    </span>
                    <span className="text-2xl font-semibold tracking-tight">{s.label}</span>
                    <HiArrowRight size={18} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="relative px-5 pb-10 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ delay: 0.36, duration: 0.4 }}
            style={{ color: 'var(--text-secondary)' }}
          >
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium active:opacity-60"
              style={{ borderColor: 'var(--border)' }}
            >
              <FaInstagram size={16} /> @descartesaudavel
              <HiArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
            </a>
            <p className="mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>
              Projeto Comunitário de Extensão Universitária · UNIVALI · Itajaí/SC
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Header() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-[70]">
      {/* z-20: a barra fica acima do painel para o X continuar clicável */}
      <div
        className="relative z-20 transition-colors duration-300"
        style={{
          background: solid && !menu ? 'color-mix(in srgb, var(--surface-2) 82%, transparent)' : 'transparent',
          backdropFilter: solid && !menu ? 'blur(12px)' : 'none',
          borderBottom: `1px solid ${solid && !menu ? 'var(--border)' : 'transparent'}`,
        }}
      >
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
          <a href="#topo" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg" style={{ background: 'var(--series-1)', color: '#fff' }}>
              <LuRecycle size={15} />
            </span>
            Descarte Consciente
          </a>
          <ul className="ml-auto hidden items-center gap-5 text-sm md:flex">
            {SECOES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="transition-opacity hover:opacity-60" style={{ color: 'var(--text-secondary)' }}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <ThemeToggle />
            <MenuButton aberto={menu} onClick={() => setMenu((m) => !m)} />
          </div>
        </nav>
      </div>
      <motion.div
        className="h-[2px] origin-left"
        style={{ scaleX, background: 'var(--series-1)', opacity: menu ? 0 : 1 }}
      />
      <MobileNav aberto={menu} fechar={() => setMenu(false)} />
    </header>
  )
}

function Section({
  id,
  eyebrow,
  titulo,
  resumo,
  children,
}: {
  id: string
  eyebrow: string
  titulo: string
  resumo?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t py-20 sm:py-28" style={{ borderColor: 'var(--grid)' }}>
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--series-1)' }}>
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{titulo}</h2>
          {resumo && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {resumo}
            </p>
          )}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}

/** Faixa de leitura do gráfico — a frase que o número conta. */
function Destaque({ children, nota }: { children: ReactNode; nota?: string }) {
  return (
    <div className="mt-6 border-l-2 pl-4" style={{ borderColor: 'var(--series-1)' }}>
      <p className="text-sm leading-relaxed font-medium">{children}</p>
      {nota && (
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          {nota}
        </p>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------- hero */

function Hero() {
  // O hero não reage ao scroll de propósito: o fade/parallax apagava os três números
  // do rodapé antes de dar tempo de lê-los — ainda mais no celular, onde o hero tem
  // ~975px numa tela de ~850px. As animações daqui acontecem só na entrada.

  return (
    <section id="topo" className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* manchas de fundo, puramente decorativas */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full blur-3xl"
        style={{ background: 'var(--series-1)', opacity: 0.1 }}
        animate={{ scale: [1, 1.12, 1], x: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -left-32 size-[28rem] rounded-full blur-3xl"
        style={{ background: 'var(--series-2)', opacity: 0.08 }}
        animate={{ scale: [1, 1.18, 1], y: [0, 24, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: 'var(--series-1)' }} />
            <span className="relative inline-flex size-1.5 rounded-full" style={{ background: 'var(--series-1)' }} />
          </span>
          Projeto de extensão universitária · UNIVALI · Itajaí/SC
        </motion.div>

        <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
          {['Descarte', 'consciente', 'de medicamentos.'].map((palavra, i) => (
            <motion.span
              key={palavra}
              className="mr-3 inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={i === 2 ? { color: 'var(--series-1)' } : undefined}
            >
              {palavra}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-7 max-w-2xl text-lg leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          O que a comunidade de Itajaí respondeu sobre a farmacinha de casa, e até onde a campanha
          chegou. {FORM_TOTAL} respostas e {ALCANCE.visualizacoes.toLocaleString('pt-BR')} visualizações
          entre {PERIODO}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <a
            href="#alcance"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            style={{ background: 'var(--series-1)' }}
          >
            Ver os resultados
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--border)' }}
          >
            <FaInstagram size={16} /> @descartesaudavel
          </a>
        </motion.div>

        {/* três números que resumem a página */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.78 }}
          className="mt-16 grid gap-8 border-t pt-8 sm:grid-cols-3"
          style={{ borderColor: 'var(--grid)' }}
        >
          {[
            { v: ALCANCE.visualizacoes, l: 'visualizações de stories' },
            { v: FORM_TOTAL, l: 'respostas no questionário' },
            { v: pct(47, FORM_TOTAL), l: 'descartam no lixo comum', sufixo: '%' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="text-3xl font-semibold tracking-tight sm:text-4xl">
                <Counter to={s.v} />
                {s.sufixo}
              </dt>
              <dd className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {s.l}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ app */

export default function App() {
  const metaPct = Math.round((ALCANCE.visualizacoes / ALCANCE.metaPessoas) * 100)

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* ---------------------------------------------------------- alcance */}
        <Section
          id="alcance"
          eyebrow="Alcance"
          titulo="Até onde a campanha chegou"
          resumo="Métricas dos stories do perfil @descartesaudavel. O total soma as visualizações de cada story — quem viu vários é contado mais de uma vez, então o número de contas únicas é menor."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile value={ALCANCE.visualizacoes} label="Visualizações de stories" nota="soma de todos os stories" />
            <StatTile value={ALCANCE.interacoes} label="Interações" nota="respostas, votos e toques" accent="var(--series-2)" />
            <StatTile value={ALCANCE.publicacoes} label="Publicações no feed" nota="materiais educativos" accent="var(--series-3)" />
            <StatTile value={ALCANCE.visitasPerfil} label="Visitas ao perfil" accent="var(--text-muted)" />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <Card>
                <h3 className="text-lg font-semibold tracking-tight">Visualizações por sequência de stories</h3>
                <p className="mt-1.5 mb-7 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  O conteúdo leve puxou o alcance; o conteúdo útil segurou a atenção.
                </p>
                <BarList
                  items={STORIES.map((s) => ({ label: s.label, value: s.value }))}
                  total={ALCANCE.visualizacoes}
                  unidade="views"
                />
                <Destaque>
                  “Vamos fazer uma limpa na farmacinha?” sozinho fez {pct(609, ALCANCE.visualizacoes)}% de todo o alcance.
                </Destaque>
              </Card>
            </Reveal>

            <div className="grid gap-5 content-start">
              <Reveal delay={0.1}>
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Story com mais interações
                  </p>
                  <p className="mt-3 text-base font-medium leading-snug">“{STORY_DESTAQUE.pergunta}”</p>
                  <p className="mt-5 text-4xl font-semibold tracking-tight">
                    <Counter to={STORY_DESTAQUE.interacoes} />
                    <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>
                      {' '}
                      de {STORY_DESTAQUE.visualizacoes} views
                    </span>
                  </p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {pct(STORY_DESTAQUE.interacoes, STORY_DESTAQUE.visualizacoes)}% de quem viu respondeu — a dúvida sobre
                    onde descartar é o que move a conversa.
                  </p>
                </Card>
              </Reveal>

              <Reveal delay={0.18}>
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Enquete nos stories
                  </p>
                  <p className="mt-3 mb-6 text-base font-medium leading-snug">
                    “Você tem remédio vencido em casa?”
                  </p>
                  <StackedBar
                    pergunta={{ id: 'enquete', titulo: 'Você tem remédio vencido em casa?', n: 10, slices: ENQUETE_VENCIDO }}
                  />
                </Card>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1}>
            <Card className="mt-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Meta de alcance do projeto</h3>
                  <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    A meta era alcançar no mínimo {ALCANCE.metaPessoas} pessoas, 50 por integrante do grupo.
                  </p>
                </div>
                <p className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--series-1)' }}>
                  <Counter to={metaPct} />%
                </p>
              </div>
              <div className="mt-6">
                <GrowBar fraction={1} />
              </div>
              <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                {ALCANCE.visualizacoes.toLocaleString('pt-BR')} visualizações contra uma meta de {ALCANCE.metaPessoas}{' '}
                pessoas. Como uma mesma pessoa pode ver vários stories, o número de pessoas distintas é menor que o de
                visualizações.
              </p>
            </Card>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------- formulário */}
        <Section
          id="formulario"
          eyebrow="Formulário"
          titulo="O questionário aplicado à comunidade"
          resumo={`${FORM_TOTAL} respostas coletadas entre ${PERIODO}, apuradas em ${APURADO_EM}. O formulário mediu hábito de descarte, conhecimento sobre logística reversa e acesso a pontos de coleta.`}
        >
          <Reveal>
            <Card>
              <h3 className="text-lg font-semibold tracking-tight">Respostas por dia</h3>
              <p className="mt-1.5 mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Cada divulgação gerou um pico. O maior deles veio da sequência de stories com o link do questionário.
              </p>
              <AreaChart dados={RESPOSTAS_POR_DIA} />
              <Destaque>
                29 das {FORM_TOTAL} respostas chegaram em 15/10 — divulgação concentrada rende mais que divulgação
                espalhada.
              </Destaque>
            </Card>
          </Reveal>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <Card>
                <h3 className="text-lg font-semibold tracking-tight">{DESCARTE.titulo}</h3>
                <p className="mt-1.5 mb-7 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  n = {DESCARTE.n} respostas
                </p>
                <BarList items={DESCARTE.slices} total={DESCARTE.n} showTone />
                <Destaque nota={DESCARTE.nota}>{DESCARTE.destaque}</Destaque>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card>
                <h3 className="text-lg font-semibold tracking-tight">{ONDE_OUVIU.titulo}</h3>
                <p className="mt-1.5 mb-7 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  n = {ONDE_OUVIU.n} respostas
                </p>
                <BarList items={ONDE_OUVIU.slices} total={ONDE_OUVIU.n} />
                <Destaque>{ONDE_OUVIU.destaque}</Destaque>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Card className="mt-5">
              <h3 className="text-lg font-semibold tracking-tight">{CANAL.titulo}</h3>
              <p className="mt-1.5 mb-7 text-sm" style={{ color: 'var(--text-secondary)' }}>
                n = {CANAL.n} respostas
              </p>
              <StackedBar pergunta={CANAL} />
              <Destaque nota="O Instagram entregou alcance (1.889 visualizações); o WhatsApp entregou conversão (69 respostas).">
                {CANAL.destaque}
              </Destaque>
            </Card>
          </Reveal>
        </Section>

        {/* --------------------------------------------------------- respostas */}
        <Section
          id="respostas"
          eyebrow="Respostas"
          titulo="O que as pessoas sabem — e o que não sabem"
          resumo="Cada barra é uma pergunta do questionário. A mesma resposta tem sempre a mesma cor em todos os gráficos: verde para Sim, azul para Não, amarelo para Não sei."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {PERGUNTAS.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 0.08}>
                <Card className="h-full">
                  <h3 className="text-base font-semibold leading-snug tracking-tight sm:text-lg">{p.titulo}</h3>
                  <p className="mt-1.5 mb-7 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    n = {p.n} respostas
                  </p>
                  <StackedBar pergunta={p} />
                  {p.destaque && <Destaque nota={p.nota}>{p.destaque}</Destaque>}
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------- metas */}
        <Section
          id="metas"
          eyebrow="Metas e ODS"
          titulo="O que o projeto se propôs a fazer"
          resumo="Metas definidas no plano do projeto de extensão, conferidas contra os dados desta página."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {METAS.map((m, i) => (
              <Reveal key={m.titulo} delay={(i % 2) * 0.08}>
                <Card className="h-full">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white"
                      style={{ background: m.situacao === 'atingida' ? 'var(--series-1)' : 'var(--series-3)' }}
                    >
                      {m.situacao === 'atingida' ? <HiCheck size={14} /> : <HiExclamationTriangle size={13} />}
                    </span>
                    <div>
                      <h3 className="font-semibold leading-snug tracking-tight">{m.titulo}</h3>
                      <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        {m.meta} ·{' '}
                        <span style={{ color: m.situacao === 'atingida' ? 'var(--series-1)' : 'var(--series-3)' }}>
                          {m.situacao === 'atingida' ? 'atingida' : 'parcial'}
                        </span>
                      </p>
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {m.status}
                      </p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
                Objetivos de Desenvolvimento Sustentável
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {ODS.map((o, i) => (
                  <Reveal key={o.numero} delay={i * 0.07}>
                    <Card className="h-full">
                      <p className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--series-1)' }}>
                        {o.numero}
                      </p>
                      <p className="mt-2 font-medium leading-snug">{o.titulo}</p>
                      <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {o.meta}
                      </p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------- orientações */}
        <Section
          id="orientacoes"
          eyebrow="Como descartar"
          titulo="O que fazer com a farmacinha de casa"
          resumo="As orientações que o projeto levou à comunidade, baseadas na Lei nº 12.305/2010 e no Decreto nº 10.388/2020."
        >
          <ol className="grid gap-4">
            {ORIENTACOES.map((o, i) => (
              <Reveal key={o} delay={i * 0.06}>
                <li className="flex items-start gap-4 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums"
                    style={{ background: 'color-mix(in srgb, var(--series-1) 14%, transparent)', color: 'var(--series-1)' }}
                  >
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{o}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <Card className="mt-6">
              <h3 className="text-lg font-semibold tracking-tight">Onde entregar em Itajaí</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Farmácias e drogarias com ponto de recebimento, unidades de saúde e a Farmácia Comunitária UNIVALI. O
                mapa da EcoMed lista os pontos ativos mais próximos.
              </p>
              <a
                href={MAPA_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
                style={{ background: 'var(--series-1)' }}
              >
                Abrir o mapa de pontos de coleta <HiArrowUpRight size={15} />
              </a>
            </Card>
          </Reveal>
        </Section>
      </main>

      <footer className="border-t py-12" style={{ borderColor: 'var(--grid)' }}>
        <div className="mx-auto max-w-6xl px-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Descarte Consciente de Medicamentos
          </p>
          <p className="mt-1.5">Projeto Comunitário de Extensão Universitária · UNIVALI · Itajaí/SC</p>
          <p className="mt-5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Dados do formulário apurados em {APURADO_EM} ({FORM_TOTAL} respostas) e das métricas de stories do perfil{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              @descartesaudavel
            </a>
            . Base legal: Lei nº 12.305/2010 (Política Nacional de Resíduos Sólidos) e Decreto nº 10.388/2020 (logística
            reversa de medicamentos domiciliares).
          </p>
        </div>
      </footer>
    </>
  )
}
