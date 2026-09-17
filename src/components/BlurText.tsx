import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type BlurTextProps = {
  text: string
  className?: string
  delay?: number
}

/** Word-by-word blur-in, triggered the first time the block scrolls into view. */
export default function BlurText({ text, className, delay = 100 }: BlurTextProps) {
  const containerRef = useRef<HTMLParagraphElement | null>(null)
  const [inView, setInView] = useState(false)
  const words = text.split(' ')

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <p
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: '0.1em',
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            inView
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: 50 }
          }
          transition={{ duration: 0.7, ease: 'easeOut', delay: (i * delay) / 1000 }}
          style={{ display: 'inline-block', marginRight: '0.28em', willChange: 'transform, filter, opacity' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
