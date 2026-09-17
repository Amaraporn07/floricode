import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-peach-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ค้นหาชื่อดอกไม้ หรือความรู้สึก เช่น รักแท้, ขอโทษ, ขอบคุณ..."
        className="w-full rounded-full border-2 border-peach-100 bg-white/80 py-3.5 pl-12 pr-11 font-body text-sm text-ink shadow-card outline-none transition-colors placeholder:text-ink/40 focus:border-peach-300"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="ล้างคำค้นหา"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 transition-colors hover:bg-peach-100 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
