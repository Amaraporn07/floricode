import { FLOWERS } from '../../data/flowers'
import FlowerSVG from '../flowers/FlowerSVG'
import PanelSection from './PanelSection'
import type { PlacedFlower } from '../../data/types'

interface ExtrasControlsProps {
  message: string
  showCard: boolean
  placed: PlacedFlower[]
  onMessageChange: (v: string) => void
  onShowCardChange: (v: boolean) => void
  onToggleFoliage: (flowerId: string) => void
}

const FOLIAGE = FLOWERS.filter((f) => f.isFoliage)

export default function ExtrasControls({
  message,
  showCard,
  placed,
  onMessageChange,
  onShowCardChange,
  onToggleFoliage,
}: ExtrasControlsProps) {
  return (
    <PanelSection title="การตกแต่งเพิ่มเติม">
      <div className="space-y-4">
        <div>
          <p className="mb-2 font-body text-xs font-medium text-ink/60">พร็อพตกแต่ง</p>
          <div className="flex flex-wrap gap-2">
            {FOLIAGE.map((f) => {
              const active = placed.some((p) => p.flowerId === f.id)
              return (
                <button
                  key={f.id}
                  onClick={() => onToggleFoliage(f.id)}
                  className={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-body ${
                    active ? 'border-leaf-400 bg-leaf-100 text-ink' : 'border-peach-100 bg-white/70 text-ink/60'
                  }`}
                >
                  <FlowerSVG shape={f.shape} petalColor={f.petalColor} centerColor={f.centerColor} className="h-5 w-5" />
                  {f.nameTh}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center justify-between font-body text-xs font-medium text-ink/60">
            การ์ดข้อความ
            <input type="checkbox" checked={showCard} onChange={(e) => onShowCardChange(e.target.checked)} className="h-4 w-4 accent-peach-400" />
          </label>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            maxLength={120}
            rows={3}
            placeholder="เขียนข้อความสั้นๆ ฝากถึงคนพิเศษ..."
            className="w-full resize-none rounded-2xl border-2 border-peach-100 bg-white/80 p-3 font-body text-xs text-ink outline-none focus:border-peach-300"
          />
        </div>
      </div>
    </PanelSection>
  )
}
