import { useMemo } from 'react'
import * as THREE from 'three'
import type { FlowerShape } from '../data/types'
import { fringedPetalGeometry, leafGeometry, lipPetalGeometry, teardropPetalGeometry } from './petalGeometry'

interface FlowerBloom3DProps {
  shape: FlowerShape
  petalColor: string
  centerColor: string
  /** Radial variants: petal count. 'rose'/'peony' (shape 'rose'): ring count instead. */
  petalCount?: number
}

const STEM_COLOR = '#7FA06A'
const deg = (d: number) => (d * Math.PI) / 180

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

interface RingConfig {
  count: number
  tiltDeg: number
  scale: number
  attachY: number
  rotOffsetDeg: number
}

/** One ring of identical petals fanned radially around the local Y axis,
 * each tilted up from vertical by `tiltDeg` (0 = pointing straight up/closed,
 * 90 = pointing straight outward/fully open). */
function PetalRing({ config, geometry, color }: { config: RingConfig; geometry: THREE.BufferGeometry; color: string }) {
  const { count, tiltDeg, scale, attachY, rotOffsetDeg } = config
  const tilt = deg(tiltDeg)
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (2 * Math.PI * i) / count + deg(rotOffsetDeg)
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh geometry={geometry} position={[0, attachY, 0]} rotation={[tilt, 0, 0]} scale={scale} castShadow>
              <meshStandardMaterial color={color} roughness={0.55} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

function Center({ radius, color, y = 0 }: { radius: number; color: string; y?: number }) {
  return (
    <mesh position={[0, y, 0]} castShadow>
      <sphereGeometry args={[radius, 12, 10]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  )
}

function Stem({ height, radius = 0.012 }: { height: number; radius?: number }) {
  return (
    <mesh position={[0, height / 2, 0]}>
      <cylinderGeometry args={[radius, radius * 1.3, height, 6]} />
      <meshStandardMaterial color={STEM_COLOR} roughness={0.7} />
    </mesh>
  )
}

// --- Rose / peony: concentric spiral rings of curled petals ---------------
function RoseBloom({ petalColor, rings }: { petalColor: string; rings: number }) {
  const geometry = useMemo(() => teardropPetalGeometry(0.46, 0.32, 0), [])
  const configs = useMemo<RingConfig[]>(() => {
    const arr: RingConfig[] = []
    for (let r = 0; r < rings; r++) {
      const count = 5 + r * 3
      arr.push({ count, tiltDeg: 18 + r * 22, scale: 0.62 + r * 0.15, attachY: -r * 0.012, rotOffsetDeg: r * (180 / count) + r * 24 })
    }
    return arr
  }, [rings])
  return (
    <group>
      {configs.map((c, i) => (
        <PetalRing key={i} config={c} geometry={geometry} color={petalColor} />
      ))}
      <Center radius={0.075} color={petalColor} y={0.05} />
    </group>
  )
}

// --- Tulip: three broad petals closed into a cup --------------------------
function TulipBloom({ petalColor }: { petalColor: string }) {
  const geometry = useMemo(() => teardropPetalGeometry(0.58, 0.46, 0), [])
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, deg(i * 120), 0]}>
          <mesh geometry={geometry} rotation={[deg(16), 0, 0]} castShadow>
            <meshStandardMaterial color={petalColor} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// --- Daisy-family: sunflower / lily / mum / sakura ------------------------
// A single (or lightly layered) ring of radiating petals — count, length,
// width, notch and tilt are what give each species its own silhouette.
function DaisyLikeBloom({
  petalColor,
  centerColor,
  count,
  length,
  width,
  notch = 0,
  tiltDeg,
  centerRadius,
  extraRing,
}: {
  petalColor: string
  centerColor: string
  count: number
  length: number
  width: number
  notch?: number
  tiltDeg: number
  centerRadius: number
  extraRing?: { count: number; scale: number; tiltDeg: number }
}) {
  const geometry = useMemo(() => teardropPetalGeometry(length, width, notch), [length, width, notch])
  return (
    <group>
      <PetalRing config={{ count, tiltDeg, scale: 1, attachY: 0, rotOffsetDeg: 0 }} geometry={geometry} color={petalColor} />
      {extraRing && (
        <PetalRing
          config={{ count: extraRing.count, tiltDeg: extraRing.tiltDeg, scale: extraRing.scale, attachY: 0.01, rotOffsetDeg: 180 / extraRing.count }}
          geometry={geometry}
          color={petalColor}
        />
      )}
      {centerRadius > 0 && <Center radius={centerRadius} color={centerColor} y={centerRadius * 0.4} />}
    </group>
  )
}

// --- Carnation: dense, fringe-edged petals in three ruffled rings ---------
function CarnationBloom({ petalColor, centerColor, count }: { petalColor: string; centerColor: string; count: number }) {
  const geometry = useMemo(() => fringedPetalGeometry(0.32, 0.24, 5), [])
  const configs = useMemo<RingConfig[]>(
    () => [
      { count: Math.round(count * 0.45), tiltDeg: 30, scale: 1, attachY: 0, rotOffsetDeg: 0 },
      { count: Math.round(count * 0.35), tiltDeg: 50, scale: 0.8, attachY: 0.01, rotOffsetDeg: 6 },
      { count: Math.round(count * 0.2), tiltDeg: 68, scale: 0.62, attachY: 0.02, rotOffsetDeg: 12 },
    ],
    [count],
  )
  return (
    <group>
      {configs.map((c, i) => (
        <PetalRing key={i} config={c} geometry={geometry} color={petalColor} />
      ))}
      <Center radius={0.05} color={centerColor} y={0.03} />
    </group>
  )
}

// --- Marigold: small rounded petals packed into a tight pompom ------------
function MarigoldBloom({ petalColor, centerColor }: { petalColor: string; centerColor: string }) {
  const geometry = useMemo(() => teardropPetalGeometry(0.24, 0.2, 0), [])
  const configs = useMemo<RingConfig[]>(
    () => [
      { count: 16, tiltDeg: 22, scale: 1, attachY: 0, rotOffsetDeg: 0 },
      { count: 12, tiltDeg: 42, scale: 0.85, attachY: 0.015, rotOffsetDeg: 8 },
      { count: 8, tiltDeg: 62, scale: 0.68, attachY: 0.03, rotOffsetDeg: 16 },
    ],
    [],
  )
  return (
    <group>
      {configs.map((c, i) => (
        <PetalRing key={i} config={c} geometry={geometry} color={petalColor} />
      ))}
      <Center radius={0.045} color={centerColor} y={0.04} />
    </group>
  )
}

// --- Orchid: slim petals plus one oversized, forward-hanging lip ---------
function OrchidBloom({ petalColor, centerColor }: { petalColor: string; centerColor: string }) {
  const petalGeo = useMemo(() => teardropPetalGeometry(0.46, 0.22, 0), [])
  const lipGeo = useMemo(() => lipPetalGeometry(0.34, 0.5), [])
  const angles = [0, 72, 144, 216, 288].filter((a) => a !== 180)
  return (
    <group>
      {angles.map((a) => (
        <group key={a} rotation={[0, deg(a), 0]}>
          <mesh geometry={petalGeo} rotation={[deg(40), 0, 0]} castShadow>
            <meshStandardMaterial color={petalColor} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      <group rotation={[0, Math.PI, 0]}>
        <mesh geometry={lipGeo} rotation={[deg(52), 0, 0]} castShadow>
          <meshStandardMaterial color={petalColor} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.1, 0.26]} rotation={[deg(52), 0, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color={centerColor} roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

// --- Spike (lavender) / hyacinth: florets stacked around a stem ----------
function SpikeBloom({
  petalColor,
  centerColor,
  rows,
  maxWidth,
  floretSize,
  dense,
}: {
  petalColor: string
  centerColor: string
  rows: number
  maxWidth: number
  floretSize: number
  dense: boolean
}) {
  const florets: { x: number; y: number; z: number; s: number }[] = []
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1)
    const y = 0.18 + t * 0.62
    const width = dense ? maxWidth * (0.35 + t * 0.65) : maxWidth * 0.5
    const perRow = dense ? 3 + row : row < 2 ? 1 : 2
    for (let i = 0; i < perRow; i++) {
      const a = perRow === 1 ? 0 : ((i - (perRow - 1) / 2) / perRow) * Math.PI * 1.7
      const r = width / 2
      florets.push({
        x: Math.sin(a) * r,
        z: Math.cos(a) * r * 0.6,
        y: y + (pseudoRandom(row * 11 + i) - 0.5) * 0.02,
        s: floretSize * (0.85 + pseudoRandom(row * 7 + i + 3) * 0.3),
      })
    }
  }
  return (
    <group>
      <Stem height={0.85} radius={dense ? 0.02 : 0.012} />
      {florets.map((f, i) => (
        <mesh key={i} position={[f.x, f.y, f.z]} scale={f.s} castShadow>
          <sphereGeometry args={[1, 7, 6]} />
          <meshStandardMaterial color={petalColor} roughness={0.6} />
        </mesh>
      ))}
      {dense && <Center radius={0.02} color={centerColor} y={0.02} />}
    </group>
  )
}

// --- Cluster: a loose scattered cloud of tiny florets (no visible stem) --
function ClusterBloom({ petalColor, count, spread, floretSize }: { petalColor: string; count: number; spread: number; floretSize: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const a = pseudoRandom(i) * Math.PI * 2
        const r = pseudoRandom(i + 50) * spread
        const h = (pseudoRandom(i + 90) - 0.3) * spread * 0.7
        const s = floretSize * (0.7 + pseudoRandom(i + 100) * 0.6)
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.35 + h, Math.sin(a) * r * 0.8]} scale={s} castShadow>
            <sphereGeometry args={[1, 6, 6]} />
            <meshStandardMaterial color={petalColor} roughness={0.65} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Branch (eucalyptus): small flat leaves along a stem ------------------
function BranchBloom({ petalColor }: { petalColor: string }) {
  const geometry = useMemo(() => leafGeometry(0.16, 0.09), [])
  const leaves = 8
  return (
    <group>
      <Stem height={0.95} radius={0.014} />
      {Array.from({ length: leaves }, (_, i) => {
        const y = 0.15 + i * 0.09
        const side = i % 2 === 0 ? 1 : -1
        return (
          <group key={i} position={[0, y, 0]} rotation={[0, side * deg(35), 0]}>
            <mesh geometry={geometry} rotation={[deg(70), 0, 0]} position={[side * 0.02, 0, 0]}>
              <meshStandardMaterial color={petalColor} roughness={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// --- Daisy spray: a few small daisy blooms on their own thin stems -------
function DaisySprayBloom({ petalColor, centerColor }: { petalColor: string; centerColor: string }) {
  const geometry = useMemo(() => teardropPetalGeometry(0.22, 0.09, 0), [])
  const heads = [
    { x: 0, z: 0, h: 0.55, scale: 1 },
    { x: -0.16, z: 0.05, h: 0.32, scale: 0.72 },
    { x: 0.15, z: -0.04, h: 0.4, scale: 0.65 },
  ]
  return (
    <group>
      {heads.map((h, i) => (
        <group key={i} position={[h.x, 0, h.z]}>
          <Stem height={h.h} radius={0.008} />
          <group position={[0, h.h, 0]} scale={h.scale}>
            <PetalRing config={{ count: 10, tiltDeg: 58, scale: 1, attachY: 0, rotOffsetDeg: 0 }} geometry={geometry} color={petalColor} />
            <Center radius={0.035} color={centerColor} y={0.015} />
          </group>
        </group>
      ))}
    </group>
  )
}

/**
 * Builds a real volumetric 3D flower bloom out of procedural petal meshes —
 * parameterized by shape/color so a handful of shape "recipes" covers every
 * flower in the dictionary, mirroring the 2D illustration recipes but with
 * actual geometry, tilt and depth instead of flat SVG paths.
 */
export default function FlowerBloom3D({ shape, petalColor, centerColor, petalCount }: FlowerBloom3DProps) {
  switch (shape) {
    case 'rose':
      return <RoseBloom petalColor={petalColor} rings={petalCount ?? 3} />
    case 'tulip':
      return <TulipBloom petalColor={petalColor} />
    case 'daisy':
      return (
        <DaisyLikeBloom
          petalColor={petalColor}
          centerColor={centerColor}
          count={petalCount ?? 21}
          length={0.5}
          width={0.15}
          tiltDeg={58}
          centerRadius={0.14}
        />
      )
    case 'lily':
      return (
        <DaisyLikeBloom
          petalColor={petalColor}
          centerColor={centerColor}
          count={petalCount ?? 6}
          length={0.56}
          width={0.2}
          tiltDeg={48}
          centerRadius={0.05}
        />
      )
    case 'mum':
      return (
        <DaisyLikeBloom
          petalColor={petalColor}
          centerColor={centerColor}
          count={petalCount ?? 18}
          length={0.4}
          width={0.09}
          tiltDeg={44}
          centerRadius={0.06}
          extraRing={{ count: 12, scale: 0.6, tiltDeg: 24 }}
        />
      )
    case 'sakura':
      return (
        <DaisyLikeBloom
          petalColor={petalColor}
          centerColor={centerColor}
          count={5}
          length={0.34}
          width={0.32}
          notch={0.14}
          tiltDeg={55}
          centerRadius={0.05}
        />
      )
    case 'carnation':
      return <CarnationBloom petalColor={petalColor} centerColor={centerColor} count={petalCount ?? 21} />
    case 'marigold':
      return <MarigoldBloom petalColor={petalColor} centerColor={centerColor} />
    case 'orchid':
      return <OrchidBloom petalColor={petalColor} centerColor={centerColor} />
    case 'spike':
      return <SpikeBloom petalColor={petalColor} centerColor={centerColor} rows={8} maxWidth={0.16} floretSize={0.032} dense={false} />
    case 'hyacinthSpike':
      return <SpikeBloom petalColor={petalColor} centerColor={centerColor} rows={6} maxWidth={0.44} floretSize={0.05} dense />
    case 'cluster':
      return <ClusterBloom petalColor={petalColor} count={petalCount ?? 16} spread={0.32} floretSize={0.03} />
    case 'branch':
      return <BranchBloom petalColor={petalColor} />
    case 'daisySpray':
      return <DaisySprayBloom petalColor={petalColor} centerColor={centerColor} />
    default:
      return null
  }
}
