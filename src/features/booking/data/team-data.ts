export interface PlayerSlot {
  playerId: number // 1-6
  isBooked: boolean
}

export interface Team {
  teamId: number
  teamName: string
  players: PlayerSlot[]
}

export interface TicketType {
  id: string
  name: string
  basePrice: number // in 1000 VND
  bookingFee: number // in 1000 VND
  description: string
}

export const TICKET_TYPES: TicketType[] = [
  {
    id: 'vip',
    name: 'VIP: Người Chơi Quan Trọng',
    basePrice: 850,
    bookingFee: 30,
    description:
      'Đón tiếp riêng tư. Dịch vụ giữ đồ miễn phí. Nước uống chào mừng. Dây đeo kỷ niệm phiên bản giới hạn.',
  },
  {
    id: 'premium',
    name: 'Gói Cao Cấp',
    basePrice: 649,
    bookingFee: 30,
    description:
      'Vé kèm một phần đặc sản truyền thống dành cho người chơi từ 18 tuổi trở lên.',
  },
  {
    id: 'standard',
    name: 'Vé Tiêu Chuẩn',
    basePrice: 499,
    bookingFee: 30,
    description:
      'Người chơi từ 15 tuổi trở xuống phải có người lớn (18+) đi cùng trong cùng một đội. Một người lớn tối đa đi kèm 5 người chơi nhỏ tuổi.',
  },
  {
    id: 'access',
    name: 'Vé Hỗ Trợ Đặc Biệt',
    basePrice: 499,
    bookingFee: 30,
    description:
      'Nếu bạn có yêu cầu hỗ trợ đặc biệt, vui lòng liên hệ với chúng tôi để đảm bảo trải nghiệm tốt nhất.',
  },
  {
    id: 'combo',
    name: 'Gói Combo Ẩm Thực',
    basePrice: 699,
    bookingFee: 30,
    description:
      'Dành cho người từ 18 tuổi muốn trải nghiệm trò chơi kèm bữa ăn đặc sản Việt Nam sau buổi chơi.',
  },
]

export const ROOM_INFO: Record<string, { name: string; image: string }> = {
  'mien-dat-viet': {
    name: 'Phòng Miền Đất Việt',
    image: '/images/room1-mienn-dat-viet.png',
  },
  'lang-viet-song': {
    name: 'Phòng Làng Việt Sông',
    image: '/images/room2-lang-viet-song.png',
  },
  'lang-nghe': {
    name: 'Phòng Làng Nghề',
    image: '/images/room3-lang-nghe.png',
  },
}

/** Generate deterministic mock team data from room + date + time */
export function getTeamsForSlot(roomId: string, date: string, time: string): Team[] {
  const seed = (date.replace(/-/g, '') + time.replace(':', '')).split('').reduce(
    (acc, c) => acc + c.charCodeAt(0),
    0
  )

  const bookedPattern = (teamIdx: number, playerIdx: number): boolean => {
    // Teams 0-2: players 0-1 are likely booked; Team 3: all free
    if (teamIdx === 3) return false
    if (playerIdx > 1) return false
    return (seed + teamIdx * 7 + playerIdx * 3) % 3 !== 0
  }

  return [1, 2, 3, 4].map((teamId, teamIdx) => ({
    teamId,
    teamName: `ĐỘI ${teamId}`,
    players: [1, 2, 3, 4, 5, 6].map((playerId, playerIdx) => ({
      playerId,
      isBooked: bookedPattern(teamIdx, playerIdx),
    })),
  }))
}
