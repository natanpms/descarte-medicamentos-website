import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { HiCheck, HiChevronRight, HiMinus, HiXMark } from 'react-icons/hi2'
import type { Pergunta, Slice } from '../data'

const nf = new Intl.NumberFormat('pt-BR')

/** Margem do gatilho de scroll, no formato `top/bottom left/right`.
 *  Os 0px laterais não são decoração: uma margem negativa encolhe o viewport nos
 *  quatro lados, e no celular (padding de 20px) isso jogava todo elemento alinhado
 *  à esquerda para fora da faixa — nada animava. */
export const VIEW_MARGIN = '-60px 0px'

export const pct = (v: number, total: number) => Math.round((v / total) * 100)

const slotColor = (s?: 1 | 2 | 3) => `var(--series-${s ?? 1})`

const TONE = {
  correto: { color: 'var(--series-1)', Icon: HiCheck, hint: 'forma correta' },
  incorreto: { color: 'var(--critical)', Icon: HiXMark, hint: 'forma incorreta' },
  neutro: { color: 'var(--text-muted)', Icon: HiMinus, hint: 'adia o descarte' },
} as const

export const sliceColor = (s: Slice) => (s.tone ? TONE[s.tone].color : slotColor(s.slot))

/** Tinta do rótulo impresso dentro do segmento: o amarelo é claro demais para texto branco. */
const labelInk = (s: Slice) => (s.slot === 3 || s.tone === 'neutro' ? '#0b0f0c' : '#ffffff')

