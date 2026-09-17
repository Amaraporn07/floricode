export type WrapColorId = 'cream' | 'peach' | 'blush' | 'leaf' | 'lilac' | 'sky' | 'beige'
export type WrapPatternId = 'plain' | 'craft' | 'dots' | 'stripe'
export type WrapFoldId = 'cone' | 'straight' | 'twoTone' | 'ruffled' | 'pleated'

export interface WrapColorOption {
  id: WrapColorId
  label: string
  hex: string
  hexSecondary: string
}

export const WRAP_COLORS: WrapColorOption[] = [
  { id: 'cream', label: 'ครีม', hex: '#FBF3E5', hexSecondary: '#F0E1C4' },
  { id: 'peach', label: 'พีช', hex: '#FFDCC0', hexSecondary: '#FFC8A0' },
  { id: 'blush', label: 'ชมพูพีช', hex: '#FBD4DC', hexSecondary: '#F5B7C4' },
  { id: 'leaf', label: 'เขียวใบไม้อ่อน', hex: '#DCEECB', hexSecondary: '#BFE0AC' },
  { id: 'lilac', label: 'ม่วงลาเวนเดอร์', hex: '#E6D6F2', hexSecondary: '#D2B8E6' },
  { id: 'sky', label: 'ฟ้าพาสเทล', hex: '#DAEBF5', hexSecondary: '#BCDBEC' },
  { id: 'beige', label: 'เบจ', hex: '#F0E4CE', hexSecondary: '#DBC29B' },
]

export const WRAP_PATTERNS: { id: WrapPatternId; label: string; className: string }[] = [
  { id: 'plain', label: 'เรียบ', className: 'paper-plain' },
  { id: 'craft', label: 'กระดาษคราฟต์', className: 'paper-craft' },
  { id: 'dots', label: 'ลายจุด', className: 'paper-dots' },
  { id: 'stripe', label: 'ลายทางเฉียง', className: 'paper-stripe' },
]

export const WRAP_FOLDS: { id: WrapFoldId; label: string; description: string }[] = [
  { id: 'cone', label: 'ห่อทรงกรวย', description: 'คลาสสิก ดูเรียบหรู ผิวกระดาษยับตามธรรมชาติ' },
  { id: 'straight', label: 'ห่อตรง โปร่งแสง', description: 'ดูโปร่งเบาสบายตา' },
  { id: 'twoTone', label: 'ห่อสองสีทูโทน', description: 'ตัดกันสองชั้น ดูมีมิติ' },
  { id: 'ruffled', label: 'ห่อจีบระบาย', description: 'ขอบกระดาษจีบเป็นระลอกคลื่น ดูฟูหวาน' },
  { id: 'pleated', label: 'ห่อพับจีบ', description: 'พับเป็นสันจีบถี่รอบช่อ ดูมีสไตล์' },
]

export type RibbonFabricId = 'satin' | 'linen'
export type RibbonColorId = 'cream' | 'peach' | 'blush' | 'leaf' | 'lilac' | 'gold'
export type RibbonPositionId = 'neck' | 'middle' | 'side'

export const RIBBON_FABRICS: { id: RibbonFabricId; label: string }[] = [
  { id: 'satin', label: 'ผ้าซาติน (เงามัน)' },
  { id: 'linen', label: 'ผ้าป่าน (ด้าน ธรรมชาติ)' },
]

export const RIBBON_COLORS: { id: RibbonColorId; label: string; hex: string }[] = [
  { id: 'cream', label: 'ครีม', hex: '#F3E7CE' },
  { id: 'peach', label: 'พีช', hex: '#FFC8A0' },
  { id: 'blush', label: 'ชมพูพีช', hex: '#F3A9BB' },
  { id: 'leaf', label: 'เขียวใบไม้', hex: '#9DCB8A' },
  { id: 'lilac', label: 'ม่วงลาเวนเดอร์', hex: '#C6A3DE' },
  { id: 'gold', label: 'ทองอ่อน', hex: '#E3C170' },
]

export const RIBBON_POSITIONS: { id: RibbonPositionId; label: string }[] = [
  { id: 'neck', label: 'มัดคอช่อ' },
  { id: 'middle', label: 'กึ่งกลางช่อ' },
  { id: 'side', label: 'เยื้องข้าง' },
]

export type RibbonSizeId = 'small' | 'medium' | 'large'

export const RIBBON_SIZES: { id: RibbonSizeId; label: string }[] = [
  { id: 'small', label: 'เล็ก' },
  { id: 'medium', label: 'กลาง' },
  { id: 'large', label: 'ใหญ่' },
]

export type ArrangementStyleId = 'compact' | 'freeform' | 'classic'

export const ARRANGEMENT_STYLES: { id: ArrangementStyleId; label: string; description: string }[] = [
  { id: 'compact', label: 'ทรงกลม (Compact)', description: 'จัดแน่นเป็นทรงกลมสมมาตร ดูหวานน่ารัก' },
  { id: 'freeform', label: 'ทรงพุ่มฟรีฟอร์ม', description: 'จัดกระจายลุคธรรมชาติ อิสระ ไม่เป็นทางการ' },
  { id: 'classic', label: 'ทรงยาวคลาสสิก', description: 'จัดเรียงแนวยาวสง่างามแบบช่อคลาสสิก' },
]
