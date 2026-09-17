import { Trash2 } from 'lucide-react'
import type { PlacedFlower } from '../../data/types'
import { getFlowerById } from '../../data/flowers'
import PanelSection from './PanelSection'

interface SelectedFlowerControlsProps {
  item: PlacedFlower
  onChange: (patch: Partial<PlacedFlower>) => void
  onRemove: () => void
}

const MIN_STEM = 0.25
const MAX_STEM = 2.3

export default function SelectedFlowerControls({ item, onChange, onRemove }: SelectedFlowerControlsProps) {
  const flower = getFlowerById(item.flowerId)

  // The stem always runs straight from the flower's position to the neck
  // point at the origin, so its length is just that vector's length —
  // "trimming" it means rescaling x/y/z together along the same direction,
  // which also naturally pulls the flower down and inward as it shortens,
  // the way a real cut stem nestles closer to the rest of the bunch.
  const stemLength = Math.sqrt(item.x ** 2 + item.y ** 2 + item.z ** 2) || 0.01

  const handleStemLength = (nextLength: number) => {
    const factor = nextLength / stemLength
    onChange({ x: item.x * factor, y: item.y * factor, z: item.z * factor })
  }

  return (
    <PanelSection title={`ปรับแต่ง: ${flower?.nameTh ?? ''}`}>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between font-body text-xs text-ink/60">
            <span>ขนาด</span>
            <span>{Math.round(item.scale * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.8}
            step={0.05}
            value={item.scale}
            onChange={(e) => onChange({ scale: Number(e.target.value) })}
            className="w-full accent-peach-400"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between font-body text-xs text-ink/60">
            <span>ความยาวก้าน (ตัดก้าน)</span>
            <span>{Math.round((stemLength / MAX_STEM) * 100)}%</span>
          </div>
          <input
            type="range"
            min={MIN_STEM}
            max={MAX_STEM}
            step={0.02}
            value={stemLength}
            onChange={(e) => handleStemLength(Number(e.target.value))}
            className="w-full accent-peach-400"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between font-body text-xs text-ink/60">
            <span>หันไปทาง (รอบตัว)</span>
            <span>{Math.round(item.rotationY)}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={item.rotationY}
            onChange={(e) => onChange({ rotationY: Number(e.target.value) })}
            className="w-full accent-peach-400"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between font-body text-xs text-ink/60">
            <span>มุมเอียงของดอก</span>
            <span>{Math.round(item.tilt)}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={70}
            step={1}
            value={item.tilt}
            onChange={(e) => onChange({ tilt: Number(e.target.value) })}
            className="w-full accent-peach-400"
          />
        </div>

        <button
          onClick={onRemove}
          className="flex items-center gap-1.5 rounded-full border-2 border-blush-200 bg-blush-50 px-3 py-1.5 font-body text-xs text-blush-500 transition-colors hover:bg-blush-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          ลบดอกไม้นี้ออกจากช่อ
        </button>
      </div>
    </PanelSection>
  )
}
