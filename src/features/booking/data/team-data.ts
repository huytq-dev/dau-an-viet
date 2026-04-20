export interface PlayerSlot {
  playerId: number // 1-6
  isBooked: boolean
}

export interface Team {
  teamId: number
  teamName: string
  players: PlayerSlot[]
}

// ─── Ticket types (legacy) ───────────────────────────────────────────────────
// Không còn chọn loại vé — giá cố định theo room + khung giờ
// Tuy nhiên vẫn export để tránh lỗi build do TicketTypeModal còn tồn tại.
export interface TicketType {
  id: string
  name: string
  basePrice: number
  bookingFee: number
  description: string
}

export const TICKET_TYPES: TicketType[] = [
  {
    id: 'regular',
    name: 'Vé thường',
    basePrice: 120,
    bookingFee: 10,
    description: 'Áp dụng cho hầu hết khung giờ tiêu chuẩn.',
  },
  {
    id: 'student',
    name: 'Vé HSSV',
    basePrice: 100,
    bookingFee: 10,
    description: 'Ưu đãi cho HSSV. Không áp dụng sau 21:00.',
  },
  {
    id: 'peak',
    name: 'Vé giờ cao điểm',
    basePrice: 140,
    bookingFee: 10,
    description: 'Áp dụng cho các khung giờ cao điểm.',
  },
]

// ─── Room info ───────────────────────────────────────────────────────────────

export const ROOM_INFO: Record<string, { name: string; image: string }> = {
  'mien-dat-viet': {
    name: 'Miền Đất Việt',
    image: '/images/room1-mienn-dat-viet.png',
  },
  'lang-viet-song': {
    name: 'Làng Việt Sống',
    image: '/images/room2-lang-viet-song.png',
  },
}

// ─── Pricing notes ───────────────────────────────────────────────────────────
export const PRICING_NOTES = [
  'Đối với khách hàng là học sinh sinh viên, vui lòng mang theo thẻ học sinh/sinh viên còn hiệu lực khi check-in, khách hàng sẽ được hoàn lại phần chênh lệch tương ứng với mức giá ưu đãi dành cho học sinh/sinh viên.',
]

// ─── Team/player mock data ────────────────────────────────────────────────────

export function getTeamsForSlot(roomId: string, date: string, time: string): Team[] {
  const seed = (date.replace(/-/g, '') + time.replace(':', ''))
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)

  // Teams 0-2: players 0-1 có thể đã book; Team 3 (ĐỘI 4): toàn bộ còn trống
  const isBooked = (teamIdx: number, playerIdx: number): boolean => {
    if (teamIdx === 3) return false
    if (playerIdx > 1) return false
    return (seed + teamIdx * 7 + playerIdx * 3) % 3 !== 0
  }

  return [1, 2, 3, 4].map((teamId, teamIdx) => ({
    teamId,
    teamName: `ĐỘI ${teamId}`,
    players: [1, 2, 3, 4].map((playerId, playerIdx) => ({
      playerId,
      isBooked: isBooked(teamIdx, playerIdx),
    })),
  }))
}
