import type { ArrangementStyleId } from '../data/options'

export interface AutoPosition {
  x: number
  y: number
  rotation: number
  scale: number
}

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Computes default (x%, y%, rotation, scale) for `count` flower heads inside
 * the bouquet's "head" zone (roughly the top 55% of the canvas), based on the
 * chosen arrangement style. Manual dragging afterwards simply overrides these.
 */
export function computeAutoLayout(count: number, style: ArrangementStyleId): AutoPosition[] {
  if (count === 0) return []

  const positions: AutoPosition[] = []

  if (style === 'compact') {
    // Concentric rings packed into a tight circle.
    const centerX = 50
    const centerY = 30
    let placed = 0
    let ring = 0
    while (placed < count) {
      const ringCount = ring === 0 ? 1 : Math.min(6 + (ring - 1) * 4, count - placed)
      const radius = ring * 13
      for (let i = 0; i < ringCount && placed < count; i++) {
        const angle = (360 / ringCount) * i + ring * 20
        const rad = (angle * Math.PI) / 180
        positions.push({
          x: centerX + Math.cos(rad) * radius,
          y: centerY + Math.sin(rad) * radius * 0.8,
          rotation: (seeded(placed, 1) - 0.5) * 20,
          scale: 1 - ring * 0.06,
        })
        placed++
      }
      ring++
    }
    return positions
  }

  if (style === 'classic') {
    // Vertical fan — long classic bouquet silhouette.
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1)
      positions.push({
        x: 20 + t * 60,
        y: 42 - Math.sin(t * Math.PI) * 30,
        rotation: (t - 0.5) * 50,
        scale: 0.85 + Math.sin(t * Math.PI) * 0.3,
      })
    }
    return positions
  }

  // freeform — organic scatter across a wider, looser cluster
  for (let i = 0; i < count; i++) {
    positions.push({
      x: 22 + seeded(i, 2) * 56,
      y: 10 + seeded(i, 3) * 42,
      rotation: (seeded(i, 4) - 0.5) * 60,
      scale: 0.8 + seeded(i, 5) * 0.5,
    })
  }
  return positions
}
