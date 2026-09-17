import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'

interface DigitalCardModalProps {
  imageUrl: string | null
  message: string
  onClose: () => void
}

export default function DigitalCardModal({ imageUrl, message, onClose }: DigitalCardModalProps) {
  const handleDownload = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'floricode-greeting-card.png'
    a.click()
  }

  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20, scale: 0.96 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0, scale: 1 }}
            exit={{ filter: 'blur(10px)', opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-4xl bg-cream p-6 shadow-soft"
          >
            <button
              onClick={onClose}
              aria-label="ปิด"
              className="absolute right-4 top-4 rounded-full bg-white/70 p-2 text-ink/60 hover:bg-white hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="mb-4 text-center font-heading text-2xl text-ink">การ์ดอวยพรดิจิทัล</h3>

            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-card">
              <img src={imageUrl} alt="ช่อดอกไม้ของคุณ" className="w-full" />
              {message.trim() && (
                <div className="bg-white p-4 text-center">
                  <p className="font-heading text-lg italic text-ink">"{message}"</p>
                </div>
              )}
            </div>

            <button
              onClick={handleDownload}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 font-body text-sm font-medium text-cream hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              ดาวน์โหลดการ์ด
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
