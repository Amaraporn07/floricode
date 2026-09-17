import {
  RIBBON_COLORS,
  type RibbonColorId,
  type RibbonFabricId,
  type RibbonPositionId,
  type RibbonSizeId,
} from '../../data/options'

interface RibbonBowProps {
  color: RibbonColorId
  fabric: RibbonFabricId
  position: RibbonPositionId
  size: RibbonSizeId
}

const SIZE_PX: Record<RibbonSizeId, number> = { small: 34, medium: 46, large: 60 }
const BAND_HEIGHT: Record<RibbonSizeId, string> = { small: '7%', medium: '10%', large: '13%' }

const POSITION_STYLE: Record<RibbonPositionId, { top: string; left: string; rotate: string }> = {
  neck: { top: '52%', left: '50%', rotate: '0deg' },
  middle: { top: '68%', left: '50%', rotate: '0deg' },
  side: { top: '58%', left: '38%', rotate: '-8deg' },
}

export default function RibbonBow({ color, fabric, position, size }: RibbonBowProps) {
  const colorOption = RIBBON_COLORS.find((c) => c.id === color) ?? RIBBON_COLORS[0]
  const pos = POSITION_STYLE[position]
  const bowPx = SIZE_PX[size]

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top: pos.top, left: pos.left, transform: `translate(-50%, -50%) rotate(${pos.rotate})`, width: '64%' }}
    >
      {/* band */}
      <div
        className="w-full rounded-sm"
        style={{
          height: BAND_HEIGHT[size],
          backgroundColor: colorOption.hex,
          backgroundImage:
            fabric === 'satin'
              ? 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.06) 100%)'
              : 'radial-gradient(rgba(74,63,53,0.08) 1px, transparent 1px)',
          backgroundSize: fabric === 'linen' ? '6px 6px' : undefined,
          boxShadow: fabric === 'satin' ? '0 2px 6px rgba(74,63,53,0.2)' : 'none',
        }}
      />

      {/* bow */}
      <svg
        viewBox="0 0 100 60"
        width={bowPx}
        height={bowPx * 0.6}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <path d="M50 30 L8 8 C0 4 0 40 8 40 Z" fill={colorOption.hex} stroke="rgba(74,63,53,0.3)" strokeWidth="1.5" />
        <path d="M50 30 L92 8 C100 4 100 40 92 40 Z" fill={colorOption.hex} stroke="rgba(74,63,53,0.3)" strokeWidth="1.5" />
        <circle cx="50" cy="30" r="10" fill={colorOption.hex} stroke="rgba(74,63,53,0.3)" strokeWidth="1.5" />
        {fabric === 'satin' && <ellipse cx="46" cy="26" rx="3" ry="5" fill="rgba(255,255,255,0.5)" />}
      </svg>
    </div>
  )
}
