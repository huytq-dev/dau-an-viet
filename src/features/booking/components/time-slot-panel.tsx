"use client"

import { useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  CALENDAR_MAP,
  STATUS_BADGE_COLORS,
  STATUS_DOT_COLORS,
  STATUS_LABELS,
  formatPrice,
  getTimeSlotsForDate,
} from "../data/booking-data"

interface TimeSlotPanelProps {
  open: boolean
  selectedDate: string
  ticketCount: number
  timeFilter: string
  onClose: () => void
  onDateChange: (date: string) => void
}

const SHORT_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const SHORT_MONTHS = [
  'Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6',
  'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12',
]

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getSurroundingDates(center: string, count = 14): string[] {
  const d = new Date(center)
  return Array.from({ length: count + 5 }, (_, i) => {
    const nd = new Date(d)
    nd.setDate(d.getDate() - 3 + i)
    return toDateStr(nd)
  })
}

function filterByTime(
  timeSlots: ReturnType<typeof getTimeSlotsForDate>[0]['timeSlots'],
  timeFilter: string,
) {
  if (timeFilter === 'morning') return timeSlots.filter(ts => parseInt(ts.time) < 12)
  if (timeFilter === 'afternoon') return timeSlots.filter(ts => {
    const h = parseInt(ts.time)
    return h >= 12 && h < 17
  })
  if (timeFilter === 'evening') return timeSlots.filter(ts => parseInt(ts.time) >= 17)
  return timeSlots
}

// ── Animation variants ────────────────────────────────────────────────────────
const contentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], staggerChildren: 0.06 },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

const roomVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
}

const gridVariants: Variants = {
  show: { transition: { staggerChildren: 0.035 } },
}

const slotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 420, damping: 26 } },
}

