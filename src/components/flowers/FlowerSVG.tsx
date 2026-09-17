import type { FlowerShape } from '../../data/types'

interface FlowerSVGProps {
  shape: FlowerShape
  petalColor: string
  centerColor: string
  /** Radial variants: petal count. 'rose'/'peony' (shape 'rose'): ring count instead. */
  petalCount?: number
  className?: string
}

const OUTLINE = 'rgba(74, 63, 53, 0.35)'

/** Deterministic pseudo-random in [0,1), seeded by index — stable across re-renders. */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// A curled, teardrop-with-a-hook petal — reads as an actual rose/peony petal
// (folding over itself) far better than a plain symmetric ellipse.
const ROSE_PETAL = 'M0,0 C -14,-9 -15,-24 -5,-33 C 0,-37 8,-34 9,-25 C 11,-14 8,-6 0,0 Z'

function RosePetals({ petalColor, rings }: { petalColor: string; rings: number }) {
  const groups = Array.from({ length: rings }, (_, ring) => {
    const count = 5 + ring * 3
    const scale = 1 - ring * 0.16
    const rotOffset = ring * (180 / count) + ring * 14
    return Array.from({ length: count }, (_, i) => {
      const angle = (360 / count) * i + rotOffset
      return (
        <g key={`${ring}-${i}`} transform={`translate(50 50) rotate(${angle}) scale(${scale})`}>
          <path d={ROSE_PETAL} fill={petalColor} stroke={OUTLINE} strokeWidth="1" opacity={1 - ring * 0.06} />
        </g>
      )
    })
  }).reverse() // draw outer (larger) ring first so inner rings layer on top
  return <>{groups}</>
}

// Long, pointed petal used for daisies/sunflowers/lilies (thin) — count and
// aspect ratio per-variant give each flower a distinct silhouette.
function RadialPetals({
  petalColor,
  count,
  variant,
}: {
  petalColor: string
  count: number
  variant: 'daisy' | 'lily' | 'mum'
}) {
  const sizes = { daisy: { rx: 8, ry: 22, r: 26 }, lily: { rx: 7, ry: 30, r: 22 }, mum: { rx: 3.6, ry: 24, r: 24 } }
  const { rx, ry, r } = sizes[variant]
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <ellipse cx="50" cy={50 - r} rx={rx} ry={ry} fill={petalColor} stroke={OUTLINE} strokeWidth="1" />
          </g>
        )
      })}
    </>
  )
}

// Three broad, rounded petals fanned narrowly and overlapping — the classic
// closed tulip-cup silhouette. Built from petal shapes (not one hand-drawn
// blob outline) so it reads unmistakably as "petals cupped together" rather
// than an abstract rounded shape.
const TULIP_PETAL = 'M0,0 C -12,-9 -13,-25 -4,-35 C -1,-38 1,-38 4,-35 C 13,-25 12,-9 0,0 Z'

function TulipCup({ petalColor }: { petalColor: string }) {
  const petals = [
    { angle: -26, scale: 0.92 },
    { angle: 26, scale: 0.92 },
    { angle: 0, scale: 1 },
  ]
  return (
    <>
      {petals.map(({ angle, scale }, i) => (
        <g key={i} transform={`translate(50 68) rotate(${angle}) scale(${scale})`}>
          <path d={TULIP_PETAL} fill={petalColor} stroke={OUTLINE} strokeWidth="1.1" />
        </g>
      ))}
    </>
  )
}

// A rounded petal with a small notch at the tip — the signature cherry
// blossom detail that a plain oval petal can't convey.
const SAKURA_PETAL =
  'M0,0 C -13,-5 -19,-17 -15,-25 C -13,-29 -7,-31 -3,-28 C -1,-31 1,-31 3,-28 C 7,-31 13,-29 15,-25 C 19,-17 13,-5 0,0 Z'

function SakuraPetals({ petalColor }: { petalColor: string }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i} transform={`translate(50 50) rotate(${(360 / 5) * i})`}>
          <path d={SAKURA_PETAL} fill={petalColor} stroke={OUTLINE} strokeWidth="1" />
        </g>
      ))}
    </>
  )
}

