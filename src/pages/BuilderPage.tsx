import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import BlurText from '../components/BlurText'
import Canvas from '../components/builder/Canvas'
import FlowerPicker from '../components/builder/FlowerPicker'
import ArrangementControls from '../components/builder/ArrangementControls'
import WrappingControls from '../components/builder/WrappingControls'
import RibbonControls from '../components/builder/RibbonControls'
import ExtrasControls from '../components/builder/ExtrasControls'
import SelectedFlowerControls from '../components/builder/SelectedFlowerControls'
import SummaryPanel from '../components/builder/SummaryPanel'
import DigitalCardModal from '../components/builder/DigitalCardModal'
import { decodeBouquet, encodeBouquet, useBouquet, type BouquetState } from '../hooks/useBouquet'

function readInitialState(): BouquetState | undefined {
  if (typeof window === 'undefined') return undefined
  const code = new URLSearchParams(window.location.search).get('b')
  if (!code) return undefined
  return decodeBouquet(code) ?? undefined
}

export default function BuilderPage() {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [cardImage, setCardImage] = useState<string | null>(null)

  const {
    state,
    selectedUid,
    setSelectedUid,
    addFlower,
    removeFlower,
    updateFlower,
    bringToFront,
    setStyle,
    setWrap,
    setRibbon,
    setMessage,
    setShowCard,
    toggleFoliage,
    meaning,
  } = useBouquet(readInitialState())

  const selectedItem = state.placed.find((p) => p.uid === selectedUid) ?? null

  const handleMove = (uid: string, item: { x: number; y: number }, dxPx: number, dyPx: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const dxPct = (dxPx / rect.width) * 100
    const dyPct = (dyPx / rect.height) * 100
    updateFlower(uid, {
      x: Math.min(95, Math.max(5, item.x + dxPct)),
      y: Math.min(95, Math.max(5, item.y + dyPct)),
    })
    bringToFront(uid)
  }

  const captureCanvas = async (): Promise<string | null> => {
    if (!canvasRef.current) return null
    setBusy(true)
    try {
      // html-to-image serializes the real DOM into an SVG <foreignObject> and lets
      // the browser rasterize it, so CSS the canvas actually relies on here
      // (clip-path cone shapes, gradients) renders correctly — unlike html2canvas,
      // which reimplements CSS in JS and silently drops clip-path/complex gradients.
      // The explicit width/height must match the live element exactly: the CSS
      // `aspect-[4/5]` that sizes the canvas on screen isn't reliably picked up by
      // the clone, so without pinning these the percentage-positioned flowers and
      // wrap end up laid out against the wrong box and drift off-frame.
      return await toPng(canvasRef.current, {
        backgroundColor: '#FFF8F0',
        pixelRatio: 2,
        skipFonts: true,
      })
    } finally {
      setBusy(false)
    }
  }

  const handleSavePng = async () => {
    const dataUrl = await captureCanvas()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'my-bouquet.png'
    a.click()
  }

  const handleCopyLink = async () => {
    const code = encodeBouquet(state)
    const url = `${window.location.origin}${window.location.pathname}?view=builder&b=${code}`
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      window.prompt('คัดลอกลิงก์นี้ด้วยตนเอง:', url)
    }
  }

  const handleCreateCard = async () => {
    const dataUrl = await captureCanvas()
    if (dataUrl) setCardImage(dataUrl)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <BlurText text="จัดช่อดอกไม้ในแบบของคุณ" className="font-heading text-4xl text-ink sm:text-5xl" />
        <p className="mt-3 font-body text-sm text-ink/60 sm:text-base">
          เลือกดอกไม้ ปรับตำแหน่ง ห่อกระดาษ ผูกโบว์ แล้วส่งต่อความหมายดีๆ ให้คนสำคัญ
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Canvas
            ref={canvasRef}
            state={state}
            selectedUid={selectedUid}
            onSelect={setSelectedUid}
            onMove={handleMove}
            onRemove={removeFlower}
          />
          <p className="mt-3 text-center font-body text-xs text-ink/40">
            ลากดอกไม้เพื่อจัดตำแหน่ง แตะเพื่อเลือกแล้วปรับขนาด/องศาได้ที่แผงด้านขวา
          </p>
        </div>

        <div className="space-y-5">
          {selectedItem && (
            <SelectedFlowerControls
              item={selectedItem}
              onChange={(patch) => updateFlower(selectedItem.uid, patch)}
              onRemove={() => removeFlower(selectedItem.uid)}
            />
          )}

          <section className="rounded-3xl bg-white/60 p-4 shadow-card">
            <h3 className="mb-3 font-heading text-base text-ink">เลือกดอกไม้</h3>
            <FlowerPicker onAdd={addFlower} />
          </section>

          <ArrangementControls value={state.style} onChange={setStyle} />

          <WrappingControls
            color={state.wrapColor}
            pattern={state.wrapPattern}
            fold={state.wrapFold}
            onChange={(patch) =>
              setWrap({
                wrapColor: patch.color,
                wrapPattern: patch.pattern,
                wrapFold: patch.fold,
              })
            }
          />

          <RibbonControls
            color={state.ribbonColor}
            fabric={state.ribbonFabric}
            position={state.ribbonPosition}
            size={state.ribbonSize}
            onChange={(patch) =>
              setRibbon({
                ribbonColor: patch.color,
                ribbonFabric: patch.fabric,
                ribbonPosition: patch.position,
                ribbonSize: patch.size,
              })
            }
          />

          <ExtrasControls
            message={state.message}
            showCard={state.showCard}
            placed={state.placed}
            onMessageChange={setMessage}
            onShowCardChange={setShowCard}
            onToggleFoliage={toggleFoliage}
          />

          <SummaryPanel
            meaning={meaning}
            busy={busy}
            linkCopied={linkCopied}
            onSavePng={handleSavePng}
            onCopyLink={handleCopyLink}
            onCreateCard={handleCreateCard}
          />
        </div>
      </div>

      <DigitalCardModal imageUrl={cardImage} message={state.message} onClose={() => setCardImage(null)} />
    </div>
  )
}
