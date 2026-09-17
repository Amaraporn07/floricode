import { motion } from 'framer-motion'
import { BookOpen, Flower2 } from 'lucide-react'

export type ViewId = 'dictionary' | 'builder'

interface NavProps {
  view: ViewId
  onChange: (view: ViewId) => void
}

const TABS: { id: ViewId; label: string; icon: typeof BookOpen }[] = [
  { id: 'dictionary', label: 'พจนานุกรมดอกไม้', icon: BookOpen },
  { id: 'builder', label: 'จัดช่อดอกไม้', icon: Flower2 },
]

export default function Nav({ view, onChange }: NavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-peach-100/60 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-peach-200 text-ink">
            <Flower2 className="h-5 w-5" />
          </span>
          <span className="font-heading text-xl italic text-ink">FloriCode</span>
        </div>

        <nav className="flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-card">
          {TABS.map((tab) => {
            const active = view === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                  active ? 'text-ink' : 'text-ink/60'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-peach-200"
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
