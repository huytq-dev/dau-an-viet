"use client"

import { useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { X, ChevronLeft } from "lucide-react"
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

function filterByTime(timeSlots: ReturnType<typeof getTimeSlotsForDate>[0]['timeSlots'], timeFilter: string) {
  if (timeFilter === 'morning') return timeSlots.filter(ts => parseInt(ts.time) < 12)
  if (timeFilter === 'afternoon') return timeSlots.filter(ts => {
    const h = parseInt(ts.time)
    return h >= 12 && h < 17
  })
  if (timeFilter === 'evening') return timeSlots.filter(ts => parseInt(ts.time) >= 17)
  return timeSlots
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
    return getTimeSlotsForDate(selectedDate).map(room => ({
      ...room,
      timeSlots: filterByTime(room.timeSlots, timeFilter),
    }))
  }, [selectedDate, timeFilter])

  // Auto-scroll selected date into view
  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current.querySelector<HTMLElement>('[data-selected="true"]')
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedDate, open])

  const selDate = new Date(selectedDate)
  const selDay = SHORT_DAYS[selDate.getDay()]
  const selMonth = SHORT_MONTHS[selDate.getMonth()]

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] p-0 gap-0 bg-[#f5f1e8] border-none overflow-hidden flex flex-col"
        aria-describedby={undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <DialogTitle className="font-bold text-base text-gray-900">
            Chọn Khung Giờ
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date scroller */}
        <div
          ref={scrollRef}
          className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-200 shrink-0 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {surroundingDates.map(dateStr => {
            const d = new Date(dateStr)
            const hasData = CALENDAR_MAP.has(dateStr)
            const isSelected = dateStr === selectedDate

            return (
              <button
                key={dateStr}
                data-selected={isSelected}
                disabled={!hasData}
                onClick={() => hasData && onDateChange(dateStr)}
                className={cn(
                  'flex flex-col items-center px-3 py-2 rounded-xl min-w-[52px] transition-colors shrink-0',
                  isSelected
                    ? 'bg-[#7f1d1d] text-white shadow-md'
                    : hasData
                      ? 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed',
                )}
              >
                <span className="text-[10px] font-medium">{SHORT_DAYS[d.getDay()]}</span>
                <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
                <span className="text-[10px]">{SHORT_MONTHS[d.getMonth()]}</span>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 shrink-0">
          {(['good', 'selling-fast', 'sold-out', 'off-sale'] as const).map(s => (
            <span key={s} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className={cn('w-2.5 h-2.5 rounded-full', STATUS_DOT_COLORS[s])} />
              {STATUS_LABELS[s]}
            </span>
          ))}
        </div>

        {/* Room schedules */}
        <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-3">
          {roomSchedules.map(room => (
            <div key={room.roomId} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-[#7f1d1d]">{room.roomName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{room.location}</p>
              </div>

              {room.timeSlots.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Không có khung giờ trong buổi này
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3">
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
                      <button
                        key={slot.time}
                        disabled={isDisabled}
                        onClick={handleSlotClick}
                        className={cn(
                          'relative flex flex-col items-center pt-4 pb-2 px-1 rounded-lg border transition-all overflow-hidden',
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100'
                            : 'cursor-pointer bg-white border-gray-200 hover:border-[#991b1b] hover:shadow-md hover:-translate-y-0.5',
                        )}
                      >
                        {/* Lowest price ribbon */}
                        {slot.isLowestPrice && !isDisabled && (
                          <div className="absolute top-0 left-0 overflow-hidden w-8 h-8 pointer-events-none">
                            <div className="absolute bg-[#991b1b] text-white text-[5px] font-black w-[56px] text-center py-[2px] -left-[14px] top-[9px] -rotate-45 leading-tight">
                              GIÁ THẤP
                            </div>
                          </div>
                        )}

                        <span className="font-bold text-sm text-gray-900">{slot.time}</span>
                        <span className="text-[9px] text-gray-500 leading-tight">
                          TỪ {formatPrice(slot.price)}
                        </span>

                        {/* Status indicator bar */}
                        <div className={cn(
                          'absolute bottom-0 left-0 right-0 h-1',
                          STATUS_BADGE_COLORS[slot.status]
                        )} />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          {roomSchedules.every(r => r.timeSlots.length === 0) && (
            <div className="text-center py-10 text-gray-400">
              <p className="font-medium">Không có khung giờ phù hợp</p>
              <p className="text-sm mt-1">Thử chọn bộ lọc khác hoặc ngày khác</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500 shrink-0">
          Đặt vé cho <strong className="text-gray-700">{ticketCount} người</strong> · Giá đã bao gồm phí đặt chỗ
        </div>
      </DialogContent>
    </Dialog>
  )
}
