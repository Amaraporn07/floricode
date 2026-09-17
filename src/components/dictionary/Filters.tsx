import {
  COLOR_TONE_LABELS,
  COLOR_TONE_SWATCH,
  FEELING_LABELS,
  OCCASION_LABELS,
  type ColorTone,
  type FeelingTag,
  type Occasion,
} from '../../data/types'

interface FiltersProps {
  activeColors: ColorTone[]
  activeOccasions: Occasion[]
  activeFeelings: FeelingTag[]
  onToggleColor: (c: ColorTone) => void
  onToggleOccasion: (o: Occasion) => void
  onToggleFeeling: (f: FeelingTag) => void
  onReset: () => void
}

function chipClass(active: boolean) {
  return [
    'rounded-full border-2 px-3 py-1.5 text-xs font-body transition-colors',
    active ? 'border-peach-400 bg-peach-200 text-ink' : 'border-peach-100 bg-white/70 text-ink/60 hover:border-peach-200',
  ].join(' ')
}

export default function Filters({
  activeColors,
  activeOccasions,
  activeFeelings,
  onToggleColor,
  onToggleOccasion,
  onToggleFeeling,
  onReset,
}: FiltersProps) {
  const hasActive = activeColors.length + activeOccasions.length + activeFeelings.length > 0

  return (
    <div className="space-y-4 rounded-3xl bg-white/60 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg text-ink">ตัวกรอง</h3>
        {hasActive && (
          <button onClick={onReset} className="font-body text-xs text-peach-500 underline-offset-2 hover:underline">
            ล้างตัวกรองทั้งหมด
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 font-body text-xs font-medium text-ink/60">โทนสี</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(COLOR_TONE_LABELS) as ColorTone[]).map((c) => (
            <button key={c} onClick={() => onToggleColor(c)} className={chipClass(activeColors.includes(c))}>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: COLOR_TONE_SWATCH[c] }} />
              {COLOR_TONE_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-body text-xs font-medium text-ink/60">โอกาสพิเศษ</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(OCCASION_LABELS) as Occasion[]).map((o) => (
            <button key={o} onClick={() => onToggleOccasion(o)} className={chipClass(activeOccasions.includes(o))}>
              {OCCASION_LABELS[o]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-body text-xs font-medium text-ink/60">หมวดหมู่ความรู้สึก</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FEELING_LABELS) as FeelingTag[]).map((f) => (
            <button key={f} onClick={() => onToggleFeeling(f)} className={chipClass(activeFeelings.includes(f))}>
              {FEELING_LABELS[f]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
