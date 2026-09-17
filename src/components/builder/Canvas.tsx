import { forwardRef, useRef } from 'react'
import type { PlacedFlower } from '../../data/types'
import type { BouquetState } from '../../hooks/useBouquet'
import WrapShape from './WrapShape'
import RibbonBow from './RibbonBow'
import StemLines from './StemLines'
import PlacedFlowerItem from './PlacedFlowerItem'
import MessageCard from './MessageCard'

interface CanvasProps {
  state: BouquetState
  selectedUid: string | null
  onSelect: (uid: string | null) => void
  onMove: (uid: string, item: PlacedFlower, dxPx: number, dyPx: number) => void
  onRemove: (uid: string) => void
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(function Canvas(
  { state, selectedUid, onSelect, onMove, onRemove },
  ref,
) {
  const innerRef = useRef<HTMLDivElement | null>(null)

  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
  }

  return (
    // The captured node (ref) must own no auto-margin/centering of its own — when
    // it sat directly on the `mx-auto max-w-md` box inside the wide desktop grid
    // column, html-to-image's clone mis-resolved the percentage-positioned
    // children (wrap/ribbon/flowers) against the wrong containing block and
    // rendered them shifted off-frame. Centering now happens on this outer wrapper
    // instead, so the ref'd element is just a plain 100%-of-parent box.
    <div className="mx-auto w-full max-w-md">
      <div
        ref={setRefs}
        onClick={() => onSelect(null)}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl bg-gradient-to-b from-cream via-cream to-beige-100 shadow-soft"
      >
        <WrapShape color={state.wrapColor} pattern={state.wrapPattern} fold={state.wrapFold} />
        <StemLines items={state.placed} />
        <RibbonBow color={state.ribbonColor} fabric={state.ribbonFabric} position={state.ribbonPosition} size={state.ribbonSize} />

        {state.placed.map((item) => (
          <PlacedFlowerItem
            key={item.uid}
            item={item}
            selected={selectedUid === item.uid}
            onSelect={() => onSelect(item.uid)}
            onDrag={(dx, dy) => onMove(item.uid, item, dx, dy)}
            onRemove={() => onRemove(item.uid)}
          />
        ))}

        {state.placed.length === 0 && (
          <p className="absolute left-1/2 top-[30%] w-48 -translate-x-1/2 text-center font-body text-xs text-ink/40">
            เลือกดอกไม้จากแผงด้านขวาเพื่อเริ่มจัดช่อของคุณ
          </p>
        )}

        {state.showCard && <MessageCard message={state.message} />}
      </div>
    </div>
  )
})

export default Canvas
