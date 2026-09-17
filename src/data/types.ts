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
  | 'hyacinthSpike'
  | 'daisySpray'

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

/** A flower placed in the 3D bouquet scene. x/z are the horizontal ground
 * plane (drag moves along these two), y is height — together (x,y,z) also
 * doubles as the stem's length and direction, since the stem always runs
 * straight from here to the neck point at the origin: shortening this
 * vector (scaling x/y/z down together, keeping their direction) is what
 * "trimming the stem" means, pulling the flower down closer to the bunch.
 * rotationY is the compass direction the flower leans/faces, and tilt is
 * how far it leans away from standing straight up — together they let the
 * bloom face any direction freely, not just spin flat in place. */
export interface PlacedFlower {
  uid: string
  flowerId: string
  x: number
  y: number
  z: number
  rotationY: number
  tilt: number
  scale: number
}
