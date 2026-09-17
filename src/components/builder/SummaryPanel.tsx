import { Download, Link2, Sparkles } from 'lucide-react'
import { FEELING_LABELS } from '../../data/types'
import type { BouquetMeaning } from '../../lib/meaning'
import PanelSection from './PanelSection'

interface SummaryPanelProps {
  meaning: BouquetMeaning
  busy: boolean
  linkCopied: boolean
  onSavePng: () => void
  onCopyLink: () => void
  onCreateCard: () => void
}

export default function SummaryPanel({ meaning, busy, linkCopied, onSavePng, onCopyLink, onCreateCard }: SummaryPanelProps) {
  return (
    <PanelSection title="ความหมายรวมของช่อดอกไม้">
      <div className="space-y-4">
        {meaning.topFeelings.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meaning.topFeelings.map((f) => (
              <span key={f.tag} className="rounded-full bg-peach-100 px-3 py-1 font-body text-xs font-medium text-ink">
                {FEELING_LABELS[f.tag]}
              </span>
            ))}
          </div>
        )}
        <p className="rounded-2xl bg-white/70 p-3 font-body text-xs leading-relaxed text-ink/80">{meaning.sentence}</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onSavePng}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 font-body text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {busy ? 'กำลังบันทึกภาพ...' : 'บันทึกภาพช่อดอกไม้ (PNG)'}
          </button>
          <button
            onClick={onCopyLink}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-peach-200 bg-white/70 px-4 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-peach-50"
          >
            <Link2 className="h-4 w-4" />
            {linkCopied ? 'คัดลอกลิงก์แล้ว!' : 'คัดลอกลิงก์แชร์ช่อนี้'}
          </button>
          <button
            onClick={onCreateCard}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-peach-200 bg-white/70 px-4 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-peach-50"
          >
            <Sparkles className="h-4 w-4" />
            สร้างการ์ดอวยพรดิจิทัล
          </button>
        </div>
      </div>
    </PanelSection>
  )
}
