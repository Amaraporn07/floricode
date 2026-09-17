import type { ArrangementStyleId } from '../data/options'

export interface AutoPosition {
  x: number
  y: number
  z: number
  rotationY: number
  tilt: number
  scale: number
}

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

// World-space convention: the neck (where every stem converges, and where the
// wrap cone's opening sits) is at y=0. Flower heads live above that in a
// "head zone" reaching up to roughly NECK_Y + headSpan.
const BASE_Y = 0.4
const HEAD_SPAN = 1.7
const GOLDEN_ANGLE = (137.508 * Math.PI) / 180

/**
 * Computes default 3D (x, y, z, rotationY, tilt, scale) for `count` flower
 * heads above the bouquet's neck point, based on the chosen arrangement
 * style. Manual dragging/tilting/stem-trimming afterwards simply overrides
 * these starting values.
 */
export function computeAutoLayout(count: number, style: ArrangementStyleId): AutoPosition[] {
  if (count === 0) return []

  const positions: AutoPosition[] = []

  if (style === 'compact') {
    // Phyllotaxis (sunflower-spiral) spacing packed into a dome — evenly
    // fills a tight rounded cluster the way a hand-tied bouquet head does.
    // Outer flowers lean outward a little, like real stems fanning from a
    // tied bunch, instead of every head standing bolt upright.
    const maxRadius = 0.62
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt((i + 0.5) / count) * maxRadius
      const theta = i * GOLDEN_ANGLE
      const t = r / maxRadius
      positions.push({
        x: r * Math.cos(theta),
        z: r * Math.sin(theta),
        y: BASE_Y + HEAD_SPAN * 0.72 * (1 - t * t * 0.7),
        rotationY: (theta * 180) / Math.PI,
        tilt: t * 22,
        scale: 1 - t * 0.18,
      })
    }
    return positions
  }

  if (style === 'classic') {
    // Long fan — flowers spread along a wide horizontal arc, tallest in the
    // middle, each leaning outward along the fan the further it is from
    // center.
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1)
      const spreadAngle = (t - 0.5) * 1.7
      positions.push({
        x: Math.sin(spreadAngle) * 0.95,
        z: -Math.cos(spreadAngle) * 0.25 + (seeded(i, 2) - 0.5) * 0.12,
        y: BASE_Y + Math.sin(t * Math.PI) * HEAD_SPAN * 0.85,
        rotationY: (spreadAngle * 180) / Math.PI,
        tilt: Math.abs(t - 0.5) * 50,
        scale: 0.85 + Math.sin(t * Math.PI) * 0.3,
      })
    }
    return positions
  }

  // freeform — organic scatter across a wider, looser cluster, each head at
  // its own loose, slightly random lean for an unstudied, natural look.
  const maxRadius = 0.85
  for (let i = 0; i < count; i++) {
    const angle = seeded(i, 1) * Math.PI * 2
    const r = Math.sqrt(seeded(i, 2)) * maxRadius
    positions.push({
      x: r * Math.cos(angle),
      z: r * Math.sin(angle) * 0.6,
      y: BASE_Y + seeded(i, 3) * HEAD_SPAN,
      rotationY: seeded(i, 4) * 360,
      tilt: seeded(i, 6) * 30,
      scale: 0.75 + seeded(i, 5) * 0.55,
    })
  }
  return positions
}
