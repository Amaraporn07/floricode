import type { FlowerShape, PlacedFlower } from '../../data/types'
import { getFlowerById } from '../../data/flowers'

interface StemLinesProps {
  items: PlacedFlower[]
}

const NECK_X = 50
const NECK_Y = 63

// How far below the flower's geometric center (in its own 0-100 local viewBox
// units, before scale) each shape's artwork actually visually "sits" — most
// shapes are drawn radially symmetric around the center so 0 is correct, but
// a few need a nudge:
// - tulip/orchid: the cup/lip is drawn lower in the box, so anchoring dead
//   center would leave a visible gap once the flower is rotated.
// - spike/hyacinthSpike/branch/daisySpray already draw their own stem down to
//   near the bottom of their box; picking up the external connector right at
//   that point (instead of at the flower's center) continues their stem
//   seamlessly instead of drawing a second, differently-angled one through
//   the flower head, while still reaching the shared neck point so the
//   flower doesn't look like it's floating apart from the rest of the bouquet.
const LOCAL_BASE_OFFSET: Partial<Record<FlowerShape, number>> = {
  tulip: 18,
  orchid: 24,
  spike: 42,
  hyacinthSpike: 42,
  branch: 45,
  daisySpray: 45,
}

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
