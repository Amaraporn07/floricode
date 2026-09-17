import { motion } from 'framer-motion'
import type { Flower } from '../../data/types'
import FlowerSVG from '../flowers/FlowerSVG'

interface FlowerCardProps {
  flower: Flower
  onClick: () => void
}

export default function FlowerCard({ flower, onClick }: FlowerCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ filter: 'blur(8px)', opacity: 0, y: 16 }}
      whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center rounded-3xl bg-white/70 p-5 text-left shadow-card transition-shadow hover:shadow-soft"
    >
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cream">
        <FlowerSVG shape={flower.shape} petalColor={flower.petalColor} centerColor={flower.centerColor} petalCount={flower.petalCount} className="h-20 w-20" />
      </div>
      <h3 className="mt-4 font-heading text-xl text-ink">{flower.nameTh}</h3>
      <p className="font-body text-xs text-ink/50">
        {flower.nameEn} · <span className="italic">{flower.nameSci}</span>
      </p>
      <p className="mt-2 line-clamp-2 text-center font-body text-xs text-ink/70">{flower.meaningShort}</p>
    </motion.button>
  )
}
