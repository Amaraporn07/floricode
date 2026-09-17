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

function conePoints(fold: WrapFoldId) {
  if (fold === 'straight') {
    return [
      new THREE.Vector2(0.32, 0),
      new THREE.Vector2(0.36, 0.3),
      new THREE.Vector2(0.4, 0.65),
      new THREE.Vector2(0.44, 1.0),
    ]
  }
  return [
    new THREE.Vector2(0.03, 0),
    new THREE.Vector2(0.14, 0.14),
    new THREE.Vector2(0.28, 0.4),
    new THREE.Vector2(0.4, 0.66),
    new THREE.Vector2(0.48, 0.86),
    new THREE.Vector2(0.54, 1.0),
  ]
}

function ConeMesh({ hex, pattern, fold, opacity = 1, scale = 1 }: { hex: string; pattern: WrapPatternId; fold: WrapFoldId; opacity?: number; scale?: number }) {
  const geometry = useMemo(() => new THREE.LatheGeometry(conePoints(fold), 28), [fold])
  const texture = useMemo(() => (pattern === 'plain' ? null : createPaperTexture(pattern, hex)), [pattern, hex])

  return (
    <mesh geometry={geometry} scale={[scale, 1, scale]} receiveShadow castShadow>
      <meshStandardMaterial
        color={texture ? '#ffffff' : hex}
        map={texture ?? undefined}
        roughness={0.85}
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
