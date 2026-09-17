import type { FlowerShape } from '../../data/types'

interface FlowerSVGProps {
  shape: FlowerShape
  petalColor: string
  centerColor: string
  petalCount?: number
  className?: string
}

const OUTLINE = 'rgba(74, 63, 53, 0.35)'

/** Deterministic pseudo-random in [0,1), seeded by index — stable across re-renders. */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function RosePetals({ petalColor, rings }: { petalColor: string; rings: number }) {
  const groups = Array.from({ length: rings }, (_, ring) => {
    const count = 6 + ring * 2
    const radius = 34 - ring * 9
    const size = 30 - ring * 7
    const rotOffset = ring * (180 / count)
    return Array.from({ length: count }, (_, i) => {
      const angle = (360 / count) * i + rotOffset
      return (
        <g key={`${ring}-${i}`} transform={`rotate(${angle} 50 50)`}>
          <ellipse
            cx="50"
            cy={50 - radius + size / 2.4}
            rx={size / 2.1}
            ry={size / 1.5}
            fill={petalColor}
            stroke={OUTLINE}
            strokeWidth="1"
            opacity={1 - ring * 0.08}
          />
        </g>
      )
    })
  })
  return <>{groups}</>
}

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

function TulipCup({ petalColor }: { petalColor: string }) {
  const count = 6
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = -60 + (120 / (count - 1)) * i
        return (
          <g key={i} transform={`rotate(${angle} 50 62)`}>
            <path d="M50 62 C 40 40, 42 14, 50 6 C 58 14, 60 40, 50 62 Z" fill={petalColor} stroke={OUTLINE} strokeWidth="1" />
          </g>
        )
      })}
    </>
  )
}

function SpikeCluster({ petalColor }: { petalColor: string }) {
  const rows = 6
  const items: JSX.Element[] = []
  for (let row = 0; row < rows; row++) {
    const y = 18 + row * 8
    const spread = 6 + row * 2.6
    const perRow = 2 + Math.floor(row / 2)
    for (let i = 0; i < perRow; i++) {
      const x = 50 + (i - (perRow - 1) / 2) * spread * 0.9
      items.push(
        <ellipse key={`${row}-${i}`} cx={x} cy={y} rx={6} ry={7.5} fill={petalColor} stroke={OUTLINE} strokeWidth="0.8" />,
      )
    }
  }
  return (
    <>
      <line x1="50" y1="18" x2="50" y2="92" stroke="#7FA06A" strokeWidth="3" />
      {items}
    </>
  )
}

function ClusterBloom({ petalColor, count }: { petalColor: string; count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = pseudoRandom(i) * Math.PI * 2
        const r = 8 + pseudoRandom(i + 50) * 24
        const cx = 50 + Math.cos(a) * r
        const cy = 42 + Math.sin(a) * r * 0.75
        const size = 4 + pseudoRandom(i + 100) * 4
        return <circle key={i} cx={cx} cy={cy} r={size} fill={petalColor} stroke={OUTLINE} strokeWidth="0.8" />
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

/**
 * Generates a cute, minimal 2D-cartoon flower illustration entirely from SVG
 * primitives — parameterized by shape/color so a small set of "recipes"
 * covers every flower in the dictionary without one-off artwork per species.
 */
export default function FlowerSVG({ shape, petalColor, centerColor, petalCount, className }: FlowerSVGProps) {
  const showCenter = shape !== 'tulip' && shape !== 'spike' && shape !== 'cluster' && shape !== 'branch'

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="flower illustration">
      {shape === 'rose' && <RosePetals petalColor={petalColor} rings={3} />}
      {shape === 'daisy' && <RadialPetals petalColor={petalColor} count={petalCount ?? 13} variant="daisy" />}
      {shape === 'lily' && <RadialPetals petalColor={petalColor} count={petalCount ?? 6} variant="lily" />}
      {shape === 'mum' && <RadialPetals petalColor={petalColor} count={petalCount ?? 18} variant="mum" />}
      {shape === 'tulip' && <TulipCup petalColor={petalColor} />}
      {shape === 'spike' && <SpikeCluster petalColor={petalColor} />}
      {shape === 'cluster' && <ClusterBloom petalColor={petalColor} count={petalCount ?? 16} />}
      {shape === 'branch' && <Branch petalColor={petalColor} />}

      {showCenter && <circle cx="50" cy="50" r="10" fill={centerColor} stroke={OUTLINE} strokeWidth="1" />}
    </svg>
  )
}
