import { FEELING_LABELS, type FeelingTag, type PlacedFlower } from '../data/types'
import { getFlowerById } from '../data/flowers'

export interface BouquetMeaning {
  topFeelings: { tag: FeelingTag; count: number }[]
  sentence: string
  flowerNames: string[]
}

/**
 * Aggregates the meaning of a bouquet from every flower placed in it: each
 * occurrence of a flower votes for its feeling tags, and the most frequent
 * feelings become the bouquet's headline meaning.
 */
export function computeBouquetMeaning(placed: PlacedFlower[]): BouquetMeaning {
  const counts = new Map<FeelingTag, number>()
  const flowerNameSet = new Set<string>()

  for (const p of placed) {
    const flower = getFlowerById(p.flowerId)
    if (!flower) continue
    flowerNameSet.add(flower.nameTh)
    for (const tag of flower.feelings) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  const topFeelings = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => ({ tag, count }))

  const flowerNames = [...flowerNameSet]

  if (flowerNames.length === 0) {
    return {
      topFeelings: [],
      sentence: 'เพิ่มดอกไม้ลงในช่อเพื่อดูความหมายรวมของช่อดอกไม้นี้',
      flowerNames: [],
    }
  }

  const feelingText = topFeelings.map((f) => FEELING_LABELS[f.tag]).join(' และ ')
  const sentence = `ช่อดอกไม้นี้ประกอบด้วย ${flowerNames.join(', ')} — สื่อถึงความรู้สึก${feelingText ? ` "${feelingText}"` : ''} เป็นหลัก`

  return { topFeelings, sentence, flowerNames }
}