/** No touch não existe "sair de cima": lá o realce vira toque que alterna. */
export function useHoverCapable() {
  const [can, setCan] = useState(() => matchMedia('(hover: hover)').matches)
  useEffect(() => {
    const mq = matchMedia('(hover: hover)')
    const on = () => setCan(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return can
}

/** Realce só onde existe ponteiro: no toque não há "sair de cima", e o realce
 *  ficaria preso escurecendo todas as outras barras. */
function highlightProps(canHover: boolean, label: string, set: (v: string | null) => void) {
  if (!canHover) return {}
  return {
    onMouseEnter: () => set(label),
    onMouseLeave: () => set(null),
    onFocus: () => set(label),
    onBlur: () => set(null),
  }
}

/** Gatilho de entrada na tela. Precisa ser ancorado num elemento de tamanho real:
 *  um elemento com `scaleX: 0` ou `width: 0` tem caixa vazia e o IntersectionObserver
 *  pode nunca marcá-lo como visível — foi assim que as barras ficaram zeradas. */
export function useEntrou<T extends Element>() {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, margin: VIEW_MARGIN })
  return [ref, inView] as const
}

/** Barra de progresso que cresce ao entrar na tela. */
export function GrowBar({
  fraction,
  color = 'var(--series-1)',
  delay = 0,
}: {
  fraction: number
  color?: string
  delay?: number
}) {
  const [ref, inView] = useEntrou<HTMLDivElement>()
  return (
    <div ref={ref} className="h-2.5 w-full rounded-full" style={{ background: 'var(--grid)' }}>
      <motion.div
        className="h-full rounded-full origin-left"
        style={{ background: color }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? fraction : 0 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

/* ------------------------------------------------------------- primitivos */

/** Conta de 0 até `to` quando entra na tela. Respeita prefers-reduced-motion. */
export function Counter({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: VIEW_MARGIN })
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!inView) {
      el.textContent = reduce ? nf.format(to) : '0'
      return
    }
    if (reduce) {
      el.textContent = nf.format(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = nf.format(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])

  return <span ref={ref}>0</span>
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: VIEW_MARGIN }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  // no touch, `whileHover` dispara no toque e o card fica preso levantado
  const canHover = useHoverCapable()
  return (
    <motion.div
      whileHover={canHover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`rounded-2xl border p-6 sm:p-7 ${className}`}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
    >
      {children}
    </motion.div>
  )
}

/** Tabela-gêmea de cada gráfico: todo valor é legível sem depender de cor ou tooltip. */
function TableView({ slices, n, unidade = 'respostas' }: { slices: Slice[]; n: number; unidade?: string }) {
  return (
    <details className="mt-5 group">
      <summary
        className="flex items-center gap-1 text-xs tracking-wide uppercase list-none select-none transition-colors hover:opacity-70"
        style={{ color: 'var(--text-muted)' }}
      >
        <HiChevronRight size={14} className="transition-transform group-open:rotate-90" /> Ver tabela
      </summary>
      <table className="mt-3 w-full text-sm tabular-nums">
        <thead>
          <tr style={{ color: 'var(--text-muted)' }} className="text-left text-xs uppercase tracking-wide">
            <th className="py-1 font-medium">Resposta</th>
            <th className="py-1 font-medium text-right">{unidade}</th>
            <th className="py-1 font-medium text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {slices.map((s) => (
            <tr key={s.label} className="border-t" style={{ borderColor: 'var(--grid)' }}>
              <td className="py-1.5" style={{ color: 'var(--text-secondary)' }}>
                {s.label}
              </td>
              <td className="py-1.5 text-right">{nf.format(s.value)}</td>
              <td className="py-1.5 text-right" style={{ color: 'var(--text-muted)' }}>
                {pct(s.value, n)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

/* ------------------------------------------------------------- stat tile */

export function StatTile({
  value,
  label,
  sufixo,
  nota,
  accent = 'var(--series-1)',
}: {
  value: number
  label: string
  sufixo?: string
  nota?: string
  accent?: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: accent }} />
      <div className="text-4xl sm:text-5xl font-semibold tracking-tight">
        <Counter to={value} />
        {sufixo && <span className="text-2xl font-normal" style={{ color: 'var(--text-muted)' }}>{sufixo}</span>}
      </div>
      <div className="mt-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
      {nota && (
        <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          {nota}
        </div>
      )}
    </Card>
  )
}

/* -------------------------------------------------------------- bar list */

/** Barras horizontais com rótulo de valor direto em cada barra. */
export function BarList({
  items,
  total,
  unidade = 'respostas',
  showTone = false,
}: {
  items: Slice[]
  total: number
  unidade?: string
  showTone?: boolean
}) {
  const max = Math.max(...items.map((i) => i.value))
  const [hover, setHover] = useState<string | null>(null)
  const canHover = useHoverCapable()
  const [listRef, inView] = useEntrou<HTMLUListElement>()

  return (
    <div>
      {showTone && (
        <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {(['correto', 'incorreto', 'neutro'] as const).map((t) => {
            const { Icon, color, hint } = TONE[t]
            return (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Icon size={14} style={{ color }} aria-hidden />
                {hint}
              </span>
            )
          })}
        </div>
      )}

      <ul ref={listRef} className="space-y-4">
        {items.map((item, i) => {
          const color = sliceColor(item)
          const dim = hover !== null && hover !== item.label
          return (
            <li
              key={item.label}
              className="group py-1 transition-opacity duration-200"
              style={{ opacity: dim ? 0.45 : 1 }}
              {...highlightProps(canHover, item.label, setHover)}
              tabIndex={0}
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.tone &&
                    (() => {
                      const { Icon, hint } = TONE[item.tone]
                      return <Icon size={15} style={{ color }} aria-label={hint} role="img" />
                    })()}
                  {item.label}
                </span>
                <span className="shrink-0 text-sm tabular-nums font-medium">
                  {nf.format(item.value)}
                  <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                    {pct(item.value, total)}%
                  </span>
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full" style={{ background: 'var(--grid)' }}>
                <motion.div
                  className="h-full rounded-full origin-left"
                  style={{ background: color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inView ? item.value / max : 0 }}
                  transition={{ duration: 0.9, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <TableView slices={items} n={total} unidade={unidade} />
    </div>
  )
}

/* ----------------------------------------------------------- stacked bar */

/** Uma barra empilhada por pergunta, com legenda e rótulos diretos. Gap de 2px entre
 *  segmentos feito com `border` da cor da superfície, nunca com contorno escuro. */
export function StackedBar({ pergunta }: { pergunta: Pergunta }) {
  const { slices, n } = pergunta
  const [hover, setHover] = useState<string | null>(null)
  const canHover = useHoverCapable()
  const [barRef, inView] = useEntrou<HTMLDivElement>()

  return (
    <div>
      <div
        ref={barRef}
        className="flex h-9 w-full overflow-hidden rounded-lg"
        role="img"
        aria-label={`${pergunta.titulo} — ${slices.map((s) => `${s.label}: ${s.value}`).join(', ')}`}
      >
        {slices.map((s, i) => {
          const color = sliceColor(s)
          const share = pct(s.value, n)
          const dim = hover !== null && hover !== s.label
          return (
            <motion.div
              key={s.label}
              className="relative flex items-center justify-center"
              style={{
                background: color,
                marginLeft: i === 0 ? 0 : 2,
                opacity: dim ? 0.45 : 1,
                transition: 'opacity .2s',
              }}
              initial={{ width: 0 }}
              animate={{ width: inView ? `${share}%` : 0 }}
              transition={{ duration: 0.85, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              {...highlightProps(canHover, s.label, setHover)}
              title={`${s.label}: ${s.value} de ${n} (${share}%)`}
            >
              {/* só rotula dentro quando cabe — no card estreito do celular um segmento
                  abaixo de ~16% corta o rótulo; os demais ficam na legenda e na tabela */}
              {share >= 16 && (
                <span
                  className="px-2 text-xs font-semibold tabular-nums whitespace-nowrap"
                  style={{ color: labelInk(s) }}
                >
                  {share}%
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {slices.map((s) => (
          <button
            key={s.label}
            type="button"
            className="inline-flex items-center gap-2 text-sm transition-opacity"
            style={{ opacity: hover !== null && hover !== s.label ? 0.45 : 1, color: 'var(--text-secondary)' }}
            {...highlightProps(canHover, s.label, setHover)}
          >
            <span className="inline-block size-2.5 rounded-full" style={{ background: sliceColor(s) }} />
            {s.label}
            <span className="tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>
              {s.value}
            </span>
          </button>
        ))}
      </div>

      <TableView slices={slices} n={n} />
    </div>
  )
}

/* ------------------------------------------------------------ area chart */

type Ponto = { dia: string; value: number }

/** Área + linha com crosshair. O traçado é desenhado ao entrar na tela. */
export function AreaChart({ dados }: { dados: Ponto[] }) {
  const W = 760
  const H = 240
  const PAD = { top: 16, right: 16, bottom: 28, left: 34 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const max = Math.ceil(Math.max(...dados.map((d) => d.value)) / 10) * 10
  const [active, setActive] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { once: true, margin: VIEW_MARGIN })

  const x = (i: number) => PAD.left + (i / (dados.length - 1)) * plotW
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH

  const linha = dados.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ')
  const area = `${linha} L${x(dados.length - 1).toFixed(1)},${PAD.top + plotH} L${PAD.left},${PAD.top + plotH} Z`
  const ticks = [0, max / 2, max]

  /** Mesma conta para mouse e dedo: do clientX ao índice do ponto mais próximo. */
  const aponta = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = ((clientX - rect.left) / rect.width) * W
    const i = Math.round(((px - PAD.left) / plotW) * (dados.length - 1))
    setActive(Math.min(dados.length - 1, Math.max(0, i)))
  }

  const p = active !== null ? dados[active] : null

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative touch-pan-y"
        onMouseMove={(e) => aponta(e.clientX)}
        onMouseLeave={() => setActive(null)}
        onTouchStart={(e) => aponta(e.touches[0].clientX)}
        onTouchMove={(e) => aponta(e.touches[0].clientX)}
        onTouchEnd={() => setActive(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Respostas do formulário por dia">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--grid)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">
                {t}
              </text>
            </g>
          ))}

          <motion.path
            d={area}
            fill="url(#areaFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />
          <motion.path
            d={linha}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? 1 : 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* pico direto-rotulado: o único número impresso no plot */}
          {(() => {
            const i = dados.reduce((best, d, idx) => (d.value > dados[best].value ? idx : best), 0)
            return (
              <motion.g
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <circle cx={x(i)} cy={y(dados[i].value)} r="4.5" fill="var(--series-1)" stroke="var(--surface-1)" strokeWidth="2" />
                <text x={x(i)} y={y(dados[i].value) - 12} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-primary)">
                  {dados[i].value}
                </text>
              </motion.g>
            )
          })()}

          {active !== null && (
            <g>
              <line
                x1={x(active)}
                x2={x(active)}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="var(--axis)"
                strokeWidth="1"
              />
              <circle cx={x(active)} cy={y(dados[active].value)} r="5" fill="var(--series-1)" stroke="var(--surface-1)" strokeWidth="2" />
            </g>
          )}

          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + plotH}
            y2={PAD.top + plotH}
            stroke="var(--axis)"
            strokeWidth="1"
            shapeRendering="crispEdges"
          />
          {dados.map((d, i) =>
            i % 2 === 0 ? (
              <text key={d.dia} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--text-muted)">
                {d.dia}
              </text>
            ) : null,
          )}
        </svg>

        {p && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${(x(active!) / W) * 100}%`,
              top: `${(y(p.value) / H) * 100}%`,
              background: 'var(--surface-1)',
              borderColor: 'var(--border)',
            }}
          >
            <div style={{ color: 'var(--text-muted)' }}>{p.dia}</div>
            <div className="font-semibold tabular-nums">
              {p.value} {p.value === 1 ? 'resposta' : 'respostas'}
            </div>
          </div>
        )}
      </div>

      <TableView
        slices={dados.map((d) => ({ label: d.dia, value: d.value }))}
        n={dados.reduce((a, d) => a + d.value, 0)}
      />
    </div>
  )
}
