export type FeelingTag =
  | 'love'
  | 'gratitude'
  | 'apology'
  | 'longing'
  | 'friendship'
  | 'sympathy'
  | 'celebration'
  | 'admiration'
  | 'purity'
  | 'newBeginnings'
  | 'calm'

export type ColorTone = 'red' | 'pink' | 'white' | 'yellow' | 'orange' | 'purple' | 'blue' | 'green'

export type Occasion =
  | 'anniversary'
  | 'birthday'
  | 'apology'
  | 'funeral'
  | 'graduation'
  | 'wedding'
  | 'getWell'
  | 'thankYou'
  | 'everyday'

export type FlowerShape =
  | 'rose'
  | 'tulip'
  | 'daisy'
  | 'mum'
  | 'lily'
  | 'spike'
  | 'cluster'
  | 'branch'
  | 'sakura'
  | 'orchid'
  | 'carnation'
  | 'marigold'

export type MoodTone = 'warm' | 'pastel' | 'vibrant' | 'earthy'

export interface Flower {
  id: string
  nameTh: string
  nameEn: string
  nameSci: string
  shape: FlowerShape
  petalColor: string
  centerColor: string
  petalCount?: number
  colorTones: ColorTone[]
  feelings: FeelingTag[]
  occasions: Occasion[]
  moods: MoodTone[]
  meaningShort: string
  meaningFull: string
  origin: string
  isFoliage?: boolean
}

export const FEELING_LABELS: Record<FeelingTag, string> = {
  love: 'รักแท้',
  gratitude: 'ขอบคุณ',
  apology: 'ขอโทษ',
  longing: 'คิดถึง',
  friendship: 'มิตรภาพ',
  sympathy: 'ปลอบใจ',
  celebration: 'ยินดี',
  admiration: 'ชื่นชม',
  purity: 'บริสุทธิ์',
  newBeginnings: 'เริ่มต้นใหม่',
  calm: 'สงบใจ',
}

export const COLOR_TONE_LABELS: Record<ColorTone, string> = {
  red: 'แดง',
  pink: 'ชมพู',
  white: 'ขาว',
  yellow: 'เหลือง',
  orange: 'ส้ม',
  purple: 'ม่วง',
  blue: 'ฟ้า',
  green: 'เขียว',
}

export const COLOR_TONE_SWATCH: Record<ColorTone, string> = {
  red: '#E1637C',
  pink: '#F6A6B5',
  white: '#FDFBF6',
  yellow: '#FFD26B',
  orange: '#F5854A',
  purple: '#BE9AD8',
  blue: '#98C4E0',
  green: '#83BC70',
}

export const OCCASION_LABELS: Record<Occasion, string> = {
  anniversary: 'ครบรอบ',
  birthday: 'วันเกิด',
  apology: 'ขอโทษ',
  funeral: 'ไว้อาลัย',
  graduation: 'รับปริญญา',
  wedding: 'งานแต่งงาน',
  getWell: 'เยี่ยมไข้',
  thankYou: 'ขอบคุณ',
  everyday: 'ทั่วไป',
}

export const MOOD_LABELS: Record<MoodTone, string> = {
  warm: 'อบอุ่น (Warm)',
  pastel: 'พาสเทล (Pastel)',
  vibrant: 'สดใส (Vibrant)',
  earthy: 'เอิร์ธโทน (Earthy)',
}

export interface PlacedFlower {
  uid: string
  flowerId: string
  x: number
  y: number
  scale: number
  rotation: number
  z: number
}
