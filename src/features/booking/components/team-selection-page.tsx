"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, X, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import TicketTypeModal from "./ticket-type-modal"
import { ROOM_INFO, type Team, type TicketType } from "../data/team-data"

interface CartItem {
  teamId: number
  teamName: string
  playerId: number
  ticketType: TicketType
}

interface Props {
  date: string
  roomId: string
  time: string
  teams: Team[]
}

const WEEK_DAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${WEEK_DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export default function TeamSelectionPage({ date, roomId, time, teams }: Props) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedSlot, setSelectedSlot] = useState<{ teamId: number; playerId: number; teamName: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const roomInfo = ROOM_INFO[roomId] ?? {
    name: 'Phòng trải nghiệm',
    image: '/images/room1-mienn-dat-viet.png',
  }

  const isInCart = (teamId: number, playerId: number) =>
    cart.some(c => c.teamId === teamId && c.playerId === playerId)

  const handleSlotClick = (teamId: number, playerId: number, teamName: string) => {
    if (isInCart(teamId, playerId)) return
    setSelectedSlot({ teamId, playerId, teamName })
    setIsModalOpen(true)
  }

  const handleTicketSelect = (ticketType: TicketType) => {
    if (!selectedSlot) return
    setCart(prev => [
      ...prev,
      {
        teamId: selectedSlot.teamId,
        teamName: selectedSlot.teamName,
        playerId: selectedSlot.playerId,
        ticketType,
      },
    ])
    setIsModalOpen(false)
    setSelectedSlot(null)
  }

  const handleRemoveFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx))
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.ticketType.basePrice + item.ticketType.bookingFee,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex flex-col">
      {/* Sub-header */}
      <div className="sticky top-20 z-10 bg-white border-b border-gray-200 flex items-center h-14 px-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center font-bold text-sm sm:text-base text-gray-900">
          Chọn Đội &amp; Loại Vé
        </h1>
        <button
          onClick={() => router.push('/booking')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left: Team grid */}
        <div className="flex-1 overflow-x-auto p-4 lg:p-8">
          <div className="space-y-4 min-w-max">
            {teams.map(team => (
              <div key={team.teamId} className="flex items-center gap-4">
                {/* Team label */}
                <div className="w-20 shrink-0 font-black text-sm uppercase tracking-widest text-gray-800">
                  {team.teamName}
                </div>

                {/* Player slots */}
                <div className="flex gap-2">
                  {team.players.map(player => {
                    const inCart = isInCart(team.teamId, player.playerId)

                    if (player.isBooked) {
                      return (
                        <div
                          key={player.playerId}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center cursor-not-allowed"
                        >
                          <X className="w-7 h-7 text-gray-300" strokeWidth={2.5} />
                        </div>
                      )
                    }

                    return (
                      <button
                        key={player.playerId}
                        onClick={() => handleSlotClick(team.teamId, player.playerId, team.teamName)}
                        className={cn(
                          'w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95',
                          inCart
                            ? 'bg-green-600 shadow-lg cursor-default'
                            : 'bg-[#991b1b] hover:bg-[#7f1d1d] hover:shadow-lg cursor-pointer'
                        )}
                      >
                        <span className="text-white font-black text-xs sm:text-sm uppercase leading-tight text-center">
                          NGƯỜI<br />CHƠI {player.playerId}
                        </span>
                        <span className="text-white/60 text-[10px] sm:text-xs font-medium">
                          {inCart ? 'Đã chọn' : 'Chọn'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart panel */}
        <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white flex flex-col shrink-0">
          <div className="p-4 font-bold text-base text-gray-900 border-b border-gray-100">
            Giỏ hàng của bạn
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Event info card */}
            <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                <Image
                  src={roomInfo.image}
                  alt={roomInfo.name}
                  fill
                  className="object-cover"
                  onError={() => {}}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 leading-tight">{roomInfo.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{formatDateDisplay(date)}</p>
                <p className="text-xs text-gray-500">{time}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">123 Nguyễn Du, Quận 1, TP.HCM</p>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Cart items */}
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <ShoppingCart className="w-14 h-14 mb-3" strokeWidth={1} />
                <p className="text-sm text-gray-400">Chưa có vé nào trong giỏ hàng.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800">
                        {item.teamName} · Người chơi {item.playerId}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{item.ticketType.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#7f1d1d]">
                        {item.ticketType.basePrice + item.ticketType.bookingFee}.000đ
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(idx)}
                        className="text-[10px] text-red-500 hover:underline mt-0.5"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                  <span className="text-sm font-semibold text-gray-700">Tổng cộng</span>
                  <span className="text-sm font-bold text-[#7f1d1d]">{totalPrice}.000đ</span>
                </div>
              </div>
            )}
          </div>

          {/* Continue button */}
          <div className="p-4 border-t border-gray-200 shrink-0">
            <button
              disabled={cart.length === 0}
              className={cn(
                'w-full py-4 rounded-full font-bold text-base transition-all',
                cart.length > 0
                  ? 'bg-[#991b1b] text-white hover:bg-[#7f1d1d] shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>

      {/* Ticket type modal */}
      {selectedSlot && (
        <TicketTypeModal
          open={isModalOpen}
          teamName={selectedSlot.teamName}
          playerId={selectedSlot.playerId}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedSlot(null)
          }}
          onSelect={handleTicketSelect}
        />
      )}
    </div>
  )
}
