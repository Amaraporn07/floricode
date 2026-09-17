import type { ReactNode } from 'react'

interface PanelSectionProps {
  title: string
  children: ReactNode
}

export default function PanelSection({ title, children }: PanelSectionProps) {
  return (
    <section className="rounded-3xl bg-white/60 p-4 shadow-card">
      <h3 className="mb-3 font-heading text-base text-ink">{title}</h3>
      {children}
    </section>
  )
}
