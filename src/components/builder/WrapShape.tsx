import { WRAP_COLORS, WRAP_PATTERNS, type WrapColorId, type WrapFoldId, type WrapPatternId } from '../../data/options'

interface WrapShapeProps {
  color: WrapColorId
  pattern: WrapPatternId
  fold: WrapFoldId
}

const CLIP_PATHS: Record<WrapFoldId, string> = {
  cone: 'polygon(50% 100%, 100% 18%, 82% 0%, 18% 0%, 0% 18%)',
  straight: 'polygon(18% 0%, 82% 0%, 94% 100%, 6% 100%)',
  twoTone: 'polygon(50% 100%, 100% 18%, 82% 0%, 18% 0%, 0% 18%)',
}

export default function WrapShape({ color, pattern, fold }: WrapShapeProps) {
  const colorOption = WRAP_COLORS.find((c) => c.id === color) ?? WRAP_COLORS[0]
  const patternOption = WRAP_PATTERNS.find((p) => p.id === pattern) ?? WRAP_PATTERNS[0]
  const isTranslucent = fold === 'straight'

  return (
    <div className="absolute bottom-0 left-1/2 h-[48%] w-[76%] -translate-x-1/2">
      {fold === 'twoTone' && (
        <div
          className={`absolute inset-0 translate-x-[6%] translate-y-[3%] scale-105 ${patternOption.className}`}
          style={{ clipPath: CLIP_PATHS.cone, backgroundColor: colorOption.hexSecondary }}
        />
      )}
      <div
        className={`absolute inset-0 ${patternOption.className} ${isTranslucent ? 'paper-translucent' : ''}`}
        style={{ clipPath: CLIP_PATHS[fold], backgroundColor: colorOption.hex }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: CLIP_PATHS[fold], boxShadow: 'inset 0 -14px 24px -10px rgba(74,63,53,0.18)' }}
      />
    </div>
  )
}