// Orchid: five slim pointed petals/sepals around the top plus one enlarged,
// rounder "lip" petal at the bottom with a contrasting throat marking — the
// asymmetry is what makes an orchid read as an orchid rather than a generic
// flower.
const ORCHID_PETAL = 'M0,0 C -8,-11 -9,-25 -3,-33 C -1,-36 1,-36 3,-33 C 9,-25 8,-11 0,0 Z'
const ORCHID_LIP = 'M0,0 C -15,5 -19,17 -11,26 C -6,31 6,31 11,26 C 19,17 15,5 0,0 Z'

function OrchidPetals({ petalColor, centerColor }: { petalColor: string; centerColor: string }) {
  const topAngles = [0, 72, 144, 216, 288].filter((a) => a !== 180)
  return (
    <>
      {topAngles.map((angle) => (
        <g key={angle} transform={`translate(50 50) rotate(${angle})`}>
          <path d={ORCHID_PETAL} fill={petalColor} stroke={OUTLINE} strokeWidth="1" />
        </g>
      ))}
      <g transform="translate(50 50) rotate(180)">
        <path d={ORCHID_LIP} fill={petalColor} stroke={OUTLINE} strokeWidth="1" />
      </g>
      <ellipse cx="50" cy="58" rx="4.5" ry="6" fill={centerColor} opacity="0.85" />
    </>
  )
}

// A jagged, fringed petal tip — the ruffled edge that distinguishes a
// carnation from a smooth-petalled mum.
const CARNATION_PETAL = 'M0,0 L-6,-13 L-3,-15 L-4,-20 L-1.5,-18.5 L0,-24 L1.5,-18.5 L4,-20 L3,-15 L6,-13 Z'

function CarnationPetals({ petalColor, count }: { petalColor: string; count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const ring = i % 3
        const angle = (360 / count) * i + ring * 6
        const scale = 1.5 - ring * 0.28
        return (
          <g key={i} transform={`translate(50 50) rotate(${angle}) scale(${scale})`}>
            <path d={CARNATION_PETAL} fill={petalColor} stroke={OUTLINE} strokeWidth="0.8" opacity={1 - ring * 0.05} />
          </g>
        )
      })}
    </>
  )
}

// Small, densely packed, rounded petals in tight concentric rings — a
// fluffy pompom silhouette rather than a spiral, which is what makes a
// marigold look different from a rose at a glance.
const MARIGOLD_PETAL = 'M0,0 C -7,-4 -8,-13 -4,-19 C -2,-22 2,-22 4,-19 C 8,-13 7,-4 0,0 Z'

function MarigoldPetals({ petalColor }: { petalColor: string }) {
  const rings = [
    { count: 16, scale: 1.05 },
    { count: 12, scale: 0.8 },
    { count: 8, scale: 0.55 },
  ]
  return (
    <>
      {rings.map((ring, ringIndex) =>
        Array.from({ length: ring.count }, (_, i) => {
          const angle = (360 / ring.count) * i + ringIndex * 11
          return (
            <g key={`${ringIndex}-${i}`} transform={`translate(50 50) rotate(${angle}) scale(${ring.scale})`}>
              <path d={MARIGOLD_PETAL} fill={petalColor} stroke={OUTLINE} strokeWidth="0.8" opacity={1 - ringIndex * 0.05} />
            </g>
          )
        }),
      )}
    </>
  )
}

