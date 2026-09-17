import type { FlowerShape, PlacedFlower } from '../../data/types'
import { getFlowerById } from '../../data/flowers'

interface StemLinesProps {
  items: PlacedFlower[]
}

const NECK_X = 50
const NECK_Y = 55

// 'spike' and 'branch' flowers (lavender, hyacinth, eucalyptus) already draw
// their own stem inside the flower artwork itself, so adding this external
// stem on top of theirs would just draw a second, differently-angled stem
// that visibly doesn't line up with the first.
const HAS_OWN_STEM = new Set(['spike', 'branch'])

// How far below the flower's geometric center (in its own 0-100 local viewBox
// units, before scale) each shape's artwork actually visually "sits" — most
// shapes are drawn radially symmetric around the center so 0 is correct, but
// the tulip cup is drawn lower in its box, so anchoring at dead-center would
// leave a visible gap once the flower is rotated away from its default angle.
const LOCAL_BASE_OFFSET: Partial<Record<FlowerShape, number>> = { tulip: 12 }

const FLOWER_BOX_PX = 72 // PlacedFlowerItem's fixed on-screen size, pre-scale
// Approximate canvas pixel size (matches the `max-w-md` / aspect-[4/5] canvas
// on desktop) used only to convert that fixed pixel offset into the
// container-relative percentages this SVG's coordinates are drawn in.
const CANVAS_PX = { width: 448, height: 560 }

export default function StemLines({ items }: StemLinesProps) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
      {items.map((p) => {
        const flower = getFlowerById(p.flowerId)
        if (flower && HAS_OWN_STEM.has(flower.shape)) return null

        // Anchored at the flower's own center (p.x, p.y), optionally nudged by
        // a shape-specific local offset that's rotated along with the flower —
        // the center itself is the CSS transform-origin for rotate/scale, so it
        // never moves as the flower spins or resizes, which is what keeps the
        // stem attached under any angle. A fixed unrotated offset (the old
        // behaviour) only lined up when rotation was 0, which is why rotated
        // or resized flowers used to look detached from their stem.
        const localOffset = (flower && LOCAL_BASE_OFFSET[flower.shape]) ?? 0
        const offsetPx = (localOffset / 100) * FLOWER_BOX_PX * p.scale
        const angle = (p.rotation * Math.PI) / 180
        const dxPx = -offsetPx * Math.sin(angle)
        const dyPx = offsetPx * Math.cos(angle)
        const startX = p.x + (dxPx / CANVAS_PX.width) * 100
        const startY = p.y + (dyPx / CANVAS_PX.height) * 100

        const midX = (startX + NECK_X) / 2
        const midY = (startY + NECK_Y) / 2 + 6
        return (
          <path
            key={p.uid}
            d={`M ${startX} ${startY} Q ${midX} ${midY} ${NECK_X} ${NECK_Y}`}
            fill="none"
            stroke="#83BC70"
            strokeWidth="0.8"
            opacity="0.8"
          />
        )
      })}
    </svg>
  )
}
