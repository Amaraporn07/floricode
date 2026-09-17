import { useCallback, useMemo, useState } from 'react'
import type { PlacedFlower } from '../data/types'
import type {
  ArrangementStyleId,
  RibbonColorId,
  RibbonFabricId,
  RibbonPositionId,
  RibbonSizeId,
  WrapColorId,
  WrapFoldId,
  WrapPatternId,
} from '../data/options'
import { computeAutoLayout } from '../lib/layout'
import { computeBouquetMeaning } from '../lib/meaning'

export interface BouquetState {
  placed: PlacedFlower[]
  style: ArrangementStyleId
  wrapColor: WrapColorId
  wrapPattern: WrapPatternId
  wrapFold: WrapFoldId
  ribbonFabric: RibbonFabricId
  ribbonColor: RibbonColorId
  ribbonPosition: RibbonPositionId
  ribbonSize: RibbonSizeId
  message: string
  showCard: boolean
}

const DEFAULT_STATE: BouquetState = {
  placed: [],
  style: 'compact',
  wrapColor: 'cream',
  wrapPattern: 'craft',
  wrapFold: 'cone',
  ribbonFabric: 'satin',
  ribbonColor: 'peach',
  ribbonPosition: 'neck',
  ribbonSize: 'medium',
  message: '',
  showCard: false,
}

let uidCounter = 0
const nextUid = () => `pf-${Date.now()}-${uidCounter++}`

export function encodeBouquet(state: BouquetState): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(state)))
  } catch {
    return ''
  }
}

export function decodeBouquet(code: string): BouquetState | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(code)))
    if (parsed && Array.isArray(parsed.placed)) return parsed as BouquetState
    return null
  } catch {
    return null
  }
}

export function useBouquet(initial?: BouquetState) {
  const [state, setState] = useState<BouquetState>(initial ?? DEFAULT_STATE)
  const [selectedUid, setSelectedUid] = useState<string | null>(null)

  const addFlower = useCallback((flowerId: string) => {
    setState((s) => {
      const layout = computeAutoLayout(s.placed.length + 1, s.style)
      const pos = layout[layout.length - 1]
      const placed: PlacedFlower = {
        uid: nextUid(),
        flowerId,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        rotationY: pos.rotationY,
        tilt: pos.tilt,
        scale: pos.scale,
      }
      return { ...s, placed: [...s.placed, placed] }
    })
  }, [])

  const removeFlower = useCallback((uid: string) => {
    setState((s) => ({ ...s, placed: s.placed.filter((p) => p.uid !== uid) }))
    setSelectedUid((cur) => (cur === uid ? null : cur))
  }, [])

  const updateFlower = useCallback((uid: string, patch: Partial<PlacedFlower>) => {
    setState((s) => ({
      ...s,
      placed: s.placed.map((p) => (p.uid === uid ? { ...p, ...patch } : p)),
    }))
  }, [])

  const autoArrange = useCallback((style?: ArrangementStyleId) => {
    setState((s) => {
      const useStyle = style ?? s.style
      const layout = computeAutoLayout(s.placed.length, useStyle)
      return {
        ...s,
        style: useStyle,
        placed: s.placed.map((p, i) => ({
          ...p,
          x: layout[i].x,
          y: layout[i].y,
          z: layout[i].z,
          rotationY: layout[i].rotationY,
          tilt: layout[i].tilt,
          scale: layout[i].scale,
        })),
      }
    })
  }, [])

  const setStyle = useCallback(
    (style: ArrangementStyleId) => {
      autoArrange(style)
    },
    [autoArrange],
  )

  const setWrap = useCallback((patch: Partial<Pick<BouquetState, 'wrapColor' | 'wrapPattern' | 'wrapFold'>>) => {
    setState((s) => {
      const next = { ...s }
      if (patch.wrapColor !== undefined) next.wrapColor = patch.wrapColor
      if (patch.wrapPattern !== undefined) next.wrapPattern = patch.wrapPattern
      if (patch.wrapFold !== undefined) next.wrapFold = patch.wrapFold
      return next
    })
  }, [])

  const setRibbon = useCallback(
    (patch: Partial<Pick<BouquetState, 'ribbonFabric' | 'ribbonColor' | 'ribbonPosition' | 'ribbonSize'>>) => {
      setState((s) => {
        const next = { ...s }
        if (patch.ribbonFabric !== undefined) next.ribbonFabric = patch.ribbonFabric
        if (patch.ribbonColor !== undefined) next.ribbonColor = patch.ribbonColor
        if (patch.ribbonPosition !== undefined) next.ribbonPosition = patch.ribbonPosition
        if (patch.ribbonSize !== undefined) next.ribbonSize = patch.ribbonSize
        return next
      })
    },
    [],
  )

  const setMessage = useCallback((message: string) => {
    setState((s) => ({ ...s, message }))
  }, [])

  const setShowCard = useCallback((showCard: boolean) => {
    setState((s) => ({ ...s, showCard }))
  }, [])

  const toggleFoliage = useCallback(
    (flowerId: string) => {
      setState((s) => {
        const existing = s.placed.find((p) => p.flowerId === flowerId)
        if (existing) {
          return { ...s, placed: s.placed.filter((p) => p.uid !== existing.uid) }
        }
        const layout = computeAutoLayout(s.placed.length + 1, s.style)
        const pos = layout[layout.length - 1]
        const placed: PlacedFlower = {
          uid: nextUid(),
          flowerId,
          x: pos.x,
          y: pos.y,
          z: pos.z,
          rotationY: pos.rotationY,
          tilt: pos.tilt,
          scale: pos.scale,
        }
        return { ...s, placed: [...s.placed, placed] }
      })
    },
    [],
  )

  const clearAll = useCallback(() => {
    setState(DEFAULT_STATE)
    setSelectedUid(null)
  }, [])

  const meaning = useMemo(() => computeBouquetMeaning(state.placed), [state.placed])

  return {
    state,
    selectedUid,
    setSelectedUid,
    addFlower,
    removeFlower,
    updateFlower,
    autoArrange,
    setStyle,
    setWrap,
    setRibbon,
    setMessage,
    setShowCard,
    toggleFoliage,
    clearAll,
    meaning,
  }
}

export type UseBouquetReturn = ReturnType<typeof useBouquet>
