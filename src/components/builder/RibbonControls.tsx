import {
  RIBBON_COLORS,
  RIBBON_FABRICS,
  RIBBON_POSITIONS,
  RIBBON_SIZES,
  type RibbonColorId,
  type RibbonFabricId,
  type RibbonPositionId,
  type RibbonSizeId,
} from '../../data/options'
import PanelSection from './PanelSection'

interface RibbonControlsProps {
  color: RibbonColorId
  fabric: RibbonFabricId
  position: RibbonPositionId
  size: RibbonSizeId
  onChange: (patch: {
    color?: RibbonColorId
    fabric?: RibbonFabricId
    position?: RibbonPositionId
    size?: RibbonSizeId
  }) => void
}

function segButton(active: boolean) {
  return `rounded-full border-2 px-3 py-1 text-xs font-body ${
    active ? 'border-peach-400 bg-peach-100 text-ink' : 'border-peach-100 bg-white/70 text-ink/60'
  }`
}

export default function RibbonControls({ color, fabric, position, size, onChange }: RibbonControlsProps) {
  return (
    <PanelSection title="ริบบิ้นและโบว์">
      <div className="space-y-4">
        <div>
          <p className="mb-2 font-body text-xs font-medium text-ink/60">สีโบว์</p>
          <div className="flex flex-wrap gap-2">
            {RIBBON_COLORS.map((c) => (
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
          <p className="mb-2 font-body text-xs font-medium text-ink/60">ชนิดผ้า</p>
          <div className="flex flex-wrap gap-2">
            {RIBBON_FABRICS.map((f) => (
              <button key={f.id} onClick={() => onChange({ fabric: f.id })} className={segButton(fabric === f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-body text-xs font-medium text-ink/60">ขนาด</p>
          <div className="flex flex-wrap gap-2">
            {RIBBON_SIZES.map((s) => (
              <button key={s.id} onClick={() => onChange({ size: s.id })} className={segButton(size === s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-body text-xs font-medium text-ink/60">ตำแหน่งการผูก</p>
          <div className="flex flex-wrap gap-2">
            {RIBBON_POSITIONS.map((p) => (
              <button key={p.id} onClick={() => onChange({ position: p.id })} className={segButton(position === p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PanelSection>
  )
}
