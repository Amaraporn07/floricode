import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Nav, { type ViewId } from './components/Nav'
import DictionaryPage from './pages/DictionaryPage'

// The bouquet builder pulls in Three.js for its 3D scene, which is a sizeable
// chunk — split it into its own bundle so the flower dictionary (the default
// view) never has to download it.
const BuilderPage = lazy(() => import('./pages/BuilderPage'))

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
          {view === 'dictionary' ? (
            <DictionaryPage />
          ) : (
            <Suspense
              fallback={
                <div className="flex h-[60vh] items-center justify-center font-body text-sm text-ink/50">กำลังโหลดฉากจัดช่อ 3 มิติ...</div>
              }
            >
              <BuilderPage />
            </Suspense>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
