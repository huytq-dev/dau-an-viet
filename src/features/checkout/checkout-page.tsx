'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Clock,
  Gift,
  Home,
  Mail,
  MapPin,
  Users,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface CartItem {
  teamId: number
  teamName: string
  playerId: number
  price: number
}

interface CheckoutMeta {
  date: string
  roomId: string
  time: string
  roomName: string
  roomImage: string
  totalPrice: number
}

const WEEK_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${WEEK_DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function formatPrice(priceK: number) {
  return (priceK * 1000).toLocaleString('vi-VN') + 'đ'
}

const TEAM_PALETTE = [
  { bg: '#5f6830', light: '#b8be78', fg: '#f5f2dc' },
  { bg: '#2e6060', light: '#7ab2b2', fg: '#e4f4f4' },
  { bg: '#7a6010', light: '#c8a838', fg: '#fef8e0' },
  { bg: '#3a1f68', light: '#9070c0', fg: '#f0eaf8' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [meta, setMeta] = useState<CheckoutMeta | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successStep, setSuccessStep] = useState<1 | 2>(1)
  const [voucher, setVoucher] = useState<{ code: string; discountPercent: number } | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cartData = sessionStorage.getItem('checkout_cart')
    const metaData = sessionStorage.getItem('checkout_meta')
    if (cartData) setCart(JSON.parse(cartData))
    if (metaData) setMeta(JSON.parse(metaData))
  }, [])

  useEffect(() => {
    fetch('/api/voucher')
      .then((r) => r.json())
      .then((data) => {
        if (data.available) setVoucher({ code: data.code, discountPercent: data.discountPercent })
      })
      .catch(() => {})
  }, [])

  const discountedTotal = meta && voucher
    ? Math.round(meta.totalPrice * (1 - voucher.discountPercent / 100))
    : meta?.totalPrice ?? 0

  const cartByTeam = cart.reduce(
    (map, item) => {
      if (!map[item.teamId]) map[item.teamId] = []
      map[item.teamId].push(item)
      return map
    },
    {} as Record<number, CartItem[]>,
  )

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ và tên'
    if (!/^0\d{9}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ'
    if (!form.email.trim()) e.email = 'Vui lòng nhập email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSubmitted(true)
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleConfirmPayment = async () => {
    setPaymentConfirmed(true)
    setEmailSending(true)
    try {
      let finalDiscount = voucher
      if (voucher) {
        const claimRes = await fetch('/api/voucher', { method: 'POST' })
        if (!claimRes.ok) finalDiscount = null
      }

      const finalTotal = meta
        ? finalDiscount
          ? Math.round(meta.totalPrice * (1 - finalDiscount.discountPercent / 100))
          : meta.totalPrice
        : 0

      await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          roomName: meta?.roomName ?? '',
          date: meta ? formatDateDisplay(meta.date) : '',
          time: meta?.time ?? '',
          ticketCount: cart.length,
          totalPrice: formatPrice(finalTotal),
          voucherCode: finalDiscount?.code,
          discountPercent: finalDiscount?.discountPercent,
        }),
      })
    } catch (e) {
      console.error('Email send failed', e)
    } finally {
      setEmailSending(false)
      setSuccessStep(1)
      setShowSuccessModal(true)
    }
  }

  if (!meta) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">
          Không có dữ liệu đặt vé.{' '}
          <button onClick={() => router.push('/booking')} className="text-[#991b1b] underline">
            Quay lại
          </button>
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className="h-screen overflow-hidden bg-gray-50 flex flex-col"
        style={{ paddingTop: '5rem' }}
      >
        {/* Sub-header */}
        <div className="bg-[#7f1d1d] flex items-center h-14 px-4 shrink-0 z-20">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-bold text-sm sm:text-base text-white">
            Thanh Toán
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
          <span className="text-sm text-[#7f1d1d] font-semibold">
            {meta.roomName} · {meta.time}
          </span>
          <span className="text-sm text-gray-600">{formatDateDisplay(meta.date)}</span>
          <div className="ml-auto text-right">
            {voucher && (
              <span className="text-xs text-gray-400 line-through block">
                {formatPrice(meta.totalPrice)}
              </span>
            )}
            <span className="text-sm font-black text-[#991b1b]">
              {formatPrice(discountedTotal)}
            </span>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-row flex-1 min-h-0">
          {/* LEFT: Booking info + Cart */}
          <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col border-r border-gray-200 bg-white min-h-0">
            <div className="flex-1 overflow-y-auto">
              {/* Room card */}
              <div className="relative h-40 shrink-0">
                <Image
                  src={meta.roomImage || '/images/room1-mienn-dat-viet.png'}
                  alt={meta.roomName}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h2 className="text-white font-black text-lg leading-tight">{meta.roomName}</h2>
                </div>
              </div>

              {/* Room details */}
              <div className="p-4 space-y-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-[#991b1b] shrink-0" />
                  <span>
                    {meta.time} · {formatDateDisplay(meta.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-[#991b1b] shrink-0" />
                  <span>{cart.length} người chơi</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#991b1b] shrink-0" />
                  <span>Dấu Chân Việt · Đà Nẵng</span>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 border-b border-gray-100">
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <p className="text-xs font-bold text-amber-800 mb-1.5 uppercase tracking-wide">
                    Lưu ý
                  </p>
                  <ul className="text-sm text-amber-700 leading-relaxed space-y-1.5 list-none">
                    <li className="flex gap-2">
                      <span className="shrink-0 mt-0.5">·</span>
                      <span>Hủy trước <strong>48 giờ</strong>: hoàn 100% giá trị vé.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 mt-0.5">·</span>
                      <span>Đổi lịch trước <strong>24 giờ</strong>: miễn phí chuyển sang khung giờ khác.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 mt-0.5">·</span>
                      <span>Hủy/đổi lịch trong vòng <strong>24 giờ</strong>: không hỗ trợ hoàn tiền hoặc đổi lịch.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cart summary */}
              <div className="p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Giỏ hàng của tôi
                </p>
                <div className="space-y-3">
                  {Object.entries(cartByTeam).map(([teamId, items], idx) => {
                    const palette = TEAM_PALETTE[idx % TEAM_PALETTE.length]
                    const teamTotal = items.reduce((s, i) => s + i.price, 0)
                    return (
                      <div
                        key={teamId}
                        className="rounded-xl overflow-hidden border border-gray-100"
                      >
                        <div
                          className="px-3 py-2 text-xs font-bold"
                          style={{ backgroundColor: palette.bg, color: palette.fg }}
                        >
                          {items[0].teamName}
                        </div>
                        <div className="px-3 py-2 bg-white flex justify-between text-sm">
                          <span className="text-gray-600">{items.length} người</span>
                          <span className="font-bold text-gray-800">{formatPrice(teamTotal)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Total */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">Tổng cộng</span>
                  <div className="text-right">
                    {voucher && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(meta.totalPrice)}</p>
                    )}
                    <span className="text-lg font-black text-[#991b1b]">
                      {formatPrice(discountedTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form + QR */}
          <div
            className="hidden md:flex flex-col flex-1 min-h-0 overflow-y-auto p-4 lg:p-6 space-y-4"
            ref={formRef}
          >
            {!submitted ? (
              <>
                {/* Personal info */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Thông tin liên hệ</h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Điền thông tin để xác nhận đặt chỗ
                    </p>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300',
                        errors.name
                          ? 'border-rose-300 focus:ring-rose-200'
                          : 'border-gray-200 focus:ring-[#991b1b]/20 focus:border-[#991b1b]/50',
                      )}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="0901 234 567"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300',
                        errors.phone
                          ? 'border-rose-300 focus:ring-rose-200'
                          : 'border-gray-200 focus:ring-[#991b1b]/20 focus:border-[#991b1b]/50',
                      )}
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300',
                        errors.email
                          ? 'border-rose-300 focus:ring-rose-200'
                          : 'border-gray-200 focus:ring-[#991b1b]/20 focus:border-[#991b1b]/50',
                      )}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Auto-filled summary */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Số lượng vé</p>
                      <p className="font-black text-gray-800 text-xl">{cart.length}</p>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-3">
                      <p className="text-xs text-rose-400 mb-1">Thành giá</p>
                      {voucher && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(meta.totalPrice)}</p>
                      )}
                      <p className="font-black text-[#991b1b] text-xl">
                        {formatPrice(discountedTotal)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Voucher Banner */}
                {voucher && (
                  <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Gift className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-800 text-sm leading-snug">
                        🎉 Chúc mừng bạn thuộc top 100 người đặt vé đầu tiên!
                      </p>
                      <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                        Bạn được tặng mã giảm giá{' '}
                        <span className="font-black text-amber-800">{voucher.discountPercent}%</span>{' '}
                        cho lần đặt này. Đã áp dụng vào hoá đơn.
                      </p>
                      <p className="text-amber-600 text-xs mt-1 font-mono font-semibold">
                        Mã: {voucher.code}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold rounded-2xl text-sm tracking-wide transition-colors cursor-pointer shadow-md"
                >
                  Xác nhận & Xem mã QR
                </button>
              </>
            ) : (
              <>
                {/* QR section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-800 text-base mb-1">Mã QR chuyển khoản</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Quét mã để chuyển khoản · Sau khi hoàn tất sẽ hiển thị xác nhận
                  </p>

                  {/* QR box */}
                  <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden border-2 border-gray-200">
                    {/* Placeholder QR — thay bằng ảnh QR thật */}
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-40 h-40 text-gray-800">
                        <rect x="10" y="10" width="30" height="30" fill="currentColor" rx="2" />
                        <rect x="15" y="15" width="20" height="20" fill="white" rx="1" />
                        <rect x="18" y="18" width="14" height="14" fill="currentColor" rx="1" />
                        <rect x="60" y="10" width="30" height="30" fill="currentColor" rx="2" />
                        <rect x="65" y="15" width="20" height="20" fill="white" rx="1" />
                        <rect x="68" y="18" width="14" height="14" fill="currentColor" rx="1" />
                        <rect x="10" y="60" width="30" height="30" fill="currentColor" rx="2" />
                        <rect x="15" y="65" width="20" height="20" fill="white" rx="1" />
                        <rect x="18" y="68" width="14" height="14" fill="currentColor" rx="1" />
                        <rect x="45" y="10" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="45" y="22" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="10" y="45" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="22" y="45" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="45" y="45" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="57" y="45" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="69" y="45" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="81" y="45" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="45" y="57" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="57" y="57" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="69" y="57" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="45" y="69" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="57" y="69" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="69" y="69" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="81" y="69" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="45" y="81" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="57" y="81" width="8" height="8" fill="currentColor" rx="1" />
                      </svg>
                    </div>

                    {/* Payment confirmed overlay */}
                    {paymentConfirmed && (
                      <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-2">
                        <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={1.5} />
                        <p className="text-green-700 font-bold text-sm">Đã nhận thanh toán</p>
                      </div>
                    )}
                  </div>

                  {/* Bank info */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">Ngân hàng</span>
                      <span className="font-semibold text-gray-800">MB Bank</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">Số tài khoản</span>
                      <span className="font-semibold text-gray-800 font-mono">0905316737</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">Số tiền</span>
                      <div className="text-right">
                        {voucher && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(meta.totalPrice)}</p>
                        )}
                        <span className="font-black text-[#991b1b]">
                          {formatPrice(discountedTotal)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Nội dung</span>
                      <span className="font-semibold text-gray-800">
                        {form.name.toUpperCase()} {form.phone.slice(-4)}
                      </span>
                    </div>
                  </div>

                  {/* Simulate payment button (dev/demo) */}
                  {!paymentConfirmed && (
                    <button
                      onClick={handleConfirmPayment}
                      className="mt-4 w-full py-3 border-2 border-green-500 text-green-700 font-bold text-sm rounded-xl hover:bg-green-50 transition-colors cursor-pointer"
                    >
                      Tôi đã chuyển khoản thành công
                    </button>
                  )}

                  {paymentConfirmed && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-800 font-semibold text-center">
                        Đặt vé thành công! Chúng tôi sẽ liên hệ xác nhận qua SĐT.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile: scroll layout */}
        <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {!submitted ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-800 text-base">Thông tin liên hệ</h3>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Họ và tên <span className="text-[#991b1b]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none',
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50',
                  )}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Số điện thoại <span className="text-[#991b1b]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0901 234 567"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none',
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50',
                  )}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Số lượng vé</p>
                  <p className="font-black text-gray-800 text-lg">{cart.length}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Thành giá</p>
                  {voucher && (
                    <p className="text-xs text-gray-400 line-through">{formatPrice(meta.totalPrice)}</p>
                  )}
                  <p className="font-black text-[#991b1b] text-lg">
                    {formatPrice(discountedTotal)}
                  </p>
                </div>
              </div>

              {/* Voucher Banner (mobile) */}
              {voucher && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 text-xs leading-snug">
                      🎉 Chúc mừng bạn thuộc top 100 người đặt vé đầu tiên!
                    </p>
                    <p className="text-amber-700 text-xs mt-0.5">
                      Giảm <strong>{voucher.discountPercent}%</strong> · Đã áp dụng vào hoá đơn.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-[#991b1b] text-white font-black rounded-2xl text-sm transition-colors cursor-pointer"
              >
                Xác nhận & Xem mã QR
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 text-base mb-4">Mã QR chuyển khoản</h3>
              <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-40 h-40 text-gray-800">
                  <rect x="10" y="10" width="30" height="30" fill="currentColor" rx="2" />
                  <rect x="15" y="15" width="20" height="20" fill="white" rx="1" />
                  <rect x="18" y="18" width="14" height="14" fill="currentColor" rx="1" />
                  <rect x="60" y="10" width="30" height="30" fill="currentColor" rx="2" />
                  <rect x="65" y="15" width="20" height="20" fill="white" rx="1" />
                  <rect x="68" y="18" width="14" height="14" fill="currentColor" rx="1" />
                  <rect x="10" y="60" width="30" height="30" fill="currentColor" rx="2" />
                  <rect x="15" y="65" width="20" height="20" fill="white" rx="1" />
                  <rect x="18" y="68" width="14" height="14" fill="currentColor" rx="1" />
                </svg>
                {paymentConfirmed && (
                  <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-2">
                    <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={1.5} />
                    <p className="text-green-700 font-bold text-sm">Đã nhận thanh toán</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Ngân hàng</span>
                  <span className="font-semibold">MB Bank</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Số TK</span>
                  <span className="font-mono font-semibold">0905316737</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Số tiền</span>
                  <div className="text-right">
                    {voucher && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(meta.totalPrice)}</p>
                    )}
                    <span className="font-black text-[#991b1b]">{formatPrice(discountedTotal)}</span>
                  </div>
                </div>
              </div>
              {!paymentConfirmed && (
                <button
                  onClick={handleConfirmPayment}
                  className="mt-4 w-full py-3 border-2 border-green-500 text-green-700 font-bold text-sm rounded-xl cursor-pointer"
                >
                  Tôi đã chuyển khoản thành công
                </button>
              )}
              {paymentConfirmed && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                  <p className="text-sm text-green-800 font-semibold">
                    Đặt vé thành công! Chúng tôi sẽ liên hệ qua SĐT.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Success Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              key="success-backdrop"
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              key="success-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto">
                {/* Red accent top bar */}
                <div className="h-1.5 bg-[#991b1b] w-full" />

                <AnimatePresence mode="wait">
                  {successStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-7 flex flex-col items-center text-center"
                    >
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                        <Mail className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                      </div>

                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Thông báo
                      </p>
                      <h3 className="text-lg font-black text-gray-800 mb-2">Hóa đơn đã được gửi</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-7">
                        Hóa đơn đã được gửi đến email của bạn.
                        <br />
                        Vui lòng kiểm tra hộp thư đến.
                      </p>

                      <button
                        onClick={() => setSuccessStep(2)}
                        className="w-full py-3.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                      >
                        Tiếp tục
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-7 flex flex-col items-center text-center"
                    >
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-[#fef3c7] flex items-center justify-center mb-5">
                        <CheckCircle className="w-8 h-8 text-[#991b1b]" strokeWidth={1.5} />
                      </div>

                      <p className="text-xs font-bold text-[#991b1b] uppercase tracking-widest mb-2">
                        Dấu Chân Việt
                      </p>
                      <h3 className="text-lg font-black text-gray-800 mb-2 leading-snug">
                        Chúc bạn có một trải nghiệm tuyệt vời!
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-7">
                        Chúng tôi rất vui được đón tiếp bạn tại
                        <br />
                        <span className="font-semibold text-gray-700">Dấu Chân Việt</span>.
                      </p>

                      <button
                        onClick={() => router.push('/')}
                        className="w-full py-3.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Home className="w-4 h-4" />
                        Quay về trang chủ
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
