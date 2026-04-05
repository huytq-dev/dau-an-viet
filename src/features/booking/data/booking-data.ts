export type AvailabilityStatus = 'good' | 'selling-fast' | 'sold-out' | 'off-sale'

export const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  good: 'Còn chỗ',
  'selling-fast': 'Sắp hết',
  'sold-out': 'Hết vé',
  'off-sale': 'Ngừng bán',
}

export const STATUS_BADGE_COLORS: Record<AvailabilityStatus, string> = {
  good: 'bg-tone-olive-mid',
  'selling-fast': 'bg-[#fcd34d]',
  'sold-out': 'bg-red-900',
  'off-sale': 'bg-gray-600',
}

export const STATUS_TEXT_COLORS: Record<AvailabilityStatus, string> = {
  good: 'text-white',
  'selling-fast': 'text-[#7f1d1d]',
  'sold-out': 'text-white',
  'off-sale': 'text-white',
}

export const STATUS_DOT_COLORS: Record<AvailabilityStatus, string> = {
  good: 'bg-tone-olive-light',
  'selling-fast': 'bg-tone-gold-light',
  'sold-out': 'bg-red-700',
  'off-sale': 'bg-gray-400',
}

export interface DayAvailability {
  date: string
  basePrice: number // giá thấp nhất trong ngày (1000 VND)
  status: AvailabilityStatus
}

export interface TimeSlot {
  time: string
  slotLabel: string   // "SLOT 1", "SLOT 2",...
  endTime: string
  price: number       // 1000 VND
  hasSurcharge: boolean // +20k sau 21:00
  status: AvailabilityStatus
}

export interface RoomSchedule {
  roomId: string
  roomName: string
  location: string
  timeSlots: TimeSlot[]
}

export function formatPrice(priceK: number): string {
  // priceK là giá tính bằng nghìn đồng (vd: 1245 → 1.245.000đ)
  const full = priceK * 1000
  return full.toLocaleString('vi-VN') + 'đ'
}

// ─── Pricing logic ───────────────────────────────────────────────────────────
// Peak: Thứ 6 sau 17:00 + Thứ 7 + Chủ nhật
// Off-peak: Thứ 2 → Thứ 6 trước 17:00
// Surcharge: +20k/người sau 21:00

export function isPeakTime(dateStr: string, timeStr: string): boolean {
  const day = new Date(dateStr).getDay() // 0=CN, 5=T6, 6=T7
  const hour = parseInt(timeStr.split(':')[0], 10)
  if (day === 0 || day === 6) return true          // CN, T7 toàn bộ
  if (day === 5 && hour >= 17) return true         // T6 từ 17:00 trở đi
  return false
}

export function hasSurcharge(timeStr: string): boolean {
  return parseInt(timeStr.split(':')[0], 10) >= 21
}

export function getSlotPrice(roomId: string, dateStr: string, timeStr: string): number {
  const peak = isPeakTime(dateStr, timeStr)
  const surcharge = hasSurcharge(timeStr) ? 20 : 0
  let base: number
  if (roomId === 'lang-viet-song') {
    base = peak ? 249 : 219
  } else {
    // mien-dat-viet (default)
    base = peak ? 229 : 199
  }
  return base + surcharge
}

// ─── Weekly schedule (8 slots/room, 90 phút mỗi slot) ───────────────────────

const ROOM_SLOTS: Record<string, { start: string; end: string }[]> = {
  'mien-dat-viet': [
    { start: '09:00', end: '10:30' },
    { start: '10:45', end: '12:15' },
    { start: '12:30', end: '14:00' },
    { start: '14:15', end: '15:45' },
    { start: '16:00', end: '17:30' },
    { start: '17:45', end: '19:15' },
    { start: '19:30', end: '21:00' },
    { start: '21:15', end: '22:45' },
  ],
  'lang-viet-song': [
    { start: '09:10', end: '10:40' },
    { start: '10:55', end: '12:25' },
    { start: '12:40', end: '14:10' },
    { start: '14:25', end: '15:55' },
    { start: '16:10', end: '17:40' },
    { start: '17:55', end: '19:25' },
    { start: '19:40', end: '21:10' },
    { start: '21:25', end: '22:55' },
  ],
}

const ROOM_NAMES: Record<string, string> = {
  'mien-dat-viet': 'Miền Đất Việt',
  'lang-viet-song': 'Làng Việt Sống',
}

const STATUS_CYCLE: AvailabilityStatus[] = [
  'good', 'good', 'selling-fast', 'good', 'selling-fast', 'good', 'good', 'selling-fast',
]

export function getTimeSlotsForDate(dateStr: string): RoomSchedule[] {
  const dayNum = parseInt(dateStr.split('-')[2], 10)

  return Object.entries(ROOM_SLOTS).map(([roomId, slots]) => ({
    roomId,
    roomName: ROOM_NAMES[roomId],
    location: 'Đầu Chân Việt, 123 Nguyễn Du, Quận 1, TP.HCM',
    timeSlots: slots.map(({ start, end }, idx) => ({
      time: start,
      slotLabel: `SLOT ${idx + 1}`,
      endTime: end,
      price: getSlotPrice(roomId, dateStr, start),
      hasSurcharge: hasSurcharge(start),
      status: STATUS_CYCLE[(dayNum + idx) % STATUS_CYCLE.length],
    })),
  }))
}

// ─── Calendar data (giá hiển thị = giá thấp nhất trong ngày) ─────────────────
// T2-T5: từ 199k | T6 (cả ngày từ 199k, peak từ 229k) | T7-CN: từ 229k

function calendarPrice(dateStr: string): number {
  const day = new Date(dateStr).getDay()
  return day === 0 || day === 6 ? 229 : 199
}

function calendarStatus(dateStr: string): AvailabilityStatus {
  const d = parseInt(dateStr.split('-')[2], 10)
  const pattern: AvailabilityStatus[] = ['good', 'good', 'selling-fast', 'good', 'selling-fast', 'good', 'good']
  return pattern[d % pattern.length]
}

function generateMonth(year: number, month: number): DayAvailability[] {
  const days: DayAvailability[] = []
  const daysInMonth = new Date(year, month, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date: dateStr,
      basePrice: calendarPrice(dateStr),
      status: calendarStatus(dateStr),
    })
  }
  return days
}

// Tháng 4 + 5 năm 2026
const CALENDAR_ENTRIES: DayAvailability[] = [
  ...generateMonth(2026, 4),
  ...generateMonth(2026, 5),
]

export const CALENDAR_MAP = new Map<string, DayAvailability>(
  CALENDAR_ENTRIES.map(d => [d.date, d])
)
