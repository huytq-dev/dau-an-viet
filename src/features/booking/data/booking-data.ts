export type AvailabilityStatus = 'good' | 'selling-fast' | 'sold-out' | 'off-sale'

export const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  good: 'Còn chỗ',
  'selling-fast': 'Sắp hết',
  'sold-out': 'Hết vé',
  'off-sale': 'Ngừng bán',
}

export const STATUS_BADGE_COLORS: Record<AvailabilityStatus, string> = {
  good: 'bg-green-600',
  'selling-fast': 'bg-orange-500',
  'sold-out': 'bg-red-700',
  'off-sale': 'bg-gray-500',
}

export const STATUS_DOT_COLORS: Record<AvailabilityStatus, string> = {
  good: 'bg-green-500',
  'selling-fast': 'bg-orange-400',
  'sold-out': 'bg-red-600',
  'off-sale': 'bg-gray-400',
}

export interface DayAvailability {
  date: string // YYYY-MM-DD
  basePrice: number // in 1000 VND (e.g. 499 → 499.000đ)
  status: AvailabilityStatus
  isLowestPrice?: boolean
}

export interface TimeSlot {
  time: string
  price: number // in 1000 VND
  status: AvailabilityStatus
  isLowestPrice?: boolean
}

export interface RoomSchedule {
  roomId: string
  roomName: string
  location: string
  timeSlots: TimeSlot[]
}

export function formatPrice(priceK: number): string {
  return `${priceK}.000đ`
}

const CALENDAR_ENTRIES: DayAvailability[] = [
  // April 2026
  { date: '2026-04-04', basePrice: 699, status: 'selling-fast' },
  { date: '2026-04-05', basePrice: 649, status: 'selling-fast' },
  { date: '2026-04-07', basePrice: 599, status: 'selling-fast' },
  { date: '2026-04-08', basePrice: 599, status: 'good' },
  { date: '2026-04-09', basePrice: 599, status: 'selling-fast' },
  { date: '2026-04-10', basePrice: 599, status: 'selling-fast' },
  { date: '2026-04-11', basePrice: 699, status: 'selling-fast' },
  { date: '2026-04-12', basePrice: 649, status: 'selling-fast' },
  { date: '2026-04-14', basePrice: 499, status: 'selling-fast', isLowestPrice: true },
  { date: '2026-04-15', basePrice: 499, status: 'selling-fast', isLowestPrice: true },
  { date: '2026-04-16', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-04-17', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-04-18', basePrice: 699, status: 'selling-fast' },
  { date: '2026-04-19', basePrice: 649, status: 'good' },
  { date: '2026-04-21', basePrice: 499, status: 'selling-fast', isLowestPrice: true },
  { date: '2026-04-22', basePrice: 499, status: 'selling-fast', isLowestPrice: true },
  { date: '2026-04-23', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-04-24', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-04-25', basePrice: 699, status: 'selling-fast' },
  { date: '2026-04-26', basePrice: 649, status: 'good' },
  { date: '2026-04-28', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-04-29', basePrice: 499, status: 'selling-fast', isLowestPrice: true },
  { date: '2026-04-30', basePrice: 499, status: 'good', isLowestPrice: true },
  // May 2026
  { date: '2026-05-01', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-02', basePrice: 699, status: 'good' },
  { date: '2026-05-03', basePrice: 649, status: 'good' },
  { date: '2026-05-04', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-05', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-06', basePrice: 599, status: 'good' },
  { date: '2026-05-07', basePrice: 599, status: 'good' },
  { date: '2026-05-08', basePrice: 599, status: 'good' },
  { date: '2026-05-09', basePrice: 699, status: 'good' },
  { date: '2026-05-10', basePrice: 649, status: 'good' },
  { date: '2026-05-11', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-12', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-13', basePrice: 599, status: 'good' },
  { date: '2026-05-14', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-15', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-16', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-17', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-18', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-19', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-20', basePrice: 599, status: 'good' },
  { date: '2026-05-21', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-22', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-23', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-24', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-25', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-26', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-27', basePrice: 599, status: 'good' },
  { date: '2026-05-28', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-29', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-30', basePrice: 499, status: 'good', isLowestPrice: true },
  { date: '2026-05-31', basePrice: 499, status: 'good', isLowestPrice: true },
]

export const CALENDAR_MAP = new Map<string, DayAvailability>(
  CALENDAR_ENTRIES.map(d => [d.date, d])
)

const STATUS_CYCLE: AvailabilityStatus[] = ['good', 'selling-fast', 'good', 'good', 'selling-fast', 'good']

export function getTimeSlotsForDate(dateStr: string): RoomSchedule[] {
  const dayData = CALENDAR_MAP.get(dateStr)
  const dayNum = parseInt(dateStr.split('-')[2], 10)
  const basePrice = dayData?.basePrice ?? 599
  const isPromo = dayData?.isLowestPrice ?? false
  const lowerPrice = isPromo ? basePrice : Math.max(basePrice - 50, 499)

  const status = (offset: number): AvailabilityStatus =>
    STATUS_CYCLE[(dayNum + offset) % STATUS_CYCLE.length]

  return [
    {
      roomId: 'mien-dat-viet',
      roomName: 'Phòng Miền Đất Việt',
      location: 'Đầu Chân Việt, 123 Nguyễn Du, Quận 1, TP.HCM',
      timeSlots: [
        { time: '10:00', price: lowerPrice, status: status(0), isLowestPrice: true },
        { time: '11:30', price: basePrice, status: status(1) },
        { time: '13:00', price: lowerPrice, status: status(2), isLowestPrice: true },
        { time: '14:30', price: lowerPrice, status: status(3), isLowestPrice: true },
        { time: '16:00', price: lowerPrice, status: status(4), isLowestPrice: true },
        { time: '17:30', price: basePrice, status: status(5) },
      ],
    },
    {
      roomId: 'lang-viet-song',
      roomName: 'Phòng Làng Việt Sông',
      location: 'Đầu Chân Việt, 123 Nguyễn Du, Quận 1, TP.HCM',
      timeSlots: [
        { time: '10:30', price: basePrice, status: status(1) },
        { time: '12:00', price: basePrice, status: status(2) },
        { time: '13:30', price: lowerPrice, status: status(3), isLowestPrice: true },
        { time: '15:00', price: basePrice, status: status(4) },
        { time: '16:30', price: lowerPrice, status: status(5), isLowestPrice: true },
        { time: '18:00', price: basePrice, status: status(0) },
      ],
    },
    {
      roomId: 'lang-nghe',
      roomName: 'Phòng Làng Nghề',
      location: 'Đầu Chân Việt, 123 Nguyễn Du, Quận 1, TP.HCM',
      timeSlots: [
        { time: '11:00', price: lowerPrice, status: status(2), isLowestPrice: true },
        { time: '12:30', price: lowerPrice, status: status(3), isLowestPrice: true },
        { time: '14:00', price: basePrice, status: status(4) },
        { time: '15:30', price: basePrice, status: status(5) },
        { time: '17:00', price: lowerPrice, status: status(0), isLowestPrice: true },
        { time: '18:30', price: basePrice, status: status(1) },
      ],
    },
  ]
}
