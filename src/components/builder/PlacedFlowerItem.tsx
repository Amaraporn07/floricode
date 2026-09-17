import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { PlacedFlower } from '../../data/types'
import { getFlowerById } from '../../data/flowers'
import FlowerSVG from '../flowers/FlowerSVG'

interface PlacedFlowerItemProps {
  item: PlacedFlower
  selected: boolean
  onSelect: () => void
  onDrag: (dx: number, dy: number) => void
  onRemove: () => void
}

const BASE_SIZE = 72

/**
 * Manually handled (not framer-motion `drag`) on purpose: motion's drag prop
 * tracks its own internal x/y transform that never resets to zero, so once we
 * also bake the offset into left/top on drag end, the two would compound and
 * the flower would jump on every subsequent drag. Plain pointer events avoid
 * that residual-transform trap and keep left/top as the single source of truth.
 */
export default function PlacedFlowerItem({ item, selected, onSelect, onDrag, onRemove }: PlacedFlowerItemProps) {
  const flower = getFlowerById(item.flowerId)
  const dragging = useRef(false)
  const lastPoint = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  if (!flower) return null

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    onSelect()
    dragging.current = true
    setIsDragging(true)
    lastPoint.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPoint.current.x
    const dy = e.clientY - lastPoint.current.y
    lastPoint.current = { x: e.clientX, y: e.clientY }
    if (dx !== 0 || dy !== 0) onDrag(dx, dy)
  }

  const endDrag = () => {
    dragging.current = false
    setIsDragging(false)
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        position: 'absolute',
        left: `${item.x}%`,
        top: `${item.y}%`,
        zIndex: item.z,
        width: BASE_SIZE,
        height: BASE_SIZE,
        touchAction: 'none',
        transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className={`relative h-full w-full rounded-full ${selected ? 'ring-4 ring-peach-400/70' : ''}`}>
        <FlowerSVG
          shape={flower.shape}
          petalColor={flower.petalColor}
          centerColor={flower.centerColor}
          petalCount={flower.petalCount}
          className="h-full w-full drop-shadow-[0_4px_6px_rgba(74,63,53,0.25)]"
        />
        {selected && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            aria-label="ลบดอกไม้นี้"
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink shadow-card"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
