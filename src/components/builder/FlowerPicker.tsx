import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { FLOWERS } from '../../data/flowers'
import { MOOD_LABELS, type MoodTone } from '../../data/types'
import FlowerSVG from '../flowers/FlowerSVG'

interface FlowerPickerProps {
  onAdd: (flowerId: string) => void
}

const MOODS = Object.keys(MOOD_LABELS) as MoodTone[]

export default function FlowerPicker({ onAdd }: FlowerPickerProps) {
  const [mood, setMood] = useState<MoodTone | 'all'>('all')

  const flowers = useMemo(
    () => FLOWERS.filter((f) => !f.isFoliage && (mood === 'all' || f.moods.includes(mood))),
    [mood],
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setMood('all')}
          className={`rounded-full border-2 px-3 py-1 text-xs font-body transition-colors ${
            mood === 'all' ? 'border-peach-400 bg-peach-200 text-ink' : 'border-peach-100 bg-white/70 text-ink/60'
          }`}
        >
          ทั้งหมด
        </button>
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`rounded-full border-2 px-3 py-1 text-xs font-body transition-colors ${
              mood === m ? 'border-peach-400 bg-peach-200 text-ink' : 'border-peach-100 bg-white/70 text-ink/60'
            }`}
          >
            {MOOD_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
        {flowers.map((f) => (
          <button
            key={f.id}
            onClick={() => onAdd(f.id)}
            title={`เพิ่ม ${f.nameTh}`}
            className="group relative flex flex-col items-center rounded-2xl bg-white/70 p-2 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <FlowerSVG shape={f.shape} petalColor={f.petalColor} centerColor={f.centerColor} petalCount={f.petalCount} className="h-10 w-10" />
            <span className="mt-1 line-clamp-1 font-body text-[10px] text-ink/70">{f.nameTh}</span>
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-peach-400 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Plus className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
