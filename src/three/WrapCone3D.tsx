import { useMemo } from 'react'
import * as THREE from 'three'
import { WRAP_COLORS, type WrapColorId, type WrapFoldId, type WrapPatternId } from '../data/options'

interface WrapCone3DProps {
  color: WrapColorId
  pattern: WrapPatternId
  fold: WrapFoldId
}

/** Bakes the paper's base color + pattern together onto a canvas texture, so
 * the pattern always reads correctly regardless of lighting (no separate
 * material-color multiply to get wrong). */
function createPaperTexture(pattern: WrapPatternId, hex: string) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = hex
  ctx.fillRect(0, 0, size, size)

  if (pattern === 'craft') {
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'
      ctx.fillRect(x, y, 1.4, 1.4)
    }
  } else if (pattern === 'dots') {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    for (let y = 10; y < size; y += 26) {
      for (let x = 10; x < size; x += 26) {
        ctx.beginPath()
        ctx.arc(x, y, 3.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  } else if (pattern === 'stripe') {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'
    ctx.lineWidth = 7
    for (let x = -size; x < size * 2; x += 22) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + size, size)
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.repeat.set(3, 1)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Base radius profile (height t: 0 = pointed base, 1 = open neck), shared by
// every fold — the fold-specific character comes from how much the radius is
// then wobbled around this profile, not from the profile itself.
const CONE_PROFILE: [number, number][] = [
  [0.03, 0],
  [0.14, 0.14],
  [0.28, 0.4],
  [0.4, 0.66],
  [0.48, 0.86],
  [0.54, 1.0],
]
const STRAIGHT_PROFILE: [number, number][] = [
  [0.32, 0],
  [0.36, 0.3],
  [0.4, 0.65],
  [0.44, 1.0],
]

function sampleProfile(profile: [number, number][], t: number) {
  for (let i = 0; i < profile.length - 1; i++) {
    const [r0, t0] = profile[i]
    const [r1, t1] = profile[i + 1]
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0 || 1)
      return r0 + (r1 - r0) * f
    }
  }
  return profile[profile.length - 1][0]
}

interface FoldWave {
  profile: [number, number][]
  /** radius wobble amplitude as a function of height t (0-1) */
  amplitude: (t: number) => number
  frequency: number
  /** 'smooth' = soft crumpled paper, 'sharp' = crisp folded pleats */
  style: 'smooth' | 'sharp'
  /** extra up/down waver at the rim itself, beyond radius wobble */
  rimJitter: number
}

const FOLD_WAVE: Record<WrapFoldId, FoldWave> = {
  cone: { profile: CONE_PROFILE, amplitude: (t) => 0.02 + t * 0.045, frequency: 7, style: 'smooth', rimJitter: 0.012 },
  twoTone: { profile: CONE_PROFILE, amplitude: (t) => 0.02 + t * 0.045, frequency: 7, style: 'smooth', rimJitter: 0.012 },
  straight: { profile: STRAIGHT_PROFILE, amplitude: () => 0.012, frequency: 5, style: 'smooth', rimJitter: 0.006 },
  ruffled: { profile: CONE_PROFILE, amplitude: (t) => 0.015 + Math.pow(t, 4) * 0.16, frequency: 13, style: 'smooth', rimJitter: 0.05 },
  pleated: { profile: CONE_PROFILE, amplitude: () => 0.055, frequency: 10, style: 'sharp', rimJitter: 0.018 },
}

/** A hand-wrapped paper cone: not a perfectly round LatheGeometry surface,
 * but a custom grid mesh whose radius (and, at the rim, height) is wobbled
 * per angle — smooth multi-frequency waves for a softly crumpled look,
 * sawtooth waves for crisp pleats — so it reads as gathered paper rather
 * than plastic. */
function buildWrapGeometry(fold: WrapFoldId): THREE.BufferGeometry {
  const wave = FOLD_WAVE[fold]
  const radialSegments = 48
  const heightSegments = 22

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let j = 0; j <= heightSegments; j++) {
    const t = j / heightSegments
    const baseR = sampleProfile(wave.profile, t)
    const amp = wave.amplitude(t)
    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i / radialSegments) * Math.PI * 2
      let wobble: number
      if (wave.style === 'sharp') {
        // triangle wave: a crisp back-and-forth fold instead of a soft curve
        const phase = (theta * wave.frequency) / (Math.PI * 2)
        wobble = 2 * Math.abs(2 * (phase - Math.floor(phase + 0.5))) - 1
      } else {
        wobble = Math.sin(theta * wave.frequency) * 0.75 + Math.sin(theta * wave.frequency * 2.3 + 1.4) * 0.25
      }
      const r = Math.max(0.01, baseR * (1 + wobble * amp))
      const rim = t > 0.85 ? ((t - 0.85) / 0.15) * wave.rimJitter * Math.sin(theta * (wave.frequency * 0.6) + 0.6) : 0
      const y = t + rim
      positions.push(Math.cos(theta) * r, y, Math.sin(theta) * r)
      uvs.push((i / radialSegments) * 3, t)
    }
  }

  const rowLen = radialSegments + 1
  for (let j = 0; j < heightSegments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * rowLen + i
      const b = j * rowLen + i + 1
      const c = (j + 1) * rowLen + i
      const d = (j + 1) * rowLen + i + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function ConeMesh({ hex, pattern, fold, opacity = 1, scale = 1 }: { hex: string; pattern: WrapPatternId; fold: WrapFoldId; opacity?: number; scale?: number }) {
  const geometry = useMemo(() => buildWrapGeometry(fold), [fold])
  const texture = useMemo(() => (pattern === 'plain' ? null : createPaperTexture(pattern, hex)), [pattern, hex])

  return (
    <mesh geometry={geometry} scale={[scale, 1, scale]} receiveShadow castShadow>
      <meshStandardMaterial
        color={texture ? '#ffffff' : hex}
        map={texture ?? undefined}
        roughness={0.88}
        metalness={0}
        transparent={opacity < 1}
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** The 3D wrapping-paper cone the bouquet's stems disappear into. */
export default function WrapCone3D({ color, pattern, fold }: WrapCone3DProps) {
  const colorOption = WRAP_COLORS.find((c) => c.id === color) ?? WRAP_COLORS[0]
  const isTranslucent = fold === 'straight'

  return (
    <group position={[0, -1, 0]}>
      {fold === 'twoTone' && (
        <group position={[0.05, 0, 0.03]} rotation={[0, 0.3, 0]}>
          <ConeMesh hex={colorOption.hexSecondary} pattern={pattern} fold="cone" scale={1.08} />
        </group>
      )}
      <ConeMesh hex={colorOption.hex} pattern={pattern} fold={fold} opacity={isTranslucent ? 0.72 : 1} />
    </group>
  )
}
