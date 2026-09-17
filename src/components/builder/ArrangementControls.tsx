import { ARRANGEMENT_STYLES, type ArrangementStyleId } from '../../data/options'
import PanelSection from './PanelSection'

interface ArrangementControlsProps {
  value: ArrangementStyleId
  onChange: (style: ArrangementStyleId) => void
}

export default function ArrangementControls({ value, onChange }: ArrangementControlsProps) {
  return (
    <PanelSection title="รูปแบบการจัดช่อ">
      <div className="grid grid-cols-1 gap-2">
        {ARRANGEMENT_STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`rounded-2xl border-2 p-3 text-left transition-colors ${
              value === s.id ? 'border-peach-400 bg-peach-50' : 'border-transparent bg-white/70 hover:border-peach-200'
            }`}
          >
            <p className="font-body text-sm font-medium text-ink">{s.label}</p>
            <p className="font-body text-xs text-ink/50">{s.description}</p>
          </button>
        ))}
      </div>
    </PanelSection>
  )
}
