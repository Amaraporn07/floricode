import { WRAP_COLORS, WRAP_FOLDS, WRAP_PATTERNS, type WrapColorId, type WrapFoldId, type WrapPatternId } from '../../data/options'
import PanelSection from './PanelSection'

interface WrappingControlsProps {
  color: WrapColorId
  pattern: WrapPatternId
  fold: WrapFoldId
  onChange: (patch: { color?: WrapColorId; pattern?: WrapPatternId; fold?: WrapFoldId }) => void
}

export default function WrappingControls({ color, pattern, fold, onChange }: WrappingControlsProps) {
  return (
    <PanelSection title="กระดาษห่อช่อดอกไม้">
      <div className="space-y-4">
        <div>
          <p className="mb-2 font-body text-xs font-medium text-ink/60">สีกระดาษ</p>
          <div className="flex flex-wrap gap-2">
            {WRAP_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange({ color: c.id })}
                title={c.label}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${
                  color === c.id ? 'scale-110 border-ink/60' : 'border-white/60'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-body text-xs font-medium text-ink/60">ลวดลาย</p>
          <div className="flex flex-wrap gap-2">
            {WRAP_PATTERNS.map((p) => (
              <button
                key={p.id}
                onClick={() => onChange({ pattern: p.id })}
                className={`rounded-full border-2 px-3 py-1 text-xs font-body ${
                  pattern === p.id ? 'border-peach-400 bg-peach-100 text-ink' : 'border-peach-100 bg-white/70 text-ink/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-body text-xs font-medium text-ink/60">รูปแบบการพับห่อ</p>
          <div className="flex flex-wrap gap-2">
            {WRAP_FOLDS.map((f) => (
              <button
                key={f.id}
                onClick={() => onChange({ fold: f.id })}
                className={`rounded-2xl border-2 px-3 py-2 text-left text-xs font-body ${
                  fold === f.id ? 'border-peach-400 bg-peach-50' : 'border-transparent bg-white/70'
                }`}
              >
                <span className="block font-medium text-ink">{f.label}</span>
                <span className="text-ink/50">{f.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PanelSection>
  )
}