// Lavender: a slender, sparse spike — one or two small elongated florets per
// row, tightly hugging a thin stem. Kept deliberately narrow/wand-like so it
// reads distinctly different from hyacinth's dense, fat cone below.
function SpikeCluster({ petalColor }: { petalColor: string }) {
  const rows = 8
  const items: JSX.Element[] = []
  for (let row = 0; row < rows; row++) {
    const y = 12 + row * 7.5
    const perRow = row < 2 ? 1 : 2
    const spread = 4.5
    for (let i = 0; i < perRow; i++) {
      const x = 50 + (perRow === 1 ? 0 : (i - 0.5) * spread)
      items.push(<ellipse key={`${row}-${i}`} cx={x} cy={y} rx={3.6} ry={5.5} fill={petalColor} stroke={OUTLINE} strokeWidth="0.6" />)
    }
  }
  return (
    <>
      <line x1="50" y1="12" x2="50" y2="92" stroke="#7FA06A" strokeWidth="1.8" />
      {items}
    </>
  )
}

// Hyacinth: many small bell florets packed densely into a fat, widening
// cone — the opposite silhouette from lavender's thin wand, which is what
// keeps the two from looking like the same flower in a different color.
const HYACINTH_FLORET = 'M0,0 C -4.5,-1.5 -5.5,2.5 -3,5 C -1.5,6.5 1.5,6.5 3,5 C 5.5,2.5 4.5,-1.5 0,0 Z'

function HyacinthSpike({ petalColor, centerColor }: { petalColor: string; centerColor: string }) {
  const rows = 6
  const items: JSX.Element[] = []
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1)
    const y = 14 + row * 8.5
    const width = 8 + t * 24
    const perRow = 3 + row
    for (let i = 0; i < perRow; i++) {
      const x = 50 + (i - (perRow - 1) / 2) * (width / perRow)
      const jitter = (pseudoRandom(row * 10 + i) - 0.5) * 2
      items.push(
        <g key={`${row}-${i}`} transform={`translate(${x + jitter} ${y})`}>
          <path d={HYACINTH_FLORET} fill={petalColor} stroke={OUTLINE} strokeWidth="0.5" />
          <circle r="0.9" fill={centerColor} />
        </g>,
      )
    }
  }
  return (
    <>
      <line x1="50" y1="14" x2="50" y2="92" stroke="#7FA06A" strokeWidth="2.6" />
      {items}
    </>
  )
}

// A short spray of 2-3 small daisy blooms on their own thin stems, rather
// than one large flower — closer to how daisies actually grow in a cluster,
// and each bloom reads as clearly smaller than a standalone daisy.
function DaisySpray({ petalColor, centerColor }: { petalColor: string; centerColor: string }) {
  const heads = [
    { x: 50, y: 16, scale: 1, stem: 'M50 95 C 49 72, 50 45, 50 22' },
    { x: 30, y: 42, scale: 0.75, stem: 'M50 95 C 40 82, 31 62, 30 48' },
    { x: 70, y: 48, scale: 0.68, stem: 'M50 95 C 60 84, 69 66, 70 54' },
  ]
  return (
    <>
      {heads.map((h, i) => (
        <path key={`stem-${i}`} d={h.stem} fill="none" stroke="#7FA06A" strokeWidth={i === 0 ? 2 : 1.5} />
      ))}
      {heads.map((h, i) => (
        <g key={`head-${i}`} transform={`translate(${h.x} ${h.y}) scale(${h.scale})`}>
          {Array.from({ length: 10 }, (_, p) => (
            <g key={p} transform={`rotate(${(360 / 10) * p})`}>
              <ellipse cx="0" cy="-10.5" rx="3" ry="8.5" fill={petalColor} stroke={OUTLINE} strokeWidth="0.6" />
            </g>
          ))}
          <circle r="4.2" fill={centerColor} stroke={OUTLINE} strokeWidth="0.6" />
        </g>
      ))}
    </>
  )
}

