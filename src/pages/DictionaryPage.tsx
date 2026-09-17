import { useMemo, useState } from 'react'
import { FLOWERS } from '../data/flowers'
import { FEELING_LABELS, OCCASION_LABELS, type ColorTone, type FeelingTag, type Flower, type Occasion } from '../data/types'
import SearchBar from '../components/dictionary/SearchBar'
import Filters from '../components/dictionary/Filters'
import FlowerCard from '../components/dictionary/FlowerCard'
import FlowerModal from '../components/dictionary/FlowerModal'
import BlurText from '../components/BlurText'

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function DictionaryPage() {
  const [query, setQuery] = useState('')
  const [colors, setColors] = useState<ColorTone[]>([])
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [feelings, setFeelings] = useState<FeelingTag[]>([])
  const [selected, setSelected] = useState<Flower | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FLOWERS.filter((f) => {
      if (colors.length && !f.colorTones.some((c) => colors.includes(c))) return false
      if (occasions.length && !f.occasions.some((o) => occasions.includes(o))) return false
      if (feelings.length && !f.feelings.some((ft) => feelings.includes(ft))) return false

      if (!q) return true
      const haystack = [
        f.nameTh,
        f.nameEn,
        f.nameSci,
        f.meaningShort,
        f.meaningFull,
        ...f.feelings.map((ft) => FEELING_LABELS[ft]),
        ...f.occasions.map((o) => OCCASION_LABELS[o]),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query, colors, occasions, feelings])

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <BlurText
          text="ภาษาดอกไม้ บอกแทนใจที่พูดไม่ออก"
          className="font-heading text-4xl text-ink sm:text-5xl"
        />
        <p className="mt-3 font-body text-sm text-ink/60 sm:text-base">
          ค้นหาความหมายของดอกไม้จากชื่อ หรือจากความรู้สึกที่อยากสื่อ แล้วเลือกไปจัดช่อในสไตล์ของคุณเอง
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-xl">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <Filters
          activeColors={colors}
          activeOccasions={occasions}
          activeFeelings={feelings}
          onToggleColor={(c) => setColors((cur) => toggle(cur, c))}
          onToggleOccasion={(o) => setOccasions((cur) => toggle(cur, o))}
          onToggleFeeling={(f) => setFeelings((cur) => toggle(cur, f))}
          onReset={() => {
            setColors([])
            setOccasions([])
            setFeelings([])
          }}
        />

        <div>
          <p className="mb-4 font-body text-xs text-ink/50">พบ {results.length} ชนิด</p>
          {results.length === 0 ? (
            <div className="rounded-3xl bg-white/60 p-10 text-center font-body text-sm text-ink/50">
              ไม่พบดอกไม้ที่ตรงกับคำค้นหาหรือตัวกรองนี้ ลองเปลี่ยนคำค้นหาดูนะ
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((flower) => (
                <FlowerCard key={flower.id} flower={flower} onClick={() => setSelected(flower)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FlowerModal flower={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
