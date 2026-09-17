import type { PlacedFlower } from '../../data/types'

interface StemLinesProps {
  items: PlacedFlower[]
}

const NECK_X = 50
const NECK_Y = 55

export default function StemLines({ items }: StemLinesProps) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
      {items.map((p) => {
        const startY = p.y + 4
        const midX = (p.x + NECK_X) / 2
        const midY = (startY + NECK_Y) / 2 + 6
        return (
          <path
            key={p.uid}
            d={`M ${p.x} ${startY} Q ${midX} ${midY} ${NECK_X} ${NECK_Y}`}
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