// Tiny 4-petal florets scattered in a cloud, rather than plain dots — reads
// as a cluster of small flowers (baby's breath / hydrangea) instead of foam.
function ClusterBloom({ petalColor, count }: { petalColor: string; count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = pseudoRandom(i) * Math.PI * 2
        const r = 8 + pseudoRandom(i + 50) * 24
        const cx = 50 + Math.cos(a) * r
        const cy = 42 + Math.sin(a) * r * 0.75
        const size = 3 + pseudoRandom(i + 100) * 3
        const rot = pseudoRandom(i + 150) * 360
        return (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
            <ellipse cx={0} cy={-size} rx={size * 0.55} ry={size} fill={petalColor} stroke={OUTLINE} strokeWidth="0.5" />
            <ellipse cx={0} cy={size} rx={size * 0.55} ry={size} fill={petalColor} stroke={OUTLINE} strokeWidth="0.5" />
            <ellipse cx={-size} cy={0} rx={size} ry={size * 0.55} fill={petalColor} stroke={OUTLINE} strokeWidth="0.5" />
            <ellipse cx={size} cy={0} rx={size} ry={size * 0.55} fill={petalColor} stroke={OUTLINE} strokeWidth="0.5" />
            <circle r={size * 0.5} fill={petalColor} opacity="0.9" />
          </g>
        )
      })}
    </>
  )
}

function Branch({ petalColor }: { petalColor: string }) {
  const leaves = 8
  return (
    <>
      <path d="M50 95 C 48 70, 52 40, 50 10" fill="none" stroke="#7FA06A" strokeWidth="3" />
      {Array.from({ length: leaves }, (_, i) => {
        const y = 18 + i * 9
        const side = i % 2 === 0 ? 1 : -1
        return (
          <ellipse
            key={i}
            cx={50 + side * 11}
            cy={y}
            rx="9"
            ry="6"
            fill={petalColor}
            stroke={OUTLINE}
            strokeWidth="0.8"
            transform={`rotate(${side * 35} ${50 + side * 11} ${y})`}
          />
        )
      })}
    </>
  )
}

const NO_GENERIC_CENTER = new Set(['tulip', 'spike', 'hyacinthSpike', 'cluster', 'branch', 'orchid', 'daisySpray'])

/**
 * Generates a cute, minimal 2D-cartoon flower illustration entirely from SVG
 * primitives — parameterized by shape/color so a handful of shape "recipes"
 * covers every flower in the dictionary without one-off artwork per species.
 * Each recipe is tuned to that flower's real silhouette (curled rose petals,
 * a notched sakura petal, an orchid's lip, a carnation's fringed edge, a
 * marigold's pompom) rather than a single generic radial-petal shape, so the
 * species stay recognizable even in this simplified cartoon style.
 */
export default function FlowerSVG({ shape, petalColor, centerColor, petalCount, className }: FlowerSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="flower illustration">
      {shape === 'rose' && <RosePetals petalColor={petalColor} rings={petalCount ?? 3} />}
      {shape === 'daisy' && <RadialPetals petalColor={petalColor} count={petalCount ?? 13} variant="daisy" />}
      {shape === 'lily' && <RadialPetals petalColor={petalColor} count={petalCount ?? 6} variant="lily" />}
      {shape === 'mum' && <RadialPetals petalColor={petalColor} count={petalCount ?? 18} variant="mum" />}
      {shape === 'tulip' && <TulipCup petalColor={petalColor} />}
      {shape === 'sakura' && <SakuraPetals petalColor={petalColor} />}
      {shape === 'orchid' && <OrchidPetals petalColor={petalColor} centerColor={centerColor} />}
      {shape === 'carnation' && <CarnationPetals petalColor={petalColor} count={petalCount ?? 21} />}
      {shape === 'marigold' && <MarigoldPetals petalColor={petalColor} />}
      {shape === 'spike' && <SpikeCluster petalColor={petalColor} />}
      {shape === 'hyacinthSpike' && <HyacinthSpike petalColor={petalColor} centerColor={centerColor} />}
      {shape === 'daisySpray' && <DaisySpray petalColor={petalColor} centerColor={centerColor} />}
      {shape === 'cluster' && <ClusterBloom petalColor={petalColor} count={petalCount ?? 16} />}
      {shape === 'branch' && <Branch petalColor={petalColor} />}

      {!NO_GENERIC_CENTER.has(shape) && <circle cx="50" cy="50" r="10" fill={centerColor} stroke={OUTLINE} strokeWidth="1" />}
    </svg>
  )
}
