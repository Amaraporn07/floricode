import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { COLOR_TONE_LABELS, FEELING_LABELS, OCCASION_LABELS, type Flower } from '../../data/types'
import FlowerSVG from '../flowers/FlowerSVG'

interface FlowerModalProps {
  flower: Flower | null
  onClose: () => void
}

export default function FlowerModal({ flower, onClose }: FlowerModalProps) {
  return (
    <AnimatePresence>
      {flower && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 24, scale: 0.96 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0, scale: 1 }}
            exit={{ filter: 'blur(10px)', opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-4xl bg-cream p-7 shadow-soft"
          >
            <button
              onClick={onClose}
              aria-label="ปิด"
              className="absolute right-5 top-5 rounded-full bg-white/70 p-2 text-ink/60 transition-colors hover:bg-white hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-card">
                <FlowerSVG
                  shape={flower.shape}
                  petalColor={flower.petalColor}
                  centerColor={flower.centerColor}
                  petalCount={flower.petalCount}
                  className="h-24 w-24"
                />
              </div>
              <h2 className="mt-4 font-heading text-3xl text-ink">{flower.nameTh}</h2>
              <p className="font-body text-sm text-ink/50">
                {flower.nameEn} · <span className="italic">{flower.nameSci}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {flower.feelings.map((f) => (
                <span key={f} className="rounded-full bg-blush-100 px-3 py-1 font-body text-xs text-ink/70">
                  {FEELING_LABELS[f]}
                </span>
              ))}
              {flower.colorTones.map((c) => (
                <span key={c} className="rounded-full bg-leaf-100 px-3 py-1 font-body text-xs text-ink/70">
                  {COLOR_TONE_LABELS[c]}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-4 font-body text-sm leading-relaxed text-ink/80">
              <p className="rounded-2xl bg-peach-50 p-4 font-medium text-ink">{flower.meaningShort}</p>
              <div>
                <h4 className="mb-1 font-heading text-base text-ink">ประวัติและที่มา</h4>
                <p>{flower.meaningFull}</p>
              </div>
              <div>
                <h4 className="mb-1 font-heading text-base text-ink">ถิ่นกำเนิด</h4>
                <p>{flower.origin}</p>
              </div>
              <div>
                <h4 className="mb-1 font-heading text-base text-ink">เหมาะกับโอกาส</h4>
                <div className="flex flex-wrap gap-2">
                  {flower.occasions.map((o) => (
                    <span key={o} className="rounded-full bg-beige-100 px-3 py-1 text-xs text-ink/70">
                      {OCCASION_LABELS[o]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
