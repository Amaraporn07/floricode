import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Nav, { type ViewId } from './components/Nav'
import DictionaryPage from './pages/DictionaryPage'
import BuilderPage from './pages/BuilderPage'

function readInitialView(): ViewId {
  if (typeof window === 'undefined') return 'dictionary'
  const v = new URLSearchParams(window.location.search).get('view')
  return v === 'builder' ? 'builder' : 'dictionary'
}

export default function App() {
  const [view, setView] = useState<ViewId>(readInitialView)

  return (
    <div className="min-h-screen bg-cream">
      <Nav view={view} onChange={setView} />

      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ filter: 'blur(8px)', opacity: 0, y: 12 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          exit={{ filter: 'blur(8px)', opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {view === 'dictionary' ? <DictionaryPage /> : <BuilderPage />}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