export default function TimeSlotPanel({
  open,
  selectedDate,
  ticketCount,
  timeFilter,
  onClose,
  onDateChange,
}: TimeSlotPanelProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const surroundingDates = useMemo(() => getSurroundingDates(selectedDate), [selectedDate])

  const roomSchedules = useMemo(() => {
    const now = new Date()
    const todayStr = toDateStr(now)
    const isToday = selectedDate === todayStr
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const closingMinutes = 21 * 60 + 15 // 21:15

    return getTimeSlotsForDate(selectedDate).map(room => ({
      ...room,
      timeSlots: filterByTime(room.timeSlots, timeFilter).filter(slot => {
        if (!isToday) return true
        if (nowMinutes >= closingMinutes) return false
        const [h, m] = slot.time.split(':').map(Number)
        return h * 60 + m > nowMinutes
      }),
    }))
  }, [selectedDate, timeFilter])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const el = container.querySelector<HTMLElement>('[data-selected="true"]')
    if (!el) return
    const targetLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
    container.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }, [selectedDate, open])

  const scrollDates = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 232, behavior: 'smooth' })
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        className="max-w-xl w-[95vw] max-h-[90vh] p-0 gap-0 bg-[#f5f1e8] border-none overflow-hidden flex flex-col"
        aria-describedby={undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <DialogTitle className="font-bold text-base text-gray-900">Chọn Khung Giờ</DialogTitle>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date scroller */}
        <div className="relative flex items-center border-b border-gray-200 shrink-0 bg-white">
          <button
            onClick={() => scrollDates(-1)}
            className="shrink-0 z-10 h-full px-2 flex items-center text-gray-400 hover:text-[#7f1d1d] hover:bg-gray-50 transition-colors border-r border-gray-100"
            aria-label="Trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="absolute left-9 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-1.5 px-3 py-3 overflow-x-auto flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {surroundingDates.map(dateStr => {
              const d = new Date(dateStr)
              const todayStr = toDateStr(new Date())
              const hasData = CALENDAR_MAP.has(dateStr)
              const isPast = dateStr < todayStr
              const isAvailable = hasData && !isPast
              const isSelected = dateStr === selectedDate

              return (
                <button
                  key={dateStr}
                  data-selected={isSelected}
                  disabled={!isAvailable}
                  onClick={() => isAvailable && onDateChange(dateStr)}
                  className={cn(
                    'relative flex flex-col items-center px-3 py-2 rounded-xl min-w-[52px] shrink-0 transition-colors',
                    isSelected
                      ? 'text-white'
                      : isAvailable
                        ? 'hover:bg-gray-100 text-gray-800'
                        : 'text-gray-300 cursor-not-allowed opacity-40',
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="date-selected-pill"
                      className="absolute inset-0 rounded-xl bg-[#7f1d1d]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  {!isSelected && hasData && (
                    <span className="absolute inset-0 rounded-xl border border-gray-200" />
                  )}
                  <span className="relative text-[10px] font-medium z-10">{SHORT_DAYS[d.getDay()]}</span>
                  <span className="relative text-lg font-bold leading-tight z-10">{d.getDate()}</span>
                  <span className="relative text-[10px] z-10">{SHORT_MONTHS[d.getMonth()]}</span>
                </button>
              )
            })}
          </div>

          <div className="absolute right-9 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <button
            onClick={() => scrollDates(1)}
            className="shrink-0 z-10 h-full px-2 flex items-center text-gray-400 hover:text-[#7f1d1d] hover:bg-gray-50 transition-colors border-l border-gray-100"
            aria-label="Tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 shrink-0 bg-[#f5f1e8]">
          {(['good', 'selling-fast', 'sold-out', 'off-sale'] as const).map(s => (
            <span key={s} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className={cn('w-2.5 h-2.5 rounded-full', STATUS_DOT_COLORS[s])} />
              {STATUS_LABELS[s]}
            </span>
          ))}
        </div>

        {/* Room schedules */}
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate + timeFilter}
              variants={contentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-3 pt-3"
            >
              {roomSchedules.map(room => (
                <motion.div
                  key={room.roomId}
                  variants={roomVariants}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-bold text-[#7f1d1d]">{room.roomName}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{room.location}</p>
                  </div>

                  {room.timeSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Không có khung giờ trong buổi này
                    </p>
                  ) : (
                    <motion.div
                      variants={gridVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3"
                    >
                      {room.timeSlots.map(slot => {
                        const isDisabled = slot.status === 'sold-out' || slot.status === 'off-sale'
                        const handleSlotClick = () => {
                          if (isDisabled) return
                          onClose()
                          const params = new URLSearchParams({
                            date: selectedDate,
                            room: room.roomId,
                            time: slot.time,
                          })
                          router.push(`/booking/select?${params.toString()}`)
                        }

                        return (
                          <motion.button
                            key={slot.time}
                            variants={slotVariants}
                            whileHover={isDisabled ? {} : { y: -3, boxShadow: '0 6px 16px rgba(153,27,27,0.18)' }}
                            whileTap={isDisabled ? {} : { scale: 0.95 }}
                            disabled={isDisabled}
                            onClick={handleSlotClick}
                            className={cn(
                              'relative flex flex-col items-center pt-4 pb-2 px-1 rounded-lg border transition-all overflow-hidden',
                              isDisabled
                                ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100'
                                : 'cursor-pointer bg-white border-gray-200 hover:border-[#991b1b] hover:shadow-md hover:-translate-y-0.5',
                            )}
                          >
                            {slot.hasSurcharge && !isDisabled && (
                              <div className="absolute top-0 left-0 overflow-hidden w-8 h-8 pointer-events-none">
                                <div className="absolute bg-orange-500 text-white text-[5px] font-black w-[56px] text-center py-[2px] -left-[14px] top-[9px] -rotate-45 leading-tight">
                                  +20K
                                </div>
                              </div>
                            )}
                            <span className="font-bold text-xs text-gray-500">{slot.slotLabel}</span>
                            <span className="font-bold text-sm text-gray-900">{slot.time}</span>
                            <span className="text-[9px] text-gray-500 leading-tight text-center">
                              {formatPrice(slot.price)}/người
                            </span>
                            <div className={cn('absolute bottom-0 left-0 right-0 h-1', STATUS_BADGE_COLORS[slot.status])} />
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {roomSchedules.every(r => r.timeSlots.length === 0) && (
                <motion.div variants={roomVariants} className="text-center py-10 text-gray-400">
                  <p className="font-medium">Không có khung giờ phù hợp</p>
                  <p className="text-sm mt-1">Thử chọn bộ lọc khác hoặc ngày khác</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </DialogContent>
    </Dialog>
  )
}
