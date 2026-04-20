"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, X, ShoppingCart, AlertCircle, Users, Trash2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROOM_INFO, PRICING_NOTES, type Team } from "../data/team-data"
import { getSlotPrice, hasSurcharge, formatPrice } from "../data/booking-data"

interface CartItem {
  teamId: number
  teamName: string
  playerId: number
  price: number
}

interface Props {
  date: string
  roomId: string
  time: string
  teams: Team[]
}

// Bảng màu 4 tông từ brand palette (khớp với CSS vars --tone-*)
const TEAM_PALETTE = [
  { bg: '#5f6830', mid: '#778040', light: '#b8be78', fg: '#f5f2dc' }, // olive
  { bg: '#2e6060', mid: '#407878', light: '#7ab2b2', fg: '#e4f4f4' }, // teal
  { bg: '#7a6010', mid: '#9a7c1a', light: '#c8a838', fg: '#fef8e0' }, // gold
  { bg: '#3a1f68', mid: '#553088', light: '#9070c0', fg: '#f0eaf8' }, // purple
]

const WEEK_DAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${WEEK_DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// ── Confirm modal state type ──────────────────────────────────────────────────
type ConfirmTarget =
  | { type: 'player'; teamId: number; playerId: number; label: string; palette: typeof TEAM_PALETTE[0] }
  | { type: 'team';   teamId: number;                   label: string; palette: typeof TEAM_PALETTE[0] }

export default function TeamSelectionPage({ date, roomId, time, teams }: Props) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [confirm, setConfirm] = useState<ConfirmTarget | null>(null)
  const [showPolicy, setShowPolicy] = useState(false)
  const [policyAccepted, setPolicyAccepted] = useState(false)

  const roomInfo = ROOM_INFO[roomId] ?? {
    name: 'Phòng trải nghiệm',
    image: '/images/room1-mienn-dat-viet.png',
  }

  const pricePerPerson = getSlotPrice(roomId, date, time)
  const withSurcharge = hasSurcharge(time)

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const isInCart = (teamId: number, playerId: number) =>
    cart.some(c => c.teamId === teamId && c.playerId === playerId)

  const cartByTeam = useMemo(() => {
    const map = new Map<number, CartItem[]>()
    for (const item of cart) {
      map.set(item.teamId, [...(map.get(item.teamId) ?? []), item])
    }
    return map
  }, [cart])

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  const handleSlotClick = (teamId: number, playerId: number, teamName: string) => {
    if (isInCart(teamId, playerId)) {
      setCart(prev => prev.filter(c => !(c.teamId === teamId && c.playerId === playerId)))
    } else {
      setCart(prev => [...prev, { teamId, teamName, playerId, price: pricePerPerson }])
    }
  }

  // Xoá qua confirm modal
  const askRemovePlayer = (teamId: number, playerId: number, teamName: string) => {
    const palette = TEAM_PALETTE[(teamId - 1) % TEAM_PALETTE.length]
    setConfirm({ type: 'player', teamId, playerId, label: `${teamName} · Người chơi ${playerId}`, palette })
  }

  const askRemoveTeam = (teamId: number, teamName: string) => {
    const palette = TEAM_PALETTE[(teamId - 1) % TEAM_PALETTE.length]
    setConfirm({ type: 'team', teamId, label: teamName, palette })
  }

  const handleConfirmRemove = () => {
    if (!confirm) return
    if (confirm.type === 'player') {
      setCart(prev => prev.filter(c => !(c.teamId === confirm.teamId && c.playerId === confirm.playerId)))
    } else {
      setCart(prev => prev.filter(c => c.teamId !== confirm.teamId))
    }
    setConfirm(null)
  }

  // ── Cart panel content ────────────────────────────────────────────────────
  const CartContent = () => (
    <>
      {/* Event info */}
      <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">
          <Image src={roomInfo.image} alt={roomInfo.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 leading-tight">{roomInfo.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatDateDisplay(date)}</p>
          <p className="text-xs text-[#991b1b] font-semibold mt-0.5">
            {time} · {formatPrice(pricePerPerson)}/người
          </p>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Cart items grouped by team */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
          <ShoppingCart className="w-12 h-12 mb-2" strokeWidth={1} />
          <p className="text-sm text-gray-400 text-center">
            Chọn người chơi bên trái<br />để thêm vào giỏ hàng
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {Array.from(cartByTeam.entries()).map(([teamId, items]) => {
            const teamTotal = items.reduce((s, i) => s + i.price, 0)
            const palette = TEAM_PALETTE[(teamId - 1) % TEAM_PALETTE.length]
            return (
              <div key={teamId} className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${palette.light}` }}>
                {/* Team header */}
                <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: palette.bg }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black leading-none"
                      style={{ backgroundColor: palette.light, color: palette.bg }}
                    >
                      {items.length}
                    </span>
                    <span className="text-sm font-bold text-white">{items[0].teamName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/80">{formatPrice(teamTotal)}</span>
                    <button
                      onClick={() => askRemoveTeam(teamId, items[0].teamName)}
                      title="Xoá cả đội"
                      className="p-1 rounded hover:bg-white/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white/70 hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Player rows */}
                <div className="divide-y divide-gray-100 bg-white">
                  {items
                    .sort((a, b) => a.playerId - b.playerId)
                    .map(item => (
                      <div key={item.playerId} className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs text-gray-600">Người chơi {item.playerId}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: palette.mid }}>
                            {formatPrice(item.price)}
                          </span>
                          <button
                            onClick={() => askRemovePlayer(teamId, item.playerId, items[0].teamName)}
                            className="p-1 rounded hover:bg-red-50 transition-colors group"
                          >
                            <Trash2 className="w-3 h-3 text-gray-300 group-hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )
          })}

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-400">{cartByTeam.size} đội · {cart.length} người chơi</p>
              <p className="text-sm font-bold text-gray-800">Tổng cộng</p>
            </div>
            <p className="text-xl font-black text-[#991b1b]">{formatPrice(totalPrice)}</p>
          </div>
        </div>
      )}

      {/* Pricing notes */}
      <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 space-y-1">
        {PRICING_NOTES.map((note, i) => (
          <p key={i} className="text-sm text-amber-700 leading-relaxed">· {note}</p>
        ))}
      </div>
    </>
  )

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col" style={{ paddingTop: '5rem' }}>

      {/* Sub-header */}
      <div className="bg-[#7f1d1d] flex items-center h-14 px-4 shrink-0 z-20">
        <button
          onClick={() => router.back()}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center font-bold text-sm sm:text-base text-white">
          Chọn Đội &amp; Người Chơi
        </h1>
        <button
          onClick={() => router.push('/booking')}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Info bar */}
      <div className="bg-[#fef3c7] border-b border-[#fcd34d]/40 px-4 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
        <span className="text-sm text-[#7f1d1d] font-semibold">{roomInfo.name} · {time}</span>
        <span className="text-sm font-black text-[#991b1b]">{formatPrice(pricePerPerson)} / người</span>
        {withSurcharge && (
          <span className="flex items-center gap-1 text-xs text-orange-700 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Phụ thu 20.000đ sau 21:00
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto hidden sm:block">Click để chọn · Click lại để bỏ</span>
      </div>

      {/* Main layout */}
      <div className="flex flex-row flex-1 min-h-0">

        {/* Left: Team grid */}
        <div className="flex-1 min-h-0 overflow-auto p-3 sm:p-5 lg:p-8">
          <div className="space-y-2 sm:space-y-3 min-w-max">
            {teams.map(team => {
              const selectedInTeam = cart.filter(c => c.teamId === team.teamId).length
              const availableInTeam = team.players.filter(p => !p.isBooked).length
              const palette = TEAM_PALETTE[(team.teamId - 1) % TEAM_PALETTE.length]

              return (
                <div key={team.teamId} className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  {/* Team label */}
                  <div className="w-14 sm:w-16 lg:w-20 shrink-0">
                    <p className="font-black text-xs sm:text-sm uppercase tracking-widest" style={{ color: palette.bg }}>
                      {team.teamName}
                    </p>
                    {selectedInTeam > 0 && (
                      <p className="text-[9px] sm:text-[10px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: palette.mid }}>
                        <Users className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        {selectedInTeam}/{availableInTeam}
                      </p>
                    )}
                  </div>

                  {/* Player slots */}
                  <div className="flex gap-1.5 sm:gap-2">
                    {team.players.map(player => {
                      const inCart = isInCart(team.teamId, player.playerId)

                      if (player.isBooked) {
                        return (
                          <div
                            key={player.playerId}
                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[88px] lg:h-[88px] rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-not-allowed"
                            title="Đã có người đặt"
                          >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" strokeWidth={2} />
                          </div>
                        )
                      }

                      return (
                        <button
                          key={player.playerId}
                          onClick={() => handleSlotClick(team.teamId, player.playerId, team.teamName)}
                          className={cn(
                            'w-16 h-16 sm:w-20 sm:h-20 lg:w-[88px] lg:h-[88px] rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-150 active:scale-95',
                            inCart
                              ? 'bg-green-600 shadow-md ring-2 ring-green-400 ring-offset-1'
                              : 'bg-[#991b1b] hover:bg-[#7f1d1d] hover:shadow-md'
                          )}
                        >
                          <span className="text-white font-black text-[9px] sm:text-[11px] uppercase leading-tight text-center">
                            NGƯỜI<br />CHƠI {player.playerId}
                          </span>
                          <span className={cn('text-[8px] sm:text-[10px] font-semibold', inCart ? 'text-green-100' : 'text-white/50')}>
                            {inCart ? '✓ Đã chọn' : formatPrice(pricePerPerson)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Cart panel — hiện từ md (tablet) */}
        <div className="hidden md:flex flex-col shrink-0 w-72 lg:w-80 xl:w-96 border-l border-gray-200 bg-white">
          {/* Cart header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
            <span className="font-bold text-sm text-gray-900">Giỏ hàng</span>
            {cart.length > 0 && (
              <span className="text-xs text-gray-400">{cart.length} người chơi</span>
            )}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 lg:p-4 space-y-3">
            <CartContent />
          </div>

          {/* Continue button */}
          <div className="p-3 lg:p-4 border-t border-gray-100 shrink-0">
            <button
              disabled={cart.length === 0}
              onClick={() => { if (cart.length > 0) { setPolicyAccepted(false); setShowPolicy(true) } }}
              className={cn(
                'w-full py-3 lg:py-3.5 rounded-full font-bold text-sm transition-all',
                cart.length > 0
                  ? 'bg-[#991b1b] text-white hover:bg-[#7f1d1d] shadow-md cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {cart.length > 0 ? `Tiếp tục · ${formatPrice(totalPrice)}` : 'Chưa chọn vé nào'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile floating cart bar (chỉ hiện dưới md) */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-3 px-4 pt-3 pb-1">
            <div className="w-8 h-8 rounded-full bg-[#991b1b] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">{cart.length}</span>
            </div>
            <div className="flex-1 min-w-0">
              {Array.from(cartByTeam.entries()).slice(-2).map(([teamId, items]) => (
                <p key={teamId} className="text-xs text-gray-600 truncate leading-relaxed">
                  <span className="font-semibold text-gray-800">{items[0].teamName}</span>
                  {' '}· {items.length} người ·{' '}
                  <span className="text-[#991b1b] font-semibold">
                    {formatPrice(items.reduce((s, i) => s + i.price, 0))}
                  </span>
                </p>
              ))}
              {cartByTeam.size > 2 && (
                <p className="text-[10px] text-gray-400">+{cartByTeam.size - 2} đội khác</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-gray-400">{cartByTeam.size} đội</p>
              <p className="text-sm font-black text-[#991b1b]">{formatPrice(totalPrice)}</p>
            </div>
          </div>
          <div className="px-4 py-3">
            <button
              onClick={() => { setPolicyAccepted(false); setShowPolicy(true) }}
              className="w-full py-3 rounded-full bg-[#991b1b] text-white font-bold text-sm hover:bg-[#7f1d1d] transition-colors cursor-pointer"
            >
              Tiếp tục · {formatPrice(totalPrice)}
            </button>
          </div>
        </div>
      )}

      {/* ── Policy Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPolicy && (
          <>
            <motion.div
              key="policy-backdrop"
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowPolicy(false)}
            />
            <motion.div
              key="policy-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-[#7f1d1d] px-6 py-5 shrink-0">
                  <h2 className="text-white font-black text-lg tracking-wide">Các điều khoản & Chính sách</h2>
                  <p className="text-[#fcd34d] text-sm font-semibold mt-0.5">Dấu Chân Việt</p>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="font-bold text-[#7f1d1d] mb-2">1. Điều kiện mở phiên chơi</h3>
                    <p>Mỗi phiên chơi cần tối thiểu 4 người tham gia, chia thành 2 đội, mỗi đội ít nhất 2 người, để hai đội đối đầu với nhau và phiên chơi có thể vận hành.</p>
                    <p className="mt-2">Nếu nhóm bạn chưa đủ người, bạn có thể tìm thêm đồng đội tại đây:{' '}
                      <a href="https://www.facebook.com/groups/915491021325762" target="_blank" rel="noopener noreferrer" className="text-[#991b1b] font-semibold underline underline-offset-2">facebook.com/groups/...</a>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#7f1d1d] mb-2">2. Kiểm tra số lượng người chơi trước giờ bắt đầu</h3>
                    <p>Nếu chưa đủ tối thiểu 4 người trước 90 phút phiên chơi bắt đầu, hoặc có nhóm hủy đột xuất sát giờ chơi, chúng tôi sẽ liên hệ hỗ trợ khách hàng lựa chọn:</p>
                    <ul className="mt-2 space-y-1 pl-4 list-disc">
                      <li>Chuyển sang khung giờ khác trong cùng ngày (hoặc gần nhất) đã đủ số lượng người chơi</li>
                      <li>Dời lịch sang ngày khác phù hợp hơn</li>
                    </ul>
                    <p className="mt-2">Nếu khách hàng không thể sắp xếp theo các phương án trên, Dấu Chân Việt sẽ:</p>
                    <ul className="mt-2 space-y-1 pl-4 list-disc">
                      <li>Hoàn 100% số tiền đã thanh toán</li>
                      <li>Tặng voucher giảm 15% cho lần đặt tiếp theo như lời xin lỗi và bù đắp trải nghiệm.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#7f1d1d] mb-2">3. Chính sách hủy và đổi lịch</h3>
                    <ul className="space-y-1 pl-4 list-disc">
                      <li>Thông báo hủy trước ít nhất <strong>48 giờ</strong>: hoàn 100% giá trị vé.</li>
                      <li>Thông báo đổi lịch trước ít nhất <strong>24 giờ</strong>: đổi sang khung giờ khác miễn phí.</li>
                      <li>Hủy hoặc đổi lịch trong vòng 24 giờ trước giờ bắt đầu: không hỗ trợ hoàn tiền hoặc đổi lịch.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#7f1d1d] mb-2">4. Hoàn tiền đối với ưu đãi học sinh, sinh viên</h3>
                    <p>Đối với khách hàng mang theo thẻ học sinh/sinh viên còn hiệu lực khi check-in, khách hàng sẽ được hoàn lại phần chênh lệch tương ứng với mức giá ưu đãi.</p>
                    <p className="mt-2 font-semibold text-amber-700">Lưu ý: Ưu đãi học sinh sinh viên chỉ áp dụng cho nhóm từ 4 người trở lên.</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-6 py-4 border-t border-gray-100 space-y-3 bg-gray-50">
                  {/* Toggle confirm button */}
                  <button
                    onClick={() => setPolicyAccepted(p => !p)}
                    className={cn(
                      'w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-left transition-all duration-200 border-2',
                      policyAccepted
                        ? 'bg-[#991b1b] border-[#991b1b] text-white'
                        : 'bg-white border-[#991b1b]/30 text-gray-600 hover:border-[#991b1b]'
                    )}
                  >
                    <span className={cn('mr-2', policyAccepted ? 'text-white' : 'text-[#991b1b]')}>
                      {policyAccepted ? '✓' : '○'}
                    </span>
                    Tôi xác nhận đã đọc, hiểu và đồng ý với các điều khoản và chính sách của Dấu Chân Việt
                  </button>

                  {/* Proceed button */}
                  <button
                    disabled={!policyAccepted}
                    onClick={() => {
                      sessionStorage.setItem('checkout_cart', JSON.stringify(cart))
                      sessionStorage.setItem('checkout_meta', JSON.stringify({ date, roomId, time, roomName: roomInfo.name, roomImage: roomInfo.image, totalPrice }))
                      setShowPolicy(false)
                      router.push('/booking/checkout')
                    }}
                    className={cn(
                      'w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border-2',
                      policyAccepted
                        ? 'bg-white border-[#991b1b] text-[#991b1b] hover:bg-[#991b1b]/5 cursor-pointer'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    Tiếp tục thanh toán
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Confirm Remove Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {confirm && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setConfirm(null)}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto"
                onClick={e => e.stopPropagation()}
              >
                {/* Accent bar màu theo tông đội */}
                <div className="h-1.5 w-full" style={{ backgroundColor: confirm.palette.bg }} />

                <div className="p-6">
                  {/* Warning icon */}
                  <motion.div
                    className="flex justify-center mb-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.08, type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                      <AlertTriangle className="w-7 h-7 text-red-500" strokeWidth={2} />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-center text-base font-bold text-gray-900 mb-2">
                    Xoá khỏi giỏ hàng?
                  </h3>

                  {/* Body */}
                  <p className="text-center text-sm text-gray-500 mb-6 leading-relaxed">
                    Bạn có chắc muốn xoá{' '}
                    <span className="font-semibold" style={{ color: confirm.palette.bg }}>
                      {confirm.label}
                    </span>{' '}
                    khỏi giỏ hàng không?
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirm(null)}
                      className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Huỷ
                    </button>
                    <motion.button
                      onClick={handleConfirmRemove}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3 rounded-full text-white font-bold text-sm"
                      style={{ backgroundColor: confirm.palette.bg }}
                    >
                      Xác nhận xoá
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
